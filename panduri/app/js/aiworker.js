/* =====================================================================
   AI separation worker (runs off the main thread).
   Demucs v4 (htdemucs, © Meta, MIT) exported to ONNX with the STFT moved
   outside the network (sevagh/demucs.onnx, MIT). This worker does what
   the PyTorch code does around the network, exactly:
     segments of 7.8 s (343 980 samples) with 25 % overlap and triangular
     cross-fade weights · per segment: STFT (4096 / hop 1024, hann,
     normalised, demucs padding) → ONNX Runtime Web → inverse STFT of the
     spectral branch + the time branch.
   The model is downloaded once (weights stored as float16, rebuilt to
   float32 here) and kept in the browser's cache.
   This file is turned into a Blob worker by PD.ai (it must not use PD).
   ===================================================================== */
const AIW = function () {
  const N = 4096, HOP = 1024, NB = 2048, SEG = 343980, LE = Math.ceil(SEG / HOP), PADS = HOP / 2 * 3, FR = LE + 4;   // 336 frames kept, 340 with the edges
  let ort = null, sess = null, man = null, base = '';
  const post = (type, o, tr) => self.postMessage(Object.assign({ type }, o || {}), tr || []);
  /* ---------- FFT (radix-2, complex, in place) ---------- */
  const COS = new Float64Array(N / 2), SIN = new Float64Array(N / 2), REV = new Uint32Array(N);
  for (let i = 0; i < N / 2; i++) { COS[i] = Math.cos(2 * Math.PI * i / N); SIN[i] = Math.sin(2 * Math.PI * i / N); }
  for (let i = 0, b = Math.log2(N); i < N; i++) { let r = 0; for (let k = 0; k < b; k++) r |= ((i >> k) & 1) << (b - 1 - k); REV[i] = r; }
  function fft(re, im, inv) {
    for (let i = 0; i < N; i++) { const j = REV[i]; if (j > i) { let t = re[i]; re[i] = re[j]; re[j] = t; t = im[i]; im[i] = im[j]; im[j] = t; } }
    for (let size = 2; size <= N; size <<= 1) {
      const half = size >> 1, step = N / size;
      for (let i = 0; i < N; i += size) for (let j = 0, k = 0; j < half; j++, k += step) {
        const c = COS[k], s = inv ? SIN[k] : -SIN[k], a = i + j, b2 = a + half;
        const tr = re[b2] * c - im[b2] * s, ti = re[b2] * s + im[b2] * c;
        re[b2] = re[a] - tr; im[b2] = im[a] - ti; re[a] += tr; im[a] += ti;
      }
    }
  }
  const WIN = new Float64Array(N); for (let n = 0; n < N; n++) WIN[n] = .5 - .5 * Math.cos(2 * Math.PI * n / N);   // torch.hann_window (periodic)
  const reflect = (x, i) => { const L = x.length; while (i < 0 || i >= L) { if (i < 0) i = -i; if (i >= L) i = 2 * (L - 1) - i; } return x[i]; };
  /** demucs standalone_spec + magnitude (complex as channels) for one channel → writes [re, im] planes [NB][LE] */
  function spec(x, outRe, outIm) {
    // demucs pad (reflect) then torch.stft centre pad (reflect): one combined index map
    const L1 = LE * HOP + 2 * PADS;   // after the demucs pad
    const x1 = new Float32Array(L1); for (let i = 0; i < L1; i++) x1[i] = reflect(x, i - PADS);
    const re = new Float64Array(N), im = new Float64Array(N), sc = 1 / Math.sqrt(N);
    for (let t = 2; t < 2 + LE; t++) {
      const st = t * HOP - N / 2;
      for (let n = 0; n < N; n++) { re[n] = reflect(x1, st + n) * WIN[n]; im[n] = 0; }
      fft(re, im, false);
      for (let f = 0; f < NB; f++) { outRe[f * LE + (t - 2)] = re[f] * sc; outIm[f * LE + (t - 2)] = im[f] * sc; }
    }
  }
  /** demucs standalone_ispec for one channel from planes [NB][LE] → SEG samples (added into out) */
  function ispec(zr, zi, out) {
    const L = N + (FR - 1) * HOP, ola = new Float64Array(L), env = new Float64Array(L), re = new Float64Array(N), im = new Float64Array(N), sc = Math.sqrt(N) / N;
    for (let t = 0; t < FR; t++) {
      const tt = t - 2;   // two empty frames on each side
      re.fill(0); im.fill(0);
      if (tt >= 0 && tt < LE) for (let f = 0; f < NB; f++) { re[f] = zr[f * LE + tt]; im[f] = zi[f * LE + tt]; }
      for (let f = 1; f < N / 2; f++) { re[N - f] = re[f]; im[N - f] = -im[f]; }   // Hermitian (bin NB = Nyquist is zero)
      fft(re, im, true);
      const o = t * HOP; for (let n = 0; n < N; n++) { ola[o + n] += re[n] * sc * WIN[n]; env[o + n] += WIN[n] * WIN[n]; }
    }
    // torch.istft(center) drops N/2 at the start; demucs then drops its own pad
    for (let n = 0; n < SEG; n++) { const k = n + N / 2 + PADS, e = env[k]; out[n] += e > 1e-11 ? ola[k] / e : 0; }
  }
  /* ---------- float16 → float32 ---------- */
  const H2F = (() => { const t = new Float32Array(65536); for (let h = 0; h < 65536; h++) { const s = h & 0x8000 ? -1 : 1, e = (h >> 10) & 31, m = h & 1023; t[h] = e === 0 ? s * Math.pow(2, -14) * (m / 1024) : e === 31 ? (m ? NaN : s * Infinity) : s * Math.pow(2, e - 15) * (1 + m / 1024); } return t; })();
  async function fetchCached(url, onBytes) {
    let cache = null; try { cache = await caches.open('panduri-ai-v1'); const hit = await cache.match(url); if (hit) { const b = await hit.arrayBuffer(); onBytes && onBytes(b.byteLength); return b; } } catch (_) {}
    const r = await fetch(url); if (!r.ok) throw new Error('download ' + r.status + ' ' + url.split('/').pop());
    const reader = r.body.getReader(), chunks = []; let got = 0;
    for (;;) { const { done, value } = await reader.read(); if (done) break; chunks.push(value); got += value.length; onBytes && onBytes(value.length); }
    const out = new Uint8Array(got); let o = 0; chunks.forEach(c => { out.set(c, o); o += c.length; });
    try { cache && await cache.put(url, new Response(out.slice().buffer)); } catch (_) {}
    return out.buffer;
  }
  async function load(b, prefer, dir) {
    base = b; const M = base + (dir || 'model') + '/';
    importScripts(base + 'ort/' + (prefer === 'webgpu' ? 'ort.webgpu.min.js' : 'ort.min.js'));
    ort = self.ort; ort.env.wasm.wasmPaths = base + 'ort/'; ort.env.wasm.numThreads = 1;
    man = JSON.parse(new TextDecoder().decode(await fetchCached(M + 'manifest.json')));
    const total = man.blobSize; let got = 0, last = 0;
    const tick = n => { got += n; const now = Date.now(); if (now - last > 200) { last = now; post('dl', { got, total }); } };
    const graph = new Uint8Array(await fetchCached(M + 'graph.onnx'));
    let blob = new Uint8Array(total); let o = 0;
    for (const p of man.parts) { const b2 = new Uint8Array(await fetchCached(M + p, tick)); blob.set(b2, o); o += b2.length; }
    post('dl', { got: total, total });
    post('stage', { s: 'unpack' });
    const data = new Uint8Array(man.dataSize);
    for (const [off, ln, p, bl, f16] of man.tensors) {
      if (!f16) { data.set(blob.subarray(p, p + bl), off); continue; }
      const h = new Uint16Array(blob.buffer, p, bl / 2), f = new Float32Array(data.buffer, off, ln / 4); for (let i = 0; i < h.length; i++) f[i] = H2F[h[i]];
    }
    blob = null;   // let the packed copy go before the runtime asks for its own memory
    await new Promise(r => setTimeout(r, 0));
    post('stage', { s: 'init' });
    const eps = prefer === 'webgpu' ? ['webgpu', 'wasm'] : ['wasm'];
    sess = await ort.InferenceSession.create(graph, { executionProviders: eps, externalData: [{ path: 'htdemucs.data', data }], graphOptimizationLevel: 'all' });
    post('ready', { ep: prefer, inputs: sess.inputNames, outputs: sess.outputNames });
  }
  /** separate a stereo mix (Float32Array L, R at 44.1 kHz) → 4 sources × 2 channels */
  async function separate(L, R, from, to) {
    const len = to - from, S = man.sources.length, outs = [];
    for (let s = 0; s < S; s++) outs.push([new Float32Array(len), new Float32Array(len)]);
    const wsum = new Float32Array(len), stride = Math.floor(.75 * SEG), W = new Float32Array(SEG);
    for (let i = 0; i < SEG; i++) W[i] = i < SEG / 2 ? (i + 1) : (SEG - i); let wm = 0; for (let i = 0; i < SEG; i++) wm = Math.max(wm, W[i]); for (let i = 0; i < SEG; i++) W[i] /= wm;
    const offsets = []; for (let o = 0; o < len; o += stride) offsets.push(o);
    const mixT = new Float32Array(2 * SEG), mag = new Float32Array(4 * NB * LE), zr = new Float32Array(NB * LE), zi = new Float32Array(NB * LE), seg = [new Float32Array(SEG), new Float32Array(SEG)], scratch = new Float32Array(SEG);
    const t0 = Date.now();
    for (let k = 0; k < offsets.length; k++) {
      const off = offsets[k], clen = Math.min(SEG, len - off), delta = SEG - clen, start = off - Math.floor(delta / 2);
      for (let c = 0; c < 2; c++) { const src = c ? R : L, d = seg[c]; for (let i = 0; i < SEG; i++) { const j = from + start + i; d[i] = j >= from && j < to ? src[j] : 0; } mixT.set(d, c * SEG); }
      for (let c = 0; c < 2; c++) { spec(seg[c], zr, zi); mag.set(zr, (c * 2) * NB * LE); mag.set(zi, (c * 2 + 1) * NB * LE); }
      const feeds = {}; feeds[sess.inputNames[0]] = new ort.Tensor('float32', mixT, [1, 2, SEG]); feeds[sess.inputNames[1]] = new ort.Tensor('float32', mag, [1, 4, NB, LE]);
      const res = await sess.run(feeds);
      let ox = null, oxt = null; for (const n of sess.outputNames) { const tns = res[n]; if (tns.dims.length === 5) ox = tns.data; else oxt = tns.data; }
      const tr = Math.floor(delta / 2);
      for (let s = 0; s < S; s++) for (let c = 0; c < 2; c++) {
        const tmp = scratch; tmp.set(oxt.subarray((s * 2 + c) * SEG, (s * 2 + c + 1) * SEG));
        const pr = ((s * 2 + c) * 2) * NB * LE, pi = ((s * 2 + c) * 2 + 1) * NB * LE;
        ispec(ox.subarray(pr, pr + NB * LE), ox.subarray(pi, pi + NB * LE), tmp);
        const out = outs[s][c]; for (let i = 0; i < clen; i++) out[off + i] += W[i] * tmp[tr + i];
      }
      for (let i = 0; i < clen; i++) wsum[off + i] += W[i];
      const el = (Date.now() - t0) / 1000; post('progress', { done: k + 1, total: offsets.length, eta: el / (k + 1) * (offsets.length - k - 1) });
    }
    for (let s = 0; s < S; s++) for (let c = 0; c < 2; c++) { const o = outs[s][c]; for (let i = 0; i < len; i++) o[i] /= wsum[i] || 1; }
    return outs;   // the caller transfers these out, so nothing is copied again
  }
  self.onmessage = async e => {
    const m = e.data;
    try {
      if (m.cmd === 'load') { await load(m.base, m.prefer, m.dir); }
      else if (m.cmd === 'ping') post('pong', {});
      else if (m.cmd === 'separate') { const outs = await separate(m.L, m.R, m.from || 0, m.to || m.L.length); post('done', { stems: outs, sources: man.sources }, outs.flat().map(a => a.buffer)); }
      else if (m.cmd === 'selftest') { const x = new Float32Array(SEG); for (let i = 0; i < SEG; i++) x[i] = Math.sin(i * .01) * .5 + Math.sin(i * .37) * .2; const zr = new Float32Array(NB * LE), zi = new Float32Array(NB * LE); spec(x, zr, zi); const y = new Float32Array(SEG); ispec(zr, zi, y); let err = 0, mx = 0; for (let i = 0; i < SEG; i++) { err = Math.max(err, Math.abs(x[i] - y[i])); mx = Math.max(mx, Math.abs(x[i])); } post('selftest', { err, mx }); }
    } catch (err) { post('error', { msg: String(err && err.message || err) }); }
  };
};
