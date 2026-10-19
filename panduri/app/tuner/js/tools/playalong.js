// Play-along: a sequence of notes; the tuner listens and moves on when you play each one.
import { position, pcLatin, pcKa, parseChord, pc } from '../music.js';
import { h, esc, median } from './ui.js';

const L = {
  ka: { title: 'მიყევი ნოტებს', scale: 'მაჟორული გამა', minor: 'მინორული გამა', arp: 'არპეჯიო', strings: 'ღია სიმები', custom: 'ჩემი', start: 'დაწყება', stop: 'გაჩერება', listen: 'მოსმენა', where: 'სიმი {s} · {f}', open: 'ღია', fret: '{f} ლადი',
    done: 'ყოჩაღ! {n} ნოტი {t} წამში', again: 'თავიდან', customPh: 'მაგ.: A B C# D E', save: 'შენახვა', play: 'დაუკარი' },
  en: { title: 'Play along', scale: 'Major scale', minor: 'Minor scale', arp: 'Arpeggio', strings: 'Open strings', custom: 'Mine', start: 'Start', stop: 'Stop', listen: 'Listen', where: 'String {s} · {f}', open: 'open', fret: 'fret {f}',
    done: 'Well done! {n} notes in {t} s', again: 'Again', customPh: 'e.g. A B C# D E', save: 'Save', play: 'Play' },
};
const KEY = 'sami-simi:custom-seq';

export function create(ctx) {
  const tr = (k, v) => ctx.tr(L, k, v);
  let ex = 'scale', seq = [], idx = 0, mic = null, det = null, timer = 0, okSince = 0, hist = [], t0 = 0;
  let custom = 'A B C# D E F# G# A';
  try { custom = localStorage.getItem(KEY) || custom; } catch (e) { /* ignore */ }
  const el = h(`<div class="tool play">
    <div class="chips exs"></div>
    <div class="custom-row" hidden><input type="text" class="txt" autocapitalize="characters" spellcheck="false"><button type="button" class="btn-ghost bordered sm" data-act="save"></button></div>
    <div class="seq"></div>
    <div class="play-card"><span class="pc-label"></span><strong class="pc-note"></strong><span class="pc-where"></span><div class="ear-meter"><i></i></div></div>
    <div class="row-btns"><button type="button" class="btn-ghost bordered" data-act="listen"></button><button type="button" class="btn-primary" data-act="mic"></button></div>
  </div>`);
  const nm = (m) => (ctx.lang() === 'ka' ? pcKa(m) : pcLatin(m));
  const tuning = () => ctx.model.strings.map((s) => s.midi);

  function build() {
    const b = tuning()[0];
    const up = (iv) => iv.map((d) => b + d);
    if (ex === 'scale') { const s = up([0, 2, 4, 5, 7, 9, 11, 12]); seq = s.concat(s.slice(0, -1).reverse()); }
    else if (ex === 'minor') { const s = up([0, 2, 3, 5, 7, 8, 10, 12]); seq = s.concat(s.slice(0, -1).reverse()); }
    else if (ex === 'arp') seq = up([0, 4, 7, 12, 7, 4, 0]);
    else if (ex === 'strings') seq = tuning().concat(tuning().slice().reverse());
    else {
      // parse "A B C# D E" — each note placed in the panduri range, rising where possible
      seq = []; let last = b - 1;
      for (const tok of custom.split(/[\s,]+/).filter(Boolean)) {
        const p = parseChord(tok.replace(/\d+$/, '')); if (!p) continue;
        let m = b + pc(p.root - b); if (m < last - 6) m += 12; if (m > b + 14) m -= 12;
        seq.push(m); last = m;
      }
    }
    idx = 0; okSince = 0; hist = [];
  }

  function render() {
    el.querySelector('.exs').innerHTML = ['scale', 'minor', 'arp', 'strings', 'custom'].map((x) => `<button type="button" role="radio" aria-checked="${x === ex}" data-ex="${x}">${tr(x)}</button>`).join('');
    const cr = el.querySelector('.custom-row'); cr.hidden = ex !== 'custom';
    cr.querySelector('input').placeholder = tr('customPh'); cr.querySelector('input').value = custom; cr.querySelector('button').textContent = tr('save');
    el.querySelector('.seq').innerHTML = seq.map((m, i) => `<span class="${i < idx ? 'done' : i === idx ? 'cur' : ''}">${esc(nm(m))}</span>`).join('');
    const card = el.querySelector('.play-card');
    if (idx >= seq.length) {
      card.querySelector('.pc-label').textContent = '';
      card.querySelector('.pc-note').textContent = '✓';
      card.querySelector('.pc-where').textContent = tr('done', { n: seq.length, t: ((performance.now() - t0) / 1000).toFixed(1) });
    } else if (seq.length) {
      const m = seq[idx], p = position(m, tuning());
      card.querySelector('.pc-label').textContent = tr('play');
      card.querySelector('.pc-note').textContent = nm(m) + (Math.floor(m / 12) - 1);
      card.querySelector('.pc-where').textContent = p ? tr('where', { s: p.string + 1, f: p.fret ? tr('fret', { f: p.fret }) : tr('open') }) : '';
    }
    el.querySelector('[data-act="listen"]').textContent = '▶ ' + tr('listen');
    el.querySelector('[data-act="mic"]').textContent = idx >= seq.length ? tr('again') : mic ? '■ ' + tr('stop') : tr('start');
  }

  function tick() {
    if (!mic || idx >= seq.length || ctx.refBusy()) return;
    const r = det.analyze(mic.read());
    const bar = el.querySelector('.ear-meter i');
    if (!(r.freq > 0 && r.clarity > 0.85 && r.rms > 0.004)) { hist = []; okSince = 0; return; }
    const target = seq[idx];
    const semis = 12 * Math.log2(r.freq / (ctx.S.a4 * Math.pow(2, (target - 69) / 12)));
    const oct = Math.round(semis / 12), c = (semis - 12 * oct) * 100;
    hist.push(c); if (hist.length > 4) hist.shift();
    const cm = median(hist);
    bar.style.transform = `translateX(${Math.max(-50, Math.min(50, cm))}%)`;
    if (Math.abs(cm) <= 35) {
      if (!okSince) okSince = performance.now();
      if (performance.now() - okSince > 140) {
        idx++; okSince = 0; hist = []; ctx.haptic(10);
        if (idx >= seq.length) { stopMic(); ctx.haptic([14, 60, 14]); }
        render();
      }
    } else okSince = 0;
  }
  async function toggleMic() {
    if (idx >= seq.length) { build(); render(); }
    if (mic) { stopMic(); render(); return; }
    mic = await ctx.mic(); if (!mic) return;
    det = ctx.detector(mic.sampleRate); t0 = performance.now();
    timer = setInterval(tick, 40); render();
  }
  function stopMic() { clearInterval(timer); timer = 0; if (mic) ctx.releaseMic(); mic = null; }
  function listen() { seq.slice(idx).forEach((m, i) => ctx.playNotes([m], false, i * 0.5)); }

  el.addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.ex) { ex = b.dataset.ex; build(); render(); }
    else if (b.dataset.act === 'mic') toggleMic();
    else if (b.dataset.act === 'listen') listen();
    else if (b.dataset.act === 'save') { custom = el.querySelector('.custom-row input').value; try { localStorage.setItem(KEY, custom); } catch (er) { /* ignore */ } build(); render(); }
  });

  return { el, title: () => tr('title'), open() { if (!seq.length) build(); render(); }, close() { stopMic(); } };
}
