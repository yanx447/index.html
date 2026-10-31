const { chromium } = require('/opt/node-tools/node_modules/playwright');
const fs = require('fs');
(async () => {
  const src = fs.readFileSync('/home/claude/pd/src/songdata.js', 'utf8'); const beats = src.match(/beats: \[([\s\S]*?)\]/)[1].split(',').map(Number).filter(x => !isNaN(x));
  const b = await chromium.launch(); const p = await (await b.newContext()).newPage();
  await p.goto('http://localhost:8770/panduri/app/'); await p.waitForTimeout(1200);
  const variants = JSON.parse(process.argv[2] || '[{}]');
  const r = await p.evaluate(async ([beats, variants]) => {
    const buf = await (await fetch('/panduri/ai-build/eval-mono22.wav')).arrayBuffer(); const oc = new OfflineAudioContext(1, 22050, 22050); const ab = await oc.decodeAudioData(buf); const x = ab.getChannelData(0);
    const CY = [[2, 'm'], [2, 'm'], [10, ''], [0, '']];   // Dm Dm B♭ C
    const truth = t => { let k = 0; while (k < beats.length - 1 && beats[k + 1] <= t) k++; return t < beats[0] || k >= 464 ? null : CY[k % 4]; };
    const out = [];
    for (const v of variants) {
      const res = await PD.ai.analyse(x, 22050, null, v);
      let ok = 0, n = 0; for (let t = 0; t < res.dur; t += .1) { const tr = truth(t - (v.sh || 0)); if (!tr) continue; n++; const c = res.chords.find(c => t >= c.t0 && t < c.t1); if (c && c.root === tr[0] && c.q === tr[1]) ok++; }
      const names = {}; res.chords.forEach(c => { const k = c.root + c.q; names[k] = (names[k] || 0) + (c.t1 - c.t0); });
      out.push({ v, acc: (ok / n * 100).toFixed(1) + '%', key: res.key.r + res.key.q, bpm: res.bpm, segs: res.chords.length, top: Object.entries(names).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([k, d]) => k + ':' + d.toFixed(0) + 's').join(' ') });
    }
    return out;
  }, [beats, variants]);
  r.forEach(x => console.log(JSON.stringify(x)));
  await b.close();
})();
