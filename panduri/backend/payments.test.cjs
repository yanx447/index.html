const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
async function load(name, options={}) {
 let handler, created, granted;
 const user=options.user===false?null:{id:'verified-user'};
 const db={auth:{getUser:async()=>({data:{user},error:null})},from:()=>({select:()=>({eq:()=>({single:async()=>({data:{premium_banned:!!options.banned}})})})}),rpc:async(n,args)=>{granted=args;return {error:null}}};
 class Stripe {static createSubtleCryptoProvider(){}; checkout={sessions:{create:async args=>{created=args;return {url:'https://checkout.stripe.com/test'}} ,retrieve:async()=>options.session}};webhooks={constructEventAsync:async()=>{if(options.badSignature)throw Error();return {type:'checkout.session.completed',data:{object:{id:'cs_test'}}}}}}
 let src=fs.readFileSync(require('path').join(__dirname, 'supabase/functions', name, 'index.ts'),'utf8').replace(/^import .*;\n/gm,'').replace(/Deno.env.get\(([^)]*)\)!/g,'Deno.env.get($1)').replace('body: unknown','body').replace('let event: Stripe.Event','let event').replace(' as Stripe.Checkout.Session','');
 vm.runInNewContext(src,{Stripe,createClient:()=>db,Deno:{env:{get:k=>k==='APP_ORIGIN'?'https://app.example':'test'},serve:f=>handler=f},Response,JSON});
 return {call:handler,created:()=>created,granted:()=>granted};
}
(async()=>{
 const req=plan=>new Request('https://edge.example',{method:'POST',headers:{Authorization:'Bearer token','Content-Type':'application/json'},body:JSON.stringify({plan,user_id:'attacker',amount:1})});
 let app=await load('checkout',{user:false});assert.equal((await app.call(req('monthly'))).status,401);
 app=await load('checkout',{banned:true});assert.equal((await app.call(req('monthly'))).status,403);
 app=await load('checkout');assert.equal((await app.call(req('free'))).status,400);
 assert.equal((await app.call(req('monthly'))).status,200);assert.equal(app.created().line_items[0].price_data.unit_amount,1499);assert.equal(app.created().client_reference_id,'verified-user');
 await app.call(req('yearly'));assert.equal(app.created().line_items[0].price_data.unit_amount,11999);
 app=await load('stripe-webhook',{badSignature:true});assert.equal((await app.call(req('monthly'))).status,400);assert.equal(app.granted(),undefined);
 const session={id:'cs_test',mode:'payment',payment_status:'paid',currency:'gel',amount_total:1499,client_reference_id:'verified-user',metadata:{user_id:'verified-user',plan:'monthly'}};
 app=await load('stripe-webhook',{session});assert.equal((await app.call(req('monthly'))).status,200);assert.equal(app.granted().target,'verified-user');
 app=await load('stripe-webhook',{session:{...session,amount_total:1}});assert.equal((await app.call(req('monthly'))).status,400);assert.equal(app.granted(),undefined);
 app=await load('stripe-webhook',{session:{...session,payment_status:'unpaid'}});await app.call(req('monthly'));assert.equal(app.granted(),undefined);
 console.log('Checkout/webhook mocked checks passed (auth, ban, plans, prices, account binding, signature failure, paid/unpaid).');
})().catch(e=>{console.error(e);process.exitCode=1});
