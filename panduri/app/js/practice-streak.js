PD.i18n.add({
  'ps.title':['ვარჯიშის სერია','Practice streak'],
  'ps.days':['{n} დღე ზედიზედ','{n} days in a row'],
  'ps.checked':['დღევანდელი ვარჯიში ჩაითვალა','Today’s practice is counted'],
  'ps.keep':['ივარჯიშე დღეს და გააგრძელე სერია','Practise today to keep your streak'],
  'ps.repeat':['სერიაში ითვლება გაკვეთილის გამეორება, რიტმი და ნოტების ტრენაჟორიც.','Repeating a lesson, rhythm practice and the note trainer count too.'],
  'ps.start':['დღის ვარჯიში','Daily practice'],
  'ps.chat':['ჩატის სერია','Chat streak'],
  'ps.chatPending':['{n}/3 დღე სერიის დაწყებამდე','{n}/3 days to start a streak'],
  'ps.chatRule':['სერია იწყება სამი ზედიზედ დღით. დღეში ჩატში გაგზავნილი ერთი ტექსტი საკმარისია. დღე იცვლება 00:00-ზე UTC-ით.','A streak starts after three consecutive days. One text sent to this chat each day is enough. The day resets at 00:00 UTC.'],
  'ps.chatDone':['დღევანდელი ტექსტი ჩაითვალა','Today’s message is counted'],
  'ps.chatKeep':['გააგზავნე ტექსტი დღეს სერიის გასაგრძელებლად','Send a text today to keep the streak'],
  'ps.next': ['შემდეგი ეტაპი · {n} დღე', 'Next milestone · {n} days'],
  'ps.milestones': ['სერიის ეტაპები', 'Streak milestones'],
  'ps.max':['მიღწეულია 1000 დღე','1000 days reached'],
  'ps.lit':['დღეს ჩაითვალა — ცეცხლი ანთია','Counted today — the flame is lit'],
  'ps.risk':['დღეს ჯერ არ ჩათვლილა — ცეცხლი დღის ბოლოს ჩაქრება','Not counted yet today — the flame goes out at the end of the day'],
  'ps.off':['ცეცხლი ჯერ არ ანთია','No flame yet'],
  'ps.ignite':['სერია გაგრძელდა · {n} დღე','Streak kept · {n} days'],
  'ps.igniteChat':['ჩატის სერია · {n} დღე','Chat streak · {n} days']
});
PD.practiceStreak=(()=>{
  const key='practice.days',unit=86400000,cap=1000;
  function ordinal(value){
    const date=new Date(value);
    return Math.round(Date.UTC(date.getFullYear(),date.getMonth(),date.getDate())/unit);
  }
  function summarize(values,today){
    const days=[...new Set(values.filter(d=>Number.isInteger(d)&&d<=today))].sort((a,b)=>a-b);
    const dates=new Set(days);
    let cur=0,longest=0,run=0;
    for(let i=0;i<days.length;i++){
      run=i&&days[i]===days[i-1]+1?run+1:1;
      longest=Math.max(longest,run);
    }
    for(let d=dates.has(today)?today:today-1;cur<cap&&dates.has(d);d--)cur++;
    return {cur,longest:Math.min(cap,longest),today:dates.has(today)};
  }
  function save(values){
    const stored=PD.store.get(key,[]),existing=Array.isArray(stored)?stored:[],next=[...new Set([...existing,...values].filter(Number.isInteger))].sort((a,b)=>a-b).slice(-1200);
    if(next.length!==existing.length||next.some((d,i)=>d!==existing[i]))PD.store.set(key,next);
    return next;
  }
  const qualifies=s=>s&&s.date&&s.dur>0&&(s.correct>0||s.firstTry>0||s.pitch>0);
  // the first practice of the day lights the flame — once a day, a short animation that never blocks a tap
  PD.bus.on('session',s=>{
    if(!qualifies(s))return;
    const d=ordinal(s.date),before=PD.store.get(key,[]),had=Array.isArray(before)&&before.includes(d);
    save([d]);
    if(had||d!==ordinal(Date.now())||PD.store.get('ps.lit',0)===d)return;
    PD.store.set('ps.lit',d);
    const cur=status().cur;
    if(cur>0)setTimeout(()=>ignite(cur,'ps.ignite'),700);
  });
  function status(now=Date.now()){
    const days=save(PD.lessons.progress.sessions().filter(qualifies).map(s=>ordinal(s.date)));
    return summarize(days,ordinal(now));
  }
  const milestones = [3, 10, 50, 100, 200, 500, 800, 1000];
  const tier = days => milestones.findLast(n => n <= days) || 0;
  function track(days) {
    const h = PD.h, t = PD.i18n.t;
    const next = milestones.find(n => n > days);
    return h('div', { class: 'ps-track' }, [
      next ? h('small', { text: t('ps.next', { n: next }) }) : null,
      h('ul', { class: 'ps-marks', 'aria-label': t('ps.milestones') },
        milestones.map(n => h('li', { 'data-streak-tier': n, class: n <= days ? 'reached' : '', 'aria-current': n === tier(days) ? 'step' : null, text: String(n) })))
    ]);
  }

  /* ---- the flame: lit (counted today), at risk (a streak that has not been kept today — grey, it goes out at the
     end of the day), off (no streak yet). Its colour moves up with the milestones. Our own drawing. ---- */
  const FLAME='<svg viewBox="0 0 24 24" aria-hidden="true"><path class="psf-o" d="M12.1 2c1.1 3.2-.4 5-1.9 6.7C8.6 10.4 7 12.2 7 15.1 7 18.4 9.4 21 12.5 21s5.5-2.4 5.5-5.6c0-2.3-1-4.1-2.3-5.5.1 1.6-.4 2.8-1.5 3.6.5-3.8-.4-7.4-2.1-11.5Z"/><path class="psf-i" d="M12.4 11.2c.4 1.8-.3 2.8-1.1 3.7-.7.8-1.3 1.6-1.3 2.8 0 1.6 1.2 2.8 2.7 2.8s2.8-1.2 2.8-2.9c0-1.3-.6-2.3-1.4-3.1 0 .9-.3 1.5-.9 1.9.1-2-.2-3.6-.8-5.2Z"/></svg>';
  /** days; o: { today, start (1 = practice, 3 = a chat), size: xs | sm | md | lg | xl, num (show the number, default true) } */
  function flame(days,o={}){
    const h=PD.h,t=PD.i18n.t,start=o.start||1,state=days>=start?(o.today?'lit':'risk'):'off';
    const say=t('ps.'+state);
    return h('span',{class:'psf psf-'+(o.size||'md'),'data-state':state,'data-streak-tier':tier(days),title:say,role:'img','aria-label':(days>=start?t('ps.days',{n:days})+' · ':'')+say},
      [h('span',{class:'psf-ic',html:FLAME}),o.num===false?null:h('b',{class:'psf-n',text:String(days)})]);
  }
  function ignite(days,key){
    const h=PD.h,t=PD.i18n.t;
    const el=h('div',{class:'psf-ignite',role:'status','aria-live':'polite','data-streak-tier':tier(days)},[
      h('div',{class:'psf-burst'},[flame(days,{today:true,size:'xl',num:false}),...[0,1,2,3,4,5,6,7].map(i=>h('i',{style:'--a:'+(i*45)+'deg'}))]),
      h('b',{class:'psf-big',text:String(days)}),h('span',{text:t(key,{n:days})})]);
    document.body.appendChild(el);
    setTimeout(()=>el.classList.add('out'),1900);setTimeout(()=>el.remove(),2500);
  }
  /* ---- a chat's streak for the chat list: the server answers per conversation (chat_streak), so the list asks for a
     few at a time and keeps the answer a minute (and the last one on the device, shown at once next time) ---- */
  const chatCache=new Map(),queue=[];let active=0;
  function pump(){
    while(active<4&&queue.length){
      const [conv,res]=queue.shift();active++;
      PD.cloud.chat.streak(conv).then(v=>{chatCache.set(conv,{at:Date.now(),v});res(v);}).catch(()=>res(null)).finally(()=>{active--;pump();});
    }
  }
  function chatStreak(conv){
    const c=chatCache.get(conv);
    if(c&&Date.now()-c.at<60000)return Promise.resolve(c.v);
    return new Promise(res=>{queue.push([conv,res]);pump();});
  }
  function chatBadge(conv,el){
    const kept=PD.store.get('ps.chat',{})||{},paint=v=>{el.replaceChildren();if(v&&v.days>=3)el.appendChild(flame(v.days,{today:v.today,start:3,size:'xs'}));};
    const k=kept[conv];if(k)paint(k.day===ordinal(Date.now())?k:{days:k.days,today:false});
    if(!(PD.cloud&&PD.cloud.chat&&PD.cloud.chat.streak))return;
    chatStreak(conv).then(v=>{if(!v||!el.isConnected)return;paint(v);const all=PD.store.get('ps.chat',{})||{};all[conv]={days:v.days,today:v.today,day:ordinal(Date.now())};PD.store.set('ps.chat',all);});
  }
  return {status,summarize,ordinal,tier,track,flame,ignite,chatStreak,chatBadge};
})();
