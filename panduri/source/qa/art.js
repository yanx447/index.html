const { chromium } = require('/opt/node-tools/node_modules/playwright');
const fs = require('fs');
(async () => {
  const src = fs.readFileSync('/home/claude/pd/src/notesart.js', 'utf8');
  const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 700, height: 900 }, deviceScaleFactor: 2 })).newPage();
  await p.setContent('<body style="background:#22160E;margin:10px;color:#fff"><div id=o></div></body>');
  await p.addScriptTag({ content: 'window.PD={esc:s=>String(s)};' + src });
  await p.evaluate(() => {
    const A = PD.notesArt, o = document.getElementById('o');
    o.innerHTML = A.staff([{ l: 'A', o: 3, label: 'A3' }, { l: 'C', o: 4, acc: '♯', label: 'C♯4' }, { l: 'E', o: 4, label: 'E4' }, { l: 'G', o: 4, d: 'h', label: 'G4' }, { l: 'B', o: 4, d: 'e', label: 'B4' }, { l: 'D', o: 5, d: 's', label: 'D5' }, { l: 'F', o: 5, d: 'w', label: 'F5' }, { l: 'A', o: 5, d: 'q', dot: 1, label: 'A5' }], { width: 640 })
      + A.staff([{ rest: 'w', label: 'w' }, { rest: 'h', label: 'h' }, { rest: 'q', label: 'q' }, { rest: 'e', label: 'e' }, { rest: 's', label: 's' }], { width: 400, time: [6, 8] })
      + '<div style="display:flex;gap:6px">' + ['w', 'h', 'q', 'e', 's'].map(d => A.symbol('note', d)).join('') + ['w', 'h', 'q', 'e', 's'].map(d => A.symbol('rest', d)).join('') + '</div>'
      + A.keyboard({ hi: ['C', 'E', 'G'] }) + A.staff([{ l: 'F', o: 3, label: 'F3' }, { l: 'A', o: 3, label: 'A3' }, { l: 'C', o: 4, label: 'C4' }], { clef: 'bass', width: 260 });
    document.querySelectorAll('svg').forEach(s => { if (!s.style.width) s.style.width = (s.viewBox.baseVal.width) + 'px'; });
  });
  await p.screenshot({ path: '/tmp/claude-0/-home-claude-index-html/d17ed486-e6cb-5d9f-80bb-ed664a9aab9c/scratchpad/art.png', fullPage: true });
  await b.close();
})();
