// Settings storage (localStorage, fail-safe).

const KEY = 'sami-simi:v1';
const OLD_KEY = 'panduri-tuner:v2';

export const DEFAULTS = Object.freeze({
  presetId: 'panduri-standard',
  transpose: 0,
  octave: 0,
  a4: 440,
  autoSens: true,
  sens: 6,
  tol: 3,
  meter: 'needle',   // 'needle' | 'strobe'
  ui: 'pro',         // 'pro' | 'simple'
  motion: true,
  refVolume: 0.75,
  haptics: true,
  mode: 'auto',      // 'auto' | 'manual' | 'guided'
  selected: 0,
  micPrimed: false,
  lang: 'auto',      // 'auto' | 'ka' | 'en'
  customs: [],       // the player's own tunings: [{ id: 'c-…', name, strings: [m1, m2, m3] }]
  harmonic: false,   // tune with 12th-fret harmonics (expect the octave above the open string)
  pegFlip: [false, false, false], // per string: the tuner key tightens the other way round
  refMode: 'pluck',  // 'pluck' | 'drone' (reference keeps sounding until stopped)
  stageSound: true,  // stage mode: audible cues
  needleSpeed: 5,    // 1 calm … 10 fast — how quickly the needle follows the string
});

const MIDI_MIN = 45, MIDI_MAX = 76; // A2 … E5 — what three panduri strings can reasonably be tuned to

function sanitizeCustoms(list) {
  if (!Array.isArray(list)) return [];
  const out = [];
  for (const c of list.slice(0, 20)) {
    if (!c || typeof c.id !== 'string' || !/^c-[\w-]{1,40}$/.test(c.id) || !Array.isArray(c.strings) || c.strings.length !== 3) continue;
    const strings = c.strings.map((m) => Math.round(clamp(m, MIDI_MIN, MIDI_MAX, 57)));
    out.push({ id: c.id, name: String(c.name || '').slice(0, 40), strings });
  }
  return out;
}

const clamp = (v, lo, hi, d) => (Number.isFinite(+v) ? Math.min(hi, Math.max(lo, +v)) : d);
const oneOf = (v, list, d) => (list.includes(v) ? v : d);

function sanitize(s) {
  return {
    presetId: typeof s.presetId === 'string' ? s.presetId : DEFAULTS.presetId,
    transpose: Math.round(clamp(s.transpose, -6, 6, 0)),
    octave: Math.round(clamp(s.octave, -1, 1, 0)),
    a4: clamp(s.a4, 430, 450, 440),
    autoSens: s.autoSens !== false,
    sens: Math.round(clamp(s.sens, 1, 10, 6)),
    tol: oneOf(+s.tol, [2, 3, 5], 3),
    meter: oneOf(s.meter, ['needle', 'strobe'], 'needle'),
    ui: oneOf(s.ui, ['pro', 'simple'], 'pro'),
    motion: s.motion !== false,
    refVolume: clamp(s.refVolume, 0, 1, 0.75),
    haptics: s.haptics !== false,
    mode: oneOf(s.mode, ['auto', 'manual', 'guided'], 'auto'),
    selected: Math.round(clamp(s.selected, 0, 2, 0)),
    micPrimed: !!s.micPrimed,
    lang: oneOf(s.lang, ['auto', 'ka', 'en'], 'auto'),
    customs: sanitizeCustoms(s.customs),
    harmonic: !!s.harmonic,
    pegFlip: [0, 1, 2].map((i) => !!(Array.isArray(s.pegFlip) && s.pegFlip[i])),
    refMode: oneOf(s.refMode, ['pluck', 'drone'], 'pluck'),
    stageSound: s.stageSound !== false,
    needleSpeed: Math.round(clamp(s.needleSpeed, 1, 10, 5) * 10) / 10,
  };
}

export function loadSettings() {
  let s = {};
  try { s = JSON.parse(localStorage.getItem(KEY) || localStorage.getItem(OLD_KEY) || '{}') || {}; } catch (e) { s = {}; }
  if (!Object.keys(s).length) { // migrate the first version's settings
    try {
      const v1 = JSON.parse(localStorage.getItem('panduri-tuner') || 'null');
      if (v1) {
        for (const k of ['a4', 'transpose', 'octave', 'sens', 'tol']) if (v1[k] != null) s[k] = v1[k];
        if (v1.auto === false) s.mode = 'manual';
      }
    } catch (e) { /* ignore */ }
  }
  const out = sanitize({ ...DEFAULTS, ...s });
  // a custom tuning that no longer exists falls back to the standard one
  if (out.presetId.startsWith('c-') && !out.customs.some((c) => c.id === out.presetId)) out.presetId = DEFAULTS.presetId;
  return out;
}

export function saveSettings(s) {
  try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) { /* private mode etc. */ }
}

export function defaultSettings(keep = {}) {
  // restoring defaults never deletes the player's own tunings or how their tuner keys turn
  return sanitize({ ...DEFAULTS, micPrimed: !!keep.micPrimed, lang: keep.lang || 'auto', customs: keep.customs || [], pegFlip: keep.pegFlip });
}
