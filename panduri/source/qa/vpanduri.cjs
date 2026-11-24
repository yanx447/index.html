// A virtual fanduri for testing the games: the page's microphone becomes a stream on the app's own AudioContext, and the
// test plays the teacher's recorded notes and strums (media/strings, with their measured attack points) into it whenever a
// game asks. Everything then goes through the real chain — AudioWorklet YIN + onset (detector.js) → the game.
// Optional speaker leakage: every connection to the speakers is also routed (at a chosen level) into the microphone, so the
// app's own metronome, demonstrations and backing track reach the detector the way they do without headphones.
// It is a test of the chain, not of a room or a phone microphone.
const fs = require('fs'), path = require('path'), http = require('http');

const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.mp3': 'audio/mpeg', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.mp4': 'video/mp4', '.webmanifest': 'application/manifest+json', '.woff2': 'font/woff2' };
/** the built app on 127.0.0.1 (a secure context, so getUserMedia exists) */
function serve(dir) {
  const server = http.createServer((q, r) => {
    const u = decodeURIComponent(new URL(q.url, 'http://x').pathname), f = path.resolve(dir, '.' + u + (u.endsWith('/') ? 'index.html' : ''));
    if (!f.startsWith(path.resolve(dir)) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); r.end(); return; }
    r.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream', 'cache-control': 'no-store' }); fs.createReadStream(f).pipe(r);
  });
  return new Promise(res => server.listen(0, '127.0.0.1', () => res({ server, url: 'http://127.0.0.1:' + server.address().port + '/' })));
}

/* ---------- runs in the page, before the app ---------- */
function inPage() {
  const VP = window.__vp = { ctx: null, bus: null, leakG: null, bufs: {}, strings: {}, deny: false, events: [], lat: 0 };
  const md = navigator.mediaDevices;
  const busFor = ctx => {
    if (VP.ctx !== ctx) { VP.ctx = ctx; VP.bus = ctx.createGain(); VP.leakG = ctx.createGain(); VP.leakG.gain.value = 0; VP.leakG.connect(VP.bus); }
    return VP.bus;
  };
  // every connection to the speakers also feeds the leak (silent unless VP.leak(level) is set)
  const orig = AudioNode.prototype.connect;
  AudioNode.prototype.connect = function (dst) {
    const r = orig.apply(this, arguments);
    try { if (dst && this.context && dst === this.context.destination && this !== VP.leakG) { busFor(this.context); orig.call(this, VP.leakG); } } catch (_) {}
    return r;
  };
  if (md) md.getUserMedia = async (c) => {
    if (VP.deny) { const e = new Error('Permission denied'); e.name = 'NotAllowedError'; throw e; }
    const ctx = window.PD && PD.audio && PD.audio.ensure(); if (!ctx) { const e = new Error('no audio'); e.name = 'NotReadableError'; throw e; }
    const bus = busFor(ctx), dest = ctx.createMediaStreamDestination(); dest.channelCount = 1;
    try { bus.disconnect(); } catch (_) {}
    orig.call(bus, dest);
    // a real microphone reports the processing it was asked for (raw: echo cancellation, noise suppression and gain control
    // off); a stream destination reports none, which the app would take for a processed input
    const tr = dest.stream.getAudioTracks()[0], want = c && typeof c.audio === 'object' ? c.audio : {}, val = x => x && typeof x === 'object' ? ('exact' in x ? x.exact : x.ideal) : x;
    if (tr && tr.getSettings) { const real = tr.getSettings.bind(tr); tr.getSettings = () => Object.assign({}, real(), { echoCancellation: !!val(want.echoCancellation), noiseSuppression: !!val(want.noiseSuppression), autoGainControl: !!val(want.autoGainControl), deviceId: 'virtual-fanduri' }); }
    return dest.stream;
  };
  VP.leak = level => { if (VP.leakG) VP.leakG.gain.value = level; };
  const decode = async file => { if (VP.bufs[file]) return VP.bufs[file]; const ab = await (await fetch('media/' + file)).arrayBuffer(); return (VP.bufs[file] = await PD.audio.ensure().decodeAudioData(ab)); };
  /** load the recordings a test will use: { s, f } positions and/or chord files */
  VP.load = async (pos, chords) => {
    for (const p of pos || []) { const it = PD.SOUNDS.strings[p.s].find(x => x.f === p.f); await decode(it.file); }
    for (const c of chords || []) await decode(c);
  };
  const cut = (s, at) => { const o = VP.strings[s]; if (o) { try { o.g.gain.setTargetAtTime(0, Math.max(at - .004, VP.ctx.currentTime), .006); o.src.stop(at + .08); } catch (_) {} } };
  /** string s, fret f, its attack at audio time `at` (a new note on a string stops the one it was ringing) */
  VP.note = (s, f, at, gain) => {
    const it = PD.SOUNDS.strings[s].find(x => x.f === f), buf = VP.bufs[it.file]; if (!buf) throw new Error('not loaded ' + it.file);
    cut(s, at);
    const src = VP.ctx.createBufferSource(), g = VP.ctx.createGain(); src.buffer = buf; g.gain.value = gain == null ? .55 : gain;
    src.connect(g); orig.call(g, VP.bus);
    const off = Math.max(0, (it.start || 0) - .003); src.start(Math.max(at - .003, VP.ctx.currentTime), off);
    VP.strings[s] = { src, g }; VP.events.push(['note', s, f, +at.toFixed(4), gain]);
  };
  /** a stroke made of the three strings' own recordings: down A → E, up E → A, ~22 ms apart */
  VP.strum = (frets, dir, at, gain) => { const ord = dir === 'up' ? [3, 2, 1] : [1, 2, 3]; ord.filter(s => frets[s - 1] != null).forEach((s, k) => VP.note(s, frets[s - 1], at + k * .022, gain)); };
  /** one of the teacher's recorded strums of the open chord */
  VP.chordRec = (k, at, gain) => {
    const it = PD.SOUNDS.chords[k % PD.SOUNDS.chords.length], buf = VP.bufs[it.file];
    [1, 2, 3].forEach(s => cut(s, at));
    const src = VP.ctx.createBufferSource(), g = VP.ctx.createGain(); src.buffer = buf; g.gain.value = gain == null ? .5 : gain; src.connect(g); orig.call(g, VP.bus);
    src.start(Math.max(at - .003, VP.ctx.currentTime), Math.max(0, (it.start || 0) - .003));
    [1, 2, 3].forEach(s => { VP.strings[s] = { src, g }; }); VP.events.push(['chord', k, +at.toFixed(4), gain]);
  };
  /** broadband noise (a room) from `at` for `dur` s at `level` */
  VP.noise = (level, at, dur) => {
    const ctx = VP.ctx, n = Math.round(ctx.sampleRate * dur), b = ctx.createBuffer(1, n, ctx.sampleRate), d = b.getChannelData(0); let b0 = 0, b1 = 0, b2 = 0, x = 12345;
    for (let i = 0; i < n; i++) { x = (x * 1103515245 + 12345) & 0x7fffffff; const w = x / 0x7fffffff * 2 - 1; b0 = .99765 * b0 + w * .099046; b1 = .963 * b1 + w * .2965164; b2 = .57 * b2 + w * 1.0526913; d[i] = (b0 + b1 + b2 + w * .1848) * .06; }
    const src = ctx.createBufferSource(), g = ctx.createGain(); src.buffer = b; g.gain.value = level; src.connect(g); orig.call(g, VP.bus); src.start(at);
  };
  VP.stopAll = () => { Object.values(VP.strings).forEach(o => { try { o.src.stop(); } catch (_) {} }); VP.strings = {}; };
  /** the path's own delay, measured as the app's calibration would: one stroke, and when the detector heard it */
  VP.calibrate = () => new Promise(async res => {
    PD.detector.setCalib({ latencyMs: 0 });
    await VP.load([{ s: 3, f: 0 }]);
    const at = VP.ctx.currentTime + .25;
    const off = PD.detector.on('onset', m => { off(); clearTimeout(tm); const lat = Math.max(0, m.t - at); VP.lat = lat; PD.detector.setCalib({ latencyMs: Math.round(lat * 1000) }); res(Math.round(lat * 1000)); });
    const tm = setTimeout(() => { off(); res(null); }, 2500);
    VP.note(3, 0, at, .55);
  });
}

/** a Chromium (or WebKit) page with the virtual fanduri, the app loaded and its first-run screens out of the way */
async function open(browser, url, o) {
  o = o || {};
  const ctx = await browser.newContext(Object.assign({ viewport: { width: o.w || 390, height: o.h || 844 }, serviceWorkers: o.sw ? 'allow' : 'block', deviceScaleFactor: o.dpr || 1 }, o.video ? { recordVideo: { dir: o.video, size: { width: o.w || 390, height: o.h || 844 } } } : {}));
  const p = await ctx.newPage(), errs = [];
  p.on('pageerror', e => errs.push('pageerror: ' + e.message));
  p.on('console', m => { if (m.type() === 'error' && !/Failed to load|net::|404|ERR_|fonts|NotAllowedError/.test(m.text())) errs.push('console: ' + m.text().slice(0, 240)); });
  await p.addInitScript(inPage);
  await p.route(u => !u.href.startsWith(url), r => r.abort());
  await p.goto(url); await p.waitForFunction(() => window.PD && PD.app && PD.games, null, { timeout: 30000 }); await p.waitForTimeout(400);
  await p.evaluate(l => { PD.i18n.set(l); ['onboarded', 'intro.done', 'micExplained', 'gm.calAsked', 'gm.intro'].forEach(k => PD.store.set(k, true)); PD.store.set('gm.metro', false); document.querySelectorAll('.ob,.ag,.intro,.cine,.cine-boot').forEach(x => x.remove()); }, o.lang || 'en');
  return { ctx, p, errs };
}

module.exports = { serve, open, inPage };
