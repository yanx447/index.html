// Offline repair, using the existing anatomical rig. No changes to bone lengths.
// node render/repair-poses.cjs geometry.json positions.json output.json
const fs=require('node:fs'),path=require('node:path');
const dir=__dirname;
const rigAPI=new Function(fs.readFileSync(path.join(dir,'rig.js'),'utf8').replace(/export /g,'')+';return {makeRig,V,Q}')();
const geo=JSON.parse(fs.readFileSync(process.argv[2]));
const rig=JSON.parse(fs.readFileSync(path.join(dir,'rig.json')));
global.window={HS:{...geo,...rigAPI,rigs:{L:rigAPI.makeRig(rig,'L')},TH:{fretFrac:n=>geo.frets[n]},hideArm:()=>{}},ITERS:Number(process.env.ITERS||350),POSE_LIST:JSON.parse(fs.readFileSync(process.argv[3])),SEEDS:{...JSON.parse(fs.readFileSync(path.join(dir,'out/poses_final.json'))),...(process.env.SEEDS?JSON.parse(fs.readFileSync(process.env.SEEDS)): {})}};
const solverAPI=new Function(fs.readFileSync(path.join(dir,'solve.js'),'utf8').replace(/export /g,'')+';return {solver,pack,unpack,toPose}')();
let job=fs.readFileSync(path.join(dir,'allposes.js'),'utf8').replace("import { solver, pack } from './solve.js';",'');
job=job.replace("out[key] = best;", "out[key] = best; save(out, key, best);");
// Retain surface extrema in axial/angular bins, with their actual skin weights.
// Joint-centre capsules alone miss the wide ventral surface of the thumb.
const mesh=JSON.parse(fs.readFileSync(path.join(dir,'OBArms_Obj.002.json'))), rg=window.HS.rigs.L, V=rigAPI.V;
const bins=new Map(), distal=new Set(), leftVertices=[];
for(let i=0;i<mesh.pos.length/3;i++) {
  let g=null,bw=0; const raw=mesh.pos.slice(i*3,i*3+3);
  for(let j=0;j<4;j++){const w=mesh.sw[i*4+j],n=mesh.groups[mesh.si[i*4+j]];if(w>bw&&/(finger_|thumb).*\.L$/.test(n)){g=n;bw=w}}
  if(bw<.5)continue; leftVertices.push(i); if(g.includes('.03.'))distal.add(i);
  const ax=rg.axes[g],d=ax.d,off=V.sub(raw,rg.H[g]),length=V.len(V.sub(rg.T[g],rg.H[g]));
  const u=V.nrm(V.cross(d,Math.abs(d[2])<.9?[0,0,1]:[0,1,0])),v=V.cross(d,u);
  const along=V.dot(off,d),x=V.dot(off,u),y=V.dot(off,v),r=Math.hypot(x,y);
  const key=g+':'+Math.floor(along/length*3)+':'+Math.floor((Math.atan2(y,x)+Math.PI)/(Math.PI/4));
  if(!bins.has(key)||bins.get(key).r<r)bins.set(key,{i,r});
}
const skinWeights=i=>{const raw=mesh.pos.slice(i*3,i*3+3),a=[];for(let j=0;j<4;j++){const w=mesh.sw[i*4+j],n=mesh.groups[mesh.si[i*4+j]];if(w&&rg.H[n])a.push({n,w,p:V.sub(raw,rg.H[n])});}return a;};
window.HS.surface=[...new Set([...distal,...[...bins.values()].map(x=>x.i)])].map(skinWeights);
window.HS.padSamples={}; window.HS.thumbPads=[]; window.HS.contactSamples={};
for(const fn of ['thumb','finger_index','finger_middle','finger_ring','finger_pinky']){
 const contactName=fn.replace('finger_',''); window.HS.contactSamples[contactName]=[];
 const n=fn+'.03.L',ax=rg.axes[n],dr=fn==='thumb'?ax.dorsal:rg.dorsal,L=V.len(V.sub(rg.T[n],rg.H[n]));let chosen=-1,best=Infinity;
 for(let i=0;i<mesh.pos.length/3;i++){
  let weight=0;for(let j=0;j<4;j++)if(mesh.groups[mesh.si[i*4+j]]===n)weight+=mesh.sw[i*4+j];if(weight<.6)continue;
  const raw=mesh.pos.slice(i*3,i*3+3),off=V.sub(raw,rg.H[n]),along=V.dot(off,ax.d)/L;
  if(along>.25)window.HS.contactSamples[contactName].push(skinWeights(i));
  if(fn==='thumb' && along>.45 && along<.95 && V.dot(off,dr)*geo.SC < -3) window.HS.thumbPads.push(skinWeights(i));
  if(along<.5||along>.85)continue;
  const score=V.dot(off,dr)*geo.SC+Math.abs(along-.7)*15;
  if(score<best){best=score;chosen=i;}
 }
 const raw=mesh.pos.slice(chosen*3,chosen*3+3),weights=[];
 for(let j=0;j<4;j++){const w=mesh.sw[chosen*4+j],g=mesh.groups[mesh.si[chosen*4+j]];if(w&&rg.H[g])weights.push({n:g,w,p:V.sub(raw,rg.H[g])});}
 window.HS.padSamples[n]=weights;
}
// The thumb can stop the bass with its distal or middle pad.
for(let i=0;i<mesh.pos.length/3;i++){let w=0;for(let j=0;j<4;j++)if(mesh.groups[mesh.si[i*4+j]]==='thumb.02.L')w+=mesh.sw[i*4+j];if(w>.6)window.HS.contactSamples.thumb.push(skinWeights(i));}
const SV=solverAPI.solver(window.HS,'L'), checked=new Set([...distal,...[...bins.values()].map(x=>x.i)]);
window.fullCheck=vector=>{
 const F=rg.fk(solverAPI.toPose(rg,geo.SC,solverAPI.unpack(vector)));let max=0,added=0;
 for(const i of leftVertices){let pt=[0,0,0];for(const a of skinWeights(i)){const w=F.W[a.n];pt=V.add(pt,V.mul(V.add(w.p,rigAPI.Q.rot(w.q,a.p)),a.w));}pt=V.mul(pt,geo.SC);const d=SV.N.pen(pt,0,false);max=Math.max(max,d);
 if(d>.1&&!checked.has(i)){checked.add(i);window.HS.surface.push(skinWeights(i));added++;}}
 return {max,added};
};
console.log('surface samples',window.HS.surface.length);
const start=Date.now();
new Function('solver','pack','save',job)(solverAPI.solver,solverAPI.pack,(out,key,best)=>{fs.writeFileSync(process.argv[4],JSON.stringify(out));console.log(Object.keys(out).length,key,'tip',best.worst,'collision',best.collision,'seconds',Math.round((Date.now()-start)/1000));});
