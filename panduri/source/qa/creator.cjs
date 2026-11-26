/* PANDURI Creator end to end, in Chromium on the built app — the owner's acceptance scenario:
   sign in as the owner → open Creator → upload music (a mix + a lead track, generated here with known beats, chords
   and notes) → choose the type → AI Studio analyses the real upload → chords, notes, strokes and tempo on the timeline →
   move a chord to an exact time → set the BPM of a part → move one beat marker → change a stroke → change a note's
   string and fret → save → reload the app (kept) → preview as a learner → publish to two sections → an ordinary learner
   sees the lesson but no Creator and the server refuses him.
   node qa/creator.cjs        (needs dist/app: python3 build.py; serves the worktree so Studio's models load from panduri/ai)
   The server is a stand-in in the page that answers like the SQL functions (their real rules are tested in
   backend/song-lessons-sql.test.mjs). Requests to Supabase are refused, so nothing reaches production. */
const path = require('path'), fs = require('fs'), http = require('http'), vm = require('vm');
const { chromium } = require(path.join(__dirname, '..', 'node_modules', 'playwright'));
const ROOT = path.join(__dirname, '..', '..', '..'), APPU = '/panduri/source/dist/app/';
const T = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml', '.mp3': 'audio/mpeg', '.wasm': 'application/wasm', '.mjs': 'text/javascript', '.onnx': 'application/octet-stream', '.webmanifest': 'application/manifest+json', '.woff2': 'font/woff2' };
const srv = http.createServer((q, r) => {
  const u = decodeURIComponent(q.url.split('?')[0]), f = path.join(ROOT, u.endsWith('/') ? u + 'index.html' : u);
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); return r.end(); }
  r.writeHead(200, { 'Content-Type': T[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r);
});
let fails = 0, passes = 0;
const ok = (c, m, extra) => { if (c) { passes++; console.log('  ✓ ' + m); } else { fails++; console.log('  ✗ ' + m + (extra !== undefined ? ' — ' + JSON.stringify(extra).slice(0, 500) : '')); } };

/* ---------- the test music: 90 BPM, then 130 BPM; Am F C G; a lead melody (one note above the panduri's range) ---------- */
const ctx = { PD: {}, Math, Float32Array, Float64Array, Int8Array, Int16Array, Int32Array, Uint8Array, Uint32Array, DataView, ArrayBuffer, Buffer, String, Array, Object, Number, Set, Map, JSON, Error, console };
vm.createContext(ctx); vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'src', 'crdsp.js'), 'utf8'), ctx); const X = ctx.PD.crdsp;
const SR = 44100, DUR = 40, beats = []; { let t = .3; while (t < DUR - .4) { beats.push(+t.toFixed(4)); t += t < 20 ? 60 / 90 : 60 / 130; } }
const CH = [['Am', [45, 57, 60, 64]], ['F', [41, 53, 57, 60]], ['C', [48, 55, 60, 64]], ['G', [43, 55, 59, 62]]];
const chordAt = i => CH[Math.floor(i / 4) % 4];
const mix = new Float32Array(SR * DUR), lead = new Float32Array(SR * DUR), truthNotes = [];
const tone = (buf, t0, m, d, amp, harm) => { const f = 440 * Math.pow(2, (m - 69) / 12), s0 = Math.round(t0 * SR), n = Math.round(d * SR); for (let j = 0; j < n && s0 + j < buf.length; j++) { const e = Math.min(1, j / 80) * Math.exp(-j / (SR * (harm ? .35 : .9))); let v = 0; for (let k = 1; k <= (harm ? 5 : 3); k++) v += Math.sin(2 * Math.PI * f * k * j / SR) / (k * k); buf[s0 + j] += amp * e * v; } };
beats.forEach((b, i) => { const [, ns] = chordAt(i), ibi = (beats[i + 1] || b + .46) - b; tone(mix, b, ns[0], ibi * .95, .32, true); ns.slice(1).forEach((m, k) => tone(mix, b + k * .012, m, ibi * .9, .22, true)); ns.slice(1).forEach((m, k) => tone(mix, b + ibi / 2 + k * .01, m, ibi * .45, .09, true)); });
const MEL = [76, 74, 72, 71, 69, 72, 76, 79, 81, 79, 76, 74, 72, 74, 76, 84];   // E5 … A5 … and C6 (out of the panduri's range)
beats.forEach((b, i) => { if (i % 2) return; const m = MEL[(i / 2) % MEL.length], ibi = (beats[i + 1] || b + .46) - b, d = ibi * 1.7; tone(lead, b, m, d, .4, false); truthNotes.push({ t: b, m }); });
for (let i = 0; i < mix.length; i++) mix[i] = Math.max(-1, Math.min(1, mix[i] + lead[i] * .5));
const wavMix = Buffer.from(X.wav([mix], SR)), wavLead = Buffer.from(X.wav([lead], SR));

/* ---------- the stand-in server (owner-only, as the SQL functions) ---------- */
function fakeServer() {
  const K = 'qa.fake', st = () => JSON.parse(localStorage.getItem(K) || '{"d":{},"l":{},"v":[],"files":[]}'), put = s => localStorage.setItem(K, JSON.stringify(s));
  const deny = () => { const e = new Error('not-allowed'); e.code = '42501'; throw e; };
  const strip = d => { const o = JSON.parse(JSON.stringify(d)); ['analysis', 'review', 'assets', 'edited', 'wip', 'private'].forEach(k => delete o[k]); return o; };
  window.__calls = [];
  const db = {
    async rpc(fn, a) {
      window.__calls.push(fn); if (!PD.cloud.isOwner) deny(); const s = st(), id = a.p_id;
      if (fn === 'creator_create') { if (s.d[id]) throw new Error('exists'); s.d[id] = { id, draft: a.p_draft, status: 'not-analyzed', rev: 1, creator: true, title: a.p_draft.title.ka, kind: a.p_draft.creator.type, updated_at: new Date().toISOString() }; s.l[id] = { id }; s.v.push({ lesson_id: id, rev: 1, kind: 'create' }); put(s); return 1; }
      if (fn === 'song_lesson_save' || fn === 'song_lesson_autosave') { const d = s.d[id]; if (d && a.p_base_rev != null && a.p_base_rev !== d.rev) { const e = new Error('conflict'); e.code = '40001'; throw e; }
        const rev = (d ? d.rev : 0) + 1; s.d[id] = Object.assign(d || { id, creator: /^cr-/.test(id) }, { draft: a.p_draft, rev, status: a.p_status || 'manually-edited', title: a.p_draft.title && a.p_draft.title.ka, updated_at: new Date().toISOString() }); s.l[id] = s.l[id] || { id }; if (fn === 'song_lesson_save') s.v.push({ lesson_id: id, rev, kind: 'draft' }); put(s); return rev; }
      if (fn === 'song_lesson_publish') { const d = s.d[id]; s.l[id] = Object.assign(s.l[id] || { id }, { published: strip(d.draft), published_rev: d.rev, categories: a.p_categories || d.draft.creator.categories }); d.status = 'published'; s.v.push({ lesson_id: id, rev: d.rev, kind: 'publish' }); put(s); return d.rev; }
      if (fn === 'song_lesson_unpublish') { s.l[id].published = null; put(s); return null; }
      if (fn === 'song_lesson_set_status') { if (s.d[id]) s.d[id].status = a.p_status; put(s); return null; }
      if (fn === 'song_lesson_set_audio') { s.l[id] = Object.assign(s.l[id] || { id }, { audio_path: a.p_path }); put(s); return null; }
      if (fn === 'song_lesson_delete') { if (s.l[id] && s.l[id].published) throw new Error('published'); delete s.l[id]; delete s.d[id]; put(s); return null; }
      return null;
    },
    async select(table, q) {
      const s = st(), owner = PD.cloud.isOwner, eq = (k, v) => !q[k] || String(q[k]) === 'eq.' + v;
      if (table === 'song_lesson_drafts') return owner ? Object.values(s.d).filter(d => eq('id', d.id) && (!q.creator || d.creator)).map(d => Object.assign({ verified_rev: null }, d)) : [];
      if (table === 'song_lessons') return Object.values(s.l).filter(l => l.published && eq('id', l.id) && (!/^like/.test(q.id || '') || /^cr-/.test(l.id))).map(l => ({ id: l.id, published: l.published, published_rev: l.published_rev, verified: false, audio_path: l.audio_path || null, categories: l.categories }));
      if (table === 'song_lesson_versions') return owner ? s.v.filter(v => eq('lesson_id', v.lesson_id)).map((v, i) => Object.assign({ id: i + 1, created_at: new Date().toISOString() }, v)) : [];
      return [];
    },
    insert: async () => null, update: async () => null, upsert: async () => null, remove: async () => null
  };
  const mem = window.__files = window.__files || {};
  const storage = { async upload(p, b, prog, bucket) { if (!PD.cloud.isOwner) deny(); mem[bucket + ':' + p] = b; const s = st(); s.files.push(bucket + ':' + p); put(s); if (prog) prog(1); return p; },
    async urls(ps, bucket) { const o = {}; ps.forEach(p => { if (mem[bucket + ':' + p]) o[p] = URL.createObjectURL(mem[bucket + ':' + p]); }); return o; },
    async read(p, bucket) { if (!mem[bucket + ':' + p]) throw new Error('http-404'); return mem[bucket + ':' + p]; },
    async remove() { return null; }, async copy() { return null; }, url: () => null };
  PD.cloud.db = db; PD.cloud.storage = storage;
  Object.defineProperty(PD.cloud, 'configured', { get: () => true, configurable: true });
  Object.defineProperty(PD.cloud, 'user', { get: () => ({ id: window.__owner === false ? 'learner' : 'owner-id' }), configurable: true });
  Object.defineProperty(PD.cloud, 'isOwner', { get: () => window.__owner !== false, configurable: true });
}

(async () => {
  await new Promise(r => srv.listen(0, '127.0.0.1', r)); const base = 'http://127.0.0.1:' + srv.address().port + APPU;
  const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const ctxB = await b.newContext({ viewport: { width: 1440, height: 900 }, serviceWorkers: 'block' });
  await ctxB.route(/supabase\.co/, r => r.abort());
  const p = await ctxB.newPage(); p.errors = [];
  p.on('pageerror', e => { p.errors.push(e.message); console.log('    page error: ' + e.message); }); p.on('console', m => { if (m.type() === 'error' && !/Failed to load resource|net::ERR|favicon/.test(m.text())) p.errors.push(m.text()); });
  await p.addInitScript(() => { for (const [k, v] of [['lang', 'ka'], ['language.chosen', true], ['onboarded', true], ['intro.done', true], ['first.done', true]]) localStorage.setItem('pd2:' + k, JSON.stringify(v)); });
  async function load() {
    await p.goto(base + 'index.html', { waitUntil: 'commit' }).catch(() => p.goto(base + 'index.html', { waitUntil: 'commit' })); await p.waitForFunction(() => window.PD && PD.musicLib && PD.musicLib.loaded && PD.creator, null, { timeout: 30000 });
    await p.waitForTimeout(300); await p.evaluate(fakeServer); await p.evaluate(() => { document.querySelectorAll('.ag, .ob, .ob-back').forEach(x => x.remove()); return PD.musicLib.loadPublished().then(() => PD.lessons.reload()); });
  }
  await load();
  const before = await p.evaluate(() => ({ ml: PD.lessons.all.filter(l => l.musiclib).length, bani: !!PD.lessons.get('bani-acharuli') || PD.lessons.all.some(l => l.song === 'bani-acharuli') }));

  console.log('\n# 1–2. the owner opens PANDURI Creator');
  await p.evaluate(() => PD.app.go('profile')); await p.waitForTimeout(400);
  ok(await p.evaluate(() => document.body.innerText.includes('PANDURI Creator')), 'the owner\'s profile has the PANDURI Creator menu');
  await p.evaluate(() => PD.app.go('creator')); await p.waitForSelector('.cr-grid');
  const cards = await p.$$eval('.cr-card b', bs => bs.map(x => x.getAttribute('data-t')));
  ok(cards.length === 9 && ['cr.m.new', 'cr.m.projects', 'cr.m.published', 'cr.m.drafts', 'cr.m.analysis', 'cr.m.chords', 'cr.m.melody', 'cr.m.rhythm', 'cr.m.tempo'].every(k => cards.includes(k)), 'its menu: the nine entries', cards);

  console.log('\n# 3–4. upload (drag & drop / choose), two files, the type, the details');
  await p.evaluate(() => PD.app.go('creator', 'new')); await p.waitForSelector('.cr-drop');
  await p.setInputFiles('.cr input[type=file][multiple]', [{ name: 'test-mix.wav', mimeType: 'audio/wav', buffer: wavMix }, { name: 'lead.wav', mimeType: 'audio/wav', buffer: wavLead }]);
  await p.waitForSelector('.cr-file >> nth=1');
  await p.selectOption('.cr-file >> nth=1 >> select', 'lead');
  const ins = await p.$$('.cr-form input.input'); await ins[0].fill('სატესტო მელოდია'); await ins[1].fill('Test melody'); await ins[2].fill('QA');
  await p.click('.cr-type >> nth=3');
  await p.click('[data-t="cr.create"]');
  await p.waitForSelector('.le canvas', { timeout: 60000 });
  const pid = await p.evaluate(() => PD.lessonEditor.state.id);
  ok(/^cr-/.test(pid), 'the project exists (' + pid + ') and its timeline is open');
  const created = await p.evaluate(id => { const s = JSON.parse(localStorage.getItem('qa.fake')); const d = s.d[id]; return d && { status: d.status, assets: d.draft.assets.map(a => [a.role, !!a.main, !!a.path, !!a.peaks]), type: d.draft.creator.type }; }, pid);
  ok(created && created.type === 'full' && created.assets.length === 2 && created.assets[0][1] && created.assets.every(a => a[2] && a[3]), 'saved on the server: two files uploaded to the private bucket, waveform data kept, type “full lesson”', created);

  console.log('\n# 5–6. AI Studio analyses the real upload (auto: Full Analysis)');
  await p.waitForSelector('[data-t="cr.applyRes"]', { timeout: 300000 });
  const log = await p.$$eval('.cr-log div, .cr-log p', ds => ds.map(d => d.textContent));
  await p.click('[data-t="cr.applyRes"]'); await p.waitForTimeout(800);
  const A = await p.evaluate(() => { const D = PD.lessonEditor.state.D; return { beats: D.beats, chords: D.chords, notes: D.notes, strokes: (D.strokes || []).length, tp: D.tempoPts, key: D.key, meter: D.meter, review: (D.review || []).length, methods: D.analysis && D.analysis.methods, fail: D.analysis && D.analysis.fail, out: PD.musicLib.tab(D).notes.filter(x => x && x.out).length, sec: D.sections.length }; });
  console.log('    log: ' + log.slice(-6).join(' | '));
  ok(X.beatF(A.beats, beats) >= .85, 'beats from the upload follow 90 → 130 BPM: F = ' + X.beatF(A.beats, beats).toFixed(3));
  const bpmNear = t => { const q = X.bpmAt(A.tp, t); return q; };
  ok(A.tp && A.tp.length >= 2 && Math.abs(bpmNear(10) - 90) < 6 && Math.abs(bpmNear(32) - 130) < 8, 'the tempo map has points: ' + (A.tp || []).map(q => q.t.toFixed(1) + 's ' + q.bpm).join(' · '));
  let cOk = 0, cN = 0; beats.forEach((bt, i) => { if (i + 1 >= beats.length) return; const x = bt + .1, c = A.chords.filter(c2 => c2.t <= x + 1e-3).pop(); cN++; if (c && c.chord === chordAt(i)[0]) cOk++; });
  ok(cOk / cN >= .7, 'chords: ' + Math.round(cOk / cN * 100) + '% of the beats carry the chord that sounds (Am F C G)', A.chords.slice(0, 8));
  let nOk = 0; truthNotes.forEach(tn => { if (A.notes.some(n => Math.abs(n[0] - tn.t) < .09 && n[2] === tn.m)) nOk++; });
  ok(nOk / truthNotes.length >= .7, 'melody from the lead track: ' + nOk + ' / ' + truthNotes.length + ' notes found at their time and pitch');
  ok(A.notes.filter(n => n[3]).every(n => Math.round(57 + [0, 4, 7][n[3] - 1] + n[4]) === n[2]), 'every tab entry is a real string + fret for its pitch (A3 · C♯4 · E4)');
  ok(A.out >= 1, 'the note above the panduri\'s range (C6) is reported, not moved silently (' + A.out + ')');
  ok(A.strokes > beats.length, A.strokes + ' strokes on the timeline (direction suggested, marked for review)');
  ok(A.review > 0 && A.methods && A.methods.tempo && A.methods.chords && A.methods.melody, A.review + ' places marked for review, in the editor only; each result names its method');
  ok(A.sec >= 2, 'phrases suggested as parts: ' + A.sec);
  const vis = await p.evaluate(() => /AI-მ ამოიცნო|შეამოწმე ყურით|AI estimate|check it by ear/i.test(document.body.innerText));
  ok(!vis, 'no “AI recognised… check by ear” text anywhere');

  console.log('\n# 7–11. the owner corrects it on the timeline');
  const G = async () => p.evaluate(() => { const S = PD.lessonEditor.state, r = S.cv.getBoundingClientRect(), L = {}; PD.lessonEditor.geom.lanes().forEach(l => { L[l.k] = l; }); return { L, left: r.left, top: r.top, head: S.head, x0: S.x0, zoom: S.zoom }; });
  const px = (g, t) => g.left + g.head + (t - g.x0) * g.zoom;
  await p.evaluate(() => { const S = PD.lessonEditor.state; S.x0 = 0; S.zoom = (S.cv.clientWidth - S.head) / 14; S.follow = false; PD.lessonEditor.state.audio.currentTime = 0; });
  await p.waitForTimeout(100);
  let g = await G();
  // 7: a chord to an exact time (ms field)
  const c1 = await p.evaluate(() => { const D = PD.lessonEditor.state.D; const k = D.chords.findIndex(c => c.t > 2 && c.t < 6); return { k, t: D.chords[k] && D.chords[k].t }; });
  await p.mouse.click(px(g, c1.t + .3), g.top + g.L.chords.y + g.L.chords.h / 2); await p.waitForTimeout(150);
  const startIn = p.locator('.le-insp .le-2 input').first(); await startIn.fill('3.456'); await startIn.dispatchEvent('change'); await p.waitForTimeout(150);
  ok(await p.evaluate(k => PD.lessonEditor.state.D.chords[k].t === 3.456, c1.k), 'a chord moved to 00:03.456 exactly (inspector, ms)');
  // insert at the playhead and rename
  await p.evaluate(() => { PD.lessonEditor.state.sel = null; PD.lessonEditor.state.audio.currentTime = 5.05; }); await p.waitForTimeout(80);
  await p.evaluate(() => { PD.lessonEditor.state.snap = 'off'; PD.lessonEditor.state.audio.currentTime = 5.05; }); await p.keyboard.press('i'); await p.waitForTimeout(100);
  ok(await p.evaluate(() => PD.lessonEditor.state.D.chords.some(c => Math.abs(c.t - 5.05) < .002)), 'Insert Chord at Playhead (I) at 00:05.050');
  // 8: a tempo point with its own BPM, the beats after it follow
  g = await G();
  await p.evaluate(() => { const S = PD.lessonEditor.state; S.x0 = 20; S.sel = null; }); g = await G();
  await p.mouse.dblclick(px(g, 25), g.top + g.L.tempo.y + g.L.tempo.h / 2); await p.waitForTimeout(200);
  const tpSel = await p.evaluate(() => PD.lessonEditor.state.sel); ok(tpSel && tpSel.k === 'tpts', 'a tempo point added at 00:25 (double-click on the tempo track)', tpSel);
  const bpmIn = p.locator('.le-insp .le-2 input').nth(1); await bpmIn.fill('126'); await bpmIn.dispatchEvent('change'); await p.waitForTimeout(100);
  await p.click('.le-insp [data-t="le.tpApply"]'); await p.waitForTimeout(150);
  const after = await p.evaluate(() => { const B = PD.lessonEditor.state.D.beats, i = B.findIndex(b => b > 26); return 60 / (B[i + 1] - B[i]); });
  ok(Math.abs(after - 126) < 1.5, 'the beats after it follow 126 BPM (' + after.toFixed(1) + '); the recording is untouched');
  // 9: one beat marker moved by hand (+30 ms)
  g = await G();
  const bi = await p.evaluate(() => PD.lessonEditor.state.D.beats.findIndex(b => b > 22));
  const b0 = await p.evaluate(i => PD.lessonEditor.state.D.beats[i], bi), y9 = g.top + g.L.beats.y + g.L.beats.h / 2;
  await p.mouse.move(px(g, b0), y9); await p.mouse.down(); await p.mouse.move(px(g, b0) + 10, y9, { steps: 3 }); await p.mouse.move(px(g, b0 + .03), y9, { steps: 3 }); await p.mouse.up(); await p.waitForTimeout(150);
  const b1 = await p.evaluate(i => PD.lessonEditor.state.D.beats[i], bi);
  ok(Math.abs(b1 - b0 - .03) < .012, 'a beat marker dragged by hand: ' + b0.toFixed(3) + ' → ' + b1.toFixed(3));
  await p.click('.le-tr .le-ib[title="' + (await p.evaluate(() => PD.i18n.t('le.metro'))) + '"]'); await p.evaluate(() => { PD.lessonEditor.state.audio.currentTime = 19; return PD.lessonEditor.state.audio.play().catch(() => {}); }); await p.waitForTimeout(1500);
  const met = await p.evaluate(() => { const S = PD.lessonEditor.state; const on = S.met.on; S.audio.pause(); return on; }); ok(met, 'the metronome runs on the beat map while it plays');
  // 10: a stroke made an accented up-stroke
  g = await G();
  const sj = await p.evaluate(() => { const S = PD.lessonEditor.state; return S.D.strokes.findIndex(s => s.t > 21 && s.t < 30); }), st0 = await p.evaluate(j => PD.lessonEditor.state.D.strokes[j].t, sj);
  await p.mouse.click(px(g, st0), g.top + g.L.rhythm.y + g.L.rhythm.h - 11); await p.waitForTimeout(150);
  const selS = await p.evaluate(() => PD.lessonEditor.state.sel); ok(selS && selS.k === 'strokes', 'a single stroke selected on the rhythm track', selS);
  await p.selectOption('.le-insp select >> nth=0', 'U'); await p.waitForTimeout(100);
  ok(await p.evaluate(j => PD.lessonEditor.state.D.strokes[j].k === 'U' && !PD.lessonEditor.state.D.strokes[j].sug, sj), 'it is now an accented up-stroke (↑>), no longer “suggested”');
  // live rhythm recording: D while it plays
  await p.click('.le-tr .le-ib.rec >> nth=1'); await p.evaluate(() => { PD.lessonEditor.state.audio.currentTime = 33; return PD.lessonEditor.state.audio.play(); }); await p.waitForTimeout(300);
  for (const k of ['d', 'u', 'D', 'u']) { await p.keyboard.press(k === 'D' ? 'Shift+D' : k); await p.waitForTimeout(160); }
  await p.evaluate(() => PD.lessonEditor.state.audio.pause()); await p.waitForTimeout(200);
  const rec = await p.evaluate(() => PD.lessonEditor.state.D.strokes.filter(s => s.t > 33 && s.t < 35).map(s => s.k).join(''));
  ok(/duDu/.test(rec), 'live rhythm recording: D · U · Shift+D · U were written at the playing time (' + rec + ')');
  await p.click('.le-tr .le-ib.rec >> nth=1');
  // 11: a note to another string and fret, on the neck
  await p.evaluate(() => { const S = PD.lessonEditor.state, i = S.D.notes.findIndex(n => n[3] && n[0] > 1); S.sel = { k: 'notes', i: [i] }; S.x0 = Math.max(0, S.D.notes[i][0] - 1); window.__ni = i; });
  await p.click('.le-tr .le-ib[aria-label="' + (await p.evaluate(() => PD.i18n.t('le.fb'))) + '"]'); await p.waitForTimeout(150);
  await p.click('.le-fb rect[data-s="2"][data-f="5"]', { force: true }); await p.waitForTimeout(150);
  ok(await p.evaluate(() => { const n = PD.lessonEditor.state.D.notes[window.__ni]; return n[3] === 2 && n[4] === 5 && n[2] === 66; }), 'a note set to string C♯, fret 5 (= F♯4) on the interactive neck; piano roll, tab and lesson follow it');
  const edits = await p.evaluate(() => { const D = PD.lessonEditor.state.D; return Object.keys(D.edited || {}); });
  ok(['chords', 'beats', 'tempoPts', 'strokes', 'notes'].every(k => edits.includes(k)), 'what was edited by hand is remembered (a later analysis will not replace it unasked)', edits);

  console.log('\n# 12–13. save, close the app, open it again');
  await p.click('.le-top [data-t="le.save"]'); await p.waitForTimeout(400);
  const saved = await p.evaluate(id => JSON.parse(localStorage.getItem('qa.fake')).d[id].rev, pid); ok(saved >= 2, 'saved (revision ' + saved + ')');
  await p.evaluate(() => PD.lessonEditor.close());
  await load();
  await p.evaluate(id => PD.app.go('creator', 'p:' + id), pid); await p.waitForSelector('.cr-hero h1');
  await p.click('.cr [data-t="le.title"]'); await p.waitForSelector('.le canvas'); await p.waitForTimeout(500);
  const kept = await p.evaluate(ni => { const D = PD.lessonEditor.state.D; const B = D.beats, i = B.findIndex(b => b > 26); return { chord: D.chords.some(c => c.t === 3.456), ins: D.chords.some(c => Math.abs(c.t - 5.05) < .002), bpm: 60 / (B[i + 1] - B[i]), stroke: D.strokes.some(s => s.k === 'U'), note: D.notes.some(n => n[3] === 2 && n[4] === 5 && n[2] === 66), audio: !PD.lessonEditor.state.noAudio, tracks: PD.lessonEditor.geom.lanes().map(l => l.k).length }; }, 0);
  ok(kept.chord && kept.ins && Math.abs(kept.bpm - 126) < 1.5 && kept.stroke && kept.note, 'after a reload every correction is there', kept);
  ok(kept.audio && kept.tracks >= 11, 'the recording plays again and every track is there (' + kept.tracks + ' tracks incl. the lead)');

  console.log('\n# 14. Preview as Student');
  await p.click('.le-top [data-t="le.preview"]'); await p.waitForTimeout(900);
  const pv = await p.evaluate(id => ({ route: location.hash, banner: !!document.querySelector('[data-t="mlx.student"]'), admin: !!document.querySelector('.ml-adm'), l: (l => l && { ev: l.events.length, stages: l.stages, type: l.type })(PD.lessons.get(id)), steps: document.querySelectorAll('.step').length }), pid);
  ok(pv.banner && !pv.admin && pv.l && pv.l.ev > 10 && pv.steps >= 5, 'the lesson as a learner sees it: no owner bar, its stages and events', pv);
  ok(pv.l && pv.l.stages.includes('guided') && pv.l.stages.includes('perform') && pv.l.stages.includes('chords'), 'the lesson builder\'s stages: chords · note by note · … · final check', pv.l && pv.l.stages);

  console.log('\n# 15. publish into two sections');
  await p.evaluate(id => PD.lessonEditor.open(id, 'chords'), pid); await p.waitForSelector('.le canvas');
  await p.click('.le-top [data-t="le.publish"]'); await p.waitForSelector('[data-t="cr.cat.solos"]');
  const sheet = p.locator('.sheet, [role=dialog]').last();
  await p.evaluate(() => { const lab = [...document.querySelectorAll('.cr-res')].find(l => l.querySelector('[data-t="cr.cat.solos"]')); lab.querySelector('input').click(); }); void sheet;
  await p.evaluate(() => [...document.querySelectorAll('button[data-t="cr.pub"]')].pop().click()); await p.waitForTimeout(900);
  const pub = await p.evaluate(id => JSON.parse(localStorage.getItem('qa.fake')).l[id], pid);
  ok(pub && pub.published && pub.categories.join() === 'songs,melodies,solos', 'published to Songs · Melodies · Solos from one draft', pub && pub.categories);
  ok(pub && pub.published && !pub.published.assets && !pub.published.analysis && !pub.published.review, 'what learners get has no uploads, no raw analysis, no review notes');
  await p.evaluate(() => PD.lessonEditor.close());

  console.log('\n# 16. an ordinary learner');
  await p.evaluate(() => { window.__owner = false; PD.store.del('ml.preview'); PD.store.del('ml.student'); return PD.musicLib.loadPublished().then(() => PD.lessons.reload()); });
  const L = await p.evaluate(id => { const l = PD.lessons.get(id); return l && { cats: l.cats, ev: l.events.length, title: PD.i18n.pick(l.title) }; }, pid);
  ok(L && L.ev > 10 && L.cats.join() === 'song,melody,solo', 'the learner has the published lesson, listed in three sections (one lesson, not three copies)', L);
  await p.evaluate(() => PD.app.go('songs')); await p.waitForTimeout(500);
  const shelves = await p.evaluate(t => document.body.innerText.includes(t), L && L.title); ok(shelves, 'it is on the songs page');
  await p.evaluate(() => PD.app.go('profile')); await p.waitForTimeout(400);
  ok(!(await p.evaluate(() => document.body.innerText.includes('PANDURI Creator'))), 'no Creator menu for him');
  await p.evaluate(() => PD.app.go('creator')); await p.waitForTimeout(300);
  ok(await p.evaluate(() => !!document.querySelector('[data-t="cr.only"]') && !document.querySelector('.cr-grid')), 'the Creator address shows only “for the owner” — nothing is loaded');
  const deny = await p.evaluate(async id => { const out = []; for (const fn of ['song_lesson_save', 'song_lesson_publish', 'creator_create', 'song_lesson_delete']) { try { await PD.cloud.db.rpc(fn, { p_id: id, p_draft: {} }); out.push(fn + ':sent'); } catch (e) { out.push(e.code || e.message); } } return out; }, pid);
  ok(deny.every(x => x === '42501'), 'his direct requests are refused (not-allowed)', deny);
  ok(!(await p.evaluate(() => PD.lessonEditor.open('sb-suliko', 'chords').then(() => !!document.querySelector('.le')))), 'and the editor does not open for him');

  console.log('\n# the rest of the app');
  const aft = await p.evaluate(() => ({ ml: PD.lessons.all.filter(l => l.musiclib && !l.creator).length, bani: !!PD.lessons.get('bani-acharuli') || PD.lessons.all.some(l => l.song === 'bani-acharuli') }));
  ok(aft.ml === before.ml && aft.bani === before.bani, 'the 19 MUSIC lessons and Bani-Acharuli are unchanged (' + aft.ml + ')', [before, aft]);
  ok(!p.errors.length, 'no errors on the page', p.errors.slice(0, 6));
  await b.close(); srv.close();
  console.log('\n' + passes + ' passed, ' + fails + ' failed'); process.exit(fails ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
