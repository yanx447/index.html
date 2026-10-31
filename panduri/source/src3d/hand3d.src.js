/* =====================================================================
   3D hand on the panduri (loaded only when "3D" is chosen on a chord page).
   The same model, skeleton, skin and cameras as the teacher's Bm clips.
   Every chord position of the library has a hand pose solved offline with
   the same solver (fingertips on their string/fret, nothing through the
   neck, bone lengths fixed); here it is only applied and drawn.
   The data block below (DATA) is filled in by build_hand3d.py.
   ===================================================================== */
import * as THREE from './h3-three.js';
const DATA = /*@DATA@*/null;
const b64 = s => { const bin = atob(s), u = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i); return u.buffer; };

/* ---------- maths (same as the solver) ---------- */
const V = {
  add: (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]], sub: (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]],
  mul: (a, k) => [a[0] * k, a[1] * k, a[2] * k], dot: (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2],
  cross: (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]],
  len: a => Math.hypot(a[0], a[1], a[2]), nrm: a => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; }
};
const Q = {
  id: () => [0, 0, 0, 1], axis: (ax, ang) => { const s = Math.sin(ang / 2); return [ax[0] * s, ax[1] * s, ax[2] * s, Math.cos(ang / 2)]; },
  mul: (a, b) => [a[3] * b[0] + a[0] * b[3] + a[1] * b[2] - a[2] * b[1], a[3] * b[1] - a[0] * b[2] + a[1] * b[3] + a[2] * b[0], a[3] * b[2] + a[0] * b[1] - a[1] * b[0] + a[2] * b[3], a[3] * b[3] - a[0] * b[0] - a[1] * b[1] - a[2] * b[2]],
  rot: (q, v) => { const u = [q[0], q[1], q[2]], s = q[3], t = V.mul(V.cross(u, v), 2); return V.add(V.add(v, V.mul(t, s)), V.cross(u, t)); },
  fromVec: r => { const a = V.len(r); return a < 1e-9 ? [0, 0, 0, 1] : Q.axis(V.mul(r, 1 / a), a); }
};
const FING = ['index', 'middle', 'ring', 'pinky'];
function makeRig(RIG, S) {
  const R = RIG[S], H = R.heads, T = R.tails, par = R.par;
  const names = Object.keys(par).filter(n => !n.startsWith('upper_arm'));
  const kids = {}; names.forEach(n => { const p = par[n]; if (p && names.includes(p)) (kids[p] = kids[p] || []).push(n); });
  const kI = H[`finger_index.01.${S}`], kP = H[`finger_pinky.01.${S}`], kM = H[`finger_middle.01.${S}`];
  const fingerDir = V.nrm(V.sub(H[`finger_middle.02.${S}`], kM)), across = V.nrm(V.sub(kI, kP));
  let dorsal = V.nrm(V.cross(across, fingerDir)); if (dorsal[2] > 0) dorsal = V.mul(dorsal, -1);
  const axes = {}, chainDir = (a, b) => V.nrm(V.sub(b, a));
  FING.forEach(fn => [1, 2, 3].forEach(k => { const n = `finger_${fn}.0${k}.${S}`, nx = k < 3 ? H[`finger_${fn}.0${k + 1}.${S}`] : T[n], d = chainDir(H[n], nx); axes[n] = { flex: V.nrm(V.cross(dorsal, d)), abd: dorsal, d }; }));
  ['thumb.01', 'thumb.02', 'thumb.03'].forEach((b, k) => { const n = `${b}.${S}`, nx = k < 2 ? H[`thumb.0${k + 2}.${S}`] : T[n]; const dd = chainDir(H[n], nx); let tD = V.sub([0, -1, 0], V.mul(dd, V.dot([0, -1, 0], dd))); tD = V.nrm(tD); axes[n] = { flex: V.nrm(V.cross(tD, dd)), abd: tD, d: dd, dorsal: tD, opp: dd }; });
  axes[`hand.${S}`] = { flex: V.nrm(V.cross(dorsal, fingerDir)), abd: dorsal, twist: fingerDir };
  const root = `forearm.${S}`;
  function locals(p) {
    const L = {}; names.forEach(n => { L[n] = Q.id(); });
    L[`hand.${S}`] = Q.mul(Q.axis(axes[`hand.${S}`].abd, p.wdev || 0), Q.axis(axes[`hand.${S}`].flex, p.wflex || 0));
    FING.forEach((fn, i) => { const f = p.f[i]; L[`finger_${fn}.01.${S}`] = Q.mul(Q.axis(axes[`finger_${fn}.01.${S}`].flex, f[0]), Q.axis(axes[`finger_${fn}.01.${S}`].abd, f[1])); L[`finger_${fn}.02.${S}`] = Q.axis(axes[`finger_${fn}.02.${S}`].flex, f[2]); L[`finger_${fn}.03.${S}`] = Q.axis(axes[`finger_${fn}.03.${S}`].flex, f[3]); });
    const t = p.t;
    L[`thumb.01.${S}`] = Q.mul(Q.axis(axes[`thumb.01.${S}`].opp, t[0]), Q.mul(Q.axis(axes[`thumb.01.${S}`].abd, t[1]), Q.axis(axes[`thumb.01.${S}`].flex, t[2])));
    L[`thumb.02.${S}`] = Q.axis(axes[`thumb.02.${S}`].flex, t[3]); L[`thumb.03.${S}`] = Q.axis(axes[`thumb.03.${S}`].flex, t[4]);
    return L;
  }
  function fk(p) {
    const L = locals(p), W = {};
    const walk = (n, pq, pp, ph) => { const q = Q.mul(pq, L[n]), pos = n === root ? p.rootP : V.add(pp, Q.rot(pq, V.sub(H[n], ph))); W[n] = { q, p: pos }; (kids[n] || []).forEach(c => walk(c, q, pos, H[n])); };
    walk(root, Q.mul(p.rootQ, L[root]), null, null);
    return { W, tip: n => V.add(W[n].p, Q.rot(W[n].q, V.sub(T[n], H[n]))), L };
  }
  return { S, names, kids, H, T, axes, dorsal, fk, locals, root };
}
const unpack = v => ({ rv: v.slice(0, 3), rp: v.slice(3, 6), wflex: v[6], wdev: v[7], f: [v.slice(8, 12), v.slice(12, 16), v.slice(16, 20), v.slice(20, 24)], t: v.slice(24, 29) });
function toPose(rg, SC, u) {
  const S = rg.S, ax = rg.axes[`hand.${S}`], Lh = Q.mul(Q.axis(ax.abd, u.wdev), Q.axis(ax.flex, u.wflex)), hq = Q.fromVec(u.rv);
  const conj = q => [-q[0], -q[1], -q[2], q[3]], rootQ = Q.mul(hq, conj(Lh));
  const wrist = V.mul(u.rp, 1 / SC), rootP = V.sub(wrist, Q.rot(rootQ, V.sub(rg.H[`hand.${S}`], rg.H[rg.root])));
  return { rootQ, rootP, wflex: u.wflex, wdev: u.wdev, f: u.f, t: u.t };
}

/* ---------- poses: key "f-f-f/ijk" → { v: 29 numbers, y: neck position } ---------- */
const POSES = (() => { const keys = DATA.poseKeys, arr = new Float32Array(b64(DATA.poseVals)), ys = DATA.poseY, cm = DATA.poseCam || [], m = {}; keys.forEach((k, i) => { m[k] = { v: Array.from(arr.subarray(i * 29, i * 29 + 29)), y: ys[i], q: DATA.poseQ[i], cam: cm[i] || null }; }); return m; })();

let built = null;
function build() {
  if (built) return built;
  const R3 = PD.R3D, X = R3.export;
  const cv = document.createElement('canvas'); cv.className = 'h3-cv';
  let R;
  try { R = new THREE.WebGLRenderer({ canvas: cv, antialias: true, alpha: false, powerPreference: 'high-performance' }); } catch (e) { return built = { error: 'nogl' }; }
  R.outputColorSpace = THREE.SRGBColorSpace; R.toneMapping = THREE.ACESFilmicToneMapping; R.toneMappingExposure = 1.0;
  R.shadowMap.enabled = true; R.shadowMap.type = THREE.PCFSoftShadowMap;
  const scene = new THREE.Scene(); scene.background = new THREE.Color(0x16120f);
  /* a soft studio environment, so chrome and gloss reflect something (otherwise metal renders black) */
  scene.environment = (() => { const pm = new THREE.PMREMGenerator(R), es = new THREE.Scene(), c = document.createElement('canvas'); c.width = 64; c.height = 256; const x = c.getContext('2d'), gg = x.createLinearGradient(0, 0, 0, 256); gg.addColorStop(0, '#fff1de'); gg.addColorStop(.42, '#7a6450'); gg.addColorStop(1, '#140e0a'); x.fillStyle = gg; x.fillRect(0, 0, 64, 256);
    const et = new THREE.CanvasTexture(c); et.colorSpace = THREE.SRGBColorSpace; es.add(new THREE.Mesh(new THREE.SphereGeometry(500, 32, 16), new THREE.MeshBasicMaterial({ map: et, side: THREE.BackSide })));
    [[-300, 200, 320], [320, 260, -200], [0, -120, 420]].forEach((p, i) => { const q = new THREE.Mesh(new THREE.PlaneGeometry(i === 2 ? 400 : 260, 140), new THREE.MeshBasicMaterial({ color: i === 2 ? 0x8a7360 : 0xffffff, side: THREE.DoubleSide })); q.position.set(...p); q.lookAt(0, 0, 0); es.add(q); });
    const rt = pm.fromScene(es, .03); pm.dispose(); return rt.texture; })();
  /* the panduri: the app's own model */
  const pan = new THREE.Group(); scene.add(pan); const texCache = {};
  X.meshes.forEach(m => {
    if (!m.visible || m.local || m.part === 'shadow') return; const mt = m.mat; if (mt.alpha != null && mt.alpha < .6) return; if (mt.shadow) return;
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(m.pos, 3)); g.setAttribute('normal', new THREE.BufferAttribute(m.nrm, 3)); g.setAttribute('uv', new THREE.BufferAttribute(m.uv, 2));
    const col = new Float32Array(m.ao.length * 3); for (let i = 0; i < m.ao.length; i++) col[i * 3] = col[i * 3 + 1] = col[i * 3 + 2] = m.ao[i] * (mt.dim ? mt.dim : 1);
    g.setAttribute('color', new THREE.BufferAttribute(col, 3)); g.setIndex(new THREE.BufferAttribute(m.idx, 1));
    let map = null;
    if (mt.tex && X.TEX[mt.tex]) { map = texCache[mt.tex]; if (!map) { map = new THREE.CanvasTexture(X.TEX[mt.tex]); map.colorSpace = THREE.SRGBColorSpace; map.wrapS = map.wrapT = THREE.RepeatWrapping; map.anisotropy = 4; texCache[mt.tex] = map; } }
    const color = mt.color ? new THREE.Color().setRGB(mt.color[0], mt.color[1], mt.color[2], THREE.SRGBColorSpace) : new THREE.Color(1, 1, 1);
    const mat = new THREE.MeshPhysicalMaterial({ map, color, vertexColors: true, roughness: mt.rough == null ? .5 : mt.rough, metalness: mt.metal || 0, clearcoat: mt.coat ? .8 : 0, clearcoatRoughness: .2, emissive: mt.emis ? color.clone().multiplyScalar(mt.emis * .3) : new THREE.Color(0), side: THREE.DoubleSide });
    mat.envMapIntensity = mt.metal ? 1 : mt.coat ? .5 : .28; if (mt.metal === 1) { mat.metalness = .8; mat.roughness = .22; }
    if (m.holes) mat.onBeforeCompile = sh => {
      sh.uniforms.uHole = { value: X.HOLES.map(h => new THREE.Vector3(h[0], h[1], h[2])) };
      sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vLP;').replace('#include <begin_vertex>', '#include <begin_vertex>\nvLP = position;');
      sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nvarying vec3 vLP;\nuniform vec3 uHole[' + X.HOLES.length + '];').replace('void main() {', 'void main() {\n for (int i = 0; i < ' + X.HOLES.length + '; i++) { if (distance(vLP.xy, uHole[i].xy) < uHole[i].z) discard; }');
    };
    const me = new THREE.Mesh(g, mat); me.castShadow = true; me.receiveShadow = true; pan.add(me);
  });
  for (let s = 1; s <= 3; s++) {
    const a = X.strings[s].base, pts = []; for (let i = 0; i < a.length; i += 3) pts.push(new THREE.Vector3(a[i], a[i + 1], a[i + 2]));
    const curve = new THREE.CurvePath(); for (let i = 0; i < pts.length - 1; i++) curve.add(new THREE.LineCurve3(pts[i], pts[i + 1]));
    const m = new THREE.Mesh(new THREE.TubeGeometry(curve, 400, X.SRAD[s], 8, false), new THREE.MeshPhysicalMaterial({ color: 0xEFE9DC, roughness: .32, sheen: .4 })); m.castShadow = true; pan.add(m);
  }
  scene.add(new THREE.HemisphereLight(0xfff3e6, 0x2a1d14, .55));
  const key = new THREE.DirectionalLight(0xfff1e2, 2.4); key.castShadow = true; key.shadow.mapSize.set(1024, 1024); key.shadow.bias = -.0004; key.shadow.normalBias = .6; key.shadow.radius = 6;
  Object.assign(key.shadow.camera, { left: -260, right: 260, top: 260, bottom: -260, near: 1, far: 2000 });
  const fill = new THREE.DirectionalLight(0xffd9b8, .7), rim = new THREE.DirectionalLight(0xbcd2ff, .9);
  scene.add(key, key.target, fill, fill.target, rim, rim.target);
  /* the arm (left hand only) */
  const A = DATA.arm, RIG = DATA.rig, rg = makeRig(RIG, 'L');
  const bones = [], bIndex = {}; const root = new THREE.Bone(); bones.push(root); bIndex.root = 0;
  const make = (n, pb, ph) => { const b = new THREE.Bone(); b.name = n; const hh = rg.H[n]; b.position.set(hh[0] - (ph ? ph[0] : 0), hh[1] - (ph ? ph[1] : 0), hh[2] - (ph ? ph[2] : 0)); pb.add(b); bIndex[n] = bones.length; bones.push(b); (rg.kids[n] || []).forEach(c => make(c, b, hh)); };
  make(rg.root, root, null);
  const gmap = A.groups.map(g => { if (bIndex[g] != null) return bIndex[g]; if (/upper_arm|shoulder/.test(g) && /\.L$/.test(g)) return bIndex['forearm.L']; return 0; });
  const pos = new Float32Array(b64(A.pos)), uv = new Float32Array(b64(A.uv)), idx = new Uint16Array(b64(A.idx)), si = new Uint8Array(b64(A.si)), sw8 = new Uint8Array(b64(A.sw));
  // keep the left arm only: drop triangles that belong to the right arm
  const isR = new Uint8Array(pos.length / 3); for (let i = 0; i < isR.length; i++) { let w = 0, r = 0; for (let k = 0; k < 4; k++) { const g = A.groups[si[i * 4 + k]] || '', ww = sw8[i * 4 + k]; w += ww; if (/\.R$|_R$/.test(g)) r += ww; } isR[i] = r > w * .5 ? 1 : 0; }
  const keep = []; for (let i = 0; i < idx.length; i += 3) if (!isR[idx[i]] && !isR[idx[i + 1]] && !isR[idx[i + 2]]) keep.push(idx[i], idx[i + 1], idx[i + 2]);
  const sIdx = new Uint16Array(si.length), sW = new Float32Array(sw8.length); for (let i = 0; i < si.length; i++) { sIdx[i] = gmap[si[i]] || 0; sW[i] = sw8[i] / 255; }
  for (let i = 0; i < sW.length; i += 4) { const s = sW[i] + sW[i + 1] + sW[i + 2] + sW[i + 3] || 1; for (let k = 0; k < 4; k++) sW[i + k] /= s; }
  // which finger each vertex belongs to: the chord's own fingers stay lit, the others step back
  const FG = { index: 1, middle: 2, ring: 3, pinky: 4 };
  const vFing = new Uint8Array(pos.length / 3);
  for (let i = 0; i < vFing.length; i++) {
    let best = 0, bw = 0;
    for (let k = 0; k < 4; k++) { const w = sw8[i * 4 + k]; if (w <= bw) continue; const g = A.groups[si[i * 4 + k]] || ''; const m = g.match(/finger_(index|middle|ring|pinky)/); const id = m ? FG[m[1]] : /thumb/.test(g) ? 5 : 0; if (id) { best = id; bw = w; } }
    vFing[i] = best;
  }
  const vCol = new Float32Array(pos.length); vCol.fill(1);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2)); geo.setIndex(keep);
  geo.setAttribute('skinIndex', new THREE.BufferAttribute(sIdx, 4)); geo.setAttribute('skinWeight', new THREE.BufferAttribute(sW, 4)); geo.setAttribute('color', new THREE.BufferAttribute(vCol, 3)); geo.computeVertexNormals();
  const tl = new THREE.TextureLoader(), skinTex = tl.load(DATA.skin, () => draw()), nrmTex = tl.load(DATA.skinN, () => draw()); skinTex.colorSpace = THREE.SRGBColorSpace; skinTex.anisotropy = 4;
  const skinMat = new THREE.MeshPhysicalMaterial({ map: skinTex, normalMap: nrmTex, normalScale: new THREE.Vector2(.7, .7), roughness: .58, sheen: .25, sheenColor: new THREE.Color(0xffd0b8), vertexColors: true, sheenRoughness: .6, clearcoat: .08, clearcoatRoughness: .5 });
  const arms = new THREE.SkinnedMesh(geo, skinMat); arms.castShadow = true; arms.receiveShadow = true; arms.frustumCulled = false;
  arms.add(root); arms.bind(new THREE.Skeleton(bones));
  const armG = new THREE.Group(); armG.add(arms); scene.add(armG);
  const handLen = V.len(V.sub(rg.T['finger_middle.03.L'], rg.H['hand.L'])), SC = 185 / handLen; armG.scale.setScalar(SC);
  const cam = new THREE.PerspectiveCamera(34, 16 / 10, 2, 5000);
  /* the contact points themselves: a ring on the string at the fret, drawn through the hand so it is never hidden */
  const IP = PD.instrument.profile, SL = IP.scaleLength.mm, BRy = -SL;
  const fy = n => -SL * PD.theory.fretFrac(n);
  const sxAt = (st, y) => X.SX_NUT[st] + (X.SX_BR[st] - X.SX_NUT[st]) * (y / BRy), szAt = y => X.SZ_NUT + (X.SZ_BR - X.SZ_NUT) * (y / BRy);
  const marks = [0, 1, 2].map(() => {
    const g2 = new THREE.Group();
    const ring = new THREE.Mesh(new THREE.RingGeometry(5.2, 7.4, 28), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, depthTest: false, depthWrite: false, side: THREE.DoubleSide }));
    const dot = new THREE.Mesh(new THREE.CircleGeometry(3.1, 20), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: .9, depthTest: false, depthWrite: false, side: THREE.DoubleSide }));
    g2.add(ring, dot); g2.visible = false; g2.renderOrder = 20; scene.add(g2); return { g: g2, ring, dot };
  });
  built = { R, cv, scene, cam, key, fill, rim, rg, SC, bones, bIndex, arms, vFing, vCol, geo, marks, fy, sxAt, szAt, keep: Uint32Array.from(keep) };
  return built;
}
function applyPose(v) {
  const B = built, rg = B.rg, p = toPose(rg, B.SC, unpack(v)), Lc = rg.locals(p);
  rg.names.forEach(n => { const b = B.bones[B.bIndex[n]], q = Lc[n]; b.quaternion.set(q[0], q[1], q[2], q[3]); });
  const rb = B.bones[B.bIndex[rg.root]]; rb.position.set(p.rootP[0], p.rootP[1], p.rootP[2]); const q = Q.mul(p.rootQ, Lc[rg.root]); rb.quaternion.set(q[0], q[1], q[2], q[3]);
  return p;
}
/** fingertip pads (mm, world) for the badges */
function pads(p) {
  const B = built, rg = B.rg, F = rg.fk(p), SC = B.SC, out = {};
  const pad = (last, dorsalAxis, mid) => { const tip = V.mul(F.tip(last), SC), q = F.W[last].q, d = V.nrm(Q.rot(q, rg.axes[last].d)); return { p: tip, k: V.mul(F.W[mid].p, SC), d }; };
  FING.forEach((fn, i) => { out[i + 1] = pad(`finger_${fn}.03.L`, rg.dorsal, `finger_${fn}.02.L`); });
  out.T = pad('thumb.03.L', rg.axes['thumb.03.L'].dorsal, 'thumb.02.L');
  return out;
}

/* ---------- the view placed on a chord page ---------- */
let cur = null, view = 'front', host = null, overlay = null, need = false, raf = 0, anim = null, fingersOn = null;
const keyOf = (frets, fingers) => frets.join('-') + '/' + fingers.map(f => f || 0).join('');
/** turn a direction by yaw (around the neck) and pitch (over the board) */
function turn(d, yaw, pitch) {
  const ry = yaw * Math.PI / 180, rp = pitch * Math.PI / 180;
  let [x, y, z] = d;
  const y2 = y * Math.cos(rp) - z * Math.sin(rp), z2 = y * Math.sin(rp) + z * Math.cos(rp);
  const x2 = x * Math.cos(ry) + z2 * Math.sin(ry), z3 = -x * Math.sin(ry) + z2 * Math.cos(ry);
  return [x2, y2, z3];
}
function cams(y, adj) {
  const c = [8, y - 8, 0];
  // each pose carries the angle it is best seen from: the free fingers then stand clear of the ones that press
  const a = adj || [0, 0, 0, 0];
  const f = turn([60, -25, 190], a[0], a[1]), p = turn([-185, -48, 90], a[2], a[3]);
  return { c, front: [[c[0] + f[0], c[1] + f[1], c[2] + f[2]], c, 30, [-1, 0, 0]], player: [[c[0] + p[0], c[1] + p[1], c[2] + p[2]], c, 30, [0, 1, 0]] };
}
function place() {
  const B = built, C = cams(cur ? cur.y : -60, cur ? cur.cam : null), cm = C[view];
  B.cam.fov = cm[2]; B.cam.position.set(...cm[0]); B.cam.up.set(...cm[3]); B.cam.lookAt(...cm[1]); B.cam.updateProjectionMatrix();
  const c = C.c; B.key.position.set(c[0] - 220, c[1] + 60, c[2] + 380); B.key.target.position.set(...c); B.fill.position.set(c[0] + 260, c[1] - 160, c[2] + 160); B.fill.target.position.set(...c); B.rim.position.set(c[0] - 160, c[1] + 220, c[2] - 300); B.rim.target.position.set(...c);
  // the badges are projected with this camera before the frame is rendered, so its matrix
  // must be up to date right now — each pose has its own angle, so a stale one lands them wrong
  B.cam.updateMatrixWorld(true);
}
function size() {
  const B = built; if (!host) return;
  // measure the box with the canvas out of the way: left at its old pixel width it would
  // widen the box it is measured against, and the page would grow every time it is mounted
  B.cv.style.width = B.cv.style.height = overlay.style.width = overlay.style.height = '0px';
  const w = host.clientWidth || 320, hgt = Math.round(w * 10 / 16), dpr = Math.min(2, window.devicePixelRatio || 1);
  B.R.setPixelRatio(dpr); B.R.setSize(w, hgt, false); B.cv.style.width = w + 'px'; B.cv.style.height = hgt + 'px'; B.cam.aspect = w / hgt; B.cam.updateProjectionMatrix();
  overlay.width = w * dpr; overlay.height = hgt * dpr; overlay.style.width = w + 'px'; overlay.style.height = hgt + 'px';
}
function poseNow() {
  if (!cur || cur.open) return null; const P = cur.v;
  if (!anim) return fingersOn ? mixFingers(cur.p0, P, fingersOn, 1) : P;
  const k = Math.min(1, (performance.now() - anim.t0) / anim.dur), e = k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
  const v = mixFingers(cur.p0, P, anim.to, e, anim.from); if (k >= 1) { fingersOn = anim.to; anim = null; } return v;
}
/** hand: from p0 to P; the listed fingers fully placed, the others still relaxed */
const SL = { 1: [8, 12], 2: [12, 16], 3: [16, 20], 4: [20, 24], T: [24, 29] };
function mixFingers(p0, P, on, e, from) {
  const v = P.slice(), hk = from && from.size ? 1 : on.size ? e : 0; for (let i = 0; i < 8; i++) v[i] = p0[i] + (P[i] - p0[i]) * hk;
  Object.keys(SL).forEach(f => { const [a, b] = SL[f], was = from && from.has(f) ? 1 : 0, now = on.has(f) ? 1 : 0, k = was + (now - was) * e; for (let i = a; i < b; i++) v[i] = p0[i] + (P[i] - p0[i]) * k; });
  return v;
}
function draw() { need = true; if (!raf) raf = requestAnimationFrame(frame); }
function frame() {
  raf = 0; if (!need || !host || !host.isConnected) return; need = false;
  const B = built;
  if (cur && cur.open) {   // the open chord: the hand steps out of the picture
    B.arms.visible = false; if (B.marks) B.marks.forEach(m => { m.g.visible = false; });
    place(); B.scene.updateMatrixWorld(true); B.R.render(B.scene, B.cam);
    const ov = overlay.getContext('2d'), d2 = overlay.width / (parseFloat(overlay.style.width) || 1);
    ov.setTransform(d2, 0, 0, d2, 0, 0); ov.clearRect(0, 0, overlay.width / d2, overlay.height / d2);
    return;
  }
  B.arms.visible = true;
  const v = poseNow(); if (!v) return;
  const p = applyPose(v); place();
  // badges: finger number beyond the fingertip, a thin line to the contact point
  const ctx = overlay.getContext('2d'), dpr = overlay.width / (parseFloat(overlay.style.width) || 1), W = overlay.width / dpr, H = overlay.height / dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
  const pr = q => { const t = new THREE.Vector3(...q).project(B.cam); let x = (t.x + 1) / 2 * W; if (view === 'front') x = W - x; return [x, (1 - t.y) / 2 * H]; };
  const P = pads(p), used = {}; cur.frets.forEach((f, k) => { const fi = cur.fingers[k]; if (f > 0 && fi) used[fi] = 1; });
  const show = fingersOn ? Object.keys(used).filter(k2 => fingersOn.has(String(k2))) : Object.keys(used);
  const shown = {}; show.forEach(k2 => { shown[k2] = 1; });
  lightFingers(shown);
  const spotsW = placeMarks(cur.frets.map((f, k) => (shown[cur.fingers[k]] ? f : 0)), cur.fingers);
  B.marks.forEach(m => { if (m.g.visible) m.g.quaternion.copy(B.cam.quaternion); });
  const spots = spotsW.map(q => ({ fi: q.fi, s: pr(q.w) }));
  B.scene.updateMatrixWorld(true); B.R.render(B.scene, B.cam);
  // the neck runs this way on screen; the badges step off it on the side away from the hand
  const nd = (() => { const a = pr([0, 0, 8]), b2 = pr([0, -120, 8]); let dx = b2[0] - a[0], dy = b2[1] - a[1]; const n = Math.hypot(dx, dy) || 1; return [dx / n, dy / n]; })();
  let perp = [-nd[1], nd[0]];
  { // the badges step off the neck on the side the hand is not on, so they never sit on the palm
    const hb = B.bones[B.bIndex['hand.L']];
    if (hb && spots.length) {
      const wp = new THREE.Vector3(); hb.getWorldPosition(wp);
      const hp = pr([wp.x, wp.y, wp.z]);
      let cx = 0, cy = 0; spots.forEach(q => { cx += q.s[0] / spots.length; cy += q.s[1] / spots.length; });
      if ((hp[0] - cx) * perp[0] + (hp[1] - cy) * perp[1] > 0) perp = [-perp[0], -perp[1]];
    }
  }
  // one badge per finger: a finger lying across two strings gets a bar between its rings
  const byF = {}; spots.forEach(sp => { (byF[sp.fi] = byF[sp.fi] || []).push(sp.s); });
  const placed = [];
  Object.keys(byF).forEach(fi => {
    const pts = byF[fi], col = PD.fingers.color(fi === 'T' ? 'T' : +fi), ink = PD.fingers.ink(fi === 'T' ? 'T' : +fi);
    if (pts.length > 1) { ctx.strokeStyle = col; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.globalAlpha = .75; ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]); ctx.stroke(); ctx.globalAlpha = 1; }
    const a = [pts.reduce((s2, q) => s2 + q[0], 0) / pts.length, pts.reduce((s2, q) => s2 + q[1], 0) / pts.length];
    let bx = a[0] + perp[0] * 38, by = a[1] + perp[1] * 38;
    const clash = (x, y) => placed.some(q => Math.hypot(q[0] - x, q[1] - y) < 26) || spots.some(q => Math.hypot(q.s[0] - x, q.s[1] - y) < 22);
    for (let tries = 0; tries < 8; tries++) { if (!clash(bx, by)) break; bx += nd[0] * 24; by += nd[1] * 24; }
    bx = Math.min(W - 14, Math.max(14, bx)); by = Math.min(H - 14, Math.max(14, by)); placed.push([bx, by]);
    let dx = bx - a[0], dy = by - a[1]; const n = Math.hypot(dx, dy) || 1; dx /= n; dy /= n;
    ctx.strokeStyle = col; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.moveTo(a[0] + dx * 9, a[1] + dy * 9); ctx.lineTo(bx - dx * 11, by - dy * 11); ctx.stroke();
    ctx.fillStyle = col; ctx.beginPath(); ctx.arc(bx, by, 11, 0, 7); ctx.fill(); ctx.strokeStyle = 'rgba(255,255,255,.85)'; ctx.lineWidth = 1.6; ctx.stroke();
    ctx.fillStyle = ink; ctx.font = '700 13px system-ui, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(String(fi), bx, by + .5);
  });
  if (anim) draw();
}
/** the fingers this chord uses stay in full colour; the others step back, so the eye lands on the right ones */
function lightFingers(used) {
  const B = built; if (!B || !B.vFing) return;
  const col = B.vCol, f = B.vFing, DIM = .26, any = used && Object.keys(used).length;
  for (let i = 0; i < f.length; i++) {
    const id = f[i];
    const on = !id || !any || used[id === 5 ? 'T' : String(id)];
    const v = on ? 1 : DIM;
    col[i * 3] = v; col[i * 3 + 1] = v * (on ? 1 : .96); col[i * 3 + 2] = v * (on ? 1 : .92);
  }
  B.geo.attributes.color.needsUpdate = true;
}
/** a ring exactly on the string at the fret, in that finger's colour */
function placeMarks(frets, fingers) {
  const B = built; if (!B || !B.marks) return [];
  const out = []; let n = 0;
  (frets || []).forEach((fr, k) => {
    const s = k + 1, fi = (fingers || [])[k];
    if (!(fr > 0) || n >= B.marks.length) return;
    const y = B.fy(fr) + (B.fy(fr - 1) - B.fy(fr)) * .32, m = B.marks[n++];
    m.g.position.set(B.sxAt(s, y), y, B.szAt(y) + 1.6);
    const c = new THREE.Color(PD.fingers.color(fi === 'T' ? 'T' : +fi || 1));
    m.ring.material.color.copy(c); m.dot.material.color.copy(c);
    m.g.visible = true; m.g.scale.setScalar(Math.max(.55, Math.min(1.6, B.cam.position.distanceTo(m.g.position) / 230)));
    out.push({ fi: fi === 'T' ? 'T' : +fi, w: [B.sxAt(s, y), y, B.szAt(y) + 1.6] });
  });
  for (let i = n; i < B.marks.length; i++) B.marks[i].g.visible = false;
  return out;
}
export function has(frets, fingers) { return !(frets || []).some(f => f > 0) || !!POSES[keyOf(frets, fingers)]; }
/** put the 3D view into el; returns false when this device cannot draw it */
export function mount(el) {
  const B = build(); if (B.error) return false;
  host = el; host.innerHTML = ''; overlay = document.createElement('canvas'); overlay.className = 'h3-ov';
  host.append(B.cv, overlay); B.cv.classList.toggle('mirror', view === 'front');
  size(); draw();
  if (!host._ro) { host._ro = new ResizeObserver(() => { size(); draw(); }); host._ro.observe(host); }
  return true;
}
export function setView(v) { view = v; if (built && built.cv) built.cv.classList.toggle('mirror', view === 'front'); draw(); }
export function setChord(frets, fingers) {
  anim = null; fingersOn = null;
  // nothing is pressed: an open chord needs no hand, so the neck is shown on its own
  if (!(frets || []).some(f => f > 0)) { cur = { frets: frets || [0, 0, 0], fingers: fingers || [], v: null, y: -60, p0: null, open: true }; draw(); return true; }
  const P = POSES[keyOf(frets, fingers)];
  if (!P) { cur = null; return false; }
  const p0 = P.v.slice(); p0[3] += 18; p0[4] -= 4; p0[5] -= 16; for (let i = 8; i < 24; i++) p0[i] *= .82; for (let i = 24; i < 29; i++) p0[i] *= .75;
  cur = { frets, fingers, v: P.v, y: P.y, p0, q: P.q, cam: P.cam }; draw(); return true;
}
/** step by step: the fingers in `on` are placed (animated from where they were) */
export function stepFingers(on) { if (!cur) return; const to = new Set([...on].map(String)); anim = { t0: performance.now(), dur: 650, from: fingersOn || new Set(), to }; fingersOn = fingersOn || new Set(); draw(); }
export function reset() { anim = null; fingersOn = null; draw(); }
export function quality(frets, fingers) { const P = POSES[keyOf(frets, fingers)]; return P ? P.q : null; }
export const count = Object.keys(POSES).length;
