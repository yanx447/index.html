/* =====================================================================
   Figures: the illustrated "first steps" — a seated player (side, front
   and top views), the panduri itself and two hands with real joints.
   - Units are centimetres (the viewBox is in cm), proportions from an
     adult of about 175 cm and from the photos of the teacher's panduri
     (shield-shaped body, ring of 26 holes, 17 frets, slotted head 2 + 1).
   - Every scene is a function of time: draw(t, view). A small player
     redraws visible figures ~30 times a second and stops when they leave
     the screen; with reduced motion one still key frame is shown.
   - Sitting, holding and stroke technique are drafts for the teacher to
     check (see tips.js); the pictures only illustrate those texts.
   ===================================================================== */
PD.fig = (() => {
  const L = a => PD.i18n.pick({ ka: a[0], en: a[1] });
  const still = () => (PD.motion ? !PD.motion.ok() : false) || document.documentElement.classList.contains('rm');
  let UID = 0;

  /* ---------------- geometry ---------------- */
  const f = n => +n.toFixed(2);
  const add = (a, b) => [a[0] + b[0], a[1] + b[1]], sub = (a, b) => [a[0] - b[0], a[1] - b[1]], mul = (a, k) => [a[0] * k, a[1] * k];
  const len = a => Math.hypot(a[0], a[1]), nrm = a => { const l = len(a) || 1e-6; return [a[0] / l, a[1] / l]; }, perp = a => [-a[1], a[0]];
  const mix = (a, b, k) => Array.isArray(a) ? a.map((v, i) => v + (b[i] - v) * k) : a + (b - a) * k;
  const rot = (p, deg, c) => { const r = deg * Math.PI / 180, x = p[0] - (c ? c[0] : 0), y = p[1] - (c ? c[1] : 0); return [(c ? c[0] : 0) + x * Math.cos(r) - y * Math.sin(r), (c ? c[1] : 0) + x * Math.sin(r) + y * Math.cos(r)]; };
  const ease = k => k < 0 ? 0 : k > 1 ? 1 : k * k * (3 - 2 * k);
  const easeIO = k => k < 0 ? 0 : k > 1 ? 1 : k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
  /** 0 → 1 between a and b (seconds), smooth */
  const ramp = (t, a, b) => easeIO((t - a) / (b - a));
  const P = p => f(p[0]) + ' ' + f(p[1]);
  /** a limb: tapered capsule between two circles */
  function cap(a, ra, b, rb) {
    const d = len(sub(b, a));
    if (d < Math.abs(ra - rb) + .01) { const c = ra > rb ? a : b, r = Math.max(ra, rb); return 'M' + P([c[0] - r, c[1]]) + 'a' + f(r) + ' ' + f(r) + ' 0 1 0 ' + f(2 * r) + ' 0a' + f(r) + ' ' + f(r) + ' 0 1 0 ' + f(-2 * r) + ' 0Z'; }
    const ang = Math.atan2(b[1] - a[1], b[0] - a[0]), beta = Math.acos(Math.max(-1, Math.min(1, (ra - rb) / d)));
    const pt = (c, r, x) => [c[0] + r * Math.cos(x), c[1] + r * Math.sin(x)];
    const a1 = pt(a, ra, ang + beta), a2 = pt(a, ra, ang - beta), b1 = pt(b, rb, ang + beta), b2 = pt(b, rb, ang - beta);
    return 'M' + P(a1) + 'L' + P(b1) + 'A' + f(rb) + ' ' + f(rb) + ' 0 ' + (beta > Math.PI / 2 ? 1 : 0) + ' 0 ' + P(b2) + 'L' + P(a2) + 'A' + f(ra) + ' ' + f(ra) + ' 0 ' + (beta < Math.PI / 2 ? 1 : 0) + ' 0 ' + P(a1) + 'Z';
  }
  /** a smooth path through points (Catmull-Rom → cubic Bézier) */
  function smooth(pts, closed, k) {
    k = k == null ? 1 / 6 : k; const n = pts.length, g = i => closed ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))];
    let d = 'M' + P(pts[0]);
    for (let i = 0; i < (closed ? n : n - 1); i++) { const p0 = g(i - 1), p1 = g(i), p2 = g(i + 1), p3 = g(i + 2); d += 'C' + P(add(p1, mul(sub(p2, p0), k))) + ' ' + P(sub(p2, mul(sub(p3, p1), k))) + ' ' + P(p2); }
    return d + (closed ? 'Z' : '');
  }
  const path = (d, fill, extra) => '<path d="' + d + '" fill="' + fill + '"' + (extra || '') + '/>';
  const line = (a, b, col, w, extra) => '<path d="M' + P(a) + 'L' + P(b) + '" stroke="' + col + '" stroke-width="' + w + '" stroke-linecap="round" fill="none"' + (extra || '') + '/>';

  /* ---------------- palette ---------------- */
  const K = {
    skin: '#DDAA84', skin2: '#C38E69', skinHi: '#EBC2A0', nail: '#F1D3C1', nailE: '#C99A82', crease: 'rgba(120,70,45,.45)',
    hair: '#2A1C14', top: '#33454F', top2: '#26353D', topHi: '#3E5360', pants: '#3B3631', pants2: '#2D2925', shoe: '#1D1612', sole: '#0E0B09',
    chair: '#7B4F30', chair2: '#5C3A22', chairHi: '#93633F', floor: 'rgba(255,240,228,.10)',
    spruce: '#EED6A6', spruce2: '#D8B47C', edge: '#7E4E2C', neck: '#7A4526', board: '#4E2817', fret: '#E6DCC6', dot: '#F2CE3A', hole: '#160C07', ring: '#5B3420', bridge: '#F2E6CC', metal: '#BFC3C7', str: '#F4EEE4',
    ok: '#8EF0B4', bad: '#FF7A6B', ink: '#F4EFE9', dim: 'rgba(255,240,228,.55)'
  };

  /* ---------------- the panduri (front), local cm: body bottom at x=0, neck along +x, y = across ---------------- */
  // half-width of the body measured from the photo of the teacher's panduri (cm from the bottom edge)
  const BODY = [[0, 9.3], [3, 9.7], [9, 10], [15, 10], [21, 9.5], [26, 8.6], [30.5, 7.6], [34, 5.9], [37, 4.1], [39.6, 2.6], [41.5, 1.6], [42.5, 1.3]];
  const PN = { len: 92, joint: 42, nut: 79.3, bridge: 16.3, hole: 28.5, holeR: 3.6, ringR: 5.3, boardEnd: 39.8 };
  const fretX = n => PN.nut - (PN.nut - PN.bridge) * (1 - Math.pow(2, -n / 12));
  function bodyPath() {
    const top = BODY.map(([x, w]) => [x, -w]), bot = BODY.map(([x, w]) => [x, w]).reverse();
    let d = 'M' + P([0, -7.5]) + 'Q' + P([0, -9.3]) + ' ' + P([1.6, -9.5]);
    d += smooth([[1.6, -9.5]].concat(top.slice(1)), false).slice(('M' + P([1.6, -9.5])).length);
    d += 'L' + P([42.5, 1.3]);
    d += smooth(bot.slice(0, -1).concat([[1.6, 9.5]]), false).slice(('M' + P(bot[0])).length);
    d += 'Q' + P([0, 9.3]) + ' ' + P([0, 7.5]) + 'Z';
    return d;
  }
  /** opts: {id, strings: [y offsets wiggle], press: [[fret, stringIndex]], hand} */
  function panduri(id, o) {
    o = o || {};
    let s = '';
    const B = bodyPath();
    s += path(B, 'url(#' + id + 'pb)', ' stroke="' + K.edge + '" stroke-width=".45"');
    // spruce grain along the length
    s += '<g clip-path="url(#' + id + 'pc)" opacity=".5">';
    for (let y = -9.6; y <= 9.6; y += .62 + (Math.abs(Math.sin(y * 7.1)) * .5)) s += line([0, y], [43, y * .96], K.spruce2, .07 + Math.abs(Math.sin(y * 3.3)) * .07);
    s += '</g>';
    // inner shading toward the edges (gives the body depth)
    s += path(B, 'url(#' + id + 'ps)');
    // fingerboard on the body + neck
    const nw = x => x > PN.joint ? 1.3 - (x - PN.joint) / (PN.nut - PN.joint) * .25 : 1.3;
    s += path('M' + P([PN.boardEnd, -1.3]) + 'L' + P([PN.nut, -1.05]) + 'L' + P([PN.nut, 1.05]) + 'L' + P([PN.boardEnd, 1.3]) + 'Z', K.board);
    s += path('M' + P([PN.joint, -1.45]) + 'L' + P([PN.nut + .2, -1.2]) + 'L' + P([PN.nut + .2, -1.05]) + 'L' + P([PN.joint, -1.3]) + 'Z', K.neck);
    s += path('M' + P([PN.joint, 1.45]) + 'L' + P([PN.nut + .2, 1.2]) + 'L' + P([PN.nut + .2, 1.05]) + 'L' + P([PN.joint, 1.3]) + 'Z', K.neck);
    for (let n = 1; n <= 17; n++) { const x = fretX(n), w = nw(x); s += line([x, -w + .08], [x, w - .08], K.fret, .16); }
    [3, 5, 7, 9, 15].forEach(n => { const x = (fretX(n - 1) + fretX(n)) / 2; s += '<circle cx="' + f(x) + '" cy="0" r=".24" fill="' + K.dot + '"/>'; });
    { const x = (fretX(11) + fretX(12)) / 2; s += '<circle cx="' + f(x) + '" cy="-.55" r=".24" fill="' + K.dot + '"/><circle cx="' + f(x) + '" cy=".55" r=".24" fill="' + K.dot + '"/>'; }
    // nut
    s += path('M' + P([PN.nut, -1.2]) + 'h.5v2.4h-.5Z', '#2A1A12');
    // head: slotted, hooked back at the end, tuners 2 + 1
    const hx = PN.nut + .5;
    s += path('M' + P([hx, -1.3]) + 'L' + P([90, -1.45]) + 'Q' + P([92.3, -1.5]) + ' ' + P([92.1, 0]) + 'Q' + P([92.3, 1.5]) + ' ' + P([90, 1.45]) + 'L' + P([hx, 1.3]) + 'Z', K.neck, ' stroke="#4A2715" stroke-width=".18"');
    s += path('M' + P([82.2, -.55]) + 'L' + P([89.4, -.6]) + 'L' + P([89.4, .6]) + 'L' + P([82.2, .55]) + 'Z', '#1A0F09');
    [83.8, 86.3, 88.6].forEach(x => { s += line([x, -.6], [x, .6], K.metal, .28); });
    [[84.1, 1], [86.6, 1], [86.0, -1]].forEach(([x, side]) => { s += line([x, side * 1.4], [x, side * 2.5], K.metal, .34) + '<ellipse cx="' + f(x) + '" cy="' + f(side * 2.95) + '" rx=".75" ry=".55" fill="#D9D3C8" stroke="#8B8580" stroke-width=".1"/>'; });
    // sound hole, its ring and the 26 small holes
    s += '<circle cx="' + PN.hole + '" cy="0" r="' + (PN.holeR + .35) + '" fill="' + K.ring + '"/><circle cx="' + PN.hole + '" cy="0" r="' + PN.holeR + '" fill="url(#' + id + 'ph)"/>';
    for (let i = 0; i < 26; i++) { const a = i / 26 * Math.PI * 2; s += '<circle cx="' + f(PN.hole + Math.cos(a) * PN.ringR) + '" cy="' + f(Math.sin(a) * PN.ringR) + '" r=".42" fill="' + K.hole + '"/>'; }
    // bridge
    s += '<rect x="' + (PN.bridge - .55) + '" y="-2" width="1.1" height="4" rx=".3" fill="' + K.bridge + '" stroke="#B9A57F" stroke-width=".1"/><rect x="' + (PN.bridge - .9) + '" y="-2.3" width=".5" height="4.6" rx=".2" fill="#3A2416"/>';
    // strings: A (top) · C♯ · E (bottom) from bridge to the head; a struck string vibrates
    const sy = [[-.45, -1.0], [0, 0], [.45, 1.0]], wig = o.wiggle || [0, 0, 0];
    sy.forEach(([yn, yb], i) => {
      const w = [.13, .11, .09][i], a = [PN.bridge, yb], b = [PN.nut, yn], m = mix(a, b, .5), amp = wig[i];
      s += amp ? '<path d="M' + P(a) + 'Q' + P([m[0], m[1] + amp]) + ' ' + P(b) + '" stroke="' + K.str + '" stroke-width="' + w + '" fill="none"/>' : line(a, b, K.str, w);
      s += line(b, [83.8 + i * 2.4 * (i < 2 ? 1 : .95), yn * .5], K.str, w * .8, ' opacity=".8"');
    });
    return s;
  }
  function panduriDefs(id) {
    return '<linearGradient id="' + id + 'pb" x1="0" y1="-10" x2="0" y2="10" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#F2DDB2"/><stop offset=".5" stop-color="' + K.spruce + '"/><stop offset="1" stop-color="#D9B57F"/></linearGradient>' +
      '<radialGradient id="' + id + 'ps" cx="22" cy="0" r="24" gradientUnits="userSpaceOnUse"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#5A3010" stop-opacity=".35"/></radialGradient>' +
      '<radialGradient id="' + id + 'ph" cx="' + (PN.hole - .8) + '" cy="-.8" r="4" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#3B2416"/><stop offset="1" stop-color="' + K.hole + '"/></radialGradient>' +
      '<clipPath id="' + id + 'pc"><path d="' + bodyPath() + '"/></clipPath>';
  }
  /** the panduri placed in a scene: body-bottom point, angle (deg), scale */
  const placed = (id, at, ang, o, sc) => '<g transform="translate(' + P(at) + ') rotate(' + f(ang) + ')' + (sc ? ' scale(' + sc + ')' : '') + '">' + panduri(id, o) + '</g>';
  /** a point on the placed instrument (local → scene) */
  const onP = (at, ang, p) => add(at, rot(p, ang));

  /* ---------------- hands: a real skeleton (metacarpals + 3 phalanges, thumb), seen from the back ---------------- */
  // left hand, back of the hand toward you, fingers up, thumb on the right. Units cm, wrist at (0,0).
  const FING = [ // [knuckle x, y, fan°, lengths, base radius]
    [3.25, -9.3, 6, [4.1, 2.35, 1.85], .98],    // 1 index
    [1.05, -9.85, 1, [4.5, 2.75, 1.95], 1.0],   // 2 middle
    [-1.15, -9.45, -4, [4.2, 2.6, 1.9], .94],   // 3 ring
    [-3.25, -8.45, -10, [3.35, 1.95, 1.7], .82] // 4 little
  ];
  /** pose: flex[i] = [mcp, pip, dip] degrees for fingers 1..4, thumb = {a: in-plane angle, flex} */
  function hand(o) {
    o = o || {}; const fl = o.flex || [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]], th = o.thumb || { a: 0, flex: 0 }, spread = o.spread || 0;
    let back = '', front = '', nails = '';
    const sk = o.skin || K.skin, edge = ' stroke="' + K.skin2 + '" stroke-width=".09"';
    FING.forEach(([kx, ky, fan, Ls, r0], i) => {
      const a = (fan + spread * (i - 1.5) * 3) * Math.PI / 180, u = [Math.sin(a), -Math.cos(a)];
      let p = [kx, ky], phi = 0; const rs = [r0, r0 * .9, r0 * .82, r0 * .74];
      Ls.forEach((l, k) => {
        phi += fl[i][k]; const c = Math.cos(phi * Math.PI / 180), q = add(p, mul(u, l * c));
        const seg = path(cap(p, rs[k], q, rs[k + 1]), sk, edge);
        if (phi > 95) back += seg; else front += seg;
        // dorsal creases at the joints, nail on the last bone
        if (k > 0 && phi < 80) front += '<path d="M' + P(add(p, mul(perp(u), rs[k] * .55))) + 'Q' + P(add(p, mul(u, .18))) + ' ' + P(sub(p, mul(perp(u), rs[k] * .55))) + '" stroke="' + K.crease + '" stroke-width=".07" fill="none"/>';
        if (k === 2 && phi < 85) { const vis = Math.cos(phi * Math.PI / 180), nl = l * .62 * vis, nc = add(q, mul(u, -nl / 2 - rs[3] * .15 * vis)); nails += '<rect x="' + f(nc[0] - rs[3] * .72) + '" y="' + f(nc[1] - nl / 2) + '" width="' + f(rs[3] * 1.44) + '" height="' + f(Math.max(.05, nl)) + '" rx="' + f(rs[3] * .65) + '" fill="' + K.nail + '" stroke="' + K.nailE + '" stroke-width=".06" transform="rotate(' + f(a * 180 / Math.PI) + ' ' + P(nc) + ')"/>'; }
        p = q;
      });
      if (o.tips) o.tips[i] = p;
    });
    // thumb: metacarpal from the wrist, two phalanges
    let tb = '';
    { const base = [3.3, -2.2], a = (34 + th.a) * Math.PI / 180, u = [Math.sin(a), -Math.cos(a)], Ls = [4.2, 3.1, 2.5], rs = [1.25, 1.08, .98, .86]; let p = base, phi = 0;
      Ls.forEach((l, k) => { phi += k ? th.flex * (k === 1 ? .6 : .4) : 0; const ak = a - phi * Math.PI / 180 * .5, uk = [Math.sin(ak), -Math.cos(ak)], q = add(p, mul(uk, l * Math.cos(phi * Math.PI / 180 * .5))); tb += path(cap(p, rs[k], q, rs[k + 1]), sk, edge); if (k === 2) { const nc = add(q, mul(uk, -.9)); tb += '<rect x="' + f(nc[0] - .62) + '" y="' + f(nc[1] - .8) + '" width="1.24" height="1.6" rx=".55" fill="' + K.nail + '" stroke="' + K.nailE + '" stroke-width=".06" transform="rotate(' + f(ak * 180 / Math.PI) + ' ' + P(nc) + ')"/>'; } p = q; });
      if (o.tips) o.tips[4] = p; }
    // palm (back of the hand) with knuckles and tendons
    const palm = smooth([[-3.0, .6], [-4.15, -3.2], [-4.25, -7.4], [-3.6, -9.0], [-1.2, -10.1], [1.05, -10.55], [3.3, -10.0], [4.25, -8.6], [4.15, -5.6], [3.5, -2.6], [2.9, .6]], true);
    let s = (o.sleeve ? path(cap([0, 1.6], 3.15, [0, 9], 3.6), o.sleeve) + path('M-3.3 1.4h6.6v1.1h-6.6z', o.sleeve2 || o.sleeve) : path(cap([0, .3], 2.95, [0, 8], 3.3), sk, edge));
    s += back + tb + path(palm, sk, edge);
    s += '<path d="' + palm + '" fill="url(#' + (o.id || '') + 'hs)"/>';
    FING.forEach(([kx, ky], i) => { s += '<path d="M' + P([kx * .55, -2.2]) + 'Q' + P([kx * .8, -6]) + ' ' + P([kx, ky + .6]) + '" stroke="' + K.skin2 + '" stroke-opacity=".35" stroke-width=".22" fill="none"/>'; s += '<ellipse cx="' + f(kx) + '" cy="' + f(ky + .05) + '" rx=".8" ry=".45" fill="' + K.skinHi + '" opacity=".55"/>'; });
    return s + front + nails;
  }
  const handDefs = id => '<radialGradient id="' + id + 'hs" cx="0" cy="-5" r="7" gradientUnits="userSpaceOnUse"><stop offset=".5" stop-color="#fff" stop-opacity=".07"/><stop offset="1" stop-color="#6a3a20" stop-opacity=".18"/></radialGradient>';

  /* ---------------- people ---------------- */
  /** head in profile facing right */
  function headSide(c, tilt) {
    const g = '<g transform="rotate(' + f(tilt || 0) + ' ' + P(c) + ')">';
    const x = c[0], y = c[1];
    const face = smooth([[x - 7.4, y - 1], [x - 6.2, y - 7.6], [x - 1, y - 10.4], [x + 4.6, y - 8.6], [x + 6.6, y - 4.4], [x + 7.0, y - 1.8], [x + 8.4, y + .6], [x + 7.0, y + 1.6], [x + 7.1, y + 3.4], [x + 6.6, y + 4.9], [x + 6.4, y + 6.6], [x + 4.4, y + 9.3], [x + 1, y + 10.2], [x - 3, y + 8.6], [x - 6.4, y + 4.8]], true, .17);
    const hair = smooth([[x - 7.9, y + 1.8], [x - 7.6, y - 5], [x - 3.6, y - 10.4], [x + 2.4, y - 11.1], [x + 6.2, y - 8.4], [x + 6.9, y - 5.4], [x + 3.4, y - 6.4], [x - 1, y - 5.6], [x - 3.2, y - 2.4], [x - 4.6, y + 1.2]], true, .18);
    return g + path(face, K.skin) + '<ellipse cx="' + f(x - 2.4) + '" cy="' + f(y + .3) + '" rx="1.5" ry="2.3" fill="' + K.skin2 + '"/>' + path(hair, K.hair) +
      '<path d="M' + P([x + 3.8, y - 1.2]) + 'q.9 -.5 1.9 .1" stroke="' + K.hair + '" stroke-width=".35" fill="none" stroke-linecap="round"/><ellipse cx="' + f(x + 4.7) + '" cy="' + f(y + .2) + '" rx=".42" ry=".55" fill="#2A1A12"/>' +
      '<path d="M' + P([x + 5.2, y + 4.9]) + 'q.8 .25 1.3 0" stroke="#A86A50" stroke-width=".35" fill="none" stroke-linecap="round"/></g>';
  }
  function headFront(c, tilt) {
    const x = c[0], y = c[1];
    const face = smooth([[x, y - 10.3], [x + 6.2, y - 8.2], [x + 7.2, y - 2], [x + 6.6, y + 4.2], [x + 4.2, y + 8.6], [x, y + 10.3], [x - 4.2, y + 8.6], [x - 6.6, y + 4.2], [x - 7.2, y - 2], [x - 6.2, y - 8.2]], true, .18);
    const hair = smooth([[x - 7.6, y - .4], [x - 7.5, y - 7], [x - 3.6, y - 11.2], [x + 2.4, y - 11.5], [x + 7.0, y - 8.6], [x + 7.6, y - .6], [x + 6.4, y - 4.6], [x + 2.6, y - 6.8], [x - 2.4, y - 6.9], [x - 6.4, y - 4.5]], true, .18);
    return '<g transform="rotate(' + f(tilt || 0) + ' ' + P([x, y + 10]) + ')">' + '<ellipse cx="' + f(x - 7.1) + '" cy="' + f(y + .4) + '" rx="1.3" ry="2.2" fill="' + K.skin2 + '"/><ellipse cx="' + f(x + 7.1) + '" cy="' + f(y + .4) + '" rx="1.3" ry="2.2" fill="' + K.skin2 + '"/>' +
      path(face, K.skin) + path(hair, K.hair) +
      '<path d="M' + P([x - 4.3, y - 1.4]) + 'q1.3 -.7 2.6 0M' + P([x + 1.7, y - 1.4]) + 'q1.3 -.7 2.6 0" stroke="' + K.hair + '" stroke-width=".4" fill="none" stroke-linecap="round"/>' +
      '<ellipse cx="' + f(x - 3) + '" cy="' + f(y + .7) + '" rx=".5" ry=".6" fill="#2A1A12"/><ellipse cx="' + f(x + 3) + '" cy="' + f(y + .7) + '" rx=".5" ry=".6" fill="#2A1A12"/>' +
      '<path d="M' + P([x, y + 1.6]) + 'l-.6 2.6q.6 .4 1.2 0" stroke="' + K.skin2 + '" stroke-width=".35" fill="none" stroke-linecap="round"/><path d="M' + P([x - 1.6, y + 6]) + 'q1.6 .8 3.2 0" stroke="#A86A50" stroke-width=".4" fill="none" stroke-linecap="round"/></g>';
  }
  /** wooden chair in profile (facing right): seat front edge x, seat top y */
  function chairSide(fx, sy, floor) {
    const bx = fx - 42; let s = '';
    s += path('M' + P([bx + 1.5, sy]) + 'L' + P([bx - 2.5, sy - 44]) + 'L' + P([bx + .5, sy - 44.6]) + 'L' + P([bx + 4.5, sy]) + 'Z', K.chair2);
    s += '<rect x="' + f(bx - 3.6) + '" y="' + f(sy - 46) + '" width="5.2" height="11" rx="1.4" fill="' + K.chair + '" transform="rotate(-5 ' + P([bx, sy - 40]) + ')"/>';
    s += line([bx + 3, sy + 2], [bx + 1.5, floor], K.chair2, 2.6) + line([fx - 3, sy + 2], [fx - 2, floor], K.chair, 2.6);
    s += line([bx + 2.6, floor - 16], [fx - 2.6, floor - 16], K.chair2, 1.4);
    s += '<rect x="' + f(bx) + '" y="' + f(sy) + '" width="42" height="3.6" rx="1.2" fill="' + K.chair + '"/><rect x="' + f(bx) + '" y="' + f(sy) + '" width="42" height="1.1" rx=".6" fill="' + K.chairHi + '"/>';
    return s;
  }
  /** a seated person, side view, facing right. j: joints {hip, sh, head, knee, ankle, toe, elbow, wrist, hand, elbow2, hand2, headTilt} */
  function personSide(j, o) {
    o = o || {}; let back = '', s = '';
    // far leg (slightly behind, darker)
    const off = [-2.2, -1.2];
    back += path(cap(add(j.hip, off), 7.2, add(j.knee, off), 5.6), K.pants2) + path(cap(add(j.knee, off), 5.0, add(j.ankle, off), 3.6), K.pants2) + shoeSide(add(j.ankle, off), add(j.toe, off), K.sole);
    // far arm (behind the body)
    back += path(cap(add(j.sh, [-1, 0]), 4.3, j.elbow2, 3.4), K.top2) + path(cap(j.elbow2, 3.2, j.hand2, 2.4), K.top2) + '<circle cx="' + f(j.hand2[0]) + '" cy="' + f(j.hand2[1]) + '" r="2.2" fill="' + K.skin2 + '"/>';
    // torso: back line and front line around the spine
    const u = nrm(sub(j.sh, j.hip)), n = [-u[1], u[0]], Lt = len(sub(j.sh, j.hip)); // n points backward (left) when facing right
    const at = (k, w) => add(add(j.hip, mul(u, Lt * k)), mul(n, w));
    const torso = smooth([at(-.06, 9.5), at(.25, 11.4), at(.6, 10.2), at(.92, 9.2), at(1.05, 5.5), add(j.sh, [3, -3.5]), at(1.0, -8.2), at(.78, -11.6), at(.45, -10.6), at(.18, -12.4), at(-.04, -10.5), at(-.12, -1)], true, .17);
    s += path(cap(add(j.sh, mul(u, 2.5)), 3.2, add(j.sh, mul(u, 8.5)), 2.9), K.skin2); // neck
    s += path(torso, K.top) + '<path d="' + torso + '" fill="url(#' + o.id + 'ts)"/>';
    // near leg
    s += path(cap(j.hip, 7.6, j.knee, 5.9), K.pants) + path(cap(j.knee, 5.3, j.ankle, 3.8), K.pants) + shoeSide(j.ankle, j.toe, K.shoe);
    s += '<path d="M' + P(add(j.knee, [-5, -3])) + 'q4 2.4 7.4 -.4" stroke="' + K.pants2 + '" stroke-width=".5" fill="none" stroke-linecap="round" opacity=".7"/>';
    s += headSide(j.head, j.headTilt);
    return { back, front: s };
  }
  function shoeSide(ankle, toe, col) {
    const heel = add(ankle, [-3.6, 4.6]), d = smooth([add(heel, [0, -1]), add(ankle, [-2.6, -1.2]), add(ankle, [3.2, -.2]), add(toe, [-2.2, -2.6]), add(toe, [.4, -.6]), add(toe, [0, 1.1]), add(heel, [0, 1.1])], true, .16);
    return path(d, col) + line(add(heel, [0, 1.1]), add(toe, [0, 1.1]), K.sole, .9);
  }
  /** an arm in the near layer: sleeve to the wrist, then the hand */
  function armSide(sh, elbow, wrist, hand, o) {
    return path(cap(sh, 4.6, elbow, 3.7), K.top) + path(cap(elbow, 3.5, wrist, 2.7), K.top) + path('M' + P(add(wrist, [-2.6, -1])) + 'l5 1.6', 'none', ' stroke="' + K.top2 + '" stroke-width=".6"') +
      path(cap(wrist, 2.2, hand, 2.6), K.skin, ' stroke="' + K.skin2 + '" stroke-width=".12"') + (o || '');
  }

  /* ---------------- scenes ---------------- */
  let LSC = 1;
  const label = (x, y, txt, col, size, anchor) => '<text x="' + f(x) + '" y="' + f(y) + '" fill="' + (col || K.ink) + '" font-size="' + f((size || 4.4) * LSC) + '" font-weight="700" dominant-baseline="central" style="text-anchor:' + (anchor || 'middle') + ';paint-order:stroke;stroke:#141210;stroke-width:1.1px;stroke-linejoin:round">' + txt + '</text>';
  const badge = (x, y, ok) => '<circle cx="' + f(x) + '" cy="' + f(y) + '" r="3.3" fill="' + (ok ? K.ok : K.bad) + '"/>' + '<path d="' + (ok ? 'M' + f(x - 1.5) + ' ' + f(y) + 'l1.1 1.2l2.1 -2.4' : 'M' + f(x - 1.2) + ' ' + f(y - 1.2) + 'l2.4 2.4M' + f(x + 1.2) + ' ' + f(y - 1.2) + 'l-2.4 2.4') + '" stroke="#141210" stroke-width=".8" fill="none" stroke-linecap="round"/>';

  /** SIDE: sitting deep and leaning back ✗ → on the front half, straight, feet flat ✓ */
  const FLOOR = 172, SEAT = 126, FRONT = 118;
  const SIDE_BAD = { hip: [86, 117], sh: [74, 66], head: [79, 49], headTilt: 12, knee: [124, 115], ankle: [140, 156], toe: [152, 162], elbow: [80, 92], wrist: [97, 100], hand: [102, 105], elbow2: [83, 90], hand2: [101, 82] };
  const SIDE_OK = { hip: [100, 116], sh: [102, 62], head: [106, 45], headTilt: 0, knee: [139, 117], ankle: [139, 161], toe: [154, 166], elbow: [105, 90], wrist: [121, 96], hand: [125, 103], elbow2: [110, 87], hand2: [124, 74] };
  function sideScene(t, id) {
    const D = 10, k = t % D, m = ramp(k, 2.6, 4.4) * (1 - ramp(k, 9.2, 10)), J = {};
    Object.keys(SIDE_OK).forEach(q => { J[q] = mix(SIDE_BAD[q], SIDE_OK[q], m); });
    const br = Math.sin(t * 1.6) * .35; J.sh = add(J.sh, [0, -br]); J.head = add(J.head, [0, -br]);
    // feet: heel rises when the legs are stretched
    if (m < 1) { J.toe = add(J.toe, [0, -6 * (1 - m)]); }
    let s = '<line x1="20" y1="' + FLOOR + '" x2="190" y2="' + FLOOR + '" stroke="' + K.floor + '" stroke-width=".8"/>';
    s += '<ellipse cx="112" cy="' + (FLOOR + .6) + '" rx="46" ry="2.4" fill="#000" opacity=".28"/>';
    // seat zones: back half ✗, front half ✓
    s += chairSide(FRONT + 2, SEAT, FLOOR);
    s += '<rect x="' + (FRONT + 2 - 42) + '" y="' + (SEAT - 2.2) + '" width="21" height="2" rx=".8" fill="' + K.bad + '" opacity="' + f(.15 + .55 * (1 - m)) + '"/><rect x="' + (FRONT + 2 - 21) + '" y="' + (SEAT - 2.2) + '" width="21" height="2" rx=".8" fill="' + K.ok + '" opacity="' + f(.15 + .55 * m) + '"/>';
    const P1 = personSide(J, { id });
    // instrument in profile: soundboard faces forward, neck rises away from us
    const pb = mix([113, 118], [127, 117], m), pt = mix([108, 84], [123, 83], m);
    const inst = path(smooth([add(pb, [-1, 2]), add(pb, [-10, -4]), add(mix(pb, pt, .6), [-11, 0]), add(pt, [-3, 1]), add(pt, [1, -.5]), add(mix(pb, pt, .5), [1.6, 0]), add(pb, [1, 0])], true, .18), 'url(#' + id + 'pf)', ' stroke="' + K.edge + '" stroke-width=".4"') +
      line(add(pt, [-1.6, 0]), add(pt, mix([-6, -22], [-4, -24], m)), K.neck, 2.6) + line(add(pt, mix([-6, -22], [-4, -24], m)), add(pt, mix([-8.4, -27], [-6, -29.5], m)), '#5A3420', 2.9);
    s += P1.back + inst + P1.front + armSide(J.sh, J.elbow, J.wrist, J.hand);
    // guides on the good pose
    const g = ramp(k, 4.6, 5.4) * (1 - ramp(k, 9, 9.6));
    if (g > 0) {
      s += '<g opacity="' + f(g) + '">' + line(add(J.hip, [-9, 2]), add(J.sh, [-9, -2]), K.ok, .7, ' stroke-dasharray="1.6 1.4"') +
        '<path d="M' + P(add(J.knee, [0, 7])) + 'h5v-5" stroke="' + K.ok + '" stroke-width=".7" fill="none"/>' + line([J.toe[0] - 20, FLOOR - .4], [J.toe[0] + 4, FLOOR - .4], K.ok, 1) + '</g>';
    }
    s += '<g opacity="' + f(1 - m) + '">' + badge(30, 22, false) + label(36, 22, L(['სკამის სიღრმეში, ზურგით მიყრდნობილი', 'Deep in the seat, leaning back']), K.bad, 4.2, 'start') + '</g>';
    s += '<g opacity="' + f(g) + '">' + badge(30, 22, true) + label(36, 22, L(['სკამის წინა ნახევარზე', 'On the front half of the seat']), K.ok, 4.2, 'start') + label(36, 29, L(['წელი სწორი · ფეხები იატაკზე · მუხლი ≈ 90°', 'Back straight · feet flat · knee ≈ 90°']), K.ink, 3.5, 'start') + '</g>';
    return s;
  }
  const sideDefs = id => '<linearGradient id="' + id + 'ts" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity=".22"/><stop offset=".6" stop-color="#fff" stop-opacity=".04"/><stop offset="1" stop-color="#000" stop-opacity=".12"/></linearGradient>' +
    '<linearGradient id="' + id + 'pf" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#6E3F22"/><stop offset=".75" stop-color="#9A6038"/><stop offset=".86" stop-color="' + K.spruce2 + '"/><stop offset="1" stop-color="' + K.spruce + '"/></linearGradient>';

  /** FRONT: facing you. Panduri body on the right thigh, neck to the player's left and up. */
  const PAN_AT = [67, 120], PAN_ANG = -24;
  function frontPerson(t, id, o) {
    o = o || {}; const br = Math.sin(t * 1.6) * .3, x = 100;
    let s = '';
    // chair: back legs, backrest, seat
    s += line([76, 128], [77, FLOOR - 3], K.chair2, 2.2) + line([124, 128], [123, FLOOR - 3], K.chair2, 2.2);
    s += '<rect x="74" y="80" width="52" height="7" rx="2.4" fill="' + K.chair2 + '"/>' + line([77, 84], [77, 124], K.chair2, 2.6) + line([123, 84], [123, 124], K.chair2, 2.6);
    s += path('M71 124h58l-2 5h-54z', K.chair) + '<rect x="71" y="123.4" width="58" height="1.4" rx=".6" fill="' + K.chairHi + '"/>' + line([73, 129], [72, FLOOR], K.chair, 2.8) + line([127, 129], [128, FLOOR], K.chair, 2.8);
    s += '<ellipse cx="100" cy="' + (FLOOR + .8) + '" rx="38" ry="2.4" fill="#000" opacity=".3"/>';
    // legs: thighs come toward you, shins down, shoes point at you
    [[-1, 87, 85], [1, 113, 115]].forEach(([sd, kx, ax]) => {
      s += path(cap([x + sd * 9, 119], 8, [kx, 131], 7.4), sd < 0 ? K.pants : K.pants) + path(cap([kx, 132], 6.2, [ax, 163], 4.2), K.pants) + '<path d="M' + P([kx - 4, 131]) + 'q4 2.6 8 0" stroke="' + K.pants2 + '" stroke-width=".6" fill="none"/>';
      s += path(smooth([[ax - 4.6, 162], [ax + 4.6, 162], [ax + 6.4, 168.5], [ax + 4, 171.4], [ax - 4, 171.4], [ax - 6.4, 168.5]], true), K.shoe) + '<rect x="' + (ax - 6) + '" y="170.6" width="12" height="1.6" rx=".8" fill="' + K.sole + '"/>';
      if (o.feet) s += '<ellipse cx="' + ax + '" cy="' + (FLOOR + .4) + '" rx="9" ry="2.6" fill="none" stroke="' + K.ok + '" stroke-width=".7" opacity="' + f(o.feet) + '"/>';
    });
    // torso
    const shY = 52 - br;
    const torso = smooth([[x - 20, shY + 2], [x - 9, shY - 2.4], [x + 9, shY - 2.4], [x + 20, shY + 2], [x + 20.5, shY + 12], [x + 16.4, 96], [x + 17.5, 120], [x, 123], [x - 17.5, 120], [x - 16.4, 96], [x - 20.5, shY + 12]], true, .16);
    s += path(cap([x, 38], 3.4, [x, shY + 1], 3.6), K.skin2) + path(torso, K.top) + '<path d="' + torso + '" fill="url(#' + id + 'tf)"/>';
    s += '<path d="M' + P([x - 5.6, shY - 2]) + 'q5.6 5.2 11.2 0" stroke="' + K.top2 + '" stroke-width="1.4" fill="none"/>';
    s += headFront([x, 29 - br], o.tilt || 0);
    // player's left arm (on your right): from the shoulder down, forearm up to the neck
    const neckAt = o.neckFret != null ? o.neckFret : 3.5, nAng = o.ang != null ? o.ang : PAN_ANG;
    const lhOn = onP(PAN_AT, nAng, [fretX(neckAt), 0]), lAway = o.away || 0;
    const lh = add(lhOn, [lAway * 9, lAway * -6]);
    const le = add([124, 86], [lAway * 4, lAway * -2]);
    s += path(cap([x + 19, shY + 3], 4.6, le, 3.7), K.top);
    s += path(cap(le, 3.5, add(lh, [1.2, 7.8]), 2.7), K.top);
    s += '<g data-p="1">' + placed(id, PAN_AT, nAng, { wiggle: o.wiggle }) + '</g>';
    // left hand: back of the hand below the neck, fingers arch over onto the fretboard
    const lw = add(lh, [1.2, 7.4]);
    s += path(cap(lw, 2.3, add(lh, [.4, 3.6]), 2.6), K.skin, ' stroke="' + K.skin2 + '" stroke-width=".12"');
    if (lAway < .3) [[-1.4, 1.6], [0, 1.9], [1.4, 1.7], [2.7, 1.3]].forEach(([dx], i) => { const tip = onP(PAN_AT, nAng, [fretX(Math.max(.4, neckAt - 1.5 + i)) + .8, [-.45, 0, .45, 0][i] * 1]); s += path(cap(add(lh, [dx * .9 - .6, 3.2]), .82, tip, .62), K.skin, ' stroke="' + K.skin2 + '" stroke-width=".1"'); });
    else s += '<circle cx="' + f(lh[0]) + '" cy="' + f(lh[1] + 2) + '" r="2.4" fill="' + K.skin + '"/>';
    // player's right arm (on your left) over the body; the hand strums between the hole and the fingerboard
    const zone = onP(PAN_AT, nAng, [35.2, 0]), nrmv = rot([0, 1], nAng), sw = o.strum || 0;
    const rh = add(zone, mul(nrmv, -3.2 + sw * 4.4)), re = [69, 88 - br * .5];
    s += path(cap([x - 19, shY + 3], 4.6, re, 3.8), K.top);
    s += path(cap(re, 3.7, add(rh, [-3.4, -4.2]), 2.9), K.top) + path(cap(add(rh, [-3.4, -4.2]), 2.3, add(rh, [-.6, -.8]), 2.5), K.skin, ' stroke="' + K.skin2 + '" stroke-width=".12"');
    s += path(cap(add(rh, [-.8, -1.2]), 1.9, add(rh, [.6, 1.6]), .9), K.skin, ' stroke="' + K.skin2 + '" stroke-width=".1"') + path(cap(add(rh, [.4, -1.4]), 1.1, add(rh, [2.2, -.2]), .75), K.skin, ' stroke="' + K.skin2 + '" stroke-width=".1"');
    return s;
  }
  const frontDefs = id => '<linearGradient id="' + id + 'tf" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity=".2"/><stop offset=".45" stop-color="#fff" stop-opacity=".05"/><stop offset="1" stop-color="#000" stop-opacity=".22"/></linearGradient>';

  /** TOP: seen from above — seat halves, thighs on the front half, feet in front, the panduri across the body */
  function topScene(t, id) {
    let s = '';
    const cx = 100, sy = 46; // seat square 42×42 cm, back edge at sy
    s += '<rect x="' + (cx - 23) + '" y="' + (sy - 6) + '" width="46" height="5" rx="1.6" fill="' + K.chair2 + '"/>';
    s += '<rect x="' + (cx - 21) + '" y="' + sy + '" width="42" height="42" rx="3" fill="' + K.chair + '"/>';
    s += '<rect x="' + (cx - 21) + '" y="' + sy + '" width="42" height="21" rx="3" fill="' + K.bad + '" opacity=".22"/><rect x="' + (cx - 21) + '" y="' + (sy + 21) + '" width="42" height="21" rx="3" fill="' + K.ok + '" opacity=".25"/>';
    s += '<path d="M' + (cx - 21) + ' ' + (sy + 21) + 'h42" stroke="' + K.ink + '" stroke-width=".4" stroke-dasharray="1.4 1.2" opacity=".6"/>';
    // feet & shins in front of the seat
    [[-9.5, -10.5], [9.5, 10.5]].forEach(([hx, fx]) => { s += path(cap([cx + hx, sy + 66], 4.6, [cx + fx, sy + 86], 4.2), K.shoe) + '<ellipse cx="' + (cx + fx) + '" cy="' + (sy + 84) + '" rx="5.2" ry="7.6" fill="' + K.shoe + '"/>'; });
    // thighs from the hips (front half of the seat) to the knees beyond the edge
    [[-9.5], [9.5]].forEach(([hx]) => { s += path(cap([cx + hx, sy + 26], 8.2, [cx + hx * 1.05, sy + 64], 6.6), K.pants) + '<ellipse cx="' + f(cx + hx * 1.05) + '" cy="' + (sy + 64) + '" rx="6.6" ry="5" fill="' + K.pants2 + '" opacity=".5"/>'; });
    // torso (from above): shoulders, back of the head
    s += '<ellipse cx="' + cx + '" cy="' + (sy + 22) + '" rx="21" ry="11" fill="' + K.top + '"/><ellipse cx="' + cx + '" cy="' + (sy + 21) + '" rx="14" ry="8" fill="' + K.topHi + '" opacity=".35"/>';
    s += '<ellipse cx="' + cx + '" cy="' + (sy + 23) + '" rx="8.6" ry="9.6" fill="' + K.hair + '"/><ellipse cx="' + cx + '" cy="' + (sy + 31.6) + '" rx="2.2" ry="1.4" fill="' + K.skin + '"/>';
    // the panduri seen from above: a slab in front of the belly, neck to the player's left (your right)
    const y0 = sy + 37;
    s += path(smooth([[cx - 26, y0 - 3], [cx - 4, y0 - 3.6], [cx + 16, y0 - 2.2], [cx + 18, y0 + 1.2], [cx - 4, y0 + 4.8], [cx - 26, y0 + 5]], true, .12), '#8A5530', ' stroke="' + K.edge + '" stroke-width=".4"');
    s += path('M' + (cx - 26) + ' ' + (y0 + 3.6) + 'L' + (cx + 17) + ' ' + (y0 + 1.6), 'none', ' stroke="' + K.spruce + '" stroke-width="1.4"');
    s += path(cap([cx + 17, y0], 1.4, [cx + 54, y0 - 6], 1.3), K.neck) + path(cap([cx + 54, y0 - 6], 1.6, [cx + 66, y0 - 8.5], 1.6), '#5A3420');
    // arms
    s += path(cap([cx - 19, sy + 22], 4.4, [cx - 22, sy + 34], 3.6), K.top) + path(cap([cx - 22, sy + 34], 3.4, [cx - 6, y0 - 1], 2.6), K.top) + '<circle cx="' + (cx - 5) + '" cy="' + f(y0 - .4) + '" r="2.6" fill="' + K.skin + '"/>';
    s += path(cap([cx + 19, sy + 22], 4.4, [cx + 30, sy + 30], 3.6), K.top) + path(cap([cx + 30, sy + 30], 3.4, [cx + 40, y0 - 5], 2.6), K.top) + '<circle cx="' + (cx + 41) + '" cy="' + f(y0 - 4.2) + '" r="2.5" fill="' + K.skin + '"/>';
    s += label(cx - 30, sy + 10, L(['უკანა ნახევარი ✗', 'Back half ✗']), K.bad, 3.8, 'end') + label(cx - 30, sy + 31, L(['წინა ნახევარი ✓', 'Front half ✓']), K.ok, 3.8, 'end');
    s += label(cx + 26, sy + 86, L(['ფეხები მყარად იატაკზე', 'Feet flat on the floor']), K.ok, 3.6, 'start');
    s += label(cx, sy - 12, L(['ზემოდან', 'From above']), K.dim, 3.6);
    return s;
  }

  /* ---------------- scene registry ---------------- */
  const SCENES = {
    sit: { vb: '18 8 172 168', views: [['side', ['გვერდიდან', 'Side']], ['front', ['წინიდან', 'Front']], ['top', ['ზემოდან', 'Above']]], dur: 10,
      defs: id => sideDefs(id) + frontDefs(id) + panduriDefs(id),
      draw(t, id, view) {
        if (view === 'top') return topScene(t, id);
        if (view === 'front') {
          const k = t % 8, a = ramp(k, .4, 1) * (1 - ramp(k, 3.6, 4)), b = ramp(k, 4.2, 4.8) * (1 - ramp(k, 7.4, 7.9));
          return frontPerson(t, id, { feet: a, strum: (Math.sin(t * 3.1) + 1) / 2 * .25 }) +
            '<g opacity="' + f(a) + '">' + label(100, 14, L(['ფეხები მყარად, ოდნავ განზე', 'Feet flat, slightly apart']), K.ok, 4.2) + '</g>' +
            '<g opacity="' + f(b) + '">' + label(100, 14, L(['მხრები მოდუნებული, თავი სწორად', 'Shoulders loose, head level']), K.ok, 4.2) + line([78, 48], [122, 48], K.ok, .7, ' stroke-dasharray="1.6 1.4"') + '</g>';
        }
        return sideScene(t, id);
      } },
    hold: { vb: '18 8 172 168', dur: 9, defs: id => frontDefs(id) + panduriDefs(id),
      draw(t, id) {
        const k = t % 9, away = ramp(k, 5.6, 6.3) * (1 - ramp(k, 7.8, 8.5)), c = [ramp(k, .2, .6) * (1 - ramp(k, 2.6, 3)), ramp(k, 3, 3.4) * (1 - ramp(k, 5.4, 5.8)), ramp(k, 5.8, 6.2) * (1 - ramp(k, 8.4, 8.8))];
        let s = frontPerson(t, id, { away });
        const hole = onP(PAN_AT, PAN_ANG, [PN.hole, 0]), arm = [76, 99], nk = onP(PAN_AT, PAN_ANG, [fretX(3.5), 0]);
        s += '<g opacity="' + f(c[0]) + '"><ellipse cx="' + f(hole[0] - 3) + '" cy="' + f(hole[1] + 1) + '" rx="20" ry="13" fill="none" stroke="' + K.ok + '" stroke-width=".8" transform="rotate(' + PAN_ANG + ' ' + P(hole) + ')"/>' + label(100, 14, L(['ტანი ეყრდნობა მარჯვენა ბარძაყს და სხეულს', 'The body rests on the right thigh and against you']), K.ok, 4) + '</g>';
        s += '<g opacity="' + f(c[1]) + '">' + line([70, 89], [96, 107], K.ok, 1.2) + label(100, 14, L(['მარჯვენა წინამხარი ზემოდან აკავებს', 'The right forearm holds it from above']), K.ok, 4) + '</g>';
        s += '<g opacity="' + f(c[2]) + '"><circle cx="' + f(nk[0] + 6) + '" cy="' + f(nk[1] - 4) + '" r="9" fill="none" stroke="' + K.ok + '" stroke-width=".8" stroke-dasharray="1.6 1.3"/>' + label(100, 14, L(['მარცხენა ხელი თავისუფალია — ფანდური არ ვარდება', 'The left hand is free — the panduri stays']), K.ok, 4) + '</g>';
        void arm; return s;
      } },
    hands: { vb: '18 8 172 168', dur: 8, defs: id => frontDefs(id) + panduriDefs(id),
      draw(t, id) {
        const k = t % 8, A = k < 4, sw = A ? (Math.sin(k * Math.PI * 1.5 - Math.PI / 2) + 1) / 2 : 0, w = A ? Math.max(0, Math.sin(k * 9)) * .35 * (1 - (k * 1.5 % 1)) : 0;
        let s = frontPerson(t, id, { strum: sw, wiggle: [w, w * .9, w * .8], neckFret: A ? 3.5 : 3.5 + Math.round((k - 4) * 1.2) % 3 });
        const rh = onP(PAN_AT, PAN_ANG, [35.2, 0]), lh = onP(PAN_AT, PAN_ANG, [fretX(3.5), 0]);
        s += '<g opacity="' + f(A ? ramp(k, 0, .4) * (1 - ramp(k, 3.6, 4)) : 0) + '"><circle cx="' + f(rh[0]) + '" cy="' + f(rh[1]) + '" r="9" fill="' + K.ok + '" fill-opacity=".1" stroke="' + K.ok + '" stroke-width=".8"/>' + label(100, 14, L(['მარჯვენა ხელი უკრავს ↓ ↑', 'The right hand strums ↓ ↑']), K.ok, 4.4) + '</g>';
        s += '<g opacity="' + f(!A ? ramp(k, 4, 4.4) * (1 - ramp(k, 7.6, 8)) : 0) + '"><circle cx="' + f(lh[0]) + '" cy="' + f(lh[1]) + '" r="9" fill="#78B7DE" fill-opacity=".1" stroke="#78B7DE" stroke-width=".8"/>' + label(100, 14, L(['მარცხენა ხელი აჭერს სიმებს ლადებზე', 'The left hand presses strings on the frets']), '#9CCBEA', 4.4) + '</g>';
        return s;
      } },
    /** close-up from the front: soundboard, ring of holes, strings A · C♯ · E; the right hand strums */
    strokes: { vb: '0 0 40 26', dur: 4, defs: id => panduriDefs(id) + handDefs(id),
      draw(t, id) {
        const k = t % 4, down = k < 2, q = down ? k : k - 2, mv = easeIO(Math.min(1, Math.max(0, (q - .35) / .9)));
        const y = down ? mix(-4.6, 4.2, mv) : mix(4.2, -4.6, mv), hit = s0 => { const d = (down ? 1 : -1) * (y - s0); return d > 0 ? Math.max(0, .45 - d * .05) * Math.sin(t * 60) * Math.exp(-(q - .35 - mv) * 2) : 0; };
        const strY = [-1.05, 0, 1.05], wig = strY.map(sy0 => hit(sy0 + 13));
        let s = '<g transform="translate(-8 13)">' + panduri(id, { wiggle: wig }) + '</g>';
        // right hand: back of the hand toward you, fingers down (left hand mirrored vertically), thumb toward the neck
        const flex = down ? [[20, mix(65, 12, mv), mix(30, 8, mv)], [45, 55, 30], [50, 60, 30], [55, 60, 30]] : [[30, 50, 25], [45, 55, 30], [50, 60, 30], [55, 60, 30]];
        const th = down ? { a: 8, flex: 25 } : { a: mix(-4, 14, mv), flex: 6 };
        s += '<g transform="translate(' + f(25.8 + (down ? 0 : .6)) + ' ' + f(y + 13 - 12.4) + ') rotate(-14) scale(.86 -.86)">' + hand({ id, flex, thumb: th, sleeve: K.top, sleeve2: K.top2 }) + '</g>';
        s += '<g transform="translate(0 0)">' + label(4, 2.3, down ? '↓ ' + L(['ჩამოკვრა', 'Down']) : '↑ ' + L(['ამოკვრა', 'Up']), down ? K.ink : K.ok, 1.7, 'start') + label(4, 4.3, down ? L(['საჩვენებელი თითის ფრჩხილით', 'back of the index nail']) : L(['ცერა თითის ბალიშით', 'pad of the thumb']), K.dim, 1.15, 'start') + '</g>';
        [['A', '#D9783F'], ['C♯', '#78B7DE'], ['E', '#EFE0B8']].forEach(([n, c], i) => { s += '<circle cx="1.5" cy="' + f(13 + strY[i] * 1.55) + '" r=".75" fill="#100E0D" stroke="' + c + '" stroke-width=".12"/><text x="1.5" y="' + f(13 + strY[i] * 1.55) + '" fill="' + c + '" font-size=".8" font-weight="700" text-anchor="middle" dominant-baseline="central">' + n + '</text>'; });
        return s;
      } },
    /** care: wipe the strings, keep it in a case, away from sun / heater / damp */
    care: { vb: '-4 -16 100 40', dur: 9, defs: panduriDefs,
      draw(t, id) {
        const k = t % 9, ph = k < 3 ? 0 : k < 6 ? 1 : 2, a = [ramp(k, 0, .3) * (1 - ramp(k, 2.7, 3)), ramp(k, 3, 3.3) * (1 - ramp(k, 5.7, 6)), ramp(k, 6, 6.3) * (1 - ramp(k, 8.7, 9))];
        let s = '<g transform="translate(0 2)">' + panduri(id) + '</g>';
        // 1 · a soft cloth glides along the strings
        const cx = 18 + (Math.sin((k / 3) * Math.PI * 2 - Math.PI / 2) + 1) / 2 * 58;
        s += '<g opacity="' + f(a[0]) + '"><path d="' + smooth([[cx - 4, -1.5], [cx + 3.5, -3], [cx + 5, 2], [cx + 2, 6.5], [cx - 5, 5.5], [cx - 6, 1]], true) + '" fill="#E9E1D6" stroke="#B9AE9F" stroke-width=".2"/>' + label(46, 17, L(['დაკვრის მერე — მშრალი, რბილი ქსოვილით', 'After playing — a soft dry cloth']), K.ok, 3.4) + '</g>';
        // 2 · the case closes over it
        const cl = ramp(k, 3.4, 4.6);
        s += '<g opacity="' + f(a[1]) + '"><path d="M-2 -11 H' + f(-2 + 98 * cl) + ' V13 H-2 Z" fill="#2A211C" opacity=".88"/><rect x="-2.5" y="-11.5" width="97" height="25" rx="10" fill="none" stroke="#C98B5B" stroke-width=".6"/>' + label(46, 17, L(['შეინახე ბუდეში ან ჩანთაში', 'Keep it in a case or bag']), K.ok, 3.4) + '</g>';
        // 3 · not in the sun, by a heater, in a damp room or a car
        let ic = '<circle cx="18" cy="-9" r="2.6" fill="#FFD27A"/>';
        for (let i = 0; i < 8; i++) { const r = i * Math.PI / 4; ic += line([18 + Math.cos(r) * 3.5, -9 + Math.sin(r) * 3.5], [18 + Math.cos(r) * 4.9, -9 + Math.sin(r) * 4.9], '#FFD27A', .5); }
        ic += '<rect x="70" y="-13" width="9" height="7" rx="1" fill="none" stroke="#FF8A6B" stroke-width=".55"/>' + [72, 74.5, 77].map(x => line([x, -12], [x, -7], '#FF8A6B', .45)).join('');
        ic += line([12.5, -3.5], [23.5, -14.5], K.bad, .8) + line([67.5, -3.5], [81.5, -14.5], K.bad, .8);
        s += '<g opacity="' + f(a[2]) + '">' + ic + label(46, 17, L(['არა მზეზე, გამათბობელთან, ნესტში ან მანქანაში', 'Not in the sun, by a heater, in damp or a car']), K.ok, 3.2) + '</g>';
        return s;
      } },
    /** the left hand, back toward you: finger numbers 1-4 and T */
    fingers: { vb: '-12 -24 34 34', dur: 7.5, defs: handDefs,
      draw(t, id) {
        const k = t % 7.5, i = Math.floor(k / 1.5), ph = (k % 1.5) / 1.5, bend = Math.sin(Math.min(1, ph / .6) * Math.PI) * (still() ? 0 : 1);
        const flex = [0, 1, 2, 3].map(j => j === i ? [22 * bend, 38 * bend, 18 * bend] : [2, 4, 2]);
        const tips = []; let s = hand({ id, flex, thumb: { a: i === 4 ? -10 * bend : 0, flex: i === 4 ? 20 * bend : 0 }, tips, sleeve: K.top, sleeve2: K.top2 });
        const COL = n => (PD.fingers && PD.fingers.color) ? PD.fingers.color(n) : ['#E8574A', '#3FB37F', '#E8C547', '#4C8DF0'][n - 1];
        tips.forEach((p, j) => { const on = j === i, r = on ? 1.35 : 1.05, lab = j < 4 ? String(j + 1) : 'T', c = j < 4 ? COL(j + 1) : '#6B5A4E';
          s += (on ? '<circle cx="' + f(p[0]) + '" cy="' + f(p[1] - 2.2) + '" r="2" fill="none" stroke="' + K.ok + '" stroke-width=".22"/>' : '') + '<circle cx="' + f(p[0]) + '" cy="' + f(p[1] - 2.2) + '" r="' + r + '" fill="' + c + '" stroke="#fff" stroke-opacity=".7" stroke-width=".14"/><text x="' + f(p[0]) + '" y="' + f(p[1] - 2.15) + '" fill="#fff" font-size="' + f(r * 1.25) + '" font-weight="800" text-anchor="middle" dominant-baseline="central">' + lab + '</text>'; });
        const NM = [['საჩვენებელი', 'Index'], ['შუა', 'Middle'], ['არათითი', 'Ring'], ['ნეკი', 'Little'], ['ცერი', 'Thumb']][i];
        s += label(13.5, -1, L(NM), K.ok, 1.9) + label(13.5, 1.6, i < 4 ? '= ' + (i + 1) : L(['= T (ტარის უკან)', '= T (behind the neck)']), K.ink, 1.6);
        return s;
      } },
    /** warm-up: open and close the hand slowly */
    warmup: { vb: '-12 -24 34 34', dur: 4, defs: handDefs,
      draw(t, id) {
        const k = t % 4, c = easeIO(k < 2 ? k / 2 : 2 - k / 2) * (still() ? 0 : 1);
        const flex = [0, 1, 2, 3].map(j => [88 * c, 100 * c, 62 * c].map(v => v * (1 - j * .02)));
        let s = hand({ id, flex, thumb: { a: -38 * c, flex: 50 * c }, sleeve: K.top, sleeve2: K.top2, spread: 1 - c });
        s += label(14, -2, c > .5 ? L(['მოკუმე', 'Close']) : L(['გაშალე', 'Open']), K.ok, 2) + label(14, 1, '×10', K.dim, 1.5);
        return s;
      } }
  };

  /* ---------------- rendering & the player ---------------- */
  function svg(name, view) {
    const S = SCENES[name]; if (!S) return '';
    const id = 'fg' + (++UID) + '_', v = view || (S.views ? S.views[0][0] : '');
    const t0 = S.still != null ? S.still : (name === 'sit' && v === 'side' ? 6 : name === 'hold' ? 1 : name === 'hands' ? 1 : name === 'strokes' ? 1.1 : name === 'fingers' ? .8 : name === 'warmup' ? 0 : 0);
    LSC = +S.vb.split(' ')[2] > 100 ? 1.4 : 1; const body = S.draw(t0, id, v); LSC = 1;
    return '<svg class="tp-svg fig" data-fig="' + name + '" data-view="' + v + '" data-id="' + id + '" viewBox="' + S.vb + '" role="img" aria-hidden="true"><defs>' + S.defs(id) + '</defs><g class="fig-live">' + S.draw(t0, id, v) + '</g></svg>';
  }
  const live = new Set();
  let raf = 0, last = 0;
  const io = window.IntersectionObserver ? new IntersectionObserver(es => es.forEach(e => { e.target._vis = e.isIntersecting; if (e.isIntersecting) kick(); }), { rootMargin: '40px' }) : null;
  function mount(el) {
    if (el._fig) return; el._fig = { t0: performance.now() }; live.add(el); if (io) io.observe(el); else el._vis = true;
    const S = SCENES[el.dataset.fig];
    // view switch only in the large picture of a card page
    if (S && S.views && el.closest('.tp-hero') && !el.parentNode.querySelector('.fig-views')) {
      const row = document.createElement('div'); row.className = 'seg fig-views'; row.setAttribute('role', 'group');
      S.views.forEach(([k, lab]) => { const b = document.createElement('button'); b.type = 'button'; b.textContent = L(lab); b.setAttribute('aria-pressed', String(k === el.dataset.view)); b.onclick = () => { el.dataset.view = k; el._fig.t0 = performance.now(); row.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', String(x === b))); frame(el, 0); }; row.appendChild(b); });
      el.parentNode.appendChild(row);
    }
    kick();
  }
  function frame(el, t) { const S = SCENES[el.dataset.fig], g = el.querySelector('.fig-live'); if (S && g) { LSC = +S.vb.split(' ')[2] > 100 ? 1.4 : 1; g.innerHTML = S.draw(t, el.dataset.id, el.dataset.view); LSC = 1; } }
  function kick() { if (!raf && !still()) raf = requestAnimationFrame(loop); }
  function loop(now) {
    raf = 0; let any = false;
    if (now - last > 30) {
      last = now;
      live.forEach(el => { if (!el.isConnected) { live.delete(el); if (io) io.unobserve(el); return; } if (!el._vis) return; any = true; frame(el, (now - el._fig.t0) / 1000 + (SCENES[el.dataset.fig].start || 0)); });
    } else any = [...live].some(el => el._vis && el.isConnected);
    if (any && !document.hidden) raf = requestAnimationFrame(loop);
  }
  document.addEventListener('visibilitychange', kick);
  new MutationObserver(ms => { for (const m of ms) m.addedNodes.forEach(n => { if (n.nodeType !== 1) return; if (n.matches && n.matches('svg[data-fig]')) mount(n); else if (n.querySelectorAll) n.querySelectorAll('svg[data-fig]').forEach(mount); }); })
    .observe(document.documentElement, { childList: true, subtree: true });

  return { svg, panduri: (w) => { const id = 'fp' + (++UID) + '_'; return '<svg class="tp-svg" viewBox="-2 -12 96 24" aria-hidden="true"><defs>' + panduriDefs(id) + '</defs>' + panduri(id) + '</svg>'; }, SCENES };
})();
