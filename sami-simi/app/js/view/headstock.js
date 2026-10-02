// Panduri headstock (SVG), modelled on a real slotted panduri head:
//  • light maple side rails with an open slot, cap block with a mahogany centre stripe
//  • three brass rollers across the slot — top: C♯, middle: A, bottom: E
//  • geared tuners: C♯ and E on the left rail, A on the right rail
//  • mahogany throat with carved shoulders, bone nut, rosewood fingerboard with frets
// Strings at the nut, left → right: A, C♯ (middle), E. Each runs up the slot to its roller.
// Static geometry is built once; per-frame work is limited to the active string's vibration.

const W = 300, H = 416, CX = 150;
const KS = 1.2;                                     // tuner key scale
const KC = 54;                                      // key centre distance from the rail edge
const RAIL_L = [102, 133], RAIL_R = [167, 198];   // x ranges of the two rails
const SLOT = [133, 167];
const NUT_Y = 356;
const NUT_X = [117, 150, 183];                     // A, C♯, E — outer strings near the nut ends
const ROLLER_Y = [192, 140, 244];                  // A (middle), C♯ (top), E (bottom)
const WRAP_X = [140, 152, 160];                    // where each string meets its roller

// key centres (tap targets). string index → side and height
export const PEGS = [
  { knob: [242, ROLLER_Y[0]], side: 1 },   // 1 — A  (right)
  { knob: [58, ROLLER_Y[1]], side: -1 },   // 2 — C♯ (left, top)
  { knob: [58, ROLLER_Y[2]], side: -1 },   // 3 — E  (left, bottom)
];

function rng(seed) { return () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; }; }

function grain(x0, x1, y0, y1, n, seed, dark) {
  const r = rng(seed);
  let out = '';
  for (let i = 0; i < n; i++) {
    const x = x0 + ((i + 0.5) / n) * (x1 - x0) + (r() - 0.5) * 1.5;
    const ph = r() * 6.28, amp = 0.3 + r() * 0.8;
    let d = '';
    for (let y = y0; y <= y1; y += 8) d += (y === y0 ? 'M' : 'L') + (x + Math.sin(y * 0.06 + ph) * amp).toFixed(1) + ' ' + y;
    out += `<path d="${d}" stroke="${dark}" stroke-opacity="${(0.08 + r() * 0.16).toFixed(2)}" stroke-width="${(0.4 + r() * 0.8).toFixed(2)}" fill="none"/>`;
  }
  return out;
}

// right-facing tuner key, origin at the rail edge; mirrored for the left rail
function tunerKey() {
  return `
    <rect x="-1" y="-15" width="9" height="30" rx="2" fill="url(#hsGold)"/>
    <circle cx="9" cy="0" r="8.5" fill="url(#hsGold)" stroke="rgba(60,40,10,.6)" stroke-width=".8"/>
    <circle cx="9" cy="0" r="4.2" fill="url(#hsCap)"/>
    <rect x="15" y="-3.2" width="10" height="6.4" rx="1.5" fill="url(#hsGoldV)"/>
    <path class="hs-key" d="M22 -9 C28 -17 40 -21 52 -20 C63 -19 68 -10 68 0 C68 10 63 19 52 20 C40 21 28 17 22 9 Z" fill="url(#hsKey)"/>
    <path d="M30 -13 C40 -18 54 -18 61 -11" stroke="rgba(255,255,255,.18)" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path class="hs-thumb-edge" d="M22 -9 C28 -17 40 -21 52 -20 C63 -19 68 -10 68 0 C68 10 63 19 52 20 C40 21 28 17 22 9 Z" fill="none"/>`;
}

export class Headstock {
  constructor(svg, { onPick } = {}) {
    this.svg = svg;
    this.onPick = onPick;
    this.active = -1;
    this.vib = [0, 0, 0];
    this.vibTarget = [0, 0, 0];
    this.t = 0;
    this.done = [false, false, false];
    this.build();
  }

  build() {
    const [l0, l1] = RAIL_L, [r0, r1] = RAIL_R;
    // mahogany throat with carved shoulders, joined to the rails
    const THROAT = `M${l0 - 6} 300 C${l0 - 12} 304 ${l0 - 12} 314 ${l0 - 4} 318 C${l0 + 2} 322 ${l0 + 4} 330 ${l0 + 6} 344
      L${l0 + 8} ${NUT_Y + 2} L${r1 - 8} ${NUT_Y + 2} L${r1 - 6} 344 C${r1 - 4} 330 ${r1 - 2} 322 ${r1 + 4} 318
      C${r1 + 12} 314 ${r1 + 12} 304 ${r1 + 6} 300 Z`;

    const rollers = ROLLER_Y.map((y) => `
      <rect x="${SLOT[0] - 2}" y="${y - 4.2}" width="${SLOT[1] - SLOT[0] + 4}" height="8.4" rx="3" fill="url(#hsGoldV)"/>
      <rect x="${SLOT[0] - 2}" y="${y - 1.4}" width="${SLOT[1] - SLOT[0] + 4}" height="1.2" fill="rgba(255,248,220,.55)"/>
      <rect x="${SLOT[0]}" y="${y - 6}" width="4" height="12" rx="1.2" fill="#ece4d4"/>
      <rect x="${SLOT[1] - 4}" y="${y - 6}" width="4" height="12" rx="1.2" fill="#ece4d4"/>`).join('');

    const strings = [0, 1, 2].map((i) => {
      const nx = NUT_X[i], wx = WRAP_X[i], wy = ROLLER_Y[i];
      const wraps = [-2, 0, 2].map((o) => `<line x1="${wx + o - 1.2}" y1="${wy - 4}" x2="${wx + o + 1.2}" y2="${wy + 4}" stroke="rgba(235,225,205,.85)" stroke-width=".9"/>`).join('');
      return `<g class="hs-string" id="hsS${i}">
        <line class="hs-glow" x1="${nx}" y1="${NUT_Y}" x2="${wx}" y2="${wy}"/>
        <path class="hs-glow" id="hsGN${i}" d="M${nx} ${NUT_Y + 6} L${nx} ${H}"/>
        <line class="hs-wire" x1="${nx}" y1="${NUT_Y}" x2="${wx}" y2="${wy}"/>
        <path class="hs-wire" id="hsN${i}" d="M${nx} ${NUT_Y + 6} L${nx} ${H}"/>
        <line class="hs-spec" x1="${nx - 0.35}" y1="${NUT_Y}" x2="${wx - 0.35}" y2="${wy}"/>
        ${wraps}
      </g>`;
    }).join('');

    const pegs = PEGS.map((p, i) => this.pegMarkup(p, i)).join('');

    this.svg.setAttribute('viewBox', `10 12 ${W - 20} ${H - 20}`);
    this.svg.innerHTML = `
    <defs>
      <linearGradient id="hsMaple" x1="0" x2="1">
        <stop offset="0" stop-color="#b99a72"/><stop offset=".35" stop-color="#e2cda9"/><stop offset=".7" stop-color="#d6bd96"/><stop offset="1" stop-color="#a8885f"/>
      </linearGradient>
      <linearGradient id="hsMapleTop" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stop-color="#ead8b8"/><stop offset="1" stop-color="#cdb28a"/>
      </linearGradient>
      <linearGradient id="hsMahog" x1="0" x2="1">
        <stop offset="0" stop-color="#4a1f16"/><stop offset=".4" stop-color="#7a3a2a"/><stop offset=".65" stop-color="#6c3224"/><stop offset="1" stop-color="#3e1912"/>
      </linearGradient>
      <linearGradient id="hsBoard" x1="0" x2="1">
        <stop offset="0" stop-color="#1c0f0a"/><stop offset=".5" stop-color="#2e1a12"/><stop offset="1" stop-color="#180c08"/>
      </linearGradient>
      <linearGradient id="hsSlotFill" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stop-color="#0b0705"/><stop offset=".85" stop-color="#140c08"/><stop offset="1" stop-color="#2a140d"/>
      </linearGradient>
      <linearGradient id="hsGold" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stop-color="#f6dc96"/><stop offset=".5" stop-color="#c9973e"/><stop offset="1" stop-color="#7d5a1f"/>
      </linearGradient>
      <linearGradient id="hsGoldV" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stop-color="#f8e2a6"/><stop offset=".45" stop-color="#d2a04a"/><stop offset="1" stop-color="#6e4e18"/>
      </linearGradient>
      <radialGradient id="hsCap" cx=".35" cy=".35" r=".8"><stop offset="0" stop-color="#fff2c4"/><stop offset=".6" stop-color="#d6a952"/><stop offset="1" stop-color="#8a6526"/></radialGradient>
      <radialGradient id="hsKey" cx=".4" cy=".3" r=".9"><stop offset="0" stop-color="#3a3532"/><stop offset=".55" stop-color="#151311"/><stop offset="1" stop-color="#050404"/></radialGradient>
      <linearGradient id="hsNut" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#fbf5e6"/><stop offset="1" stop-color="#cdbf9f"/></linearGradient>
      <linearGradient id="hsLight" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#fff6e0" stop-opacity=".18"/><stop offset=".5" stop-color="#fff6e0" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".3"/>
      </linearGradient>
      <linearGradient id="hsFade" x1="0" x2="0" y1="0" y2="1"><stop offset=".86" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
      <mask id="hsNeckMask" maskUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="url(#hsFade)"/></mask>
      <radialGradient id="hsFocus"><stop offset="0" stop-color="#d4a655" stop-opacity=".36"/><stop offset=".6" stop-color="#d4a655" stop-opacity=".08"/><stop offset="1" stop-color="#d4a655" stop-opacity="0"/></radialGradient>
      <clipPath id="hsHeadClip">
        <rect x="${l0}" y="70" width="${l1 - l0}" height="236"/><rect x="${r0}" y="70" width="${r1 - r0}" height="236"/>
        <rect x="${l0 - 6}" y="16" width="${r1 - l0 + 12}" height="84" rx="12"/><path d="${THROAT}"/>
      </clipPath>
      <filter id="hsBlur" x="-150%" y="-50%" width="400%" height="200%"><feGaussianBlur stdDeviation="16"/></filter>
      <filter id="hsBlurS" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3"/></filter>
    </defs>

    <ellipse class="hs-shadow" cx="${CX + 6}" cy="215" rx="56" ry="170" fill="#000" opacity=".5" filter="url(#hsBlur)"/>
    <circle id="hsFocusGlow" class="hs-focus" r="56" fill="url(#hsFocus)" cx="0" cy="0"/>

    <g class="hs-body" mask="url(#hsNeckMask)">
      <!-- fingerboard + frets -->
      <rect x="${l0 + 8}" y="${NUT_Y}" width="${r1 - l0 - 16}" height="${H - NUT_Y}" fill="url(#hsBoard)"/>
      <g stroke="#c9a15e" stroke-width="1.6" stroke-opacity=".85">${[1, 2].map((n) => { const y = (NUT_Y + 6 + 1000 * (1 - Math.pow(2, -n / 12))).toFixed(1); return `<line x1="${l0 + 8}" y1="${y}" x2="${r1 - 8}" y2="${y}"/>`; }).join('')}</g>
      <!-- slot (open, dark) -->
      <rect x="${SLOT[0]}" y="78" width="${SLOT[1] - SLOT[0]}" height="${NUT_Y - 78}" fill="url(#hsSlotFill)"/>
      <!-- rails -->
      <rect x="${l0}" y="70" width="${l1 - l0}" height="236" rx="3" fill="url(#hsMaple)"/>
      <rect x="${r0}" y="70" width="${r1 - r0}" height="236" rx="3" fill="url(#hsMaple)"/>
      <g>${grain(l0 + 2, l1 - 2, 72, 304, 7, 11, '#6b4a2a')}${grain(r0 + 2, r1 - 2, 72, 304, 7, 23, '#6b4a2a')}</g>
      <rect x="${l1 - 2}" y="70" width="2" height="236" fill="rgba(0,0,0,.35)"/>
      <rect x="${r0}" y="70" width="2" height="236" fill="rgba(0,0,0,.35)"/>
      <!-- throat (mahogany) with ramp into the slot -->
      <path d="${THROAT}" fill="url(#hsMahog)"/>
      <path d="M${SLOT[0]} 300 L${SLOT[1]} 300 L${SLOT[1] - 2} 330 L${SLOT[0] + 2} 330 Z" fill="#2a120c"/>
      <path d="M${SLOT[0] + 2} 330 L${SLOT[1] - 2} 330 L${SLOT[1] - 1} ${NUT_Y} L${SLOT[0] + 1} ${NUT_Y} Z" fill="#46201a"/>
      <g>${grain(l0 - 4, r1 + 4, 300, NUT_Y, 12, 37, '#1d0a06')}</g>
      <!-- nut -->
      <rect x="${l0 + 4}" y="${NUT_Y - 4}" width="${r1 - l0 - 8}" height="10" rx="3" fill="url(#hsNut)"/>
      <rect x="${l0 + 6}" y="${NUT_Y + 6}" width="${r1 - l0 - 12}" height="2" fill="rgba(0,0,0,.45)"/>
      <!-- cap block: maple with mahogany stripe, overhanging -->
      <path d="M${l0 - 6} 92 L${l0 - 6} 30 Q${l0 - 6} 16 ${l0 + 8} 16 L${r1 - 8} 16 Q${r1 + 6} 16 ${r1 + 6} 30 L${r1 + 6} 92 Q${r1 + 6} 100 ${r1 - 2} 100 L${l0 + 2} 100 Q${l0 - 6} 100 ${l0 - 6} 92 Z" fill="url(#hsMapleTop)"/>
      <rect x="${CX - 15}" y="16" width="30" height="84" fill="url(#hsMahog)"/>
      <g>${grain(l0 - 4, CX - 16, 18, 98, 6, 41, '#6b4a2a')}${grain(CX + 16, r1 + 4, 18, 98, 6, 43, '#6b4a2a')}${grain(CX - 14, CX + 14, 18, 98, 5, 47, '#1d0a06')}</g>
      <path d="M${l0 - 6} 92 Q${l0 - 6} 100 ${l0 + 2} 100 L${r1 - 2} 100 Q${r1 + 6} 100 ${r1 + 6} 92 L${r1 + 6} 86 L${l0 - 6} 86 Z" fill="rgba(0,0,0,.22)"/>
      <rect x="${SLOT[0]}" y="100" width="${SLOT[1] - SLOT[0]}" height="10" fill="rgba(0,0,0,.45)"/>
      <g class="hs-light" clip-path="url(#hsHeadClip)"><rect x="${l0 - 12}" y="10" width="${r1 - l0 + 24}" height="${NUT_Y - 4}" fill="url(#hsLight)"/></g>
      ${rollers}
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
    const edge = s > 0 ? RAIL_R[1] : RAIL_L[0];       // rail outer edge
    const lx = edge + s * (KC + 2);                     // label centre on the black key
    return `<g class="hs-peg" id="hsP${i}" role="button" tabindex="0">
      <rect x="${Math.min(edge, edge + s * 96)}" y="${ky - 38}" width="96" height="76" fill="transparent"/>
      <ellipse cx="${edge + s * KC}" cy="${ky + 7}" rx="30" ry="21" fill="#000" opacity=".55" filter="url(#hsBlurS)"/>
      <path class="hs-dir" id="hsD${i}" d=""/>
      <ellipse class="hs-ring" cx="${edge + s * KC}" cy="${ky}" rx="40" ry="32" pathLength="100"/>
      <g transform="translate(${edge} ${ky}) scale(${s * KS} ${KS})">${tunerKey()}</g>
      <text class="hs-lbl" id="hsL${i}" x="${lx}" y="${ky}"></text>
      <text class="hs-sub" id="hsSub${i}" x="${edge + s * KC}" y="${ky + 39}"></text>
      <g class="hs-badge" transform="translate(${edge + s * 84} ${ky - 23})">
        <circle r="9"/><path d="M-4 0.3 L-1.1 3.2 L4.4 -2.8" fill="none"/>
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
    const p = PEGS[i];
    const edge = p.side > 0 ? RAIL_R[1] : RAIL_L[0];
    this.focus.style.transform = `translate(${edge + p.side * KC}px, ${p.knob[1]}px)`;
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
      if (el._dirKey === dir) return;
      el._dirKey = dir;
      const p = PEGS[k], s = p.side;
      const edge = s > 0 ? RAIL_R[1] : RAIL_L[0];
      const kx = edge + s * KC, ky = p.knob[1], r = 46;
      const base = s > 0 ? 0 : 180;                 // outer side of the key
      const a0 = base + (dir > 0 ? 40 : -40) * (s > 0 ? 1 : -1);
      const a1 = base - (dir > 0 ? 40 : -40) * (s > 0 ? 1 : -1);
      const P = (a) => [kx + r * Math.cos((a * Math.PI) / 180), ky + r * 0.85 * Math.sin((a * Math.PI) / 180)];
      const [x0, y0] = P(a0), [x1, y1] = P(a1);
      const sweep = a1 > a0 ? 1 : 0;
      const [xb, yb] = P(a1 + (a1 > a0 ? -9 : 9));
      const ang = Math.atan2(y1 - yb, x1 - xb);
      const h1 = [x1 - 7 * Math.cos(ang - 0.5), y1 - 7 * Math.sin(ang - 0.5)];
      const h2 = [x1 - 7 * Math.cos(ang + 0.5), y1 - 7 * Math.sin(ang + 0.5)];
      this.svg.querySelector('#hsD' + k).setAttribute('d',
        `M${x0.toFixed(1)} ${y0.toFixed(1)} A${r} ${(r * 0.85).toFixed(1)} 0 0 ${sweep} ${x1.toFixed(1)} ${y1.toFixed(1)} M${h1[0].toFixed(1)} ${h1[1].toFixed(1)} L${x1.toFixed(1)} ${y1.toFixed(1)} L${h2[0].toFixed(1)} ${h2[1].toFixed(1)}`);
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
        const amp = a * 1.8 * Math.sin(this.t * 2 * Math.PI * 11 + k);
        const x = NUT_X[k], y0 = NUT_Y + 6;
        const d = a > 0.004 ? `M${x} ${y0} Q${(x + amp).toFixed(2)} ${(y0 + H) / 2 + 40} ${x} ${H + 80}` : `M${x} ${y0} L${x} ${H}`;
        this.neckEls[k][0].setAttribute('d', d); this.neckEls[k][1].setAttribute('d', d);
        this.neckEls[k]._v = a > 0.004;
        if (a > 0.004) busy = true;
      }
    }
    return busy;
  }
}
