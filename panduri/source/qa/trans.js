// transcription on a real recording: notes, metre, sections, panduri reach
const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const p = await (await b.newContext()).newPage(); const errs = [];
  p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error' && !/fonts|Failed to load/.test(m.text())) errs.push(m.text().slice(0, 200)); });
  await p.goto('http://localhost:8766/dist/app/'); await p.waitForTimeout(1500);
  const r = await p.evaluate(async url => {
    const t0 = performance.now();
    const ab0 = await (await fetch(url)).arrayBuffer();
    const ac = new AudioContext(); const ab = await ac.decodeAudioData(ab0); ac.close();
    const oc = new OfflineAudioContext(1, Math.ceil(ab.duration * 22050), 22050), s = oc.createBufferSource(); s.buffer = ab; s.connect(oc.destination); s.start();
    const mono = (await oc.startRendering()).getChannelData(0);
    const CUT = Math.min(mono.length, 22050 * 45), m = mono.subarray(0, CUT);
    const tDec = performance.now() - t0;
    const a = await PD.ai._analyse(m, 22050, null, {});
    const bt = await PD.ai._beatsOf(m, 22050, a.bpm, a.chords);
    const t1 = performance.now();
    const tr = await PD.aimus.transcribeAsync(m, 22050, { lo: 50, hi: 84 }, null);
    const tTr = performance.now() - t1;
    const mt = PD.aimus.metre(bt.beats, tr.flux, tr.dt, tr.t0off, a.chords);
    PD.aimus.quantise(tr.notes, bt.beats, mt); PD.aimus.mapNotes(tr.notes);
    const sec = PD.aimus.sections(tr.chroma, tr.dt, tr.t0off, bt.beats, CUT / 22050);
    return { dur: +(CUT / 22050).toFixed(1), tDec: Math.round(tDec), tTr: Math.round(tTr), bpm: a.bpm, beatBpm: bt.bpm, key: a.key, metre: mt,
      nNotes: tr.notes.length, reach: tr.notes.filter(n => n.reach).length,
      lo: Math.min(...tr.notes.map(n => n.m)), hi: Math.max(...tr.notes.map(n => n.m)),
      medConf: tr.notes.map(n => n.conf).sort((x, y) => x - y)[tr.notes.length >> 1],
      sections: sec.length, secs: sec.slice(0, 6),
      first: tr.notes.slice(0, 14).map(n => PD.theory.name(n.m) + '@' + n.t0 + ' b' + n.bar + '.' + n.beat + ' ' + n.val + ' s' + n.s + 'f' + n.f + ' c' + n.conf) };
  }, 'http://localhost:8766/media/bani/music.mp3');
  console.log(JSON.stringify(r, null, 1)); console.log('ERR', errs.slice(0, 3)); await b.close();
})();
