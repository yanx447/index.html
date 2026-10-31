// The left hand alone, back of the hand toward you, fingers up: finger numbers (each finger bends in turn) and the warm-up (open ↔ fist).
import { frameRot, ease } from './common.js';
const HS = window.HS, { V, Q } = HS, S = 'L', D = Math.PI / 180;
HS.hideArm('R'); HS.showArm('L'); HS.pan.visible = false;
const rg = HS.rigs[S], SC = HS.SC;
const handQ = frameRot(rg, [0, 1, 0], [0, 0, 1]);
const wrist = [0, 0, 0];
const rootP = V.mul(V.sub(wrist, V.mul(Q.rot(handQ, V.sub(rg.H[`hand.${S}`], rg.H[rg.root])), SC)), 1 / SC);
const base = () => ({ rootQ: handQ, rootP, wflex: 0, wdev: 0, f: [[4, -7, 8, 5], [3, -1, 8, 5], [4, 5, 9, 6], [6, 12, 10, 7]].map(r => r.map(x => x * D)), t: [0, -10 * D, 0, 5 * D, 8 * D] });
const tipW = (p, last) => { const F = rg.fk(p); return V.mul(F.tip(last), SC); };
const job = window.HAND_JOB || 'fingers';
const out = { frames: [], fps: 20, job };
const cam = (() => { const p = base(), F = rg.fk(p), pts = ['finger_index.03', 'finger_middle.03', 'finger_ring.03', 'finger_pinky.03', 'thumb.03'].map(n => V.mul(F.tip(`${n}.${S}`), SC)).concat([V.mul(F.W[`hand.${S}`].p, SC)]);
  const lo = [0, 1, 2].map(k => Math.min(...pts.map(q => q[k]))), hi = [0, 1, 2].map(k => Math.max(...pts.map(q => q[k]))), c = lo.map((x, k) => (x + hi[k]) / 2); c[1] -= 8;
  return [[c[0], c[1] + 10, c[2] + 420], c, 34, [0, 1, 0]]; })();
HS.lights(cam[1], V.add(cam[1], [-140, 170, 380]), V.add(cam[1], [220, -50, 200]), V.add(cam[1], [60, 210, -320]));
const FING = ['index', 'middle', 'ring', 'pinky'];
let NF, poseAt;
if (job === 'fingers') {
  NF = 7.5 * 20;
  poseAt = t => { const p = base(), i = Math.floor(t / 1.5), ph = (t % 1.5) / 1.5, b = Math.sin(Math.min(1, ph / .7) * Math.PI);
    if (i < 4) { const f = p.f[i]; f[0] += 22 * D * b; f[2] += 38 * D * b; f[3] += 22 * D * b; }
    else { p.t[2] += 18 * D * b; p.t[3] += 25 * D * b; p.t[4] += 25 * D * b; }
    return { p, i }; };
} else {
  NF = 4 * 20;
  // fist: fingers fully curled; the thumb folds over the middle phalanges of index and middle
  const FIST = { f: [[82, 0, 100, 62], [86, 0, 102, 64], [88, 0, 104, 66], [90, 0, 104, 66]], t: [40, 30, 30, 40, 30] };
  // search a thumb that lies over the fingers in the fist
  { const pf = base(); pf.f = FIST.f.map(r => r.map(x => x * D)); const F = rg.fk(pf); const goal = V.add(V.mul(V.add(F.W[`finger_index.02.${S}`].p, F.W[`finger_middle.02.${S}`].p), .5 * SC), Q.rot(handQ, V.mul(rg.dorsal, 14)));
    let best = null; for (let a = -60; a <= 60; a += 6) for (let b = -60; b <= 60; b += 6) for (let c = -20; c <= 70; c += 10) { pf.t = [a * D, b * D, c * D, 30 * D, 25 * D]; const e = V.len(V.sub(tipW(pf, `thumb.03.${S}`), goal)); if (!best || e < best.e) best = { e, t: [a, b, c, 30, 25] }; }
    FIST.t = best.t; out.thumbErr = best.e; }
  poseAt = t => { const k = t % 4, c = ease(k < 2 ? k / 1.6 : (4 - k) / 1.6); const p = base(); p.f = p.f.map((r, i) => r.map((x, j) => x * (1 - c) + FIST.f[i][j] * D * c)); p.f.forEach((r, i) => { r[1] = r[1] * (1 + .6 * (1 - c)) * (1 - c); }); p.t = p.t.map((x, j) => x * (1 - c) + FIST.t[j] * D * c); return { p, c }; };
}
for (let i = 0; i < NF; i++) {
  const t = i / 20, a = poseAt(t); HS.applyPose(S, a.p); HS.look(...cam);
  if (!window.NO_FRAMES && (!window.STILL_ONLY || i % 30 === 15)) { HS.render(); await window.saveFrame(`/home/claude/pd/render/out/${job}_${String(i).padStart(3, '0')}.png`); }
  const tips = {}; FING.forEach(fn => { tips[fn] = HS.project(tipW(a.p, `finger_${fn}.03.${S}`)); }); tips.thumb = HS.project(tipW(a.p, `thumb.03.${S}`));
  out.frames.push({ t, i: a.i, c: a.c, tips });
  if (window.STILL_ONLY && i > 80) break;
}
window.JOB_RESULT = out; window.JOB_DONE = true;
