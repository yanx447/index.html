/* =====================================================================
   Panduri Studio (author mode): lesson metadata, sections, reference
   audio + waveform, 3-string event grid (add / select / move / resize),
   inspector (string, fret, finger, stroke, duration, accent, technique,
   chord, hints, hand position, difficulty), quantize, split, duplicate,
   transpose, chords, undo/redo, preview playback, record from mic,
   JSON import/export (schema v2). Saves to this device only.
   ===================================================================== */
PD.i18n.add({
  'sd.title': ['სტუდია', 'Studio'], 'sd.new': ['ახალი გაკვეთილი', 'New lesson'], 'sd.save': ['შენახვა', 'Save'], 'sd.saved': ['შენახულია ამ მოწყობილობაზე', 'Saved on this device'],
  'sd.test': ['გამოცდა', 'Test'], 'sd.preview': ['მოსმენა', 'Preview'], 'sd.stop': ['გაჩერება', 'Stop'], 'sd.rec': ['ჩაწერა მიკროფონით', 'Record from mic'],
  'sd.export': ['JSON ექსპორტი', 'Export JSON'], 'sd.import': ['JSON იმპორტი', 'Import JSON'], 'sd.delete': ['გაკვეთილის წაშლა', 'Delete lesson'], 'sd.dirty': ['შეუნახავი ცვლილებები დაიკარგება.', 'Unsaved changes will be lost.'],
  'sd.importBad': ['ფაილი ვერ წავიკითხე — ეს panduri-lesson JSON არ არის.', 'Could not read the file — it is not a panduri-lesson JSON.'],
  'sd.meta': ['გაკვეთილი', 'Lesson'], 'sd.titleKa': ['სათაური (ქართ.)', 'Title (Georgian)'], 'sd.titleEn': ['სათაური (ინგლ.)', 'Title (English)'], 'sd.descKa': ['აღწერა (ქართ.)', 'Description (Georgian)'], 'sd.descEn': ['აღწერა (ინგლ.)', 'Description (English)'],
  'sd.type': ['ტიპი', 'Type'], 'sd.level': ['დონე', 'Level'], 'sd.bpm': ['ტემპი (BPM)', 'Tempo (BPM)'], 'sd.meter': ['ზომა', 'Meter'], 'sd.link': ['ბმული (მაგ. YouTube)', 'Link (e.g. YouTube)'],
  'sd.sections': ['მონაკვეთები', 'Sections'], 'sd.secAdd': ['მონიშნულიდან', 'From selection'], 'sd.secAuto': ['ტაქტებით', 'By bars'], 'sd.from': ['დან', 'from'], 'sd.to': ['მდე', 'to'],
  'sd.ref': ['საცნობარო აუდიო', 'Reference audio'], 'sd.refLoad': ['ფაილის არჩევა', 'Choose file'], 'sd.refOff': ['დასაწყისი (წმ)', 'Start offset (s)'], 'sd.refDel': ['მოხსნა', 'Remove'],
  'sd.refNote': ['მხოლოდ შენი ჩანაწერი ან ის, რისი გამოყენების უფლებაც გაქვს. ფაილი ამ მოწყობილობაზე ინახება.', 'Only your own recording or one you have rights to. The file stays on this device.'],
  'sd.tSel': ['არჩევა', 'Select'], 'sd.tNote': ['ნოტი', 'Note'], 'sd.tErase': ['წაშლა', 'Erase'], 'sd.grid': ['ბადე', 'Grid'], 'sd.fretIn': ['ლადი', 'Fret'],
  'sd.quant': ['კვანტიზაცია', 'Quantize'], 'sd.split': ['გაყოფა', 'Split'], 'sd.dup': ['გამრავლება', 'Duplicate'], 'sd.del': ['წაშლა', 'Delete'], 'sd.undo': ['უკან', 'Undo'], 'sd.redo': ['წინ', 'Redo'],
  'sd.chordIns': ['აკორდის ჩასმა', 'Insert chord'], 'sd.group': ['აკორდად გაერთიანება', 'Group as chord'], 'sd.ungroup': ['დაშლა', 'Ungroup'], 'sd.autoFi': ['თითების შეთავაზება', 'Suggest fingers'],
  'sd.insp': ['თვისებები', 'Inspector'], 'sd.none': ['მონიშნე ნოტი ბადეზე. „ნოტი“ ხელსაწყოთი დაამატე, გადაათრიე დროში ან სიმზე, კიდით შეცვალე ხანგრძლივობა.', 'Select a note on the grid. Add with the Note tool, drag to move in time or across strings, drag its edge to change length.'],
  'sd.n': ['{n} მონიშნული', '{n} selected'], 'sd.string': ['სიმი', 'String'], 'sd.fret': ['ლადი', 'Fret'], 'sd.finger': ['თითი (0 = ღია)', 'Finger (0 = open)'], 'sd.stroke': ['დარტყმა', 'Stroke'], 'sd.dur': ['ხანგრძლივობა (დარტყმა)', 'Duration (beats)'],
  'sd.time': ['დრო (დარტყმა)', 'Time (beat)'], 'sd.acc': ['აქცენტი', 'Accent'], 'sd.tech': ['ტექნიკა', 'Technique'], 'sd.pluck': ['ერთი სიმი', 'Single string'], 'sd.strum': ['ჩამოკვრა', 'Strum'],
  'sd.chordName': ['აკორდის სახელი', 'Chord name'], 'sd.hintKa': ['მინიშნება (ქართ.)', 'Hint (Georgian)'], 'sd.hintEn': ['მინიშნება (ინგლ.)', 'Hint (English)'], 'sd.hand': ['ხელის პოზიცია (1-ლი თითის ლადი)', 'Hand position (index-finger fret)'],
  'sd.diff': ['სირთულე', 'Difficulty'], 'sd.mixed': ['სხვადასხვა', 'mixed'],
  'sd.stat': ['{n} ნოტი · {b} ტაქტი · კურსორი {c}', '{n} notes · {b} bars · cursor {c}'], 'sd.warnFi': ['{n} ნოტს თითი აკლია', '{n} fretted notes have no finger'], 'sd.warnDup': ['{n} დამთხვევა ერთ სიმზე', '{n} overlaps on one string'],
  'sd.side': ['გაკვეთილი', 'Lesson'],
  'sd.stages': ['სწავლის ეტაპები', 'Learning stages'], 'sd.stagesD': ['მონიშნე მხოლოდ ის ეტაპები, რომლებსაც ამ გაკვეთილისთვის პედაგოგიური აზრი აქვს.', 'Tick only the stages that make teaching sense for this lesson.'],
  'sd.intro': ['შესავალი (ქართ.)', 'Introduction (Georgian)'], 'sd.introEn': ['შესავალი (ინგლ.)', 'Introduction (English)'],
  'sd.techIso': ['ცალკე ტექნიკა', 'Isolated technique'], 'sd.techRhythm': ['მხოლოდ დარტყმები (ღია სიმებზე)', 'Strokes only (open strings)'], 'sd.techSection': ['მონაკვეთი', 'Section'],
  'sd.media': ['მასწავლებლის ვიდეო', 'Teacher video'], 'sd.mediaAdd': ['ვიდეოს დამატება', 'Add video'], 'sd.mediaUrl': ['ან ბმული (URL)', 'or a link (URL)'], 'sd.mediaOff': ['ვიდეოს დრო, როცა გაკვეთილი იწყება (წმ)', 'Video time when the lesson starts (s)'],
  'sd.verified': ['მასწავლებლის მიერ დამოწმებული', 'Verified by the teacher'], 'sd.verifiedD': ['ჩართვისას „დემო“ ნიშანი იხსნება.', 'Removes the “Demo” label.'],
  'sd.instrument': ['ინსტრუმენტი', 'Instrument'], 'sd.curriculum': ['კურიკულუმი', 'Curriculum'], 'sd.samples': ['ნიმუშები', 'Samples'], 'sd.zoom': ['მასშტაბი', 'Zoom'], 'sd.noAuthor': ['სტუდია პარამეტრებში ჩაირთვება (ავტორის რეჟიმი).', 'Turn on author mode in Settings to use the Studio.']
});

PD.studio = (() => {
  const TH = PD.theory, LS = PD.lessons, h = PD.h, ic = PD.ic;
  const SCOL = ['', '#D9783F', '#78B7DE', '#EFE0B8'];
  let ST = null;

  function open(id, type) {
    if (!PD.store.get('author', false)) { PD.ui.toast(t('sd.noAuthor'), 3500); return null; }   // students never land in authoring tools
    if (ST) close(true);
    const src = id ? LS.get(id) : null;
    const l = src ? JSON.parse(JSON.stringify(src)) : LS.normalize({ id: 'u-' + Date.now().toString(36), user: true, type: type || 'melody', title: { ka: t('sd.new'), en: 'New lesson' }, bpm: 80, meter: [4, 4], events: [] });
    if (!l.events) l.events = [];
    const st = ST = { l, sel: new Set(), tool: 'select', grid: .5, fret: 0, ppb: 80, scroll: 0, cursor: 0, undo: [], redo: [], dirty: false, play: null, wave: null, keybuf: '', keyT: 0 };
    const bpb = () => LS.bpb(l), bps = () => l.bpm / 60;
    const byId = id => l.events.find(e => e.id === id);
    const selected = () => l.events.filter(e => st.sel.has(e.id));
    const snap = b => Math.round(b / st.grid) * st.grid;
    const endB = () => Math.max(bpb() * 4, Math.ceil((LS.end(l) + bpb()) / bpb()) * bpb());

    /* ---------- undo ---------- */
    const snapshot = () => JSON.stringify({ e: l.events, s: l.sections });
    function push() { st.undo.push(snapshot()); if (st.undo.length > 80) st.undo.shift(); st.redo = []; st.dirty = true; }
    function restore(s) { const o = JSON.parse(s); l.events = o.e; l.sections = o.s; st.sel.clear(); refresh(); }
    function undo() { if (!st.undo.length) return; st.redo.push(snapshot()); restore(st.undo.pop()); st.dirty = true; }
    function redo() { if (!st.redo.length) return; st.undo.push(snapshot()); restore(st.redo.pop()); st.dirty = true; }

    /* ---------- DOM ---------- */
    const root = h('div', { class: 'studio', role: 'application', 'aria-label': t('sd.title') });
    const titleIn = h('input', { class: 'input', style: 'min-width:140px;flex:1;max-width:340px', value: l.title.ka || '', 'aria-label': t('sd.titleKa'), oninput: e => { l.title.ka = e.target.value; st.dirty = true; } });
    const bPlay = h('button', { class: 'btn small', html: ic.play + '<span data-t="sd.preview"></span>', onclick: () => st.play ? stopPreview() : preview() });
    const top = h('div', { class: 'st-top' }, [
      h('button', { class: 'btn icon quiet', 'aria-label': t('close'), html: ic.back, onclick: () => close() }), h('b', { 'data-t': 'sd.title' }), titleIn,
      h('button', { class: 'btn small icon quiet', 'aria-label': t('sd.side'), title: t('sd.side'), html: ic.panel, onclick: () => side.classList.toggle('open') }),
      h('span', { class: 'spacer' }),
      h('button', { class: 'btn small', 'aria-label': t('sd.undo'), title: t('sd.undo') + ' (Ctrl+Z)', text: '↶', onclick: undo }), h('button', { class: 'btn small', 'aria-label': t('sd.redo'), title: t('sd.redo') + ' (Ctrl+Y)', text: '↷', onclick: redo }),
      bPlay, h('button', { class: 'btn small', 'data-t': 'sd.test', onclick: test }), h('button', { class: 'btn small', html: ic.mic + '<span data-t="sd.rec"></span>', onclick: recMic }),
      h('button', { class: 'btn small', html: ic.dl + '<span data-t="sd.export"></span>', onclick: () => PD.ui.download((l.id || 'lesson') + '.panduri.json', LS.toJSON(l)) }),
      h('button', { class: 'btn small', 'data-t': 'sd.import', onclick: importJSON }),
      h('button', { class: 'btn small', 'data-t': 'sd.instrument', onclick: () => PD.authorTools.instrument() }),
      h('button', { class: 'btn small', 'data-t': 'sd.curriculum', onclick: () => PD.authorTools.curriculum() }),
      h('button', { class: 'btn small', 'data-t': 'sd.samples', onclick: () => PD.authorTools.samples() }),
      h('button', { class: 'btn small primary', 'data-t': 'sd.save', onclick: save }),
      h('button', { class: 'btn small icon quiet', 'aria-label': t('sd.insp'), title: t('sd.insp'), html: ic.edit, onclick: () => insp.classList.toggle('open') })]);
    const side = h('aside', { class: 'st-side', 'aria-label': t('sd.side') });
    const insp = h('aside', { class: 'st-insp', 'aria-label': t('sd.insp') });
    const cv = h('canvas', { 'aria-label': 'grid', tabindex: '0' });
    const gridEl = h('div', { class: 'st-grid' }, [cv]);
    const toolSeg = h('div', { class: 'seg', role: 'group', 'aria-label': 'tool' }, [['select', 'sd.tSel'], ['note', 'sd.tNote'], ['erase', 'sd.tErase']].map(([k, key]) => h('button', { 'data-tool': k, 'data-t': key, onclick: () => { st.tool = k; syncTools(); } })));
    const gridSel = h('select', { class: 'input', 'aria-label': t('sd.grid'), style: 'min-height:36px', onchange: e => { st.grid = +e.target.value; draw(); } }, [[1, '♩ 1'], [.5, '♪ 1/2'], [1 / 3, '3 1/3'], [.25, '♬ 1/4']].map(([v, n]) => h('option', { value: String(v), text: n, selected: v === st.grid })));
    const fretIn = h('input', { class: 'input', type: 'number', min: '0', max: '17', value: '0', style: 'width:70px;min-height:36px', 'aria-label': t('sd.fretIn'), oninput: e => { st.fret = Math.max(0, Math.min(17, +e.target.value | 0)); } });
    const chords = PD.curriculum.chords();
    const chordSel = h('select', { class: 'input', style: 'min-height:36px', 'aria-label': t('sd.chordIns') }, chords.map(c => h('option', { value: c.id, text: c.name + ' ' + c.frets.join('-') })));
    const tools = h('div', { class: 'st-tools' }, [toolSeg, h('label', { class: 'row', style: 'gap:6px' }, [h('span', { class: 'muted', 'data-t': 'sd.grid' }), gridSel]), h('label', { class: 'row', style: 'gap:6px' }, [h('span', { class: 'muted', 'data-t': 'sd.fretIn' }), fretIn]),
      h('button', { class: 'btn small', 'data-t': 'sd.quant', onclick: quantize }), h('button', { class: 'btn small', 'data-t': 'sd.split', onclick: split }), h('button', { class: 'btn small', 'data-t': 'sd.dup', title: 'Ctrl+D', onclick: duplicate }),
      h('button', { class: 'btn small', text: '−1', title: 'fret −1', onclick: () => transpose(-1) }), h('button', { class: 'btn small', text: '+1', title: 'fret +1', onclick: () => transpose(1) }),
      h('button', { class: 'btn small', 'data-t': 'sd.del', onclick: del }),
      chordSel, h('button', { class: 'btn small', 'data-t': 'sd.chordIns', onclick: insertChord }),
      h('button', { class: 'btn small icon', 'aria-label': t('sd.zoom') + ' −', text: '−', onclick: () => zoom(1 / 1.25) }), h('button', { class: 'btn small icon', 'aria-label': t('sd.zoom') + ' +', text: '+', onclick: () => zoom(1.25) })]);
    const scrollIn = h('input', { type: 'range', min: '0', max: '100', value: '0', step: '.01', 'aria-label': 'scroll', style: 'flex:1', oninput: e => { st.scroll = +e.target.value; draw(); } });
    const foot = h('div', { class: 'st-foot' }, [h('span', { class: 'mono muted', id: 'sdStat', style: 'font-size:12px' }), h('span', { id: 'sdWarn', style: 'font-size:12px;color:var(--almost)' }), scrollIn]);
    const main = h('div', { class: 'st-main' }, [tools, gridEl, foot]);
    root.append(top, h('div', { class: 'st-body' }, [side, main, insp]));
    document.body.appendChild(root); document.body.style.overflow = 'hidden';
    // Back closes the studio (asking first when there are unsaved changes)
    const onBack = () => { if (ST !== st) return; if (st.dirty) { st.lid = PD.layers.push(onBack); PD.ui.confirm(t('sd.dirty'), () => { st.dirty = false; close(); }); } else close(); };
    st.lid = PD.layers.push(onBack);
    PD.i18n.apply(root);
    st.root = root;
    const ctx = cv.getContext('2d');
    let G = { W: 1, H: 1 };

    function syncTools() { toolSeg.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.tool === st.tool))); cv.style.cursor = st.tool === 'note' ? 'crosshair' : st.tool === 'erase' ? 'not-allowed' : 'default'; }

    /* ---------- side panel: meta, sections, reference ---------- */
    function sidePanel() {
      side.innerHTML = '';
      const fld = (k, el) => h('label', { class: 'field' }, [h('span', { 'data-t': k, text: t(k) }), el]);
      const inp = (v, on, attrs) => h('input', Object.assign({ class: 'input', value: v == null ? '' : String(v), oninput: e => { on(e.target.value); st.dirty = true; } }, attrs || {}));
      const sel = (v, opts, on) => h('select', { class: 'input', onchange: e => { on(e.target.value); st.dirty = true; refresh(); } }, opts.map(([k, n]) => h('option', { value: String(k), text: n, selected: String(k) === String(v) })));
      l.desc = l.desc || { ka: '', en: '' };
      side.append(h('b', { 'data-t': 'sd.meta', text: t('sd.meta') }),
        fld('sd.titleEn', inp(l.title.en, v => l.title.en = v)),
        fld('sd.descKa', h('textarea', { class: 'input', text: l.desc.ka || '', oninput: e => { l.desc.ka = e.target.value; st.dirty = true; } })),
        fld('sd.descEn', h('textarea', { class: 'input', text: l.desc.en || '', oninput: e => { l.desc.en = e.target.value; st.dirty = true; } })),
        h('div', { class: 'fs2' }, [fld('sd.type', sel(l.type, ['song', 'melody', 'solo', 'exercise'].map(k => [k, t('type.' + k)]), v => l.type = v)), fld('sd.level', sel(l.level || 1, [1, 2, 3, 4].map(k => [k, t('lvl.' + k)]), v => l.level = +v))]),
        h('div', { class: 'fs2' }, [fld('sd.bpm', inp(l.bpm, v => { l.bpm = Math.max(20, Math.min(300, +v || 80)); }, { type: 'number', min: '20', max: '300' })), fld('sd.meter', sel(l.meter.join('/'), [['2/4', '2/4'], ['3/4', '3/4'], ['4/4', '4/4'], ['6/8', '6/8']], v => { push(); l.meter = v.split('/').map(Number); }))]),
        fld('sd.link', inp(l.link, v => l.link = v.trim() || undefined, { type: 'url', placeholder: 'https://' })));
      // sections
      const secBox = h('div', { style: 'display:flex;flex-direction:column;gap:8px' });
      l.sections.forEach((sc, i) => {
        const bar = b => Math.round(b / bpb() * 100) / 100 + 1;
        secBox.appendChild(h('div', { class: 'card', style: 'padding:10px;display:flex;flex-direction:column;gap:6px' }, [
          inp(sc.name.ka, v => sc.name.ka = v, { 'aria-label': t('sd.titleKa') }), inp(sc.name.en, v => sc.name.en = v, { 'aria-label': t('sd.titleEn') }),
          h('div', { class: 'row', style: 'gap:6px' }, [h('span', { class: 'muted', text: t('sd.from') }), inp(bar(sc.from), v => { sc.from = (Math.max(1, +v || 1) - 1) * bpb(); draw(); }, { type: 'number', min: '1', step: '1', style: 'width:64px' }), h('span', { class: 'muted', text: t('sd.to') }), inp(bar(sc.to) - 1, v => { sc.to = Math.max(sc.from / bpb() + 1, +v || 1) * bpb(); draw(); }, { type: 'number', min: '1', step: '1', style: 'width:64px' }),
            h('button', { class: 'btn small icon quiet', 'aria-label': t('delete'), html: ic.close, onclick: () => { push(); l.sections.splice(i, 1); sidePanel(); draw(); } })])]));
      });
      side.append(h('b', { 'data-t': 'sd.sections', text: t('sd.sections') }), secBox, h('div', { class: 'row' }, [
        h('button', { class: 'btn small', text: t('sd.secAdd'), onclick: () => { const s = selected(); if (!s.length) return; push(); const a = Math.floor(Math.min(...s.map(e => e.t)) / bpb()) * bpb(), b = Math.ceil(Math.max(...s.map(e => e.t + e.d)) / bpb()) * bpb(); l.sections.push({ id: 's' + Date.now().toString(36), name: { ka: 'ფრაზა ' + (l.sections.length + 1), en: 'Phrase ' + (l.sections.length + 1) }, from: a, to: b }); l.sections.sort((x, y) => x.from - y.from); sidePanel(); draw(); } }),
        h('button', { class: 'btn small', text: t('sd.secAuto'), onclick: () => { push(); l.sections = LS.autoSections(l); sidePanel(); draw(); } })]));
      // reference audio
      const refBox = h('div', { style: 'display:flex;flex-direction:column;gap:8px' }, [h('b', { text: t('sd.ref') }), h('p', { class: 'muted', style: 'font-size:12px', text: t('sd.refNote') })]);
      refBox.append(h('div', { class: 'row' }, [h('button', { class: 'btn small', text: t('sd.refLoad'), onclick: async () => {
        const f = await PD.ui.pickFile('audio/*'); if (!f) return;
        const bid = 'ref-' + l.id; await PD.blobs.put(bid, f); l.refAudio = bid; l.refOffset = l.refOffset || 0; st.dirty = true; loadWave(); sidePanel();
      } }), l.refAudio ? h('button', { class: 'btn small', text: t('sd.refDel'), onclick: () => { PD.blobs.del(l.refAudio); l.refAudio = undefined; st.wave = null; st.dirty = true; sidePanel(); draw(); } }) : null]));
      if (l.refAudio) refBox.append(fld('sd.refOff', inp(l.refOffset || 0, v => { l.refOffset = +v || 0; draw(); }, { type: 'number', step: '.01' })));
      // learning stages chosen by the author
      const STG = LS.STAGES, cur = LS.stagesOf(l);
      const stBox = h('div', { style: 'display:flex;flex-direction:column;gap:4px' }, STG.map(k => { const c = h('input', { type: 'checkbox' }); c.checked = cur.includes(k); c.onchange = () => { const set = new Set(LS.stagesOf(l)); c.checked ? set.add(k) : set.delete(k); l.stages = STG.filter(x => set.has(x)); st.dirty = true; }; return h('label', { class: 'row', style: 'gap:8px;font-size:13px' }, [c, h('span', { text: t('st.' + k) })]); }));
      l.intro = l.intro || { ka: '', en: '' };
      const tq = l.technique || {};
      const techSel = h('select', { class: 'input', onchange: e => { const v = e.target.value; if (!v) delete l.technique; else if (v === 'rhythm') l.technique = { kind: 'rhythm' }; else { const sc = l.sections.find(x => x.id === v); l.technique = { kind: 'section', from: sc.from, to: sc.to, id: sc.id }; } st.dirty = true; } },
        [h('option', { value: '', text: '—' }), h('option', { value: 'rhythm', text: t('sd.techRhythm'), selected: tq.kind === 'rhythm' }), ...l.sections.map(sc => h('option', { value: sc.id, text: t('sd.techSection') + ': ' + PD.i18n.pick(sc.name), selected: tq.id === sc.id }))]);
      const ver = h('input', { type: 'checkbox' }); ver.checked = !l.demo; ver.onchange = () => { l.demo = !ver.checked; st.dirty = true; };
      side.append(h('b', { text: t('sd.stages') }), h('p', { class: 'muted', style: 'font-size:12px', text: t('sd.stagesD') }), stBox,
        fld('sd.intro', h('textarea', { class: 'input', text: l.intro.ka || '', oninput: e => { l.intro.ka = e.target.value; st.dirty = true; } })),
        fld('sd.introEn', h('textarea', { class: 'input', text: l.intro.en || '', oninput: e => { l.intro.en = e.target.value; st.dirty = true; } })),
        fld('sd.techIso', techSel),
        h('label', { class: 'row', style: 'gap:8px' }, [ver, h('span', { text: t('sd.verified') })]), h('p', { class: 'muted', style: 'font-size:12px', text: t('sd.verifiedD') }));
      // teacher video per camera angle
      l.media = l.media || [];
      const mBox = h('div', { style: 'display:flex;flex-direction:column;gap:8px' }, [h('b', { text: t('sd.media') })]);
      l.media.forEach((m, i) => mBox.appendChild(h('div', { class: 'card', style: 'padding:8px;display:flex;flex-direction:column;gap:6px' }, [
        h('div', { class: 'row', style: 'gap:6px' }, [h('select', { class: 'input', style: 'min-height:34px', onchange: e => { m.angle = e.target.value; st.dirty = true; } }, PD.media.ANGLES.map(a => h('option', { value: a, text: t('mv.' + a), selected: m.angle === a }))), h('span', { class: 'muted', style: 'font-size:11px;overflow:hidden;text-overflow:ellipsis;max-width:110px', text: m.name || m.url || '' }), h('button', { class: 'btn small icon quiet', 'aria-label': t('delete'), html: ic.close, onclick: () => { if (m.blobId) PD.blobs.del(m.blobId); l.media.splice(i, 1); st.dirty = true; sidePanel(); } })]),
        fld('sd.mediaOff', inp(m.offset || 0, v => { m.offset = +v || 0; }, { type: 'number', step: '.01' }))])));
      const urlIn = h('input', { class: 'input', type: 'url', placeholder: 'https://…/video.mp4', 'aria-label': t('sd.mediaUrl') });
      mBox.append(h('div', { class: 'row' }, [h('button', { class: 'btn small', text: t('sd.mediaAdd'), onclick: async () => { const f = await PD.ui.pickFile('video/*'); if (!f) return; const bid = 'video:' + l.id + ':' + Date.now().toString(36); await PD.blobs.put(bid, f); l.media.push({ id: bid, angle: PD.media.ANGLES[Math.min(3, l.media.length)], blobId: bid, name: f.name, offset: 0 }); st.dirty = true; sidePanel(); } })]),
        h('div', { class: 'row', style: 'gap:6px;flex-wrap:nowrap' }, [urlIn, h('button', { class: 'btn small', text: '+', onclick: () => { const u = urlIn.value.trim(); if (!/^https?:\/\//.test(u)) return; l.media.push({ id: 'url:' + Date.now().toString(36), angle: 'front', url: u, offset: 0 }); st.dirty = true; sidePanel(); } })]));
      side.append(mBox);
      side.append(refBox, h('button', { class: 'btn small', style: 'color:var(--fix)', text: t('sd.delete'), onclick: () => PD.ui.confirm(t('sd.delete') + '?', () => { LS.remove(l.id); st.dirty = false; close(); }) }));
    }

    /* ---------- waveform ---------- */
    async function loadWave() {
      st.wave = null; if (!l.refAudio) return draw();
      try {
        const b = await PD.blobs.get(l.refAudio); if (!b) return;
        const ac = PD.audio.ensure() || PD.audio.ctx; const buf = await ac.decodeAudioData(await b.arrayBuffer());
        const ch = buf.getChannelData(0), rate = 200, n = Math.ceil(buf.duration * rate), step = buf.sampleRate / rate, pk = new Float32Array(n);
        for (let i = 0; i < n; i++) { let m = 0; const a = Math.floor(i * step), z = Math.min(ch.length, Math.floor((i + 1) * step)); for (let j = a; j < z; j += 4) { const v = Math.abs(ch[j]); if (v > m) m = v; } pk[i] = m; }
        st.wave = { pk, rate, dur: buf.duration }; draw();
      } catch (e) { st.wave = null; PD.ui.toast('audio: ' + (e && e.message || 'decode failed')); }
    }

    /* ---------- grid geometry + drawing ---------- */
    function layout() {
      const r = cv.getBoundingClientRect(); if (r.width < 2) return false;
      const d = Math.min(2, devicePixelRatio || 1); cv.width = r.width * d; cv.height = r.height * d; ctx.setTransform(d, 0, 0, d, 0, 0);
      G = { W: r.width, H: r.height, x0: 44, ruler: 22, wave: st.wave || l.refAudio ? 54 : 0 };
      G.secY = G.ruler + G.wave; G.top = G.secY + 18; G.laneH = Math.max(40, (G.H - G.top - 6) / 3);
      return true;
    }
    const X = b => G.x0 + (b - viewStart()) * st.ppb;
    const B = x => (x - G.x0) / st.ppb + viewStart();
    const laneY = s => G.top + (3 - s) * G.laneH;   // E (3) on top, A (1) at the bottom — player view
    const sAt = y => Math.max(1, Math.min(3, 3 - Math.floor((y - G.top) / G.laneH)));
    function viewStart() { const vis = (G.W - G.x0) / st.ppb, max = Math.max(0, endB() - vis + 1); return st.scroll / 100 * max; }
    function evRect(e) { const x = X(e.t), w = Math.max(10, e.d * st.ppb - 2); return { x, y: laneY(e.s) + 5, w, h: G.laneH - 10 }; }
    function draw() {
      if (!layout()) return;
      const W = G.W, H = G.H, vs = viewStart(), ve = B(W);
      ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#0F0D0B'; ctx.fillRect(0, 0, W, H);
      // lanes
      [1, 2, 3].forEach(s => { const y = laneY(s); ctx.fillStyle = s === 2 ? '#141210' : '#121009'; ctx.fillRect(G.x0, y, W - G.x0, G.laneH); ctx.fillStyle = SCOL[s]; ctx.font = '600 13px IBM Plex Mono'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(TH.stringName(s), G.x0 / 2, y + G.laneH / 2); ctx.globalAlpha = .25; ctx.fillRect(G.x0, y + G.laneH / 2, W - G.x0, 1); ctx.globalAlpha = 1; });
      // grid lines + ruler
      for (let b = Math.floor(vs / st.grid) * st.grid; b <= ve; b += st.grid) {
        const x = X(b); if (x < G.x0) continue; const bar = Math.abs(b / bpb() - Math.round(b / bpb())) < 1e-6, beat = Math.abs(b - Math.round(b)) < 1e-6;
        ctx.fillStyle = bar ? 'rgba(242,232,218,.28)' : beat ? 'rgba(242,232,218,.12)' : 'rgba(242,232,218,.05)'; ctx.fillRect(x, G.ruler, 1, H - G.ruler);
        if (bar) { ctx.fillStyle = 'rgba(242,232,218,.6)'; ctx.font = '11px IBM Plex Mono'; ctx.textAlign = 'left'; ctx.fillText(String(Math.round(b / bpb()) + 1), x + 3, 11); }
      }
      // waveform
      if (G.wave) {
        ctx.fillStyle = '#0B0A09'; ctx.fillRect(G.x0, G.ruler, W - G.x0, G.wave);
        if (st.wave) { const mid = G.ruler + G.wave / 2; ctx.fillStyle = 'rgba(214,161,90,.65)'; for (let x = G.x0; x < W; x++) { const sec = B(x) / bps() + (l.refOffset || 0), i = Math.floor(sec * st.wave.rate); if (i < 0 || i >= st.wave.pk.length) continue; const v = st.wave.pk[i] * (G.wave / 2 - 2); ctx.fillRect(x, mid - v, 1, v * 2 + 1); } }
      }
      // sections
      l.sections.forEach((sc, i) => { const a = Math.max(G.x0, X(sc.from)), b = X(sc.to); if (b < G.x0) return; ctx.fillStyle = i % 2 ? 'rgba(120,183,222,.18)' : 'rgba(214,161,90,.18)'; ctx.fillRect(a, G.secY + 2, b - a - 2, 14); ctx.fillStyle = 'rgba(242,232,218,.8)'; ctx.font = '11px Noto Sans Georgian'; ctx.textAlign = 'left'; ctx.fillText(PD.i18n.pick(sc.name), a + 4, G.secY + 9); });
      // chord connectors
      const groups = {}; l.events.forEach(e => { if (e.chordId) (groups[e.chordId] = groups[e.chordId] || []).push(e); });
      Object.values(groups).forEach(g => { const x = X(Math.min(...g.map(e => e.t))) + 3, ys = g.map(e => laneY(e.s) + G.laneH / 2); ctx.fillStyle = 'rgba(214,161,90,.5)'; ctx.fillRect(x - 1.5, Math.min(...ys), 3, Math.max(...ys) - Math.min(...ys)); ctx.fillStyle = '#D6A15A'; ctx.font = '600 11px IBM Plex Mono'; ctx.textAlign = 'left'; ctx.fillText(g[0].chord || '', x + 4, laneY(3) - 0 + 2 > G.top ? laneY(3) + 2 : G.top); });
      // events
      l.events.forEach(e => {
        const r = evRect(e); if (r.x + r.w < G.x0 || r.x > W) return;
        const on = st.sel.has(e.id);
        ctx.fillStyle = on ? SCOL[e.s] : 'rgba(30,26,22,.95)'; ctx.strokeStyle = SCOL[e.s]; ctx.lineWidth = on ? 2 : 1.4;
        ctx.beginPath(); ctx.roundRect ? ctx.roundRect(r.x, r.y, r.w, r.h, 6) : ctx.rect(r.x, r.y, r.w, r.h); ctx.fill(); ctx.stroke();
        ctx.fillStyle = on ? '#140D08' : '#F2E8DA'; ctx.font = '600 ' + Math.min(18, r.h * .45) + 'px IBM Plex Mono'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
        ctx.fillText(String(e.f), r.x + 6, r.y + r.h / 2);
        ctx.font = '10px IBM Plex Mono'; const meta = (e.f ? '·' + (e.fi || '?') : '') + (e.st === 'up' ? ' ↑' : ' ↓') + (e.acc ? ' >' : '') + (e.hint ? ' ✎' : '');
        if (r.w > 40) ctx.fillText(meta, r.x + 6 + (e.f > 9 ? 22 : 13), r.y + r.h / 2 + 1);
        if (e.f && !e.fi) { ctx.fillStyle = '#E9C46A'; ctx.beginPath(); ctx.arc(r.x + r.w - 6, r.y + 6, 3, 0, 7); ctx.fill(); }
      });
      // cursor + playhead + marquee
      const cx = X(st.cursor); if (cx >= G.x0) { ctx.fillStyle = '#78B7DE'; ctx.fillRect(cx - 1, G.ruler, 2, H - G.ruler); }
      if (st.play) { const px = X(st.play.beat); ctx.fillStyle = '#F2E8DA'; ctx.fillRect(px - 1, 0, 2, H); }
      if (drag && drag.kind === 'marquee') { ctx.strokeStyle = '#D6A15A'; ctx.setLineDash([4, 3]); ctx.strokeRect(drag.x0, drag.y0, drag.x - drag.x0, drag.y - drag.y0); ctx.setLineDash([]); }
      status();
    }
    function status() {
      const fi = l.events.filter(e => e.f > 0 && !e.fi).length;
      const dupN = l.events.filter((e, i) => l.events.some((o, j) => j < i && o.s === e.s && Math.abs(o.t - e.t) < 1e-6)).length;
      const se = $('sdStat'); if (se) se.textContent = t('sd.stat', { n: l.events.length, b: Math.ceil(LS.end(l) / bpb()), c: (Math.floor(st.cursor / bpb()) + 1) + ':' + (Math.round((st.cursor % bpb()) * 100) / 100 + 1) }) + (st.sel.size ? ' · ' + t('sd.n', { n: st.sel.size }) : '');
      const we = $('sdWarn'); if (we) we.textContent = [fi ? '⚠ ' + t('sd.warnFi', { n: fi }) : '', dupN ? '⚠ ' + t('sd.warnDup', { n: dupN }) : ''].filter(Boolean).join(' · ');
    }
    const $ = PD.$;

    /* ---------- pointer interaction ---------- */
    let drag = null;
    function hitEvent(x, y) { for (let i = l.events.length - 1; i >= 0; i--) { const e = l.events[i], r = evRect(e); if (x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h) return { e, edge: x > r.x + r.w - 8 && r.w > 18 }; } return null; }
    function withChord(ids) { const out = new Set(ids); l.events.forEach(e => { if (e.chordId && [...ids].some(id => { const o = byId(id); return o && o.chordId === e.chordId; })) out.add(e.id); }); return out; }
    cv.addEventListener('pointerdown', e => {
      cv.focus(); const r = cv.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      if (y < G.top) { st.cursor = Math.max(0, snap(B(x))); draw(); return; }
      const hit = hitEvent(x, y);
      if (st.tool === 'erase') { if (hit) { push(); const ids = withChord([hit.e.id]); l.events = l.events.filter(ev => !ids.has(ev.id)); st.sel.clear(); refresh(); } return; }
      if (st.tool === 'note' && !hit) {
        push(); const b = Math.max(0, snap(B(x))), s = sAt(y);
        const ev = { id: LS.newId(), t: b, d: st.grid, s, f: st.fret, fi: st.fret ? Math.min(4, Math.max(1, st.fret)) : 0, st: Math.abs(b - Math.round(b)) < 1e-6 ? 'down' : 'up', acc: Math.abs(b % bpb()) < 1e-6, technique: 'pluck' };
        if (st.fret > 4) ev.fi = 1;
        l.events.push(ev); l.events.sort((a, c) => a.t - c.t || a.s - c.s); st.sel = new Set([ev.id]); st.cursor = b + st.grid;
        PD.audio.ensure(); PD.audio.note(s, ev.f, { vel: .6 }); refresh(); return;
      }
      if (hit) {
        if (e.shiftKey || e.metaKey || e.ctrlKey) { if (st.sel.has(hit.e.id)) st.sel.delete(hit.e.id); else st.sel = withChord([...st.sel, hit.e.id]); }
        else if (!st.sel.has(hit.e.id)) st.sel = withChord([hit.e.id]);
        PD.audio.ensure(); PD.audio.note(hit.e.s, hit.e.f, { vel: .5 });
        drag = { kind: hit.edge ? 'resize' : 'move', bx: B(x), s0: hit.e.s, orig: selected().map(ev => ({ id: ev.id, t: ev.t, s: ev.s, d: ev.d })), pushed: false };
      } else { if (!e.shiftKey) st.sel.clear(); st.cursor = Math.max(0, snap(B(x))); drag = { kind: 'marquee', x0: x, y0: y, x, y }; }
      cv.setPointerCapture(e.pointerId); refresh(true);
    });
    cv.addEventListener('pointermove', e => {
      if (!drag) return; const r = cv.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      if (drag.kind === 'marquee') { drag.x = x; drag.y = y; const a = Math.min(drag.x0, x), b = Math.max(drag.x0, x), c = Math.min(drag.y0, y), d = Math.max(drag.y0, y); l.events.forEach(ev => { const q = evRect(ev); if (q.x < b && q.x + q.w > a && q.y < d && q.y + q.h > c) st.sel.add(ev.id); }); draw(); return; }
      const db = snap(B(x) - drag.bx);
      if (!drag.pushed && (Math.abs(db) > 0 || drag.kind === 'move' && sAt(y) !== drag.s0)) { push(); drag.pushed = true; }
      if (!drag.pushed) return;
      if (drag.kind === 'move') {
        const single = drag.orig.length === 1, ds = single ? sAt(y) - drag.s0 : 0;
        drag.orig.forEach(o => { const ev = byId(o.id); ev.t = Math.max(0, o.t + db); if (single) ev.s = Math.max(1, Math.min(3, o.s + ds)); });
      } else drag.orig.forEach(o => { const ev = byId(o.id); ev.d = Math.max(st.grid, o.d + db); });
      draw();
    });
    cv.addEventListener('pointerup', () => { if (drag && drag.pushed) l.events.sort((a, c) => a.t - c.t || a.s - c.s); drag = null; refresh(); });
    cv.addEventListener('wheel', e => { e.preventDefault(); if (e.ctrlKey) zoom(Math.exp(-e.deltaY * .003)); else { const vis = (G.W - G.x0) / st.ppb, max = Math.max(1, endB() - vis + 1); st.scroll = Math.max(0, Math.min(100, st.scroll + (e.deltaX || e.deltaY) / st.ppb / max * 100)); scrollIn.value = String(st.scroll); draw(); } }, { passive: false });
    function zoom(k) { st.ppb = Math.max(20, Math.min(320, st.ppb * k)); draw(); }

    /* ---------- edit operations ---------- */
    function targetEvents() { const s = selected(); return s.length ? s : l.events; }
    function quantize() { push(); targetEvents().forEach(e => { e.t = Math.max(0, snap(e.t)); e.d = Math.max(st.grid, snap(e.d)); }); l.events.sort((a, b) => a.t - b.t || a.s - b.s); refresh(); }
    function split() { const s = selected().filter(e => e.d >= 2 * st.grid - 1e-6); if (!s.length) return; push(); s.forEach(e => { const half = snap(e.d / 2) || st.grid, n = Object.assign({}, e, { id: LS.newId(), t: e.t + half, d: e.d - half, acc: false, hint: undefined }); if (e.chordId) n.chordId = e.chordId + '_b'; e.d = half; l.events.push(n); }); l.events.sort((a, b) => a.t - b.t || a.s - b.s); refresh(); }
    function duplicate() {
      const s = selected(); if (!s.length) return; push();
      const a = Math.min(...s.map(e => e.t)), b = Math.max(...s.map(e => e.t + e.d)), off = Math.ceil((b - a) / st.grid - 1e-6) * st.grid, map = {}, ids = new Set();
      s.forEach(e => { const n = Object.assign({}, e, { id: LS.newId(), t: e.t + off }); if (e.chordId) n.chordId = map[e.chordId] || (map[e.chordId] = LS.newChordId()); l.events.push(n); ids.add(n.id); });
      l.events.sort((x, y) => x.t - y.t || x.s - y.s); st.sel = ids; st.cursor = b + off - (b - a) + (b - a); refresh();
    }
    function transpose(k) { const s = selected(); if (!s.length) return; push(); s.forEach(e => { e.f = Math.max(0, Math.min(17, e.f + k)); if (!e.f) e.fi = 0; }); refresh(); }
    function del() { if (!st.sel.size) return; push(); l.events = l.events.filter(e => !st.sel.has(e.id)); st.sel.clear(); refresh(); }
    function insertChord() {
      const c = chords.find(x => x.id === chordSel.value); if (!c) return; push();
      const cid = LS.newChordId(), b = st.cursor, ids = new Set();
      [1, 2, 3].forEach(s => { const ev = { id: LS.newId(), t: b, d: Math.max(st.grid, 1), s, f: c.frets[s - 1], fi: c.fingers[s - 1], st: 'down', acc: Math.abs(b % bpb()) < 1e-6, chordId: cid, chord: c.name, technique: 'strum' }; l.events.push(ev); ids.add(ev.id); });
      l.events.sort((x, y) => x.t - y.t || x.s - y.s); st.sel = ids; st.cursor = b + Math.max(st.grid, 1);
      PD.audio.ensure(); PD.audio.strum(c.frets, 'down'); refresh();
    }
    function group() { const s = selected(); if (s.length < 2) return; push(); const cid = LS.newChordId(), t0 = Math.min(...s.map(e => e.t)), name = s.find(e => e.chord) ? s.find(e => e.chord).chord : ''; s.forEach(e => { e.chordId = cid; e.t = t0; e.chord = name; e.technique = 'strum'; }); refresh(); }
    function ungroup() { const s = selected(); if (!s.length) return; push(); s.forEach(e => { delete e.chordId; delete e.chord; e.technique = 'pluck'; }); refresh(); }
    /** finger suggestion: one finger per fret from the hand anchor (a heuristic — the author decides) */
    function autoFingers() {
      const s = selected().length ? selected() : l.events; push(); let anchor = 1;
      s.slice().sort((a, b) => a.t - b.t).forEach(e => { if (!e.f) { e.fi = 0; return; } if (e.hand) anchor = e.hand; else if (e.f < anchor || e.f > anchor + 3) anchor = Math.max(1, e.f > anchor + 3 ? e.f - 3 : e.f); e.fi = Math.min(4, Math.max(1, e.f - anchor + 1)); });
      refresh();
    }

    /* ---------- inspector ---------- */
    function inspector() {
      insp.innerHTML = '';
      const s = selected();
      insp.append(h('b', { text: t('sd.insp') }));
      if (!s.length) { insp.append(h('p', { class: 'muted', style: 'font-size:13px', text: t('sd.none') })); return; }
      insp.append(h('span', { class: 'muted', text: t('sd.n', { n: s.length }) }));
      const common = k => { const v = s[0][k]; return s.every(e => (e[k] == null ? '' : JSON.stringify(e[k])) === (v == null ? '' : JSON.stringify(v))) ? v : undefined; };
      const set = (k, fn) => v => { push(); s.forEach(e => fn ? fn(e, v) : (e[k] = v)); l.events.sort((a, b) => a.t - b.t || a.s - b.s); draw(); status(); };
      const fld = (key, el) => h('label', { class: 'field' }, [h('span', { text: t(key) }), el]);
      const num = (k, min, max, step, apply) => { const v = common(k); return h('input', { class: 'input', type: 'number', min: String(min), max: String(max), step: String(step), value: v == null ? '' : String(v), placeholder: v === undefined ? t('sd.mixed') : '', onchange: e => { if (e.target.value === '') return; set(k, apply)(Math.max(min, Math.min(max, +e.target.value))); } }); };
      const choice = (k, opts, apply) => { const v = common(k); return h('div', { class: 'seg', role: 'group' }, opts.map(([val, label]) => h('button', { 'aria-pressed': String(v === val), text: label, onclick: () => { set(k, apply)(val); inspector(); } }))); };
      if (s.length === 1 || new Set(s.map(e => e.s)).size === 1) insp.append(fld('sd.string', choice('s', [[3, TH.stringName(3)], [2, TH.stringName(2)], [1, TH.stringName(1)]])));
      insp.append(h('div', { class: 'fs2' }, [fld('sd.fret', num('f', 0, 17, 1, (e, v) => { e.f = v; if (!v) e.fi = 0; })), fld('sd.finger', num('fi', 0, 4, 1))]),
        h('div', { class: 'fs2' }, [fld('sd.time', num('t', 0, 9999, st.grid)), fld('sd.dur', num('d', .125, 64, st.grid))]),
        fld('sd.stroke', choice('st', [['down', '↓ ' + t('w.down')], ['up', '↑ ' + t('w.up')]])),
        fld('sd.acc', choice('acc', [[true, t('on')], [false, t('off')]])),
        fld('sd.tech', choice('technique', [['pluck', t('sd.pluck')], ['strum', t('sd.strum')]])),
        h('div', { class: 'fs2' }, [fld('sd.hand', num('hand', 1, 17, 1)), fld('sd.diff', num('diff', 1, 4, 1))]));
      const n0 = s[0], m = TH.midi(n0.s, n0.f);
      if (s.length === 1) insp.append(h('p', { class: 'mono muted', style: 'font-size:12px', text: TH.name(m) + ' · ' + TH.nameKa(m) + ' · ' + TH.freq(m).toFixed(1) + ' Hz' + (TH.positions(m).length > 1 ? ' · ' + TH.positions(m).map(p => TH.stringName(p.s) + p.f).join('/') : '') }));
      if (s.some(e => e.chordId)) insp.append(fld('sd.chordName', h('input', { class: 'input', value: common('chord') || '', onchange: e => set('chord')(e.target.value.trim()) })));
      const hint = common('hint') || {};
      insp.append(fld('sd.hintKa', h('textarea', { class: 'input', text: hint.ka || '', onchange: e => set('hint', (ev, v) => { ev.hint = Object.assign({}, ev.hint, { ka: v }); if (!ev.hint.ka && !ev.hint.en) delete ev.hint; })(e.target.value) })),
        fld('sd.hintEn', h('textarea', { class: 'input', text: hint.en || '', onchange: e => set('hint', (ev, v) => { ev.hint = Object.assign({}, ev.hint, { en: v }); if (!ev.hint.ka && !ev.hint.en) delete ev.hint; })(e.target.value) })),
        h('div', { class: 'row' }, [h('button', { class: 'btn small', text: t('sd.group'), onclick: group }), h('button', { class: 'btn small', text: t('sd.ungroup'), onclick: ungroup }), h('button', { class: 'btn small', text: t('sd.autoFi'), onclick: autoFingers }), h('button', { class: 'btn small', style: 'color:var(--fix)', text: t('sd.del'), onclick: del })]));
    }
    function refresh() { draw(); inspector(); }

    /* ---------- preview (look-ahead scheduler, independent of rendering) ---------- */
    function preview() {
      const ac = PD.audio.ensure(); if (!ac) return;
      const t0 = PD.audio.now() + .12, from = st.cursor, queue = LS.steps(l).filter(s => s.t >= from - 1e-6);
      st.play = { t0, from, beat: from, queue, i: 0, el: null };
      if (l.refAudio) PD.blobs.get(l.refAudio).then(b => { if (!b || !st.play) return; const u = URL.createObjectURL(b), a = new Audio(u); a.volume = Math.min(1, PD.audio.vol.ref); a.currentTime = Math.max(0, from / bps() + (l.refOffset || 0)); a.play().catch(() => {}); st.play.el = a; st.play.url = u; });
      st.play.iv = setInterval(() => {
        const p = st.play; if (!p) return; const now = PD.audio.now();
        while (p.i < p.queue.length) { const s = p.queue[p.i], when = p.t0 + (s.t - p.from) / bps(); if (when > now + .2) break; if (s.kind === 'note') PD.audio.note(s.notes[0].s, s.notes[0].f, { when, vel: s.acc ? .85 : .65 }); else PD.audio.strum(s.frets, s.st, { when, vel: s.acc ? .9 : .7 }); p.i++; }
        p.beat = p.from + (now - p.t0) * bps();
        if (p.i >= p.queue.length && p.beat > LS.end(l) + .5) stopPreview();
      }, 25);
      const loop = () => { if (!st.play) return; draw(); st.play.raf = requestAnimationFrame(loop); }; loop();
      bPlay.innerHTML = ic.pause + '<span>' + PD.esc(t('sd.stop')) + '</span>';
    }
    function stopPreview() { const p = st.play; if (!p) return; clearInterval(p.iv); cancelAnimationFrame(p.raf); if (p.el) p.el.pause(); if (p.url) URL.revokeObjectURL(p.url); st.play = null; bPlay.innerHTML = ic.play + '<span>' + PD.esc(t('sd.preview')) + '</span>'; draw(); }

    /* ---------- save / test / record / import ---------- */
    function save(silent) {
      l.title.ka = titleIn.value.trim() || l.title.en || t('sd.new'); if (!l.title.en) l.title.en = l.title.ka;
      if (!l.sections.length) l.sections = LS.autoSections(l);
      LS.add(JSON.parse(JSON.stringify(Object.assign({}, l, { user: true }))));
      st.dirty = false; if (silent !== true) PD.ui.toast(t('sd.saved'));
      return LS.get(l.id);
    }
    function test() { const L = save(true); if (!L || !L.events.length) return PD.ui.toast(t('les.noNotes')); close(true); PD.practice.open(L, { wait: true, tempo: .8, mode: 'learn' }, L.id, null); }
    function recMic() { const L = save(true); close(true); PD.app.go('lesson', L.id); PD.practice.record(L); }
    async function importJSON() {
      const f = await PD.ui.pickFile('.json,application/json'); if (!f) return;
      try { const n = LS.fromJSON(await f.text()); const go = () => { push(); Object.keys(l).forEach(k => delete l[k]); Object.assign(l, n); titleIn.value = l.title.ka || ''; st.sel.clear(); sidePanel(); loadWave(); refresh(); PD.ui.toast(t('toast.imported')); };
        if (l.events.length) PD.ui.confirm(t('sd.dirty'), go); else go(); }
      catch (e) { PD.ui.toast(t('sd.importBad'), 4000); }
    }

    /* ---------- keyboard ---------- */
    function onKey(e) {
      if (ST !== st || document.querySelector('.sheet-back')) return;
      if (/INPUT|TEXTAREA|SELECT/.test((e.target && e.target.tagName) || '')) return;
      const k = e.key, mod = e.ctrlKey || e.metaKey;
      if (mod && (k === 'z' || k === 'Z')) { e.preventDefault(); e.shiftKey ? redo() : undo(); }
      else if (mod && (k === 'y' || k === 'Y')) { e.preventDefault(); redo(); }
      else if (mod && (k === 'd' || k === 'D')) { e.preventDefault(); duplicate(); }
      else if (mod && (k === 'a' || k === 'A')) { e.preventDefault(); st.sel = new Set(l.events.map(x => x.id)); refresh(); }
      else if (mod && (k === 's' || k === 'S')) { e.preventDefault(); save(); }
      else if (k === 'Delete' || k === 'Backspace') { e.preventDefault(); del(); }
      else if (k === ' ') { e.preventDefault(); st.play ? stopPreview() : preview(); }
      else if (k === 'Escape') { if (st.sel.size) { st.sel.clear(); refresh(); } else close(); }
      else if (k === 'ArrowLeft' || k === 'ArrowRight') { e.preventDefault(); const d = (k === 'ArrowLeft' ? -1 : 1) * st.grid; if (st.sel.size) { push(); selected().forEach(x => { x.t = Math.max(0, x.t + d); }); l.events.sort((a, b) => a.t - b.t || a.s - b.s); refresh(); } else { st.cursor = Math.max(0, st.cursor + d); draw(); } }
      else if ((k === 'ArrowUp' || k === 'ArrowDown') && st.sel.size) { e.preventDefault(); push(); selected().forEach(x => { x.s = Math.max(1, Math.min(3, x.s + (k === 'ArrowUp' ? 1 : -1))); }); refresh(); }
      else if (/^[0-9]$/.test(k) && st.sel.size) { const now = performance.now(); st.keybuf = now - st.keyT < 700 ? (st.keybuf + k).slice(-2) : k; st.keyT = now; const v = Math.min(17, +st.keybuf); push(); selected().forEach(x => { x.f = v; if (!v) x.fi = 0; }); refresh(); }
      else if (k === 'n' || k === 'N') { st.tool = 'note'; syncTools(); } else if (k === 'v' || k === 'V') { st.tool = 'select'; syncTools(); } else if (k === 'e' || k === 'E') { st.tool = 'erase'; syncTools(); }
    }
    document.addEventListener('keydown', onKey);
    const ro = new ResizeObserver(() => draw()); ro.observe(cv);
    st.cleanup = () => { stopPreview(); document.removeEventListener('keydown', onKey); ro.disconnect(); };
    st.close = close;
    syncTools(); sidePanel(); loadWave(); refresh();
    return st;
  }
  function close(force) {
    const st = ST; if (!st) return;
    const doIt = () => { st.cleanup(); st.root.remove(); document.body.style.overflow = ''; ST = null; PD.layers.done(st.lid); if (force !== true && PD.app) PD.app.render(); };
    if (force !== true && st.dirty) return PD.ui.confirm(t('sd.dirty'), doIt);
    doIt();
  }
  return { open, close, get active() { return !!ST; } };
})();
