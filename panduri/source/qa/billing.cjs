const {test}=require('node:test');
const assert=require('node:assert/strict'), vm=require('node:vm'), fs=require('node:fs'), path=require('node:path');
function setup(native=true, available=true) {
 const calls=[], saved=new Map(), listeners={}, redirects=[];
 const uid='12345678-1234-1234-1234-123456789abc';
 const packages=[{packageType:'MONTHLY',product:{priceString:'$5.99'}},{packageType:'ANNUAL',product:{priceString:'$49.99'}}];
 const sdk={configure:async v=>calls.push(['configure',v]),logIn:async v=>calls.push(['logIn',v]),getOfferings:async()=>({current:{availablePackages:packages}}),purchasePackage:async v=>calls.push(['purchasePackage',v]),restorePurchases:async()=>calls.push(['restorePurchases'])};
 const cloud={uid,native,configured:true,session:{},profile:null,isAdmin:false,isOwner:false,
   billing:async v=>{calls.push(['billing',v]); if(v.action==='catalog')return {stores:{ios:'public-test-key'},providers:[{id:'tbc',prices:{monthly:{value:'14.99',currency:'GEL'}}}]}; if(v.action==='start')return {provider:'tbc',order:'order1',url:'https://tpay.tbcbank.ge/checkout/order1'};if(v.action==='verify')return {paid:false};return {};},
   loadProfile:async()=>calls.push(['loadProfile'])};
 const context={PD:{cloud,store:{get:(k,d)=>saved.has(k)?saved.get(k):d,set:(k,v)=>saved.set(k,v),del:k=>saved.delete(k)},bus:{on:(k,f)=>listeners[k]=f},i18n:{add(){}}},window:{addEventListener(){},Capacitor:{getPlatform:()=> native === true ? 'ios' : native === 'desktop' ? 'electron' : 'web',isPluginAvailable:()=>available,registerPlugin:()=>sdk}},document:{addEventListener(){}},location:{search:'',assign:u=>redirects.push(u)},setTimeout(){},Date,URL,URLSearchParams,Set,Map,Intl};
 vm.createContext(context);
 for(const name of ['billing','premium'])vm.runInContext(fs.readFileSync(path.join(__dirname,'../src',name+'.js'),'utf8'),context);
 return {B:context.PD.billing,P:context.PD.premium,cloud,calls,saved,redirects,packages};
}
test('Native prices come from the store and native purchases never redirect to web payment',async()=>{
 const x=setup();const options=await x.B.options();assert.equal(options.providers[0].prices.monthly.display,'$5.99');
 await x.B.purchase('monthly','paypal',options.packages.monthly);
 assert.equal(x.redirects.length,0);assert.equal(x.calls.find(v=>v[0]==='configure')[1].appUserID,x.cloud.uid);assert.equal(x.calls.filter(v=>v[0]==='billing').some(v=>v[1].action==='start'),false);
 assert.equal(x.calls.find(v=>v[0]==='purchasePackage')[1].aPackage,x.packages[0]);assert.equal(x.P.active,false,'SDK purchase result must not unlock cached profile');
 assert.ok(x.calls.some(v=>v[0]==='billing'&&v[1].action==='sync-store'));
});
test('A missing native plugin fails closed',async()=>{const x=setup(true,false);await assert.rejects(x.B.purchase('monthly','paypal'),/billing-not-configured/);assert.equal(x.redirects.length,0)});
test('Restore calls store restore and server verification',async()=>{const x=setup();assert.equal(await x.B.restore(),false);assert.ok(x.calls.some(v=>v[0]==='restorePurchases'));assert.ok(x.calls.some(v=>v[0]==='billing'&&v[1].action==='sync-store'))});
test('Changing app account changes the store identity before next purchase',async()=>{const x=setup();await x.B.options();x.cloud.uid='other-user';await x.B.options();assert.equal(x.calls.find(v=>v[0]==='logIn')[1].appUserID,'other-user')});
test('Web checkout saves buyer-specific pending order and redirects to verified host',async()=>{const x=setup(false);await x.B.purchase('monthly','tbc');assert.equal(x.redirects[0],'https://tpay.tbcbank.ge/checkout/order1');assert.equal(x.saved.get('billing.pending.'+x.cloud.uid).order,'order1')});
test('Unexpected checkout host and anonymous purchases fail',async()=>{const x=setup(false);x.cloud.billing=async()=>({url:'https://attacker.example/',order:'order1',provider:'tbc'});await assert.rejects(x.B.purchase('monthly','tbc'),/invalid-checkout/);assert.equal(x.redirects.length,0);x.cloud.session=null;await assert.rejects(x.B.purchase('monthly','tbc'),/sign-in-required/)});
test('Server store expiry and owner ban determine Premium; admin role alone does not',()=>{const x=setup();x.cloud.isAdmin=true;assert.equal(x.P.active,false);x.cloud.profile={store_until:'2090-01-01'};assert.equal(x.P.active,true);x.cloud.profile.premium_banned=true;assert.equal(x.P.active,false);x.cloud.isOwner=true;assert.equal(x.P.active,true)});

test('Desktop Capacitor shell uses hosted checkout',async()=>{const x=setup('desktop');assert.equal(x.B.native,false);await x.B.purchase('monthly','tbc');assert.equal(x.redirects[0],'https://tpay.tbcbank.ge/checkout/order1');assert.equal(x.calls.some(v=>v[0]==='configure'),false)});
