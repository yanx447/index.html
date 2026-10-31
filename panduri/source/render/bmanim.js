import { solver, pack, unpack, toPose } from './solve.js';
const HS = window.HS, { V, Q } = HS, S = 'L'; HS.hideArm('R');
const SV = solver(HS, S), rg = SV.rg, N = SV.N, SC = SV.SC, D = Math.PI / 180;
function mat2q(m) { const [a, b, c] = m[0], [d, e, f] = m[1], [g, h, i] = m[2], tr = a + e + i; let x, y, z, w; if (tr > 0) { const s = Math.sqrt(tr + 1) * 2; w = .25 * s; x = (h - f) / s; y = (c - g) / s; z = (d - b) / s; } else if (a > e && a > i) { const s = Math.sqrt(1 + a - e - i) * 2; w = (h - f) / s; x = .25 * s; y = (b + d) / s; z = (c + g) / s; } else if (e > i) { const s = Math.sqrt(1 + e - a - i) * 2; w = (c - g) / s; x = (b + d) / s; y = .25 * s; z = (f + h) / s; } else { const s = Math.sqrt(1 + i - a - e) * 2; w = (d - b) / s; x = (c + g) / s; y = (f + h) / s; z = .25 * s; } return [x, y, z, w]; }
const q2v = q => { const w = Math.max(-1, Math.min(1, q[3])), a = 2 * Math.acos(w), s = Math.sqrt(1 - w * w) || 1; return [q[0] / s * a, q[1] / s * a, q[2] / s * a]; };
function frameRot(fdT, drT) { const ortho = (a, b) => V.nrm(V.sub(b, V.mul(a, V.dot(a, b)))); const fd = rg.fingerDir, dr = ortho(fd, rg.dorsal), ac = V.cross(fd, dr); const ft = V.nrm(fdT), dt = ortho(ft, drT), at = V.cross(ft, dt); const Mr = [fd, dr, ac], Mt = [ft, dt, at], R = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]; for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) for (let k = 0; k < 3; k++) R[i][j] += Mt[k][i] * Mr[k][j]; return mat2q(R); }
const yK = (N.fy(1) + N.fy(2)) / 2;
// teacher's Bm: thumb on the bass (A) string fret 2 · index on the 2nd voice (C♯) fret 1 · middle on the 1st voice (E) fret 2
const T = { thumb: [1, 2], index: [2, 1], middle: [3, 2] };
const tgt = (k, lift) => N.target(T[k][0], T[k][1], lift);
const guides = [['palm', [40, yK - 46, -14], 2], ['finger_index.01', [30, yK - 16, -6], 2], ['finger_middle.01', [33, yK - 30, -10], 2], ['thumb.02', [-18, yK - 22, -26], 3]];
const base = { tw: 160, restTips: { ring: () => [N.hw(N.fy(3)) + 12, N.fy(3), 2], pinky: () => [N.hw(N.fy(4)) + 15, N.fy(4) - 4, -2] }, elbowDir: V.nrm([.7, -.5, -.5]), elbowW: 400, guides, thumbDir: V.nrm([.6, 0, -.8]) };
const q = frameRot([0, 1, .3], [.4, 0, -.9]);
const rp = V.sub([33, yK - 30, -10], V.mul(Q.rot(q, V.sub(rg.H['finger_middle.01.L'], rg.H['hand.L'])), SC));
const v0 = pack({ rv: q2v(q), rp, wflex: 0, wdev: 0, f: [[30 * D, 0, 40 * D, 20 * D], [30 * D, 0, 40 * D, 20 * D], [35 * D, 0, 50 * D, 30 * D], [35 * D, 0, 50 * D, 30 * D]], t: [0, 0, 0, 0, 0] });
const run = (task, from, it) => SV.solve(Object.assign({}, base, task), from, it || 700).v;
// final chord
const P3 = run({ targets: { thumb: tgt('thumb'), index: tgt('index'), middle: tgt('middle') }, free: ['ring', 'pinky'] }, v0);
// earlier steps: the same hand, fingers not yet down hover just above their places
const near = { ref: P3, refRot: 40, refJ: .05 };
const P2 = run(Object.assign({ targets: { thumb: tgt('thumb'), index: tgt('index'), middle: tgt('middle', 9) }, free: ['ring', 'pinky'] }, near), P3, 250);
const P1 = run(Object.assign({ targets: { thumb: tgt('thumb'), index: tgt('index', 9), middle: tgt('middle', 10) }, free: ['ring', 'pinky'] }, near), P2, 250);
// approach: the hand a little lower and further back, fingers relaxed and open
const P0 = P1.slice(); P0[3] += 18; P0[4] -= 4; P0[5] -= 16; for (let i = 8; i < 24; i++) P0[i] *= .82; for (let i = 24; i < 29; i++) P0[i] *= .75;
const KEYS = [[0, P0], [.5, P0], [1.5, P1], [2.0, P1], [2.8, P2], [3.2, P2], [4.0, P3], [7.0, P3]];
const ease = k => k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
const at = t => { for (let i = 0; i < KEYS.length - 1; i++) { const [ta, a] = KEYS[i], [tb, b] = KEYS[i + 1]; if (t <= tb) { const k = ease((t - ta) / (tb - ta || 1)); return a.map((x, j) => x + (b[j] - x) * k); } } return KEYS[KEYS.length - 1][1]; };
const landT = { thumb: 1.5, index: 2.8, middle: 4.0 };
// report accuracy of the final pose
const evF = SV.evalV(P3, Object.assign({}, base, { targets: { thumb: tgt('thumb'), index: tgt('index'), middle: tgt('middle') } }));
const acc = {}; ['thumb', 'index', 'middle'].forEach(k => { acc[k] = +V.len(V.sub(evF.pads[k].pad, tgt(k))).toFixed(2); });
// cameras
const c = [8, yK - 8, 0];
const CAMS = { front: [[c[0] + 70, c[1] - 30, c[2] + 250], c, 34, [-1, 0, 0]], player: [[c[0] - 230, c[1] - 60, c[2] + 110], c, 34, [0, 1, 0]] };
HS.lights(c, [c[0] - 220, c[1] + 60, c[2] + 380], [c[0] + 260, c[1] - 160, c[2] + 160], [c[0] - 160, c[1] + 220, c[2] - 300]);
if (window.STILL_ONLY) { HS.applyPose(S, toPose(rg, SC, unpack(P3))); for (const [name, cm] of Object.entries(CAMS)) { HS.look(...cm); HS.render(); await window.saveFrame(`/home/claude/pd/render/out/still_${name}.png`); } HS.applyPose(S, toPose(rg, SC, unpack(P1))); HS.look(...CAMS.front); HS.render(); await window.saveFrame('/home/claude/pd/render/out/still_p1.png'); window.JOB_RESULT = { acc }; window.JOB_DONE = true; throw new Error('still done'); }
const FPS = 20, NF = Math.round(7.0 * FPS), out = { frames: [], acc, fps: FPS };
for (let i = 0; i < NF; i++) {
  const t = i / FPS, v = at(t); HS.applyPose(S, toPose(rg, SC, unpack(v)));
  const ev = SV.evalV(v, { targets: {} }); const fr = { t, cams: {} };
  for (const [name, cm] of Object.entries(CAMS)) {
    HS.look(...cm); if (!window.NO_FRAMES) { HS.render(); await window.saveFrame(`/home/claude/pd/render/out/bm_${name}_${String(i).padStart(3, '0')}.png`); }
    const lab = {}; ['thumb', 'index', 'middle'].forEach(k => { lab[k] = { p: HS.project(ev.pads[k].pad), knuckle: HS.project(V.mul((k === 'thumb' ? ev.F.W['thumb.02.L'] : ev.F.W[`finger_${k}.02.L`]).p, SC)), on: t >= landT[k] }; });
    fr.cams[name] = lab;
  }
  out.frames.push(fr);
}
window.JOB_RESULT = out; window.JOB_DONE = true;
