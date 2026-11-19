// coturn REST credentials. The long-lived shared secret never leaves this function.
const cors={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'authorization, apikey, content-type, x-client-info','Access-Control-Allow-Methods':'POST, OPTIONS'};
const stun={urls:['stun:stun.l.google.com:19302','stun:stun1.l.google.com:19302']};
export function createHandler({env,fetch:request=fetch,crypto:webcrypto=crypto,now=()=>Date.now()}){
 const reply=(status,body)=>new Response(JSON.stringify(body),{status,headers:{...cors,'Content-Type':'application/json','Cache-Control':'no-store'}});
 return async req=>{
  if(req.method==='OPTIONS')return new Response(null,{headers:cors});
  if(req.method!=='POST')return reply(405,{error:'method'});
  const auth=req.headers.get('authorization')||'';if(!auth.startsWith('Bearer ')||auth.length>8192)return reply(401,{error:'sign-in-required'});
  let body;try{const text=await req.text();if(text.length>2048)return reply(400,{error:'request'});body=JSON.parse(text);}catch(_){return reply(400,{error:'request'});}
  if(typeof body?.conv!=='string'||!/^[a-f0-9]{8}-(?:[a-f0-9]{4}-){3}[a-f0-9]{12}$/i.test(body.conv))return reply(400,{error:'conversation'});
  const url=env('SUPABASE_URL'),key=env('SUPABASE_ANON_KEY');if(!url||!key)return reply(503,{error:'configuration'});
  try{
   const headers={apikey:key,Authorization:auth,'Content-Type':'application/json'};
   const who=await request(url+'/auth/v1/user',{headers,signal:AbortSignal.timeout(8000)});if(!who.ok)return reply(401,{error:'sign-in-required'});const user=await who.json();if(!user?.id)return reply(401,{error:'sign-in-required'});
   const allowed=await request(url+'/rest/v1/rpc/chat_call_allowed',{method:'POST',headers,body:JSON.stringify({conv:body.conv}),signal:AbortSignal.timeout(8000)});if(!allowed.ok||await allowed.json()!==true)return reply(403,{error:'denied'});
   const urls=(env('CALL_TURN_URLS')||'').split(/[\s,]+/).filter(Boolean),secret=env('CALL_TURN_SHARED_SECRET')||'';
   if(!urls.length||!secret)return reply(200,{relay:false,iceServers:[stun]});
   if(urls.length>6||urls.some(u=>!/^turns?:[^\s@]+$/i.test(u)))return reply(503,{error:'relay-configuration'});
   const enc=new TextEncoder(),hmac=await webcrypto.subtle.importKey('raw',enc.encode(secret),{name:'HMAC',hash:'SHA-1'},false,['sign']);
   const identity=await webcrypto.subtle.sign('HMAC',hmac,enc.encode('identity:'+user.id));const pseudonym=Array.from(new Uint8Array(identity)).slice(0,10).map(b=>b.toString(16).padStart(2,'0')).join('');
   const expires=(Math.floor(now()/1000/1800)+1)*1800+86400,username=expires+':'+pseudonym;
   const signed=await webcrypto.subtle.sign('HMAC',hmac,enc.encode(username));const credential=btoa(String.fromCharCode(...new Uint8Array(signed)));
   return reply(200,{relay:true,expires,iceServers:[stun,{urls,username,credential}]});
  }catch(_){return reply(503,{error:'temporarily-unavailable'});}
 };
}
