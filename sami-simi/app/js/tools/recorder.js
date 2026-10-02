// Recorder: record your playing, keep takes on the device, play back, and see how in tune you were.
import { h, esc } from './ui.js';
import { pcLatin, pcKa } from '../music.js';

const L = {
  ka: { title: 'ჩანაწერები', rec: 'ჩაწერა', stop: 'გაჩერება', empty: 'ჯერ ჩანაწერი არ გაქვს. დააჭირე „ჩაწერა“ და დაუკარი.', play: 'მოსმენა', pause: 'პაუზა', analyze: 'ანალიზი', share: 'გაზიარება', del: 'წაშლა', confirm: 'დაადასტურე', unsupported: 'ამ მოწყობილობაზე ჩაწერა მიუწვდომელია.', avg: 'საშუალო გადახრა {c}¢ · {p}% ±10¢-ში', none: 'ნოტები ვერ ამოვიცანი', note: 'ჩანაწერები ინახება მხოლოდ ამ მოწყობილობაზე.', working: 'ვაანალიზებ…' },
  en: { title: 'Recordings', rec: 'Record', stop: 'Stop', empty: 'No recordings yet. Tap “Record” and play.', play: 'Play', pause: 'Pause', analyze: 'Analyse', share: 'Share', del: 'Delete', confirm: 'Confirm', unsupported: 'Recording is not available on this device.', avg: 'Average deviation {c}¢ · {p}% within ±10¢', none: 'No notes recognised', note: 'Recordings stay on this device only.', working: 'Analysing…' },
};

const DB = 'sami-simi', STORE = 'recs';
function db() {
  return new Promise((res, rej) => {
    const r = indexedDB.open(DB, 1);
    r.onupgradeneeded = () => r.result.createObjectStore(STORE, { keyPath: 'id' });
    r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error);
  });
}
async function tx(mode, fn) { const d = await db(); return new Promise((res, rej) => { const t = d.transaction(STORE, mode); const st = t.objectStore(STORE); const r = fn(st); t.oncomplete = () => res(r && r.result); t.onerror = () => rej(t.error); }); }

export function create(ctx) {
  const tr = (k, v) => ctx.tr(L, k, v);
  let mic = null, rec = null, chunks = [], t0 = 0, clock = 0, items = [], audio = new Audio(), playing = null;
  const el = h(`<div class="tool recorder">
    <div class="rec-top"><button type="button" class="rec-btn" data-act="rec" aria-label=""><i></i></button><span class="rec-time">0:00</span></div>
    <ul class="rec-list"></ul>
    <p class="fine-note"></p>
  </div>`);
  const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

  async function load() { try { items = (await tx('readonly', (st) => st.getAll())) || []; } catch (e) { items = []; } items.sort((a, b) => b.id - a.id); render(); }

  function render() {
    el.querySelector('.rec-btn').classList.toggle('on', !!rec);
    el.querySelector('.rec-btn').setAttribute('aria-label', rec ? tr('stop') : tr('rec'));
    el.querySelector('.fine-note').textContent = tr('note');
    const ul = el.querySelector('.rec-list');
    if (!items.length) { ul.innerHTML = `<li class="empty">${esc(tr('empty'))}</li>`; return; }
    ul.innerHTML = items.map((it) => `<li data-id="${it.id}">
      <div class="ri-head"><strong>${esc(new Date(it.id).toLocaleString(ctx.lang() === 'ka' ? 'ka-GE' : 'en-GB', { dateStyle: 'medium', timeStyle: 'short' }))}</strong><span>${fmt(it.dur)}</span></div>
      <div class="ri-btns">
        <button type="button" data-a="play">${playing === it.id ? '❚❚ ' + tr('pause') : '▶ ' + tr('play')}</button>
        <button type="button" data-a="analyze">${tr('analyze')}</button>
        <button type="button" data-a="share">${tr('share')}</button>
        <button type="button" data-a="del" class="danger">${tr('del')}</button>
      </div>
      <div class="ri-ana" hidden><canvas></canvas><p></p></div>
    </li>`).join('');
  }

  async function startRec() {
    if (!window.MediaRecorder) { ctx.toast(tr('unsupported')); return; }
    mic = await ctx.mic(); if (!mic) return;
    const type = ['audio/mp4', 'audio/webm;codecs=opus', 'audio/webm', ''].find((t) => !t || MediaRecorder.isTypeSupported(t));
    try { rec = new MediaRecorder(mic.stream, type ? { mimeType: type } : undefined); } catch (e) { ctx.toast(tr('unsupported')); ctx.releaseMic(); mic = null; return; }
    chunks = []; rec.ondataavailable = (e) => e.data.size && chunks.push(e.data);
    rec.onstop = async () => {
      const blob = new Blob(chunks, { type: rec.mimeType || type || 'audio/webm' });
      const it = { id: Date.now(), dur: (performance.now() - t0) / 1000, type: blob.type, blob };
      try { await tx('readwrite', (st) => st.put(it)); } catch (e) { /* storage full / private mode */ }
      rec = null; ctx.releaseMic(); mic = null; clearInterval(clock); await load();
    };
    rec.start(250); t0 = performance.now();
    clock = setInterval(() => { el.querySelector('.rec-time').textContent = fmt((performance.now() - t0) / 1000); }, 250);
    ctx.keepAwake(true); render();
  }
  function stopRec() { if (rec && rec.state !== 'inactive') rec.stop(); ctx.keepAwake(false); }

  async function analyze(it, li) {
    const box = li.querySelector('.ri-ana'); box.hidden = false;
    const p = box.querySelector('p'); p.textContent = tr('working');
    const ac = ctx.audio();
    let buf;
    try { buf = await ac.decodeAudioData(await it.blob.arrayBuffer()); } catch (e) { p.textContent = tr('none'); return; }
    const x = buf.getChannelData(0), sr = buf.sampleRate, det = ctx.detector(sr), hop = Math.floor(sr * 0.03), pts = [];
    for (let e = 4096; e < x.length; e += hop) {
      const r = det.analyze(x.subarray(e - 4096, e));
      if (r.freq > 60 && r.clarity > 0.88 && r.rms > 0.003) {
        const m = 69 + 12 * Math.log2(r.freq / ctx.S.a4), n = Math.round(m);
        pts.push({ t: e / sr, c: (m - n) * 100, n });
      } else pts.push(null);
    }
    const v = pts.filter(Boolean);
    if (!v.length) { p.textContent = tr('none'); return; }
    const avg = v.reduce((s, q) => s + Math.abs(q.c), 0) / v.length;
    const pct = Math.round((100 * v.filter((q) => Math.abs(q.c) <= 10).length) / v.length);
    p.textContent = tr('avg', { c: avg.toFixed(1), p: pct });
    // draw cents trace
    const cv = box.querySelector('canvas'), d = Math.min(2, devicePixelRatio || 1);
    cv.width = cv.clientWidth * d; cv.height = 90 * d; const g = cv.getContext('2d');
    const W = cv.width, H = cv.height, y = (c) => H / 2 - (c / 50) * (H / 2 - 6 * d);
    g.fillStyle = 'rgba(140,192,132,.12)'; g.fillRect(0, y(10), W, y(-10) - y(10));
    g.fillStyle = 'rgba(242,233,218,.15)'; g.fillRect(0, H / 2, W, d);
    let prev = null, lastNote = null;
    g.lineWidth = 1.6 * d; g.font = `${10 * d}px system-ui`;
    pts.forEach((q, i) => {
      const xx = (i / pts.length) * W;
      if (!q) { prev = null; return; }
      if (prev) { g.strokeStyle = Math.abs(q.c) <= 10 ? '#8cc084' : '#d9a24a'; g.beginPath(); g.moveTo(prev[0], prev[1]); g.lineTo(xx, y(q.c)); g.stroke(); }
      if (q.n !== lastNote) { g.fillStyle = 'rgba(205,191,168,.8)'; g.fillText(ctx.lang() === 'ka' ? pcKa(q.n) : pcLatin(q.n), xx + 2, 11 * d); lastNote = q.n; }
      prev = [xx, y(q.c)];
    });
  }

  async function share(it) {
    const ext = it.type.includes('mp4') ? 'm4a' : 'webm';
    const file = new File([it.blob], `sami-simi-${it.id}.${ext}`, { type: it.type });
    try {
      if (navigator.canShare && navigator.canShare({ files: [file] })) { await navigator.share({ files: [file], title: 'Sami Simi' }); return; }
    } catch (e) { return; }
    const a = document.createElement('a'); a.href = URL.createObjectURL(file); a.download = file.name; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 5000);
  }

  el.addEventListener('click', async (e) => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.act === 'rec') { rec ? stopRec() : startRec(); return; }
    const li = b.closest('li[data-id]'); if (!li) return;
    const it = items.find((x) => x.id === +li.dataset.id); if (!it) return;
    if (b.dataset.a === 'play') {
      if (playing === it.id) { audio.pause(); playing = null; render(); return; }
      audio.pause(); audio.src = URL.createObjectURL(it.blob); playing = it.id; audio.onended = () => { playing = null; render(); };
      try { await audio.play(); } catch (er) { playing = null; } render();
    } else if (b.dataset.a === 'analyze') analyze(it, li);
    else if (b.dataset.a === 'share') share(it);
    else if (b.dataset.a === 'del') {
      if (!b.classList.contains('confirming')) { b.classList.add('confirming'); b.textContent = tr('confirm'); return; }
      await tx('readwrite', (st) => st.delete(it.id)); load();
    }
  });

  return { el, title: () => tr('title'), open() { load(); }, close() { stopRec(); audio.pause(); playing = null; } };
}
