// Build app first. Run: node qa/ai-studio.cjs (real local Spleeter models).
const path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {chromium}=require('playwright');
const fs=require('fs');
const root=path.resolve(__dirname,'../../..');
const server=http.createServer((req,res)=>{
 const file=path.resolve(root,'.'+decodeURIComponent(req.url.split('?')[0]));
 if(!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
 const target=fs.existsSync(file)&&fs.statSync(file).isDirectory()?path.join(file,'index.html'):file;
 const types={'.js':'text/javascript','.mjs':'text/javascript','.wasm':'application/wasm','.html':'text/html','.css':'text/css','.json':'application/json','.mp3':'audio/mpeg'};
 if(!fs.existsSync(target)){res.writeHead(404);res.end();return;}
 res.setHeader('Content-Length',fs.statSync(target).size);res.setHeader('Content-Type',types[path.extname(target)]||'application/octet-stream');fs.createReadStream(target).pipe(res);
});
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const origin='http://127.0.0.1:'+server.address().port;
 const b=await chromium.launch({channel:'chrome',headless:true});
 try {
 const p=await b.newPage({viewport:{width:390,height:844},userAgent:'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148'}); const errors=[];
 p.on('pageerror',e=>errors.push(e.message));
 await p.goto(origin+'/panduri/app/');
 await p.waitForFunction(()=>window.PD?.app);
 await p.evaluate(()=>{PD.store.set('onboarded',true);PD.store.set('auth.skip',true);PD.store.set('lang','en');document.querySelectorAll('.ag,.ob,.cine,.cine-boot').forEach(x=>x.remove());PD.app.go('ai');});
 await p.waitForSelector('input[type=file]',{state:'attached'});
 await p.setInputFiles('input[type=file]', path.resolve(__dirname,'../../app/media/bani/music.mp3'));
 await p.waitForSelector('.ai-facts',{timeout:120000});
 console.log('upload',await p.evaluate(()=>({duration:PD.ai.current.res.dur,chords:PD.ai.current.res.chords.length,key:PD.ai.current.res.key,body:document.querySelector('.ai-facts').textContent})));
 // Authorize only in this isolated QA page to exercise paid controls.
 await p.evaluate(()=>{PD.premium.allows=()=>true;PD.app.go('ai');});
 await p.setInputFiles('input[type=file]', path.resolve(__dirname,'../../app/media/bani/music.mp3'));
 await p.waitForSelector('.ai-stems .seg',{timeout:120000,state:'attached'});
 console.log('range',await p.locator('.ai-stems .seg').allTextContents());
 const selected=await p.locator('.ai-stems .seg button[aria-pressed=true]').allTextContents();
 if(!selected.some(x=>/whole|მთელი|all/i.test(x))) throw Error('whole song is not default: '+selected);
 await p.screenshot({path:'/tmp/panduri-ai-phone.png',fullPage:true});
 console.log('errors',errors);
 if(errors.length) throw Error(errors.join('\n'));
 // Exercise the real UI pipeline and accompaniment reanalysis on a complete song.
 const sr=44100, n=sr*21, wav=Buffer.alloc(44+n*2);
 wav.write('RIFF');wav.writeUInt32LE(36+n*2,4);wav.write('WAVEfmt ',8);wav.writeUInt32LE(16,16);wav.writeUInt16LE(1,20);wav.writeUInt16LE(1,22);wav.writeUInt32LE(sr,24);wav.writeUInt32LE(sr*2,28);wav.writeUInt16LE(2,32);wav.writeUInt16LE(16,34);wav.write('data',36);wav.writeUInt32LE(n*2,40);
 for(let i=0;i<n;i++) {let v=0;for(const f of [220,277.1826,329.6276]) v+=.12*Math.sin(2*Math.PI*f*i/sr);wav.writeInt16LE(Math.round(v*32767),44+i*2);}
 await p.setInputFiles('input[type=file]',{name:'triad.wav',mimeType:'audio/wav',buffer:wav});
 await p.waitForSelector('.ai-facts',{timeout:120000});
 await p.evaluate(()=>{for(const b of document.querySelectorAll('.ai-stems .seg button'))if(b.textContent.includes('Light'))b.click();document.querySelector('.ai-stems .btn.primary.big').click();});
 await p.waitForFunction(()=>document.querySelector('.ai-mix')||document.querySelector('.ai-msg')?.textContent,{},{timeout:180000});
 const failure=await p.locator('.ai-msg').allTextContents();assert.ok(!failure.some(Boolean),failure.join(' '));
 const st=await p.evaluate(()=>({duration:PD.ai.current.stems.len,tracks:PD.ai.current.stems.tracks.map(t=>t.name)}));
 console.log('UI separated',st);if(st.duration!==21||st.tracks.length!==4)throw Error('UI did not separate the whole song');
 await p.evaluate(()=>[...document.querySelectorAll('.ai-mix button')].find(b=>b.textContent==='Read chords from instruments').click());
 await p.waitForFunction(()=>[...document.querySelectorAll('.ai-mix button')].some(b=>b.textContent==='Read chords from instruments'&&!b.disabled),{},{timeout:120000});
 console.log('UI accompaniment',await p.evaluate(()=>({key:PD.ai.current.res.key,chords:PD.ai.current.res.chords.length})));
 if(errors.length)throw Error(errors.join('\n'));
 const reread=await p.evaluate(()=>PD.ai.current.res.chords);
 assert.ok(reread.every(c=>c.root===9&&c.q===''),'A major must survive separation and reanalysis');
 // Real Spleeter inference, including the long-song chunk boundary.
 const result=await p.evaluate(async(origin)=>{
  const source=await(await fetch('/panduri/source/src/aispl.js')).text();
  const worker=new Worker(URL.createObjectURL(new Blob([source+'\nAISPL();'],{type:'text/javascript'})));
  return await new Promise((resolve,reject)=>{
   const timeout=setTimeout(()=>{worker.terminate();reject(Error('separation timeout'));},600000);
   const sr=44100, len=21*sr;
   const L=new Float32Array(len),R=new Float32Array(len);
   for(let i=0;i<len;i++) {L[i]=.1*Math.sin(2*Math.PI*220*i/sr)+.07*Math.sin(2*Math.PI*330*i/sr);R[i]=L[i];}
   worker.onerror=e=>reject(Error(e.message));
   worker.onmessage=e=>{const m=e.data;
    if(m.type==='ready') worker.postMessage({cmd:'separate',L,R},[L.buffer,R.buffer]);
    else if(m.type==='error'){clearTimeout(timeout);worker.terminate();reject(Error(m.msg));}
    else if(m.type==='done'){
     clearTimeout(timeout);worker.terminate();
     resolve({sources:m.sources,lengths:m.stems.map(s=>s.map(c=>c.length)),finite:m.stems.every(s=>s.every(c=>c.every(Number.isFinite))),tail:m.stems.map(s=>Math.max(...s[0].subarray(len-1000).map(Math.abs)))});
    }
   };
   worker.postMessage({cmd:'load',base:origin+'/panduri/ai/'});
  });
 },origin);
 console.log('real separation',JSON.stringify(result));
 if(!result.finite||result.sources.length!==4||result.lengths.some(s=>s.some(n=>n!==21*44100))) throw Error('invalid stems');
 } finally {await b.close();server.close();}
})().catch(e=>{console.error(e);server.close();process.exitCode=1});
