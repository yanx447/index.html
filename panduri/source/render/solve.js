/* Pose solver for one hand on the panduri neck. Only joint rotations change (bone lengths are fixed),
   so fingers can never stretch. The objective: fingertip pads on their string/fret targets, every other
   part of the hand outside the neck and above the strings (rounded, arched fingers), natural joint ranges,
   a relaxed hand (ring/little finger loosely curled), and continuity with a previous pose. */
const { V, Q } = window.HS;
const D2R = Math.PI / 180;
export const FING = ['index', 'middle', 'ring', 'pinky'];
export function neckGeo(HS) {
  const X = HS.X, G = HS.G3, L = G.L, BR = -L;
  const fy = n => -L * HS.TH.fretFrac(n);
  const sx = (s, y) => X.SX_NUT[s] + (X.SX_BR[s] - X.SX_NUT[s]) * (y / BR), sz = y => X.SZ_NUT + (X.SZ_BR - X.SZ_NUT) * (y / BR);
  const hw = y => (y >= G.BT ? 15 + 3 * Math.min(1, Math.max(0, y / G.BT)) : 18), dep = y => (y >= G.BT ? 19 + 6 * Math.min(1, Math.max(0, y / G.BT)) : 25);
  /** where a fingertip goes for string s at fret f: just behind the fret, on top of the string */
  const target = (s, f, lift) => { const y = fy(f) + .3 * (fy(f - 1) - fy(f)); return [sx(s, y), y, sz(y) + X.SRAD[s] + (lift || 0)]; };
  /** how deep a sphere (p, r) sits inside the neck or the string band */
  function pen(p, r, strings) {
    const [x, y, z] = p; if (y > 4 || y < G.BT - 10) return 0;
    const w = hw(y), d = dep(y);
    let depth = 0;
    if (z >= 0) {
      const band = Math.max(Math.abs(sx(1, y)), Math.abs(sx(3, y))) + 2.5;
      const top = strings !== false && Math.abs(x) < band + r ? sz(y) + 1.2 : 5;
      if (Math.abs(x) < w + r) depth = Math.max(depth, Math.min(top + r - z, w + r - Math.abs(x)));
    } else {
      const e = Math.pow(x / (w + r), 2) + Math.pow(z / (d + r), 2);
      if (e < 1) depth = Math.max(depth, (1 - Math.sqrt(e)) * (w + r));
    }
    return Math.max(0, depth);
  }
  return { fy, sx, sz, hw, dep, target, pen };
}

/** parameter vector <-> pose */
export function pack(p) { return [...p.rv, ...p.rp, p.wflex, p.wdev, ...p.f.flat(), ...p.t]; }
export function unpack(v) { return { rv: v.slice(0, 3), rp: v.slice(3, 6), wflex: v[6], wdev: v[7], f: [v.slice(8, 12), v.slice(12, 16), v.slice(16, 20), v.slice(20, 24)], t: v.slice(24, 29) }; }
/** the hand is placed directly (rv/rp = hand rotation and wrist position in mm); the forearm follows from the wrist angles */
export function toPose(rg, SC, u) {
  const S = rg.S, ax = rg.axes[`hand.${S}`], Lh = Q.mul(Q.axis(ax.abd, u.wdev), Q.axis(ax.flex, u.wflex)), hq = Q.fromVec(u.rv);
  const conj = q => [-q[0], -q[1], -q[2], q[3]], rootQ = Q.mul(hq, conj(Lh));
  const wrist = V.mul(u.rp, 1 / SC), rootP = V.sub(wrist, Q.rot(rootQ, V.sub(rg.H[`hand.${S}`], rg.H[rg.root])));
  return { rootQ, rootP, wflex: u.wflex, wdev: u.wdev, f: u.f, t: u.t };
}

const LIM = { f: [[-15, 95], [-22, 22], [0, 105], [-5, 80]], t: [[-70, 70], [-70, 70], [-45, 80], [-25, 75], [-25, 85]], w: [[-65, 65], [-30, 30]] };

export function solver(HS, S) {
  const rg = HS.rigs[S], SC = HS.SC, N = neckGeo(HS), rad = b => (HS.radius[b] || .03) * SC;
  /** evaluate a parameter vector */
  function evalV(v, task) {
    const u = unpack(v), pose = toPose(rg, SC, u), F = rg.fk(pose), Wp = n => V.mul(F.W[n].p, SC), Wq = n => F.W[n].q;
    let E = 0;
    const tipPad = (last, dorsalAxis) => { const tip = V.mul(F.tip(last), SC), q = Wq(last), d = V.nrm(Q.rot(q, rg.axes[last].d)), dr = V.nrm(Q.rot(q, dorsalAxis)); const r = rad(last); return { pad: V.sub(V.sub(tip, V.mul(d, .55 * r)), V.mul(dr, .55 * r)), d, dr, r }; };
    const pads = {};
    FING.forEach(fn => { pads[fn] = tipPad(`finger_${fn}.03.${S}`, rg.dorsal); });
    pads.thumb = tipPad(`thumb.03.${S}`, rg.axes[`thumb.03.${S}`].dorsal);
    // 1 · targets
    Object.keys(task.targets).forEach(k => { const t = task.targets[k], e = V.sub(pads[k].pad, t); E += (task.tw || 40) * V.dot(e, e); });
    // 2 · nothing inside the neck; arched fingers above the strings (the contact pad itself is exempt)
    const pts = [];
    const seg = (a, b, ra, rb, n, strings) => { for (let i = 0; i <= n; i++) { const k = i / n; pts.push([V.add(a, V.mul(V.sub(b, a), k)), ra + (rb - ra) * k, strings]); } };
    FING.concat(['thumb']).forEach(fn => {
      const ch = fn === 'thumb' ? ['thumb.01', 'thumb.02', 'thumb.03'] : [`finger_${fn}.01`, `finger_${fn}.02`, `finger_${fn}.03`];
      const pressing = task.targets[fn] != null;
      ch.forEach((b, i) => { const n = `${b}.${S}`, a = Wp(n), e = i < 2 ? Wp(`${ch[i + 1]}.${S}`) : V.mul(F.tip(n), SC); seg(a, i < 2 ? e : V.add(a, V.mul(V.sub(e, a), pressing ? .45 : 1)), rad(n) * .95, rad(n) * .9, i < 2 ? 3 : 2, true); });
    });
    // palm: keep a gap (the "ball") between the palm and the back of the neck
    [`hand.${S}`, `palm.01.${S}`, `palm.02.${S}`, `palm.03.${S}`, `palm.04.${S}`].forEach(b => { const a = Wp(b), kid = (rg.kids[b] || [])[0]; if (kid) seg(a, Wp(kid), 13, 12, 3, false); });
    pts.forEach(([p, r, st]) => { const d = N.pen(p, r, st); E += 150 * d * d; });
    // 3 · fingers do not pass through each other (sample the middle phalanges)
    for (let i = 0; i < 3; i++) { const a = Wp(`finger_${FING[i]}.02.${S}`), b = Wp(`finger_${FING[i + 1]}.02.${S}`), dd = V.len(V.sub(a, b)), need = rad(`finger_${FING[i]}.02.${S}`) + rad(`finger_${FING[i + 1]}.02.${S}`) - 1; if (dd < need) E += 20 * (need - dd) ** 2; }
    // 4 · pressing fingertips come down onto the string (not flat)
    Object.keys(task.targets).forEach(k => { if (k === 'thumb' || (task.flat || []).includes(k)) return; const dz = -pads[k].d[2]; if (dz < .55) E += 60 * (.55 - dz) ** 2; });
    // the thumb, when pressing, comes over the edge onto the string (from the side, down onto the board)
    if (task.targets.thumb && task.thumbDir) { const c = V.dot(pads.thumb.d, task.thumbDir); if (c < .4) E += 40 * (.4 - c) ** 2; }
    // 5 · natural ranges, gentle preferences
    const lim = (x, [a, b], w) => { const xa = x / D2R; if (xa < a) E += w * ((a - xa) / 10) ** 2; if (xa > b) E += w * ((xa - b) / 10) ** 2; };
    u.f.forEach((f, i) => { f.forEach((x, k) => lim(x, LIM.f[k], 45)); E += .4 * ((f[3] - .62 * f[2]) / (30 * D2R)) ** 2; });
    u.t.forEach((x, k) => lim(x, LIM.t[k], 30)); lim(u.wflex, LIM.w[0], 20); lim(u.wdev, LIM.w[1], 20);
    // free fingers stay clear of the strings and the fretboard (they rest below the neck)
    (task.free || []).forEach(fn => {
      const tip = pads[fn].pad, w = N.hw(tip[1]);
      if (tip[0] < w + 6) E += 8 * (w + 6 - tip[0]) ** 2;             // out past the edge of the board
      if (tip[2] > -4) E += 9 * (tip[2] + 4) ** 2;                     // and below its face, never over the strings
    });
    // no fingertip hides another: the tips keep a little air between them
    for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) {
      const a = pads[FING[i]].pad, b = pads[FING[j]].pad, dd = V.len(V.sub(a, b));
      if (dd < 16) E += 10 * (16 - dd) ** 2;
    }
    // resting places for the free fingers (curled under the neck)
    Object.entries(task.restTips || {}).forEach(([fn, f]) => { if (task.targets[fn]) return; const e = V.sub(pads[fn].pad, f()); E += 5 * V.dot(e, e) / 10; });
    // relaxed ring / little finger: loosely curled, following the middle finger
    if (!task.targets.ring) { const f = u.f[2], m = u.f[1]; E += .5 * ((f[0] - m[0] * .9) / (25 * D2R)) ** 2 + .3 * ((f[2] - Math.max(.6, m[2])) / (30 * D2R)) ** 2; }
    if (!task.targets.pinky) { const f = u.f[3], r = u.f[2]; E += .5 * ((f[0] - r[0]) / (25 * D2R)) ** 2 + .3 * ((f[2] - r[2]) / (30 * D2R)) ** 2; }
    // forearm comes from the elbow side
    if (task.elbowDir) { const fa = V.nrm(Q.rot(pose.rootQ, V.sub(rg.H[`forearm.${S}`], rg.H[`hand.${S}`]))); const c = V.dot(fa, task.elbowDir); E += (task.elbowW || 4) * (1 - c) ** 2; }
    // soft guides: where the palm, the knuckles and the thumb base should be (hand behind the neck)
    (task.guides || []).forEach(([b, pt, w]) => { const pp = b === 'palm' ? V.mul([`palm.01.${S}`, `palm.02.${S}`, `palm.03.${S}`, `palm.04.${S}`, `hand.${S}`].map(n => Wp(n)).reduce((a, c) => V.add(a, c), [0, 0, 0]), 1 / 5) : Wp(`${b}.${S}`); const e = V.sub(pp, pt); E += w * V.dot(e, e) / 100; });
    // task-specific structure (e.g. which side of the neck the palm and knuckles stay on)
    if (task.extra) E += task.extra(Wp, S);
    // continuity with a reference pose
    if (task.ref) { for (let i = 0; i < v.length; i++) { const w = i < 3 ? (task.refRot || 6) : i < 6 ? .004 : i < 8 ? 2 : (task.refJ || 0); E += w * (v[i] - task.ref[i]) ** 2; } }
    return { E, pads, F, u };
  }
  /** coordinate descent with shrinking steps and random kicks */
  function solve(task, v0, iters) {
    let v = v0.slice(), best = evalV(v, task).E;
    const step = v.map((_, i) => i < 3 ? .2 : i < 6 ? 12 : .25);
    for (let it = 0; it < (iters || 60); it++) {
      let improved = false;
      for (let i = 0; i < v.length; i++) {
        for (const sg of [1, -1]) { const w = v.slice(); w[i] += sg * step[i]; const e = evalV(w, task).E; if (e < best) { best = e; v = w; improved = true; break; } }
      }
      if (!improved) for (let i = 0; i < step.length; i++) step[i] *= .6;
      if (Math.max(...step.slice(6)) < .002 && step[3] < .05) break;
    }
    return { v, E: best };
  }
  return { evalV, solve, N, rg, SC };
}
