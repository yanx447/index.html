// Panduri headstock (SVG). Pegs: 2 C♯ upper-left (middle string), 1 A left below it, 3 E alone on the right, between them in height.
// Static geometry is built once; per-frame work is limited to the active string's vibration path.

const NS = 'http://www.w3.org/2000/svg';
const W = 320, H = 360, CX = 160;
const NUT_Y = 262;
const NUT_X = [148, 160, 172];
export const PEGS = [
  { post: [120, 150], knob: [46, 150], side: -1 },  // 1 — A   (left, below C♯)
  { post: [130, 78], knob: [46, 78], side: -1 },    // 2 — C♯  (upper left, middle string)
  { post: [190, 112], knob: [274, 112], side: 1 },  // 3 — E   (alone on the right, level between C♯ and A)
];

const HEAD = 'M136 360 L136 276 C100 262 76 222 76 158 C76 84 108 30 160 18 C212 30 244 84 244 158 C244 222 220 262 184 276 L184 360 Z';
const FACE = 'M160 38 C122 48 99 94 99 158 C99 204 115 236 140 250 L180 250 C205 236 221 204 221 158 C221 94 198 48 160 38 Z';

function rng(seed) { return () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; }; }

function grainPaths() {
  const r = rng(29);
  let out = '';
  for (let i = 0; i < 34; i++) {
    const x0 = 70 + i * 5.4 + (r() - 0.5) * 3;
    const ph = r() * 6.28, amp = 0.6 + r() * 1.6;
    let d = '';
    for (let y = 10; y <= H; y += 10) {
      const w = y < 150 ? 0.32 + (0.68 * (y - 10)) / 140 : 1 - (0.62 * (y - 150)) / 210;
      const x = CX + (x0 - CX) * w + Math.sin(y * 0.045 + ph) * amp;
      d += (y === 10 ? 'M' : 'L') + x.toFixed(1) + ' ' + y;
    }
    const dark = r() > 0.35;
    out += `<path d="${d}" stroke="${dark ? 'rgba(18,9,3,.42)' : 'rgba(196,140,90,.16)'}" stroke-width="${(0.5 + r() * 1.1).toFixed(2)}" fill="none"/>`;
  }
  // a few darker figure streaks
  for (let i = 0; i < 5; i++) {
    const x0 = 95 + r() * 130, y0 = 60 + r() * 170, len = 30 + r() * 50;
    out += `<path d="M${x0.toFixed(1)} ${y0.toFixed(1)} q ${((r() - 0.5) * 8).toFixed(1)} ${(len / 2).toFixed(1)} ${((r() - 0.5) * 4).toFixed(1)} ${len.toFixed(1)}" stroke="rgba(12,6,2,.28)" stroke-width="${(2 + r() * 3).toFixed(1)}" stroke-linecap="round" fill="none"/>`;
  }
  return out;
}

// right-facing peg thumb piece, centred on (0,0); mirrored for left pegs
const THUMB = 'M-24 -9 C-17 -10 -12 -29 5 -31 C23 -32 32 -17 32 0 C32 17 23 32 5 31 C-12 29 -17 10 -24 9 Z';

export class Headstock {
  constructor(svg, { onPick } = {}) {
    this.svg = svg;
    this.onPick = onPick;
    this.active = -1;
    this.vib = [0, 0, 0];      // current visual amplitude
    this.vibTarget = [0, 0, 0];
    this.t = 0;
    this.done = [false, false, false];
    this.build();
  }

  build() {
    const pegs = PEGS.map((p, i) => this.pegMarkup(p, i)).join('');
    const slots = PEGS.map((p) => {
      const [px, py] = p.post, edge = p.side < 0 ? 82 : 238;
      const x0 = Math.min(px, edge) - (p.side < 0 ? 0 : 6), x1 = Math.max(px, edge) + (p.side < 0 ? 6 : 0);
      return `<rect x="${x0}" y="${py - 7}" width="${x1 - x0}" height="14" rx="7" fill="url(#hsSlot)"/>
        <rect x="${x0 + 2}" y="${py - 3.5}" width="${x1 - x0 - 4}" height="7" rx="3.5" fill="url(#hsShaft)"/>
        <g stroke="rgba(230,205,150,.55)" stroke-width=".8">${[-4, 0, 4].map((o) => `<line x1="${px + o - 1.5}" y1="${py - 3.5}" x2="${px + o + 1.5}" y2="${py + 3.5}"/>`).join('')}</g>
        <circle cx="${px}" cy="${py}" r="5.2" fill="url(#hsPost)" stroke="rgba(0,0,0,.55)" stroke-width="1"/>`;
    }).join('');

    const strings = PEGS.map((p, i) => {
      const [px, py] = p.post, nx = NUT_X[i];
      return `<g class="hs-string" id="hsS${i}">
        <line class="hs-glow" x1="${nx}" y1="${NUT_Y}" x2="${px}" y2="${py}"/>
        <path class="hs-glow" id="hsGN${i}" d="M${nx} ${NUT_Y} L${nx} ${H}"/>
        <line class="hs-wire" x1="${nx}" y1="${NUT_Y}" x2="${px}" y2="${py}"/>
        <path class="hs-wire" id="hsN${i}" d="M${nx} ${NUT_Y} L${nx} ${H}"/>
        <line class="hs-spec" x1="${nx - 0.4}" y1="${NUT_Y}" x2="${px - 0.4}" y2="${py}"/>
      </g>`;
    }).join('');

    this.svg.innerHTML = `
    <defs>
      <linearGradient id="hsWood" x1="0" x2="1" y1="0" y2="0">
        <stop offset="0" stop-color="#2a170c"/><stop offset=".22" stop-color="#4a2c17"/><stop offset=".5" stop-color="#5d3920"/>
        <stop offset=".78" stop-color="#462915"/><stop offset="1" stop-color="#26150b"/>
      </linearGradient>
      <linearGradient id="hsFace" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stop-color="#3a2212"/><stop offset=".6" stop-color="#301c0f"/><stop offset="1" stop-color="#27160b"/>
      </linearGradient>
      <linearGradient id="hsLight" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#fff1d6" stop-opacity=".16"/><stop offset=".45" stop-color="#fff1d6" stop-opacity="0"/>
        <stop offset="1" stop-color="#000" stop-opacity=".38"/>
      </linearGradient>
      <linearGradient id="hsRim" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#e7b27a" stop-opacity=".55"/><stop offset=".5" stop-color="#8a5a34" stop-opacity=".35"/><stop offset="1" stop-color="#000" stop-opacity=".4"/>
      </linearGradient>
      <linearGradient id="hsNeckFade" x1="0" x2="0" y1="0" y2="1">
        <stop offset=".8" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/>
      </linearGradient>
      <mask id="hsNeckMask" maskUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}">
        <rect x="0" y="0" width="${W}" height="${H}" fill="url(#hsNeckFade)"/>
      </mask>
      <linearGradient id="hsSlot" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#0c0603"/><stop offset="1" stop-color="#1e1109"/></linearGradient>
      <linearGradient id="hsShaft" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#7a5334"/><stop offset=".5" stop-color="#4a2f1b"/><stop offset="1" stop-color="#2a190d"/></linearGradient>
      <radialGradient id="hsPost" cx=".35" cy=".35" r=".8"><stop offset="0" stop-color="#fbe3a8"/><stop offset=".5" stop-color="#c9953f"/><stop offset="1" stop-color="#6b4c1f"/></radialGradient>
      <linearGradient id="hsNut" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#fbf4e4"/><stop offset="1" stop-color="#cbbd9f"/></linearGradient>
      <radialGradient id="hsPeg" cx=".38" cy=".3" r=".85">
        <stop offset="0" stop-color="#7a5234"/><stop offset=".45" stop-color="#4a2e1a"/><stop offset="1" stop-color="#1f120a"/>
      </radialGradient>
      <linearGradient id="hsCollar" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#f7e9c8"/><stop offset=".5" stop-color="#c8b48e"/><stop offset="1" stop-color="#7c6b4f"/></linearGradient>
      <radialGradient id="hsFocus"><stop offset="0" stop-color="#d4a655" stop-opacity=".34"/><stop offset=".6" stop-color="#d4a655" stop-opacity=".08"/><stop offset="1" stop-color="#d4a655" stop-opacity="0"/></radialGradient>
      <filter id="hsBlur" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="7"/></filter>
      <filter id="hsBlurS" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="3"/></filter>
      <clipPath id="hsClip"><path d="${HEAD}"/></clipPath>
    </defs>

    <ellipse cx="${CX + 6}" cy="170" rx="98" ry="150" fill="#000" opacity=".55" filter="url(#hsBlur)"/>
    <circle id="hsFocusGlow" class="hs-focus" r="58" fill="url(#hsFocus)" cx="0" cy="0"/>

    <g class="hs-body">
      <g mask="url(#hsNeckMask)">
        <path d="${HEAD}" fill="url(#hsWood)"/>
        <g clip-path="url(#hsClip)">${grainPaths()}</g>
        <path d="${FACE}" fill="url(#hsFace)" opacity=".92"/>
        <path d="${FACE}" fill="none" stroke="rgba(0,0,0,.5)" stroke-width="3"/>
        <path d="${FACE}" fill="none" stroke="rgba(255,214,160,.07)" stroke-width="1" transform="translate(.8 1.2)"/>
        <g class="hs-light"><path d="${HEAD}" fill="url(#hsLight)"/></g>
        <path d="${HEAD}" fill="none" stroke="url(#hsRim)" stroke-width="1.6"/>
        <g stroke="#c9a15e" stroke-opacity=".75" stroke-width="1.4">
          <line x1="137" y1="312" x2="183" y2="312"/><line x1="137" y1="352" x2="183" y2="352"/>
        </g>
      </g>
      ${slots}
      <rect x="133" y="${NUT_Y - 5}" width="54" height="9" rx="2" fill="url(#hsNut)"/>
      <rect x="133" y="${NUT_Y + 4}" width="54" height="2" fill="rgba(0,0,0,.45)"/>
      ${strings}
    </g>
    <g class="hs-pegs">${pegs}</g>`;

    this.focus = this.svg.querySelector('#hsFocusGlow');
    this.pegEls = PEGS.map((_, i) => this.svg.querySelector('#hsP' + i));
    this.strEls = PEGS.map((_, i) => this.svg.querySelector('#hsS' + i));
    this.neckEls = PEGS.map((_, i) => [this.svg.querySelector('#hsN' + i), this.svg.querySelector('#hsGN' + i)]);
    this.pegEls.forEach((el, i) => {
      el.addEventListener('click', () => this.onPick && this.onPick(i));
      el.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.onPick && this.onPick(i); } });
    });
  }

  pegMarkup(p, i) {
    const [kx, ky] = p.knob, s = p.side;
    const tx = kx + s * 5; // text sits on the broad part of the thumb
    return `<g class="hs-peg" id="hsP${i}" role="button" tabindex="0">
      <rect x="${kx - 44}" y="${ky - 44}" width="88" height="88" fill="transparent"/>
      <ellipse cx="${kx + 3}" cy="${ky + 7}" rx="30" ry="30" fill="#000" opacity=".6" filter="url(#hsBlurS)"/>
      <path class="hs-dir" id="hsD${i}" d=""/>
      <circle class="hs-ring" cx="${kx}" cy="${ky}" r="39" pathLength="100"/>
      <g class="hs-thumb" transform="translate(${kx} ${ky}) scale(${s} 1)">
        <rect x="-31" y="-8" width="9" height="16" rx="2.5" fill="url(#hsCollar)"/>
        <path d="${THUMB}" fill="url(#hsPeg)" class="hs-thumb-body"/>
        <path d="M-6 -24 C8 -28 22 -22 26 -8" fill="none" stroke="rgba(255,226,180,.28)" stroke-width="2" stroke-linecap="round"/>
        <path d="${THUMB}" fill="none" class="hs-thumb-edge"/>
      </g>
      <text class="hs-lbl" id="hsL${i}" x="${tx}" y="${ky - 3}"></text>
      <text class="hs-sub" id="hsSub${i}" x="${tx}" y="${ky + 15}"></text>
      <g class="hs-badge" transform="translate(${kx + s * 26} ${ky - 27})">
        <circle r="9.5"/><path d="M-4.2 0.3 L-1.2 3.3 L4.6 -3" fill="none"/>
      </g>
    </g>`;
  }

  /** fmt: { name(s) → peg label, sub(s) → small line, aria(s, done) → accessible label } */
  setLabels(strings, fmt) {
    if (fmt) this.fmt = fmt;
    const f = this.fmt;
    strings.forEach((s, i) => {
      this.svg.querySelector('#hsL' + i).textContent = f.name(s);
      this.svg.querySelector('#hsSub' + i).textContent = f.sub(s);
      this.pegEls[i].setAttribute('aria-label', f.aria(s, this.done[i]));
    });
    this.strings = strings;
  }

  setActive(i) {
    if (i === this.active) return;
    this.active = i;
    this.pegEls.forEach((el, k) => el.classList.toggle('active', k === i));
    this.strEls.forEach((el, k) => el.classList.toggle('active', k === i));
    const [x, y] = PEGS[i].knob;
    this.focus.style.transform = `translate(${x}px, ${y}px)`;
  }

  setDone(done, justDone = -1) {
    done.forEach((d, i) => {
      this.done[i] = d;
      this.pegEls[i].classList.toggle('done', d);
      if (i === justDone) {
        const el = this.pegEls[i];
        el.classList.remove('confirm'); void el.getBBox(); el.classList.add('confirm');
        clearTimeout(this['_c' + i]);
        this['_c' + i] = setTimeout(() => el.classList.remove('confirm'), 2200);
      }
    });
    if (this.strings && this.fmt) this.setLabels(this.strings);
  }

  setSimple(v) { this._simple = v; }

  /** dir: 1 tighten (arrow sweeps upward), −1 loosen (downward), 0 none */
  setDirection(i, dir) {
    this.pegEls.forEach((el, k) => {
      const on = k === i && dir !== 0;
      el.classList.toggle('dir', on);
      if (!on) return;
      const key = dir;
      if (el._dirKey === key) return;
      el._dirKey = key;
      const [kx, ky] = PEGS[k].knob, s = PEGS[k].side, r = 45;
      const base = s > 0 ? 0 : 180; // outer side of the peg
      const a0 = base + (dir > 0 ? 38 : -38) * (s > 0 ? 1 : -1);
      const a1 = base - (dir > 0 ? 38 : -38) * (s > 0 ? 1 : -1);
      const P = (a) => [kx + r * Math.cos((a * Math.PI) / 180), ky + r * Math.sin((a * Math.PI) / 180)];
      const [x0, y0] = P(a0), [x1, y1] = P(a1);
      const sweep = a1 > a0 ? 1 : 0;
      const [xb, yb] = P(a1 + (a1 > a0 ? -9 : 9));
      const ang = Math.atan2(y1 - yb, x1 - xb);
      const h1 = [x1 - 7 * Math.cos(ang - 0.5), y1 - 7 * Math.sin(ang - 0.5)];
      const h2 = [x1 - 7 * Math.cos(ang + 0.5), y1 - 7 * Math.sin(ang + 0.5)];
      this.svg.querySelector('#hsD' + k).setAttribute('d',
        `M${x0.toFixed(1)} ${y0.toFixed(1)} A${r} ${r} 0 0 ${sweep} ${x1.toFixed(1)} ${y1.toFixed(1)} M${h1[0].toFixed(1)} ${h1[1].toFixed(1)} L${x1.toFixed(1)} ${y1.toFixed(1)} L${h2[0].toFixed(1)} ${h2[1].toFixed(1)}`);
      el.classList.toggle('up', dir > 0);
    });
  }

  /** level 0..1 derived from the real microphone RMS of the active string */
  setSignal(i, level) {
    for (let k = 0; k < 3; k++) this.vibTarget[k] = k === i ? level : 0;
  }

  step(dt) {
    this.t += dt;
    let busy = false;
    for (let k = 0; k < 3; k++) {
      const tgt = this.vibTarget[k];
      this.vib[k] += (tgt - this.vib[k]) * Math.min(1, dt * (tgt > this.vib[k] ? 25 : 5));
      const a = this.vib[k];
      if (a > 0.004 || this.neckEls[k]._v) {
        const amp = a * 2.4 * Math.sin(this.t * 2 * Math.PI * 11 + k);
        const x = NUT_X[k];
        const d = a > 0.004 ? `M${x} ${NUT_Y} Q${(x + amp).toFixed(2)} ${(NUT_Y + H) / 2 + 30} ${x} ${H + 60}` : `M${x} ${NUT_Y} L${x} ${H}`;
        this.neckEls[k][0].setAttribute('d', d); this.neckEls[k][1].setAttribute('d', d);
        this.neckEls[k]._v = a > 0.004;
        if (a > 0.004) busy = true;
      }
    }
    return busy;
  }
}
