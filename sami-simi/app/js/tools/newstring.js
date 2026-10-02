// New-string helper: fresh strings stretch and go flat. Tracks re-tunes until the string holds.
import { h, esc, median } from './ui.js';

const L = {
  ka: { title: 'ახალი სიმი', pick: 'რომელი სიმი გამოცვალე?', string: 'სიმი {n}', start: 'დაწყება', stop: 'გაჩერება',
    s_tune: 'ააწყე სიმი', s_watch: 'აწყობილია — დროდადრო ჩამოკარი, ვაკვირდები', s_drop: 'ჩამოვიდა {c}¢ — ისევ მოუჭირე', s_stable: 'სიმი სტაბილურია ✓',
    tunes: 'აწყობა', drops: 'ჩამოსვლა', checks: 'შემოწმება', log_t: '{m} — აეწყო', log_d: '{m} — ჩამოვიდა {c}¢',
    tip: 'რჩევა: ახალი სიმი ნაზად გაჭიმე თითით ტარიდან მოშორებით და ისევ ააწყე. ნეილონის სიმს პირველ დღეებში რამდენჯერმე აწყობა სჭირდება.', min: 'წთ', now: 'ახლა' },
  en: { title: 'New string', pick: 'Which string did you change?', string: 'String {n}', start: 'Start', stop: 'Stop',
    s_tune: 'Tune the string', s_watch: 'In tune — pluck now and then, I’m watching', s_drop: 'Dropped {c}¢ — tighten again', s_stable: 'The string is stable ✓',
    tunes: 'tunings', drops: 'drops', checks: 'checks', log_t: '{m} — tuned', log_d: '{m} — dropped {c}¢',
    tip: 'Tip: gently stretch a new string away from the fingerboard, then retune. Nylon strings need several retunes in the first days.', min: 'min', now: 'now' },
};

export function create(ctx) {
  const tr = (k, v) => ctx.tr(L, k, v);
  let sIdx = 0, mic = null, det = null, timer = 0, state = 'tune', hist = [], okSince = 0, badSince = 0;
  let tunes = 0, drops = 0, checks = 0, t0 = 0, lastCheck = 0, wasSignal = false, log = [], lastDrop = 0;
  const el = h(`<div class="tool newstr">
    <p class="tool-hint pick-h"></p>
    <div class="chips strs"></div>
    <div class="ns-card"><strong class="ns-state"></strong><span class="ns-cents"></span><div class="ear-meter"><i></i></div></div>
    <div class="ns-stats"></div>
    <button type="button" class="btn-primary wide-btn" data-act="mic"></button>
    <ul class="ns-log"></ul>
    <p class="fine-note"></p>
  </div>`);
  const minutes = () => { const m = Math.round((performance.now() - t0) / 60000); return m ? `${m} ${tr('min')}` : tr('now'); };

  function render() {
    el.querySelector('.pick-h').textContent = tr('pick');
    el.querySelector('.strs').innerHTML = ctx.model.strings.map((s, i) => `<button type="button" role="radio" aria-checked="${i === sIdx}" data-s="${i}">${esc(tr('string', { n: s.number }))} · ${esc(ctx.lang() === 'ka' ? s.ka : s.latin)}</button>`).join('');
    el.querySelector('.ns-state').textContent = state === 'drop' ? tr('s_drop', { c: Math.round(Math.abs(lastDrop)) }) : tr('s_' + state);
    el.querySelector('.ns-card').dataset.state = state;
    el.querySelector('.ns-stats').innerHTML = `<span><b>${tunes}</b>${tr('tunes')}</span><span><b>${drops}</b>${tr('drops')}</span><span><b>${checks}</b>${tr('checks')}</span>`;
    el.querySelector('[data-act="mic"]').textContent = mic ? '■ ' + tr('stop') : tr('start');
    el.querySelector('.ns-log').innerHTML = log.slice(-6).reverse().map((x) => `<li>${esc(x.d ? tr('log_d', { m: x.m, c: Math.round(x.c) }) : tr('log_t', { m: x.m }))}</li>`).join('');
    el.querySelector('.fine-note').textContent = tr('tip');
  }

  function tick() {
    if (!mic || ctx.refBusy()) return;
    const r = det.analyze(mic.read(), (f) => { const d = 12 * Math.log2(f / ctx.model.strings[sIdx].freq); return Math.exp(-0.5 * (d / 2.5) ** 2); });
    const signal = r.freq > 0 && r.clarity > 0.85 && r.rms > 0.004;
    const now = performance.now();
    if (!signal) { hist = []; okSince = 0; badSince = 0; wasSignal = false; return; }
    const onset = !wasSignal; wasSignal = true;
    const semis = 12 * Math.log2(r.freq / ctx.model.strings[sIdx].freq);
    const c = (semis - 12 * Math.round(semis / 12)) * 100;
    hist.push(c); if (hist.length > 7) hist.shift();
    if (hist.length < 4) return;
    const cm = median(hist);
    el.querySelector('.ns-cents').textContent = `${cm > 0 ? '+' : cm < 0 ? '−' : ''}${Math.abs(cm).toFixed(1)}¢`;
    el.querySelector('.ear-meter i').style.transform = `translateX(${Math.max(-50, Math.min(50, cm))}%)`;
    if (state === 'tune' || state === 'drop') {
      if (Math.abs(cm) <= 3) {
        if (!okSince) okSince = now;
        if (now - okSince > 900) { tunes++; state = 'watch'; lastCheck = now; okSince = 0; log.push({ m: minutes(), d: false }); ctx.haptic(15); render(); }
      } else okSince = 0;
    } else if (state === 'watch' || state === 'stable') {
      if (cm < -6) {
        if (!badSince) badSince = now;
        if (now - badSince > 700) { drops++; state = 'drop'; lastDrop = cm; log.push({ m: minutes(), d: true, c: cm }); checks = 0; badSince = 0; render(); }
      } else {
        badSince = 0;
        if (onset && now - lastCheck > 15000 && Math.abs(cm) <= 4) { checks++; lastCheck = now; if (checks >= 3) state = 'stable'; render(); }
      }
    }
  }
  async function toggle() {
    if (mic) { stop(); render(); return; }
    mic = await ctx.mic(); if (!mic) return;
    det = ctx.detector(mic.sampleRate); if (!t0) t0 = performance.now();
    timer = setInterval(tick, 40); render();
  }
  function stop() { clearInterval(timer); timer = 0; if (mic) ctx.releaseMic(); mic = null; }

  el.addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.s != null) { sIdx = +b.dataset.s; state = 'tune'; tunes = drops = checks = 0; log = []; t0 = performance.now(); render(); }
    else if (b.dataset.act === 'mic') toggle();
  });
  return { el, title: () => tr('title'), open() { render(); }, close() { stop(); } };
}
