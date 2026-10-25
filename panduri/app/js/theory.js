/* =====================================================================
   Music theory on top of the approved instrument profile.
   String count, tuning, fret count, fret pitches and fret positions all
   come from PD.instrument — nothing here assumes a universal panduri or
   equal temperament. Alternate tunings only change the open-string
   pitches; the fret map (cent offsets) stays the instrument's.
   ===================================================================== */
PD.theory = (() => {
  const I = PD.instrument;
  const NN = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];
  const NN_KA = ['დო', 'დო♯', 'რე', 'რე♯', 'მი', 'ფა', 'ფა♯', 'სოლ', 'სოლ♯', 'ლა', 'ლა♯', 'სი'];
  const std = () => ({ id: 'std', name: { ka: 'ინსტრუმენტის აწყობა · ' + I.profile.strings.map(s => s.label).join(' '), en: 'Instrument tuning · ' + I.profile.strings.map(s => s.label).join(' ') }, strings: I.profile.strings.map(s => s.open) });
  const TUNINGS = [std()];
  PD.store.get('tunings.custom', []).forEach(tu => { if (tu && Array.isArray(tu.strings) && tu.strings.length === I.stringCount) TUNINGS.push(tu); });
  let cur = TUNINGS.find(x => x.id === PD.store.get('tuning', 'std')) || TUNINGS[0];
  PD.bus.on('instrument', () => { TUNINGS[0] = std(); if (cur.id === 'std') cur = TUNINGS[0]; });
  const api = {
    NN, NN_KA, TUNINGS,
    get FRETS() { return I.fretCount; },
    get STRINGS() { return I.stringCount; },
    get tuning() { return cur; },
    setTuning(id) { const x = TUNINGS.find(t => t.id === id); if (x) { cur = x; PD.store.set('tuning', id); PD.bus.emit('tuning', x); } },
    open(s) { return cur.strings[s - 1]; },
    /** pitch at string s, fret f from the instrument's fret map (may be fractional if cent offsets are set) */
    midi(s, f) { return I.pitch(s, f, cur.strings[s - 1]); },
    pc: m => ((Math.round(m) % 12) + 12) % 12,
    name(m) { const r = Math.round(m); return NN[api.pc(r)] + (Math.floor(r / 12) - 1); },
    nameKa(m) { return NN_KA[api.pc(m)]; },
    pcName(m) { return NN[api.pc(m)]; },
    NN_FLAT: ['C', 'D♭', 'D', 'E♭', 'E', 'F', 'G♭', 'G', 'A♭', 'A', 'B♭', 'B'],
    NN_KA_FLAT: ['დო', 'რე♭', 'რე', 'მი♭', 'მი', 'ფა', 'სოლ♭', 'სოლ', 'ლა♭', 'ლა', 'სი♭', 'სი'],
    /** spell a pitch with flats (B♭ rather than A♯) */
    nameFlat(m) { const r = Math.round(m); return api.NN_FLAT[api.pc(r)] + (Math.floor(r / 12) - 1); },
    nameKaFlat(m) { return api.NN_KA_FLAT[api.pc(m)]; },
    /** chords whose notes are normally written with flats (F, B♭, E♭, A♭, D♭ and the minor keys D, G, C, F …) */
    prefersFlat(root, q) { return [3, 5, 8, 10].includes(root) || (/^m(?!aj)|dim|♭5/.test(q || '') && [0, 2, 5, 7].includes(root)); },
    /** a chord tone spelled from the root's letter: C♯7 = C♯ · E♯ · G♯ · B, C♯m = C♯ · E · G♯, Cdim7 = C · E♭ · G♭ · B𝄫.
        root = index into ROOTS (as the chord is named), q = chord type key */
    spell(m, root, q) {
      const LET = ['C', 'D', 'E', 'F', 'G', 'A', 'B'], LPC = [0, 2, 4, 5, 7, 9, 11], KA = ['დო', 'რე', 'მი', 'ფა', 'სოლ', 'ლა', 'სი'];
      const rn = api.ROOTS[root], L0 = LET.indexOf(rn[0]), r = Math.round(m), iv = ((api.pc(r) - root) % 12 + 12) % 12; q = q || '';
      let deg = [0, 1, 1, 2, 2, 3, 4, 4, 4, 5, 6, 6][iv];
      if (iv === 6 && !/dim|♭5/.test(q)) deg = 3;        // ♯4 (outside diminished chords)
      if (iv === 8 && !/aug/.test(q)) deg = 5;           // ♭6
      if (iv === 9 && q === 'dim7') deg = 6;             // 𝄫7
      if (iv === 3 && /add9|sus2/.test(q)) deg = 2;
      const li = (L0 + deg) % 7, acc = ((api.pc(r) - LPC[li] + 18) % 12) - 6;
      const sign = ['𝄫', '♭', '', '♯', '𝄪'][acc + 2] != null ? ['𝄫', '♭', '', '♯', '𝄪'][acc + 2] : '?';
      return { name: LET[li] + sign + (Math.floor((r - acc) / 12) - 1), ka: KA[li] + sign };
    },
    a4() { return PD.store.get('a4', 440); },
    freq(m) { return api.a4() * Math.pow(2, (m - 69) / 12); },
    midiOf(f) { return 69 + 12 * Math.log2(f / api.a4()); },
    /** physical fret position (fraction of scale length) from the instrument's measured/computed position map */
    fretFrac: n => I.fretFrac(n),
    stringName(s) { const st = I.string(s); return cur.id === 'std' && st ? st.label : api.pcName(cur.strings[s - 1]); },
    color: s => I.color(s),
    /** every (string, fret) whose mapped pitch is within 50 cents of m */
    positions(m) { const out = []; for (let s = 1; s <= I.stringCount; s++) for (let f = 0; f <= I.fretCount; f++) if (Math.abs(api.midi(s, f) - m) < .5) out.push({ s, f }); return out; },
    /* ---------- chords: every root × every chord type, computed from the tuning ----------
       need = tones a 3-string voicing must contain (the others may be left out, e.g. the 5th of a 7th chord) */
    ROOTS: ['C', 'C♯', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'A♭', 'A', 'B♭', 'B'],
    /** names shown for the roots (sharps); ROOTS above keep the spelling used for the chord tones */
    ROOT_NAMES: ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'],
    ROOT_NAMES_KA: ['დო', 'დო დიეზი', 'რე', 'რე დიეზი', 'მი', 'ფა', 'ფა დიეზი', 'სოლ', 'სოლ დიეზი', 'ლა', 'ლა დიეზი', 'სი'],
    CAT: { '': 'major', '6': 'major', 'add9': 'major', 'm': 'minor', 'm6': 'minor', 'm(add9)': 'minor', '7': 'seventh', 'maj7': 'seventh', 'm7': 'seventh', 'm(maj7)': 'seventh', 'sus2': 'sus', 'sus4': 'sus', '7sus4': 'sus', '9': 'ext', 'maj9': 'ext', 'm9': 'ext', '11': 'ext', '13': 'ext', 'dim': 'dim', 'dim7': 'dim', 'm7♭5': 'dim', 'aug': 'aug', '7♯5': 'aug', '7♭5': 'other', '5': 'other' },
    ROOTS_KA: ['დო', 'დო დიეზი', 'რე', 'მი ბემოლი', 'მი', 'ფა', 'ფა დიეზი', 'სოლ', 'ლა ბემოლი', 'ლა', 'სი ბემოლი', 'სი'],
    CHORD_TYPES: [
      { k: '', iv: [0, 4, 7], need: [0, 4, 7], ka: 'მაჟორი', en: 'major', d: ['მთავარი ბგერა + დიდი ტერცია (4 ნახევარტონი) + წმინდა კვინტა (7). ნათელი, „მხიარული“ ჟღერადობა.', 'Root + major third (4 semitones) + perfect fifth (7). Bright sound.'] },
      { k: 'm', iv: [0, 3, 7], need: [0, 3, 7], ka: 'მინორი', en: 'minor', d: ['მთავარი ბგერა + პატარა ტერცია (3 ნახევარტონი) + წმინდა კვინტა (7). რბილი, „სევდიანი“ ჟღერადობა.', 'Root + minor third (3 semitones) + perfect fifth (7). Soft, darker sound.'] },
      { k: '7', iv: [0, 4, 7, 10], need: [0, 4, 10], ka: 'დომინანტსეპტაკორდი', en: 'dominant 7th', d: ['მაჟორს ემატება პატარა სეპტიმა (10 ნახევარტონი). სამ სიმზე კვინტა გამოტოვებულია. მიისწრაფვის შემდეგი აკორდისკენ.', 'Major plus a minor seventh (10 semitones); on three strings the fifth is left out. Wants to move on to the next chord.'] },
      { k: 'm7', iv: [0, 3, 7, 10], need: [0, 3, 10], ka: 'მცირე მინორული სეპტაკორდი', en: 'minor 7th', d: ['მინორს ემატება პატარა სეპტიმა (10). სამ სიმზე კვინტა გამოტოვებულია.', 'Minor plus a minor seventh (10); the fifth is left out on three strings.'] },
      { k: 'maj7', iv: [0, 4, 7, 11], need: [0, 4, 11], ka: 'დიდი მაჟორული სეპტაკორდი', en: 'major 7th', d: ['მაჟორს ემატება დიდი სეპტიმა (11). რბილი, „ჯაზური“ ჟღერადობა.', 'Major plus a major seventh (11). Soft, jazzy colour.'] },
      { k: 'dim', iv: [0, 3, 6], need: [0, 3, 6], ka: 'შემცირებული', en: 'diminished', d: ['ორი პატარა ტერცია ერთმანეთზე: 0 · 3 · 6 ნახევარტონი. დაძაბული ჟღერადობა.', 'Two minor thirds stacked: 0 · 3 · 6 semitones. Tense sound.'] },
      { k: 'dim7', iv: [0, 3, 6, 9], need: [0, 3, 6], ka: 'შემცირებული სეპტაკორდი', en: 'diminished 7th', d: ['სამი პატარა ტერცია: 0 · 3 · 6 · 9. სამ სიმზე ერთი ბგერა გამოტოვებულია.', 'Three minor thirds: 0 · 3 · 6 · 9; one tone is left out on three strings.'], alt: [[0, 6, 9], [0, 3, 9]] },
      { k: 'm7♭5', iv: [0, 3, 6, 10], need: [0, 6, 10], ka: 'მცირე შემცირებული სეპტაკორდი', en: 'half-diminished (m7♭5)', d: ['შემცირებულს ემატება პატარა სეპტიმა (10).', 'Diminished plus a minor seventh (10).'], alt: [[0, 3, 6]] },
      { k: 'aug', iv: [0, 4, 8], need: [0, 4, 8], ka: 'გადიდებული', en: 'augmented', d: ['ორი დიდი ტერცია: 0 · 4 · 8 ნახევარტონი.', 'Two major thirds: 0 · 4 · 8 semitones.'] },
      { k: 'sus2', iv: [0, 2, 7], need: [0, 2, 7], ka: 'sus2 (სეკუნდით)', en: 'suspended 2nd', d: ['ტერციის ნაცვლად დიდი სეკუნდა (2): არც მაჟორია, არც მინორი.', 'A major second (2) instead of the third: neither major nor minor.'] },
      { k: 'sus4', iv: [0, 5, 7], need: [0, 5, 7], ka: 'sus4 (კვარტით)', en: 'suspended 4th', d: ['ტერციის ნაცვლად წმინდა კვარტა (5). ხშირად მაჟორში გადადის.', 'A perfect fourth (5) instead of the third; often resolves to major.'] },
      { k: '6', iv: [0, 4, 7, 9], need: [0, 4, 9], ka: 'მაჟორი სექსტით (6)', en: 'major 6th', d: ['მაჟორს ემატება დიდი სექსტა (9).', 'Major plus a major sixth (9).'] },
      { k: 'm6', iv: [0, 3, 7, 9], need: [0, 3, 9], ka: 'მინორი სექსტით (m6)', en: 'minor 6th', d: ['მინორს ემატება დიდი სექსტა (9).', 'Minor plus a major sixth (9).'] },
      { k: 'add9', iv: [0, 2, 4, 7], need: [0, 2, 4], ka: 'მაჟორი ნონით (add9)', en: 'add 9', d: ['მაჟორს ემატება ნონა (სეკუნდა ოქტავის ზემოთ). სამ სიმზე კვინტა გამოტოვებულია.', 'Major plus the ninth; the fifth is left out on three strings.'] },
      { k: '5', iv: [0, 7], need: [0, 7], ka: 'კვინტა (5)', en: 'power chord (5)', d: ['მხოლოდ მთავარი ბგერა და კვინტა — არც მაჟორი, არც მინორი.', 'Only root and fifth — neither major nor minor.'] },
      { k: 'm(maj7)', iv: [0, 3, 7, 11], need: [0, 3, 11], ka: 'მინორი დიდი სეპტიმით', en: 'minor-major 7th', d: ['მინორს ემატება დიდი სეპტიმა (11). სამ სიმზე კვინტა გამოტოვებულია.', 'Minor plus a major seventh (11). On three strings the fifth is left out.'] },
      { k: '7sus4', iv: [0, 5, 7, 10], need: [0, 5, 10], ka: 'სეპტაკორდი კვარტით (7sus4)', en: '7sus4', d: ['sus4-ს ემატება პატარა სეპტიმა (10). სამ სიმზე კვინტა გამოტოვებულია.', 'sus4 plus a minor seventh (10). On three strings the fifth is left out.'] },
      { k: 'm(add9)', iv: [0, 2, 3, 7], need: [0, 2, 3], ka: 'მინორი ნონით', en: 'minor add 9', d: ['მინორს ემატება ნონა. სამ სიმზე კვინტა გამოტოვებულია.', 'Minor plus a ninth. On three strings the fifth is left out.'] },
      { k: '9', iv: [0, 2, 4, 7, 10], need: [4, 10, 2], alt: [[0, 4, 10]], ka: 'ნონაკორდი (9)', en: 'dominant 9th', d: ['დომინანტსეპტაკორდს ემატება ნონა. სამ სიმზე: ტერცია · სეპტიმა · ნონა (ძირითადი ბგერა ბანმა ან სხვამ შეიძლება დაუკრას).', 'A dominant 7th plus a ninth. On three strings: 3rd · 7th · 9th (the root can come from the bass or another player).'] },
      { k: 'maj9', iv: [0, 2, 4, 7, 11], need: [4, 11, 2], alt: [[0, 4, 11]], ka: 'დიდი მაჟორული ნონაკორდი', en: 'major 9th', d: ['maj7-ს ემატება ნონა. სამ სიმზე: ტერცია · დიდი სეპტიმა · ნონა.', 'maj7 plus a ninth. On three strings: 3rd · major 7th · 9th.'] },
      { k: 'm9', iv: [0, 2, 3, 7, 10], need: [3, 10, 2], alt: [[0, 3, 10]], ka: 'მინორული ნონაკორდი', en: 'minor 9th', d: ['m7-ს ემატება ნონა. სამ სიმზე: პატარა ტერცია · სეპტიმა · ნონა.', 'm7 plus a ninth. On three strings: minor 3rd · 7th · 9th.'] },
      { k: '11', iv: [0, 2, 5, 7, 10], need: [0, 5, 10], alt: [[10, 2, 5]], ka: 'უნდეციმაკორდი (11)', en: '11th', d: ['სეპტაკორდს ემატება უნდეციმა (11 = კვარტა ოქტავით მაღლა); ტერცია ჩვეულებრივ გამოტოვებულია. სამ სიმზე: ძირითადი · სეპტიმა · უნდეციმა.', 'A 7th chord plus the 11th; the 3rd is usually left out. On three strings: root · 7th · 11th.'] },
      { k: '13', iv: [0, 4, 7, 9, 10], need: [4, 10, 9], alt: [[0, 10, 9]], ka: 'ტერცდეციმაკორდი (13)', en: '13th', d: ['დომინანტსეპტაკორდს ემატება ტერცდეციმა (13 = სექსტა ოქტავით მაღლა). სამ სიმზე: ტერცია · სეპტიმა · ტერცდეციმა.', 'A dominant 7th plus the 13th. On three strings: 3rd · 7th · 13th.'] },
      { k: '7♭5', iv: [0, 4, 6, 10], need: [4, 6, 10], alt: [[0, 6, 10]], ka: 'სეპტაკორდი შემცირებული კვინტით', en: '7♭5', d: ['დომინანტსეპტაკორდი შემცირებული კვინტით (6). სამ სიმზე ერთი ბგერა გამოტოვებულია.', 'A dominant 7th with a flat fifth (6). On three strings one tone is left out.'] },
      { k: '7♯5', iv: [0, 4, 8, 10], need: [4, 8, 10], alt: [[0, 8, 10]], ka: 'სეპტაკორდი გადიდებული კვინტით', en: '7♯5', d: ['დომინანტსეპტაკორდი გადიდებული კვინტით (8). სამ სიმზე ერთი ბგერა გამოტოვებულია.', 'A dominant 7th with a sharp fifth (8). On three strings one tone is left out.'] }
    ],
    /** finger numbers for a shape: a barre (1) on the lowest fret when it covers neighbouring strings, then the next fingers */
    fingersFor(fr) {
      const idx = fr.map((f, i) => i).filter(i => fr[i] > 0), fg = fr.map(() => 0);
      if (!idx.length) return { fingers: fg, barre: false };
      const minF = Math.min(...idx.map(i => fr[i])), atMin = idx.filter(i => fr[i] === minF);
      let barre = false;
      if (atMin.length >= 2) { const lo = Math.min(...atMin), hi = Math.max(...atMin); let ok = true; for (let i = lo; i <= hi; i++) if (fr[i] < minF) ok = false; if (ok) { barre = true; for (let i = lo; i <= hi; i++) if (fr[i] === minF) fg[i] = 1; } }
      let next = barre ? 2 : 1;
      idx.filter(i => !fg[i]).sort((a, b) => fr[a] - fr[b] || a - b).forEach(i => { fg[i] = Math.max(next, 1 + fr[i] - minF); next = fg[i] + 1; });
      return Math.max(...fg) > 4 ? null : { fingers: fg, barre };
    },
    /** all playable shapes of one chord on this tuning, best first */
    voicings(root, type) {
      const T = typeof type === 'string' ? api.CHORD_TYPES.find(x => x.k === type) : type, n = I.stringCount, F = I.fretCount, out = [];
      const mk = cur.id + ':' + cur.strings.join(',') + ':' + F + ':' + root + ':' + T.k; api._vm = api._vm || {}; if (api._vm[mk]) return api._vm[mk];
      const tones = new Set(T.iv.map(i => (root + i) % 12)), needs = [T.need].concat(T.alt || []).map(nd => nd.map(i => (root + i) % 12));
      const fr = new Array(n).fill(0);
      const rec = s => {
        if (s === n) {
          const fretted = fr.filter(f => f > 0), span = fretted.length ? Math.max(...fretted) - Math.min(...fretted) : 0;
          if (span > 3) return;
          const ms = fr.map((f, i) => Math.round(api.midi(i + 1, f))), pcs = ms.map(m => ((m % 12) + 12) % 12);
          if (!pcs.every(p => tones.has(p))) return;
          const okMain = needs[0].every(p => pcs.includes(p));
          if (!okMain && !needs.some(nd => nd.every(p => pcs.includes(p)))) return;
          const fg = api.fingersFor(fr); if (!fg) return;
          const pos = fretted.length ? Math.min(...fretted) : 0, bass = pcs[ms.indexOf(Math.min(...ms))];
          const score = pos * 1.1 + span * .9 + new Set(fg.fingers.filter(Boolean)).size * .5 - (bass === root ? 1.4 : 0) - fr.filter(f => f === 0).length * .25 - (fg.barre ? .3 : 0) + (new Set(pcs).size < Math.min(3, T.iv.length) ? 1.2 : 0) + (okMain ? 0 : 2.5);
          /* The teacher's own way of taking a closed chord (teaching data, given by him, not derived):
             the thumb holds the bass (A) string, the index holds the 2nd voice (C♯), and the 1st voice (E)
             is taken by the index too when it sits on the same fret, by the middle finger one fret above,
             by the ring finger two frets above. Bm 2-1-2 → T 1 2 · Em 2-3-3 → T 1 1 · E 2-3-4 → T 1 2 ·
             Gm 1-1-3 → T 1 3 · G 2-1-3 → T 1 3.
             A plain barre across all three strings keeps the index on all of them, as before. */
          let fingers = fg.fingers, fsrc = null;
          const tf = api.teacherFingers(fr);
          if (tf) { fingers = tf.fingers; fsrc = tf.fsrc; }
          out.push({ frets: fr.slice(), fingers, fsrc, barre: fg.barre, pos, score });
          return;
        }
        for (let f = 0; f <= F; f++) { fr[s] = f; rec(s + 1); }
      };
      rec(0);
      return (api._vm[mk] = out.sort((a, b) => a.score - b.score));
    },
    /* The teacher's own way of taking a chord whose bass is stopped, low on the neck (his words, his examples):
       the bass is always the thumb; the two voices above it start at the index on the lowest of their frets and step
       up a finger per fret — same fret → the index closes both, one above → the middle, two → the ring, three → the
       little finger. Above the 5th fret the thumb no longer comes over, so the shape is fingered as computed.
       Bm 2-1-2 → T 1 2 · Em 2-3-3 → T 1 1 · E 2-3-4 → T 1 2 · Gm 1-1-3 → T 1 3 · G 2-1-3 → T 1 3 · C 3-3-3 → T 1 1.
       (His second way of closing a chord — the index across all three strings — is kept as its own position.) */
    teacherFingers(fr) {
      if (!fr || fr.length !== 3 || !(fr[0] > 0) || Math.max(...fr) > 5) {
        if (fr && fr.length === 3 && fr.every(x => x > 0) && fr[0] === fr[2] && fr[1] === fr[0] - 1 && fr[0] <= 9) return { fingers: ['T', 1, 2], fsrc: 'teacher-bm' };
        return null;
      }
      const up = [fr[1], fr[2]].filter(f => f > 0), base = up.length ? Math.min(...up) : 0;
      const pick = f => f > 0 ? Math.min(4, 1 + (f - base)) : 0;
      return { fingers: ['T', pick(fr[1]), pick(fr[2])], fsrc: 'teacher-thumb' };
    },
    /** the library: one entry per chord, with up to three positions (low · middle · high) */
    chordLibrary() {
      const key = cur.id + ':' + cur.strings.join(',') + ':' + I.fretCount;
      if (api._lib && api._libKey === key) return api._lib;
      const lib = [];
      api.CHORD_TYPES.forEach(T => api.ROOTS.forEach((rn, root) => {
        const all = api.voicings(root, T);
        const name = api.ROOT_NAMES[root] + T.k, alias = api.ROOTS[root] !== api.ROOT_NAMES[root] ? api.ROOTS[root] + T.k : null;
        // honest: when no playable three-string form exists the chord is listed without a diagram
        if (!all.length) { lib.push({ id: name, name, alias, root, q: T.k, cat: api.CAT[T.k] || 'other', none: true, kind: T.k, ka: api.ROOT_NAMES_KA[root] + ' · ' + T.ka, typeKa: T.ka, typeEn: T.en, frets: [0, 0, 0], fingers: [0, 0, 0], voicings: [], src: 'computed' }); return; }
        const pick = []; [[0, 4], [5, 9], [10, 99]].forEach(([a, b]) => { const v = all.find(x => x.pos >= a && x.pos <= b && !pick.includes(x)); if (v) pick.push(v); });
        if (!pick.length) pick.push(all[0]);
        lib.push({ id: name, name, alias, root, q: T.k, cat: api.CAT[T.k] || 'other', kind: T.k === '' ? 'maj' : T.k === 'm' ? 'min' : T.k, ka: api.ROOT_NAMES_KA[root] + ' · ' + T.ka, typeKa: T.ka, typeEn: T.en,
          frets: pick[0].frets, fingers: pick[0].fingers, barre: pick[0].barre, voicings: pick.map(v => ({ frets: v.frets, fingers: v.fingers, fsrc: v.fsrc, barre: v.barre, pos: v.pos })), fsrc: pick[0].fsrc, src: 'computed' });
      }));
      api._lib = lib; api._libKey = key; return lib;
    }
  };
  return api;
})();
