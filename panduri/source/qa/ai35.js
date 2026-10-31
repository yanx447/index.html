const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const p = await (await b.newContext({ acceptDownloads: true })).newPage();
  await p.goto('http://localhost:8770/panduri/app/'); await p.waitForTimeout(800);
  for (const nm of ['bani40 - my mix.wav', 'bani40 - ჩემი მიქსი.wav']) {
    const [dl] = await Promise.all([p.waitForEvent('download'), p.evaluate(n => { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob(['x'], { type: 'audio/wav' })); a.download = n; document.body.appendChild(a); a.click(); }, nm)]);
    console.log(JSON.stringify(nm), '→', dl.suggestedFilename());
  }
  await b.close();
})();
