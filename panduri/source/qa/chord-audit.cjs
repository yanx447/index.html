const {chromium}=require('playwright');const fs=require('node:fs');const assert=require('node:assert/strict');
(async()=>{const b=await chromium.launch({channel:'chrome',headless:true,args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});try{
const p=await b.newPage({viewport:{width:1100,height:900},serviceWorkers:'block'});const errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto(process.env.APP_URL||'http://localhost:8181/panduri/app/');await p.waitForFunction(()=>window.PD?.theory);await p.evaluate(()=>{PD.store.set('sima.nudge',false);PD.store.set('ce.dim','2d');document.querySelectorAll('.ag,.ob,.cine,.cine-boot').forEach(x=>x.remove());document.documentElement.classList.add('rm');PD.app.go('chords')});
const report=await p.evaluate(async()=>{
 const T=PD.theory,lib=PD.curriculum.chords(), issues=[],wanted=new Map();
 const add=(c,v)=>{const key=v.frets.join('-')+'/'+v.fingers.join('');wanted.set(key,{name:c.name,...v});
 if(v.frets[0]>0&&v.fingers[0]!=='T')issues.push('bass '+c.name+':'+key);
 const typ=T.CHORD_TYPES.find(t=>t.k===c.q),pcs=v.frets.map((f,i)=>T.pc(T.midi(i+1,f)));
 if(typ&&(!pcs.every(pc=>typ.iv.some(iv=>(iv+c.root)%12===pc))||(v.fsrc!=='teacher'&&![typ.need,...(typ.alt||[])].some(nd=>nd.every(iv=>pcs.includes((iv+c.root)%12))))))issues.push('notes '+c.name+':'+key);
 v.frets.forEach((f,i)=>{if((f===0)!==(v.fingers[i]===0))issues.push('open finger '+key)});
 };
 lib.forEach(c=>{if(c.none||!c.voicings.length)issues.push('missing '+c.name);(c.voicings||[]).forEach(v=>add(c,v))});
 // Every catalogue card, including non-primary shape groups.
 document.querySelectorAll('.cgrid button').forEach(btn=>{const name=btn.firstChild.textContent,fr=btn.title;const c=lib.find(c=>c.name===name);if(!c)return;const v=(c.voicings||[]).find(v=>v.frets.join('-')===fr)||T.voicings(c.root,c.q).find(v=>v.frets.join('-')===fr);if(v)add(c,v);else issues.push('unresolved card '+name+':'+fr)});
 const H=await import(new URL('hand3d.js',document.baseURI).href);
 return {chords:lib.length,positions:wanted.size,issues,missing3d:[...wanted.entries()].filter(([k,v])=>!H.has(v.frets,v.fingers)).map(([k])=>k),wanted:[...wanted.entries()],catalogue:[...document.querySelectorAll('.cgrid button')].map(b=>({name:b.firstChild.textContent,frets:b.title})),f6:T.voicingInfo(5,'6',[0,1,1]),f:T.voicingInfo(5,'',[3,4,5])};
});
fs.writeFileSync('/tmp/panduri-chord-audit.json',JSON.stringify(report,null,2));assert.equal(report.chords,300);assert.deepEqual(report.issues,[]);assert.equal(report.f6.exact[0].name,'Dm/A');assert.deepEqual(report.f6.missing,[7]);assert.equal(report.f.bass,0);
for(const [name,frets,fingers] of [['Csus2','3-1-3',['T',1,3]],['C7sus4','8-9-8',['T',2,1]],['Am','7-8-8',['T',1,1]],['Fm(add9)',null,null],['F6',null,null],['F',null,null]]){
 await p.evaluate(({name,frets})=>PD.app.go('chords',name+(frets?'|'+frets:'')),{name,frets});await p.waitForTimeout(150);
 if(fingers){const text=await p.locator('.ce-accs').textContent();assert.ok(text.includes(fingers.join(' · ')),name+' uses actual position fingers')}
 if(name==='F6')assert.equal(await p.locator('.ce-name h2').textContent(),'Dm/A');
 if(name==='F')assert.ok((await p.locator('.ce-acts').textContent()).includes('F/C'));
}
assert.deepEqual(errors,[]);console.log(JSON.stringify({chords:report.chords,positions:report.positions,missing3d:report.missing3d.length,errors}));
}finally{await b.close()}})().catch(e=>{console.error(e);process.exitCode=1});
