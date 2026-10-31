/* Renders one pose twice from the front: as the app looks at it today, and from the angle
   the camera search picked. Used to judge whether the new angle really shows the fingers. */
import { solver, unpack, toPose } from './solve.js';
const HS = window.HS, { V, Q } = HS, S = 'L'; HS.hideArm('R');
const SV = solver(HS, S), rg = SV.rg, SC = SV.SC;
const P = window.POSE_LIST || {};
let i = 0;
for (const [key, r] of Object.entries(P)) {
  HS.applyPose(S, toPose(rg, SC, unpack(r.v)));
  const c = [8, r.yK - 8, 0];
  HS.lights(c, [c[0] - 220, c[1] + 60, c[2] + 380], [c[0] + 260, c[1] - 160, c[2] + 160], [c[0] - 160, c[1] + 220, c[2] - 300]);
  const base = [70, -30, 250];
  const views = { plain: { yaw: 0, pitch: 0 }, fixed: (r.cam && r.cam.front) || { yaw: 0, pitch: 0 } };
  for (const [name, a] of Object.entries(views)) {
    const qy = Q.axis([0, 1, 0], (a.yaw || 0) * Math.PI / 180), qp = Q.axis([1, 0, 0], (a.pitch || 0) * Math.PI / 180);
    const d = Q.rot(Q.mul(qy, qp), base);
    HS.look([c[0] + d[0], c[1] + d[1], c[2] + d[2]], c, 34, [-1, 0, 0]); HS.render();
    await window.saveFrame(`/home/claude/pd/render/out/cs_${i}_${name}.png`);
  }
  i++;
}
window.JOB_RESULT = i; window.JOB_DONE = true;
