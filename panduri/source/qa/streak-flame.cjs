/* The streak is a flame. Lit when today already counts, grey when the streak is still alive but today does not
   count yet (it goes out at the end of the day), an outline when there is none. The number sits in the flame's own
   colour, the colour climbs with the milestones, and the first qualifying session of a day lights it with a short
   animation — once that day, not on every session. Chats show the server's chat_streak (from 3 days) beside the name.
   The server is not reached (every https request is refused): practice comes from seeded local sessions, the chat
   streaks from stubbed PD.cloud.chat calls.
   Usage: python3 build.py && node qa/streak-flame.cjs */
const fs = require('fs'), path = require('path'), assert = require('assert/strict');
const { chromium } = require('playwright');
const ROOT = path.resolve(__dirname, '../../..'), APP = path.resolve(process.env.APPDIR || path.join(ROOT, 'panduri/source/dist/app'));

async function open(b, days, lang = 'en') {
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, serviceWorkers: 'block' });
  await ctx.route('https://**/*', r => r.abort());
  await ctx.route('http://panduri.test/**', r => {
    const u = decodeURIComponent(new URL(r.request().url()).pathname).replace(/^\/app/, ''), f = path.join(APP, u.endsWith('/') ? u + 'index.html' : u);
    return f.startsWith(APP) && fs.existsSync(f) ? r.fulfill({ path: f }) : r.fulfill({ status: 404, body: '' });
  });
  await ctx.addInitScript(s => { if (sessionStorage.seeded) return; sessionStorage.seeded = 1; localStorage.clear();
    const S = (k, v) => localStorage.setItem('pd2:' + k, JSON.stringify(v)), now = Date.now();
    S('onboarded', true); S('intro.done', true); S('lang', s.lang); S('auth.skip', true);
    S('sessions', s.days.map(o => ({ date: now - o * 864e5, dur: 300, correct: 20, firstTry: 15, pitch: .8, lesson: 'x' }))); }, { days, lang });
  const p = await ctx.newPage(), errors = []; p.on('pageerror', e => errors.push(e.message));
  await p.goto('http://panduri.test/app/'); await p.waitForFunction(() => window.PD && PD.app && PD.practiceStreak);
  await p.evaluate(() => document.querySelectorAll('.ob,.ag,.intro,.cine,.cine-boot,.lf').forEach(o => o.remove()));
  return { ctx, p, errors };
}
const go = async (p, r, sel) => { await p.evaluate(r => PD.app.go(r), r); await p.waitForSelector('#page ' + sel, { timeout: 10000 }); };
/** the flame inside `sel`: its state, tier, number, and the number's colour ('flame' when it wears the flame's own) */
const read = (p, sel) => p.evaluate(sel => {
  const f = document.querySelector('#page ' + sel + ' .psf'); if (!f) return null;
  const n = f.querySelector('.psf-n'), probe = document.createElement('i'); probe.style.color = 'var(--fl-a)'; f.append(probe);
  const want = getComputedStyle(probe).color; probe.remove();
  return { state: f.dataset.state, tier: f.dataset.streakTier, num: n ? n.textContent : null, numColour: n ? (getComputedStyle(n).color === want ? 'flame' : getComputedStyle(n).color) : null };
}, sel);
const ago = n => Array.from({ length: n }, (_, i) => i);

(async () => {
  const b = await chromium.launch({ headless: true }); let failed = 0;
  const check = async (name, fn) => { try { await fn(); console.log('✓ ' + name); } catch (e) { failed++; console.log('✗ ' + name + '\n    ' + String(e.message).slice(0, 500)); } };

  await check('12 days, today counted: a lit flame on home, learn and progress; 12 in the flame\'s colour; the 10-day colour', async () => {
    const { ctx, p, errors } = await open(b, ago(12));
    await go(p, 'home', '.hm-series .psf'); assert.deepEqual(await read(p, '.hm-series'), { state: 'lit', tier: '10', num: '12', numColour: 'flame' });
    await go(p, 'learn', '.ps-card .psf'); assert.equal((await read(p, '.ps-card')).state, 'lit');
    await go(p, 'progress', '.psf-row .psf'); assert.deepEqual(await read(p, '.psf-row'), { state: 'lit', tier: '10', num: '12', numColour: 'flame' });
    assert.deepEqual(errors, []); await ctx.close();
  });
  await check('4 days up to yesterday: the flame is grey until today counts, the number grey with it', async () => {
    const { ctx, p, errors } = await open(b, [1, 2, 3, 4]);
    await go(p, 'home', '.hm-series .psf'); assert.deepEqual(await read(p, '.hm-series'), { state: 'risk', tier: '3', num: '4', numColour: 'rgb(168, 162, 155)' });
    assert.deepEqual(errors, []); await ctx.close();
  });
  await check('no practice: an unlit outline and 0', async () => {
    const { ctx, p, errors } = await open(b, []);
    await go(p, 'home', '.hm-series .psf'); const r = await read(p, '.hm-series'); assert.equal(r.state, 'off'); assert.equal(r.num, '0');
    assert.deepEqual(errors, []); await ctx.close();
  });
  await check('the milestone colours differ, and a chat flame needs 3 days', async () => {
    const { ctx, p } = await open(b, []);
    const r = await p.evaluate(() => { const P = PD.practiceStreak, c = n => { const f = P.flame(n, { today: true }); document.body.append(f); const v = getComputedStyle(f).getPropertyValue('--fl-a').trim(); f.remove(); return v; };
      return { colours: [1, 3, 10, 50, 100, 200, 500, 800, 1000].map(c), chat2: P.flame(2, { start: 3, today: true }).dataset.state, chat3: P.flame(3, { start: 3, today: true }).dataset.state }; });
    assert.ok(new Set(r.colours.slice(1)).size === 8, 'eight milestone colours ' + r.colours); assert.equal(r.chat2, 'off'); assert.equal(r.chat3, 'lit');
    await ctx.close();
  });
  await check('the first qualifying session of the day lights the flame with the new number, the second does not, and the overlay leaves', async () => {
    const { ctx, p, errors } = await open(b, [1, 2]); await go(p, 'home', '.hm-series .psf');
    const r = await p.evaluate(async () => { const add = () => PD.lessons.progress.addSession({ date: Date.now(), dur: 120, correct: 5, firstTry: 3, pitch: .7, lesson: 'x' }), wait = ms => new Promise(r => setTimeout(r, ms));
      add(); await wait(1000); const first = !!document.querySelector('.psf-ignite'), num = document.querySelector('.psf-ignite .psf-big')?.textContent;
      await wait(2600); const gone = !document.querySelector('.psf-ignite'); add(); await wait(1000);
      return { first, num, gone, second: !!document.querySelector('.psf-ignite'), blocks: document.querySelector('.psf-ignite') ? getComputedStyle(document.querySelector('.psf-ignite')).pointerEvents : 'none' }; });
    assert.deepEqual(r, { first: true, num: '3', gone: true, second: false, blocks: 'none' }); assert.deepEqual(errors, []); await ctx.close();
  });
  await check('chat list: the server\'s streak beside the name — lit, grey, none below 3 — and a long name never pushes it out', async () => {
    const { ctx, p, errors } = await open(b, [], 'ka');
    const r = await p.evaluate(async () => { const C = PD.cloud, now = new Date().toISOString();
      for (const [k, v] of Object.entries({ configured: true, session: { user: { id: 'self' } }, profile: { id: 'self', display_name: 'Me', nickname: 'me' }, uid: 'self' })) Object.defineProperty(C, k, { get: () => v, configurable: true });
      PD.store.set('md.rules.self', true);
      const rows = [['a', 'ნუკრი'], ['b', 'ანა'], ['c', 'გიორგი'], ['d', 'მარიამ ძალიან გრძელი სახელით და კიდევ უფრო გრძელი გვარით']].map(([id, n], i) => ({ id, other: 'u' + i, other_name: n, other_nick: id, last_body: 'გამარჯობა', last_at: now, unread: 0 }));
      const S = { a: { days: 12, today: true }, b: { days: 4, today: false }, c: { days: 2, today: true }, d: { days: 150, today: true } };
      Object.assign(C.chat, { list: async () => rows, preferences: async () => [], streak: async id => S[id] }); C.social.friends = async () => []; C.moderation.blocks = async () => [];
      PD.app.go('community', 'chats'); for (let i = 0; i < 40 && document.querySelectorAll('#page .cm-streak .psf').length < 3; i++) await new Promise(r => setTimeout(r, 100));
      return [...document.querySelectorAll('#page .cm-crow')].map(x => { const f = x.querySelector('.cm-streak .psf'); return f ? f.dataset.state + ' ' + f.textContent + (f.getBoundingClientRect().right <= x.getBoundingClientRect().right ? '' : ' clipped') : null; }); });
    assert.deepEqual(r, ['lit 12', 'risk 4', null, 'lit 150']); assert.deepEqual(errors, []); await ctx.close();
  });
  await b.close(); console.log(failed ? failed + ' failed' : 'streak-flame: all as expected'); process.exitCode = failed ? 1 : 0;
})().catch(e => { console.error(e); process.exit(1); });
