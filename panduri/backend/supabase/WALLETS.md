# Apple Pay და Google Pay — პირდაპირ გადახდის გვერდზე

გადახდის გვერდზე (`source/src/checkout.js`) Apple Pay-ს და Google Pay-ს სამიდან ერთი მდგომარეობა აქვს.
რომელი გამოჩნდება, ამას სერვერის catalog წყვეტს:

| მდგომარეობა | როდის | რას ხედავს მყიდველი |
|---|---|---|
| **პირდაპირ** | სერვერის `express` სიაში არის **და** მოწყობილობას შეუძლია გადახდა | Apple-ის / Google-ის საკუთარი ღილაკი; ფანჯარა იხსნება იქვე |
| **TBC-ის გვერდზე** | `TBC_WALLETS`-ში არის (ბანკმა გაააქტიურა) | ფილა „TBC ბანკის დაცულ გვერდზე" → მყიდველი TBC-ზე გადადის |
| **მალე** | არც ერთი | გამორთული ფილა „მალე"; ღილაკი არ არის |

`express` ახლა **ყოველთვის ცარიელია**. ასე ჯერ იმიტომ არის, რომ token-ს ვერავინ ჩამოჭრის:
`_shared/billing.js` → `WALLET_PROCESSORS = []` და `wallet-session` / `wallet-pay` აბრუნებს
`billing-not-configured`-ს. ჩასართავად საჭიროა ქვემოთ ჩამოთვლილი ყველაფერი.

## TBC Checkout-ის ჩართვა

1. [TBC-ის Go LIVE მოთხოვნების](https://developers.tbcbank.ge/docs/checkout-go-live) მიხედვით შეავსე `source/pwa/terms.html`-ში მიმწოდებლის მონაცემები, დაადასტურე დაბრუნების წესი და გამოაქვეყნე Terms და Privacy გვერდები. ბანკთან დაადასტურე, მიიღებს თუ არა ამ საიტის `github.io` მისამართს.
2. TBC-ის [Merchant Dashboard](https://developers.tbcbank.ge/docs/checkout-merchant-dashboard-and-credentials)-ში მიუთითე callback URL. Premium-ის return URL-ს სერვერი ადგენს `APP_URL`-იდან პარამეტრით `?payment=tbc`, ბაზრობის რეკლამისთვის კი იყენებს `?payment=market-tbc`. Callback URL არის `<SUPABASE_URL>/functions/v1/payment-callback?provider=tbc`.
3. [Developer Portal](https://developers.tbcbank.ge/docs/get-apikey-and-secret)-ის developer app-ის `apikey` ჩაწერე Supabase-ის **Edge Functions → Secrets**-ში სახელით `TBC_API_KEY`. Merchant Dashboard-ის მონაცემები ჩაწერე სახელებით `TBC_CLIENT_ID` და `TBC_CLIENT_SECRET`. `TBC_WALLETS`-ში მძიმით ჩამოწერე მხოლოდ ბანკის მიერ ჩართული მეთოდები: `apple_pay`, `google_pay`.
4. მიუთითე `TERMS_URL` და `PRIVACY_URL`. ორივე URL უნდა იყოს საჯარო და HTTPS. ამჟამინდელი ჰოსტინგის მისამართებია `https://yanx447.github.io/index.html/panduri/app/terms.html` და `https://yanx447.github.io/index.html/panduri/app/privacy.html`. სხვა დომენზე გადასვლისას განაახლე ასევე `APP_URL` და ბანკთან რეგისტრირებული მისამართები.
5. მფლობელის თანხმობის შემდეგ გაუშვი `supabase functions deploy billing market payment-callback`. ბანკთან შეთანხმებულ გარემოში გადაამოწმე checkout, callback და ანგარიშის Premium ვადა. `billing_orders` ინახავს შეკვეთას. წარმატებული აქტივაციის ჩანაწერი არის `purchases`-ში (`provider = 'tbc'`, `payment_id = billing_orders.provider_id`).

## 1. ჯერ გადასაწყვეტია: ვინ ჩამოჭრის token-ს (processor)

Apple Pay ან Google Pay ფულს თვითონ არ ჩამოჭრის. ის გვერდს **დაშიფრულ token-ს** აძლევს და მას processor-ი (ბანკი ან gateway) ამუშავებს.
ბანკს (TBC ან BOG) უნდა ჰკითხო:

* იღებს თუ არა მათი e-commerce API **Apple Pay token-ს პირდაპირ** (merchant-side integration),
  თუ Apple Pay-ს მხოლოდ **თავის hosted გვერდზე** აჩვენებს;
* არის თუ არა ბანკი **Google Pay-ის მხარდაჭერილ gateway-ებს** შორის და რა არის მისი `gateway` id;
* ვინ ქმნის Apple-ის **Payment Processing Certificate**-ის CSR-ს (ჩვეულებრივ processor-ი);
* მუშაობს თუ არა ლარში (GEL).

თუ ბანკი მხოლოდ hosted გვერდს გვთავაზობს, მარტივი გზა ისაა, რაც უკვე აწყობილია:
ბანკი გაააქტიურებს და სერვერის secret-ში ჩაიწერება `TBC_WALLETS=apple_pay,google_pay`.
ამ შემთხვევაში Apple Developer-ის merchant-ის აწყობა არ გვჭირდება.

## 2. Apple Pay (Apple Developer ანგარიშიდან)

1. **Merchant ID**: Certificates, Identifiers & Profiles → Identifiers → Merchant IDs, მაგ. `merchant.com.yanx.panduri`.
2. **დომენის დადასტურება**: Apple-ისგან მიღებული ფაილი უნდა იდოს **დომენის ფესვში**:
   `https://<დომენი>/.well-known/apple-developer-merchantid-domain-association`.
   ⚠️ ახლანდელ ვებ-ვერსიას (`yanx447.github.io/index.html/...`) ფესვი სხვა repo-ში აქვს (`yanx447.github.io`).
   საჭიროა ან იქ ფაილის დადება, ან საკუთარი დომენი (მაგ. studioplus.ge).
3. **Merchant Identity Certificate**: სერვერს სჭირდება Apple-ის `validationURL`-ზე mTLS-ით მისამართად.
   ⚠️ შესამოწმებელია, უჭერს თუ არა Supabase Edge Function მხარს client certificate-ს. თუ არ უჭერს, ეს ნაბიჯი processor-მა
   ან სხვა სერვერმა უნდა შეასრულოს.
4. **Payment Processing Certificate**: processor-ის CSR-ით (იხ. ნაწ. 1).

Secrets: `APPLE_PAY_MERCHANT_ID`, `APPLE_PAY_MERCHANT_CERT`, `APPLE_PAY_MERCHANT_KEY`, `APPLE_PAY_DOMAIN`.

## 3. Google Pay

1. **Google Pay & Wallet Console** → ბიზნეს პროფილი → **Merchant ID**.
2. `TEST` გარემო merchant ID-ის დადასტურების გარეშე მუშაობს. `PRODUCTION`-ისთვის Google-ს გვერდის screenshot-ები ეგზავნება.
3. Gateway: `GOOGLE_PAY_GATEWAY` და `GOOGLE_PAY_GATEWAY_MERCHANT_ID` processor-ისგან.

Secrets: `GOOGLE_PAY_MERCHANT_ID`, `GOOGLE_PAY_GATEWAY`, `GOOGLE_PAY_GATEWAY_MERCHANT_ID`, `GOOGLE_PAY_ENV` (`TEST` | `PRODUCTION`).
საერთო: `WALLET_PROCESSOR` და, სურვილისამებრ, `WALLET_MERCHANT_NAME` (ნაგულისხმევად `Panduri`).

## 4. კოდში დასამატებელი (processor-ის არჩევის შემდეგ)

* `WALLET_PROCESSORS`-ში processor-ის სახელი.
* `wallet-session`: Apple-ის merchant validation. `validationURL`-ის host უნდა იყოს Apple-ის `apple-pay-gateway*.apple.com`.
* `wallet-pay`: token → processor. ფასი იგივე `catalog`-იდან აიღება (ბრაუზერის თანხას არ ვენდობით). წარმატებისას
  `billing_orders` + `fulfill_web_purchase`, ზუსტად ისე, როგორც TBC/PayPal-ზე. პასუხი: `{ paid }` | `{ pending: true }` | `{ paid: false }`.
* `pwa/privacy.html`: Google Pay-ის ჩართვისას გვერდი `pay.google.com`-იდან სკრიპტს ტვირთავს. ეს კონფიდენციალურობის პოლიტიკაში უნდა ჩაიწეროს.

## რაც არ იცვლება

* **App Store-ისა და Google Play-ის აპში** პრემიუმი (ციფრული შინაარსი) მაღაზიის შიდა შესყიდვით იყიდება.
  Apple-ისა და Google-ის წესით, ასეთ შინაარსზე Apple Pay ან Google Pay აპის შიგნით ვერ გამოიყენება.
  პირდაპირი wallet-ები მხოლოდ ვებზე, PWA-სა და desktop-ზე ჩანს.
* Desktop (Electron) აპში Apple Pay არ მუშაობს (`ApplePaySession` იქ არ არის). გვერდი იქ წერს „ამ მოწყობილობაზე არ არის".
