const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const p = await (await b.newContext()).newPage();
  p.on('pageerror', e => console.log('ERR', e.message));
  await p.goto('http://localhost:8766/dist/app/'); await p.waitForTimeout(1200);
  const out = await p.evaluate(async url => {
    const ab0 = await (await fetch(url)).arrayBuffer(); const ac = new AudioContext(); const ab = await ac.decodeAudioData(ab0); ac.close();
    const oc = new OfflineAudioContext(1, Math.ceil(ab.duration * 22050), 22050), s = oc.createBufferSource(); s.buffer = ab; s.connect(oc.destination); s.start();
    const mono = (await oc.startRendering()).getChannelData(0).subarray(0, 22050 * 30);
    const res = [];
    for (const o of [0, .2, .35]) for (const lo of [55, 57]) {
      const tr = await PD.aimus.transcribeAsync(mono, 22050, { oct: o, lo, hi: 84 }, null);
      PD.aimus.mapNotes(tr.notes);
      const pcs = {}; tr.notes.forEach(n => { pcs[n.m] = (pcs[n.m] || 0) + (n.t1 - n.t0); });
      res.push({ oct: o, lo, n: tr.notes.length, reach: tr.notes.filter(x => x.reach).length,
        span: [Math.min(...tr.notes.map(x => x.m)), Math.max(...tr.notes.map(x => x.m))],
        top: Object.entries(pcs).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([m, d]) => PD.theory.name(+m) + ':' + d.toFixed(1)),
        first: tr.notes.slice(0, 10).map(n => PD.theory.name(n.m)).join(' ') });
    }
    return res;
  }, 'http://localhost:8766/media/bani/music.mp3');
  out.forEach(r => console.log(JSON.stringify(r)));
  await b.close();
})();
