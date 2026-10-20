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
    spruce: '#EED6A6', spruce2: '#D8B47C', edge: '#7E4E2C', neck: '#8A5532', board: '#6A3720', fret: '#E6DCC6', dot: '#F2CE3A', hole: '#160C07', ring: '#5B3420', bridge: '#F2E6CC', metal: '#BFC3C7', str: '#F4EEE4',
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
    s += path('M' + P([hx, -1.3]) + 'L' + P([90, -1.45]) + 'Q' + P([92.3, -1.5]) + ' ' + P([92.1, 0]) + 'Q' + P([92.3, 1.5]) + ' ' + P([90, 1.45]) + 'L' + P([hx, 1.3]) + 'Z', '#D9C29A', ' stroke="#9C7C52" stroke-width=".14"') + path('M' + P([89.6, -.35]) + 'L' + P([92.2, -.35]) + 'L' + P([92.2, .35]) + 'L' + P([89.6, .35]) + 'Z', '#6B2E1E');
    s += path('M' + P([82.6, -.6]) + 'L' + P([89.4, -.62]) + 'L' + P([89.4, .62]) + 'L' + P([82.6, .6]) + 'Z', '#1A0F09');
    // rollers in the slot (as in the Sami Simi tuner): E nearest the nut · A in the middle · C♯ at the far end
    const ROL = { E: 83.8, A: 86.3, C: 88.6 };
    Object.values(ROL).forEach(x => { s += line([x, -.62], [x, .62], '#E9DCC0', .3); });
    // tuners: C♯ and E on the upper side, A alone on the lower side — gold gear, black button
    [[ROL.C, -1], [ROL.E, -1], [ROL.A, 1]].forEach(([x, sd]) => { s += line([x, sd * 1.45], [x, sd * 2.2], '#C9A04A', .42) + '<circle cx="' + f(x) + '" cy="' + f(sd * 2.25) + '" r=".42" fill="#D9B45A"/><path d="' + smooth([[x - .85, sd * 2.6], [x + .85, sd * 2.6], [x + .95, sd * 3.6], [x, sd * 4.0], [x - .95, sd * 3.6]], true) + '" fill="#141110" stroke="#3A332C" stroke-width=".08"/>'; });
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
      s += line(b, [[86.3, 88.6, 83.8][i], [-.15, 0, .15][i]], K.str, w * .8, ' opacity=".8"');
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

  /* ---------------- the right hand in profile (seen from the thumb side) for strokes ----------------
     Hand frame: wrist at (0,0), hand axis straight down (+y), palm on the left (−x), back of the hand on the right.
     pose: {flex:[mcp,pip,dip] (index; the other fingers follow and curl a little more), tA: thumb angle toward the palm, tF: thumb bend} */
  const SF = [[-.15, 9.5, [4.0, 2.35, 1.85], .92, 0], [.15, 9.8, [4.4, 2.7, 1.9], .95, 6], [.4, 9.4, [4.1, 2.55, 1.85], .9, 11], [.6, 8.6, [3.3, 1.9, 1.65], .78, 16]];
  function handFK(ps) {
    const out = { fingers: [], thumb: null };
    SF.forEach(([bx, by, Ls, r0, extra], i) => {
      let p = [bx, by], a = 0; const pts = [p], rs = [r0, r0 * .9, r0 * .82, r0 * .74];
      Ls.forEach((l, k) => { a += ps.flex[k] * (1 + extra / 60) + (k === 0 ? extra * .3 : 0); const q = add(p, mul(rot([0, 1], a), l)); pts.push(q); p = q; });
      out.fingers.push({ pts, rs, a });
    });
    { let p = [-1.7, 2.4], a = ps.tA; const pts = [p], Ls = [3.7, 3.0, 2.45], rs = [1.25, 1.1, .96, .84];
      Ls.forEach((l, k) => { if (k) a -= ps.tF * (k === 1 ? .55 : .45); const q = add(p, mul(rot([0, 1], a), l)); pts.push(q); p = q; });
      out.thumb = { pts, rs, a }; }
    return out;
  }
  const toWorld = (ps, p) => add(add(ps.wrist, ps.off || [0, 0]), rot(p, ps.W));
  /** world positions of the index nail tip and the thumb nail tip */
  function nailTips(ps) {
    const fk = handFK(ps), fi = fk.fingers[0], th = fk.thumb;
    const tipOf = (c, side) => { const n = c.pts.length, q = c.pts[n - 1], d = nrm(sub(q, c.pts[n - 2])), r = c.rs[c.rs.length - 1]; return add(add(q, mul(d, .32)), mul(rot(d, side), r * .45)); };
    return { index: toWorld(ps, tipOf(fi, -90)), thumb: toWorld(ps, tipOf(th, 90)) };
  }
  function handSideSVG(ps, hl) {
    const fk = handFK(ps), edge = ' stroke="' + K.skin2 + '" stroke-width=".09"';
    let s = '';
    const chain = (c, col) => { let o = ''; for (let k = 0; k < c.pts.length - 1; k++) o += path(cap(c.pts[k], c.rs[k], c.pts[k + 1], c.rs[k + 1]), col, edge); return o; };
    const nail = (c, side, glow) => { const n = c.pts.length, q = c.pts[n - 1], p0 = c.pts[n - 2], d = nrm(sub(q, p0)), r = c.rs[n - 1], ds = rot(d, side), L0 = len(sub(q, p0));
      const a1 = add(add(q, mul(d, -L0 * .55)), mul(ds, r * .78)), a2 = add(add(q, mul(d, .32)), mul(ds, r * .55)), a3 = add(add(q, mul(d, .3)), mul(ds, r * .2)), a4 = add(add(q, mul(d, -L0 * .55)), mul(ds, r * .5));
      return '<path d="M' + P(a1) + 'L' + P(a2) + 'Q' + P(add(a2, mul(d, .12))) + ' ' + P(a3) + 'L' + P(a4) + 'Z" fill="' + K.nail + '" stroke="' + K.nailE + '" stroke-width=".07"/>' + (glow ? '<circle cx="' + f(a2[0]) + '" cy="' + f(a2[1]) + '" r=".55" fill="' + K.ok + '" opacity="' + f(glow) + '"/>' : ''); };
    // fingers behind the index, darker as they go back
    for (let i = 3; i >= 1; i--) s += chain(fk.fingers[i], ['', '#CF9C77', '#C6936E', '#BD8A66'][i]) + nail(fk.fingers[i], -90, 0);
    // palm (profile): back of the hand on the right, the palm pad on the left
    const palm = smooth([[1.7, -.6], [2.15, 3], [2.05, 6.6], [1.5, 9.4], [.2, 10.6], [-1.3, 9.9], [-2.3, 7.2], [-2.75, 4.2], [-2.4, 1.4], [-1.8, -.6]], true);
    s += path(palm, K.skin, edge) + '<path d="M' + P([1.95, 1]) + 'Q' + P([2.25, 5]) + ' ' + P([1.5, 9.2]) + '" stroke="' + K.skinHi + '" stroke-width=".35" fill="none" opacity=".6"/>';
    s += '<path d="M' + P([-2.1, 4.6]) + 'Q' + P([-1.2, 6.2]) + ' ' + P([-1.4, 8.4]) + '" stroke="' + K.crease + '" stroke-width=".09" fill="none"/>';
    s += chain(fk.fingers[0], K.skin) + nail(fk.fingers[0], -90, hl && hl.index);
    // knuckle creases on the index
    [1, 2].forEach(k => { const c = fk.fingers[0], p = c.pts[k], d = nrm(sub(c.pts[k + 1], p)), ds = rot(d, -90); s += '<path d="M' + P(add(p, mul(ds, c.rs[k] * .9))) + 'q' + P(mul(d, .25)) + ' ' + P(mul(rot(d, 90), c.rs[k] * .5)) + '" stroke="' + K.crease + '" stroke-width=".07" fill="none"/>'; });
    // thumb in front
    s += chain(fk.thumb, K.skin) + nail(fk.thumb, 90, hl && hl.thumb);
    return '<g transform="translate(' + P(add(ps.wrist, ps.off || [0, 0])) + ') rotate(' + f(ps.W) + ')">' + s + '</g>';
  }
  /** the stroke cycle (seconds): ↓ the fingers flick open, nail tips lead · ↑ the thumbnail leads; only the wrist turns.
      Geometry: the strings sit in a vertical row (A top · C♯ · E bottom); the wrist is placed so the curled index nail
      passes through the middle string, and the thumb's shape is solved so its nail passes it on the way up. */
  const STR = [[8, 9.9], [8, 11.5], [8, 13.1]];
  const EGG = { flex: [42, 58, 34], tA: 38, tF: 34 }, OPEN = { flex: [6, 8, 3], tA: 30, tF: 10 }, UPM = { flex: [62, 78, 44], tA: 8, tF: 2 };
  const ST = { wrist: [21, 11.5], Wc: 90, up: 1.5, down: 1.4 };
  function strokePose(t) {
    const k = t % 3.2, We = ST.Wc + 40, Wo = ST.Wc - 46;
    const blend = (A, B, m) => ({ flex: A.flex.map((v, i) => mix(v, B.flex[i], m)), tA: mix(A.tA, B.tA, m), tF: mix(A.tF, B.tF, m) });
    let ps, dir, W;
    if (k < .5) { ps = EGG; W = We; dir = 0; }
    else if (k < 1.5) { const m = easeIO(k - .5); ps = blend(EGG, OPEN, easeIO(Math.min(1, Math.max(0, (k - .95) / .5)))); W = mix(We, Wo, m); dir = 1; }
    else if (k < 1.9) { ps = OPEN; W = Wo; dir = 0; }
    else if (k < 2.9) { const m = k - 1.9; ps = m < .55 ? blend(OPEN, UPM, easeIO(m / .55)) : blend(UPM, EGG, easeIO((m - .55) / .45)); W = mix(Wo, We, easeIO(m)); dir = -1; }
    else { ps = EGG; W = We; dir = 0; }
    return Object.assign({ wrist: ST.wrist, off: [0, 0], dir, k, W }, ps);
  }
  const STRC = () => STR;
  let CAL = null;
  function strokeCal() {
    if (CAL) return CAL;
    // radius and angle of the curled index nail with the wrist at the origin
    const pe = Object.assign({ wrist: [0, 0], off: [0, 0], W: 0 }, EGG), tip0 = nailTips(pe).index, R = len(tip0), ang0 = Math.atan2(tip0[1], tip0[0]) * 180 / Math.PI;
    ST.Wc = 180 - ang0; ST.wrist = [STR[1][0] + R, STR[1][1]];
    // the moment of the up-stroke when the hand passes the middle: W(k) = Wc
    let kU = 2.4; for (let k = 1.9; k < 2.9; k += .005) { if (strokePose(k).W >= ST.Wc) { kU = k; break; } }
    let kD = 1; for (let k = .5; k < 1.5; k += .005) { if (strokePose(k).W <= ST.Wc) { kD = k; break; } }
    // thumb shape at kU so its nail meets the middle string
    { const m = kU - 1.9, w = m < .55 ? easeIO(m / .55) : 1; let best = null;
      for (let a = -70; a <= 90; a += 2) for (let fb = -30; fb <= 60; fb += 2) { UPM.tA = a; UPM.tF = fb; const d = len(sub(nailTips(strokePose(kU)).thumb, STR[1])); if (!best || d < best.d) best = { d, a, fb }; }
      UPM.tA = best.a; UPM.tF = best.fb; void w; }
    const toff = sub(STR[1], nailTips(strokePose(kU)).thumb);
    const cross = (from, to, which, off) => STR.map(p => { let best = from, bd = 1e9; for (let k = from; k <= to; k += .01) { const ps = strokePose(k); if (off) ps.off = mul(toff, Math.min(1, Math.sin(Math.PI * (k - 1.9)) * 1.8)); const q = nailTips(ps)[which], d = len(sub(q, p)); if (d < bd) { bd = d; best = k; } } return best; });
    CAL = { str: STR, v: [0, 1], n: [-1, 0], toff, kU, kD, hitD: cross(.5, 1.5, 'index'), hitU: cross(1.9, 2.9, 'thumb', true) };
    return CAL;
  }
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
  const SIDE_BAD = { hip: [86, 117], sh: [77, 76], head: [82, 59], headTilt: 12, knee: [124, 115], ankle: [140, 156], toe: [152, 162], elbow: [80, 92], wrist: [97, 100], hand: [102, 105], elbow2: [83, 90], hand2: [101, 82] };
  const SIDE_OK = { hip: [100, 116], sh: [102, 73], head: [105, 56], headTilt: 0, knee: [139, 117], ankle: [139, 161], toe: [154, 166], elbow: [105, 90], wrist: [121, 96], hand: [125, 103], elbow2: [110, 87], hand2: [124, 74] };
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
    const shY = 63 - br;
    const torso = smooth([[x - 20, shY + 2], [x - 9, shY - 2.4], [x + 9, shY - 2.4], [x + 20, shY + 2], [x + 20.5, shY + 12], [x + 16.4, 96], [x + 17.5, 120], [x, 123], [x - 17.5, 120], [x - 16.4, 96], [x - 20.5, shY + 12]], true, .16);
    s += path(cap([x, 48], 3.4, [x, shY + 1], 3.6), K.skin2) + path(torso, K.top) + '<path d="' + torso + '" fill="url(#' + id + 'tf)"/>';
    s += '<path d="M' + P([x - 5.6, shY - 2]) + 'q5.6 5.2 11.2 0" stroke="' + K.top2 + '" stroke-width="1.4" fill="none"/>';
    s += headFront([x, 40 - br], o.tilt || 0);
    // player's left arm (on your right): from the shoulder down, forearm up to the neck
    const neckAt = o.neckFret != null ? o.neckFret : 3.5, nAng = o.ang != null ? o.ang : PAN_ANG;
    const lhOn = onP(PAN_AT, nAng, [fretX(neckAt), 0]), lAway = o.away || 0;
    const lh = add(lhOn, [lAway * 9, lAway * -6]);
    const le = add([124, 86], [lAway * 4, lAway * -2]);
    s += path(cap([x + 19, shY + 3], 4.6, le, 3.7), K.top);
    s += path(cap(le, 3.5, add(lh, [1.2, 7.8]), 2.7), K.top);
    s += '<g data-p="1">' + placed(id, PAN_AT, nAng, { wiggle: o.wiggle }) + '</g>';
    // left hand: one smooth shape cradling the neck from below (the fingers are shown in detail in the close-up videos)
    { const lw = add(lh, [1.2, 7.4]), u = rot([1, 0], nAng), n = rot([0, 1], nAng), A = (dx, dy) => add(lh, add(mul(u, dx), mul(n, dy)));
      const hand = lAway < .3 ? smooth([add(lw, [-2.2, .6]), A(-3.6, 3.4), A(-3.4, .6), A(-2.2, -1.1), A(0, -1.4), A(2.2, -1.1), A(3.4, .4), A(3.2, 3.2), add(lw, [2.2, .4])], true, .18)
        : smooth([add(lw, [-2.2, .6]), add(lh, [-2.6, 1.6]), add(lh, [0, -.4]), add(lh, [2.6, 1.6]), add(lw, [2.2, .4])], true, .2);
      s += path(hand, K.skin, ' stroke="' + K.skin2 + '" stroke-width=".14"') + (lAway < .3 ? '<path d="M' + P(A(-1.6, -.2)) + 'L' + P(A(-1.4, 1.6)) + 'M' + P(A(.4, -.5)) + 'L' + P(A(.5, 1.4)) + 'M' + P(A(2.2, -.2)) + 'L' + P(A(2.1, 1.4)) + '" stroke="' + K.skin2 + '" stroke-width=".18" stroke-linecap="round" opacity=".55"/>' : ''); }
    // player's right arm (on your left) over the body; the hand strums between the hole and the fingerboard
    const zone = onP(PAN_AT, nAng, [35.2, 0]), nrmv = rot([0, 1], nAng), sw = o.strum || 0;
    // only the wrist turns: the forearm rests still on the body, the rounded hand swings across the strings
    const rh = add(zone, mul(nrmv, -1)), re = [69, 88 - br * .5], wp = add(rh, [-3.4, -4.2]), ang = (sw - .5) * 46;
    s += path(cap([x - 19, shY + 3], 4.6, re, 3.8), K.top);
    s += path(cap(re, 3.7, wp, 2.9), K.top);
    { const h0 = add(rh, [-.6, -.8]), fist = smooth([add(wp, [-1.9, -.9]), add(h0, [-2.4, -.4]), add(h0, [-1.8, 2.2]), add(h0, [.6, 3.0]), add(h0, [2.4, 1.6]), add(h0, [2.5, -.8]), add(h0, [1.4, -2.2]), add(wp, [1.6, -1.6])], true, .2);
      s += '<g transform="rotate(' + f(ang) + ' ' + P(wp) + ')">' + path(fist, K.skin, ' stroke="' + K.skin2 + '" stroke-width=".14"') + '<path d="M' + P(add(h0, [-1.2, 1.6])) + 'Q' + P(add(h0, [.4, 2.4])) + ' ' + P(add(h0, [1.8, 1.2])) + '" stroke="' + K.skin2 + '" stroke-width=".2" fill="none" opacity=".6"/></g>'; }
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

  /* ---------------- left hand on the neck (Bm) ---------------- */
  const bm = () => { const c = (PD.curriculum && PD.curriculum.chords ? PD.curriculum.chords() : []).find(x => x.name === 'Bm'); return c && c.frets.join() === '2,1,2' ? c : { frets: [2, 1, 2], fingers: [2, 1, 3] }; };
  function lhTop(t, id) {
    const k = t % 9, NUT = 3.2, fx = n => NUT + 63 * (1 - Math.pow(2, -n / 12)) * 1.0, SY = { 3: 9.3, 2: 10.4, 1: 11.5 }; // E top · C♯ · A bottom (as on the app's neck)
    const ch = bm(), place = [0, 1, 2].map(i => ({ s: i + 1, f: ch.frets[i], fi: ch.fingers[i] })).filter(p => p.f > 0).sort((a, b) => a.fi - b.fi);
    let s = '';
    // neck: fingerboard, nut, frets 1–6, dots at 3 and 5
    s += '<rect x="' + NUT + '" y="8.6" width="24" height="3.6" rx=".3" fill="url(#' + id + 'nb)"/><rect x="' + (NUT - .5) + '" y="8.5" width=".5" height="3.8" rx=".15" fill="' + K.bridge + '"/><rect x="0" y="8.4" width="' + (NUT - .5) + '" height="4" fill="#C9A06A" opacity=".55"/>';
    for (let n = 1; n <= 6; n++) s += line([fx(n), 8.65], [fx(n), 12.15], K.fret, .16) + '<text x="' + f((fx(n) + fx(n - 1)) / 2) + '" y="13.4" fill="' + K.dim + '" font-size=".75" style="text-anchor:middle" dominant-baseline="central">' + n + '</text>';
    [3, 5].forEach(n => { s += '<circle cx="' + f((fx(n) + fx(n - 1)) / 2) + '" cy="10.4" r=".18" fill="' + K.dot + '"/>'; });
    // when do the fingers land: one by one, then the chord rings, then lift and again
    const land = i => ramp(k, .6 + i * 1.1, 1.2 + i * 1.1) * (1 - ramp(k, 7.8, 8.6));
    const ring = k > 4.4 && k < 7.8 ? Math.exp(-((k - 4.4) % 1.1) * 3) * .35 : 0;
    [3, 2, 1].forEach(sn => { const p = place.find(x => x.s === sn), a = ring * Math.sin(t * 45 + sn); const x0 = p ? fx(p.f) - .5 : NUT - .5; s += '<path d="M0 ' + SY[sn] + 'L' + f(x0) + ' ' + SY[sn] + (a && p ? 'Q' + f((x0 + 27) / 2) + ' ' + f(SY[sn] + a) + ' 27 ' + SY[sn] : 'L27 ' + SY[sn]) + '" stroke="' + K.str + '" stroke-width="' + [0, .16, .13, .11][sn] + '" fill="none"/>'; });
    ['A', 'C♯', 'E'].forEach((nm, i) => { s += '<text x="1.3" y="' + SY[i + 1] + '" fill="' + ['#D9783F', '#78B7DE', '#EFE0B8'][i] + '" font-size=".7" font-weight="800" style="text-anchor:middle" dominant-baseline="central">' + nm + '</text>'; });
    // thumb behind the neck (hidden): a dashed outline under it
    s += '<path d="' + cap([fx(1.6), 13.6], .95, [fx(1.2) - .2, 10.6], .85) + '" fill="none" stroke="' + K.skin + '" stroke-width=".1" stroke-dasharray=".3 .25" opacity=".8"/>';
    // back of the hand above the neck, knuckles in a line
    const KN = [[5.6, 4.3], [7.8, 3.7], [10.0, 3.9], [12.0, 4.7]];
    s += path(smooth([[3.6, -2], [4.2, 3.4], [5.4, 5.2], [8, 4.8], [10.4, 4.9], [12.6, 5.6], [13.8, 3.6], [13.4, -2]], true), K.skin, ' stroke="' + K.skin2 + '" stroke-width=".08"');
    s += path(smooth([[3.6, -2], [4.2, 3.4], [5.4, 5.2], [8, 4.8], [10.4, 4.9], [12.6, 5.6], [13.8, 3.6], [13.4, -2]], true), 'url(#' + id + 'hs)');
    s += '<rect x="2.9" y="-1.6" width="11.8" height="1.6" rx=".5" fill="' + K.top2 + '"/>';
    // the ball the hand holds (rounded shape)
    const ballA = ramp(k, .1, .5) * (1 - ramp(k, 2.2, 2.7));
    s += '<ellipse cx="8.8" cy="7.2" rx="3.2" ry="1.5" fill="#fff" fill-opacity=".05" stroke="' + K.ok + '" stroke-width=".1" stroke-dasharray=".35 .25" opacity="' + f(ballA) + '"/>';
    // fingers: from the knuckle they arch up toward you and come down on the string with the fingertip
    const FN = [1, 2, 3, 4];
    FN.forEach(fi => {
      const kn = KN[fi - 1], p = place.find(x => x.fi === fi), l = p ? land(fi - 1) : 0;
      const target = p ? [fx(p.f) - .62, SY[p.s]] : [kn[0] + .8, 7.6];
      const hover = [kn[0] + (target[0] - kn[0]) * .7, kn[1] + 2.6];
      const tip = p ? mix(hover, target, l) : add([kn[0] + .9, 7.4], [0, Math.sin(t * 1.3 + fi) * .1]);
      const pip = mix(kn, tip, .42), dip = mix(kn, tip, .8), r0 = fi === 4 ? .66 : .8;
      const lift = p ? (1 - l) : 1;
      s += '<ellipse cx="' + f(tip[0] + .15) + '" cy="' + f(tip[1] + .25) + '" rx=".55" ry=".3" fill="#000" opacity="' + f(.35 * (p ? l : 0)) + '"/>';
      s += path(cap(kn, r0, add(pip, [0, -.15]), r0 * .95), K.skin, ' stroke="' + K.skin2 + '" stroke-width=".07"') + path(cap(add(pip, [0, -.15]), r0 * .95, dip, r0 * .84), 'url(#' + id + 'fs)', ' stroke="' + K.skin2 + '" stroke-width=".07"') + path(cap(dip, r0 * .84, tip, r0 * .7), K.skin2, ' stroke="' + K.skin2 + '" stroke-width=".07"');
      s += '<ellipse cx="' + f(pip[0]) + '" cy="' + f(pip[1] - .25) + '" rx="' + f(r0 * .55) + '" ry=".22" fill="' + K.skinHi + '" opacity=".6"/>';
      s += '<ellipse cx="' + f(tip[0]) + '" cy="' + f(tip[1] - .55) + '" rx="' + f(r0 * .48) + '" ry=".32" fill="' + K.nail + '" stroke="' + K.nailE + '" stroke-width=".05"/>';
      if (p && l > .5) { const c = PD.fingers && PD.fingers.color ? PD.fingers.color(fi) : '#E8574A'; s += '<circle cx="' + f(tip[0] + 1.25) + '" cy="' + f(tip[1] - .9) + '" r=".55" fill="' + c + '" stroke="#fff" stroke-opacity=".7" stroke-width=".06"/><text x="' + f(tip[0] + 1.25) + '" y="' + f(tip[1] - .88) + '" fill="#fff" font-size=".65" font-weight="800" style="text-anchor:middle" dominant-baseline="central">' + fi + '</text>'; }
      void lift;
    });
    // captions
    const cA = ramp(k, .1, .5) * (1 - ramp(k, 4, 4.4)), cB = ramp(k, 4.4, 4.8) * (1 - ramp(k, 7.8, 8.3));
    s += '<g opacity="' + f(cA) + '">' + label(26.6, 15.4, L(['თითის წვერი — ლადის ახლოს, მის უკან', 'Fingertip close behind the fret']), K.ok, 1, 'end') + label(26.6, 16.9, L(['თითები მომრგვალებული — სხვა სიმს არ ეხება', 'Fingers rounded — not touching other strings']), K.ink, .9, 'end') + '</g>';
    s += '<g opacity="' + f(cB) + '">' + label(26.6, 15.4, 'Bm · A 2 · C♯ 1 · E 2', K.ok, 1.05, 'end') + label(26.6, 16.9, L(['ხელი მოდუნებული — ზედმეტად ნუ მოუჭერ', 'Hand relaxed — don\'t squeeze']), K.ink, .9, 'end') + '</g>';
    s += label(26.6, 1, L(['ცერი — ტარის უკან (წყვეტილი ხაზი)', 'Thumb behind the neck (dashed)']), K.dim, .8, 'end');
    return s;
  }
  /** cross-section of the neck seen from the head: the hand wraps it like a ball, the thumb rests lightly behind */
  function lhSection(t, id) {
    const k = t % 9, press = 1 - ramp(k % 3, 1.9, 2.3) * (1 - ramp(k % 3, 2.6, 2.95)), cx = 13, cy = 6.6, S = 1.25;
    const T = p => [cx + p[0] * S, cy + p[1] * S];
    let s = '';
    // neck section: fingerboard on top, rounded back below
    s += path('M' + P(T([-1.45, 0])) + 'L' + P(T([1.45, 0])) + 'L' + P(T([1.45, .55])) + 'C' + P(T([1.45, 2.4])) + ' ' + P(T([-1.45, 2.4])) + ' ' + P(T([-1.45, .55])) + 'Z', K.neck);
    s += '<rect x="' + f(T([-1.45, 0])[0]) + '" y="' + f(T([0, 0])[1]) + '" width="' + f(2.9 * S) + '" height="' + f(.5 * S) + '" fill="#4E2817"/>';
    const SX = { 3: -.9, 2: 0, 1: .9 };
    [3, 2, 1].forEach(sn => { s += '<circle cx="' + f(T([SX[sn], -.32])[0]) + '" cy="' + f(T([0, -.32])[1]) + '" r="' + f([0, .13, .11, .09][sn] * S) + '" fill="' + K.str + '"/><text x="' + f(T([SX[sn], -1.5])[0]) + '" y="' + f(T([0, -1.2])[1]) + '" fill="' + ['', '#D9783F', '#78B7DE', '#EFE0B8'][sn] + '" font-size=".8" font-weight="800" style="text-anchor:middle" dominant-baseline="central">' + ['', 'A', 'C♯', 'E'][sn] + '</text>'; });
    // the hand as a "C" around the neck: the space inside is the ball
    const O = T([-1.5, 1.2]), Rr = 3.0 * S, arc = a => [O[0] + Math.cos(a * Math.PI / 180) * Rr, O[1] + Math.sin(a * Math.PI / 180) * Rr];
    s += '<circle cx="' + f(O[0]) + '" cy="' + f(O[1]) + '" r="' + f(Rr * .78) + '" fill="#fff" fill-opacity=".04" stroke="' + K.ok + '" stroke-width=".1" stroke-dasharray=".35 .25"/>';
    const tube = (angs, r0, r1, col, extra) => { let o = ''; for (let i = 0; i < angs.length - 1; i++) { const q0 = Array.isArray(angs[i]) ? angs[i] : arc(angs[i]), q1 = Array.isArray(angs[i + 1]) ? angs[i + 1] : arc(angs[i + 1]); o += path(cap(q0, mix(r0, r1, i / (angs.length - 1)), q1, mix(r0, r1, (i + 1) / (angs.length - 1))), col, extra || ''); } return o; };
    const E = ' stroke="' + K.skin2 + '" stroke-width=".07"';
    // forearm and palm (lower left), thumb along the bottom to the back of the neck
    const wr = T([-5.2, 7.4]);
    s += path(cap(T([-6.6, 11]), 1.9 * S, wr, 1.55 * S), K.top);
    s += tube([wr, 125, 150, 175, 196], 1.25 * S, 1.0 * S, K.skin, E);
    s += tube([118, 95, 72, 52, T([.25, 2.15])], .78 * S, .55 * S, K.skin, E);
    // the finger: from the knuckle over the top, then the tip straight down onto C♯
    const tipY = -.32 - .5 * (1 - press) - .13, tip = T([SX[2], tipY]);
    s += tube([196, 220, 245, 268, 286], .72 * S, .55 * S, 'url(#' + id + 'fs)', E) + path(cap(arc(286), .55 * S, add(tip, [0, -.9 * S]), .48 * S), K.skin, E) + path(cap(add(tip, [0, -.9 * S]), .48 * S, tip, .42 * S), K.skin, E);
    s += line(add(tip, [.4 * S, -1.1 * S]), add(tip, [.38 * S, -.15 * S]), K.nail, .28);
    s += '<circle cx="' + f(tip[0]) + '" cy="' + f(tip[1] + .55) + '" r=".42" fill="none" stroke="' + K.ok + '" stroke-width=".1" opacity="' + f(press) + '"/>';
    // captions
    s += label(.6, .6, L(['ტარის ჭრილი — თავის მხრიდან', 'Neck in section — seen from the head']), K.dim, .8, 'start');
    s += label(26.4, 2.2, L(['თითი თაღივით — წვერი ვერტიკალურად', 'The finger arches — the tip comes straight down']), K.ok, .95, 'end');
    s += label(26.4, 15.2, L(['ცერი ტარის უკან, მსუბუქად', 'Thumb behind the neck, lightly']), K.ink, .9, 'end');
    s += label(26.4, 16.8, L(['ხელისგული ტარს არ ეხება — შიგნით „ბურთია“', 'The palm does not touch the neck — a “ball” inside']), K.ink, .9, 'end');
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
    /** strokes, seen from the side: the strings in cross-section (A top · C♯ · E bottom), the right hand turns only at the wrist */
    strokes: { vb: '-1 -6 37 29', dur: 3.2, defs: id => '<linearGradient id="' + id + 'bw" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stop-color="#9A6038"/><stop offset="1" stop-color="#4A2614"/></linearGradient>',
      draw(t, id) {
        const C = strokeCal(), ps = strokePose(t), k = ps.k;
        if (k >= 1.9 && k < 2.9) ps.off = mul(C.toff, Math.min(1, Math.sin(Math.PI * (k - 1.9)) * 1.8));
        const tips = nailTips(ps);
        // the panduri in cross-section: soundboard, body, strings
        const v = C.v, n = C.n, mid = C.str[1];
        const b0 = add(add(mid, mul(n, 2.4)), mul(v, -10)), b1 = add(add(mid, mul(n, 2.4)), mul(v, 10));
        let s = '<path d="M' + P(b0) + 'C' + P(add(b0, mul(n, 9))) + ' ' + P(add(b1, mul(n, 9))) + ' ' + P(b1) + 'Z" fill="url(#' + id + 'bw)"/>' + line(b0, b1, K.spruce, .55);
        s += label(3, 20.6, L(['ფანდური ჭრილში', 'panduri in section']), K.dim, 1.05, 'start');
        const SC = ['#D9783F', '#78B7DE', '#EFE0B8'], NM = ['A', 'C♯', 'E'];
        C.str.forEach((p, j) => {
          const dk = ps.dir > 0 ? k - C.hitD[j] : ps.dir < 0 ? k - C.hitU[j] : (k < 1.9 && k >= 1.5 ? k - C.hitD[j] : k >= 2.9 ? k - C.hitU[j] : 9);
          const amp = dk > 0 && dk < 1.4 ? Math.exp(-dk * 3) * .5 : 0;
          s += '<ellipse cx="' + f(p[0]) + '" cy="' + f(p[1]) + '" rx="' + f(.34 + amp * Math.abs(Math.sin(t * 40))) + '" ry=".34" fill="' + K.str + '" transform="rotate(' + f(Math.atan2(v[1], v[0]) * 180 / Math.PI - 90) + ' ' + P(p) + ')"/>';
          s += '<text x="' + f(p[0] + n[0] * 4) + '" y="' + f(p[1] + n[1] * 4) + '" fill="' + SC[j] + '" font-size="1" font-weight="800" style="text-anchor:middle" dominant-baseline="central">' + NM[j] + '</text>';
        });
        // forearm stays still; the wrist is the hinge
        const wr = add(ps.wrist, ps.off || [0, 0]), el = add(ps.wrist, [26, -7.5]), u = nrm(sub(el, wr));
        s += path(cap(el, 3.4, add(wr, mul(u, 1.6)), 2.5), K.top) + path(cap(add(wr, mul(u, 2.7)), 2.55, add(wr, mul(u, 1.2)), 2.45), K.top2);
        const hit = (tip) => Math.max(0, 1 - Math.min(...C.str.map(p => len(sub(p, tip)))) / 1.2);
        s += handSideSVG(ps, { index: ps.dir > 0 ? hit(tips.index) : 0, thumb: ps.dir < 0 ? hit(tips.thumb) : 0 });
        s += '<circle cx="' + f(wr[0] + .2) + '" cy="' + f(wr[1]) + '" r="1.1" fill="none" stroke="' + K.ok + '" stroke-width=".16" stroke-dasharray=".4 .3"/>';
        // the egg the hand holds (rounded hand)
        const egg = ps.dir === 0 && (k < .5 || k >= 2.9) ? 1 : 0;
        if (egg) { const c = toWorld(ps, [-2.2, 11.6]); s += '<ellipse cx="' + f(c[0]) + '" cy="' + f(c[1]) + '" rx="2.1" ry="2.7" fill="#fff" fill-opacity=".06" stroke="' + K.ok + '" stroke-width=".14" stroke-dasharray=".5 .35" transform="rotate(' + f(ps.W - 20) + ' ' + P(c) + ')"/>'; }
        // a fading trail of the leading nail
        const lead = ps.dir > 0 ? tips.index : ps.dir < 0 ? tips.thumb : null;
        if (lead) s += '<circle cx="' + f(lead[0]) + '" cy="' + f(lead[1]) + '" r=".5" fill="none" stroke="' + K.ok + '" stroke-width=".14" opacity=".8"/>';
        // captions
        const cap1 = ps.dir > 0 || (k >= 1.5 && k < 1.9) ? ['↓ ' + L(['ჩამოკვრა', 'Down-stroke']), L(['თითები იშლება — სიმებს ეხება ფრჩხილის წვერები', 'The fingers flick open — the nail tips hit the strings'])]
          : ps.dir < 0 || k >= 2.9 ? ['↑ ' + L(['ამოკვრა', 'Up-stroke']), L(['ცერა თითის ფრჩხილის წვერით', 'With the tip of the thumbnail'])]
          : [L(['მომრგვალებული ხელი', 'Rounded hand']), L(['თითქოს კვერცხი ან ბურთი გიჭირავს', 'As if holding an egg or a ball'])];
        s += label(35.5, -4.4, cap1[0], ps.dir < 0 || k >= 2.9 ? K.ok : K.ink, 1.75, 'end') + label(35.5, -2.4, cap1[1], K.dim, 1.05, 'end');
        s += label(35.5, 21.6, L(['მოძრაობს მხოლოდ მაჯა — მკლავი უძრავია', 'Only the wrist moves — the arm stays still']), K.ok, 1.05, 'end');
        return s;
      } },
    /** the left hand on the neck, Bm triangle chord (A 2 · C♯ 1 · E 2 with fingers 2 · 1 · 3 from the chord library):
        from above as you see the neck (E on top, the nut on the left) and in cross-section (how the hand wraps the neck) */
    lefthand: { vb: '0 -1 27 19', views: [['top', ['ზემოდან · Bm', 'From above · Bm']], ['section', ['ჭრილში', 'In section']]], dur: 9,
      defs: id => handDefs(id) + '<linearGradient id="' + id + 'nb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5A2F1C"/><stop offset="1" stop-color="#3E1E10"/></linearGradient><radialGradient id="' + id + 'fs" cx=".5" cy=".35" r=".7"><stop offset="0" stop-color="' + K.skinHi + '"/><stop offset="1" stop-color="' + K.skin + '"/></radialGradient>',
      draw(t, id, view) { return view === 'section' ? lhSection(t, id) : lhTop(t, id); } },
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


  /* ---------------- rendered videos (real 3D hand model on the app's own panduri model) ---------------- */
  const VID = {
    lefthand: { views: [['bm_front', ['წინიდან · სარკეში', 'Front · as in a mirror']], ['bm_player', ['შენი თვალით', 'Your own view']]], loop: 7,
      caps: [[0, 1.0, ['ხელი უახლოვდება ტარს — მაჯა თავისუფალია', 'The hand comes to the neck — the wrist is free']], [1.0, 2.2, ['T ცერა: ბანი (მე-3 სიმი), მე-2 ლადი', 'T thumb: bass (3rd string), fret 2']], [2.2, 3.4, ['1 საჩვენებელი: მე-2 ხმა (მე-2 სიმი), 1-ლი ლადი', '1 index: 2nd voice (2nd string), fret 1']], [3.4, 4.6, ['2 შუა: 1-ლი ხმა (1-ლი სიმი), მე-2 ლადი', '2 middle: 1st voice (1st string), fret 2']], [4.6, 7, ['Bm — ახლა გაიმეორე შენს ფანდურზე', 'Bm — now copy it on your panduri']]] },
    strokes: { views: [['strokes_side', ['გვერდიდან', 'From the side']], ['strokes_front', ['წინიდან · სარკეში', 'Front · as in a mirror']]], loop: 3.2,
      caps: [[0, .5, ['მომრგვალებული ხელი — თითქოს კვერცხი გიჭირავს', 'A rounded hand — as if holding an egg']], [.5, 1.9, ['↓ ჩამოკვრა: თითები იშლება, სიმებს ეხება ფრჩხილის წვერები', '↓ Down: the fingers open, the nail tips hit the strings']], [1.9, 3.2, ['↑ ამოკვრა: ცერა თითის ფრჩხილის წვერით', '↑ Up: with the tip of the thumbnail']]],
      note: ['მოძრაობს მხოლოდ მაჯა — მკლავი უძრავია', 'Only the wrist moves — the arm stays still'] },
    fingers: { views: [['fingers', null]], loop: 7.5, caps: [[0, 1.5, ['1 — საჩვენებელი', '1 — index']], [1.5, 3, ['2 — შუა', '2 — middle']], [3, 4.5, ['3 — არათითი', '3 — ring']], [4.5, 6, ['4 — ნეკი', '4 — little']], [6, 7.5, ['T — ცერა', 'T — thumb']]] },
    warmup: { views: [['warmup', null]], loop: 4, caps: [[0, 2, ['ნელა მოკუმე', 'Close slowly']], [2, 4, ['ნელა გაშალე', 'Open slowly']]], note: ['×10', '×10'] }
  };
  const figAsset = n => PD.assets && PD.assets.fig && PD.assets.fig[n];
  /** a rendered video for a card (poster in lists, autoplaying loop on the card page); falls back to the drawing */
  function media(key) {
    const V0 = VID[key], a = V0 && figAsset(V0.views[0][0]);
    if (!a) return SCENES[key] ? svg(key) : '';
    return '<div class="fig-vid" data-vid="' + key + '" data-view="' + V0.views[0][0] + '"><img class="fig-poster" src="' + a.jpg + '" alt="" loading="lazy"><video muted loop playsinline autoplay preload="auto" poster="' + a.jpg + '" src="' + a.mp4 + '"></video><div class="fig-vcap" aria-live="polite"></div>' + (V0.note ? '<div class="fig-vnote">' + L(V0.note) + '</div>' : '') + '</div>';
  }
  function mountVid(el) {
    if (el._mv) return; el._mv = 1;
    const V0 = VID[el.dataset.vid], vid = el.querySelector('video'), cap = el.querySelector('.fig-vcap');
    if (!el.closest('.tp-hero')) { if (vid) { vid.removeAttribute('autoplay'); vid.pause(); vid.remove(); } return; }
    if (still() && vid) { vid.removeAttribute('autoplay'); vid.pause(); }
    let last = '';
    const tick = () => { if (!el.isConnected) return; const t = (vid.currentTime || 0) % V0.loop, c = V0.caps.find(([a, b]) => t >= a && t < b); const txt = c ? L(c[2]) : ''; if (txt !== last) { last = txt; cap.textContent = txt; cap.classList.toggle('on', !!txt); } requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
    if (V0.views.length > 1 && !el.parentNode.querySelector('.fig-views')) {
      const row = document.createElement('div'); row.className = 'seg fig-views'; row.setAttribute('role', 'group');
      V0.views.forEach(([n, lab]) => { const b = document.createElement('button'); b.type = 'button'; b.textContent = L(lab); b.setAttribute('aria-pressed', String(n === el.dataset.view)); b.onclick = () => { const a = figAsset(n); if (!a) return; el.dataset.view = n; vid.poster = a.jpg; vid.src = a.mp4; el.querySelector('.fig-poster').src = a.jpg; const p = vid.play(); if (p && p.catch) p.catch(() => {}); row.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', String(x === b))); }; row.appendChild(b); });
      el.parentNode.appendChild(row);
    }
    const p = vid.play(); if (p && p.catch) p.catch(() => {});
  }
  new MutationObserver(ms => { for (const m of ms) m.addedNodes.forEach(n => { if (n.nodeType !== 1) return; if (n.matches && n.matches('.fig-vid')) mountVid(n); else if (n.querySelectorAll) n.querySelectorAll('.fig-vid').forEach(mountVid); }); }).observe(document.documentElement, { childList: true, subtree: true });

  return { media, VID, svg, panduri: (w) => { const id = 'fp' + (++UID) + '_'; return '<svg class="tp-svg" viewBox="-2 -12 96 24" aria-hidden="true"><defs>' + panduriDefs(id) + '</defs>' + panduri(id) + '</svg>'; }, SCENES };
})();
