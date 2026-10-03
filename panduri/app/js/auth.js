/* =====================================================================
   Sign-in, first thing on first launch: Google · Facebook · phone number
   · e-mail and password (plus create account, forgotten password,
   e-mail confirmation). Everything goes through PD.cloud (Supabase).
   With no server configured nothing pretends to succeed: the screen says
   so, and "continue without an account" keeps progress on this device.
   ===================================================================== */
PD.i18n.add({
  'au.signin': ['შესვლა', 'Sign in'], 'au.signup': ['ანგარიშის შექმნა', 'Create account'], 'au.email': ['ელფოსტა', 'Email'], 'au.password': ['პაროლი', 'Password'], 'au.name': ['სახელი', 'Name'],
  'au.forgot': ['დაგავიწყდა პაროლი?', 'Forgot password?'], 'au.reset': ['პაროლის აღდგენა', 'Reset password'], 'au.resetD': ['ელფოსტაზე გამოგიგზავნით ბმულს ახალი პაროლისთვის.', 'We will email you a link to set a new password.'], 'au.send': ['გაგზავნა', 'Send'],
  'au.sent': ['გაიგზავნა — შეამოწმე ელფოსტა.', 'Sent — check your email.'],
  'au.or': ['ან', 'or'], 'au.google': ['Google-ით გაგრძელება', 'Continue with Google'], 'au.facebook': ['Facebook-ით გაგრძელება', 'Continue with Facebook'], 'au.phone': ['ტელეფონის ნომრით', 'With phone number'], 'au.withEmail': ['ელფოსტით და პაროლით', 'With email and password'],
  'au.guest': ['ანგარიშის გარეშე გაგრძელება', 'Continue without an account'], 'au.guestD': ['პროგრესი მხოლოდ ამ მოწყობილობაზე შეინახება. ანგარიშს მოგვიანებით შექმნი პროფილიდან.', 'Progress stays on this device only. You can create an account later from Profile.'],
  'au.verify': ['გამოგიგზავნეთ წერილი — დაადასტურე ელფოსტა და შემდეგ შედი.', 'We sent you an email — confirm your address, then sign in.'], 'au.resend': ['ხელახლა გაგზავნა', 'Resend'],
  'au.noBackend': ['სერვერი ჯერ არ არის დაკავშირებული — შესვლა და ანგარიშის შექმნა ჩაირთვება, როგორც კი სერვერი დაემატება. მანამდე შეგიძლია ანგარიშის გარეშე ისწავლო.', 'The server is not connected yet — sign-in and accounts switch on as soon as it is added. Until then you can learn without an account.'],
  'au.badEmail': ['შეამოწმე ელფოსტა', 'Check the email address'], 'au.shortPw': ['პაროლი — მინიმუმ 8 სიმბოლო', 'Password: at least 8 characters'], 'au.err': ['ვერ მოხერხდა: {e}', 'Could not complete: {e}'],
  'au.badLogin': ['ელფოსტა ან პაროლი არასწორია', 'Wrong email or password'], 'au.exists': ['ასეთი ანგარიში უკვე არსებობს — შედი', 'This account already exists — sign in'], 'au.offline': ['ინტერნეტი არ არის', 'No internet connection'],
  'au.phoneNo': ['ტელეფონის ნომერი', 'Phone number'], 'au.sendCode': ['კოდის გაგზავნა', 'Send code'], 'au.code': ['SMS კოდი', 'SMS code'], 'au.codeSent': ['კოდი გაიგზავნა {p}-ზე', 'Code sent to {p}'], 'au.verifyCode': ['დადასტურება', 'Confirm'], 'au.badPhone': ['შეამოწმე ნომერი', 'Check the number'],
  'au.signedIn': ['შესული ხარ: {e}', 'Signed in as {e}'], 'au.signout': ['გასვლა', 'Sign out'], 'au.sync': ['სინქრონიზაცია', 'Sync'], 'au.syncOff': ['მიუწვდომელია — სერვერი არ არის დაკავშირებული', 'Unavailable — no server connected'],
  'au.syncOn': ['პროგრესი ანგარიშში ინახება', 'Progress is saved to your account'], 'au.subscription': ['გამოწერა', 'Subscription'], 'au.subOff': ['ამ ვერსიაში გადახდები არ არის', 'No payments in this build'],
  'au.welcome': ['ისწავლე ფანდური ნამდვილ ინსტრუმენტზე', 'Learn the panduri on a real instrument'], 'au.welcomeD': ['აპი გიჩვენებს, გისმენს და გელოდება.', 'The app shows you, listens and waits for you.'],
  'au.terms': ['შესვლით ეთანხმები, რომ შენი სახელი და დონე სხვა მოსწავლეებს გამოუჩნდეთ. ხმა და ვიდეო მხოლოდ შენს მოწყობილობაზე მუშავდება.', 'By signing in you agree that your name and level are visible to other learners. Sound and video are processed on your device only.'],
  'au.back': ['უკან', 'Back'], 'au.show': ['ჩვენება', 'Show'], 'au.hide': ['დამალვა', 'Hide']
});

PD.auth = (() => {
  const h = PD.h, C = PD.cloud;
  const okEmail = e => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  const ICON = {
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
    let view = 'home', email = '', phone = PD.store.get('auth.phone', '+995 '), busy = false, done = false;
    const off = C.on(() => { if (C.session) finish(true); });
    function finish(ok) { if (done) return; done = true; off(); root.classList.add('out'); setTimeout(() => root.remove(), 260); onDone && onDone(ok); }
    const msgEl = () => h('p', { class: 'ag-msg', role: 'alert', hidden: true });
    async function run(btn, msg, fn) {
      if (busy) return; busy = true; msg.hidden = true; if (btn) btn.classList.add('busy');
      try { if (!C.configured) throw Object.assign(new Error('no-backend'), { code: 'no-backend' }); await fn(); }
      catch (e) { msg.hidden = false; msg.textContent = message(e); msg.className = 'ag-msg' + (e && e.code === 'no-backend' ? ' info' : ''); }
      finally { busy = false; if (btn) btn.classList.remove('busy'); }
    }
    const back = () => h('button', { class: 'ag-back', html: PD.ic.back + '<span data-t="au.back"></span>', onclick: () => { view = 'home'; render(); } });
    function render() {
      card.innerHTML = ''; card.classList.remove('home');
      if (view === 'home') {
        const msg = msgEl();
        const prov = (k, ic, label, fn) => { const b = h('button', { class: 'ag-btn ' + k, html: '<span class="ag-ic">' + ic + '</span><span data-t="' + label + '"></span>', onclick: () => fn(b) }); return b; };
        card.classList.add('home');
        card.append(h('div', { class: 'ag-brand' }, [h('div', { class: 'ag-logo', html: LOGO }), h('h1', { 'data-t': 'app.name' }), h('p', { class: 'ag-lead', 'data-t': 'au.welcome' }), h('p', { class: 'ag-sub', 'data-t': 'au.welcomeD' })]),
          h('div', { class: 'ag-side' }, [C.configured ? null : h('p', { class: 'ag-msg info', 'data-t': 'au.noBackend' }),
          h('div', { class: 'ag-list' }, [
            prov('google', ICON.google, 'au.google', b => run(b, msg, () => C.auth.oauth('google'))),
            prov('facebook', ICON.facebook, 'au.facebook', b => run(b, msg, () => C.auth.oauth('facebook'))),
            prov('phone', ICON.phone, 'au.phone', () => { view = 'phone'; render(); }),
            prov('mail', ICON.mail, 'au.withEmail', () => { view = 'signin'; render(); })]),
          msg,
          opts.noGuest ? null : h('button', { class: 'ag-guest', 'data-t': 'au.guest', onclick: () => { PD.store.set('auth.skip', true); finish(false); } }),
          opts.noGuest ? null : h('small', { class: 'ag-fine', 'data-t': 'au.guestD' }),
          h('small', { class: 'ag-fine', 'data-t': 'au.terms' })].filter(Boolean)));
        card.prepend(h('button', { class: 'ag-lang', text: PD.i18n.lang === 'ka' ? 'EN' : 'ქარ', onclick: () => { PD.i18n.set(PD.i18n.lang === 'ka' ? 'en' : 'ka'); render(); } }));
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
  return { gate, open: () => gate(null, { closable: true }) };
})();
