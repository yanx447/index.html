// Strobe display (Canvas 2D). Band motion is the real beat between the detected pitch and
// the target: speed ∝ Δf in Hz. Flat → drifts left, sharp → drifts right, in tune → still.

const BANDS = [
  { period: 44, h: 0.3 },
  { period: 22, h: 0.26 },
  { period: 11, h: 0.22 },
];

export class Strobe {
  constructor(canvas) {
    this.cv = canvas;
    this.ctx = canvas.getContext('2d');
    this.phase = 0;      // in pattern cycles
    this.deltaHz = 0;
    this.live = false;
    this.locked = false;
    this.alpha = 0.35;   // visual intensity, eased
    this.visible = false;
    this.resize();
  }

  setVisible(v) { this.visible = v; this.cv.hidden = !v; if (v) { this.resize(); this.draw(); } }

  resize() {
    const d = Math.min(3, window.devicePixelRatio || 1);
    const w = Math.max(1, Math.round(this.cv.clientWidth * d)), h = Math.max(1, Math.round(this.cv.clientHeight * d));
    if (this.cv.width !== w || this.cv.height !== h) { this.cv.width = w; this.cv.height = h; }
    this.dpr = d;
  }

  set(deltaHz, live, locked) {
    this.deltaHz = live ? deltaHz : 0;
    this.live = live;
    this.locked = locked;
  }

  step(dt) {
    if (!this.visible) return false;
    const targetA = this.live ? 1 : 0.35;
    this.alpha += (targetA - this.alpha) * Math.min(1, dt * 8);
    // cap visual speed so large errors don't strobe violently (still clearly directional)
    const hz = Math.max(-6, Math.min(6, this.deltaHz));
    this.phase = (this.phase + hz * dt) % 1000;
    this.draw();
    return this.live || Math.abs(this.alpha - targetA) > 0.01;
  }

  draw() {
    const { ctx, cv } = this, w = cv.width, h = cv.height, d = this.dpr || 1;
    ctx.clearRect(0, 0, w, h);
    const gap = 5 * d;
    const total = BANDS.reduce((s, b) => s + b.h, 0);
    let y = 0;
    const usable = h - gap * (BANDS.length - 1);
    const col = this.locked ? '140,192,132' : '212,166,85';
    BANDS.forEach((b, i) => {
      const bh = (usable * b.h) / total;
      const P = b.period * d;
      const off = ((this.phase * P) % P + P) % P;
      ctx.fillStyle = `rgba(${col},${(0.9 - i * 0.15) * this.alpha})`;
      for (let x = off - P; x < w + P; x += P) {
        ctx.fillRect(Math.round(x), Math.round(y), Math.round(P * 0.5), Math.round(bh));
      }
      y += bh + gap;
    });
    // fade the edges into the panel
    ctx.globalCompositeOperation = 'destination-out';
    const g = ctx.createLinearGradient(0, 0, w, 0);
    g.addColorStop(0, 'rgba(0,0,0,1)'); g.addColorStop(0.18, 'rgba(0,0,0,0)');
    g.addColorStop(0.82, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,1)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'source-over';
    // centre reference hairline
    ctx.fillStyle = 'rgba(242,233,218,0.55)';
    ctx.fillRect(Math.round(w / 2 - 0.5 * d), 0, Math.max(1, Math.round(d)), h);
  }
}
