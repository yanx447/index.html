// Web Push without a library: VAPID (RFC 8292) and the aes128gcm message encryption (RFC 8291), on WebCrypto only,
// so the same file runs in the Edge Function (Deno) and in the tests (Node).
const subtle = globalThis.crypto.subtle;
const enc = new TextEncoder();

export const b64u = bytes => btoa(String.fromCharCode(...new Uint8Array(bytes))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
export const unb64u = s => { const t = String(s).replace(/-/g, '+').replace(/_/g, '/'); const raw = atob(t + '='.repeat((4 - t.length % 4) % 4)); return Uint8Array.from(raw, c => c.charCodeAt(0)); };
const cat = (...parts) => { const out = new Uint8Array(parts.reduce((n, p) => n + p.length, 0)); let i = 0; for (const p of parts) { out.set(p, i); i += p.length; } return out; };
async function hmac(key, data) { const k = await subtle.importKey('raw', key, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']); return new Uint8Array(await subtle.sign('HMAC', k, data)); }

/** a new key pair for the server: the public half goes to the browsers, the private half never leaves the server */
export async function vapidKeys() {
  const kp = await subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-256' }, true, ['sign', 'verify']);
  const jwk = await subtle.exportKey('jwk', kp.privateKey);
  const pub = new Uint8Array(await subtle.exportKey('raw', kp.publicKey));
  return { publicKey: b64u(pub), privateJwk: { kty: 'EC', crv: 'P-256', x: jwk.x, y: jwk.y, d: jwk.d } };
}

/** the Authorization header for one push service: a signed, short-lived token naming the service and who sends */
export async function vapidHeader(endpoint, keys, subject, now = Date.now()) {
  const aud = new URL(endpoint).origin;
  const head = b64u(enc.encode(JSON.stringify({ typ: 'JWT', alg: 'ES256' })));
  const claims = b64u(enc.encode(JSON.stringify({ aud, exp: Math.floor(now / 1000) + 12 * 3600, sub: subject })));
  const key = await subtle.importKey('jwk', { ...keys.privateJwk, ext: true }, { name: 'ECDSA', namedCurve: 'P-256' }, false, ['sign']);
  const sig = new Uint8Array(await subtle.sign({ name: 'ECDSA', hash: 'SHA-256' }, key, enc.encode(head + '.' + claims)));   // already r‖s, as JWS wants
  return 'vapid t=' + head + '.' + claims + '.' + b64u(sig) + ', k=' + keys.publicKey;
}

/** RFC 8291: the body only the receiving browser can read. salt and the sender key pair may be given (tests). */
export async function encrypt(payload, p256dh, authSecret, fixed) {
  const ua = unb64u(p256dh), auth = unb64u(authSecret);
  const local = fixed && fixed.keyPair || await subtle.generateKey({ name: 'ECDH', namedCurve: 'P-256' }, true, ['deriveBits']);
  const asPub = new Uint8Array(await subtle.exportKey('raw', local.publicKey));
  const uaKey = await subtle.importKey('raw', ua, { name: 'ECDH', namedCurve: 'P-256' }, false, []);
  const shared = new Uint8Array(await subtle.deriveBits({ name: 'ECDH', public: uaKey }, local.privateKey, 256));
  const salt = fixed && fixed.salt || globalThis.crypto.getRandomValues(new Uint8Array(16));
  // IKM = HKDF(auth, shared, "WebPush: info" ‖ 0 ‖ ua ‖ as, 32)
  const prkKey = await hmac(auth, shared);
  const ikm = await hmac(prkKey, cat(enc.encode('WebPush: info\0'), ua, asPub, new Uint8Array([1])));
  const prk = await hmac(salt, ikm);
  const cek = (await hmac(prk, cat(enc.encode('Content-Encoding: aes128gcm\0'), new Uint8Array([1])))).slice(0, 16);
  const nonce = (await hmac(prk, cat(enc.encode('Content-Encoding: nonce\0'), new Uint8Array([1])))).slice(0, 12);
  const key = await subtle.importKey('raw', cek, { name: 'AES-GCM' }, false, ['encrypt']);
  const plain = cat(typeof payload === 'string' ? enc.encode(payload) : payload, new Uint8Array([2]));   // one record, the last: delimiter 2, no padding
  const ct = new Uint8Array(await subtle.encrypt({ name: 'AES-GCM', iv: nonce, tagLength: 128 }, key, plain));
  const rs = new Uint8Array([0, 0, 16, 0]);   // record size 4096
  return cat(salt, rs, new Uint8Array([asPub.length]), asPub, ct);
}

/** one message to one browser. Returns the push service's status: 201 delivered, 404/410 gone (forget the device). */
export async function send(sub, payload, keys, subject, opts = {}) {
  const body = await encrypt(JSON.stringify(payload), sub.p256dh, sub.auth);
  const headers = {
    Authorization: await vapidHeader(sub.endpoint, keys, subject),
    'Content-Encoding': 'aes128gcm', 'Content-Type': 'application/octet-stream',
    TTL: String(opts.ttl || 86400), Urgency: opts.urgency || 'normal'
  };
  if (opts.topic) headers.Topic = String(opts.topic).replace(/[^A-Za-z0-9_-]/g, '').slice(0, 32);
  const r = await (opts.fetch || fetch)(sub.endpoint, { method: 'POST', headers, body, signal: AbortSignal.timeout(10000) });
  return r.status;
}
