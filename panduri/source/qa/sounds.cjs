/* The real panduri sounds (sounds/make.cjs → media/strings, media/rhythms, PD.SOUNDS) in the built app.
   Checks, in Chromium:
   • all 54 recorded notes load and decode; a note is re-tuned to its fret's exact pitch (measured from the output)
   • every stroke time in PD.SOUNDS lands on an attack in the decoded recording (energy after / before)
   • the rhythm page offers the recordings and its arrows follow one; the song page lights the chord chips
   • the tuner's three plucks decode and sit on A3 · C♯4 · E4 at A4 = 440 Hz
   node qa/sounds.cjs     (needs dist/app: python3 build.py) */
const path = require('path'), fs = require('fs'), http = require('http');
const { chromium } = require(path.join(__dirname, '..', 'node_modules', 'playwright'));
const APP = path.join(__dirname, '..', 'dist', 'app'), OUT = path.join(__dirname, 'out');
const T = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.mp3': 'audio/mpeg', '.mp4': 'video/mp4', '.webmanifest': 'application/manifest+json', '.woff2': 'font/woff2' };
const srv = http.createServer((q, r) => {
  const u = decodeURIComponent(q.url.split('?')[0]), f = path.join(APP, u.endsWith('/') ? u + 'index.html' : u);
  if (!fs.existsSync(f)) { r.writeHead(404); return r.end(); }
  r.writeHead(200, { 'Content-Type': T[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r);
});
let fail = 0; const ok = (c, m) => { console.log((c ? '  ok   ' : '  FAIL ') + m); if (!c) fail++; };
(async () => {
  await new Promise(r => srv.listen(0, r)); const base = 'http://127.0.0.1:' + srv.address().port + '/';
  const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required', '--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream'] });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, permissions: ['microphone'] }), p = await ctx.newPage();
  const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await p.addInitScript(() => { localStorage.setItem('pd2:lang', '"ka"'); localStorage.setItem('pd2:language.chosen', 'true'); localStorage.setItem('pd2:onboarded', 'true'); localStorage.setItem('pd2:intro.done', 'true'); localStorage.setItem('pd2:auth.skip', 'true'); localStorage.setItem('pd2:cine', 'false'); });
  await p.goto(base + 'index.html'); await p.waitForTimeout(1500);
  // continue without an account (the sign-in screen opens on every start without a session)
  await p.evaluate(() => { const b = document.querySelector('.sp-start'); if (b) b.click(); }); await p.waitForTimeout(600);
  await p.evaluate(() => document.querySelectorAll('.ag, .intro').forEach(x => x.remove()));

  console.log('notes');
  const notes = await p.evaluate(async () => {
    PD.audio.ensure(); PD.samples.warm();
    for (let i = 0; i < 100 && PD.samples.bankState().ok < PD.samples.bankState().n; i++) await new Promise(r => setTimeout(r, 100));
    const st = PD.samples.bankState();
    // render notes offline through the same pick() the app uses and measure the pitch that comes out
    // autocorrelation over 0.06–0.36 s, lag searched within ±10 % of the fret, parabolic peak
    const acPitch = (x, sr, want, from, len) => { const a = Math.round(from * sr), n = Math.round(len * sr), lo = Math.floor(sr / (want * 1.1)), hi = Math.ceil(sr / (want / 1.1));
      const acf = L => { let s = 0; for (let i = a; i < a + n; i++) s += x[i] * x[i + L]; return s; }; let best = -1e9, bl = lo; for (let L = lo; L <= hi; L++) { const v = acf(L); if (v > best) { best = v; bl = L; } }
      const y0 = acf(bl - 1), y2 = acf(bl + 1), sh = .5 * (y0 - y2) / (y0 - 2 * best + y2); return sr / (bl + sh); };
    const out = [];
    for (const [s, f] of [[1, 0], [1, 7], [1, 17], [2, 0], [2, 9], [3, 0], [3, 12], [3, 17]]) {
      const sm = PD.samples.pick(s, f, 'pluck', .7); if (!sm) { out.push({ s, f, none: true }); continue; }
      const sr = 48000, oc = new OfflineAudioContext(1, sr, sr), src = oc.createBufferSource(); src.buffer = sm.buf; src.playbackRate.value = sm.rate; src.connect(oc.destination); src.start(0, sm.offset);
      const y = (await oc.startRendering()).getChannelData(0), want = PD.theory.freq(PD.theory.midi(s, f)), cents = [1200 * Math.log2(acPitch(y, sr, want, .06, .3) / want)];
      let lead = 0; while (lead < y.length && Math.abs(y[lead]) < .02) lead++;
      out.push({ s, f, rate: +sm.rate.toFixed(4), cents: +cents[cents.length >> 1].toFixed(1), leadMs: +(lead / sr * 1000).toFixed(1) });
    }
    return { st, out };
  });
  ok(notes.st.n === 54 && notes.st.ok === 54, `bank: ${notes.st.ok}/${notes.st.n} notes decoded`);
  notes.out.forEach(n => ok(!n.none && Math.abs(n.cents) < 12 && n.leadMs < 15, `string ${n.s} fret ${n.f}: rate ${n.rate}, sounds ${n.cents} cents from the fret, attack after ${n.leadMs} ms`));

  console.log('stroke times');
  const strokes = await p.evaluate(async () => {
    const all = [].concat(...Object.values(PD.SOUNDS.rhythms), [PD.SOUNDS.bani]), out = [];
    for (const x of all) {
      const ab = await (await fetch(PD.assets.media[x.file])).arrayBuffer(), oc = new OfflineAudioContext(1, 1, 48000), buf = await oc.decodeAudioData(ab), d = buf.getChannelData(0), sr = buf.sampleRate;
      const hp = new Float32Array(d.length); for (let i = 1; i < d.length; i++) hp[i] = d[i] - .97 * d[i - 1];   // attacks are bright: compare high-passed energy
      const en = (a, b) => { let e = 0; for (let i = Math.max(0, Math.round(a * sr)); i < Math.min(d.length, Math.round(b * sr)); i++) e += hp[i] * hp[i]; return e / Math.max(1, (b - a) * sr); };
      const rs = [].concat(...x.cycles).map(t => en(t - .004, t + .026) / (en(t - .05, t - .012) + 1e-9));
      rs.sort((a, z) => a - z);
      const seam = Math.max(...Array.from(d.subarray(Math.round(x.loop[1] * sr) - 8, Math.round(x.loop[1] * sr) + 8)).map(Math.abs));
      out.push({ id: x.id, n: rs.length, med: +rs[rs.length >> 1].toFixed(1), low: +rs[0].toFixed(2), hit: rs.filter(r => r > 1.5).length, seam: +seam.toFixed(4), dur: +buf.duration.toFixed(2), loop: x.loop });
    }
    return out;
  });
  // the fastest Mtiuluri takes blur their strokes into one another: there, three in four on a clear attack is the bar
  strokes.forEach(r => ok(r.hit >= r.n * (/^mtiuluri-[3-7]/.test(r.id) ? .75 : .9) && r.seam < .03, `${r.id.padEnd(14)} ${r.n} strokes: ${r.hit} on an attack (×1.5 energy), median ×${r.med}, lowest ×${r.low} · loop ${r.loop[0]}–${r.loop[1]} s of ${r.dur} s, seam level ${r.seam}`));

  console.log('rhythm page');
  for (const id of ['acharuli', 'mtiuluri', 'kazbeguri']) {
    await p.evaluate(id => PD.app.go('rhythm', id), id); await p.waitForTimeout(600);
    const info = await p.evaluate(() => ({ speeds: [...document.querySelectorAll('.rh-speeds button')].map(b => b.textContent), src: document.querySelectorAll('.rh-rec .snd-opt').length }));
    if (id === 'kazbeguri') { ok(info.src === 0, 'kazbeguri: no recording, no sound switch'); continue; }
    ok(info.speeds.length === (id === 'acharuli' ? 4 : 7), `${id}: ${info.speeds.length} recordings — ${info.speeds.join(' · ')}`);
    await p.evaluate(() => [...document.querySelectorAll('.rh-speeds button')][1].click());
    await p.evaluate(() => [...document.querySelectorAll('button.btn.primary')].find(b => /მოსმენა/.test(b.textContent)).click());
    const seen = new Set(); for (let k = 0; k < 40; k++) { await p.waitForTimeout(100); const c = await p.evaluate(() => { const e = document.querySelector('.rh-row.big .rh-card.cur'); return e ? e.dataset.i : null; }); if (c != null) seen.add(c); }
    ok(seen.size === (id === 'acharuli' ? 3 : 5), `${id}: the arrows followed the recording through strokes ${[...seen].sort().join(', ')}`);
    await p.screenshot({ path: path.join(OUT, `sounds-rhythm-${id}.png`), fullPage: false });
    await p.evaluate(() => document.querySelector('.rh-rec').scrollIntoView({ block: 'center' })); await p.waitForTimeout(200);
    await p.screenshot({ path: path.join(OUT, `sounds-rhythm-${id}-speeds.png`), fullPage: false });
    const over = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth); ok(over <= 0, `${id}: no sideways scroll at 390 px (${over})`);
    await p.evaluate(() => PD.app.go('home'));
  }

  console.log('tempo, practice, chord, list, home');
  await p.evaluate(() => PD.app.go('rhythm', 'mtiuluri')); await p.waitForTimeout(600);
  // a tempo between two recordings: the page stretches the nearest one and the arrows still follow it
  await p.evaluate(() => { const sl = document.querySelector('.rh-bpm'); sl.value = '50'; sl.dispatchEvent(new Event('input')); });
  await p.evaluate(() => [...document.querySelectorAll('button.btn.primary')].find(b => /მოსმენა/.test(b.textContent)).click());
  let started = false; for (let k = 0; k < 60 && !started; k++) { await p.waitForTimeout(150); started = await p.evaluate(() => /გაჩერება/.test([...document.querySelectorAll('button.btn.primary')].map(b => b.textContent).join())); }
  ok(started, 'mtiuluri at 50 BPM: the stretched recording plays');
  const seen2 = new Set(); for (let k = 0; k < 40; k++) { await p.waitForTimeout(100); const c = await p.evaluate(() => { const e = document.querySelector('.rh-row.big .rh-card.cur'); return e ? e.dataset.i : null; }); if (c != null) seen2.add(c); }
  ok(seen2.size === 5, `mtiuluri at 50 BPM: the arrows went through strokes ${[...seen2].sort().join(', ')}`);
  const prac = await p.evaluate(async () => {
    const r = PD.curriculum.rhythms().find(x => x.id === 'mtiuluri'), rec = PD.SOUNDS.rhythms.mtiuluri[2], L = PD.lessons.fromRecording(r, rec, 16);
    PD.audio.ref.loadStems(L.stems); const okR = await PD.audio.ref.whenReady(.8);
    const k = PD.audio.ref.key, b = PD.audio.ref.buf[k], st = PD.audio.ref.str[k + '@0.800'];
    PD.audio.ref.unload();
    return { ok: okR, key: k, dur: b ? +b.duration.toFixed(2) : 0, stretched: st ? +st.duration.toFixed(2) : 0, map: L.beatMap.length, events: L.events.length, bpm: L.bpm, last: L.beatMap[16] };
  });
  ok(prac.ok && prac.dur > prac.last && prac.stretched > prac.dur, `practice with the recording: stem ${prac.key} → ${prac.dur} s laid end to end, ${prac.stretched} s at 80 %, ${prac.events / 3} strokes over 16 cycles at ${prac.bpm} BPM, beat 16 at ${prac.last} s`);
  const ch = await p.evaluate(async () => { for (let i = 0; i < 50 && !PD.samples.pickChord([0, 0, 0], 'down', .7); i++) await new Promise(r => setTimeout(r, 100)); const c = PD.samples.pickChord([0, 0, 0], 'down', .7); return c ? { rate: +c.rate.toFixed(4), dur: +c.buf.duration.toFixed(2), up: !!PD.samples.pickChord([0, 0, 0], 'up', .7) } : null; });
  ok(ch && Math.abs(ch.rate - 1) < .01 && !ch.up, `open chord ↓: the recorded stroke (${ch && ch.dur} s, rate ${ch && ch.rate}); ↑ from the single notes`);
  await p.evaluate(() => PD.app.go('rhythms')); await p.waitForTimeout(500);
  ok(await p.evaluate(() => document.querySelectorAll('.rh-item .rh-pv').length === 2), 'rhythm list: ▶ on Acharuli and Mtiuluri');
  await p.evaluate(() => PD.app.go('home')); await p.waitForTimeout(600);
  ok(await p.evaluate(() => document.querySelectorAll('.hm-rh .rh-pv').length === 2), 'home: “rhythms on a real panduri” with ▶');
  await p.evaluate(() => document.querySelector('.hm-rh').scrollIntoView({ block: 'center' })); await p.screenshot({ path: path.join(OUT, 'sounds-home.png') });
  // a lesson built on a rhythm opens that rhythm's page, which carries the recordings
  await p.evaluate(() => PD.app.go('lesson', 'bass-move')); await p.waitForTimeout(600);
  ok(await p.evaluate(() => PD.app.route === 'rhythm' && document.querySelectorAll('.rh-speeds button').length === 7), 'lesson “moving the bass” opens Mtiuluri with its 7 recordings');

  // practice with the microphone along with the recording: the practice screen loads it and the transport runs on its beats
  await p.evaluate(() => PD.app.go('rhythm', 'acharuli')); await p.waitForTimeout(600);
  await p.evaluate(() => [...document.querySelectorAll('.rh-speeds button')][2].click());
  await p.evaluate(() => [...document.querySelectorAll('.rh-mic button.btn.primary')][0].click());
  await p.waitForTimeout(800); await p.evaluate(() => { const bt = [...document.querySelectorAll('button')].find(x => /მიკროფონის ჩართვა/.test(x.textContent)); if (bt) bt.click(); });
  await p.waitForTimeout(600); await p.evaluate(() => { const bt = [...document.querySelectorAll('button')].find(x => x.textContent.trim() === 'ჩართვა'); if (bt) bt.click(); });
  let pr2 = null; for (let k = 0; k < 80; k++) { await p.waitForTimeout(150); pr2 = await p.evaluate(() => { const S = PD.engine.S; return S.lesson ? { stems: S.lesson.stems && S.lesson.stems.full, playing: S.playing, now: +S.now.toFixed(2), rf: +PD.engine.rf().toFixed(3), refPlaying: PD.audio.ref.playing, state: PD.audio.ref.state } : null; }); if (pr2 && pr2.playing && pr2.now > 1.2 && pr2.refPlaying) break; }
  ok(pr2 && pr2.stems && pr2.playing && pr2.refPlaying && pr2.now > 1, 'mic practice along with the recording: ' + JSON.stringify(pr2));
  await p.screenshot({ path: path.join(OUT, 'sounds-practice-rec.png') });
  await p.evaluate(() => { PD.engine.stop(); PD.app.go('home'); }); await p.waitForTimeout(400);

  console.log('song page');
  await p.evaluate(() => PD.app.go('lesson', 'bani-acharuli')); await p.waitForTimeout(800);
  const has = await p.evaluate(() => !!document.querySelector('.cy-hear button'));
  ok(has, 'Bani-Acharuli: “hear it on the panduri” is on the page');
  if (has) {
    await p.evaluate(() => document.querySelector('.cy-hear button').click());
    const lit = new Set(); for (let k = 0; k < 40; k++) { await p.waitForTimeout(100); const c = await p.evaluate(() => { const sp = [...document.querySelectorAll('.cy-st')], j = sp.findIndex(x => x.classList.contains('on')); return j; }); if (c >= 0) lit.add(c); }
    ok(lit.size === 4, `Bani-Acharuli: the chips lit in turn: ${[...lit].sort().join(', ')}`);
    await p.evaluate(() => document.querySelector('.cy-hear').scrollIntoView({ block: 'center' }));
    await p.screenshot({ path: path.join(OUT, 'sounds-song-bani.png') });
    await p.evaluate(() => document.querySelector('.cy-hear button').click());
  }

  console.log('tuner');
  const tun = await p.evaluate(async () => {
    const out = [];
    for (const [f, m] of [['panduri-a3.mp3', 57], ['panduri-cs4.mp3', 61], ['panduri-e4.mp3', 64]]) {
      const ab = await (await fetch('tuner/audio/' + f)).arrayBuffer(), oc = new OfflineAudioContext(1, 1, 48000), b = await oc.decodeAudioData(ab), x = b.getChannelData(0), sr = b.sampleRate, want = 440 * Math.pow(2, (m - 69) / 12);
      // zero-padded FFT-free estimate: count the period with autocorrelation over 0.1–0.5 s
      const a = Math.round(.1 * sr), n = Math.round(.3 * sr), lo = Math.floor(sr / (want * 1.1)), hi = Math.ceil(sr / (want / 1.1)); let best = 0, bl = lo;
      for (let L = lo; L <= hi; L++) { let s = 0; for (let i = a; i < a + n; i++) s += x[i] * x[i + L]; if (s > best) { best = s; bl = L; } }
      const acf = L => { let s = 0; for (let i = a; i < a + n; i++) s += x[i] * x[i + L]; return s; }, y0 = acf(bl - 1), y1 = best, y2 = acf(bl + 1), sh = .5 * (y0 - y2) / (y0 - 2 * y1 + y2);
      out.push({ f, dur: +b.duration.toFixed(2), cents: +(1200 * Math.log2(sr / (bl + sh) / want)).toFixed(1) });
    }
    return out;
  });
  tun.forEach(r => ok(Math.abs(r.cents) < 5, `tuner ${r.f}: ${r.dur} s, ${r.cents} cents from equal temperament`));

  ok(!errs.length, 'no console errors' + (errs.length ? ': ' + errs.slice(0, 5).join(' | ') : ''));
  await b.close(); srv.close();
  console.log(fail ? `\n${fail} FAILED` : '\nall passed'); process.exit(fail ? 1 : 0);
})();
