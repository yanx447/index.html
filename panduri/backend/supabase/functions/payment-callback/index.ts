import { paymentCallback } from '../_shared/callbacks.js';
import { db, env } from '../_shared/runtime.ts';
Deno.serve(paymentCallback({ db, env }));
