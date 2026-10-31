/* =====================================================================
   The light separation worker — one instrument at a time.

   Spleeter (© Deezer, MIT): a separate U-Net per instrument on the
   magnitude spectrogram (frame 4096 / hop 1024, the first 1024 bins).
   Converted here straight from the released 4stems checkpoint, so each
   instrument is its own 39 MB file. They are loaded and released one by
   one, which is why this fits on a phone: the big model needs 340 MB at
   once, this needs about 80.

   Masks are combined the way Spleeter does: mask_i^2 / sum(mask^2).
   This file is turned into a Blob worker by PD.ai (it must not use PD).
   ===================================================================== */
const AISPL = function () {
  const N = 4096, HOP = 1024, F = 1024, T = 512, K = N / 2 + 1;
  let ort = null, base = '', man = null;
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
  const WIN = new Float64Array(N); for (let n = 0; n < N; n++) WIN[n] = .5 - .5 * Math.cos(2 * Math.PI * n / N);

  /** STFT of one channel -> {re, im} planes [frames][K] */
  function stft(x, frames) {
    const re = new Float64Array(N), im = new Float64Array(N);
    const R = new Float32Array(frames * K), I = new Float32Array(frames * K);
    for (let f = 0; f < frames; f++) {
      const o = f * HOP;
      for (let n = 0; n < N; n++) { re[n] = (x[o + n] || 0) * WIN[n]; im[n] = 0; }
      fft(re, im, false);
      for (let k = 0; k < K; k++) { R[f * K + k] = re[k]; I[f * K + k] = im[k]; }
    }
    return { R, I };
  }
  function istft(R, I, frames, len) {
    const re = new Float64Array(N), im = new Float64Array(N);
    const out = new Float32Array(len), env = new Float64Array(len);
    for (let f = 0; f < frames; f++) {
      re.fill(0); im.fill(0);
      for (let k = 0; k < K; k++) { re[k] = R[f * K + k]; im[k] = I[f * K + k]; }
      for (let k = 1; k < N / 2; k++) { re[N - k] = re[k]; im[N - k] = -im[k]; }
      fft(re, im, true);
      const o = f * HOP;
      for (let n = 0; n < N; n++) { const i = o + n; if (i < len) { out[i] += re[n] / N * WIN[n]; env[i] += WIN[n] * WIN[n]; } }
    }
    for (let i = 0; i < len; i++) if (env[i] > 1e-8) out[i] /= env[i];
    return out;
  }

  async function fetchCached(url, onBytes) {
    let cache = null;
    try { cache = await caches.open('panduri-spl-v1'); const hit = await cache.match(url); if (hit) { const b = await hit.arrayBuffer(); onBytes && onBytes(b.byteLength, b.byteLength); return b; } } catch (_) {}
    const r = await fetch(url); if (!r.ok) throw new Error('download ' + r.status);
    const total = +(r.headers.get('Content-Length') || 0), reader = r.body.getReader(), chunks = [];
    let got = 0;
    for (;;) { const { done, value } = await reader.read(); if (done) break; chunks.push(value); got += value.length; onBytes && onBytes(got, total); }
    const out = new Uint8Array(got); let o = 0; chunks.forEach(c => { out.set(c, o); o += c.length; });
    try { cache && await cache.put(url, new Response(out.slice().buffer)); } catch (_) {}
    return out.buffer;
  }

  async function load(b) {
    base = b;
    importScripts(base + 'ort/ort.min.js');
    ort = self.ort; ort.env.wasm.wasmPaths = base + 'ort/'; ort.env.wasm.numThreads = 1;
    man = JSON.parse(new TextDecoder().decode(await fetchCached(base + 'spl/manifest.json')));
    post('ready', { sources: man.sources, sizes: man.sizes });
  }

  /** separate: one instrument at a time, each model released before the next is fetched */
  async function separate(L, R, want) {
    const len = L.length;
    const frames = Math.max(T, Math.ceil((len + N) / HOP));
    const padded = frames * HOP + N;
    const ch = [L, R].map(src => { const a = new Float32Array(padded); a.set(src, N); return a; });   // spleeter's leading frame of zeros
    const SP = ch.map(c => stft(c, frames));
    const mag = new Float32Array(2 * frames * F);
    for (let c = 0; c < 2; c++) for (let f = 0; f < frames; f++) for (let k = 0; k < F; k++) {
      const re = SP[c].R[f * K + k], im = SP[c].I[f * K + k];
      mag[(c * frames + f) * F + k] = Math.sqrt(re * re + im * im);
    }
    const names = want && want.length ? want : man.sources;
    const masks = {};
    for (let si = 0; si < names.length; si++) {
      const nm = names[si];
      post('stage', { s: 'dl', name: nm, i: si, n: names.length });
      const buf = await fetchCached(base + 'spl/' + man.files[nm], (got, total) => post('dl', { got, total, name: nm, i: si, n: names.length }));
      post('stage', { s: 'run', name: nm, i: si, n: names.length });
      let sess = await ort.InferenceSession.create(new Uint8Array(buf), { executionProviders: ['wasm'], graphOptimizationLevel: 'all' });
      const m = new Float32Array(2 * frames * F);
      const seg = new Float32Array(2 * T * F);
      for (let f0 = 0; f0 < frames; f0 += T) {
        const n2 = Math.min(T, frames - f0);
        seg.fill(0);
        for (let c = 0; c < 2; c++) seg.set(mag.subarray((c * frames + f0) * F, (c * frames + f0 + n2) * F), c * T * F);
        const out = await sess.run({ X: new ort.Tensor('float32', seg, [1, 2, T, F]) });
        const y = out[Object.keys(out)[0]].data;
        for (let c = 0; c < 2; c++) m.set(y.subarray(c * T * F, c * T * F + n2 * F), (c * frames + f0) * F);
        post('progress', { name: nm, i: si, n: names.length, done: Math.min(frames, f0 + T), total: frames });
      }
      masks[nm] = m;
      try { await sess.release(); } catch (_) {}
      sess = null;
      await new Promise(r => setTimeout(r, 0));   // let the model go before the next one arrives
    }
    // spleeter's ratio mask: mask^2 / sum(mask^2), everything above bin F set to zero
    const den = new Float32Array(2 * frames * F);
    names.forEach(nm => { const m = masks[nm]; for (let i = 0; i < den.length; i++) den[i] += m[i] * m[i]; });
    for (let i = 0; i < den.length; i++) den[i] += 1e-10;
    const outs = [];
    names.forEach(nm => {
      const m = masks[nm], Rr = new Float32Array(frames * K), Ii = new Float32Array(frames * K), got = [];
      for (let c = 0; c < 2; c++) {
        Rr.fill(0); Ii.fill(0);
        for (let f = 0; f < frames; f++) for (let k = 0; k < F; k++) {
          const i = (c * frames + f) * F + k, g = m[i] * m[i] / den[i];
          Rr[f * K + k] = SP[c].R[f * K + k] * g; Ii[f * K + k] = SP[c].I[f * K + k] * g;
        }
        const y = istft(Rr, Ii, frames, padded);
        got.push(y.slice(N, N + len));
      }
      outs.push({ name: nm, L: got[0], R: got[1] });
      masks[nm] = null;
    });
    return outs;
  }

  self.onmessage = async e => {
    const m = e.data;
    try {
      if (m.cmd === 'load') await load(m.base);
      else if (m.cmd === 'separate') {
        const outs = await separate(m.L, m.R, m.want);
        post('done', { stems: outs.map(o => [o.L, o.R]), sources: outs.map(o => o.name) },
          outs.reduce((a, o) => a.concat([o.L.buffer, o.R.buffer]), []));
      }
    } catch (err) { post('error', { msg: String(err && err.message || err) }); }
  };
};
