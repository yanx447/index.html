# Panduri billing

**Status (2026-11-09):** PayPal Live app, encrypted Supabase configuration, billing migrations and all three billing Edge Functions are deployed. PayPal webhook registration is verified for exactly order-approved and capture-completed events. Local app and installers are rebuilt. No real purchase, authenticated checkout end-to-end test, new public frontend deployment, or signed store release has been verified. TBC and native store billing remain unconfigured.

## Merchant location and where money goes

For the owner living in Georgia, checked 2026-11-08:

| Channel | Payment implementation | Settlement |
| --- | --- | --- |
| Website, PWA, desktop | TBC hosted Checkout: card, Apple Pay, Google Pay, once activated by the bank | Bank account named in the owner's TBC merchant agreement |
| Website, PWA, desktop | PayPal Business Orders API | Owner's PayPal merchant account; withdrawals use the eligible method offered by PayPal for that account |
| iOS App Store | Apple In-App Purchase through RevenueCat | Primary bank account configured in App Store Connect, after applicable fees/taxes |
| Android Google Play | Google Play Billing through RevenueCat | Requires a supported merchant payments profile. **Georgia currently supports developer registration but not merchant registration.** This cannot be enabled with a Georgian merchant profile. |

Google sign-in is not a merchant account or a payout destination. Apple registration requires an Apple Account. Do not register a false foreign address. A genuinely eligible merchant/entity in a supported country needs its own verification. RevenueCat manages purchase state; it does not receive the store proceeds on the owner's behalf.

Stripe code from the initial web integration remains in `checkout/` and `stripe-webhook/` for an eligible future merchant, but is not offered by the new app payment chooser. Georgia is absent from Stripe's supported merchant countries. Do not deploy those legacy endpoints for this Georgian setup.

## Account steps the owner must complete

1. PayPal Business: https://www.paypal.com/ge/webapps/mpp/account-selection . Business selection and the registration form have been opened; no account has been created. The owner must enter matching identity details, choose a password, accept terms, verify phone/email, and complete merchant verification. Confirm receiving commercial payments and withdrawal eligibility before going live.
2. TBC e-commerce: https://tbcbank.ge/en/business/card-payments/e-commerce . Apply as an eligible registered taxpayer/individual or company, establish the merchant agreement and settlement account, and request card, Apple Pay and Google Pay. Registration cannot be completed solely through Google login.
3. Apple Developer: https://developer.apple.com/programs/enroll/ . The owner must enroll, complete identity verification, accept the paid apps agreement and supply tax/banking details in App Store Connect. Fees and contract acceptance require the owner.
4. Google Play Console: https://play.google.com/console/signup . A Georgian developer account can distribute apps but cannot currently create a merchant profile. Resolve merchant eligibility before paid Play release. Do not substitute external checkout inside the Play build without a specifically applicable, approved alternative billing program.
5. RevenueCat: https://app.revenuecat.com/ . Create a project, connect the verified store apps, configure credentials and entitlements. Registration/terms and any new credential grant require the owner.
6. Existing Supabase project: the previous browser access was declined; deployment is still blocked. Do not send passwords or secret keys in chat. Supply secrets directly in the server dashboard after access is permitted.

## Deploy server

Use `source/supabase/schema.sql` for a **new** backend only. It contains the existing owner placeholder and admin rules; do not re-run it over the live owner configuration. Inspect the live schema first. For an existing project apply only these migrations, in order, through the SQL Editor or reviewed migration tooling:

- `supabase/migrations/202611080001_payments.sql`
- `supabase/migrations/202611080002_multiplatform_billing.sql`

Set environment values from `.env.example` in Supabase secrets. `APP_URL` includes `/index.html/panduri/app/`; using only the domain breaks checkout return routing. Keep every private key out of `source/`, `app/`, Git, and chat. `SUPABASE_SERVICE_ROLE_KEY` is used only by the Edge Functions. The public RevenueCat SDK keys are delivered by the authenticated catalog endpoint, not committed in the application source.

From this backend directory:

```sh
supabase link --project-ref tecynfffgjgrcafmfqty
supabase functions deploy billing
supabase functions deploy payment-callback
supabase functions deploy store-webhook
```

Gateway JWT checks are off in `config.toml` because `billing` validates the bearer token against Supabase Auth itself, while callbacks validate through their payment provider. Do not expose a service-role RPC directly to clients.

TBC callback: `https://tecynfffgjgrcafmfqty.supabase.co/functions/v1/payment-callback?provider=tbc` . Register it on the TBC merchant dashboard. Callbacks never trust submitted status: the server fetches the merchant's payment, checks saved order/account, exact amount/currency, and merchant reference. Only `Succeeded` fulfills; preauthorization is not payment. Ensure TBC permits your callback infrastructure and verify the response shape with merchant sandbox credentials. The yearly GEL 119.99 exceeds the default GEL 100 test allowance; arrange the bank's test allowance before that test.

PayPal callback: `https://tecynfffgjgrcafmfqty.supabase.co/functions/v1/payment-callback?provider=paypal` . Subscribe to `CHECKOUT.ORDER.APPROVED` and `PAYMENT.CAPTURE.COMPLETED`, save the webhook ID, and configure matching merchant ID. PayPal prices must be explicitly approved in supported currency (USD/EUR); no silent conversion from GEL. The authenticated buyer return checks order ownership, captures the approved order, re-reads it and checks the capture. The webhook verifies PayPal's signature via the PayPal verification API and re-reads payment state. A signed order-approval event also captures a saved approved order, so closing the return page does not lose the purchase. Refunds/disputes are an outstanding manual operational procedure: process in PayPal/TBC and use the owner's premium block control. Automatic web refund/dispute reconciliation is not implemented; resolve this workflow before production launch.

## Store products and native setup

App ID / bundle ID: `com.yanx.panduri`.

Create an auto-renewing monthly and yearly subscription in each eligible store. Suggested IDs: `premium_monthly`, `premium_yearly`. Choose the final store pricing, required metadata and review screenshots there. In RevenueCat create entitlement **`premium`**, attach both products, and place them in the current offering as package types `MONTHLY` and `ANNUAL`. Configure restore behavior to keep purchases with their original identified app user, and verify cross-account restore behavior in sandbox. The app identifies customers with the Supabase UUID and never sends the owner's email.

Set store-specific public SDK keys and a server RevenueCat secret key with access to customer information. Supply `TERMS_URL` and `PRIVACY_URL` pointing to real published HTTPS pages; native purchases remain unavailable until both exist. Review the privacy disclosures for purchase processing by RevenueCat and the stores. Do not claim that payment information stays entirely on device.

Register `https://tecynfffgjgrcafmfqty.supabase.co/functions/v1/store-webhook` in RevenueCat with authorization header `Bearer <REVENUECAT_WEBHOOK_TOKEN>`. The server fetches the latest customer state for every event and applies the provider's timestamp and absolute expiry. Older snapshots are ignored. Sandbox transactions are rejected in production (`BILLING_ALLOW_SANDBOX=false`). Use a separate staging project for Apple sandbox / Play license testing. Store refunds and expiration clear the store entitlement; paid time and owner-granted VIP remain separate sources of access.

The native dependency is pinned to `@revenuecat/purchases-capacitor@11.3.3` (Capacitor 7 compatible). `scripts/native-setup.sh` synchronizes the plugin and uses Android `singleTop` so a banking-app verification return does not cancel the purchase. Store builds never navigate to a card/PayPal checkout. They display localized store prices, auto-renewal disclosure, Restore, subscription-management, and configured policy links.

Build the web app from `source/build.py`, copy `source/dist/app/.` to `app/`, then run `npm run android` / `npm run ios` from the Panduri directory to generate/sync the native projects. Xcode/Gradle signing, device builds, sandbox purchase tests, store metadata, privacy declarations, and final release remain outstanding. Direct-distribution Electron installers also need regeneration for app changes. Agents do not commit/push per repository rules.

## Verification

```sh
npm ci
npm test
npm run test:stripe
npx deno check --node-modules-dir=auto supabase/functions/billing/index.ts supabase/functions/payment-callback/index.ts supabase/functions/store-webhook/index.ts
```

Automated coverage uses mocked provider responses plus real embedded Postgres (PGlite): account/recipient/amount binding, pending vs captured state, native routing and restore, sandbox/refund filtering, exact-once fulfillment, bans, stale state and client SQL permission denial. This is not a live end-to-end payment test and does not replace store sandbox/device testing.

Before launch test successful/declined/cancelled payments, missing/delayed/duplicate callbacks, provider outages, wrong account, expired login, app restart after purchase, restore on another device, store renewal/cancellation/refund, and owner bans. Ensure callbacks retry successfully after a database outage. Web refunds/disputes currently require manual access removal. Bundled offline client features can be inspected or modified by a user; protect any premium server data/operations with `public.is_premium(auth.uid())` and RLS as well. Payment processing is not DRM for bundled assets.

## Official references

- Apple digital features and IAP: https://developer.apple.com/app-store/review/guidelines/#in-app-purchase
- Apple settlement: https://developer.apple.com/help/app-store-connect/getting-paid/overview-of-receiving-payments
- Google billing policy: https://support.google.com/googleplay/android-developer/answer/9858738
- Google merchant countries (Georgia: no): https://support.google.com/googleplay/android-developer/answer/9306917
- TBC methods and activation: https://developers.tbcbank.ge/docs/payment-methods
- TBC merchant eligibility: https://tbcbank.ge/en/business/card-payments/e-commerce
- PayPal Orders API: https://developer.paypal.com/api/orders/v2
- RevenueCat Capacitor: https://www.revenuecat.com/docs/getting-started/installation/capacitor
- RevenueCat server sync: https://www.revenuecat.com/docs/integrations/webhooks
- Stripe merchant availability: https://stripe.com/global

## Latest local verification (2026-11-08)

20 provider/client tests passed; the embedded Postgres test also passed (21 total). The three Edge Function entry points passed `deno check`. Additional DOM checks passed for unavailable payments, web provider selection/currency prices, native subscription disclosure, policy links and selected-plan purchase. Legacy Stripe mocks passed too.

The full build was attempted twice, including a fresh staging output directory. Source generation reached the app media copy, then blocked on the existing `app/media/bani/music-80.mp3` filesystem read/copy. After the media copy resumed, the next assets directory copy also blocked and the build was interrupted. No generated app deployment, installer regeneration, commit or push was performed. Regenerate `source/dist/` after the disk issue is resolved; it must not be used as a release artifact from this interrupted run. The original published `app/` files were not edited.

## PayPal account and price update

The owner completed the individual-account Business conversion flow; the PayPal Business dashboard is accessible. This does not establish completed KYC, bank linking or API activation. Developer Dashboard and Apps & Credentials return `unauthorized`; developer reauthorization is required. No API credentials have been obtained or deployed.

The owner requested the EUR equivalents of GEL 14.99 / GEL 119.99. Prepared fixed PayPal prices: EUR 5.17 monthly and EUR 41.38 yearly. Basis: NBG EUR 1 = GEL 2.8998, effective 2026-11-07, retrieved for 2026-11-08 from https://nbg.gov.ge/gw/api/ct/monetarypolicy/currencies/en/json/?date=2026-11-08 . These are rounded retail prices, not a guaranteed PayPal settlement rate. Fees and withdrawal conversion are separate. Only the example configuration was updated; live server prices are not set.

## Desktop recovery verification (2026-11-09)

After moving the repository from SSD to Desktop, `python3 build.py` completed successfully. The complete generated app was copied to `../app/`; its billing module matches the source. The artifact is 15,153,467 bytes (below 16 MiB). All 22 billing tests, legacy Stripe mocks, and all three Edge Function type checks passed. Corrected the client test fixture to report the requested platform and added Electron hosted-checkout coverage.

Read-only verification in the live Supabase dashboard found only `OPENROUTER_API_KEY` in Custom Secrets and only the `sima` Edge Function. No PayPal, TBC, RevenueCat or APP_URL custom secrets are configured. Billing functions have not been deployed. No secret values were revealed or changed. Live payment activation still requires merchant credentials, billing migrations and deployment, then provider sandbox verification.

The macOS arm64/x64 DMGs and Windows Setup EXE were regenerated successfully in `საინსტალაციო/`. macOS builds are ad-hoc signed and not notarized; these are local test installers, not signed store releases. The owner selected PayPal Business for initial activation. Developer Dashboard currently redirects to PayPal login; owner sign-in is required before API application setup can be inspected.

## PayPal connection completed (2026-11-09)

The owner explicitly authorized transferring the Panduri PayPal Client ID/Secret to the existing Supabase project and connecting its payment notifications. Stored server configuration: `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, `PAYPAL_ENV=live`, `PAYPAL_MERCHANT_ID`, `PAYPAL_WEBHOOK_ID`, `PAYPAL_CURRENCY=EUR`, `PAYPAL_MONTHLY_PRICE=5.17`, `PAYPAL_YEARLY_PRICE=41.38`, and the deployed-path `APP_URL`. These values are server-side; no private credentials were placed in app/source or this document.

Inspected live profiles/purchases columns and existing functions first, then applied the two billing migrations in one transaction through SQL Editor. Existing owner configuration was preserved. Deployed `billing`, `payment-callback`, and `store-webhook` through the dashboard using single-file compositions of the repository's shared modules and entrypoints. Gateway legacy JWT checking is off: billing authenticates through Supabase Auth, PayPal callbacks verify provider signatures, and RevenueCat callbacks require their dedicated token. RevenueCat secrets are absent, so native billing remains disabled.

PayPal webhook initially returned HTTP 403 after the developer session expired. After owner sign-in, registration succeeded. Verified the saved subscription contains exactly `CHECKOUT.ORDER.APPROVED` and `PAYMENT.CAPTURE.COMPLETED` for the Supabase payment-callback endpoint. Screenshot: `verification/paypal-webhook.png`.

Live endpoint smoke checks passed: anonymous billing POST -> 401 `sign-in-required`; billing GET -> 405 `method`; unknown callback provider -> 400 `invalid-provider`; unconfigured store webhook -> 503 `retry` (fails closed with RevenueCat configuration absent). These checks do not validate a real buyer capture or PayPal API authentication. Complete authenticated checkout and provider sandbox testing before treating this as a verified paid release. No payment was made, no user access was granted for testing, and no Git commit/push was performed. The public frontend still requires publication of the regenerated `app/` files.

## Web payment release (2026-11-09)

Owner authorized publishing the updated frontend and testing checkout. Prepared `codex/paypal-release` in `/tmp/panduri-paypal-release` from the latest remote `main` to preserve the published Sima runtime and unrelated local changes. Published commit `3c2829215c5ce0943fc592456177dec77f2710b6` through the connected GitHub plugin because shell Git has no push credentials. The release tree exactly matches the locally reviewed commit tree.

The release contains only billing-related frontend/source changes, privacy disclosures, billing client tests and cache-versioning/build changes. Existing i18n compatibility and a 65-second billing timeout were added in the release. Eight billing client tests passed, as did browser DOM checks for EUR prices, provider/plan selection, checkout availability, no unverified Premium access, and absence of JavaScript errors. Checked service-worker precache URLs, generated/source equality and preservation of the remote Sima module. Live checkout verification follows the GitHub Pages deployment.


## Community and Sima's notifications (2026-11-09)

**Status:** written and tested locally (`node --test social-sql.test.mjs push.test.mjs`; the Web Push encryption was also decrypted by the independent `http_ece` library). **Not yet applied to the live project.** The live database (checked 2026-11-09) has neither `202611080003_moderation.sql` nor `202611090001_device_sessions.sql`; the social migration needs the moderation one first.

Apply, in order, to the live project:

1. `supabase/migrations/202611080003_moderation.sql`
2. `supabase/migrations/202611090001_device_sessions.sql`
3. `supabase/migrations/202611090002_social.sql` — nicknames, friends, the feed, reactions, comments, chat media and reactions, notifications, push devices, the `social` storage bucket (private, 50 MB per file), `pg_net`, a generated hook secret in Vault, and four `pg_cron` jobs (`sima-reminders` every 15 min, `sima-push-sweep` every 5 min, `sima-daily-top` 14:00 UTC, `social-media-cleanup` 03:30 UTC).

Then deploy the function:

```sh
supabase functions deploy push    # verify_jwt = false (config.toml): the database calls it with the Vault secret
```

What happens: every row written to `public.notifications` (by the database's own triggers — never by the app) makes the database call `push` once per statement. `push` reads the account's devices and settings and sends each notification:

| Device | How it arrives | Needs |
|---|---|---|
| Browser, installed PWA (Chrome, Edge, Firefox; Safari 16.4+ when added to the Home Screen) | Web Push, also when the app is closed | Nothing more. The VAPID key pair is generated by `push` on first use and kept in `server_config`; the private half never leaves the server. `GET /functions/v1/push?vapid=1` returns the public half. |
| Desktop app (Electron) | While the app is running (it polls every 20 s) | Nothing. Electron has no push service. |
| Android / iOS app (Capacitor) | Inside the app when it is opened | To reach a closed app: a Firebase project, `@capacitor/push-notifications` + `google-services.json` in the native build, the APNs key uploaded to Firebase for iOS, and the service account JSON as the `FCM_SERVICE_ACCOUNT` secret. The function already sends through FCM HTTP v1 when that secret exists. Do not add the plugin before Firebase is configured: `register()` crashes an Android build without `google-services.json`. |

Optional secret: `PUSH_SUBJECT` (an `https://` URL or `mailto:` for the VAPID `sub` claim). Without it the origin of `APP_URL` is used. Never the owner's e-mail.

Chats also carry the app's own stickers (drawn in the app, sent by name) and GIFs. GIFs need `supabase functions deploy gifs` and a `GIPHY_API_KEY` secret (a free key from https://developers.giphy.com/ — the owner creates it). Until that secret exists the app does not show the GIF choice at all.

The owner announces a new version from Settings → "Tell everyone about an update" (`announce_release`, owner-only by `is_owner()`); every member gets Sima's "The app has been updated" once per version.


## Card payment and the checkout page (2026-11-11)

**Status:** written and tested locally (backend `npm test`: 32 passed; `qa/billing.cjs` + `qa/billing-navigation.cjs`: 9 passed; `deno check` of `billing` and `payment-callback` passed). **Deployed 2026-11-11:** `app/` (commit 9164280) and the `billing` Edge Function (version 3). `PAYPAL_GUEST_CARD` is not set yet, so "Bank card" still shows as "soon"; TBC and `TBC_WALLETS` are not configured, so Apple Pay / Google Pay show as "soon". No real card payment has been made.

The web app (website, PWA, desktop) now has a checkout page (`source/src/checkout.js`, route `checkout`): plan, method, total with the date Premium would run until, one pay button. The paywall sheet on the web leads to it; store builds keep paying in the store. Card numbers are never typed in the app — always on TBC's or PayPal's own page.

The server decides which card route exists (`catalog`, sent only to clients that ask with `v: 2`; older clients keep the old list):

| Configured | "Bank card" on the page | Apple Pay / Google Pay |
| --- | --- | --- |
| `TBC_API_KEY` + `TBC_CLIENT_ID` + `TBC_CLIENT_SECRET` | TBC hosted page, GEL 14.99 / 119.99 | Selectable for each wallet listed in `TBC_WALLETS`; it opens the same TBC page, where the buyer picks it |
| No TBC, PayPal configured, `PAYPAL_GUEST_CARD=true` | PayPal's card form (`landing_page: GUEST_CHECKOUT`), EUR prices; stored, verified and webhooked as an ordinary PayPal order | "Soon" (not a button) |
| Neither | "Soon" (not a button) | "Soon" |

Before setting `PAYPAL_GUEST_CARD=true`: in PayPal → Account settings → Website payments → Website preferences, turn on **PayPal account optional**, then make one real small order from a browser where you are signed out of PayPal and confirm the card form appears. PayPal decides guest-checkout eligibility per buyer (country, risk), so some buyers may still be asked to sign in or create an account; PayPal's documentation does not list Georgia-merchant eligibility explicitly.

Apple Pay: TBC supports it on its hosted page once the bank activates it for the merchant (and Apple Pay on the web needs the merchant domain verified through TBC). After the bank confirms, set `TBC_WALLETS=apple_pay` (and `google_pay`) — no app change is needed. Inside the iOS store build, digital Premium must still be sold through Apple In-App Purchase, not through card checkout.

Deploy order: copy the built `app/` first, then redeploy `billing` (the function is backward compatible either way). No database migration is needed: PayPal card orders are saved with provider `paypal`.


## The community's own place: profiles, following, reposts, history, search (2026-11-16)

**Status:** written and tested locally (`node --test community-sql.test.mjs`, with the rest of the SQL suite: 8 passed). **Applied to the live project on 2026-11-16** by the owner through the SQL Editor (Claude Code's apply was declined twice by its confirmation step). Verified read-only afterwards: the four tables, the three columns, all 16 functions, `feed()` answering `song`, `saved`, `reposted`, `following`, the public `avatars` bucket (2 MB) with its two policies, the hashtag index; `anon` cannot call `follow()`, `authenticated` cannot write `follows` directly; `profile_card()`, `feed_list()`, `feed('following')`, `tag_search()` and `search_users()` answer as a signed-in member (checked inside a rolled-back transaction).

`supabase/migrations/202611160001_community_profiles.sql` — for a new backend, apply it once through the SQL Editor. It needs only `202611090002_social.sql`, which the live server has. It is additive and can be run twice.

What it adds: `profiles.bio` (160 characters, word filter) and `set_bio()`; a public `avatars` bucket (2 MB, JPEG/PNG/WebP, each member writes only their own folder) and `set_avatar()`; `follows` (one way, as in TikTok) with `follow()`, `follow_list()` and a notification in the receiver's language; `feed_reposts` with `repost()` and `reposts_clear()`; `feed_shares` with `share_out()` (a share out of the app counts once per person); history (`feed_views.at` is now the last time watched, `hidden` + `history_clear()`); `hashtags()` with a GIN index, `tag_search()`, `search_users()`; `profile_card()` (followers, following, and likes as the sum over the videos that exist now — a deleted video takes its likes with it); `feed_list()` for a profile's and a search's lists; `feed()` learns `following` and answers `reposted` and `following`.

It also carries the parts of `202611100001_reels.sql` the live server never received (the song's name, saved videos, the `feed()` that knows them) **without** that file's one-minute limit: the camera films up to ten minutes and the live server has never limited the length. Do not apply `202611100001_reels.sql` after it.

Until it is applied the app says so where it matters ("switches on once the server has been updated"): my own profile and someone else's still show their videos from `feed()`, the + on a video still sends a friend request, and copying a link or sending to a friend in chat works. Search, following, reposts, the bio and the profile photo wait for the server.

Found on the way: `source/supabase/schema.sql`'s `social_file_mb()` was `language sql`, so creating it needed `storage.buckets` to exist first; three SQL tests (moderation, reels, social) failed on that. It is plpgsql now — the same answer, the table looked up when it is called.


## ფანდურის ბაზარი — the Panduri Marketplace (2026-11-16)

**Status:** written and tested locally. **Not applied to the live project, the `market` function is not deployed, no real payment was made.** Before this, no marketplace existed in the repository or in the live database (checked read-only on 2026-11-16: 32 public tables, none of them `market_*`), so the base marketplace was built together with the four packages.

What it is: members sell instruments to each other. **Every listing is paid** (the owner's decision, 2026-11-16; there is no free listing). One of four packages puts it in the sponsored carousel, among the featured instruments and in the sponsored places of matching searches. **The package's length is also the listing's whole lifetime**: when it ends, the entire listing is deleted.

| Package | Georgian | Price | PayPal | Lifetime |
| --- | --- | --- | --- | --- |
| `ad24` | 24-საათიანი რეკლამა | GEL 2.99 | EUR 1.03 | 24 h |
| `ad72` | 3-დღიანი რეკლამა | GEL 6.99 | EUR 2.41 | 72 h |
| `ad168` | კვირის რეკლამა | GEL 14.99 | EUR 5.17 | 168 h |
| `ad720` | თვის რეკლამა | GEL 29.99 | EUR 10.34 | 720 h |

**Prices lowered for good (owner, 2026-11-16).** The owner wanted a permanent "9.99 instead of 4.99". A struck-out price that is never charged is a false reference price: Georgian consumer protection forbids it, and Apple and Google refuse it. So the low prices are the real prices instead, with no struck-out price. The app compares honestly, e.g. "≈ 1 ₾ a day" for the monthly package, or the yearly Premium's monthly price against the monthly plan. Premium is **GEL 4.99 / month, 39.99 / year** (`billing.js` `PLANS`); on PayPal **EUR 1.72 / 13.79** (secrets `PAYPAL_MONTHLY_PRICE` / `PAYPAL_YEARLY_PRICE`). EUR prices are at NBG 2026-11-07, EUR 1 = GEL 2.8998. A server that already ran the first marketplace prices needs `202611170003_lower_prices.sql`.

Prices live in `public.market_packages`. The owner changes them in the app (Marketplace → shield icon → Packages, `is_owner()` only). A package's length is fixed by a check constraint. The `free` row remains, switched off, only as history.

### Discounts (Marketplace and Premium)

The owner runs them from Profile → **ფასდაკლებები** (route `market:sales`, `is_owner()` on the server). Each package and each Premium plan has a sale price, an optional PayPal sale price, and an **end date**. While a sale runs:
* the server charges the sale price;
* the app shows the regular price struck out, the percentage, and when the sale ends and what the price will be after it.

After the end the regular price is charged again by itself, and no struck-out price remains. A sale must be lower than the regular price and end within a year. This keeps the struck-out price a price buyers actually pay, as the consumer-protection rules and the store policies require. No sale is prepared: the prices themselves are low. A real, time-limited sale remains possible; the owner enters its price and end date.

* Premium's sales live in `supabase/migrations/202611170002_premium_sales.sql` (`premium_sales`, `owner_sales()`, `owner_premium_sale()`).
* `billing` reads them through `premiumSales()`. With no table (not yet migrated) it charges the regular prices, as before.
* An order keeps the price it was opened with, even if the sale ends before it is paid.
* Store builds show the store's own price, never a struck-out price: introductory offers belong in App Store Connect / Play Console.

### Rules the database enforces

* Every time is the server's: `market_now()`. A test clock exists only where `server_config.market_test_clock = 'on'`, never on the live server.
* Paid time starts when a **verified** payment meets a publicly active listing (`market_apply_payment`):
  * draft → published now, for the package's hours (a draft is never public before that);
  * live listing → the hours are **added** to the current deadline;
  * listing under review → the hours wait (`queued_hours`) and start on approval. Moderation uses none of the paid time.
* Public means `status = 'active' and expires_at > market_now()`, through `market_is_live()`. Every read is a security-definer function, and `market_listings` has no client grants. So an expired listing disappears from search, the carousel, sponsored places, saved lists and its own URL at that second, whether or not the cleanup has run.
* `market_expire()` runs every minute (`pg_cron` job `market-expire`). It:
  * warns once per deadline (3 h before for listings of ≤ 72 h, 24 h before otherwise);
  * deletes ended listings, and drafts or refused listings untouched for 7 days;
  * queues their files in `market_media_trash` and keeps a text-free line in `market_expired_log`.
  
  Each listing is deleted in its own sub-transaction: a failure is logged in `market_cleanup_errors` and retried the next minute.
* A listing with a checkout opened in the last 2 hours, or with queued paid hours, is hidden but **not deleted**. Payment and cleanup lock the same row (`for update` / `for update skip locked`), so whichever comes second sees the first. A payment that finds its listing gone is stored as `orphaned` (to refund) and shown in the dashboard. It is never silently lost.
* `market-media-sweep` (every 5 min) calls the `market` Edge Function with the existing `push_hook_secret`. The function deletes the queued files from the private `market` bucket through the Storage API. Each batch's result is recorded, and failures back off (5 min × 2ⁿ, at most 8 tries, then shown in the dashboard with a retry button). A file can be queued only under its own seller's folder (check constraint), and the function sends only such paths.
* Only financial records survive a deletion: `market_promotions` and `market_orders` (their listing reference becomes null).

### Payments

| Channel | How | Status |
| --- | --- | --- |
| Web, PWA, desktop | TBC hosted page in GEL (all four packages) | Code ready; **TBC merchant credentials are not configured**. Because every listing is paid, **nobody can publish a listing until a payment method is active**: the app says "Publishing switches on once card payment is activated" and keeps the draft. |
| Web, PayPal | Only for packages with a EUR/USD price (PayPal cannot charge GEL; no silent conversion) | **On**: EUR 1.03 / 2.41 / 5.17 / 10.34, set with the lowered prices. PayPal is the payment method that works today, so listings can be published through it. No real marketplace payment has been made yet. |
| iOS / Android | Consumable in-app products `market_ad24`, `market_ad72`, `market_ad168`, `market_ad720` through RevenueCat. The server reads the transaction from RevenueCat for this account (`non_subscriptions`), rejects sandbox and receipts older than 72 h, and uses the store transaction id as the idempotency key. A store build never opens an external checkout. | Not configured: RevenueCat, the store products and their review are missing. Google Play cannot have a Georgian merchant profile (see above). |

The return from a hosted page (`?payment=market-tbc|market-paypal|market-cancelled`) is a hint only. The app asks `market` → `verify`, which fetches the payment from TBC or PayPal. The callbacks (`payment-callback`) route a marketplace order to the marketplace and everything else to Premium as before. Duplicate callbacks count once: `unique(provider, payment_id)`, and the order row is locked. Refunds:
* TBC `Returned` comes back on verify.
* PayPal `PAYMENT.CAPTURE.REFUNDED`/`REVERSED` arrives once those two events are added to the existing webhook.
* RevenueCat `CANCELLATION` of a `market_*` product comes through the store webhook.
* Anything else: the owner records the refund in the dashboard.

In every case the paid hours come off the listing.

### Deploy (owner, in this order)

1. SQL Editor: `supabase/migrations/202611170001_marketplace.sql`, `202611170002_premium_sales.sql`, then `202611170003_lower_prices.sql` (only where 0001 ran with the first prices; the live server did, 2026-11-16). It needs `202611090002_social.sql`, which the live server has. It can be run twice. Then verify read-only:
   * the tables;
   * `select * from cron.job where jobname like 'market%'`;
   * the `market` bucket (private, 50 MB);
   * `server_config` has `market_url`;
   * `market_test_clock` is **absent**.
2. `supabase functions deploy market`, then redeploy `billing`, `payment-callback`, `store-webhook` and `push` (the shared modules changed). `config.toml` sets `verify_jwt = false` for `market`: it checks members against Supabase Auth itself, and the sweep carries the hook secret.
3. Optional: PayPal webhook → add `PAYMENT.CAPTURE.REFUNDED` and `PAYMENT.CAPTURE.REVERSED`.
4. Build and publish the app.

### Tests

```sh
node --test market-sql.test.mjs   # 21: paid-only, every package's lifetime, sales and their end, Premium sales, public removal, cleanup, media queue, payment/cleanup race, moderation, refunds, notices, permissions
node --test market.test.mjs       # 10: the Edge Function and billing with mocked TBC / PayPal / RevenueCat / Storage, sale prices charged
cd ../source && APP_DIR=dist/app node --test qa/market-ui.cjs   # 2: 320/390/768/1280 px, ka + en, with a fake server
```

The marketplace is in the installable app (PWA, desktop, native) only. `build.py` leaves it out of the single files (`dist/artifact.html`, `dist/panduri-app.html`, `APP_ONLY`): they were within a few KB of the 16 MiB limit, and the marketplace needs the server and payments anyway. The app hides its entrances there.

