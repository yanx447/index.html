// Games: every screen and the session's life in the built app (dist/app), in Chromium (BROWSER=webkit for Safari's engine).
//   node qa/games-ui.cjs          SHOTS=dir to keep the screenshots
// Pages at phone, tablet and desktop widths (no script error, nothing wider than the screen); the stage: count-down,
// play, pause, resume, Back, restart, leaving in the middle (the microphone is let go, no timer is left behind), the
// microphone stopping during play, a vanished microphone falling back to the default one, a touch-test round never
// saved, every game's screen starting, and an Arena challenge from code to comparison.
// The microphone is Chromium's fake device reading a silent file: no sound, so only the flow is tested here
// (qa/games-mic.cjs tests the hearing).
const fs = require('fs'), os = require('os'), path = require('path'), http = require('http'), assert = require('assert/strict');
const pw = require('playwright');
const DIR = path.resolve(process.env.APP_DIR || path.join(__dirname, '../dist/app')), SHOTS = process.env.SHOTS || '';
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'games-ui-')), SILENT = path.join(TMP, 'silence.wav');
{ const n = 48000 * 60, b = Buffer.alloc(44 + n * 2); b.write('RIFF', 0); b.writeUInt32LE(36 + n * 2, 4); b.write('WAVEfmt ', 8); b.writeUInt32LE(16, 16); b.writeUInt16LE(1, 20); b.writeUInt16LE(1, 22); b.writeUInt32LE(48000, 24); b.writeUInt32LE(96000, 28); b.writeUInt16LE(2, 32); b.writeUInt16LE(16, 34); b.write('data', 36); b.writeUInt32LE(n * 2, 40); fs.writeFileSync(SILENT, b); }
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.mp3': 'audio/mpeg', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.mp4': 'video/mp4', '.webmanifest': 'application/manifest+json', '.woff2': 'font/woff2' };
const server = http.createServer((q, r) => { const u = decodeURIComponent(new URL(q.url, 'http://x').pathname), f = path.resolve(DIR, '.' + u + (u.endsWith('/') ? 'index.html' : '')); if (!f.startsWith(DIR) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); r.end(); return; } r.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r); });
let APP = '', failed = 0;
const step = async (name, fn) => { try { const r = await fn(); console.log('✓ ' + name + (r ? '  ' + JSON.stringify(r) : '')); } catch (e) { failed++; console.log('✗ ' + name + '\n    ' + String(e && e.message || e).slice(0, 700)); } };
const ENGINE = process.env.BROWSER === 'webkit' ? pw.webkit : pw.chromium;
const ARGS = process.env.BROWSER === 'webkit' ? [] : ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream', '--use-file-for-fake-audio-capture=' + SILENT, '--autoplay-policy=no-user-gesture-required'];

async function open(b, w, hgt, lang, fresh) {
  const ctx = await b.newContext(Object.assign({ viewport: { width: w, height: hgt }, serviceWorkers: 'block', deviceScaleFactor: 1 }, process.env.BROWSER === 'webkit' ? {} : { permissions: ['microphone'] }));
  const p = await ctx.newPage(), errs = [];
  p.on('pageerror', e => errs.push(e.message));
  p.on('console', m => { if (m.type() === 'error' && !/Failed to load|net::|404|ERR_|fonts|NotAllowedError/.test(m.text())) errs.push(m.text().slice(0, 200)); });
  await p.route(u => !u.href.startsWith(APP), r => r.abort());
  await p.goto(APP); await p.waitForFunction(() => window.PD && PD.app && PD.games, null, { timeout: 30000 }); await p.waitForTimeout(500);
  await p.evaluate(([l, fresh]) => { if (!fresh) PD.store.set('gm.intro', 1); PD.i18n.set(l); PD.store.set('onboarded', true); PD.store.set('intro.done', true); PD.store.set('micExplained', true); PD.store.set('gm.calAsked', true); document.querySelectorAll('.ob,.ag,.intro,.cine,.cine-boot').forEach(o => o.remove()); }, [lang || 'ka', !!fresh]);
  return { ctx, p, errs };
}
const settle = p => p.waitForFunction(() => document.querySelectorAll('#main > .page').length === 1, null, { timeout: 5000 }).catch(() => {});
/** nothing of the games wider than the screen */
const overflow = p => p.evaluate(() => { const vw = document.documentElement.clientWidth; return [...document.querySelectorAll('.gm, .gm *')].filter(e => { const r = e.getBoundingClientRect(); if (!r.width || e.closest('.gm-art')) return false; return r.right > vw + 1 || r.left < -1; }).slice(0, 4).map(e => (e.className && e.className.baseVal != null ? e.className.baseVal : e.className) + '→' + Math.round(e.getBoundingClientRect().right)); });
const shot = async (p, name) => { if (SHOTS) { fs.mkdirSync(SHOTS, { recursive: true }); await p.screenshot({ path: path.join(SHOTS, name + '.png') }); } };
const waitState = (p, s, ms) => p.waitForFunction(s => PD.games.current && PD.games.current.state === s, s, { timeout: ms || 15000 });

(async () => {
  await new Promise(r => server.listen(0, '127.0.0.1', r)); APP = 'http://127.0.0.1:' + server.address().port + '/';
  const b = await ENGINE.launch({ args: ARGS });
  try {
    for (const [w, hgt, lang] of [[360, 740, 'ka'], [390, 844, 'en'], [768, 1024, 'ka'], [1440, 900, 'en']]) await step('pages at ' + w + '×' + hgt + ' (' + lang + '): no error, nothing wider than the screen', async () => {
      const { ctx, p, errs } = await open(b, w, hgt, lang), bad = [];
      for (const r of [null, 'rush', 'rhythm', 'memory', 'hunt', 'chord', 'song', 'band', 'arena']) {
        await p.evaluate(r => PD.app.go('games', r), r); await settle(p); await p.waitForTimeout(250);
        const o = await overflow(p); if (o.length) bad.push((r || 'hub') + ': ' + o.join(' '));
        const raw = await p.evaluate(() => [...document.querySelectorAll('#page [data-t]')].filter(e => e.textContent === e.dataset.t).map(e => e.dataset.t)); if (raw.length) bad.push((r || 'hub') + ' raw keys: ' + raw.join(','));
        await shot(p, 'page-' + (r || 'hub') + '-' + w);
      }
      await p.evaluate(() => PD.app.go('home')); await settle(p); const home = await p.$$eval('.gm-cont', x => x.length); if (!home) bad.push('no games card on Home');
      await ctx.close();
      assert.equal(errs.length, 0, errs.join(' | ')); assert.equal(bad.length, 0, bad.join(' | '));
      return { ok: true };
    });
    await step('first visit: three short steps, skippable at any step, never shown again', async () => {
      const { ctx, p, errs } = await open(b, 390, 844, 'en', true);
      await p.evaluate(() => PD.app.go('games')); await settle(p);
      await p.waitForSelector('.gm-intro', { timeout: 4000 }); await shot(p, 'intro-1');
      const s1 = await p.$eval('.gm-intro', e => e.innerText.replace(/\s+/g, ' '));
      await p.click('.gm-intro .btn.primary'); await p.waitForTimeout(250);
      const s2 = await p.$eval('.gm-intro', e => e.innerText.replace(/\s+/g, ' '));
      await p.click('.gm-intro .btn.quiet'); await p.waitForTimeout(500);
      const gone = await p.evaluate(() => !document.querySelector('.sheet-back:not(.out) .gm-intro') && !!PD.store.get('gm.intro', 0));
      await p.evaluate(() => PD.app.go('home')); await settle(p); await p.evaluate(() => PD.app.go('games')); await settle(p); await p.waitForTimeout(800);
      const again = await p.$$eval('.sheet-back:not(.out) .gm-intro', x => x.length);
      await ctx.close();
      assert.ok(/1 \/ 3/.test(s1) && /controller/i.test(s1), s1); assert.ok(/2 \/ 3/.test(s2) && /microphone/i.test(s2), s2);
      assert.ok(gone, 'skipped and remembered'); assert.equal(again, 0, 'not shown a second time'); assert.equal(errs.length, 0, errs.join(' | '));
      return { steps: 3 };
    });
    await step('the start page checks the listening: microphone, signal, last note, calibration, tuning', async () => {
      const { ctx, p, errs } = await open(b, 390, 844, 'en');
      await p.evaluate(() => PD.app.go('games', 'rush')); await settle(p);
      const off = await p.$$eval('.gm-chk-r', x => x.map(e => e.innerText.replace(/\s+/g, ' ')));
      await p.click('.gm-mic .btn.primary'); await p.waitForFunction(() => PD.detector.active, null, { timeout: 8000 }); await p.waitForTimeout(1500);
      const on = await p.$$eval('.gm-chk-r', x => x.map(e => e.innerText.replace(/\s+/g, ' ')));
      await shot(p, 'page-rush-check');
      await p.evaluate(() => PD.app.go('home')); await p.waitForTimeout(400); const mic = await p.evaluate(() => PD.detector.active);
      await ctx.close();
      assert.equal(off.length, 5, off.join(' | ')); assert.ok(/Microphone.*Off/.test(off[0]), off[0]);
      assert.ok(/On/.test(on[0]) && /Strike a string/.test(on[1]) && /Nothing yet/.test(on[2]), 'a silent microphone: on, but no signal and no note — ' + on.join(' | '));
      assert.ok(/Needed/.test(on[3]) && /Not checked/.test(on[4]), on.join(' | ')); assert.equal(mic, false, 'leaving the games lets the microphone go');
      assert.equal(errs.length, 0, errs.join(' | '));
      return { rows: on };
    });
    await step('navigation: Games on the side bar (desktop), not an extra phone tab; the Practice hub lists it', async () => {
      const { ctx, p } = await open(b, 1440, 900, 'en');
      const side = await p.$$eval('.side [data-go="games"]', x => x.length), dock = await p.$$eval('.dock [data-go]', x => x.map(e => e.dataset.go));
      await p.evaluate(() => PD.app.go('practice')); await settle(p); const hubRow = await p.evaluate(() => [...document.querySelectorAll('#page .prow b')].some(b => b.textContent === 'Games'));
      await ctx.close();
      assert.equal(side, 1); assert.ok(hubRow, 'practice hub row');
      return { side, dockTabs: dock.length };
    });
    await step('the stage: count-down → play → pause → resume → Back → restart → leave; nothing left running', async () => {
      const { ctx, p, errs } = await open(b, 390, 844, 'ka');
      await p.evaluate(() => PD.app.go('games', 'rush')); await settle(p);
      await p.click('.gm-go .btn'); await waitState(p, 'countdown'); await shot(p, 'stage-countdown');
      await waitState(p, 'playing', 8000); await p.waitForTimeout(2600); await shot(p, 'stage-rush-play');
      const a = await p.evaluate(() => { const S = PD.games.current.S; return { song: S.songNow(), mic: PD.detector.active, ivs: S.ivs.size, cls: document.documentElement.classList.contains('gm-on') }; });
      assert.ok(a.mic, 'microphone on'); assert.ok(a.song > 1.5, 'song time runs ' + a.song); assert.ok(a.cls);
      await p.click('.gm-hud .gm-ib'); await waitState(p, 'paused'); const s1 = await p.evaluate(() => PD.games.current.S.songNow()); await p.waitForTimeout(800); const s2 = await p.evaluate(() => PD.games.current.S.songNow());
      assert.ok(Math.abs(s2 - s1) < .02, 'the clock stops in the pause: ' + s1 + ' → ' + s2); await shot(p, 'stage-paused');
      await p.click('.gm-panel .btn.primary'); await waitState(p, 'countdown'); await waitState(p, 'playing', 8000);
      const s3 = await p.evaluate(() => PD.games.current.S.songNow()); assert.ok(s3 >= s1 - .05 && s3 < s1 + .6, 'resumes where it stopped: ' + s1 + ' → ' + s3);
      await p.goBack(); await waitState(p, 'paused', 5000);   // Back pauses during play
      const restartBtn = await p.$$('.gm-panel .gm-btns .btn'); await restartBtn[0].click(); await waitState(p, 'countdown'); await waitState(p, 'playing', 8000);
      const r = await p.evaluate(() => { const S = PD.games.current.S; return { song: S.songNow(), ivs: S.ivs.size, timers: S.timers.size, combo: S.sc.s.combo }; });
      assert.ok(r.song < 1.5, 'a fresh round: ' + r.song); assert.ok(r.ivs <= 1, 'one scheduler, not two: ' + r.ivs);
      // fps stays one loop: count frames for a second
      const fps = await p.evaluate(() => new Promise(res => { let n = 0; const t0 = performance.now(); const f = () => { n++; if (performance.now() - t0 < 1000) requestAnimationFrame(f); else res(n); }; requestAnimationFrame(f); }));
      await p.evaluate(() => PD.app.go('home')); await p.waitForTimeout(400);   // leaving in the middle
      const after = await p.evaluate(() => ({ cur: !!PD.games.current, mic: PD.detector.active, stage: !!document.querySelector('.gm-stage'), cls: document.documentElement.classList.contains('gm-on') }));
      await ctx.close();
      assert.deepEqual(after, { cur: false, mic: false, stage: false, cls: false }, JSON.stringify(after)); assert.equal(errs.length, 0, errs.join(' | '));
      return { fps, resumedAt: +s3.toFixed(2), pausedAt: +s1.toFixed(2) };
    });
    await step('the microphone stops during play → the game pauses and says so; a vanished microphone falls back to the default', async () => {
      const { ctx, p, errs } = await open(b, 390, 844, 'en');
      await p.evaluate(() => { PD.audio.ensure(); PD.games.play('rhythm', { l: 'mtiuluri', d: 'easy', opts: {} }); }); await waitState(p, 'playing', 10000);
      await p.evaluate(() => PD.detector.stop()); await waitState(p, 'paused', 3000);
      const msg = await p.$eval('.gm-panel', e => e.innerText.replace(/\s+/g, ' '));
      assert.ok(/microphone stopped/i.test(msg), msg);
      await p.evaluate(() => PD.detector.setDevice('no-such-device'));
      await p.click('.gm-panel .btn.primary'); await waitState(p, 'playing', 10000);
      const on = await p.evaluate(() => PD.detector.active); assert.ok(on, 'the default microphone took over');
      await p.evaluate(() => { PD.detector.setDevice(''); PD.games.current.exit(); });
      await ctx.close(); assert.equal(errs.length, 0, errs.join(' | '));
      return { message: msg.slice(0, 60) };
    });
    await step('settings, tuning check and play-along timing open and close; the diagnostics panel is for developers only', async () => {
      const { ctx, p, errs } = await open(b, 390, 844, 'en');
      await p.evaluate(() => PD.app.go('games')); await settle(p);
      await p.click('.gm-head .gm-ib'); await p.waitForSelector('.sheet'); const dev0 = await p.$$eval('.sheet .gm-k', x => x.map(e => e.textContent));
      await p.evaluate(() => document.querySelector('.sheet .btn.primary').click()); await p.waitForTimeout(400);
      await p.evaluate(() => PD.games.tuneCheck()); await p.waitForSelector('.sheet .gm-li'); const rows = await p.$$eval('.sheet .gm-li', x => x.length);
      await p.evaluate(() => document.querySelector('.sheet .btn.primary').click()); await p.waitForTimeout(400);
      await p.evaluate(() => PD.games.offsetSheet()); await p.waitForSelector('.sheet'); const offTxt = await p.$eval('.sheet', e => e.innerText.slice(0, 60));
      await p.keyboard.press('Escape'); await p.waitForTimeout(400);
      const mic = await p.evaluate(() => PD.detector.active);
      await p.evaluate(() => { PD.store.set('devTouch', true); PD.store.set('gm.debug', true); PD.audio.ensure(); PD.games.play('rush', { l: 1, d: 'easy', opts: {} }); }); await waitState(p, 'playing', 10000); await p.waitForTimeout(500);
      const dbg = await p.$eval('.gm-dbg', e => ({ shown: !e.hidden, text: e.textContent }));
      await shot(p, 'stage-debug');
      await p.evaluate(() => { PD.games.current.exit(); PD.store.set('devTouch', false); }); await p.waitForTimeout(300);
      await p.evaluate(() => PD.app.go('games')); await settle(p); await p.click('.gm-head .gm-ib'); await p.waitForSelector('.sheet'); const dev1 = await p.$$eval('.sheet .gm-k', x => x.map(e => e.textContent));
      await ctx.close();
      assert.equal(rows, 3); assert.ok(/timing/i.test(offTxt), offTxt); assert.equal(mic, false, 'the sheets let the microphone go');
      assert.ok(!dev0.some(x => /developer/i.test(x)), 'no developer section for a learner: ' + dev0); assert.ok(!dev1.some(x => /developer/i.test(x)), 'switched off again');
      assert.ok(dbg.shown && /Latency/.test(dbg.text), 'diagnostics in the touch test: ' + dbg.text);
      assert.equal(errs.length, 0, errs.join(' | '));
      return { debugLines: dbg.text.split('\n').length };
    });
    await step('a touch-test round (developer switch) finishes but is never saved', async () => {
      const { ctx, p, errs } = await open(b, 390, 844, 'en');
      await p.evaluate(() => { PD.store.set('devTouch', true); PD.audio.ensure(); PD.games.play('rush', { l: 1, d: 'easy', opts: {} }); }); await waitState(p, 'playing', 10000);
      // tap the lane of each coming note on time (the touch test only), then jump to the end
      for (let k = 0; k < 4; k++) { const x = await p.evaluate(() => { const S = PD.games.current.S, st = S.songNow(), ch = PD.gameCore.rushChart(1, 'easy').chart, n = ch.find(q => q.t > st + .05); return n ? { wait: (n.t - st) * 1000, s: n.s } : null; }); if (!x) break; await p.waitForTimeout(Math.max(0, x.wait - 15)); const box = await p.$eval('.gm-field', e => { const r = e.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height }; }); const lw = Math.min(150, (box.w - 16) / 3), x0 = box.x + (box.w - lw * 3) / 2; await p.mouse.click(x0 + lw * (x.s - .5), box.y + box.h * .7); }
      const hitsByTouch = await p.evaluate(() => PD.games.current.S.sc.s.perfect + PD.games.current.S.sc.s.great + PD.games.current.S.sc.s.good);
      await p.evaluate(() => { const S = PD.games.current.S; S.clock.reset(); S.clock.run(999, S.now()); });
      await p.waitForFunction(() => ['completed', 'failed'].includes(PD.games.current && PD.games.current.state), null, { timeout: 8000 });
      await shot(p, 'stage-results');
      const r = await p.evaluate(() => ({ text: document.querySelector('.gm-panel').innerText.replace(/\s+/g, ' '), best: PD.store.get('games.best', null), ses: PD.lessons.progress.sessions().filter(s => String(s.id).startsWith('game:')).length }));
      await p.evaluate(() => { PD.games.current.exit(); PD.store.set('devTouch', false); });
      await ctx.close();
      assert.ok(hitsByTouch >= 3, 'touch hits ' + hitsByTouch); assert.ok(/not saved/i.test(r.text), r.text); assert.equal(r.best, null, 'nothing in the records'); assert.equal(r.ses, 0, 'no practice session');
      assert.equal(errs.length, 0, errs.join(' | '));
      return { hitsByTouch };
    });
    for (const [g, l, d] of [['memory', 1, 'normal'], ['hunt', 1, 'learn'], ['chord', 1, 'notes'], ['chord', 1, 'strum'], ['song', 'm1', 'normal'], ['band', 'bani-acharuli', 'practice']]) await step('the ' + g + ' screen (' + d + ') starts, draws and leaves cleanly', async () => {
      const { ctx, p, errs } = await open(b, 390, 844, 'ka');
      await p.evaluate(([g, l, d]) => { PD.audio.ensure(); PD.games.play(g, { l, d, opts: g === 'band' ? { mix: 'music', tempo: 80, sec: 1 } : {} }); }, [g, l, d]);
      await waitState(p, 'playing', g === 'band' ? 60000 : 12000); await p.waitForTimeout(g === 'memory' ? 2500 : 1500);
      await shot(p, 'stage-' + g + '-' + d);
      const info = await p.evaluate(() => ({ state: PD.games.current.state, kids: document.querySelector('.gm-field').children.length, ref: PD.audio.ref.state, playing: PD.audio.ref.playing }));
      await p.evaluate(() => PD.games.current.exit()); await p.waitForTimeout(300);
      const after = await p.evaluate(() => ({ mic: PD.detector.active, ref: PD.audio.ref.playing, expect: null }));
      await ctx.close();
      assert.equal(errs.length, 0, errs.join(' | ')); assert.equal(info.state, 'playing'); assert.equal(after.mic, false, 'microphone let go'); assert.equal(after.ref, false, 'recording stopped');
      if (g === 'band') assert.ok(info.playing, 'the recording plays along (' + info.ref + ')');
      return g === 'band' ? { ref: info.ref, playing: info.playing } : undefined;
    });
    await step('Arena: a challenge code opens the same task, and the result is compared side by side', async () => {
      const { ctx, p, errs } = await open(b, 390, 844, 'en');
      const code = await p.evaluate(() => PD.gameCore.encodeChallenge({ g: 'rush', l: 1, d: 'easy', seed: PD.gameCore.hash('rush:1'), score: 1234, acc: .82, pitchAcc: .9, timing: .7, mistakes: 3, maxCombo: 9, name: 'Nika', date: Date.now() }));
      await p.evaluate(c => PD.app.go('games', 'arena:' + c), code); await settle(p); await shot(p, 'page-arena-challenge');
      const card = await p.$eval('#page', e => e.innerText); assert.ok(/a challenge from nika/i.test(card) && /1234/.test(card), card.slice(0, 300));
      await p.evaluate(() => PD.store.set('devTouch', true));
      await p.click('#page .gm-sec .btn.primary'); await waitState(p, 'playing', 10000);
      await p.evaluate(() => { const S = PD.games.current.S; S.clock.reset(); S.clock.run(999, S.now()); });
      await p.waitForFunction(() => ['completed', 'failed'].includes(PD.games.current && PD.games.current.state), null, { timeout: 8000 });
      const res = await p.$eval('.gm-panel', e => e.innerText.replace(/\s+/g, ' '));
      await shot(p, 'stage-arena-result');
      await p.evaluate(() => { PD.games.current.exit(); PD.store.set('devTouch', false); }); await ctx.close();
      assert.ok(/Your friend wins this time|You win|A draw/.test(res), res); assert.ok(/not a ranking/.test(res), 'the honesty note');
      assert.equal(errs.length, 0, errs.join(' | '));
      return { compared: true };
    });
  } finally { await b.close(); server.close(); }
  console.log(failed ? failed + ' failed' : 'all passed'); process.exitCode = failed ? 1 : 0;
})();
