/* =====================================================================
   Community: learners help each other.
   Conversations (1:1 messages) · People · Help board (questions and
   answers) · Video call (WebRTC, premium). Everything is stored on the
   app's server (Supabase) under row-level security: only the two people
   in a conversation can read it. Video and sound of a call go directly
   between the two devices; the server only passes the connection setup.
   ===================================================================== */
PD.i18n.add({
  'cm.title': ['საზოგადოება', 'Community'], 'cm.lead': ['მიწერე სხვა მოსწავლეებს, დასვი კითხვა, დაეხმარე ერთმანეთს.', 'Message other learners, ask questions, help each other.'],
  'cm.chats': ['საუბრები', 'Chats'], 'cm.people': ['ხალხი', 'People'], 'cm.help': ['დახმარება', 'Help'], 'cm.noServer': ['საზოგადოებას სერვერი სჭირდება — როცა სერვერი დაემატება, აქ ერთმანეთს მისწერთ.', 'The community needs the server — once it is added you can message each other here.'],
  'cm.signin': ['მიმოწერისთვის საჭიროა ანგარიში.', 'Messaging needs an account.'], 'cm.noChats': ['საუბრები ჯერ არ გაქვს. დაამატე მეგობარი „მეგობრებში“ და მიწერე.', 'No chats yet. Add a friend under “Friends” and write to them.'],
  'cm.feed': ['ფიდი', 'Feed'], 'cm.friends': ['მეგობრები', 'Friends'], 'cm.attach': ['ფოტო, ვიდეო ან აუდიო', 'Photo, video or audio'], 'cm.react': ['რეაქცია', 'React'],
  'cm.mPhoto': ['📷 ფოტო', '📷 Photo'], 'cm.mVideo': ['🎬 ვიდეო', '🎬 Video'], 'cm.mAudio': ['🎵 აუდიო', '🎵 Audio'], 'cm.mPost': ['🔗 პოსტი', '🔗 A post'],
  'cm.needServer': ['ეს ნაწილი სერვერის განახლების შემდეგ ჩაირთვება.', 'This part switches on once the server has been updated.'], 'cm.textOnly': ['სერვერი ჯერ არ არის განახლებული: ფოტო, სტიკერი და GIF გაგზავნა მისი განახლების შემდეგ შეიძლება.', 'The server has not been updated yet: photos, stickers and GIFs can be sent once it is.'],
  'cm.mSticker': ['🪕 სტიკერი', '🪕 Sticker'], 'cm.mGif': ['GIF', 'GIF'],
  'cm.helpMedia': ['დაურთე ფოტო, ვიდეო ან ჩანაწერი — ასე უფრო ადვილად დაგეხმარებიან.', 'Attach a photo, a video or a recording — it makes helping you easier.'], 'cm.unread': ['{n} ახალი', '{n} new'],
  'cm.search': ['ძიება სახელით', 'Search by name'], 'cm.write': ['მიწერა', 'Message'], 'cm.type': ['დაწერე…', 'Write…'], 'cm.send': ['გაგზავნა', 'Send'], 'cm.nobody': ['ვერავინ მოიძებნა', 'Nobody found'],
  'cm.ask': ['კითხვის დასმა', 'Ask a question'], 'cm.qTitle': ['კითხვა', 'Question'], 'cm.qBody': ['დეტალები (არასავალდებულო)', 'Details (optional)'], 'cm.post': ['გამოქვეყნება', 'Post'], 'cm.answers': ['{n} პასუხი', '{n} answers'],
  'cm.errGen': ['ახლა ვერ მოხერხდა — სცადე ცოტა ხანში თავიდან.', 'That didn’t work just now — try again in a moment.'], 'cm.answer': ['პასუხი', 'Answer'], 'cm.noPosts': ['კითხვები ჯერ არ არის — დასვი პირველი.', 'No questions yet — ask the first one.'], 'cm.delete': ['წაშლა', 'Delete'], 'cm.err': ['ვერ მოხერხდა: {e}', 'Could not complete: {e}'], 'cm.now': ['ახლა', 'now'], 'cm.needName': ['სხვებმა რომ გიპოვონ და იცოდნენ ვინ წერს, ჩაწერე შენი სახელი.', 'So others can find you and know who is writing, add your name.'], 'cm.yourName': ['შენი სახელი', 'Your name'], 'cm.save': ['შენახვა', 'Save'],
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
  const MORE = '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>';
  let tab = PD.store.get('cm.tab', 'chats');
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
  function page(w, param) {
    const own = PD.pageScope();
    const pg = document.getElementById('page'); if (pg) pg.classList.remove('fd-mode');
    w.append(h('div', { class: 'row' }, [h('button', { class: 'btn small backbtn', html: ic.back + '<span class="sr" data-t="back"></span>', onclick: () => PD.app.back('home') }), h('h1', { 'data-t': 'cm.title', style: 'margin:0' })]));
    if (!C.configured) { w.append(h('div', { class: 'cm-empty' }, [h('span', { class: 'cm-big', html: ic.chat }), h('p', { 'data-t': 'cm.noServer' })])); return; }
    if (!C.session) { w.append(h('div', { class: 'cm-empty' }, [h('span', { class: 'cm-big', html: ic.chat }), h('p', { 'data-t': 'cm.signin' }), h('button', { class: 'btn primary', 'data-t': 'pf.signin', onclick: () => PD.auth.open() })])); return; }
    if (!PD.store.get('md.rules.' + C.uid, false)) { w.append(h('div', { class: 'cm-name' }, [h('h2', { 'data-t': 'md.rulesT' }), h('p', { 'data-t': 'md.rules' }), h('button', { class: 'btn primary', 'data-t': 'md.agree', onclick: () => { PD.store.set('md.rules.' + C.uid, true); PD.app.render(); } })])); return; }
    if (param && String(param).indexOf('c:') === 0) { const [, id, ...nm] = String(param).split(':'); return chatView(w, id, nm.join(':'), own); }
    if (param && String(param).indexOf('p:') === 0) { w.innerHTML = ''; if (pg) pg.classList.add('fd-mode'); const box = h('div', { class: 'fd' }); w.append(box); return PD.social.feed(box, own, +String(param).slice(2)); }
    if (param === 'friends') { PD.store.set('cm.tab', 'friends'); history.replaceState && history.replaceState({ r: 'community', p: null }, ''); }
    tab = PD.store.get('cm.tab', tab);
    if (tab === 'people') tab = 'friends';
    if (!['feed', 'chats', 'friends', 'help', 'reports'].includes(tab)) tab = 'feed';
    if (!(C.profile && C.profile.display_name)) {
      const nm = h('input', { class: 'input', autocomplete: 'name', placeholder: t('cm.yourName'), 'aria-label': t('cm.yourName'), value: PD.account.profile.name || '' });
      w.append(h('div', { class: 'cm-name' }, [h('p', { 'data-t': 'cm.needName' }), h('div', { class: 'row' }, [nm, h('button', { class: 'btn primary', 'data-t': 'cm.save', onclick: async () => { const v = nm.value.trim(); if (!v) return nm.focus(); try { await C.db.update('profiles', { id: 'eq.' + C.uid }, { display_name: v }); await C.loadProfile(); PD.app.render(); } catch (e) { PD.ui.toast(err(e)); } } })])]));
    }
    else if (!C.profile.nickname && tab !== 'friends') w.append(PD.social.nickCard(true));
    const unread = PD.store.get('cm.unread', 0);
    const tabs = h('div', { class: 'sx-tabs cm-tabs', role: 'tablist' }, ['feed', 'chats', 'friends', 'help'].concat(C.isAdmin ? ['reports'] : []).map(k => h('button', { role: 'tab', 'aria-pressed': String(tab === k), onclick: () => { tab = k; PD.store.set('cm.tab', k); PD.app.render(); } },
      [h('span', { 'data-t': 'cm.' + k }), k === 'chats' && unread ? h('i', { class: 'cm-dot', 'aria-label': t('cm.unread', { n: unread }), text: unread > 9 ? '9+' : String(unread) }) : null].filter(Boolean))));
    const body = h('div', { class: 'cm-body' + (tab === 'feed' ? ' fd' : '') });
    w.append(tabs, body);
    if (tab === 'feed') { if (pg) pg.classList.add('fd-mode'); PD.social.feed(body, own); }
    else if (tab === 'chats') chats(body); else if (tab === 'friends') PD.social.friends(body); else if (tab === 'reports' && C.isAdmin) reports(body); else help(body);
  }
  async function chats(box) {
    try {
      const [all, hidden] = await Promise.all([C.chat.list(), blockedIds()]), rows = (all || []).filter(r => !hidden.has(r.other));
      box.innerHTML = '';
      if (!rows.length) { box.appendChild(h('p', { class: 'muted', 'data-t': 'cm.noChats' })); PD.i18n.apply(box); return; }
      let total = 0;
      rows.forEach(r => { total += r.unread || 0; const what = r.last_body || (r.last_kind ? t({ photo: 'cm.mPhoto', video: 'cm.mVideo', audio: 'cm.mAudio', post: 'cm.mPost', sticker: 'cm.mSticker', gif: 'cm.mGif' }[r.last_kind] || 'cm.mPost') : '');
        box.appendChild(h('button', { class: 'cm-row' + (r.unread ? ' new' : ''), onclick: () => PD.app.go('community', 'c:' + r.id + ':' + (r.other_name || r.other_nick || '')) }, [
        h('span', { class: 'avatar', html: r.other_avatar ? '<img alt="" src="' + PD.esc(r.other_avatar) + '">' : initial(r.other_name) }),
        h('div', { class: 'grow' }, [h('b', { text: r.other_name || (r.other_nick ? '@' + r.other_nick : '—') }), h('small', { text: (r.last_sender === C.uid ? '↩ ' : '') + what })]),
        h('span', { class: 'cm-when' }, [h('small', { class: 'muted', text: ago(r.last_at) }), r.unread ? h('i', { class: 'cm-dot', text: r.unread > 9 ? '9+' : String(r.unread) }) : null].filter(Boolean))])); });
      PD.store.set('cm.unread', total);
    } catch (e) { box.textContent = err(e); }
  }
  /** a photo / video / recording for a chat message or a help question: choose, prepare, upload (scope 'c' or 'h') */
  async function attachFile(scope, onProgress) {
    const f = await PD.ui.pickFile(PD.social.ACCEPT.any); if (!f) return null;
    const prep = await PD.social.prepare(f, 'any');
    return PD.social.upload(prep, scope, onProgress);
  }
  function help(box) {
    const ask = h('button', { class: 'btn primary', 'data-t': 'cm.ask', onclick: () => PD.ui.sheet((b, close) => {
      const ti = h('input', { class: 'input', maxlength: '200', placeholder: t('cm.qTitle') }), bo = h('textarea', { class: 'input', rows: '5', maxlength: '4000', placeholder: t('cm.qBody'), style: 'min-height:120px;padding:10px 12px' });
      let media = null, busy = false;
      const att = h('div', { class: 'cm-att-row' }), state = h('small', { class: 'muted' });
      const paint = () => { att.innerHTML = ''; att.append(h('button', { class: 'btn small', html: PD.social.IC.photo + '<span data-t="' + (media ? 'fd.change' : 'cm.attach') + '"></span>' + (media ? ' ✓' : ''), onclick: async () => {
        if (busy) return; busy = true;
        try { const m = await attachFile('h', p => { state.textContent = t('fd.uploading', { p: Math.round(p * 100) }); }); if (m) media = m; state.textContent = ''; } catch (e) { state.textContent = PD.social.fileErr(e); }
        busy = false; paint(); } })); PD.i18n.apply(att); };
      paint();
      b.append(h('h2', { 'data-t': 'cm.ask' }), ti, h('div', { class: 'ck-field' }, [bo, PD.chatkit.emojiButton(bo)]), h('small', { class: 'muted', 'data-t': 'cm.helpMedia' }), att, state, h('button', { class: 'btn primary big', 'data-t': 'cm.post', onclick: async () => { if (!ti.value.trim() || busy) return; try { await C.board.post(ti.value.trim(), bo.value.trim(), media); close(); load(); } catch (e) { PD.ui.toast(err(e)); } } }));
    }) });
    const list = h('div', { class: 'cm-list' });
    box.append(ask, list);
    async function load() {
      try {
        const rows = await C.board.list(); list.innerHTML = '';
        if (!rows || !rows.length) { list.appendChild(h('p', { class: 'muted', 'data-t': 'cm.noPosts' })); PD.i18n.apply(list); return; }
        rows.forEach(p => { const n = p.replies && p.replies[0] ? p.replies[0].count : 0;
          list.appendChild(h('button', { class: 'cm-post', onclick: () => post(p, load) }, [h('b', { text: (p.media_kind ? { photo: '📷 ', video: '🎬 ', audio: '🎵 ' }[p.media_kind] : '') + p.title }), p.body ? h('p', { text: p.body.slice(0, 160) }) : null, h('small', { text: (p.author_name || '—') + ' · ' + ago(p.created_at) + ' · ' + t('cm.answers', { n }) })].filter(Boolean))); });
      } catch (e) { list.textContent = err(e); }
    }
    load();
  }
  function post(p, reload) {
    PD.ui.sheet((b, close) => {
      const list = h('div', { class: 'cm-replies' }), inp = h('textarea', { class: 'input', rows: '3', maxlength: '4000', placeholder: t('cm.answer'), style: 'min-height:80px;padding:10px 12px' });
      const media = p.media_path ? h('div', { class: 'cm-qmedia' }) : null;
      if (media) PD.social.urls([p]).then(() => { media.appendChild(PD.social.mediaEl(p)); PD.i18n.apply(media); });
      b.append(h('h2', { text: p.title }), p.body ? h('p', { class: 'fg2', style: 'white-space:pre-line', text: p.body }) : null, media, h('small', { class: 'muted', text: (p.author_name || '—') + ' · ' + ago(p.created_at) }), list, inp,
        h('div', { class: 'row' }, [h('button', { class: 'btn primary', 'data-t': 'cm.answer', onclick: async () => { if (!inp.value.trim()) return; try { await C.board.reply(p.id, inp.value.trim()); inp.value = ''; load(); } catch (e) { PD.ui.toast(err(e)); } } }),
          (p.author === C.uid || C.isAdmin) ? h('button', { class: 'btn quiet', 'data-t': 'cm.delete', onclick: async () => { try { if (p.author === C.uid && p.media_path) await C.storage.remove([p.media_path, p.thumb_path].filter(Boolean)).catch(() => {}); await C.board.remove(p.id); close(); reload(); } catch (e) { PD.ui.toast(err(e)); } } }) : null,
          p.author !== C.uid ? h('button', { class: 'btn quiet', 'data-t': 'md.report', onclick: () => reportSheet('post', p.id) }) : null,
          p.author !== C.uid ? h('button', { class: 'btn quiet', 'data-t': 'md.block', onclick: () => confirmBlock(p.author, p.author_name, () => { close(); reload(); }) }) : null].filter(Boolean)));
      async function load() { try { const rows = await C.board.replies(p.id); list.innerHTML = ''; rows.forEach(r => list.appendChild(h('div', { class: 'cm-reply' }, [h('small', { text: (r.author_name || '—') + ' · ' + ago(r.created_at) }), h('p', { text: r.body }), r.author !== C.uid ? h('button', { class: 'cm-flag', 'aria-label': t('md.report'), html: FLAG, onclick: () => reportSheet('reply', r.id) }) : null].filter(Boolean)))); } catch (e) { list.textContent = err(e); } }
      load();
    });
  }
  function chatView(w, id, name, own) {
    w.innerHTML = '';
    const S = PD.social;
    document.documentElement.classList.add('chat-on'); own(() => document.documentElement.classList.remove('chat-on'));   // Sima's button would sit on the send button
    const msgs = h('div', { class: 'cm-msgs', role: 'log', 'aria-live': 'polite' });
    const inp = h('textarea', { class: 'input cm-in', rows: '1', maxlength: '4000', placeholder: t('cm.type'), 'aria-label': t('cm.type') });
    const up = h('div', { class: 'fd-upbar', hidden: true }, [h('i')]);
    const send = async () => { const v = inp.value.trim(); if (!v) return; inp.value = ''; kit.close(); try { await C.chat.send(id, v); poll(); } catch (e) { PD.ui.toast(err(e)); inp.value = v; } };
    const richOnly = () => { if (C.chat.rich) return true; PD.ui.toast(t('cm.textOnly'), 5000); return false; };
    const sendExtra = async extra => { if (!richOnly()) return; try { await C.chat.send(id, '', extra); poll(); } catch (e) { PD.ui.toast(err(e)); } };
    let sending = false;
    const attach = async accept => {
      if (sending || !richOnly()) return; sending = true;
      try {
        const f = await PD.ui.pickFile(accept); if (!f) return;
        const prep = await S.prepare(f, 'any');
        const m = await S.upload(prep, 'c', p => { up.hidden = false; up.firstChild.style.width = Math.round(p * 100) + '%'; });
        const v = inp.value.trim(); inp.value = ''; await C.chat.send(id, v, m); poll();
      } catch (e) { PD.ui.toast(S.fileErr(e), 5000); }
      finally { sending = false; up.hidden = true; }
    };
    PD.chatkit.gifsAvailable();   // asked once: the GIF choice appears only when the server has it
    const kit = PD.chatkit.panel({ input: inp, onSticker: st => sendExtra({ sticker: st }), onGif: g => sendExtra({ gif: g.url, media_meta: { w: g.w, h: g.h } }) });
    const plus = () => PD.ui.sheet((b, close) => {
      const opt = (icon, key, fn) => h('button', { class: 'ck-opt', html: icon + '<span data-t="' + key + '"></span>', onclick: () => { close(); fn(); } });
      b.append(h('h2', { 'data-t': 'ck.attach' }), h('div', { class: 'ck-opts' }, [
        opt(S.IC.photo, 'ck.media', () => attach('image/*,video/*')),
        opt(S.IC.music, 'ck.audio', () => attach(S.ACCEPT.audio)),
        opt('<span class="rx-pan">' + S.PANDURI + '</span>', 'ck.stickers', () => kit.toggle('stickers')),
        PD.chatkit.gifReady ? opt('<b class="ck-gift">GIF</b>', 'ck.gif', () => kit.toggle('gif')) : null,
        opt('<span class="ck-emoji-ic">😊</span>', 'ck.emoji', () => kit.toggle('emoji'))].filter(Boolean)));
    });
    inp.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } });
    w.append(h('div', { class: 'cm-head' }, [h('button', { class: 'pz-ic', 'aria-label': t('back'), html: ic.back, onclick: () => history.state && history.state.r === 'community' && history.length > 1 ? history.back() : PD.app.go('community', null, true) }), h('b', { class: 'grow', text: name || '—' }),
      h('button', { class: 'pz-ic', 'aria-label': t('cl.video'), html: ic.video, onclick: () => PD.premium.require('call', () => PD.call.start(id, name)) }),
        h('button', { class: 'pz-ic', 'aria-label': t('md.more'), html: MORE, onclick: async () => { try { userActions(await C.chat.other(id), name, () => PD.app.go('community', null, true)); } catch (e) { PD.ui.toast(err(e)); } } })]),
      msgs, up, kit.el, h('div', { class: 'cm-bar' }, [
        h('button', { class: 'pz-ic cm-att', 'aria-label': t('ck.attach'), title: t('ck.attach'), html: ic.plus, onclick: plus }),
        h('button', { class: 'pz-ic cm-att ck-toggle', 'aria-label': t('ck.emoji') + ' · ' + t('ck.stickers'), title: t('ck.emoji') + ' · ' + t('ck.stickers'), text: '😊', onclick: () => kit.toggle() }),
        inp, h('button', { class: 'btn primary icon', 'aria-label': t('cm.send'), html: ic.send, onclick: send })]));
    const nodes = new Map();   // message id → { el, rx, m }
    let rxs = [];              // [{ message_id, user_id, emoji }]
    function paintRx() {
      nodes.forEach(n => {
        const mine = rxs.filter(r => r.message_id === n.m.id), by = {};
        mine.forEach(r => { by[r.emoji] = (by[r.emoji] || 0) + 1; });
        n.rx.innerHTML = Object.keys(by).map(k => S.glyph(k) + (by[k] > 1 ? '<b>' + by[k] + '</b>' : '')).join('');
        n.rx.hidden = !mine.length; n.mine = (mine.find(r => r.user_id === C.uid) || {}).emoji || null;
      });
    }
    async function react(n, k) {
      const before = rxs; rxs = rxs.filter(r => !(r.message_id === n.m.id && r.user_id === C.uid)); if (k) rxs.push({ message_id: n.m.id, user_id: C.uid, emoji: k }); paintRx();
      try { await C.chat.react(n.m.id, k); } catch (e) { rxs = before; paintRx(); PD.ui.toast(err(e)); }
    }
    function bubble(m) {
      const mine = m.sender === C.uid, kids = [];
      if (m.media_path) kids.push(S.mediaEl(m));
      if (m.sticker) kids.push(PD.chatkit.sticker(m.sticker));
      if (m.gif) kids.push(h('span', { class: 'cm-gif' }, [h('img', { class: 'md-img', alt: 'GIF', src: m.gif, loading: 'lazy' }), h('i', { text: 'GIF' })]));
      if (m.post_ref) kids.push(S.postCard(m.post_ref));
      if (m.body) kids.push(h('p', { text: m.body }));
      const rx = h('div', { class: 'cm-rx', hidden: true });
      const el = h('div', { class: 'cm-msg' + (mine ? ' me' : '') + (m.media_path || m.post_ref || m.gif ? ' has-media' : '') + (m.sticker ? ' is-sticker' : ''), 'data-id': m.id }, kids.concat([rx,
        h('small', { text: new Date(m.created_at).toLocaleTimeString(PD.i18n.locale, { hour: '2-digit', minute: '2-digit' }) }),
        h('button', { class: 'cm-flag cm-rxb', 'aria-label': t('cm.react'), html: S.glyph('panduri'), onclick: e => { e.stopPropagation(); S.picker(e.currentTarget, n.mine, k => react(n, k)); } }),
        !mine ? h('button', { class: 'cm-flag', 'aria-label': t('md.report'), html: FLAG, onclick: () => reportSheet('message', m.id) }) : null].filter(Boolean)));
      const n = { el, rx, m, mine: null };
      // hold (or right-click) a message to react; a double tap gives the panduri
      let tm = 0;
      el.addEventListener('pointerdown', e => { if (e.target.closest('button,video,audio,a')) return; clearTimeout(tm); tm = setTimeout(() => S.picker(el, n.mine, k => react(n, k)), 450); });
      ['pointerup', 'pointerleave', 'pointercancel', 'pointermove'].forEach(ev => el.addEventListener(ev, e => { if (ev !== 'pointermove' || Math.abs(e.movementY) > 4) clearTimeout(tm); }));
      el.addEventListener('contextmenu', e => { if (e.target.closest('video,audio')) return; e.preventDefault(); S.picker(el, n.mine, k => react(n, k)); });
      el.addEventListener('dblclick', e => { if (e.target.closest('button,video,audio')) return; react(n, n.mine === 'panduri' ? null : 'panduri'); });
      nodes.set(m.id, n);
      PD.i18n.apply(el);
      return el;
    }
    let last = 0, busy = false, turn = 0, readT = 0;
    const markRead = () => { clearTimeout(readT); readT = setTimeout(() => { if (!document.hidden) { C.chat.read(id).catch(() => {}); PD.notify.readTag && PD.notify.readTag(['c:' + id, 'cr:' + id]); } }, 600); };
    async function poll() {
      if (busy) return; busy = true;
      try {
        const rows = await C.chat.messages(id, last) || [];
        if (rows.some(m => m.media_path)) await S.urls(rows.filter(m => m.media_path));
        const atEnd = msgs.scrollHeight - msgs.scrollTop - msgs.clientHeight < 60;
        rows.forEach(m => { last = Math.max(last, m.id); if (!nodes.has(m.id)) msgs.appendChild(bubble(m)); });
        if (rows.length || turn++ % 3 === 0) { rxs = await C.chat.reactions(id).catch(() => rxs) || rxs; paintRx(); }
        if (rows.length && (atEnd || last === rows[rows.length - 1].id)) { msgs.scrollTop = msgs.scrollHeight; msgs.querySelectorAll('img').forEach(i => { if (!i.complete) i.addEventListener('load', () => { if (msgs.scrollHeight - msgs.scrollTop - msgs.clientHeight < 400) msgs.scrollTop = msgs.scrollHeight; }, { once: true }); }); }
        if (rows.some(m => m.sender !== C.uid)) markRead();
      } catch (_) {} finally { busy = false; }
    }
    poll(); markRead(); const iv = setInterval(() => { if (!document.hidden) poll(); }, 2500); own(() => { clearInterval(iv); clearTimeout(readT); });
  }
  return { page, util: { err, ago, initial, reportSheet, confirmBlock, userActions, blockedSheet } };
})();

/* ---------- 1:1 video call: WebRTC, signalling through the server (offer · answer · ICE) ---------- */
PD.call = (() => {
  const h = PD.h, C = PD.cloud, ic = PD.ic;
  let cur = null, ringPoll = 0, ringMark = null;   // id of the newest ring already seen (server ids, so the device clock does not matter)
  const ICE = () => { const s = [{ urls: 'stun:stun.l.google.com:19302' }]; const tc = PD.CONFIG && PD.CONFIG.turn; if (tc && tc.urls) s.push(tc); return s; };
  function ui(name, state) {
    const root = h('div', { class: 'call', role: 'dialog', 'aria-label': t('cl.video') });
    const remote = h('video', { class: 'call-r', playsinline: '', autoplay: '' }), local = h('video', { class: 'call-l', playsinline: '', autoplay: '', muted: '' });
    const st = h('div', { class: 'call-st' }, [h('b', { text: name || '—' }), h('small', { text: state })]);
    const bMic = h('button', { class: 'call-b', 'aria-label': t('cl.mute'), html: ic.mic }), bCam = h('button', { class: 'call-b', 'aria-label': t('cl.cam'), html: ic.video }), bEnd = h('button', { class: 'call-b end', 'aria-label': t('cl.hang'), html: ic.hangup });
    root.append(remote, local, st, h('div', { class: 'call-bar' }, [bMic, bCam, bEnd]));
    local.muted = true;   // the attribute alone does not mute it: your own voice must never come back through the speaker
    document.body.appendChild(root);
    return { root, remote, local, st, bMic, bCam, bEnd, state: s => { st.lastChild.textContent = s; } };
  }
  async function media() { return navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: { ideal: 640 } }, audio: { echoCancellation: true, noiseSuppression: true } }); }
  function session(conv, name, role, startId) {
    const U = ui(name, t(role === 'caller' ? 'cl.calling' : 'cl.connecting'));
    const pc = new RTCPeerConnection({ iceServers: ICE() });
    const self = { conv, pc, U, last: startId || 0, ended: false, stream: null, ready: false, q: [] };
    cur = self;
    // candidates wait until our offer / answer is on the server, so the other side never gets them first
    const sendIce = c => C.signal.send(conv, 'ice', c).catch(() => {});
    pc.onicecandidate = e => { if (!e.candidate) return; const c = e.candidate.toJSON ? e.candidate.toJSON() : e.candidate; if (self.ready) sendIce(c); else self.q.push(c); };
    self.flush = () => { self.ready = true; self.q.splice(0).forEach(sendIce); };
    pc.ontrack = e => { U.remote.srcObject = e.streams[0]; };
    pc.onconnectionstatechange = () => {
      const cs = pc.connectionState; clearTimeout(self.drop);
      if (cs === 'connected') U.state(t('cl.connected'));
      else if (cs === 'connecting') U.state(t(role === 'caller' && !pc.currentRemoteDescription ? 'cl.calling' : 'cl.connecting'));
      else if (cs === 'disconnected') { U.state(t('cl.unstable')); self.drop = setTimeout(() => { if (pc.connectionState !== 'connected') { U.state(t('cl.failed')); setTimeout(() => end(true), 2000); } }, 10000); }
      else if (cs === 'failed') { U.state(t('cl.failed')); setTimeout(() => end(true), 2500); }
      else if (cs === 'closed') end(false);
    };
    self.lid = PD.layers.push(() => end(true));   // Back hangs up
    const bye = () => end(true); window.addEventListener('pagehide', bye);
    U.bEnd.onclick = () => end(true);
    U.bMic.onclick = () => { const a = self.stream && self.stream.getAudioTracks()[0]; if (a) { a.enabled = !a.enabled; U.bMic.classList.toggle('off', !a.enabled); } };
    U.bCam.onclick = () => { const v = self.stream && self.stream.getVideoTracks()[0]; if (v) { v.enabled = !v.enabled; U.bCam.classList.toggle('off', !v.enabled); } };
    async function poll() {
      if (self.ended) return;
      try {
        const rows = await C.signal.since(conv, self.last);
        for (const r of rows || []) {
          self.last = Math.max(self.last, r.id); if (r.sender === C.uid) continue;
          if (r.kind === 'offer' && role === 'callee') { await pc.setRemoteDescription(r.payload); const ans = await pc.createAnswer(); await pc.setLocalDescription(ans); await C.signal.send(conv, 'answer', { type: ans.type, sdp: ans.sdp }); self.flush(); }
          else if (r.kind === 'answer' && role === 'caller' && !pc.currentRemoteDescription) await pc.setRemoteDescription(r.payload);
          else if (r.kind === 'ice') { try { await pc.addIceCandidate(r.payload); } catch (_) {} }
          else if (r.kind === 'end' || r.kind === 'busy') { U.state(t(r.kind === 'busy' ? 'cl.busy' : 'cl.ended')); setTimeout(() => end(false), 1200); return; }
        }
      } catch (_) {}
      self.timer = setTimeout(poll, 900);
    }
    function end(notify) {
      if (self.ended) return; self.ended = true; clearTimeout(self.timer); clearTimeout(self.noAns); clearTimeout(self.drop); window.removeEventListener('pagehide', bye); PD.layers.done(self.lid);
      if (notify) C.signal.send(conv, 'end', null).catch(() => {});
      try { pc.close(); } catch (_) {}
      if (self.stream) self.stream.getTracks().forEach(tr => tr.stop());
      U.root.classList.add('out'); setTimeout(() => U.root.remove(), 250); cur = null;
    }
    self.end = end; self.poll = poll;
    return self;
  }
  async function start(conv, name) {
    if (cur) return;
    if (PD.practice.active) PD.practice.close(true);
    let s;
    try {
      const sigs = await C.signal.since(conv, 0).catch(() => []);
      s = session(conv, name, 'caller', sigs && sigs.length ? sigs[sigs.length - 1].id : 0);
      s.stream = await media(); s.U.local.srcObject = s.stream; s.stream.getTracks().forEach(tr => s.pc.addTrack(tr, s.stream));
      await C.signal.send(conv, 'ring', { name: PD.account.profile.name || '' });
      const off = await s.pc.createOffer(); await s.pc.setLocalDescription(off);
      await C.signal.send(conv, 'offer', { type: off.type, sdp: off.sdp }); s.flush();
      s.noAns = setTimeout(() => { if (!s.pc.currentRemoteDescription) { s.U.state(t('cl.noAnswer')); setTimeout(() => s.end(true), 1500); } }, 45000);
      s.poll();
    } catch (e) { PD.ui.toast(err(e)); if (s) s.end(true); }
  }
  async function accept(conv, name, ringId) {
    let s;
    try {
      s = session(conv, name, 'callee', ringId - 1);
      s.stream = await media(); s.U.local.srcObject = s.stream; s.stream.getTracks().forEach(tr => s.pc.addTrack(tr, s.stream));
      s.poll();
    } catch (e) { PD.ui.toast(err(e)); if (s) s.end(true); }
  }
  /** incoming calls: a light check while the app is open and signed in */
  async function checkRing() {
    if (!C.configured || !C.session || cur || document.hidden) return;
    try {
      const q = { kind: 'eq.ring', sender: 'neq.' + C.uid, select: 'id,conversation_id,payload,created_at', order: 'id.desc', limit: '1' };
      if (ringMark != null) q.id = 'gt.' + ringMark;
      const rows = await C.db.select('call_signals', q);
      const r = rows && rows[0];
      if (ringMark == null) { ringMark = r ? r.id : 0; return; }   // first look: remember where we are, do not ring for old calls
      if (!r) return;
      ringMark = r.id;
      const name = (r.payload && r.payload.name) || '—';
      const box = h('div', { class: 'ring' }, [h('span', { class: 'ring-ic', html: ic.video }), h('b', { text: t('cl.incoming', { n: name }) }),
        h('div', { class: 'row' }, [h('button', { class: 'btn primary', 'data-t': 'cl.accept', onclick: () => { box.remove(); accept(r.conversation_id, name, r.id); } }),
          h('button', { class: 'btn quiet', 'data-t': 'cl.decline', onclick: () => { box.remove(); C.signal.send(r.conversation_id, 'busy', null).catch(() => {}); } })])]);
      document.body.appendChild(box); PD.i18n.apply(box); setTimeout(() => box.remove(), 40000);
    } catch (_) {}
  }
  function watch() { clearInterval(ringPoll); ringMark = null; ringPoll = setInterval(checkRing, 5000); checkRing(); }
  PD.bus.on('cloud', watch);
  if (C.session) watch();
  return { start, accept, get active() { return !!cur; } };
})();
