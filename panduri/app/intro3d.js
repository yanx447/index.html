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
  function finalShot() {
    // the whole instrument: upright on a phone (portrait), lying horizontally on a wide screen
    return portrait() ? { p: [-140, -170, 1500], t: [0, -120, 0], f: 32, up: [0, 1, 0] } : { p: [150, -275, 1020], t: [0, -262, 0], f: 30, up: [1, 0, 0] };
  }
  const SHOTS = () => {
    const F = finalShot();
    return [
      [0.0, 2.4, [-22, SH - 40, -66], [-4, SH - 8, -16], [-4, SH + 30, 200], [0, SH - 30, 200], 84, 66, [0, -1, 0]],
      [2.4, 3.4, [-4, SH - 8, -16], [0, SH - 2, -10], [0, SH - 30, 200], [0, SH - 150, 10], 66, 60, [0, 0, 1]],                          // inside the body, looking up at the light in the sound hole
      [3.4, 5.0, [0, SH - 2, -10], [0, SH + 30, 40], [0, SH - 150, 10], [0, SH - 150, 10], 60, 54, [0, 0, 1]],                  // rising out of the hole and turning to the soundboard
      [5.0, 8.0, [0, SH + 30, 40], [-170, SH - 250, 420], [0, SH - 150, 10], [0, SH - 40, 0], 54, 40, [0, 1, 0]],         // over the top: holes, bridge, the whole soundboard
      [8.0, 10.4, [26, -330, 20], [24, -150, 26], [0, -100, 8], [0, 40, 2], 46, 44, [0, 0, 1]],                       // low along the strings and frets
      [10.4, 11.4, [24, -150, 26], [-150, 20, 250], [0, 40, 2], [0, 80, -6], 44, 40, [0, 0, 1]],                      // up to the tuners
      [11.4, 13.8, [-150, 20, 250], [-118, 44, 226], [0, 80, -6], [0, 74, -6], 40, 38, [0, 0, 1]],                    // tuning: A, C♯, E
      [13.8, 16.2, [-118, 44, 226], F.p, [0, 74, -6], F.t, 38, F.f, F.up]                                             // and back: the whole instrument
    ];
  };
  const DUR = 16.2, TUNE = [[1, 11.5, 12.3, 'A'], [2, 12.25, 13.05, 'C♯'], [3, 13.0, 13.8, 'E']];
  let fixedT = null, shots = SHOTS(), t0 = 0, raf = 0, stopped = false, endAt = null, onEnd = opt.onEnd || (() => {}), cued = {};
  function size() {
    const w = host.clientWidth || innerWidth, h = host.clientHeight || innerHeight, dpr = Math.min(opt.still ? 1 : 1.6, window.devicePixelRatio || 1);
    R.setPixelRatio(dpr); R.setSize(w, h, false); cv.style.width = w + 'px'; cv.style.height = h + 'px'; cam.aspect = w / h; cam.updateProjectionMatrix(); shots = SHOTS();
  }
  function camAt(t) {
    let S = shots[shots.length - 1], k = 1;
    for (const s of shots) if (t <= s[1]) { S = s; k = ease((t - s[0]) / (s[1] - s[0])); break; }
    const prevUp = shots[Math.max(0, shots.indexOf(S) - 1)][8], up = lerp3(prevUp, S[8], sm(0, .6, k));
    cam.position.set(...lerp3(S[2], S[3], k)); cam.up.set(...up); cam.lookAt(...lerp3(S[4], S[5], k)); cam.fov = lerp(S[6], S[7], k); cam.updateProjectionMatrix();
  }
  function frame(now) {
    if (stopped) return; if (!host.isConnected && !opt.still) { stopped = true; ro.disconnect(); try { R.dispose(); R.forceContextLoss(); } catch (_) {} return; } raf = requestAnimationFrame(frame);
    if (document.hidden) return;
    const life = fixedT != null ? fixedT : (now - t0) / 1000, t = Math.min(DUR, life);
    if (t < DUR) camAt(t); else { // after the film: a slow breathing orbit around the final shot
      const F = finalShot(), a = (life - DUR) * .08, s = Math.sin(a), c = Math.cos(a);
      cam.position.set(F.p[0] + s * 90, F.p[1] + (1 - c) * 30, F.p[2]); cam.up.set(...F.up); cam.lookAt(...F.t); cam.fov = F.f; cam.updateProjectionMatrix();
    }
    // strings grow one after another (A, then C♯, then E), each with a warm tip and a glow that settles
    const g = [sm(.3, 3.2, t), sm(1.1, 4.0, t), sm(1.9, 4.8, t)];
    strings.forEach((S, i) => {
      const k = Math.max(g[i], S.grow); S.grow = k; S.m.visible = k > .002; S.geo.setDrawRange(0, Math.max(6, Math.floor(S.total * k / 6) * 6));
      const p = S.curve.getPoint(Math.min(.999, k)); S.tip.position.copy(p); S.tip.material.opacity = k > 0 && k < 1 ? .95 : 0; S.tip.scale.setScalar(1.6 + Math.sin(life * 18 + i) * .3);
      const glowGrow = k > 0 && k < 1 ? 1.2 : Math.max(0, 1 - (t - [3.2, 4.0, 4.8][i]) / 1.4);
      // the run along the neck: light travels up each string
      const run = t > 8 && t < 10.6 ? .35 + .3 * Math.sin(life * 6 - i * 1.4) : 0, tu = TUNE[i], tk = sm(tu[2] - .15, tu[2] + .1, t) * (1 - sm(tu[2] + .4, tu[2] + 1.4, t));
      S.mat.emissiveIntensity = Math.max(0, glowGrow) * .9 + run + tk * 1.4 + (t >= DUR ? .05 + .05 * Math.sin(life * 2 + i) : 0);
    });
    // a moving light that makes the frets glint during the low pass
    const lp = sm(7.8, 8.4, t) * (1 - sm(10.4, 11.4, t)); sweep.intensity = 1.6 * lp; sweep.position.set(30, lerp(-330, 40, sm(8, 10.4, t)), 40);
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
    debugCam(pos, tgt, up, fov, li) { stopped = true; inner.intensity = li || 0; beam.material.opacity = li ? .5 : 0; cancelAnimationFrame(raf); cam.position.set(...pos); cam.up.set(...up); cam.lookAt(...tgt); cam.fov = fov; cam.updateProjectionMatrix(); strings.forEach(S => { S.m.visible = true; S.geo.setDrawRange(0, S.total); }); R.render(scene, cam); },
    get info() { return { pos: cam.position.toArray().map(Math.round), calls: R.info.render.calls, tris: R.info.render.triangles, inside: inside.visible, inner: inner.intensity }; },
    get duration() { return DUR; }, canvas: cv
  };
}
