/* ფანდური — სერვერის და გადახდის პარამეტრები · server and payment settings.
   შეავსე და შეინახე — აპის ხელახლა აწყობა არ არის საჭირო. Fill in and save — no rebuild needed.
   The publishable key (sb_publishable_...) or the older "anon public" key is meant to be public:
   row-level security protects the data. NEVER put a secret / service_role key here. */
PD.CONFIG = Object.assign(PD.CONFIG || {}, Object.fromEntries(Object.entries({
  supabaseUrl: '',   // https://xxxx.supabase.co
  supabaseKey: '',   // Settings > API Keys > publishable key (sb_publishable_...)
  prices: null,      // { monthly: '9 ₾', yearly: '79 ₾' }
  payments: null,    // { monthly: 'https://buy.stripe.com/...', yearly: 'https://buy.stripe.com/...' }
  turn: null         // { urls: 'turn:turn.example.com:3478', username: '...', credential: '...' }
}).filter(function (e) { return e[1]; })));
