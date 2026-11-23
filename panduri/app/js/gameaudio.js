/* =====================================================================
   Games — the microphone and the clock. One owner of the listening for
   every game: it starts the shared detector (AudioWorklet YIN pitch +
   onset, detector.js), hands its reports on, schedules metronome clicks
   on the audio clock (and tells the detector they are ours), and lets go
   of everything when a game ends.
   Nothing is recorded or sent: the detector analyses on the device and
   its output goes to a silent sink, never to the speakers.
   Timing: a sound scheduled at audio time a is heard `lag` later (the
   output latency the browser reports); the detector already removed the
   input latency measured in calibration. So a stroke reported at t is
   compared with the chart at t − lag − offset, where offset is this
   device's play-along calibration (what is left: display, Bluetooth,
   the player's own habit).
   ===================================================================== */
PD.gameAudio = (() => {
  const D = PD.detector, A = PD.audio;
  let mine = false;
  const offKey = () => 'gm.offset.' + PD.device.key;

  /** turn the microphone on (explaining it the first time, as everywhere in the app) → { ok, err } */
  function acquire() {
    if (D.active) return Promise.resolve({ ok: true });
    if (PD.ui.micBlocked()) return Promise.resolve({ ok: false, err: 'blocked' });
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return Promise.resolve({ ok: false, err: window.isSecureContext === false ? 'insecure' : 'nomedia' });
    return new Promise(res => PD.practice.micOn((ok, err) => { if (ok) mine = true; res({ ok: !!ok, err: ok ? '' : err || 'cancelled' }); }));
  }
  /** let the microphone go — only if the games turned it on and nothing else still listens */
  function release() {
    if (mine && !PD.practice.active && !PD.store.get('micStay', false)) D.stop();
    mine = false;
  }
  /** subscribe to the detector; the returned function unsubscribes from all of it */
  function listen(h) {
    const offs = ['note', 'onset', 'level', 'input', 'state', 'chord', 'release'].filter(k => h[k]).map(k => D.on(k, h[k]));
    return () => offs.splice(0).forEach(f => f());
  }
  const lag = () => Math.max(0, Math.min(.5, A.outLatency || 0));
  const offset = () => (+PD.store.get(offKey(), 0) || 0) / 1000;
  const setOffset = ms => PD.store.set(offKey(), Math.max(-250, Math.min(400, Math.round(ms))));
  /** a metronome click at audio time t — the learner's own click sound and volume — kept out of the judging */
  function click(t, accent, sub) { A.click(t, accent, sub); D.guard([t]); }
  const db = r => r > 0 ? 20 * Math.log10(r) : -120;

  /** the microphones this device offers (names appear once the permission is given) */
  async function devices() {
    try { const all = await navigator.mediaDevices.enumerateDevices(); return all.filter(d => d.kind === 'audioinput').map(d => ({ id: d.deviceId, label: d.label || '' })); } catch (_) { return []; }
  }
  function onDeviceChange(fn) {
    const md = navigator.mediaDevices; if (!md || !md.addEventListener) return () => {};
    md.addEventListener('devicechange', fn); return () => md.removeEventListener('devicechange', fn);
  }
  function info() {
    const c = D.calib || {};
    return { on: D.active, calibrated: !!c.date, inMs: Math.round(c.latencyMs || 0), outMs: Math.round(lag() * 1000), procMs: D.procLatencyMs, offMs: Math.round(offset() * 1000), floorDb: Math.round(db(D.floor)), room: c.room || 'normal' };
  }

  /** play-along timing: a count-in of 4, then n clicks; the player strikes with each one. onHit(k, ms) per stroke.
      Resolves { ok, ms (median offset), hits, spread (ms) }; ok needs at least 5 strokes. opts.t0: when the first click sounds */
  function offsetTest(opts, onHit) {
    opts = opts || {};
    const n = opts.n || 8, spb = 60 / (opts.bpm || 80), L = lag();
    A.ensure();
    const t0 = opts.t0 != null ? opts.t0 : A.now() + .8, clicks = [];
    for (let i = 0; i < 4 + n; i++) { const t = t0 + i * spb; click(t, i % 4 === 0); if (i >= 4) clicks.push(t); }
    const offs = [], used = new Set();
    let off = D.on('onset', m => {
      const at = m.t - L; let k = -1, bd = spb * .45;
      clicks.forEach((c, i) => { const d = Math.abs(at - c); if (d < bd && !used.has(i)) { bd = d; k = i; } });
      if (k < 0) return; used.add(k); offs.push(at - clicks[k]); if (onHit) onHit(k, Math.round((at - clicks[k]) * 1000));
    });
    let timer = 0;
    const p = new Promise(res => {
      timer = setTimeout(() => {
        off(); off = () => {};
        if (offs.length < 5) return res({ ok: false, hits: offs.length });
        const s = offs.slice().sort((a, b) => a - b), med = s[s.length >> 1], spread = Math.sqrt(offs.reduce((a, x) => a + (x - med) * (x - med), 0) / offs.length);
        res({ ok: true, ms: Math.round(med * 1000), hits: offs.length, spread: Math.round(spread * 1000) });
      }, (t0 - A.now() + (4 + n) * spb + .7) * 1000);
    });
    p.cancel = () => { clearTimeout(timer); off(); };
    p.t0 = t0; p.spb = spb;
    return p;
  }

  return { acquire, release, listen, lag, offset, setOffset, click, db, devices, onDeviceChange, info, offsetTest, get mine() { return mine; } };
})();
