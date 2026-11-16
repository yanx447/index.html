// The marketplace in a real (embedded) Postgres, with a test clock: days pass in milliseconds.
// Every expectation below is about the server's own timestamps; the device clock is never asked.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const { PGlite } = await import(process.env.PGLITE_MODULE || '@electric-sql/pglite');

const A = '11111111-1111-1111-1111-111111111111', B = '22222222-2222-2222-2222-222222222222', C = '33333333-3333-3333-3333-333333333333';
const OWNER = '44444444-4444-4444-4444-444444444444', ADMIN = '55555555-5555-5555-5555-555555555555';
const db = new PGlite();
const HOUR = 3600e3;
const T0 = Date.parse('2026-11-20T10:00:00Z');   // 14:00 in Tbilisi
let now = T0;
async function clock(ms) { now = ms; await db.query(`select set_config('market.test_now', $1, false)`, [new Date(ms).toISOString()]); }
const at = h => clock(T0 + h * HOUR);
async function as(user, sql, params) {
  await db.exec(`reset role; select set_config('test.uid', '${user || ''}', false); set role ${user ? 'authenticated' : 'anon'};`);
  try { return (await db.query(sql, params)).rows; } finally { await db.exec(`reset role; select set_config('test.uid', '', false);`); }
}
const val = async (user, sql, params) => Object.values((await as(user, sql, params))[0])[0];
const sys = async (sql, params) => (await db.query(sql, params)).rows;      // the service role / pg_cron
const sysVal = async (sql, params) => Object.values((await sys(sql, params))[0])[0];
const refused = (user, sql, pattern) => assert.rejects(as(user, sql), pattern);
const mig = name => readFile(new URL('supabase/migrations/' + name, import.meta.url), 'utf8');
const iso = ms => new Date(ms).toISOString();
const ts = v => new Date(v).getTime();

const FIELDS = { title: 'ფანდური, თელავის ოსტატის', body: 'კარგ მდგომარეობაში', category: 'panduri', condition: 'good', price: '450', city: 'თბილისი', phone: '+995 555 12 34 56' };
async function draft(user, extra = {}, plan = 'ad720') {
  const id = await val(user, `select public.market_save(null, $1::jsonb) as id`, [JSON.stringify({ ...FIELDS, ...extra, plan })]);
  await as(user, `select public.market_set_media($1, $2::text[], $3, null)`, [id, [`${user}/${id}/a.jpg`, `${user}/${id}/b.jpg`], `${user}/${id}/v.mp4`]);
  return id;
}
let orderN = 0;
async function order(seller, listing, pkg, provider = 'tbc') {
  const id = crypto.randomUUID(), ref = 'pay-' + (++orderN);
  // what the Edge Function charges: the price the server says now (a running sale's, or the regular one)
  const price = (await sysVal(`select public.market_order_check($1, $2, $3)`, [seller, listing, pkg]).catch(() => null))?.charge_minor
    ?? await sysVal(`select price_minor from public.market_packages where id = $1`, [pkg]);
  await sys(`insert into public.market_orders (id, provider, provider_id, seller_id, listing_id, package_id, amount, currency, created_at) values ($1, $2, $3, $4, $5, $6, $7, 'GEL', $8)`,
    [id, provider, ref, seller, listing, pkg, (price / 100).toFixed(2), iso(now)]);
  return ref;
}
const pay = (ref, provider = 'tbc') => sysVal(`select public.market_fulfill_order($1, $2)`, [provider, ref]);
const get = (user, id) => val(user, `select public.market_get($1) as g`, [id]);
const search = (user, args = '') => val(user, `select public.market_search(${args || "''"}) as s`);
const featured = user => val(user, `select public.market_featured() as f`);
const listing = id => sys(`select * from public.market_listings where id = $1`, [id]).then(r => r[0]);
const expire = () => sysVal(`select public.market_expire()`);

test('setup: the live server\'s schema, then the marketplace (twice)', async () => {
  await db.exec(`create role anon; create role authenticated; create role service_role;
    create schema auth;
    create table auth.users(id uuid primary key, email text, phone text, raw_user_meta_data jsonb, email_confirmed_at timestamptz, phone_confirmed_at timestamptz, last_sign_in_at timestamptz, created_at timestamptz default now(), updated_at timestamptz default now());
    create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('test.uid', true), '')::uuid $$;
    grant usage on schema public, auth to anon, authenticated;
    grant execute on function auth.uid() to anon, authenticated;
    alter default privileges in schema public grant all on tables to anon, authenticated, service_role;
    alter default privileges in schema public grant all on functions to anon, authenticated, service_role;
    alter default privileges in schema public grant all on sequences to anon, authenticated, service_role;
    insert into auth.users(id, email, email_confirmed_at) values ('${A}', 'a@x', now()), ('${B}', 'b@x', now()), ('${C}', 'c@x', now()), ('${OWNER}', 'OWNER_EMAIL', now()), ('${ADMIN}', 'admin@x', now());`);
  await db.exec(`create schema storage;
    create table storage.buckets(id text primary key, name text, public boolean, file_size_limit bigint, allowed_mime_types text[]);
    create table storage.objects(id uuid primary key default gen_random_uuid(), bucket_id text, name text, owner uuid, created_at timestamptz default now());
    alter table storage.objects enable row level security;
    create function storage.foldername(name text) returns text[] language sql immutable as $$ select (string_to_array(name, '/'))[1:array_length(string_to_array(name, '/'), 1) - 1] $$;
    grant usage on schema storage to anon, authenticated; grant select, insert, delete on storage.objects to anon, authenticated; grant execute on function storage.foldername(text) to anon, authenticated;`);
  await db.exec((await readFile(new URL('../source/supabase/schema.sql', import.meta.url), 'utf8')).replace(/create extension[^;]*;/gi, ''));
  await db.exec(await mig('202611080003_moderation.sql'));
  await db.exec(`insert into public.profiles(id, display_name, role) values ('${A}', 'ანა', 'user'), ('${B}', 'ბექა', 'user'), ('${C}', 'ცირა', 'user'), ('${OWNER}', 'Owner', 'admin'), ('${ADMIN}', 'Admin', 'admin')
      on conflict (id) do update set display_name = excluded.display_name, role = excluded.role;`);
  await db.exec(await mig('202611090002_social.sql'));
  const market = await mig('202611170001_marketplace.sql');
  await db.exec(market);
  await db.exec(market);   // running it twice changes nothing
  const sales = await mig('202611170002_premium_sales.sql');
  await db.exec(sales); await db.exec(sales);
  await db.exec(`insert into public.server_config (key, value) values ('market_test_clock', 'on')`);
  await at(0);
  assert.equal(ts(await sysVal(`select public.market_now()`)), T0);
});

test('the four packages: the low prices are the prices (no sale prepared), exact lengths, PayPal in EUR; no free listing', async () => {
  const rows = await as(null, `select id, hours, price_minor, sale_minor, sale_until, currency, name_ka, active from public.market_packages order by sort`);
  assert.deepEqual(rows.map(r => [r.id, r.hours, r.price_minor, r.sale_minor, r.sale_until, r.currency, r.active]),
    [['free', 720, 0, null, null, 'GEL', false], ['ad24', 24, 299, null, null, 'GEL', true], ['ad72', 72, 699, null, null, 'GEL', true], ['ad168', 168, 1499, null, null, 'GEL', true], ['ad720', 720, 2999, null, null, 'GEL', true]]);
  assert.deepEqual((await sys(`select paypal_value from public.market_packages where kind = 'ad' order by sort`)).map(r => r.paypal_value), ['1.03', '2.41', '5.17', '10.34']);
  assert.deepEqual(rows.slice(1).map(r => r.name_ka), ['24-საათიანი რეკლამა', '3-დღიანი რეკლამა', 'კვირის რეკლამა', 'თვის რეკლამა']);
  // a package's length is part of what it is: nobody can turn 24 hours into 48
  await assert.rejects(sys(`update public.market_packages set hours = 48 where id = 'ad24'`), /market_packages_hours/);
  // members cannot change prices, not even through the table
  await refused(A, `update public.market_packages set price_minor = 1 where id = 'ad24'`, /permission denied/);
  await refused(ADMIN, `select public.market_admin_package('ad24', 1, true)`, /not-allowed/);   // an administrator is not the owner
});

test('every listing is paid: no free publishing, no free package', async () => {
  await at(0);
  const id = await draft(A);
  await refused(A, `select public.market_submit('${id}')`, /does not exist/);
  await refused(A, `select public.market_save(null, '${JSON.stringify({ ...FIELDS, plan: 'free' })}'::jsonb)`, /invalid-package/);
  await expire();
  assert.equal(await get(B, id), null, 'a draft is never public, however long it waits');
  assert.equal((await listing(id)).status, 'draft');
  await assert.rejects(sys(`select public.market_order_check('${A}', '${id}', 'free')`), /invalid-package/);
  await as(A, `select public.market_delete($1)`, [id]);   // the seller gives up: deleted at once, files queued
  assert.equal(await listing(id), undefined);
});

test('a listing\'s life: public from the verified payment, gone everywhere at its end, then deleted with its files', async () => {
  await at(0);
  const id = await draft(A);
  assert.equal(await get(B, id), null, 'a draft is not public');
  assert.equal(await pay(await order(A, id, 'ad720')), 'publish');
  const l = await listing(id);
  assert.equal(ts(l.published_at), T0);
  assert.equal(ts(l.expires_at), T0 + 720 * HOUR);
  assert.ok(l.promotion_id);
  const n = await sys(`select kind, go, params->>'id' as lid from public.notifications where user_id = '${A}' and kind = 'market_active'`);
  assert.equal(n.length, 1); assert.equal(n[0].go, 'market:l:' + id);
  // public: search, the page, a buyer's saved list; signed out too
  assert.ok((await search(null)).items.some(x => x.id === id));
  assert.equal((await get(null, id)).id, id);
  assert.equal((await get(null, id)).seller.name, undefined, 'a guest sees the listing, not who the seller is');
  assert.equal((await get(B, id)).seller.name, 'ანა');
  await as(B, `select public.market_favorite($1, true)`, [id]);
  assert.equal((await val(B, `select public.market_saved() as s`)).items.length, 1);
  assert.equal((await get(B, id)).phone, undefined, 'the phone is never in the public card');
  assert.equal(await val(B, `select public.market_contact($1)`, [id]), FIELDS.phone);

  // a second before the end it is still there; at the end it is gone from every query, before any cleanup ran
  await clock(T0 + 720 * HOUR - 1000);
  assert.equal((await get(B, id)).id, id);
  await clock(T0 + 720 * HOUR);
  assert.equal(await get(B, id), null, 'the direct URL answers nothing');
  assert.equal(await get(null, id), null);
  assert.ok(!(await search(B)).items.some(x => x.id === id));
  assert.equal((await val(B, `select public.market_saved() as s`)).items.length, 0);
  await refused(B, `select public.market_contact('${id}')`, /not-found/);
  await refused(B, `select public.market_send('${id}', 'ჯერ კიდევ იყიდება?')`, /not-found/);
  // the media can no longer be read by anyone but its seller
  assert.equal(await val(B, `select public.can_read_market_media($1)`, [`${A}/${id}/a.jpg`]), false);
  assert.equal(await val(A, `select public.can_read_market_media($1)`, [`${A}/${id}/a.jpg`]), true);

  // the scheduled job: the row and the favourite are deleted, the files queued for the Storage API, the seller told
  const r = await expire();
  assert.equal(r.deleted, 1);
  assert.equal(await listing(id), undefined);
  assert.equal(await sysVal(`select count(*)::int from public.market_favorites where listing_id = $1`, [id]), 0);
  const trash = await sys(`select path, seller_id from public.market_media_trash where listing_id = $1 order by path`, [id]);
  assert.deepEqual(trash.map(t => t.path), [`${A}/${id}/a.jpg`, `${A}/${id}/b.jpg`, `${A}/${id}/v.mp4`]);
  assert.ok(trash.every(t => t.seller_id === A));
  const log = await sys(`select reason, paid, media from public.market_expired_log where listing_id = $1`, [id]);
  assert.deepEqual(log, [{ reason: 'expired', paid: true, media: 3 }]);
  assert.equal(await sysVal(`select count(*)::int from public.notifications where user_id = '${A}' and kind = 'market_expired'`), 1);
  assert.equal((await expire()).deleted, 0, 'a second run finds nothing more');
});

for (const [pkg, gel, hours] of [['ad24', '2.99', 24], ['ad72', '6.99', 72], ['ad168', '14.99', 168], ['ad720', '29.99', 720]]) {
  test(`${gel} GEL promotion (${pkg}): ${hours} hours from the verified payment, then the whole listing is deleted`, async () => {
    await at(1000);
    const id = await draft(A, {}, pkg);
    // a draft waiting for payment is not public, and time does not run for it
    await at(1001);
    assert.equal(await get(B, id), null);
    const ref = await order(A, id, pkg);
    assert.equal((await sys(`select amount from public.market_orders where provider_id = $1`, [ref]))[0].amount, gel);
    await at(1002);   // the payment is verified an hour later: the time starts now, not when the form was opened
    assert.equal(await pay(ref), 'publish');
    const l = await listing(id);
    assert.equal(ts(l.published_at), T0 + 1002 * HOUR);
    assert.equal(ts(l.expires_at), T0 + (1002 + hours) * HOUR);
    const promo = (await sys(`select * from public.market_promotions where id = $1`, [l.promotion_id]))[0];
    assert.equal(promo.amount, gel); assert.equal(promo.hours, hours); assert.equal(promo.status, 'applied');
    // featured at once: carousel, and a sponsored place in a matching search
    assert.ok((await featured(B)).items.some(x => x.id === id && x.sponsored && x.package === pkg));
    assert.ok((await search(B, `'', 'panduri'`)).sponsored.some(x => x.id === id));
    assert.ok(!(await search(B, `'', 'chonguri'`)).sponsored.some(x => x.id === id), 'sponsored places follow the filters');
    // the end of the advertisement is the end of the listing — not just of its badge
    await clock(T0 + (1002 + hours) * HOUR);
    assert.equal(await get(B, id), null);
    assert.ok(!(await featured(B)).items.some(x => x.id === id));
    assert.ok(!(await search(B)).items.some(x => x.id === id));
    assert.equal((await expire()).deleted >= 1, true);
    assert.equal(await listing(id), undefined);
    assert.equal(await sysVal(`select count(*)::int from public.market_media_trash where listing_id = $1`, [id]), 3);
    // the financial record stays
    assert.equal((await sys(`select listing_id, status from public.market_promotions where payment_id = $1`, [ref]))[0].status, 'applied');
  });
}

test('a sale: the owner runs it, buyers pay 1.99 instead of 2.99 until its end, then 2.99 again by itself', async () => {
  await at(2000);
  const id = await draft(A, {}, 'ad24');
  const charge = async () => (await sysVal(`select public.market_order_check($1, $2, 'ad24')`, [A, id])).charge_minor;
  assert.equal(await charge(), 299, 'no sale yet: the regular price');
  const until = iso(T0 + 2010 * HOUR);
  await refused(ADMIN, `select public.market_owner_sale('ad24', 1.99, null, '${until}')`, /not-allowed/);
  await refused(A, `select public.market_owner_sale('ad24', 1.99, null, '${until}')`, /not-allowed/);
  await refused(OWNER, `select public.market_owner_sale('ad24', 2.99, null, '${until}')`, /sale-not-lower/);
  await refused(OWNER, `select public.market_owner_sale('ad24', 3.50, null, '${until}')`, /sale-not-lower/);
  await refused(OWNER, `select public.market_owner_sale('ad24', 1.99, null, '${iso(T0 + 1999 * HOUR)}')`, /invalid-date/);
  await refused(OWNER, `select public.market_owner_sale('ad24', 1.99, null, '${iso(T0 + (2000 + 24 * 400) * HOUR)}')`, /invalid-date/);
  await as(OWNER, `select public.market_owner_sale('ad24', 1.99, null, '${until}')`);
  assert.equal(await charge(), 199);
  // an order opened during the sale keeps its price, even if paid after the sale has ended
  const ref = await order(A, id, 'ad24');
  assert.equal((await sys(`select amount from public.market_orders where provider_id = $1`, [ref]))[0].amount, '1.99');
  await at(2010);
  assert.equal(await charge(), 299, 'the sale ended: the regular price again, by itself');
  assert.equal(await pay(ref), 'publish');
  assert.equal((await sys(`select amount from public.market_promotions where payment_id = $1`, [ref]))[0].amount, '1.99');
  // the regular price cannot be lowered under a sale price the owner has kept
  await refused(OWNER, `select public.market_admin_package('ad24', 1.50, true)`, /sale-not-lower/);
  // switched off: until = null
  await as(OWNER, `select public.market_owner_sale('ad24', 1.99, null, '${iso(T0 + 2020 * HOUR)}')`);
  await as(OWNER, `select public.market_owner_sale('ad24', null, null, null)`);
  assert.equal(await charge(), 299);
  assert.equal((await sys(`select sale_minor from public.market_packages where id = 'ad24'`))[0].sale_minor, 199, 'the sale price is kept for the next time');
});

test('Premium sales: the owner only, lower than the regular price, with an end; read through owner_sales()', async () => {
  await refused(ADMIN, `select public.owner_sales()`, /not-allowed/);
  await refused(A, `select public.owner_premium_sale('monthly', 3.99, '1.38', '${iso(Date.now() + 864e5)}')`, /not-allowed/);
  await refused(null, `select public.owner_sales()`, /permission denied/);
  await refused(OWNER, `select public.owner_premium_sale('monthly', 4.99, null, '${iso(Date.now() + 864e5)}')`, /sale-not-lower/);
  await refused(OWNER, `select public.owner_premium_sale('monthly', 3.99, null, '${iso(Date.now() - 1000)}')`, /invalid-date/);
  await as(OWNER, `select public.owner_premium_sale('monthly', 3.99, '1.38', '${iso(Date.now() + 864e5)}')`);
  const o = await val(OWNER, `select public.owner_sales() as o`);
  assert.deepEqual(o.premium.map(r => [r.plan, r.price_minor, r.sale_minor, r.paypal_sale_value, !!r.sale_until]), [['monthly', 499, 399, '1.38', true], ['yearly', 3999, null, null, false]]);
  assert.deepEqual(o.market.map(r => r.id), ['ad24', 'ad72', 'ad168', 'ad720']);
  await refused(A, `select * from public.premium_sales`, /permission denied/);
  await as(OWNER, `select public.owner_premium_sale('monthly', null, null, null)`);
  assert.equal((await sys(`select sale_until from public.premium_sales where plan = 'monthly'`))[0].sale_until, null);
});

test('renewal before expiry adds to the deadline; duplicate callbacks count once; failed payments add nothing', async () => {
  await at(4000);
  const id = await draft(A, {}, 'ad72');
  const r1 = await order(A, id, 'ad72');
  await pay(r1);
  assert.equal(ts((await listing(id)).expires_at), T0 + (4000 + 72) * HOUR);
  await at(4050);   // 22 hours still left
  const r2 = await order(A, id, 'ad168');
  // the provider calls three times, twice at once
  const out = await Promise.all([pay(r2), pay(r2)]);
  assert.deepEqual(out.sort(), ['duplicate', 'extend']);
  assert.equal(await pay(r2), 'duplicate');
  assert.equal(ts((await listing(id)).expires_at), T0 + (4000 + 72 + 168) * HOUR, 'previous paid time kept, 168 hours added');
  assert.equal(await sysVal(`select count(*)::int from public.market_promotions where listing_id = $1`, [id]), 2);
  // all four packages can extend
  for (const [pkg, h] of [['ad24', 24], ['ad72', 72], ['ad720', 720]]) {
    const before = ts((await listing(id)).expires_at);
    await pay(await order(A, id, pkg));
    assert.equal(ts((await listing(id)).expires_at), before + h * HOUR);
  }
  // a declined card: the order is marked failed, nothing changes
  const before = ts((await listing(id)).expires_at);
  const r3 = await order(A, id, 'ad24');
  await sys(`select public.market_order_failed('tbc', $1, 'Failed')`, [r3]);
  assert.equal((await sys(`select status from public.market_orders where provider_id = $1`, [r3]))[0].status, 'failed');
  assert.equal(ts((await listing(id)).expires_at), before);
  await assert.rejects(sys(`select public.market_fulfill_order('tbc', 'never-created')`), /unknown order/);
});

test('a payment in flight keeps an expiring listing from deletion; verified after expiry it starts again from activation', async () => {
  await at(6000);
  const id = await draft(A, {}, 'ad24');
  await pay(await order(A, id, 'ad24'));
  await at(6023);
  const ref = await order(A, id, 'ad72');   // the seller opens the checkout an hour before the end
  await at(6024.5);                          // the deadline passes while the bank is still confirming
  assert.equal(await get(B, id), null, 'expired: invisible at once');
  const r = await expire();
  assert.equal(r.held, 1);
  assert.equal((await listing(id)).status, 'expired', 'hidden, not deleted');
  await at(6025);
  assert.equal(await pay(ref), 'publish');
  const l = await listing(id);
  assert.equal(l.status, 'active');
  assert.equal(ts(l.expires_at), T0 + (6025 + 72) * HOUR, 'the 72 paid hours start when it is public again');
  // an order that never completed holds a listing for two hours at most
  await at(6025 + 72);
  await order(A, id, 'ad24');
  await at(6025 + 72 + 2.01);
  assert.equal((await expire()).deleted >= 1, true);
  assert.equal(await listing(id), undefined);
});

test('payment and cleanup at the same moment: whichever comes second sees the first', async () => {
  await at(7000);
  const id = await draft(A, {}, 'ad24');
  await pay(await order(A, id, 'ad24'));
  await at(7024);
  // the order was opened after the deadline (older than the hold): the cleanup may delete it
  const ref = await order(A, id, 'ad24');
  await sys(`update public.market_orders set created_at = $1 where provider_id = $2`, [iso(T0 + 7020 * HOUR), ref]);
  const [cleanup, payment] = await Promise.all([expire(), pay(ref)]);
  const l = await listing(id);
  if (l) {   // the payment won: the listing lives on with the new time, and the cleanup left it alone
    assert.equal(payment, 'publish'); assert.equal(ts(l.expires_at), T0 + 7048 * HOUR);
  } else {   // the cleanup won: the money is recorded as orphaned (to refund), never applied to a deleted listing
    assert.equal(payment, 'orphaned'); assert.ok(cleanup.deleted >= 1);
    assert.equal((await sys(`select status from public.market_promotions where payment_id = $1`, [ref]))[0].status, 'orphaned');
  }
  // a payment for a listing that is already gone is never lost silently
  const ghost = await order(A, null, 'ad24');
  assert.equal(await pay(ghost), 'orphaned');
  assert.equal((await sys(`select status from public.market_orders where provider_id = $1`, [ghost]))[0].status, 'orphaned');
});

test('pre-moderation: paid time waits, it starts only on approval; a refusal marks the payment for refund', async () => {
  await sys(`insert into public.server_config (key, value) values ('market_premoderate', 'on') on conflict (key) do update set value = 'on'`);
  await at(8000);
  const id = await draft(A, {}, 'ad168');
  assert.equal(await pay(await order(A, id, 'ad168')), 'queued');
  assert.equal((await listing(id)).status, 'pending');
  assert.equal(await get(B, id), null);
  await at(8050);   // the moderator looks two days later
  await refused(A, `select public.market_admin_review('${id}', true)`, /not-allowed/);
  await as(ADMIN, `select public.market_admin_review($1, true)`, [id]);
  const l = await listing(id);
  assert.equal(ts(l.published_at), T0 + 8050 * HOUR);
  assert.equal(ts(l.expires_at), T0 + (8050 + 168) * HOUR, 'all 168 paid hours are public hours');
  // refused after payment
  const r = await draft(A, {}, 'ad24'), ref = await order(A, r, 'ad24');
  await pay(ref);
  await as(ADMIN, `select public.market_admin_review($1, false, 'ფოტო არ ჩანს')`, [r]);
  assert.equal((await listing(r)).status, 'rejected');
  assert.equal((await sys(`select status from public.market_promotions where payment_id = $1`, [ref]))[0].status, 'orphaned');
  await sys(`update public.server_config set value = 'off' where key = 'market_premoderate'`);
});

test('refund: the paid hours come off the deadline; the owner only', async () => {
  await at(9000);
  const id = await draft(A, {}, 'ad72');
  const ref = await order(A, id, 'ad72');
  await pay(ref);
  await at(9010);
  const r2 = await order(A, id, 'ad24');
  await pay(r2);
  assert.equal(ts((await listing(id)).expires_at), T0 + (9000 + 96) * HOUR);
  const promo = await sysVal(`select id from public.market_promotions where payment_id = $1`, [r2]);
  await refused(ADMIN, `select public.market_admin_refund('${promo}')`, /not-allowed/);
  assert.equal(await val(OWNER, `select public.market_admin_refund($1)`, [promo]), 'refunded');
  assert.equal(await val(OWNER, `select public.market_admin_refund($1)`, [promo]), 'duplicate');
  assert.equal(ts((await listing(id)).expires_at), T0 + (9000 + 72) * HOUR);
  // the whole purchase refunded: the listing ends now
  await sys(`select public.market_refund('tbc', $1)`, [ref]);
  assert.equal(await get(B, id), null);
});

test('expiry notices: once per deadline, again after an extension; never repeated', async () => {
  await at(10000);
  const id = await draft(A, {}, 'ad24');
  await pay(await order(A, id, 'ad24'));
  const count = () => sysVal(`select count(*)::int from public.notifications where user_id = '${A}' and kind = 'market_expiring' and params->>'id' = $1`, [id]);
  await at(10020);   // 4 hours left: a 24-hour advertisement is told 3 hours before
  await expire(); assert.equal(await count(), 0);
  await at(10021.5);
  await expire(); await expire(); await expire();
  assert.equal(await count(), 1);
  const n = (await sys(`select body, go from public.notifications where user_id = '${A}' and kind = 'market_expiring' and params->>'id' = $1`, [id]))[0];
  assert.match(n.body, /მალე წაიშლება — დარჩენილია 2 საათი, 30 წუთი\./); assert.equal(n.go, 'market:promote:' + id);
  await pay(await order(A, id, 'ad24'));   // extended: a fresh deadline earns one fresh notice
  await at(10045.5);
  await expire(); await expire();
  assert.equal(await count(), 1, 'the unread one is replaced, not doubled');
  assert.equal(await sysVal(`select count(*)::int from public.notifications where user_id = '${A}' and kind = 'market_expiring' and params->>'id' = $1 and read_at is null`, [id]), 1);
});

test('the remaining-time words', async () => {
  const left = (s, l) => sysVal(`select public.market_left($1, $2)`, [s, l]);
  assert.equal(await left(23 * 3600, 'ka'), '23 საათი');
  assert.equal(await left(2 * 86400 + 15 * 3600, 'ka'), '2 დღე, 15 საათი');
  assert.equal(await left(5 * 3600 + 30 * 60, 'ka'), '5 საათი, 30 წუთი');
  assert.equal(await left(5 * 3600 + 30 * 60, 'en'), '5 hours, 30 minutes');
  assert.equal(await left(86400, 'en'), '1 day');
});

test('nobody touches another seller\'s listing, files or the server\'s machinery', async () => {
  await at(11000);
  const id = await draft(A);
  await refused(B, `select public.market_save('${id}', '${JSON.stringify(FIELDS)}'::jsonb)`, /not-found/);
  await refused(B, `select public.market_set_media('${id}', array['${B}/${id}/x.jpg'])`, /not-found/);
  await refused(A, `select public.market_set_media('${id}', array['${B}/${id}/x.jpg'])`, /not-your-file/);
  await refused(A, `select public.market_set_media('${id}', array['${A}/other/x.jpg'])`, /not-your-file/);
  await refused(B, `select public.market_delete('${id}')`, /not-found/);
  // the trash refuses a path outside its seller's folder
  await assert.rejects(sys(`insert into public.market_media_trash (path, seller_id) values ('${B}/x.jpg', '${A}')`), /check/);
  // uploads: only into my own listing's folder
  assert.equal(await val(A, `select public.market_can_upload($1)`, [`${A}/${id}/n.jpg`]), true);
  assert.equal(await val(B, `select public.market_can_upload($1)`, [`${B}/${id}/n.jpg`]), false);
  // payment, cleanup and refund functions are the server's alone
  for (const sql of [`select public.market_fulfill_order('tbc', 'x')`, `select public.market_apply_payment('tbc', 'x', '${A}', '${id}', 'ad720', 0, 'GEL')`,
    `select public.market_expire()`, `select public.market_refund('tbc', 'x')`, `select * from public.market_media_due(10)`, `select public.market_order_check('${A}', '${id}', 'ad24')`])
    await refused(A, sql, /permission denied/);
  for (const sql of [`select * from public.market_listings`, `select * from public.market_orders`, `select * from public.market_media_trash`, `insert into public.market_promotions (package_id, hours, amount, currency, provider, payment_id, status, paid_at) values ('ad24', 24, 0, 'GEL', 'tbc', 'x', 'applied', now())`])
    await refused(A, sql, /permission denied/);
  // the dashboard: administrators read it, members do not
  await refused(A, `select public.market_admin_overview()`, /not-allowed/);
  await refused(A, `select public.market_admin_premoderate(true)`, /not-allowed/);
  await refused(A, `select public.market_admin_remove('${id}')`, /not-allowed/);
  await refused(null, `select public.market_admin_overview()`, /permission denied/);
  const o = await val(ADMIN, `select public.market_admin_overview() as o`);
  assert.deepEqual(o.packages.map(p => p.id), ['free', 'ad24', 'ad72', 'ad168', 'ad720']);
  assert.ok(Number(o.revenue.GEL) > 0);
  assert.ok(o.cleanup.last_run && o.cleanup.last_run.finished_at);
  assert.ok(o.payments.orphaned.length >= 1, 'an orphaned payment is visible for refund');
  // the owner sets a price; the length cannot change
  await as(OWNER, `select public.market_admin_package('ad24', 4, true, '1.38', 'EUR')`);
  assert.deepEqual((await sys(`select price_minor, hours, paypal_value from public.market_packages where id = 'ad24'`))[0], { price_minor: 400, hours: 24, paypal_value: '1.38' });
  await as(OWNER, `select public.market_admin_package('ad24', 2.99, true, '1.03', 'EUR')`);
  // a removed listing goes the same way as an expired one
  await as(ADMIN, `select public.market_admin_remove($1)`, [id]);
  assert.equal(await listing(id), undefined);
  assert.equal((await sys(`select reason from public.market_expired_log where listing_id = $1`, [id]))[0].reason, 'admin');
});

test('a cleanup that fails on one listing logs it, deletes the others, and retries the next minute', async () => {
  await at(12000);
  const ok = await draft(A), bad = await draft(B);
  await pay(await order(A, ok, 'ad720'));
  await pay(await order(B, bad, 'ad720'));
  await at(12000 + 721);
  await db.exec(`create function public.market_boom() returns trigger language plpgsql as $$ begin if old.id = '${bad}' then raise exception 'disk full'; end if; return old; end $$;
    create trigger market_boom before delete on public.market_listings for each row execute function public.market_boom();`);
  const r = await expire();
  assert.equal(r.failed, 1);
  assert.equal(await listing(ok), undefined);
  assert.ok(await listing(bad), 'kept for the next try');
  assert.equal(await get(C, bad), null, 'but invisible meanwhile');
  assert.equal(await sysVal(`select count(*)::int from public.market_media_trash where listing_id = $1`, [bad]), 0, 'its files were not queued half-way');
  assert.match(await sysVal(`select error from public.market_cleanup_errors where listing_id = $1`, [bad]), /disk full/);
  await db.exec(`drop trigger market_boom on public.market_listings`);
  assert.equal((await expire()).deleted, 1);
  assert.equal(await listing(bad), undefined);
});

test('media deletion: done once, retried with back-off, given up after eight tries and shown to the administrator', async () => {
  const due = await sys(`select id, path from public.market_media_due(1000)`);
  assert.ok(due.length > 0);
  const [first, ...rest] = due.map(d => Number(d.id));
  await sys(`select public.market_media_result($1::bigint[], true)`, [rest]);
  for (let i = 0; i < 8; i++) {
    await sys(`select public.market_media_result($1::bigint[], false, 'storage 500')`, [[first]]);
    await sys(`update public.market_media_trash set next_try_at = now() where id = $1`, [first]);
  }
  assert.equal((await sys(`select * from public.market_media_due(1000)`)).length, 0);
  const o = await val(ADMIN, `select public.market_admin_overview() as o`);
  assert.equal(o.cleanup.media_failed, 1);
  assert.equal(await val(ADMIN, `select public.market_admin_retry_media()`), 1);
  assert.equal((await sys(`select * from public.market_media_due(1000)`)).length, 1);
});

test('statistics: impressions, sponsored impressions, views and contacts — once per viewer and day, never the seller\'s own', async () => {
  await at(13000);
  const id = await draft(A, {}, 'ad24');
  await pay(await order(A, id, 'ad24'));
  for (let i = 0; i < 3; i++) {
    await as(B, `select public.market_track($1::uuid[], 'sponsored')`, [[id]]);
    await as(B, `select public.market_track($1::uuid[], 'view')`, [[id]]);
    await as(null, `select public.market_track($1::uuid[], 'impression', 'device-1')`, [[id]]);
  }
  await as(A, `select public.market_track($1::uuid[], 'view')`, [[id]]);
  await as(B, `select public.market_send($1, 'ჯერ კიდევ იყიდება?')`, [id]);
  await as(B, `select public.market_contact($1)`, [id]);
  const s = (await get(A, id)).stats;
  assert.deepEqual(s, { impressions: 1, sponsored_impressions: 1, views: 1, contacts: 1, favorites: 0 });
  assert.equal((await get(B, id)).stats, undefined, 'a buyer does not see them');
  // the seller answers in the same thread; a third person cannot read it
  await as(A, `select public.market_send($1, 'კი, იყიდება', $2)`, [id, B]);
  assert.equal((await val(A, `select public.market_thread($1, $2) as t`, [id, B])).length, 2);
  await refused(C, `select public.market_thread('${id}', '${B}')`, /not-found/);
  assert.equal(await sysVal(`select count(*)::int from public.notifications where user_id = '${A}' and kind = 'market_message'`), 1);
  // a block hides the listing from the blocked person
  await as(A, `insert into public.blocks(blocked) values ('${C}')`);
  assert.equal(await get(C, id), null);
  assert.ok(!(await featured(C)).items.some(x => x.id === id));
});

test('202611170003_lower_prices: a server with the first prices (5 / 10 / 20 / 40, a sale prepared) gets the low prices for good', async () => {
  await sys(`update public.market_packages p set price_minor = v.pr, sale_minor = v.sl, sale_until = now() + interval '3 days', paypal_value = null, paypal_currency = null
    from (values ('ad24', 500, 299), ('ad72', 1000, 699), ('ad168', 2000, 1499), ('ad720', 4000, 2999)) v(id, pr, sl) where p.id = v.id`);
  const lower = await mig('202611170003_lower_prices.sql');
  await db.exec(lower); await db.exec(lower);   // twice: the same result
  assert.deepEqual(await sys(`select id, price_minor, sale_minor, sale_until, paypal_value, paypal_currency from public.market_packages where kind = 'ad' order by sort`), [
    { id: 'ad24', price_minor: 299, sale_minor: null, sale_until: null, paypal_value: '1.03', paypal_currency: 'EUR' },
    { id: 'ad72', price_minor: 699, sale_minor: null, sale_until: null, paypal_value: '2.41', paypal_currency: 'EUR' },
    { id: 'ad168', price_minor: 1499, sale_minor: null, sale_until: null, paypal_value: '5.17', paypal_currency: 'EUR' },
    { id: 'ad720', price_minor: 2999, sale_minor: null, sale_until: null, paypal_value: '10.34', paypal_currency: 'EUR' }]);
});
