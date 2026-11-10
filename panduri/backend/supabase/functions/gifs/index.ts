// GIF search for the chats, through GIPHY. The key (GIPHY_API_KEY) stays here; the app never sees it.
// GET ?probe=1          → { on } — whether GIFs are set up (the app shows the GIF tab only then)
// GET ?q=…&lang=ka      → a signed-in member's search (or the trending GIFs when q is empty), rated G
const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info', 'Access-Control-Allow-Methods': 'GET, OPTIONS' };
const reply = (status: number, body: unknown, cache = 'no-store') => new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json', 'Cache-Control': cache } });
const KEY = Deno.env.get('GIPHY_API_KEY') || '';
const URL0 = Deno.env.get('SUPABASE_URL') || '', ANON = Deno.env.get('SUPABASE_ANON_KEY') || '';

Deno.serve(async req => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: cors });
  if (req.method !== 'GET') return reply(405, { error: 'method' });
  const u = new URL(req.url);
  if (u.searchParams.has('probe')) return reply(200, { on: !!KEY }, 'public, max-age=300');
  if (!KEY) return reply(503, { error: 'not-configured' });
  const auth = req.headers.get('authorization') || '';
  if (!auth.startsWith('Bearer ')) return reply(401, { error: 'sign-in-required' });
  const who = await fetch(URL0 + '/auth/v1/user', { headers: { apikey: ANON, Authorization: auth }, signal: AbortSignal.timeout(8000) }).catch(() => null);
  if (!who || !who.ok) return reply(401, { error: 'sign-in-required' });
  const q = (u.searchParams.get('q') || '').slice(0, 60).trim(), lang = (u.searchParams.get('lang') || 'en').slice(0, 5).replace(/[^a-z-]/gi, '');
  const api = new URL('https://api.giphy.com/v1/gifs/' + (q ? 'search' : 'trending'));
  api.searchParams.set('api_key', KEY); api.searchParams.set('limit', '24'); api.searchParams.set('rating', 'g'); api.searchParams.set('bundle', 'messaging_non_clips');
  if (q) { api.searchParams.set('q', q); api.searchParams.set('lang', lang); }
  const r = await fetch(api, { signal: AbortSignal.timeout(10000) }).catch(() => null);
  if (!r || !r.ok) return reply(502, { error: 'gifs-unavailable' });
  const j = await r.json();
  const rows = (j.data || []).map((g: { id: string; title: string; images: Record<string, { url: string; width: string; height: string }> }) => {
    const im = g.images || {}, main = im.fixed_width || im.downsized || im.original, prev = im.fixed_width_small || main;
    return main && main.url ? { id: g.id, title: (g.title || '').slice(0, 80), url: main.url.split('?')[0], preview: (prev && prev.url || main.url).split('?')[0], w: +main.width || 200, h: +main.height || 200 } : null;
  }).filter(Boolean);
  return reply(200, rows, 'private, max-age=120');
});
