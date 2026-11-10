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
  let chunkIndex = 0, chunkCount = 1;
  const post = (type, o, tr) => {
    if (o && o.i != null && o.n != null) o = Object.assign({}, o, { i: chunkIndex * o.n + o.i, n: chunkCount * o.n });
    self.postMessage(Object.assign({ type }, o || {}), tr || []);
  };

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
    importScripts(base + 'ort131/ort.wasm.min.js');   // ONNX Runtime Web 1.31.1, WASM only (see aiworker.js)
    ort = self.ort; ort.env.wasm.wasmPaths = base + 'ort131/';
    ort.env.wasm.numThreads = self.crossOriginIsolated ? Math.max(1, Math.min(8, (navigator.hardwareConcurrency || 4) - 1)) : 1;
    man = JSON.parse(new TextDecoder().decode(await fetchCached(base + 'spl/manifest.json')));
    post('ready', { sources: man.sources, sizes: man.sizes });
  }

  /** separate: one instrument at a time, each model released before the next is fetched.
      The spectrum is made one model segment (T frames) at a time, when it is needed, and dropped again.
      Holding the whole song's complex spectrum for both channels, its magnitudes, the mask sum and the
      masked spectrum all at once came to ~300 MB per minute of audio (1.2 GB for a 4-minute song, before
      the model): a whole song could not fit in a phone. Only the masks and the stems themselves are kept
      for the whole song now. The arithmetic and its order are the same, so the stems are identical. */
  async function separateChunk(L, R, want) {
    const len = L.length;
    const frames = Math.max(T, Math.ceil((len + N) / HOP));
    const re = new Float64Array(N), im = new Float64Array(N), SR_ = new Float32Array(T * K), SI_ = new Float32Array(T * K);
    /** the complex spectrum of frames f0 … f0+n2-1 of one channel (stored as float32, as before). The signal is read
        as spleeter pads it — a leading frame of zeros, zeros after the end — without copying it. */
    const spec = (c, f0, n2) => {
      const x = c ? R : L;
      for (let f = 0; f < n2; f++) {
        const o = (f0 + f) * HOP - N;
        for (let n = 0; n < N; n++) { const j = o + n; re[n] = (j >= 0 && j < len ? x[j] || 0 : 0) * WIN[n]; im[n] = 0; }
        fft(re, im, false);
        for (let k = 0; k < K; k++) { SR_[f * K + k] = re[k]; SI_[f * K + k] = im[k]; }
      }
    };
    const names = want && want.length ? want : man.sources;
    const masks = {};
    const seg = new Float32Array(2 * T * F);
    for (let si = 0; si < names.length; si++) {
      const nm = names[si];
      post('stage', { s: 'dl', name: nm, i: si, n: names.length });
      const buf = await fetchCached(base + 'spl/' + man.files[nm], (got, total) => post('dl', { got, total, name: nm, i: si, n: names.length }));
      post('stage', { s: 'run', name: nm, i: si, n: names.length });
      let sess = await ort.InferenceSession.create(new Uint8Array(buf), { executionProviders: ['wasm'], graphOptimizationLevel: 'all' });
      const m = new Float32Array(2 * frames * F);
      for (let f0 = 0; f0 < frames; f0 += T) {
        const n2 = Math.min(T, frames - f0);
        seg.fill(0);
        for (let c = 0; c < 2; c++) {
          spec(c, f0, n2);
          for (let f = 0; f < n2; f++) for (let k = 0; k < F; k++) { const a = SR_[f * K + k], b = SI_[f * K + k]; seg[c * T * F + f * F + k] = Math.sqrt(a * a + b * b); }
        }
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
    // spleeter's ratio mask: mask^2 / sum(mask^2), everything above bin F set to zero; overlap-added straight into the stems
    const ms = names.map(nm => masks[nm]), outs = names.map(nm => ({ name: nm, L: new Float32Array(len), R: new Float32Array(len) }));
    const den = new Float32Array(1);
    for (let c = 0; c < 2; c++) {
      for (let f0 = 0; f0 < frames; f0 += T) {
        const n2 = Math.min(T, frames - f0);
        spec(c, f0, n2);
        for (let f = 0; f < n2; f++) {
          const fr = f0 + f, mo = (c * frames + fr) * F, o = fr * HOP - N;
          for (let si = 0; si < ms.length; si++) {
            const m = ms[si], y = c ? outs[si].R : outs[si].L;
            re.fill(0); im.fill(0);
            for (let k = 0; k < F; k++) {
              den[0] = 0; for (let q = 0; q < ms.length; q++) den[0] += ms[q][mo + k] * ms[q][mo + k];
              den[0] += 1e-10;
              const g = m[mo + k] * m[mo + k] / den[0];
              re[k] = Math.fround(SR_[f * K + k] * g); im[k] = Math.fround(SI_[f * K + k] * g);
            }
            for (let k = 1; k < N / 2; k++) { re[N - k] = re[k]; im[N - k] = -im[k]; }
            fft(re, im, true);
            for (let n = 0; n < N; n++) { const i = o + n; if (i >= 0 && i < len) y[i] += re[n] / N * WIN[n]; }
          }
        }
        await new Promise(r => setTimeout(r, 0));
      }
    }
    // the overlap-add normaliser, worked out per sample instead of stored for the whole song
    for (let i = 0; i < len; i++) {
      const p = i + N; let e = 0;
      for (let fr = Math.max(0, Math.ceil((p - N + 1) / HOP)); fr <= Math.min(frames - 1, Math.floor(p / HOP)); fr++) { const w = WIN[p - fr * HOP]; e += w * w; }
      if (e > 1e-8) for (const o of outs) { o.L[i] /= e; o.R[i] /= e; }
    }
    names.forEach(nm => { masks[nm] = null; });
    return outs;
  }

  // Keep masks bounded for full songs. Two seconds of context surround each
  // chunk; only its centre is retained so every input sample is represented.
  async function separate(L, R, want) {
    if (!L.length || L.length !== R.length) throw new Error('Empty or invalid stereo audio');
    const step = 20 * 44100, context = 2 * 44100;
    chunkCount = Math.ceil(L.length / step); chunkIndex = 0;
    if (chunkCount === 1) return separateChunk(L, R, want);
    const names = want && want.length ? want : man.sources;
    const outs = names.map(name => ({ name, L: new Float32Array(L.length), R: new Float32Array(L.length) }));
    for (let start = 0; start < L.length; start += step) {
      const end = Math.min(L.length, start + step), a = Math.max(0, start - context), b = Math.min(L.length, end + context);
      const part = await separateChunk(L.subarray(a, b), R.subarray(a, b), want);
      for (let i = 0; i < outs.length; i++) {
        outs[i].L.set(part[i].L.subarray(start - a, end - a), start);
        outs[i].R.set(part[i].R.subarray(start - a, end - a), start);
      }
      chunkIndex++;
    }
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
