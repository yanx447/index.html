// 3D panduri head + neck (three.js, lazy-loaded). Rotates a full 360°, zooms, and stays live:
// the active string, its tuner key, tuned strings and the real signal level come from the tuner.
// Geometry follows the real instrument: slotted maple head with a mahogany-striped cap,
// three brass rollers (C♯ top, A middle, E bottom), geared tuners (C♯ + E left, A right),
// mahogany throat with shoulders, bone nut, rosewood fingerboard with frets, rounded neck.

import * as THREE from '../../vendor/three-lite.js';

// Coordinates mirror the 2D drawing: X3 = svgX − 150, Y3 = 200 − svgY. Units ≈ millimetres.
const RAIL_X = 32.5, RAIL_W = 31, RAIL_Y = 12, RAIL_H = 236, D = 24;
const SLOT_HALF = 17;
const NUT_Y = -156;
const NECK_LEN = 300;
const NUT_X = [-33, 0, 33];                 // A, C♯, E — outer strings run close to the fingerboard edges
const END_X = [-35, 0, 35];                 // slight spread further down the neck
const ROLLER_Y = [8, 60, -44];              // A middle, C♯ top, E bottom
const WRAP_X = [-10, 2, 10];
const SIDE = [1, -1, -1];                   // A right, C♯ + E left
const FRET_SCALE = 400;
const FRETS = [2, 4, 5, 7, 9, 10, 12];

function rng(seed) { return () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; }; }

function woodTexture(THREEref, base, dark, light, seed, w = 256, h = 1024) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const g = c.getContext('2d'); const r = rng(seed);
  g.fillStyle = base; g.fillRect(0, 0, w, h);
  for (let i = 0; i < 140; i++) {
    const x = r() * w, amp = 1 + r() * 4, ph = r() * 6.28, freq = 0.004 + r() * 0.01;
    g.strokeStyle = r() > 0.4 ? dark : light; g.globalAlpha = 0.05 + r() * 0.16; g.lineWidth = 0.6 + r() * 2.4;
    g.beginPath();
    for (let y = 0; y <= h; y += 16) { const xx = x + Math.sin(y * freq + ph) * amp; y ? g.lineTo(xx, y) : g.moveTo(xx, y); }
    g.stroke();
  }
  g.globalAlpha = 1;
  const t = new THREEref.CanvasTexture(c);
  t.colorSpace = THREEref.SRGBColorSpace; t.wrapS = t.wrapT = THREEref.RepeatWrapping; t.anisotropy = 8;
  return t;
}

function labelSprite(text) {
  const c = document.createElement('canvas'); c.width = 256; c.height = 128;
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(c), depthTest: true, transparent: true }));
  s.material.map.colorSpace = THREE.SRGBColorSpace;
  s.userData.canvas = c; s.renderOrder = 10;
  s.scale.set(34, 17, 1);
  drawLabel(s, text, '#f2e9da');
  return s;
}
function drawLabel(s, text, color) {
  const c = s.userData.canvas, g = c.getContext('2d');
  if (s.userData.text === text && s.userData.color === color) return;
  s.userData.text = text; s.userData.color = color;
  g.clearRect(0, 0, c.width, c.height);
  g.font = '700 74px "Noto Serif Georgian", Georgia, serif';
  g.textAlign = 'center'; g.textBaseline = 'middle';
  g.lineWidth = 10; g.strokeStyle = 'rgba(10,7,5,.85)'; g.strokeText(text, 128, 66);
  g.fillStyle = color; g.fillText(text, 128, 66);
  s.material.map.needsUpdate = true;
}

export class Headstock3D {
  constructor(canvas, { onPick } = {}) {
    this.canvas = canvas;
    this.onPick = onPick;
    this.yaw = -0.42; this.pitch = 0.1; this.vy = 0; this.vp = 0; this.zoom = 1;
    this.target = { yaw: null, pitch: null, zoom: null };
    this.state = { active: 0, done: [false, false, false], level: 0, labels: ['A', 'C♯', 'E'] };
    this.t = 0; this.running = false; this.dirty = true;

    const r = this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' });
    r.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    r.outputColorSpace = THREE.SRGBColorSpace;
    r.toneMapping = THREE.ACESFilmicToneMapping; r.toneMappingExposure = 1.05;

    this.scene = new THREE.Scene();
    const pm = new THREE.PMREMGenerator(r);
    this.scene.environment = pm.fromScene(new THREE.RoomEnvironment(), 0.04).texture;
    pm.dispose();
    this.camera = new THREE.PerspectiveCamera(30, 1, 10, 5000);

    const key = new THREE.DirectionalLight(0xfff1dc, 1.6); key.position.set(-300, 500, 600); this.scene.add(key);
    const rim = new THREE.DirectionalLight(0xd4a655, 0.9); rim.position.set(400, 200, -500); this.scene.add(rim);
    this.scene.add(new THREE.HemisphereLight(0xfff4e2, 0x1a120c, 0.35));

    this.pivot = new THREE.Group();
    this.scene.add(this.pivot);
    this.model = new THREE.Group();
    this.pivot.add(this.model);
    this.build();
    this.bind();
    this.resize();
  }

  mats() {
    const maple = woodTexture(THREE, '#dcc5a0', '#9c7b52', '#f3e3c6', 3);
    const mahog = woodTexture(THREE, '#6e3122', '#33140d', '#8e4a34', 7);
    const rose = woodTexture(THREE, '#2a1610', '#120805', '#4a2a1c', 11);
    const capMaple = maple.clone(); capMaple.repeat.set(1 / 110, 1 / 220); capMaple.needsUpdate = true;
    const throatTex = mahog.clone(); throatTex.repeat.set(1 / 110, 1 / 160); throatTex.needsUpdate = true;
    return {
      maple: new THREE.MeshStandardMaterial({ map: maple, roughness: 0.55, envMapIntensity: 0.6 }),
      capMaple: new THREE.MeshStandardMaterial({ map: capMaple, roughness: 0.55, envMapIntensity: 0.6 }),
      mahog: new THREE.MeshStandardMaterial({ map: mahog, roughness: 0.5, envMapIntensity: 0.6 }),
      throat: new THREE.MeshStandardMaterial({ map: throatTex, roughness: 0.5, envMapIntensity: 0.6 }),
      rose: new THREE.MeshStandardMaterial({ map: rose, roughness: 0.62, envMapIntensity: 0.4 }),
      slot: new THREE.MeshStandardMaterial({ color: 0x3a1a12, roughness: 0.8 }),
      gold: new THREE.MeshStandardMaterial({ color: 0xd9a84e, metalness: 1, roughness: 0.28 }),
      fret: new THREE.MeshStandardMaterial({ color: 0xd8b56a, metalness: 1, roughness: 0.3 }),
      bone: new THREE.MeshStandardMaterial({ color: 0xefe6d2, roughness: 0.42 }),
      bush: new THREE.MeshStandardMaterial({ color: 0xf2ece0, roughness: 0.5 }),
      key: new THREE.MeshPhysicalMaterial({ color: 0x0f0d0c, roughness: 0.32, clearcoat: 1, clearcoatRoughness: 0.18 }),
    };
  }

  build() {
    const M = this.M = this.mats();
    const add = (geo, mat, x = 0, y = 0, z = 0, parent = this.model) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); parent.add(m); return m; };

    // rails
    for (const s of [-1, 1]) add(new THREE.BoxGeometry(RAIL_W, RAIL_H, D), M.maple, s * RAIL_X, RAIL_Y, 0);

    // cap block with mahogany stripe
    const capShape = new THREE.Shape();
    const cw = 104, ch = 80, cr = 11;
    capShape.moveTo(-cw / 2 + cr, -ch / 2); capShape.lineTo(cw / 2 - cr, -ch / 2); capShape.quadraticCurveTo(cw / 2, -ch / 2, cw / 2, -ch / 2 + cr);
    capShape.lineTo(cw / 2, ch / 2 - cr); capShape.quadraticCurveTo(cw / 2, ch / 2, cw / 2 - cr, ch / 2); capShape.lineTo(-cw / 2 + cr, ch / 2);
    capShape.quadraticCurveTo(-cw / 2, ch / 2, -cw / 2, ch / 2 - cr); capShape.lineTo(-cw / 2, -ch / 2 + cr); capShape.quadraticCurveTo(-cw / 2, -ch / 2, -cw / 2 + cr, -ch / 2);
    const cap = add(new THREE.ExtrudeGeometry(capShape, { depth: 26, bevelEnabled: true, bevelThickness: 2, bevelSize: 2, bevelSegments: 3, curveSegments: 10 }), M.capMaple, 0, 142, -13);
    cap.geometry.computeVertexNormals();
    add(new THREE.BoxGeometry(30, 84.4, 30.4), M.mahog, 0, 142, 0);

    // throat with shoulders and the slot running into it
    const T = new THREE.Shape();
    const P = (x, y) => [x - 150, 200 - y];
    const mv = (x, y) => T.moveTo(...P(x, y)), ln = (x, y) => T.lineTo(...P(x, y));
    const bz = (a, b, c, d, e, f) => T.bezierCurveTo(...P(a, b), ...P(c, d), ...P(e, f));
    mv(96, 300); bz(90, 304, 90, 314, 98, 318); bz(104, 322, 106, 330, 108, 344); ln(110, 358);
    ln(190, 358); ln(192, 344); bz(194, 330, 196, 322, 202, 318); bz(210, 314, 210, 304, 204, 300); ln(96, 300);
    const hole = new THREE.Path(); hole.moveTo(-SLOT_HALF, -100); hole.lineTo(SLOT_HALF, -100); hole.lineTo(SLOT_HALF - 1, -128); hole.lineTo(-SLOT_HALF + 1, -128); hole.lineTo(-SLOT_HALF, -100);
    T.holes.push(hole);
    const throat = add(new THREE.ExtrudeGeometry(T, { depth: D - 3, bevelEnabled: true, bevelThickness: 1.5, bevelSize: 1.5, bevelSegments: 2, curveSegments: 14 }), M.throat, 0, 0, -(D - 3) / 2);
    throat.geometry.computeVertexNormals();
    const ramp = add(new THREE.BoxGeometry(SLOT_HALF * 2 - 2, 36, 3), M.slot, 0, -114, 0); ramp.rotation.x = -0.62;

    // neck: rounded back + fingerboard + frets + nut
    const neckBack = add(new THREE.CylinderGeometry(42, 40, NECK_LEN, 40, 1, true, Math.PI / 2, Math.PI), M.mahog, 0, NUT_Y - NECK_LEN / 2, 9);
    neckBack.scale.z = 0.62;
    const endCap = add(new THREE.CircleGeometry(40, 32, Math.PI, Math.PI), M.mahog, 0, NUT_Y - NECK_LEN, 9);
    endCap.rotation.x = Math.PI / 2; endCap.scale.y = 0.62; endCap.material = M.mahog;
    add(new THREE.BoxGeometry(84, NECK_LEN, 6), M.rose, 0, NUT_Y - NECK_LEN / 2, 12);
    for (const n of FRETS) {
      const y = NUT_Y - 4 - FRET_SCALE * (1 - Math.pow(2, -n / 12));
      const f = add(new THREE.CylinderGeometry(0.9, 0.9, 82, 8), M.fret, 0, y, 15.2); f.rotation.z = Math.PI / 2;
    }
    add(new THREE.BoxGeometry(86, 8, 9), M.bone, 0, NUT_Y, 16);

    // rollers + bushings
    this.rollers = ROLLER_Y.map((y) => {
      const r = add(new THREE.CylinderGeometry(3.8, 3.8, SLOT_HALF * 2 + 6, 20), M.gold, 0, y, 0); r.rotation.z = Math.PI / 2;
      for (const s of [-1, 1]) { const b = add(new THREE.CylinderGeometry(6, 6, 3, 20), M.bush, s * (SLOT_HALF - 1.5), y, 0); b.rotation.z = Math.PI / 2; }
      return r;
    });

    // tuners
    this.keys = []; this.rings = []; this.labels = [];
    ROLLER_Y.forEach((y, i) => {
      const s = SIDE[i], ex = s * (RAIL_X + RAIL_W / 2);
      const g = new THREE.Group(); g.position.set(ex, y, 0); this.model.add(g);
      add(new THREE.BoxGeometry(2, 34, 20), M.gold, s * 1, 0, 0, g);
      const hsg = add(new THREE.CylinderGeometry(8.5, 8.5, 9, 24), M.gold, s * 7, 0, 2, g); hsg.rotation.z = Math.PI / 2;
      const capc = add(new THREE.CylinderGeometry(4.2, 4.2, 3, 20), M.gold, s * 7, 0, 11, g); capc.rotation.x = Math.PI / 2;
      const shaft = add(new THREE.CylinderGeometry(2.6, 2.6, 14, 12), M.gold, s * 17, 0, 2, g); shaft.rotation.z = Math.PI / 2;
      const kmat = M.key.clone();
      const key = add(new THREE.SphereGeometry(1, 32, 20), kmat, s * 46, 0, 2, g);
      key.scale.set(23, 19, 6.5);
      key.userData.string = i;
      const hit = add(new THREE.SphereGeometry(1, 10, 8), new THREE.MeshBasicMaterial({ visible: false }), s * 42, 0, 2, g);
      hit.scale.set(36, 28, 18); hit.userData.string = i;
      const ring = add(new THREE.TorusGeometry(31, 1.3, 10, 64), new THREE.MeshBasicMaterial({ color: 0xd4a655, transparent: true, opacity: 0 }), s * 46, 0, 2, g);
      ring.scale.y = 0.82;
      const lbl = labelSprite(this.state.labels[i]); lbl.position.set(s * 46, 0, 10); g.add(lbl);
      this.keys.push(key); this.rings.push(ring); this.labels.push(lbl);
      this.hits = (this.hits || []).concat(hit, key);
    });

    // strings: head segment (nut → roller) + neck segment
    this.strings = [0, 1, 2].map((i) => {
      const mat = new THREE.MeshPhysicalMaterial({ color: 0xeee8dc, metalness: 0, roughness: 0.3, clearcoat: 0.6, clearcoatRoughness: 0.25, sheen: 0.4, emissive: 0x000000 });
      const a = new THREE.Vector3(NUT_X[i], NUT_Y + 3, 21), b = new THREE.Vector3(WRAP_X[i], ROLLER_Y[i], 4.6);
      const seg = (p, q) => {
        const len = p.distanceTo(q);
        const m = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 1.05, len, 10), mat);
        m.position.copy(p).add(q).multiplyScalar(0.5);
        m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), q.clone().sub(p).normalize());
        this.model.add(m); return m;
      };
      seg(a, b);
      const neck = seg(new THREE.Vector3(NUT_X[i], NUT_Y + 3, 21), new THREE.Vector3(END_X[i], NUT_Y - NECK_LEN + 6, 19));
      return { mat, neck, baseX: NUT_X[i] };
    });

    this.model.position.y = 70;   // pivot sits between the rollers and the nut
  }

  bind() {
    const c = this.canvas;
    const pts = new Map();
    let downAt = 0, moved = 0, lastTap = 0, pinch0 = 0, zoom0 = 1;
    c.addEventListener('pointerdown', (e) => {
      c.setPointerCapture(e.pointerId);
      pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pts.size === 1) { downAt = performance.now(); moved = 0; }
      if (pts.size === 2) { const [p, q] = [...pts.values()]; pinch0 = Math.hypot(p.x - q.x, p.y - q.y); zoom0 = this.zoom; }
      this.vy = this.vp = 0; this.target.yaw = this.target.pitch = this.target.zoom = null;
      this.kick();
    });
    c.addEventListener('pointermove', (e) => {
      const p = pts.get(e.pointerId); if (!p) return;
      const dx = e.clientX - p.x, dy = e.clientY - p.y;
      p.x = e.clientX; p.y = e.clientY;
      if (pts.size === 1) {
        moved += Math.abs(dx) + Math.abs(dy);
        this.yaw += dx * 0.0095; this.pitch = Math.max(-1.3, Math.min(1.3, this.pitch + dy * 0.007));
        this.vy = dx * 0.0095; this.vp = dy * 0.007;
      } else if (pts.size === 2) {
        const [a, b] = [...pts.values()]; const d = Math.hypot(a.x - b.x, a.y - b.y);
        this.zoom = Math.max(0.55, Math.min(2.6, zoom0 * (d / (pinch0 || d))));
        moved += 10;
      }
      this.kick();
    });
    const up = (e) => {
      if (!pts.has(e.pointerId)) return;
      pts.delete(e.pointerId);
      if (pts.size) return;
      const now = performance.now();
      if (moved < 8 && now - downAt < 450) {
        if (now - lastTap < 320) { this.reset(); lastTap = 0; return; }
        lastTap = now;
        this.pick(e);
      }
    };
    c.addEventListener('pointerup', up);
    c.addEventListener('pointercancel', up);
    c.addEventListener('wheel', (e) => { e.preventDefault(); this.zoom = Math.max(0.55, Math.min(2.6, this.zoom * Math.exp(-e.deltaY * 0.0015))); this.kick(); }, { passive: false });
    this.ro = new ResizeObserver(() => { this.resize(); this.kick(); });
    this.ro.observe(c);
  }

  pick(e) {
    const r = this.canvas.getBoundingClientRect();
    const v = new THREE.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    const rc = new THREE.Raycaster(); rc.setFromCamera(v, this.camera);
    const hit = rc.intersectObjects(this.hits, false)[0];
    if (hit && this.onPick) this.onPick(hit.object.userData.string);
  }

  reset() { this.target = { yaw: -0.42, pitch: 0.1, zoom: 1 }; this.vy = this.vp = 0; this.kick(); }

  resize() {
    const w = this.canvas.clientWidth, h = this.canvas.clientHeight;
    if (!w || !h) return;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h; this.camera.updateProjectionMatrix();
  }

  /** Live state from the tuner. */
  sync({ active, done, level, labels }) {
    const st = this.state;
    st.active = active; st.done = done.slice(); st.level = level || 0;
    if (labels) st.labels = labels;
    this.keys.forEach((k, i) => {
      const on = i === active;
      k.material.emissive.setHex(on ? 0x1c1206 : 0x000000);
      const ring = this.rings[i];
      ring.material.color.setHex(done[i] && !on ? 0x8cc084 : 0xd4a655);
      ring.material.opacity = on ? 0.95 : done[i] ? 0.7 : 0;
      drawLabel(this.labels[i], st.labels[i], on ? '#efd092' : done[i] ? '#b8e0b0' : '#f2e9da');
    });
    this.strings.forEach((s, i) => s.mat.emissive.setHex(i === active ? 0x5a3a0a : 0x000000));
    this.kick();
  }

  kick() { this.dirty = true; if (this.running && !this.raf) this.raf = requestAnimationFrame((t) => this.frame(t)); }
  start() { this.running = true; this.resize(); this.kick(); }
  stop() { this.running = false; if (this.raf) cancelAnimationFrame(this.raf); this.raf = 0; }

  frame(t) {
    this.raf = 0;
    const dt = this.lastT ? Math.min(0.05, (t - this.lastT) / 1000) : 1 / 60; this.lastT = t;
    this.t += dt;
    let busy = false;
    // inertia
    if (Math.abs(this.vy) > 1e-4 || Math.abs(this.vp) > 1e-4) {
      this.yaw += this.vy; this.pitch = Math.max(-1.3, Math.min(1.3, this.pitch + this.vp));
      this.vy *= 0.92; this.vp *= 0.88; busy = true;
    }
    // reset animation (shortest way round)
    if (this.target.yaw != null) {
      const tw = this.target.yaw + Math.round((this.yaw - this.target.yaw) / (2 * Math.PI)) * 2 * Math.PI;
      this.yaw += (tw - this.yaw) * 0.14; this.pitch += (this.target.pitch - this.pitch) * 0.14; this.zoom += (this.target.zoom - this.zoom) * 0.14;
      if (Math.abs(tw - this.yaw) + Math.abs(this.target.pitch - this.pitch) + Math.abs(this.target.zoom - this.zoom) < 0.002) this.target = { yaw: null, pitch: null, zoom: null };
      busy = true;
    }
    // vibrating active string (real signal level)
    const lv = this.state.level;
    this.strings.forEach((s, i) => {
      const a = i === this.state.active ? lv : 0;
      s.neck.position.x = s.baseX + (a > 0.01 ? Math.sin(this.t * 2 * Math.PI * 13) * a * 0.7 : 0);
      if (a > 0.01) busy = true;
    });
    this.pivot.rotation.set(this.pitch, this.yaw, 0, 'YXZ');
    // fit ~330 units across (tuner keys) and ~600 units tall (head + upper neck)
    const tan = Math.tan(THREE.MathUtils.degToRad(this.camera.fov / 2));
    const fit = Math.max(600 / (2 * tan), 330 / (2 * tan * this.camera.aspect));
    const dist = fit / this.zoom;
    this.camera.position.set(0, 0, dist); this.camera.lookAt(0, 0, 0);
    this.renderer.render(this.scene, this.camera);
    this.dirty = false;
    if (busy && this.running) this.kick(); else this.lastT = 0;
  }
}
