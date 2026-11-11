/* Sima: text-only AI tutor with explicit local lesson fallback. */
PD.sima = (() => {
  const h = PD.h, S = PD.store;
  const L = a => PD.i18n.pick(Array.isArray(a) ? { ka: a[0], en: a[1] } : a);
  const name = () => PD.i18n.pick({ ka: 'სიმა', en: 'Sima' });

  /* ---------------- what she knows ---------------- */
  const norm = s => String(s || '').toLowerCase().replace(/[«»„“”"'`.,!?()\[\]:;]/g, ' ').replace(/\s+/g, ' ').trim();
  /* Words that carry no subject of their own — in a question they only add noise, and without
     dropping them "რა არის ბლუზი" scores every card that happens to say "არის". */
  /* the question words too: what kind of question it is is read separately (KW below), so here they would only
     pull in every card that happens to say „სად" or „რისთვის" */
  const STOP = ['არის', 'არაა', 'როგორ', 'რატომ', 'რომელი', 'რომ', 'უნდა', 'მინდა', 'გინდა', 'მითხარი', 'ამიხსენი', 'ახსენი', 'ვიცი', 'იყო', 'არა', 'კიდევ', 'ასევე',
    'სად', 'როდის', 'რისთვის', 'რანაირად', 'რომელ', 'რამდენი', 'შეიძლება', 'შემიძლია', 'ფანდური', 'ფანდურზე', 'ფანდურს', 'ფანდურის', 'ფანდურით',
    'what', 'how', 'why', 'when', 'where', 'which', 'the', 'and', 'for', 'can', 'does', 'should', 'panduri'];
  /* the same thing said with another form of the verb: „ავაწყო" is „აწყობა", „ვივარჯიშო" is „ვარჯიში" */
  const SYN = [[/ავაწყ|ააწყ|ვაწყობ|აწყობილ/u, 'აწყობ ტიუნერ'], [/დავიჭირ|ვიჭერ|დავიჭერ|ავიღ.*ხელ|ხელ.*ავიღ|hold the panduri/u, 'დაჭერ დავიჭირ'], [/დავჯდ|ვჯდებ|ვიჯდე/u, 'დაჯდომ დავჯდეთ'],
    [/ვივარჯიშ|ვვარჯიშობ|ვავარჯიშ/u, 'ვარჯიშ ყოველდღე'], [/დავუკრა|ვუკრავ|დაუკრა/u, 'დაკვრ'], [/ვისწავლ|ვსწავლობ/u, 'სწავლ'], [/ვთვალო|დავთვალო|ვითვლი/u, 'დათვლ'],
    [/ავაჟღერ|ჟღერს/u, 'ჟღერ'], [/(^| )ტაბ|ტაბულატ|(^| )tabs?( |$)/u, 'ზოლები ციფრი ხაზზე lanes'], [/მტკივა|ტკივილ/u, 'ტკივ']];
  const expand = Q => SYN.reduce((a, [re, add]) => re.test(Q) ? a + ' ' + add : a, Q);
  /* Georgian puts its endings on the back of the word, so a query word and the word in the text
     rarely match letter for letter (სტანდარტი / სტანდარტები). Cutting the last two letters off a
     long word is crude, but it finds the stem both of them share. */
  const stem = w => w.length >= 6 ? w.slice(0, w.length - 2) : w.length >= 4 && /[\u10D0-\u10FF]$/u.test(w) ? w.replace(/[აეიოუ]$/u, '') : w;
  /* Chinese and Japanese write without spaces, so the browser's own word breaker cuts the question up */
  const seg = () => { const c = PD.i18n.lang; return (c === 'zh' || c === 'ja') && window.Intl && Intl.Segmenter ? new Intl.Segmenter(c, { granularity: 'word' }) : null; };
  const words = s => { const g = seg(); return g ? [...g.segment(norm(s))].filter(x => x.isWordLike && x.segment.length > 1).map(x => x.segment) : norm(s).split(' ').filter(w => w.length > 2 && !STOP.includes(w)); };
  const strip = s => String(s || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  /* the library writes its counts as {f}, {c} … and reads them from the app — so does she */
  const fill = s => String(s).replace(/\{(\w+)\}/g, (m, k) => {
    const TT = PD.theory, V = { f: () => TT.FRETS, c: () => (TT.chordLibrary() || []).length, k: () => TT.CHORD_TYPES.length, n: () => Object.keys(PD.shapes.SCALES).length,
      ch: () => ((PD.theoryBook && PD.theoryBook.CHAPTERS) || []).length, tp: () => (PD.tips.all() || []).length, r: () => (PD.curriculum.rhythms() || []).length,
      s: () => Object.keys(PD.SONGS || {}).length, g: () => ((PD.genres && PD.genres.CHAPTERS) || []).length, forms: () => ((PD.genres && PD.genres.FORMS) || []).length };
    try { return V[k] ? V[k]() : m; } catch (_) { return m; }
  });

  /* What a question is about, in every language the app speaks. Only the kind of question is read from these
     words — the answer itself always comes from the app's own data. */
  // one string per kind, so the translation tools do not take these words for text on screen
  const KW = {
    chord: 'აკორდ|chord|аккорд|акорд|akkord|acorde|accord|akor|akord|وتر|أوتار|كورد|कॉर्ड|和弦|コード|코드'.split('|'),
    rhythm: 'რითმ|რიტმ|ჩაკვრ|ამოკვრ|rhythm|strum|ритм|бой|rhythmus|anschlag|ritmo|rasgueo|rythme|ritim|rytm|إيقاع|ताल|लय|节奏|リズム|ストローク|리듬|스트로크'.split('|'),
    learn: 'ვისწავლ|ვსწავლ|ისწავლ|შევისწავლ|დავუკრა|ვუკრა|დაკვრა|learn|play|учи|выуч|научи|игра|вивч|навч|грати|lern|spiel|aprend|tocar|apprend|jouer|impar|suonare|öğren|çal|naucz|ucz się|grać|تعلم|أتعلم|عزف|सीख|बजा|学|弾|배우|연주'.split('|'),
    start: 'დავიწყ|დაწყებ|start|begin|начать|начинать|почати|anfangen|beginnen|empezar|comenzar|começar|commencer|iniziare|cominciare|başla|zacząć|أبدأ|शुरू|开始|始め|시작'.split('|'),
    why: 'რატომ|რისთვის|რად |why|what for|почему|зачем|чому|навіщо|warum|wozu|por qué|porque|para qué|pourquoi|perché|neden|niçin|dlaczego|po co|لماذا|क्यों|为什么|なぜ|どうして|왜'.split('|'),
    how: 'როგორ|რანაირად|how|как |як |wie |cómo|como |comment|come |nasıl|jak |كيف|कैसे|怎么|如何|どう|어떻게'.split('|'),
    where: 'სად |where|где|wo ist|dónde|onde|où|dove|nerede|gdzie|أين|कहाँ|哪里|どこ|어디'.split('|'),
    search: 'მოძებნ|ძებნ|მოიძი|ინტერნეტ|გუგლ|search|google|internet|online|найди|поищи|интернет|знайди|інтернет|buscar|busca |recherche|cherche|cerca |pesquisa|internette|wyszukaj|ابحث|إنترنت|इंटरनेट|खोज|搜索|网上|検索|ネット|검색|인터넷'.split('|'),
    analyse: 'ანალიზ|გააანალიზ|ამოიცან|ამოცნობ|analy|анализ|аналіз|analiz|تحليل|विश्लेषण|分析|분석'.split('|'),
    upload: 'ამ სიმღერ|ეს სიმღერ|ატვირთულ|ავტვირთ|ჩემი სიმღერ|ჩემს სიმღერ|this song|my song|upload|эта песня|этой песни|эту песню|мою песню|загруз|цієї пісні|завантаж|dieses lied|hochgeladen|esta canción|subí|cette chanson|questa canzone|esta música|bu şarkı|yükle|tej piosenki|هذه الأغنية|यह गाना|这首歌|上传|この曲|アップロード|이 노래|업로드'.split('|'),
    song: 'სიმღერ|song|песн|пісн|lied|canción|cancion|chanson|canzone|música|musica|şarkı|piosenk|أغنية|गाना|गीत|歌|曲|노래'.split('|'),
    music: 'მუსიკ|ფანდურ|დაკვრ|music|panduri|музык|пандури|музик|musik|música|musique|musica|müzik|muzyk|موسيقى|باندوري|संगीत|पांडुरी|音乐|潘杜里|音楽|パンドゥリ|음악|판두리'.split('|')
  };
  const has = (Q, k) => KW[k].some(w => (' ' + Q + ' ').includes(w));

  /* ---------------- chord names: Bb, B♭ and A♯ are one chord ---------------- */
  const PCN = { c: 0, d: 2, e: 4, f: 5, g: 7, a: 9, b: 11 };
  function canon(s) {
    const m = String(s || '').trim().match(/^([A-Ga-g])(♯|#|♭|b)?(.*)$/u); if (!m) return null;
    const pc = (PCN[m[1].toLowerCase()] + (m[2] === '♯' || m[2] === '#' ? 1 : m[2] ? -1 : 0) + 12) % 12;
    const q = m[3].replace(/♭/g, 'b').replace(/♯/g, '#').replace(/^min(?!or)/, 'm').replace(/^maj$/, '');
    return pc + ':' + q.toLowerCase();
  }
  const chordList = () => (PD.curriculum.chords() || []).filter(c => !c.none);
  /** every chord named in the question — "Dm-Bb-C", "Dm-ს", "how do I take Bm" */
  function chordsIn(q, loose) {
    const out = [];
    String(q || '').split(/[\s\-–—,.;:!?\/|→>»«„“”"'()]+/u).forEach(tok => {
      if (!tok || tok.length > 9 || !/^[A-Ga-g](♯|#|♭|b)?[a-zA-Z0-9#♯♭+()]*$/u.test(tok)) return;
      // a lower-case word ("am", "be") is a chord only when the question is about chords
      if (!loose && !/^[A-G]/.test(tok)) return;
      if (tok.length === 1 && !loose) return;
      const k = canon(tok), c = k && chordList().find(x => canon(x.name) === k);
      if (c && !out.some(o => o.c === c)) out.push({ c, as: tok.replace(/b(?=$|m|7|6|9|5|s|a|d|\()/, '♭').replace(/#/g, '♯').replace(/^[a-g]/, x => x.toUpperCase()) });
    });
    return out;
  }
  const fretsOf = v => v.frets.map((f, k) => TH().stringName(k + 1) + ' ' + (f === 0 ? t('sm.open') : t('sm.fret', { n: f }))).join(' · ');
  const strokeText = st => (st || []).map(s => t(s.direction === 'down' ? 'w.down' : 'w.up')).join(' · ') +
    ' (' + (st || []).map(s => (s.direction === 'down' ? '↓' : '↑') + (s.accent ? '>' : '')).join(' ') + ')';
  const meterText = r => r && r.meter ? r.meter.beats + '/' + r.meter.unit + (r.meter.groups && r.meter.groups.length > 1 ? ' = ' + r.meter.groups.map(g => g + '/' + r.meter.unit).join(' + ') : '') : '';

  /* ---------------- songs: what is played, and how the app teaches it ---------------- */
  const songs = () => ((PD.lessons && PD.lessons.all) || []).filter(l => l && l.type === 'song');
  const wroot = w => { const r = w.replace(/(ების|ებს|ებში|ებზე|ის|ში|ზე|ით|ად|ს|ი)$/u, ''); return r.length >= 3 ? r : w; };
  function findSong(Q) {
    let best = null;
    songs().forEach(l => [l.title && l.title.ka, l.title && l.title.en, l.title && L(l.title)].filter(Boolean).forEach(nm => {
      const ws = norm(nm).split(/[\s\-–—_]+/u).filter(w => w.length >= 2).map(wroot);
      if (ws.length && ws.join('').length >= 4 && ws.every(w => Q.includes(w))) { const sc = ws.join('').length; if (!best || sc > best.sc) best = { l, sc }; }
    }));
    return best && best.l;
  }
  function songInfo(l) {
    const SD = (PD.SONGS && PD.SONGS[l.song]) || {}, shapes = SD.chords || l.shapes || {};
    const R = l.songRhythm ? (PD.curriculum.anyRhythm(l.songRhythm) || (PD.aiLessons && PD.aiLessons.patterns().find(p => p.id === l.songRhythm))) : null;
    const strokes = l.beatStrokes || (R ? R.strokes : []);
    const cyc = l.cycle && l.cycle.length ? l.cycle : null;
    const chords = cyc ? [...new Set(cyc)] : Object.keys(shapes);
    const meter = SD.meterLabel || (l.meter ? l.meter[0] + '/' + l.meter[1] : '');
    return { l, title: L(l.title), shapes, R, Rname: R ? (R.key ? t(R.key) : L(R.name)) : '', strokes, cyc, chords, meter, bpm: Math.round(l.bpm || 0), ai: !!l.ai,
      src: l.ai ? null : (l.chartSrc === 'teacher' || /teacher/.test(l.source || '') ? 'teacher' : 'fact'), stages: PD.lessons.stagesOf(l) };
  }
  /** the order the song page itself teaches in — one line per stage */
  function planOf(s) {
    const first = s.cyc ? s.cyc[0] : s.chords[0] || '';
    const D = { demo: () => t('st.listen') + ' — ' + t('std.songDemo'),
      technique: () => t('sm.stTech', { s: strokeText(s.strokes), c: first }),
      chords: () => t('sm.stChords'),
      slow: () => t('st.songSlow') + ' — ' + t('std.songSlow'),
      perform: () => t('st.songFull') + ' — ' + t('std.songFull') };
    return s.stages.filter(k => D[k]).map((k, i) => (i + 1) + '. ' + D[k]());
  }
  function songAnswer(l, Q) {
    const s = songInfo(l), wantC = has(Q, 'chord'), wantR = has(Q, 'rhythm'), all = !(wantC || wantR);
    const lines = [];
    if (all || wantC) {
      lines.push(s.cyc ? t('sm.sgCycle', { t: s.title, c: s.cyc.join(' · ') }) : t('sm.sgChords', { t: s.title, c: s.chords.join(' · ') }));
      s.chords.forEach(n => { const sh = s.shapes[n]; if (sh) lines.push('• ' + n + ': ' + fretsOf(sh) + (sh.src === 'derived' ? ' (' + t('sg.derived') + ')' : '')); });
    }
    if (all || wantR) {
      if (s.Rname) lines.push(t('sm.sgRhythm', { r: s.Rname, s: strokeText(s.strokes) }) + (s.cyc ? ' ' + t('sm.sgPer') : ''));
      if (s.meter || s.bpm) lines.push(t('sm.sgTime', { m: s.meter || '—', b: s.bpm }));
    }
    if (all || has(Q, 'learn')) { lines.push(t('sm.sgPlan')); lines.push(...planOf(s)); }
    if (s.ai) lines.push(t('al.est'));
    const acts = [[t('sm.openSong'), ['lesson', l.id]]];
    if (s.R && PD.curriculum.anyRhythm(s.R.id)) acts.push([t('sm.openRhythm'), ['rhythms', s.R.id]]);
    if (s.ai) acts.push([t('ai.title'), ['ai']]);
    return { title: s.title, lines, src: s.src, ai: s.ai, acts };
  }

  /* ---------------- the song open in the AI studio ---------------- */
  function analysis() {
    const C = PD.ai && PD.ai.current, res = C && C.res; if (!res || !res.chords) return null;
    const dur = {}; res.chords.forEach(c => { if (c.root < 0) return; const n = PD.ai.cname(c.root, c.q); dur[n] = (dur[n] || 0) + (c.t1 - c.t0); });
    const top = Object.keys(dur).sort((a, b) => dur[b] - dur[a]).slice(0, 6);
    let cyc = null; try { if (res.beats && PD.aiLessons) { const ch = PD.aiLessons.chart(res); if (ch.cycle) cyc = ch.cycle.cycle; } } catch (_) {}
    return { name: (C.file && C.file.name) || t('ai.title'), key: res.key ? PD.ai.cname(res.key.r, res.key.q) : '', bpm: Math.round(res.bpm || 0), top, cyc };
  }
  function analysisAnswer() {
    const A = analysis();
    if (!A) return { title: t('ai.title'), lines: [t('sm.aiHow')], src: 'fact', acts: [[t('ai.title'), ['ai']]] };
    const lines = [t('sm.aiHeard', { n: A.name })];
    if (A.key || A.bpm) lines.push(t('sm.aiKey', { k: A.key || '—', b: A.bpm || '—' }));
    if (A.cyc) lines.push(t('sm.aiCycle', { c: A.cyc.join(' · ') }));
    if (A.top.length) lines.push(t('sm.aiTop', { c: A.top.join(' · ') }));
    lines.push(t('sm.aiCheck'));
    return { title: A.name, lines, ai: true, acts: [[t('ai.title'), ['ai']]] };
  }

  /* ---------------- how to learn: the course on the learn page, in order ---------------- */
  function learnAnswer() {
    const paths = (PD.lessons && PD.lessons.PATHS) || [];
    const lines = [t('sm.howLearn')].concat(paths.map((p, i) => (i + 1) + '. ' + L(p.title)));
    const song = songs().find(l => !l.ai);
    if (song) { const s = songInfo(song); lines.push(t('sm.howSong', { t: s.title, c: (s.cyc || s.chords).join(' · '), s: strokeText(s.strokes) })); }
    const st = nextStep(); if (st) lines.push(t('sm.yourNext', { s: st.label }));
    const acts = [[t('nav.learn'), ['learn']]]; if (st) acts.unshift([t('home.start'), null, st.go]);
    return { title: t('sm.howLearnT'), lines, src: 'fact', acts };
  }

  /** one searchable card per thing the app already teaches */
  function index() {
    if (api._ix) return api._ix;
    const ix = [];
    (PD.tips.all() || []).forEach(c => ix.push({
      kind: 'tip', id: c.id, src: c.src, title: L(c.title),
      body: [L(c.short)].concat((c.steps || []).map(L)).concat(c.why ? [L(c.why)] : []),
      parts: { what: [L(c.short)], how: (c.steps || []).map(L), why: c.why ? [L(c.why)] : [] },
      go: ['tips', c.id],
      text: norm([L(c.title), L(c.short), (c.steps || []).map(L).join(' '), c.why ? L(c.why) : ''].join(' '))
    }));
    // the theory book keeps a chapter's title in `t` as [ka, en] — not in `title`
    ((PD.theoryBook && PD.theoryBook.CHAPTERS) || []).forEach(c => {
      const ti = L(c.t || c.title || {}), S = PD.theorySimple && PD.theorySimple.get(c.id);
      const lead = S && S.easy && S.easy[0] ? L(S.easy[0]).replace(/<[^>]+>/g, '') : '';
      ix.push({ kind: 'chapter', id: c.id, src: 'fact', title: ti, body: lead ? [lead] : [], go: ['theory', c.id], text: norm(ti + ' ' + lead) });
    });
    // where music comes from — general music history and the blues/jazz forms
    ((PD.genres && PD.genres.CHAPTERS) || []).forEach(c => {
      const ti = PD.i18n.t(c.t), lead = c.lead ? L(c.lead) : '';
      ix.push({ kind: 'chapter', id: c.id, src: 'general', title: ti, body: lead ? [lead] : [], go: ['music', c.id], text: norm(ti + ' ' + lead + ' ' + (c.kw || '')) });
    });
    (PD.curriculum.rhythms() || []).concat(PD.curriculum.commonRhythms ? PD.curriculum.commonRhythms() : []).forEach(r => ix.push({
      kind: 'rhythm', id: r.id, src: r.source, title: L(r.name),
      body: [t('sm.rhythmIs', { n: L(r.name), c: r.strokes.length }) + ' ' + strokeText(r.strokes) + (r.meter ? ' · ' + meterText(r) : '')],
      go: ['rhythms', r.id], text: norm(L(r.name) + ' ' + strokeText(r.strokes) + ' ' + t('nav.rhythms'))
    }));
    // the library: every chapter says what it is, how it is used, where it lives and why it matters
    const BSRC = { music: 'general', scales: 'general', rhythm: 'teacher' };
    ((PD.book && PD.book.CHAPTERS) || []).forEach(c => {
      const P = k => c[k] ? [fill(strip(L(c[k])))] : [], ti = L(c.t);
      ix.push({ kind: 'book', id: c.id, src: BSRC[c.id] || 'fact', title: ti, body: P('what').concat(P('how')),
        parts: { what: P('what'), how: P('how'), where: P('where'), why: P('why') }, go: ['book', c.id],
        text: norm([ti, P('what'), P('how'), P('where'), P('why'), c.pages.map(p => L(p.t)).join(' ')].join(' ')) });
      c.pages.forEach(p => { const pt = L(p.t), pd = fill(strip(L(p.d)));
        ix.push({ kind: 'page', id: c.id + ':' + p.go.join(':'), src: p.src || BSRC[c.id] || 'fact', title: pt, body: [pd], go: p.go, text: norm(pt + ' ' + pd + ' ' + ti) }); });
    });
    // every lesson and song on the learn page
    songs().concat(((PD.lessons && PD.lessons.all) || []).filter(l => l && l.type !== 'song' && !l.user)).forEach(l => {
      const ti = L(l.title), desc = l.desc ? L(l.desc) : '';
      const src = l.ai ? null : /teacher/.test(l.source || '') || l.chartSrc === 'teacher' ? 'teacher' : l.demo || l.source === 'spec' ? 'draft' : 'fact';
      const chs = [...new Set((l.events || []).map(e => e.chord).filter(Boolean))].slice(0, 8);
      const body = [desc || t('sm.seeLesson')].concat(chs.length && l.type !== 'song' ? [t('sm.lsChords', { c: chs.join(' · ') })] : []).concat(l.demo ? [L(PD.curriculum.DEMO_NOTE)] : []);
      ix.push({ kind: l.type === 'song' ? 'song' : 'lesson', id: l.id, src, ai: !!l.ai, title: ti, body, go: ['lesson', l.id], text: norm(ti + ' ' + desc + ' ' + chs.join(' ') + (l.type === 'song' ? ' ' + t('nav.songs') : '')) });
    });
    // the course on the learn page: each road and what is on it
    ((PD.lessons && PD.lessons.PATHS) || []).forEach(p => {
      const ti = L(p.title), steps = (p.steps || []).map(s2 => { try { return PD.app.stepTitle ? PD.app.stepTitle(s2) : ''; } catch (_) { return ''; } }).filter(Boolean);
      ix.push({ kind: 'path', id: p.id, src: 'fact', title: ti, body: [t('sm.pathIs', { n: steps.length })].concat(steps.map((s2, i) => (i + 1) + '. ' + s2)), go: ['learn', p.id], text: norm(ti + ' ' + steps.join(' ') + ' ' + t('nav.learn')) });
    });
    // the AI studio: what it does with a song the learner brings
    ix.push({ kind: 'app', id: 'ai', src: 'fact', title: t('ai.title'), body: [t('sm.aiHow')], go: ['ai'],
      text: norm(t('ai.title') + ' ' + t('sm.aiHow') + ' AI ანალიზი ატვირთვა ინსტრუმენტების დაყოფა ვოკალი stems analyse upload separate') });
    // the app itself: friends, the feed, notifications (facts about the app, not about playing)
    [['friends', 'community:friends', 'მეგობარი დამატება nickname ნიკნეიმი მეგობრობა თხოვნა friend add request'],
     ['feed', 'community', 'ფიდი პოსტი ვიდეო რილი ატვირთვა გადაღება დადება გაზიარება მოწონება შენახვა კომენტარი გლობალური feed post upload film share like save comment video reel'],
     ['notify', 'settings', 'შეტყობინება შეხსენება push ნოტიფიკაცია განახლება notification reminder update']].forEach(([id, go, kw]) => {
      const [r, ...p] = go.split(':'), ti = t('sm.app.' + id), body = [t('sm.app.' + id + 'B')];
      ix.push({ kind: 'app', id, src: 'fact', title: ti, body, go: [r, p.join(':') || null], text: norm(ti + ' ' + body[0] + ' ' + kw) });
    });
    // who made the app — the author's own words; no page to open, so no button
    ix.push({ kind: 'app', id: 'creator', src: 'fact', title: t('sm.creatorT'), body: [t('sm.creator')], go: null,
      text: norm(t('sm.creatorT') + ' ' + t('sm.creator') + ' ნუკრი ბერიძე nukri beridze ავტორი შემქმნელი შექმნა გააკეთა author creator developer made created') });
    return (api._ix = ix);
  }

  /* ---------------- the things she can work out herself ---------------- */
  const TH = () => PD.theory;
  const fLab = f => f === 0 ? t('sm.open') : t('sm.fret', { n: f });

  /** a chord by name, written out and drawn */
  function chordAnswer(q) {
    const all = chordList();
    const query = norm(q), n = query.replace(/\s/g, '');
    const chordQuestion = has(query, 'chord') || /როგორ ავიღო|როგორ ვიღებ|როგორ დავიჭირო|how.*(?:play|hold|take)/u.test(query);
    // A chord name inside ordinary speech ("I am learning") is not a chord request: a lower-case name counts only in a chord question
    let found = chordsIn(q, chordQuestion || n.length <= 6);
    if (found.length) { const more = chordsIn(q, true).filter(f => /^[A-G]/.test(f.as)); if (more.length > found.length) found = more; }
    let best = found.length === 1 ? found[0].c : null;
    if (found.length > 1) {
      // several chords at once ("Dm-Bb-C"): each one in a line, the first shape the app computes for it
      return { title: found.map(f => f.as).join(' · '), lines: [t('sm.chordsAre')].concat(found.map(f => { const v = (f.c.voicings && f.c.voicings[0]) || f.c;
        return '• ' + f.as + (f.as !== f.c.name ? ' (= ' + f.c.name + ')' : '') + ': ' + fretsOf(v); })),
        src: found.every(f => f.c.src === 'teacher') ? 'teacher' : 'fact', acts: [[t('sm.openChord'), ['chords', found[0].c.id]]] };
    }
    if (!best) all.forEach(c => {
      const ka = norm(c.ka || '').replace(/\s/g, '');
      if (ka && (n === ka || (chordQuestion && n.includes(ka))) && !best) best = c;
    });
    if (!best) return null;
    const as = found.length === 1 && found[0].as !== best.name ? found[0].as + ' (= ' + best.name + ')' : best.name;
    const v = (best.voicings && best.voicings[0]) || best;
    const rows = v.frets.map((f, k) => {
      const fi = (v.fingers || [])[k];
      return TH().stringName(k + 1) + ' — ' + (f === 0 ? t('sm.open') : t('sm.fret', { n: f })) +
        (fi ? ' · ' + (fi === 'T' ? t('sm.thumb') : t('sm.finger', { n: fi, name: (PD.i18n.has && PD.i18n.has('fg.' + fi)) ? t('fg.' + fi) : '' })) : '');
    });
    return { title: as, lines: [t('sm.chordIs', { n: as })].concat(rows),
      src: best.src === 'teacher' ? 'teacher' : 'fact',
      acts: [[t('sm.openChord'), ['chords', best.id]], [t('sm.howTaken'), ['chordhow', best.id]]] };
  }

  /** the instrument: how many strings and frets, how it is tuned */
  function instrumentAnswer(Q) {
    const many = /რამდენ|how many|сколько|скільки|wie viele|cuántos|cuantos|combien|quant|kaç|ile |كم |कितने|几|多少|いくつ|何本|몇/u.test(Q);
    const fret = /ლად|fret|лад|bund|traste|frette|tasto|perde|próg|دستان|फ्रेट|品|フレット|프렛/u.test(Q), str = /სიმ|string|струн|saite|cuerda|corde|corda|tel |strun|وتر|तार|弦|현/u.test(Q);
    const tune = /აწყობ|აწყობა|tuning|tuned|строй|настро|stimmung|afinación|accordatura|afinação|akort|strój|ضبط|ट्यूनिंग|调音|チューニング|튜닝/u.test(Q) && !has(Q, 'why') && !has(Q, 'how');
    if (!(many && (fret || str)) && !tune) return null;
    return { title: t('sm.instT'), lines: [t('sm.inst', { f: TH().FRETS }), t('sm.instS')], src: 'fact', acts: [[t('sm.openFret'), ['fretboard']], [t('nav.tuner'), ['tuner']]] };
  }

  /** which note sits on a string and fret */
  function noteAnswer(q) {
    const m = norm(q).match(/(\d+)\s*(?:-?ლ[იე]?\s*)?ლად/);
    const sm = norm(q).match(/(\d+)\s*(?:-?ლ[იე]?\s*)?სიმ/);
    if (!m) return null;
    const f = +m[1], s = sm ? +sm[1] : null;
    if (f < 0 || f > TH().FRETS) return null;
    // the learner counts as the teacher does: „1-ლი სიმი" is the thin E (internal 3), „მე-3 სიმი" the bass A (internal 1)
    const list = (s ? [4 - s] : [1, 2, 3]).filter(x => x >= 1 && x <= 3).map(x => {
      const mi = TH().midi(x, f);
      return TH().stringName(x) + ' · ' + t('sm.fret', { n: f }) + ' — ' + TH().pcName(mi) + ' (' + TH().nameKa(mi) + ')';
    });
    return { title: t('sm.noteOn'), lines: list, src: 'fact', acts: [[t('sm.openFret'), ['fretboard']]] };
  }

  /** one rhythm, stroke by stroke */
  function rhythmAnswer(q) {
    const n = norm(q);
    const T = PD.curriculum.rhythms() || [], all = T.concat(PD.curriculum.commonRhythms ? PD.curriculum.commonRhythms() : []);
    // „ხორუმის", „აჭარულს" — the name with its ending; the teacher's four first, then the general ones by their full name
    const r = T.find(x => [L(x.name), x.name.ka, x.name.en].filter(Boolean).some(nm => n.includes(wroot(norm(nm))))) ||
      all.find(x => n.includes(norm(L(x.name))));
    if (!r) {
      // "which rhythms are there", "რითმები" — the teacher's four, one line each
      if (has(n, 'rhythm') && !has(n, 'song') && (n.split(' ').length <= 2 || /რა რი[თტ]მ|რომელი რი[თტ]მ|რამდენი რი[თტ]მ|which rhythm|what rhythms|how many rhythm/u.test(n)))
        return { title: t('nav.rhythms'), lines: [t('sm.rhythmsAre', { n: T.length })].concat(T.map(x => '• ' + L(x.name) + ' — ' + strokeText(x.strokes) + (x.meter ? ' · ' + meterText(x) : ''))),
          src: T.every(x => x.source === 'teacher') ? 'teacher' : 'fact', acts: [[t('sm.openRhythm'), ['rhythms']], [t('sm.metro'), ['metronome']]] };
      return null;
    }
    const lines = r.strokes.map((s2, i) => (i + 1) + '. ' + (s2.direction === 'down' ? '↓ ' + t('w.down') : '↑ ' + t('w.up')) + (s2.accent ? ' · ' + t('rh.accent') : ''));
    if (r.meter) lines.push(t('sm.meter', { b: r.meter.beats, u: r.meter.unit, g: r.meter.groups.join('+') }));
    // the songs that are played in this rhythm
    const inSongs = songs().filter(l => l.songRhythm === r.id).map(l => L(l.title));
    if (inSongs.length) lines.push(t('sm.rhythmSongs', { s: inSongs.join(', ') }));
    return { title: L(r.name), lines: [t('sm.rhythmIs', { n: L(r.name), c: r.strokes.length })].concat(lines),
      src: r.source, acts: [[t('sm.openRhythm'), ['rhythms', r.id]], [t('sm.metro'), ['metronome']]] };
  }

  /** what to practise, from the learner's own history */
  function practiceAnswer() {
    const sug = PD.coach && PD.coach.today && PD.coach.today();
    if (sug) return { title: t('co.today'), lines: [t(sug.key), t('co.where', { l: L(sug.lesson.title), a: sug.barA, b: sug.barB })],
      src: 'fact', acts: [[t('co.go'), null, () => PD.coach.start(sug)]] };
    const st = nextStep();
    if (st) return { title: t('sm.next'), lines: [st.label], src: 'fact', acts: [[t('home.start'), null, st.go]] };
    return { title: t('sm.next'), lines: [t('sm.noHistory')], src: 'fact', acts: [[t('nav.learn'), ['learn']]] };
  }

  /** where the learner stands on the path */
  function nextStep() {
    try {
      const paths = (PD.lessons && PD.lessons.PATHS) || PD.curriculum.paths() || [];
      for (const p of paths) for (const s2 of p.steps || []) {
        if (!PD.app.stepDone || !PD.app.stepDone(s2)) return { label: L(p.title) + ' · ' + (PD.app.stepTitle ? PD.app.stepTitle(s2) : ''), go: () => PD.app.stepGo(s2) };
      }
    } catch (_) {}
    return null;
  }

  /** is an exam waiting */
  function examAnswer() {
    const due = PD.exam && PD.exam.waiting && PD.exam.waiting();
    if (due) return { title: t('ex.title'), lines: [t('sm.examDue')], src: 'fact', acts: [[t('sm.examGo'), null, () => PD.exam.open(due)]] };
    return { title: t('ex.title'), lines: [t('sm.examNone')], src: 'fact', acts: [[t('ex.title'), ['exams']]] };
  }

  /* ---------------- what the server AI is told about the app ----------------
     The app's own data, small and exact, so the model answers about a song or a rhythm from it and does not guess. */
  function digest() {
    const out = {};
    try {
      out.songs = songs().slice(0, 12).map(l => { const s = songInfo(l); return { title: s.title, chords: s.cyc || s.chords, chordLasts: s.cyc ? 'one rhythm each' : null,
        shapes: s.chords.filter(n => s.shapes[n]).map(n => n + ': ' + fretsOf(s.shapes[n]) + (s.shapes[n].src === 'derived' ? ' (to confirm)' : '')),
        rhythm: s.Rname || null, strokes: s.strokes.length ? strokeText(s.strokes) : null, meter: s.meter || null, bpm: s.bpm || null,
        source: s.ai ? 'AI estimate from the learner\'s recording' : s.src, learnOrder: planOf(s) }; });
      out.rhythms = (PD.curriculum.rhythms() || []).map(r => ({ name: L(r.name), strokes: strokeText(r.strokes), meter: meterText(r) || null, source: r.source }));
      out.course = ((PD.lessons && PD.lessons.PATHS) || []).map(p => L(p.title));
      const st = nextStep(); if (st) out.nextStep = st.label;
      const A = analysis(); if (A) out.analysis = { file: A.name, key: A.key, bpm: A.bpm, mostHeardChords: A.top, cycle: A.cyc, note: 'AI estimate from the AI studio, not verified' };
      out.strings = 'Internal string 1 = A (teacher: 3rd string, bass), 2 = C♯ (2nd voice), 3 = E (1st voice, thin). Shapes are listed A · C♯ · E.';
    } catch (_) {}
    return out;
  }

  /* ---------------- putting a question to her ---------------- */
  const HAS = (q, ws) => ws.some(w => norm(q).includes(w));
  const SOCIAL = {
    'sm.greeting': 'привет|здравствуй|здравствуйте|добрый день|добрый вечер|доброе утро|привіт|вітаю|добрий день|hallo|guten tag|guten morgen|servus|bonjour|salut|bonsoir|hola|buenas|buenos días|buenos dias|ciao|salve|buongiorno|olá|ola|oi|bom dia|merhaba|selam|günaydın|cześć|czesc|dzień dobry|witaj|مرحبا|مرحبًا|أهلا|اهلا|السلام عليكم|नमस्ते|नमस्कार|你好|您好|嗨|こんにちは|こんばんは|おはよう|안녕|안녕하세요',
    'sm.howAreYou': 'как дела|как ты|как вы|как поживаешь|як справи|як ти|як ви|wie geht es dir|wie gehts|wie geht s|ça va|ca va|comment vas tu|comment ça va|comment allez vous|qué tal|que tal|cómo estás|como estas|come stai|come va|como estás|tudo bem|nasılsın|naber|jak się masz|co słychać|كيف حالك|आप कैसे हैं|कैसे हो|你好吗|最近怎么样|お元気ですか|元気|잘 지내요|잘 지내세요|어떻게 지내세요',
    'sm.thanks': 'спасибо|спасибо большое|благодарю|дякую|дякую дуже|danke|danke schön|vielen dank|merci|merci beaucoup|gracias|muchas gracias|grazie|grazie mille|obrigado|obrigada|teşekkürler|teşekkür ederim|sağ ol|dziękuję|dzięki|شكرا|شكرًا|شكرا جزيلا|धन्यवाद|शुक्रिया|谢谢|多谢|ありがとう|ありがとうございます|감사합니다|고마워|고마워요',
    'sm.goodbye': 'пока|до свидания|до встречи|бувай|до побачення|tschüss|tschüs|auf wiedersehen|au revoir|à bientôt|adiós|adios|hasta luego|arrivederci|a presto|tchau|adeus|até logo|hoşça kal|görüşürüz|do widzenia|na razie|مع السلامة|إلى اللقاء|अलविदा|फिर मिलेंगे|再见|拜拜|さようなら|またね|안녕히 계세요|안녕히 가세요|잘 가',
    'sm.who': 'кто ты|ты кто|как тебя зовут|хто ти|як тебе звати|wer bist du|wie heißt du|qui es tu|comment tu t appelles|quién eres|como te llamas|cómo te llamas|chi sei|come ti chiami|quem és|quem é você|quem és tu|sen kimsin|adın ne|kim jesteś|jak masz na imię|من أنت|ما اسمك|तुम कौन हो|आप कौन हैं|你是谁|你叫什么名字|あなたは誰|お名前は|누구세요|너는 누구야|이름이 뭐야',
    'sm.fine': 'хорошо|нормально|отлично|я в порядке|добре|чудово|gut|mir geht es gut|bien|je vais bien|estoy bien|bene|sto bene|bem|estou bem|iyiyim|dobrze|wszystko dobrze|بخير|أنا بخير|ठीक हूँ|मैं ठीक हूँ|我很好|很好|元気です|잘 지내요 감사합니다'
  };
  // Social messages are conversation, not lesson-search queries.
  function conversation(q) {
    const Q = norm(q).replace(/[—–-]/g, ' ').replace(/\s+/g, ' ').trim();
    // who made the app, and her: the author told it himself — „ეს აპლიკაცია შევქმენი მე, ნუკრი ბერიძემ"
    if (/ნუკრი|ბერიძე|nukri|beridze/u.test(Q)) return { title: name(), lines: [t('sm.nukri')], src: 'fact', acts: [], conversational: true };
    if ((/(^| )(ვინ|who)( |$)/u.test(Q) && /შექმნ|შეგქმნ|გააკეთ|ააწყ|დაწერ|დააპროგრამ|ავტორ|შემქმნ|მფლობ|made|creat|built|develop|author|wrote|owner/u.test(Q)) || /^(ავტორი|შემქმნელი|author|creator|developer)$/u.test(Q))
      return { title: name(), lines: [t(/შეგქმნ|შენ ვინ შექმნ|created you|made you/u.test(Q) ? 'sm.madeMe' : 'sm.creator')], src: 'fact', acts: [], conversational: true };
    const rules = [
      [/^(გამარჯობა|გამარჯობათ|გაგიმარჯოს|სალამი|ჰეი|hello|hi|hey)( სიმა| sima)?$/u, 'sm.greeting'],
      [/^(სიმა |sima )?(როგორ ხარ|როგორ ხართ|როგორ მიდის საქმე|how are you)$/u, 'sm.howAreYou'],
      [/^(მადლობა|დიდი მადლობა|გმადლობ|გმადლობთ|thanks|thank you)( სიმა| sima)?$/u, 'sm.thanks'],
      [/^(ნახვამდის|კარგად იყავი|დროებით|bye|goodbye)( სიმა| sima)?$/u, 'sm.goodbye'],
      [/^(ვინ ხარ|ვინ ხარ შენ|რა გქვია|შენ რა გქვია|who are you|what is your name)$/u, 'sm.who'],
      [/^(კარგად ვარ|მეც კარგად ვარ|კარგად|i am fine|i'm fine|fine)$/u, 'sm.fine']
    ];
    let match = rules.find(([pattern]) => pattern.test(Q));
    // the same greetings in every language of the app (her name after them is fine)
    if (!match) {
      const bare = Q.replace(/ ?(сима|сіма|sima|سيما|सिमा|シマ|시마)$/u, '').trim();
      const k = Object.keys(SOCIAL).find(key => SOCIAL[key].split('|').includes(bare));
      if (k) match = [null, k];
    }
    return match ?{ title: name(), lines: [t(match[1], { n: name() })], acts: [], conversational: true } : null;
  }
  function answer(q) {
    const Q = norm(q);
    const social = conversation(q); if (social) return social;
    if (!Q) return { title: name(), lines: [t('sm.hello', { n: name() })], src: 'fact', acts: [] };
    if (Q === norm(t('sm.q2')) || HAS(Q, ['გამოცდ', 'exam', 'экзамен', 'examen', 'prüfung', 'prufung', 'esame', 'exame', 'sınav', 'іспит', 'egzamin', 'امتحان', 'परीक्षा', '考试', '試験', '시험'])) return examAnswer();
    if (Q === norm(t('sm.q1')) || HAS(Q, ['რა ვივარჯიშ', 'რას ვივარჯიშ', 'რა ვქნა', 'რა ვაკეთო', 'სად შევჩერდი', 'შემდეგ', 'დღეს რა'])) return practiceAnswer();
    // a song the app holds — its chords, its rhythm, and how to learn it
    const song = findSong(Q); if (song) return songAnswer(song, Q);
    // the song open in the AI studio, or a request to analyse one
    if (has(Q, 'analyse') || (has(Q, 'upload') && (has(Q, 'chord') || has(Q, 'rhythm')))) return analysisAnswer();
    // how to learn at all: the course, in order
    if ((has(Q, 'learn') || has(Q, 'start')) && (has(Q, 'music') || has(Q, 'start')) && !has(Q, 'chord') && !has(Q, 'rhythm')) return learnAnswer();
    const r = rhythmAnswer(Q); if (r) return r;
    const c = chordAnswer(q); if (c) return c;
    const n = noteAnswer(Q); if (n) return n;
    const ins = instrumentAnswer(Q); if (ins) return ins;
    // a song the app does not hold: it can be brought into the AI studio, or looked up on the internet
    if ((has(Q, 'chord') || has(Q, 'rhythm') || has(Q, 'search')) && (has(Q, 'song') || has(Q, 'search') || /[„“"«]/u.test(q)))
      return { title: name(), lines: [t('sm.sgNone')], src: 'fact', web: true, acts: [[t('ai.title'), ['ai']], [t('nav.songs'), ['songs']]] };
    // otherwise: the closest thing the teacher has written
    let ws = words(expand(Q)); if (!ws.length) ws = norm(Q).split(' ').filter(w => w.length > 2); if (!ws.length) return miss();
    /* A word in the title means far more than the same word somewhere in the body: asking about
       "ჯაზი" should open the jazz chapter, not every chapter that happens to mention it. On a tie
       the shorter, more exact title wins. */
    const scored = index().map(x => {
      const ti = norm(x.title); let s2 = 0;
      ws.forEach(w => { const st = stem(w); if (x.text.includes(st)) s2 += Math.min(3, 1 + w.length / 4); if (ti.includes(st)) s2 += 2; });
      if (ti === Q) s2 += 5; else if (ti.includes(Q)) s2 += 3;
      if (s2 && (x.kind === 'book' || x.kind === 'chapter') && (has(Q, 'why') || has(Q, 'where') || /^რა (არის|არიან)|^what (is|are)/u.test(Q))) s2 += 1;
      return { x, s: s2 - Math.min(1, ti.length / 200) };
    }).sort((a, b) => b.s - a.s);
    const top = scored[0];
    if (!top || top.s < 2) return miss();
    const x = top.x;
    // "why" gets the why, "how" the how, "where" the where — the rest of the card follows only when it is short
    let body = x.body;
    if (x.parts) {
      const want = has(Q, 'why') ? 'why' : has(Q, 'where') ? 'where' : has(Q, 'how') ? 'how' : 'what';
      const first = x.parts[want] && x.parts[want].length ? x.parts[want] : [];
      if (first.length) body = first.concat(want !== 'what' && x.parts.what && x.parts.what.length ? x.parts.what : []).slice(0, 6);
    }
    return { title: x.title, lines: body.length ? body : [t('sm.seeLesson')], src: x.src, ai: x.ai, acts: x.go ? [[t('sm.go'), x.go]] : [],
      more: scored.slice(1, 4).filter(y => y.s >= 2).map(y => y.x) };
  }
  const miss = () => ({ title: name(), lines: [t('sm.dontKnow')], src: 'fact',
    acts: [[t('nav.learn'), ['learn']], [t('tp.title'), ['tips']]] });

  // Text-only compatibility API: no speech or microphone access.
  const say = () => false, canHear = () => false, kaVoice = () => null;
  const W = { want: false, rec: null };
  const fab = () => document.querySelector('.sm-fab');
  const listen = () => false, stopRec = () => {}, schedule = () => {}, startRec = () => false;
  let history = [], pending = false, generation = 0;

  /* ---------------- the panel ---------------- */
  let box = null;
  function close() {
    generation++; pending = false; history = [];
    if (box) { box.remove(); box = null; }

    if (W.want) { stopRec(); schedule(); }
  }
  function open(q) {
    close();
    const log = h('div', { class: 'sm-log', role: 'log', 'aria-live': 'polite' });
    const input = h('input', { class: 'input sm-in', type: 'text', placeholder: t('sm.ask'), maxlength: '2000', 'aria-label': t('sm.ask') });
    const send = () => { if (pending) return; const v = input.value.trim(); if (!v) return; input.value = ''; put(v); };
    const mic = canHear() ? h('button', { class: 'btn small', text: '🎤', 'aria-label': t('sm.once'), onclick: once }) : null;
    const head = h('div', { class: 'sm-head' }, [
      h('div', { class: 'sm-av', text: name()[0] }),
      h('div', { class: 'grow' }, [h('b', { text: name() }), h('small', { class: 'muted', text: t('sm.sub') })]),
      h('button', { class: 'btn icon quiet', 'aria-label': t('close'), html: PD.ic.close || '✕', onclick: close })]);
    box = h('div', { class: 'sm-wrap', role: 'dialog', 'aria-label': name() }, [
      h('div', { class: 'sm-card' }, [head, h('small', { class: 'muted sm-note', text: t('sm.privacy') }), log,
        h('div', { class: 'sm-chips' }, [
          t('sm.q1'), t('sm.q2'), t('sm.q3'), t('sm.q4')
        ].map(lab => h('button', { class: 'chip', text: lab, onclick: () => put(lab) }))),
        h('div', { class: 'sm-row' }, [input, mic, h('button', { class: 'btn primary', text: t('sm.send'), onclick: send })].filter(Boolean)),
        canHear() && !S.get('sima.wake', false)
          ? h('button', { class: 'btn small sm-wake', text: t('sm.wakeAsk', { n: name() }), onclick: async e2 => { if (await wakeOn()) e2.currentTarget.remove(); } })
          : canHear() ? h('small', { class: 'muted sm-note', text: t('sm.wakeLive', { n: name() }) }) : null])]);
    document.body.appendChild(box);
    input.onkeydown = e => { if (e.key === 'Enter') { e.preventDefault(); send(); } };
    PD.i18n.apply(box);
    if (q) put(q); else { bubble(t('sm.hello', { n: name() }), null); if (W.want) { stopRec(); setTimeout(() => { if (W.want && box) startRec('talk'); }, 250); } }
    setTimeout(() => { try { input.focus({ preventScroll: true }); } catch (_) {} }, 60);
  }
  const once = () => false, wakeOn = async () => false;
  const SRC = { teacher: 'tp.src.teacher', draft: 'tp.src.draft', general: 'tp.src.general', fact: 'tp.src.fact' };
  function bubble(text, a, who) {
    if (!box) return;
    const el = h('div', { class: 'sm-b ' + (who === 'me' ? 'me' : 'her') },
      a && a.title ? [h('b', { class: 'sm-t', text: a.title }), h('p', { text })] : [h('p', { text })]);
    if (a) {
      if (a.ai) el.append(h('span', { class: 'tp-src draft', text: t('sm.aiLabel') }));
      if (a.src && SRC[a.src]) el.append(h('span', { class: 'tp-src ' + a.src, text: (PD.ui.srcLabel ? PD.ui.srcLabel(SRC[a.src]) : t(SRC[a.src])) }));
      if (a.acts && a.acts.length) el.append(h('div', { class: 'sm-acts' }, a.acts.map(([lab, go, fn]) =>
        h('button', { class: 'btn small', text: lab, onclick: () => { close(); if (fn) fn(); else if (go) PD.app.go(go[0], go[1] || null); } }))));
      if (a.more && a.more.length) el.append(h('div', { class: 'sm-more' }, a.more.map(x =>
        h('button', { class: 'chip', text: x.title, onclick: () => put(x.title) }))));
    }
    // where an internet answer came from — every site it used, opened outside the app
    if (a && a.links && a.links.length) el.append(h('div', { class: 'sm-links' }, [h('small', { class: 'muted', text: t('sm.sources') })].concat(a.links.slice(0, 5)
      .filter(x => x && /^https?:\/\//.test(x.url || '')).map(x => { let host = x.url; try { host = new URL(x.url).hostname.replace(/^www\./, ''); } catch (_) {}
        return h('a', { href: x.url, target: '_blank', rel: 'noopener noreferrer', text: x.title ? String(x.title).slice(0, 80) : host }); }))));
    const lg = box.querySelector('.sm-log'); if (lg) { lg.append(el); lg.scrollTop = lg.scrollHeight; }
  }
  async function put(q) {
    if (!box) open();
    if (pending) return;
    q = String(q).trim().slice(0, 2000); if (!q) return;
    bubble(q, null, 'me');
    const local = answer(q);
    if (local.conversational && (!PD.cloud || !PD.cloud.configured || !PD.cloud.user)) {
      bubble(local.lines.join('\n'), local);
      history = history.concat({ role: 'user', content: q }, { role: 'assistant', content: local.lines.join('\n') }).slice(-10);
      return;
    }
    if (!PD.cloud || !PD.cloud.configured || !PD.cloud.user) {
      bubble(t(PD.cloud && PD.cloud.configured ? 'sm.signIn' : 'sm.notConnected'), null);
      bubble(local.lines.join('\n'), local);
      return;
    }
    pending = true;
    const current = generation, panel = box;
    panel.querySelectorAll('.sm-row button, .sm-chips button').forEach(b => b.disabled = true);
    const status = h('small', { class: 'muted sm-note', text: t('sm.thinking'), role: 'status' });
    panel.querySelector('.sm-log').append(status);
    try {
      const Qn = norm(q);
      const result = await PD.cloud.sima({
        messages: history.concat({ role: 'user', content: q }).slice(-12), language: PD.i18n.lang,
        // the internet only when the app does not hold the answer: a song it does not have, or the learner asks for it
        web: !!local.web || has(Qn, 'search') || ((has(Qn, 'chord') || has(Qn, 'rhythm')) && has(Qn, 'song') && !findSong(Qn)),
        context: { title: local.title, lines: local.lines.slice(0, 24), source: local.src || (local.ai ? 'ai-estimate' : null), app: digest(),
          related: index().filter(x => words(q).some(w => x.text.includes(stem(w)))).slice(0, 5)
            .map(x => ({ title: x.title, lines: x.body.slice(0, 8).map(l => String(l).slice(0, 400)), source: x.src })) }
      });
      if (current !== generation || panel !== box) return;
      if (!result || typeof result.text !== 'string' || !result.text.trim()) throw new Error('empty');
      history = history.concat({ role: 'user', content: q }, { role: 'assistant', content: result.text }).slice(-10);
      bubble(result.text, { title: name(), ai: true, links: Array.isArray(result.sources) ? result.sources : [] });
    } catch (_) {
      if (current !== generation || panel !== box) return;
      bubble(t('sm.unavailable'), null);
      bubble(local.lines.join('\n'), local);
    } finally {
      status.remove();
      if (current === generation && panel === box) {
        pending = false;
        panel.querySelectorAll('.sm-row button, .sm-chips button').forEach(b => b.disabled = false);
      }
    }
  }

  /* ---------------- the button that is always there ---------------- */
  function mount() {
    if (document.querySelector('.sm-fab') || !S.get('sima.on', true)) return;
    const b = h('button', { class: 'sm-fab', 'aria-label': name(), onclick: () => open('') }, [h('span', { text: name()[0] })]);
    document.body.appendChild(b);
  }
  function refresh() { const b = fab(); if (b) b.remove(); mount(); listen(S.get('sima.wake', false)); }
  // she starts listening as soon as the app does, if the learner has allowed it
  PD.bus.on('ready', () => { if (S.get('sima.wake', false)) listen(true); });
  setTimeout(() => { if (S.get('sima.wake', false)) listen(true); }, 1500);

  /* ---------------- she speaks first, when it helps ---------------- */
  function nudge() {
    if (!S.get('sima.nudge', true) || box) return;
    const last = S.get('sima.lastNudge', 0); if (Date.now() - last < 6 * 3600e3) return;
    let a = null;
    const due = PD.exam && PD.exam.waiting && PD.exam.waiting();
    if (due) a = { q: t('sm.q2') };
    else { const sug = PD.coach && PD.coach.today && PD.coach.today(); if (sug) a = { q: t('sm.q1') }; }
    if (!a) return;
    S.set('sima.lastNudge', Date.now());
    const tip = h('button', { class: 'sm-tip', onclick: () => { tip.remove(); open(a.q); } },
      [h('span', { class: 'sm-av', text: name()[0] }), h('span', { text: t('sm.nudge', { n: name() }) })]);
    document.body.appendChild(tip);
    setTimeout(() => tip.remove(), 12000);
  }

  PD.bus.on('lang', () => { api._ix = null; });
  // a new song from the AI studio, a teacher package, a lesson saved: she reads the list again
  ['lessons', 'curriculum', 'rhythms'].forEach(e => PD.bus.on(e, () => { api._ix = null; }));   // what she searches is the text in the chosen language
  const api = { get NAME() { return name(); }, open, close, answer, say, listen, wakeOn, once, canHear, kaVoice, mount, refresh, nudge, index, get hearing() { return !!W.rec; } };
  return api;
})();

PD.i18n.add({
  'sm.greeting': ['გამარჯობა! მიხარია, რომ მომწერე. როგორ ხარ?', 'Hello! Glad to hear from you. How are you?'],
  'sm.howAreYou': ['მადლობა მოკითხვისთვის! მზად ვარ, გესაუბრო და სწავლაში დაგეხმარო. შენ როგორ ხარ?', 'Thanks for asking! I am ready to chat and help you learn. How are you?'],
  'sm.thanks': ['არაფრის! თუ კიდევ რამე დაგაინტერესებს, მომწერე.', 'You are welcome! If you have another question, just ask.'],
  'sm.goodbye': ['დროებით! როცა მოგინდება, ისევ მომწერე.', 'Bye! Come back whenever you like.'],
  'sm.creatorT': ['ვინ შექმნა აპლიკაცია', 'Who made the app'],
  'sm.creator': ['ეს აპლიკაცია — „ფანდური" — შექმნა ნუკრი ბერიძემ. სასწავლო მასალა, რასაც აქ ხედავ (აკორდები, რითმები, თითები), მასწავლებლისაა; აპი კი ნუკრის ნამუშევარია.', 'This app — “Panduri” — was created by Nukri Beridze. The teaching material you see here (chords, rhythms, fingerings) is the teacher\'s; the app itself is Nukri\'s work.'],
  'sm.madeMe': ['მე და მთელი ეს აპლიკაცია ნუკრი ბერიძემ შექმნა. მე აქ ვარ, რომ ფანდურის სწავლაში დაგეხმარო.', 'Nukri Beridze created me and this whole app. I am here to help you learn the panduri.'],
  'sm.nukri': ['ნუკრი ბერიძე ამ აპლიკაციის შემქმნელია. „ფანდური" ქართულ სამსიმიან ფანდურზე დაკვრას ასწავლის ნამდვილ ინსტრუმენტზე: მიკროფონით გისმენს, გელოდება და მასწავლებლის მასალას გაჩვენებს. თუ ნუკრიზე მეტის გაგება გინდა, ჯერ მხოლოდ ეს ვიცი.', 'Nukri Beridze is the creator of this app. “Panduri” teaches the Georgian three-string panduri on a real instrument: it listens through the microphone, waits for you and shows the teacher\'s material. That is all I know about Nukri for now.'],
  'sm.who': ['მე {n} ვარ, შენი AI სასწავლო დამხმარე. შეგიძლია ჩვეულებრივად მომწერო — კითხვები დამისვა და მითხრა, რისი გაგება გინდა.', 'I am {n}, your AI learning helper. You can write naturally, ask questions and tell me what you want to understand.'],
  'sm.fine': ['მიხარია! რაზე გინდა ვისაუბროთ?', 'Glad to hear it! What would you like to talk about?'],
  'sm.aiLabel': ['AI პასუხი • შეიძლება შეცდეს', 'AI response • may make mistakes'],
  'sm.thinking': ['სიმა პასუხს ამზადებს…', 'Sima is preparing an answer…'],
  'sm.notConnected': ['AI სერვერი ჯერ არ არის დაკავშირებული. ქვემოთ აპის სასწავლო მასალაა.', 'The AI server is not connected yet. Below is material from the app.'],
  'sm.signIn': ['AI საუბრისთვის შედი ანგარიშში. ქვემოთ აპის სასწავლო მასალაა.', 'Sign in for AI conversation. Below is material from the app.'],
  'sm.unavailable': ['AI პასუხი ახლა ვერ მივიღე. სცადე ხელახლა; ქვემოთ აპის სასწავლო მასალაა.', 'The AI could not reply. Try again; below is material from the app.'],
  'sm.sub': ['შენი სასწავლო თანამოსაუბრე • მხოლოდ ტექსტით', 'Your learning companion • text only'],
  'sm.hello': ['გამარჯობა! მე {n} ვარ. როგორ ხარ? შეგიძლია ჩვეულებრივად მომწერო და მკითხო, რაც გაინტერესებს.', 'Hello! I am {n}. How are you? You can chat naturally and ask me what you would like to know.'],
  'sm.privacy': ['AI ჩატის ტექსტი მუშავდება AI სერვისში; სიმღერის მოსაძებნად კითხვა შეიძლება ინტერნეტ-ძიებასაც გადაეცეს. პირადი მონაცემები არ ჩაწერო.', 'AI chat text is processed by an AI service; to look up a song, the question may also go to an internet search. Avoid personal details.'],
  'sm.ask': ['დამიწერე კითხვა…', 'Type your question…'], 'sm.send': ['კითხვა', 'Ask'], 'sm.once': ['ერთხელ მკითხე ხმით', 'Ask once by voice'],
  'sm.listening': ['გისმენ…', 'Listening…'],
  'sm.q1': ['რა ვივარჯიშო დღეს?', 'What should I practise today?'], 'sm.q2': ['გამოცდა მელოდება?', 'Is an exam waiting?'],
  'sm.q3': ['როგორ ავიღო Bm?', 'How do I take Bm?'], 'sm.q4': ['აჭარულის რითმი', 'The acharuli rhythm'],
  'sm.chordIs': ['{n} ასე აიღება:', '{n} is held like this:'],
  'sm.chordsAre': ['ეს აკორდები ფანდურზე ასე აიღება (სიმები A · C♯ · E):', 'These chords on the panduri (strings A · C♯ · E):'],
  'sm.stTech': ['რითმი — მხოლოდ მარჯვენა ხელით: {s}, {c}-ზე, ნელა და წრეზე.', 'Rhythm — the right hand only: {s} on {c}, slowly, on a loop.'],
  'sm.stChords': ['აკორდები რითმით — ყოველი დარტყმით, 60% ტემპით, მუსიკასთან ერთად.', 'Chords with the rhythm — every stroke, at 60% tempo, with the music.'],
  'sm.sgCycle': ['{t} — აკორდები: {c}. ეს წრე მთელ სიმღერაში მეორდება.', '{t} — chords: {c}. This cycle repeats through the whole song.'],
  'sm.sgChords': ['{t} — აკორდები: {c}.', '{t} — chords: {c}.'],
  'sm.sgRhythm': ['რითმი: {r} — {s}.', 'Rhythm: {r} — {s}.'],
  'sm.sgPer': ['ყოველი აკორდი ერთ რითმს გრძელდება.', 'Each chord lasts one rhythm.'],
  'sm.sgTime': ['ზომა {m} · ტემპი დაახლოებით {b} BPM.', 'Time {m} · tempo about {b} BPM.'],
  'sm.sgPlan': ['ასე ისწავლე, ნაბიჯ-ნაბიჯ (სიმღერის გვერდზეც ეს რიგია):', 'Learn it step by step (the song page follows the same order):'],
  'sm.openSong': ['სიმღერის გვერდი', 'The song page'],
  'sm.sgNone': ['ეს სიმღერა აპში ჯერ არ არის. ორი გზა გაქვს: ატვირთე ის AI სტუდიაში — ჩანაწერიდან ამოიცნობს აკორდებს, ტემპსა და დარტყმებს და ბანი-აჭარულის მსგავს გაკვეთილად გადააქცევს; ან შედი ანგარიშში და მე ინტერნეტში მოვძებნი მის აკორდებს.', 'This song is not in the app yet. There are two ways: upload it in the AI studio — it measures the chords, tempo and strokes from the recording and turns it into a lesson like Bani-Acharuli; or sign in and I will look its chords up on the internet.'],
  'sm.aiHow': ['AI სტუდიაში ატვირთე სიმღერა: AI ამოიცნობს აკორდებს, ტონალობას, ტემპსა და დარტყმებს, ინსტრუმენტებად დაყოფს და ჩანართში „ისწავლე" მისგან გაკვეთილს გააკეთებს — რითმსაც იქ აირჩევ. ყველაფერი შენს მოწყობილობაზე ხდება. ანალიზის შემდეგ მკითხე „ამ სიმღერის აკორდები" და გეტყვი, რა მოისმინა.', 'Upload a song in the AI studio: the AI measures the chords, key, tempo and strokes, splits it into instruments and makes a lesson of it in the “Learn it” tab, where you also choose the rhythm. Everything happens on your device. After the analysis ask me “the chords of this song” and I will tell you what it heard.'],
  'sm.aiHeard': ['AI სტუდიამ ჩანაწერში „{n}" ეს მოისმინა:', 'What the AI studio heard in “{n}”:'],
  'sm.aiKey': ['ტონალობა: {k} · ტემპი დაახლოებით {b} BPM', 'Key: {k} · tempo about {b} BPM'],
  'sm.aiCycle': ['მეორდება წრე: {c}', 'The repeating cycle: {c}'],
  'sm.aiTop': ['ყველაზე ხშირი აკორდები: {c}', 'The chords heard most: {c}'],
  'sm.aiCheck': ['ეს AI-ის შეფასებაა — შეამოწმე ყურით. ჩანართში „ისწავლე" მისგან გაკვეთილს გააკეთებ.', 'This is an AI estimate — check it by ear. In the “Learn it” tab you can make a lesson of it.'],
  'sm.howLearnT': ['როგორ ვისწავლოთ ფანდურზე დაკვრა', 'How to learn the panduri'],
  'sm.howLearn': ['სწავლის გვერდზე გზები ამ რიგითაა; თითოეულს თავისი ნაბიჯები აქვს:', 'On the learn page the roads come in this order; each has its own steps:'],
  'sm.howSong': ['სიმღერა ასე ისწავლება: ჯერ მოსმენა, მერე მხოლოდ რითმი მარჯვენა ხელით, მერე აკორდები რითმით, ნელა, და ბოლოს მთელი სიმღერა. მაგალითად, {t}: {c}, რითმი — {s}.', 'A song is learned like this: listen first, then the rhythm alone with the right hand, then the chords with the rhythm, slowly, and finally the whole song. For example, {t}: {c}, rhythm — {s}.'],
  'sm.yourNext': ['შენი შემდეგი ნაბიჯი: {s}', 'Your next step: {s}'],
  'sm.lsChords': ['აკორდები: {c}', 'Chords: {c}'],
  'sm.pathIs': ['ამ გზაზე {n} ნაბიჯია:', 'This road has {n} steps:'],
  'sm.rhythmsAre': ['აპში მასწავლებლის {n} რითმია:', 'The app holds the teacher\'s {n} rhythms:'],
  'sm.rhythmSongs': ['ამ რითმით იკვრება: {s}', 'Played in this rhythm: {s}'],
  'sm.instT': ['ფანდური: სიმები, ლადები, აწყობა', 'The panduri: strings, frets, tuning'],
  'sm.inst': ['ფანდურს 3 სიმი აქვს, ამ აპში ტარზე კი {f} ლადია. აწყობა: A · C♯ · E.', 'The panduri has 3 strings, and in this app the neck has {f} frets. Tuning: A · C♯ · E.'],
  'sm.instS': ['მასწავლებელი სიმებს ასე ასახელებს: მე-3 სიმი — ბანი (A, ყველაზე სქელი), მე-2 სიმი — მე-2 ხმა (C♯), 1-ლი სიმი — 1-ლი ხმა (E, ყველაზე თხელი).', 'The teacher names the strings: the 3rd string — the bass (A, the thickest), the 2nd string — the 2nd voice (C♯), the 1st string — the 1st voice (E, the thinnest).'],
  'sm.sources': ['წყაროები ინტერნეტიდან:', 'Sources from the internet:'],
  'sm.open': ['ღია', 'open'], 'sm.fret': ['{n} ლადი', 'fret {n}'], 'sm.thumb': ['ცერა თითი (T)', 'the thumb (T)'],
  'sm.finger': ['{n} — {name} თითი', 'finger {n} — {name}'],
  'sm.go': ['გახსნა', 'Open'],
  'sm.app.friends': ['მეგობრის დამატება', 'Adding a friend'], 'sm.app.friendsB': ['საზოგადოება → ზედა მარცხენა ხატულა (მეგობრები და ძებნა): ჩაწერე მეგობრის ზუსტი nickname და გაუგზავნე თხოვნა. როცა დაგეთანხმება, შეგატყობინებ — და მერე შეგიძლიათ ერთმანეთს მიწეროთ.', 'Community → the icon at the top left (friends and search): type your friend\u2019s exact nickname and send a request. I will tell you when they accept — then you can write to each other.'],
  'sm.app.feed': ['ვიდეოს გამოქვეყნება', 'Posting a video'], 'sm.app.feedB': ['საზოგადოება → ზედა მარჯვენა „+": გადაიღე ან აირჩიე ვიდეო გალერეიდან (მაქს. 60 წამი, 720p-დან 4K-მდე), დაწერე აღწერა და სიმღერის ან რიტმის სახელი და აირჩიე, ვინ ნახავს — ყველა (გლობალური) ან მხოლოდ მეგობრები. ვიდეო იტვირთება ისე, როგორც გადაღებულია. ორჯერ შეხება ვიდეოზე მოწონებაა.', 'Community → the “+” at the top right: film a video or choose one from the gallery (up to 60 seconds, 720p to 4K), write a caption and the name of the song or rhythm, and pick who sees it — everyone (global) or friends only. The video is uploaded exactly as it was filmed. A double tap on a video likes it.'],
  'sm.app.notify': ['შეტყობინებები', 'Notifications'], 'sm.app.notifyB': ['პარამეტრები → შეტყობინებები: ჩართე და აირჩიე, რაზე გინდა ჩემგან შეტყობინება და რომელ საათზე შეგახსენო ვარჯიში. მოვა ყველა მოწყობილობაზე, სადაც შესული ხარ.', 'Settings → Notifications: switch them on, choose what I should tell you about and when to remind you to practise. They reach every device you are signed in on.'],
  'sm.openChord': ['აკორდი ტარზე', 'The chord on the neck'], 'sm.howTaken': ['როგორ აიღო', 'How to take it'],
  'sm.noteOn': ['ნოტი ლადზე', 'The note on that fret'], 'sm.openFret': ['ლადების რუკა', 'The fret map'],
  'sm.rhythmIs': ['{n} — {c} დარტყმა:', '{n} — {c} strokes:'],
  'sm.meter': ['ზომა {b}/{u}, დაჯგუფება {g}.', 'Time signature {b}/{u}, grouped {g}.'],
  'sm.openRhythm': ['რითმის გვერდი', 'The rhythm page'], 'sm.metro': ['მეტრონომი', 'Metronome'],
  'sm.next': ['შემდეგი ნაბიჯი', 'Your next step'],
  'sm.noHistory': ['ჯერ საკმარისი ვარჯიში არ გაქვს, რომ სუსტი ადგილი დავინახო. გაიარე ერთი გაკვეთილი და მერე მკითხე.', 'You have not practised enough yet for me to see a weak spot. Do one lesson and ask me again.'],
  'sm.examDue': ['დიახ — გამოცდა გელოდება. სანამ არ ჩააბარებ, შემდეგი ბლოკი დაკეტილია.', 'Yes — an exam is waiting. The next block stays locked until you pass it.'],
  'sm.examNone': ['ახლა გამოცდა არ გელოდება.', 'No exam is waiting right now.'], 'sm.examGo': ['გამოცდაზე გადასვლა', 'Go to the exam'],
  'sm.seeLesson': ['ეს გაკვეთილი ამას ხსნის — გახსენი და ნახე.', 'This lesson explains it — open it and see.'],
  'sm.dontKnow': ['ამაზე პასუხი ამ აპში ჯერ არ არის. არ მინდა მოგიგონო — ჰკითხე მასწავლებელს, და როგორც კი დაამატებს, გეტყვი.', 'There is no answer for that in this app yet. I will not make one up — ask the teacher, and once it is added I will tell you.'],
  'sm.noVoice': ['ამ მოწყობილობას ქართული ხმა არ აქვს — ვწერ, ხმით ვერ ვკითხულობ.', 'This device has no voice for this language — I write, but cannot read aloud.'],
  'sm.nudge': ['{n}-ს რჩევა აქვს', '{n} has a suggestion'],
  'sm.title': ['სიმა — დამხმარე', 'Sima — the helper'],
  'sm.on': ['სიმა ჩართულია', 'Sima is on'], 'sm.voice': ['ხმით კითხულობს', 'Reads aloud'],
  'sm.nudgeOn': ['თვითონ იწყებს რჩევას', 'Offers advice on her own'],
  'sm.wake': ['სახელით გამოძახება', 'Call her by name'],
  'sm.wakeD': ['ჩართვის შემდეგ მიკროფონი ღიად რჩება და სიტყვა „სიმა“ გახსნის მას. ყურადღება: ამ ფუნქციისთვის ბრაუზერი ხმას თავის სერვისს უგზავნის (Google/Apple) — ეს ერთადერთი ადგილია აპში, სადაც ხმა მოწყობილობიდან გადის. ნაგულისხმევად გამორთულია.', 'With this on the microphone stays open and the word “Sima” opens her. Note: for this the browser sends the audio to its own service (Google/Apple) — the one place in this app where sound leaves the device. Off by default.'],
  'sm.wakeAsk': ['🎤 სახელით გამომიძახე — თქვი „{n}“', '🎤 Call me by name — say “{n}”'],
  'sm.wakeLive': ['ყურს გიგდებ: სადაც არ უნდა იყო, თქვი „{n}“ და გამოვჩნდები.', 'I am listening: wherever you are, say “{n}” and I will come.'],
  'sm.wakeOn': ['მზად ვარ — თქვი „{n}“ და გამოვჩნდები. გაკვეთილისა და ტიუნერის დროს ყურს ვიღებ, რომ მიკროფონი არ წაგართვა.', 'Ready — say “{n}” and I will come. During a lesson or the tuner I step aside so the microphone stays yours.'],
  'sm.micNo': ['მიკროფონზე უფლება ვერ მივიღე — ბრაუზერის პარამეტრებში დაამატე.', 'I could not get the microphone — allow it in the browser settings.'],
  'sm.micBusy': ['ახლა მიკროფონი გაკვეთილს უჭირავს — ჯერ დაასრულე.', 'The lesson is using the microphone right now — finish it first.'],
  'sm.wakeNo': ['ამ ბრაუზერს ხმის ამოცნობა არ აქვს — ღილაკით გამოიძახე.', 'This browser cannot listen — use the button instead.']
});
