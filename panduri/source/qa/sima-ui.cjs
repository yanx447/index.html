// Sima in the real app (no account, no network): theory answers with ▶ buttons that sound, the conversation
// kept after closing, her message of the day once, the song list, a song looked for, the setting for it.
// APP_URL defaults to a local server of dist/app (python3 -m http.server 8193 in dist/app).
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const out = require('node:path').join(require('node:os').tmpdir(), 'panduri-sima');
require('node:fs').mkdirSync(out, { recursive: true });
(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const results = [];
  for (const width of (process.env.WIDTHS || '390,1440').split(',').map(Number)) {
    const ctx = await browser.newContext({ viewport: { width, height: width === 390 ? 844 : 960 }, serviceWorkers: 'block' });
    const page = await ctx.newPage(), errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(process.env.APP_URL || 'http://localhost:8193/');
    await page.waitForFunction(() => window.PD && PD.app && document.querySelector('#page'));
    await page.evaluate(() => { document.querySelectorAll('.ag,.ob,.cine,.cine-boot').forEach(x => x.remove()); PD.store.set('sima.day', ''); PD.store.set('sima.unread', 0); PD.store.set('sima.thread.-', []); PD.app.go('home', null, true); });
    await page.evaluate(w => PD.i18n.set(w === 390 ? 'ka' : 'en'), width);
    await page.waitForTimeout(900);
    // she writes first, once a day: a dot on her button and a card
    // (the app may already have written today's message while it opened: start the day again)
    const fired = await page.evaluate(() => { document.querySelectorAll('.sm-tip').forEach(x => x.remove()); PD.store.set('sima.thread.-', []); PD.store.set('sima.unread', 0); PD.store.set('sima.day', ''); PD.sima.mount(); return PD.sima.daily(); });
    assert.equal(fired, true, 'the message of the day is written');
    assert.equal(await page.evaluate(() => PD.sima.daily()), false, 'only once a day');
    assert.equal(await page.evaluate(() => !!document.querySelector('.sm-fab.sm-new')), true, 'unread dot');
    assert.equal(await page.evaluate(() => !!document.querySelector('.sm-tip')), true, 'the card that opens her');
    // the panel: her two messages of today are there, with their badges
    await page.evaluate(() => PD.sima.open(''));
    await page.waitForTimeout(300);
    const day = await page.evaluate(() => [...document.querySelectorAll('.sm-b.day')].map(b => ({ t: b.querySelector('.sm-t') && b.querySelector('.sm-t').textContent, badge: b.querySelector('.tp-src') && b.querySelector('.tp-src').className })));
    assert.equal(day.length, 2, 'tip + theory of the day'); assert.match(day[1].badge, /fact/);
    assert.equal(await page.evaluate(() => !!document.querySelector('.sm-fab.sm-new')), false, 'read once opened');
    // theory, worked out and playable
    const ask = async q => { await page.fill('.sm-in', q); await page.press('.sm-in', 'Enter'); await page.waitForTimeout(450); return page.evaluate(() => { const b = [...document.querySelectorAll('.sm-b.her')].pop(); return { text: b.innerText, plays: [...b.querySelectorAll('.sm-pl')].map(x => x.textContent), ext: [...b.querySelectorAll('.sm-ext')].map(x => x.href) }; }); };
    let a = await ask('რა აკორდებია ლა მინორში?');
    assert.match(a.text, /i Am · ii° Bdim · III C · iv Dm · v Em · VI F · VII G/); assert(a.plays.length >= 3, 'play buttons');
    // pressing ▶ schedules sound on the audio clock and turns into ■
    await page.evaluate(() => [...document.querySelectorAll('.sm-b.her')].pop().querySelector('.sm-pl').click());
    await page.waitForTimeout(250);
    assert.equal(await page.evaluate(() => { const b = document.querySelector('.sm-pl.on'); return b && b.textContent.startsWith('■'); }), true, 'playing');
    await page.evaluate(() => document.querySelector('.sm-pl.on').click());
    assert.equal(await page.evaluate(() => !!document.querySelector('.sm-pl.on')), false, 'stopped');
    a = await ask('F♯ მაჟორის გამა'); assert.match(a.text, /E♯/);
    a = await ask('დამიკარი აჭარული'); assert.match(a.text, /აჭარ|Acharuli/); assert(a.plays.length >= 1, 'rhythm plays');
    await page.waitForTimeout(400);
    a = await ask('როგორ ავიღო Bm?'); if (!/Bm/.test(a.text)) console.log(errors, await page.evaluate(() => [...document.querySelectorAll('.sm-b')].slice(-4).map(b => b.className + ' | ' + b.innerText.slice(0, 80)))); assert.match(a.text, /Bm/); assert(a.plays.length >= 1, 'chord plays');
    a = await ask('რა სიმღერები გაქვს?'); assert.match(a.text, /ბანი|სულიკო|Bani|Suliko/u);
    a = await ask('what interval is between E and B flat'); assert.match(a.text, /d5/);
    a = await ask('მოძებნე სიმღერა ჩემო კარგო ქვეყანავ'); assert.equal(a.ext[0], 'https://www.youtube.com/results?search_query=' + encodeURIComponent('ჩემო კარგო ქვეყანავ'));
    a = await ask('ბანი-აჭარული'); const bani = a;
    if (width === 390) await page.screenshot({ path: out + '/sima-390.png' });
    else await page.screenshot({ path: out + '/sima-1440.png' });
    // closed and opened again: the conversation is still there, and today's message is not repeated
    // what is kept: every question and every answer (the sign-in notice is not part of the conversation)
    const n0 = await page.evaluate(() => document.querySelectorAll('.sm-b.me, .sm-b.her:has(.sm-t)').length);
    await page.evaluate(() => { PD.sima.close(); PD.sima.open(''); });
    await page.waitForTimeout(250);
    const again = await page.evaluate(() => ({ n: document.querySelectorAll('.sm-b.me, .sm-b.her:has(.sm-t)').length, day: document.querySelectorAll('.sm-b.day').length }));
    assert.equal(again.n, n0, 'kept'); assert.equal(again.day, 2, 'not repeated');
    const overflow = await page.evaluate(() => { const c = document.querySelector('.sm-card'); return c.scrollWidth - c.clientWidth; });
    assert(overflow <= 1, 'no sideways overflow ' + overflow);
    // clear
    await page.evaluate(() => document.querySelector('.sm-head button[aria-label]').click());
    assert.equal(await page.evaluate(() => (PD.store.get('sima.thread.-', []) || []).length), 0, 'cleared');
    await page.evaluate(() => PD.sima.close());
    // the setting
    await page.evaluate(() => PD.app.go('settings')); await page.waitForTimeout(900);
    assert.equal(await page.evaluate(() => !!document.querySelector('[data-t="sm.dailyOn"]')), true, 'setting');
    const raw = await page.evaluate(() => [...document.querySelectorAll('[data-t]')].filter(e => /^(sm|smt|nt)\./.test(e.textContent.trim())).map(e => e.textContent));
    assert.deepEqual(raw, [], 'no raw keys');
    assert.deepEqual(errors, []);
    results.push({ width, bani: bani.plays, ok: true });
    await ctx.close();
  }
  console.log(JSON.stringify(results));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
