/* =====================================================================
   ფანდურის ბაზარი — the Panduri Marketplace.
   Instruments for sale between members. Every listing is paid: one of four
   advertisements, which give the listing the sponsored places AND set its
   whole lifetime — when the advertisement ends, the listing is deleted.
   Prices may be on a real, time-limited sale the owner runs ('sales'). Every time and every price here comes from the server
   (backend/supabase/migrations/202611170001_marketplace.sql); this device
   only shows them. A return from a payment page is a hint: the server checks
   the payment with the bank or the store before any time is granted.
   route 'market', param: '' · 'l:<id>' · 'new' · 'edit:<id>' · 'promote:<id>'
     · 'mine' · 'saved' · 'seller:<uid>' · 'inbox' · 't:<listing>:<buyer>' · 'admin' · 'sales' · 'return'
   ===================================================================== */
PD.i18n.add({
  'mk.title': ['ფანდურის ბაზარი', 'Panduri Marketplace'],
  'mk.lead': ['იყიდე და გაყიდე ფანდური, ჩონგური და აქსესუარები.', 'Buy and sell panduri, chonguri and accessories.'],
  'mk.add': ['განცხადების დამატება', 'Add a listing'],
  'mk.mine': ['ჩემი განცხადებები', 'My listings'], 'mk.saved': ['შენახული', 'Saved'], 'mk.inbox': ['წერილები', 'Messages'], 'mk.admin': ['ბაზრის მართვა', 'Marketplace admin'],
  'mk.search': ['ძებნა: ფანდური, ოსტატი, ქალაქი…', 'Search: panduri, maker, city…'],
  'mk.filters': ['ფილტრები', 'Filters'], 'mk.apply': ['ჩვენება', 'Show'], 'mk.reset': ['გასუფთავება', 'Clear'],
  'mk.all': ['ყველა', 'All'],
  'mk.c.panduri': ['ფანდური', 'Panduri'], 'mk.c.chonguri': ['ჩონგური', 'Chonguri'], 'mk.c.instrument': ['სხვა ინსტრუმენტი', 'Other instrument'],
  'mk.c.parts': ['სიმები და ნაწილები', 'Strings & parts'], 'mk.c.accessory': ['ჩასადებები და აქსესუარები', 'Cases & accessories'],
  'mk.k.new': ['ახალი', 'New'], 'mk.k.like_new': ['თითქმის ახალი', 'Like new'], 'mk.k.good': ['კარგი', 'Good'], 'mk.k.fair': ['ნახმარი', 'Used'], 'mk.k.repair': ['შესაკეთებელი', 'Needs repair'],
  'mk.sort': ['დალაგება', 'Sort'], 'mk.s.new': ['ახალი პირველი', 'Newest first'], 'mk.s.price_asc': ['ჯერ იაფი', 'Cheapest first'], 'mk.s.price_desc': ['ჯერ ძვირი', 'Most expensive first'], 'mk.s.ending': ['მალე სრულდება', 'Ending soon'],
  'mk.city': ['ქალაქი', 'City'], 'mk.pmin': ['ფასი — დან', 'Price from'], 'mk.pmax': ['ფასი — მდე', 'Price to'], 'mk.cond': ['მდგომარეობა', 'Condition'], 'mk.any': ['ნებისმიერი', 'Any'],
  'mk.sponsored': ['რეკლამა', 'Sponsored'], 'mk.featured': ['რჩეული ინსტრუმენტები', 'Featured instruments'], 'mk.featuredD': ['რეკლამირებული განცხადებები', 'Advertised listings'],
  'mk.more': ['მეტის ჩვენება', 'Show more'], 'mk.results': ['განცხადებები', 'Listings'],
  'mk.empty': ['ჯერ განცხადება არ არის.', 'No listings yet.'], 'mk.emptyQ': ['ასეთი განცხადება ვერ მოიძებნა.', 'No listings match.'],
  'mk.err': ['ბაზარი ახლა ვერ ჩაიტვირთა. სცადე ცოტა ხანში.', 'The marketplace could not load right now. Try again shortly.'],
  'mk.retry': ['თავიდან ცდა', 'Try again'],
  'mk.noServer': ['ბაზარს სერვერი სჭირდება — ამ ვერსიაში ის არ არის დაყენებული.', 'The marketplace needs the server — it is not set up in this version.'],
  'mk.notYet': ['ბაზარი ჩაირთვება, როგორც კი სერვერი განახლდება.', 'The marketplace switches on once the server has been updated.'],
  'mk.signin': ['გასაყიდად და მყიდველთან დასაკავშირებლად შედი ანგარიშში.', 'Sign in to sell or to contact a seller.'],
  'mk.price': ['ფასი', 'Price'], 'mk.agreed': ['ფასი შეთანხმებით', 'Price on request'], 'mk.neg': ['ვაჭრობა შესაძლებელია', 'Negotiable'],
  'mk.left': ['დარჩენილია {t}', '{t} left'], 'mk.ended': ['ვადა ამოიწურა', 'Ended'],
  'mk.d': ['{n} დღე', '{n} days'], 'mk.d1': ['{n} დღე', '{n} day'], 'mk.h': ['{n} საათი', '{n} hours'], 'mk.h1': ['{n} საათი', '{n} hour'], 'mk.m': ['{n} წუთი', '{n} minutes'], 'mk.m1': ['{n} წუთი', '{n} minute'],
  'mk.until': ['წაიშლება: {d}', 'Deleted on {d}'],
  'mk.gone': ['ეს განცხადება აღარ არის ხელმისაწვდომი — მისი ვადა ამოიწურა ან წაიშალა.', 'This listing is no longer available — it has expired or was removed.'],
  'mk.toMarket': ['ბაზარში დაბრუნება', 'Back to the marketplace'],
  'mk.video': ['ვიდეო', 'Video'], 'mk.audio': ['ხმის ჩანაწერი', 'Sound demo'], 'mk.photos': ['ფოტოები', 'Photos'],
  'mk.seller': ['გამყიდველი', 'Seller'], 'mk.since': ['აპში {d}-დან', 'Member since {d}'], 'mk.sellerAll': ['გამყიდველის განცხადებები', "Seller's listings"],
  'mk.phone': ['ტელეფონის ნახვა', 'Show phone'], 'mk.call': ['დარეკვა · {p}', 'Call · {p}'], 'mk.noPhone': ['გამყიდველმა ტელეფონი არ მიუთითა — მიწერე აპში.', 'The seller gave no phone — write in the app.'],
  'mk.write': ['მიწერა', 'Message'], 'mk.writeT': ['წერილი გამყიდველს', 'Message the seller'], 'mk.writeP': ['მაგ.: ჯერ კიდევ იყიდება? სად შეიძლება ნახვა?', 'e.g. Is it still for sale? Where can I see it?'],
  'mk.send': ['გაგზავნა', 'Send'], 'mk.sent': ['წერილი გაიგზავნა.', 'Message sent.'],
  'mk.save': ['შენახვა', 'Save'], 'mk.unsave': ['შენახულია', 'Saved'], 'mk.share': ['გაზიარება', 'Share'], 'mk.copied': ['ბმული დაკოპირდა.', 'Link copied.'],
  'mk.report': ['დარღვევის შეტყობინება', 'Report'], 'mk.reported': ['მადლობა — მოდერატორი ნახავს.', 'Thank you — a moderator will look at it.'],
  'mk.r.fake': ['ყალბი ან თაღლითური', 'Fake or a scam'], 'mk.r.spam': ['სპამი', 'Spam'], 'mk.r.wrong': ['არასწორი კატეგორია ან ინფორმაცია', 'Wrong category or details'], 'mk.r.abuse': ['შეურაცხმყოფელი', 'Offensive'], 'mk.r.other': ['სხვა', 'Other'],
  'mk.stats': ['სტატისტიკა', 'Statistics'], 'mk.st.impressions': ['ჩვენება სიაში', 'Shown in lists'], 'mk.st.sponsored': ['ჩვენება რეკლამაში', 'Shown as sponsored'],
  'mk.st.views': ['გახსნა', 'Opened'], 'mk.st.contacts': ['დაკავშირება', 'Contacts'], 'mk.st.favorites': ['შენახვა', 'Saves'],
  'mk.stNote': ['თითო ადამიანი დღეში ერთხელ ითვლება. რეკლამა მეტ ჩვენებას იძლევა, მაგრამ გაყიდვას ან ზარს ვერ დაგპირდება.', 'Each person counts once a day. An advertisement brings more showings; it cannot promise a sale or a call.'],
  'mk.extend': ['გაგრძელება', 'Extend'], 'mk.promote': ['რეკლამის ჩართვა', 'Advertise'], 'mk.edit': ['რედაქტირება', 'Edit'], 'mk.delete': ['წაშლა', 'Delete'],
  'mk.deleteQ': ['წავშალო განცხადება სამუდამოდ? ფოტოები, ვიდეო და აუდიოც წაიშლება. გადახდილი დრო არ ბრუნდება.', 'Delete the listing for good? Its photos, video and audio go too. Paid time is not returned.'],
  'mk.deleted': ['განცხადება წაიშალა.', 'Listing deleted.'],
  'mk.st.draft': ['მონახაზი', 'Draft'], 'mk.st.pending': ['განხილვაზე', 'Under review'], 'mk.st.active': ['აქტიური', 'Active'], 'mk.st.expired': ['ვადაგასული', 'Expired'], 'mk.st.rejected': ['არ დამტკიცდა', 'Not approved'],
  'mk.awaitPay': ['გადახდის დადასტურებას ელოდება', 'Waiting for payment confirmation'],
  'mk.pendingD': ['ვადის ათვლა დაიწყება მხოლოდ გამოქვეყნებისას.', 'Its time starts only when it is published.'],
  'mk.draftD': ['ჯერ არ ჩანს. აირჩიე პაკეტი და გადაიხადე — გამოქვეყნდება გადახდის დადასტურებისთანავე.', 'Not visible yet. Choose a package and pay — it is published as soon as the payment is confirmed.'],
  'mk.finish': ['გამოქვეყნება', 'Publish'],
  /* the form */
  'mk.newT': ['ახალი განცხადება', 'New listing'], 'mk.editT': ['განცხადების რედაქტირება', 'Edit listing'],
  'mk.f.title': ['სათაური', 'Title'], 'mk.f.titleP': ['მაგ.: ფანდური, ცაცხვი, 2019', 'e.g. Panduri, linden wood, 2019'],
  'mk.f.cat': ['კატეგორია', 'Category'], 'mk.f.cond': ['მდგომარეობა', 'Condition'], 'mk.f.price': ['ფასი', 'Price'], 'mk.f.priceP': ['ცარიელი — შეთანხმებით', 'Empty — on request'],
  'mk.f.neg': ['ვაჭრობა შესაძლებელია', 'Open to offers'], 'mk.f.city': ['ქალაქი', 'City'], 'mk.f.phone': ['ტელეფონი (არასავალდებულო)', 'Phone (optional)'],
  'mk.f.phoneD': ['ჩანს მხოლოდ ანგარიშით შესულ მყიდველს, როცა „ტელეფონის ნახვას“ დააჭერს.', 'Shown only to a signed-in buyer who taps “Show phone”.'],
  'mk.f.body': ['აღწერა', 'Description'], 'mk.f.bodyP': ['ოსტატი, ხე, ზომა, სიმები, რა ახლავს…', 'Maker, wood, size, strings, what comes with it…'],
  'mk.f.media': ['ფოტო, ვიდეო და ხმა', 'Photos, video and sound'], 'mk.f.mediaD': ['მინიმუმ ერთი ფოტო, მაქსიმუმ 8. ვიდეო და ხმის ჩანაწერი მყიდველს ინსტრუმენტის ჟღერადობას აჩვენებს.', 'At least one photo, up to 8. A video and a sound demo let buyers hear the instrument.'],
  'mk.f.addPhoto': ['ფოტო', 'Photo'], 'mk.f.addVideo': ['ვიდეო', 'Video'], 'mk.f.addAudio': ['ხმა', 'Sound'], 'mk.f.remove': ['მოშორება', 'Remove'],
  'mk.f.next': ['გაგრძელება', 'Continue'], 'mk.f.saveEdit': ['შენახვა', 'Save'], 'mk.f.uploading': ['იტვირთება… {p}%', 'Uploading… {p}%'],
  'mk.f.needTitle': ['სათაური მოკლეა (მინიმუმ 3 ასო).', 'The title is too short (at least 3 letters).'], 'mk.f.needPhoto': ['დაამატე ერთი ფოტო მაინც.', 'Add at least one photo.'],
  'mk.f.badPhone': ['ტელეფონის ნომერი არასწორია.', 'The phone number does not look right.'],
  /* choosing how to publish */
  'mk.p.title': ['აირჩიე პაკეტი', 'Choose a package'], 'mk.p.titleX': ['რეკლამის გაგრძელება', 'Extend the advertisement'], 'mk.p.titleAd': ['რეკლამის ჩართვა', 'Advertise this listing'],
  'mk.p.lead': ['ბაზარში ყველა განცხადება რეკლამაა: პაკეტი განსაზღვრავს, რამდენ ხანს დარჩება ის, და აჩვენებს მას რეკლამის კარუსელში, რჩეულებსა და ძებნის პირველ ადგილებზე.', 'Every listing in the marketplace is an advertisement: the package sets how long it stays and shows it in the sponsored carousel, among featured instruments and at the top of searches.'],
  'mk.p.off': ['−{n}%', '−{n}%'], 'mk.p.was': ['ჩვეულებრივი ფასი', 'Regular price'], 'mk.p.perDay': ['≈ {p} დღეში', '≈ {p} a day'],
  'mk.p.saleEnds': ['ფასდაკლების დასრულება: {d}. შემდეგ ფასი: {p}.', 'The sale ends: {d}. After that the price is {p}.'],
  'mk.p.hours': ['{n} საათი', '{n} hours'], 'mk.p.days': ['{n} დღე', '{n} days'], 'mk.p.plus': ['+{t}', '+{t}'],
  'mk.p.perk1': ['რეკლამის კარუსელი და რჩეულები', 'Sponsored carousel and featured places'], 'mk.p.perk2': ['ძებნის პირველი ადგილები, ფილტრების მიხედვით', 'Top places in matching searches'], 'mk.p.perk3': ['ნიშანი „რეკლამა“ და სტატისტიკა', '“Sponsored” label and statistics'],
  'mk.p.best': ['ყველაზე მომგებიანი', 'Best value'], 'mk.p.fast': ['სწრაფი გაყიდვისთვის', 'For a quick sale'],
  'mk.p.what': ['რა მოხდება', 'What happens'],
  'mk.p.starts': ['დაიწყება გადახდის დადასტურებისთანავე, როცა განცხადება გამოქვეყნდება.', 'Starts as soon as the payment is confirmed and the listing is published.'],
  'mk.p.startsMod': ['ჯერ მოდერატორი ნახავს. ვადის ათვლა დაიწყება მხოლოდ გამოქვეყნებისას — განხილვის დრო არ იხარჯება.', 'A moderator checks it first. Its time starts only when it is published — the review does not use any of it.'],
  'mk.p.ends': ['თუ ახლა დადასტურდება, განცხადება მთლიანად წაიშლება: {d}', 'If confirmed now, the whole listing is deleted on {d}'],
  'mk.p.replace': ['ახლანდელი ვადა ({a}) შეიცვლება რეკლამის ვადით: {d}.', 'Its current deadline ({a}) is replaced by the advertisement’s: {d}.'],
  'mk.p.shorter': ['ყურადღება: ეს ახლანდელ ვადაზე მოკლეა — განცხადება უფრო ადრე წაიშლება.', 'Note: this is shorter than the time it has left — the listing will be deleted sooner.'],
  'mk.p.add': ['დაემატება ახლანდელ ვადას ({a}). ახალი ვადა: {d}.', 'Added to its current deadline ({a}). New deadline: {d}.'],
  'mk.p.queued': ['დაემატება განხილვაზე მყოფ განცხადებას და დაიწყება გამოქვეყნებისას.', 'Added to the listing under review; it starts when it is published.'],
  'mk.p.warn': ['როცა რეკლამის დრო ამოიწურება, მთელი განცხადება ავტომატურად წაიშლება — ფოტოებით, ვიდეოთი და ხმით. თუ გინდა, რომ დარჩეს, ვადის ამოწურვამდე გააგრძელე.', 'When the advertisement’s time ends, the whole listing is deleted automatically — with its photos, video and sound. Extend it before then if you want it to stay.'],
  'mk.p.once': ['ერთჯერადი გადახდა. არაფერი განახლდება და არაფერი ჩამოგეჭრება შენი თანხმობის გარეშე.', 'A one-time payment. Nothing renews and nothing is charged without your consent.'],
  'mk.p.noPromise': ['რეკლამა მეტ ჩვენებას იძლევა, მაგრამ გაყიდვას, ზარს ან ნახვების რაოდენობას ვერ დაგპირდება.', 'An advertisement brings more showings; it cannot promise a sale, a call or a number of views.'],
  'mk.p.method': ['გადახდის მეთოდი', 'Payment method'], 'mk.p.pay': ['გადახდა · {p}', 'Pay {p}'],
  'mk.p.noPay': ['განცხადების გამოქვეყნება ჩაირთვება, როგორც კი ბარათით გადახდა გააქტიურდება. მონახაზი შენახულია.', 'Publishing switches on once card payment is activated. Your draft is saved.'],
  'mk.p.noStore': ['ამ ვერსიაში რეკლამის შეძენა ჯერ შეუძლებელია.', 'Advertisements cannot be bought in this version yet.'],
  'mk.p.safe': ['ბარათის მონაცემებს ფანდური ვერ ხედავს — მათ ბანკის ან PayPal-ის დაცულ გვერდზე შეიყვან.', 'Panduri never sees your card — you type it on the bank’s or PayPal’s secure page.'],
  'mk.p.store': ['App Store / Google Play', 'App Store / Google Play'], 'mk.p.storeD': ['გადახდა შენი მაღაზიის ანგარიშით', 'Paid with your store account'],
  /* back from paying */
  'mk.r.checking': ['ვამოწმებთ გადახდას ბანკთან…', 'Checking the payment with the bank…'],
  'mk.r.paid': ['გადახდა დადასტურდა — რეკლამა ჩაირთო.', 'Payment confirmed — the advertisement is on.'],
  'mk.r.queued': ['გადახდა დადასტურდა. განცხადება მოდერატორს ელოდება; ვადა გამოქვეყნებისას დაიწყება.', 'Payment confirmed. The listing waits for a moderator; its time starts when it is published.'],
  'mk.r.orphan': ['გადახდა დადასტურდა, მაგრამ განცხადება უკვე აღარ არსებობდა. თანხა დაგიბრუნდება — მოდერატორი ამას ხედავს.', 'The payment was confirmed, but the listing no longer existed. You will be refunded — a moderator can see this.'],
  'mk.r.notYet': ['გადახდა ჯერ არ დადასტურებულა. თუ თანხა ჩამოგეჭრა, რეკლამა თავად ჩაირთვება დადასტურებისთანავე.', 'The payment is not confirmed yet. If you were charged, the advertisement turns on by itself once it is confirmed.'],
  'mk.r.failed': ['გადახდა ვერ შესრულდა. თანხა არ ჩამოგეჭრა.', 'The payment did not go through. You were not charged.'],
  'mk.r.cancelled': ['გადახდა გაუქმდა. თანხა არ ჩამოგეჭრა.', 'The payment was cancelled. You were not charged.'],
  'mk.r.open': ['განცხადების ნახვა', 'View the listing'],
  'mk.e.listing-expired': ['ამ განცხადების ვადა უკვე ამოიწურა. ახალი განცხადება შექმენი.', 'This listing has already expired. Create a new one.'],
  'mk.e.photo-required': ['დაამატე ერთი ფოტო მაინც.', 'Add at least one photo.'], 'mk.e.not-found': ['განცხადება ვერ მოიძებნა.', 'Listing not found.'],
  'mk.e.objectionable-content': ['ტექსტში მიუღებელი სიტყვაა.', 'The text contains a word that is not allowed.'], 'mk.e.banned': ['შენი ანგარიში ვეღარ აქვეყნებს.', 'Your account can no longer post.'],
  'mk.e.slow-down': ['ძალიან ხშირად — ცოტა ხანში სცადე.', 'Too often — try again shortly.'],
  'mk.e.billing-not-configured': ['ეს გადახდის მეთოდი ჯერ არ არის ჩართული.', 'This payment method is not switched on yet.'],
  'mk.e.generic': ['ვერ მოხერხდა. სცადე თავიდან.', 'That did not work. Try again.'],
  /* messages */
  'mk.t.empty': ['ჯერ წერილი არ გაქვს.', 'No messages yet.'], 'mk.t.selling': ['ყიდი', 'Selling'], 'mk.t.buying': ['ყიდულობ', 'Buying'], 'mk.t.placeholder': ['წერილი…', 'Message…'],
  /* admin */
  'mk.a.revenue': ['რეკლამის შემოსავალი', 'Advertising revenue'], 'mk.a.activeAds': ['აქტიური რეკლამა', 'Active advertisements'],
  'mk.a.pending': ['განხილვას ელოდება', 'Waiting for review'], 'mk.a.expiring': ['იწურება 24 სთ-ში', 'Expiring within 24 h'], 'mk.a.deleted': ['წაშლილი 30 დღეში', 'Deleted in 30 days'],
  'mk.a.packages': ['პაკეტები', 'Packages'], 'mk.a.sold': ['გაყიდული: {n}', 'Sold: {n}'], 'mk.a.activeN': ['ახლა აქტიური: {n}', 'Active now: {n}'], 'mk.a.off': ['გამორთულია', 'Switched off'],
  'mk.a.editPkg': ['ფასის შეცვლა', 'Change price'], 'mk.a.pp': ['PayPal-ის ფასი (EUR/USD, არასავალდებულო)', 'PayPal price (EUR/USD, optional)'], 'mk.a.on': ['ჩართულია', 'Available'],
  'mk.a.ownerOnly': ['ფასებს მხოლოდ აპის მფლობელი ცვლის.', 'Only the app’s owner changes prices.'],
  'mk.a.premod': ['წინასწარი მოდერაცია', 'Review before publishing'], 'mk.a.premodD': ['ჩართვისას ყოველი განცხადება ჯერ მოდერატორს გადის; ფასიანი დრო მხოლოდ დამტკიცებისას იწყება.', 'When on, every listing is checked first; paid time starts only on approval.'],
  'mk.a.approve': ['დამტკიცება', 'Approve'], 'mk.a.reject': ['უარყოფა', 'Reject'], 'mk.a.rejectWhy': ['მიზეზი (გამყიდველი ნახავს)', 'Reason (the seller sees it)'],
  'mk.a.reports': ['შეტყობინებები', 'Reports'], 'mk.a.remove': ['განცხადების წაშლა', 'Delete the listing'], 'mk.a.dismiss': ['დარღვევა არ არის', 'Not a problem'],
  'mk.a.cleanup': ['ავტომატური წაშლა', 'Automatic deletion'], 'mk.a.lastRun': ['ბოლო გაშვება: {d}', 'Last run: {d}'], 'mk.a.never': ['ჯერ არ გაშვებულა — შეამოწმე pg_cron.', 'Never ran — check pg_cron.'],
  'mk.a.runs': ['24 საათში: {n} გაშვება, {f} შეცდომით', 'In 24 h: {n} runs, {f} with errors'],
  'mk.a.media': ['ფაილები: {w} რიგში, {f} ვერ წაიშალა, {d} წაიშალა 30 დღეში', 'Files: {w} queued, {f} failed, {d} deleted in 30 days'],
  'mk.a.retry': ['წარუმატებელი ფაილების ხელახლა ცდა', 'Retry failed files'], 'mk.a.errors': ['შეცდომები', 'Errors'],
  'mk.a.payments': ['გადახდები', 'Payments'], 'mk.a.orders': ['შეკვეთები: {s}', 'Orders: {s}'], 'mk.a.stale': ['დაუდასტურებელი (1 სთ-ზე ძველი)', 'Unconfirmed (older than 1 h)'],
  'mk.a.orphaned': ['გადახდილი, განცხადების გარეშე — დასაბრუნებელი', 'Paid without a listing — to refund'], 'mk.a.refund': ['დაბრუნება აღრიცხე', 'Record refund'],
  'mk.a.refundQ': ['ჯერ თანხა დააბრუნე ბანკის ან PayPal-ის პანელში, შემდეგ აქ აღრიცხე. გადახდილი საათები განცხადებას მოაკლდება.', 'Refund the money in the bank’s or PayPal’s dashboard first, then record it here. The paid hours come off the listing.'],
  'mk.a.recent': ['ბოლო გადახდები', 'Recent payments'], 'mk.a.history': ['წაშლილი განცხადებები', 'Deleted listings'], 'mk.a.expiringL': ['მალე იწურება', 'Expiring soon'],
  'mk.a.why.expired': ['ვადა', 'expired'], 'mk.a.why.seller': ['გამყიდველმა', 'by seller'], 'mk.a.why.admin': ['მოდერატორმა', 'by moderator'], 'mk.a.why.stale': ['მიტოვებული მონახაზი', 'abandoned draft'],
  'mk.a.paid': ['ფასიანი', 'paid'], 'mk.a.free': ['უფასო', 'free'], 'mk.a.none': ['არაფერია.', 'Nothing.'], 'mk.a.sale': ['ფასდაკლება {p} · {d}-მდე', 'On sale {p} · until {d}'],
  'mk.a.toSales': ['ფასდაკლებების მართვა', 'Manage discounts'],
  /* the owner's discounts (Premium and the marketplace) */
  'mk.sl.title': ['ფასდაკლებები', 'Discounts'],
  'mk.sl.lead': ['ფასდაკლება ნამდვილია: ჩართვისას მყიდველი გადაიხდის ფასდაკლებულ ფასს და დაინახავს ჩვეულებრივს გადახაზულს; დასრულების თარიღის შემდეგ ავტომატურად ისევ ჩვეულებრივი ფასი მოქმედებს და გადახაზული ფასი ქრება.', 'A discount is real: while it runs, buyers pay the sale price and see the regular one struck out; after its end date the regular price applies again by itself and the struck-out price disappears.'],
  'mk.sl.law': ['გადახაზული ფასი უნდა იყოს ის, რასაც მყიდველები ფასდაკლების გარეშე იხდიან — ამიტომ ფასდაკლებას ყოველთვის აქვს დასასრული.', 'The struck-out price must be what buyers pay without the discount — that is why a discount always has an end.'],
  'mk.sl.premium': ['პრემიუმი', 'Premium'], 'mk.sl.market': ['ბაზრის რეკლამა', 'Marketplace advertisements'],
  'mk.sl.regular': ['ჩვეულებრივი: {p}', 'Regular: {p}'], 'mk.sl.price': ['ფასდაკლებით (₾)', 'Sale price (₾)'], 'mk.sl.pp': ['PayPal ფასდაკლებით ({c})', 'PayPal sale price ({c})'],
  'mk.sl.until': ['დასრულდება', 'Ends'], 'mk.sl.on': ['ჩართვა', 'Turn on'], 'mk.sl.save': ['განახლება', 'Update'], 'mk.sl.off': ['გამორთვა', 'Turn off'],
  'mk.sl.running': ['მიმდინარეობს · −{n}% · დასრულდება {d}', 'Running · −{n}% · ends {d}'], 'mk.sl.stopped': ['გამორთულია — მოქმედებს ჩვეულებრივი ფასი', 'Off — the regular price applies'],
  'mk.sl.all': ['ყველა ფასდაკლების ჩართვა ერთად', 'Turn every discount on together'], 'mk.sl.allOff': ['ყველას გამორთვა', 'Turn all off'],
  'mk.sl.done': ['შენახულია.', 'Saved.'], 'mk.sl.bad': ['ფასდაკლებული ფასი ჩვეულებრივზე ნაკლები უნდა იყოს, თარიღი კი — მომავალში (მაქსიმუმ 1 წელი).', 'The sale price must be lower than the regular one, and the date in the future (at most a year).'],
  'mk.sl.need': ['ფასდაკლებებს მხოლოდ აპის მფლობელი მართავს.', 'Only the app’s owner manages discounts.'],
  'mk.a.ps.applied': ['ჩართული', 'applied'], 'mk.a.ps.queued': ['რიგში', 'queued'], 'mk.a.ps.orphaned': ['დასაბრუნებელი', 'to refund'], 'mk.a.ps.refunded': ['დაბრუნებული', 'refunded']
});

PD.market = (() => {
  const h = PD.h, C = PD.cloud;
  const SVG = (p, s = 20) => '<svg viewBox="0 0 24 24" width="' + s + '" height="' + s + '" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + '</svg>';
  const IC = {
    plus: SVG('<path d="M12 5v14M5 12h14"/>'), tag: SVG('<path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8" r="1.4"/>'),
    heart: SVG('<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>'), heartF: '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg>',
    chat: SVG('<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>'), phone: SVG('<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>'),
    share: SVG('<path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M16 6l-4-4-4 4M12 2v13"/>'), flag: SVG('<path d="M5 21V4h11l-2 4 2 4H5"/>'),
    clock: SVG('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>', 15), search: SVG('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>', 18),
    filter: SVG('<path d="M4 6h16M7 12h10M10 18h4"/>'), list: SVG('<path d="M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01"/>'), shield: SVG('<path d="M12 3 5 6v5c0 4.4 3 8.3 7 10 4-1.7 7-5.6 7-10V6z"/>'),
    video: SVG('<rect x="3" y="6" width="13" height="12" rx="2"/><path d="m16 10 5-3v10l-5-3z"/>', 14), audio: SVG('<path d="M9 18V6l10-2v12"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="16.5" cy="16" r="2.5"/>', 14),
    warn: SVG('<path d="M12 3 2 21h20z"/><path d="M12 10v5M12 18h.01"/>', 18), ok: SVG('<circle cx="12" cy="12" r="9"/><path d="m8 12.5 2.6 2.5L16 9.5"/>', 40),
    lock: SVG('<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>', 17), card: SVG('<rect x="2.5" y="5" width="19" height="14" rx="2.5"/><path d="M2.5 10h19M6 15h4"/>'),
    paypal: SVG('<path d="M7.5 20.5 10 4h6.2c2.8 0 4.3 1.7 3.8 4.3-.6 3.2-3 4.7-6 4.7h-2.4l-1.1 7.5z"/>'), store: SVG('<rect x="6.5" y="2.5" width="11" height="19" rx="2.5"/><path d="M11 18.5h2"/>'),
    x: SVG('<path d="M6 6l12 12M18 6 6 18"/>', 16), img: SVG('<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m21 16-5-5-9 9"/>')
  };
  const CATS = ['panduri', 'chonguri', 'instrument', 'parts', 'accessory'], CONDS = ['new', 'like_new', 'good', 'fair', 'repair'], SORTS = ['new', 'price_asc', 'price_desc', 'ending'];
  const ADS = ['ad24', 'ad72', 'ad168', 'ad720'];
  const rpc = (fn, args) => C.db.rpc(fn, args || {});
  const fn = body => C.market(body);
  const uid = () => C.uid;
  const moves = () => PD.ui.motion();

  /* ---------- time: the server's, shown here ---------- */
  let skew = 0;   // server clock − this device's clock: used only to draw the countdown
  const stamp = r => { if (r && r.now) { const s = Date.parse(r.now); if (isFinite(s)) skew = s - Date.now(); } return r; };
  const srvNow = () => Date.now() + skew;
  function span(ms) {
    const s = Math.max(0, Math.floor(ms / 1000)), d = Math.floor(s / 86400), hh = Math.floor(s % 86400 / 3600), mm = Math.floor(s % 3600 / 60);
    const u = (n, k) => t('mk.' + k + (n === 1 ? '1' : ''), { n });
    if (d > 0) return u(d, 'd') + (hh ? ', ' + u(hh, 'h') : '');
    if (hh > 0) return u(hh, 'h') + (mm ? ', ' + u(mm, 'm') : '');
    return u(Math.max(1, mm), 'm');
  }
  const loc = () => PD.i18n.locale || (PD.i18n.lang === 'ka' ? 'ka-GE' : 'en-US');
  // browsers do not all carry Georgian dates: "15 დეკემბერი, 12:47" is built here, as checkout.js does
  const KA_MON = ['იანვარი', 'თებერვალი', 'მარტი', 'აპრილი', 'მაისი', 'ივნისი', 'ივლისი', 'აგვისტო', 'სექტემბერი', 'ოქტომბერი', 'ნოემბერი', 'დეკემბერი'];
  const when = ms => { const d = new Date(ms), p2 = n => String(n).padStart(2, '0');
    if (PD.i18n.lang === 'ka') return d.getDate() + ' ' + KA_MON[d.getMonth()] + ', ' + p2(d.getHours()) + ':' + p2(d.getMinutes());
    try { return d.toLocaleString(loc(), { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' }); } catch (_) { return d.toISOString(); } };
  const money = (v, cur) => { const n = Number(v); try { return new Intl.NumberFormat(loc(), { style: 'currency', currency: cur || 'GEL', currencyDisplay: 'narrowSymbol', minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: n % 1 ? 2 : 0 }).format(n); } catch (_) { return n + ' ' + (cur || 'GEL'); } };
  const priceOf = it => it.price == null ? t('mk.agreed') : money(it.price, it.currency);
  const durName = hrs => hrs % 24 === 0 && hrs >= 72 ? t('mk.p.days', { n: hrs / 24 }) : t('mk.p.hours', { n: hrs });
  /** the countdown: text, and a thin bar of the lifetime that is left; copper, amber in the last day, red in the last hours */
  function countdown(it, big) {
    const end = Date.parse(it.expires_at), start = Date.parse(it.published_at);
    if (!isFinite(end)) return null;
    const el = h('div', { class: 'mk-cd' + (big ? ' big' : ''), 'data-exp': String(end), 'data-start': String(isFinite(start) ? start : end - 864e5), role: big ? 'timer' : null },
      [h('span', { class: 'mk-cd-t', html: IC.clock + '<span></span>' }), h('span', { class: 'mk-cd-bar', 'aria-hidden': 'true' }, [h('i')])]);
    tick(el);
    return el;
  }
  function tick(el) {
    const end = +el.dataset.exp, start = +el.dataset.start, left = end - srvNow(), all = Math.max(1, end - start);
    const tx = el.querySelector('.mk-cd-t span');
    tx.textContent = left > 0 ? t('mk.left', { t: span(left) }) : t('mk.ended');
    el.classList.toggle('soon', left > 0 && left < 864e5); el.classList.toggle('last', left > 0 && left < 3 * 3600e3); el.classList.toggle('over', left <= 0);
    el.querySelector('.mk-cd-bar i').style.width = Math.max(0, Math.min(100, left / all * 100)).toFixed(1) + '%';
    if (el.classList.contains('big')) el.title = t('mk.until', { d: when(end) });
  }
  setInterval(() => { document.querySelectorAll('.mk-cd[data-exp]').forEach(tick); }, 30000);

  /* ---------- the files (private `market` bucket: the server lets a file be read while its listing is live) ---------- */
  async function fill(root) {
    const imgs = [...root.querySelectorAll('img[data-path]:not([src]), video[data-path]:not([src]), audio[data-path]:not([src])')];
    if (!imgs.length) return;
    let map = {};
    try { map = await C.storage.urls(imgs.map(i => i.dataset.path), 'market'); } catch (_) {}
    imgs.forEach(i => { const u = map[i.dataset.path]; if (u) i.src = u; else i.closest('.mk-ph') && i.closest('.mk-ph').classList.add('none'); });
  }
  const photo = (path, alt) => h('span', { class: 'mk-ph' + (path ? '' : ' none') }, [path ? h('img', { 'data-path': path, alt: alt || '', loading: 'lazy', decoding: 'async' }) : h('span', { html: IC.img })]);

  /* ---------- statistics: a card on screen is counted once a day per viewer, by the server ---------- */
  const device = () => { let d = PD.store.get('mk.device', null); if (!d) { d = (crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2)); PD.store.set('mk.device', d); } return d; };
  const seenQ = { impression: new Set(), sponsored: new Set() }, sent = new Set();
  let seenT = 0;
  const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return; const el = e.target; io.unobserve(el);
    const k = el.dataset.sp ? 'sponsored' : 'impression', key = k + el.dataset.id;
    if (sent.has(key)) return; sent.add(key); seenQ[k].add(el.dataset.id);
    clearTimeout(seenT); seenT = setTimeout(flushSeen, 1500);
  }), { threshold: .6 }) : null;
  function flushSeen() {
    for (const k of ['impression', 'sponsored']) { const ids = [...seenQ[k]]; seenQ[k].clear(); if (ids.length) rpc('market_track', { ids, what: k, device: device() }).catch(() => {}); }
  }

  /* ---------- a card ---------- */
  function card(it, sp) {
    const el = h('button', { class: 'mk-card' + (sp ? ' sp' : ''), type: 'button', 'data-id': it.id, 'data-sp': sp ? '1' : null, onclick: () => PD.app.go('market', 'l:' + it.id) }, [
      h('span', { class: 'mk-card-ph' }, [photo(it.photo, it.title),
        it.sponsored ? h('em', { class: 'mk-badge', text: t('mk.sponsored') }) : null,
        it.video || it.audio ? h('span', { class: 'mk-media', html: (it.video ? IC.video : '') + (it.audio ? IC.audio : '') }) : null]),
      h('span', { class: 'mk-card-tx' }, [
        h('b', { class: 'mk-price', text: priceOf(it) }),
        h('span', { class: 'mk-name', text: it.title }),
        h('small', { class: 'mk-sub', text: [t('mk.c.' + it.category), it.city].filter(Boolean).join(' · ') }),
        countdown(it)])]);
    if (io) io.observe(el);
    return el;
  }
  const grid = items => { const g = h('div', { class: 'mk-grid' }); items.forEach(it => g.append(card(it, it._sp))); fill(g); return g; };
  const errText = e => { const m = String((e && (e.message || e.code)) || ''); const k = ['listing-expired', 'photo-required', 'not-found', 'objectionable-content', 'banned', 'slow-down', 'billing-not-configured'].find(x => m.includes(x)); return t(k ? 'mk.e.' + k : 'mk.e.generic'); };
  const missing = e => e && (e.code === 'PGRST202' || e.code === '42883' || /Could not find the function|does not exist/i.test(e.message || ''));
  function head(w, key, backTo, more) {
    w.append(h('div', { class: 'row pg-head mk-head' }, [h('button', { class: 'btn small backbtn', html: PD.ic.back + '<span class="sr" data-t="back"></span>', onclick: () => PD.app.back(backTo || 'community') }),
      h('h1', { class: 'grow', 'data-t': key, style: 'margin:0' })].concat(more || [])));
  }
  const iconBtn = (icon, key, onclick, badge) => h('button', { class: 'btn small mk-ib', type: 'button', 'aria-label': t(key), title: t(key), html: icon + (badge ? '<i class="mk-dot"></i>' : ''), onclick });
  const failBox = (w, e, again) => w.append(h('div', { class: 'mk-empty', role: 'status' }, [h('p', { text: missing(e) ? t('mk.notYet') : t('mk.err') }), again && !missing(e) ? h('button', { class: 'btn', 'data-t': 'mk.retry', onclick: again }) : null]));
  const loading = () => h('div', { class: 'mk-grid mk-skel', 'aria-busy': 'true' }, Array.from({ length: 4 }, () => h('div', { class: 'mk-card sk' }, [h('span', { class: 'mk-card-ph' }), h('span', { class: 'mk-card-tx' }, [h('i'), h('i'), h('i')])])));

  /* ======================================================== the marketplace's front page */
  const st = { q: '', cat: null, city: '', pmin: '', pmax: '', cond: null, sort: 'new' };
  const filtered = () => !!(st.q || st.cat || st.city || st.pmin || st.pmax || st.cond || st.sort !== 'new');
  function home(w) {
    head(w, 'mk.title', 'community', C.isAdmin ? [iconBtn(IC.shield, 'mk.admin', () => PD.app.go('market', 'admin'))] : []);
    w.append(h('p', { class: 'muted mk-lead', 'data-t': 'mk.lead' }));
    const link = (icon, key, to) => h('button', { class: 'btn small mk-link', type: 'button', html: icon + '<span data-t="' + key + '"></span>', onclick: () => need(() => PD.app.go('market', to)) });
    w.append(h('div', { class: 'mk-top' }, [h('button', { class: 'btn primary mk-add', html: IC.plus + '<span data-t="mk.add"></span>', onclick: () => need(() => PD.app.go('market', 'new')) }),
      h('div', { class: 'mk-links' }, [link(IC.list, 'mk.mine', 'mine'), link(IC.heart, 'mk.saved', 'saved'), link(IC.chat, 'mk.inbox', 'inbox')])]));
    const q = h('input', { type: 'search', 'aria-label': t('mk.search'), placeholder: t('mk.search'), value: st.q, enterkeyhint: 'search' });
    let qt = 0; q.oninput = () => { clearTimeout(qt); qt = setTimeout(() => { st.q = q.value.trim(); load(); }, 350); };
    const fbtn = h('button', { class: 'btn small mk-ib' + (filtered() && !st.q && !st.cat ? ' on' : ''), type: 'button', 'aria-label': t('mk.filters'), html: IC.filter, onclick: () => filterSheet(() => { draw(); load(); }) });
    w.append(h('div', { class: 'mk-bar' }, [h('label', { class: 'search grow' }, [h('span', { html: IC.search }), q]), fbtn]));
    const chips = h('div', { class: 'mk-chips', role: 'group', 'aria-label': t('mk.f.cat') });
    const draw = () => { chips.innerHTML = ''; [null].concat(CATS).forEach(c => chips.append(h('button', { class: 'chip', type: 'button', 'aria-pressed': String(st.cat === c), text: t(c ? 'mk.c.' + c : 'mk.all'), onclick: () => { st.cat = c; draw(); load(); } }))); fbtn.classList.toggle('on', !!(st.city || st.pmin || st.pmax || st.cond || st.sort !== 'new')); };
    draw(); w.append(chips);
    const carousel = h('section', { class: 'mk-sec', hidden: true }), results = h('section', { class: 'mk-sec' });
    w.append(carousel, results);
    let page = 0, items = [], seq = 0;
    async function featuredRow() {
      try {
        const r = stamp(await rpc('market_featured', { cat: null, lim: 10 }));
        if (!w.isConnected || !r.items.length || filtered()) { carousel.hidden = true; return; }
        carousel.hidden = false; carousel.innerHTML = '';
        const row = h('div', { class: 'mk-rail', role: 'list' });
        r.items.forEach(it => { const c = card(it, true); c.setAttribute('role', 'listitem'); row.append(c); });
        carousel.append(h('div', { class: 'mk-sec-h' }, [h('h2', { 'data-t': 'mk.featured' }), h('small', { class: 'mk-sp-l', text: t('mk.sponsored') })]), row);
        fill(row); PD.i18n.apply(carousel);
      } catch (_) { carousel.hidden = true; }
    }
    async function load(more) {
      const my = ++seq;
      if (!more) { page = 0; items = []; results.innerHTML = ''; results.append(loading()); carousel.hidden = filtered() || carousel.hidden; if (!filtered()) featuredRow(); else carousel.hidden = true; }
      let r;
      try { r = stamp(await rpc('market_search', { term: st.q, cat: st.cat, place: st.city || null, pmin: st.pmin === '' ? null : +st.pmin, pmax: st.pmax === '' ? null : +st.pmax, cond: st.cond, sort: st.sort, lim: 24, off: page * 24 })); }
      catch (e) { if (my !== seq || !w.isConnected) return; results.innerHTML = ''; failBox(results, e, () => load()); return; }
      if (my !== seq || !w.isConnected) return;
      const sp = page === 0 && filtered() ? (r.sponsored || []).map(x => Object.assign(x, { _sp: true })) : [];
      const spIds = new Set(sp.map(x => x.id));
      const organic = r.items.filter(x => !spIds.has(x.id));
      items = items.concat(organic);
      if (!more) results.innerHTML = '';
      results.querySelectorAll('.mk-more').forEach(x => x.remove());
      if (!more) results.append(h('div', { class: 'mk-sec-h' }, [h('h2', { 'data-t': 'mk.results' })]));
      if (!more && !sp.length && !organic.length) { results.append(h('div', { class: 'mk-empty' }, [h('p', { 'data-t': filtered() ? 'mk.emptyQ' : 'mk.empty' }), h('button', { class: 'btn', 'data-t': 'mk.add', onclick: () => need(() => PD.app.go('market', 'new')) })])); PD.i18n.apply(results); return; }
      let g = results.querySelector('.mk-grid');
      if (!g) { g = h('div', { class: 'mk-grid' }); results.append(g); }
      // sponsored places: first, then one after every eight ordinary listings
      const list = more ? organic : (() => { const out = []; let s = 0; if (sp[s]) out.push(sp[s++]); organic.forEach((x, i) => { out.push(x); if ((i + 1) % 8 === 0 && sp[s]) out.push(sp[s++]); }); while (sp[s]) out.push(sp[s++]); return out; })();
      list.forEach(it => g.append(card(it, it._sp)));
      fill(g);
      if (r.items.length === 24) results.append(h('button', { class: 'btn mk-more', 'data-t': 'mk.more', onclick: () => { page++; load(true); } }));
      PD.i18n.apply(results);
    }
    load();
  }
  function filterSheet(done) {
    PD.ui.sheet((box, close) => {
      const city = h('input', { class: 'input', value: st.city, autocomplete: 'address-level2', 'aria-label': t('mk.city') });
      const pmin = h('input', { class: 'input', type: 'number', inputmode: 'decimal', min: '0', value: st.pmin, 'aria-label': t('mk.pmin') });
      const pmax = h('input', { class: 'input', type: 'number', inputmode: 'decimal', min: '0', value: st.pmax, 'aria-label': t('mk.pmax') });
      const sel = (list, val, pre, any) => { const s = h('select', { class: 'input' }); if (any) s.append(h('option', { value: '', text: t('mk.any') })); list.forEach(v => s.append(h('option', { value: v, text: t(pre + v), selected: v === val }))); s.value = val || ''; return s; };
      const cond = sel(CONDS, st.cond, 'mk.k.', true), sort = sel(SORTS, st.sort, 'mk.s.', false);
      const f = (k, el) => h('label', { class: 'field mk-field' }, [h('span', { 'data-t': k }), el]);
      box.classList.add('mk-sheet');
      box.append(h('h2', { 'data-t': 'mk.filters' }), f('mk.city', city), h('div', { class: 'mk-two' }, [f('mk.pmin', pmin), f('mk.pmax', pmax)]), f('mk.cond', cond), f('mk.sort', sort),
        h('div', { class: 'row mk-acts' }, [
          h('button', { class: 'btn primary', 'data-t': 'mk.apply', onclick: () => { Object.assign(st, { city: city.value.trim(), pmin: pmin.value, pmax: pmax.value, cond: cond.value || null, sort: sort.value || 'new' }); close(); done(); } }),
          h('button', { class: 'btn', 'data-t': 'mk.reset', onclick: () => { Object.assign(st, { city: '', pmin: '', pmax: '', cond: null, sort: 'new' }); close(); done(); } })]));
    });
  }
  function need(go) { if (!C.session) { PD.ui.toast(t('mk.signin'), 3500); PD.auth.open(); return; } go(); }

  /* ======================================================== one listing */
  async function detail(w, id) {
    head(w, 'mk.title', 'market');
    const body = h('div', { class: 'mk-detail', 'aria-busy': 'true' }, [h('div', { class: 'mk-gal sk' })]);
    w.append(body);
    let it;
    try { it = stamp(await rpc('market_get', { listing: id })); } catch (e) { body.innerHTML = ''; failBox(body, e, () => PD.app.render(true)); return; }
    if (!w.isConnected) return;
    body.innerHTML = ''; body.removeAttribute('aria-busy');
    if (!it) { body.append(h('div', { class: 'mk-empty' }, [h('p', { 'data-t': 'mk.gone' }), h('button', { class: 'btn primary', 'data-t': 'mk.toMarket', onclick: () => PD.app.go('market') })])); PD.i18n.apply(body); return; }
    if (it.live && !it.mine) rpc('market_track', { ids: [it.id], what: 'view', device: device() }).catch(() => {});
    // the gallery: photos side by side (swipe on a phone), then the video and the sound
    const gal = h('div', { class: 'mk-gal', role: 'list', 'aria-label': t('mk.photos') }, (it.media || []).map((p, i) => h('div', { class: 'mk-slide', role: 'listitem' }, [photo(p, it.title + ' · ' + (i + 1))])));
    body.append(gal);
    if (it.video_path || it.audio_path) body.append(h('div', { class: 'mk-av' }, [
      it.video_path ? h('figure', {}, [h('video', { 'data-path': it.video_path, controls: true, playsinline: true, preload: 'metadata' }), h('figcaption', { html: IC.video + '<span data-t="mk.video"></span>' })]) : null,
      it.audio_path ? h('figure', {}, [h('audio', { 'data-path': it.audio_path, controls: true, preload: 'none' }), h('figcaption', { html: IC.audio + '<span data-t="mk.audio"></span>' })]) : null]));
    const info = h('div', { class: 'mk-info' });
    info.append(h('div', { class: 'mk-tags' }, [it.sponsored ? h('em', { class: 'mk-badge', text: t('mk.sponsored') }) : null, it.mine && !it.live ? h('em', { class: 'mk-pill s-' + it.status, text: t('mk.st.' + it.status) }) : null,
      h('span', { class: 'mk-tag', text: t('mk.c.' + it.category) }), h('span', { class: 'mk-tag', text: t('mk.k.' + it.condition) })]));
    info.append(h('h2', { class: 'mk-title', text: it.title }), h('div', { class: 'mk-pricebig' }, [h('b', { text: priceOf(it) }), it.negotiable ? h('small', { 'data-t': 'mk.neg' }) : null]));
    if (it.city) info.append(h('p', { class: 'muted mk-city', text: it.city }));
    if (it.live) info.append(countdown(it, true));
    if (it.body) info.append(h('p', { class: 'mk-body', text: it.body }));
    body.append(info);
    // the seller
    const s = it.seller || {};
    body.append(h('button', { class: 'mk-seller', type: 'button', onclick: () => PD.app.go('market', 'seller:' + s.id) }, [
      h('span', { class: 'avatar', html: s.avatar ? '<img alt="" src="' + PD.esc(s.avatar) + '">' : PD.esc((s.name || '?').slice(0, 1).toUpperCase()) }),
      h('span', { class: 'grow' }, [h('small', { 'data-t': 'mk.seller' }), h('b', { text: s.name || '—' })]), h('span', { class: 'chev', html: PD.ic.chevron })]));
    if (it.mine) mineTools(body, it); else if (it.live) buyerTools(body, it);
    fill(body);
    if (it.live) {
      // featured places on a listing's page: other advertised instruments of the same kind
      rpc('market_featured', { cat: it.category, lim: 6, skip: it.id }).then(r => {
        if (!w.isConnected || !r || !r.items.length) return;
        const row = h('div', { class: 'mk-rail' }); r.items.forEach(x => row.append(card(x, true)));
        w.append(h('section', { class: 'mk-sec' }, [h('div', { class: 'mk-sec-h' }, [h('h2', { 'data-t': 'mk.featured' }), h('small', { class: 'mk-sp-l', text: t('mk.sponsored') })]), row]));
        fill(row); PD.i18n.apply(w);
      }).catch(() => {});
    }
    PD.i18n.apply(w);
  }
  function buyerTools(body, it) {
    const acts = h('div', { class: 'mk-acts2' });
    const phoneBtn = h('button', { class: 'btn primary', html: IC.phone + '<span data-t="mk.phone"></span>', onclick: () => need(async () => {
      phoneBtn.disabled = true;
      try { const p = await rpc('market_contact', { listing: it.id }); if (p) phoneBtn.replaceWith(h('a', { class: 'btn primary', href: 'tel:' + String(p).replace(/[^0-9+]/g, ''), html: IC.phone + '<span>' + PD.esc(t('mk.call', { p })) + '</span>' })); else { PD.ui.toast(t('mk.noPhone'), 3500); phoneBtn.disabled = false; } }
      catch (e) { PD.ui.toast(errText(e)); phoneBtn.disabled = false; }
    }) });
    if (it.has_phone) acts.append(phoneBtn);
    acts.append(h('button', { class: 'btn' + (it.has_phone ? '' : ' primary'), html: IC.chat + '<span data-t="mk.write"></span>', onclick: () => need(() => compose(it)) }));
    let saved = !!it.saved;
    const sv = h('button', { class: 'btn', 'aria-pressed': String(saved), onclick: () => need(async () => {
      try { await rpc('market_favorite', { listing: it.id, keep: !saved }); saved = !saved; drawSave(); } catch (e) { PD.ui.toast(errText(e)); }
    }) });
    const drawSave = () => { sv.setAttribute('aria-pressed', String(saved)); sv.innerHTML = (saved ? IC.heartF : IC.heart) + '<span>' + PD.esc(t(saved ? 'mk.unsave' : 'mk.save')) + '</span>'; };
    drawSave();
    acts.append(sv, h('button', { class: 'btn', html: IC.share + '<span data-t="mk.share"></span>', onclick: () => share(it) }),
      h('button', { class: 'btn quiet', html: IC.flag + '<span data-t="mk.report"></span>', onclick: () => need(() => report(it)) }));
    body.append(acts);
  }
  function mineTools(body, it) {
    const s = it.stats || {};
    if (!it.live) body.append(h('p', { class: 'notice', text: it.status === 'pending' ? t('mk.pendingD') : it.status === 'draft' ? t('mk.draftD') : it.status === 'rejected' ? t('mk.st.rejected') + (it.reject_reason ? ': ' + it.reject_reason : '') : t('mk.gone') }));
    body.append(h('section', { class: 'mk-stats' }, [h('h3', { 'data-t': 'mk.stats' }), h('div', { class: 'mk-stat-g' }, [['impressions', 'impressions'], ['sponsored_impressions', 'sponsored'], ['views', 'views'], ['contacts', 'contacts'], ['favorites', 'favorites']].map(([k, l]) => h('div', { class: 'mk-stat' }, [h('b', { text: String(s[k] || 0) }), h('small', { 'data-t': 'mk.st.' + l })]))),
      h('p', { class: 'muted mk-note', 'data-t': 'mk.stNote' })]));
    const acts = h('div', { class: 'mk-acts2' });
    if (it.live || it.status === 'draft' || it.status === 'pending') acts.append(h('button', { class: 'btn primary', html: IC.tag + '<span>' + PD.esc(t(it.live && it.sponsored ? 'mk.extend' : it.status === 'draft' ? 'mk.finish' : 'mk.promote')) + '</span>', onclick: () => PD.app.go('market', 'promote:' + it.id) }));
    if (it.live || it.status === 'draft' || it.status === 'pending') acts.append(h('button', { class: 'btn', 'data-t': 'mk.edit', onclick: () => PD.app.go('market', 'edit:' + it.id) }));
    if (it.live) acts.append(h('button', { class: 'btn', html: IC.share + '<span data-t="mk.share"></span>', onclick: () => share(it) }));
    acts.append(h('button', { class: 'btn quiet danger', 'data-t': 'mk.delete', onclick: () => PD.ui.confirm(t('mk.deleteQ'), async () => {
      try { await rpc('market_delete', { listing: it.id }); PD.ui.toast(t('mk.deleted')); PD.app.go('market', 'mine', true); } catch (e) { PD.ui.toast(errText(e)); }
    }) }));
    body.append(acts);
  }
  function share(it) {
    const url = location.origin + location.pathname + '?go=' + encodeURIComponent('market:l:' + it.id);
    if (navigator.share) navigator.share({ title: it.title, text: it.title + ' · ' + priceOf(it), url }).catch(() => {});
    else if (navigator.clipboard) navigator.clipboard.writeText(url).then(() => PD.ui.toast(t('mk.copied')), () => {});
  }
  function compose(it, buyer, after) {
    PD.ui.sheet((box, close) => {
      const ta = h('textarea', { class: 'input mk-ta', maxlength: '1000', rows: '4', placeholder: t('mk.writeP'), 'aria-label': t('mk.writeT') });
      const go = h('button', { class: 'btn primary', 'data-t': 'mk.send', onclick: async () => {
        const v = ta.value.trim(); if (!v) return ta.focus();
        go.disabled = true;
        try { await rpc('market_send', { listing: it.id, body: v, buyer: buyer || null }); close(); PD.ui.toast(t('mk.sent')); if (after) after(); else PD.app.go('market', 't:' + it.id + ':' + (buyer || uid())); }
        catch (e) { PD.ui.toast(errText(e)); go.disabled = false; }
      } });
      box.classList.add('mk-sheet');
      box.append(h('h2', { 'data-t': 'mk.writeT' }), h('p', { class: 'muted', text: it.title }), ta, h('div', { class: 'row mk-acts' }, [go, h('button', { class: 'btn', 'data-t': 'cancel', onclick: close })]));
    });
  }
  function report(it) {
    PD.ui.sheet((box, close) => {
      box.classList.add('mk-sheet');
      box.append(h('h2', { 'data-t': 'mk.report' }), h('div', { class: 'mk-opts' }, ['fake', 'spam', 'wrong', 'abuse', 'other'].map(r => h('button', { class: 'btn', 'data-t': 'mk.r.' + r, onclick: async () => {
        try { await rpc('market_report', { listing: it.id, why: r }); close(); PD.ui.toast(t('mk.reported')); } catch (e) { PD.ui.toast(errText(e)); }
      } }))));
    });
  }

  /* ======================================================== the form */
  async function form(w, id) {
    head(w, id ? 'mk.editT' : 'mk.newT', id ? 'market' : 'market');
    let cur = null;
    if (id) {
      try { cur = stamp(await rpc('market_get', { listing: id })); } catch (e) { failBox(w, e); return; }
      if (!w.isConnected) return;
      if (!cur || !cur.mine) { w.append(h('div', { class: 'mk-empty' }, [h('p', { 'data-t': 'mk.gone' })])); PD.i18n.apply(w); return; }
    }
    const v = cur || { title: '', body: '', category: 'panduri', condition: 'good', price: null, currency: 'GEL', negotiable: false, city: '', phone: '', media: [] };
    const inp = (k, attrs) => h('input', Object.assign({ class: 'input', 'aria-label': t(k) }, attrs));
    const title = inp('mk.f.title', { value: v.title, maxlength: '90', placeholder: t('mk.f.titleP'), required: true });
    const sel = (list, val, pre) => { const s = h('select', { class: 'input' }); list.forEach(x => s.append(h('option', { value: x, text: t(pre + x) }))); s.value = val; return s; };
    const cat = sel(CATS, v.category, 'mk.c.'), cond = sel(CONDS, v.condition, 'mk.k.');
    const price = inp('mk.f.price', { type: 'number', inputmode: 'decimal', min: '0', step: '1', value: v.price == null ? '' : String(Number(v.price)), placeholder: t('mk.f.priceP') });
    const curr = h('select', { class: 'input mk-cur', 'aria-label': t('mk.price') }, ['GEL', 'USD', 'EUR'].map(c => h('option', { value: c, text: c }))); curr.value = v.currency || 'GEL';
    const neg = h('input', { type: 'checkbox' }); neg.checked = !!v.negotiable;
    const city = inp('mk.f.city', { value: v.city || '', maxlength: '40', autocomplete: 'address-level2' });
    const phone = inp('mk.f.phone', { type: 'tel', value: v.phone || '', maxlength: '20', autocomplete: 'tel', inputmode: 'tel' });
    const text = h('textarea', { class: 'input mk-ta', rows: '6', maxlength: '3000', placeholder: t('mk.f.bodyP'), 'aria-label': t('mk.f.body') }); text.value = v.body || '';
    const f = (k, el, note) => h('label', { class: 'field mk-field' }, [h('span', { 'data-t': k }), el, note ? h('small', { class: 'muted', 'data-t': note }) : null]);
    // the files: what the listing has (paths) and what was just chosen (prepared blobs), in order
    const media = { photos: (v.media || []).map(p => ({ path: p })), video: v.video_path ? { path: v.video_path } : null, audio: v.audio_path ? { path: v.audio_path } : null };
    const tray = h('div', { class: 'mk-tray' });
    function drawTray() {
      tray.innerHTML = '';
      const thumb = (m, label, onrm) => h('div', { class: 'mk-th' }, [m.url ? h('img', { src: m.url, alt: '' }) : m.path && m.kind !== 'video' && m.kind !== 'audio' && !/\.(mp4|mov|webm|m4a|mp3|wav|aac|ogg|flac)$/i.test(m.path) ? h('img', { 'data-path': m.path, alt: '' }) : h('span', { class: 'mk-th-k', text: label }),
        h('button', { class: 'mk-th-x', type: 'button', 'aria-label': t('mk.f.remove'), html: IC.x, onclick: onrm })]);
      media.photos.forEach((m, i) => tray.append(thumb(m, '', () => { media.photos.splice(i, 1); drawTray(); })));
      if (media.video) tray.append(thumb(media.video, t('mk.video'), () => { media.video = null; drawTray(); }));
      if (media.audio) tray.append(thumb(media.audio, t('mk.audio'), () => { media.audio = null; drawTray(); }));
      const add = (k, icon, accept, kind, on) => on && tray.append(h('button', { class: 'mk-th add', type: 'button', html: icon + '<span>' + PD.esc(t(k)) + '</span>', onclick: async () => {
        const file = await PD.ui.pickFile(accept); if (!file) return;
        try { const p = await PD.social.prepare(file, kind); const m = { prep: p, kind, url: kind === 'photo' ? URL.createObjectURL(p.blob) : null };
          if (kind === 'photo') media.photos.push(m); else media[kind] = m; drawTray(); }
        catch (e) { PD.ui.toast(PD.social.fileErr(e), 3500); }
      } }));
      add('mk.f.addPhoto', IC.img, 'image/*', 'photo', media.photos.length < 8);
      add('mk.f.addVideo', IC.video, 'video/*', 'video', !media.video);
      add('mk.f.addAudio', IC.audio, PD.social.ACCEPT.audio, 'audio', !media.audio);
      fill(tray);
    }
    drawTray();
    const msg = h('p', { class: 'ag-msg', hidden: true, role: 'alert' });
    const go = h('button', { class: 'btn primary big mk-go', 'data-t': id ? 'mk.f.saveEdit' : 'mk.f.next', onclick: submit });
    w.append(h('div', { class: 'mk-form' }, [
      f('mk.f.title', title), h('div', { class: 'mk-two' }, [f('mk.f.cat', cat), f('mk.f.cond', cond)]),
      h('div', { class: 'mk-two mk-pr' }, [f('mk.f.price', price), f('mk.price', curr)]),
      h('label', { class: 'mk-check' }, [neg, h('span', { 'data-t': 'mk.f.neg' })]),
      h('div', { class: 'mk-two' }, [f('mk.f.city', city), f('mk.f.phone', phone)]), h('small', { class: 'muted mk-note', 'data-t': 'mk.f.phoneD' }),
      f('mk.f.body', text),
      h('div', { class: 'mk-field' }, [h('span', { class: 'mk-lbl', 'data-t': 'mk.f.media' }), h('small', { class: 'muted', 'data-t': 'mk.f.mediaD' }), tray]),
      msg, go]));
    const say = k => { msg.hidden = false; msg.textContent = k; };
    async function submit() {
      msg.hidden = true;
      if (title.value.trim().length < 3) { say(t('mk.f.needTitle')); return title.focus(); }
      if (!media.photos.length) return say(t('mk.f.needPhoto'));
      if (phone.value.trim() && !/^\+?[0-9 ()-]{6,20}$/.test(phone.value.trim())) { say(t('mk.f.badPhone')); return phone.focus(); }
      go.disabled = true; go.classList.add('is-loading');
      try {
        const fields = { title: title.value.trim(), body: text.value.trim(), category: cat.value, condition: cond.value, price: price.value === '' ? '' : String(Math.max(0, Number(price.value))),
          currency: curr.value, negotiable: neg.checked, city: city.value.trim(), phone: phone.value.trim() };
        const lid = await rpc('market_save', { listing: id || null, f: fields });
        // the new files, into <me>/<listing>/
        const fresh = [...media.photos.filter(m => m.prep), media.video && media.video.prep ? media.video : null, media.audio && media.audio.prep ? media.audio : null].filter(Boolean);
        let done = 0;
        for (const m of fresh) {
          const ext = m.prep.ext || 'bin', path = uid() + '/' + lid + '/' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7) + '.' + ext;
          const blob = m.prep.blob.type ? m.prep.blob : new Blob([m.prep.blob], { type: m.kind === 'photo' ? 'image/jpeg' : m.kind === 'video' ? 'video/mp4' : 'audio/mp4' });
          await C.storage.upload(path, blob, p => { go.textContent = t('mk.f.uploading', { p: Math.round((done + p) / fresh.length * 100) }); }, 'market');
          m.path = path; done++;
        }
        await rpc('market_set_media', { listing: lid, photo_paths: media.photos.map(m => m.path), video: media.video ? media.video.path : null, audio: media.audio ? media.audio.path : null });
        PD.app.go('market', id ? 'l:' + lid : 'promote:' + lid, true);
      } catch (e) {
        say(e && e.code === 'too-large' ? PD.social.fileErr(e) : errText(e));
        go.disabled = false; go.classList.remove('is-loading'); go.textContent = t(id ? 'mk.f.saveEdit' : 'mk.f.next');
      }
    }
    PD.i18n.apply(w);
  }

  /* ======================================================== choosing (or extending) the advertisement */
  async function promote(w, id) {
    head(w, 'mk.p.title', 'market');
    const box = h('div', { class: 'mk-pro', 'aria-busy': 'true' }, [loading()]);
    w.append(box);
    let it, cat = null, pk = [];
    try {
      [it, pk] = await Promise.all([rpc('market_get', { listing: id }).then(stamp), C.db.select('market_packages', { select: 'id,kind,hours,price_minor,sale_minor,sale_until,currency,name_ka,name_en,active', order: 'sort.asc' })]);
      if (C.session && !PD.billing.native) cat = await fn({ action: 'catalog' }).catch(() => null);
      else if (C.session && PD.billing.native) cat = await fn({ action: 'catalog' }).catch(() => null);
    } catch (e) { box.innerHTML = ''; failBox(box, e, () => PD.app.render(true)); return; }
    if (!w.isConnected) return;
    box.innerHTML = ''; box.removeAttribute('aria-busy');
    if (!it || !it.mine || (!it.live && !['draft', 'pending'].includes(it.status))) { box.append(h('div', { class: 'mk-empty' }, [h('p', { 'data-t': 'mk.gone' }), h('button', { class: 'btn', 'data-t': 'mk.toMarket', onclick: () => PD.app.go('market') })])); PD.i18n.apply(box); return; }
    const draft = it.status === 'draft', pending = it.status === 'pending', paidNow = it.live && it.sponsored;
    const h1 = w.querySelector('.mk-head h1'); h1.setAttribute('data-t', draft ? 'mk.p.title' : paidNow ? 'mk.p.titleX' : 'mk.p.titleAd'); h1.textContent = t(h1.getAttribute('data-t'));
    const name = p => PD.i18n.pick({ ka: p.name_ka, en: p.name_en });
    const ads = pk.filter(p => p.kind === 'ad' && p.active && ADS.includes(p.id));
    let choice = ads[0] && ads[0].id, method = null;
    // native: the store's own prices
    let storeP = {};
    if (PD.billing.native && cat && cat.stores && cat.stores.products) { try { storeP = await PD.billing.consumablePrices(Object.values(cat.stores.products)); } catch (_) { storeP = {}; } }
    const providers = PD.billing.native ? (Object.keys(storeP).length ? [{ id: 'store', prices: Object.fromEntries(ads.filter(p => cat.stores.products[p.id] && storeP[cat.stores.products[p.id]]).map(p => [p.id, { display: storeP[cat.stores.products[p.id]] }])) }] : [])
      : ((cat && cat.providers) || []);
    box.append(h('p', { class: 'muted', 'data-t': 'mk.p.lead' }));
    if (it.live) box.append(h('div', { class: 'mk-now' }, [h('b', { text: it.title }), countdown(it, true)]));
    const cards = h('div', { class: 'mk-plans', role: 'radiogroup', 'aria-label': t('mk.p.title') });
    const what = h('div', { class: 'mk-what' }), methods = h('div', { class: 'pay-methods', role: 'radiogroup', 'aria-label': t('mk.p.method') });
    const methodsWrap = h('div', {}, [h('h2', { class: 'pay-h', 'data-t': 'mk.p.method' }), methods]);
    const msg = h('p', { class: 'ag-msg', hidden: true, role: 'status' });
    const go = h('button', { class: 'btn primary big mk-go', onclick: act });
    const perks = h('ul', { class: 'mk-perks', 'aria-label': t('mk.p.lead') }, ['mk.p.perk1', 'mk.p.perk2', 'mk.p.perk3'].map(k => h('li', { 'data-t': k })));
    box.append(cards, perks, h('h2', { class: 'pay-h', 'data-t': 'mk.p.what' }), what, methodsWrap, go, msg,
      h('p', { class: 'pay-safe mk-note', html: IC.lock + '<span>' + PD.esc(t('mk.p.once')) + '</span>' }), h('p', { class: 'muted mk-note', 'data-t': 'mk.p.noPromise' }));
    // the price charged now, as the server sends it (a running sale's, or the regular one); without a payment method, from the price list
    const priceOf2 = p => { const pv = providers.find(x => x.id === method) || providers[0], pr = pv && pv.prices && pv.prices[p.id];
      if (pr) return pr;
      const on = p.sale_minor > 0 && p.sale_minor < p.price_minor && p.sale_until && Date.parse(p.sale_until) > srvNow();
      return on ? { value: (p.sale_minor / 100).toFixed(2), currency: p.currency, regular: (p.price_minor / 100).toFixed(2), until: p.sale_until } : { value: (p.price_minor / 100).toFixed(2), currency: p.currency }; };
    const priceText = p => { const pr = priceOf2(p); return pr.display || money(pr.value, pr.currency); };
    const saleOf = p => PD.billing.sale(priceOf2(p));
    function draw() {
      cards.innerHTML = '';
      const opt = (p, title, sub, flag) => { const sl = saleOf(p); return h('button', { class: 'mk-plan' + (sl ? ' on-sale' : ''), role: 'radio', type: 'button', 'aria-checked': String(choice === p.id), onclick: () => { choice = p.id; draw(); } }, [
        sl ? h('em', { class: 'pay-off', text: t('mk.p.off', { n: sl.pct }) }) : flag ? h('em', { text: flag }) : null, h('span', { class: 'mk-plan-n', text: title }),
        h('span', { class: 'mk-plan-p' }, [sl ? h('s', { class: 'price-was', 'aria-label': t('mk.p.was'), text: money(sl.regular.value, sl.regular.currency) }) : null, priceText(p)]), h('small', { class: 'mk-plan-d', text: sub }),
        // a true comparison, not a struck-out price: what one day costs in each package (the longer one is cheaper per day)
        (() => { const pr = priceOf2(p); return pr.display || p.hours < 48 ? null : h('small', { class: 'mk-plan-day', text: t('mk.p.perDay', { p: money((Number(pr.value) / (p.hours / 24)).toFixed(2), pr.currency) }) }); })(),
        h('span', { class: 'pay-radio', 'aria-hidden': 'true' })]); };
      ads.forEach(p => cards.append(opt(p, name(p), it.live ? t('mk.p.plus', { t: durName(p.hours) }) : durName(p.hours),
        p.id === 'ad24' ? t('mk.p.fast') : p.id === 'ad720' ? t('mk.p.best') : null)));
      // what this choice does to the listing's life, from the server's clock
      what.innerHTML = '';
      const now = srvNow(), p = pk.find(x => x.id === choice), hrs = p ? p.hours : 720, line = (cls, text) => what.append(h('p', { class: cls, text }));
      const premod = !!(it.status === 'pending');
      if (pending) line('', t('mk.p.queued'));
      else if (!it.live) { line('', t('mk.p.starts')); line('', t('mk.p.ends', { d: when(now + hrs * 3600e3) })); }
      else if (it.sponsored) line('', t('mk.p.add', { a: when(Date.parse(it.expires_at)), d: when(Date.parse(it.expires_at) + hrs * 3600e3) }));
      else { const nd = now + hrs * 3600e3; line('', t('mk.p.replace', { a: when(Date.parse(it.expires_at)), d: when(nd) })); if (nd < Date.parse(it.expires_at)) line('mk-shorter', t('mk.p.shorter')); }
      if (premod) line('muted', t('mk.p.startsMod'));
      what.append(h('div', { class: 'mk-warn', role: 'note', html: IC.warn + '<span>' + PD.esc(t('mk.p.warn')) + '</span>' }));
      // how to pay
      methods.innerHTML = ''; msg.hidden = true;
      const sl = p && saleOf(p);
      if (sl) line('mk-sale-end', t('mk.p.saleEnds', { d: when(sl.until.getTime()), p: money(sl.regular.value, sl.regular.currency) }));
      methodsWrap.hidden = false;
      const usable = providers.filter(x => x.prices && x.prices[choice]);
      if (!usable.find(x => x.id === method)) method = usable[0] ? usable[0].id : null;
      const row = (id2, icon, title, sub) => methods.append(h('button', { class: 'pay-m', role: 'radio', type: 'button', 'aria-checked': String(method === id2), onclick: () => { method = id2; draw(); } }, [
        h('span', { class: 'pay-m-ic', html: icon }), h('span', { class: 'pay-m-tx' }, [h('b', { text: title }), h('small', { text: sub })]), h('span'), h('span', { class: 'pay-radio', 'aria-hidden': 'true' })]));
      usable.forEach(x => x.id === 'store' ? row('store', IC.store, t('mk.p.store'), t('mk.p.storeD')) : x.id === 'tbc' ? row('tbc', IC.card, t('pay.card'), t('pay.cardTBC')) : x.id === 'paypal-card' ? row('paypal-card', IC.card, t('pay.card'), t('pay.cardPP')) : row('paypal', IC.paypal, t('pay.paypal'), t('pay.paypalD')));
      if (!usable.length) { methodsWrap.hidden = true; msg.hidden = false; msg.className = 'ag-msg info'; msg.textContent = t(PD.billing.native ? 'mk.p.noStore' : 'mk.p.noPay'); go.disabled = true; go.innerHTML = '<span>' + PD.esc(t('mk.p.pay', { p: priceText(p) })) + '</span>'; }
      else { go.disabled = false; go.innerHTML = IC.lock + '<span>' + PD.esc(t('mk.p.pay', { p: priceText(p) })) + '</span>'; }
      PD.i18n.apply(box);
    }
    async function act() {
      go.disabled = true; go.classList.add('is-loading'); msg.hidden = true;
      try {
        if (method === 'store') {
          const product = cat.stores.products[choice];
          const tx = await PD.billing.consumable(product);
          PD.store.set('mk.storePending.' + uid(), { listing: it.id, package: choice, transaction: tx, at: Date.now() });
          await verifyStore();
          PD.app.go('market', 'return', true); return;
        }
        const r = await fn({ action: 'start', listing: it.id, package: choice, provider: method });
        const u = new URL(r.url), hosts = r.provider === 'tbc' ? ['tpay.tbcbank.ge'] : ['www.paypal.com', 'www.sandbox.paypal.com'];
        if (u.protocol !== 'https:' || !hosts.includes(u.hostname) || !r.order) throw new Error('invalid-checkout');
        PD.store.set('mk.pending.' + uid(), { provider: r.provider, order: r.order, listing: it.id, package: choice, at: Date.now() });
        location.assign(u.href);
      } catch (e) {
        msg.hidden = false; msg.className = 'ag-msg'; msg.textContent = errText(e);
        go.disabled = false; go.classList.remove('is-loading');
      }
    }
    draw();
  }

  /* ======================================================== back from paying: only what the server confirms */
  const qs = new URLSearchParams(location.search), back0 = qs.get('payment');
  let returned = /^market-(tbc|paypal|cancelled)$/.test(back0 || '') ? back0.slice(7) : null;
  if (returned) { const u = new URL(location.href); ['payment', 'token', 'PayerID'].forEach(k => u.searchParams.delete(k)); history.replaceState(history.state, '', u.pathname + u.search + u.hash); }
  async function verifyStore() {
    const p = uid() && PD.store.get('mk.storePending.' + uid(), null);
    if (!p) return null;
    const r = await fn({ action: 'store', listing: p.listing, package: p.package, transaction: p.transaction });
    if (r.paid || r.effect === 'orphaned') PD.store.del('mk.storePending.' + uid());
    return Object.assign({ listing: p.listing }, r);
  }
  async function verifyWeb() {
    const p = uid() && PD.store.get('mk.pending.' + uid(), null);
    if (!p) return null;
    let r;
    try { r = await fn({ action: 'verify', provider: p.provider, order: p.order }); }
    catch (e) { if (e.code === 'order-not-found') { PD.store.del('mk.pending.' + uid()); return null; } throw e; }
    if (r.paid || r.failed || r.refunded) PD.store.del('mk.pending.' + uid());
    return Object.assign({ listing: p.listing }, r);
  }
  function returnPage(w) {
    head(w, 'mk.title', 'market');
    const how = returned; returned = null;
    const box = h('div', { class: 'pay-ret' }), icon = h('div', { class: 'pay-ret-ic' }), text = h('p', { class: 'pay-ret-t' }), acts = h('div', { class: 'pay-ret-a' });
    box.append(icon, text, acts); w.append(box);
    if (how === 'cancelled') { PD.store.del('mk.pending.' + uid()); icon.className = 'pay-ret-ic wait'; text.textContent = t('mk.r.cancelled'); acts.append(h('button', { class: 'btn', text: t('mk.mine'), onclick: () => PD.app.go('market', 'mine', true) })); return; }
    async function check() {
      acts.innerHTML = ''; icon.className = 'pay-ret-ic spin'; icon.innerHTML = ''; text.textContent = t('mk.r.checking');
      let r = null;
      try { r = PD.billing.native ? await verifyStore() : await verifyWeb(); } catch (_) {}
      if (!w.isConnected) return;
      const open = id => acts.append(h('button', { class: 'btn primary', text: t('mk.r.open'), onclick: () => PD.app.go('market', 'l:' + id, true) }));
      if (r && r.paid) { icon.className = 'pay-ret-ic ok'; icon.innerHTML = IC.ok; text.textContent = t(r.effect === 'queued' ? 'mk.r.queued' : 'mk.r.paid'); open(r.listing); }
      else if (r && r.effect === 'orphaned') { icon.className = 'pay-ret-ic wait'; text.textContent = t('mk.r.orphan'); }
      else if (r && r.failed) { icon.className = 'pay-ret-ic wait'; text.textContent = t('mk.r.failed'); if (r.listing) acts.append(h('button', { class: 'btn', text: t('pay.again'), onclick: () => PD.app.go('market', 'promote:' + r.listing, true) })); }
      else { icon.className = 'pay-ret-ic wait'; text.textContent = t('mk.r.notYet'); acts.append(h('button', { class: 'btn', text: t('pay.recheck'), onclick: check }), h('button', { class: 'btn quiet', text: t('mk.mine'), onclick: () => PD.app.go('market', 'mine', true) })); }
    }
    check();
  }
  // a payment that was confirmed while the app was closed: checked again when it comes back
  const recheck = () => { if (C.session && C.configured && uid() && (PD.store.get('mk.pending.' + uid(), null) || PD.store.get('mk.storePending.' + uid(), null))) (PD.billing.native ? verifyStore() : verifyWeb()).catch(() => {}); };
  document.addEventListener('visibilitychange', () => { if (!document.hidden) recheck(); });
  setTimeout(recheck, 2500);

  /* ======================================================== my listings, saved, a seller */
  async function mine(w) {
    head(w, 'mk.mine', 'market', [h('button', { class: 'btn small primary', html: IC.plus + '<span class="sr" data-t="mk.add"></span>', 'aria-label': t('mk.add'), onclick: () => PD.app.go('market', 'new') })]);
    const box = h('div', { class: 'mk-mine' }, [loading()]); w.append(box);
    let r;
    try { r = stamp(await rpc('market_mine')); } catch (e) { box.innerHTML = ''; failBox(box, e, () => PD.app.render(true)); return; }
    if (!w.isConnected) return;
    box.innerHTML = '';
    if (!r.items.length) { box.append(h('div', { class: 'mk-empty' }, [h('p', { 'data-t': 'mk.empty' }), h('button', { class: 'btn primary', 'data-t': 'mk.add', onclick: () => PD.app.go('market', 'new') })])); PD.i18n.apply(box); return; }
    r.items.forEach(it => {
      const state = it.live ? (it.sponsored ? 'ad' : 'active') : it.status, s = it.stats || {};
      const pill = it.awaiting_payment && !it.live ? t('mk.awaitPay') : state === 'ad' ? t('mk.sponsored') : t('mk.st.' + (it.live ? 'active' : it.status === 'active' ? 'expired' : it.status));
      box.append(h('article', { class: 'mk-row' }, [
        h('button', { class: 'mk-row-ph', type: 'button', 'aria-label': it.title, onclick: () => PD.app.go('market', 'l:' + it.id) }, [photo(it.photo, '')]),
        h('div', { class: 'mk-row-tx' }, [
          h('div', { class: 'mk-row-top' }, [h('em', { class: 'mk-pill s-' + state, text: pill }), h('b', { class: 'mk-price', text: priceOf(it) })]),
          h('button', { class: 'mk-row-name', type: 'button', text: it.title, onclick: () => PD.app.go('market', 'l:' + it.id) }),
          it.live ? countdown(it) : h('small', { class: 'muted', text: it.status === 'pending' ? t('mk.pendingD') : it.status === 'draft' ? t('mk.draftD') : it.status === 'rejected' ? (it.reject_reason || '') : '' }),
          h('small', { class: 'mk-row-st', text: [t('mk.st.views') + ' ' + (s.views || 0), t('mk.st.contacts') + ' ' + (s.contacts || 0), t('mk.st.impressions') + ' ' + ((s.impressions || 0) + (s.sponsored_impressions || 0))].join(' · ') }),
          h('div', { class: 'mk-row-a' }, [
            it.live || it.status === 'draft' || it.status === 'pending' ? h('button', { class: 'btn small' + (it.live && it.sponsored || it.status === 'draft' ? ' primary' : ''), text: t(it.live && it.sponsored ? 'mk.extend' : it.status === 'draft' ? 'mk.finish' : 'mk.promote'), onclick: () => PD.app.go('market', 'promote:' + it.id) }) : null,
            it.live || it.status === 'draft' || it.status === 'pending' ? h('button', { class: 'btn small', text: t('mk.edit'), onclick: () => PD.app.go('market', 'edit:' + it.id) }) : null].filter(Boolean))])]));
    });
    fill(box); PD.i18n.apply(box);
  }
  async function list(w, key, call, args, extraHead) {
    head(w, key, 'market');
    if (extraHead) w.append(extraHead);
    const box = h('div', {}, [loading()]); w.append(box);
    let r;
    try { r = stamp(await rpc(call, args)); } catch (e) { box.innerHTML = ''; failBox(box, e, () => PD.app.render(true)); return null; }
    if (!w.isConnected) return null;
    box.innerHTML = '';
    if (!r) { box.append(h('div', { class: 'mk-empty' }, [h('p', { 'data-t': 'mk.gone' })])); PD.i18n.apply(box); return null; }
    if (!r.items.length) box.append(h('div', { class: 'mk-empty' }, [h('p', { 'data-t': 'mk.empty' })])); else box.append(grid(r.items));
    PD.i18n.apply(box);
    return r;
  }
  async function seller(w, id) {
    const top = h('div', { class: 'mk-seller-top' });
    const r = await list(w, 'mk.sellerAll', 'market_seller', { target: id }, top);
    if (!r || !r.seller) return;
    const s = r.seller;
    top.append(h('span', { class: 'avatar big', html: s.avatar ? '<img alt="" src="' + PD.esc(s.avatar) + '">' : PD.esc((s.name || '?').slice(0, 1).toUpperCase()) }),
      h('div', {}, [h('b', { text: s.name || '—' }), s.nick ? h('small', { class: 'muted', text: ' @' + s.nick }) : null, s.since ? h('p', { class: 'muted', text: t('mk.since', { d: new Date(s.since).getFullYear() }) }) : null]));
  }

  /* ======================================================== messages about listings */
  async function inbox(w) {
    head(w, 'mk.inbox', 'market');
    const box = h('div', { class: 'mk-threads' }, [loading()]); w.append(box);
    let r;
    try { r = await rpc('market_threads'); } catch (e) { box.innerHTML = ''; failBox(box, e, () => PD.app.render(true)); return; }
    if (!w.isConnected) return;
    box.innerHTML = '';
    if (!r.length) { box.append(h('div', { class: 'mk-empty' }, [h('p', { 'data-t': 'mk.t.empty' })])); PD.i18n.apply(box); return; }
    r.forEach(x => box.append(h('button', { class: 'mk-thr' + (x.unread ? ' unread' : ''), type: 'button', onclick: () => PD.app.go('market', 't:' + x.listing + ':' + x.buyer) }, [
      photo(x.photo, ''), h('span', { class: 'grow' }, [h('small', { class: 'muted', text: t(x.selling ? 'mk.t.selling' : 'mk.t.buying') + ' · ' + x.title }), h('b', { text: x.other_name || '—' }), h('span', { class: 'mk-thr-l', text: x.last })]),
      x.unread ? h('i', { class: 'mk-dot', 'aria-label': String(x.unread) }) : null])));
    fill(box);
  }
  async function thread(w, listing, buyer) {
    head(w, 'mk.inbox', 'market');
    let it = null;
    try { it = await rpc('market_get', { listing }); } catch (_) {}
    if (!w.isConnected) return;
    if (it) w.append(h('button', { class: 'mk-seller', type: 'button', onclick: () => PD.app.go('market', 'l:' + listing) }, [photo(it.photo || (it.media || [])[0], ''), h('span', { class: 'grow' }, [h('b', { text: it.title }), h('small', { text: priceOf(it) })]), h('span', { class: 'chev', html: PD.ic.chevron })]));
    const list2 = h('div', { class: 'mk-msgs', role: 'log', 'aria-live': 'polite' }); w.append(list2);
    const ta = h('textarea', { class: 'input', rows: '2', maxlength: '1000', placeholder: t('mk.t.placeholder'), 'aria-label': t('mk.t.placeholder') });
    const send = h('button', { class: 'btn primary', 'data-t': 'mk.send', onclick: async () => {
      const v = ta.value.trim(); if (!v) return;
      send.disabled = true;
      try { await rpc('market_send', { listing, body: v, buyer: it && it.mine ? buyer : null }); ta.value = ''; await load(); } catch (e) { PD.ui.toast(errText(e)); }
      send.disabled = false;
    } });
    if (it && it.live) w.append(h('div', { class: 'mk-compose' }, [ta, send])); else w.append(h('p', { class: 'notice', 'data-t': 'mk.gone' }));
    async function load() {
      let r; try { r = await rpc('market_thread', { listing, buyer }); } catch (_) { return; }
      if (!w.isConnected) return;
      list2.innerHTML = '';
      r.forEach(m => list2.append(h('div', { class: 'mk-msg' + (m.mine ? ' me' : '') }, [h('p', { text: m.body }), h('small', { text: when(Date.parse(m.at)) })])));
      list2.scrollTop = list2.scrollHeight;
    }
    await load();
    fill(w); PD.i18n.apply(w);
    const timer = setInterval(() => { if (!w.isConnected) return clearInterval(timer); if (!document.hidden) load(); }, 8000);
  }

  /* ======================================================== the administrator's dashboard (the server checks is_admin / is_owner on every call) */
  async function admin(w) {
    head(w, 'mk.admin', 'market');
    if (!C.isAdmin) { w.append(h('p', { class: 'notice', 'data-t': 'mk.e.generic' })); PD.i18n.apply(w); return; }
    const box = h('div', { class: 'mk-admin' }, [loading()]); w.append(box);
    let o;
    try { o = stamp(await rpc('market_admin_overview')); } catch (e) { box.innerHTML = ''; failBox(box, e, () => PD.app.render(true)); return; }
    if (!w.isConnected) return;
    box.innerHTML = '';
    const redo = () => PD.app.render(true);
    const run = async (p, ok) => { try { await p; if (ok) PD.ui.toast(ok); redo(); } catch (e) { PD.ui.toast(errText(e)); } };
    const sec = (key, ...kids) => box.append(h('section', { class: 'mk-asec' }, [h('h2', { 'data-t': key })].concat(kids)));
    const none = () => h('p', { class: 'muted', 'data-t': 'mk.a.none' });
    const cnt = o.counts || {};
    box.append(h('div', { class: 'mk-kpi' }, [
      ['mk.a.revenue', money(Number((o.revenue || {}).GEL || 0), 'GEL')], ['mk.a.activeAds', cnt.active_ads],
      ['mk.a.pending', cnt.pending], ['mk.a.expiring', cnt.expiring_24h], ['mk.a.deleted', cnt.deleted_30d]].map(([k, v]) => h('div', { class: 'mk-stat' }, [h('b', { text: String(v == null ? 0 : v) }), h('small', { 'data-t': k })]))));
    // packages
    sec('mk.a.packages', C.isOwner ? h('button', { class: 'btn small primary', 'data-t': 'mk.a.toSales', onclick: () => PD.app.go('market', 'sales') }) : null, h('div', { class: 'mk-pk' }, (o.packages || []).filter(p => p.kind === 'ad').map(p => h('div', { class: 'mk-pk-r' + (p.active ? '' : ' off') }, [
      h('div', { class: 'grow' }, [h('b', { text: PD.i18n.pick({ ka: p.name_ka, en: p.name_en }) }), h('small', { class: 'muted', text: durName(p.hours) + ' · ' + money(p.price_minor / 100, 'GEL') + (p.paypal_value ? ' · PayPal ' + p.paypal_value + ' ' + p.paypal_currency : '') + (p.active ? '' : ' · ' + t('mk.a.off')) }),
        p.sale_minor && p.sale_until && Date.parse(p.sale_until) > srvNow() ? h('small', { class: 'mk-sale-end', text: t('mk.a.sale', { p: money(p.sale_minor / 100, 'GEL'), d: when(Date.parse(p.sale_until)) }) }) : null,
        h('small', { text: t('mk.a.sold', { n: p.sold }) + ' · ' + money(Number(p.revenue || 0), 'GEL') + ' · ' + t('mk.a.activeN', { n: p.active }) })]),
      p.kind === 'ad' && C.isOwner ? h('button', { class: 'btn small', 'data-t': 'mk.a.editPkg', onclick: () => pkgSheet(p, redo) }) : null]))), C.isOwner ? null : h('p', { class: 'muted mk-note', 'data-t': 'mk.a.ownerOnly' }));
    // moderation
    const pm = h('input', { type: 'checkbox', 'aria-label': t('mk.a.premod') }); pm.checked = !!o.premoderate;
    pm.onchange = () => run(rpc('market_admin_premoderate', { turn_on: pm.checked }));
    sec('mk.a.premod', h('label', { class: 'mk-check' }, [pm, h('span', { 'data-t': 'mk.a.premodD' })]),
      ...(o.pending || []).map(it => h('div', { class: 'mk-arow' }, [photo(it.photo, ''), h('div', { class: 'grow' }, [h('b', { text: it.title }), h('small', { class: 'muted', text: (it.seller && it.seller.name || '') + (it.queued_hours ? ' · ' + t('mk.a.paid') + ' ' + durName(it.queued_hours) : ' · ' + t('mk.a.free')) })]),
        h('button', { class: 'btn small', text: t('mk.r.open'), onclick: () => PD.app.go('market', 'l:' + it.id) }),
        h('button', { class: 'btn small primary', 'data-t': 'mk.a.approve', onclick: () => run(rpc('market_admin_review', { listing: it.id, approve: true, why: null })) }),
        h('button', { class: 'btn small', 'data-t': 'mk.a.reject', onclick: () => rejectSheet(it, redo) })])));
    // reports
    sec('mk.a.reports', ...((o.reports || []).length ? o.reports.map(r => h('div', { class: 'mk-arow' }, [h('div', { class: 'grow' }, [h('b', { text: r.title || '—' }), h('small', { class: 'muted', text: t('mk.r.' + r.reason) + ' · ' + when(Date.parse(r.at)) })]),
      r.listing ? h('button', { class: 'btn small', text: t('mk.r.open'), onclick: () => PD.app.go('market', 'l:' + r.listing) }) : null,
      r.listing ? h('button', { class: 'btn small danger', 'data-t': 'mk.a.remove', onclick: () => PD.ui.confirm(t('mk.a.remove') + '?', () => run(rpc('market_admin_remove', { listing: r.listing, report_id: r.id }))) }) : null,
      h('button', { class: 'btn small quiet', 'data-t': 'mk.a.dismiss', onclick: () => run(rpc('market_admin_dismiss', { report_id: r.id })) })])) : [none()]));
    // expiring
    sec('mk.a.expiringL', ...((o.expiring || []).length ? o.expiring.map(x => h('div', { class: 'mk-arow' }, [h('div', { class: 'grow' }, [h('b', { text: x.title }), h('small', { class: 'muted', text: (x.paid ? t('mk.a.paid') : t('mk.a.free')) + ' · ' + t('mk.until', { d: when(Date.parse(x.expires_at)) }) })])])) : [none()]));
    // the cleanup job
    const cl = o.cleanup || {}, lr = cl.last_run;
    sec('mk.a.cleanup',
      h('p', { class: lr && !lr.error ? '' : 'mk-bad', text: lr ? t('mk.a.lastRun', { d: when(Date.parse(lr.finished_at || lr.started_at)) }) + (lr.error ? ' · ' + lr.error : ' · −' + lr.deleted + ' · ' + lr.held + ' · ' + lr.warned) : t('mk.a.never') }),
      h('p', { class: cl.failed_runs_24h ? 'mk-bad' : 'muted', text: t('mk.a.runs', { n: cl.runs_24h || 0, f: cl.failed_runs_24h || 0 }) }),
      h('p', { class: cl.media_failed ? 'mk-bad' : 'muted', text: t('mk.a.media', { w: cl.media_waiting || 0, f: cl.media_failed || 0, d: cl.media_deleted_30d || 0 }) }),
      cl.media_failed ? h('button', { class: 'btn small', 'data-t': 'mk.a.retry', onclick: () => run(rpc('market_admin_retry_media')) }) : null,
      (cl.errors || []).length || (cl.media_errors || []).length ? h('details', {}, [h('summary', { 'data-t': 'mk.a.errors' }), h('ul', { class: 'mk-err' }, (cl.errors || []).map(e => h('li', { text: when(Date.parse(e.at)) + ' · ' + e.error })).concat((cl.media_errors || []).map(e => h('li', { text: e.path + ' · ' + e.tries + '× · ' + (e.error || '') }))))]) : null);
    // payments
    const py = o.payments || {};
    const promoRow = p => h('div', { class: 'mk-arow' }, [h('div', { class: 'grow' }, [h('b', { text: (p.package || '') + ' · ' + money(Number(p.amount), p.currency) }), h('small', { class: 'muted', text: p.provider + ' · ' + when(Date.parse(p.paid_at || p.created_at)) + (p.status ? ' · ' + t('mk.a.ps.' + p.status) : '') + (p.effect ? ' · ' + p.effect : '') + (p.error ? ' · ' + p.error : '') })]),
      C.isOwner && (p.status === 'orphaned' || p.status === 'applied' || (p.payment && !p.status)) && p.id ? h('button', { class: 'btn small', 'data-t': 'mk.a.refund', onclick: () => PD.ui.confirm(t('mk.a.refundQ'), () => run(rpc('market_admin_refund', { promotion: p.id }))) }) : null]);
    sec('mk.a.payments', h('p', { class: 'muted', text: t('mk.a.orders', { s: Object.entries(py.orders || {}).map(([k, v]) => k + ' ' + v).join(' · ') || '0' }) }),
      h('h3', { 'data-t': 'mk.a.orphaned' }), ...((py.orphaned || []).length ? py.orphaned.map(p => promoRow(Object.assign({ status: 'orphaned' }, p))) : [none()]),
      h('h3', { 'data-t': 'mk.a.stale' }), ...((py.stale || []).length ? py.stale.map(promoRow) : [none()]),
      h('h3', { 'data-t': 'mk.a.recent' }), ...((py.recent || []).length ? py.recent.map(promoRow) : [none()]));
    // history
    sec('mk.a.history', ...((o.history || []).length ? [h('ul', { class: 'mk-hist' }, o.history.map(g => h('li', { text: when(Date.parse(g.deleted_at)) + ' · ' + t('mk.a.why.' + g.reason) + ' · ' + (g.paid ? t('mk.a.paid') : t('mk.a.free')) + ' · ' + g.media + ' 📎' })))] : [none()]));
    fill(box); PD.i18n.apply(box);
  }
  function pkgSheet(p, done) {
    PD.ui.sheet((box, close) => {
      const price = h('input', { class: 'input', type: 'number', min: '0.5', step: '0.5', value: String(p.price_minor / 100), 'aria-label': t('mk.price') });
      const pp = h('input', { class: 'input', value: p.paypal_value || '', placeholder: '0.00', inputmode: 'decimal', 'aria-label': t('mk.a.pp') });
      const ppc = h('select', { class: 'input', 'aria-label': 'PayPal' }, ['EUR', 'USD'].map(c => h('option', { value: c, text: c }))); ppc.value = p.paypal_currency || 'EUR';
      const on = h('input', { type: 'checkbox' }); on.checked = !!p.active;
      box.classList.add('mk-sheet');
      box.append(h('h2', { text: PD.i18n.pick({ ka: p.name_ka, en: p.name_en }) + ' · ' + durName(p.hours) }),
        h('label', { class: 'field mk-field' }, [h('span', { text: t('mk.price') + ' (GEL)' }), price]),
        h('div', { class: 'mk-two' }, [h('label', { class: 'field mk-field' }, [h('span', { 'data-t': 'mk.a.pp' }), pp]), h('label', { class: 'field mk-field' }, [h('span', { text: 'PayPal' }), ppc])]),
        h('label', { class: 'mk-check' }, [on, h('span', { 'data-t': 'mk.a.on' })]),
        h('div', { class: 'row mk-acts' }, [h('button', { class: 'btn primary', 'data-t': 'mk.f.saveEdit', onclick: async () => {
          if (pp.value && !/^[0-9]+\.[0-9]{2}$/.test(pp.value.trim())) return pp.focus();
          try { await rpc('market_admin_package', { pkg: p.id, price_gel: Number(price.value), is_active: on.checked, pp_value: pp.value.trim() || null, pp_currency: pp.value.trim() ? ppc.value : null }); close(); done(); } catch (e) { PD.ui.toast(errText(e)); }
        } }), h('button', { class: 'btn', 'data-t': 'cancel', onclick: close })]));
    });
  }
  function rejectSheet(it, done) {
    PD.ui.sheet((box, close) => {
      const why = h('textarea', { class: 'input mk-ta', rows: '3', maxlength: '300', 'aria-label': t('mk.a.rejectWhy'), placeholder: t('mk.a.rejectWhy') });
      box.classList.add('mk-sheet');
      box.append(h('h2', { text: it.title }), why, h('div', { class: 'row mk-acts' }, [h('button', { class: 'btn primary', 'data-t': 'mk.a.reject', onclick: async () => {
        try { await rpc('market_admin_review', { listing: it.id, approve: false, why: why.value.trim() || null }); close(); done(); } catch (e) { PD.ui.toast(errText(e)); }
      } }), h('button', { class: 'btn', 'data-t': 'cancel', onclick: close })]));
    });
  }

  /* ======================================================== the owner's discounts: Premium and the four packages (is_owner() on the server) */
  async function sales(w) {
    head(w, 'mk.sl.title', 'profile');
    if (!C.isOwner) { w.append(h('p', { class: 'notice', 'data-t': 'mk.sl.need' })); PD.i18n.apply(w); return; }
    w.append(h('p', { class: 'muted', 'data-t': 'mk.sl.lead' }), h('p', { class: 'mk-note', 'data-t': 'mk.sl.law' }));
    const box = h('div', { class: 'mk-admin' }, [loading()]); w.append(box);
    let o;
    try { o = stamp(await rpc('owner_sales')); } catch (e) { box.innerHTML = ''; failBox(box, e, () => PD.app.render(true)); return; }
    if (!w.isConnected) return;
    box.innerHTML = '';
    const redo = () => PD.app.render(true);
    const pad = n => String(n).padStart(2, '0'), local = d => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + 'T' + pad(d.getHours()) + ':' + pad(d.getMinutes());
    const in30 = () => { const d = new Date(srvNow() + 30 * 864e5); d.setHours(23, 59, 0, 0); return d; };
    // one row: regular price, sale price, PayPal sale price, end; on / update / off
    function row(r, title, save) {
      const runs = r.sale_until && Date.parse(r.sale_until) > srvNow() && r.sale_minor > 0;
      const price = h('input', { class: 'input', type: 'number', min: '0.01', step: '0.01', inputmode: 'decimal', value: r.sale_minor ? (r.sale_minor / 100).toFixed(2) : '', 'aria-label': t('mk.sl.price') });
      const pp = h('input', { class: 'input', inputmode: 'decimal', placeholder: '0.00', value: r.paypal_sale_value || '', 'aria-label': t('mk.sl.pp', { c: r.paypal_currency || 'EUR' }) });
      const until = h('input', { class: 'input', type: 'datetime-local', value: local(runs ? new Date(r.sale_until) : in30()), 'aria-label': t('mk.sl.until') });
      const act = async on => {
        const d = new Date(until.value);
        try { await save(on ? Number(price.value) : null, on ? pp.value.trim() || null : null, on ? d.toISOString() : null); PD.ui.toast(t('mk.sl.done')); redo(); }
        catch (e) { PD.ui.toast(/sale-not-lower|invalid-date|invalid-price/.test(String(e.message || e.code)) ? t('mk.sl.bad') : errText(e), 4000); }
      };
      const pct = runs ? Math.round((1 - r.sale_minor / r.price_minor) * 100) : 0;
      return h('div', { class: 'mk-sale-r' + (runs ? ' on' : '') }, [
        h('div', { class: 'mk-sale-h' }, [h('b', { text: title }), h('small', { class: 'muted', text: t('mk.sl.regular', { p: money(r.price_minor / 100, 'GEL') }) })]),
        h('p', { class: runs ? 'mk-sale-end' : 'muted', text: runs ? t('mk.sl.running', { n: pct, d: when(Date.parse(r.sale_until)) }) : t('mk.sl.stopped') }),
        h('div', { class: 'mk-sale-f' }, [h('label', { class: 'field mk-field' }, [h('span', { 'data-t': 'mk.sl.price' }), price]),
          h('label', { class: 'field mk-field' }, [h('span', { text: t('mk.sl.pp', { c: r.paypal_currency || 'EUR' }) }), pp]),
          h('label', { class: 'field mk-field' }, [h('span', { 'data-t': 'mk.sl.until' }), until])]),
        h('div', { class: 'row mk-acts' }, [h('button', { class: 'btn small primary', 'data-t': runs ? 'mk.sl.save' : 'mk.sl.on', onclick: () => act(true) }),
          runs ? h('button', { class: 'btn small', 'data-t': 'mk.sl.off', onclick: () => act(false) }) : null])]);
    }
    const prem = (o.premium || []).map(r => row(r, t('mk.sl.premium') + ' · ' + t('pm.' + r.plan), (g, p, u) => rpc('owner_premium_sale', { sale_plan: r.plan, sale_gel: g, pp_sale: p, until: u })));
    const mkt = (o.market || []).map(r => row(r, PD.i18n.pick({ ka: r.name_ka, en: r.name_en }), (g, p, u) => rpc('market_owner_sale', { pkg: r.id, sale_gel: g, pp_sale: p, until: u })));
    // everything at once, with the sale prices already set
    const allUntil = h('input', { class: 'input', type: 'datetime-local', value: local(in30()), 'aria-label': t('mk.sl.until') });
    const each = async on => {
      const u = on ? new Date(allUntil.value).toISOString() : null;
      try {
        for (const r of o.premium || []) if (r.sale_minor) await rpc('owner_premium_sale', { sale_plan: r.plan, sale_gel: on ? r.sale_minor / 100 : null, pp_sale: on ? r.paypal_sale_value : null, until: u });
        for (const r of o.market || []) if (r.sale_minor) await rpc('market_owner_sale', { pkg: r.id, sale_gel: on ? r.sale_minor / 100 : null, pp_sale: on ? r.paypal_sale_value : null, until: u });
        PD.ui.toast(t('mk.sl.done')); redo();
      } catch (e) { PD.ui.toast(/sale-not-lower|invalid-date|invalid-price/.test(String(e.message || e.code)) ? t('mk.sl.bad') : errText(e), 4000); }
    };
    box.append(h('section', { class: 'mk-asec' }, [h('h2', { 'data-t': 'mk.sl.all' }), h('label', { class: 'field mk-field' }, [h('span', { 'data-t': 'mk.sl.until' }), allUntil]),
      h('div', { class: 'row mk-acts' }, [h('button', { class: 'btn primary', 'data-t': 'mk.sl.on', onclick: () => each(true) }), h('button', { class: 'btn', 'data-t': 'mk.sl.allOff', onclick: () => each(false) })])]));
    box.append(h('section', { class: 'mk-asec' }, [h('h2', { 'data-t': 'mk.sl.premium' })].concat(prem)));
    if (mkt.length) box.append(h('section', { class: 'mk-asec' }, [h('h2', { 'data-t': 'mk.sl.market' })].concat(mkt)));
    PD.i18n.apply(w);
  }

  /* ======================================================== the router's entry */
  function page(w, param) {
    w.classList.add('mk');
    if (!C.configured) { head(w, 'mk.title'); w.append(h('div', { class: 'mk-empty' }, [h('p', { 'data-t': 'mk.noServer' })])); PD.i18n.apply(w); return; }
    param = param == null ? '' : String(param);
    const [k, a, b] = param.split(':');
    const signed = fn2 => { if (C.session) return fn2(); head(w, 'mk.title', 'market'); w.append(h('div', { class: 'mk-empty' }, [h('p', { 'data-t': 'mk.signin' }), h('button', { class: 'btn primary', 'data-t': 'pf.signin', onclick: () => PD.auth.open() })])); PD.i18n.apply(w); };
    if (k === 'l' && a) return detail(w, a);
    if (k === 'seller' && a) return signed(() => seller(w, a));
    if (k === 'new') return signed(() => form(w, null));
    if (k === 'edit' && a) return signed(() => form(w, a));
    if (k === 'promote' && a) return signed(() => promote(w, a));
    if (k === 'mine') return signed(() => mine(w));
    if (k === 'saved') return signed(() => list(w, 'mk.saved', 'market_saved', {}));
    if (k === 'inbox') return signed(() => inbox(w));
    if (k === 't' && a && b) return signed(() => thread(w, a, b));
    if (k === 'admin') return signed(() => admin(w));
    if (k === 'sales') return signed(() => sales(w));
    if (k === 'return') return signed(() => returnPage(w));
    home(w);
    PD.i18n.apply(w);
  }
  return { page, span, IC, get returned() { return returned; } };
})();
