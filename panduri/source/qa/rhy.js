const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const p = await (await b.newContext()).newPage();
  p.on('pageerror', e => console.log('PE', e.message));
  await p.goto('http://localhost:8766/dist/app/'); await p.waitForTimeout(1200);
  const r = await p.evaluate(async url => {
    const ab0 = await (await fetch(url)).arrayBuffer(); const ac = new AudioContext(); const ab = await ac.decodeAudioData(ab0); ac.close();
    const oc = new OfflineAudioContext(1, Math.ceil(ab.duration * 22050), 22050), s = oc.createBufferSource(); s.buffer = ab; s.connect(oc.destination); s.start();
    const mono = (await oc.startRendering()).getChannelData(0);
    const a = await PD.ai._analyse(mono, 22050, null, {});
    const bt = await PD.ai._beatsOf(mono, 22050, a.bpm, a.chords);
    const t0 = performance.now();
    const on = PD.aimus.onsets(mono, 22050);
    const known = PD.curriculum.rhythms().concat(PD.curriculum.commonRhythms());
    const mt = PD.aimus.metre(bt.beats, on.env, on.dt, on.t0off, a.chords);
    const R = PD.aimus.rhythm(on, bt.beats, mt, known);
    return { ms: Math.round(performance.now() - t0), metre: mt.num + '/' + mt.den, sub: R.sub, span: R.span, bars: R.bars, conf: R.conf,
      pattern: R.cells.map(c => c.on ? (c.acc ? 'X' : 'x') : c.weak ? '-' : '·').join(''), v: R.cells.map(c => c.v).join(' '), cons: R.cells.map(c => c.cons).join(' '),
      matches: R.matches.map(m => m.name.ka + ' ' + m.score + ' (' + m.strokes.length + ')') };
  }, 'http://localhost:8766/media/bani/music.mp3');
  console.log(JSON.stringify(r, null, 1)); await b.close();
})();
