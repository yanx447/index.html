import { solver, pack, unpack, toPose } from './solve.js';
const HS = window.HS, { V, Q } = HS, S = 'L'; HS.hideArm('R');
const SV = solver(HS, S), rg = SV.rg, N = SV.N, SC = SV.SC, D = Math.PI / 180;
function mat2q(m) { const [a, b, c] = m[0], [d, e, f] = m[1], [g, h, i] = m[2], tr = a + e + i; let x, y, z, w; if (tr > 0) { const s = Math.sqrt(tr + 1) * 2; w = .25 * s; x = (h - f) / s; y = (c - g) / s; z = (d - b) / s; } else if (a > e && a > i) { const s = Math.sqrt(1 + a - e - i) * 2; w = (h - f) / s; x = .25 * s; y = (b + d) / s; z = (c + g) / s; } else if (e > i) { const s = Math.sqrt(1 + e - a - i) * 2; w = (c - g) / s; x = (b + d) / s; y = .25 * s; z = (f + h) / s; } else { const s = Math.sqrt(1 + i - a - e) * 2; w = (d - b) / s; x = (c + g) / s; y = (f + h) / s; z = .25 * s; } return [x, y, z, w]; }
const q2v = q => { const w = Math.max(-1, Math.min(1, q[3])), a = 2 * Math.acos(w), s = Math.sqrt(1 - w * w) || 1; return [q[0] / s * a, q[1] / s * a, q[2] / s * a]; };
function frameRot(fdT, drT) { const ortho = (a, b) => V.nrm(V.sub(b, V.mul(a, V.dot(a, b)))); const fd = rg.fingerDir, dr = ortho(fd, rg.dorsal), ac = V.cross(fd, dr); const ft = V.nrm(fdT), dt = ortho(ft, drT), at = V.cross(ft, dt); const Mr = [fd, dr, ac], Mt = [ft, dt, at], R = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]; for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) for (let k = 0; k < 3; k++) R[i][j] += Mt[k][i] * Mr[k][j]; return { q: mat2q(R), ac, at }; }
const yK = (N.fy(1) + N.fy(2)) / 2;
// fingers forward (+z), back of the hand down (+x)
const { q, ac, at } = frameRot([0, 0, 1], [1, 0, 0]);
const restK = V.sub(rg.H['finger_middle.01.L'], rg.H['forearm.L']);
const rp = V.sub([27, yK - 6, -8], V.mul(Q.rot(q, restK), SC));
const pz = { rv: q2v(q), rp, wflex: 0, wdev: 0, f: [[30 * D, 0, 40 * D, 20 * D], [30 * D, 0, 40 * D, 20 * D], [30 * D, 0, 40 * D, 20 * D], [30 * D, 0, 40 * D, 20 * D]], t: [0, 0, 0, 0, 0] };
HS.applyPose(S, toPose(rg, SC, pz));
const ev = SV.evalV(pack(pz), { targets: {} });
const Wp = n => V.mul(ev.F.W[n].p, SC);
HS.mark(Wp('finger_index.01.L'), 0xff0000, 2); HS.mark(Wp('finger_pinky.01.L'), 0x0000ff, 2); HS.mark(Wp('thumb.03.L'), 0xffff00, 2); HS.mark(Wp('hand.L'), 0x00ff00, 2);
const t = [0, yK, 8];
HS.lights(t); HS.look([t[0] - 40, t[1] - 25, t[2] + 300], [t[0] + 8, t[1] - 25, t[2] - 5], 34, [-1, 0, 0]); HS.render(); await window.saveFrame('/home/claude/pd/render/out/d1.png');
HS.look([t[0] + 10, t[1] + 260, t[2] + 40], [t[0] + 10, t[1] - 25, t[2] - 10], 40, [-1, 0, 0]); HS.render(); await window.saveFrame('/home/claude/pd/render/out/d2.png');
window.JOB_RESULT = { ac, at, idx: Wp('finger_index.01.L'), pinky: Wp('finger_pinky.01.L'), thumbTip: Wp('thumb.03.L'), hand: Wp('hand.L') };
window.JOB_DONE = true;
