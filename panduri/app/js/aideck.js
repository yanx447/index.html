/* =====================================================================
   AI studio player — one Web Audio deck for the original song and the
   AI stems: tempo and pitch change independently (WSOLA time-stretch,
   guided by the whole mix so every stem stays aligned, then resampled),
   per-track volume / mute / solo / pan, A–B loop, a click on the
   song's own beats, a count-in, and rendering the current mix to WAV.
   Everything runs on the device.
   ===================================================================== */
PD.aiDeck = (() => {
  const AC = window.AudioContext || window.webkitAudioContext;

  /* ---------- the DSP worker: time-stretch + pitch shift ---------- */
  const DSPW = function () {
    const NW = 2048, HS = 1024, TOL = 384, OV = 1024;
    const win = new Float32Array(NW); for (let i = 0; i < NW; i++) win[i] = .5 - .5 * Math.cos(2 * Math.PI * i / NW);   // periodic Hann: sums to 1 at 50 %
    function plan(g, ratio) {
      const HA = HS / ratio, nOut = Math.floor(g.length * ratio), K = Math.ceil(nOut / HS) + 1, pos = new Int32Array(K);
      for (let k = 1; k < K; k++) {
        const nom = Math.round(k * HA), nat = pos[k - 1] + HS; let best = 0, bs = -Infinity;
        if (nat + OV < g.length) for (let d = -TOL; d <= TOL; d += 2) { const a = nom + d; if (a < 0 || a + OV >= g.length) continue; let s = 0; for (let i = 0; i < OV; i += 4) s += g[a + i] * g[nat + i]; if (s > bs) { bs = s; best = d; } }
        pos[k] = Math.max(0, Math.min(g.length - 1, nom + best));
      }
      return { pos, nOut, K };
    }
    function stretch(x, P) {
      const y = new Float32Array(P.nOut + NW);
      for (let k = 0; k < P.K; k++) { const a = P.pos[k], o = k * HS; for (let i = 0; i < NW; i++) { const j = a + i; if (j >= x.length) break; y[o + i] += x[j] * win[i]; } }
      return y.subarray(0, P.nOut);
    }
    function resample(y, p, n) { const out = new Float32Array(n); for (let j = 0; j < n; j++) { const a = j * p, i = Math.floor(a), f = a - i; out[j] = (y[i] || 0) * (1 - f) + (y[i + 1] || 0) * f; } return out; }
    self.onmessage = e => {
      const { id, chans, speed, semis } = e.data;
      try {
        const p = Math.pow(2, semis / 12), ratio = p / speed, N = chans[0].length, nFinal = Math.floor(N / speed);
        const g = new Float32Array(N); chans.forEach(c => { for (let i = 0; i < N; i++) g[i] += c[i]; });
        const P = plan(g, ratio);
        const out = chans.map(c => { const y = ratio === 1 ? c : stretch(c, P); return p === 1 ? (y.length === nFinal ? y : y.slice(0, nFinal)) : resample(y, p, nFinal); });
        self.postMessage({ id, out }, out.map(a => a.buffer));
      } catch (err) { self.postMessage({ id, err: String(err && err.message || err) }); }
    };
  };
  let dsp = null, seq = 0; const pend = new Map();
  function dspRun(chans, speed, semis) {
    if (!dsp) {
      dsp = new Worker(URL.createObjectURL(new Blob(['(' + DSPW.toString() + ')()'], { type: 'text/javascript' })));
      dsp.onmessage = e => { const q = pend.get(e.data.id); if (!q) return; pend.delete(e.data.id); if (e.data.err) q.rej(new Error(e.data.err)); else q.res(e.data.out); };
    }
    const id = ++seq;
    return new Promise((res, rej) => { pend.set(id, { res, rej }); dsp.postMessage({ id, chans: chans.map(c => c.slice()), speed, semis }); });
  }

  /* ---------- a deck ---------- */
  function create(onChange) {
    const ctx = new AC(), master = ctx.createGain(), clickBus = ctx.createGain();
    master.connect(ctx.destination); clickBus.connect(ctx.destination);
    const D = { set: null, speed: 1, semis: 0, gain: [], mute: [], solo: -1, pan: [], loop: { on: false, a: 0, b: 0 }, click: { on: false, vol: .6 }, countIn: false, beats: [], bpm: 100, phase: 0, playing: false, preparing: false, at: 0 };
    let bufs = null, bufKey = '', nodes = null, t0 = 0, off = 0, timer = 0, lastP = -1, token = 0;
    const cache = new Map();
    const changed = () => { try { onChange && onChange(D); } catch (_) {} };
    const key = () => D.set.id + '|' + D.speed + '|' + D.semis;
    const dur = () => D.set ? D.set.tracks[0].L.length / D.set.sr : 0;
    async function ensure() {
      const k = key(); if (bufKey === k && bufs) return true;
      if (cache.has(k)) { bufs = cache.get(k); bufKey = k; return true; }
      D.preparing = true; changed();
      let chans = D.set.tracks.flatMap(t => [t.L, t.R]);
      try { if (D.speed !== 1 || D.semis !== 0) chans = await dspRun(chans, D.speed, D.semis); }
      catch (e) { D.preparing = false; changed(); throw e; }
      if (key() !== k) return false;   // settings moved on while we worked
      const sr = D.set.sr, out = D.set.tracks.map((_, i) => { const b = ctx.createBuffer(2, chans[2 * i].length, sr); b.copyToChannel(chans[2 * i], 0); b.copyToChannel(chans[2 * i + 1], 1); return b; });
      for (const kk of [...cache.keys()]) if (!/\|1\|0$/.test(kk)) cache.delete(kk);   // keep the originals + the newest version
      cache.set(k, out); bufs = out; bufKey = k; D.preparing = false; changed();
      return true;
    }
    const lvl = i => D.solo >= 0 ? (i === D.solo ? D.gain[i] : 0) : (D.mute[i] ? 0 : D.gain[i]);
    function applyMix() { if (!nodes) return; nodes.forEach((n, i) => { n.g.gain.setTargetAtTime(lvl(i) == null ? 1 : lvl(i), ctx.currentTime, .015); if (n.p) n.p.pan.setTargetAtTime(D.pan[i] || 0, ctx.currentTime, .015); }); }
    function stopNodes() { if (nodes) nodes.forEach(n => { try { n.s.onended = null; n.s.stop(); } catch (_) {} try { n.s.disconnect(); n.g.disconnect(); n.p && n.p.disconnect(); } catch (_) {} }); nodes = null; clearInterval(timer); timer = 0; }
    function tau(p) { return (p - D.set.from) / D.speed; }
    function pos() {
      if (!D.set) return 0;
      if (!D.playing || !nodes) return D.at;
      const el = ctx.currentTime - t0; if (el < 0) return D.at;
      let t = off + el;
      if (D.loop.on) { const ls = tau(D.loop.a), le = tau(D.loop.b); if (le > ls && t >= le) t = ls + ((t - ls) % (le - ls)); }
      return Math.min(D.set.from + dur(), D.set.from + t * D.speed);
    }
    function click(when, accent) {
      const o = ctx.createOscillator(), g = ctx.createGain(); o.frequency.value = accent ? 1760 : 1175; o.type = 'triangle';
      g.gain.setValueAtTime(0, when); g.gain.linearRampToValueAtTime(accent ? 1 : .6, when + .002); g.gain.exponentialRampToValueAtTime(.001, when + .05);
      o.connect(g).connect(clickBus); o.start(when); o.stop(when + .06);
    }
    const isBar = k => ((k - D.phase) % 4 + 4) % 4 === 0;
    function schedule() {
      if (!D.playing || !D.click.on || !D.beats.length) return;
      const now = ctx.currentTime; if (now < t0) return;
      const p = pos(), look = .15 * D.speed; let p2 = p + look;
      if (lastP < 0 || p < lastP - look - .2) lastP = p - .001;
      const sched = (from, to, base) => { for (let k = 0; k < D.beats.length; k++) { const b = D.beats[k]; if (b > from && b <= to) click(base + (b - p) / D.speed, isBar(k)); } };
      if (D.loop.on && p2 > D.loop.b && D.loop.b > D.loop.a) { sched(lastP, D.loop.b, now); const rest = p2 - D.loop.b; sched(D.loop.a - .001, D.loop.a + rest, now + (D.loop.b - p) / D.speed - (D.loop.a - p) / D.speed); lastP = D.loop.a + rest; }
      else { sched(lastP, p2, now); lastP = p2; }
    }
    async function play() {
      if (!D.set || D.playing) return;
      const my = ++token; try { await ctx.resume(); } catch (_) {}
      if (!(await ensure().catch(() => false)) || my !== token) return;
      let p = D.at; if (D.loop.on && (p < D.loop.a || p >= D.loop.b)) p = D.loop.a; if (p >= D.set.from + dur() - .05) p = D.set.from;
      D.at = p;
      let start = ctx.currentTime + .04;
      if (D.countIn && D.bpm) { const iv = 60 / (D.bpm * D.speed); for (let i = 0; i < 4; i++) click(start + i * iv, i === 0); start += 4 * iv; }
      nodes = bufs.map((b, i) => {
        const s = ctx.createBufferSource(), g = ctx.createGain(), pn = ctx.createStereoPanner ? ctx.createStereoPanner() : null; s.buffer = b;
        if (D.loop.on && D.loop.b > D.loop.a) { s.loop = true; s.loopStart = tau(D.loop.a); s.loopEnd = tau(D.loop.b); }
        g.gain.value = lvl(i) == null ? 1 : lvl(i); if (pn) pn.pan.value = D.pan[i] || 0;
        s.connect(g); (pn ? g.connect(pn) : g).connect(master);
        s.start(start, Math.max(0, tau(p))); return { s, g, p: pn };
      });
      const tk = token; nodes[0].s.onended = () => { if (tk !== token) return; D.playing = false; D.at = D.set.from; stopNodes(); changed(); };
      t0 = start; off = Math.max(0, tau(p)); D.playing = true; lastP = -1;
      timer = setInterval(schedule, 25); schedule(); changed();
    }
    function pause() { if (!D.playing) return; D.at = pos(); token++; D.playing = false; stopNodes(); changed(); }
    async function restart() { if (D.playing) { const p = pos(); pause(); D.at = p; await play(); } }
    const api = {
      D, ctx,
      get playing() { return D.playing; }, get preparing() { return D.preparing; },
      dur, pos, play, pause, toggle: () => D.playing ? pause() : play(),
      setSet(set, keepPos) {
        const p = keepPos ? pos() : 0, was = D.playing; pause();
        D.set = set; bufs = null; bufKey = '';
        D.gain = set.tracks.map(() => 1); D.mute = set.tracks.map(() => false); D.pan = set.tracks.map(() => 0); D.solo = -1;
        D.at = Math.max(set.from, Math.min(set.from + dur() - .05, p));
        if (D.loop.on && (D.loop.a < set.from || D.loop.b > set.from + dur())) D.loop.on = false;
        ensure().catch(() => {}); if (was) play(); else changed();
      },
      seek(p) { if (!D.set) return; p = Math.max(D.set.from, Math.min(D.set.from + dur() - .05, p)); if (D.playing) { pause(); D.at = p; play(); } else { D.at = p; changed(); } },
      async setSpeed(x) { D.speed = x; if (D.playing) await restart(); else { ensure().catch(() => {}); changed(); } },
      async setPitch(s) { D.semis = s; if (D.playing) await restart(); else { ensure().catch(() => {}); changed(); } },
      setGain(i, v) { D.gain[i] = v; applyMix(); }, setMute(i, v) { D.mute[i] = v; applyMix(); }, setSolo(i) { D.solo = i; applyMix(); }, setPan(i, v) { D.pan[i] = v; applyMix(); },
      setLoop(a, b) { if (b - a < .25) return; D.loop = { on: true, a, b }; if (D.playing) restart(); changed(); },
      clearLoop() { D.loop.on = false; if (D.playing) restart(); changed(); },
      setClick(on, vol) { D.click.on = on; if (vol != null) D.click.vol = vol; clickBus.gain.value = D.click.vol; lastP = -1; changed(); },
      setCountIn(on) { D.countIn = on; changed(); },
      setBeats(beats, bpm, phase) { D.beats = beats || []; D.bpm = bpm || 100; D.phase = phase || 0; },
      /** the beat at time p: { k, bar, beat } */
      beatAt(p) { const B = D.beats; if (!B.length || p < B[0] - .05) return null; let lo = 0, hi = B.length - 1; while (lo < hi) { const m = (lo + hi + 1) >> 1; if (B[m] <= p + .02) lo = m; else hi = m - 1; } const rel = lo - D.phase, bar = Math.floor(rel / 4); return { k: lo, bar: bar + 1 + (D.phase > 0 ? 1 : 0), beat: ((rel % 4) + 4) % 4 + 1 }; },
      /** render the current mix (speed, pitch, levels, pan) → { L, R, sr } */
      async render() {
        await ensure(); const sr = D.set.sr, len = bufs[0].length, oc = new OfflineAudioContext(2, len, sr);
        bufs.forEach((b, i) => { const s = oc.createBufferSource(), g = oc.createGain(); s.buffer = b; g.gain.value = lvl(i) == null ? 1 : lvl(i); let n = s.connect(g); if (oc.createStereoPanner) { const pn = oc.createStereoPanner(); pn.pan.value = D.pan[i] || 0; n = g.connect(pn); } n.connect(oc.destination); s.start(0); });
        const r = await oc.startRendering(); return { L: r.getChannelData(0), R: r.getChannelData(1), sr };
      },
      destroy() { pause(); cache.clear(); bufs = null; try { ctx.close(); } catch (_) {} }
    };
    clickBus.gain.value = D.click.vol;
    return api;
  }
  return { create };
})();
