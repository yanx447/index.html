// Hidden developer panel. Open with ?debug in the URL or a long press on the title.

export class Diagnostics {
  constructor(el) {
    this.el = el;
    this.pre = el.querySelector('pre');
    this.enabled = false;
    this.analysisCount = 0; this.renderCount = 0;
    this.analysisFps = 0; this.renderFps = 0;
    this.windowStart = performance.now();
    this.lastWrite = 0;
    this.costMs = 0;
  }

  toggle(v = !this.enabled) { this.enabled = v; this.el.hidden = !v; }

  tickAnalysis(costMs) { this.analysisCount++; this.costMs = this.costMs * 0.9 + costMs * 0.1; this.roll(); }
  tickRender() { this.renderCount++; this.roll(); }
  roll() {
    const now = performance.now();
    if (now - this.windowStart >= 1000) {
      const s = (now - this.windowStart) / 1000;
      this.analysisFps = this.analysisCount / s; this.renderFps = this.renderCount / s;
      this.analysisCount = 0; this.renderCount = 0; this.windowStart = now;
    }
  }

  update(snap, det, extra) {
    if (!this.enabled) return;
    const now = performance.now();
    if (now - this.lastWrite < 100) return;
    this.lastWrite = now;
    const f = (v, d = 2) => (Number.isFinite(v) ? v.toFixed(d) : '—');
    const db = (v) => (v > 0 ? (20 * Math.log10(v)).toFixed(1) + ' dBFS' : '—');
    this.pre.textContent = [
      `state        ${snap.state}`,
      `string       ${snap.stringIndex + 1}  (${extra.mode})`,
      `raw f        ${f(det?.freq)} Hz`,
      `smoothed f   ${f(snap.freq)} Hz`,
      `target       ${f(snap.targetFreq || extra.target)} Hz`,
      `cents        ${f(snap.cents)}  raw ${f(snap.rawCents)}  oct ${snap.octaveOffset}`,
      `spread       ${f(snap.spread)} ¢`,
      `clarity      ${f(det?.clarity, 3)}  period ${f(det?.periodicity, 3)}${det?.octaveCorrected ? '  (oct-fix)' : ''}`,
      `confidence   ${f(snap.confidence, 2)}`,
      `rms          ${db(snap.rms)}`,
      `noise floor  ${db(snap.noiseFloor)}`,
      `gate         ${db(snap.gate)}  ${extra.autoSens ? 'auto' : 'manual'}`,
      `sample rate  ${extra.sampleRate || '—'}`,
      `detector     ${f(this.analysisFps, 1)} fps  ${f(this.costMs, 2)} ms/pass`,
      `render       ${f(this.renderFps, 1)} fps`,
    ].join('\n');
  }
}
