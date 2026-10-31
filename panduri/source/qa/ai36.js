const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ args: ['--js-flags=--max-old-space-size=4096'] });
  const p = await (await b.newContext()).newPage();
  p.on('pageerror', e => console.log('PAGEERR', e.message)); p.on('console', m => { const x = m.text(); if (!/ERR_TUNNEL|fonts/.test(x)) console.log('C', x.slice(0, 200)); });
  await p.goto('http://localhost:8770/panduri/app/'); await p.waitForTimeout(1500);
  const r = await p.evaluate(async () => {
    const dec = async u => { const buf = await (await fetch(u)).arrayBuffer(); const oc = new OfflineAudioContext(2, 44100, 44100); return await oc.decodeAudioData(buf); };
    const mix = await dec('/panduri/ai-build/test.wav');
    const w = new Worker(URL.createObjectURL(new Blob(['(' + AIW.toString() + ')()'], { type: 'text/javascript' })));
    const log = []; const t0 = Date.now();
    const out = await new Promise(res => { w.onmessage = e => { const m = e.data; if (m.type === 'ready') { log.push('ready ' + (Date.now() - t0) + 'ms ' + JSON.stringify(m.inputs) + JSON.stringify(m.outputs)); w.postMessage({ cmd: 'separate', L: mix.getChannelData(0), R: mix.getChannelData(1) }); } else if (m.type === 'progress') log.push('seg ' + m.done + '/' + m.total + ' ' + (Date.now() - t0) + 'ms'); else if (m.type === 'done' || m.type === 'error') res(m); else if (m.type === 'selftest') log.push(JSON.stringify(m)); }; w.postMessage({ cmd: 'selftest' }); w.postMessage({ cmd: 'load', base: PD.ai.BASE, prefer: 'wasm', dir: 'model6' }); });
    if (out.type === 'error') return { log, err: out.msg };
    const res = {};
    for (let s = 0; s < out.sources.length; s++) { const ref = await dec('/panduri/ai/ref6/ref-' + out.sources[s] + '.wav'); let num = 0, den = 0; for (let c = 0; c < 2; c++) { const a = out.stems[s][c], r2 = ref.getChannelData(c); for (let i = 0; i < r2.length; i++) { num += r2[i] * r2[i]; den += (a[i] - r2[i]) ** 2; } } res[out.sources[s]] = (10 * Math.log10(num / (den + 1e-12))).toFixed(1) + ' dB'; }
    return { log, base: PD.ai.BASE, sdrVsReference: res };
  });
  console.log(JSON.stringify(r, null, 1));
  await b.close();
})();
