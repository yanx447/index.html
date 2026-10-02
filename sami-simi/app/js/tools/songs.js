// Songbook: your own songs with chords in [brackets]; tap a chord to see and hear it.
// Also links to an external panduri songs app (URL set by the user) and accepts ?chord= deep links.
import { h, esc, chordDiagram } from './ui.js';
import { parseChord, chordName, fingering, pcLatin, pc } from '../music.js';

const L = {
  ka: { title: 'სიმღერები', add: '+ ახალი სიმღერა', edit: 'რედაქტირება', save: 'შენახვა', del: 'წაშლა', confirm: 'დაადასტურე', back: '← სია', name: 'სახელი', body: 'ტექსტი და აკორდები',
    help: 'აკორდები ჩაწერე კვადრატულ ფრჩხილებში ტექსტის შიგნით, მაგ.: [A]ჩემო [D]კარგო', transpose: 'ტრანსპ.', play: '▶ მოსმენა', on3d: '3D', empty: 'სიმღერები ჯერ არ გაქვს.',
    sample: 'მაგალითი — აკორდების სავარჯიშო', sampleBody: '[A]აქ ჩაწერე ტექსტი, [D]აკორდები — ფრჩხილებში,\n[E]შეეხე აკორდს, რომ [A]ნახო და მოისმინო.\n\n[A] [F#m] [D] [E]',
    app: 'სიმღერების აპი', appUrl: 'შენი ფანდურის სიმღერების აპის ბმული', open: 'გახსნა', exp: 'ექსპორტი', imp: 'იმპორტი', copied: 'დაკოპირდა', impPh: 'ჩასვი ექსპორტირებული JSON', imported: 'დაემატა {n} სიმღერა', bad: 'ფაილი ვერ წავიკითხე' },
  en: { title: 'Songs', add: '+ New song', edit: 'Edit', save: 'Save', del: 'Delete', confirm: 'Confirm', back: '← List', name: 'Title', body: 'Lyrics and chords',
    help: 'Put chords in square brackets inside the lyrics, e.g. [A]my [D]song', transpose: 'Transp.', play: '▶ Listen', on3d: '3D', empty: 'No songs yet.',
    sample: 'Example — chord practice', sampleBody: '[A]Write your lyrics here, [D]chords go in brackets,\n[E]tap a chord to [A]see and hear it.\n\n[A] [F#m] [D] [E]',
    app: 'Songs app', appUrl: 'Link to your panduri songs app', open: 'Open', exp: 'Export', imp: 'Import', copied: 'Copied', impPh: 'Paste exported JSON', imported: 'Added {n} songs', bad: 'Could not read that' },
};
const KEY = 'sami-simi:songs', KEY_URL = 'sami-simi:songs-url';

export function create(ctx) {
  const tr = (k, v) => ctx.tr(L, k, v);
  let songs = [], view = 'list', cur = null, appUrl = '';
  try { songs = JSON.parse(localStorage.getItem(KEY) || 'null'); appUrl = localStorage.getItem(KEY_URL) || ''; } catch (e) { songs = null; }
  if (!Array.isArray(songs)) songs = [{ id: 1, title: tr('sample'), body: tr('sampleBody'), t: 0 }];
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(songs)); localStorage.setItem(KEY_URL, appUrl); } catch (e) { /* ignore */ } };
  const el = h(`<div class="tool songs"><div class="songs-view"></div><div class="chord-pop" hidden></div></div>`);
  const view$ = el.querySelector('.songs-view'), pop = el.querySelector('.chord-pop');

  const transposeChord = (txt, t) => {
    const p = parseChord(txt); if (!p || !t) return txt;
    return chordName(pc(p.root + t), p.q).short;
  };

  function renderList() {
    view$.innerHTML = `<button type="button" class="btn-primary wide-btn" data-a="new">${tr('add')}</button>
      <ul class="song-list">${songs.length ? songs.map((s) => `<li><button type="button" data-open="${s.id}">${esc(s.title || '—')}</button></li>`).join('') : `<li class="empty">${tr('empty')}</li>`}</ul>
      <div class="card-lite"><label class="lab2" for="songsUrl">${tr('appUrl')}</label>
        <div class="custom-row"><input id="songsUrl" type="url" class="txt" placeholder="https://" value="${esc(appUrl)}"><button type="button" class="btn-ghost bordered sm" data-a="openapp">${tr('open')}</button></div>
        <div class="row-btns"><button type="button" class="btn-ghost bordered sm" data-a="exp">${tr('exp')}</button><button type="button" class="btn-ghost bordered sm" data-a="imp">${tr('imp')}</button></div>
        <textarea class="txt imp-area" hidden rows="4" placeholder="${tr('impPh')}"></textarea>
      </div>`;
  }
  function renderSong() {
    const s = songs.find((x) => x.id === cur); if (!s) { view = 'list'; return render(); }
    const lines = esc(s.body).split('\n').map((line) => {
      if (!line.includes('[')) return `<div class="ln">${line || '&nbsp;'}</div>`;
      const parts = line.split(/\[([^\]]+)\]/);
      if (parts.every((x, i) => i % 2 || !x.trim())) {
        return `<div class="ln chord-only">${parts.filter((x, i) => i % 2).map((c) => { const ch = transposeChord(c, s.t); return `<button type="button" class="ch" data-ch="${esc(ch)}">${esc(ch)}</button>`; }).join('')}</div>`;
      }
      let html = parts[0] ? `<span class="lseg"><b>&nbsp;</b>${parts[0]}</span>` : '';
      for (let i = 1; i < parts.length; i += 2) {
        const ch = transposeChord(parts[i], s.t);
        html += `<span class="lseg"><b><button type="button" class="ch" data-ch="${esc(ch)}">${esc(ch)}</button></b>${parts[i + 1] || '&nbsp;'}</span>`;
      }
      return `<div class="ln chords">${html}</div>`;
    }).join('');
    view$.innerHTML = `<div class="song-bar"><button type="button" class="btn-ghost sm" data-a="list">${tr('back')}</button>
        <div class="tp"><span>${tr('transpose')}</span><button type="button" class="round sm" data-a="t-">−</button><b>${s.t > 0 ? '+' : ''}${s.t}</b><button type="button" class="round sm" data-a="t+">+</button></div>
        <button type="button" class="btn-ghost sm" data-a="edit">${tr('edit')}</button></div>
      <h3 class="song-title">${esc(s.title)}</h3><div class="song-body">${lines}</div>`;
  }
  function renderEdit() {
    const s = songs.find((x) => x.id === cur) || { title: '', body: '' };
    view$.innerHTML = `<label class="lab2" for="sgT">${tr('name')}</label><input id="sgT" class="txt" value="${esc(s.title)}">
      <label class="lab2" for="sgB">${tr('body')}</label><textarea id="sgB" class="txt" rows="12">${esc(s.body)}</textarea>
      <p class="fine-note">${tr('help')}</p>
      <div class="row-btns"><button type="button" class="btn-primary" data-a="save">${tr('save')}</button><button type="button" class="btn-ghost bordered danger" data-a="del">${tr('del')}</button><button type="button" class="btn-ghost" data-a="list">${tr('back')}</button></div>`;
  }
  function render() { pop.hidden = true; if (view === 'list') renderList(); else if (view === 'song') renderSong(); else renderEdit(); }

  function showChord(txt) {
    const p = parseChord(txt); if (!p) return;
    const f = fingering(p.root, p.q, ctx.model.strings.map((s) => s.midi));
    pop.innerHTML = `<div class="pop-in"><strong>${esc(txt)}</strong>${chordDiagram(f, ctx.model.strings.map((s) => (ctx.lang() === 'ka' ? s.ka : s.latin)))}
      <div class="row-btns"><button type="button" class="btn-primary sm" data-a="pplay">${tr('play')}</button><button type="button" class="btn-ghost bordered sm" data-a="p3d">${tr('on3d')}</button><button type="button" class="btn-ghost sm" data-a="pclose">✕</button></div></div>`;
    pop.hidden = false; pop.dataset.ch = txt;
    ctx.playNotes(f.notes, true);
  }

  el.addEventListener('click', async (e) => {
    const b = e.target.closest('button'); if (!b) return;
    const a = b.dataset.a;
    if (b.dataset.open) { cur = +b.dataset.open; view = 'song'; return render(); }
    if (b.dataset.ch) return showChord(b.dataset.ch);
    const s = songs.find((x) => x.id === cur);
    if (a === 'new') { cur = Date.now(); songs.push({ id: cur, title: '', body: '', t: 0 }); view = 'edit'; return render(); }
    if (a === 'list') { songs = songs.filter((x) => x.title || x.body); save(); view = 'list'; return render(); }
    if (a === 'edit') { view = 'edit'; return render(); }
    if (a === 't-' || a === 't+') { s.t = Math.max(-11, Math.min(11, s.t + (a === 't+' ? 1 : -1))); save(); return render(); }
    if (a === 'save') { s.title = el.querySelector('#sgT').value.trim(); s.body = el.querySelector('#sgB').value; save(); view = 'song'; return render(); }
    if (a === 'del') { if (!b.classList.contains('confirming')) { b.classList.add('confirming'); b.textContent = tr('confirm'); return; } songs = songs.filter((x) => x.id !== cur); save(); view = 'list'; return render(); }
    if (a === 'openapp') { appUrl = el.querySelector('#songsUrl').value.trim(); save(); if (/^https?:\/\//.test(appUrl)) window.open(appUrl, '_blank', 'noopener'); return; }
    if (a === 'exp') { const txt = JSON.stringify({ app: 'sami-simi', songs }, null, 1); try { await navigator.clipboard.writeText(txt); ctx.toast(tr('copied')); } catch (er) { const ta = el.querySelector('.imp-area'); ta.hidden = false; ta.value = txt; ta.select(); } return; }
    if (a === 'imp') {
      const ta = el.querySelector('.imp-area');
      if (ta.hidden || !ta.value.trim()) { ta.hidden = false; ta.focus(); return; }
      try {
        const data = JSON.parse(ta.value); const list = Array.isArray(data) ? data : data.songs;
        const add = list.filter((x) => x && (x.title || x.body)).map((x, i) => ({ id: Date.now() + i, title: String(x.title || ''), body: String(x.body || x.lyrics || ''), t: 0 }));
        songs.push(...add); save(); ctx.toast(tr('imported', { n: add.length })); render();
      } catch (er) { ctx.toast(tr('bad')); }
      return;
    }
    if (a === 'pplay') { const p = parseChord(pop.dataset.ch); ctx.playNotes(fingering(p.root, p.q, ctx.model.strings.map((x) => x.midi)).notes, true); }
    if (a === 'p3d') { const p = parseChord(pop.dataset.ch); ctx.show3DChord(fingering(p.root, p.q, ctx.model.strings.map((x) => x.midi)), pop.dataset.ch); }
    if (a === 'pclose') pop.hidden = true;
  });
  el.addEventListener('change', (e) => { if (e.target.id === 'songsUrl') { appUrl = e.target.value.trim(); save(); } });

  return { el, title: () => tr('title'), open() { render(); }, close() { save(); } };
}
