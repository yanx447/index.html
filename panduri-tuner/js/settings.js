// Settings storage (localStorage, fail-safe).

const KEY = 'panduri-tuner:v2';

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
});

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
  };
}

export function loadSettings() {
  let s = {};
  try { s = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { s = {}; }
  if (!Object.keys(s).length) { // migrate the first version's settings
    try {
      const v1 = JSON.parse(localStorage.getItem('panduri-tuner') || 'null');
      if (v1) {
        for (const k of ['a4', 'transpose', 'octave', 'sens', 'tol']) if (v1[k] != null) s[k] = v1[k];
        if (v1.auto === false) s.mode = 'manual';
      }
    } catch (e) { /* ignore */ }
  }
  return sanitize({ ...DEFAULTS, ...s });
}

export function saveSettings(s) {
  try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) { /* private mode etc. */ }
}

export function defaultSettings(keep = {}) {
  return sanitize({ ...DEFAULTS, micPrimed: !!keep.micPrimed });
}
