const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async () => { const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  p.on('pageerror', e => console.log('ERR', e.message));
  await p.goto('http://localhost:8765/panduri-app.html'); await p.waitForTimeout(400);
  await p.evaluate(() => { PD.store.set('onboarded', true); const o = document.querySelector('.ob'); o && o.remove(); });
  for (const [lid, tempo] of [['m1', 1], ['m1', .5], ['c1', 1], ['rhythm-mtiuluri', 1.6], ['rhythm-kazbeguri', .5]]) {
    const r = await p.evaluate(([lid, tempo]) => new Promise(res => {
      PD.engine.setCountIn(false); PD.practice.open(PD.lessons.get(lid), { wait: false, tempo, view: '2d', mode: 'practice', autoplay: true }, lid, 'demo');
      const hw = PD.practice.hw, E = PD.engine, S = E.S, G = PD.geom.g, orig = hw.draw, frames = [];
      let seeked = false, paused = false; const quiet = [];
      hw.draw = dt => { orig(dt); const ps = hw.pose; frames.push({ now: E.visualNow(), t: performance.now(), tips: ps.tips ? ps.tips.map(x => x && { p: x.p.slice(), press: x.press, s: x.s }) : null, rh: ps.rh && ps.rh.slice(), cur: S.cur, playing: S.playing }); };
      const t0 = performance.now();
      const iv = setInterval(() => {
        const el = performance.now() - t0;
        if (!seeked && el > 2200) { seeked = true; E.seek(Math.max(0, Math.floor(S.now) - 2)); quiet.push(performance.now()); }
        if (!paused && el > 3600) { paused = true; quiet.push(performance.now()); E.toggle(); setTimeout(() => { E.toggle(); quiet.push(performance.now()); }, 500); }
        if (el > 6500) { clearInterval(iv); hw.draw = orig; PD.practice.close(true);
          // analysis
          let maxJump = 0, under = 0, contactErr = [], dirOk = 0, dirBad = 0;
          for (let k = 1; k < frames.length; k++) { const a = frames[k - 1], c = frames[k]; if (a.tips && c.tips && !quiet.some(q => c.t > q - 50 && c.t < q + 450)) for (let i = 1; i <= 4; i++) { const d = Math.hypot(c.tips[i].p[0] - a.tips[i].p[0], c.tips[i].p[1] - a.tips[i].p[1], c.tips[i].p[2] - a.tips[i].p[2]); maxJump = Math.max(maxJump, d); if (c.tips[i].p[2] < -.3) under++; } }
          // contact: when a finger is fully pressed, its tip is on the intended string, behind the intended fret
          const steps = S.steps;
          frames.forEach(f => { if (!f.tips || !f.playing) return; const st = steps.find(x => x.t <= f.now && f.now < x.t + x.d * .78); if (!st) return; st.notes.forEach(n => { if (!(n.f > 0 && n.fi)) return; const tp = f.tips[n.fi]; if (tp.press < .999 || quiet.some(q => f.t > q - 50 && f.t < q + 450)) return; const barre = st.notes.filter(m => m.fi === n.fi).length > 1; const u = G.contactU(n.f), v = barre ? G.stringV(1, u) + 4 : G.stringV(n.s, u); contactErr.push(Math.hypot(tp.p[0] - u, tp.p[1] - v, tp.p[2])); }); });
          // right hand: across each stroke the fingertip moves the notated way (ჩაკვრა: +v → −v)
          for (let k = 2; k < frames.length; k++) { const a = frames[k - 2], c = frames[k]; if (!a.rh || !c.rh || !c.playing || quiet.some(q => c.t > q - 50 && c.t < q + 450)) continue; const st = steps.find(s => Math.abs(s.t - c.now) < .03); if (!st) continue; const dv = c.rh[1] - a.rh[1]; if (Math.abs(dv) < .05) continue; if ((st.st === 'down') === (dv < 0)) dirOk++; else dirBad++; }
          contactErr.sort((x, y) => x - y);
          res({ frames: frames.length, maxJumpMm: +maxJump.toFixed(2), belowBoard: under, contacts: contactErr.length, contactMaxMm: contactErr.length ? +contactErr[contactErr.length - 1].toFixed(2) : null, strokeDir: dirOk + ' ok / ' + dirBad + ' wrong' });
        }
      }, 50);
    }), [lid, tempo]);
    console.log(lid, 'tempo', tempo, JSON.stringify(r));
  }
  await b.close(); })();
