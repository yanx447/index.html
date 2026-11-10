/* =====================================================================
   Sign-in, first thing on first launch: Google · Facebook · phone number
   · e-mail and password (plus create account, forgotten password,
   e-mail confirmation). Everything goes through PD.cloud (Supabase).
   With no server configured nothing pretends to succeed: the screen says
   so, and "continue without an account" keeps progress on this device.
   ===================================================================== */
PD.i18n.add({
  'au.tagline': ['ისწავლე · დაუკარი · იმღერე', 'Learn · play · sing'], 'sp.title': ['ᲤᲐᲜᲓᲣᲠᲘ', 'PANDURI'], 'au.start': ['დაწყება', 'Get started'], 'au.signinLink': ['უკვე გაქვს ანგარიში? შესვლა', 'Have an account? Sign in'], 'au.signinTitle': ['შესვლა ან რეგისტრაცია', 'Sign in or register'], 'au.methodsD': ['პირველად შესვლისას ანგარიში ავტომატურად შეიქმნება.', 'Signing in the first time creates your account.'],
  'au.delete': ['ანგარიშის წაშლა', 'Delete account'], 'au.deleteD': ['სერვერიდან სამუდამოდ წაიშლება ანგარიში, მიმოწერა, კითხვები და პროგრესის ასლი. ამ მოწყობილობაზე პროგრესი დარჩება.', 'Permanently removes the account, messages, questions and the progress backup from the server. Progress on this device stays.'],
  'au.deleteGo': ['წაშლა', 'Delete'], 'au.deleteQ': ['ნამდვილად წავშალო ანგარიში? ამის დაბრუნება შეუძლებელია.', 'Really delete the account? This cannot be undone.'], 'au.deleted': ['ანგარიში წაიშალა.', 'The account was deleted.'],
  'au.signin': ['შესვლა', 'Sign in'], 'au.signup': ['ანგარიშის შექმნა', 'Create account'], 'au.email': ['ელფოსტა', 'Email'], 'au.password': ['პაროლი', 'Password'], 'au.name': ['სახელი', 'Name'],
  'au.forgot': ['დაგავიწყდა პაროლი?', 'Forgot password?'], 'au.reset': ['პაროლის აღდგენა', 'Reset password'], 'au.resetD': ['ელფოსტაზე გამოგიგზავნით ბმულს ახალი პაროლისთვის.', 'We will email you a link to set a new password.'], 'au.send': ['გაგზავნა', 'Send'],
  'au.sent': ['გაიგზავნა — შეამოწმე ელფოსტა.', 'Sent — check your email.'],
  'au.or': ['ან', 'or'], 'au.apple': ['Apple-ით შესვლა', 'Sign in with Apple'], 'au.google': ['Google-ით გაგრძელება', 'Continue with Google'], 'au.facebook': ['Facebook-ით გაგრძელება', 'Continue with Facebook'], 'au.phone': ['ტელეფონის ნომრით', 'With phone number'], 'au.withEmail': ['ელფოსტით და პაროლით', 'With email and password'],
  'au.guestD': ['პროგრესი მხოლოდ ამ მოწყობილობაზე შეინახება. ანგარიშს მოგვიანებით შექმნი პროფილიდან.', 'Progress stays on this device only. You can create an account later from Profile.'],
  'au.verify': ['გამოგიგზავნეთ წერილი — დაადასტურე ელფოსტა და შემდეგ შედი.', 'We sent you an email — confirm your address, then sign in.'], 'au.resend': ['ხელახლა გაგზავნა', 'Resend'],
  'au.noBackend': ['სერვერი ჯერ არ არის დაკავშირებული — შესვლა და ანგარიშის შექმნა ჩაირთვება, როგორც კი სერვერი დაემატება. მანამდე შეგიძლია ანგარიშის გარეშე ისწავლო.', 'The server is not connected yet — sign-in and accounts switch on as soon as it is added. Until then you can learn without an account.'],
  'au.badEmail': ['შეამოწმე ელფოსტა', 'Check the email address'], 'au.shortPw': ['პაროლი — მინიმუმ 8 სიმბოლო', 'Password: at least 8 characters'], 'au.err': ['ვერ მოხერხდა: {e}', 'Could not complete: {e}'],
  'au.badLogin': ['ელფოსტა ან პაროლი არასწორია', 'Wrong email or password'], 'au.exists': ['ასეთი ანგარიში უკვე არსებობს — შედი', 'This account already exists — sign in'], 'au.offline': ['ინტერნეტი არ არის', 'No internet connection'],
  'au.phoneNo': ['ტელეფონის ნომერი', 'Phone number'], 'au.sendCode': ['კოდის გაგზავნა', 'Send code'], 'au.code': ['SMS კოდი', 'SMS code'], 'au.codeSent': ['კოდი გაიგზავნა {p}-ზე', 'Code sent to {p}'], 'au.verifyCode': ['დადასტურება', 'Confirm'], 'au.badPhone': ['შეამოწმე ნომერი', 'Check the number'],
  'au.signedIn': ['შესული ხარ: {e}', 'Signed in as {e}'], 'au.signout': ['გასვლა', 'Sign out'], 'au.sync': ['სინქრონიზაცია', 'Sync'], 'au.syncOff': ['მიუწვდომელია — სერვერი არ არის დაკავშირებული', 'Unavailable — no server connected'],
  'au.syncOn': ['პროგრესი ანგარიშში ინახება', 'Progress is saved to your account'], 'au.subscription': ['გამოწერა', 'Subscription'], 'au.subOff': ['ამ ვერსიაში გადახდები არ არის', 'No payments in this build'],
  'au.welcome': ['ისწავლე ფანდური ნამდვილ ინსტრუმენტზე', 'Learn the panduri on a real instrument'], 'au.welcomeD': ['აპი გიჩვენებს, გისმენს და გელოდება.', 'The app shows you, listens and waits for you.'],
  'au.terms': ['შესვლით ეთანხმები, რომ შენი სახელი, ფოტო და დონე სხვა მოსწავლეებს გამოუჩნდეთ. გაკვეთილის მიკროფონი და კამერა მხოლოდ შენს მოწყობილობაზე მუშავდება; ვიდეო ზარში კი ხმა და ვიდეო პირდაპირ მეორე მონაწილეს მიდის.', 'By signing in you agree that your name, photo and level are visible to other learners. The microphone and camera in a lesson are processed on your device only; in a video call your sound and video go straight to the other person.'],
  'au.newPw': ['ახალი პაროლი', 'New password'], 'au.newPwD': ['ბმულით შემოხვედი — დააყენე ახალი პაროლი შენი ანგარიშისთვის.', 'You came from the reset link — set a new password for your account.'], 'au.pwSave': ['შენახვა', 'Save'], 'au.pwSaved': ['პაროლი შეიცვალა', 'Password changed'],
  'au.back': ['უკან', 'Back'], 'au.show': ['ჩვენება', 'Show'], 'au.hide': ['დამალვა', 'Hide'],
  'au.arrive': ['შენი პროგრესი იტვირთება…', 'Loading your progress…']
});

PD.auth = (() => {
  const h = PD.h, C = PD.cloud;
  const okEmail = e => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  const ICON = {
    apple: '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.57-.12 0-.23-.02-.3-.03-.01-.06-.04-.22-.04-.39 0-1.15.572-2.27 1.206-2.98.804-.94 2.142-1.64 3.248-1.68.03.13.05.28.05.43zm4.565 15.71c-.03.07-.463 1.58-1.518 3.12-.945 1.34-1.94 2.71-3.43 2.71-1.517 0-1.9-.88-3.63-.88-1.698 0-2.302.91-3.67.91-1.377 0-2.332-1.26-3.428-2.8-1.287-1.82-2.323-4.63-2.323-7.28 0-4.28 2.797-6.55 5.552-6.55 1.448 0 2.675.95 3.6.95.865 0 2.222-1.01 3.902-1.01.613 0 2.886.06 4.374 2.19-.13.09-2.383 1.37-2.383 4.19 0 3.26 2.854 4.42 2.955 4.45z"/></svg>',
    google: '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5a5.5 5.5 0 0 1-2.4 3.6v3h3.9c2.2-2.1 3.5-5.2 3.5-8.8z"/><path fill="#34A853" d="M12 24c3.2 0 6-1.1 7.9-2.9l-3.9-3c-1.1.7-2.4 1.2-4 1.2-3.1 0-5.7-2.1-6.7-4.9H1.3v3.1A12 12 0 0 0 12 24z"/><path fill="#FBBC05" d="M5.3 14.4a7.2 7.2 0 0 1 0-4.7V6.6H1.3a12 12 0 0 0 0 10.9l4-3.1z"/><path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4A12 12 0 0 0 1.3 6.6l4 3.1C6.3 6.9 8.9 4.8 12 4.8z"/></svg>',
    facebook: '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><circle cx="12" cy="12" r="12" fill="#1877F2"/><path fill="#fff" d="M15.6 15.5l.5-3.5h-3.3V9.8c0-1 .5-1.9 2-1.9h1.5v-3s-1.4-.2-2.7-.2c-2.8 0-4.6 1.7-4.6 4.7V12H6v3.5h3v8.4a12 12 0 0 0 3.8 0v-8.4h2.8z"/></svg>',
    phone: '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="6" y="2.5" width="12" height="19" rx="2.5"/><path d="M10.5 18.5h3"/></svg>',
    mail: '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M3.5 6.5l8.5 6.5 8.5-6.5"/></svg>'
  };
  const LOGO = '<svg viewBox="0 0 120 200" aria-hidden="true"><defs><linearGradient id="agb" x1="0" x2="1"><stop offset="0" stop-color="#E7C98F"/><stop offset=".5" stop-color="#F3DFB2"/><stop offset="1" stop-color="#D9B57A"/></linearGradient><linearGradient id="agn" x1="0" x2="1"><stop offset="0" stop-color="#5A2311"/><stop offset=".5" stop-color="#7A3218"/><stop offset="1" stop-color="#4E1E0E"/></linearGradient></defs><rect x="54" y="6" width="12" height="22" rx="3" fill="#C9A36A"/><rect x="55.5" y="26" width="9" height="76" fill="url(#agn)"/><path d="M60 100c-14 0-24 6-27 16-3 12 2 30 8 46 3 8 8 14 19 14s16-6 19-14c6-16 11-34 8-46-3-10-13-16-27-16z" fill="url(#agb)"/><circle cx="60" cy="126" r="10" fill="#1A0E07"/><g fill="#2A170C">' + Array.from({ length: 18 }, (_, i) => { const a = i / 18 * Math.PI * 2; return '<circle cx="' + (60 + Math.cos(a) * 15).toFixed(1) + '" cy="' + (126 + Math.sin(a) * 15).toFixed(1) + '" r="1.4"/>'; }).join('') + '</g><path d="M57.5 30v140M60 30v140M62.5 30v140" stroke="#F4EBDA" stroke-width=".7" opacity=".8"/><rect x="50" y="150" width="20" height="2.5" rx="1" fill="#F4EBDA" opacity=".8"/></svg>';

  function message(e) {
    const c = e && (e.code || e.message) || '';
    if (c === 'no-backend') return t('au.noBackend');
    if (c === 'offline') return t('au.offline');
    if (/invalid_credentials|invalid_grant|Invalid login/i.test(c + ' ' + (e && e.message))) return t('au.badLogin');
    if (/user_already_exists|already registered/i.test(c + ' ' + (e && e.message))) return t('au.exists');
    return t('au.err', { e: (e && e.message) || c || '?' });
  }

  /** the sign-in screen; onDone(true) after a real sign-in, onDone(false) when the learner continues without an account */
  function gate(onDone, opts) {
    opts = opts || {};
    document.querySelectorAll('.ag').forEach(x => x.remove());
    const root = h('div', { class: 'ag', role: 'dialog', 'aria-modal': 'true', 'aria-label': t('au.signin') });
    const card = h('div', { class: 'ag-card' });
    root.append(h('div', { class: 'ag-glow', 'aria-hidden': 'true' }), card);
    document.body.appendChild(root);
    let view = opts.view || 'home', email = '', phone = PD.store.get('auth.phone', '+995 '), busy = false, done = false;
    const off = C.on(() => { if (C.session) finish(true); });
    const lid = opts.closable ? PD.layers.push(() => finish(false)) : 0;   // opened from the app: Back closes it
    function finish(ok) { if (done) return; done = true; off(); if (lid) PD.layers.done(lid); root.classList.add('out'); setTimeout(() => root.remove(), 260); onDone && onDone(ok); }
    const msgEl = () => h('p', { class: 'ag-msg', role: 'alert', hidden: true });
    async function run(btn, msg, fn) {
      if (busy) return; busy = true; msg.hidden = true; if (btn) btn.classList.add('busy');
      try { if (!C.configured) throw Object.assign(new Error('no-backend'), { code: 'no-backend' }); await fn(); }
      catch (e) { msg.hidden = false; msg.textContent = message(e); msg.className = 'ag-msg' + (e && e.code === 'no-backend' ? ' info' : ''); }
      finally { busy = false; if (btn) btn.classList.remove('busy'); }
    }
    // Back: sign-in form → the list of ways in → the welcome screen (or closes, when opened from inside the app)
    const back = () => h('button', { class: 'ag-back', html: PD.ic.back + '<span data-t="au.back"></span>', onclick: () => { if (view === 'methods') { if (opts.closable) return finish(false); view = 'home'; } else view = 'methods'; render(); } });
    function render() {
      card.innerHTML = ''; card.classList.remove('home');
      if (view === 'home') {
        const ph = PD.assets && PD.assets.photos;
        card.classList.add('splash'); root.classList.add('ag-splash');
        if (ph) {
          root.style.setProperty('--ag-photo', 'url("' + (ph.splashP || ph.body || '') + '")');
          root.style.setProperty('--ag-photo-wide', 'url("' + (ph.splashL || ph.splashP || ph.body || '') + '")');
        }
        const enter = () => { view = 'methods'; render(); };
        card.append(
          PD.ui.langSelect(v => PD.i18n.set(v).then(render), 'ag-lang'),
          h('div', { class: 'sp-brand' }, [h('h1', { class: 'sp-name', 'data-t': 'sp.title' }), h('p', { class: 'sp-tag', 'data-t': 'au.tagline' })]),
          h('div', { class: 'sp-go' }, [
            h('button', { class: 'sp-start', html: '<span data-t="au.start"></span><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>', onclick: enter }),
            h('button', { class: 'sp-signin', 'data-t': 'au.signinLink', onclick: enter })])
        );
        if (opts.closable) card.prepend(h('button', { class: 'ag-x', 'aria-label': t('close'), html: PD.ic.close, onclick: () => finish(false) }));
        PD.i18n.apply(card); return;
      }
      root.classList.remove('ag-splash'); card.classList.remove('splash');
      if (view === 'methods') {
        const msg = msgEl();
        const prov = (k, ic, label, fn) => { const b = h('button', { class: 'ag-btn ' + k, html: '<span class="ag-ic">' + ic + '</span><span data-t="' + label + '"></span>', onclick: () => fn(b) }); return b; };
        card.classList.add('home');
        card.append(h('div', { class: 'ag-brand' }, [h('h2', { 'data-t': 'au.signinTitle' }), h('p', { class: 'ag-sub', 'data-t': 'au.methodsD' })]),
          h('div', { class: 'ag-side' }, [C.configured ? null : h('p', { class: 'ag-msg info', 'data-t': 'au.noBackend' }),
          h('div', { class: 'ag-list' }, [
            Object.assign(prov('apple', ICON.apple, 'au.apple', b => run(b, msg, () => C.auth.oauth('apple'))), { hidden: true }),   // shown only once the server has the Apple provider switched on
            prov('google', ICON.google, 'au.google', b => run(b, msg, () => C.auth.oauth('google'))),
            prov('facebook', ICON.facebook, 'au.facebook', b => run(b, msg, () => C.auth.oauth('facebook'))),
            prov('phone', ICON.phone, 'au.phone', () => { view = 'phone'; render(); }),
            prov('mail', ICON.mail, 'au.withEmail', () => { view = 'signin'; render(); })]),
          msg,
          h('small', { class: 'ag-fine', 'data-t': 'au.terms' })].filter(Boolean)));
        // show only the sign-in methods that are switched on in the server
        // Google / Facebook need a real top-level page to come back to: not inside another site's frame, not from a local file
        const noOAuth = window.top !== window || location.protocol === 'file:';
        const showOnly = v => { if (!v) return; ['apple', 'google', 'facebook', 'phone'].forEach(k => { const b = card.querySelector('.ag-btn.' + k); if (b) b.hidden = !v[k] || (noOAuth && k !== 'phone'); }); };
        if (noOAuth) showOnly({ google: false, facebook: false, phone: true });
        if (C.configured) { showOnly(C.knownProviders); C.providers().then(showOnly).catch(() => {}); }
        card.prepend(back());
        if (opts.closable) card.prepend(h('button', { class: 'ag-x', 'aria-label': t('close'), html: PD.ic.close, onclick: () => finish(false) }));
      } else if (view === 'signin' || view === 'signup') {
        const up = view === 'signup', msg = msgEl();
        const name = h('input', { class: 'input', autocomplete: 'name', placeholder: t('au.name'), 'aria-label': t('au.name') });
        const em = h('input', { class: 'input', type: 'email', autocomplete: 'email', inputmode: 'email', placeholder: t('au.email'), 'aria-label': t('au.email'), value: email });
        const pw = h('input', { class: 'input', type: 'password', autocomplete: up ? 'new-password' : 'current-password', placeholder: t('au.password'), 'aria-label': t('au.password') });
        const eye = h('button', { class: 'ag-eye', type: 'button', 'data-t': 'au.show', onclick: () => { const s = pw.type === 'password'; pw.type = s ? 'text' : 'password'; eye.textContent = t(s ? 'au.hide' : 'au.show'); } });
        const go = h('button', { class: 'btn primary big', 'data-t': up ? 'au.signup' : 'au.signin', type: 'submit' });
        const form = h('form', { class: 'ag-form', onsubmit: e => { e.preventDefault(); email = em.value.trim();
          if (!okEmail(email)) { msg.hidden = false; msg.textContent = t('au.badEmail'); return; }
          if (pw.value.length < 8) { msg.hidden = false; msg.textContent = t('au.shortPw'); return; }
          run(go, msg, async () => { if (up) { const r = await C.auth.signUp(email, pw.value, name.value.trim()); if (r.verify) { view = 'verify'; render(); } } else await C.auth.signIn(email, pw.value); });
        } }, [up ? name : null, em, h('div', { class: 'ag-pw' }, [pw, eye]), go].filter(Boolean));
        card.append(...[back(), h('h2', { 'data-t': up ? 'au.signup' : 'au.signin' }),
          h('div', { class: 'seg ag-tabs', role: 'tablist' }, ['signin', 'signup'].map(k => h('button', { role: 'tab', 'aria-pressed': String(view === k), 'data-t': 'au.' + k, onclick: () => { email = em.value.trim(); view = k; render(); } }))),
          form, msg, up ? null : h('button', { class: 'linkbtn', 'data-t': 'au.forgot', onclick: () => { email = em.value.trim(); view = 'reset'; render(); } })].filter(Boolean));
        setTimeout(() => (up ? name : em).focus(), 60);
      } else if (view === 'reset') {
        const msg = msgEl(), em = h('input', { class: 'input', type: 'email', autocomplete: 'email', placeholder: t('au.email'), value: email });
        const go = h('button', { class: 'btn primary big', 'data-t': 'au.send', onclick: () => { if (!okEmail(em.value.trim())) { msg.hidden = false; msg.textContent = t('au.badEmail'); return; } run(go, msg, async () => { await C.auth.recover(em.value.trim()); msg.hidden = false; msg.className = 'ag-msg info'; msg.textContent = t('au.sent'); }); } });
        card.append(back(), h('h2', { 'data-t': 'au.reset' }), h('p', { class: 'ag-sub', 'data-t': 'au.resetD' }), em, go, msg);
      } else if (view === 'verify') {
        const msg = msgEl();
        card.append(back(), h('h2', { 'data-t': 'au.signup' }), h('p', { class: 'ag-sub', 'data-t': 'au.verify' }), h('p', { class: 'ag-sub', text: email }),
          h('button', { class: 'btn primary big', 'data-t': 'au.signin', onclick: () => { view = 'signin'; render(); } }),
          h('button', { class: 'btn quiet', 'data-t': 'au.resend', onclick: e => run(e.currentTarget, msg, async () => { await C.auth.resend(email); msg.hidden = false; msg.className = 'ag-msg info'; msg.textContent = t('au.sent'); }) }), msg);
      } else if (view === 'phone' || view === 'code') {
        const msg = msgEl();
        if (view === 'phone') {
          const ph = h('input', { class: 'input ag-big', type: 'tel', autocomplete: 'tel', inputmode: 'tel', value: phone, 'aria-label': t('au.phoneNo') });
          const go = h('button', { class: 'btn primary big', 'data-t': 'au.sendCode', onclick: () => { const n = ph.value.replace(/[^\d+]/g, ''); if (!/^\+\d{9,15}$/.test(n)) { msg.hidden = false; msg.textContent = t('au.badPhone'); return; } phone = ph.value; PD.store.set('auth.phone', phone); run(go, msg, async () => { await C.auth.phoneStart(n); view = 'code'; render(); }); } });
          card.append(back(), h('h2', { 'data-t': 'au.phone' }), h('label', { class: 'field' }, [h('span', { 'data-t': 'au.phoneNo' }), ph]), go, msg);
          setTimeout(() => ph.focus(), 60);
        } else {
          const n = phone.replace(/[^\d+]/g, '');
          const code = h('input', { class: 'input ag-big ag-code', inputmode: 'numeric', autocomplete: 'one-time-code', maxlength: '8', 'aria-label': t('au.code') });
          const go = h('button', { class: 'btn primary big', 'data-t': 'au.verifyCode', onclick: () => run(go, msg, () => C.auth.phoneVerify(n, code.value.trim())) });
          card.append(back(), h('h2', { 'data-t': 'au.code' }), h('p', { class: 'ag-sub', text: t('au.codeSent', { p: phone }) }), code, go,
            h('button', { class: 'linkbtn', 'data-t': 'au.resend', onclick: () => run(null, msg, () => C.auth.phoneStart(n)) }), msg);
          setTimeout(() => code.focus(), 60);
        }
      }
      PD.i18n.apply(card);
    }
    render();
    return { close: () => finish(false) };
  }
  /** after the password-reset link: the member is signed in by the link and sets a new password here */
  function newPassword() {
    PD.ui.sheet((box, close) => {
      const pw = h('input', { class: 'input', type: 'password', autocomplete: 'new-password', placeholder: t('au.newPw'), 'aria-label': t('au.newPw') }), msg = h('p', { class: 'ag-msg', role: 'alert', hidden: true });
      const go = h('button', { class: 'btn primary', 'data-t': 'au.pwSave', onclick: async () => {
        if (pw.value.length < 8) { msg.hidden = false; msg.textContent = t('au.shortPw'); return; }
        go.disabled = true; try { await C.auth.setPassword(pw.value); close(); PD.ui.toast(t('au.pwSaved'), 3000); } catch (e) { msg.hidden = false; msg.textContent = message(e); go.disabled = false; }
      } });
      box.append(h('h2', { 'data-t': 'au.newPw' }), h('p', { class: 'muted', 'data-t': 'au.newPwD' }), pw, msg, h('div', { class: 'row' }, [go, h('button', { class: 'btn quiet', 'data-t': 'cancel', onclick: close })]));
      setTimeout(() => pw.focus(), 60);
    });
  }
  PD.bus.on('recovery', () => newPassword());
  /** right after signing in or registering: the instrument, the name and the three strings (A · C♯ · E) strummed,
      until PD.cloud.arriving (profile + progress sync) settles — at least long enough for one strum, at most 8 s */
  function arrive(onDone) {
    const el = h('div', { class: 'arr', role: 'status', 'aria-live': 'polite' });
    const str = (y, c, w, d) => '<g transform="translate(0 ' + y + ')"><path d="M2 0Q68 10 134 0" stroke-width="' + w + '" vector-effect="non-scaling-stroke" style="stroke:' + c + ';animation-delay:' + d + 's"/></g>';
    el.innerHTML = '<div class="arr-in"><svg class="arr-pan" width="34" height="82" viewBox="0 0 40 96" aria-hidden="true"><rect x="17" y="1" width="6" height="9" rx="1.5" fill="#E0A878"/><rect x="18.25" y="8" width="3.5" height="46" fill="#6B2A17"/><path d="M20 46C25 46 28 51 29.5 57C32 67 36 75 35 84C34 91 28 94 20 94S6 91 5 84C4 75 8 67 10.5 57C12 51 15 46 20 46Z" fill="#EAD3A3"/><circle cx="20" cy="73" r="5.6" fill="none" stroke="#C98B5B" stroke-width=".8"/><circle cx="20" cy="73" r="4.2" fill="#1A0F08"/><rect x="15" y="85.5" width="10" height="1.6" rx=".5" fill="#6B2A17"/><path d="M19.1 5V86M20 5V86M20.9 5V86" stroke="#F1ECE6" stroke-opacity=".6" stroke-width=".35"/></svg>'
      + '<b class="arr-name">' + t('app.name') + '</b>'
      + '<svg class="arr-str" width="136" height="34" viewBox="0 0 136 34" aria-hidden="true">' + str(7, 'var(--sE)', 1, .24) + str(17, 'var(--sC)', 1.3, .12) + str(27, 'var(--sA)', 1.7, 0) + '</svg>'
      + '<span class="arr-t" data-t="au.arrive"></span></div>';
    PD.i18n.apply(el); document.body.appendChild(el);
    const t0 = Date.now();
    Promise.resolve().then(() => Promise.race([C.arriving, new Promise(r => setTimeout(r, 8000))])).catch(() => {}).then(() => {   // the sign-in call starts the sync just after the session lands
      setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 380); onDone && onDone(); }, Math.max(0, 1100 - (Date.now() - t0)));
    });
  }
  return { gate, arrive, newPassword, open: v => gate(null, { closable: !!PD.cloud.session, view: v === 'signin' ? 'signin' : 'methods' }) };   // closable only for someone already signed in
})();
