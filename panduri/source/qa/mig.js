const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const p = await (await b.newContext()).newPage(); const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.goto('http://localhost:8765/panduri-app.html');
  await p.evaluate(() => { localStorage.clear(); localStorage.setItem('panduri-user-lessons', JSON.stringify([{ id: 'bani-acharuli', cat: 'song', ka: 'ბანი-აჭარული', en: 'Bani-Acharuli', bpm: 120, bpb: 6, grid: .5, user: true, link: 'x', events: [{ type: 'note', t: 0, s: 1, f: 0, fi: 0, st: 'down', d: .5, acc: true }, { type: 'note', t: .5, s: 1, f: 2, fi: 2, st: 'up', d: .5 }], sections: [] }])); });
  await p.reload(); await p.waitForTimeout(500);
  console.log(await p.evaluate(() => { const l = PD.lessons.get('bani-acharuli'); return JSON.stringify({ n: l.events.length, meter: l.meter, sec: l.sections.length, title: l.title }); }), errs);
  await b.close();
})();
