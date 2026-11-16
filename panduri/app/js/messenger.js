/* Conversation UI. All permissions are requested by an explicit record/camera/call action. */
PD.i18n.add({
  'ms.details':['ჩათის პარამეტრები','Chat details'], 'ms.personalize':['გარეგნობა','Personalize'],
  'ms.theme':['თემა','Theme'], 'ms.font':['შრიფტი','Font'], 'ms.graphite':['გრაფიტი','Graphite'], 'ms.sand':['ქვიშა','Sand'], 'ms.ocean':['ოკეანე','Ocean'], 'ms.plum':['ქლიავი','Plum'],
  'ms.default':['სტანდარტული','Default'], 'ms.serif':['სერიფი','Serif'], 'ms.mono':['მონო','Mono'],
  'ms.shared':['მედია, ბმულები და ფაილები','Media, links and files'], 'ms.media':['მედია','Media'], 'ms.links':['ბმულები','Links'], 'ms.files':['ფაილები','Files'],
  'ms.mute':['ჩათის დადუმება','Mute chat'], 'ms.notifications':['შეტყობინებები','Notifications'], 'ms.sounds':['ჩათში შეტყობინების ხმა','In-chat message sound'],
  'ms.privacy':['კონფიდენციალურობა','Privacy'], 'ms.receipts':['წაკითხვის დასტური','Read receipts'], 'ms.typing':['წერის ინდიკატორი','Typing indicator'],
  'ms.typingNow':['წერს…','Typing…'], 'ms.group':['ჯგუფის შექმნა','Create group'], 'ms.groupName':['ჯგუფის სახელი','Group name'], 'ms.groupHint':['აირჩიე 2–31 მეგობარი.','Choose 2–31 friends.'],
  'ms.pins':['მიმაგრებული შეტყობინებები','Pinned messages'], 'ms.pin':['მიმაგრება','Pin message'], 'ms.unpin':['მოხსნა','Unpin message'],
  'ms.share':['კონტაქტის გაზიარება','Share contact'], 'ms.contact':['კონტაქტი: {n}','Contact: {n}'],
  'ms.restrict':['შეზღუდვა','Restrict'], 'ms.restricted':['შეზღუდული ჩათები','Restricted chats'],
  'ms.restrictHint':['შეზღუდული ჩათი ცალკე ინახება: ზარები, შეტყობინებები და შენი აქტივობა დამალულია.','Restricted chats are kept separately: calls, notifications and your activity are hidden.'],
  'ms.delete':['ჩათის წაშლა ჩემთვის','Delete chat for me'], 'ms.deleteQ':['წაიშალოს მიმოწერა შენთვის? თანამოსაუბრეს თავისი ასლი დარჩება. ახალი შეტყობინება ჩათს ისევ გამოაჩენს.','Delete this conversation for you? Others keep their copy. A new message brings the chat back.'],
  'ms.quick':['სწრაფი რეაქცია','Quick reaction'], 'ms.quickHint':['შეტყობინებაზე ორჯერ შეხებით','Double-tap a message'],
  'ms.record':['ხმოვანის ჩაწერა','Record voice message'], 'ms.recording':['იწერება','Recording'], 'ms.stop':['ჩაწერის დასრულება','Stop recording'], 'ms.cancel':['გაუქმება','Cancel'],
  'ms.voice':['ხმოვანი შეტყობინება','Voice message'], 'ms.preview':['მოუსმინე გაგზავნამდე','Listen before sending'], 'ms.micUnavailable':['ამ მოწყობილობაზე ხმოვანის ჩაწერა მიუწვდომელია.','Voice recording is unavailable on this device.'],
  'ms.camera':['კამერის გახსნა','Open camera'], 'ms.photo':['ფოტოს გადაღება','Take photo'], 'ms.video':['ვიდეოს ჩაწერა','Record video'], 'ms.use':['გამოყენება','Use'],
  'ms.file':['ფაილის გაგზავნა','Send file'], 'ms.fileLimit':['აირჩიე PDF, დოკუმენტი, ტექსტი ან ZIP, მაქსიმუმ 50 MB.','Choose a PDF, document, text or ZIP up to 50 MB.'],
  'ms.loading':['იტვირთება…','Loading…'], 'ms.retry':['ხელახლა ცდა','Try again'], 'ms.older':['ძველი შეტყობინებები','Older messages'], 'ms.empty':['აქ დაიწყება თქვენი საუბარი','Your conversation starts here'],
  'ms.sent':['გაგზავნილია','Sent'], 'ms.read':['წაკითხულია','Read'], 'ms.today':['დღეს','Today'], 'ms.members':['{n} მონაწილე','{n} members'], 'ms.conversation':['პირადი მიმოწერა','Direct conversation'],
  'ms.noItems':['ჯერ არაფერია','Nothing here yet'], 'ms.saved':['შენახულია','Saved'], 'ms.copy':['კოპირება','Copy'], 'ms.copied':['დაკოპირებულია','Copied'],
  'ms.cameraError':['კამერის გახსნა ვერ მოხერხდა. შეამოწმე კამერის ნებართვა.','Could not open the camera. Check camera permission.'],
  'ms.voiceShort':['ჩაწერე მინიმუმ ერთი წამი.','Record at least one second.'], 'ms.uploading':['იგზავნება…','Sending…'],
  'cl.unavailable':['ამ მოწყობილობაზე ზარი მიუწვდომელია.','Calls are unavailable on this device.'],
  'cl.play':['ზარის ხმის ჩართვა','Enable call audio'],
  'cl.audio':['აუდიო ზარი','Audio call'], 'cl.flip':['კამერის შეცვლა','Switch camera'], 'cl.fullscreen':['მთელ ეკრანზე','Full screen'],
  'cl.unmute':['მიკროფონის ჩართვა','Unmute microphone'], 'cl.muteAction':['მიკროფონის გამორთვა','Mute microphone'], 'cl.camOn':['კამერის ჩართვა','Turn camera on'], 'cl.camOff':['კამერის გამორთვა','Turn camera off'],
  'cl.permission':['ზარისთვის მიკროფონის ან კამერის ნებართვაა საჭირო.','Allow microphone or camera access to make a call.']
});
PD.messenger = (() => {
  const h=PD.h, C=PD.cloud, ic=PD.ic;
  const svg=d=>'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+d+'</svg>';
  const icons={
    emoji:svg('<circle cx="12" cy="12" r="9"/><path d="M8 14s1 3 4 3 4-3 4-3M8 9h.01M16 9h.01"/>'),
    sticker:svg('<path d="M14 21H6a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v8Zm0 0v-5a2 2 0 0 1 2-2h5M7 8h.01M14 8h.01M8 12q3 3 6 0"/>'),
    camera:svg('<path d="M8 5l2-2h4l2 2h4a2 2 0 0 1 2 2v12H2V7a2 2 0 0 1 2-2Z"/><circle cx="12" cy="12" r="4"/>'),
    file:svg('<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Zm0 0v6h6M8 13h8M8 17h5"/>'),
    phone:svg('<path d="m8 3 3 5-3 3c2 3 3 4 6 5l3-3 4 3c0 4-2 5-4 5C10 20 4 14 3 7c0-2 1-4 5-4Z"/>'),
    more:svg('<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>'),
    pin:svg('<path d="m8 3 8 0-1 6 4 4H5l4-4Zm4 10v8"/>'),
    link:svg('<path d="m10 13 4-4M8 16l-1 1a4 4 0 0 1-6-6l5-5a4 4 0 0 1 6 0m0 12a4 4 0 0 0 6 0l5-5a4 4 0 0 0-6-6l-1 1"/>'),
    bell:svg('<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>'),
    group:svg('<circle cx="9" cy="7" r="4"/><path d="M2 21v-3a7 7 0 0 1 14 0v3M17 4a4 4 0 0 1 0 8m2 4a5 5 0 0 1 3 5"/>'),
    shield:svg('<path d="m12 2 9 4v6c0 6-9 10-9 10S3 18 3 12V6Z"/>'),
    trash:svg('<path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7"/>'),
    check:svg('<path d="m4 12 5 5L20 6"/>'),
    flip:svg('<path d="M3 8h15l-4-4m7 12H6l4 4M3 8v8m18-8v8"/>'),
    full:svg('<path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/>')
  };
  const defaults={theme:'graphite',font:'default',muted:false,notifications:true,sounds:true,read_receipts:true,typing_indicator:true,restricted:false,quick_reaction:'heart'};
  const stamp=seconds=>Math.floor(seconds/60)+':'+String(Math.floor(seconds%60)).padStart(2,'0');
  const err=e=>PD.community.util.err(e);
  const button=(key,html,onclick,cls='')=>h('button',{type:'button',class:'ms-icon '+cls,'aria-label':t(key),title:t(key),html,onclick});
  const safeLinks=text=>[...new Set((text||'').match(/https?:\/\/[^\s<>]+/g)||[])].map(x=>x.replace(/[.,!?;:)]+$/,''));
  function textBody(text){
    const p=h('p'); let pos=0;
    for(const m of text.matchAll(/https?:\/\/[^\s<>]+/g)){p.append(document.createTextNode(text.slice(pos,m.index)));const url=m[0].replace(/[.,!?;:)]+$/,'');p.append(h('a',{href:url,target:'_blank',rel:'noopener noreferrer',text:url}),document.createTextNode(m[0].slice(url.length)));pos=m.index+m[0].length;}
    p.append(document.createTextNode(text.slice(pos)));return p;
  }
  function view(w,id,name,own){
    w.replaceChildren(); w.classList.add('ms-chat'); document.documentElement.classList.add('chat-on');
    let alive=true,sending=false,polling=false,stateBusy=false,ready=false,state=null,prefs={...defaults,...PD.store.get('chat.'+C.uid+'.'+id,{})},last=0,first=0,rxs=[],typingTimer=0,lastTyped=0,day=null;
    const nodes=new Map(),tools=[],sheets=new Set();
    const sheet=build=>{let close;close=PD.ui.sheet(build,{onClose:()=>sheets.delete(close)});sheets.add(close);return close;};
    const msgs=h('div',{class:'cm-msgs ms-messages',role:'log','aria-label':t('cm.chats'),'aria-live':'polite'});
    const info=h('small',{class:'ms-presence',text:t('ms.conversation')});
    const title=h('button',{class:'ms-title',onclick:details},[h('b',{text:name||'—'}),info]);
    const avatar=h('span',{class:'ms-avatar',text:[...(name||'?')][0]});
    const audioCall=button('cl.audio',icons.phone,()=>call(false)),videoCall=button('cl.video',ic.video,()=>call(true));
    const head=h('div',{class:'cm-head ms-head'},[button('back',ic.back,()=>PD.app.back('community')),avatar,title,audioCall,videoCall,button('ms.details',icons.more,details)]);
    const older=h('button',{class:'ms-older',text:t('ms.older'),hidden:true,onclick:loadOlder});
    const empty=h('div',{class:'ms-empty',text:t('ms.loading')}); msgs.append(older,empty);
    const pinbar=h('button',{class:'ms-pinbar',hidden:true,onclick:()=>library('pins')});
    const inp=h('textarea',{class:'cm-in',rows:1,maxlength:4000,placeholder:t('cm.type'),'aria-label':t('cm.type')});
    const upload=h('div',{class:'fd-upbar',hidden:true},[h('i')]);
    const voiceBox=h('div',{class:'ms-voice',hidden:true,'aria-live':'polite'});
    const voice=recorder(voiceBox,file=>sendFile(file,{voice:true,dur:voice.duration}),()=>alive&&!sending);
    const mic=button('ms.record',ic.mic,()=>{kit.close();voice.start();},'ms-mic');
    const sendBtn=button('cm.send',ic.send,send,'ms-send');sendBtn.hidden=true;
    const kit=PD.chatkit.panel({input:inp,onSticker:st=>sendExtra({sticker:st}),onGif:g=>sendExtra({gif:g.url,media_meta:{w:g.w,h:g.h}})});
    const tool=(key,icon,fn)=>{const b=button(key,icon,()=>{if(!voice.active&&!sending)fn();},'ck-toggle ms-tool');tools.push(b);return b;};
    const gif=tool('ck.gif','<span class="ms-gif-label">GIF</span>',()=>kit.toggle('gif'));
    const toolbar=h('div',{class:'ms-tools',role:'toolbar','aria-label':t('ck.attach')},[
      tool('ck.emoji',icons.emoji,()=>kit.toggle('emoji')),tool('ck.stickers',icons.sticker,()=>kit.toggle('stickers')),gif,
      tool('ck.audio',PD.social.IC.music,()=>attach(PD.social.ACCEPT.audio)),tool('ck.media',PD.social.IC.photo,()=>attach('image/*,video/*')),
      tool('ms.camera',icons.camera,()=>sheets.add(camera(file=>sendFile(file)))),tool('ms.file',icons.file,()=>attach('.pdf,.txt,.csv,.zip,.doc,.docx,.xls,.xlsx,.ppt,.pptx'))
    ]);
    const composer=h('div',{class:'ms-composer'},[voiceBox,h('div',{class:'cm-bar ms-entry'},[inp,mic,sendBtn]),toolbar]);
    const status=h('div',{class:'ms-status',role:'status',hidden:true});
    w.append(head,pinbar,msgs,status,upload,composer);
    function appearance(){w.dataset.chatTheme=prefs.theme;w.dataset.chatFont=prefs.font;PD.store.set('chat.'+C.uid+'.'+id,prefs);}
    appearance();
    function syncInput(){inp.style.height='auto';inp.style.height=Math.min(128,Math.max(42,inp.scrollHeight))+'px';sendBtn.hidden=!inp.value.trim();mic.hidden=!!inp.value.trim();}
    inp.addEventListener('input',()=>{syncInput();if(prefs.typing_indicator&&!prefs.restricted&&Date.now()-lastTyped>2500){lastTyped=Date.now();C.chat.typing(id,true).catch(()=>{});}clearTimeout(typingTimer);typingTimer=setTimeout(()=>C.chat.typing(id,false).catch(()=>{}),3000);});
    inp.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey&&!e.isComposing&&!PD.isTouch()){e.preventDefault();send();}});
    function setBusy(on){sending=on;sendBtn.disabled=on;mic.disabled=on;inp.disabled=on;tools.forEach(b=>b.disabled=on);composer.classList.toggle('is-sending',on);}
    function showError(e,retry){status.replaceChildren(h('span',{text:err(e)}),...(retry?[h('button',{class:'btn small',text:t('ms.retry'),onclick:()=>{status.hidden=true;retry();}})]:[]));status.hidden=false;}
    async function send(){const value=inp.value.trim();if(!value||sending||voice.active)return;setBusy(true);kit.close();try{await C.chat.send(id,value);inp.value='';syncInput();C.chat.typing(id,false).catch(()=>{});await poll();msgs.scrollTop=msgs.scrollHeight;}catch(e){showError(e,send);}finally{if(alive){setBusy(false);inp.focus();}}}
    async function sendExtra(extra){if(sending||voice.active)return;setBusy(true);try{await C.chat.send(id,'',extra);await poll();msgs.scrollTop=msgs.scrollHeight;}catch(e){showError(e,()=>sendExtra(extra));}finally{if(alive)setBusy(false);}}
    async function attach(accept){kit.close();const file=await PD.ui.pickFile(accept);if(file&&alive)sendFile(file);}
    async function sendFile(file,meta={}){
      if(sending||!alive)return false;setBusy(true);kit.close();upload.hidden=false;
      const draft=inp.value.trim();
      try{
        let prep;
        if(!/^(image|video|audio)\//.test(file.type)&&/\.(pdf|txt|csv|zip|docx?|xlsx?|pptx?)$/i.test(file.name)){
          if(file.size>50*1048576)throw Object.assign(new Error('tooBig'),{code:'tooBig',n:50});
          prep={kind:'file',blob:file,ext:file.name.split('.').pop().toLowerCase(),meta:{name:file.name.slice(0,180),size:file.size}};
        }else prep=await PD.social.prepare(file,'any',{dur:meta.dur});
        prep.meta={...prep.meta,...meta};
        const media=await PD.social.upload(prep,'c',n=>{if(alive)upload.firstChild.style.width=Math.round(n*100)+'%';});
        if(!alive)return false;
        await C.chat.send(id,draft,media);inp.value='';syncInput();await poll();msgs.scrollTop=msgs.scrollHeight;return true;
      }catch(e){if(alive){status.replaceChildren(h('span',{text:PD.social.fileErr(e)}),...(!meta.voice?[h('button',{class:'btn small',text:t('ms.retry'),onclick:()=>{status.hidden=true;sendFile(file,meta);}})]:[]));status.hidden=false;}return false;}
      finally{if(alive){setBusy(false);upload.hidden=true;}}
    }
    function sound(){if(!prefs.sounds||prefs.muted||!prefs.notifications||prefs.restricted||document.hidden)return;try{const ac=new(window.AudioContext||window.webkitAudioContext)(),o=ac.createOscillator(),g=ac.createGain();o.frequency.value=660;g.gain.setValueAtTime(.025,ac.currentTime);g.gain.exponentialRampToValueAtTime(.001,ac.currentTime+.15);o.connect(g).connect(ac.destination);o.start();o.stop(ac.currentTime+.16);o.onended=()=>ac.close();}catch(_){} }
    function paintRx(){for(const n of nodes.values()){const by={};const rows=rxs.filter(r=>String(r.message_id)===String(n.m.id));rows.forEach(r=>by[r.emoji]=(by[r.emoji]||0)+1);n.rx.innerHTML=Object.entries(by).map(([k,n])=>PD.social.glyph(k)+(n>1?'<b>'+n+'</b>':'')).join('');n.rx.hidden=!rows.length;n.reaction=rows.find(r=>r.user_id===C.uid)?.emoji||null;}}
    async function react(n,k){try{await C.chat.react(n.m.id,k);rxs=await C.chat.reactions(id)||[];if(alive)paintRx();}catch(e){if(alive)showError(e);}}
    function messageMenu(n){sheet((b,close)=>{b.classList.add('ms-sheet');b.append(h('h2',{text:t('cm.react')}),h('div',{class:'ms-reactions'},PD.social.REACTS.map(k=>button('fd.rx.'+k,PD.social.glyph(k),()=>{close();react(n,n.reaction===k?null:k);}))),h('div',{class:'ms-setting-list'},[
      action(state?.pins?.includes(n.m.id)?'ms.unpin':'ms.pin',icons.pin,async()=>{try{await C.chat.pin(n.m.id,!state?.pins?.includes(n.m.id));close();await refreshState();}catch(e){PD.ui.toast(err(e));}}),
      ...(n.m.body?[action('ms.copy',icons.file,async()=>{try{await navigator.clipboard.writeText(n.m.body);PD.ui.toast(t('ms.copied'));close();}catch(e){PD.ui.toast(err(e));}})]:[]),
      ...(n.m.sender!==C.uid?[action('md.report',icons.shield,()=>{close();PD.community.util.reportSheet('message',n.m.id);})]:[])
    ]));});}
    function bubble(m){
      const mine=m.sender===C.uid,kids=[];
      if(state?.group_name&&!mine){const member=state.members?.find(x=>x.id===m.sender);kids.push(h('b',{class:'ms-sender',text:member?.name||'—'}));}
      if(m.media_path){if(m.media_kind==='file'){const url=C.storage.url(m.media_path);kids.push(url?h('a',{class:'ms-file',href:url,target:'_blank',rel:'noopener noreferrer',download:m.media_meta?.name||'',html:icons.file},[h('span',{text:m.media_meta?.name||t('ms.file')}),h('small',{text:Math.ceil((m.media_meta?.size||0)/1024)+' KB'})]):h('p',{text:t('fd.mediaBlocked')}));}else{if(m.media_meta?.voice)kids.push(h('small',{class:'ms-voice-label',text:t('ms.voice')}));kids.push(PD.social.mediaEl(m));}}
      if(m.sticker)kids.push(PD.chatkit.sticker(m.sticker));
      if(m.gif)kids.push(h('img',{class:'md-img',src:m.gif,alt:'GIF',loading:'lazy'}));
      if(m.post_ref)kids.push(PD.social.postCard(m.post_ref));
      if(m.body)kids.push(textBody(m.body));
      const rx=h('div',{class:'cm-rx',hidden:true}),receipt=h('span',{class:'ms-receipt','aria-label':t('ms.sent'),text:'✓'});
      const meta=h('div',{class:'ms-meta'},[h('time',{datetime:m.created_at,text:new Date(m.created_at).toLocaleTimeString(PD.i18n.locale,{hour:'2-digit',minute:'2-digit'})}),...(mine?[receipt]:[])]);
      const el=h('div',{class:'cm-msg'+(mine?' me':'')+(m.sticker?' is-sticker':'')+(PD.chatkit.isEmojiMessage(m.body)?' is-emoji':'')+(m.media_path||m.gif||m.post_ref?' has-media':''),'data-id':m.id},[...kids,rx,meta]);
      const n={m,el,rx,receipt,reaction:null};nodes.set(m.id,n);
      el.append(button('md.more',icons.more,()=>messageMenu(n),'ms-message-more'));
      let hold=0,start=null;
      el.addEventListener('pointerdown',e=>{if(e.target.closest('button,a,video,audio,[role=button]'))return;start={x:e.clientX,y:e.clientY};hold=setTimeout(()=>messageMenu(n),500);});
      ['pointerup','pointercancel','pointerleave'].forEach(k=>el.addEventListener(k,()=>clearTimeout(hold)));
      el.addEventListener('pointermove',e=>{if(start&&Math.hypot(e.clientX-start.x,e.clientY-start.y)>8)clearTimeout(hold);});
      el.addEventListener('contextmenu',e=>{if(e.target.closest('a,video,audio'))return;e.preventDefault();clearTimeout(hold);messageMenu(n);});
      el.addEventListener('dblclick',e=>{if(e.target.closest('button,a,video,audio,[role=button]'))return;clearTimeout(hold);react(n,n.reaction===prefs.quick_reaction?null:prefs.quick_reaction);});
      return el;
    }
    function dateLabel(iso){return new Date(iso).toLocaleDateString(PD.i18n.locale,{month:'short',day:'numeric'});}
    function appendRows(rows){for(const m of rows){last=Math.max(last,Number(m.id));if(nodes.has(m.id))continue;const d=dateLabel(m.created_at);if(d!==day){msgs.append(h('div',{class:'ms-day',text:d}));day=d;}msgs.append(bubble(m));first=first?Math.min(first,Number(m.id)):Number(m.id);}}
    async function poll(){if(polling||!alive)return;polling=true;try{
      const rows=await C.chat.messages(id,last)||[];if(!alive)return;
      if(rows.some(m=>m.media_path))await PD.social.urls(rows.filter(m=>m.media_path));if(!alive)return;
      const bottom=msgs.scrollHeight-msgs.scrollTop-msgs.clientHeight<100,wasReady=ready;
      appendRows(rows);ready=true;empty.hidden=nodes.size>0;empty.textContent=t('ms.empty');older.hidden=nodes.size<200&&older.hidden;
      rxs=await C.chat.reactions(id).catch(()=>rxs)||[];if(!alive)return;paintRx();
      if(rows.length&&(bottom||!wasReady||rows.some(m=>m.sender===C.uid))){msgs.scrollTop=msgs.scrollHeight;rows.forEach(m=>nodes.get(m.id)?.el.querySelectorAll('img').forEach(i=>i.addEventListener('load',()=>{if(alive&&msgs.scrollHeight-msgs.scrollTop-msgs.clientHeight<400)msgs.scrollTop=msgs.scrollHeight;},{once:true})));}
      if(wasReady&&rows.some(m=>m.sender!==C.uid))sound();
      if(!document.hidden&&msgs.scrollHeight-msgs.scrollTop-msgs.clientHeight<100){await C.chat.read(id).catch(()=>{});PD.notify.readTag?.(['c:'+id,'cr:'+id]);}await refreshState();
    }catch(e){if(alive&&!ready){empty.textContent=err(e);showError(e,poll);}}finally{polling=false;}}
    async function loadOlder(){older.disabled=true;try{const rows=await C.chat.history(id,first);if(!alive)return;await PD.social.urls(rows);if(!alive)return;const height=msgs.scrollHeight,frag=document.createDocumentFragment();for(const m of [...rows].reverse()){if(nodes.has(m.id))continue;frag.append(bubble(m));first=Math.min(first,Number(m.id));}older.after(frag);msgs.scrollTop+=msgs.scrollHeight-height;older.hidden=rows.length<100;paintRx();}catch(e){showError(e,loadOlder);}finally{older.disabled=false;}}
    async function refreshState(){if(stateBusy||!alive)return;stateBusy=true;try{const s=await C.chat.state(id);if(!alive)return;state=s;prefs={...defaults,...s.preferences};appearance();
      audioCall.hidden=videoCall.hidden=!!s.group_name;audioCall.disabled=videoCall.disabled=!!prefs.restricted;
      info.textContent=s.typing?.length?t('ms.typingNow'):s.group_name?t('ms.members',{n:s.members?.length||0}):t('ms.conversation');info.classList.toggle('is-typing',!!s.typing?.length);
      const other=s.members?.find(m=>m.id===s.other);if(other?.avatar){avatar.replaceChildren(h('img',{src:other.avatar,alt:''}));}
      for(const n of nodes.values()){const read=prefs.read_receipts&&n.m.id<=s.read;n.receipt.textContent=read?'✓✓':'✓';n.receipt.classList.toggle('is-read',read);n.receipt.setAttribute('aria-label',t(read?'ms.read':'ms.sent'));}
      pinbar.hidden=!s.pins?.length;pinbar.innerHTML=icons.pin+'<span>'+PD.esc(t('ms.pins'))+' · '+(s.pins?.length||0)+'</span>';
    }catch(_){}finally{stateBusy=false;}}
    function call(video){if(voice.active)return;PD.premium.require('call',()=>PD.call.start(id,name,video));}
    async function update(patch){try{const saved=await C.chat.settings(id,patch);if(!alive)return false;prefs={...defaults,...saved};appearance();await refreshState();return true;}catch(e){PD.ui.toast(err(e));return false;}}
    function action(key,icon,fn,cls=''){return h('button',{class:'ms-setting '+cls,type:'button',onclick:fn},[h('span',{class:'ms-setting-icon',html:icon}),h('span',{text:t(key)}),h('span',{class:'ms-chevron',text:'›','aria-hidden':'true'})]);}
    function toggle(key,prop,hint){const input=h('input',{type:'checkbox',role:'switch','aria-label':t(key),checked:!!prefs[prop]});input.checked=!!prefs[prop];input.onchange=async()=>{const before=!input.checked;input.disabled=true;if(!await update({[prop]:input.checked}))input.checked=before;input.disabled=false;};return h('label',{class:'ms-setting ms-switch'},[h('span',{class:'grow'},[h('span',{text:t(key)}),...(hint?[h('small',{text:t(hint)})]:[])]),input]);}
    function details(){kit.close();sheet((b,close)=>{b.classList.add('ms-sheet');const intro=h('div',{class:'ms-details-person'},[h('span',{class:'ms-avatar',text:[...(name||'?')][0]}),h('h2',{text:name||t('ms.details')}),h('small',{text:state?.group_name?t('ms.members',{n:state.members?.length||0}):t('ms.conversation')})]);
      b.append(h('div',{class:'ms-sheet-head'},[h('b',{text:t('ms.details')}),button('ck.close',ic.close,close)]),intro,
        h('h3',{class:'ms-section-title',text:t('ms.personalize')}),h('div',{class:'ms-setting-list'},[
          action('ms.theme',icons.emoji,()=>choose('theme',['graphite','sand','ocean','plum'])),action('ms.font',icons.file,()=>choose('font',['default','serif','mono'])),action('ms.quick',PD.social.glyph(prefs.quick_reaction),quick)]),
        h('div',{class:'ms-setting-list'},[action('ms.shared',PD.social.IC.photo,()=>library('media')),action('ms.pins',icons.pin,()=>library('pins')),action('ms.group',icons.group,()=>createGroup(state?.other)),...(!state?.group_name?[action('ms.share',icons.link,shareContact)]:[])]),
        h('h3',{class:'ms-section-title',text:t('ms.notifications')}),h('div',{class:'ms-setting-list'},[toggle('ms.mute','muted'),toggle('ms.notifications','notifications'),toggle('ms.sounds','sounds')]),
        h('h3',{class:'ms-section-title',text:t('ms.privacy')}),h('div',{class:'ms-setting-list'},[toggle('ms.receipts','read_receipts'),toggle('ms.typing','typing_indicator'),...(!state?.group_name?[toggle('ms.restrict','restricted','ms.restrictHint')]:[])]),
        h('div',{class:'ms-setting-list ms-danger'},[
          ...(!state?.group_name?[action('md.block',icons.shield,async()=>{try{const other=state?.other||await C.chat.other(id);close();PD.community.util.confirmBlock(other,name,()=>PD.app.go('community','chats',true));}catch(e){PD.ui.toast(err(e));}}),action('md.report',icons.shield,async()=>{try{const other=state?.other||await C.chat.other(id);PD.community.util.reportSheet('user',other);}catch(e){PD.ui.toast(err(e));}})]:[]),
          action('ms.delete',icons.trash,()=>PD.ui.confirm(t('ms.deleteQ'),async()=>{try{await C.chat.clear(id);close();PD.app.go('community','chats',true);}catch(e){PD.ui.toast(err(e));}}))]));
    });}
    function choose(prop,values){sheet((b,close)=>{b.classList.add('ms-sheet');b.append(h('h2',{text:t('ms.'+prop)}),h('div',{class:'ms-choices'},values.map(value=>h('button',{class:'ms-choice'+(prefs[prop]===value?' on':''),'data-choice':value,'aria-label':t('ms.'+value),'aria-pressed':String(prefs[prop]===value),onclick:async()=>{if(await update({[prop]:value}))close();}},[h('span',{class:prop==='theme'?'ms-swatch':'ms-font-sample',text:prop==='font'?'Aa':''}),h('b',{text:t('ms.'+value)}),...(prefs[prop]===value?[h('span',{html:icons.check})]:[])]))));});}
    function quick(){sheet((b,close)=>{b.classList.add('ms-sheet');b.append(h('h2',{text:t('ms.quick')}),h('p',{class:'muted',text:t('ms.quickHint')}),h('div',{class:'ms-reactions'},PD.social.REACTS.map(k=>button('fd.rx.'+k,PD.social.glyph(k),async()=>{if(await update({quick_reaction:k}))close();}))));});}
    async function shareContact(){const other=state?.members?.find(x=>x.id===state.other);if(!other?.nickname){PD.ui.toast(t('ms.noItems'));return;}const text=t('ms.contact',{n:(other.name||name)+' · @'+other.nickname}),url=/^https?:$/.test(location.protocol)?location.origin+location.pathname+'?go='+encodeURIComponent('community:@'+other.nickname):null;try{if(navigator.share)await navigator.share({title:name,text,...(url?{url}:{})});else{await navigator.clipboard.writeText(text+(url?'\n'+url:''));PD.ui.toast(t('ms.copied'));}}catch(e){if(e.name!=='AbortError')PD.ui.toast(err(e));}}
    function library(initial){sheet((b,close)=>{b.classList.add('ms-sheet','ms-library');const tabs=h('div',{class:'ms-library-tabs',role:'tablist'}),body=h('div',{class:'ms-library-body'});let tab=initial,before=null,done=false,loading=false,rev=0;const more=h('button',{class:'btn small',text:t('ms.older'),onclick:load});
      function paintTabs(){tabs.replaceChildren(...['media','links','files','pins'].map(k=>h('button',{role:'tab','aria-selected':String(tab===k),class:tab===k?'on':'',text:t('ms.'+k),onclick:()=>{tab=k;rev++;before=null;done=false;body.replaceChildren();paintTabs();load();}})));body.className='ms-library-body '+(tab==='media'?'ms-gallery':'');}
      async function load(){if(loading||done)return;loading=true;const token=rev;more.disabled=true;body.querySelector('.ms-library-empty')?.remove();try{const rows=tab==='pins'?await C.chat.byIds(id,state?.pins||[]):await C.chat.history(id,before);if(token!==rev||!body.isConnected)return;await PD.social.urls(rows);if(token!==rev||!body.isConnected)return;for(const m of rows){if(tab==='links'){for(const url of safeLinks(m.body))body.append(h('a',{class:'ms-link',href:url,target:'_blank',rel:'noopener noreferrer',text:url}));}else if(tab==='media'&&['photo','video','audio'].includes(m.media_kind)){body.append(PD.social.mediaEl(m));}else if(tab==='media'&&m.gif)body.append(h('img',{src:m.gif,alt:'GIF',loading:'lazy'}));else if(tab==='files'&&m.media_kind==='file'){const src=C.storage.url(m.media_path);if(src)body.append(h('a',{class:'ms-link',href:src,target:'_blank',rel:'noopener noreferrer',download:m.media_meta?.name||'',text:m.media_meta?.name||t('ms.file')}));}else if(tab==='pins'){body.append(h('button',{class:'ms-pin-item',onclick:()=>{close();const n=nodes.get(m.id);if(n){n.el.scrollIntoView({block:'center',behavior:'smooth'});n.el.classList.add('ms-highlight');setTimeout(()=>n.el.classList.remove('ms-highlight'),1800);}else sheet(b=>{b.append(h('h2',{text:t('ms.pins')}));if(m.body)b.append(textBody(m.body));if(m.media_path)b.append(PD.social.mediaEl(m));if(m.sticker)b.append(PD.chatkit.sticker(m.sticker));if(m.gif)b.append(h('img',{class:'md-img',src:m.gif,alt:'GIF'}));});}},[h('span',{text:m.body||t(m.sticker?'ck.stickers':m.gif?'ck.gif':'ms.media')}),h('small',{text:dateLabel(m.created_at)})]));}}
        before=rows.at(-1)?.id;done=tab==='pins'||rows.length<100;more.hidden=done;if(!body.childElementCount)body.append(h('p',{class:'ms-library-empty',text:t('ms.noItems')}));
      }catch(e){if(token===rev){body.append(h('p',{text:err(e)}));more.hidden=false;}}finally{loading=false;more.disabled=false;if(token!==rev)load();}}
      b.append(h('div',{class:'ms-sheet-head'},[h('h2',{text:t('ms.shared')}),button('ck.close',ic.close,close)]),tabs,body,more);paintTabs();load();return()=>{rev++;body.querySelectorAll('audio,video').forEach(m=>m.pause());};});}
    let tick=0;
    PD.chatkit.gifsAvailable().then(ok=>{if(alive)gif.classList.toggle('is-unavailable',!ok);});
    refreshState().finally(()=>{if(alive){poll();tick=setInterval(()=>{if(!document.hidden)poll();},2500);}});
    const visibility=()=>{if(document.hidden){C.chat.typing(id,false).catch(()=>{});if(voice.recording)voice.stop();}else poll();};document.addEventListener('visibilitychange',visibility);
    own(()=>{alive=false;clearInterval(tick);clearTimeout(typingTimer);C.chat.typing(id,false).catch(()=>{});kit.destroy();voice.destroy();sheets.forEach(close=>close());document.removeEventListener('visibilitychange',visibility);document.documentElement.classList.remove('chat-on');w.classList.remove('ms-chat');});
  }
  function recorder(box,onSend,canStart){
    let stream=null,rec=null,chunks=[],url=null,file=null,timer=0,started=0,duration=0,token=0,pending=false,discard=false,disposed=false,ctx=null,analyser=null;
    const label=h('span',{class:'ms-record-label'}),clock=h('time',{text:'0:00'}),bars=h('div',{class:'ms-record-bars','aria-hidden':'true'},Array.from({length:20},()=>h('i')));
    const player=h('audio',{controls:true,preload:'metadata','aria-label':t('ms.preview')});
    const stopBtn=button('ms.stop','<span class="ms-stop-square"></span>',stop),sendBtn=button('cm.send',ic.send,send,'ms-send');
    const cancel=button('ms.cancel',icons.trash,reset);
    box.append(cancel,label,bars,player,clock,stopBtn,sendBtn);
    const tracksOff=()=>{stream?.getTracks().forEach(tr=>tr.stop());stream=null;if(ctx){ctx.close().catch(()=>{});ctx=null;}analyser=null;};
    function reset(){token++;pending=false;discard=true;clearInterval(timer);if(rec&&rec.state!=='inactive')try{rec.stop();}catch(_){}tracksOff();player.pause();player.removeAttribute('src');player.load();if(url)URL.revokeObjectURL(url);url=null;file=null;rec=null;box.hidden=true;box.classList.remove('is-recording');}
    function paint(){duration=(Date.now()-started)/1000;clock.textContent=stamp(duration);if(analyser){const data=new Uint8Array(analyser.frequencyBinCount);analyser.getByteFrequencyData(data);[...bars.children].forEach((b,i)=>b.style.height=Math.max(3,data[i*3]/255*26)+'px');}if(duration>=300)stop();}
    async function start(){if(disposed||pending||rec?.state==='recording'||!canStart())return;if(!navigator.mediaDevices?.getUserMedia||!window.MediaRecorder){PD.ui.toast(t('ms.micUnavailable'));return;}
      reset();const seq=++token;pending=true;discard=false;
      box.hidden=false;label.textContent=t('ms.loading');player.hidden=true;bars.hidden=true;stopBtn.hidden=sendBtn.hidden=true;
      try{const media=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true},video:false});if(disposed||seq!==token){media.getTracks().forEach(t=>t.stop());return;}stream=media;
        const mime=['audio/webm;codecs=opus','audio/mp4','audio/ogg;codecs=opus','audio/webm'].find(x=>MediaRecorder.isTypeSupported(x));
        rec=new MediaRecorder(stream,mime?{mimeType:mime}:undefined);chunks=[];duration=0;
        rec.ondataavailable=e=>{if(seq===token&&e.data.size)chunks.push(e.data);};
        rec.onerror=()=>{if(seq===token){reset();PD.ui.toast(t('cm.errGen'));}};
        rec.onstop=()=>{clearInterval(timer);tracksOff();if(discard||disposed||seq!==token)return;const blob=new Blob(chunks,{type:rec.mimeType||chunks[0]?.type||'audio/webm'});if(duration<1||!blob.size){reset();PD.ui.toast(t('ms.voiceShort'));return;}
          const ext=/mp4/.test(blob.type)?'m4a':/ogg/.test(blob.type)?'ogg':'webm';file=new File([blob],'voice-'+Date.now()+'.'+ext,{type:blob.type});url=URL.createObjectURL(file);player.src=url;player.hidden=false;bars.hidden=true;stopBtn.hidden=true;sendBtn.hidden=false;label.textContent=t('ms.preview');box.classList.remove('is-recording');};
        try{ctx=new(window.AudioContext||window.webkitAudioContext)();analyser=ctx.createAnalyser();analyser.fftSize=256;ctx.createMediaStreamSource(stream).connect(analyser);}catch(_){}
        started=Date.now();rec.start(250);label.textContent=t('ms.recording');clock.textContent='0:00';bars.hidden=false;stopBtn.hidden=false;box.classList.add('is-recording');timer=setInterval(paint,100);
      }catch(e){if(seq===token){reset();PD.ui.toast(e.name==='NotAllowedError'?PD.ui.micError('denied'):t('ms.micUnavailable'),5000);}}finally{if(seq===token)pending=false;}
    }
    function stop(){if(rec?.state==='recording'){duration=(Date.now()-started)/1000;rec.stop();clearInterval(timer);}}
    async function send(){if(!file||sendBtn.disabled)return;sendBtn.disabled=cancel.disabled=true;player.pause();try{if(await onSend(file))reset();}finally{sendBtn.disabled=cancel.disabled=false;}}
    return {start,stop,destroy(){disposed=true;reset();},get duration(){return Math.round(duration*10)/10;},get active(){return pending||!box.hidden;},get recording(){return rec?.state==='recording';}};
  }
  function camera(onUse){
    return PD.ui.sheet((b,close)=>{
      b.classList.add('ms-sheet','ms-camera-sheet');let stream=null,rec=null,closed=false,chunks=[],preview=null,previewURL=null,started=0,timer=0;
      const video=h('video',{class:'ms-camera-preview',autoplay:true,playsinline:true,muted:true});video.muted=true;
      const photo=button('ms.photo',icons.camera,take),record=button('ms.video',ic.video,film),use=h('button',{class:'btn primary',text:t('ms.use'),hidden:true,onclick:()=>{if(preview){const file=preview;close();onUse(file);}}});
      const status=h('p',{class:'muted',text:t('ms.loading')});
      b.append(h('div',{class:'ms-sheet-head'},[h('h2',{text:t('ms.camera')}),button('ck.close',ic.close,close)]),video,status,h('div',{class:'ms-camera-controls'},[photo,record,use]));photo.disabled=record.disabled=true;
      (async()=>{try{const s=await navigator.mediaDevices.getUserMedia({video:{facingMode:'environment',width:{ideal:1280}},audio:false});if(closed){s.getTracks().forEach(t=>t.stop());return;}stream=s;video.srcObject=s;await video.play();photo.disabled=false;record.disabled=!window.MediaRecorder;status.textContent='';}catch(_){if(!closed)status.textContent=t('ms.cameraError');}})();
      function show(file){if(closed)return;preview=file;stream?.getTracks().forEach(t=>t.stop());video.srcObject=null;previewURL=URL.createObjectURL(file);if(file.type.startsWith('image/')){video.hidden=true;video.after(h('img',{class:'ms-camera-preview',src:previewURL,alt:t('ms.photo')}));}else{video.src=previewURL;video.muted=false;video.controls=true;}photo.hidden=record.hidden=true;use.hidden=false;status.textContent=t('ms.preview');}
      function take(){if(!video.videoWidth)return;const canvas=document.createElement('canvas');canvas.width=video.videoWidth;canvas.height=video.videoHeight;canvas.getContext('2d').drawImage(video,0,0);canvas.toBlob(blob=>{if(blob)show(new File([blob],'camera-'+Date.now()+'.jpg',{type:'image/jpeg'}));},'image/jpeg',.92);}
      async function film(){if(rec?.state==='recording'){rec.stop();clearInterval(timer);return;}record.disabled=true;try{
        // Ask for audio only when the user chooses video, not when opening the camera.
        const audio=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true}});if(closed){audio.getTracks().forEach(t=>t.stop());return;}audio.getAudioTracks().forEach(t=>stream.addTrack(t));
        const mime=['video/mp4','video/webm;codecs=vp8,opus','video/webm'].find(m=>MediaRecorder.isTypeSupported(m));rec=new MediaRecorder(stream,mime?{mimeType:mime}:undefined);chunks=[];
        rec.ondataavailable=e=>{if(e.data.size)chunks.push(e.data);};rec.onstop=()=>{clearInterval(timer);if(closed)return;const blob=new Blob(chunks,{type:rec.mimeType});show(new File([blob],'camera-'+Date.now()+(/mp4/.test(blob.type)?'.mp4':'.webm'),{type:blob.type}));};
        rec.onerror=()=>{clearInterval(timer);status.textContent=t('ms.cameraError');stream?.getTracks().forEach(t=>t.stop());};
        rec.start(500);started=Date.now();photo.disabled=true;record.innerHTML='<span class="ms-stop-square"></span>';record.setAttribute('aria-label',t('ms.stop'));record.title=t('ms.stop');
        timer=setInterval(()=>{status.textContent=t('ms.recording')+' · '+stamp((Date.now()-started)/1000);if(Date.now()-started>=300000){rec.stop();clearInterval(timer);}},250);
      }catch(_){status.textContent=t('ms.cameraError');}finally{record.disabled=false;}}
      return()=>{closed=true;clearInterval(timer);if(rec?.state==='recording')rec.stop();stream?.getTracks().forEach(t=>t.stop());video.pause();if(previewURL)URL.revokeObjectURL(previewURL);};
    });
  }
  function createGroup(include){
    PD.ui.sheet((b,close)=>{b.classList.add('ms-sheet');let disposed=false,busy=false;const selected=new Set(include?[include]:[]),name=h('input',{class:'input',maxlength:80,placeholder:t('ms.groupName'),'aria-label':t('ms.groupName')}),list=h('div',{class:'ms-friend-list'}),status=h('p',{class:'muted',text:t('ms.loading')});
      const create=h('button',{class:'btn primary',text:t('ms.group'),disabled:true,onclick:async()=>{if(busy)return;busy=true;create.disabled=true;try{const cid=await C.chat.group(name.value.trim(),[...selected]);if(!disposed){close();PD.app.go('community','c:'+cid+':'+name.value.trim());}}catch(e){status.textContent=err(e);}finally{busy=false;sync();}}});
      function sync(){create.disabled=busy||!name.value.trim()||selected.size<2||selected.size>31;}
      name.oninput=sync;b.append(h('div',{class:'ms-sheet-head'},[h('h2',{text:t('ms.group')}),button('ck.close',ic.close,close)]),name,h('p',{class:'muted',text:t('ms.groupHint')}),list,status,create);
      C.social.friends().then(rows=>{if(disposed)return;status.textContent='';for(const friend of rows.filter(r=>r.relation==='friend')){const input=h('input',{type:'checkbox','aria-label':friend.display_name||friend.nickname});input.checked=selected.has(friend.id);input.onchange=()=>{if(input.checked)selected.add(friend.id);else selected.delete(friend.id);sync();};list.append(h('label',{class:'ms-setting ms-switch'},[h('span',{text:friend.display_name||'@'+friend.nickname}),input]));}sync();}).catch(e=>{if(!disposed)status.textContent=err(e);});
      return()=>{disposed=true;};
    });
  }
  return {view,createGroup,recorder,icons};
})();
