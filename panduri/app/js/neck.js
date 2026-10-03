/* =====================================================================
   Panduri neck — the main teaching visual of the practice screen.
   A close-up of the fingerboard (player view: nut on the left, E on top,
   A at the bottom; mirrored for left-handed players). There is NO hand:
   where to press is shown by a fingertip marker (finger colour + number)
   sitting exactly on the string × fret contact point.

   Marker life: approach → touch → press → hold → (correct) confirm → fade.
   The wood is rendered once into a bitmap per size; every frame only
   blits it and draws strings and markers (cheap, 60 fps on phones).
   Fret positions come from the instrument profile (true proportions
   along the strings; the across-strings spacing is enlarged for reading).
   ===================================================================== */
PD.Neck = function (canvas, opt) {
  opt = opt || {};
  const ctx = canvas.getContext('2d'), TH = PD.theory;
  const self = { mirror: false, frets: opt.frets || 0, still: !!opt.still, sticky: !!opt.sticky };
  const G = { W: 1, H: 1 };
  let dpr = 1, bmp = null, bmpKey = '';
  const strings = { 1: { amp: 0, ph: 0, stop: 0 }, 2: { amp: 0, ph: 0, stop: 0 }, 3: { amp: 0, ph: 0, stop: 0 } };
  let markers = [], ghosts = [], openGlow = {}, cam = { u0: null, v: 0 }, camGoal = null, lastT = performance.now();
  const g = () => PD.geom.g, NF = () => PD.instrument.profile.frets.count;
  const clamp = (x, a, b) => x < a ? a : x > b ? b : x;
  const easeOut = x => 1 - Math.pow(1 - clamp(x, 0, 1), 3);
  const now = () => performance.now();

  /* ---------------- layout ---------------- */
  function layout() {
    const r = canvas.getBoundingClientRect(); if (r.width < 4 || r.height < 4) return false;
    const q = PD.store.get('quality', 'auto');
    dpr = Math.min(q === 'low' ? 1 : q === 'medium' ? 1.5 : q === 'ultra' ? 3 : q === 'high' ? 2 : PD.device && PD.device.low ? 1.5 : 2, window.devicePixelRatio || 1);
    canvas.width = Math.round(r.width * dpr); canvas.height = Math.round(r.height * dpr);
    const W = G.W = r.width, H = G.H = r.height;
    // how much of the neck is visible: phones show the first frets large, wide screens the whole board
    const show = self.frets || (W < 520 ? 7 : W < 820 ? 10 : NF());
    G.show = Math.min(NF(), show);
    G.padL = W < 520 ? 26 : 40; G.padR = 12;
    const uL = -7, uR = g().fretMm(G.show) + (G.show >= NF() ? 14 : 6);
    G.k = (W - G.padL - G.padR) / (uR - uL); G.uL = uL; G.span = uR - uL;
    G.numH = Math.max(18, Math.min(26, H * .12));
    G.boardH = Math.max(64, Math.min(H - G.numH - 20, 230));
    G.yT = Math.max(8, (H - G.numH - G.boardH) / 2); G.yB = G.yT + G.boardH;
    if (cam.u0 == null || G.show >= NF()) cam.u0 = uL;
    bmp = null;
    return true;
  }
  // board coordinates: u (mm from the nut) → x px ; across: string s → y px (slight taper toward the body)
  const taper = u => 1 + .07 * clamp(u / g().FE, 0, 1.2);
  const X0 = u => G.padL + (u - cam.u0) * G.k;
  const X = u => self.mirror ? G.W - X0(u) : X0(u);
  const yMid = () => (G.yT + G.yB) / 2;
  const halfH = u => G.boardH / 2 * taper(u) / taper(g().FE * .5);
  const SY = { 3: -.62, 2: 0, 1: .62 };   // E top · C♯ middle · A bottom
  const Y = (s, u) => yMid() + SY[s] * halfH(u == null ? 0 : u);
  const contactU = f => g().contactU(f);

  /* ---------------- wood (cached bitmap, full board length) ---------------- */
  function rng(seed) { return () => (seed = (seed * 16807) % 2147483647) / 2147483647; }
  function buildBitmap() {
    const G0 = g(), k = G.k * dpr, u0 = -40, u1 = G0.FE + 30, w = Math.ceil((u1 - u0) * k), hh = Math.ceil(G.H * dpr);
    const key = [k.toFixed(3), w, hh, G.yT, G.boardH, NF()].join(':'); if (bmp && bmpKey === key) return;
    const c = document.createElement('canvas'); c.width = Math.min(w, 8192); c.height = hh;
    const x = c.getContext('2d'), R = rng(11);
    const ux = u => (u - u0) * k, yy = v => v * dpr;
    const top = u => yy(yMid() - halfH(u)), bot = u => yy(yMid() + halfH(u));
    const boardPath = (grow) => { x.beginPath(); x.moveTo(ux(0), top(0) - grow); for (let u = 0; u <= G0.FE; u += 6) x.lineTo(ux(u), top(u) - grow); x.lineTo(ux(G0.FE), top(G0.FE) - grow); x.lineTo(ux(G0.FE), bot(G0.FE) + grow); for (let u = G0.FE; u >= 0; u -= 6) x.lineTo(ux(u), bot(u) + grow); x.lineTo(ux(0), bot(0) + grow); x.closePath(); };
    // neck wood visible beyond the board edges (dark walnut tone) + soft cast shadow
    x.save(); x.filter = 'blur(' + Math.round(6 * dpr) + 'px)'; x.fillStyle = 'rgba(0,0,0,.55)'; x.translate(0, 7 * dpr); boardPath(4 * dpr); x.fill(); x.restore();
    boardPath(3 * dpr); let gr = x.createLinearGradient(0, top(0), 0, bot(0)); gr.addColorStop(0, '#24130B'); gr.addColorStop(.5, '#3A2012'); gr.addColorStop(1, '#1B0E07'); x.fillStyle = gr; x.fill();
    // headstock stub left of the nut
    gr = x.createLinearGradient(ux(-40), 0, ux(0), 0); gr.addColorStop(0, 'rgba(40,22,12,0)'); gr.addColorStop(.6, '#2B170D'); gr.addColorStop(1, '#3A2113');
    x.fillStyle = gr; x.fillRect(ux(-40), top(0) - 3 * dpr, ux(0) - ux(-40), bot(0) - top(0) + 6 * dpr);
    // rosewood board
    boardPath(0); gr = x.createLinearGradient(0, top(0), 0, bot(0));
    gr.addColorStop(0, '#2E0F07'); gr.addColorStop(.18, '#4C1B0E'); gr.addColorStop(.5, '#5E2414'); gr.addColorStop(.82, '#491A0D'); gr.addColorStop(1, '#2A0E06');
    x.fillStyle = gr; x.fill();
    x.save(); boardPath(0); x.clip();
    const bh = bot(0) - top(0);
    for (let i = 0; i < 260; i++) {   // long grain lines with gentle waves; some lighter streaks
      const v = top(0) + R() * bh * 1.1 - bh * .05, light = R() < .16;
      x.strokeStyle = light ? 'rgba(150,72,40,' + (.06 + R() * .1).toFixed(3) + ')' : 'rgba(16,4,1,' + (.08 + R() * .2).toFixed(3) + ')';
      x.lineWidth = (light ? .6 + R() * 1.4 : .3 + R() * 1.1) * dpr; x.beginPath(); const ph = R() * 6, fq = .004 + R() * .01;
      for (let u = -2; u <= G0.FE + 4; u += 8) x.lineTo(ux(u), v + Math.sin(u * fq * 6 + ph) * 1.2 * dpr + (u / G0.FE) * (v - yy(yMid())) * .07);
      x.stroke();
    }
    for (let i = 0; i < 2600; i++) { const u = R() * G0.FE, v = top(u) + R() * (bot(u) - top(u)); x.fillStyle = 'rgba(10,3,1,' + (.25 + R() * .35).toFixed(3) + ')'; x.fillRect(ux(u), v, (1 + R() * 3) * dpr, .55 * dpr); }
    // satin sheen from the key light (upper left): broad, soft
    gr = x.createLinearGradient(0, top(0), 0, bot(0)); gr.addColorStop(0, 'rgba(255,214,180,0)'); gr.addColorStop(.3, 'rgba(255,214,180,.07)'); gr.addColorStop(.45, 'rgba(255,214,180,0)');
    x.fillStyle = gr; x.fillRect(0, 0, c.width, c.height);
    gr = x.createLinearGradient(ux(0), 0, ux(G0.FE), 0); gr.addColorStop(0, 'rgba(255,230,200,.05)'); gr.addColorStop(1, 'rgba(0,0,0,.12)'); x.fillStyle = gr; x.fillRect(0, 0, c.width, c.height);
    x.restore();
    // board edges: thin bright bevel on top, darker on the bottom
    x.lineWidth = 1.2 * dpr; x.strokeStyle = 'rgba(255,205,170,.16)'; x.beginPath(); for (let u = 0; u <= G0.FE; u += 6) x.lineTo(ux(u), top(u) + .6 * dpr); x.stroke();
    x.strokeStyle = 'rgba(0,0,0,.6)'; x.beginPath(); for (let u = 0; u <= G0.FE; u += 6) x.lineTo(ux(u), bot(u) - .6 * dpr); x.stroke();
    // inlays: mother-of-pearl dots
    const mk = G0.markers || { single: [3, 5, 7, 9, 15], double: [12] }, ir = Math.max(3.2, Math.min(7, halfH(0) * .09)) * dpr;
    const pearl = (cx, cy) => { const pg = x.createRadialGradient(cx - ir * .35, cy - ir * .35, ir * .1, cx, cy, ir); pg.addColorStop(0, '#FBF8F1'); pg.addColorStop(.55, '#E6E0D3'); pg.addColorStop(.8, '#D7D9DA'); pg.addColorStop(1, '#B9B2A5');
      x.fillStyle = 'rgba(0,0,0,.35)'; x.beginPath(); x.arc(cx, cy + .8 * dpr, ir + .8 * dpr, 0, 7); x.fill(); x.fillStyle = pg; x.beginPath(); x.arc(cx, cy, ir, 0, 7); x.fill(); };
    const cellMid = n => (G0.fretMm(n - 1) + G0.fretMm(n)) / 2;
    (mk.single || []).filter(n => n <= NF()).forEach(n => pearl(ux(cellMid(n)), yy(yMid())));
    (mk.double || []).filter(n => n <= NF()).forEach(n => { const u = cellMid(n); pearl(ux(u), yy(yMid() - halfH(u) * .32)); pearl(ux(u), yy(yMid() + halfH(u) * .32)); });
    // frets: nickel wire — shadow, body, specular line
    const fw = Math.max(2.2, Math.min(4, G.k * 1.6)) * dpr;
    for (let n = 1; n <= NF(); n++) {
      const u = G0.fretMm(n), xx = ux(u), t0 = top(u) + .5 * dpr, b0 = bot(u) - .5 * dpr;
      x.fillStyle = 'rgba(0,0,0,.45)'; x.fillRect(xx + fw * .2, t0, fw * 1.4, b0 - t0);
      const fg = x.createLinearGradient(xx - fw / 2, 0, xx + fw / 2, 0); fg.addColorStop(0, '#6F6A63'); fg.addColorStop(.35, '#E9E6E0'); fg.addColorStop(.6, '#B9B4AC'); fg.addColorStop(1, '#5B5650');
      x.fillStyle = fg; x.fillRect(xx - fw / 2, t0, fw, b0 - t0);
      const vg = x.createLinearGradient(0, t0, 0, b0); vg.addColorStop(0, 'rgba(255,255,255,.35)'); vg.addColorStop(.25, 'rgba(255,255,255,0)'); vg.addColorStop(.8, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,.35)');
      x.fillStyle = vg; x.fillRect(xx - fw / 2, t0, fw, b0 - t0);
    }
    // nut: bone, with string slots
    const nw = Math.max(5, 5.5 * G.k) * dpr, nx = ux(0) - nw;
    x.fillStyle = 'rgba(0,0,0,.5)'; x.fillRect(ux(0), top(0), 3 * dpr, bot(0) - top(0));
    gr = x.createLinearGradient(nx, 0, nx + nw, 0); gr.addColorStop(0, '#BFB5A2'); gr.addColorStop(.4, '#F1EADB'); gr.addColorStop(1, '#D3C8B3');
    x.fillStyle = gr; x.fillRect(nx, top(0) - 2.5 * dpr, nw, bot(0) - top(0) + 5 * dpr);
    [1, 2, 3].forEach(s => { const sy = yy(Y(s, 0)); x.fillStyle = 'rgba(70,52,34,.55)'; x.fillRect(nx, sy - 1.2 * dpr, nw, 2.4 * dpr); });
    bmp = { c, u0, k }; bmpKey = key;
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
    follow((notes || []).concat(next || []));
  }
  function confirm() {
    const t = now();
    if (self.sticky) { markers.forEach(m => { if (m.state !== 'leave') m.pulse = t; }); Object.keys(openGlow).forEach(s => { if (openGlow[s] > 0) openGlow['p' + s] = t; }); return; }
    markers.forEach(m => { if (m.state !== 'leave') { m.state = 'confirm'; m.t = t; } }); Object.keys(openGlow).forEach(s => { openGlow[s] = -t; });
  }
  function wrong() { const t = now(); markers.forEach(m => { if (m.state !== 'leave' && m.state !== 'confirm') m.shake = t; }); Object.keys(openGlow).forEach(s => { openGlow['x' + s] = t; }); }
  function pluck(s, f, amp) { const st = strings[s]; if (!st) return; st.amp = amp || 1; st.stop = f > 0 ? contactU(f) + 4 : 0; st.ph = 0; }
  function clear() { markers = []; ghosts = []; openGlow = {}; }
  /** keep the targets in view (phones show only part of the neck) */
  function follow(notes) {
    if (G.show >= NF()) { camGoal = G.uL; return; }
    const fs = notes.filter(n => n.f > 0).map(n => n.f); if (!fs.length) { camGoal = cam.u0 > G.uL + 1 && notes.length ? G.uL : camGoal; return; }
    const lo = g().fretMm(Math.max(0, Math.min(...fs) - 1)), hi = g().fretMm(Math.max(...fs)) + 4;
    const vis = G.span * .86, c0 = cam.u0;
    let goal = c0;
    if (hi > c0 + vis) goal = hi - vis; if (lo < c0 + 4) goal = lo - 6;
    camGoal = Math.max(G.uL, Math.min(goal, g().FE - G.span + 8));
  }

  /* ---------------- draw ---------------- */
  function strokeString(s, alpha, glow) {
    const st = strings[s], u0 = cam.u0 - 10, u1 = cam.u0 + G.span + 10, w = s === 1 ? 3.4 : s === 2 ? 3 : 2.6, sc = Math.max(.8, Math.min(1.25, G.boardH / 150));
    const path = (dy, amp) => {
      ctx.beginPath();
      const a = Math.max(u0, st.stop), N = 26;
      if (st.stop > u0) { ctx.moveTo(X(u0), Y(s, u0) + dy); ctx.lineTo(X(st.stop), Y(s, st.stop) + dy); }
      for (let i = 0; i <= N; i++) { const u = a + (u1 - a) * i / N, env = Math.sin(Math.PI * clamp((u - st.stop) / (g().L - st.stop), 0, 1)); const y = Y(s, u) + dy + (amp ? amp * env * Math.sin(st.ph) : 0); i === 0 && st.stop <= u0 ? ctx.moveTo(X(u), y) : ctx.lineTo(X(u), y); }
    };
    const amp = st.amp * 3.2 * sc;
    if (glow) { ctx.strokeStyle = 'rgba(255,244,214,' + (.16 * glow).toFixed(3) + ')'; ctx.lineWidth = w * sc * 6; path(0, amp); ctx.stroke(); ctx.strokeStyle = 'rgba(255,244,214,' + (.28 * glow).toFixed(3) + ')'; ctx.lineWidth = w * sc * 2.6; path(0, amp); ctx.stroke(); }
    ctx.strokeStyle = 'rgba(0,0,0,.42)'; ctx.lineWidth = w * sc * 1.25; path(2.6 * sc, amp * .6); ctx.stroke();
    ctx.strokeStyle = 'rgba(236,230,216,' + alpha + ')'; ctx.lineWidth = w * sc; path(0, amp); ctx.stroke();
    ctx.strokeStyle = 'rgba(255,255,255,' + (alpha * .55).toFixed(3) + ')'; ctx.lineWidth = Math.max(.6, w * sc * .28); path(-w * sc * .22, amp); ctx.stroke();
  }
  function markerR(f) { const a = g().fretMm(f - 1), b = g().fretMm(f), cell = (b - a) * G.k; return Math.max(11, Math.min(cell * .42, G.boardH * .19, 26)); }
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
      ctx.fillStyle = fink(m.fi); ctx.font = '700 ' + Math.round(r * 1.05) + 'px ' + FONT; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(String(m.fi), x, (y0 + y1) / 2 + r * .04);
      ctx.restore(); return true;
    }
    const gr = ctx.createRadialGradient(x - r * .35, y - r * .4, r * .1, x, y, r);
    gr.addColorStop(0, mix(col, '#FFFFFF', .35)); gr.addColorStop(.65, col); gr.addColorStop(1, mix(col, '#000000', .28));
    ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.lineWidth = 1.4; ctx.stroke();
    if (m.fi) {
      ctx.fillStyle = fink(m.fi); ctx.font = '700 ' + Math.round(r * 1.05) + 'px ' + FONT; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(String(m.fi), x, y + r * .04);
      if (PD.fingers.symbols) { ctx.font = '600 ' + Math.round(r * .55) + 'px ' + FONT; ctx.fillStyle = '#F4F2EE'; ctx.fillText(PD.fingers.symbol(m.fi), x + r * 1.05, y - r * .95); }
    }
    if (m.state === 'confirm' && age < 380) { ctx.globalAlpha = clamp(1 - age / 380, 0, 1); ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x - r * .4, y - r * 1.75); ctx.lineTo(x - r * .1, y - r * 1.45); ctx.lineTo(x + r * .45, y - r * 2.05); ctx.stroke(); }
    ctx.restore();
    return true;
  }
  function drawGhost(m) {
    const R = markerR(m.f) * .82, x = X(contactU(m.f)), y = Y(m.s, contactU(m.f)), col = fcol(m.fi);
    ctx.save(); ctx.setLineDash([3, 4]); ctx.strokeStyle = hexA(col, .55); ctx.lineWidth = 1.6; ctx.beginPath(); ctx.arc(x, y, R, 0, 7); ctx.stroke(); ctx.setLineDash([]);
    if (m.fi) { ctx.fillStyle = hexA(col, .7); ctx.font = '600 ' + Math.round(R * .9) + 'px ' + FONT; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(String(m.fi), x, y + 1); }
    ctx.restore();
  }
  const FONT = "'Noto Sans Georgian', system-ui, sans-serif";
  function hexA(hex, a) { const n = parseInt(hex.slice(1), 16); return 'rgba(' + (n >> 16 & 255) + ',' + (n >> 8 & 255) + ',' + (n & 255) + ',' + a.toFixed(3) + ')'; }
  function mix(a, b, k) { const p = parseInt(a.slice(1), 16), q = parseInt(b.slice(1), 16); const c = i => Math.round(((p >> i) & 255) * (1 - k) + ((q >> i) & 255) * k); return 'rgb(' + c(16) + ',' + c(8) + ',' + c(0) + ')'; }

  function draw() {
    const t = now(), dt = Math.min(.05, (t - lastT) / 1000); lastT = t;
    if (!bmp) buildBitmap();
    if (camGoal != null && Math.abs(camGoal - cam.u0) > .05) cam.u0 += (camGoal - cam.u0) * (1 - Math.exp(-dt * 7)); else if (camGoal != null) cam.u0 = camGoal;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, G.W, G.H);
    // wood
    ctx.save();
    if (self.mirror) { ctx.translate(G.W, 0); ctx.scale(-1, 1); }
    ctx.imageSmoothingEnabled = true;
    const sx = (cam.u0 - bmp.u0) * bmp.k - G.padL * dpr;
    ctx.drawImage(bmp.c, sx, 0, G.W * dpr, bmp.c.height, 0, 0, G.W, G.H);
    ctx.restore();
    // strings (open-string target glows)
    for (let s = 3; s >= 1; s--) {
      const st = strings[s]; if (st.amp) { st.ph += dt * 70; st.amp *= Math.exp(-dt * 2.6); if (st.amp < .02) st.amp = 0; }
      const og = openGlow[s];
      let glow = 0;
      if (og > 0) glow = .75 + .25 * Math.sin((t - og) / 300);
      else if (og < 0) glow = Math.max(0, 1 - (t + og) / 420);
      if (openGlow['x' + s] && t - openGlow['x' + s] < 300) glow *= .4;
      if (openGlow['p' + s] && t - openGlow['p' + s] < 260) glow = Math.min(1.6, glow + .8 * (1 - (t - openGlow['p' + s]) / 260));
      strokeString(s, .92, glow);
    }
    // open-string tag at the nut
    Object.keys(openGlow).forEach(k => { if (k[0] === 'x' || k[0] === 'p') return; const og = openGlow[k]; const a = og > 0 ? 1 : Math.max(0, 1 - (t + og) / 420); if (a <= 0) { if (og < 0) delete openGlow[k]; return; }
      const s = +k, x = X(-7) + (self.mirror ? 2 : -2), y = Y(s, 0), r = Math.max(9, Math.min(13, G.boardH * .09));
      ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = '#F4F2EE'; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); ctx.fillStyle = '#121317'; ctx.font = '700 ' + Math.round(r * 1.05) + 'px ' + FONT; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('0', x, y + .5); ctx.restore(); });
    ghosts.forEach(drawGhost);
    markers = markers.filter(m => drawMarker(m, t));
    // fret numbers under the board; the target fret is bright
    const tgt = new Set(markers.filter(m => m.state !== 'leave').map(m => m.f));
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    for (let n = 1; n <= NF(); n++) {
      const u = (g().fretMm(n - 1) + g().fretMm(n)) / 2, x = X(u); if (x < -10 || x > G.W + 10) continue;
      const on = tgt.has(n); ctx.font = (on ? '700 ' : '500 ') + (on ? 15 : 12) + 'px ' + FONT; ctx.fillStyle = on ? '#FFFFFF' : 'rgba(200,203,212,.5)';
      ctx.fillText(String(n), x, G.yB + G.numH * .5 + 8);
    }
    return markers.length || ghosts.length || Object.keys(openGlow).length || [1, 2, 3].some(s => strings[s].amp) || (camGoal != null && Math.abs(camGoal - cam.u0) > .05);
  }

  /** dev/test only: map a tap to string + fret */
  function hit(px, py) {
    const xx = self.mirror ? G.W - px : px, u = cam.u0 + (xx - G.padL) / G.k;
    let s = 2, best = 1e9; [1, 2, 3].forEach(k => { const d = Math.abs(Y(k, u) - py); if (d < best) { best = d; s = k; } });
    if (py < G.yT - 10 || py > G.yB + 10) return null;
    let f = 0; for (let n = 1; n <= NF(); n++) if (u > g().fretMm(n - 1) && u <= g().fretMm(n)) f = n;
    if (u <= 0) f = 0;
    return { s, f };
  }
  if (opt.onTap) canvas.addEventListener('pointerdown', e => { const r = canvas.getBoundingClientRect(), p = hit(e.clientX - r.left, e.clientY - r.top); if (p) opt.onTap(p.s, p.f); });

  Object.assign(self, { layout, draw, setTarget, confirm, wrong, pluck, clear, G, destroy() { bmp = null; } });
  Object.defineProperty(self, 'mirrorOn', { set(v) { self.mirror = !!v; } });
  return self;
};
