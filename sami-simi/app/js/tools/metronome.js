// Metronome with panduri-pluck or click sounds, sample-accurate Web Audio scheduling.
import { renderPluck } from '../reference.js';
import { h } from './ui.js';

const L = {
  ka: { title: 'მეტრონომი', start: 'დაწყება', stop: 'გაჩერება', tap: 'რიტმზე შეხება', sound: 'ხმა', panduri: 'ფანდური', click: 'კლიკი', meter: 'ზომა', bpm: 'დარტყმა/წთ' },
  en: { title: 'Metronome', start: 'Start', stop: 'Stop', tap: 'Tap tempo', sound: 'Sound', panduri: 'Panduri', click: 'Click', meter: 'Meter', bpm: 'BPM' },
};
// accent levels per beat: 2 = strong, 1 = secondary, 0 = weak
const METERS = {
  '2/4': [2, 0], '3/4': [2, 0, 0], '4/4': [2, 0, 1, 0],
  '5/8': [2, 0, 0, 1, 0], '6/8': [2, 0, 0, 1, 0, 0], '7/8': [2, 0, 0, 1, 0, 1, 0],
};
const KEY = 'sami-simi:metronome';

export function create(ctx) {
  const tr = (k, v) => ctx.tr(L, k, v);
  let st = { bpm: 90, meter: '4/4', sound: 'panduri' };
  try { Object.assign(st, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) { /* ignore */ }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) { /* ignore */ } };
  let playing = false, nextTime = 0, beat = 0, timer = 0, raf = 0, queue = [], taps = [];
  const bufs = {};

  const el = h(`<div class="tool metro">
    <div class="metro-dots"></div>
    <div class="metro-bpm"><button type="button" class="round" data-d="-1" aria-label="−1">−</button><div><strong class="bpm-val"></strong><span class="bpm-lbl"></span></div><button type="button" class="round" data-d="1" aria-label="+1">+</button></div>
    <input type="range" class="bpm-range" min="30" max="240" step="1" aria-label="BPM">
    <div class="field-row2"><span class="lab2" data-l="meter"></span><div class="chips meters"></div></div>
    <div class="field-row2"><span class="lab2" data-l="sound"></span><div class="chips sounds"></div></div>
    <div class="row-btns"><button type="button" class="btn-primary wide-btn" data-act="play"></button><button type="button" class="btn-ghost bordered" data-act="tap"></button></div>
  </div>`);

  function buffers() {
    const ac = ctx.audio();
    const key = st.sound + ac.sampleRate;
    const mk = (data) => { const b = ac.createBuffer(1, data.length, ac.sampleRate); b.getChannelData(0).set(data); return { buffer: b, rate: 1 }; };
    let set;
    if (st.sound === 'panduri') {
      const s = ctx.model.strings;
      const notes = [[s[0].freq, 0], [s[1].freq, 1], [s[2].freq * 2, 2]];
      const real = notes.map(([f, i]) => ctx.voice && ctx.voice(f, i));
      if (real.every(Boolean)) {
        // a short slice of the recorded pluck with a quick fade, so beats don't smear together
        const k2 = 'real' + key; if (bufs[k2]) return bufs[k2];
        return (bufs[k2] = real.map((v) => {
          const sr = v.buffer.sampleRate, n = Math.min(v.buffer.length, Math.floor(0.45 * v.rate * sr)), fade = Math.floor(0.12 * v.rate * sr);
          const d = v.buffer.getChannelData(0).slice(0, n);
          for (let i = n - fade; i < n; i++) d[i] *= (n - i) / fade;
          const b = ac.createBuffer(1, n, sr); b.getChannelData(0).set(d); return { buffer: b, rate: v.rate };
        }));
      }
      if (bufs[key]) return bufs[key];
      set = notes.map(([f, i]) => mk(renderPluck(f, ac.sampleRate, { stringIndex: i, duration: 0.45 })));
    } else {
      if (bufs[key]) return bufs[key];
      const click = (f, len) => { const n = Math.floor(ac.sampleRate * len), d = new Float32Array(n); for (let i = 0; i < n; i++) { const t = i / ac.sampleRate; d[i] = Math.sin(2 * Math.PI * f * t) * Math.exp(-t * 60) * 0.8; } return d; };
      set = [mk(click(1100, 0.06)), mk(click(1500, 0.06)), mk(click(2000, 0.07))];
    }
    return (bufs[key] = set);
  }

  function schedule() {
    const ac = ctx.audio();
    const pattern = METERS[st.meter];
    const spb = (60 / st.bpm) * (st.meter.endsWith('/8') ? 0.5 : 1);
    const b = buffers();
    while (nextTime < ac.currentTime + 0.12) {
      const acc = pattern[beat % pattern.length];
      const src = ac.createBufferSource(); const g = ac.createGain();
      src.buffer = b[acc].buffer; src.playbackRate.value = b[acc].rate; g.gain.value = (acc === 2 ? 0.9 : acc === 1 ? 0.65 : 0.45) * (ctx.S.refVolume || 0.75);
      src.connect(g).connect(ac.destination); src.start(nextTime);
      queue.push({ t: nextTime, i: beat % pattern.length });
      nextTime += spb; beat++;
    }
  }
  function draw() {
    raf = requestAnimationFrame(draw);
    const now = ctx.audio().currentTime;
    while (queue.length > 1 && queue[1].t <= now) queue.shift();
    const cur = queue[0] && queue[0].t <= now ? queue[0].i : -1;
    el.querySelectorAll('.metro-dots i').forEach((d, i) => d.classList.toggle('on', i === cur));
  }
  async function start() {
    const ac = ctx.audio(); await ctx.resume();
    playing = true; beat = 0; queue = []; nextTime = ac.currentTime + 0.08;
    schedule(); timer = setInterval(schedule, 25); draw(); render();
    ctx.keepAwake(true);
  }
  function stop() { playing = false; clearInterval(timer); cancelAnimationFrame(raf); queue = []; el.querySelectorAll('.metro-dots i').forEach((d) => d.classList.remove('on')); render(); ctx.keepAwake(false); }

  function render() {
    el.querySelectorAll('[data-l]').forEach((n) => (n.textContent = tr(n.dataset.l)));
    el.querySelector('.bpm-val').textContent = st.bpm;
    el.querySelector('.bpm-lbl').textContent = tr('bpm');
    el.querySelector('.bpm-range').value = st.bpm;
    el.querySelector('.meters').innerHTML = Object.keys(METERS).map((m) => `<button type="button" role="radio" aria-checked="${m === st.meter}" data-m="${m}">${m}</button>`).join('');
    el.querySelector('.sounds').innerHTML = ['panduri', 'click'].map((s) => `<button type="button" role="radio" aria-checked="${s === st.sound}" data-s="${s}">${tr(s)}</button>`).join('');
    el.querySelector('.metro-dots').innerHTML = METERS[st.meter].map((a) => `<i class="a${a}"></i>`).join('');
    el.querySelector('[data-act="play"]').textContent = playing ? '■ ' + tr('stop') : '▶ ' + tr('start');
    el.querySelector('[data-act="tap"]').textContent = tr('tap');
  }
  const setBpm = (v) => { st.bpm = Math.max(30, Math.min(240, Math.round(v))); save(); render(); };

  el.addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.d) setBpm(st.bpm + +b.dataset.d);
    else if (b.dataset.m) { st.meter = b.dataset.m; save(); if (playing) { beat = 0; } render(); }
    else if (b.dataset.s) { st.sound = b.dataset.s; save(); render(); }
    else if (b.dataset.act === 'play') playing ? stop() : start();
    else if (b.dataset.act === 'tap') {
      const now = performance.now(); taps = taps.filter((t) => now - t < 2500); taps.push(now);
      if (taps.length >= 2) { const iv = (taps[taps.length - 1] - taps[0]) / (taps.length - 1); setBpm(60000 / iv); }
    }
  });
  el.querySelector('.bpm-range').addEventListener('input', (e) => setBpm(+e.target.value));
  let hold = 0;
  el.querySelectorAll('[data-d]').forEach((b) => {
    b.addEventListener('pointerdown', () => { hold = setTimeout(function rep() { setBpm(st.bpm + +b.dataset.d * 5); hold = setTimeout(rep, 120); }, 450); });
    ['pointerup', 'pointerleave', 'pointercancel'].forEach((ev) => b.addEventListener(ev, () => clearTimeout(hold)));
  });

  return { el, title: () => tr('title'), open() { render(); }, close() { stop(); } };
}
