/* Panduri Studio in a real browser: write on the neck, a teacher rhythm with a chord, play and loop (the strokes and
   notes that reach the sound engine are counted), edit in the piano roll and undo, save and reload, .panduri and MIDI
   out and in, mute, the phone layout. Usage: python3 serve.py <port> & node qa/pstudio-ui.cjs <port>
   Since Studio 3.0 (2026-11-19) the page opens inside the unified Studio: its view tabs and its Undo are the Studio's
   (.s3-tab, .s3-head); everything checked here is unchanged. */
const { chromium } = require('playwright'), assert = require('node:assert/strict');
const PORT = process.argv[2] || '8814';
(async () => {
  const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required', '--use-gl=angle', '--use-angle=swiftshader'] });
  const ctx = await b.newContext({ viewport: { width: 1280, height: 900 }, serviceWorkers: 'block' }); const p = await ctx.newPage();
  const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error' && !/Failed to load|net::/.test(m.text())) errs.push(m.text().slice(0, 160)); });
  await p.goto(`http://localhost:${PORT}/panduri/app/`); await p.waitForTimeout(1500);
  await p.evaluate(() => { PD.store.set('onboarded', true); PD.store.set('auth.skip', true); PD.i18n.set('en'); document.querySelectorAll('.ob,.ag,.intro').forEach(o => o.remove()); PD.app.go('practice'); });
  await p.waitForTimeout(600);
  assert.ok(await p.evaluate(() => [...document.querySelectorAll('.prow b')].some(x => x.textContent === 'Studio')), 'the Studio (which holds Panduri Studio) is listed on the practice page');
  await p.evaluate(() => PD.app.go('pstudio')); await p.waitForTimeout(800);
  const P0 = await p.evaluate(() => PD.pstudio.project.tracks.map(t => t.kind));
  assert.deepEqual(P0, ['rhythm', 'notes'], 'a new project: a rhythm track and a melody track');
  // 1. the neck: write A (open), D (C♯ string fret 1), G (E string fret 3)
  await p.evaluate(() => { const b = [...document.querySelectorAll('.pst-tg')].find(x => /Write from the neck/.test(x.textContent)); b.click(); });
  const box = await p.evaluate(() => { const r = document.querySelector('.pst-neck').getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height }; });
  const at = (s, f) => { const L = 46, R = box.w - 12, top = 18, bot = box.h - 30, u = (R - L) / 18; return [box.x + L + (f + .5) * u, box.y + top + (3 - s + .5) * (bot - top) / 3]; };
  for (const [s, f] of [[1, 0], [2, 1], [3, 3]]) { const [x, y] = at(s, f); await p.mouse.click(x, y); await p.waitForTimeout(120); }
  const notes = await p.evaluate(() => PD.pstudio.project.tracks[1].notes.map(n => [n.m, n.s, n.f, n.t]));
  assert.deepEqual(notes, [[57, 1, 0, 0], [62, 2, 1, .5], [67, 3, 3, 1]], 'three notes written from the neck, string and fret kept');
  // 2. the rhythm: the teacher's Mtiuluri, a Dm on bar 1
  await p.evaluate(() => { [...document.querySelectorAll('.pst-tc')][0].click(); }); await p.waitForTimeout(200);
  await p.evaluate(() => { document.querySelector('#page .s3-tab[data-v="rhythm"]').click(); }); await p.waitForTimeout(200);
  await p.evaluate(() => { const s = document.querySelector('.pst-tools select'); s.value = 'mtiuluri'; s.dispatchEvent(new Event('change')); }); await p.waitForTimeout(250);
  const steps = await p.evaluate(() => PD.pstudio.project.tracks[0].rhythm.steps.map(s => (s.dir === 'down' ? 'D' : 'U') + (s.acc ? '!' : '')).join(' '));
  assert.equal(steps, 'D! D U! D U', 'Mtiuluri: the teacher\'s strokes and accents');
  assert.ok(await p.evaluate(() => /not given this rhythm/.test(document.querySelector('.pst-body').innerText)), 'the page says the stroke lengths are not the teacher\'s');
  await p.evaluate(() => document.querySelector('.pst-bar').click()); await p.waitForTimeout(300);
  await p.evaluate(() => { const c = [...document.querySelectorAll('.pst-chc')].find(x => x.querySelector('b').textContent === 'Dm'); c.querySelector('.chip').click(); }); await p.waitForTimeout(300);
  const ch = await p.evaluate(() => PD.pstudio.project.tracks[0].rhythm.chords[0]);
  assert.equal(ch.name, 'Dm'); assert.ok(ch.frets.length === 3, 'Dm takes a shape on the three strings: ' + JSON.stringify(ch.frets));
  // 3. play: count what reaches the sound engine
  await p.evaluate(() => { window.__n = { note: 0, strum: 0, click: 0 }; const A = PD.audio; ['note', 'strum', 'click'].forEach(k => { const f = A[k]; A[k] = function () { window.__n[k]++; return f.apply(this, arguments); }; }); });
  await p.evaluate(() => { const s = PD.pstudio.project; s.bpm = 240; }); // fast, so a few seconds cover bars
  await p.evaluate(() => PD.pstudio.play({ from: 0 })); await p.waitForTimeout(2600);
  const run = await p.evaluate(() => ({ n: window.__n, t: PD.audio.ctx.currentTime, st: PD.audio.ctx.state }));
  await p.evaluate(() => PD.pstudio.stop());
  console.log('played:', JSON.stringify(run));
  assert.ok(run.n.strum >= 5, 'the rhythm strokes reached the engine'); assert.ok(run.n.note >= 3, 'the melody notes reached the engine');
  // 4. loop one bar: the strokes go on past the end of the bar
  await p.evaluate(() => { const s = PD.pstudio.project; s.loop = { on: true, from: 0, to: 1 }; window.__n.strum = 0; PD.pstudio.play(); }); await p.waitForTimeout(2600);
  const looped = await p.evaluate(() => window.__n.strum); await p.evaluate(() => { PD.pstudio.stop(); PD.pstudio.project.loop.on = false; });
  console.log('strokes in 2.6 s of a 1-bar loop at 240 BPM:', looped);
  assert.ok(looped >= 8, 'the loop came round (a bar has 5 strokes)');
  // 5. the piano roll: move the first note up a semitone, then undo
  await p.evaluate(() => { [...document.querySelectorAll('.pst-tc')][1].click(); }); await p.waitForTimeout(200);
  await p.evaluate(() => { document.querySelector('#page .s3-tab[data-v="roll"]').click(); }); await p.waitForTimeout(600);
  const id = await p.evaluate(() => PD.pstudio.project.tracks[1].notes[0].id);
  const r = await p.evaluate(id => document.querySelector('.rl').noteRect(id), id);
  await p.mouse.click(r.x + 6, r.y + r.height / 2); await p.waitForTimeout(250); await p.keyboard.press('ArrowUp'); await p.waitForTimeout(400);
  const moved = await p.evaluate(id => { const n = PD.pstudio.project.tracks[1].notes.find(x => x.id === id); return [n.m, n.s, n.f]; }, id);
  assert.deepEqual(moved, [58, 1, 1], 'A → B♭ on the same string');
  await p.evaluate(() => document.querySelector('#page .s3-head [aria-label="Undo"]').click()); await p.waitForTimeout(300);
  assert.equal(await p.evaluate(() => PD.pstudio.project.tracks[1].notes[0].m), 57, 'undo');
  // 6. saved: reload and find it all again
  await p.waitForTimeout(900); await p.reload(); await p.waitForTimeout(1500);
  await p.evaluate(() => { document.querySelectorAll('.ob,.ag,.intro').forEach(o => o.remove()); PD.app.go('pstudio'); }); await p.waitForTimeout(700);
  const after = await p.evaluate(() => ({ n: PD.pstudio.project.tracks[1].notes.length, r: PD.pstudio.project.tracks[0].rhythm.preset, c: PD.pstudio.project.tracks[0].rhythm.chords.length }));
  assert.deepEqual(after, { n: 3, r: 'mtiuluri', c: 1 }, 'the project came back after a reload');
  // 7. files: .panduri and MIDI out and back in
  const files = await p.evaluate(async () => {
    const C = PD.pstCore, P = PD.pstudio.project, text = C.serialize(P), mid = C.toMidi(P);
    const before = PD.store.get('pst.list', []).length;
    await PD.pstudio.importFile(new File([text], 'x.panduri', { type: 'application/json' }));
    const copy = PD.pstudio.project; const same = copy.id !== P.id && copy.tracks[1].notes.length === 3;
    await PD.pstudio.importFile(new File([mid], 'x.mid', { type: 'audio/midi' }));
    return { same, tracks: PD.pstudio.project.tracks.length, list: PD.store.get('pst.list', []).length - before };
  });
  assert.ok(files.same, '.panduri round trip'); assert.ok(files.tracks >= 4, 'MIDI import added its tracks (' + files.tracks + ')'); assert.ok(files.list >= 1, 'the imported project is listed');
  // 8. mute: a muted track gives no events
  const muted = await p.evaluate(() => { const P = PD.pstudio.project; P.tracks[0].mute = true; const n = PD.pstCore.events(P).filter(e => e.track === P.tracks[0].id).length; P.tracks[0].mute = false; return n; });
  assert.equal(muted, 0, 'mute');
  // 9. every view at phone width: no page wider than the screen
  await p.setViewportSize({ width: 390, height: 844 });
  for (let i = 0; i < 5; i++) { await p.evaluate(i => PD.studio3.workspace.setView(['fret', 'roll', 'rhythm', 'arrange', 'mixer'][i], true), i); await p.waitForTimeout(350);
    const ov = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth); assert.ok(ov <= 1, 'view ' + i + ' overflows by ' + ov);
    await p.screenshot({ path: `/tmp/pstudio-${i}.png` }); }
  assert.deepEqual(errs, []);
  console.log('pstudio-ui: all as expected');
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
