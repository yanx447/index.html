/* Audio waveform and player shared by the recorder preview and sent messages. */
PD.i18n.add({
  'vw.play':['ხმოვანის დაკვრა','Play voice message'], 'vw.pause':['ხმოვანის დაპაუზება','Pause voice message'],
  'vw.seek':['ხმოვანის გადახვევა','Seek voice message'], 'vw.download':['ხმოვანის ჩამოტვირთვა','Download voice message'],
  'vw.unavailable':['ხმოვანი ვერ ჩაიტვირთა. სცადე ხელახლა.','Could not load the recording. Try again.'],
  'vw.downloadFailed':['ფაილი ვერ ჩამოიტვირთა.','Could not download the recording.'],
  'vw.attach':['მიმაგრება','Attach']
});
PD.voiceWave = (() => {
  const h=PD.h, count=42;
  const time=seconds=>Math.floor(seconds/60)+':'+String(Math.floor(seconds%60)).padStart(2,'0');
  function normalize(samples){
    if(!samples.length)return [];
    const n=Math.min(count,samples.length);
    const peaks=Array.from({length:n},(_,i)=>{
      const start=Math.floor(i*samples.length/n),end=Math.floor((i+1)*samples.length/n);
      let max=0;
      for(let j=start;j<end;j++)max=Math.max(max,Math.abs(samples[j]));
      return max;
    });
    const top=Math.max(.015,...peaks);
    return peaks.map(v=>Math.min(100,Math.round(Math.sqrt(v/top)*100)));
  }
  function valid(value){
    return Array.isArray(value)&&value.length<=count&&value.every(v=>Number.isInteger(v)&&v>=0&&v<=100)?value:[];
  }
  const glyph=(d)=>'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+d+'</svg>';
  const playIcon=glyph('<path d="m9 5 11 7-11 7z" fill="currentColor" stroke="none"/>');
  const pauseIcon=glyph('<path d="M9 6v12m6-12v12" stroke-width="2.6"/>');
  const downloadIcon=glyph('<path d="M12 3v12m-5-5 5 5 5-5M4 17v4h16v-4"/>');
  function filename(path){
    const ext=String(path||'').match(/\.(webm|m4a|mp4|ogg|wav|mp3|aac)$/i)?.[1]||'webm';
    return 'Panduri-voice.'+ext;
  }
  async function decode(blob){
    const Audio=window.AudioContext||window.webkitAudioContext;
    if(!Audio||blob.size>25*1048576)return null;
    const ctx=new Audio();
    try{
      const buffer=await ctx.decodeAudioData(await blob.arrayBuffer());
      return {wave:normalize(buffer.getChannelData(0)),duration:buffer.duration};
    }
    finally{ctx.close().catch(()=>{});}
  }
  function player({source,load,name=filename(),duration=0,wave,preview=false}={}){
    const audio=h('audio',{preload:'none',playsinline:true,class:'vw-native'});
    const play=h('button',{type:'button',class:'vw-play','aria-label':t('vw.play'),html:playIcon});
    const download=h('button',{type:'button',class:'vw-download','aria-label':t('vw.download'),title:t('vw.download'),html:downloadIcon});
    const track=h('div',{class:'vw-track','aria-hidden':'true'});
    const seek=h('input',{type:'range',class:'vw-seek',min:0,max:1000,step:1,value:0,'aria-label':t('vw.seek'),disabled:true});
    const clock=h('span',{class:'vw-clock'});
    const root=h('div',{class:'vw-player',hidden:preview},[audio,play,h('div',{class:'vw-meter'},[h('div',{class:'vw-scrub'},[track,seek]),clock]),download]);
    let hint=Number(duration)||0, url=source||'', peaks=valid(wave), decoded=false, pending=null, ownURL=null, loadRequest=null;
    function renderWave(values){
      peaks=valid(values);track.classList.toggle('vw-empty',!peaks.length);
      track.replaceChildren(...(peaks.length?peaks:Array(count).fill(0)).map(value=>h('i',{style:'--peak:'+value+'%'})));
    }
    function fillTrack(){
      const portion=Number(seek.value)/1000;
      [...track.children].forEach((bar,index)=>bar.classList.toggle('on',(index+.5)/track.children.length<=portion));
    }
    function total(){return Number.isFinite(audio.duration)&&audio.duration>0?audio.duration:hint;}
    function paint(){
      const length=total(), current=Math.min(length||Infinity,audio.currentTime||0), position=length?Math.min(1000,current/length*1000):0;
      seek.disabled=!length||(!url&&!load);if(pending===null)seek.value=Math.round(position);
      fillTrack();
      seek.setAttribute('aria-valuetext',time(current)+' / '+(length?time(length):'—'));
      clock.textContent=time(current)+' / '+(length?time(length):'—');
      play.setAttribute('aria-label',t(audio.paused?'vw.play':'vw.pause'));play.innerHTML=audio.paused?playIcon:pauseIcon;
    }
    async function resolveSource(){
      if(!load)return url;
      if(!loadRequest)loadRequest=Promise.resolve().then(load).finally(()=>loadRequest=null);
      return await loadRequest||url;
    }
    function setAudio(next){
      if(!next)return false;
      url=next;if(audio.getAttribute('src')!==next)audio.src=next;else if(audio.error)audio.load();
      return true;
    }
    async function loadWave(next){
      if(decoded||peaks.length||!next)return;decoded=true;
      try{
        const response=await fetch(next);if(!response.ok)return;
        const decodedAudio=await decode(await response.blob());
        if(!decodedAudio||url!==next)return;
        if(!hint)hint=decodedAudio.duration;
        renderWave(decodedAudio.wave);paint();
      }catch(_){}
    }
    function applySeek(){
      const length=total();
      if(pending===null||!length||!audio.readyState)return;
      const target=pending/1000*length;
      try{audio.currentTime=target;pending=null;}catch(_){}
    }
    for(const event of ['timeupdate','play','pause','ended','durationchange','loadedmetadata','canplay']){
      audio.addEventListener(event,()=>{if(event!=='timeupdate')applySeek();paint();});
    }
    audio.addEventListener('error',paint);
    play.onclick=async()=>{
      if(!audio.paused){audio.pause();return;}
      play.disabled=true;
      try{
        if(!setAudio(url&&!audio.error?url:await resolveSource()))throw Error('missing audio');
        document.querySelectorAll('.vw-native').forEach(other=>{if(other!==audio)other.pause();});
        applySeek();await audio.play();loadWave(url);
      }catch(_){PD.ui.toast(t('vw.unavailable'));}finally{play.disabled=false;paint();}
    };
    seek.oninput=()=>{
      pending=Number(seek.value);fillTrack();
      if(audio.readyState){applySeek();return;}
      audio.preload='metadata';
      resolveSource().then(next=>{if(setAudio(next)&&audio.readyState)applySeek();}).catch(()=>PD.ui.toast(t('vw.unavailable')));
    };
    download.onclick=async()=>{
      download.disabled=true;
      try{
        const next=await resolveSource();if(!next)throw Error('missing audio');
        const response=await fetch(next);if(!response.ok)throw Error('download failed');
        const blob=await response.blob(),object=URL.createObjectURL(blob);
        const link=h('a',{href:object,download:name});document.body.append(link);link.click();link.remove();
        setTimeout(()=>URL.revokeObjectURL(object),30000);
      }catch(_){PD.ui.toast(t('vw.downloadFailed'));}finally{download.disabled=false;}
    };
    renderWave(peaks);paint();
    if(!preview&&load&&peaks.length===0&&typeof IntersectionObserver==='function'){
      const observer=new IntersectionObserver(entries=>{
        if(!entries.some(e=>e.isIntersecting))return;
        observer.disconnect();resolveSource().then(next=>{if(!url)url=next;loadWave(next);}).catch(()=>{});
      });
      observer.observe(root);
    }
    return {root,audio,reset(){
      audio.pause();audio.removeAttribute('src');audio.load();if(ownURL)URL.revokeObjectURL(ownURL);
      ownURL=null;url='';hint=0;pending=null;root.hidden=true;renderWave([]);
    },set(file,length,values){
      ownURL=URL.createObjectURL(file);url=ownURL;hint=length;name=file.name;pending=null;audio.playbackRate=1;audio.preload='metadata';setAudio(url);renderWave(values);root.hidden=false;paint();
    }};
  }
  function message(m){
    const path=m.media_path;
    return player({source:PD.cloud.storage.url(path),load:async()=>{await PD.social.urls([m]);return PD.cloud.storage.url(path);},name:filename(path),duration:m.media_meta?.dur,wave:m.media_meta?.wave}).root;
  }
  return {message,player,normalize};
})();
