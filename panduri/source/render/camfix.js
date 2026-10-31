/* For every stored pose: find a camera angle from which the fingers that press are not hidden
   by the fingers that do not. The pose itself is never changed — only the angle the app looks
   from. A finger is "hiding" a fingertip when the straight line from that tip to the camera
   passes through one of its bones (each bone is a capsule of the model's own radius). */
import { solver, unpack, toPose } from './solve.js';
const HS = window.HS, { V, Q } = HS, S = 'L'; HS.hideArm('R');
const SV = solver(HS, S), rg = SV.rg, SC = SV.SC;
const FING = ['index', 'middle', 'ring', 'pinky'];
const rad = b => (HS.radius[b] || .03) * SC;

/** distance from a point to a segment */
function segDist(p, a, b) {
  const ab = V.sub(b, a), t = Math.max(0, Math.min(1, V.dot(V.sub(p, a), ab) / (V.dot(ab, ab) || 1e-9)));
  return V.len(V.sub(p, V.add(a, V.mul(ab, t))));
}
/** how deep a ray (from p towards dir) passes inside a capsule (a,b,r): 0 = clear */
function rayCapsule(p, dir, a, b, r, maxT) {
  let hit = 0;
  for (let i = 1; i <= 14; i++) {
    const q = V.add(p, V.mul(dir, maxT * i / 14));
    const d = segDist(q, a, b);
    if (d < r) hit = Math.max(hit, r - d);
  }
  return hit;
}

const POSES = window.POSE_LIST || {};
const out = {};
let n = 0, moved = 0;
for (const [key, r] of Object.entries(POSES)) {
  const fingers = key.split('/')[1].split('');            // e.g. "T13" → thumb, index, ring
  const used = new Set();
  fingers.forEach(c => { if (c === 'T') used.add('thumb'); else if (c !== '0') used.add(FING[+c - 1]); });
  const ev = SV.evalV(r.v, { targets: {}, free: [] });
  const Wp = n2 => V.mul(ev.F.W[n2].p, SC);
  // the tips that must be seen, and the bones that might be in the way
  const tips = [];
  used.forEach(fn => {
    if (fn === 'thumb') return;
    tips.push(ev.pads[fn].pad);
    // the finger itself must be seen, not only its tip: sample along its last two bones
    ['01', '02', '03'].forEach((seg, i) => {
      const nm = `finger_${fn}.${seg}.${S}`, a = Wp(nm);
      const b = seg === '03' ? V.mul(ev.F.tip(nm), SC) : Wp(`finger_${fn}.0${+seg + 1}.${S}`);
      for (let k = 1; k <= 3; k++) tips.push(V.add(a, V.mul(V.sub(b, a), k / 3.5)));
    });
  });
  const blockers = [];
  FING.forEach(fn => {
    if (used.has(fn)) return;
    ['01', '02', '03'].forEach((seg, i) => {
      const nm = `finger_${fn}.${seg}.${S}`, a = Wp(nm);
      const b = i < 2 ? Wp(`finger_${fn}.0${+seg + 1}.${S}`) : V.mul(ev.F.tip(nm), SC);
      blockers.push([a, b, rad(nm) * .92 + 3]);   // a near miss still crowds the picture
    });
  });
  // the app's two cameras, as directions from the hand
  const base = { front: [70, -30, 250], player: [-230, -60, 110] };
  const res = {};
  for (const [name, dir0] of Object.entries(base)) {
    const d0 = V.nrm(dir0);
    const score = d => {
      let bad = 0;
      tips.forEach(tp => { blockers.forEach(([a, b, rr]) => { bad += rayCapsule(tp, d, a, b, rr, 180); }); });
      return bad;
    };
    const s0 = score(d0);
    let best = { yaw: 0, pitch: 0, bad: s0 };
    if (s0 > 0.8) {                                        // only look for another angle when something is really in the way
      for (let yaw = -30; yaw <= 30; yaw += 6) for (let pitch = -16; pitch <= 24; pitch += 8) {
        if (!yaw && !pitch) continue;
        const qy = Q.axis([0, 1, 0], yaw * Math.PI / 180), qp = Q.axis([1, 0, 0], pitch * Math.PI / 180);
        const d = V.nrm(Q.rot(Q.mul(qy, qp), d0));
        const bad = score(d) + (Math.abs(yaw) + Math.abs(pitch)) * 0.004;   // the smallest move that frees the view
        if (bad < best.bad - 1e-6) best = { yaw, pitch, bad };
      }
    }
    res[name] = { yaw: best.yaw, pitch: best.pitch, bad: +best.bad.toFixed(2), was: +s0.toFixed(2) };
    if (best.yaw || best.pitch) moved++;
  }
  out[key] = res;
  n++; if (n % 50 === 0) console.log('cams', n, '/', Object.keys(POSES).length, '· moved', moved);
}
window.JOB_RESULT = out; window.JOB_DONE = true;
