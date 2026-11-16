/* Sima's check, end to end in the camera: Chrome films its fake camera and plays a WAV as the microphone, the clip
   goes through the studio (camera → editor → post), and the post screen must show Sima's verdict — Post enabled
   only when she lets it through, nothing uploaded either way.
   node qa/guard-studio.cjs <video.y4m> <mic.wav> <ok|no> [seconds] [port]   (serve.py must be running on the port) */
const { chromium } = require('playwright');
const [VID, WAV, WANT, SEC = '8', PORT = '8181'] = process.argv.slice(2);
(async () => {
  const b = await chromium.launch({ args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream', '--use-file-for-fake-video-capture=' + VID,
    '--use-file-for-fake-audio-capture=' + WAV, '--autoplay-policy=no-user-gesture-required'] });
  const c = await b.newContext({ viewport: { width: 390, height: 844 }, permissions: ['camera', 'microphone'] });
  const p = await c.newPage(); const errs = [], ups = [];
  p.on('pageerror', e => errs.push(e.message));
  p.on('request', r => { if (/\/storage\/v1\/object\/|feed_posts/.test(r.url())) ups.push(r.url()); });
  await p.goto(`http://localhost:${PORT}/panduri/app/`);
  await p.evaluate(() => { localStorage.clear(); PD.store.set('auth.skip', true); PD.store.set('onboarded', true); PD.store.set('fd.mode', 15); });
  await p.reload(); await p.waitForTimeout(1200);
  await p.evaluate(() => PD.social.studio(() => {}, () => {}));
  await p.waitForFunction(() => { const v = document.querySelector('.cam-view'); return v && v.videoWidth > 0; }, null, { timeout: 15000 });
  const modes = await p.$$eval('.cam-modes button', bs => bs.map(x => x.textContent));
  const note = await p.$eval('.cam-qnote', e => e.textContent);
  await p.click('.cam-go'); await p.waitForTimeout(+SEC * 1000); await p.click('.cam-go');
  await p.waitForFunction(() => document.querySelector('.cam').dataset.stage === 'rev', null, { timeout: 30000 });
  await p.waitForTimeout(800);
  await p.evaluate(() => { const b = [...document.querySelectorAll('.cam-rev button')].find(x => /მზადაა|Done|შემდეგ|Next/.test(x.textContent)); b && b.click(); });
  await p.waitForFunction(() => document.querySelector('.cam').dataset.stage === 'post', null, { timeout: 30000 });
  const busy = await p.evaluate(() => ({ cls: document.querySelector('.sq-card').className, dis: document.querySelector('.cam-post .btn.primary.big').disabled }));
  await p.waitForFunction(() => /\b(ok|no)\b/.test(document.querySelector('.sq-card').className), null, { timeout: 90000 });
  const r = await p.evaluate(() => ({ cls: document.querySelector('.sq-card').className, text: document.querySelector('.sq-card').innerText,
    post: !document.querySelector('.cam-post .btn.primary.big').disabled, wav: !document.querySelector('.sq-wav').hidden, wavNote: document.querySelector('.sq-wav').innerText }));
  await p.screenshot({ path: 'qa/guard-studio-' + WANT + '.png' });
  const got = /\bok\b/.test(r.cls) ? 'ok' : 'no';
  console.log(JSON.stringify({ modes, note, whileChecking: busy, got, post: r.post, wav: r.wav, wavNote: r.wavNote, uploads: ups.length, errors: errs }, null, 1));
  console.log(r.text);
  const pass = got === WANT && r.post === (WANT === 'ok') && !ups.length && !errs.length && busy.dis;
  console.log(pass ? 'PASS' : 'FAIL');
  await b.close(); process.exit(pass ? 0 : 1);
})();
