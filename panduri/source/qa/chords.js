// every chord in the library, checked against what it actually sounds
const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  const errs = []; p.on('pageerror', e => errs.push('PE ' + e.message));
  await p.goto('http://localhost:8766/dist/app/'); await p.waitForTimeout(1600);
  const r = await p.evaluate(() => {
    const TH = PD.theory, C = PD.curriculum.chords(), bad = [], stat = { chords: 0, shapes: 0, byType: {} };
    const pcOf = (s, f) => TH.pc(TH.midi(s, f));
    C.forEach(c => {
      stat.chords++;
      const T = TH.CHORD_TYPES.find(x => x.k === c.q);
      const name = (c.name || (TH.ROOT_NAMES[c.root] + c.q));
      if (!T) { bad.push(name + ': unknown type ' + c.q); return; }
      if (c.none) { stat.none = (stat.none || 0) + 1; return; }   // no playable form on three strings: listed without a diagram
      const want = new Set(T.iv.map(i => (c.root + i) % 12));
      const needSets = [T.need].concat(T.alt || []).map(nd => nd.map(i => (c.root + i) % 12));
      (c.voicings && c.voicings.length ? c.voicings : [c]).forEach((sh, si) => {
        if (!sh.frets) return;
        stat.shapes++;
        stat.byType[c.q] = (stat.byType[c.q] || 0) + 1;
        const fr = sh.frets, fg = sh.fingers || [];
        const pcs = fr.map((f, i) => f < 0 ? null : pcOf(i + 1, f)).filter(x => x != null);
        const where = name + ' #' + si + ' [' + fr.join(',') + '] (' + (fg.join(',') || '-') + ')';
        // 1 · every sounding note belongs to the chord
        pcs.forEach(pc => { if (!want.has(pc)) bad.push('FOREIGN ' + where + ' · ' + TH.ROOT_NAMES[pc]); });
        // 2 · the tones the type needs are all there
        if (!needSets.some(ns => ns.every(pc => pcs.includes(pc)))) bad.push('MISSING ' + where + ' · needs ' + needSets[0].map(x => TH.ROOT_NAMES[x]).join('+') + ' has ' + pcs.map(x => TH.ROOT_NAMES[x]).join('+'));
        // 3 · the stretch and the frets
        const fretted = fr.filter(f => f > 0);
        if (fr.some(f => f < 0 || f > TH.FRETS)) bad.push('RANGE ' + where);
        if (fretted.length && Math.max(...fretted) - Math.min(...fretted) > 4) bad.push('STRETCH ' + where);
        // 4 · every pressed string has a finger, every open one has none
        fr.forEach((f, i) => { const g = fg[i];
          if (f > 0 && !g) bad.push('NOFINGER ' + where + ' string ' + (i + 1));
          if (f === 0 && g) bad.push('FINGER-ON-OPEN ' + where + ' string ' + (i + 1)); });
        // 5 · one finger may only hold one fret (a barre is the same fret)
        const byFinger = {};
        fg.forEach((g, i) => { if (!g || fr[i] <= 0) return; (byFinger[g] = byFinger[g] || []).push(fr[i]); });
        Object.keys(byFinger).forEach(g => { if (new Set(byFinger[g]).size > 1) bad.push('ONE-FINGER-TWO-FRETS ' + where + ' finger ' + g); });
        // 6 · the teacher's rule for three-string shapes
        const tf = TH.teacherFingers(fr);
        if (tf && fg.length && tf.fingers.join(',') !== fg.join(',')) bad.push('FINGERING ' + where + ' · teacher says ' + tf.fingers.join(','));
        // 7 · the name matches the lowest note for the root position claim
      });
    });
    return { stat, bad: bad.slice(0, 60), total: bad.length };
  });
  console.log('chords:', r.stat.chords, '· shapes:', r.stat.shapes);
  console.log('problems:', r.total);
  r.bad.forEach(x => console.log('  ' + x));
  console.log('errs', errs);
  await b.close();
})();
