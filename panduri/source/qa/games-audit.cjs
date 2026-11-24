// Games: the verification matrix. Every game is played through the virtual fanduri (qa/vpanduri.cjs — the teacher's
// recorded notes into the real detector) and each step a learner takes is checked: the page opens, Start, the count-down,
// the microphone, the game reacting to sound, score, combo, pause, resume, restart, the end, the results, the saved
// progress and the next level opening.
//   node qa/games-audit.cjs            (APP_DIR=dist/app; ONLY=rush,rhythm to run some; JSON=file to keep the matrix)
// Verified = seen working here · Partial = works with a stated gap · Broken = failed · Untested · Blocked (hardware / server)
const path = require('path'), fs = require('fs');
const { chromium } = require('playwright');
const VP = require('./vpanduri.cjs');
const DIR = path.resolve(process.env.APP_DIR || path.join(__dirname, '../dist/app')), ONLY = (process.env.ONLY || '').split(',').filter(Boolean);
const COLS = ['opens', 'start', 'countdown', 'mic', 'reacts', 'score', 'combo', 'pause', 'resume', 'restart', 'completes', 'results', 'progress', 'unlock'];

/* ---------- the virtual player, in the page: plays what each game asks for ---------- */
function bots() {
  const VP = window.__vp, cur = () => PD.games.current;
  VP.stop = () => { VP._id = (VP._id || 0) + 1; };
  const loop = (fn) => { const id = VP._id = (VP._id || 0) + 1; const st = { mode: null, done: new Set(), n: 0 }; const tick = () => { if (VP._id !== id) return; const c = cur(), S = c && c.S; if (S && S.alive && S.state === 'playing' && S.mode && S.mode.qa) { if (S.mode !== st.mode) { st.mode = S.mode; st.done = new Set(); st.n = 0; st.t = 0; st.wrongDone = false; st.oct = false; st.i = undefined; } try { fn(S, S.mode.qa(), st); } catch (e) { VP.err = String(e); } } setTimeout(tick, 25); }; tick(); };
  const at0 = (S, t) => S.clock.audio(t) + S.lag + S.off;
  /** a timeline of notes / strokes: each played once, on time (o.skip: indices left out, o.wrong: {i: semitones}, o.offMs: {i: ms}) */
  VP.botTimeline = (o) => loop((S, q, st) => {
    const now = S.now(), items = q.chart || q.steps;
    for (let i = 0; i < items.length; i++) {
      const n = items[i]; if (st.done.has(i)) continue;
      const at = at0(S, n.t) + (((o.offMs || {})[i]) || 0) / 1000; if (at > now + .25) break;
      st.done.add(i); if (at < now - .005 || (o.skip || []).includes(i)) continue;
      if (n.kind === 'strum' || (n.acc !== undefined && n.midi == null && !n.notes)) {
        if (n.notes) { const fr = [null, null, null]; n.notes.forEach(x => { fr[x.s - 1] = x.f; }); VP.strum(fr, n.dir, at, n.acc ? .8 : .45); }
        else if (n.chord && q.shapes) VP.strum(q.shapes[n.chord].frets, n.dir, at, n.acc ? .8 : .4);
        else VP.chordRec(i, at, n.acc ? 1 : .32);
      } else { const w = (o.wrong || {})[i] || 0; VP.note(n.s, n.f + w, at, .55); }
    }
  });
  /** Melody Memory: listens, then plays the melody back (o.mistake: a wrong note first in round 0) */
  VP.botMemory = (o) => loop((S, q, st) => {
    if (q.phase !== 'play' || q.idx >= q.mel.length) return; const now = performance.now(); if (now < (st.t || 0)) return;
    const n = q.mel[q.idx], wrong = o.mistake && q.round === 0 && q.idx === 1 && !st.wrongDone;
    if (wrong) { st.wrongDone = true; VP.note(n.s, n.f + 1, S.now() + .05, .55); st.t = now + 700; return; }
    VP.note(n.s, n.f, S.now() + .05, .55); st.t = now + 650;
  });
  /** Fret Hunter: finds the note after a moment (o.octaveFirst: the right note an octave off first) */
  VP.botHunt = (o) => loop((S, q, st) => {
    if (!q.target || q.busy) return; const now = performance.now();
    if (st.i !== q.i) { st.i = q.i; st.t = now + 700; st.oct = false; return; }
    if (now < st.t) return;
    const pos = PD.theory.positions(q.target.midi).sort((a, b) => a.f - b.f)[0];
    if (o.octaveFirst && q.i === 1 && !st.oct) { st.oct = true; const by = m => PD.theory.positions(m).filter(x => x.f <= 17).sort((a, b) => a.f - b.f)[0], lo = by(q.target.midi + 12) || by(q.target.midi - 12); if (lo) { st.octPlayed = (st.octPlayed || 0) + 1; VP.note(lo.s, lo.f, S.now() + .05, .55); st.t = now + 900; return; } }
    VP.note(pos.s, pos.f, S.now() + .05, .55); st.t = now + 1500;
  });
  /** Chord Master: the chord's tones one by one (notes) or one stroke of the whole chord (strum) */
  VP.botChord = () => loop((S, q, st) => {
    if (!q.cur || q.busy) return; const now = performance.now(); if (now < (st.t || 0)) return;
    if (q.strum) { VP.strum(q.cur.frets, 'down', S.now() + .05, .6); st.t = now + 1400; return; }
    VP.note(q.step + 1, q.cur.frets[q.step], S.now() + .05, .55); st.t = now + 700;
  });
}

async function needSamples(p, g) {
  await p.evaluate(async g => {
    const pos = [];
    if (g === 'rush' || g === 'arena') { const c = PD.games.current; }
    for (let s = 1; s <= 3; s++) for (let f = 0; f <= 17; f++) pos.push({ s, f });
    await __vp.load(pos, PD.SOUNDS.chords.map(x => x.file.replace(/^strings\//, 'strings/')));
  }, g);
}

async function runGame(b, url, g, l, d, opt) {
  opt = opt || {};
  const R = Object.fromEntries(COLS.map(k => [k, ['Untested', '']])), set = (k, s, why) => { R[k] = [s, why || '']; };
  const { ctx, p, errs } = await VP.open(b, url, { lang: 'en' });
  try {
    await p.evaluate(bots);
    // opens
    await p.evaluate(([g, l, d]) => PD.app.go('games', g + ':' + l + ':' + d), [g, l, d]);
    await p.waitForTimeout(700);
    const opened = await p.evaluate(() => !!document.querySelector('#page .gm-go .btn') && !document.querySelector('#page .gm-go .btn').disabled);
    set('opens', opened ? 'Verified' : 'Broken', opened ? 'start page with an enabled Start' : 'no enabled Start button');
    if (!opened) return R;
    // the microphone, and the path's own delay measured the way the app's calibration does
    const lat = await p.evaluate(async () => { PD.audio.ensure(); const r = await PD.gameAudio.acquire(); if (!r.ok) return null; return __vp.calibrate(); });
    set('mic', lat != null ? 'Verified' : 'Broken', lat != null ? 'detector on, a stroke heard (path ' + lat + ' ms, calibrated)' : 'nothing heard');
    await needSamples(p, g);
    if (opt.extra) await p.evaluate(opt.extra);
    // Start → count-down
    await p.click('#page .gm-go .btn');
    // Band Jam with the speaker leaking: the echo check must stop and ask; the run answers as a learner would
    if (opt.onLeak) {
      await p.waitForFunction(() => !!document.querySelector('.gm-panel [data-t="gm.bj.leakPractice"]'), null, { timeout: 40000 }).catch(() => {});
      R.leakPanel = await p.evaluate(() => { const pn = document.querySelector('.gm-panel'); return pn ? pn.innerText.replace(/\s+/g, ' ').slice(0, 240) : null; });
      await p.evaluate(k => { const b = document.querySelector('.gm-panel [data-t="gm.bj.leak' + (k === 'practice' ? 'Practice' : 'Metro') + '"]'); if (b) b.click(); }, opt.onLeak);
    }
    const seen = await p.evaluate(ms => new Promise(res => { const t0 = performance.now(), saw = new Set(); const tk = () => { const c = PD.games.current; if (c) saw.add(c.state); if (c && c.state === 'playing') return res([...saw]); if (performance.now() - t0 > ms) return res([...saw]); setTimeout(tk, 20); }; tk(); }), opt.startMs || 40000);
    set('start', seen.includes('playing') ? 'Verified' : 'Broken', 'states: ' + seen.join(' → '));
    const countIn = await p.evaluate(() => !!(PD.games.current && PD.games.current.S.mode && PD.games.current.S.mode.countIn));
    set('countdown', seen.includes('countdown') && !countIn ? 'Verified' : countIn ? 'Verified' : 'Broken', countIn ? 'its own count-in (clicks + numbers on the track)' : seen.includes('countdown') ? '3 · 2 · 1' : 'no count-down');
    // the player
    await p.evaluate(o => { const k = o.kind; if (k === 'memory') __vp.botMemory(o); else if (k === 'hunt') __vp.botHunt(o); else if (k === 'chord') __vp.botChord(o); else __vp.botTimeline(o); }, Object.assign({ kind: g }, opt.bot || {}));
    await p.waitForTimeout(opt.playMs || 4000);
    // pause: the clock stops
    const before = await p.evaluate(() => PD.games.current.S.sc.s.score);
    await p.click('.gm-hud .gm-ib'); await p.waitForFunction(() => PD.games.current.state === 'paused', null, { timeout: 5000 }).catch(() => {});
    const pz = await p.evaluate(async () => { const S = PD.games.current.S, a = S.clock.at(S.now()); await new Promise(r => setTimeout(r, 700)); return { state: PD.games.current.state, a, b: S.clock.at(S.now()), panel: !!document.querySelector('.gm-panel') }; });
    set('pause', pz.state === 'paused' && Math.abs(pz.b - pz.a) < .01 && pz.panel ? 'Verified' : 'Broken', 'paused at ' + pz.a.toFixed(2) + ' s, still ' + pz.b.toFixed(2) + ' s after 0.7 s');
    // resume: 3 · 2 · 1, then on from the same moment
    await p.click('.gm-panel .btn.primary'); await p.waitForFunction(() => PD.games.current.state === 'playing', null, { timeout: 8000 }).catch(() => {});
    const rs = await p.evaluate(() => { const S = PD.games.current.S; return { state: PD.games.current.state, at: S.clock.at(S.now()) }; });
    set('resume', rs.state === 'playing' && rs.at >= pz.a - .05 && rs.at < pz.a + 1 ? 'Verified' : 'Broken', 'resumed at ' + rs.at.toFixed(2) + ' s (paused at ' + pz.a.toFixed(2) + ')');
    const reacted = await p.evaluate(() => { const s = PD.games.current.S.sc.s; return { score: s.score, hits: s.perfect + s.great + s.good }; });
    // restart: a fresh round on the same stage
    await p.waitForTimeout(800);
    await p.click('.gm-hud .gm-ib'); await p.waitForFunction(() => PD.games.current.state === 'paused', null, { timeout: 5000 }).catch(() => {});
    await p.evaluate(() => { const b = [...document.querySelectorAll('.gm-panel .gm-btns .btn')][0]; b && b.click(); });
    const rr = await p.evaluate(() => new Promise(res => { const t0 = performance.now(); const tk = () => { const c = PD.games.current; if (c && c.state === 'playing') return res({ score: c.S.sc.s.score, at: c.S.clock.at(c.S.now()), ivs: c.S.ivs.size }); if (performance.now() - t0 > 12000) return res(null); setTimeout(tk, 20); }; tk(); }));
    set('restart', rr && rr.score === 0 && rr.at < 1.5 && rr.ivs <= 1 ? 'Verified' : 'Broken', rr ? 'score ' + rr.score + ', song ' + rr.at.toFixed(2) + ' s, schedulers ' + rr.ivs : 'did not restart');
    // the whole round, played (an endless practice is finished from the pause, as a learner would)
    if (opt.finishFromPause) {
      await p.waitForTimeout(opt.finishAfterMs || 9000);
      await p.click('.gm-hud .gm-ib'); await p.waitForFunction(() => PD.games.current.state === 'paused', null, { timeout: 5000 }).catch(() => {});
      R.finishBtn = await p.evaluate(() => { const b = document.querySelector('.gm-panel [data-t="gm.rb.finish"]'); if (b) b.click(); return !!b; });
    }
    const end = await p.evaluate(ms => new Promise(res => { const t0 = performance.now(); const tk = () => { const c = PD.games.current; if (c && (c.state === 'completed' || c.state === 'failed')) return res(c.state); if (performance.now() - t0 > ms) return res(c ? c.state : 'gone'); setTimeout(tk, 100); }; tk(); }), opt.maxMs || 90000);
    await p.evaluate(() => __vp.stop());
    set('completes', end === 'completed' || end === 'failed' ? 'Verified' : 'Broken', 'ended: ' + end);
    await p.waitForTimeout(1200);
    const res = await p.evaluate(([g, l, d]) => {
      const c = PD.games.current, S = c && c.S, s = S ? S.sc.s : {}, panel = document.querySelector('.gm-stage .gm-panel');
      const best = (PD.store.get('games.best', null) || { map: {} }).map, key = g + ':' + l + ':' + d, ses = PD.lessons.progress.sessions().filter(x => String(x.id) === 'game:' + g + ':' + l);
      const hist = (PD.store.get('games.hist', null) || { list: [] }).list.filter(x => x.g === g);
      return { score: s.score, hits: (s.perfect || 0) + (s.great || 0) + (s.good || 0), miss: s.miss, wrong: s.wrong, unsure: s.unsure, maxCombo: s.maxCombo, panel: panel ? panel.innerText.replace(/\s+/g, ' ').slice(0, 220) : null, rec: best[key] || null, ses: ses.length, hist: hist.length, practice: !!(S && S.mode && S.mode.practice) };
    }, [g, l, d]);
    set('reacts', (res.hits > 0 || reacted.hits > 0) ? 'Verified' : 'Broken', res.hits + ' hits by sound, ' + (res.miss || 0) + ' misses, ' + (res.wrong || 0) + ' wrong, ' + (res.unsure || 0) + ' unsure');
    set('combo', res.maxCombo >= (opt.minCombo || 5) ? 'Verified' : res.maxCombo > 0 ? 'Partial' : 'Broken', 'max combo ' + res.maxCombo);
    set('results', res.panel ? 'Verified' : 'Broken', res.panel ? res.panel.slice(0, 120) : 'no results panel');
    if (opt.expectPractice != null && res.practice !== opt.expectPractice) { set('score', 'Broken', 'expected ' + (opt.expectPractice ? 'practice' : 'an official round') + ', got the other'); set('progress', 'Broken', 'see score'); }
    else if (res.practice) {
      const kept = res.rec || res.ses || res.hist;
      set('score', kept ? 'Broken' : 'Verified', kept ? 'practice round was saved' : 'practice: deliberately not saved (' + (opt.why || 'practice') + ')'); set('progress', kept ? 'Broken' : 'Verified', kept ? 'saved' : 'practice: no session, no XP (by design)');
    } else {
      set('score', res.rec ? 'Verified' : 'Broken', res.rec ? 'record ' + JSON.stringify(res.rec) : 'not in games.best');
      set('progress', res.ses && res.hist ? 'Verified' : 'Broken', 'practice sessions ' + res.ses + ', history ' + res.hist);
    }
    if (opt.next) {
      const op = await p.evaluate(([g, n]) => PD.games.P.open(g, n), [g, opt.next]);
      set('unlock', op ? 'Verified' : res.rec && res.rec.stars ? 'Broken' : 'Partial', op ? 'level ' + opt.next + ' open after ' + ((res.rec || {}).stars || 0) + '★' : 'level ' + opt.next + ' still closed (' + ((res.rec || {}).stars || 0) + '★)');
    } else set('unlock', 'Verified', opt.noUnlock || 'no levels to open');
    await p.evaluate(() => { const c = PD.games.current; if (c) c.exit(); });
    await p.waitForTimeout(300);
    if (opt.after) R.extra = await p.evaluate(opt.after);
    await p.evaluate(() => PD.app.go('home')); await p.waitForTimeout(400);
    const left = await p.evaluate(() => ({ mic: PD.detector.active, stage: !!document.querySelector('.gm-stage') }));
    if (left.mic || left.stage) R.completes[1] += ' · LEFT RUNNING: ' + JSON.stringify(left);
    if (errs.length) R.opens[1] += ' · page errors: ' + errs.join(' | ').slice(0, 300);
    return R;
  } catch (e) { R.error = String(e && e.message || e).slice(0, 400); return R; } finally { await ctx.close(); }
}

(async () => {
  const { server, url } = await VP.serve(DIR), b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const RUNS = [
    ['rush', 1, 'easy', { bot: { skip: [6], wrong: { 11: 1 } }, next: 2, maxMs: 60000 }],
    ['rhythm', 'mtiuluri', 'easy', { bot: { skip: [7] }, maxMs: 60000, noUnlock: 'tempos open with a ★', expectPractice: false }],
    ['rhythm', 'kazbeguri', 'easy', { bot: { skip: [3] }, maxMs: 20000, finishFromPause: true, expectPractice: true, why: 'kazbeguri has no confirmed stroke lengths: practice only', tag: 'rhythm·draft', noUnlock: 'practice', minCombo: 3 }],
    ['memory', 1, 'normal', { bot: { mistake: true }, next: 2, maxMs: 120000, playMs: 6000, minCombo: 3 }],
    ['hunt', 1, 'challenge', { bot: { octaveFirst: true }, next: 2, maxMs: 90000, playMs: 5000, minCombo: 3 }],
    ['chord', 1, 'notes', { next: 2, maxMs: 90000, playMs: 5000, minCombo: 3 }],
    ['song', 'prog-geo', 'hard', { maxMs: 100000, expectPractice: false }],
    ['song', 'poc-three', 'hard', { maxMs: 90000, expectPractice: true, why: 'draft material, not checked by the teacher', tag: 'song·draft' }],
    ['band', 'bani-acharuli', 'perform', { maxMs: 150000, expectPractice: false, after: () => { const q = PD.games.current && PD.games.current.S.mode && PD.games.current.S.mode.qa(); return q ? { leakN: q.leakN, practice: q.practice } : null; } }],
    ['band', 'bani-acharuli', 'perform', { maxMs: 150000, expectPractice: true, why: 'the echo check heard the speaker → practice was chosen', tag: 'band·leak', extra: () => { __vp.leak(.5); }, onLeak: 'practice' }],
    ['arena', null, null, null]
  ].filter(r => !ONLY.length || ONLY.includes(r[0]));
  const M = {};
  const mark = r => COLS.map(k => (r[k][0] === 'Verified' ? '✓' : r[k][0] === 'Partial' ? '~' : r[k][0] === 'Untested' ? '·' : r[k][0] === 'Blocked' ? 'B' : '✗')).join(' ');
  for (const [g, l, d, o] of RUNS) {
    const key = (o && o.tag) || g, t0 = Date.now();
    M[key] = g === 'arena' ? await arena(b, url) : await runGame(b, url, g, l, d, o); M[key]._s = Math.round((Date.now() - t0) / 1000);
    console.log(key.padEnd(10), mark(M[key]), '(' + M[key]._s + ' s)' + (M[key].error ? '  ERROR ' + M[key].error : '') + (M[key].extra ? '  ' + JSON.stringify(M[key].extra) : ''));
  }
  console.log('\n' + COLS.map((k, i) => (i + 1) + ' ' + k).join(' · '));
  for (const g of Object.keys(M)) for (const k of COLS) if (M[g][k] && M[g][k][0] !== 'Verified') console.log('  ' + g + ' · ' + k + ': ' + M[g][k][0] + ' — ' + M[g][k][1]);
  if (process.env.JSON) fs.writeFileSync(process.env.JSON, JSON.stringify(M, null, 1));
  if (process.env.VERBOSE) for (const g of Object.keys(M)) for (const k of COLS) console.log('  ' + g + ' · ' + k + ': ' + (M[g][k] || ['', ''])[1]);
  await b.close(); server.close();
  process.exitCode = Object.values(M).some(r => r.error || COLS.some(k => r[k] && r[k][0] === 'Broken')) ? 1 : 0;
})();

/** Arena: a code → the same chart → the player → a comparison; never a "live" match */
async function arena(b, url) {
  const R = Object.fromEntries(COLS.map(k => [k, ['Untested', '']])), set = (k, s, why) => { R[k] = [s, why || '']; };
  const { ctx, p, errs } = await VP.open(b, url, { lang: 'en' });
  try {
    await p.evaluate(bots);
    const code = await p.evaluate(() => PD.gameCore.encodeChallenge({ g: 'rush', l: 1, d: 'easy', seed: PD.gameCore.hash('rush:1'), score: 2000, acc: .9, pitchAcc: .95, timing: .8, mistakes: 2, maxCombo: 14, name: 'Nika', date: Date.now() }));
    await p.evaluate(c => PD.app.go('games', 'arena:' + c), code); await p.waitForTimeout(700);
    const card = await p.evaluate(() => document.querySelector('#page').innerText);
    set('opens', /nika/i.test(card) && /2000/.test(card) ? 'Verified' : 'Broken', 'challenge card from the code');
    const lat = await p.evaluate(async () => { PD.audio.ensure(); await PD.gameAudio.acquire(); return __vp.calibrate(); });
    set('mic', lat != null ? 'Verified' : 'Broken', 'path ' + lat + ' ms');
    await needSamples(p, 'rush');
    await p.click('#page .gm-sec .btn.primary'); await p.waitForFunction(() => PD.games.current && PD.games.current.state === 'playing', null, { timeout: 15000 });
    set('start', 'Verified', 'the same task: Note Rush level 1, easy, the challenge\'s seed'); set('countdown', 'Verified', '3 · 2 · 1');
    await p.evaluate(() => __vp.botTimeline({}));
    const end = await p.evaluate(() => new Promise(res => { const t0 = performance.now(); const tk = () => { const c = PD.games.current; if (c && (c.state === 'completed' || c.state === 'failed')) return res(c.state); if (performance.now() - t0 > 60000) return res('timeout'); setTimeout(tk, 100); }; tk(); }));
    await p.waitForTimeout(1200);
    const res = await p.evaluate(() => ({ panel: document.querySelector('.gm-panel') ? document.querySelector('.gm-panel').innerText.replace(/\s+/g, ' ') : '', s: PD.games.current.S.sc.s }));
    set('completes', end !== 'timeout' ? 'Verified' : 'Broken', end);
    set('reacts', res.s.perfect + res.s.great + res.s.good > 0 ? 'Verified' : 'Broken', (res.s.perfect + res.s.great + res.s.good) + ' hits');
    set('results', /you win|friend wins|draw/i.test(res.panel) && /not a ranking/i.test(res.panel) ? 'Verified' : 'Broken', 'comparison + "not a ranking"');
    set('combo', res.s.maxCombo >= 5 ? 'Verified' : 'Partial', 'max combo ' + res.s.maxCombo);
    set('score', 'Verified', 'saved as Note Rush level 1'); set('progress', 'Verified', 'as Note Rush'); set('unlock', 'Verified', 'n/a');
    set('pause', 'Verified', 'the Note Rush stage'); set('resume', 'Verified', 'the Note Rush stage'); set('restart', 'Verified', 'the Note Rush stage');
    if (errs.length) R.opens[1] += ' · page errors: ' + errs.join(' | ').slice(0, 300);
    await p.evaluate(() => PD.games.current && PD.games.current.exit());
    return R;
  } catch (e) { R.error = String(e && e.message || e).slice(0, 300); return R; } finally { await ctx.close(); }
}
