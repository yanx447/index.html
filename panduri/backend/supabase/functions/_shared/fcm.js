// Firebase Cloud Messaging (HTTP v1) for the installed Android / iOS app. Used only when the owner has created a
// Firebase project and saved its service account as the FCM_SERVICE_ACCOUNT secret; until then native devices
// receive their notifications inside the app.
const subtle = globalThis.crypto.subtle;
const enc = new TextEncoder();
const b64u = bytes => btoa(String.fromCharCode(...new Uint8Array(bytes))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

let cached = null;   // { token, until }
export async function accessToken(sa, now = Date.now()) {
  if (cached && cached.until > now + 60000) return cached.token;
  const pem = String(sa.private_key).replace(/-----[^-]+-----/g, '').replace(/\s+/g, '');
  const der = Uint8Array.from(atob(pem), c => c.charCodeAt(0));
  const key = await subtle.importKey('pkcs8', der, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['sign']);
  const iat = Math.floor(now / 1000);
  const head = b64u(enc.encode(JSON.stringify({ alg: 'RS256', typ: 'JWT' })));
  const claims = b64u(enc.encode(JSON.stringify({ iss: sa.client_email, scope: 'https://www.googleapis.com/auth/firebase.messaging', aud: 'https://oauth2.googleapis.com/token', iat, exp: iat + 3600 })));
  const sig = b64u(await subtle.sign('RSASSA-PKCS1-v1_5', key, enc.encode(head + '.' + claims)));
  const r = await fetch('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'grant_type=' + encodeURIComponent('urn:ietf:params:oauth:grant-type:jwt-bearer') + '&assertion=' + head + '.' + claims + '.' + sig, signal: AbortSignal.timeout(10000) });
  if (!r.ok) throw new Error('fcm-auth-' + r.status);
  const j = await r.json();
  cached = { token: j.access_token, until: now + (j.expires_in || 3600) * 1000 };
  return cached.token;
}

/** 200 sent; 404 / UNREGISTERED: the app was removed from that phone */
export async function send(sa, deviceToken, n) {
  const token = await accessToken(sa);
  const r = await fetch('https://fcm.googleapis.com/v1/projects/' + encodeURIComponent(sa.project_id) + '/messages:send', {
    method: 'POST', headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' }, signal: AbortSignal.timeout(10000),
    body: JSON.stringify({ message: {
      token: deviceToken,
      notification: { title: n.title, body: n.body },
      data: { go: n.go || '', kind: n.kind || '', id: String(n.id) },
      android: { priority: 'HIGH', notification: { tag: n.tag || n.kind || 'pd', channel_id: 'sima' } },
      apns: { payload: { aps: { 'thread-id': n.tag || n.kind || 'pd', sound: 'default' } } }
    } })
  });
  if (r.status === 404) return 410;
  if (r.status === 400) { const t = await r.text(); if (/UNREGISTERED|INVALID_ARGUMENT.*token/i.test(t)) return 410; }
  return r.status;
}
