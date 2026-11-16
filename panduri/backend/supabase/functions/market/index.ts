// The marketplace: checkout for paid advertisements (TBC / PayPal on the web, App Store / Play verification in the
// apps) and the deletion of expired listings' files, asked for by the database's schedule.
import { marketHandler } from '../_shared/market.js';
import { db, env } from '../_shared/runtime.ts';
Deno.serve(marketHandler({ db, env }));
