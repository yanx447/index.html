const { chromium } = require('/opt/node-tools/node_modules/playwright');
const CFG = { url: 'http://127.0.0.1:8899', key: 'anon-test' };
(async () => {
  await fetch('http://127.0.0.1:8899/__reset', { method: 'POST' });
  const b = await chromium.launch();
  const dev = async () => { const c = await b.newContext({ viewport: { width: 390, height: 844 } }); const p = await c.newPage(); p.on('pageerror', e => console.log('ERR', e.message));
    await p.goto('http://localhost:8765/app/'); await p.evaluate(c => { localStorage.clear(); PD.store.set('cloud.config', c); PD.store.set('onboarded', true); }, CFG); await p.reload(); await p.waitForTimeout(1200); return p; };
  const A = await dev(), B = await dev();
  // device A: sign up, play lesson x
  await A.evaluate(async () => { document.querySelector('.ag')?.remove(); await PD.cloud.auth.signUp('m@x.ge', 'password1', 'მარი'); });
  await A.evaluate(async () => { PD.lessons.progress.saveLesson('poc-three', { stages: { wait: 90 }, best: { firstTry: .9 }, mastery: .8, maxTempo: 70, last: Date.now(), plays: 3, heat: {} }); PD.lessons.progress.addSession({ id: 'poc-three', date: Date.now(), dur: 60 }); PD.store.set('xp', 120); await PD.cloud.syncProgress(); });
  // device B: guest progress on another lesson, then signs in to the same account → both kept
  await B.evaluate(async () => { document.querySelector('.ag')?.remove(); PD.lessons.progress.saveLesson('rh-down', { stages: { metro: 80 }, best: { firstTry: .8 }, mastery: .7, maxTempo: 60, last: Date.now(), plays: 2, heat: {} }); PD.lessons.progress.addSession({ id: 'rh-down', date: Date.now() + 5, dur: 30 }); PD.store.set('xp', 40); await PD.cloud.auth.signIn('m@x.ge', 'password1'); });
  await B.waitForTimeout(500);
  const view = p => p.evaluate(() => ({ three: PD.lessons.progress.lesson('poc-three').plays, down: PD.lessons.progress.lesson('rh-down').plays, sessions: PD.lessons.progress.sessions().length, xp: PD.store.get('xp', 0), owner: (PD.store.get('progress.owner', '') || '').slice(0, 6) }));
  console.log('B after sign-in (guest + account):', JSON.stringify(await view(B)));
  await A.evaluate(async () => { await PD.cloud.syncProgress(); });
  console.log('A after sync:', JSON.stringify(await view(A)));
  // B signs out, another account signs in on B: A's data is put aside, not merged into the new account
  await B.evaluate(async () => { await PD.cloud.auth.signOut(); await PD.cloud.auth.signUp('g@x.ge', 'password2', 'გიო'); });
  await B.waitForTimeout(400);
  console.log('B as another account:', JSON.stringify(await view(B)), 'stash:', await B.evaluate(() => PD.store.keys().filter(k => /^stash\./.test(k)).length));
  await B.evaluate(async () => { await PD.cloud.auth.signOut(); await PD.cloud.auth.signIn('m@x.ge', 'password1'); }); await B.waitForTimeout(400);
  console.log('B back to the first account:', JSON.stringify(await view(B)));
  // a long chat opens at the newest messages
  const ids = await A.evaluate(() => PD.cloud.uid);
  await B.evaluate(async () => { await PD.cloud.auth.signOut(); await PD.cloud.auth.signIn('g@x.ge', 'password2'); });
  const conv = await B.evaluate(async other => { const c = await PD.cloud.chat.open(other); for (let i = 1; i <= 230; i++) await PD.cloud.chat.send(c, 'msg ' + i); return c; }, ids);
  const first = await A.evaluate(async c => { const r = await PD.cloud.chat.messages(c, 0); return r.length + ' · ' + r[0].body + ' … ' + r[r.length - 1].body; }, conv);
  console.log('chat first load:', first);
  // password reset link → new-password sheet
  const tok = await A.evaluate(() => PD.cloud.session.access_token);
  await A.goto('about:blank'); await A.goto('http://localhost:8765/app/#access_token=' + tok + '&refresh_token=ref-' + tok + '&expires_in=3600&type=recovery'); await A.waitForTimeout(1800);
  console.log('recovery sheet (new load):', await A.evaluate(() => !!document.querySelector('.sheet [data-t="au.newPw"]')), 'hash cleared:', await A.evaluate(() => location.hash === ''));
  await A.evaluate(() => document.querySelectorAll('.sheet-back').forEach(x => x.remove()));
  await A.evaluate(t => { location.hash = 'access_token=' + t + '&refresh_token=ref-' + t + '&expires_in=3600&type=recovery'; }, tok); await A.waitForTimeout(600);
  console.log('recovery sheet (same tab):', await A.evaluate(() => !!document.querySelector('.sheet [data-t="au.newPw"]')));
  await A.fill('.sheet input[type=password]', 'newpass99'); await A.click('.sheet [data-t="au.pwSave"]'); await A.waitForTimeout(500);
  console.log('after save sheet gone:', await A.evaluate(() => !document.querySelector('.sheet [data-t="au.newPw"]')));
  await b.close();
})();
