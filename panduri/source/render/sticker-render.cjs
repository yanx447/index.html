// Transparent, seamless 3D loops; pinned Three.js, no dependency shipped to chat.
const fs=require('fs'),path=require('path'),http=require('http'),{chromium}=require('playwright'),{spawnSync}=require('child_process');
const root=path.resolve(__dirname,'..'),output=path.join(root,'assets/stickers');fs.mkdirSync(output,{recursive:true});
const ids=['heart','star','bolt','check','moon','cloud','flower','gift','panduri','headphones','mic','vinyl','cassette','piano','metronome','equalizer'];
const server=http.createServer((req,res)=>{if(req.url==='/favicon.ico'){res.statusCode=204;return res.end();}if(req.url==='/'){res.setHeader('Content-Type','text/html');return res.end('<body style="margin:0"><script type="module" src="/render/sticker-scenes.mjs"></script>');}res.setHeader('Content-Type','text/javascript');res.end(fs.readFileSync(path.join(root,req.url.split('?')[0])));});
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));const b=await chromium.launch({channel:'chrome',args:['--enable-webgl','--ignore-gpu-blocklist']});try{const page=await b.newPage();page.on('pageerror',e=>console.error(e));await page.goto('http://127.0.0.1:'+server.address().port);await page.waitForFunction(()=>window.stickerReady);for(const id of ids){const dir=fs.mkdtempSync('/tmp/panduri-sticker-frames-');for(let frame=0;frame<24;frame++){const png=await page.evaluate(({id,frame})=>window.renderSticker(id,frame,24),{id,frame});fs.writeFileSync(path.join(dir,String(frame).padStart(2,'0')+'.png'),Buffer.from(png,'base64'));}const result=spawnSync('python3',['-c',`from PIL import Image
from pathlib import Path
import sys
frames=[Image.open(p).convert('RGBA') for p in sorted(Path(sys.argv[1]).glob('*.png'))]
frames[0].save(sys.argv[2]+'/'+sys.argv[3]+'-still.webp',quality=86,method=6)
frames[0].save(sys.argv[2]+'/'+sys.argv[3]+'.webp',save_all=True,append_images=frames[1:],duration=100,loop=0,quality=80,method=5,minimize_size=True)
`,dir,output,id],{encoding:'utf8'});if(result.status)throw Error(result.stderr);fs.rmSync(dir,{recursive:true});console.log('Rendered',id,fs.statSync(path.join(output,id+'.webp')).size);}}finally{await b.close();server.close();}})().catch(e=>{console.error(e);server.close();process.exitCode=1});
