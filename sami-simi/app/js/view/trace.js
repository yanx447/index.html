// Pitch history strip (~5 s). Redrawn only when a new analysis frame arrives.
import { centsToAngle } from './meter.js';

const LEN = 150;

export class Trace {
  constructor(canvas) {
    this.cv = canvas;
    this.ctx = canvas.getContext('2d');
    this.data = new Float32Array(LEN).fill(NaN);
    this.head = 0;
    this.tol = 3;
    this.resize();
  }

  resize() {
    const d = Math.min(3, window.devicePixelRatio || 1);
    const w = Math.max(1, Math.round(this.cv.clientWidth * d)), h = Math.max(1, Math.round(this.cv.clientHeight * d));
    if (this.cv.width !== w || this.cv.height !== h) { this.cv.width = w; this.cv.height = h; }
    this.dpr = d;
    this.draw();
  }

  push(c) { this.data[this.head] = c == null ? NaN : c; this.head = (this.head + 1) % LEN; }
  clear() { this.data.fill(NaN); this.draw(); }

  draw() {
    const { ctx, cv } = this, w = cv.width, h = cv.height, d = this.dpr || 1;
    if (!w || !h) return;
    ctx.clearRect(0, 0, w, h);
    const pad = 5 * d;
    const y = (c) => h / 2 - (centsToAngle(c) / 60) * (h / 2 - pad);
    ctx.fillStyle = 'rgba(140,192,132,.10)';
    ctx.fillRect(0, y(this.tol), w, y(-this.tol) - y(this.tol));
    ctx.fillStyle = 'rgba(242,233,218,.14)';
    ctx.fillRect(0, Math.round(h / 2), w, Math.max(1, Math.round(d * 0.75)));
    ctx.lineWidth = 1.75 * d; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    const step = w / (LEN - 1);
    let prev = null, last = null;
    for (let i = 0; i < LEN; i++) {
      const c = this.data[(this.head + i) % LEN];
      const x = i * step;
      if (Number.isNaN(c)) { prev = null; continue; }
      const yy = y(c);
      if (prev) {
        ctx.strokeStyle = Math.abs(c) <= this.tol ? '#8cc084' : Math.abs(c) <= 10 ? '#d9a24a' : '#c96b56';
        ctx.beginPath(); ctx.moveTo(prev[0], prev[1]); ctx.lineTo(x, yy); ctx.stroke();
      }
      prev = [x, yy]; last = [x, yy, c];
    }
    if (last) {
      ctx.fillStyle = Math.abs(last[2]) <= this.tol ? '#8cc084' : '#d4a655';
      ctx.beginPath(); ctx.arc(Math.min(last[0], w - 4 * d), last[1], 3 * d, 0, Math.PI * 2); ctx.fill();
    }
    ctx.fillStyle = 'rgba(160,144,122,.7)';
    ctx.font = `${10 * d}px system-ui, sans-serif`;
    ctx.fillText('♯', 6 * d, 12 * d);
    ctx.fillText('♭', 6 * d, h - 5 * d);
  }
}
