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
  've.dnWork': ['მუშავდება… {p}%', 'Working… {p}%'],
  've.dnHint': ['ხმაურის ნიმუშისთვის გადადი მონაკვეთზე, სადაც მხოლოდ ფონია. ხმა და ინსტრუმენტი ერთდროულად თუ ისმის, მათი გამოყოფა ნიმუშით შეზღუდულია.', 'For a noise profile, seek to a section with background sound alone. Overlapping voices and instruments may remain.'],
  've.longAudio': ['ამ დიდ ფაილზე ხელმისაწვდომია EQ და ეფექტები. ტალღისა და ხმაურის ნიმუშისთვის გახსენი მოკლე კლიპი.', 'EQ and effects are available for this large file. Open a shorter clip for waveform and noise profiling.'],
  've.noAudio': ['ამ ვიდეოს ხმა ამ მოწყობილობამ ვერ წაიკითხა: EQ და ეფექტები მუშაობს, ხმაურის მოშლა და ტალღის ფორმა — არა.', 'This device could not read the video’s sound: EQ and effects work, noise removal and the waveform do not.'],
  've.f.none': ['ორიგინალი', 'Original'], 've.f.cine': ['სინემატიკური', 'Cinematic'], 've.f.noir': ['შავ-თეთრი', 'Black & white'], 've.f.warm': ['თბილი', 'Warm'], 've.f.cool': ['ცივი', 'Cool'],
  've.f.vint': ['ვინტაჟი', 'Vintage'], 've.f.vivid': ['მკვეთრი', 'Vivid'], 've.f.moody': ['ბნელი', 'Moody'], 've.amount': ['სიძლიერე', 'Strength'],
  've.b.none': ['არ შეიცვალოს', 'Keep'], 've.b.black': ['შავი ფონი', 'Black'], 've.b.blur': ['ბუნდოვანი', 'Blurred'], 've.b.image': ['სურათი ან GIF', 'Picture or GIF'], 've.b.video': ['ვიდეო', 'Video'],
  've.bgLoad': ['ფონის ამომჭრელი იტვირთება… (მხოლოდ პირველად, ~20 MB)', 'Loading the background cutter… (first time only, ~20 MB)'],
  've.bgFail': ['ფონის ამომჭრელი ვერ ჩაიტვირთა — შეამოწმე ინტერნეტი და სცადე თავიდან.', 'The background cutter could not be loaded — check the connection and try again.'],
  've.bgHint': ['ამოიჭრება ადამიანი, დანარჩენი ყველაფერი ფონად ითვლება. ინსტრუმენტის ის ნაწილი, რომელიც სხეულს შორდება, შეიძლება ფონს გაჰყვეს. ყველაფერი ამ მოწყობილობაზე ხდება.', 'The person is cut out; everything else counts as background. Parts of the instrument held away from the body may go with the background. It all happens on this device.'],
  've.gifBad': ['ეს ფაილი ვერ წაიკითხა.', 'This file could not be read.'],
  've.rendering': ['ვიდეო მზადდება… {p}%', 'Making the video… {p}%'], 've.edited': ['მომზადდება რედაქტირებული კლიპი', 'Edited export'],
  've.renderFail': ['ვიდეო ამ მოწყობილობაზე ვერ დამუშავდა.', 'The video could not be made on this device.'],
  've.mixPreset': ['ხმის პრესეტი', 'Audio preset'], 've.eqBand': ['შუა სიხშირე', 'Mid frequency'],
  've.eqWidth': ['შუა ზოლის Q', 'Mid-band Q'], 've.hp': ['დაბლების მოჭრა', 'High-pass'],
  've.hum': ['ზუზუნის მოშლა', 'Hum notch'], 've.thresh': ['კომპრესორის ზღურბლი', 'Compressor threshold'],
  've.ratio': ['შეკუმშვის თანაფარდობა', 'Ratio'], 've.attack': ['შეტევა', 'Attack'], 've.release': ['აღდგენა', 'Release'],
  've.gainReduction': ['კომპრესორის შემცირება', 'Gain reduction'], 've.ab': ['ორიგინალი / დამუშავებული', 'Original / processed'],
  've.spectrum': ['სპექტრი და EQ მრუდი', 'Spectrum and EQ curve'],
  've.dnProfile': ['ხმაურის ნიმუში აქედან', 'Sample noise here'], 've.dnAuto': ['ავტომატური ნიმუში', 'Automatic noise profile'],
  've.dnProfileAt': ['ხმაურის ნიმუში · {time}', 'Noise sample · {time}'],
  've.dnError': ['ხმაურის დამუშავება ვერ დასრულდა.', 'Noise reduction could not finish.'],
  've.mutePart': ['არჩეული ნაწილის დადუმება', 'Mute selected part'], 've.unmutePart': ['ხმის დაბრუნება', 'Unmute selected part'],
  've.undo': ['გაუქმება', 'Undo'], 've.trimIn': ['დასაწყისი აქ', 'Set start here'], 've.trimOut': ['დასასრული აქ', 'Set end here'],
  've.zoom': ['ტაიმლაინის მასშტაბი', 'Timeline zoom'], 've.crop': ['კადრის პროპორცია', 'Aspect ratio'],
  've.exposure': ['ექსპოზიცია', 'Exposure'], 've.contrast': ['კონტრასტი', 'Contrast'],
  've.saturation': ['გაჯერება', 'Saturation'], 've.temperature': ['ტემპერატურა', 'Temperature'],
  've.f.stage': ['სცენა', 'Stage'], 've.f.soft': ['რბილი', 'Soft light'], 've.f.gold': ['ოქროსფერი', 'Golden hour'],
  've.f.analog': ['ნეგატივი 35 მმ', '35 mm film'], 've.f.blue': ['ლურჯი საათი', 'Blue hour'],
  've.key': ['ფონის ამოჭრის მეთოდი', 'Cutout method'], 've.key.person': ['ადამიანის ამოჭრა', 'Person cutout'],
  've.key.green': ['მწვანე ეკრანი', 'Green screen'], 've.key.blue': ['ლურჯი ეკრანი', 'Blue screen'],
  've.keyEdge': ['კიდის გამართვა', 'Edge adjustment'], 've.b.color': ['ფერი', 'Solid color'],
  've.stems': ['ვოკალი და ინსტრუმენტები', 'Vocals and instrument layers'],
  've.separate': ['გაყავი ხმა აქედან', 'Separate audio from playhead'],
  've.sepHint': ['სიმა ყოფს ვოკალს, დრამს, ბასსა და დანარჩენ ხმას 30-წამიან მონაკვეთზე. პირველად იტვირთება მოდელები (დაახლოებით 150 MB).', 'Separate vocals, drums, bass and other audio in a 30-second section. The first run downloads about 150 MB of models.'],
  've.sepReady': ['გამოყოფილი ხმა · {from}–{to}', 'Separated section · {from}–{to}'],
  've.sepError': ['ხმის დაყოფა ვერ დასრულდა. შეგიძლია ხელახლა სცადო.', 'Audio separation failed. You can retry.'],
  've.sep.vocals': ['ვოკალის მოშორება', 'Reduce vocals'], 've.sep.bass': ['ბასის მოშორება', 'Reduce bass'],
  've.sep.drums': ['დრამის მოშორება', 'Reduce drums'], 've.sep.other': ['დანარჩენის მოშორება', 'Reduce other audio'],
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
  const AUDIO = 192000, MIN = .3;
  const fail = k => Object.assign(new Error(k), { code: k });

  /* ---------------- which recording format really keeps the sound on this device ----------------
     Some browsers accept a format and its bitrate, then quietly drop the sound from the file (an AAC bitrate a mono
     microphone cannot take, a muxer without an encoder). Nothing is tested before filming — that made the first tap
     wait up to ten seconds. Instead the best untried format records at once, and the real recording is checked
     afterwards: one that kept the sound is remembered, one that lost it is marked bad and the next take uses another. */
  const FMT = 'fd.recfmt', BAD = 'fd.recbad';
  const rejectedEncoders = new Set();
  const CANDS = [['video/mp4;codecs=avc1.640033,mp4a.40.2', 192000], ['video/mp4;codecs=avc1.640033,mp4a.40.2', 128000], ['video/mp4;codecs=avc1,mp4a.40.2', 128000],
    ['video/webm;codecs=vp9,opus', 192000], ['video/webm;codecs=vp8,opus', 128000], ['video/mp4', 0], ['video/webm', 0]];
  /** true: the file has sound · false: none · null: could not tell in time (judged neither way) */
  async function hasSound(blob, ms = 8000) {
    const judge = (async () => {
      try {
        const ac = new (window.OfflineAudioContext || window.webkitOfflineAudioContext)(1, 1, 44100), ab = await blob.arrayBuffer();
        const b = await new Promise((res, rej) => { const q = ac.decodeAudioData(ab, res, rej); if (q && q.then) q.then(res, rej); });
        for (let c = 0; c < b.numberOfChannels; c++) { const d = b.getChannelData(c); for (let i = 0; i < d.length; i += 7) if (d[i] !== 0) return true; }
        return false;
      } catch (_) { return false; }   // no sound track at all
    })();
    return Promise.race([judge, new Promise(z => setTimeout(() => z(null), ms))]);
  }
  const ok = m => window.MediaRecorder && MediaRecorder.isTypeSupported(m);
  const allowed = m => ok(m) && !rejectedEncoders.has(m);
  const known = () => { const f = PD.store.get(FMT, null); return f && allowed(f.m) ? f : null; };
  /** Prefer a tested encoder, then a codec for the source container if supplied. */
  function pick(container) {
    const k = known();
    if (k) return k;
    const bad = PD.store.get(BAD, []);
    const eligible = CANDS.filter(([m]) => allowed(m));
    const working = eligible.filter(([m, a]) => !bad.some(b => b.m === m && b.a === a));
    const options = working.length ? working : eligible;
    const c = options.find(([m]) => m.split(';')[0] === container) || options[0];
    return c ? { m: c[0], a: c[1] } : null;
  }
  const rejectEncoder = mime => rejectedEncoders.add(mime);
  const remember = f => { if (f && f.m) PD.store.set(FMT, { m: f.m, a: f.a || 0 }); };
  function forget(f) {
    PD.store.del(FMT); if (!f) return;
    const bad = PD.store.get(BAD, []); if (!bad.some(b => b.m === f.m && b.a === f.a)) bad.push({ m: f.m, a: f.a }); PD.store.set(BAD, bad.slice(-12));
  }

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
  async function denoise(ac, buf, amt, onP, stop, profileAt = null) {
    const N = 2048, HOP = 512, NB = N / 2 + 1, T = tables(N);
    const len = buf.length, sr = buf.sampleRate, two = buf.numberOfChannels > 1;
    const L = buf.getChannelData(0), R = two ? buf.getChannelData(1) : L;
    const win = new Float32Array(N); for (let i = 0; i < N; i++) win[i] = .5 - .5 * Math.cos(2 * Math.PI * i / N);
    const F = Math.ceil((len + N) / HOP), start = f => (f + 1) * HOP - N;
    const hist = new Uint32Array(NB * 256), re = new Float32Array(N), im = new Float32Array(N);
    const breathe = async (f, count, base, span) => {
      if (stop()) throw fail('cancel');
      onP(Math.round((base + span * f / count) * 100));
      await new Promise(resolve => setTimeout(resolve, 0));
    };
    function bandLevel(k) {
      if (!two) return 10 * Math.log10(re[k] ** 2 + im[k] ** 2 + 1e-18);
      const mirror = (N - k) % N;
      const lr = (re[k] + re[mirror]) * .5, li = (im[k] - im[mirror]) * .5;
      const rr = (im[k] + im[mirror]) * .5, ri = (re[mirror] - re[k]) * .5;
      return 10 * Math.log10((lr * lr + li * li + rr * rr + ri * ri) * .5 + 1e-18);
    }
    const from = profileAt == null ? 0 : Math.max(0, Math.min(F - 1, Math.floor(profileAt * sr / HOP) + 3));
    const until = profileAt == null ? F : Math.min(F, from + Math.ceil(.75 * sr / HOP));
    const stride = Math.max(1, Math.floor((until - from) / 2000));
    let observed = 0;
    for (let f = from; f < until; f += stride) {
      const s0 = start(f);
      for (let i = 0; i < N; i++) {
        const n = s0 + i, inside = n >= 0 && n < len;
        re[i] = inside ? L[n] * win[i] : 0; im[i] = inside && two ? R[n] * win[i] : 0;
      }
      fft(re, im, T, false);
      for (let k = 0; k < NB; k++) {
        const d = bandLevel(k);
        hist[k * 256 + Math.max(0, Math.min(255, Math.round((d + 60) * 2)))]++;
      }
      if (++observed % 128 === 0) await breathe(f - from, until - from, 0, .2);
    }
    const floor = new Float32Array(NB), fl = new Float32Array(NB);
    for (let k = 0; k < NB; k++) {
      let c = 0, q = 0;
      const samples = observed * (profileAt == null ? .2 : .7);
      for (; q < 255; q++) { c += hist[k * 256 + q]; if (c >= samples) break; }
      floor[k] = q / 2 - 60;
    }
    for (let k = 0; k < NB; k++) { let s = 0, n = 0; for (let j = -3; j <= 3; j++) { const kk = k + j; if (kk >= 0 && kk < NB) { s += floor[kk]; n++; } } fl[k] = Math.max(floor[k] - 2, s / n); }
    const margin = 4 + 8 * amt, depth = Math.pow(10, -(10 + 22 * amt) / 20), hz = sr / N, hp = new Float32Array(NB);
    for (let k = 0; k < NB; k++) { const f = k * hz; hp[k] = f < 45 ? 0 : f < 80 ? (f - 45) / 35 : 1; }
    const out = ac.createBuffer(two ? 2 : 1, len, sr);
    const oL = out.getChannelData(0), oR = two ? out.getChannelData(1) : null, g = new Float32Array(NB), gp = new Float32Array(NB).fill(1);
    for (let f = 0; f < F; f++) {   // 3 — left in the real part, right in the imaginary: one transform turns both down by the same gains
      const s0 = start(f);
      for (let i = 0; i < N; i++) { const n = s0 + i, ok = n >= 0 && n < len; re[i] = ok ? L[n] * win[i] : 0; im[i] = ok && two ? R[n] * win[i] : 0; }
      fft(re, im, T, false);
      for (let k = 0; k < NB; k++) {
        const level = bandLevel(k);
        const x = (level - fl[k] - margin) / 6 + .5, m = x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x);
        let gg = depth + (1 - depth) * m; gg = gg > gp[k] ? gg : gp[k] + (gg - gp[k]) * .45; gp[k] = gg; g[k] = gg;   // opens at once, closes over ~25 ms
      }
      for (let k = 0; k < NB; k++) {
        const w = (g[k > 0 ? k - 1 : 0] + 2 * g[k] + g[k < NB - 1 ? k + 1 : k]) / 4 * hp[k];
        re[k] *= w; im[k] *= w; if (k && k < N / 2) { re[N - k] *= w; im[N - k] *= w; }
      }
      fft(re, im, T, true);
      for (let i = 0; i < N; i++) { const n = s0 + i; if (n >= 0 && n < len) { oL[n] += re[i] * win[i] / 1.5; if (two) oR[n] += im[i] * win[i] / 1.5; } }
      if (f % 128 === 0) await breathe(f, F, .2, .8);
    }
    onP(100);
    return out;
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
uniform float uExp,uCon,uSat,uTemp,uTint,uFade,uVig,uGrain,uSplit,uLetter,uTime,uFlip;uniform vec2 uRes,uCrop,uKey;
float hash(vec2 q){return fract(sin(dot(q,vec2(12.9898,78.233)))*43758.5453);}
void main(){
  vec2 vu=(uv-.5)*uCrop+.5;
  if(uFlip>.5) vu.x=1.-vu.x;
  vec3 c=texture2D(uV,vu).rgb;
  if(uBgMode>0){
    float edge=uKey.y;
    float a=smoothstep(.32+edge,.68+edge,texture2D(uM,vu).r);
    if(uKey.x>.5){
      bool green=uKey.x<1.5;
      float chroma=green?c.g-max(c.r,c.b):c.b-max(c.r,c.g);
      a=1.-smoothstep(.035+edge*.34,.17+edge*.34,chroma);
      if(green)c.g=mix(min(c.g,max(c.r,c.b)+.06),c.g,a);
      else c.b=mix(min(c.b,max(c.r,c.g)+.06),c.b,a);
    }
    vec3 b=uBgMode==1?uBgCol:texture2D(uB,uBgMap.zw+uv*uBgMap.xy).rgb;
    c=mix(b,c,a);
  }
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
    const U = {}; 'uV uM uB uBgMode uBgCol uBgMap uExp uCon uSat uTemp uTint uFade uVig uGrain uSplit uSh uHi uLetter uTime uRes uFlip uCrop uKey'.split(' ').forEach(n => { U[n] = gl.getUniformLocation(pr, n); });
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
      draw(P, mode, col, map, time, flip, crop = [1, 1], key = [0, 0]) {
        if (lost) return;
        gl.uniform1f(U.uFlip, flip ? 1 : 0);
        gl.uniform2fv(U.uCrop, crop); gl.uniform2fv(U.uKey, key);
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
    moody: { exp: .86, con: 1.22, sat: .78, vig: .55, split: .7, sh: [.3, .4, .62], hi: [.6, .55, .5] },
    stage: { exp: 1.04, con: 1.17, sat: 1.16, split: .6, sh: [.35, .31, .58], hi: [.72, .47, .56] },
    soft: { exp: 1.05, con: .86, sat: .88, fade: .06 },
    gold: { temp: .16, tint: -.025, exp: 1.04, split: .8, hi: [.8, .63, .4], vig: .18 },
    analog: { con: 1.12, sat: .82, grain: .12, fade: .07, split: 1, sh: [.25, .58, .44], hi: [.66, .56, .48] },
    blue: { exp: .9, con: 1.08, temp: -.13, sat: .86, split: .63, sh: [.26, .40, .66], hi: [.48, .63, .76] }
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
    if (el.readyState >= 2 && !el.seeking && Math.abs(el.currentTime - t) < .002) { res(); return; }
    const to = setTimeout(() => { el.removeEventListener('seeked', ok); rej(fail('seek')); }, 6000);
    const ok = () => { clearTimeout(to); el.removeEventListener('seeked', ok); res(); };
    el.addEventListener('seeked', ok); el.currentTime = t;
  });
  const meta = el => el.readyState >= 1 ? Promise.resolve() : new Promise((res, rej) => { el.addEventListener('loadedmetadata', () => res(), { once: true }); el.addEventListener('error', () => rej(fail('badFile')), { once: true }); });
  const MIX = PD.mixrack, AUD0 = MIX.defaults;
  const adjustKeys = Object.keys(AUD0).filter(key => key !== 'dnAmt');
  const q720 = (w, h) => PD.musicCommunity.isHD(w, h);

  /* ---------------- the editor ---------------- */
  /** o: { file, meta: {w,h,dur}, roomMB, onBack, onNext } → { dirty, version, length, render, cancel, back, hide, show, destroy } */
  function mount(root, o) {
    const audioOnly = o.kind === 'audio', url = URL.createObjectURL(o.file), flip = !!o.mirror;   // a selfie is drawn — and made — the way it looked while filming
    let dur = o.meta.dur || 1;
    const S = { segs: [{ a: 0, b: dur }], sel: 0, filter: 'none', fk: 1, crop: '', grade: { exp: 0, con: 0, sat: 0, temp: 0 }, bg: 'none', bgKey: 'person', bgEdge: 0, bgColor: '#000000', aud: Object.assign({}, AUD0) };
    let ver = 0, dead = false, hidden = false, playing = false, panel = null, raf = 0, needs = true, lastT = -1, exporting = null, pendingSeek = null, audioAfterSeek = false, driftAt = 0;
    const v = h(audioOnly ? 'audio' : 'video', { class: 've-src', playsinline: true, preload: 'auto' }); v.muted = true; v.playsInline = true; v.src = url;
    const cv = h('canvas', { class: 've-view' });
    let R = null;
    if (!audioOnly) { try { R = renderer(cv); } catch (_) {} if (!R) R = renderer2d(cv); }

    /* sound */
    const AC = window.AudioContext || window.webkitAudioContext;
    let audWhy = '', ac = null, chain = null, spk = null, orig = null, clean = null, cleanKey = -1, elSrc = null, asrc = null, aStart = 0, aOff = 0, dnJob = 0, dnRun = null, waveCv = null, compare = false, noiseAt = null;
    try { ac = new AC(); chain = MIX.chain(ac); spk = ac.createGain(); chain.out.connect(spk); spk.connect(ac.destination); chain.set(S.aud); chain.compare(false); } catch (_) { ac = null; v.muted = false; }
    const useElement = () => { if (!ac || elSrc) return; try { elSrc = ac.createMediaElementSource(v); elSrc.connect(chain.inp); v.muted = false; } catch (_) { v.muted = false; } };
    /* Until the sound is edited it plays straight from the video element — no Web Audio, which an iPhone silences with its
       ring/silent switch and keeps paused until a touch. Once effects are on it goes through Web Audio, told it is playback. */
    let native = true, decoded = false, clipStems = null, stemJob = null, stemProgress = 0;
    let audioSegment = -1, rackTab = 'eq';
    const stemSources = [];
    const fxOn = () => !!clipStems?.tracks.some(track => track.amount > 0) || S.segs.some(s => s.muted) || adjustKeys.some(k => S.aud[k] !== AUD0[k]);
    const cutSound = () => chain?.cut(!compare && S.segs[segIdx(v.currentTime)]?.muted ? 0 : 1);
    function route() {
      if (exporting) return;
      const wasNative = native;
      native = !fxOn() && panel !== 'sound' && !elSrc;   // an element routed through Web Audio cannot be taken back out of it
      if (native) { stopAudio(); v.muted = false; return; }
      if (!orig) { if (decoded) useElement(); return; }
      v.muted = true; if (playing && (wasNative || !asrc)) startAudio();
    }
    const AS = navigator.audioSession, asPrev = AS && AS.type;
    try { if (AS) AS.type = 'playback'; } catch (_) {}
    v.muted = false;
    const audioReady = (async () => {
      if (!ac) return;
      if ((o.file.size > 256 * 1048576 && !o.rawAudio) || (!audioOnly && dur > (PD.isTouch() ? 340 : 601))) audWhy = 've.longAudio';
      else try {
        const data = await (o.rawAudio || o.file).arrayBuffer();
        const OC = window.OfflineAudioContext || window.webkitOfflineAudioContext;
        const rate = o.audioInfo?.rate;
        if (audioOnly && OC && rate >= 8000 && rate <= 192000) orig = await new OC(1, 1, rate).decodeAudioData(data);
        else orig = await ac.decodeAudioData(data);
      } catch (_) { orig = null; audWhy = 've.noAudio'; }
      if (dead) return;
      decoded = true;
      if (orig) makeWave();
      if (panel === 'sound' && !exporting) open('sound');
      else if (panel === 'clip' && audioOnly) tls.forEach(x => x.paint());
      route();
    })();
    const curBuf = () => (!compare && S.aud.dn && clean) || orig;
    const wake = () => { if (ac && ac.state === 'suspended' && !exporting) ac.resume().catch(() => {}); };
    root.addEventListener('pointerdown', wake);

    /* segments */
    const segIdx = t => S.segs.findIndex(s => t >= s.a - 1e-3 && t < s.b - .02);
    const total = () => S.segs.reduce((n, s) => n + s.b - s.a, 0);
    const cropRatios = { '9:16': 9 / 16, '1:1': 1, '16:9': 16 / 9, '4:5': .8 };
    const grade = () => {
      const p = params(S.filter, S.fk);
      p.exp *= 2 ** S.grade.exp; p.con *= 1 + S.grade.con; p.sat *= 1 + S.grade.sat; p.temp += S.grade.temp;
      return p;
    };
    const pictureChanged = () => S.filter !== 'none' && S.fk > 0 || Object.values(S.grade).some(Boolean);
    const dirty = () => !!o.mustRender || S.segs.length !== 1 || S.segs[0].a > .05 || S.segs[0].b < dur - .05 || pictureChanged() || !!S.crop || S.bg !== 'none' ||
      fxOn();

    /* playback */
    function stopAudio() {
      if (asrc) {
        try { asrc.stop(); } catch (_) {}
        asrc.disconnect(); asrc = null;
      }
      for (const { source, gain } of stemSources.splice(0)) {
        try { source.stop(); } catch (_) {}
        source.disconnect(); gain.disconnect();
      }
    }
    function startAudio(force) {
      cutSound();
      const t = v.currentTime, i = segIdx(t);
      audioSegment = i;
      if ((native && !force) || elSrc) return;
      stopAudio(); const buffer = curBuf();
      if (!buffer || !ac || i < 0 || t >= buffer.duration) return;
      const at = ac.currentTime + .008, end = Math.min(S.segs[i].b, buffer.duration);
      asrc = ac.createBufferSource(); asrc.buffer = buffer; asrc.connect(chain.inp);
      aOff = t; aStart = at; asrc.start(at, t, Math.max(.001, end - t));
      if (!clipStems || compare) return;
      const from = Math.max(clipStems.from, t), to = Math.min(clipStems.to, end);
      if (to <= from) return;
      const offset = from - clipStems.from, time = at + from - t;
      const fade = Math.min(.018, (to - from) / 3);
      for (const track of clipStems.tracks) {
        if (!track.amount) continue;
        const source = ac.createBufferSource(), gain = ac.createGain(), level = -track.amount / 100;
        source.buffer = track.buffer; source.connect(gain); gain.connect(chain.inp);
        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(level, time + fade);
        gain.gain.setValueAtTime(level, time + to - from - fade);
        gain.gain.linearRampToValueAtTime(0, time + to - from);
        source.start(time, offset, to - from);
        stemSources.push({ source, gain });
      }
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
        if (audioSegment !== i) startAudio();
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
      if (audioOnly || !v.videoWidth || R.lost) return;
      const t = v.currentTime, fresh = force || t !== lastT; lastT = t;
      if (fresh) R.video(v);
      let mode = 0, map = [1, 1, 0, 0];
      if (R.gl && S.bg !== 'none' && (seg || S.bgKey !== 'person')) {
        if (S.bgKey === 'person' && (fresh || !maskU8)) runSeg();
        if (maskU8 || S.bgKey !== 'person') {
          if (S.bg === 'black' || S.bg === 'color') mode = 1;
          else if (S.bg === 'blur') {
            if (!tiny) { const k = 36 / Math.max(v.videoWidth, v.videoHeight); tiny = document.createElement('canvas'); tiny.width = Math.max(2, Math.round(v.videoWidth * k)); tiny.height = Math.max(2, Math.round(v.videoHeight * k)); tctx = tiny.getContext('2d'); }
            if (fresh) { tctx.drawImage(v, 0, 0, tiny.width, tiny.height); R.bg(tiny); } mode = 2;
          } else if (S.bg === 'image' && gif) {
            const tot = gif.frames.reduce((n, f) => n + f.delay, 0); let x = (performance.now() - gifT0) % tot, i = 0;
            while (i < gif.frames.length - 1 && x >= gif.frames[i].delay) { x -= gif.frames[i].delay; i++; }
            if (i !== gifIdx) { gifIdx = i; R.bg(gif.frames[i].img); }
            mode = 2; map = coverMap(gif.w, gif.h);
          } else if (S.bg === 'image' && still) { if (!stillUp) { R.bg(still); stillUp = true; } mode = 2; map = coverMap(still.width, still.height); }
          else if (S.bg === 'video' && bgV && bgV.readyState >= 2) { R.bg(bgV); mode = 2; map = coverMap(bgV.videoWidth, bgV.videoHeight); }
        }
      }
      const aspect = v.videoWidth / v.videoHeight, ratio = cropRatios[S.crop] || aspect;
      const crop = ratio < aspect ? [ratio / aspect, 1] : [1, aspect / ratio];
      const key = [S.bgKey === 'green' ? 1 : S.bgKey === 'blue' ? 2 : 0, S.bgEdge];
      const col = S.bg === 'color' ? [1, 3, 5].map(i => Number.parseInt(S.bgColor.slice(i, i + 2), 16) / 255) : [0, 0, 0];
      R.draw(grade(), mode, col, map, performance.now() / 1000, flip, crop, key);
    }
    const animated = () => S.bg !== 'none' && (S.bg === 'video' || (S.bg === 'image' && gif && gif.frames.length > 1));
    function loop() {
      if (dead) return; raf = requestAnimationFrame(loop);
      if (hidden || exporting) return;
      boundary();
      if (!audioOnly && (needs || v.currentTime !== lastT || animated() || (playing && params(S.filter, S.fk).grain > 0))) { const f = needs; needs = false; frame(f); }
      tls.forEach(x => x.head());
      if (audioOnly) audioSeek.value = v.currentTime;
      cur?.meter?.();
      paintTime();
    }

    /* layout */
    const playI = h('div', { class: 've-playi', html: ic.play, 'aria-hidden': 'true' });
    const tap = h('button', { class: 've-tap', type: 'button', 'aria-label': t('ve.play'), onclick: () => { if (playing) pause(); else play(); } });
    const timeEl = h('b', { class: 've-time mono' }), infoEl = h('small', { class: 'cam-info' });
    const panelEl = h('div', { class: 've-panel', hidden: true, role: 'region' });
    const wavePreview = h('canvas', { class: 've-audio-wave', width: 900, height: 120, 'aria-hidden': 'true' });
    const audioSeek = h('input', { class: 've-audio-seek', type: 'range', min: 0, max: dur, step: .01, value: 0, 'aria-label': t('fd.seek') });
    audioSeek.oninput = () => { pause(); seekTo(+audioSeek.value); };
    const audioStage = audioOnly ? h('section', { class: 've-audio-stage' }, [
      h('span', { class: 've-audio-tag', text: (o.audioInfo?.codec || 'WAV').toUpperCase() + (o.audioInfo?.rate ? ' · ' + o.audioInfo.rate / 1000 + ' kHz' : '') }),
      h('h2', { text: o.file.name }), wavePreview, audioSeek
    ]) : null;
    const tools = [['clip', 've.clip', IC.clip], ['sound', 've.sound', IC.sound], ['filters', 've.filters', IC.filter], ['bg', 've.bg', IC.bg]]
      .filter(([k]) => R?.gl || (k !== 'filters' && k !== 'bg')).filter(([k]) => ac || k !== 'sound');
    const toolB = {};
    const rail = h('div', { class: 've-rail' }, tools.map(([k, key, icon]) => toolB[k] = h('button', { class: 've-tool', type: 'button', onclick: () => open(k) }, [h('span', { html: icon }), h('small', { 'data-t': key })])));
    root.innerHTML = ''; root.classList.add('ve'); root.classList.toggle('ve-audio', audioOnly);
    root.append(v, ...(audioOnly ? [audioStage] : [cv, tap, playI, h('div', { class: 'cam-shade t' }), h('div', { class: 'cam-shade b' })]),
      h('div', { class: 'cam-top' }, [h('button', { class: 'cam-ic', type: 'button', 'aria-label': t('fd.retake'), html: ic.back, onclick: () => o.onBack() })]),
      rail,
      h('div', { class: 'cam-bot ve-bot' }, [timeEl, infoEl,
        h('div', { class: 'mx-editor-actions' }, [
          audioOnly ? h('button', { class: 'btn small', type: 'button', text: t('ve.play'), onclick: () => playing ? pause() : play() }) : null,
          o.onOriginal ? h('button', { class: 'btn small', type: 'button', text: t('mc.original'), onclick: o.onOriginal }) : null,
          o.onCover ? h('button', { class: 'btn small', type: 'button', text: t('ve.b.image'), onclick: o.onCover }) : null,
          o.onSaveMix ? h('button', { class: 'btn small', type: 'button', text: t('mx.saveAudio'), onclick: o.onSaveMix }) : null
        ]),
        h('div', { class: 'cam-acts' }, [
        h('button', { class: 'btn cam-ghost', type: 'button', html: ic.restart + '<span data-t="fd.retake"></span>', onclick: () => o.onBack() }),
        h('button', { class: 'btn primary', type: 'button', 'data-t': 'fd.next', onclick: () => o.onNext() })])]),
      panelEl);
    PD.i18n.apply(root);
    function layout() {
      if (audioOnly || !v.videoWidth) return;
      const W = innerWidth, H = innerHeight, ph = panel ? panelEl.offsetHeight : 0, box = { x: 0, y: 0, w: W, h: H - ph };
      place(cv, cv.width, cv.height, panel ? { x: 8, y: 8, w: W - 16, h: Math.max(60, box.h - 16) } : box, !panel && (cv.width > cv.height) === (W > H));
      tap.style.height = box.h + 'px';
    }
    function cropSize(crop = S.crop) {
      let w = v.videoWidth, h = v.videoHeight;
      const ratio = cropRatios[crop];
      if (ratio && w && h) { if (w / h > ratio) w = h * ratio; else h = w / ratio; }
      return [w, h];
    }
    function sizeCanvas(max, short) {
      const [w, h] = cropSize();
      if (!w || !h) return;
      const k = Math.min(1, max / Math.max(w, h), (short || 1e9) / Math.min(w, h));
      cv.width = Math.max(2, Math.round(w * k / 2) * 2); cv.height = Math.max(2, Math.round(h * k / 2) * 2);
    }
    const previewSize = () => sizeCanvas(Math.min(1440, Math.max(innerWidth, innerHeight) * Math.min(2, devicePixelRatio || 1)));
    v.addEventListener('loadedmetadata', () => {
      if (isFinite(v.duration) && v.duration > 0 && Math.abs(v.duration - dur) > .05) { const full = S.segs.length === 1 && S.segs[0].a === 0; dur = v.duration; S.segs.forEach(s => { s.b = Math.min(s.b, dur); }); if (full) S.segs[0].b = dur; }
      if (audioOnly) audioSeek.max = dur; else previewSize();
      layout(); needs = true;
    });
    v.addEventListener('loadeddata', () => { needs = true; });
    addEventListener('resize', layout);
    function paintTime() { const t = v.currentTime, i = segIdx(t); let done = 0; for (let k = 0; k < S.segs.length && k < (i < 0 ? S.segs.length : i); k++) done += S.segs[k].b - S.segs[k].a; if (i >= 0) done += t - S.segs[i].a; timeEl.textContent = PD.fmtTime(done) + ' / ' + PD.fmtTime(total()); }
    function paintInfo() {
      const d = dirty();
      if (audioOnly) {
        const size = (orig ? total() * orig.sampleRate * orig.numberOfChannels * 3 : o.file.size) / 1048576;
        infoEl.textContent = (d ? t('mx.audioExport') + ' · ' : '') + (d && orig ? size : o.file.size / 1048576).toFixed(1) + ' MB'
          + ((d && size > o.roomMB) || (!d && o.file.size > o.roomMB * 1048576) ? ' · ' + t('mx.trimToFit', { n: o.roomMB }) : '');
      } else if (o.mustRender) { infoEl.textContent = t('fd.squeeze', { s: Math.ceil(o.file.size / 1048576), n: o.roomMB }); }
      else infoEl.textContent = o.meta.w + '×' + o.meta.h + ' · ' + PD.fmtTime(total()) + (d ? ' · ' + t('ve.edited') : ' · ' + (o.file.size / 1048576).toFixed(1) + ' MB · ' + t('fd.asIs'));
      toolB.clip && toolB.clip.classList.toggle('set', S.segs.length > 1 || S.segs[0].a > .05 || S.segs[0].b < dur - .05);
      toolB.sound && toolB.sound.classList.toggle('set', fxOn());
      toolB.filters && toolB.filters.classList.toggle('set', pictureChanged());
      toolB.bg && toolB.bg.classList.toggle('set', S.bg !== 'none');
    }
    const changed = () => { ver++; needs = true; paintInfo(); tls.forEach(x => x.paint()); paintPanel(); };

    /* ---- the timeline: the clip's frames (or its waveform), the parts that stay, their edges, the playhead ---- */
    const tls = [], cuts = [];
    let zoom = 1, zoomAt = 0;
    function rememberCut() {
      cuts.push({ segs: S.segs.map(s => ({ ...s })), selected: S.sel });
      if (cuts.length > 24) cuts.shift();
    }
    function undoCut() {
      const last = cuts.pop(); if (!last) return;
      S.segs = last.segs; S.sel = last.selected;
      seekTo(S.segs[S.sel].a); changed(); route(); cutSound();
    }
    function setEdge(which) {
      const clip = S.segs[S.sel], at = v.currentTime;
      if (at <= clip.a + MIN || at >= clip.b - MIN) { PD.ui.toast(t('ve.tooShort')); return; }
      rememberCut(); clip[which] = at; changed();
    }
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
      for (let x = 0; x < W; x++) { let mx = 0; const s0 = x * step, s1 = Math.min(B.length, s0 + step); for (let i = s0; i < s1; i += 4) { const a = Math.max(Math.abs(L[i]), Math.abs(Rr[i])); if (a > mx) mx = a; } const y = Math.max(1, Math.min(1, mx * 1.6) * H / 2); c.fillRect(x, H / 2 - y, 1, y * 2); }
      if (audioOnly) {
        const ctx = wavePreview.getContext('2d'); ctx.clearRect(0, 0, wavePreview.width, wavePreview.height);
        ctx.drawImage(waveCv, 0, 0, wavePreview.width, wavePreview.height);
        paintInfo();
      }
      tls.forEach(x => x.paint());
    }
    function timeline(kind) {
      const cvs = h('canvas', { class: 've-tl-c' }), segBox = h('div', { class: 've-tl-segs' }), ph = h('i', { class: 've-ph' });
      const view = () => {
        const length = dur / (kind === 'thumbs' ? zoom : 1);
        return { length, from: kind === 'thumbs' ? Math.max(0, Math.min(dur - length, zoomAt - length / 2)) : 0 };
      };
      const frac = at => { const { from, length } = view(); return (at - from) / length; };
      const el = h('div', { class: 've-tl' + (kind === 'wave' ? ' wave' : ''), role: 'slider', 'aria-label': t('fd.seek'), tabindex: '0' }, [cvs, segBox, ph]);
      function paint() {
        const w = el.clientWidth, hh = el.clientHeight, dpr = Math.min(2, devicePixelRatio || 1); if (!w) return;
        if (cvs.width !== Math.round(w * dpr)) { cvs.width = Math.round(w * dpr); cvs.height = Math.round(hh * dpr); }
        const c = cvs.getContext('2d'), W = cvs.width, H = cvs.height; c.clearRect(0, 0, W, H);
        if (kind === 'thumbs' && thumbs) {
          const tw = thumbs.width / thumbN, th = thumbs.height, sw = W * zoom / thumbN, k = Math.min(tw / sw, th / H);
          for (let i = 0; i < thumbN; i++) {
            const x = frac(dur * i / thumbN) * W;
            if (x + sw < 0 || x >= W) continue;
            c.drawImage(thumbs, i * tw + (tw - sw * k) / 2, (th - H * k) / 2, sw * k, H * k, x, 0, Math.ceil(sw), H);
          }
        }
        if ((kind === 'wave' || audioOnly) && waveCv) c.drawImage(waveCv, 0, 0, W, H);
        c.fillStyle = 'rgba(0,0,0,.66)'; let prev = 0;
        S.segs.forEach(s => { if (s.a > prev) c.fillRect(frac(prev) * W, 0, (frac(s.a) - frac(prev)) * W, H); prev = s.b; });
        if (prev < dur) c.fillRect(frac(prev) * W, 0, W - frac(prev) * W, H);
        segBox.innerHTML = '';
        S.segs.forEach((s, i) => {
          const start = frac(s.a), end = frac(s.b);
          if (end < 0 || start > 1) return;
          const d = h('div', { class: 've-seg' + (i === S.sel && kind === 'thumbs' ? ' on' : '') + (s.muted ? ' is-muted' : '') });
          d.style.left = Math.max(0, start) * 100 + '%'; d.style.width = (Math.min(1, end) - Math.max(0, start)) * 100 + '%';
          if (kind === 'thumbs' && i === S.sel) {
            if (start >= 0) d.append(h('span', { class: 've-h l', 'data-h': 'l' }));
            if (end <= 1) d.append(h('span', { class: 've-h r', 'data-h': 'r' }));
          }
          segBox.appendChild(d);
        });
        head();
      }
      function head() { const x = frac(v.currentTime); ph.hidden = x < 0 || x > 1; ph.style.left = x * 100 + '%'; el.setAttribute('aria-valuenow', String(Math.round(v.currentTime))); el.setAttribute('aria-valuemax', String(Math.round(dur))); }
      el.addEventListener('pointerdown', e => {
        const r = el.getBoundingClientRect(), { from, length } = view();
        const at = x => Math.max(0, Math.min(dur, from + (x - r.left) / r.width * length)), hd = kind === 'thumbs' && e.target.dataset ? e.target.dataset.h : null;
        pause(); if (hd) rememberCut(); try { el.setPointerCapture(e.pointerId); } catch (_) {}
        const mv = ev => {
          const x = at(ev.clientX);
          if (hd) {
            const i = S.sel, s = S.segs[i], lo = i ? S.segs[i - 1].b : 0, hi = i < S.segs.length - 1 ? S.segs[i + 1].a : dur;
            if (hd === 'l') { s.a = Math.max(lo, Math.min(x, s.b - MIN)); seekTo(s.a); } else { s.b = Math.min(hi, Math.max(x, s.a + MIN)); seekTo(s.b - .04); }
            tls.forEach(q => q.paint());
          } else {
            const i = segIdx(x);
            if (i >= 0 && i !== S.sel && kind === 'thumbs') { S.sel = i; tls.forEach(q => q.paint()); paintPanel(); }
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
    const section = key => h('div', { class: 've-sec', 'data-t': key });
    const actB = (icon, key, fn) => h('button', { class: 'btn', type: 'button', html: icon + '<span data-t="' + key + '"></span>', onclick: fn });

    function split() {
      const t0 = v.currentTime, i = segIdx(t0); if (i < 0) return;
      const s = S.segs[i]; if (t0 - s.a < MIN || s.b - t0 < MIN) { PD.ui.toast(t('ve.tooShort')); return; }
      rememberCut(); S.segs.splice(i, 1, { ...s, b: t0 }, { ...s, a: t0 }); S.sel = i + 1; changed();
    }
    function delSeg() {
      if (S.segs.length < 2) { PD.ui.toast(t('ve.oneLeft')); return; }
      rememberCut(); S.segs.splice(S.sel, 1); S.sel = Math.min(S.sel, S.segs.length - 1); seekTo(S.segs[S.sel].a); changed();
    }
    let dnState = null;
    function runDenoise() {
      if (!orig || !ac) return;
      const job = ++dnJob, amt = S.aud.dnAmt, profile = noiseAt;
      const key = [amt, profile].join(':');
      if (clean && cleanKey === key) { makeWave(); if (playing) startAudio(); return; }
      const show = p => { if (dnState) dnState.textContent = p == null ? '' : t('ve.dnWork', { p }); };
      show(0);
      dnRun = denoise(ac, orig, amt / 100, p => { if (job === dnJob) show(p); }, () => job !== dnJob || dead, profile).then(out => {
        if (job !== dnJob || dead) return;
        clean = out; cleanKey = key; show(null); makeWave(); if (playing) startAudio();
      }, e => { if (job === dnJob && e?.code !== 'cancel') { if (dnState) dnState.textContent = t('ve.dnError'); S.aud.dn = false; ver++; paintInfo(); } }).then(() => { if (job === dnJob) dnRun = null; });
    }

    async function separateSection(status, button) {
      if (stemJob || !orig || !PD.ai?.separateExcerpt) return;
      const from = Math.min(v.currentTime, Math.max(0, orig.duration - 1)), to = Math.min(from + 30, orig.duration);
      const job = stemJob = new AbortController();
      pause(); button.disabled = true; stemProgress = 0;
      try {
        status.textContent = t('ve.dnWork', { p: 0 });
        const separated = await PD.ai.separateExcerpt(orig, from, to, job.signal, p => {
          stemProgress = p; status.textContent = t('ve.dnWork', { p });
        });
        if (dead) return;
        clipStems = { from, to, tracks: separated.sources.map((id, index) => {
          const samples = separated.stems[index], buffer = ac.createBuffer(samples.length, samples[0].length, separated.rate);
          samples.forEach((channel, c) => buffer.copyToChannel(channel, c));
          return { id, buffer, amount: 0 };
        }) };
        ver++;
        if (panel === 'sound') open('sound'); else paintInfo();
      } catch (_) {
        if (!job.signal.aborted && !dead) {
          status.textContent = t('ve.sepError');
          if (!status.isConnected) PD.ui.toast(t('ve.sepError'));
        }
      } finally { stemJob = null; button.disabled = false; }
    }

    const PANELS = {
      clip() {
        if (!audioOnly) makeThumbs();
        const tl = timeline('thumbs'), len = h('small', { class: 've-len mono' });
        const muted = actB(IC.sound, 've.mutePart', () => {
          rememberCut(); S.segs[S.sel].muted = !S.segs[S.sel].muted; changed(); route(); cutSound();
        });
        const undo = actB('', 've.undo', undoCut);
        const crop = h('select', { class: 'input', 'aria-label': t('ve.crop') },
          [h('option', { value: '', text: t('ve.f.none') }), ...Object.keys(cropRatios).map(value => h('option', { value, text: value }))]);
        crop.value = S.crop;
        crop.onchange = () => {
          const [w, h] = cropSize(crop.value);
          if (!q720(Math.floor(w), Math.floor(h))) { crop.value = S.crop; PD.ui.toast(t('mc.cropQuality')); return; }
          S.crop = crop.value; previewSize(); layout(); changed();
        };
        const clipActions = [actB(IC.split, 've.split', split), actB(IC.trash, 've.del', delSeg),
          actB('', 've.trimIn', () => setEdge('a')), actB('', 've.trimOut', () => setEdge('b')), muted, undo,
          actB(ic.restart, 've.reset', () => { rememberCut(); S.segs = [{ a: 0, b: dur }]; S.sel = 0; seekTo(0); changed(); route(); })];
        return { el: [tl.el, len,
          slider('ve.zoom', 1, 12, 1, () => zoom, x => { if (zoom === 1) zoomAt = v.currentTime; zoom = x; tl.paint(); }, x => x + '×'),
          h('div', { class: 've-acts' }, clipActions), R?.gl ? h('label', { class: 'mc-field' }, [h('span', { 'data-t': 've.crop' }), crop]) : null,
          h('small', { class: 've-hint', 'data-t': 've.clipHint' })].filter(Boolean),
          paint() {
            len.textContent = t('ve.len', { t: PD.fmtTime(total()) });
            muted.querySelector('span').textContent = t(S.segs[S.sel]?.muted ? 've.unmutePart' : 've.mutePart');
            undo.disabled = !cuts.length;
          } };
      },
      sound() {
        const transport = orig ? timeline('wave').el : null;
        const rack = MIX.panel({
          t, chain, tab: rackTab, preset: S.preset, get: () => S.aud,
          set(key, value, refresh) {
            S.preset = 'custom'; S.aud[key] = value;
            chain.set(S.aud, refresh); ver++; paintInfo(); route();
          },
          choosePreset(id) {
            S.preset = id;
            S.aud = { ...AUD0, ...MIX.presets[id], dn: S.aud.dn, dnAmt: S.aud.dnAmt };
            chain.set(S.aud); ver++; paintInfo(); route();
          },
          select(key) { rackTab = key; dnState = null; },
          compared: () => compare,
          compare() { compare = !compare; chain.compare(compare); cutSound(); makeWave(); if (playing) startAudio(); },
          play: () => playing ? pause() : play(),
          cleanup() {
            const kids = [];
        if (orig) {
          const sw = h('button', { class: 've-sw' + (S.aud.dn ? ' on' : ''), type: 'button', role: 'switch', 'aria-checked': String(S.aud.dn), 'aria-label': t('ve.dn') });
          dnState = h('small', { class: 've-st', role: 'status' });
          sw.onclick = () => {
            S.aud.dn = !S.aud.dn; sw.classList.toggle('on', S.aud.dn); sw.setAttribute('aria-checked', String(S.aud.dn));
            ver++; paintInfo(); route();
            if (S.aud.dn) runDenoise();
            else { dnJob++; dnRun = null; dnState.textContent = ''; makeWave(); if (playing) startAudio(); }
          };
          const profile = h('small', { class: 've-hint', text: profileLabel() });
          function profileLabel() { return noiseAt == null ? t('ve.dnAuto') : t('ve.dnProfileAt', { time: PD.fmtTime(noiseAt) }); }
          function setProfile(at) {
            noiseAt = at;
            profile.textContent = profileLabel();
            if (!S.aud.dn) sw.click(); else { ver++; runDenoise(); }
          }
          kids.push(h('div', { class: 've-swrow' }, [h('b', { 'data-t': 've.dn' }), dnState, sw]),
            slider('ve.dnAmt', 10, 100, 5, () => S.aud.dnAmt, x => { S.aud.dnAmt = x; ver++; }, pct, () => { if (S.aud.dn) runDenoise(); }),
            h('div', { class: 've-acts' }, [
              actB('', 've.dnProfile', () => { pause(); setProfile(Math.min(v.currentTime, Math.max(0, orig.duration - .8))); }),
              actB('', 've.dnAuto', () => setProfile(null))
            ]), profile, h('small', { class: 've-hint', 'data-t': 've.dnHint' }));
          if (dnRun) dnState.textContent = t('ve.dnWork', { p: 0 });
        } else if (decoded) kids.push(h('small', { class: 've-hint', 'data-t': audWhy || 've.noAudio' }));
        if (orig && PD.ai?.separateExcerpt && !elSrc) {
          const status = h('small', { class: 've-hint', role: 'status',
            text: stemJob ? t('ve.dnWork', { p: stemProgress }) : clipStems ? t('ve.sepReady', { from: PD.fmtTime(clipStems.from), to: PD.fmtTime(clipStems.to) }) : '' });
          const start = h('button', { class: 'btn', type: 'button', text: t('ve.separate'), disabled: !!stemJob || !!clipStems,
            onclick: () => separateSection(status, start) });
          const controls = (clipStems?.tracks || []).map(track => slider('ve.sep.' + track.id, 0, 100, 1,
            () => track.amount, amount => { track.amount = amount; ver++; paintInfo(); route(); if (playing) startAudio(); }, pct));
          kids.push(h('details', { class: 've-plugin' }, [h('summary', { text: t('ve.stems') }), h('small', { class: 've-hint', 'data-t': 've.sepHint' }), start, status, ...controls,
            clipStems ? actB(ic.restart, 've.reset', () => { clipStems = null; ver++; paintInfo(); open('sound'); }) : null]));
        }
            if (!orig && !kids.length) kids.push(h('p', { class: 've-hint', text: t('mx.empty') }));
            return kids;
          }
        });
        return { el: [transport, rack.el].filter(Boolean), meter: rack.meter };
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
        function adjust(key, title, min, max, scale) {
          return slider(title, min, max, 1, () => Math.round(S.grade[key] * scale),
            value => { S.grade[key] = value / scale; needs = true; ver++; paintInfo(); }, x => (x > 0 ? '+' : '') + x);
        }
        return { el: [chips, slider('ve.amount', 0, 100, 5, () => Math.round(S.fk * 100), x => { S.fk = x / 100; needs = true; ver++; paintInfo(); }, pct),
          adjust('exp', 've.exposure', -100, 100, 100), adjust('con', 've.contrast', -60, 60, 100),
          adjust('sat', 've.saturation', -100, 80, 100), adjust('temp', 've.temperature', -25, 25, 100)],
          paint() { chips.querySelectorAll('.ve-chip').forEach(b => { const on = b.dataset.k === S.filter; b.classList.toggle('on', on); b.setAttribute('aria-checked', String(on)); }); } };
      },
      bg() {
        const st = h('small', { class: 've-st', role: 'status' }), chips = h('div', { class: 've-chips', role: 'radiogroup' });
        let seq = 0;
        const choose = async k => {
          const token = ++seq;
          if (k === 'image' || k === 'video') { if (!(await pickBg(k)) || seq !== token) return; }
          S.bg = k; changed();
          st.textContent = '';
          if (k !== 'none' && S.bgKey === 'person' && !seg) {
            st.textContent = t('ve.bgLoad');
            try { seg = await segmenter(); if (dead || token !== seq) return; st.textContent = ''; maskF = null; needs = true; }
            catch (_) { if (token === seq) { st.textContent = t('ve.bgFail'); S.bg = 'none'; changed(); } }
          }
        };
        const method = h('select', { class: 'input', 'aria-label': t('ve.key') },
          ['person', 'green', 'blue'].map(id => h('option', { value: id, text: t('ve.key.' + id) })));
        method.value = S.bgKey;
        method.onchange = async () => {
          S.bgKey = method.value; changed();
          if (S.bgKey === 'person' && S.bg !== 'none' && !seg) {
            try { st.textContent = t('ve.bgLoad'); seg = await segmenter(); st.textContent = ''; needs = true; }
            catch (_) { st.textContent = t('ve.bgFail'); S.bg = 'none'; changed(); }
          }
        };
        const color = h('input', { type: 'color', value: S.bgColor, 'aria-label': t('ve.b.color'),
          oninput: event => { S.bgColor = event.target.value; changed(); } });
        const colorField = h('label', { class: 've-color' }, [h('span', { 'data-t': 've.b.color' }), color]);
        [['none', IC.none], ['black', IC.black], ['color', IC.black], ['blur', IC.blur], ['image', IC.image], ['video', IC.video]].forEach(([k, icon]) =>
          chips.appendChild(h('button', { class: 've-chip', type: 'button', role: 'radio', 'data-k': k, onclick: () => choose(k) }, [h('span', { class: 've-ico', html: icon }), h('span', { 'data-t': 've.b.' + k })])));
        return { el: [h('label', { class: 'mc-field' }, [h('span', { 'data-t': 've.key' }), method]), chips, colorField,
          slider('ve.keyEdge', -25, 25, 1, () => Math.round(S.bgEdge * 100), x => { S.bgEdge = x / 100; changed(); }, x => String(x)),
          st, h('small', { class: 've-hint', 'data-t': 've.bgHint' })],
          paint() {
            colorField.hidden = S.bg !== 'color';
            chips.querySelectorAll('.ve-chip').forEach(b => { const on = b.dataset.k === S.bg; b.classList.toggle('on', on); b.setAttribute('aria-checked', String(on)); });
          } };
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
      if (panel !== k) pause();
      const previousScroll = panel === k ? panelEl.scrollTop : 0;
      panel = k; dnState = null;
      const title = { clip: 've.clip', sound: 've.sound', filters: 've.filters', bg: 've.bg' }[k];
      tls.length = 0; cur = PANELS[k]();
      panelEl.innerHTML = '';
      panelEl.append(h('div', { class: 've-ph-head' }, [h('h3', { 'data-t': title }), h('button', { class: 'btn small primary', type: 'button', 'data-t': 've.done', onclick: close })]), ...cur.el);
      panelEl.hidden = false; panelEl.classList.toggle('ve-mixing', k === 'sound');
      panelEl.setAttribute('aria-label', t(title));
      panelEl.scrollTop = previousScroll;
      root.classList.add('panel'); PD.i18n.apply(panelEl);
      route();
      requestAnimationFrame(() => { layout(); tls.forEach(x => x.paint()); cur?.paint?.(); });
    }
    function close() { compare = false; chain?.compare(false); panel = null; cur = null; tls.length = 0; dnState = null; panelEl.hidden = true; panelEl.innerHTML = ''; root.classList.remove('panel'); layout(); needs = true; route(); if (playing) startAudio(); }
    function paintPanel() { cur?.paint?.(); }

    async function renderSound(onP, download) {
      await audioReady;
      if (dead) throw fail('cancel');
      if (!orig) throw fail('noRender');
      const signal = curBuf(), OC = window.OfflineAudioContext || window.webkitOfflineAudioContext;
      if (!OC) throw fail('noRender');
      const sr = signal.sampleRate, channels = signal.numberOfChannels, length = total();
      const tail = S.segs.at(-1)?.muted ? 0 : Math.min(MIX.tailSeconds(S.aud), Math.max(0, 900 - length));
      const frames = Math.round((length + tail) * sr), skip = Math.round(.012 * sr);
      const bytes = frames * channels * 3 + 44 + (frames * channels * 3 % 2);
      if (!download && bytes > o.roomMB * 1048576) throw Object.assign(fail('reelHeavy'), { s: Math.ceil(bytes / 1048576), n: o.roomMB });
      if (bytes > 320 * 1048576) throw fail('noRender');
      const ctx = new OC(channels, frames + skip, sr), mix = MIX.chain(ctx);
      mix.set(S.aud); mix.out.connect(ctx.destination);
      let at = 0;
      function add(buf, start, end, offset, level, ramp) {
        if (end <= start || start >= buf.duration) return;
        const time = Math.min(end - start, buf.duration - start);
        const src = ctx.createBufferSource(), volume = ctx.createGain();
        src.buffer = buf; src.connect(volume).connect(mix.inp);
        const fade = Math.min(ramp, time / 3);
        volume.gain.setValueAtTime(0, offset); volume.gain.linearRampToValueAtTime(level, offset + fade);
        volume.gain.setValueAtTime(level, offset + time - fade); volume.gain.linearRampToValueAtTime(0, offset + time);
        src.start(offset, start, time);
      }
      for (const s of S.segs) {
        if (!s.muted) {
          add(signal, s.a, s.b, at, 1, .006);
          if (clipStems) {
            const from = Math.max(s.a, clipStems.from), to = Math.min(s.b, clipStems.to);
            for (const track of clipStems.tracks) if (track.amount && to > from)
              add(track.buffer, from - clipStems.from, to - clipStems.from, at + from - s.a, -track.amount / 100, .018);
          }
        }
        at += s.b - s.a;
      }
      onP(4);
      const output = await ctx.startRendering();
      if (exporting.cancel) throw fail('cancel');
      onP(75);
      return PD.musicCommunity.encodeWav(output, skip, () => exporting.cancel, p => onP(Math.round(75 + p * 25)));
    }

    /* ---- the result: drawn again frame by frame and recorded, with the sound through the same effects ---- */
    async function render(onP, download = false) {
      if (exporting) throw fail('busy');
      pause(); compare = false; chain?.compare(false);
      exporting = { cancel: false };
      try {
        if (dnRun) await dnRun;
        if (exporting.cancel) throw fail('cancel');
        if (audioOnly) return await renderSound(onP, download);
        return await renderVideo(onP);
      } finally { exporting = null; route(); needs = true; layout(); }
    }
    async function renderVideo(onP) {
      if (!q720(v.videoWidth, v.videoHeight)) throw fail('reelSmall');
      const kf = pick(o.file.type), mime = kf?.m;
      if (!mime || !cv.captureStream) throw fail('noRender');
      if (R.lost) throw fail('noRender');
      if (S.bg !== 'none' && S.bgKey === 'person' && !seg) { try { seg = await segmenter(); } catch (_) { throw fail('bgFail'); } }
      const useBuf = !elSrc && !!curBuf();
      if (!useBuf) useElement();
      if (!ac || (!useBuf && !elSrc)) throw fail('noRender');
      const wasMuted = v.muted;
      const tot = total(), A = kf && !kf.a ? 0 : Math.min(kf ? kf.a : AUDIO, tot >= 240 ? 128000 : AUDIO), room = o.roomMB * 1048576 * 8 * .88 / Math.max(1, tot) - A;
      const pw = cv.width, phh = cv.height;
      const [cw, ch] = cropSize();
      if (!q720(Math.floor(cw), Math.floor(ch))) throw fail('cropQuality');
      const chunks = [];
      let vs, dest, rec;
      try {
        if (useBuf) v.muted = true;
        sizeCanvas(Math.max(3840, 720 * Math.max(cw, ch) / Math.min(cw, ch)), room < 2.5e6 ? 720 : room < 8e6 ? 1080 : 0);
        if (!q720(cv.width, cv.height)) throw fail('cropQuality');
        const fps = 30;
        vs = cv.captureStream(fps);
        const tracks = vs.getVideoTracks().slice();
        dest = ac.createMediaStreamDestination();
        chain.out.connect(dest);
        spk.gain.value = 0;
        tracks.push(...dest.stream.getAudioTracks());
        const vbr = Math.round(Math.max(1e5, Math.min(room, cv.width * cv.height * fps * .3, 60e6)));
        const ro = { mimeType: mime, videoBitsPerSecond: vbr, videoKeyFrameIntervalDuration: 2000 };
        if (A) ro.audioBitsPerSecond = A;
        const output = new MediaStream(tracks);
        try { rec = new MediaRecorder(output, ro); } catch (_) { rec = new MediaRecorder(output, { mimeType: mime }); }
        rec.ondataavailable = e => { if (e.data && e.data.size) chunks.push(e.data); };
        let recordingError, doneT = 0;
        rec.onerror = error => { recordingError = error; if (exporting) exporting.cancel = true; };
        const stopped = new Promise(resolve => { rec.onstop = resolve; });
        if (ac) await ac.resume();
        for (let i = 0; i < S.segs.length; i++) {
          const s = S.segs[i];
          if (i) { if (rec.state === 'recording') rec.pause(); if (ac) await ac.suspend(); }
          await seekEl(v, s.a); frame(true);
          if (!i) rec.start(1000); else if (rec.state === 'paused') rec.resume();
          if (ac) await ac.resume();
          await playRange(s, p => onP(Math.min(99, Math.round((doneT + p) / tot * 100))));
          doneT += s.b - s.a;
          if (recordingError) throw fail('noRender');
          if (exporting.cancel) throw fail('cancel');
        }
        rec.stop();
        let stopTimer;
        const timeout = new Promise((_, reject) => { stopTimer = setTimeout(() => reject(fail('noRender')), 15000); });
        try { await Promise.race([stopped, timeout]); } finally { clearTimeout(stopTimer); }
      } catch (e) { try { if (rec && rec.state !== 'inactive') rec.stop(); } catch (_) {} throw e; }
      finally {
        stopAudio(); try { v.pause(); } catch (_) {}
        if (dest) { try { chain.out.disconnect(dest); } catch (_) {} spk.gain.value = 1; }
        vs?.getTracks().forEach(track => track.stop());
        dest?.stream.getTracks().forEach(track => track.stop());
        cv.width = pw; cv.height = phh; v.muted = wasMuted; if (ac) ac.resume().catch(() => {});
      }
      const type = (rec.mimeType || mime).split(';')[0];
      onP(100);
      if (!chunks.length) throw fail('noRender');
      return new File(chunks, 'panduri-edit.' + (/mp4/.test(type) ? 'mp4' : 'webm'), { type });
    }
    function playRange(s, onP) {
      return new Promise((res, rej) => {
        let fin = false, guard = 0;
        const end = error => { if (fin) return; fin = true; clearInterval(guard); v.removeEventListener('timeupdate', tu); try { v.pause(); } catch (_) {} stopAudio(); if (error) rej(error); else res(); };
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
        guard = setInterval(() => { if (v.currentTime === last) { if (++still > 16) end(fail('noRender')); } else { still = 0; last = v.currentTime; } }, 500);   // a stall of 8 s ends the part rather than hanging
        v.addEventListener('timeupdate', tu);
        v.play().then(() => { startAudio(true); next(); }, end);
      });
    }

    raf = requestAnimationFrame(loop); paintInfo();
    return {
      dirty, version: () => ver, length: total,
      render, cancel() { if (exporting) exporting.cancel = true; },
      /** call inside the tap that starts a render: an iPhone lets sound start only there */
      prime() { if (ac && ac.state !== 'running') ac.resume().catch(() => {}); },
      back() { if (panel) { close(); return true; } return false; },
      hide() { pause(); hidden = true; root.hidden = true; },
      show() { hidden = false; root.hidden = false; needs = true; layout(); },
      destroy() {
        dead = true; stemJob?.abort(); if (exporting) exporting.cancel = true; cancelAnimationFrame(raf); pause(); dnJob++; removeEventListener('resize', layout);
        try { ac && ac.close(); } catch (_) {}
        try { if (AS) AS.type = asPrev || 'auto'; } catch (_) {}   // the camera needs the microphone back
        v.removeAttribute('src'); try { v.load(); } catch (_) {}
        if (bgV) { bgV.pause(); bgV.removeAttribute('src'); } if (bgUrl) URL.revokeObjectURL(bgUrl);
        URL.revokeObjectURL(url); root.innerHTML = ''; root.classList.remove('ve', 've-audio', 'panel', 'playing');
      }
    };
  }
  return { mount, denoise, gifFrames, place, pickFormat: pick, rememberFormat: remember, forgetFormat: forget, rejectEncoder, hasSound };
})();
