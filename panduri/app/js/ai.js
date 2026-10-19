/* =====================================================================
   AI studio — "load your own song".
   · Chords, key and tempo: analysed on the device in a second or two
     (chroma from the spectrum, 24 major/minor templates, Viterbi
     smoothing; key by Krumhansl profiles; tempo from onset autocorrelation).
     Every chord is shown on the panduri neck with the app's chord library.
     These are estimates and say so.
   · Playback: any speed 50–125 % without changing the pitch.
   · Instruments (premium): the Demucs v4 AI model (Meta, MIT) runs on the
     device in a worker (aiworker.js) and splits the song into vocals,
     drums, bass and the rest; each gets its own volume, mute and solo,
     and can be saved as a WAV file. Nothing is uploaded anywhere.
   ===================================================================== */
PD.i18n.add({
  'ai.title': ['AI სტუდია', 'AI studio'], 'ai.lead': ['ჩატვირთე შენი სიმღერა: AI ამოიცნობს აკორდებს, ტონალობას და ტემპს, ფანდურზე გაჩვენებს თითებს და ინსტრუმენტებად დაყოფს. ყველაფერი შენს მოწყობილობაზე ხდება — არსად იგზავნება.', 'Load your own song: the AI finds the chords, key and tempo, shows them on the panduri and splits the song into instruments. Everything happens on your device — nothing is uploaded.'],
  'ai.pick': ['სიმღერის ჩატვირთვა', 'Load a song'], 'ai.pickD': ['MP3, M4A, WAV, ვიდეოც — ტელეფონიდან ან კომპიუტერიდან', 'MP3, M4A, WAV, even video — from your phone or computer'], 'ai.reading': ['ვკითხულობ ფაილს…', 'Reading the file…'], 'ai.analysing': ['AI უსმენს: აკორდები, ტონალობა, ტემპი…', 'The AI is listening: chords, key, tempo…'],
  'ai.bad': ['ამ ფაილს ვერ ვკითხულობ. სცადე MP3, M4A ან WAV.', 'Could not read this file. Try MP3, M4A or WAV.'], 'ai.key': ['ტონალობა', 'Key'], 'ai.bpm': ['ტემპი', 'Tempo'], 'ai.chords': ['აკორდები', 'Chords'], 'ai.speed': ['სიჩქარე', 'Speed'], 'ai.transpose': ['ტრანსპოზიცია', 'Transpose'],
  'ai.est': ['AI-ის შეფასებაა — ყურით შეამოწმე. საუკეთესოდ მუშაობს მკაფიო აკორდებიან სიმღერებზე.', 'An AI estimate — check it by ear. Works best on songs with clear chords.'],
  'ai.now': ['ახლა', 'Now'], 'ai.next': ['შემდეგი', 'Next'], 'ai.nc': ['აკორდი არ არის', 'No chord'], 'ai.used': ['სიმღერაში: {n} აკორდი', 'In the song: {n} chords'],
  'ai.stems': ['ინსტრუმენტები', 'Instruments'], 'ai.stemsD': ['AI სიმღერას ყოფს: ვოკალი · დრამი · ბასი · დანარჩენი (ფანდური, გიტარა…). თითოეულს თავისი ხმა აქვს — დაუწიე ვოკალს და იმღერე, ან ამოიღე ფანდური და თავად დაუკარი.', 'The AI splits the song: vocals · drums · bass · the rest (panduri, guitar…). Each has its own volume — turn the vocals down and sing, or take the panduri out and play it yourself.'],
  'ai.split': ['ინსტრუმენტებად დაყოფა', 'Split into instruments'], 'ai.splitNote': ['პირველად AI მოდელი (~85 MB) ერთხელ ჩამოიტვირთება. 4-წუთიანი სიმღერა კომპიუტერზე რამდენიმე წუთი მუშავდება, ტელეფონზე — უფრო დიდხანს; ამ დროს აპი არ დახურო.', 'The first time, the AI model (~85 MB) downloads once. A 4-minute song takes a few minutes on a computer, longer on a phone; keep the app open meanwhile.'],
  'ai.premium': ['პრემიუმი', 'Premium'], 'ai.test': ['სატესტო წვდომა', 'Test access'], 'ai.locked': ['ინსტრუმენტებად დაყოფა პრემიუმის ფუნქციაა.', 'Splitting into instruments is a Premium feature.'],
  'ai.dl': ['მოდელი იტვირთება: {a} / {b} MB', 'Downloading the model: {a} / {b} MB'], 'ai.unpack': ['მოდელი მზადდება…', 'Preparing the model…'], 'ai.init': ['AI ეშვება…', 'Starting the AI…'], 'ai.proc': ['AI ყოფს: {p}% · დარჩა ~{m}', 'The AI is splitting: {p}% · ~{m} left'],
  'ai.fail': ['AI ვერ გაეშვა: {e}', 'The AI could not run: {e}'], 'ai.mem': ['მოწყობილობას მეხსიერება არ ეყო. სცადე უფრო მოკლე ნაწილი ან კომპიუტერი.', 'The device ran out of memory. Try a shorter part or a computer.'],
  'ai.range': ['რომელი ნაწილი', 'Which part'], 'ai.all': ['მთელი სიმღერა', 'Whole song'], 'ai.first': ['პირველი {n} წმ', 'First {n} s'], 'ai.fromHere': ['აქედან {n} წმ', '{n} s from here'],
  'ai.vocals': ['ვოკალი', 'Vocals'], 'ai.drums': ['დრამი', 'Drums'], 'ai.bass': ['ბასი', 'Bass'], 'ai.other': ['დანარჩენი (ფანდური…)', 'The rest (panduri…)'], 'ai.mute': ['ჩუმად', 'Mute'], 'ai.solo': ['მხოლოდ ეს', 'Solo'], 'ai.save': ['WAV', 'WAV'],
  'ai.stemsOn': ['ისმის AI-ით დაყოფილი ვერსია', 'Playing the AI-split version'], 'ai.orig': ['ორიგინალი', 'Original'], 'ai.mixed': ['AI მიქსი', 'AI mix'], 'ai.speedStems': ['AI მიქსში სიჩქარე ცვლის ბგერის სიმაღლესაც.', 'In the AI mix, speed also changes the pitch.'],
  'ai.recent': ['ბოლოს გაანალიზებული', 'Recently analysed'], 'ai.reload': ['ეს სიმღერა ჯერ არ იყო შენახული — აირჩიე ფაილი კიდევ ერთხელ, შემდეგ უკვე შენახული დარჩება.', 'This song was not saved yet — pick the file once more; after that it stays saved.'], 'ai.reloadS': ['შეეხე და ფაილი კიდევ ერთხელ აირჩიე', 'Tap and pick the file once more'], 'ai.forget': ['სიიდან წაშლა', 'Remove from list'], 'ai.home': ['AI: შენი სიმღერის აკორდები', 'AI: chords of your song'], 'ai.homeD': ['ჩატვირთე სიმღერა — AI აკორდებს ფანდურზე გაჩვენებს და ინსტრუმენტებს დაყოფს', 'Load a song — the AI shows its chords on the panduri and splits the instruments']
});

PD.ai = (() => {
  const KEEP = 12;   // songs kept on the device for reopening
  const h = PD.h, t = PD.i18n.t, ic = PD.ic, TH = PD.theory;
  const NAMES = ['C', 'C♯', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'A♭', 'A', 'B♭', 'B'];
  const SR = 44100;
  const BASE = (() => { const p = location.pathname; return location.protocol.startsWith('http') && /\/panduri\/app\//.test(p) ? new URL('../ai/', location.href).href : 'https://yanx447.github.io/index.html/panduri/ai/'; })();
  const allowed = () => !!(PD.premium && PD.premium.active) || !!PD.store.get('author', false) || !!PD.store.get('ai.test', false);

  /* ======================= analysis: chords · key · tempo ======================= */
  function fftMag(N) {   // a small real FFT for analysis (radix-2)
    const rev = new Uint32Array(N), b = Math.log2(N), cs = new Float32Array(N / 2), sn = new Float32Array(N / 2);
    for (let i = 0; i < N; i++) { let r = 0; for (let k = 0; k < b; k++) r |= ((i >> k) & 1) << (b - 1 - k); rev[i] = r; }
    for (let i = 0; i < N / 2; i++) { cs[i] = Math.cos(2 * Math.PI * i / N); sn[i] = -Math.sin(2 * Math.PI * i / N); }
    const re = new Float32Array(N), im = new Float32Array(N), w = new Float32Array(N); for (let i = 0; i < N; i++) w[i] = .5 - .5 * Math.cos(2 * Math.PI * i / N);
    return (x, off, out) => {
      for (let i = 0; i < N; i++) { const j = rev[i], v = x[off + i] || 0; re[j] = v * w[i]; im[j] = 0; }
      for (let size = 2; size <= N; size <<= 1) { const half = size >> 1, step = N / size; for (let i = 0; i < N; i += size) for (let j = 0, k = 0; j < half; j++, k += step) { const a = i + j, c = a + half, tr = re[c] * cs[k] - im[c] * sn[k], ti = re[c] * sn[k] + im[c] * cs[k]; re[c] = re[a] - tr; im[c] = im[a] - ti; re[a] += tr; im[a] += ti; } }
      for (let k = 0; k < N / 2; k++) out[k] = Math.sqrt(re[k] * re[k] + im[k] * im[k]);
    };
  }
  /** mono 22.05 kHz signal → { chords:[{t0,t1,root,q,name}], key, bpm, beats } */
  async function analyse(mono, sr, onProgress, opt) {
    opt = Object.assign({ bassW: .12, change: .5, keyBonus: .06, smooth: .2, nc: .35, third: .85 }, opt || {});
    const N = 8192, HOPA = 2048, fft = fftMag(N), mag = new Float32Array(N / 2), frames = Math.max(1, Math.floor((mono.length - N) / HOPA));
    // bins → pitch class, 55 Hz .. 1.76 kHz, weighted toward the middle register
    const pcOf = new Int8Array(N / 2).fill(-1), wOf = new Float32Array(N / 2);
    for (let k = 1; k < N / 2; k++) { const f = k * sr / N; if (f < 55 || f > 1760) continue; const m = 69 + 12 * Math.log2(f / 440), r = Math.round(m); if (Math.abs(m - r) > .35) continue; pcOf[k] = ((r % 12) + 12) % 12; wOf[k] = Math.exp(-Math.pow((m - 60) / 20, 2)); }
    const chroma = [], bass = [], flux = new Float32Array(frames); let prev = new Float32Array(N / 2);
    for (let i = 0; i < frames; i++) {
      fft(mono, i * HOPA, mag);
      const c = new Float32Array(12), bs = new Float32Array(12); let fl = 0;
      for (let k = 1; k < N / 2; k++) { const v = mag[k]; if (pcOf[k] >= 0) { const s = Math.sqrt(v) * wOf[k]; c[pcOf[k]] += s; if (k * sr / N < 200) bs[pcOf[k]] += Math.sqrt(v); } const d = v - prev[k]; if (d > 0 && k < 1200) fl += d; }
      prev.set(mag); flux[i] = fl;
      const mx = Math.max(...c) || 1; for (let j = 0; j < 12; j++) c[j] /= mx;
      chroma.push(c); bass.push(bs);
      if (i % 200 === 0) { onProgress && onProgress(i / frames); await new Promise(r => setTimeout(r, 0)); }
    }
    const dt = HOPA / sr;
    // tempo: autocorrelation of the onset strength, 60–180 BPM, a gentle preference for ~100
    const fm = flux.reduce((a, b) => a + b, 0) / frames || 1, on = flux.map(v => Math.max(0, v / fm - 1));
    let bestL = 0, bestS = -1; for (let bpm = 60; bpm <= 180; bpm += .5) { const L = 60 / bpm / dt; let s = 0; for (let i = Math.ceil(L); i < frames; i++) { const a = i - L, i0 = Math.floor(a), f = a - i0; s += on[i] * (on[i0] * (1 - f) + (on[i0 + 1] || 0) * f); } s *= Math.exp(-Math.pow(Math.log2(bpm / 100), 2) * .5); if (s > bestS) { bestS = s; bestL = bpm; } }
    const bpm = Math.round(bestL);
    // smooth the chroma over ~half a beat
    const win = Math.max(0, Math.round(opt.smooth * 60 / bpm / dt)), sm = chroma.map((_, i) => { const o = new Float32Array(12); let n = 0; for (let j = Math.max(0, i - win); j <= Math.min(frames - 1, i + win); j++) { for (let k = 0; k < 12; k++) o[k] += chroma[j][k]; n++; } for (let k = 0; k < 12; k++) o[k] /= n; return o; });
    // key: Krumhansl–Kessler profiles on the whole chroma
    const tot = new Float32Array(12); chroma.forEach(c => { for (let k = 0; k < 12; k++) tot[k] += c[k]; });
    const MAJ = [6.35, 2.23, 3.48, 2.33, 4.38, 4.09, 2.52, 5.19, 2.39, 3.66, 2.29, 2.88], MIN = [6.33, 2.68, 3.52, 5.38, 2.6, 3.53, 2.54, 4.75, 3.98, 2.69, 3.34, 3.17];
    const corr = (a, b) => { const ma = a.reduce((x, y) => x + y, 0) / 12, mb = b.reduce((x, y) => x + y, 0) / 12; let n = 0, da = 0, db = 0; for (let i = 0; i < 12; i++) { n += (a[i] - ma) * (b[i] - mb); da += (a[i] - ma) ** 2; db += (b[i] - mb) ** 2; } return n / Math.sqrt(da * db); };
    let key = { r: 0, q: '', s: -2 }; for (let r = 0; r < 12; r++) for (const [q, P] of [['', MAJ], ['m', MIN]]) { const rot = P.map((_, i) => P[(i - r + 12) % 12]); const c = corr(Array.from(tot), rot); if (c > key.s) key = { r, q, s: c }; }
    // chords that belong to the key get a small head start
    const dia = new Set((key.q ? [[0, 'm'], [3, ''], [5, 'm'], [7, 'm'], [7, ''], [8, ''], [10, '']] : [[0, ''], [2, 'm'], [4, 'm'], [5, ''], [7, ''], [9, 'm']]).map(([d, q]) => ((key.r + d) % 12) + q));
    // 24 triads + no chord; cosine score with the root in the bass helping
    const T = []; for (let r = 0; r < 12; r++) for (const q of ['', 'm']) { const v = new Float32Array(12); v[r] = 1; v[(r + (q ? 3 : 4)) % 12] = opt.third; v[(r + 7) % 12] = .9; T.push({ r, q, v }); }
    const score = (c, b, tpl) => { let d = 0, nc = 0, nt = 0; for (let k = 0; k < 12; k++) { d += c[k] * tpl.v[k]; nc += c[k] * c[k]; nt += tpl.v[k] * tpl.v[k]; } let s = d / Math.sqrt(nc * nt + 1e-9); const bm = Math.max(...b) || 1; s += opt.bassW * (b[tpl.r] / bm); return s; };
    const K = T.length, NC = K;   // state K = no chord
    const em = sm.map((c, i) => { const e = new Float32Array(K + 1), energy = c.reduce((a, b) => a + b, 0); for (let k = 0; k < K; k++) e[k] = score(c, bass[i], T[k]) + (dia.has(T[k].r + T[k].q) ? opt.keyBonus : 0); e[NC] = energy < 1.2 ? .75 : opt.nc; return e; });
    // Viterbi: staying is cheap, changing costs
    const stay = 0, change = -opt.change;
    let dp = em[0].slice(), back = [];
    for (let i = 1; i < frames; i++) {
      let bi = 0; for (let k = 1; k <= K; k++) if (dp[k] > dp[bi]) bi = k;
      const nd = new Float32Array(K + 1), bk = new Int16Array(K + 1);
      for (let k = 0; k <= K; k++) { const a = dp[k] + stay, b = dp[bi] + change; if (a >= b) { nd[k] = a + em[i][k] * 1.6; bk[k] = k; } else { nd[k] = b + em[i][k] * 1.6; bk[k] = bi; } }
      back.push(bk); dp = nd;
    }
    let s = 0; for (let k = 1; k <= K; k++) if (dp[k] > dp[s]) s = k;
    const path = new Int16Array(frames); path[frames - 1] = s; for (let i = frames - 2; i >= 0; i--) { s = back[i][s]; path[i] = s; }
    const chords = []; let st = 0;
    for (let i = 1; i <= frames; i++) if (i === frames || path[i] !== path[st]) { const k = path[st]; const t0 = st * dt + N / 2 / sr, t1 = i * dt + N / 2 / sr; if (k !== NC) chords.push({ t0, t1, root: T[k].r, q: T[k].q }); else chords.push({ t0, t1, root: -1, q: '' }); st = i; }
    // drop blips shorter than half a beat (merge into the neighbour)
    const minD = (opt.minBeats == null ? .5 : opt.minBeats) * 60 / bpm; const merged = [];
    chords.forEach(c => { const l = merged[merged.length - 1]; if (l && (c.t1 - c.t0 < minD || (l.root === c.root && l.q === c.q))) l.t1 = c.t1; else merged.push(Object.assign({}, c)); });
    onProgress && onProgress(1);
    return { chords: merged, key, bpm, dur: mono.length / sr };
  }
  const cname = (root, q, tr) => root < 0 ? '—' : NAMES[((root + (tr || 0)) % 12 + 12) % 12] + q;
  /** the app's chord library entry for a root and quality */
  function shapeOf(root, q) { if (root < 0) return null; const all = PD.curriculum.chords(); return all.find(c => c.root === root && (q === 'm' ? (c.q === 'm' || c.kind === 'min') : (c.q === '' || c.kind === 'maj'))) || null; }

  /* ======================= audio: decode, resample ======================= */
  async function decode(file) {
    const buf = await file.arrayBuffer(), ac = new (window.AudioContext || window.webkitAudioContext)();
    const ab = await new Promise((res, rej) => { const p = ac.decodeAudioData(buf.slice(0), res, rej); if (p && p.then) p.then(res, rej); });
    try { ac.close(); } catch (_) {}
    return ab;
  }
  async function resample(ab, sr, ch) {
    const len = Math.ceil(ab.duration * sr), oc = new OfflineAudioContext(ch, len, sr), s = oc.createBufferSource(); s.buffer = ab; s.connect(oc.destination); s.start(); return oc.startRendering();
  }

  /* ======================= the separation worker ======================= */
  let worker = null, wready = null;
  function getWorker(onMsg) {
    if (!worker) { const src = '(' + AIW.toString() + ')()'; worker = new Worker(URL.createObjectURL(new Blob([src], { type: 'text/javascript' }))); }
    worker.onmessage = e => onMsg(e.data); worker.onerror = e => onMsg({ type: 'error', msg: e.message || 'worker' });
    return worker;
  }
  const hasGPU = () => !!navigator.gpu;

  /* ======================= WAV export ======================= */
  function wav(L, R, sr) {
    const n = L.length, b = new ArrayBuffer(44 + n * 4), v = new DataView(b), w = (o, s) => { for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)); };
    w(0, 'RIFF'); v.setUint32(4, 36 + n * 4, true); w(8, 'WAVE'); w(12, 'fmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 2, true); v.setUint32(24, sr, true); v.setUint32(28, sr * 4, true); v.setUint16(32, 4, true); v.setUint16(34, 16, true); w(36, 'data'); v.setUint32(40, n * 4, true);
    for (let i = 0, o = 44; i < n; i++, o += 4) { v.setInt16(o, Math.max(-1, Math.min(1, L[i])) * 32767, true); v.setInt16(o + 2, Math.max(-1, Math.min(1, R[i])) * 32767, true); }
    return new Blob([b], { type: 'audio/wav' });
  }

  /* ======================= the page ======================= */
  function page(w) {
    const own = (() => { const offs = []; const un = PD.bus.on('route', () => { offs.forEach(f => { try { f(); } catch (_) {} }); un(); }); return f => offs.push(f); })();
    const back = () => history.length > 1 ? history.back() : PD.app.go('songs');
    w.append(h('div', { class: 'row pg-head' }, [h('button', { class: 'btn small backbtn', html: ic.back + '<span class="sr" data-t="back"></span>', onclick: back }), h('h1', { 'data-t': 'ai.title', style: 'margin:0' }), h('span', { class: 'ai-badge', text: 'AI' })]), h('p', { class: 'muted', 'data-t': 'ai.lead' }));
    const input = h('input', { type: 'file', accept: 'audio/*,video/*,.mp3,.m4a,.wav,.ogg,.flac,.aac', hidden: true, onchange: e => { const f = e.target.files && e.target.files[0]; if (f) open(f); e.target.value = ''; } });
    const drop = h('button', { class: 'ai-drop', onclick: () => input.click() }, [h('span', { class: 'ai-drop-ic', html: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M24 30V8M15 17l9-9 9 9"/><path d="M8 30v6a4 4 0 0 0 4 4h24a4 4 0 0 0 4-4v-6"/></svg>' }), h('b', { 'data-t': 'ai.pick' }), h('small', { 'data-t': 'ai.pickD' })]);
    drop.addEventListener('dragover', e => { e.preventDefault(); drop.classList.add('over'); }); drop.addEventListener('dragleave', () => drop.classList.remove('over'));
    drop.addEventListener('drop', e => { e.preventDefault(); drop.classList.remove('over'); const f = e.dataTransfer.files && e.dataTransfer.files[0]; if (f) open(f); });
    const status = h('div', { class: 'ai-status', 'aria-live': 'polite' }), body = h('div', { class: 'ai-body' });
    w.append(input, drop, status, body);
    let S = null;   // the current song
    const stopAll = () => { if (S) { try { S.audio.pause(); } catch (_) {} stopStems(); cancelAnimationFrame(S.raf); } };
    own(stopAll); own(() => { if (worker) { try { worker.terminate(); } catch (_) {} worker = null; } });
    function bar(label, p) { status.innerHTML = ''; status.append(h('span', { text: label }), h('div', { class: 'hx-bar' }, [h('i', { style: 'width:' + Math.round(p * 100) + '%' })])); }

    async function open(file, saved) {
      stopAll(); body.innerHTML = ''; bar(t('ai.reading'), .05);
      let ab; try { ab = await decode(file); } catch (e) { status.textContent = t('ai.bad'); return; }
      let res = saved && saved.res;
      if (!res) {
        bar(t('ai.analysing'), .1);
        const mono22 = await resample(ab, 22050, 1);
        res = await analyse(mono22.getChannelData(0), 22050, p => bar(t('ai.analysing'), .1 + .9 * p));
      }
      status.innerHTML = '';
      const url = URL.createObjectURL(file), audio = new Audio(url); audio.preservesPitch = true; audio.mozPreservesPitch = true; audio.webkitPreservesPitch = true;
      S = { file, ab, res, audio, url, tr: 0, speed: 1, stems: null, mode: 'orig', raf: 0 };
      // keep the song + its analysis on the device so it can be reopened any time
      try {
        const all = PD.store.get('ai.recent', []), id = saved ? saved.id : 's' + Date.now().toString(36);
        const rest = all.filter(r => r.id !== id && r.name !== file.name), gone = all.filter(r => !rest.includes(r) && r.id && r.id !== id);
        const entry = { id, name: file.name, type: file.type, at: Date.now(), key: cname(res.key.r, res.key.q), bpm: res.bpm, chords: [...new Set(res.chords.filter(c => c.root >= 0).map(c => cname(c.root, c.q)))].slice(0, 8), stored: saved ? true : false };
        const keep = [entry].concat(rest).slice(0, KEEP), drop = gone.concat(rest.slice(KEEP - 1));
        drop.forEach(r => { if (r.id) { PD.blobs.del('ai.song.' + r.id); PD.blobs.del('ai.res.' + r.id); } });
        PD.store.set('ai.recent', keep);
        if (!saved) {
          try { navigator.storage && navigator.storage.persist && navigator.storage.persist(); } catch (_) {}
          const blob = new Blob([await file.arrayBuffer()], { type: file.type || 'audio/mpeg' });
          const ok = await PD.blobs.put('ai.song.' + id, blob), ok2 = await PD.blobs.put('ai.res.' + id, res);
          if (ok !== null && ok2 !== null) { const r2 = PD.store.get('ai.recent', []), e2 = r2.find(r => r.id === id); if (e2) { e2.stored = true; PD.store.set('ai.recent', r2); } }
        }
      } catch (_) {}
      render();
    }
    async function reopen(r) {
      if (!r.id || !r.stored) { status.textContent = t('ai.reload'); input.click(); return; }
      bar(t('ai.reading'), .03);
      const blob = await PD.blobs.get('ai.song.' + r.id), res = await PD.blobs.get('ai.res.' + r.id);
      if (!blob) { status.textContent = t('ai.reload'); input.click(); return; }
      const file = new File([blob], r.name, { type: r.type || blob.type });
      open(file, { id: r.id, res: res && res.chords ? res : null });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    function forget(r) {
      if (r.id) { PD.blobs.del('ai.song.' + r.id); PD.blobs.del('ai.res.' + r.id); }
      PD.store.set('ai.recent', PD.store.get('ai.recent', []).filter(x => x !== r && !(x.id ? x.id === r.id : x.name === r.name)));
      recentList();
    }

    let render = function () {
      body.innerHTML = '';
      const { res } = S;
      const used = [...new Map(res.chords.filter(c => c.root >= 0).map(c => [c.root + c.q, c])).values()];
      // header: name · key · tempo
      body.append(h('section', { class: 'ai-head' }, [h('b', { class: 'ai-name', text: S.file.name.replace(/\.[^.]+$/, '') }),
        h('div', { class: 'ai-facts' }, [fact('ai.key', cname(res.key.r, res.key.q, S.tr)), fact('ai.bpm', res.bpm + ' BPM'), fact('ai.chords', String(used.length))])]));
      // chord ribbon
      const ribbon = h('canvas', { class: 'ai-ribbon' }), rWrap = h('div', { class: 'ai-rwrap' }, [ribbon]);
      // now / next and the neck
      const nowEl = h('div', { class: 'ai-now' }), nextEl = h('div', { class: 'ai-next' });
      const nv = h('div', { class: 'neckview ai-neck' }), ncv = h('canvas'); nv.appendChild(ncv);
      const neck = PD.Neck(ncv, { sticky: true }); neck.mirror = PD.store.get('lefty', false);
      const ro = new ResizeObserver(() => { const nh = neck.natH(nv.clientWidth) + 'px'; if (nv.style.height !== nh) nv.style.height = nh; neck.layout(); drawRibbon(); last = null; }); ro.observe(nv); own(() => ro.disconnect());
      // transport
      const playB = h('button', { class: 'btn primary ai-play', html: ic.play, 'aria-label': 'play', onclick: () => toggle() });
      const timeEl = h('span', { class: 'ai-time mono' });
      const seek = h('input', { type: 'range', min: 0, max: 1000, value: 0, class: 'ai-seek', oninput: e => setPos(e.target.value / 1000 * res.dur) });
      const sp = h('input', { type: 'range', min: 50, max: 125, step: 5, value: Math.round(S.speed * 100), oninput: e => { S.speed = e.target.value / 100; spV.textContent = e.target.value + '%'; applySpeed(); } }), spV = h('b', { text: Math.round(S.speed * 100) + '%' });
      const trV = h('b', { text: (S.tr > 0 ? '+' : '') + S.tr });
      const trBtn = d => h('button', { class: 'btn small', text: d > 0 ? '+' : '−', onclick: () => { S.tr = Math.max(-6, Math.min(6, S.tr + d)); trV.textContent = (S.tr > 0 ? '+' : '') + S.tr; drawRibbon(); last = null; body.querySelector('.ai-facts').firstChild.lastChild.textContent = cname(res.key.r, res.key.q, S.tr); chips(); } });
      const chipRow = h('div', { class: 'ai-chips' });
      const chips = () => { chipRow.innerHTML = ''; chipRow.append(h('small', { class: 'muted', text: t('ai.used', { n: used.length }) })); used.forEach(c => chipRow.append(h('button', { class: 'chip', text: cname(c.root, c.q, S.tr), onclick: () => { const r = (c.root + S.tr + 12) % 12, sh = shapeOf(r, c.q); if (sh) PD.app.go('chords', sh.id); } }))); };
      chips();
      body.append(h('section', { class: 'ai-player' }, [rWrap, h('div', { class: 'ai-tr' }, [playB, h('button', { class: 'btn small', text: '−5', onclick: () => setPos(pos() - 5) }), h('button', { class: 'btn small', text: '+5', onclick: () => setPos(pos() + 5) }), timeEl]), seek,
        h('div', { class: 'ai-nn' }, [nowEl, nextEl]), nv,
        h('div', { class: 'ai-ctl' }, [h('label', {}, [h('span', { 'data-t': 'ai.speed' }), sp, spV]), h('div', { class: 'ai-trp' }, [h('span', { 'data-t': 'ai.transpose' }), trBtn(-1), trV, trBtn(1)])]),
        chipRow, h('p', { class: 'notice', 'data-t': 'ai.est' })]));
      body.append(stemsPanel());
      PD.i18n.apply(body);
      // ---- playback position (the original via <audio>, the AI mix via Web Audio)
      function pos() { return S.mode === 'stems' && S.stems ? stemPos() : S.audio.currentTime; }
      function setPos(x) { x = Math.max(0, Math.min(res.dur - .05, x)); if (S.mode === 'stems' && S.stems) { const pl = S.stems.playing; stopStems(); S.stems.at = x; if (pl) startStems(x); } else S.audio.currentTime = x; tickOnce(); }
      function toggle() { if (S.mode === 'stems' && S.stems) { if (S.stems.playing) { S.stems.at = stemPos(); stopStems(); } else startStems(S.stems.at || 0); } else if (S.audio.paused) S.audio.play(); else S.audio.pause(); }
      function applySpeed() { S.audio.playbackRate = S.speed; if (S.stems && S.stems.src) S.stems.src.forEach(s => { s.playbackRate.value = S.speed; }); }
      S.ui = { setPos, pos, toggle };
      function fact(k, v) { return h('div', { class: 'ai-fact' }, [h('small', { 'data-t': k }), h('b', { text: v })]); }
      const COL = ['#C9773F', '#8E3B22', '#D9A25B', '#6E8B5A', '#B4573A', '#A3814F', '#7A6BB0', '#4F8FA8'];
      const colOf = (() => { const m = {}; let n = 0; return k => m[k] || (m[k] = COL[n++ % COL.length]); })();
      function drawRibbon() {
        const r = rWrap.getBoundingClientRect(), dpr = Math.min(2, devicePixelRatio || 1), W = Math.max(10, r.width), H = 64; ribbon.width = W * dpr; ribbon.height = H * dpr; ribbon.style.height = H + 'px';
        const x = ribbon.getContext('2d'); x.scale(dpr, dpr); x.clearRect(0, 0, W, H);
        res.chords.forEach(c => { const a = c.t0 / res.dur * W, b = c.t1 / res.dur * W; if (c.root < 0) { x.fillStyle = 'rgba(255,236,210,.06)'; x.fillRect(a, 8, b - a, H - 16); return; } x.fillStyle = colOf(c.root + c.q); x.globalAlpha = .75; x.fillRect(a + .5, 8, Math.max(1, b - a - 1), H - 16); x.globalAlpha = 1; if (b - a > 26) { x.fillStyle = '#FFF4E6'; x.font = '700 12px ' + "'Noto Sans Georgian', system-ui"; x.textBaseline = 'middle'; x.fillText(cname(c.root, c.q, S.tr), a + 4, H / 2); } });
        S.rib = { W, H };
      }
      let last = null;
      function tickOnce() {
        const p = pos(), W = S.rib ? S.rib.W : 0;
        rWrap.style.setProperty('--ph', (p / res.dur * W) + 'px');
        seek.value = Math.round(p / res.dur * 1000); timeEl.textContent = PD.fmtTime(p) + ' / ' + PD.fmtTime(res.dur);
        const i = res.chords.findIndex(c => p >= c.t0 && p < c.t1), c = res.chords[i], n = res.chords.slice(i + 1).find(x => x.root >= 0);
        const key = c ? c.root + c.q + ':' + S.tr : 'none';
        if (key !== last) {
          last = key; const r = c && c.root >= 0 ? (c.root + S.tr + 12) % 12 : -1;
          nowEl.innerHTML = ''; nowEl.append(h('small', { 'data-t': 'ai.now', text: t('ai.now') }), h('b', { text: c && c.root >= 0 ? cname(c.root, c.q, S.tr) : t('ai.nc') }));
          nextEl.innerHTML = ''; if (n) nextEl.append(h('small', { text: t('ai.next') }), h('b', { text: cname(n.root, n.q, S.tr) }));
          const sh = c ? shapeOf(r, c.q) : null, v = sh && ((sh.voicings && sh.voicings[0]) || sh);
          neck.setTarget(v ? v.frets.map((f, k) => ({ s: k + 1, f, fi: (v.fingers || [])[k] || 0 })) : [], []);
          nowEl.classList.remove('pop'); void nowEl.offsetWidth; nowEl.classList.add('pop');
        }
        const playing = S.mode === 'stems' && S.stems ? S.stems.playing : !S.audio.paused; playB.innerHTML = playing ? ic.pause : ic.play;
      }
      const loop = () => { S.raf = requestAnimationFrame(loop); if (document.hidden) return; tickOnce(); neck.draw(); };
      S.raf = requestAnimationFrame(loop); drawRibbon();
      rWrap.onclick = e => { const r = rWrap.getBoundingClientRect(); setPos((e.clientX - r.left) / r.width * res.dur); };
      own(() => { neck.destroy(); });
    }

    /* ---------------- instruments (premium) ---------------- */
    function stemsPanel() {
      const box = h('section', { class: 'ai-stems' });
      const head = h('div', { class: 'row', style: 'gap:8px;align-items:center;flex-wrap:wrap' }, [h('h2', { 'data-t': 'ai.stems', style: 'margin:0' }), h('span', { class: 'ai-pm', text: allowed() && !(PD.premium && PD.premium.active) ? t('ai.test') : t('ai.premium') })]);
      box.append(head, h('p', { class: 'fg2', 'data-t': 'ai.stemsD' }));
      if (S.stems && S.stems.data) { box.append(mixer()); return box; }
      if (!allowed()) { box.append(h('p', { class: 'muted', 'data-t': 'ai.locked' }), h('button', { class: 'btn primary', 'data-t': 'pm.buy', onclick: () => PD.premium.paywall('ai.stems') })); return box; }
      const dur = S.res.dur, choices = [['all', t('ai.all')]].concat(dur > 75 ? [['60', t('ai.first', { n: 60 })], ['here', t('ai.fromHere', { n: 60 })]] : []);
      let pick = dur > 240 ? '60' : 'all';
      const seg = h('div', { class: 'seg' }, choices.map(([k, l]) => h('button', { 'aria-pressed': String(k === pick), text: l, onclick: e => { pick = k; seg.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b === e.currentTarget))); } })));
      const prog = h('div', { class: 'ai-prog', hidden: true }), msg = h('div', { class: 'ai-msg', 'aria-live': 'polite' });
      const go = h('button', { class: 'btn primary big', html: '<span class="ai-spark">✦</span> <span data-t="ai.split"></span>', onclick: () => run() });
      box.append(h('div', { class: 'ai-row' }, [h('span', { class: 'muted', 'data-t': 'ai.range' }), seg]), go, h('p', { class: 'muted', style: 'font-size:12.5px', 'data-t': 'ai.splitNote' }), prog, msg);
      async function run() {
        go.disabled = true; prog.hidden = false; msg.textContent = '';
        const st44 = await resample(S.ab, SR, 2), L = st44.getChannelData(0), R = st44.numberOfChannels > 1 ? st44.getChannelData(1) : L;
        let from = 0, to = L.length; if (pick === '60') to = Math.min(L.length, 60 * SR); if (pick === 'here') { from = Math.floor(S.ui.pos() * SR); to = Math.min(L.length, from + 60 * SR); }
        const setP = (label, p) => { prog.innerHTML = ''; prog.append(h('span', { text: label }), h('div', { class: 'hx-bar' }, [h('i', { style: 'width:' + Math.round(p * 100) + '%' })])); };
        setP(t('ai.dl', { a: 0, b: 85 }), 0);
        const prefer = hasGPU() ? 'webgpu' : 'wasm';
        const wk = getWorker(m => {
          if (m.type === 'dl') setP(t('ai.dl', { a: Math.round(m.got / 1048576), b: Math.round(m.total / 1048576) }), m.got / m.total * .3);
          else if (m.type === 'stage') setP(t(m.s === 'unpack' ? 'ai.unpack' : 'ai.init'), .32);
          else if (m.type === 'ready') { setP(t('ai.proc', { p: 0, m: '…' }), .35); wk.postMessage({ cmd: 'separate', L: L.slice(from, to), R: R.slice(from, to) }); }
          else if (m.type === 'progress') setP(t('ai.proc', { p: Math.round(m.done / m.total * 100), m: PD.fmtTime(Math.max(1, m.eta)) }), .35 + .65 * m.done / m.total);
          else if (m.type === 'done') { S.stems = { data: m.stems, sources: m.sources, from: from / SR, at: from / SR, playing: false }; S.mode = 'stems'; prog.hidden = true; { const sp = stemsPanel(); box.replaceWith(sp); PD.i18n.apply(sp); } }
          else if (m.type === 'error') { go.disabled = false; prog.hidden = true; msg.textContent = /memory|Out of|alloc/i.test(m.msg) ? t('ai.mem') : t('ai.fail', { e: m.msg }); worker && worker.terminate(); worker = null; }
        });
        wk.postMessage({ cmd: 'load', base: BASE, prefer });
      }
      return box;
    }
    function mixer() {
      const st = S.stems, LBL = { vocals: 'ai.vocals', drums: 'ai.drums', bass: 'ai.bass', other: 'ai.other' };
      st.gain = st.gain || st.sources.map(() => 1); st.mute = st.mute || st.sources.map(() => false); st.solo = st.solo == null ? -1 : st.solo;
      const order = ['vocals', 'drums', 'bass', 'other'].map(n => st.sources.indexOf(n)).filter(i => i >= 0);
      const modeSeg = h('div', { class: 'seg' }, [['orig', 'ai.orig'], ['stems', 'ai.mixed']].map(([k, l]) => h('button', { 'aria-pressed': String(S.mode === k), 'data-t': l, onclick: e => { const p = S.ui.pos(), playing = S.mode === 'stems' ? st.playing : !S.audio.paused; S.audio.pause(); stopStems(); S.mode = k; modeSeg.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b === e.currentTarget))); if (k === 'stems') { st.at = Math.max(st.from, Math.min(p, st.from + st.data[0][0].length / SR)); if (playing) startStems(st.at); } else { S.audio.currentTime = p; if (playing) S.audio.play(); } } })));
      const rows = order.map(i => {
        const name = st.sources[i], vol = h('input', { type: 'range', min: 0, max: 150, value: Math.round(st.gain[i] * 100), oninput: e => { st.gain[i] = e.target.value / 100; v.textContent = e.target.value + '%'; applyGains(); } }), v = h('b', { text: Math.round(st.gain[i] * 100) + '%' });
        const mute = h('button', { class: 'btn small' + (st.mute[i] ? ' on' : ''), 'data-t': 'ai.mute', onclick: () => { st.mute[i] = !st.mute[i]; mute.classList.toggle('on', st.mute[i]); applyGains(); } });
        const solo = h('button', { class: 'btn small' + (st.solo === i ? ' on' : ''), 'data-t': 'ai.solo', onclick: () => { st.solo = st.solo === i ? -1 : i; box.querySelectorAll('.ai-solo').forEach((b, j) => b.classList.toggle('on', order[j] === st.solo)); applyGains(); } }); solo.classList.add('ai-solo');
        const save = h('button', { class: 'btn small', 'data-t': 'ai.save', onclick: () => { const a = document.createElement('a'); a.href = URL.createObjectURL(wav(st.data[i][0], st.data[i][1], SR)); a.download = S.file.name.replace(/\.[^.]+$/, '') + ' - ' + name + '.wav'; a.click(); } });
        return h('div', { class: 'ai-st ' + name }, [h('div', { class: 'ai-stn' }, [h('i'), h('b', { 'data-t': LBL[name] || name })]), vol, v, mute, solo, save]);
      });
      const box = h('div', { class: 'ai-mix' }, [h('div', { class: 'row', style: 'gap:10px;align-items:center;flex-wrap:wrap' }, [modeSeg, h('small', { class: 'muted', 'data-t': 'ai.speedStems' })])].concat(rows));
      return box;
    }
    let actx = null;
    function startStems(at) {
      const st = S.stems; if (!st) return; actx = actx || new (window.AudioContext || window.webkitAudioContext)(); actx.resume();
      const len = st.data[0][0].length, off = Math.max(0, at - st.from);
      if (off >= len / SR) return;
      st.src = []; st.g = [];
      st.data.forEach((d, i) => { const b = actx.createBuffer(2, len, SR); b.copyToChannel(d[0], 0); b.copyToChannel(d[1], 1); const s = actx.createBufferSource(); s.buffer = b; s.playbackRate.value = S.speed; const g = actx.createGain(); s.connect(g).connect(actx.destination); s.start(0, off); st.src.push(s); st.g.push(g); });
      st.t0 = actx.currentTime; st.at = at; st.playing = true; applyGains();
      st.src[0].onended = () => { if (st.playing && stemPos() >= st.from + len / SR - .1) { st.playing = false; st.at = st.from; } };
    }
    function stopStems() { const st = S && S.stems; if (!st || !st.src) return; st.src.forEach(s => { try { s.stop(); } catch (_) {} }); st.src = null; st.playing = false; }
    function stemPos() { const st = S.stems; return st.playing && actx ? st.at + (actx.currentTime - st.t0) * S.speed : st.at || st.from; }
    function applyGains() { const st = S.stems; if (!st || !st.g) return; st.g.forEach((g, i) => { g.gain.value = st.solo >= 0 ? (i === st.solo ? st.gain[i] : 0) : st.mute[i] ? 0 : st.gain[i]; }); }
    // recent analyses: tap to reopen (song + chords are kept on this device)
    const recentBox = h('section', { class: 'ai-recent' }); w.append(recentBox);
    function recentList() {
      const rec = PD.store.get('ai.recent', []); recentBox.innerHTML = ''; recentBox.hidden = !rec.length; if (!rec.length) return;
      recentBox.append(h('h3', { text: t('ai.recent') }), h('div', { class: 'list' }, rec.map(r => h('div', { class: 'li ai-ri' }, [
        h('button', { class: 'ai-rb grow', onclick: () => reopen(r) }, [h('span', { class: 'ai-rplay', html: '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>' }), h('span', { class: 'grow' }, [h('b', { text: r.name.replace(/\.[^.]+$/, '') }), h('small', { class: 'muted', text: r.key + ' · ' + r.bpm + ' BPM · ' + (r.chords || []).join(' ') }), r.stored ? null : h('small', { class: 'ai-rwarn', text: t('ai.reloadS') })])]),
        h('button', { class: 'btn small ghost ai-rdel', 'aria-label': t('ai.forget'), title: t('ai.forget'), text: '✕', onclick: () => forget(r) })]))));
    }
    recentList();
    const _render = render; render = function () { _render(); recentList(); };
  }
  return { page, analyse, allowed, BASE };
})();
