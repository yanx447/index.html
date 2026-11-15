/* Focused studio navigation and an editable piano-roll timeline. */
PD.i18n.add({
 'apr.section':['სამუშაო სივრცე','Workspace'], 'apr.audio':['აუდიო და დაკვრა','Audio & playback'],
 'apr.notes':['ნოტების რედაქტორი','Note editor'], 'apr.tab':['TAB და აპლიკატურა','TAB & fingering'],
 'apr.practice':['პრაქტიკა','Practice'], 'apr.more':['სხვა ინსტრუმენტები','More tools'],
 'apr.import':['აუდიოს დამატება / ჩაწერა','Add audio / record'], 'apr.library':['ჩემი ჩანაწერები','My recordings'],
 'apr.analysis':['ანალიზი და ზომა','Analysis & metre'], 'apr.arrange':['არანჟირება და სირთულე','Arrangement & difficulty'],
 'apr.export':['ექსპორტი და შენახვა','Export & save'], 'apr.help':['შეფასება და დახმარება','Estimates & help'],
 'apr.view':['ჩვენება','View'], 'apr.piano':['Piano roll','Piano roll'], 'apr.score':['სანოტო ჩანაწერი','Sheet music'],
 'apr.neck':['გრიფი და თითები','Fretboard & fingers'], 'apr.controls':['პრაქტიკის პარამეტრები','Practice settings'],
 'apr.choose':['აირჩიე ნოტი ბადეზე — დეტალები აქ გამოჩნდება.','Select a note in the grid to inspect it here.'],
 'apr.hint':['ნოტი: არჩევა · გადაადგილება: დრო / სიმაღლე · მარჯვენა კიდე: ხანგრძლივობა · ორმაგი დაჭერა ცარიელ ბადეზე: დამატება.','Click to select · drag to move pitch/time · drag the right edge to resize · double-click empty grid to add.'],
 'apr.snap':['ბადეზე მიბმა','Snap'], 'apr.off':['თავისუფალი','Off'], 'apr.pitch':['ნოტი','Pitch'], 'apr.velocity':['სიმძლავრე','Velocity'],
 'apr.zoomX':['დროის მასშტაბი','Time zoom'], 'apr.zoomY':['ნოტების სიმაღლე','Row height'], 'apr.fit':['ნოტების ჩვენება','Show notes'],
 'apr.delete':['ნოტის წაშლა','Delete note'], 'apr.undo':['უკან დაბრუნება','Undo'], 'apr.selected':['არჩეული ნოტი','Selected note'],
 'apr.invalid':['შეამოწმე სიმაღლე, დრო და ხანგრძლივობა.','Check pitch, time and duration.'],
 'apr.ready':['ნოტები მზადაა. აირჩიე სამუშაო სივრცე და შეამოწმე ჩანაწერი.','Notes are ready. Choose a workspace and review the recording.'],
 'apr.begin':['ჯერ ამოიცანი ნოტები. შემდეგ გახსენი რედაქტორი ან TAB.','Transcribe the notes first, then open the editor or TAB.']
});
PD.aiUI = {
 fold(key, children, open = false) {
   return PD.h('details', { class: 'apr-fold', open }, [PD.h('summary', { text: PD.i18n.t(key) }), PD.h('div', { class: 'apr-fold-body' }, children)]);
 }
};
PD.aiPiano = function (M, o) {
 const h=PD.h,t=PD.i18n.t,T=PD.theory,A=PD.aiScore,clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
 const state=o.state, initialLeft=state.left, initialTop=state.top, KEY=76, TOP=30, HI=108, LO=21;
 let px=state.px||100, rh=state.rh||22, snap=state.snap??.25, follow=state.follow??true, selected=null, drag=null, dead=false;
 const el=h('section',{class:'apr-editor'}),toolbar=h('div',{class:'apr-toolbar'}),scroll=h('div',{class:'apr-scroll',tabindex:0,'aria-label':t('apr.piano')}),world=h('div',{class:'apr-world'}),grid=h('div',{class:'apr-grid'}),keyboard=h('div',{class:'apr-keyboard'}),ruler=h('div',{class:'apr-ruler'}),cursor=h('div',{class:'apr-playhead'}),inspector=h('div',{class:'apr-inspector'});
 scroll.append(world);world.append(ruler,grid,keyboard,cursor);
 const origin=A.beatAt(0,M.beats,M.bpm),beat=time=>A.beatAt(time,M.beats,M.bpm)-origin,time=b=>A.secondsAt(b+origin,M.beats,M.bpm);
 const total=Math.max(4,Math.ceil(beat(M.dur))+1),bpb=M.metre?.beatsPerBar||4;
 const buttons=new Map(),keys=new Map();
 const x=n=>KEY+beat(n.t0)*px,y=n=>TOP+(HI-n.m)*rh;
 const saveView=()=>Object.assign(state,{px,rh,snap,follow,left:scroll.scrollLeft,top:scroll.scrollTop});
 function layoutNote(n,button) {
   button.style.left=x(n)+'px';button.style.top=y(n)+'px';button.style.width=Math.max(12,(beat(n.t1)-beat(n.t0))*px)+'px';button.style.height=(rh-2)+'px';
   button.classList.toggle('uncertain',n.conf<.5);button.classList.toggle('unplayable',!n.reach);
   button.firstChild.textContent=T.name(n.m);button.setAttribute('aria-label',T.name(n.m)+' · '+n.t0.toFixed(2)+'s · '+(n.t1-n.t0).toFixed(2)+'s');
 }
 function select(n,seek=true) {
   selected=n;state.selected=n.id;buttons.forEach((b,note)=>b.classList.toggle('selected',note===n));
   keys.forEach((k,m)=>k.classList.toggle('selected',m===n?.m));inspect();if(n&&seek)o.seek(n.t0);
 }
 function commit(n,patch) {
   if(!o.canEdit())return;
   const a=Number(patch.t0??n.t0),end=Number(patch.t1??n.t1),m=Number(patch.m??n.m),vel=Number(patch.velocity??n.velocity??90);
   if(!Number.isFinite(a)||!Number.isFinite(end)||!Number.isInteger(m)||a<0||end>a+M.dur||end>M.dur||end-a<.02||m<LO||m>HI||!Number.isFinite(vel)||vel<1||vel>127)return false;
   saveView();o.change(n,{...patch,m,t0:a,t1:end,velocity:vel,corrected:true,lockPosition:false});return true;
 }
 function inspect() {
   inspector.replaceChildren();if(!selected){inspector.append(h('p',{class:'muted',text:t('apr.choose')}));return;}
   const n=selected, pitch=h('select',{'aria-label':t('apr.pitch')});for(let m=LO;m<=HI;m++)pitch.append(h('option',{value:m,text:T.name(m),selected:m===n.m}));
   const start=h('input',{type:'number',min:0,max:M.dur,step:.01,value:n.t0.toFixed(3),'aria-label':t('as.onset')}),duration=h('input',{type:'number',min:.02,max:M.dur,step:.01,value:(n.t1-n.t0).toFixed(3),'aria-label':t('as.duration')}),velocity=h('input',{type:'number',min:1,max:127,value:n.velocity||90,'aria-label':t('apr.velocity')}),error=h('span',{role:'alert',class:'apr-error'});
   inspector.append(h('div',{class:'apr-inspect-title'},[h('b',{text:t('apr.selected')+' · '+T.name(n.m)}),h('small',{text:t('tr.conf')+' '+Math.round((n.conf||0)*100)+'/100'+(!n.reach?' · '+t('tr.unplay'):'')})]));
   [[pitch,'apr.pitch'],[start,'as.onset'],[duration,'as.duration'],[velocity,'apr.velocity']].forEach(([input,key])=>inspector.append(h('label',{},[h('span',{text:t(key)}),input])));
   inspector.append(h('button',{class:'btn small primary',text:t('as.apply'),onclick:()=>{if(commit(n,{m:+pitch.value,t0:+start.value,t1:+start.value + +duration.value,velocity:+velocity.value})===false)error.textContent=t('apr.invalid');}}),h('button',{class:'btn small ghost',text:t('apr.delete'),onclick:()=>{if(o.canEdit()){saveView();o.remove(n);}}}),error);
 }
 function place() {
   world.style.width=(KEY+total*px)+'px';world.style.height=(TOP+(HI-LO+1)*rh)+'px';
   grid.style.cssText='left:'+KEY+'px;top:'+TOP+'px;width:'+total*px+'px;height:'+(HI-LO+1)*rh+'px;--beat:'+px+'px;--bar:'+(px*bpb)+'px;--row:'+rh+'px';
   keyboard.style.width=KEY+'px';keyboard.replaceChildren();keys.clear();
   for(let m=HI;m>=LO;m--){const black=[1,3,6,8,10].includes(m%12),k=h('div',{class:'apr-key '+(black?'black':'white'),style:'height:'+rh+'px',text:T.name(m)});keyboard.append(k);keys.set(m,k);}
   ruler.replaceChildren(h('span',{class:'apr-ruler-corner',style:'width:'+KEY+'px',text:t('apr.pitch')}));
   for(let b=0;b<=total;b++)ruler.append(h('button',{class:'apr-beat',style:'left:'+(KEY+b*px)+'px;width:'+px+'px',text:b%bpb===0?String(Math.floor(b/bpb)+1):'·',title:Math.max(0,time(b)).toFixed(2)+'s',onclick:()=>o.seek(clamp(time(b),0,M.dur))}));
   buttons.forEach((button,n)=>layoutNote(n,button));saveView();
 }
 function fit() {const pitches=M.notes.map(n=>n.m);scroll.scrollTop=Math.max(0,(HI-Math.max(60,...pitches)-3)*rh);scroll.scrollLeft=0;saveView();}
 const zoom=(axis,d)=>{if(axis==='x')px=clamp(px*d,35,300);else rh=clamp(Math.round(rh*d),14,38);place();};
 for(const [axis,key] of [['x','apr.zoomX'],['y','apr.zoomY']]) toolbar.append(h('div',{class:'apr-zoom'},[h('small',{text:t(key)}),h('button',{class:'btn small',text:'−','aria-label':t(key)+' −',onclick:()=>zoom(axis,1/1.25)}),h('button',{class:'btn small',text:'+','aria-label':t(key)+' +',onclick:()=>zoom(axis,1.25)})]));
 const snapping=h('select',{'aria-label':t('apr.snap'),onchange:e=>{snap=+e.target.value;saveView();}});[[0,'apr.off'],[1,'1/4'],[.5,'1/8'],[.25,'1/16']].forEach(([v,k])=>snapping.append(h('option',{value:v,text:k==='apr.off'?t(k):k,selected:snap===v})));
 const auto=h('button',{class:'chip',text:t('as.follow'),'aria-pressed':String(follow),onclick:()=>{follow=!follow;auto.setAttribute('aria-pressed',String(follow));saveView();}});
 toolbar.append(h('label',{},[h('small',{text:t('apr.snap')}),snapping]),auto,h('button',{class:'chip',text:t('apr.fit'),onclick:fit}),h('button',{class:'chip',text:t('apr.undo'),disabled:!o.canUndo(),onclick:()=>{saveView();o.undo();}}));
 function snapped(seconds){return snap?clamp(time(Math.round(beat(seconds)/snap)*snap),0,M.dur):clamp(seconds,0,M.dur);}
 M.notes.forEach(n=>{
   const b=h('button',{type:'button',class:'apr-note','data-note-id':n.id},[h('span'),h('i',{class:'apr-resize','aria-hidden':'true'})]);buttons.set(n,b);world.append(b);
   b.onpointerdown=e=>{if(e.button!==0)return;e.stopPropagation();select(n);drag={n,b,x:e.clientX,y:e.clientY,left:scroll.scrollLeft,top:scroll.scrollTop,original:{...n},resize:e.target.classList.contains('apr-resize'),moved:false};b.setPointerCapture(e.pointerId);};
   b.onpointermove=e=>{if(!drag||drag.b!==b)return;const dx=e.clientX-drag.x+scroll.scrollLeft-drag.left,dy=e.clientY-drag.y+scroll.scrollTop-drag.top;if(Math.abs(dx)+Math.abs(dy)<4&&!drag.moved)return;
     if(!drag.moved&&!o.canEdit()){drag=null;return;}drag.moved=true;
     const old=drag.original;
     if(drag.resize)n.t1=clamp(snapped(time(beat(old.t1)+dx/px)),n.t0+.02,M.dur);
     else {const length=old.t1-old.t0;n.t0=clamp(snapped(time(beat(old.t0)+dx/px)),0,M.dur-length);n.t1=n.t0+length;n.m=clamp(old.m-Math.round(dy/rh),LO,HI);}
     layoutNote(n,b);
   };
   b.onpointerup=()=>{if(!drag||drag.b!==b)return;const d=drag;drag=null;if(d.moved){const patch={m:n.m,t0:n.t0,t1:n.t1};Object.assign(n,d.original);commit(n,patch);}};
   b.onpointercancel=()=>{if(drag){Object.assign(drag.n,drag.original);layoutNote(drag.n,drag.b);drag=null;}};
   b.onclick=e=>{e.stopPropagation();select(n);};
   b.onkeydown=e=>{if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Delete','Backspace'].includes(e.key)){e.preventDefault();e.stopPropagation();if(e.key==='Delete'||e.key==='Backspace'){if(o.canEdit()){saveView();o.remove(n);}return;}const d=snap||.25;if(e.key==='ArrowUp'||e.key==='ArrowDown')commit(n,{m:n.m+(e.key==='ArrowUp'?1:-1)});else{const at=clamp(time(beat(n.t0)+(e.key==='ArrowLeft'?-d:d)),0,M.dur-(n.t1-n.t0));commit(n,{t0:at,t1:at+n.t1-n.t0});}}};
 });
 grid.ondblclick=e=>{if(!o.canEdit())return;const r=world.getBoundingClientRect(),start=snapped(time((e.clientX-r.left-KEY)/px)),m=clamp(HI-Math.floor((e.clientY-r.top-TOP)/rh),LO,HI);if(start>=M.dur-.02)return;saveView();o.add({m,t0:start,t1:Math.min(M.dur,start+60/M.bpm/2),velocity:90,conf:1,corrected:true,id:'manual-'+Date.now()});};
 grid.onclick=e=>{const r=world.getBoundingClientRect();select(null,false);o.seek(clamp(time((e.clientX-r.left-KEY)/px),0,M.dur));};
 scroll.addEventListener('scroll',saveView,{passive:true});
 el.append(toolbar,h('p',{class:'apr-hint',text:t('apr.hint')}),scroll,inspector);place();inspect();
 const savedLeft=initialLeft,savedTop=initialTop;
 const raf=requestAnimationFrame(()=>{if(dead)return;if(savedTop!=null){scroll.scrollLeft=savedLeft||0;scroll.scrollTop=savedTop;}else fit();const n=M.notes.find(n=>n.id===state.selected);if(n)select(n,false);});
 let lastKey='';
 function tick(p){cursor.style.left=(KEY+beat(p)*px)+'px';const active=M.notes.filter(n=>n.t0<=p&&n.t1>p),key=active.map(n=>n.id).join();if(key!==lastKey){lastKey=key;buttons.forEach((b,n)=>b.classList.toggle('playing',active.includes(n)));}
   if(follow&&!drag&&o.playing?.()){const at=KEY+beat(p)*px;if(at>scroll.scrollLeft+scroll.clientWidth-40||at<scroll.scrollLeft+KEY)scroll.scrollLeft=Math.max(0,at-KEY-60);}}
 return {el,tick,draw(){tick(o.pos());},stop(){dead=true;cancelAnimationFrame(raf);if(drag)Object.assign(drag.n,drag.original);saveView();}};
};
