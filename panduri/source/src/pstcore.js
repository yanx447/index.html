/* =====================================================================
   PD.pstCore — Panduri Studio's music model. No DOM, no audio: the same
   rules a native plugin will follow (see docs/studio/ARCHITECTURE.md).

   Time is in beats (a quarter note = 1). A project:
     { format: 'panduri-project', v: 1, id, name, created, modified,
       bpm, meter: [n, d], loop: { on, from, to }, tracks: [track] }
   A track:
     { id, name, color, kind: 'notes' | 'rhythm', mute, solo, vol, pan,
       notes:  [{ id, m, s, f, t, d, v, art, off }]          ('notes')
       rhythm: { name, src, bars, swing, steps: [step], chords: [{ bar, name, frets }] } }
   A rhythm step: { dir: 'down'|'up', acc, vel, dur, mute, str: [A, C♯, E], off }.

   Strings and frets come from the instrument (PD.theory, which reads the
   approved profile — tuning, fret count, per-fret pitch): never a guitar.
   A pitch the panduri cannot play keeps s = 0 / f = -1: it is shown, and
   it is not played as if a panduri could.
   ===================================================================== */
'use strict';
PD.pstCore = (() => {
  const T = () => PD.theory, FORMAT = 'panduri-project', V = 1;
  const uid = p => (p || 'n') + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  const clamp = (x, a, b) => x < a ? a : x > b ? b : x;
  const COLORS = ['#d99a64', '#6fa9e0', '#8fd0a8', '#e5c06a', '#c48ad6', '#e58a8a'];

  /* ---------- the instrument ---------- */
  const midiOf = (s, f) => T().midi(s, f);
  /** every place a pitch can be played, lowest fret first */
  const places = m => T().positions(Math.round(m)).sort((a, b) => a.f - b.f || a.s - b.s);
  /** where a pitch goes: the given place if it really sounds this pitch, else the lowest fret */
  function placeFor(m, prefer) {
    const ps = places(m); if (!ps.length) return { s: 0, f: -1 };
    if (prefer && ps.some(p => p.s === prefer.s && p.f === prefer.f)) return { s: prefer.s, f: prefer.f };
    if (prefer && prefer.s) { const same = ps.find(p => p.s === prefer.s); if (same) return same; }
    return ps[0];
  }
  const reach = n => n.s >= 1 && n.f >= 0;

  /* ---------- making things ---------- */
  function note(o) {
    const n = { id: o.id || uid('n'), t: Math.max(0, +o.t || 0), d: Math.max(1 / 32, +o.d || .5), v: clamp(o.v == null ? .75 : +o.v, .05, 1), art: o.art || 'pluck', off: +o.off || 0 };
    if (o.s >= 1 && o.f >= 0) { n.s = o.s; n.f = o.f; n.m = midiOf(o.s, o.f); }
    else { n.m = Math.round(+o.m); Object.assign(n, placeFor(n.m, o.prefer)); }
    return n;
  }
  function steps(strokes, durations) {
    return strokes.map((k, i) => ({ dir: k.direction === 'up' ? 'up' : 'down', acc: !!k.accent, vel: k.accent ? .95 : .72, dur: (durations && durations[i]) || 1, mute: false, str: [1, 1, 1], off: 0 }));
  }
  /** the rhythms the app knows: the teacher's four (their strokes and accents are his; their durations only where he gave them) and the common ones */
  function presets() {
    const C = PD.curriculum, out = [];
    try { (C.rhythms() || []).forEach(r => out.push({ id: r.id, name: r.name, src: 'teacher', timingSrc: (r.timing && r.timing.src) || 'default', count: r.count || null, steps: steps(r.strokes, r.timing && r.timing.durations) })); } catch (_) {}
    try { (C.commonRhythms() || []).forEach(r => out.push({ id: r.id, name: r.name, src: 'general', timingSrc: (r.timing && r.timing.src) || 'general', steps: steps(r.strokes, r.timing && r.timing.durations) })); } catch (_) {}
    return out;
  }
  function track(kind, i) {
    const t0 = { id: uid('t'), name: '', color: COLORS[(i || 0) % COLORS.length], kind: kind === 'rhythm' ? 'rhythm' : 'notes', mute: false, solo: false, vol: .9, pan: 0 };
    if (t0.kind === 'notes') t0.notes = [];
    else { const p = presets()[0]; t0.rhythm = { name: p ? p.name : { ka: 'რითმი', en: 'Rhythm' }, preset: p ? p.id : null, src: p ? p.src : 'user', timingSrc: p ? p.timingSrc : 'user', bars: 4, swing: 0, steps: p ? p.steps : steps([{ direction: 'down', accent: true }]), chords: [] }; }
    return t0;
  }
  function project(name) {
    const now = Date.now(), p = { format: FORMAT, v: V, id: uid('p'), name: name || 'Untitled', created: now, modified: now, bpm: 90, meter: [4, 4], loop: { on: false, from: 0, to: 16 }, countIn: false, metro: false, tracks: [] };
    const r = track('rhythm', 0); r.name = 'Rhythm'; const s = track('notes', 1); s.name = 'Solo';
    p.tracks.push(r, s); return p;
  }
  const bpb = p => (p.meter[0] * 4) / p.meter[1];   // beats (quarters) in a bar

  /* ---------- reading and writing ---------- */
  function serialize(p) { return JSON.stringify(Object.assign({}, p, { format: FORMAT, v: V, modified: p.modified || Date.now() }), null, 1); }
  /** a project from text: checked, and lifted to the current version (older files keep working) */
  function parse(text) {
    let o; try { o = typeof text === 'string' ? JSON.parse(text) : text; } catch (_) { throw new Error('not-json'); }
    if (!o || o.format !== FORMAT) throw new Error('not-panduri');
    if (!(o.v >= 1)) throw new Error('bad-version');
    if (o.v > V) throw new Error('newer-version');
    const p = Object.assign(project(o.name), o, { v: V });
    p.meter = Array.isArray(o.meter) && o.meter.length === 2 ? o.meter.map(Number) : [4, 4];
    p.bpm = clamp(+o.bpm || 90, 20, 320);
    p.tracks = (o.tracks || []).map((t, i) => {
      const k = Object.assign(track(t.kind, i), t);
      if (k.kind === 'notes') k.notes = (t.notes || []).map(n => note(n));   // pitch re-read from the instrument
      else k.rhythm = Object.assign(track('rhythm').rhythm, t.rhythm || {}, { steps: ((t.rhythm && t.rhythm.steps) || []).map(st => Object.assign({ dir: 'down', acc: false, vel: .75, dur: 1, mute: false, str: [1, 1, 1], off: 0 }, st)) });
      return k;
    });
    return p;
  }

  /* ---------- the score as events (playback and MIDI read the same list) ---------- */
  /** chord at a bar: the last one set at or before it */
  const chordAt = (r, bar) => { let c = null; (r.chords || []).forEach(x => { if (x.bar <= bar && (!c || x.bar >= c.bar)) c = x; }); return c; };
  function rhythmEvents(p, tr) {
    const r = tr.rhythm, out = [], total = r.bars * bpb(p), S = r.steps.filter(x => x.dur > 0); if (!S.length) return out;
    let t = 0, i = 0, guard = 0;
    while (t < total - 1e-6 && guard++ < 20000) {
      const st = S[i % S.length], bar = Math.floor(t / bpb(p) + 1e-9), ch = chordAt(r, bar);
      let at = t + (st.off || 0);
      if (r.swing && Math.abs((t % 1) - .5) < 1e-6) at += r.swing / 3;   // the off-beat eighth leans towards the triplet
      if (ch && ch.frets) {
        const frets = ch.frets.map((f, k) => st.str[k] ? f : null);
        if (frets.some(f => f != null)) out.push({ kind: 'strum', t: at, d: st.dur, dir: st.dir, frets, v: clamp(st.vel * (st.acc ? 1 : .82), .05, 1), acc: st.acc, mute: !!st.mute, track: tr.id });
      }
      t += st.dur; i++;
    }
    return out;
  }
  function events(p, opt) {
    opt = opt || {};
    const solo = p.tracks.some(t => t.solo), live = p.tracks.filter(t => solo ? t.solo : !t.mute);
    const out = [];
    live.forEach(tr => {
      if (opt.only && opt.only !== tr.id) return;
      if (tr.kind === 'notes') tr.notes.forEach(n => { if (reach(n)) out.push({ kind: 'note', t: n.t + (n.off || 0), d: n.d, s: n.s, f: n.f, m: n.m, v: n.v, art: n.art, track: tr.id }); });
      else out.push(...rhythmEvents(p, tr));
    });
    return out.sort((a, b) => a.t - b.t);
  }
  const length = p => Math.max(bpb(p) * 2, ...p.tracks.map(tr => tr.kind === 'notes' ? Math.max(0, ...tr.notes.map(n => n.t + n.d)) : tr.rhythm.bars * bpb(p)));

  /* ---------- editing helpers ---------- */
  const quantize = (ns, grid, strength) => ns.map(n => { const g = grid || .25, k = strength == null ? 1 : strength, q = Math.round(n.t / g) * g; return Object.assign({}, n, { t: Math.max(0, n.t + (q - n.t) * k) }); });
  function humanize(ns, amt, velAmt, seed) {
    let x = (seed || 1) >>> 0; const r = () => { x = (x * 1664525 + 1013904223) >>> 0; return x / 4294967296 * 2 - 1; };
    return ns.map(n => Object.assign({}, n, { t: Math.max(0, n.t + r() * (amt == null ? .02 : amt)), v: clamp(n.v + r() * (velAmt == null ? .08 : velAmt), .05, 1) }));
  }
  /** move by semitones: each note takes its place again on the neck (on the same string when it can) */
  const transpose = (ns, k) => ns.map(n => { const m = n.m + k, pl = placeFor(m, { s: n.s }); return Object.assign({}, n, { m, s: pl.s, f: pl.f }); });

  /* ---------- MIDI (SMF type 1) ---------- */
  const PPQ = 480;
  function vlq(n) { const b = [n & 127]; while ((n >>= 7)) b.unshift((n & 127) | 128); return b; }
  function toMidi(p, opt) {
    opt = opt || {}; const evAll = events(p, opt), sec = 60 / p.bpm;
    const head = [0x4d, 0x54, 0x68, 0x64, 0, 0, 0, 6, 0, 1];
    const tracks = [];
    // conductor: tempo and metre
    const us = Math.round(sec * 1e6), den = Math.round(Math.log2(p.meter[1]));
    const conductor = [0, 0xff, 0x51, 3, (us >> 16) & 255, (us >> 8) & 255, us & 255, 0, 0xff, 0x58, 4, p.meter[0], den, 24, 8, 0, 0xff, 0x2f, 0];
    tracks.push(conductor);
    p.tracks.forEach((tr, ti) => {
      if (opt.only && opt.only !== tr.id) return;
      const ch = ti % 16 === 9 ? 10 : ti % 16, list = [];
      evAll.filter(e => e.track === tr.id).forEach(e => {
        if (e.kind === 'note') list.push({ t: e.t, on: 1, m: e.m, v: e.v }, { t: e.t + e.d, on: 0, m: e.m });
        else { const order = e.dir === 'up' ? [2, 1, 0] : [0, 1, 2], gap = .018 / sec;   // the stroke crosses the strings one by one, as on the instrument
          order.filter(k => e.frets[k] != null).forEach((k, j) => { const m = midiOf(k + 1, e.frets[k]), at = e.t + j * gap; list.push({ t: at, on: 1, m, v: e.v }, { t: at + (e.mute ? .12 : e.d), on: 0, m }); }); }
      });
      // a string struck again stops its last note: an off never lands after the next on of the same pitch (MIDI would lose one)
      const byM = {}; list.forEach(e => (byM[e.m] = byM[e.m] || []).push(e));
      Object.values(byM).forEach(es => { const ons = es.filter(e => e.on).sort((a, b) => a.t - b.t), offs = es.filter(e => !e.on).sort((a, b) => a.t - b.t);
        ons.forEach((e, i) => { const nx = ons[i + 1], off = offs[i]; if (nx && off && off.t > nx.t - 1 / PPQ) off.t = Math.max(e.t + 1 / PPQ, nx.t - 1 / PPQ); }); });
      list.sort((a, b) => a.t - b.t || a.on - b.on);
      const name = Array.from(new TextEncoder().encode(String(tr.name || 'Fanduri').slice(0, 60)));
      const bytes = [0, 0xff, 0x03, ...vlq(name.length), ...name, 0, 0xc0 | ch, 104];   // program 105 (GM: banjo, the nearest plucked-lute patch) for hosts without the studio's sampler
      let last = 0;
      list.forEach(e => { const tick = Math.max(0, Math.round(e.t * PPQ)); bytes.push(...vlq(tick - last), (e.on ? 0x90 : 0x80) | ch, e.m & 127, e.on ? clamp(Math.round(e.v * 127), 1, 127) : 0); last = tick; });
      bytes.push(0, 0xff, 0x2f, 0);
      tracks.push(bytes);
    });
    const out = head.concat([0, tracks.length, (PPQ >> 8) & 255, PPQ & 255]);
    tracks.forEach(b => out.push(0x4d, 0x54, 0x72, 0x6b, (b.length >>> 24) & 255, (b.length >>> 16) & 255, (b.length >>> 8) & 255, b.length & 255, ...b));
    return new Uint8Array(out);
  }
  function fromMidi(u8) {
    const d = u8 instanceof Uint8Array ? u8 : new Uint8Array(u8); let o = 0;
    const str = n => { const s = String.fromCharCode(...d.subarray(o, o + n)); o += n; return s; }, u32 = () => { const v = (d[o] << 24 | d[o + 1] << 16 | d[o + 2] << 8 | d[o + 3]) >>> 0; o += 4; return v; }, u16 = () => { const v = d[o] << 8 | d[o + 1]; o += 2; return v; };
    const rv = () => { let v = 0, b; do { b = d[o++]; v = (v << 7) | (b & 127); } while (b & 128); return v; };
    if (str(4) !== 'MThd') throw new Error('not-midi');
    const hl = u32(), fmt = u16(), nt = u16(), div = u16(); o += hl - 6;
    if (div & 0x8000) throw new Error('smpte-midi');
    let bpm = 120, meter = [4, 4]; const tracks = [];
    for (let k = 0; k < nt && o < d.length; k++) {
      if (str(4) !== 'MTrk') break; const len = u32(), end = o + len;
      let tick = 0, run = 0, name = ''; const open = new Map(), notes = [];
      while (o < end) {
        tick += rv(); let st = d[o];
        if (st & 0x80) o++; else st = run;
        if (st === 0xff) { const ty = d[o++], l = rv(), at = o;
          if (ty === 0x51 && l === 3 && tick === 0) bpm = 60e6 / (d[at] << 16 | d[at + 1] << 8 | d[at + 2]);
          if (ty === 0x58 && l >= 2) meter = [d[at], 1 << d[at + 1]];
          if (ty === 0x03) name = new TextDecoder().decode(d.subarray(at, at + l));
          o = at + l; continue; }
        if (st === 0xf0 || st === 0xf7) { o += rv(); continue; }
        run = st; const hi = st & 0xf0, a = d[o++], b = (hi === 0xc0 || hi === 0xd0) ? 0 : d[o++];
        if (hi === 0x90 && b > 0) open.set(a, { t: tick, v: b });
        else if (hi === 0x80 || (hi === 0x90 && b === 0)) { const s0 = open.get(a); if (s0) { notes.push({ m: a, t: s0.t / div, d: Math.max(1 / 32, (tick - s0.t) / div), v: s0.v / 127 }); open.delete(a); } }
      }
      o = end;
      if (notes.length) tracks.push({ name: name || 'MIDI ' + (tracks.length + 1), notes: notes.map(n => note(n)) });
    }
    return { bpm: Math.round(bpm * 100) / 100, meter, tracks, format: fmt };
  }

  return { FORMAT, V, uid, places, placeFor, reach, note, track, project, presets, steps, bpb, serialize, parse, events, rhythmEvents, chordAt, length, quantize, humanize, transpose, toMidi, fromMidi, PPQ, COLORS };
})();
