/* =====================================================================
   Checkout — the payment page (website, PWA, desktop).
   The app never sees a card number: the buyer types it on the bank's
   (TBC) or PayPal's own page, or pays in Apple's or Google's own sheet,
   which hands the server an encrypted token (paywallet.js). Which methods
   appear is decided by the server catalog — a method that is not switched
   on is shown as "coming soon", never as a button that does nothing. A
   return from a hosted page is a hint only; Premium starts when the server
   confirms. Store builds (iOS, Android) never come here: they pay in the store.
   ===================================================================== */
PD.i18n.add({
  'pay.title': ['გადახდა', 'Checkout'],
  'pay.plan': ['გეგმა', 'Plan'], 'pay.method': ['გადახდის მეთოდი', 'Payment method'], 'pay.summary': ['შეკვეთა', 'Order'],
  'pay.card': ['საბანკო ბარათი', 'Bank card'],
  'pay.cardTBC': ['TBC ბანკის დაცული გვერდი · ნებისმიერი ბანკის ბარათი', "TBC Bank's secure page · a card from any bank"],
  'pay.cardPP': ['PayPal-ის დაცული გვერდი · PayPal ანგარიში საჭირო არ არის', "PayPal's secure page · no PayPal account needed"],
  'pay.appleWhere': ['iPhone, iPad ან Mac, Safari', 'iPhone, iPad or Mac, in Safari'], 'pay.googleWhere': ['Android ან Chrome', 'Android or Chrome'],
  'pay.paypal': ['PayPal', 'PayPal'], 'pay.paypalD': ['შედი PayPal ანგარიშით', 'Sign in with your PayPal account'],
  'pay.soon': ['მალე', 'Soon'],
  'pay.soonCard': ['ბარათით პირდაპირ გადახდა ჯერ არ არის ჩართული.', 'Paying directly by card is not switched on yet.'],
  'pay.total': ['სულ', 'Total'], 'pay.item': ['პრემიუმი · {p}', 'Premium · {p}'],
  'pay.valid': ['იმოქმედებს {d}', 'Valid until {d}'],
  'pay.extend': ['ახლანდელ ვადას დაემატება', 'Added to your current period'],
  'pay.fx': ['ფასი {c}-შია. თუ ბარათი სხვა ვალუტისაა, კონვერტაციას შენი ბანკი აკეთებს.', 'The price is in {c}. If your card is in another currency, your bank converts it.'],
  'pay.go': ['გადახდა · {p}', 'Pay {p}'],
  'pay.safe': ['ბარათის მონაცემებს ფანდური ვერ ხედავს და არ ინახავს — მათ შეიყვან {w} დაცულ გვერდზე.', 'Fanduri never sees or stores your card details — you type them on {w} secure page.'],
  'pay.safeTBC': ['TBC ბანკის', "TBC Bank's"], 'pay.safePP': ['PayPal-ის', "PayPal's"],
  'pay.how': ['როგორ მუშაობს', 'How it works'],
  'pay.h1': ['აირჩიე გეგმა და მეთოდი.', 'Choose a plan and a method.'],
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
  'pay.again': ['გადახდის გვერდზე', 'Back to checkout'],
  'pay.off': ['−{n}%', '−{n}%'], 'pay.was': ['ჩვეულებრივი ფასი', 'Regular price'], 'pay.discount': ['ფასდაკლება', 'Discount'],
  'pay.cmpYear': ['თვიურად გადახდისას წელი {p} ჯდება', 'Paid monthly, a year costs {p}'],
  'pay.heroT': ['ფანდური პრემიუმი', 'Panduri Premium'], 'pay.moreF': ['კიდევ {n} შესაძლებლობა', '{n} more features'],
  'pay.express': ['სწრაფი გადახდა', 'Express checkout'], 'pay.or': ['ან', 'or'],
  'pay.xBank': ['TBC ბანკის დაცულ გვერდზე', "On TBC Bank's secure page"],
  'pay.xNoDev': ['ამ მოწყობილობაზე არ არის · {w}', 'Not on this device · {w}'], 'pay.xWait': ['მოწმდება…', 'Checking…'],
  'pay.xHint': ['Apple Pay და Google Pay ამ გვერდზე ჯერ არ არის ჩართული.', 'Apple Pay and Google Pay are not switched on for this page yet.'],
  'pay.xFail': ['გადახდა ვერ დასრულდა. სცადე ხელახლა ან აირჩიე სხვა მეთოდი.', 'The payment did not go through. Try again or choose another method.'],
  'pay.xDeclined': ['ბანკმა გადახდა არ დაადასტურა. სცადე სხვა ბარათით ან მეთოდით.', 'The bank did not approve the payment. Try another card or method.'],
  'pay.t1': ['ბარათი ჩვენამდე არ მოდის', 'Your card never reaches us'], 'pay.t1d': ['მას ბანკი, PayPal, Apple ან Google ამუშავებს', 'The bank, PayPal, Apple or Google handles it'],
  'pay.t2': ['ერთჯერადი გადახდა', 'One-time payment'], 'pay.t2d': ['თავისით არასდროს განახლდება', 'Never renews by itself'],
  'pay.t3': ['ყველა მოწყობილობაზე', 'On all your devices'], 'pay.t3d': ['პრემიუმი შენს ანგარიშს მიჰყვება', 'Premium follows your account'],
  'pay.h2w': ['გადაიხდი ბანკის ან PayPal-ის დაცულ გვერდზე, ან Apple Pay-ის თუ Google Pay-ის ფანჯარაში.', "You pay on the bank's or PayPal's secure page, or in the Apple Pay or Google Pay sheet."],
  'pay.h3w': ['პრემიუმი ჩაირთვება, როგორც კი სერვერი გადახდას დაადასტურებს — ყველა შენს მოწყობილობაზე.', 'Premium starts as soon as the server confirms the payment — on all your devices.'],
  'pay.faq': ['ხშირი კითხვები', 'Questions'],
  'pay.q1': ['ავტომატურად განახლდება?', 'Does it renew automatically?'], 'pay.a1': ['არა. ვადის ბოლოს პრემიუმი უბრალოდ ითიშება; გაგრძელება თუ გინდა, ხელახლა იყიდი.', 'No. At the end of the period Premium simply stops; to continue, you buy it again.'],
  'pay.q2': ['პრემიუმი უკვე მაქვს — რა მოხდება?', 'I already have Premium — what happens?'], 'pay.a2': ['ახალი პერიოდი ახლანდელის ბოლოს დაემატება — არცერთი დღე არ დაიკარგება.', 'The new period starts where the current one ends — not a day is lost.'],
  'pay.q3': ['სხვა ვალუტის ბარათით შეიძლება?', 'Can I pay with a card in another currency?'], 'pay.a3': ['კი. თანხა ჩამოგეჭრება ზუსტად ნაჩვენებ ვალუტაში, კონვერტაციას კი შენი ბანკი აკეთებს თავისი კურსით.', 'Yes. You are charged in exactly the currency shown; your bank converts it at its own rate.'],
  'pay.q4': ['სად მუშაობს Apple Pay და Google Pay?', 'Where do Apple Pay and Google Pay work?'], 'pay.a4': ['Apple Pay — Safari-ში, iPhone-ზე, iPad-ზე ან Mac-ზე, თუ Wallet-ში ბარათი გაქვს. Google Pay — Chrome-ში ან Android-ზე, Google ანგარიშით, რომელზეც ბარათია მიბმული.', 'Apple Pay — in Safari on an iPhone, iPad or Mac with a card in Wallet. Google Pay — in Chrome or on Android, with a Google account that has a card.'],
  'pay.q5': ['App Store-ის ან Google Play-ის ვერსიაში?', 'In the App Store or Google Play version?'], 'pay.a5': ['მაღაზიიდან დაყენებულ აპში პრემიუმს მაღაზია ყიდის, Apple-ისა და Google-ის წესით; ფასი და პირობები მაღაზიის ფანჯარაში ჩანს.', "In the app installed from a store, the store sells Premium under Apple's and Google's rules; the price and terms are in the store's own window."],
  'pay.q6': ['გადავიხადე, პრემიუმი კი არ ჩაირთო?', 'I paid, but Premium did not start?'], 'pay.a6': ['პრემიუმს სერვერი რთავს, როცა გადახდას ბანკთან გადაამოწმებს. დააჭირე „შეძენის აღდგენას" ქვემოთ — აპი სერვერს ხელახლა ჰკითხავს.', 'The server turns Premium on once it has checked the payment with the bank. Press "Restore purchase" below — the app asks the server again.'],
  'pay.saleEnds': ['ფასდაკლების დასრულება: {d}. შემდეგ ფასი: {p}.', 'The sale ends: {d}. After that the price is {p}.']
});

PD.checkout = (() => {
  const h = PD.h, C = PD.cloud;
  const SVG = (p, s = 22) => '<svg viewBox="0 0 24 24" width="' + s + '" height="' + s + '" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + '</svg>';
  const IC = {
    card: SVG('<rect x="2.5" y="5" width="19" height="14" rx="2.5"/><path d="M2.5 10h19M6 15h4"/>'),
    phone: SVG('<rect x="6.5" y="2.5" width="11" height="19" rx="2.5"/><path d="M11 18.5h2"/>'),
    wallet: SVG('<path d="M4 7.5A2.5 2.5 0 0 1 6.5 5H18v4"/><rect x="3" y="7.5" width="18" height="12" rx="2.5"/><circle cx="16.5" cy="13.5" r="1.2" fill="currentColor"/>'),
    paypal: SVG('<path d="M7.5 20.5 10 4h6.2c2.8 0 4.3 1.7 3.8 4.3-.6 3.2-3 4.7-6 4.7h-2.4l-1.1 7.5z"/>'),
    lock: SVG('<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>', 18),
    shield: SVG('<path d="M12 3 5 6v5c0 4.4 3 8.3 7 10 4-1.7 7-5.6 7-10V6z"/><path d="m9 12 2 2 4-4"/>', 18),
    check: SVG('<path d="m5.5 12.5 4 4 9-9"/>', 13),
    star: SVG('<path d="m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z"/>', 24),
    once: SVG('<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>', 20),
    devices: SVG('<rect x="2.5" y="5" width="13" height="10" rx="1.5"/><path d="M6 18.5h6"/><rect x="16" y="9" width="5.5" height="11" rx="1.5"/>', 20),
    arrow: SVG('<path d="M9 6l6 6-6 6"/>', 18),
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

  let shownReturn = false, walletPaid = false;
  function open(plan) {
    if (PD.billing.native) return PD.premium.paywall();
    PD.app.go('checkout', plan === 'monthly' ? 'monthly' : 'yearly');
  }

  // what Premium adds — premium.js's own list, the first five open, the rest behind "more"
  const FEAT = ['pm.f1', 'pm.f2', 'pm.f3', 'pm.f13', 'pm.f5'], FEAT_MORE = ['pm.f7', 'pm.f8', 'pm.f9', 'pm.f10', 'pm.f11', 'pm.f12', 'pm.f14', 'pm.f4', 'pm.f6'];
  function hero() {
    const li = k => h('li', {}, [h('span', { class: 'pay-ck', html: IC.check }), h('span', { 'data-t': k })]);
    return h('section', { class: 'pay-hero' }, [
      h('div', { class: 'pay-hero-top' }, [h('span', { class: 'pay-hero-ic', html: IC.star }), h('div', {}, [h('h2', { 'data-t': 'pay.heroT' }), h('p', { 'data-t': 'pm.lead' })])]),
      h('ul', { class: 'pay-feats' }, FEAT.map(li)),
      h('details', { class: 'pay-more' }, [h('summary', { text: t('pay.moreF', { n: FEAT_MORE.length }) }), h('ul', { class: 'pay-feats' }, FEAT_MORE.map(li))])]);
  }
  const trust = () => h('ul', { class: 'pay-trust' }, [[IC.lock, 'pay.t1', 'pay.t1d'], [IC.once, 'pay.t2', 'pay.t2d'], [IC.devices, 'pay.t3', 'pay.t3d']].map(([ic, a, b]) =>
    h('li', {}, [h('span', { class: 'pay-trust-ic', html: ic }), h('span', {}, [h('b', { 'data-t': a }), h('small', { 'data-t': b })])])));
  const steps = () => h('section', { class: 'pay-block' }, [h('h2', { class: 'pay-h', 'data-t': 'pay.how' }), h('ol', { class: 'pay-steps' }, ['pay.h1', 'pay.h2w', 'pay.h3w'].map(k => h('li', { 'data-t': k })))]);
  const faq = () => h('section', { class: 'pay-block' }, [h('h2', { class: 'pay-h', 'data-t': 'pay.faq' }), h('div', { class: 'pay-faq' }, [1, 2, 3, 4, 5, 6].map(n =>
    h('details', {}, [h('summary', { 'data-t': 'pay.q' + n }), h('p', { 'data-t': 'pay.a' + n })])))]);

  function page(w, param) {
    const B = PD.billing;
    w.classList.add('pay');
    w.append(h('div', { class: 'row pg-head' }, [h('button', { class: 'btn small backbtn', html: PD.ic.back + '<span class="sr" data-t="back"></span>', onclick: () => PD.app.back('profile') }), h('h1', { 'data-t': 'pay.title', style: 'margin:0' })]));
    if (B.native) { w.append(h('p', { class: 'notice', 'data-t': 'pay.store' }), h('button', { class: 'btn primary', 'data-t': 'pay.open', onclick: () => PD.premium.paywall() })); return; }
    if (!C.session) { w.append(h('p', { class: 'notice', 'data-t': 'pm.needAccount' }), h('button', { class: 'btn primary', 'data-t': 'pay.signin', onclick: () => PD.auth.open() })); return; }

    // Back from the hosted page: say what is known, and only what is known.
    const back = !shownReturn && B.returned; shownReturn = true;
    if (param === 'return' || back) { returnState(w, B, back || 'paypal'); return; }
    // 'paid' only right after the server answered a wallet payment with paid — never from a typed address
    if (param === 'paid' && walletPaid) { walletPaid = false; returnState(w, B, 'paid'); return; }

    const pending = B.pending && B.pending();
    let plan = param === 'monthly' ? 'monthly' : param === 'yearly' ? 'yearly' : (pending && pending.plan) || 'yearly';
    let method = null, options = null, busy = false;
    const ready = {};   // direct wallet id → undefined (not asked) | 'wait' | true | false
    w.append(hero());
    if (PD.premium.active) w.append(h('p', { class: 'pay-active', text: PD.premium.status() }));
    if (PD.premium.banned) { w.append(h('p', { class: 'notice', 'data-t': 'pm.blocked' })); return; }

    const plans = h('div', { class: 'pay-plans', role: 'radiogroup', 'aria-label': t('pay.plan') });
    const summary = h('div', { class: 'pay-sum' });
    const express = h('div', { class: 'pay-xp', role: 'group', 'aria-label': t('pay.express') });
    const xhint = h('p', { class: 'pay-xhint', hidden: true });
    const or = h('p', { class: 'pay-or', 'data-t': 'pay.or' });
    const methods = h('div', { class: 'pay-methods', role: 'radiogroup', 'aria-label': t('pay.method') });
    const msg = h('p', { class: 'ag-msg info', text: t('pm.loadingPay') });
    const go = h('button', { class: 'btn primary big pay-go', disabled: true, onclick: () => pay() });
    const safe = h('p', { class: 'pay-safe' });
    const foot = h('div', { class: 'pay-foot' });
    w.append(h('h2', { class: 'pay-h', 'data-t': 'pay.plan' }), plans,
      h('h2', { class: 'pay-h', 'data-t': 'pay.summary' }), summary,
      h('h2', { class: 'pay-h', 'data-t': 'pay.method' }),
      h('section', { class: 'pay-pay' }, [h('h3', { class: 'pay-sub', 'data-t': 'pay.express' }), express, xhint, or, methods, go, msg, safe]),
      trust(), steps(), faq(), foot);
    const restore = h('button', { class: 'btn quiet', 'data-t': 'pm.restore', onclick: async () => {
      restore.disabled = true;
      try { if (await B.restore()) PD.app.render(); else say(t('pm.noneFound')); } catch (_) { say(t('pm.payError')); } finally { restore.disabled = false; }
    } });
    foot.append(restore);
    const say = (text, info) => { msg.hidden = false; msg.className = 'ag-msg' + (info ? ' info' : ''); msg.textContent = text; };
    const provider = () => options && options.providers.find(p => p.id === method);
    const direct = () => (options && options.express) || [];

    function row(id, icon, title, sub, on, extra) {
      const el = h(on ? 'button' : 'div', on ? { class: 'pay-m', role: 'radio', type: 'button', 'aria-checked': String(method === id), onclick: () => { method = id; draw(); } } : { class: 'pay-m off', 'aria-disabled': 'true' }, [
        h('span', { class: 'pay-m-ic', html: icon }),
        h('span', { class: 'pay-m-tx' }, [h('b', { text: title }), h('small', { text: sub })]),
        extra || null,
        on ? h('span', { class: 'pay-radio', 'aria-hidden': 'true' }) : h('span', { class: 'pay-soon', text: t('pay.soon') })]);
      methods.append(el);
    }
    const marks = () => h('span', { class: 'pay-marks', 'aria-hidden': 'true' }, [h('i', { class: 'mk-visa', text: 'VISA' }), h('i', { class: 'mk-mc' }, [h('em'), h('em')])]);

    /* Apple Pay and Google Pay, each in the one state that is true for it:
       its own button (the server has it on and this device can pay) · TBC's page (the bank has it on) ·
       not on this device · not switched on yet. Drawn apart from draw(): a plan change must not rebuild Google's button. */
    function drawExpress() {
      const bank = ((options.providers.find(p => p.id === 'tbc') || {}).wallets) || [];
      express.innerHTML = '';
      let usable = 0, soon = 0;
      for (const [id, name, where, icon] of [['apple_pay', 'Apple Pay', 'pay.appleWhere', IC.phone], ['google_pay', 'Google Pay', 'pay.googleWhere', IC.wallet]]) {
        const cfg = direct().find(x => x.id === id);
        if (cfg && PD.payWallet && ready[id] === undefined) {
          ready[id] = 'wait';
          PD.payWallet.ready(cfg).then(ok => { ready[id] = ok; if (w.isConnected) { drawExpress(); PD.i18n.apply(express); } });
        }
        if (cfg && ready[id] === true) { express.append(h('div', { class: 'xp-cell' }, [PD.payWallet.button(cfg, () => wallet(cfg))])); usable++; continue; }
        if (cfg && ready[id] === 'wait') { express.append(tile(icon, name, t('pay.xWait'), 'wait')); continue; }
        if (bank.includes(id)) {
          usable++;
          express.append(tile(icon, name, t('pay.xBank'), null, () => { method = 'tbc'; draw(); pay(); }));
          continue;
        }
        if (cfg) express.append(tile(icon, name, t('pay.xNoDev', { w: t(where) }), 'off'));
        else { soon++; express.append(tile(icon, name, t('pay.soon'), 'off soon')); }
      }
      xhint.hidden = soon < 2; xhint.textContent = t('pay.xHint');
      or.hidden = !usable || !options.providers.length;
    }
    function tile(icon, name, sub, state, onclick) {
      const on = !!onclick;
      return h(on ? 'button' : 'div', on ? { class: 'xp-tile', type: 'button', onclick } : { class: 'xp-tile ' + state, 'aria-disabled': 'true' }, [
        h('span', { class: 'xp-ic', html: icon }),
        h('span', { class: 'xp-tx' }, [h('b', { text: name }), h('small', { text: sub })]),
        on ? h('span', { class: 'xp-go', html: IC.arrow }) : null]);
    }

    function draw() {
      const P = options.providers, card = P.find(p => p.kind === 'card'), pp = P.find(p => p.id === 'paypal');
      if (!method) method = card ? card.id : pp ? 'paypal' : null;
      methods.innerHTML = '';
      row(card ? card.id : 'card', IC.card, t('pay.card'), card ? t(card.id === 'tbc' ? 'pay.cardTBC' : 'pay.cardPP') : t('pay.soonCard'), !!card, marks());
      if (pp) row('paypal', IC.paypal, t('pay.paypal'), t('pay.paypalD'), true);

      // the prices shown are the chosen method's; with no card or PayPal at all, the direct wallets' own
      const cur = provider(), priced = cur || direct()[0];
      plans.innerHTML = '';
      for (const k of ['monthly', 'yearly']) {
        const price = priced && priced.prices[k];
        if (!price) continue;
        const sub = k === 'yearly' && priced.prices.monthly ? (() => { const m = Number(price.value) / 12, d = Math.round((1 - m / Number(priced.prices.monthly.value)) * 100); return d > 0 ? t('pm.perYearM', { p: money({ value: m.toFixed(2), currency: price.currency }), d }) : ''; })() : '';
        // struck out: a running sale's regular price, or else, on the yearly plan, what twelve monthly payments really cost
        const sl = PD.billing.sale(price), cmp = !sl && k === 'yearly' ? PD.billing.compare(price, priced.prices.monthly, 12) : null, was = sl || cmp;
        plans.append(h('button', { class: 'pay-plan', role: 'radio', type: 'button', 'aria-checked': String(plan === k), onclick: () => { plan = k; draw(); } }, [
          was ? h('em', { class: 'pay-off', text: t('pay.off', { n: was.pct }) }) : k === 'yearly' && sub ? h('em', { 'data-t': 'pm.best' }) : null,
          h('b', { 'data-t': 'pm.' + k }), h('span', { class: 'pay-price' }, [was ? h('s', { class: 'price-was', 'aria-label': sl ? t('pay.was') : t('pay.cmpYear', { p: money(cmp.regular) }), text: money(was.regular) }) : null, money(price)]),
          cmp ? h('small', { class: 'pay-cmp', text: t('pay.cmpYear', { p: money(cmp.regular) }) }) : null,
          h('small', { text: sub || t(k === 'monthly' ? 'pm.perMonth' : 'pm.perYear') })]));
      }
      if (priced && !priced.prices[plan]) { plan = priced.prices.yearly ? 'yearly' : 'monthly'; return draw(); }

      summary.innerHTML = '';
      if (priced) {
        const price = priced.prices[plan], v = validUntil(plan), sl = PD.billing.sale(price);
        summary.append(...[
          sl ? h('div', { class: 'pay-line sub' }, [h('span', { 'data-t': 'pay.was' }), h('s', { class: 'price-was', text: money(sl.regular) })]) : null,
          sl ? h('div', { class: 'pay-line pay-disc' }, [h('span', { text: t('pay.discount') + ' ' + t('pay.off', { n: sl.pct }) }), h('span', { text: '−' + money({ value: (Number(sl.regular.value) - Number(price.value)).toFixed(2), currency: price.currency }) })]) : null,
          h('div', { class: 'pay-line' }, [h('span', { text: t('pay.item', { p: t('pm.' + plan) }) }), h('span', { text: money(price) })]),
          h('div', { class: 'pay-line sub' }, [h('span', { text: t('pay.valid', { d: fmtValid(v.d) }) }), v.extends ? h('span', { 'data-t': 'pay.extend' }) : null]),
          h('div', { class: 'pay-line total' }, [h('b', { 'data-t': 'pay.total' }), h('b', { text: money(price) })]),
          h('p', { class: 'muted pay-note', 'data-t': 'pm.once' }),
          sl ? h('p', { class: 'pay-note pay-sale-end', text: t('pay.saleEnds', { d: PD.i18n.lang === 'ka' ? sl.until.getDate() + ' ' + ['იანვარი', 'თებერვალი', 'მარტი', 'აპრილი', 'მაისი', 'ივნისი', 'ივლისი', 'აგვისტო', 'სექტემბერი', 'ოქტომბერი', 'ნოემბერი', 'დეკემბერი'][sl.until.getMonth()] + ', ' + String(sl.until.getHours()).padStart(2, '0') + ':' + String(sl.until.getMinutes()).padStart(2, '0') : sl.until.toLocaleString(loc(), { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' }), p: money(sl.regular) }) }) : null,
          price.currency !== 'GEL' ? h('p', { class: 'muted pay-note', text: t('pay.fx', { c: price.currency }) }) : null].filter(Boolean));
      }
      go.hidden = safe.hidden = !cur;
      if (cur) {
        go.innerHTML = IC.lock + '<span>' + PD.esc(t('pay.go', { p: money(cur.prices[plan]) })) + '</span>';
        go.disabled = busy;
        safe.innerHTML = IC.shield + '<span>' + PD.esc(t('pay.safe', { w: t(cur.id === 'tbc' ? 'pay.safeTBC' : 'pay.safePP') })) + '</span>';
      }
      PD.i18n.apply(w);
    }
    async function pay() {
      const cur = provider();
      if (!cur || busy) return;
      busy = true; go.disabled = true; go.classList.add('is-loading'); msg.hidden = true;
      try {
        const result = await B.purchase(plan, cur.id);
        if (result.redirecting) return;   // the browser is leaving for the hosted page
        if (PD.premium.active) PD.app.render(); else if (result.pending) say(t('pm.checking'), true);
      } catch (e) { say(t(e.message === 'billing-not-configured' ? 'pm.noPay' : e.message === 'premium-blocked' ? 'pm.blocked' : 'pm.payError')); }
      busy = false; go.disabled = false; go.classList.remove('is-loading');
    }
    // Called inside the wallet button's click: the sheet opens before anything is awaited.
    async function wallet(cfg) {
      const price = cfg.prices[plan];
      if (busy || !price) return;
      busy = true; msg.hidden = true; go.disabled = true;
      let r = null;
      try { r = await PD.payWallet.pay(cfg, plan, price, t('pay.item', { p: t('pm.' + plan) })); }
      catch (e) { say(t(e && e.message === 'billing-not-configured' ? 'pm.noPay' : e && e.message === 'premium-blocked' ? 'pm.blocked' : 'pay.xFail')); }
      busy = false; go.disabled = false;
      if (!r || r.cancelled || !w.isConnected) return;
      if (r.declined) { say(t('pay.xDeclined')); return; }
      if (r.pending) { say(t('pm.checking'), true); return; }
      try { await C.loadProfile(); } catch (_) {}
      walletPaid = true; PD.app.go('checkout', 'paid', true);
    }
    // Ask for direct wallets: a server without them ignores the flag and answers the v2 catalog.
    B.options().then(result => {
      if (!w.isConnected) return;
      options = result;
      const priced = result.providers.concat(result.express || []);
      if (!priced.some(p => p.prices.monthly || p.prices.yearly)) { say(t('pm.noPay')); return; }
      msg.hidden = true;
      for (const [kind, key] of [['terms', 'pm.termsLink'], ['privacy', 'pm.privacyLink']]) {
        const link = result.policies && result.policies[kind];
        if (link && /^https:\/\//.test(link)) foot.append(h('a', { class: 'btn quiet', href: link, target: '_blank', rel: 'noopener noreferrer', 'data-t': key }));
      }
      drawExpress(); draw();
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
    if (how === 'paid') { icon.className = 'pay-ret-ic ok'; icon.innerHTML = IC.ok; text.textContent = t('pay.paid') + ' ' + PD.premium.status(); done(); return; }
    if (how === 'cancelled') { icon.className = 'pay-ret-ic wait'; text.textContent = t('pay.cancelled'); acts.append(h('button', { class: 'btn primary', 'data-t': 'pay.again', onclick: () => PD.app.go('checkout', null, true) })); return; }
    check();
  }
  return { page, open };
})();
