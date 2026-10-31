const { chromium } = require('/opt/node-tools/node_modules/playwright');
const OUT = '/tmp/claude-0/-home-claude-index-html/d17ed486-e6cb-5d9f-80bb-ed664a9aab9c/scratchpad/qa/';
(async () => {
  const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true });
  const p = await ctx.newPage();
  const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error' && !/fonts|ERR_|Failed to load/.test(m.text())) errs.push('C:' + m.text()); });
  await p.goto('http://localhost:8765/app/'); await p.waitForTimeout(2500);
  await p.evaluate(() => { localStorage.clear(); PD.store.set('onboarded', true); PD.store.set('auth.skip', true); document.querySelector('.ag')?.remove(); document.querySelector('.ob')?.remove(); PD.app.go('home', null, true); });
  await p.waitForTimeout(300);
  const state = () => p.evaluate(() => ({ route: PD.app.route, sheet: !!document.querySelector('.sheet-back'), practice: PD.practice.active, depth: PD.layers.depth, hl: history.length }));
  // 1 Back closes a sheet, not the page
  await p.evaluate(() => PD.app.go('settings')); await p.waitForTimeout(200);
  await p.evaluate(() => PD.ui.sheet(box => { box.append(PD.h('p', { text: 'x' })); }));
  console.log('sheet open:', JSON.stringify(await state()));
  await p.goBack(); await p.waitForTimeout(300); console.log('after Back:', JSON.stringify(await state()));
  // 2 Back closes the lesson screen
  await p.evaluate(() => PD.app.go('lesson', 'poc-three')); await p.waitForTimeout(200);
  await p.evaluate(() => PD.app.startStage(PD.lessons.get('poc-three'), 'wait')); await p.waitForTimeout(500);
  console.log('practice open:', JSON.stringify(await state()));
  await p.goBack(); await p.waitForTimeout(400); console.log('after Back:', JSON.stringify(await state()), 'mic:', await p.evaluate(() => PD.detector.active));
  // 3 a sheet closed by its own button, then Back → previous page
  await p.evaluate(() => PD.ui.sheet((box, close) => { box.append(PD.h('button', { id: 'xx', text: 'ok', onclick: close })); })); await p.click('#xx'); await p.waitForTimeout(200);
  await p.goBack(); await p.waitForTimeout(400); console.log('closed sheet, Back:', JSON.stringify(await state()));
  await p.goBack(); await p.waitForTimeout(400); console.log('Back again:', JSON.stringify(await state()));
  // 4 the same tab twice adds no entry
  const h0 = await p.evaluate(() => history.length); await p.evaluate(() => { PD.app.go('learn'); PD.app.go('learn'); }); console.log('history +', await p.evaluate(h => history.length - h, h0));
  // 5 premium: intermediate lesson from anywhere → paywall; Bani free
  await p.evaluate(() => PD.app.startStage(PD.lessons.get('m2'), 'wait')); await p.waitForTimeout(300);
  console.log('m2 →', await p.evaluate(() => ({ practice: PD.practice.active, paywall: !!document.querySelector('.sheet.pw') })));
  await p.keyboard.press('Escape'); await p.waitForTimeout(200);
  await p.evaluate(() => PD.app.startStage(PD.lessons.get('bani-acharuli'), 'slow')); await p.waitForTimeout(500);
  console.log('bani →', await p.evaluate(() => ({ practice: PD.practice.active })));
  await p.evaluate(() => PD.practice.close()); await p.waitForTimeout(200);
  // 6 export leaves tokens out
  await p.evaluate(() => { PD.store.set('cloud.session', { access_token: 'secret' }); PD.store.set('auth.phone', '+995'); });
  console.log('export keys with cloud/auth:', await p.evaluate(() => Object.keys(PD.store.exportAll()).filter(k => /^(cloud|auth)\./.test(k))));
  await p.evaluate(() => { PD.store.del('cloud.session'); PD.store.importAll({ 'cloud.config': { url: 'https://evil' }, xp: 5 }); });
  console.log('import cloud.config:', await p.evaluate(() => PD.store.get('cloud.config', null)), 'xp', await p.evaluate(() => PD.store.get('xp', 0)));
  // 7 chord spelling
  console.log('spell:', await p.evaluate(() => { const T = PD.theory, R = n => T.ROOTS.indexOf(n), sp = (r, q, ivs) => ivs.map(i => T.spell(57 + 4 + i, R(r), q).name).join(' '); return [sp('C♯', 'm', [0, 3, 7]), sp('C♯', '7', [0, 4, 7, 10]), sp('B♭', '', [0, 4, 7]), sp('C', 'dim7', [-1, 2, 5, 8]), sp('A♭', '', [0, 4, 7])].join(' | '); }));
  // 8 theory: quiz options in English, intervals
  await p.evaluate(() => { PD.i18n.set('en'); PD.app.go('theory', 'accidentals'); }); await p.waitForTimeout(400);
  console.log('quiz opts (en):', await p.evaluate(() => [...document.querySelectorAll('.tb-opts button')].slice(0, 6).map(b => b.textContent).join(' / ')));
  await p.evaluate(() => PD.app.go('theory', 'intervals')); await p.waitForTimeout(300);
  console.log('m2 from A:', await p.evaluate(() => [...document.querySelectorAll('td')].filter(td => /^A → /.test(td.textContent)).slice(0, 3).map(td => td.textContent).join(', ')));
  await p.evaluate(() => PD.app.go('theory', 'neck')); await p.waitForTimeout(300);
  console.log('markers:', await p.evaluate(() => [...document.querySelectorAll('.notice')].map(n => n.textContent).find(x => /marker/i.test(x))));
  await p.evaluate(() => PD.app.go('theory', 'durations')); await p.waitForTimeout(300);
  await p.screenshot({ path: OUT + 'durations.png', fullPage: false });
  // 9 settings account rows
  await p.evaluate(() => PD.app.go('settings')); await p.waitForTimeout(300);
  console.log('account rows:', await p.evaluate(() => [...document.querySelectorAll('.set-sec .li')].filter(li => /Account|Sync|Subscription/.test(li.textContent)).map(li => li.textContent.slice(0, 80)).join(' || ')));
  // 10 TV: arrows reach the bottom of Learn
  await p.setViewportSize({ width: 1280, height: 720 });
  await p.evaluate(() => { PD.store.set('remoteNav', true); PD.app.go('learn'); }); await p.waitForTimeout(400);
  for (let i = 0; i < 40; i++) await p.keyboard.press('ArrowDown');
  await p.waitForTimeout(600);
  console.log('TV down x40: scrollY', await p.evaluate(() => Math.round(scrollY)), 'focus', await p.evaluate(() => (document.activeElement.textContent || '').slice(0, 40)));
  console.log('ERRS', JSON.stringify(errs));
  await b.close();
})();
