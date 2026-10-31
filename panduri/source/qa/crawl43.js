const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const out = [];
  for (const [vw, vh] of [[390, 844], [1280, 800]]) for (const lang of ['ka', 'en']) {
    const p = await (await b.newContext({ viewport: { width: vw, height: vh } })).newPage();
    let cur = '';
    p.on('pageerror', e => out.push(`${lang}@${vw} ${cur} PAGEERROR ${e.message}`));
    p.on('console', m => { if (m.type() === 'error' && !/Failed to load resource|ERR_TUNNEL|fonts\.g/.test(m.text())) out.push(`${lang}@${vw} ${cur} CONSOLE ${m.text().slice(0, 160)}`); });
    await p.goto('http://localhost:8766/dist/app/'); await p.waitForTimeout(1500);
    const routes = await p.evaluate(l => { localStorage.clear(); PD.store.set('onboarded', true); PD.store.set('auth.skip', true); document.querySelector('.ag')?.remove(); document.querySelector('.ob')?.remove(); PD.i18n.set(l);
      const r = ['home', 'learn', 'songs', 'practice', 'profile', 'progress', 'settings', 'theory', 'tips', 'chords', 'fretboard', 'explore', 'trainer', 'rhythms', 'metronome', 'daily', 'community'];
      PD.theoryBook.CHAPTERS.forEach(c => r.push('theory:' + c.id)); PD.tips.all().forEach(c => r.push('tips:' + c.id));
      ['hear', 'iv', 'sing'].forEach(e => [1, 2, 3].forEach(n => r.push('solfege:' + e + ':' + n)));
      PD.lessons.all.forEach(x => r.push('lesson:' + x.id)); (PD.lessons.rhythmLessons ? PD.lessons.rhythmLessons() : []).forEach(x => r.push('rhythm:' + x.id.replace(/^rhythm-/, '')));
      return r.filter(x => /^(home|learn|practice|rhythms|tips|theory)$|tips:|rhythm:g-|rhythm:kaz/.test(x)); }, lang);
    for (const r of routes) {
      cur = r; const [route, ...rest] = r.split(':'); const param = rest.join(':') || null;
      await p.evaluate(([a, b]) => PD.app.go(a, b), [route, param]); await p.waitForTimeout(r.startsWith('explore') ? 1500 : 700);
      const res = await p.evaluate(() => {
        const page = document.querySelector('#page'); if (!page) return ['NO PAGE'];
        const bad = []; const W = innerWidth;
        if (page.scrollWidth > page.clientWidth + 2) bad.push('H-OVERFLOW ' + page.scrollWidth + '>' + page.clientWidth);
        const walker = document.createTreeWalker(page, NodeFilter.SHOW_TEXT); let n; const keys = new Set();
        while ((n = walker.nextNode())) { const s = n.nodeValue.trim(); if (/^[a-z][a-zA-Z0-9]*\.[a-zA-Z0-9.]+$/.test(s) && !/^\d/.test(s)) keys.add(s); if (/undefined|NaN|\[object/.test(s)) bad.push('TEXT "' + s.slice(0, 60) + '"'); }
        keys.forEach(k => bad.push('RAWKEY ' + k));
        page.querySelectorAll('[data-t]').forEach(e => { if (e.textContent.trim() === e.dataset.t) bad.push('RAWKEY ' + e.dataset.t); });
        page.querySelectorAll('img').forEach(i => { if (i.complete && i.naturalWidth === 0 && i.getAttribute('src')) bad.push('BROKEN IMG ' + i.getAttribute('src').slice(0, 60)); });
        [...page.querySelectorAll('button, a, h1, h2, h3, p, b, small, span')].forEach(e => { const r = e.getBoundingClientRect(); if (r.width > 0 && r.right > W + 2 && getComputedStyle(e).position !== 'fixed' && !e.closest('.tp-scroll,.chips-row,.seg,.ce-chips,.lib-row,.tb-tw,.hx-rail,[class*=scroll],.hrow,.sf-tabs')) bad.push('OFFSCREEN ' + e.tagName + '.' + (e.className || '').toString().slice(0, 30) + ' "' + e.textContent.trim().slice(0, 30) + '" right=' + Math.round(r.right)); });
        if (!page.querySelector('h1,h2')) bad.push('NO HEADING');
        return [...new Set(bad)].slice(0, 8);
      });
      res.forEach(x => out.push(`${lang}@${vw} ${r} ${x}`));
    }
    await p.close();
  }
  console.log(out.length + ' issues'); console.log(out.join('\n'));
  await b.close();
})();
