/* =====================================================================
   Panduri neck — the main teaching visual of the practice screen.
   The teacher's instrument as the player sees it (nut on the left, E on
   top, A at the bottom; mirrored for left-handed players): the start of
   the oak headstock with its open slot and rollers, the WHOLE red-brown
   fingerboard with every fret (pale brass wire, yellow dots), its tongue
   on the pale soundboard and the body's shoulders.
   There is NO hand: where to press is shown by a fingertip marker
   (finger colour + number) on the string × fret contact point.

   Along the strings the proportions are true (fret positions from the
   instrument profile); across the strings the board is drawn wider than
   life, so three strings and the fingertips read on a phone.
   Marker life: approach → touch → press → hold → (correct) confirm → fade.
   The instrument is painted once into a bitmap per size; every frame only
   blits it and draws strings, labels and markers (cheap, 60 fps on phones).
   ===================================================================== */
PD.i18n.add({ 'nk.fret': ['{n} ლადი', 'fret {n}'], 'nk.open': ['0 · ღია სიმი', '0 · open string'] });
PD.Neck = function (canvas, opt) {
  opt = opt || {};
  const ctx = canvas.getContext('2d');
  const self = { mirror: false, sticky: !!opt.sticky };
  const G = { W: 1, H: 1, k: 1, ky: 3, xNut: 60, yMid: 60, boardH: 100, yNum: 120, head: 60 };
  let dpr = 1, bmp = null;
  const strings = { 1: { amp: 0, ph: 0, stop: 0 }, 2: { amp: 0, ph: 0, stop: 0 }, 3: { amp: 0, ph: 0, stop: 0 } };
  let markers = [], ghosts = [], openGlow = {}, callout = null, lastT = performance.now();
  const g = () => PD.geom.g, P = () => PD.instrument.profile, NF = () => P().frets.count;
  const clamp = (x, a, b) => x < a ? a : x > b ? b : x;
  const easeOut = x => 1 - Math.pow(1 - clamp(x, 0, 1), 3);
  const smooth = x => { x = clamp(x, 0, 1); return x * x * (3 - 2 * x); };
  const now = () => performance.now();
  const offInst = PD.bus.on('instrument', () => { bmp = null; });

  /* ---------------- layout ---------------- */
  let EX = 2.4, EXMAX = 2.8;   // across-the-strings enlargement (relative to the true scale along the strings); up to EXMAX when the screen has room
  const TAIL = 34;     // mm of soundboard shown past the end of the fingerboard
  const FLARE = 4;     // mm the tongue widens toward the E side on the soundboard
  const PAD = 4, NUMH = 20, GAP = 7;
  const fbDims = () => P().fingerboard || { nutHalfMm: 15, joinHalfMm: 18 };
  const HALF = () => fbDims().joinHalfMm + 1;
  const headPx = W => Math.round(G.vert ? clamp(W * .1, 46, 76) : clamp(W * .15, 58, 170));
  const kFor = W => Math.max(.2, (W - 2 * PAD - headPx(W)) / (g().FE + TAIL));
  const boardPx = (W, ex) => clamp(kFor(W) * (ex || EX) * 2 * HALF(), 92, 210);
  const hAt = ky => Math.round(8 + (2 * HALF() + FLARE) * ky + GAP + NUMH + 6);
  /** the height this view needs at a given width (its box can be sized with it); with room (maxH) the board may grow a little */
  function natH(W, maxH, vert) { const pv = G.vert, pe = [EX, EXMAX]; setVert(!!vert); try { return natH0(W, maxH); } finally { G.vert = pv; EX = pe[0]; EXMAX = pe[1]; } }
  function setVert(v) { G.vert = v; EX = v ? 1.65 : 2.4; EXMAX = v ? 1.9 : 2.8; }
  function natH0(W, maxH) { const lo = hAt(boardPx(W) / (2 * HALF())), hi = hAt(boardPx(W, EXMAX) / (2 * HALF())); return maxH ? Math.round(clamp(maxH, lo, hi)) : lo; }
  function layout() {
    const r = canvas.getBoundingClientRect(); if (r.width < 4 || r.height < 4) return false;
    const q = PD.store.get('quality', 'auto');
    dpr = Math.min(q === 'low' ? 1 : q === 'medium' ? 1.5 : q === 'ultra' ? 3 : q === 'high' ? 2 : PD.device && PD.device.low ? 1.5 : 2, window.devicePixelRatio || 1);
    canvas.width = Math.round(r.width * dpr); canvas.height = Math.round(r.height * dpr);
    // a tall box (portrait phone): the neck stands upright, nut at the top, along the screen's long side
    setVert(r.height > r.width * 1.2);
    const W = G.W = G.vert ? r.height : r.width, H = G.H = G.vert ? r.width : r.height;
    G.head = headPx(W); G.k = kFor(W); G.xNut = PAD + G.head;
    const want = boardPx(W, EXMAX) / (2 * HALF()), room = (H - 14 - GAP - NUMH) / (2 * HALF() + FLARE);
    G.ky = Math.max(1.2, Math.min(want, room));
    G.boardH = 2 * HALF() * G.ky;
    const block = (2 * HALF() + FLARE) * G.ky + GAP + NUMH, top = Math.max(4, (H - block) / 2);
    G.yMid = top + (HALF() + FLARE) * G.ky; G.yNum = G.yMid + HALF() * G.ky + GAP + NUMH / 2;
    bmp = null;
    return true;
  }
  // u = mm from the nut along the strings → x px ; v = mm across (E side negative) → y px
  const X0 = u => G.xNut + u * G.k;
  const MIR = () => self.mirror && !G.vert;   // upright, the left-handed view flips across instead (see draw)
  const X = u => MIR() ? G.W - X0(u) : X0(u);
  const V = v => G.yMid + v * G.ky;
  const Y = (s, u) => V(g().stringV(s, u == null ? 0 : u));
  const contactU = f => g().contactU(f);
  const baseHalf = u => { const f = fbDims(); return f.nutHalfMm + (f.joinHalfMm - f.nutHalfMm) * clamp(u / g().J, 0, 1); };
  const tongue0 = () => g().J - 16;
  /** fingerboard edges (mm): the tongue on the soundboard widens toward the E side, as on the teacher's instrument */
  const topV = u => -(baseHalf(u) + FLARE * smooth((u - tongue0()) / Math.max(4, (g().FE - 4 - tongue0()))));
  const botV = u => baseHalf(u);
  const uRight = () => (G.W - G.xNut) / G.k;

  /* ---------------- the instrument (cached bitmap, the whole visible view) ---------------- */
  function rng(seed) { return () => (seed = (seed * 16807) % 2147483647) / 2147483647; }
  function buildBitmap() {
    const c = document.createElement('canvas'); c.width = Math.max(1, Math.round(G.W * dpr)); c.height = Math.max(1, Math.round(G.H * dpr));
    const x = c.getContext('2d'); x.scale(dpr, dpr);
    const G0 = g(), J = G0.J, FE = G0.FE, k = G.k, R = rng(11), uR = uRight() + 4, uL = -G.head / k - 4;
    const hs = G0.head, HH = hs.half, endU = -hs.len;
    const bodyEdge = u => HALF() * G.ky * 1.04 + Math.max(0, G0.bodyHalf(u) - G0.bodyHalf(J)) * k;   // px from the centre line: the shoulders at their true slope
    // silhouettes
    const headPath = () => { const r = Math.min(HH, 9); x.beginPath(); x.moveTo(X0(-3), V(-HH)); x.lineTo(X0(endU + r), V(-HH)); x.ellipse(X0(endU + r), V(0), r * k, HH * G.ky, 0, -Math.PI / 2, Math.PI / 2, true); x.lineTo(X0(-3), V(HH)); x.closePath(); };
    const boardPath = () => {
      x.beginPath(); x.moveTo(X0(0), V(topV(0)));
      for (let u = 2; u <= FE - 6; u += 2) x.lineTo(X0(u), V(topV(u)));
      const tt = V(topV(FE - 6)), bb = V(botV(FE - 2));
      x.bezierCurveTo(X0(FE + 2), tt, X0(FE + 1.2), bb - (bb - tt) * .2, X0(FE - 2.5), bb);
      for (let u = FE - 4; u >= 0; u -= 2) x.lineTo(X0(u), V(botV(u)));
      x.lineTo(X0(0), V(botV(0))); x.closePath();
    };
    const bodyPath = () => {
      x.beginPath(); x.moveTo(X0(J - 2), G.yMid - HALF() * G.ky * 1.04);
      for (let u = J; u <= uR; u += 2) x.lineTo(X0(u), G.yMid - bodyEdge(u));
      for (let u = uR; u >= J; u -= 2) x.lineTo(X0(u), G.yMid + bodyEdge(u));
      x.lineTo(X0(J - 2), G.yMid + HALF() * G.ky * 1.04); x.closePath();
    };
    // 1 soft shadow under the whole instrument
    x.save(); x.shadowColor = 'rgba(0,0,0,.6)'; x.shadowBlur = 14 * dpr; x.shadowOffsetY = 6 * dpr; x.fillStyle = '#1A0F08';
    bodyPath(); x.fill(); headPath(); x.fill(); boardPath(); x.fill(); x.restore();

    // 2 soundboard: pale spruce, straight grain along the instrument, darker near the tongue
    bodyPath(); let gr = x.createLinearGradient(0, G.yMid - 160, 0, G.yMid + 160);
    gr.addColorStop(0, '#D9BC8A'); gr.addColorStop(.5, '#E8D2A4'); gr.addColorStop(1, '#CFAF7C'); x.fillStyle = gr; x.fill();
    x.save(); bodyPath(); x.clip();
    for (let i = 0; i < 70; i++) { const v = G.yMid + (R() - .5) * 2 * Math.min(G.H, 400); x.strokeStyle = 'rgba(150,104,52,' + (.07 + R() * .16).toFixed(3) + ')'; x.lineWidth = .5 + R() * .9; x.beginPath(); x.moveTo(X0(J - 4), v); x.lineTo(X0(uR), v + (R() - .5) * 1.2); x.stroke(); }
    gr = x.createRadialGradient(X0(FE), G.yMid, 4, X0(FE), G.yMid, 90 + G.boardH * .5); gr.addColorStop(0, 'rgba(70,40,15,.28)'); gr.addColorStop(1, 'rgba(70,40,15,0)'); x.fillStyle = gr; x.fillRect(X0(J - 4), 0, X0(uR) - X0(J - 4), G.H);
    x.restore();
    x.lineWidth = 1.6; x.strokeStyle = 'rgba(52,30,16,.85)';   // the body's edge (dark sides seen from the front)
    [-1, 1].forEach(sd => { x.beginPath(); for (let u = J; u <= uR; u += 2) { const y = G.yMid + sd * bodyEdge(u); u === J ? x.moveTo(X0(u), y) : x.lineTo(X0(u), y); } x.stroke(); });

    // 3 headstock: light oak, an open slot with three rollers, geared tuners (2 on the A side, 1 on the E side)
    headPath(); gr = x.createLinearGradient(0, V(-HH), 0, V(HH)); gr.addColorStop(0, '#E4C391'); gr.addColorStop(.45, '#D3AE7B'); gr.addColorStop(1, '#AE8457'); x.fillStyle = gr; x.fill();
    x.save(); headPath(); x.clip();
    for (let i = 0; i < 46; i++) { const v = V(-HH) + R() * 2 * HH * G.ky, ph = R() * 6; x.strokeStyle = R() < .3 ? 'rgba(255,236,200,.18)' : 'rgba(120,78,40,' + (.1 + R() * .2).toFixed(3) + ')'; x.lineWidth = .5 + R() * 1.2; x.beginPath(); for (let u = endU; u <= 0; u += 6) x.lineTo(X0(u), v + Math.sin(u * .05 + ph) * 1.4); x.stroke(); }
    for (let i = 0; i < 70; i++) { x.fillStyle = 'rgba(255,240,210,' + (.08 + R() * .14).toFixed(3) + ')'; x.fillRect(X0(endU + R() * (-endU)), V(-HH) + R() * 2 * HH * G.ky, 1.5 + R() * 4, .8); }
    x.restore();
    const sl = hs.slot, sh = hs.slotHalf, ra = Math.min(8, (sl[1] - sl[0]) / 2);
    const slotPath = () => { x.beginPath(); x.moveTo(X0(-sl[0] - ra), V(-sh)); x.lineTo(X0(-sl[1] + ra), V(-sh)); x.ellipse(X0(-sl[1] + ra), V(0), ra * k, sh * G.ky, 0, -Math.PI / 2, Math.PI / 2, true); x.lineTo(X0(-sl[0] - ra), V(sh)); x.ellipse(X0(-sl[0] - ra), V(0), ra * k, sh * G.ky, 0, Math.PI / 2, -Math.PI / 2, true); x.closePath(); };
    slotPath(); gr = x.createLinearGradient(0, V(-sh), 0, V(sh)); gr.addColorStop(0, '#060302'); gr.addColorStop(.5, '#140B06'); gr.addColorStop(1, '#2A190E'); x.fillStyle = gr; x.fill();
    x.lineWidth = 1.2; x.strokeStyle = 'rgba(60,34,16,.9)'; x.stroke();
    // rollers across the slot, each with its string's turns and its tuner on the side of the head
    const metal = (x0, x1) => { const m = x.createLinearGradient(x0, 0, x1, 0); m.addColorStop(0, '#5E5A55'); m.addColorStop(.38, '#EEEAE2'); m.addColorStop(.62, '#A9A398'); m.addColorStop(1, '#4E4A45'); return m; };
    const sc = clamp(Math.sqrt(k * G.ky) / 1.6, .8, 2.2);
    [1, 2, 3].forEach(s => {
      const u = -hs.posts[s], cx = X0(u), rw = Math.max(3, 4.2 * k), top = hs.side[s] === 'E';
      x.fillStyle = metal(cx - rw / 2, cx + rw / 2); x.fillRect(cx - rw / 2, V(-sh) - 1, rw, (2 * sh) * G.ky + 2);
      x.fillStyle = 'rgba(0,0,0,.28)'; for (let y = V(-sh) + 2; y < V(sh); y += 2.4) x.fillRect(cx - rw / 2, y, rw, .7);
      const wv = (2 - s) * 2.2;   // where the string winds on its roller
      x.fillStyle = 'rgba(244,236,220,.9)'; x.fillRect(cx - rw / 2 - .5, V(wv) - 2.2 * sc, rw + 1, 4.4 * sc);
      // tuner: gear housing just outside the edge and a cream paddle key beyond it
      const ey = top ? V(-HH) : V(HH), d = top ? -1 : 1, hw = Math.max(9, 12 * k), hh = 5 * sc;
      x.fillStyle = metal(cx - hw / 2, cx + hw / 2); x.beginPath(); x.roundRect ? x.roundRect(cx - hw / 2, top ? ey - hh : ey, hw, hh, 2) : x.rect(cx - hw / 2, top ? ey - hh : ey, hw, hh); x.fill();
      x.fillStyle = 'rgba(0,0,0,.35)'; x.fillRect(cx - hw / 2, top ? ey - 1 : ey, hw, 1);
      x.fillStyle = metal(cx - 1.6 * sc, cx + 1.6 * sc); x.fillRect(cx - 1.6 * sc, ey + d * hh, 3.2 * sc, d * 4 * sc);
      const ky0 = ey + d * (hh + 4 * sc + 5.5 * sc); gr = x.createRadialGradient(cx - 2 * sc, ky0 - 2 * sc, 1, cx, ky0, 9 * sc); gr.addColorStop(0, '#FFF8EA'); gr.addColorStop(.7, '#E9DFC9'); gr.addColorStop(1, '#BDB29C');
      x.fillStyle = gr; x.beginPath(); x.ellipse(cx, ky0, Math.max(6, 7.5 * sc), 5.5 * sc, 0, 0, 7); x.fill(); x.strokeStyle = 'rgba(0,0,0,.25)'; x.lineWidth = 1; x.stroke();
    });
    // strings from the nut into the slot, each to its roller (static; the playing length is drawn live)
    [1, 2, 3].forEach(s => {
      const wv = (2 - s) * 2.2, u1 = -hs.posts[s];
      x.strokeStyle = 'rgba(0,0,0,.35)'; x.lineWidth = 1.8; x.beginPath(); x.moveTo(X0(-3), Y(s, 0) + 2); x.quadraticCurveTo(X0(-sl[0]), V(wv * 1.6) + 2, X0(u1), V(wv) + 2); x.stroke();
      x.strokeStyle = 'rgba(244,236,220,.82)'; x.lineWidth = s === 1 ? 1.9 : s === 2 ? 1.7 : 1.5; x.beginPath(); x.moveTo(X0(-3), Y(s, 0)); x.quadraticCurveTo(X0(-sl[0]), V(wv * 1.6), X0(u1), V(wv)); x.stroke();
    });

    // 4 fingerboard: red-brown, fine straight grain and pores, a satin sheen; its tongue lies on the soundboard
    x.save(); x.shadowColor = 'rgba(30,14,4,.55)'; x.shadowBlur = 5 * dpr; x.shadowOffsetY = 1.5 * dpr; boardPath(); x.fillStyle = '#6E3F24'; x.fill(); x.restore();
    boardPath(); gr = x.createLinearGradient(0, V(-HALF()), 0, V(HALF()));
    gr.addColorStop(0, '#88543A'); gr.addColorStop(.3, '#7A472B'); gr.addColorStop(.7, '#6D3D23'); gr.addColorStop(1, '#58301B'); x.fillStyle = gr; x.fill();
    x.save(); boardPath(); x.clip();
    const bt = V(-HALF() - FLARE), bb = V(HALF());
    for (let i = 0; i < 300; i++) {
      const v = bt + R() * (bb - bt), light = R() < .22, ph = R() * 6;
      x.strokeStyle = light ? 'rgba(172,112,74,' + (.08 + R() * .14).toFixed(3) + ')' : 'rgba(44,18,6,' + (.08 + R() * .2).toFixed(3) + ')';
      x.lineWidth = .35 + R() * (light ? 1.1 : .9); x.beginPath();
      for (let u = -2; u <= FE + 4; u += 10) x.lineTo(X0(u), v + Math.sin(u * .02 + ph) * .7);
      x.stroke();
    }
    for (let i = 0; i < 1800; i++) { const u = R() * FE, v = V(topV(u)) + R() * (V(botV(u)) - V(topV(u))); x.fillStyle = 'rgba(30,10,2,' + (.2 + R() * .3).toFixed(3) + ')'; x.fillRect(X0(u), v, .8 + R() * 2.4, .5); }
    gr = x.createLinearGradient(0, V(-HALF()), 0, V(HALF())); gr.addColorStop(0, 'rgba(255,214,170,0)'); gr.addColorStop(.18, 'rgba(255,214,170,.09)'); gr.addColorStop(.36, 'rgba(255,214,170,0)'); x.fillStyle = gr; x.fillRect(0, 0, G.W, G.H);
    x.restore();
    x.lineWidth = 1; x.strokeStyle = 'rgba(255,214,176,.28)'; x.beginPath(); for (let u = 0; u <= FE - 6; u += 3) x.lineTo(X0(u), V(topV(u)) + .5); x.stroke();
    x.strokeStyle = 'rgba(20,8,2,.7)'; x.beginPath(); for (let u = 0; u <= FE - 3; u += 3) x.lineTo(X0(u), V(botV(u)) - .5); x.stroke();

    // 5 inlays: yellow dots (single under the middle string, the double one between the strings)
    const mk = G0.markers || { single: [3, 5, 7, 9, 15], double: [12] }, ir = clamp(Math.sqrt(k * G.ky) * 2.1, 2.6, 6.5);
    const dot = (cx, cy) => { const pg = x.createRadialGradient(cx - ir * .3, cy - ir * .35, ir * .1, cx, cy, ir); pg.addColorStop(0, '#FFF1A6'); pg.addColorStop(.55, '#F2CE3A'); pg.addColorStop(1, '#C99A1C');
      x.fillStyle = 'rgba(0,0,0,.35)'; x.beginPath(); x.arc(cx, cy + .7, ir + .6, 0, 7); x.fill(); x.fillStyle = pg; x.beginPath(); x.arc(cx, cy, ir, 0, 7); x.fill(); };
    const cellMid = n => (G0.fretMm(n - 1) + G0.fretMm(n)) / 2;
    (mk.single || []).filter(n => n <= NF()).forEach(n => dot(X0(cellMid(n)), V(0)));
    (mk.double || []).filter(n => n <= NF()).forEach(n => { const u = cellMid(n), d = G0.spacing(u) / 2 * .58; dot(X0(u), V(-d)); dot(X0(u), V(d)); });

    // 6 frets: flat pale-brass wire, a thin shadow on the body side
    const fw = clamp(2.3 * k, 2, 4.6);
    for (let n = 1; n <= NF(); n++) {
      const u = G0.fretMm(n), xx = X0(u), t0 = V(topV(u)) + .6, b0 = V(botV(u)) - .6;
      x.fillStyle = 'rgba(20,8,2,.5)'; x.fillRect(xx + fw / 2, t0, Math.max(1, fw * .45), b0 - t0);
      const fg = x.createLinearGradient(xx - fw / 2, 0, xx + fw / 2, 0); fg.addColorStop(0, '#9C8052'); fg.addColorStop(.38, '#F6E3B4'); fg.addColorStop(.7, '#DDBF86'); fg.addColorStop(1, '#A4875A');
      x.fillStyle = fg; x.fillRect(xx - fw / 2, t0, fw, b0 - t0);
      const vg = x.createLinearGradient(0, t0, 0, b0); vg.addColorStop(0, 'rgba(255,255,255,.3)'); vg.addColorStop(.3, 'rgba(255,255,255,0)'); vg.addColorStop(.85, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,.3)');
      x.fillStyle = vg; x.fillRect(xx - fw / 2, t0, fw, b0 - t0);
    }
    // 7 nut: bone, with a dark seam toward the head and the three string slots
    const nw = Math.max(3, 3.6 * k), nt = V(-baseHalf(0) - .6), nb = V(baseHalf(0) + .6);
    x.fillStyle = 'rgba(40,20,8,.75)'; x.fillRect(X0(0) - nw - 1.6, nt, 1.6, nb - nt);
    gr = x.createLinearGradient(X0(0) - nw, 0, X0(0), 0); gr.addColorStop(0, '#CDBB98'); gr.addColorStop(.45, '#F5ECDA'); gr.addColorStop(1, '#D9C8A6');
    x.fillStyle = gr; x.fillRect(X0(0) - nw, nt, nw, nb - nt);
    [1, 2, 3].forEach(s => { x.fillStyle = 'rgba(80,58,36,.6)'; x.fillRect(X0(0) - nw, Y(s, 0) - 1, nw, 2); });

    // 8 both ends fade out (the instrument goes on past the frame)
    x.save(); x.globalCompositeOperation = 'destination-out';
    gr = x.createLinearGradient(0, 0, G.head * .62, 0); gr.addColorStop(0, 'rgba(0,0,0,1)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = gr; x.fillRect(0, 0, G.head * .62, G.H);
    gr = x.createLinearGradient(G.W - 26, 0, G.W, 0); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(0,0,0,1)'); x.fillStyle = gr; x.fillRect(G.W - 26, 0, 26, G.H);
    x.restore();
    bmp = c;
  }

  /* ---------------- teaching state ---------------- */
  const fcol = fi => PD.fingers.on && fi ? PD.fingers.color(fi) : '#ECE9E3';
  const fink = fi => PD.fingers.on && fi ? PD.fingers.ink(fi) : '#121317';
  /** notes: [{s, f, fi}] — the place(s) to press now; next: the following step (ghosted) */
  let sig = '';
  function setTarget(notes, next) {
    const t = now(), sg = (notes || []).map(n => n.s + ':' + n.f + ':' + (n.fi || 0)).join('|');
    ghosts = (next || []).filter(n => n.f > 0 && !(notes || []).some(m => m.s === n.s && m.f === n.f)).map(n => ({ s: n.s, f: n.f, fi: n.fi || 0, t }));
    if (self.sticky && sg && sg === sig && markers.some(m => m.state !== 'leave')) return;   // the same shape again (e.g. strokes of one chord): keep it in place
    sig = sg;
    markers.forEach(m => { if (m.state !== 'confirm') { m.state = 'leave'; m.t = t; } });
    openGlow = {};
    // one note: the same words as the prompt above, written on the neck itself (which string · which fret / open)
    callout = notes && notes.length === 1 ? { s: notes[0].s, f: notes[0].f || 0, t } : null;
    // one finger on several strings at the same fret = a barre (drawn as one bar across those strings)
    const groups = {};
    (notes || []).forEach(n => { if (n.f > 0 && n.fi) (groups[n.fi + ':' + n.f] = groups[n.fi + ':' + n.f] || []).push(n); });
    (notes || []).forEach(n => {
      if (n.f > 0) {
        const gr = n.fi ? groups[n.fi + ':' + n.f] : null;
        if (gr && gr.length > 1) { if (gr[0] !== n) return; const ss = gr.map(x => x.s); markers.push({ s: Math.min(...ss), s2: Math.max(...ss), f: n.f, fi: n.fi, barre: true, state: 'approach', t, born: t }); return; }
        markers.push({ s: n.s, f: n.f, fi: n.fi || 0, state: 'approach', t, born: t });
      } else openGlow[n.s] = t;
    });
  }
  function confirm() {
    const t = now();
    if (self.sticky) { markers.forEach(m => { if (m.state !== 'leave') m.pulse = t; }); Object.keys(openGlow).forEach(s => { if (openGlow[s] > 0) openGlow['p' + s] = t; }); return; }
    markers.forEach(m => { if (m.state !== 'leave') { m.state = 'confirm'; m.t = t; } }); Object.keys(openGlow).forEach(s => { openGlow[s] = -t; });
  }
  function wrong() { const t = now(); markers.forEach(m => { if (m.state !== 'leave' && m.state !== 'confirm') m.shake = t; }); Object.keys(openGlow).forEach(s => { openGlow['x' + s] = t; }); }
  function pluck(s, f, amp) { const st = strings[s]; if (!st) return; st.amp = amp || 1; st.stop = f > 0 ? contactU(f) + 4 : 0; st.ph = 0; }
  function clear() { markers = []; ghosts = []; openGlow = {}; callout = null; }

  /* ---------------- draw ---------------- */
  /** nylon string: a soft shadow on the wood, a translucent body, a thin highlight; it fades out with the instrument at the far end */
  function strokeString(s, glow) {
    const st = strings[s], u0 = 0, u1 = uRight() + 2, w = clamp(G.ky * (s === 1 ? .92 : s === 2 ? .8 : .68), 1.7, 3.4), sh = clamp(G.ky * .7, 1.6, 3.2);
    const path = (dy, amp) => {
      ctx.beginPath();
      const a = Math.max(u0, st.stop), N = 30;
      if (st.stop > u0) { ctx.moveTo(X(u0), Y(s, u0) + dy); ctx.lineTo(X(st.stop), Y(s, st.stop) + dy); }
      for (let i = 0; i <= N; i++) { const u = a + (u1 - a) * i / N, env = Math.sin(Math.PI * clamp((u - st.stop) / (g().L - st.stop), 0, 1)); const y = Y(s, u) + dy + (amp ? amp * env * Math.sin(st.ph) : 0); i === 0 && st.stop <= u0 ? ctx.moveTo(X(u), y) : ctx.lineTo(X(u), y); }
    };
    const fade = a => { const e0 = MIR() ? 26 : G.W - 26, e1 = MIR() ? 0 : G.W, gr = ctx.createLinearGradient(e0, 0, e1, 0); gr.addColorStop(0, a); gr.addColorStop(1, 'rgba(0,0,0,0)'); return gr; };
    const amp = st.amp * clamp(G.ky * 1.1, 2.2, 5);
    if (glow) { ctx.strokeStyle = fade('rgba(255,244,214,' + (.16 * glow).toFixed(3) + ')'); ctx.lineWidth = w * 6; path(0, amp); ctx.stroke(); ctx.strokeStyle = fade('rgba(255,244,214,' + (.3 * glow).toFixed(3) + ')'); ctx.lineWidth = w * 2.6; path(0, amp); ctx.stroke(); }
    ctx.strokeStyle = fade('rgba(16,6,2,.38)'); ctx.lineWidth = w * 1.3; path(sh, amp * .6); ctx.stroke();
    ctx.strokeStyle = fade('rgba(240,232,214,.86)'); ctx.lineWidth = w; path(0, amp); ctx.stroke();
    ctx.strokeStyle = fade('rgba(255,255,255,.62)'); ctx.lineWidth = Math.max(.6, w * .3); path(-w * .22, amp); ctx.stroke();
  }
  function markerR(f) { const G0 = g(), a = G0.fretMm(f - 1), b = G0.fretMm(f), cell = (b - a) * G.k, adj = G0.spacing(contactU(f)) / 2 * G.ky; return clamp(Math.min(cell * .5, adj * .47), 9.5, 24); }
  function drawMarker(m, t) {
    const R = markerR(m.f), cx = X(contactU(m.f)), cy0 = Y(m.s, contactU(m.f)), age = t - m.t;
    let a = 1, sc = 1, dy = 0, shadow = .55, ring = 0, ringA = 0, done = false;
    if (m.state === 'approach') {
      const k = age / 260, e = easeOut(k); a = e; sc = 1.28 - .28 * e; dy = -R * 1.5 * (1 - e); shadow = .55 * e;
      if (k >= 1) { const p = clamp((age - 260) / 110, 0, 1); sc = 1 - .1 * Math.sin(p * Math.PI); if (p >= 1) { m.state = 'hold'; m.t = t; } }
    } else if (m.state === 'hold') { const b = (Math.sin(age / 360) + 1) / 2; ring = m.barre ? 0 : R * (1.38 + .14 * b); ringA = .28 + .12 * b; sc = .96; }
    else if (m.state === 'confirm') { const k = age / 420; ring = R * (1.1 + 1.4 * easeOut(k)); ringA = .9 * (1 - k); sc = 1 + .08 * Math.sin(Math.min(1, k * 2) * Math.PI); a = 1 - clamp((k - .35) / .65, 0, 1); if (k >= 1) done = true; }
    else if (m.state === 'leave') { const k = age / 160; a = 1 - k; if (k >= 1) done = true; }
    if (done) return false;
    let sx = 0; if (m.shake && t - m.shake < 340) { const p = (t - m.shake) / 340; sx = Math.sin(p * Math.PI * 6) * 5 * (1 - p); }
    const x = cx + sx, y = cy0 + dy, col = fcol(m.fi);
    ctx.save(); ctx.globalAlpha = clamp(a, 0, 1);
    // fingertip contact shadow on the wood
    if (!m.barre) { ctx.fillStyle = 'rgba(0,0,0,' + (shadow * .6).toFixed(3) + ')'; ctx.beginPath(); ctx.ellipse(cx + sx + 1.5, cy0 + R * .32, R * 1.02, R * .62, 0, 0, 7); ctx.fill(); }
    if (ring) { ctx.strokeStyle = m.state === 'confirm' ? 'rgba(255,255,255,' + ringA.toFixed(3) + ')' : hexA(col, ringA); ctx.lineWidth = m.state === 'confirm' ? 3 : 2; ctx.beginPath(); ctx.arc(x, y, ring, 0, 7); ctx.stroke(); }
    const r = R * sc;
    if (m.pulse && t - m.pulse < 300) { const k = (t - m.pulse) / 300; ctx.strokeStyle = 'rgba(255,255,255,' + (.8 * (1 - k)).toFixed(3) + ')'; ctx.lineWidth = 2.5; ctx.beginPath(); if (m.barre) { const ya = Y(m.s2, contactU(m.f)), yb = Y(m.s, contactU(m.f)), y0 = Math.min(ya, yb), y1 = Math.max(ya, yb), e = r * (1.15 + .5 * k); ctx.roundRect ? ctx.roundRect(x - e, y0 - e + dy, e * 2, y1 - y0 + e * 2, e) : ctx.rect(x - e, y0 - e, e * 2, y1 - y0 + e * 2); } else ctx.arc(x, y, r * (1.15 + .6 * k), 0, 7); ctx.stroke(); }
    if (m.barre) {
      const ya = Y(m.s2, contactU(m.f)), yb = Y(m.s, contactU(m.f)), y0 = Math.min(ya, yb) + dy, y1 = Math.max(ya, yb) + dy, w2 = r * 1.7;
      const gb = ctx.createLinearGradient(x - w2 / 2, 0, x + w2 / 2, 0); gb.addColorStop(0, mix(col, '#000000', .2)); gb.addColorStop(.35, mix(col, '#FFFFFF', .3)); gb.addColorStop(1, mix(col, '#000000', .25));
      ctx.fillStyle = 'rgba(0,0,0,' + (shadow * .5).toFixed(3) + ')'; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(x - w2 / 2 + 2, y0 - r + 4, w2, y1 - y0 + r * 2, w2 / 2) : ctx.rect(x - w2 / 2, y0 - r, w2, y1 - y0 + r * 2); ctx.fill();
      ctx.fillStyle = gb; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(x - w2 / 2, y0 - r, w2, y1 - y0 + r * 2, w2 / 2) : ctx.rect(x - w2 / 2, y0 - r, w2, y1 - y0 + r * 2); ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.lineWidth = 1.4; ctx.stroke();
      ctx.fillStyle = fink(m.fi); ctx.font = '700 ' + Math.round(r * 1.05) + 'px ' + FONT; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; txt(String(m.fi), x, (y0 + y1) / 2 + r * .04);
      ctx.restore(); return true;
    }
    const gr = ctx.createRadialGradient(x - r * .35, y - r * .4, r * .1, x, y, r);
    gr.addColorStop(0, mix(col, '#FFFFFF', .35)); gr.addColorStop(.65, col); gr.addColorStop(1, mix(col, '#000000', .28));
    ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.lineWidth = 1.4; ctx.stroke();
    if (m.fi) {
      ctx.fillStyle = fink(m.fi); ctx.font = '700 ' + Math.round(r * 1.05) + 'px ' + FONT; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      txt(String(m.fi), x, y + r * .04);
      if (PD.fingers.symbols) { ctx.font = '600 ' + Math.round(r * .55) + 'px ' + FONT; ctx.fillStyle = '#F4F2EE'; txt(PD.fingers.symbol(m.fi), x + r * 1.05, y - r * .95); }
    }
    if (m.state === 'confirm' && age < 380) { ctx.globalAlpha = clamp(1 - age / 380, 0, 1); ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x - r * .4, y - r * 1.75); ctx.lineTo(x - r * .1, y - r * 1.45); ctx.lineTo(x + r * .45, y - r * 2.05); ctx.stroke(); }
    ctx.restore();
    return true;
  }
  function drawGhost(m) {
    const R = markerR(m.f) * .82, x = X(contactU(m.f)), y = Y(m.s, contactU(m.f)), col = fcol(m.fi);
    ctx.save(); ctx.setLineDash([3, 4]); ctx.strokeStyle = hexA(col, .6); ctx.lineWidth = 1.6; ctx.beginPath(); ctx.arc(x, y, R, 0, 7); ctx.stroke(); ctx.setLineDash([]);
    if (m.fi) { ctx.fillStyle = hexA(col, .75); ctx.font = '600 ' + Math.round(R * .9) + 'px ' + FONT; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; txt(String(m.fi), x, y + 1); }
    ctx.restore();
  }
  const FONT = "'Noto Sans Georgian', system-ui, sans-serif";
  /** text stays upright on screen, also when the neck is drawn turned */
  function txt(str, x, y) { if (!G.vert) return ctx.fillText(str, x, y); ctx.save(); ctx.translate(x, y); if (self.mirror) ctx.transform(0, 1, 1, 0, 0, 0); else ctx.rotate(-Math.PI / 2); ctx.fillText(str, 0, 0); ctx.restore(); }
  function hexA(hex, a) { const n = parseInt(hex.slice(1), 16); return 'rgba(' + (n >> 16 & 255) + ',' + (n >> 8 & 255) + ',' + (n & 255) + ',' + a.toFixed(3) + ')'; }
  function mix(a, b, k) { const p = parseInt(a.slice(1), 16), q = parseInt(b.slice(1), 16); const c = i => Math.round(((p >> i) & 255) * (1 - k) + ((q >> i) & 255) * k); return 'rgb(' + c(16) + ',' + c(8) + ',' + c(0) + ')'; }

  /** a label pill on the neck: 'E · 3 ლადი' beside the fingertip marker, or 'E · 0 · ღია სიმი' lying on the open string; always upright on screen */
  function drawCallout(c, t) {
    const sp = P().strings[c.s - 1] || {}, col = sp.color || '#ccc', lab = sp.label || '', a = easeOut((t - c.t) / 300);
    const G0 = g(), u = c.f > 0 ? contactU(c.f) : 0, bx = X(u), by = Y(c.s, u);
    const M = ctx.getTransform(), p = M.transformPoint({ x: bx, y: by }), q = M.transformPoint({ x: X(u + 10), y: Y(c.s, u + 10) });
    let dx = q.x - p.x, dy = q.y - p.y; const dl = Math.hypot(dx, dy) || 1; dx /= dl; dy /= dl;
    const text = lab + ' · ' + (c.f > 0 ? PD.i18n.t('nk.fret', { n: c.f }) : PD.i18n.t('nk.open')), fs = Math.round(13 * dpr);
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.font = '700 ' + fs + 'px ' + FONT;
    const tw = ctx.measureText(text).width, dot = 8 * dpr, w = tw + dot + 26 * dpr, h = 26 * dpr;
    let cx = p.x, cy = p.y;
    { const R = c.f > 0 ? markerR(c.f) * dpr * 1.5 + 8 * dpr : 12 * dpr, ext = Math.abs(dx) * w / 2 + Math.abs(dy) * h / 2; cx += dx * (R + ext); cy += dy * (R + ext); }   // beside the fingertip, or just past the nut, lying on the open string
    cx = clamp(cx, w / 2 + 4, canvas.width - w / 2 - 4); cy = clamp(cy, h / 2 + 4, canvas.height - h / 2 - 4);
    ctx.globalAlpha = a; ctx.shadowColor = 'rgba(0,0,0,.55)'; ctx.shadowBlur = 10 * dpr; ctx.shadowOffsetY = 2 * dpr;
    ctx.fillStyle = 'rgba(250,246,238,.97)'; ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(cx - w / 2, cy - h / 2, w, h, h / 2); else ctx.rect(cx - w / 2, cy - h / 2, w, h); ctx.fill();
    ctx.shadowColor = 'transparent'; ctx.lineWidth = 2 * dpr; ctx.strokeStyle = col; ctx.stroke();
    ctx.fillStyle = col; ctx.beginPath(); ctx.arc(cx - w / 2 + 11 * dpr + dot / 2, cy, dot / 2, 0, 7); ctx.fill();
    ctx.fillStyle = '#16100B'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText(text, cx - w / 2 + 11 * dpr + dot + 6 * dpr, cy + dpr * .5);
    ctx.restore();
  }
  function draw() {
    const t = now(), dt = Math.min(.05, (t - lastT) / 1000); lastT = t;
    if (!bmp) buildBitmap();
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, canvas.width, canvas.height);
    // upright: the drawing is turned a quarter clockwise (E on the right, like facing the instrument); left-handed: flipped across
    const T = G.vert ? (self.mirror ? [0, 1, 1, 0, 0, 0] : [0, 1, -1, 0, canvas.width, 0]) : self.mirror ? [-1, 0, 0, 1, canvas.width, 0] : [1, 0, 0, 1, 0, 0];
    ctx.setTransform(T[0], T[1], T[2], T[3], T[4], T[5]);
    ctx.drawImage(bmp, 0, 0);
    if (G.vert) ctx.setTransform(T[0] * dpr, T[1] * dpr, T[2] * dpr, T[3] * dpr, T[4], T[5]); else ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    // strings (open-string targets glow)
    for (let s = 3; s >= 1; s--) {
      const st = strings[s]; if (st.amp) { st.ph += dt * 70; st.amp *= Math.exp(-dt * 2.6); if (st.amp < .02) st.amp = 0; }
      const og = openGlow[s];
      let glow = 0;
      if (og > 0) glow = .75 + .25 * Math.sin((t - og) / 300);
      else if (og < 0) glow = Math.max(0, 1 - (t + og) / 420);
      if (openGlow['x' + s] && t - openGlow['x' + s] < 300) glow *= .4;
      if (openGlow['p' + s] && t - openGlow['p' + s] < 260) glow = Math.min(1.6, glow + .8 * (1 - (t - openGlow['p' + s]) / 260));
      strokeString(s, glow);
    }
    // string names beside the nut, in the strings' colours; the strings of the current shape light up
    const used = new Set(); markers.forEach(m => { if (m.state === 'leave') return; for (let s = m.s; s <= (m.s2 || m.s); s++) used.add(s); }); Object.keys(openGlow).forEach(k => { if (/^\d$/.test(k) && openGlow[k] > 0) used.add(+k); });
    const side = MIR() ? 1 : -1, lr = clamp(G.boardH * .085, 8.5, 11);
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    [1, 2, 3].forEach(s => {
      const sp = P().strings[s - 1] || {}, col = sp.color || '#ccc', lab = sp.label || '', on = used.has(s), x = X(0) + side * (lr * 2 + 20), y = Y(s, 0);
      ctx.fillStyle = on ? col : 'rgba(16,9,5,.86)'; ctx.beginPath(); ctx.arc(x, y, lr, 0, 7); ctx.fill();
      ctx.strokeStyle = on ? 'rgba(255,255,255,.7)' : col; ctx.lineWidth = 1.5; ctx.stroke();
      ctx.fillStyle = on ? '#140C06' : col; ctx.font = '700 ' + Math.round(lr * (lab.length > 1 ? .92 : 1.1)) + 'px ' + FONT; txt(lab, x, y + .5);
    });
    // open string: a "0" tag at the nut
    Object.keys(openGlow).forEach(k => { if (!/^\d$/.test(k)) return; const og = openGlow[k]; const a = og > 0 ? 1 : Math.max(0, 1 - (t + og) / 420); if (a <= 0) { if (og < 0) delete openGlow[k]; return; }
      const s = +k, x = X(0) + side * (lr + 5), y = Y(s, 0), r = lr + 1;
      ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = '#F4F2EE'; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); ctx.strokeStyle = 'rgba(0,0,0,.4)'; ctx.lineWidth = 1; ctx.stroke(); ctx.fillStyle = '#121317'; ctx.font = '700 ' + Math.round(r * 1.1) + 'px ' + FONT; txt('0', x, y + .5); ctx.restore(); });
    ghosts.forEach(drawGhost);
    markers = markers.filter(m => drawMarker(m, t));
    if (callout) drawCallout(callout, t);
    // fret numbers under the board: every fret that fits; the dotted frets in the inlay colour; the target fret bright
    const tgt = new Set(markers.filter(m => m.state !== 'leave').map(m => m.f)), mk = g().markers || {}, dotted = new Set([].concat(mk.single || [], mk.double || []));
    for (let n = 1; n <= NF(); n++) {
      const a = g().fretMm(n - 1), b = g().fretMm(n), cell = (b - a) * G.k, x = X((a + b) / 2), on = tgt.has(n);
      let fs = on ? clamp(cell * .7, 11, 15) : G.vert ? clamp(cell * .6, 9.5, 12.5) : Math.min(12.5, cell * .62);
      ctx.font = (on ? '700 ' : '500 ') + fs.toFixed(1) + 'px ' + FONT;
      const tw = ctx.measureText(String(n)).width;
      if (!on && !G.vert && tw > cell - 1.5) { fs *= (cell - 1.5) / tw; if (fs < 7) continue; ctx.font = '500 ' + fs.toFixed(1) + 'px ' + FONT; }
      ctx.fillStyle = on ? '#FFFFFF' : dotted.has(n) ? 'rgba(242,206,96,.82)' : 'rgba(214,200,180,.5)';
      txt(String(n), x, G.yNum);
    }
    return (callout && now() - callout.t < 320) || markers.length || ghosts.length || Object.keys(openGlow).length || [1, 2, 3].some(s => strings[s].amp);
  }

  /** dev/test only: map a tap to string + fret */
  function hit(px, py) {
    if (G.vert) { const vx = py, vy = self.mirror ? px : G.H - px; px = vx; py = vy; }
    const xx = MIR() ? G.W - px : px, u = (xx - G.xNut) / G.k;
    if (u > g().FE + 2) return null;
    let s = 2, best = 1e9; [1, 2, 3].forEach(k => { const d = Math.abs(Y(k, u) - py); if (d < best) { best = d; s = k; } });
    if (py < V(topV(Math.max(0, u))) - 12 || py > V(botV(Math.max(0, u))) + 12) return null;
    let f = 0; for (let n = 1; n <= NF(); n++) if (u > g().fretMm(n - 1) && u <= g().fretMm(n)) f = n;
    if (u <= 0) f = 0;
    return { s, f };
  }
  if (opt.onTap) canvas.addEventListener('pointerdown', e => { const r = canvas.getBoundingClientRect(), p = hit(e.clientX - r.left, e.clientY - r.top); if (p) opt.onTap(p.s, p.f); });

  Object.assign(self, { layout, draw, setTarget, confirm, wrong, pluck, clear, natH, G, destroy() { bmp = null; offInst(); } });
  Object.defineProperty(self, 'mirrorOn', { set(v) { self.mirror = !!v; } });
  return self;
};
