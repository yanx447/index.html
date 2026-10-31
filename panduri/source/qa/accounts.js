const { chromium } = require('/opt/node-tools/node_modules/playwright');
const CFG = { url: 'http://127.0.0.1:8899', key: 'anon-test' };
(async () => {
  await fetch('http://127.0.0.1:8899/__reset', { method: 'POST' });
  const b = await chromium.launch({ args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream'] });
  const mk = async () => { const c = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, permissions: ['camera', 'microphone'] }); const p = await c.newPage(); p.on('pageerror', e => console.log('ERR', e.message)); p.on('console', m => { if (m.type() === 'error' && !/fonts|ERR_/.test(m.text())) console.log('CERR', m.text()); });
    await p.goto('http://localhost:8765/app/'); await p.evaluate(c => { localStorage.clear(); PD.store.set('cloud.config', c); }, CFG); await p.reload(); await p.waitForTimeout(800); return p; };
  const A = await mk();
  await A.screenshot({ path: 'qa/a-gate.png' });
  console.log('gate shown:', await A.evaluate(() => !!document.querySelector('.ag')), 'configured:', await A.evaluate(() => PD.cloud.configured));
  // email sign-up
  await A.click('.ag-btn.mail'); await A.waitForTimeout(200);
  await A.click('.ag-tabs button:nth-child(2)'); await A.waitForTimeout(200);
  await A.fill('.ag-form input[autocomplete=name]', 'ნუკრი'); await A.fill('.ag-form input[type=email]', 'nukri@test.ge'); await A.fill('.ag-form input[type=password]', 'panduri123');
  await A.screenshot({ path: 'qa/a-signup.png' });
  await A.click('.ag-form button[type=submit]'); await A.waitForTimeout(1200);
  console.log('after signup: gate', await A.evaluate(() => !!document.querySelector('.ag')), 'uid', await A.evaluate(() => PD.cloud.uid && PD.cloud.uid.slice(0, 8)), 'admin', await A.evaluate(() => PD.cloud.isAdmin), 'name', await A.evaluate(() => PD.cloud.profile && PD.cloud.profile.display_name));
  await A.evaluate(() => { document.querySelector('.ob')?.remove(); PD.store.set('onboarded', true); PD.app.go('profile'); }); await A.waitForTimeout(500); await A.screenshot({ path: 'qa/a-profile.png' });
  // second learner (phone sign-in)
  const B = await mk();
  await B.click('.ag-btn.phone'); await B.waitForTimeout(200); await B.fill('.ag-card input[type=tel]', '+995 599 123 456'); await B.click('.ag-card .btn.primary'); await B.waitForTimeout(500);
  await B.screenshot({ path: 'qa/a-code.png' });
  await B.fill('.ag-code', '123456'); await B.click('.ag-card .btn.primary'); await B.waitForTimeout(1000);
  console.log('B signed in by phone:', await B.evaluate(() => !!PD.cloud.session), 'gate', await B.evaluate(() => !!document.querySelector('.ag')));
  await B.evaluate(() => { document.querySelector('.ob')?.remove(); PD.store.set('onboarded', true); PD.store.set('cm.tab', 'chats'); PD.app.go('community'); }); await B.waitForTimeout(600);
  await B.screenshot({ path: 'qa/a-name.png' });
  await B.fill('.cm-name input', 'გიორგი'); await B.click('.cm-name .btn'); await B.waitForTimeout(700);
  console.log('B name prompt gone:', await B.evaluate(() => !document.querySelector('.cm-name')), 'local name:', await B.evaluate(() => PD.account.profile.name));
  // B writes to A through People
  await B.evaluate(() => { PD.store.set('cm.tab', 'people'); PD.app.go('community'); }); await B.waitForTimeout(900); await B.screenshot({ path: 'qa/a-people.png' });
  await B.click('.cm-row .btn'); await B.waitForTimeout(800);
  await B.fill('.cm-in', 'გამარჯობა! Dm-ზე ბარე როგორ დავიჭირო?'); await B.click('.cm-bar .btn'); await B.waitForTimeout(800);
  await A.evaluate(() => { PD.store.set('cm.tab', 'chats'); PD.app.go('community'); }); await A.waitForTimeout(900); await A.screenshot({ path: 'qa/a-chats.png' });
  await A.click('.cm-row'); await A.waitForTimeout(900); await A.fill('.cm-in', 'პირველ ლადზე საჩვენებელი თითით — შუა და ქვედა სიმი.'); await A.click('.cm-bar .btn'); await A.waitForTimeout(3200);
  console.log('B sees messages:', await B.evaluate(() => [...document.querySelectorAll('.cm-msg p')].map(x => x.textContent).join(' | ')));
  await B.screenshot({ path: 'qa/a-chat.png' });
  // help board
  await B.evaluate(() => { PD.store.set('cm.tab', 'help'); PD.app.go('community'); }); await B.waitForTimeout(500);
  await B.evaluate(async () => { await PD.cloud.board.post('როგორ ავაწყო ფანდური?', 'A · C# · E — სად შევამოწმო?'); PD.app.render(); }); await B.waitForTimeout(800); await B.screenshot({ path: 'qa/a-help.png' });
  // admin grants VIP to B
  await A.evaluate(() => PD.app.go('profile')); await A.waitForTimeout(400);
  await A.evaluate(() => PD.premium.admin()); await A.waitForTimeout(900); await A.screenshot({ path: 'qa/a-admin.png' });
  await A.evaluate(() => { const u = [...document.querySelectorAll('.adm-u')].find(x => /გიორგი/.test(x.textContent)); u.querySelector('.adm-act .btn:nth-child(2)').click(); }); await A.waitForTimeout(900);
  await B.evaluate(async () => { await PD.cloud.loadProfile(); PD.app.go('profile'); }); await B.waitForTimeout(500);
  console.log('B premium:', await B.evaluate(() => [PD.premium.active, PD.premium.vip, PD.premium.until && PD.premium.until.getFullYear()]));
  await B.screenshot({ path: 'qa/a-vip.png' });
  // paywall for a non-premium action on A? A is admin → premium; show paywall screen anyway
  await A.evaluate(() => { document.querySelector('.sheet-back')?.click(); }); await A.waitForTimeout(300);
  await A.evaluate(() => PD.premium.paywall('paths.advanced')); await A.waitForTimeout(500); await A.screenshot({ path: 'qa/a-paywall.png' });
  // progress sync row exists
  console.log('progress rows on server:', await A.evaluate(async () => (await PD.cloud.db.select('progress', { user_id: 'eq.' + PD.cloud.uid })).length));
  // video call A -> B
  await A.evaluate(() => document.querySelector('.sheet-back')?.click());
  const conv = await A.evaluate(async () => { const rows = await PD.cloud.chat.list(); return rows[0].id; });
  await A.evaluate(c => PD.call.start(c, 'გიორგი'), conv); await A.waitForTimeout(6500);
  await B.screenshot({ path: 'qa/a-ring.png' });
  const rung = await B.evaluate(() => !!document.querySelector('.ring'));
  console.log('B sees ring:', rung);
  if (rung) { await B.click('.ring .btn.primary'); await B.waitForTimeout(6000); }
  console.log('call states A/B:', await A.evaluate(() => PD.call.active && document.querySelector('.call-st small').textContent), '/', await B.evaluate(() => PD.call.active && document.querySelector('.call-st small').textContent));
  console.log('pc:', await A.evaluate(() => { const v = document.querySelector('.call-r'); return v && v.srcObject ? 'remote stream' : 'no remote'; }), await B.evaluate(() => { const v = document.querySelector('.call-r'); return v && v.srcObject ? 'remote stream' : 'no remote'; }));
  await A.screenshot({ path: 'qa/a-call.png' });
  // B deletes the account from Profile
  await B.evaluate(() => { PD.call.active && PD.call.hangup && PD.call.hangup(); document.querySelectorAll('.call,.sheet-back').forEach(x => x.remove()); PD.app.go('profile'); }); await B.waitForTimeout(500);
  await B.click('.btn.danger'); await B.waitForTimeout(300); await B.screenshot({ path: 'qa/a-delete.png' });
  await B.click('.sheet .btn.primary, .sheet .btn.danger, .modal .btn.primary').catch(e => console.log('confirm click', e.message)); await B.waitForTimeout(900);
  console.log('B after delete: session', await B.evaluate(() => !!PD.cloud.session), '| A people:', await A.evaluate(async () => (await PD.cloud.people('')).map(p => p.display_name).join(',') || 'nobody'));
  await b.close();
})();
