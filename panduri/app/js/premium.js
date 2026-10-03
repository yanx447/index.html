/* =====================================================================
   Levels · Premium / VIP · admin
   LEVELS start at 0 and never end: XP comes only from real practice
   (correct notes and strokes heard by the microphone, minutes played,
   steps completed, the daily goal). Each level band has a program.
   PREMIUM is active while the account's vip_until is in the future —
   set by a purchase (payment webhook) or by the admin (VIP).
   Without a server or a payment provider nothing is sold or unlocked
   by pretending: the paywall says what is missing.
   ===================================================================== */
PD.i18n.add({
  'lv.level': ['ლეველი {n}', 'Level {n}'], 'lv.xp': ['{a} / {b} XP', '{a} / {b} XP'], 'lv.toNext': ['{n} XP შემდეგ ლეველამდე', '{n} XP to the next level'],
  'lv.t0': ['დამწყები', 'Beginner'], 'lv.t1': ['მოსწავლე', 'Student'], 'lv.t2': ['მუსიკოსი', 'Musician'], 'lv.t3': ['ოსტატი', 'Master'], 'lv.t4': ['ლეგენდა', 'Legend'],
  'lv.up': ['ახალი ლეველი!', 'Level up!'], 'lv.upD': ['ლეველი {n} · {t}', 'Level {n} · {t}'], 'lv.program': ['ლეველის პროგრამა', 'Level program'], 'lv.programD': ['შენი ლეველისთვის: {p}', 'For your level: {p}'],
  'lv.open': ['პროგრამის გახსნა', 'Open the program'], 'lv.great': ['მშვენიერია', 'Great'], 'lv.how': ['XP მოდის მხოლოდ ნამდვილი დაკვრიდან: სწორი ნოტები და დარტყმები, ვარჯიშის წუთები, დასრულებული ნაბიჯები, დღის მიზანი.', 'XP comes only from real playing: correct notes and strokes, minutes practised, completed steps, the daily goal.'],
  'pm.title': ['პრემიუმი', 'Premium'], 'pm.lead': ['მთელი სასწავლო პროგრამა და VIP შესაძლებლობები.', 'The whole programme and VIP features.'],
  'pm.monthly': ['თვიური', 'Monthly'], 'pm.yearly': ['წლიური', 'Yearly'], 'pm.perMonth': ['თვეში', 'per month'], 'pm.perYear': ['წელიწადში', 'per year'], 'pm.best': ['ყველაზე მომგებიანი', 'Best value'],
  'pm.buy': ['გამოწერა', 'Subscribe'], 'pm.restore': ['შეძენის აღდგენა', 'Restore purchase'], 'pm.active': ['პრემიუმი აქტიურია — {d}-მდე', 'Premium is active — until {d}'], 'pm.vip': ['VIP წევრი', 'VIP member'], 'pm.adminOn': ['ადმინი — ყველაფერი ჩართულია', 'Admin — everything is unlocked'], 'pm.priceSoon': ['ფასი მალე', 'Price soon'], 'pm.forever': ['ვადის გარეშე', 'no end date'],
  'pm.f1': ['ყველა ლეველის პროგრამა (საშუალო და რთული)', 'Every level programme (intermediate and advanced)'], 'pm.f2': ['ტრენაჟორის ყველა დონე: მთელი ტარი, სისწრაფე, სმენა', 'Every trainer level: full neck, speed, ear training'],
  'pm.f3': ['ჭკვიანი ვარჯიში შენი შეცდომებიდან', 'Smart practice from your own mistakes'], 'pm.f4': ['ვიდეო ზარი სხვა მოსწავლეებთან', 'Video calls with other learners'], 'pm.f5': ['ახალი სიმღერები და მასწავლებლის გაკვეთილები, როგორც კი დაემატება', 'New songs and teacher lessons as soon as they are added'], 'pm.f6': ['VIP ნიშანი საზოგადოებაში', 'VIP badge in the community'],
  'pm.noPay': ['გადახდის სისტემა ჯერ არ არის დაკავშირებული (Google Play / App Store / ბარათით). VIP-ს ადმინისტრატორი ანიჭებს.', 'Payments are not connected yet (Google Play / App Store / card). VIP is granted by the administrator.'],
  'pm.needAccount': ['პრემიუმისთვის საჭიროა ანგარიში — ჯერ შედი.', 'Premium needs an account — sign in first.'], 'pm.locked': ['პრემიუმ ფუნქცია', 'Premium feature'],
  'ad.title': ['ადმინისტრირება', 'Administration'], 'ad.lead': ['მომხმარებლები, VIP და როლები. ცვლილებებს სერვერი ამოწმებს — მხოლოდ ადმინს შეუძლია.', 'Users, VIP and roles. The server checks every change — only admins can make them.'],
  'ad.search': ['ძიება: სახელი, ელფოსტა, ტელეფონი', 'Search: name, email, phone'], 'ad.vipMonth': ['VIP +1 თვე', 'VIP +1 month'], 'ad.vipYear': ['VIP +1 წელი', 'VIP +1 year'], 'ad.vipForever': ['VIP სამუდამოდ', 'VIP forever'], 'ad.vipOff': ['VIP-ის მოხსნა', 'Remove VIP'],
  'ad.makeAdmin': ['ადმინად დანიშვნა', 'Make admin'], 'ad.removeAdmin': ['ადმინის მოხსნა', 'Remove admin'], 'ad.none': ['ვერავინ მოიძებნა', 'Nobody found'], 'ad.saved': ['შენახულია', 'Saved'], 'ad.admin': ['ადმინი', 'Admin'], 'ad.joined': ['დარეგისტრირდა {d}', 'Joined {d}']
});

PD.levels = (() => {
  // XP needed to go from level L to L+1 grows gently; there is no last level
  const need = L => 100 + 40 * L;
  const at = L => 100 * L + 20 * L * (L - 1);
  const levelOf = xp => { let L = 0; while (at(L + 1) <= xp) L++; return L; };
  const TIERS = [[0, 't0'], [5, 't1'], [10, 't2'], [20, 't3'], [35, 't4']];
  const tier = L => { let k = 't0'; TIERS.forEach(([a, n]) => { if (L >= a) k = n; }); return 'lv.' + k; };
  /** level program: which part of the learning path fits this level */
  const PROGRAM = [[0, 'foundation'], [3, 'beginner'], [7, 'intermediate'], [13, 'advanced']];
  const programOf = L => { let p = 'foundation'; PROGRAM.forEach(([a, id]) => { if (L >= a) p = id; }); return p; };
  function add(n, why) {
    n = Math.max(0, Math.round(n || 0)); if (!n) return;
    const before = api.level, xp = PD.store.get('xp', 0) + n; PD.store.set('xp', xp);
    PD.bus.emit('xp', { n, why, xp });
    const after = levelOf(xp);
    if (after > before) { PD.bus.emit('levelup', after); celebrate(after); }
  }
  // XP from real practice only
  PD.bus.on('session', s => {
    if (!s || s.input === 'touch') return;   // the developer touch test never earns XP
    const correct = s.correct != null ? s.correct : Math.round((s.firstTry || 0) * (s.notes || 0));
    add(correct + Math.round((s.dur || 0) / 60 * 5), 'practice');
    const day = new Date().toDateString(), goal = PD.store.get('goalMin', 15);
    const mins = PD.lessons.progress.sessions().filter(x => new Date(x.date).toDateString() === day).reduce((a, x) => a + (x.dur || 0), 0) / 60;
    if (mins >= goal && PD.store.get('xp.goalDay', '') !== day) { PD.store.set('xp.goalDay', day); add(25, 'goal'); }
  });
  PD.bus.on('stageDone', () => add(30, 'stage'));
  PD.bus.on('mastered', () => add(100, 'mastered'));
  function celebrate(L) {
    const h = PD.h, back = h('div', { class: 'lvup', role: 'dialog', 'aria-label': t('lv.up') });
    const burst = h('div', { class: 'lvup-burst', 'aria-hidden': 'true' }, Array.from({ length: 18 }, (_, i) => h('i', { style: '--a:' + (i * 20) + 'deg;--d:' + (i % 3) * 60 + 'ms' })));
    const P = LS().PATHS.find(p => p.id === programOf(L));
    back.append(h('div', { class: 'lvup-card' }, [burst, h('div', { class: 'lvup-n', text: String(L) }), h('h2', { 'data-t': 'lv.up' }), h('p', { text: t('lv.upD', { n: L, t: t(tier(L)) }) }),
      P ? h('p', { class: 'muted', text: t('lv.programD', { p: PD.i18n.pick(P.title) }) }) : null,
      h('div', { class: 'row', style: 'justify-content:center' }, [h('button', { class: 'btn primary', 'data-t': 'lv.great', onclick: () => back.remove() }), P ? h('button', { class: 'btn', 'data-t': 'lv.open', onclick: () => { back.remove(); if (!PD.practice.active) PD.app.go('learn', P.id); } }) : null].filter(Boolean))].filter(Boolean)));
    document.body.appendChild(back); PD.i18n.apply(back);
    if (PD.store.get('haptics', true) && navigator.vibrate) try { navigator.vibrate([20, 60, 30]); } catch (_) {}
    setTimeout(() => back.remove(), 9000);
  }
  const LS = () => PD.lessons;
  const api = {
    get xp() { return PD.store.get('xp', 0); },
    get level() { return levelOf(api.xp); },
    get progress() { const L = api.level, a = at(L); return { level: L, into: api.xp - a, need: need(L), pct: (api.xp - a) / need(L) }; },
    get program() { return programOf(api.level); },
    tierName: L => t(tier(L == null ? api.level : L)), need, at, levelOf, programOf, add,
    /** a small level badge: ring + number */
    badge(size) {
      const p = api.progress, r = 15, c = 2 * Math.PI * r, s = size || 44;
      return '<svg viewBox="0 0 40 40" width="' + s + '" height="' + s + '" aria-hidden="true"><circle cx="20" cy="20" r="' + r + '" fill="rgba(0,0,0,.25)" stroke="rgba(255,214,170,.18)" stroke-width="4"/><circle cx="20" cy="20" r="' + r + '" fill="none" stroke="url(#lvg)" stroke-width="4" stroke-linecap="round" stroke-dasharray="' + (c * Math.min(1, p.pct)).toFixed(1) + ' ' + c.toFixed(1) + '" transform="rotate(-90 20 20)"/><defs><linearGradient id="lvg"><stop offset="0" stop-color="#F5C27A"/><stop offset="1" stop-color="#D2843A"/></linearGradient></defs><text x="20" y="25" text-anchor="middle" fill="#FFE6C4" font-size="14" font-weight="700" font-family="Noto Sans Georgian, system-ui">' + p.level + '</text></svg>';
    }
  };
  return api;
})();

PD.premium = (() => {
  const h = PD.h, C = PD.cloud;
  /** what premium unlocks (edit here) */
  const FEATURES = { 'paths.advanced': 'pm.f1', 'trainer.pro': 'pm.f2', 'coach': 'pm.f3', 'call': 'pm.f4', 'songs.more': 'pm.f5' };
  const FREE_SONGS = new Set(['bani-acharuli']);   // the first song stays free
  const until = () => { const p = C.profile; return p && p.vip_until ? new Date(p.vip_until) : null; };
  const api = {
    get active() { const u = until(); return !!(C.isAdmin || (u && u > new Date())); },
    get vip() { const p = C.profile; return !!(api.active && p && p.plan === 'vip'); },
    get until() { return until(); },
    allows(f) { return !FEATURES[f] || api.active; },
    songFree: id => FREE_SONGS.has(id),
    /** run fn if allowed, otherwise show the paywall */
    require(f, fn) { if (api.allows(f)) return fn && fn(); paywall(f); },
    paywall: f => paywall(f),
    admin: () => adminPanel(),
    /** one line for the profile and the paywall */
    status() { const u = until(), on = u && u > new Date(); if (on) return u.getFullYear() > 2090 ? t('pm.title') + ' · ' + t('pm.forever') : t('pm.active', { d: fmtDate(u) }); return C.isAdmin ? t('pm.adminOn') : ''; },
    FEATURES
  };
  const KA_M = ['იანვარი', 'თებერვალი', 'მარტი', 'აპრილი', 'მაისი', 'ივნისი', 'ივლისი', 'აგვისტო', 'სექტემბერი', 'ოქტომბერი', 'ნოემბერი', 'დეკემბერი'];
  function fmtDate(d) { if (!d) return ''; if (d.getFullYear() > 2090) return t('pm.forever'); return PD.i18n.lang === 'ka' ? d.getDate() + ' ' + KA_M[d.getMonth()] + ' ' + d.getFullYear() : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }); }
  function paywall(feature) {
    PD.ui.sheet((box, close) => {
      const cfg = (PD.CONFIG && PD.CONFIG.prices) || {}, pay = PD.CONFIG && PD.CONFIG.payments;
      box.classList.add('pw');
      box.append(h('div', { class: 'pw-crown', html: '<svg viewBox="0 0 24 24" width="30" height="30" aria-hidden="true"><path d="M3 18h18l-1.5-10-4.5 4-3-6-3 6-4.5-4z" fill="#F5C27A" stroke="#24140A" stroke-width=".8" stroke-linejoin="round"/></svg>' }),
        h('h2', { 'data-t': 'pm.title' }), h('p', { class: 'fg2', 'data-t': 'pm.lead' }));
      if (feature && FEATURES[feature]) box.append(h('p', { class: 'pw-why', text: t('pm.locked') + ' · ' + t(FEATURES[feature]) }));
      if (api.active) box.append(h('p', { class: 'pw-active', text: (api.vip ? t('pm.vip') + ' · ' : '') + api.status() }));
      box.append(h('ul', { class: 'pw-list' }, Object.values(FEATURES).concat(['pm.f6']).map(k => h('li', { 'data-t': k }))));
      let plan = 'yearly';
      const opt = (k, price, per, best) => h('button', { class: 'pw-plan', 'aria-pressed': String(plan === k), onclick: e => { plan = k; box.querySelectorAll('.pw-plan').forEach(b => b.setAttribute('aria-pressed', String(b === e.currentTarget))); } }, [
        h('b', { 'data-t': 'pm.' + k }), h('span', { class: 'pw-price' + (price ? '' : ' soon'), text: price || t('pm.priceSoon') }), h('small', { 'data-t': per }), best ? h('em', { 'data-t': 'pm.best' }) : null].filter(Boolean));
      const plans = h('div', { class: 'pw-plans' }, [opt('monthly', cfg.monthly, 'pm.perMonth'), opt('yearly', cfg.yearly, 'pm.perYear', true)]);
      const msg = h('p', { class: 'ag-msg info', hidden: true });
      const buy = h('button', { class: 'btn primary big', 'data-t': 'pm.buy', onclick: () => {
        msg.hidden = false;
        if (!C.configured || !C.session) { msg.textContent = t(C.configured ? 'pm.needAccount' : 'pm.noPay'); if (C.configured) { close(); PD.auth.open(); } return; }
        const link = pay && pay[plan];
        if (!link) { msg.textContent = t('pm.noPay'); return; }
        // hosted checkout (Stripe Payment Link or similar); the account id travels as the reference, the webhook sets vip_until
        const url = link + (link.indexOf('?') < 0 ? '?' : '&') + 'client_reference_id=' + encodeURIComponent(C.uid);
        const P = window.Capacitor && window.Capacitor.Plugins; if (C.native && P && P.Browser) P.Browser.open({ url }); else window.open(url, '_blank', 'noopener');
      } });
      box.append(plans, buy, msg, h('button', { class: 'btn quiet', 'data-t': 'pm.restore', onclick: () => { C.loadProfile().then(() => { close(); PD.app.render(); }).catch(() => { msg.hidden = false; msg.textContent = t('pm.noPay'); }); } }));
    });
  }
  function adminPanel() {
    PD.ui.sheet((box, close) => {
      box.classList.add('adm');
      const q = h('input', { class: 'input', type: 'search', placeholder: t('ad.search'), 'aria-label': t('ad.search') });
      const list = h('div', { class: 'adm-list' }), msg = h('p', { class: 'ag-msg', hidden: true });
      box.append(h('h2', { 'data-t': 'ad.title' }), h('p', { class: 'muted', style: 'font-size:13px', 'data-t': 'ad.lead' }), q, msg, list);
      let tmr = 0; q.oninput = () => { clearTimeout(tmr); tmr = setTimeout(load, 300); };
      const plus = (days) => { const d = new Date(); d.setDate(d.getDate() + days); return d.toISOString(); };
      async function act(fn) { try { await fn(); msg.hidden = false; msg.className = 'ag-msg info'; msg.textContent = t('ad.saved'); load(); } catch (e) { msg.hidden = false; msg.className = 'ag-msg'; msg.textContent = e.message || String(e); } }
      async function load() {
        try {
          const rows = await C.admin.users(q.value.trim()); list.innerHTML = '';
          if (!rows || !rows.length) { list.appendChild(h('p', { class: 'muted', 'data-t': 'ad.none' })); PD.i18n.apply(list); return; }
          rows.forEach(u => {
            const vu = u.vip_until ? new Date(u.vip_until) : null, vip = vu && vu > new Date();
            const fromNow = base => { const b = vip && vu > new Date() ? new Date(vu) : new Date(); b.setDate(b.getDate() + base); return b.toISOString(); };
            list.appendChild(h('div', { class: 'adm-u' }, [
              h('div', { class: 'adm-id' }, [h('b', { text: u.display_name || u.email || u.phone || u.id.slice(0, 8) }), h('small', { text: [u.email, u.phone].filter(Boolean).join(' · ') }),
                h('small', { text: t('lv.level', { n: u.level || 0 }) + ' · ' + t('ad.joined', { d: new Date(u.created_at).toLocaleDateString() }) + (u.role === 'admin' ? ' · ' + t('ad.admin') : '') }),
                vip ? h('span', { class: 'vip-tag', text: 'VIP · ' + fmtDate(vu) }) : null].filter(Boolean)),
              h('div', { class: 'adm-act' }, [
                h('button', { class: 'btn small', 'data-t': 'ad.vipMonth', onclick: () => act(() => C.admin.setVip(u.id, fromNow(31), 'vip')) }),
                h('button', { class: 'btn small', 'data-t': 'ad.vipYear', onclick: () => act(() => C.admin.setVip(u.id, fromNow(365), 'vip')) }),
                h('button', { class: 'btn small', 'data-t': 'ad.vipForever', onclick: () => act(() => C.admin.setVip(u.id, '2099-12-31T00:00:00Z', 'vip')) }),
                vip ? h('button', { class: 'btn small quiet', 'data-t': 'ad.vipOff', onclick: () => act(() => C.admin.setVip(u.id, null, null)) }) : null,
                u.id !== C.uid ? h('button', { class: 'btn small quiet', 'data-t': u.role === 'admin' ? 'ad.removeAdmin' : 'ad.makeAdmin', onclick: () => act(() => C.admin.setRole(u.id, u.role === 'admin' ? 'user' : 'admin')) }) : null].filter(Boolean))]));
          });
          PD.i18n.apply(list);
        } catch (e) { msg.hidden = false; msg.className = 'ag-msg'; msg.textContent = e.message || String(e); }
      }
      PD.i18n.apply(box); load();
    });
  }
  PD.bus.on('cloud', () => { if (PD.app && PD.app.route && !PD.practice.active) { /* keep badges current */ } });
  return api;
})();
