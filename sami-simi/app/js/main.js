// App controller — wires audio → detector → tracker → views, and owns UI state.

import { TuningModel } from './tuning.js';
import { PitchDetector } from './pitch-detector.js';
import { PitchTracker, State } from './tracker.js';
import { instruction } from './guidance.js';
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
const input = new AudioInput(8192); // detector uses the last 4096 samples; chord recognition the full 8192
const reference = new ReferenceEngine();
reference.load(); // decode the recorded plucks in the background
let detector = null;

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
  tracker.configure({ strings: model.strings, mode: S.mode, selected: S.selected, autoSens: S.autoSens, sens: S.sens, tol: S.tol });
  if (resetStatus) resetDone();
  renderLabels();
}

function applyAll() {
  document.body.classList.toggle('simple', S.ui === 'simple');
  document.body.classList.toggle('no-motion', !S.motion || reducedMotion.matches);
  reference.volume = S.refVolume;
  gauge.setTolerance(S.tol);
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
}

function pickString(i) {
  if (S.mode === 'auto') S.mode = 'manual';
  S.selected = i;
  if (S.mode === 'guided') guidedNextAt = 0;
  persist();
  tracker.configure({ mode: S.mode, selected: i, awaitOnset: running });
  setCurrent(i);
  renderMode();
  if (!running) { showIdleNote(); updateInstruction(true); reference.play(model.strings[i].freq, i); markRefPlaying(); }
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
  if (reference.busy) return setInstruction('ref', 'neutral', 'ear', t('ins.ref'));
  if (!running) {
    if (S.mode === 'guided') return setInstruction('off-g', 'neutral', null, t('ins.offGuided'));
    return setInstruction('off', 'neutral', null, t('ins.off'));
  }
  const snap = tracker.snap;
  switch (snap.state) {
    case State.CALIBRATING: return setInstruction('cal', 'neutral', 'wait', t('ins.cal'));
    case State.LISTENING:
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
  head.setDirection(current, live && st !== State.IN_TUNE ? (snap.cents < 0 ? 1 : -1) : 0);
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
  const t0 = now;
  let snap;
  if (reference.busy) { snap = tracker.update(null, now); lastDet = null; }
  else {
    const det = detector.analyze(input.read(), tracker.prior);
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
  if (!detector || detector.sr !== input.sampleRate) detector = new PitchDetector(input.sampleRate, { windowSize: WINDOW });
  tracker.configure({ strings: model.strings, mode: S.mode, selected: S.selected, autoSens: S.autoSens, sens: S.sens, tol: S.tol });
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
  $('#presetName').textContent = t('preset.' + model.preset.id);
  $('#presetNotes').innerHTML = model.strings.map((s) => `<span>${t('string', { n: s.number })} — ${lang() === 'ka' ? s.ka + ' (' + s.latin + s.octave + ')' : s.latin + s.octave}</span>`).join('');
  $('#transVal').textContent = t('set.semitones', { n: (S.transpose > 0 ? '+' : S.transpose < 0 ? '−' : '') + Math.abs(S.transpose) });
  $('#transNotes').textContent = model.label();
  $('#octVal').textContent = model.labelWithOctaves();
  const a4 = $('#a4'); a4.value = S.a4; setFill(a4);
  $('#a4Val').textContent = (S.a4 % 1 ? S.a4.toFixed(1) : S.a4) + ' ' + t('hz');
  const sens = $('#sens'); sens.value = S.sens; sens.disabled = S.autoSens; setFill(sens);
  $('#sensVal').textContent = S.autoSens ? t('set.auto') : S.sens + ' / 10';
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
}
function setSwitch(sel, v) { $(sel).setAttribute('aria-checked', String(!!v)); }

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
      const v = key === 'octave' || key === 'tol' ? +raw : raw;
      if (S[key] === v) return;
      S[key] = v; persist();
      if (key === 'octave') applyTuning(true);
      if (key === 'tol') { tracker.configure({ tol: v }); gauge.setTolerance(v); trace.tol = v; trace.draw(); }
      if (key === 'meter') setMeterView(v);
      if (key === 'ui') { applyAll(); updateInstruction(true); }
      if (key === 'lang') applyLanguage();
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
  { id: 'chords', file: 'chords', icon: '<path d="M7 4v16M12 4v16M17 4v16M4 8h16M4 13h16"/><circle cx="12" cy="10.5" r="1.6" fill="currentColor"/><circle cx="7" cy="15.5" r="1.6" fill="currentColor"/>' },
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
    if (el.ref.classList.contains('playing')) { reference.stop(); markRefIdle(); return; }
    reference.play(model.strings[current].freq, current); markRefPlaying();
  });
  $('#chordBtn').addEventListener('click', () => { reference.stop(); reference.playChord(model.strings); markRefPlaying(); });
  $('#open3d').addEventListener('click', () => openViewer());
  $('#openTools').addEventListener('click', () => { renderToolsHub(); openSheet('#toolsSheet'); });
  $('#toolsGrid').addEventListener('click', (e) => { const b = e.target.closest('[data-tool]'); if (b) openTool(b.dataset.tool); });
  $('#pageBack').addEventListener('click', () => closeTool());
  $('#v3dClose').addEventListener('click', closeViewer);
  $('#v3dReset').addEventListener('click', () => viewer && viewer.reset());
  document.addEventListener('keydown', (e) => { if (e.key !== 'Escape') return; if (viewerOpen) closeViewer(); else if (activeTool) closeTool(); });
  $('#meterToggle').addEventListener('click', () => { setMeterView(S.meter === 'needle' ? 'strobe' : 'needle'); persist(); renderSettings(); });
  $('#openSettings').addEventListener('click', () => openSheet('#settings'));
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
}
let brandLong = false;

function applyLanguage() {
  setLang(S.lang);
  applyStatic();
  setMicUI(micState);
  el.refLbl.textContent = t(el.ref.classList.contains('playing') ? 'dock.refStop' : 'dock.ref');
  lastNoteKey = '';
  applyAll();
  if (!running || isIdle()) showIdleNote();
  updateInstruction(true);
  renderSub();
  syncViewer();
  if (activeTool) { $('#pageTitle').textContent = activeTool.tool.title(); activeTool.tool.open({}); }
}

// ─── boot ────────────────────────────────────────────────────────────────────────────
bind();
setLang(S.lang);
applyStatic();
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
  window.addEventListener('load', () => { navigator.serviceWorker.register('sw.js').catch(() => {}); });
}

// test hook (used by automated browser checks only)
window.__panduri = { tracker, model, get running() { return running; }, get done() { return done.slice(); } };
