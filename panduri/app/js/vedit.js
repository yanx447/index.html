/* =====================================================================
   PD.vedit — a clip is edited before it is posted: cut and trimmed, the
   sound on its own (waveform, noise removal, EQ, compressor, reverb, delay),
   colour filters, and the person cut out of the background with something
   else put behind them.
   It all runs on the device: WebGL draws the picture, Web Audio the sound, and
   the result is recorded again at the clip's own resolution. A clip that is
   not changed is never re-encoded — it is posted exactly as it was filmed.
   ===================================================================== */
'use strict';
PD.i18n.add({
  've.clip': ['კლიპი', 'Clip'], 've.sound': ['ხმა', 'Sound'], 've.filters': ['ფილტრები', 'Filters'], 've.bg': ['ფონი', 'Background'], 've.done': ['მზადაა', 'Done'],
  've.split': ['გაჭრა', 'Split'], 've.del': ['ნაწილის წაშლა', 'Delete part'], 've.reset': ['თავიდან', 'Reset'], 've.len': ['ხანგრძლივობა: {t}', 'Length: {t}'],
  've.clipHint': ['კიდეები შიგნით გადაწიე — ჩაიჭრება, გარეთ გამოწიე — დაბრუნდება. „გაჭრა" ყოფს კლიპს იქ, სადაც თეთრი ხაზია; შემდეგ ზედმეტ ნაწილს წაშლი.', 'Drag an edge in to trim it, or back out to bring it back. “Split” cuts the clip at the white line; then delete the part you do not want.'],
  've.oneLeft': ['ბოლო ნაწილს ვერ წაშლი.', 'The last part cannot be deleted.'], 've.tooShort': ['აქ ვერ გაიჭრება — ნაწილი ძალიან მოკლე იქნება.', 'Cannot split here — a part would be too short.'],
  've.vol': ['ხმის სიმაღლე', 'Volume'], 've.low': ['დაბლები', 'Low'], 've.mid': ['შუა', 'Mid'], 've.high': ['მაღლები', 'High'], 've.comp': ['კომპრესორი', 'Compressor'],
  've.rev': ['რევერბი', 'Reverb'], 've.delay': ['დილეი', 'Delay'], 've.dtime': ['დილეის დრო', 'Delay time'], 've.eq': ['ეკვალაიზერი (EQ)', 'Equaliser (EQ)'], 've.fx': ['ეფექტები', 'Effects'],
  've.dn': ['ხმაურის მოშლა', 'Noise removal'], 've.dnAmt': ['სიძლიერე', 'Strength'],
  've.dnHint': ['ასუფთავებს მუდმივ ხმაურს — შიშინს, ქარის გუგუნს, მანქანების ხმაურს, ზუზუნს — და ძალიან დაბალ ხმებს ჭრის. მოკლე ხმებს (მაგალითად სიმზე თითის გასრიალებას) ბოლომდე ვერ შლის.', 'Cleans steady noise — hiss, wind rumble, traffic, hum — and cuts the very lowest sounds. Short sounds (a finger squeaking on a string, say) are not fully removed.'],
  've.dnWork': ['მუშავდება… {p}%', 'Working… {p}%'],
  've.longAudio': ['ხმაურის მოშლა და ტალღის ფორმა 3 წუთამდე ვიდეოზე მუშაობს (უფრო გრძელი ტელეფონის მეხსიერებას ვერ ეტევა). EQ და ეფექტები მუშაობს.', 'Noise removal and the waveform work on videos up to 3 minutes (longer ones do not fit in a phone’s memory). EQ and effects work.'],
  've.noAudio': ['ამ ვიდეოს ხმა ამ მოწყობილობამ ვერ წაიკითხა: EQ და ეფექტები მუშაობს, ხმაურის მოშლა და ტალღის ფორმა — არა.', 'This device could not read the video’s sound: EQ and effects work, noise removal and the waveform do not.'],
  've.f.none': ['ორიგინალი', 'Original'], 've.f.cine': ['სინემატიკური', 'Cinematic'], 've.f.noir': ['შავ-თეთრი', 'Black & white'], 've.f.warm': ['თბილი', 'Warm'], 've.f.cool': ['ცივი', 'Cool'],
  've.f.vint': ['ვინტაჟი', 'Vintage'], 've.f.vivid': ['მკვეთრი', 'Vivid'], 've.f.moody': ['ბნელი', 'Moody'], 've.amount': ['სიძლიერე', 'Strength'],
  've.b.none': ['არ შეიცვალოს', 'Keep'], 've.b.black': ['შავი ფონი', 'Black'], 've.b.blur': ['ბუნდოვანი', 'Blurred'], 've.b.image': ['სურათი ან GIF', 'Picture or GIF'], 've.b.video': ['ვიდეო · 5 წმ loop', 'Video · 5 s loop'],
  've.bgLoad': ['ფონის ამომჭრელი იტვირთება… (მხოლოდ პირველად, ~20 MB)', 'Loading the background cutter… (first time only, ~20 MB)'],
  've.bgFail': ['ფონის ამომჭრელი ვერ ჩაიტვირთა — შეამოწმე ინტერნეტი და სცადე თავიდან.', 'The background cutter could not be loaded — check the connection and try again.'],
  've.bgHint': ['ამოიჭრება ადამიანი, დანარჩენი ყველაფერი ფონად ითვლება. ინსტრუმენტის ის ნაწილი, რომელიც სხეულს შორდება, შეიძლება ფონს გაჰყვეს. ყველაფერი ამ მოწყობილობაზე ხდება.', 'The person is cut out; everything else counts as background. Parts of the instrument held away from the body may go with the background. It all happens on this device.'],
  've.gifBad': ['ეს ფაილი ვერ წაიკითხა.', 'This file could not be read.'],
  've.rendering': ['ვიდეო მზადდება… {p}%', 'Making the video… {p}%'], 've.edited': ['დამუშავდება იმავე გარჩევადობით', 'will be made again at the same resolution'],
  've.renderFail': ['ვიდეო ამ მოწყობილობაზე ვერ დამუშავდა.', 'The video could not be made on this device.'],
  've.play': ['დაკვრა / პაუზა', 'Play / pause']
});

PD.vedit = (() => {
  const h = PD.h, ic = PD.ic;
  const I = d => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>';
  const IC = {
    clip: I('<circle cx="6" cy="6.5" r="2.6"/><circle cx="6" cy="17.5" r="2.6"/><path d="M8.2 8l11.3 9M8.2 16l11.3-9"/>'),
    sound: I('<path d="M3 12h1.5M7 8.5v7M10.5 5v14M14 8v8M17.5 6.5v11M21 12h-.5"/>'),
    filter: I('<circle cx="9" cy="9.5" r="5.2"/><circle cx="15" cy="9.5" r="5.2"/><circle cx="12" cy="14.8" r="5.2"/>'),
    bg: I('<rect x="3" y="4" width="18" height="16" rx="2.5"/><circle cx="12" cy="10" r="2.8"/><path d="M6.8 20c.8-2.8 2.9-4.3 5.2-4.3s4.4 1.5 5.2 4.3"/>'),
    split: I('<path d="M12 3v18M8 8l-4 4 4 4M16 8l4 4-4 4"/>'), trash: I('<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>'),
    none: I('<circle cx="12" cy="12" r="8"/><path d="M6.5 17.5l11-11"/>'), black: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="3" fill="#000" stroke="#fff" stroke-width="1.4"/><circle cx="12" cy="10.5" r="2.6" fill="#fff"/><path d="M7.5 20c.7-2.6 2.5-4 4.5-4s3.8 1.4 4.5 4" fill="#fff"/></svg>',
    blur: I('<circle cx="12" cy="12" r="8" stroke-dasharray="2 2.6"/><circle cx="12" cy="12" r="4"/>'), image: I('<rect x="3" y="5" width="18" height="14" rx="2.5"/><circle cx="9" cy="10" r="1.8"/><path d="M21 16l-5.5-5.5L6 19"/>'),
    video: I('<rect x="3" y="6" width="13" height="12" rx="2.5"/><path d="M16 10.5l5-3v9l-5-3"/><path d="M7 12a2.5 2.5 0 1 0 2.5-2.5"/>')
  };
  /* the AI files live next to the app (panduri/ai/), as the other models do */
  const BASE = (() => { const p = location.pathname; return location.protocol.startsWith('http') && /\/panduri\/source\/dist\/app\//.test(p) ? new URL('../../../ai/', location.href).href : location.protocol.startsWith('http') && /\/panduri\/app\//.test(p) ? new URL('../ai/', location.href).href : 'https://yanx447.github.io/index.html/panduri/ai/'; })();
  const RECM = ['video/mp4;codecs=avc1.640033,mp4a.40.2', 'video/mp4;codecs=avc1,mp4a.40.2', 'video/mp4', 'video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm'];
  const AUDIO = 256000, MIN = .3;
  const fail = k => Object.assign(new Error(k), { code: k });

  /* ---------------- sound: FFT and the noise gate ---------------- */
  function tables(N) {
    const lg = Math.log2(N), rev = new Uint32Array(N), cos = new Float32Array(N / 2), sin = new Float32Array(N / 2);
    for (let i = 0; i < N; i++) { let r = 0; for (let b = 0; b < lg; b++) r |= ((i >> b) & 1) << (lg - 1 - b); rev[i] = r; }
    for (let i = 0; i < N / 2; i++) { cos[i] = Math.cos(2 * Math.PI * i / N); sin[i] = Math.sin(2 * Math.PI * i / N); }
    return { N, rev, cos, sin };
  }
  function fft(re, im, T, inv) {
    const { N, rev, cos, sin } = T;
    for (let i = 0; i < N; i++) { const j = rev[i]; if (j > i) { let x = re[i]; re[i] = re[j]; re[j] = x; x = im[i]; im[i] = im[j]; im[j] = x; } }
    for (let size = 2; size <= N; size <<= 1) {
      const half = size >> 1, step = N / size;
      for (let i = 0; i < N; i += size) for (let j = 0, k = 0; j < half; j++, k += step) {
        const wr = cos[k], wi = inv ? sin[k] : -sin[k], a = i + j, b = a + half;
        const xr = re[b] * wr - im[b] * wi, xi = re[b] * wi + im[b] * wr;
        re[b] = re[a] - xr; im[b] = im[a] - xi; re[a] += xr; im[a] += xi;
      }
    }
    if (inv) for (let i = 0; i < N; i++) { re[i] /= N; im[i] /= N; }
  }
  /** Spectral noise gate. Each band's steady floor is the level it stays above 80% of the time; whatever does not
   *  rise clearly above that floor is turned down (not cut to silence, which would leave "musical" artefacts), and
   *  everything under ~45 Hz (wind, traffic rumble, handling) goes. amt 0…1. */
  async function denoise(ac, buf, amt, onP, stop) {
    const N = 2048, HOP = 512, NB = N / 2 + 1, T = tables(N);
    const len = buf.length, sr = buf.sampleRate, two = buf.numberOfChannels > 1;
    const L = buf.getChannelData(0), R = two ? buf.getChannelData(1) : L;
    const win = new Float32Array(N); for (let i = 0; i < N; i++) win[i] = .5 - .5 * Math.cos(2 * Math.PI * i / N);
    const F = Math.ceil((len + N) / HOP), start = f => (f + 1) * HOP - N;
    const db = new Uint8Array(F * NB), hist = new Uint32Array(NB * 256), re = new Float32Array(N), im = new Float32Array(N);
    const breathe = async (f, base, span) => { if (f % 128) return; if (stop()) throw fail('cancel'); onP(Math.round((base + span * f / F) * 100)); await new Promise(r => setTimeout(r, 0)); };
    for (let f = 0; f < F; f++) {   // 1 — how loud every band is in every frame (left and right together)
      const s0 = start(f);
      for (let i = 0; i < N; i++) { const n = s0 + i; re[i] = n >= 0 && n < len ? (L[n] + R[n]) * .5 * win[i] : 0; im[i] = 0; }
      fft(re, im, T, false);
      for (let k = 0, o = f * NB; k < NB; k++) { const d = 10 * Math.log10(re[k] * re[k] + im[k] * im[k] + 1e-18), q = Math.max(0, Math.min(255, Math.round((d + 60) * 2))); db[o + k] = q; hist[k * 256 + q]++; }
      await breathe(f, 0, .3);
    }
    const floor = new Float32Array(NB), fl = new Float32Array(NB);   // 2 — the steady floor, smoothed across neighbouring bands
    for (let k = 0; k < NB; k++) { let c = 0, q = 0; const need = F * .2; for (; q < 255; q++) { c += hist[k * 256 + q]; if (c >= need) break; } floor[k] = q / 2 - 60; }
    for (let k = 0; k < NB; k++) { let s = 0, n = 0; for (let j = -3; j <= 3; j++) { const kk = k + j; if (kk >= 0 && kk < NB) { s += floor[kk]; n++; } } fl[k] = s / n; }
    const margin = 4 + 8 * amt, depth = Math.pow(10, -(10 + 22 * amt) / 20), hz = sr / N, hp = new Float32Array(NB);
    for (let k = 0; k < NB; k++) { const f = k * hz; hp[k] = f < 45 ? 0 : f < 80 ? (f - 45) / 35 : 1; }
    const oL = new Float32Array(len), oR = two ? new Float32Array(len) : null, g = new Float32Array(NB), gp = new Float32Array(NB).fill(1);
    for (let f = 0; f < F; f++) {   // 3 — left in the real part, right in the imaginary: one transform turns both down by the same gains
      const s0 = start(f);
      for (let i = 0; i < N; i++) { const n = s0 + i, ok = n >= 0 && n < len; re[i] = ok ? L[n] * win[i] : 0; im[i] = ok && two ? R[n] * win[i] : 0; }
      fft(re, im, T, false);
      for (let k = 0, o = f * NB; k < NB; k++) {
        const x = (db[o + k] / 2 - 60 - fl[k] - margin) / 6 + .5, m = x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x);
        let gg = depth + (1 - depth) * m; gg = gg > gp[k] ? gg : gp[k] + (gg - gp[k]) * .45; gp[k] = gg; g[k] = gg;   // opens at once, closes over ~25 ms
      }
      for (let k = 0; k < NB; k++) {
        const w = (g[k > 0 ? k - 1 : 0] + 2 * g[k] + g[k < NB - 1 ? k + 1 : k]) / 4 * hp[k];
        re[k] *= w; im[k] *= w; if (k && k < N / 2) { re[N - k] *= w; im[N - k] *= w; }
      }
      fft(re, im, T, true);
      for (let i = 0; i < N; i++) { const n = s0 + i; if (n >= 0 && n < len) { oL[n] += re[i] * win[i]; if (two) oR[n] += im[i] * win[i]; } }
      await breathe(f, .3, .7);
    }
    const out = ac.createBuffer(two ? 2 : 1, len, sr);
    for (let n = 0; n < len; n++) { oL[n] /= 1.5; if (two) oR[n] /= 1.5; }   // Hann² at 75% overlap adds up to 1.5
    out.getChannelData(0).set(oL); if (two) out.getChannelData(1).set(oR);
    onP(100);
    return out;
  }
  function impulse(ac, sec) {
    const sr = ac.sampleRate, n = Math.round(sr * sec), b = ac.createBuffer(2, n, sr), pre = sr * .012;
    for (let c = 0; c < 2; c++) { const d = b.getChannelData(c); for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 3.6) * (i < pre ? i / pre : 1) * .6; }
    return b;
  }
  /** EQ → compressor → dry + delay + reverb. Neutral settings pass the sound unchanged. */
  function makeChain(ac) {
    const inp = ac.createGain(), lo = ac.createBiquadFilter(), mid = ac.createBiquadFilter(), hi = ac.createBiquadFilter();
    lo.type = 'lowshelf'; lo.frequency.value = 140; mid.type = 'peaking'; mid.frequency.value = 1100; mid.Q.value = .8; hi.type = 'highshelf'; hi.frequency.value = 6500;
    const comp = ac.createDynamicsCompressor(), make = ac.createGain(), dry = ac.createGain(), out = ac.createGain();
    const dl = ac.createDelay(2), fb = ac.createGain(), dWet = ac.createGain(), conv = ac.createConvolver(), rWet = ac.createGain();
    conv.buffer = impulse(ac, 2.4);
    inp.connect(lo); lo.connect(mid); mid.connect(hi); hi.connect(comp); comp.connect(make);
    make.connect(dry); dry.connect(out);
    make.connect(dl); dl.connect(fb); fb.connect(dl); dl.connect(dWet); dWet.connect(out);
    make.connect(conv); conv.connect(rWet); rWet.connect(out);
    return {
      inp, out,
      set(a) {
        const t = ac.currentTime, s = (p, v) => p.setTargetAtTime(v, t, .03), k = a.comp / 100;
        s(out.gain, a.vol / 100); s(lo.gain, a.lo); s(mid.gain, a.mid); s(hi.gain, a.hi);
        comp.threshold.value = -1 - 33 * k; comp.ratio.value = 1 + 7 * k; comp.knee.value = 8; comp.attack.value = .004; comp.release.value = .18;
        s(make.gain, k ? Math.pow(10, 33 * k * (1 - 1 / (1 + 7 * k)) * .5 / 20) : 1);
        s(rWet.gain, a.rev / 100 * .85); s(dry.gain, 1 - a.rev / 100 * .25);
        dl.delayTime.setTargetAtTime(a.dtime / 1000, t, .05); s(dWet.gain, a.del / 100 * .6); fb.gain.value = .38;
      }
    };
  }

  /* ---------------- GIF: every frame, for an animated background ---------------- */
  function lzw(data, minSize, npix) {
    const out = new Uint8Array(npix), clear = 1 << minSize, eoi = clear + 1;
    const prefix = new Int16Array(4096), suffix = new Uint8Array(4096), stack = new Uint8Array(4097);
    for (let i = 0; i < clear; i++) { prefix[i] = -1; suffix[i] = i; }
    let size = minSize + 1, mask = (1 << size) - 1, next = eoi + 1, old = -1, first = 0, bits = 0, acc = 0, pi = 0, op = 0;
    while (op < npix) {
      while (bits < size) { if (pi >= data.length) return out; acc |= data[pi++] << bits; bits += 8; }
      const code = acc & mask; acc >>>= size; bits -= size;
      if (code === clear) { size = minSize + 1; mask = (1 << size) - 1; next = eoi + 1; old = -1; continue; }
      if (code === eoi) break;
      if (old < 0) { out[op++] = suffix[code]; old = first = code; continue; }
      let sp = 0, cur = code;
      if (code >= next) { stack[sp++] = first; cur = old; }
      while (cur >= clear) { stack[sp++] = suffix[cur]; cur = prefix[cur]; }
      stack[sp++] = first = suffix[cur];
      while (sp && op < npix) out[op++] = stack[--sp];
      if (next < 4096) { prefix[next] = old; suffix[next] = first; next++; if (!(next & mask) && next < 4096) { size++; mask = (1 << size) - 1; } }
      old = code;
    }
    return out;
  }
  function gifFrames(u8) {
    if (String.fromCharCode.apply(null, u8.subarray(0, 4)) !== 'GIF8') throw fail('gif');
    let p = 6; const rd = () => u8[p++], rd16 = () => { const v = u8[p] | (u8[p + 1] << 8); p += 2; return v; };
    const W = rd16(), H = rd16(), fl = rd(); p += 2;
    let gct = null; if (fl & 0x80) { const n = 3 << ((fl & 7) + 1); gct = u8.subarray(p, p + n); p += n; }
    const px = new Uint8ClampedArray(W * H * 4), frames = []; let gce = { delay: 100, trans: -1, disp: 0 };
    const skip = () => { let s; while (p < u8.length && (s = rd())) p += s; };
    while (p < u8.length && frames.length < 400) {
      const b = rd();
      if (b === 0x3b) break;
      if (b === 0x21) { if (rd() === 0xf9) { rd(); const f = rd(), d = rd16(), ti = rd(); rd(); gce = { disp: (f >> 2) & 7, delay: d * 10 < 20 ? 100 : d * 10, trans: f & 1 ? ti : -1 }; } else skip(); continue; }
      if (b !== 0x2c) break;
      const x = rd16(), y = rd16(), w = rd16(), hh = rd16(), f = rd();
      let ct = gct; if (f & 0x80) { const n = 3 << ((f & 7) + 1); ct = u8.subarray(p, p + n); p += n; }
      const min = rd(), parts = []; let s, tot = 0;
      while (p < u8.length && (s = rd())) { parts.push(u8.subarray(p, p + s)); p += s; tot += s; }
      const data = new Uint8Array(tot); let o = 0; parts.forEach(c => { data.set(c, o); o += c.length; });
      const idx = lzw(data, min, w * hh), prev = gce.disp === 3 ? px.slice() : null;
      const rows = []; if (f & 0x40) [[0, 8], [4, 8], [2, 4], [1, 2]].forEach(([a, st]) => { for (let r = a; r < hh; r += st) rows.push(r); });
      for (let r = 0; r < hh; r++) {
        const yy = y + (rows.length ? rows[r] : r); if (yy >= H) continue;
        for (let c = 0; c < w; c++) { const xx = x + c, ci = idx[r * w + c]; if (xx >= W || ci === gce.trans || !ct) continue; const q = (yy * W + xx) * 4, k = ci * 3; px[q] = ct[k]; px[q + 1] = ct[k + 1]; px[q + 2] = ct[k + 2]; px[q + 3] = 255; }
      }
      frames.push({ img: new ImageData(px.slice(), W, H), delay: gce.delay });
      if (gce.disp === 2) for (let r = y; r < Math.min(H, y + hh); r++) px.fill(0, (r * W + x) * 4, (r * W + Math.min(W, x + w)) * 4);
      else if (prev) px.set(prev);
      gce = { delay: 100, trans: -1, disp: 0 };
    }
    return { w: W, h: H, frames };
  }

  /* ---------------- the person, cut out (MediaPipe selfie segmentation, loaded on first use) ---------------- */
  let segP = null;
  function segmenter() {
    return segP = segP || (async () => {
      const vis = await import(BASE + 'mp/vision_bundle.mjs');
      const files = await vis.FilesetResolver.forVisionTasks(BASE + 'mp/wasm');
      const opt = d => ({ baseOptions: { modelAssetPath: BASE + 'mp/selfie_segmenter.tflite', delegate: d }, runningMode: 'VIDEO', outputCategoryMask: false, outputConfidenceMasks: true });
      try { return await vis.ImageSegmenter.createFromOptions(files, opt('GPU')); } catch (_) { return await vis.ImageSegmenter.createFromOptions(files, opt('CPU')); }
    })().catch(e => { segP = null; throw e; });
  }

  /* ---------------- the picture: WebGL ---------------- */
  const VS = 'attribute vec2 p;varying vec2 uv;void main(){uv=vec2(p.x*.5+.5,.5-p.y*.5);gl_Position=vec4(p,0.,1.);}';
  const FS = `#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
varying vec2 uv;uniform sampler2D uV,uM,uB;uniform int uBgMode;uniform vec3 uBgCol,uSh,uHi;uniform vec4 uBgMap;
uniform float uExp,uCon,uSat,uTemp,uTint,uFade,uVig,uGrain,uSplit,uLetter,uTime,uFlip;uniform vec2 uRes;
float hash(vec2 q){return fract(sin(dot(q,vec2(12.9898,78.233)))*43758.5453);}
void main(){
  vec2 vu=uFlip>.5?vec2(1.-uv.x,uv.y):uv;vec3 c=texture2D(uV,vu).rgb;
  if(uBgMode>0){float a=smoothstep(.32,.68,texture2D(uM,vu).r);vec3 b=uBgMode==1?uBgCol:texture2D(uB,uBgMap.zw+uv*uBgMap.xy).rgb;c=mix(b,c,a);}
  c*=uExp;c*=vec3(1.+uTemp,1.+uTint,1.-uTemp);c=(c-.5)*uCon+.5;
  float l=dot(clamp(c,0.,1.),vec3(.2126,.7152,.0722));c=mix(vec3(l),c,uSat);
  c+=uSplit*((1.-l)*(uSh-.5)+l*(uHi-.5))*.35;c=uFade+c*(1.-uFade);
  c*=1.-uVig*smoothstep(.45,1.05,length(uv-.5)*1.4142);
  c+=(hash(uv*uRes+uTime)-.5)*uGrain;
  if(uv.y<uLetter||uv.y>1.-uLetter)c=vec3(0.);
  gl_FragColor=vec4(clamp(c,0.,1.),1.);
}`;
  function renderer(cv) {
    let gl = null; try { gl = cv.getContext('webgl', { preserveDrawingBuffer: true, antialias: false, alpha: false }); } catch (_) {}
    if (!gl) return null;
    const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s; };
    const pr = gl.createProgram(); gl.attachShader(pr, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) throw new Error('link'); gl.useProgram(pr);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer()); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const U = {}; 'uV uM uB uBgMode uBgCol uBgMap uExp uCon uSat uTemp uTint uFade uVig uGrain uSplit uSh uHi uLetter uTime uRes uFlip'.split(' ').forEach(n => { U[n] = gl.getUniformLocation(pr, n); });
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    const T = [0, 1, 2].map(i => {
      gl.activeTexture(gl.TEXTURE0 + i); const t = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, t);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 1, 1, 0, gl.RGB, gl.UNSIGNED_BYTE, new Uint8Array(3)); return t;
    });
    gl.uniform1i(U.uV, 0); gl.uniform1i(U.uM, 1); gl.uniform1i(U.uB, 2);
    let lost = false; cv.addEventListener('webglcontextlost', e => { e.preventDefault(); lost = true; });
    const up = (i, src) => { gl.activeTexture(gl.TEXTURE0 + i); gl.bindTexture(gl.TEXTURE_2D, T[i]); try { gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, src); } catch (_) {} };
    return {
      gl: true, get lost() { return lost; },
      video: src => up(0, src), bg: src => up(2, src),
      mask(u8, w, hh) { gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, T[1]); gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, w, hh, 0, gl.LUMINANCE, gl.UNSIGNED_BYTE, u8); },
      draw(P, mode, col, map, time, flip) {
        if (lost) return;
        gl.uniform1f(U.uFlip, flip ? 1 : 0);
        gl.viewport(0, 0, cv.width, cv.height);
        gl.uniform1i(U.uBgMode, mode); gl.uniform3fv(U.uBgCol, col); gl.uniform4fv(U.uBgMap, map);
        gl.uniform1f(U.uExp, P.exp); gl.uniform1f(U.uCon, P.con); gl.uniform1f(U.uSat, P.sat); gl.uniform1f(U.uTemp, P.temp); gl.uniform1f(U.uTint, P.tint);
        gl.uniform1f(U.uFade, P.fade); gl.uniform1f(U.uVig, P.vig); gl.uniform1f(U.uGrain, P.grain); gl.uniform1f(U.uSplit, P.split); gl.uniform1f(U.uLetter, P.letter);
        gl.uniform3fv(U.uSh, P.sh); gl.uniform3fv(U.uHi, P.hi); gl.uniform1f(U.uTime, time % 97); gl.uniform2f(U.uRes, cv.width, cv.height);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }
    };
  }
  /** no WebGL: the frame is drawn as it is; cutting and the sound can still be edited */
  function renderer2d(cv) {
    const c = cv.getContext('2d'); let src = null;
    return { gl: false, lost: false, video: s => { src = s; }, bg() {}, mask() {}, draw(P, m, col, map, time, flip) { if (!src) return; c.setTransform(flip ? -1 : 1, 0, 0, 1, flip ? cv.width : 0, 0); c.drawImage(src, 0, 0, cv.width, cv.height); c.setTransform(1, 0, 0, 1, 0, 0); } };
  }
  const ID = { exp: 1, con: 1, sat: 1, temp: 0, tint: 0, fade: 0, vig: 0, grain: 0, split: 0, sh: [.5, .5, .5], hi: [.5, .5, .5], letter: 0 };
  const PRE = {
    none: {},
    cine: { con: 1.16, sat: .84, temp: .04, fade: .03, vig: .42, split: 1, sh: [.16, .42, .52], hi: [.78, .58, .38], letter: .085 },
    noir: { sat: 0, con: 1.32, vig: .5, grain: .07, exp: .98 },
    warm: { temp: .11, sat: 1.08, con: 1.04, exp: 1.02 },
    cool: { temp: -.1, tint: .015, sat: .94, con: 1.03 },
    vint: { fade: .14, sat: .68, temp: .07, vig: .32, grain: .09, con: .9 },
    vivid: { sat: 1.38, con: 1.13, exp: 1.03 },
    moody: { exp: .86, con: 1.22, sat: .78, vig: .55, split: .7, sh: [.3, .4, .62], hi: [.6, .55, .5] }
  };
  function params(name, k) {
    const p = PRE[name] || {}, o = {};
    for (const key in ID) { const a = ID[key], b = p[key] != null ? p[key] : a; o[key] = Array.isArray(a) ? a.map((x, i) => x + (b[i] - x) * k) : a + (b - a) * k; }
    return o;
  }
  /** an element sized in pixels to cover (or fit inside) a box — set by hand, so it does not depend on object-fit */
  function place(el, w, hh, box, cover) {
    if (!w || !hh) return;
    const k = cover ? Math.max(box.w / w, box.h / hh) : Math.min(box.w / w, box.h / hh), W = w * k, H = hh * k;
    el.style.width = W + 'px'; el.style.height = H + 'px'; el.style.left = (box.x + (box.w - W) / 2) + 'px'; el.style.top = (box.y + (box.h - H) / 2) + 'px';
  }
  const pickFile = accept => new Promise(res => {
    const i = h('input', { type: 'file', accept, hidden: true });
    const end = f => { i.onchange = i.oncancel = null; i.remove(); res(f); };
    i.onchange = () => end(i.files[0] || null); i.oncancel = () => end(null);
    document.body.appendChild(i); i.click();
  });
  const seekEl = (el, t) => new Promise((res, rej) => {
    const to = setTimeout(() => { el.removeEventListener('seeked', ok); rej(fail('seek')); }, 6000);
    const ok = () => { clearTimeout(to); el.removeEventListener('seeked', ok); res(); };
    el.addEventListener('seeked', ok); el.currentTime = t;
  });
  const meta = el => el.readyState >= 1 ? Promise.resolve() : new Promise((res, rej) => { el.addEventListener('loadedmetadata', () => res(), { once: true }); el.addEventListener('error', () => rej(fail('badFile')), { once: true }); });
  const AUD0 = { vol: 100, lo: 0, mid: 0, hi: 0, comp: 0, rev: 0, del: 0, dtime: 320, dn: false, dnAmt: 60 };

  /* ---------------- the editor ---------------- */
  /** o: { file, meta: {w,h,dur}, roomMB, onBack, onNext } → { dirty, version, length, render, cancel, back, hide, show, destroy } */
  function mount(root, o) {
    const url = URL.createObjectURL(o.file), flip = !!o.mirror;   // a selfie is drawn — and made — the way it looked while filming
    let dur = o.meta.dur || 1;
    const S = { segs: [{ a: 0, b: dur }], sel: 0, filter: 'none', fk: 1, bg: 'none', aud: Object.assign({}, AUD0) };
    let ver = 0, dead = false, hidden = false, playing = false, panel = null, raf = 0, needs = true, lastT = -1, exporting = null, pendingSeek = null, audioAfterSeek = false, driftAt = 0;
    const v = h('video', { class: 've-src', playsinline: true, preload: 'auto' }); v.muted = true; v.playsInline = true; v.src = url;
    const cv = h('canvas', { class: 've-view' });
    let R = null; try { R = renderer(cv); } catch (_) { R = null; }
    if (!R) R = renderer2d(cv);

    /* sound */
    const AC = window.AudioContext || window.webkitAudioContext;
    let audWhy = '', ac = null, chain = null, spk = null, orig = null, clean = null, cleanKey = -1, elSrc = null, asrc = null, aStart = 0, aOff = 0, dnJob = 0, dnRun = null, waveCv = null;
    try { ac = new AC(); chain = makeChain(ac); spk = ac.createGain(); chain.out.connect(spk); spk.connect(ac.destination); chain.set(S.aud); } catch (_) { ac = null; v.muted = false; }
    const useElement = () => { if (!ac || elSrc) return; try { elSrc = ac.createMediaElementSource(v); elSrc.connect(chain.inp); v.muted = false; } catch (_) { v.muted = false; } };
    (async () => {
      if (!ac) return;
      if (dur > 180 || o.file.size > 200 * 1048576) audWhy = 've.longAudio';   // ~70 MB of sound a minute once decoded, more again for the noise gate
      else try { const ab = await o.file.arrayBuffer(); orig = await new Promise((res, rej) => { const q = ac.decodeAudioData(ab, res, rej); if (q && q.then) q.then(res, rej); }); } catch (_) { orig = null; audWhy = 've.noAudio'; }
      if (dead) return;
      if (!orig) useElement(); else makeWave();
      paintPanel();
    })();
    const curBuf = () => (S.aud.dn && clean) || orig;
    const wake = () => { if (ac && ac.state === 'suspended' && !exporting) ac.resume().catch(() => {}); };
    root.addEventListener('pointerdown', wake);

    /* segments */
    const segIdx = t => S.segs.findIndex(s => t >= s.a - 1e-3 && t < s.b - .02);
    const total = () => S.segs.reduce((n, s) => n + s.b - s.a, 0);
    const dirty = () => !!o.mustRender || S.segs.length !== 1 || S.segs[0].a > .05 || S.segs[0].b < dur - .05 || (S.filter !== 'none' && S.fk > 0) || S.bg !== 'none' ||
      ['vol', 'lo', 'mid', 'hi', 'comp', 'rev', 'del', 'dn'].some(k => S.aud[k] !== AUD0[k]);

    /* playback */
    function stopAudio() { if (!asrc) return; try { asrc.stop(); } catch (_) {} try { asrc.disconnect(); } catch (_) {} asrc = null; }
    function startAudio() {
      stopAudio(); const B = curBuf(); if (!B || !ac) return;
      const t = v.currentTime, i = segIdx(t); if (i < 0) return;
      asrc = ac.createBufferSource(); asrc.buffer = B; asrc.connect(chain.inp);
      aOff = t; aStart = ac.currentTime; asrc.start(0, Math.min(t, B.duration), Math.max(.01, S.segs[i].b - t));
    }
    function seekTo(t) { t = Math.max(0, Math.min(dur - .02, t)); if (v.seeking) { pendingSeek = t; return; } v.currentTime = t; needs = true; }
    v.addEventListener('seeked', () => { needs = true; if (pendingSeek != null) { const t = pendingSeek; pendingSeek = null; v.currentTime = t; return; } if (audioAfterSeek && playing) { audioAfterSeek = false; startAudio(); } });
    function play() {
      if (playing || dead || exporting) return; playing = true; root.classList.add('playing'); wake();
      if (segIdx(v.currentTime) < 0) { const n = S.segs.find(s => s.a >= v.currentTime) || S.segs[0]; v.currentTime = n.a; audioAfterSeek = true; }
      v.play().then(() => { if (playing && !v.seeking) startAudio(); }, () => { playing = false; root.classList.remove('playing'); });
    }
    function pause() { if (!playing) return; playing = false; root.classList.remove('playing'); try { v.pause(); } catch (_) {} stopAudio(); needs = true; }
    function boundary() {   // the preview steps over cut parts and loops
      if (!playing || v.seeking) return;
      const t = v.currentTime, i = segIdx(t);
      if (i >= 0 && !v.ended) {
        if (asrc && ac && performance.now() > driftAt) { driftAt = performance.now() + 1500; if (Math.abs(aOff + ac.currentTime - aStart - t) > .12) startAudio(); }
        return;
      }
      const n = S.segs.find(s => s.a >= t - .02 && s.b > t + .05) || S.segs[0];
      stopAudio(); v.currentTime = n.a; audioAfterSeek = true;
      if (v.paused || v.ended) v.play().catch(() => {});
    }

    /* drawing */
    let small = null, sctx = null, tiny = null, tctx = null, maskF = null, maskU8 = null, mw = 0, mh = 0, tsLast = 0, seg = null;
    let gif = null, gifT0 = 0, gifIdx = -1, still = null, stillUp = false, bgV = null, bgUrl = null;
    function runSeg() {
      if (!small) { const k = 256 / Math.max(v.videoWidth, v.videoHeight); small = document.createElement('canvas'); small.width = Math.max(1, Math.round(v.videoWidth * k)); small.height = Math.max(1, Math.round(v.videoHeight * k)); sctx = small.getContext('2d'); }
      sctx.drawImage(v, 0, 0, small.width, small.height);
      tsLast = Math.max(tsLast + 1, performance.now());
      try {
        seg.segmentForVideo(small, tsLast, res => {
          const ms = res && res.confidenceMasks; if (!ms || !ms.length) return;
          const m = ms[ms.length > 1 ? 1 : 0], f = m.getAsFloat32Array(), n = f.length;
          if (!maskF || maskF.length !== n) { maskF = Float32Array.from(f); maskU8 = new Uint8Array(n); mw = m.width; mh = m.height; }
          else for (let i = 0; i < n; i++) maskF[i] = maskF[i] * .35 + f[i] * .65;   // a little memory: the edge does not flicker
          for (let i = 0; i < n; i++) maskU8[i] = maskF[i] * 255;
          R.mask(maskU8, mw, mh);
        });
      } catch (_) {}
    }
    const coverMap = (bw, bh) => { const A = cv.width / cv.height, a = bw / bh; return a > A ? [A / a, 1, (1 - A / a) / 2, 0] : [1, a / A, 0, (1 - a / A) / 2]; };
    function frame(force) {
      if (!v.videoWidth || R.lost) return;
      const t = v.currentTime, fresh = force || t !== lastT; lastT = t;
      if (fresh) R.video(v);
      let mode = 0, map = [1, 1, 0, 0];
      if (R.gl && S.bg !== 'none' && seg) {
        if (fresh || !maskU8) runSeg();
        if (maskU8) {
          if (S.bg === 'black') mode = 1;
          else if (S.bg === 'blur') {
            if (!tiny) { const k = 36 / Math.max(v.videoWidth, v.videoHeight); tiny = document.createElement('canvas'); tiny.width = Math.max(2, Math.round(v.videoWidth * k)); tiny.height = Math.max(2, Math.round(v.videoHeight * k)); tctx = tiny.getContext('2d'); }
            if (fresh) { tctx.drawImage(v, 0, 0, tiny.width, tiny.height); R.bg(tiny); } mode = 2;
          } else if (S.bg === 'image' && gif) {
            const tot = gif.frames.reduce((n, f) => n + f.delay, 0); let x = (performance.now() - gifT0) % tot, i = 0;
            while (i < gif.frames.length - 1 && x >= gif.frames[i].delay) { x -= gif.frames[i].delay; i++; }
            if (i !== gifIdx) { gifIdx = i; R.bg(gif.frames[i].img); }
            mode = 2; map = coverMap(gif.w, gif.h);
          } else if (S.bg === 'image' && still) { if (!stillUp) { R.bg(still); stillUp = true; } mode = 2; map = coverMap(still.width, still.height); }
          else if (S.bg === 'video' && bgV && bgV.readyState >= 2) { if (bgV.currentTime >= 5) bgV.currentTime = 0; R.bg(bgV); mode = 2; map = coverMap(bgV.videoWidth, bgV.videoHeight); }
        }
      }
      R.draw(params(S.filter, S.fk), mode, [0, 0, 0], map, performance.now() / 1000, flip);
    }
    const animated = () => S.bg !== 'none' && (S.bg === 'video' || (S.bg === 'image' && gif && gif.frames.length > 1));
    function loop() {
      if (dead) return; raf = requestAnimationFrame(loop);
      if (hidden || exporting) return;
      boundary();
      if (needs || v.currentTime !== lastT || animated() || (playing && params(S.filter, S.fk).grain > 0)) { const f = needs; needs = false; frame(f); }
      tls.forEach(x => x.head());
      paintTime();
    }

    /* layout */
    const playI = h('div', { class: 've-playi', html: ic.play, 'aria-hidden': 'true' });
    const tap = h('button', { class: 've-tap', type: 'button', 'aria-label': t('ve.play'), onclick: () => { if (playing) pause(); else play(); } });
    const timeEl = h('b', { class: 've-time mono' }), infoEl = h('small', { class: 'cam-info' });
    const panelEl = h('div', { class: 've-panel', hidden: true, role: 'dialog' });
    const tools = [['clip', 've.clip', IC.clip], ['sound', 've.sound', IC.sound], ['filters', 've.filters', IC.filter], ['bg', 've.bg', IC.bg]]
      .filter(([k]) => R.gl || (k !== 'filters' && k !== 'bg')).filter(([k]) => ac || k !== 'sound');
    const toolB = {};
    const rail = h('div', { class: 've-rail' }, tools.map(([k, key, icon]) => toolB[k] = h('button', { class: 've-tool', type: 'button', onclick: () => open(k) }, [h('span', { html: icon }), h('small', { 'data-t': key })])));
    root.innerHTML = ''; root.classList.add('ve');
    root.append(v, cv, tap, playI, h('div', { class: 'cam-shade t' }), h('div', { class: 'cam-shade b' }),
      h('div', { class: 'cam-top' }, [h('button', { class: 'cam-ic', type: 'button', 'aria-label': t('fd.retake'), html: ic.back, onclick: () => o.onBack() })]),
      rail,
      h('div', { class: 'cam-bot ve-bot' }, [timeEl, infoEl, h('div', { class: 'cam-acts' }, [
        h('button', { class: 'btn cam-ghost', type: 'button', html: ic.restart + '<span data-t="fd.retake"></span>', onclick: () => o.onBack() }),
        h('button', { class: 'btn primary', type: 'button', 'data-t': 'fd.next', onclick: () => o.onNext() })])]),
      panelEl);
    PD.i18n.apply(root);
    function layout() {
      if (!v.videoWidth) return;
      const W = innerWidth, H = innerHeight, ph = panel ? panelEl.offsetHeight : 0, box = { x: 0, y: 0, w: W, h: H - ph };
      place(cv, v.videoWidth, v.videoHeight, panel ? { x: 8, y: 8, w: W - 16, h: Math.max(60, box.h - 16) } : box, !panel && (v.videoWidth > v.videoHeight) === (W > H));
      tap.style.height = box.h + 'px';
    }
    function sizeCanvas(max, short) { const k = Math.min(1, max / Math.max(v.videoWidth, v.videoHeight), (short || 1e9) / Math.min(v.videoWidth, v.videoHeight)); cv.width = Math.max(2, Math.round(v.videoWidth * k / 2) * 2); cv.height = Math.max(2, Math.round(v.videoHeight * k / 2) * 2); }
    v.addEventListener('loadedmetadata', () => {
      if (isFinite(v.duration) && v.duration > 0 && Math.abs(v.duration - dur) > .05) { const full = S.segs.length === 1 && S.segs[0].a === 0; dur = v.duration; S.segs.forEach(s => { s.b = Math.min(s.b, dur); }); if (full) S.segs[0].b = dur; }
      sizeCanvas(Math.min(1440, Math.max(innerWidth, innerHeight) * Math.min(2, devicePixelRatio || 1)));
      layout(); needs = true;
    });
    v.addEventListener('loadeddata', () => { needs = true; });
    addEventListener('resize', layout);
    function paintTime() { const t = v.currentTime, i = segIdx(t); let done = 0; for (let k = 0; k < S.segs.length && k < (i < 0 ? S.segs.length : i); k++) done += S.segs[k].b - S.segs[k].a; if (i >= 0) done += t - S.segs[i].a; timeEl.textContent = PD.fmtTime(done) + ' / ' + PD.fmtTime(total()); }
    function paintInfo() {
      const d = dirty();
      if (o.mustRender) { infoEl.textContent = t('fd.squeeze', { s: Math.ceil(o.file.size / 1048576), n: o.roomMB }); }
      else infoEl.textContent = o.meta.w + '×' + o.meta.h + ' · ' + PD.fmtTime(total()) + (d ? ' · ' + t('ve.edited') : ' · ' + (o.file.size / 1048576).toFixed(1) + ' MB · ' + t('fd.asIs'));
      toolB.clip && toolB.clip.classList.toggle('set', S.segs.length > 1 || S.segs[0].a > .05 || S.segs[0].b < dur - .05);
      toolB.sound && toolB.sound.classList.toggle('set', ['vol', 'lo', 'mid', 'hi', 'comp', 'rev', 'del', 'dn'].some(k => S.aud[k] !== AUD0[k]));
      toolB.filters && toolB.filters.classList.toggle('set', S.filter !== 'none');
      toolB.bg && toolB.bg.classList.toggle('set', S.bg !== 'none');
    }
    const changed = () => { ver++; needs = true; paintInfo(); tls.forEach(x => x.paint()); paintPanel(); };

    /* ---- the timeline: the clip's frames (or its waveform), the parts that stay, their edges, the playhead ---- */
    const tls = [];
    let thumbs = null, thumbN = 10;
    function makeThumbs() {
      if (thumbs || !v.videoWidth) return;
      const th = 96, tw = Math.max(16, Math.round(th * v.videoWidth / v.videoHeight)); thumbs = document.createElement('canvas'); thumbs.width = tw * thumbN; thumbs.height = th;
      const c = thumbs.getContext('2d'), tv = h('video', { playsinline: true, preload: 'auto' }); tv.muted = true; tv.playsInline = true; tv.src = url;
      (async () => {
        try { await meta(tv); for (let i = 0; i < thumbN && !dead; i++) { await seekEl(tv, (i + .5) * dur / thumbN); if (flip) { c.setTransform(-1, 0, 0, 1, (i + 1) * tw, 0); c.drawImage(tv, 0, 0, tw, th); c.setTransform(1, 0, 0, 1, 0, 0); } else c.drawImage(tv, i * tw, 0, tw, th); tls.forEach(x => x.paint()); } } catch (_) {}
        tv.removeAttribute('src'); try { tv.load(); } catch (_) {}
      })();
    }
    function makeWave() {
      const B = curBuf(); if (!B) return;
      const W = 1200, H = 120; waveCv = waveCv || document.createElement('canvas'); waveCv.width = W; waveCv.height = H;
      const c = waveCv.getContext('2d'), L = B.getChannelData(0), Rr = B.numberOfChannels > 1 ? B.getChannelData(1) : L, step = Math.max(1, Math.floor(B.length / W));
      c.clearRect(0, 0, W, H); c.fillStyle = '#e2ae84';
      for (let x = 0; x < W; x++) { let mx = 0; const s0 = x * step, s1 = Math.min(B.length, s0 + step); for (let i = s0; i < s1; i += 4) { const a = Math.abs(L[i] + Rr[i]) * .5; if (a > mx) mx = a; } const y = Math.max(1, Math.min(1, mx * 1.6) * H / 2); c.fillRect(x, H / 2 - y, 1, y * 2); }
      tls.forEach(x => x.paint());
    }
    function timeline(kind) {
      const cvs = h('canvas', { class: 've-tl-c' }), segBox = h('div', { class: 've-tl-segs' }), ph = h('i', { class: 've-ph' });
      const el = h('div', { class: 've-tl' + (kind === 'wave' ? ' wave' : ''), role: 'slider', 'aria-label': t('fd.seek'), tabindex: '0' }, [cvs, segBox, ph]);
      function paint() {
        const w = el.clientWidth, hh = el.clientHeight, dpr = Math.min(2, devicePixelRatio || 1); if (!w) return;
        if (cvs.width !== Math.round(w * dpr)) { cvs.width = Math.round(w * dpr); cvs.height = Math.round(hh * dpr); }
        const c = cvs.getContext('2d'), W = cvs.width, H = cvs.height; c.clearRect(0, 0, W, H);
        if (kind === 'thumbs' && thumbs) { const tw = thumbs.width / thumbN, th = thumbs.height, sw = W / thumbN, k = Math.min(tw / sw, th / H); for (let i = 0; i < thumbN; i++) c.drawImage(thumbs, i * tw + (tw - sw * k) / 2, (th - H * k) / 2, sw * k, H * k, i * sw, 0, Math.ceil(sw), H); }
        if (kind === 'wave' && waveCv) c.drawImage(waveCv, 0, 0, W, H);
        c.fillStyle = 'rgba(0,0,0,.66)'; let prev = 0;
        S.segs.forEach(s => { if (s.a > prev) c.fillRect(prev / dur * W, 0, (s.a - prev) / dur * W, H); prev = s.b; });
        if (prev < dur) c.fillRect(prev / dur * W, 0, W - prev / dur * W, H);
        segBox.innerHTML = '';
        S.segs.forEach((s, i) => {
          const d = h('div', { class: 've-seg' + (i === S.sel && kind === 'thumbs' ? ' on' : '') }); d.style.left = (s.a / dur * 100) + '%'; d.style.width = ((s.b - s.a) / dur * 100) + '%';
          if (kind === 'thumbs' && i === S.sel) d.append(h('span', { class: 've-h l', 'data-h': 'l' }), h('span', { class: 've-h r', 'data-h': 'r' }));
          segBox.appendChild(d);
        });
        head();
      }
      function head() { ph.style.left = (v.currentTime / dur * 100) + '%'; }
      el.addEventListener('pointerdown', e => {
        const r = el.getBoundingClientRect(), at = x => Math.max(0, Math.min(dur, (x - r.left) / r.width * dur)), hd = kind === 'thumbs' && e.target.dataset ? e.target.dataset.h : null;
        pause(); try { el.setPointerCapture(e.pointerId); } catch (_) {}
        const mv = ev => {
          const x = at(ev.clientX);
          if (hd) {
            const i = S.sel, s = S.segs[i], lo = i ? S.segs[i - 1].b : 0, hi = i < S.segs.length - 1 ? S.segs[i + 1].a : dur;
            if (hd === 'l') { s.a = Math.max(lo, Math.min(x, s.b - MIN)); seekTo(s.a); } else { s.b = Math.min(hi, Math.max(x, s.a + MIN)); seekTo(s.b - .04); }
            tls.forEach(q => q.paint());
          } else {
            const i = S.segs.findIndex(s => x >= s.a && x <= s.b);
            if (i >= 0 && i !== S.sel && kind === 'thumbs') { S.sel = i; tls.forEach(q => q.paint()); }
            seekTo(x);
          }
        };
        mv(e);
        const up = () => { el.removeEventListener('pointermove', mv); el.removeEventListener('pointerup', up); el.removeEventListener('pointercancel', up); if (hd) changed(); };
        el.addEventListener('pointermove', mv); el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up);
      });
      el.addEventListener('keydown', e => { if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); pause(); seekTo(v.currentTime + (e.key === 'ArrowLeft' ? -.5 : .5)); } });
      const x = { el, paint, head }; tls.push(x); return x;
    }

    /* ---- controls ---- */
    function slider(label, min, max, step, get, set, fmt, commit) {
      const val = h('b', { class: 've-val mono' }), inp = h('input', { type: 'range', min, max, step, 'aria-label': t(label) });
      inp.value = get(); val.textContent = fmt(get());
      inp.addEventListener('input', () => { set(+inp.value); val.textContent = fmt(+inp.value); });
      if (commit) inp.addEventListener('change', () => commit(+inp.value));
      return h('label', { class: 've-row' }, [h('span', { 'data-t': label }), inp, val]);
    }
    const dB = x => (x > 0 ? '+' : '') + x + ' dB', pct = x => Math.round(x) + '%';
    const audioSet = k => x => { S.aud[k] = x; chain && chain.set(S.aud); ver++; paintInfo(); };
    const section = key => h('div', { class: 've-sec', 'data-t': key });
    const actB = (icon, key, fn) => h('button', { class: 'btn', type: 'button', html: icon + '<span data-t="' + key + '"></span>', onclick: fn });

    function split() {
      const t0 = v.currentTime, i = segIdx(t0); if (i < 0) return;
      const s = S.segs[i]; if (t0 - s.a < MIN || s.b - t0 < MIN) { PD.ui.toast(t('ve.tooShort')); return; }
      S.segs.splice(i, 1, { a: s.a, b: t0 }, { a: t0, b: s.b }); S.sel = i + 1; changed();
    }
    function delSeg() {
      if (S.segs.length < 2) { PD.ui.toast(t('ve.oneLeft')); return; }
      S.segs.splice(S.sel, 1); S.sel = Math.min(S.sel, S.segs.length - 1); seekTo(S.segs[S.sel].a); changed();
    }
    let dnState = null;
    function runDenoise() {
      if (!orig || !ac) return;
      const job = ++dnJob, amt = S.aud.dnAmt;
      if (clean && cleanKey === amt) { makeWave(); if (playing) startAudio(); return; }
      const show = p => { if (dnState) dnState.textContent = p == null ? '' : t('ve.dnWork', { p }); };
      show(0);
      dnRun = denoise(ac, orig, amt / 100, p => { if (job === dnJob) show(p); }, () => job !== dnJob || dead).then(out => {
        if (job !== dnJob || dead) return;
        clean = out; cleanKey = amt; show(null); makeWave(); if (playing) startAudio();
      }, () => { if (job === dnJob) show(null); }).then(() => { if (job === dnJob) dnRun = null; });
    }

    const PANELS = {
      clip() {
        makeThumbs();
        const tl = timeline('thumbs'), len = h('small', { class: 've-len mono' });
        return { el: [tl.el, len, h('div', { class: 've-acts' }, [actB(IC.split, 've.split', split), actB(IC.trash, 've.del', delSeg), actB(ic.restart, 've.reset', () => { S.segs = [{ a: 0, b: dur }]; S.sel = 0; changed(); })]), h('small', { class: 've-hint', 'data-t': 've.clipHint' })],
          paint() { len.textContent = t('ve.len', { t: PD.fmtTime(total()) }); } };
      },
      sound() {
        const kids = [];
        if (orig) {
          const tl = timeline('wave'); kids.push(tl.el);
          const sw = h('button', { class: 've-sw' + (S.aud.dn ? ' on' : ''), type: 'button', role: 'switch', 'aria-checked': String(S.aud.dn), 'aria-label': t('ve.dn') });
          dnState = h('small', { class: 've-st', role: 'status' });
          sw.onclick = () => { S.aud.dn = !S.aud.dn; sw.classList.toggle('on', S.aud.dn); sw.setAttribute('aria-checked', String(S.aud.dn)); ver++; paintInfo(); if (S.aud.dn) runDenoise(); else { dnJob++; dnRun = null; dnState.textContent = ''; makeWave(); if (playing) startAudio(); } };
          kids.push(h('div', { class: 've-swrow' }, [h('b', { 'data-t': 've.dn' }), dnState, sw]),
            slider('ve.dnAmt', 10, 100, 5, () => S.aud.dnAmt, x => { S.aud.dnAmt = x; ver++; }, pct, () => { if (S.aud.dn) runDenoise(); }),
            h('small', { class: 've-hint', 'data-t': 've.dnHint' }));
          if (dnRun) dnState.textContent = t('ve.dnWork', { p: 0 });
        } else kids.push(h('small', { class: 've-hint', 'data-t': audWhy || 've.noAudio' }));
        kids.push(slider('ve.vol', 0, 200, 5, () => S.aud.vol, audioSet('vol'), pct),
          section('ve.eq'), slider('ve.low', -12, 12, 1, () => S.aud.lo, audioSet('lo'), dB), slider('ve.mid', -12, 12, 1, () => S.aud.mid, audioSet('mid'), dB), slider('ve.high', -12, 12, 1, () => S.aud.hi, audioSet('hi'), dB),
          section('ve.fx'), slider('ve.comp', 0, 100, 5, () => S.aud.comp, audioSet('comp'), pct), slider('ve.rev', 0, 100, 5, () => S.aud.rev, audioSet('rev'), pct),
          slider('ve.delay', 0, 100, 5, () => S.aud.del, audioSet('del'), pct), slider('ve.dtime', 60, 900, 20, () => S.aud.dtime, audioSet('dtime'), x => x + ' ms'));
        return { el: kids };
      },
      filters() {
        const chips = h('div', { class: 've-chips', role: 'radiogroup' }), cans = {};
        Object.keys(PRE).forEach(k => {
          const c = h('canvas', { width: 128, height: 168 }); cans[k] = c;
          chips.appendChild(h('button', { class: 've-chip' + (S.filter === k ? ' on' : ''), type: 'button', role: 'radio', 'aria-checked': String(S.filter === k), 'data-k': k, onclick: () => { S.filter = k; changed(); } }, [c, h('span', { 'data-t': 've.f.' + k })]));
        });
        const paintChips = () => {
          if (!v.videoWidth) return;
          Object.keys(cans).forEach(k => { R.draw(params(k, 1), 0, [0, 0, 0], [1, 1, 0, 0], 1, flip); const c = cans[k], x = c.getContext('2d'), s = Math.min(cv.width / c.width, cv.height / c.height); x.drawImage(cv, (cv.width - c.width * s) / 2, (cv.height - c.height * s) / 2, c.width * s, c.height * s, 0, 0, c.width, c.height); });
          frame(true);
        };
        requestAnimationFrame(() => { R.video(v); paintChips(); });
        return { el: [chips, slider('ve.amount', 0, 100, 5, () => Math.round(S.fk * 100), x => { S.fk = x / 100; needs = true; ver++; paintInfo(); }, pct)],
          paint() { chips.querySelectorAll('.ve-chip').forEach(b => { const on = b.dataset.k === S.filter; b.classList.toggle('on', on); b.setAttribute('aria-checked', String(on)); }); } };
      },
      bg() {
        const st = h('small', { class: 've-st', role: 'status' }), chips = h('div', { class: 've-chips', role: 'radiogroup' });
        const choose = async k => {
          if (k === 'none') { S.bg = 'none'; changed(); return; }
          if (k === 'image' || k === 'video') { if (!(await pickBg(k))) return; }
          S.bg = k; changed();
          if (!seg) {
            st.textContent = t('ve.bgLoad');
            try { seg = await segmenter(); if (dead) return; st.textContent = ''; maskF = null; needs = true; }
            catch (_) { st.textContent = t('ve.bgFail'); S.bg = 'none'; changed(); }
          }
        };
        [['none', IC.none], ['black', IC.black], ['blur', IC.blur], ['image', IC.image], ['video', IC.video]].forEach(([k, icon]) =>
          chips.appendChild(h('button', { class: 've-chip', type: 'button', role: 'radio', 'data-k': k, onclick: () => choose(k) }, [h('span', { class: 've-ico', html: icon }), h('span', { 'data-t': 've.b.' + k })])));
        return { el: [chips, st, h('small', { class: 've-hint', 'data-t': 've.bgHint' })],
          paint() { chips.querySelectorAll('.ve-chip').forEach(b => { const on = b.dataset.k === S.bg; b.classList.toggle('on', on); b.setAttribute('aria-checked', String(on)); }); } };
      }
    };
    async function pickBg(kind) {
      const f = await pickFile(kind === 'video' ? 'video/*' : 'image/*'); if (!f || dead) return false;
      if (kind === 'video') {
        const nv = h('video', { playsinline: true, loop: true, preload: 'auto' }); nv.muted = true; nv.playsInline = true;
        const u = URL.createObjectURL(f); nv.src = u;
        try { await meta(nv); await nv.play(); } catch (_) { URL.revokeObjectURL(u); PD.ui.toast(t('ve.gifBad')); return false; }
        if (bgV) { bgV.pause(); bgV.removeAttribute('src'); } if (bgUrl) URL.revokeObjectURL(bgUrl);
        bgV = nv; bgUrl = u; return true;
      }
      try {
        if (f.type === 'image/gif' || /\.gif$/i.test(f.name)) {
          const g = gifFrames(new Uint8Array(await f.arrayBuffer())); if (!g.frames.length) throw fail('gif');
          gif = g; gifT0 = performance.now(); gifIdx = -1; still = null; return true;
        }
        const u = URL.createObjectURL(f), img = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = u; });
        const k = Math.min(1, 2048 / Math.max(img.naturalWidth, img.naturalHeight)), c = document.createElement('canvas');
        c.width = Math.max(1, Math.round(img.naturalWidth * k)); c.height = Math.max(1, Math.round(img.naturalHeight * k)); c.getContext('2d').drawImage(img, 0, 0, c.width, c.height); URL.revokeObjectURL(u);
        still = c; stillUp = false; gif = null; return true;
      } catch (_) { PD.ui.toast(t('ve.gifBad')); return false; }
    }
    let cur = null;
    function open(k) {
      pause(); panel = k; dnState = null;
      const title = { clip: 've.clip', sound: 've.sound', filters: 've.filters', bg: 've.bg' }[k];
      tls.length = 0; cur = PANELS[k]();
      panelEl.innerHTML = '';
      panelEl.append(h('div', { class: 've-ph-head' }, [h('h3', { 'data-t': title }), h('button', { class: 'btn small primary', type: 'button', 'data-t': 've.done', onclick: close })]), ...cur.el);
      panelEl.hidden = false; root.classList.add('panel'); PD.i18n.apply(panelEl);
      requestAnimationFrame(() => { layout(); tls.forEach(x => x.paint()); cur.paint && cur.paint(); });
    }
    function close() { panel = null; cur = null; tls.length = 0; dnState = null; panelEl.hidden = true; panelEl.innerHTML = ''; root.classList.remove('panel'); layout(); needs = true; }
    function paintPanel() { if (!panel) return; if (panel === 'sound' && !panelEl.querySelector('.ve-tl') && orig) { open('sound'); return; } cur && cur.paint && cur.paint(); }

    /* ---- the result: drawn again frame by frame and recorded, with the sound through the same effects ---- */
    async function render(onP) {
      if (exporting) throw fail('busy');
      pause(); if (dnRun) await dnRun;
      const mime = window.MediaRecorder && RECM.find(m => MediaRecorder.isTypeSupported(m));
      if (!mime || !cv.captureStream) throw fail('noRender');
      if (S.bg !== 'none' && !seg) { try { seg = await segmenter(); } catch (_) { throw fail('bgFail'); } }
      exporting = { cancel: false };
      const tot = total(), A = tot >= 240 ? 128000 : AUDIO, room = o.roomMB * 1048576 * 8 * .88 / Math.max(1, tot) - A;
      const pw = cv.width, phh = cv.height; sizeCanvas(3840, room < 2.5e6 ? 720 : room < 8e6 ? 1080 : 0);   // few bits: fewer, sharper pixels (never under 720p)
      const fps = 30, vs = cv.captureStream(fps), tracks = vs.getVideoTracks().slice();
      let dest = null;
      if (ac) { dest = ac.createMediaStreamDestination(); chain.out.connect(dest); spk.gain.value = 0; tracks.push(...dest.stream.getAudioTracks()); }
      const vbr = Math.round(Math.max(2e5, Math.min(room, cv.width * cv.height * fps * .3, 60e6)));
      let rec; try { rec = new MediaRecorder(new MediaStream(tracks), { mimeType: mime, videoBitsPerSecond: vbr, audioBitsPerSecond: A, videoKeyFrameIntervalDuration: 2000 }); } catch (_) { rec = new MediaRecorder(new MediaStream(tracks), { mimeType: mime }); }
      const chunks = []; rec.ondataavailable = e => { if (e.data && e.data.size) chunks.push(e.data); };
      const stopped = new Promise(res => { rec.onstop = res; });
      let doneT = 0;
      try {
        if (ac) await ac.resume();
        for (let i = 0; i < S.segs.length; i++) {
          const s = S.segs[i];
          if (i) { if (rec.state === 'recording') rec.pause(); if (ac) await ac.suspend(); }
          await seekEl(v, s.a); frame(true);
          if (!i) rec.start(1000); else if (rec.state === 'paused') rec.resume();
          if (ac) await ac.resume();
          await playRange(s, p => onP(Math.min(99, Math.round((doneT + p) / tot * 100))));
          doneT += s.b - s.a;
          if (exporting.cancel) throw fail('cancel');
        }
        rec.stop(); await stopped;
      } catch (e) { try { if (rec.state !== 'inactive') rec.stop(); } catch (_) {} throw e; }
      finally {
        stopAudio(); try { v.pause(); } catch (_) {}
        if (dest) { try { chain.out.disconnect(dest); } catch (_) {} spk.gain.value = 1; }
        vs.getTracks().forEach(x => x.stop());
        cv.width = pw; cv.height = phh; exporting = null; if (ac) ac.resume().catch(() => {}); needs = true; layout();
      }
      const type = (rec.mimeType || mime).split(';')[0];
      onP(100);
      return new File(chunks, 'panduri-edit.' + (/mp4/.test(type) ? 'mp4' : 'webm'), { type });
    }
    function playRange(s, onP) {
      return new Promise((res, rej) => {
        let fin = false, guard = 0;
        const end = () => { if (fin) return; fin = true; clearInterval(guard); v.removeEventListener('timeupdate', tu); try { v.pause(); } catch (_) {} stopAudio(); res(); };
        const tu = () => { if (v.currentTime >= s.b - .02 || v.ended) end(); };
        const tick = (now, md) => {
          if (fin) return;
          if (exporting.cancel) { end(); return; }
          frame(true);
          const tt = md && md.mediaTime != null ? md.mediaTime : v.currentTime; onP(Math.max(0, tt - s.a));
          if (tt >= s.b - .5 / 30 || v.ended) { end(); return; }
          next();
        };
        const next = () => { if (v.requestVideoFrameCallback) v.requestVideoFrameCallback(tick); else requestAnimationFrame(() => tick()); };
        let last = -1, still = 0;
        guard = setInterval(() => { if (v.currentTime === last) { if (++still > 16) end(); } else { still = 0; last = v.currentTime; } }, 500);   // a stall of 8 s ends the part rather than hanging
        v.addEventListener('timeupdate', tu);
        v.play().then(() => { if (!elSrc) startAudio(); next(); }, e => { fin = true; clearInterval(guard); rej(e); });
      });
    }

    raf = requestAnimationFrame(loop); paintInfo();
    return {
      dirty, version: () => ver, length: total,
      render, cancel() { if (exporting) exporting.cancel = true; },
      back() { if (panel) { close(); return true; } return false; },
      hide() { pause(); hidden = true; root.hidden = true; },
      show() { hidden = false; root.hidden = false; needs = true; layout(); },
      destroy() {
        dead = true; cancelAnimationFrame(raf); pause(); dnJob++; removeEventListener('resize', layout);
        try { ac && ac.close(); } catch (_) {}
        v.removeAttribute('src'); try { v.load(); } catch (_) {}
        if (bgV) { bgV.pause(); bgV.removeAttribute('src'); } if (bgUrl) URL.revokeObjectURL(bgUrl);
        URL.revokeObjectURL(url); root.innerHTML = ''; root.classList.remove('ve', 'panel', 'playing');
      }
    };
  }
  return { mount, denoise, gifFrames, place };
})();
