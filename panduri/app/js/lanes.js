/* =====================================================================
   Note lanes — the "when" of the practice screen.
   Three wide lanes in the same order as the strings on the neck below
   (E top, C♯ middle, A bottom). Notes are big rounded tokens: colour =
   finger, lane = string, number = finger, small label = note name.
   They glide right → left to the play line. In WAIT the clock stops,
   so the note simply waits on the line until the microphone hears it.
   Rhythm lessons use one big beat track (↓ / ↑, accents bolder).
   Every position is a pure function of engine.visualNow().
   ===================================================================== */
PD.Lanes = function (canvas, opt) {
  opt = opt || {};
  const ctx = canvas.getContext('2d'), E = PD.engine, S = E.S, TH = PD.theory;
  const G = { W: 1, H: 1 }, self = { mirror: false, rhythm: !!opt.rhythm, song: !!opt.song, G };
  const fx = {};   // per step: { hit, wrong, grade, gradeT }
  let dpr = 1, count = 0, countT = 0;
  const FONT = "'Noto Sans Georgian', system-ui, sans-serif";
  const clamp = (x, a, b) => x < a ? a : x > b ? b : x, easeOut = x => 1 - Math.pow(1 - clamp(x, 0, 1), 3);
  const ACC = '#FF6B5B', NORM = '#7FB2FF';

  function layout() {
    const r = canvas.getBoundingClientRect(); if (r.width < 4 || r.height < 4) return false;
    const q = PD.store.get('quality', 'auto');
    dpr = Math.min(q === 'low' ? 1 : q === 'medium' ? 1.5 : q === 'ultra' ? 3 : 2, window.devicePixelRatio || 1);
    canvas.width = Math.round(r.width * dpr); canvas.height = Math.round(r.height * dpr);
    const W = G.W = r.width, H = G.H = r.height;
    G.px = Math.round(Math.max(64, Math.min(170, W * .2)));
    G.beats = W < 520 ? 4 : W < 900 ? 5.5 : 7;
    G.ppb = Math.max(56, (W - G.px - 16) / G.beats);
    if (self.song) { G.beats = W < 520 ? 3.6 : W < 900 ? 5 : 7; G.ppb = Math.max(40, (W - G.px - 16) / G.beats); G.cy = H * .5; G.bh = Math.max(64, Math.min(150, H * .56)); }
    else if (self.rhythm) { G.cy = H * .46; G.R = Math.max(20, Math.min(46, H * .2, G.ppb * .36)); }
    else {
      const top = 10, bot = H - 10, gap = (bot - top) / 3;
      G.lane = { 3: top + gap * .5, 2: top + gap * 1.5, 1: top + gap * 2.5 }; G.gap = gap;
      G.R = Math.max(14, Math.min(28, gap * .36));
    }
    return true;
  }
  const X0 = t => G.px + (t - E.visualNow()) * G.ppb;
  const X = t => self.mirror ? G.W - X0(t) : X0(t);
  const PX = () => self.mirror ? G.W - G.px : G.px;
  function hexA(hex, a) { const n = parseInt(hex.slice(1), 16); return 'rgba(' + (n >> 16 & 255) + ',' + (n >> 8 & 255) + ',' + (n & 255) + ',' + a.toFixed(3) + ')'; }
  function mix(a, b, k) { const p = parseInt(a.slice(1), 16), q = parseInt(b.slice(1), 16); const c = i => Math.round(((p >> i) & 255) * (1 - k) + ((q >> i) & 255) * k); return 'rgb(' + c(16) + ',' + c(8) + ',' + c(0) + ')'; }
  const OPEN = '#D9DBE1';
  const colOf = n => n.f > 0 && n.fi ? PD.fingers.color(n.fi) : OPEN;
  const inkOf = n => n.f > 0 && n.fi ? PD.fingers.ink(n.fi) : '#15161A';
  function text(s, x, y, size, col, weight) { ctx.font = (weight || 600) + ' ' + size + 'px ' + FONT; ctx.fillStyle = col; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(s, x, y); }
  function arrow(x, y, up, size, col, w) {
    const d = up ? -1 : 1; ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath(); ctx.moveTo(x, y - d * size); ctx.lineTo(x, y + d * size); ctx.moveTo(x - size * .55, y + d * size * .4); ctx.lineTo(x, y + d * size); ctx.lineTo(x + size * .55, y + d * size * .4); ctx.stroke();
  }

  function token(n, x, y, R, a, st) {
    const col = colOf(n);
    ctx.save(); ctx.globalAlpha = a;
    ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.beginPath(); ctx.arc(x + 1, y + 2.5, R, 0, 7); ctx.fill();
    const gr = ctx.createRadialGradient(x - R * .35, y - R * .4, R * .1, x, y, R); gr.addColorStop(0, mix(col, '#FFFFFF', .3)); gr.addColorStop(.7, col); gr.addColorStop(1, mix(col, '#000000', .22));
    ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(x, y, R, 0, 7); ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,.5)'; ctx.lineWidth = 1.3; ctx.stroke();
    text(n.f > 0 ? String(n.fi || '·') : '0', x, y + .5, Math.round(R * 1.05), inkOf(n), 700);
    ctx.restore();
  }

  function drawNotes(t) {
    const A = E.flags(), now = E.visualNow(), px = PX();
    // lanes
    [3, 2, 1].forEach(s => {
      const y = G.lane[s];
      ctx.strokeStyle = 'rgba(255,255,255,.07)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(G.W, y); ctx.stroke();
      text(TH.stringName(s), self.mirror ? G.W - 18 : 18, y, 13, 'rgba(210,213,222,.55)', 600);
    });
    // bar lines
    const bpb = E.bpb(), b0 = Math.floor(now) - 1, b1 = now + G.beats + 1;
    for (let b = Math.max(0, b0); b <= b1; b++) { const x = X(b); if ((self.mirror ? x > px : x < px) ) continue; ctx.strokeStyle = b % bpb === 0 ? 'rgba(255,255,255,.08)' : 'rgba(255,255,255,.03)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x, 4); ctx.lineTo(x, G.H - 4); ctx.stroke(); }
    // play line + landing rings
    const cur = S.steps[S.cur], waitHere = cur && (S.waiting || (cur.t - now) < .02);
    const pg = ctx.createLinearGradient(0, 0, 0, G.H); pg.addColorStop(0, 'rgba(255,255,255,0)'); pg.addColorStop(.15, 'rgba(255,255,255,.55)'); pg.addColorStop(.85, 'rgba(255,255,255,.55)'); pg.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = 'rgba(160,140,255,.10)'; ctx.fillRect(px - 10, 0, 20, G.H);
    ctx.fillStyle = pg; ctx.fillRect(px - 1, 0, 2, G.H);
    [3, 2, 1].forEach(s => { const on = waitHere && cur.notes.some(n => n.s === s); ctx.strokeStyle = on ? 'rgba(255,255,255,.6)' : 'rgba(255,255,255,.12)'; ctx.lineWidth = on ? 2 : 1.2; ctx.beginPath(); ctx.arc(px, G.lane[s], G.R + 5 + (on ? Math.sin(t / 260) * 1.5 : 0), 0, 7); ctx.stroke(); });
    // tokens
    const vis0 = now - 1.5, vis1 = now + G.beats + .5;
    for (let i = 0; i < S.steps.length; i++) {
      const st = S.steps[i]; if (st.t + st.d < vis0 || st.t > vis1) continue;
      const f = fx[i] || {}, res = S.res[i] || {}, done = res.ok || res.missed;
      let x = X(st.t);
      // past the line: hits burst away, misses dim and slide on
      let a = 1, sc = 1;
      if (f.hit) { const k = (t - f.hit) / 360; if (k >= 1) continue; a = 1 - k; sc = 1 + .45 * easeOut(k); x = px; }
      else if (done) { a = Math.max(0, .35 - (now - st.t) * .4); if (a <= 0) continue; }
      if (f.wrong && t - f.wrong < 340) { const p = (t - f.wrong) / 340; x += Math.sin(p * Math.PI * 6) * 6 * (1 - p); }
      const R = G.R * sc;
      if (st.kind === 'note') {
        const n = st.notes[0], y = G.lane[n.s];
        if (st.d > .5 && !f.hit) { const x2 = X(st.t + st.d) - (self.mirror ? -R : R) * .6; ctx.fillStyle = hexA(colOf(n).startsWith('#') ? colOf(n) : OPEN, .2 * a); const l = Math.min(x, x2), w = Math.abs(x2 - x); ctx.beginPath(); ctx.roundRect ? ctx.roundRect(l, y - R * .32, w, R * .64, R * .32) : ctx.rect(l, y - R * .32, w, R * .64); ctx.fill(); }
        token(n, x, y, R, a, st);
        if (A.names && !f.hit) text(TH.name(TH.midi(n.s, n.f)), x, y + R + 10, 11, 'rgba(230,232,238,' + (.75 * a).toFixed(3) + ')', 600);
        if (f.wrong && t - f.wrong < 500) { ctx.strokeStyle = 'rgba(255,107,91,' + (1 - (t - f.wrong) / 500).toFixed(3) + ')'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(x, y, R + 4, 0, 7); ctx.stroke(); }
      } else {
        // chord / strum across the lanes
        const y0 = G.lane[3] - R * .9, y1 = G.lane[1] + R * .9, w = R * 1.25;
        ctx.save(); ctx.globalAlpha = a;
        ctx.fillStyle = st.acc ? 'rgba(255,107,91,.22)' : 'rgba(255,255,255,.08)'; ctx.strokeStyle = st.acc ? 'rgba(255,107,91,.8)' : 'rgba(255,255,255,.35)'; ctx.lineWidth = st.acc ? 2.4 : 1.4;
        ctx.beginPath(); ctx.roundRect ? ctx.roundRect(x - w / 2, y0, w, y1 - y0, w / 2) : ctx.rect(x - w / 2, y0, w, y1 - y0); ctx.fill(); ctx.stroke();
        st.notes.forEach(n => { if (n.f > 0) token(n, x, G.lane[n.s], R * .62, 1, st); });
        if (!st.notes.some(n => n.f > 0)) arrow(x, G.lane[2], st.st === 'up', R * .9, st.acc ? ACC : '#FFFFFF', st.acc ? 4 : 2.6);
        ctx.restore();
      }
      if (f.hit && t - f.hit < 360) { const k = (t - f.hit) / 360; ctx.strokeStyle = 'rgba(255,255,255,' + (.9 * (1 - k)).toFixed(3) + ')'; ctx.lineWidth = 2.5; const ys = st.kind === 'note' ? [G.lane[st.notes[0].s]] : [G.lane[2]]; ys.forEach(y => { ctx.beginPath(); ctx.arc(px, y, G.R * (1.1 + 1.2 * easeOut(k)), 0, 7); ctx.stroke(); }); }
      if (f.grade && t - f.gradeT < 900) { const k = (t - f.gradeT) / 900, y = st.kind === 'note' ? G.lane[st.notes[0].s] - G.R - 12 : G.lane[3] - G.R - 10; text(t2(f.grade), px, Math.max(10, y - 8 * k), 11, gcol(f.grade, 1 - k), 600); }
    }
  }
  const tr = (k, v) => PD.i18n.t(k, v), t2 = g => tr('g.' + g);
  function gcol(g, a) { const c = g === 'perfect' ? '#8EF0B4' : g === 'good' ? '#D8DCE6' : g === 'miss' ? '#FF8A7D' : '#FFD27A'; return hexA(c, clamp(a, 0, 1)); }

  function drawRhythm(t) {
    const now = E.visualNow(), px = PX(), cy = G.cy;
    ctx.strokeStyle = 'rgba(255,255,255,.08)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(G.W, cy); ctx.stroke();
    const bpb = E.bpb(), b0 = Math.floor(now) - 1, b1 = now + G.beats + 1;
    for (let b = Math.max(0, b0); b <= b1; b++) { const x = X(b); ctx.fillStyle = b % bpb === 0 ? 'rgba(255,255,255,.35)' : 'rgba(255,255,255,.14)'; ctx.beginPath(); ctx.arc(x, cy + G.R * 1.75, b % bpb === 0 ? 3 : 2, 0, 7); ctx.fill(); text(String(b % bpb + 1), x, cy + G.R * 1.75 + 14, 11, 'rgba(210,213,222,.45)', 500); }
    const pg = ctx.createLinearGradient(0, 0, 0, G.H); pg.addColorStop(0, 'rgba(255,255,255,0)'); pg.addColorStop(.2, 'rgba(255,255,255,.6)'); pg.addColorStop(.8, 'rgba(255,255,255,.6)'); pg.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = 'rgba(160,140,255,.10)'; ctx.fillRect(px - 14, 0, 28, G.H); ctx.fillStyle = pg; ctx.fillRect(px - 1, 0, 2, G.H);
    const vis0 = now - 2, vis1 = now + G.beats + .5;
    for (let i = 0; i < S.steps.length; i++) {
      const st = S.steps[i]; if (st.t < vis0 || st.t > vis1) continue;
      const f = fx[i] || {}, res = S.res[i] || {};
      let x = X(st.t), a = 1, sc = 1;
      if (f.hit) { const k = (t - f.hit) / 420; a = Math.max(.25, 1 - k * .75); sc = 1 + .2 * Math.max(0, 1 - k * 2); }
      else if (res.missed) a = .3;
      else if (st.t < now - .3) a = .45;
      const R = G.R * (st.acc ? 1.2 : .9) * sc, col = st.acc ? ACC : NORM;
      ctx.save(); ctx.globalAlpha = a;
      ctx.fillStyle = hexA(col, st.acc ? .2 : .12); ctx.beginPath(); ctx.arc(x, cy, R, 0, 7); ctx.fill();
      ctx.strokeStyle = hexA(col, .7); ctx.lineWidth = st.acc ? 2.6 : 1.6; ctx.stroke();
      arrow(x, cy, st.st === 'up', R * .58, col, st.acc ? 6 : 3.4);
      ctx.restore();
      const gname = f.grade || (res.missed ? 'miss' : null);
      if (gname) text(tr('g.' + gname), x, cy - R - 14, 12, gcol(gname, f.grade ? 1 : .8), 600);
    }
  }


  /* ---------- song: chord blocks per bar, stroke arrows inside, section names above ---------- */
  const CHC = ['#C9773F', '#8E3B22', '#D9A25B', '#6E8B5A', '#B4573A', '#A3814F'];
  const chordCol = {};
  function ccol(n) { if (!chordCol[n]) chordCol[n] = CHC[Object.keys(chordCol).length % CHC.length]; return chordCol[n]; }
  /* ---------- a song whose chords repeat (Dm Dm B♭ C): the whole cycle on ONE still line ----------
     Chord blocks as wide as their rhythms (Dm = 2 rhythms, B♭ = 1, C = 1), every stroke of every rhythm (↓ ↓ ↑),
     and a cursor that walks through it exactly with the music. Nothing scrolls, so the eye can rest on the pattern;
     each stroke turns green when the microphone heard it in time, red when it was missed. */
  let cyIdx = null, cyFor = null;
  function drawCycle(tm) {
    const L = S.lesson, C = L.cycle.length, now = E.visualNow(), Wd = G.W, H = G.H;
    if (cyFor !== S.steps) {   // first step index of every cycle
      cyFor = S.steps; cyIdx = []; let i = 0; const last = S.steps.length ? S.steps[S.steps.length - 1].t : 0, n = Math.floor(last / C) + 2;
      for (let k = 0; k <= n; k++) { while (i < S.steps.length && S.steps[i].t < k * C - 1e-6) i++; cyIdx[k] = i; }
    }
    const k = Math.max(0, Math.min(cyIdx.length - 2, Math.floor(now / C + 1e-6))), c0 = k * C, i0 = cyIdx[k], i1 = cyIdx[k + 1];
    const pad = Wd < 520 ? 12 : 28, rowW = Math.min(Wd - pad * 2, 1000), x0 = (Wd - rowW) / 2;
    const low = H < 170, top = low ? 18 : Math.round(Math.max(24, Math.min(40, H * .12))), bh = Math.max(56, Math.min(H - top - (low ? 8 : 30), 210)), y0 = top + 4;   // short screens (landscape phones): no legend line
    const oy = Math.max(0, Math.round((H - (y0 + bh + (low ? 8 : 30))) * .5)); ctx.save(); ctx.translate(0, oy);   // a tall screen: the line sits in the middle of its area, not stuck to the top
    // the chords of this cycle (from its strokes; the teacher's cycle where a rhythm has none)
    const nameAt = r => { for (let i = i0; i < i1; i++) if (Math.floor(S.steps[i].t - c0 + 1e-6) === r) return S.steps[i].name; return L.cycle[r]; };
    const runs = []; for (let r = 0; r < C; r++) { const c = nameAt(r), q = runs[runs.length - 1]; if (q && q.c === c) q.n++; else runs.push({ c, r0: r, n: 1 }); }
    const G1 = Math.max(6, Math.min(12, rowW * .015)), RW = (rowW - G1 * (runs.length - 1)) / C;
    const runOf = r => Math.max(0, runs.findIndex(q => r >= q.r0 && r < q.r0 + q.n));
    const rx = r => x0 + r * RW + runOf(r) * G1;
    const per = {}; for (let i = i0; i < i1; i++) { const r = Math.floor(S.steps[i].t - c0 + 1e-6); per[r] = (per[r] || 0) + 1; }
    const lead = low ? 34 : 0;   // low: room for the chord name before the first stroke of a chord
    const sx = st => { const u = st.t - c0, r = Math.floor(u + 1e-6), q = runs[runOf(r)], first = q && r === q.r0, x = first ? rx(r) + lead : rx(r), w = first ? RW - lead : RW; return x + w * ((u - r) + 1 / (2 * (per[r] || 3))); };
    const sc = E.sectionAt(now), listen = sc && sc.kind === 'listen';
    // header: the part of the song · which time round
    ctx.textBaseline = 'middle';
    if (sc && sc.name) { ctx.font = '600 ' + (low ? 11 : 13) + 'px ' + FONT; ctx.fillStyle = 'rgba(255,236,210,.7)'; ctx.textAlign = 'left'; ctx.fillText(PD.i18n.pick(sc.name), x0 + 2, top / 2 + 2); }
    if (sc && sc.to - sc.from >= 2 * C) { const a = Math.floor((c0 - sc.from) / C) + 1, b = Math.round((sc.to - sc.from) / C); ctx.font = '600 ' + (low ? 11 : 13) + 'px ' + FONT; ctx.fillStyle = 'rgba(255,236,210,.55)'; ctx.textAlign = 'right'; ctx.fillText(tr('cy.round', { a: Math.max(1, Math.min(a, b)), b }), x0 + rowW - 2, top / 2 + 2); }
    // chord blocks
    runs.forEach(q => {
      const x = rx(q.r0), w = q.n * RW, col = ccol(q.c), active = now >= c0 + q.r0 - 1e-6 && now < c0 + q.r0 + q.n;
      const g = ctx.createLinearGradient(0, y0, 0, y0 + bh); g.addColorStop(0, hexA(col, active ? .62 : .3)); g.addColorStop(1, hexA(col, active ? .3 : .12));
      ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(x, y0, w, bh, 16) : ctx.rect(x, y0, w, bh); ctx.fill();
      ctx.strokeStyle = hexA(col, active ? 1 : .45); ctx.lineWidth = active ? 2.5 : 1.2; ctx.stroke();
      const fs = low ? Math.round(Math.max(14, Math.min(18, bh * .24))) : Math.round(Math.max(18, Math.min(32, bh * .2, w * .34)));
      ctx.fillStyle = active ? '#FFFFFF' : 'rgba(255,244,230,.85)'; ctx.font = '700 ' + fs + 'px ' + FONT; ctx.textAlign = 'left'; ctx.textBaseline = low ? 'middle' : 'top'; ctx.fillText(q.c, x + 9, low ? y0 + bh * .55 : y0 + 8);
      if (w > 96 && !low) { ctx.font = '600 11px ' + FONT; ctx.fillStyle = 'rgba(255,236,210,.6)'; ctx.textAlign = 'right'; ctx.fillText(tr('sg.rhythms', { n: q.n }), x + w - 10, y0 + 12); }
      // the rhythms inside the chord: a dashed line between them and their number at the bottom (Dm: 1 · 2)
      ctx.setLineDash([4, 5]); ctx.strokeStyle = 'rgba(255,236,210,.28)'; ctx.lineWidth = 1;
      for (let r = q.r0 + 1; r < q.r0 + q.n; r++) { const xr = rx(r); ctx.beginPath(); ctx.moveTo(xr, y0 + bh * .3); ctx.lineTo(xr, y0 + bh - 8); ctx.stroke(); }
      ctx.setLineDash([]);
      if (!low) for (let r = q.r0; r < q.r0 + q.n; r++) { const on = active && now >= c0 + r && now < c0 + r + 1; ctx.font = (on ? '700 ' : '600 ') + '12px ' + FONT; ctx.fillStyle = on ? '#FFE2BA' : 'rgba(255,236,210,.4)'; ctx.textAlign = 'center'; ctx.textBaseline = 'bottom'; ctx.fillText(String(r - q.r0 + 1), rx(r) + RW / 2, y0 + bh - 6); }
    });
    // strokes
    const yA = low ? y0 + bh * .64 : y0 + bh * .56;
    for (let i = i0; i < i1; i++) {
      const st = S.steps[i], x = sx(st), r = Math.floor(st.t - c0 + 1e-6), slot = RW / (per[r] || 3), f = fx[i] || {}, res = S.res[i] || {}, up = st.st === 'up';
      let size = Math.min(bh * (low ? .17 : .2), slot * .4) * (st.acc ? 1.12 : 1), col = st.acc ? ACC : '#FFF4E6', a = 1;
      const isCur = !S.autoplay && i === S.cur, sounding = S.autoplay && now >= st.t - .02 && now < st.t + st.d - .02;
      let miss = false;
      if (S.autoplay) { if (st.t + st.d <= now) a = .45; }
      else if (res.ok) col = '#8EF0B4';
      else if (res.missed) { a = .32; miss = true; }   // missed: faded, with a small × (red is the accent colour)
      if (f.wrong && tm - f.wrong < 500) { col = '#FFFFFF'; miss = true; }
      if (miss) text('×', x, yA + Math.max(16, size * 1.5), 15, '#FF8A7D', 800);
      if (isCur || sounding) { size *= 1.22; ctx.fillStyle = 'rgba(255,240,220,.16)'; ctx.beginPath(); ctx.arc(x, yA, size * 1.45, 0, 7); ctx.fill(); if (isCur) col = '#FFFFFF'; }
      if (f.hit && tm - f.hit < 260) size *= 1 + .3 * (1 - (tm - f.hit) / 260);
      ctx.globalAlpha = listen ? .35 : a; arrow(x, yA, up, size, col, Math.max(2.2, size * (st.acc ? .2 : .15))); ctx.globalAlpha = 1;
    }
    // the cursor: where the music is now, between the strokes of this cycle
    const pts = []; for (let i = i0; i < i1; i++) pts.push([S.steps[i].t - c0, sx(S.steps[i])]);
    if (pts.length) {
      pts.push([C + pts[0][0], x0 + rowW + 2]);
      const u = now - c0; let cx = pts[0][1];
      for (let j = 0; j < pts.length - 1; j++) if (u >= pts[j][0]) cx = pts[j][1] + (pts[j + 1][1] - pts[j][1]) * Math.min(1, (u - pts[j][0]) / Math.max(1e-6, pts[j + 1][0] - pts[j][0]));
      ctx.fillStyle = 'rgba(240,180,101,.14)'; ctx.fillRect(cx - 9, y0 - 2, 18, bh + 4);
      ctx.fillStyle = 'rgba(255,226,186,.95)'; ctx.fillRect(cx - 1.25, y0 - 4, 2.5, bh + 8);
      ctx.beginPath(); ctx.moveTo(cx - 6, y0 - 9); ctx.lineTo(cx + 6, y0 - 9); ctx.lineTo(cx, y0 - 2); ctx.closePath(); ctx.fill();
    }
    if (listen) { ctx.fillStyle = 'rgba(20,12,7,.62)'; ctx.fillRect(x0, y0, rowW, bh); if (low) text('♪ ' + tr('p.listenPart'), Wd / 2, top / 2 + 2, 12, 'rgba(255,236,210,.9)', 600); else text('♪ ' + tr('p.listenPart'), Wd / 2, y0 + bh / 2, 18, 'rgba(255,236,210,.9)', 600); }
    // below: what the arrows mean · the next part of the song
    const yb = y0 + bh + 14;
    if (!low && yb < H - 4) {
      ctx.font = '500 12px ' + FONT; ctx.textBaseline = 'middle'; ctx.textAlign = 'left'; ctx.fillStyle = 'rgba(255,236,210,.45)'; ctx.fillText(tr('cy.legend'), x0 + 2, yb);
      const nx = (S.lesson.sections || []).find(s2 => s2.from >= c0 + C - 1e-6 && s2.from < c0 + 2 * C);
      if (nx && sc && nx !== sc) { ctx.textAlign = 'right'; ctx.fillStyle = 'rgba(255,226,186,.8)'; ctx.fillText(tr('cy.next', { s: PD.i18n.pick(nx.name) }), x0 + rowW - 2, yb); }
    }
    ctx.restore();
  }
  /* ---------- the same cycle, running DOWN (portrait phone, beside the upright neck) ----------
     One block per chord, as tall as its rhythms (Dm = 2 rows, B♭ = 1, C = 1); each row is one rhythm ↓ ↓ ↑,
     read left to right; the cursor walks along the row with the music, then drops to the next one. */
  function drawCycleV(tm) {
    const L = S.lesson, C = L.cycle.length, now = E.visualNow(), Wd = G.W, H = G.H;
    if (cyFor !== S.steps) { cyFor = S.steps; cyIdx = []; let i = 0; const last = S.steps.length ? S.steps[S.steps.length - 1].t : 0, n = Math.floor(last / C) + 2; for (let k = 0; k <= n; k++) { while (i < S.steps.length && S.steps[i].t < k * C - 1e-6) i++; cyIdx[k] = i; } }
    const k = Math.max(0, Math.min(cyIdx.length - 2, Math.floor(now / C + 1e-6))), c0 = k * C, i0 = cyIdx[k], i1 = cyIdx[k + 1];
    const nameAt = r => { for (let i = i0; i < i1; i++) if (Math.floor(S.steps[i].t - c0 + 1e-6) === r) return S.steps[i].name; return L.cycle[r]; };
    const runs = []; for (let r = 0; r < C; r++) { const c = nameAt(r), q = runs[runs.length - 1]; if (q && q.c === c) q.n++; else runs.push({ c, r0: r, n: 1 }); }
    const runOf = r => Math.max(0, runs.findIndex(q => r >= q.r0 && r < q.r0 + q.n));
    const pad = 10, x0 = pad, rowW = Wd - pad * 2, head = 40, legend = 48, G1 = 10;
    const rh = Math.max(54, Math.min(92, (H - head - legend - G1 * (runs.length - 1)) / C));
    const used = head + rh * C + G1 * (runs.length - 1) + legend, oy = Math.max(0, Math.round((H - used) * .45));
    ctx.save(); ctx.translate(0, oy);
    const ry = r => head + r * rh + runOf(r) * G1;   // top of rhythm row r
    const per = {}; for (let i = i0; i < i1; i++) { const r = Math.floor(S.steps[i].t - c0 + 1e-6); per[r] = (per[r] || 0) + 1; }
    const nameW = Math.max(54, Math.min(84, rowW * .3)), ax0 = x0 + nameW, aw = rowW - nameW - 8;
    const pos = st => { const u = st.t - c0, r = Math.floor(u + 1e-6); return [ax0 + aw * ((u - r) + 1 / (2 * (per[r] || 3))), ry(r) + rh / 2]; };
    const sc = E.sectionAt(now), listen = sc && sc.kind === 'listen';
    ctx.textBaseline = 'middle';
    if (sc && sc.name) { ctx.font = '600 13px ' + FONT; ctx.fillStyle = 'rgba(255,236,210,.7)'; ctx.textAlign = 'left'; ctx.fillText(PD.i18n.pick(sc.name), x0 + 2, head / 2); }
    if (sc && sc.to - sc.from >= 2 * C) { const a = Math.floor((c0 - sc.from) / C) + 1, b = Math.round((sc.to - sc.from) / C); ctx.font = '600 13px ' + FONT; ctx.fillStyle = 'rgba(255,236,210,.55)'; ctx.textAlign = 'right'; ctx.fillText(tr('cy.round', { a: Math.max(1, Math.min(a, b)), b }), x0 + rowW - 2, head / 2); }
    runs.forEach(q => {
      const y = ry(q.r0), hh = q.n * rh, col = ccol(q.c), active = now >= c0 + q.r0 - 1e-6 && now < c0 + q.r0 + q.n;
      const g = ctx.createLinearGradient(x0, 0, x0 + rowW, 0); g.addColorStop(0, hexA(col, active ? .62 : .3)); g.addColorStop(1, hexA(col, active ? .28 : .1));
      ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(x0, y, rowW, hh, 16) : ctx.rect(x0, y, rowW, hh); ctx.fill();
      ctx.strokeStyle = hexA(col, active ? 1 : .45); ctx.lineWidth = active ? 2.5 : 1.2; ctx.stroke();
      const fs = Math.round(Math.max(20, Math.min(34, rh * .42, nameW * .42)));
      ctx.fillStyle = active ? '#FFFFFF' : 'rgba(255,244,230,.85)'; ctx.font = '700 ' + fs + 'px ' + FONT; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText(q.c, x0 + 12, y + Math.min(hh / 2, rh / 2));
      if (q.n > 1) { ctx.font = '600 11px ' + FONT; ctx.fillStyle = 'rgba(255,236,210,.6)'; ctx.fillText(tr('sg.rhythms', { n: q.n }), x0 + 12, y + rh / 2 + fs * .75); }
      ctx.setLineDash([4, 5]); ctx.strokeStyle = 'rgba(255,236,210,.28)'; ctx.lineWidth = 1;
      for (let r = q.r0 + 1; r < q.r0 + q.n; r++) { const yr = ry(r); ctx.beginPath(); ctx.moveTo(ax0 - 4, yr); ctx.lineTo(x0 + rowW - 8, yr); ctx.stroke(); }
      ctx.setLineDash([]);
      for (let r = q.r0; r < q.r0 + q.n; r++) { const on = active && now >= c0 + r && now < c0 + r + 1; ctx.font = (on ? '700 ' : '600 ') + '11px ' + FONT; ctx.fillStyle = on ? '#FFE2BA' : 'rgba(255,236,210,.4)'; ctx.textAlign = 'right'; ctx.fillText(String(r - q.r0 + 1), x0 + rowW - 7, ry(r) + 12); }
    });
    for (let i = i0; i < i1; i++) {
      const st = S.steps[i], [x, yA] = pos(st), r = Math.floor(st.t - c0 + 1e-6), slot = aw / (per[r] || 3), f = fx[i] || {}, res = S.res[i] || {}, up = st.st === 'up';
      let size = Math.min(rh * .26, slot * .36) * (st.acc ? 1.12 : 1), col = st.acc ? ACC : '#FFF4E6', a = 1, miss = false;
      const isCur = !S.autoplay && i === S.cur, sounding = S.autoplay && now >= st.t - .02 && now < st.t + st.d - .02;
      if (S.autoplay) { if (st.t + st.d <= now) a = .45; }
      else if (res.ok) col = '#8EF0B4';
      else if (res.missed) { a = .32; miss = true; }
      if (f.wrong && tm - f.wrong < 500) { col = '#FFFFFF'; miss = true; }
      if (miss) text('×', x + size * 1.1, yA + size * .9, 13, '#FF8A7D', 800);
      if (isCur || sounding) { size *= 1.2; ctx.fillStyle = 'rgba(255,240,220,.16)'; ctx.beginPath(); ctx.arc(x, yA, size * 1.45, 0, 7); ctx.fill(); if (isCur) col = '#FFFFFF'; }
      if (f.hit && tm - f.hit < 260) size *= 1 + .3 * (1 - (tm - f.hit) / 260);
      ctx.globalAlpha = listen ? .35 : a; arrow(x, yA, up, size, col, Math.max(2.2, size * (st.acc ? .2 : .15))); ctx.globalAlpha = 1;
    }
    // cursor: along the current row, then down to the next
    const pts = []; for (let i = i0; i < i1; i++) { const [x, y] = pos(S.steps[i]); pts.push([S.steps[i].t - c0, x, y]); }
    if (pts.length) {
      pts.push([C + pts[0][0], ax0 + aw, pts[pts.length - 1][2]]);
      const u = now - c0; let cx = pts[0][1], cyy = pts[0][2];
      for (let j = 0; j < pts.length - 1; j++) if (u >= pts[j][0]) { const p0 = pts[j], p1 = pts[j + 1], e = Math.min(1, (u - p0[0]) / Math.max(1e-6, p1[0] - p0[0])); cyy = p0[2]; cx = p1[2] === p0[2] ? p0[1] + (p1[1] - p0[1]) * e : p0[1] + (ax0 + aw - p0[1]) * e; }
      ctx.fillStyle = 'rgba(240,180,101,.14)'; ctx.fillRect(cx - 9, cyy - rh / 2 + 4, 18, rh - 8);
      ctx.fillStyle = 'rgba(255,226,186,.95)'; ctx.fillRect(cx - 1.25, cyy - rh / 2 + 2, 2.5, rh - 4);
    }
    if (listen) { const yy = ry(0), hh = ry(C - 1) + rh - yy; ctx.fillStyle = 'rgba(20,12,7,.55)'; ctx.fillRect(x0, yy, rowW, hh); text('♪ ' + tr('p.listenPart'), Wd / 2, yy + hh / 2, 17, 'rgba(255,236,210,.92)', 600); }
    const yb = ry(C - 1) + rh + 16;
    ctx.font = '500 11.5px ' + FONT; ctx.textBaseline = 'middle'; ctx.textAlign = 'left'; ctx.fillStyle = 'rgba(255,236,210,.45)';
    const lines = []; tr('cy.legend').split(' · ').forEach(part => { const l = lines.length ? lines[lines.length - 1] + ' · ' + part : null; if (l && ctx.measureText(l).width <= rowW - 4) lines[lines.length - 1] = l; else lines.push(part); });   // wraps in a narrow column
    lines.forEach((l, j) => ctx.fillText(l, x0 + 2, yb + j * 15));
    const nx = (S.lesson.sections || []).find(s2 => s2.from >= c0 + C - 1e-6 && s2.from < c0 + 2 * C);
    if (nx && sc && nx !== sc) { ctx.fillStyle = 'rgba(255,226,186,.8)'; ctx.fillText(tr('cy.next', { s: PD.i18n.pick(nx.name) }), x0 + 2, yb + lines.length * 15 + 2); }
    ctx.restore();
  }
  function drawSong(tm) {
    const now = E.visualNow(), px = PX(), bpb = E.bpb(), cy = G.cy, bh = G.bh, y0 = cy - bh / 2;
    const v0 = now - 2, v1 = now + G.beats + 1;
    // listen sections and section names
    (S.lesson.sections || []).forEach(sc => {
      if (sc.to < v0 || sc.from > v1) return;
      const xa = X(sc.from), xb = X(sc.to);
      if (sc.kind === 'listen') { const l = Math.min(xa, xb), w = Math.abs(xb - xa); ctx.fillStyle = 'rgba(255,236,210,.05)'; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(l + 2, y0, w - 4, bh, 14) : ctx.rect(l, y0, w, bh); ctx.fill();
        const lx = Math.max(Math.min(xa, xb) + 16, px + 16); if (lx < Math.max(xa, xb) - 40) { ctx.fillStyle = 'rgba(255,236,210,.55)'; ctx.font = '600 14px ' + FONT; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText('♪ ' + tr('p.listenPart'), lx, cy); } }
      // section names: upcoming ones at their start; the current one pinned at the play line until the next name arrives
      const nm = PD.i18n.pick(sc.name), nextX = X(sc.to);
      if (!self.mirror && Math.abs(xb - xa) > 30) {
        let lx = xa >= px ? xa + 4 : px + 6;
        if (xa < px && nextX - lx < 150) lx = null;
        if (lx != null) { ctx.fillStyle = 'rgba(255,236,210,.62)'; ctx.font = '600 11px ' + FONT; ctx.textAlign = 'left'; ctx.textBaseline = 'bottom'; ctx.fillText(nm, lx, y0 - 6); }
      }
    });
    // chord blocks: consecutive steps with the same chord inside one bar
    const runs = []; let cur = null;
    for (let i = 0; i < S.steps.length; i++) {
      const st = S.steps[i]; if (st.t + st.d < v0) continue; if (st.t > v1) break;
      const bar = Math.floor(st.t / bpb + 1e-6);
      if (cur && cur.name === st.name && cur.bar === bar) { cur.to = st.t + st.d; cur.steps.push(st); }
      else { cur = { name: st.name, bar, from: st.t, to: st.t + st.d, steps: [st] }; runs.push(cur); }
    }
    runs.forEach(r => {
      const xa = X(r.from), xb = X(r.to), l = Math.min(xa, xb) + 2, w = Math.abs(xb - xa) - 4, col = ccol(r.name);
      const past = r.to <= now, active = r.from <= now + 1e-6 && r.to > now;
      ctx.save(); ctx.globalAlpha = past ? .35 : 1;
      const g = ctx.createLinearGradient(0, y0, 0, y0 + bh); g.addColorStop(0, hexA(col, active ? .55 : .32)); g.addColorStop(1, hexA(col, active ? .28 : .14));
      ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(l, y0, w, bh, 14) : ctx.rect(l, y0, w, bh); ctx.fill();
      ctx.strokeStyle = hexA(col, active ? .95 : .5); ctx.lineWidth = active ? 2 : 1.2; ctx.stroke();
      // chord name: stays readable at the play line while its block passes
      const nxp = self.mirror ? Math.min(xa, px - 8) - 4 : Math.max(l + 10, Math.min(px + 10, l + w - 40));
      ctx.fillStyle = '#FFF4E6'; ctx.font = '700 ' + Math.round(Math.min(30, bh * .28)) + 'px ' + FONT; ctx.textAlign = self.mirror ? 'right' : 'left'; ctx.textBaseline = 'top';
      if (w > 24) ctx.fillText(r.name, nxp, y0 + 8);
      // a faint line between rhythms inside one chord (Dm = 2 rhythms)
      ctx.strokeStyle = 'rgba(255,236,210,.18)'; ctx.lineWidth = 1;
      for (let k = Math.floor(r.from) + 1; k < r.to - 1e-6; k++) { const xk = X(k) - (self.mirror ? -1 : 1) * G.ppb * .08; ctx.beginPath(); ctx.moveTo(xk, y0 + bh * .42); ctx.lineTo(xk, y0 + bh * .9); ctx.stroke(); }
      // strokes
      r.steps.forEach(st => {
        const x = X(st.t), f = fx[st.i] || {}, res = S.res[st.i] || {}, up = st.st === 'up';
        const sp = Math.max(8, G.ppb * st.d);
        let c = st.acc ? ACC : '#FFF4E6', a = 1, s2 = Math.min(st.acc ? bh * .2 : bh * .15, sp * (st.acc ? .62 : .5)), w2 = Math.min(st.acc ? 4.2 : 2.6, sp * .22);
        if (f.hit && tm - f.hit < 260) { const k = (tm - f.hit) / 260; s2 *= 1 + .35 * (1 - k); c = '#FFFFFF'; }
        else if (res.ok) a = .55; else if (res.missed) { c = '#FF8A7D'; a = .6; }
        ctx.globalAlpha = (past ? .35 : 1) * a;
        arrow(x, y0 + bh * .66, up, s2, c, w2);
      });
      ctx.restore();
    });
    // play line
    const pg = ctx.createLinearGradient(0, 0, 0, G.H); pg.addColorStop(0, 'rgba(255,240,220,0)'); pg.addColorStop(.15, 'rgba(255,240,220,.7)'); pg.addColorStop(.85, 'rgba(255,240,220,.7)'); pg.addColorStop(1, 'rgba(255,240,220,0)');
    ctx.fillStyle = 'rgba(240,180,101,.10)'; ctx.fillRect(px - 12, 0, 24, G.H); ctx.fillStyle = pg; ctx.fillRect(px - 1, 0, 2, G.H);
    // beat dots under the blocks
    for (let b = Math.max(0, Math.floor(v0)); b <= v1; b++) { const x = X(b); ctx.fillStyle = b % bpb === 0 ? 'rgba(255,236,210,.45)' : 'rgba(255,236,210,.18)'; ctx.beginPath(); ctx.arc(x, y0 + bh + 10, b % bpb === 0 ? 3 : 2, 0, 7); ctx.fill(); }
  }

  function draw() {
    const t = performance.now();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, G.W, G.H);
    if (!S.lesson) return;
    if (self.song && S.lesson.cycle && S.lesson.cycle.length) (G.H > G.W * 1.15 ? drawCycleV : drawCycle)(t); else if (self.song) drawSong(t); else if (self.rhythm) drawRhythm(t); else drawNotes(t);
    if (countT && t - countT < 900) { const k = (t - countT) / 900; ctx.save(); ctx.globalAlpha = 1 - k * .7; text(count > 0 ? String(count) : tr('ci.start'), G.W / 2, G.H / 2, count > 0 ? Math.min(96, G.H * .5) : Math.min(48, G.H * .25), '#FFFFFF', 700); ctx.restore(); }
  }

  Object.assign(self, {
    layout, draw,
    hit(i, grade) { fx[i] = Object.assign(fx[i] || {}, { hit: performance.now() }); if (grade) { fx[i].grade = grade; fx[i].gradeT = performance.now(); } },
    wrong(i) { fx[i] = Object.assign(fx[i] || {}, { wrong: performance.now() }); },
    miss(i) { fx[i] = Object.assign(fx[i] || {}, { grade: 'miss', gradeT: performance.now() }); },
    reset() { Object.keys(fx).forEach(k => delete fx[k]); },
    /** forget hit/miss marks for steps at or after beat b (after a seek or loop jump) */
    resetFrom(b) { S.steps.forEach((st, i) => { if (st.t >= b - 1e-6) delete fx[i]; }); },
    count(k) { count = k; countT = performance.now(); }
  });
  return self;
};
