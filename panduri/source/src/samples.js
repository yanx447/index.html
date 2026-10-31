/* =====================================================================
   Real panduri sample library.
   Recordings of the teacher's instrument, stored on this device
   (IndexedDB), indexed by string, fret, articulation, dynamic and take.
     articulation: 'pluck' | 'down' | 'up' | 'mute' | 'chord'
     dynamic:      'p' | 'mf' | 'f'
     take:         1..n (round robin — repeated notes rotate takes)
   Rules:
   • A note uses a recording of exactly that string+fret when one exists.
   • Re-pitching is limited (default ±1 semitone, configurable to 0) so one
     sample is never stretched across the instrument.
   • Otherwise the physical model in PD.audio is used, and coverage
     reports show exactly which notes are still synthetic.
   • Whole-chord strokes ('chord') are matched by exact fret shape + direction.
   Decoding is lazy: buffers load the first time they are needed or when a
   lesson preloads its notes.
   ===================================================================== */
PD.samples = (() => {
  const IDX = 'samples.index', ARTS = ['pluck', 'down', 'up', 'mute', 'chord'], DYNS = ['p', 'mf', 'f'];
  let index = PD.store.get(IDX, []);
  const buf = new Map(), loading = new Map(), rr = new Map();
  const maxRepitch = () => PD.store.get('samples.maxRepitch', 1);
  const save = () => { PD.store.set(IDX, index); PD.bus.emit('samples'); };
  const dynOf = vel => vel < .45 ? 'p' : vel > .8 ? 'f' : 'mf';

  async function decode(item) {
    if (buf.has(item.id)) return buf.get(item.id);
    if (loading.has(item.id)) return loading.get(item.id);
    const ctx = PD.audio.ensure(); if (!ctx) return null;
    const p = (async () => { try { const b = await PD.blobs.get(item.blobId); if (!b) return null; const ab = await ctx.decodeAudioData(await b.arrayBuffer()); buf.set(item.id, ab); return ab; } catch (_) { buf.set(item.id, null); return null; } finally { loading.delete(item.id); } })();
    loading.set(item.id, p); return p;
  }
  function candidates(s, f, art, dyn) {
    const arts = art === 'down' || art === 'up' ? [art, 'pluck'] : [art];
    for (const a of arts) {
      for (let dd = 0; dd <= maxRepitch(); dd++) for (const sg of dd ? [-1, 1] : [0]) {
        const ff = f + dd * sg;
        let c = index.filter(x => x.art === a && x.s === s && x.f === ff);
        if (!c.length) continue;
        const exactDyn = c.filter(x => x.dyn === dyn); if (exactDyn.length) c = exactDyn;
        return { list: c, shift: f - ff };
      }
    }
    return null;
  }
  /** pick a decoded take for a single note (round robin), or null → physical model */
  function pick(s, f, art, vel) {
    const c = candidates(s, f, art, dynOf(vel)); if (!c) return null;
    const ready = c.list.filter(x => buf.get(x.id)); c.list.forEach(x => { if (!buf.has(x.id)) decode(x); });
    if (!ready.length) return null;
    const key = s + ':' + f + ':' + art, i = ((rr.get(key) || 0) + 1) % ready.length; rr.set(key, i);
    const it = ready[i];
    return { buf: buf.get(it.id), rate: Math.pow(2, c.shift / 12), gain: Math.pow(10, (it.gainDb || 0) / 20) * (.6 + .5 * vel), offset: it.trim || 0 };
  }
  function pickChord(frets, dir, vel) {
    const key = frets.map(f => f == null ? 'x' : f).join('-');
    let c = index.filter(x => x.art === 'chord' && x.shape === key && x.dir === dir); if (!c.length) return null;
    const d = c.filter(x => x.dyn === dynOf(vel)); if (d.length) c = d;
    const ready = c.filter(x => buf.get(x.id)); c.forEach(x => { if (!buf.has(x.id)) decode(x); });
    if (!ready.length) return null;
    const k = 'c:' + key + dir, i = ((rr.get(k) || 0) + 1) % ready.length; rr.set(k, i);
    return { buf: buf.get(ready[i].id), gain: Math.pow(10, (ready[i].gainDb || 0) / 20) * (.6 + .5 * vel), offset: ready[i].trim || 0 };
  }
  /** parse "<string>_<fret>_<art>_<dyn>_<take>.wav", e.g. "A_05_pluck_mf_2.wav", "2_7_down_f_1.flac", "chord_5-4-5_down_mf_1.wav" */
  function parseName(name) {
    const base = name.replace(/\.[a-z0-9]+$/i, ''), p = base.split(/[_\s]+/);
    const labels = PD.instrument.profile.strings.map(x => x.label.replace('♯', '#').toUpperCase());
    if (p[0] && p[0].toLowerCase() === 'chord') return { art: 'chord', shape: p[1], dir: p[2] === 'up' ? 'up' : 'down', dyn: DYNS.includes(p[3]) ? p[3] : 'mf', take: +p[4] || 1 };
    let s = +p[0]; if (!s) { const i = labels.indexOf((p[0] || '').toUpperCase().replace('♯', '#')); s = i >= 0 ? i + 1 : 0; }
    const f = parseInt(p[1], 10);
    if (!(s >= 1 && s <= PD.instrument.stringCount) || !(f >= 0 && f <= PD.instrument.fretCount)) return null;
    return { s, f, art: ARTS.includes(p[2]) ? p[2] : 'pluck', dyn: DYNS.includes(p[3]) ? p[3] : 'mf', take: +p[4] || 1 };
  }
  async function add(file, meta) {
    const m = Object.assign({}, meta || parseName(file.name) || {}); if (!m.art) return null;
    const id = 'smp-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6), blobId = 'sample:' + id;
    await PD.blobs.put(blobId, file);
    const item = Object.assign({ id, blobId, name: file.name, size: file.size, gainDb: 0, trim: 0, added: Date.now() }, m);
    if (item.art !== 'chord') { const same = index.filter(x => x.art === item.art && x.s === item.s && x.f === item.f && x.dyn === item.dyn); item.take = Math.max(item.take || 1, same.length + 1); }
    index.push(item); save(); return item;
  }
  function remove(id) { const it = index.find(x => x.id === id); if (!it) return; PD.blobs.del(it.blobId); buf.delete(id); index = index.filter(x => x.id !== id); save(); }
  /** coverage per (string, fret) for an articulation: number of takes */
  function coverage(art) { const out = {}; index.filter(x => x.art === (art || 'pluck')).forEach(x => { const k = x.s + ':' + x.f; out[k] = (out[k] || 0) + 1; }); return out; }
  /** decode everything a lesson needs before it starts */
  function preload(lesson) {
    if (!index.length || !lesson) return;
    const need = new Set(); (lesson.events || []).forEach(e => need.add(e.s + ':' + e.f));
    index.forEach(x => { if (x.art === 'chord' || need.has(x.s + ':' + x.f)) decode(x); });
  }
  async function play(id) { const it = index.find(x => x.id === id); if (!it) return; const b = await decode(it); const ctx = PD.audio.ensure(); if (!b || !ctx) return; const src = ctx.createBufferSource(); src.buffer = b; src.connect(ctx.destination); src.start(); }
  return { ARTS, DYNS, get list() { return index.slice(); }, get count() { return index.length; }, pick, pickChord, add, remove, coverage, preload, parseName, play, maxRepitch, setMaxRepitch(v) { PD.store.set('samples.maxRepitch', v); } };
})();
