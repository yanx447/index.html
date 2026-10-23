/* =====================================================================
   Opening film of the welcome screen (≈ 12 s, skippable): the camera
   starts inside the sound hole and rises; the three strings grow one by
   one; it flies over the soundboard (holes, bridge, the whole top);
   skims low along the strings and frets up to the tuners; then pulls
   back to the whole instrument, where it stays, breathing slowly, behind
   the title. The instrument is the app's own 3D model (PD.R3D).
   ===================================================================== */
import * as THREE from './h3-three.js';

const ease = k => k <= 0 ? 0 : k >= 1 ? 1 : k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
const sm = (a, b, x) => { const k = Math.min(1, Math.max(0, (x - a) / (b - a))); return k * k * (3 - 2 * k); };
const lerp = (a, b, k) => a + (b - a) * k, lerp3 = (a, b, k) => [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k)];

export function create(host, opt) {
  opt = opt || {};
  const X = PD.R3D.export, G = PD.R3D.geometry;
  const cv = document.createElement('canvas'); cv.className = 'cine-cv'; host.appendChild(cv);
  let R;
  try { R = new THREE.WebGLRenderer({ canvas: cv, antialias: true, alpha: true, powerPreference: 'high-performance', preserveDrawingBuffer: !!opt.still }); } catch (e) { cv.remove(); return null; }
  R.outputColorSpace = THREE.SRGBColorSpace; R.toneMapping = THREE.ACESFilmicToneMapping; R.toneMappingExposure = 1.05;
  R.shadowMap.enabled = true; R.shadowMap.type = THREE.PCFSoftShadowMap;
  const scene = new THREE.Scene(); R.setClearColor(0x000000, 0);
  /* a soft studio environment, so chrome and gloss reflect something (otherwise metal renders black) */
  scene.environment = (() => { const pm = new THREE.PMREMGenerator(R), es = new THREE.Scene(), c = document.createElement('canvas'); c.width = 64; c.height = 256; const x = c.getContext('2d'), gg = x.createLinearGradient(0, 0, 0, 256); gg.addColorStop(0, '#fff1de'); gg.addColorStop(.42, '#7a6450'); gg.addColorStop(1, '#140e0a'); x.fillStyle = gg; x.fillRect(0, 0, 64, 256);
    const et = new THREE.CanvasTexture(c); et.colorSpace = THREE.SRGBColorSpace; es.add(new THREE.Mesh(new THREE.SphereGeometry(500, 32, 16), new THREE.MeshBasicMaterial({ map: et, side: THREE.BackSide })));
    [[-300, 200, 320], [320, 260, -200], [0, -120, 420]].forEach((p, i) => { const q = new THREE.Mesh(new THREE.PlaneGeometry(i === 2 ? 400 : 260, 140), new THREE.MeshBasicMaterial({ color: i === 2 ? 0x8a7360 : 0xffffff, side: THREE.DoubleSide })); q.position.set(...p); q.lookAt(0, 0, 0); es.add(q); });
    const rt = pm.fromScene(es, .03); pm.dispose(); return rt.texture; })();

  /* the instrument (same meshes as the in-app 3D view) */
  const pan = new THREE.Group(); scene.add(pan); const tc = {}, fretMats = [], tun = [];
  X.meshes.forEach(m => {
    if (!m.visible || m.local || m.part === 'shadow' || m.part === 'ui' || m.part === 'string') return; const mt = m.mat; if (mt.alpha != null && mt.alpha < .6) return; if (mt.shadow) return;
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(m.pos, 3)); g.setAttribute('normal', new THREE.BufferAttribute(m.nrm, 3)); g.setAttribute('uv', new THREE.BufferAttribute(m.uv, 2));
    const col = new Float32Array(m.ao.length * 3); for (let i = 0; i < m.ao.length; i++) col[i * 3] = col[i * 3 + 1] = col[i * 3 + 2] = m.ao[i] * (mt.dim ? mt.dim : 1);
    g.setAttribute('color', new THREE.BufferAttribute(col, 3)); g.setIndex(new THREE.BufferAttribute(m.idx, 1));
    let map = null; if (mt.tex && X.TEX[mt.tex]) { map = tc[mt.tex]; if (!map) { map = new THREE.CanvasTexture(X.TEX[mt.tex]); map.colorSpace = THREE.SRGBColorSpace; map.wrapS = map.wrapT = THREE.RepeatWrapping; map.anisotropy = 8; tc[mt.tex] = map; } }
    const color = mt.color ? new THREE.Color().setRGB(mt.color[0], mt.color[1], mt.color[2], THREE.SRGBColorSpace) : new THREE.Color(1, 1, 1);
    const mat = new THREE.MeshPhysicalMaterial({ map, color, vertexColors: true, roughness: mt.rough == null ? .5 : mt.rough, metalness: mt.metal || 0, clearcoat: mt.coat ? .9 : .15, clearcoatRoughness: .18, emissive: new THREE.Color(0), side: THREE.DoubleSide });
    mat.envMapIntensity = mt.metal ? 1 : mt.coat ? .5 : .28; if (mt.metal === 1) { mat.metalness = .8; mat.roughness = .22; }
    if (m.part === 'fret') { mat.metalness = .9; mat.roughness = .25; fretMats.push(mat); }
    if (m.holes) mat.onBeforeCompile = sh => {
      sh.uniforms.uHole = { value: X.HOLES.map(h => new THREE.Vector3(h[0], h[1], h[2])) };
      sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vLP;').replace('#include <begin_vertex>', '#include <begin_vertex>\nvLP = position;');
      sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nvarying vec3 vLP;\nuniform vec3 uHole[' + X.HOLES.length + '];').replace('void main() {', 'void main() {\n for (int i = 0; i < ' + X.HOLES.length + '; i++) { if (distance(vLP.xy, uHole[i].xy) < uHole[i].z) discard; }');
    };
    const me = new THREE.Mesh(g, mat); me.castShadow = true; me.receiveShadow = true;
    if (m.part === 'tuners') { const P = m.pos; let cx = 0, cy = 0; const n = P.length / 3; for (let i = 0; i < n; i++) { cx += P[i * 3]; cy += P[i * 3 + 1]; } cx /= n; cy /= n; tun.push({ me, cx, cy }); }
    else pan.add(me);
  });
  /* the three tuners (button, shaft, gear and roller of each string) turn about their own axis while tuning */
  const PEG = { 1: { y: 65, ry: 70 }, 2: { y: 89, ry: 94 }, 3: { y: 41, ry: 46 } };   // shaft centre (button side) and roller of A, C♯, E
  const pegs = {}; [1, 2, 3].forEach(k => { const gp = new THREE.Group(); gp.position.set(0, PEG[k].y, -9); pan.add(gp); const gr = new THREE.Group(); gr.position.set(0, PEG[k].ry, -6); pan.add(gr); pegs[k] = { button: gp, roller: gr }; });
  tun.forEach(({ me, cx, cy }) => {
    let k; const roller = Math.abs(cx) < 10;
    if (roller) k = cy > 82 ? 2 : cy > 58 ? 1 : 3; else k = cx > 0 ? 1 : cy > 75 ? 2 : 3;
    const h2 = roller ? pegs[k].roller : pegs[k].button; me.position.set(-h2.position.x, -h2.position.y, -h2.position.z); h2.add(me);
  });
  /* strings: built from the tail toward the head so they can "grow" (draw range) */
  const strings = [];
  for (let s = 1; s <= 3; s++) {
    const a = X.strings[s].base, pts = []; for (let i = a.length - 3; i >= 0; i -= 3) pts.push(new THREE.Vector3(a[i], a[i + 1], a[i + 2]));
    const curve = new THREE.CurvePath(); for (let i = 0; i < pts.length - 1; i++) curve.add(new THREE.LineCurve3(pts[i], pts[i + 1]));
    const SEG = 500, geo = new THREE.TubeGeometry(curve, SEG, X.SRAD[s] * 1.15, 8, false);
    const mat = new THREE.MeshPhysicalMaterial({ color: 0xF2EBDD, roughness: .3, sheen: .5, emissive: new THREE.Color(0xE3A87A), emissiveIntensity: 0 });
    const m = new THREE.Mesh(geo, mat); m.castShadow = true; pan.add(m);
    // the growing tip: a small warm light
    const tip = new THREE.Mesh(new THREE.SphereGeometry(1.6, 12, 10), new THREE.MeshBasicMaterial({ color: 0xFFE2BA, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }));
    pan.add(tip);
    strings.push({ m, geo, mat, curve, total: geo.index.count, tip, grow: 0 });
  }
  /* light */
  scene.add(new THREE.HemisphereLight(0xfff0e0, 0x1a120c, .45));
  const key = new THREE.DirectionalLight(0xfff0de, 2.6); key.position.set(-260, 120, 700); key.castShadow = true; key.shadow.mapSize.set(2048, 2048); key.shadow.bias = -.0004; key.shadow.normalBias = .6;
  Object.assign(key.shadow.camera, { left: -700, right: 700, top: 700, bottom: -700, near: 10, far: 3000 });
  const rim = new THREE.DirectionalLight(0xbcd2ff, 1.1); rim.position.set(500, 300, -600);
  const fill = new THREE.DirectionalLight(0xffc89a, .55); fill.position.set(500, -400, 300);
  const sweep = new THREE.PointLight(0xffd6a8, 0, 0, 0);
  scene.add(key, key.target, rim, fill, sweep); key.target.position.set(0, -300, 0);
  // inside the body: a warm glow, and a beam of light falling in through the sound hole
  const inner = new THREE.PointLight(0xffb070, 0, 0, 0); inner.position.set(0, G.SH_Y, -25); scene.add(inner);
  const beamTex = (() => { const c = document.createElement('canvas'); c.width = 8; c.height = 128; const x = c.getContext('2d'), g2 = x.createLinearGradient(0, 0, 0, 128); g2.addColorStop(0, 'rgba(255,220,170,.0)'); g2.addColorStop(.25, 'rgba(255,220,170,.55)'); g2.addColorStop(1, 'rgba(255,220,170,0)'); x.fillStyle = g2; x.fillRect(0, 0, 8, 128); return new THREE.CanvasTexture(c); })();
  const beam = new THREE.Mesh(new THREE.CylinderGeometry(G.HR * .98, G.HR * 1.6, 160, 40, 1, true), new THREE.MeshBasicMaterial({ map: beamTex, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }));
  beam.rotation.x = Math.PI / 2; beam.position.set(0, G.SH_Y, -78); scene.add(beam);
  // the inside of the body (the model is closed and dark inside): a lit wooden bowl and the underside of the top, only for the opening shots
  const woodTex = (() => { const c = document.createElement('canvas'); c.width = 512; c.height = 512; const x = c.getContext('2d'); x.fillStyle = '#b07a48'; x.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 260; i++) { const y = Math.random() * 512, w = 1 + Math.random() * 3; x.strokeStyle = 'rgba(' + (Math.random() < .5 ? '90,52,26' : '214,166,112') + ',' + (.15 + Math.random() * .3).toFixed(2) + ')'; x.lineWidth = w; x.beginPath(); x.moveTo(0, y); for (let k = 0; k <= 8; k++) x.lineTo(k * 64, y + Math.sin(k * .9 + i) * 6); x.stroke(); }
    const t2 = new THREE.CanvasTexture(c); t2.colorSpace = THREE.SRGBColorSpace; t2.wrapS = t2.wrapT = THREE.RepeatWrapping; return t2; })();
  const inside = new THREE.Group(); scene.add(inside);
  const bowl = new THREE.Mesh(new THREE.SphereGeometry(1, 48, 24, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), new THREE.MeshStandardMaterial({ map: woodTex, color: 0xffffff, roughness: .7, side: THREE.BackSide }));
  bowl.rotation.x = Math.PI / 2; bowl.scale.set(86, 72, 158); bowl.position.set(0, (G.BT + G.BOT) / 2, -3.5); inside.add(bowl);
  const lid = new THREE.Mesh(new THREE.RingGeometry(G.HR, 180, 64, 1), new THREE.MeshStandardMaterial({ map: woodTex, color: 0xf0d2a8, roughness: .65, side: THREE.DoubleSide }));
  lid.position.set(0, G.SH_Y, -3.4); inside.add(lid);
  const rimRing = new THREE.Mesh(new THREE.TorusGeometry(G.HR + .5, 1.6, 12, 64), new THREE.MeshStandardMaterial({ color: 0x6b3a1e, roughness: .4 })); rimRing.position.set(0, G.SH_Y, -1.8); inside.add(rimRing);
  /* dust in the light */
  const NP = 420, pp = new Float32Array(NP * 3), seed = new Float32Array(NP);
  for (let i = 0; i < NP; i++) { pp[i * 3] = (Math.random() - .5) * 900; pp[i * 3 + 1] = 200 - Math.random() * 1000; pp[i * 3 + 2] = Math.random() * 500 - 80; seed[i] = Math.random() * 6.28; }
  const dg = new THREE.BufferGeometry(); dg.setAttribute('position', new THREE.BufferAttribute(pp, 3));
  const dotTex = (() => { const c = document.createElement('canvas'); c.width = c.height = 64; const x = c.getContext('2d'), g2 = x.createRadialGradient(32, 32, 0, 32, 32, 32); g2.addColorStop(0, 'rgba(255,230,200,1)'); g2.addColorStop(.35, 'rgba(255,200,150,.35)'); g2.addColorStop(1, 'rgba(255,200,150,0)'); x.fillStyle = g2; x.fillRect(0, 0, 64, 64); const t = new THREE.CanvasTexture(c); return t; })();
  const dust = new THREE.Points(dg, new THREE.PointsMaterial({ size: 5, map: dotTex, transparent: true, opacity: .55, blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true }));
  scene.add(dust);

  const cam = new THREE.PerspectiveCamera(40, 1, 1, 6000);
  /* the film: [t0, t1, from pos, to pos, from target, to target, fov0, fov1, up] */
  const SH = G.SH_Y, BR = G.BR;
  const portrait = () => (host.clientHeight || 1) > (host.clientWidth || 1);
  // the end: no turn — the camera keeps the angle it had over the tuners (same direction, same up) and only pulls back
  // until the whole instrument is in view; the view distance adapts to the screen shape
  const TUNE_P = [24, 214, 138], TUNE_T = [0, 70, -6], DIRV = (() => { const d = [TUNE_T[0] - TUNE_P[0], TUNE_T[1] - TUNE_P[1], TUNE_T[2] - TUNE_P[2]], l = Math.hypot(...d); return d.map(x => x / l); })();
  // points sampled from the instrument (for framing it exactly in the free part of the screen)
  const CLOUD = []; pan.updateMatrixWorld(true); pan.traverse(o => { if (!o.isMesh || !o.geometry.attributes.position) return; const P = o.geometry.attributes.position, step = Math.max(1, Math.floor(P.count / 120)), v = new THREE.Vector3(); for (let i = 0; i < P.count; i += step) { v.fromBufferAttribute(P, i).applyMatrix4(o.matrixWorld); CLOUD.push([v.x, v.y, v.z]); } });
  const nrm3 = v => { const l = Math.hypot(...v) || 1; return v.map(x => x / l); }, crs = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  let FR = null;
  function basis() { const port = portrait(), f = nrm3(port ? [.06, .1, -1] : [-.1, .06, -1]), up0 = port ? [0, 1, 0] : [-1, 0, 0], r = nrm3(crs(f, up0)), u = crs(r, f); return { f, r, u, port }; }
  function extents(pos) { let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9; for (const p of CLOUD) { const d = [p[0] - pos[0], p[1] - pos[1], p[2] - pos[2]], z = d[0] * FR.f[0] + d[1] * FR.f[1] + d[2] * FR.f[2]; if (z < 1) continue; const x = (d[0] * FR.r[0] + d[1] * FR.r[1] + d[2] * FR.r[2]) / z, y = (d[0] * FR.u[0] + d[1] * FR.u[1] + d[2] * FR.u[2]) / z; if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; } return { x0, x1, y0, y1 }; }
  // the end: no turn — the camera keeps the angle it had over the tuners (same direction, same up) and only pulls back
  // (and slides sideways) until the whole instrument fills the free part of the screen (between the name and the buttons)
  let finCache = null, finKey = '';
  function finalShot(extra) {
    FR = basis();
    const w = host.clientWidth || innerWidth, h = host.clientHeight || innerHeight, asp = w / h, sf = (opt.safe && opt.safe()) || { l: .04, r: .96, t: .2, b: .86 };
    const key = [w, h, sf.l, sf.r, sf.t, sf.b, FR.port ? 1 : 0].map(x => Math.round(x * 1000)).join();
    if (key !== finKey) {
      const fov = 36, th = Math.tan(fov / 2 * Math.PI / 180), wantH = 2 * th * (sf.b - sf.t) * .94, wantW = 2 * th * asp * (sf.r - sf.l) * .94;
      const tg0 = [0, -250, -10]; let lo = 300, hi = 6000, d = 1200;
      for (let i = 0; i < 26; i++) { d = (lo + hi) / 2; const e = extents(tg0.map((x, k) => x - FR.f[k] * d)); if (e.y1 - e.y0 > wantH || e.x1 - e.x0 > wantW) lo = d; else hi = d; }
      d = hi; let tg = tg0.slice();
      // slide (no rotation) so the instrument's centre lands on the centre of the free area
      for (let it = 0; it < 3; it++) { const pos = tg.map((x, k) => x - FR.f[k] * d), e = extents(pos), cx = (e.x0 + e.x1) / 2, cy = (e.y0 + e.y1) / 2;
        const wx = ((sf.l + sf.r) - 1) * th * asp, wy = (1 - (sf.t + sf.b)) * th, a = (cx - wx) * d, bb = (cy - wy) * d; tg = tg.map((x, k) => x + FR.r[k] * a + FR.u[k] * bb); }
      finCache = { tg, d, fov, F: FR }; finKey = key;
    }
    const { tg, d, fov } = finCache, dd = d * (1 + (extra || 0));
    return { p: tg.map((x, i) => x - finCache.F.f[i] * dd), t: tg, f: fov, up: finCache.F.u };
  }
  const SHOTS = () => {
    const F = finalShot();
    return [
      [0.0, 2.4, [-22, SH - 40, -66], [-4, SH - 8, -16], [-4, SH + 30, 200], [0, SH - 30, 200], 84, 66, [0, -1, 0]],
      [2.4, 3.4, [-4, SH - 8, -16], [0, SH - 2, -10], [0, SH - 30, 200], [0, SH - 150, 10], 66, 60, [0, 0, 1]],                          // inside the body, looking up at the light in the sound hole
      [3.4, 5.0, [0, SH - 2, -10], [0, SH + 30, 40], [0, SH - 150, 10], [0, SH - 150, 10], 60, 54, [0, 0, 1]],                  // rising out of the hole and turning to the soundboard
      [5.0, 9.0, [0, SH + 30, 40], [0, -20, 40], [0, SH - 150, 10], [0, -200, 10], 54, 54, [0, 0, 1]],                // the same view, sliding back along the strings and frets toward the head
      [9.0, 10.6, [0, -20, 40], [0, 230, 150], [0, -200, 10], [0, 70, -6], 54, 46, [0, 0, 1]],                       // rising behind the head: the tuners below
      [10.6, 13.2, [0, 230, 150], TUNE_P, [0, 70, -6], TUNE_T, 46, 44, [0, 0, 1]],                        // tuning: A, C♯, E
      [13.2, 18.4, TUNE_P, F.p, TUNE_T, F.t, 44, F.f, F.up, 'swing']                                               // and back: the whole instrument
    ];
  };
  const DUR = 18.4, TUNE = [[1, 10.8, 11.6, 'A'], [2, 11.55, 12.35, 'C♯'], [3, 12.3, 13.1, 'E']];
  let frameN = 0, fixedT = null, shots = SHOTS(), t0 = 0, raf = 0, stopped = false, endAt = null, onEnd = opt.onEnd || (() => {}), cued = {};
  function size() {
    const w = host.clientWidth || innerWidth, h = host.clientHeight || innerHeight, dpr = Math.min(opt.still ? 1 : 1.6, window.devicePixelRatio || 1);
    R.setPixelRatio(dpr); R.setSize(w, h, false); cv.style.width = w + 'px'; cv.style.height = h + 'px'; cam.aspect = w / h; cam.updateProjectionMatrix(); shots = SHOTS();
  }
  const _m4 = new THREE.Matrix4(); function qOf(p, t, up) { _m4.lookAt(new THREE.Vector3(...p), new THREE.Vector3(...t), new THREE.Vector3(...up)); return new THREE.Quaternion().setFromRotationMatrix(_m4); }
  function camAt(t) {
    let S = shots[shots.length - 1], k = 1;
    for (const s of shots) if (t <= s[1]) { S = s; k = ease((t - s[0]) / (s[1] - s[0])); break; }
    if (S[9] === 'swing') { // one smooth turn (shortest rotation) from the view over the tuners to the whole instrument, while pulling back
      const qa = qOf(S[2], S[4], [0, 0, 1]), qb = qOf(S[3], S[5], S[8]), q = qa.clone().slerp(qb, k), tgt = lerp3(S[4], S[5], k);
      const d0 = Math.hypot(S[2][0] - S[4][0], S[2][1] - S[4][1], S[2][2] - S[4][2]), d1 = Math.hypot(S[3][0] - S[5][0], S[3][1] - S[5][1], S[3][2] - S[5][2]), dd = lerp(d0, d1, k);
      const fw = new THREE.Vector3(0, 0, -1).applyQuaternion(q); cam.quaternion.copy(q); cam.position.set(tgt[0] - fw.x * dd, tgt[1] - fw.y * dd, tgt[2] - fw.z * dd); cam.fov = lerp(S[6], S[7], k); cam.updateProjectionMatrix(); return;
    }
    const prevUp = shots[Math.max(0, shots.indexOf(S) - 1)][8], up = lerp3(prevUp, S[8], sm(0, .6, k));
    cam.position.set(...lerp3(S[2], S[3], k)); cam.up.set(...up); cam.lookAt(...lerp3(S[4], S[5], k)); cam.fov = lerp(S[6], S[7], k); cam.updateProjectionMatrix();
  }
  function frame(now) {
    if (stopped) return; if (!host.isConnected && !opt.still) { stopped = true; ro.disconnect(); try { R.dispose(); R.forceContextLoss(); } catch (_) {} return; } raf = requestAnimationFrame(frame);
    if (document.hidden) return;
    const life = fixedT != null ? fixedT : (now - t0) / 1000, t = Math.min(DUR, life);
    if (t > 12.5 && (frameN++ % 20 === 0)) { const k0 = finKey; finalShot(); if (finKey !== k0) shots = SHOTS(); }
    if (t < DUR) camAt(t); else { // after the film: the same view, breathing slowly
      const F = finalShot(Math.sin((life - DUR) * .25) * .025); // only a gentle breath in and out along the same line — no turning
      cam.position.set(...F.p); cam.up.set(...F.up); cam.lookAt(...F.t); cam.fov = F.f; cam.updateProjectionMatrix();
    }
    // strings grow one after another (A, then C♯, then E), each with a warm tip and a glow that settles
    const g = [sm(.3, 3.2, t), sm(1.1, 4.0, t), sm(1.9, 4.8, t)];
    strings.forEach((S, i) => {
      const k = Math.max(g[i], S.grow); S.grow = k; S.m.visible = k > .002; S.geo.setDrawRange(0, Math.max(6, Math.floor(S.total * k / 6) * 6));
      const p = S.curve.getPoint(Math.min(.999, k)); S.tip.position.copy(p); S.tip.material.opacity = k > 0 && k < 1 ? .95 : 0; S.tip.scale.setScalar(1.6 + Math.sin(life * 18 + i) * .3);
      const glowGrow = k > 0 && k < 1 ? 1.2 : Math.max(0, 1 - (t - [3.2, 4.0, 4.8][i]) / 1.4);
      // the run along the neck: light travels up each string
      const run = t > 5.2 && t < 9.4 ? .35 + .3 * Math.sin(life * 6 - i * 1.4) : 0, tu = TUNE[i], tk = sm(tu[2] - .15, tu[2] + .1, t) * (1 - sm(tu[2] + .4, tu[2] + 1.4, t));
      S.mat.emissiveIntensity = Math.max(0, glowGrow) * .9 + run + tk * 1.4 + (t >= DUR ? .05 + .05 * Math.sin(life * 2 + i) : 0);
    });
    // a moving light that makes the frets glint during the low pass
    const lp = sm(5.0, 5.6, t) * (1 - sm(9.0, 10.0, t)); sweep.intensity = 1.6 * lp; sweep.position.set(30, lerp(SH + 40, 0, sm(5, 9, t)), 40);
    // tuning: each peg turns (as if it had slipped) and its string comes up to pitch: A, then C♯, then E
    TUNE.forEach(([k, a, b, name]) => { const e = ease(Math.min(1, Math.max(0, (t - a) / (b - a)))); const ang = -Math.PI * 2 * 2.25 * e - Math.sin(e * Math.PI) * .3; pegs[k].button.rotation.x = ang; pegs[k].roller.rotation.x = ang * .35; if (t >= b && !cued[name] && t < DUR) { cued[name] = 1; opt.onCue && opt.onCue(name); } });
    fretMats.forEach(m => { m.emissive.setRGB(.25 * lp, .16 * lp, .08 * lp); });
    inner.intensity = 7 * (1 - sm(3.6, 4.6, t)); inside.visible = t < 4.6; beam.visible = false;
    // dust drifts
    const P = dg.attributes.position.array; for (let i = 0; i < NP; i++) { P[i * 3 + 1] += .08 + .04 * Math.sin(life + seed[i]); P[i * 3] += .05 * Math.sin(life * .7 + seed[i]); if (P[i * 3 + 1] > 220) P[i * 3 + 1] = -800; }
    dg.attributes.position.needsUpdate = true; dust.material.opacity = .25 + .35 * sm(4.5, 7, t);
    R.render(scene, cam);
    if (t >= DUR && endAt == null) { endAt = life; onEnd(); }
  }
  const ro = new ResizeObserver(() => size()); ro.observe(host); size();
  return {
    play() { t0 = performance.now(); stopped = false; cancelAnimationFrame(raf); raf = requestAnimationFrame(frame); },
    /** jump to the end of the film (tap / skip / reduced motion) */
    skip() { t0 = performance.now() - DUR * 1000; strings.forEach(S => { S.grow = 1; }); },
    still(t) { fixedT = t; t0 = performance.now() - t * 1000; cued = {}; strings.forEach(S => { S.grow = t > 4.9 ? 1 : 0; }); camAt(Math.min(t, DUR)); frame(performance.now()); },
    stop() { stopped = true; cancelAnimationFrame(raf); ro.disconnect(); try { R.dispose(); R.forceContextLoss(); } catch (_) {} cv.remove(); },
    debugCam(pos, tgt, up, fov, li) { stopped = true; inside.visible = !!li; inner.intensity = li || 0; beam.material.opacity = li ? .5 : 0; cancelAnimationFrame(raf); cam.position.set(...pos); cam.up.set(...up); cam.lookAt(...tgt); cam.fov = fov; cam.updateProjectionMatrix(); strings.forEach(S => { S.m.visible = true; S.geo.setDrawRange(0, S.total); }); R.render(scene, cam); },
    get info() { return { pos: cam.position.toArray().map(Math.round), calls: R.info.render.calls, tris: R.info.render.triangles, inside: inside.visible, inner: inner.intensity }; },
    get duration() { return DUR; }, canvas: cv
  };
}
