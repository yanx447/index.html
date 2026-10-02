// Chord recognition: chroma from the microphone spectrum, matched against chord templates.
// Also estimates how far each string of the recognised chord is from equal temperament.
import { chroma, matchChord, chordName, fingering, Spectrum, pcLatin, pcKa } from '../music.js';
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

  function stringCheck(f, mags, binHz) {
    const a4 = ctx.S.a4;
    return f.notes.map((m) => {
      const ft = a4 * Math.pow(2, (m - 69) / 12);
      const i0 = Math.floor((ft * 0.966) / binHz), i1 = Math.ceil((ft * 1.035) / binHz);
      let bi = -1, bm = 0;
      for (let i = Math.max(1, i0); i <= Math.min(mags.length - 2, i1); i++) if (mags[i] > bm && mags[i] >= mags[i - 1] && mags[i] >= mags[i + 1]) { bm = mags[i]; bi = i; }
      if (bi < 0) return null;
      const a = mags[bi - 1], b = mags[bi], c = mags[bi + 1], den = a - 2 * b + c, d = den ? (0.5 * (a - c)) / den : 0;
      return 1200 * Math.log2(((bi + d) * binHz) / ft);
    });
  }

  function tick() {
    if (!mic) return;
    const x = mic.read();
    let e = 0; for (let i = x.length - 4096; i < x.length; i++) e += x[i] * x[i];
    const rms = Math.sqrt(e / 4096);
    const bars = el.querySelectorAll('.chroma i');
    if (rms < 0.004) { hist.push(null); if (hist.length > 6) hist.shift(); smoothCh.fill(0); bars.forEach((b) => (b.style.transform = 'scaleY(0.02)')); return; }
    const mags = sp.compute(x), binHz = mic.sampleRate / N;
    const ch = chroma(mags, binHz, ctx.S.a4);
    for (let k = 0; k < 12; k++) smoothCh[k] = smoothCh[k] * 0.5 + ch[k] * 0.5;
    const max = Math.max(...smoothCh) || 1;
    bars.forEach((b, k) => (b.style.transform = `scaleY(${(0.02 + 0.98 * smoothCh[k] / max).toFixed(3)})`));
    const m = matchChord(smoothCh);
    hist.push(m.score > 0.3 ? `${m.root}|${m.q}` : null); if (hist.length > 6) hist.shift();
    const counts = {}; hist.forEach((k) => k && (counts[k] = (counts[k] || 0) + 1));
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    if (top && top[1] >= 4) {
      const [r, q] = top[0].split('|'); const root = +r;
      const nm = chordName(root, q, ctx.lang());
      el.querySelector('.rec-name').textContent = nm.short;
      el.querySelector('.rec-long').textContent = nm.long;
      el.querySelector('.conf i').style.transform = `scaleX(${Math.max(0.05, Math.min(1, (m.score - 0.3) / 0.35)).toFixed(2)})`;
      const f = fingering(root, q, ctx.model.strings.map((s) => s.midi));
      if (shown !== top[0]) { shown = top[0]; el.querySelector('.chord-diag').innerHTML = chordDiagram(f, ctx.model.strings.map((s) => (ctx.lang() === 'ka' ? s.ka : s.latin))); el.querySelector('.rec-detail').hidden = false; }
      const dev = stringCheck(f, mags, binHz);
      el.querySelector('.str-check').innerHTML = dev.map((c, i) => {
        const s = ctx.model.strings[i];
        const txt = c == null ? tr('notHeard') : Math.abs(c) <= 5 ? tr('clean') : c < 0 ? tr('low', { c: Math.round(-c) }) : tr('high', { c: Math.round(c) });
        const cls = c == null ? 'na' : Math.abs(c) <= 5 ? 'ok' : Math.abs(c) <= 15 ? 'warn' : 'bad';
        return `<li class="${cls}"><span>${ctx.lang() === 'ka' ? s.ka : s.latin}</span><b>${esc(txt)}</b></li>`;
      }).join('');
    }
  }

  async function toggle() {
    if (mic) { stop(); return; }
    mic = await ctx.mic(); if (!mic) return;
    el.querySelector('.rec-name').textContent = '…'; el.querySelector('.rec-long').textContent = tr('listening');
    timer = setInterval(tick, 110); labels();
  }
  function stop() { clearInterval(timer); timer = 0; if (mic) ctx.releaseMic(); mic = null; hist = []; labels(); }

  el.querySelector('[data-act="mic"]').addEventListener('click', toggle);
  return { el, title: () => tr('title'), open() { labels(); }, close() { stop(); } };
}
