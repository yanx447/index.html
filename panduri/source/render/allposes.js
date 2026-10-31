// Solve the left hand for every chord position of the library (frets + fingers), with the same solver,
// constraints and cameras as the teacher's Bm. Output: one parameter vector per position + its accuracy.
import { solver, pack } from './solve.js';
const HS = window.HS, { V, Q } = HS, S = 'L'; HS.hideArm('R');
const SV = solver(HS, S), rg = SV.rg, N = SV.N, SC = SV.SC, D = Math.PI / 180, TH = HS.TH;
function mat2q(m) { const [a, b, c] = m[0], [d, e, f] = m[1], [g, h, i] = m[2], tr = a + e + i; let x, y, z, w; if (tr > 0) { const s = Math.sqrt(tr + 1) * 2; w = .25 * s; x = (h - f) / s; y = (c - g) / s; z = (d - b) / s; } else if (a > e && a > i) { const s = Math.sqrt(1 + a - e - i) * 2; w = (h - f) / s; x = .25 * s; y = (b + d) / s; z = (c + g) / s; } else if (e > i) { const s = Math.sqrt(1 + e - a - i) * 2; w = (c - g) / s; x = (b + d) / s; y = .25 * s; z = (f + h) / s; } else { const s = Math.sqrt(1 + i - a - e) * 2; w = (d - b) / s; x = (c + g) / s; y = (f + h) / s; z = .25 * s; } return [x, y, z, w]; }
const q2v = q => { const w = Math.max(-1, Math.min(1, q[3])), a = 2 * Math.acos(w), s = Math.sqrt(1 - w * w) || 1; return [q[0] / s * a, q[1] / s * a, q[2] / s * a]; };
function frameRot(fdT, drT) { const ortho = (a, b) => V.nrm(V.sub(b, V.mul(a, V.dot(a, b)))); const fd = rg.fingerDir, dr = ortho(fd, rg.dorsal), ac = V.cross(fd, dr); const ft = V.nrm(fdT), dt = ortho(ft, drT), at = V.cross(ft, dt); const Mr = [fd, dr, ac], Mt = [ft, dt, at], R = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]; for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) for (let k = 0; k < 3; k++) R[i][j] += Mt[k][i] * Mr[k][j]; return mat2q(R); }
const FN = { 1: 'index', 2: 'middle', 3: 'ring', 4: 'pinky', T: 'thumb' };
const q0 = frameRot([0, 1, .3], [.4, 0, -.9]);
/** one position: frets[3] (string 1 = A … 3 = E), fingers[3] (1–4, 'T', 0) */
function solveOne(frets, fingers, prev) {
  const used = {}; frets.forEach((f, k) => { const fi = fingers[k]; if (f > 0 && fi) (used[fi] = used[fi] || []).push([k + 1, f]); });
  const fr = frets.filter(f => f > 0), lo = Math.min(...fr), hi = Math.max(...fr);
  const yK = (N.fy(lo - 1) + N.fy(hi)) / 2;
  // how far up the neck this shape sits: 0 at the nut, 1 near the body
  const HI = Math.max(0, Math.min(1, (-yK - 150) / 140));
  const targets = {}, flat = [];
  Object.entries(used).forEach(([fi, list]) => {
    const name = FN[fi]; if (!name) return;
    if (list.length === 1) targets[name] = N.target(list[0][0], list[0][1]);
    else { const ss = list.map(x => x[0]), f = list[0][1], a = N.target(Math.min(...ss), f), b = N.target(Math.max(...ss), f); targets[name] = V.mul(V.add(a, b), .5); flat.push(name); }   // a barre: the finger lies across, its pad between the outer strings
  });
  const thumbOn = !!targets.thumb;
  // high up the neck the board is wider and the body is near: the hand sits a little further out and the thumb lets go
  const ox = 7 * HI, oz = -5 * HI, gw = 1 - .45 * HI;
  const guides = thumbOn
    ? [['palm', [40 + ox, yK - 46, -14 + oz], 2 * gw], ['finger_index.01', [30 + ox, yK - 16, -6 + oz], 2 * gw], ['finger_middle.01', [33 + ox, yK - 30, -10 + oz], 2 * gw], ['thumb.02', [-18 + ox * .4, yK - 22, -26 + oz], 3 * gw]]
    : [['palm', [34 + ox, yK - 40, -22 + oz], 1.5 * gw], ['finger_index.01', [28 + ox, yK - 8, -6 + oz], 1.5 * gw], ['finger_middle.01', [31 + ox, yK - 22, -8 + oz], 1.5 * gw], ['thumb.02', [-4 + ox * .4, yK - 12, -30 + oz], 3 * gw]];
  const free = ['index', 'middle', 'ring', 'pinky'].filter(k => !targets[k]);
  // the fingers this chord does not use hang in a row below the neck — off the board, off the strings, out of the way
  const restTips = {}; free.forEach((k, i) => { restTips[k] = () => [N.hw(yK) + 28 + i * 7, yK - 12 - i * 21, -13 - i * 5]; });
  if (!thumbOn) restTips.thumb = () => [-8, yK - 4, -34];
  // the hand stays under the neck on the treble side: palm below the fretboard, knuckles beside the E string
  const extra = (Wp) => { let e = 0; const pc = V.mul(['palm.01', 'palm.02', 'palm.03', 'palm.04', 'hand'].map(n => Wp(`${n}.L`)).reduce((a, c) => V.add(a, c), [0, 0, 0]), .2);
    const kn = V.mul(['finger_index.01', 'finger_middle.01', 'finger_ring.01', 'finger_pinky.01'].map(n => Wp(`${n}.L`)).reduce((a, c) => V.add(a, c), [0, 0, 0]), .25);
    const PZ = -8 - 3 * HI, PX = 22 + 5 * HI, KX = 32 + 5 * HI, KZ = 14 + 5 * HI;
    if (pc[2] > PZ) e += 4 * (pc[2] - PZ) ** 2; if (pc[0] < PX) e += 3 * (PX - pc[0]) ** 2; if (kn[0] < KX) e += 3 * (KX - kn[0]) ** 2; if (kn[2] > KZ) e += 3 * (kn[2] - KZ) ** 2; return e; };
  const task = { tw: 160, extra, targets, free, flat, restTips, elbowDir: V.nrm([.7, -.5, -.5]), elbowW: 400 - 300 * HI, guides, thumbDir: V.nrm([.6, 0, -.8]) };
  let v0;
  if (prev) v0 = prev.slice();
  else { const rp = V.sub([31, yK - 22, -8], V.mul(Q.rot(q0, V.sub(rg.H['finger_middle.01.L'], rg.H['hand.L'])), SC)); v0 = pack({ rv: q2v(q0), rp, wflex: 0, wdev: 0, f: [[30 * D, 0, 40 * D, 20 * D], [30 * D, 0, 40 * D, 20 * D], [35 * D, 0, 50 * D, 30 * D], [35 * D, 0, 50 * D, 30 * D]], t: [0, 0, 0, 0, 0] }); }
  if (prev) { v0[4] += (yK - prev.yK); }
  const r = SV.solve(task, v0, (window.ITERS || 700) + Math.round(600 * HI));
  const ev = SV.evalV(r.v, task), err = {}; let worst = 0;
  Object.keys(targets).forEach(k => { const e = V.len(V.sub(ev.pads[k].pad, targets[k])); err[k] = +e.toFixed(2); worst = Math.max(worst, e); });
  // penetration check without targets: how deep anything sits in the neck
  const Wp2 = n => V.mul(ev.F.W[n].p, SC); const side = extra(Wp2);
  return { v: r.v.map(x => +x.toFixed(4)), err, worst: +worst.toFixed(2), E: +r.E.toFixed(1), yK: +yK.toFixed(1), side: +side.toFixed(2) };
}
const LIST = window.POSE_LIST || [], SEEDS = window.SEEDS || {};
const SK = Object.entries(SEEDS);
const fset = k => k.split('/')[1].replace(/0/g, '').split('').sort().join('');
/** the same shape lower down the neck is the best start: same fingers, same fret intervals */
const shape = k => { const fr = k.split('/')[0].split('-').map(Number), on = fr.filter(f => f > 0), m = on.length ? Math.min(...on) : 0; return fr.map(f => f > 0 ? f - m : -1).join(',') + '|' + k.split('/')[1]; };
function seedFor(key, yK) {
  let best = null, bs = 1e9;
  SK.forEach(([k, r]) => { const sc = Math.abs(r.yK - yK) * .25 + (shape(k) === shape(key) ? 0 : 60) + (fset(k) === fset(key) ? 0 : 40); if (sc < bs) { bs = sc; best = r; } });
  return best;
}
/** a second start: the nearest pose by height alone */
function seedNear(key, yK) { let best = null, bs = 1e9; SK.forEach(([k, r]) => { const sc = Math.abs(r.yK - yK) + (fset(k) === fset(key) ? 0 : 40); if (sc < bs) { bs = sc; best = r; } }); return best; }
const out = {}; let n = 0;
for (const item of LIST) {
  const [frets, fingers] = item, key = frets.join('-') + '/' + fingers.map(f => f || 0).join('');
  const fr = frets.filter(f => f > 0), yK = (N.fy(Math.min(...fr) - 1) + N.fy(Math.max(...fr))) / 2;
  const sd = seedFor(key, yK), sd2 = seedNear(key, yK); let best = null;
  for (const s0 of [sd, sd2, null]) { const r = solveOne(frets, fingers, s0 ? Object.assign(s0.v.slice(), { yK: s0.yK }) : null); if (!best || r.worst + r.side * .5 < best.worst + best.side * .5) best = r; if (best.side < .5 && best.worst < 2.5) break; }
  out[key] = best; n++; if (n % 20 === 0) console.log('posed', n, '/', LIST.length);
}
window.JOB_RESULT = out; window.JOB_DONE = true;
