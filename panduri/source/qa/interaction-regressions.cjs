// Run against `npm run dev`. Uses isolated browser storage, never a real account.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: Number(process.env.WIDTH || 1280), height: 900 }, serviceWorkers: 'block' });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(process.env.APP_URL || 'http://localhost:8181/panduri/app/');
    await page.waitForFunction(() => window.PD?.app && document.querySelector('#page'));
    await page.evaluate(() => {
      document.querySelectorAll('.lf,.ag,.ob,.cine,.cine-boot').forEach(x => x.remove());
      PD.store.set('sima.nudge', false); PD.store.set('uiSounds', false);
      document.documentElement.classList.add('rm'); PD.app.go('home', null, true);
      document.querySelector('.hq').focus();
      window.closeOuter = PD.ui.sheet(box => box.append(PD.h('h2', {text:'Outer'}), PD.h('button', {id:'outer-button',text:'Open inner'})));
      window.closeInner = PD.ui.sheet(box => box.append(PD.h('button', {id:'inner-first',text:'First'}), PD.h('button', {id:'inner-last',text:'Last'})));
    });
    await page.keyboard.press('Shift+Tab');
    assert.equal(await page.evaluate(() => document.activeElement.id), 'inner-last', 'reverse Tab wraps');
    await page.keyboard.press('Tab');
    assert.equal(await page.evaluate(() => document.activeElement.id), 'inner-first', 'Tab wraps');
    await page.keyboard.press('Escape'); await page.waitForTimeout(150);
    assert.equal(await page.locator('.sheet-back').count(), 1, 'Escape closes only the inner sheet');
    assert.equal(await page.evaluate(() => document.activeElement.id), 'outer-button', 'focus returns to outer sheet');
    assert.equal(await page.locator('.sheet').getAttribute('aria-labelledby'), await page.locator('.sheet h2').getAttribute('id'));
    await page.keyboard.press('Escape'); await page.waitForTimeout(150);
    assert.equal(await page.locator('.sheet-back').count(), 0);
    assert.equal(await page.evaluate(() => document.activeElement.classList.contains('hq')), true);
    assert.equal(await page.evaluate(() => PD.layers.depth), 0);
    // A content-only sheet still owns focus, even without buttons.
    await page.evaluate(() => PD.ui.sheet(box => box.append(PD.h('p', {text:'Information'}))));
    await page.keyboard.press('Tab');
    assert.equal(await page.evaluate(() => document.activeElement.classList.contains('sheet')), true);
    await page.keyboard.press('Escape'); await page.waitForTimeout(100);
    // Browser Back also closes just the top layer.
    await page.evaluate(() => { PD.ui.confirm('Outer', () => {}); PD.ui.confirm('Inner', () => {}); history.back(); });
    await page.waitForTimeout(150); assert.equal(await page.locator('.sheet-back').count(), 1);
    await page.keyboard.press('Escape'); await page.waitForTimeout(150);
    // The browser's cancel event must settle the picker and remove its temporary input.
    let chooser = page.waitForEvent('filechooser');
    await page.evaluate(() => { window.pickResult = 'pending'; PD.ui.pickFile('application/json').then(f => window.pickResult = f ? f.name : null); });
    const cancelled = await chooser;
    await cancelled.element().dispatchEvent('cancel');
    await page.waitForFunction(() => window.pickResult !== 'pending');
    assert.equal(await page.evaluate(() => window.pickResult), null);
    assert.equal(await page.locator('body > input[type=file]').count(), 0);
    chooser = page.waitForEvent('filechooser');
    await page.evaluate(() => { window.pickResult = 'pending'; PD.ui.pickFile('application/json').then(f => window.pickResult = f ? f.name : null); });
    await (await chooser).setFiles({name:'practice.json', mimeType:'application/json', buffer:Buffer.from('{}')});
    await page.waitForFunction(() => window.pickResult !== 'pending');
    assert.equal(await page.evaluate(() => window.pickResult), 'practice.json');
    assert.equal(await page.locator('body > input[type=file]').count(), 0);
    // Mid-animation accessibility changes stop both canvas and number animations.
    await page.evaluate(() => {
      document.documentElement.classList.remove('rm');
      const n = document.createElement('b'); n.id = 'count-test'; n.textContent = '100%'; document.body.append(n);
      PD.ui.countUp(n, 10000); PD.fx.celebrate();
    });
    await page.waitForTimeout(80);
    assert.equal(await page.locator('.fx-confetti').count(), 1);
    await page.evaluate(() => document.documentElement.classList.add('rm'));
    await page.waitForTimeout(80);
    assert.equal(await page.locator('.fx-confetti').count(), 0);
    assert.equal(await page.locator('#count-test').textContent(), '100%');
    await page.locator('.hx-goal2').hover();
    assert.equal(await page.locator('.hx-goal2').evaluate(el => el.classList.contains('fx-lit')), false);
    await page.evaluate(() => document.documentElement.classList.remove('rm'));
    await page.mouse.move(1,1); await page.locator('.hx-goal2').hover();
    assert.equal(await page.locator('.hx-goal2').evaluate(el => el.classList.contains('fx-lit')), true);
    assert.deepEqual(errors, []);
    console.log('PASS: nested Escape/Back, focus containment/restoration, dialog labels, file cancel/select/cleanup, live reduced motion. No page errors.');
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
