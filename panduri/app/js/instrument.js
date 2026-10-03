/* =====================================================================
   Approved instrument profile.
   Everything the app knows about THE teacher's panduri lives here as
   data: strings (order, tuning, colour), fret count, an explicit
   per-string fret pitch map, physical fret positions, string spacing,
   scale length and body/headstock geometry.
   Every value carries its source:
     'measured'  – measured on the real instrument by the teacher
     'photo'     – visible in the reference photos (presence/shape)
     'estimate'  – proportion estimated from photos, NOT measured
     'computed'  – derived by formula (e.g. equal temperament) and not yet verified
   Nothing in the teaching or rendering engines may assume equal
   temperament or a universal panduri: they read this profile.
   ===================================================================== */
PD.instrument = (() => {
  const KEY = 'instrument.profile';
  const ET = (L, n) => +(L * (1 - Math.pow(2, -n / 12))).toFixed(2);

  /** default profile = the teacher's instrument as known from the supplied photos */
  function defaults() {
    const L = 540, FR = 17;
    const strings = [
      { n: 1, label: 'A', open: 57, color: '#D9783F', material: 'nylon', src: 'photo' },
      { n: 2, label: 'C♯', open: 61, color: '#78B7DE', material: 'nylon', src: 'photo' },
      { n: 3, label: 'E', open: 64, color: '#EFE0B8', material: 'nylon', src: 'photo' }
    ];
    const pos = []; for (let n = 0; n <= FR; n++) pos.push(ET(L, n));
    return {
      schema: 'panduri-instrument', v: 1, id: 'teacher-panduri',
      name: { ka: 'მასწავლებლის ფანდური', en: "Teacher's panduri" },
      notes: { ka: 'ფოტოებზე დაყრდნობით. ზომები ჯერ არ არის გაზომილი.', en: 'Based on the reference photos. Dimensions not yet measured.' },
      strings,
      stringOrder: { front: 'left→right: 1 A · 2 C♯ · 3 E', player: 'headstock left: E on top, A at the bottom', src: 'photo' },
      frets: { count: FR, src: 'photo' },
      /** pitch per string and fret: semitones above the open string + cent offset. Default = equal temperament (computed). */
      fretPitch: { mode: 'semitone', cents: strings.map(() => new Array(FR + 1).fill(0)), src: 'computed' },
      /** distance from the nut to each fret (mm). Default = equal temperament from the scale length (computed). */
      fretPos: { mm: pos, src: 'computed' },
      scaleLength: { mm: L, src: 'estimate' },
      markers: { single: [3, 5, 7, 9, 15], double: [12], src: 'photo' },
      stringSpacing: { nutMm: 18, bridgeMm: 26, src: 'estimate' },
      /** nut → start of the body (mm); the fingerboard ends just past the last fret, slightly onto the top */
      neckJoin: { mm: 340, src: 'estimate' },
      fingerboardEnd: { mm: 352, src: 'estimate' },
      body: {
        // proportions traced from the straight-on front photo (52c44f05), scaled so nut→bridge = scale length.
        // perspective is not corrected: treat as estimates until measured.
        lengthMm: 335, maxWidthMm: 193, bottomWidthMm: 94, src: 'estimate',
        outline: [[0, 19.6], [.025, 23], [.05, 30], [.08, 44], [.11, 58], [.145, 71], [.18, 82], [.22, 90], [.27, 95], [.33, 96.5], [.42, 92], [.53, 83], [.68, 66], [.84, 54], [.957, 48], [1, 47]],
        depth: [[0, 20], [.08, 34], [.25, 56], [.5, 70], [.8, 75], [1, 72]],
        backFinish: { value: 'dark gloss', src: 'photo' }
      },
      soundHole: { diameterMm: 60, rosetteWidthMm: 3, fromBodyTopMm: 97, src: 'estimate', ring: { smallHoles: 26, ringRadiusMm: 44, holeDiameterMm: 7.8, src: 'estimate', note: 'count to be confirmed (24–26 visible in photos)' } },
      bridge: { fromBodyTopMm: 200, widthMm: 54, type: 'light saddle on dark base, strings continue to the end of the body', src: 'photo' },
      headstock: { type: 'open slot, rounded end cap, curved back hook', src: 'photo',
        // nut → end of the cap, outer width, slot (from/to, mm from the nut) and the three roller posts — same values as the 3D model; not measured
        lengthMm: 136, widthMm: 34, slotMm: [16, 108], slotWidthMm: 13, postsMm: { 1: 46, 2: 94, 3: 70 }, postSide: { 1: 'A', 2: 'A', 3: 'E' }, dimsSrc: 'estimate' },
      fingerboard: { nutHalfMm: 15, joinHalfMm: 18, src: 'estimate' },
      tuners: { layout: '2+1', left: [2, 1], right: [3], type: 'geared, cream paddle keys', src: 'photo' },
      hardware: {
        preamp: { present: true, side: 'A', at: .46, src: 'photo' },
        jack: { present: true, src: 'estimate' },
        endButton: { present: true, src: 'photo' }
      },
      verifiedBy: null, verifiedAt: null
    };
  }
  let P = load();
  function load() {
    const d = defaults(), s = PD.store.get(KEY, null);
    if (!s || s.schema !== 'panduri-instrument') return d;
    return merge(d, s);
  }
  function merge(a, b) { if (Array.isArray(b) || typeof b !== 'object' || b == null) return b; const o = Object.assign({}, a); Object.keys(b).forEach(k => { o[k] = (a && typeof a[k] === 'object' && !Array.isArray(a[k])) ? merge(a[k], b[k]) : b[k]; }); return o; }
  function save(p) { P = merge(defaults(), p); PD.store.set(KEY, P); PD.bus.emit('instrument', P); }
  function validate(p) {
    const err = [];
    if (!p || !Array.isArray(p.strings) || !p.strings.length) err.push('strings');
    const fc = p.frets && p.frets.count; if (!(fc >= 1 && fc <= 30)) err.push('frets.count');
    if (!p.fretPos || !Array.isArray(p.fretPos.mm) || p.fretPos.mm.length !== fc + 1) err.push('fretPos.mm length must be frets+1');
    else for (let i = 1; i < p.fretPos.mm.length; i++) if (!(p.fretPos.mm[i] > p.fretPos.mm[i - 1])) { err.push('fretPos.mm must increase (fret ' + i + ')'); break; }
    if (!p.fretPitch || !Array.isArray(p.fretPitch.cents) || p.fretPitch.cents.length !== p.strings.length) err.push('fretPitch.cents');
    return err;
  }

  const api = {
    get profile() { return P; },
    defaults, save, validate,
    reset() { PD.store.del(KEY); P = defaults(); PD.bus.emit('instrument', P); },
    get stringCount() { return P.strings.length; },
    get fretCount() { return P.frets.count; },
    get scaleLength() { return P.scaleLength.mm; },
    string(s) { return P.strings[s - 1]; },
    color(s) { return (P.strings[s - 1] || {}).color || '#ccc'; },
    /** pitch (fractional MIDI) of string s at fret f, from the explicit map */
    pitch(s, f, openMidi) {
      const st = P.strings[s - 1]; if (!st) return NaN;
      const c = ((P.fretPitch.cents[s - 1] || [])[f]) || 0;
      return (openMidi == null ? st.open : openMidi) + f + c / 100;
    },
    /** distance nut → fret n as a fraction of the scale length (from the explicit position map) */
    fretFrac(n) { const mm = P.fretPos.mm; if (n <= 0) return 0; if (n >= mm.length) return mm[mm.length - 1] / P.scaleLength.mm; return mm[n] / P.scaleLength.mm; },
    fretMm(n) { return P.fretPos.mm[Math.max(0, Math.min(P.fretPos.mm.length - 1, n))]; },
    /** recompute fret positions from scale length (equal temperament) — marks them 'computed' again */
    computeFretPositions(L) { const p = JSON.parse(JSON.stringify(P)); p.scaleLength.mm = L; p.fretPos = { mm: Array.from({ length: p.frets.count + 1 }, (_, n) => ET(L, n)), src: 'computed' }; save(p); },
    /** list of profile items that are not measured/confirmed (for the audit panel) */
    unverified() {
      const out = [], walk = (o, path) => { if (!o || typeof o !== 'object') return; if (o.src && o.src !== 'measured' && o.src !== 'photo') out.push({ path, src: o.src }); Object.keys(o).forEach(k => { if (k !== 'src' && typeof o[k] === 'object' && !Array.isArray(o[k])) walk(o[k], path ? path + '.' + k : k); }); };
      walk(P, ''); return out;
    },
    toJSON() { return JSON.stringify(P, null, 1); },
    fromJSON(txt) { const o = JSON.parse(txt); const m = merge(defaults(), o); const e = validate(m); if (e.length) throw new Error(e.join('; ')); save(m); return m; }
  };
  return api;
})();
