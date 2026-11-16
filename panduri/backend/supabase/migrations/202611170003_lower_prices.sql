-- The owner's decision (2026-11-16): the low prices are the prices, for good — no struck-out "regular" price that nobody
-- pays. For a server that already ran 202611170001_marketplace.sql with the first prices (5 / 10 / 20 / 40 GEL, a sale
-- prepared at 2.99 / 6.99 / 14.99 / 29.99). Sets the marketplace's packages to 2.99 / 6.99 / 14.99 / 29.99 GEL and their
-- PayPal prices (EUR at NBG 2026-11-07, EUR 1 = GEL 2.8998), and clears the prepared sale. Can be run twice.
-- Premium's new prices (4.99 / 39.99 GEL) are in the billing function and its PayPal secrets, not in the database.
update public.market_packages p set sale_minor = null, sale_until = null, paypal_sale_value = null,
  price_minor = v.price, paypal_value = v.pp, paypal_currency = 'EUR', updated_at = now()
from (values ('ad24', 299, '1.03'), ('ad72', 699, '2.41'), ('ad168', 1499, '5.17'), ('ad720', 2999, '10.34')) as v(id, price, pp)
where p.id = v.id;
