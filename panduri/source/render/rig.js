/* Hand rig: forward kinematics on the skeleton derived from the arm model's vertex groups,
   a pose = joint angles about anatomical axes (taken from the rest pose), and a small
   optimiser that places fingertips on string/fret targets without stretching anything.
   Bone lengths never change: only rotations are solved. Units: model units (scaled to mm outside). */
export const V = {
  add: (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]], sub: (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]],
  mul: (a, k) => [a[0] * k, a[1] * k, a[2] * k], dot: (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2],
  cross: (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]],
  len: a => Math.hypot(a[0], a[1], a[2]), nrm: a => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; }
};
export const Q = {
  id: () => [0, 0, 0, 1],
  axis: (ax, ang) => { const s = Math.sin(ang / 2); return [ax[0] * s, ax[1] * s, ax[2] * s, Math.cos(ang / 2)]; },
  mul: (a, b) => [a[3] * b[0] + a[0] * b[3] + a[1] * b[2] - a[2] * b[1], a[3] * b[1] - a[0] * b[2] + a[1] * b[3] + a[2] * b[0], a[3] * b[2] + a[0] * b[1] - a[1] * b[0] + a[2] * b[3], a[3] * b[3] - a[0] * b[0] - a[1] * b[1] - a[2] * b[2]],
  rot: (q, v) => { const u = [q[0], q[1], q[2]], s = q[3], t = V.mul(V.cross(u, v), 2); return V.add(V.add(v, V.mul(t, s)), V.cross(u, t)); },
  fromVec: r => { const a = V.len(r); return a < 1e-9 ? [0, 0, 0, 1] : Q.axis(V.mul(r, 1 / a), a); }
};
const FING = ['index', 'middle', 'ring', 'pinky'];
export function makeRig(RIG, S) {
  const R = RIG[S], H = R.heads, T = R.tails, par = R.par;
  const names = Object.keys(par).filter(n => !n.startsWith('upper_arm'));
  const kids = {}; names.forEach(n => { const p = par[n]; if (p && names.includes(p)) (kids[p] = kids[p] || []).push(n); });
  // anatomical frame of the hand at rest: dorsal normal from the knuckle line and the finger direction
  const kI = H[`finger_index.01.${S}`], kP = H[`finger_pinky.01.${S}`], kM = H[`finger_middle.01.${S}`], wr = H[`hand.${S}`];
  const fingerDir = V.nrm(V.sub(H[`finger_middle.02.${S}`], kM));
  const across = V.nrm(V.sub(kI, kP)); // pinky → index
  let dorsal = V.nrm(V.cross(across, fingerDir));
  // the back of the hand is where the knuckles bulge: make sure it points away from the palm centre (use rest normal y as tie-break)
  // the nails of this model face −z in the rest pose (measured from the nail UV islands)
  if (dorsal[2] > 0) dorsal = V.mul(dorsal, -1);
  const axes = {};
  const chainDir = (a, b) => V.nrm(V.sub(b, a));
  FING.forEach(fn => {
    [1, 2, 3].forEach(k => {
      const n = `finger_${fn}.0${k}.${S}`, nx = k < 3 ? H[`finger_${fn}.0${k + 1}.${S}`] : T[n], d = chainDir(H[n], nx);
      const flex = V.nrm(V.cross(dorsal, d));
      axes[n] = { flex, abd: dorsal, d };
    });
  });
  { // thumb: its nail faces −y at rest (measured); it flexes toward the palm, abducts away from it, and rolls (opposition)
    ['thumb.01', 'thumb.02', 'thumb.03'].forEach((b, k) => { const n = `${b}.${S}`, nx = k < 2 ? H[`thumb.0${k + 2}.${S}`] : T[n]; const dd = chainDir(H[n], nx);
      let tD = V.sub([0, -1, 0], V.mul(dd, V.dot([0, -1, 0], dd))); tD = V.nrm(tD);
      axes[n] = { flex: V.nrm(V.cross(tD, dd)), abd: tD, d: dd, dorsal: tD, opp: dd }; }); }
  axes[`hand.${S}`] = { flex: V.nrm(V.cross(dorsal, fingerDir)), abd: dorsal, twist: fingerDir };
  const root = `forearm.${S}`;
  /** local rotations from a parameter object */
  function locals(p) {
    const L = {};
    names.forEach(n => { L[n] = Q.id(); });
    L[`hand.${S}`] = Q.mul(Q.axis(axes[`hand.${S}`].abd, p.wdev || 0), Q.axis(axes[`hand.${S}`].flex, p.wflex || 0));
    FING.forEach((fn, i) => {
      const f = p.f[i];
      L[`finger_${fn}.01.${S}`] = Q.mul(Q.axis(axes[`finger_${fn}.01.${S}`].flex, f[0]), Q.axis(axes[`finger_${fn}.01.${S}`].abd, f[1]));
      L[`finger_${fn}.02.${S}`] = Q.axis(axes[`finger_${fn}.02.${S}`].flex, f[2]);
      L[`finger_${fn}.03.${S}`] = Q.axis(axes[`finger_${fn}.03.${S}`].flex, f[3]);
    });
    const t = p.t;
    L[`thumb.01.${S}`] = Q.mul(Q.axis(axes[`thumb.01.${S}`].opp, t[0]), Q.mul(Q.axis(axes[`thumb.01.${S}`].abd, t[1]), Q.axis(axes[`thumb.01.${S}`].flex, t[2])));
    L[`thumb.02.${S}`] = Q.axis(axes[`thumb.02.${S}`].flex, t[3]);
    L[`thumb.03.${S}`] = Q.axis(axes[`thumb.03.${S}`].flex, t[4]);
    return L;
  }
  /** world transforms: root placed by p.rootQ (rotation about the forearm head) and p.rootP (where the forearm head goes) */
  function fk(p) {
    const L = locals(p), W = {};
    const walk = (n, pq, pp, ph) => {
      // pp = world position of parent head, pq = world rotation of parent, ph = rest head of parent
      const q = Q.mul(pq, L[n]), pos = n === root ? p.rootP : V.add(pp, Q.rot(pq, V.sub(H[n], ph)));
      W[n] = { q, p: pos };
      (kids[n] || []).forEach(c => walk(c, q, pos, H[n]));
    };
    walk(root, Q.mul(p.rootQ, L[root]), null, null);
    const tip = n => V.add(W[n].p, Q.rot(W[n].q, V.sub(T[n], H[n])));
    return { W, tip, L };
  }
  return { S, names, kids, H, T, axes, dorsal, across, fingerDir, fk, locals, root, par };
}
