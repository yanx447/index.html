// Intonation check: the 12th fret must sound exactly one octave above the open string.
// If it is sharp, the vibrating length is a little short (bridge too far forward, or the string
// sits high / is old); if flat, the length is a little long. The open string doesn't need to be
// in tune — only the difference between the two readings matters.
import { h, esc, median } from './ui.js';

const L = {
  ka: {
    title: 'ინტონაციის შემოწმება', string: 'სიმი {n}',
    hint: 'ამოწმებს, სწორადაა თუ არა ხარაკი მოწყობილი: მე-12 ლადი ღია სიმზე ზუსტად ოქტავით მაღლა უნდა ჟღერდეს.',
    s_open: 'ჩამოკარი ღია სიმი', s_fret: 'ახლა დააჭირე მე-12 ლადზე და ჩამოკარი', s_done: 'შედეგი',
    open: 'ღია', fret: 'მე-12 ლადი', start: 'დაწყება', stop: 'გაჩერება', again: 'თავიდან', measuring: 'ვზომავ… დაელოდე',
    ok: 'ინტონაცია კარგია ✓', okText: 'სხვაობა მხოლოდ {d}¢-ია. ხარაკი ამ სიმისთვის სწორ ადგილასაა.',
    sharp: 'მე-12 ლადი მაღლა ჟღერს: {d}¢', sharpText: 'სიმის ჟღერადი ნაწილი ცოტა მოკლეა. ხარაკი ოდნავ უკან, ფანდურის ბოლოსკენ გადაწიე (1–2 მმ). თუ სიმი ტარიდან მაღლაა ან ძველია, ესეც მაღლა აჟღერებს.',
    flat: 'მე-12 ლადი დაბლა ჟღერს: {d}¢', flatText: 'სიმის ჟღერადი ნაწილი ცოტა გრძელია. ხარაკი ოდნავ წინ, ტარისკენ გადაწიე (1–2 მმ).',
    after: 'ხარაკის გადაწევის შემდეგ სიმი თავიდან ააწყე და შემოწმება გაიმეორე.',
    summary: 'ყველა სიმი', none: '—',
  },
  en: {
    title: 'Intonation check', string: 'String {n}',
    hint: 'Checks whether the bridge is placed right: the 12th fret must sound exactly one octave above the open string.',
    s_open: 'Pluck the open string', s_fret: 'Now press the 12th fret and pluck', s_done: 'Result',
    open: 'Open', fret: '12th fret', start: 'Start', stop: 'Stop', again: 'Again', measuring: 'Measuring… let it ring',
    ok: 'Intonation is good ✓', okText: 'Only {d}¢ apart. The bridge is in the right place for this string.',
    sharp: '12th fret is sharp: {d}¢', sharpText: 'The vibrating length is a little short. Move the bridge slightly back, toward the tail of the panduri (1–2 mm). A high or old string also sounds sharp.',
    flat: '12th fret is flat: {d}¢', flatText: 'The vibrating length is a little long. Move the bridge slightly forward, toward the neck (1–2 mm).',
    after: 'After moving the bridge, retune the string and check again.',
    summary: 'All strings', none: '—',
  },
};
const TOL = 3;

export function create(ctx) {
  const tr = (k, v) => ctx.tr(L, k, v);
  let sIdx = 0, step = 'open', mic = null, det = null, timer = 0, hist = [], c0 = null, c12 = null, slow = 0, peak = 0, skip = 0;
  const results = [null, null, null];
  const el = h(`<div class="tool intonation">
    <p class="tool-hint"></p>
    <div class="chips strs" role="radiogroup"></div>
    <div class="int-pair">
      <div class="int-cell" data-k="open"><span></span><b>—</b></div>
      <div class="int-arrow" aria-hidden="true">→</div>
      <div class="int-cell" data-k="fret"><span></span><b>—</b></div>
    </div>
    <div class="ns-card int-card"><strong class="int-state"></strong><p class="int-text"></p></div>
    <button type="button" class="btn-primary wide-btn" data-act="mic"></button>
    <h3 class="sub-h int-sum-h"></h3>
    <ul class="str-check int-sum"></ul>
  </div>`);
  const fmt = (c) => (c == null ? '—' : `${c > 0 ? '+' : c < 0 ? '−' : '±'}${Math.abs(c).toFixed(1)}¢`);
  const target = () => ctx.model.strings[sIdx].freq * (step === 'fret' ? 2 : 1);

  function verdict(d) {
    if (Math.abs(d) <= TOL) return { cls: 'ok', head: tr('ok'), text: tr('okText', { d: Math.abs(d).toFixed(1) }) };
    if (d > 0) return { cls: Math.abs(d) <= 10 ? 'warn' : 'bad', head: tr('sharp', { d: '+' + d.toFixed(1) }), text: tr('sharpText') + ' ' + tr('after') };
    return { cls: Math.abs(d) <= 10 ? 'warn' : 'bad', head: tr('flat', { d: '−' + Math.abs(d).toFixed(1) }), text: tr('flatText') + ' ' + tr('after') };
  }

  function render() {
    const lang = ctx.lang();
    el.querySelector('.tool-hint').textContent = tr('hint');
    el.querySelector('.strs').innerHTML = ctx.model.strings.map((s, i) => `<button type="button" role="radio" aria-checked="${i === sIdx}" data-s="${i}">${esc(tr('string', { n: s.number }))} · ${esc(lang === 'ka' ? s.ka : s.latin)}</button>`).join('');
    el.querySelector('[data-k="open"] span').textContent = tr('open');
    el.querySelector('[data-k="fret"] span').textContent = tr('fret');
    el.querySelector('[data-k="open"] b').textContent = fmt(c0);
    el.querySelector('[data-k="fret"] b').textContent = fmt(c12);
    el.querySelectorAll('.int-cell').forEach((c) => c.classList.toggle('cur', !!mic && c.dataset.k === step));
    const card = el.querySelector('.int-card');
    if (step === 'done') {
      const v = verdict(c12 - c0);
      card.dataset.state = v.cls;
      el.querySelector('.int-state').textContent = v.head;
      el.querySelector('.int-text').textContent = v.text;
    } else {
      card.dataset.state = 'tune';
      el.querySelector('.int-state').textContent = tr(step === 'open' ? 's_open' : 's_fret');
      el.querySelector('.int-text').textContent = mic && hist.length >= 3 ? tr('measuring') : '';
    }
    el.querySelector('[data-act="mic"]').textContent = mic ? '■ ' + tr('stop') : step === 'done' ? tr('again') : tr('start');
    el.querySelector('.int-sum-h').textContent = tr('summary');
    el.querySelector('.int-sum').innerHTML = ctx.model.strings.map((s, i) => {
      const d = results[i]; const v = d == null ? null : verdict(d);
      return `<li class="${v ? v.cls : 'na'}"><span>${esc(lang === 'ka' ? s.ka : s.latin)}</span><b>${d == null ? tr('none') : fmt(d)}</b></li>`;
    }).join('');
  }

  function tick() {
    if (!mic || ctx.refBusy()) return;
    const tf = target();
    const r = det.analyze(mic.read(), (f) => { const d = 12 * Math.log2(f / tf); return Math.max(0.03, Math.exp(-0.5 * (d / 2) ** 2)); });
    // a new pluck: the level jumps; panduri strings fade fast, so the threshold follows each pluck
    if (r.rms > 0.004 && r.rms > slow * 1.8) { peak = r.rms; skip = 2; hist = []; }
    slow = slow * 0.8 + r.rms * 0.2; peak = Math.max(peak, r.rms);
    const signal = r.freq > 0 && r.clarity > 0.85 && r.rms > Math.max(0.0008, peak * 0.03);
    if (!signal) return;
    if (skip > 0) { skip--; return; }    // the attack is sharp; wait for the string to settle
    const c = 1200 * Math.log2(r.freq / tf);
    if (Math.abs(c) > 60) return;         // not this note (yet)
    hist.push(c); if (hist.length > 12) hist.shift();
    if (hist.length >= 8) {
      const med = median(hist), spread = median(hist.map((x) => Math.abs(x - med)));
      if (spread < 1.5) {
        if (step === 'open') { c0 = med; step = 'fret'; hist = []; peak = 0; ctx.haptic(12); }
        else { c12 = med; step = 'done'; results[sIdx] = c12 - c0; stop(); ctx.haptic([14, 60, 14]); }
      }
    }
    render();
  }

  async function toggle() {
    if (mic) { stop(); render(); return; }
    if (step === 'done') { step = 'open'; c0 = c12 = null; }
    hist = []; slow = 0; peak = 0; skip = 0;
    mic = await ctx.mic(); if (!mic) return;
    det = ctx.detector(mic.sampleRate);
    timer = setInterval(tick, 40); render();
  }
  function stop() { clearInterval(timer); timer = 0; if (mic) ctx.releaseMic(); mic = null; }

  el.addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.s != null) { stop(); sIdx = +b.dataset.s; step = 'open'; c0 = c12 = null; hist = []; render(); }
    else if (b.dataset.act === 'mic') toggle();
  });
  return { el, title: () => tr('title'), open() { render(); }, close() { stop(); } };
}
