"""Minimal stand-in for the Supabase endpoints the app uses (auth + a few REST tables + RPCs).
For automated tests only — mirrors the request/response shapes, applies the same access rules in spirit."""
import json, uuid, time, re
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlparse, parse_qs

USERS = {}      # id -> {id,email,phone,pw}
TOKENS = {}     # token -> id
PROFILES = {}   # id -> profile
PROGRESS = {}
CONVS = {}      # id -> {id,a,b,last_at}
MSGS = []       # {id,conversation_id,sender,body,created_at}
POSTS = []; REPLIES = []; SIGNALS = []
SEQ = {'m': 0, 'p': 0, 'r': 0, 's': 0}
now = lambda: time.strftime('%Y-%m-%dT%H:%M:%S', time.gmtime()) + '.%03dZ' % (int(time.time() * 1000) % 1000)

def session(uid):
    tok = 'tok-' + uuid.uuid4().hex; TOKENS[tok] = uid
    u = USERS[uid]
    return {'access_token': tok, 'refresh_token': 'ref-' + tok, 'expires_in': 3600, 'token_type': 'bearer', 'user': {'id': uid, 'email': u.get('email'), 'phone': u.get('phone')}}

def mkuser(email=None, phone=None, pw=None, name=''):
    uid = str(uuid.uuid4()); USERS[uid] = {'id': uid, 'email': email, 'phone': phone, 'pw': pw}
    PROFILES[uid] = {'id': uid, 'email': email, 'phone': phone, 'display_name': name or '', 'avatar_url': None, 'role': 'admin' if not PROFILES else 'user', 'vip_until': None, 'plan': None, 'xp': 0, 'level': 0, 'lefty': False, 'created_at': now(), 'last_seen': now()}
    return uid

def eqv(q, k):
    v = q.get(k, [None])[0]
    if v is None: return None
    op, _, val = v.partition('.')
    return op, val

class H(BaseHTTPRequestHandler):
    def log_message(self, *a): pass
    def cors(self):
        self.send_header('Access-Control-Allow-Origin', '*'); self.send_header('Access-Control-Allow-Headers', '*'); self.send_header('Access-Control-Allow-Methods', 'GET,POST,PATCH,PUT,DELETE,OPTIONS')
    def do_OPTIONS(self): self.send_response(204); self.cors(); self.end_headers()
    def out(self, code, obj):
        b = json.dumps(obj).encode(); self.send_response(code); self.cors(); self.send_header('Content-Type', 'application/json'); self.end_headers(); self.wfile.write(b)
    def me(self):
        a = self.headers.get('Authorization', '')
        return TOKENS.get(a.replace('Bearer ', ''))
    def body(self):
        n = int(self.headers.get('Content-Length') or 0)
        return json.loads(self.rfile.read(n) or b'null') if n else None
    def do_GET(self): self.route('GET')
    def do_POST(self): self.route('POST')
    def do_PATCH(self): self.route('PATCH')
    def do_PUT(self): self.route('PUT')
    def do_DELETE(self): self.route('DELETE')
    def route(self, m):
        u = urlparse(self.path); p = u.path; q = parse_qs(u.query); me = self.me()
        b = self.body() if m in ('POST', 'PATCH', 'PUT') else None
        if p == '/__reset':
            for d in (USERS, TOKENS, PROFILES, PROGRESS, CONVS): d.clear()
            MSGS.clear(); POSTS.clear(); REPLIES.clear(); SIGNALS.clear(); return self.out(200, {})
        if p == '/auth/v1/signup':
            if any(x['email'] == b['email'] for x in USERS.values()): return self.out(422, {'code': 'user_already_exists', 'msg': 'User already registered'})
            uid = mkuser(email=b['email'], pw=b['password'], name=(b.get('data') or {}).get('display_name', '')); return self.out(200, session(uid))
        if p == '/auth/v1/token':
            gt = q.get('grant_type', [''])[0]
            if gt == 'password':
                for x in USERS.values():
                    if x['email'] == b['email'] and x['pw'] == b['password']: return self.out(200, session(x['id']))
                return self.out(400, {'error_code': 'invalid_credentials', 'msg': 'Invalid login credentials'})
            if gt == 'refresh_token':
                tok = b['refresh_token'].replace('ref-', '', 1)
                if tok in TOKENS: return self.out(200, session(TOKENS[tok]))
                return self.out(400, {'error': 'invalid_grant'})
        if p == '/auth/v1/settings': return self.out(200, {'external': {'email': True, 'phone': True, 'google': True, 'facebook': False}})
        if p == '/auth/v1/otp': return self.out(200, {})
        if p == '/auth/v1/verify':
            if b.get('token') != '123456': return self.out(400, {'error_code': 'otp_expired', 'msg': 'Token has expired or is invalid'})
            uid = next((x['id'] for x in USERS.values() if x.get('phone') == b['phone']), None) or mkuser(phone=b['phone'])
            return self.out(200, session(uid))
        if p in ('/auth/v1/logout', '/auth/v1/recover', '/auth/v1/resend'): return self.out(200, {})
        if p == '/auth/v1/user':
            if not me: return self.out(401, {'msg': 'no'})
            x = USERS[me]; return self.out(200, {'id': me, 'email': x.get('email'), 'phone': x.get('phone')})
        if not p.startswith('/rest/v1/'): return self.out(404, {'msg': 'nf'})
        if not me: return self.out(401, {'message': 'JWT required'})
        t = p[len('/rest/v1/'):]
        isadmin = PROFILES[me]['role'] == 'admin'
        if t == 'profiles':
            uid = eqv(q, 'id')[1]
            if uid != me and not isadmin: return self.out(200, [])
            if m == 'GET': return self.out(200, [PROFILES[uid]] if uid in PROFILES else [])
            if m == 'PATCH':
                for k in list(b):
                    if k not in ('display_name', 'avatar_url', 'xp', 'level', 'lefty', 'last_seen'): return self.out(403, {'message': 'permission denied for column ' + k})
                PROFILES[uid].update(b); return self.out(200, [PROFILES[uid]])
        if t == 'progress':
            if m == 'GET': return self.out(200, [PROGRESS[me]] if me in PROGRESS else [])
            r = b[0]; PROGRESS[me] = {'data': r['data'], 'updated_at': r['updated_at']}; return self.out(201, [PROGRESS[me]])
        if t.startswith('rpc/'):
            fn = t[4:]
            if fn in ('admin_list_users', 'admin_set_vip', 'admin_set_role') and not isadmin: return self.out(400, {'message': 'not allowed'})
            if fn == 'admin_list_users':
                term = (b or {}).get('term', '').lower()
                return self.out(200, [x for x in PROFILES.values() if not term or term in (x['display_name'] or '').lower() or term in (x['email'] or '')])
            if fn == 'admin_set_vip':
                x = PROFILES[b['target']]; x['vip_until'] = b['until']; x['plan'] = b['plan'] if b['until'] else None; return self.out(200, x)
            if fn == 'admin_set_role':
                x = PROFILES[b['target']]; x['role'] = b['new_role']; return self.out(200, x)
            if fn == 'people':
                term = (b or {}).get('term', '').lower()
                return self.out(200, [{'id': x['id'], 'display_name': x['display_name'], 'avatar_url': None, 'level': x['level'], 'vip': bool(x['vip_until'])} for x in PROFILES.values() if x['id'] != me and x['display_name'] and (not term or term in x['display_name'].lower())])
            if fn == 'open_conversation':
                a, c = sorted([me, b['other']])
                for cv in CONVS.values():
                    if cv['a'] == a and cv['b'] == c: return self.out(200, cv['id'])
                cid = str(uuid.uuid4()); CONVS[cid] = {'id': cid, 'a': a, 'b': c, 'last_at': now()}; return self.out(200, cid)
            if fn == 'delete_my_account':
                USERS.pop(me, None); PROFILES.pop(me, None); PROGRESS.pop(me, None)
                for k in [k for k, v in TOKENS.items() if v == me]: TOKENS.pop(k)
                return self.out(200, None)
            if fn == 'my_conversations':
                out = []
                for cv in CONVS.values():
                    if me in (cv['a'], cv['b']):
                        o = cv['b'] if cv['a'] == me else cv['a']; lm = [x for x in MSGS if x['conversation_id'] == cv['id']]
                        out.append({'id': cv['id'], 'other': o, 'other_name': PROFILES[o]['display_name'], 'other_avatar': None, 'last_at': cv['last_at'], 'last_body': lm[-1]['body'] if lm else None})
                return self.out(200, out)
        def mine(cid): cv = CONVS.get(cid); return cv and me in (cv['a'], cv['b'])
        if t == 'messages':
            if m == 'GET':
                cid = eqv(q, 'conversation_id')[1]; gt = eqv(q, 'id'); after = int(gt[1]) if gt else 0
                if not mine(cid): return self.out(200, [])
                rows = [x for x in MSGS if x['conversation_id'] == cid and x['id'] > after]
                if q.get('order', [''])[0] == 'id.desc': rows = list(reversed(rows))
                if q.get('limit'): rows = rows[:int(q['limit'][0])]
                return self.out(200, rows)
            r = b[0]
            if not mine(r['conversation_id']): return self.out(403, {'message': 'rls'})
            SEQ['m'] += 1; x = {'id': SEQ['m'], 'conversation_id': r['conversation_id'], 'sender': me, 'body': r['body'], 'created_at': now()}; MSGS.append(x); CONVS[r['conversation_id']]['last_at'] = now(); return self.out(201, [x])
        if t == 'posts':
            if m == 'GET': return self.out(200, [dict(x, replies=[{'count': len([r for r in REPLIES if r['post_id'] == x['id']])}]) for x in reversed(POSTS)])
            if m == 'DELETE':
                pid = int(eqv(q, 'id')[1]); POSTS[:] = [x for x in POSTS if not (x['id'] == pid and (x['author'] == me or isadmin))]; return self.out(204, None) if False else self.out(200, [])
            r = b[0]; SEQ['p'] += 1; x = {'id': SEQ['p'], 'author': me, 'author_name': PROFILES[me]['display_name'], 'title': r['title'], 'body': r.get('body', ''), 'created_at': now()}; POSTS.append(x); return self.out(201, [x])
        if t == 'replies':
            if m == 'GET': pid = int(eqv(q, 'post_id')[1]); return self.out(200, [x for x in REPLIES if x['post_id'] == pid])
            r = b[0]; SEQ['r'] += 1; x = {'id': SEQ['r'], 'post_id': r['post_id'], 'author': me, 'author_name': PROFILES[me]['display_name'], 'body': r['body'], 'created_at': now()}; REPLIES.append(x); return self.out(201, [x])
        if t == 'call_signals':
            if m == 'GET':
                rows = [x for x in SIGNALS if mine(x['conversation_id'])]
                c = eqv(q, 'conversation_id');
                if c: rows = [x for x in rows if x['conversation_id'] == c[1]]
                g = eqv(q, 'id');
                if g: rows = [x for x in rows if x['id'] > int(g[1])]
                k = eqv(q, 'kind');
                if k: rows = [x for x in rows if x['kind'] == k[1]]
                s = eqv(q, 'sender');
                if s and s[0] == 'neq': rows = [x for x in rows if x['sender'] != s[1]]
                ca = eqv(q, 'created_at');
                if ca: rows = [x for x in rows if x['created_at'] > ca[1]]
                if q.get('order', [''])[0] == 'id.desc': rows = list(reversed(rows))
                lim = q.get('limit');
                if lim: rows = rows[:int(lim[0])]
                return self.out(200, rows)
            r = b[0]
            if not mine(r['conversation_id']): return self.out(403, {'message': 'rls'})
            SEQ['s'] += 1; x = {'id': SEQ['s'], 'conversation_id': r['conversation_id'], 'sender': me, 'kind': r['kind'], 'payload': r.get('payload'), 'created_at': now()}; SIGNALS.append(x); return self.out(201, None)
        return self.out(404, {'message': 'not found ' + t})

if __name__ == '__main__':
    ThreadingHTTPServer(('127.0.0.1', 8899), H).serve_forever()
