/* Settings › Advanced (Premium management, author mode, the update announcement, the developer's switches) is the
   owner's alone: it shows for the account the server's is_owner() names, and for nobody else — not signed out, not
   another member, not another account that signs in on a device where the owner's profile is still cached.
   On a development copy on this computer (localhost) the developer's switches stay, so QA and local work keep them.
   The server is not reached here (every https request is refused): the owner flag is the one PD.cloud keeps.
   Usage: python3 build.py && node qa/owner-only-settings.cjs */
const fs = require('fs'), path = require('path'), assert = require('assert/strict');
const { chromium } = require('playwright');
const ROOT = path.resolve(__dirname, '../../..'), APP = path.resolve(process.env.APPDIR || path.join(ROOT, 'panduri/source/dist/app'));
const SECTIONS = ['pa.title', 'set.author', 'up.title', 'set.dev'];

async function open(b, host, seed) {
  const ctx = await b.newContext({ viewport: { width: 1280, height: 900 }, serviceWorkers: 'block' });
  await ctx.route('https://**/*', r => r.abort());
  await ctx.route(`http://${host}/**`, async r => {
    const u = decodeURIComponent(new URL(r.request().url()).pathname).replace(/^\/app/, ''); const f = path.join(APP, u.endsWith('/') ? u + 'index.html' : u);
    if (!f.startsWith(APP) || !fs.existsSync(f)) return r.fulfill({ status: 404, body: '' }); return r.fulfill({ path: f });
  });
  await ctx.addInitScript(s => { if (sessionStorage.seeded) return; sessionStorage.seeded = 1; localStorage.clear();
    const S = (k, v) => localStorage.setItem('pd2:' + k, JSON.stringify(v));
    S('onboarded', true); S('intro.done', true); S('lang', 'en'); S('auth.skip', true);
    if (s.session) S('cloud.session', s.session); if (s.profile) S('cloud.profile', s.profile); }, seed);
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto(`http://${host}/app/`); await p.waitForFunction(() => window.PD && PD.app && PD.cloud);
  await p.evaluate(() => { document.querySelectorAll('.ob,.ag,.intro,.cine,.cine-boot,.lf').forEach(o => o.remove()); PD.app.go('settings'); });
  await p.waitForFunction(() => document.querySelectorAll('#main > .page').length === 1 && document.querySelector('#page .settings-nav'), null, { timeout: 10000 });
  const r = await p.evaluate(secs => ({
    owner: PD.cloud.isOwner, uid: PD.cloud.uid,
    tabs: [...document.querySelectorAll('#page .settings-nav button')].map(b => b.textContent),
    sections: secs.filter(k => document.querySelector(`#page .set-sec > h2[data-t="${k}"]`)) }), SECTIONS);
  r.errors = errs; await ctx.close(); return r;
}
const far = Math.floor(Date.now() / 1000) + 86400 * 30;
const session = id => ({ access_token: 'test', refresh_token: 'test', expires_at: far, user: { id } });
(async () => {
  const b = await chromium.launch({ headless: true }); let failed = 0;
  const check = async (name, host, seed, want) => {
    try {
      const r = await open(b, host, seed);
      assert.deepEqual(r.sections, want.sections, 'sections ' + JSON.stringify(r));
      assert.equal(r.tabs.includes('Advanced'), want.tab, 'Advanced tab ' + JSON.stringify(r.tabs));
      assert.equal(r.owner, want.owner); assert.deepEqual(r.errors, []);
      console.log('✓ ' + name + '  ' + JSON.stringify({ owner: r.owner, advanced: r.tabs.includes('Advanced'), sections: r.sections }));
    } catch (e) { failed++; console.log('✗ ' + name + '\n    ' + e.message.slice(0, 400)); }
  };
  const none = { sections: [], tab: false, owner: false };
  await check('signed out: no Advanced tab, no owner section', 'panduri.test', {}, none);
  await check('a member who is not the owner: none of it', 'panduri.test', { session: session('U1'), profile: { id: 'U1', owner: false, role: 'user' } }, none);
  await check('an admin who is not the owner: none of it either', 'panduri.test', { session: session('U1'), profile: { id: 'U1', owner: false, role: 'admin' } }, none);
  await check('the owner: Advanced with Premium management, author mode, the announcement, the developer', 'panduri.test', { session: session('U1'), profile: { id: 'U1', owner: true, role: 'user' } }, { sections: SECTIONS, tab: true, owner: true });
  await check('another account on a device where the owner\'s profile is still cached: none of it', 'panduri.test', { session: session('U2'), profile: { id: 'U1', owner: true, role: 'user' } }, none);
  await check('a development copy on localhost, signed out: only the developer\'s switches', 'localhost:8999', {}, { sections: ['set.dev'], tab: true, owner: false });
  await b.close(); console.log(failed ? failed + ' failed' : 'owner-only-settings: all as expected'); process.exitCode = failed ? 1 : 0;
})().catch(e => { console.error(e); process.exit(1); });
