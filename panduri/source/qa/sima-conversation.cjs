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
const context = { PD, window: {}, setTimeout() {}, document: { querySelector: () => null, body: { appendChild() {} } },
  t: (key, args = {}) => Object.entries(args).reduce((text, [name, value]) => text.replaceAll('{' + name + '}', value), strings[key]?.[0] || key)
};
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(__dirname, '../src/sima.js'), 'utf8'), context);
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
