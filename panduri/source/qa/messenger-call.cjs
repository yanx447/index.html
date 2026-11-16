const {chromium}=require('playwright'),assert=require('node:assert/strict');
const {mount}=require('./messenger.cjs');
(async()=>{const browser=await chromium.launch({channel:'chrome',args:['--use-fake-device-for-media-stream','--use-fake-ui-for-media-stream','--autoplay-policy=no-user-gesture-required']});try{
 const signals=[],errors=[];let next=1;
 const a=await browser.newPage({viewport:{width:390,height:844},permissions:['microphone','camera'],serviceWorkers:'block'}),b=await browser.newPage({viewport:{width:390,height:844},permissions:['microphone','camera'],serviceWorkers:'block'});
 for(const [p,user]of [[a,'a'],[b,'b']]){
   p.on('pageerror',e=>errors.push(e.message));await mount(p);
   await p.exposeFunction('testSend',async(conv,kind,payload)=>{signals.push({id:next++,conversation_id:conv,sender:user,kind,payload,created_at:new Date().toISOString()});});
   await p.exposeFunction('testSince',async(conv,after)=>signals.filter(s=>s.conversation_id===conv&&s.id>after));
   await p.evaluate(user=>{Object.defineProperty(PD.cloud,'uid',{get:()=>user});const RealPC=RTCPeerConnection;window.RTCPeerConnection=function(...args){const pc=new RealPC(...args);window.testPC=pc;return pc;};PD.cloud.signal.send=window.testSend;PD.cloud.signal.since=window.testSince;},user);
 }
 async function connect(video){
   await a.evaluate(video=>PD.call.start('test-call','ანა',video),video);const ring=signals.findLast(s=>s.kind==='ring');assert.ok(ring);assert.equal(ring.payload.video,video);
   await b.evaluate(r=>PD.call.accept('test-call','ნუკრი',r.id,r.payload.video,r.payload.call),ring);
   for(const p of [a,b])await p.waitForFunction(()=>document.querySelector('.call-st small')?.textContent==='Connected',{},{timeout:20000});
   if(video){for(const p of [a,b])try{await p.waitForFunction(()=>document.querySelector('.call-r')?.videoWidth>0,{},{timeout:8000});}catch(e){console.log(await p.evaluate(async()=>({remote:[...document.querySelectorAll('.call-r')].map(v=>({width:v.videoWidth,paused:v.paused,time:v.currentTime,ready:v.readyState,tracks:v.srcObject?.getTracks().map(t=>({kind:t.kind,state:t.readyState,enabled:t.enabled,muted:t.muted}))})),senders:testPC.getSenders().map(s=>({kind:s.track?.kind,enabled:s.track?.enabled,state:s.track?.readyState})),stats:[...(await testPC.getStats()).values()].filter(s=>['inbound-rtp','outbound-rtp'].includes(s.type))})));throw e;}}
   else assert.equal(await a.locator('.call-l').evaluate(v=>v.srcObject.getVideoTracks().length),0);
 }
 await connect(true);await a.getByRole('button',{name:'Mute microphone',exact:true}).click();assert.equal(await a.locator('.call-l').evaluate(v=>v.srcObject.getAudioTracks()[0].enabled),false);await a.getByRole('button',{name:'Unmute microphone',exact:true}).click();
 await a.getByRole('button',{name:'Turn camera off',exact:true}).click();assert.equal(await a.locator('.call-l').evaluate(v=>v.srcObject.getVideoTracks()[0].enabled),false);await a.getByRole('button',{name:'Turn camera on',exact:true}).click();
 await a.screenshot({path:require('node:path').resolve(__dirname,'../../../docs/v2-review/messenger/call-390.png')});
 await a.getByRole('button',{name:'Hang up',exact:true}).click();for(const p of [a,b])await p.waitForFunction(()=>!PD.call.active);await b.waitForTimeout(1300);assert.equal(await a.locator('.call').count(),0);assert.equal(await b.locator('.call').count(),0);
 await connect(false);await a.getByRole('button',{name:'Turn camera on',exact:true}).click();await a.waitForFunction(()=>document.querySelector('.call-l').srcObject.getVideoTracks().length===1);await b.waitForFunction(()=>document.querySelector('.call-r').videoWidth>0);
 await b.getByRole('button',{name:'Hang up',exact:true}).click();for(const p of [a,b])await p.waitForFunction(()=>!PD.call.active);await a.waitForTimeout(1300);
 // Cancel while permission/media acquisition is pending; tracks must be stopped on arrival.
 await a.evaluate(()=>{window.getMedia=navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);navigator.mediaDevices.getUserMedia=async opts=>{await new Promise(r=>setTimeout(r,400));window.lateStream=await getMedia(opts);return lateStream;};PD.call.start('cancel-call','Test',true);});
 await a.getByRole('button',{name:'Hang up',exact:true}).waitFor();await a.getByRole('button',{name:'Hang up',exact:true}).click();await a.waitForFunction(()=>window.lateStream);assert.equal(await a.evaluate(()=>lateStream.getTracks().every(t=>t.readyState==='ended')),true);
 assert.deepEqual(errors,[]);console.log('PASS: real two-peer video/audio WebRTC; connected media; mic/camera toggles; audio-to-video upgrade; end propagation; pending-media cancellation');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1});
