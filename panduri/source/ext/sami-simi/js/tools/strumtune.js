// All three at once: strum the open strings, get a reading for every string from one strum.
// Each string's fundamental is measured separately (they don't overlap: A3 · C♯4 · E4).
// A hard strum starts sharp and settles within ~0.5 s (measured on a real panduri: E −3¢ → −7¢),
// so only the settled part of the ring is used.
import { strumCheck } from '../music.js';
import { h, esc } from './ui.js';

const L = {
  ka: {
    title: 'სამივე სიმი ერთად', start: 'ჩართე მიკროფონი', stop: 'გაჩერება',
    hint: 'ჩამოკარი სამივე ღია სიმი ერთად და დაელოდე, სანამ ჟღერს.',
    wait: 'ჩამოკარი ღია სიმები', measuring: 'ვზომავ… დაელოდე', done: 'შედეგი — ჩამოკარი ხელახლა შესამოწმებლად',
    ok: 'აწყობილია', up: 'მოუჭირე', down: 'მოუშვი', none: 'არ ისმის',
    allok: 'სამივე სიმი აწყობილია ✓', fix: 'ააწყე {s} — მერე ისევ ჩამოკარი', weak: '{s} სუსტად ისმის — უფრო ძლიერად ჩამოკარი ან ცალკე შეამოწმე',
    note: 'ჩამოკვრით გაზომვა მიახლოებითია (±3¢). ზუსტი აწყობისთვის გამოიყენე ტიუნერი თითო სიმზე.',
  },
  en: {
    title: 'All three at once', start: 'Turn on microphone', stop: 'Stop',
    hint: 'Strum all three open strings together and let them ring.',
    wait: 'Strum the open strings', measuring: 'Measuring… let it ring', done: 'Result — strum again to re-check',
    ok: 'in tune', up: 'tighten', down: 'loosen', none: 'not heard',
    allok: 'All three strings are in tune ✓', fix: 'Tune {s}, then strum again', weak: '{s} is faint — strum harder or check it on its own',
    note: 'A strum gives an estimate (±3¢). For exact tuning use the tuner on each string.',
  },
};

const N = 16384;          // ~0.34 s window: averages the beating of the string's two vibration planes
const SETTLE = 0.5;       // s after the strum before readings count
const RING = 2.2;         // s of ring to analyse at most

export function create(ctx) {
  const tr = (k, v) => ctx.tr(L, k, v);
  let mic = null, timer = 0, slow = 0, onsetAt = 0, phase = 'wait', per = [[], [], []], result = null;
  const el = h(`<div class="tool strumtune">
    <p class="tool-hint"></p>
    <div class="st-cols"></div>
    <p class="st-status" aria-live="polite"></p>
    <button type="button" class="btn-primary wide-btn" data-act="mic"></button>
    <p class="fine-note"></p>
  </div>`);
  const name = (i) => { const s = ctx.model.strings[i]; return ctx.lang() === 'ka' ? s.ka : s.latin; };
  const tol = () => Math.max(4, (ctx.S && ctx.S.tol) || 3);
  const median = (a) => { const v = a.slice().sort((p, q) => p - q); return v.length ? v[v.length >> 1] : null; };

  function cols(values, live) {
    el.querySelector('.st-cols').innerHTML = ctx.model.strings.map((s, i) => {
      const c = values ? values[i] : null;
      const has = c != null;
      const cls = !has ? 'na' : Math.abs(c) <= tol() ? 'ok' : Math.abs(c) <= 12 ? 'warn' : 'bad';
      const pos = has ? Math.max(-50, Math.min(50, c)) : 0;
      const word = !has ? (values ? tr('none') : '') : Math.abs(c) <= tol() ? tr('ok') : c < 0 ? '↑ ' + tr('up') : '↓ ' + tr('down');
      return `<div class="st-col ${values ? cls : 'idle'}${live ? ' live' : ''}">
        <strong>${esc(name(i))}</strong>
        <div class="st-gauge"><span class="zone"></span><i style="top:${(50 - pos).toFixed(1)}%"></i></div>
        <b class="st-c">${has ? `${c > 0 ? '+' : c < 0 ? '−' : ''}${Math.abs(c).toFixed(1)}¢` : '—'}</b>
        <span class="st-w">${esc(word)}</span>
      </div>`;
    }).join('');
  }

  function status() {
    const st = el.querySelector('.st-status');
    if (!mic) { st.textContent = ''; return; }
    if (phase === 'wait') { st.textContent = tr('wait'); return; }
    if (phase === 'measuring') { st.textContent = tr('measuring'); return; }
    const missing = result.findIndex((c) => c == null);
    const worst = result.reduce((w, c, i) => (c != null && (w < 0 || Math.abs(c) > Math.abs(result[w])) ? i : w), -1);
    if (missing >= 0) st.textContent = tr('weak', { s: name(missing) });
    else if (worst >= 0 && Math.abs(result[worst]) > tol()) st.textContent = tr('fix', { s: name(worst) });
    else st.textContent = tr('allok');
  }

  function render() {
    el.querySelector('.tool-hint').textContent = tr('hint');
    el.querySelector('[data-act="mic"]').textContent = mic ? '■ ' + tr('stop') : tr('start');
    el.querySelector('.fine-note').textContent = tr('note');
    if (phase === 'done') cols(result, false);
    else if (phase === 'measuring') cols(per.map((a) => (a.length >= 3 ? median(a) : null)), true);
    else cols(null, false);
    status();
  }

  function finish() {
    result = per.map((a) => (a.length >= 3 ? median(a) : null));
    phase = 'done'; ctx.haptic(result.every((c) => c != null && Math.abs(c) <= tol()) ? [14, 60, 14] : 12);
    render();
  }

  function tick() {
    if (!mic || ctx.refBusy()) return;
    const x = mic.read(), now = performance.now();
    let e = 0; for (let i = x.length - 2048; i < x.length; i++) e += x[i] * x[i];
    const rms = Math.sqrt(e / 2048);
    const onset = rms > 0.006 && rms > slow * 1.8;
    slow = slow ? slow * 0.85 + rms * 0.15 : rms;
    if (onset && now - onsetAt > 350) { onsetAt = now; per = [[], [], []]; phase = 'measuring'; render(); return; }
    if (phase !== 'measuring') return;
    const t = (now - onsetAt) / 1000;
    if (t < SETTLE) return;
    if (t > RING || rms < 0.002) { finish(); return; }
    const r = strumCheck(x, mic.sampleRate, ctx.model.strings.map((s) => s.freq), { n: Math.min(N, x.length) });
    r.forEach((q, i) => { if (q.cents != null) per[i].push(q.cents); });
    render();
  }

  async function toggle() {
    if (mic) { stop(); render(); return; }
    mic = await ctx.mic(); if (!mic) return;
    phase = 'wait'; slow = 0; onsetAt = 0; timer = setInterval(tick, 50); render();
  }
  function stop() { clearInterval(timer); timer = 0; if (mic) ctx.releaseMic(); mic = null; if (phase === 'measuring') phase = 'wait'; }

  el.querySelector('[data-act="mic"]').addEventListener('click', toggle);
  return { el, title: () => tr('title'), open() { render(); }, close() { stop(); } };
}
