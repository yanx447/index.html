# Sima text tutor

Backend deployed to the configured Supabase project on 2026-11-08.
The OpenRouter credential is stored as a server secret. A real Georgian greeting
request to the selected model succeeded; anonymous calls to the deployed function
returned 401 as intended. Full signed-in app conversation remains to be verified.
The public GitHub Pages frontend has not been published by this work.
This is model integration, not new model training.

1. Apply `sima.sql` in the app's Supabase project. It limits each authenticated
   account to 100 requests per UTC database day and one request per 3 seconds.
2. In this directory link the Supabase CLI to that project.
3. Set `OPENROUTER_API_KEY` using Supabase server secrets. The default model is
   `google/gemini-3.1-flash-lite`. `SIMA_MODEL` can override it server-side. Never put the key in app config,
   JavaScript, source assets or committed files. Supabase supplies
   `SUPABASE_URL` and `SUPABASE_ANON_KEY` to the function.
4. Deploy with `supabase functions deploy sima`. The function independently
   validates the user's access token with Auth, including if gateway JWT checks
   are disabled for publishable-key compatibility.
5. Sign into the app and test Georgian explanation, follow-up questions,
   unknown panduri technique, harmful requests, quota, timeout and logout.
   Prompt rules reduce risk but cannot guarantee perfect model behavior; review
   real Georgian outputs before release to students.

The app sends typed chat and relevant lesson excerpts only. It does not send
audio, email, profile or practice recordings. History stays in memory and clears
when the panel closes. The OpenRouter Responses API call uses `store: false`; provider
operational retention policies still apply. No chat is stored in the app DB.
All generated answers carry an AI label, never a teacher source badge.

Protocol reference: [OpenRouter Responses API](https://openrouter.ai/docs/api_reference/responses/overview).

Create a key at https://openrouter.ai/settings/keys. Give the key a small credit
limit in the OpenRouter dashboard for the first test and keep automatic top-ups
disabled. Add it in Supabase Dashboard > Edge Functions > Secrets as
`OPENROUTER_API_KEY`. Never paste it into chat or browser app settings.

Connected users send every turn, including greetings, to the model; predefined
social replies are used only when AI access is unavailable before sign-in.

Offline backend checks:
`npx --yes deno run --allow-env --allow-read sima.test.ts` (from backend).

## 2026-11-10: the app's data, every language, and the internet

- **App data.** Every request now carries `context.app` (about 1.6 KB): the songs the app holds (chords
  in order, shapes, rhythm and strokes, metre, tempo, the order the song page teaches in), the teacher's
  rhythms, the course on the learn page, the learner's next step and, when a song is open in the AI
  studio, what it measured. The instructions tell the model to answer about these exactly from that data.
- **Languages.** `language` is mapped to a language name (16 app languages); the model replies in the
  language of the learner's last message, else the app's, with correct grammar and spelling.
- **Web search.** Only when the app sends `web: true` (a song the app does not hold, or the learner asks
  to search) the request adds OpenRouter's `openrouter:web_search` server tool (`max_results: 5`,
  `max_tool_calls: 3`); the model decides whether to search. `url_citation` annotations come back as
  `sources` (http/https only, each once, at most five) and the app shows them as links. Cost: Gemini's
  native search is passed through at Google's price, otherwise Exa at about $0.007 per request, on top of
  tokens. The privacy note in the app says the question may go to an internet search.
- **Not deployed yet.** These changes are in the repository and pass `sima.test.ts`; the function running
  on Supabase is the earlier version until `supabase functions deploy sima` is run.
