import { solver } from './solve.js';
const HS = window.HS, S = 'L'; HS.hideArm('R');
const SV = solver(HS, S), rg = SV.rg, N = SV.N, SC = SV.SC;
const P = window.POSE_LIST, keep = {}, drop = [];
const FING = ['index', 'middle', 'ring', 'pinky'];
for (const [k, v] of Object.entries(P)) {
  const ev = SV.evalV(v.v, { targets: {}, free: [] });
  const Wp = nm => HS.V.mul(ev.F.W[nm].p, SC);
  let mx = 0;
  FING.concat(['thumb']).forEach(fn => {
    const ch = fn === 'thumb' ? ['thumb.01', 'thumb.02', 'thumb.03'] : [`finger_${fn}.01`, `finger_${fn}.02`, `finger_${fn}.03`];
    ch.forEach(b => { const p = Wp(`${b}.${S}`), r = (rg.rad && rg.rad[`${b}.${S}`]) || 7; const d = N.pen(p, r * .9, true); if (d > mx) mx = d; });
  });
  if (mx <= 2.0) keep[k] = v; else drop.push(k + ':' + mx.toFixed(1));
}
window.JOB_RESULT = { keep, dropped: drop };
window.JOB_DONE = true;
