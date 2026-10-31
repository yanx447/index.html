import { solver, pack, unpack, toPose, FING } from './solve.js';
const HS = window.HS, { V, Q } = HS, S = 'L';
HS.hideArm('R');
const SV = solver(HS, S), rg = SV.rg, N = SV.N, SC = SV.SC;
const D = Math.PI / 180;
function mat2q(m) { // m: rows
  const [a, b, c] = m[0], [d, e, f] = m[1], [g, h, i] = m[2], tr = a + e + i; let x, y, z, w;
  if (tr > 0) { const s = Math.sqrt(tr + 1) * 2; w = .25 * s; x = (h - f) / s; y = (c - g) / s; z = (d - b) / s; }
  else if (a > e && a > i) { const s = Math.sqrt(1 + a - e - i) * 2; w = (h - f) / s; x = .25 * s; y = (b + d) / s; z = (c + g) / s; }
  else if (e > i) { const s = Math.sqrt(1 + e - a - i) * 2; w = (c - g) / s; x = (b + d) / s; y = .25 * s; z = (f + h) / s; }
  else { const s = Math.sqrt(1 + i - a - e) * 2; w = (d - b) / s; x = (c + g) / s; y = (f + h) / s; z = .25 * s; }
  return [x, y, z, w];
}
const q2v = q => { const w = Math.max(-1, Math.min(1, q[3])), a = 2 * Math.acos(w), s = Math.sqrt(1 - w * w) || 1; return [q[0] / s * a, q[1] / s * a, q[2] / s * a]; };
function frameRot(fdT, drT, acT) {
  const ortho = (a, b) => V.nrm(V.sub(b, V.mul(a, V.dot(a, b))));
  const fd = rg.fingerDir, dr = ortho(fd, rg.dorsal), ac = V.cross(fd, dr);
  const ft = V.nrm(fdT), dt = ortho(ft, drT), at = V.cross(ft, dt);
  // R = Mt * Mr^T
  const Mr = [fd, dr, ac], Mt = [ft, dt, at], R = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) for (let k = 0; k < 3; k++) R[i][j] += Mt[k][i] * Mr[k][j];
  return { q: mat2q(R), acRest: ac };
}
const targets = { thumb: N.target(1, 2), index: N.target(2, 1), middle: N.target(3, 2) };
const elbowDir = V.nrm([.55, -.35, -.75]);
const yK = (N.fy(1) + N.fy(2)) / 2;
const results = [];
// the hand cradles the neck from below: palm up toward the E edge, back of the hand to the floor (+x),
// fingers pointing forward (+z) and curling up onto the strings, index toward the head (+y), thumb over the top
const guides = [['palm', [10, yK - 18, -34], 2], ['finger_middle.01', [27, yK - 6, -8], 3], ['finger_index.01', [26, yK + 12, -8], 2], ['thumb.02', [-20, yK - 12, -22], 3]];
const fInit = [[30 * D, 0, 40 * D, 20 * D], [30 * D, 0, 40 * D, 20 * D], [35 * D, 0, 50 * D, 30 * D], [35 * D, 0, 50 * D, 30 * D]], tInit = [0, 0, 0, 0, 0];
for (const [dr, fd] of [[[1, 0, 0], [0, 0, 1]], [[.94, 0, -.34], [.34, 0, .94]], [[.94, 0, .34], [-.34, 0, .94]]]) {
  const { q } = frameRot(fd, dr, [0, 1, 0]);
  const restK = V.sub(rg.H['finger_middle.01.L'], rg.H['hand.L']);
  const rp = V.sub([27, yK - 6, -8], V.mul(Q.rot(q, restK), SC));
  const v0 = pack({ rv: q2v(q), rp, wflex: 0, wdev: 0, f: fInit, t: tInit });
  const task = { targets, elbowDir, guides, thumbDir: V.nrm([.6, 0, -.8]), elbowW: 400 };
  const r = SV.solve(task, v0, 400);
  const ev = SV.evalV(r.v, task);
  const errs = {}; Object.keys(targets).forEach(k => { errs[k] = +V.len(V.sub(ev.pads[k].pad, targets[k])).toFixed(1); });
  results.push({ e0: +SV.evalV(v0, task).E.toFixed(1), E: +r.E.toFixed(2), errs, v: r.v, v0 });
}
results.sort((a, b) => a.E - b.E);
const best = results[0];
HS.applyPose(S, toPose(rg, SC, unpack(best.v)));
window.BM = best;
const t = targets.index;
const C = { thumb: 0xffd34d, index: 0xff5a4a, middle: 0x3fd08a };
Object.keys(targets).forEach(k => HS.mark(targets[k], C[k], 1.2));
HS.lights([t[0], t[1], t[2]], [t[0] - 200, t[1] + 100, t[2] + 400], [t[0] + 200, t[1] - 100, t[2] + 200], [t[0] - 100, t[1] + 200, t[2] - 300]);
HS.clearMarks();
const c = [8, (N.fy(1) + N.fy(2)) / 2 - 8, 0];
HS.lights(c, [c[0] - 220, c[1] + 60, c[2] + 380], [c[0] + 260, c[1] - 160, c[2] + 160], [c[0] - 160, c[1] + 220, c[2] - 300]);
// photo view: in front of the player, a little from below (as in the teacher's photo)
Object.keys(targets).forEach(k => HS.mark(targets[k], { thumb: 0xffd34d, index: 0xff5a4a, middle: 0x3fd08a }[k], 1.4));
HS.look([c[0] + 70, c[1] - 30, c[2] + 250], c, 34, [-1, 0, 0]); HS.render(); await window.saveFrame('/home/claude/pd/render/out/bm_a.png'); HS.clearMarks();
// what the player sees: from above the A edge, behind the neck
HS.look([c[0] - 230, c[1] - 60, c[2] + 110], c, 34, [0, 1, 0]); HS.render(); await window.saveFrame('/home/claude/pd/render/out/bm_b.png');
// along the neck from the head
HS.look([c[0] + 30, c[1] + 230, c[2] + 60], c, 38, [-1, 0, 0]); HS.render(); await window.saveFrame('/home/claude/pd/render/out/bm_c.png');
{ const ev = SV.evalV(best.v, { targets }); const u = ev.u; const Wp = n => V.mul(ev.F.W[n].p, SC); window.PTS = { wrist: Wp('hand.L'), idxMCP: Wp('finger_index.01.L'), idxPIP: Wp('finger_index.02.L'), idxTip: V.mul(ev.F.tip('finger_index.03.L'), SC), thMCP: Wp('thumb.02.L'), thTip: V.mul(ev.F.tip('thumb.03.L'), SC), midTip: V.mul(ev.F.tip('finger_middle.03.L'), SC), elbow: V.mul(V.add(ev.F.W['forearm.L'].p, [0,0,0]), SC) }; window.JOB_RESULT = { res: results.map(r => ({ E: r.E, errs: r.errs })), f: u.f.map(f => f.map(x => Math.round(x / D))), pts: Object.fromEntries(Object.entries(window.PTS).map(([k, v]) => [k, v.map(x => Math.round(x))])), t: u.t.map(x => Math.round(x / D)), w: [u.wflex, u.wdev].map(x => Math.round(x / D)) }; }
window.JOB_DONE = true;
