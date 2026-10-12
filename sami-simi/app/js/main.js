// App controller — wires audio → detector → tracker → views, and owns UI state.

import { TuningModel } from './tuning.js';
const namer = new TuningModel(); // sharp note names for the tuning editor
import { PitchDetector } from './pitch-detector.js';
import { PitchTracker, State } from './tracker.js';
import { instruction, accuracyBand } from './guidance.js';
import { AudioInput, micSupport, audioContext, resumeContext } from './audio-input.js';
import { ReferenceEngine } from './reference.js';
import { loadSettings, saveSettings, defaultSettings } from './settings.js';
import { Meter } from './view/meter.js';
import { Strobe } from './view/strobe.js';
import { Headstock } from './view/headstock.js';
import { Trace } from './view/trace.js';
import { Diagnostics } from './view/diagnostics.js';
import { t, setLang, lang, noteName, applyStatic } from './i18n.js';
import { makeTr } from './tools/ui.js';
import { tuningChanges, changeSignature, recommended, StandardWatch } from './drift.js';

const WINDOW = 4096;
const SITE_URL = 'https://yanx447.github.io/index.html/sami-simi/';
const NATIVE = !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());
const ANALYSIS_MS = 33;           // ≈30 analyses per second, independent of the display
const DONE_MS = { auto: 700, manual: 700, guided: 900 };

const $ = (s) => document.querySelector(s);
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const nativeHaptics = NATIVE && window.Capacitor.Plugins && window.Capacitor.Plugins.Haptics;
const canVibrate = !!nativeHaptics || 'vibrate' in navigator;

// ─── state ────────────────────────────────────────────────────────────────────────────
let S = loadSettings();
const model = new TuningModel(S);
const tracker = new PitchTracker();
const input = new AudioInput(16384); // detector uses the last 4096 samples, chord recognition 8192, the all-strings check 16384
const reference = new ReferenceEngine();
reference.load(); // decode the recorded plucks in the background
let detector = null, detector8 = null, detector16 = null;
const longResult = {};

const done = [false, false, false];
let running = false, starting = false, resumeOnVisible = false;
let analysisTimer = 0;
let current = S.selected;          // string currently shown
let completeShown = false;
let guidedNextAt = 0;
let outOfTuneSince = 0;
let unstableSince = 0;
let lastInsKey = '';
let lastNoteKey = '';
let lastNumWrite = 0;
let wakeLock = null;
let lastDet = null;
let micState = 'off';
let lastLevel = 0;
let viewer = null, viewerOpen = false, viewerChord = null;
let toolOpen = false;

// ─── views ────────────────────────────────────────────────────────────────────────────
const meterEl = $('#meter');
const gauge = new Meter($('#gauge'));
const strobe = new Strobe($('#strobe'));
const head = new Headstock($('#head'), { onPick: (i) => pickString(i) });
const trace = new Trace($('#trace'));
const diag = new Diagnostics($('#diag'));

const el = {
  noteMain: $('#noteMain'), noteOct: $('#noteOct'), noteKa: $('#noteKa'), note: $('#note'),
  hz: $('#hz'), cents: $('#cents'), target: $('#target'),
  ins: $('#instruction'), insIco: $('#insIco'), insText: $('#insText'), sub: $('#substatus'),
  mic: $('#micBtn'), micLbl: $('#micLbl'), micLevel: [...document.querySelectorAll('#micLevel i')],
  ref: $('#refBtn'), refLbl: $('#refLbl'), sr: $('#srReading'),
};

const ICONS = {
  up: '<svg viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 15V3.5M4.5 8L9 3.5 13.5 8"/></svg>',
  down: '<svg viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3v11.5M4.5 10L9 14.5 13.5 10"/></svg>',
  ok: '<svg viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 9.5l3.6 3.6L14.5 5.5"/></svg>',
  ear: '<svg viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7.5v3h2.6L9 13.5v-9L5.6 7.5z"/><path d="M11.8 7a3 3 0 0 1 0 4M13.8 5a6 6 0 0 1 0 8"/></svg>',
  wait: '<svg viewBox="0 0 18 18" fill="currentColor"><circle cx="4" cy="9" r="1.5"/><circle cx="9" cy="9" r="1.5" opacity=".7"/><circle cx="14" cy="9" r="1.5" opacity=".4"/></svg>',
};

// ─── settings application ────────────────────────────────────────────────────────────
function persist() { saveSettings(S); }

function applyTuning(resetStatus) {
  model.set(S);
  if (reference.droning) reference.droneTo(model.strings[current].freq, current);
  tracker.configure({ strings: model.strings, mode: S.mode, selected: S.selected, autoSens: S.autoSens, sens: S.sens, tol: S.tol, harmonic: S.harmonic, speed: S.needleSpeed });
  if (resetStatus) resetDone();
  renderLabels();
}

function applyAll() {
  document.body.classList.toggle('simple', S.ui === 'simple');
  document.body.classList.toggle('no-motion', !S.motion || reducedMotion.matches);
  reference.volume = S.refVolume;
  gauge.setTolerance(S.tol);
  applyNeedleSpeed();
  trace.tol = S.tol;
  head.setSimple(S.ui === 'simple');
  setMeterView(S.meter);
  applyTuning(false);
  renderMode();
  renderSettings();
}

function renderLabels() {
  const strs = model.strings;
  $('#presetLabel').textContent = model.label();
  const simple = S.ui === 'simple';
  head.setLabels(strs, {
    name: (s) => (simple ? noteName(s) : s.latin),
    sub: (s) => (simple ? t('string', { n: s.number }) : (lang() === 'ka' ? `${s.ka} · ${s.octave}` : `${s.latin}${s.octave} · ${s.number}`)),
    aria: (s, d) => t('aria.peg', { n: s.number, note: noteName(s), sci: s.latin + s.octave }) + (d ? t('aria.pegDone') : ''),
  });
  if (!running || isIdle()) showIdleNote();
  el.target.textContent = strs[current].freq.toFixed(2);
}

function isIdle() {
  const st = tracker.snap.state;
  return !running || st === State.LISTENING || st === State.CALIBRATING || st === State.ANALYZING || st === State.OFF;
}

// ─── strings & modes ─────────────────────────────────────────────────────────────────
function setCurrent(i) {
  queueMicrotask(syncViewer);
  if (i === current && head.active === i) return;
  current = i;
  head.setActive(i);
  el.target.textContent = model.strings[i].freq.toFixed(2);
  if (reference.droning) reference.droneTo(model.strings[i].freq, i);
}

/** reference button: a single pluck, or a continuous tone until stopped */
function playReference(i) {
  if (S.refMode === 'drone') reference.startDrone(model.strings[i].freq, i);
  else reference.play(model.strings[i].freq, i);
  markRefPlaying();
}
function stopReference() {
  reference.stop();
  setTimeout(markRefIdle, 350);
  markRefIdle();
}

function pickString(i) {
  if (S.mode === 'auto') S.mode = 'manual';
  S.selected = i;
  if (S.mode === 'guided') guidedNextAt = 0;
  persist();
  tracker.configure({ mode: S.mode, selected: i, awaitOnset: running });
  setCurrent(i);
  renderMode();
  if (reference.droning) { updateInstruction(true); return; } // the drone already moved to this string
  if (!running) { showIdleNote(); updateInstruction(true); playReference(i); }
  else updateInstruction(true);
}

function setMode(mode) {
  S.mode = mode;
  if (mode === 'guided') {
    resetDone();
    S.selected = 0;
    toast(t('toast.guided'));
  }
  persist();
  tracker.configure({ mode, selected: S.selected });
  setCurrent(S.selected);
  renderMode();
  showIdleNote();
  updateInstruction(true);
}

function renderMode() {
  const btns = [...document.querySelectorAll('#modes button')];
  const idx = btns.findIndex((b) => b.dataset.mode === S.mode);
  btns.forEach((b, i) => { b.setAttribute('aria-checked', String(i === idx)); b.tabIndex = i === idx ? 0 : -1; });
  $('.modes-thumb').style.transform = `translateX(${idx * 100}%)`;
  renderSub();
}

function nextUndone(from = 0) {
  for (let k = 0; k < 3; k++) { const i = (from + k) % 3; if (!done[i]) return i; }
  return -1;
}

// ─── done / completion ───────────────────────────────────────────────────────────────
function resetDone() {
  queueMicrotask(syncViewer);
  done.fill(false);
  completeShown = false;
  $('#complete').hidden = true;
  head.setDone(done);
}

function markDone(i) {
  queueMicrotask(syncViewer);
  done[i] = true;
  head.setDone(done, i);
  haptic(18);
  if (S.mode === 'guided') {
    const n = nextUndone(i + 1);
    if (n >= 0) guidedNextAt = performance.now() + 750;
  }
  if (done.every(Boolean) && !completeShown) {
    completeShown = true;
    setTimeout(() => { $('#complete').hidden = false; haptic([14, 70, 14]); }, 450);
    announce(t('announce.done'));
  }
  renderSub();
}

function haptic(p) {
  if (!S.haptics || !canVibrate) return;
  try {
    if (nativeHaptics) { Array.isArray(p) ? nativeHaptics.notification({ type: 'SUCCESS' }) : nativeHaptics.impact({ style: 'LIGHT' }); }
    else navigator.vibrate(p);
  } catch (e) { /* noop */ }
}

// ─── note / numbers / instruction rendering ──────────────────────────────────────────
function setNote(latin, oct, kaLine) {
  const key = latin + oct + kaLine;
  if (key === lastNoteKey) return;
  const changedNote = !lastNoteKey.startsWith(latin + oct);
  lastNoteKey = key;
  el.noteMain.textContent = latin;
  el.noteOct.textContent = oct;
  el.noteKa.textContent = kaLine;
  if (changedNote && S.motion && !reducedMotion.matches) {
    el.note.classList.remove('swap'); void el.note.offsetWidth; el.note.classList.add('swap');
  }
}

function showIdleNote() {
  const s = model.strings[current];
  if (S.ui === 'simple') setNote(noteName(s), '', t('string', { n: s.number }));
  else setNote(s.latin, String(s.octave), lang() === 'ka' ? t('note.withString', { note: s.ka, n: s.number }) : t('string', { n: s.number }));
  meterEl.dataset.state = running ? 'listening' : 'idle';
  delete meterEl.dataset.band;
  el.hz.textContent = '—'; el.cents.textContent = '—';
}

function setInstruction(key, tone, icon, text) {
  if (key === lastInsKey) return;
  const bump = tone !== el.ins.dataset.tone;
  lastInsKey = key;
  el.ins.dataset.tone = tone;
  el.insIco.innerHTML = icon ? ICONS[icon] : '';
  el.insText.textContent = text;
  if (bump && icon) { el.ins.classList.remove('bump'); void el.ins.offsetWidth; el.ins.classList.add('bump'); }
}

function updateInstruction(force) {
  if (force) lastInsKey = '';
  const s = model.strings[current];
  if (reference.droning) return setInstruction('drone', 'neutral', 'ear', t('ins.drone'));
  if (reference.busy) return setInstruction('ref', 'neutral', 'ear', t('ins.ref'));
  if (!running) {
    if (S.mode === 'guided') return setInstruction('off-g', 'neutral', null, t('ins.offGuided'));
    return setInstruction('off', 'neutral', null, t('ins.off'));
  }
  const snap = tracker.snap;
  switch (snap.state) {
    case State.CALIBRATING: return setInstruction('cal', 'neutral', 'wait', t('ins.cal'));
    case State.LISTENING:
      if (S.harmonic) return setInstruction('har' + current, 'neutral', null, (S.mode === 'auto' ? '' : t('string', { n: s.number }) + ' — ') + t('ins.harmonic'));
      if (S.mode === 'guided' || S.mode === 'manual') return setInstruction('lis' + current, 'neutral', null, t('ins.pluckN', { n: s.number, note: noteName(s) }));
      return setInstruction('lis', 'neutral', null, t('ins.pluck'));
    case State.ANALYZING: return setInstruction('ana', 'neutral', 'wait', t('ins.listening'));
    case State.UNSTABLE:
      if (performance.now() - unstableSince > 600) return setInstruction('uns', 'muted', null, t('ins.unstable'));
      return;
    case State.HOLD: return; // keep the last reliable instruction while the note fades
    default: {
      const ins = instruction(snap.cents, S.tol);
      const text = ins.dir === 0 ? t(S.ui === 'simple' ? 'ins.intuneShort' : 'ins.intune') : t(S.ui === 'simple' ? (ins.dir > 0 ? 'ins.up' : 'ins.down') : 'ins.' + ins.key);
      if (ins.dir === 0) return setInstruction('ok', 'ok', 'ok', text);
      const tone = ins.key.endsWith('far') ? 'far' : ins.dir > 0 ? 'up' : 'down';
      return setInstruction(ins.key, tone, ins.dir > 0 ? 'up' : 'down', text);
    }
  }
}

function renderSub() {
  const sub = el.sub;
  const snap = tracker.snap;
  const reading = running && (snap.state === State.VALID || snap.state === State.IN_TUNE || snap.state === State.HOLD);
  sub.classList.remove('warn');
  if (reading && S.harmonic && snap.octaveOffset === 1) { sub.textContent = t('sub.harmonic'); return; } // expected: the harmonic is an octave up
  if (reading && snap.octaveOffset !== 0) {
    sub.classList.add('warn');
    sub.textContent = t(snap.octaveOffset > 0 ? 'sub.octHigh' : 'sub.octLow');
    return;
  }
  if (reading && S.mode !== 'auto' && Math.abs(snap.cents) > 250) {
    const other = model.strings.find((s) => s.index !== current && Math.abs(12 * Math.log2(snap.freq / s.freq)) < 0.8);
    if (other) {
      sub.classList.add('warn');
      const tg = model.strings[current];
      sub.textContent = t('sub.wrongString', { other: noteName(other), on: other.number, target: noteName(tg), tn: tg.number });
      return;
    }
  }
  if (S.mode === 'guided') {
    const n = done.filter(Boolean).length;
    sub.textContent = n === 3 ? t('sub.guidedDone') : t('sub.guided', { k: Math.min(3, (done[current] ? n : n + 1)) });
    return;
  }
  if (running && S.autoSens && tracker.noiseFloor > 0.012) { sub.textContent = t('sub.noisy'); return; }
  sub.textContent = '';
}

function announce(t) { el.sr.textContent = t; }

// ─── frame handling (analysis rate) ──────────────────────────────────────────────────
function onSnapshot(snap, now) {
  const st = snap.state;
  const live = st === State.VALID || st === State.IN_TUNE;
  const hasReading = live || st === State.UNSTABLE || st === State.HOLD;

  if (st === State.UNSTABLE) { if (!unstableSince) unstableSince = now; } else unstableSince = 0;

  // which string is in focus
  if (hasReading) setCurrent(snap.stringIndex);
  else if (S.mode !== 'auto') setCurrent(S.selected);

  // guided: advance after the current string held in tune
  if (S.mode === 'guided' && guidedNextAt && now >= guidedNextAt) { advanceGuided(); return; }

  // done marking (requires a sustained in-tune reading, never a single frame)
  if (st === State.IN_TUNE && snap.inTuneMs >= DONE_MS[S.mode] && !done[snap.stringIndex]) markDone(snap.stringIndex);
  if (st === State.VALID && done[snap.stringIndex] && Math.abs(snap.cents) > Math.max(6, S.tol * 2)) {
    if (!outOfTuneSince) outOfTuneSince = now;
    else if (now - outOfTuneSince > 900) { done[snap.stringIndex] = false; completeShown = false; head.setDone(done); renderSub(); }
  } else outOfTuneSince = 0;

  if (live || st === State.UNSTABLE) watchStandard(snap);

  // meter + strobe
  if (live) {
    gauge.set(snap.cents, 'live', st === State.IN_TUNE);
    const f = snap.targetFreq * Math.pow(2, snap.octaveOffset);
    strobe.set(f * (Math.pow(2, snap.cents / 1200) - 1), true, st === State.IN_TUNE);
  } else if (hasReading) {
    gauge.set(null, 'dim', false);
    strobe.set(0, false, false);
  } else {
    gauge.set(null, 'idle', false);
    strobe.set(0, false, false);
  }

  // big note + numbers (only trustworthy frames update them)
  meterEl.dataset.state = live ? 'live' : st === State.HOLD ? 'hold' : st === State.UNSTABLE ? 'unstable' : running ? 'listening' : 'idle';
  if (live) {
    const nm = model.name(model.freqToMidi(snap.freq));
    if (S.ui === 'simple') setNote(noteName(nm), '', t('string', { n: snap.stringIndex + 1 }));
    else setNote(nm.latin, String(nm.octave), lang() === 'ka' ? t('note.withString', { note: nm.ka, n: snap.stringIndex + 1 }) : t('string', { n: snap.stringIndex + 1 }));
    meterEl.dataset.band = snap.band;
    if (now - lastNumWrite > 110) {
      lastNumWrite = now;
      el.hz.textContent = snap.freq.toFixed(2);
      const c = snap.cents, a = Math.abs(c);
      el.cents.textContent = (c > 0.05 ? '+' : c < -0.05 ? '−' : '±') + (a < 10 ? a.toFixed(1) : a.toFixed(0));
    }
  } else if (!hasReading) {
    if (lastNoteKey && meterEl.dataset.band) showIdleNote();
  }

  // headstock
  // the arrow shows which way to turn this key; some instruments' keys turn the other way (settings)
  head.setDirection(current, live && st !== State.IN_TUNE ? (snap.cents < 0 ? 1 : -1) * (S.pegFlip[current] ? -1 : 1) : 0);
  const lvl = hasReading && st !== State.HOLD ? Math.min(1, Math.max(0, Math.log10(snap.rms / (snap.gate || 1e-4)) / 1.4)) : 0;
  head.setSignal(current, lvl);
  lastLevel = lvl;

  // mic level bars (real RMS)
  const L = running ? Math.min(1, Math.max(0, (20 * Math.log10(snap.rms + 1e-9) + 62) / 50)) : 0;
  el.micLevel.forEach((b, i) => { b.style.height = `${12 + 88 * Math.min(1, Math.max(0, L * 1.35 - i * 0.16))}%`; });

  trace.push(live ? snap.cents : null);
  if (!document.body.classList.contains('simple')) trace.draw();

  updateInstruction(false);
  if (st !== (onSnapshot.prev || '')) { renderSub(); onSnapshot.prev = st; if (st === State.IN_TUNE) announce(t('announce.string', { note: noteName(model.strings[current]) })); }
  else if (live && (snap.octaveOffset || Math.abs(snap.cents) > 250)) renderSub();

  diag.update(snap, lastDet, { mode: S.mode, autoSens: S.autoSens, sampleRate: running ? input.sampleRate : 0, target: model.strings[current].freq });
  if (concertOpen) { renderConcert(snap); concertCues(snap, now); }
  syncViewer();
  requestRender();
}

function advanceGuided() {
  guidedNextAt = 0;
  const n = nextUndone(current + 1);
  if (n < 0) return;
  S.selected = n; persist();
  tracker.configure({ selected: n, awaitOnset: true }); // ignore the previous string still ringing
  setCurrent(n);
  showIdleNote();
  updateInstruction(true);
  renderSub();
}

// ─── analysis loop ───────────────────────────────────────────────────────────────────
function analysisTick() {
  analysisTimer = setTimeout(analysisTick, ANALYSIS_MS);
  if (!running || !input.active || toolOpen) return;
  const now = performance.now();
  if (now < cueQuietUntil) return; // a stage-mode cue is sounding — don't measure our own beep
  const t0 = now;
  let snap;
  if (reference.busy) { snap = tracker.update(null, now); lastDet = null; }
  else {
    const buf = input.read();
    let det = detector.analyze(buf, tracker.prior);
    // quiet (a fading or distant string): listen over a longer window — 2–4× more signal against
    // the room noise. Loud notes keep the short window so the needle stays quick.
    const nf = tracker.noiseFloor;
    // only while a note is fading (≤ 4 s after real sound) — in silence this would just burn battery
    if (S.autoSens && det.rms < nf * 6 && buf.length >= 16384 && now - (tracker.lastSignalAt || -1e9) < 4000) {
      const big = det.rms < nf * 3;
      const longDet = big ? (detector16 || (detector16 = new PitchDetector(input.sampleRate, { windowSize: 16384 })))
                          : (detector8 || (detector8 = new PitchDetector(input.sampleRate, { windowSize: 8192 })));
      const d2 = longDet.analyze(buf, tracker.prior);
      if (d2.clarity > det.clarity) { const rms = det.rms; det = Object.assign(longResult, d2, { rms }); }
    }
    lastDet = det;
    snap = tracker.update(det, now);
  }
  diag.tickAnalysis(performance.now() - t0);
  onSnapshot(snap, now);
  if (!reference.busy) markRefIdle();
}

// ─── render loop (display rate, only while something moves) ─────────────────────────
let raf = 0, lastT = 0;
function requestRender() { if (!raf) raf = requestAnimationFrame(frame); }
function frame(t) {
  raf = 0;
  const dt = lastT ? Math.min(0.05, (t - lastT) / 1000) : 1 / 60;
  lastT = t;
  let busy = gauge.step(dt);
  busy = strobe.step(dt) || busy;
  busy = head.step(dt) || busy;
  diag.tickRender();
  if (busy) requestRender(); else lastT = 0;
}

// ─── microphone ──────────────────────────────────────────────────────────────────────
function setMicUI(state) {
  el.mic.classList.toggle('live', state === 'live');
  el.mic.classList.toggle('starting', state === 'starting');
  el.mic.setAttribute('aria-pressed', String(state === 'live'));
  el.micLbl.textContent = t(state === 'live' ? 'mic.stop' : state === 'starting' ? 'mic.starting' : 'mic.label');
  el.mic.setAttribute('aria-label', t(state === 'live' ? 'aria.micOff' : 'aria.micOn'));
  micState = state;
  if (concertOpen) renderConcertLabels();
}

async function startMic(silent = false) {
  if (running || starting) return;
  starting = true; setMicUI('starting');
  try {
    await input.start();
  } catch (e) {
    starting = false; setMicUI('off');
    const embedded = (() => { try { return window.self !== window.top; } catch (x) { return true; } })();
    if (!silent) showMicSheet(embedded && (e.code === 'denied' || e.code === 'unknown') ? 'embedded' : (e.code || 'unknown'));
    else toast(t('toast.micRetry'));
    return;
  }
  if (!detector || detector.sr !== input.sampleRate) { detector = new PitchDetector(input.sampleRate, { windowSize: WINDOW }); detector8 = detector16 = null; }
  tracker.configure({ strings: model.strings, mode: S.mode, selected: S.selected, autoSens: S.autoSens, sens: S.sens, tol: S.tol, harmonic: S.harmonic, speed: S.needleSpeed });
  tracker.begin(performance.now());
  running = true; starting = false;
  setMicUI('live');
  requestWakeLock();
  clearTimeout(analysisTimer);
  analysisTick();
  updateInstruction(true);
  showIdleNote();
}

function stopMic() {
  running = false;
  clearTimeout(analysisTimer);
  input.stop();
  tracker.end();
  releaseWakeLock();
  setMicUI('off');
  head.setDirection(-1, 0); head.setSignal(-1, 0);
  gauge.set(null, 'idle', false); strobe.set(0, false, false);
  trace.clear();
  showIdleNote();
  updateInstruction(true);
  renderSub();
  requestRender();
}

async function requestWakeLock() {
  try { if ('wakeLock' in navigator && document.visibilityState === 'visible') wakeLock = await navigator.wakeLock.request('screen'); } catch (e) { wakeLock = null; }
}
function releaseWakeLock() { try { wakeLock && wakeLock.release(); } catch (e) { /* noop */ } wakeLock = null; }

input.onEnded = () => { if (running) { stopMic(); toast(t('toast.micEnded')); } };

function onMicButton() {
  if (running) { stopMic(); return; }
  const sup = micSupport();
  if (sup !== 'ok') { showMicSheet(sup); return; }
  if (!S.micPrimed) { showMicSheet('prime'); return; }
  startMic();
}

const MIC_ACTIONS = {
  prime: ['mic.prime.go', 'mic.prime.cancel', false],
  denied: ['mic.retry', 'mic.close', true], notfound: ['mic.retry', 'mic.close', true], busy: ['mic.retry', 'mic.close', true],
  insecure: [null, 'mic.ok', true], unsupported: [null, 'mic.ok', true], embedded: [null, 'mic.ok', true], unknown: ['mic.retry', 'mic.close', true],
};

function showMicSheet(code) {
  if (!MIC_ACTIONS[code]) code = 'unknown';
  const [goKey, cancelKey, err] = MIC_ACTIONS[code];
  $('#micTitle').textContent = t(`mic.${code}.t`);
  $('#micText').textContent = t(`mic.${code}.p`);
  $('#micFine').textContent = t(`mic.${code}.f`);
  const go = $('#micGo');
  go.hidden = !goKey; go.textContent = goKey ? t(goKey) : '';
  $('#micCancel').textContent = t(cancelKey);
  $('.mic-art').classList.toggle('error', err);
  openSheet('#micSheet');
}

// ─── reference ───────────────────────────────────────────────────────────────────────
let refTimer = 0;
function markRefPlaying() {
  el.ref.classList.add('playing'); el.refLbl.textContent = t('dock.refStop');
  clearTimeout(refTimer);
  refTimer = setTimeout(markRefIdle, Math.max(0, reference.busyUntil - performance.now()));
  updateInstruction(true);
}
function markRefIdle() {
  if (reference.busy || !el.ref.classList.contains('playing')) return;
  el.ref.classList.remove('playing'); el.refLbl.textContent = t('dock.ref');
  updateInstruction(true);
}

// ─── sheets, toasts ──────────────────────────────────────────────────────────────────
let openSheetEl = null, lastFocus = null;
function openSheet(sel) {
  closeSheet();
  const sh = $(sel);
  lastFocus = document.activeElement;
  sh.classList.add('open'); sh.setAttribute('aria-hidden', 'false');
  $('#scrim').classList.add('open');
  $('#app').setAttribute('aria-hidden', 'true');
  openSheetEl = sh;
  setTimeout(() => { const f = sh.querySelector('button:not([hidden])'); f && f.focus({ preventScroll: true }); }, 60);
}
function closeSheet() {
  if (!openSheetEl) return;
  openSheetEl.classList.remove('open'); openSheetEl.setAttribute('aria-hidden', 'true');
  $('#scrim').classList.remove('open');
  $('#app').removeAttribute('aria-hidden');
  openSheetEl = null;
  lastFocus && lastFocus.focus && lastFocus.focus({ preventScroll: true });
}

let toastTimer = 0;
function toast(msg, ms = 3800) {
  const el2 = $('#toast');
  el2.textContent = msg; el2.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => el2.classList.remove('show'), ms);
}

// ─── settings panel ──────────────────────────────────────────────────────────────────
function setFill(input) {
  const p = ((+input.value - +input.min) / (+input.max - +input.min)) * 100;
  input.style.setProperty('--fill', p + '%');
}

function renderSettings() {
  $('#presetName').textContent = presetTitle(model.preset);
  renderTunings();
  $('#pegFlips').innerHTML = model.strings.map((x, i) => `<button type="button" class="peg-flip" role="switch" aria-checked="${S.pegFlip[i]}" data-peg="${i}"><span>${t('string', { n: x.number })} · ${lang() === 'ka' ? x.ka : x.latin}</span><b>${t(S.pegFlip[i] ? 'set.pegs.flipped' : 'set.pegs.normal')}</b></button>`).join('');
  $('#presetNotes').innerHTML = model.strings.map((s) => `<span>${t('string', { n: s.number })} — ${lang() === 'ka' ? s.ka + ' (' + s.latin + s.octave + ')' : s.latin + s.octave}</span>`).join('');
  $('#transVal').textContent = t('set.semitones', { n: (S.transpose > 0 ? '+' : S.transpose < 0 ? '−' : '') + Math.abs(S.transpose) });
  $('#transNotes').textContent = model.label();
  $('#octVal').textContent = model.labelWithOctaves();
  const a4 = $('#a4'); a4.value = S.a4; setFill(a4);
  $('#a4Val').textContent = (S.a4 % 1 ? S.a4.toFixed(1) : S.a4) + ' ' + t('hz');
  const ns = $('#needleSpeed');
  ns.addEventListener('input', () => { setNeedleSpeed(+ns.value, false); setFill(ns); });
  ns.addEventListener('change', () => { persist(); previewNeedle(); });
  const sens = $('#sens'); sens.value = S.sens; sens.disabled = S.autoSens; setFill(sens);
  $('#sensVal').textContent = S.autoSens ? t('set.auto') : S.sens + ' / 10';
  applyNeedleSpeed();
  $('#tolVal').textContent = t('set.cents', { n: S.tol });
  const vol = $('#refVolume'); vol.value = S.refVolume; setFill(vol);
  $('#refVolVal').textContent = Math.round(S.refVolume * 100) + '%';
  for (const seg of document.querySelectorAll('.seg')) {
    const key = seg.dataset.key;
    for (const b of seg.querySelectorAll('button')) {
      const on = String(S[key]) === b.dataset.v;
      b.setAttribute('aria-checked', String(on)); b.tabIndex = on ? 0 : -1;
    }
  }
  setSwitch('#autoSens', S.autoSens);
  setSwitch('#motion', S.motion);
  setSwitch('#haptics', S.haptics && canVibrate);
  $('#haptics').disabled = !canVibrate;
  $('#hapticsNote').textContent = t(canVibrate ? 'set.hapticsNote' : 'set.hapticsNone');
  renderDrift();
}

// ─── accidentally changed settings ───────────────────────────────────────────────────
// A notice on the main screen whenever settings that affect tuning differ from the
// recommended ones; one tap restores them. If the panduri is clearly in standard tuning
// while the settings say otherwise, they are restored automatically (with Undo).
const DRIFT_OK_KEY = 'sami-simi:drift-ok';
let driftOk = ''; try { driftOk = localStorage.getItem(DRIFT_OK_KEY) || ''; } catch (e) { /* ignore */ }
let driftUndo = null, driftUndoTimer = 0, driftAuto = false, driftSig = null;
const standardWatch = new StandardWatch();

function driftValue(c) {
  if (c.key === 'presetId') return t('preset.' + c.value);
  if (c.key === 'transpose') return t('set.semitones', { n: (c.value > 0 ? '+' : '−') + Math.abs(c.value) });
  if (c.key === 'octave') return t(c.value < 0 ? 'set.oct.low' : 'set.oct.high');
  if (c.key === 'a4') return c.value % 1 ? c.value.toFixed(1) : String(c.value);
  return '';
}
function renderDrift() {
  const bar = $('#drift'); if (!bar) return;
  const sig = changeSignature(S);
  if (sig !== driftSig) { driftSig = sig; standardWatch.reset(); }
  if (driftUndo) {
    bar.hidden = false; bar.classList.add('ok');
    $('#driftTitle').textContent = t(driftAuto ? 'drift.detected' : 'drift.restored');
    $('#driftList').textContent = '';
    $('#driftGo').textContent = t('drift.undo');
    $('#driftX').setAttribute('aria-label', t('aria.close'));
    return;
  }
  const ch = tuningChanges(S);
  bar.classList.remove('ok');
  if (!ch.length || sig === driftOk) { bar.hidden = true; return; }
  bar.hidden = false;
  $('#driftTitle').textContent = t('drift.title');
  $('#driftList').textContent = ch.map((c) => t('drift.' + c.key, { v: driftValue(c) })).join(' · ');
  $('#driftGo').textContent = t('drift.restore');
  $('#driftX').setAttribute('aria-label', t('drift.dismiss'));
}
function restoreRecommended(auto) {
  const prev = { ...S };
  S = recommended(S); persist();
  resetDone(); current = S.mode === 'auto' ? current : S.selected;
  applyAll();
  driftUndo = prev; driftAuto = auto;
  clearTimeout(driftUndoTimer);
  driftUndoTimer = setTimeout(() => { driftUndo = null; renderDrift(); }, auto ? 12000 : 8000);
  renderDrift();
  haptic([12, 50, 12]);
}
function driftAction() {
  if (driftUndo) { // undo: the player meant it — don't nag about this combination again
    S = driftUndo; driftUndo = null; clearTimeout(driftUndoTimer);
    driftOk = changeSignature(S); try { localStorage.setItem(DRIFT_OK_KEY, driftOk); } catch (e) { /* ignore */ }
    persist(); resetDone(); applyAll(); return;
  }
  restoreRecommended(false);
}
function driftDismiss() {
  if (driftUndo) { driftUndo = null; clearTimeout(driftUndoTimer); renderDrift(); return; }
  driftOk = changeSignature(S); try { localStorage.setItem(DRIFT_OK_KEY, driftOk); } catch (e) { /* ignore */ }
  renderDrift();
}
function watchStandard(snap) {
  if (!driftSig || driftSig === driftOk || driftUndo || S.presetId.startsWith('c-')) return; // never undo the player's own tuning
  if (standardWatch.push(snap.rawFreq, model.strings.map((x) => x.freq))) restoreRecommended(true);
}
function setSwitch(sel, v) { $(sel).setAttribute('aria-checked', String(!!v)); }

// ─── tunings: built-in + the player's own ────────────────────────────────────────────
let tuneEdit = null; // { id|null, name, strings: [m1, m2, m3] } while the editor is open
const presetTitle = (p) => (p.custom ? p.name || t('set.tuneUnnamed') : t('preset.' + p.id));
const noteLabel = (m) => { const n = namer.name(m); return (lang() === 'ka' ? n.ka : n.latin) + n.octave; };
function renderTunings() {
  const all = TuningModel.all(S.customs);
  const cur = all.find((p) => p.id === S.presetId) || all[0];
  $('#tunings').innerHTML = all.map((p) => `<button type="button" role="radio" class="tune-chip" aria-checked="${p.id === cur.id}" data-tune="${p.id}"><strong>${presetTitle(p).replace(/[<&]/g, '')}</strong><span>${p.strings.map(noteLabel).join(' · ')}</span></button>`).join('')
    + `<button type="button" class="tune-chip add" data-tune-new="1"><strong>+ ${t('set.tuneNew')}</strong></button>`
    + (cur.custom ? `<button type="button" class="tune-chip edit" data-tune-edit="${cur.id}"><strong>✎ ${t('set.tuneEdit')}</strong></button>` : '');
  const ed = $('#tuningEditor');
  ed.hidden = !tuneEdit;
  if (!tuneEdit) return;
  if (document.activeElement !== $('#tuneName')) $('#tuneName').value = tuneEdit.name;
  $('#tuneName').placeholder = t('set.tuneNamePh');
  $('#teDelete').hidden = !tuneEdit.id;
  $('#teRows').innerHTML = tuneEdit.strings.map((m, i) => `<div class="te-row"><span>${t('string', { n: i + 1 })}</span>
    <button type="button" class="round sm" data-te="${i}" data-d="-1" aria-label="−1">−</button><b>${noteLabel(m)}</b><button type="button" class="round sm" data-te="${i}" data-d="1" aria-label="+1">+</button>
    <button type="button" class="round sm" data-te-play="${i}" aria-label="${t('dock.ref')}">▶</button></div>`).join('');
}
function selectTuning(id) {
  S.presetId = id; S.transpose = 0; S.octave = 0; persist(); applyTuning(true); renderSettings(); updateInstruction(true);
}

// ─── needle speed: the fader next to the needle (and the slider in settings) ─────────
const FADER_DEFAULT = 5;
function needleLabel(v) { return t('set.needleLv')[Math.min(9, Math.max(0, Math.round(v) - 1))]; }
function applyNeedleSpeed() {
  const v = S.needleSpeed;
  tracker.configure({ speed: v }); gauge.setSpeed(v);
  document.documentElement.style.setProperty('--needle-t', (0.5 * Math.pow(2, (5 - v) / 3.5)).toFixed(2) + 's');
  const f = $('#fader'), p = (v - 1) / 9;
  f.style.setProperty('--fd-pos', ((1 - p) * 100).toFixed(2) + '%');
  f.style.setProperty('--fd-fill', `calc(${(p * 100).toFixed(2)}% - ${(p * 12).toFixed(1)}px)`);
  f.setAttribute('aria-valuenow', v.toFixed(1));
  f.setAttribute('aria-valuetext', `${v.toFixed(1)} · ${needleLabel(v)}`);
  $('#faderVal').textContent = v.toFixed(1);
  const sl = $('#needleSpeed'); if (sl && document.activeElement !== sl) { sl.value = v; setFill(sl); }
  if ($('#needleVal')) $('#needleVal').textContent = `${v.toFixed(1)} · ${needleLabel(v)}`;
}
let previewT = 0;
function previewNeedle() { // show how the needle now moves: one swing out and back
  if (running && !isIdle()) return;
  clearTimeout(previewT); gauge.set(30, 'live', false); requestRender();
  previewT = setTimeout(() => { gauge.set(-12, 'live', false); requestRender(); previewT = setTimeout(() => { gauge.set(null, 'idle', false); requestRender(); }, 700); }, 700);
}
function setNeedleSpeed(v, save) {
  S.needleSpeed = Math.round(Math.min(10, Math.max(1, v)) * 10) / 10;
  applyNeedleSpeed();
  if (save) persist();
}
function bindFader() {
  const f = $('#fader'), track = f.querySelector('.fd-track');
  let dragging = false, lastTap = 0, showT = 0;
  const fromY = (y) => { const r = track.getBoundingClientRect(); const p = 1 - (y - r.top - 6) / Math.max(1, r.height - 12); return 1 + 9 * Math.min(1, Math.max(0, p)); };
  f.addEventListener('pointerdown', (e) => {
    const now = performance.now();
    if (now - lastTap < 320) { setNeedleSpeed(FADER_DEFAULT, true); previewNeedle(); haptic(12); lastTap = 0; return; } // double-tap: medium
    lastTap = now;
    dragging = true; f.classList.add('drag'); f.setPointerCapture(e.pointerId);
    setNeedleSpeed(fromY(e.clientY), false); e.preventDefault();
  });
  f.addEventListener('pointermove', (e) => { if (dragging) setNeedleSpeed(fromY(e.clientY), false); });
  const end = () => { if (!dragging) return; dragging = false; f.classList.remove('drag'); persist(); previewNeedle(); };
  f.addEventListener('pointerup', end); f.addEventListener('pointercancel', end);
  f.addEventListener('keydown', (e) => {
    const step = { ArrowUp: 0.5, ArrowRight: 0.5, ArrowDown: -0.5, ArrowLeft: -0.5, PageUp: 2, PageDown: -2 }[e.key];
    if (e.key === 'Home') setNeedleSpeed(1, true); else if (e.key === 'End') setNeedleSpeed(10, true);
    else if (step) setNeedleSpeed(S.needleSpeed + step, true); else return;
    e.preventDefault(); f.classList.add('show'); clearTimeout(showT); showT = setTimeout(() => f.classList.remove('show'), 900);
  });
}

function setMeterView(v) {
  S.meter = v;
  meterEl.dataset.view = v;
  strobe.setVisible(v === 'strobe');
  const mt = $('#meterToggle');
  mt.classList.toggle('is-strobe', v === 'strobe');
  mt.setAttribute('aria-label', t(v === 'strobe' ? 'aria.meterStrobe' : 'aria.meterNeedle'));
  requestRender();
}

function bindSettings() {
  $('#tDown').onclick = () => { S.transpose = Math.max(-6, S.transpose - 1); persist(); applyTuning(true); renderSettings(); };
  $('#tUp').onclick = () => { S.transpose = Math.min(6, S.transpose + 1); persist(); applyTuning(true); renderSettings(); };
  for (const seg of document.querySelectorAll('.seg')) {
    seg.addEventListener('click', (e) => {
      const b = e.target.closest('button'); if (!b) return;
      const key = seg.dataset.key;
      const raw = b.dataset.v;
      const v = key === 'octave' || key === 'tol' ? +raw : key === 'harmonic' ? raw === 'true' : raw;
      if (S[key] === v) return;
      S[key] = v; persist();
      if (key === 'octave') applyTuning(true);
      if (key === 'tol') { tracker.configure({ tol: v }); gauge.setTolerance(v); trace.tol = v; trace.draw(); }
      if (key === 'meter') setMeterView(v);
      if (key === 'ui') { applyAll(); updateInstruction(true); }
      if (key === 'lang') applyLanguage();
      if (key === 'harmonic') { tracker.configure({ harmonic: v }); tracker.resetMeasurement(); updateInstruction(true); if (v) toast(t('toast.harmonic'), 6000); }
      if (key === 'refMode' && reference.droning) stopReference();
      renderSettings();
    });
    seg.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      const bs = [...seg.querySelectorAll('button')];
      const i = bs.findIndex((b) => b.getAttribute('aria-checked') === 'true');
      const n = bs[(i + (e.key === 'ArrowRight' ? 1 : bs.length - 1)) % bs.length];
      n.click(); n.focus();
    });
  }
  const a4 = $('#a4');
  a4.addEventListener('input', () => { S.a4 = +a4.value; applyTuning(true); renderSettings(); });
  a4.addEventListener('change', persist);
  document.querySelectorAll('[data-a4]').forEach((b) => b.addEventListener('click', () => {
    S.a4 = Math.min(450, Math.max(430, S.a4 + +b.dataset.a4)); persist(); applyTuning(true); renderSettings();
  }));
  const sens = $('#sens');
  sens.addEventListener('input', () => { S.sens = +sens.value; tracker.configure({ sens: S.sens }); renderSettings(); });
  sens.addEventListener('change', persist);
  const vol = $('#refVolume');
  vol.addEventListener('input', () => { S.refVolume = +vol.value; reference.volume = S.refVolume; renderSettings(); });
  vol.addEventListener('change', () => { persist(); reference.play(model.strings[current].freq, current); markRefPlaying(); });
  $('#autoSens').onclick = () => { S.autoSens = !S.autoSens; tracker.configure({ autoSens: S.autoSens }); persist(); renderSettings(); };
  $('#motion').onclick = () => { S.motion = !S.motion; persist(); applyAll(); };
  $('#haptics').onclick = () => { S.haptics = !S.haptics; persist(); renderSettings(); if (S.haptics) haptic(15); };
  $('#resetStatus').onclick = () => { resetDone(); renderSub(); toast(t('toast.statusReset')); };
  const rs = $('#resetSettings');
  let confirmT = 0;
  rs.onclick = () => {
    if (!rs.classList.contains('confirming')) {
      rs.classList.add('confirming'); rs.textContent = t('set.resetConfirm');
      clearTimeout(confirmT); confirmT = setTimeout(() => { rs.classList.remove('confirming'); rs.textContent = t('set.resetSettings'); }, 3500);
      return;
    }
    clearTimeout(confirmT); rs.classList.remove('confirming'); rs.textContent = t('set.resetSettings');
    S = defaultSettings(S); persist(); resetDone(); current = S.selected; applyAll(); setCurrent(S.selected);
    toast(t('toast.settingsReset'));
  };

  // tunings list and editor
  $('#tunings').addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.tune) { tuneEdit = null; selectTuning(b.dataset.tune); return; }
    if (b.dataset.tuneNew) tuneEdit = { id: null, name: '', strings: model.strings.map((x) => x.midi) };
    if (b.dataset.tuneEdit) { const c = S.customs.find((x) => x.id === b.dataset.tuneEdit); if (c) tuneEdit = { id: c.id, name: c.name, strings: c.strings.slice() }; }
    renderTunings();
    if (tuneEdit) { $('#tuningEditor').scrollIntoView({ block: 'nearest', behavior: 'smooth' }); $('#tuneName').focus({ preventScroll: true }); }
  });
  $('#tuneName').addEventListener('input', () => { if (tuneEdit) tuneEdit.name = $('#tuneName').value; });
  $('#teRows').addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b || !tuneEdit) return;
    if (b.dataset.te != null) { const i = +b.dataset.te; tuneEdit.strings[i] = Math.min(76, Math.max(45, tuneEdit.strings[i] + +b.dataset.d)); renderTunings(); }
    if (b.dataset.tePlay != null) { const i = +b.dataset.tePlay; reference.play(S.a4 * Math.pow(2, (tuneEdit.strings[i] - 69) / 12), i); markRefPlaying(); }
  });
  $('#teCancel').addEventListener('click', () => { tuneEdit = null; renderTunings(); });
  $('#teSave').addEventListener('click', () => {
    const name = $('#tuneName').value.trim().slice(0, 40);
    let id = tuneEdit.id;
    if (id) S.customs = S.customs.map((c) => (c.id === id ? { id, name, strings: tuneEdit.strings.slice() } : c));
    else { id = 'c-' + Date.now().toString(36); S.customs = S.customs.concat({ id, name, strings: tuneEdit.strings.slice() }).slice(-20); }
    tuneEdit = null; selectTuning(id); toast(t('set.tuneSaved'));
  });
  $('#teDelete').addEventListener('click', (e) => {
    const b = e.currentTarget;
    if (!b.classList.contains('confirming')) { b.classList.add('confirming'); b.textContent = t('set.resetConfirm'); setTimeout(() => { b.classList.remove('confirming'); b.textContent = t('set.tuneDelete'); }, 3500); return; }
    b.classList.remove('confirming'); b.textContent = t('set.tuneDelete');
    const id = tuneEdit.id; S.customs = S.customs.filter((c) => c.id !== id); tuneEdit = null;
    selectTuning(S.presetId === id ? 'panduri-standard' : S.presetId);
  });
  // tuner keys that turn the other way
  $('#pegFlips').addEventListener('click', (e) => {
    const b = e.target.closest('[data-peg]'); if (!b) return;
    const i = +b.dataset.peg; S.pegFlip = S.pegFlip.map((v, k) => (k === i ? !v : v)); persist(); renderSettings();
  });
}


// ─── stage mode ──────────────────────────────────────────────────────────────────────
// The whole screen shows the state (red → amber → green), a huge note and needle, readable
// from across a stage. Optional sound cues: a beep that comes faster as the string gets closer
// (low beep = tighten, high beep = loosen) and a chime when it is in tune. While a cue sounds
// the analysis pauses, so the tuner never measures its own beep.
let concertOpen = false, cueNextAt = 0, cueQuietUntil = 0, concertInTune = false, lastConcertBand = 'idle';
function openConcert() {
  concertOpen = true;
  $('#concert').hidden = false;
  requestWakeLock();
  renderConcertLabels();
  renderConcert(tracker.snap);
  $('#ccClose').focus({ preventScroll: true });
}
function closeConcert() {
  concertOpen = false; $('#concert').hidden = true;
  if (!running) releaseWakeLock();
  $('#concertBtn').focus({ preventScroll: true });
}
function renderConcertLabels() {
  $('#ccSound').setAttribute('aria-pressed', String(S.stageSound));
  $('#ccSoundLbl').textContent = t(S.stageSound ? 'concert.soundOn' : 'concert.soundOff');
  $('#ccMic').textContent = t('concert.start');
  $('#ccMic').hidden = running;
}
function renderConcert(snap) {
  const st = snap.state, live = running && (st === State.VALID || st === State.IN_TUNE);
  const hold = running && st === State.HOLD;
  const box = $('#concert');
  const strIdx = live || hold ? snap.stringIndex : current;
  const str = model.strings[strIdx];
  if (live) {
    const band = st === State.IN_TUNE ? 'excellent' : accuracyBand(Math.abs(snap.cents));
    box.dataset.band = lastConcertBand = band;
    const nm = model.name(model.freqToMidi(snap.freq));
    $('#ccNote').textContent = S.ui === 'simple' ? noteName(nm) : nm.latin;
    const c = snap.cents, a = Math.abs(c);
    $('#ccCents').textContent = (c > 0.05 ? '+' : c < -0.05 ? '−' : '±') + (a < 10 ? a.toFixed(1) : a.toFixed(0)) + '¢';
    $('#ccNeedle').style.left = (50 + Math.max(-50, Math.min(50, c))) + '%';
    const g = instruction(c, S.tol);
    $('#ccIns').textContent = g.dir === 0 ? '✓ ' + t('ins.intune') : (g.dir > 0 ? '↑ ' : '↓ ') + t('ins.' + g.key);
  } else if (!hold) {
    box.dataset.band = lastConcertBand = 'idle';
    $('#ccNote').textContent = S.ui === 'simple' ? noteName(str) : str.latin;
    $('#ccCents').textContent = '';
    $('#ccIns').textContent = t(running ? (S.harmonic ? 'ins.harmonic' : 'ins.pluck') : 'ins.off');
  }
  $('#ccString').textContent = t('string', { n: str.number }) + (lang() === 'ka' ? ' · ' + str.ka : '');
  $('#ccMic').hidden = running;
}
function beep(kind) {
  const ac = audioContext(); resumeContext();
  const t0 = ac.currentTime + 0.005, v = Math.max(0.05, S.refVolume) * 0.32;
  const tone = (f, dur, at = 0, vol = v) => {
    const o = ac.createOscillator(), g = ac.createGain();
    o.type = 'sine'; o.frequency.value = f;
    g.gain.setValueAtTime(0, t0 + at); g.gain.linearRampToValueAtTime(vol, t0 + at + 0.004);
    g.gain.exponentialRampToValueAtTime(0.0008, t0 + at + dur);
    o.connect(g).connect(ac.destination); o.start(t0 + at); o.stop(t0 + at + dur + 0.02);
  };
  if (kind === 'up') tone(1250, 0.07);                       // tighten: low beep
  else if (kind === 'down') tone(1900, 0.07);                // loosen: high beep
  else { tone(1568, 0.38, 0, v * 0.8); tone(2093, 0.42, 0.09, v * 0.7); } // in tune: chime
}
function concertCues(snap, now) {
  if (!S.stageSound || !running) return;
  const st = snap.state;
  if (st === State.IN_TUNE) {
    if (!concertInTune && snap.inTuneMs >= 250) { concertInTune = true; beep('ok'); cueQuietUntil = now + 480; haptic([14, 60, 14]); }
    return;
  }
  if (st !== State.VALID) { if (st !== State.HOLD) concertInTune = false; return; }
  concertInTune = false;
  const a = Math.abs(snap.cents);
  const period = 420 + Math.min(1, Math.max(0, (a - S.tol) / 40)) * 900; // 1.3 s far away → 0.42 s close
  if (now >= cueNextAt) { beep(snap.cents < 0 ? 'up' : 'down'); cueNextAt = now + period; cueQuietUntil = now + 170; }
}

// ─── 3D view (lazy-loaded) ──────────────────────────────────────────────────────────
function syncViewer() {
  if (!viewerOpen || !viewer) return;
  const simple = S.ui === 'simple';
  viewer.sync({
    active: current, done, level: running ? lastLevel : 0,
    labels: model.strings.map((s) => (simple ? noteName(s) : s.latin)),
  });
  if (viewerChord) {
    viewer.sync({ active: -1, done: [false, false, false], level: 0, labels: model.strings.map((s) => (simple ? noteName(s) : s.latin)) });
    $('#v3dNote').textContent = viewerChord; $('#v3dNote').dataset.band = ''; $('#v3dNote').classList.remove('ghost');
    $('#v3dIns').dataset.tone = 'neutral'; $('#v3dIns').textContent = t('v3d.chord');
    return;
  }
  $('#v3dNote').textContent = el.noteMain.textContent + (el.noteOct.textContent ? el.noteOct.textContent : '');
  $('#v3dNote').dataset.band = meterEl.dataset.band || '';
  $('#v3dNote').classList.toggle('ghost', meterEl.dataset.state !== 'live');
  const ins = $('#v3dIns');
  ins.dataset.tone = el.ins.dataset.tone;
  ins.innerHTML = el.insIco.innerHTML + '<span></span>';
  ins.lastChild.textContent = el.insText.textContent;
}

async function openViewer(chord) {
  viewerChord = chord ? chord.name : null;
  const v = $('#viewer');
  v.hidden = false;
  requestAnimationFrame(() => v.classList.add('open'));
  viewerOpen = true;
  $('#app').setAttribute('aria-hidden', 'true');
  if (!viewer) {
    $('#v3dLoading').hidden = false;
    try {
      const { Headstock3D } = await import('./view/headstock3d.js');
      viewer = new Headstock3D($('#v3d'), { onPick: (i) => pickString(i) });
    } catch (e) {
      $('#v3dLoading').textContent = t('v3d.nogl');
      return;
    }
    $('#v3dLoading').hidden = true;
  }
  viewer.start();
  if (chord) viewer.showChord(chord.f); else viewer.clearChord();
  syncViewer();
  setTimeout(() => $('#v3dClose').focus({ preventScroll: true }), 50);
}

function closeViewer() {
  const v = $('#viewer');
  v.classList.remove('open');
  viewerOpen = false;
  $('#app').removeAttribute('aria-hidden');
  if (viewer) viewer.stop();
  setTimeout(() => { if (!viewerOpen) v.hidden = true; }, 320);
  if (!toolOpen) $('#open3d').focus({ preventScroll: true });
  viewerChord = null;
}


// ─── tools (lazy-loaded pages) ─────────────────────────────────────────────────────
const TOOLS = [
  { id: 'strumtune', file: 'strumtune', icon: '<path d="M6 4v16M12 4v16M18 4v16"/><path d="M3 13c3-2 6 2 9 0s6-2 9 0"/>' },
  { id: 'chords', file: 'chords', icon: '<path d="M7 4v16M12 4v16M17 4v16M4 8h16M4 13h16"/><circle cx="12" cy="10.5" r="1.6" fill="currentColor"/><circle cx="7" cy="15.5" r="1.6" fill="currentColor"/>' },
  { id: 'ensemble', file: 'ensemble', icon: '<path d="M4 15c2-1 3-5 5-5s3 6 5 6 3-4 6-4"/><circle cx="12" cy="5" r="1.6" fill="currentColor"/>' },
  { id: 'intonation', file: 'intonation', icon: '<path d="M4 20L20 4"/><path d="M8 20v-3M12 20v-6M16 20v-9M20 20V8"/>' },
  { id: 'chordrec', file: 'chordrec', icon: '<path d="M4 18V6M8 18V10M12 18V4M16 18v-7M20 18V8"/>' },
  { id: 'metronome', file: 'metronome', icon: '<path d="M9 3h6l3 18H6z"/><path d="M12 15l5-9"/>' },
  { id: 'ear', file: 'ear', icon: '<path d="M7 10a5 5 0 1 1 10 0c0 3-2.5 3.5-3 6a3 3 0 0 1-5.5 1"/><path d="M10 10a2 2 0 1 1 4 0"/>' },
  { id: 'play', file: 'playalong', icon: '<circle cx="7" cy="17" r="2.5"/><circle cx="17" cy="15" r="2.5"/><path d="M9.5 17V6l10-2v11"/>' },
  { id: 'newstring', file: 'newstring', icon: '<path d="M5 20L19 4"/><path d="M14 4h5v5"/><circle cx="6" cy="18" r="2"/>' },
  { id: 'recorder', file: 'recorder', icon: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3.5" fill="currentColor"/>' },
  { id: 'songs', file: 'songs', icon: '<path d="M6 4h9l3 3v13H6z"/><path d="M9 11h6M9 15h6M9 7h4"/>' },
  { id: 'share', file: 'share', icon: '<circle cx="18" cy="6" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M8.2 10.8l7.6-3.6M8.2 13.2l7.6 3.6"/>' },
];
const toolCache = {};
let activeTool = null, toolMicUsers = 0, toolStartedMic = false, toolWake = null;

function renderToolsHub() {
  $('#toolsGrid').innerHTML = TOOLS.map((x) => `<button type="button" class="tool-tile" data-tool="${x.id}">
      <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${x.icon}</svg>
      <strong>${t('tool.' + x.id)}</strong><span>${t('tool.' + x.id + '.d')}</span></button>`).join('');
}

const ctx = {
  tr: makeTr(lang), lang, t, get S() { return S; }, model, siteUrl: SITE_URL,
  audio: () => audioContext(), resume: () => resumeContext(),
  toast: (m) => toast(m), haptic: (p) => haptic(p),
  refBusy: () => reference.busy,
  voice: (f, si) => reference.voice(f, si),
  detector: (sr) => new PitchDetector(sr, { windowSize: WINDOW }),
  playNotes(notes, strum, when = 0) {
    notes.forEach((m, i) => {
      const f = S.a4 * Math.pow(2, (m - 69) / 12);
      let si = 0, bd = 1e9; model.strings.forEach((s, k) => { const d = Math.abs(m - s.midi); if (d < bd) { bd = d; si = k; } });
      reference.play(f, si, when + (strum ? i * 0.055 : 0), strum ? 0.62 : 1);
    });
  },
  show3DChord(f, name) { openViewer({ f, name }); },
  /** set the A4 calibration (ensemble tool) */
  setA4(v) {
    S.a4 = Math.round(Math.min(450, Math.max(430, v)) * 10) / 10; persist();
    // matched to the ensemble on purpose — not an accidental change to warn about
    driftOk = changeSignature(S); try { localStorage.setItem(DRIFT_OK_KEY, driftOk); } catch (e) { /* ignore */ }
    applyTuning(true); renderSettings();
  },
  async mic() {
    if (!input.active) {
      const sup = micSupport();
      if (sup !== 'ok') { showMicSheet(sup); return null; }
      try { await input.start(); } catch (e) { showMicSheet(e.code || 'unknown'); return null; }
      S.micPrimed = true; persist(); toolStartedMic = true;
    }
    toolMicUsers++;
    return { sampleRate: input.sampleRate, stream: input.stream, read: () => input.read() };
  },
  releaseMic() {
    toolMicUsers = Math.max(0, toolMicUsers - 1);
    if (!toolMicUsers && toolStartedMic && !running) { input.stop(); toolStartedMic = false; }
  },
  async keepAwake(on) {
    try { if (on && 'wakeLock' in navigator) toolWake = await navigator.wakeLock.request('screen'); else if (toolWake) { toolWake.release(); toolWake = null; } } catch (e) { /* not granted */ }
  },
};

async function openTool(id, opts) {
  closeSheet();
  const def = TOOLS.find((x) => x.id === id); if (!def) return;
  if (activeTool) closeTool(true);
  const page = $('#page');
  page.hidden = false; requestAnimationFrame(() => page.classList.add('open'));
  $('#app').setAttribute('aria-hidden', 'true');
  toolOpen = true;
  if (running) { head.setSignal(-1, 0); gauge.set(null, 'idle', false); }
  let tool = toolCache[id];
  if (!tool) {
    $('#pageBody').innerHTML = `<p class="viewer-loading">${t('v3d.loading')}</p>`;
    const mod = await import(`./tools/${def.file}.js`);
    tool = toolCache[id] = mod.create(ctx);
  }
  activeTool = { id, tool };
  $('#pageTitle').textContent = tool.title();
  $('#pageBody').replaceChildren(tool.el);
  $('#pageBody').scrollTop = 0;
  tool.open(opts || {});
  setTimeout(() => $('#pageBack').focus({ preventScroll: true }), 60);
}

function closeTool(instant) {
  if (!activeTool) return;
  activeTool.tool.close();
  activeTool = null;
  const page = $('#page');
  page.classList.remove('open');
  $('#app').removeAttribute('aria-hidden');
  toolOpen = false;
  setTimeout(() => { if (!activeTool) page.hidden = true; }, instant ? 0 : 300);
}

// ─── parallax ────────────────────────────────────────────────────────────────────────
let pxRaf = 0, pxX = 0, pxY = 0;
function onPointerMove(e) {
  if (!S.motion || reducedMotion.matches) return;
  pxX = Math.max(-1, Math.min(1, (e.clientX / window.innerWidth) * 2 - 1));
  pxY = Math.max(-1, Math.min(1, (e.clientY / window.innerHeight) * 2 - 1));
  if (!pxRaf) pxRaf = requestAnimationFrame(() => {
    pxRaf = 0;
    const r = document.documentElement.style;
    r.setProperty('--px', pxX.toFixed(3)); r.setProperty('--py', pxY.toFixed(3));
  });
}
function resetParallax() { const r = document.documentElement.style; r.setProperty('--px', '0'); r.setProperty('--py', '0'); }

// ─── lifecycle ───────────────────────────────────────────────────────────────────────
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    if (running) { resumeOnVisible = true; stopMic(); }
    reference.stop();
    try { audioContext().suspend(); } catch (e) { /* noop */ }
  } else if (resumeOnVisible) {
    resumeOnVisible = false;
    startMic(true);
  }
});
window.addEventListener('pagehide', () => { if (running) stopMic(); });
// iOS may keep the context suspended after returning; the next touch wakes it
document.addEventListener('pointerdown', () => { if (running) resumeContext(); }, { passive: true });
document.addEventListener('gesturestart', (e) => e.preventDefault());

// ─── wiring ──────────────────────────────────────────────────────────────────────────
function bind() {
  el.mic.addEventListener('click', onMicButton);
  $('#micGo').addEventListener('click', () => { closeSheet(); S.micPrimed = true; persist(); startMic(); });
  $('#micCancel').addEventListener('click', closeSheet);
  el.ref.addEventListener('click', () => {
    if (el.ref.classList.contains('playing')) { stopReference(); return; }
    playReference(current);
  });
  $('#chordBtn').addEventListener('click', () => { reference.stop(); reference.playChord(model.strings); markRefPlaying(); });
  $('#open3d').addEventListener('click', () => openViewer());
  $('#concertBtn').addEventListener('click', openConcert);
  $('#ccClose').addEventListener('click', closeConcert);
  $('#ccSound').addEventListener('click', () => { S.stageSound = !S.stageSound; persist(); renderConcertLabels(); });
  $('#ccMic').addEventListener('click', () => { if (!running) onMicButton(); });
  $('#openTools').addEventListener('click', () => { renderToolsHub(); openSheet('#toolsSheet'); });
  $('#toolsGrid').addEventListener('click', (e) => { const b = e.target.closest('[data-tool]'); if (b) openTool(b.dataset.tool); });
  $('#pageBack').addEventListener('click', () => closeTool());
  $('#v3dClose').addEventListener('click', closeViewer);
  $('#v3dReset').addEventListener('click', () => viewer && viewer.reset());
  document.addEventListener('keydown', (e) => { if (e.key !== 'Escape') return; if (concertOpen) closeConcert(); else if (viewerOpen) closeViewer(); else if (activeTool) closeTool(); });
  $('#meterToggle').addEventListener('click', () => { setMeterView(S.meter === 'needle' ? 'strobe' : 'needle'); persist(); renderSettings(); });
  $('#openSettings').addEventListener('click', () => openSheet('#settings'));
  $('#langBtn').addEventListener('click', () => { S.lang = lang() === 'ka' ? 'en' : 'ka'; persist(); applyLanguage(); });
  $('#driftGo').addEventListener('click', driftAction);
  $('#driftX').addEventListener('click', driftDismiss);
  $('#recommendBtn').addEventListener('click', () => { const was = tuningChanges(S).length; restoreRecommended(false); if (!was) toast(t('drift.restored')); closeSheet(); });
  $('#brand').addEventListener('click', () => { if (!brandLong) openSheet('#settings'); brandLong = false; });
  $('#scrim').addEventListener('click', closeSheet);
  document.querySelectorAll('[data-close]').forEach((b) => b.addEventListener('click', closeSheet));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeSheet(); });
  $('#completeOk').addEventListener('click', () => { $('#complete').hidden = true; });
  $('#complete').addEventListener('click', (e) => { if (e.target.id === 'complete') $('#complete').hidden = true; });

  const modes = $('#modes');
  modes.addEventListener('click', (e) => { const b = e.target.closest('button'); if (b && b.dataset.mode !== S.mode) setMode(b.dataset.mode); });
  modes.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    const order = ['auto', 'manual', 'guided'];
    const i = order.indexOf(S.mode);
    setMode(order[(i + (e.key === 'ArrowRight' ? 1 : 2)) % 3]);
    modes.querySelector(`[data-mode="${S.mode}"]`).focus();
  });

  // hidden diagnostics: long-press the title, or ?debug
  let lp = 0;
  const brand = $('#brand');
  brand.addEventListener('pointerdown', () => { lp = setTimeout(() => { brandLong = true; diag.toggle(); toast(t(diag.enabled ? 'toast.diagOn' : 'toast.diagOff'), 1500); }, 1100); });
  ['pointerup', 'pointerleave', 'pointercancel'].forEach((ev) => brand.addEventListener(ev, () => clearTimeout(lp)));
  if (/[?&]debug\b/.test(location.search)) diag.toggle(true);

  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('pointerup', resetParallax, { passive: true });
  document.documentElement.addEventListener('pointerleave', resetParallax);
  window.addEventListener('resize', () => { strobe.resize(); trace.resize(); requestRender(); });
  reducedMotion.addEventListener && reducedMotion.addEventListener('change', applyAll);

  bindSettings();
  bindFader();
}
let brandLong = false;

function renderLangBtn() {
  const ka = lang() === 'ka';
  $('#langBtnTxt').textContent = ka ? 'EN' : 'ქა';
  $('#langBtn').setAttribute('aria-label', ka ? 'Switch to English' : 'ქართულზე გადართვა');
  $('#langBtn').setAttribute('lang', ka ? 'en' : 'ka');
}
function applyLanguage() {
  setLang(S.lang);
  applyStatic();
  renderLangBtn();
  setMicUI(micState);
  el.refLbl.textContent = t(el.ref.classList.contains('playing') ? 'dock.refStop' : 'dock.ref');
  lastNoteKey = '';
  applyAll();
  if (!running || isIdle()) showIdleNote();
  updateInstruction(true);
  renderSub();
  syncViewer();
  if (concertOpen) { renderConcertLabels(); renderConcert(tracker.snap); }
  if (activeTool) { $('#pageTitle').textContent = activeTool.tool.title(); activeTool.tool.open({}); }
}

// ─── boot ────────────────────────────────────────────────────────────────────────────
bind();
setLang(S.lang);
applyStatic();
renderLangBtn();
setMicUI('off');
applyAll();
setCurrent(S.mode === 'auto' ? 0 : S.selected);
showIdleNote();
updateInstruction(true);
requestRender();
requestAnimationFrame(() => document.body.classList.add('ready'));

// deep links: ?chord=Am opens the chord page, ?tool=metronome opens a tool
{
  const qs = new URLSearchParams(location.search);
  const ch = qs.get('chord'), tl = qs.get('tool');
  if (ch) import('./music.js').then(({ parseChord }) => { const p = parseChord(ch); if (p) openTool('chords', { chord: p }); });
  else if (tl) openTool(tl);
}

if (NATIVE) {
  $('#privacyLink').href = SITE_URL + 'privacy.html';
  $('#supportLink').href = SITE_URL + 'support.html';
} else if ('serviceWorker' in navigator && window.isSecureContext && location.protocol !== 'file:') {
  window.addEventListener('load', () => {
    // a page that was already running an older version reloads once when the new one takes over
    const hadController = !!navigator.serviceWorker.controller;
    let reloaded = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!hadController || reloaded || running) return; // never interrupt an active tuning
      reloaded = true; location.reload();
    });
    navigator.serviceWorker.register('sw.js', { updateViaCache: 'none' }).then((reg) => {
      reg.update().catch(() => {});
      document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') reg.update().catch(() => {}); });
    }).catch(() => {});
  });
}

// test hook (used by automated browser checks only)
window.__panduri = { tracker, model, get running() { return running; }, get done() { return done.slice(); } };
