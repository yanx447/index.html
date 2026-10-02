// Ear training: name the note, major/minor, or sing the note (checked by the pitch detector).
import { fingering, pc, pcLatin, pcKa } from '../music.js';
import { h, esc, median } from './ui.js';

const L = {
  ka: { title: 'ყურის ვარჯიში', note: 'ნოტი', chord: 'აკორდი', sing: 'იმღერე', replay: 'გაიმეორე', next: 'შემდეგი', score: 'ქულა', streak: 'სერია',
    lvStrings: 'სიმები', lvScale: 'გამა', lvChrom: 'ყველა', maj: 'მაჟორი', min: 'მინორი', dom7: 'სეპტაკორდი',
    qNote: 'რომელი ნოტი ჟღერს?', qChord: 'მაჟორია თუ მინორი?', qSing: 'იმღერე ეს ნოტი', right: 'სწორია!', wrong: 'არა — ეს იყო {a}', listen: 'მოუსმინე და იმღერე…', micOn: 'ჩართე მიკროფონი', hold: 'დაიჭირე ნოტი…', sung: 'ზუსტია!', octaveOk: 'ნებისმიერ ოქტავაში' },
  en: { title: 'Ear training', note: 'Note', chord: 'Chord', sing: 'Sing', replay: 'Replay', next: 'Next', score: 'Score', streak: 'Streak',
    lvStrings: 'Strings', lvScale: 'Scale', lvChrom: 'All', maj: 'Major', min: 'Minor', dom7: 'Dominant 7',
    qNote: 'Which note is it?', qChord: 'Major or minor?', qSing: 'Sing this note', right: 'Correct!', wrong: 'No — it was {a}', listen: 'Listen, then sing…', micOn: 'Turn on microphone', hold: 'Hold the note…', sung: 'Spot on!', octaveOk: 'any octave' },
};
const SCALE = [0, 2, 4, 5, 7, 9, 11];

export function create(ctx) {
  const tr = (k, v) => ctx.tr(L, k, v);
  let mode = 'note', level = 'scale', q = null, score = 0, total = 0, streak = 0, answered = false;
  let mic = null, det = null, timer = 0, okSince = 0, hist = [];
  const el = h(`<div class="tool ear">
    <div class="chips modes3"></div>
    <div class="chips levels"></div>
    <div class="ear-card"><p class="ear-q"></p><strong class="ear-target"></strong><p class="ear-fb" aria-live="polite"></p><div class="ear-meter" hidden><i></i></div></div>
    <div class="ear-answers"></div>
    <div class="row-btns"><button type="button" class="btn-ghost bordered" data-act="replay"></button><button type="button" class="btn-primary" data-act="next"></button></div>
    <p class="ear-score"></p>
  </div>`);
  const base = () => ctx.model.strings[0].midi;
  const nm = (m) => (ctx.lang() === 'ka' ? pcKa(m) : pcLatin(m));
  const rnd = (a) => a[Math.floor(Math.random() * a.length)];

  function pool() {
    const b = base();
    if (level === 'strings') return ctx.model.strings.map((s) => s.midi);
    if (level === 'scale') return SCALE.map((d) => b + d).concat(b + 12);
    return Array.from({ length: 13 }, (_, i) => b + i);
  }
  function newQuestion() {
    answered = false; okSince = 0; hist = [];
    if (mode === 'chord') {
      const root = pc(base() + rnd(level === 'chrom' ? [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] : SCALE));
      const kinds = level === 'chrom' ? ['maj', 'min', '7'] : ['maj', 'min'];
      q = { kind: 'chord', root, qid: rnd(kinds) };
    } else q = { kind: mode, midi: rnd(pool()) };
    play(); render();
  }
  function play() {
    if (!q) return;
    if (q.kind === 'chord') ctx.playNotes(fingering(q.root, q.qid, ctx.model.strings.map((s) => s.midi)).notes, true);
    else ctx.playNotes([q.midi], false);
  }
  function answer(v) {
    if (answered || !q) return;
    answered = true; total++;
    const correct = q.kind === 'chord' ? v === q.qid : pc(+v) === pc(q.midi);
    if (correct) { score++; streak++; ctx.haptic(15); } else streak = 0;
    const right = q.kind === 'chord' ? tr(q.qid === 'maj' ? 'maj' : q.qid === 'min' ? 'min' : 'dom7') : nm(q.midi);
    const fb = el.querySelector('.ear-fb');
    fb.textContent = correct ? tr('right') : tr('wrong', { a: right });
    fb.className = 'ear-fb ' + (correct ? 'ok' : 'bad');
    el.querySelectorAll('.ear-answers button').forEach((b) => {
      const isRight = q.kind === 'chord' ? b.dataset.v === q.qid : pc(+b.dataset.v) === pc(q.midi);
      b.classList.toggle('right', isRight); b.classList.toggle('wrong', b.dataset.v === String(v) && !correct);
    });
    renderScore();
    if (correct) setTimeout(() => { if (answered) newQuestion(); }, 1100);
  }
  function renderScore() { el.querySelector('.ear-score').textContent = `${tr('score')}: ${score} / ${total} · ${tr('streak')}: ${streak}`; }

  function render() {
    el.querySelector('.modes3').innerHTML = ['note', 'chord', 'sing'].map((m) => `<button type="button" role="radio" aria-checked="${m === mode}" data-mode="${m}">${tr(m)}</button>`).join('');
    el.querySelector('.levels').innerHTML = [['strings', 'lvStrings'], ['scale', 'lvScale'], ['chrom', 'lvChrom']].map(([v, k]) => `<button type="button" role="radio" aria-checked="${v === level}" data-lv="${v}">${tr(k)}</button>`).join('');
    el.querySelector('.ear-q').textContent = tr(mode === 'note' ? 'qNote' : mode === 'chord' ? 'qChord' : 'qSing');
    el.querySelector('.ear-target').textContent = mode === 'sing' && q ? `${nm(q.midi)}` : '';
    el.querySelector('.ear-meter').hidden = mode !== 'sing';
    const fb = el.querySelector('.ear-fb'); fb.textContent = mode === 'sing' ? (mic ? tr('listen') : '') : ''; fb.className = 'ear-fb';
    const ans = el.querySelector('.ear-answers');
    if (mode === 'chord') {
      const kinds = level === 'chrom' ? [['maj', 'maj'], ['min', 'min'], ['7', 'dom7']] : [['maj', 'maj'], ['min', 'min']];
      ans.className = 'ear-answers two'; ans.innerHTML = kinds.map(([v, k]) => `<button type="button" data-v="${v}">${tr(k)}</button>`).join('');
    } else if (mode === 'note') {
      const notes = level === 'chrom' ? Array.from({ length: 12 }, (_, i) => base() + i) : level === 'scale' ? SCALE.map((d) => base() + d) : ctx.model.strings.map((s) => s.midi);
      ans.className = 'ear-answers'; ans.innerHTML = notes.map((m) => `<button type="button" data-v="${m}">${esc(nm(m))}</button>`).join('');
    } else {
      ans.className = 'ear-answers one'; ans.innerHTML = `<button type="button" data-act="mic" class="btn-primary">${mic ? '■' : tr('micOn')}</button><small>${tr('octaveOk')}</small>`;
    }
    el.querySelector('[data-act="replay"]').textContent = '▶ ' + tr('replay');
    el.querySelector('[data-act="next"]').textContent = tr('next') + ' →';
    renderScore();
  }

  async function micToggle() {
    if (mic) { stopMic(); render(); return; }
    mic = await ctx.mic(); if (!mic) return;
    det = ctx.detector(mic.sampleRate);
    timer = setInterval(singTick, 40); render();
  }
  function stopMic() { clearInterval(timer); timer = 0; if (mic) ctx.releaseMic(); mic = null; }
  function singTick() {
    if (!mic || !q || mode !== 'sing' || ctx.refBusy()) return;
    const r = det.analyze(mic.read());
    const bar = el.querySelector('.ear-meter i');
    if (!(r.freq > 0 && r.clarity > 0.85 && r.rms > 0.004)) { hist = []; okSince = 0; return; }
    const semis = 12 * Math.log2(r.freq / (ctx.S.a4 * Math.pow(2, (q.midi - 69) / 12)));
    const cents = (semis - 12 * Math.round(semis / 12)) * 100;
    hist.push(cents); if (hist.length > 5) hist.shift();
    const c = median(hist);
    bar.style.transform = `translateX(${Math.max(-50, Math.min(50, c))}%)`;
    bar.className = Math.abs(c) <= 15 ? 'ok' : '';
    const fb = el.querySelector('.ear-fb');
    if (Math.abs(c) <= 15) {
      if (!okSince) okSince = performance.now();
      fb.textContent = tr('hold');
      if (performance.now() - okSince > 700 && !answered) { answered = true; score++; total++; streak++; fb.textContent = tr('sung'); fb.className = 'ear-fb ok'; ctx.haptic(15); renderScore(); setTimeout(newQuestion, 1200); }
    } else { okSince = 0; fb.textContent = `${c > 0 ? '+' : '−'}${Math.round(Math.abs(c))}¢`; fb.className = 'ear-fb'; }
  }

  el.addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.mode) { mode = b.dataset.mode; if (mode !== 'sing') stopMic(); newQuestion(); }
    else if (b.dataset.lv) { level = b.dataset.lv; newQuestion(); }
    else if (b.dataset.act === 'replay') play();
    else if (b.dataset.act === 'next') newQuestion();
    else if (b.dataset.act === 'mic') micToggle();
    else if (b.dataset.v != null) answer(b.dataset.v);
  });

  return { el, title: () => tr('title'), open() { if (!q) newQuestion(); else render(); }, close() { stopMic(); } };
}
