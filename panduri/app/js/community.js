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
  'cm.signin': ['მიმოწერისთვის საჭიროა ანგარიში.', 'Messaging needs an account.'], 'cm.noChats': ['საუბრები ჯერ არ გაქვს. იპოვე ვინმე „ხალხში“.', 'No chats yet. Find someone under “People”.'],
  'cm.search': ['ძიება სახელით', 'Search by name'], 'cm.write': ['მიწერა', 'Message'], 'cm.type': ['დაწერე…', 'Write…'], 'cm.send': ['გაგზავნა', 'Send'], 'cm.nobody': ['ვერავინ მოიძებნა', 'Nobody found'],
  'cm.ask': ['კითხვის დასმა', 'Ask a question'], 'cm.qTitle': ['კითხვა', 'Question'], 'cm.qBody': ['დეტალები (არასავალდებულო)', 'Details (optional)'], 'cm.post': ['გამოქვეყნება', 'Post'], 'cm.answers': ['{n} პასუხი', '{n} answers'],
  'cm.answer': ['პასუხი', 'Answer'], 'cm.noPosts': ['კითხვები ჯერ არ არის — დასვი პირველი.', 'No questions yet — ask the first one.'], 'cm.delete': ['წაშლა', 'Delete'], 'cm.err': ['ვერ მოხერხდა: {e}', 'Could not complete: {e}'], 'cm.now': ['ახლა', 'now'], 'cm.needName': ['სხვებმა რომ გიპოვონ და იცოდნენ ვინ წერს, ჩაწერე შენი სახელი.', 'So others can find you and know who is writing, add your name.'], 'cm.yourName': ['შენი სახელი', 'Your name'], 'cm.save': ['შენახვა', 'Save'],
  'cl.video': ['ვიდეო ზარი', 'Video call'], 'cl.calling': ['ირეკება…', 'Calling…'], 'cl.incoming': ['{n} გირეკავს', '{n} is calling'], 'cl.accept': ['პასუხი', 'Answer'], 'cl.decline': ['უარყოფა', 'Decline'],
  'cl.ended': ['ზარი დასრულდა', 'Call ended'], 'cl.busy': ['ხაზი დაკავებულია', 'The line is busy'], 'cl.noAnswer': ['არ უპასუხა', 'No answer'], 'cl.mute': ['მიკროფონი', 'Microphone'], 'cl.cam': ['კამერა', 'Camera'], 'cl.hang': ['დასრულება', 'Hang up'],
  'cl.failed': ['დაკავშირება ვერ მოხერხდა — ზოგ ქსელში საჭიროა TURN სერვერი (პარამეტრებში).', 'Could not connect — some networks need a TURN server (in settings).'], 'cl.connected': ['დაკავშირებულია', 'Connected'], 'cl.connecting': ['უკავშირდება…', 'Connecting…'], 'cl.unstable': ['კავშირი შეწყდა — ვცდილობთ აღდგენას…', 'Connection lost — trying to reconnect…']
});

PD.community = (() => {
  const h = PD.h, C = PD.cloud, ic = PD.ic;
  let tab = PD.store.get('cm.tab', 'chats');
  const ago = iso => { const d = (Date.now() - new Date(iso).getTime()) / 60000; return d < 1 ? t('cm.now') : d < 60 ? Math.round(d) + "'" : d < 1440 ? Math.round(d / 60) + 'h' : new Date(iso).toLocaleDateString(); };
  const initial = n => PD.esc(((n || '?').trim()[0] || '?').toUpperCase());
  const err = e => t('cm.err', { e: (e && e.message) || e });
  function page(w, param) {
    const own = PD.pageScope();
    w.append(h('div', { class: 'row' }, [h('button', { class: 'btn small', html: ic.back + '<span data-t="back"></span>', onclick: () => history.length > 1 ? history.back() : PD.app.go('home') }), h('h1', { 'data-t': 'cm.title', style: 'margin:0' })]));
    if (!C.configured) { w.append(h('div', { class: 'cm-empty' }, [h('span', { class: 'cm-big', html: ic.chat }), h('p', { 'data-t': 'cm.noServer' })])); return; }
    if (!C.session) { w.append(h('div', { class: 'cm-empty' }, [h('span', { class: 'cm-big', html: ic.chat }), h('p', { 'data-t': 'cm.signin' }), h('button', { class: 'btn primary', 'data-t': 'pf.signin', onclick: () => PD.auth.open() })])); return; }
    if (param && String(param).indexOf('c:') === 0) { const [, id, ...nm] = String(param).split(':'); return chatView(w, id, nm.join(':'), own); }
    tab = PD.store.get('cm.tab', tab);
    if (!(C.profile && C.profile.display_name)) {
      const nm = h('input', { class: 'input', autocomplete: 'name', placeholder: t('cm.yourName'), 'aria-label': t('cm.yourName'), value: PD.account.profile.name || '' });
      w.append(h('div', { class: 'cm-name' }, [h('p', { 'data-t': 'cm.needName' }), h('div', { class: 'row' }, [nm, h('button', { class: 'btn primary', 'data-t': 'cm.save', onclick: async () => { const v = nm.value.trim(); if (!v) return nm.focus(); try { await C.db.update('profiles', { id: 'eq.' + C.uid }, { display_name: v }); await C.loadProfile(); PD.app.render(); } catch (e) { PD.ui.toast(err(e)); } } })])]));
    }
    const tabs = h('div', { class: 'sx-tabs', role: 'tablist' }, ['chats', 'people', 'help'].map(k => h('button', { role: 'tab', 'aria-pressed': String(tab === k), 'data-t': 'cm.' + k, onclick: () => { tab = k; PD.store.set('cm.tab', k); PD.app.render(); } })));
    const body = h('div', { class: 'cm-body' });
    w.append(tabs, body);
    if (tab === 'chats') chats(body); else if (tab === 'people') people(body); else help(body);
  }
  async function chats(box) {
    try {
      const rows = await C.chat.list();
      box.innerHTML = '';
      if (!rows || !rows.length) { box.appendChild(h('p', { class: 'muted', 'data-t': 'cm.noChats' })); PD.i18n.apply(box); return; }
      rows.forEach(r => box.appendChild(h('button', { class: 'cm-row', onclick: () => PD.app.go('community', 'c:' + r.id + ':' + (r.other_name || '')) }, [
        h('span', { class: 'avatar', html: r.other_avatar ? '<img alt="" src="' + PD.esc(r.other_avatar) + '">' : initial(r.other_name) }),
        h('div', { class: 'grow' }, [h('b', { text: r.other_name || '—' }), h('small', { text: r.last_body || '' })]), h('small', { class: 'muted', text: ago(r.last_at) })])));
    } catch (e) { box.textContent = err(e); }
  }
  function people(box) {
    const q = h('input', { class: 'input', type: 'search', placeholder: t('cm.search'), 'aria-label': t('cm.search') });
    const list = h('div', { class: 'cm-list' });
    box.append(q, list);
    let tm = 0; q.oninput = () => { clearTimeout(tm); tm = setTimeout(load, 300); };
    async function load() {
      try {
        const rows = await C.people(q.value.trim()); list.innerHTML = '';
        if (!rows || !rows.length) { list.appendChild(h('p', { class: 'muted', 'data-t': 'cm.nobody' })); PD.i18n.apply(list); return; }
        rows.forEach(p => list.appendChild(h('div', { class: 'cm-row' }, [
          h('span', { class: 'avatar', html: p.avatar_url ? '<img alt="" src="' + PD.esc(p.avatar_url) + '">' : initial(p.display_name) }),
          h('div', { class: 'grow' }, [h('b', {}, [p.display_name, p.vip ? h('span', { class: 'vip-tag', text: 'VIP' }) : null]), h('small', { text: t('lv.level', { n: p.level || 0 }) })]),
          h('button', { class: 'btn small', 'data-t': 'cm.write', onclick: async () => { try { const id = await C.chat.open(p.id); PD.app.go('community', 'c:' + id + ':' + p.display_name); } catch (e) { PD.ui.toast(err(e)); } } })])));
        PD.i18n.apply(list);
      } catch (e) { list.textContent = err(e); }
    }
    load();
  }
  function help(box) {
    const ask = h('button', { class: 'btn primary', 'data-t': 'cm.ask', onclick: () => PD.ui.sheet((b, close) => {
      const ti = h('input', { class: 'input', maxlength: '200', placeholder: t('cm.qTitle') }), bo = h('textarea', { class: 'input', rows: '5', maxlength: '4000', placeholder: t('cm.qBody'), style: 'min-height:120px;padding:10px 12px' });
      b.append(h('h2', { 'data-t': 'cm.ask' }), ti, bo, h('button', { class: 'btn primary big', 'data-t': 'cm.post', onclick: async () => { if (!ti.value.trim()) return; try { await C.board.post(ti.value.trim(), bo.value.trim()); close(); load(); } catch (e) { PD.ui.toast(err(e)); } } }));
    }) });
    const list = h('div', { class: 'cm-list' });
    box.append(ask, list);
    async function load() {
      try {
        const rows = await C.board.list(); list.innerHTML = '';
        if (!rows || !rows.length) { list.appendChild(h('p', { class: 'muted', 'data-t': 'cm.noPosts' })); PD.i18n.apply(list); return; }
        rows.forEach(p => { const n = p.replies && p.replies[0] ? p.replies[0].count : 0;
          list.appendChild(h('button', { class: 'cm-post', onclick: () => post(p, load) }, [h('b', { text: p.title }), p.body ? h('p', { text: p.body.slice(0, 160) }) : null, h('small', { text: (p.author_name || '—') + ' · ' + ago(p.created_at) + ' · ' + t('cm.answers', { n }) })].filter(Boolean))); });
      } catch (e) { list.textContent = err(e); }
    }
    load();
  }
  function post(p, reload) {
    PD.ui.sheet((b, close) => {
      const list = h('div', { class: 'cm-replies' }), inp = h('textarea', { class: 'input', rows: '3', maxlength: '4000', placeholder: t('cm.answer'), style: 'min-height:80px;padding:10px 12px' });
      b.append(h('h2', { text: p.title }), p.body ? h('p', { class: 'fg2', style: 'white-space:pre-line', text: p.body }) : null, h('small', { class: 'muted', text: (p.author_name || '—') + ' · ' + ago(p.created_at) }), list, inp,
        h('div', { class: 'row' }, [h('button', { class: 'btn primary', 'data-t': 'cm.answer', onclick: async () => { if (!inp.value.trim()) return; try { await C.board.reply(p.id, inp.value.trim()); inp.value = ''; load(); } catch (e) { PD.ui.toast(err(e)); } } }),
          (p.author === C.uid || C.isAdmin) ? h('button', { class: 'btn quiet', 'data-t': 'cm.delete', onclick: async () => { try { await C.board.remove(p.id); close(); reload(); } catch (e) { PD.ui.toast(err(e)); } } }) : null].filter(Boolean)));
      async function load() { try { const rows = await C.board.replies(p.id); list.innerHTML = ''; rows.forEach(r => list.appendChild(h('div', { class: 'cm-reply' }, [h('small', { text: (r.author_name || '—') + ' · ' + ago(r.created_at) }), h('p', { text: r.body })]))); } catch (e) { list.textContent = err(e); } }
      load();
    });
  }
  function chatView(w, id, name, own) {
    w.innerHTML = '';
    const msgs = h('div', { class: 'cm-msgs', role: 'log', 'aria-live': 'polite' });
    const inp = h('textarea', { class: 'input cm-in', rows: '1', maxlength: '4000', placeholder: t('cm.type'), 'aria-label': t('cm.type') });
    const send = async () => { const v = inp.value.trim(); if (!v) return; inp.value = ''; try { await C.chat.send(id, v); poll(); } catch (e) { PD.ui.toast(err(e)); inp.value = v; } };
    inp.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } });
    w.append(h('div', { class: 'cm-head' }, [h('button', { class: 'pz-ic', 'aria-label': t('back'), html: ic.back, onclick: () => history.state && history.state.r === 'community' && history.length > 1 ? history.back() : PD.app.go('community', null, true) }), h('b', { class: 'grow', text: name || '—' }),
      h('button', { class: 'pz-ic', 'aria-label': t('cl.video'), html: ic.video, onclick: () => PD.premium.require('call', () => PD.call.start(id, name)) })]),
      msgs, h('div', { class: 'cm-bar' }, [inp, h('button', { class: 'btn primary icon', 'aria-label': t('cm.send'), html: ic.send, onclick: send })]));
    let last = 0, busy = false;
    async function poll() {
      if (busy) return; busy = true;
      try {
        const rows = await C.chat.messages(id, last);
        const atEnd = msgs.scrollHeight - msgs.scrollTop - msgs.clientHeight < 60;
        (rows || []).forEach(m => { last = Math.max(last, m.id); msgs.appendChild(h('div', { class: 'cm-msg' + (m.sender === C.uid ? ' me' : '') }, [h('p', { text: m.body }), h('small', { text: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) })])); });
        if (rows && rows.length && (atEnd || last === rows[rows.length - 1].id)) msgs.scrollTop = msgs.scrollHeight;
      } catch (_) {} finally { busy = false; }
    }
    poll(); const iv = setInterval(() => { if (!document.hidden) poll(); }, 2500); own(() => clearInterval(iv));
  }
  return { page };
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
    } catch (e) { PD.ui.toast(t('cm.err', { e: e.message || e })); if (s) s.end(true); }
  }
  async function accept(conv, name, ringId) {
    let s;
    try {
      s = session(conv, name, 'callee', ringId - 1);
      s.stream = await media(); s.U.local.srcObject = s.stream; s.stream.getTracks().forEach(tr => s.pc.addTrack(tr, s.stream));
      s.poll();
    } catch (e) { PD.ui.toast(t('cm.err', { e: e.message || e })); if (s) s.end(true); }
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
