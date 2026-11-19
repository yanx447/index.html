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
  'ps.max':['მიღწეულია 1000 დღე','1000 days reached']
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
  PD.bus.on('session',s=>{if(qualifies(s))save([ordinal(s.date)]);});
  function status(now=Date.now()){
    const days=save(PD.lessons.progress.sessions().filter(qualifies).map(s=>ordinal(s.date)));
    return summarize(days,ordinal(now));
  }
  return {status,summarize,ordinal};
})();
