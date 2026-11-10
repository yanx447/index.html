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
