#!/usr/bin/env node
// Georgian text in the code with no English twin: it can never reach any other language.
const fs = require('fs'), path = require('path'), acorn = require('acorn'), walk = require('acorn-walk');
const SRC = path.join(__dirname, '..', 'src'), SKIP = new Set(['studio.js', 'authortools.js', 'aiworker.js']);
const KA = /[\u10D0-\u10FF\u1C90-\u1CBF]/; let total = 0;
for (const f of fs.readdirSync(SRC).filter(x => x.endsWith('.js') && !SKIP.has(x))) {
  const code = fs.readFileSync(path.join(SRC, f), 'utf8'), ast = acorn.parse(code, { ecmaVersion: 'latest', locations: true });
  const paired = new Set(), strs = n => { const o = []; walk.full(n, x => { if ((x.type === 'Literal' && typeof x.value === 'string') || x.type === 'TemplateElement') o.push(x); }); return o; };
  const isLit = n => n && (n.type === 'Literal' || n.type === 'TemplateLiteral' || n.type === 'BinaryExpression');
  walk.full(ast, n => {
    if (n.type === 'ArrayExpression') for (let i = 0; i + 1 < n.elements.length; i++) { const a = n.elements[i], b = n.elements[i + 1]; if (isLit(a) && isLit(b)) { strs(a).forEach(x => paired.add(x)); strs(b).forEach(x => paired.add(x)); } }
    if (n.type === 'ObjectExpression' && n.properties.some(p => p.key && (p.key.name === 'en' || p.key.value === 'en'))) strs(n).forEach(x => paired.add(x));
    if (n.type === 'CallExpression') n.arguments.forEach((a, i) => { const b = n.arguments[i + 1]; if (b && ((isLit(a) && isLit(b)) || (a.type === 'ArrayExpression' && b.type === 'ArrayExpression'))) { strs(a).forEach(x => paired.add(x)); strs(b).forEach(x => paired.add(x)); } });
    if (n.type === 'ConditionalExpression') { strs(n.consequent).forEach(x => paired.add(x)); strs(n.alternate).forEach(x => paired.add(x)); }
  });
  walk.full(ast, n => {
    const isS = (n.type === 'Literal' && typeof n.value === 'string') || n.type === 'TemplateElement';
    if (!isS || paired.has(n)) return;
    const v = n.type === 'Literal' ? n.value : n.value.cooked;
    if (KA.test(v) && !/^[ა-ჿ]{1,3}$/.test(v)) { total++; console.log(`${f}:${n.loc.start.line}  ${v.slice(0, 80)}`); }
  });
}
console.log('orphans', total);
