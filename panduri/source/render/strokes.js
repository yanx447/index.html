// Right hand strokes (teacher's technique): the hand is rounded like holding an egg; ↓ the fingers flick open and
// the nail tips brush A → C♯ → E; ↑ the tip of the thumbnail brushes E → C♯ → A; only the wrist turns.
import { solver } from './solve.js';
const HS = window.HS, { V, Q } = HS, S = 'R';
HS.hideArm('L'); HS.showArm('R');
const SV = solver(HS, S), rg = SV.rg, N = SV.N, SC = SV.SC, D = Math.PI / 180, G = HS.G3;
function mat2q(m) { const [a, b, c] = m[0], [d, e, f] = m[1], [g, h, i] = m[2], tr = a + e + i; let x, y, z, w; if (tr > 0) { const s = Math.sqrt(tr + 1) * 2; w = .25 * s; x = (h - f) / s; y = (c - g) / s; z = (d - b) / s; } else if (a > e && a > i) { const s = Math.sqrt(1 + a - e - i) * 2; w = (h - f) / s; x = .25 * s; y = (b + d) / s; z = (c + g) / s; } else if (e > i) { const s = Math.sqrt(1 + e - a - i) * 2; w = (c - g) / s; x = (b + d) / s; y = .25 * s; z = (f + h) / s; } else { const s = Math.sqrt(1 + i - a - e) * 2; w = (d - b) / s; x = (c + g) / s; y = (f + h) / s; z = .25 * s; } return [x, y, z, w]; }
function frameRot(fdT, drT) { const ortho = (a, b) => V.nrm(V.sub(b, V.mul(a, V.dot(a, b)))); const fd = rg.fingerDir, dr = ortho(fd, rg.dorsal), ac = V.cross(fd, dr); const ft = V.nrm(fdT), dt = ortho(ft, drT), at = V.cross(ft, dt); const Mr = [fd, dr, ac], Mt = [ft, dt, at], R = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]; for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) for (let k = 0; k < 3; k++) R[i][j] += Mt[k][i] * Mr[k][j]; return { q: mat2q(R), at }; }
// strumming zone: between the end of the fingerboard and the sound hole
const yS = (G.TONGUE + G.SH_Y + G.HR) / 2 + 6;
const STR = [1, 2, 3].map(s => [N.sx(s, yS), yS, N.sz(yS)]);
const mid = STR[1];
// hand orientation at the middle of a stroke: knuckles along the strings, back of the hand out and down
const FR = frameRot([.62, 0, -.78], [.78, 0, .62]);
const handQ = FR.q;
const EGG = { f: [[42, 0, 58, 34], [46, 0, 60, 36], [50, 0, 62, 38], [54, 0, 64, 40]], t: [10, 10, 30, 20, 30] };
const OPEN = { f: [[6, 0, 8, 4], [8, 0, 10, 5], [12, 0, 14, 8], [16, 0, 18, 10]], t: [10, 10, 25, 10, 15] };
const UPM = { f: [[62, 0, 80, 48], [64, 0, 82, 48], [66, 0, 84, 50], [68, 0, 86, 52]], t: [0, 0, 0, 0, 0] };
const rad = b => (HS.radius[b] || .03) * SC;
// the forearm rests over the upper edge of the body and goes back toward the player; the hand hangs from the wrist
const elbowDir = V.nrm([-.45, -.55, -.70]);
const conj = q => [-q[0], -q[1], -q[2], q[3]];
let WB = 0, DB = 0, rootQ = handQ;
{ let best = -2; const ax = rg.axes[`hand.${S}`];
  for (let w = -80; w <= 80; w += 2) for (let d = -30; d <= 30; d += 2) { const Lh = Q.mul(Q.axis(ax.abd, d * D), Q.axis(ax.flex, w * D)), rq = Q.mul(handQ, conj(Lh)), dir = V.nrm(Q.rot(rq, V.sub(rg.H[`forearm.${S}`], rg.H[`hand.${S}`]))), c = V.dot(dir, elbowDir); if (c > best) { best = c; WB = w; DB = d; rootQ = rq; } }
  window.ELBOW_FIT = best; }
function pose(W, P) {
  return { f: P.f.map(r => r.map(x => x * D)), t: P.t.map(x => x * D), wflex: (WB + W) * D, wdev: DB * D };
}
function nails(p, rootP) {
  const pp = Object.assign({}, p, { rootQ, rootP }), F = rg.fk(pp);
  const nail = (last, dorsal) => { const tip = V.mul(F.tip(last), SC), q = F.W[last].q, d = V.nrm(Q.rot(q, rg.axes[last].d)), dr = V.nrm(Q.rot(q, dorsal)), r = rad(last); return V.add(V.add(tip, V.mul(dr, .45 * r)), V.mul(d, -.1 * r)); };
  return { index: nail(`finger_index.03.${S}`, rg.dorsal), middle: nail(`finger_middle.03.${S}`, rg.dorsal), thumb: nail(`thumb.03.${S}`, rg.axes[`thumb.03.${S}`].dorsal), F };
}
// place the forearm so the curled index nail passes the middle string at W = 0
const p0 = pose(0, EGG);
const off = nails(p0, [0, 0, 0]).index;          // index nail with the forearm head at the origin (mm)
// (the forearm head is far away; nails() returns mm)
const rootP = V.mul(V.sub(mid, off), 1 / SC);
// which way of W moves the nails toward A (−x) = raised
const sgn = nails(pose(25, EGG), rootP).index[0] < nails(pose(-25, EGG), rootP).index[0] ? 1 : -1;
const WU = 34 * sgn, WD = -40 * sgn;
// thumb shape for the up-stroke: its nail passes the middle string at W = 0 with the fingers curled in
{ let best = null;
  for (let a = -60; a <= 60; a += 6) for (let b = -60; b <= 60; b += 6) for (let c = -30; c <= 60; c += 10) for (let d = -20; d <= 40; d += 10) {
    const P = { f: UPM.f, t: [a, b, c, d, d * 1.2] }, n = nails(pose(0, P), rootP), e = V.len(V.sub(n.thumb, mid)), fi = n.index;
    const clear = Math.min(...[n.index, n.middle].map(q => q[2] - mid[2]));   // fingertips stay above the strings
    const sc = e + (clear < 6 ? (6 - clear) * 2 : 0);
    if (!best || sc < best.sc) best = { sc, t: P.t, e };
  }
  UPM.t = best.t; window.THUMB_ERR = best.e; }
const ease = k => k < 0 ? 0 : k > 1 ? 1 : k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
const mixP = (A, B, m) => ({ f: A.f.map((r, i) => r.map((x, j) => x + (B.f[i][j] - x) * m)), t: A.t.map((x, i) => x + (B.t[i] - x) * m) });
function at(t) {
  const k = t % 3.2;
  if (k < .5) return { W: WU, P: EGG, dir: 0 };
  if (k < 1.5) { const m = ease(k - .5); return { W: WU + (WD - WU) * m, P: mixP(EGG, OPEN, ease((k - .85) / .5)), dir: 1 }; }
  if (k < 1.9) return { W: WD, P: OPEN, dir: 0 };
  if (k < 2.9) { const m = k - 1.9; return { W: WD + (WU - WD) * ease(m), P: m < .5 ? mixP(OPEN, UPM, ease(m / .5)) : mixP(UPM, EGG, ease((m - .5) / .5)), dir: -1 }; }
  return { W: WU, P: EGG, dir: 0 };
}
const c = [mid[0] - 10, mid[1] - 20, mid[2] + 30];
const CAMS = {
  // along the strings from beyond the bridge, nearly orthographic: the strings are three points, the hand moves across them
  side: [[mid[0] - 14, mid[1] - 1300, mid[2] + 30], [mid[0] - 14, mid[1], mid[2] + 30], 7.5, [-1, 0, 0]],
  front: [[c[0] + 40, c[1] - 80, c[2] + 290], [c[0] + 8, c[1] + 10, c[2] - 10], 36, [-1, 0, 0]]
};
HS.lights(c, [c[0] - 260, c[1] - 120, c[2] + 360], [c[0] + 240, c[1] - 200, c[2] + 140], [c[0] - 120, c[1] + 260, c[2] - 280]);
const FPS = 20, DUR = 6.4, NF = Math.round(DUR * FPS), out = { frames: [], fps: FPS, thumbErr: window.THUMB_ERR, sgn, yS, elbowFit: window.ELBOW_FIT, WB, DB };
for (let i = 0; i < NF; i++) {
  const t = i / FPS, a = at(t), p = pose(a.W, a.P), n = nails(p, rootP);
  HS.applyPose(S, Object.assign({}, p, { rootQ, rootP }));
  const fr = { t, dir: a.dir, cams: {} };
  for (const [name, cm] of Object.entries(CAMS)) {
    HS.look(...cm); HS.section(name === 'side' ? mid[1] - 26 : null);
    if (!window.NO_FRAMES && (!window.STILL_ONLY || [5, 18, 45, 50, 55].includes(i))) { HS.render(); await window.saveFrame(`/home/claude/pd/render/out/st_${name}_${String(i).padStart(3, '0')}.png`); }
    fr.cams[name] = { index: HS.project(n.index), middle: HS.project(n.middle), thumb: HS.project(n.thumb), str: STR.map(q => HS.project(q)), hit: { index: Math.min(...STR.map(q => V.len(V.sub(q, n.index)))), thumb: Math.min(...STR.map(q => V.len(V.sub(q, n.thumb)))) } };
  }
  out.frames.push(fr);
  if (window.STILL_ONLY && i > 60) break;
}
window.JOB_RESULT = out; window.JOB_DONE = true;
