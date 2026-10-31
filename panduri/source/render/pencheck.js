// how deep anything of the hand sits inside the instrument, for every stored pose
import { solver } from './solve.js';
const HS = window.HS, S = 'L'; HS.hideArm('R');
const SV = solver(HS, S), rg = SV.rg, N = SV.N, SC = SV.SC;
const P = window.POSE_LIST, out = {}; let worst = 0, wk = '', n = 0, bad = 0;
const FING = ['index', 'middle', 'ring', 'pinky'];
for (const [k, v] of Object.entries(P)) {
  const ev = SV.evalV(v.v, { targets: {}, free: [] });
  const Wp = nm => HS.V.mul(ev.F.W[nm].p, SC);
  let mx = 0;
  FING.concat(['thumb']).forEach(fn => {
    const ch = fn === 'thumb' ? ['thumb.01', 'thumb.02', 'thumb.03'] : [`finger_${fn}.01`, `finger_${fn}.02`, `finger_${fn}.03`];
    ch.forEach(b => { const p = Wp(`${b}.${S}`), r = (rg.rad && rg.rad[`${b}.${S}`]) || 7; const d = N.pen(p, r * .9, true); if (d > mx) mx = d; });
  });
  out[k] = +mx.toFixed(2); n++; if (mx > worst) { worst = mx; wk = k; } if (mx > 1.5) bad++;
}
window.JOB_RESULT = { n, worst: +worst.toFixed(2), at: wk, over1_5mm: bad,
  hist: Object.values(out).reduce((a, d) => { const b = d < .5 ? '<0.5' : d < 1 ? '0.5-1' : d < 2 ? '1-2' : d < 4 ? '2-4' : '4+'; a[b] = (a[b] || 0) + 1; return a; }, {}) };
window.JOB_DONE = true;
