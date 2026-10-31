import * as THREE from './three.module.js';
import { makeRig, V, Q } from './rig.js';
const R3 = PD.R3D, X = R3.export, G3 = R3.geometry, TH = PD.theory;
const W = window.RW || 720, H = window.RH || 450;
const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
cv.style.cssText = 'position:fixed;left:0;top:0;width:' + W + 'px;height:' + H + 'px;z-index:2147483647';
document.body.appendChild(cv);
const R = new THREE.WebGLRenderer({ canvas: cv, antialias: true, preserveDrawingBuffer: true });
R.setPixelRatio(1); R.setSize(W, H, false);
R.outputColorSpace = THREE.SRGBColorSpace; R.toneMapping = THREE.ACESFilmicToneMapping; R.toneMappingExposure = 1.0;
R.shadowMap.enabled = true; R.localClippingEnabled = true; R.shadowMap.type = THREE.PCFSoftShadowMap;
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x16120f);

/* ---------- the panduri: the app's own 3D model (same geometry, textures, holes) ---------- */
const pan = new THREE.Group(); scene.add(pan);
const texCache = {};
X.meshes.forEach(m => {
  if (!m.visible || m.local || m.part === 'shadow') return;
  const mt = m.mat; if (mt.alpha != null && mt.alpha < .6) return; if (mt.shadow) return;
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(m.pos, 3)); g.setAttribute('normal', new THREE.BufferAttribute(m.nrm, 3)); g.setAttribute('uv', new THREE.BufferAttribute(m.uv, 2));
  const col = new Float32Array(m.ao.length * 3); for (let i = 0; i < m.ao.length; i++) col[i * 3] = col[i * 3 + 1] = col[i * 3 + 2] = m.ao[i] * (mt.dim ? mt.dim : 1);
  g.setAttribute('color', new THREE.BufferAttribute(col, 3)); g.setIndex(new THREE.BufferAttribute(m.idx, 1));
  let map = null;
  if (mt.tex && X.TEX[mt.tex]) { map = texCache[mt.tex]; if (!map) { map = new THREE.CanvasTexture(X.TEX[mt.tex]); map.colorSpace = THREE.SRGBColorSpace; map.wrapS = map.wrapT = THREE.RepeatWrapping; map.anisotropy = 8; texCache[mt.tex] = map; } }
  const color = mt.color ? new THREE.Color().setRGB(mt.color[0], mt.color[1], mt.color[2], THREE.SRGBColorSpace) : new THREE.Color(1, 1, 1);
  const mat = new THREE.MeshPhysicalMaterial({ map, color, vertexColors: true, roughness: mt.rough == null ? .5 : mt.rough, metalness: mt.metal || 0, clearcoat: mt.coat ? .8 : 0, clearcoatRoughness: .2, emissive: mt.emis ? color.clone().multiplyScalar(mt.emis * .3) : new THREE.Color(0), side: THREE.DoubleSide });
  if (m.holes) mat.onBeforeCompile = sh => {
    sh.uniforms.uHole = { value: X.HOLES.map(h => new THREE.Vector3(h[0], h[1], h[2])) };
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vLP;').replace('#include <begin_vertex>', '#include <begin_vertex>\nvLP = position;');
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nvarying vec3 vLP;\nuniform vec3 uHole[' + X.HOLES.length + '];').replace('void main() {', 'void main() {\n for (int i = 0; i < ' + X.HOLES.length + '; i++) { if (distance(vLP.xy, uHole[i].xy) < uHole[i].z) discard; }');
  };
  const me = new THREE.Mesh(g, mat); me.castShadow = true; me.receiveShadow = true; pan.add(me);
});
// strings as nylon tubes along the model's own string paths
const strMeshes = {};
for (let s = 1; s <= 3; s++) {
  const a = X.strings[s].base, pts = []; for (let i = 0; i < a.length; i += 3) pts.push(new THREE.Vector3(a[i], a[i + 1], a[i + 2]));
  const curve = new THREE.CurvePath(); for (let i = 0; i < pts.length - 1; i++) curve.add(new THREE.LineCurve3(pts[i], pts[i + 1]));
  const tg = new THREE.TubeGeometry(curve, 600, X.SRAD[s], 10, false);
  const m = new THREE.Mesh(tg, new THREE.MeshPhysicalMaterial({ color: 0xEFE9DC, roughness: .32, sheen: .4 })); m.castShadow = true; pan.add(m); strMeshes[s] = m;
}

/* ---------- lights: soft key from above-front, warm fill, cool rim ---------- */
scene.add(new THREE.HemisphereLight(0xfff3e6, 0x2a1d14, .55));
const key = new THREE.DirectionalLight(0xfff1e2, 2.4); key.castShadow = true; key.shadow.mapSize.set(1024, 1024); key.shadow.bias = -.0004; key.shadow.normalBias = .6; key.shadow.radius = 6;
const kc = key.shadow.camera; kc.left = -260; kc.right = 260; kc.top = 260; kc.bottom = -260; kc.near = 1; kc.far = 2000;
scene.add(key, key.target);
const fill = new THREE.DirectionalLight(0xffd9b8, .7); scene.add(fill, fill.target);
const rim = new THREE.DirectionalLight(0xbcd2ff, .9); scene.add(rim, rim.target);

/* ---------- the arms: the supplied model, skinned to a skeleton derived from its vertex groups ---------- */
const AJ = await (await fetch('/render/OBArms_Obj.002.json')).json();
const RIG = await (await fetch('/render/rig.json')).json();
const skinTex = await new THREE.TextureLoader().loadAsync('/render/skin.jpg'); skinTex.colorSpace = THREE.SRGBColorSpace; skinTex.anisotropy = 8;
const nrmTex = await new THREE.TextureLoader().loadAsync('/render/skin_n.png');
const rigs = { L: makeRig(RIG, 'L'), R: makeRig(RIG, 'R') };
// one bone per joint, both sides; everything else (shoulders, chest) to a root
const bones = [], bIndex = {};
const root = new THREE.Bone(); root.name = 'root'; bones.push(root); bIndex.root = 0;
['L', 'R'].forEach(S => {
  const rg = rigs[S];
  const make = (n, parentBone, parentHead) => { const b = new THREE.Bone(); b.name = n; const h = rg.H[n]; b.position.set(h[0] - (parentHead ? parentHead[0] : 0), h[1] - (parentHead ? parentHead[1] : 0), h[2] - (parentHead ? parentHead[2] : 0)); parentBone.add(b); bIndex[n] = bones.length; bones.push(b); (rg.kids[n] || []).forEach(c => make(c, b, h)); };
  make(rg.root, root, null);
});
const gmap = AJ.groups.map(g => { if (bIndex[g] != null) return bIndex[g]; const m = g.match(/\.(L|R)$/); if (/upper_arm|shoulder/.test(g) && m) return bIndex['forearm.' + m[1]]; if (/thumb\.03_Cont_R/.test(g)) return bIndex['thumb.03.R']; return 0; });
const geo = new THREE.BufferGeometry();
geo.setAttribute('position', new THREE.Float32BufferAttribute(AJ.pos, 3)); geo.setAttribute('uv', new THREE.Float32BufferAttribute(AJ.uv, 2)); geo.setIndex(AJ.idx);
geo.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(AJ.si.map(i => gmap[i]), 4)); geo.setAttribute('skinWeight', new THREE.Float32BufferAttribute(AJ.sw, 4));
geo.computeVertexNormals(); geo.computeTangents && false;
const skinMat = new THREE.MeshPhysicalMaterial({ map: skinTex, normalMap: nrmTex, normalScale: new THREE.Vector2(.7, .7), roughness: .58, sheen: .25, sheenColor: new THREE.Color(0xffd0b8), sheenRoughness: .6, clearcoat: .08, clearcoatRoughness: .5 });
const arms = new THREE.SkinnedMesh(geo, skinMat); arms.castShadow = true; arms.receiveShadow = true; arms.frustumCulled = false;
arms.add(root); const skel = new THREE.Skeleton(bones); arms.bind(skel);
const armG = new THREE.Group(); armG.add(arms); scene.add(armG);
// scale: wrist → middle fingertip = 185 mm
const rgL = rigs.L, handLen = V.len(V.sub(rgL.T['finger_middle.03.L'], rgL.H['hand.L']));
const SC = 185 / handLen; armG.scale.setScalar(SC);
// finger radii (model units) from the mesh: distance of a bone's vertices to its axis
const radius = {};
{ const P = AJ.pos, n = P.length / 3; ['L', 'R'].forEach(S => { const rg = rigs[S]; rg.names.forEach(b => { const gi = AJ.groups.indexOf(b); if (gi < 0) return; const h = rg.H[b], kid = (rg.kids[b] || [])[0], t = kid ? rg.H[kid] : rg.T[b]; if (!t) return; const d = V.nrm(V.sub(t, h)), L = V.len(V.sub(t, h)); let s = 0, c = 0; for (let i = 0; i < n; i++) { for (let k = 0; k < 4; k++) if (AJ.si[i * 4 + k] === gi && AJ.sw[i * 4 + k] > .6) { const p = [P[i * 3], P[i * 3 + 1], P[i * 3 + 2]], v = V.sub(p, h), along = V.dot(v, d); if (along > 0 && along < L) { s += V.len(V.sub(v, V.mul(d, along))); c++; } } } radius[b] = c ? s / c : .05; }); }); }

/* ---------- apply a pose to the Three bones (same maths as the solver) ---------- */
function applyPose(S, p) {
  const rg = rigs[S], Lc = rg.locals(p);
  rg.names.forEach(n => { const b = bones[bIndex[n]]; const q = Lc[n]; b.quaternion.set(q[0], q[1], q[2], q[3]); });
  const rb = bones[bIndex[rg.root]]; rb.position.set(p.rootP[0], p.rootP[1], p.rootP[2]); const q = Q.mul(p.rootQ, Lc[rg.root]); rb.quaternion.set(q[0], q[1], q[2], q[3]);
}
/** hide an arm: collapse it into its forearm head (all its vertices vanish) */
function hideArm(S) { const rb = bones[bIndex['forearm.' + S]]; rb.scale.setScalar(1e-4); rb.position.set(0, -9999, 0); }
function showArm(S) { bones[bIndex['forearm.' + S]].scale.setScalar(1); }

const cam = new THREE.PerspectiveCamera(30, W / H, 2, 5000);
function look(pos, target, fov, up) { cam.fov = fov || 30; cam.updateProjectionMatrix(); cam.position.set(...pos); cam.up.set(...(up || [0, 1, 0])); cam.lookAt(...target); }
const dbg = new THREE.Group(); scene.add(dbg);
function mark(p, color, r) { const m = new THREE.Mesh(new THREE.SphereGeometry(r || 1.6, 16, 12), new THREE.MeshBasicMaterial({ color })); m.position.set(...p); dbg.add(m); return m; }
function clearMarks() { dbg.clear(); }
function lights(target, k, f, r) {
  key.position.set(...(k || [target[0] + 160, target[1] + 260, target[2] + 420])); key.target.position.set(...target);
  fill.position.set(...(f || [target[0] - 300, target[1] - 120, target[2] + 160])); fill.target.position.set(...target);
  rim.position.set(...(r || [target[0] - 60, target[1] + 300, target[2] - 380])); rim.target.position.set(...target);
}
/** cut the instrument with a plane (keeps y > at): a section view along the strings */
const clipPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
function section(at) { pan.traverse(o => { if (o.material) { o.material.clippingPlanes = at == null ? null : [clipPlane]; o.material.clipShadows = true; o.material.needsUpdate = true; } }); if (at != null) clipPlane.constant = -at; }
function render() { scene.updateMatrixWorld(true); R.render(scene, cam); }
function project(p) { cam.updateMatrixWorld(); const v = new THREE.Vector3(...p).project(cam); return [(v.x + 1) / 2 * W, (1 - v.y) / 2 * H]; }

window.HS = { section, mark, clearMarks, THREE, scene, R, cam, look, lights, render, project, rigs, applyPose, hideArm, showArm, SC, radius, X, G3, TH, pan, strMeshes, bones, bIndex, armG, V, Q };
window.HS_READY = true;
