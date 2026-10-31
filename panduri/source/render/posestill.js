import { solver, unpack, toPose } from './solve.js';
const HS = window.HS, S = 'L'; HS.hideArm('R');
const SV = solver(HS, S), rg = SV.rg, SC = SV.SC;
const P = window.POSE_LIST || {};
let i = 0;
for (const [key, r] of Object.entries(P)) {
  HS.applyPose(S, toPose(rg, SC, unpack(r.v)));
  const c = [8, r.yK - 8, 0];
  HS.lights(c, [c[0] - 220, c[1] + 60, c[2] + 380], [c[0] + 260, c[1] - 160, c[2] + 160], [c[0] - 160, c[1] + 220, c[2] - 300]);
  const CAMS = { front: [[c[0] + 70, c[1] - 30, c[2] + 250], c, 34, [-1, 0, 0]], player: [[c[0] - 230, c[1] - 60, c[2] + 110], c, 34, [0, 1, 0]] };
  for (const [name, cm] of Object.entries(CAMS)) { HS.look(...cm); HS.render(); await window.saveFrame(`/home/claude/pd/render/out/ps_${i}_${name}.png`); }
  i++;
}
window.JOB_RESULT = i; window.JOB_DONE = true;
