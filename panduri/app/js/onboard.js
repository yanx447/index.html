/* =====================================================================
   First-launch onboarding (language, experience, hand, microphone
   explained BEFORE the permission prompt) and the microphone
   calibration wizard (room noise, sensitivity, open strings, latency).
   Calibration is stored per device; nothing leaves the device.
   ===================================================================== */
PD.i18n.add({
  'lang.ka': ['ქართული', 'ქართული'], 'lang.en': ['English', 'English'],
  'ob.hello': ['გამარჯობა!', 'Welcome!'], 'ob.lead': ['ისწავლე ფანდურზე დაკვრა: აპი გიჩვენებს, სად დაადო თითი, გელოდება და გისმენს.', 'Learn to play the panduri: the app shows where to put your fingers, waits for you and listens.'],
  'ob.lang': ['ენა', 'Language'], 'ob.level': ['როგორ უკრავ ახლა?', 'How do you play now?'],
  'ob.l1': ['პირველად ვიღებ ხელში', 'I am picking it up for the first time'], 'ob.l1d': ['დავიწყებთ ნაწილებით, აწყობით და ღია სიმებით', 'We start with the parts, tuning and open strings'],
  'ob.l2': ['ცოტა ვუკრავ', 'I play a little'], 'ob.l2d': ['რიტმი, თითები, პირველი მელოდიები', 'Rhythm, fingers, first melodies'],
  'ob.l3': ['თავისუფლად ვუკრავ', 'I play comfortably'], 'ob.l3d': ['სიმღერები, აკორდები, ჩემი გაკვეთილების ჩაწერა', 'Songs, chords, recording my own lessons'],
  'ob.hand': ['რომელი ხელით ჩამოკრავ?', 'Which hand strums?'], 'ob.right': ['მარჯვენით', 'Right hand'], 'ob.left': ['მარცხენით', 'Left hand'], 'ob.handD': ['მარცხენა ხელისთვის ტარის ხედი სარკისებურად გადატრიალდება.', 'For left-handed players the neck view is mirrored.'],
  'ob.mic': ['მიკროფონი', 'Microphone'],
  'cb.room': ['ოთახი', 'Room'], 'room.quiet': ['მშვიდი', 'Quiet room'], 'room.normal': ['ჩვეულებრივი', 'Normal room'], 'room.noisy': ['ხმაურიანი', 'Noisy room'],
  'set.fingerColors': ['თითების ფერები', 'Finger colours'], 'set.fingerSymbols': ['ფერის ნაცვლად ფორმებიც (● ▲ ■ ◆)', 'Shapes as well as colours (● ▲ ■ ◆)'],
  'set.procLat': ['ამოცნობა {n} მწ', 'detection {n} ms'],
  'ob.read': ['როგორ წავიკითხოთ ეკრანი', 'How to read the screen'],
  'ob.fingers': ['თითის ნომრები', 'Finger numbers'], 'ob.fingersD': ['1 საჩვენებელი · 2 შუა · 3 არათითი · 4 ნეკი (მარცხენა ხელი). ნომერი თითის წვერზე ჩანს.', '1 index · 2 middle · 3 ring · 4 little (left hand). The number sits on the fingertip.'],
  'ob.strokes': ['↓ ჩაკვრა · ↑ ამოკვრა', '↓ Down · ↑ Up'], 'ob.strokesD': ['მარჯვენა ხელის მიმართულება. აქცენტი უფრო მსხვილი ისრით და აღნიშვნით ჩანს.', 'Right-hand direction. An accent has a heavier arrow and a label.'],
  'ob.wait': ['WAIT — ლოდინი', 'WAIT'], 'ob.waitD': ['გაკვეთილი ყოველ ნოტზე ჩერდება და გელოდება, სანამ სწორად არ დაუკრავ.', 'The lesson stops at every note and waits until you play it.'],
  'ob.mic1': ['აპი მიკროფონით გისმენს, რომ გაიგოს — სწორ ბგერას უკრავ თუ არა, და დროულად თუ არა.', 'The app listens through the microphone to hear whether you play the right note, and on time.'],
  'ob.mic2': ['ხმა მხოლოდ ამ მოწყობილობაზე ანალიზდება. არაფერი იწერება და არსად იგზავნება. „გამორთვა“ მიკროფონს მართლა თიშავს.', 'Audio is analysed only on this device. Nothing is recorded or sent. "Off" really turns the microphone off.'],
  'ob.mic3': ['პატიოსნად: ბგერას კარგად ცნობს, სიმს — არა ყოველთვის. მაგ., ღია C♯ და A სიმის მე-4 ლადი ერთნაირად ჟღერს — მაშინ სიმს გაკვეთილი ადასტურებს.', 'Honestly: it recognises pitch well, the string not always. Open C♯ and A string fret 4 sound the same — then the lesson confirms the string.'],
  'ob.micYes': ['ჩართვა და კალიბრაცია', 'Turn on and calibrate'], 'ob.micNo': ['ჯერ შეხებით', 'Touch only for now'],
  'ob.ready': ['მზად ხარ', 'You are ready'], 'ob.readyD': ['დაიწყე ფანდურის გაცნობით ან პირდაპირ პირველი გაკვეთილით.', 'Start by getting to know the panduri, or go straight to the first lesson.'],
  'ob.tour': ['ფანდურის გაცნობა 3D-ში', 'Meet the panduri in 3D'], 'ob.first': ['პირველი გაკვეთილი', 'First lesson'], 'ob.home': ['მთავარზე', 'Go home'],
  'cb.title': ['მიკროფონის კალიბრაცია', 'Microphone calibration'], 'cb.s1': ['სიჩუმე', 'Silence'], 'cb.s1d': ['3 წამი ნუ დაუკრავ — ოთახის ხმაურს ვზომავთ.', 'Do not play for 3 seconds — measuring room noise.'],
  'cb.measure': ['გაზომვა', 'Measure'], 'cb.noise': ['ხმაურის დონე: {v}', 'Noise level: {v}'], 'cb.loud': ['ოთახი ხმაურიანია — ამოცნობა შეიძლება გაუარესდეს.', 'The room is noisy — recognition may suffer.'],
  'cb.s2': ['მგრძნობელობა', 'Sensitivity'], 'cb.s2d': ['დაუკარი რამდენიმე ნოტი, ჩუმადაც და ხმამაღლაც. ყოველი დაკვრა უნდა დაითვალოს, სიჩუმე — არა.', 'Play a few notes, soft and loud. Every pluck should count; silence should not.'],
  'cb.heard': ['დაითვალა: {n} · ბოლო: {p}', 'Counted: {n} · last: {p}'],
  'cb.s3': ['ღია სიმები', 'Open strings'], 'cb.s3d': ['დაუკარი სიმი, რომელიც მონიშნულია. ასე ვამოწმებთ აწყობას და მიკროფონს.', 'Play the highlighted string. This checks tuning and the microphone.'],
  'cb.ok': ['✓ {p} · {c}¢', '✓ {p} · {c}¢'], 'cb.off': ['~ {p} · {c}¢ — ტიუნერით შეასწორე', '~ {p} · {c}¢ — fix it with the tuner'],
  'cb.s4': ['დაყოვნება', 'Latency'], 'cb.s4d': ['დინამიკიდან 6 დაწკაპუნება გაისმება, მიკროფონი მათ დაიჭერს. ყურსასმენი მოიხსენი და ხმა აუწიე.', 'Six clicks play from the speaker and the mic catches them. Remove headphones and turn the volume up.'],
  'cb.lat': ['დაყოვნება: {v} ms', 'Latency: {v} ms'], 'cb.latFail': ['დაწკაპუნებები ვერ გავიგე. აუწიე ხმას ან ხელით დააყენე.', 'Could not hear the clicks. Turn the volume up, or set it by hand.'], 'cb.manual': ['ხელით (ms)', 'Manual (ms)'],
  'cb.done': ['კალიბრაცია შენახულია ამ მოწყობილობისთვის.', 'Calibration saved for this device.'], 'cb.finish': ['დასრულება', 'Finish'], 'cb.again': ['თავიდან', 'Again']
});

PD.calib = (() => {
  const h = PD.h, TH = PD.theory, D = PD.detector;
  function open(onDone, opt) {
    const offs = [], startedHere = !D.active && !(opt && opt.keep);
    const back = h('div', { class: 'ob', role: 'dialog', 'aria-modal': 'true', 'aria-label': t('cb.title') }), box = h('div', { class: 'box' });
    back.appendChild(box); document.body.appendChild(back);
    let step = 0; const res = { openCents: {} };
    const meter = h('div', { class: 'bar', style: 'height:10px' }, [h('i', { style: 'width:0;background:var(--ok);transition:width .06s' })]);
    offs.push(D.on('level', m => { meter.firstChild.style.width = Math.min(100, Math.sqrt(m.rms) * 260) + '%'; }));
    const finish = () => { offs.forEach(f => f()); if (startedHere) D.stop(); D.guardOn = PD.store.get('clickGuard', true) !== false; back.remove(); onDone && onDone(); if (PD.app && PD.app.route === 'settings') PD.app.render(); };
    const dots = () => h('div', { class: 'dots' }, [0, 1, 2, 3].map(i => h('i', { class: i <= step ? 'on' : '' })));
    const nav = (extra) => h('div', { class: 'row' }, [h('button', { class: 'btn', 'data-t': 'cancel', onclick: finish }), h('span', { class: 'spacer' }), ...(extra || []), h('button', { class: 'btn primary', 'data-t': step < 3 ? 'next' : 'cb.finish', onclick: () => { if (step < 3) { step++; render(); } else { D.setCalib(res.openCents && Object.keys(res.openCents).length ? { openCents: res.openCents } : {}); PD.ui.toast(t('cb.done')); finish(); } } })]);
    let stepOffs = [];
    function render() {
      stepOffs.forEach(f => f()); stepOffs = [];
      box.innerHTML = '';
      box.append(dots(), h('h1', { 'data-t': 'cb.title' }));
      [s1, s2, s3, s4][step]();
      PD.i18n.apply(box);
    }
    function s1() {
      const out = h('p', { class: 'mono', 'aria-live': 'polite' });
      const go = h('button', { class: 'btn primary', 'data-t': 'cb.measure', onclick: async () => { go.disabled = true; const n = await D.measureNoise(3); out.textContent = t('cb.noise', { v: (20 * Math.log10(Math.max(n, 1e-5))).toFixed(0) + ' dBFS' }) + (n > .02 ? ' · ' + t('cb.loud') : ''); go.disabled = false; } });
      const room = h('div', { class: 'seg', role: 'group', 'aria-label': t('cb.room') }, D.ROOMS.map(r => h('button', { 'aria-pressed': String((D.calib.room || 'normal') === r), 'data-t': 'room.' + r, onclick: e => { D.setCalib({ room: r }); room.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b === e.currentTarget))); } })));
      box.append(h('h2', { 'data-t': 'cb.s1' }), h('p', { class: 'fg2', 'data-t': 'cb.s1d' }), meter, go, out, h('span', { class: 'kicker', 'data-t': 'cb.room' }), room, nav());
    }
    function s2() {
      let n = 0; const out = h('p', { class: 'mono', 'aria-live': 'polite', text: t('cb.heard', { n: 0, p: '—' }) });
      const sl = h('input', { type: 'range', min: '0', max: '100', value: String(D.calib.sens == null ? 60 : D.calib.sens), 'aria-label': t('cb.s2'), oninput: e => D.setCalib({ sens: +e.target.value }) });
      const hint = h('p', { class: 'muted', 'aria-live': 'polite', style: 'min-height:20px' });
      stepOffs.push(D.on('input', m => { hint.textContent = t(m.kind === 'clip' ? 'h.clip' : 'h.quiet'); setTimeout(() => hint.textContent = '', 2500); }));
      stepOffs.push(D.on('note', m => { n++; out.textContent = t('cb.heard', { n, p: m.unsure ? '?' : TH.name(m.midi) + ' (' + Math.round(m.conf * 100) + '%)' }); }));
      box.append(h('h2', { 'data-t': 'cb.s2' }), h('p', { class: 'fg2', 'data-t': 'cb.s2d' }), meter, sl, out, hint, nav());
    }
    function s3() {
      let cur = 1; const rows = h('div', { class: 'tstr' }), out = h('p', { class: 'mono', 'aria-live': 'polite' });
      const draw = () => { rows.innerHTML = ''; [1, 2, 3].forEach(s => rows.appendChild(h('button', { 'aria-pressed': String(s === cur), html: '<b>' + TH.stringName(s) + '</b><small>' + (res.openCents[s] != null ? (res.openCents[s] >= 0 ? '+' : '') + res.openCents[s] + '¢' : '—') + '</small>', onclick: () => { cur = s; draw(); } }))); };
      stepOffs.push(D.on('note', m => {
        if (m.unsure) { out.textContent = t('h.unsure'); return; }
        const exp = TH.open(cur), c = Math.round((m.midi - exp) * 100);
        if (Math.abs(c) > 150) { out.textContent = t('h.wrong', { p: TH.name(m.midi), e: TH.name(exp), s: TH.stringName(cur), f: 0 }); return; }
        res.openCents[cur] = c; out.textContent = t(Math.abs(c) <= 15 ? 'cb.ok' : 'cb.off', { p: TH.name(exp), c: (c >= 0 ? '+' : '') + c });
        if (cur < 3) cur++; draw();
      }));
      draw(); box.append(h('h2', { 'data-t': 'cb.s3' }), h('p', { class: 'fg2', 'data-t': 'cb.s3d' }), rows, out, nav([h('button', { class: 'btn', 'data-t': 'skip', onclick: () => { step++; render(); } })]));
    }
    function s4() {
      const out = h('p', { class: 'mono', 'aria-live': 'polite', text: t('cb.lat', { v: Math.round(D.calib.latencyMs || 0) }) });
      const man = h('input', { type: 'number', class: 'input', min: '0', max: '400', value: String(Math.round(D.calib.latencyMs || 0)), style: 'width:110px', onchange: e => { const v = Math.max(0, Math.min(400, +e.target.value || 0)); D.setCalib({ latencyMs: v }); out.textContent = t('cb.lat', { v }); } });
      const go = h('button', { class: 'btn primary', 'data-t': 'cb.measure', onclick: () => {
        go.disabled = true; PD.audio.ensure(); D.guardOn = false;
        const sp = .6, t0 = PD.audio.now() + .3, clicks = [], hits = [], prev = D.calib.latencyMs || 0;
        for (let i = 0; i < 6; i++) { const tt = t0 + i * sp; PD.audio.click(tt, true); clicks.push(tt); }
        const off = D.on('onset', m => { const raw = m.t + prev / 1000; const c = clicks.find(c => raw - c > 0 && raw - c < .4); if (c != null) hits.push(raw - c); });
        setTimeout(() => {
          off(); D.guardOn = PD.store.get('clickGuard', true) !== false; go.disabled = false;
          if (hits.length < 3) { out.textContent = t('cb.latFail'); return; }
          hits.sort((a, b) => a - b); const rt = hits[Math.floor(hits.length / 2)], v = Math.max(0, Math.round((rt - PD.audio.outLatency) * 1000));
          D.setCalib({ latencyMs: v }); man.value = String(v); out.textContent = t('cb.lat', { v }) + ' (' + hits.length + '/6)';
        }, (6 * sp + .9) * 1000);
      } });
      box.append(h('h2', { 'data-t': 'cb.s4' }), h('p', { class: 'fg2', 'data-t': 'cb.s4d' }), meter, go, out, h('label', { class: 'field' }, [h('span', { 'data-t': 'cb.manual' }), man]), nav());
    }
    const begin = () => render();
    if (D.active) begin(); else PD.practice.micOn(ok => { if (ok) begin(); else finish(); });
  }
  return { open };
})();

PD.i18n.add({
  'ob.have': ['ფანდური გაქვს ხელთ?', 'Do you have a panduri with you?'], 'ob.haveY': ['კი, ახლავე ავიღებ', 'Yes, I will pick it up now'], 'ob.haveYD': ['აპი მიკროფონით მოგისმენს — ნოტი მხოლოდ ნამდვილი ბგერით ითვლება.', 'The app listens through the microphone — a note only counts when it really sounds.'],
  'ob.haveN': ['ჯერ არა', 'Not yet'], 'ob.haveND': ['გაკვეთილებს მოუსმენ და ნახავ. დასაკრავად ნამდვილი ფანდური და მიკროფონი დაგჭირდება.', 'You can listen to and watch lessons. To play, you will need a real panduri and the microphone.'],
  'ob.goals': ['რა გინდა ისწავლო?', 'What do you want to learn?'], 'ob.goalsD': ['რამდენიც გინდა, მონიშნე.', 'Pick as many as you like.'],
  'gl.songs': ['სიმღერები', 'Songs'], 'gl.rhythm': ['რიტმები და ჩაკვრა', 'Rhythms and strumming'], 'gl.notes': ['ნოტები და ლადები', 'Notes and frets'], 'gl.trad': ['ტრადიციული რეპერტუარი', 'Traditional repertoire'], 'gl.accomp': ['სიმღერის აკომპანემენტი', 'Accompanying singing'],
  'ob.time': ['დღეში რამდენი წუთი?', 'How many minutes a day?'], 'ob.timeD': ['ამით დღევანდელი ვარჯიში აიწყობა. მოგვიანებით შეცვლი პროფილში.', 'Daily practice is built from this. You can change it later in Profile.'],
  'ob.micT': ['აიღე ფანდური და მიეცი აპს მიკროფონზე წვდომა.', 'Pick up your panduri and give the app access to the microphone.'],
  'ob.tune': ['აწყობის შემოწმება', 'Tuning check'], 'ob.tuneD': ['დაუკარი სამივე ღია სიმი, სათითაოდ. თუ რომელიმე აცდენილია, ტიუნერი გიჩვენებს რამდენით.', 'Play all three open strings, one at a time. If one is off, the tuner shows by how much.'],
  'ob.tuneNoMic': ['მიკროფონი ჩართული არ არის — აწყობას მოგვიანებით ტიუნერში შეამოწმებ.', 'The microphone is off — check tuning later in the Tuner.'],
  'ob.tuneLow': ['დაბალია', 'too low'], 'ob.tuneHigh': ['მაღალია', 'too high'], 'ob.tuneOk': ['აწყობილია', 'in tune'], 'ob.openTuner': ['ტიუნერის გახსნა', 'Open the tuner'],
  'ob.firstT': ['პირველი მინი-გაკვეთილი', 'First mini lesson'], 'ob.firstD': ['სამი ღია სიმი: A, C♯, E. აპი თითოეულ ნოტზე დაგელოდება და მხოლოდ მაშინ გადავა, როცა სწორად გაიგებს.', 'Three open strings: A, C♯, E. The app waits on each note and only moves on when it hears it right.'],
  'ob.startFirst': ['დაწყება', 'Start'], 'ob.step': ['{a} / {b}', '{a} / {b}']
});
PD.onboard = (() => {
  const h = PD.h, TH = PD.theory, D = PD.detector;
  const N = 8;
  function open() {
    const back = h('div', { class: 'ob', role: 'dialog', 'aria-modal': 'true' }), box = h('div', { class: 'box' });
    back.appendChild(box); document.body.appendChild(back);
    let step = 0, offs = [], micByUs = false;
    const clean = () => { offs.forEach(f => f()); offs = []; };
    const done = () => { clean(); if (micByUs && D.active) D.stop(); PD.store.set('onboarded', true); back.remove(); };
    const opt = (k, d, on, pressed) => h('button', { class: 'opt', 'aria-pressed': String(!!pressed), onclick: on, html: '<span><b data-t="' + k + '"></b>' + (d ? '<small data-t="' + d + '"></small>' : '') + '</span><span class="mono">' + (pressed ? '✓' : '') + '</span>' });
    const next = () => { step++; render(); }, prev = () => { step = Math.max(0, step - 1); render(); };
    const foot = (primary) => h('div', { class: 'row' }, [step > 0 ? h('button', { class: 'btn quiet', 'data-t': 'back', onclick: prev }) : null, h('span', { class: 'spacer' }), primary || h('button', { class: 'btn primary', 'data-t': 'next', onclick: next })].filter(Boolean));
    const noPanduri = () => PD.store.get('ob.noPanduri', false);
    function render() {
      clean(); box.innerHTML = '';
      box.append(h('div', { class: 'dots', 'aria-label': t('ob.step', { a: step + 1, b: N }) }, Array.from({ length: N }, (_, i) => h('i', { class: i <= step ? 'on' : '' }))));
      [welcome, have, level, goals, time, mic, tune, first][step]();
      PD.i18n.apply(box);
    }
    function welcome() {
      box.append(h('h1', { 'data-t': 'ob.hello' }), h('p', { class: 'fg2', 'data-t': 'ob.lead' }), h('span', { class: 'kicker', 'data-t': 'ob.lang' }),
        opt('lang.ka', null, () => { PD.i18n.set('ka'); render(); }, PD.i18n.lang === 'ka'), opt('lang.en', null, () => { PD.i18n.set('en'); render(); }, PD.i18n.lang === 'en'), foot());
    }
    function have() {
      box.append(h('h1', { 'data-t': 'ob.have' }),
        opt('ob.haveY', 'ob.haveYD', () => { PD.store.set('ob.noPanduri', false); next(); }, !noPanduri()),
        opt('ob.haveN', 'ob.haveND', () => { PD.store.set('ob.noPanduri', true); next(); }, noPanduri()), foot(h('span')));
    }
    function level() {
      const lv = PD.store.get('selfLevel', null), lefty = PD.store.get('lefty', false);
      const hand = h('div', { class: 'seg', role: 'group', 'aria-label': t('ob.hand') }, [['ob.right', false], ['ob.left', true]].map(([k, v]) => h('button', { 'aria-pressed': String(lefty === v), 'data-t': k, onclick: () => { PD.store.set('lefty', v); render(); } })));
      box.append(h('h1', { 'data-t': 'ob.level' }), ...[1, 2, 3].map(i => opt('ob.l' + i, 'ob.l' + i + 'd', () => { PD.store.set('selfLevel', i); next(); }, lv === i)),
        h('span', { class: 'kicker', 'data-t': 'ob.hand' }), hand, h('small', { class: 'muted', 'data-t': 'ob.handD' }), foot(lv ? null : h('span')));
    }
    function goals() {
      const g = PD.store.get('goals', []);
      const tg = k => () => { const s = new Set(PD.store.get('goals', [])); s.has(k) ? s.delete(k) : s.add(k); PD.store.set('goals', [...s]); render(); };
      box.append(h('h1', { 'data-t': 'ob.goals' }), h('p', { class: 'muted', 'data-t': 'ob.goalsD' }), ...['songs', 'rhythm', 'notes', 'trad', 'accomp'].map(k => opt('gl.' + k, null, tg(k), g.includes(k))), foot());
    }
    function time() {
      const cur = PD.store.get('goalMin', 15);
      box.append(h('h1', { 'data-t': 'ob.time' }), h('p', { class: 'muted', 'data-t': 'ob.timeD' }),
        ...[5, 10, 15, 20, 30].map(m => h('button', { class: 'opt', 'aria-pressed': String(cur === m), onclick: () => { PD.store.set('goalMin', m); next(); }, html: '<span><b>' + PD.esc(t('dl.min', { n: m })) + '</b></span><span class="mono">' + (cur === m ? '✓' : '') + '</span>' })), foot());
    }
    function mic() {
      if (noPanduri()) { step++; return render(); }
      box.append(h('h1', { 'data-t': 'ob.micT' }), h('p', { class: 'fg2', 'data-t': 'ob.mic1' }), h('p', { class: 'fg2', 'data-t': 'ob.mic2' }), h('p', { class: 'muted', 'data-t': 'ob.mic3' }),
        h('div', { class: 'row' }, [h('button', { class: 'btn primary', 'data-t': 'ob.micYes', onclick: () => { PD.store.set('micExplained', true); back.hidden = true; micByUs = !D.active; PD.calib.open(() => { back.hidden = false; next(); }, { keep: true }); } }), h('button', { class: 'btn', 'data-t': 'skip', onclick: next })]),
        foot(h('span')));
    }
    function tune() {
      if (noPanduri()) { step++; return render(); }
      box.append(h('h1', { 'data-t': 'ob.tune' }));
      const goTuner = h('button', { class: 'btn', 'data-t': 'ob.openTuner', onclick: () => { done(); PD.app.go('tuner'); } });
      if (!D.active) { box.append(h('p', { class: 'fg2', 'data-t': 'ob.tuneNoMic' }), foot()); return; }
      const res = {}, rows = h('div', { class: 'tstr' }), live = h('p', { class: 'mono', 'aria-live': 'polite', style: 'min-height:22px' });
      const draw = () => { rows.innerHTML = ''; [1, 2, 3].forEach(s => { const c = res[s]; rows.appendChild(h('button', { 'aria-pressed': String(c != null && Math.abs(c) <= 15), html: '<b>' + TH.stringName(s) + '</b><small>' + (c == null ? '—' : (c >= 0 ? '+' : '') + c + '¢ · ' + PD.esc(t(Math.abs(c) <= 15 ? 'ob.tuneOk' : c < 0 ? 'ob.tuneLow' : 'ob.tuneHigh'))) + '</small>' })); }); };
      offs.push(D.on('note', m => {
        if (m.unsure) return;
        // auto string detection: nearest open string within a semitone and a half
        let best = null; [1, 2, 3].forEach(s => { const c = (m.midi - TH.open(s)) * 100; if (Math.abs(c) <= 150 && (!best || Math.abs(c) < Math.abs(best.c))) best = { s, c: Math.round(c) }; });
        if (!best) { live.textContent = TH.name(Math.round(m.midi)) + ' · ' + (m.f ? m.f.toFixed(1) + ' Hz' : ''); return; }
        res[best.s] = best.c; live.textContent = TH.stringName(best.s) + ' · ' + (best.c >= 0 ? '+' : '') + best.c + '¢' + (m.f ? ' · ' + m.f.toFixed(1) + ' Hz' : ''); draw();
      }));
      draw(); box.append(h('p', { class: 'fg2', 'data-t': 'ob.tuneD' }), rows, live, h('div', { class: 'row' }, [goTuner]), foot());
    }
    function first() {
      const item = (glyph, k, d) => h('div', { class: 'li' }, [h('span', { class: 'mono', style: 'width:44px;font-size:18px;color:var(--brass2);text-align:center', text: glyph }), h('div', { class: 'grow' }, [h('span', { 'data-t': k }), h('small', { 'data-t': d })])]);
      box.append(h('h1', { 'data-t': 'ob.firstT' }), h('p', { class: 'fg2', 'data-t': 'ob.firstD' }),
        h('div', { class: 'list' }, [item('1–4', 'ob.fingers', 'ob.fingersD'), item('↓ ↑', 'ob.strokes', 'ob.strokesD'), item('◷', 'ob.wait', 'ob.waitD')]),
        h('div', { class: 'row' }, [h('button', { class: 'btn primary', 'data-t': 'ob.startFirst', onclick: () => { const l = PD.lessons.get('poc-three'); micByUs = false; done(); PD.app.go('home', null, true); if (l) PD.practice.open(l, noPanduri() ? { autoplay: true, tempo: 1, mode: 'learn' } : { wait: true, tempo: 1, mode: 'learn' }, l.id, noPanduri() ? 'demo' : 'wait'); } }),
          h('button', { class: 'btn quiet', 'data-t': 'ob.home', onclick: () => { done(); PD.app.go('home', null, true); } })]));
    }
    render();
  }
  return { open };
})();
