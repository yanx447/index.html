const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async () => { const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 1280, height: 800 } });
  await ctx.route(/fonts\.(googleapis|gstatic)\.com/, r => r.fulfill({ status: 200, contentType: 'text/css', body: "@font-face{font-family:'Noto Serif Georgian';src:local('DejaVu Serif');font-weight:600 700}@font-face{font-family:'Noto Sans Georgian';src:local('DejaVu Sans')}" }));
  const p = await ctx.newPage(); await p.goto('http://localhost:8765/app/'); await p.waitForTimeout(2000);
  await p.evaluate(() => { localStorage.clear(); PD.store.set('onboarded', true); PD.store.set('auth.skip', true); document.querySelector('.ag')?.remove(); document.querySelector('.ob')?.remove(); PD.app.go('learn'); });
  await p.waitForTimeout(900); await p.screenshot({ path: '/tmp/claude-0/-home-claude/d17ed486-e6cb-5d9f-80bb-ed664a9aab9c/scratchpad/ui/desk-learn.png' });
  await b.close(); })();
