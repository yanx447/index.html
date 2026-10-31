// notifications: permission, the inbox, the reminders and the settings section
const { chromium } = require('/opt/node-tools/node_modules/playwright');
const OUT = '/tmp/claude-0/-home-claude/d17ed486-e6cb-5d9f-80bb-ed664a9aab9c/scratchpad/qa/notify/';
require('fs').mkdirSync(OUT, { recursive: true });
(async () => {
  const b = await chromium.launch();
  for (const lang of ['ka', 'en']) {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
    await ctx.grantPermissions(['notifications'], { origin: 'http://localhost:8766' });
    const p = await ctx.newPage();
    const errs = []; p.on('pageerror', e => errs.push('PE ' + e.message));
    p.on('console', m => { if (m.type() === 'error' && !/fonts|Failed to load resource/.test(m.text())) errs.push('C ' + m.text().slice(0, 140)); });
    await p.goto('http://localhost:8766/dist/app/'); await p.waitForTimeout(1500);
    await p.evaluate(l => { localStorage.clear(); PD.store.set('onboarded', true); PD.store.set('auth.skip', true); PD.store.set('cine', false); PD.i18n.set(l); document.querySelector('.ag')?.remove(); document.querySelector('.ob')?.remove(); PD.app.go('settings'); }, lang);
    await p.waitForTimeout(800);
    console.log('==', lang, '| settings section:', await p.evaluate(() => { const s = [...document.querySelectorAll('.set-sec h2')].map(x => x.textContent); return s.filter(x => /შეტყობ|Notific/.test(x)); }));
    // turn them on
    const on = await p.evaluate(async () => { const sec = [...document.querySelectorAll('.set-sec')].find(s2 => /შეტყობ|Notific/.test(s2.querySelector('h2').textContent)); const b2 = sec && sec.querySelector('.btn'); if (!b2) return 'no button'; b2.click(); await new Promise(r => setTimeout(r, 600)); return { on: PD.notify.prefs().on, perm: PD.notify.perm() }; });
    console.log('  turn on →', JSON.stringify(on));
    await p.waitForTimeout(600);
    console.log('  rows:', await p.evaluate(() => [...document.querySelectorAll('.set-sec')].filter(s => /შეტყობ|Notific/.test(s.querySelector('h2').textContent))[0].querySelectorAll('.li').length));
    await p.screenshot({ path: OUT + lang + '_settings.png', fullPage: false });
    // a notification of each kind
    const shown = await p.evaluate(async () => {
      await PD.notify.show('news', 'ტესტი', 'სატესტო ტექსტი', 'home');
      await PD.notify.show('social', 'მეგობრობის თხოვნა', 'ნიკა მეგობრობას გთხოვს.', 'community');
      await PD.notify.show('exam', 'გამოცდა გელოდება', '„ნოტები“', 'home');
      return { log: PD.notify.log().length, unread: PD.notify.unread(), plan: PD.notify.plan().length };
    });
    console.log('  shown:', JSON.stringify(shown));
    // the bell on the home screen
    await p.evaluate(() => PD.app.go('home')); await p.waitForTimeout(700);
    console.log('  bell:', await p.evaluate(() => { const b2 = document.querySelector('.hx-bell'); return { there: !!b2, badge: b2 && b2.querySelector('.hx-bn') ? b2.querySelector('.hx-bn').textContent : null }; }));
    await p.screenshot({ path: OUT + lang + '_home.png', fullPage: false });
    // the inbox
    await p.evaluate(() => document.querySelector('.hx-bell').click()); await p.waitForTimeout(700);
    console.log('  inbox rows:', await p.evaluate(() => document.querySelectorAll('.nt-row').length), '| route', await p.evaluate(() => PD.app.route));
    await p.screenshot({ path: OUT + lang + '_inbox.png', fullPage: true });
    // the catch-up on opening
    const cu = await p.evaluate(() => { PD.notify.clear(); PD.store.set('notify.lastOpen', Date.now() - 5 * 864e5); PD.notify.catchUp(); return PD.notify.log().map(x => x.kind + ': ' + x.title); });
    console.log('  catch-up:', JSON.stringify(cu));
    console.log('  errs', errs);
    await p.close();
  }
  await b.close();
})();
