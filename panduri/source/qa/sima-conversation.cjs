// Isolated regression checks; no network, account or microphone.
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const path = require('node:path');
const strings = {};
const PD = {
  h() { return {}; }, store: { get: (_, fallback) => fallback },
  i18n: { lang: 'ka', pick: value => value.ka, add: entries => Object.assign(strings, entries) },
  bus: { on() {} }, tips: { all: () => [] },
  curriculum: { rhythms: () => [], chords: () => [] }
};
const context = { PD, window: {}, setTimeout() {}, clearTimeout() {}, setInterval() {}, clearInterval() {}, addEventListener() {}, getComputedStyle: () => ({ display: "none" }), document: { querySelector: () => null, querySelectorAll: () => [], addEventListener() {}, body: { appendChild() {} } },
  t: (key, args = {}) => Object.entries(args).reduce((text, [name, value]) => text.replaceAll('{' + name + '}', value), strings[key]?.[0] || key)
};
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(__dirname, '../src/simatheory.js'), 'utf8'), context);
vm.runInContext(fs.readFileSync(path.join(__dirname, '../src/sima.js'), 'utf8'), context);
vm.runInContext(fs.readFileSync(path.join(__dirname, '../src/simaplus.js'), 'utf8'), context);
for (const question of ['გამარჯობა', 'გამარჯობა!', 'სალამი სიმა', 'როგორ ხარ?', 'მადლობა', 'ნახვამდის', 'ვინ ხარ?', 'კარგად ვარ', 'Hello!', 'thank you']) {
  const answer = PD.sima.answer(question);
  assert.equal(answer.conversational, true, question);
  assert.equal(answer.src, undefined, 'social replies must not claim a teacher or factual source');
  assert(answer.lines[0].length > 0);
}
assert(PD.sima.answer('გამარჯობა').lines[0].startsWith('გამარჯობა'));
assert.equal(PD.sima.answer('უცნობი საკითხი').conversational, undefined);
PD.curriculum.chords = () => [{ id: 'am', name: 'Am', frets: [0, 0, 0] }];
PD.theory = { stringName: n => String(n) };
assert.equal(PD.sima.answer('I am learning rhythm').title, 'სიმა');
assert.equal(PD.sima.answer('Am').title, 'Am');
assert.equal(PD.sima.canHear(), false);
assert.equal(PD.sima.listen(true), false);
assert.equal(PD.sima.say('hello'), false);
assert.doesNotThrow(() => PD.sima.refresh());
console.log('PASS: greetings, small talk, source labels, text-only mode, refresh');

/* music theory she works out herself: always the `fact` badge, letters spelled right, something to play */
const th = fs.readFileSync(path.join(__dirname, '../src/theory.js'), 'utf8').match(/CHORD_TYPES: (\[[\s\S]*?\n    \]),/);
PD.theory = { stringName: n => ['A', 'C♯', 'E'][n - 1], CHORD_TYPES: vm.runInNewContext(th[1]), ROOTS: ['C', 'C♯', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'A♭', 'A', 'B♭', 'B'], a4: () => 440, FRETS: 17, positions: () => [] };
const ask = q => PD.sima.answer(q), text = a => a.lines.join('\n');
let a = ask('რა ინტერვალია C-დან G-მდე?');
assert.equal(a.src, 'fact'); assert.match(text(a), /წმინდა კვინტა \(P5\) — 7 ნახევარტონი/); assert(a.play.length >= 1);
a = ask('F♯ მაჟორის გამა'); assert.match(text(a), /F♯ · G♯ · A♯ · B · C♯ · D♯ · E♯/, 'F♯ major is spelled with E♯, not F');
a = ask('რამდენი ბემოლი აქვს E♭ მაჟორს'); assert.match(text(a), /3 ბემოლი — B♭ · E♭ · A♭/); assert.match(text(a), /დო მინორი/);
a = ask('რა აკორდებია ლა მინორში'); assert.match(text(a), /i Am · ii° Bdim · III C · iv Dm · v Em · VI F · VII G/); assert.match(text(a), /E7/);
a = ask('Cmaj7 რა ნოტებისგან შედგება'); assert.match(text(a), /C · E · G · B/); assert.match(text(a), /1 · 3 · 5 · 7/);
a = ask('E G C რა აკორდია'); assert.equal(a.title, 'C'); assert.match(text(a), /C\/E — პირველი შებრუნება/);
a = ask('Am F C G რა ტონალობაშია?'); assert.match(a.title, /ლა მინორი/); assert.match(text(a), /i · VI · III · VII/);
a = ask('Am F C G ტრანსპოზიცია +2 ნახევარტონი'); assert.match(text(a), /Bm · G · D · A/);
a = ask('Am F C G გადაიტანე Dm-ში'); assert.match(text(a), /Dm · B♭ · F · C/);
a = ask('დიდი ტერცია E-დან'); assert.match(text(a), /G♯/);
a = ask('what interval is between E and B flat'); assert.match(a.lines[0], /d5|შემცირებული კვინტა/);
a = ask('440 hz რა ნოტია'); assert.match(text(a), /A4/);
a = ask('კვინტების წრე'); assert.match(text(a), /F♯ C♯ G♯ D♯ A♯ E♯ B♯/);
// a chord question still goes to the chord, not to a key
assert.equal(ask('როგორ ავიღო Am?').title, 'Am');
// songs that are not in the app: a YouTube search, opened only when tapped, and the internet for the chords
a = ask('მოძებნე სიმღერა ჩემო კარგო ქვეყანავ');
assert.equal(a.web, true); assert.equal(a.ext[0].url, 'https://www.youtube.com/results?search_query=' + encodeURIComponent('ჩემო კარგო ქვეყანავ'));
// the rhythms can be played
PD.curriculum.rhythms = () => [{ id: 'acharuli', source: 'teacher', name: { ka: 'აჭარული', en: 'Acharuli' }, strokes: [{ direction: 'down' }, { direction: 'down', accent: true }, { direction: 'up', accent: true }], timing: { bpm: 60, durations: [1, 1, 1], src: 'default' } }];
PD.lessons = { all: [] };
a = ask('დამიკარი აჭარული'); assert.equal(a.src, 'teacher'); assert.equal(a.play[0].k, 'rhythm'); assert.deepEqual(a.play[0].strokes.map(x => x.d), ['down', 'down', 'up']);
// the tip of the day: a real tip with its own badge, then one fact
PD.tips = { all: () => [{ id: 'care', src: 'general', title: ['მოვლა', 'Care'], short: ['გაწმინდე სიმები.', 'Wipe the strings.'], steps: [] }] };
const day = PD.sima.dayMessage(new Date(2026, 10, 17, 9));
assert.equal(day[0].src, 'general'); assert.match(text(day[0]), /მოვლა/); assert.equal(day[1].src, 'fact');
console.log('PASS: theory (intervals, spelling, keys, chords, transposition, key of a progression), song search, rhythm play, tip of the day');
