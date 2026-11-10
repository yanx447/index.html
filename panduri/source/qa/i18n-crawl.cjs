// Walks the screens in one language and lists visible text that did not go through the translation layer.
// node qa/i18n-crawl.cjs <code> [--pseudo]   against `python3 serve.py 8181`-style server at APP_URL.
// --pseudo builds on a pack where every string starts with ᐅ, so anything without the mark is a gap.
const { chromium } = require('playwright');
const APP = process.env.APP_URL || 'http://localhost:8766/dist/app/';
const code = process.argv[2] || 'ru', W = +process.env.W || 390, H = +process.env.H || 844;
const ROUTES = [['home'], ['learn'], ['chords'], ['practice'], ['rhythms'], ['rhythm', 'khorumi'], ['theory'], ['theory', 'meter'], ['tips'], ['tips', 'tune'], ['solfege'], ['scales'], ['chordhow'], ['music'], ['music', '12bar'], ['music', 'geo'], ['book'], ['book', 'tuner'], ['install'], ['progress'], ['settings'], ['songs'], ['library'], ['exams'], ['metronome'], ['fretboard'], ['explore'], ['profile'], ['daily'], ['trainer']];
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const errs = [], report = {};
  for (const [r, p] of ROUTES) {
    // a fresh context per route: closed pages otherwise keep media connections and starve the next load
    const ctx = await b.newContext({ viewport: { width: W, height: H }, serviceWorkers: 'block', locale: 'en-US' });
      await ctx.addInitScript(c => { if (sessionStorage.seeded) return; sessionStorage.seeded = 1; localStorage.clear(); const S = (k, v) => localStorage.setItem('pd2:' + k, JSON.stringify(v)); S('lang', c); S('onboarded', true); S('auth.skip', true); S('cine', false); S('uiSounds', false); }, code);
    const page = await ctx.newPage();
    page.on('pageerror', e => errs.push(r + ': ' + e.message));
    process.stderr.write(r + (p ? '/' + p : '') + ' ');
    await page.goto(APP); await page.waitForSelector('#page', { state: 'attached', timeout: 25000 }); await page.waitForTimeout(400);
    await page.evaluate(([r, p]) => { document.querySelectorAll('.ag, .ag-root, .auth-gate, .ob, .lf').forEach(e => e.remove()); PD.app.go(r, p); }, [r, p]); await page.waitForTimeout(1200);
    const res = await page.evaluate(pseudo => {
      const clip = []; document.querySelectorAll('#page svg text').forEach(el => { const svg = el.ownerSVGElement, vb = svg && svg.viewBox && svg.viewBox.baseVal; if (!vb || !vb.width || !el.textContent.trim() || !el.getClientRects().length) return; let b; try { b = el.getBBox(); } catch (_) { return; } if (b.x < vb.x - 1 || b.x + b.width > vb.x + vb.width + 1) clip.push(el.textContent.trim().slice(0, 50) + ' [' + Math.round(b.width) + '/' + vb.width + ']'); });
      const root = document.getElementById('page') || document.body, gaps = new Set();
      const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      let n; while ((n = w.nextNode())) { const s = n.data.trim(); if (!s || !/\p{L}{3}/u.test(s) || s.includes('ᐅ')) continue; if (!pseudo && !/[\u10D0-\u10FF]|[A-Za-z]{3}/.test(s)) continue; const pe = n.parentElement; if (!pe || pe.closest('script,style') || !pe.getClientRects().length) continue; if (/^[A-G][♯♭]?(m|maj|dim|aug|sus|add|\(|7)/.test(s)) continue; gaps.add(s.slice(0, 90)); }
      return { gaps: [...gaps], raw: [...document.querySelectorAll('[data-t]')].filter(e => e.textContent.trim() === e.dataset.t).map(e => e.dataset.t), over: root.scrollWidth > innerWidth + 1, clip };
    }, code === 'xx');
    report[r + (p ? '/' + p : '')] = res;
    await ctx.close();
  }
  const all = new Map(); for (const [k, v] of Object.entries(report)) v.gaps.forEach(g => { if (!all.has(g)) all.set(g, k); });
  console.log('errors', errs.length, errs.slice(0, 5));
  console.log('raw keys', Object.entries(report).filter(([, v]) => v.raw.length).map(([k, v]) => k + ':' + v.raw.join(',')));
  console.log('overflow', Object.entries(report).filter(([, v]) => v.over).map(([k]) => k));
  console.log('svg text past its drawing', Object.entries(report).filter(([, v]) => v.clip.length).map(([k, v]) => k + ': ' + v.clip.join(' | ')));
  console.log('gaps', all.size); for (const [g, k] of all) console.log(' ', k.padEnd(14), g);
  await b.close();
})();
