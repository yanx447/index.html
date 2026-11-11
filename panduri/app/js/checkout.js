/* =====================================================================
   Checkout — the payment page (website, PWA, desktop).
   The app never sees a card number: the buyer types it on the bank's
   (TBC) or PayPal's own page. Which methods appear is decided by the
   server catalog — a method that is not switched on is shown as
   "coming soon", never as a button that does nothing. A return from the
   hosted page is a hint only; Premium starts when the server confirms.
   Store builds (iOS, Android) never come here: they pay in the store.
   ===================================================================== */
PD.i18n.add({
  'pay.title': ['გადახდა', 'Checkout'],
  'pay.lead': ['პრემიუმი — მთელი სასწავლო პროგრამა და VIP შესაძლებლობები.', 'Premium — the whole programme and VIP features.'],
  'pay.plan': ['გეგმა', 'Plan'], 'pay.method': ['გადახდის მეთოდი', 'Payment method'], 'pay.summary': ['შეკვეთა', 'Order'],
  'pay.card': ['საბანკო ბარათი', 'Bank card'],
  'pay.cardTBC': ['TBC ბანკის დაცული გვერდი · ნებისმიერი ბანკის ბარათი', "TBC Bank's secure page · a card from any bank"],
  'pay.cardPP': ['PayPal-ის დაცული გვერდი · PayPal ანგარიში საჭირო არ არის', "PayPal's secure page · no PayPal account needed"],
  'pay.applePay': ['Apple Pay', 'Apple Pay'], 'pay.googlePay': ['Google Pay', 'Google Pay'],
  'pay.walletOn': ['ბანკის გვერდზე აირჩევ · {w}', "You choose it on the bank's page · {w}"],
  'pay.appleWhere': ['iPhone, iPad ან Mac, Safari', 'iPhone, iPad or Mac, in Safari'], 'pay.googleWhere': ['Android ან Chrome', 'Android or Chrome'],
  'pay.paypal': ['PayPal', 'PayPal'], 'pay.paypalD': ['შედი PayPal ანგარიშით', 'Sign in with your PayPal account'],
  'pay.soon': ['მალე', 'Soon'],
  'pay.soonCard': ['ბარათით პირდაპირ გადახდა ჯერ არ არის ჩართული.', 'Paying directly by card is not switched on yet.'],
  'pay.soonWallet': ['ჩაირთვება, როცა ბანკი გაააქტიურებს.', 'Turns on once the bank activates it.'],
  'pay.total': ['სულ', 'Total'], 'pay.item': ['პრემიუმი · {p}', 'Premium · {p}'],
  'pay.valid': ['იმოქმედებს {d}', 'Valid until {d}'],
  'pay.extend': ['ახლანდელ ვადას დაემატება', 'Added to your current period'],
  'pay.fx': ['ფასი {c}-შია. თუ ბარათი სხვა ვალუტისაა, კონვერტაციას შენი ბანკი აკეთებს.', 'The price is in {c}. If your card is in another currency, your bank converts it.'],
  'pay.go': ['გადახდა · {p}', 'Pay {p}'],
  'pay.safe': ['ბარათის მონაცემებს ფანდური ვერ ხედავს და არ ინახავს — მათ შეიყვან {w} დაცულ გვერდზე.', 'Panduri never sees or stores your card details — you type them on {w} secure page.'],
  'pay.safeTBC': ['TBC ბანკის', "TBC Bank's"], 'pay.safePP': ['PayPal-ის', "PayPal's"],
  'pay.how': ['როგორ მუშაობს', 'How it works'],
  'pay.h1': ['აირჩიე გეგმა და მეთოდი.', 'Choose a plan and a method.'],
  'pay.h2': ['გადახვალ დაცულ გვერდზე და იქ გადაიხდი.', 'You go to the secure page and pay there.'],
  'pay.h3': ['დაბრუნდები აპში — პრემიუმი ჩაირთვება, როგორც კი სერვერი გადახდას დაადასტურებს.', 'You come back to the app — Premium starts as soon as the server confirms the payment.'],
  'pay.checking': ['ვამოწმებთ გადახდას…', 'Checking the payment…'],
  'pay.paid': ['გადახდა დადასტურდა. მადლობა!', 'Payment confirmed. Thank you!'],
  'pay.notYet': ['გადახდა ჯერ არ დადასტურებულა. თუ თანხა ჩამოგეჭრა, პრემიუმი თავად ჩაირთვება დადასტურებისთანავე.', 'The payment is not confirmed yet. If you were charged, Premium turns on by itself once it is confirmed.'],
  'pay.cancelled': ['გადახდა გაუქმდა. თანხა არ ჩამოგეჭრა.', 'The payment was cancelled. You were not charged.'],
  'pay.recheck': ['ხელახლა შემოწმება', 'Check again'],
  'pay.toApp': ['აპში დაბრუნება', 'Back to the app'],
  'pay.store': ['ამ ვერსიაში შეძენა ხდება App Store-ით ან Google Play-ით.', 'In this version you buy through the App Store or Google Play.'],
  'pay.open': ['პრემიუმის გახსნა', 'Open Premium'],
  'pay.signin': ['შესვლა', 'Sign in'],
  'pay.continue': ['გადახდაზე გადასვლა', 'Continue to checkout'],
  'pay.again': ['გადახდის გვერდზე', 'Back to checkout']
});

PD.checkout = (() => {
  const h = PD.h, C = PD.cloud;
  const SVG = (p, s = 22) => '<svg viewBox="0 0 24 24" width="' + s + '" height="' + s + '" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + '</svg>';
  const IC = {
    card: SVG('<rect x="2.5" y="5" width="19" height="14" rx="2.5"/><path d="M2.5 10h19M6 15h4"/>'),
    phone: SVG('<rect x="6.5" y="2.5" width="11" height="19" rx="2.5"/><path d="M11 18.5h2"/>'),
    wallet: SVG('<path d="M4 7.5A2.5 2.5 0 0 1 6.5 5H18v4"/><rect x="3" y="7.5" width="18" height="12" rx="2.5"/><circle cx="16.5" cy="13.5" r="1.2" fill="currentColor"/>'),
    paypal: SVG('<path d="M7.5 20.5 10 4h6.2c2.8 0 4.3 1.7 3.8 4.3-.6 3.2-3 4.7-6 4.7h-2.4l-1.1 7.5z"/>'),
    lock: SVG('<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>', 17),
    shield: SVG('<path d="M12 3 5 6v5c0 4.4 3 8.3 7 10 4-1.7 7-5.6 7-10V6z"/><path d="m9 12 2 2 4-4"/>', 18),
    ok: SVG('<circle cx="12" cy="12" r="9"/><path d="m8 12.5 2.6 2.5L16 9.5"/>', 40)
  };
  const loc = () => PD.i18n.locale || (PD.i18n.lang === 'ka' ? 'ka-GE' : 'en-US');
  const money = p => p.display || new Intl.NumberFormat(loc(), { style: 'currency', currency: p.currency }).format(Number(p.value));
  const KA_M = ['იანვრამდე', 'თებერვლამდე', 'მარტამდე', 'აპრილამდე', 'მაისამდე', 'ივნისამდე', 'ივლისამდე', 'აგვისტომდე', 'სექტემბრამდე', 'ოქტომბრამდე', 'ნოემბრამდე', 'დეკემბრამდე'];
  // The same rule as the server's fulfil_web_purchase: from the later of now and the current paid end, plus one month or year.
  function validUntil(plan) {
    const p = C.profile, cur = p && p.vip_until ? new Date(p.vip_until) : null, now = new Date();
    const ext = !!(cur && cur > now), d = new Date(ext ? cur : now), day = d.getDate();
    d.setDate(1);
    if (plan === 'monthly') d.setMonth(d.getMonth() + 1); else d.setFullYear(d.getFullYear() + 1);
    d.setDate(Math.min(day, new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()));   // 31 January + 1 month = 28/29 February, as in Postgres
    return { d, extends: ext };
  }
  // ka: "2027 წლის 11 დეკემბრამდე" — the postposition belongs to the month, so the whole phrase is built here
  const fmtValid = d => PD.i18n.lang === 'ka' ? d.getFullYear() + ' წლის ' + d.getDate() + ' ' + KA_M[d.getMonth()] : d.toLocaleDateString(loc(), { day: 'numeric', month: 'long', year: 'numeric' });

  let shownReturn = false;
  function open(plan) {
    if (PD.billing.native) return PD.premium.paywall();
    PD.app.go('checkout', plan === 'monthly' ? 'monthly' : 'yearly');
  }

  function page(w, param) {
    const B = PD.billing;
    w.classList.add('pay');
    w.append(h('div', { class: 'row pg-head' }, [h('button', { class: 'btn small backbtn', html: PD.ic.back + '<span class="sr" data-t="back"></span>', onclick: () => PD.app.back('profile') }), h('h1', { 'data-t': 'pay.title', style: 'margin:0' })]));
    if (B.native) { w.append(h('p', { class: 'notice', 'data-t': 'pay.store' }), h('button', { class: 'btn primary', 'data-t': 'pay.open', onclick: () => PD.premium.paywall() })); return; }
    if (!C.session) { w.append(h('p', { class: 'notice', 'data-t': 'pm.needAccount' }), h('button', { class: 'btn primary', 'data-t': 'pay.signin', onclick: () => PD.auth.open() })); return; }

    // Back from the hosted page: say what is known, and only what is known.
    const back = !shownReturn && B.returned; shownReturn = true;
    if (param === 'return' || back) { returnState(w, B, back || 'paypal'); return; }

    const pending = B.pending && B.pending();
    let plan = param === 'monthly' ? 'monthly' : param === 'yearly' ? 'yearly' : (pending && pending.plan) || 'yearly';
    let method = null, options = null;
    w.append(h('p', { class: 'muted pay-lead', 'data-t': 'pay.lead' }));
    if (PD.premium.active) w.append(h('p', { class: 'pay-active', text: PD.premium.status() }));
    if (PD.premium.banned) { w.append(h('p', { class: 'notice', 'data-t': 'pm.blocked' })); return; }

    const plans = h('div', { class: 'pay-plans', role: 'radiogroup', 'aria-label': t('pay.plan') });
    const methods = h('div', { class: 'pay-methods', role: 'radiogroup', 'aria-label': t('pay.method') });
    const summary = h('div', { class: 'pay-sum' });
    const msg = h('p', { class: 'ag-msg info', text: t('pm.loadingPay') });
    const go = h('button', { class: 'btn primary big pay-go', disabled: true, onclick: pay });
    const safe = h('p', { class: 'pay-safe' });
    w.append(h('h2', { class: 'pay-h', 'data-t': 'pay.plan' }), plans,
      h('h2', { class: 'pay-h', 'data-t': 'pay.method' }), methods,
      h('h2', { class: 'pay-h', 'data-t': 'pay.summary' }), summary, go, msg, safe,
      h('details', { class: 'pay-how' }, [h('summary', { 'data-t': 'pay.how' }), h('ol', {}, ['pay.h1', 'pay.h2', 'pay.h3'].map(k => h('li', { 'data-t': k })))]));
    const restore = h('button', { class: 'btn quiet', 'data-t': 'pm.restore', onclick: async () => {
      restore.disabled = true;
      try { if (await B.restore()) PD.app.render(); else say(t('pm.noneFound')); } catch (_) { say(t('pm.payError')); } finally { restore.disabled = false; }
    } });
    w.append(restore);
    const say = (text, info) => { msg.hidden = false; msg.className = 'ag-msg' + (info ? ' info' : ''); msg.textContent = text; };
    const provider = () => options && options.providers.find(p => p.id === (method === 'apple_pay' || method === 'google_pay' ? 'tbc' : method));

    function row(id, icon, title, sub, on, extra) {
      const el = h(on ? 'button' : 'div', on ? { class: 'pay-m', role: 'radio', type: 'button', 'aria-checked': String(method === id), onclick: () => { method = id; draw(); } } : { class: 'pay-m off', 'aria-disabled': 'true' }, [
        h('span', { class: 'pay-m-ic', html: icon }),
        h('span', { class: 'pay-m-tx' }, [h('b', { text: title }), h('small', { text: sub })]),
        extra || null,
        on ? h('span', { class: 'pay-radio', 'aria-hidden': 'true' }) : h('span', { class: 'pay-soon', text: t('pay.soon') })]);
      methods.append(el);
    }
    const marks = () => h('span', { class: 'pay-marks', 'aria-hidden': 'true' }, [h('i', { class: 'mk-visa', text: 'VISA' }), h('i', { class: 'mk-mc' }, [h('em'), h('em')])]);

    function draw() {
      const P = options.providers, card = P.find(p => p.kind === 'card'), tbc = P.find(p => p.id === 'tbc'), pp = P.find(p => p.id === 'paypal');
      const wallets = (tbc && tbc.wallets) || [];
      if (!method) method = card ? card.id : pp ? 'paypal' : null;
      methods.innerHTML = '';
      row(card ? card.id : 'card', IC.card, t('pay.card'), card ? t(card.id === 'tbc' ? 'pay.cardTBC' : 'pay.cardPP') : t('pay.soonCard'), !!card, marks());
      row('apple_pay', IC.phone, t('pay.applePay'), wallets.includes('apple_pay') ? t('pay.walletOn', { w: t('pay.appleWhere') }) : t('pay.soonWallet'), wallets.includes('apple_pay'));
      row('google_pay', IC.wallet, t('pay.googlePay'), wallets.includes('google_pay') ? t('pay.walletOn', { w: t('pay.googleWhere') }) : t('pay.soonWallet'), wallets.includes('google_pay'));
      if (pp) row('paypal', IC.paypal, t('pay.paypal'), t('pay.paypalD'), true);

      const cur = provider();
      plans.innerHTML = '';
      for (const k of ['monthly', 'yearly']) {
        const price = cur && cur.prices[k];
        if (!price) continue;
        const sub = k === 'yearly' && cur.prices.monthly ? (() => { const m = Number(price.value) / 12, d = Math.round((1 - m / Number(cur.prices.monthly.value)) * 100); return d > 0 ? t('pm.perYearM', { p: money({ value: m.toFixed(2), currency: price.currency }), d }) : ''; })() : '';
        plans.append(h('button', { class: 'pay-plan', role: 'radio', type: 'button', 'aria-checked': String(plan === k), onclick: () => { plan = k; draw(); } }, [
          k === 'yearly' && sub ? h('em', { 'data-t': 'pm.best' }) : null,
          h('b', { 'data-t': 'pm.' + k }), h('span', { class: 'pay-price', text: money(price) }),
          h('small', { text: sub || t(k === 'monthly' ? 'pm.perMonth' : 'pm.perYear') })]));
      }
      if (cur && !cur.prices[plan]) { plan = cur.prices.yearly ? 'yearly' : 'monthly'; return draw(); }

      summary.innerHTML = '';
      if (cur) {
        const price = cur.prices[plan], v = validUntil(plan);
        summary.append(...[
          h('div', { class: 'pay-line' }, [h('span', { text: t('pay.item', { p: t('pm.' + plan) }) }), h('span', { text: money(price) })]),
          h('div', { class: 'pay-line sub' }, [h('span', { text: t('pay.valid', { d: fmtValid(v.d) }) }), v.extends ? h('span', { 'data-t': 'pay.extend' }) : null]),
          h('div', { class: 'pay-line total' }, [h('b', { 'data-t': 'pay.total' }), h('b', { text: money(price) })]),
          h('p', { class: 'muted pay-note', 'data-t': 'pm.once' }),
          price.currency !== 'GEL' ? h('p', { class: 'muted pay-note', text: t('pay.fx', { c: price.currency }) }) : null].filter(Boolean));
        go.innerHTML = IC.lock + '<span>' + PD.esc(t('pay.go', { p: money(price) })) + '</span>';
        go.disabled = false;
        safe.innerHTML = IC.shield + '<span>' + PD.esc(t('pay.safe', { w: t(cur.id === 'tbc' ? 'pay.safeTBC' : 'pay.safePP') })) + '</span>';
      } else { go.disabled = true; go.textContent = t('pm.buy'); safe.innerHTML = ''; }
      PD.i18n.apply(w);
    }
    async function pay() {
      const cur = provider();
      if (!cur) return;
      go.disabled = true; go.classList.add('is-loading'); msg.hidden = true;
      try {
        const result = await B.purchase(plan, cur.id);
        if (result.redirecting) return;   // the browser is leaving for the hosted page
        if (PD.premium.active) PD.app.render(); else if (result.pending) say(t('pm.checking'), true);
      } catch (e) { say(t(e.message === 'billing-not-configured' ? 'pm.noPay' : e.message === 'premium-blocked' ? 'pm.blocked' : 'pm.payError')); }
      go.disabled = false; go.classList.remove('is-loading');
    }
    B.options().then(result => {
      if (!w.isConnected) return;
      options = result;
      if (!result.providers.some(p => p.prices.monthly || p.prices.yearly)) { say(t('pm.noPay')); return; }
      msg.hidden = true;
      for (const [kind, key] of [['terms', 'pm.termsLink'], ['privacy', 'pm.privacyLink']]) {
        const link = result.policies && result.policies[kind];
        if (link && /^https:\/\//.test(link)) w.append(h('a', { class: 'btn quiet', href: link, target: '_blank', rel: 'noopener noreferrer', 'data-t': key }));
      }
      draw();
    }).catch(() => { if (w.isConnected) say(t('pm.noPay')); });
  }

  function returnState(w, B, how) {
    const box = h('div', { class: 'pay-ret' }), icon = h('div', { class: 'pay-ret-ic' }), text = h('p', { class: 'pay-ret-t' }), acts = h('div', { class: 'pay-ret-a' });
    box.append(icon, text, acts); w.append(box);
    const done = () => acts.append(h('button', { class: 'btn primary', 'data-t': 'pay.toApp', onclick: () => PD.app.go('home', null, true) }));
    const retry = () => acts.append(h('button', { class: 'btn', 'data-t': 'pay.recheck', onclick: () => { acts.innerHTML = ''; check(); } }), h('button', { class: 'btn quiet', 'data-t': 'pay.again', onclick: () => PD.app.go('checkout', null, true) }));
    async function check() {
      icon.className = 'pay-ret-ic spin'; icon.innerHTML = ''; text.textContent = t('pay.checking');
      let paid = false;
      try { paid = await B.verifyPending(); } catch (_) {}
      if (!w.isConnected) return;
      if (paid || PD.premium.active && !B.pending()) { icon.className = 'pay-ret-ic ok'; icon.innerHTML = IC.ok; text.textContent = t('pay.paid') + ' ' + PD.premium.status(); done(); }
      else { icon.className = 'pay-ret-ic wait'; icon.innerHTML = ''; text.textContent = t('pay.notYet'); retry(); }
      PD.i18n.apply(acts);
    }
    if (how === 'cancelled') { icon.className = 'pay-ret-ic wait'; text.textContent = t('pay.cancelled'); acts.append(h('button', { class: 'btn primary', 'data-t': 'pay.again', onclick: () => PD.app.go('checkout', null, true) })); return; }
    check();
  }
  return { page, open };
})();
