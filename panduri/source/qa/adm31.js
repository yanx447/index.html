const { chromium } = require('/opt/node-tools/node_modules/playwright');
const OUT = '/tmp/claude-0/-home-claude/d17ed486-e6cb-5d9f-80bb-ed664a9aab9c/scratchpad/qa/';
(async () => {
  const b = await chromium.launch();
  const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })).newPage();
  p.on('pageerror', e => console.log('PAGEERR', e.message));
  await p.goto('http://localhost:8770/panduri/app/'); await p.waitForTimeout(1500);
  await p.evaluate(() => { localStorage.clear(); PD.store.set('onboarded', true); PD.store.set('auth.skip', true); document.querySelector('.ag')?.remove(); document.querySelector('.ob')?.remove();
    const C = PD.cloud; Object.defineProperty(C, 'isAdmin', { get: () => true, configurable: true });
    C.admin.users = async () => [{ id: 'a1', display_name: 'ნუკრი', email: 'admin@example.test', role: 'admin', level: 3, created_at: '2026-10-05' }, { id: 'b2', display_name: 'მოსწავლე', email: 'student@example.test', role: 'user', level: 1, created_at: '2026-10-10', vip_until: '2026-12-01' }];
    PD.app.go('profile'); });
  await p.waitForTimeout(700);
  console.log('entry', await p.evaluate(() => !!document.querySelector('[data-t="ad.title"]')), 'premium', await p.evaluate(() => PD.premium.active));
  await p.evaluate(() => PD.premium.admin()); await p.waitForTimeout(800);
  await p.screenshot({ path: OUT + 'adm.png' });
  await b.close();
})();
