#!/usr/bin/env node
/* Builds i18n/source.json: every English string the app can show, found by reading the code.
   The English side is the source for all other languages. A string built by concatenation
   ('How many strokes is “' + name + '”?') becomes a template with {0}, {1} … so the runtime can
   match it whatever the value is. The teacher's tuner (ext/sami-simi) is read too: it uses these same packs. */
const fs = require('fs'), path = require('path'), acorn = require('acorn'), walk = require('acorn-walk');
const SRC = path.join(__dirname, '..', 'src');
const SKIP = new Set(['aiworker.js']);   // code with no text on screen
const TUNER = path.join(__dirname, '..', 'ext', 'sami-simi', 'js');
const KA = /[\u10D0-\u10FF\u1C90-\u1CBF]/, HAS_WORD = /\p{L}{2}/u;
const exact = new Map(), tmpl = new Map();
const note = (map, s, f) => { if (!map.has(s)) map.set(s, new Set()); map.get(s).add(f); };

/* an expression → { s, holes } where constant parts are text and anything else is a {n} hole */
function flat(n, st) {
  if (n.type === 'Literal' && typeof n.value === 'string') return n.value;
  if (n.type === 'TemplateLiteral') { let o = ''; n.quasis.forEach((q, i) => { o += q.value.cooked; if (n.expressions[i]) o += flat(n.expressions[i], st); }); return o; }
  if (n.type === 'BinaryExpression' && n.operator === '+') return flat(n.left, st) + flat(n.right, st);
  return '{' + (st.h++) + '}';
}
const isStr = n => n && (n.type === 'Literal' && typeof n.value === 'string' || n.type === 'TemplateLiteral' || n.type === 'BinaryExpression' && n.operator === '+');
function add(n, f) {
  if (!isStr(n)) return;
  const st = { h: 0 }; let s = flat(n, st).trim(), i = 0;
  s = s.replace(/(\{\d+\})+/g, () => '{' + (i++) + '}');   // (a + 1) reads as two holes; on screen it is one value
  if (!s || KA.test(s) || !HAS_WORD.test(s.replace(/\{\w+\}/g, ''))) return;
  note(st.h ? tmpl : exact, s, f);
}
function pair(a, b, f) { if (isStr(a) && isStr(b) && KA.test(flat(a, { h: 0 })) && !KA.test(flat(b, { h: 0 }))) { add(b, f); return true; } return false; }
const langTest = n => { let hit = false; walk.simple(n, { MemberExpression(m) { if (m.property && m.property.name === 'lang') hit = true; }, Identifier(i) { if (i.name === 'lang' || i.name === 'ka') hit = true; } }); return hit; };

for (const file of fs.readdirSync(SRC).filter(x => x.endsWith('.js') && !SKIP.has(x))) {
  const ast = acorn.parse(fs.readFileSync(path.join(SRC, file), 'utf8'), { ecmaVersion: 'latest' });
  walk.full(ast, n => {
    if (n.type === 'ArrayExpression') for (let i = 0; i + 1 < n.elements.length; i++) pair(n.elements[i], n.elements[i + 1], file);
    if (n.type === 'ObjectExpression') {
      const get = k => { const p = n.properties.find(p => p.key && (p.key.name === k || p.key.value === k)); return p && p.value; };
      const ka = get('ka'), en = get('en');
      if (ka && en && en.type === 'ArrayExpression') en.elements.forEach(x => add(x, file));
      if (ka && en) { if (!pair(ka, en, file) && isStr(en) && !KA.test(flat(en, { h: 0 }))) add(en, file); }
    }
    if (n.type === 'CallExpression') for (let i = 0; i + 1 < n.arguments.length; i++) {
      const a = n.arguments[i], b = n.arguments[i + 1];
      pair(a, b, file);
      if (a.type === 'ArrayExpression' && b.type === 'ArrayExpression') b.elements.forEach((x, j) => { if (a.elements[j]) pair(a.elements[j], x, file); });   // G(id, ka, en, [ka…], [en…])
    }
    if (n.type === 'ConditionalExpression' && langTest(n.test)) { pair(n.consequent, n.alternate, file); pair(n.alternate, n.consequent, file); }
  });
}
/* the tuner keeps its text as { ka: {…}, en: {…} } dictionaries, and trEn('…') for single words */
(function tuner(dir) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) { tuner(p); continue; }
    if (!f.endsWith('.js')) continue;
    const ast = acorn.parse(fs.readFileSync(p, 'utf8'), { ecmaVersion: 'latest', sourceType: 'module' }), name = 'tuner/' + f;
    const take = v => { if (/^(m7|sus4|dim|7)$/.test(String(v.value))) return; add(v, name); };
    walk.full(ast, n => {
      if (n.type === 'CallExpression' && n.callee.name === 'trEn' && n.arguments[0] && n.arguments[0].type === 'Literal') take(n.arguments[0]);
      if (n.type !== 'ObjectExpression') return;
      const get = k => { const q = n.properties.find(x => x.key && (x.key.name === k || x.key.value === k)); return q && q.value; };
      const ka = get('ka'), en = get('en'); if (!ka || !en) return;
      if (en.type === 'ObjectExpression') walk.full(en, x => { if (x.type === 'Literal' && typeof x.value === 'string') take(x); else if (x.type === 'TemplateLiteral') add(x, name); });
      else if (isStr(en)) take(en);
    });
  }
})(TUNER);
const sorted = m => [...m.keys()].sort();
const out = { exact: sorted(exact), templates: sorted(tmpl) };
if (process.argv.includes('--files')) { const by = {}; for (const m of [exact, tmpl]) for (const [s, fs_] of m) for (const f of fs_) by[f] = (by[f] || 0) + s.length; console.log(by); }
fs.writeFileSync(path.join(__dirname, '..', 'i18n', 'source.json'), JSON.stringify(out, null, 0));
const chars = a => a.reduce((n, s) => n + s.length, 0);
console.log(`exact ${out.exact.length} (${chars(out.exact)} chars) · templates ${out.templates.length} (${chars(out.templates)} chars)`);
