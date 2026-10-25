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

  /* ---------- effects: per-track EQ + reverb/echo sends, a gentle master compressor ---------- */
  function impulse(c, sec) {   // a smooth hall: decaying noise with a soft onset, different per side
    const sr = c.sampleRate, n = Math.floor(sr * sec), b = c.createBuffer(2, n, sr);
    for (let ch = 0; ch < 2; ch++) { const d = b.getChannelData(ch); let seed = ch ? 7919 : 104729; for (let i = 0; i < n; i++) { seed = (seed * 16807) % 2147483647; const r = seed / 2147483647 * 2 - 1, k = i / n; d[i] = r * Math.pow(1 - k, 3.4) * Math.min(1, i / (sr * .015)) * .55; } }
    return b;
  }
  function makeBus(c, n) {
    const master = c.createGain(), comp = c.createDynamicsCompressor(); master.connect(comp); comp.connect(c.destination);
    const conv = c.createConvolver(); conv.buffer = impulse(c, 2.6); const revIn = c.createGain(), revOut = c.createGain(); revOut.gain.value = .9; revIn.connect(conv); conv.connect(revOut); revOut.connect(master);
    const echoIn = c.createGain(), dl = c.createDelay(2), fb = c.createGain(), tone = c.createBiquadFilter(); tone.type = 'lowpass'; tone.frequency.value = 3200; fb.gain.value = .36;
    echoIn.connect(dl); dl.connect(tone); tone.connect(fb); fb.connect(dl); tone.connect(master);
    const strips = Array.from({ length: n }, () => {
      const g = c.createGain(), lo = c.createBiquadFilter(), mi = c.createBiquadFilter(), hi = c.createBiquadFilter(), pn = c.createStereoPanner ? c.createStereoPanner() : null, sr = c.createGain(), se = c.createGain();
      lo.type = 'lowshelf'; lo.frequency.value = 180; mi.type = 'peaking'; mi.frequency.value = 1000; mi.Q.value = .8; hi.type = 'highshelf'; hi.frequency.value = 4500;
      g.connect(lo); lo.connect(mi); mi.connect(hi); let last = hi; if (pn) { hi.connect(pn); last = pn; }
      last.connect(master); last.connect(sr); sr.connect(revIn); last.connect(se); se.connect(echoIn); sr.gain.value = 0; se.gain.value = 0;
      return { g, lo, mi, hi, pn, sr, se };
    });
    return { master, comp, dl, strips, nodes: [master, comp, conv, revIn, revOut, echoIn, dl, fb, tone] };
  }
  const FX0 = () => ({ low: 0, mid: 0, high: 0, rev: 0, echo: 0 });

  /* ---------- a deck ---------- */
  function create(onChange) {
    const ctx = new AC(), master = ctx.createGain(), clickBus = ctx.createGain();
    master.connect(ctx.destination); clickBus.connect(ctx.destination);
    const D = { set: null, speed: 1, semis: 0, gain: [], mute: [], solo: -1, pan: [], loop: { on: false, a: 0, b: 0 }, click: { on: false, vol: .6 }, countIn: false, beats: [], bpm: 100, phase: 0, bpb: 4, playing: false, preparing: false, at: 0, fx: [], comp: false };
    let bufs = null, bufKey = '', nodes = null, t0 = 0, off = 0, timer = 0, lastP = -1, token = 0, B = null;
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
    function applyFx(X, c, live) {
      if (!X) return; const now = c.currentTime, T = (pr, v) => { if (live) pr.setTargetAtTime(v, now, .02); else pr.value = v; };
      X.strips.forEach((st, i) => { const f = D.fx[i] || FX0(), v = lvl(i); T(st.g.gain, v == null ? 1 : v); T(st.lo.gain, f.low); T(st.mi.gain, f.mid); T(st.hi.gain, f.high); if (st.pn) T(st.pn.pan, D.pan[i] || 0); T(st.sr.gain, f.rev * .9); T(st.se.gain, f.echo * .7); });
      X.dl.delayTime.value = Math.min(1.9, 60 / ((D.bpm || 100) * D.speed) * .75);   // a dotted eighth at the tempo you hear
      const on = D.comp; T(X.comp.threshold, on ? -24 : 0); T(X.comp.ratio, on ? 3.5 : 1); T(X.comp.knee, on ? 14 : 0); X.comp.attack.value = .008; X.comp.release.value = .18;
    }
    function applyMix() { applyFx(B, ctx, true); }
    function stopNodes() { if (nodes) nodes.forEach(n => { try { n.s.onended = null; n.s.stop(); } catch (_) {} try { n.s.disconnect(); } catch (_) {} }); nodes = null; clearInterval(timer); timer = 0; }
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
    const isBar = k => ((k - D.phase) % (D.bpb || 4) + (D.bpb || 4)) % (D.bpb || 4) === 0;
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
      applyFx(B, ctx, false);
      if (!(await ensure().catch(() => false)) || my !== token) return;
      let p = D.at; if (D.loop.on && (p < D.loop.a || p >= D.loop.b)) p = D.loop.a; if (p >= D.set.from + dur() - .05) p = D.set.from;
      D.at = p;
      let start = ctx.currentTime + .04;
      if (D.countIn && D.bpm) { const iv = 60 / (D.bpm * D.speed); for (let i = 0; i < 4; i++) click(start + i * iv, i === 0); start += 4 * iv; }
      nodes = bufs.map((b, i) => {
        const s = ctx.createBufferSource(); s.buffer = b;
        if (D.loop.on && D.loop.b > D.loop.a) { s.loop = true; s.loopStart = tau(D.loop.a); s.loopEnd = tau(D.loop.b); }
        s.connect(B.strips[i].g);
        s.start(start, Math.max(0, tau(p))); return { s };
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
        if (B) try { B.strips.forEach(st => st.g.disconnect()); B.nodes.forEach(x => x.disconnect()); } catch (_) {}
        B = makeBus(ctx, set.tracks.length); D.fx = set.tracks.map(FX0);
        D.gain = set.tracks.map(() => 1); D.mute = set.tracks.map(() => false); D.pan = set.tracks.map(() => 0); D.solo = -1;
        D.at = Math.max(set.from, Math.min(set.from + dur() - .05, p));
        if (D.loop.on && (D.loop.a < set.from || D.loop.b > set.from + dur())) D.loop.on = false;
        ensure().catch(() => {}); if (was) play(); else changed();
      },
      seek(p) { if (!D.set) return; p = Math.max(D.set.from, Math.min(D.set.from + dur() - .05, p)); if (D.playing) { pause(); D.at = p; play(); } else { D.at = p; changed(); } },
      async setSpeed(x) { D.speed = x; applyMix(); if (D.playing) await restart(); else { ensure().catch(() => {}); changed(); } },
      async setPitch(s) { D.semis = s; if (D.playing) await restart(); else { ensure().catch(() => {}); changed(); } },
      setGain(i, v) { D.gain[i] = v; applyMix(); },
      setFx(i, k, v) { if (!D.fx[i]) return; D.fx[i][k] = v; applyMix(); }, setComp(on) { D.comp = !!on; applyMix(); changed(); }, setMute(i, v) { D.mute[i] = v; applyMix(); }, setSolo(i) { D.solo = i; applyMix(); }, setPan(i, v) { D.pan[i] = v; applyMix(); },
      setLoop(a, b) { if (b - a < .25) return; D.loop = { on: true, a, b }; if (D.playing) restart(); changed(); },
      clearLoop() { D.loop.on = false; if (D.playing) restart(); changed(); },
      setClick(on, vol) { D.click.on = on; if (vol != null) D.click.vol = vol; clickBus.gain.value = D.click.vol; lastP = -1; changed(); },
      setCountIn(on) { D.countIn = on; changed(); },
      setBeats(beats, bpm, phase, bpb) { D.beats = beats || []; D.bpm = bpm || 100; D.phase = phase || 0; if (bpb) D.bpb = bpb; },
      /** the beat at time p: { k, bar, beat } */
      beatAt(p) { const B = D.beats; if (!B.length || p < B[0] - .05) return null; let lo = 0, hi = B.length - 1; while (lo < hi) { const m = (lo + hi + 1) >> 1; if (B[m] <= p + .02) lo = m; else hi = m - 1; } const g = D.bpb || 4, rel = lo - D.phase, bar = Math.floor(rel / g); return { k: lo, bar: bar + 1 + (D.phase > 0 ? 1 : 0), beat: ((rel % g) + g) % g + 1 }; },
      /** render the current mix (speed, pitch, levels, pan) → { L, R, sr } */
      async render() {
        await ensure(); const sr = D.set.sr, n = bufs.length, tail = (D.fx.some(f => f.rev > 0 || f.echo > 0) ? 2.5 : 0), len = bufs[0].length + Math.round(tail * sr), oc = new OfflineAudioContext(2, len, sr);
        const X = makeBus(oc, n); applyFx(X, oc, false);
        bufs.forEach((b, i) => { const s2 = oc.createBufferSource(); s2.buffer = b; s2.connect(X.strips[i].g); s2.start(0); });
        const r = await oc.startRendering(); return { L: r.getChannelData(0), R: r.getChannelData(1), sr };
      },
      destroy() { pause(); cache.clear(); bufs = null; try { ctx.close(); } catch (_) {} }
    };
    clickBus.gain.value = D.click.vol;
    return api;
  }
  return { create };
})();
