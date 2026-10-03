// Guard against accidentally changed settings.
//  • tuningChanges(S): which settings that affect tuning differ from the recommended ones
//  • recommended(S):   the same settings with only those reset (language, view, mode… are kept)
//  • StandardWatch:    notices when the player's panduri is clearly in the standard tuning
//                      (A3 · C♯4 · E4 at A4 = 440 Hz) while the changed settings say otherwise.
import { DEFAULTS } from './settings.js';

const TUNING_KEYS = ['presetId', 'transpose', 'octave', 'a4'];

/** @returns {{key:string, value:any}[]} tuning-relevant settings that differ from the recommended ones */
export function tuningChanges(S) {
  const out = [];
  for (const k of TUNING_KEYS) if (S[k] !== DEFAULTS[k]) out.push({ key: k, value: S[k] });
  if (!S.autoSens && S.sens <= 3) out.push({ key: 'sens', value: S.sens });           // tuner barely hears the strings
  if (S.refVolume < 0.15) out.push({ key: 'refVolume', value: S.refVolume });          // reference tone inaudible
  return out;
}

/** A short signature of the current changes (used to remember "I meant to do this"). */
export const changeSignature = (S) => tuningChanges(S).map((c) => `${c.key}=${c.value}`).join('&');

/** Settings with every tuning-relevant change reset to the recommended value. */
export function recommended(S) {
  const r = { ...S };
  for (const k of TUNING_KEYS) r[k] = DEFAULTS[k];
  if (!r.autoSens && r.sens <= 3) { r.autoSens = true; r.sens = DEFAULTS.sens; }
  if (r.refVolume < 0.15) r.refVolume = DEFAULTS.refVolume;
  return r;
}

const STD = [57, 61, 64].map((m) => 440 * Math.pow(2, (m - 69) / 12)); // A3 · C♯4 · E4

/**
 * Feed it the raw pitch of trustworthy frames. It fires once there is clear evidence that the
 * instrument sits on the standard tuning while the configured targets are far from it:
 * ~0.4 s of such readings on two different strings, or ~1.5 s on one string.
 */
export class StandardWatch {
  constructor() { this.reset(); }
  reset() { this.hits = [0, 0, 0]; this.fired = false; }

  /**
   * @param freq    detected pitch (Hz)
   * @param targets current target frequencies of the strings
   * @returns true once, when the evidence is complete
   */
  push(freq, targets) {
    if (this.fired || !(freq > 0)) return false;
    const fold = (c) => c - 1200 * Math.round(c / 1200);
    let si = 0, dStd = Infinity;
    STD.forEach((f, i) => { const d = Math.abs(1200 * Math.log2(freq / f)); if (d < dStd) { dStd = d; si = i; } });
    let dCur = Infinity;
    for (const f of targets) dCur = Math.min(dCur, Math.abs(fold(1200 * Math.log2(freq / f))));
    if (dStd <= 20 && dCur >= 35) this.hits[si]++;
    else if (dCur <= 15) this.hits = this.hits.map((h) => Math.max(0, h - 2)); // playing to the current targets
    const strings = this.hits.filter((h) => h >= 12).length;
    if (strings >= 2 || Math.max(...this.hits) >= 45) { this.fired = true; return true; }
    return false;
  }
}
