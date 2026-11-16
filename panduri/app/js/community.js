/* =====================================================================
   Community: learners help each other.
   The video feed (social.js) is its one screen; behind its corners:
   conversations (1:1 messages) · friends · video call (WebRTC). Everything is stored on the
   app's server (Supabase) under row-level security: only the two people
   in a conversation can read it. Video and sound of a call go directly
   between the two devices; the server only passes the connection setup.
   ===================================================================== */
PD.i18n.add({
  'cm.title': ['საზოგადოება', 'Community'],
  'cm.chats': ['მესიჯები', 'Messages'], 'cm.noServer': ['საზოგადოებას სერვერი სჭირდება — როცა სერვერი დაემატება, აქ ერთმანეთს მისწერთ.', 'The community needs the server — once it is added you can message each other here.'],
  'cm.signin': ['მიმოწერისთვის საჭიროა ანგარიში.', 'Messaging needs an account.'], 'cm.noChats': ['მესიჯები ჯერ არ გაქვს. დაამატე მეგობარი და მიწერე.', 'No messages yet. Add a friend and write to them.'], 'cm.addFriends': ['მეგობრების დამატება', 'Add friends'],
  'cm.feed': ['ფიდი', 'Feed'], 'cm.friends': ['მეგობრები', 'Friends'], 'cm.attach': ['ფოტო, ვიდეო ან აუდიო', 'Photo, video or audio'], 'cm.react': ['რეაქცია', 'React'],
  'cm.mPhoto': ['📷 ფოტო', '📷 Photo'], 'cm.mVideo': ['🎬 ვიდეო', '🎬 Video'], 'cm.mAudio': ['🎵 აუდიო', '🎵 Audio'], 'cm.mPost': ['🔗 პოსტი', '🔗 A post'],
  'cm.needServer': ['ეს ნაწილი სერვერის განახლების შემდეგ ჩაირთვება.', 'This part switches on once the server has been updated.'], 'cm.textOnly': ['სერვერი ჯერ არ არის განახლებული: ფოტო, სტიკერი და GIF გაგზავნა მისი განახლების შემდეგ შეიძლება.', 'The server has not been updated yet: photos, stickers and GIFs can be sent once it is.'],
  'cm.mSticker': ['🪕 სტიკერი', '🪕 Sticker'], 'cm.mGif': ['GIF', 'GIF'],
  'cm.audioTip': ['აუდიოსთვის WAV საუკეთესო ხარისხია (რეკომენდებული), MP3 — ნორმალური. სხვა ფორმატებიც იტვირთება. ფაილი იგზავნება ისე, როგორც არის.', 'For audio, WAV is the best quality (recommended) and MP3 is fine. Other formats upload too. The file is sent as it is.'],
  'cm.write': ['მიწერა', 'Message'], 'cm.searchChats': ['ძებნა', 'Search'], 'cm.newChat': ['ახალი მესიჯი', 'New message'], 'cm.you': ['შენ', 'You'], 'cm.unread': ['{n} წაუკითხავი შეტყობინება', '{n} unread messages'], 'cm.type': ['დაწერე…', 'Write…'], 'cm.send': ['გაგზავნა', 'Send'],
  'cm.errGen': ['ახლა ვერ მოხერხდა — სცადე ცოტა ხანში თავიდან.', 'That didn’t work just now — try again in a moment.'], 'cm.delete': ['წაშლა', 'Delete'], 'cm.err': ['ვერ მოხერხდა: {e}', 'Could not complete: {e}'], 'cm.now': ['ახლა', 'now'], 'cm.needName': ['სხვებმა რომ გიპოვონ და იცოდნენ ვინ წერს, ჩაწერე შენი სახელი.', 'So others can find you and know who is writing, add your name.'], 'cm.yourName': ['შენი სახელი', 'Your name'], 'cm.save': ['შენახვა', 'Save'],
  'cl.video': ['ვიდეო ზარი', 'Video call'], 'cl.calling': ['ირეკება…', 'Calling…'], 'cl.incoming': ['{n} გირეკავს', '{n} is calling'], 'cl.accept': ['პასუხი', 'Answer'], 'cl.decline': ['უარყოფა', 'Decline'],
  'cl.ended': ['ზარი დასრულდა', 'Call ended'], 'cl.busy': ['ხაზი დაკავებულია', 'The line is busy'], 'cl.noAnswer': ['არ უპასუხა', 'No answer'], 'cl.mute': ['მიკროფონი', 'Microphone'], 'cl.cam': ['კამერა', 'Camera'], 'cl.hang': ['დასრულება', 'Hang up'],
  'cl.failed': ['დაკავშირება ვერ მოხერხდა — ზოგ ქსელში საჭიროა TURN სერვერი (პარამეტრებში).', 'Could not connect — some networks need a TURN server (in settings).'], 'cl.connected': ['დაკავშირებულია', 'Connected'], 'cl.connecting': ['უკავშირდება…', 'Connecting…'], 'cl.unstable': ['კავშირი შეწყდა — ვცდილობთ აღდგენას…', 'Connection lost — trying to reconnect…']
});
/* report · block · rules: Apple and Google refuse an app with chat that has none of these. The server enforces them (backend/supabase/migrations/…_moderation.sql). */
PD.i18n.add({
  'cm.reports': ['საჩივრები', 'Reports'], 'md.report': ['საჩივარი', 'Report'], 'md.block': ['დაბლოკვა', 'Block'], 'md.unblock': ['განბლოკვა', 'Unblock'], 'md.more': ['მეტი', 'More'],
  'md.why': ['რატომ გინდა საჩივარი?', 'Why are you reporting this?'], 'md.abuse': ['შეურაცხყოფა ან მუქარა', 'Insults or threats'], 'md.sexual': ['უხამსი შინაარსი', 'Sexual or obscene content'], 'md.spam': ['სპამი ან თაღლითობა', 'Spam or a scam'], 'md.danger': ['საშიში ქცევა', 'Something dangerous'], 'md.other': ['სხვა', 'Something else'],
  'md.sent': ['საჩივარი გაიგზავნა. მას ადმინისტრატორი განიხილავს.', 'Report sent. An administrator will review it.'],
  'md.blockQ': ['დაიბლოკოს {n}? ვეღარ მოგწერს, ვეღარ დაგირეკავს და მის ნაწერებს ვეღარ ნახავ.', 'Block {n}? They will not be able to message or call you, and you will no longer see what they write.'], 'md.done': ['დაიბლოკა.', 'Blocked.'], 'md.blockedList': ['დაბლოკილები', 'Blocked people'], 'md.noneBlocked': ['არავინ გყავს დაბლოკილი.', 'You have not blocked anyone.'],
  'md.rulesT': ['საზოგადოების წესები', 'Community rules'], 'md.rules': ['აქ არ დაიშვება შეურაცხყოფა, მუქარა, უხამსი შინაარსი, სპამი და სხვისი პირადი მონაცემების გავრცელება. ასეთ შინაარსს ვშლით, დამრღვევს კი საზოგადოებაში წერას ვუზღუდავთ. რასაც ასეთს ნახავ, გამოგვიგზავნე საჩივრით ან დაბლოკე ავტორი.', 'Insults, threats, obscene content, spam and sharing other people\u2019s private details are not allowed here. We remove such content and stop its author from posting. If you see any, report it or block its author.'], 'md.agree': ['ვეთანხმები', 'I agree'],
  'md.filtered': ['ამ ტექსტში აკრძალული სიტყვაა. შეცვალე და ისევ სცადე.', 'This text contains a word that is not allowed. Change it and try again.'], 'md.denied': ['ეს ვერ გაიგზავნება: ან დაბლოკილია, ან საზოგადოებაში წერა შეზღუდული გაქვს.', 'This cannot be sent: someone is blocked, or posting has been restricted for you.'],
  'md.noReports': ['ღია საჩივრები არ არის.', 'No open reports.'], 'md.remove': ['შინაარსის წაშლა', 'Remove content'], 'md.ban': ['წაშლა და წერის აკრძალვა', 'Remove and ban'], 'md.dismiss': ['უარყოფა', 'Dismiss']
});

PD.community = (() => {
  const h = PD.h, C = PD.cloud, ic = PD.ic;
  const FLAG = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 21V4h13l-3 4 3 4H5"/></svg>';
  const CHEV = '<svg class="cm-chev" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>';
  const MORE = '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>';
  const ago = iso => { const d = (Date.now() - new Date(iso).getTime()) / 60000; return d < 1 ? t('cm.now') : d < 60 ? Math.round(d) + "'" : d < 1440 ? Math.round(d / 60) + 'h' : new Date(iso).toLocaleDateString(PD.i18n.locale); };
  // Georgian has no capitals in running text: toUpperCase() would turn „ნ“ into Mtavruli „Ნ“
  const initial = n => { const c = [...((n || '?').trim())][0] || '?'; return PD.esc(/[\u10A0-\u10FF\u1C90-\u1CBF]/.test(c) ? c : c.toUpperCase()); };
  // what the learner reads: no connection, no server, or a plain „try again" — never the server's own SQL text (that goes to the console)
  const err = e => {
    const c = e && e.code;
    if (c === 'offline') return t('au.offline');
    if (c === 'no-backend') return t('au.noBackend');
    if (e && /objectionable-content/.test(e.message)) return t('md.filtered');
    if (c === '42501') return t('md.denied');
    if (['PGRST202', 'PGRST205', '42703', '42P01', 'NOT_FOUND'].includes(c) || /Bucket not found|Requested function was not found/i.test((e && e.message) || '')) return t('cm.needServer');
    console.warn('community:', e);
    return t('cm.errGen');
  };
  /** the people this account has blocked; an empty set before the server has the moderation tables */
  async function blockedIds() { try { return new Set(((await C.moderation.blocks()) || []).map(b => b.id)); } catch (_) { return new Set(); } }
  function reportSheet(kind, id) {
    PD.ui.sheet((b, close) => {
      b.append(h('h2', { 'data-t': 'md.why' }), h('div', { class: 'cm-list' }, ['abuse', 'sexual', 'spam', 'danger', 'other'].map(r => h('button', { class: 'btn', 'data-t': 'md.' + r, onclick: async () => { try { await C.moderation.report(kind, id, r); close(); PD.ui.toast(t('md.sent'), 4000); } catch (e) { PD.ui.toast(err(e)); } } }))));
    });
  }
  function confirmBlock(id, name, done) { PD.ui.confirm(t('md.blockQ', { n: name || '—' }), async () => { try { await C.moderation.block(id); PD.ui.toast(t('md.done')); done && done(); } catch (e) { PD.ui.toast(err(e)); } }); }
  function userActions(id, name, done) {
    PD.ui.sheet((b, close) => {
      b.append(h('h2', { text: name || '—' }), h('div', { class: 'cm-list' }, [
        h('button', { class: 'btn', 'data-t': 'md.report', onclick: () => { close(); reportSheet('user', id); } }),
        h('button', { class: 'btn', 'data-t': 'md.block', onclick: () => { close(); confirmBlock(id, name, done); } })]));
    });
  }
  function blockedSheet(done) {
    PD.ui.sheet(b => {
      const list = h('div', { class: 'cm-list' });
      b.append(h('h2', { 'data-t': 'md.blockedList' }), list);
      async function load() {
        try {
          const rows = await C.moderation.blocks(); list.innerHTML = '';
          if (!rows || !rows.length) { list.appendChild(h('p', { class: 'muted', 'data-t': 'md.noneBlocked' })); PD.i18n.apply(list); return; }
          rows.forEach(r => list.appendChild(h('div', { class: 'cm-row' }, [h('b', { class: 'grow', text: r.name || '—' }), h('button', { class: 'btn small', 'data-t': 'md.unblock', onclick: async () => { try { await C.moderation.unblock(r.id); load(); done && done(); } catch (e) { PD.ui.toast(err(e)); } } })])));
          PD.i18n.apply(list);
        } catch (e) { list.textContent = err(e); }
      }
      load();
    });
  }
  async function reports(box) {
    try {
      const rows = await C.moderation.reports(); box.innerHTML = '';
      if (!rows || !rows.length) { box.appendChild(h('p', { class: 'muted', 'data-t': 'md.noReports' })); PD.i18n.apply(box); return; }
      rows.forEach(r => {
        const act = decision => async () => { try { await C.moderation.resolve(r.id, decision); reports(box); } catch (e) { PD.ui.toast(err(e)); } };
        box.appendChild(h('div', { class: 'cm-reply' }, [h('small', { text: t('md.' + r.reason) + ' · ' + (r.reporter_name || '—') + ' → ' + (r.target_name || '—') + ' · ' + ago(r.created_at) }), h('p', { text: r.excerpt || '' }),
          h('div', { class: 'row' }, [h('button', { class: 'btn small', 'data-t': 'md.remove', onclick: act('remove') }), h('button', { class: 'btn small', 'data-t': 'md.ban', onclick: act('ban') }), h('button', { class: 'btn small quiet', 'data-t': 'md.dismiss', onclick: act('dismiss') })])]));
      });
      PD.i18n.apply(box);
    } catch (e) { box.textContent = err(e); }
  }
  /** the head of a screen behind the feed: back, and its name */
  const subHead = (key, more) => h('div', { class: 'cm-head cm-sub' }, [h('button', { class: 'pz-ic', 'aria-label': t('back'), html: ic.back, onclick: () => PD.app.back('community') }), h('b', { class: 'grow', 'data-t': key })].concat(more || []));
  /** The community is one screen: the video feed. Messages, friends and the saved videos open from its corners.
      param: null (the feed) · 'chats' · 'friends' · 'saved' · 'ff' (friends' videos) · 'c:<conversation>:<name>' · 'p:<post id>' */
  function page(w, param) {
    const own = PD.pageScope();
    const pg = document.getElementById('page'); if (pg) pg.classList.remove('fd-mode');
    const gate = (...kids) => w.append(h('div', { class: 'row' }, [h('button', { class: 'btn small backbtn', html: ic.back + '<span class="sr" data-t="back"></span>', onclick: () => PD.app.back('home') }), h('h1', { 'data-t': 'cm.title', style: 'margin:0' })]), ...kids);
    if (!C.configured) return gate(h('div', { class: 'cm-empty' }, [h('span', { class: 'cm-big', html: ic.chat }), h('p', { 'data-t': 'cm.noServer' })]));
    if (!C.session) return gate(h('div', { class: 'cm-empty' }, [h('span', { class: 'cm-big', html: ic.chat }), h('p', { 'data-t': 'cm.signin' }), h('button', { class: 'btn primary', 'data-t': 'pf.signin', onclick: () => PD.auth.open() })]));
    if (!PD.store.get('md.rules.' + C.uid, false)) return gate(h('div', { class: 'cm-name' }, [h('h2', { 'data-t': 'md.rulesT' }), h('p', { 'data-t': 'md.rules' }), h('button', { class: 'btn primary', 'data-t': 'md.agree', onclick: () => { PD.store.set('md.rules.' + C.uid, true); PD.app.render(); } })]));
    param = param == null ? '' : String(param);
    if (param.indexOf('c:') === 0) { const [, id, ...nm] = param.split(':'); return chatView(w, id, nm.join(':'), own); }
    if (!(C.profile && C.profile.display_name)) {
      const nm = h('input', { class: 'input', autocomplete: 'name', placeholder: t('cm.yourName'), 'aria-label': t('cm.yourName'), value: PD.account.profile.name || '' });
      return gate(h('div', { class: 'cm-name' }, [h('p', { 'data-t': 'cm.needName' }), h('div', { class: 'row' }, [nm, h('button', { class: 'btn primary', 'data-t': 'cm.save', onclick: async () => { const v = nm.value.trim(); if (!v) return nm.focus(); try { await C.db.update('profiles', { id: 'eq.' + C.uid }, { display_name: v }); await C.loadProfile(); PD.app.render(); } catch (e) { PD.ui.toast(err(e)); } } })])]));
    }
    if (param === 'friends') {
      const body = h('div', { class: 'cm-body fr' });
      w.append(h('div', { class: 'cm-top' }, [h('span', { class: 'pz-ic', 'aria-hidden': 'true' }), h('h1', { class: 'cm-h1', 'data-t': 'cm.friends' }), h('button', { class: 'pz-ic', 'aria-label': t('cn.search'), html: ic.search, onclick: () => PD.app.go('community', 's') })]), body);
      PD.social.friends(body);
      w.append(h('div', { class: 'cm-links' }, [
        h('button', { class: 'cm-link', html: ic.video + '<span data-t="fd.friendsV"></span>' + CHEV, onclick: () => PD.app.go('community', 'ff') }),
        h('button', { class: 'cm-link', html: PD.social.IC.save + '<span data-t="fd.saved"></span>' + CHEV, onclick: () => PD.app.go('community', 'saved') }),
        PD.market ? h('button', { class: 'cm-link', html: PD.market.IC.tag + '<span data-t="mk.title"></span>' + CHEV, onclick: () => PD.app.go('market') }) : null,
        h('button', { class: 'cm-link', html: PD.social.IC.flag + '<span data-t="md.blockedList"></span>' + CHEV, onclick: () => blockedSheet() }),
        C.isAdmin ? h('button', { class: 'cm-link', html: FLAG + '<span data-t="cm.reports"></span>' + CHEV, onclick: () => PD.ui.sheet(b => { const box = h('div', { class: 'cm-body' }); b.append(h('h2', { 'data-t': 'cm.reports' }), box); reports(box); }) }) : null].filter(Boolean)));
      return;
    }
    if (!C.profile.nickname) return gate(PD.social.nickCard(true));
    if (param === 'chats') return inbox(w);
    // the community's own places (cmprofile.js): profiles, search, a hashtag, the activity
    if (param === 'me' || param.indexOf('u:') === 0 || param[0] === '@') return PD.cmp.profile(w, param, own);
    if (param === 's' || param.indexOf('s:') === 0) return PD.cmp.search(w, param.slice(2), own);
    if (param.indexOf('t:') === 0) return PD.cmp.tagPage(w, param.slice(2), own);
    if (param === 'activity') return PD.cmp.activity(w);
    if (param.indexOf('l:') === 0) {   // a profile's or a search's list as a feed: l:<tab>:<target or ->:<first>:<term>
      const [, tab, target, first, ...term] = param.split(':');
      w.innerHTML = ''; if (pg) pg.classList.add('fd-mode');
      const box = h('div', { class: 'fd' }); w.append(box);
      return PD.social.feed(box, own, { list: { tab, target: target && target !== '-' ? target : null, off: Math.max(0, +first || 0), term: term.join(':') || null } });
    }
    // everything else is the feed, edge to edge
    w.innerHTML = ''; if (pg) pg.classList.add('fd-mode');
    const box = h('div', { class: 'fd' }); w.append(box);
    PD.social.feed(box, own, param.indexOf('p:') === 0 ? { one: +param.slice(2) } : param === 'saved' ? { saved: true } : param === 'ff' ? { friends: true } : null);
  }
  /** someone seen in the last five minutes counts as here now (the server's own last_seen, nothing guessed) */
  const online = iso => !!iso && Date.now() - new Date(iso).getTime() < 5 * 60000;
  const face = (url, name, on, cls) => h('span', { class: 'cm-face' + (cls ? ' ' + cls : '') + (on ? ' cm-on' : '') }, [h('span', { class: 'avatar', html: url ? '<img alt="" src="' + PD.esc(url) + '">' : initial(name) })]);
  const openChat = async (uid, name) => { try { const c = await C.chat.open(uid); PD.app.go('community', 'c:' + c + ':' + (name || '')); } catch (e) { PD.ui.toast(err(e)); } };
  const skRows = n => Array.from({ length: n }, () => h('div', { class: 'cm-crow sk', 'aria-hidden': 'true' }, [h('i', { class: 'sk-dot big' }), h('span', { class: 'grow' }, [h('i', { class: 'sk-line w40' }), h('i', { class: 'sk-line w70' })])]));
  /** messages, as in a messaging app: the title, a search, friends to start a chat with, the conversations */
  function inbox(w) {
    const q = h('input', { class: 'input cm-search', type: 'search', placeholder: t('cm.searchChats'), 'aria-label': t('cm.searchChats'), autocomplete: 'off' });
    const strip = h('div', { class: 'cm-strip', role: 'list' }), list = h('div', { class: 'cm-clist', role: 'list' }, skRows(4));
    const newB = h('button', { class: 'pz-ic', 'aria-label': t('cm.newChat'), title: t('cm.newChat'), html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>', onclick: () => pickFriend() });
    w.append(h('div', { class: 'cm-top' }, [h('span', { class: 'pz-ic', 'aria-hidden': 'true' }), h('h1', { class: 'cm-h1', 'data-t': 'cn.inbox' }), newB]));
    PD.cmp.inboxSeg(w, 'chats');
    w.append(h('label', { class: 'cm-sbox' }, [h('span', { html: ic.search }), q]), strip, h('h3', { class: 'cm-lab', 'data-t': 'cm.chats' }), list);
    let rows = [], friends = [], restricted = new Set(), showRestricted = false;
    const restrictedButton = h('button', { class:'btn small quiet ms-inbox-filter', text:t('ms.restricted'), onclick:()=>{showRestricted=!showRestricted;restrictedButton.textContent=t(showRestricted?'cm.chats':'ms.restricted');paint();} });
    w.append(restrictedButton);
    function paint() {
      const f = q.value.trim().toLowerCase(), hit = r => !f || [(r.other_name || ''), (r.other_nick || '')].join(' ').toLowerCase().includes(f);
      list.innerHTML = '';
      const shown = rows.filter(r => hit(r) && restricted.has(r.id) === showRestricted);
      if (!rows.length) { list.appendChild(h('div', { class: 'cm-empty' }, [h('span', { class: 'cm-big', html: ic.chat }), h('p', { 'data-t': 'cm.noChats' }), h('button', { class: 'btn primary', 'data-t': friends.length ? 'cm.newChat' : 'cm.addFriends', onclick: () => friends.length ? pickFriend() : PD.app.go('community', 'friends') })])); PD.i18n.apply(list); return; }
      if (!shown.length) { list.appendChild(h('p', { class: 'muted cm-none', 'data-t': 'fr.notFound' })); PD.i18n.apply(list); return; }
      const seen = new Map(friends.map(x => [x.id, x.last_seen]));
      shown.forEach(r => {
        const what = r.last_body || (r.last_kind ? t({ file:'ms.file', photo: 'cm.mPhoto', video: 'cm.mVideo', audio: 'cm.mAudio', post: 'cm.mPost', sticker: 'cm.mSticker', gif: 'cm.mGif' }[r.last_kind] || 'cm.mPost') : '');
        list.appendChild(h('button', { class: 'cm-crow' + (r.unread ? ' new' : ''), role: 'listitem', onclick: () => PD.app.go('community', 'c:' + r.id + ':' + (r.other_name || r.other_nick || '')) }, [
          face(r.other_avatar, r.other_name || r.other_nick, online(seen.get(r.other))),
          h('span', { class: 'grow' }, [h('b', { text: r.other_name || (r.other_nick ? '@' + r.other_nick : '—') }), h('small', {}, [h('span', { class: 'cm-last', text: (r.last_sender === C.uid ? t('cm.you') + ': ' : '') + what }), h('span', { class: 'cm-ago', text: ' · ' + ago(r.last_at) })])]),
          r.unread ? h('i', { class: 'cm-udot', 'aria-label': t('cm.unread', { n: r.unread }) }) : h('span', { class: 'cm-cam', html: ic.video })]));
      });
      PD.i18n.apply(list); PD.motion && PD.motion.reveal(list, 0);
    }
    function paintStrip() {
      strip.innerHTML = '';
      const fr = friends.filter(x => x.relation === 'friend');
      strip.hidden = !fr.length; if (!fr.length) return;
      fr.slice().sort((a, b) => (online(b.last_seen) - online(a.last_seen))).slice(0, 20).forEach(x => {
        const nm = x.display_name || '@' + x.nickname;
        strip.appendChild(h('button', { class: 'cm-pal', role: 'listitem', onclick: () => openChat(x.id, nm) }, [face(x.avatar_url, nm, online(x.last_seen), 'cm-ringed'), h('small', { text: (x.display_name || x.nickname || '').split(' ')[0] })]));
      });
      PD.motion && PD.motion.reveal(strip, 0);
    }
    function pickFriend() {
      const fr = friends.filter(x => x.relation === 'friend');
      PD.ui.sheet((b, close) => {
        b.append(h('h2', { 'data-t': 'cm.newChat' }), h('button', {class:'btn small',text:t('ms.group'),onclick:()=>{close();PD.messenger.createGroup();}}));
        if (!fr.length) { b.append(h('p', { class: 'muted', 'data-t': 'fd.noFriendsYet' }), h('button', { class: 'btn primary', 'data-t': 'cm.addFriends', onclick: () => { close(); PD.app.go('community', 'friends'); } })); return; }
        b.append(h('div', { class: 'cm-clist' }, fr.map(x => { const nm = x.display_name || '@' + x.nickname; return h('button', { class: 'cm-crow', onclick: () => { close(); openChat(x.id, nm); } }, [face(x.avatar_url, nm, online(x.last_seen)), h('span', { class: 'grow' }, [h('b', { text: nm }), h('small', { text: '@' + (x.nickname || '') })])]); })));
      });
    }
    q.addEventListener('input', paint);
    (async () => {
      try {
        const [all, hidden, fr, settings] = await Promise.all([C.chat.list(), blockedIds(), C.social.friends().catch(() => []), C.chat.preferences().catch(() => [])]);
        restricted = new Set(settings.filter(p => p.restricted).map(p => p.conversation_id));
        restrictedButton.hidden = !restricted.size;
        rows = (all || []).filter(r => !hidden.has(r.other)); friends = fr || [];
        PD.store.set('cm.unread', rows.reduce((a, r) => a + (r.unread || 0), 0));
        paintStrip(); paint();
      } catch (e) { list.innerHTML = ''; list.appendChild(h('p', { class: 'muted', text: err(e) })); }
    })();
  }
  function chatView(w, id, name, own) {
    return PD.messenger.view(w, id, name, own);
  }

  return { page, util: { err, ago, initial, reportSheet, confirmBlock, userActions, blockedSheet, skRows } };
})();

/* 1:1 audio/video calling. Media stays peer-to-peer; call IDs isolate signalling. */
PD.call = (() => {
  const h=PD.h,C=PD.cloud,ic=PD.ic;
  let cur=null,starting=false,ringPoll=0,ringMark=null,incoming=null;
  const ice=()=>{const servers=[{urls:'stun:stun.l.google.com:19302'}];if(PD.CONFIG?.turn?.urls)servers.push(PD.CONFIG.turn);return servers;};
  const label=(b,key,on)=>{b.setAttribute('aria-label',t(key));b.title=t(key);if(on!=null)b.setAttribute('aria-pressed',String(on));};
  function session(conv,name,role,after,video,callId){
    const root=h('div',{class:'call',role:'dialog','aria-modal':'true','aria-label':t(video?'cl.video':'cl.audio')});
    const remote=h('video',{class:'call-r',autoplay:true,playsinline:true}),local=h('video',{class:'call-l',autoplay:true,playsinline:true,muted:true});local.muted=true;
    const avatar=h('span',{class:'call-avatar',text:[...(name||'?')][0]}),status=h('small',{text:t(role==='caller'?'cl.calling':'cl.connecting')}),clock=h('time',{class:'call-clock'});
    const play=h('button',{class:'btn call-play',text:t('cl.play'),hidden:true});
    const bMic=h('button',{class:'call-b',html:ic.mic}),bCam=h('button',{class:'call-b',html:ic.video}),bFlip=h('button',{class:'call-b',html:PD.messenger.icons.flip}),bFull=h('button',{class:'call-b',html:PD.messenger.icons.full}),bEnd=h('button',{class:'call-b end',html:ic.hangup});
    label(bMic,'cl.muteAction',false);label(bCam,video?'cl.camOff':'cl.camOn',!video);label(bFlip,'cl.flip');label(bFull,'cl.fullscreen');label(bEnd,'cl.hang');
    root.append(remote,avatar,local,play,h('div',{class:'call-st'},[h('b',{text:name||'—'}),status,clock]),h('div',{class:'call-bar'},[bMic,bCam,bFlip,bFull,bEnd]));document.body.append(root);
    const pc=new RTCPeerConnection({iceServers:ice()}),stream=new MediaStream(),remoteStream=new MediaStream();remote.srcObject=remoteStream;local.srcObject=stream;
    const self={conv,pc,stream,ended:false,last:after||0,ready:false,outIce:[],inIce:[],video,callId,timer:0,noAnswer:0,drop:0,clockTimer:0,started:0,facing:'user',switching:false};cur=self;
    const trans=role==='caller'?{audio:pc.addTransceiver('audio',{direction:'sendrecv'}),video:pc.addTransceiver('video',{direction:'sendrecv'})}:{};
    function state(key){if(!self.ended)status.textContent=t(key);}
    const send=(kind,payload={})=>C.signal.send(conv,kind,{...payload,call:callId});
    async function flushRemote(){if(!pc.remoteDescription)return;for(const c of self.inIce.splice(0))try{await pc.addIceCandidate(c);}catch(_){} }
    self.flush=()=>{self.ready=true;self.outIce.splice(0).forEach(c=>send('ice',c).catch(()=>{}));};
    pc.onicecandidate=e=>{if(self.ended||!e.candidate)return;const c=e.candidate.toJSON();if(self.ready)send('ice',c).catch(()=>{});else self.outIce.push(c);};
    pc.ontrack=e=>{if(!remoteStream.getTracks().includes(e.track))remoteStream.addTrack(e.track);const paint=()=>root.classList.toggle('has-remote-video',remoteStream.getVideoTracks().some(t=>!t.muted&&t.readyState==='live'));e.track.onunmute=paint;e.track.onmute=paint;e.track.onended=paint;paint();remote.play().then(()=>play.hidden=true).catch(()=>{if(!self.ended)play.hidden=false;});};
    play.onclick=()=>remote.play().then(()=>play.hidden=true).catch(()=>{});
    pc.onconnectionstatechange=()=>{clearTimeout(self.drop);if(self.ended)return;
      if(pc.connectionState==='connected'){clearTimeout(self.noAnswer);state('cl.connected');if(!self.started){self.started=Date.now();self.clockTimer=setInterval(()=>{const s=Math.floor((Date.now()-self.started)/1000);clock.textContent=Math.floor(s/60)+':'+String(s%60).padStart(2,'0');},1000);}}
      else if(pc.connectionState==='connecting')state('cl.connecting');
      else if(pc.connectionState==='disconnected'){state('cl.unstable');self.drop=setTimeout(()=>{if(!self.ended&&pc.connectionState!=='connected')finish('cl.failed',true);},12000);if(role==='caller')restart();}
      else if(pc.connectionState==='failed')finish('cl.failed',true);
      else if(pc.connectionState==='closed')end(false);
    };
    async function restart(){try{const offer=await pc.createOffer({iceRestart:true});if(self.ended)return;await pc.setLocalDescription(offer);await send('offer',{type:offer.type,sdp:offer.sdp});}catch(_){} }
    async function attach(media){if(self.ended){media.getTracks().forEach(t=>t.stop());return false;}for(const track of media.getTracks()){if(trans[track.kind])await trans[track.kind].sender.replaceTrack(track);if(self.ended){media.getTracks().forEach(t=>t.stop());return false;}stream.addTrack(track);}return true;}
    self.open=async()=>{const media=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true,autoGainControl:true},video:video?{facingMode:'user',width:{ideal:1280},height:{ideal:720}}:false});try{if(!await attach(media))return false;}catch(e){media.getTracks().forEach(t=>t.stop());throw e;}paintCamera();return true;};
    function paintCamera(){const on=stream.getVideoTracks().some(t=>t.enabled&&t.readyState==='live');local.hidden=!on;bCam.classList.toggle('off',!on);label(bCam,on?'cl.camOff':'cl.camOn',!on);bFlip.disabled=!on;}
    bMic.onclick=()=>{const track=stream.getAudioTracks()[0];if(!track)return;track.enabled=!track.enabled;bMic.classList.toggle('off',!track.enabled);label(bMic,track.enabled?'cl.muteAction':'cl.unmute',!track.enabled);};
    bCam.onclick=async()=>{if(self.switching)return;const track=stream.getVideoTracks()[0];if(track){track.enabled=!track.enabled;paintCamera();return;}self.switching=true;bCam.disabled=true;try{const s=await navigator.mediaDevices.getUserMedia({video:{facingMode:'user'},audio:false});try{await attach(s);}catch(e){s.getTracks().forEach(t=>t.stop());throw e;}paintCamera();}catch(e){if(!self.ended)PD.ui.toast(t('cl.permission'));}finally{self.switching=false;bCam.disabled=false;}};
    bFlip.onclick=async()=>{if(self.switching||self.ended)return;self.switching=true;bFlip.disabled=true;const facing=self.facing==='user'?'environment':'user';let replacement=null;try{const s=await navigator.mediaDevices.getUserMedia({video:{facingMode:{exact:facing}},audio:false});replacement=s.getVideoTracks()[0];if(self.ended){replacement.stop();return;}await trans.video.sender.replaceTrack(replacement);const old=stream.getVideoTracks();old.forEach(t=>{stream.removeTrack(t);t.stop();});stream.addTrack(replacement);self.facing=facing;local.style.transform=facing==='user'?'scaleX(-1)':'none';}catch(e){replacement?.stop();if(!self.ended)PD.ui.toast(t('ms.cameraError'));}finally{self.switching=false;paintCamera();}};
    bFull.hidden=!root.requestFullscreen;bFull.onclick=async()=>{try{if(document.fullscreenElement===root)await document.exitFullscreen();else await root.requestFullscreen();}catch(_){} };
    bEnd.onclick=()=>end(true);const pagehide=()=>end(true);window.addEventListener('pagehide',pagehide);self.layer=PD.layers.push(()=>end(true));
    function finish(key,notify){if(self.ended)return;status.textContent=t(key);end(notify,true);}
    function end(notify,linger=false){if(self.ended)return;self.ended=true;clearTimeout(self.timer);clearTimeout(self.noAnswer);clearTimeout(self.drop);clearInterval(self.clockTimer);window.removeEventListener('pagehide',pagehide);PD.layers.done(self.layer);if(notify)send('end').catch(()=>{});pc.close();stream.getTracks().forEach(t=>t.stop());remoteStream.getTracks().forEach(t=>t.stop());local.srcObject=remote.srcObject=null;if(document.fullscreenElement===root)document.exitFullscreen().catch(()=>{});if(cur===self)cur=null;setTimeout(()=>root.remove(),linger?1200:0);}
    async function poll(){if(self.ended)return;try{const rows=await C.signal.since(conv,self.last);for(const r of rows||[]){if(self.ended)return;self.last=Math.max(self.last,r.id);if(r.sender===C.uid||r.payload?.call&&r.payload.call!==callId)continue;
      if(r.kind==='offer'){await pc.setRemoteDescription({type:r.payload.type,sdp:r.payload.sdp});
        // The callee binds tracks to the offered transceivers. Creating a second
        // set before the offer would leave its senders outside the negotiated SDP.
        for(const tr of pc.getTransceivers()){const kind=tr.receiver.track.kind;trans[kind]=tr;tr.direction='sendrecv';await tr.sender.replaceTrack(stream.getTracks().find(t=>t.kind===kind)||null);}
        await flushRemote();const answer=await pc.createAnswer();await pc.setLocalDescription(answer);await send('answer',{type:answer.type,sdp:answer.sdp});self.flush();}
      else if(r.kind==='answer'&&pc.signalingState==='have-local-offer'){await pc.setRemoteDescription({type:r.payload.type,sdp:r.payload.sdp});await flushRemote();}
      else if(r.kind==='ice'){const candidate={...r.payload};delete candidate.call;if(pc.remoteDescription)try{await pc.addIceCandidate(candidate);}catch(_){}else self.inIce.push(candidate);}
      else if(r.kind==='end'||r.kind==='busy'){finish(r.kind==='busy'?'cl.busy':'cl.ended',false);return;}
    }}catch(e){if(!self.ended&&pc.connectionState!=='connected')state('cl.connecting');}if(!self.ended)self.timer=setTimeout(poll,800);}
    self.end=end;self.poll=poll;self.send=send;self.fail=()=>finish('cl.failed',true);paintCamera();return self;
  }
  async function start(conv,name,video=true){if(cur||starting)return;if(!window.RTCPeerConnection||!navigator.mediaDevices?.getUserMedia){PD.ui.toast(t('cl.unavailable'));return;}starting=true;let s;try{if(PD.practice.active)PD.practice.close(true);const rows=await C.signal.since(conv,0);const call=crypto.randomUUID?crypto.randomUUID():Date.now().toString(36)+Math.random().toString(36).slice(2);s=session(conv,name,'caller',rows.at(-1)?.id||0,video,call);if(!await s.open())return;await s.send('ring',{name:PD.account.profile.name||'',video});if(s.ended)return;const offer=await s.pc.createOffer();await s.pc.setLocalDescription(offer);await s.send('offer',{type:offer.type,sdp:offer.sdp});s.flush();s.noAnswer=setTimeout(()=>{if(!s.ended&&!s.pc.currentRemoteDescription){s.fail();PD.ui.toast(t('cl.noAnswer'));}},45000);s.poll();}catch(e){if(!s?.ended)PD.ui.toast(e.name==='NotAllowedError'?t('cl.permission'):PD.community.util.err(e));s?.end(true);}finally{starting=false;}}
  async function accept(conv,name,ringId,video=true,callId){if(cur||starting)return;if(!window.RTCPeerConnection||!navigator.mediaDevices?.getUserMedia){PD.ui.toast(t('cl.unavailable'));return;}starting=true;let s;try{if(PD.practice.active)PD.practice.close(true);s=session(conv,name,'callee',ringId-1,video,callId);if(!await s.open())return;s.noAnswer=setTimeout(()=>{if(!s.ended&&s.pc.connectionState!=='connected')s.fail();},45000);s.poll();}catch(e){if(!s?.ended)PD.ui.toast(e.name==='NotAllowedError'?t('cl.permission'):PD.community.util.err(e));s?.end(true);}finally{starting=false;}}
  function dismissRing(){if(!incoming)return;clearTimeout(incoming.timer);incoming.box.remove();incoming=null;}
  async function checkRing(){if(!C.configured||!C.session||document.hidden)return;try{
    if(incoming){const rows=await C.signal.since(incoming.r.conversation_id,incoming.r.id);if(rows.some(r=>['end','busy'].includes(r.kind)&&(!r.payload?.call||r.payload.call===incoming.r.payload?.call)))dismissRing();}
    const q={kind:'eq.ring',sender:'neq.'+C.uid,select:'id,conversation_id,payload,created_at',order:'id.desc',limit:'1'};if(ringMark!=null)q.id='gt.'+ringMark;
    const rows=await C.db.select('call_signals',q),r=rows?.[0];if(ringMark==null){ringMark=r?.id||0;return;}if(!r)return;ringMark=r.id;if(Date.now()-new Date(r.created_at).getTime()>45000)return;
    if(cur||starting||incoming){C.signal.send(r.conversation_id,'busy',{call:r.payload?.call}).catch(()=>{});return;}
    // Also ignore an ended call that arrived between the two polling ticks.
    const signals=await C.signal.since(r.conversation_id,r.id);if(signals.some(s=>s.kind==='end'&&(!s.payload?.call||s.payload.call===r.payload?.call)))return;
    const name=r.payload?.name||'—',video=r.payload?.video!==false;
    const box=h('div',{class:'ring',role:'dialog','aria-label':t('cl.incoming',{n:name})},[h('span',{class:'ring-ic',html:video?ic.video:PD.messenger.icons.phone}),h('b',{text:t('cl.incoming',{n:name})}),h('div',{class:'row'},[
      h('button',{class:'btn primary',text:t('cl.accept'),onclick:()=>{dismissRing();accept(r.conversation_id,name,r.id,video,r.payload?.call);}}),
      h('button',{class:'btn quiet',text:t('cl.decline'),onclick:()=>{dismissRing();C.signal.send(r.conversation_id,'busy',{call:r.payload?.call}).catch(()=>{});}})])]);document.body.append(box);incoming={r,box,timer:setTimeout(dismissRing,40000)};
  }catch(_){} }
  function watch(){clearInterval(ringPoll);dismissRing();ringMark=null;if(!C.session){cur?.end(false);return;}ringPoll=setInterval(checkRing,2500);checkRing();}
  PD.bus.on('cloud',watch);if(C.session)watch();
  return {start,accept,get active(){return !!cur;}};
})();
