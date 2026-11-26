/* =====================================================================
   Admin Lesson Editor — the owner's timeline for a song lesson.

   Eight tracks under one playhead: audio · chords · melody (piano roll) ·
   rhythm · lyrics · tablature · tempo (beat map) · sections. Drag to move,
   drag an edge to resize, double-click to add, snap to the beat / a grid /
   off, millisecond fields in the inspector, bars·beats or minutes·seconds,
   undo/redo, keyboard shortcuts, loop of a selection.

   Who may use it: the page opens only when the server says this account is
   the owner (cloud.isOwner ← rpc is_owner()). That is a convenience, not the
   protection: every save, publish, verify, restore and upload goes through
   security-definer functions that check is_owner() again on the server
   (migrations/202611250001_song_lessons.sql), and no table can be written
   directly. A learner who calls the API gets 'not-allowed'.

   What is saved where: every change is kept on this device at once (so a
   crash or a reload loses nothing); Save Draft writes it to the server
   (song_lesson_drafts, with a version row); Publish makes it what every
   learner gets. A new automatic analysis never replaces a saved draft —
   the owner loads it only on purpose (⋯ → Load the analysis).
   ===================================================================== */
PD.i18n.add({
  'le.title': ['გაკვეთილის რედაქტორი', 'Lesson editor'], 'le.close': ['დახურვა', 'Close'],
  'le.save': ['შავი ვერსიის შენახვა', 'Save Draft'], 'le.preview': ['წინასწარი ნახვა', 'Preview'], 'le.publish': ['გამოქვეყნება', 'Publish Changes'],
  'le.verify': ['დადასტურება', 'Verify Lesson'], 'le.unverify': ['დადასტურების მოხსნა', 'Remove verification'], 'le.revert': ['ცვლილებების გაუქმება', 'Revert Changes'],
  'le.history': ['ვერსიების ისტორია', 'Version History'], 'le.changes': ['ცვლილებების ისტორია', 'Change history'], 'le.restore': ['აღდგენა', 'Restore'],
  'le.undo': ['დაბრუნება', 'Undo'], 'le.redo': ['გამეორება', 'Redo'], 'le.more': ['მეტი', 'More'],
  'le.play': ['დაკვრა', 'Play'], 'le.stop': ['გაჩერება', 'Stop'], 'le.zoomIn': ['გადიდება', 'Zoom in'], 'le.zoomOut': ['დაპატარავება', 'Zoom out'], 'le.fit': ['მთლიანად', 'Fit'],
  'le.snap': ['მიბმა', 'Snap'], 'le.snap.beat': ['თვლაზე', 'Beat'], 'le.snap.off': ['გამორთული', 'Off'], 'le.loop': ['გამეორება', 'Loop'], 'le.follow': ['მიყოლა', 'Follow'],
  'le.mode.time': ['წთ:წმ', 'Min:Sec'], 'le.mode.bars': ['ტაქტი.თვლა', 'Bars.Beats'],
  'le.t.wave': ['აუდიო', 'Audio'], 'le.t.chords': ['აკორდები', 'Chords'], 'le.t.notes': ['ნოტები', 'Notes'], 'le.t.rhythm': ['რითმი', 'Rhythm'],
  'le.t.lyrics': ['ტექსტი', 'Lyrics'], 'le.t.tab': ['ტაბულატურა', 'Tablature'], 'le.t.tempo': ['ტემპი', 'Tempo'], 'le.t.sections': ['ნაწილები', 'Sections'],
  'le.status': ['სტატუსი', 'Status'], 'le.dirty': ['შეუნახავი ცვლილებები', 'Unsaved changes'], 'le.savedLocal': ['ამ მოწყობილობაზე შენახულია', 'Kept on this device'],
  'le.saved': ['შავი ვერსია შეინახა (ვერსია {r})', 'Draft saved (revision {r})'], 'le.published': ['გამოქვეყნდა — ყველა მომხმარებელი ამ ვერსიას მიიღებს', 'Published — every learner now gets this version'],
  'le.verified': ['გაკვეთილი დადასტურდა', 'Lesson verified'], 'le.unverified': ['დადასტურება მოიხსნა', 'Verification removed'],
  'le.reverted': ['შავი ვერსია დაუბრუნდა გამოქვეყნებულს', 'The draft is back to what is published'], 'le.notPub': ['ჯერ არაფერია გამოქვეყნებული — შავი ვერსია ჩანაწერის ანალიზს დაუბრუნდა.', 'Nothing is published yet — the draft went back to the analysis of the recording.'],
  'le.conflict': ['ეს გაკვეთილი სხვა მოწყობილობიდან შეიცვალა. გახსენი თავიდან, რომ ახალი ვერსია ნახო.', 'This lesson was changed on another device. Open it again to see the newer version.'],
  'le.noAllow': ['ამის გაკეთება მხოლოდ აპის მფლობელს შეუძლია.', 'Only the app\'s owner can do this.'], 'le.offline': ['სერვერთან კავშირი ვერ დამყარდა. ცვლილებები ამ მოწყობილობაზე რჩება.', 'Could not reach the server. Your changes stay on this device.'],
  'le.noMig': ['სერვერზე გაკვეთილების ცხრილი ჯერ არ არის (migration 202611250001). ცვლილებები ამ მოწყობილობაზე ინახება.', 'The server has no lesson tables yet (migration 202611250001). Changes are kept on this device.'],
  'le.wip': ['ამ მოწყობილობაზე შეუნახავი ცვლილებებია ({d}). აღვადგინო?', 'There are unsaved changes on this device ({d}). Restore them?'],
  'le.pubQ': ['გამოვაქვეყნო? ყველა მომხმარებელი ამ აკორდებს, ნოტებს და რითმს მიიღებს.', 'Publish? Every learner will get these chords, notes and rhythm.'],
  'le.revertQ': ['გავაუქმო შეუნახავი და შავი ცვლილებები და დავუბრუნდე გამოქვეყნებულს?', 'Discard the draft changes and go back to what is published?'],
  'le.analysisQ': ['ჩავტვირთო ჩანაწერის ავტომატური ანალიზი? ის შენს ცვლილებებს რედაქტორში ჩაანაცვლებს (დაბრუნება შეიძლება).', 'Load the automatic analysis of the recording? It replaces your changes in the editor (you can undo it).'],
  'le.loadAnalysis': ['ანალიზის ჩატვირთვა', 'Load the analysis'], 'le.upload': ['ჩანაწერის გამოქვეყნება', 'Publish the recording'],
  'le.uploadQ': ['ჩანაწერი საჯარო გახდება — ყველა მომხმარებელი მოისმენს. ადასტურებ, რომ მისი გამოქვეყნების უფლება გაქვს?', 'The recording becomes public — every learner can play it. Do you confirm you have the right to publish it?'],
  'le.uploaded': ['ჩანაწერი გამოქვეყნდა', 'Recording published'], 'le.uploading': ['იტვირთება… {p}%', 'Uploading… {p}%'], 'le.attach': ['ჩანაწერის მიმაგრება', 'Attach the recording'],
  'le.noAudio': ['ჩანაწერი არ არის მიმაგრებული: მიამაგრე ფაილი MUSIC საქაღალდიდან (ის ჯერ მხოლოდ ამ მოწყობილობაზე იქნება).', 'No recording attached: attach the file from the MUSIC folder (it stays on this device until you publish it).'],
  'le.chordpro': ['ტექსტი აკორდებით', 'Lyrics with chords'], 'le.chordproD': ['[Am] შენამ ვინ გკითხავს… — ყოველი სტრიქონი ერთი ხაზია, აკორდი იქ იცვლება, სადაც ფრჩხილია. „გამოყენება“ სტრიქონებს ადგილზე ტოვებს და აკორდებს მარცვლის დროზე სვამს.', '[Am] Shenam vin… — one line per row; the chord changes where the bracket is. Apply keeps the lines where they are and puts the chords on the syllables\' times.'],
  'le.apply': ['გამოყენება', 'Apply'], 'le.cancel': ['გაუქმება', 'Cancel'], 'le.delete': ['წაშლა', 'Delete'], 'le.split': ['გაყოფა', 'Split'], 'le.dup': ['გამეორება შემდეგ', 'Repeat after'],
  'le.insert': ['ჩასმა აქ', 'Insert here'], 'le.hear': ['მოსმენა', 'Listen'], 'le.start': ['დასაწყისი', 'Start'], 'le.end': ['დასასრული', 'End'], 'le.dur': ['ხანგრძლივობა', 'Duration'],
  'le.name': ['აკორდი', 'Chord'], 'le.custom': ['სხვა (ჩაწერე)', 'Custom (type it)'], 'le.nc': ['N.C. — აკორდის გარეშე', 'N.C. — no chord'], 'le.play2': ['ფანდურზე', 'On the panduri'], 'le.same': ['იგივე', 'The same'],
  'le.pitch': ['ნოტი', 'Pitch'], 'le.string': ['სიმი', 'String'], 'le.fret': ['ლადი', 'Fret'], 'le.auto': ['ავტომატური', 'Automatic'], 'le.octUp': ['ოქტავით მაღლა', 'Octave up'], 'le.octDown': ['ოქტავით დაბლა', 'Octave down'],
  'le.impossible': ['ეს ნოტი ({m}) ფანდურის დიაპაზონს (A3–A5, 17 ლადი) სცდება — ფანდურის ვერსიაში ოქტავით გადაინაცვლებს.', 'This note ({m}) is outside the panduri\'s range (A3–A5, 17 frets) — the panduri version moves it by an octave.'],
  'le.badTab': ['სიმი {s} / ლადი {f} სხვა ნოტს იძლევა ({m}).', 'String {s} / fret {f} gives another note ({m}).'],
  'le.noShape': ['ამ აკორდს ფანდურის სამ სიმზე პოზიცია არ აქვს — აირჩიე ფანდურის ვერსია.', 'This chord has no three-string position — choose a panduri version.'],
  'le.adapted': ['ფანდურზე: {b} (ორიგინალი {a} შენახულია)', 'On the panduri: {b} (the original {a} is kept)'],
  'le.rhythm': ['რითმი', 'Rhythm'], 'le.span': ['ერთი წრე (თვლა)', 'One cycle (beats)'], 'le.strokes': ['დარტყმები', 'Strokes'], 'le.addStroke': ['დარტყმის დამატება', 'Add a stroke'],
  'le.pos': ['ადგილი (თვლა)', 'Place (beats)'], 'le.customR': ['საკუთარი რითმი', 'Custom rhythm'], 'le.wholeSong': ['მთელ სიმღერაზე', 'On the whole song'],
  'le.s.down': ['↓ ჩაკვრა', '↓ Down'], 'le.s.up': ['↑ ამოკვრა', '↑ Up'], 'le.s.downA': ['↓ ძლიერი', '↓ Accent'], 'le.s.upA': ['↑ ძლიერი', '↑ Accent'], 'le.s.rest': ['· პაუზა', '· Pause'], 'le.s.mute': ['× ჩახშობილი', '× Muted'], 'le.s.str': ['სიმი {s}', 'String {s}'],
  'le.text': ['ტექსტი', 'Text'], 'le.spread': ['მარცვლების თანაბრად განაწილება', 'Spread the syllables evenly'], 'le.addLine': ['სტრიქონის დამატება', 'Add a line'],
  'le.kind': ['ნაწილი', 'Part'], 'le.beat': ['თვლა {n}', 'Beat {n}'], 'le.time': ['დრო', 'Time'], 'le.bpmSet': ['ტემპი მონიშნულზე (BPM)', 'Tempo for the selection (BPM)'], 'le.shift': ['ყველა თვლის წაძვრა (მწმ)', 'Shift every beat (ms)'],
  'le.meta': ['სიმღერა', 'Song'], 'le.titleKa': ['სახელი (ქართ.)', 'Title (Georgian)'], 'le.titleEn': ['სახელი (ინგლ.)', 'Title (English)'], 'le.artistKa': ['შემსრულებელი (ქართ.)', 'Performer (Georgian)'], 'le.artistEn': ['შემსრულებელი (ინგლ.)', 'Performer (English)'],
  'le.level': ['სირთულე', 'Level'], 'le.key': ['ტონალობა', 'Key'], 'le.meter': ['ზომა', 'Meter'], 'le.bpb': ['თვლა ტაქტში', 'Beats per bar'], 'le.sub': ['დაყოფა', 'Subdivision'], 'le.octave': ['მელოდიის ოქტავა ფანდურზე', 'Melody octave on the panduri'],
  'le.review': ['გადასამოწმებელი', 'To review'], 'le.reviewNone': ['ამ ადგილას შენიშვნა არ არის.', 'Nothing noted here.'], 'le.conf': ['თანხმობა {p}%', 'Agreement {p}%'],
  'le.keys': ['Space დაკვრა · S გაყოფა · I აკორდის ჩასმა · Del წაშლა · ⌘Z / ⌘⇧Z · ⌘C ⌘V · ⌘D გამეორება · L წრე · +/− მასშტაბი · B ტაქტი/დრო · N მიბმა · ← → 10 მწმ (⇧ 100, ⌥ 1)', 'Space play · S split · I insert chord · Del delete · ⌘Z / ⌘⇧Z · ⌘C ⌘V · ⌘D repeat · L loop · +/− zoom · B bars/time · N snap · ← → 10 ms (⇧ 100, ⌥ 1)'],
  'le.copied': ['{n} აკორდი დაკოპირდა', '{n} chords copied'], 'le.pasted': ['{n} ჩაისვა', '{n} pasted'], 'le.verifiedNote': ['ეს ვერსია დადასტურებულია', 'This revision is verified'],
  'le.u.move': ['გადაადგილება', 'Move'], 'le.u.resize': ['ზომის შეცვლა', 'Resize'], 'le.u.add': ['დამატება', 'Add'], 'le.u.del': ['წაშლა', 'Delete'], 'le.u.edit': ['შეცვლა', 'Edit'], 'le.u.split': ['გაყოფა', 'Split'], 'le.u.paste': ['ჩასმა', 'Paste']
});

PD.lessonEditor = (() => {
  const h = PD.h, t = PD.i18n.t, ML = () => PD.musicLib;
  const NAMES = ['C', 'C♯', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'A♭', 'A', 'B♭', 'B'];
  const TR = [['wave', 62], ['chords', 44], ['notes', 150], ['rhythm', 42], ['lyrics', 46], ['tab', 66], ['tempo', 56], ['sections', 30]];
  const RULER = 28, EDGE = 7, LO = 57, HI = 81;
  let S = null;

  /* ---------------- helpers ---------------- */
  const clone = o => JSON.parse(JSON.stringify(o));
  const strip = D => { const o = clone(D); delete o._from; delete o._verified; return o; };
  const fmt = x => { const s = Math.max(0, x); return Math.floor(s / 60) + ':' + (s % 60).toFixed(3).padStart(6, '0'); };
  const midiName = m => NAMES[((m % 12) + 12) % 12] + Math.floor(m / 12 - 1);
  const err = e => { const c = e && (e.code || e.message || ''); PD.ui.toast(t(/not-allowed|42501/.test(c) ? 'le.noAllow' : /conflict|40001/.test(c) ? 'le.conflict' : /PGRST20|relation|does not exist|404/.test(c) ? 'le.noMig' : 'le.offline'), 5000); };
  function beatAt(x) { return ML().beatAt(S.D, x); }
  function timeAt(b) { return ML().timeAt(S.D, b); }
  function fmtPos(x) {
    if (S.mode === 'time') return fmt(x);
    const m = S.D.meter || {}, bpb = m.beatsPerBar || 4, ph = m.phase || 0, b = beatAt(x) - ph;
    const bar = Math.floor(b / bpb), bt = b - bar * bpb, bi = Math.floor(bt);
    return (bar + 1) + '.' + (bi + 1) + '.' + String(Math.round((bt - bi) * 960)).padStart(3, '0');
  }
  function snapT(x, free) {
    if (free || S.snap === 'off') return Math.round(x * 1000) / 1000;
    const per = { beat: 1, '1/2': 2, '1/3': 3, '1/4': 4 }[S.snap] || 1;
    return Math.round(timeAt(Math.round(beatAt(x) * per) / per) * 1000) / 1000;
  }
  const dur = () => (S.audio && S.audio.duration) || S.D.duration || (S.D.beats[S.D.beats.length - 1] + 2);
  function norm() {
    const D = S.D;
    (D.chords = D.chords || []).sort((a, b) => a.t - b.t);
    (D.notes = D.notes || []).sort((a, b) => a[0] - b[0]);
    if (D.lyrics) D.lyrics.sort((a, b) => a.t - b.t);
    (D.sections = D.sections || []).sort((a, b) => a.from - b.from);
    (D.rhythm = D.rhythm || []).sort((a, b) => a.from - b.from);
    if (!D.rhythm.length) D.rhythm.push({ from: 0, id: 'custom', span: 1, strokes: [{ dir: 'down', pos: 0, acc: false }] });
  }

  /* ---------------- undo / redo / keep ---------------- */
  function change(label, fn) {
    S.undo.push({ label, at: Date.now(), d: JSON.stringify(S.D) }); if (S.undo.length > 300) S.undo.shift();
    S.redo = []; fn(S.D); norm(); touched();
  }
  function touched() {
    S.dirty = true; clearTimeout(S.keepT);
    S.keepT = setTimeout(() => { PD.store.set('le.wip.' + S.id, { d: strip(S.D), at: Date.now(), rev: S.rev }); paintHead(); }, 400);
    draw(); inspector(); paintHead();
  }
  function undo() { const u = S.undo.pop(); if (!u) return; S.redo.push({ label: u.label, at: Date.now(), d: JSON.stringify(S.D) }); S.D = JSON.parse(u.d); S.sel = null; norm(); touched(); }
  function redo() { const u = S.redo.pop(); if (!u) return; S.undo.push({ label: u.label, at: Date.now(), d: JSON.stringify(S.D) }); S.D = JSON.parse(u.d); S.sel = null; norm(); touched(); }

  /* ---------------- server ---------------- */
  const rpc = (fn, args) => PD.cloud.db.rpc(fn, args);
  async function loadServer(id) {
    try {
      const rows = await PD.cloud.db.select('song_lesson_drafts', { select: 'draft,rev,status,verified_rev,updated_at', id: 'eq.' + id });
      return rows && rows[0] || null;
    } catch (e) { S && (S.serverErr = e); return null; }
  }
  async function save(note) {
    const st = S.status && !['published', 'teacher-verified', 'not-analyzed', 'analyzing'].includes(S.status) ? S.status : 'manually-edited';
    try {
      const rev = await rpc('song_lesson_save', { p_id: S.id, p_draft: strip(S.D), p_status: S.dirty ? 'manually-edited' : st, p_note: note || (S.undo.length ? S.undo.slice(-3).map(u => u.label).join(', ') : null), p_base_rev: S.rev || null });
      S.rev = rev; S.status = S.dirty ? 'manually-edited' : st; S.dirty = false; PD.store.del('le.wip.' + S.id);
      PD.ui.toast(t('le.saved', { r: rev })); paintHead(); return true;
    } catch (e) { err(e); return false; }
  }
  async function publish() {
    PD.ui.confirm(t('le.pubQ'), async () => {
      if ((S.dirty || !S.rev) && !await save()) return;
      try { await rpc('song_lesson_publish', { p_id: S.id, p_note: null }); S.status = 'published'; ML().setPreview(S.id, null); await ML().loadPublished(); PD.lessons.reload(); PD.ui.toast(t('le.published'), 3500); paintHead(); }
      catch (e) { err(e); }
    });
  }
  async function verify() {
    const on = !(S.verifiedRev && S.verifiedRev === S.rev && !S.dirty);
    if (on && (S.dirty || !S.rev) && !await save()) return;
    try { await rpc('song_lesson_verify', { p_id: S.id, p_on: on }); S.verifiedRev = on ? S.rev : null; S.status = on ? 'teacher-verified' : 'manually-edited'; await ML().loadPublished(); PD.lessons.reload(); PD.ui.toast(t(on ? 'le.verified' : 'le.unverified')); paintHead(); }
    catch (e) { err(e); }
  }
  function revert() {
    PD.ui.confirm(t('le.revertQ'), async () => {
      try { await rpc('song_lesson_revert', { p_id: S.id }); const r = await loadServer(S.id); if (r) { setData(r.draft); S.rev = r.rev; S.status = r.status; } PD.ui.toast(t('le.reverted')); }
      catch (e) {
        if (/not-published/.test(e && (e.message || e.code))) { change(t('le.revert'), () => {}); setData(clone(ML().shipped(S.id) || S.D)); PD.ui.toast(t('le.notPub'), 4000); }
        else err(e);
      }
      PD.store.del('le.wip.' + S.id); S.dirty = false; paintHead();
    });
  }
  function setData(d) { S.D = clone(d); delete S.D._from; delete S.D._verified; norm(); S.sel = null; draw(); inspector(); paintHead(); }
  function history() {
    PD.ui.sheet(async (box, close) => {
      box.append(h('h2', { 'data-t': 'le.history' }));
      const list = h('div', { class: 'le-vlist' }, [h('p', { class: 'muted', text: '…' })]); box.append(list);
      try {
        const rows = await PD.cloud.db.select('song_lesson_versions', { select: 'id,rev,kind,note,created_at', lesson_id: 'eq.' + S.id, order: 'id.desc', limit: 80 }) || [];
        list.innerHTML = '';
        rows.forEach(r => list.append(h('div', { class: 'le-vrow' }, [h('div', {}, [h('b', { text: '#' + r.rev + ' · ' + r.kind }), h('small', { class: 'muted', text: new Date(r.created_at).toLocaleString() + (r.note ? ' · ' + r.note : '') })]),
          h('button', { class: 'btn small', 'data-t': 'le.restore', onclick: async () => { try { const rev = await rpc('song_lesson_restore', { p_id: S.id, p_version: r.id }); const d = await loadServer(S.id); if (d) { change(t('le.restore'), () => {}); setData(d.draft); S.rev = rev; S.dirty = false; S.status = d.status; } close(); } catch (e) { err(e); } } })])));
        if (!rows.length) list.append(h('p', { class: 'muted', text: '—' }));
      } catch (e) { list.innerHTML = ''; list.append(h('p', { class: 'notice', text: t('le.noMig') })); }
      const ch = h('div', { class: 'le-vlist' }); box.append(h('h3', { 'data-t': 'le.changes' }), ch);
      S.undo.slice().reverse().forEach((u, k) => ch.append(h('button', { class: 'le-vrow btn ghost', onclick: () => { for (let i = 0; i <= k; i++) undo(); close(); } }, [h('span', { text: u.label }), h('small', { class: 'muted', text: new Date(u.at).toLocaleTimeString() })])));
      PD.i18n.apply(box);
    });
  }
  async function uploadAudio() {
    const b = await PD.blobs.get('ml.own.' + S.id).catch(() => null);
    if (!b) return attach();
    PD.ui.confirm(t('le.uploadQ'), async () => {
      const ext = (/mpeg|mp3/.test(b.type) ? 'mp3' : /mp4|m4a|aac/.test(b.type) ? 'm4a' : /wav/.test(b.type) ? 'wav' : /ogg/.test(b.type) ? 'ogg' : 'mp3');
      const path = S.id + '/' + Date.now().toString(36) + '.' + ext;
      try {
        await PD.cloud.storage.upload(path, b, p => PD.ui.toast(t('le.uploading', { p: Math.round(p * 100) }), 1500), 'lesson-audio');
        await rpc('song_lesson_set_audio', { p_id: S.id, p_path: path });
        await ML().loadPublished(); PD.lessons.reload(); PD.ui.toast(t('le.uploaded'));
      } catch (e) { err(e); }
    });
  }
  async function attach() { if (await ML().loadOwn(S.id, S.D)) loadAudio(); }

  /* ---------------- audio ---------------- */
  async function loadAudio() {
    const a = await ML().audioOf(S.id);
    if (!a) { S.noAudio = true; paintHead(); return; }
    S.noAudio = false; S.audio.src = a.url; S.audio.load();
    try {
      const buf = await (await fetch(a.url)).arrayBuffer(), ac = new (window.AudioContext || window.webkitAudioContext)();
      const ab = await new Promise((res, rej) => { const p = ac.decodeAudioData(buf, res, rej); if (p && p.then) p.then(res, rej); }); try { ac.close(); } catch (_) {}
      const x = ab.getChannelData(0), R = 200, n = Math.ceil(ab.duration * R), step = ab.sampleRate / R, pk = new Float32Array(n * 2);
      for (let i = 0; i < n; i++) { let lo = 0, hi = 0; for (let j = Math.floor(i * step), e = Math.min(x.length, Math.floor((i + 1) * step)); j < e; j += 2) { const v = x[j]; if (v < lo) lo = v; if (v > hi) hi = v; } pk[2 * i] = lo; pk[2 * i + 1] = hi; }
      S.peaks = { pk, R };
    } catch (_) { S.peaks = null; }
    paintHead(); draw();
  }
  function playPause() { if (S.noAudio) return; if (S.audio.paused) { if (S.range && S.loop && (S.audio.currentTime < S.range[0] || S.audio.currentTime > S.range[1])) S.audio.currentTime = S.range[0]; S.audio.play().catch(() => {}); } else S.audio.pause(); }
  function stop() { S.audio.pause(); S.audio.currentTime = S.range ? S.range[0] : 0; draw(); }
  function seek(x) { S.audio.currentTime = Math.max(0, Math.min(dur() - .01, x)); draw(); inspector(true); }
  function tick() {
    if (!S || !S.root.isConnected) return;
    const x = S.audio.currentTime;
    if (!S.audio.paused) {
      if (S.loop && S.range && x >= S.range[1]) S.audio.currentTime = S.range[0];
      if (S.follow) { const w = S.cv.clientWidth - S.head; if (x > S.x0 + w / S.zoom * .85 || x < S.x0) S.x0 = Math.max(0, x - w / S.zoom * .15); }
      draw(); S.timeEl.textContent = fmtPos(x);
    }
    S.raf = requestAnimationFrame(tick);
  }

  /* ---------------- geometry ---------------- */
  const lanes = () => { let y = RULER; return TR.map(([k, hh]) => { const o = { k, y, h: hh }; y += hh; return o; }); };
  const laneOf = k => lanes().find(l => l.k === k);
  const totalH = () => RULER + TR.reduce((a, x) => a + x[1], 0);
  const tx = x => S.head + (x - S.x0) * S.zoom;
  const xt = px => S.x0 + (px - S.head) / S.zoom;
  function noteRange() { const ms = S.D.notes.map(n => n[2]); const lo = Math.min(...(ms.length ? ms : [57])) - 2, hi = Math.max(...(ms.length ? ms : [69])) + 2; return hi - lo < 14 ? [lo, lo + 14] : [lo, hi]; }
  const noteY = (L, m, rg, rh) => L.y + (rg[1] - m) * rh;
  const sectT = s => [timeAt(s.from), timeAt(s.to)];
  const rhEnd = k => S.D.rhythm[k + 1] ? S.D.rhythm[k + 1].from : S.D.beats.length - 1;
  const chEnd = k => S.D.chords[k + 1] ? S.D.chords[k + 1].t : dur();

  /* ---------------- drawing ---------------- */
  function draw() {
    if (!S) return;
    const cv = S.cv, dpr = window.devicePixelRatio || 1, W = cv.clientWidth, H = totalH();
    if (cv.width !== Math.round(W * dpr) || cv.height !== Math.round(H * dpr)) { cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); cv.style.height = H + 'px'; }
    const g = cv.getContext('2d'); g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, W, H);
    const D = S.D, t0 = S.x0, t1 = xt(W), C = { cu: '#d08a5c', cuL: '#f0b48a', line: 'rgba(255,255,255,.08)', txt: '#e9e6e1', dim: '#8a8a90', bad: '#e2574c', blue: '#5b9bd5' };
    g.font = '600 11px system-ui,-apple-system'; g.textBaseline = 'middle';
    // lanes background + beat grid
    lanes().forEach((L, i) => { g.fillStyle = i % 2 ? 'rgba(255,255,255,.015)' : 'rgba(255,255,255,.03)'; g.fillRect(S.head, L.y, W - S.head, L.h); g.fillStyle = C.line; g.fillRect(0, L.y + L.h - 1, W, 1); });
    const bpb = (D.meter && D.meter.beatsPerBar) || 4, ph = (D.meter && D.meter.phase) || 0;
    const bstep = S.zoom * (D.beats[1] - D.beats[0] || .5);
    D.beats.forEach((b, i) => { if (b < t0 - 1 || b > t1 + 1) return; const x = tx(b), bar = ((i - ph) % bpb + bpb) % bpb === 0; if (!bar && bstep < 5) return; g.fillStyle = bar ? 'rgba(255,255,255,.12)' : 'rgba(255,255,255,.045)'; g.fillRect(x, RULER, 1, H - RULER); });
    // review bands (the owner's only)
    (S.review || []).forEach(r => { if (r.to < t0 || r.from > t1 || r.to - r.from > dur() * .9) return; g.fillStyle = 'rgba(226,87,76,.10)'; g.fillRect(tx(r.from), RULER, (r.to - r.from) * S.zoom, H - RULER); g.fillStyle = 'rgba(226,87,76,.7)'; g.fillRect(tx(r.from), RULER - 4, (r.to - r.from) * S.zoom, 3); });
    // ruler
    g.fillStyle = '#0d0d10'; g.fillRect(0, 0, W, RULER); g.fillStyle = C.dim;
    if (S.mode === 'time') {
      const steps = [.1, .25, .5, 1, 2, 5, 10, 15, 30, 60], st = steps.find(s => s * S.zoom >= 70) || 60;
      for (let x = Math.floor(t0 / st) * st; x <= t1; x += st) { const px = tx(x); if (px < S.head) continue; g.fillRect(px, RULER - 8, 1, 8); g.fillText(st < 1 ? fmt(x).slice(0, -1) : PD.fmtTime(x), px + 3, 10); }
    } else {
      let every = 1; while (bstep * bpb * every < 46) every *= 2;
      D.beats.forEach((b, i) => { if ((i - ph) % (bpb * every) !== 0 || b < t0 || b > t1) return; const px = tx(b); g.fillRect(px, RULER - 10, 1, 10); g.fillText(String(Math.floor((i - ph) / bpb) + 1), px + 3, 10); });
    }
    if (S.range) { const a = tx(S.range[0]), b = tx(S.range[1]); g.fillStyle = S.loop ? 'rgba(240,180,138,.20)' : 'rgba(255,255,255,.08)'; g.fillRect(a, 0, b - a, H); g.fillStyle = C.cuL; g.fillRect(a, 0, 1.5, H); g.fillRect(b, 0, 1.5, H); }
    const sel = (k, i) => S.sel && S.sel.k === k && S.sel.i.includes(i);
    // 1 waveform
    let L = laneOf('wave'), mid = L.y + L.h / 2;
    if (S.peaks) { const { pk, R } = S.peaks; g.fillStyle = 'rgba(208,138,92,.75)'; for (let px = S.head; px < W; px++) { const a = Math.floor(xt(px) * R), b = Math.max(a + 1, Math.floor(xt(px + 1) * R)); let lo = 0, hi = 0; for (let j = a; j < b && j < pk.length / 2; j++) { if (j < 0) continue; lo = Math.min(lo, pk[2 * j]); hi = Math.max(hi, pk[2 * j + 1]); } g.fillRect(px, mid - hi * L.h * .48, 1, Math.max(1, (hi - lo) * L.h * .48)); } }
    else { g.fillStyle = C.dim; g.fillText(t(S.noAudio ? 'le.noAudio' : 'p.recLoad').slice(0, 120), S.head + 8, mid); }
    // 2 chords
    L = laneOf('chords');
    D.chords.forEach((c, k) => {
      const a = c.t, b = chEnd(k); if (b < t0 || a > t1) return;
      const x = tx(a), w = Math.max(1, (b - a) * S.zoom), conf = S.conf && S.conf[k], low = conf != null && conf < .6 && !S.editedChord[k];
      g.fillStyle = sel('chords', k) ? 'rgba(240,180,138,.55)' : c.chord ? (low ? 'rgba(226,87,76,.22)' : 'rgba(208,138,92,.26)') : 'rgba(255,255,255,.06)';
      g.fillRect(x + 1, L.y + 5, w - 2, L.h - 10);
      g.fillStyle = sel('chords', k) ? '#fff' : C.cuL; g.fillRect(x, L.y + 3, 2, L.h - 6);
      if (w > 18) { g.fillStyle = C.txt; g.font = '700 13px system-ui'; const sh = ML().shape(c.play || c.chord); g.fillText((c.chord || 'N.C.') + (c.play && c.play !== c.chord ? ' → ' + c.play : '') + (c.chord && !sh ? ' ⚠' : ''), x + 6, L.y + L.h / 2, w - 10); }
    });
    // 3 notes (piano roll)
    L = laneOf('notes'); const rg = noteRange(), rh = L.h / (rg[1] - rg[0] + 1), oct = ML().octaveFor(D);
    g.font = '600 9px system-ui';
    for (let m = rg[0]; m <= rg[1]; m++) { const y = noteY(L, m, rg, rh); if (m % 12 === 0 || m % 12 === 9) { g.fillStyle = 'rgba(255,255,255,.05)'; g.fillRect(S.head, y, W, 1); } if (rh >= 9 && (m % 12 === 0 || m % 12 === 9)) { g.fillStyle = C.dim; g.fillText(midiName(m), S.head - 30, y + rh / 2); } }
    D.notes.forEach((n, i) => {
      if (n[0] + n[1] < t0 || n[0] > t1) return;
      const x = tx(n[0]), w = Math.max(3, n[1] * S.zoom), y = noteY(L, n[2], rg, rh), bad = n[2] + oct < LO || n[2] + oct > HI;
      g.fillStyle = sel('notes', i) ? C.cuL : 'rgba(208,138,92,.7)'; g.fillRect(x, y + 1, w, Math.max(3, rh - 2));
      if (bad) { g.strokeStyle = C.bad; g.lineWidth = 1.5; g.strokeRect(x, y + 1, w, Math.max(3, rh - 2)); }
    });
    if (S.marquee) { const m = S.marquee; g.strokeStyle = C.cuL; g.lineWidth = 1; g.strokeRect(Math.min(m.x0, m.x1), Math.min(m.y0, m.y1), Math.abs(m.x1 - m.x0), Math.abs(m.y1 - m.y0)); }
    // 4 rhythm
    L = laneOf('rhythm'); g.font = '700 12px system-ui';
    D.rhythm.forEach((r, k) => {
      const a = timeAt(r.from), b = timeAt(rhEnd(k)); if (b < t0 || a > t1) return;
      g.fillStyle = sel('rhythm', k) ? 'rgba(91,155,213,.45)' : 'rgba(91,155,213,.18)'; g.fillRect(tx(a) + 1, L.y + 4, (b - a) * S.zoom - 2, L.h - 8);
      const R = PD.curriculum.anyRhythm(r.id), P = ML().pattern(r);
      g.fillStyle = C.txt; g.fillText(r.id === 'custom' ? t('le.customR') : R ? PD.i18n.pick(R.name) : r.id, tx(a) + 6, L.y + 12);
      if (bstep * P.span / Math.max(1, P.strokes.length) > 9) for (let bb = r.from; bb < rhEnd(k); bb += P.span) P.strokes.forEach(s => { const x = tx(timeAt(bb + s.pos)); if (x < S.head || x > W) return; g.fillStyle = s.acc ? C.bad : s.dir === 'rest' ? C.dim : C.cuL; g.fillText(s.dir === 'rest' ? '·' : s.dir === 'up' ? '↑' : s.dir === 'mute' ? '×' : s.str ? String(s.str) : '↓', x - 3, L.y + L.h - 11); });
    });
    // 5 lyrics
    L = laneOf('lyrics'); g.font = '600 12px system-ui';
    (D.lyrics || []).forEach((ln, k) => {
      if (ln.e < t0 || ln.t > t1) return;
      const x = tx(ln.t), w = (ln.e - ln.t) * S.zoom;
      g.fillStyle = sel('lyrics', k) ? 'rgba(240,180,138,.35)' : 'rgba(255,255,255,.07)'; g.fillRect(x, L.y + 4, w, L.h - 8);
      g.fillStyle = C.txt; g.fillText(ln.text, x + 4, L.y + 14, Math.max(10, w - 6));
      (ln.syl || []).forEach(s => { const sx = tx(s.t); g.fillStyle = C.cuL; g.fillRect(sx, L.y + L.h - 16, 1.5, 10); });
    });
    // 6 tablature (E at the top, A at the bottom, like the practice neck)
    L = laneOf('tab'); const TB = ML().tab(D), ys = { 3: L.y + 14, 2: L.y + 33, 1: L.y + 52 };
    [1, 2, 3].forEach(s => { g.fillStyle = 'rgba(255,255,255,.18)'; g.fillRect(S.head, ys[s], W, s === 1 ? 1.6 : 1); g.fillStyle = '#c38c63'; g.fillText(PD.theory.stringName(s), S.head - 14, ys[s]); });
    g.font = '700 11px system-ui';
    D.notes.forEach((n, i) => { const tb = TB.notes[i]; if (!tb || n[0] > t1 || n[0] + n[1] < t0) return; const x = tx(n[0]); const y = tb.s ? ys[tb.s] : L.y + L.h - 6; const txt = tb.f == null ? '×' : String(tb.f);
      g.fillStyle = '#0b0b0d'; g.fillRect(x - 1, y - 7, g.measureText(txt).width + 4, 14); g.fillStyle = !tb.ok ? C.bad : sel('notes', i) ? '#fff' : tb.own ? C.blue : C.cuL; g.fillText(txt, x + 1, y); });
    // 7 tempo
    L = laneOf('tempo'); const bp = []; for (let i = 0; i + 1 < D.beats.length; i++) bp.push(60 / (D.beats[i + 1] - D.beats[i]));
    const lo = Math.min(...bp) - 3, hi = Math.max(...bp) + 3, by = v => L.y + 6 + (hi - v) / (hi - lo) * (L.h - 18);
    g.strokeStyle = C.cuL; g.lineWidth = 1.4; g.beginPath(); let started = false;
    bp.forEach((v, i) => { const x = tx((D.beats[i] + D.beats[i + 1]) / 2); if (x < S.head - 20 || x > W + 20) return; if (!started) { g.moveTo(x, by(v)); started = true; } else g.lineTo(x, by(v)); }); g.stroke();
    if (bstep >= 4) D.beats.forEach((b, i) => { if (b < t0 || b > t1) return; g.fillStyle = sel('tempo', i) ? '#fff' : 'rgba(240,180,138,.6)'; g.fillRect(tx(b) - (sel('tempo', i) ? 1.5 : .5), L.y + L.h - 10, sel('tempo', i) ? 3 : 1, 8); });
    g.fillStyle = C.dim; g.font = '600 10px system-ui'; (D.tempo || []).forEach(s => { const x = tx(timeAt(s.from)); if (x > S.head && x < W) g.fillText(Math.round(s.bpm) + ' BPM', x + 3, L.y + 8); });
    // 8 sections
    L = laneOf('sections'); g.font = '700 11px system-ui';
    D.sections.forEach((s, k) => { const [a, b] = sectT(s); if (b < t0 || a > t1) return; const col = { verse: 'rgba(208,138,92,.32)', chorus: 'rgba(240,180,138,.42)', intro: 'rgba(255,255,255,.1)', outro: 'rgba(255,255,255,.1)' }[s.kind] || 'rgba(91,155,213,.28)';
      g.fillStyle = sel('sections', k) ? 'rgba(255,255,255,.4)' : col; g.fillRect(tx(a) + 1, L.y + 3, (b - a) * S.zoom - 2, L.h - 6); g.fillStyle = C.txt; g.fillText(t('ml.sec.' + s.kind) + (s.letter ? ' ' + s.letter : ''), tx(a) + 5, L.y + L.h / 2, Math.max(6, (b - a) * S.zoom - 8)); });
    // headers (fixed on the left)
    g.fillStyle = '#060607'; g.fillRect(0, 0, S.head, H);
    lanes().forEach(L2 => { g.fillStyle = S.focus === L2.k ? C.cuL : C.dim; g.font = '700 11px system-ui'; g.fillText(S.head > 60 ? t('le.t.' + L2.k) : t('le.t.' + L2.k).slice(0, 4), 8, L2.y + 12); g.fillStyle = C.line; g.fillRect(0, L2.y + L2.h - 1, S.head, 1); });
    g.fillStyle = C.line; g.fillRect(S.head - 1, 0, 1, H);
    // playhead
    const px = tx(S.audio.currentTime || 0); if (px >= S.head) { g.fillStyle = '#fff'; g.fillRect(px - .5, 0, 1.5, H); g.fillStyle = C.cuL; g.beginPath(); g.moveTo(px - 5, 0); g.lineTo(px + 6, 0); g.lineTo(px + .5, 8); g.fill(); }
  }

  /* ---------------- hit testing ---------------- */
  function hit(px, py) {
    const L = lanes().find(l => py >= l.y && py < l.y + l.h), x = xt(px), D = S.D;
    if (py < RULER) return { lane: 'ruler', x };
    if (!L) return { lane: null, x };
    const near = (a, b) => Math.abs(tx(a) - b) <= EDGE;
    if (L.k === 'chords') { for (let k = D.chords.length - 1; k >= 0; k--) { const a = D.chords[k].t, b = chEnd(k); if (near(a, px)) return { lane: 'chords', k, part: 'left', x }; if (k + 1 < D.chords.length && near(b, px)) return { lane: 'chords', k, part: 'right', x }; if (x >= a && x < b) return { lane: 'chords', k, part: 'body', x }; } return { lane: 'chords', x }; }
    if (L.k === 'notes' || L.k === 'tab') {
      const rg = noteRange(), rh = laneOf('notes').h / (rg[1] - rg[0] + 1), TB = L.k === 'tab' ? ML().tab(D) : null, ys = { 3: L.y + 14, 2: L.y + 33, 1: L.y + 52 };
      for (let i = D.notes.length - 1; i >= 0; i--) { const n = D.notes[i], a = tx(n[0]), b = tx(n[0] + n[1]);
        if (L.k === 'notes') { const y = noteY(L, n[2], rg, rh); if (py >= y - 1 && py <= y + rh + 1 && px >= a - 2 && px <= Math.max(b, a + 4) + 2) return { lane: 'notes', k: i, part: px > Math.max(b, a + 4) - EDGE ? 'right' : 'body', x, m: n[2] }; }
        else { const tb = TB.notes[i]; if (tb && tb.s && Math.abs(py - ys[tb.s]) < 9 && px >= a - 3 && px <= a + 18) return { lane: 'tab', k: i, x }; } }
      return { lane: L.k, x, m: L.k === 'notes' ? Math.round(rg[1] - (py - L.y) / rh) : null };
    }
    if (L.k === 'rhythm') { for (let k = D.rhythm.length - 1; k >= 0; k--) { const a = timeAt(D.rhythm[k].from), b = timeAt(rhEnd(k)); if (k > 0 && near(a, px)) return { lane: 'rhythm', k, part: 'left', x }; if (x >= a && x < b) return { lane: 'rhythm', k, part: 'body', x }; } return { lane: 'rhythm', x }; }
    if (L.k === 'lyrics') { const ly = D.lyrics || []; for (let k = ly.length - 1; k >= 0; k--) { const ln = ly[k]; const si = (ln.syl || []).findIndex(s => near(s.t, px) && py > L.y + L.h - 20); if (si >= 0) return { lane: 'lyrics', k, part: 'syl', si, x }; if (near(ln.t, px)) return { lane: 'lyrics', k, part: 'left', x }; if (near(ln.e, px)) return { lane: 'lyrics', k, part: 'right', x }; if (x >= ln.t && x < ln.e) return { lane: 'lyrics', k, part: 'body', x }; } return { lane: 'lyrics', x }; }
    if (L.k === 'tempo') { let best = -1, bd = 1e9; D.beats.forEach((b, i) => { const d = Math.abs(tx(b) - px); if (d < bd) { bd = d; best = i; } }); return bd <= 7 ? { lane: 'tempo', k: best, x } : { lane: 'tempo', x }; }
    if (L.k === 'sections') { for (let k = D.sections.length - 1; k >= 0; k--) { const [a, b] = sectT(D.sections[k]); if (near(a, px)) return { lane: 'sections', k, part: 'left', x }; if (near(b, px)) return { lane: 'sections', k, part: 'right', x }; if (x >= a && x < b) return { lane: 'sections', k, part: 'body', x }; } return { lane: 'sections', x }; }
    return { lane: L.k, x };
  }

  /* ---------------- pointer ---------------- */
  function onDown(e) {
    const r = S.cv.getBoundingClientRect(), px = e.clientX - r.left, py = e.clientY - r.top;
    S.pointers.set(e.pointerId, { x: px, y: py });
    if (S.pointers.size === 2) { const [a, b] = [...S.pointers.values()]; S.pinch = { d: Math.hypot(a.x - b.x, a.y - b.y), z: S.zoom, x: xt((a.x + b.x) / 2) }; S.drag = null; return; }
    if (px < S.head) { const L = lanes().find(l => py >= l.y && py < l.y + l.h); if (L) { S.focus = L.k; draw(); inspector(); } return; }
    S.cv.setPointerCapture(e.pointerId);
    const H2 = hit(px, py), D = S.D, free = e.altKey;
    S.focus = H2.lane && H2.lane !== 'ruler' ? H2.lane : S.focus;
    S.drag = { H: H2, px, py, moved: false, free, before: JSON.stringify(D) };
    if (H2.lane === 'ruler' || H2.lane === 'wave') { S.drag.kind = 'range'; return; }
    if (H2.k == null) {
      if (H2.lane === 'notes') { S.drag.kind = 'marquee'; S.marquee = { x0: px, y0: py, x1: px, y1: py }; if (!e.shiftKey) S.sel = null; }
      else { S.sel = null; S.drag.kind = 'seek'; }
      inspector(); draw(); return;
    }
    const k = H2.lane === 'tab' ? 'notes' : H2.lane;
    if (e.shiftKey && S.sel && S.sel.k === k) { S.sel.i = S.sel.i.includes(H2.k) ? S.sel.i.filter(i => i !== H2.k) : S.sel.i.concat(H2.k); }
    else if (!(S.sel && S.sel.k === k && S.sel.i.includes(H2.k))) S.sel = { k, i: [H2.k] };
    S.drag.kind = 'item';
    S.drag.orig = clone({ chords: D.chords, notes: D.notes, lyrics: D.lyrics || [], sections: D.sections, rhythm: D.rhythm, beats: D.beats });
    if (k === 'notes') { const n = D.notes[H2.k]; if (n) { PD.audio.ensure() && PD.audio.midi(n[2] + ML().octaveFor(D), { vel: .6 }); } }
    draw(); inspector();
  }
  function onMove(e) {
    const r = S.cv.getBoundingClientRect(), px = e.clientX - r.left, py = e.clientY - r.top;
    if (S.pointers.has(e.pointerId)) S.pointers.set(e.pointerId, { x: px, y: py });
    if (S.pinch && S.pointers.size === 2) { const [a, b] = [...S.pointers.values()], d = Math.hypot(a.x - b.x, a.y - b.y); setZoom(S.pinch.z * d / S.pinch.d, S.pinch.x, (a.x + b.x) / 2); return; }
    const G = S.drag;
    if (!G) { const H2 = hit(px, py); S.cv.style.cursor = H2.part === 'left' || H2.part === 'right' || H2.part === 'syl' || H2.lane === 'tempo' && H2.k != null ? 'ew-resize' : H2.k != null ? 'grab' : 'default'; return; }
    if (Math.abs(px - G.px) + Math.abs(py - G.py) > 3) G.moved = true; if (!G.moved) return;
    const D = S.D, x = xt(px), dx = (px - G.px) / S.zoom, free = e.altKey || G.free, H2 = G.H;
    if (G.kind === 'range') { const a = snapT(xt(G.px), free), b = snapT(x, free); S.range = [Math.min(a, b), Math.max(a, b)]; draw(); return; }
    if (G.kind === 'marquee') { S.marquee.x1 = px; S.marquee.y1 = py; const L = laneOf('notes'), rg = noteRange(), rh = L.h / (rg[1] - rg[0] + 1), m = S.marquee;
      const xa = xt(Math.min(m.x0, m.x1)), xb = xt(Math.max(m.x0, m.x1)), ya = Math.min(m.y0, m.y1), yb = Math.max(m.y0, m.y1);
      S.sel = { k: 'notes', i: D.notes.map((n, i) => (n[0] + n[1] >= xa && n[0] <= xb && noteY(L, n[2], rg, rh) + rh >= ya && noteY(L, n[2], rg, rh) <= yb) ? i : -1).filter(i => i >= 0) }; draw(); return; }
    if (G.kind !== 'item') return;
    if (!G.pushed) { S.undo.push({ label: t(H2.part === 'body' ? 'le.u.move' : 'le.u.resize') + ' · ' + t('le.t.' + (H2.lane === 'tab' ? 'notes' : H2.lane)), at: Date.now(), d: G.before }); S.redo = []; G.pushed = true; }
    const O = G.orig, k = H2.k;
    if (H2.lane === 'chords') {
      const c = D.chords, lim = (i, v) => Math.max(i > 0 ? c[i - 1].t + .02 : 0, Math.min(i + 1 < c.length ? c[i + 1].t - .02 : dur(), v));
      if (H2.part === 'left') c[k].t = lim(k, snapT(O.chords[k].t + dx, free));
      else if (H2.part === 'right') { if (k + 1 < c.length) c[k + 1].t = lim(k + 1, snapT(O.chords[k + 1].t + dx, free)); }
      else { const nt = snapT(O.chords[k].t + dx, free), d2 = nt - O.chords[k].t; c[k].t = lim(k, nt); if (k + 1 < c.length) c[k + 1].t = lim(k + 1, O.chords[k + 1].t + d2); }
      S.editedChord[k] = true;
    } else if (H2.lane === 'notes') {
      const L = laneOf('notes'), rg = noteRange(), rh = L.h / (rg[1] - rg[0] + 1), dm = -Math.round((py - G.py) / rh);
      if (H2.part === 'right') S.sel.i.forEach(i => { D.notes[i][1] = Math.max(.03, Math.round((O.notes[i][1] + dx) * 1000) / 1000); });
      else S.sel.i.forEach(i => { D.notes[i][0] = Math.max(0, (S.sel.i.length === 1 ? snapT(O.notes[i][0] + dx, free) : Math.round((O.notes[i][0] + dx) * 1000) / 1000)); D.notes[i][2] = O.notes[i][2] + dm; if (dm) { D.notes[i].length = 3; } });
    } else if (H2.lane === 'rhythm' && H2.part === 'left') {
      const nb = Math.round(beatAt(x)); D.rhythm[k].from = Math.max(D.rhythm[k - 1].from + 1, Math.min(rhEnd(k) - 1, nb));
    } else if (H2.lane === 'lyrics') {
      const ln = D.lyrics[k], o = O.lyrics[k];
      if (H2.part === 'syl') ln.syl[H2.si].t = Math.max(ln.t, Math.min(ln.e, Math.round((o.syl[H2.si].t + dx) * 1000) / 1000));
      else if (H2.part === 'left') ln.t = Math.min(ln.e - .1, snapT(o.t + dx, free));
      else if (H2.part === 'right') ln.e = Math.max(ln.t + .1, snapT(o.e + dx, free));
      else { const d2 = snapT(o.t + dx, free) - o.t; ln.t = o.t + d2; ln.e = o.e + d2; (ln.syl || []).forEach((s, i) => { s.t = Math.round((o.syl[i].t + d2) * 1000) / 1000; }); }
    } else if (H2.lane === 'tempo') {
      const b = D.beats; b[k] = Math.round(Math.max(k > 0 ? b[k - 1] + .05 : 0, Math.min(k + 1 < b.length ? b[k + 1] - .05 : dur(), O.beats[k] + dx)) * 1000) / 1000;
    } else if (H2.lane === 'sections') {
      const s = D.sections[k], o = O.sections[k], nb = Math.round(beatAt(x));
      if (H2.part === 'left') { s.from = Math.max(k > 0 ? D.sections[k - 1].from + 1 : 0, Math.min(s.to - 1, nb)); if (k > 0) D.sections[k - 1].to = s.from; }
      else if (H2.part === 'right') { s.to = Math.min(k + 1 < D.sections.length ? D.sections[k + 1].to - 1 : D.beats.length - 1, Math.max(s.from + 1, nb)); if (k + 1 < D.sections.length) D.sections[k + 1].from = s.to; }
      void o;
    }
    draw(); inspector(true);
  }
  function onUp(e) {
    S.pointers.delete(e.pointerId); if (S.pointers.size < 2) S.pinch = null;
    const G = S.drag; S.drag = null; if (!G) return;
    if (G.kind === 'range' && !G.moved) { S.range = null; seek(snapT(G.H.x, true)); }
    else if (G.kind === 'seek' && !G.moved) seek(G.H.x);
    else if (G.kind === 'marquee') { S.marquee = null; draw(); inspector(); }
    else if (G.kind === 'item' && G.moved) { norm(); touched(); }
    else draw();
  }
  function onDbl(e) {
    const r = S.cv.getBoundingClientRect(), px = e.clientX - r.left, py = e.clientY - r.top, H2 = hit(px, py), D = S.D, x = snapT(H2.x, e.altKey);
    if (H2.lane === 'chords') {
      if (H2.k != null && H2.part === 'body') { S.sel = { k: 'chords', i: [H2.k] }; inspector(); const f = S.insp.querySelector('select'); if (f) f.focus(); return; }
      insertChord(x);
    } else if (H2.lane === 'notes' && H2.k == null) {
      const len = Math.max(.1, (D.beats[1] - D.beats[0]) / 2);
      change(t('le.u.add') + ' · ' + t('le.t.notes'), () => D.notes.push([x, Math.round(len * 1000) / 1000, H2.m]));
      S.sel = { k: 'notes', i: [D.notes.findIndex(n => n[0] === x && n[2] === H2.m)] }; inspector(); draw();
    } else if (H2.lane === 'rhythm') {
      const b = Math.round(beatAt(H2.x)), cur = ML().pattern ? D.rhythm.filter(rr => rr.from <= b).pop() : null;
      if (!cur || cur.from === b) return;
      change(t('le.u.split') + ' · ' + t('le.t.rhythm'), () => D.rhythm.push(Object.assign(clone(cur), { from: b })));
      S.sel = { k: 'rhythm', i: [D.rhythm.findIndex(rr => rr.from === b)] }; inspector(); draw();
    } else if (H2.lane === 'lyrics' && H2.k == null) addLine(x);
    else if (H2.lane === 'sections') splitSection(Math.round(beatAt(H2.x)));
  }
  function onWheel(e) {
    e.preventDefault();
    const r = S.cv.getBoundingClientRect(), px = e.clientX - r.left;
    if (e.ctrlKey || e.metaKey) setZoom(S.zoom * Math.exp(-e.deltaY * .0025), xt(px), px);
    else { const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.shiftKey ? e.deltaY : e.deltaY; S.x0 = Math.max(0, Math.min(dur() - 2, S.x0 + d / S.zoom)); draw(); }
  }
  function setZoom(z, at, px) { const W = S.cv.clientWidth - S.head; S.zoom = Math.max(W / Math.max(5, dur()), Math.min(1600, z)); if (at != null) S.x0 = Math.max(0, at - (px - S.head) / S.zoom); draw(); }

  /* ---------------- edit actions ---------------- */
  function insertChord(x) {
    const D = S.D, c = ML().chordAt(D, x);
    if (D.chords.some(cc => Math.abs(cc.t - x) < .02)) return;
    change(t('le.u.add') + ' · ' + t('le.t.chords'), () => D.chords.push({ t: x, chord: c ? c.chord : 'C' }));
    S.sel = { k: 'chords', i: [D.chords.findIndex(cc => cc.t === x)] }; inspector(); draw();   // the keys stay on the timeline (Delete, S, arrows); a double-click opens the name
  }
  function splitAt(x) {
    const D = S.D, s = S.sel;
    if (s && s.k === 'notes') { change(t('le.u.split') + ' · ' + t('le.t.notes'), () => s.i.forEach(i => { const n = D.notes[i]; if (x > n[0] + .02 && x < n[0] + n[1] - .02) { D.notes.push([x, Math.round((n[0] + n[1] - x) * 1000) / 1000, n[2]]); n[1] = Math.round((x - n[0]) * 1000) / 1000; } })); return; }
    if (s && s.k === 'sections') return splitSection(Math.round(beatAt(x)));
    insertChord(x);   // splitting a chord = the same chord starting again here, ready to be renamed
  }
  function splitSection(b) {
    const D = S.D, k = D.sections.findIndex(s => s.from < b && b < s.to); if (k < 0) return;
    change(t('le.u.split') + ' · ' + t('le.t.sections'), () => { const s = D.sections[k]; D.sections.splice(k + 1, 0, Object.assign(clone(s), { from: b })); s.to = b; });
  }
  function addLine(x) {
    const D = S.D; change(t('le.addLine'), () => { (D.lyrics = D.lyrics || []).push({ t: x, e: Math.min(dur(), x + 3), text: '…', syl: [], src: 'owner' }); });
    S.sel = { k: 'lyrics', i: [S.D.lyrics.findIndex(l => l.t === x)] }; inspector(); draw();
  }
  function del() {
    const s = S.sel, D = S.D; if (!s) return;
    change(t('le.u.del') + ' · ' + t('le.t.' + s.k), () => {
      const idx = s.i.slice().sort((a, b) => b - a);
      if (s.k === 'chords') idx.forEach(i => D.chords.splice(i, 1));
      else if (s.k === 'notes') idx.forEach(i => D.notes.splice(i, 1));
      else if (s.k === 'lyrics') idx.forEach(i => D.lyrics.splice(i, 1));
      else if (s.k === 'rhythm') idx.forEach(i => { if (i > 0) D.rhythm.splice(i, 1); });
      else if (s.k === 'sections') idx.forEach(i => { if (D.sections.length > 1) { const sc = D.sections[i]; if (i > 0) D.sections[i - 1].to = sc.to; else D.sections[1].from = sc.from; D.sections.splice(i, 1); } });
    });
    S.sel = null; inspector(); draw();
  }
  function copy() {
    const D = S.D;
    if (S.sel && S.sel.k === 'notes') { const ns = S.sel.i.map(i => D.notes[i]), t0 = Math.min(...ns.map(n => n[0])); S.clip = { k: 'notes', items: ns.map(n => [n[0] - t0, n[1], n[2]]) }; PD.ui.toast(t('le.copied', { n: ns.length })); return; }
    const [a, b] = S.range || (S.sel && S.sel.k === 'chords' ? [D.chords[S.sel.i[0]].t, chEnd(S.sel.i[S.sel.i.length - 1])] : [null, null]); if (a == null) return;
    const items = D.chords.filter((c, k) => c.t >= a - 1e-3 && c.t < b - 1e-3).map(c => Object.assign({}, c, { t: c.t - a }));
    const head = ML().chordAt(D, a); if (head && !items.some(c => c.t < .001)) items.unshift(Object.assign({}, head, { t: 0 }));
    S.clip = { k: 'chords', items, len: b - a }; PD.ui.toast(t('le.copied', { n: items.length }));
  }
  function paste(at) {
    const c = S.clip, D = S.D; if (!c) return;
    change(t('le.u.paste'), () => {
      if (c.k === 'notes') c.items.forEach(n => D.notes.push([Math.round((at + n[0]) * 1000) / 1000, n[1], n[2]]));
      else { const end = at + c.len, after = ML().chordAt(D, end); D.chords = D.chords.filter(x => x.t < at - 1e-3 || x.t >= end - 1e-3); c.items.forEach(x => D.chords.push(Object.assign({}, x, { t: Math.round((at + x.t) * 1000) / 1000 }))); if (after && !D.chords.some(x => Math.abs(x.t - end) < .01)) D.chords.push(Object.assign({}, after, { t: Math.round(end * 1000) / 1000 })); }
    });
    PD.ui.toast(t('le.pasted', { n: c.items.length }));
  }
  function duplicate() { if (!S.range) { if (S.sel && S.sel.k === 'chords') { const a = S.D.chords[S.sel.i[0]].t, b = chEnd(S.sel.i[S.sel.i.length - 1]); S.range = [a, b]; } else return; } copy(); paste(S.range[1]); const L = S.range[1] - S.range[0]; S.range = [S.range[1], S.range[1] + L]; draw(); }
  function nudge(ms) {
    const s = S.sel, D = S.D; if (!s) return;
    change(t('le.u.move') + ' · ' + t('le.t.' + s.k), () => s.i.forEach(i => {
      if (s.k === 'chords') D.chords[i].t = Math.max(0, Math.round((D.chords[i].t + ms / 1000) * 1000) / 1000);
      else if (s.k === 'notes') D.notes[i][0] = Math.max(0, Math.round((D.notes[i][0] + ms / 1000) * 1000) / 1000);
      else if (s.k === 'lyrics') { const l = D.lyrics[i]; l.t += ms / 1000; l.e += ms / 1000; (l.syl || []).forEach(y => { y.t = Math.round((y.t + ms / 1000) * 1000) / 1000; }); }
      else if (s.k === 'tempo') D.beats[i] = Math.round((D.beats[i] + ms / 1000) * 1000) / 1000;
    }));
  }
  function onKey(e) {
    if (!S || !S.root.isConnected) return;
    const tg = e.target, typing = tg && (tg.tagName === 'INPUT' || tg.tagName === 'TEXTAREA' || tg.tagName === 'SELECT' || tg.isContentEditable);
    const mod = e.metaKey || e.ctrlKey, k = e.key;
    if (mod && (k === 'z' || k === 'Z')) { e.preventDefault(); if (e.shiftKey) redo(); else undo(); return; }
    if (mod && (k === 'y' || k === 'Y')) { e.preventDefault(); redo(); return; }
    if (mod && (k === 's' || k === 'S')) { e.preventDefault(); save(); return; }
    if (typing) return;
    if (k === ' ') { e.preventDefault(); playPause(); }
    else if (k === 'Enter' || k === 'Home') { e.preventDefault(); stop(); }
    else if (k === 'Delete' || k === 'Backspace') { e.preventDefault(); del(); }
    else if (mod && (k === 'c' || k === 'C')) { e.preventDefault(); copy(); }
    else if (mod && (k === 'v' || k === 'V')) { e.preventDefault(); paste(snapT(S.audio.currentTime)); }
    else if (mod && (k === 'd' || k === 'D')) { e.preventDefault(); duplicate(); }
    else if (k === 's' || k === 'S') splitAt(snapT(S.audio.currentTime));
    else if (k === 'i' || k === 'I') insertChord(snapT(S.audio.currentTime));
    else if (k === 'l' || k === 'L') { S.loop = !S.loop; paintHead(); draw(); }
    else if (k === 'b' || k === 'B') { S.mode = S.mode === 'time' ? 'bars' : 'time'; paintHead(); draw(); inspector(); }
    else if (k === 'n' || k === 'N') { S.snap = S.snap === 'off' ? 'beat' : 'off'; paintHead(); }
    else if (k === '+' || k === '=') setZoom(S.zoom * 1.4, S.audio.currentTime, tx(S.audio.currentTime));
    else if (k === '-' || k === '_') setZoom(S.zoom / 1.4, S.audio.currentTime, tx(S.audio.currentTime));
    else if (k === 'ArrowLeft' || k === 'ArrowRight') { e.preventDefault(); const ms = (k === 'ArrowLeft' ? -1 : 1) * (e.altKey ? 1 : e.shiftKey ? 100 : 10); if (S.sel) nudge(ms); else seek(S.audio.currentTime + ms / 100); }
    else if (k === 'Escape') { if (S.sel || S.range) { S.sel = null; S.range = null; draw(); inspector(); } else close(); }
  }

  /* ---------------- inspector ---------------- */
  const field = (label, input) => h('label', { class: 'le-f' }, [h('span', { text: label }), input]);
  const num = (v, on, step) => { const i = h('input', { class: 'input', type: 'number', step: step || '0.001', value: String(v) }); i.onchange = () => { const x = parseFloat(i.value); if (isFinite(x)) on(x); }; return i; };
  const txt = (v, on) => { const i = h('input', { class: 'input', type: 'text', value: v || '' }); i.onchange = () => on(i.value); return i; };
  const sel2 = (opts, v, on) => { const s = h('select', { class: 'input' }, opts.map(o => Array.isArray(o) ? h('option', { value: o[0], text: o[1], selected: o[0] === v }) : h('optgroup', { label: o.g }, o.items.map(x => h('option', { value: x[0], text: x[1], selected: x[0] === v }))))); s.onchange = () => on(s.value); return s; };
  function chordOptions() {
    const Q = (PD.theory.CHORD_TYPES || []).map(x => x.k), out = [['N.C.', t('le.nc')]];
    NAMES.forEach(r => out.push({ g: r, items: Q.map(q => [r + q, r + q]) }));
    out.push(['__custom', t('le.custom')]);
    return out;
  }
  function rhythmOptions() {
    const C = PD.curriculum, pk = r => [r.id, PD.i18n.pick(r.name)];
    return [{ g: t('rh.teacherSec'), items: C.rhythms().map(pk) }, { g: t('rh.regionSec'), items: (C.regionalRhythms ? C.regionalRhythms() : []).map(pk) }, { g: t('rh.commonSec'), items: C.commonRhythms().map(pk) }, ['custom', t('le.customR')]];
  }
  function inspector(light) {
    if (!S) return;
    if (light && S.insp._sel === JSON.stringify(S.sel) && !S.drag) return;
    const box = S.insp; box.innerHTML = ''; box._sel = JSON.stringify(S.sel);
    const D = S.D, s = S.sel, mut = (label, fn) => change(label, fn);
    const rv = (S.review || []).filter(r => { const x = S.audio.currentTime; return x >= r.from - .5 && x <= r.to + .5 && r.to - r.from < dur() * .9; });
    if (!s || !s.i.length) {
      box.append(h('h3', { 'data-t': S.focus === 'tempo' ? 'le.t.tempo' : 'le.meta' }));
      if (S.focus === 'tempo') {
        const bpm = h('input', { class: 'input', type: 'number', step: '0.1', placeholder: Math.round(D.bpm) + '' });
        box.append(field(t('le.bpmSet'), bpm), h('button', { class: 'btn small', 'data-t': 'le.apply', onclick: () => { const v = parseFloat(bpm.value); if (!(v > 20 && v < 300) || !S.range) return; mut(t('le.t.tempo'), () => { const a = Math.ceil(beatAt(S.range[0]) - 1e-6), b = Math.floor(beatAt(S.range[1]) + 1e-6); for (let i = a + 1; i <= b && i < D.beats.length; i++) D.beats[i] = Math.round((D.beats[a] + (i - a) * 60 / v) * 1000) / 1000; }); } }),
          field(t('le.shift'), num(0, v => mut(t('le.shift'), () => { D.beats = D.beats.map(b => Math.round((b + v / 1000) * 1000) / 1000); D.chords.forEach(c => { c.t = Math.round((c.t + v / 1000) * 1000) / 1000; }); }), '1')));
      } else {
        D.title = D.title || { ka: '', en: '' };
        box.append(field(t('le.titleKa'), txt(D.title.ka, v => mut(t('le.meta'), () => { D.title.ka = v; }))), field(t('le.titleEn'), txt(D.title.en, v => mut(t('le.meta'), () => { D.title.en = v; }))),
          field(t('le.artistKa'), txt(D.artist && D.artist.ka, v => mut(t('le.meta'), () => { D.artist = Object.assign({}, D.artist, { ka: v }); }))), field(t('le.artistEn'), txt(D.artist && D.artist.en, v => mut(t('le.meta'), () => { D.artist = Object.assign({}, D.artist, { en: v }); }))),
          field(t('le.level'), sel2([['1', t('lvl.1')], ['2', t('lvl.2')], ['3', t('lvl.3')]], String(D.level || 2), v => mut(t('le.level'), () => { D.level = +v; }))),
          field(t('le.key'), txt(D.key, v => mut(t('le.key'), () => { D.key = v; }))),
          field(t('le.bpb'), sel2([['2', '2'], ['3', '3'], ['4', '4'], ['5', '5'], ['6', '6'], ['7', '7']], String((D.meter || {}).beatsPerBar || 4), v => mut(t('le.meter'), () => { D.meter = Object.assign({}, D.meter, { beatsPerBar: +v }); D.meter.label = D.meter.sub === 3 ? (+v * 3) + '/8' : v + '/4'; }))),
          field(t('le.sub'), sel2([['2', '2 (♩ = ♪♪)'], ['3', '3 (♩. = ♪♪♪)']], String((D.meter || {}).sub || 2), v => mut(t('le.meter'), () => { D.meter = Object.assign({}, D.meter, { sub: +v }); D.meter.label = +v === 3 ? (D.meter.beatsPerBar * 3) + '/8' : D.meter.beatsPerBar + '/4'; }))),
          field(t('le.meter'), txt((D.meter || {}).label, v => mut(t('le.meter'), () => { D.meter = Object.assign({}, D.meter, { label: v }); }))),
          field(t('le.octave'), sel2([['', t('le.auto') + ' (' + ML().octaveFor(Object.assign({}, D, { octave: null })) / 12 + ')'], ['-12', '−1'], ['0', '0'], ['12', '+1'], ['24', '+2']], D.octave == null ? '' : String(D.octave), v => mut(t('le.octave'), () => { D.octave = v === '' ? null : +v; }))));
      }
    } else if (s.k === 'chords') {
      const k = s.i[0], c = D.chords[k]; if (!c) return;
      const opts = chordOptions(), known = c.chord == null ? 'N.C.' : opts.some(o => o.items ? o.items.some(x => x[0] === c.chord) : o[0] === c.chord) ? c.chord : '__custom';
      const custom = txt(known === '__custom' ? c.chord : '', v => mut(t('le.u.edit') + ' · ' + t('le.t.chords'), () => { c.chord = v.trim() || null; S.editedChord[k] = true; }));
      custom.hidden = known !== '__custom';
      const nameSel = sel2(opts, known, v => { if (v === '__custom') { custom.hidden = false; custom.focus(); return; } mut(t('le.u.edit') + ' · ' + t('le.t.chords'), () => { c.chord = v === 'N.C.' ? null : v; S.editedChord[k] = true; }); });
      const sh = ML().shape(c.play || c.chord);
      const playSel = sel2([['', t('le.same')]].concat(opts.filter(o => o.items).map(o => ({ g: o.g, items: o.items.filter(x => ML().shape(x[0]) && !ML().shape(x[0]).adapted) }))), c.play || '', v => mut(t('le.play2'), () => { if (v) c.play = v; else delete c.play; }));
      box.append(h('h3', { text: t('le.t.chords') + ' · ' + fmtPos(c.t) }), field(t('le.name'), nameSel), custom, field(t('le.play2'), playSel),
        !sh && c.chord ? h('p', { class: 'notice warn', text: t('le.noShape') }) : sh && sh.adapted && !c.play ? h('p', { class: 'muted', text: t('le.adapted', { a: c.chord, b: sh.name }) }) : null,
        sh ? h('div', { class: 'le-neck', html: ML().chordSVG(sh) }) : null,
        h('div', { class: 'le-2' }, [field(t('le.start') + ' (s)', num(c.t.toFixed(3), v => mut(t('le.u.move'), () => { c.t = Math.max(0, v); }))), field(t('le.end') + ' (s)', num(chEnd(k).toFixed(3), v => { if (D.chords[k + 1]) mut(t('le.u.resize'), () => { D.chords[k + 1].t = Math.max(c.t + .02, v); }); }))]),
        S.conf && S.conf[k] != null ? h('small', { class: 'muted', text: t('le.conf', { p: Math.round(S.conf[k] * 100) }) }) : null,
        h('div', { class: 'row', style: 'gap:6px;flex-wrap:wrap' }, [
          h('button', { class: 'btn small', 'data-t': 'le.hear', onclick: () => { if (sh && PD.audio.ensure()) PD.audio.strum(sh.frets, 'down', {}); } }),
          h('button', { class: 'btn small', 'data-t': 'le.split', onclick: () => splitAt(snapT(S.audio.currentTime)) }),
          h('button', { class: 'btn small', 'data-t': 'le.dup', onclick: duplicate }),
          h('button', { class: 'btn small ghost danger', 'data-t': 'le.delete', onclick: del })]));
    } else if (s.k === 'notes') {
      const oct = ML().octaveFor(D), TB = ML().tab(D);
      if (s.i.length > 1) box.append(h('h3', { text: t('le.t.notes') + ' × ' + s.i.length }), h('div', { class: 'row', style: 'gap:6px' }, [h('button', { class: 'btn small', 'data-t': 'le.octUp', onclick: () => mut(t('le.octUp'), () => s.i.forEach(i => { D.notes[i][2] += 12; D.notes[i].length = 3; })) }), h('button', { class: 'btn small', 'data-t': 'le.octDown', onclick: () => mut(t('le.octDown'), () => s.i.forEach(i => { D.notes[i][2] -= 12; D.notes[i].length = 3; })) }), h('button', { class: 'btn small ghost danger', 'data-t': 'le.delete', onclick: del })]));
      else {
        const i = s.i[0], n = D.notes[i], tb = TB.notes[i]; if (!n) return;
        const ms = []; for (let m = 36; m <= 96; m++) ms.push([String(m), midiName(m)]);
        const strSel = sel2([['', t('le.auto')], ['1', PD.theory.stringName(1)], ['2', PD.theory.stringName(2)], ['3', PD.theory.stringName(3)]], n[3] ? String(n[3]) : '', v => mut(t('le.string'), () => { if (!v) n.length = 3; else { n[3] = +v; n[4] = Math.max(0, Math.round(n[2] + oct - PD.theory.midi(+v, 0))); } }));
        const fr = num(tb && tb.f != null ? tb.f : '', v => mut(t('le.fret'), () => { const st = n[3] || (tb && tb.s) || 1; n[3] = st; n[4] = Math.max(0, Math.min(17, Math.round(v))); }), '1');
        const bad = n[2] + oct < LO || n[2] + oct > HI;
        box.append(h('h3', { text: t('le.t.notes') + ' · ' + midiName(n[2]) + (oct ? ' (' + midiName(n[2] + oct) + ')' : '') }),
          field(t('le.pitch'), sel2(ms, String(n[2]), v => mut(t('le.u.edit') + ' · ' + t('le.t.notes'), () => { n[2] = +v; n.length = 3; }))),
          h('div', { class: 'le-2' }, [field(t('le.start') + ' (s)', num(n[0].toFixed(3), v => mut(t('le.u.move'), () => { n[0] = Math.max(0, v); }))), field(t('le.dur') + ' (s)', num(n[1].toFixed(3), v => mut(t('le.u.resize'), () => { n[1] = Math.max(.02, v); })))]),
          h('div', { class: 'le-2' }, [field(t('le.string'), strSel), field(t('le.fret'), fr)]),
          bad ? h('p', { class: 'notice warn', text: t('le.impossible', { m: midiName(n[2] + oct) }) }) : null,
          tb && tb.own && !tb.ok ? h('p', { class: 'notice warn', text: t('le.badTab', { s: PD.theory.stringName(n[3]), f: n[4], m: midiName(Math.round(PD.theory.midi(n[3], n[4]))) }) }) : null,
          h('div', { class: 'row', style: 'gap:6px;flex-wrap:wrap' }, [h('button', { class: 'btn small', 'data-t': 'le.hear', onclick: () => PD.audio.ensure() && PD.audio.midi(n[2] + oct, {}) }), h('button', { class: 'btn small', 'data-t': 'le.octUp', onclick: () => mut(t('le.octUp'), () => { n[2] += 12; n.length = 3; }) }), h('button', { class: 'btn small', 'data-t': 'le.octDown', onclick: () => mut(t('le.octDown'), () => { n[2] -= 12; n.length = 3; }) }), h('button', { class: 'btn small', 'data-t': 'le.split', onclick: () => splitAt(S.audio.currentTime) }), h('button', { class: 'btn small ghost danger', 'data-t': 'le.delete', onclick: del })]));
      }
    } else if (s.k === 'rhythm') {
      const k = s.i[0], r = D.rhythm[k]; if (!r) return;
      const P = ML().pattern(r), strokes = h('div', { class: 'le-strokes' });
      const KIND = [['down', t('le.s.down')], ['up', t('le.s.up')], ['downA', t('le.s.downA')], ['upA', t('le.s.upA')], ['rest', t('le.s.rest')], ['mute', t('le.s.mute')], ['s1', t('le.s.str', { s: PD.theory.stringName(1) })], ['s2', t('le.s.str', { s: PD.theory.stringName(2) })], ['s3', t('le.s.str', { s: PD.theory.stringName(3) })]];
      const kindOf = x => x.str ? 's' + x.str : x.acc ? x.dir + 'A' : x.dir;
      const toCustom = () => { if (r.id !== 'custom') { const pp = ML().pattern(r); r.id = 'custom'; r.strokes = pp.strokes.map(x => ({ dir: x.dir, pos: +x.pos.toFixed(3), acc: x.acc, str: x.str || undefined })); delete r.pos; delete r.restPos; } };
      P.strokes.forEach((x, j) => strokes.append(h('div', { class: 'le-2' }, [sel2(KIND, kindOf(x), v => mut(t('le.strokes'), () => { toCustom(); const st = r.strokes[j]; delete st.str; if (/^s\d$/.test(v)) { st.dir = 'down'; st.str = +v[1]; st.acc = false; } else { st.dir = v.replace('A', ''); st.acc = /A$/.test(v); } })),
        h('div', { class: 'row', style: 'gap:4px' }, [num(x.pos.toFixed(3), v => mut(t('le.pos'), () => { toCustom(); r.strokes[j].pos = Math.max(0, Math.min((r.span || 1) - .01, v)); }), '0.01'), h('button', { class: 'btn small ghost', text: '✕', onclick: () => mut(t('le.u.del'), () => { toCustom(); r.strokes.splice(j, 1); }) })])])));
      box.append(h('h3', { text: t('le.t.rhythm') + ' · ' + t('le.beat', { n: r.from }) }),
        field(t('le.rhythm'), sel2(rhythmOptions(), r.id, v => mut(t('le.rhythm'), () => { if (v === 'custom') toCustom(); else { r.id = v; delete r.strokes; delete r.pos; delete r.restPos; } }))),
        field(t('le.span'), sel2([['1', '1'], ['2', '2'], ['3', '3'], ['4', '4']], String(r.span || 1), v => mut(t('le.span'), () => { const old = r.span || 1; r.span = +v; if (r.strokes) r.strokes.forEach(x => { x.pos = +(x.pos * r.span / old).toFixed(3); }); }))),
        h('small', { class: 'muted', text: ML().patText(P) }), h('b', { 'data-t': 'le.strokes' }), strokes,
        h('div', { class: 'row', style: 'gap:6px;flex-wrap:wrap' }, [h('button', { class: 'btn small', 'data-t': 'le.addStroke', onclick: () => mut(t('le.addStroke'), () => { toCustom(); const last = r.strokes[r.strokes.length - 1]; r.strokes.push({ dir: last && last.dir === 'down' ? 'up' : 'down', pos: Math.min((r.span || 1) - .05, +((last ? last.pos : 0) + .25).toFixed(3)), acc: false }); }) }),
          h('button', { class: 'btn small', 'data-t': 'le.wholeSong', onclick: () => mut(t('le.wholeSong'), () => { D.rhythm = [Object.assign(clone(r), { from: 0 })]; S.sel = null; }) }),
          k > 0 ? h('button', { class: 'btn small ghost danger', 'data-t': 'le.delete', onclick: del }) : null]));
    } else if (s.k === 'lyrics') {
      const k = s.i[0], ln = D.lyrics[k]; if (!ln) return;
      box.append(h('h3', { text: t('le.t.lyrics') + ' · ' + fmtPos(ln.t) }),
        field(t('le.text'), txt(ln.text, v => mut(t('le.u.edit') + ' · ' + t('le.t.lyrics'), () => { ln.text = v; spread(ln); }))),
        h('div', { class: 'le-2' }, [field(t('le.start') + ' (s)', num(ln.t.toFixed(3), v => mut(t('le.u.move'), () => { ln.t = v; }))), field(t('le.end') + ' (s)', num(ln.e.toFixed(3), v => mut(t('le.u.resize'), () => { ln.e = Math.max(ln.t + .1, v); })))]),
        h('div', { class: 'row', style: 'gap:6px;flex-wrap:wrap' }, [h('button', { class: 'btn small', 'data-t': 'le.spread', onclick: () => mut(t('le.spread'), () => spread(ln)) }), h('button', { class: 'btn small', 'data-t': 'le.chordpro', onclick: chordPro }), h('button', { class: 'btn small ghost danger', 'data-t': 'le.delete', onclick: del })]));
    } else if (s.k === 'sections') {
      const k = s.i[0], sc = D.sections[k]; if (!sc) return;
      box.append(h('h3', { text: t('le.t.sections') }),
        field(t('le.kind'), sel2(['intro', 'verse', 'chorus', 'inst', 'solo', 'bridge', 'outro'].map(x => [x, t('ml.sec.' + x)]), sc.kind, v => mut(t('le.kind'), () => { sc.kind = v; }))),
        h('div', { class: 'le-2' }, [field(t('le.start'), num(sc.from, v => mut(t('le.u.move'), () => { sc.from = Math.round(v); if (k > 0) D.sections[k - 1].to = sc.from; }), '1')), field(t('le.end'), num(sc.to, v => mut(t('le.u.resize'), () => { sc.to = Math.round(v); if (D.sections[k + 1]) D.sections[k + 1].from = sc.to; }), '1'))]),
        h('small', { class: 'muted', text: fmtPos(timeAt(sc.from)) + ' – ' + fmtPos(timeAt(sc.to)) }),
        h('div', { class: 'row', style: 'gap:6px' }, [h('button', { class: 'btn small', 'data-t': 'le.split', onclick: () => splitSection(Math.round(beatAt(S.audio.currentTime))) }), h('button', { class: 'btn small ghost danger', 'data-t': 'le.delete', onclick: del })]));
    } else if (s.k === 'tempo') {
      const i = s.i[0];
      box.append(h('h3', { text: t('le.beat', { n: i }) }), field(t('le.time') + ' (s)', num(D.beats[i].toFixed(3), v => mut(t('le.t.tempo'), () => { D.beats[i] = v; }))),
        h('small', { class: 'muted', text: i + 1 < D.beats.length ? (60 / (D.beats[i + 1] - D.beats[i])).toFixed(1) + ' BPM' : '' }));
    }
    // what the analysis was unsure of, here (the owner's only)
    box.append(h('h3', { 'data-t': 'le.review', style: 'margin-top:12px' }), rv.length ? h('ul', { class: 'le-rv' }, rv.map(r => h('li', {}, [h('b', { text: r.what + ' · ' + fmt(r.from) }), h('span', { text: ' ' + (r.note || (r.heard ? JSON.stringify(r.heard) : '')) })]))) : h('p', { class: 'muted', 'data-t': 'le.reviewNone' }));
    PD.i18n.apply(box);
  }
  /** syllable times spread evenly over the line (keeps the owner's own when the count is the same) */
  function spread(ln) {
    const sy = ML().syllables(ln.text).filter(x => x.s.trim()), old = ln.syl || [];
    ln.syl = sy.map((x, k) => ({ i: x.i, t: old.length === sy.length ? old[k].t : Math.round((ln.t + (ln.e - ln.t) * k / sy.length) * 1000) / 1000 }));
  }
  /** lyrics with chords as text ([Am] …): edit, then apply — lines keep their times, chords land on their syllable's time */
  function chordPro() {
    const D = S.D, ly = D.lyrics || [];
    const text = ly.map(ln => { const sy = ln.syl && ln.syl.length ? ln.syl : []; let out = '', last = 0; const marks = []; (D.chords || []).forEach(c => { if (c.t < ln.t - .3 || c.t >= ln.e) return; let si = 0; sy.forEach((y, k) => { if (y.t <= c.t + .05) si = k; }); marks.push({ i: sy[si] ? sy[si].i : 0, n: c.chord || 'N.C.' }); });
      marks.sort((a, b) => a.i - b.i).forEach(m => { out += ln.text.slice(last, m.i) + '[' + m.n + ']'; last = m.i; }); return out + ln.text.slice(last); }).join('\n');
    PD.ui.sheet((box, close) => {
      const ta = h('textarea', { class: 'input le-cp', rows: '10', spellcheck: 'false' }); ta.value = text;
      box.append(h('h2', { 'data-t': 'le.chordpro' }), h('p', { class: 'muted', 'data-t': 'le.chordproD' }), ta, h('div', { class: 'row' }, [h('button', { class: 'btn primary', 'data-t': 'le.apply', onclick: () => { applyChordPro(ta.value); close(); } }), h('button', { class: 'btn', 'data-t': 'le.cancel', onclick: close })]));
    });
  }
  function applyChordPro(src) {
    const D = S.D, rows = src.split('\n').map(x => x.trim()).filter(Boolean);
    change(t('le.chordpro'), () => {
      D.lyrics = D.lyrics || [];
      rows.forEach((row, k) => {
        const marks = []; let plain = '';
        // the text without brackets, single-spaced; a chord belongs to the syllable that follows it ("[E] ხმლი" → ხმლი)
        row.replace(/\[([^\]]*)\]|([^[]+)/g, (m, ch, tx2) => { if (ch != null) marks.push({ i: plain.length, n: ch.trim() }); else for (const c of tx2) { if (/\s/.test(c) && (!plain.length || /\s$/.test(plain))) continue; plain += /\s/.test(c) ? ' ' : c; } return m; });
        marks.forEach(m => { while (plain[m.i] === ' ') m.i++; });
        if (/\s$/.test(plain)) plain = plain.replace(/\s+$/, '');
        let ln = D.lyrics[k];
        if (!ln) { const prev = D.lyrics[k - 1], t0 = prev ? prev.e + .3 : S.audio.currentTime; ln = { t: t0, e: Math.min(dur(), t0 + 3), text: plain, syl: [], src: 'owner' }; D.lyrics.push(ln); }
        ln.text = plain.trim(); spread(ln);
        marks.forEach(m => {
          let at = ln.t; ln.syl.forEach(y => { if (y.i <= m.i) at = y.t; });
          const nm = /^n\.?c\.?$/i.test(m.n) ? null : m.n;
          const near = D.chords.find(c => Math.abs(c.t - at) < .15);
          if (near) { near.chord = nm; near.t = at; } else D.chords.push({ t: at, chord: nm });   // the chord starts on its syllable
        });
      });
      D.lyrics.splice(rows.length);
    });
  }

  /* ---------------- frame ---------------- */
  function css() {
    if (document.getElementById('le-css')) return;
    document.head.appendChild(h('style', { id: 'le-css', text: `
.le{position:fixed;inset:0;z-index:60;background:#000;color:#ece9e4;display:flex;flex-direction:column;font:14px/1.35 system-ui,-apple-system,sans-serif}
.le-top{display:flex;align-items:center;gap:8px;padding:10px 12px;border-bottom:1px solid rgba(255,255,255,.08);background:rgba(18,18,20,.72);backdrop-filter:blur(22px) saturate(1.5);-webkit-backdrop-filter:blur(22px) saturate(1.5);flex-wrap:wrap}
.le-top h2{margin:0;font-size:16px;font-weight:700;letter-spacing:-.01em}.le-top .grow{flex:1;min-width:120px}
.le-pill{font-size:11px;padding:3px 9px;border-radius:99px;background:rgba(255,255,255,.08);white-space:nowrap}.le-pill.dirty{background:rgba(208,138,92,.22);color:#f0b48a}.le-pill.ver{background:rgba(110,200,140,.18);color:#8fd6a5}
.le-tr{display:flex;align-items:center;gap:6px;padding:8px 12px;border-bottom:1px solid rgba(255,255,255,.06);flex-wrap:wrap}
.le-tr .time{font:600 15px ui-monospace,SFMono-Regular,Menlo,monospace;min-width:108px;cursor:pointer;padding:4px 8px;border-radius:8px;background:rgba(255,255,255,.05)}
.le-tr select{width:auto;min-width:0;padding:6px 8px}
.le-ib{width:36px;height:36px;border-radius:10px;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.04);color:inherit;font-size:15px;cursor:pointer;display:inline-flex;align-items:center;justify-content:center}
.le-ib[aria-pressed=true]{background:rgba(208,138,92,.25);border-color:#d08a5c;color:#f0b48a}
.le-ib.pp{background:linear-gradient(180deg,#d08a5c,#a9603a);color:#140b06;border:0;width:42px;height:42px;border-radius:50%;font-weight:800}
.le-main{flex:1;display:grid;grid-template-columns:1fr 320px;min-height:0}
.le-tl{overflow:auto;position:relative;touch-action:pan-y}.le-tl canvas{display:block;width:100%;touch-action:none;user-select:none;-webkit-user-select:none}
.le-insp{border-left:1px solid rgba(255,255,255,.08);overflow:auto;padding:12px;display:flex;flex-direction:column;gap:8px;background:rgba(14,14,16,.9)}
.le-insp h3{margin:0;font-size:13px;color:#f0b48a;text-transform:uppercase;letter-spacing:.05em}
.le-f{display:flex;flex-direction:column;gap:3px;font-size:12px;color:#9a9aa0}.le-f .input{color:#ece9e4}
.le-2{display:grid;grid-template-columns:1fr 1fr;gap:6px}.le-strokes{display:flex;flex-direction:column;gap:4px}
.le-neck svg{width:100%;max-width:260px}.le-rv{margin:0;padding-left:16px;font-size:12px;color:#c8c4bf;display:flex;flex-direction:column;gap:4px}
.le-keys{font-size:11px;color:#7d7d84;padding:6px 12px;border-top:1px solid rgba(255,255,255,.06)}
.le-vlist{display:flex;flex-direction:column;gap:6px;max-height:40vh;overflow:auto}.le-vrow{display:flex;justify-content:space-between;align-items:center;gap:8px;padding:8px;border:1px solid rgba(255,255,255,.08);border-radius:10px}
.le-vrow div{display:flex;flex-direction:column}.le-cp{font:14px/1.5 ui-monospace,Menlo,monospace;min-height:180px}
.le-menu{position:absolute;right:12px;top:54px;z-index:5;background:rgba(24,24,27,.96);backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,.1);border-radius:14px;padding:6px;display:flex;flex-direction:column;min-width:220px;box-shadow:0 20px 50px rgba(0,0,0,.6)}
.le-menu button{text-align:left;background:none;border:0;color:inherit;padding:10px 12px;border-radius:9px;cursor:pointer;font:inherit}.le-menu button:hover{background:rgba(255,255,255,.07)}
@media (max-width:860px){.le-main{grid-template-columns:1fr;grid-template-rows:auto minmax(200px,42vh)}.le-insp{border-left:0;border-top:1px solid rgba(255,255,255,.1)}.le-keys{display:none}.le-top .btn{padding:6px 10px;font-size:13px}}
` }));
  }
  let headEls = null;
  function paintHead() {
    if (!S || !headEls) return;
    const ver = S.verifiedRev && S.verifiedRev === S.rev && !S.dirty;
    headEls.status.textContent = t('ml.st.' + (S.status || 'analysis-completed')); headEls.status.className = 'le-pill' + (ver ? ' ver' : '');
    headEls.dirty.hidden = !S.dirty; headEls.dirty.textContent = t('le.dirty');
    headEls.verify.textContent = t(ver ? 'le.unverify' : 'le.verify');
    headEls.undo.disabled = !S.undo.length; headEls.redo.disabled = !S.redo.length;
    headEls.pp.textContent = S.audio.paused ? '▶' : '❚❚';
    headEls.loop.setAttribute('aria-pressed', String(!!S.loop)); headEls.follow.setAttribute('aria-pressed', String(!!S.follow));
    headEls.mode.textContent = t('le.mode.' + S.mode); headEls.snap.value = S.snap;
    S.timeEl.textContent = fmtPos(S.audio.currentTime || 0);
    headEls.attach.hidden = !S.noAudio;
  }
  async function open(id, track) {
    if (!(PD.cloud && PD.cloud.isOwner)) { PD.ui.toast(t('le.noAllow')); return; }
    if (S) close();
    css();
    await ML().boot();
    const base = ML().data(id); if (!base) return;
    const root = h('div', { class: 'le', role: 'dialog', 'aria-modal': 'true', 'aria-label': t('le.title') });
    const audio = new Audio(); audio.preservesPitch = true; audio.mozPreservesPitch = true; audio.webkitPreservesPitch = true; audio.preload = 'auto';
    S = { id, D: clone(base), rev: 0, status: null, verifiedRev: null, dirty: false, undo: [], redo: [], sel: null, range: null, loop: false, follow: true, mode: 'time', snap: 'beat',
      zoom: 60, x0: 0, head: window.innerWidth < 700 ? 46 : 96, audio, peaks: null, root, focus: track && ['chords', 'notes', 'rhythm', 'lyrics', 'tab', 'tempo'].includes(track) ? track : 'chords', pointers: new Map(), editedChord: {}, review: [], conf: null };
    delete S.D._from; delete S.D._verified; norm();
    // the top bar
    const btn = (k, fn, cls) => h('button', { class: 'btn small' + (cls ? ' ' + cls : ''), 'data-t': k, onclick: fn });
    headEls = { status: h('span', { class: 'le-pill' }), dirty: h('span', { class: 'le-pill dirty', hidden: true }), verify: btn('le.verify', verify), undo: h('button', { class: 'le-ib', title: t('le.undo'), 'aria-label': t('le.undo'), text: '↶', onclick: undo }), redo: h('button', { class: 'le-ib', title: t('le.redo'), 'aria-label': t('le.redo'), text: '↷', onclick: redo }) };
    const menuBtn = h('button', { class: 'le-ib', 'aria-label': t('le.more'), text: '⋯' });
    menuBtn.onclick = () => {
      const old = root.querySelector('.le-menu'); if (old) { old.remove(); return; }
      const m = h('div', { class: 'le-menu', role: 'menu' }, [['le.revert', revert], ['le.history', history], ['le.chordpro', chordPro], ['le.attach', attach], ['le.upload', uploadAudio], ['le.loadAnalysis', () => PD.ui.confirm(t('le.analysisQ'), () => { const sh = ML().shipped(id); if (sh) { change(t('le.loadAnalysis'), () => {}); setData(sh); touched(); } })]]
        .map(([k, fn]) => h('button', { role: 'menuitem', 'data-t': k, onclick: () => { m.remove(); fn(); } })));
      root.append(m); PD.i18n.apply(m);
    };
    root.append(h('div', { class: 'le-top' }, [h('button', { class: 'le-ib', 'aria-label': t('le.close'), text: '✕', onclick: close }), h('div', { class: 'grow' }, [h('h2', { text: PD.i18n.pick(S.D.title) }), h('div', { class: 'row', style: 'gap:6px;margin-top:3px' }, [headEls.status, headEls.dirty])]),
      headEls.undo, headEls.redo, btn('le.save', () => save()), btn('le.preview', () => { ML().setPreview(id, strip(S.D)); close(); PD.app.go('lesson', id); }), btn('le.publish', publish, 'primary'), headEls.verify, menuBtn]));
    // transport
    S.timeEl = h('span', { class: 'time', title: t('le.mode.bars') + ' / ' + t('le.mode.time'), onclick: () => { S.mode = S.mode === 'time' ? 'bars' : 'time'; paintHead(); draw(); } });
    headEls.pp = h('button', { class: 'le-ib pp', 'aria-label': t('le.play'), text: '▶', onclick: playPause });
    headEls.loop = h('button', { class: 'le-ib', title: t('le.loop') + ' (L)', 'aria-label': t('le.loop'), text: '⟲', onclick: () => { S.loop = !S.loop; paintHead(); draw(); } });
    headEls.follow = h('button', { class: 'le-ib', title: t('le.follow'), 'aria-label': t('le.follow'), text: '⇥', onclick: () => { S.follow = !S.follow; paintHead(); } });
    headEls.mode = h('button', { class: 'btn small', onclick: () => { S.mode = S.mode === 'time' ? 'bars' : 'time'; paintHead(); draw(); } });
    headEls.snap = h('select', { class: 'input', 'aria-label': t('le.snap'), onchange: e => { S.snap = e.target.value; } }, [['beat', t('le.snap.beat')], ['1/2', '½'], ['1/3', '⅓'], ['1/4', '¼'], ['off', t('le.snap.off')]].map(([v, l]) => h('option', { value: v, text: t('le.snap') + ': ' + l })));
    const speed = h('select', { class: 'input', 'aria-label': t('ml.speed'), onchange: e => { audio.playbackRate = +e.target.value; } }, [1, .9, .8, .7, .6, .5].map(v => h('option', { value: String(v), text: Math.round(v * 100) + '%' })));
    headEls.attach = btn('le.attach', attach);
    root.append(h('div', { class: 'le-tr' }, [h('button', { class: 'le-ib', title: t('le.stop'), 'aria-label': t('le.stop'), text: '■', onclick: stop }), headEls.pp, S.timeEl,
      h('button', { class: 'le-ib', 'aria-label': t('le.zoomOut'), text: '−', onclick: () => setZoom(S.zoom / 1.4, audio.currentTime, tx(audio.currentTime)) }), h('button', { class: 'le-ib', 'aria-label': t('le.zoomIn'), text: '+', onclick: () => setZoom(S.zoom * 1.4, audio.currentTime, tx(audio.currentTime)) }),
      h('button', { class: 'btn small', 'data-t': 'le.fit', onclick: () => { S.x0 = 0; setZoom(0); } }), headEls.snap, headEls.loop, headEls.follow, headEls.mode, speed, headEls.attach]));
    S.cv = h('canvas', { 'aria-label': t('le.title') }); S.insp = h('div', { class: 'le-insp' });
    const tl = h('div', { class: 'le-tl' }, [S.cv]);
    root.append(h('div', { class: 'le-main' }, [tl, S.insp]), h('div', { class: 'le-keys', 'data-t': 'le.keys' }));
    document.body.appendChild(root); PD.i18n.apply(root);
    S.lid = PD.layers.push(() => close(true));
    S.cv.addEventListener('pointerdown', onDown); S.cv.addEventListener('pointermove', onMove); S.cv.addEventListener('pointerup', onUp); S.cv.addEventListener('pointercancel', onUp);
    S.cv.addEventListener('dblclick', onDbl); S.cv.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('keydown', onKey); S.onResize = () => draw(); window.addEventListener('resize', S.onResize);
    audio.onplay = audio.onpause = () => paintHead();
    S.zoom = Math.max(20, (S.cv.clientWidth - S.head) / 24);
    // the server's draft, the review notes, the recording
    const R = await ML().reviewData(), rv = R[id] || {}; S.review = rv.review || []; S.conf = rv.chordConfidence || null; S.status = rv.status || 'analysis-completed';
    const row = await loadServer(id);
    if (row && row.draft && row.draft.beats) { setData(row.draft); S.rev = row.rev; S.status = row.status; S.verifiedRev = row.verified_rev; S.conf = null; }
    else if (row) { S.rev = row.rev; S.status = row.status; }
    const wip = PD.store.get('le.wip.' + id, null);
    if (wip && wip.d && (wip.rev || 0) === (S.rev || 0) && JSON.stringify(wip.d) !== JSON.stringify(strip(S.D))) PD.ui.confirm(t('le.wip', { d: new Date(wip.at).toLocaleString() }), () => { change(t('le.restore'), () => {}); setData(wip.d); S.dirty = true; paintHead(); });
    if (track === 'verify') setTimeout(verify, 50);
    if (track === 'lyrics' && !(S.D.lyrics && S.D.lyrics.length)) setTimeout(chordPro, 50);
    paintHead(); draw(); inspector(); loadAudio(); S.raf = requestAnimationFrame(tick);
  }
  function close(fromBack) {
    if (!S) return; const s = S;
    if (s.dirty) PD.store.set('le.wip.' + s.id, { d: strip(s.D), at: Date.now(), rev: s.rev });
    s.audio.pause(); s.audio.src = ''; cancelAnimationFrame(s.raf);
    window.removeEventListener('keydown', onKey); window.removeEventListener('resize', s.onResize);
    if (fromBack !== true) PD.layers.done(s.lid);
    s.root.remove(); S = null; headEls = null;
    PD.lessons.reload(); PD.app.render && PD.app.render();
  }
  return { open, close, get state() { return S; } };
})();
