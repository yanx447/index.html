const { chromium } = require('/opt/node-tools/node_modules/playwright');
const OUT = '/tmp/claude-0/-home-claude/d17ed486-e6cb-5d9f-80bb-ed664a9aab9c/scratchpad/qa/';
(async () => {
  const b = await chromium.launch();
  const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })).newPage();
  p.on('pageerror', e => console.log('PAGEERR', e.message));
  await p.goto('http://localhost:8765/app/'); await p.waitForTimeout(1500);
  await p.evaluate(() => { localStorage.clear(); PD.store.set('onboarded', true); PD.store.set('auth.skip', true); document.querySelector('.ag')?.remove(); document.querySelector('.ob')?.remove();
    const C = PD.cloud; Object.defineProperty(C, 'isAdmin', { get: () => true, configurable: true }); Object.defineProperty(C, 'uid', { get: () => 'me', configurable: true });
    window.DB = [{ id: 'me', display_name: 'ნუკრი ბერიძე', email: 'owner@example.test', role: 'admin', vip_until: '2099-12-31T00:00:00Z', premium_banned: false },
      { id: 'a', display_name: 'ანა', email: 'ana@example.test', role: 'user', vip_until: '2026-12-01T00:00:00Z', premium_banned: false },
      { id: 'b', display_name: 'გიორგი', email: 'gio@example.test', role: 'user', vip_until: null, premium_banned: false },
      { id: 'c', display_name: 'ლევანი', email: 'levani@example.test', role: 'user', vip_until: null, premium_banned: true }];
    C.admin.users = async () => DB.map(x => Object.assign({}, x));
    C.admin.premium = async (id, a) => { const u = DB.find(x => x.id === id); if (a === 'month') u.vip_until = new Date(Date.now() + 31 * 864e5).toISOString(); if (a === 'cancel') u.vip_until = null; if (a === 'ban') { u.vip_until = null; u.premium_banned = true; } if (a === 'restore') { u.premium_banned = false; u.vip_until = '2099-12-31T00:00:00Z'; } return Object.assign({}, u); };
    PD.app.go('settings'); });
  await p.waitForTimeout(700); await p.screenshot({ path: OUT + 'pa-0.png' });
  await p.click('.pa-entry'); await p.waitForTimeout(800); await p.screenshot({ path: OUT + 'pa-1.png', fullPage: false });
  await p.click('.pa-u:nth-child(3) .pa-b >> text=1 თვე'); await p.waitForTimeout(400);
  console.log('after month', await p.evaluate(() => document.querySelector('.pa-u:nth-child(3) .pa-st').textContent));
  await p.click('.pa-u:nth-child(4) .pa-b.good'); await p.waitForTimeout(400);
  console.log('after restore', await p.evaluate(() => document.querySelector('.pa-u:nth-child(4) .pa-st').textContent));
  await p.click('.pa-u:nth-child(2) .pa-b.bad >> nth=1'); await p.waitForTimeout(400); await p.screenshot({ path: OUT + 'pa-2.png' });
  await p.click('text=დადასტურება'); await p.waitForTimeout(400);
  console.log('after ban', await p.evaluate(() => document.querySelector('.pa-u:nth-child(2) .pa-st').textContent), await p.evaluate(() => document.querySelector('.pa-tabs').innerText.replace(/\n/g, ' ')));
  await p.evaluate(() => document.querySelector('.pa-tab.banned').click()); await p.waitForTimeout(300);
  console.log('banned tab', await p.evaluate(() => document.querySelectorAll('.pa-u').length));
  await b.close();
})();
