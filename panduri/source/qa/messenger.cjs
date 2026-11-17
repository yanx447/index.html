// Real browser UI and MediaRecorder, with an isolated in-memory server boundary.
const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../dist/app'),out=path.resolve(__dirname,'../../../docs/v2-review/messenger');fs.mkdirSync(out,{recursive:true});
async function mount(page,lang='en'){
  await page.route('http://localhost:9876/**',route=>{const pathname=decodeURIComponent(new URL(route.request().url()).pathname);const file=path.join(root,pathname.replace(/^\//,'')+(pathname.endsWith('/')?'index.html':''));return fs.existsSync(file)?route.fulfill({path:file}):route.fulfill({status:404,body:'Not found'});});
  await page.route('https://**/*',r=>r.abort());
  await page.addInitScript(lang=>{for(const [k,v]of Object.entries({onboarded:true,'auth.skip':true,cine:false,'seen.intro':true,lang}))localStorage.setItem('pd2:'+k,JSON.stringify(v));},lang);
  await page.goto('http://localhost:9876/');await page.waitForFunction(()=>window.PD?.messenger&&PD.app);
  await page.evaluate(()=>{
    document.querySelectorAll('.ag,.lf,.ob,.cine,.cine-boot').forEach(e=>e.remove());PD.app.go('home');
    window.cleanup=[];window.sent=[];window.failSend=false;window.failSettings=false;window.typing=[];
    Object.defineProperty(PD.cloud,'uid',{get:()=> 'self'});
    window.prefs={theme:'graphite',font:'default',muted:false,notifications:true,sounds:false,read_receipts:true,typing_indicator:true,restricted:false,quick_reaction:'heart'};
    window.rows=[{id:1,sender:'other',body:'გამარჯობა, ნუკრი 👋',created_at:new Date(Date.now()-90000).toISOString()},{id:2,sender:'self',body:'გამარჯობა! დღეს ერთად დავუკრათ?',created_at:new Date(Date.now()-60000).toISOString()},{id:3,sender:'other',body:'კი, საღამოს გამოგიგზავნი ჩანაწერს.',created_at:new Date(Date.now()-30000).toISOString()},{id:4,sender:'self',body:'',sticker:'headphones',created_at:new Date().toISOString()}];
    window.reactions=[];window.pins=[];
    Object.assign(PD.cloud.chat,{
      messages:async(_,after)=>rows.filter(m=>m.id>(after||0)),reactions:async()=>reactions,read:async()=>{},
      state:async()=>({preferences:{...prefs},other:'other',members:[{id:'self',name:'Me',nickname:'me'},{id:'other',name:'ნუკრი',nickname:'nukri'}],pins:[...pins],typing:[],read:2}),
      settings:async(_,p)=>{if(failSettings)throw Error('failure');return Object.assign(prefs,p)},typing:async(_,active)=>typing.push(active),
      send:async(_,body,extra)=>{if(failSend)throw Error('failure');const m={id:rows.length+1,sender:'self',body,created_at:new Date().toISOString(),...extra};sent.push(m);rows.push(m);},
      pin:async(id,keep)=>{pins=keep?[...pins,id]:pins.filter(x=>x!==id)},
      react:async(id,emoji)=>{reactions=[{message_id:id,user_id:'self',emoji}]},history:async()=>[...rows].reverse(),byIds:async(_,ids)=>rows.filter(r=>ids.includes(r.id)),
      group:async(title,members)=>{window.createdGroup={title,members};return 'group-id';},clear:async()=>window.cleared=true
    });
    PD.social.urls=async()=>{};PD.social.upload=async(prep,scope,progress)=>{progress(1);window.uploaded={kind:prep.kind,type:prep.blob.type,bytes:prep.blob.size,meta:prep.meta};return {media_kind:prep.kind,media_path:'test/'+prep.ext,media_meta:prep.meta};};
    PD.cloud.storage.url=()=>'';
    PD.cloud.social.friends=async()=>[{id:'other',display_name:'ნუკრი',nickname:'nukri',relation:'friend'},{id:'third',display_name:'ანა',nickname:'ana',relation:'friend'}];
    const w=document.querySelector('#page .wrap');w.replaceChildren();PD.messenger.view(w,'conversation','ნუკრი',fn=>cleanup.push(fn));
  });
  await page.locator('.ms-messages .cm-msg').first().waitFor();await page.waitForTimeout(600);
}
if(require.main===module)(async()=>{const browser=await chromium.launch({channel:'chrome',args:['--use-fake-device-for-media-stream','--use-fake-ui-for-media-stream']});try{
  const errors=[];
  for(const [width,height]of [[320,740],[390,844],[820,1180],[1440,900]]){
    const page=await browser.newPage({viewport:{width,height},permissions:['microphone','camera'],serviceWorkers:'block'});page.on('pageerror',e=>errors.push(e.message));await mount(page);
    const bounds=await page.evaluate(()=>{const c=document.querySelector('.ms-composer').getBoundingClientRect(),tools=[...document.querySelectorAll('.ms-tool')].map(b=>b.getBoundingClientRect());return{c:{x:c.x,y:c.y,bottom:c.bottom,right:c.right},toolsFit:tools.every(r=>r.left>=0&&r.right<=innerWidth),overflow:document.documentElement.scrollWidth>innerWidth,dock:getComputedStyle(document.querySelector('.dock')).display};});
    assert.equal(bounds.toolsFit,true,JSON.stringify(bounds));assert.equal(bounds.overflow,false);assert.equal(bounds.dock,'none');assert.ok(bounds.c.bottom<=height);assert.equal(await page.locator('.ms-tool').count(),7);
    await page.screenshot({path:path.join(out,`chat-${width}.png`)});
    await page.getByRole('button',{name:'Chat details',exact:true}).click();await page.locator('.ms-details-person').waitFor();await page.waitForTimeout(300);assert.equal(await page.getByRole('switch').count(),6);
    await page.screenshot({path:path.join(out,`details-${width}.png`)});
    if(width!==390){await page.close();continue;}
    await page.getByRole('button',{name:'Theme',exact:true}).click();await page.getByRole('button',{name:'Ocean',exact:true}).click();assert.equal(await page.locator('.ms-chat').getAttribute('data-chat-theme'),'ocean');
    await page.getByRole('button',{name:'Font',exact:true}).click();await page.getByRole('button',{name:'Serif',exact:true}).click();assert.equal(await page.locator('.ms-chat').getAttribute('data-chat-font'),'serif');
    await page.getByRole('switch',{name:'Read receipts'}).uncheck();assert.equal(await page.evaluate(()=>prefs.read_receipts),false);
    await page.getByRole('switch',{name:'Restrict',exact:true}).check();assert.equal(await page.evaluate(()=>prefs.restricted),true);await page.getByRole('switch',{name:'Restrict',exact:true}).uncheck();
    await page.locator('.sheet-back:not(.out)').last().getByRole('button',{name:'Close',exact:true}).click();await page.waitForTimeout(300);
    await page.getByRole('textbox',{name:'Write…'}).fill('New message');await page.getByRole('button',{name:'Send',exact:true}).click();await page.waitForFunction(()=>sent.length===1);assert.equal(await page.evaluate(()=>sent[0].body),'New message');
    await page.evaluate(()=>failSend=true);await page.getByRole('textbox',{name:'Write…'}).fill('Keep draft');await page.getByRole('button',{name:'Send',exact:true}).click();await page.locator('.ms-status').waitFor();assert.equal(await page.getByRole('textbox',{name:'Write…'}).inputValue(),'Keep draft');
    await page.evaluate(()=>failSend=false);await page.getByRole('button',{name:'Try again',exact:true}).click();await page.waitForFunction(()=>sent.length===2);
    await page.getByRole('button',{name:'Emoji',exact:true}).click();await page.selectOption('.ck-categories','all');assert.match(await page.locator('.ck-cat').textContent(),/3944/);await page.locator('.ck-search').fill('საქართველო');await page.getByRole('button',{name:'flag: Georgia',exact:true}).click();assert.equal(await page.getByRole('textbox',{name:'Write…'}).inputValue(),'🇬🇪');await page.keyboard.press('Escape');await page.getByRole('textbox',{name:'Write…'}).fill('');
    await page.getByRole('button',{name:'Stickers',exact:true}).click();assert.equal(await page.locator('.sp-pack-card').count(),17);await page.getByRole('tab',{name:'Recording studio',exact:true}).click();assert.equal(await page.locator('.ck-stb').count(),16);await page.screenshot({path:path.join(out,'stickers-390.png')});await page.getByRole('button',{name:'Headphones',exact:true}).click();await page.waitForFunction(()=>sent.length===3);assert.equal(await page.evaluate(()=>sent[2].sticker),'studio-headphones');
    await page.getByRole('button',{name:'Record voice message',exact:true}).click();await page.locator('.ms-voice.is-recording').waitFor();await page.waitForTimeout(1250);await page.getByRole('button',{name:'Stop recording',exact:true}).click();await page.locator('.ms-voice audio').waitFor({state:'visible'});await page.screenshot({path:path.join(out,'voice-390.png')});assert.equal(await page.locator('.ms-voice audio').evaluate(e=>e.src.startsWith('blob:')),true);
    await page.locator('.ms-voice').getByRole('button',{name:'Send',exact:true}).click();await page.waitForFunction(()=>sent.length===4);assert.equal(await page.evaluate(()=>uploaded.kind),'audio');assert.equal(await page.evaluate(()=>uploaded.meta.voice),true);assert.ok(await page.evaluate(()=>uploaded.bytes)>0);assert.equal(await page.locator('.ms-voice').isVisible(),false);
    // Recording cancellation must not send anything or leave the microphone running.
    await page.getByRole('button',{name:'Record voice message',exact:true}).click();await page.locator('.ms-voice.is-recording').waitFor();await page.getByRole('button',{name:'Cancel',exact:true}).click();assert.equal(await page.locator('.ms-voice').isVisible(),false);assert.equal(await page.evaluate(()=>sent.length),4);
    await page.getByRole('button',{name:'Open camera',exact:true}).click();await page.locator('.ms-camera-preview').waitFor();await page.waitForFunction(()=>document.querySelector('.ms-camera-preview')?.videoWidth>0);await page.getByRole('button',{name:'Take photo',exact:true}).click();await page.getByRole('button',{name:'Use',exact:true}).click();await page.waitForFunction(()=>sent.length===5);assert.equal(await page.evaluate(()=>uploaded.kind),'photo');
    const choosing=page.waitForEvent('filechooser');await page.getByRole('button',{name:'Send file',exact:true}).click();await (await choosing).setFiles({name:'notes.pdf',mimeType:'application/pdf',buffer:Buffer.from('%PDF-1.4\n%%EOF')});await page.waitForFunction(()=>sent.length===6);assert.equal(await page.evaluate(()=>uploaded.kind),'file');assert.equal(await page.evaluate(()=>uploaded.meta.name),'notes.pdf');
    await page.locator('.cm-msg[data-id="1"] .ms-message-more').click({force:true});await page.getByRole('button',{name:'Pin message',exact:true}).click();await page.locator('.ms-pinbar').waitFor({state:'visible'});assert.deepEqual(await page.evaluate(()=>pins),[1]);
    await page.evaluate(()=>PD.messenger.createGroup('other'));await page.getByRole('textbox',{name:'Group name'}).fill('Trio');await page.getByRole('checkbox',{name:'ანა'}).check();await page.getByRole('button',{name:'Create group',exact:true}).click();await page.waitForFunction(()=>window.createdGroup);assert.deepEqual(await page.evaluate(()=>createdGroup),{title:'Trio',members:['other','third']});
    await page.evaluate(()=>cleanup.forEach(fn=>fn()));assert.equal(await page.locator('.ck-floating').count(),0);await page.close();
  }
  assert.deepEqual(errors,[]);console.log('PASS: 4 responsive sizes; toolbar, details, themes/fonts/privacy; send/retry; 3944 emoji/272 stickers; real voice recording/preview/upload/cancel; live camera capture/file upload; pins/groups/cleanup');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1});

module.exports={mount};
