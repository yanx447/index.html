/* The owner's editor can always be heard: without a recording ▶ still runs and the chords, strokes and notes sound
   on the panduri (♪ on each track); a device storage that never answers does not leave it silent; a chord or a stroke
   sounds when picked; a recording attached from the MUSIC folder plays at once.
   node qa/editor-hear.cjs   (needs dist/app: python3 build.py) — Supabase is refused, nothing leaves the machine. */
const path = require('path'), fs = require('fs'), http = require('http');
const { chromium } = require(path.join(__dirname, '..', 'node_modules', 'playwright'));
const APP = path.join(__dirname, '..', 'dist', 'app');
const T = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.mp3': 'audio/mpeg', '.wav': 'audio/wav' };
const srv = http.createServer((q, r) => { const u = decodeURIComponent(q.url.split('?')[0]), f = path.join(APP, u.endsWith('/') ? u + 'index.html' : u);
  if (!f.startsWith(APP) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'Content-Type': T[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r); });
let fails = 0, passes = 0; const ok = (c, m, x) => { if (c) { passes++; console.log('  ✓ ' + m); } else { fails++; console.log('  ✗ ' + m + (x !== undefined ? ' — ' + JSON.stringify(x).slice(0, 400) : '')); } };
// a 12-second WAV (a plain tone) to attach
const SR = 22050, N = SR * 12, wav = Buffer.alloc(44 + N * 2); wav.write('RIFF', 0); wav.writeUInt32LE(36 + N * 2, 4); wav.write('WAVEfmt ', 8); wav.writeUInt32LE(16, 16); wav.writeUInt16LE(1, 20); wav.writeUInt16LE(1, 22); wav.writeUInt32LE(SR, 24); wav.writeUInt32LE(SR * 2, 28); wav.writeUInt16LE(2, 32); wav.writeUInt16LE(16, 34); wav.write('data', 36); wav.writeUInt32LE(N * 2, 40);
for (let i = 0; i < N; i++) wav.writeInt16LE(Math.round(Math.sin(2 * Math.PI * 220 * i / SR) * 8000), 44 + i * 2);

(async () => {
  await new Promise(r => srv.listen(0, '127.0.0.1', r)); const base = 'http://127.0.0.1:' + srv.address().port + '/';
  const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  async function page(o) {
    const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, serviceWorkers: 'block' }); await ctx.route(/supabase\.co/, r => r.abort());
    const p = await ctx.newPage(); p.errors = []; p.on('pageerror', e => p.errors.push(e.message));
    await p.addInitScript(() => { for (const [k, v] of [['lang', 'ka'], ['language.chosen', true], ['onboarded', true], ['intro.done', true], ['first.done', true]]) localStorage.setItem('pd2:' + k, JSON.stringify(v)); });
    await p.goto(base + 'index.html'); await p.waitForFunction(() => window.PD && PD.musicLib && PD.musicLib.loaded && PD.lessonEditor, null, { timeout: 30000 });
    await p.evaluate(o2 => {
      document.querySelectorAll('.ag, .ob, .ob-back').forEach(x => x.remove()); Object.defineProperty(PD.cloud, 'isOwner', { get: () => true, configurable: true });
      window.__snd = []; const A = PD.audio, n0 = A.note, s0 = A.strum; A.note = (s, f, op) => { window.__snd.push(['note', s, f, op && op.when]); return n0(s, f, op); }; A.strum = (fr, d, op) => { window.__snd.push(['strum', fr.join(','), d, op && op.when]); return s0(fr, d, op); };
      if (o2 && o2.stuck) { const m = PD.store.get('ml.hasOwn', {}); m['ml-300-aragveli'] = true; PD.store.set('ml.hasOwn', m); PD.blobs.get = () => new Promise(() => {}); }
    }, o);
    return p;
  }

  console.log('\n# no recording on this device: ▶ runs, the tracks sound on the panduri');
  let p = await page();
  await p.evaluate(() => PD.lessonEditor.open('ml-300-aragveli', 'chords')); await p.waitForSelector('.le canvas');
  await p.waitForFunction(() => PD.lessonEditor.state.audioState !== 'loading', null, { timeout: 15000 });
  const st = await p.evaluate(() => ({ state: PD.lessonEditor.state.audioState, mon: PD.lessonEditor.state.mon, attach: !PD.lessonEditor.state.root.querySelector('[data-t="le.attach"]').hidden }));
  ok(st.state === 'none' && st.mon.rhythm && st.mon.notes, 'it says the recording is not here, and turns on ♪ for the strokes and notes', st);
  ok(st.attach, 'the “attach the recording” button is there');
  await p.evaluate(() => { const S = PD.lessonEditor.state; S.audio.currentTime = 8; }); await p.click('.le-ib.pp'); await p.waitForTimeout(2200);
  const run = await p.evaluate(() => ({ t: PD.lessonEditor.state.audio.currentTime, playing: !PD.lessonEditor.state.audio.paused, snd: window.__snd.slice() }));
  await p.click('.le-ib.pp');
  ok(run.playing && run.t > 9.5 && run.t < 11, '▶ without a recording: the playhead runs (' + run.t.toFixed(2) + ' s after 2.2 s from 8 s)');
  const strums = run.snd.filter(x => x[0] === 'strum'), notes = run.snd.filter(x => x[0] === 'note' && x[3]);
  ok(strums.length >= 3 && notes.length >= 1, 'the strokes (' + strums.length + ') and the melody notes (' + notes.length + ') were played on the panduri, scheduled ahead', run.snd.slice(0, 6));
  const exp = await p.evaluate(() => { const S = PD.lessonEditor.state, D = S.D, st2 = (D.strokes || PD.lessonEditor.patternStrokes(D)).filter(x => x.k !== 'r' && x.t >= 8 && x.t < 10.1); return st2.length; });
  ok(Math.abs(strums.length - exp) <= 3, 'one strum per stroke of the rhythm track (' + strums.length + ' for ' + exp + ')');
  // ♪ off for the rhythm: no more strums
  const g = await p.evaluate(() => { const S = PD.lessonEditor.state, r = S.cv.getBoundingClientRect(), L = PD.lessonEditor.geom.lanes().find(l => l.k === 'rhythm'); return { x: r.left + S.head - 13, y: r.top + L.y + L.h - 11 }; });
  await p.mouse.click(g.x, g.y); await p.evaluate(() => { window.__snd = []; PD.lessonEditor.state.audio.currentTime = 20; }); await p.click('.le-ib.pp'); await p.waitForTimeout(1200); await p.click('.le-ib.pp');
  const off = await p.evaluate(() => ({ mon: PD.lessonEditor.state.mon.rhythm, strums: window.__snd.filter(x => x[0] === 'strum').length }));
  ok(!off.mon && off.strums === 0, '♪ in the rhythm track\'s header turns its sound off', off);
  // a chord sounds when it is picked
  await p.evaluate(() => { window.__snd = []; const S = PD.lessonEditor.state; S.x0 = 0; S.zoom = (S.cv.clientWidth - S.head) / 20; });
  const c = await p.evaluate(() => { const S = PD.lessonEditor.state, r = S.cv.getBoundingClientRect(), L = PD.lessonEditor.geom.lanes().find(l => l.k === 'chords'), k = S.D.chords.findIndex(x => x.chord && x.t > 1 && x.t < 15); return { x: r.left + PD.lessonEditor.geom.tx(S.D.chords[k].t + .2), y: r.top + L.y + L.h / 2, name: S.D.chords[k].chord }; });
  await p.mouse.click(c.x, c.y); await p.waitForTimeout(150);
  ok(await p.evaluate(() => window.__snd.some(x => x[0] === 'strum')), 'clicking the chord ' + c.name + ' plays it');
  // the MUSIC file attached: it plays at once
  const [fc] = await Promise.all([p.waitForEvent('filechooser'), p.click('.le [data-t="le.attach"]')]);
  await fc.setFiles({ name: '300-aragveli.wav', mimeType: 'audio/wav', buffer: wav });
  await p.waitForFunction(() => PD.lessonEditor.state.peaks, null, { timeout: 15000 });
  const at = await p.evaluate(() => ({ state: PD.lessonEditor.state.audioState, real: !PD.lessonEditor.state.useVirt, src: /^blob:/.test(PD.lessonEditor.state.real.src) }));
  ok(at.state === 'ok' && at.real && at.src, 'an attached file becomes the recording at once (waveform drawn)', at);
  await p.evaluate(() => { PD.lessonEditor.state.audio.currentTime = 2; }); await p.click('.le-ib.pp'); await p.waitForTimeout(1200);
  const pr = await p.evaluate(() => ({ t: PD.lessonEditor.state.real.currentTime, paused: PD.lessonEditor.state.real.paused })); await p.click('.le-ib.pp');
  ok(!pr.paused && pr.t > 2.6, 'and the recording itself plays (' + pr.t.toFixed(2) + ' s)', pr);
  ok(await p.evaluate(() => !!PD.store.get('ml.hasOwn', {})['ml-300-aragveli']), 'it is kept on this device for next time');
  ok(!p.errors.length, 'no errors on the page', p.errors);
  await p.context().close();

  console.log('\n# the device storage never answers');
  p = await page({ stuck: true });
  await p.evaluate(() => PD.lessonEditor.open('ml-300-aragveli', 'chords')); await p.waitForSelector('.le canvas');
  await p.waitForFunction(() => PD.lessonEditor.state.audioState !== 'loading', null, { timeout: 20000 });
  const s2 = await p.evaluate(() => PD.lessonEditor.state.audioState); ok(s2 === 'stuck', 'after 8 s it says so instead of “loading…” for ever (' + s2 + ')');
  await p.evaluate(() => { window.__snd = []; PD.lessonEditor.state.audio.currentTime = 8; }); await p.click('.le-ib.pp'); await p.waitForTimeout(1200); await p.click('.le-ib.pp');
  ok(await p.evaluate(() => window.__snd.filter(x => x[0] === 'strum').length > 0), 'and ▶ still plays the tracks');
  ok(!p.errors.length, 'no errors on the page', p.errors);
  await b.close(); srv.close();
  console.log('\n' + passes + ' passed, ' + fails + ' failed'); process.exit(fails ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
