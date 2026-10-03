/* =====================================================================
   Auth UI — sign in, create account, password reset, email verification,
   Google / Facebook / Apple. Every action goes through
   PD.account.remote (the backend contract in core.js). With no backend
   configured nothing pretends to succeed: the learner is told plainly and
   stays in guest mode, where progress is kept on this device.
   ===================================================================== */
PD.i18n.add({
  'au.signin': ['შესვლა', 'Sign in'], 'au.signup': ['ანგარიშის შექმნა', 'Create account'], 'au.email': ['ელფოსტა', 'Email'], 'au.password': ['პაროლი', 'Password'], 'au.name': ['სახელი', 'Name'],
  'au.forgot': ['დაგავიწყდა პაროლი?', 'Forgot password?'], 'au.reset': ['პაროლის აღდგენა', 'Reset password'], 'au.resetD': ['გამოგიგზავნით ბმულს ელფოსტაზე.', 'We will email you a link.'], 'au.send': ['გაგზავნა', 'Send'],
  'au.or': ['ან', 'or'], 'au.google': ['Google-ით', 'Continue with Google'], 'au.facebook': ['Facebook-ით', 'Continue with Facebook'], 'au.apple': ['Apple-ით', 'Continue with Apple'],
  'au.guest': ['სტუმრად გაგრძელება', 'Continue as guest'], 'au.verify': ['შეამოწმე ელფოსტა და დაადასტურე მისამართი.', 'Check your email to verify your address.'], 'au.resend': ['ხელახლა გაგზავნა', 'Resend'],
  'au.noBackend': ['სერვერი ჯერ არ არის დაკავშირებული — ანგარიშები ამ ვერსიაში ვერ შეიქმნება. შენი პროგრესი ამ მოწყობილობაზე ინახება (სტუმრის რეჟიმი) და შეგიძლია ფაილად გადაიტანო.', 'No server is connected yet — accounts cannot be created in this build. Your progress is kept on this device (guest mode) and can be moved as a file.'],
  'au.badEmail': ['შეამოწმე ელფოსტა', 'Check the email address'], 'au.shortPw': ['პაროლი მინიმუმ 8 სიმბოლო', 'Password: at least 8 characters'], 'au.err': ['ვერ მოხერხდა: {e}', 'Could not complete: {e}'],
  'au.signedIn': ['შესული ხარ: {e}', 'Signed in as {e}'], 'au.signout': ['გასვლა', 'Sign out'], 'au.sync': ['სინქრონიზაცია', 'Sync'], 'au.syncOff': ['მიუწვდომელია — სერვერი არ არის დაკავშირებული', 'Unavailable — no server connected'],
  'au.subscription': ['გამოწერა', 'Subscription'], 'au.subOff': ['ამ ვერსიაში გადახდები არ არის', 'No payments in this build']
});
PD.auth = (() => {
  const h = PD.h, A = PD.account;
  const okEmail = e => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  function open(mode) {
    PD.ui.sheet((box, close) => {
      let m = mode || 'signin';
      const render = () => {
        box.innerHTML = '';
        const msg = h('p', { class: 'notice', hidden: true });
        const fail = e => { msg.hidden = false; msg.textContent = e && e.message === 'no-backend' ? t('au.noBackend') : t('au.err', { e: e && e.message || '?' }); };
        const run = async fn => { msg.hidden = true; try { if (!A.remote.configured) throw new Error('no-backend'); await fn(); } catch (e) { fail(e); } };
        if (m === 'reset') {
          const em = h('input', { class: 'input', type: 'email', autocomplete: 'email', 'aria-label': t('au.email') });
          box.append(h('h2', { 'data-t': 'au.reset' }), h('p', { class: 'muted', 'data-t': 'au.resetD' }), h('label', { class: 'field' }, [h('span', { 'data-t': 'au.email' }), em]), msg,
            h('div', { class: 'row' }, [h('button', { class: 'btn primary', 'data-t': 'au.send', onclick: () => okEmail(em.value) ? run(() => A.remote.resetPassword(em.value)) : fail(new Error(t('au.badEmail'))) }), h('button', { class: 'btn quiet', 'data-t': 'back', onclick: () => { m = 'signin'; render(); } })]));
        } else {
          const tabs = h('div', { class: 'seg', role: 'tablist' }, ['signin', 'signup'].map(k => h('button', { role: 'tab', 'aria-pressed': String(m === k), 'data-t': 'au.' + k, onclick: () => { m = k; render(); } })));
          const name = h('input', { class: 'input', autocomplete: 'name', 'aria-label': t('au.name') }), em = h('input', { class: 'input', type: 'email', autocomplete: 'email', 'aria-label': t('au.email') }), pw = h('input', { class: 'input', type: 'password', autocomplete: m === 'signup' ? 'new-password' : 'current-password', 'aria-label': t('au.password') });
          const submit = () => { if (!okEmail(em.value)) return fail(new Error(t('au.badEmail'))); if (pw.value.length < 8) return fail(new Error(t('au.shortPw'))); run(async () => { const r = m === 'signup' ? await A.remote.signUpEmail(em.value, pw.value, name.value) : await A.remote.signInEmail(em.value, pw.value); PD.store.set('account.session', r && r.session || null); if (m === 'signup') { m = 'verify'; render(); } else close(); }); };
          const prov = k => h('button', { class: 'btn prov', 'data-t': 'au.' + k, onclick: () => run(async () => { const r = await A.remote.signInProvider(k); PD.store.set('account.session', r && r.session || null); close(); }) });
          box.append(...[h('h2', { 'data-t': m === 'signup' ? 'au.signup' : 'au.signin' }), tabs,
            A.remote.configured ? null : h('p', { class: 'notice', 'data-t': 'au.noBackend' }),
            m === 'signup' ? h('label', { class: 'field' }, [h('span', { 'data-t': 'au.name' }), name]) : null,
            h('label', { class: 'field' }, [h('span', { 'data-t': 'au.email' }), em]), h('label', { class: 'field' }, [h('span', { 'data-t': 'au.password' }), pw]), msg,
            h('div', { class: 'row' }, [h('button', { class: 'btn primary', 'data-t': m === 'signup' ? 'au.signup' : 'au.signin', onclick: submit }), m === 'signin' ? h('button', { class: 'linkbtn', 'data-t': 'au.forgot', onclick: () => { m = 'reset'; render(); } }) : null].filter(Boolean)),
            h('div', { class: 'au-or' }, [h('span', { 'data-t': 'au.or' })]),
            h('div', { class: 'au-prov' }, ['google', 'facebook', 'apple'].map(prov)),
            h('button', { class: 'btn quiet', 'data-t': 'au.guest', onclick: close })].filter(Boolean));
          if (m === 'verify') { box.innerHTML = ''; box.append(h('h2', { 'data-t': 'au.signup' }), h('p', { class: 'fg2', 'data-t': 'au.verify' }), msg, h('div', { class: 'row' }, [h('button', { class: 'btn', 'data-t': 'au.resend', onclick: () => run(() => A.remote.resendVerification()) }), h('button', { class: 'btn primary', 'data-t': 'done', onclick: close })])); }
        }
        PD.i18n.apply(box);
      };
      render();
    });
  }
  return { open };
})();
