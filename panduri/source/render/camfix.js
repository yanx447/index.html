/* Pick both teaching views for every final pose. Include the thumb and ALL
   other digits as blockers, and use the same perspective eye as hand3d.js. */
import { solver, segmentDistance } from './solve.js';
const HS = window.HS, { V, Q } = HS;
const SV = solver(HS, 'L'), SC = SV.SC;
const names = ['index', 'middle', 'ring', 'pinky', 'thumb'];
const out = {};
for (const [key, pose] of Object.entries(window.POSE_LIST || {})) {
  const fingers = key.split('/')[1], used = names.filter((_, i) => fingers.includes(i === 4 ? 'T' : String(i + 1)));
  const ev = SV.evalV(pose.v, { targets: {} }), F = ev.F;
  const bones = [], samples = [];
  for (const fn of names) {
    const prefix = fn === 'thumb' ? 'thumb' : 'finger_' + fn;
    for (let i = 1; i <= 3; i++) {
      const n = `${prefix}.0${i}.L`, a = V.mul(F.W[n].p, SC);
      const b = V.mul(i < 3 ? F.W[`${prefix}.0${i + 1}.L`].p : F.tip(n), SC);
      bones.push({ fn, a, b, r: (HS.radius[n] || .03) * SC + 1.5 });
      if (used.includes(fn) && i >= 2) samples.push({ fn, p: V.add(a, V.mul(V.sub(b, a), .65)), weight: i === 3 ? 4 : 1 });
    }
  }
  const frets = key.split('/')[0].split('-').map(Number);
  frets.forEach((f, i) => { if (f > 0) samples.push({ fn: fingers[i] === 'T' ? 'thumb' : names[+fingers[i] - 1], p: SV.N.target(i + 1, f), weight: 12 }); });
  const c = [8, pose.yK - 8, 0], result = {};
  for (const [view, base] of Object.entries({ front: [60, -25, 190], player: [-185, -48, 90] })) {
    const score = (yaw, pitch) => {
      const q = Q.mul(Q.axis([0, 1, 0], yaw * Math.PI / 180), Q.axis([1, 0, 0], pitch * Math.PI / 180));
      const eye = V.add(c, Q.rot(q, base));
      let bad = 0;
      for (const s of samples) for (const b of bones) {
        if (b.fn === s.fn) continue;
        const depth = Math.max(0, b.r - segmentDistance(s.p, eye, b.a, b.b));
        bad += s.weight * depth * depth;
      }
      return bad;
    };
    let best = { yaw: 0, pitch: 0, bad: score(0, 0) };
    for (let yaw = -66; yaw <= 66; yaw += 6) for (let pitch = -40; pitch <= 40; pitch += 8) {
      const bad = score(yaw, pitch);
      if (bad + .025 * (yaw * yaw + pitch * pitch) < best.bad + .025 * (best.yaw ** 2 + best.pitch ** 2)) best = { yaw, pitch, bad };
    }
    result[view] = { ...best, bad: +best.bad.toFixed(3), was: +score(0, 0).toFixed(3) };
  }
  out[key] = result;
}
window.JOB_RESULT = out;
window.JOB_DONE = true;
