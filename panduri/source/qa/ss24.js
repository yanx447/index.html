const { chromium } = require('/opt/node-tools/node_modules/playwright');
const OUT = '/tmp/claude-0/-home-claude/d17ed486-e6cb-5d9f-80bb-ed664a9aab9c/scratchpad/qa/';
(async () => {
  const b = await chromium.launch({ args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream'] });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1.5, permissions: ['microphone'] });
  const p = await ctx.newPage();
  p.on('pageerror', e => console.log('ERR', e.message));
  await p.goto('http://localhost:8765/app/'); await p.waitForTimeout(1500);
  await p.evaluate(() => { localStorage.clear(); PD.store.set('onboarded', true); PD.store.set('auth.skip', true); document.querySelector('.ag')?.remove(); document.querySelector('.ob')?.remove(); PD.app.go('practice'); });
  await p.waitForTimeout(800);
  await p.evaluate(() => PD.app.go('tuner')); await p.waitForTimeout(3500);
  const fr = p.frames().find(f => f.url().includes('/tuner/'));
  console.log('frame', !!fr, fr && await fr.evaluate(() => [document.title, !!window.__panduri]));
  await p.screenshot({ path: OUT + 'ss-open.png' });
  if (fr) { await fr.click('#micBtn').catch(e => console.log('mic', e.message.slice(0, 80))); await p.waitForTimeout(700); await fr.click('#micGo').catch(() => {}); await p.waitForTimeout(2000); console.log('running', await fr.evaluate(() => window.__panduri.running)); await p.screenshot({ path: OUT + 'ss-mic.png' }); }
  await p.goBack(); await p.waitForTimeout(600);
  console.log('after back: open?', await p.evaluate(() => PD.samiSimi.isOpen), 'route page', await p.evaluate(() => document.querySelector('#page h1')?.textContent));
  await b.close();
})();
