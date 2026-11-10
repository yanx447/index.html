import { storeWebhook } from '../_shared/callbacks.js';
import { db, env } from '../_shared/runtime.ts';
Deno.serve(storeWebhook({ db, env }));
