// Tune to the ensemble: listen to another instrument (garmoni, accordion, piano, keyboard…),
// work out the A4 it is tuned to, and set the tuner's calibration to match.
// Any held note works — its distance from 440 Hz equal temperament gives the A4.
import { h, esc, median } from './ui.js';
import { pcLatin, pcKa } from '../music.js';

const L = {
  ka: {
    title: 'ანსამბლთან აწყობა', start: 'მოსმენა', stop: 'გაჩერება', again: 'თავიდან',
    hint: 'სხვა ინსტრუმენტზე (გარმონი, აკორდეონი, ფორტეპიანო…) დაუკარი ერთი გრძელი ნოტი, საუკეთესოა ლა. ტიუნერი გაიგებს, რა A4-ზეა ის აწყობილი.',
    listening: 'ვუსმენ… დაუკარი და დაიჭირე ნოტი', hold: 'დაიჭირე, ვზომავ…', heard: 'გავიგე: {n}',
    result: 'ანსამბლის A4', vs: '{c}¢ 440 ჰც-თან შედარებით', apply: 'დააყენე A4 = {v} ჰც', applied: 'A4 = {v} ჰც — ახლა ფანდური ანსამბლს მოერგება',
    current: 'ახლა: A4 = {v} ჰც', range: 'ეს ნოტი 430–450 ჰც-ის ფარგლებს სცდება — შეამოწმე ინსტრუმენტი ან დაუკარი სხვა ნოტი.',
    note: 'ინსტრუმენტი შეიძლება 440-ზე ოდნავ მაღლა ან დაბლა იყოს აწყობილი. ამის შემდეგ ფანდურის სიმები ზუსტად მას დაემთხვევა.',
  },
  en: {
    title: 'Tune to the ensemble', start: 'Listen', stop: 'Stop', again: 'Again',
    hint: 'On the other instrument (garmoni, accordion, piano…) play one long note — an A is best. The tuner works out the A4 it is tuned to.',
    listening: 'Listening… play and hold a note', hold: 'Hold it, measuring…', heard: 'Heard: {n}',
    result: 'Ensemble A4', vs: '{c}¢ from 440 Hz', apply: 'Set A4 = {v} Hz', applied: 'A4 = {v} Hz — your panduri will now match the ensemble',
    current: 'Now: A4 = {v} Hz', range: 'This note is outside 430–450 Hz — check the instrument or play another note.',
    note: 'Instruments are often tuned slightly above or below 440. After this your strings match them exactly.',
  },
};

export function create(ctx) {
  const tr = (k, v) => ctx.tr(L, k, v);
  let mic = null, det = null, timer = 0, hist = [], result = null, heard = null, phase = 'idle';
  const el = h(`<div class="tool ensemble">
    <p class="tool-hint"></p>
    <div class="ens-card"><span class="ens-lbl"></span><strong class="ens-val">—</strong><span class="ens-sub"></span></div>
    <p class="ens-status" aria-live="polite"></p>
    <button type="button" class="btn-primary wide-btn" data-act="mic"></button>
    <button type="button" class="btn-ghost bordered wide-btn" data-act="apply" hidden></button>
    <p class="fine-note"></p>
  </div>`);
  const fmt = (v) => (Math.round(v * 10) / 10).toFixed(1).replace(/\.0$/, '');
  const a4From = (c) => 440 * Math.pow(2, c / 1200);

  function render() {
    el.querySelector('.tool-hint').textContent = tr('hint');
    el.querySelector('.fine-note').textContent = tr('note');
    el.querySelector('[data-act="mic"]').textContent = mic ? '■ ' + tr('stop') : result ? tr('again') : tr('start');
    const card = el.querySelector('.ens-card');
    const ap = el.querySelector('[data-act="apply"]');
    if (result != null) {
      const a4 = a4From(result), ok = a4 >= 430 && a4 <= 450;
      card.dataset.state = ok ? 'done' : 'bad';
      el.querySelector('.ens-lbl').textContent = tr('result');
      el.querySelector('.ens-val').textContent = `${fmt(a4)} ${ctx.lang() === 'ka' ? 'ჰც' : 'Hz'}`;
      el.querySelector('.ens-sub').textContent = tr('vs', { c: (result > 0 ? '+' : result < 0 ? '−' : '±') + Math.abs(result).toFixed(1) });
      ap.hidden = !ok; ap.textContent = tr('apply', { v: fmt(a4) });
      // the result's main action is applying it; listening again becomes secondary
      ap.className = ok ? 'btn-primary wide-btn' : 'btn-ghost bordered wide-btn';
      el.querySelector('[data-act="mic"]').className = ok ? 'btn-ghost bordered wide-btn' : 'btn-primary wide-btn';
      el.querySelector('.ens-status').textContent = ok ? (heard ? tr('heard', { n: heard }) : '') : tr('range');
    } else {
      card.dataset.state = mic ? 'listen' : 'idle';
      el.querySelector('.ens-lbl').textContent = tr('current', { v: fmt(ctx.S.a4) });
      const live = hist.length >= 4 ? median(hist) : null;
      el.querySelector('.ens-val').textContent = live == null ? '—' : `${fmt(a4From(live))} ${ctx.lang() === 'ka' ? 'ჰც' : 'Hz'}`;
      el.querySelector('.ens-sub').textContent = heard || '';
      ap.hidden = true;
      el.querySelector('[data-act="mic"]').className = 'btn-primary wide-btn';
      el.querySelector('.ens-status').textContent = mic ? tr(hist.length >= 4 ? 'hold' : 'listening') : '';
    }
  }

  function tick() {
    if (!mic || ctx.refBusy()) return;
    const r = det.analyze(mic.read());
    if (!(r.freq > 60 && r.clarity > 0.9 && r.rms > 0.004)) { if (hist.length < 20) hist = []; return; }
    const m = 69 + 12 * Math.log2(r.freq / 440), n = Math.round(m), c = (m - n) * 100;
    heard = (ctx.lang() === 'ka' ? pcKa(n) : pcLatin(n)) + (Math.floor(n / 12) - 1);
    hist.push(c); if (hist.length > 40) hist.shift();
    // done when ~1.2 s of the note agrees within a couple of cents
    if (hist.length >= 30) {
      const med = median(hist), spread = median(hist.map((x) => Math.abs(x - med)));
      if (spread < 1.5) { result = med; stop(); ctx.haptic([14, 60, 14]); }
    }
    render();
  }

  async function toggle() {
    if (mic) { stop(); render(); return; }
    result = null; hist = []; heard = null;
    mic = await ctx.mic(); if (!mic) return;
    det = ctx.detector(mic.sampleRate);
    timer = setInterval(tick, 40); render();
  }
  function stop() { clearInterval(timer); timer = 0; if (mic) ctx.releaseMic(); mic = null; }

  el.addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.act === 'mic') toggle();
    if (b.dataset.act === 'apply' && result != null) { const v = a4From(result); ctx.setA4(v); ctx.toast(tr('applied', { v: fmt(ctx.S.a4) })); render(); }
  });
  return { el, title: () => tr('title'), open() { render(); }, close() { stop(); } };
}
