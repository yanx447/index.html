/* =====================================================================
   „აპლიკაციის დაყენება“ — the same app on every device.

   This is one web app, and every platform can keep it as a real
   application: an icon, its own window, offline files, no browser bar.
   What differs is only the gesture that installs it, so this page works
   out which device the person is on and shows that one first, with the
   others underneath for when they open the app somewhere else.

   Where the browser offers it (Chrome, Edge — Android, Windows, macOS,
   Linux) the install runs from the button here, through the prompt the
   browser handed us. Safari has no such prompt, so there the steps are
   the honest answer. Nothing here claims an App Store or Play Store
   build exists.
   ===================================================================== */
PD.i18n.add({
  'ins.title': ['აპლიკაციის დაყენება', 'Install the app'],
  'ins.lead': ['ერთი აპლიკაცია — ყველა მოწყობილობაზე: iPhone, Android, Mac, Windows. დაყენების შემდეგ თავისი ხატულა აქვს, თავის ფანჯარაში იხსნება და ინტერნეტის გარეშეც მუშაობს.', 'One app on every device: iPhone, Android, Mac, Windows. Once installed it has its own icon, opens in its own window and works without the internet.'],
  'ins.you': ['შენი მოწყობილობა', 'Your device'],
  'ins.other': ['სხვა მოწყობილობები', 'Other devices'],
  'ins.btn': ['დააყენე ახლა', 'Install now'],
  'ins.done': ['აპლიკაცია უკვე დაყენებულია — სწორედ მასში ხარ ახლა.', 'The app is already installed — you are in it right now.'],
  'ins.noPrompt': ['ამ ბრაუზერში ღილაკით დაყენება არ არის. ქვემოთ წერია, როგორ გააკეთო ხელით.', 'This browser has no install button. The steps below do it by hand.'],
  'ins.off': ['ინტერნეტის გარეშე', 'Without the internet'],
  'ins.offD': ['გაკვეთილები, აკორდები, გამები, ბიბლიოთეკა და ტიუნერი დაყენების შემდეგ ინტერნეტის გარეშეც მუშაობს. მიკროფონიც — ხმა შენს მოწყობილობაზე მუშავდება და არსად არ იგზავნება.', 'Lessons, chords, scales, the library and the tuner work without the internet once installed. So does the microphone — the sound is processed on your device and sent nowhere.'],
  'ins.storeT': ['App Store და Google Play', 'App Store and Google Play'],
  'ins.storeD': ['მაღაზიებში აპლიკაცია ჯერ არ არის. ეს ვებ-აპლიკაციაა და ზემოთ აღწერილი გზით ყველა მოწყობილობაზე ნამდვილ აპლიკაციად დგება — იგივე ხატულა, იგივე ფანჯარა. მაღაზიაში ასატვირთად საჭიროა დეველოპერის ანგარიში (Apple — წელიწადში $99, Google — ერთჯერადი $25) და ხელმოწერილი აწყობა; ეს ბრაუზერიდან არ კეთდება.', 'The app is not in the stores yet. This is a web app, and the steps above install it as a real application on every device — the same icon, the same window. Publishing to a store needs a developer account (Apple $99 a year, Google $25 once) and a signed build; that cannot be done from a browser.'],
  'ins.link': ['ბმული: ', 'Link: '],
  'ins.copy': ['ბმულის კოპირება', 'Copy the link'],
  'ins.copied': ['დაკოპირდა', 'Copied'],
  'ins.share': ['გაზიარება', 'Share'],

  'ins.ios': ['iPhone და iPad (Safari)', 'iPhone and iPad (Safari)'],
  'ins.ios1': ['გახსენი ეს გვერდი <b>Safari</b>-ში (Chrome-ში არ მუშაობს).', 'Open this page in <b>Safari</b> (it does not work in Chrome).'],
  'ins.ios2': ['დააჭირე <b>გაზიარების</b> ღილაკს ქვემოთ — კვადრატი ისრით ზემოთ.', 'Tap the <b>Share</b> button at the bottom — the square with an arrow.'],
  'ins.ios3': ['ჩამოსქროლე და აირჩიე <b>„Add to Home Screen“</b> (მთავარ ეკრანზე დამატება).', 'Scroll down and choose <b>“Add to Home Screen”</b>.'],
  'ins.ios4': ['დააჭირე <b>Add</b>. ხატულა მთავარ ეკრანზე გაჩნდება.', 'Tap <b>Add</b>. The icon appears on the Home Screen.'],
  'ins.android': ['Android (Chrome)', 'Android (Chrome)'],
  'ins.and1': ['გახსენი <b>Chrome</b>-ში.', 'Open it in <b>Chrome</b>.'],
  'ins.and2': ['დააჭირე ზემოთ მარჯვნივ <b>⋮</b> ღილაკს.', 'Tap <b>⋮</b> at the top right.'],
  'ins.and3': ['აირჩიე <b>„Install app“</b> ან <b>„Add to Home screen“</b>.', 'Choose <b>“Install app”</b> or <b>“Add to Home screen”</b>.'],
  'ins.and4': ['დაადასტურე. ხატულა მენიუში და მთავარ ეკრანზე გაჩნდება.', 'Confirm. The icon appears in the app drawer and on the home screen.'],
  'ins.mac': ['Mac (Safari)', 'Mac (Safari)'],
  'ins.mac1': ['გახსენი <b>Safari</b>-ში.', 'Open it in <b>Safari</b>.'],
  'ins.mac2': ['მენიუში აირჩიე <b>File → Add to Dock…</b>', 'In the menu bar choose <b>File → Add to Dock…</b>'],
  'ins.mac3': ['დაარქვი სახელი და დააჭირე <b>Add</b>. აპლიკაცია Dock-ში დადგება და თავის ფანჯარაში გაიხსნება.', 'Give it a name and click <b>Add</b>. The app lands in the Dock and opens in its own window.'],
  'ins.macC': ['Mac-ზე Chrome-ით: მისამართის ველის ბოლოს დააჭირე <b>დაყენების</b> ხატულას, ან მენიუ → <b>Cast, Save and Share → Install page as app…</b>', 'On a Mac with Chrome: click the <b>install</b> icon at the end of the address bar, or menu → <b>Cast, Save and Share → Install page as app…</b>'],
  'ins.win': ['Windows (Chrome ან Edge)', 'Windows (Chrome or Edge)'],
  'ins.win1': ['გახსენი <b>Chrome</b>-ში ან <b>Edge</b>-ში.', 'Open it in <b>Chrome</b> or <b>Edge</b>.'],
  'ins.win2': ['მისამართის ველის ბოლოს დააჭირე <b>დაყენების</b> ხატულას (მონიტორი ისრით).', 'Click the <b>install</b> icon at the end of the address bar (a monitor with an arrow).'],
  'ins.win3': ['ან: მენიუ <b>⋯ → Apps → Install this site as an app</b>.', 'Or: menu <b>⋯ → Apps → Install this site as an app</b>.'],
  'ins.win4': ['დაყენების შემდეგ Start-მენიუში და სამუშაო მაგიდაზე გაჩნდება.', 'After installing it appears in the Start menu and on the desktop.'],
  'ins.ff': ['Firefox', 'Firefox'],
  'ins.ff1': ['Firefox დესკტოპზე აპლიკაციად დაყენებას არ აკეთებს. აპლიკაცია ბრაუზერში მუშაობს, ოღონდ ხატულის გარეშე — სრული ვერსიისთვის გამოიყენე Chrome, Edge ან Safari.', 'Firefox on the desktop does not install web apps. Everything works in the browser, just without an icon — for the full version use Chrome, Edge or Safari.']
});

PD.install = (() => {
  const h = PD.h, t = PD.i18n.t, ic = PD.ic;
  /* the browser fires this once, early, and only when the app is installable — so it is caught at
     boot and kept, not asked for when the page happens to open */
  let prompt = null;
  try {
    window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); prompt = e; PD.bus.emit('installable', true); });
    window.addEventListener('appinstalled', () => { prompt = null; PD.bus.emit('installable', false); });
  } catch (_) {}
  const standalone = () => { try { return window.matchMedia('(display-mode: standalone)').matches || window.matchMedia('(display-mode: window-controls-overlay)').matches || navigator.standalone === true; } catch (_) { return false; } };

  const UA = navigator.userAgent || '';
  const touchMac = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;   // an iPad says it is a Mac
  const isIOS = /iPad|iPhone|iPod/.test(UA) || touchMac;
  const isAndroid = /Android/.test(UA);
  const isMac = /Macintosh/.test(UA) && !touchMac;
  const isWin = /Windows/.test(UA);
  const isFF = /Firefox/.test(UA);
  const isSafari = /Safari/.test(UA) && !/Chrome|Chromium|Edg|OPR/.test(UA);

  const STEPS = {
    ios: ['ins.ios', ['ins.ios1', 'ins.ios2', 'ins.ios3', 'ins.ios4']],
    android: ['ins.android', ['ins.and1', 'ins.and2', 'ins.and3', 'ins.and4']],
    mac: ['ins.mac', ['ins.mac1', 'ins.mac2', 'ins.mac3'], 'ins.macC'],
    win: ['ins.win', ['ins.win1', 'ins.win2', 'ins.win3', 'ins.win4']],
    ff: ['ins.ff', ['ins.ff1']]
  };
  function mine() {
    if (isIOS) return 'ios';
    if (isAndroid) return 'android';
    if (isFF) return 'ff';
    if (isMac) return 'mac';
    if (isWin) return 'win';
    return 'win';
  }
  function card(key, open) {
    const [title, steps, note] = STEPS[key];
    const list = h('ol', { class: 'in-steps' }, steps.map(s => h('li', { 'data-th': s })));
    if (note) list.append(h('li', { class: 'in-alt', 'data-th': note }));
    const box = h('section', { class: 'in-card' + (open ? ' on' : '') }, [h('h3', { 'data-t': title }), list]);
    return box;
  }

  function page(w) {
    w.append(h('div', { class: 'row pg-head' }, [h('button', { class: 'btn small backbtn', html: ic.back + '<span class="sr" data-t="back"></span>', onclick: () => PD.app.back('profile') }), h('h1', { 'data-t': 'ins.title', style: 'margin:0' })]),
      h('p', { class: 'fg2', 'data-t': 'ins.lead' }));

    // the button, when the browser gave us one
    const act = h('div', { class: 'in-act' });
    function drawAct() {
      act.innerHTML = '';
      if (standalone()) { act.append(h('p', { class: 'tb-note', 'data-t': 'ins.done' })); return; }
      if (prompt) {
        act.append(h('button', { class: 'btn primary in-go', 'data-t': 'ins.btn', onclick: async () => {
          try { prompt.prompt(); await prompt.userChoice; } catch (_) {}
          prompt = null; drawAct(); PD.i18n.apply(act);
        } }));
      } else if (!isIOS && !isSafari) {
        act.append(h('small', { class: 'muted', 'data-t': 'ins.noPrompt' }));
      }
    }
    drawAct();
    const un = PD.bus.on('installable', () => { drawAct(); PD.i18n.apply(act); });
    PD.bus.on('route', () => un());
    w.append(act);

    // this device first
    const k = mine();
    w.append(h('h2', { class: 'in-h2', 'data-t': 'ins.you' }), card(k, true));

    // the link, so the app can be opened on another device
    const url = location.href.split('#')[0];
    const copy = h('button', { class: 'btn small', 'data-t': 'ins.copy', onclick: async () => {
      try { await navigator.clipboard.writeText(url); PD.ui.toast(t('ins.copied')); } catch (_) {}
    } });
    const row = h('div', { class: 'in-link' }, [h('code', { text: url }), copy]);
    if (navigator.share) row.append(h('button', { class: 'btn small', 'data-t': 'ins.share', onclick: () => { try { navigator.share({ title: 'ფანდური', url }); } catch (_) {} } }));
    w.append(row);

    // every other device, for when the app is opened somewhere else
    w.append(h('h2', { class: 'in-h2', 'data-t': 'ins.other' }));
    Object.keys(STEPS).filter(x => x !== k).forEach(x => w.append(card(x, false)));

    w.append(h('section', { class: 'bk-b' }, [h('b', { 'data-t': 'ins.off' }), h('p', { 'data-t': 'ins.offD' })]),
      h('section', { class: 'bk-b' }, [h('b', { 'data-t': 'ins.storeT' }), h('p', { 'data-t': 'ins.storeD' })]));
    PD.i18n.apply(w);
  }

  return { page, standalone, get prompt() { return prompt; }, device: mine };
})();
