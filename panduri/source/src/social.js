/* =====================================================================
   Social: friends by nickname · the video feed · likes · comments · shares ·
   saved videos. The feed is one video per screen, one swipe each, playing
   with its sound. „გლობალური" is everyone's public videos, the unseen and
   the popular first; „მეგობრები" is my friends' and my own, newest first.
   A video is uploaded exactly as it was filmed (up to a minute, 720p to 4K):
   the app never re-encodes it. Photos, videos and music live in a private
   bucket: the server hands out short-lived addresses only to the people
   allowed to see them (the author, everyone for a public post, friends for
   a friends-only one, the two people of a chat).
   Nothing here is about panduri technique: it is the members' own content.
   ===================================================================== */
PD.i18n.add({
  'fd.global': ['გლობალური', 'Global'], 'fd.friends': ['მეგობრები', 'Friends'], 'fd.new': ['ახალი ვიდეო', 'New video'],
  'fd.emptyG': ['ჯერ არავის დაუდია ვიდეო — იყავი პირველი!', 'Nobody has posted a video yet — be the first!'],
  'fd.emptyF': ['აქ შენი მეგობრების ვიდეოები გამოჩნდება.', 'Your friends’ videos will show here.'], 'fd.emptyS': ['რასაც შეინახავ, აქ გამოჩნდება.', 'What you save will show here.'],
  'fd.findFriends': ['მეგობრების დამატება', 'Add friends'], 'fd.end': ['ჯერჯერობით სულ ეს არის.', 'That is all for now.'],
  'fd.photo': ['ფოტო', 'Photo'], 'fd.video': ['ვიდეო', 'Video'], 'fd.audio': ['მუსიკა', 'Music'], 'fd.text': ['ტექსტი', 'Text'],
  'fd.caption': ['აღწერა — ვინ უკრავს, რა სიმღერაა…', 'Caption — who is playing, which song…'], 'fd.who': ['ვინ ნახავს', 'Who can see it'],
  'fd.visPublic': ['ყველა (გლობალური)', 'Everyone (global)'], 'fd.visFriends': ['მხოლოდ მეგობრები', 'Friends only'],
  'fd.post': ['გამოქვეყნება', 'Post'], 'fd.uploading': ['იტვირთება… {p}%', 'Uploading… {p}%'], 'fd.preparing': ['მზადდება…', 'Preparing…'],
  'fd.tooBig': ['ფაილი ძალიან დიდია (მაქს. {n} MB).', 'The file is too large (max {n} MB).'], 'fd.tooLong': ['ძალიან გრძელია (მაქს. {n} წუთი).', 'Too long (max {n} minutes).'],
  'fd.badFile': ['ეს ფაილი ვერ წაიკითხა — სცადე სხვა ფორმატი.', 'This file could not be read — try another format.'],
  'fd.change': ['სხვა ფაილი', 'Another file'],
  'fd.comments': ['კომენტარები', 'Comments'], 'fd.noComments': ['ჯერ კომენტარი არ არის — დაწერე პირველი.', 'No comments yet — write the first.'], 'fd.writeC': ['დაწერე კომენტარი…', 'Write a comment…'],
  'fd.share': ['გაზიარება', 'Share'], 'fd.sendTo': ['გაუგზავნე მეგობარს ჩატში', 'Send to a friend in chat'], 'fd.sent': ['გაიგზავნა', 'Sent'], 'fd.noFriendsYet': ['გასაზიარებლად ჯერ მეგობარი დაამატე.', 'Add a friend first to share with them.'],
  'fd.shareOut': ['სხვაგან გაზიარება', 'Share elsewhere'], 'fd.copy': ['ბმულის კოპირება', 'Copy link'], 'fd.shareText': ['ნახე ფანდურის აპში: {s}', 'See it in the Panduri app: {s}'],
  'fd.delete': ['ვიდეოს წაშლა', 'Delete video'], 'fd.deleteQ': ['წაიშალოს ეს ვიდეო?', 'Delete this video?'], 'fd.deleted': ['წაიშალა', 'Deleted'], 'fd.more': ['მეტი', 'more'],
  'fd.rx.panduri': ['ფანდური', 'Panduri'], 'fd.rx.heart': ['მიყვარს', 'Love'], 'fd.rx.fire': ['ცეცხლი', 'Fire'], 'fd.rx.clap': ['ტაში', 'Applause'], 'fd.rx.laugh': ['სასაცილო', 'Funny'], 'fd.rx.wow': ['ვაუ', 'Wow'], 'fd.rx.sad': ['სამწუხარო', 'Sad'],
  'fd.views': ['{n} ნახვა', '{n} views'],
  'fd.unavailable': ['ეს ვიდეო აღარ არის ხელმისაწვდომი.', 'This video is no longer available.'], 'fd.friendsOnly': ['მხოლოდ მეგობრებისთვის', 'Friends only'],
  'fd.addFriend': ['დამატება', 'Add'], 'fd.requested': ['თხოვნა გაგზავნილია', 'Requested'], 'fd.posts': ['ვიდეოები', 'Videos'], 'fd.noUserPosts': ['ჯერ ვიდეო არ აქვს.', 'No videos yet.'],
  'fd.slow': ['ცოტა დაისვენე — ამ საათში მეტი პოსტი ვეღარ დაიდება.', 'Take a breath — no more posts this hour.'],
  'fd.mediaBlocked': ['ფაილი ვერ ჩაიტვირთა.', 'The file could not be loaded.'],
  'fd.like': ['მოწონება', 'Like'], 'fd.less': ['ნაკლები', 'less'], 'fd.sound': ['ხმა', 'Sound'], 'fd.seek': ['ვიდეოს ადგილი', 'Position in the video'], 'fd.origSound': ['ორიგინალი ხმა · {n}', 'Original sound · {n}'], 'fd.swipeHint': ['გადაფურცლე ზემოთ', 'Swipe up'], 'fd.save': ['შენახვა', 'Save'], 'fd.unsave': ['შენახულებიდან ამოღება', 'Remove from saved'], 'fd.saved': ['შენახული ვიდეოები', 'Saved videos'], 'fd.savedT': ['შენახულია', 'Saved'],
  'fd.tapSound': ['შეეხე ხმის ჩასართავად', 'Tap for sound'], 'fd.cantPlay': ['ეს ვიდეო ამ მოწყობილობაზე ვერ იკვრება.', 'This video cannot be played on this device.'],
  'fd.findFriendsA': ['მეგობრები და ძებნა', 'Friends and search'], 'fd.film': ['გადაღება', 'Film'], 'fd.gallery': ['გალერეიდან', 'From the gallery'],
  'fd.rules': ['მაქს. {m} წამი · 720p-დან 4K-მდე · ერთი ფაილი მაქს. {n} MB. ვიდეო იტვირთება ისე, როგორც გადაღებულია — ხარისხი არ იცვლება.', 'Up to {m} seconds · 720p to 4K · one file up to {n} MB. The video is uploaded exactly as it was filmed — its quality is not changed.'],
  'fd.asIs': ['ხარისხი უცვლელია', 'quality unchanged'], 'fd.song': ['სიმღერა ან რიტმი', 'Song or rhythm'], 'fd.songPh': ['სიმღერის ან რიტმის სახელი', 'Name of the song or rhythm'],
  'fd.reelLong': ['ვიდეო {m} წამზე გრძელია — ფიდში მაქს. {m} წამი იდება.', 'The video is longer than {m} seconds — the feed takes {m} seconds at most.'],
  'fd.reelSmall': ['ვიდეოს გარჩევადობა ({n}p) დაბალია — საჭიროა მინიმუმ 720p.', 'The video’s resolution ({n}p) is too low — at least 720p is needed.'],
  'fd.reelHuge': ['ვიდეო 4K-ზე დიდია — მაქსიმუმი 4K-ია.', 'The video is larger than 4K — 4K is the maximum.'],
  'fd.reelHeavy': ['ვიდეო {s} MB-ია, სერვერი კი ახლა ერთ ფაილად მაქს. {n} MB-ს იღებს. ხარისხს არ ვამცირებთ, ამიტომ ეს ფაილი ვერ აიტვირთება — სცადე უფრო მოკლე ვიდეო.', 'The video is {s} MB, and the server takes {n} MB per file for now. We do not lower the quality, so this file cannot be uploaded — try a shorter video.'],
  'fd.recStart': ['ჩაწერის დაწყება', 'Start recording'], 'fd.recStop': ['ჩაწერის დასრულება', 'Stop recording'], 'fd.recNote': ['მაქს. 1 წუთი. ხმა იწერება ისე, როგორც ისმის.', 'Up to 1 minute. The sound is recorded as it is.'],
  'fd.camDenied': ['კამერაზე ან მიკროფონზე წვდომა არ არის ნებადართული.', 'Access to the camera or microphone is not allowed.'], 'fd.camNone': ['კამერა ვერ ჩაირთო ამ მოწყობილობაზე.', 'The camera could not be started on this device.'],
  'fr.title': ['მეგობრები', 'Friends'], 'fr.myNick': ['შენი nickname', 'Your nickname'],
  'fr.nickWhy': ['მეგობრები ამ სახელით გიპოვიან: ლათინური ასოები, ციფრები, _ და . (3–24 სიმბოლო).', 'Friends find you by this name: Latin letters, digits, _ and . (3–24 characters).'],
  'fr.nickNeed': ['საზოგადოებაში შესასვლელად აირჩიე nickname — მეგობრები მისით დაგამატებენ.', 'Choose a nickname to join the community — friends add you by it.'],
  'fr.nickTaken': ['ეს nickname დაკავებულია — სცადე სხვა.', 'That nickname is taken — try another.'],
  'fr.nickBad': ['nickname: 3–24 ლათინური ასო, ციფრი, _ ან . (თავში ან ბოლოში არა).', 'Nickname: 3–24 Latin letters, digits, _ or . (not at the start or end).'],
  'fr.add': ['მეგობრის დამატება nickname-ით', 'Add a friend by nickname'], 'fr.find': ['ძიება', 'Find'], 'fr.notFound': ['ასეთი nickname ვერ მოიძებნა.', 'No one has that nickname.'], 'fr.self': ['ეს შენ ხარ 🙂', 'That is you 🙂'],
  'fr.send': ['თხოვნის გაგზავნა', 'Send request'], 'fr.sent': ['თხოვნა გაიგზავნა — როცა დაგეთანხმება, სიმა შეგატყობინებს.', 'Request sent — Sima will tell you when they accept.'], 'fr.already': ['უკვე მეგობრები ხართ', 'You are already friends'],
  'fr.incoming': ['მეგობრობის თხოვნები', 'Friend requests'], 'fr.accept': ['დათანხმება', 'Accept'], 'fr.decline': ['უარი', 'Decline'],
  'fr.outgoing': ['გაგზავნილი თხოვნები', 'Sent requests'], 'fr.cancel': ['გაუქმება', 'Cancel'], 'fr.list': ['შენი მეგობრები', 'Your friends'],
  'fr.none': ['მეგობრები ჯერ არ გყავს. დაამატე ვინმე მისი nickname-ით.', 'No friends yet. Add someone by their nickname.'],
  'fr.remove': ['მეგობრებიდან წაშლა', 'Remove friend'], 'fr.removeQ': ['წაიშალოს {n} მეგობრებიდან?', 'Remove {n} from your friends?'], 'fr.friend': ['მეგობარი', 'Friend'],
  'fr.edit': ['nickname-ის შეცვლა', 'Change nickname'], 'fr.tooMany': ['ძალიან ბევრი გაუპასუხებელი თხოვნა გაქვს.', 'You have too many unanswered requests.'],
  'fr.online': ['ახლა აქ არის', 'Here now'], 'fr.tabList': ['მეგობრები', 'Friends'], 'fr.tabReq': ['თხოვნები', 'Requests'], 'fr.tabFind': ['ძებნა', 'Find'], 'fr.noReq': ['თხოვნები ახლა არ არის.', 'No requests right now.'], 'fr.findWhy': ['ჩაწერე მეგობრის ზუსტი nickname.', 'Type your friend’s exact nickname.'],
  'fr.onlyFriends': ['აქ მხოლოდ შენი მეგობრები ჩანან. გლობალურ ფიდში ჩანს მხოლოდ ის, რასაც ავტორი ყველასთვის აქვეყნებს.', 'Only your friends are listed here. The global feed shows only what authors chose to make public.']
});

PD.social = (() => {
  const h = PD.h, C = PD.cloud, ic = PD.ic;
  const U = () => PD.community.util;
  const REACTS = ['panduri', 'heart', 'fire', 'clap', 'laugh', 'wow', 'sad'];
  const EMO = { heart: '❤️', fire: '🔥', clap: '👏', laugh: '😂', wow: '😮', sad: '😢' };
  // the panduri as a reaction: there is no emoji for it, so the app draws one (pear-shaped body, sound hole, neck, three pegs)
  const PANDURI = '<svg viewBox="0 0 32 32" aria-hidden="true"><g transform="rotate(-32 16 16)"><path d="M14.2 3.2h3.6l.4 2.2-.4 8.2h-3.6l-.4-8.2z" fill="#696972"/><circle cx="13.3" cy="4.4" r="1.05" fill="#e2ae84"/><circle cx="18.7" cy="4.4" r="1.05" fill="#e2ae84"/><circle cx="18.9" cy="7.3" r="1.05" fill="#e2ae84"/><path d="M16 12.4c4.6 2.2 7.6 6.4 7.6 10.4 0 4.6-3.4 7.6-7.6 7.6s-7.6-3-7.6-7.6c0-4 3-8.2 7.6-10.4z" fill="#c78b5e"/><path d="M16 13.6c3.7 2 6.2 5.5 6.2 9 0 3.8-2.7 6.4-6.2 6.4" fill="none" stroke="#e2ae84" stroke-width=".7" opacity=".7"/><circle cx="16" cy="21.4" r="2.1" fill="#2A1A10"/><path d="M15.2 5.6v22.6M16 5.6v22.6M16.8 5.6v22.6" stroke="#f5f5f7" stroke-width=".28" opacity=".85"/><rect x="13.6" y="26.2" width="4.8" height="1.1" rx=".5" fill="#3a3a3f"/></g></svg>';
  /** for text that leaves the app (the lock screen, a notification): the panduri stands in as the closest emoji */
  const glyphText = k => k === 'panduri' ? '🪕' : EMO[k] || '';
  const glyph = k => !k ? '' : k === 'panduri' ? '<span class="rx-g rx-pan">' + PANDURI + '</span>' : '<span class="rx-g">' + EMO[k] + '</span>';
  const I = d => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>';
  const IC = {
    comment: I('<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-5 4v-4.2A2.5 2.5 0 0 1 4 13.5z"/>'),
    share: I('<path d="M14 5l7 7-7 7M21 12H9a6 6 0 0 0-6 6v1"/>'), photo: I('<rect x="3" y="5" width="18" height="14" rx="2.5"/><circle cx="9" cy="10" r="1.8"/><path d="M21 16l-5.5-5.5L6 19"/>'),
    music: I('<path d="M9 18V6l10-2v12"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="16.5" cy="16" r="2.5"/>'), text: I('<path d="M5 6h14M12 6v13M8 19h8"/>'),
    sound: I('<path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/>'), mute: I('<path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M17 9l5 6M22 9l-5 6"/>'),
    users: I('<circle cx="9" cy="8.5" r="3.2"/><path d="M3 19.5c.9-3.2 3.3-4.6 6-4.6s5.1 1.4 6 4.6"/><path d="M15.5 5.6a3 3 0 0 1 0 5.8M17.5 14.9c1.6.6 2.9 2 3.5 4.6"/>'),
    globe: I('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.7 3.6 5.7 3.6 9s-1.1 6.3-3.6 9c-2.5-2.7-3.6-5.7-3.6-9S9.5 5.7 12 3z"/>'),
    trash: I('<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>'), flag: I('<path d="M5 21V4h13l-3 4 3 4H5"/>'), link: I('<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>'),
    addUser: I('<circle cx="9" cy="8" r="3.5"/><path d="M3 20c1-3.6 3.5-5 6-5s5 1.4 6 5M18 8v6M15 11h6"/>'),
    find: I('<circle cx="9" cy="8" r="3.4"/><path d="M2.8 19.6c.9-3.3 3.4-4.7 6.2-4.7 1.2 0 2.3.25 3.3.8"/><circle cx="17" cy="16.6" r="2.9"/><path d="M19.2 18.8l2.3 2.3"/>'),
    dm: I('<path d="M21 3L10 14"/><path d="M21 3l-6.6 18-4.4-7-7-4.4z"/>'),
    save: I('<path d="M6.5 3.5h11a1 1 0 0 1 1 1V21l-6.5-4.6L5.5 21V4.5a1 1 0 0 1 1-1z"/>'),
    pan: I('<g transform="rotate(-32 12 12)"><path d="M12 9.4c3.3 1.6 5.5 4.5 5.5 7.4 0 3.2-2.4 5.4-5.5 5.4s-5.5-2.2-5.5-5.4c0-2.9 2.2-5.8 5.5-7.4z"/><path d="M12 9.4V1.8M10.2 2.6h3.6M10.2 5h3.6"/><circle cx="12" cy="16.3" r="1.5"/></g>')
  };
  const F = d => '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' + d + '</svg>';
  const RAIL = {
    /* the panduri, filled: pear-shaped body with its sound hole, the neck, the head with three pegs */
    pan: F('<g transform="rotate(-28 12 12)"><path fill-rule="evenodd" d="M12 8.6c3.9 1.7 6.4 4.9 6.4 8.3 0 3.5-2.8 5.9-6.4 5.9s-6.4-2.4-6.4-5.9c0-3.4 2.5-6.6 6.4-8.3zm0 5.5a1.75 1.75 0 1 0 0 3.5 1.75 1.75 0 0 0 0-3.5z"/><path d="M10.9 3.4h2.2v6.4h-2.2z"/><path d="M10.3 1h3.4l.3 3h-4z"/><circle cx="9.3" cy="2" r=".9"/><circle cx="14.7" cy="2" r=".9"/><circle cx="14.8" cy="3.6" r=".9"/></g>'),
    comment: F('<path d="M12 3.2c5.1 0 9.2 3.5 9.2 7.9s-4.1 7.9-9.2 7.9c-1 0-2-.1-2.9-.4L4.6 20.9c-.5.2-1-.2-.9-.7l.9-3.7C3.5 15.1 2.8 13.2 2.8 11.1 2.8 6.7 6.9 3.2 12 3.2z"/><circle cx="7.9" cy="11.1" r="1.25" fill="#000" fill-opacity=".28"/><circle cx="12" cy="11.1" r="1.25" fill="#000" fill-opacity=".28"/><circle cx="16.1" cy="11.1" r="1.25" fill="#000" fill-opacity=".28"/>'),
    save: F('<path d="M6.6 2.8h10.8c.9 0 1.6.7 1.6 1.6v16.1c0 .7-.8 1.1-1.4.7L12 17.4l-5.6 3.8c-.6.4-1.4 0-1.4-.7V4.4c0-.9.7-1.6 1.6-1.6z"/>'),
    share: F('<path d="M13.2 3.6c0-.7.8-1 1.3-.5l7.6 7.5c.4.4.4 1 0 1.4l-7.6 7.5c-.5.5-1.3.2-1.3-.5v-3.6c-5.4 0-8.6 1.7-10.6 5.3-.3.5-1.1.3-1-.3.8-6.6 4.7-11 11.6-11.6z"/>'),
    more: F('<circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/>')

  };
  const t0 = (k, p) => t(k, p);
  const nf = n => { n = +n || 0; return n >= 1e6 ? (n / 1e6).toFixed(n >= 1e7 ? 0 : 1).replace(/\.0$/, '') + 'M' : n >= 1e3 ? (n / 1e3).toFixed(n >= 1e4 ? 0 : 1).replace(/\.0$/, '') + 'K' : String(n); };
  const avatar = (url, name, cls) => h('span', { class: 'avatar' + (cls ? ' ' + cls : ''), html: url ? '<img alt="" src="' + PD.esc(url) + '">' : U().initial(name) });
  const label = p => p.author_name || (p.author_nick ? '@' + p.author_nick : '—');

  /* ---------------- files: prepare, upload, show ---------------- */
  // MB: the server's own limit for one file (storage bucket `social`, 50 MB while the server is on Supabase's Free plan); minutes
  const LIMIT = { photo: 50, video: 50, audio: 50 }, LONG = { video: 10, audio: 15 };
  const kindOf = f => /^image\//.test(f.type) ? 'photo' : /^video\//.test(f.type) ? 'video' : /^audio\//.test(f.type) ? 'audio' : (/\.(m4a|mp3|wav|aac|ogg|flac)$/i.test(f.name) ? 'audio' : /\.(mp4|mov|webm|m4v)$/i.test(f.name) ? 'video' : null);
  const ACCEPT = { photo: 'image/*', video: 'video/*', audio: '.wav,.mp3,audio/*,.m4a,.aac,.ogg,.flac', any: 'image/*,video/*,audio/*' };
  const fail = k => { const e = new Error(k); e.code = k; return e; };
  function canvasBlob(src, w, h0, max, q) {
    const k = Math.min(1, max / Math.max(w, h0)), cw = Math.max(1, Math.round(w * k)), ch = Math.max(1, Math.round(h0 * k));
    const c = document.createElement('canvas'); c.width = cw; c.height = ch; c.getContext('2d').drawImage(src, 0, 0, cw, ch);
    return new Promise(res => c.toBlob(b => res(b), 'image/jpeg', q || .85));
  }
  function loadMedia(tag, url) {
    return new Promise((res, rej) => {
      const m = document.createElement(tag); m.preload = 'metadata'; m.muted = true; m.playsInline = true; m.src = url;
      const tm = setTimeout(() => rej(fail('badFile')), 15000);
      m.onloadedmetadata = () => { clearTimeout(tm); res(m); }; m.onerror = () => { clearTimeout(tm); rej(fail('badFile')); };
    });
  }
  /** length and size read straight from an MP4 / MOV file's header (moov → mvhd, tkhd), without decoding the picture:
      a browser that cannot play a codec (HEVC in Chrome, some cameras' MOV) still learns what it needs to upload it as it is.
      null when the file is not such a container. */
  async function mp4Meta(file) {
    const rd = async (pos, n) => new DataView(await file.slice(pos, pos + n).arrayBuffer());
    const head = async pos => { const d = await rd(pos, 16); if (d.byteLength < 8) return null; let size = d.getUint32(0), hl = 8; const type = String.fromCharCode(d.getUint8(4), d.getUint8(5), d.getUint8(6), d.getUint8(7)); if (size === 1 && d.byteLength >= 16) { size = d.getUint32(8) * 4294967296 + d.getUint32(12); hl = 16; } else if (size === 0) size = file.size - pos; return size >= hl ? { type, size, hl } : null; };
    let pos = 0, moov = null;
    for (let i = 0; i < 64 && pos < file.size; i++) { const b = await head(pos); if (!b) break; if (b.type === 'moov') { moov = { pos, size: b.size, hl: b.hl }; break; } pos += b.size; }
    if (!moov || moov.size > 64 * 1048576) return null;
    const v = await rd(moov.pos, moov.size), out = { dur: 0, w: 0, h: 0 };
    const str = o => String.fromCharCode(v.getUint8(o + 4), v.getUint8(o + 5), v.getUint8(o + 6), v.getUint8(o + 7));
    const walk = (start, end) => {
      for (let o = start; o + 8 <= end;) {
        const size = v.getUint32(o), type = str(o); if (size < 8 || o + size > end) break;
        if (type === 'trak' || type === 'moov') walk(o + 8, o + size);
        else if (type === 'mvhd') { const ver = v.getUint8(o + 8); const ts = v.getUint32(o + (ver ? 28 : 20)), d = ver ? v.getUint32(o + 32) * 4294967296 + v.getUint32(o + 36) : v.getUint32(o + 24); if (ts) out.dur = d / ts; }
        else if (type === 'tkhd' && !out.w) {
          const ver = v.getUint8(o + 8), m = o + (ver ? 60 : 48), w = v.getUint32(m + 36) / 65536, hh = v.getUint32(m + 40) / 65536;
          if (w && hh) { const turned = Math.abs(v.getInt32(m)) < 0x8000 && Math.abs(v.getInt32(m + 4)) >= 0x8000; out.w = Math.round(turned ? hh : w); out.h = Math.round(turned ? w : hh); }   // a phone held upright stores the picture turned
        }
        o += size;
      }
    };
    walk(moov.hl, moov.size);   // offsets inside the box just read
    return out.dur > 0 ? out : null;
  }
  /** a file the member chose → what will be uploaded: photos are made smaller, videos get a still for the feed */
  async function prepare(file, want, opts) {
    const kind = want === 'any' || !want ? kindOf(file) : want;
    if (!kind || (want && want !== 'any' && kindOf(file) && kindOf(file) !== want)) throw fail('badFile');
    if (file.size > LIMIT[kind] * 1048576 && !(kind === 'photo' && file.type !== 'image/gif')) throw Object.assign(fail('tooBig'), { n: LIMIT[kind], s: Math.ceil(file.size / 1048576) });
    const url = URL.createObjectURL(file);
    try {
      if (kind === 'photo') {
        if (file.type === 'image/gif') return { kind, blob: file, ext: 'gif', meta: {} };
        const img = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = () => rej(fail('badFile')); i.src = url; });
        // drawn again (that also drops the camera's location and other EXIF data), at up to 4K and high quality
        const blob = await canvasBlob(img, img.naturalWidth, img.naturalHeight, 4096, .92);
        if (!blob) throw fail('badFile');
        if (blob.size > LIMIT.photo * 1048576) throw Object.assign(fail('tooBig'), { n: LIMIT.photo, s: Math.ceil(blob.size / 1048576) });
        const k = Math.min(1, 4096 / Math.max(img.naturalWidth, img.naturalHeight));
        return { kind, blob, ext: 'jpg', meta: { w: Math.round(img.naturalWidth * k), h: Math.round(img.naturalHeight * k) } };
      }
      const ext = (file.name.match(/\.([a-z0-9]{2,5})$/i) || [, kind === 'video' ? 'mp4' : 'm4a'])[1].toLowerCase();
      let m = null;
      try { m = await loadMedia(kind === 'video' ? 'video' : 'audio', url); } catch (e) { if (e.code !== 'badFile') throw e; }
      // this browser cannot open it (HEVC, a camera's own MOV, some audio codecs): it is still uploaded untouched, with what its header says
      if (!m || (kind === 'video' && !m.videoWidth)) {
        const hd = await mp4Meta(file).catch(() => null);
        if (kind === 'video' && !hd) throw fail('badFile');
        const dur = (hd && hd.dur) || (m && isFinite(m.duration) ? m.duration : 0) || (opts && opts.dur) || 0;
        if (dur > LONG[kind] * 60) throw Object.assign(fail('tooLong'), { n: LONG[kind] });
        const meta = { dur: Math.round(dur * 10) / 10 };
        if (kind === 'video') { meta.w = hd.w; meta.h = hd.h; }
        return { kind, blob: file, ext, meta };
      }
      if (!isFinite(m.duration)) {   // a clip recorded by a browser carries no length: the player finds it by going to the end
        await new Promise(res => { const ok = () => { if (isFinite(m.duration)) { m.removeEventListener('durationchange', ok); res(); } }; m.addEventListener('durationchange', ok); setTimeout(res, 3000); try { m.currentTime = 1e101; } catch (_) { res(); } });
        try { m.currentTime = 0; } catch (_) {}
      }
      const dur = isFinite(m.duration) && m.duration > 0 ? m.duration : (opts && opts.dur) || 0;   // a clip filmed in the browser does not always know its own length
      if (dur > LONG[kind] * 60) throw Object.assign(fail('tooLong'), { n: LONG[kind] });
      const out = { kind, blob: file, ext, meta: { dur: Math.round(dur * 10) / 10 } };
      if (kind === 'video') {
        out.meta.w = m.videoWidth; out.meta.h = m.videoHeight;
        try {   // the still: a frame a little way in (some codecs cannot be drawn by this browser; then the post has none)
          await new Promise((res, rej) => { m.onseeked = res; m.onerror = rej; m.currentTime = Math.min(1, dur / 3 || 0); setTimeout(res, 4000); });
          if (m.videoWidth) out.thumb = await canvasBlob(m, m.videoWidth, m.videoHeight, 1280, .84);
        } catch (_) {}
      }
      return out;
    } finally { setTimeout(() => URL.revokeObjectURL(url), 30000); }
  }
  const MIME = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', gif: 'image/gif', mp4: 'video/mp4', m4v: 'video/mp4', mov: 'video/quicktime', webm: 'video/webm', mp3: 'audio/mpeg', m4a: 'audio/mp4', aac: 'audio/aac', wav: 'audio/wav', ogg: 'audio/ogg', flac: 'audio/flac' };
  const name = ext => C.uid + '/{d}/' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8) + '.' + ext;
  /** scope: 'p' feed post · 'c' chat · 'h' help board. Returns the columns to store with the row. */
  async function upload(prep, scope, onProgress, cover) {
    const mk = ext => name(ext).replace('{d}', scope);
    const typed = (b, ext) => b.type ? b : new Blob([b], { type: MIME[ext] || 'application/octet-stream' });
    const main = await C.storage.upload(mk(prep.ext), typed(prep.blob, prep.ext), p => onProgress && onProgress(p * (prep.thumb || cover ? .92 : 1)));
    let thumb = null; const still = cover || prep.thumb;
    if (still) { try { thumb = await C.storage.upload(mk('jpg'), typed(still, 'jpg')); } catch (_) {} }
    onProgress && onProgress(1);
    return { media_path: main, thumb_path: thumb, media_kind: prep.kind, media_meta: prep.meta || {} };
  }
  const urls = rows => C.storage.urls([].concat(...rows.map(r => [r.media_path, r.thumb_path]))).catch(() => ({}));
  const fileErr = e => e && e.code === 'tooBig' ? t('fd.tooBig', { n: e.n }) : e && e.code === 'tooLong' ? t('fd.tooLong', { n: e.n }) : e && e.code === 'badFile' ? t('fd.badFile') : e && e.code === 'too-large' ? t('fd.tooBig', { n: 50 }) : U().err(e);
  /** a photo, video or audio stored on the server, as an element (in a chat) */
  function mediaEl(m) {
    const src = C.storage.url(m.media_path), poster = m.thumb_path ? C.storage.url(m.thumb_path) : null, kind = m.media_kind || m.kind;
    if (!src) return h('div', { class: 'md-miss', 'data-t': 'fd.mediaBlocked' });
    if (kind === 'photo') { const i = h('img', { class: 'md-img', alt: '', src, loading: 'lazy', decoding: 'async' }); i.onclick = () => viewer(src); return i; }
    if (kind === 'video') {
      const v = h('video', { class: 'md-vid', src, poster, preload: 'none', playsinline: true, 'webkit-playsinline': true });
      v.controls = true;
      return v;
    }
    const wrap = h('div', { class: 'md-aud' }, [poster ? h('img', { class: 'md-cover', alt: '', src: poster }) : h('span', { class: 'md-note', html: PANDURI })]);
    const a = h('audio', { src, preload: 'none', controls: true });
    wrap.appendChild(a); wrap._audio = a;
    return wrap;
  }
  function viewer(src) {
    const v = h('div', { class: 'md-view', role: 'dialog', 'aria-modal': 'true' }, [h('img', { alt: '', src }), h('button', { class: 'md-x', 'aria-label': t('close'), html: ic.close })]);
    const lid = PD.layers.push(close);
    function close(fromBack) { if (fromBack !== true) PD.layers.done(lid); v.remove(); }
    v.onclick = () => close(); document.body.appendChild(v);
  }

  /* ---------------- reactions ---------------- */
  /** the row of seven above the button; picks one, or takes the current one back */
  function picker(anchor, cur, onPick) {
    document.querySelectorAll('.rx-pick').forEach(x => x.remove());
    const box = h('div', { class: 'rx-pick', role: 'menu' }, REACTS.map(k => h('button', { class: 'rx-o' + (k === cur ? ' on' : ''), role: 'menuitem', 'aria-label': t('fd.rx.' + k), title: t('fd.rx.' + k), html: glyph(k),
      onclick: e => { e.stopPropagation(); close(); onPick(k === cur ? null : k); } })));
    document.body.appendChild(box);
    const r = anchor.getBoundingClientRect(), bw = box.offsetWidth, bh = box.offsetHeight;
    box.style.left = Math.max(8, Math.min(innerWidth - bw - 8, r.left + r.width / 2 - bw / 2)) + 'px';
    box.style.top = Math.max(8, r.top - bh - 8) + 'px';
    const away = e => { if (!box.contains(e.target)) close(); };
    function close() { box.remove(); document.removeEventListener('pointerdown', away, true); }
    setTimeout(() => document.addEventListener('pointerdown', away, true), 0);
    const f = box.querySelector('button'); f && f.focus({ preventScroll: true });
    return close;
  }
  /** tap: the panduri (or take mine back); hold, or right-click: choose */
  function holdable(btn, onTap, onHold) {
    let tm = 0, held = false;
    btn.addEventListener('pointerdown', () => { held = false; clearTimeout(tm); tm = setTimeout(() => { held = true; onHold(); }, 420); });
    ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => btn.addEventListener(ev, () => clearTimeout(tm)));
    btn.addEventListener('click', e => { e.preventDefault(); if (held) return; onTap(); });
    btn.addEventListener('contextmenu', e => { e.preventDefault(); clearTimeout(tm); held = true; onHold(); });
    btn.addEventListener('keydown', e => { if (e.key === 'ArrowUp' || (e.key === 'Enter' && e.shiftKey)) { e.preventDefault(); onHold(); } });
  }

  /* ---------------- the feed: one swipe, one video ---------------- */
  const ROOM = () => (C.limits && C.limits.video) || LIMIT.video;
  /** a few players for the whole feed: the one on screen and the next ones, already loading. A phone decodes only a
      handful of videos at once, and a player that has once played with sound may go on doing so without a new tap. */
  function players(scroll) {
    const lite = !!(navigator.connection && navigator.connection.saveData), AHEAD = lite ? 1 : 2;
    const slots = [];
    let cur = null, needTap = false, dir = 1;
    function make() {
      const v = h('video', { class: 'md-vid', playsinline: true, 'webkit-playsinline': true, preload: 'auto' });
      v.loop = true; v.disableRemotePlayback = true;
      const s = { v, card: null };
      v.addEventListener('timeupdate', () => { if (s.card && s.card === cur && v.duration) { s.card._bar.style.transform = 'scaleX(' + (v.currentTime / v.duration) + ')'; if (s.card.classList.contains('scrub') || s.card.classList.contains('paused')) s.card._time.textContent = PD.fmtTime(v.currentTime) + ' / ' + PD.fmtTime(v.duration); } });
      v.addEventListener('pause', () => s.card && s.card.classList.remove('playing'));
      v.addEventListener('waiting', () => s.card && s.card.classList.add('buf'));
      ['playing', 'canplay'].forEach(ev => v.addEventListener(ev, () => { if (s.card) { s.card.classList.remove('buf'); if (ev === 'playing') s.card.classList.add('live', 'playing'); } }));
      v.addEventListener('error', () => { if (s.card && v.getAttribute('src')) { s.card.classList.remove('buf'); s.card.classList.add('broken'); } });
      slots.push(s); return s;
    }
    function free(s) { if (!s.card) return; s.card.classList.remove('live', 'buf', 'paused', 'playing'); s.card._slot = null; s.card = null; try { s.v.pause(); } catch (_) {} s.v.remove(); }
    function give(card, keep) {
      if (card._slot) return card._slot;
      let s = slots.find(x => !x.card) || (slots.length < AHEAD + 1 ? make() : null);
      if (!s) { s = slots.filter(x => keep.indexOf(x.card) < 0)[0]; if (!s) return null; free(s); }
      s.card = card; card._slot = s; card.classList.remove('broken');
      s.v.muted = needTap; s.v.src = card._src; card._stage.appendChild(s.v);
      try { s.v.load(); } catch (_) {}
      return s;
    }
    async function start(s) {
      const v = s.v; v.muted = needTap;
      try { await v.play(); }
      catch (e) {   // the browser wants a tap before any sound: play silently and say so
        if (e && e.name === 'NotAllowedError' && !v.muted) { needTap = true; v.muted = true; scroll.parentNode.classList.add('need-tap'); try { await v.play(); } catch (_) {} }
      }
    }
    /** `card` is on screen now */
    function show(card) {
      const all = [...scroll.querySelectorAll('.fd-card[data-id]')], i = all.indexOf(card), was = cur ? all.indexOf(cur) : -1;
      if (was >= 0 && was !== i) dir = i > was ? 1 : -1;
      if (cur && cur !== card) { cur.classList.remove('paused'); if (cur._slot) { try { cur._slot.v.pause(); cur._slot.v.currentTime = 0; } catch (_) {} } }
      cur = card;
      const next = (dir > 0 ? [i + 1, i + 2] : [i - 1, i + 1]).slice(0, AHEAD).map(k => all[k]).filter(Boolean), keep = [card].concat(next);
      const s = give(card, keep); if (s && !card.classList.contains('paused')) start(s);
      next.forEach(c => { const n = give(c, keep); if (n) { try { n.v.pause(); } catch (_) {} } });
    }
    function hide(card) { if (card._slot) { try { card._slot.v.pause(); } catch (_) {} } if (cur === card) cur = null; }
    /** a tap on the picture: the first one gives the sound back if the browser withheld it; after that it pauses */
    function tap(card) {
      const s = card._slot; if (!s) return;
      if (needTap) {
        needTap = false; scroll.parentNode.classList.remove('need-tap');
        slots.forEach(x => { x.v.muted = false; if (x !== s && x.card) { const p = x.v.play(); if (p && p.then) p.then(() => x.v.pause()).catch(() => {}); } });
        if (s.v.paused) start(s);
        return;
      }
      if (s.v.paused) { card.classList.remove('paused'); start(s); } else { s.v.pause(); card.classList.add('paused'); if (s.v.duration) card._time.textContent = PD.fmtTime(s.v.currentTime) + ' / ' + PD.fmtTime(s.v.duration); }
    }
    function stop() { slots.forEach(s => { free(s); s.v.removeAttribute('src'); try { s.v.load(); } catch (_) {} }); slots.length = 0; cur = null; }
    function pauseAll() { slots.forEach(s => { try { s.v.pause(); } catch (_) {} }); }
    function resume() { if (cur && cur._slot && !cur.classList.contains('paused')) start(cur._slot); }
    return { show, hide, tap, stop, pauseAll, resume, drop: card => { if (card._slot) free(card._slot); if (cur === card) cur = null; } };
  }

  /* ---------------- motion for the feed: everything is transform and opacity, so the scroll stays on the compositor ---------------- */
  const moves = () => !!(PD.motion && PD.motion.ok());
  const buzz = k => { try { PD.fx && PD.fx.haptic && PD.fx.haptic(k); } catch (_) {} };
  const SPRING = 'cubic-bezier(.34,1.56,.64,1)', OUTQ = 'cubic-bezier(.22,1,.36,1)';
  /** a quick bounce of one element */
  function pop(el, k) { if (!moves() || !el || !el.animate) return; k = k || 1.32; el.animate([{ transform: 'scale(1)' }, { transform: 'scale(' + k + ')' }, { transform: 'scale(.92)' }, { transform: 'scale(1)' }], { duration: 420, easing: OUTQ }); }
  /** the double tap: one big copper panduri where the finger was, tilted a little; it lands, then floats up and fades */
  function burstAt(card, x, y) {
    buzz('toggle');
    const r = card.getBoundingClientRect(), px = x - r.left, py = y - r.top;
    const b = h('span', { class: 'fd-burst', html: RAIL.pan }); b.style.left = px + 'px'; b.style.top = py + 'px'; card.appendChild(b);
    if (!moves()) { setTimeout(() => b.remove(), 500); return; }
    const tl = ((Math.random() - .5) * 30).toFixed(0), T = k => 'translate(-50%,-50%) rotate(' + tl + 'deg) scale(' + k + ')';
    b.animate([{ transform: T(1.6), opacity: 0 }, { transform: T(.92), opacity: 1, offset: .16 }, { transform: T(1), opacity: 1, offset: .28 }, { transform: T(1), opacity: 1, offset: .62 },
      { transform: 'translate(-50%,-210%) rotate(' + tl + 'deg) scale(1.25)', opacity: 0 }], { duration: 900, easing: 'ease-out', fill: 'forwards' }).onfinish = () => b.remove();
  }
  /** a number that changes rolls instead of snapping */
  function setNum(el, text) { if (el.textContent === text) return; el.textContent = text; if (moves() && el.animate) el.animate([{ transform: 'translateY(45%)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 220, easing: OUTQ }); }

  /** box: where the feed goes. own: the page scope. opt.one: a single video (from a notification or a chat) · opt.saved: my saved ones */
  function feed(box, own, opt) {
    opt = opt || {};
    const one = opt.one || null, fixed = one ? 'one' : opt.saved ? 'saved' : null;
    let tab = fixed || PD.store.get('fd.tab', 'foryou'); if (!fixed && tab !== 'friends') tab = 'foryou';
    const top = h('div', { class: 'fd-top' });
    const scroll = h('div', { class: 'fd-scroll', tabindex: '0', 'aria-label': t('cm.feed') });
    const hint = h('div', { class: 'fd-hint', 'aria-hidden': 'true' }, [h('span', { html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 15l6-6 6 6"/></svg>' }), h('b', { 'data-t': 'fd.swipeHint' })]);
    const stage = h('div', { class: 'fd-stage' }, [scroll, top, hint, h('button', { class: 'fd-tapsnd', type: 'button', html: IC.mute + '<span data-t="fd.tapSound"></span>', onclick: () => { const c = scroll.querySelector('.fd-card.act'); if (c) P.tap(c); } })]);
    box.append(stage); PD.i18n.apply(stage);
    document.documentElement.classList.add('fd-on'); own(() => document.documentElement.classList.remove('fd-on'));   // Sima's button would cover the rail
    // the video runs edge to edge, under the glass dock; the caption, the rail and the seek line stay above it (--fd-under)
    const fit = () => { const r = stage.getBoundingClientRect(), nav = document.querySelector('.dock'), nh = nav && nav.offsetHeight && getComputedStyle(nav).display !== 'none' ? nav.getBoundingClientRect().top : innerHeight, hh = Math.max(320, innerHeight - r.top); stage.style.height = hh + 'px'; stage.style.setProperty('--fdh', hh + 'px'); stage.style.setProperty('--fd-under', Math.max(0, innerHeight - Math.min(nh, innerHeight)) + 'px'); };
    fit(); requestAnimationFrame(fit); addEventListener('resize', fit); own(() => removeEventListener('resize', fit));
    const P = players(scroll);
    const st = { ids: new Set(), n: 0, done: false, busy: false, before: null };
    const seen = new Set(), queue = new Set(); let viewT = null;
    const flushSeen = () => { const ids = [...queue]; queue.clear(); if (ids.length) C.social.seen(ids).catch(() => {}); };
    const iv = setInterval(flushSeen, 5000); own(() => { clearInterval(iv); flushSeen(); });
    const io = new IntersectionObserver(es => es.forEach(e => {
      const card = e.target; if (!card.dataset.id) return;
      if (e.isIntersecting && e.intersectionRatio >= .6) {
        card.classList.add('act'); P.show(card);
        clearTimeout(viewT); viewT = setTimeout(() => { const id = +card.dataset.id; if (!seen.has(id) && card.dataset.mine !== '1') { seen.add(id); queue.add(id); } }, 1500);
        const all = scroll.children, i = [...all].indexOf(card); if (i >= all.length - 3) more();
      } else if (card.classList.contains('act')) { card.classList.remove('act'); P.hide(card); }
    }), { root: scroll, threshold: [0, .6] });
    const vis = () => { if (document.hidden) P.pauseAll(); else P.resume(); };
    document.addEventListener('visibilitychange', vis);
    // the first time: an arrow that says „swipe up", gone after the first swipe
    let hinted = PD.store.get('fd.hinted', false);
    const onScroll = () => { if (!hinted && scroll.scrollTop > 40) { hinted = true; PD.store.set('fd.hinted', true); stage.classList.remove('hinting'); } };
    scroll.addEventListener('scroll', onScroll, { passive: true });
    own(() => { io.disconnect(); document.removeEventListener('visibilitychange', vis); clearInterval(badgeT); P.stop(); });
    // the numbers on the two corner buttons: unread messages, friend requests waiting
    let nMsg = PD.store.get('cm.unread', 0), nReq = 0;
    const dots = {};
    async function badges() {
      if (fixed || document.hidden) return;
      try { nMsg = ((await C.chat.list()) || []).reduce((a, r) => a + (r.unread || 0), 0); PD.store.set('cm.unread', nMsg); } catch (_) {}
      try { nReq = ((await C.social.friends()) || []).filter(f => f.relation === 'incoming').length; } catch (_) {}
      paintDot('msgs', nMsg); paintDot('friends', nReq);
    }
    const badgeT = setInterval(badges, 30000);
    function paintDot(k, n) {
      const b = dots[k]; if (!b) return;
      let d = b.querySelector('.fd-dot');
      if (!n) { if (d) d.remove(); return; }
      const txt = n > 9 ? '9+' : String(n);
      if (!d) { d = h('i', { class: 'cm-dot fd-dot' }); b.appendChild(d); d.textContent = txt; pop(d, 1.5); } else setNum(d, txt);
      b.setAttribute('aria-label', t(b.dataset.key) + ' · ' + n);
    }
    const corner = (k, key, icon, fn) => { const b = h('button', { class: 'fd-ic fd-' + k, 'data-key': key, 'aria-label': t(key), title: t(key), onclick: () => { pop(b.firstChild, 1.15); fn(); } }, [h('span', { html: icon })]); dots[k] = b; return b; };
    const segInd = h('i', { class: 'fd-seg-ind', 'aria-hidden': 'true' });
    function placeInd(jump) {
      const b = top.querySelector('.fd-seg button.on'); if (!b) return;
      if (jump) segInd.style.transition = 'none';
      segInd.style.width = b.offsetWidth + 'px';   // the lit half of the glass pill slides under the chosen tab
      segInd.style.transform = 'translateX(' + b.offsetLeft + 'px)';
      if (jump) requestAnimationFrame(() => { segInd.style.transition = ''; });
    }
    function head() {
      top.innerHTML = '';
      if (fixed) { top.append(h('button', { class: 'fd-ic', 'aria-label': t('back'), html: ic.back, onclick: () => PD.app.back('community') }), h('b', { class: 'fd-title', 'data-t': one ? 'fd.video' : 'fd.saved' }), h('span', { class: 'fd-ic ghost' })); PD.i18n.apply(top); return; }
      const seg = h('div', { class: 'fd-seg', role: 'tablist' }, [segInd].concat([['friends', 'fd.friends'], ['foryou', 'fd.global']].map(([k, key]) => h('button', { role: 'tab', 'aria-selected': String(tab === k), class: tab === k ? 'on' : '', 'data-k': k, 'data-t': key,
        onclick: () => switchTab(k) }))));
      top.append(h('div', { class: 'fd-side' }, [corner('friends', 'fd.findFriendsA', IC.find, () => PD.app.go('community', 'friends'))]), seg,
        h('div', { class: 'fd-side end' }, [corner('msgs', 'cm.chats', IC.dm, () => PD.app.go('community', 'chats')), corner('new', 'fd.new', ic.plus, () => newVideo())]));
      PD.i18n.apply(top);
      paintDot('msgs', nMsg); paintDot('friends', nReq);
      requestAnimationFrame(() => placeInd(true));
    }
    /** the switch at the top: the line slides to it, the videos slide sideways (friends to the left of everyone) */
    function switchTab(k) {
      if (k === tab) { scroll.scrollTo({ top: 0, behavior: 'smooth' }); return; }
      const dir = k === 'foryou' ? 1 : -1; tab = k; PD.store.set('fd.tab', k); buzz('select');
      top.querySelectorAll('.fd-seg button').forEach(b => { const on = b.dataset.k === k; b.classList.toggle('on', on); b.setAttribute('aria-selected', String(on)); });
      placeInd();
      if (!moves()) { reset(); return; }
      const out = scroll.animate([{ transform: 'none', opacity: 1 }, { transform: 'translateX(' + (-dir * 18) + '%)', opacity: 0 }], { duration: 170, easing: 'cubic-bezier(.4,0,1,1)', fill: 'forwards' });
      out.onfinish = () => { reset(true); out.cancel(); scroll.animate([{ transform: 'translateX(' + (dir * 18) + '%)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 300, easing: OUTQ }); };
    }
    const newVideo = () => { P.pauseAll(); compose(p => { if (p.visibility === 'friends' && tab === 'foryou') switchTab('friends'); else prepend(p); }, () => P.resume()); };
    const skel = () => h('div', { class: 'fd-card fd-skel', 'aria-hidden': 'true' }, [h('i', { class: 'fd-shim' }),
      h('div', { class: 'fd-rail' }, [1, 2, 3, 4].map(() => h('i', { class: 'sk-dot' }))), h('div', { class: 'fd-info' }, [h('i', { class: 'sk-line w40' }), h('i', { class: 'sk-line w80' }), h('i', { class: 'sk-line w60' })])]);
    function reset(keepHead) { [...scroll.querySelectorAll('.fd-card')].forEach(c => { io.unobserve(c); P.drop(c); }); st.ids.clear(); st.n = 0; st.done = false; st.before = null; scroll.innerHTML = ''; scroll.scrollTop = 0; if (!keepHead) head(); more(); }
    function empty() {
      const f = tab === 'friends';
      const e = h('div', { class: 'fd-empty' }, [h('span', { class: 'cm-big', html: tab === 'saved' ? IC.save : f ? IC.users : ic.video }), h('p', { 'data-t': one ? 'fd.unavailable' : tab === 'saved' ? 'fd.emptyS' : f ? 'fd.emptyF' : 'fd.emptyG' }),
        fixed ? null : f ? h('button', { class: 'btn', 'data-t': 'fd.findFriends', onclick: () => PD.app.go('community', 'friends') }) : h('button', { class: 'btn primary', html: ic.plus + '<span data-t="fd.new"></span>', onclick: newVideo })].filter(Boolean));
      scroll.appendChild(e); PD.i18n.apply(scroll); PD.motion && PD.motion.reveal(e, 40);
    }
    function add(p, first) {
      st.ids.add(p.id); st.n++;
      const c = card(p, P, () => {
        const gone = () => { io.unobserve(c); P.drop(c); c.remove(); st.n--; if (!scroll.querySelector('.fd-card[data-id]')) { scroll.innerHTML = ''; empty(); } };
        if (moves()) c.animate([{ transform: 'none', opacity: 1 }, { transform: 'scale(.9)', opacity: 0 }], { duration: 260, easing: 'ease-in', fill: 'forwards' }).onfinish = gone; else gone();
      });
      if (first) scroll.prepend(c); else scroll.appendChild(c);
      io.observe(c);
    }
    async function more() {
      if (st.busy || st.done) return; st.busy = true;
      const mine = tab;
      const sk = st.n ? null : skel(); if (sk) { scroll.querySelectorAll('.fd-skel').forEach(x => x.remove()); scroll.appendChild(sk); }
      try {
        for (let turn = 0; turn < 6; turn++) {   // a server that has not been updated may still answer photos and text: they are passed over
          const byList = tab === 'foryou' || tab === 'saved';
          const rows = (one ? await C.social.feed('one', { before: one }) : await C.social.feed(tab, byList ? { skip: [...st.ids], lim: 6 } : { before: st.before, lim: 6 })) || [];
          if (mine !== tab) return;
          const fresh = rows.filter(r => !st.ids.has(r.id));
          fresh.forEach(r => { st.before = st.before == null ? r.id : Math.min(st.before, r.id); });
          const vids = fresh.filter(r => r.kind === 'video' && r.media_path);
          fresh.filter(r => vids.indexOf(r) < 0).forEach(r => st.ids.add(r.id));
          if (vids.length) { await urls(vids); if (mine !== tab) return; if (sk) sk.remove(); vids.forEach(p => add(p)); }
          if (one || !fresh.length) { st.done = true; break; }
          if (vids.length) break;
        }
        if (sk) sk.remove();
        if (st.done) { if (!st.n) { if (!scroll.querySelector('.fd-empty')) empty(); } else if (!fixed && !scroll.querySelector('.fd-endnote')) scroll.appendChild(h('div', { class: 'fd-card fd-endnote' }, [h('p', { class: 'muted', text: t('fd.end') })])); }
        if (!hinted && !fixed && st.n > 1) stage.classList.add('hinting');
      } catch (e) { if (sk) sk.remove(); if (!st.n) { scroll.innerHTML = ''; scroll.appendChild(h('p', { class: 'muted fd-err', text: U().err(e) })); } }
      finally { st.busy = false; }
    }
    async function prepend(p) { await urls([p]); scroll.querySelectorAll('.fd-empty,.fd-err').forEach(x => x.remove()); add(p, true); scroll.scrollTo({ top: 0 }); const c = scroll.querySelector('.fd-card[data-id]'); if (c && moves()) c.animate([{ transform: 'translateY(30%) scale(.94)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 480, easing: OUTQ }); }
    head(); more(); badges();
    // the top bar arrives from above
    if (moves()) [...top.children].forEach((x, i) => x.animate([{ transform: 'translateY(-14px)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 420, delay: 60 + i * 50, easing: OUTQ, fill: 'backwards' }));
    // keyboard: ↑ ↓ / j k move one video, the space bar pauses, L likes
    scroll.addEventListener('keydown', e => {
      if (e.target !== scroll) return;
      const c = scroll.querySelector('.fd-card.act');
      if (e.key === ' ') { e.preventDefault(); if (c) P.tap(c); return; }
      if (e.key === 'l' && c) { e.preventDefault(); c.querySelector('.fd-rx').click(); return; }
      if (!/^(ArrowDown|ArrowUp|j|k|PageDown|PageUp)$/.test(e.key)) return;
      e.preventDefault(); scroll.scrollBy({ top: (/Down|j/.test(e.key) ? 1 : -1) * scroll.clientHeight, behavior: 'smooth' });
    });
  }

  /** one video, one screen. The player comes from the feed's small pool when the card is on screen or next in line. */
  function card(p, P, onGone) {
    const mine = p.author === C.uid, meta0 = p.media_meta || {};
    const tall = !meta0.w || !meta0.h || meta0.h / meta0.w >= 1.2;   // a video held upright fills the screen; one held sideways is shown whole, on its own blurred picture
    const el = h('article', { class: 'fd-card' + (tall ? ' fd-tall' : ' fd-flat'), 'data-id': p.id, 'data-mine': mine ? '1' : '0' });
    const still = p.thumb_path && C.storage.url(p.thumb_path);
    const kids = [];
    if (still && !tall) { const bg = h('div', { class: 'fd-bg' }); bg.style.backgroundImage = 'url("' + still.replace(/"/g, '%22') + '")'; kids.push(bg); }
    if (still) kids.push(h('img', { class: 'fd-poster', alt: '', src: still, decoding: 'async' }));
    const stage = h('div', { class: 'fd-media' }, kids);
    const bar = h('i', { class: 'fd-prog' }), time = h('small', { class: 'fd-time mono' });
    el._stage = stage; el._bar = bar; el._time = time; el._src = C.storage.url(p.media_path); el._slot = null;
    el.appendChild(stage);
    // one tap: pause or play. Two quick taps: the panduri, where the finger was.
    let lastTap = 0, tapT = 0;
    stage.addEventListener('click', e => {
      const now = Date.now(); clearTimeout(tapT);
      if (now - lastTap < 300) { lastTap = 0; if (!p.my_reaction) like(true, true); burstAt(el, e.clientX, e.clientY); return; }
      lastTap = now; tapT = setTimeout(() => { lastTap = 0; const was = el.classList.contains('paused'); P.tap(el); if (was && !el.classList.contains('paused')) flash(el); }, 300);
    });
    // who, what, which song
    const name = h('button', { class: 'fd-name', onclick: () => profile(p.author) }, [h('b', { text: p.author_nick ? '@' + p.author_nick : label(p) }), p.visibility === 'friends' ? h('span', { class: 'fd-lock', title: t('fd.friendsOnly'), html: IC.users }) : null].filter(Boolean));
    const meta = h('small', { class: 'fd-meta', text: [p.author_nick && p.author_name ? p.author_name : '', U().ago(p.created_at), p.views ? t('fd.views', { n: nf(p.views) }) : ''].filter(Boolean).join(' · ') });
    let cap = null;
    if (p.caption) {
      const txt = h('span', { class: 'fd-captxt', text: p.caption }), moreB = h('button', { class: 'fd-capmore', 'data-t': 'fd.more' });
      cap = h('div', { class: 'fd-cap' }, [txt, moreB]);
      const toggle = () => { const open = !el.classList.contains('capopen'); el.classList.toggle('capopen', open); moreB.textContent = t(open ? 'fd.less' : 'fd.more'); };
      cap.onclick = e => { e.stopPropagation(); toggle(); };
      requestAnimationFrame(() => { if (txt.scrollHeight <= txt.clientHeight + 2 && p.caption.length < 90) moreB.hidden = true; });
    }
    const song = h('div', { class: 'fd-song' }, [h('span', { class: 'fd-note', html: IC.music }), h('span', { class: 'fd-marq' }, [h('span', { text: p.song || t('fd.origSound', { n: p.author_nick ? '@' + p.author_nick : label(p) }) })])]);
    const info = h('div', { class: 'fd-info' }, [name, meta, cap, song].filter(Boolean));
    // the rail: the author (and a + to become friends) · like · comment · save · share · more · the turning disc
    const face = avatar(p.author_avatar, p.author_name, 'fd-face');
    const plus = !mine && !p.friend && p.author_nick ? h('button', { class: 'fd-plus', 'aria-label': t('fr.send'), html: ic.plus }) : null;
    if (plus) plus.onclick = async e => {
      e.stopPropagation(); if (plus.disabled) return; plus.disabled = true; buzz('select');
      try {
        const r = await C.social.request(p.author_nick);
        plus.classList.add('done'); plus.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>'; pop(plus, 1.4);
        PD.ui.toast(t(r === 'friend' ? 'fr.already' : 'fr.sent'), 3500);
        setTimeout(() => { if (moves()) plus.animate([{ transform: 'scale(1)', opacity: 1 }, { transform: 'scale(0)', opacity: 0 }], { duration: 260, easing: 'ease-in', fill: 'forwards' }).onfinish = () => plus.remove(); else plus.remove(); }, 1200);
      } catch (er) { plus.disabled = false; PD.ui.toast(friendErr(er)); }
    };
    const who = h('div', { class: 'fd-col fd-whocol' }, [h('button', { class: 'fd-facebtn', 'aria-label': label(p), onclick: () => profile(p.author) }, [face]), plus].filter(Boolean));
    const likeB = h('button', { class: 'fd-act fd-rx', html: RAIL.pan }), likeN = h('small', {});
    const paint = () => { likeB.classList.toggle('on', !!p.my_reaction); likeB.setAttribute('aria-pressed', String(!!p.my_reaction)); likeB.setAttribute('aria-label', t('fd.like')); setNum(likeN, nf(p.reactions)); };
    async function like(on, quiet) {
      const prev = p.my_reaction, before = p.reactions;
      p.my_reaction = on ? 'panduri' : null; p.reactions = Math.max(0, before + (on && !prev ? 1 : !on && prev ? -1 : 0)); paint();
      if (on) { pop(likeB, 1.28); if (!quiet) buzz('toggle'); }
      try { await C.social.react(p.id, p.my_reaction); } catch (e) { p.my_reaction = prev; p.reactions = before; paint(); PD.ui.toast(U().err(e)); }
    }
    likeB.onclick = () => like(!p.my_reaction); paint();
    const cmN = h('small', { text: nf(p.comments) }), shN = h('small', { text: p.shares ? nf(p.shares) : '' }), svN = h('small', { text: '' });
    const saveB = h('button', { class: 'fd-act fd-save', html: RAIL.save });
    const paintSave = () => { saveB.classList.toggle('on', !!p.saved); saveB.setAttribute('aria-pressed', String(!!p.saved)); saveB.setAttribute('aria-label', t(p.saved ? 'fd.unsave' : 'fd.save')); };
    saveB.onclick = async () => {
      const prev = !!p.saved; p.saved = !prev; paintSave(); if (p.saved) { pop(saveB, 1.22); buzz('toggle'); }
      try { await C.social.save(p.id, p.saved); if (p.saved) PD.ui.toast(t('fd.savedT')); } catch (e) { p.saved = prev; paintSave(); PD.ui.toast(U().err(e), 4000); }
    };
    paintSave();
    const act = (cls, key, icon, fn, n) => h('div', { class: 'fd-col' }, [h('button', { class: 'fd-act ' + cls, 'aria-label': t(key), html: icon, onclick: () => fn() }), n].filter(Boolean));
    const rail = h('div', { class: 'fd-rail' }, [who,
      h('div', { class: 'fd-col' }, [likeB, likeN]),
      act('fd-cm', 'fd.comments', RAIL.comment, () => comments(p, n => { p.comments = n; setNum(cmN, nf(n)); }), cmN),
      h('div', { class: 'fd-col' }, [saveB, svN]),
      act('fd-sh', 'fd.share', RAIL.share, () => share(p, () => { setNum(shN, nf(p.shares)); }), shN),
      act('fd-morebtn', 'md.more', RAIL.more, () => postMenu(p, onGone))]);
    // the line at the bottom: drag it to go to another place in the video
    const progw = h('div', { class: 'fd-progw', role: 'slider', 'aria-label': t('fd.seek'), tabindex: '-1' }, [h('i', { class: 'fd-track' }, [bar]), time]);
    scrubber(el, progw);
    el.append(h('div', { class: 'fd-shade' }), info, rail, h('span', { class: 'fd-spin', 'aria-hidden': 'true' }), h('p', { class: 'fd-broken', 'data-t': 'fd.cantPlay' }), progw);
    PD.i18n.apply(el);
    return el;
  }
  /** the pause sign leaves with a little grow when the video plays again */
  function flash(card) {
    if (!moves()) return;
    const f = h('span', { class: 'fd-flash', 'aria-hidden': 'true', html: ic.play }); card.appendChild(f);
    f.animate([{ transform: 'translate(-50%,-50%) scale(1)', opacity: 1 }, { transform: 'translate(-50%,-50%) scale(1.6)', opacity: 0 }], { duration: 380, easing: OUTQ, fill: 'forwards' }).onfinish = () => f.remove();
  }
  function scrubber(card, w) {
    let on = false;
    const at = e => { const v = card._slot && card._slot.v; if (!v || !v.duration) return; const r = w.getBoundingClientRect(), k = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)); v.currentTime = k * v.duration; card._bar.style.transform = 'scaleX(' + k + ')'; card._time.textContent = PD.fmtTime(v.currentTime) + ' / ' + PD.fmtTime(v.duration); };
    w.addEventListener('pointerdown', e => { if (!card._slot) return; e.stopPropagation(); on = true; card.classList.add('scrub'); try { w.setPointerCapture(e.pointerId); } catch (_) {} at(e); });
    w.addEventListener('pointermove', e => { if (on) at(e); });
    const end = () => { if (!on) return; on = false; setTimeout(() => card.classList.remove('scrub'), 600); };
    w.addEventListener('pointerup', end); w.addEventListener('pointercancel', end);
    w.addEventListener('click', e => e.stopPropagation());
  }

  /* ---------------- comments ---------------- */
  function comments(p, onCount) {
    PD.ui.sheet((b, close) => {
      const list = h('div', { class: 'cm-replies fd-cms' }), inp = h('textarea', { class: 'input', rows: '2', maxlength: '1000', placeholder: t('fd.writeC'), 'aria-label': t('fd.writeC'), style: 'min-height:60px;padding:10px 12px' });
      const send = async () => { const v = inp.value.trim(); if (!v) return; inp.value = ''; try { await C.social.comment(p.id, v); load(); } catch (e) { inp.value = v; PD.ui.toast(U().err(e)); } };
      inp.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } });
      b.append(h('h2', { 'data-t': 'fd.comments' }), list, h('div', { class: 'cm-bar' }, [PD.chatkit.emojiButton(inp), inp, h('button', { class: 'btn primary icon', 'aria-label': t('cm.send'), html: ic.send, onclick: send })]));
      async function load() {
        try {
          const rows = await C.social.comments(p.id) || []; list.innerHTML = ''; onCount && onCount(rows.length);
          if (!rows.length) { list.appendChild(h('p', { class: 'muted', 'data-t': 'fd.noComments' })); PD.i18n.apply(list); return; }
          rows.forEach(r => list.appendChild(h('div', { class: 'cm-reply' }, [h('small', { text: (r.author_name || '—') + ' · ' + U().ago(r.created_at) }), h('p', { text: r.body }),
            h('div', { class: 'row', style: 'gap:2px;justify-content:flex-end' }, [
              (r.author === C.uid || p.author === C.uid || C.isAdmin) ? h('button', { class: 'cm-flag', 'aria-label': t('cm.delete'), html: IC.trash, onclick: async () => { try { await C.social.uncomment(r.id); load(); } catch (e) { PD.ui.toast(U().err(e)); } } }) : null,
              r.author !== C.uid ? h('button', { class: 'cm-flag', 'aria-label': t('md.report'), html: IC.flag, onclick: () => U().reportSheet('comment', r.id) }) : null].filter(Boolean))])));
          list.scrollTop = list.scrollHeight;
        } catch (e) { list.textContent = U().err(e); }
      }
      load();
    });
  }

  /* ---------------- share: into a chat, or out of the app ---------------- */
  const linkOf = p => location.origin + location.pathname + '?go=' + encodeURIComponent('community:p:' + p.id);
  function share(p, onShared) {
    PD.ui.sheet((b, close) => {
      const list = h('div', { class: 'cm-list' });
      b.append(h('h2', { 'data-t': 'fd.share' }), h('p', { class: 'muted', 'data-t': 'fd.sendTo' }), list,
        h('div', { class: 'row', style: 'gap:8px;flex-wrap:wrap;margin-top:6px' }, [
          navigator.share ? h('button', { class: 'btn', html: IC.share + '<span data-t="fd.shareOut"></span>', onclick: () => navigator.share({ title: t('app.name'), text: t('fd.shareText', { s: (p.caption || '').slice(0, 80) }), url: linkOf(p) }).catch(() => {}) }) : null,
          h('button', { class: 'btn', html: IC.link + '<span data-t="fd.copy"></span>', onclick: async () => { try { await navigator.clipboard.writeText(linkOf(p)); PD.ui.toast(t('toast.copied')); } catch (_) {} } })].filter(Boolean)));
      (async () => {
        try {
          const fr = (await C.social.friends() || []).filter(f => f.relation === 'friend');
          if (!fr.length) { list.appendChild(h('p', { class: 'muted', 'data-t': 'fd.noFriendsYet' })); PD.i18n.apply(list); return; }
          fr.forEach(f => { const go = h('button', { class: 'btn small', 'data-t': 'cm.send' });
            go.onclick = async () => { go.disabled = true; try { const conv = await C.chat.open(f.id); await C.chat.send(conv, '', { post_ref: p.id }); go.textContent = t('fd.sent'); p.shares = (p.shares || 0) + 1; onShared && onShared(); } catch (e) { go.disabled = false; PD.ui.toast(U().err(e)); } };
            list.appendChild(h('div', { class: 'cm-row' }, [avatar(f.avatar_url, f.display_name), h('div', { class: 'grow' }, [h('b', { text: f.display_name || '@' + f.nickname }), h('small', { text: '@' + (f.nickname || '') })]), go])); });
          PD.i18n.apply(list);
        } catch (e) { list.textContent = U().err(e); }
      })();
    });
  }
  function postMenu(p, onGone) {
    PD.ui.sheet((b, close) => {
      const mine = p.author === C.uid;
      b.append(h('h2', { text: label(p) }), h('div', { class: 'cm-list' }, [
        mine || C.isAdmin ? h('button', { class: 'btn', html: IC.trash + '<span data-t="fd.delete"></span>', onclick: () => { close(); PD.ui.confirm(t('fd.deleteQ'), async () => {
          try { if (mine) await C.storage.remove([p.media_path, p.thumb_path].filter(Boolean)).catch(() => {}); await C.social.remove(p.id); PD.ui.toast(t('fd.deleted')); onGone && onGone(); } catch (e) { PD.ui.toast(U().err(e)); } }); } }) : null,
        !mine ? h('button', { class: 'btn', html: IC.flag + '<span data-t="md.report"></span>', onclick: () => { close(); U().reportSheet('feed', p.id); } }) : null,
        !mine ? h('button', { class: 'btn', 'data-t': 'md.block', onclick: () => { close(); U().confirmBlock(p.author, label(p), onGone); } }) : null].filter(Boolean)));
    });
  }

  /* ---------------- a new video: filmed now, or chosen from the gallery ---------------- */
  const MAXSEC = 60, MINSIDE = 720, MAXSIDE = 4096;
  function pickVideo(capture) {
    return new Promise(res => {
      const i = h('input', { type: 'file', accept: 'video/*', hidden: true }); if (capture) i.setAttribute('capture', 'environment');
      const finish = f => { i.onchange = i.oncancel = null; i.remove(); res(f); };
      i.onchange = () => finish(i.files[0] || null); i.oncancel = () => finish(null);
      document.body.appendChild(i); i.click();
    });
  }
  /** what the feed accepts: up to a minute, 720p to 4K, and as large a file as the server takes. The file itself is never re-encoded. */
  function checkReel(prep, file) {
    const m = prep.meta || {}, lo = Math.min(m.w || 0, m.h || 0), hi = Math.max(m.w || 0, m.h || 0);
    if (!m.dur || !lo) throw fail('badFile');
    if (m.dur > MAXSEC + .5) throw Object.assign(fail('reelLong'), { n: Math.round(m.dur) });
    if (lo < MINSIDE) throw Object.assign(fail('reelSmall'), { n: lo });
    if (hi > MAXSIDE) throw fail('reelHuge');
    if (file.size > ROOM() * 1048576) throw Object.assign(fail('reelHeavy'), { s: Math.ceil(file.size / 1048576), n: ROOM() });
  }
  const reelErr = e => { const c = e && e.code; return c === 'tooBig' ? t('fd.reelHeavy', { s: e.s, n: e.n }) : c === 'reelLong' || c === 'tooLong' ? t('fd.reelLong', { n: e.n, m: MAXSEC }) : c === 'reelSmall' ? t('fd.reelSmall', { n: e.n }) : c === 'reelHuge' ? t('fd.reelHuge') : c === 'reelHeavy' ? t('fd.reelHeavy', { s: e.s, n: e.n }) : c === 'too-large' ? t('fd.reelHeavy', { s: '>' + ROOM(), n: ROOM() }) : fileErr(e); };
  /** filming inside the app, where the device has no camera app to hand the job to (a computer). Stops by itself at a minute. */
  function recorder(done) {
    const room = ROOM() * 1048576 * 8 * .92 / MAXSEC, AUDIO = 256000;   // bits a second that still fit the server's file limit at a full minute
    const wantH = room >= 35e6 ? 2160 : room >= 12e6 ? 1440 : 1080;
    const view = h('video', { class: 'rec-view', playsinline: true, autoplay: true }); view.muted = true;
    const time = h('b', { class: 'rec-time mono', text: '0:00 / 1:00' }), go = h('button', { class: 'rec-go', type: 'button', 'aria-label': t('fd.recStart') }), note = h('small', { class: 'rec-note', 'data-t': 'fd.recNote' });
    const root = h('div', { class: 'rec', role: 'dialog', 'aria-modal': 'true', 'aria-label': t('fd.film') }, [view, h('button', { class: 'md-x', 'aria-label': t('close'), html: ic.close, onclick: () => close() }), h('div', { class: 'rec-bar' }, [time, go, note])]);
    document.body.appendChild(root); PD.i18n.apply(root);
    let stream = null, rec = null, parts = [], t0 = 0, tick = 0, closed = false, keep = false;
    const lid = PD.layers.push(() => close(true));
    function close(fromBack) { if (closed) return; closed = true; if (fromBack !== true) PD.layers.done(lid); clearInterval(tick); try { if (rec && rec.state !== 'inactive') rec.stop(); } catch (_) {} if (stream) stream.getTracks().forEach(x => x.stop()); root.remove(); }
    (async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { width: { ideal: Math.round(wantH * 16 / 9) }, height: { ideal: wantH, min: MINSIDE }, frameRate: { ideal: 60 } },
          audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false, channelCount: { ideal: 2 } } });   // an instrument, not a phone call: the sound is left as it is
        if (closed) { stream.getTracks().forEach(x => x.stop()); return; }
        view.srcObject = stream;
      } catch (e) { close(); PD.ui.toast(t(e && e.name === 'NotAllowedError' ? 'fd.camDenied' : 'fd.camNone'), 5000); return; }
      const mime = ['video/mp4;codecs=avc1.640033,mp4a.40.2', 'video/mp4', 'video/webm;codecs=vp9,opus', 'video/webm'].find(m => window.MediaRecorder && MediaRecorder.isTypeSupported(m));
      if (!mime) { close(); PD.ui.toast(t('fd.camNone'), 5000); return; }
      go.onclick = () => {
        if (rec) { keep = true; rec.stop(); return; }
        const set = stream.getVideoTracks()[0].getSettings(), px = (set.width || 1920) * (set.height || 1080) * (set.frameRate || 30);
        rec = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: Math.round(Math.max(4e6, Math.min(room - AUDIO, px * .16))), audioBitsPerSecond: AUDIO });
        rec.ondataavailable = e => { if (e.data && e.data.size) parts.push(e.data); };
        rec.onstop = () => { const dur = (performance.now() - t0) / 1000; const type = mime.split(';')[0], f = new File(parts, 'panduri.' + (type === 'video/mp4' ? 'mp4' : 'webm'), { type }); const ok = keep; close(); if (ok && f.size) done(f, Math.min(MAXSEC, dur)); };
        rec.start(1000); t0 = performance.now(); root.classList.add('on'); go.setAttribute('aria-label', t('fd.recStop'));
        tick = setInterval(() => { const s = (performance.now() - t0) / 1000; time.textContent = PD.fmtTime(s) + ' / 1:00'; if (s >= MAXSEC) { keep = true; rec.stop(); } }, 200);
      };
    })();
  }
  function compose(done, onClose) {
    PD.ui.sheet((b, close) => {
      let prep = null, src = null, vis = PD.store.get('fd.vis', 'public'), busy = false;
      const stageEl = h('div', { class: 'fd-prev' });
      const cap = h('textarea', { class: 'input', rows: '3', maxlength: '2200', placeholder: t('fd.caption'), 'aria-label': t('fd.caption'), style: 'min-height:84px;padding:10px 12px' });
      const names = []; try { (PD.curriculum.rhythms() || []).forEach(r => { const n = PD.i18n.pick(Array.isArray(r.name) ? { ka: r.name[0], en: r.name[1] } : r.name); if (n && names.indexOf(n) < 0) names.push(n); }); } catch (_) {}
      const listId = 'fd-songs-' + Date.now().toString(36);
      const song = h('input', { class: 'input', maxlength: '80', list: listId, placeholder: t('fd.songPh'), 'aria-label': t('fd.song'), autocomplete: 'off' });
      const visRow = h('div', { class: 'fd-vis', role: 'radiogroup', 'aria-label': t('fd.who') });
      const bar = h('div', { class: 'fd-upbar', hidden: true }, [h('i')]), state = h('small', { class: 'muted fd-state', role: 'status' });
      const go = h('button', { class: 'btn primary big', 'data-t': 'fd.post' });
      const form = h('div', { class: 'fd-form', hidden: true }, [h('div', { class: 'ck-field' }, [cap, PD.chatkit.emojiButton(cap)]),
        h('label', { class: 'fd-songrow' }, [h('span', { html: IC.music }), song]), h('datalist', { id: listId }, names.map(n => h('option', { value: n }))),
        h('small', { class: 'muted', 'data-t': 'fd.who' }), visRow, bar]);
      const paintVis = () => { visRow.innerHTML = ''; [['public', IC.globe, 'fd.visPublic'], ['friends', IC.users, 'fd.visFriends']].forEach(([k, i, key]) => visRow.appendChild(h('button', { role: 'radio', 'aria-checked': String(vis === k), class: vis === k ? 'on' : '', html: i + '<span data-t="' + key + '"></span>', onclick: () => { vis = k; PD.store.set('fd.vis', k); paintVis(); } }))); PD.i18n.apply(visRow); };
      async function take(file, dur) {
        if (!file) return;
        state.textContent = t('fd.preparing');
        try { const p = await prepare(file, 'video', { dur }); checkReel(p, file); prep = p; state.textContent = ''; }
        catch (e) { prep = null; state.textContent = reelErr(e); }
        paint();
      }
      const film = () => { if (busy) return; if (PD.isTouch()) pickVideo(true).then(f => take(f)); else recorder(take); };
      const gallery = () => { if (busy) return; pickVideo(false).then(f => take(f)); };
      function paint() {
        stageEl.innerHTML = ''; if (src) { URL.revokeObjectURL(src); src = null; }
        form.hidden = go.hidden = !prep;
        if (!prep) {
          stageEl.append(h('div', { class: 'fd-two' }, [
            h('button', { class: 'fd-pick', html: ic.camera + '<span data-t="fd.film"></span>', onclick: film }),
            h('button', { class: 'fd-pick', html: IC.photo + '<span data-t="fd.gallery"></span>', onclick: gallery })]),
            h('small', { class: 'muted fd-rules', text: t('fd.rules', { m: MAXSEC, n: ROOM() }) }));
        } else {
          src = URL.createObjectURL(prep.blob);
          const m = prep.meta, v = h('video', { src, controls: true, playsinline: true }); v.muted = true;
          stageEl.append(v, h('small', { class: 'muted', text: m.w + '×' + m.h + ' · ' + PD.fmtTime(m.dur) + ' · ' + (prep.blob.size / 1048576).toFixed(1) + ' MB · ' + t('fd.asIs') }),
            h('button', { class: 'btn small quiet', 'data-t': 'fd.change', onclick: () => { if (busy) return; prep = null; paint(); } }));
        }
        PD.i18n.apply(stageEl);
      }
      go.onclick = async () => {
        if (busy || !prep) return;
        busy = true; go.disabled = true; bar.hidden = false;
        try {
          const media = await upload(prep, 'p', f => { bar.firstChild.style.width = Math.round(f * 100) + '%'; state.textContent = t('fd.uploading', { p: Math.round(f * 100) }); });
          const row = await C.social.post({ kind: 'video', caption: cap.value.trim(), song: song.value.trim(), visibility: vis, media_path: media.media_path, thumb_path: media.thumb_path || null, media_meta: media.media_meta || {} });
          const p = Object.assign({ author_name: (C.profile && C.profile.display_name) || '', author_nick: C.profile && C.profile.nickname, author_avatar: C.profile && C.profile.avatar_url, my_reaction: null, top: [], friend: false, saved: false, song: '' }, row);
          close(); done && done(p);
        } catch (e) {
          busy = false; go.disabled = false; bar.hidden = true;
          state.textContent = /slow-down/.test(e && e.message) ? t('fd.slow') : /video-too-long/.test(e && e.message) ? t('fd.reelLong', { n: Math.round(prep.meta.dur), m: MAXSEC }) : reelErr(e);
        }
      };
      b.append(h('h2', { 'data-t': 'fd.new' }), stageEl, form, state, go);
      PD.i18n.apply(b); paintVis(); paint();
      return () => { if (src) URL.revokeObjectURL(src); onClose && onClose(); };
    });
  }

  /* ---------------- a person: their posts, and where we stand ---------------- */
  function profile(id) {
    if (!id) return;
    PD.ui.sheet((b, close) => {
      const headBox = h('div', { class: 'pf-head' }), grid = h('div', { class: 'fd-grid' });
      b.append(headBox, h('h3', { 'data-t': 'fd.posts' }), grid);
      (async () => {
        try {
          const rows = (await C.social.feed('user', { target: id, lim: 30 }) || []).filter(r => r.kind === 'video');
          const any = rows[0];
          const fr = id === C.uid ? null : (await C.social.friends() || []).find(f => f.id === id);
          const nm = (fr && (fr.display_name || '@' + fr.nickname)) || (any && label(any)) || (id === C.uid ? (C.profile && C.profile.display_name) : '') || '—';
          const nick = (fr && fr.nickname) || (any && any.author_nick) || (id === C.uid && C.profile && C.profile.nickname) || '';
          const rel = id === C.uid ? 'self' : fr ? fr.relation : 'none';
          const acts = h('div', { class: 'row', style: 'gap:8px;flex-wrap:wrap' });
          if (rel === 'friend') acts.append(h('button', { class: 'btn primary small', 'data-t': 'cm.write', onclick: async () => { try { const c = await C.chat.open(id); close(); PD.app.go('community', 'c:' + c + ':' + nm); } catch (e) { PD.ui.toast(U().err(e)); } } }),
            h('span', { class: 'chip', text: '✓ ' + t('fr.friend') }));
          else if (rel === 'incoming') acts.append(h('button', { class: 'btn primary small', 'data-t': 'fr.accept', onclick: async () => { try { await C.social.respond(id, true); close(); profile(id); } catch (e) { PD.ui.toast(friendErr(e)); } } }));
          else if (rel === 'outgoing') acts.append(h('span', { class: 'chip', 'data-t': 'fd.requested' }));
          else if (rel === 'none' && nick) acts.append(h('button', { class: 'btn primary small', html: IC.addUser + '<span data-t="fr.send"></span>', onclick: async () => { try { await C.social.request(nick); close(); profile(id); PD.ui.toast(t('fr.sent'), 4000); } catch (e) { PD.ui.toast(friendErr(e)); } } }));
          if (rel !== 'self') acts.append(h('button', { class: 'pz-ic', 'aria-label': t('md.more'), html: ic.more, onclick: () => { close(); U().userActions(id, nm); } }));
          headBox.append(avatar(any && any.author_avatar, nm, 'big'), h('div', { class: 'grow' }, [h('h2', { text: nm, style: 'margin:0' }), nick ? h('small', { class: 'muted', text: '@' + nick }) : null, acts].filter(Boolean)));
          PD.i18n.apply(headBox);
          if (!rows.length) { grid.appendChild(h('p', { class: 'muted', 'data-t': 'fd.noUserPosts' })); PD.i18n.apply(grid); return; }
          await urls(rows);
          rows.forEach(p => { const th = p.kind === 'photo' ? C.storage.url(p.media_path) : p.thumb_path ? C.storage.url(p.thumb_path) : null;
            grid.appendChild(h('button', { class: 'fd-tile k-' + p.kind, onclick: () => { close(); PD.app.go('community', 'p:' + p.id); } }, [th ? h('img', { alt: '', src: th, loading: 'lazy' }) : h('span', { class: 'fd-tile-t', text: p.kind === 'text' ? p.caption.slice(0, 80) : '' }),
              p.kind === 'video' ? h('span', { class: 'fd-tile-k', html: ic.play }) : p.kind === 'audio' ? h('span', { class: 'fd-tile-k', html: IC.music }) : null, h('small', { class: 'fd-tile-n', html: glyph('panduri') + nf(p.reactions) })].filter(Boolean))); });
        } catch (e) { headBox.textContent = U().err(e); }
      })();
    });
  }

  /* ---------------- friends ---------------- */
  const friendErr = e => { const m = e && e.message || ''; return /not-found/.test(m) ? t('fr.notFound') : /self/.test(m) ? t('fr.self') : /too-many-requests/.test(m) ? t('fr.tooMany') : U().err(e); };
  const nickErr = e => { const m = e && e.message || ''; return /nickname-taken/.test(m) ? t('fr.nickTaken') : /nickname-invalid/.test(m) ? t('fr.nickBad') : U().err(e); };
  /** the nickname: shown, and changed; `need` when the member has none yet */
  function nickCard(need, onSaved) {
    const cur = (C.profile && C.profile.nickname) || '';
    const sugg = cur || ((PD.account.profile.name || '').toLowerCase().normalize('NFKD').replace(/[^a-z0-9_.]+/g, '').slice(0, 20));
    const inp = h('input', { class: 'input', autocomplete: 'username', autocapitalize: 'none', spellcheck: 'false', maxlength: '25', placeholder: 'nickname', 'aria-label': t('fr.myNick'), value: sugg });
    const msg = h('small', { class: 'muted', 'data-t': 'fr.nickWhy' });
    const save = async () => { const v = inp.value.trim().replace(/^@+/, '').toLowerCase(); if (!v) return inp.focus(); try { await C.social.setNick(v); await C.loadProfile(); onSaved ? onSaved(v) : PD.app.render(); } catch (e) { msg.textContent = nickErr(e); msg.classList.add('err'); } };
    inp.addEventListener('keydown', e => { if (e.key === 'Enter') save(); });
    return h('div', { class: 'cm-name fr-nick' }, [h('p', { 'data-t': need ? 'fr.nickNeed' : 'fr.myNick' }), h('div', { class: 'row' }, [h('span', { class: 'fr-at', text: '@' }), inp, h('button', { class: 'btn primary', 'data-t': 'cm.save', onclick: save })]), msg]);
  }
  /** friends, as in a social app: three tabs (friends · requests · find) under the member's own @nickname */
  function friends(box) {
    const nickNow = C.profile && C.profile.nickname;
    const on = iso => !!iso && Date.now() - new Date(iso).getTime() < 5 * 60000;
    const face = (r, cls) => h('span', { class: 'cm-face' + (cls ? ' ' + cls : '') + (on(r.last_seen) ? ' cm-on' : '') }, [avatar(r.avatar_url, r.display_name || r.nickname)]);
    const nm = r => r.display_name || '@' + r.nickname;
    let tab = PD.store.get('fr.tab', 'list'); if (!['list', 'req', 'find'].includes(tab)) tab = 'list';
    let rows = [];
    const me = nickNow ? h('div', { class: 'fr-me' }, [h('span', {}, [h('small', { class: 'muted', 'data-t': 'fr.myNick' }), h('b', { text: '@' + nickNow })]),
      h('button', { class: 'btn small quiet', html: ic.edit, 'aria-label': t('fr.edit'), onclick: () => { me.replaceWith(nickCard(false)); PD.i18n.apply(box); } })]) : nickCard(true, () => PD.app.render());
    const seg = h('div', { class: 'seg fr-seg', role: 'tablist' });
    const pane = h('div', { class: 'fr-pane' });
    box.append(me, seg, pane);
    function paintSeg() {
      const inc = rows.filter(r => r.relation === 'incoming').length;
      seg.querySelectorAll(':scope > button').forEach(b => b.remove());   // the sliding thumb (PD.motion) stays
      [['list', 'fr.tabList'], ['req', 'fr.tabReq'], ['find', 'fr.tabFind']].forEach(([k, key]) => seg.appendChild(h('button', { role: 'tab', 'aria-pressed': String(tab === k), onclick: () => go(k) }, [h('span', { 'data-t': key }), k === 'req' && inc ? h('i', { class: 'cm-dot', text: inc > 9 ? '9+' : String(inc) }) : null].filter(Boolean))));
      PD.i18n.apply(seg);
    }
    let dirN = 0;
    function go(k) {
      if (k === tab) return;
      const order = ['list', 'req', 'find'], d = order.indexOf(k) > order.indexOf(tab) ? 1 : -1;
      tab = k; PD.store.set('fr.tab', k); seg.querySelectorAll('button').forEach((b, i) => b.setAttribute('aria-pressed', String(order[i] === k)));
      dirN = d; paint();
    }
    const gone = (row, then) => { if (PD.motion && PD.motion.ok() && row.animate) { row.style.overflow = 'hidden'; const hh = row.offsetHeight; row.animate([{ height: hh + 'px', opacity: 1, transform: 'none' }, { height: '0px', opacity: 0, transform: 'translateX(30%)', marginTop: '0px', paddingTop: '0px', paddingBottom: '0px' }], { duration: 300, easing: 'cubic-bezier(.4,0,.2,1)', fill: 'forwards' }).onfinish = then; } else then(); };
    const row = (r, acts) => h('div', { class: 'cm-crow fr-row' }, [h('button', { class: 'fr-who', onclick: () => profile(r.id) }, [face(r), h('span', { class: 'grow' }, [h('b', {}, [nm(r), r.vip ? h('span', { class: 'vip-tag', text: 'VIP' }) : null].filter(Boolean)), h('small', { text: (r.nickname ? '@' + r.nickname + ' · ' : '') + (on(r.last_seen) ? t('fr.online') : t('lv.level', { n: r.level || 0 })) })])])].concat(acts));
    function paint() {
      pane.innerHTML = '';
      const by = k => rows.filter(r => r.relation === k);
      if (tab === 'list') {
        const fr = by('friend');
        if (!fr.length) pane.append(h('div', { class: 'cm-empty' }, [h('span', { class: 'cm-big', html: IC.users }), h('p', { 'data-t': 'fr.none' }), h('button', { class: 'btn primary', html: IC.addUser + '<span data-t="fr.add"></span>', onclick: () => go('find') })]));
        fr.forEach(r => pane.append(row(r, [
          h('button', { class: 'pz-ic fr-msg', 'aria-label': t('cm.write'), title: t('cm.write'), html: IC.dm, onclick: async () => { try { const id = await C.chat.open(r.id); PD.app.go('community', 'c:' + id + ':' + nm(r)); } catch (e) { PD.ui.toast(U().err(e)); } } }),
          h('button', { class: 'pz-ic', 'aria-label': t('md.more'), html: ic.more, onclick: () => PD.ui.sheet((b2, close) => { b2.append(h('h2', { text: nm(r) }), h('div', { class: 'cm-list' }, [
            h('button', { class: 'btn', 'data-t': 'fr.remove', onclick: () => { close(); PD.ui.confirm(t('fr.removeQ', { n: nm(r) }), async () => { try { await C.social.unfriend(r.id); load(); } catch (e) { PD.ui.toast(U().err(e)); } }); } }),
            h('button', { class: 'btn', 'data-t': 'md.report', onclick: () => { close(); U().reportSheet('user', r.id); } }),
            h('button', { class: 'btn', 'data-t': 'md.block', onclick: () => { close(); U().confirmBlock(r.id, r.display_name, load); } })])); }) })])));
        pane.append(h('p', { class: 'muted small-note', 'data-t': 'fr.onlyFriends' }));
      } else if (tab === 'req') {
        const inc = by('incoming'), out = by('outgoing');
        if (!inc.length && !out.length) pane.append(h('div', { class: 'cm-empty' }, [h('span', { class: 'cm-big', html: IC.addUser }), h('p', { 'data-t': 'fr.noReq' })]));
        if (inc.length) pane.append(h('h3', { class: 'cm-lab', 'data-t': 'fr.incoming' }));
        inc.forEach(r => { const el = row(r, [
          h('button', { class: 'btn primary small', 'data-t': 'fr.accept', onclick: async () => { try { await C.social.respond(r.id, true); PD.fx && PD.fx.haptic && PD.fx.haptic('success'); gone(el, load); } catch (e) { PD.ui.toast(friendErr(e)); } } }),
          h('button', { class: 'btn small quiet', 'data-t': 'fr.decline', onclick: async () => { try { await C.social.respond(r.id, false); gone(el, load); } catch (e) { PD.ui.toast(friendErr(e)); } } })]); pane.append(el); });
        if (out.length) pane.append(h('h3', { class: 'cm-lab', 'data-t': 'fr.outgoing' }));
        out.forEach(r => { const el = row(r, [h('button', { class: 'btn small quiet', 'data-t': 'fr.cancel', onclick: async () => { try { await C.social.unfriend(r.id); gone(el, load); } catch (e) { PD.ui.toast(U().err(e)); } } })]); pane.append(el); });
      } else {
        const q = h('input', { class: 'input', type: 'search', autocapitalize: 'none', spellcheck: 'false', placeholder: '@nickname', 'aria-label': t('fr.add'), enterkeyhint: 'search' });
        const found = h('div', { class: 'cm-clist' });
        const find = async () => {
          const v = q.value.trim().replace(/^@+/, '').toLowerCase(); found.innerHTML = ''; if (!v) return;
          if (v === nickNow) { found.appendChild(h('p', { class: 'muted', 'data-t': 'fr.self' })); PD.i18n.apply(found); return; }
          found.append(...(U().skRows ? U().skRows(1) : []));
          try {
            const r = (await C.social.find(v) || [])[0]; found.innerHTML = '';
            if (!r) { found.appendChild(h('p', { class: 'muted', 'data-t': 'fr.notFound' })); PD.i18n.apply(found); return; }
            const act = r.relation === 'friend' ? h('span', { class: 'chip', 'data-t': 'fr.already' }) : r.relation === 'outgoing' ? h('span', { class: 'chip', 'data-t': 'fd.requested' })
              : h('button', { class: 'btn primary small', 'data-t': r.relation === 'incoming' ? 'fr.accept' : 'fr.send', onclick: async e => { const b = e.currentTarget; b.disabled = true; try { if (r.relation === 'incoming') await C.social.respond(r.id, true); else await C.social.request(v); b.replaceWith(h('span', { class: 'chip fr-ok', text: '✓ ' + t(r.relation === 'incoming' ? 'fr.already' : 'fd.requested') })); PD.fx && PD.fx.haptic && PD.fx.haptic('success'); load(true); } catch (er) { b.disabled = false; PD.ui.toast(friendErr(er)); } } });
            found.appendChild(row(r, [act])); PD.i18n.apply(found); PD.motion && PD.motion.reveal(found, 0);
          } catch (e) { found.textContent = friendErr(e); }
        };
        let tm = 0; q.addEventListener('input', () => { clearTimeout(tm); tm = setTimeout(find, 450); });
        q.addEventListener('keydown', e => { if (e.key === 'Enter') { clearTimeout(tm); find(); } });
        pane.append(h('label', { class: 'cm-sbox' }, [h('span', { html: ic.search }), q]), h('small', { class: 'muted small-note', 'data-t': 'fr.findWhy' }), found);
        if (!PD.isTouch()) setTimeout(() => q.focus(), 50);
      }
      PD.i18n.apply(pane);
      if (PD.motion && PD.motion.ok()) {
        if (dirN) pane.animate([{ transform: 'translateX(' + (dirN * 24) + 'px)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 260, easing: 'cubic-bezier(.22,1,.36,1)' });
        else PD.motion.reveal(pane, 30);
      }
      dirN = 0;
    }
    async function load(quiet) {
      if (!rows.length && !quiet) { pane.innerHTML = ''; pane.append(...(U().skRows ? U().skRows(3) : [])); }
      try { rows = await C.social.friends() || []; paintSeg(); if (!quiet || tab !== 'find') paint(); } catch (e) { pane.textContent = U().err(e); }
    }
    paintSeg(); load();
  }

  /** a shared post inside a chat: a small card that opens it (returned at once, filled when the post arrives) */
  function postCard(id) {
    const box = h('button', { class: 'cm-shared', type: 'button' }, [h('small', { class: 'muted', text: '…' })]);
    const gone = () => { box.innerHTML = ''; box.disabled = true; box.appendChild(h('small', { class: 'muted', 'data-t': 'fd.unavailable' })); PD.i18n.apply(box); };
    (async () => {
      try {
        const p = (await C.social.feed('one', { before: id }) || [])[0];
        if (!p) return gone();
        await urls([p]);
        const th = p.kind === 'photo' ? C.storage.url(p.media_path) : p.thumb_path ? C.storage.url(p.thumb_path) : null;
        box.innerHTML = '';
        box.append(th ? h('img', { alt: '', src: th }) : h('span', { class: 'cm-shared-k', html: p.kind === 'audio' ? IC.music : p.kind === 'video' ? ic.video : IC.text }),
          h('span', { class: 'grow' }, [h('b', { text: label(p) }), h('small', { text: (p.caption || t('fd.' + p.kind)).slice(0, 90) })]));
        box.onclick = () => PD.app.go('community', 'p:' + p.id);
      } catch (_) { gone(); }
    })();
    return box;
  }

  return { feed, friends, nickCard, profile, compose, comments, picker, holdable, glyph, glyphText, prepare, upload, urls, mediaEl, fileErr, postCard, REACTS, PANDURI, ACCEPT, IC };
})();
