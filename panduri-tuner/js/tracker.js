// Pitch stabilizer / state machine.
// Takes raw detector frames (~30 per second) and produces a trustworthy tuning snapshot:
// adaptive noise floor, attack rejection, outlier rejection, confidence, adaptive smoothing,
// measurement hold on decay, and string selection with hysteresis.

import { accuracyBand } from './guidance.js';

export const State = Object.freeze({
  OFF: 'off',
  CALIBRATING: 'calibrating',
  LISTENING: 'listening',   // mic on, nothing to hear
  ANALYZING: 'analyzing',   // sound present, not yet trustworthy (attack / building evidence)
  UNSTABLE: 'unstable',     // periodic but wandering
  VALID: 'valid',
  IN_TUNE: 'intune',
  HOLD: 'hold',             // sound faded, showing last reliable reading
});

const CALIBRATE_MS = 900;
const ATTACK_MS = 90;
const HOLD_MS = 650;
const MIN_CLARITY = 0.82;
const HIST = 7;

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);

function median(arr, n) {
  const k = Math.min(n, arr.length);
  const s = arr.slice(arr.length - k).sort((a, b) => a - b);
  return k % 2 ? s[k >> 1] : 0.5 * (s[(k >> 1) - 1] + s[k >> 1]);
}

export class PitchTracker {
  constructor() {
    this.cfg = { strings: [], mode: 'auto', selected: 0, autoSens: true, sens: 6, tol: 3 };
    this.noiseFloor = 0.0015;
    this.state = State.OFF;
    this.snap = this.blankSnapshot();
    this.prior = (f) => this.priorFor(f);
    this.resetMeasurement();
  }

  blankSnapshot() {
    return {
      state: State.OFF, stringIndex: this.cfg?.selected ?? 0, freq: 0, rawFreq: 0, targetFreq: 0,
      cents: 0, rawCents: 0, octaveOffset: 0, confidence: 0, clarity: 0, spread: 0,
      rms: 0, gate: 0, noiseFloor: 0, inTuneMs: 0, band: 'out', holdProgress: 0, onset: false,
    };
  }

  configure(o) {
    const prevStrings = this.cfg.strings;
    Object.assign(this.cfg, o);
    if (o.strings && o.strings !== prevStrings) this.resetMeasurement();
    if (o.mode && o.mode !== 'auto') this.autoIdx = null;
    if (o.selected != null && this.cfg.mode !== 'auto' && this.lockedIdx !== o.selected) this.resetMeasurement();
  }

  resetMeasurement() {
    this.hist = [];            // recent raw cents (relative to locked string/octave)
    this.smoothed = null;
    this.outliers = [];
    this.lockedIdx = null;
    this.lockedOct = 0;
    this.lastValid = null;
    this.lastValidAt = 0;
    this.inTuneSince = 0;
    this.autoCand = -1;
    this.autoCandN = 0;
  }

  begin(now) {
    this.state = State.CALIBRATING;
    this.calStart = now;
    this.calSamples = [];
    this.slowRms = 0;
    this.attackUntil = 0;
    this.onsetAt = -1e9;
    this.hadSignal = false;
    this.autoIdx = null;
    this.resetMeasurement();
  }

  end() { this.state = State.OFF; this.resetMeasurement(); this.snap = { ...this.blankSnapshot(), state: State.OFF }; }

  gate() {
    if (this.cfg.autoSens) return Math.max(0.0009, this.noiseFloor * 3.2);
    return 0.045 * Math.pow(0.62, this.cfg.sens); // manual: sens 1 (deaf) … 10 (very sensitive)
  }

  /** plausibility of a frequency given the current string expectation (used by the detector) */
  priorFor(f) {
    const strs = this.cfg.strings;
    if (!strs.length || !(f > 0)) return 1;
    const g = (ft) => { const d = 12 * Math.log2(f / ft); return Math.exp(-0.5 * (d / 2.5) ** 2); };
    if (this.cfg.mode === 'auto') { let p = 0; for (const s of strs) p = Math.max(p, g(s.freq)); return Math.max(0.03, p); }
    const s = strs[this.cfg.selected] || strs[0];
    return Math.max(0.03, g(s.freq));
  }

  pickAuto(freq, now) {
    const strs = this.cfg.strings;
    const d = strs.map((s) => 12 * Math.log2(freq / s.freq));
    let best = 0;
    for (let i = 1; i < d.length; i++) if (Math.abs(d[i]) < Math.abs(d[best])) best = i;
    let dist = d.map(Math.abs);
    if (dist[best] > 2.5) { // way off every string → compare octave-folded distances
      dist = d.map((v) => Math.abs(v - 12 * Math.round(v / 12)));
      best = 0;
      for (let i = 1; i < dist.length; i++) if (dist[i] < dist[best]) best = i;
    }
    if (this.autoIdx == null) { this.autoIdx = best; return best; }
    if (best === this.autoIdx) { this.autoCand = -1; this.autoCandN = 0; return best; }
    if (dist[best] + 0.35 < dist[this.autoIdx]) {           // hysteresis margin
      if (this.autoCand === best) this.autoCandN++; else { this.autoCand = best; this.autoCandN = 1; }
      const need = now - this.onsetAt < 400 ? 2 : 4;          // faster right after a new pluck
      if (this.autoCandN >= need) { this.autoIdx = best; this.autoCand = -1; this.autoCandN = 0; }
    } else { this.autoCand = -1; this.autoCandN = 0; }
    return this.autoIdx;
  }

  /**
   * @param det   detector result, or null when analysis is muted (reference tone playing)
   * @param now   ms timestamp
   */
  update(det, now) {
    const snap = this.snap;
    if (this.state === State.OFF) return snap;

    if (!det) { // muted — keep noise floor untouched, drop to listening
      this.resetMeasurement();
      Object.assign(snap, { state: State.LISTENING, rms: 0, inTuneMs: 0, onset: false });
      this.state = State.LISTENING;
      return snap;
    }

    const rms = det.rms;

    // --- noise floor --------------------------------------------------------------------
    if (this.state === State.CALIBRATING) {
      this.calSamples.push(rms);
      if (now - this.calStart >= CALIBRATE_MS) {
        const s = this.calSamples.slice().sort((a, b) => a - b);
        const nf = s[Math.floor(s.length * 0.3)] || this.noiseFloor;
        this.noiseFloor = Math.min(0.05, Math.max(0.00005, nf));
        this.state = State.LISTENING;
      } else {
        Object.assign(snap, { state: State.CALIBRATING, rms, gate: this.gate(), noiseFloor: this.noiseFloor, onset: false });
        return snap;
      }
    }
    const periodicNow = det.freq > 0 && det.clarity >= 0.6;
    if (!periodicNow) {
      const k = rms < this.noiseFloor ? 0.08 : 0.012; // falls quickly, rises slowly
      this.noiseFloor = Math.min(0.05, Math.max(0.00005, this.noiseFloor + (rms - this.noiseFloor) * k));
    }
    const gate = this.gate();
    const signal = rms >= gate;

    // --- onset / attack rejection -------------------------------------------------------
    snap.onset = false;
    if (signal && (!this.hadSignal || rms > this.slowRms * 1.9) && rms > gate * 1.3) {
      this.attackUntil = now + ATTACK_MS;
      this.onsetAt = now;
      snap.onset = true;
      this.hist = []; this.outliers = [];
    }
    this.slowRms = this.slowRms ? this.slowRms * 0.8 + rms * 0.2 : rms;
    this.hadSignal = signal;

    if (this.cfg.awaitOnset && snap.onset) this.cfg.awaitOnset = false;
    const inAttack = now < this.attackUntil;
    const valid = signal && !inAttack && !this.cfg.awaitOnset && det.freq > 0 && det.clarity >= MIN_CLARITY;

    snap.rms = rms; snap.gate = gate; snap.noiseFloor = this.noiseFloor;
    snap.clarity = det.clarity; snap.rawFreq = det.freq;

    if (!valid) {
      if (this.lastValid && now - this.lastValidAt < HOLD_MS) {
        this.state = State.HOLD;
        snap.state = State.HOLD;
        snap.holdProgress = (now - this.lastValidAt) / HOLD_MS;
        snap.inTuneMs = 0;
        return snap;
      }
      if (this.lastValid) this.resetMeasurement();
      this.state = signal ? State.ANALYZING : State.LISTENING;
      snap.state = this.state; snap.inTuneMs = 0; snap.confidence = 0; snap.holdProgress = 0;
      return snap;
    }

    // --- string selection ---------------------------------------------------------------
    const strs = this.cfg.strings;
    const idx = this.cfg.mode === 'auto' ? this.pickAuto(det.freq, now) : Math.min(this.cfg.selected, strs.length - 1);
    const target = strs[idx];
    const semis = 12 * Math.log2(det.freq / target.freq);
    // fold octaves only when the pitch really sits near an octave of the target;
    // otherwise it is simply a different note (e.g. the wrong string) and stays unfolded
    let oct = Math.round(semis / 12);
    if (Math.abs(semis - 12 * oct) > 1.5) oct = 0;
    const rawCents = (semis - 12 * oct) * 100;

    if (this.lockedIdx !== idx || this.lockedOct !== oct) {
      this.hist = []; this.smoothed = null; this.outliers = []; this.inTuneSince = 0;
      this.lockedIdx = idx; this.lockedOct = oct;
    }

    // --- outlier rejection (no plain averaging) -----------------------------------------
    if (this.hist.length >= 3) {
      const med = median(this.hist, 5);
      if (Math.abs(rawCents - med) > 30) {
        this.outliers.push(rawCents);
        if (this.outliers.length < 3) { // ignore isolated jumps
          return this.holdOrKeep(now, snap);
        }
        // three consistent jumps → the pitch really moved (re-tuned or re-plucked)
        const o = this.outliers;
        const om = median(o, 3);
        if (Math.abs(o[o.length - 1] - om) < 20) { this.hist = o.slice(-3); this.smoothed = null; }
        this.outliers = [];
      } else {
        this.outliers = [];
      }
    }
    this.hist.push(rawCents);
    if (this.hist.length > HIST) this.hist.shift();

    const robust = median(this.hist, 3);
    const med5 = median(this.hist, 5);
    let spread = 0;
    { const k = Math.min(5, this.hist.length); for (let i = this.hist.length - k; i < this.hist.length; i++) spread += Math.abs(this.hist[i] - med5); spread /= k; }

    // --- adaptive smoothing: fast when far/jumping, calm and precise near zero ------------
    if (this.smoothed == null) this.smoothed = robust;
    else {
      const delta = robust - this.smoothed;
      const alpha = Math.min(0.75, 0.1 + 0.5 * clamp01(Math.abs(delta) / 25) + 0.15 * clamp01(Math.abs(this.smoothed) / 30));
      this.smoothed += delta * alpha;
    }
    const cents = this.smoothed;

    // --- confidence ---------------------------------------------------------------------
    const cClar = clamp01((det.periodicity - 0.75) / 0.2);
    const cSnr = clamp01(Math.log10(rms / gate) / 0.7);
    const cStab = clamp01(1 - spread / 12);
    let conf = 0.4 * cClar + 0.2 * cSnr + 0.4 * cStab;
    if (this.hist.length < 3) conf *= this.hist.length / 3;

    const tol = this.cfg.tol;
    let state;
    if (conf < 0.45 || spread > 9) state = State.UNSTABLE;
    else state = Math.abs(cents) <= tol ? State.IN_TUNE : State.VALID;

    if (state === State.IN_TUNE) { if (!this.inTuneSince) this.inTuneSince = now; }
    else if (state === State.VALID) this.inTuneSince = 0;

    this.state = state;
    Object.assign(snap, {
      state, stringIndex: idx, targetFreq: target.freq,
      freq: target.freq * Math.pow(2, oct + cents / 1200),
      cents, rawCents, octaveOffset: oct, confidence: conf, spread,
      inTuneMs: this.inTuneSince ? now - this.inTuneSince : 0,
      band: accuracyBand(Math.abs(cents)), holdProgress: 0,
    });
    this.lastValid = true;
    this.lastValidAt = now;
    return snap;
  }

  holdOrKeep(now, snap) {
    snap.state = this.state === State.IN_TUNE || this.state === State.VALID ? this.state : State.UNSTABLE;
    return snap;
  }
}
