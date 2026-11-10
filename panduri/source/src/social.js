/* =====================================================================
   Social: friends by nickname · the feed · reactions · comments · shares.
   The feed scrolls one post per screen. „გლობალური" is everyone's public
   posts, the unseen and the popular first; „მეგობრები" is my friends' and
   my own posts, newest first. Photos, videos and music live in a private
   bucket: the server hands out short-lived addresses only to the people
   allowed to see them (the author, everyone for a public post, friends for
   a friends-only one, the two people of a chat).
   Nothing here is about panduri technique: it is the members' own content.
   ===================================================================== */
PD.i18n.add({
  'fd.global': ['გლობალური', 'Global'], 'fd.friends': ['მეგობრები', 'Friends'], 'fd.new': ['ახალი პოსტი', 'New post'],
  'fd.emptyG': ['ჯერ არავის დაუდია არაფერი — იყავი პირველი!', 'Nobody has posted yet — be the first!'],
  'fd.emptyF': ['აქ შენი მეგობრების ფოტოები, ვიდეოები და მუსიკა გამოჩნდება.', 'Your friends’ photos, videos and music will show here.'],
  'fd.findFriends': ['მეგობრების დამატება', 'Add friends'], 'fd.end': ['ჯერჯერობით სულ ეს არის.', 'That is all for now.'],
  'fd.photo': ['ფოტო', 'Photo'], 'fd.video': ['ვიდეო', 'Video'], 'fd.audio': ['მუსიკა', 'Music'], 'fd.text': ['ტექსტი', 'Text'],
  'fd.caption': ['აღწერა — ვინ უკრავს, რა სიმღერაა…', 'Caption — who is playing, which song…'], 'fd.who': ['ვინ ნახავს', 'Who can see it'],
  'fd.visPublic': ['ყველა (გლობალური)', 'Everyone (global)'], 'fd.visFriends': ['მხოლოდ მეგობრები', 'Friends only'],
  'fd.post': ['გამოქვეყნება', 'Post'], 'fd.uploading': ['იტვირთება… {p}%', 'Uploading… {p}%'], 'fd.preparing': ['მზადდება…', 'Preparing…'],
  'fd.tooBig': ['ფაილი ძალიან დიდია (მაქს. {n} MB).', 'The file is too large (max {n} MB).'], 'fd.tooLong': ['ძალიან გრძელია (მაქს. {n} წუთი).', 'Too long (max {n} minutes).'],
  'fd.badFile': ['ეს ფაილი ვერ წაიკითხა — სცადე სხვა ფორმატი.', 'This file could not be read — try another format.'],
  'fd.choose': ['ფაილის არჩევა', 'Choose a file'], 'fd.change': ['სხვა ფაილი', 'Another file'], 'fd.cover': ['ყდის ფოტო (არასავალდებულო)', 'Cover photo (optional)'],
  'fd.comments': ['კომენტარები', 'Comments'], 'fd.noComments': ['ჯერ კომენტარი არ არის — დაწერე პირველი.', 'No comments yet — write the first.'], 'fd.writeC': ['დაწერე კომენტარი…', 'Write a comment…'],
  'fd.share': ['გაზიარება', 'Share'], 'fd.sendTo': ['გაუგზავნე მეგობარს ჩატში', 'Send to a friend in chat'], 'fd.sent': ['გაიგზავნა', 'Sent'], 'fd.noFriendsYet': ['გასაზიარებლად ჯერ მეგობარი დაამატე.', 'Add a friend first to share with them.'],
  'fd.shareOut': ['სხვაგან გაზიარება', 'Share elsewhere'], 'fd.copy': ['ბმულის კოპირება', 'Copy link'], 'fd.shareText': ['ნახე ფანდურის აპში: {s}', 'See it in the Panduri app: {s}'],
  'fd.delete': ['პოსტის წაშლა', 'Delete post'], 'fd.deleted': ['წაიშალა', 'Deleted'], 'fd.react': ['რეაქცია', 'React'], 'fd.more': ['მეტი', 'more'],
  'fd.rx.panduri': ['ფანდური', 'Panduri'], 'fd.rx.heart': ['მიყვარს', 'Love'], 'fd.rx.fire': ['ცეცხლი', 'Fire'], 'fd.rx.clap': ['ტაში', 'Applause'], 'fd.rx.laugh': ['სასაცილო', 'Funny'], 'fd.rx.wow': ['ვაუ', 'Wow'], 'fd.rx.sad': ['სამწუხარო', 'Sad'],
  'fd.views': ['{n} ნახვა', '{n} views'], 'fd.sound': ['ხმა', 'Sound'], 'fd.play': ['დაკვრა', 'Play'],
  'fd.unavailable': ['ეს პოსტი აღარ არის ხელმისაწვდომი.', 'This post is no longer available.'], 'fd.friendsOnly': ['მხოლოდ მეგობრებისთვის', 'Friends only'],
  'fd.addFriend': ['დამატება', 'Add'], 'fd.requested': ['თხოვნა გაგზავნილია', 'Requested'], 'fd.posts': ['პოსტები', 'Posts'], 'fd.noUserPosts': ['ჯერ პოსტი არ აქვს.', 'No posts yet.'],
  'fd.slow': ['ცოტა დაისვენე — ამ საათში მეტი პოსტი ვეღარ დაიდება.', 'Take a breath — no more posts this hour.'], 'fd.needText': ['დაწერე რამე ან აირჩიე ფაილი.', 'Write something or choose a file.'],
  'fd.mediaBlocked': ['ფაილი ვერ ჩაიტვირთა.', 'The file could not be loaded.'], 'fd.hint': ['ორჯერ შეეხე — ფანდური 🪕', 'Double-tap — panduri 🪕'],
  'fr.title': ['მეგობრები', 'Friends'], 'fr.myNick': ['შენი nickname', 'Your nickname'],
  'fr.nickWhy': ['მეგობრები ამ სახელით გიპოვიან: ლათინური ასოები, ციფრები, _ და . (3–24 სიმბოლო).', 'Friends find you by this name: Latin letters, digits, _ and . (3–24 characters).'],
  'fr.nickNeed': ['საზოგადოებაში შესასვლელად აირჩიე nickname — მეგობრები მისით დაგამატებენ.', 'Choose a nickname to join the community — friends add you by it.'],
  'fr.nickTaken': ['ეს nickname დაკავებულია — სცადე სხვა.', 'That nickname is taken — try another.'],
  'fr.nickBad': ['nickname: 3–24 ლათინური ასო, ციფრი, _ ან . (თავში ან ბოლოში არა).', 'Nickname: 3–24 Latin letters, digits, _ or . (not at the start or end).'],
  'fr.add': ['მეგობრის დამატება nickname-ით', 'Add a friend by nickname'], 'fr.find': ['ძიება', 'Find'], 'fr.notFound': ['ასეთი nickname ვერ მოიძებნა.', 'No one has that nickname.'], 'fr.self': ['ეს შენ ხარ 🙂', 'That is you 🙂'],
  'fr.send': ['თხოვნის გაგზავნა', 'Send request'], 'fr.sent': ['თხოვნა გაიგზავნა — როცა დაგეთანხმება, სიმა შეგატყობინებს.', 'Request sent — Sima will tell you when they accept.'], 'fr.already': ['უკვე მეგობრები ხართ', 'You are already friends'],
  'fr.incoming': ['მეგობრობის თხოვნები', 'Friend requests'], 'fr.accept': ['დათანხმება', 'Accept'], 'fr.decline': ['უარი', 'Decline'],
  'fr.outgoing': ['გაგზავნილი თხოვნები', 'Sent requests'], 'fr.cancel': ['გაუქმება', 'Cancel'], 'fr.list': ['შენი მეგობრები', 'Your friends'],
  'fr.none': ['მეგობრები ჯერ არ გყავს. დაამატე ვინმე მისი nickname-ით.', 'No friends yet. Add someone by their nickname.'],
  'fr.remove': ['მეგობრებიდან წაშლა', 'Remove friend'], 'fr.removeQ': ['წაიშალოს {n} მეგობრებიდან?', 'Remove {n} from your friends?'], 'fr.friend': ['მეგობარი', 'Friend'],
  'fr.edit': ['nickname-ის შეცვლა', 'Change nickname'], 'fr.tooMany': ['ძალიან ბევრი გაუპასუხებელი თხოვნა გაქვს.', 'You have too many unanswered requests.'],
  'fr.onlyFriends': ['აქ მხოლოდ შენი მეგობრები ჩანან. გლობალურ ფიდში ჩანს მხოლოდ ის, რასაც ავტორი ყველასთვის აქვეყნებს.', 'Only your friends are listed here. The global feed shows only what authors chose to make public.']
});

PD.social = (() => {
  const h = PD.h, C = PD.cloud, ic = PD.ic;
  const U = () => PD.community.util;
  const REACTS = ['panduri', 'heart', 'fire', 'clap', 'laugh', 'wow', 'sad'];
  const EMO = { heart: '❤️', fire: '🔥', clap: '👏', laugh: '😂', wow: '😮', sad: '😢' };
  // the panduri as a reaction: there is no emoji for it, so the app draws one (pear-shaped body, sound hole, neck, three pegs)
  const PANDURI = '<svg viewBox="0 0 32 32" aria-hidden="true"><g transform="rotate(-32 16 16)"><path d="M14.2 3.2h3.6l.4 2.2-.4 8.2h-3.6l-.4-8.2z" fill="#6B2A17"/><circle cx="13.3" cy="4.4" r="1.05" fill="#E0A878"/><circle cx="18.7" cy="4.4" r="1.05" fill="#E0A878"/><circle cx="18.9" cy="7.3" r="1.05" fill="#E0A878"/><path d="M16 12.4c4.6 2.2 7.6 6.4 7.6 10.4 0 4.6-3.4 7.6-7.6 7.6s-7.6-3-7.6-7.6c0-4 3-8.2 7.6-10.4z" fill="#C98B5B"/><path d="M16 13.6c3.7 2 6.2 5.5 6.2 9 0 3.8-2.7 6.4-6.2 6.4" fill="none" stroke="#E0A878" stroke-width=".7" opacity=".7"/><circle cx="16" cy="21.4" r="2.1" fill="#2A1A10"/><path d="M15.2 5.6v22.6M16 5.6v22.6M16.8 5.6v22.6" stroke="#F1ECE6" stroke-width=".28" opacity=".85"/><rect x="13.6" y="26.2" width="4.8" height="1.1" rx=".5" fill="#3B2414"/></g></svg>';
  /** for text that leaves the app (the lock screen, a notification): the panduri stands in as the closest emoji */
  const glyphText = k => k === 'panduri' ? '🪕' : EMO[k] || '';
  const glyph = k => !k ? '' : k === 'panduri' ? '<span class="rx-g rx-pan">' + PANDURI + '</span>' : '<span class="rx-g">' + EMO[k] + '</span>';
  const I = d => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>';
  const IC = {
    comment: I('<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-5 4v-4.2A2.5 2.5 0 0 1 4 13.5z"/>'),
    share: I('<path d="M14 5l7 7-7 7M21 12H9a6 6 0 0 0-6 6v1"/>'), photo: I('<rect x="3" y="5" width="18" height="14" rx="2.5"/><circle cx="9" cy="10" r="1.8"/><path d="M21 16l-5.5-5.5L6 19"/>'),
    music: I('<path d="M9 18V6l10-2v12"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="16.5" cy="16" r="2.5"/>'), text: I('<path d="M5 6h14M12 6v13M8 19h8"/>'),
    sound: I('<path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/>'), mute: I('<path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M17 9l5 6M22 9l-5 6"/>'),
    users: I('<circle cx="9" cy="8.5" r="3.2"/><path d="M3 19.5c.9-3.2 3.3-4.6 6-4.6s5.1 1.4 6 4.6"/><path d="M15.5 5.6a3 3 0 0 1 0 5.8M17.5 14.9c1.6.6 2.9 2 3.5 4.6"/>'),
    globe: I('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.7 3.6 5.7 3.6 9s-1.1 6.3-3.6 9c-2.5-2.7-3.6-5.7-3.6-9S9.5 5.7 12 3z"/>'),
    trash: I('<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>'), flag: I('<path d="M5 21V4h13l-3 4 3 4H5"/>'), link: I('<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>'),
    addUser: I('<circle cx="9" cy="8" r="3.5"/><path d="M3 20c1-3.6 3.5-5 6-5s5 1.4 6 5M18 8v6M15 11h6"/>')
  };
  const t0 = (k, p) => t(k, p);
  const nf = n => { n = +n || 0; return n >= 1e6 ? (n / 1e6).toFixed(n >= 1e7 ? 0 : 1).replace(/\.0$/, '') + 'M' : n >= 1e3 ? (n / 1e3).toFixed(n >= 1e4 ? 0 : 1).replace(/\.0$/, '') + 'K' : String(n); };
  const avatar = (url, name, cls) => h('span', { class: 'avatar' + (cls ? ' ' + cls : ''), html: url ? '<img alt="" src="' + PD.esc(url) + '">' : U().initial(name) });
  const label = p => p.author_name || (p.author_nick ? '@' + p.author_nick : '—');

  /* ---------------- files: prepare, upload, show ---------------- */
  const LIMIT = { photo: 20, video: 50, audio: 30 }, LONG = { video: 10, audio: 15 };   // MB; minutes
  const kindOf = f => /^image\//.test(f.type) ? 'photo' : /^video\//.test(f.type) ? 'video' : /^audio\//.test(f.type) ? 'audio' : (/\.(m4a|mp3|wav|aac|ogg|flac)$/i.test(f.name) ? 'audio' : /\.(mp4|mov|webm|m4v)$/i.test(f.name) ? 'video' : null);
  const ACCEPT = { photo: 'image/*', video: 'video/*', audio: 'audio/*,.m4a,.mp3,.wav,.aac,.ogg,.flac', any: 'image/*,video/*,audio/*' };
  const fail = k => { const e = new Error(k); e.code = k; return e; };
  function canvasBlob(src, w, h0, max, q) {
    const k = Math.min(1, max / Math.max(w, h0)), cw = Math.max(1, Math.round(w * k)), ch = Math.max(1, Math.round(h0 * k));
    const c = document.createElement('canvas'); c.width = cw; c.height = ch; c.getContext('2d').drawImage(src, 0, 0, cw, ch);
    return new Promise(res => c.toBlob(b => res(b), 'image/jpeg', q || .85));
  }
  function loadMedia(tag, url) {
    return new Promise((res, rej) => {
      const m = document.createElement(tag); m.preload = 'metadata'; m.muted = true; m.playsInline = true; m.src = url;
      const tm = setTimeout(() => rej(fail('badFile')), 15000);
      m.onloadedmetadata = () => { clearTimeout(tm); res(m); }; m.onerror = () => { clearTimeout(tm); rej(fail('badFile')); };
    });
  }
  /** a file the member chose → what will be uploaded: photos are made smaller, videos get a still for the feed */
  async function prepare(file, want) {
    const kind = want === 'any' || !want ? kindOf(file) : want;
    if (!kind || (want && want !== 'any' && kindOf(file) && kindOf(file) !== want)) throw fail('badFile');
    if (file.size > LIMIT[kind] * 1048576 && !(kind === 'photo' && file.type !== 'image/gif')) throw Object.assign(fail('tooBig'), { n: LIMIT[kind] });
    const url = URL.createObjectURL(file);
    try {
      if (kind === 'photo') {
        if (file.type === 'image/gif') return { kind, blob: file, ext: 'gif', meta: {} };
        const img = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = () => rej(fail('badFile')); i.src = url; });
        const blob = await canvasBlob(img, img.naturalWidth, img.naturalHeight, 1600, .86);
        if (!blob) throw fail('badFile');
        const k = Math.min(1, 1600 / Math.max(img.naturalWidth, img.naturalHeight));
        return { kind, blob, ext: 'jpg', meta: { w: Math.round(img.naturalWidth * k), h: Math.round(img.naturalHeight * k) } };
      }
      const m = await loadMedia(kind === 'video' ? 'video' : 'audio', url);
      const dur = isFinite(m.duration) ? m.duration : 0;
      if (dur > LONG[kind] * 60) throw Object.assign(fail('tooLong'), { n: LONG[kind] });
      const ext = (file.name.match(/\.([a-z0-9]{2,5})$/i) || [, kind === 'video' ? 'mp4' : 'm4a'])[1].toLowerCase();
      const out = { kind, blob: file, ext, meta: { dur: Math.round(dur * 10) / 10 } };
      if (kind === 'video') {
        out.meta.w = m.videoWidth; out.meta.h = m.videoHeight;
        try {   // the still: a frame a little way in (some codecs cannot be drawn by this browser; then the post has none)
          await new Promise((res, rej) => { m.onseeked = res; m.onerror = rej; m.currentTime = Math.min(1, dur / 3 || 0); setTimeout(res, 4000); });
          if (m.videoWidth) out.thumb = await canvasBlob(m, m.videoWidth, m.videoHeight, 720, .8);
        } catch (_) {}
      }
      return out;
    } finally { setTimeout(() => URL.revokeObjectURL(url), 30000); }
  }
  const MIME = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', gif: 'image/gif', mp4: 'video/mp4', m4v: 'video/mp4', mov: 'video/quicktime', webm: 'video/webm', mp3: 'audio/mpeg', m4a: 'audio/mp4', aac: 'audio/aac', wav: 'audio/wav', ogg: 'audio/ogg', flac: 'audio/flac' };
  const name = ext => C.uid + '/{d}/' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8) + '.' + ext;
  /** scope: 'p' feed post · 'c' chat · 'h' help board. Returns the columns to store with the row. */
  async function upload(prep, scope, onProgress, cover) {
    const mk = ext => name(ext).replace('{d}', scope);
    const typed = (b, ext) => b.type ? b : new Blob([b], { type: MIME[ext] || 'application/octet-stream' });
    const main = await C.storage.upload(mk(prep.ext), typed(prep.blob, prep.ext), p => onProgress && onProgress(p * (prep.thumb || cover ? .92 : 1)));
    let thumb = null; const still = cover || prep.thumb;
    if (still) { try { thumb = await C.storage.upload(mk('jpg'), typed(still, 'jpg')); } catch (_) {} }
    onProgress && onProgress(1);
    return { media_path: main, thumb_path: thumb, media_kind: prep.kind, media_meta: prep.meta || {} };
  }
  const urls = rows => C.storage.urls([].concat(...rows.map(r => [r.media_path, r.thumb_path]))).catch(() => ({}));
  const fileErr = e => e && e.code === 'tooBig' ? t('fd.tooBig', { n: e.n }) : e && e.code === 'tooLong' ? t('fd.tooLong', { n: e.n }) : e && e.code === 'badFile' ? t('fd.badFile') : e && e.code === 'too-large' ? t('fd.tooBig', { n: 50 }) : U().err(e);
  /** a photo, video or audio stored on the server, as an element (opts.feed: big, autoplay is handled by the feed) */
  function mediaEl(m, opts) {
    opts = opts || {};
    const src = C.storage.url(m.media_path), poster = m.thumb_path ? C.storage.url(m.thumb_path) : null, kind = m.media_kind || m.kind;
    if (!src) return h('div', { class: 'md-miss', 'data-t': 'fd.mediaBlocked' });
    if (kind === 'photo') { const i = h('img', { class: 'md-img', alt: '', src, loading: 'lazy', decoding: 'async' }); if (!opts.feed) i.onclick = () => viewer(src); return i; }
    if (kind === 'video') {
      const v = h('video', { class: 'md-vid', src, poster, preload: opts.feed ? 'metadata' : 'none', playsinline: true, 'webkit-playsinline': true });
      if (opts.feed) { v.loop = true; v.muted = !PD.store.get('fd.sound', false); } else v.controls = true;
      return v;
    }
    const wrap = h('div', { class: 'md-aud' + (opts.feed ? ' big' : '') }, [poster ? h('img', { class: 'md-cover', alt: '', src: poster }) : h('span', { class: 'md-note', html: PANDURI })]);
    const a = h('audio', { src, preload: 'none', controls: !opts.feed });
    wrap.appendChild(a); wrap._audio = a;
    return wrap;
  }
  function viewer(src) {
    const v = h('div', { class: 'md-view', role: 'dialog', 'aria-modal': 'true' }, [h('img', { alt: '', src }), h('button', { class: 'md-x', 'aria-label': t('close'), html: ic.close })]);
    const lid = PD.layers.push(close);
    function close(fromBack) { if (fromBack !== true) PD.layers.done(lid); v.remove(); }
    v.onclick = () => close(); document.body.appendChild(v);
  }

  /* ---------------- reactions ---------------- */
  /** the row of seven above the button; picks one, or takes the current one back */
  function picker(anchor, cur, onPick) {
    document.querySelectorAll('.rx-pick').forEach(x => x.remove());
    const box = h('div', { class: 'rx-pick', role: 'menu' }, REACTS.map(k => h('button', { class: 'rx-o' + (k === cur ? ' on' : ''), role: 'menuitem', 'aria-label': t('fd.rx.' + k), title: t('fd.rx.' + k), html: glyph(k),
      onclick: e => { e.stopPropagation(); close(); onPick(k === cur ? null : k); } })));
    document.body.appendChild(box);
    const r = anchor.getBoundingClientRect(), bw = box.offsetWidth, bh = box.offsetHeight;
    box.style.left = Math.max(8, Math.min(innerWidth - bw - 8, r.left + r.width / 2 - bw / 2)) + 'px';
    box.style.top = Math.max(8, r.top - bh - 8) + 'px';
    const away = e => { if (!box.contains(e.target)) close(); };
    function close() { box.remove(); document.removeEventListener('pointerdown', away, true); }
    setTimeout(() => document.addEventListener('pointerdown', away, true), 0);
    const f = box.querySelector('button'); f && f.focus({ preventScroll: true });
    return close;
  }
  /** tap: the panduri (or take mine back); hold, or right-click: choose */
  function holdable(btn, onTap, onHold) {
    let tm = 0, held = false;
    btn.addEventListener('pointerdown', () => { held = false; clearTimeout(tm); tm = setTimeout(() => { held = true; onHold(); }, 420); });
    ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => btn.addEventListener(ev, () => clearTimeout(tm)));
    btn.addEventListener('click', e => { e.preventDefault(); if (held) return; onTap(); });
    btn.addEventListener('contextmenu', e => { e.preventDefault(); clearTimeout(tm); held = true; onHold(); });
    btn.addEventListener('keydown', e => { if (e.key === 'ArrowUp' || (e.key === 'Enter' && e.shiftKey)) { e.preventDefault(); onHold(); } });
  }
  function burst(at) { const b = h('span', { class: 'rx-burst', html: PANDURI }); at.appendChild(b); setTimeout(() => b.remove(), 900); }

  /* ---------------- the feed ---------------- */
  function seg(cur, onPick) {
    return h('div', { class: 'fd-seg', role: 'tablist' }, [['foryou', 'fd.global', IC.globe], ['friends', 'fd.friends', IC.users]].map(([k, key, icon]) =>
      h('button', { role: 'tab', 'aria-selected': String(cur === k), class: cur === k ? 'on' : '', html: icon + '<span data-t="' + key + '"></span>', onclick: () => onPick(k) })));
  }
  /** box: where the feed goes. own: the page scope. one: show a single post (opened from a notification or a chat). */
  function feed(box, own, one) {
    let tab = PD.store.get('fd.tab', 'foryou');
    const top = h('div', { class: 'fd-top' });
    const scroll = h('div', { class: 'fd-scroll', tabindex: '0', 'aria-label': t('cm.feed') });
    box.append(h('div', { class: 'fd-stage' }, [scroll, top]));   // the switch and the + sit on the picture, as in a vertical video feed
    document.documentElement.classList.add('fd-on'); own(() => document.documentElement.classList.remove('fd-on'));   // Sima's button would cover the rail
    const fit = () => { const r = scroll.getBoundingClientRect(), nav = document.querySelector('.tabbar'), nh = nav && nav.offsetHeight && getComputedStyle(nav).display !== 'none' ? nav.getBoundingClientRect().top : innerHeight; scroll.style.height = Math.max(320, Math.min(nh, innerHeight) - r.top - 10) + 'px'; };
    requestAnimationFrame(fit); addEventListener('resize', fit); own(() => removeEventListener('resize', fit));
    const st = { items: [], ids: new Set(), done: false, busy: false, before: null };
    const seen = new Set(), queue = new Set(); let viewT = null;
    const flushSeen = () => { const ids = [...queue]; queue.clear(); if (ids.length) C.social.seen(ids).catch(() => {}); };
    const iv = setInterval(flushSeen, 5000); own(() => { clearInterval(iv); flushSeen(); });
    const io = new IntersectionObserver(es => es.forEach(e => {
      const card = e.target, v = card.querySelector('video'), a = card._audio;
      if (e.isIntersecting && e.intersectionRatio >= .6) {
        card.classList.add('act');
        if (v) v.play().catch(() => {});
        clearTimeout(viewT); viewT = setTimeout(() => { const id = +card.dataset.id; if (!seen.has(id) && card.dataset.mine !== '1') { seen.add(id); queue.add(id); } }, 1500);
        const i = [...scroll.children].indexOf(card); if (i >= scroll.children.length - 3) more();
      } else { card.classList.remove('act'); if (v) v.pause(); if (a && !a.paused) a.pause(); }
    }), { root: scroll, threshold: [0, .6] });
    own(() => { io.disconnect(); scroll.querySelectorAll('video,audio').forEach(m => { try { m.pause(); } catch (_) {} }); });
    function head() {
      top.innerHTML = '';
      if (one) { top.append(h('button', { class: 'pz-ic', 'aria-label': t('back'), html: ic.back, onclick: () => PD.app.back('community') }), h('b', { class: 'grow', 'data-t': 'fd.posts' })); PD.i18n.apply(top); return; }
      top.append(seg(tab, k => { if (k === tab) { scroll.scrollTo({ top: 0, behavior: 'smooth' }); return; } tab = k; PD.store.set('fd.tab', k); reset(); }),
        h('button', { class: 'btn primary small fd-new', 'aria-label': t('fd.new'), html: ic.plus + '<span data-t="fd.new"></span>', onclick: () => compose(p => { if (p.visibility === 'friends' && tab === 'foryou') { tab = 'friends'; PD.store.set('fd.tab', tab); reset(); } else prepend(p); }) }));
      PD.i18n.apply(top);
    }
    function reset() { st.items = []; st.ids.clear(); st.done = false; st.before = null; scroll.innerHTML = ''; head(); more(); }
    function empty() {
      const f = tab === 'friends';
      scroll.appendChild(h('div', { class: 'fd-empty' }, [h('span', { class: 'cm-big', html: f ? IC.users : IC.globe }), h('p', { 'data-t': one ? 'fd.unavailable' : f ? 'fd.emptyF' : 'fd.emptyG' }),
        one ? null : f ? h('button', { class: 'btn', 'data-t': 'fd.findFriends', onclick: () => { PD.store.set('cm.tab', 'friends'); PD.app.render(); } }) : h('button', { class: 'btn primary', 'data-t': 'fd.new', onclick: () => compose(prepend) })].filter(Boolean)));
      PD.i18n.apply(scroll);
    }
    async function more() {
      if (st.busy || st.done) return; st.busy = true;
      try {
        const rows = (one ? await C.social.feed('one', { before: one }) : await C.social.feed(tab, tab === 'foryou' ? { skip: [...st.ids], lim: 8 } : { before: st.before, lim: 8 })) || [];
        const fresh = rows.filter(r => !st.ids.has(r.id));
        if (!fresh.length) { st.done = true; if (!st.items.length) empty(); else if (!one && !scroll.querySelector('.fd-endnote')) scroll.appendChild(h('div', { class: 'fd-card fd-endnote' }, [h('p', { class: 'muted', text: t('fd.end') })])); return; }
        await urls(fresh);
        fresh.forEach(p => { st.ids.add(p.id); st.items.push(p); st.before = st.before == null ? p.id : Math.min(st.before, p.id); const c = card(p, () => { c.remove(); }); scroll.appendChild(c); io.observe(c); });
        if (one) st.done = true;
      } catch (e) { if (!st.items.length) { scroll.innerHTML = ''; scroll.appendChild(h('p', { class: 'muted fd-err', text: U().err(e) })); } }
      finally { st.busy = false; }
    }
    async function prepend(p) {
      await urls([p]); st.ids.add(p.id);
      const c = card(p, () => c.remove()); scroll.prepend(c); io.observe(c); scroll.querySelectorAll('.fd-empty').forEach(x => x.remove()); scroll.scrollTo({ top: 0 });
    }
    head(); more();
    // keyboard: ↑ ↓ / j k move one post
    scroll.addEventListener('keydown', e => { if (!/^(ArrowDown|ArrowUp|j|k|PageDown|PageUp)$/.test(e.key) || e.target !== scroll) return; e.preventDefault(); const d = /Down|j/.test(e.key) ? 1 : -1; scroll.scrollBy({ top: d * scroll.clientHeight, behavior: 'smooth' }); });
  }

  /** one post, one screen */
  function card(p, onGone) {
    const mine = p.author === C.uid;
    const el = h('article', { class: 'fd-card k-' + p.kind, 'data-id': p.id, 'data-mine': mine ? '1' : '0' });
    const stage = h('div', { class: 'fd-media' });
    if (p.kind === 'text') stage.appendChild(h('div', { class: 'fd-text', text: p.caption }));
    else {
      const m = mediaEl(p, { feed: true });
      if (p.kind === 'photo' && m.tagName === 'IMG') { const bg = h('div', { class: 'fd-bg' }); bg.style.backgroundImage = 'url("' + m.src.replace(/"/g, '%22') + '")'; stage.appendChild(bg); }
      if (p.kind === 'video' && p.thumb_path && C.storage.url(p.thumb_path)) { const bg = h('div', { class: 'fd-bg' }); bg.style.backgroundImage = 'url("' + C.storage.url(p.thumb_path).replace(/"/g, '%22') + '")'; stage.appendChild(bg); }
      stage.appendChild(m);
      if (m._audio) { el._audio = m._audio; audioUI(el, m); }
      if (m.tagName === 'VIDEO') videoUI(el, m);
    }
    el.appendChild(stage);
    // double-tap anywhere on the picture: the panduri
    let lastTap = 0;
    stage.addEventListener('click', e => {
      const now = Date.now();
      if (now - lastTap < 300) { lastTap = 0; if (p.my_reaction !== 'panduri') react('panduri'); burst(el); return; }
      lastTap = now;
      const v = stage.querySelector('video'); if (v) setTimeout(() => { if (lastTap && Date.now() - lastTap >= 290) { v.paused ? v.play().catch(() => {}) : v.pause(); el.classList.toggle('paused', v.paused); } }, 300);
    });
    // who, what, when
    const who = h('button', { class: 'fd-who', onclick: () => profile(p.author) }, [avatar(p.author_avatar, p.author_name), h('span', {}, [h('b', { text: label(p) }), p.author_nick ? h('small', { text: '@' + p.author_nick }) : null].filter(Boolean))]);
    const cap = p.kind !== 'text' && p.caption ? h('p', { class: 'fd-cap', text: p.caption }) : null;
    if (cap) cap.onclick = () => cap.classList.toggle('open');
    const meta = h('small', { class: 'fd-meta', text: U().ago(p.created_at) + (p.visibility === 'friends' ? ' · ' + t('fd.friendsOnly') : '') + (p.views ? ' · ' + t('fd.views', { n: nf(p.views) }) : '') });
    const info = h('div', { class: 'fd-info' }, [h('div', { class: 'fd-whorow' }, [who, !mine && !p.friend ? addChip(p) : null].filter(Boolean)), cap, meta].filter(Boolean));
    // the rail: react · comment · share · more
    const rxB = h('button', { class: 'fd-act fd-rx' + (p.my_reaction ? ' on' : ''), 'aria-label': t('fd.react') }), rxN = h('small', {});
    const paint = () => { rxB.innerHTML = p.my_reaction ? glyph(p.my_reaction) : glyph('panduri'); rxB.classList.toggle('on', !!p.my_reaction); rxN.textContent = nf(p.reactions); };
    async function react(k) {
      const prev = p.my_reaction, before = p.reactions;
      p.my_reaction = k; p.reactions = before + (k && !prev ? 1 : !k && prev ? -1 : 0); paint();
      try { await C.social.react(p.id, k); } catch (e) { p.my_reaction = prev; p.reactions = before; paint(); PD.ui.toast(U().err(e)); }
    }
    holdable(rxB, () => react(p.my_reaction ? null : 'panduri'), () => picker(rxB, p.my_reaction, react));
    paint();
    const top3 = (p.top || []).filter(k => k !== p.my_reaction).slice(0, 2);
    const cmN = h('small', { text: nf(p.comments) });
    const rail = h('div', { class: 'fd-rail' }, [
      h('div', { class: 'fd-col' }, [rxB, rxN, top3.length ? h('span', { class: 'fd-top3', html: top3.map(glyph).join('') }) : null].filter(Boolean)),
      h('div', { class: 'fd-col' }, [h('button', { class: 'fd-act', 'aria-label': t('fd.comments'), html: IC.comment, onclick: () => comments(p, n => { p.comments = n; cmN.textContent = nf(n); }) }), cmN]),
      h('div', { class: 'fd-col' }, [h('button', { class: 'fd-act', 'aria-label': t('fd.share'), html: IC.share, onclick: () => share(p) }), h('small', { text: p.shares ? nf(p.shares) : '' })]),
      h('div', { class: 'fd-col' }, [h('button', { class: 'fd-act', 'aria-label': t('md.more'), html: ic.more, onclick: () => postMenu(p, onGone) })])]);
    el.append(h('div', { class: 'fd-shade' }), info, rail);
    return el;
  }
  function videoUI(el, v) {
    const b = h('button', { class: 'fd-snd', 'aria-label': t('fd.sound') });
    const paint = () => { b.innerHTML = v.muted ? IC.mute : IC.sound; b.setAttribute('aria-pressed', String(!v.muted)); };
    b.onclick = e => { e.stopPropagation(); const on = v.muted; PD.store.set('fd.sound', on); document.querySelectorAll('.fd-card video').forEach(x => { x.muted = !on; }); paint(); };
    v.addEventListener('volumechange', paint); paint();
    const bar = h('i', { class: 'fd-prog' }); el.append(b, h('div', { class: 'fd-progw' }, [bar]));
    v.addEventListener('timeupdate', () => { bar.style.width = (v.duration ? v.currentTime / v.duration * 100 : 0) + '%'; });
    v.addEventListener('error', () => el.classList.add('broken'));
  }
  function audioUI(el, wrap) {
    const a = wrap._audio, play = h('button', { class: 'fd-play', 'aria-label': t('fd.play'), html: ic.play });
    const bars = h('div', { class: 'fd-wave', 'aria-hidden': 'true' }, Array.from({ length: 28 }, (_, i) => { const s = h('i'); s.style.setProperty('--h', (25 + Math.abs(Math.sin(i * 1.7 + el.dataset.id * .3)) * 75).toFixed(0) + '%'); return s; }));
    const bar = h('i', { class: 'fd-prog' }), time = h('small', { class: 'fd-time mono', text: '' });
    play.onclick = e => { e.stopPropagation(); a.paused ? a.play().catch(() => {}) : a.pause(); };
    a.addEventListener('play', () => { document.querySelectorAll('.fd-card audio, .fd-card video').forEach(x => { if (x !== a) x.pause(); }); play.innerHTML = ic.pause; el.classList.add('playing'); });
    a.addEventListener('pause', () => { play.innerHTML = ic.play; el.classList.remove('playing'); });
    a.addEventListener('timeupdate', () => { bar.style.width = (a.duration ? a.currentTime / a.duration * 100 : 0) + '%'; time.textContent = PD.fmtTime(a.currentTime) + ' / ' + PD.fmtTime(a.duration || 0); });
    wrap.append(bars, play, time); el.appendChild(h('div', { class: 'fd-progw' }, [bar]));
  }
  function addChip(p) {
    const b = h('button', { class: 'fd-add', html: IC.addUser + '<span data-t="fd.addFriend"></span>' });
    b.onclick = async e => { e.stopPropagation(); if (!p.author_nick) return profile(p.author); try { const r = await C.social.request(p.author_nick); b.innerHTML = '<span>' + PD.esc(t(r === 'friend' ? 'fr.friend' : 'fd.requested')) + '</span>'; b.disabled = true; } catch (er) { PD.ui.toast(friendErr(er)); } };
    PD.i18n.apply(b); return b;
  }

  /* ---------------- comments ---------------- */
  function comments(p, onCount) {
    PD.ui.sheet((b, close) => {
      const list = h('div', { class: 'cm-replies fd-cms' }), inp = h('textarea', { class: 'input', rows: '2', maxlength: '1000', placeholder: t('fd.writeC'), 'aria-label': t('fd.writeC'), style: 'min-height:60px;padding:10px 12px' });
      const send = async () => { const v = inp.value.trim(); if (!v) return; inp.value = ''; try { await C.social.comment(p.id, v); load(); } catch (e) { inp.value = v; PD.ui.toast(U().err(e)); } };
      inp.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } });
      b.append(h('h2', { 'data-t': 'fd.comments' }), list, h('div', { class: 'cm-bar' }, [PD.chatkit.emojiButton(inp), inp, h('button', { class: 'btn primary icon', 'aria-label': t('cm.send'), html: ic.send, onclick: send })]));
      async function load() {
        try {
          const rows = await C.social.comments(p.id) || []; list.innerHTML = ''; onCount && onCount(rows.length);
          if (!rows.length) { list.appendChild(h('p', { class: 'muted', 'data-t': 'fd.noComments' })); PD.i18n.apply(list); return; }
          rows.forEach(r => list.appendChild(h('div', { class: 'cm-reply' }, [h('small', { text: (r.author_name || '—') + ' · ' + U().ago(r.created_at) }), h('p', { text: r.body }),
            h('div', { class: 'row', style: 'gap:2px;justify-content:flex-end' }, [
              (r.author === C.uid || p.author === C.uid || C.isAdmin) ? h('button', { class: 'cm-flag', 'aria-label': t('cm.delete'), html: IC.trash, onclick: async () => { try { await C.social.uncomment(r.id); load(); } catch (e) { PD.ui.toast(U().err(e)); } } }) : null,
              r.author !== C.uid ? h('button', { class: 'cm-flag', 'aria-label': t('md.report'), html: IC.flag, onclick: () => U().reportSheet('comment', r.id) }) : null].filter(Boolean))])));
          list.scrollTop = list.scrollHeight;
        } catch (e) { list.textContent = U().err(e); }
      }
      load();
    });
  }

  /* ---------------- share: into a chat, or out of the app ---------------- */
  const linkOf = p => location.origin + location.pathname + '?go=' + encodeURIComponent('community:p:' + p.id);
  function share(p) {
    PD.ui.sheet((b, close) => {
      const list = h('div', { class: 'cm-list' });
      b.append(h('h2', { 'data-t': 'fd.share' }), h('p', { class: 'muted', 'data-t': 'fd.sendTo' }), list,
        h('div', { class: 'row', style: 'gap:8px;flex-wrap:wrap;margin-top:6px' }, [
          navigator.share ? h('button', { class: 'btn', html: IC.share + '<span data-t="fd.shareOut"></span>', onclick: () => navigator.share({ title: t('app.name'), text: t('fd.shareText', { s: (p.caption || '').slice(0, 80) }), url: linkOf(p) }).catch(() => {}) }) : null,
          h('button', { class: 'btn', html: IC.link + '<span data-t="fd.copy"></span>', onclick: async () => { try { await navigator.clipboard.writeText(linkOf(p)); PD.ui.toast(t('toast.copied')); } catch (_) {} } })].filter(Boolean)));
      (async () => {
        try {
          const fr = (await C.social.friends() || []).filter(f => f.relation === 'friend');
          if (!fr.length) { list.appendChild(h('p', { class: 'muted', 'data-t': 'fd.noFriendsYet' })); PD.i18n.apply(list); return; }
          fr.forEach(f => { const go = h('button', { class: 'btn small', 'data-t': 'cm.send' });
            go.onclick = async () => { go.disabled = true; try { const conv = await C.chat.open(f.id); await C.chat.send(conv, '', { post_ref: p.id }); go.textContent = t('fd.sent'); p.shares++; } catch (e) { go.disabled = false; PD.ui.toast(U().err(e)); } };
            list.appendChild(h('div', { class: 'cm-row' }, [avatar(f.avatar_url, f.display_name), h('div', { class: 'grow' }, [h('b', { text: f.display_name || '@' + f.nickname }), h('small', { text: '@' + (f.nickname || '') })]), go])); });
          PD.i18n.apply(list);
        } catch (e) { list.textContent = U().err(e); }
      })();
    });
  }
  function postMenu(p, onGone) {
    PD.ui.sheet((b, close) => {
      const mine = p.author === C.uid;
      b.append(h('h2', { text: label(p) }), h('div', { class: 'cm-list' }, [
        mine || C.isAdmin ? h('button', { class: 'btn', html: IC.trash + '<span data-t="fd.delete"></span>', onclick: () => { close(); PD.ui.confirm(t('fd.delete') + '?', async () => {
          try { if (mine) await C.storage.remove([p.media_path, p.thumb_path].filter(Boolean)).catch(() => {}); await C.social.remove(p.id); PD.ui.toast(t('fd.deleted')); onGone && onGone(); } catch (e) { PD.ui.toast(U().err(e)); } }); } }) : null,
        !mine ? h('button', { class: 'btn', html: IC.flag + '<span data-t="md.report"></span>', onclick: () => { close(); U().reportSheet('feed', p.id); } }) : null,
        !mine ? h('button', { class: 'btn', 'data-t': 'md.block', onclick: () => { close(); U().confirmBlock(p.author, label(p), onGone); } }) : null].filter(Boolean)));
    });
  }

  /* ---------------- a new post ---------------- */
  function compose(done) {
    PD.ui.sheet((b, close) => {
      let kind = 'photo', prep = null, cover = null, vis = PD.store.get('fd.vis', 'public'), busy = false;
      const kinds = h('div', { class: 'fd-kinds', role: 'tablist' });
      const prev = h('div', { class: 'fd-prev' }), coverRow = h('div', { class: 'fd-coverrow', hidden: true });
      const cap = h('textarea', { class: 'input', rows: '3', maxlength: '2200', placeholder: t('fd.caption'), 'aria-label': t('fd.caption'), style: 'min-height:84px;padding:10px 12px' });
      const visRow = h('div', { class: 'fd-vis', role: 'radiogroup', 'aria-label': t('fd.who') });
      const bar = h('div', { class: 'fd-upbar', hidden: true }, [h('i')]), state = h('small', { class: 'muted' });
      const go = h('button', { class: 'btn primary big', 'data-t': 'fd.post' });
      const paintKinds = () => { kinds.innerHTML = ''; [['photo', IC.photo], ['video', ic.video], ['audio', IC.music], ['text', IC.text]].forEach(([k, i]) => kinds.appendChild(h('button', { role: 'tab', 'aria-selected': String(kind === k), class: kind === k ? 'on' : '', html: i + '<span data-t="fd.' + k + '"></span>', onclick: () => { if (busy) return; kind = k; prep = null; cover = null; paint(); } }))); };
      const paintVis = () => { visRow.innerHTML = ''; [['public', IC.globe, 'fd.visPublic'], ['friends', IC.users, 'fd.visFriends']].forEach(([k, i, key]) => visRow.appendChild(h('button', { role: 'radio', 'aria-checked': String(vis === k), class: vis === k ? 'on' : '', html: i + '<span data-t="' + key + '"></span>', onclick: () => { vis = k; PD.store.set('fd.vis', k); paintVis(); PD.i18n.apply(visRow); } }))); };
      async function choose() {
        const f = await PD.ui.pickFile(ACCEPT[kind]); if (!f) return;
        state.textContent = t('fd.preparing');
        try { prep = await prepare(f, kind); state.textContent = ''; paintPrev(); }
        catch (e) { prep = null; state.textContent = fileErr(e); paintPrev(); }
      }
      function paintPrev() {
        prev.innerHTML = '';
        if (kind === 'text') { prev.hidden = true; coverRow.hidden = true; return; }
        prev.hidden = false;
        if (!prep) prev.appendChild(h('button', { class: 'fd-pick', html: (kind === 'photo' ? IC.photo : kind === 'video' ? ic.video : IC.music) + '<span data-t="fd.choose"></span>', onclick: choose }));
        else {
          const u = URL.createObjectURL(prep.blob);
          prev.appendChild(kind === 'photo' ? h('img', { alt: '', src: u }) : kind === 'video' ? h('video', { src: u, controls: true, playsinline: true, muted: true }) : h('audio', { src: u, controls: true }));
          prev.appendChild(h('button', { class: 'btn small quiet', 'data-t': 'fd.change', onclick: choose }));
        }
        coverRow.hidden = kind !== 'audio' || !prep;
        coverRow.innerHTML = '';
        if (!coverRow.hidden) coverRow.appendChild(h('button', { class: 'btn small', html: IC.photo + '<span data-t="fd.cover"></span>' + (cover ? ' ✓' : ''), onclick: async () => { const f = await PD.ui.pickFile('image/*'); if (!f) return; try { const c2 = await prepare(f, 'photo'); cover = c2.blob; paintPrev(); } catch (e) { PD.ui.toast(fileErr(e)); } } }));
        PD.i18n.apply(prev); PD.i18n.apply(coverRow);
      }
      function paint() { paintKinds(); paintPrev(); paintVis(); PD.i18n.apply(kinds); PD.i18n.apply(visRow); }
      go.onclick = async () => {
        if (busy) return;
        const caption = cap.value.trim();
        if (kind === 'text' ? !caption : !prep) { state.textContent = t('fd.needText'); return; }
        busy = true; go.disabled = true; bar.hidden = false;
        try {
          const media = kind === 'text' ? {} : await upload(prep, 'p', f => { bar.firstChild.style.width = Math.round(f * 100) + '%'; state.textContent = t('fd.uploading', { p: Math.round(f * 100) }); }, cover);
          const row = await C.social.post({ kind, caption, visibility: vis, media_path: media.media_path || null, thumb_path: media.thumb_path || null, media_meta: media.media_meta || {} });
          const p = Object.assign({ author_name: (C.profile && C.profile.display_name) || '', author_nick: C.profile && C.profile.nickname, author_avatar: C.profile && C.profile.avatar_url, my_reaction: null, top: [], friend: false }, row);
          close(); done && done(p);
        } catch (e) {
          busy = false; go.disabled = false; bar.hidden = true;
          state.textContent = /slow-down/.test(e && e.message) ? t('fd.slow') : fileErr(e);
        }
      };
      b.append(h('h2', { 'data-t': 'fd.new' }), kinds, prev, coverRow, h('div', { class: 'ck-field' }, [cap, PD.chatkit.emojiButton(cap)]), h('small', { class: 'muted', 'data-t': 'fd.who' }), visRow, bar, state, go);
      paint();
    });
  }

  /* ---------------- a person: their posts, and where we stand ---------------- */
  function profile(id) {
    if (!id) return;
    PD.ui.sheet((b, close) => {
      const headBox = h('div', { class: 'pf-head' }), grid = h('div', { class: 'fd-grid' });
      b.append(headBox, h('h3', { 'data-t': 'fd.posts' }), grid);
      (async () => {
        try {
          const rows = await C.social.feed('user', { target: id, lim: 30 }) || [];
          const any = rows[0];
          const fr = id === C.uid ? null : (await C.social.friends() || []).find(f => f.id === id);
          const nm = (fr && (fr.display_name || '@' + fr.nickname)) || (any && label(any)) || (id === C.uid ? (C.profile && C.profile.display_name) : '') || '—';
          const nick = (fr && fr.nickname) || (any && any.author_nick) || (id === C.uid && C.profile && C.profile.nickname) || '';
          const rel = id === C.uid ? 'self' : fr ? fr.relation : 'none';
          const acts = h('div', { class: 'row', style: 'gap:8px;flex-wrap:wrap' });
          if (rel === 'friend') acts.append(h('button', { class: 'btn primary small', 'data-t': 'cm.write', onclick: async () => { try { const c = await C.chat.open(id); close(); PD.app.go('community', 'c:' + c + ':' + nm); } catch (e) { PD.ui.toast(U().err(e)); } } }),
            h('span', { class: 'chip', text: '✓ ' + t('fr.friend') }));
          else if (rel === 'incoming') acts.append(h('button', { class: 'btn primary small', 'data-t': 'fr.accept', onclick: async () => { try { await C.social.respond(id, true); close(); profile(id); } catch (e) { PD.ui.toast(friendErr(e)); } } }));
          else if (rel === 'outgoing') acts.append(h('span', { class: 'chip', 'data-t': 'fd.requested' }));
          else if (rel === 'none' && nick) acts.append(h('button', { class: 'btn primary small', html: IC.addUser + '<span data-t="fr.send"></span>', onclick: async () => { try { await C.social.request(nick); close(); profile(id); PD.ui.toast(t('fr.sent'), 4000); } catch (e) { PD.ui.toast(friendErr(e)); } } }));
          if (rel !== 'self') acts.append(h('button', { class: 'pz-ic', 'aria-label': t('md.more'), html: ic.more, onclick: () => { close(); U().userActions(id, nm); } }));
          headBox.append(avatar(any && any.author_avatar, nm, 'big'), h('div', { class: 'grow' }, [h('h2', { text: nm, style: 'margin:0' }), nick ? h('small', { class: 'muted', text: '@' + nick }) : null, acts].filter(Boolean)));
          PD.i18n.apply(headBox);
          if (!rows.length) { grid.appendChild(h('p', { class: 'muted', 'data-t': 'fd.noUserPosts' })); PD.i18n.apply(grid); return; }
          await urls(rows);
          rows.forEach(p => { const th = p.kind === 'photo' ? C.storage.url(p.media_path) : p.thumb_path ? C.storage.url(p.thumb_path) : null;
            grid.appendChild(h('button', { class: 'fd-tile k-' + p.kind, onclick: () => { close(); PD.app.go('community', 'p:' + p.id); } }, [th ? h('img', { alt: '', src: th, loading: 'lazy' }) : h('span', { class: 'fd-tile-t', text: p.kind === 'text' ? p.caption.slice(0, 80) : '' }),
              p.kind === 'video' ? h('span', { class: 'fd-tile-k', html: ic.play }) : p.kind === 'audio' ? h('span', { class: 'fd-tile-k', html: IC.music }) : null, h('small', { class: 'fd-tile-n', html: glyph('panduri') + nf(p.reactions) })].filter(Boolean))); });
        } catch (e) { headBox.textContent = U().err(e); }
      })();
    });
  }

  /* ---------------- friends ---------------- */
  const friendErr = e => { const m = e && e.message || ''; return /not-found/.test(m) ? t('fr.notFound') : /self/.test(m) ? t('fr.self') : /too-many-requests/.test(m) ? t('fr.tooMany') : U().err(e); };
  const nickErr = e => { const m = e && e.message || ''; return /nickname-taken/.test(m) ? t('fr.nickTaken') : /nickname-invalid/.test(m) ? t('fr.nickBad') : U().err(e); };
  /** the nickname: shown, and changed; `need` when the member has none yet */
  function nickCard(need, onSaved) {
    const cur = (C.profile && C.profile.nickname) || '';
    const sugg = cur || ((PD.account.profile.name || '').toLowerCase().normalize('NFKD').replace(/[^a-z0-9_.]+/g, '').slice(0, 20));
    const inp = h('input', { class: 'input', autocomplete: 'username', autocapitalize: 'none', spellcheck: 'false', maxlength: '25', placeholder: 'nickname', 'aria-label': t('fr.myNick'), value: sugg });
    const msg = h('small', { class: 'muted', 'data-t': 'fr.nickWhy' });
    const save = async () => { const v = inp.value.trim().replace(/^@+/, '').toLowerCase(); if (!v) return inp.focus(); try { await C.social.setNick(v); await C.loadProfile(); onSaved ? onSaved(v) : PD.app.render(); } catch (e) { msg.textContent = nickErr(e); msg.classList.add('err'); } };
    inp.addEventListener('keydown', e => { if (e.key === 'Enter') save(); });
    return h('div', { class: 'cm-name fr-nick' }, [h('p', { 'data-t': need ? 'fr.nickNeed' : 'fr.myNick' }), h('div', { class: 'row' }, [h('span', { class: 'fr-at', text: '@' }), inp, h('button', { class: 'btn primary', 'data-t': 'cm.save', onclick: save })]), msg]);
  }
  function friends(box) {
    const nickNow = C.profile && C.profile.nickname;
    const mine = h('div', { class: 'fr-me' });
    if (nickNow) mine.append(h('span', {}, [h('small', { class: 'muted', 'data-t': 'fr.myNick' }), h('b', { text: '@' + nickNow })]), h('button', { class: 'btn small quiet', html: ic.edit, 'aria-label': t('fr.edit'), onclick: () => { mine.replaceWith(nickCard(false)); PD.i18n.apply(box); } }));
    const q = h('input', { class: 'input', type: 'search', autocapitalize: 'none', spellcheck: 'false', placeholder: '@nickname', 'aria-label': t('fr.add') });
    const found = h('div', { class: 'cm-list' });
    const find = async () => {
      const v = q.value.trim().replace(/^@+/, '').toLowerCase(); found.innerHTML = ''; if (!v) return;
      if (v === nickNow) { found.appendChild(h('p', { class: 'muted', 'data-t': 'fr.self' })); PD.i18n.apply(found); return; }
      try {
        const r = (await C.social.find(v) || [])[0];
        if (!r) { found.appendChild(h('p', { class: 'muted', 'data-t': 'fr.notFound' })); PD.i18n.apply(found); return; }
        const act = r.relation === 'friend' ? h('span', { class: 'chip', 'data-t': 'fr.already' }) : r.relation === 'outgoing' ? h('span', { class: 'chip', 'data-t': 'fd.requested' })
          : h('button', { class: 'btn primary small', 'data-t': r.relation === 'incoming' ? 'fr.accept' : 'fr.send', onclick: async () => { try { if (r.relation === 'incoming') await C.social.respond(r.id, true); else await C.social.request(v); q.value = ''; found.innerHTML = ''; PD.ui.toast(t(r.relation === 'incoming' ? 'fr.already' : 'fr.sent'), 4000); load(); } catch (e) { PD.ui.toast(friendErr(e)); } } });
        found.appendChild(h('div', { class: 'cm-row' }, [avatar(r.avatar_url, r.display_name), h('button', { class: 'grow fr-name', onclick: () => profile(r.id) }, [h('b', { text: r.display_name || '@' + r.nickname }), h('small', { text: '@' + r.nickname + ' · ' + t('lv.level', { n: r.level || 0 }) })]), act]));
        PD.i18n.apply(found);
      } catch (e) { found.textContent = friendErr(e); }
    };
    q.addEventListener('keydown', e => { if (e.key === 'Enter') find(); });
    const lists = h('div', { class: 'cm-body' });
    box.append(nickNow ? mine : nickCard(true, () => PD.app.render()), h('h3', { 'data-t': 'fr.add' }), h('div', { class: 'row fr-find' }, [q, h('button', { class: 'btn', html: ic.search + '<span data-t="fr.find"></span>', onclick: find })]), found, lists,
      h('p', { class: 'muted small-note', 'data-t': 'fr.onlyFriends' }), h('button', { class: 'btn quiet', 'data-t': 'md.blockedList', onclick: () => U().blockedSheet(load) }));
    async function load() {
      try {
        const rows = await C.social.friends() || []; lists.innerHTML = '';
        const by = k => rows.filter(r => r.relation === k);
        const row = (r, acts) => h('div', { class: 'cm-row' }, [avatar(r.avatar_url, r.display_name), h('button', { class: 'grow fr-name', onclick: () => profile(r.id) }, [h('b', {}, [r.display_name || '@' + r.nickname, r.vip ? h('span', { class: 'vip-tag', text: 'VIP' }) : null]), h('small', { text: (r.nickname ? '@' + r.nickname + ' · ' : '') + t('lv.level', { n: r.level || 0 }) })])].concat(acts));
        const inc = by('incoming'), out = by('outgoing'), fr = by('friend');
        if (inc.length) lists.append(h('h3', { 'data-t': 'fr.incoming' }), ...inc.map(r => row(r, [
          h('button', { class: 'btn primary small', 'data-t': 'fr.accept', onclick: async () => { try { await C.social.respond(r.id, true); load(); } catch (e) { PD.ui.toast(friendErr(e)); } } }),
          h('button', { class: 'btn small quiet', 'data-t': 'fr.decline', onclick: async () => { try { await C.social.respond(r.id, false); load(); } catch (e) { PD.ui.toast(friendErr(e)); } } })])));
        lists.append(h('h3', { 'data-t': 'fr.list' }));
        if (!fr.length) lists.append(h('p', { class: 'muted', 'data-t': 'fr.none' }));
        fr.forEach(r => lists.append(row(r, [
          h('button', { class: 'btn small', 'data-t': 'cm.write', onclick: async () => { try { const id = await C.chat.open(r.id); PD.app.go('community', 'c:' + id + ':' + (r.display_name || r.nickname)); } catch (e) { PD.ui.toast(U().err(e)); } } }),
          h('button', { class: 'pz-ic', 'aria-label': t('md.more'), html: ic.more, onclick: () => PD.ui.sheet((b2, close) => { b2.append(h('h2', { text: r.display_name || '@' + r.nickname }), h('div', { class: 'cm-list' }, [
            h('button', { class: 'btn', 'data-t': 'fr.remove', onclick: () => { close(); PD.ui.confirm(t('fr.removeQ', { n: r.display_name || '@' + r.nickname }), async () => { try { await C.social.unfriend(r.id); load(); } catch (e) { PD.ui.toast(U().err(e)); } }); } }),
            h('button', { class: 'btn', 'data-t': 'md.report', onclick: () => { close(); U().reportSheet('user', r.id); } }),
            h('button', { class: 'btn', 'data-t': 'md.block', onclick: () => { close(); U().confirmBlock(r.id, r.display_name, load); } })])); }) })])));
        if (out.length) lists.append(h('h3', { 'data-t': 'fr.outgoing' }), ...out.map(r => row(r, [h('button', { class: 'btn small quiet', 'data-t': 'fr.cancel', onclick: async () => { try { await C.social.unfriend(r.id); load(); } catch (e) { PD.ui.toast(U().err(e)); } } })])));
        PD.i18n.apply(lists);
      } catch (e) { lists.textContent = U().err(e); }
    }
    load();
  }

  /** a shared post inside a chat: a small card that opens it (returned at once, filled when the post arrives) */
  function postCard(id) {
    const box = h('button', { class: 'cm-shared', type: 'button' }, [h('small', { class: 'muted', text: '…' })]);
    const gone = () => { box.innerHTML = ''; box.disabled = true; box.appendChild(h('small', { class: 'muted', 'data-t': 'fd.unavailable' })); PD.i18n.apply(box); };
    (async () => {
      try {
        const p = (await C.social.feed('one', { before: id }) || [])[0];
        if (!p) return gone();
        await urls([p]);
        const th = p.kind === 'photo' ? C.storage.url(p.media_path) : p.thumb_path ? C.storage.url(p.thumb_path) : null;
        box.innerHTML = '';
        box.append(th ? h('img', { alt: '', src: th }) : h('span', { class: 'cm-shared-k', html: p.kind === 'audio' ? IC.music : p.kind === 'video' ? ic.video : IC.text }),
          h('span', { class: 'grow' }, [h('b', { text: label(p) }), h('small', { text: (p.caption || t('fd.' + p.kind)).slice(0, 90) })]));
        box.onclick = () => PD.app.go('community', 'p:' + p.id);
      } catch (_) { gone(); }
    })();
    return box;
  }

  return { feed, friends, nickCard, profile, compose, comments, picker, holdable, glyph, glyphText, prepare, upload, urls, mediaEl, fileErr, postCard, REACTS, PANDURI, ACCEPT, IC };
})();
