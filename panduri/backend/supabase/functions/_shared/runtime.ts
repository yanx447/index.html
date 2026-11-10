import { createClient } from 'npm:@supabase/supabase-js@2.49.1';
export const env = (key: string) => Deno.env.get(key);
export const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
