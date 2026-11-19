/* Studio 3.0, phases 0+1, in a real browser (Chromium): one Studio entry; the old routes and an old project still open;
   a song imported from the Studio's home goes through the AI studio's real analysis; one transport drives it and the
   two studios never sound at once; an arrangement is written, played, undone, saved, reloaded, exported and imported
   again; and the home and both workspaces at five screen sizes, with screenshots.
   Usage: python3 build.py && node qa/studio3-ui.cjs [app path from the repository root = panduri/source/dist/app] [shots dir]
   BROWSER=webkit runs the same in WebKit (Safari's engine; npx playwright install webkit). */
const fs = require('fs'), path = require('path'), assert = require('assert/strict');
const { chromium, webkit } = require('playwright');
const WEBKIT = process.env.BROWSER === 'webkit';
const localApp = require('./local-app.cjs');
const ROOT = path.resolve(__dirname, '../../..'), APP = (process.argv[2] || 'panduri/source/dist/app').replace(/^\/|\/$/g, '');
const SHOTS = path.resolve(process.argv[3] || path.join(ROOT, 'docs/studio3/screens/after'));
const SONG = path.join(ROOT, 'panduri/app/media/rhythms/bani-acharuli.mp3'), OLD = path.join(__dirname, 'fixtures/studio3/old-v1.panduri');
// the song views and the AI studio tab each must open (kept here so the test fails if the Studio's table changes silently)
const PD_VIEWS_SONG = [['player', 'overview'], ['lesson', 'learn'], ['stems', 'instruments'], ['chords', 'chords'], ['tab', 'tab'], ['roll', 'roll'], ['score', 'notation'], ['melody', 'solo'], ['rhythm', 'rhythm']].map(([id, ai]) => ({ id, ai }));
const TMP = fs.mkdtempSync(path.join(require('os').tmpdir(), 'studio3-'));
const results = []; let failed = 0;
const step = async (name, fn) => { const t0 = Date.now(); try { const info = await fn(), skipped = typeof info === 'string' && info.startsWith('skipped'); results.push({ name, ok: true, skipped, ms: Date.now() - t0, info: info === undefined ? null : info }); console.log((skipped ? '– ' : '✓ ') + name + (info !== undefined ? '  ' + JSON.stringify(info) : '')); }
  catch (e) { failed++; results.push({ name, ok: false, ms: Date.now() - t0, error: String(e && e.message || e).slice(0, 400) }); console.log('✗ ' + name + '\n    ' + String(e && e.message || e).slice(0, 400)); } };
const SIZES = [['desktop-1440x900', 1440, 900], ['desktop-1920x1080', 1920, 1080], ['tablet-768x1024', 768, 1024], ['phone-390x844', 390, 844], ['phone-430x932', 430, 932]];

async function open(b, w, hgt) {
  const ctx = await b.newContext({ viewport: { width: w, height: hgt }, serviceWorkers: 'block', deviceScaleFactor: 1, acceptDownloads: true });
  const p = await ctx.newPage(); const errs = [];
  p.on('pageerror', e => errs.push('pageerror: ' + e.message)); p.on('console', m => { if (m.type() === 'error' && !/Failed to load|net::|supabase|404|ERR_/.test(m.text())) errs.push('console: ' + m.text().slice(0, 200)); });
  await localApp(p, ROOT);
  await p.goto('http://panduri.test/' + APP + '/'); await p.waitForFunction(() => window.PD && PD.app && PD.studio3); await p.waitForTimeout(700);
  await p.evaluate(() => { PD.store.set('onboarded', true); PD.store.set('intro.done', true); PD.i18n.set('en'); document.querySelectorAll('.ob,.ag,.intro,.cine,.cine-boot').forEach(o => o.remove()); });
  return { ctx, p, errs };
}
const vis = (p, sel) => p.evaluate(s => [...document.querySelectorAll(s)].filter(e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(e).visibility !== 'hidden'; }).length, sel);
// a navigation, then the screen being left is gone (the app's transition keeps it in the document for up to ~0.7 s)
const settle = p => p.waitForFunction(() => document.querySelectorAll('#main > .page').length === 1, null, { timeout: 5000 }).catch(() => {});
const go = async (p, r, q) => { await p.evaluate(([r, q]) => PD.app.go(r, q), [r, q]); await settle(p); };
const clickView = (p, id) => p.evaluate(id => { const tab = document.querySelector('.s3-tab[data-v="' + id + '"]'); if (tab && tab.offsetParent) return tab.click();
  const W = PD.studio3.workspace, kind = W.root.dataset.kind, v = PD.studio3.VIEWS[kind].find(x => x.id === id); document.querySelector('.s3-mode[data-m="' + v.mode + '"]').click();
  const c = [...document.querySelectorAll('.s3-chip')].find(x => x.textContent === tab.textContent); if (c) c.click(); }, id);
async function importSong(p) {
  await go(p, 'studio3'); await p.waitForTimeout(300);
  await p.waitForFunction(() => document.querySelectorAll('#main > .page').length === 1, null, { timeout: 5000 }).catch(() => {});
  await p.setInputFiles('#page input[type=file]', SONG);
  await p.waitForSelector('.ai-facts', { timeout: 120000, state: 'attached' });
  await p.waitForFunction(() => document.querySelector('.s3-ws.s3-ready'), null, { timeout: 30000 }); await p.waitForTimeout(600);
}

(async () => {
  fs.mkdirSync(SHOTS, { recursive: true });
  const b = WEBKIT ? await webkit.launch() : await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required', '--use-gl=angle', '--use-angle=swiftshader'] });
  const { ctx, p, errs } = await open(b, 1440, 900);

  /* ---------- A. one Studio entry; the old entries lead into it ---------- */
  await step('navigation: one Studio entry, no separate AI studio entry', async () => {
    const nav = await p.evaluate(() => [...document.querySelectorAll('.side .nv')].map(x => [x.dataset.go, x.textContent.trim()]));
    const s = nav.filter(([g]) => g === 'studio3'); assert.equal(s.length, 1); assert.equal(s[0][1], 'Studio'); assert.ok(!nav.some(([g]) => g === 'ai' || g === 'pstudio'), JSON.stringify(nav));
    return nav.map(x => x[0]).join(',');
  });
  await step('old link go("ai") without a song opens the Studio home; the Studio tab is lit', async () => {
    await go(p, 'ai'); await p.waitForTimeout(400);
    const r = await p.evaluate(() => [PD.app.route, document.querySelector('.side .nv[aria-current]') && document.querySelector('.side .nv[aria-current]').dataset.go, !!document.querySelector('.s3-home')]);
    assert.deepEqual(r, ['studio3', 'studio3', true]); return r;
  });
  await step('practice page lists the one Studio (not two studios)', async () => {
    await go(p, 'practice'); await p.waitForTimeout(400);
    const rows = await p.evaluate(() => [...document.querySelectorAll('.prow b, .row b, .lrow b')].map(x => x.textContent));
    assert.ok(rows.includes('Studio'), rows.join('|')); assert.ok(!rows.includes('Fanduri Studio') && !rows.includes('AI studio'), rows.join('|'));
  });
  await step('home quick tool says Studio and opens the Studio home', async () => {
    await go(p, 'home'); await p.waitForTimeout(400);
    const lab = await p.evaluate(() => [...document.querySelectorAll('.hm-tool')].map(x => x.textContent.trim()));
    assert.ok(lab.includes('Studio'), lab.join('|'));
    await p.evaluate(() => [...document.querySelectorAll('.hm-tool')].find(x => x.textContent.trim() === 'Studio').click()); await p.waitForTimeout(400);
    assert.equal(await p.evaluate(() => PD.app.route), 'studio3'); return lab.join(' · ');
  });

  /* ---------- B. the Studio home ---------- */
  await step('Studio home: import, new project, MIDI/.panduri, templates with the teacher\'s four rhythms', async () => {
    const h = await p.evaluate(() => ({ h1: document.querySelector('.s3-home h1').textContent, cards: [...document.querySelectorAll('.s3-card b')].map(x => x.textContent),
      tpl: [...document.querySelectorAll('.s3-rchip')].map(x => x.querySelector('b').textContent + ' ' + x.querySelector('.mono').textContent), first: document.querySelector('input[type=file]').accept.slice(0, 15), flow: document.querySelectorAll('.s3-step').length }));
    assert.deepEqual(h.cards, ['Import a song', 'New blank project', 'Open MIDI / .panduri']);
    assert.deepEqual(h.tpl, ['Kazbeguri ↓! ↑ ↓', 'Mtiuluri ↓! ↓ ↑! ↓ ↑', 'Khorumi ↓! ↓ ↑ ↓ ↓! ↓ ↑', 'Acharuli ↓ ↓! ↑!'], 'the teacher\'s strokes and accents, in his order');
    assert.equal(h.first, 'audio/*,video/*'); assert.equal(h.flow, 5); return h.tpl;
  });

  /* ---------- C. an old project, from before the Studio, opens by the old route ---------- */
  const oldP = JSON.parse(fs.readFileSync(OLD, 'utf8'));
  await step('an old .panduri project (v1) stored by Panduri Studio opens by the old route go("pstudio")', async () => {
    await p.evaluate(o => { PD.store.set('pst.p.' + o.id, o); PD.store.set('pst.list', [{ id: o.id, name: o.name, modified: o.modified }].concat(PD.store.get('pst.list', []))); PD.store.set('pst.last', o.id); }, oldP);
    await p.reload(); await p.waitForFunction(() => window.PD && PD.studio3); await p.waitForTimeout(600);
    await p.evaluate(() => { document.querySelectorAll('.ob,.ag,.intro,.cine,.cine-boot').forEach(o => o.remove()); PD.app.go('pstudio'); }); await p.waitForTimeout(700);
    const r = await p.evaluate(() => { const P = PD.pstudio.project; return { route: PD.app.route, title: document.querySelector('.s3-title').value, id: P.id, bpm: P.bpm, meter: P.meter.join('/'), notes: P.tracks[1].notes.map(n => [n.m, n.s, n.f]), steps: P.tracks[0].rhythm.steps.map(s => (s.dir === 'down' ? 'D' : 'U') + (s.acc ? '!' : '')).join(' '), hist: history.state.p }; });
    assert.equal(r.title, oldP.name); assert.equal(r.id, oldP.id); assert.equal(r.bpm, 84); assert.equal(r.meter, '3/4');
    assert.deepEqual(r.notes, [[57, 1, 0], [62, 2, 1], [40, 0, -1]], 'notes, strings and frets as saved; the note the panduri lacks is kept');
    assert.equal(r.steps, 'D! U D'); assert.ok(/^p:p-old-fixture:/.test(r.hist), 'the history names the project: ' + r.hist); return r;
  });
  await step('the side panel tells where things come from (teacher strokes; lengths not given; one unplayable note)', async () => {
    const side = await p.evaluate(() => document.querySelector('.s3-side').innerText);
    assert.ok(/Strokes and accents[\s\S]*↓! ↑ ↓[\s\S]*teacher ✓/.test(side), side); assert.ok(/Stroke lengths[\s\S]*default · not given/.test(side), side); assert.ok(/1 notes the fanduri lacks/.test(side), side);
    assert.ok(/Tuning\s*A · C♯ · E/.test(side) && /Frets\s*17/.test(side), side); return side.split('\n').length + ' lines';
  });
  await step('old link go("pstudio", "roll") opens the piano roll view', async () => {
    await go(p, 'pstudio', 'roll'); await p.waitForTimeout(600);
    const r = await p.evaluate(() => [document.querySelector('.s3-tab[aria-selected=true]').dataset.v, PD.pstudio.engine.view, !!document.querySelector('.s3-pst .rl')]);
    assert.deepEqual(r, ['roll', 'roll', true]); return r;
  });

  /* ---------- D. a song: the real import and analysis, one transport ---------- */
  let songId = null;
  // a browser context that cannot keep a Blob in IndexedDB (Playwright's WebKit, Safari's private mode) cannot keep the song either
  const canStore = await p.evaluate(async () => { const ok = (await PD.blobs.put('qa.probe', new Blob([new Uint8Array(1000)], { type: 'audio/mpeg' }))) !== null; await PD.blobs.del('qa.probe'); return ok; });
  await step('import a song from the Studio home: the AI studio analyses it (on this device) and keeps it', async () => {
    await importSong(p);
    const r = await p.evaluate(() => { const c = PD.ai.current, rec = PD.store.get('ai.recent', []).find(x => x.id === c.id); return { route: PD.app.route, hist: history.state.p, id: c.id, key: rec.key, bpm: Math.round(c.res.bpm), chords: c.res.chords.length, dur: +c.res.dur.toFixed(2), stored: rec.stored, title: document.querySelector('.s3-title').value, save: document.querySelector('.s3-save').textContent }; });
    assert.equal(r.route, 'ai'); assert.equal(r.hist, r.id, 'the history holds the song id'); assert.ok(r.chords > 0 && r.bpm > 30 && r.key, JSON.stringify(r)); assert.equal(r.title, 'bani-acharuli');
    if (canStore) assert.equal(r.stored, true);
    else { assert.equal(r.stored, false); assert.equal(r.save, 'The file is not saved — pick it again', 'the header says the song was not kept'); r.note = 'this browser context keeps no Blob in IndexedDB: the song is analysed, not kept, and the header says so'; }
    songId = r.id; return r;
  });
  await step('one transport: the Studio\'s; the AI studio\'s own deck and tab bar are not shown', async () => {
    const r = { s3: await vis(p, '.s3-tr'), aiDeck: await vis(p, '.ai-deck'), aiTr: await vis(p, '.ai-tr'), pst: await vis(p, '.pst-transport'), aiTabs: await vis(p, '.apr-navigation'), aiFacts: await vis(p, '.ai-facts') };
    assert.deepEqual([r.s3, r.aiDeck, r.aiTr, r.pst, r.aiTabs], [1, 0, 0, 0, 0], JSON.stringify(r)); return r;
  });
  await step('the transport plays and pauses the song; the position moves', async () => {
    await p.click('.s3-play'); await p.waitForTimeout(1400);
    const a = await p.evaluate(() => ({ playing: PD.ai.current.transport.playing, pos: PD.ai.current.transport.pos(), clk: document.querySelector('.s3-clk').textContent, bb: document.querySelector('.s3-bb').textContent, owner: PD.transport.active === PD.ai.current.transport }));
    await p.click('.s3-play'); await p.waitForTimeout(250);
    const pz = await p.evaluate(() => PD.ai.current.transport.playing);
    assert.ok(a.playing && a.pos > .5 && a.owner, JSON.stringify(a)); assert.equal(pz, false); assert.ok(/^\d+\.\d$/.test(a.bb), 'bar.beat: ' + a.bb);
    await p.click('.s3-tr [aria-label="Stop and back to the start"]'); await p.waitForTimeout(200);
    assert.ok(await p.evaluate(() => PD.ai.current.transport.pos() < .05), 'stop goes back to the start'); return a;
  });
  await step('transport: loop this bar, metronome, count-in and speed reach the deck', async () => {
    await p.evaluate(() => PD.ai.current.transport.seek(2.2)); await p.waitForTimeout(100);
    await p.click('.s3-tr [aria-label="Loop this bar"]'); await p.click('.s3-tr [aria-label="Metronome"]'); await p.click('.s3-tr [aria-label="Count-in"]');
    await p.selectOption('.s3-speed', '0.75'); await p.waitForTimeout(500);
    const D = await p.evaluate(() => { const d = PD.ai.current.transport.D; return { loop: [d.loop.on, +d.loop.a.toFixed(2), +d.loop.b.toFixed(2)], click: d.click.on, count: d.countIn, speed: d.speed, pressed: [...document.querySelectorAll('.s3-tg')].map(x => x.getAttribute('aria-pressed')) }; });
    assert.ok(D.loop[0] && D.loop[1] <= 2.2 && D.loop[2] > 2.2, 'the bar under the playhead loops: ' + JSON.stringify(D.loop)); assert.deepEqual([D.click, D.count, D.speed], [true, true, .75]); assert.deepEqual(D.pressed, ['true', 'true', 'true']);
    await p.click('.s3-tr [aria-label="Loop this bar"]'); await p.click('.s3-tr [aria-label="Metronome"]'); await p.click('.s3-tr [aria-label="Count-in"]'); await p.selectOption('.s3-speed', '1'); await p.waitForTimeout(300);
    assert.deepEqual(await p.evaluate(() => { const d = PD.ai.current.transport.D; return [d.loop.on, d.click.on, d.countIn, d.speed]; }), [false, false, false, 1]); return D;
  });
  await step('every song view opens the AI studio\'s own pane (nothing re-implemented)', async () => {
    const out = {};
    for (const v of PD_VIEWS_SONG) { await clickView(p, v.id); await p.waitForTimeout(250); out[v.id] = await p.evaluate(() => document.querySelector('.ai-body .apr-navigation select').value); }
    assert.deepEqual(out, Object.fromEntries(PD_VIEWS_SONG.map(v => [v.id, v.ai]))); return out;
  });
  await step('the lesson card shows only in the Lesson view', async () => {
    await clickView(p, 'lesson'); await p.waitForTimeout(200); const a = await vis(p, '.ai-body > .ah');
    await clickView(p, 'player'); await p.waitForTimeout(200); const z = await vis(p, '.ai-body > .ah');
    assert.equal(z, 0); return { lesson: a, player: z };
  });
  await step('the song\'s side panel: tempo, key and chords as AI estimates; stems not separated', async () => {
    const side = await p.evaluate(() => document.querySelector('.s3-side').innerText);
    assert.ok(/Tempo[\s\S]*BPM[\s\S]*AI · estimate/.test(side) && /Key[\s\S]*nearest major\/minor[\s\S]*AI · estimate/.test(side) && /Not separated yet/.test(side), side); return side.split('\n').slice(0, 12).join(' / ');
  });
  await step('old link go("ai", <song id>) reopens the song from this device', async () => {
    await go(p, 'studio3'); await p.waitForTimeout(300);
    if (!canStore) return 'skipped: nothing was kept in this browser context, so there is nothing to reopen';
    const rows = await p.evaluate(() => [...document.querySelectorAll('.s3-row')].map(x => [x.dataset.kind, x.querySelector('b').textContent]));
    assert.ok(rows.some(([k, t]) => k === 'song' && t === 'bani-acharuli') && rows.some(([k, t]) => k === 'arrangement' && /Old project/.test(t)), 'the recent list holds both studios\' projects: ' + JSON.stringify(rows));
    await go(p, 'ai', songId); await p.waitForFunction(() => document.querySelector('.s3-ws.s3-ready'), null, { timeout: 60000 }); await p.waitForTimeout(300);
    assert.equal(await p.evaluate(() => PD.ai.current.id), songId); return rows.length + ' recent';
  });
  await step('back from a workspace returns to the Studio home', async () => {
    await go(p, 'studio3'); await go(p, 'pstudio'); await p.click('#page .s3-backb'); await settle(p); assert.equal(await p.evaluate(() => PD.app.route), 'studio3');
  });

  /* ---------- E. an arrangement: write, play, undo, save, reload, export, import ---------- */
  await step('new blank project: one melody track; three notes written from the neck keep string and fret', async () => {
    await p.evaluate(() => [...document.querySelectorAll('.s3-card')].find(x => /New blank project/.test(x.textContent)).click()); await p.waitForTimeout(700);
    assert.deepEqual(await p.evaluate(() => PD.pstudio.project.tracks.map(t => t.kind)), ['notes']);
    await p.evaluate(() => { const b = [...document.querySelectorAll('.pst-tg')].find(x => /Write from the neck/.test(x.textContent)); b.click(); });
    const box = await p.evaluate(() => { const r = document.querySelector('.pst-neck').getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height }; });
    const at = (s, f) => { const L = 46, R = box.w - 12, top = 18, bot = box.h - 30, u = (R - L) / 18; return [box.x + L + (f + .5) * u, box.y + top + (3 - s + .5) * (bot - top) / 3]; };
    for (const [s, f] of [[1, 0], [2, 1], [3, 3]]) { const [x, y] = at(s, f); await p.mouse.click(x, y); await p.waitForTimeout(120); }
    const notes = await p.evaluate(() => PD.pstudio.project.tracks[0].notes.map(n => [n.m, n.s, n.f, n.t]));
    assert.deepEqual(notes, [[57, 1, 0, 0], [62, 2, 1, .5], [67, 3, 3, 1]]); return notes;
  });
  await step('undo and redo from the Studio header', async () => {
    await p.click('.s3-head [aria-label="Undo"]'); await p.waitForTimeout(200); const u = await p.evaluate(() => PD.pstudio.project.tracks[0].notes.length);
    await p.click('.s3-head [aria-label="Redo"]'); await p.waitForTimeout(200); const r = await p.evaluate(() => PD.pstudio.project.tracks[0].notes.length);
    assert.deepEqual([u, r], [2, 3]); return { afterUndo: u, afterRedo: r };
  });
  await step('rename, tempo and metre from the header and the transport', async () => {
    await p.fill('.s3-title', 'Studio test'); await p.press('.s3-title', 'Enter'); await p.evaluate(() => document.querySelector('.s3-title').dispatchEvent(new Event('change')));
    await p.fill('.s3-tr .s3-num', '120'); await p.evaluate(() => document.querySelector('.s3-tr .s3-num').dispatchEvent(new Event('change'))); await p.selectOption('.s3-tr .s3-sel', '3/4'); await p.waitForTimeout(800);
    const P = await p.evaluate(() => ({ name: PD.pstudio.project.name, bpm: PD.pstudio.project.bpm, meter: PD.pstudio.project.meter.join('/'), saved: document.querySelector('.s3-save').textContent }));
    assert.deepEqual([P.name, P.bpm, P.meter], ['Studio test', 120, '3/4']); return P;
  });
  await step('the transport plays the arrangement: notes reach the sound engine; stop', async () => {
    await p.evaluate(() => { window.__n = { note: 0, strum: 0 }; const A = PD.audio; ['note', 'strum'].forEach(k => { const f = A[k]; A[k] = function () { window.__n[k]++; return f.apply(this, arguments); }; }); });
    await p.click('.s3-play'); await p.waitForTimeout(1600);
    const r = await p.evaluate(() => ({ n: window.__n.note, playing: PD.pstudio.engine.playing, head: +PD.pstudio.engine.head.toFixed(2), owner: PD.transport.active && PD.transport.active.id, bb: document.querySelector('.s3-bb').textContent }));
    await p.click('.s3-tr [aria-label="Stop and back to the start"]'); await p.waitForTimeout(200);
    assert.ok(r.n >= 3 && r.playing && r.owner === 'pst', JSON.stringify(r)); assert.equal(await p.evaluate(() => [PD.pstudio.engine.playing, PD.pstudio.engine.head].join()), 'false,0'); return r;
  });
  await step('template "Traditional rhythm & solo" with Mtiuluri: the teacher\'s strokes; the page says the lengths are not his', async () => {
    await go(p, 'studio3'); await p.waitForTimeout(300);
    await p.evaluate(() => [...document.querySelectorAll('.s3-rchip')].find(x => /Mtiuluri/.test(x.textContent)).click()); await p.waitForTimeout(700);
    const r = await p.evaluate(() => { const P = PD.pstudio.project, R = P.tracks[0].rhythm; return { view: document.querySelector('.s3-tab[aria-selected=true]').dataset.v, kinds: P.tracks.map(t => t.kind), steps: R.steps.map(s => (s.dir === 'down' ? 'D' : 'U') + (s.acc ? '!' : '')).join(' '), notice: /not given this rhythm/.test(document.querySelector('.s3-pst').innerText), side: document.querySelector('.s3-side').innerText }; });
    assert.equal(r.view, 'rhythm'); assert.deepEqual(r.kinds, ['rhythm', 'notes']); assert.equal(r.steps, 'D! D U! D U'); assert.ok(r.notice); assert.ok(/teacher ✓/.test(r.side) && /default · not given/.test(r.side), r.side);
    return { steps: r.steps };
  });
  await step('a stroke changed by hand: the side panel no longer calls it the teacher\'s', async () => {
    await p.evaluate(() => document.querySelectorAll('.pst-step .pst-dir')[1].click()); await p.waitForTimeout(1300);
    const chip = () => p.evaluate(() => { const r = [...document.querySelectorAll('.s3-side .s3-kv')].find(x => x.querySelector('.s3-k').textContent === 'Strokes and accents'); return r && r.querySelector('.s3-prov').textContent; });
    const a = await chip(); assert.equal(a, 'you · corrected');
    const page = await p.evaluate(() => ({ notice: document.querySelector('.s3-pst .notice').textContent, opt: document.querySelector('.s3-pst .pst-tools select').selectedOptions[0].textContent }));
    assert.ok(/no longer his rhythm/.test(page.notice) && /changed by you/.test(page.opt), 'the rhythm page says it too: ' + JSON.stringify(page));
    await p.click('.s3-head [aria-label="Undo"]'); await p.waitForTimeout(1300);
    const z = await chip(); assert.equal(z, 'teacher ✓', 'undone: his again'); return { edited: a, undone: z };
  });
  await step('saved: after a reload the arrangement is all there', async () => {
    const id = await p.evaluate(() => PD.pstudio.project.id); await p.waitForTimeout(800);
    await p.reload(); await p.waitForFunction(() => window.PD && PD.studio3); await p.waitForTimeout(600);
    await p.evaluate(id => { document.querySelectorAll('.ob,.ag,.intro,.cine,.cine-boot').forEach(o => o.remove()); PD.app.go('pstudio', 'p:' + id); }, id); await p.waitForTimeout(700);
    const r = await p.evaluate(() => { const P = PD.pstudio.project; return [P.tracks[0].rhythm.steps.map(s => (s.dir === 'down' ? 'D' : 'U') + (s.acc ? '!' : '')).join(' '), document.querySelector('.s3-title').value]; });
    assert.equal(r[0], 'D! D U! D U'); return r;
  });
  const dl = async (label) => { const [d] = await Promise.all([p.waitForEvent('download', { timeout: 8000 }), (async () => { await p.click('.s3-head [aria-label="Actions"]'); await p.waitForTimeout(250); await p.evaluate(l => [...document.querySelectorAll('.s3-act')].find(x => x.textContent === l).click(), label); })()]); const f = path.join(TMP, d.suggestedFilename()); await d.saveAs(f); return f; };
  let fP = null, fM = null;
  await step('export .panduri and MIDI from the header', async () => {
    await go(p, 'pstudio', 'p:p-old-fixture'); await p.waitForTimeout(700);
    fP = await dl('.panduri file'); fM = await dl('Export MIDI');
    const j = JSON.parse(fs.readFileSync(fP, 'utf8')), m = fs.readFileSync(fM);
    assert.equal(j.format, 'panduri-project'); assert.equal(j.v, 1); assert.equal(m.slice(0, 4).toString(), 'MThd');
    return { panduri: path.basename(fP), tracks: j.tracks.length, midiBytes: m.length };
  });
  await step('open the exported files from the Studio home: each becomes its own project', async () => {
    await go(p, 'studio3'); await p.waitForTimeout(300);
    await p.setInputFiles('#page input[type=file][accept^=".panduri"]', fP); await p.waitForTimeout(900);
    const a = await p.evaluate(() => { const P = PD.pstudio.project; return { route: PD.app.route, name: P.name, id: P.id, notes: P.tracks[1].notes.map(n => [n.m, n.s, n.f]) }; });
    assert.equal(a.route, 'pstudio'); assert.notEqual(a.id, 'p-old-fixture', 'a new id: the original is not overwritten'); assert.deepEqual(a.notes, [[57, 1, 0], [62, 2, 1], [40, 0, -1]]);
    await go(p, 'studio3'); await p.waitForTimeout(300);
    await p.setInputFiles('#page input[type=file][accept^=".panduri"]', fM); await p.waitForTimeout(900);
    const m = await p.evaluate(() => { const P = PD.pstudio.project; return { bpm: P.bpm, meter: P.meter.join('/'), tracks: P.tracks.map(t => [t.kind, t.notes.length]) }; });
    assert.equal(m.bpm, 84); assert.equal(m.meter, '3/4'); assert.ok(m.tracks.length >= 1 && m.tracks.every(([k]) => k === 'notes'), JSON.stringify(m));
    return { panduri: a.notes.length + ' notes', midi: m };
  });

  /* ---------- F. never two players at once ---------- */
  await step('PD.transport: the arrangement starting pauses a playing AI deck, and the deck starting stops the arrangement', async () => {
    const r = await p.evaluate(async () => {
      const d = PD.aiDeck.create(() => {}), L = new Float32Array(44100 * 3); d.setSet({ id: 'qa', sr: 44100, from: 0, tracks: [{ name: 'mix', L, R: L }] });
      await d.play(); await new Promise(z => setTimeout(z, 250)); const a = d.playing;
      PD.pstudio.engine.play(); await new Promise(z => setTimeout(z, 250)); const b = [d.playing, PD.pstudio.engine.playing];
      await d.play(); await new Promise(z => setTimeout(z, 250)); const c = [d.playing, PD.pstudio.engine.playing];
      d.destroy(); return { deckAlone: a, afterArrangement: b, afterDeck: c };
    });
    assert.deepEqual(r, { deckAlone: true, afterArrangement: [false, true], afterDeck: [true, false] }); return r;
  });
  await step('no errors on the page', async () => { assert.deepEqual(errs, []); });
  await ctx.close();

  /* ---------- G. five screen sizes: no sideways scrolling, the player on the first screen, the right navigation ---------- */
  const layout = [];
  for (const [name, w, hgt] of SIZES) {
    const o = await open(b, w, hgt);
    await step('layout ' + name, async () => {
      const m = {};
      const measure = async label => o.p.evaluate(label => {
        const r = s => { const e = document.querySelector('#page ' + s); if (!e) return null; const b = e.getBoundingClientRect(); return b.width && b.height ? { top: Math.round(b.top), bottom: Math.round(b.bottom), left: Math.round(b.left), right: Math.round(b.right) } : null; };
        const playB = r('.s3-play'), cnt = r('.s3-tr [aria-label="Count-in"]');
        return { label, overflowX: document.documentElement.scrollWidth > innerWidth + 1 || document.getElementById('page').scrollWidth > document.getElementById('page').clientWidth + 1, transport: r('.s3-tr'), playOnFirstScreen: !!playB && playB.bottom < innerHeight - 70, oneRow: !!playB && !!cnt && Math.abs(playB.top + (playB.bottom - playB.top) / 2 - (cnt.top + (cnt.bottom - cnt.top) / 2)) < 6,
          tabs: !!r('.s3-tabs'), modes: !!r('.s3-modes'), side: !!r('.s3-side'), modesN: document.querySelectorAll('#page .s3-mode').length };
      }, label);
      await go(o.p, 'studio3'); await o.p.waitForTimeout(500);
      m.home = await o.p.evaluate(() => ({ overflowX: document.documentElement.scrollWidth > innerWidth + 1 || document.getElementById('page').scrollWidth > document.getElementById('page').clientWidth + 1, cards: document.querySelectorAll('.s3-card').length }));
      await o.p.screenshot({ path: path.join(SHOTS, name + '-home.jpg'), type: 'jpeg', quality: 72 });
      await importSong(o.p); await clickView(o.p, 'player'); await o.p.waitForTimeout(400);
      m.song = await measure('song');
      await o.p.screenshot({ path: path.join(SHOTS, name + '-song.jpg'), type: 'jpeg', quality: 72 });
      await o.p.evaluate(() => { const id = PD.pstudio.create('rhythm:kazbeguri'); PD.app.go('pstudio', 'p:' + id + ':fret'); }); await o.p.waitForTimeout(800);
      m.arr = await measure('arrangement');
      await o.p.screenshot({ path: path.join(SHOTS, name + '-arrangement.jpg'), type: 'jpeg', quality: 72 });
      const phone = w < 600, wide = w >= 1100;
      for (const k of ['song', 'arr']) {
        const x = m[k]; assert.ok(!x.overflowX, k + ': sideways scrolling'); assert.ok(x.playOnFirstScreen, k + ': the play button is below the first screen ' + JSON.stringify(x.transport));
        assert.equal(x.tabs, !phone, k + ': flat tabs on a wide screen only'); assert.equal(x.modes, phone, k + ': Learn · Sounds · Notes · Edit on a phone'); assert.equal(x.side, wide, k + ': the side panel from 1100 px');
        if (phone) assert.ok(x.oneRow, k + ': the first row of the transport fits on one line');
      }
      assert.equal(m.arr.modesN, 3, 'an arrangement has no Learn mode yet (phase 5)'); assert.equal(m.song.modesN, 4);
      assert.ok(!m.home.overflowX, 'home: sideways scrolling'); layout.push(Object.assign({ size: name }, m));
      return { home: m.home, song: { tabs: m.song.tabs, modes: m.song.modes, side: m.song.side, transportTop: m.song.transport && m.song.transport.top }, arr: { transportTop: m.arr.transport && m.arr.transport.top } };
    });
    await step('no errors at ' + name, async () => { assert.deepEqual(o.errs, []); });
    await o.ctx.close();
  }
  await b.close();
  fs.rmSync(TMP, { recursive: true, force: true });
  const skipped = results.filter(r => r.skipped).length;
  fs.writeFileSync(path.join(SHOTS, 'results.json'), JSON.stringify({ app: APP, browser: WEBKIT ? 'webkit' : 'chromium', date: new Date().toISOString(), passed: results.filter(r => r.ok && !r.skipped).length, skipped, failed, results, layout }, null, 1));
  console.log('\n' + (results.length - failed - skipped) + ' passed, ' + skipped + ' skipped, ' + failed + ' failed');
  process.exit(failed ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
