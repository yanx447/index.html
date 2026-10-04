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
    prefersFlat(root, q) { return [1, 3, 5, 8, 10].includes(root) || (/^m(?!aj)|dim|♭5/.test(q || '') && [0, 2, 5, 7].includes(root)); },
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
      { k: '5', iv: [0, 7], need: [0, 7], ka: 'კვინტა (5)', en: 'power chord (5)', d: ['მხოლოდ მთავარი ბგერა და კვინტა — არც მაჟორი, არც მინორი.', 'Only root and fifth — neither major nor minor.'] }
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
          out.push({ frets: fr.slice(), fingers: fg.fingers, barre: fg.barre, pos, score });
          return;
        }
        for (let f = 0; f <= F; f++) { fr[s] = f; rec(s + 1); }
      };
      rec(0);
      return out.sort((a, b) => a.score - b.score);
    },
    /** the library: one entry per chord, with up to three positions (low · middle · high) */
    chordLibrary() {
      const key = cur.id + ':' + cur.strings.join(',') + ':' + I.fretCount;
      if (api._lib && api._libKey === key) return api._lib;
      const lib = [];
      api.CHORD_TYPES.forEach(T => api.ROOTS.forEach((rn, root) => {
        const all = api.voicings(root, T); if (!all.length) return;
        const pick = []; [[0, 4], [5, 9], [10, 99]].forEach(([a, b]) => { const v = all.find(x => x.pos >= a && x.pos <= b && !pick.includes(x)); if (v) pick.push(v); });
        if (!pick.length) pick.push(all[0]);
        const name = rn + T.k;
        lib.push({ id: name, name, root, q: T.k, kind: T.k === '' ? 'maj' : T.k === 'm' ? 'min' : T.k, ka: api.ROOTS_KA[root] + ' · ' + T.ka, typeKa: T.ka, typeEn: T.en,
          frets: pick[0].frets, fingers: pick[0].fingers, barre: pick[0].barre, voicings: pick.map(v => ({ frets: v.frets, fingers: v.fingers, barre: v.barre, pos: v.pos })), src: 'computed' });
      }));
      api._lib = lib; api._libKey = key; return lib;
    }
  };
  return api;
})();
