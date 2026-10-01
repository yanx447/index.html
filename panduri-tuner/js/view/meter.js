// Arc tuning meter (SVG). Non-linear scale: extra resolution around 0 ¢.
// The pointer is spring-driven toward the tracker's smoothed value — it never moves on its own.

const CX = 180, CY = 196, R = 150, SPAN = 60, K = 5;

export function centsToAngle(c) {
  const a = Math.min(50, Math.abs(c));
  return Math.sign(c) * SPAN * (Math.asinh((K * a) / 50) / Math.asinh(K));
}

const pt = (deg, r) => { const a = ((deg - 90) * Math.PI) / 180; return [CX + r * Math.cos(a), CY + r * Math.sin(a)]; };
const f1 = (v) => v.toFixed(1);
const arc = (d0, d1, r) => {
  const [x0, y0] = pt(d0, r), [x1, y1] = pt(d1, r);
  return `M${f1(x0)} ${f1(y0)} A${r} ${r} 0 ${Math.abs(d1 - d0) > 180 ? 1 : 0} 1 ${f1(x1)} ${f1(y1)}`;
};

export class Meter {
  constructor(svg) {
    this.svg = svg;
    this.angle = 0; this.vel = 0; this.target = 0;
    this.build();
    this.needle = svg.querySelector('#mNeedle');
    this.lockZone = svg.querySelector('#mLock');
    this.pulse = svg.querySelector('#mPulse');
  }

  build() {
    const bands = [
      [-50, -10, 'var(--red)', 0.55], [-10, -5, 'var(--amber)', 0.7], [-5, -2, 'var(--green-2)', 0.75], [-2, 2, 'var(--green)', 1],
      [2, 5, 'var(--green-2)', 0.75], [5, 10, 'var(--amber)', 0.7], [10, 50, 'var(--red)', 0.55],
    ].map(([a, b, c, o]) => `<path d="${arc(centsToAngle(a), centsToAngle(b), R)}" style="stroke:${c};stroke-opacity:${o}" stroke-width="2.5" fill="none"/>`).join('');

    let ticks = '';
    const vals = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25, 30, 40, 50];
    for (const v of vals) {
      for (const s of v === 0 ? [1] : [-1, 1]) {
        const c = v * s, d = centsToAngle(c);
        const major = v === 0 || v === 5 || v === 10 || v === 25 || v === 50;
        const [x0, y0] = pt(d, R - 11), [x1, y1] = pt(d, R - (v === 0 ? 30 : major ? 24 : 17));
        ticks += `<line x1="${f1(x0)}" y1="${f1(y0)}" x2="${f1(x1)}" y2="${f1(y1)}" class="${v === 0 ? 'tk0' : major ? 'tk1' : 'tk2'}"/>`;
        if (major && v !== 0) {
          const [tx, ty] = pt(d, R - 38);
          ticks += `<text x="${f1(tx)}" y="${f1(ty)}" class="tkl">${s < 0 ? '−' : '+'}${v}</text>`;
        }
      }
    }
    const [fx, fy] = pt(-SPAN - 6, R + 4), [sx, sy] = pt(SPAN + 6, R + 4);

    this.svg.innerHTML = `
      <defs>
        <linearGradient id="mTrack" x1="0" x2="0" y1="0" y2="1"><stop offset="0" style="stop-color:var(--well-hi)"/><stop offset="1" style="stop-color:var(--well)"/></linearGradient>
        <linearGradient id="mBrass" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#f3d99c"/><stop offset=".45" stop-color="#d4a655"/><stop offset="1" stop-color="#8a6a33"/></linearGradient>
      </defs>
      <path d="${arc(-SPAN - 2, SPAN + 2, R)}" stroke="url(#mTrack)" stroke-width="20" stroke-linecap="round" fill="none"/>
      <path d="${arc(-SPAN - 2, SPAN + 2, R + 10)}" style="stroke:var(--hair-2)" stroke-width="1" fill="none"/>
      <path d="${arc(-SPAN, SPAN, R - 10)}" style="stroke:var(--hair)" stroke-width="1" fill="none"/>
      <path id="mLock" class="m-lock" stroke-width="20" fill="none"/>
      <g class="m-bands">${bands}</g>
      <g class="m-ticks">${ticks}</g>
      <text x="${f1(fx - 6)}" y="${f1(fy + 6)}" class="m-acc">♭</text>
      <text x="${f1(sx + 6)}" y="${f1(sy + 6)}" class="m-acc">♯</text>
      <circle id="mPulse" class="m-pulse" cx="${CX}" cy="${CY - R}" r="12"/>
      <g id="mNeedle" class="m-needle" style="transform-origin:${CX}px ${CY}px">
        <line x1="${CX}" y1="${CY - R + 13}" x2="${CX}" y2="${CY - R + 46}" class="m-needle-line"/>
        <path d="M${CX} ${CY - R + 12} L${CX - 7.5} ${CY - R - 7} Q${CX} ${CY - R - 11} ${CX + 7.5} ${CY - R - 7} Z" fill="url(#mBrass)" class="m-needle-tip"/>
      </g>`;
  }

  setTolerance(tol) {
    this.lockZone.setAttribute('d', arc(centsToAngle(-tol), centsToAngle(tol), R));
  }

  /** @param cents number | null  @param mode 'live' | 'dim' | 'idle' */
  set(cents, mode, locked) {
    if (cents != null && mode !== 'idle') this.target = centsToAngle(cents);
    else if (mode === 'idle') this.target = 0;
    this.svg.dataset.mode = mode;
    const was = this.svg.classList.contains('locked');
    this.svg.classList.toggle('locked', !!locked);
    if (locked && !was) { this.pulse.classList.remove('go'); void this.pulse.getBBox(); this.pulse.classList.add('go'); }
  }

  step(dt) {
    const k = 170, c = 2 * Math.sqrt(k) * 0.9;
    const a = k * (this.target - this.angle) - c * this.vel;
    this.vel += a * dt;
    this.angle += this.vel * dt;
    const moving = Math.abs(this.vel) > 0.01 || Math.abs(this.target - this.angle) > 0.01;
    if (!moving) { this.angle = this.target; this.vel = 0; }
    this.needle.style.transform = `rotate(${this.angle.toFixed(3)}deg)`;
    return moving;
  }
}
