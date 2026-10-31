// Chord recognition: notes are picked out of the spectrum one harmonic series at a time (so the
// panduri's strong overtones are not mistaken for notes), matched against chord templates, and
// latched at the strum — a fast-fading low string must not turn the chord into another one.
// Also estimates how far each string of the recognised chord is from equal temperament.
import { noteProfile, matchChord, chordName, fingering, Spectrum, pcLatin, pcKa } from '../music.js';
import { h, chordDiagram, esc } from './ui.js';

const L = {
  ka: { title: 'აკორდის ამოცნობა', start: 'ჩართე მიკროფონი', stop: 'გაჩერება', hint: 'ჩამოკარი აკორდი და დაიჭირე ჟღერადობა', listening: 'ვუსმენ…', strings: 'სიმები ამ აკორდში', clean: 'წმინდად ჟღერს', low: '{c}¢ დაბლა', high: '{c}¢ მაღლა', notHeard: 'არ ისმის', note: 'შეფასება მიახლოებითია — ზუსტი აწყობისთვის გამოიყენე ტიუნერი.' },
  en: { title: 'Chord recognition', start: 'Turn on microphone', stop: 'Stop', hint: 'Strum a chord and let it ring', listening: 'Listening…', strings: 'Strings in this chord', clean: 'in tune', low: '{c}¢ flat', high: '{c}¢ sharp', notHeard: 'not heard', note: 'This is an estimate — use the tuner for exact tuning.' },
};
const N = 8192;

export function create(ctx) {
  const tr = (k, v) => ctx.tr(L, k, v);
  const sp = new Spectrum(N);
  let timer = 0, mic = null, hist = [], shown = null, smoothCh = new Float64Array(12);
  let slowRms = 0, onsetAt = -1e9, latched = null, votes = [], devs = null;
  const el = h(`<div class="tool chordrec">
    <div class="rec-big"><strong class="rec-name">—</strong><span class="rec-long"></span><div class="conf"><i></i></div></div>
    <div class="chroma"></div>
    <div class="rec-detail" hidden><div class="chord-diag"></div><div><h3 class="sub-h"></h3><ul class="str-check"></ul></div></div>
    <p class="tool-hint"></p>
    <button type="button" class="btn-primary wide-btn" data-act="mic"></button>
    <p class="fine-note"></p>
  </div>`);
  const names = () => Array.from({ length: 12 }, (_, i) => (ctx.lang() === 'ka' ? pcKa(i) : pcLatin(i)));

  function labels() {
    el.querySelector('.tool-hint').textContent = tr('hint');
    el.querySelector('[data-act="mic"]').textContent = mic ? tr('stop') : tr('start');
    el.querySelector('.fine-note').textContent = tr('note');
    el.querySelector('.rec-detail .sub-h').textContent = tr('strings');
    el.querySelector('.chroma').innerHTML = names().map((n) => `<div class="cb"><i></i><span>${esc(n)}</span></div>`).join('');
  }

  const median = (a) => { const v = a.filter((x) => x != null).sort((p, q) => p - q); return v.length ? v[v.length >> 1] : null; };

  /** cents of each chord note vs. equal temperament, from the notes the profile found */
  function stringCheck(f, notes) {
    const a4 = ctx.S.a4;
    return f.notes.map((m) => {
      const nt = notes.find((n) => n.midi === m) || notes.find((n) => ((n.midi - m) % 12 + 12) % 12 === 0);
      if (!nt) return null;
      const ft = a4 * Math.pow(2, (nt.midi - 69) / 12);
      return 1200 * Math.log2(nt.f / ft);
    });
  }

  function show(key, score) {
    const [r, q] = key.split('|'); const root = +r;
    const nm = chordName(root, q, ctx.lang());
    el.querySelector('.rec-name').textContent = nm.short;
    el.querySelector('.rec-long').textContent = nm.long;
    el.querySelector('.conf i').style.transform = `scaleX(${Math.max(0.05, Math.min(1, (score - 0.3) / 0.6)).toFixed(2)})`;
    const f = fingering(root, q, ctx.model.strings.map((s) => s.midi));
    if (shown !== key) { shown = key; el.querySelector('.chord-diag').innerHTML = chordDiagram(f, ctx.model.strings.map((s) => (ctx.lang() === 'ka' ? s.ka : s.latin))); el.querySelector('.rec-detail').hidden = false; }
    return f;
  }

  function renderDevs(dev) {
    el.querySelector('.str-check').innerHTML = dev.map((c, i) => {
      const s = ctx.model.strings[i];
      const txt = c == null ? tr('notHeard') : Math.abs(c) <= 5 ? tr('clean') : c < 0 ? tr('low', { c: Math.round(-c) }) : tr('high', { c: Math.round(c) });
      const cls = c == null ? 'na' : Math.abs(c) <= 5 ? 'ok' : Math.abs(c) <= 15 ? 'warn' : 'bad';
      return `<li class="${cls}"><span>${ctx.lang() === 'ka' ? s.ka : s.latin}</span><b>${esc(txt)}</b></li>`;
    }).join('');
  }

  function tick() {
    if (!mic) return;
    const x = mic.read(), now = performance.now();
    let e = 0; for (let i = x.length - 4096; i < x.length; i++) e += x[i] * x[i];
    const rms = Math.sqrt(e / 4096);
    const bars = el.querySelectorAll('.chroma i');
    const onset = rms > 0.006 && rms > slowRms * 1.8;
    slowRms = slowRms ? slowRms * 0.85 + rms * 0.15 : rms;
    if (onset && now - onsetAt > 250) { onsetAt = now; votes = []; devs = []; latched = null; }
    if (rms < 0.004) { hist.push(null); if (hist.length > 6) hist.shift(); smoothCh.fill(0); bars.forEach((b) => (b.style.transform = 'scaleY(0.02)')); return; }
    const mags = sp.compute(x), binHz = mic.sampleRate / N;
    const tuning = ctx.model.strings.map((s) => s.midi);
    const prof = noteProfile(mags, binHz, ctx.S.a4, tuning);
    for (let k = 0; k < 12; k++) smoothCh[k] = smoothCh[k] * 0.5 + prof.chroma[k] * 0.5;
    const max = Math.max(...smoothCh) || 1;
    bars.forEach((b, k) => (b.style.transform = `scaleY(${(0.02 + 0.98 * smoothCh[k] / max).toFixed(3)})`));
    const m = matchChord(prof.chroma, prof.bass);
    const key = m.score > 0.3 ? `${m.root}|${m.q}` : null;

    // 1) right after a strum: vote, then latch the chord until the next strum
    const since = now - onsetAt;
    if (since < 900) {
      if (since > 120 && key) {
        votes.push(key);
        const f = fingering(m.root, m.q, tuning);
        devs.push({ key, d: stringCheck(f, prof.notes) });
        const c = {}; votes.forEach((k) => (c[k] = (c[k] || 0) + 1));
        const top = Object.entries(c).sort((a, b) => b[1] - a[1])[0];
        if (top[1] >= 3 && top[1] / votes.length >= 0.6) latched = { key: top[0], score: m.score };
      }
      if (latched) {
        const f = show(latched.key, latched.score);
        const rows = devs.filter((d) => d.key === latched.key).map((d) => d.d);
        renderDevs(f.notes.map((_, i) => median(rows.map((r) => r[i]))));
      }
      return;
    }
    if (latched) return; // keep showing what was strummed while it rings

    // 2) no clear strum (e.g. a held, re-picked chord): majority of recent frames
    hist.push(key); if (hist.length > 6) hist.shift();
    const counts = {}; hist.forEach((k) => k && (counts[k] = (counts[k] || 0) + 1));
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    if (top && top[1] >= 4) {
      const f = show(top[0], m.score);
      renderDevs(stringCheck(f, prof.notes));
    }
  }

  async function toggle() {
    if (mic) { stop(); return; }
    mic = await ctx.mic(); if (!mic) return;
    el.querySelector('.rec-name').textContent = '…'; el.querySelector('.rec-long').textContent = tr('listening');
    timer = setInterval(tick, 110); labels();
  }
  function stop() { clearInterval(timer); timer = 0; if (mic) ctx.releaseMic(); mic = null; hist = []; latched = null; votes = []; slowRms = 0; labels(); }

  el.querySelector('[data-act="mic"]').addEventListener('click', toggle);
  return { el, title: () => tr('title'), open() { labels(); }, close() { stop(); } };
}
