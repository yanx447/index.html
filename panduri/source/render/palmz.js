import { solver, unpack, toPose } from './solve.js';
const HS = window.HS, { V } = HS, S = 'L';
const SV = solver(HS, S), rg = SV.rg, SC = SV.SC;
const P = window.POSE_LIST || {}, out = {};
for (const [key, r] of Object.entries(P)) {
  const F = rg.fk(toPose(rg, SC, unpack(r.v)));
  const pc = V.mul(['palm.01', 'palm.02', 'palm.03', 'palm.04', 'hand'].map(n => V.mul(F.W[`${n}.L`].p, SC)).reduce((a, c) => V.add(a, c), [0, 0, 0]), 1 / 5);
  const kn = V.mul(['finger_index.01', 'finger_middle.01', 'finger_ring.01', 'finger_pinky.01'].map(n => V.mul(F.W[`${n}.L`].p, SC)).reduce((a, c) => V.add(a, c), [0, 0, 0]), 1 / 4);
  out[key] = { pz: +pc[2].toFixed(1), px: +pc[0].toFixed(1), kz: +kn[2].toFixed(1), kx: +kn[0].toFixed(1) };
}
window.JOB_RESULT = out; window.JOB_DONE = true;
