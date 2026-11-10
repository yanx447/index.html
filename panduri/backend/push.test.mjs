// Web Push as the browser sees it: the receiving side below is written from RFC 8291 with node:crypto
// (ECDH, HKDF, AES-128-GCM), independently of the WebCrypto code it checks. The same output was also
// decrypted by the http_ece library that the web-push package uses (2026-11-09).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { encrypt, vapidKeys, vapidHeader, send, unb64u } from './supabase/functions/_shared/webpush.js';

const b64u = b => Buffer.from(b).toString('base64url');
function receive(body, ua, auth) {
  const salt = body.subarray(0, 16), rs = body.readUInt32BE(16), idlen = body[20], asPub = body.subarray(21, 21 + idlen), ct = body.subarray(21 + idlen);
  assert.equal(rs, 4096); assert.equal(idlen, 65);
  const shared = ua.computeSecret(asPub);
  const ikm = Buffer.from(crypto.hkdfSync('sha256', shared, auth, Buffer.concat([Buffer.from('WebPush: info\0'), ua.getPublicKey(), asPub]), 32));
  const cek = Buffer.from(crypto.hkdfSync('sha256', ikm, salt, Buffer.from('Content-Encoding: aes128gcm\0'), 16));
  const nonce = Buffer.from(crypto.hkdfSync('sha256', ikm, salt, Buffer.from('Content-Encoding: nonce\0'), 12));
  const d = crypto.createDecipheriv('aes-128-gcm', cek, nonce); d.setAuthTag(ct.subarray(ct.length - 16));
  const plain = Buffer.concat([d.update(ct.subarray(0, ct.length - 16)), d.final()]);
  assert.equal(plain[plain.length - 1], 2, 'the last record ends with delimiter 2');
  return plain.subarray(0, plain.length - 1).toString('utf8');
}

test('a notification is readable by the subscribed browser only', async () => {
  const ua = crypto.createECDH('prime256v1'); ua.generateKeys();
  const auth = crypto.randomBytes(16);
  const msg = JSON.stringify({ title: 'სიმა · ახალი წერილი', body: 'ანა გწერს: „გამარჯობა“', go: 'community:c:x' });
  const body = Buffer.from(await encrypt(msg, b64u(ua.getPublicKey()), b64u(auth)));
  assert.equal(receive(body, ua, auth), msg);
  const other = crypto.createECDH('prime256v1'); other.generateKeys();
  assert.throws(() => receive(body, other, auth));
  assert.throws(() => receive(body, ua, crypto.randomBytes(16)));
  assert.ok(body.length < 4096, 'fits one push message');
});

test('the VAPID token names the push service and is signed by the server key', async () => {
  const k = await vapidKeys();
  assert.equal(unb64u(k.publicKey).length, 65);
  assert.ok(k.privateJwk.d && !('d' in { publicKey: k.publicKey }));
  const h = await vapidHeader('https://web.push.apple.com/QK1/abc', k, 'https://yanx447.github.io', Date.UTC(2026, 10, 9));
  const [, tok, key] = h.match(/^vapid t=([^,]+), k=(.+)$/);
  assert.equal(key, k.publicKey);
  const [hd, cl, sg] = tok.split('.');
  const pub = crypto.createPublicKey({ key: { kty: 'EC', crv: 'P-256', x: b64u(unb64u(key).subarray(1, 33)), y: b64u(unb64u(key).subarray(33)) }, format: 'jwk' });
  assert.ok(crypto.verify('sha256', Buffer.from(hd + '.' + cl), { key: pub, dsaEncoding: 'ieee-p1363' }, Buffer.from(sg, 'base64url')));
  const claims = JSON.parse(Buffer.from(cl, 'base64url'));
  assert.deepEqual(claims, { aud: 'https://web.push.apple.com', exp: Date.UTC(2026, 10, 9) / 1000 + 43200, sub: 'https://yanx447.github.io' });
});

test('send() posts the encrypted body with the headers push services require', async () => {
  const ua = crypto.createECDH('prime256v1'); ua.generateKeys();
  const auth = crypto.randomBytes(16), k = await vapidKeys();
  let seen = null;
  const status = await send({ endpoint: 'https://fcm.googleapis.com/fcm/send/xyz', p256dh: b64u(ua.getPublicKey()), auth: b64u(auth) }, { title: 'T', body: 'B' }, k, 'https://x.example',
    { urgency: 'high', topic: 'c:1234-ab', fetch: async (url, init) => { seen = { url, init }; return { status: 201 }; } });
  assert.equal(status, 201);
  assert.equal(seen.init.headers['Content-Encoding'], 'aes128gcm');
  assert.equal(seen.init.headers.Urgency, 'high');
  assert.equal(seen.init.headers.Topic, 'c1234-ab');
  assert.match(seen.init.headers.Authorization, /^vapid t=[\w-]+\.[\w-]+\.[\w-]+, k=[\w-]+$/);
  assert.deepEqual(JSON.parse(receive(Buffer.from(seen.init.body), ua, auth)), { title: 'T', body: 'B' });
});
