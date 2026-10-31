const HS = window.HS, { V } = HS;
const rg = HS.rigs.L;
HS.hideArm('R');
const fy = HS.TH.fretFrac;
// T-pose hand moved next to the neck, just to check scale and orientation
const p = { rootQ: [0, 0, 0, 1], rootP: rg.H['forearm.L'], wflex: 0, wdev: 0, f: [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]], t: [0, 0, 0, 0, 0] };
// shift so the hand sits near fret 3
const hand = rg.H['hand.L'];
p.rootP = V.sub(rg.H['forearm.L'], V.add(hand, V.mul([-60, -60, 40], 1 / HS.SC)));
HS.applyPose('L', p);
HS.look([0, -150, 700], [0, -60, 0], 40); HS.lights([0, -60, 0]); HS.render();
await window.saveFrame('/home/claude/pd/render/out/t1.png');
window.JOB_RESULT = { SC: HS.SC, dorsal: rg.dorsal, across: rg.across, fdir: rg.fingerDir, r: HS.radius['finger_index.02.L'] * HS.SC, L: HS.G3.L, BT: HS.G3.BT };
window.JOB_DONE = true;
