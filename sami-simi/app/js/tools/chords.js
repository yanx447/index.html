// Chord library for the current panduri tuning: diagram, sound, and 3D finger positions.
import { QUALITIES, fingering, chordName, pc, pcLatin, pcKa } from '../music.js';
import { h, chordDiagram, esc } from './ui.js';

const L = {
  ka: { title: 'აკორდები', play: 'მოსმენა', view3d: '3D ტარზე', notes: 'ნოტები', key: 'ტონალობის აკორდები ({k})', frets: 'ლადები', open: 'ღია', string: 'სიმი' },
  en: { title: 'Chords', play: 'Listen', view3d: 'Show on 3D neck', notes: 'Notes', key: 'Chords in the key of {k}', frets: 'Frets', open: 'open', string: 'String' },
};
const QLABEL = { ka: { maj: 'მაჟ', min: 'მინ', 7: '7', m7: 'm7', sus4: 'sus4', dim: 'dim' }, en: { maj: 'Major', min: 'Minor', 7: '7', m7: 'm7', sus4: 'sus4', dim: 'dim' } };

export function create(ctx) {
  const tr = (k, v) => ctx.tr(L, k, v);
  let root = null, q = 'maj';
  const el = h(`<div class="tool chords">
    <div class="chips roots" role="radiogroup"></div>
    <div class="chips quals" role="radiogroup"></div>
    <div class="chord-card">
      <div class="chord-head"><strong class="chord-name"></strong><span class="chord-long"></span></div>
      <div class="chord-body"><div class="chord-diag"></div><dl class="chord-info"></dl></div>
      <div class="row-btns">
        <button type="button" class="btn-primary sm" data-act="play"></button>
        <button type="button" class="btn-ghost sm bordered" data-act="3d"></button>
      </div>
    </div>
    <h3 class="sub-h key-h"></h3>
    <div class="chord-grid"></div>
  </div>`);

  const tuning = () => ctx.model.strings.map((s) => s.midi);
  const rootOrder = () => { const r0 = pc(tuning()[0]); return Array.from({ length: 12 }, (_, i) => pc(r0 + i)); };

  function render() {
    const lang = ctx.lang();
    if (root == null) root = pc(tuning()[0]);
    el.querySelector('.roots').innerHTML = rootOrder().map((r) => `<button type="button" role="radio" aria-checked="${r === root}" data-r="${r}">${esc(lang === 'ka' ? pcKa(r) : pcLatin(r))}</button>`).join('');
    el.querySelector('.quals').innerHTML = QUALITIES.map((x) => `<button type="button" role="radio" aria-checked="${x.id === q}" data-q="${x.id}">${QLABEL[lang][x.id]}</button>`).join('');
    const f = fingering(root, q, tuning());
    const nm = chordName(root, q, lang);
    el.querySelector('.chord-name').textContent = nm.short;
    el.querySelector('.chord-long').textContent = nm.long;
    el.querySelector('.chord-diag').innerHTML = chordDiagram(f, ctx.model.strings.map((s) => (lang === 'ka' ? s.ka : s.latin)));
    el.querySelector('.chord-info').innerHTML = ctx.model.strings.map((s, i) => `<div><dt>${tr('string')} ${s.number}</dt><dd>${f.frets[i] === 0 ? tr('open') : f.frets[i]} · ${esc(lang === 'ka' ? pcKa(f.notes[i]) : pcLatin(f.notes[i]))}</dd></div>`).join('');
    el.querySelector('[data-act="play"]').textContent = '▶ ' + tr('play');
    el.querySelector('[data-act="3d"]').textContent = tr('view3d');
    // diatonic chords of the open-string key
    const k = pc(tuning()[0]);
    el.querySelector('.key-h').textContent = tr('key', { k: lang === 'ka' ? `${pcKa(k)} მაჟორი` : `${pcLatin(k)} major` });
    const dia = [[0, 'maj'], [2, 'min'], [4, 'min'], [5, 'maj'], [7, 'maj'], [7, '7'], [9, 'min'], [11, 'dim']];
    el.querySelector('.chord-grid').innerHTML = dia.map(([d, qq]) => {
      const r = pc(k + d), ff = fingering(r, qq, tuning());
      return `<button type="button" class="chord-mini" data-r="${r}" data-q="${qq}"><strong>${esc(chordName(r, qq).short)}</strong>${chordDiagram(ff, ['', '', ''])}</button>`;
    }).join('');
  }

  el.addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.r != null) { root = +b.dataset.r; if (b.dataset.q) q = b.dataset.q; render(); return; }
    if (b.dataset.q) { q = b.dataset.q; render(); return; }
    const f = fingering(root, q, tuning());
    if (b.dataset.act === 'play') ctx.playNotes(f.notes, true);
    if (b.dataset.act === '3d') ctx.show3DChord(f, chordName(root, q).short);
  });

  return {
    el, title: () => tr('title'),
    open(opts = {}) { if (opts.chord) { root = opts.chord.root; q = opts.chord.q; } render(); },
    close() {},
  };
}
