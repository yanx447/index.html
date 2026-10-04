// Chord library for the current panduri tuning: every chord in every position on the 17-fret neck,
// with diagram, sound (in the octave you'd actually play it) and 3D finger positions.
import { QUALITIES, fingering, voicings, chordName, pc, pcLatin, pcKa } from '../music.js';
import { h, chordDiagram, esc } from './ui.js';

const L = {
  ka: {
    title: 'აკორდები', play: 'მოსმენა', view3d: '3D ტარზე', notes: 'ნოტები', key: 'ტონალობის აკორდები ({k})', frets: 'ლადები', open: 'ღია', string: 'სიმი',
    positions: 'ყველა პოზიცია ტარზე ({n})', pos: 'პოზიცია {i} / {n}', fret: '{f} ლადი', all: 'ყველა აკორდი', major: 'მაჟორები', minor: 'მინორები', other: 'სხვა',
    inv: ['ძირითადი', 'I შებრუნება', 'II შებრუნება', 'III შებრუნება'], prev: 'წინა პოზიცია', next: 'შემდეგი პოზიცია', allNote: 'ყოველ აკორდს რამდენიმე პოზიცია აქვს — აირჩიე და ნახე ყველა.',
  },
  en: {
    title: 'Chords', play: 'Listen', view3d: 'Show on 3D neck', notes: 'Notes', key: 'Chords in the key of {k}', frets: 'Frets', open: 'open', string: 'String',
    positions: 'All positions on the neck ({n})', pos: 'Position {i} of {n}', fret: 'fret {f}', all: 'All chords', major: 'Major', minor: 'Minor', other: 'Other',
    inv: ['root position', '1st inversion', '2nd inversion', '3rd inversion'], prev: 'Previous position', next: 'Next position', allNote: 'Every chord has several positions — pick one to see them all.',
  },
};
const QLABEL = { ka: { maj: 'მაჟ', min: 'მინ', 7: '7', m7: 'm7', sus4: 'sus4', dim: 'dim' }, en: { maj: 'Major', min: 'Minor', 7: '7', m7: 'm7', sus4: 'sus4', dim: 'dim' } };

export function create(ctx) {
  const tr = (k, v) => ctx.tr(L, k, v);
  const trInv = (i) => L[ctx.lang() === 'ka' ? 'ka' : 'en'].inv[i] || '';
  let root = null, q = 'maj', vIdx = 0, list = [], allTab = 'maj';
  const el = h(`<div class="tool chords">
    <div class="chips roots" role="radiogroup"></div>
    <div class="chips quals" role="radiogroup"></div>
    <div class="chord-card">
      <div class="chord-head"><strong class="chord-name"></strong><span class="chord-long"></span></div>
      <div class="chord-pos">
        <button type="button" class="round sm" data-act="prev">‹</button>
        <span class="pos-txt"></span>
        <button type="button" class="round sm" data-act="next">›</button>
      </div>
      <div class="chord-body"><div class="chord-diag"></div><dl class="chord-info"></dl></div>
      <div class="row-btns">
        <button type="button" class="btn-primary sm" data-act="play"></button>
        <button type="button" class="btn-ghost sm bordered" data-act="3d"></button>
      </div>
    </div>
    <h3 class="sub-h pos-h"></h3>
    <div class="voicing-strip" role="listbox"></div>
    <h3 class="sub-h all-h"></h3>
    <div class="chips all-tabs" role="radiogroup"></div>
    <div class="chord-grid all-grid"></div>
    <p class="fine-note all-note"></p>
    <h3 class="sub-h key-h"></h3>
    <div class="chord-grid key-grid"></div>
  </div>`);

  const tuning = () => ctx.model.strings.map((s) => s.midi);
  const rootOrder = () => { const r0 = pc(tuning()[0]); return Array.from({ length: 12 }, (_, i) => pc(r0 + i)); };
  const labels = () => ctx.model.strings.map((s) => (ctx.lang() === 'ka' ? s.ka : s.latin));
  const where = (v) => (v.frets.some((x) => x === 0) ? tr('open') : tr('fret', { f: v.low }));
  const nm = (r, qq) => chordName(r, qq, ctx.lang());

  function pick(r, qq) {
    root = r; q = qq;
    list = voicings(root, q, tuning());
    const std = fingering(root, q, tuning()).frets.join();
    vIdx = Math.max(0, list.findIndex((v) => v.frets.join() === std));
  }
  const cur = () => list[vIdx] || { ...fingering(root, q, tuning()), inv: 0, low: 0 };

  function render() {
    const lang = ctx.lang();
    if (root == null) pick(pc(tuning()[0]), q);
    el.querySelector('.roots').innerHTML = rootOrder().map((r) => `<button type="button" role="radio" aria-checked="${r === root}" data-r="${r}">${esc(lang === 'ka' ? pcKa(r) : pcLatin(r))}</button>`).join('');
    el.querySelector('.quals').innerHTML = QUALITIES.map((x) => `<button type="button" role="radio" aria-checked="${x.id === q}" data-q="${x.id}">${QLABEL[lang][x.id]}</button>`).join('');

    // the selected position
    const f = cur(), name = nm(root, q);
    el.querySelector('.chord-name').textContent = name.short;
    el.querySelector('.chord-long').textContent = name.long;
    el.querySelector('.pos-txt').innerHTML = `<span><b>${esc(where(f))}</b> · ${esc(trInv(f.inv))}</span><small>${esc(tr('pos', { i: vIdx + 1, n: list.length }))}</small>`;
    el.querySelector('[data-act="prev"]').disabled = vIdx <= 0;
    el.querySelector('[data-act="next"]').disabled = vIdx >= list.length - 1;
    el.querySelector('[data-act="prev"]').setAttribute('aria-label', tr('prev'));
    el.querySelector('[data-act="next"]').setAttribute('aria-label', tr('next'));
    el.querySelector('.chord-diag').innerHTML = chordDiagram(f, labels());
    el.querySelector('.chord-info').innerHTML = ctx.model.strings.map((s, i) => `<div><dt>${tr('string')} ${s.number}</dt><dd>${f.frets[i] === 0 ? tr('open') : f.frets[i]} · ${esc((lang === 'ka' ? pcKa(f.notes[i]) : pcLatin(f.notes[i])) + (Math.floor(f.notes[i] / 12) - 1))}</dd></div>`).join('');
    el.querySelector('[data-act="play"]').textContent = '▶ ' + tr('play');
    el.querySelector('[data-act="3d"]').textContent = tr('view3d');

    // every position of this chord
    el.querySelector('.pos-h').textContent = tr('positions', { n: list.length });
    el.querySelector('.voicing-strip').innerHTML = list.map((v, i) => `<button type="button" class="vc" role="option" aria-selected="${i === vIdx}" data-v="${i}">
      <span class="vc-where">${esc(where(v))}</span>${chordDiagram(v, ['', '', ''])}<span class="vc-inv">${esc(trInv(v.inv))}</span></button>`).join('');

    // all major / minor / other chords
    el.querySelector('.all-h').textContent = tr('all');
    el.querySelector('.all-tabs').innerHTML = [['maj', 'major'], ['min', 'minor'], ['other', 'other']].map(([v, k]) => `<button type="button" role="radio" aria-checked="${v === allTab}" data-tab="${v}">${tr(k)}</button>`).join('');
    const qs = allTab === 'other' ? ['7', 'm7', 'sus4', 'dim'] : [allTab];
    el.querySelector('.all-grid').innerHTML = qs.flatMap((qq) => rootOrder().map((r) => {
      const n = voicings(r, qq, tuning()).length, ff = fingering(r, qq, tuning());
      const on = r === root && qq === q;
      return `<button type="button" class="chord-mini${on ? ' on' : ''}" data-r="${r}" data-q="${qq}" data-top="1"><strong>${esc(chordName(r, qq).short)}</strong>${chordDiagram(ff, ['', '', ''])}<span class="cm-n">${n} ${lang === 'ka' ? 'პოზ.' : 'pos.'}</span></button>`;
    })).join('');
    el.querySelector('.all-note').textContent = tr('allNote');

    // diatonic chords of the open-string key
    const k = pc(tuning()[0]);
    el.querySelector('.key-h').textContent = tr('key', { k: lang === 'ka' ? `${pcKa(k)} მაჟორი` : `${pcLatin(k)} major` });
    const dia = [[0, 'maj'], [2, 'min'], [4, 'min'], [5, 'maj'], [7, 'maj'], [7, '7'], [9, 'min'], [11, 'dim']];
    el.querySelector('.key-grid').innerHTML = dia.map(([d, qq]) => {
      const r = pc(k + d), ff = fingering(r, qq, tuning());
      return `<button type="button" class="chord-mini" data-r="${r}" data-q="${qq}" data-top="1"><strong>${esc(chordName(r, qq).short)}</strong>${chordDiagram(ff, ['', '', ''])}</button>`;
    }).join('');
  }

  function show(scrollStrip) {
    render();
    if (scrollStrip) { const b = el.querySelector(`.vc[data-v="${vIdx}"]`); b && b.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' }); }
  }

  el.addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.tab) { allTab = b.dataset.tab; render(); return; }
    if (b.dataset.v != null) { vIdx = +b.dataset.v; show(true); ctx.playNotes(cur().notes, true); return; }
    if (b.dataset.r != null) {
      pick(+b.dataset.r, b.dataset.q || q); show(false);
      if (b.dataset.top) el.closest('.page-body, #pageBody')?.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (b.dataset.q) { pick(root, b.dataset.q); show(false); return; }
    const act = b.dataset.act;
    if (act === 'prev' && vIdx > 0) { vIdx--; show(true); ctx.playNotes(cur().notes, true); }
    if (act === 'next' && vIdx < list.length - 1) { vIdx++; show(true); ctx.playNotes(cur().notes, true); }
    if (act === 'play') ctx.playNotes(cur().notes, true);
    if (act === '3d') ctx.show3DChord(cur(), chordName(root, q).short);
  });

  return {
    el, title: () => tr('title'),
    open(opts = {}) { if (opts.chord) pick(opts.chord.root, opts.chord.q); else if (root != null) pick(root, q); render(); },
    close() {},
  };
}
