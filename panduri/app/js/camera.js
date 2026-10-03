/* =====================================================================
   Camera practice — the main way to learn with the app:
   choose a song, a lesson or your level program → the front camera
   turns on → put the phone down, take the panduri, sit inside the frame
   → the program shows chords / notes / rhythm over your own picture and
   moves with you in real time; the microphone checks what you play.
   The picture is a mirror only: it is never recorded, uploaded or analysed.
   ===================================================================== */
PD.i18n.add({
  'cam.title': ['კამერით სწავლა', 'Learn with the camera'], 'cam.lead': ['ჩართე კამერა, დაიჭირე ფანდური, ჩაჯექი ჩარჩოში და დაუკარი აპთან ერთად.', 'Turn on the camera, take the panduri, sit in the frame and play along with the app.'],
  'cam.what': ['რა ვისწავლოთ?', 'What shall we learn?'], 'cam.hand': ['რომელი ხელით ჩამოკრავ?', 'Which hand strums?'], 'cam.right': ['მარჯვენით', 'Right hand'], 'cam.left': ['მარცხენით', 'Left hand'],
  'cam.place': ['დადე ტელეფონი 1–1.5 მეტრზე, თვალის სიმაღლეზე. მთელი ფანდური უნდა ჩანდეს ჩარჩოში.', 'Place the phone 1–1.5 m away at eye level. The whole panduri should be inside the frame.'],
  'cam.start': ['კამერის ჩართვა', 'Turn on the camera'], 'cam.frame': ['ჩაჯექი ჩარჩოში', 'Sit inside the frame'], 'cam.private': ['გამოსახულება არსად იწერება და არსად იგზავნება — ეს მხოლოდ სარკეა.', 'The picture is never recorded or sent anywhere — it is just a mirror.'],
  'cam.denied': ['კამერაზე წვდომა არ არის — ჩართე ბრაუზერის/ტელეფონის პარამეტრებში. ვარჯიში კამერის გარეშე გაგრძელდება.', 'No camera access — allow it in the browser/phone settings. Practice continues without the camera.'],
  'cam.none': ['ამ მოწყობილობაზე კამერა ვერ მოიძებნა.', 'No camera was found on this device.'], 'cam.song': ['სიმღერა', 'Song'], 'cam.lesson': ['გაკვეთილი', 'Lesson'], 'cam.program': ['ლეველის პროგრამა', 'Level program'],
  'cam.mode': ['როგორ?', 'How?'], 'cam.mChords': ['აკორდები — გელოდება', 'Chords — waits for you'], 'cam.mSlow': ['ნელა, ჩანაწერთან', 'Slow, with the recording'], 'cam.mFull': ['სრული სიმღერა', 'Full song'], 'cam.mLearn': ['ნაბიჯ-ნაბიჯ — გელოდება', 'Step by step — waits for you'],
  'cam.toggleFrame': ['ჩარჩოს ჩვენება', 'Show the frame'], 'cam.flip': ['კამერის შეცვლა', 'Switch camera']
});

PD.camera = (() => {
  const h = PD.h, LS = PD.lessons;
  let pending = false, stream = null, facing = PD.store.get('cam.facing', 'user');
  /** start the camera into a <video>; resolves true / false (never throws) */
  async function attach(video, facingMode) {
    stop();
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) { PD.ui.toast(t('cam.none'), 4000); return false; }
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: facingMode || facing, width: { ideal: 1280 }, height: { ideal: 720 }, frameRate: { ideal: 30 } }, audio: false });
      video.srcObject = stream; video.muted = true; video.playsInline = true; await video.play().catch(() => {});
      return true;
    } catch (e) { PD.ui.toast(t(e && (e.name === 'NotAllowedError' || e.name === 'SecurityError') ? 'cam.denied' : 'cam.none'), 5000); return false; }
  }
  function stop() { if (stream) { stream.getTracks().forEach(tr => tr.stop()); stream = null; } }
  function flip(video) { facing = facing === 'user' ? 'environment' : 'user'; PD.store.set('cam.facing', facing); return attach(video, facing); }
  /** the frame guide: where to sit, how to hold the panduri (drawn for the current hand) */
  function frameSVG(lefty) {
    const m = lefty ? -1 : 1, cx = 200;
    const neck = m === 1 ? 'M150 250 L40 120' : 'M250 250 L360 120';
    return '<svg viewBox="0 0 400 400" preserveAspectRatio="xMidYMid meet" aria-hidden="true">' +
      '<g fill="none" stroke="rgba(255,236,210,.85)" stroke-width="3" stroke-linecap="round">' +
      '<path d="M40 70V40h30M330 40h30v30M360 330v30h-30M70 360H40v-30"/></g>' +
      '<g fill="none" stroke="rgba(255,236,210,.45)" stroke-width="2.5" stroke-dasharray="7 8" stroke-linecap="round">' +
      '<circle cx="' + cx + '" cy="105" r="38"/><path d="M120 330c0-70 35-130 80-130s80 60 80 130"/>' +
      '<path d="' + neck + '"/><ellipse cx="' + (cx - m * 10) + '" cy="275" rx="52" ry="38" transform="rotate(' + (-m * 35) + ' ' + (cx - m * 10) + ' 275)"/></g></svg>';
  }
  /** what to learn with the camera: the song, the level program's next step, or any lesson */
  function launcher() {
    PD.ui.sheet((box, close) => {
      box.classList.add('camsheet');
      let lefty = PD.store.get('lefty', false);
      const songs = LS.all.filter(l => l.song && l.events.length);
      const next = (() => { const P = LS.PATHS.find(p => p.id === PD.levels.program); if (!P) return null; for (const s of P.steps) { const l = s.kind === 'lesson' ? LS.get(s.id) : s.kind === 'rhythm' ? LS.get('rhythm-' + s.id) : null; if (l && l.events.length && LS.progress.lesson(l.id).mastery < .9) return l; } return null; })();
      let pick = songs[0] || next || LS.get('poc-three'), how = pick && pick.song ? 'chords' : 'wait';
      const hand = h('div', { class: 'seg', role: 'group', 'aria-label': t('cam.hand') }, [['cam.right', false], ['cam.left', true]].map(([k, v]) => h('button', { 'aria-pressed': String(lefty === v), 'data-t': k, onclick: e => { lefty = v; PD.store.set('lefty', v); hand.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b === e.currentTarget))); prev.innerHTML = frameSVG(lefty); } })));
      const prev = h('div', { class: 'cam-prev', html: frameSVG(lefty) });
      const list = h('div', { class: 'cam-list' });
      const hows = h('div', { class: 'seg' });
      function drawHows() {
        hows.innerHTML = '';
        const opts = pick && pick.song ? [['chords', 'cam.mChords'], ['slow', 'cam.mSlow'], ['perform', 'cam.mFull']] : [['wait', 'cam.mLearn'], ['perform', 'cam.mFull']];
        if (!opts.some(o => o[0] === how)) how = opts[0][0];
        opts.forEach(([v, k]) => hows.appendChild(h('button', { 'aria-pressed': String(how === v), 'data-t': k, onclick: e => { how = v; hows.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b === e.currentTarget))); } })));
        PD.i18n.apply(hows);
      }
      const item = (l, kind) => h('button', { class: 'cam-it', 'aria-pressed': String(pick === l), onclick: e => { pick = l; list.querySelectorAll('.cam-it').forEach(b => b.setAttribute('aria-pressed', String(b === e.currentTarget))); drawHows(); } }, [
        h('span', { class: 'cam-art', html: PD.app.coverSVG ? PD.app.coverSVG(l) : '' }), h('div', { class: 'grow' }, [h('small', { 'data-t': kind }), h('b', { text: PD.i18n.pick(l.title) })])]);
      songs.forEach(l => list.appendChild(item(l, 'cam.song')));
      if (next && !songs.includes(next)) list.appendChild(item(next, 'cam.program'));
      ['poc-three', 'poc-fret', 'poc-rhythm'].map(id => LS.get(id)).filter(l => l && l !== next).forEach(l => list.appendChild(item(l, 'cam.lesson')));
      drawHows();
      box.append(h('h2', { 'data-t': 'cam.title' }), prev, h('p', { class: 'fg2', 'data-t': 'cam.place' }),
        h('span', { class: 'kicker', 'data-t': 'cam.what' }), list, h('span', { class: 'kicker', 'data-t': 'cam.mode' }), hows,
        h('span', { class: 'kicker', 'data-t': 'cam.hand' }), hand,
        h('button', { class: 'btn primary big', html: PD.ic.camera + '<span data-t="cam.start"></span>', onclick: () => { close(); if (!pick) return; pending = true; PD.app.startStage(pick, how); } }),
        h('small', { class: 'muted', 'data-t': 'cam.private' }));
    });
  }
  return { launcher, attach, stop, flip, frameSVG, take() { const p = pending; pending = false; return p; }, get facing() { return facing; } };
})();
