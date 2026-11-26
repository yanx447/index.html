/* =====================================================================
   PANDURI Creator — the owner's own studio for new lessons.

   Who: only the owner. The menu and the page appear when the server says
   so (cloud.isOwner ← rpc is_owner()), and that is only a convenience:
   every project is a lesson draft (song_lesson_drafts) that the database
   lets nobody else read, every write is a function that checks
   lesson_owner() — the owner's user id AND confirmed email — and the
   uploads sit in a private bucket only that account can read
   (migrations/202611250001_song_lessons.sql). Another account that opens
   #creator gets an empty page, and the API answers it 'not-allowed'.

   What: upload (drag & drop: WAV · FLAC · MP3 · M4A · AAC · AIFF · MIDI ·
   MP4), the lesson type, the details → a project. "Analyze with AI
   Studio" measures the real upload with Studio 3.0's own engines (chords
   and key: PD.ai.analyse; notes: Basic Pitch, PD.aimus; separation:
   Spleeter, PD.ai.separateExcerpt; metre and rhythm: PD.aimus) and with
   what Creator adds (PD.crdsp: a tempo that may move, strokes, the
   tablature). Nothing is invented: a step that cannot run says so.
   Everything lands on the editor's timeline (lessoned.js), where every
   item is editable; what the owner changed by hand is not replaced by a
   new analysis unless he ticks it.

   Storage: the project (all its tracks, the analysis, the review notes)
   is the draft on the server; the original files go to the private
   bucket when they are within its 50 MB limit, the working copy too; a
   larger original stays on this device and the project says so. A
   lesson is published into one or more sections (Songs · Melodies ·
   Solos · Teaching) from the one draft — never a copy per section; the
   recording becomes public only when the owner confirms he has the right.
   ===================================================================== */
PD.i18n.add({
  'cr.title': ['PANDURI Creator', 'PANDURI Creator'], 'cr.lead': ['შენი სტუდია ახალი გაკვეთილებისთვის: ატვირთე მუსიკა, AI Studio გააანალიზებს, შენ შეასწორებ და გამოაქვეყნებ.', 'Your studio for new lessons: upload music, AI Studio analyses it, you correct it and publish.'],
  'cr.only': ['ეს გვერდი მხოლოდ აპის მფლობელისთვისაა.', 'This page is for the app\'s owner only.'],
  'cr.m.new': ['ახალი გაკვეთილი', 'Create New Lesson'], 'cr.m.projects': ['ჩემი პროექტები', 'My Projects'], 'cr.m.published': ['გამოქვეყნებული', 'Published Lessons'], 'cr.m.drafts': ['შავი ვერსიები', 'Drafts'],
  'cr.m.analysis': ['AI ანალიზი', 'AI Analysis'], 'cr.m.chords': ['აკორდების რედაქტორი', 'Chord Editor'], 'cr.m.melody': ['მელოდია და სოლო', 'Melody & Solo Editor'], 'cr.m.rhythm': ['რითმის რედაქტორი', 'Rhythm Editor'], 'cr.m.tempo': ['ტემპის რუკა', 'Tempo Mapping'],
  'cr.m.newD': ['ფაილის ატვირთვა და დეტალები', 'Upload a file and fill in the details'], 'cr.m.projectsD': ['ყველა პროექტი', 'Every project'], 'cr.m.publishedD': ['რასაც მოსწავლეები ხედავენ', 'What learners see'], 'cr.m.draftsD': ['ჯერ გამოუქვეყნებელი', 'Not published yet'],
  'cr.m.analysisD': ['აკორდები · ნოტები · რითმი · ტემპი', 'Chords · notes · rhythm · tempo'], 'cr.m.chordsD': ['ზუსტ დროზე, ფანდურის პოზიციით', 'At the exact time, with the panduri position'], 'cr.m.melodyD': ['Piano Roll · ტაბულატურა · ყელი', 'Piano roll · tablature · neck'], 'cr.m.rhythmD': ['↓ ↑ · ყოველი დარტყმა ცალკე', '↓ ↑ · every stroke on its own'], 'cr.m.tempoD': ['ცვალებადი ტემპი, Tap, მეტრონომი', 'A moving tempo, tap, metronome'],
  'cr.pick': ['რომელი პროექტი?', 'Which project?'], 'cr.none': ['ჯერ პროექტი არ არის.', 'No projects yet.'], 'cr.open': ['გახსნა', 'Open'], 'cr.preview': ['მოსწავლის თვალით', 'Preview as Student'],
  'cr.drop': ['ჩააგდე ფაილები აქ ან აირჩიე', 'Drop files here or choose'], 'cr.dropD': ['WAV · FLAC · MP3 · M4A · AAC · AIFF · MIDI · MP4 (ვიდეოდან ხმა). რამდენიმე ფაილი: სრული მუსიკა, ფანდური, ვოკალი, დოლი, ბასი…', 'WAV · FLAC · MP3 · M4A · AAC · AIFF · MIDI · MP4 (the sound of a video). Several files: the full mix, the panduri, vocals, drums, bass…'],
  'cr.choose': ['ფაილების არჩევა', 'Choose files'], 'cr.role': ['რა არის', 'What it is'],
  'cr.role.mix': ['სრული მუსიკა', 'Full mix'], 'cr.role.panduri': ['ფანდური', 'Panduri'], 'cr.role.vocals': ['ვოკალი', 'Vocals'], 'cr.role.drums': ['დოლი', 'Drums'], 'cr.role.bass': ['ბასი', 'Bass'], 'cr.role.lead': ['წამყვანი ინსტრუმენტი', 'Lead instrument'], 'cr.role.other': ['სხვა', 'Other'], 'cr.role.midi': ['MIDI (ნოტები)', 'MIDI (notes)'],
  'cr.role.stem-vocals': ['ვოკალი (AI)', 'Vocals (AI)'], 'cr.role.stem-drums': ['დრამი (AI)', 'Drums (AI)'], 'cr.role.stem-bass': ['ბასი (AI)', 'Bass (AI)'], 'cr.role.stem-other': ['დანარჩენი (AI)', 'The rest (AI)'],
  'cr.f.titleKa': ['სახელი (ქართ.)', 'Title (Georgian)'], 'cr.f.titleEn': ['სახელი (ინგლ.)', 'Title (English)'], 'cr.f.artist': ['შემსრულებელი', 'Performer'], 'cr.f.genre': ['ჟანრი', 'Genre'], 'cr.f.level': ['სირთულე', 'Level'], 'cr.f.desc': ['აღწერა', 'Description'], 'cr.f.cover': ['სურათი', 'Cover'], 'cr.f.type': ['გაკვეთილის ტიპი', 'Lesson type'], 'cr.f.lyrics': ['ტექსტი (თუ აქვს) — ერთი სტრიქონი ერთ ხაზზე', 'Lyrics (if any) — one line per row'], 'cr.f.descEn': ['აღწერა (ინგლ.)', 'Description (English)'],
  'cr.type.song': ['სიმღერა', 'Song'], 'cr.type.songD': ['აკორდები, რითმი, ტექსტი', 'Chords, rhythm, lyrics'], 'cr.type.melody': ['მელოდია', 'Melody'], 'cr.type.melodyD': ['ნოტები, ტაბულატურა, შესრულება', 'Notes, tablature, performance'],
  'cr.type.solo': ['სოლო', 'Solo'], 'cr.type.soloD': ['დეტალური მელოდიური ტრანსკრიფცია', 'A detailed melodic transcription'], 'cr.type.full': ['სრული გაკვეთილი', 'Full lesson'], 'cr.type.fullD': ['ყველაფერი ერთად', 'Everything together'],
  'cr.create': ['პროექტის შექმნა', 'Create the project'], 'cr.creating': ['მზადდება… {s}', 'Preparing… {s}'], 'cr.reading': ['ვკითხულობ {f}', 'Reading {f}'], 'cr.uploading': ['იტვირთება {f} · {p}%', 'Uploading {f} · {p}%'],
  'cr.bad': ['{f}: ამ ფაილს ვერ ვკითხულობ.', '{f}: this file cannot be read.'], 'cr.noAudio': ['აუდიო ან MIDI ფაილი საჭიროა.', 'An audio or MIDI file is needed.'], 'cr.needTitle': ['ჩაწერე სახელი.', 'Enter a title.'],
  'cr.big': ['{f} {mb} MB-ია — ორიგინალი ამ მოწყობილობაზე რჩება (სერვერის ლიმიტი 50 MB); სამუშაო ასლი ინახება ანგარიშში.', '{f} is {mb} MB — the original stays on this device (the server limit is 50 MB); the working copy is kept in the account.'],
  'cr.localOnly': ['სერვერზე Creator-ის ცხრილი ჯერ არ არის (migration 202611250001) — პროექტი ამ მოწყობილობაზე ინახება.', 'The server has no Creator tables yet (migration 202611250001) — the project is kept on this device.'],
  'cr.created': ['პროექტი შეიქმნა', 'Project created'], 'cr.analyze': ['Analyze with AI Studio', 'Analyze with AI Studio'], 'cr.builder': ['Lesson Builder', 'Lesson Builder'],
  'cr.a.full': ['სრული ანალიზი', 'Full Analysis'], 'cr.a.chords': ['აკორდები', 'Detect Chords'], 'cr.a.melody': ['მელოდია', 'Detect Melody'], 'cr.a.rhythm': ['რითმი', 'Detect Rhythm'], 'cr.a.tempo': ['ტემპი', 'Detect Tempo'], 'cr.a.key': ['ტონალობა', 'Detect Key'],
  'cr.a.meter': ['ზომა', 'Detect Time Signature'], 'cr.a.lyrics': ['ტექსტის სინქრონი', 'Detect Lyrics Alignment'], 'cr.a.tab': ['ფანდურის ტაბულატურა', 'Generate Panduri Tablature'], 'cr.a.separate': ['ინსტრუმენტების გაყოფა', 'Separate Instruments'],
  'cr.a.melSrc': ['მელოდია რომელი ინსტრუმენტიდან', 'Melody from which instrument'], 'cr.a.rhySrc': ['რითმი რომელი ინსტრუმენტიდან', 'Rhythm from which instrument'],
  'cr.src.mix': ['სრული მუსიკა', 'The full mix'], 'cr.src.vocals': ['ვოკალის მელოდია (AI დაყოფით)', 'Vocal melody (AI separation)'], 'cr.src.other': ['წამყვანი ინსტრუმენტი: გიტარა · აკორდეონი · დუდუკი · ვიოლინო · პიანინო · სხვა (AI დაყოფით)', 'Lead instrument: guitar · accordion · duduk · violin · piano · other (AI separation)'],
  'cr.src.otherD': ['AI მოდელი ვოკალს, დრამს და ბასს ცალკე იღებს; დანარჩენი ინსტრუმენტები ერთ ხაზში რჩება. ზუსტი ინსტრუმენტისთვის ატვირთე მისი ცალკე ჩანაწერი.', 'The AI model takes vocals, drums and bass apart; the other instruments stay together in one line. For one exact instrument, upload its own recording.'],
  'cr.run': ['ანალიზის დაწყება', 'Start the analysis'], 'cr.step': ['{s}…', '{s}…'], 'cr.s.decode': ['აუდიოს კითხვა', 'Reading the audio'], 'cr.s.tempo': ['ტემპის რუკა (Creator) და დარტყმები (Studio)', 'Tempo map (Creator) and beats (Studio)'], 'cr.s.chords': ['აკორდები და ტონალობა', 'Chords and key'],
  'cr.s.meter': ['ზომა', 'Time signature'], 'cr.s.sep': ['ინსტრუმენტების გაყოფა {p}%', 'Separating instruments {p}%'], 'cr.s.rhythm': ['დარტყმები', 'Strokes'], 'cr.s.melody': ['მელოდია {p}%', 'Melody {p}%'], 'cr.s.tab': ['ტაბულატურა', 'Tablature'], 'cr.s.lyrics': ['ტექსტი', 'Lyrics'],
  'cr.res': ['შედეგი', 'Results'], 'cr.applyRes': ['Timeline-ზე დასმა', 'Put on the timeline'], 'cr.edited': ['შენ ხელით შეცვალე — არ ჩანაცვლდება, თუ არ მონიშნავ', 'you edited this by hand — not replaced unless you tick it'],
  'cr.r.beats': ['{n} დარტყმა · {a}–{b} BPM · Studio-სთან თანხვედრა {f}%', '{n} beats · {a}–{b} BPM · agreement with Studio {f}%'], 'cr.r.chords': ['{n} აკორდის ცვლილება · ტონალობა {k}', '{n} chord changes · key {k}'], 'cr.r.meter': ['ზომა {m}', 'Meter {m}'],
  'cr.r.strokes': ['{n} დარტყმა (მიმართულება ნავარაუდევია){r}', '{n} strokes (direction suggested){r}'], 'cr.r.notes': ['{n} ნოტი · {o} ფანდურის დიაპაზონს გარეთ', '{n} notes · {o} outside the panduri range'], 'cr.r.lyrics': ['{n} სტრიქონი', '{n} lines'], 'cr.r.stems': ['{n} ინსტრუმენტი', '{n} instruments'], 'cr.r.sections': ['{n} ნაწილი', '{n} parts'],
  'cr.r.rhy': [' · უახლოესი: {r}', ' · closest: {r}'], 'cr.fail': ['{s}: ვერ შესრულდა ({e})', '{s}: could not run ({e})'], 'cr.noLyrics': ['ტექსტი არ არის — ჩაწერე „დეტალებში" ან ChordPro-ში.', 'No lyrics — enter them in the details or in ChordPro.'],
  'cr.keepStems': ['დაყოფილი ინსტრუმენტების შენახვა ანგარიშშიც (საცავს იკავებს)', 'Keep the separated instruments in the account too (uses storage)'],
  'cr.b.lead': ['აირჩიე ეტაპები — გაკვეთილი მათით აეწყობა, იმავე მონაცემებიდან.', 'Choose the stages — the lesson is built from them, out of the same data.'],
  'cr.b.intro': ['1. მუსიკის გაცნობა', '1. Meet the music'], 'cr.b.chords': ['2. გამოყენებული აკორდები', '2. The chords it uses'], 'cr.b.rhythm': ['3. გამოყენებული რითმი', '3. The rhythm it uses'], 'cr.b.notes': ['4. მელოდიის ნოტები', '4. The melody\'s notes'],
  'cr.b.phrases': ['5. ფრაზების ვარჯიში', '5. Phrase practice'], 'cr.b.hard': ['6. რთული მონაკვეთები', '6. The hard passages'], 'cr.b.full': ['7. სრული შესრულება', '7. The whole piece'], 'cr.b.final': ['8. მიკროფონით საბოლოო შეფასება', '8. Final check with the microphone'],
  'cr.b.split': ['ფრაზებად დაყოფის შეთავაზება', 'Suggest the phrases'], 'cr.b.splitD': ['AI ნოტებს შორის პაუზებით ყოფს; Timeline-ზე „ნაწილებში" გადაწიე, გაყავი (S) ან გააერთიანე (Delete).', 'AI splits at the gaps between notes; on the timeline\'s Sections you move, split (S) or merge (Delete) them.'],
  'cr.b.split.done': ['{n} ფრაზა', '{n} phrases'], 'cr.b.noNotes': ['ჯერ ნოტები არ არის — გაუშვი „მელოდია".', 'No notes yet — run "Detect Melody".'],
  'cr.pub': ['გამოქვეყნება', 'Publish'], 'cr.pubUpd': ['გამოქვეყნებულის განახლება', 'Update Published Lesson'], 'cr.unpub': ['გამოქვეყნების გაუქმება', 'Unpublish'], 'cr.dup': ['პროექტის დუბლირება', 'Duplicate Project'], 'cr.delete': ['შავი ვერსიის წაშლა', 'Delete Draft'],
  'cr.cats': ['სად გამოჩნდეს (რამდენიმეც შეიძლება)', 'Where it appears (several are fine)'], 'cr.cat.songs': ['სიმღერები', 'Songs'], 'cr.cat.melodies': ['მელოდიები', 'Melodies'], 'cr.cat.solos': ['სოლოები', 'Solos'], 'cr.cat.teaching': ['სწავლება', 'Teaching'],
  'cr.pubAudio': ['ჩანაწერიც გამოქვეყნდეს — ვადასტურებ, რომ მისი გავრცელების უფლება მაქვს', 'Publish the recording too — I confirm I have the right to distribute it'],
  'cr.pubAudioD': ['თუ არ მონიშნავ, მოსწავლე საკუთარ ასლს ჩატვირთავს (სიგრძით მოწმდება) და ის მხოლოდ მის მოწყობილობაზე დარჩება.', 'If you leave it off, a learner loads their own copy (checked by its length), and it stays on their device only.'],
  'cr.oneSource': ['ყველა სექცია ერთსა და იმავე გაკვეთილს აჩვენებს — ასლი არ იქმნება.', 'Every section shows the one lesson — no copy is made.'], 'cr.noCat': ['აირჩიე ერთი სექცია მაინც.', 'Choose at least one section.'],
  'cr.pubDone': ['გამოქვეყნდა: {c}', 'Published: {c}'], 'cr.unpubQ': ['მოსწავლეებს ეს გაკვეთილი აღარ გამოუჩნდებათ (შავი ვერსია რჩება). გავაგრძელო?', 'Learners will no longer see this lesson (the draft stays). Continue?'], 'cr.unpubDone': ['გამოქვეყნება გაუქმდა', 'Unpublished'],
  'cr.delQ': ['წავშალო „{t}"? შავი ვერსია, ისტორია და ატვირთული ფაილები წაიშლება. ამის დაბრუნება ვერ მოხერხდება.', 'Delete “{t}”? The draft, its history and the uploaded files are removed. This cannot be undone.'], 'cr.delPub': ['ჯერ გამოქვეყნება გააუქმე.', 'Unpublish it first.'], 'cr.deleted': ['წაიშალა', 'Deleted'],
  'cr.dupDone': ['დუბლირებულია: {t}', 'Duplicated: {t}'], 'cr.copy': ['ასლი', 'copy'], 'cr.status': ['სტატუსი', 'Status'], 'cr.updated': ['განახლდა', 'Updated'], 'cr.in': ['სექციები', 'Sections'],
  'cr.localNote': ['ამ მოწყობილობაზე', 'On this device'], 'cr.fileOnDevice': ['ფაილი ამ მოწყობილობაზეა — სხვა მოწყობილობიდან ჩატვირთე ის ხელახლა.', 'The file is on this device — load it again on another device.'],
  'cr.storage': ['საცავი: ორიგინალები და სამუშაო ასლები პირად საცავშია (მხოლოდ შენთვის). საჯარო ხდება მხოლოდ ის ჩანაწერი, რომელსაც გამოქვეყნებისას თავად დაადასტურებ.', 'Storage: originals and working copies are in your private storage (yours only). A recording becomes public only when you confirm it on publishing.']
});

PD.creator = (() => {
  const h = PD.h, t = PD.i18n.t, ML = () => PD.musicLib, X = () => PD.crdsp;
  const owner = () => !!(PD.cloud && PD.cloud.isOwner), online = () => !!(PD.cloud && PD.cloud.configured && PD.cloud.user);
  const LOCAL = 'cr.local', BUCKET = 'creator-audio', LIMIT = 50 * 1024 * 1024, SR = 22050;
  const local = () => PD.store.get(LOCAL, {}) || {};
  const putLocal = (id, v) => { const m = local(); if (v) m[id] = v; else delete m[id]; PD.store.set(LOCAL, m); };
  const rpc = (fn, args) => PD.cloud.db.rpc(fn, args);
  const noMig = e => /PGRST20|relation|does not exist|404|42883|function/.test(e && (e.code || e.message) || '');
  const toast = (k, o, ms) => PD.ui.toast(t(k, o), ms || 3500);

  /* ---------------- projects on the server (and the fallback on this device) ---------------- */
  async function list() {
    const out = {};
    Object.keys(local()).forEach(id => { const L = local()[id]; out[id] = { id, title: L.draft.title, kind: L.draft.creator && L.draft.creator.type, status: L.status || 'not-analyzed', updated: L.at, local: true, published: false }; });
    if (online()) {
      try {
        const rows = await PD.cloud.db.select('song_lesson_drafts', { select: 'id,title,kind,status,rev,updated_at,verified_rev', creator: 'eq.true', order: 'updated_at.desc' }) || [];
        const pub = await PD.cloud.db.select('song_lessons', { select: 'id,published_rev,published_at,categories', id: 'like.cr-*' }).catch(() => []) || [];
        rows.forEach(r => { out[r.id] = { id: r.id, title: { ka: r.title, en: r.title }, kind: r.kind, status: r.status, updated: Date.parse(r.updated_at), rev: r.rev, published: false }; });
        pub.forEach(p => { if (out[p.id] && p.published_rev) Object.assign(out[p.id], { published: true, cats: p.categories || [], pubRev: p.published_rev }); });
      } catch (e) { list.err = e; }
    }
    return Object.values(out).sort((a, b) => (b.updated || 0) - (a.updated || 0));
  }
  async function draftOf(id) {
    if (online()) { try { const r = await PD.cloud.db.select('song_lesson_drafts', { select: 'draft', id: 'eq.' + id }); if (r && r[0] && r[0].draft && r[0].draft.beats) return r[0].draft; } catch (_) {} }
    const w = PD.store.get('le.wip.' + id, null); if (w && w.d) return w.d;
    const L = local()[id]; return L ? L.draft : null;
  }

  /* ---------------- files ---------------- */
  const EXT = /\.(wav|wave|flac|mp3|m4a|aac|aif|aiff|aifc|mid|midi|mp4|m4v|mov|webm|ogg|opus)$/i;
  const isMidi = f => /\.(mid|midi)$/i.test(f.name) || /midi/.test(f.type);
  const isAiff = f => /\.(aif|aiff|aifc)$/i.test(f.name) || /aiff/.test(f.type);
  async function decodeBuf(buf, f) {
    if (isAiff(f)) { try { const A = X().aiff(buf.slice(0)); return { sr: A.sr, ch: A.ch, duration: A.ch[0].length / A.sr }; } catch (_) {} }
    const ac = new (window.OfflineAudioContext || window.webkitOfflineAudioContext)(1, 1, 44100);
    const ab = await new Promise((res, rej) => { const p = ac.decodeAudioData(buf.slice(0), res, rej); if (p && p.then) p.then(res, rej); });
    return { sr: ab.sampleRate, ch: Array.from({ length: Math.min(2, ab.numberOfChannels) }, (_, i) => ab.getChannelData(i)), duration: ab.duration };
  }
  /** channels at another rate (and down to mono) — OfflineAudioContext does the resampling */
  async function render(A, sr, mono) {
    const n = Math.max(1, Math.ceil(A.duration * sr)), C = mono ? 1 : A.ch.length, oc = new OfflineAudioContext(C, n, sr), b = oc.createBuffer(A.ch.length, A.ch[0].length, A.sr);
    A.ch.forEach((c, i) => b.copyToChannel(c, i)); const s = oc.createBufferSource(); s.buffer = b; s.connect(oc.destination); s.start(0);
    const r = await oc.startRendering(); return Array.from({ length: C }, (_, i) => r.getChannelData(i));
  }
  const monoOf = async A => (await render(A, SR, true))[0];
  /** the working copy: 16-bit WAV that every browser plays — stereo 44.1 kHz when it fits in the bucket, else mono 32 kHz */
  async function workingCopy(A) {
    const big = A.duration * 44100 * 4 > LIMIT * .9, sr = big ? 32000 : Math.min(44100, A.sr), ch = await render(A, sr, big);
    return new Blob([X().wav(ch, sr)], { type: 'audio/wav' });
  }
  const playable = f => { const a = document.createElement('audio'); return !!(f.type && a.canPlayType(f.type)) && !isAiff(f) && f.size <= LIMIT; };
  const extOf = f => ((f.name.match(/\.([a-z0-9]{1,5})$/i) || [])[1] || 'bin').toLowerCase();
  async function upload(path, blob, label) {
    return PD.cloud.storage.upload(path, blob, p => toast('cr.uploading', { f: label, p: Math.round(p * 100) }, 1200), BUCKET);
  }
  const blobKey = (id, aid) => 'cr.a.' + id + '.' + aid;
  async function setMain(id, blob) { await PD.blobs.put('ml.own.' + id, blob); const m = PD.store.get('ml.hasOwn', {}); m[id] = true; PD.store.set('ml.hasOwn', m); }
  /** the main recording on this device (fetched from the private bucket on another device) */
  async function ensureLocal(id, D) {
    if (await PD.blobs.get('ml.own.' + id).catch(() => null)) return true;
    const a = (D.assets || []).find(x => x.main); if (!a) return false;
    const b = await PD.blobs.get(blobKey(id, a.id)).catch(() => null) || (a.playPath || a.path) && online() && await PD.cloud.storage.read(a.playPath || a.path, BUCKET).catch(() => null);
    if (!b) return false; await setMain(id, b); return true;
  }
  async function assetUrl(id, a) {
    const b = await PD.blobs.get(blobKey(id, a.id)).catch(() => null); if (b) return URL.createObjectURL(b);
    const p = a.playPath || a.path; if (!p || !online()) return null;
    const u = await PD.cloud.storage.urls([p], BUCKET); return u[p] || null;
  }
  async function assetBuffer(id, a) {
    const b = await PD.blobs.get(blobKey(id, a.id)).catch(() => null) || (a.main && await PD.blobs.get('ml.own.' + id).catch(() => null)) || ((a.playPath || a.path) && online() && await PD.cloud.storage.read(a.playPath || a.path, BUCKET).catch(() => null));
    if (!b) throw new Error('no-file'); return decodeBuf(await b.arrayBuffer(), { name: a.name || 'x.' + (a.ext || 'wav'), type: b.type });
  }

  /* ---------------- a new project ---------------- */
  const TYPES = ['song', 'melody', 'solo', 'full'], CATS = { song: ['songs'], melody: ['melodies'], solo: ['solos'], full: ['songs', 'melodies'] };
  function newPage(w) {
    const files = [], st = { type: 'song', level: 2 };
    const listEl = h('div', { class: 'cr-files' }), msg = h('div');
    const input = h('input', { type: 'file', multiple: true, accept: 'audio/*,video/mp4,video/*,.mid,.midi,.aif,.aiff,.aifc,.flac,.m4a,.aac', hidden: true, onchange: e => add([...e.target.files]) });
    const drop = h('div', { class: 'cr-drop', tabindex: '0', role: 'button', onclick: () => input.click(), onkeydown: e => { if (e.key === 'Enter' || e.key === ' ') input.click(); } }, [h('b', { 'data-t': 'cr.drop' }), h('small', { 'data-t': 'cr.dropD' }), h('span', { class: 'btn small', 'data-t': 'cr.choose' })]);
    drop.addEventListener('dragover', e => { e.preventDefault(); drop.classList.add('on'); }); drop.addEventListener('dragleave', () => drop.classList.remove('on'));
    drop.addEventListener('drop', e => { e.preventDefault(); drop.classList.remove('on'); add([...e.dataTransfer.files]); });
    function add(fs) { fs.filter(f => EXT.test(f.name) || /^(audio|video)\//.test(f.type)).forEach(f => files.push({ f, role: isMidi(f) ? 'midi' : files.some(x => x.role === 'mix') ? 'other' : 'mix' })); paint(); }
    function paint() {
      listEl.innerHTML = '';
      files.forEach((x, i) => listEl.append(h('div', { class: 'cr-file' }, [h('div', { class: 'grow' }, [h('b', { text: x.f.name }), h('small', { class: 'muted', text: (x.f.size / 1048576).toFixed(1) + ' MB' + (x.f.size > LIMIT ? ' · > 50 MB' : '') })]),
        x.role === 'midi' ? h('span', { class: 'le-pill', 'data-t': 'cr.role.midi' }) : h('select', { class: 'input', 'aria-label': t('cr.role'), onchange: e => { x.role = e.target.value; if (x.role === 'mix') files.forEach(y => { if (y !== x && y.role === 'mix') y.role = 'other'; }); paint(); } },
          ['mix', 'panduri', 'vocals', 'drums', 'bass', 'lead', 'other'].map(r => h('option', { value: r, text: t('cr.role.' + r), selected: r === x.role }))),
        h('button', { class: 'btn small ghost', text: '✕', 'aria-label': t('le.delete'), onclick: () => { files.splice(i, 1); paint(); } })])));
      PD.i18n.apply(listEl);
    }
    const f = (k, el) => h('label', { class: 'le-f' }, [h('span', { 'data-t': k }), el]);
    const inp = ph => h('input', { class: 'input', type: 'text', placeholder: ph || '' });
    const tKa = inp(), tEn = inp(), art = inp(), genre = inp(), desc = h('textarea', { class: 'input', rows: '3' }), descEn = h('textarea', { class: 'input', rows: '2' }), lyr = h('textarea', { class: 'input', rows: '4', spellcheck: 'false' });
    const level = h('select', { class: 'input' }, [1, 2, 3].map(v => h('option', { value: String(v), text: t('lvl.' + v), selected: v === 2 })));
    let cover = null; const covImg = h('img', { class: 'cr-cov', alt: '', hidden: true });
    const covIn = h('input', { type: 'file', accept: 'image/*', hidden: true, onchange: async e => { const fi = e.target.files[0]; if (fi) { cover = await coverOf(fi); covImg.src = cover; covImg.hidden = false; } } });
    const types = h('div', { class: 'cr-types', role: 'radiogroup' }, TYPES.map(k => h('button', { class: 'cr-type', role: 'radio', 'aria-checked': String(k === st.type), onclick: e => { st.type = k; types.querySelectorAll('.cr-type').forEach(b => b.setAttribute('aria-checked', String(b === e.currentTarget))); } }, [h('b', { 'data-t': 'cr.type.' + k }), h('small', { 'data-t': 'cr.type.' + k + 'D' })])));
    const go = h('button', { class: 'btn primary big', 'data-t': 'cr.create', onclick: async () => {
      if (!files.length) return toast('cr.noAudio'); if (!tKa.value.trim() && !tEn.value.trim()) return toast('cr.needTitle');
      go.disabled = true;
      try { const D = await create(files, { title: { ka: tKa.value.trim() || tEn.value.trim(), en: tEn.value.trim() || tKa.value.trim() }, artist: art.value.trim(), genre: genre.value.trim(), level: +level.value, desc: { ka: desc.value.trim(), en: descEn.value.trim() }, cover, type: st.type, lyrics: lyr.value }, s => { msg.innerHTML = ''; msg.append(h('p', { class: 'notice', text: s })); });
        PD.app.go('creator', 'p:' + D.id); setTimeout(() => PD.lessonEditor.open(D.id, 'chords', D).then(() => analysisSheet(D.id, editorApi(), { auto: true })), 50); }
      catch (e) { console.warn('creator', e); msg.innerHTML = ''; msg.append(h('p', { class: 'notice warn', text: String(e && e.message || e) })); }
      go.disabled = false; } });
    w.append(back(), h('h1', { 'data-t': 'cr.m.new' }), drop, input, listEl,
      h('section', { class: 'cr-form' }, [f('cr.f.titleKa', tKa), f('cr.f.titleEn', tEn), f('cr.f.artist', art), f('cr.f.genre', genre), f('cr.f.level', level),
        f('cr.f.desc', desc), f('cr.f.descEn', descEn), h('div', { class: 'le-f' }, [h('span', { 'data-t': 'cr.f.cover' }), h('div', { class: 'row', style: 'gap:10px;align-items:center' }, [covImg, h('button', { class: 'btn small', 'data-t': 'cr.f.cover', onclick: () => covIn.click() }), covIn])]),
        h('div', { class: 'le-f' }, [h('span', { 'data-t': 'cr.f.type' }), types]), f('cr.f.lyrics', lyr)]),
      h('p', { class: 'muted', 'data-t': 'cr.storage' }), msg, go);
  }
  async function coverOf(file) {
    const img = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = URL.createObjectURL(file); });
    const S2 = 512, c = document.createElement('canvas'), k = Math.max(S2 / img.width, S2 / img.height); c.width = c.height = S2;
    c.getContext('2d').drawImage(img, (S2 - img.width * k) / 2, (S2 - img.height * k) / 2, img.width * k, img.height * k); URL.revokeObjectURL(img.src);
    return c.toDataURL('image/jpeg', .78);
  }
  const newId = () => 'cr-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 6);
  async function create(files, meta, say) {
    const id = newId(), assets = [], X2 = X(); let main = null, midi = null, dur = 0;
    for (const [i, x] of files.entries()) {
      say(t('cr.reading', { f: x.f.name }));
      const aid = 'a' + i + Math.random().toString(36).slice(2, 5), buf = await x.f.arrayBuffer();
      if (x.role === 'midi') { try { midi = X2.midi(new Uint8Array(buf)); } catch (e) { throw new Error(t('cr.bad', { f: x.f.name })); }
        assets.push({ id: aid, kind: 'midi', role: 'midi', name: x.f.name, size: x.f.size, ext: extOf(x.f) }); await PD.blobs.put(blobKey(id, aid), x.f); continue; }
      let A; try { A = await decodeBuf(buf, x.f); } catch (e) { throw new Error(t('cr.bad', { f: x.f.name })); }
      const isMain = x.role === 'mix' && !main || (!main && i === files.length - 1 && !files.some(y => y.role === 'mix'));
      const a = { id: aid, kind: 'audio', role: x.role, name: x.f.name, mime: x.f.type || '', size: x.f.size, ext: extOf(x.f), dur: +A.duration.toFixed(3), sr: A.sr, ch: A.ch.length, peaks: X2.peaks(A.ch[0], A.sr, 100) };
      await PD.blobs.put(blobKey(id, aid), x.f);
      let play = null; if (!playable(x.f)) { say(t('cr.creating', { s: x.f.name })); play = await workingCopy(A); await PD.blobs.put(blobKey(id, aid) + '.play', play); }
      if (isMain || (!main && x.role === 'mix')) { main = a; a.main = true; dur = A.duration; await setMain(id, play || x.f); }
      if (online()) {
        if (x.f.size <= LIMIT) { try { a.path = await upload(id + '/' + aid + '.' + a.ext, x.f, x.f.name); } catch (e) { a.upload = 'failed'; } } else { a.upload = 'too-large'; say(t('cr.big', { f: x.f.name, mb: Math.round(x.f.size / 1048576) })); }
        if (play && play.size <= LIMIT) { try { a.playPath = await upload(id + '/' + aid + '.play.wav', play, x.f.name); } catch (_) {} }
      } else a.upload = 'device';
      assets.push(a);
    }
    if (!main) { const first = assets.find(a => a.kind === 'audio'); if (first) { first.main = true; main = first; dur = first.dur; } }
    if (!main && !midi) throw new Error(t('cr.noAudio'));
    if (!dur && midi) dur = midi.duration;
    // before the analysis: a plain grid (labelled not analysed) so the timeline can be used at once; MIDI brings its own exact tempo map
    const beats = midi && midi.beats.length > 2 ? midi.beats.slice() : (() => { const b = []; for (let x = 0; x < dur + .5; x += .5) b.push(+x.toFixed(3)); return b; })();
    const D = { schema: 'panduri-song', v: 2, id, title: meta.title, artist: meta.artist ? { ka: meta.artist, en: meta.artist } : null, kind: meta.type === 'song' ? 'song' : 'melody', level: meta.level || 2,
      duration: +dur.toFixed(3), key: null, bpm: midi && midi.tempos[0] ? midi.tempos[0].bpm : 120, meter: { label: midi && midi.meter ? midi.meter.num + '/' + midi.meter.den : '4/4', beatsPerBar: midi && midi.meter ? midi.meter.num : 4, sub: 2, phase: 0 },
      beats, tempo: [], sections: [{ kind: 'verse', from: 0, to: beats.length - 1 }], chords: [], rhythm: [{ from: 0, id: 'custom', span: 1, strokes: [{ dir: 'down', pos: 0, acc: false }] }], notes: [], lyrics: [],
      creator: { type: meta.type, genre: meta.genre || '', desc: meta.desc, cover: meta.cover || null, categories: CATS[meta.type], created: Date.now(), lyricsText: meta.lyrics || '' },
      assets, noFold: true, octave: 0, status: 'not-analyzed', review: [], analysis: null };
    if (midi) { const ns = midi.notes.map(n => ({ t: n.t, d: n.d, m: n.m })); D.notesOrig = ns.map(n => [n.t, n.d, n.m]); const T = X2.tabulate(ns, { open: [1, 2, 3].map(s => Math.round(PD.theory.midi(s, 0))), frets: PD.instrument.fretCount });
      D.notes = ns.map((n, i) => T.tab[i] ? [n.t, n.d, n.m, T.tab[i].s, T.tab[i].f, T.tab[i].fi, T.tab[i].art] : [n.t, n.d, n.m]); D.analysis = { midi: { tempos: midi.tempos, notes: ns.length } }; }
    say(t('cr.creating', { s: '' }));
    let stored = false;
    if (online()) { try { await rpc('creator_create', { p_id: id, p_draft: D }); stored = true; } catch (e) { if (!noMig(e)) throw e; } }
    if (!stored) { putLocal(id, { draft: D, at: Date.now(), status: 'not-analyzed' }); toast('cr.localOnly', null, 6000); } else toast('cr.created');
    return D;
  }

  /* ---------------- the editor's hand for the analysis and the builder ---------------- */
  const editorApi = () => { const S = PD.lessonEditor.state; return S && { get data() { return PD.lessonEditor.state && PD.lessonEditor.state.D; }, apply: (l, fn) => PD.lessonEditor.apply(l, fn), id: S.id }; };

  /* ---------------- Analyze with AI Studio ---------------- */
  const MODES = ['full', 'tempo', 'key', 'chords', 'meter', 'rhythm', 'melody', 'tab', 'lyrics', 'separate'];
  function analysisSheet(id, api, o) {
    o = o || {}; if (!api) return;
    PD.ui.sheet((box, close) => {
      const D0 = api.data, type = (D0.creator && D0.creator.type) || 'song', on = {};
      MODES.forEach(m => { on[m] = m === 'full'; });
      const checks = h('div', { class: 'cr-modes' }, MODES.map(m => { const c = h('input', { type: 'checkbox' }); c.checked = on[m]; c.onchange = () => { on[m] = c.checked; if (m === 'full') checks.querySelectorAll('input').forEach((x, i) => { if (i) x.disabled = c.checked; }); }; if (m !== 'full') c.disabled = true; return h('label', { class: 'cr-mode' + (m === 'full' ? ' full' : '') }, [c, h('span', { 'data-t': 'cr.a.' + m })]); }));
      const auds = (D0.assets || []).filter(a => a.kind === 'audio');
      const srcOpts = role => [['mix', t('cr.src.mix')]].concat(auds.filter(a => !a.main).map(a => ['asset:' + a.id, t('cr.role.' + a.role) + ' · ' + (a.name || '')]), [['vocals', t('cr.src.vocals')], ['other', t('cr.src.other')]]);
      const pickSrc = (role, def) => h('select', { class: 'input' }, srcOpts(role).map(([v, l]) => h('option', { value: v, text: l, selected: v === def })));
      const pand = auds.find(a => a.role === 'panduri'), lead = auds.find(a => a.role === 'lead' || a.role === 'vocals');
      const melSrc = pickSrc('melody', lead ? 'asset:' + lead.id : pand ? 'asset:' + pand.id : type === 'song' ? 'vocals' : 'other'), rhySrc = pickSrc('rhythm', pand ? 'asset:' + pand.id : 'mix');
      const keep = h('input', { type: 'checkbox' });
      const log = h('div', { class: 'cr-log' }), run = h('button', { class: 'btn primary', 'data-t': 'cr.run' });
      box.append(h('h2', { 'data-t': 'cr.analyze' }), checks, h('label', { class: 'le-f' }, [h('span', { 'data-t': 'cr.a.melSrc' }), melSrc]), h('small', { class: 'muted', 'data-t': 'cr.src.otherD' }),
        h('label', { class: 'le-f' }, [h('span', { 'data-t': 'cr.a.rhySrc' }), rhySrc]), h('label', { class: 'row', style: 'gap:8px;align-items:center' }, [keep, h('small', { 'data-t': 'cr.keepStems' })]), run, log);
      PD.i18n.apply(box);
      run.onclick = async () => {
        run.disabled = true; const want = {}; MODES.forEach(m => { want[m] = on.full || on[m]; });
        const hasLyr = !!(((D0.creator || {}).lyricsText || '').trim() || (D0.lyrics || []).length); if (on.full && type === 'song') { want.melody = !!lead || hasLyr; want.lyrics = hasLyr; }   // a song's melody is measured for its lead line, or for the lyrics (the singing)
        try { const R = await analyse(id, api, want, { mel: melSrc.value, rhy: rhySrc.value, keep: keep.checked }, line => { const p = h('div', { text: line }); log.append(p); p.scrollIntoView({ block: 'nearest' }); });
          results(box, api, R, close); }
        catch (e) { log.append(h('p', { class: 'notice warn', text: String(e && e.message || e) })); }
        run.disabled = false;
      };
      if (o.auto) setTimeout(() => run.click(), 200);
    });
  }
  const pct = x => Math.round(x * 100);
  /** every step on the real upload; each result says which method produced it, and what it was unsure of */
  async function analyse(id, api, want, src, say) {
    const D = api.data, R = { at: Date.now(), methods: {}, review: [], done: {}, fail: {} }, A = PD.ai, M = PD.aimus;
    if (online()) rpc('song_lesson_set_status', { p_id: id, p_status: 'analyzing' }).catch(() => {});
    say(t('cr.step', { s: t('cr.s.decode') }));
    const main = (D.assets || []).find(a => a.main); if (!main) throw new Error(t('cr.noAudio'));
    const AB = await assetBuffer(id, main), mono = await monoOf(AB);
    const step = async (k, label, fn) => { say(t('cr.step', { s: label })); try { await fn(); R.done[k] = true; } catch (e) { console.warn('creator analysis', k, e); R.fail[k] = String(e && e.message || e); say(t('cr.fail', { s: label, e: R.fail[k] })); } };
    // instruments: Studio 3.0's separation (Spleeter, on the device); needed for a vocal / lead melody and the lyrics
    const stems = {};
    const needSep = want.separate || ((want.melody || want.lyrics) && (src.mel === 'vocals' || src.mel === 'other')) || (want.rhythm && (src.rhy === 'vocals' || src.rhy === 'other'));
    if (needSep) await step('separate', t('cr.s.sep', { p: 0 }), async () => {
      const ac = new AbortController(), oc = new OfflineAudioContext(2, 1, 44100), b = oc.createBuffer(AB.ch.length, AB.ch[0].length, AB.sr); AB.ch.forEach((c, i) => b.copyToChannel(c, i));
      const r = await A.separateExcerpt(b, 0, AB.duration, ac.signal, p => say(t('cr.s.sep', { p })));
      r.sources.forEach((nm, i) => { const [L, Rr] = r.stems[i], m = new Float32Array(L.length); for (let j = 0; j < L.length; j++) m[j] = (L[j] + Rr[j]) / 2; stems[nm] = { sr: r.rate, ch: [m], duration: m.length / r.rate }; });
      R.methods.separate = 'Spleeter 4 stems (Studio 3.0, on this device)'; R.stems = Object.keys(stems);
    });
    const srcBuf = async s => s === 'mix' ? AB : /^asset:/.test(s) ? assetBuffer(id, (D.assets || []).find(a => a.id === s.slice(6))) : stems[s] || (() => { throw new Error('no ' + s + ' stem'); })();
    // tempo: Creator's moving-tempo tracker, compared with Studio's fixed-tempo tracker
    let beats = D.beats, env = null;
    if (want.tempo || want.chords || want.rhythm || want.meter || want.melody) await step('tempo', t('cr.s.tempo'), async () => {
      const T = X().tempo(mono, SR); env = T.env; beats = T.beats; R.tempo = T;
      let agree = null; try { const s2 = await A._beatsOf(mono, SR, T.bpm, null); agree = X().beatF(s2.beats, T.beats); R.studioBeats = s2.beats.length; } catch (_) {}
      R.agree = agree; R.methods.tempo = 'Creator: tempogram + Viterbi tempo path + beat DP · compared with Studio 3.0 beatsOf';
      T.review.forEach(r => R.review.push(r));
      if (agree != null && agree < .8) R.review.push({ from: 0, to: AB.duration, what: 'tempo', note: 'Studio and Creator disagree (F ' + agree.toFixed(2) + ')' });
    });
    if (!env) env = X().envelope(mono, SR);
    let res = null;
    if (want.chords || want.key || want.meter) await step('chords', t('cr.s.chords'), async () => {
      res = await A.analyse(mono, SR, null, { beats });
      R.chords = []; res.chords.forEach(c => { const nm = c.root < 0 ? null : A.cname(c.root, c.q), last = R.chords[R.chords.length - 1]; if (last && last.chord === nm) return; R.chords.push({ t: +c.t0.toFixed(3), chord: nm, conf: c.conf }); if (c.conf < .45 && c.t1 - c.t0 > .3) R.review.push({ from: c.t0, to: c.t1, what: 'chords', note: (nm || 'N.C.') + ' · ' + pct(c.conf) + '%' }); });
      R.key = res.key ? A.cname(res.key.r, res.key.q) : null; R.methods.chords = 'Studio 3.0: chroma + 24 templates + Viterbi on the beat grid; key from the chords';
    });
    if (want.meter) await step('meter', t('cr.s.meter'), async () => {
      const m = M.metre(beats, env.on, env.dt, env.t0, res ? res.chords : []);
      R.meter = { beatsPerBar: m.beatsPerBar || 4, sub: m.compound ? 3 : 2, phase: m.phase || 0, label: m.compound ? (m.beatsPerBar || 2) * 3 + '/8' : (m.beatsPerBar || 4) + '/4', conf: m.conf };
      if (m.unsure) R.review.push({ from: 0, to: Math.min(AB.duration, 20), what: 'meter', note: 'weak (' + pct(m.conf || 0) + '%)' });
      R.methods.meter = 'Studio 3.0 PD.aimus.metre';
    });
    if (want.rhythm) await step('rhythm', t('cr.s.rhythm'), async () => {
      const B = await srcBuf(src.rhy), m2 = B === AB ? mono : await monoOf(B), E = B === AB ? env : X().envelope(m2, SR), sub = (R.meter && R.meter.sub) || (D.meter && D.meter.sub) || 2;
      R.strokes = X().strokes(E, beats, { sub }).map(s => ({ t: s.t, k: s.a ? s.k.toUpperCase() : s.k, sug: 1 }));
      try { const on = M.onsets(m2, SR), known = (PD.curriculum.rhythms() || []).concat(PD.curriculum.regionalRhythms ? PD.curriculum.regionalRhythms() : [], PD.curriculum.commonRhythms() || []);
        const rr = M.rhythm(on, beats, { beatsPerBar: (R.meter || D.meter || {}).beatsPerBar || 2, phase: 0, compound: sub === 3 }, known, (PD.RHYTHM_REFS || []).concat(PD.store.get('ai.rhyRefs', [])));
        if (rr && rr.matches && rr.matches[0]) { R.rhythmNear = rr.matches[0].id; if (rr.sure) R.rhythmId = rr.matches[0].id; } } catch (_) {}
      R.review.push({ from: 0, to: AB.duration, what: 'rhythm', note: 'down / up suggested from the place in the beat' });
      R.methods.rhythm = 'Creator: onset peaks on the beat grid; Studio 3.0 rhythm fingerprint for the name';
    });
    let vocalNotes = null;
    if (want.melody) await step('melody', t('cr.s.melody', { p: 0 }), async () => {
      const B = await srcBuf(src.mel), m2 = await monoOf(B), CH = 240 * SR, OV = 2 * SR, all = [];
      for (let a = 0; a < m2.length; a += CH - OV) {   // the whole length, in parts Basic Pitch can hold
        const part = m2.subarray(a, Math.min(m2.length, a + CH)), off = a / SR;
        let lastP = -1; const r = await M.notesBP(part, A.BASE, { lo: 36, hi: 96 }, p => { const f = Math.max(0, Math.min(1, p > 1 ? p / 100 : p)), v = Math.round((a + f * part.length) / m2.length * 100); if (v >= lastP + 5) { lastP = v; say(t('cr.s.melody', { p: v })); } });
        r.notes.forEach(n => { const t0 = n.t0 + off; if (a > 0 && t0 < off + 1) return; if (all.length && t0 < all[all.length - 1].t0 - 1) return; all.push(Object.assign({}, n, { t0, t1: n.t1 + off })); });
        if (a + CH >= m2.length) break;
      }
      const line = M.melodyOf(all, { lo: 36, hi: 96 });
      R.notes = line.map(n => ({ t: +n.t0.toFixed(3), d: +Math.max(.03, n.t1 - n.t0).toFixed(3), m: Math.round(n.m), conf: n.conf != null ? n.conf : n.amp }));
      if (src.mel === 'vocals' || /^asset:/.test(src.mel) && (D.assets.find(a => 'asset:' + a.id === src.mel) || {}).role === 'vocals') vocalNotes = R.notes;
      R.notes.forEach(n => { if (n.conf != null && n.conf < .3) R.review.push({ from: n.t, to: n.t + n.d, what: 'notes', note: 'quiet note' }); });
      R.methods.melody = 'Studio 3.0: Basic Pitch (Spotify, ONNX) + melody line, whole length in 4-minute parts · source ' + src.mel;
    });
    if (want.lyrics) await step('lyrics', t('cr.s.lyrics'), async () => {
      const text = (D.creator && D.creator.lyricsText || '').trim() || (D.lyrics || []).map(l => l.text).join('\n');
      if (!text) throw new Error(t('cr.noLyrics'));
      let vn = vocalNotes; if (!vn) { const vb = stems.vocals; if (!vb) throw new Error('no vocals stem'); const r = await M.notesBP(await monoOf(vb), A.BASE, { lo: 40, hi: 88 }, () => {}); vn = M.melodyOf(r.notes, { lo: 40, hi: 88 }).map(n => ({ t: n.t0, d: n.t1 - n.t0, m: n.m })); }
      const lines = text.split('\n').map(x => x.trim()).filter(Boolean).map(tx => ({ text: tx, syl: ML().syllables(tx).filter(x => x.s.trim()).map(x => ({ i: x.i })) }));
      R.lyrics = X().alignLyrics(lines, vn.map(n => n.t), X().sungSpans(vn)) || [];
      R.review.push({ from: 0, to: AB.duration, what: 'lyrics', note: 'aligned to the sung notes — check each line' });
      R.methods.lyrics = 'Creator: lines over the sung phrases, syllables on the vocal note onsets';
    });
    if (want.tab || want.melody) await step('tab', t('cr.s.tab'), async () => {
      const ns = R.notes || (D.notesOrig || D.notes).map(n => ({ t: n[0], d: n[1], m: n[2] }));
      const T = X().tabulate(ns, { open: [1, 2, 3].map(s => Math.round(PD.theory.midi(s, 0))), frets: PD.instrument.fretCount }); R.tab = T; R.tabNotes = ns;
      T.out.forEach(i => R.review.push({ from: ns[i].t, to: ns[i].t + ns[i].d, what: 'notes', note: 'outside the panduri range — choose in the inspector' }));
      if (ns.length && (type => type !== 'song')((D.creator || {}).type)) { const P = X().phrases(ns), L = X().repeats(P); R.phrases = P.map((p, i) => ({ from: p.from, to: p.to, letter: L[i] })); }
      R.methods.tab = 'Creator: string · fret · finger by the shortest hand path (A3 · C♯4 · E4, 17 frets)';
    });
    if (want.separate && R.stems) await step('stems', t('cr.s.sep', { p: 100 }), async () => {
      R.stemAssets = [];
      for (const nm of Object.keys(stems)) { const B = stems[nm], blob = new Blob([X().wav(B.ch, B.sr)], { type: 'audio/wav' }), aid = 's-' + nm;
        await PD.blobs.put(blobKey(id, aid), blob); const a = { id: aid, kind: 'audio', role: 'stem-' + nm, name: nm + '.wav', mime: 'audio/wav', size: blob.size, dur: +B.duration.toFixed(3), sr: B.sr, ch: 1, peaks: X().peaks(B.ch[0], B.sr, 100), derived: true, upload: 'device' };
        if (src.keep && online() && blob.size <= LIMIT) { try { a.path = await upload(id + '/' + aid + '.wav', blob, nm); delete a.upload; } catch (_) {} }
        R.stemAssets.push(a); }
    });
    return R;
  }
  /** the results, each with a box: what the owner edited by hand stays unless he ticks it */
  function results(box, api, R, close) {
    const D = api.data, ed = D.edited || {}, rows = [], ck = {};
    const row = (k, edKey, text) => { const c = h('input', { type: 'checkbox' }); c.checked = !ed[edKey]; ck[k] = c; rows.push(h('label', { class: 'cr-res' }, [c, h('div', {}, [h('b', { text }), ed[edKey] ? h('small', { class: 'warn', 'data-t': 'cr.edited' }) : null])])); };
    const bp = R.tempo ? R.tempo.curve.map(c => c.bpm) : [];
    if (R.tempo) row('beats', 'beats', t('cr.r.beats', { n: R.tempo.beats.length, a: Math.round(Math.min(...bp)), b: Math.round(Math.max(...bp)), f: R.agree != null ? pct(R.agree) : '—' }));
    if (R.chords) row('chords', 'chords', t('cr.r.chords', { n: R.chords.length, k: R.key || '—' }));
    if (R.meter) row('meter', 'meters', t('cr.r.meter', { m: R.meter.label }));
    if (R.strokes) row('strokes', 'strokes', t('cr.r.strokes', { n: R.strokes.length, r: R.rhythmNear ? t('cr.r.rhy', { r: PD.i18n.pick((PD.curriculum.anyRhythm(R.rhythmNear) || {}).name) || R.rhythmNear }) : '' }));
    if (R.tab) row('notes', 'notes', t('cr.r.notes', { n: R.tabNotes.length, o: R.tab.out.length }));
    if (R.phrases) row('sections', 'sections', t('cr.r.sections', { n: R.phrases.length }));
    if (R.lyrics) row('lyrics', 'lyrics', t('cr.r.lyrics', { n: R.lyrics.length }));
    if (R.stemAssets) row('stems', '_', t('cr.r.stems', { n: R.stemAssets.length }));
    const methods = h('ul', { class: 'cr-meth' }, Object.keys(R.methods).map(k => h('li', { text: R.methods[k] })));
    box.append(h('h3', { 'data-t': 'cr.res' }), ...rows, methods, h('button', { class: 'btn primary', 'data-t': 'cr.applyRes', onclick: () => {
      api.apply(t('cr.analyze'), D2 => {
        if (ck.beats && ck.beats.checked) { D2.beats = R.tempo.beats; D2.bpm = R.tempo.bpm; D2.tempoPts = X().tempoPoints(R.tempo.beats, 4); D2.tempo = []; const n = D2.beats.length - 1; D2.sections = (D2.sections || []).map(s => Object.assign(s, { from: Math.min(s.from, n - 1), to: Math.min(s.to, n) })); if (D2.sections.length === 1) D2.sections[0].to = n; }
        if (ck.chords && ck.chords.checked) { D2.chords = R.chords.map(c => ({ t: c.t, chord: c.chord })); if (R.key) D2.key = R.key; }
        if (ck.meter && ck.meter.checked) { D2.meter = Object.assign({}, D2.meter, R.meter); delete D2.meter.conf; D2.meters = []; }
        if (ck.strokes && ck.strokes.checked) { D2.strokes = R.strokes; if (R.rhythmId) D2.rhythm = [{ from: 0, id: R.rhythmId }]; }
        if (ck.notes && ck.notes.checked) { D2.notesOrig = R.tabNotes.map(n => [n.t, n.d, n.m]); D2.notes = R.tabNotes.map((n, i) => { const r = R.tab.tab[i]; return r ? [n.t, n.d, n.m, r.s, r.f, r.fi, r.art] : [n.t, n.d, n.m]; }); D2.noFold = true; D2.octave = 0; }
        if (ck.sections && ck.sections.checked) { const bt = x => Math.max(0, Math.round(ML().beatAt(D2, x))); D2.sections = R.phrases.map(p => ({ kind: 'phrase', from: bt(p.from), to: Math.max(bt(p.from) + 1, bt(p.to)), letter: p.letter })); }
        if (ck.lyrics && ck.lyrics.checked) D2.lyrics = R.lyrics;
        if (ck.stems && ck.stems.checked) D2.assets = (D2.assets || []).filter(a => !a.derived).concat(R.stemAssets);
        D2.analysis = { at: R.at, methods: R.methods, agree: R.agree, key: R.key, meter: R.meter, rhythmNear: R.rhythmNear || null, tempoCurve: R.tempo ? R.tempo.curve : null, chordConf: R.chords ? R.chords.map(c => [c.t, c.conf]) : null, fail: R.fail };
        D2.review = R.review.map(r => ({ from: +(+r.from).toFixed(3), to: +(+r.to).toFixed(3), what: r.what, note: r.note }));
        D2.status = D2.review.length ? 'needs-review' : 'analysis-completed';
      });
      const S = PD.lessonEditor.state; if (S) { S.review = (S.D.review || []).slice(); S.status = S.D.status; S.nextStatus = S.D.status; }
      if (online()) rpc('song_lesson_set_status', { p_id: api.id, p_status: (api.data || {}).status || 'needs-review' }).catch(() => {});
      PD.lessonEditor.state && PD.lessonEditor.state.audio && PD.lessonEditor.save && PD.lessonEditor.save();
      close();
    } }));
    PD.i18n.apply(box);
  }

  /* ---------------- Lesson Builder ---------------- */
  const BSTAGES = ['intro', 'chords', 'rhythm', 'notes', 'phrases', 'hard', 'full', 'final'];
  function builderSheet(id, api) {
    PD.ui.sheet((box, close) => {
      const D = api.data, cur = new Set(ML().builderStages(Object.assign({}, D, { stages: D.stages && D.stages.length ? D.stages : null }))), cks = {};
      box.append(h('h2', { 'data-t': 'cr.builder' }), h('p', { class: 'muted', 'data-t': 'cr.b.lead' }));
      BSTAGES.forEach(s => { const c = h('input', { type: 'checkbox' }); c.checked = cur.has(s); cks[s] = c; box.append(h('label', { class: 'cr-res' }, [c, h('b', { 'data-t': 'cr.b.' + s })])); });
      const say = h('small', { class: 'muted' });
      box.append(h('h3', { 'data-t': 'cr.b.split' }), h('p', { class: 'muted', 'data-t': 'cr.b.splitD' }), h('button', { class: 'btn', 'data-t': 'cr.b.split', onclick: () => {
        const ns = (api.data.notes || []).map(n => ({ t: n[0], d: n[1], m: n[2] })); if (!ns.length) { say.textContent = t('cr.b.noNotes'); return; }
        const P = X().phrases(ns), L = X().repeats(P);
        api.apply(t('cr.b.split'), D2 => { const bt = x => Math.max(0, Math.round(ML().beatAt(D2, x))); D2.sections = P.map((p, i) => ({ kind: 'phrase', from: bt(p.from), to: Math.max(bt(p.from) + 1, bt(p.to)), letter: L[i] })); });
        say.textContent = t('cr.b.split.done', { n: P.length }); } }), say,
        h('button', { class: 'btn primary', 'data-t': 'le.apply', onclick: () => { api.apply(t('cr.builder'), D2 => { D2.stages = BSTAGES.filter(s => cks[s].checked); }); close(); } }));
      PD.i18n.apply(box);
    });
  }

  /* ---------------- details in the editor's inspector ---------------- */
  function metaFields(D, mut) {
    const C = D.creator = D.creator || {}, f = (k, el) => h('label', { class: 'le-f' }, [h('span', { 'data-t': k }), el]);
    const tx = (v, on) => { const i = h('input', { class: 'input', type: 'text', value: v || '' }); i.onchange = () => on(i.value); return i; };
    const ta = (v, on) => { const i = h('textarea', { class: 'input', rows: '3' }); i.value = v || ''; i.onchange = () => on(i.value); return i; };
    const covIn = h('input', { type: 'file', accept: 'image/*', hidden: true, onchange: async e => { const fi = e.target.files[0]; if (fi) { const c = await coverOf(fi); mut(t('cr.f.cover'), () => { D.creator.cover = c; }); } } });
    return h('div', { class: 'le-nt' }, [
      f('cr.f.type', h('select', { class: 'input', onchange: e => mut(t('cr.f.type'), () => { D.creator.type = e.target.value; D.kind = e.target.value === 'song' ? 'song' : 'melody'; }) }, TYPES.map(k => h('option', { value: k, text: t('cr.type.' + k), selected: k === C.type })))),
      f('cr.f.genre', tx(C.genre, v => mut(t('cr.f.genre'), () => { D.creator.genre = v; }))),
      f('cr.f.desc', ta(C.desc && C.desc.ka, v => mut(t('cr.f.desc'), () => { D.creator.desc = Object.assign({}, D.creator.desc, { ka: v }); }))),
      f('cr.f.descEn', ta(C.desc && C.desc.en, v => mut(t('cr.f.desc'), () => { D.creator.desc = Object.assign({}, D.creator.desc, { en: v }); }))),
      f('cr.f.lyrics', ta(C.lyricsText, v => mut(t('cr.f.lyrics'), () => { D.creator.lyricsText = v; }))),
      h('div', { class: 'row', style: 'gap:8px;align-items:center' }, [C.cover ? h('img', { class: 'cr-cov', src: C.cover, alt: '' }) : null, h('button', { class: 'btn small', 'data-t': 'cr.f.cover', onclick: () => covIn.click() }), covIn]),
      h('small', { class: 'muted', text: (D.assets || []).map(a => t('cr.role.' + a.role) + (a.path || a.playPath ? ' ☁' : ' · ' + t('cr.localNote'))).join(' · ') })]);
  }

  /* ---------------- publish · unpublish · duplicate · delete ---------------- */
  function publishDialog(id, o) {
    PD.ui.sheet((box, close) => {
      const D = o.data(), C = D.creator || {}, cks = {};
      box.append(h('h2', { 'data-t': 'cr.pub' }), h('h3', { 'data-t': 'cr.cats' }));
      ['songs', 'melodies', 'solos', 'teaching'].forEach(c => { const x = h('input', { type: 'checkbox' }); x.checked = (C.categories || CATS[C.type] || []).includes(c); cks[c] = x; box.append(h('label', { class: 'cr-res' }, [x, h('b', { 'data-t': 'cr.cat.' + c })])); });
      const au = h('input', { type: 'checkbox' }), main = (D.assets || []).find(a => a.main);
      box.append(h('small', { class: 'muted', 'data-t': 'cr.oneSource' }), h('label', { class: 'cr-res' }, [au, h('div', {}, [h('b', { 'data-t': 'cr.pubAudio' }), h('small', { class: 'muted', 'data-t': 'cr.pubAudioD' })])]));
      const msg = h('div'), go = h('button', { class: 'btn primary', 'data-t': 'cr.pub' });
      go.onclick = async () => {
        const cats = Object.keys(cks).filter(k => cks[k].checked); if (!cats.length) return toast('cr.noCat');
        go.disabled = true;
        try {
          PD.lessonEditor.apply(t('cr.cats'), D2 => { D2.creator = Object.assign({}, D2.creator, { categories: cats }); });
          if (!await o.save()) throw new Error(t('le.offline'));
          if (au.checked && main) { const b = await PD.blobs.get('ml.own.' + id).catch(() => null); if (b) { const ext = /wav/.test(b.type) ? 'wav' : /mpeg|mp3/.test(b.type) ? 'mp3' : /mp4|m4a|aac/.test(b.type) ? 'm4a' : /flac/.test(b.type) ? 'flac' : /ogg/.test(b.type) ? 'ogg' : 'wav', path = id + '/' + Date.now().toString(36) + '.' + ext;
            if (b.size > LIMIT) throw new Error('> 50 MB'); await PD.cloud.storage.upload(path, b, p => toast('cr.uploading', { f: '', p: Math.round(p * 100) }, 1200), 'lesson-audio'); await rpc('song_lesson_set_audio', { p_id: id, p_path: path }); } }
          await rpc('song_lesson_publish', { p_id: id, p_note: null, p_categories: cats });
          ML().setPreview(id, null); await ML().loadPublished(); PD.lessons.reload(); o.done && o.done();
          toast('cr.pubDone', { c: cats.map(c => t('cr.cat.' + c)).join(' · ') }); close();
        } catch (e) { msg.innerHTML = ''; msg.append(h('p', { class: 'notice warn', text: noMig(e) ? t('cr.localOnly') : /not-allowed|42501/.test(e && (e.code || e.message) || '') ? t('le.noAllow') : String(e && e.message || e) })); }
        go.disabled = false;
      };
      box.append(msg, go); PD.i18n.apply(box);
    });
  }
  function unpublish(id) { PD.ui.confirm(t('cr.unpubQ'), async () => { try { await rpc('song_lesson_unpublish', { p_id: id }); await ML().loadPublished(); PD.lessons.reload(); toast('cr.unpubDone'); PD.app.render && PD.app.render(); } catch (e) { PD.ui.toast(String(e && e.message || e)); } }); }
  async function duplicate(id) {
    const D = await draftOf(id); if (!D) return; const nid = newId(), C = JSON.parse(JSON.stringify(D));
    C.id = nid; C.title = { ka: (D.title.ka || '') + ' (' + t('cr.copy') + ')', en: (D.title.en || '') + ' (' + t('cr.copy') + ')' }; C.status = 'manually-edited'; C.creator = Object.assign({}, C.creator, { created: Date.now() });
    for (const a of C.assets || []) {
      for (const suf of ['', '.play']) { const b = await PD.blobs.get(blobKey(id, a.id) + suf).catch(() => null); if (b) await PD.blobs.put(blobKey(nid, a.id) + suf, b); }
      for (const k of ['path', 'playPath']) if (a[k] && online()) { const to = a[k].replace(/^[^/]+\//, nid + '/'); try { await PD.cloud.storage.copy(a[k], to, BUCKET); a[k] = to; } catch (_) { delete a[k]; } }
    }
    const m = await PD.blobs.get('ml.own.' + id).catch(() => null); if (m) await setMain(nid, m);
    let ok = false; if (online()) { try { await rpc('creator_create', { p_id: nid, p_draft: C }); ok = true; } catch (e) { if (!noMig(e)) { PD.ui.toast(String(e.message || e)); return; } } }
    if (!ok) putLocal(nid, { draft: C, at: Date.now(), status: C.status });
    toast('cr.dupDone', { t: PD.i18n.pick(C.title) }); PD.app.go('creator', 'p:' + nid);
  }
  function remove(id, closeEditor) {
    const L = local()[id];
    draftOf(id).then(D => PD.ui.confirm(t('cr.delQ', { t: D ? PD.i18n.pick(D.title) : id }), async () => {
      if (online() && !L) { try { await rpc('song_lesson_delete', { p_id: id }); } catch (e) { if (/published/.test(e && (e.message || '') || '')) return toast('cr.delPub'); if (!noMig(e)) return PD.ui.toast(String(e.message || e)); } }
      const paths = ((D && D.assets) || []).flatMap(a => [a.path, a.playPath]).filter(Boolean); if (paths.length && online()) await PD.cloud.storage.remove(paths, BUCKET).catch(() => {});
      for (const a of (D && D.assets) || []) { await PD.blobs.del(blobKey(id, a.id)).catch(() => {}); await PD.blobs.del(blobKey(id, a.id) + '.play').catch(() => {}); }
      await ML().dropOwn(id).catch(() => {}); putLocal(id, null); PD.store.del('le.wip.' + id); ML().setPreview(id, null);
      if (closeEditor) closeEditor(); toast('cr.deleted'); PD.app.go('creator', 'projects');
    }));
  }

  /* ---------------- pages ---------------- */
  function css() {
    if (document.getElementById('cr-css')) return;
    document.head.appendChild(h('style', { id: 'cr-css', text: `
.cr{display:flex;flex-direction:column;gap:14px}.cr h1{margin:0;letter-spacing:-.02em}.cr-hero{padding:22px;border-radius:24px;background:radial-gradient(120% 140% at 0% 0%,rgba(208,138,92,.28),rgba(0,0,0,0) 60%),rgba(18,18,20,.7);border:1px solid rgba(255,255,255,.08);backdrop-filter:blur(24px) saturate(1.4);-webkit-backdrop-filter:blur(24px) saturate(1.4)}
.cr-hero p{margin:6px 0 0;color:#b9b5b0}.cr-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:10px}
.cr-card{display:flex;flex-direction:column;gap:4px;text-align:left;padding:16px;border-radius:18px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.035);color:inherit;cursor:pointer;transition:transform .18s cubic-bezier(.2,.8,.2,1),background .18s,border-color .18s;font:inherit}
.cr-card:hover{transform:translateY(-2px);background:rgba(208,138,92,.10);border-color:rgba(208,138,92,.45)}.cr-card b{font-size:15px}.cr-card small{color:#9a9aa0}.cr-card.main{background:linear-gradient(160deg,rgba(208,138,92,.32),rgba(169,96,58,.14));border-color:rgba(208,138,92,.6)}
.cr-row{display:flex;align-items:center;gap:10px;padding:12px 14px;border-radius:16px;border:1px solid rgba(255,255,255,.07);background:rgba(255,255,255,.03);flex-wrap:wrap}.cr-row .grow{flex:1;min-width:160px;display:flex;flex-direction:column}
.cr-drop{display:flex;flex-direction:column;align-items:center;gap:8px;padding:34px 18px;border-radius:22px;border:1.5px dashed rgba(208,138,92,.55);background:rgba(208,138,92,.06);text-align:center;cursor:pointer;transition:background .15s}.cr-drop.on{background:rgba(208,138,92,.2)}.cr-drop small{color:#9a9aa0;max-width:520px}
.cr-files{display:flex;flex-direction:column;gap:6px}.cr-file{display:flex;align-items:center;gap:8px;padding:10px 12px;border-radius:14px;background:rgba(255,255,255,.04)}.cr-file .grow{flex:1;display:flex;flex-direction:column;min-width:0}.cr-file b{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.cr-file select{width:auto}
.cr-form{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:10px}.cr-types{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:6px}
.cr-type{display:flex;flex-direction:column;gap:2px;text-align:left;padding:12px;border-radius:14px;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.03);color:inherit;cursor:pointer;font:inherit}.cr-type small{color:#9a9aa0}.cr-type[aria-checked=true]{border-color:#d08a5c;background:rgba(208,138,92,.2)}
.cr-cov{width:64px;height:64px;border-radius:12px;object-fit:cover}.cr-modes{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:6px}.cr-mode{display:flex;gap:8px;align-items:center;padding:8px 10px;border-radius:12px;background:rgba(255,255,255,.04)}.cr-mode.full{grid-column:1/-1;background:rgba(208,138,92,.14)}
.cr-log{font:12px/1.5 ui-monospace,Menlo,monospace;color:#b9b5b0;max-height:28vh;overflow:auto;display:flex;flex-direction:column;gap:2px}.cr-res{display:flex;gap:10px;align-items:flex-start;padding:8px 0}.cr-res div{display:flex;flex-direction:column}.cr-res small.warn{color:#f0b48a}
.cr-meth{font-size:12px;color:#8a8a90;margin:0;padding-left:18px}
.le-f{display:flex;flex-direction:column;gap:4px;font-size:12px;color:#9a9aa0;min-width:0}.le-f .input{color:#ece9e4;width:100%;box-sizing:border-box}.cr-form textarea.input{min-height:72px}
` }));
  }
  const back = () => h('button', { class: 'btn small ghost', text: '‹ ' + t('cr.title'), onclick: () => PD.app.go('creator') });
  const MENU = [['new', 'cr.m.new'], ['projects', 'cr.m.projects'], ['published', 'cr.m.published'], ['drafts', 'cr.m.drafts'], ['analysis', 'cr.m.analysis'], ['chords', 'cr.m.chords'], ['melody', 'cr.m.melody'], ['rhythm', 'cr.m.rhythm'], ['tempo', 'cr.m.tempo']];
  const TRACK = { analysis: 'chords', chords: 'chords', melody: 'notes', rhythm: 'rhythm', tempo: 'tempo' };
  function home(w) {
    w.append(h('div', { class: 'cr-hero' }, [h('h1', { 'data-t': 'cr.title' }), h('p', { 'data-t': 'cr.lead' })]),
      h('div', { class: 'cr-grid' }, MENU.map(([k, key], i) => h('button', { class: 'cr-card' + (i === 0 ? ' main' : ''), onclick: () => PD.app.go('creator', k) }, [h('b', { 'data-t': key }), h('small', { 'data-t': key + 'D' })]))));
    const recent = h('div', { class: 'cr' }); w.append(h('h3', { 'data-t': 'cr.m.projects' }), recent); rows(recent, null, 6);
  }
  async function rows(el, filter, max, pickTrack) {
    el.append(h('p', { class: 'muted', text: '…' }));
    const L = (await list()).filter(p => !filter || filter(p)).slice(0, max || 500); el.innerHTML = '';
    if (!L.length) el.append(h('p', { class: 'muted', 'data-t': 'cr.none' }));
    L.forEach(p => el.append(h('div', { class: 'cr-row' }, [h('div', { class: 'grow' }, [h('b', { text: PD.i18n.pick(p.title) || p.id }), h('small', { class: 'muted', text: [t('cr.type.' + (p.kind || 'song')), t('ml.st.' + (p.status || 'not-analyzed')), p.updated ? new Date(p.updated).toLocaleString() : '', p.local ? t('cr.localNote') : '', p.published && p.cats ? p.cats.map(c => t('cr.cat.' + c)).join(' · ') : ''].filter(Boolean).join(' · ') })]),
      p.published ? h('span', { class: 'le-pill ver', 'data-t': 'ml.st.published' }) : null,
      h('button', { class: 'btn small primary', 'data-t': pickTrack ? 'cr.open' : 'le.title', onclick: () => openEditor(p.id, pickTrack === 'analysis' ? 'chords' : TRACK[pickTrack] || 'chords', pickTrack === 'analysis') }),
      pickTrack ? null : h('button', { class: 'btn small', 'data-t': 'cr.open', onclick: () => PD.app.go('creator', 'p:' + p.id) })])));
    PD.i18n.apply(el);
  }
  async function openEditor(id, track, analysis) {
    const D = await draftOf(id); if (!D) return PD.ui.toast(t('le.offline'));
    await PD.lessonEditor.open(id, track, D); if (analysis) analysisSheet(id, editorApi());
  }
  async function project(w, id) {
    css(); w.append(back()); const body = h('div', { class: 'cr' }); w.append(body);
    const D = await draftOf(id); if (!D) { body.append(h('p', { class: 'notice', 'data-t': 'cr.none' })); PD.i18n.apply(w); return; }
    const L = (await list()).find(p => p.id === id) || {};
    body.append(h('div', { class: 'cr-hero' }, [D.creator && D.creator.cover ? h('img', { class: 'cr-cov', src: D.creator.cover, alt: '', style: 'width:96px;height:96px;float:right' }) : null, h('h1', { text: PD.i18n.pick(D.title) }),
      h('p', { text: [D.artist && PD.i18n.pick(D.artist), t('cr.type.' + ((D.creator || {}).type || 'song')), D.key, D.bpm ? Math.round(D.bpm) + ' BPM' : '', D.meter && D.meter.label, PD.fmtTime(D.duration || 0)].filter(Boolean).join(' · ') }),
      h('p', { text: t('cr.status') + ': ' + t('ml.st.' + (L.status || D.status || 'not-analyzed')) + (L.published ? ' · ' + t('cr.in') + ': ' + (L.cats || []).map(c => t('cr.cat.' + c)).join(' · ') : '') })]));
    const act = (k, fn, cls) => h('button', { class: 'btn' + (cls ? ' ' + cls : ''), 'data-t': k, onclick: fn });
    body.append(h('div', { class: 'row', style: 'gap:8px;flex-wrap:wrap' }, [
      act('le.title', () => openEditor(id, 'chords'), 'primary'), act('cr.analyze', () => openEditor(id, 'chords', true)),
      act('cr.builder', async () => { await openEditor(id, 'sections'); builderSheet(id, editorApi()); }),
      act('cr.preview', async () => { ML().setPreview(id, await draftOf(id)); PD.store.set('ml.student', id); PD.lessons.reload(); PD.app.go('lesson', id); }),
      act(L.published ? 'cr.pubUpd' : 'cr.pub', async () => { await openEditor(id, 'chords'); const S = PD.lessonEditor.state; if (S) PD.creator.publishDialog(id, { save: () => PD.lessonEditor.save(), data: () => JSON.parse(JSON.stringify(S.D)) }); }),
      L.published ? act('cr.unpub', () => unpublish(id)) : null, act('cr.dup', () => duplicate(id)), act('cr.delete', () => remove(id), 'ghost danger')]));
    body.append(h('h3', { 'data-t': 'cr.f.type' }), metaSummary(D));
    PD.i18n.apply(w);
  }
  const metaSummary = D => h('div', { class: 'cr-row' }, [h('div', { class: 'grow' }, [h('small', { class: 'muted', text: (D.assets || []).map(a => t('cr.role.' + a.role) + ' · ' + (a.name || '') + (a.path || a.playPath ? ' ☁' : ' · ' + t('cr.localNote'))).join('\n') }),
    h('small', { class: 'muted', text: (D.chords || []).length + ' ' + t('le.t.chords') + ' · ' + (D.notes || []).length + ' ' + t('le.t.notes') + ' · ' + (D.strokes || []).length + ' ' + t('le.t.strokes') + ' · ' + (D.beats || []).length + ' ' + t('le.t.beats') + ' · ' + (D.tempoPts || []).length + ' ' + t('le.t.tpts') })])]);
  function route(r, w, p) {
    if (r !== 'creator') return false;
    css(); const c0 = h('div', { class: 'cr' }); w.append(c0); w = c0;
    if (!owner()) { w.append(h('h1', { 'data-t': 'cr.title' }), h('p', { class: 'notice', 'data-t': 'cr.only' })); PD.i18n.apply(w); return true; }   // nothing is fetched for anyone else; the server would refuse it anyway
    const k = String(p || '');
    if (k.startsWith('p:')) project(w, k.slice(2));
    else if (k === 'new') newPage(w);
    else if (k === 'projects' || k === 'published' || k === 'drafts') { const el = h('div', { class: 'cr' }); w.append(back(), h('h1', { 'data-t': 'cr.m.' + k }), el); rows(el, k === 'published' ? x => x.published : k === 'drafts' ? x => !x.published : null); }
    else if (TRACK[k]) { const el = h('div', { class: 'cr' }); w.append(back(), h('h1', { 'data-t': 'cr.m.' + k }), h('p', { class: 'muted', 'data-t': 'cr.pick' }), el); rows(el, null, 500, k); }
    else home(w);
    PD.i18n.apply(w); return true;
  }
  return { route, list, draftOf, ensureLocal, assetUrl, analysisSheet, builderSheet, metaFields, publishDialog, unpublish, duplicate, remove, create, analyse, _decode: decodeBuf };
})();
