/* Real bundled Basic Pitch inference + UI/transport regression. No mock notes or network API. */
const fs = require('node:fs'), path = require('node:path'), http = require('node:http'), assert = require('node:assert/strict');
const { chromium } = require('playwright');
const root = path.resolve(__dirname, '../../..');
const server = http.createServer((req, res) => {
 const file = path.resolve(root, '.' + decodeURIComponent(req.url.split('?')[0]));
 if (!file.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
 const p = fs.existsSync(file) && fs.statSync(file).isDirectory() ? path.join(file, 'index.html') : file;
 if (!fs.existsSync(p)) { res.writeHead(404).end(); return; }
 res.setHeader('Content-Type', ({'.html':'text/html','.js':'text/javascript','.mjs':'text/javascript','.wasm':'application/wasm','.css':'text/css','.json':'application/json','.mp3':'audio/mpeg'})[path.extname(p)] || 'application/octet-stream'); fs.createReadStream(p).pipe(res);
});
(async () => {
 await new Promise(r => server.listen(0, '127.0.0.1', r)); const origin = 'http://127.0.0.1:' + server.address().port;
 const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--autoplay-policy=no-user-gesture-required','--use-fake-ui-for-media-stream','--use-fake-device-for-media-stream'] });
 try {
 const page = await browser.newPage({ viewport: { width: 1280, height: 900 } }); const errors = []; page.on('pageerror', e => errors.push(e.message));
 await page.addInitScript(() => { localStorage.setItem('pd2:onboarded','true'); localStorage.setItem('pd2:auth.skip','true'); localStorage.setItem('pd2:lang','"en"'); });
 await page.goto(origin + '/panduri/source/dist/app/'); await page.waitForFunction(() => window.PD?.app);
 await page.evaluate(() => { PD.premium.allows = () => true; document.querySelectorAll('.ag,.ob,.cine,.cine-boot').forEach(x => x.remove()); PD.app.go('ai'); });
 const metrics = await page.evaluate(async () => {
  const ctx = new AudioContext({ sampleRate: 22050 }), samples = [];
  for (const f of ['s1-00','s2-00','s3-00','s3-02']) { const raw = await (await fetch('/panduri/app/media/strings/' + f + '.mp3')).arrayBuffer(); const b = await ctx.decodeAudioData(raw); samples.push(b.getChannelData(0)); }
  const results = [];
  for (const bpm of [80,120,160]) {
   const step = 60 / bpm, audio = new Float32Array(Math.ceil((4 * step + .5) * 22050));
   samples.forEach((sample, i) => { const at = Math.round(i * step * 22050); for(let j=0;j<Math.min(sample.length, Math.floor(step*.85*22050));j++) audio[at+j] += sample[j]; });
   const r = await PD.aimus.notesBP(audio, PD.ai.BASE, {}); const expected = [57,61,64,66];
   const hits = expected.filter((m,i) => r.notes.some(n => n.m === m && Math.abs(n.t0 - i*step) < .2)).length;
   results.push({ bpm, hits, notes: r.notes.map(n => ({m:n.m,t0:n.t0,t1:n.t1})) });
   if (bpm === 120) window.fixture = audio;
  }
  const poly = new Float32Array(22050 * 3); samples.slice(0,3).forEach(sample => { for(let j=0;j<Math.min(sample.length,22050);j++) poly[j] += sample[j]/2; });
  const pr = await PD.aimus.notesBP(poly, PD.ai.BASE, {}); results.push({poly:pr.notes.map(n=>n.m)});
  let seed = 4; const noisy = window.fixture.map(x => { seed=(seed*16807)%2147483647; return x*.2 + (seed/2147483647-.5)*.015; });
  const nr = await PD.aimus.notesBP(noisy, PD.ai.BASE, {}); results.push({noisy: nr.notes.length, pitches:nr.notes.map(n=>n.m), confidence:nr.notes.map(n=>n.amp)});
  const silence = await PD.aimus.notesBP(new Float32Array(22050*2), PD.ai.BASE, {}); results.push({silence:silence.notes.length});
  const cancel = PD.aimus.notesBP(window.fixture,PD.ai.BASE,{}); cancel.cancel(); try { await cancel; results.push({cancel:false}); } catch(e) {results.push({cancel:e.name==='AbortError'});}
  await ctx.close(); return results;
 });
 console.log('ML metrics', JSON.stringify(metrics));
 for (const r of metrics.filter(x=>x.bpm)) assert.ok(r.hits >= 3, 'real panduri pitch/onset recall >= 3/4 at '+r.bpm);
 assert.ok([57,61,64].every(m=>metrics.find(x=>x.poly).poly.includes(m)), 'real three-note chord');
 assert.ok([57,61,64,66].every(m=>metrics.find(x=>x.noisy!=null).pitches.includes(m)), 'low-level noisy recording retains the four pitches');
 assert.equal(metrics.find(x=>x.silence!=null).silence,0); assert.equal(metrics.find(x=>x.cancel!=null).cancel,true);
 const samples = await page.evaluate(()=>Array.from(window.fixture));
 const wav=Buffer.alloc(44+samples.length*2); wav.write('RIFF'); wav.writeUInt32LE(wav.length-8,4); wav.write('WAVEfmt ',8); wav.writeUInt32LE(16,16); wav.writeUInt16LE(1,20);wav.writeUInt16LE(1,22);wav.writeUInt32LE(22050,24);wav.writeUInt32LE(44100,28);wav.writeUInt16LE(2,32);wav.writeUInt16LE(16,34);wav.write('data',36);wav.writeUInt32LE(samples.length*2,40);samples.forEach((v,i)=>wav.writeInt16LE(Math.max(-32768,Math.min(32767,Math.round(v*32767))),44+i*2));
 await page.setInputFiles('input[type=file]', { name:'recorded-panduri.wav', mimeType:'audio/wav', buffer:wav });
 await page.waitForSelector('.ai-facts', { timeout:120000 });
 await page.locator('.ai-tabs button[data-k=notation]').click();
 await page.locator('.ai-trhead .btn.primary').click();
 await page.waitForSelector('.as-workspace', { timeout:120000 });
 const notes = await page.evaluate(()=>PD.ai.current.transcription.notes); assert.ok(notes.length>=3); assert.equal(await page.evaluate(()=>PD.ai.current.transcription.engine),'basic-pitch');
 await page.getByRole('button',{name:'Convert to Fanduri Tabs',exact:true}).click();
 await page.getByRole('button',{name:'Generate Fingering',exact:true}).click();
 // Real note selection seeks the same deck clock and paints staff, TAB and neck.
 await page.locator('.as-tab [data-i]').first().click();
 await page.waitForTimeout(100);
 assert.ok(await page.locator('.as-workspace .now').count()>=2);
 await page.locator('.ai-trans .ai-tg').filter({hasText:'Correct'}).click().catch(async()=>{ await page.evaluate(()=>{const b=[...document.querySelectorAll('.ai-trans .ai-tg')].find(x=>x.textContent.includes(PD.i18n.t('tr.edit')));b.click();}); });
 await page.locator('.as-tab [data-i]').first().click(); await page.waitForSelector('.tr-ed');
 const old = await page.evaluate(()=>PD.ai.current.transcription.notes[0].m);
 await page.locator('.tr-ed').getByRole('button',{name:'+1',exact:true}).click();
 assert.equal(await page.evaluate(()=>PD.ai.current.transcription.notes[0].m),old+1);
 await page.getByLabel('Onset (seconds)',{exact:true}).fill('0.15'); await page.getByLabel('Duration (seconds)',{exact:true}).fill('0.25'); await page.locator('.tr-ed').getByRole('button',{name:'Apply',exact:true}).click();
 assert.ok(await page.evaluate(()=>PD.ai.current.transcription.notes.some(n=>n.corrected&&n.t0===.15&&n.t1===.4)));
 await page.getByRole('button',{name:'Make it Fingerstyle',exact:true}).click();
 const clocks = await page.evaluate(async () => {
   const d = PD.ai.current.transport, results = [];
   for (const speed of [.5,.75,1]) {
     d.pause(); await d.setSpeed(speed); d.seek(.2); await d.play(); await new Promise(r=>setTimeout(r,100));
     const a=d.pos(), clock=d.ctx.currentTime; await new Promise(r=>setTimeout(r,250));
     const elapsed=d.ctx.currentTime-clock; const advance=d.pos()-a; d.pause();
     results.push({speed, elapsed, advance, error:Math.abs(advance-elapsed*speed)});
   }
   await d.setSpeed(1); d.setLoop(.3,.7); d.seek(.3); await d.play(); await new Promise(r=>setTimeout(r,700));
   results.push({loop:d.pos()}); d.pause(); const at=d.pos(); await new Promise(r=>setTimeout(r,100)); results.push({pause:d.pos()===at}); d.clearLoop(); d.seek(0);
   return results;
 });
 console.log('Audio clock',JSON.stringify(clocks));
 assert.ok(clocks.filter(x=>x.speed).every(x=>x.error<.025)); assert.ok(clocks.find(x=>x.loop).loop>=.3&&clocks.find(x=>x.loop).loop<.7); assert.ok(clocks.find(x=>'pause' in x).pause);
 await page.getByRole('button',{name:'Listen: panduri version',exact:true}).click();
 await page.waitForFunction(()=>PD.ai.current.transport.D.set.id.startsWith('score-'));
 assert.ok(await page.evaluate(()=>PD.ai.current.transport.D.set.tracks[0].L.some(v=>Math.abs(v)>.001)));
 await page.getByRole('button',{name:'Listen: source audio',exact:true}).click(); await page.evaluate(()=>PD.ai.current.transport.pause());

 for (const viewport of [{width:390,height:844},{width:1280,height:900},{width:1920,height:1080}]) {
  await page.setViewportSize(viewport); await page.waitForTimeout(150);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth+2), 'no page overflow '+viewport.width);
  await page.locator('.as-workspace').scrollIntoViewIfNeeded(); await page.screenshot({path:'/tmp/panduri-score-'+viewport.width+'.png'});
 }
 // Microphone recording and live ML use actual browser MediaRecorder/AudioWorklet with Chromium's fake device.
 await page.setViewportSize({width:1280,height:900});
 await page.evaluate(() => {
   const get=navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
   navigator.mediaDevices.getUserMedia=async constraints=>{const stream=await get(constraints);window.recordedStream=stream;return stream;};
 });
 await page.getByRole('button',{name:'Record microphone',exact:true}).click();
 await page.waitForFunction(()=>document.querySelector('.as-live')?.textContent.includes('Live ML preview'));
 await page.waitForFunction(()=>{const s=document.querySelector('.as-live')?.textContent || '';return s.includes('Live ML preview')&&!s.includes('Waiting for playing');},{},{timeout:30000});
 console.log('Live preview', await page.locator('.as-live').textContent());
 await page.getByRole('button',{name:'Stop recording & analyse',exact:true}).click();
 await page.waitForFunction(()=>window.recordedStream.getTracks().every(t=>t.readyState==='ended'));
 await page.waitForFunction(()=>PD.ai.current?.file.name.startsWith('Panduri-'),{},{timeout:60000});
 assert.ok(!await page.locator('video.ai-video').count(), 'audio/webm recordings are not treated as video');
 // Explicit failure is visible; no DSP fallback is substituted when ML cannot load.
 await page.locator('.ai-tabs button[data-k=notation]').click();
 await page.route('**/bp/nmp.onnx', route=>route.fulfill({status:503,body:'unavailable'}));
 await page.locator('.ai-trhead .btn.primary').click();
 await page.waitForFunction(()=>document.querySelector('.ai-trans').textContent.includes('ML transcription failed'),{},{timeout:60000});
 assert.equal(await page.evaluate(()=>PD.ai.current.transcription),null);
 await page.unroute('**/bp/nmp.onnx');
 assert.deepEqual(errors,[]); console.log('UI passed: upload, transcription, TAB, fingering, seek, edits, arrangements, audio clock at 0.5/0.75/1x, loop, pause, rendered audio, mic/live capture cleanup, explicit model failure, 390/1280/1920 widths');
 } finally { await browser.close(); server.close(); }
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
