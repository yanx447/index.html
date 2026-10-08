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
    if (self.song) { G.beats = W < 520 ? 6 : W < 900 ? 8 : 10; G.ppb = Math.max(40, (W - G.px - 16) / G.beats); G.cy = H * .5; G.bh = Math.max(64, Math.min(150, H * .56)); }
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
    if (self.song) drawSong(t); else if (self.rhythm) drawRhythm(t); else drawNotes(t);
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
