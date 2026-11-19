/* Chat surfaces and gestures. Gesture cancellation never completes a destructive action. */
PD.i18n.add({
 'ms.noto-sans':['Noto Sans Georgian','Noto Sans Georgian'],'ms.noto-serif':['Noto Serif Georgian','Noto Serif Georgian'],
 'ms.dm-sans':['DM Sans','DM Sans'],'ms.bricolage':['Bricolage Grotesque','Bricolage Grotesque'],'ms.plex-mono':['IBM Plex Mono','IBM Plex Mono'],
 'ms.appFont':['აპის შრიფტი','App font'],

 'cx.edit':['ემოჯების შეცვლა','Customize emojis'],'cx.add':['სხვა ემოჯი','More emojis'],'cx.reset':['საწყისი ემოჯები','Reset emojis'],'cx.pick':['აირჩიე ემოჯი','Choose an emoji'],'cx.slot':['შეცვალე ემოჯი {n}','Change emoji {n}'],
 'cx.quickSend':['სწრაფი რეაქციის გაგზავნა','Send quick reaction'],'cx.close':['დახურვა ან ჩამოსრიალება','Close or drag down'],'cx.pause':['ჩაწერის შეჩერება','Pause recording'],'cx.resume':['ჩაწერის გაგრძელება','Resume recording'],'cx.speed':['მოსმენის სიჩქარე','Playback speed'],'cx.recordHint':['ჩაწერე, შეაჩერე და მოუსმინე გაგზავნამდე','Record, pause and listen before sending'],
 'ms.midnight':['შუაღამე','Midnight'],'ms.aurora':['ავრორა','Aurora'],'ms.rose':['ვარდი','Rose'],'ms.forest':['ტყე','Forest'],'ms.sunset':['დაისი','Sunset'],'ms.ice':['ყინული','Ice'],
 'ms.rounded':['მრგვალი','Rounded'],'ms.system':['სისტემური','System'],'ms.humanist':['ჰუმანისტური','Humanist'],'ms.book':['წიგნი','Book'],'ms.large':['დიდი ტექსტი','Large text'],
 'cl.shareScreen':['ეკრანის გაზიარება','Share screen'],'cl.stopShare':['გაზიარების შეწყვეტა','Stop sharing'],'cl.devices':['ხმა და კამერა','Audio and camera'],'cl.microphone':['მიკროფონი','Microphone'],'cl.camera':['კამერა','Camera'],'cl.output':['ხმის გამომავალი','Audio output'],'cl.device':['მოწყობილობა {n}','Device {n}'],
 'cl.lowData':['მონაცემების ეკონომია','Use less data'],'cl.pip':['პატარა ფანჯარა','Picture in picture'],'cl.good':['კარგი კავშირი','Good connection'],'cl.weak':['სუსტი კავშირი','Weak connection'],'cl.peerMuted':['მიკროფონი გამორთულია','Microphone is muted'],'cl.peerCameraOff':['კამერა გამორთულია','Camera is off'],'cl.sharing':['ეკრანი ზიარდება','Sharing screen'],'cl.mediaError':['მოწყობილობის შეცვლა ვერ მოხერხდა. სცადე ხელახლა.','Could not change device. Try again.'],'cl.screenError':['ეკრანის გაზიარება ვერ დაიწყო.','Screen sharing could not start.'],'cl.reconnecting':['კავშირი აღდგება…','Reconnecting…']
});
PD.chatUI=(()=>{
 const h=PD.h;
 const themes=['graphite','midnight','ocean','plum','sand','aurora','rose','forest','sunset','ice'];
 const fonts=['default','system','rounded','humanist','serif','book','mono','large','noto-sans','noto-serif','dm-sans','bricolage','plex-mono'];
 const appFonts=['default','humanist',...fonts.slice(8)];
 function appFont(){const value=PD.store.get('app.font','default');return appFonts.includes(value)?value:'default';}
 function setAppFont(value){if(appFonts.includes(value))PD.store.set('app.font',value);document.documentElement.dataset.appFont=appFont();}
 const glyph=k=>PD.social.REACTS.includes(k)?PD.social.glyph(k):'<span class="rx-g">'+PD.esc(k||'')+'</span>';
 const text=k=>PD.social.glyphText(k)||k||'❤️';
 function gestures(el,back){
  let g=null,suppress=0;const quiet=()=>matchMedia('(prefers-reduced-motion: reduce)').matches||document.documentElement.classList.contains('rm');
  const point=e=>e.touches?e.touches[0]:e;
  const start=e=>{if(e.touches&&e.touches.length!==1||!e.touches&&e.pointerType!=='mouse')return;const p=point(e),r=el.getBoundingClientRect(),handle=e.target.closest('.cx-grab'),edge=p.clientX<=Math.max(24,r.left+20)?1:p.clientX>=Math.min(innerWidth-24,r.right-20)?-1:0;if(!handle&&!edge)return;if(!handle&&e.target.closest('input,textarea,select,audio,video,[type=range],.sp-content,.sp-rail'))return;g={x:p.clientX,y:p.clientY,last:performance.now(),time:performance.now(),handle:!!handle,edge,dy:0,dx:0,on:false};if(e.touches)e.stopPropagation();};
  const move=e=>{if(!g)return;const p=point(e);g.dx=p.clientX-g.x;g.dy=p.clientY-g.y;const distance=g.handle?g.dy:g.dx*g.edge,off=g.handle?Math.abs(g.dx):Math.abs(g.dy);if(!g.on){if(off>10&&off>Math.abs(distance)){g=null;return;}if(distance<8)return;g.on=true;el.classList.add('cx-drag');}if(e.cancelable)e.preventDefault();e.stopPropagation();if(!quiet())el.style.setProperty('--cx-drag',(g.handle?'translateY('+Math.max(0,g.dy)+'px)':'translateX('+(g.dx*.3)+'px)'));};
  const finish=cancel=>{if(!g)return;const s=g;g=null;el.classList.remove('cx-drag');el.style.removeProperty('--cx-drag');if(!s.on||cancel)return;suppress=performance.now()+500;const delta=s.handle?s.dy:s.dx*s.edge,elapsed=performance.now()-s.time,threshold=s.handle?Math.min(130,el.clientHeight*.28):64;if(delta>threshold||delta>35&&delta/elapsed>.5){suppress=performance.now()+500;back();}else el.animate([{transform:s.handle?'translateY('+s.dy+'px)':'translateX('+(s.dx*.3)+'px)'},{transform:'none'}],{duration:quiet()?0:230,easing:'cubic-bezier(.2,.8,.2,1)'});};
  const end=()=>finish(false),cancel=()=>finish(true),click=e=>{if(performance.now()<suppress){e.preventDefault();e.stopImmediatePropagation();}};
  el.addEventListener('touchstart',start,{passive:true});el.addEventListener('touchmove',move,{passive:false});el.addEventListener('touchend',end);el.addEventListener('touchcancel',cancel);
  el.addEventListener('pointerdown',start);window.addEventListener('pointermove',move,{passive:false});window.addEventListener('pointerup',end);window.addEventListener('pointercancel',cancel);el.addEventListener('click',click,true);
  return()=>{window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',end);window.removeEventListener('pointercancel',cancel);};
 }
 function sheet(build,{center=false,onClose}={}){
  let dispose;return PD.ui.sheet((box,close)=>{box.classList.add('cx-glass');box.parentElement.classList.add('cx-back');if(center)box.parentElement.classList.add('cx-center');
   box.append(h('button',{type:'button',class:'cx-grab','aria-label':t('cx.close'),onclick:close},[h('span',{'aria-hidden':'true'})]));
   const cleanup=build(box,close);dispose=gestures(box,close);return()=>{dispose?.();if(typeof cleanup==='function')cleanup();};
  },{onClose});
 }
 function emoji(onPick){return sheet((b,close)=>{b.classList.add('cx-emoji-sheet');b.append(h('div',{class:'ms-sheet-head'},[h('h2',{text:t('cx.pick')}),h('button',{class:'ms-icon','aria-label':t('ck.close'),html:PD.ic.close,onclick:close})]),PD.chatkit.emojiGrid(value=>{close();onPick(value);}));},{center:true});}
 return {sheet,emoji,gestures,glyph,text,themes,fonts,appFonts,appFont,setAppFont};
})();
