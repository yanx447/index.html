import { billingHandler } from '../_shared/billing.js';
import { db, env } from '../_shared/runtime.ts';
Deno.serve(billingHandler({ db, env }));
