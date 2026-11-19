/* =====================================================================
   სიმას მუსიკის თეორია · Sima's music theory
   Everything here is worked out from the twelve notes and the seven
   letters — nothing is typed in, so every answer carries the `fact`
   badge: an interval between two notes, the notes of any chord or
   scale spelled letter by letter (F♯ major has an E♯, not an F), a key
   signature, the chords of a key with their Roman numerals, a
   progression transposed or its key estimated, a note's frequency,
   tempo in milliseconds, the circle of fifths.
   What it does NOT do: say how anything is played on the panduri. The
   shapes it offers to play come from PD.curriculum.chords(), which
   computes them from the tuning.
   Each answer may carry `play`: what Sima can sound for it (notes, a
   chord, a progression). PD.sima plays them; this module only says what.
   ===================================================================== */
PD.simaTheory = (() => {
  const LET = ['C', 'D', 'E', 'F', 'G', 'A', 'B'], LPC = [0, 2, 4, 5, 7, 9, 11];
  const KA = ['დო', 'რე', 'მი', 'ფა', 'სოლ', 'ლა', 'სი'];
  const ACC = { '-2': '𝄫', '-1': '♭', '0': '', '1': '♯', '2': '𝄪' };
  const ka = () => PD.i18n.lang === 'ka';
  const mod = (a, n) => ((a % n) + n) % n;
  const pcOf = n => mod(LPC[n.l] + n.a, 12);
  const nm = n => LET[n.l] + ACC[n.a];
  const kaName = n => KA[n.l] + (n.a === 1 ? ' დიეზ' : n.a === -1 ? ' ბემოლ' : n.a === 2 ? ' დუბლ-დიეზ' : n.a === -2 ? ' დუბლ-ბემოლ' : '');
  /** letter l + the pitch class it must sound: the accidental that makes it so (null past a double one) */
  const spellAs = (l, pc) => { const a = mod(pc - LPC[mod(l, 7)] + 6, 12) - 6; return Math.abs(a) <= 2 ? { l: mod(l, 7), a } : null; };
  /** a note some interval above (letter steps, semitones) — below when both are negative */
  const up = (n, deg, semis) => spellAs(n.l + deg, pcOf(n) + semis) || { l: mod(n.l + deg, 7), a: 0, bad: true };
  // the names a pitch class has when nothing else says which letter: the usual key names
  const MAJ_NAME = ['C', 'D♭', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'A♭', 'A', 'B♭', 'B'];
  const MIN_NAME = ['C', 'C♯', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'B♭', 'B'];
  const note = s => { const m = String(s).match(/^([A-G])(𝄪|𝄫|♯|♭)?$/u); return m ? { l: LET.indexOf(m[1]), a: { '𝄪': 2, '♯': 1, '♭': -1, '𝄫': -2 }[m[2]] || 0 } : null; };
  const show = n => ka() ? nm(n) + ' (' + kaName(n) + ')' : nm(n);
  const list = ns => ns.map(nm).join(' · ');
  const solf = ns => ka() ? t('smt.solf', { s: ns.map(kaName).join(' · ') }) : null;

  /* ---------------- reading the question ---------------- */
  const ACCW = { '𝄪': 2, '##': 2, '♯♯': 2, 'x': 2, '𝄫': -2, 'bb': -2, '♭♭': -2, '♯': 1, '#': 1, '♭': -1, 'b': -1 };
  /** every note named in the question, in order: C, F♯, Bb, ფა დიეზი, სოლ-დან, E4 (an octave digit is kept) */
  function notesIn(q) {
    const out = [], toks = String(q || '').split(/[\s,;:!?()„“”"«»\/|→>]+|[-–—](?![0-9])/u).filter(Boolean);
    toks.forEach((tok, i) => {
      let m = tok.match(/^([A-G])(𝄪|𝄫|##|bb|♯♯|♭♭|♯|#|♭|b)?([0-8])?$/u);
      // "B flat", "F sharp", „სი ბემოლი" — the accidental as a word of its own
      const nx0 = String(toks[i + 1] || '').toLowerCase(), wacc = /^(flat|ბემოლ)/u.test(nx0) ? -1 : /^(sharp|დიეზ)/u.test(nx0) ? 1 : 0;
      if (m) { out.push({ l: LET.indexOf(m[1]), a: ACCW[m[2]] || wacc, oct: m[3] != null ? +m[3] : null, at: i }); return; }
      m = tok.match(/^(დო|რე|მი|ფა|სოლ|ლა|სი)(დიეზ|ბემოლ|♯|♭|#)?(ი|ის|ს|დან|იდან|ამდე|მდე|ზე|ში|თან)?$/u);
      if (m) {
        const nx = toks[i + 1] || '', acc = /^დიეზ/u.test(nx) || m[2] === 'დიეზ' || m[2] === '♯' || m[2] === '#' ? 1 : /^ბემოლ/u.test(nx) || m[2] === 'ბემოლ' || m[2] === '♭' ? -1 : 0;
        out.push({ l: KA.indexOf(m[1]), a: acc, oct: null, at: i, ka: true });
      }
    });
    return out;
  }
  // chord symbols: Am, F♯m7, Bb, Cmaj7, Dm7b5, Eø, G°7, Asus4, C+
  const QALIAS = [[/^(maj|ma|M|Δ)$/u, ''], [/^(min|mi|-)$/u, 'm'], [/^(M7|Maj7|ma7|Δ7?)$/u, 'maj7'], [/^(min7|mi7|-7)$/u, 'm7'], [/^(ø7?|m7-5)$/u, 'm7♭5'],
    [/^(°7|o7)$/u, 'dim7'], [/^(°|o)$/u, 'dim'], [/^(\+|\+5|#5)$/u, 'aug'], [/^(sus)$/u, 'sus4'], [/^(mM7|mmaj7|m\(M7\)|minmaj7|mMaj7)$/u, 'm(maj7)'], [/^(madd9)$/u, 'm(add9)'], [/^(M9|Maj9|Δ9)$/u, 'maj9']];
  const TYPES = () => (PD.theory && PD.theory.CHORD_TYPES) || [];
  function chordTok(tok) {
    const m = String(tok).match(/^([A-G])(♯|#|♭|b)?(.*)$/u); if (!m) return null;
    let q = m[3].replace(/#/g, '♯').replace(/b(?=\d)/g, '♭');
    const al = QALIAS.find(([re]) => re.test(q)); if (al) q = al[1];
    q = q.replace(/^min(?=\d|\()/u, 'm').replace(/^maj(?=9)/u, 'maj');
    const ty = TYPES().find(x => x.k === q); if (!ty) return null;
    return { root: { l: LET.indexOf(m[1]), a: m[2] ? (m[2] === '♯' || m[2] === '#' ? 1 : -1) : 0 }, ty, as: m[1] + (m[2] ? (m[2] === '#' || m[2] === '♯' ? '♯' : '♭') : '') + ty.k };
  }
  const chordName = c => nm(c.root) + c.ty.k;
  function chordsIn(q) {
    return String(q || '').split(/[\s,;:!?()„“”"«»\/|→>]+|[-–—](?![0-9])/u).filter(Boolean).map(tok => tok.replace(/(-?(ში|ზე|დან|მდე|ს|ის|ით|ად|ა))$/u, ''))
      .filter(tok => /^[A-G]/.test(tok)).map(chordTok).filter(Boolean);
  }

  /* ---------------- intervals ---------------- */
  const BASE = [0, 2, 4, 5, 7, 9, 11, 12], PERF = [0, 3, 4, 7];
  /** quality of a letter distance d (0..7) spanning s semitones */
  function quality(d, s) {
    let x = s - BASE[d]; if (x > 6) x -= 12; if (x < -6) x += 12;
    if (PERF.includes(d)) return { 0: 'P', 1: 'A', '-1': 'd', 2: 'AA', '-2': 'dd' }[x] || null;
    return { 0: 'M', '-1': 'm', 1: 'A', '-2': 'd', 2: 'AA', '-3': 'dd' }[x] || null;
  }
  const ivName = (d, qq) => t('smt.q.' + qq) + ' ' + t('smt.n' + (d + 1));
  const ivShort = (d, qq) => qq + (d + 1);
  const INV = { P: 'P', M: 'm', m: 'M', A: 'd', d: 'A', AA: 'dd', dd: 'AA' };
  function between(a, b) {
    const d = mod(b.l - a.l, 7), s = mod(pcOf(b) - pcOf(a), 12), same = d === 0 && s === 0;
    const qq = quality(d, s); if (!qq) return null;
    return { d, s, qq, same };
  }
  const semisText = s => t('smt.semis', { n: s, t: String(s / 2).replace('.5', ka() ? ',5' : '.5') });
  function intervalAnswer(a, b) {
    const iv = between(a, b); if (!iv) return null;
    const lines = [];
    lines.push(ivName(iv.d, iv.qq) + ' (' + ivShort(iv.d, iv.qq) + ') — ' + semisText(iv.s) + '.');
    if (!iv.same) { const d2 = mod(7 - iv.d, 7) || 7, q2 = INV[iv.qq]; lines.push(t('smt.inv', { a: nm(b), b: nm(a), n: ivName(d2 === 7 ? 7 : d2, q2) + ' (' + ivShort(d2 === 7 ? 7 : d2, q2) + ')', s: 12 - iv.s })); }
    if (iv.s === 6) lines.push(t('smt.tritone'));
    if (iv.s && PD.theory && PD.theory.FRETS) lines.push(t('smt.onNeck', { n: iv.s }));
    const m0 = 57 + mod(pcOf(a) - 9, 12);
    return { title: nm(a) + ' → ' + nm(b), lines, src: 'fact', play: [{ label: t('smt.pApart'), k: 'seq', midis: [m0, m0 + iv.s], gap: .7 }, { label: t('smt.pTogether'), k: 'together', midis: [m0, m0 + iv.s] }] };
  }
  // „დიდი ტერცია E-დან", "a perfect fifth above D", "მცირე სექსტა ქვემოთ ლა-დან"
  const NUMW = [[/პრიმ|unison|prime|1st/u, 0], [/სეკუნდ|second|2nd/u, 1], [/ტერცი|third|3rd/u, 2], [/კვარტ|fourth|4th/u, 3], [/კვინტ|fifth|5th/u, 4], [/სექსტ|sixth|6th/u, 5], [/სეპტიმ|seventh|7th/u, 6], [/ოქტავ|octave|8th|8ve/u, 7]];
  const QW = [[/ორმაგად გადიდებულ|doubly augmented/u, 'AA'], [/ორმაგად შემცირებულ|doubly diminished/u, 'dd'], [/წმინდ|perfect/u, 'P'], [/გადიდებულ|augmented|aug\b/u, 'A'], [/შემცირებულ|diminished|dim\b/u, 'd'], [/დიდი?\s|major|maj\b/u, 'M'], [/პატარ|მცირე|minor|min\b/u, 'm']];
  function intervalFrom(Q, n) {
    const num = NUMW.find(([re]) => re.test(Q)); if (!num) return null;
    let qq = (QW.find(([re]) => re.test(Q)) || [])[1] || (PERF.includes(num[1]) || num[1] === 7 ? 'P' : null);
    if (/ტრიტონ|tritone/u.test(Q)) qq = 'A';
    if (!qq) return null;
    const d = num[1], perf = PERF.includes(d) || d === 7;
    if (perf && (qq === 'M' || qq === 'm')) return null;
    if (!perf && qq === 'P') return null;
    const adj = perf ? { P: 0, A: 1, d: -1, AA: 2, dd: -2 }[qq] : { M: 0, m: -1, A: 1, d: -2, AA: 2, dd: -3 }[qq];
    const down = /ქვემოთ|ქვევით|დაბლა|below|down|under/u.test(Q), s = BASE[d] + adj;
    const r = down ? up(n, -d, -s) : up(n, d, s);
    const m0 = 57 + mod(pcOf(n) - 9, 12) + (down ? 12 : 0);
    return { title: ivName(d, qq) + ' ' + t(down ? 'smt.below' : 'smt.above', { n: nm(n) }), lines: [t(down ? 'smt.isBelow' : 'smt.isAbove', { n: show(n), r: show(r), i: ivName(d, qq) }), semisText(s) + '.'],
      src: 'fact', play: [{ label: t('smt.pApart'), k: 'seq', midis: [m0, m0 + (down ? -s : s)], gap: .7 }] };
  }

  /* ---------------- scales and keys ---------------- */
  const SC = {
    major: { iv: [0, 2, 4, 5, 7, 9, 11], k: 'sh.major' }, minor: { iv: [0, 2, 3, 5, 7, 8, 10], k: 'sh.minor' }, harm: { iv: [0, 2, 3, 5, 7, 8, 11], k: 'sh.harm' }, mel: { iv: [0, 2, 3, 5, 7, 9, 11], k: 'sh.mel' },
    dorian: { iv: [0, 2, 3, 5, 7, 9, 10], k: 'sh.dorian', deg: 2 }, phrygian: { iv: [0, 1, 3, 5, 7, 8, 10], k: 'sh.phrygian', deg: 3 }, lydian: { iv: [0, 2, 4, 6, 7, 9, 11], k: 'sh.lydian', deg: 4 },
    mixo: { iv: [0, 2, 4, 5, 7, 9, 10], k: 'sh.mixo', deg: 5 }, locrian: { iv: [0, 1, 3, 5, 6, 8, 10], k: 'sh.locrian', deg: 7 },
    penta: { iv: [0, 2, 4, 7, 9], k: 'sh.penta' }, mpenta: { iv: [0, 3, 5, 7, 10], k: 'sh.mpenta' }, blues: { iv: [0, 2, 3, 4, 7, 9], k: 'sh.blues' }, mblues: { iv: [0, 3, 5, 6, 7, 10], k: 'sh.mblues' },
    whole: { iv: [0, 2, 4, 6, 8, 10], k: 'sh.whole' }, chrom: { iv: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], k: 'sh.chrom' }
  };
  const SCW = [[/დორი|dorian|дорийск/u, 'dorian'], [/ფრიგი|phrygian|фригийск/u, 'phrygian'], [/მიქსოლიდ|mixolyd|миксолид/u, 'mixo'], [/ლიდი|lydian|лидийск/u, 'lydian'], [/ლოკრი|locrian|локрийск/u, 'locrian'],
    [/იონი|ionian/u, 'major'], [/ეოლი|aeolian/u, 'minor'], [/ჰარმონიულ|harmonic|гармоническ/u, 'harm'], [/მელოდიურ|melodic|мелодическ/u, 'mel'],
    [/მინორულ.*ბლუზ|ბლუზ.*მინორ|minor blues|blues minor/u, 'mblues'], [/ბლუზ|blues|блюз/u, 'blues'],
    [/მინორულ.*პენტ|პენტ.*მინორ|minor penta|penta.*minor/u, 'mpenta'], [/პენტატ|pentaton|пентатон/u, 'penta'],
    [/მთლიანტონ|მთელტონ|whole.?tone|целотон/u, 'whole'], [/ქრომატ|chromatic|хроматич/u, 'chrom']];
  const MAJW = /მაჟორ|major|мажор|dur\b/u, MINW = /მინორ|minor|минор|moll\b/u;
  /** the scale spelled: a seven-note scale uses each letter once; the others take the nearest sensible letter */
  function scaleNotes(root, kind) {
    const iv = SC[kind].iv;
    if (iv.length === 7) return iv.map((s, i) => up(root, i, s));
    const has5 = iv.includes(5), has7 = iv.includes(7);
    const DEG = { 0: 0, 1: 1, 2: 1, 3: 2, 4: 2, 5: 3, 6: has5 ? 4 : 3, 7: 4, 8: has7 ? 5 : 4, 9: 5, 10: 6, 11: 6 };
    if (kind === 'chrom') return iv.map(s => { const pc = pcOf(root) + s; return note(MIN_NAME[mod(pc, 12)]) || up(root, DEG[s], s); });
    return iv.map(s => up(root, DEG[s], s));
  }
  const DEGL = { 0: '1', 1: '♭2', 2: '2', 3: '♭3', 4: '3', 5: '4', 6: '♯4', 7: '5', 8: '♭6', 9: '6', 10: '♭7', 11: '7' };
  const keyName = (n, minor) => ka() ? kaName(n) + ' ' + t(minor ? 'smt.minor' : 'smt.major') + ' (' + nm(n) + (minor ? 'm' : '') + ')' : nm(n) + ' ' + t(minor ? 'smt.minor' : 'smt.major');
  const scaleTitle = (n, kind) => kind === 'major' || kind === 'minor' ? keyName(n, kind === 'minor') : (ka() ? kaName(n) : nm(n)) + ' · ' + t(SC[kind].k);
  function signature(n, minor) {
    const ns = scaleNotes(n, minor ? 'minor' : 'major');
    if (ns.some(x => x.bad || Math.abs(x.a) > 1)) return { ns, theo: true, sh: ns.filter(x => x.a > 0), fl: ns.filter(x => x.a < 0) };
    // in the order they are written: F C G D A E B for sharps, B E A D G C F for flats
    const SO = [3, 0, 4, 1, 5, 2, 6], FO = [6, 2, 5, 1, 4, 0, 3];
    return { ns, sh: SO.map(l => ns.find(x => x.l === l && x.a > 0)).filter(Boolean), fl: FO.map(l => ns.find(x => x.l === l && x.a < 0)).filter(Boolean) };
  }
  const sigLine = g => g.theo ? t('smt.sigTheo') : !g.sh.length && !g.fl.length ? t('smt.sig0') : g.sh.length ? t(g.sh.length === 1 ? 'smt.sigSh1' : 'smt.sigSh', { n: g.sh.length, s: list(g.sh) }) : t(g.fl.length === 1 ? 'smt.sigFl1' : 'smt.sigFl', { n: g.fl.length, s: list(g.fl) });
  /* the chords of a key, with their numerals */
  const MAJ_Q = ['', 'm', 'm', '', '', 'm', 'dim'], MAJ_7 = ['maj7', 'm7', 'm7', 'maj7', '7', 'm7', 'm7♭5'];
  const MIN_Q = ['m', 'dim', '', 'm', 'm', '', ''], MIN_7 = ['m7', 'm7♭5', 'maj7', 'm7', 'm7', 'maj7', '7'];
  const ROM = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
  function numeral(deg, q, acc) {
    const lower = /^m(?!aj)|dim/.test(q), r = (acc || '') + (lower ? ROM[deg].toLowerCase() : ROM[deg]);
    return r + (q === 'dim' ? '°' : q === 'dim7' ? '°7' : q === 'm7♭5' ? 'ø7' : q === 'aug' ? '+' : q === 'm7' ? '7' : q === 'm' ? '' : q.replace(/^m(?!aj)/, ''));
  }
  function diatonic(n, minor) {
    const ns = scaleNotes(n, minor ? 'minor' : 'major'), Q = minor ? MIN_Q : MAJ_Q, Q7 = minor ? MIN_7 : MAJ_7;
    return ns.map((x, i) => ({ root: x, q: Q[i], q7: Q7[i], rn: numeral(i, Q[i]), rn7: numeral(i, Q7[i]), name: nm(x) + Q[i], name7: nm(x) + Q7[i] }));
  }
  function keyAnswer(n, minor, want) {
    const g = signature(n, minor), D = diatonic(n, minor), rel = minor ? up(n, 2, 3) : up(n, 5, 9), par = n;
    const lines = [], play = [];
    if (want !== 'chords') { lines.push(t('smt.scale', { s: list(g.ns) })); const so = solf(g.ns); if (so) lines.push(so); }
    lines.push(t('smt.sig', { s: sigLine(g) }));
    if (want === 'all' || want === 'sig' || want === 'rel') {
      lines.push(t(minor ? 'smt.relMaj' : 'smt.relMin', { k: keyName(rel, !minor) }));
      const g2 = signature(par, !minor); lines.push(t('smt.par', { k: keyName(par, !minor), s: sigLine(g2) }));
    }
    if (want === 'all' || want === 'chords') {
      lines.push(t('smt.triads', { s: D.map(c => c.rn + ' ' + c.name).join(' · ') }));
      lines.push(t('smt.sevenths', { s: D.map(c => c.rn7 + ' ' + c.name7).join(' · ') }));
      if (minor) { const V = up(n, 4, 7), vii = up(n, 6, 11); lines.push(t('smt.harmV', { v: nm(V), v7: nm(V) + '7', d: nm(vii) + 'dim' })); }
      lines.push(t('smt.func', { t: nm(D[0].root), s: nm(D[3].root), d: nm(D[4].root) }));
    }
    play.push({ label: t('smt.pScale'), k: 'scale', midis: midisOf(n, SC[minor ? 'minor' : 'major'].iv) });
    const cad = minor ? [D[0], D[3], { name: nm(up(n, 4, 7)) }, D[0]] : [D[0], D[3], D[4], D[0]];
    play.push({ label: t('smt.pCad', { s: cad.map(c => c.name).join('–') }), k: 'prog', names: cad.map(c => c.name) });
    if (want === 'chords') D.forEach(c => play.push({ label: c.name, k: 'chord', name: c.name, small: true }));
    const r = PD.theory && PD.theory.ROOTS ? PD.theory.ROOTS.findIndex(x => note(x) && pcOf(note(x)) === pcOf(n)) : -1;
    return { title: keyName(n, minor) + (want === 'chords' ? ' — ' + t('smt.chordsT') : ''), lines, src: 'fact', play,
      acts: [[t('smt.circle'), ['circle']]].concat(r >= 0 ? [[t('smt.onScales'), ['scales', r + ':' + (minor ? 'minor' : 'major')]]] : []) };
  }
  function midisOf(n, iv) { const m0 = 57 + mod(pcOf(n) - 9, 12); return iv.concat([12]).map(s => m0 + s); }
  function scaleAnswer(n, kind) {
    const S = SC[kind], ns = scaleNotes(n, kind), lines = [t('smt.scale', { s: list(ns) })];
    const so = solf(ns); if (so) lines.push(so);
    lines.push(t('smt.degs', { s: S.iv.map(s => DEGL[s]).join(' · ') }));
    const steps = S.iv.concat([12]).slice(1).map((s, i) => s - S.iv[i]).map(x => x === 1 ? t('smt.st.S') : x === 2 ? t('smt.st.T') : x === 3 ? t('smt.st.TS') : x + '');
    if (kind !== 'chrom') lines.push(t('smt.steps', { s: steps.join(' ') }));
    if (S.deg) { const parent = up(n, -(S.deg - 1), -SC.major.iv[S.deg - 1]); lines.push(t('smt.modeOf', { p: keyName(parent, false), d: S.deg, n: nm(n) })); }
    if (kind === 'harm') lines.push(t('smt.harmNote'));
    if (kind === 'mel') lines.push(t('smt.melNote'));
    if (kind === 'blues' || kind === 'mblues') lines.push(t('smt.bluesNote'));
    return { title: scaleTitle(n, kind), lines, src: 'fact', play: [{ label: t('smt.pScale'), k: 'scale', midis: midisOf(n, S.iv) }],
      acts: [[t('smt.onScales'), ['scales']]] };
  }

  /* ---------------- chords: their notes, and a chord from its notes ---------------- */
  function chordLabel(ty, s) {
    const k = ty.k, sev = ty.iv.includes(10) || ty.iv.includes(11) || /9|11|13/.test(k);
    return { 0: '1', 1: '♭9', 2: sev || /9/.test(k) ? '9' : '2', 3: '♭3', 4: '3', 5: /11/.test(k) ? '11' : '4', 6: /dim|♭5|m7♭5/.test(k) ? '♭5' : '♯11', 7: '5', 8: /aug|♯5/.test(k) ? '♯5' : '♭13', 9: k === 'dim7' ? '𝄫7' : /13/.test(k) ? '13' : '6', 10: '♭7', 11: '7' }[s];
  }
  const LDEG = { '1': 0, '♭9': 1, '9': 1, '2': 1, '♭3': 2, '3': 2, '4': 3, '11': 3, '♭5': 4, '♯11': 3, '5': 4, '♯5': 4, '♭13': 5, '6': 5, '13': 5, '𝄫7': 6, '♭7': 6, '7': 6 };
  function chordTones(c) { return c.ty.iv.map(s => { const lab = chordLabel(c.ty, s); return { n: up(c.root, LDEG[lab], s), lab, s }; }); }
  function spellAnswer(c) {
    const tones = chordTones(c), ns = tones.map(x => x.n), lines = [t('smt.cNotes', { s: list(ns) })];
    const so = solf(ns); if (so) lines.push(so);
    lines.push(t('smt.cForm', { s: tones.map(x => x.lab).join(' · ') }));
    const ivs = tones.slice(1).map(x => { const b = between(c.root, x.n); return b ? ivName(b.d, b.qq) : x.lab; });
    if (ivs.length) lines.push(t('smt.cIvs', { s: ivs.join(', ') }));
    if (c.ty.d) lines.push(PD.i18n.pick({ ka: c.ty.d[0], en: c.ty.d[1] }));
    const miss = c.ty.iv.filter(s => !(c.ty.need || c.ty.iv).includes(s));
    if (miss.length) lines.push(t('smt.cOmit', { s: miss.map(s => nm(tones.find(x => x.s === s).n)).join(', ') }));
    const m0 = 57 + mod(pcOf(c.root) - 9, 12);
    return { title: chordName(c), lines, src: 'fact', play: [{ label: t('smt.pChord'), k: 'chord', name: chordName(c), midis: c.ty.iv.map(s => m0 + s) }, { label: t('smt.pArp'), k: 'seq', midis: c.ty.iv.map(s => m0 + s).concat([m0 + 12]), gap: .32 }],
      acts: [[t('sm.openChord'), ['chords']]] };
  }
  function identify(ns) {
    const pcs = [...new Set(ns.map(pcOf))]; if (pcs.length < 2) return null;
    const out = [];
    ns.forEach(r => TYPES().forEach(ty => {
      const set = ty.iv.map(s => mod(pcOf(r) + s, 12)), need = (ty.need || ty.iv).map(s => mod(pcOf(r) + s, 12));
      const eq = (a, b) => a.length === b.length && a.every(x => b.includes(x));
      const uniq = [...new Set(set)];
      if (eq(uniq, pcs)) out.push({ root: r, ty, full: true });
      else if (pcs.length >= 3 && eq([...new Set(need)], pcs) && ty.iv.length > need.length) out.push({ root: r, ty, full: false });
    }));
    // the plainest name first: a full chord before one with a tone left out, a triad before a 7th, the bass as root first
    const rank = x => (x.full ? 0 : 10) + x.ty.iv.length + (pcOf(x.root) === pcOf(ns[0]) ? 0 : 1.5) + (/9|11|13|add|6/.test(x.ty.k) ? 2 : 0);
    const seen = new Set();
    return out.sort((a, b) => rank(a) - rank(b)).filter(x => { const k = pcOf(x.root) + x.ty.k; if (seen.has(k)) return false; seen.add(k); return true; }).slice(0, 3);
  }
  function identifyAnswer(ns) {
    const found = identify(ns); if (!found || !found.length) return { title: list(ns), lines: [t('smt.idNone')], src: 'fact' };
    const b = found[0], c = { root: b.root, ty: b.ty }, bass = ns[0], lines = [];
    const tone = chordTones(c).find(x => pcOf(x.n) === pcOf(bass));
    lines.push(t('smt.idIs', { s: list(ns), c: chordName(c), ty: PD.i18n.pick({ ka: b.ty.ka || b.ty.k, en: b.ty.en || b.ty.k }) }));
    if (!b.full) lines.push(t('smt.idOmit'));
    if (tone && tone.lab !== '1') lines.push(t('smt.idInv', { c: chordName(c) + '/' + nm(bass), n: t(tone.lab === '3' || tone.lab === '♭3' ? 'smt.inv1' : tone.lab === '5' || tone.lab === '♭5' || tone.lab === '♯5' ? 'smt.inv2' : 'smt.inv3') }));
    if (found.length > 1) lines.push(t('smt.idAlso', { s: found.slice(1).map(x => nm(x.root) + x.ty.k).join(', ') }));
    const m0 = 57 + mod(pcOf(bass) - 9, 12);
    const ms = ns.map((x, i) => { const s = mod(pcOf(x) - pcOf(bass), 12); return m0 + s; });
    return { title: chordName(c), lines, src: 'fact', play: [{ label: t('smt.pChord'), k: 'chord', name: chordName(c), midis: ms }] };
  }

  /* ---------------- progressions: their key, their numerals, transposed ---------------- */
  const pcSet = c => c.ty.iv.map(s => mod(pcOf(c.root) + s, 12));
  function keyOf(cs) {
    const best = [];
    for (let pc = 0; pc < 12; pc++) [false, true].forEach(minor => {
      const tonic = note(minor ? MIN_NAME[pc] : MAJ_NAME[pc]), sc = scaleNotes(tonic, minor ? 'minor' : 'major').map(pcOf);
      if (minor) sc.push(mod(pc + 11, 12));   // the raised 7th of harmonic minor: E in A minor
      let s = 0;
      cs.forEach(c => { const set = pcSet(c), inside = set.filter(x => sc.includes(x)).length; s += inside === set.length ? 2 : inside / set.length - .5; });
      const first = cs[0], last = cs[cs.length - 1], isT = c => pcOf(c.root) === pc && (/^m(?!aj)/.test(c.ty.k) === minor);
      if (isT(first)) s += 1.5; if (isT(last)) s += 1.5;
      best.push({ pc, minor, tonic, s });
    });
    return best.sort((a, b) => b.s - a.s);
  }
  const CHROM_MAJ = ['I', '♭II', 'II', '♭III', 'III', 'IV', '♯IV', 'V', '♭VI', 'VI', '♭VII', 'VII'];
  const CHROM_MIN = ['I', '♭II', 'II', 'III', '♯III', 'IV', '♯IV', 'V', 'VI', '♯VI', 'VII', '♯VII'];
  function romanIn(c, k) {
    const s = mod(pcOf(c.root) - k.pc, 12), base = (k.minor ? CHROM_MIN : CHROM_MAJ)[s], m = base.match(/^([♭♯]?)(.+)$/u);
    return numeral(ROM.indexOf(m[2]), c.ty.k, m[1]);
  }
  /** a chord root in a key: the key's own letter when the note is in it, else its usual name */
  function inKey(pc, k) {
    const sc = scaleNotes(k.tonic, k.minor ? 'minor' : 'major'), hit = sc.find(x => pcOf(x) === mod(pc, 12));
    if (hit) return hit;
    const flats = signature(k.tonic, k.minor).fl.length > 0;
    return note((flats ? MAJ_NAME : MIN_NAME)[mod(pc, 12)]);
  }
  function keyGuessAnswer(cs) {
    const ks = keyOf(cs), k = ks[0], rel = ks.find(x => x !== k && x.minor !== k.minor && x.pc === mod(k.pc + (k.minor ? 3 : 9), 12));
    const lines = [t('smt.kIs', { s: cs.map(chordName).join(' · '), k: keyName(k.tonic, k.minor) })];
    lines.push(t('smt.kRom', { s: cs.map(c => romanIn(c, k)).join(' · ') }));
    if (rel && rel.s >= k.s - 2) lines.push(t('smt.kAlt', { k: keyName(rel.tonic, rel.minor), s: cs.map(c => romanIn(c, rel)).join(' · ') }));
    const sc = scaleNotes(k.tonic, k.minor ? 'minor' : 'major').map(pcOf), out = cs.filter(c => !pcSet(c).every(x => sc.includes(x)));
    if (out.length) lines.push(t(k.minor && out.every(c => pcSet(c).every(x => sc.includes(x) || x === mod(k.pc + 11, 12))) ? 'smt.kHarm' : 'smt.kOut', { s: [...new Set(out.map(chordName))].join(', ') }));
    lines.push(t('smt.kEar'));
    return { title: keyName(k.tonic, k.minor), lines, src: 'fact', play: [{ label: t('smt.pProg'), k: 'prog', names: cs.map(chordName) }] };
  }
  function transposeAnswer(cs, n, target) {
    const k = keyOf(cs)[0];
    // a target in the other mode means its relative: C G Am F „to Dm" is the key whose relative minor is D minor
    if (target) { const tm = target.minor == null ? k.minor : target.minor; n = mod(pcOf(target.n) - k.pc + (tm === k.minor ? 0 : tm ? 3 : -3), 12); if (n > 6) n -= 12; }
    const nk = { pc: mod(k.pc + n, 12), minor: k.minor }; nk.tonic = note((k.minor ? MIN_NAME : MAJ_NAME)[nk.pc]);
    const moved = cs.map(c => ({ root: inKey(pcOf(c.root) + n, nk), ty: c.ty }));
    const lines = [cs.map(chordName).join(' · ') + '  →  ' + moved.map(chordName).join(' · '),
      t('smt.tBy', { n: (n > 0 ? '+' : '') + n }), t('smt.tKey', { a: keyName(k.tonic, k.minor), b: keyName(nk.tonic, nk.minor) })];
    const lib = (PD.curriculum && PD.curriculum.chords && PD.curriculum.chords()) || [];
    const canon = c => mod(pcOf(c.root), 12) + ':' + c.ty.k;
    const missing = moved.filter(c => !lib.some(x => { const p = chordTok(x.name); return p && canon(p) === canon(c); }));
    if (lib.length) lines.push(missing.length ? t('smt.tMiss', { s: [...new Set(missing.map(chordName))].join(', ') }) : t('smt.tAll'));
    return { title: t('smt.tT'), lines, src: 'fact', play: [{ label: t('smt.pBefore'), k: 'prog', names: cs.map(chordName) }, { label: t('smt.pAfter'), k: 'prog', names: moved.map(chordName) }] };
  }

  /* ---------------- the circle of fifths, frequency, tempo ---------------- */
  function circleAnswer() {
    const sh = ['C', 'G', 'D', 'A', 'E', 'B', 'F♯', 'C♯'], fl = ['C', 'F', 'B♭', 'E♭', 'A♭', 'D♭', 'G♭', 'C♭'];
    const rel = x => { const n = note(x), r = up(n, 5, 9); return nm(r) + 'm'; };
    return { title: t('smt.circleT'), src: 'fact', acts: [[t('smt.circle'), ['circle']]], lines: [
      t('smt.cfSh', { s: sh.map((x, i) => x + ' (' + i + '♯)').join(' → ') }), t('smt.cfFl', { s: fl.map((x, i) => x + ' (' + i + '♭)').join(' → ') }),
      t('smt.cfRel', { s: sh.map(rel).join(' · ') + ' / ' + fl.slice(1).map(rel).join(' · ') }),
      t('smt.cfOrd', { a: 'F♯ C♯ G♯ D♯ A♯ E♯ B♯', b: 'B♭ E♭ A♭ D♭ G♭ C♭ F♭' }), t('smt.cfEnh')] };
  }
  const midiOfNote = n => (n.oct + 1) * 12 + LPC[n.l] + n.a;
  function freqAnswer(n) {
    const a4 = PD.theory && PD.theory.a4 ? PD.theory.a4() : 440, m = midiOfNote(n), f = a4 * Math.pow(2, (m - 69) / 12);
    const lines = [t('smt.fIs', { n: nm(n) + n.oct, f: f.toFixed(2), a: a4 })];
    const pos = PD.theory && PD.theory.positions ? PD.theory.positions(m) : [];
    if (pos.length) lines.push(t('smt.fPos', { s: pos.slice(0, 4).map(p => PD.theory.stringName(p.s) + ' · ' + (p.f ? t('sm.fret', { n: p.f }) : t('sm.open'))).join(', ') }));
    else if (PD.theory && PD.theory.positions) lines.push(t('smt.fNoPos'));
    return { title: nm(n) + n.oct, lines, src: 'fact', play: [{ label: t('smt.pNote'), k: 'seq', midis: [m], gap: 1, exact: true }] };
  }
  function hzAnswer(f) {
    const a4 = PD.theory && PD.theory.a4 ? PD.theory.a4() : 440, m = 69 + 12 * Math.log2(f / a4), r = Math.round(m), c = Math.round((m - r) * 100);
    const n = note(MIN_NAME[mod(r, 12)]), name = nm(n) + (Math.floor(r / 12) - 1);
    return { title: f + ' Hz', lines: [t('smt.hzIs', { f, n: name, c: (c > 0 ? '+' : '') + c, a: a4 })], src: 'fact', play: [{ label: t('smt.pNote'), k: 'seq', midis: [r], gap: 1, exact: true }] };
  }
  function tempoAnswer(bpm) {
    const q = 60000 / bpm, r = x => Math.round(x);
    return { title: bpm + ' BPM', src: 'fact', acts: [[t('sm.metro'), ['metronome']]], lines: [t('smt.bpm', { q: r(q), e: r(q / 2), tr: r(q / 3), s: r(q / 4), h: r(q * 2), b: bpm })] };
  }

  /* ---------------- which question is it ---------------- */
  const low = q => String(q || '').toLowerCase();
  function answer(q) {
    const Q = low(q);
    if (/კვინტების წრე|კვინტური წრე|კვარტ-კვინტ|circle of fifths|quintenzirkel|квинтов/u.test(Q)) return circleAnswer();
    const ns = notesIn(q), cs = chordsIn(q);
    // frequency
    if (/სიხშირ|ჰერც|\bhz\b|hertz|frequen|частот/u.test(Q)) {
      const hz = Q.match(/(\d{2,4}(?:[.,]\d+)?)\s*(?:hz|ჰც|ჰერც)/u);
      if (hz) { const f = parseFloat(hz[1].replace(',', '.')); if (f >= 20 && f <= 5000) return hzAnswer(f); }
      const n = ns.find(x => x.oct != null) || (ns[0] && Object.assign({}, ns[0], { oct: 4 }));
      if (n) return freqAnswer(n);
    }
    // tempo in milliseconds
    const bpm = Q.match(/(\d{2,3})\s*(?:bpm|ბპმ|დარტყმა წუთში|beats per minute)/u);
    if (bpm && /წამ|ms\b|მილი|second|how long|ხანგრძლ|რამდენ|длител|секунд/u.test(Q)) { const b = +bpm[1]; if (b >= 20 && b <= 400) return tempoAnswer(b); }
    // transposition
    if (/ტრანსპო|გადაიტან|გადავიტან|გადაწიე|transpos|transpon|транспон/u.test(Q) && cs.length) {
      const tg = String(q).match(/(?:to|into|in|→|in die|в)\s+([A-G](?:♯|#|♭|b)?)(m(?!aj))?|([A-G](?:♯|#|♭|b)?)(m(?!aj))?\s*-?\s*(?:ში|ზე|მდე)(?=\s|$|[.,!?])/u);
      let target = null, prog = cs;
      if (tg) {
        const nn = notesIn(tg[1] || tg[3])[0], after = low(String(q).slice(tg.index + tg[0].length, tg.index + tg[0].length + 14));
        if (nn) target = { n: nn, minor: tg[2] || tg[4] || MINW.test(after) ? true : MAJW.test(after) ? false : null };
        // the chord named as the target is not part of the progression
        prog = chordsIn(String(q).slice(0, tg.index) + ' ' + String(q).slice(tg.index + tg[0].length));
      }
      const semi = Q.match(/([+-]?\d{1,2})\s*(?:ნახევარ|semi|half|полутон|ნ\.?ტ)/u), tone = Q.match(/([+-]?\d{1,2}(?:[.,]5)?)\s*(?:ტონ|whole|tone|тон)/u);
      let n = semi ? +semi[1] : tone ? Math.round(parseFloat(tone[1].replace(',', '.')) * 2) : null;
      if (n != null && /ქვემოთ|დაბლა|ქვევით|down|lower|вниз/u.test(Q)) n = -Math.abs(n);
      if (prog.length && (n != null || target)) return transposeAnswer(prog, n || 0, n == null ? target : null);
      return { title: t('smt.tT'), lines: [t('smt.tHow')], src: 'fact' };
    }
    // the key of a progression, its numerals
    if (cs.length >= 2 && /ტონალობ|რა კილო|რომელ კილო|what key|which key|in what key|roman|რომაულ|საფეხურ|ფუნქცი|тональн|tonart/u.test(Q) && !MAJW.test(Q) && !MINW.test(Q)) return keyGuessAnswer(cs);
    // a chord from its notes
    if (ns.length >= 2 && /რა აკორდ|რომელი აკორდ|რა აკორდს|რომელ აკორდ|what chord|which chord|identify|name this chord|какой аккорд|welcher akkord/u.test(Q)) return identifyAnswer(ns);
    // the notes of a chord
    if (cs.length === 1 && /ნოტ|ბგერ|შედგება|შემადგენ|spell|notes|tones|consist|made of|formula|ფორმულ|ноты|звуки|töne|noten/u.test(Q) && !/გამა|scale|ტონალობ|key/u.test(Q)) return spellAnswer(cs[0]);
    // the interval between two notes
    if (ns.length >= 2 && /ინტერვალ|interval|интервал|რამდენი ნახევარტონ|how many semitones|სიშორე|distance|between/u.test(Q)) return intervalAnswer(ns[0], ns[1]);
    // a note some interval above or below another
    if (ns.length >= 1 && (NUMW.some(([re]) => re.test(Q)) || /ტრიტონ|tritone/u.test(Q)) && (QW.some(([re]) => re.test(Q)) || /კვარტ|კვინტ|ოქტავ|fourth|fifth|octave|ტრიტონ|tritone/u.test(Q))) {
      const r = intervalFrom(Q, ns[ns.length - 1]); if (r) return r;
    }
    // a scale, a mode, a key
    const kind = (SCW.find(([re]) => re.test(Q)) || [])[1];
    const keyTok = cs.length === 1 && /^(|m)$/.test(cs[0].ty.k) && /ტონალობ|\bkey\b|tonart|тональн/u.test(Q) ? cs[0] : null;
    const n0 = ns[0] || (keyTok && keyTok.root);
    if (n0) {
      const scaleW = /გამა|ბგერათრიგ|scale|гамм|tonleiter|escala|gamme|scala/u.test(Q);
      const playQ = /როგორ ავიღო|როგორ დავუკრა|აიღება|how (do|to|can) .*(play|hold|take)|как (взять|играть)/u.test(Q);
      let minor = MINW.test(Q) || !!(keyTok && keyTok.ty.k === 'm'); const major = MAJW.test(Q) || !!(keyTok && keyTok.ty.k === '');
      // "the relative minor of C major": the mode is the word right after the note
      if (minor && major) minor = !/([a-g][♯♭#b]?|დო|რე|მი|ფა|სოლ|ლა|სი)(\s|-)*(დიეზ\S*|ბემოლ\S*)?\s*(მაჟორ|major|мажор)/u.test(Q);
      // "C major" alone, written in letters, is more likely the chord: the chord page answers it
      const bare = Q.trim().split(/\s+/).length <= 2 && !scaleW && !keyTok && !n0.ka;
      if (kind && !(kind === 'major' || kind === 'minor')) return scaleAnswer(n0, kind);
      if (kind) return scaleW ? scaleAnswer(n0, kind) : keyAnswer(n0, kind === 'minor', 'all');
      if ((major || minor) && !(playQ && !scaleW) && !bare) {
        // „რა აკორდებია ლა მინორში" is the key's chords; "Am chord" alone is a chord, and goes on to the chord page
        const chordsW = /აკორდ|chord|аккорд|akkord|harmon/u.test(Q);
        if (chordsW && !/(ში|ტონალობ|\bin\b|\bkey\b|в )/u.test(Q)) return null;
        if (scaleW && !chordsW) return scaleAnswer(n0, minor ? 'minor' : 'major');
        const want = chordsW ? 'chords' : /ნიშ|signature|დიეზ|ბემოლ|sharps|flats|ალტერაც|знак|vorzeichen/u.test(Q) ? 'sig' : /პარალელ|relative|ერთსახელ|parallel|параллел/u.test(Q) ? 'rel' : 'all';
        return keyAnswer(n0, minor, want);
      }
    }
    return null;
  }

  /* ---------------- one fact a day, for her morning message ---------------- */
  function daily(seed) {
    const keys = ['C', 'G', 'D', 'A', 'E', 'F', 'B♭'], mins = ['A', 'E', 'D', 'B', 'G', 'C', 'F♯'];
    const s = mod(seed, 6);
    if (s === 0) return keyAnswer(note(keys[mod(seed >> 1, 7)]), false, 'chords');
    if (s === 1) return keyAnswer(note(mins[mod(seed >> 1, 7)]), true, 'chords');
    if (s === 2) { const ks = ['dorian', 'mixo', 'harm', 'mpenta', 'penta', 'phrygian', 'lydian']; return scaleAnswer(note('A'), ks[mod(seed >> 1, ks.length)]); }
    if (s === 3) { const pairs = [['A', 'C♯'], ['A', 'E'], ['C♯', 'E'], ['E', 'A'], ['D', 'F'], ['G', 'D'], ['F', 'B']]; const p = pairs[mod(seed >> 1, pairs.length)]; return intervalAnswer(note(p[0]), note(p[1])); }
    if (s === 4) { const cs = ['Am', 'Dm', 'E7', 'Cmaj7', 'Bm7♭5', 'G7', 'Fmaj7', 'Asus4', 'Edim']; const c = chordTok(cs[mod(seed >> 1, cs.length)]); return c ? spellAnswer(c) : circleAnswer(); }
    return circleAnswer();
  }

  /** the notes of a chord by name, around middle C (for the sound when the panduri has no shape for it) */
  function chordMidis(name) { const c = chordTok(name); if (!c) return null; const m0 = 57 + mod(pcOf(c.root) - 9, 12); return c.ty.iv.map(s => m0 + s); }
  return { answer, daily, chordMidis, notesIn, chordsIn, chordTok, between, scaleNotes, signature, diatonic, keyOf, identify, nm, note, transposeAnswer };
})();

PD.i18n.add({
  'smt.major': ['მაჟორი', 'major'], 'smt.minor': ['მინორი', 'minor'],
  'smt.solf': ['სოლფეჯიოთი: {s}', 'In solfège: {s}'],
  'smt.n1': ['პრიმა', 'unison'], 'smt.n2': ['სეკუნდა', 'second'], 'smt.n3': ['ტერცია', 'third'], 'smt.n4': ['კვარტა', 'fourth'], 'smt.n5': ['კვინტა', 'fifth'], 'smt.n6': ['სექსტა', 'sixth'], 'smt.n7': ['სეპტიმა', 'seventh'], 'smt.n8': ['ოქტავა', 'octave'],
  'smt.q.P': ['წმინდა', 'perfect'], 'smt.q.M': ['დიდი', 'major'], 'smt.q.m': ['პატარა', 'minor'], 'smt.q.A': ['გადიდებული', 'augmented'], 'smt.q.d': ['შემცირებული', 'diminished'], 'smt.q.AA': ['ორმაგად გადიდებული', 'doubly augmented'], 'smt.q.dd': ['ორმაგად შემცირებული', 'doubly diminished'],
  'smt.semis': ['{n} ნახევარტონი ({t} ტონი)', '{n} semitones ({t} tones)'],
  'smt.inv': ['შებრუნება ({a} → {b}): {n}, {s} ნახევარტონი.', 'Inverted ({a} → {b}): {n}, {s} semitones.'],
  'smt.tritone': ['6 ნახევარტონი ოქტავის ზუსტად შუაა — ამას ტრიტონს ეძახიან (სამი მთელი ტონი).', '6 semitones is exactly half an octave — this is called the tritone (three whole tones).'],
  'smt.onNeck': ['ფანდურზე, ერთ სიმზე: {n} ლადით მაღლა.', 'On the fanduri, along one string: {n} frets higher.'],
  'smt.above': ['{n}-დან ზემოთ', 'above {n}'], 'smt.below': ['{n}-დან ქვემოთ', 'below {n}'],
  'smt.isAbove': ['{n}-დან {i} ზემოთ არის {r}.', 'A {i} above {n} is {r}.'], 'smt.isBelow': ['{n}-დან {i} ქვემოთ არის {r}.', 'A {i} below {n} is {r}.'],
  'smt.pApart': ['▶ ცალ-ცალკე', '▶ One after the other'], 'smt.pTogether': ['▶ ერთად', '▶ Together'], 'smt.pScale': ['▶ გამა', '▶ The scale'],
  'smt.pCad': ['▶ {s}', '▶ {s}'], 'smt.pChord': ['▶ აკორდი', '▶ The chord'], 'smt.pArp': ['▶ ბგერა-ბგერა', '▶ Note by note'], 'smt.pProg': ['▶ თანმიმდევრობა', '▶ The progression'],
  'smt.pBefore': ['▶ ადრე', '▶ Before'], 'smt.pAfter': ['▶ გადატანილი', '▶ Transposed'], 'smt.pNote': ['▶ ნოტი', '▶ The note'],
  'smt.scale': ['ნოტები: {s}', 'Notes: {s}'],
  'smt.sig': ['საკვანძო ნიშნები: {s}', 'Key signature: {s}'],
  'smt.sig0': ['არცერთი დიეზი და ბემოლი', 'no sharps or flats'], 'smt.sigSh': ['{n} დიეზი — {s}', '{n} sharps — {s}'], 'smt.sigFl': ['{n} ბემოლი — {s}', '{n} flats — {s}'], 'smt.sigSh1': ['1 დიეზი — {s}', '1 sharp — {s}'], 'smt.sigFl1': ['1 ბემოლი — {s}', '1 flat — {s}'],
  'smt.sigTheo': ['თეორიული ტონალობაა (ორმაგი ნიშნები სჭირდება) — ჩვეულებრივ მის ენჰარმონიულ ტოლს წერენ', 'a theoretical key (it needs double sharps or flats) — its enharmonic twin is written instead'],
  'smt.relMin': ['პარალელური მინორი (იგივე ნიშნები): {k}', 'Relative minor (same signature): {k}'], 'smt.relMaj': ['პარალელური მაჟორი (იგივე ნიშნები): {k}', 'Relative major (same signature): {k}'],
  'smt.par': ['ერთსახელიანი: {k} — {s}', 'Parallel key (same tonic): {k} — {s}'],
  'smt.triads': ['ტრიადები: {s}', 'Triads: {s}'], 'smt.sevenths': ['სეპტაკორდები: {s}', 'Seventh chords: {s}'],
  'smt.harmV': ['ჰარმონიულ მინორში VII საფეხური ამაღლებულია, ამიტომ V მაჟორული ხდება: {v} ან {v7}, ხოლო vii° — {d}.', 'In harmonic minor the 7th degree is raised, so V becomes major: {v} or {v7}, and vii° is {d}.'],
  'smt.func': ['ტონიკა {t} · სუბდომინანტა {s} · დომინანტა {d}', 'Tonic {t} · subdominant {s} · dominant {d}'],
  'smt.chordsT': ['აკორდები', 'chords'], 'smt.circle': ['კვინტების წრე', 'Circle of fifths'], 'smt.onScales': ['გამები ტარზე', 'Scales on the neck'],
  'smt.degs': ['საფეხურები: {s}', 'Degrees: {s}'], 'smt.steps': ['ნაბიჯები: {s}', 'Steps: {s}'],
  'smt.st.T': ['ტ', 'T'], 'smt.st.S': ['ნ', 'S'], 'smt.st.TS': ['ტ+ნ', 'T+S'],
  'smt.modeOf': ['ნოტები იგივეა, რაც ამ ტონალობაში: {p} — ოღონდ გამა {n}-დან იწყება (მე-{d} საფეხურიდან).', 'The same notes as {p} — but the scale starts from {n} (its degree {d}).'],
  'smt.harmNote': ['ნატურალური მინორისგან განსხვავება: VII საფეხური ნახევარტონით მაღლაა — ამიტომ VI-სა და VII-ს შორის ტონ-ნახევარია.', 'Unlike natural minor, the 7th degree is a semitone higher — so there is a tone and a half between the 6th and 7th.'],
  'smt.melNote': ['კლასიკურ თეორიაში მელოდიური მინორი ზემოთ ასე ჟღერს, ქვემოთ კი ნატურალურ მინორად ბრუნდება.', 'In classical theory melodic minor sounds like this going up and returns to natural minor coming down.'],
  'smt.bluesNote': ['ბლუზური ბგერა პენტატონიკას ემატება — ის „ორ ტონალობას შორის" ჟღერს.', 'The blue note is added to the pentatonic scale — it sounds “between” two notes.'],
  'smt.cNotes': ['ნოტები: {s}', 'Notes: {s}'], 'smt.cForm': ['ფორმულა: {s}', 'Formula: {s}'], 'smt.cIvs': ['ფუძიდან: {s}', 'From the root: {s}'],
  'smt.cOmit': ['ფანდურის სამ სიმზე ჩვეულებრივ გამოტოვებულია: {s}', 'On the fanduri’s three strings this is usually left out: {s}'],
  'smt.idNone': ['ამ ნოტებისგან ცნობილი აკორდი ვერ შევადგინე. სცადე სხვა რიგით, ან დაამატე ნოტი.', 'These notes do not make a chord I know. Try another order, or add a note.'],
  'smt.idIs': ['{s} = {c} ({ty}).', '{s} = {c} ({ty}).'], 'smt.idOmit': ['ერთი ბგერა (ჩვეულებრივ კვინტა) აკლია — ეს ნორმალურია, აკორდი მაინც ასე იკითხება.', 'One tone (usually the fifth) is missing — that is normal; the chord still reads this way.'],
  'smt.idInv': ['ბანში ფუძე არ არის: {c} — {n}.', 'The root is not in the bass: {c} — {n}.'],
  'smt.inv1': ['პირველი შებრუნება (ბანში ტერციაა)', 'first inversion (the third in the bass)'], 'smt.inv2': ['მეორე შებრუნება (ბანში კვინტაა)', 'second inversion (the fifth in the bass)'], 'smt.inv3': ['მესამე შებრუნება (ბანში სეპტიმაა)', 'third inversion (the seventh in the bass)'],
  'smt.idAlso': ['სხვანაირადაც შეიძლება დაიწეროს: {s}', 'It can also be named: {s}'],
  'smt.kIs': ['{s} — ყველაზე მეტად ესადაგება: {k}.', '{s} — fits best in: {k}.'],
  'smt.kRom': ['საფეხურებით: {s}', 'As degrees: {s}'], 'smt.kAlt': ['ან პარალელურ ტონალობაში — {k}: {s}', 'Or in its relative key — {k}: {s}'],
  'smt.kHarm': ['{s} — ჰარმონიული მინორიდანაა (ამაღლებული VII საფეხური).', '{s} — from harmonic minor (the raised 7th degree).'],
  'smt.kOut': ['ტონალობის გარეთ: {s} — ნასესხები ან გადახრაა.', 'Outside the key: {s} — borrowed, or a brief move to another key.'],
  'smt.kEar': ['ეს გამოთვლაა აკორდების ნოტებით. ტონიკას ყური ადასტურებს: სად „ისვენებს" სიმღერა, ბოლოს რომელ აკორდზე მთავრდება.', 'This is computed from the chords’ notes. The ear confirms the tonic: where the song “rests”, the chord it ends on.'],
  'smt.tT': ['ტრანსპოზიცია', 'Transposition'], 'smt.tBy': ['{n} ნახევარტონი', '{n} semitones'], 'smt.tKey': ['ტონალობა: {a} → {b}', 'Key: {a} → {b}'],
  'smt.tAll': ['ფანდურზე ყველა ეს აკორდი აიღება — აპი თითოეულს აწყობიდან ითვლის.', 'All of these chords can be taken on the fanduri — the app computes each from the tuning.'],
  'smt.tMiss': ['ფანდურზე პოზიცია ვერ ვიპოვე: {s} — სცადე სხვა ტონალობა.', 'No fanduri position found for: {s} — try another key.'],
  'smt.tHow': ['მითხარი, რამდენით: მაგ. „Am F C G ტრანსპოზიცია +2 ნახევარტონი" ან „Am F C G გადაიტანე Dm-ში".', 'Tell me by how much: e.g. “transpose Am F C G +2 semitones” or “transpose Am F C G to Dm”.'],
  'smt.circleT': ['კვინტების წრე', 'The circle of fifths'],
  'smt.cfSh': ['კვინტით ზემოთ (დიეზები): {s}', 'Up in fifths (sharps): {s}'], 'smt.cfFl': ['კვინტით ქვემოთ (ბემოლები): {s}', 'Down in fifths (flats): {s}'],
  'smt.cfRel': ['პარალელური მინორები: {s}', 'Relative minors: {s}'], 'smt.cfOrd': ['დიეზების რიგი: {a} · ბემოლების რიგი: {b}', 'Order of sharps: {a} · order of flats: {b}'],
  'smt.cfEnh': ['F♯ = G♭ და C♯ = D♭ — წრე აქ იკვრება (ენჰარმონიული ტოლობა).', 'F♯ = G♭ and C♯ = D♭ — this is where the circle closes (enharmonic equivalence).'],
  'smt.fIs': ['{n} = {f} Hz (როცა A4 = {a} Hz).', '{n} = {f} Hz (with A4 = {a} Hz).'],
  'smt.fPos': ['ფანდურზე: {s}', 'On the fanduri: {s}'], 'smt.fNoPos': ['ეს ნოტი ფანდურის დიაპაზონის გარეთაა.', 'This note is outside the fanduri’s range.'],
  'smt.hzIs': ['{f} Hz ყველაზე ახლოსაა {n}-თან ({c} ცენტი; A4 = {a} Hz).', '{f} Hz is nearest to {n} ({c} cents; A4 = {a} Hz).'],
  'smt.bpm': ['{b} BPM: მეოთხედი = {q} ms · ნახევარი = {h} ms · მერვედი = {e} ms · ტრიოლი = {tr} ms · მეთექვსმეტედი = {s} ms.', '{b} BPM: quarter = {q} ms · half = {h} ms · eighth = {e} ms · triplet = {tr} ms · sixteenth = {s} ms.']
});
