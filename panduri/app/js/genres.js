/* =====================================================================
   Where music comes from — and the two musics (blues and jazz) that
   most of today's popular music learned its harmony from.

   Everything in this file is GENERAL music theory and documented music
   history, not the teacher's panduri material: every page is marked
   with that source badge, and every chapter carries the links the
   facts came from. The one thing that is computed rather than quoted
   is the panduri fingering of each chord — that comes from
   PD.theory.voicings, which already applies the teacher's own rule for
   the thumb and the two voices above it. Nothing about panduri
   technique is invented here.
   ===================================================================== */
PD.i18n.add({
  'gn.title': ['საიდან მოდის მუსიკა', 'Where music comes from'],
  'gn.lead': ['მუსიკის ისტორია მოკლედ: რა იცის მეცნიერებამ დასაწყისზე, საიდან მოვიდა ბლუზი და ჯაზი, და სად დგას ქართული მრავალხმიანობა ამ ყველაფერში.', 'A short history: what is actually known about the beginning, where the blues and jazz came from, and where Georgian polyphony stands in all of it.'],
  'gn.src': ['ზოგადი მუსიკის თეორია და ისტორია — არა მასწავლებლის მასალა', 'General music theory and history — not the teacher\'s material'],
  'gn.chapter': ['თავი {n}', 'Chapter {n}'],
  'gn.sources': ['წყაროები', 'Sources'],
  'gn.rem': ['დაიმახსოვრე', 'Remember'],
  'gn.next': ['შემდეგი', 'Next'], 'gn.list': ['ყველა თავი', 'All chapters'],
  'gn.12': ['12-ტაქტიანი ბლუზი და ჯაზი', '12-bar blues and jazz'],
  'gn.12d': ['სამი ფორმა — ტაქტი ტაქტზე, ფანდურის აკორდებით და ხმით.', 'Three forms — bar by bar, with the panduri shapes and the sound.'],
  'gn.key': ['ტონალობა', 'Key'], 'gn.form': ['ფორმა', 'Form'],
  'gn.bar': ['ტაქტი {n}', 'Bar {n}'],
  'gn.playAll': ['▶ 12 ტაქტი', '▶ Play the 12 bars'], 'gn.stop': ['■ გაჩერება', '■ Stop'],
  'gn.tempo': ['ტემპი', 'Tempo'],
  'gn.tapBar': ['დააჭირე ტაქტს — გაიგონებ აკორდს და დაინახავ, როგორ აიღო ფანდურზე.', 'Tap a bar — you hear the chord and see how it is taken on the panduri.'],
  'gn.noShape': ['ამ აკორდს სამ სიმზე ფანდურული პოზიცია არ აქვს — ამიტომ მას ვერ დავაკრავთ. ქვემოთ წერია, რომელი ბგერები სჭირდება.', 'This chord has no three-string panduri position, so it cannot be played here. The tones it needs are written below.'],
  'gn.need': ['სჭირდება: {s}', 'It needs: {s}'],
  'gn.rn': ['საფეხური', 'Degree'],
  'gn.why': ['რატომ', 'Why'],
  'gn.openQ': ['ფანდურზე 12-ტაქტიანი ბლუზი ხალხური რეპერტუარის ნაწილი არ არის — ეს აქ იმიტომაა, რომ ჰარმონია გაიგო და სხვა მუსიკაც დაუკრა. მასწავლებლისგან ამ ფორმაზე მასალა არ გვაქვს.', 'The 12-bar blues is not part of the folk repertoire of the panduri — it is here so you can understand harmony and play other music too. We have no material on this form from the teacher.'],
  'gn.scaleGo': ['გამები ფანდურზე', 'Scales on the panduri'],
  'gn.ch.origin': ['მუსიკის დასაწყისი', 'How music began'],
  'gn.ch.geo': ['ქართული მრავალხმიანობა — და სიმართლე „ყველაფერი ჯაზიდან მოდის“-ზე', 'Georgian polyphony — and the truth about “it all comes from jazz”'],
  'gn.ch.blues': ['ბლუზი', 'The blues'],
  'gn.ch.jazz': ['ჯაზი', 'Jazz'],
  'gn.ch.std': ['სტანდარტები — რა არის და რატომ', 'Standards — what they are and why'],
  'gn.ch.scales': ['გამები: მაჟორიდან ბლუზამდე', 'Scales: from major to blues']
});

PD.genres = (() => {
  const h = PD.h, t = PD.i18n.t, TH = PD.theory, ic = PD.ic;
  const L = (ka, en) => PD.i18n.pick({ ka, en });
  /* ---------- building blocks (the theory book's own look) ---------- */
  const P = (ka, en) => h('p', { class: 'tb-p', html: L(ka, en) });
  const H = (ka, en) => h('h3', { class: 'tb-h', text: L(ka, en) });
  const UL = items => h('ul', { class: 'tb-ul' }, items.map(([ka, en]) => h('li', { html: L(ka, en) })));
  const NOTICE = (ka, en) => h('p', { class: 'tb-note', html: L(ka, en) });
  const TABLE = (head, rows) => h('div', { class: 'tb-tw' }, [h('table', { class: 'tb-t' }, [
    h('thead', {}, [h('tr', {}, head.map(c => h('th', { text: c })))]),
    h('tbody', {}, rows.map(r => h('tr', {}, r.map(c => c && c.nodeType ? h('td', {}, [c]) : h('td', { html: String(c) })))))])]);
  const SRC = links => h('section', { class: 'gn-src' }, [h('b', { 'data-t': 'gn.sources' }),
    h('ul', {}, links.map(([tx, u]) => h('li', {}, [h('a', { href: u, target: '_blank', rel: 'noopener noreferrer', text: tx })])))]);
  const REM = items => h('section', { class: 'tbs-rem' }, [h('h3', { 'data-t': 'gn.rem' }), h('ul', {}, items.map(([ka, en]) => h('li', { html: L(ka, en) })))]);
  const GOTO = (ka, en, route, param) => h('button', { class: 'btn small', text: L(ka, en), onclick: () => PD.app.go(route, param) });

  /* =================== chords of a form, on this instrument ===================
     The form is stored in semitones above the key, so any key is exact. The shape
     is whatever PD.theory.voicings says is playable on the real tuning — and when
     a chord has no three-string position the bar says so instead of faking one. */
  const PCS = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  const FLATKEY = [5, 10, 3, 8, 1, 6];                        // F B♭ E♭ A♭ D♭ G♭ — written with flats
  const nameOf = (pc, key) => (FLATKEY.includes(key) ? TH.NN_FLAT : TH.NN)[((pc % 12) + 12) % 12];
  const kaOf = (pc, key) => (FLATKEY.includes(key) ? TH.NN_KA_FLAT : TH.NN_KA)[((pc % 12) + 12) % 12];
  /** '7' | 'm7' | 'maj7' | 'm7♭5' | 'dim7' … → the chord type the instrument knows */
  const typeOf = q => TH.CHORD_TYPES.find(x => x.k === q) || null;
  function chordAt(key, off, q) {
    const pc = ((key + off) % 12 + 12) % 12, T = typeOf(q);
    const sym = nameOf(pc, key) + q, ka = kaOf(pc, key) + q;
    if (!T) return { pc, q, sym, ka, none: true, tones: [] };
    const vs = TH.voicings(pc, T) || [];
    const tones = T.iv.map(i => nameOf((pc + i) % 12, key));
    return { pc, q, sym, ka, T, tones, v: vs[0] || null, alt: vs.slice(1, 4), none: !vs.length };
  }
  const BAR = (ch, rn, why) => ({ ch, rn, why: why || null });
  /* The three forms every blues and jazz player is taught, written in degrees above the key.
     Bar 4 of the jazz blues and bars 2–8 of the Bird blues are chains of ii–V: the pair of
     chords that points at the next chord. (General jazz practice — see the chapter's sources.) */
  const FORMS = [
    { id: 'trad', n: ['ტრადიციული ბლუზი', 'Traditional blues'],
      d: ['სამი აკორდი — I, IV, V. ყველაზე ძველი და ყველაზე გავრცელებული ფორმა; 1930-იანებამდე ბლუზს მკაცრი ჰარმონია არც ჰქონდა.', 'Three chords — I, IV and V. The oldest and most common form; before the 1930s the blues had no fixed harmony at all.'],
      bars: [BAR([[0, '7']], 'I7'), BAR([[5, '7']], 'IV7', ['მეორე ტაქტში IV — ამას „სწრაფ ცვლილებას“ (quick change) უწოდებენ; მის გარეშეც უკრავენ.', 'IV in bar 2 is the “quick change”; the form is also played without it.']), BAR([[0, '7']], 'I7'), BAR([[0, '7']], 'I7'),
        BAR([[5, '7']], 'IV7'), BAR([[5, '7']], 'IV7'), BAR([[0, '7']], 'I7'), BAR([[0, '7']], 'I7'),
        BAR([[7, '7']], 'V7'), BAR([[5, '7']], 'IV7'), BAR([[0, '7']], 'I7'), BAR([[7, '7']], 'V7', ['ბოლო ტაქტი V-ზე უკან, თავში აბრუნებს — ამას „turnaround“ ჰქვია.', 'The last bar on V turns the form back to the top — the “turnaround”.'])] },
    { id: 'jazz', n: ['ჯაზ-ბლუზი', 'Jazz blues'],
      d: ['იგივე 12 ტაქტი, ოღონდ ჯაზური ჰარმონიით: ii–V წყვილები და მოძრავი ბანი. აქედან იწყება ჯაზის ენა.', 'The same twelve bars with jazz harmony: ii–V pairs and a moving bass. This is where the jazz language starts.'],
      bars: [BAR([[0, '7']], 'I7'), BAR([[5, '7']], 'IV7'), BAR([[0, '7']], 'I7'),
        BAR([[7, 'm7'], [0, '7']], 'v7 · I7', ['ეს ორი აკორდი IV-ზე მიგვიყვანს: v7 + I7 = ii–V IV-ის ტონალობაში.', 'These two lead to IV: v7 + I7 is the ii–V of the key of IV.']),
        BAR([[5, '7']], 'IV7'), BAR([[6, 'dim7']], '♯IV°7', ['შემცირებული აკორდი IV-დან I-ში ნახევარტონით გადაჰყავს ბანს.', 'The diminished chord walks the bass a semitone from IV back to I.']),
        BAR([[0, '7']], 'I7'), BAR([[4, 'm7'], [9, '7']], 'iii7 · VI7', ['ii–V, რომელიც ii7-ზე (მეცხრე ტაქტზე) მიგვიყვანს.', 'A ii–V aiming at the ii7 of bar 9.']),
        BAR([[2, 'm7']], 'ii7'), BAR([[7, '7']], 'V7'),
        BAR([[0, '7'], [9, '7']], 'I7 · VI7'), BAR([[2, 'm7'], [7, '7']], 'ii7 · V7', ['ჯაზური turnaround: ii–V ისევ თავში აბრუნებს.', 'The jazz turnaround: ii–V sends you back to the top.'])] },
    { id: 'bird', n: ['Bird blues (ჩარლი პარკერის ჰარმონია)', 'Bird blues (Charlie Parker’s changes)'],
      d: ['ბებოპის ბლუზი: I მაჟორ-სეპტაკორდით იწყება და ტაქტი ტაქტზე ii–V-ების ჯაჭვით ეშვება. ასე უკრავს „Blues for Alice“ და ამიტომ ამ ჰარმონიას „Bird changes“ ჰქვია.', 'The bebop blues: it starts on a major 7th and descends through a chain of ii–V pairs. These are the changes of “Blues for Alice”, which is why they are called the “Bird changes”.'],
      bars: [BAR([[0, 'maj7']], 'Imaj7', ['I7-ის ნაცვლად Imaj7 — ბლუზური ჟღერადობა მაშინვე ჯაზური ხდება.', 'Imaj7 instead of I7 — the sound turns from blues to jazz at once.']),
        BAR([[11, 'm7♭5'], [4, '7']], 'viiø7 · III7', ['ii–V, რომელიც vi-ზე (Dm) მიისწრაფვის.', 'A ii–V pointing at vi (Dm).']),
        BAR([[9, 'm7'], [2, '7']], 'vi7 · II7', ['ii–V V-ის ტონალობაში.', 'The ii–V of the key of V.']),
        BAR([[7, 'm7'], [0, '7']], 'v7 · I7', ['ii–V IV-ის ტონალობაში — IV-ზე ჩამოგვაგდებს.', 'The ii–V of IV — it lands on IV.']),
        BAR([[5, '7']], 'IV7'), BAR([[5, 'm7'], [10, '7']], 'iv7 · ♭VII7', ['ii–V ♭III-ის ტონალობაში: ჯაჭვი ტონებით ქვევით მიდის.', 'The ii–V of ♭III: the chain keeps stepping down.']),
        BAR([[4, 'm7'], [9, '7']], 'iii7 · VI7'), BAR([[3, 'm7'], [8, '7']], '♭iii7 · ♭VI7', ['ბოლო ii–V ნახევარტონით ზემოდან ეშვება ii7-ზე.', 'The last ii–V drops a semitone onto the ii7.']),
        BAR([[2, 'm7']], 'ii7'), BAR([[7, '7']], 'V7'),
        BAR([[0, '7'], [9, '7']], 'I7 · VI7'), BAR([[2, 'm7'], [7, '7']], 'ii7 · V7')] }
  ];

  /* =================== the chapters =================== */
  const CH = [
    { id: 'origin', t: 'gn.ch.origin', lead: ['მუსიკა წერაზე ძველია: ყველაზე ძველი სალამური 35–43 000 წლისაა. ყველა მუსიკა სამ რამეზე დგას — პულსი, ბგერის სიმაღლე და ერთდროულად რამდენიმე ხმა.', 'Music is older than writing: the oldest flute is 35–43,000 years old. Every music stands on three things — pulse, pitch and several voices at once.'], kw: 'მუსიკა ისტორია დასაწყისი საიდან მოდის პულსი რითმი გამა მრავალხმიანობა სალამური history origin', body: b => {
      b.append(
        P('მუსიკა უფრო ძველია, ვიდრე წერა. რას უკრავდნენ ადამიანები ათი ათასი წლის წინ, ჩვენ არ ვიცით — ხმა ხომ არ ინახება. ვიცით მხოლოდ ის, რაც მიწაშია დარჩენილი: <b>ინსტრუმენტები</b>.', 'Music is older than writing. What people played ten thousand years ago nobody knows — sound does not survive. What survives is what stayed in the ground: <b>instruments</b>.'),
        P('ყველაზე ძველი უდავო ინსტრუმენტები — <b>ძვლისა და სპილოს ძვლის სალამურები</b> სამხრეთ გერმანიაში, შვაბიის ალპებში. Hohle Fels-ის სალამური (აღმოჩენილი 2006 წელს, ფრინველის ძვლისგან, ხუთი ნახვრეტით) დაახლოებით <b>35 000 წლისაა</b>; Geissenklösterle-ს სალამურებს 2012 წლის დათარიღებამ <b>42–43 000 წელი</b> მისცა. სლოვენიაში (Divje Babe) ნაპოვნი დათვის ძვალი კიდევ უფრო ძველია, მაგრამ სადავოა — ნახვრეტები შეიძლება ცხოველმა გამოღრღნა.', 'The oldest undisputed instruments are <b>flutes of bone and ivory</b> from the Swabian Alb in southern Germany. The Hohle Fels flute (found in 2006, from a bird bone, five finger holes) is about <b>35,000 years old</b>; a 2012 dating gave the Geissenklösterle flutes <b>42–43,000 years</b>. A bear bone from Divje Babe in Slovenia may be older still, but it is disputed — the holes may have been chewed by an animal.'),
        NOTICE('ეს ნიშნავს ერთს: სალამური რომ გაეკეთებინათ, მუსიკა უკვე <b>ჰქონდათ</b>. ინსტრუმენტი მუსიკის დასაწყისი არ არის — ის მუსიკის <b>კვალია</b>. სიმღერა და ტაში უფრო ძველია, მხოლოდ კვალი არ დატოვა.', 'That means one thing: to carve a flute you must already <b>have</b> music. An instrument is not the beginning of music — it is the <b>trace</b> of it. Singing and clapping are older; they just left no trace.'),
        H('სამი რამ, რისგანაც ყველა მუსიკა შედგება', 'The three things every music is made of'),
        UL([['<b>პულსი</b> — დროის თანაბარი დარტყმა. აქედან იწყება რითმი: ქართული ყაზბეგური, აფრიკული დასარტყამი, ბლუზის „შაფლი“ — ყველა პულსზე დგას.', '<b>Pulse</b> — the even beat of time. Rhythm starts here: the Georgian kazbeguri, an African drum pattern, the blues shuffle — all of them stand on a pulse.'],
          ['<b>სიმაღლე</b> — მაღალი და დაბალი ბგერა. როცა რამდენიმე სიმაღლეს რიგზე ვაწყობთ, გამოდის <b>გამა</b>, და გამიდან — მელოდია.', '<b>Pitch</b> — high and low sound. Order a few pitches and you have a <b>scale</b>; out of a scale comes melody.'],
          ['<b>ერთდროულად რამდენიმე ხმა</b> — მრავალხმიანობა და ჰარმონია. აქ იწყება აკორდი.', '<b>Several voices at once</b> — polyphony and harmony. This is where the chord begins.']]),
        P('მნიშვნელოვანი: ეს სამი არც ერთ ერს არ „ეკუთვნის“. პულსი, გამა და მრავალხმიანობა დამოუკიდებლად გაჩნდა მსოფლიოს სხვადასხვა კუთხეში — ინდოეთში რაგა, არაბულ სამყაროში მაკამი, ევროპაში კილოები, საქართველოში სამხმიანი სიმღერა.', 'This matters: none of the three “belongs” to one people. Pulse, scale and polyphony arose independently in different parts of the world — raga in India, maqam in the Arab world, the modes in Europe, three-voice song in Georgia.'),
        REM([['მუსიკა წერაზე ძველია; ყველაზე ძველი ინსტრუმენტი ~35–43 000 წლისაა.', 'Music is older than writing; the oldest instrument is ~35–43,000 years old.'],
          ['ყველა მუსიკა სამ რამეზე დგას: პულსი, სიმაღლე, ერთდროული ხმები.', 'Every music stands on three things: pulse, pitch, voices together.'],
          ['ეს სამი ერთ ადგილას არ დაბადებულა — მსოფლიოში ბევრჯერ, დამოუკიდებლად.', 'These three were not born in one place — they appeared many times, independently.']]),
        SRC([['Paleolithic flute — Wikipedia', 'https://en.wikipedia.org/wiki/Paleolithic_flute']])); },
      q: [[['რატომ ვიცით, რომ 35 000 წლის წინ მუსიკა იყო?', 'How do we know there was music 35,000 years ago?'],
        [['იმიტომ, რომ იმ დროის სალამური ნაპოვნია', 'Because a flute from that time has been found'], ['იმიტომ, რომ ნოტები შემოგვრჩა', 'Because the notation survived'], ['ეს მხოლოდ ვარაუდია, კვალი არ არის', 'It is only a guess, there is no trace']], 0,
        ['ინსტრუმენტი რჩება, ხმა არა. სალამური კვალია — და თუ სალამური აქვთ, მუსიკა უკვე აქვთ.', 'Instruments survive, sound does not. The flute is the trace — and if they had a flute, they already had music.']]] },

    { id: 'geo', t: 'gn.ch.geo', lead: ['ქართული მრავალხმიანი სიმღერა UNESCO-ს სიაშია; სიმღერების ნაწილი VIII საუკუნისაა — ბლუზზე ბევრად ძველი. ბლუზი და ჯაზი დასავლური პოპულარული მუსიკის ენაა, მაგრამ მსოფლიოს მუსიკა მათ გარშემო არ ტრიალებს.', 'Georgian polyphonic song is on the UNESCO list; part of the repertoire dates to the 8th century — far older than the blues. The blues and jazz are the language of Western popular music, but world music does not revolve around them.'], kw: 'ქართული მრავალხმიანობა unesco პოლიფონია ბლუზი ჯაზი სიმართლე ისტორია georgian polyphony', body: b => {
      b.append(
        NOTICE('ეს თავი შენს კითხვას პასუხობს პირდაპირ: <b>არა, მუსიკა ჯაზისა და ბლუზის გარშემო არ ტრიალებს.</b> ქვემოთ წერია, რა ტრიალებს მათ გარშემო და რა — არა.', 'This chapter answers your question straight: <b>no, music does not revolve around jazz and the blues.</b> Below is what does revolve around them, and what does not.'),
        H('რა არის სიმართლე', 'What is true'),
        P('ბლუზმა და ჯაზმა <b>მე-20 საუკუნის დასავლური პოპულარული მუსიკა</b> მართლაც დაამყარა. როკ-ენ-როლი პირდაპირ 12-ტაქტიანი ბლუზიდან გამოვიდა; როკი, სოული, ფანკი, R&B, პოპი, ჰიპ-ჰოპის ჰარმონია — ყველა ბლუზის ბგერებსა და ჯაზის აკორდებზე დგას. ამიტომ, თუ გიტარას, ფორტეპიანოს ან სიმღერის ჰარმონიას სწავლობ, ბლუზი და ჯაზი აუცილებლად უნდა იცოდე — ეს დასავლური მუსიკის <b>სამუშაო ენაა</b>.', 'The blues and jazz really did set the terms of <b>twentieth-century Western popular music</b>. Rock and roll came straight out of the 12-bar blues; rock, soul, funk, R&B, pop and the harmony of hip-hop all stand on blues notes and jazz chords. So if you are learning guitar, piano or song harmony, you do need the blues and jazz — that is the <b>working language</b> of Western music.'),
        H('რა არ არის სიმართლე', 'What is not true'),
        P('მსოფლიოს მუსიკის უმეტესობა ბლუზიდან <b>არ</b> მოდის და მათ არც სჭირდება. ინდური კლასიკური მუსიკა (რაგა), არაბული მაკამი, იავური გამელანი, იაპონური გაგაკუ, დასავლეთ აფრიკის დასარტყამი ანსამბლები, ევროპული კლასიკა ბახამდე და შემდეგ — ეს ყველაფერი თავისი გზით გაჩნდა. ბლუზი <b>მე-19 საუკუნის ბოლოს</b> დაიბადა; ამაზე ათასი წლით ძველი მუსიკა ვერ მოდის მისგან.', 'Most of the world\'s music does <b>not</b> come from the blues, and does not need to. Indian classical raga, Arabic maqam, Javanese gamelan, Japanese gagaku, the drum ensembles of West Africa, European classical music before and after Bach — each grew its own way. The blues was born <b>at the end of the 19th century</b>; music a thousand years older cannot descend from it.'),
        H('და აქ ჩვენი ადგილი', 'And here is where we stand'),
        P('<b>ქართული მრავალხმიანი სიმღერა</b> UNESCO-ს არამატერიალური მემკვიდრეობის რეპრეზენტაციულ სიაშია (2008 წელს შევიდა, პირველად 2001-ში იყო გამოცხადებული). UNESCO წერს, რომ საქართველოში <b>სამი ტიპის</b> მრავალხმიანობაა და რომ ბევრი სიმღერა <b>VIII საუკუნით</b> თარიღდება — ანუ ბლუზზე თორმეტასი წლით ძველია. წერია აგრეთვე, რომ <b>ბიზანტიურმა საეკლესიო საგალობლებმაც</b> ქართული მრავალხმიანი ტრადიცია შეითვისეს.', '<b>Georgian polyphonic song</b> is on UNESCO\'s Representative List of Intangible Heritage (inscribed 2008, first proclaimed 2001). UNESCO states that Georgia has <b>three types</b> of polyphony and that many songs <b>date back to the eighth century</b> — twelve hundred years older than the blues. It also records that <b>Byzantine liturgical hymns</b> took in the Georgian polyphonic tradition.'),
        P('ანუ: სამი ხმა ერთდროულად — ის, რასაც დასავლური თეორია „ჰარმონიას“ ეძახის — საქართველოში მაშინ იყო, როცა ევროპაში საეკლესიო სიმღერა ჯერ კიდევ ერთხმიანი იყო. ფანდური ამ ტრადიციის ინსტრუმენტია: სამი სიმი — სამი ხმა. მასწავლებელიც ასე ასახელებს მათ: <b>1-ლი ხმა, მე-2 ხმა და ბანი</b>.', 'So: three voices at once — what Western theory calls “harmony” — existed in Georgia while church song in Europe was still a single line. The panduri is an instrument of that tradition: three strings, three voices. That is how the teacher names them too: <b>first voice, second voice and the bass</b>.'),
        NOTICE('ამიტომ ამ აპში ბლუზი და ჯაზი <b>დამატებაა</b>, არა საძირკველი. საძირკველი ქართული რითმები და სამხმიანობაა. ბლუზი და ჯაზი იმიტომ გვჭირდება, რომ ჰარმონიის ლოგიკა გასაგები გახდეს და სხვა მუსიკაც შეძლო.', 'That is why the blues and jazz are an <b>addition</b> in this app, not the foundation. The foundation is the Georgian rhythms and the three voices. The blues and jazz are here so the logic of harmony becomes clear and you can play other music too.'),
        REM([['ბლუზი და ჯაზი დასავლური პოპულარული მუსიკის ენაა — მართლა უნდა იცოდე.', 'The blues and jazz are the language of Western popular music — you really do need them.'],
          ['მაგრამ მსოფლიოს მუსიკა მათ გარშემო არ ტრიალებს: ბლუზი ~1870–1900 წლებისაა.', 'But world music does not revolve around them: the blues dates from ~1870–1900.'],
          ['ქართული მრავალხმიანობა UNESCO-ს სიაშია; სიმღერების ნაწილი VIII საუკუნისაა.', 'Georgian polyphony is on the UNESCO list; part of the repertoire dates to the 8th century.']]),
        SRC([['Georgian polyphonic singing — UNESCO', 'https://ich.unesco.org/en/RL/georgian-polyphonic-singing-00008'],
          ['Blues (music) — New World Encyclopedia', 'https://www.newworldencyclopedia.org/entry/Blues_(music)']])); },
      q: [[['სწორია თუ არა: „მსოფლიოს მთელი მუსიკა ჯაზიდან და ბლუზიდან მოდის“?', 'True or false: “all the world\'s music comes from jazz and the blues”?'],
        [['არა — მაგრამ დასავლური პოპულარული მუსიკა მათზე დგას', 'False — but Western popular music does stand on them'], ['კი, მთლიანად', 'True, entirely'], ['არა, არც დასავლურ მუსიკაში არაფერს ნიშნავენ', 'False, and they mean nothing even in Western music']], 0,
        ['ბლუზი მე-19 საუკუნის ბოლოსია. მასზე ძველი ტრადიციები (ქართული მრავალხმიანობა, რაგა, მაკამი) მისგან ვერ მოდის — მაგრამ როკი, პოპი და სოული კი.', 'The blues dates from the end of the 19th century. Older traditions (Georgian polyphony, raga, maqam) cannot descend from it — but rock, pop and soul do.']],
        [['ქართული მრავალხმიანი სიმღერის სიმღერების ნაწილი რომელი საუკუნით თარიღდება UNESCO-ს მიხედვით?', 'According to UNESCO, part of the Georgian polyphonic repertoire dates to which century?'],
        [['VIII', '8th'], ['XVIII', '18th'], ['XX', '20th']], 0,
        ['UNESCO-ს ფურცელზე წერია, რომ ბევრი სიმღერა VIII საუკუნით თარიღდება.', 'The UNESCO page states that many songs date back to the eighth century.']]] },

    { id: 'blues', t: 'gn.ch.blues', lead: ['ბლუზი აშშ-ის სამხრეთში, აფროამერიკელთა თემებში გაჩნდა მე-19 საუკუნის ბოლოს (~1870–1900). 12-ტაქტიანი ფორმა მხოლოდ 1930-იანებში გახდა სტანდარტი. ბლუზური ნოტებია ♭3, ♭5 და ♭7.', 'The blues arose in African-American communities in the American South at the end of the 19th century (~1870–1900). The 12-bar form became standard only in the 1930s. The blue notes are ♭3, ♭5 and ♭7.'], kw: 'ბლუზი ბლუზური გამა ნოტი 12 ტაქტი ფორმა სამხრეთი blues blue note twelve bar', body: b => {
      b.append(
        P('<b>ბლუზი</b> აშშ-ის სამხრეთში, აფროამერიკელთა თემებში გაჩნდა მე-19 საუკუნის ბოლოს — დათარიღება ზუსტი არ არის, ჩვეულებრივ <b>1870–1900</b> წლებს ასახელებენ. ეს დრო ემთხვევა მონობის გაუქმებასა და სამხრეთში სასოფლო შრომის ახალ წესრიგს.', 'The <b>blues</b> arose in African-American communities in the American South at the end of the 19th century — the dating is not exact, usually given as <b>1870–1900</b>. That period coincides with emancipation and the new order of farm labour in the South.'),
        H('საიდან მოვიდა', 'Where it came from'),
        UL([['<b>სამუშაო სიმღერები</b> და <b>field holler</b> — მინდორში მარტო ან ჯგუფში ხმამაღლა მღერა.', '<b>Work songs</b> and <b>field hollers</b> — loud singing in the fields, alone or in a group.'],
          ['<b>სპირიჩუელები</b> — სასულიერო სიმღერა.', '<b>Spirituals</b> — the religious singing.'],
          ['<b>„კითხვა-პასუხი“</b> (call and response) და <b>ბლუზური ნოტები</b> — ორივე დასავლეთ აფრიკის ტრადიციიდან.', '<b>Call and response</b> and the <b>blue notes</b> — both from the West African tradition.']]),
        H('ფორმა მაშინვე არ ყოფილა', 'The form was not there from the start'),
        P('საწყის ბლუზს მკაცრი ჰარმონია არ ჰქონდა: 8 და 16 ტაქტიანი ფორმებიც ჩვეულებრივი იყო. <b>12-ტაქტიანი ფორმა 1930-იან წლებში გახდა სტანდარტი.</b>', 'Early blues had no fixed harmony: 8-bar and 16-bar forms were common. <b>The twelve-bar form became standard in the 1930s.</b>'),
        TABLE([L('წელი', 'Year'), L('რა მოხდა', 'What happened')], [
          ['1870–1900', L('ბლუზი ყალიბდება სამხრეთში (ზუსტი თარიღი არ არსებობს)', 'The blues takes shape in the South (no exact date exists)')],
          ['1912', L('პირველი ბლუზური ნოტები გამოიცა — მათ შორის W. C. Handy, „Memphis Blues“', 'The first blues sheet music is published — among it W. C. Handy’s “Memphis Blues”')],
          ['1920', L('Mamie Smith, „Crazy Blues“ — პირველი ბლუზი, ჩაწერილი აფროამერიკელის მიერ; პირველ თვეში ~75 000 ასლი', 'Mamie Smith’s “Crazy Blues” — the first blues recorded by an African American; ~75,000 copies in its first month')],
          ['1930-იანები', L('12-ტაქტიანი ფორმა სტანდარტი ხდება', 'The twelve-bar form becomes standard')],
          ['1940-იანები', L('jump blues — ბლუზი და ჯაზი ერთმანეთში', 'Jump blues — the blues and jazz mixed together')],
          ['1950-იანები', L('როკ-ენ-როლი: 12 ტაქტი + ბლუზური გამა. „ბლუზი უკანა ბითით“', 'Rock and roll: 12 bars plus the blues scale — “blues with a back beat”')]]),
        H('ბლუზური ნოტები', 'The blue notes'),
        P('ბლუზის ხმა სამი „დაწეული“ ბგერით გამოიცნობა: <b>♭3, ♭5 და ♭7</b>. მინორული პენტატონიკა + ♭5 = <b>ბლუზური გამა</b>. ფანდურზე ეს ნოტები ლადზე ზუსტად არის — სიმის „მოწევა“ (bend), რითაც გიტარაზე ბლუზს უკრავენ, ფანდურის ხერხი არ არის და მასწავლებლისგან ასეთი არ გვაქვს.', 'The blues sound is recognised by three “lowered” notes: <b>♭3, ♭5 and ♭7</b>. The minor pentatonic plus the ♭5 is the <b>blues scale</b>. On the panduri those notes sit exactly on frets — bending a string, the way the blues is played on a guitar, is not a panduri technique and we have none from the teacher.'),
        h('div', { class: 'tb-nav' }, [GOTO('ბლუზური გამა ფანდურზე ▸', 'The blues scale on the panduri ▸', 'scales', '5:mblues'), GOTO('12-ტაქტიანი ბლუზი ▸', 'The 12-bar blues ▸', 'music', 'blues')]),
        REM([['ბლუზი ~1870–1900, აშშ-ის სამხრეთი, აფროამერიკელთა თემები.', 'The blues: ~1870–1900, the American South, African-American communities.'],
          ['12-ტაქტიანი ფორმა მხოლოდ 1930-იანებში გახდა სტანდარტი.', 'The 12-bar form became standard only in the 1930s.'],
          ['ბლუზური ნოტები: ♭3, ♭5, ♭7. ბლუზური გამა = მინორული პენტატონიკა + ♭5.', 'Blue notes: ♭3, ♭5, ♭7. The blues scale is the minor pentatonic plus ♭5.']]),
        SRC([['Blues (music) — New World Encyclopedia', 'https://www.newworldencyclopedia.org/entry/Blues_(music)'],
          ['Jazz — Wikipedia (blues section)', 'https://en.wikipedia.org/wiki/Jazz']])); },
      q: [[['როდის გახდა 12-ტაქტიანი ფორმა ბლუზის სტანდარტი?', 'When did the 12-bar form become the standard of the blues?'],
        [['1930-იან წლებში', 'In the 1930s'], ['მაშინვე, 1870-იანებში', 'At once, in the 1870s'], ['1960-იანებში', 'In the 1960s']], 0,
        ['საწყის ბლუზში 8 და 16 ტაქტიანი ფორმებიც იყო; 12 ტაქტი 1930-იანებში დამკვიდრდა.', 'Early blues also used 8-bar and 16-bar forms; twelve bars settled in during the 1930s.']],
        [['რომელი სამი ნოტი აძლევს ბლუზს მის ხმას?', 'Which three notes give the blues its sound?'],
        [['♭3, ♭5, ♭7', '♭3, ♭5, ♭7'], ['2, 4, 6', '2, 4, 6'], ['♯4, ♯5, ♯6', '♯4, ♯5, ♯6']], 0,
        ['ეს სამი „დაწეული“ ბგერაა — ბლუზური ნოტები.', 'These are the three “lowered” notes — the blue notes.']]] },

    { id: 'jazz', t: 'gn.ch.jazz', lead: ['ჯაზი ახალ ორლეანში გაჩნდა მე-19 საუკუნის ბოლოს; ახალორლეანური ჯაზი 1910-იანებში ჩამოყალიბდა, პირველი ჩანაწერი 1917 წელს. ჯაზის მთავარი მოძრაობა ii–V–I-ია.', 'Jazz arose in New Orleans at the end of the 19th century; New Orleans jazz emerged in the 1910s and the first record came in 1917. The central move of jazz is ii–V–I.'], kw: 'ჯაზი ბებოპი სვინგი ახალი ორლეანი სეპტაკორდი ჰარმონია იმპროვიზაცია jazz bebop swing', body: b => {
      b.append(
        P('<b>ჯაზი</b> ახალ ორლეანში (ლუიზიანა, აშშ) გაჩნდა აფროამერიკელთა თემებში მე-19 საუკუნის ბოლოსა და მე-20-ის დასაწყისში. ახალორლეანური ჯაზი <b>1910-იანების დასაწყისში</b> ჩამოყალიბდა და ერთად შეკრა: სასულიერი ორკესტრის მარშები, ფრანგული კვადრილები, biguine, რეგტაიმი და <b>ბლუზი</b>.', '<b>Jazz</b> arose in African-American communities in New Orleans, Louisiana, in the late 19th and early 20th centuries. New Orleans jazz emerged in the <b>early 1910s</b>, bringing together brass band marches, French quadrilles, the biguine, ragtime and the <b>blues</b>.'),
        P('ჯაზის საძირკველი ორი მხრიდან მოდის: <b>აფრიკული რითმული ტრადიცია</b> (ახალ ორლეანში შემორჩენილი ფიგურები, მაგალითად tresillo) და <b>ევროპული ჰარმონია</b> (საგალობლები, ევროპული ინსტრუმენტები). ბლუზური ნოტები ჯაზში ბლუზიდან შემოვიდა.', 'Jazz rests on two foundations: the <b>African rhythmic tradition</b> (figures that survived in New Orleans, such as the tresillo) and <b>European harmony</b> (hymns and European instruments). The blue notes came into jazz from the blues.'),
        TABLE([L('პერიოდი', 'Era'), L('როდის', 'When')], [
          [L('ახალი ორლეანი / დიქსილენდი', 'New Orleans / Dixieland'), '1910-'],
          [L('სვინგი, დიდი ორკესტრები', 'Swing, the big bands'), '1930-'],
          [L('ბებოპი', 'Bebop'), '1940-'],
          [L('cool jazz', 'Cool jazz'), L('1940-იანების ბოლო', 'late 1940s')],
          [L('hard bop', 'Hard bop'), L('1950-იანების შუა', 'mid-1950s')],
          [L('მოდალური და თავისუფალი ჯაზი', 'Modal and free jazz'), L('1950-იანების ბოლო–1960-იანები', 'late 1950s–1960s')],
          [L('fusion', 'Jazz fusion'), L('1960-იანების ბოლო–1970-იანები', 'late 1960s–1970s')],
          [L('smooth jazz', 'Smooth jazz'), '1980-']]),
        P('პირველი გამოცემული ჯაზური ჩანაწერი — <b>1917</b>, Original Dixieland Jass Band, „Livery Stable Blues“.', 'The first released jazz record was in <b>1917</b>: the Original Dixieland Jass Band’s “Livery Stable Blues”.'),
        H('რა გააკეთა ჯაზმა ჰარმონიასთან', 'What jazz did to harmony'),
        UL([['<b>სეპტაკორდი ყველგან</b> — ჯაზში სამბგერიანი აკორდი იშვიათია; საბაზისო აკორდი ოთხბგერიანია (7, m7, maj7).', '<b>Sevenths everywhere</b> — in jazz a three-note chord is rare; the basic chord has four notes (7, m7, maj7).'],
          ['<b>ii–V–I</b> — ორი აკორდი, რომელიც მესამეზე მიგვიყვანს. ჯაზის ყველაზე მნიშვნელოვანი მოძრაობა.', '<b>ii–V–I</b> — two chords that lead to a third. The single most important move in jazz.'],
          ['<b>ჩანაცვლებები</b> — იმავე ფუნქციის აკორდის სხვა აკორდით გამოცვლა (ტრიტონური ჩანაცვლება, შემცირებული აკორდი გადასასვლელად).', '<b>Substitutions</b> — replacing a chord with another of the same function (the tritone substitution, a diminished chord as a passing chord).'],
          ['<b>იმპროვიზაცია ჰარმონიაზე</b> — თემა ერთხელ ჟღერს, შემდეგ მუსიკოსები იმავე აკორდებზე თავისას უკრავენ.', '<b>Improvising on the harmony</b> — the theme is played once, then the players improvise over the same chords.']]),
        P('ყველაზე მოკლე გზა ჯაზის ჰარმონიაში შესვლისთვის — სწორედ 12-ტაქტიანი ბლუზი ჯაზური აკორდებით. ის ამ აპში უკვე არის:', 'The shortest way into jazz harmony is exactly the 12-bar blues with jazz chords. It is already in this app:'),
        h('div', { class: 'tb-nav' }, [GOTO('12-ტაქტიანი ბლუზი და ჯაზი ▸', 'The 12-bar blues and jazz ▸', 'music', 'blues'), GOTO('მიქსოლიდიური გამა ▸', 'The Mixolydian scale ▸', 'scales', '5:mixo')]),
        REM([['ჯაზი: ახალი ორლეანი, 1910-იანები; პირველი ჩანაწერი 1917.', 'Jazz: New Orleans, the 1910s; the first record in 1917.'],
          ['ჯაზმა ბლუზისგან ბლუზური ნოტები აიღო, ევროპისგან — ჰარმონია, აფრიკისგან — რითმი.', 'Jazz took the blue notes from the blues, harmony from Europe and rhythm from Africa.'],
          ['ჯაზის მთავარი მოძრაობა ii–V–I-ია.', 'The central move of jazz is ii–V–I.']]),
        SRC([['Jazz — Wikipedia', 'https://en.wikipedia.org/wiki/Jazz']])); },
      q: [[['სად და როდის გაჩნდა ჯაზი?', 'Where and when did jazz arise?'],
        [['ახალი ორლეანი, მე-19 ს. ბოლო – მე-20 ს. დასაწყისი', 'New Orleans, late 19th – early 20th century'], ['ნიუ-იორკი, 1950-იანები', 'New York, the 1950s'], ['ჩიკაგო, 1930-იანები', 'Chicago, the 1930s']], 0,
        ['ჯაზი ახალ ორლეანში, აფროამერიკელთა თემებში დაიბადა; ახალორლეანური ჯაზი 1910-იანებში ჩამოყალიბდა.', 'Jazz was born in African-American communities in New Orleans; New Orleans jazz emerged in the 1910s.']],
        [['რა არის ii–V–I?', 'What is ii–V–I?'],
        [['სამი აკორდი, რომელიც ტონიკაზე მიგვიყვანს', 'Three chords that lead home to the tonic'], ['გამის სახელი', 'The name of a scale'], ['რითმული ფიგურა', 'A rhythmic figure']], 0,
        ['ii და V ერთად I-ზე მიისწრაფვის — ჯაზის ყველაზე გავრცელებული მოძრაობა.', 'ii and V together point at I — the commonest move in jazz.']]] },

    { id: 'std', t: 'gn.ch.std', lead: ['სტანდარტი ფორმაა, რომელიც ყველა მუსიკოსმა იცის — ამიტომ შეიძლება ჯემი. სამი მთავარი ფორმა: 12-ტაქტიანი ბლუზი, AABA (32 ტაქტი) და rhythm changes.', 'A standard is a form every musician knows — that is what makes a jam possible. The three main forms are the 12-bar blues, AABA (32 bars) and rhythm changes.'], kw: 'სტანდარტი ფორმა ჯემი აკორდების რიგი bird changes პარკერი standard form', body: b => {
      b.append(
        P('<b>სტანდარტი</b> სიმღერა ან თემაა, რომელსაც ყველა მუსიკოსი იცის. ჯაზში ეს ნოტებით დაწერილი ნაწარმოები არ არის — სტანდარტი <b>ფორმაა</b>: აკორდების რიგი, რომელზეც ყველა შეძლებს დაუკრას, ერთმანეთს რომც არ იცნობდნენ. ამიტომ არსებობს ჯემი.', 'A <b>standard</b> is a song or theme every musician knows. In jazz it is not a written composition — a standard is a <b>form</b>: a run of chords anyone can play over, even among strangers. That is why a jam session is possible at all.'),
        H('სამი ფორმა, რომელზეც ჯაზის უმეტესობა დგას', 'The three forms most of jazz stands on'),
        TABLE([L('ფორმა', 'Form'), L('სიგრძე', 'Length'), L('სად გვხვდება', 'Where you meet it')], [
          [L('12-ტაქტიანი ბლუზი', '12-bar blues'), L('12 ტაქტი', '12 bars'), L('ბლუზი, ბებოპი, როკ-ენ-როლი, სოული', 'Blues, bebop, rock and roll, soul')],
          [L('AABA (32 ტაქტი)', 'AABA (32 bars)'), L('8+8+8+8', '8+8+8+8'), L('ამერიკული სიმღერის კლასიკური ფორმა', 'The classic American song form')],
          [L('„rhythm changes“', '“Rhythm changes”'), L('32 ტაქტი, AABA', '32 bars, AABA'), L('ბებოპის ყველაზე გავრცელებული ჰარმონია ბლუზის შემდეგ', 'After the blues, the commonest harmony in bebop')]]),
        P('ბლუზი ამ სამში უმცროსი არ არის — <b>უმთავრესია</b>: ის ყველაზე მოკლეა, ყველაზე მარტივად დასამახსოვრებელი და სწორედ მასზე სწავლობს ყველა მუსიკოსი იმპროვიზაციას. ამიტომ ამ აპში 12 ტაქტი სამ ვერსიად დაგვიდევს: მარტივი, ჯაზური და ბებოპური.', 'The blues is not the youngest of the three — it is the <b>first</b>: the shortest, the easiest to hold in the head, and the form every musician learns to improvise on. That is why this app lays the twelve bars out in three versions: plain, jazz and bebop.'),
        H('„Bird changes“ — საიდან მოდის სახელი', 'Where the name “Bird changes” comes from'),
        P('ჩარლი პარკერს („Bird“) ბებოპის მთავარ ფიგურად თვლიან. მისი თემა <b>„Blues for Alice“</b> 12 ტაქტს ii–V წყვილების ჯაჭვით ავსებს; ამ ჰარმონიას დღემდე <b>„Bird blues“</b> ან „Bird changes“ ჰქვია და ყველა ჯაზის მოსწავლეს სწავლობს.', 'Charlie “Bird” Parker is regarded as the central figure of bebop. His theme <b>“Blues for Alice”</b> fills the twelve bars with a chain of ii–V pairs; that harmony is still called the <b>“Bird blues”</b> or “Bird changes”, and every jazz student learns it.'),
        NOTICE('ამ აპში სტანდარტების <b>მელოდიებს</b> არ ვწერთ — ისინი ავტორებისა და გამომცემლებისაა. ვწერთ მხოლოდ <b>ფორმას</b> (აკორდების რიგს), რომელიც ზოგადი ჰარმონიული პრაქტიკაა და ყველა სახელმძღვანელოშია.', 'This app does not write out the <b>melodies</b> of standards — those belong to their authors and publishers. It gives only the <b>form</b> (the run of chords), which is general harmonic practice and appears in every textbook.'),
        h('div', { class: 'tb-nav' }, [GOTO('სამივე ფორმა ფანდურზე ▸', 'All three forms on the panduri ▸', 'music', 'blues')]),
        REM([['სტანდარტი = ფორმა, რომელიც ყველამ იცის; ამიტომ შეიძლება ჯემი.', 'A standard is a form everyone knows; that is what makes a jam possible.'],
          ['სამი მთავარი ფორმა: 12-ტაქტიანი ბლუზი, AABA (32), rhythm changes.', 'Three main forms: the 12-bar blues, AABA (32), rhythm changes.'],
          ['„Bird changes“ — ჩარლი პარკერის ბლუზური ჰარმონია ii–V ჯაჭვით.', '“Bird changes” — Charlie Parker’s blues harmony, a chain of ii–Vs.']]),
        SRC([['Beyond Blues: How to Play Bird Blues — Premier Guitar', 'https://www.premierguitar.com/articles/25842-beyond-blues-how-to-play-bird-blues'],
          ['Jazz — Wikipedia', 'https://en.wikipedia.org/wiki/Jazz']])); },
      q: [[['რა არის ჯაზური „სტანდარტი“?', 'What is a jazz “standard”?'],
        [['ფორმა — აკორდების რიგი, რომელიც ყველა მუსიკოსმა იცის', 'A form — a run of chords every musician knows'], ['ზუსტად ჩაწერილი პარტია, რომელსაც არ ცვლიან', 'An exactly written part that nobody changes'], ['ინსტრუმენტის აწყობის წესი', 'A rule for tuning the instrument']], 0,
        ['სტანდარტი იმიტომ მუშაობს, რომ ფორმა საერთოა — მელოდია ერთხელ ჟღერს, შემდეგ ყველა იმავე აკორდებზე უკრავს.', 'A standard works because the form is shared — the melody is played once, then everyone improvises over the same chords.']]] }
  ];

  /* =================== the 12-bar page =================== */
  function blues(w, param) {
    let key = 5, fi = 0, sel = 0, hb = null, stop = null, bpm = PD.store.get('gn.bpm', 84);
    if (param) { const f = FORMS.findIndex(x => x.id === param); if (f >= 0) fi = f; }
    w.append(h('div', { class: 'row pg-head' }, [h('button', { class: 'btn small backbtn', html: ic.back + '<span class="sr" data-t="back"></span>', onclick: () => PD.app.go('music') }), h('h1', { 'data-t': 'gn.12', style: 'margin:0' })]),
      h('p', { class: 'fg2', 'data-t': 'gn.12d' }), h('p', { class: 'tb-note', 'data-t': 'gn.openQ' }));
    const forms = h('div', { class: 'chips-row' }), keys = h('div', { class: 'chips-row' }), fd = h('p', { class: 'fg2' });
    FORMS.forEach((f, i) => forms.append(h('button', { class: 'chip', 'aria-pressed': String(i === fi), text: L(f.n[0], f.n[1]), onclick: () => { fi = i; sel = 0; draw(); } })));
    TH.ROOT_NAMES.forEach((n, i) => keys.append(h('button', { class: 'chip', 'aria-pressed': String(i === key), text: nameOf(i, i), onclick: () => { key = i; draw(); } })));
    const grid = h('div', { class: 'bz-grid' }), det = h('section', { class: 'bz-det' }), foot = h('div', { class: 'sh-foot' });
    w.append(h('div', { class: 'ai-tool' }, [h('span', { class: 'ai-tl', 'data-t': 'gn.form' }), forms]), fd,
      h('div', { class: 'ai-tool' }, [h('span', { class: 'ai-tl', 'data-t': 'gn.key' }), keys]),
      grid, foot, det, h('p', { class: 'muted', 'data-t': 'gn.tapBar' }));
    hb = PD.shapes.handBox({ view: 'front', cls: 'bz-3d' }); det.append(hb.box);
    const info = h('div', { class: 'sh-info' }); det.append(info);

    function bars() { return FORMS[fi].bars.map(b => ({ rn: b.rn, why: b.why, ch: b.ch.map(([o, q]) => chordAt(key, o, q)) })); }
    function draw() {
      forms.querySelectorAll('.chip').forEach((b, i) => b.setAttribute('aria-pressed', String(i === fi)));
      keys.querySelectorAll('.chip').forEach((b, i) => b.setAttribute('aria-pressed', String(i === key)));
      fd.textContent = L(FORMS[fi].d[0], FORMS[fi].d[1]);
      const BS = bars(); grid.innerHTML = '';
      BS.forEach((b, i) => grid.append(h('button', { class: 'bz-bar' + (i === sel ? ' on' : ''), 'data-i': String(i), onclick: () => { sel = i; pick(); } }, [
        h('span', { class: 'bz-no', text: String(i + 1) }),
        h('span', { class: 'bz-ch' }, b.ch.map(c => h('b', { class: c.none ? 'bz-x' : '', text: c.sym }))),
        h('small', { class: 'bz-rn', text: b.rn })])));
      foot.innerHTML = '';
      foot.append(h('button', { class: 'btn primary', 'data-t': 'gn.playAll', onclick: play }),
        h('div', { class: 'ai-tool' }, [h('span', { class: 'ai-tl', 'data-t': 'gn.tempo' }),
          h('input', { type: 'range', min: '50', max: '160', step: '2', value: String(bpm), oninput: e => { bpm = +e.target.value; PD.store.set('gn.bpm', bpm); e.target.nextSibling.textContent = bpm + ' BPM'; } }),
          h('small', { class: 'muted', text: bpm + ' BPM' })]));
      pick(); PD.i18n.apply(w);
    }
    function pick() {
      const b = bars()[sel]; if (!b) return;
      grid.querySelectorAll('.bz-bar').forEach((x, i) => x.classList.toggle('on', i === sel));
      info.innerHTML = '';
      const c = b.ch[0];
      b.ch.forEach((x, i) => {
        const row = h('div', { class: 'bz-row' }, [h('b', { text: x.sym }), h('small', { class: 'muted', text: x.ka + (x.T ? ' · ' + L(x.T.ka, x.T.en) : '') })]);
        if (x.none) { row.append(h('small', { class: 'notice', text: t('gn.noShape') }), h('small', { class: 'muted', text: t('gn.need', { s: x.tones.join(' · ') }) })); }
        else { row.append(h('span', { class: 'sh-frets', text: x.v.frets.map(f => f === 0 ? '0' : f).join(' · ') }),
          h('button', { class: 'btn small', text: '▶', onclick: () => { PD.audio.ensure(); PD.audio.strum(x.v.frets, 'down', { gap: .03 }); if (hb) hb.set(x.v.frets, x.v.fingers || []); } }),
          h('button', { class: 'btn small', text: t('ce.title'), onclick: () => PD.app.go('chords', TH.ROOT_NAMES[x.pc] + x.q) })); }
        info.append(row);
        if (i === 0 && !x.none && hb) hb.set(x.v.frets, x.v.fingers || []);
      });
      info.append(h('div', { class: 'ai-tool' }, [h('span', { class: 'ai-tl', 'data-t': 'gn.rn' }), h('small', { text: b.rn })]));
      if (b.why) info.append(h('div', { class: 'ai-tool' }, [h('span', { class: 'ai-tl', 'data-t': 'gn.why' }), h('small', { class: 'muted', text: L(b.why[0], b.why[1]) })]));
      if (c && !c.none) { PD.audio.ensure(); PD.audio.strum(c.v.frets, 'down', { gap: .03 }); }
      PD.i18n.apply(info);
    }
    /** the 12 bars in time: four beats a bar, the bar's chords splitting those beats between them */
    function play() {
      if (stop) return stop();
      PD.audio.ensure(); const ctx = PD.audio.ctx; if (!ctx) return;
      const BS = bars(), spb = 60 / bpm; let at = ctx.currentTime + .1;
      const marks = [];
      BS.forEach((b, i) => {
        const per = 4 / b.ch.length;
        b.ch.forEach(c => {
          marks.push({ at, i });
          for (let k = 0; k < per; k++) if (!c.none) PD.audio.strum(c.v.frets, k % 2 ? 'up' : 'down', { when: at + k * spb, gap: .03, vel: k % 2 ? .5 : .75 });
          at += per * spb;
        });
      });
      const btn = foot.querySelector('.btn.primary'); btn.textContent = t('gn.stop'); btn.classList.add('on');
      let mi = 0;
      const tick = setInterval(() => {
        while (mi < marks.length && marks[mi].at <= ctx.currentTime + .05) { const i = marks[mi].i; grid.querySelectorAll('.bz-bar').forEach((x, k) => x.classList.toggle('now', k === i)); mi++; }
      }, 40);
      const end = setTimeout(() => stop && stop(), (at - ctx.currentTime + .4) * 1000);
      stop = () => { clearInterval(tick); clearTimeout(end); grid.querySelectorAll('.bz-bar').forEach(x => x.classList.remove('now')); btn.textContent = t('gn.playAll'); btn.classList.remove('on'); stop = null; };
    }
    draw();
  }

  /* =================== pages =================== */
  const done = () => PD.store.get('genres.done', {});
  const mark = id => { const d = done(); if (!d[id]) { d[id] = Date.now(); PD.store.set('genres.done', d); } };
  function progress() { const d = done(); return CH.filter(c => d[c.id]).length / CH.length; }

  function page(w, param) {
    if (param === 'blues' || FORMS.some(f => f.id === param)) return blues(w, param === 'blues' ? null : param);
    const c = CH.find(x => x.id === param);
    if (c) return chapter(w, c);
    const d = done(), n = CH.filter(x => d[x.id]).length;
    w.append(h('div', { class: 'row pg-head' }, [h('button', { class: 'btn small backbtn', html: ic.back + '<span class="sr" data-t="back"></span>', onclick: () => PD.app.back('learn') }), h('h1', { 'data-t': 'gn.title', style: 'margin:0' })]),
      h('p', { class: 'fg2', 'data-t': 'gn.lead' }),
      h('p', { class: 'tb-note', 'data-t': 'gn.src' }),
      h('div', { class: 'tb-prog' }, [h('div', { class: 'hx-bar' }, [h('i', { style: 'width:' + Math.round(n / CH.length * 100) + '%' })]), h('small', { class: 'muted', text: n + ' / ' + CH.length })]),
      h('div', { class: 'tb-list' }, CH.map((x, i) => h('button', { class: 'tb-card' + (d[x.id] ? ' done' : ''), onclick: () => PD.app.go('music', x.id) }, [
        h('span', { class: 'tb-num', text: d[x.id] ? '✓' : String(i + 1) }),
        h('span', { class: 'tb-ct' }, [h('b', { 'data-t': x.t }), x.lead ? h('small', { text: L(x.lead[0], x.lead[1]).split('.')[0] + '.' }) : null])]))),
      h('button', { class: 'tbs-glb', onclick: () => PD.app.go('music', 'blues') }, [h('b', { 'data-t': 'gn.12' }), h('small', { 'data-t': 'gn.12d' })]),
      h('button', { class: 'tbs-glb', onclick: () => PD.app.go('scales', '5:mblues') }, [h('b', { 'data-t': 'gn.scaleGo' }), h('small', { 'data-t': 'sh.scalesD' })]));
    PD.i18n.apply(w);
  }

  function chapter(w, c) {
    const i = CH.indexOf(c);
    w.append(h('div', { class: 'row' }, [h('button', { class: 'btn small', html: ic.back + '<span data-t="gn.list"></span>', onclick: () => PD.app.go('music') }), h('small', { class: 'muted', text: t('gn.chapter', { n: i + 1 }) + ' / ' + CH.length })]),
      h('h1', { class: 'tb-title', 'data-t': c.t }), h('p', { class: 'tb-note', 'data-t': 'gn.src' }));
    const body = h('article', { class: 'tb-body' }); w.append(body);
    c.body(body);
    if (c.q && c.q.length) {
      const qs = h('section', { class: 'tb-quiz' }, [h('h3', { 'data-t': 'tb.check' })]);
      let right = 0;
      c.q.forEach(([q, opts, ok, why]) => {
        const order = opts.map((o, k) => k).sort(() => Math.random() - .5), fb = h('p', { class: 'tb-fb', hidden: true });
        const box = h('div', { class: 'tb-q' }, [h('b', { html: L(q[0], q[1]) }), h('div', { class: 'tb-opts' }, order.map(k => h('button', { class: 'btn small', html: Array.isArray(opts[k]) ? L(opts[k][0], opts[k][1]) : opts[k], onclick: e => {
          const good = k === ok; box.querySelectorAll('.tb-opts button').forEach(bb => { bb.disabled = true; }); e.currentTarget.classList.add(good ? 'ok' : 'bad');
          if (!good) box.querySelectorAll('.tb-opts button')[order.indexOf(ok)].classList.add('ok');
          fb.hidden = false; fb.className = 'tb-fb ' + (good ? 'ok' : 'bad'); fb.innerHTML = (good ? t('tb.right') + ' ' : t('tb.wrong')) + L(why[0], why[1]);
          if (good && ++right === c.q.length) mark(c.id);
          if (good && PD.audio.ok) PD.audio.ok();
        } }))), fb]);
        qs.appendChild(box);
      });
      w.append(qs);
    }
    const nx = CH[i + 1], pv = CH[i - 1];
    w.append(h('div', { class: 'tb-nav' }, [pv ? h('button', { class: 'btn', text: '‹ ' + t(pv.t), onclick: () => PD.app.go('music', pv.id) }) : h('span'),
      h('button', { class: 'btn primary', text: nx ? t('gn.next') + ' ›' : t('tb.finish'), onclick: () => { mark(c.id); PD.app.go('music', nx ? nx.id : null); } })]));
    PD.i18n.apply(w);
  }

  return { page, blues, progress, CHAPTERS: CH, FORMS, chordAt, nameOf };
})();
