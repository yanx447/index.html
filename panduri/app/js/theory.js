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
    a4() { return PD.store.get('a4', 440); },
    freq(m) { return api.a4() * Math.pow(2, (m - 69) / 12); },
    midiOf(f) { return 69 + 12 * Math.log2(f / api.a4()); },
    /** physical fret position (fraction of scale length) from the instrument's measured/computed position map */
    fretFrac: n => I.fretFrac(n),
    stringName(s) { const st = I.string(s); return cur.id === 'std' && st ? st.label : api.pcName(cur.strings[s - 1]); },
    color: s => I.color(s),
    /** every (string, fret) whose mapped pitch is within 50 cents of m */
    positions(m) { const out = []; for (let s = 1; s <= I.stringCount; s++) for (let f = 0; f <= I.fretCount; f++) if (Math.abs(api.midi(s, f) - m) < .5) out.push({ s, f }); return out; }
  };
  return api;
})();
