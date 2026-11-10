#!/usr/bin/env node
/* node qa/i18n-merge.cjs ru batch1.txt batch2.txt …
   Each line: <number>|<translation>, numbered as in `node qa/i18n-merge.cjs --list`. Writes i18n/ru.json keyed by the
   English text. Refuses a line whose {placeholders} or <tags> differ from the English: those break the screen. */
const fs = require('fs'), path = require('path');
const dir = path.join(__dirname, '..', 'i18n'), src = JSON.parse(fs.readFileSync(path.join(dir, 'source.json'), 'utf8'));
const all = src.exact.concat(src.templates);
if (process.argv[2] === '--list') { const a = +process.argv[3] || 0, b = +process.argv[4] || all.length; for (let i = a; i < b; i++) console.log(i + '|' + all[i].replace(/\n/g, '\\n')); process.exit(0); }
if (process.argv[2] === '--status') {
  for (const f of fs.readdirSync(dir).filter(x => x.endsWith('.json') && x !== 'source.json')) { const d = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')); const have = all.filter(k => d[k] != null).length; console.log(f.slice(0, -5).padEnd(3), have + '/' + all.length, (have / all.length * 100).toFixed(1) + '%', 'first missing:', all.findIndex(k => d[k] == null)); }
  process.exit(0);
}
const [code, ...files] = process.argv.slice(2), out = path.join(dir, code + '.json');
const cur = fs.existsSync(out) ? JSON.parse(fs.readFileSync(out, 'utf8')) : {};
const marks = s => (s.match(/\{\w+\}|<\/?[a-z][^>]*>/gi) || []).sort().join(' ');
let ok = 0, bad = 0;
for (const f of files) for (const line of fs.readFileSync(f, 'utf8').split('\n')) {
  if (!line.trim()) continue;
  const at = line.indexOf('|'), n = +line.slice(0, at), tx = line.slice(at + 1).replace(/\\n/g, '\n');
  const en = all[n];
  if (at < 1 || en == null || !tx) { console.log('BAD LINE', line.slice(0, 80)); bad++; continue; }
  if (marks(en) !== marks(tx)) { console.log(`MARKS ${n}: ${marks(en)}  ≠  ${marks(tx)}`); bad++; continue; }
  cur[en] = tx; ok++;
}
const sorted = {}; Object.keys(cur).sort().forEach(k => { sorted[k] = cur[k]; });
fs.writeFileSync(out, JSON.stringify(sorted, null, 0).replace(/","/g, '",\n"'));
console.log(`${code}: +${ok}, rejected ${bad}, total ${all.filter(k => cur[k] != null).length}/${all.length}`);
