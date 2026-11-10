/* The community as a person sees it: the feed (global / friends), a post's comments, reactions, the composer,
   friends by nickname, a chat with a photo and a reaction, and Sima's notification inside the app.
   The server is played by this script (page.route): every answer below is what the real RPC returns in
   backend/social-sql.test.mjs, so this checks the screens, not the SQL.
   Run: python3 build.py && node qa/social.cjs   (needs dist/app; serves it itself; screenshots → qa/out/social-*.png) */
const path = require('path'), fs = require('fs'), http = require('http');
const { chromium } = require(path.join(__dirname, '..', 'node_modules', 'playwright'));
const ROOT = path.join(__dirname, '..', 'dist', 'app'), OUT = path.join(__dirname, 'out'); fs.mkdirSync(OUT, { recursive: true });
const SB = 'https://tecynfffgjgrcafmfqty.supabase.co', ME = '11111111-1111-1111-1111-111111111111', NINO = '22222222-2222-2222-2222-222222222222', GIO = '33333333-3333-3333-3333-333333333333';
const now = Date.now(), iso = m => new Date(now - m * 60000).toISOString();
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.webmanifest': 'application/manifest+json', '.mp3': 'audio/mpeg', '.woff2': 'font/woff2' };
const srv = http.createServer((q, r) => { let f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0])); if (f.endsWith('/')) f += 'index.html'; if (!f.startsWith(ROOT) || !fs.existsSync(f)) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'Content-Type': types[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r); });

const posts = [
  { id: 41, author: NINO, author_name: 'ნინო', author_nick: 'nino.panduri', author_avatar: null, author_level: 4, kind: 'video', caption: 'მრავალჟამიერი — პირველად სამივე ხმით 🎶 #ფანდური', media_path: NINO + '/p/v.webm', thumb_path: NINO + '/p/v.jpg', media_meta: { dur: 2 }, visibility: 'public', reactions: 128, comments: 2, shares: 3, views: 1540, created_at: iso(42), my_reaction: null, top: ['panduri', 'fire', 'heart'], friend: true, seen: false },
  { id: 40, author: GIO, author_name: 'გიორგი', author_nick: 'gio', author_avatar: null, author_level: 2, kind: 'photo', caption: 'ახალი ფანდური ხელოსნისგან', media_path: GIO + '/p/a.jpg', thumb_path: null, media_meta: { w: 1200, h: 900 }, visibility: 'public', reactions: 12, comments: 0, shares: 0, views: 88, created_at: iso(300), my_reaction: 'heart', top: ['heart'], friend: false, seen: false },
  { id: 39, author: NINO, author_name: 'ნინო', author_nick: 'nino.panduri', author_avatar: null, author_level: 4, kind: 'audio', caption: 'ჩემი ჩანაწერი — შენ როგორ უკრავ ამ ადგილს?', media_path: NINO + '/p/s.mp3', thumb_path: null, media_meta: { dur: 70 }, visibility: 'friends', reactions: 5, comments: 1, shares: 0, views: 20, created_at: iso(1500), my_reaction: null, top: [], friend: true, seen: true },
  { id: 38, author: GIO, author_name: 'გიორგი', author_nick: 'gio', author_avatar: null, author_level: 2, kind: 'text', caption: 'ვინ იცის, A · C♯ · E აწყობაზე Dm როგორ ავიღო?', media_path: null, thumb_path: null, media_meta: {}, visibility: 'public', reactions: 0, comments: 0, shares: 0, views: 3, created_at: iso(2900), my_reaction: null, top: [], friend: false, seen: true }
];
const friends = [
  { id: NINO, nickname: 'nino.panduri', display_name: 'ნინო', avatar_url: null, level: 4, vip: false, relation: 'friend', since: iso(9000), last_seen: iso(3) },
  { id: GIO, nickname: 'gio', display_name: 'გიორგი', avatar_url: null, level: 2, vip: false, relation: 'incoming', since: iso(30), last_seen: iso(30) }
];
const CONV = '99999999-0000-0000-0000-000000000001';
const messages = [
  { id: 1, sender: NINO, body: 'გამარჯობა! ჩემი ახალი ვიდეო ნახე?', created_at: iso(30), media_path: null, thumb_path: null, media_kind: null, media_meta: {}, post_ref: null },
  { id: 2, sender: NINO, body: '', created_at: iso(29), media_path: null, thumb_path: null, media_kind: null, media_meta: {}, post_ref: 41 },
  { id: 3, sender: ME, body: '', created_at: iso(20), media_path: ME + '/c/p.jpg', thumb_path: null, media_kind: 'photo', media_meta: { w: 1200, h: 900 }, post_ref: null },
  { id: 4, sender: ME, body: 'ესაა ჩემი ფანდური 🙂', created_at: iso(19), media_path: null, thumb_path: null, media_kind: null, media_meta: {}, post_ref: null },
  { id: 5, sender: NINO, body: '', created_at: iso(18), media_path: null, thumb_path: null, media_kind: null, media_meta: {}, post_ref: null, sticker: 'bravo' },
  { id: 6, sender: NINO, body: '', created_at: iso(17), media_path: null, thumb_path: null, media_kind: null, media_meta: { w: 200, h: 150 }, post_ref: null, gif: 'https://media2.giphy.com/media/qa/200w.gif' }
];
const sent = [];
const notes = [{ id: 7, kind: 'friend_post', actor: NINO, params: { name: 'ნინო', what: 'video', s: 'მრავალჟამიერი', post: 41 }, title: 'სიმა · მეგობრის ახალი პოსტი', body: 'ნინო ახალ ვიდეოს აზიარებს: „მრავალჟამიერი“', go: 'community:p:41', tag: 'fp:41', created_at: iso(40), read_at: null }];
let later = [];   // notifications the "server" adds during the run
const calls = [];

async function fakeServer(route, media) {
  const u = new URL(route.request().url()), p = u.pathname, m = route.request().method();
  const body = (() => { try { return JSON.parse(route.request().postData() || 'null'); } catch (_) { return null; } })();
  const json = (v, s) => route.fulfill({ status: s || 200, contentType: 'application/json', body: JSON.stringify(v) });
  calls.push(m + ' ' + p + (p.includes('/rpc/') && body ? ' ' + JSON.stringify(body).slice(0, 80) : ''));
  if (process.env.LEGACY) {   // a server without the community upgrade: no new columns, functions or tables
    if (p === '/rest/v1/messages' && m === 'GET' && /sticker/.test(u.searchParams.get('select') || '')) return json({ code: '42703', message: 'column messages.sticker does not exist' }, 400);
    if (/\/rpc\/(feed|my_friends|find_nickname|save_notify_settings|notifications_read|chat_mark_read)$/.test(p)) return json({ code: 'PGRST202', message: 'Could not find the function' }, 404);
    if (/\/rest\/v1\/(notifications|message_reactions)$/.test(p)) return json({ code: 'PGRST205', message: 'Could not find the table' }, 404);
    if (p === '/rest/v1/messages' && m === 'GET') return json(messages.slice(0, 1).map(x => ({ id: x.id, sender: x.sender, body: x.body, created_at: x.created_at })));
  }
  if (p.startsWith('/media/')) return route.fulfill({ status: 200, contentType: media[p].type, body: media[p].buf });
  if (p === '/auth/v1/user') return json({ id: ME, email: 'me@test.ge', created_at: iso(99999) });
  if (p === '/auth/v1/settings') return json({ external: { email: true, google: true } });
  if (p === '/rest/v1/profiles') return json(m === 'GET' ? [{ id: ME, display_name: 'ნუკრი', nickname: 'nukri', role: 'user', level: 3, xp: 120, avatar_url: null }] : []);
  if (p === '/rest/v1/progress') return json([]);
  if (p === '/rest/v1/rpc/is_owner') return json(false);
  if (p === '/rest/v1/rpc/feed') { const tab = body.tab; let rows = tab === 'foryou' ? posts.filter(x => x.visibility === 'public') : tab === 'friends' ? posts.filter(x => x.friend) : tab === 'one' ? posts.filter(x => x.id === body.before_id) : tab === 'user' ? posts.filter(x => x.author === body.target) : [];
    if (body.skip_ids) rows = rows.filter(x => !body.skip_ids.includes(x.id)); if (body.before_id && tab === 'friends') rows = rows.filter(x => x.id < body.before_id); return json(rows.slice(0, body.lim || 8)); }
  if (p === '/storage/v1/object/sign/social') return json(body.paths.map(x => ({ path: x, signedURL: '/object/sign/social/' + x + '?token=t', error: null })));
  if (p.startsWith('/storage/v1/object/sign/social/')) { const f = p.endsWith('.webm') ? '/media/v.webm' : p.endsWith('.mp3') ? '/media/s.mp3' : '/media/a.jpg'; return route.fulfill({ status: 200, contentType: media[f].type, body: media[f].buf }); }
  if (p === '/rest/v1/rpc/my_friends') return json(friends);
  if (p === '/rest/v1/rpc/find_nickname') return json(body.nick === 'gio' ? [{ id: GIO, nickname: 'gio', display_name: 'გიორგი', avatar_url: null, level: 2, relation: 'incoming' }] : []);
  if (p === '/rest/v1/rpc/my_conversations') return json([{ id: CONV, other: NINO, other_name: 'ნინო', other_avatar: null, other_nick: 'nino.panduri', last_at: iso(19), last_body: 'ესაა ჩემი ფანდური 🙂', last_sender: ME, last_kind: null, unread: 0 }]);
  if (p === '/rest/v1/messages') { if (m === 'POST') { sent.push(body[0]); return json(body); } return json(u.searchParams.get('id') ? [] : messages.slice().reverse()); }
  if (p === '/functions/v1/gifs') return json(u.searchParams.get('probe') ? { on: true } : [1, 2, 3, 4].map(i => ({ id: 'g' + i, title: 'gif ' + i, url: 'https://media2.giphy.com/media/qa' + i + '/200w.gif', preview: 'https://media2.giphy.com/media/qa' + i + '/100w.gif', w: 200, h: 150 })));
  if (p === '/rest/v1/message_reactions') return json([{ message_id: 3, user_id: NINO, emoji: 'panduri' }, { message_id: 1, user_id: ME, emoji: 'heart' }]);
  if (p === '/rest/v1/feed_comments') return json([{ id: 1, author: GIO, author_name: 'გიორგი', body: 'ძალიან კარგია! 👏', created_at: iso(20) }, { id: 2, author: ME, author_name: 'ნუკრი', body: 'შესანიშნავია', created_at: iso(10) }]);
  if (p === '/rest/v1/notifications') { const after = +(u.searchParams.get('id') || '').replace('gt.', '') || 0; if (u.searchParams.get('read_at')) return json([]); return json(notes.concat(later).filter(n => n.id > after).sort((a, b) => b.id - a.id)); }
  if (p === '/functions/v1/push') return json({ key: 'BAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' });
  if (p.startsWith('/rest/v1/rpc/')) return json(p.endsWith('react_post') ? body.emoji : p.endsWith('react_message') ? body.emoji : null);
  return json([]);
}

(async () => {
  await new Promise(r => srv.listen(0, r)); const base = 'http://127.0.0.1:' + srv.address().port + '/';
  const b = await chromium.launch();
  // a short video, made in the browser (no ffmpeg needed), and a photo
  const mk = await b.newPage();
  const webm = Buffer.from(await mk.evaluate(async () => {
    const c = document.createElement('canvas'); c.width = 360; c.height = 640; const g = c.getContext('2d'); const st = c.captureStream(24);
    const rec = new MediaRecorder(st, { mimeType: 'video/webm' }), parts = []; rec.ondataavailable = e => parts.push(e.data);
    rec.start(); const t0 = performance.now();
    await new Promise(res => { (function f() { const k = (performance.now() - t0) / 1000; g.fillStyle = '#3B2414'; g.fillRect(0, 0, 360, 640); g.fillStyle = '#C98B5B'; g.beginPath(); g.arc(180 + Math.sin(k * 3) * 100, 320, 60, 0, 7); g.fill(); g.fillStyle = '#fff'; g.font = '28px sans-serif'; g.fillText('ფანდური ' + k.toFixed(1), 90, 120); if (k < 2) requestAnimationFrame(f); else res(); })(); });
    rec.stop(); await new Promise(r => rec.onstop = r);
    const buf = await new Blob(parts).arrayBuffer(); return [...new Uint8Array(buf)];
  }));
  await mk.close();
  const media = { '/media/v.webm': { type: 'video/webm', buf: webm }, '/media/a.jpg': { type: 'image/jpeg', buf: fs.readFileSync(path.join(__dirname, '..', 'assets', 'pan-front.jpg')) }, '/media/s.mp3': { type: 'audio/mpeg', buf: fs.readFileSync(path.join(__dirname, '..', '..', 'app', 'media', 'bani', 'music-60.mp3')) } };
  const report = [];
  for (const [label, vp] of [['phone', { width: 390, height: 844 }], ['desktop', { width: 1440, height: 900 }]]) {
    const ctx = await b.newContext({ viewport: vp, deviceScaleFactor: 1, hasTouch: label === 'phone' });
    const pg = await ctx.newPage(); const errs = [];
    pg.on('pageerror', e => errs.push(e.message)); pg.on('console', m => { if (m.type() === 'error' && !/fonts|ERR_|Failed to load resource|favicon/.test(m.text())) errs.push(m.text()); });
    await pg.route(SB + '/**', r => fakeServer(r, media));
    await pg.route('https://media2.giphy.com/**', r => r.fulfill({ status: 200, contentType: 'image/jpeg', body: media['/media/a.jpg'].buf }));
    await pg.addInitScript(([me]) => {
      const S = (k, v) => localStorage.setItem('pd2:' + k, JSON.stringify(v));
      if (!localStorage.getItem('pd2:qa')) {
        S('qa', 1); S('lang', 'ka'); S('language.chosen', true); S('onboarded', true); S('intro.done', true); S('md.rules.' + me, true); S('cm.tab', 'feed'); S('fd.tab', 'foryou');
        S('cloud.session', { access_token: 'x.y.z', refresh_token: 'r', expires_at: Math.floor(Date.now() / 1000) + 3600, user: { id: me, email: 'me@test.ge', created_at: '2026-01-01T00:00:00Z' } });
        S('notify', { on: true, hour: 19, quiet: false, kinds: {} });
      }
    }, [ME]);
    await pg.goto(base + 'index.html'); await pg.waitForTimeout(1500);
    if (process.env.LEGACY) {
      await pg.evaluate(() => { document.querySelectorAll('.ob,.lf,.ag').forEach(x => x.remove()); PD.app.go('community'); }); await pg.waitForTimeout(1500);
      const feedMsg = await pg.evaluate(() => (document.querySelector('.fd-scroll, .cm-body') || {}).textContent);
      await pg.evaluate(c => PD.app.go('community', 'c:' + c + ':ნინო'), CONV); await pg.waitForTimeout(2000);
      const chat = await pg.evaluate(() => [...document.querySelectorAll('.cm-msg p')].map(x => x.textContent));
      await pg.click('.ck-toggle'); await pg.click('.ck-tabs button:nth-child(2)'); await pg.click('.ck-stb >> nth=0'); await pg.waitForTimeout(400);
      report.push([label, 'legacy server', { feedMsg, chat, toast: await pg.evaluate(() => (document.querySelector('.toast') || {}).textContent), errs }]);
      await ctx.close(); continue;
    }
    await pg.evaluate(() => { document.querySelectorAll('.ob,.lf,.ag').forEach(x => x.remove()); PD.app.go('community'); }); await pg.waitForTimeout(1800);
    const shot = n => pg.screenshot({ path: path.join(OUT, `social-${label}-${n}.png`) });
    await shot('1-global');
    const g = await pg.evaluate(() => { const s = document.querySelector('.fd-scroll'), c = s && s.querySelector('.fd-card'), r = s && s.getBoundingClientRect(), nav = document.querySelector('.tabbar');
      const v = c && c.querySelector('video');
      return { cards: s ? s.querySelectorAll('.fd-card').length : 0, h: r && Math.round(r.height), top: r && Math.round(r.top), bottom: r && Math.round(r.bottom), navTop: nav ? Math.round(nav.getBoundingClientRect().top) : null, cardH: c && Math.round(c.getBoundingClientRect().height),
        playing: v ? !v.paused : null, muted: v ? v.muted : null, overflowX: document.documentElement.scrollWidth > innerWidth, rail: !!(c && c.querySelector('.fd-rail .fd-rx')), info: c && c.querySelector('.fd-info b').textContent }; });
    report.push([label, 'global feed', g]);
    // the reaction: tap = panduri, hold = choose
    await pg.click('.fd-card.act .fd-rx'); await pg.waitForTimeout(250);
    const rx = await pg.evaluate(() => ({ on: document.querySelector('.fd-card.act .fd-rx').classList.contains('on'), n: document.querySelector('.fd-card.act .fd-col small').textContent }));
    await pg.click('.fd-card.act .fd-rx', { button: 'right' }); await pg.waitForTimeout(250); await shot('2-picker');
    const pick = await pg.evaluate(() => { const p = document.querySelector('.rx-pick'); if (!p) return null; const r = p.getBoundingClientRect(); return { n: p.querySelectorAll('button').length, inside: r.left >= 0 && r.right <= innerWidth && r.top >= 0, pan: !!p.querySelector('.rx-pan svg') }; });
    await pg.click('.rx-pick .rx-o:nth-child(3)'); await pg.waitForTimeout(200);
    report.push([label, 'reaction', { tap: rx, picker: pick, after: await pg.evaluate(() => document.querySelector('.fd-card.act .fd-rx').textContent) }]);
    // comments
    await pg.click('.fd-card.act .fd-col:nth-child(2) .fd-act'); await pg.waitForTimeout(500); await shot('3-comments');
    report.push([label, 'comments', await pg.evaluate(() => [...document.querySelectorAll('.fd-cms .cm-reply p')].map(x => x.textContent))]);
    await pg.keyboard.press('Escape'); await pg.waitForTimeout(300);
    // next post (photo) by scrolling one screen
    await pg.evaluate(() => { const s = document.querySelector('.fd-scroll'); s.scrollTo({ top: s.clientHeight }); }); await pg.waitForTimeout(900); await shot('4-photo');
    report.push([label, 'second card', await pg.evaluate(() => { const c = document.querySelector('.fd-card.act'); return c && { id: c.dataset.id, kind: c.className, add: !!c.querySelector('.fd-add'), img: !!(c.querySelector('img.md-img') && c.querySelector('img.md-img').naturalWidth) }; })]);
    // friends tab of the feed
    await pg.click('.fd-seg button:nth-child(2)'); await pg.waitForTimeout(1200);
    await pg.evaluate(() => { const s = document.querySelector('.fd-scroll'); s.scrollTo({ top: s.clientHeight }); }); await pg.waitForTimeout(900); await shot('5-friends-audio');
    report.push([label, 'friends feed', await pg.evaluate(() => ({ ids: [...document.querySelectorAll('.fd-card')].map(c => c.dataset.id), audio: !!document.querySelector('.fd-card.act .fd-play'), friendsOnly: (document.querySelector('.fd-card.act .fd-meta') || {}).textContent }))]);
    // the composer
    await pg.click('.fd-new'); await pg.waitForTimeout(400); await shot('6-compose');
    report.push([label, 'composer', await pg.evaluate(() => ({ kinds: [...document.querySelectorAll('.fd-kinds button')].map(x => x.textContent), vis: [...document.querySelectorAll('.fd-vis button')].map(x => x.textContent) }))]);
    await pg.keyboard.press('Escape'); await pg.waitForTimeout(300);
    // friends
    await pg.evaluate(() => { PD.store.set('cm.tab', 'friends'); PD.app.render(); }); await pg.waitForTimeout(1200);
    await pg.fill('.fr-find input', '@gio'); await pg.press('.fr-find input', 'Enter'); await pg.waitForTimeout(600); await shot('7-friends');
    report.push([label, 'friends', await pg.evaluate(() => ({ me: (document.querySelector('.fr-me b') || {}).textContent, found: [...document.querySelectorAll('.fr-find ~ .cm-list .cm-row')].map(x => x.textContent), heads: [...document.querySelectorAll('.cm-body > h3')].map(x => x.textContent), overflowX: document.documentElement.scrollWidth > innerWidth }))]);
    // a chat: photo, shared post, reactions
    await pg.evaluate(c => PD.app.go('community', 'c:' + c + ':ნინო'), CONV); await pg.waitForTimeout(2200); await shot('8-chat');
    report.push([label, 'chat', await pg.evaluate(() => ({ bubbles: document.querySelectorAll('.cm-msg').length, photo: !!document.querySelector('.cm-msg .md-img'), shared: (document.querySelector('.cm-shared') || {}).textContent, rx: [...document.querySelectorAll('.cm-rx:not([hidden])')].map(x => x.innerHTML.includes('svg') ? 'panduri' : x.textContent), attach: !!document.querySelector('.cm-att') }))]);
    // the chat kit: emoji, stickers, GIFs, the + menu
    await pg.click('.ck-toggle'); await pg.waitForTimeout(500);
    const emo = await pg.evaluate(() => ({ panel: !document.querySelector('.ck-panel').hidden, tabs: [...document.querySelectorAll('.ck-tabs button')].map(b => b.getAttribute('aria-label')), emoji: document.querySelectorAll('.ck-e').length }));
    await pg.click('.ck-e >> nth=3'); await pg.click('.ck-e >> nth=20');
    emo.input = await pg.inputValue('.cm-in');
    await pg.click('.ck-tabs button:nth-child(2)'); await pg.waitForTimeout(300); await shot('8b-stickers');
    emo.stickers = await pg.evaluate(() => document.querySelectorAll('.ck-stb').length);
    await pg.click('.ck-stb >> nth=0'); await pg.waitForTimeout(500);
    await pg.click('.ck-toggle'); await pg.click('.ck-tabs button:nth-child(3)'); await pg.waitForTimeout(600); await shot('8c-gifs');
    emo.gifs = await pg.evaluate(() => document.querySelectorAll('.ck-gif img').length);
    await pg.click('.ck-gif >> nth=1'); await pg.waitForTimeout(500);
    await pg.click('.cm-bar .cm-att >> nth=0'); await pg.waitForTimeout(400); await shot('8d-plus');
    emo.plus = await pg.evaluate(() => [...document.querySelectorAll('.ck-opt')].map(x => x.textContent));
    await pg.keyboard.press('Escape'); await pg.waitForTimeout(300);
    emo.sent = sent.splice(0).map(x => x.sticker || x.gif);
    emo.rendered = await pg.evaluate(() => ({ sticker: !!document.querySelector('.cm-msg.is-sticker .ck-art svg'), gif: !!document.querySelector('.cm-gif img') }));
    report.push([label, 'chat kit', emo]);
    // Sima tells something new while the app is open
    later = [{ id: 8 + (label === 'desktop' ? 10 : 0), kind: 'chat_reaction', actor: NINO, params: { name: 'ნინო', e: 'fire', what: 'photo', conv: 'x' }, title: 'სიმა · რეაქცია', body: 'ნინო რეაგირებს შენს ფოტოზე: 🔥', go: 'community:friends', tag: 'cr:x', created_at: new Date().toISOString(), read_at: null }];
    await pg.evaluate(() => PD.app.go('home')); await pg.waitForTimeout(400);
    await pg.evaluate(() => PD.notify.pull()); await pg.waitForTimeout(700); await shot('9-sima');
    report.push([label, 'sima popup', await pg.evaluate(() => ({ pop: (document.querySelector('.sn-pop') || {}).textContent, unread: PD.notify.unread(), inbox: PD.notify.log().map(x => x.title + ' — ' + x.body) }))]);
    await pg.evaluate(() => PD.app.go('inbox')); await pg.waitForTimeout(600); await shot('10-inbox');
    // the settings: Sima's note, the kinds, this device's status
    await pg.evaluate(() => PD.app.go('settings')); await pg.waitForTimeout(700);
    await pg.evaluate(() => document.querySelectorAll('.sn-pop').forEach(x => x.remove()));
    const sec = await pg.evaluateHandle(() => { const el = document.querySelector('.sn-from'); return el && (el.closest('section,.sx-sec,.card,.sect') || el.parentElement); });
    if (sec && sec.asElement()) await sec.asElement().screenshot({ path: path.join(OUT, `social-${label}-11-settings.png`) });
    report.push([label, 'settings', await pg.evaluate(() => ({ from: (document.querySelector('.sn-from') || {}).textContent, kinds: [...document.querySelectorAll('.li span[data-t^="nt.k."]')].map(x => x.textContent).length || [...document.querySelectorAll('[data-t^="nt.k."]')].length, status: (document.querySelector('[data-t^="nt.dev"]') || {}).textContent }))]);
    // Sima answers about the new things
    report.push([label, 'sima', await pg.evaluate(() => { const a = PD.sima.answer ? PD.sima.answer('როგორ დავამატო მეგობარი?') : null; return a ? a.title + ' — ' + (a.lines || [])[0] : 'no answer()'; })]);
    report.push([label, 'errors', errs]);
    await ctx.close();
  }
  await b.close(); srv.close();
  for (const r of report) console.log(r[0].padEnd(8), r[1].padEnd(14), JSON.stringify(r[2]));
  console.log('server calls:', [...new Set(calls.map(c => c.split(' ').slice(0, 2).join(' ')))].join(' · '));
})().catch(e => { console.error(e); process.exit(1); });
