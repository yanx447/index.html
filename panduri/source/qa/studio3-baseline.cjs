/* Studio 3.0, phase 0: the two studios as they were before the unified Studio — screenshots and measurements of the
   AI studio (route `ai`) and Panduri Studio (route `pstudio`) at a desktop and a phone size, on a real teacher
   recording. Nothing is changed; this is the record the later screens are compared with.
   Usage: node qa/studio3-baseline.cjs [appDir=../app] [outDir=../../docs/studio3/screens/baseline] */
const path = require('node:path'), fs = require('node:fs');
const { chromium } = require('playwright');
const localApp = require('./local-app.cjs');
const ROOT = path.resolve(__dirname, '../../..');
const APP = path.resolve(process.argv[2] || path.join(__dirname, '../../app'));
const OUT = path.resolve(process.argv[3] || path.join(ROOT, 'docs/studio3/screens/baseline'));
const SONG = path.join(ROOT, 'panduri/app/media/rhythms/bani-acharuli.mp3');
fs.mkdirSync(OUT, { recursive: true });
const SIZES = [['desktop-1440', 1440, 900], ['phone-390', 390, 844]];
(async () => {
  const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required', '--use-gl=angle', '--use-angle=swiftshader'] });
  const report = [];
  for (const [name, w, hgt] of SIZES) {
    const ctx = await b.newContext({ viewport: { width: w, height: hgt }, serviceWorkers: 'block', deviceScaleFactor: 1 });
    const p = await ctx.newPage(); const errs = [];
    p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error' && !/Failed to load|net::|supabase|404/.test(m.text())) errs.push(m.text().slice(0, 160)); });
    // the repository root is served, so the app finds its models at ../ai/ as it does on the site
    await localApp(p, ROOT);
    const rel = path.relative(ROOT, APP).split(path.sep).join('/');
    await p.goto('http://panduri.test/' + rel + '/'); await p.waitForFunction(() => window.PD && PD.app); await p.waitForTimeout(900);
    await p.evaluate(() => { PD.store.set('onboarded', true); PD.store.set('intro.done', true); PD.i18n.set('en'); document.querySelectorAll('.ob,.ag,.intro,.cine,.cine-boot').forEach(o => o.remove()); });
    const measure = async label => p.evaluate(label => {
      const pg = document.getElementById('page'), vis = el => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(el).visibility !== 'hidden'; };
      const players = ['.ai-tr', '.pst-transport', '.ai-deck'].map(s => [s, [...document.querySelectorAll(s)].filter(vis).length]);
      const tabs = [...document.querySelectorAll('.apr-navigation .tab, .pst-tabs button')].filter(vis).map(x => x.textContent.trim());
      return { label, route: PD.app.route, scrollHeight: pg ? pg.scrollHeight : 0, viewport: innerHeight, screens: pg ? +(pg.scrollHeight / innerHeight).toFixed(2) : 0, overflowX: document.documentElement.scrollWidth > innerWidth + 1, players, tabs };
    }, label);
    const shot = async file => p.screenshot({ path: path.join(OUT, name + '-' + file + '.jpg'), type: 'jpeg', quality: 70 });
    // 1. the AI studio before a song is chosen
    await p.evaluate(() => PD.app.go('ai')); await p.waitForTimeout(900);
    report.push(Object.assign({ size: name }, await measure('ai: empty'))); await shot('ai-empty');
    // 2. the AI studio with a teacher recording analysed
    await p.setInputFiles('input[type=file]', SONG);
    await p.waitForSelector('.ai-facts', { timeout: 120000 }); await p.waitForTimeout(1500);
    report.push(Object.assign({ size: name }, await measure('ai: song open'))); await shot('ai-song');
    await p.evaluate(() => { const pg = document.getElementById('page'); pg.scrollTop = pg.scrollHeight; }); await p.waitForTimeout(400); await shot('ai-song-bottom');
    // 3. Panduri Studio: its five views
    await p.evaluate(() => PD.app.go('pstudio')); await p.waitForTimeout(900);
    for (const [i, v] of ['fret', 'roll', 'rhythm', 'arrange', 'mixer'].entries()) {
      await p.evaluate(i => document.querySelectorAll('.pst-tabs button')[i].click(), i); await p.waitForTimeout(450);
      report.push(Object.assign({ size: name }, await measure('pstudio: ' + v)));
      if (v === 'fret' || v === 'rhythm' || (name.startsWith('desktop') && v === 'roll')) await shot('pstudio-' + v);
    }
    report.push({ size: name, errors: errs });
    await ctx.close();
  }
  await b.close();
  fs.writeFileSync(path.join(OUT, 'baseline.json'), JSON.stringify(report, null, 1));
  console.log(JSON.stringify(report, null, 1));
})().catch(e => { console.error(e); process.exit(1); });
