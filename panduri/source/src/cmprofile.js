/* =====================================================================
   The community's own place: its bottom bar (home · friends · + · inbox ·
   profile — the app's own dock slides away while you are here), the
   profile (photo, bio, followers, following, likes, videos, reposts and,
   for me only, saved, liked and history), following, search with
   #hashtags, a hashtag's page, and sharing a video anywhere.
   Everything here is the members' own content and the server's own
   numbers (backend/supabase/migrations/202611160001_community_profiles.sql):
   nothing is counted or guessed on the device. A server that has not been
   updated yet is told apart and said so, never faked.
   ===================================================================== */
PD.i18n.add({
  'cn.home': ['მთავარი', 'Home'], 'cn.friends': ['მეგობრები', 'Friends'], 'cn.new': ['ახალი ვიდეო', 'New video'], 'cn.inbox': ['შემოსულები', 'Inbox'], 'cn.me': ['პროფილი', 'Profile'],
  'cn.exit': ['აპში დაბრუნება', 'Back to the app'], 'cn.search': ['ძიება', 'Search'],
  'cp.following': ['გამოწერილი', 'Following'], 'cp.followers': ['გამომწერი', 'Followers'], 'cp.likes': ['მოწონება', 'Likes'],
  'cp.follow': ['გამოწერა', 'Follow'], 'cp.followBack': ['შენც გამოიწერე', 'Follow back'], 'cp.unfollow': ['გამოწერის გაუქმება', 'Unfollow'], 'cp.followingBtn': ['გამოწერილია', 'Following'],
  'cp.unfollowQ': ['გააუქმო {n}-ის გამოწერა?', 'Unfollow {n}?'], 'cp.followsYou': ['გამოგიწერა', 'Follows you'],
  'cp.edit': ['პროფილის რედაქტირება', 'Edit profile'], 'cp.editS': ['რედაქტირება', 'Edit profile'], 'cp.sharePS': ['გაზიარება', 'Share profile'], 'cp.shareP': ['პროფილის გაზიარება', 'Share profile'], 'cp.message': ['მიწერა', 'Message'], 'cp.addFriend': ['მეგობრად დამატება', 'Add friend'],
  'cp.requested': ['თხოვნა გაგზავნილია', 'Requested'], 'cp.accept': ['მეგობრობაზე დათანხმება', 'Accept friend request'], 'cp.friend': ['მეგობარი', 'Friend'],
  'cp.addBio': ['+ დაამატე ბიო', '+ Add a bio'], 'cp.lv': ['დონე {n}', 'Level {n}'],
  'cp.tVideos': ['ვიდეოები', 'Videos'], 'cp.tReposts': ['რეპოსტები', 'Reposts'], 'cp.tSaved': ['შენახული', 'Saved'], 'cp.tLiked': ['მოწონებული', 'Liked'], 'cp.tHistory': ['ნანახი', 'History'],
  'cp.private': ['მხოლოდ შენ ხედავ', 'Only you can see this'],
  'cp.eVideos': ['ვიდეოები ჯერ არ არის.', 'No videos yet.'], 'cp.eVideosMe': ['შენი პირველი ვიდეო აქ გამოჩნდება — გადაიღე და გაუზიარე ყველას.', 'Your first video will show here — film one and share it.'],
  'cp.eReposts': ['რეპოსტები ჯერ არ არის.', 'No reposts yet.'], 'cp.eRepostsMe': ['ვიდეო, რომელსაც დაარეპოსტებ, აქ გამოჩნდება — შენი გამომწერებიც ნახავენ.', 'Videos you repost show here — your followers see them too.'],
  'cp.eSaved': ['შენახული ვიდეოები აქ გამოჩნდება.', 'Saved videos show here.'], 'cp.eLiked': ['მოწონებული ვიდეოები აქ გამოჩნდება.', 'Videos you like show here.'], 'cp.eHistory': ['ნანახი ვიდეოები აქ გამოჩნდება — ბოლო ნანახი პირველია.', 'Videos you watch show here — the last one first.'],
  'cp.manage': ['მართვა', 'Manage'], 'cp.done': ['მზადაა', 'Done'], 'cp.removeAll': ['ყველას წაშლა', 'Remove all'], 'cp.removeAllQ': ['წაიშალოს ყველა რეპოსტი ({n})?', 'Remove all reposts ({n})?'],
  'cp.removeOne': ['რეპოსტის წაშლა', 'Remove repost'], 'cp.removed': ['რეპოსტი წაიშალა', 'Repost removed'], 'cp.removedAll': ['ყველა რეპოსტი წაიშალა', 'All reposts removed'],
  'cp.clearH': ['ისტორიის გასუფთავება', 'Clear history'], 'cp.clearHQ': ['წაიშალოს ნანახი ვიდეოების ისტორია? ნახვები ავტორებს დათვლილი რჩებათ.', 'Clear your watch history? The authors keep the views they were counted.'], 'cp.cleared': ['ისტორია გასუფთავდა', 'History cleared'],
  'cp.notFound': ['ეს პროფილი ვერ მოიძებნა.', 'This profile could not be found.'], 'cp.blocked': ['ეს პროფილი შენთვის დახურულია.', 'This profile is not available to you.'],
  'cp.needServer': ['ეს ნაწილი სერვერის განახლების შემდეგ ჩაირთვება.', 'This part switches on once the server has been updated.'],
  'cp.bannerAdd': ['ბანერის დამატება', 'Add a banner'], 'cp.bannerChange': ['ბანერის შეცვლა', 'Change banner'], 'cp.bannerRemove': ['ბანერის წაშლა', 'Remove banner'], 'cp.bannerUp': ['ბანერი იტვირთება…', 'Uploading the banner…'],
  'cp.bannerD': ['ფოტო, GIF ან მოკლე ვიდეო (MP4/WebM, უხმოდ, 15 წამამდე) — 10 MB-მდე.', 'A photo, a GIF or a short video (MP4/WebM, silent, up to 15 seconds) — up to 10 MB.'],
  'cp.photoD': ['ფოტო ან GIF — GIF მოძრაობს, 4 MB-მდე.', 'A photo or a GIF — a GIF moves, up to 4 MB.'],
  'cp.tooBig': ['ფაილი ძალიან დიდია: მაქსიმუმ {n} MB.', 'The file is too large: {n} MB at most.'], 'cp.tooLong': ['ვიდეო ძალიან გრძელია: მაქსიმუმ 15 წამი.', 'The video is too long: 15 seconds at most.'],
  'cp.badFile': ['ეს ფაილი არ გამოდგება: აირჩიე ფოტო, GIF ან MP4/WebM ვიდეო.', 'This file will not do: choose a photo, a GIF or an MP4/WebM video.'],
  'cp.photo': ['პროფილის ფოტო', 'Profile photo'], 'cp.photoChange': ['ფოტოს შეცვლა', 'Change photo'], 'cp.photoRemove': ['ფოტოს წაშლა', 'Remove photo'], 'cp.photoUp': ['ფოტო იტვირთება…', 'Uploading the photo…'],
  'cp.name': ['სახელი', 'Name'], 'cp.nick': ['nickname', 'Nickname'], 'cp.bio': ['ბიო', 'Bio'], 'cp.bioPh': ['რამდენიმე სიტყვა შენზე — რას უკრავ, საიდან ხარ…', 'A few words about you — what you play, where you are from…'],
  'cp.save': ['შენახვა', 'Save'], 'cp.saved': ['შენახულია', 'Saved'], 'cp.bioBad': ['ბიოში ისეთი სიტყვაა, რომელიც აქ არ დაიშვება.', 'The bio has a word that is not allowed here.'],
  'cp.listEmptyFo': ['ჯერ არავინ გამოუწერია.', 'No followers yet.'], 'cp.listEmptyFi': ['ჯერ არავინ არის გამოწერილი.', 'Not following anyone yet.'],
  'cp.searchPh': ['მოძებნე ხალხი, ვიდეო ან #hashtag', 'Search people, videos or #hashtags'], 'cp.recent': ['ბოლო ძიებები', 'Recent searches'], 'cp.clear': ['გასუფთავება', 'Clear'],
  'cp.trending': ['პოპულარული #hashtag-ები', 'Trending #hashtags'], 'cp.people': ['ხალხი', 'People'], 'cp.tags': ['#hashtag-ები', '#Hashtags'], 'cp.videos': ['ვიდეოები', 'Videos'],
  'cp.noResults': ['„{q}“ — ვერაფერი მოიძებნა.', 'Nothing found for “{q}”.'], 'cp.noTrending': ['#hashtag-ები ჯერ არ არის — დაწერე #ფანდური შენი ვიდეოს აღწერაში.', 'No #hashtags yet — write #panduri in your video’s caption.'],
  'cp.tagStats': ['{v} ვიდეო · {n} ნახვა', '{v} videos · {n} views'], 'cp.tagEmpty': ['ამ #hashtag-ით ვიდეო ჯერ არ არის.', 'No videos with this #hashtag yet.'],
  'cp.shareTo': ['გაზიარება', 'Share to'], 'cp.sendFriend': ['გაუგზავნე მეგობარს', 'Send to a friend'], 'cp.repost': ['რეპოსტი', 'Repost'], 'cp.reposted': ['დარეპოსტებულია', 'Reposted'],
  'cp.copy': ['ბმულის კოპირება', 'Copy link'], 'cp.copied': ['ბმული დაკოპირდა', 'Link copied'], 'cp.more': ['სხვა', 'More'], 'cp.story': ['Story', 'Story'],
  'cp.repostOn': ['დარეპოსტდა — შენს პროფილზე ჩანს', 'Reposted — it is on your profile now'], 'cp.repostOff': ['რეპოსტი გაუქმდა', 'Repost removed'],
  'cp.ownRepost': ['საკუთარ ვიდეოს ვერ დაარეპოსტებ.', 'You cannot repost your own video.'], 'cp.friendsOnlyRepost': ['მხოლოდ მეგობრებისთვის ვიდეოს ვერ დაარეპოსტებ.', 'A friends-only video cannot be reposted.'],
  'cp.preparing': ['ვიდეო მზადდება გასაზიარებლად…', 'Preparing the video to share…'], 'cp.shareNow': ['გაზიარება — {a}', 'Share — {a}'], 'cp.shareFileNo': ['ეს მოწყობილობა ვიდეოს ფაილად ვერ აზიარებს — ბმული დაკოპირდა, ჩასვი {a}-ში.', 'This device cannot share the video file — the link is copied, paste it in {a}.'],
  'cp.pasteIn': ['ბმული დაკოპირდა — ჩასვი {a}-ში.', 'Link copied — paste it in {a}.'], 'cp.shareText': ['{n} ფანდურის აპში', '{n} on the Fanduri app'],
  'cp.linkNote': ['ბმულით ვიდეოს ნახავს ის, ვინც აპში შესულია და ვისაც მისი ნახვა შეუძლია.', 'The link opens the video for people signed in to the app who may see it.'],
  'cp.act': ['აქტივობა', 'Activity'], 'cp.msgs': ['მესიჯები', 'Messages'],
  'cp.err': ['ვერ მოხერხდა — სცადე თავიდან.', 'That did not work — try again.']
});

PD.cmp = (() => {
  const h = PD.h, t = PD.i18n.t, C = PD.cloud, ic = PD.ic;
  const S = () => PD.social, U = () => PD.community.util;
  const moves = () => !!(PD.motion && PD.motion.ok());
  const buzz = k => { try { PD.fx && PD.fx.haptic && PD.fx.haptic(k); } catch (_) {} };
  const OUTQ = 'cubic-bezier(.22,1,.36,1)';
  const I = (d, w) => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' + (w || 1.9) + '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>';
  const IF = d => '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' + d + '</svg>';
  const nf = n => { n = +n || 0; return n >= 1e6 ? (n / 1e6).toFixed(n >= 1e7 ? 0 : 1).replace(/\.0$/, '') + 'M' : n >= 1e3 ? (n / 1e3).toFixed(n >= 1e4 ? 0 : 1).replace(/\.0$/, '') + 'K' : String(n); };
  const initial = n => U().initial(n);
  const avatar = (url, name, cls) => h('span', { class: 'avatar' + (cls ? ' ' + cls : ''), html: url ? '<img alt="" src="' + PD.esc(url) + '">' : initial(name) });
  /** a banner: a video loops silently; a picture or GIF is an image (a GIF moves by itself) */
  const isVid = url => /\.(mp4|webm)(\?|$)/i.test(url || '');
  const bannerMedia = url => {
    if (!isVid(url)) return h('img', { class: 'cp-bnm', alt: '', src: url, decoding: 'async' });
    const v = h('video', { class: 'cp-bnm', muted: true, loop: true, playsinline: true, preload: 'metadata', 'aria-hidden': 'true', disablepictureinpicture: true });
    v.muted = true; v.defaultMuted = true; v.autoplay = !!(PD.motion && PD.motion.ok()); v.src = url;   // silent always; still when motion is reduced
    return v;
  };
  const nameOf = r => (r && (r.display_name || (r.nickname ? '@' + r.nickname : ''))) || '—';
  const old = e => /could not find the function|PGRST202|404|does not exist/i.test((e && (e.message || e.code)) || '');
  const err = e => old(e) ? t('cp.needServer') : U().err(e);
  const IC = {
    home: [I('<path d="M4 10.6 12 4l8 6.6V19a1.5 1.5 0 0 1-1.5 1.5H15v-5.4H9v5.4H5.5A1.5 1.5 0 0 1 4 19z"/>'), IF('<path d="M3.3 10 12 2.9l8.7 7.1V19a2.2 2.2 0 0 1-2.2 2.2h-4.2v-5.6H9.7v5.6H5.5A2.2 2.2 0 0 1 3.3 19z"/>')],
    friends: [I('<circle cx="9" cy="8.5" r="3.4"/><path d="M2.8 19.6c.7-3.4 3.2-5.2 6.2-5.2s5.5 1.8 6.2 5.2"/><path d="M15.6 5.6a3.2 3.2 0 0 1 0 6M17.6 14.6c2 .6 3.3 2.3 3.7 5"/>'), IF('<circle cx="9" cy="8.3" r="4"/><path d="M1.9 20c.7-4 3.7-6.3 7.1-6.3s6.4 2.3 7.1 6.3c.1.6-.3 1-.9 1H2.8c-.6 0-1-.4-.9-1z"/><path d="M15.4 4.3a4 4 0 0 1 0 8 6 6 0 0 0 0-8zM17.5 13.7c2.6.7 4.2 2.9 4.6 6 .1.7-.4 1.3-1.1 1.3h-2.6c.2-2.9-.2-5.3-.9-7.3z"/>')],
    inbox: [I('<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-5 4v-4.2A2.5 2.5 0 0 1 4 13.5z"/>'), IF('<path d="M3.2 5.6A3 3 0 0 1 6.2 2.6h11.6a3 3 0 0 1 3 3v7.8a3 3 0 0 1-3 3h-7.5l-5 4c-.7.5-1.6 0-1.6-.8v-3.2a3 3 0 0 1-.5-1.7z"/>')],
    me: [I('<circle cx="12" cy="8.4" r="3.9"/><path d="M4.6 20.2c.9-3.7 3.8-5.7 7.4-5.7s6.5 2 7.4 5.7"/>'), IF('<circle cx="12" cy="8.2" r="4.5"/><path d="M3.8 20.4c.9-4.2 4.1-6.6 8.2-6.6s7.3 2.4 8.2 6.6c.1.5-.3 1-.8 1H4.6c-.5 0-.9-.5-.8-1z"/>')],
    plus: I('<path d="M12 6v12M6 12h12"/>', 2.8),
    search: I('<circle cx="11" cy="11" r="6.6"/><path d="M20 20l-4.2-4.2"/>', 2.1),
    exit: I('<path d="M15 5l-7 7 7 7"/>', 2.2),
    menu: I('<path d="M4 7h16M4 12h16M4 17h16"/>', 2),
    share: I('<path d="M14 5l6 6-6 6"/><path d="M20 11h-8a8 8 0 0 0-8 8"/>', 2),
    grid: I('<rect x="4" y="4" width="6.5" height="6.5" rx="1.2"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.2"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.2"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.2"/>'),
    repost: I('<path d="M17 2.8l3 3-3 3"/><path d="M4 11V9.6a3.8 3.8 0 0 1 3.8-3.8H20"/><path d="M7 21.2l-3-3 3-3"/><path d="M20 13v1.4a3.8 3.8 0 0 1-3.8 3.8H4"/>'),
    save: I('<path d="M6.5 3.8h11a1 1 0 0 1 1 1v15.4l-6.5-4.4-6.5 4.4V4.8a1 1 0 0 1 1-1z"/>'),
    heart: I('<path d="M12 20.3S3.6 15.2 3.6 9.1A4.6 4.6 0 0 1 12 6.4a4.6 4.6 0 0 1 8.4 2.7c0 6.1-8.4 11.2-8.4 11.2z"/>'),
    clock: I('<circle cx="12" cy="12" r="8.4"/><path d="M12 7.6V12l3 1.9"/>'),
    lock: I('<rect x="5.5" y="10.5" width="13" height="9.5" rx="2"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"/>'),
    play: IF('<path d="M8 5.2v13.6a.8.8 0 0 0 1.2.7l10.4-6.8a.8.8 0 0 0 0-1.4L9.2 4.5A.8.8 0 0 0 8 5.2z"/>'),
    x: I('<path d="M7 7l10 10M17 7L7 17"/>', 2.4),
    cam: I('<path d="M4 8.5A2.5 2.5 0 0 1 6.5 6h1.6l1.5-2h4.8l1.5 2h1.6A2.5 2.5 0 0 1 20 8.5v8a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 16.5z"/><circle cx="12" cy="12.4" r="3.4"/>', 2),
    edit: I('<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/>'),
    addUser: I('<circle cx="9.5" cy="8.4" r="3.6"/><path d="M3 19.6c.8-3.4 3.4-5.3 6.5-5.3 1.4 0 2.6.3 3.7 1"/><path d="M18 13v6M15 16h6"/>'),
    check: I('<path d="M5 12.5l4.5 4.5L19 7.5"/>', 2.6),
    hash: I('<path d="M9.5 4L8 20M16 4l-1.5 16M4.5 9h15.5M3.8 15h15.5"/>', 2),
    link: I('<path d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1.2 1.2"/><path d="M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1.2-1.2"/>', 2.1),
    dots: IF('<circle cx="5.5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="18.5" cy="12" r="2"/>'),
    shield: I('<path d="M12 3.2l7 2.8v5.6c0 4.4-3 7.8-7 9.2-4-1.4-7-4.8-7-9.2V6z"/>'),
    gear: I('<circle cx="12" cy="12" r="3.2"/><path d="M12 2.8v2.4M12 18.8v2.4M4.2 7.4l2 1.2M17.8 15.4l2 1.2M4.2 16.6l2-1.2M17.8 8.6l2-1.2"/>')
  };
  // the apps a video can go to: a simple sign of each on its own colour (not the companies' logos)
  const APPS = {
    repost: ['linear-gradient(140deg,#e2ae84,#a9724a)', IC.repost],
    copy: ['#3a3b42', IC.link],
    messenger: ['linear-gradient(200deg,#ff6c5c 0%,#a334fa 45%,#0695ff 100%)', IF('<path d="M12 2.8c-5.2 0-9.2 3.8-9.2 8.9 0 2.7 1.1 5 2.9 6.6v3c0 .5.5.8.9.6l2.9-1.3c.8.2 1.6.3 2.5.3 5.2 0 9.2-3.8 9.2-8.9S17.2 2.8 12 2.8zm1 11.9-2.4-2.5-4.6 2.5 5.1-5.4 2.4 2.5 4.5-2.5z"/>')],
    instagram: ['linear-gradient(45deg,#feda75 0%,#fa7e1e 25%,#d62976 55%,#962fbf 80%,#4f5bd5 100%)', I('<rect x="4" y="4" width="16" height="16" rx="4.6"/><circle cx="12" cy="12" r="3.8"/><circle cx="17.2" cy="6.9" r=".9" fill="currentColor" stroke="none"/>', 2)],
    whatsapp: ['#25d366', IF('<path d="M12 2.6a9.3 9.3 0 0 0-8 14.1L2.7 21.3l4.8-1.3A9.3 9.3 0 1 0 12 2.6zm4.6 12.9c-.2.6-1.1 1.1-1.6 1.2-.4.1-1 .1-1.6-.1-.4-.1-.8-.3-1.4-.5-2.5-1.1-4.1-3.6-4.2-3.7-.1-.2-1-1.3-1-2.5s.6-1.8.9-2c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.4l.8 2c.1.2.1.3 0 .5l-.3.5-.4.4c-.1.1-.3.3-.1.5.1.3.6 1 1.3 1.7.9.8 1.7 1.1 2 1.2.2.1.4.1.5-.1l.7-.9c.2-.2.3-.2.5-.1l1.9.9c.2.1.4.2.4.3.1.1.1.6-.1 1.2z"/>')],
    telegram: ['#2aabee', IF('<path d="M20.7 4.2 2.9 11c-1.2.5-1.2 1.2-.2 1.5l4.6 1.4 1.7 5.4c.2.6.4.8.8.8s.6-.2.9-.4l2.2-2.1 4.6 3.4c.8.5 1.4.2 1.6-.8l3-14c.3-1.2-.4-1.7-1.4-1.3zM9.4 14.2l8.5-5.4c.4-.2.7-.1.4.2l-7 6.4-.3 3z"/>')],
    sms: ['#34c759', IF('<path d="M12 3.4c-5.1 0-9.2 3.4-9.2 7.7 0 2.4 1.3 4.6 3.4 6l-.8 3.1c-.1.4.3.7.7.5l3.6-2c.7.2 1.5.2 2.3.2 5.1 0 9.2-3.4 9.2-7.8S17.1 3.4 12 3.4z"/>')],
    story: ['conic-gradient(from 210deg,#f58529,#dd2a7b,#8134af,#515bd4,#f58529)', I('<circle cx="12" cy="12" r="7.6" stroke-dasharray="3 2.2"/><path d="M12 8.6v6.8M8.6 12h6.8"/>', 2.2)],
    more: ['#3a3b42', IC.dots]
  };

  /* ===================================================================== the bottom bar
     The app's dock slides down and away, this one rises in its place; leaving the community reverses it. */
  let nav = null, navT = 0;
  const NAVS = [['home', 'cn.home'], ['friends', 'cn.friends'], ['new', 'cn.new'], ['inbox', 'cn.inbox'], ['me', 'cn.me']];
  function tabOf(param) {
    const p = String(param == null ? '' : param);
    if (p === 'friends' || p === 'ff') return 'friends';
    if (p === 'chats' || p === 'activity') return 'inbox';
    if (p === 'me' || (C.uid && p === 'u:' + C.uid)) return 'me';
    if (p === '' || p.indexOf('p:') === 0) return 'home';
    return '';
  }
  const inCommunity = () => PD.app.route === 'community' && C.configured && C.session && C.profile && C.profile.nickname && PD.store.get('md.rules.' + C.uid, false);
  function mountNav() {
    if (nav) return nav;
    nav = h('nav', { class: 'cnav', 'aria-label': t('cm.title'), hidden: true });
    NAVS.forEach(([k, key]) => {
      const b = k === 'new'
        ? h('button', { class: 'cnav-plus', type: 'button', 'data-k': k, 'aria-label': t(key), title: t(key), html: '<i class="l"></i><i class="r"></i><span>' + IC.plus + '</span>', onclick: () => { buzz('select'); newVideo(); } })
        : h('button', { class: 'cnav-b', type: 'button', 'data-k': k, onclick: () => goTab(k) }, [h('span', { class: 'cnav-ic', html: '<span class="o">' + IC[k][0] + '</span><span class="f">' + IC[k][1] + '</span>' }), h('span', { class: 'cnav-l', 'data-t': key })]);
      nav.appendChild(b);
    });
    document.body.appendChild(nav); PD.i18n.apply(nav);
    return nav;
  }
  function goTab(k) {
    buzz('select');
    const to = { home: '', friends: 'friends', inbox: 'chats', me: 'me' }[k];
    if (tabOf(PD.app.param) === k && k === 'home') { PD.bus.emit('cm:top'); return; }   // the feed again: back to its first video
    PD.app.go('community', to || null, true);
  }
  function newVideo() { PD.bus.emit('cm:cam', true); S().studio(p => { PD.bus.emit('cm:posted', p); if (tabOf(PD.app.param) !== 'home') PD.app.go('community', 'p:' + p.id); }, () => PD.bus.emit('cm:cam', false)); }
  function syncNav() {
    const on = !!inCommunity() && String(PD.app.param || '').indexOf('c:') !== 0;   // a chat keeps the whole bottom for its writing bar
    const root = document.documentElement, was = root.classList.contains('cm-mode');
    if (on) mountNav();
    if (nav) {
      const k = on ? tabOf(PD.app.param) : '';
      nav.querySelectorAll('[data-k]').forEach(b => { const a = b.dataset.k === k; b.classList.toggle('on', a); if (b.classList.contains('cnav-b')) b.setAttribute('aria-current', a ? 'page' : 'false'); });
      clearTimeout(navT);
      if (on) { nav.hidden = false; requestAnimationFrame(() => requestAnimationFrame(() => nav.classList.add('in'))); badge(); }
      else if (!nav.hidden) { nav.classList.remove('in'); navT = setTimeout(() => { nav.hidden = true; }, 420); }
    }
    root.classList.toggle('cm-mode', on);
    if (on !== was) root.classList.toggle('cm-entering', on);
  }
  async function badge() {
    if (!nav) return;
    let msgs = PD.store.get('cm.unread', 0), req = 0;
    try { msgs = ((await C.chat.list()) || []).reduce((a, r) => a + (r.unread || 0), 0); PD.store.set('cm.unread', msgs); } catch (_) {}
    try { req = ((await C.social.friends()) || []).filter(f => f.relation === 'incoming').length; } catch (_) {}
    const act = PD.notify && PD.notify.unread ? PD.notify.unread(PD.notify.isCommunity) : 0;   // only the community's own: not Sima's reminders
    [['inbox', msgs + act], ['friends', req]].forEach(([k, n]) => {
      const b = nav.querySelector('[data-k="' + k + '"]'); if (!b) return;
      let d = b.querySelector('.cnav-dot');
      if (!n) { if (d) d.remove(); return; }
      if (!d) { d = h('i', { class: 'cnav-dot' }); b.appendChild(d); if (moves()) d.animate([{ transform: 'scale(0)' }, { transform: 'scale(1.25)' }, { transform: 'scale(1)' }], { duration: 320, easing: OUTQ }); }
      d.textContent = n > 99 ? '99+' : String(n);
    });
  }
  PD.bus.on('route', () => setTimeout(syncNav, 0));
  PD.bus.on('cloud', () => setTimeout(syncNav, 0));
  setInterval(() => { if (nav && !nav.hidden && !document.hidden) badge(); }, 30000);

  /* ===================================================================== the profile */
  const TABS = [['user', 'cp.tVideos', IC.grid, false], ['reposts', 'cp.tReposts', IC.repost, false], ['saved', 'cp.tSaved', IC.save, true], ['liked', 'cp.tLiked', IC.heart, true], ['history', 'cp.tHistory', IC.clock, true]];
  const profLink = card => location.origin + location.pathname + '?go=' + encodeURIComponent('community:' + (card.nickname ? '@' + card.nickname : 'u:' + card.id));
  /** who: 'me' · 'u:<id>' · '@nick' */
  async function profile(w, who, own) {
    const page = document.getElementById('page'); if (page) page.classList.add('cp-page');
    own(() => { if (page) page.classList.remove('cp-page'); });
    const wrap = h('div', { class: 'cp' }); w.append(wrap);
    wrap.append(skeleton());
    let card;
    try {
      card = who === 'me' ? await C.social.card() : who[0] === '@' ? await C.social.card(null, who.slice(1)) : await C.social.card(who.slice(2));
    } catch (e) {
      wrap.innerHTML = '';
      if (old(e) && who === 'me') return legacyMe(wrap, own);
      if (old(e) && who.indexOf('u:') === 0) return legacyOther(wrap, who.slice(2), own);
      wrap.append(topBar(null, false), h('div', { class: 'cp-empty' }, [h('p', { text: err(e) })])); return;
    }
    wrap.innerHTML = '';
    if (!card || card.blocked) { wrap.append(topBar(null, false), h('div', { class: 'cp-empty' }, [h('span', { class: 'cp-eic', html: IC.shield }), h('p', { 'data-t': card ? 'cp.blocked' : 'cp.notFound' })])); PD.i18n.apply(wrap); return; }
    const self = card.relation === 'self';
    render(wrap, card, self, own);
  }
  function skeleton() {
    return h('div', { class: 'cp-skel', 'aria-hidden': 'true' }, [h('i', { class: 'sk-dot cp-skav' }), h('i', { class: 'sk-line w40' }), h('i', { class: 'sk-line w60' }),
      h('div', { class: 'cp-grid' }, Array.from({ length: 6 }, () => h('i', { class: 'cp-tile sk' })))]);
  }
  /** a server not yet updated: my own videos and saved ones still show (feed() knows them), the rest says why it is missing */
  function legacyMe(wrap, own) {
    const me = { id: C.uid, nickname: C.profile.nickname, display_name: C.profile.display_name, avatar_url: C.profile.avatar_url, bio: '', level: C.profile.level, followers: null, following: null, likes: null, relation: 'self' };
    render(wrap, me, true, own, true);
  }
  /** someone else, on a server not yet updated: their name, photo and videos from feed(), friendship as before */
  async function legacyOther(wrap, id, own) {
    try {
      const rows = (await C.social.feed('user', { target: id, lim: 30 })) || [], any = rows[0];
      const fr = ((await C.social.friends()) || []).find(f => f.id === id);
      const card = { id, nickname: (fr && fr.nickname) || (any && any.author_nick) || '', display_name: (fr && fr.display_name) || (any && any.author_name) || '', avatar_url: (fr && fr.avatar_url) || (any && any.author_avatar) || null,
        bio: '', level: any && any.author_level, followers: null, following: null, likes: rows.reduce((a, r) => a + (r.reactions || 0), 0), relation: fr ? fr.relation : 'none' };
      render(wrap, card, false, own, true);
    } catch (e) { wrap.append(topBar(null, false), h('div', { class: 'cp-empty' }, [h('p', { text: err(e) })])); }
  }
  function topBar(card, self) {
    const back = !self || (PD.app.route === 'community' && PD.app.param !== 'me');
    return h('div', { class: 'cp-top' }, [
      back ? h('button', { class: 'cp-ib', 'aria-label': t('back'), html: IC.exit, onclick: () => PD.app.back('community') }) : h('button', { class: 'cp-ib', 'aria-label': t('cp.addFriend'), title: t('cp.addFriend'), html: IC.addUser, onclick: () => PD.app.go('community', 'friends') }),
      h('b', { class: 'cp-toptitle', text: card ? (card.nickname ? '@' + card.nickname : nameOf(card)) : '' }),
      h('div', { class: 'cp-topr' }, card ? (self
        ? [h('button', { class: 'cp-ib', 'aria-label': t('cn.search'), html: IC.search, onclick: () => PD.app.go('community', 's') }), h('button', { class: 'cp-ib', 'aria-label': t('md.more'), html: IC.menu, onclick: () => meMenu(card) })]
        : [h('button', { class: 'cp-ib', 'aria-label': t('cp.shareP'), html: IC.share, onclick: () => shareProfile(card) }), h('button', { class: 'cp-ib', 'aria-label': t('md.more'), html: IC.dots, onclick: () => U().userActions(card.id, nameOf(card)) })]) : [])]);
  }
  function render(wrap, card, self, own, legacy) {
    const head = h('header', { class: 'cp-head' + (card.banner_url || self ? ' has-bn' : '') });
    // the banner: anyone's, as they chose it; mine has a button to change it (an empty one invites me to add one)
    const bn = card.banner_url || self ? h('div', { class: 'cp-banner' + (card.banner_url ? '' : ' empty') }, [card.banner_url ? bannerMedia(card.banner_url) : null,
      self && !legacy ? h('button', { class: 'cp-bncam', 'aria-label': t(card.banner_url ? 'cp.bannerChange' : 'cp.bannerAdd'), title: t(card.banner_url ? 'cp.bannerChange' : 'cp.bannerAdd'), html: IC.cam + (card.banner_url ? '' : '<span data-t="cp.bannerAdd"></span>'), onclick: () => pickBanner(url => { card.banner_url = url; refresh(); }) }) : null].filter(Boolean)) : null;
    // the photo, in a ring of the app's brass; mine has a camera to change it
    const av = h('div', { class: 'cp-avw' }, [h('div', { class: 'cp-ring' }, [avatar(card.avatar_url, nameOf(card), 'cp-av')]),
      self ? h('button', { class: 'cp-avcam', 'aria-label': t('cp.photoChange'), html: IC.cam, onclick: () => pickPhoto(url => { card.avatar_url = url; refresh(); }) }) : null].filter(Boolean));
    const chips = h('div', { class: 'cp-chips' }, [card.level ? h('span', { class: 'cp-chip lv', text: '🪕 ' + t('cp.lv', { n: card.level }) }) : null, card.vip ? h('span', { class: 'cp-chip vip', text: 'VIP' }) : null,
      !self && card.follows_me ? h('span', { class: 'cp-chip', 'data-t': 'cp.followsYou' }) : null, card.relation === 'friend' ? h('span', { class: 'cp-chip fr', html: IC.check + '<span data-t="cp.friend"></span>' }) : null].filter(Boolean));
    const stat = (n, key, fn) => h('button', { class: 'cp-stat', disabled: n == null || !fn, onclick: fn }, [h('b', { text: n == null ? '—' : nf(n) }), h('small', { 'data-t': key })]);
    const stats = h('div', { class: 'cp-stats' }, [
      stat(card.following, 'cp.following', () => followSheet(card, 'following')), h('i', { class: 'cp-sep' }),
      stat(card.followers, 'cp.followers', () => followSheet(card, 'followers')), h('i', { class: 'cp-sep' }),
      stat(card.likes, 'cp.likes', null)]);
    const bio = card.bio ? h('p', { class: 'cp-bio' }, richText(card.bio)) : self && !legacy ? h('button', { class: 'cp-addbio', 'data-t': 'cp.addBio', onclick: () => editSheet(card, refresh) }) : null;
    const acts = h('div', { class: 'cp-acts' });
    function paintActs() {
      acts.innerHTML = '';
      if (self) {
        acts.append(h('button', { class: 'cp-btn', html: IC.edit + '<span data-t="cp.editS"></span>', onclick: () => editSheet(card, refresh), disabled: legacy }),
          h('button', { class: 'cp-btn', html: IC.share + '<span data-t="cp.sharePS"></span>', onclick: () => shareProfile(card) }));
      } else {
        const fb = legacy ? null : h('button', { class: 'cp-btn ' + (card.i_follow ? '' : 'primary'), html: card.i_follow ? IC.check + '<span data-t="cp.followingBtn"></span>' : '<span data-t="' + (card.follows_me ? 'cp.followBack' : 'cp.follow') + '"></span>' });
        if (fb) { fb.onclick = () => toggleFollow(card, fb, () => { paintActs(); setNum(stats.children[2].firstChild, nf(card.followers)); }); acts.append(fb); }
        if (card.relation === 'friend') acts.append(h('button', { class: 'cp-btn', html: IC.inbox[0] + '<span data-t="cp.message"></span>', onclick: async () => { try { const c = await C.chat.open(card.id); PD.app.go('community', 'c:' + c + ':' + nameOf(card)); } catch (e) { PD.ui.toast(err(e)); } } }));
        else if (card.relation === 'incoming') acts.append(h('button', { class: 'cp-btn', html: IC.addUser + '<span data-t="cp.accept"></span>', onclick: async () => { try { await C.social.respond(card.id, true); card.relation = 'friend'; buzz('success'); paintActs(); } catch (e) { PD.ui.toast(err(e)); } } }));
        else if (card.relation === 'outgoing') acts.append(h('button', { class: 'cp-btn quiet', disabled: true, 'data-t': 'cp.requested' }));
        else if (card.nickname) acts.append(h('button', { class: 'cp-btn sq', 'aria-label': t('cp.addFriend'), title: t('cp.addFriend'), html: IC.addUser, onclick: async e => { const b = e.currentTarget; b.disabled = true; try { const r = await C.social.request(card.nickname); card.relation = r === 'friend' ? 'friend' : 'outgoing'; PD.ui.toast(t(r === 'friend' ? 'fr.already' : 'fr.sent'), 3500); paintActs(); } catch (er) { b.disabled = false; PD.ui.toast(err(er)); } } }));
      }
      PD.i18n.apply(acts);
    }
    paintActs();
    head.append(...[bn, av, h('h1', { class: 'cp-name', text: nameOf(card) }), card.nickname ? h('small', { class: 'cp-nick', text: '@' + card.nickname }) : null, chips, stats, bio, acts].filter(Boolean));
    // the tabs: videos and reposts for everyone; saved, liked and history are mine alone
    const tabs = TABS.filter(x => self || !x[3]);
    let cur = self ? PD.store.get('cp.tab', 'user') : 'user'; if (!tabs.some(x => x[0] === cur)) cur = 'user';   // someone else's page always opens on their videos
    const bar = h('div', { class: 'cp-tabs', role: 'tablist' }), ind = h('i', { class: 'cp-tabind', 'aria-hidden': 'true' });
    const body = h('div', { class: 'cp-body' });
    tabs.forEach(([k, key, icon, priv]) => bar.append(h('button', { role: 'tab', 'data-k': k, 'aria-label': t(key), title: t(key), 'aria-selected': String(k === cur), class: k === cur ? 'on' : '', onclick: () => pick(k) }, [h('span', { html: icon }), priv ? h('i', { class: 'cp-lock', html: IC.lock }) : null].filter(Boolean))));
    bar.append(ind);
    const placeInd = jump => { const b = bar.querySelector('button.on'); if (!b) return; if (jump) ind.style.transition = 'none'; ind.style.width = b.offsetWidth * .5 + 'px'; ind.style.transform = 'translateX(' + (b.offsetLeft + b.offsetWidth * .25) + 'px)'; if (jump) requestAnimationFrame(() => { ind.style.transition = ''; }); };
    function pick(k) {
      if (k === cur) return;
      const order = tabs.map(x => x[0]), d = order.indexOf(k) > order.indexOf(cur) ? 1 : -1;
      cur = k; if (self) PD.store.set('cp.tab', k); buzz('select');
      bar.querySelectorAll('button[data-k]').forEach(b => { const on = b.dataset.k === k; b.classList.toggle('on', on); b.setAttribute('aria-selected', String(on)); });
      placeInd(); show(d);
    }
    function show(d) {
      body.innerHTML = '';
      const tb = tabs.find(x => x[0] === cur);
      if (tb[3]) body.append(h('p', { class: 'cp-priv', html: IC.lock + '<span data-t="cp.private"></span>' }));
      if (legacy && cur !== 'user' && !(cur === 'saved' && self)) { body.append(h('div', { class: 'cp-empty' }, [h('p', { 'data-t': 'cp.needServer' })])); PD.i18n.apply(body); return; }
      grid(body, cur, card, self, own, legacy);
      PD.i18n.apply(body);
      if (d && moves()) body.animate([{ transform: 'translateX(' + (d * 28) + 'px)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 280, easing: OUTQ });
    }
    function refresh() { PD.app.render(true); }
    // my profile is the app's one profile: what I learn sits under the header (app.js profileExtras)
    const learn = self && PD.app.profileExtras ? h('div', { class: 'cp-learn' }, PD.app.profileExtras(true)) : null;
    wrap.append(...[topBar(card, self), head, learn, bar, body].filter(Boolean));
    PD.i18n.apply(wrap);
    requestAnimationFrame(() => placeInd(true));
    show(0);
    // the header arrives in order: the photo grows in, the numbers count up
    if (moves()) {
      av.animate([{ transform: 'scale(.82)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 520, easing: 'cubic-bezier(.34,1.56,.64,1)' });
      [...head.children].filter(x => x !== av && x !== bn).forEach((x, i) => x.animate([{ transform: 'translateY(10px)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 420, delay: 80 + i * 45, easing: OUTQ, fill: 'backwards' }));
      stats.querySelectorAll('.cp-stat b').forEach((b, i) => { if ([card.following, card.followers, card.likes][i] > 0 && PD.ui.countUp) PD.ui.countUp(b, 700); });
    }
  }
  const setNum = (el, txt) => { if (!el || el.textContent === txt) return; el.textContent = txt; if (moves()) el.animate([{ transform: 'translateY(40%)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 260, easing: OUTQ }); };
  function richText(s) {
    const out = [], links = /#([\p{L}\p{N}_]{1,50})|(?<![\p{L}\p{N}_.@])@([a-zA-Z0-9][a-zA-Z0-9_.]{1,22}[a-zA-Z0-9])(?![a-zA-Z0-9_]|\.[a-zA-Z0-9])/gu;
    let at = 0;
    for (const match of s.matchAll(links)) {
      if (match.index > at) out.push(document.createTextNode(s.slice(at, match.index)));
      const target = match[1] ? 't:' + match[1].toLowerCase() : '@' + match[2].toLowerCase();
      out.push(h('button', { class: 'cp-tag', type: 'button', text: match[0], onclick: event => {
        event.stopPropagation(); PD.app.go('community', target);
      } }));
      at = match.index + match[0].length;
    }
    if (at < s.length) out.push(document.createTextNode(s.slice(at)));
    return out;
  }
  async function toggleFollow(card, btn, done) {
    const go = async keep => {
      btn.disabled = true; const was = card.i_follow;
      card.i_follow = keep; card.followers = Math.max(0, (card.followers || 0) + (keep ? 1 : -1)); done(); if (keep) { buzz('success'); }
      try { await C.social.follow(card.id, keep); } catch (e) { card.i_follow = was; card.followers = Math.max(0, card.followers + (keep ? -1 : 1)); done(); PD.ui.toast(err(e)); }
    };
    if (card.i_follow) PD.ui.confirm(t('cp.unfollowQ', { n: nameOf(card) }), () => go(false)); else go(true);
  }

  /** a profile's list as a grid of 9:16 tiles; a tile opens the same list as a feed, starting at that video */
  function grid(box, tab, card, self, own, legacy) {
    const g = h('div', { class: 'cp-grid' }), more = h('i', { class: 'cp-more', 'aria-hidden': 'true' });
    const tools = h('div', { class: 'cp-tools' });
    let off = 0, done = false, busy = false, manage = false, n = 0;
    box.append(tools, g, more);
    const EMPTY = { user: self ? 'cp.eVideosMe' : 'cp.eVideos', reposts: self ? 'cp.eRepostsMe' : 'cp.eReposts', saved: 'cp.eSaved', liked: 'cp.eLiked', history: 'cp.eHistory' };
    const EIC = { user: IC.grid, reposts: IC.repost, saved: IC.save, liked: IC.heart, history: IC.clock };
    function paintTools() {
      tools.innerHTML = '';
      if (self && tab === 'reposts' && n) tools.append(h('button', { class: 'cp-tool' + (manage ? ' on' : ''), 'data-t': manage ? 'cp.done' : 'cp.manage', onclick: () => { manage = !manage; g.classList.toggle('managing', manage); paintTools(); } }),
        ...(manage ? [h('button', { class: 'cp-tool danger', 'data-t': 'cp.removeAll', onclick: () => PD.ui.confirm(t('cp.removeAllQ', { n }), async () => { try { await C.social.repostsClear(); PD.ui.toast(t('cp.removedAll')); [...g.children].forEach((x, i) => gone(x, i * 25)); n = 0; setTimeout(empty, 380); manage = false; paintTools(); } catch (e) { PD.ui.toast(err(e)); } }) })] : []));
      if (self && tab === 'history' && n) tools.append(h('button', { class: 'cp-tool', html: IC.x + '<span data-t="cp.clearH"></span>', onclick: () => PD.ui.confirm(t('cp.clearHQ'), async () => { try { await C.social.historyClear(); PD.ui.toast(t('cp.cleared')); [...g.children].forEach((x, i) => gone(x, i * 20)); n = 0; setTimeout(empty, 380); paintTools(); } catch (e) { PD.ui.toast(err(e)); } }) }));
      tools.hidden = !tools.children.length; PD.i18n.apply(tools);
    }
    const gone = (el, delay) => { if (!moves()) return el.remove(); el.animate([{ transform: 'none', opacity: 1 }, { transform: 'scale(.6)', opacity: 0 }], { duration: 260, delay: delay || 0, easing: 'ease-in', fill: 'forwards' }).onfinish = () => el.remove(); };
    function empty() { if (g.querySelector('.cp-tile:not(.sk)')) return; g.innerHTML = ''; box.querySelectorAll('.cp-empty').forEach(x => x.remove()); g.after(h('div', { class: 'cp-empty' }, [h('span', { class: 'cp-eic', html: EIC[tab] }), h('p', { 'data-t': EMPTY[tab] }),
      self && tab === 'user' ? h('button', { class: 'btn primary', html: IC.plus + '<span data-t="cn.new"></span>', onclick: newVideo }) : null].filter(Boolean))); PD.i18n.apply(box); }
    async function load() {
      if (busy || done) return; busy = true;
      const sk = off ? [] : Array.from({ length: 6 }, () => h('i', { class: 'cp-tile sk' })); g.append(...sk);
      try {
        let rows;
        if (legacy) rows = (await C.social.feed(tab === 'saved' ? 'saved' : 'user', { target: card.id, lim: 30, skip: [] })) || [];
        else rows = (await C.social.list(tab, { target: card.id, off, lim: 18 })) || [];
        rows = rows.filter(PD.musicCommunity.mediums);
        sk.forEach(x => x.remove());
        await S().urls(rows);
        rows.forEach((p, i) => g.append(tile(p, off + i)));
        off += rows.length; n += rows.length;
        if (legacy || rows.length < 18) done = true;
        if (!n) empty();
        paintTools();
      } catch (e) { sk.forEach(x => x.remove()); if (!n) { g.after(h('div', { class: 'cp-empty' }, [h('p', { text: err(e) })])); } done = true; }
      finally { busy = false; }
    }
    function tile(p, i) {
      const th = p.thumb_path && C.storage.url(p.thumb_path);
      const el = h('button', { class: 'cp-tile' + (p.media_meta && p.media_meta.mirror ? ' flipx' : ''), type: 'button', 'aria-label': (p.caption || t('fd.video')).slice(0, 60) }, [
        th ? h('img', { alt: '', src: th, loading: 'lazy', decoding: 'async' }) : h('span', { class: 'cp-tnone', html: IC.play }),
        tab !== 'user' && p.author_nick ? h('small', { class: 'cp-tby', text: '@' + p.author_nick }) : null,
        h('small', { class: 'cp-tn', html: (tab === 'liked' ? IC.heart : IC.play) + '<span>' + nf(tab === 'liked' ? p.reactions : p.views) + '</span>' }),
        self && tab === 'reposts' ? h('span', { class: 'cp-tx', role: 'button', 'aria-label': t('cp.removeOne'), html: IC.x, onclick: async e => { e.stopPropagation(); try { await C.social.repost(p.id, false); n--; PD.ui.toast(t('cp.removed')); gone(el); setTimeout(() => { empty(); paintTools(); }, 300); } catch (er) { PD.ui.toast(err(er)); } } }) : null].filter(Boolean));
      el.onclick = () => { if (g.classList.contains('managing')) return; PD.motion && PD.motion.share && PD.motion.share(el); PD.app.go('community', 'l:' + tab + ':' + (card.id || '-') + ':' + i); };
      if (moves()) el.animate([{ opacity: 0, transform: 'scale(.94)' }, { opacity: 1, transform: 'none' }], { duration: 300, delay: Math.min(i % 18, 12) * 28, easing: OUTQ, fill: 'backwards' });
      return el;
    }
    const io = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) load(); }, { root: document.getElementById('page'), rootMargin: '600px' });
    io.observe(more); own(() => io.disconnect());
    load();
  }

  /* ---------- editing my profile: photo, name, nickname, bio ---------- */
  function editSheet(card, after) {
    PD.ui.sheet((b, close) => {
      const av = h('div', { class: 'cp-eav' }, [h('div', { class: 'cp-ring' }, [avatar(card.avatar_url, nameOf(card), 'cp-av')])]);
      const photoRow = h('div', { class: 'cp-erow' }, [av, h('div', { class: 'cp-ebtns' }, [
        h('button', { class: 'btn small', html: IC.cam + '<span data-t="cp.photoChange"></span>', onclick: () => pickPhoto(url => { card.avatar_url = url; av.replaceChildren(h('div', { class: 'cp-ring' }, [avatar(url, nameOf(card), 'cp-av')])); }) }),
        card.avatar_url ? h('button', { class: 'btn small quiet', 'data-t': 'cp.photoRemove', onclick: async e => { const btn = e.currentTarget; try { const was = card.avatar_url; await C.social.setAvatar(null); C.storage.dropAvatar(was); card.avatar_url = null; PD.account.setProfile({ avatar: '' }); av.replaceChildren(h('div', { class: 'cp-ring' }, [avatar(null, nameOf(card), 'cp-av')])); btn.remove(); await C.loadProfile().catch(() => {}); } catch (er) { PD.ui.toast(err(er)); } } }) : null].filter(Boolean))]);
      const bnBox = h('div', { class: 'cp-ebn' + (card.banner_url ? '' : ' empty') }, card.banner_url ? [bannerMedia(card.banner_url)] : []);
      const paintBn = () => { bnBox.className = 'cp-ebn' + (card.banner_url ? '' : ' empty'); bnBox.replaceChildren(...(card.banner_url ? [bannerMedia(card.banner_url)] : [])); bnBtns.replaceChildren(...bnButtons()); PD.i18n.apply(bnBtns); };
      const bnButtons = () => [h('button', { class: 'btn small', html: IC.cam + '<span data-t="' + (card.banner_url ? 'cp.bannerChange' : 'cp.bannerAdd') + '"></span>', onclick: () => pickBanner(url => { card.banner_url = url; paintBn(); }) }),
        card.banner_url ? h('button', { class: 'btn small quiet', 'data-t': 'cp.bannerRemove', onclick: async () => { try { const was = card.banner_url; await C.social.setBanner(null); C.storage.dropAvatar(was); card.banner_url = null; paintBn(); await C.loadProfile().catch(() => {}); } catch (er) { PD.ui.toast(err(er)); } } }) : null].filter(Boolean);
      const bnBtns = h('div', { class: 'cp-ebtns row' }, bnButtons());
      const bannerRow = h('div', { class: 'cp-ebnrow' }, [bnBox, bnBtns, h('small', { class: 'muted', 'data-t': 'cp.bannerD' })]);
      const name = h('input', { class: 'input', maxlength: '40', autocomplete: 'name', value: card.display_name || '', 'aria-label': t('cp.name') });
      const nick = h('input', { class: 'input', maxlength: '25', autocapitalize: 'none', spellcheck: 'false', value: card.nickname || '', 'aria-label': t('cp.nick') });
      const bio = h('textarea', { class: 'input cp-ebio', maxlength: '160', rows: '3', placeholder: t('cp.bioPh'), 'aria-label': t('cp.bio') }); bio.value = card.bio || '';
      const cnt = h('small', { class: 'cp-cnt' }), msg = h('small', { class: 'cp-emsg', 'aria-live': 'polite' });
      const count = () => { cnt.textContent = bio.value.length + ' / 160'; }; bio.addEventListener('input', count); count();
      const save = h('button', { class: 'btn primary', 'data-t': 'cp.save' });
      save.onclick = async () => {
        save.disabled = true; msg.textContent = ''; msg.className = 'cp-emsg';
        try {
          const nm = name.value.trim(), nk = nick.value.trim().replace(/^@+/, '').toLowerCase(), bi = bio.value.trim();
          if (nm && nm !== (card.display_name || '')) { await C.db.update('profiles', { id: 'eq.' + C.uid }, { display_name: nm }); PD.account.setProfile({ name: nm }); }
          if (nk && nk !== card.nickname) await C.social.setNick(nk);
          if (bi !== (card.bio || '')) await C.social.setBio(bi);
          await C.loadProfile().catch(() => {});
          PD.ui.toast(t('cp.saved')); buzz('success'); close(); after && after();
        } catch (e) {
          save.disabled = false; msg.classList.add('err');
          const m = (e && e.message) || ''; msg.textContent = /objectionable/.test(m) ? t('cp.bioBad') : /nickname-taken/.test(m) ? t('fr.nickTaken') : /nickname-invalid|nickname_format/.test(m) ? t('fr.nickBad') : err(e);
        }
      };
      const field = (key, el, extra) => h('label', { class: 'cp-field' }, [h('small', { 'data-t': key }), el, extra].filter(Boolean));
      b.append(h('h2', { 'data-t': 'cp.edit' }), bannerRow, photoRow, h('small', { class: 'muted cp-ephd', 'data-t': 'cp.photoD' }), field('cp.name', name), field('cp.nick', h('div', { class: 'cp-at' }, [h('span', { text: '@' }), nick])), field('cp.bio', bio, cnt), msg, save);
    });
  }
  const MB = 1048576, upErr = e => /mime|type|415|422|invalid_mime|bucket|not.?found|404/i.test((e && e.message) || '') ? t('cp.needServer') : /too-large|413/.test((e && (e.code || e.message)) || '') ? t('cp.tooBig', { n: 10 }) : err(e);
  /** choose a photo, cut its middle square, make it 512 px, upload it, and make it the profile photo.
      A GIF goes up as it is (cutting it would stop it moving); the round frame shows its middle. */
  function pickPhoto(done) {
    const inp = h('input', { type: 'file', accept: 'image/*', hidden: true });
    inp.onchange = async () => {
      const f = inp.files && inp.files[0]; inp.remove(); if (!f) return;
      if (!/^image\//.test(f.type)) { PD.ui.toast(t('cp.badFile'), 4000); return; }
      const gif = f.type === 'image/gif';
      if (gif && f.size > 4 * MB) { PD.ui.toast(t('cp.tooBig', { n: 4 }), 4000); return; }
      PD.ui.toast(t('cp.photoUp'), 8000);
      try {
        const blob = gif ? f : await squarePhoto(f);
        const was = C.profile && C.profile.avatar_url;
        const url = await C.storage.avatar(blob);
        await C.social.setAvatar(url);
        if (was && was !== url) C.storage.dropAvatar(was);
        PD.account.setProfile({ avatar: url });
        await C.loadProfile().catch(() => {});
        buzz('success'); PD.ui.toast(t('cp.saved'), 1800); done && done(url);
      } catch (e) { PD.ui.toast(upErr(e), 5000); }
    };
    document.body.appendChild(inp); inp.click();
  }
  async function squarePhoto(f) {
    const bmp = window.createImageBitmap ? await createImageBitmap(f) : await new Promise((res, rej) => { const im = new Image(); im.onload = () => res(im); im.onerror = rej; im.src = URL.createObjectURL(f); });
    const s = Math.min(bmp.width, bmp.height), N = Math.min(512, s), cv = document.createElement('canvas'); cv.width = cv.height = N;
    cv.getContext('2d').drawImage(bmp, (bmp.width - s) / 2, (bmp.height - s) / 2, s, s, 0, 0, N, N);
    return new Promise(r => cv.toBlob(r, 'image/jpeg', .88));
  }
  /** the banner: a photo is cut to 3 : 1 and made at most 1500 px wide; a GIF or a short silent video goes up as it is */
  function pickBanner(done) {
    const inp = h('input', { type: 'file', accept: 'image/*,video/mp4,video/webm', hidden: true });
    inp.onchange = async () => {
      const f = inp.files && inp.files[0]; inp.remove(); if (!f) return;
      const vid = /^video\/(mp4|webm)$/.test(f.type), moving = vid || f.type === 'image/gif';
      if (!vid && !/^image\//.test(f.type)) { PD.ui.toast(t('cp.badFile'), 4000); return; }
      if (moving && f.size > 10 * MB) { PD.ui.toast(t('cp.tooBig', { n: 10 }), 4000); return; }
      try {
        if (vid) {   // its length, read on the device
          const dur = await new Promise((res, rej) => { const v = document.createElement('video'), u = URL.createObjectURL(f); v.preload = 'metadata'; v.onloadedmetadata = () => { URL.revokeObjectURL(u); res(v.duration); }; v.onerror = () => { URL.revokeObjectURL(u); rej(new Error('bad-file')); }; v.src = u; });
          if (!(dur > 0) || dur > 15.5) { PD.ui.toast(t(dur > 15.5 ? 'cp.tooLong' : 'cp.badFile'), 4000); return; }
        }
        PD.ui.toast(t('cp.bannerUp'), 8000);
        let blob = f;
        if (!moving) {
          const bmp = window.createImageBitmap ? await createImageBitmap(f) : await new Promise((res, rej) => { const im = new Image(); im.onload = () => res(im); im.onerror = rej; im.src = URL.createObjectURL(f); });
          const sw = Math.min(bmp.width, bmp.height * 3), sh = sw / 3, W = Math.min(1500, Math.round(sw)), cv = document.createElement('canvas');
          cv.width = W; cv.height = Math.round(W / 3);
          cv.getContext('2d').drawImage(bmp, (bmp.width - sw) / 2, (bmp.height - sh) / 2, sw, sh, 0, 0, cv.width, cv.height);
          blob = await new Promise(r => cv.toBlob(r, 'image/jpeg', .86));
        }
        const was = C.profile && C.profile.banner_url;
        const url = await C.storage.avatar(blob, 'banner-');
        await C.social.setBanner(url);
        if (was && was !== url) C.storage.dropAvatar(was);
        await C.loadProfile().catch(() => {});
        buzz('success'); PD.ui.toast(t('cp.saved'), 1800); done && done(url);
      } catch (e) { PD.ui.toast(/bad-file/.test((e && e.message) || '') ? t('cp.badFile') : upErr(e), 5000); }
    };
    document.body.appendChild(inp); inp.click();
  }
  /** my profile's menu: what TikTok hides behind ☰ */
  function meMenu(card) {
    PD.ui.sheet((b, close) => {
      const row = (icon, key, fn) => h('button', { class: 'cp-mrow', onclick: () => { close(); fn(); } }, [h('span', { html: icon }), h('span', { class: 'grow', 'data-t': key }), h('span', { class: 'cp-chev', html: ic.chevron })]);
      b.append(h('h2', { text: '@' + (card.nickname || '') }), h('div', { class: 'cp-menu' }, [
        row(IC.edit, 'cp.edit', () => editSheet(card, () => PD.app.render(true))),
        row(IC.share, 'cp.shareP', () => shareProfile(card)),
        row(IC.friends[0], 'cn.friends', () => PD.app.go('community', 'friends')),
        row(IC.shield, 'md.blockedList', () => U().blockedSheet()),
        row(IC.gear, 'nav.settings', () => PD.app.go('settings'))]));
    });
  }
  /** followers / following, each with a follow button */
  function followSheet(card, which) {
    PD.ui.sheet((b, close) => {
      let cur = which;
      const seg = h('div', { class: 'seg cp-fseg', role: 'tablist' }), list = h('div', { class: 'cp-flist' });
      const paintSeg = () => { seg.innerHTML = ''; [['following', 'cp.following', card.following], ['followers', 'cp.followers', card.followers]].forEach(([k, key, n]) => seg.append(h('button', { role: 'tab', 'aria-pressed': String(k === cur), onclick: () => { if (k === cur) return; cur = k; paintSeg(); load(); } }, [h('b', { text: nf(n) + ' ' }), h('span', { 'data-t': key })]))); PD.i18n.apply(seg); };
      async function load() {
        list.innerHTML = ''; list.append(...(U().skRows ? U().skRows(4) : []));
        try {
          const rows = (await C.social.followList(card.id, cur)) || []; list.innerHTML = '';
          if (!rows.length) { list.append(h('p', { class: 'muted cp-lempty', 'data-t': cur === 'followers' ? 'cp.listEmptyFo' : 'cp.listEmptyFi' })); PD.i18n.apply(list); return; }
          rows.forEach((r, i) => list.append(personRow(r, i, close)));
          PD.i18n.apply(list);
        } catch (e) { list.textContent = err(e); }
      }
      b.append(h('h2', { text: card.nickname ? '@' + card.nickname : nameOf(card) }), seg, list);
      paintSeg(); load();
    });
  }
  /** a person in a list: the photo and name open the profile, the button follows */
  function personRow(r, i, closeSheet) {
    const me = r.id === C.uid;
    const btn = me ? null : h('button', { class: 'cp-fbtn' + (r.i_follow ? '' : ' primary') });
    const paint = () => { if (!btn) return; btn.className = 'cp-fbtn' + (r.i_follow ? '' : ' primary'); btn.textContent = t(r.i_follow ? 'cp.followingBtn' : r.follows_me ? 'cp.followBack' : 'cp.follow'); };
    if (btn) btn.onclick = async e => { e.stopPropagation(); const keep = !r.i_follow; r.i_follow = keep; paint(); if (keep) buzz('success'); try { await C.social.follow(r.id, keep); } catch (er) { r.i_follow = !keep; paint(); PD.ui.toast(err(er)); } };
    paint();
    const el = h('div', { class: 'cp-person' }, [h('button', { class: 'cp-pwho', onclick: () => { if (closeSheet) closeSheet(); PD.app.go('community', 'u:' + r.id); } }, [avatar(r.avatar_url, nameOf(r), 'cp-pav'),
      h('span', { class: 'grow' }, [h('b', { text: nameOf(r) }), h('small', { text: (r.nickname ? '@' + r.nickname : '') + (r.followers != null ? ' · ' + nf(r.followers) + ' ' + t('cp.followers') : '') })])]), btn].filter(Boolean));
    if (moves()) el.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 260, delay: Math.min(i || 0, 10) * 30, easing: OUTQ, fill: 'backwards' });
    return el;
  }

  /* ===================================================================== search, hashtags */
  const RK = 'cp.recent';
  const recent = () => { const r = PD.store.get(RK, []); return Array.isArray(r) ? r : []; };
  const remember = q => { q = q.trim(); if (!q) return; PD.store.set(RK, [q].concat(recent().filter(x => x !== q)).slice(0, 8)); };
  function search(w, q0, own) {
    const page = document.getElementById('page'); if (page) page.classList.add('cp-page'); own(() => { if (page) page.classList.remove('cp-page'); });
    const inp = h('input', { class: 'cp-sin', type: 'search', enterkeyhint: 'search', autocapitalize: 'none', spellcheck: 'false', placeholder: t('cp.searchPh'), 'aria-label': t('cn.search'), value: q0 || '' });
    const clr = h('button', { class: 'cp-sclr', type: 'button', 'aria-label': t('cp.clear'), html: IC.x, hidden: !q0, onclick: () => { inp.value = ''; clr.hidden = true; run(); inp.focus(); } });
    const body = h('div', { class: 'cp-sbody' });
    w.append(h('div', { class: 'cp-top cp-stop' }, [h('button', { class: 'cp-ib', 'aria-label': t('back'), html: IC.exit, onclick: () => PD.app.back('community') }),
      h('label', { class: 'cp-sbox' }, [h('span', { html: IC.search }), inp, clr])]), body);
    let tm = 0, gen = 0;
    inp.addEventListener('input', () => { clr.hidden = !inp.value; clearTimeout(tm); tm = setTimeout(run, 380); });
    inp.addEventListener('keydown', e => { if (e.key === 'Enter') { clearTimeout(tm); remember(inp.value); run(); inp.blur(); } });
    async function run() {
      const q = inp.value.trim(), my = ++gen;
      try { history.replaceState(Object.assign({}, history.state, { p: q ? 's:' + q : 's' }), ''); } catch (_) {}
      body.innerHTML = '';
      if (!q) return idle();
      const people = h('section', { class: 'cp-ssec' }), tags = h('section', { class: 'cp-ssec' }), vids = h('section', { class: 'cp-ssec' });
      body.append(people, tags, vids);
      const isTag = q[0] === '#', term = q.replace(/^[#@]+/, '');
      const [u, g, v] = await Promise.allSettled([isTag ? Promise.resolve([]) : C.social.users(term), C.social.tags(term), C.social.list(isTag ? 'tag' : 'search', { term: isTag ? term : q, lim: 18 })]);
      if (my !== gen) return;
      const bad = [u, g, v].find(x => x.status === 'rejected');
      if (bad && [u, g, v].every(x => x.status === 'rejected' || !(x.value || []).length)) { body.innerHTML = ''; body.append(h('div', { class: 'cp-empty' }, [h('p', { text: err(bad.reason) })])); return; }
      const U2 = (u.value || []), G = (g.value || []), V = (v.value || []).filter(PD.musicCommunity.mediums);
      if (!U2.length && !G.length && !V.length) { body.innerHTML = ''; body.append(h('div', { class: 'cp-empty' }, [h('span', { class: 'cp-eic', html: IC.search }), h('p', { text: t('cp.noResults', { q }) })])); return; }
      if (U2.length) { people.append(h('h3', { 'data-t': 'cp.people' })); U2.slice(0, 6).forEach((r, i) => people.append(personRow(r, i))); } else people.remove();
      if (G.length) { tags.append(h('h3', { 'data-t': 'cp.tags' }), h('div', { class: 'cp-tagrow' }, G.slice(0, 10).map(x => tagChip(x)))); } else tags.remove();
      if (V.length) {
        await S().urls(V); if (my !== gen) return;
        vids.append(h('h3', { 'data-t': 'mc.posts' }), h('div', { class: 'cp-grid' }, V.map((p, i) => { const th = p.thumb_path && C.storage.url(p.thumb_path);
          const el = h('button', { class: 'cp-tile', type: 'button', onclick: () => { remember(q); PD.app.go('community', 'l:' + (isTag ? 'tag' : 'search') + ':-:' + i + ':' + (isTag ? term : q)); } }, [th ? h('img', { alt: '', src: th, loading: 'lazy' }) : h('span', { class: 'cp-tnone', html: IC.play }), p.author_nick ? h('small', { class: 'cp-tby', text: '@' + p.author_nick }) : null, h('small', { class: 'cp-tn', html: IC.play + '<span>' + nf(p.views) + '</span>' })].filter(Boolean));
          if (moves()) el.animate([{ opacity: 0, transform: 'scale(.94)' }, { opacity: 1, transform: 'none' }], { duration: 280, delay: Math.min(i, 12) * 25, easing: OUTQ, fill: 'backwards' });
          return el; })));
      } else vids.remove();
      PD.i18n.apply(body);
    }
    function discover() {
      const M = PD.musicCommunity;
      const picker = (group, label) => h('select', { class: 'input', 'aria-label': t(label) }, [
        h('option', { value: '', text: t('fd.global') }),
        ...Object.keys(M.types[group]).map(id => h('option', { value: id, text: t(M.key(group, id)) }))]);
      const genre = picker('genre', 'mc.genre'), region = picker('region', 'mc.region'), form = picker('form', 'mc.type');
      const field = (label, select) => h('label', { class: 'mc-field' }, [h('span', { text: t(label) }), select]);
      const regionField = field('mc.region', region); regionField.hidden = true;
      const go = h('button', { class: 'btn primary', type: 'submit', 'data-t': 'mc.browse', disabled: true });
      function update() {
        regionField.hidden = genre.value !== 'georgian-folk';
        if (regionField.hidden) region.value = '';
        go.disabled = !(genre.value || form.value);
      }
      const options = h('form', { class: 'mc-discover-filters', onsubmit: e => {
        e.preventDefault();
        if (!go.disabled) PD.app.go('community', 'l:discover:-:0:' + [genre.value, region.value, form.value].join('.'));
      } }, [field('mc.genre', genre), regionField, field('mc.type', form), go]);
      options.addEventListener('change', update);
      const quick = h('div', { class: 'cp-tagrow' }, ['rock','pop','jazz','folk','georgian-folk'].map(id =>
        h('button', { class: 'cp-tagchip', type: 'button', text: t(M.key('genre', id)), onclick: () => {
          genre.value = id; update();
          if (id !== 'georgian-folk') options.requestSubmit();
          else region.focus();
        } })));
      return h('section', { class: 'cp-ssec mc-discover' }, [h('h3', { 'data-t': 'mc.discover' }), quick, options]);
    }
    async function idle() {
      body.append(discover());
      const r = recent();
      if (r.length) {
        const sec = h('section', { class: 'cp-ssec' }, [h('div', { class: 'cp-shead' }, [h('h3', { 'data-t': 'cp.recent' }), h('button', { class: 'cp-link', 'data-t': 'cp.clear', onclick: () => { PD.store.set(RK, []); run(); } })])]);
        r.forEach(q => sec.append(h('div', { class: 'cp-recent' }, [h('button', { class: 'grow', html: IC.clock + '<span>' + PD.esc(q) + '</span>', onclick: () => { inp.value = q; clr.hidden = false; run(); } }),
          h('button', { class: 'cp-ib sm', 'aria-label': t('cp.clear'), html: IC.x, onclick: () => { PD.store.set(RK, recent().filter(x => x !== q)); run(); } })])));
        body.append(sec);
      }
      const tr = h('section', { class: 'cp-ssec' }, [h('h3', { 'data-t': 'cp.trending' })]); body.append(tr);
      try { const G = (await C.social.tags('')) || []; tr.append(G.length ? h('div', { class: 'cp-tagrow' }, G.slice(0, 16).map(x => tagChip(x))) : h('p', { class: 'muted', 'data-t': 'cp.noTrending' })); }
      catch (e) { tr.append(h('p', { class: 'muted', text: err(e) })); }
      PD.i18n.apply(body);
    }
    PD.i18n.apply(w);
    if (q0) run(); else idle();
    if (q0 && !PD.isTouch()) setTimeout(() => inp.focus(), 120);
  }
  const tagChip = x => h('button', { class: 'cp-tagchip', onclick: () => { remember('#' + x.tag); PD.app.go('community', 't:' + x.tag); } }, [h('span', { class: 'cp-hash', html: IC.hash }), h('b', { text: x.tag }), h('small', { text: nf(x.videos) })]);
  async function tagPage(w, tag, own) {
    const page = document.getElementById('page'); if (page) page.classList.add('cp-page'); own(() => { if (page) page.classList.remove('cp-page'); });
    tag = String(tag || '').toLowerCase();
    const stats = h('small', { class: 'cp-tagst', text: ' ' });
    w.append(h('div', { class: 'cp-top' }, [h('button', { class: 'cp-ib', 'aria-label': t('back'), html: IC.exit, onclick: () => PD.app.back('community') }), h('b', { class: 'cp-toptitle', text: '#' + tag }),
      h('div', { class: 'cp-topr' }, [h('button', { class: 'cp-ib', 'aria-label': t('cp.shareTo'), html: IC.share, onclick: () => shareLink(location.origin + location.pathname + '?go=' + encodeURIComponent('community:t:' + tag), '#' + tag) })])]),
      h('header', { class: 'cp-taghead' }, [h('span', { class: 'cp-tagbig', html: IC.hash }), h('div', {}, [h('h1', { text: '#' + tag }), stats])]));
    const body = h('div', { class: 'cp-body' }); w.append(body);
    try { const x = ((await C.social.tags(tag)) || []).find(r => r.tag === tag); stats.textContent = t('cp.tagStats', { v: nf(x ? x.videos : 0), n: nf(x ? x.views : 0) }); } catch (_) { stats.textContent = ''; }
    const g = h('div', { class: 'cp-grid' }); body.append(g);
    try {
      const rows = ((await C.social.list('tag', { term: tag, lim: 30 })) || []).filter(PD.musicCommunity.mediums);
      if (!rows.length) { body.append(h('div', { class: 'cp-empty' }, [h('span', { class: 'cp-eic', html: IC.hash }), h('p', { 'data-t': 'cp.tagEmpty' })])); PD.i18n.apply(body); return; }
      await S().urls(rows);
      rows.forEach((p, i) => { const th = p.thumb_path && C.storage.url(p.thumb_path);
        const el = h('button', { class: 'cp-tile', type: 'button', onclick: () => PD.app.go('community', 'l:tag:-:' + i + ':' + tag) }, [th ? h('img', { alt: '', src: th, loading: 'lazy' }) : h('span', { class: 'cp-tnone', html: IC.play }), p.author_nick ? h('small', { class: 'cp-tby', text: '@' + p.author_nick }) : null, h('small', { class: 'cp-tn', html: IC.play + '<span>' + nf(p.views) + '</span>' })].filter(Boolean));
        if (moves()) el.animate([{ opacity: 0, transform: 'scale(.94)' }, { opacity: 1, transform: 'none' }], { duration: 280, delay: Math.min(i, 12) * 25, easing: OUTQ, fill: 'backwards' });
        g.append(el); });
    } catch (e) { body.append(h('div', { class: 'cp-empty' }, [h('p', { text: err(e) })])); }
  }

  /* ===================================================================== sharing */
  const UA = navigator.userAgent, IOS = /iPhone|iPad|iPod/.test(UA) || (/Macintosh/.test(UA) && navigator.maxTouchPoints > 1), MOBILE = IOS || /Android/.test(UA);
  const linkOf = p => location.origin + location.pathname + '?go=' + encodeURIComponent('community:p:' + p.id);
  /** an address another app opens: http(s) in a new tab, an app's own scheme in place */
  function openExt(url) {
    if (/^https?:/.test(url)) { const w = window.open(url, '_blank', 'noopener'); if (!w) location.href = url; }
    else location.href = url;
  }
  async function copy(text) { try { await navigator.clipboard.writeText(text); return true; } catch (_) { const ta = h('textarea', { style: 'position:fixed;opacity:0' }); ta.value = text; document.body.appendChild(ta); ta.select(); let ok = false; try { ok = document.execCommand('copy'); } catch (_) {} ta.remove(); return ok; } }
  /** the video as a file, for apps that take one (Instagram, a story): fetched once per sheet */
  async function fileOf(p) {
    let u = C.storage.url(p.media_path); if (!u) { await S().urls([p]); u = C.storage.url(p.media_path); }
    const r = await fetch(u); if (!r.ok) throw new Error('http ' + r.status);
    const b = await r.blob(), ext = /webm/.test(b.type) ? 'webm' : 'mp4';
    return new File([b], 'panduri-' + p.id + '.' + ext, { type: b.type || 'video/mp4' });
  }
  /** a video: send to a friend, repost, copy the link, or give it to another app; „More" is the phone's own share sheet */
  function share(p, onShared) {
    PD.ui.sheet((b, close) => {
      const text = t('cp.shareText', { n: p.author_nick ? '@' + p.author_nick : (p.author_name || '') }) + (p.caption ? ' — ' + p.caption.slice(0, 100) : '');
      const url = linkOf(p);
      const counted = () => { C.social.shareOut(p.id).catch(() => {}); if (p.author !== C.uid) { p.shares = (p.shares || 0) + 1; onShared && onShared(); } };
      const friends = h('div', { class: 'cp-frow' }), note = h('p', { class: 'cp-snote' });
      let file = null;
      const appBtn = (k, key, fn, on) => { const [bg, icon] = APPS[k]; const el = h('button', { class: 'cp-app' + (on ? ' on' : ''), type: 'button', onclick: () => { buzz('select'); fn(el); } }, [h('span', { class: 'cp-appic', style: 'background:' + bg, html: icon }), h('small', { text: key[0] === '!' ? key.slice(1) : t(key) })]); return el; };
      const viaFile = async (el, appName) => {
        if (file) return go();
        if (!(navigator.canShare && window.File)) return fallback();
        note.textContent = t('cp.preparing'); el.classList.add('busy');
        try { file = await fileOf(p); } catch (_) { el.classList.remove('busy'); return fallback(); }
        el.classList.remove('busy');
        if (!navigator.canShare({ files: [file] })) return fallback();
        // the file was fetched after the tap: the phone wants a fresh tap to open its share sheet
        note.textContent = '';
        const now = h('button', { class: 'btn primary cp-sharenow', text: t('cp.shareNow', { a: appName }), onclick: () => { now.remove(); go(); } });
        note.replaceWith(now); PD.motion && PD.motion.reveal && PD.motion.reveal(now, 0);
        function go() { navigator.share({ files: [file], text, title: t('app.name') }).then(counted, () => {}); }
        async function fallback() { note.textContent = ''; if (await copy(url)) { counted(); PD.ui.toast(t('cp.shareFileNo', { a: appName }), 5000); } }
        return null;
      };
      const fallbackCopy = async appName => { if (await copy(url)) { counted(); PD.ui.toast(t('cp.pasteIn', { a: appName }), 4000); } };
      const mine = p.author === C.uid;
      const apps = h('div', { class: 'cp-apps' }, [
        !mine && p.visibility !== 'friends' ? appBtn('repost', p.reposted ? 'cp.reposted' : 'cp.repost', async el => {
          const keep = !p.reposted; p.reposted = keep; el.classList.toggle('on', keep); el.querySelector('small').textContent = t(keep ? 'cp.reposted' : 'cp.repost');
          try { await C.social.repost(p.id, keep); PD.ui.toast(t(keep ? 'cp.repostOn' : 'cp.repostOff')); if (keep) buzz('success'); }
          catch (e) { p.reposted = !keep; el.classList.toggle('on', !keep); el.querySelector('small').textContent = t(!keep ? 'cp.reposted' : 'cp.repost'); const m = (e && e.message) || ''; PD.ui.toast(/own-post/.test(m) ? t('cp.ownRepost') : /not-found/.test(m) ? t('cp.friendsOnlyRepost') : err(e)); }
        }, p.reposted) : null,
        appBtn('copy', 'cp.copy', async () => { if (await copy(url)) { counted(); PD.ui.toast(t('cp.copied')); } }),
        appBtn('messenger', '!Messenger', () => { if (MOBILE) { counted(); openExt('fb-messenger://share/?link=' + encodeURIComponent(url)); } else { fallbackCopy('Messenger'); openExt('https://www.messenger.com/'); } }),
        appBtn('instagram', '!Instagram', el => viaFile(el, 'Instagram')),
        appBtn('whatsapp', '!WhatsApp', () => { counted(); openExt('https://wa.me/?text=' + encodeURIComponent(text + ' ' + url)); }),
        appBtn('telegram', '!Telegram', () => { counted(); openExt('https://t.me/share/url?url=' + encodeURIComponent(url) + '&text=' + encodeURIComponent(text)); }),
        appBtn('sms', '!SMS', () => { counted(); openExt('sms:' + (IOS ? '&' : '?') + 'body=' + encodeURIComponent(text + ' ' + url)); }),
        appBtn('story', 'cp.story', el => viaFile(el, 'Story')),
        appBtn('more', 'cp.more', () => { if (navigator.share) navigator.share({ title: t('app.name'), text, url }).then(counted, () => {}); else fallbackCopy(t('cp.more')); })].filter(Boolean));
      b.append(h('h2', { 'data-t': 'cp.shareTo' }), h('small', { class: 'cp-slab', 'data-t': 'cp.sendFriend' }), friends, apps, note, h('small', { class: 'muted cp-snote2', 'data-t': 'cp.linkNote' }));
      if (moves()) [...apps.children].forEach((x, i) => x.animate([{ transform: 'translateY(14px) scale(.9)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 360, delay: 40 + i * 30, easing: 'cubic-bezier(.34,1.56,.64,1)', fill: 'backwards' }));
      (async () => {
        try {
          const fr = ((await C.social.friends()) || []).filter(f => f.relation === 'friend');
          if (!fr.length) { friends.append(h('p', { class: 'muted cp-fnone', 'data-t': 'fd.noFriendsYet' })); PD.i18n.apply(friends); return; }
          fr.forEach((f, i) => {
            const el = h('button', { class: 'cp-fr', type: 'button' }, [avatar(f.avatar_url, nameOf(f), 'cp-frav'), h('small', { text: f.display_name || '@' + f.nickname })]);
            el.onclick = async () => { if (el.classList.contains('sent')) return; el.classList.add('busy'); try { const conv = await C.chat.open(f.id); await C.chat.send(conv, '', { post_ref: p.id }); el.classList.remove('busy'); el.classList.add('sent'); buzz('success'); p.shares = (p.shares || 0) + 1; onShared && onShared(); } catch (e) { el.classList.remove('busy'); PD.ui.toast(err(e)); } };
            friends.append(el);
            if (moves()) el.animate([{ transform: 'scale(.7)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 320, delay: i * 35, easing: 'cubic-bezier(.34,1.56,.64,1)', fill: 'backwards' });
          });
        } catch (e) { friends.append(h('p', { class: 'muted', text: err(e) })); }
      })();
    });
  }
  function shareLink(url, title) {
    if (navigator.share) navigator.share({ title: title || t('app.name'), url }).catch(() => {});
    else copy(url).then(ok => ok && PD.ui.toast(t('cp.copied')));
  }
  const shareProfile = card => shareLink(profLink(card), card.display_name || '@' + card.nickname);

  /* ===================================================================== inbox: messages and activity */
  function inboxSeg(w, which) {
    const seg = h('div', { class: 'seg cp-iseg', role: 'tablist' }, [['chats', 'cp.msgs'], ['activity', 'cp.act']].map(([k, key]) => h('button', { role: 'tab', 'aria-pressed': String(k === which), 'data-t': key, onclick: () => { if (k !== which) PD.app.go('community', k, true); } })));
    w.append(seg); PD.i18n.apply(seg);
  }
  function activity(w) {
    w.append(h('div', { class: 'cp-top' }, [h('span', { class: 'cp-ib' }), h('b', { class: 'cp-toptitle', 'data-t': 'cn.inbox' }), h('span', { class: 'cp-ib' })]));
    inboxSeg(w, 'activity');
    const box = h('div', { class: 'cp-act' }); w.append(box);
    try { PD.notify.page(box, { only: PD.notify.isCommunity }); } catch (_) {}   // likes, comments, follows, reposts, friends — nothing of Sima's
    PD.i18n.apply(w);
  }

  return { profile, search, tagPage, share, shareProfile, richText, activity, inboxSeg, syncNav, newVideo, IC, nf, avatar, personRow };
})();
