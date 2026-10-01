// Georgian / English strings. Language: saved setting → device language → English.
// Add a language by adding one more dictionary with the same keys.

const DICT = {
  ka: {
    'app.name': 'სამი სიმი',
    'app.tagline': 'ფანდურის ტიუნერი',
    'app.description': 'ზუსტი ტიუნერი სამსიმიანი ქართული ფანდურისთვის — A · C♯ · E',
    'aria.brand': 'სამი სიმი — პარამეტრები',
    'aria.instrument': 'ტიუნერი',
    'aria.head': 'ფანდურის თავი — შეეხე მომჭერს სიმის ასარჩევად',
    'aria.modes': 'რეჟიმი',
    'aria.dock': 'მართვა',
    'aria.settings': 'პარამეტრები',
    'aria.close': 'დახურვა',
    'aria.ref': 'ეტალონური ბგერა',
    'aria.chord': 'სამივე სიმის ერთად მოსმენა',
    'aria.meterNeedle': 'ჩვენება: ისარი (შეცვლა სტრობით)',
    'aria.meterStrobe': 'ჩვენება: სტრობი (შეცვლა ისრით)',
    'aria.micOn': 'მიკროფონის ჩართვა',
    'aria.micOff': 'მიკროფონის გამორთვა',
    'aria.semiDown': 'ნახევარტონით დაბლა',
    'aria.semiUp': 'ნახევარტონით მაღლა',
    'aria.a4Down': '0.5 ჰერცით დაბლა',
    'aria.a4Up': '0.5 ჰერცით მაღლა',
    'aria.peg': 'სიმი {n}: {note} ({sci})',
    'aria.pegDone': ', აწყობილია',

    'stat.hz': 'სიხშირე', 'stat.cents': 'ცენტი', 'stat.target': 'სამიზნე',
    'mode.auto': 'ავტო', 'mode.manual': 'ხელით', 'mode.guided': 'აწყობა',
    'dock.ref': 'ეტალონი', 'dock.refStop': 'შეჩერება', 'dock.chord': 'აკორდი',
    'mic.label': 'მიკროფონი', 'mic.stop': 'გაჩერება', 'mic.starting': 'ირთვება…',
    'complete.title': 'ფანდური აწყობილია', 'complete.text': 'სამივე სიმი ზუსტ წყობაშია', 'complete.ok': 'კარგი',

    'string': 'სიმი {n}',
    'note.withString': '{note} · სიმი {n}',

    'ins.off': 'ჩართე მიკროფონი და ჩამოკარი სიმს',
    'ins.offGuided': 'ჩართე მიკროფონი — დავიწყოთ ლა-თი',
    'ins.ref': 'ეტალონი ჟღერს — მოუსმინე',
    'ins.cal': 'ოთახის ხმაურს ვზომავ…',
    'ins.pluck': 'ჩამოკარი სიმს',
    'ins.pluckN': 'ჩამოკარი სიმი {n} — {note}',
    'ins.listening': 'ვუსმენ…',
    'ins.unstable': 'ბგერა არასტაბილურია — ჩამოკარი თავიდან',
    'ins.intune': 'ზუსტად აწყობილია', 'ins.intuneShort': 'აწყობილია',
    'ins.up-far': 'მოუჭირე', 'ins.up-mid': 'კიდევ ცოტათი მოუჭირე', 'ins.up-near': 'ოდნავ მოუჭირე', 'ins.up': 'მოუჭირე',
    'ins.down-far': 'მოუშვი', 'ins.down-mid': 'კიდევ ცოტათი მოუშვი', 'ins.down-near': 'ოდნავ მოუშვი', 'ins.down': 'მოუშვი',

    'sub.octHigh': 'ოქტავით მაღლა ჟღერს — შეამოწმე, სწორ სიმს უკრავ',
    'sub.octLow': 'ოქტავით დაბლა ჟღერს — სიმი ძალიან მოშვებულია',
    'sub.wrongString': 'ჟღერს {other} (სიმი {on}) · საჭიროა {target} (სიმი {tn})',
    'sub.guided': 'ფანდურის აწყობა · {k} / 3',
    'sub.guidedDone': 'ფანდურის აწყობა · დასრულდა',
    'sub.noisy': 'ხმაურიანი გარემო — ჩამოკარი ცოტა ხმამაღლა',

    'toast.guided': 'ფანდურის აწყობა: ჯერ ლა, მერე დო♯, ბოლოს მი',
    'toast.micRetry': 'მიკროფონი ვერ ჩაირთო — დააჭირე ხელახლა',
    'toast.micEnded': 'მიკროფონი გაითიშა (მაგ. ზარის გამო). ჩართე ხელახლა.',
    'toast.statusReset': 'აწყობის სტატუსი გასუფთავდა',
    'toast.settingsReset': 'პარამეტრები დაბრუნდა საწყისზე',
    'toast.diagOn': 'დიაგნოსტიკა ჩართულია', 'toast.diagOff': 'დიაგნოსტიკა გამორთულია',
    'announce.done': 'ფანდური აწყობილია', 'announce.string': '{note} აწყობილია',

    'mic.prime.t': 'მიკროფონზე წვდომა',
    'mic.prime.p': 'ტიუნერს სჭირდება მიკროფონი მხოლოდ ფანდურის ხმის დასადგენად.',
    'mic.prime.f': 'ხმა მუშავდება მხოლოდ შენს მოწყობილობაზე — არსად იგზავნება და არ ინახება.',
    'mic.prime.go': 'მიკროფონის ჩართვა', 'mic.prime.cancel': 'არა ახლა',
    'mic.denied.t': 'მიკროფონზე წვდომა დაბლოკილია',
    'mic.denied.p': 'მიკროფონზე წვდომა არ არის ნებადართული.',
    'mic.denied.f': 'აპში: პარამეტრები → სამი სიმი → მიკროფონი. ბრაუზერში — iPhone: „aA“ → ვებსაიტის პარამეტრები → მიკროფონი; Android: ბოქლომი → ნებართვები → მიკროფონი.',
    'mic.notfound.t': 'მიკროფონი ვერ მოიძებნა', 'mic.notfound.p': 'მოწყობილობაზე მიკროფონი არ ჩანს.', 'mic.notfound.f': 'შეამოწმე, ჩართულია თუ არა, ან შეაერთე გარე მიკროფონი.',
    'mic.busy.t': 'მიკროფონი დაკავებულია', 'mic.busy.p': 'მიკროფონს ახლა სხვა აპლიკაცია იყენებს (მაგ. ზარი ან ჩამწერი).', 'mic.busy.f': 'დახურე ის აპლიკაცია და სცადე თავიდან.',
    'mic.insecure.t': 'საჭიროა უსაფრთხო კავშირი', 'mic.insecure.p': 'ბრაუზერი მიკროფონს მხოლოდ https:// მისამართზე რთავს.', 'mic.insecure.f': 'გახსენი ტიუნერი https-ით. მანამდე ყურით აწყობა მუშაობს: შეეხე მომჭერს ან „ეტალონს“.',
    'mic.unsupported.t': 'ბრაუზერი მხარს არ უჭერს', 'mic.unsupported.p': 'ეს ბრაუზერი მიკროფონიდან ხმას ვერ იღებს.', 'mic.unsupported.f': 'გამოიყენე Safari ან Chrome-ის ახალი ვერსია. ყურით აწყობა „ეტალონით“ აქაც მუშაობს.',
    'mic.embedded.t': 'ამ ბმულში მიკროფონი დაბლოკილია', 'mic.embedded.p': 'ეს გადახედვის გვერდია — აქ ბრაუზერი ტიუნერს მიკროფონს არ აძლევს.', 'mic.embedded.f': 'აქ მუშაობს ყურით აწყობა: შეეხე მომჭერს, „ეტალონს“ ან „აკორდს“.',
    'mic.unknown.t': 'მიკროფონი ვერ ჩაირთო', 'mic.unknown.p': 'რაღაც შეცდომა მოხდა მიკროფონის ჩართვისას.', 'mic.unknown.f': 'გადატვირთე და სცადე თავიდან.',
    'mic.retry': 'თავიდან ცდა', 'mic.close': 'დახურვა', 'mic.ok': 'გასაგებია',

    'set.title': 'პარამეტრები',
    'set.g.tuning': 'წყობა', 'set.g.detect': 'ამოცნობა', 'set.g.display': 'ჩვენება', 'set.g.audio': 'ხმა', 'set.g.system': 'სისტემა',
    'preset.panduri-standard': 'ფანდური — ტრადიციული',
    'set.preset': 'პრესეტი', 'set.transpose': 'ტრანსპოზიცია', 'set.semitones': '{n} ნახევარტონი',
    'set.octave': 'ოქტავა', 'set.oct.low': 'დაბალი', 'set.oct.std': 'სტანდარტი', 'set.oct.high': 'მაღალი',
    'set.a4': 'კალიბრაცია A4', 'hz': 'ჰც',
    'set.autoSens': 'ავტომატური მგრძნობელობა', 'set.autoSensNote': 'ზომავს ოთახის ხმაურს და თავად არჩევს ზღვარს.',
    'set.sens': 'მგრძნობელობა (ხელით)', 'set.auto': 'ავტო',
    'set.tol': '„აწყობილის“ ზღვარი', 'set.cents': '±{n} ცენტი',
    'set.meter': 'მაჩვენებელი', 'set.needle': 'ისარი', 'set.strobe': 'სტრობი',
    'set.ui': 'ინტერფეისი', 'set.simple': 'მარტივი', 'set.pro': 'პროფესიული', 'set.uiNote': 'მარტივი ჩვენება მალავს ჰერცებს, ცენტებს და ისტორიას.',
    'set.motion': 'მოძრაობის ეფექტები', 'set.motionNote': 'სიღრმე და პარალაქსი შეხებისას.',
    'set.lang': 'ენა', 'set.langAuto': 'ავტო',
    'set.refVol': 'ეტალონის ხმა',
    'set.haptics': 'ვიბრაცია აწყობისას', 'set.hapticsNote': 'მოკლე ბიძგი, როცა სიმი აეწყობა.', 'set.hapticsNone': 'ამ მოწყობილობაზე ვიბრაცია მიუწვდომელია.',
    'set.resetStatus': 'აწყობის სტატუსის გასუფთავება',
    'set.resetSettings': 'პარამეტრების დაბრუნება საწყისზე', 'set.resetConfirm': 'შეეხე კიდევ ერთხელ დასადასტურებლად',
    'set.privacy': 'კონფიდენციალურობა', 'set.support': 'დახმარება',
    'set.about': 'ხმა მუშავდება მხოლოდ შენს მოწყობილობაზე — არსად იგზავნება და არ ინახება.',
  },

  en: {
    'app.name': 'Sami Simi',
    'app.tagline': 'Panduri Tuner',
    'app.description': 'A precise tuner for the three-string Georgian panduri — A · C♯ · E',
    'aria.brand': 'Sami Simi — settings',
    'aria.instrument': 'Tuner',
    'aria.head': 'Panduri headstock — tap a peg to choose a string',
    'aria.modes': 'Mode',
    'aria.dock': 'Controls',
    'aria.settings': 'Settings',
    'aria.close': 'Close',
    'aria.ref': 'Reference tone',
    'aria.chord': 'Play all three strings',
    'aria.meterNeedle': 'Display: needle (switch to strobe)',
    'aria.meterStrobe': 'Display: strobe (switch to needle)',
    'aria.micOn': 'Turn microphone on',
    'aria.micOff': 'Turn microphone off',
    'aria.semiDown': 'Down a semitone',
    'aria.semiUp': 'Up a semitone',
    'aria.a4Down': 'Down 0.5 Hz',
    'aria.a4Up': 'Up 0.5 Hz',
    'aria.peg': 'String {n}: {note} ({sci})',
    'aria.pegDone': ', in tune',

    'stat.hz': 'Frequency', 'stat.cents': 'Cents', 'stat.target': 'Target',
    'mode.auto': 'Auto', 'mode.manual': 'Manual', 'mode.guided': 'Guided',
    'dock.ref': 'Reference', 'dock.refStop': 'Stop', 'dock.chord': 'Chord',
    'mic.label': 'Microphone', 'mic.stop': 'Stop', 'mic.starting': 'Starting…',
    'complete.title': 'Panduri is in tune', 'complete.text': 'All three strings are spot on', 'complete.ok': 'Done',

    'string': 'String {n}',
    'note.withString': '{note} · string {n}',

    'ins.off': 'Turn on the microphone and pluck a string',
    'ins.offGuided': 'Turn on the microphone — we start with A',
    'ins.ref': 'Reference tone playing — listen',
    'ins.cal': 'Measuring room noise…',
    'ins.pluck': 'Pluck a string',
    'ins.pluckN': 'Pluck string {n} — {note}',
    'ins.listening': 'Listening…',
    'ins.unstable': 'Unsteady sound — pluck again',
    'ins.intune': 'Perfectly in tune', 'ins.intuneShort': 'In tune',
    'ins.up-far': 'Tighten', 'ins.up-mid': 'Tighten a bit more', 'ins.up-near': 'Tighten slightly', 'ins.up': 'Tighten',
    'ins.down-far': 'Loosen', 'ins.down-mid': 'Loosen a bit more', 'ins.down-near': 'Loosen slightly', 'ins.down': 'Loosen',

    'sub.octHigh': 'An octave too high — check you are playing the right string',
    'sub.octLow': 'An octave too low — the string is far too slack',
    'sub.wrongString': 'Hearing {other} (string {on}) · need {target} (string {tn})',
    'sub.guided': 'Guided tuning · {k} / 3',
    'sub.guidedDone': 'Guided tuning · complete',
    'sub.noisy': 'Noisy room — pluck a little harder',

    'toast.guided': 'Guided tuning: first A, then C♯, then E',
    'toast.micRetry': 'Microphone did not start — tap again',
    'toast.micEnded': 'Microphone stopped (for example by a call). Turn it on again.',
    'toast.statusReset': 'Tuning status cleared',
    'toast.settingsReset': 'Settings restored to defaults',
    'toast.diagOn': 'Diagnostics on', 'toast.diagOff': 'Diagnostics off',
    'announce.done': 'Panduri is in tune', 'announce.string': '{note} is in tune',

    'mic.prime.t': 'Microphone access',
    'mic.prime.p': 'The tuner uses the microphone only to hear your panduri.',
    'mic.prime.f': 'Sound is analysed on your device only — it is never sent or stored.',
    'mic.prime.go': 'Turn on microphone', 'mic.prime.cancel': 'Not now',
    'mic.denied.t': 'Microphone access is blocked',
    'mic.denied.p': 'The tuner is not allowed to use the microphone.',
    'mic.denied.f': 'In the app: Settings → Sami Simi → Microphone. In a browser — iPhone: “aA” → Website Settings → Microphone; Android: lock icon → Permissions → Microphone.',
    'mic.notfound.t': 'No microphone found', 'mic.notfound.p': 'This device does not show a microphone.', 'mic.notfound.f': 'Check that it is enabled, or connect an external microphone.',
    'mic.busy.t': 'Microphone is busy', 'mic.busy.p': 'Another app (a call or a recorder) is using the microphone.', 'mic.busy.f': 'Close that app and try again.',
    'mic.insecure.t': 'Secure connection needed', 'mic.insecure.p': 'Browsers only allow the microphone on https:// pages.', 'mic.insecure.f': 'Open the tuner over https. Tuning by ear works meanwhile: tap a peg or “Reference”.',
    'mic.unsupported.t': 'Browser not supported', 'mic.unsupported.p': 'This browser cannot capture sound from the microphone.', 'mic.unsupported.f': 'Use a recent Safari or Chrome. Tuning by ear with “Reference” works here too.',
    'mic.embedded.t': 'Microphone blocked on this link', 'mic.embedded.p': 'This is a preview page — the browser does not give it the microphone.', 'mic.embedded.f': 'Tuning by ear works here: tap a peg, “Reference” or “Chord”.',
    'mic.unknown.t': 'Microphone did not start', 'mic.unknown.p': 'Something went wrong while starting the microphone.', 'mic.unknown.f': 'Restart and try again.',
    'mic.retry': 'Try again', 'mic.close': 'Close', 'mic.ok': 'Got it',

    'set.title': 'Settings',
    'set.g.tuning': 'Tuning', 'set.g.detect': 'Detection', 'set.g.display': 'Display', 'set.g.audio': 'Sound', 'set.g.system': 'System',
    'preset.panduri-standard': 'Panduri — traditional',
    'set.preset': 'Preset', 'set.transpose': 'Transpose', 'set.semitones': '{n} semitones',
    'set.octave': 'Octave', 'set.oct.low': 'Low', 'set.oct.std': 'Standard', 'set.oct.high': 'High',
    'set.a4': 'Calibration A4', 'hz': 'Hz',
    'set.autoSens': 'Automatic sensitivity', 'set.autoSensNote': 'Measures room noise and sets the threshold for you.',
    'set.sens': 'Sensitivity (manual)', 'set.auto': 'Auto',
    'set.tol': 'In-tune tolerance', 'set.cents': '±{n} cents',
    'set.meter': 'Indicator', 'set.needle': 'Needle', 'set.strobe': 'Strobe',
    'set.ui': 'Interface', 'set.simple': 'Simple', 'set.pro': 'Pro', 'set.uiNote': 'Simple mode hides hertz, cents and history.',
    'set.motion': 'Motion effects', 'set.motionNote': 'Depth and parallax as you touch.',
    'set.lang': 'Language', 'set.langAuto': 'Auto',
    'set.refVol': 'Reference volume',
    'set.haptics': 'Vibrate when in tune', 'set.hapticsNote': 'A short tap when a string is tuned.', 'set.hapticsNone': 'Vibration is not available on this device.',
    'set.resetStatus': 'Clear tuning status',
    'set.resetSettings': 'Restore default settings', 'set.resetConfirm': 'Tap again to confirm',
    'set.privacy': 'Privacy', 'set.support': 'Support',
    'set.about': 'Sound is analysed on your device only — it is never sent or stored.',
  },
};

export const LANGS = ['ka', 'en'];
let current = 'ka';

export function detectLang() {
  const list = (navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || 'en']).map((l) => String(l).toLowerCase());
  return list.some((l) => l.startsWith('ka')) ? 'ka' : 'en';
}

export function setLang(pref) {
  current = pref === 'ka' || pref === 'en' ? pref : detectLang();
  document.documentElement.lang = current;
  return current;
}
export const lang = () => current;

export function t(key, vars) {
  let s = (DICT[current] && DICT[current][key]) ?? DICT.en[key] ?? key;
  if (vars) s = s.replace(/\{(\w+)\}/g, (_, k) => (vars[k] != null ? vars[k] : ''));
  return s;
}

/** Note name shown to the user: Georgian solfège in Georgian, letter names in English. */
export const noteName = (s) => (current === 'ka' ? s.ka : s.latin);

/** Fill every [data-i18n], [data-i18n-aria] and [data-i18n-title] element. */
export function applyStatic(root = document) {
  root.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
  root.querySelectorAll('[data-i18n-aria]').forEach((el) => { el.setAttribute('aria-label', t(el.dataset.i18nAria)); });
  document.title = `${t('app.name')} — ${t('app.tagline')}`;
}
