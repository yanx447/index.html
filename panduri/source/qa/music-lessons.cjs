/* The MUSIC library lessons, the Tushuri rhythm and the owner's lesson editor, in Chromium on the built app.
   node qa/music-lessons.cjs [--shots DIR]      (needs dist/app: python3 build.py)
   Requests to the Supabase server are refused here, so nothing reaches production. */
const path = require('path'), fs = require('fs'), http = require('http');
const { chromium } = require(path.join(__dirname, '..', 'node_modules', 'playwright'));
const APP = path.join(__dirname, '..', 'dist', 'app');
const SHOTS = process.argv.includes('--shots') ? process.argv[process.argv.indexOf('--shots') + 1] : null;
const T = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml', '.mp3': 'audio/mpeg', '.webmanifest': 'application/manifest+json', '.woff2': 'font/woff2' };
const srv = http.createServer((q, r) => {
  const u = decodeURIComponent(q.url.split('?')[0]), f = path.join(APP, u.endsWith('/') ? u + 'index.html' : u);
  if (!f.startsWith(APP) || !fs.existsSync(f)) { r.writeHead(404); return r.end(); }
  r.writeHead(200, { 'Content-Type': T[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r);
});
let fails = 0, passes = 0;
const ok = (c, m, extra) => { if (c) { passes++; console.log('  ✓ ' + m); } else { fails++; console.log('  ✗ ' + m + (extra ? ' — ' + JSON.stringify(extra).slice(0, 400) : '')); } };
const AI_TEXT = /AI-ის შეფასება|AI-მ ამოიცნო|შეამოწმე ყურით|ყურით შეამოწმე|AI estimate|check it by ear|მასწავლებლის ჩარტი|not the teacher's chart/i;

(async () => {
  await new Promise(r => srv.listen(0, '127.0.0.1', r)); const base = 'http://127.0.0.1:' + srv.address().port + '/';
  const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  async function page(w, hh) {
    const ctx = await b.newContext({ viewport: { width: w, height: hh }, serviceWorkers: 'block' });
    await ctx.route(/supabase\.co/, r => r.abort());
    const p = await ctx.newPage(); p.errors = [];
    p.on('pageerror', e => p.errors.push(e.message)); p.on('console', m => { if (m.type() === 'error' && !/Failed to load resource|net::ERR/.test(m.text())) p.errors.push(m.text()); });
    await p.addInitScript(() => { for (const [k, v] of [['lang', 'ka'], ['language.chosen', true], ['onboarded', true], ['intro.done', true], ['first.done', true]]) localStorage.setItem('pd2:' + k, JSON.stringify(v)); });
    await p.goto(base + 'index.html'); await p.waitForFunction(() => window.PD && PD.musicLib && PD.musicLib.loaded, null, { timeout: 30000 });
    await p.waitForTimeout(400);
    // the sign-in screen of a fresh profile (no session in a test): out of the way, the app stays as a guest's
    await p.evaluate(() => { document.querySelectorAll('.ag, .ob, .ob-back').forEach(x => x.remove()); });
    return p;
  }
  const p = await page(1280, 900);

  console.log('\n# the library: one lesson per recording, the same data everywhere');
  const lib = await p.evaluate(() => {
    const ids = PD.musicLib.ids(), out = { n: ids.length, bad: [], sync: [], tab: [], rh: {} };
    ids.forEach(id => {
      const l = PD.lessons.get(id), D = PD.musicLib.data(id);
      if (!l || !l.events.length || !l.beatMap || l.path !== 'songs') { out.bad.push(id); return; }
      // every stroke the engine asks for plays the chord the song has at that moment (the one chord source)
      let k = 0, same = 0;
      l.events.filter(e => e.chord).forEach(e => { k++; const x = PD.musicLib.timeAt(D, e.t), c = PD.musicLib.chordAt(D, x + .015), nm = c && (c.play || c.chord); const sh = PD.musicLib.shape(nm); if (sh && sh.name === e.chord || nm === e.chord) same++; });
      out.sync.push([id, same, k]);
      const T = PD.musicLib.tab(D); out.tab.push([id, T.notes.filter(n => n && n.ok).length, T.notes.length, T.octave]);
      out.rh[id] = (D.rhythm || []).map(r => r.id).join(',');
    });
    out.lessonsSongs = PD.lessons.all.filter(l => l.musiclib).length;
    return out;
  });
  ok(lib.n === 19, '19 song lessons from MUSIC', lib.n);
  ok(!lib.bad.length, 'every one is a song lesson with a beat map and strokes', lib.bad);
  ok(lib.sync.every(([, s, k]) => k > 0 && s === k), 'every stroke plays the chord the song has at that time', lib.sync.filter(([, s, k]) => s !== k));
  ok(lib.tab.every(([, a, n]) => a === n), 'every melody note has a string and a fret on the panduri', lib.tab.filter(([, a, n]) => a !== n));
  ok(lib.rh['ml-shenam-vin-gkitkhavs-diatso'] === 'tushuri' && lib.rh['sb-shen-alazano'] === 'tushuri', 'the two Tushetian songs use Tushuri', lib.rh);
  ok(lib.lessonsSongs === 19, 'the songbook entries of the same songs are replaced, not duplicated', lib.lessonsSongs);
  const dup = await p.evaluate(() => { const ids = PD.lessons.all.map(l => l.id); return ids.filter((x, i) => ids.indexOf(x) !== i); });
  ok(!dup.length, 'no lesson id twice', dup);

  console.log('\n# the song page (learner)');
  await p.evaluate(() => PD.app.go('lesson', 'ml-shenam-vin-gkitkhavs-diatso')); await p.waitForTimeout(900);
  const sp = await p.evaluate(() => { const r = document.querySelector('#page') || document.body; return { sheet: !!r.querySelector('.ml'), facts: r.querySelectorAll('.ml-facts div').length, lyr: r.querySelectorAll('.ml-line').length, chips: [...r.querySelectorAll('.ml-chips button')].map(b => b.textContent), adm: !!r.querySelector('.ml-adm'), text: r.innerText, noAudio: !!r.querySelector('.ml-player .notice') }; });
  ok(sp.sheet && sp.facts >= 5, 'song sheet with performer, key, tempo, meter, length, level', sp.facts);
  ok(sp.lyr === 4, 'the owner\'s four lines, with chords over their syllables', sp.lyr);
  ok(sp.chips.some(c => /თუშური/.test(c)), 'Tushuri among the rhythms', sp.chips);
  ok(!sp.adm, 'no editor buttons for a learner');
  ok(!AI_TEXT.test(sp.text), 'no "AI estimate / check by ear" text on the page');
  ok(sp.noAudio, 'without a published recording the page offers to load the learner\'s own copy');
  if (SHOTS) await p.screenshot({ path: path.join(SHOTS, 'song-desktop.png'), fullPage: false });

  console.log('\n# practice with the microphone: the lesson engine plays the song');
  const pr = await p.evaluate(async () => { const l = PD.lessons.get('ml-shenam-vin-gkitkhavs-diatso'); const free = PD.premium.canOpen(l.id); PD.premium.canOpen = () => true; PD.practice.open(l, { mode: 'learn', wait: true, tempo: .7 }, l.id, 'slow'); await new Promise(r => setTimeout(r, 800));
    const st = PD.lessons.steps(l); return { route: document.documentElement.dataset.route, steps: st.length, strokes: [...new Set(st.slice(0, 12).map(x => x.st))], chords: [...new Set(st.slice(0, 40).map(x => x.name).filter(Boolean))], active: PD.practice.active, free }; });
  ok(pr.active && pr.steps > 100 && pr.strokes.includes('down') && pr.strokes.includes('up') && pr.chords.length, 'practice opens: ↓ ↑ strokes on the song\'s chords, waiting for the learner', pr);
  ok(pr.free === false, 'like every song after the free ones, it is a Premium lesson for a learner without Premium (unchanged rule)', pr.free);
  await p.evaluate(() => { try { PD.practice.close(true); } catch (_) {} PD.app.go('songs'); }); await p.waitForTimeout(600);

  console.log('\n# the AI studio\'s own lesson text and the songs list');
  await p.evaluate(() => PD.app.go('songs')); await p.waitForTimeout(600);
  const sl = await p.evaluate(() => (document.querySelector('#page') || document.body).innerText);
  ok(!AI_TEXT.test(sl) && /შენამ ვინ გკითხავს დიაცო|სულიკო/.test(sl), 'songs list shows the new songs, without AI notices');

  console.log('\n# Tushuri');
  await p.evaluate(() => PD.app.go('rhythms')); await p.waitForTimeout(500);
  const rl = await p.evaluate(() => { const r = document.querySelector('#page') || document.body; return { sec: r.innerText.includes('ქართული რითმები'), tush: r.innerText.includes('თუშური'), rest: r.querySelectorAll('.rh-rest').length }; });
  ok(rl.sec && rl.tush && rl.rest >= 1, 'rhythm catalogue: Georgian rhythms section with Tushuri and its pause card', rl);
  const teacher = await p.evaluate(() => PD.curriculum.rhythms().map(r => r.id).join(','));
  ok(teacher === 'kazbeguri,mtiuluri,khorumi,acharuli', 'the teacher\'s four rhythms unchanged, same order', teacher);
  await p.evaluate(() => PD.app.go('rhythm', 'tushuri')); await p.waitForTimeout(500);
  const rd = await p.evaluate(() => { const r = document.querySelector('#page') || document.body; return { cards: r.querySelectorAll('.rh-row.big .rh-card').length, rest: r.querySelectorAll('.rh-row.big .rh-rest').length, draft: r.innerText.includes('ჯერ დაუდასტურებელი'), teacherTag: [...r.querySelectorAll('.tag')].some(x => x.textContent.includes('მასწავლებლის')) }; });
  ok(rd.cards === 3 && rd.rest === 1 && rd.draft && !rd.teacherTag, 'Tushuri page: ↓ ↑ · , marked not yet confirmed, not as the teacher\'s', rd);
  const tl = await p.evaluate(() => { const L = PD.lessons.rhythmLessons().find(l => l.rhythm === 'tushuri'); const s = PD.lessons.steps(L); return { n: s.length, d: s.slice(0, 2).map(x => +x.d.toFixed(3)), t: s.slice(0, 3).map(x => +x.t.toFixed(3)) }; });
  ok(tl.n === 8 && tl.t[1] === .386 && tl.t[2] === 1 && tl.d[1] < .3, 'microphone practice lesson: ↓ at 0, ↑ at .386, silence until the next beat', tl);
  const pat = await p.evaluate(() => ['ml-shenam-vin-gkitkhavs-diatso', 'sb-shen-alazano'].map(id => { const D = PD.musicLib.data(id), P = PD.musicLib.pattern(D.rhythm[0]); return { s: PD.musicLib.patText(P), rest: P.strokes.find(x => x.dir === 'rest').pos, ms: Math.round((1 - P.strokes.find(x => x.dir === 'rest').pos) * 60000 / D.bpm) }; }));
  ok(pat.every(x => x.s === '↓ ↑ ·') && pat[0].ms !== pat[1].ms, 'each Tushetian song keeps its own pause, from its own tempo', pat);

  console.log('\n# the editor is the owner\'s only');
  const deny = await p.evaluate(async () => { PD.app.go('songadmin'); await new Promise(r => setTimeout(r, 300)); const r1 = document.documentElement.dataset.route; await PD.lessonEditor.open('sb-suliko', 'chords'); return { route: r1, editor: !!document.querySelector('.le') }; });
  ok(deny.route !== 'songadmin' && !deny.editor, 'a learner cannot open the dashboard or the editor', deny);
  const rpc = await p.evaluate(async () => { try { await PD.cloud.db.rpc('song_lesson_save', { p_id: 'sb-suliko', p_draft: {} }); return 'sent'; } catch (e) { return e.code || 'err'; } });
  ok(rpc !== 'sent', 'and nothing was saved (the server refuses; here the request does not even leave)', rpc);

  console.log('\n# the editor (as the owner; the server is unreachable here)');
  await p.evaluate(() => { Object.defineProperty(PD.cloud, 'isOwner', { get: () => true, configurable: true }); PD.app.go('lesson', 'sb-suliko'); });
  await p.waitForTimeout(800);
  ok(await p.evaluate(() => document.querySelectorAll('.ml-adm button').length >= 8), 'owner sees Edit Lesson · Chords · Notes · Rhythm · Lyrics · Tablature · Tempo · Verify');
  await p.evaluate(() => PD.lessonEditor.open('sb-suliko', 'chords')); await p.waitForSelector('.le canvas'); await p.waitForTimeout(800);
  if (SHOTS) await p.screenshot({ path: path.join(SHOTS, 'editor-desktop.png') });
  const E = () => p.evaluate(() => { const S = PD.lessonEditor.state; return S && { n: S.D.chords.length, c0: S.D.chords[0] && S.D.chords[0].chord, t1: S.D.chords[1] && S.D.chords[1].t, undo: S.undo.length, redo: S.redo.length, dirty: S.dirty, notes: S.D.notes.length, sel: S.sel }; });
  const e0 = await E();
  ok(e0 && e0.n > 10, 'editor opened with the song\'s chords', e0);
  // select the first chord by clicking it, rename it in the inspector
  const geo = await p.evaluate(() => { const S = PD.lessonEditor.state, r = S.cv.getBoundingClientRect(), c = S.D.chords[1], x = S.head + (c.t - S.x0) * S.zoom; return { x: r.left + x + 8, y: r.top + 28 + 62 + 22, x1: r.left + x, t1: c.t, zoom: S.zoom }; });
  await p.mouse.click(geo.x, geo.y); await p.waitForTimeout(150);
  ok((await E()).sel && (await E()).sel.k === 'chords', 'click selects a chord block', (await E()).sel);
  await p.selectOption('.le-insp select', 'Em'); await p.waitForTimeout(150);
  const e1 = await p.evaluate(() => { const S = PD.lessonEditor.state; return S.D.chords[S.sel.i[0]].chord; });
  ok(e1 === 'Em', 'the inspector renames it (e.g. E → Em)', e1);
  // drag its left edge 0.25 s later with snap off
  await p.evaluate(() => { PD.lessonEditor.state.snap = 'off'; });
  await p.mouse.move(geo.x1 + 1, geo.y); await p.mouse.down(); await p.mouse.move(geo.x1 + 1 + geo.zoom * .25, geo.y, { steps: 6 }); await p.mouse.up(); await p.waitForTimeout(150);
  const e2 = await E();
  ok(Math.abs(e2.t1 - (geo.t1 + .25)) < .03, 'dragging its start moves it to the new time', { was: geo.t1, now: e2.t1 });
  // exact time in the inspector (ms)
  await p.evaluate(() => { const i = document.querySelector('.le-insp input[type=number]'); i.value = '12.345'; i.dispatchEvent(new Event('change')); });
  ok(Math.abs((await E()).t1 - 12.345) < 1e-6 || (await p.evaluate(() => PD.lessonEditor.state.D.chords.some(c => c.t === 12.345))), 'start time typed to the millisecond (12.345 s)');
  // undo / redo
  const u0 = (await E()).undo; await p.keyboard.press(process.platform === 'darwin' ? 'Meta+z' : 'Control+z'); const u1 = await E();
  ok(u1.undo === u0 - 1 && u1.redo === 1, 'undo', { u0, u1 });
  await p.keyboard.press(process.platform === 'darwin' ? 'Meta+Shift+z' : 'Control+Shift+z'); const u2 = await E();
  ok(u2.undo === u0 && u2.redo === 0, 'redo', u2);
  // insert a chord at the playhead (I), split, delete
  await p.evaluate(() => { const S = PD.lessonEditor.state; S.snap = 'beat'; S.sel = null; S.audio.currentTime = 30; document.activeElement && document.activeElement.blur(); });
  const n0 = (await E()).n; await p.keyboard.press('i'); const n1 = (await E()).n;
  ok(n1 === n0 + 1, 'I inserts a chord at the playhead', { n0, n1 });
  await p.keyboard.press('Delete'); ok((await E()).n === n0, 'Delete removes it');
  // copy a range and paste it (repeat a passage)
  const rep = await p.evaluate(() => { const S = PD.lessonEditor.state; S.range = [S.D.beats[8], S.D.beats[16]]; return S.D.chords.filter(c => c.t >= S.range[0] && c.t < S.range[1]).length; });
  await p.keyboard.press(process.platform === 'darwin' ? 'Meta+d' : 'Control+d');
  ok((await E()).undo > u0, 'a selected passage repeats after itself (⌘D)', rep);
  // notes: add one by double-click in the piano roll, it gets a string and fret
  const nn0 = (await E()).notes;
  const ny = await p.evaluate(() => { const S = PD.lessonEditor.state, r = S.cv.getBoundingClientRect(); S.x0 = 40; return { x: r.left + S.head + 200, y: r.top + 28 + 62 + 44 + 70 }; });
  await p.mouse.dblclick(ny.x, ny.y); await p.waitForTimeout(150);
  ok((await E()).notes === nn0 + 1, 'double-click in the piano roll adds a note');
  const tabOk = await p.evaluate(() => { const S = PD.lessonEditor.state, i = S.sel.i[0], T = PD.musicLib.tab(S.D); return T.notes[i]; });
  ok(tabOk && tabOk.s >= 1 && tabOk.f >= 0, 'and the tablature gives it a string and fret', tabOk);
  // an impossible note is flagged to the owner
  await p.evaluate(() => { const S = PD.lessonEditor.state, i = S.sel.i[0]; const sel = [...document.querySelectorAll('.le-insp select')][0]; sel.value = '40'; sel.dispatchEvent(new Event('change')); });
  ok(await p.evaluate(() => /დიაპაზონს|outside the panduri/.test(document.querySelector('.le-insp').innerText)), 'a note below the panduri\'s range is flagged (owner only)');
  // rhythm: switch the whole song to Tushuri
  await p.evaluate(() => { const S = PD.lessonEditor.state; S.x0 = 0; S.sel = null; });
  const rhy = await p.evaluate(() => { const S = PD.lessonEditor.state, r = S.cv.getBoundingClientRect(); return { x: r.left + S.head + 30, y: r.top + 28 + 62 + 44 + 150 + 20 }; });
  await p.mouse.click(rhy.x, rhy.y); await p.waitForTimeout(150);
  const rsel2 = await E(); ok(rsel2.sel && rsel2.sel.k === 'rhythm', 'click selects the rhythm segment', rsel2.sel);
  await p.selectOption('.le-insp select', 'tushuri'); await p.waitForTimeout(150);
  ok(await p.evaluate(() => PD.lessonEditor.state.D.rhythm[0].id === 'tushuri'), 'the rhythm editor switches the song to Tushuri');
  // lyrics: ChordPro text → lines + chords on syllables
  await p.evaluate(() => { const S = PD.lessonEditor.state; S.audio.currentTime = 20; });
  await p.evaluate(() => { document.querySelector('.le-menu') || document.querySelector('.le-top .le-ib:last-child').click(); });
  await p.click('.le-menu button[data-t="le.chordpro"]'); await p.waitForSelector('.le-cp');
  await p.fill('.le-cp', '[Am] შენამ ვინ გკითხავს დიაცო,\nთოფისასა და [E] ხმლი[F]სასა,');
  await p.click('.sheet button.primary'); await p.waitForTimeout(200);
  const ly = await p.evaluate(() => { const S = PD.lessonEditor.state, L = S.D.lyrics; const at = (ln, i) => { let x = ln.t; ln.syl.forEach(y => { if (y.i <= i) x = y.t; }); return x; }; const ln2 = L[1]; const iE = ln2.text.indexOf('ხმლი'), iF = ln2.text.indexOf('სასა', iE); return { n: L.length, E: S.D.chords.some(c => Math.abs(c.t - at(ln2, iE)) < .001 && c.chord === 'E'), F: S.D.chords.some(c => Math.abs(c.t - at(ln2, iF)) < .001 && c.chord === 'F'), A: S.D.chords.some(c => Math.abs(c.t - L[0].t) < .2 && c.chord === 'Am') }; });
  ok(ly.n === 2 && ly.E && ly.F && ly.A, 'lyrics with [chords] put each chord on its syllable — even mid-word (ხმლი[F]სასა)', ly);
  // kept on the device at once; saving with no server says so and loses nothing
  await p.waitForTimeout(600);
  ok(await p.evaluate(() => !!PD.store.get('le.wip.sb-suliko', null)), 'every change is kept on this device (survives a reload)');
  await p.click('.le-top button[data-t="le.save"]'); await p.waitForTimeout(500);
  const toast = await p.evaluate(() => (document.getElementById('toast') || {}).textContent || '');
  ok(/სერვერ|ცხრილი|server/i.test(toast) && await p.evaluate(() => PD.lessonEditor.state.dirty), 'Save Draft without the server: says so, changes stay', toast);
  // preview: the owner hears his draft in the real lesson before publishing
  await p.click('.le-top button[data-t="le.preview"]'); await p.waitForTimeout(800);
  const pv = await p.evaluate(() => ({ from: PD.musicLib.data('sb-suliko')._from, rh: PD.musicLib.data('sb-suliko').rhythm[0].id, l: PD.lessons.get('sb-suliko').songRhythm, page: document.documentElement.dataset.route }));
  ok(pv.from === 'preview' && pv.rh === 'tushuri' && pv.l === 'tushuri' && pv.page === 'lesson', 'Preview: the lesson plays the draft (owner only)', pv);
  // a learner on the same device never sees the owner's preview
  await p.evaluate(() => { Object.defineProperty(PD.cloud, 'isOwner', { get: () => false, configurable: true }); PD.lessons.reload(); });
  ok(await p.evaluate(() => PD.musicLib.data('sb-suliko')._from !== 'preview'), 'another account never gets the owner\'s preview');
  ok(!p.errors.length, 'no page errors', p.errors.slice(0, 5));

  console.log('\n# phone');
  const m = await page(390, 844);
  await m.evaluate(() => PD.app.go('lesson', 'sb-shen-alazano')); await m.waitForTimeout(900);
  const ov = await m.evaluate(() => ({ w: document.documentElement.scrollWidth, sheet: !!document.querySelector('#page .ml, .ml') }));
  ok(ov.sheet && ov.w <= 392, 'phone: song page fits the width', ov);
  if (SHOTS) await m.screenshot({ path: path.join(SHOTS, 'song-phone.png'), fullPage: false });
  await m.evaluate(() => { Object.defineProperty(PD.cloud, 'isOwner', { get: () => true, configurable: true }); return PD.lessonEditor.open('sb-shen-alazano', 'notes'); }); await m.waitForSelector('.le canvas'); await m.waitForTimeout(700);
  const mv = await m.evaluate(() => ({ w: document.documentElement.scrollWidth, cw: document.querySelector('.le canvas').clientWidth, insp: document.querySelector('.le-insp').getBoundingClientRect().height }));
  ok(mv.w <= 392 && mv.cw > 300 && mv.insp > 100, 'phone: the editor fits, timeline and inspector both visible', mv);
  if (SHOTS) await m.screenshot({ path: path.join(SHOTS, 'editor-phone.png') });
  ok(!m.errors.length, 'no page errors on the phone', m.errors.slice(0, 5));

  await b.close(); srv.close();
  console.log('\n' + passes + ' passed, ' + fails + ' failed');
  process.exit(fails ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
