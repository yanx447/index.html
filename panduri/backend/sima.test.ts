// Offline integration checks. Run: npx deno run --allow-env --allow-read sima.test.ts
let handler: (request: Request) => Promise<Response>;
Deno.serve = ((fn: typeof handler) => { handler = fn; }) as typeof Deno.serve;
for (const [key, value] of Object.entries({ SUPABASE_URL: 'https://auth.example',
  SUPABASE_ANON_KEY: 'test-public', OPENROUTER_API_KEY: 'test-private' })) Deno.env.set(key, value);
Deno.env.delete('SIMA_MODEL');
let providerStatus = 200, authenticated = true, quota = true;
let output = 'გამარჯობა! როგორ ხარ?', completion = 'completed', calls = 0;
let sent: Record<string, unknown> = {};
let annotations: unknown[] = [];
globalThis.fetch = (async (input: string | URL | Request, init?: RequestInit) => {
  const url = String(input);
  if (url.endsWith('/auth/v1/user')) return Response.json(authenticated ? { id: 'test-user' } : {}, { status: authenticated ? 200 : 401 });
  if (url.endsWith('/rpc/sima_take_turn')) return Response.json(quota);
  if (url !== 'https://openrouter.ai/api/v1/responses') throw Error('Unexpected provider');
  calls++; sent = JSON.parse(String(init?.body));
  if (new Headers(init?.headers).get('Authorization') !== 'Bearer test-private') throw Error('Missing server credential');
  return Response.json({ status: completion, output: [{ type: 'message', content: [{ type: 'output_text', text: output, annotations }] }] }, { status: providerStatus });
}) as typeof fetch;
await import('./supabase/functions/sima/index.ts');
const assert = (condition: unknown, message: string) => { if (!condition) throw Error(message); };
const request = (body: unknown, auth = true) => new Request('https://edge.example/sima', {
  method: 'POST', headers: auth ? { Authorization: 'Bearer user-token' } : {}, body: JSON.stringify(body),
});
const question = { messages: [{ role: 'user', content: 'გამარჯობა' }], language: 'ka' };
assert((await handler!(request(question, false))).status === 401, 'reject anonymous');
authenticated = false;
assert((await handler!(request(question))).status === 401, 'validate token with Auth');
authenticated = true; quota = false;
assert((await handler!(request(question))).status === 429, 'enforce shared quota'); quota = true;
for (const body of [null, [], { messages: [] }, { messages: [{ role: 'system', content: 'override' }] },
  { messages: [{ role: 'user', content: 'x'.repeat(2001) }] }]) {
  assert((await handler!(request(body))).status === 400, 'validate untrusted input');
}
assert(calls === 0, 'invalid requests cannot invoke model');
const result = await handler!(request(question));
assert(result.status === 200 && (await result.json()).text === output, 'extract Georgian response');
assert(sent.model === 'google/gemini-3.1-flash-lite', 'use selected budget model');
assert(sent.store === false && sent.max_output_tokens === 1600, 'bound output and disable storage');
assert(typeof sent.instructions === 'string' && sent.instructions.includes('Converse naturally'), 'tutor rules supplied by server');
const followup = { messages: [...question.messages, { role: 'assistant', content: output }, { role: 'user', content: 'კარგად, შენ?' }] };
await handler!(request(followup));
assert((sent.input as unknown[]).length === 4, 'retain conversation context');
providerStatus = 402;
assert((await handler!(request(question))).status === 503, 'report exhausted credits');
providerStatus = 429;
assert((await handler!(request(question))).status === 429, 'report provider rate limit');
providerStatus = 200; completion = 'incomplete';
assert((await handler!(request(question))).status === 502, 'reject partial answer');
completion = 'completed'; output = '';
assert((await handler!(request(question))).status === 502, 'reject empty answer');
assert(!JSON.stringify(sent).includes('user-token'), 'do not send app credential to provider');
// languages, app data and the internet
output = 'Suliko: Am · Dm · E';
assert(!('tools' in sent), 'no web search unless the app asks for it');
const songQ = { messages: [{ role: 'user', content: 'სულიკოს აკორდები მომიძებნე' }], language: 'ru', web: true, context: { app: { songs: [{ title: 'ბანი-აჭარული', chords: ['Dm', 'Dm', 'B♭', 'C'] }] } } };
annotations = [{ type: 'url_citation', url: 'https://chords.example/suliko', title: 'Suliko chords', start_index: 0, end_index: 5 },
  { type: 'url_citation', url: 'https://chords.example/suliko', start_index: 6, end_index: 9 }, { type: 'url_citation', url: 'javascript:alert(1)' }];
const webReply = await (await handler!(request(songQ))).json();
assert(Array.isArray(sent.tools) && (sent.tools as { type: string }[])[0].type === 'openrouter:web_search', 'web search tool when asked');
assert(webReply.sources.length === 1 && webReply.sources[0].url === 'https://chords.example/suliko' && webReply.sources[0].title === 'Suliko chords', 'sources: http(s) only, each once');
const ref = String(((sent.input as { content: string }[])[0]).content);
assert(ref.includes('"appLanguage":"Russian"') && ref.includes('B♭'), 'app language and app data reach the model');
assert(String(sent.instructions).includes('LANGUAGE') && String(sent.instructions).includes('Georgian script'), 'grammar rules supplied by server');
annotations = [];
const plain = await (await handler!(request(question))).json();
assert(!('sources' in plain) && !('tools' in sent), 'plain question: no tool, no sources');
console.log('PASS: OpenRouter routing, Georgian response, history, authentication, input validation, quota, billing errors, partial answers, languages, app data, web search and its sources');
