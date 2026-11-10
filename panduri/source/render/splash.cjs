/* Rebuild the static welcome pictures from the same instrument meshes as the app.
   No opening film is installed or run by the app. Render at 2x to preserve smooth edges. */
const {chromium}=require('../node_modules/playwright');const path=require('node:path');
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
 for(const [name,width,height] of [['L',1920,1080],['P',720,1280]]){
  const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:2,serviceWorkers:'block'});const page=await context.newPage();
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(process.env.APP_URL||'http://localhost:8183/panduri/app/');await page.waitForFunction(()=>window.PD?.R3D);
  const stats=await page.evaluate(async()=>{
   const geometry=PD.R3D.export;
   const nonfinite=geometry.meshes.filter(m=>![...m.pos,...m.nrm].every(Number.isFinite)).length;
   document.querySelectorAll('body > *').forEach(e=>e.style.display='none');
   const host=document.createElement('div');host.id='render-host';host.style.cssText='position:fixed;inset:0;z-index:999999;background:#100c09;overflow:hidden';document.body.appendChild(host);
   const {create}=await import('/panduri/source/src3d/intro3d.js');window.renderCtl=create(host,{still:true,pixelRatio:2});if(!renderCtl)throw Error('Renderer unavailable');renderCtl.still(18.4);
   // Straight-on camera: neither the flat tail nor the neck leans due to perspective.
   const bounds=[Infinity,Infinity,Infinity,-Infinity,-Infinity,-Infinity];
   geometry.meshes.filter(m=>m.visible&&!m.local&&!['shadow','ui','string'].includes(m.part)&&!(m.mat.alpha<.6)).forEach(m=>{
    for(let i=0;i<m.pos.length;i+=3)for(let k=0;k<3;k++){bounds[k]=Math.min(bounds[k],m.pos[i+k]);bounds[k+3]=Math.max(bounds[k+3],m.pos[i+k]);}
   });
   const wide=innerWidth>innerHeight, fov=42, aspect=innerWidth/innerHeight;
   const spanX=wide?bounds[4]-bounds[1]:bounds[3]-bounds[0],spanY=wide?bounds[3]-bounds[0]:bounds[4]-bounds[1];
   const d=Math.max(spanY/(2*Math.tan(fov*Math.PI/360)*.84),spanX/(2*Math.tan(fov*Math.PI/360)*aspect*.88))+bounds[5];
   const target=[(bounds[0]+bounds[3])/2,(bounds[1]+bounds[4])/2,0];
   renderCtl.debugCam([target[0],target[1],d],target,wide?[-1,0,0]:[0,1,0],fov,0);
   return {nonfinite,meshes:geometry.meshes.length,preamp:geometry.meshes.filter(m=>m.part==='preamp').length,jack:geometry.meshes.filter(m=>m.part==='jack').length};
  });
  await page.waitForTimeout(500);
  const file=path.join(__dirname,'../assets',`pan-splash${name}.jpg`);
  await page.locator('#render-host').screenshot({path:file,type:'jpeg',quality:92,timeout:120000});
  if(errors.length||stats.nonfinite)throw Error(JSON.stringify({errors,stats}));
  console.log(JSON.stringify({file,width:width*2,height:height*2,...stats}));await context.close();
 }
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
