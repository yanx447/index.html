# ფანდური — Panduri Learning

Learn the Georgian three-string panduri on your **real instrument**: the app shows what to play, waits, and listens through the microphone. Camera mode puts your own picture behind the chords, notes and rhythm.

* Web / installable PWA: `app/` (served by GitHub Pages at `/panduri/app/`).
* Android phones, tablets and Android TV: built automatically by `.github/workflows/panduri-android.yml` on every push to `panduri/**`.
  The APK is published as the GitHub Release **`panduri-android-latest`** — open it on the device and install.
* iOS app: `bash scripts/native-setup.sh ios` on a Mac (or Codemagic, like Sami Simi) — needs an Apple Developer account to install on a phone.

`app/` is the build output of the Panduri Learning source (`build.py`); edit the source, rebuild, and copy `dist/app` here
(keep your own `app/js/config.js`).

## Accounts, community, VIP — server setup (Supabase, free tier is enough to start)

1. Create a project at supabase.com.
2. SQL Editor → paste and run [`supabase/schema.sql`](supabase/schema.sql).
3. Authentication → Providers: turn on **Email**, **Phone** (needs an SMS provider, e.g. Twilio), **Google**, **Facebook**
   (each needs its own client id/secret from Google Cloud / Meta for Developers).
4. Authentication → URL Configuration → Redirect URLs: add
   `https://yanx447.github.io/index.html/panduri/app/` and `com.yanx.panduri://auth`.
5. Copy the **Project URL** and the **publishable key** (`sb_publishable_…`, Settings → API Keys; the older
   "anon public" key works too) into [`app/js/config.js`](app/js/config.js) (`supabaseUrl`, `supabaseKey`) and commit.
   The Android app is rebuilt automatically. Never put a secret / `service_role` key in the app.
6. Sign up in the app with your own account, then in the SQL Editor run
   `update public.profiles set role = 'admin' where email = 'your@email';`
   — Profile → Administration now lets you give or remove VIP (1 month, 1 year, forever) and make other admins.

## Payments (monthly / yearly)

`app/js/config.js` → `prices` (what the paywall shows) and `payments` (hosted checkout links, e.g. Stripe Payment Links).
The checkout gets the account id as `client_reference_id`; a payment webhook (Supabase Edge Function) must then set
`profiles.vip_until` / `plan` for that id. Until that exists, VIP is granted by the admin.
Google Play requires Play Billing for digital subscriptions sold inside an app distributed through Play.

## Video calls

Peer-to-peer (WebRTC) with public STUN. Some mobile networks need a TURN server: add it to `config.js` → `turn`.
