/* Original animated 2D artwork, instrument cutouts, and pre-rendered 3D sculptures.
   Wire IDs are text; old messages resolve through LEGACY instead of losing art. */
PD.i18n.add({
  'sp.title':['სტიკერების პაკები','Sticker packs'], 'sp.all':['ყველა სტიკერი','All stickers'],
  'sp.recent':['ბოლო გამოყენებული','Recent'], 'sp.favorites':['რჩეული','Favorites'],
  'sp.addFavorite':['რჩეულებში დამატება','Add to favorites'], 'sp.removeFavorite':['რჩეულებიდან ამოღება','Remove from favorites'],
  'sp.search':['მოძებნე სტიკერი ან პაკი…','Search stickers or packs…'],
  'sp.count':['{n} სტიკერი','{n} stickers'], 'sp.total':['{p} პაკი · {n} სტიკერი','{p} packs · {n} stickers'],
  'sp.empty':['ვერაფერი მოიძებნა','No stickers found'], 'sp.noRecent':['გაგზავნილი სტიკერები აქ გამოჩნდება','Stickers you send will appear here'],
  'sp.noFavorites':['ვარსკვლავით შეინახე სასურველი სტიკერები','Use the star to save stickers here'],
  'sp.back':['პაკებთან დაბრუნება','Back to packs'], 'sp.more':['კიდევ {n} სტიკერი','Show {n} more stickers'],
  'sp.unavailable':['სტიკერი მიუწვდომელია','Sticker unavailable'], 'sp.preview':['ანიმაციის თავიდან ნახვა','Replay animation'], 'sp.motion':['ანიმაცია','Animation'], 'sp.motionOn':['მოძრაობის ჩართვა','Play animations'], 'sp.motionOff':['მოძრაობის შეჩერება','Pause animations'], 'sp.motion2d':['2D მოძრაობა','2D motion'], 'sp.motion3d':['3D კოლექცია','3D collection'], 'sp.realistic':['რეალისტური','Realistic']
});
PD.stickers=(()=>{
  const h=PD.h,esc=PD.esc||((s)=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])));
  const packs=[],catalog=[],byId=new Map(),labels={};
  function pack(id,ka,en,color,style,rows){
    color=({instruments:'#edbb70',studio:'#a89bfa',stage:'#ed9dbd',sound:'#7ed5c1',replies:'#adb2ff',words:'#e6ac91',gestures:'#edbf9f',moods:'#99c9f2',city:'#afa2ec',nature:'#9dd6a8',daily:'#e7b484',close:'#ef9da9',focus:'#a8c5f3',travel:'#94cdd9',celebrate:'#f3c65f',analog:'#d4b3ec',sculpt:'#b4a0ff'})[id]||color;
    const p={id,key:'sp.pack.'+id,color,style,ids:[]};labels[p.key]=[ka,en];
    rows.forEach(([slug,k,e,symbol])=>{const item={id:id+'-'+slug,key:'sp.item.'+id+'.'+slug,pack:id,symbol,style,color,index:p.ids.length};labels[item.key]=[k,e];p.ids.push(item.id);catalog.push(item);byId.set(item.id,item);});packs.push(p);
  }
  pack('folkstrings','ქართული სიმები','Georgian strings','#d9a676','instrument',[
    ['panduri','ფანდური','Fanduri','panduri'], ['chonguri','ჩონგური','Chonguri','chonguri'],
    ['changi','ჩანგი','Changi','harp'], ['chuniri','ჭუნირი','Chuniri','bowed']
  ]);
  pack('folkwinds','ჩასაბერი და დასარტყამი','Georgian winds & percussion','#caa27d','instrument',[
    ['doli','დოლი','Doli','drum'], ['salamuri','სალამური','Salamuri','flute'],
    ['daira','დაირა','Daira','tambourine'], ['larchemi','ლარჭემი','Larchemi','panpipes']
  ]);
  pack('acoustic','აკუსტიკური სიმები','Acoustic strings','#d0a38b','instrument',[
    ['guitar','კლასიკური გიტარა','Classical guitar','guitar'], ['violin','ვიოლინო','Violin','violin'],
    ['cello','ჩელო','Cello','cello'], ['mandolin','მანდოლინა','Mandolin','mandolin']
  ]);
  pack('jazz','ჯაზის საკრავები','Jazz instruments','#d8b366','instrument',[
    ['trumpet','საყვირი','Trumpet','trumpet'], ['saxophone','საქსოფონი','Saxophone','saxophone'],
    ['piano','როიალი','Grand piano','piano'], ['drumkit','დრამების ნაკრები','Drum kit','drum']
  ]);
  pack('instruments','ქართული საკრავები','Georgian instruments','#c9a173','wood',[
    ['panduri','ფანდური','Fanduri','panduri'],['chonguri','ჩონგური','Chonguri','chonguri'],['doli','დოლი','Doli','drum'],['garmoni','გარმონი','Garmoni','accordion'],
    ['duduki','დუდუკი','Duduki','duduki'],['salamuri','სალამური','Salamuri','flute'],['chiboni','ჭიბონი','Chiboni','bagpipe'],['changi','ჩანგი','Changi','harp'],
    ['chuniri','ჭუნირი','Chuniri','bowed'],['daira','დაირა','Daira','tambourine'],['diplipito','დიპლიპიტო','Diplipito','kettledrums'],['larchemi','ლარჭემი','Larchemi','panpipes'],
    ['strings','სამი სიმი','Three strings','strings'],['pick','პლექტრი','Plectrum','pick'],['ensemble','ანსამბლი','Ensemble','ensemble'],['case','საკრავი მზადაა','Instrument ready','instrumentcase']
  ]);
  pack('studio','სტუდია','Recording studio','#a5b6b8','steel',[
    ['mic','მიკროფონი','Microphone','mic'],['headphones','ყურსასმენი','Headphones','headphones'],['mixer','მიქშერი','Mixer','mixer'],['monitor','სტუდიის მონიტორი','Studio monitor','speaker'],
    ['recording','იწერება','Recording','record'],['interface','აუდიო ინტერფეისი','Audio interface','interface'],['cable','კაბელი შეერთებულია','Cable connected','cable'],['session','ახალი სესია','New session','session'],
    ['master','მასტერინგი','Mastering','equalizer'],['booth','ჩაწერის ოთახი','Recording booth','booth'],['take','კარგი დუბლი','Good take','clapper'],['stand','მიკროფონის სადგამი','Microphone stand','micstand'],
    ['meters','დონე წესრიგშია','Levels are right','meters'],['patch','პატჩ პანელი','Patch panel','patch'],['desk','სტუდიაში ვარ','At the studio','desk'],['export','ჩანაწერი მზადაა','Recording ready','export']
  ]);
  pack('stage','ცოცხალი სცენა','Live stage','#c8a06a','stage',[
    ['spotlight','სცენა შენია','The stage is yours','spotlight'],['ticket','კონცერტზე გელოდები','See you at the concert','ticket'],['curtain','ფარდა იხსნება','Curtain up','curtain'],['amp','ხმა მოუმატე','Turn it up','amp'],
    ['mic','ცოცხლად','Live','stagemic'],['applause','აპლოდისმენტები','Applause','applause'],['encore','ბისი!','Encore!','encore'],['lights','სცენის შუქები','Stage lights','lights'],
    ['setlist','სეტლისტი','Setlist','setlist'],['soundcheck','ხმის შემოწმება','Soundcheck','soundcheck'],['backstage','კულისებში','Backstage','backstage'],['crowd','ერთად ვმღერით','Singing together','crowd'],
    ['festival','ფესტივალი','Festival','festival'],['solo','სოლო','Solo','solo'],['duet','დუეტი','Duet','duet'],['bow','მადლობა მოსმენისთვის','Thank you for listening','bow']
  ]);
  pack('sound','ხმა და რიტმი','Sound & rhythm','#8eaaa0','sound',[
    ['wave','შენი ტალღა','Your wavelength','wave'],['tempo','შენს ტემპში','At your tempo','metronome'],['pulse','პულსი','Pulse','pulse'],['pause','პაუზა','Pause','pause'],
    ['play','დავიწყოთ','Let’s play','play'],['loop','კიდევ ერთხელ','Once again','loop'],['quiet','ჩუმად','Quietly','quiet'],['loud','ხმამაღლა','Loudly','loud'],
    ['harmony','ჰარმონია','Harmony','harmony'],['bass','დაბალი სიხშირე','Low frequency','bass'],['treble','მაღალი სიხშირე','High frequency','treble'],['stereo','სტერეო','Stereo','stereo'],
    ['crescendo','ნელა ვუმატებთ','Crescendo','crescendo'],['silence','სიჩუმეც მუსიკაა','Silence is music too','silence'],['rhythm','რიტმს ვგრძნობ','Feeling the rhythm','rhythm'],['tune','ერთ ტალღაზე','In tune','tuningfork']
  ]);
  pack('replies','მოკლე პასუხები','Short replies','#c7c0b2','type',[
    ['yes','კი','YES'],['no','არა','NO'],['okay','კარგი','OKAY'],['agreed','შევთანხმდით','AGREED'],['ready','მზად ვარ','READY'],['understood','გასაგებია','GOT IT'],['onmyway','მოვდივარ','ON MY WAY'],['wait','მოიცადე','WAIT'],
    ['minute','ერთი წუთი','ONE MINUTE'],['later','ცოტა ხანში','A BIT LATER'],['sent','გავგზავნე','SENT'],['seen','ვნახე','SEEN'],['listening','გისმენ','LISTENING'],['thanks','მადლობა','THANK YOU'],['sorry','ბოდიში','SORRY'],['great','შესანიშნავია','EXCELLENT']
  ]);
  pack('words','ქართული სიტყვები','Georgian words','#c49a82','editorial',[
    ['hello','გამარჯობა','HELLO'],['morning','დილა მშვიდობისა','GOOD MORNING'],['night','ძილი ნებისა','GOOD NIGHT'],['welcome','კეთილი იყოს','WELCOME'],['cheers','გაგიმარჯოს','CHEERS'],['bravo','ყოჩაღ','WELL DONE'],['respect','პატივისცემა','RESPECT'],['peace','მშვიდობა','PEACE'],
    ['miss','მენატრები','MISS YOU'],['withyou','შენ გვერდით ვარ','BY YOUR SIDE'],['soon','მალე გნახავ','SEE YOU SOON'],['letstalk','მოდი ვისაუბროთ','LET’S TALK'],['takecare','თავს გაუფრთხილდი','TAKE CARE'],['goodluck','წარმატებები','GOOD LUCK'],['believe','შენი მჯერა','I BELIEVE IN YOU'],['together','ერთად უკეთესია','BETTER TOGETHER']
  ]);
  pack('gestures','ჟესტები','Gestures','#c6ac92','line',[
    ['thumb','მომწონს','Like it','thumb'],['okay','ზუსტად','Exactly','okhand'],['peace','მშვიდობით','Peace','peacehand'],['wave','მოგესალმები','Greetings','wavehand'],['clap','ტაში','Clap','claphands'],['fist','მხარდაჭერა','Support','fist'],['point','აი, ეს','This one','point'],['palm','შეჩერდი','Hold on','palm'],
    ['heart','გულით','From the heart','handheart'],['handshake','სიტყვა სიტყვაა','A promise','handshake'],['thanks','გულწრფელი მადლობა','Sincere thanks','prayer'],['crossed','იმედი მაქვს','Fingers crossed','crossed'],['call','დამირეკე','Call me','callhand'],['listen','ყურადღებით','Paying attention','ear'],['check','დადასტურებულია','Confirmed','check'],['salute','ჩემი პატივისცემა','My respect','salute']
  ]);
  pack('moods','მშვიდი განწყობა','Quiet moods','#a4afb9','air',[
    ['dawn','ახალი დასაწყისი','A new beginning','sunrise'],['rain','წვიმას ვუსმენ','Listening to rain','rain'],['cloud','მოღრუბლულია','Cloudy','cloud'],['moon','ჩემი დროა','Time for myself','moon'],['sun','ნათელი დღე','A bright day','sun'],['fog','ნისლში','In the mist','fog'],['breathe','ღრმად ამოისუნთქე','Take a deep breath','breathe'],['rest','დავისვენოთ','Let’s rest','hammock'],
    ['slow','არ გვეჩქარება','No rush','hourglass'],['storm','გადაივლის','This will pass','storm'],['clear','გამოიდარა','Clear skies','clear'],['balance','ბალანსი','Balance','balance'],['warm','სითბო','Warmth','candle'],['tide','მოვალ და წავალ','Ebb and flow','tide'],['stars','კარგი ღამე','A good night','constellation'],['still','აქ და ახლა','Here and now','stone']
  ]);
  pack('city','ღამის ქალაქი','City after dark','#9babc5','city',[
    ['window','ფანჯარასთან','By the window','window'],['balcony','აივანზე','On the balcony','balcony'],['street','ქალაქი არ იძინებს','The city is awake','street'],['lamp','ქუჩის შუქი','Street light','lamppost'],['bridge','მეორე ნაპირზე','Across the bridge','bridge'],['skyline','საღამოს ქალაქი','Evening skyline','skyline'],['door','კარი ღიაა','The door is open','door'],['stairs','ერთი ნაბიჯით მაღლა','One step higher','stairs'],
    ['rooftop','სახურავზე','On the rooftop','rooftop'],['taxi','ტაქსიში ვარ','In a taxi','taxi'],['metro','მეტროში ვარ','On the metro','metro'],['cafe','შევხვდეთ კაფეში','Meet at the café','cafe'],['neon','გვიანი საათი','Late hours','neon'],['rain','წვიმიანი ქუჩა','Rainy street','rainstreet'],['clock','ჯერ ადრეა','The night is young','clocktower'],['home','სახლში მივედი','Home at last','house']
  ]);
  pack('nature','ბუნება','Outdoors','#9eaf86','nature',[
    ['mountain','მთები მეძახის','The mountains call','mountain'],['forest','ტყის სიჩუმე','Forest quiet','forest'],['river','დინებას მიჰყვები','Follow the river','river'],['sea','ზღვის ხმა','Sound of the sea','sea'],['leaf','მსუბუქად','Lightly','leaf'],['pine','სუფთა ჰაერი','Fresh air','pine'],['camp','კარვით','Camping','tent'],['fire','კოცონთან','By the fire','campfire'],
    ['moonlake','მთვარე ტბაზე','Moon over the lake','moonlake'],['trail','ჩემს გზაზე','On my own path','trail'],['sunset','მზის ჩასვლა','Sunset','sunset'],['flower','შენთვის','For you','wildflower'],['bird','თავისუფლად','Freely','bird'],['waterfall','ჩანჩქერი','Waterfall','waterfall'],['peak','ზემოთ ვხვდებით','See you at the top','peak'],['compass','ჩემი მიმართულება','My direction','compass']
  ]);
  pack('daily','ყავა და ყოველდღიურობა','Coffee & everyday','#b6a18a','daily',[
    ['espresso','ჯერ ყავა','Coffee first','espresso'],['mug','თბილი ყავა','Warm coffee','mug'],['tea','ჩაი დავლიოთ','Let’s have tea','teapot'],['book','ვკითხულობ','Reading','book'],['letter','შენგან წერილი','A letter from you','letter'],['breakfast','ნელი დილა','A slow morning','breakfast'],['plant','პატარა სიხარული','Little joys','plant'],['vinyl','დღის მუსიკა','Today’s music','recordplayer'],
    ['glasses','ყურადღებით ვკითხულობ','Reading closely','glasses'],['keys','გავედი','Heading out','keys'],['umbrella','ქოლგა არ დაგავიწყდეს','Take an umbrella','umbrella'],['bicycle','პატარა გასეირნება','A short ride','bicycle'],['bag','დღე იწყება','The day begins','totebag'],['sofa','დღე დასრულდა','Calling it a day','armchair'],['notebook','ჩავინიშნე','Noted','notebook'],['bread','ერთად ვისაუზმოთ','Breakfast together','bread']
  ]);
  pack('close','ახლო ადამიანები','Close to you','#ba8d88','close',[
    ['heart','მიყვარხარ','Love you','heart'],['letter','სიყვარულით','With love','loveletter'],['flower','შენ გჩუქნი','A gift for you','rose'],['hands','შენ გვერდით','Beside you','holdinghands'],['home','შენთან სახლში','Home with you','homeheart'],['rings','ერთად','Together','rings'],['ribbon','ჩვენი კავშირი','Our connection','ribbon'],['moon','ერთ ცას ვუყურებთ','Under the same sky','twomoons'],
    ['coffee','ორი ყავა','Coffee for two','twocups'],['key','ჩემი ნდობა','My trust','heartkey'],['distance','მანძილი ვერ გვაშორებს','Across the distance','distance'],['hug','ჩახუტება','A hug','embrace'],['remember','შენზე ვფიქრობ','Thinking of you','pressedflower'],['listen','შენთვის დრო მაქვს','Time for you','heartwave'],['safe','ჩემთან მშვიდად ხარ','Safe with me','shelter'],['always','ყოველთვის','Always','infinity']
  ]);
  pack('focus','ფოკუსი','Focus & practice','#adb1a0','focus',[
    ['work','ვმუშაობ','Working','laptop'],['practice','ვვარჯიშობ','Practising','practice'],['study','ვსწავლობ','Studying','study'],['plan','გეგმა მაქვს','I have a plan','planner'],['done','დასრულებულია','Done','checklist'],['break','ხუთი წუთი','Five minutes','timer'],['idea','იდეა მაქვს','I have an idea','bulb'],['target','მიზნისკენ','Towards the goal','target'],
    ['progress','წინ მივდივარ','Making progress','progress'],['offline','ოფლაინ ვარ','Offline','offline'],['busy','დაკავებული ვარ','Busy','busy'],['deep','არ შემაწყვეტინო','Deep focus','headphones'],['repeat','გამეორება','Repetition','repeat'],['calendar','დრო დავგეგმოთ','Let’s make time','calendar'],['pencil','მონახაზი','First draft','pencil'],['finish','გამოგვივიდა','We did it','finish']
  ]);
  pack('travel','გზაში','On the road','#a4b7bf','travel',[
    ['train','მატარებლით','By train','train'],['plane','მივფრინავ','Taking off','plane'],['suitcase','ბარგი მზადაა','Bags are packed','suitcase'],['map','ახალი ადგილი','Somewhere new','map'],['road','გზაში ვარ','On the road','road'],['car','მალე მოვალ','Almost there','car'],['boat','წყლის გზით','By water','boat'],['sign','სწორ გზაზე','On the right road','signpost'],
    ['passport','ახალი მოგზაურობა','A new journey','passport'],['boots','ფეხით მივდივარ','Going on foot','boots'],['camera','მოგონებებისთვის','For the memories','camera'],['pin','აქ ვარ','I’m here','mappin'],['ticket','ბილეთი ავიღე','Ticket booked','boardingpass'],['backpack','მსუბუქი ბარგი','Travel light','backpack'],['meet','შეხვედრის ადგილი','Meeting point','meeting'],['horizon','წინ ახალი დღეა','A new day ahead','horizon']
  ]);
  pack('celebrate','აღნიშვნა','Celebrate','#c7aa70','celebrate',[
    ['trophy','დამსახურებულია','Well deserved','trophy'],['birthday','გილოცავ','Happy birthday','cake'],['gift','პატარა საჩუქარი','A little gift','gift'],['flowers','მილოცვა','Congratulations','bouquet'],['toast','შენს გამარჯვებას','To your success','toast'],['ribbon','შესანიშნავი შედეგი','Excellent result','medal'],['confetti','დღეს ვზეიმობთ','Today we celebrate','confetti'],['crown','შენი დღეა','Your day','crown'],
    ['star','ბრწყინვალე','Brilliant','star'],['balloon','სიხარული','Joy','balloons'],['spark','ღირს აღნიშვნა','Worth celebrating','spark'],['laurel','გამარჯვება','Victory','laurel'],['invite','შემოგვიერთდი','Join us','invitation'],['toast2','ერთად აღვნიშნოთ','Celebrate together','twoglasses'],['fireworks','დიდი ამბავია','Big news','fireworks'],['record','ახალი რეკორდი','A new record','recordaward']
  ]);
  pack('analog','ანალოგური კოლექცია','Analog collection','#bda68b','analog',[
    ['vinyl','ვინილი','Vinyl','vinyl'],['cassette','კასეტა','Cassette','cassette'],['camera','ფირის კამერა','Film camera','filmcamera'],['radio','რადიო','Radio','radio'],['film','ერთი კადრი','One frame','film'],['typewriter','წერილი იწყება','A letter begins','typewriter'],['watch','კარგ დროს','In good time','watch'],['reel','მაგნიტური ფირი','Reel to reel','reeltape'],
    ['phone','ხაზზე ვარ','On the line','telephone'],['polaroid','შენახული მომენტი','A moment kept','polaroid'],['jukebox','ერთი სიმღერა','One song','jukebox'],['amp','თბილი ხმა','Warm sound','tubeamp'],['piano','საღამოს მელოდია','Evening melody','piano'],['clock','დრო არ ჩერდება','Time moves on','alarmclock'],['ticket','ძველი ბილეთი','An old ticket','oldticket'],['recordbox','პირადი კოლექცია','Personal collection','recordbox']
  ]);
  PD.i18n.add(labels);
  const INK='#e8e1d4',DARK='#27292b',METAL='#a7afb1';
  const path=(d,fill='none',stroke=INK,w=2)=>`<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
  const rect=(x,y,w,h,r=3,fill=DARK,stroke=INK)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${stroke}" stroke-width="1.8"/>`;
  const circle=(x,y,r,fill='none',stroke=INK,w=2)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${w}"/>`;
  const ellipse=(x,y,rx,ry,fill='none',stroke=INK)=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${fill}" stroke="${stroke}" stroke-width="1.8"/>`;
  const lines=(x,y,n,dx,dy,len,color=INK)=>Array.from({length:n},(_,i)=>path(`M${x+i*dx} ${y+i*dy}h${len}`,'none',color,1.4)).join('');
  const littleStar=(x,y,s=1,c=INK)=>path(`M${x} ${y-8*s}q0 ${8*s} ${8*s} ${8*s}q${-8*s} 0 ${-8*s} ${8*s}q0 ${-8*s} ${-8*s} ${-8*s}q${8*s} 0 ${8*s} ${-8*s}Z`,c,'none');
  const heart=(x=80,y=68,s=1,c=INK)=>`<g transform="translate(${x} ${y}) scale(${s})">${path('M0 27C-12 16-33 3-29-13S-5-30 0-15C5-30 29-29 29-13S12 16 0 27Z','none',c,2.2)}</g>`;
  const rays=(x,y,r,n,c)=>Array.from({length:n},(_,i)=>{const a=i*Math.PI*2/n;return path(`M${x+Math.cos(a)*r} ${y+Math.sin(a)*r}l${Math.cos(a)*9} ${Math.sin(a)*9}`,'none',c,1.8);}).join('');
  const mugs=(x=50,y=52,c=INK)=>rect(x,y,47,40,3,DARK,c)+path(`M${x+47} ${y+7}h9q12 13 0 25h-9M${x-5} ${y+46}h64M${x+12} ${y-9}q-5-8 1-14m13 14q-5-8 1-14`,'none',c,1.8);
  const trees=(x,y,s=1,c=INK)=>`<g transform="translate(${x} ${y}) scale(${s})">${path('M0 80V8m0 5-17 26h11L-24 62h14l-23 22h66L10 62h14L6 39h11Z','#26352c',c,1.7)}</g>`;
  const drawing={};
  function define(names,fn){names.split(' ').forEach(name=>drawing[name]=fn);}
  define('panduri', c => path('M74 71C71 79 52 80 52 96c0 11 9 21 11 40h34c2-19 11-29 11-40 0-16-19-17-22-25Z',c,'#76492f',2)
    + rect(74,28,12,49,1,'#794831','#a07851') + rect(73,9,14,23,1,c,'#76492f') + rect(77,12,6,16,1,'#302522','none')
    + Array.from({length:10},(_,i)=>path(`M74 ${32+i*4}h12`,'none',METAL,.9)).join('')
    + circle(80,95,10,'#302522','#75492c',1.6)
    + Array.from({length:16},(_,i)=>{const a=i*Math.PI/8;return circle(80+13.5*Math.cos(a),95+13.5*Math.sin(a),1.05,'#302522','none');}).join('')
    + path('M70 119h20','none','#855534',3)
    + [[17,1],[22,-1],[27,1]].map(([y,side])=>`<g class="sp-panduri-peg">${path(`M80 ${y}h${side*13}`,'none',METAL,1.2)}${ellipse(80+side*13,y,2.5,1.5,METAL,'none')}</g>`).join('')
    + [77,80,83].map((x,i)=>`<g class="sp-panduri-string">${path(`M80 ${17+i*5}L${x} 32V119L${x} 134`,'none','#fff3db',.8)}</g>`).join(''));
  define('chonguri',(c,s)=>{const fourth=s==='chonguri';return path('M72 43V8h16v35c2 13 32 23 32 49 0 20-18 32-40 32S40 112 40 92c0-26 30-36 32-49Z','#65452f',c,2.2)+path('M76 43V13h8v30c1 12 27 25 27 48 0 16-13 24-31 24S49 107 49 91c0-23 26-36 27-48Z','#a77b50','none')+ellipse(80,77,9,11,'#242323',c)+path('M65 107h30M65 17h7m16 0h7M65 28h7','none',INK,3)+Array.from({length:fourth?4:3},(_,i)=>path(`M${76+i*(fourth?2.6:4)} 13v94`,'none','#eee0c7',.8)).join('');});
  define('drum',(c)=>ellipse(80,39,40,14,'#c8ad86',c)+path('M40 39v62c0 21 80 21 80 0V39','#67473d',c)+ellipse(80,39,40,14,'#ba9f7a',INK)+path('m44 50 18 53 18-50 18 50 18-53M43 91h74','none','#cfb894',1.5)+path('m31 14 33 16m64-16-33 16','none',c,4));
  define('accordion',(c)=>rect(26,34,28,76,5,'#31333a',c)+rect(106,34,28,76,5,'#31333a',c)+rect(55,39,50,66,0,'#583d3c',c)+Array.from({length:8},(_,i)=>path(`M${58+i*6} 41v62`,'none',c,1.1)).join('')+Array.from({length:9},(_,i)=>rect(31,40+i*7,18,6,0,'#e7decb','#686056')).join('')+Array.from({length:12},(_,i)=>circle(114+i%2*10,45+Math.floor(i/2)*10,1.8,c,'none')).join(''));
  define('duduki flute',(c,s)=>`<g transform="rotate(22 80 65)">${rect(71,17,18,105,5,s==='duduki'?'#825f47':'#a28056',c)+path('M69 24h22m-21 7h20','none',INK,2)+Array.from({length:7},(_,i)=>circle(80,43+i*10,2,'#272522',c,1)).join('')}</g>`);
  define('bagpipe',(c)=>path('M43 68q15-25 40-18l30 16q16 29-12 40H61Q34 103 43 68Z','#605044',c)+path('m54 62-13-35m43 23 1-37m18 48 14-40M65 102l-10 22','none',c,9)+path('m54 62-13-35m43 23 1-37m18 48 14-40','none',INK,2));
  define('harp',(c)=>path('M40 25q64-19 82 9l-7 83H40Z','none',c,7)+Array.from({length:8},(_,i)=>path(`M${49+i*8} ${27+i*.7}V111`,'none',INK,.8)).join(''));
  define('bowed',(c)=>path('M74 43V10h12v33q30 15 18 43 18 30-24 35-42-5-24-35-12-28 18-43Z','#77553c',c)+ellipse(80,81,7,12,'#252527',c)+path('M79 14v95m5-95v95m-10-95v95M25 116 133 32','none',INK,1.3)+path('M23 115 132 31','none',c,3));
  define('tambourine',(c)=>circle(80,67,48,'#6a4e39',c,4)+circle(80,67,38,'#b9a180',INK,1)+Array.from({length:8},(_,i)=>{const a=i*Math.PI/4;return ellipse(80+Math.cos(a)*44,67+Math.sin(a)*44,6,3,METAL,c);}).join(''));
  define('kettledrums',(c)=>path('M29 42q2 65 27 67 25-2 27-67m-2-8q2 65 27 67 25-2 27-67','#6b4a36',c,2)+ellipse(56,42,27,10,'#c2aa83',INK)+ellipse(108,34,27,10,'#c2aa83',INK)+path('m27 17 28 15m74-22-25 14','none',c,4));
  define('panpipes',(c)=>Array.from({length:7},(_,i)=>rect(34+i*13,24,11,95-i*9,3,'#96744a',c)).join('')+path('M32 43h94m-94 8h94','none',INK,3));
  define('strings',(c)=>path('M26 23h108M26 111h108','none',c,4)+[48,80,112].map((x,i)=>path(`M${x} 24q${i===1?10:0} 45 0 86`,'none',INK,1.2)).join('')+ellipse(80,111,39,7,'none',c));
  define('pick',(c)=>path('M36 38q44-22 88 0 12 21-44 84Q24 59 36 38Z','#494b49',c,2.2)+path('M51 45q29-12 58 0M62 56q18-7 36 0','none',INK,1));
  define('ensemble',(c)=>`<g transform="translate(2 28) scale(.68)">${drawing.panduri(c,'panduri')}</g><g transform="translate(60 42) scale(.64)">${drawing.drum(c)}</g>`);
  define('instrumentcase',(c)=>path('M67 14h26v42l17 14q12 22 0 48H50q-12-26 0-48l17-14Z','#343735',c,2)+path('M80 20v94m-34-34h9m50 0h9M59 117h42','none',INK,1.3)+rect(105,82,9,20,3,'none',c));
  define('mic',(c)=>rect(65,19,30,68,15,'#494d4c',c)+path('M54 65v9q0 27 26 27t26-27v-9M80 101v19m-17 0h34','none',INK,2)+lines(70,30,6,0,7,20,c));
  define('headphones',(c)=>path('M35 85V61a45 45 0 0 1 90 0v24','none',c,8)+path('M35 59a45 45 0 0 1 90 0','none',INK,2)+rect(25,67,24,45,8,'#363b3d',c)+rect(111,67,24,45,8,'#363b3d',c)+path('M34 75v28m92-28v28','none',INK,1));
  define('mixer',(c)=>rect(22,26,116,91,6,'#363b3d',c)+Array.from({length:7},(_,i)=>{const x=36+i*15;return path(`M${x} 58v47`,'none',METAL,1)+rect(x-4,66+i%3*9,8,12,1,c,'none')+circle(x,40,4,'#25292a',INK,1);}).join(''));
  define('speaker amp tubeamp',(c,s)=>rect(40,18,80,106,5,s==='tubeamp'?'#604c3d':'#303638',c)+circle(80,82,26,'#24292a',INK)+circle(80,82,10,'#353e40',c)+circle(80,39,10,'#232829',c)+circle(80,39,3,c,'none')+path('M50 114h60','none',c,1));
  define('record',(c)=>circle(80,69,44,'#292d2f',c)+circle(80,69,22,'#863e3e','#c49683',1.5)+circle(80,69,4,INK,'none')+path('M35 19h90m-89 100h90','none',INK,1));
  define('interface',(c)=>rect(20,47,120,57,5,'#3b4142',c)+circle(45,76,13,'#262c2e',INK)+circle(45,76,5,'none',c)+circle(108,76,16,'#292e31',INK)+path('M108 61v8','none',c,3)+[69,79].map(x=>circle(x,76,3,'#8aab93','none')).join(''));
  define('cable',(c)=>path('M55 26v24c-40 0-35 61 8 61 45 0 51-51 12-51-38 0-33 40-3 40h36V82','none',c,4)+rect(47,11,16,26,3,'#454e50',INK)+rect(100,65,16,27,3,'#454e50',INK)+path('M51 10V3m8 7V3m45 62v-7m8 7v-7','none',INK,2));
  define('session',(c)=>rect(18,28,124,86,4,'#2c3335',c)+path('M40 32v78m-17-57h114m-114 27h114','none',METAL,1)+path('m47 44 5-10 5 20 5-12h21m-36 27 5-11 6 17 5-9h54m-70 31 7-11 5 18 7-14h45','none',c,2));
  define('equalizer meters',(c,s)=>rect(28,25,104,94,4,'#242c2c',c)+Array.from({length:9},(_,i)=>{const height=[26,43,63,48,77,61,41,55,31][i];return rect(38+i*10,108-height,5,height,1,s==='meters'&&i>6?'#bb8a6f':c,'none');}).join(''));
  define('booth',(c)=>path('M38 123V22h84v101M46 30h68v59H46Z','#2e3638',c)+rect(50,36,60,47,2,'#65777d',INK)+path('M64 83V51q16-19 32 0v32M80 93v24m-8 0h16','none',INK,2));
  define('clapper',(c)=>rect(30,54,100,62,3,'#333738',c)+path('M30 54 23 32l96-23 7 23Z','#d2cbb9',INK)+[0,1,2,3,4].map(i=>path(`M${32+i*20} ${31-i*4.8}l10 19`,'none',DARK,8)).join('')+lines(44,77,3,0,11,70,c));
  define('micstand stagemic',(c)=>`<g transform="translate(6 -3) scale(.87)">${drawing.mic(c)}</g>`+path('M76 104v24M44 129h65','none',c,3));
  define('patch',(c)=>rect(23,30,114,83,3,'#303738',c)+Array.from({length:24},(_,i)=>circle(36+i%6*18,44+Math.floor(i/6)*17,4,'#1e2728',c,1)).join('')+path('M54 61v29q0 12 18 12t18-12V61','none',INK,2));
  define('desk',(c)=>path('M20 82h120M34 83v43m92-43v43','none',c,4)+rect(48,28,64,43,3,'#273437',INK)+path('M80 71v9m-16 0h32','none',INK,2)+rect(24,48,15,31,2,'#4a5351',c)+rect(121,48,15,31,2,'#4a5351',c));
  define('export',(c)=>rect(38,17,84,106,4,'#2f3839',c)+path('M55 42h51m-51 13h51M80 66v38m-14-14 14 14 14-14M57 111h46','none',INK,2));
  define('spotlight',(c)=>`<g transform="rotate(-20 80 45)">${rect(55,25,50,35,7,'#343a3b',INK)+ellipse(106,43,9,17,c,INK)+path('m115 28 29-16v63l-29-17Z',c,'none')}</g>`+path('M74 61v52m-22 7h44','none',c,3));
  define('ticket boardingpass oldticket',(c,s)=>path('M24 39h112v19q-16 6 0 16v21H24V74q16-10 0-16Z','#353833',c,2)+path('M107 41v52','none',INK,1.4)+lines(38,55,3,0,12,48,INK)+(s==='oldticket'?path('M26 96h109','none',c,1):littleStar(119,66,.6,c)));
  define('curtain',(c)=>path('M22 23h116M29 26v95l29-25V28m73-2v95l-29-25V28','#644441',c,2)+path('M42 28v69m76-69v69M58 121h44','none',INK,1.2));
  define('applause',(c)=>drawing.claphands(c)+rays(80,19,13,5,c));
  define('encore',(c)=>path('M32 48a48 48 0 0 1 91 1m1-17v19h-19M128 91a48 48 0 0 1-91 1m-1 17V90h19','none',c,3)+path('M69 47v45l29-23Z',INK,'none'));
  define('lights',(c)=>path('M20 23h120m-103 0v12m43-12v12m43-12v12','none',INK,2)+[37,80,123].map((x,i)=>rect(x-13,34,26,27,3,'#363c3b',c)+path(`m${x-8} 66-14 40h44l-14-40`,i===1?'#8a735b55':'none',c,1)).join(''));
  define('setlist',(c)=>rect(39,17,82,109,3,'#373c3b',c)+[0,1,2,3,4].map(i=>circle(52,38+i*16,2,c,'none')+path(`M62 ${38+i*16}h43`,'none',INK,1.4)).join(''));
  define('soundcheck',(c)=>drawing.mic(c)+path('M18 67q-9 16 0 31m124-31q9 16 0 31','none',c,2));
  define('backstage',(c)=>rect(45,30,70,88,4,'#3c3c3a',c)+path('M63 31V15h34v16M56 53h48m-48 45h48','none',INK,2)+circle(80,75,12,'none',c)+path('m72 75 6 7 13-15','none',c,2));
  define('crowd',(c)=>Array.from({length:7},(_,i)=>{const x=24+i*19,y=65+(i%2)*15;return circle(x,y,7,'#333b3c',c)+path(`M${x-9} 119V${y+16}q9-11 18 0v${103-y}`,'#333b3c',INK,1.4);}).join(''));
  define('festival',(c)=>path('M20 116V40h120v76M20 40l60-26 60 26M28 38l12 12 13-12 13 12 14-12 14 12 13-12 13 12 12-12','none',c,2)+path('M36 113V65h88v48M40 112h80M75 66v35l19-13-19-12','none',INK,2));
  define('solo',(c)=>drawing.spotlight(c)+path('M79 81v31m-9 7h18','none',INK,2));
  define('duet',(c)=>`<g transform="translate(-12 29) scale(.7)">${drawing.mic(c)}</g><g transform="translate(65 29) scale(.7)">${drawing.mic(c)}</g>`);
  define('bow',(c)=>path('M35 90q45 35 90 0M80 43v31m0 0-29 22m29-22 30 22M54 119h52','none',c,2.5)+circle(80,29,10,'none',INK));
  define('wave bass treble quiet loud rhythm',(c,s)=>{const cycles=s==='bass'?2:s==='treble'?10:s==='quiet'?5:s==='loud'?4:7,amp=s==='quiet'?10:s==='loud'?38:24;return path('M20 73h120','none','#586765',1)+Array.from({length:cycles*8+1},(_,i)=>[20+i*120/(cycles*8),73+Math.sin(i*Math.PI/4)*amp]).reduce((a,[x,y],i)=>a+(i?'L':'M')+x.toFixed(2)+' '+y.toFixed(2),'') .replace(/^/, '<path d="').concat(`" fill="none" stroke="${c}" stroke-width="2.5"/>`);});
  define('metronome',(c)=>path('M59 18h42l25 105H34Z','#4d4a40',c,2)+path('M66 29h28l17 76H49Z','#a49778',INK,1)+path('M80 109 59 40','none',INK,2.5)+rect(61,54,10,14,1,'#454943',c)+circle(80,109,4,c,'none'));
  define('pulse',(c)=>path('M18 80h27l10-23 14 44 18-72 14 51h40','none',c,3));
  define('pause',(c)=>rect(49,32,20,75,3,c,'none')+rect(91,32,20,75,3,c,'none'));
  define('play',(c)=>path('M53 28v88l69-44Z','#35403c',c,2.5));
  define('loop repeat',(c,s)=>path('M42 45h76l-15-15m15 15-15 15M118 97H42l15-15M42 97l15 15M29 54v34m102-34v34','none',c,s==='repeat'?3.5:2));
  define('harmony',(c)=>[0,1,2].map(i=>path(`M22 ${48+i*23}q28-32 57 0t59 0`,'none',i===1?INK:c,2)).join(''));
  define('stereo',(c)=>rect(21,28,43,88,4,'#333b3e',c)+rect(96,28,43,88,4,'#333b3e',c)+circle(42,80,14,'none',INK)+circle(118,80,14,'none',INK)+path('M71 50v46m10-59v72m9-59v46','none',c,2));
  define('crescendo',(c)=>path('m25 79 111-39M25 79l111 39','none',c,2)+lines(35,27,5,0,12,90,'#78847b'));
  define('silence',(c)=>path('M24 74h112','none',c,1.4)+rect(69,62,22,4,0,INK,'none')+path('M80 66v15','none',INK,1.3));
  define('tuningfork',(c)=>path('M63 17v46q0 25 17 25t17-25V17M80 88v35','none',c,4)+path('M47 27q-12 23 0 46m66-46q12 23 0 46','none',INK,1.5));
  // Hands use the same fine line treatment as the rest of the collection.
  const handBase=(c,extra='')=>path('M53 113V77l-8-15q-4-10 5-12 6-1 13 13V28q0-12 9-12t9 12v26-33q0-12 9-12t9 12v35-24q0-12 9-12t9 12v30-13q0-11 9-11t9 11v44q0 26-17 34v14Z','#514940',c,2)+extra;
  define('palm wavehand',(c,s)=>`<g transform="translate(-7 2) rotate(${s==='wavehand'?-10:0} 80 75)">${handBase(c)}</g>`+(s==='wavehand'?path('M28 28q-14 22 0 41m108-45q12 20 0 38','none',INK,1.8):''));
  define('thumb',(c)=>path('M44 67h22l18-25 4-24q18 0 16 20l-5 21h25q12 0 9 14l-10 39H65L44 98Z','#514940',c,2)+rect(27,65,19,48,3,'#313735',INK));
  define('okhand',(c)=>path('M46 119V87l-15-24q-6-9 2-14 6-4 13 5l10 14M58 89q-14-16-12-29 4-19 20-22 21 2 22 17 0 17-15 23-13 0-17-12M73 39V21q0-12 9-11t9 12v29-24q0-11 9-10t9 10v31-15q0-11 9-10t9 12v42q0 23-20 34Z','#514940',c,2));
  define('peacehand',(c)=>path('M51 120V83q-5-10 4-15l10 5-11-46q-3-12 6-14t13 10l9 37 10-39q3-12 12-9t6 14L99 70l10-13q8-10 15-3 5 5 0 14l-9 15q1 22-16 37Z','#514940',c,2)+path('M65 75q23-6 28 13M80 85v21','none',INK,1.3));
  define('fist',(c)=>path('M45 121V93q-10-5-10-20V59q0-15 13-15h7V30q0-15 16-12 15-10 25 1 17-4 20 11 15 0 15 15v38q0 23-22 32v6Z','#514940',c,2)+path('M55 44v22m18-45v38m22-35v33m20-24v26M42 66q39-17 45 9l-22 8','none',INK,1.4));
  define('point',(c)=>path('M35 120V78l-8-20q-3-11 7-14 8-1 17 16l5 4V46q0-12 12-12h61q13 0 13 10t-13 10H89v8q18-4 21 9 14 1 15 14v17q-2 15-25 18Z','#514940',c,2)+path('M89 63v20m20-8v16M55 77l15 18','none',INK,1.3));
  define('handheart',(c)=>path('M28 104 14 71q-3-11 6-13 9-2 13 9l9 13-6-29q-3-13 7-15 9-2 13 12l9 31 15 15 15-15 9-31q4-14 13-12 10 2 7 15l-6 29 9-13q4-11 13-9 9 2 6 13l-14 33-35 20H63Z','#514940',c,2)+heart(80,44,.48,INK));
  define('handshake',(c)=>path('m16 63 27-25 33 12 29-11 39 26-19 31-36 18-46-21Z','#514940',c,2)+path('m44 44 23 13-14 16q-9 9 1 16 9 5 24-9l25 23m-16-39 34 27M23 54l22 43m86-43-14 42','none',INK,1.6));
  define('prayer',(c)=>path('M34 122 19 97l34-32 14-45q5-15 13-6 8-9 13 6l14 45 34 32-15 25-46-38Z','#514940',c,2)+path('M80 17v67M52 72l13 12m43-12-13 12','none',INK,1.5));
  define('crossed',(c)=>path('M51 121V83L42 68q-5-12 4-15 7-1 16 13L55 28q-2-12 7-13 8 0 12 12l11 33-1-43q0-12 9-12 9 0 9 13l-1 42q16-9 22 6 14 0 15 14v20q0 16-25 21Z','#514940',c,2)+path('m68 46 33-20m1 38v22m19-17v22','none',INK,1.4));
  define('callhand',(c)=>path('M41 93 20 76q-10-8-3-15 6-6 17 2l22 12 10-32q4-12 13-8 10-8 18 3 13-2 18 11l18-27q8-11 15-5 7 6-1 17l-29 58-29 26H60Z','#514940',c,2)+path('m69 48 7 25m18-30-4 31m22-21-8 26','none',INK,1.5));
  define('claphands',(c)=>`<g transform="translate(5 22) rotate(-22 70 70) scale(.75)">${handBase(c)}</g><g transform="translate(31 -10) rotate(18 70 70) scale(.8)">${handBase(c)}</g>`);
  define('ear',(c)=>path('M105 104q-19 34-35 9-9-12 4-30 27-15 18-35-16-19-30 1M48 73Q25 28 62 13q55-17 61 35 4 28-18 40','none',c,3)+path('M27 51q-9 20 1 36','none',INK,1.5));
  define('check',(c)=>circle(80,70,46,'#303b35',c)+path('m52 72 20 20 38-46','none',INK,4));
  define('salute',(c)=>path('M29 120 43 78l49-48 20-5 24 9q7 3 3 10l-30 1-26 25 24-9q12-5 15 4 2 7-9 14l-27 18-18 23Z','#514940',c,2)+path('m52 80 21 20M94 31l7 13','none',INK,1.3));
  define('sunrise sunset',(c,s)=>path('M20 89h120','none',INK,1.6)+path('M47 88a33 33 0 0 1 66 0','#77664b',c,2)+rays(80,84,44,9,c)+path(`M80 ${s==='sunset'?39:61}v-26m-8 ${s==='sunset'?19:8} 8 ${s==='sunset'?8:-8} 8 ${s==='sunset'?-8:8}`,'none',INK,1.8)+path('M36 103h88m-66 10h44','none',c,1.4));
  define('rain',(c)=>drawing.cloud(c)+[40,62,84,106,128].map(x=>path(`m${x} 91-8 21`,'none',c,1.7)).join(''));
  define('cloud',(c)=>path('M35 78q-24-12-8-32 9-11 24-7 10-32 39-23 17 5 21 24 31-2 30 24-1 14-18 14Z','#3a454c',c,2));
  define('moon',(c)=>path('M102 18a48 48 0 1 0 25 77q-58 9-25-77Z','#5a5e5a',c,2)+littleStar(116,32,.7,INK)+littleStar(139,61,.45,c));
  define('sun',(c)=>circle(80,70,29,'#8d7a55',c)+rays(80,70,40,12,INK));
  define('fog',(c)=>path('M34 50q12-25 43-14 17-24 45 7','none',c,2)+[0,1,2,3,4].map(i=>path(`M${24+i%2*17} ${63+i*11}h${112-i%3*13}`,'none',INK,1.4)).join(''));
  define('breathe',(c)=>path('M22 46q51 18 88 0 25-13 18-26-7-12-20-2M22 71h90q25 0 23 15-1 19-23 13M22 96q28 19 50 7','none',c,2.1));
  define('hammock',(c)=>path('M26 17v107m108-107v107M28 48q52 93 104 0M28 48q52 56 104 0','none',c,2)+path('M33 55q47 73 94 0','#535d58','none'));
  define('hourglass',(c)=>path('M48 17h64M48 119h64M55 19q-4 35 25 49-29 17-25 49m50-98q4 35-25 49 29 17 25 49','none',c,2.3)+path('m62 42 18 18 18-18m-35 62 17-27 17 27Z','#927d59','none'));
  define('storm',(c)=>drawing.cloud(c)+path('m81 77-15 22h18l-9 25 28-34H84l12-13',c,'none'));
  define('clear',(c)=>`<g transform="translate(25 -12) scale(.8)">${drawing.sun(c)}</g>`+`<g transform="translate(-8 39) scale(.84)">${drawing.cloud(INK)}</g>`);
  define('balance',(c)=>path('M80 20v100m-35 0h70M30 45h100m-90 0L20 86h40Zm80 0-20 41h40Z','none',c,2)+circle(80,29,5,INK,'none'));
  define('candle',(c)=>rect(60,61,40,58,2,'#a49e8d',c)+path('M80 61V47m0-4q-25-13 0-35 25 22 0 35Z','#b19868',INK,1.5)+ellipse(80,61,20,6,'#d1c6ae',INK));
  define('tide sea',(c,s)=>[0,1,2,3].map(i=>path(`M17 ${43+i*20}q16-17 32 0t32 0t32 0t32 0`,'none',i===1?INK:c,s==='sea'?2:1.4)).join(''));
  define('constellation',(c)=>path('m32 93 24-61 37 25 34-31-14 79-57-73','none',c,1.2)+[[32,93],[56,32],[93,57],[127,26],[113,105]].map(([x,y],i)=>littleStar(x,y,i===1?.9:.55,INK)).join(''));
  define('stone',(c)=>ellipse(80,112,49,10,'#313c37',c)+path('M43 94q3-28 31-29 37-6 44 29Z','#586358',c)+path('M55 58q7-23 25-22 25 1 27 22Z','#757d68',INK)+ellipse(81,25,19,9,'#9b9c85',c));
  const window=(x,y,c)=>rect(x,y,25,36,1,'#8e795655',c)+path(`M${x+12.5} ${y}v36m-12.5-18h25`,'none',c,1.2);
  define('window',(c)=>rect(40,17,80,105,2,'#252e35',c)+window(48,25,c)+window(87,25,c)+window(48,72,c)+window(87,72,c)+path('M32 124h96','none',INK,3));
  define('balcony',(c)=>path('M37 111V25h86v86M27 94h106m-106 29h106','none',c,2)+window(48,31,c)+window(87,31,c)+Array.from({length:8},(_,i)=>path(`M${31+i*14} 95v28`,'none',INK,1.4)).join(''));
  define('street rainstreet',(c,s)=>path('M19 123V24l38 14v58m84 27V15l-43 24v57M57 96l-22 28m63-28 23 28M57 96h41','none',c,2)+[0,1,2].map(i=>path(`M29 ${41+i*21}v9m102 ${-10+i*21}v9`,'none','#bca77b',2)).join('')+(s==='rainstreet'?Array.from({length:9},(_,i)=>path(`m${24+i*14} 9-8 20`,'none',INK,.8)).join(''):path('M79 102v20','none',INK,1.5)));
  define('lamppost',(c)=>path('M80 122V44M59 44h42l-4-25H63ZM65 18l15-10 15 10M63 122h34','none',c,2.4)+path('M68 23h24l3 16H65Z','#c8ad6d55','none')+rays(80,33,37,8,INK));
  define('bridge',(c)=>path('M15 105h130M21 104V43m118 61V43M21 47q59 75 118 0','none',c,2.3)+Array.from({length:9},(_,i)=>{const x=27+i*13;return path(`M${x} ${47+Math.sin((i+1)/10*Math.PI)*37}v${58-Math.sin((i+1)/10*Math.PI)*37}`,'none',INK,1);}).join('')+path('M22 117h116','none',c,1.2));
  define('skyline',(c)=>path('M17 122V67h20V42h24v80-94h24V10h8v18h17v94-70h25v70h14','none',c,2)+lines(66,44,7,0,10,29,INK)+lines(22,80,3,0,12,12,c));
  define('door',(c)=>path('M43 124V16h76v108M51 124V27l48 12v85Z','#303b3f',c,2)+circle(88,82,3,INK,'none')+path('M38 124h88','none',INK,3));
  define('stairs',(c)=>path('M18 122V99h24V77h24V55h24V33h24V11h25M18 92l120-85','none',c,2.2)+path('m124 9 15-2-1 15','none',INK,2));
  define('rooftop',(c)=>path('M22 124V66h116v58M16 66l64-37 64 37M46 30V14h18v24','none',c,2)+window(66,77,c)+path('M23 114h114','none',INK,1)+circle(122,19,8,'none',c));
  define('taxi car',(c,s)=>path('M28 66 45 35h70l17 31v46H28Z','#35424a',c,2)+path('M36 64h88l-13-23H49ZM29 90h102','none',INK,1.3)+circle(46,113,9,'#252b31',INK)+circle(114,113,9,'#252b31',INK)+rect(34,74,20,8,2,c,'none')+rect(106,74,20,8,2,c,'none')+(s==='taxi'?rect(67,24,26,9,1,'#ad9869',INK):''));
  define('metro train',(c,s)=>rect(44,16,72,100,15,'#38434b',c)+rect(51,31,58,40,4,'#74868b',INK)+path('M80 32v39M57 123l-7 11m53-11 7 11M56 22h48','none',INK,1.5)+circle(59,93,6,c,'none')+circle(101,93,6,c,'none')+(s==='metro'?path('M17 100V52a63 63 0 0 1 126 0v48','none',c,1.4):path('M48 122h64','none',c,2)));
  define('cafe',(c)=>path('M27 122V44h106v78M24 44l11-23h90l11 23ZM33 45v14q8 14 16 0 8 14 16 0 8 14 16 0 8 14 16 0 8 14 16 0 8 14 16 0V45','none',c,2)+rect(39,78,37,34,1,'#7b785a55',INK)+rect(89,75,29,47,1,'#334347',c));
  define('neon',(c)=>path('M28 26v83h104V26M39 37h82v59H39Z','none',c,2)+path('m54 78 13-26 12 26 15-26 14 26','none','#d5b0a2',4)+path('M49 116h63','none',INK,1));
  define('clocktower',(c)=>path('M54 123V30l26-21 26 21v93M48 31h64M64 100h32','none',c,2)+circle(80,57,18,'#34444d',INK)+path('M80 43v15l10 7M67 109v14m26-14v14','none',INK,1.6));
  define('house homeheart',(c,s)=>path('m21 64 59-48 59 48M35 55v68h90V55M68 122V86h25v36','none',c,2.3)+rect(47,68,13,15,1,'#b6a06a55',INK)+(s==='homeheart'?heart(80,61,.38,INK):rect(102,68,13,15,1,'#b6a06a55',INK)));
  define('mountain peak',(c,s)=>path('M12 118 60 30l23 39 21-59 45 108Z','#334537',c,2)+path('m44 60 16-30 18 31-18-11-16 10m48-15 12-35 16 38-16-9-12 6','none',INK,1.3)+(s==='peak'?path('M104 10V0l19 6-19 6','none',c,2):path('M27 125h104','none',INK,1)));
  define('pine',(c)=>trees(80,24,1.1,c));
  define('forest',(c)=>trees(39,27,.9,c)+trees(83,7,1.25,INK)+trees(125,42,.78,c));
  define('river',(c)=>path('M20 46 49 20l24 29 25-33 42 35M76 51q-46 19 5 34t-13 41','none',c,2.1)+path('M87 53q-38 16 7 30t-8 43','none',INK,1.2));
  define('leaf',(c)=>path('M33 116Q14 31 126 17q20 109-93 99Z','#394e3b',c,2)+path('M28 125 117 28M49 96l-7-28m25 8-6-30m23 12 28-6M67 78l34-5','none',INK,1.4));
  define('tent',(c)=>path('M22 119 73 29l65 90ZM73 29l7 90m-27 0 24-47 29 47M73 29l9-16','none',c,2)+path('m26 116 47-83 4 36-28 47Z','#4c5945','none')+path('M15 122h130','none',INK,1.5));
  define('campfire',(c)=>path('m42 116 78-13m-78 0 78 13','none','#ad8762',8)+path('M78 98q-36-12-22-43 5 15 16 15-4-28 20-51-5 35 15 49 16 28-29 30Z','#976f47',c,1.5));
  define('moonlake',(c)=>circle(106,31,17,'#6b776d',c)+path('M16 89 44 42l31 47 26-33 44 33M24 102h111m-94 12h73m-51 11h28','none',INK,1.5));
  define('trail road',(c,s)=>path(s==='road'?'M31 124 65 20h30l34 104M80 27v17m0 13v17m0 13v23':'M20 118q91-24 38-48T103 17','none',c,2.7)+(s==='trail'?trees(121,43,.65,INK):path('M45 124 71 20m18 0 25 104','none',INK,1.2)));
  define('wildflower rose',(c,s)=>path('M80 123V65m0 31q-30 2-33-17 25-7 33 17m0 9q28-2 31-20-25-4-31 20','none','#9da887',1.8)+(s==='rose'?path('M55 39q7-25 25-13 23-15 29 12 6 34-29 40-32-8-25-39Zm12 3 16-6 11 14-14 12-13-20Z','#745051',c,2):[0,1,2,3,4,5].map(i=>{const a=i*Math.PI/3;return ellipse(80+Math.cos(a)*17,44+Math.sin(a)*17,11,14,'#7b7962',c);}).join('')+circle(80,44,10,'#b8a367',INK)));
  define('bird',(c)=>path('M22 84q27-39 59-14 27-59 57-34-20 3-20 20 12 15 25 13-33 26-60 11-27 23-61 4Z','#40544b',c,2)+path('M57 75q28 6 47-18','none',INK,1.3));
  define('waterfall',(c)=>path('M20 123V39h39V20h62v103M65 25v88m10-88v79m10-79v88m10-88v77m10-77v88M23 124q58-20 119 0','none',c,2)+path('M25 42h30v79','none',INK,1));
  define('compass',(c)=>circle(80,71,45,'#303d37',c)+circle(80,71,35,'none',INK,1)+path('m66 91 6-31 22-12-6 31Z','#a8b19b',c,2)+circle(80,71,4,c,'none')+path('M80 20v12m0 78v12M29 71h12m78 0h12','none',INK,1.5));
  define('mug',(c)=>mugs(51,56,c));
  define('espresso',(c)=>mugs(49,58,c)+path('M44 107q37 10 76 0','none',INK,1.8)+path('M64 60h21','none','#937453',3));
  define('teapot',(c)=>path('M45 62q34-25 62 0l6 45H39ZM42 68 21 53l9 31 13 4m66-23q39-15 23 20-10 14-21 7M42 112h76M60 45h33M75 45V33h10v12','#495b57',c,2)+path('M77 23q-7-8 0-17','none',INK,1.3));
  define('book study',(c,s)=>path('M22 32q27-13 58 3 31-16 58-3v82q-28-13-58 0-31-13-58 0ZM80 36v77','#39433c',c,2)+lines(33,48,5,0,11,35,INK)+lines(92,48,5,0,11,35,INK)+(s==='study'?path('m48 128 79-96','none',c,4):''));
  define('letter loveletter',(c,s)=>rect(21,39,118,78,3,'#494840',c)+path('m23 42 57 44 57-44m-114 73 43-40m72 40-43-40','none',INK,1.4)+(s==='loveletter'?heart(80,61,.39,c):lines(55,20,2,0,9,50,INK)));
  define('breakfast',(c)=>ellipse(81,79,55,34,'#474d43',c)+ellipse(81,79,43,23,'none',INK)+path('M19 30v88m-7-88v26h14V30m122 0v88','none',c,2)+path('M52 72q20-19 48 0l-3 16H55Z','#a68d64',INK,1.4));
  define('plant',(c)=>path('M57 89h46l-7 36H64ZM80 89V30m0 37q-30 2-33-21 31-6 33 21m0-15q27-1 31-26-28-3-31 26','#485d44',c,1.8));
  define('recordplayer',(c)=>rect(17,32,126,85,5,'#5c5042',c)+circle(72,75,35,'#252b2a',INK)+circle(72,75,11,'#a2845a',c)+circle(72,75,2,INK,'none')+path('M120 45v41l-17 12','none',INK,3)+circle(120,45,5,'#737e77',c));
  define('glasses',(c)=>circle(47,73,25,'none',c)+circle(113,73,25,'none',c)+path('M72 72q8-13 16 0M21 68l-9-15m126 15 9-15','none',INK,2.1));
  define('keys heartkey',(c,s)=>circle(61,47,24,'#585447',c)+circle(61,47,11,'none',INK)+path('m77 63 49 49-10 10-12-12 6-6-13-13-7 7-13-13 7-7','none',c,5)+(s==='heartkey'?heart(61,45,.38,INK):''));
  define('umbrella',(c)=>path('M20 65a60 60 0 0 1 120 0q-15-15-30 0-15-15-30 0-15-15-30 0-15-15-30 0Z','#5a625b',c,2)+path('M80 15v90q0 22-20 17-9-3-9-14M80 15Q47 31 50 64m30-49q33 16 30 49','none',INK,1.5));
  define('bicycle',(c)=>circle(39,92,27,'none',c)+circle(121,92,27,'none',c)+path('m39 92 27-46 26 46H39l15-32h51m-44-23h18m32-11h14l13 66M75 92l9 11m-15 0h20','none',INK,2));
  define('totebag',(c)=>path('M39 46h82l10 78H29Z','#555b4e',c,2)+path('M61 48V30a19 19 0 0 1 38 0v18M48 70h64','none',INK,2));
  define('armchair',(c)=>rect(41,32,78,71,12,'#5a6056',c)+rect(28,72,21,39,8,'#4a5148',INK)+rect(111,72,21,39,8,'#4a5148',INK)+rect(47,82,66,27,7,'#6f7462',c)+path('M40 112v14m80-14v14','none',INK,3));
  define('notebook planner checklist calendar',(c,s)=>rect(39,22,85,101,4,'#3f4a42',c)+path('M52 23v99','none',INK,1)+Array.from({length:6},(_,i)=>path(`M34 ${34+i*15}h11`,'none',INK,2)).join('')+(s==='calendar'?rect(61,35,51,28,1,'#7f8b75',INK)+Array.from({length:12},(_,i)=>rect(62+i%4*13,76+Math.floor(i/4)*13,6,6,0,c,'none')).join(''):s==='checklist'?Array.from({length:4},(_,i)=>path(`m61 ${43+i*20} 4 4 8-9m8 5h26`,'none',INK,1.4)).join(''):lines(63,43,s==='planner'?5:6,0,12,45,INK)));
  define('bread',(c)=>path('M24 85Q46 37 109 42q32 3 28 31-9 35-72 38-37 0-41-26Z','#947f56',c,2)+path('m46 66 18 18m1-33 17 20m6-25 16 20m4-18 13 17','none',INK,2));
  define('heart',(c)=>heart(80,68,1.55,c)+path('M46 110q34 10 68 0','none',INK,1));
  define('holdinghands',(c)=>path('m21 44 27-8 29 37 18-11 14-25 31 10-20 52-30 19-34-10-21-31Z','#685751',c,2)+path('m49 47 29 31 18-13m-21 16 17 18m-35-2 21 8m28-30-11 24','none',INK,1.5));
  define('rings',(c)=>circle(62,77,33,'none',c,4)+circle(103,77,33,'none',INK,3)+path('m47 35 16-18 16 18-16 19Z','#74645e',c,1.4));
  define('ribbon',(c)=>path('M79 59q-64-71-56-17 10 48 57 17 47-76 57-24 10 49-57 24ZM77 62l-21 66-10-21-22 8 41-60m19 8 20 65 10-21 23 8-41-58','none',c,2.2));
  define('twomoons',(c)=>`<g transform="translate(-20 5) scale(.82)">${drawing.moon(c)}</g><g transform="translate(49 30) scale(.72)">${drawing.moon(INK)}</g>`);
  define('twocups',(c)=>`<g transform="translate(-8 23) scale(.7)">${mugs(32,54,c)}</g><g transform="translate(50 23) scale(.7)">${mugs(40,54,INK)}</g>`+heart(80,32,.25,c));
  define('distance',(c)=>circle(31,72,10,'#665651',c)+circle(129,72,10,'#665651',c)+path('M43 72h74','none',INK,1.2)+heart(80,62,.47,c)+path('m45 101 35 16 35-16','none',c,1.3));
  define('embrace',(c)=>path('M28 110V66q0-22 18-29m86 73V66q0-22-18-29M29 82l37 21q14 6 18-5 2-8-9-14L54 71m78 11-34 21q-13 5-17-5','none',c,3)+circle(60,29,15,'none',INK)+circle(101,29,15,'none',INK));
  define('pressedflower',(c)=>rect(35,17,90,111,2,'#48413d',c)+`<g transform="translate(21 18) scale(.75)">${drawing.wildflower(INK,'wildflower')}</g>`+path('M43 25h10m54 94h10','none',c,1));
  define('heartwave',(c)=>heart(80,70,1.5,c)+path('M24 72h30l7-16 14 31 12-39 12 24h36','none',INK,2));
  define('shelter',(c)=>path('M18 66 80 17l62 49M34 58v65h92V58','none',c,2.3)+heart(80,83,.75,INK));
  define('infinity',(c)=>path('M80 72q-61-69-61 0t61 0q61-69 61 0t-61 0Z','none',c,3)+path('M40 111h80','none',INK,1));
  define('laptop',(c)=>rect(32,27,96,69,4,'#343f3b',c)+rect(39,34,82,53,1,'#63726a',INK)+path('M32 97 18 116h124l-14-19m-59 9h22','none',INK,2));
  define('practice',(c)=>`<g transform="translate(8 -2) rotate(13 80 75) scale(.85)">${drawing.panduri(c,'panduri')}</g>`+path('M18 112h29m-29 8h37m62-76 12-10 8 14','none',INK,1.3));
  define('timer watch alarmclock',(c,s)=>circle(80,73,39,'#39473f',c)+circle(80,73,31,'none',INK,1)+path('M80 50v24l17 13','none',INK,2)+(s==='timer'?path('M68 20h24m-12 0v14m31 5 7-8','none',c,3):s==='watch'?path('M60 36V10h40v26m-40 73v23h40v-23','none',c,3):path('M42 39q-18-15 2-24 13-4 20 9m32 0q8-13 21-8 20 9 2 24M52 111l-7 14m63-14 7 14','none',c,2)));
  define('bulb',(c)=>path('M66 93q-35-37-10-63 25-22 49 3 21 27-12 60v18H66Zm3 27h22M70 53q10 18 20 0M80 63v30','#64684b',c,2)+rays(80,48,52,8,INK));
  define('target',(c)=>[46,31,16].map(r=>circle(80,75,r,'none',c,1.6)).join('')+path('M80 75 129 26m-2-14 2 14 14 2','none',INK,3));
  define('progress',(c)=>path('M24 26v94h117M38 100l25-25 21 10 44-52m-21 2 21-2-2 21','none',c,2.5)+[0,1,2,3].map(i=>rect(39+i*24,110-(i+1)*15,12,(i+1)*15,1,'#57684f','none')).join(''));
  define('offline',(c)=>path('M26 52q54-52 108 0M44 73q36-36 72 0M62 94q18-18 36 0M24 22l112 100','none',c,3)+circle(80,114,4,INK,'none'));
  define('busy',(c)=>rect(35,19,90,108,4,'#39463e',c)+path('M52 40h56m-56 14h56m-56 14h56M49 87h62m-62 14h62m-62 14h62','none',INK,1.4)+path('M65 15V7h31v8','none',c,3));
  define('pencil',(c)=>path('m27 119 9-27 79-77 18 18-79 77Z','#7d8062',c,2)+path('m37 92 18 18m54-89 18 18M27 119l20-6','none',INK,1.5));
  define('finish',(c)=>path('M25 127V20h110v107M30 42h100','none',c,2.5)+Array.from({length:18},(_,i)=>rect(32+i%9*11,22+Math.floor(i/9)*10,10,9,0,i%2?'#434c3e':INK,'none')).join('')+path('M80 60v38m-17-15 17 17 17-17','none',INK,3));
  define('plane',(c)=>path('m14 66 52 1 14-52h15l-7 52 44 1 11 18-55-5-7 30 16 10v9l-26-7-26 7v-9l16-10 4-30-55 5Z','#455963',c,2));
  define('suitcase backpack',(c,s)=>s==='suitcase'?rect(39,32,83,83,7,'#435159',c)+path('M64 32V15h32v17m-41 83v11m49-11v11M62 43v61m37-61v61','none',INK,2):path('M41 122V48q0-27 39-27t39 27v74ZM61 21V9h38v12','#43535b',c,2)+rect(55,71,50,38,8,'#3a454b',INK)+path('M59 47h42m-59 12H29v49h12m77-49h13v49h-13','none',c,1.7));
  define('map',(c)=>path('m18 29 40-13 44 15 40-13v99l-40 14-44-15-40 13Zm40-13v99m44-84v99','#3b4e51',c,2)+path('m28 89 18-15 23 11 18-28 36 6','none',INK,2)+circle(123,63,4,c,'none'));
  define('boat',(c)=>path('M20 86h120l-21 31H42Zm60-5V15l-45 61h45m7-61 37 61H87Z','#46585c',c,2)+path('M19 126q16-10 32 0t32 0t32 0t32 0','none',INK,1.4));
  define('signpost',(c)=>path('M80 14v113M34 29h78l24 16-24 16H34ZM119 75H42L20 91l22 16h77Z','#3d4b4e',c,2)+path('M48 46h59m-48 46h44','none',INK,1.2));
  define('passport',(c)=>rect(42,17,77,110,5,'#3c5056',c)+circle(80,70,24,'none',INK)+ellipse(80,70,10,24,'none',c)+path('M56 70h48M65 52h30m-30 36h30m-30 23h30','none',INK,1.2));
  define('boots',(c)=>path('M27 25h42v52l23 15v23H22V86l5-9Zm58-6h42v54l18 14v24h-37M25 106h63','none',c,2.3)+lines(39,46,4,0,10,20,INK)+lines(97,40,4,0,10,20,INK));
  define('camera filmcamera',(c,s)=>path('M21 46h30l10-18h38l10 18h30v68H21Z','#3a464a',c,2)+circle(80,80,29,'#28363b',INK)+circle(80,80,19,'none',c)+circle(80,80,7,'#6d858c',INK,1)+rect(115,54,14,9,1,c,'none')+(s==='filmcamera'?rect(25,25,23,13,2,'#7c827c',INK):''));
  define('mappin meeting',(c,s)=>path('M80 124q-45-50-42-75a42 42 0 0 1 84 0q3 25-42 75Z','#425660',c,2)+circle(80,52,16,'none',INK)+(s==='meeting'?path('M16 117h28m72 0h28M29 102l15 15-15 15m102-30-15 15 15 15','none',INK,1.6):ellipse(80,127,30,5,'none',c)));
  define('horizon',(c)=>path('M15 90h130M42 89a38 38 0 0 1 76 0M25 113l36-14m74 14-36-14M80 98v28','none',c,2)+rays(80,84,48,7,INK));
  define('trophy',(c)=>path('M53 20h54v29q0 38-27 38T53 49Zm27 67v28m-20 6h40M52 30H32q-4 33 27 37m49-37h20q4 33-27 37','#746749',c,2)+path('M67 28v24q0 15 13 19','none',INK,1.2));
  define('cake',(c)=>rect(30,75,100,47,4,'#6a5a4d',c)+rect(45,51,70,28,4,'#8b7b61',INK)+path('M80 51V27m-19 23V31m38 19V31M33 89q10 18 20 0 10 18 20 0 10 18 20 0 10 18 20 0 10 18 16 0','none',c,2)+[61,80,99].map((x,i)=>path(`M${x} ${20-i%2*4}q-7-6 0-12 7 6 0 12Z`,'#ba9e62','none')).join(''));
  define('gift',(c)=>rect(34,56,92,66,3,'#5c5147',c)+rect(28,43,104,20,2,'#776448',INK)+path('M80 44v78M80 43q-54-39-43-15 10 22 43 15 54-39 43-15-10 22-43 15','none',c,2));
  define('bouquet',(c)=>path('m43 70 37 58 37-58-37 16Z','#4b5745',c,2)+[[-26,-3],[0,-16],[27,-1],[2,14]].map(([x,y])=>`<g transform="translate(${x+21} ${y+17}) scale(.72)">${drawing.wildflower(c,'wildflower')}</g>`).join('')+path('m63 105 34 8m-17-8-13 14m13-14 11 16','none',INK,2));
  define('toast twoglasses',(c,s)=>path('M40 18h36v32q-2 22-18 22T40 50Zm18 54v42m-14 7h28M91 18h36v32q-2 22-18 22T91 50Zm18 54v42m-14 7h28','none',c,2)+path('M42 43h32m19 0h32','none',INK,1.3)+(s==='toast'?littleStar(83,19,.7,INK):heart(83,87,.3,INK)));
  define('medal',(c)=>path('M48 11h22l10 36 10-36h22L94 65H66Z','#6f624d',c,2)+circle(80,88,31,'#7e6c49',INK)+littleStar(80,88,1.8,c));
  define('confetti fireworks spark',(c,s)=>Array.from({length:s==='fireworks'?20:12},(_,i)=>{const a=i*Math.PI*2/(s==='fireworks'?20:12),r=i%2?24:44;return path(`M${80+Math.cos(a)*r} ${70+Math.sin(a)*r}l${Math.cos(a)*15} ${Math.sin(a)*15}`,'none',i%3?c:INK,i%4?1.5:3);}).join('')+(s==='confetti'?path('m49 88-18 40 43-15Z','#6d624d',c,2):littleStar(80,70,s==='spark'?1.5:.8,INK)));
  define('crown',(c)=>path('M39 99 24 38l35 24 21-43 21 43 35-24-15 61ZM40 111h80','#736548',c,2)+circle(80,79,6,'none',INK)+[24,80,136].map((x,i)=>circle(x,i===1?15:34,4,INK,'none')).join(''));
  define('star',(c)=>path('m80 14 18 35 39 6-29 29 6 40-34-18-34 18 6-40-29-29 39-6Z','#74694e',c,2)+path('M80 27v67m-45-34 45 34 45-34','none',INK,1));
  define('balloons',(c)=>ellipse(57,50,25,33,'#786753',c)+ellipse(105,43,23,31,'#575d54',INK)+path('m57 84-5 7h10ZM57 91q-17 15 10 35m38-52-5 7h10Zm0 8q13 21-11 45','none',c,1.5));
  define('laurel',(c)=>path('M74 121Q17 99 34 28m52 93q57-22 40-93','none',c,2)+Array.from({length:6},(_,i)=>{const y=40+i*13,x=31+(i/5)**2*30;return ellipse(x,y,9,4,'#6d7656',c)+ellipse(160-x,y,9,4,'#6d7656',c);}).join('')+littleStar(80,61,2,INK));
  define('invitation',(c)=>rect(37,17,86,111,3,'#4c4b41',c)+rect(44,24,72,96,0,'none',INK)+heart(80,55,.5,c)+lines(59,91,2,0,10,42,INK));
  define('recordaward',(c)=>rect(24,19,112,109,2,'#514b3e',c)+circle(80,65,35,'#a58c57',INK)+circle(80,65,12,'#45463d',c)+circle(80,65,3,INK,'none')+rect(52,108,56,10,0,'#7c755d',INK));
  define('vinyl',(c)=>circle(80,70,53,'#2a2f2d',c)+[43,38,33].map(r=>circle(80,70,r,'none','#747b70',.65)).join('')+circle(80,70,18,'#877557',INK)+circle(80,70,3,INK,'none')+path('m46 35 10 10m-19-1 10 10m58 43 9 9','none',INK,1.2));
  define('cassette',(c)=>rect(21,31,118,82,5,'#554f41',c)+rect(29,40,102,36,2,'#bab19a',INK)+circle(56,59,11,'#3c4038',c)+circle(105,59,11,'#3c4038',c)+path('M67 59h27M43 105l8-21h59l8 21Z','none',INK,1.3));
  define('radio',(c)=>rect(24,40,112,78,7,'#64543f',c)+path('M31 40 99 10M39 55h82','none',INK,2)+rect(36,69,66,35,3,'#343b34',c)+lines(42,77,4,0,7,53,'#a1a894')+circle(119,87,10,'#313b34',INK));
  define('film',(c)=>rect(19,26,122,94,2,'#343a36',c)+rect(40,43,80,60,0,'#6b7564',INK)+Array.from({length:14},(_,i)=>rect(25+i%7*17,i<7?31:109,7,6,0,INK,'none')).join('')+path('m50 91 22-29 16 17 12-15 12 27','none',c,1.3));
  define('typewriter',(c)=>rect(37,41,86,48,3,'#3d413b',c)+rect(50,14,60,47,1,'#c1b8a3',INK)+path('M48 84 27 119h106l-21-35Z','#5f594a',c,2)+Array.from({length:18},(_,i)=>circle(45+i%6*14,95+Math.floor(i/6)*8,2.5,INK,'none')).join('')+lines(58,26,3,0,9,43,'#5a5b50'));
  define('reeltape',(c)=>rect(25,19,110,108,6,'#514f43',c)+[53,108].map(x=>circle(x,53,23,'#9a9684',INK)+circle(x,53,5,'#393e35',c)+[0,1,2].map(i=>{const a=i*Math.PI*2/3;return circle(x+Math.cos(a)*13,53+Math.sin(a)*13,5,'#454a40','none');}).join('')).join('')+path('m52 77 15 22h29l13-22M42 113h73','none',INK,2));
  define('telephone',(c)=>path('M24 116 36 72h88l12 44ZM40 55q40-35 80 0l16-20q-56-40-112 0Z','#5f5747',c,2)+circle(80,94,19,'#353e36',INK)+Array.from({length:10},(_,i)=>{const a=i*Math.PI/5;return circle(80+Math.cos(a)*13,94+Math.sin(a)*13,2,c,'none');}).join('')+path('M123 56q25 10 17 37','none',INK,2));
  define('polaroid',(c)=>`<g transform="rotate(-8 80 70)">${rect(34,18,92,113,2,'#c7bfaa',c)+rect(43,27,74,69,0,'#4b5c57',INK)+path('m48 86 20-35 19 24 10-13 17 24','none',c,1.5)}</g>`);
  define('jukebox',(c)=>path('M39 124V55a41 41 0 0 1 82 0v69Z','#5b5746',c,2)+path('M49 115V55a31 31 0 0 1 62 0v60','none',INK,2)+rect(57,67,46,37,5,'#303d37',c)+lines(64,77,3,0,9,32,INK)+path('M53 55h54M80 25v28','none',c,2));
  define('piano',(c)=>rect(19,35,122,79,5,'#343831',c)+Array.from({length:10},(_,i)=>rect(24+i*11,56,11,51,0,'#d4cbb7','#4c4d40')).join('')+Array.from({length:9},(_,i)=>i%7===2||i%7===6?'':rect(31+i*11,56,7,28,0,'#29312b','none')).join(''));
  define('recordbox',(c)=>path('M28 58h104v66H28ZM39 58V31h85v27M49 31V16h64v15','#5b5443',c,2)+path('M39 69h83v44H39Z','none',INK,1.2)+circle(80,91,15,'none',c)+circle(80,91,4,INK,'none'));
  pack('sculpt','ფორმა · 3D','Sculpted · 3D','#b4a0ff','sculpt',[
    ['heart','გულით შენთან','With love','heart'],['star','შენი ვარსკვლავი','Your star','star'],['bolt','ენერგია','Energy','spark'],['check','მზადაა','All set','check'],
    ['moon','მშვიდი ღამე','A peaceful night','moon'],['cloud','მსუბუქად','Take it easy','cloud'],['flower','შენთვის','For you','wildflower'],['gift','სიურპრიზი','A surprise','gift'],
    ['panduri','ცოცხალი ჰანგი','A living melody','panduri'],['headphones','ჩემს სამყაროში','In my world','headphones'],['mic','შენი ხმა','Your voice','mic'],['vinyl','ჩემი ჩანაწერი','My record','vinyl'],
    ['cassette','კარგი მოგონება','A good memory','cassette'],['piano','პატარა მელოდია','A little melody','piano'],['metronome','საკუთარი რიტმი','My own rhythm','metronome'],['equalizer','ვიბრაცია','Vibration','equalizer']
  ]);
  pack('session','ერთად დავუკრათ','Play together','#d7a075','wood',[
    ['warmup','გავხურდეთ','Time to warm up','warmup'],
    ['take','კარგი ჩანაწერია','Nice take','goodtake'],
    ['again','კიდევ ერთხელ დავუკრათ','Play it again','replaytake'],
    ['three','სამივე სიმი აწყობილია','All three strings in tune','threestrings'],
    ['duet','ერთად დავუკრათ','Let’s play together','twopanduri'],
    ['ready','მზად ვარ დასაკრავად','Ready to play','readytoplay']
  ]);
  PD.i18n.add(labels);
  define('warmup', c => drawing.panduri(c) + path('M29 66H19m13-13-9-5m107 18h10m-12-13 9-5','none',c,3));
  define('goodtake', c => drawing.record(c) + path('m61 76 13 13 27-31','none',INK,7));
  define('replaytake', c => `<g transform="translate(50 35) scale(.6)">${drawing.panduri(c)}</g>` + path('M45 47a47 47 0 1 0 37-15M45 47l1-18m-1 18 20-1','none',c,3.5));
  define('threestrings', c => drawing.strings(c) + path('m97 48 9 10 17-20','none',c,4));
  define('twopanduri', c => `<g transform="translate(-9 27) rotate(-25 55 65) scale(.7)">${drawing.panduri(c)}</g><g transform="translate(60 13) rotate(17 53 70) scale(.7)">${drawing.panduri(c)}</g>`);
  define('readytoplay', c => drawing.panduri(c) + path('m110 57 8 8 15-17','none',c,3));
  const LEGACY={panduri:'instruments-panduri',doli:'instruments-doli',garmoni:'instruments-garmoni',duduki:'instruments-duduki',salamuri:'instruments-salamuri',ensemble:'instruments-ensemble',
    love:'close-heart',bravo:'words-bravo',play:'sound-play',again:'sound-loop',string:'instruments-strings',fire:'nature-fire',hi:'words-hello',thanks:'replies-thanks',tempo:'sound-tempo',night:'words-night',think:'focus-idea',
    'doli-fire':'instruments-diplipito','garmoni-dance':'stage-festival','salamuri-song':'sound-harmony',coffee:'daily-espresso',party:'celebrate-confetti',rain:'moods-rain',sunny:'moods-dawn',wow:'replies-great',sad:'moods-storm',okay:'replies-okay',wait:'replies-wait',miss:'words-miss',listen:'replies-listening',practice:'focus-practice',trophy:'celebrate-trophy',encore:'stage-encore',duet:'stage-duet',metronome:'sound-tempo',headphones:'studio-headphones'};
  const legacyLabels=[
    ['panduri','ფანდური','Fanduri'],['doli','დოლი','Doli'],['garmoni','გარმონი','Garmoni'],['duduki','დუდუკი','Duduki'],['salamuri','სალამური','Salamuri'],['ensemble','ერთად ვუკრავთ','Playing together'],
    ['love','მიყვარს','Love it'],['bravo','ყოჩაღ!','Well done!'],['play','ვუკრავ','Playing'],['again','კიდევ ერთხელ!','Once more!'],['string','სიმი გამიწყდა','A string broke'],['fire','ცეცხლი!','Fire!'],['hi','გამარჯობა!','Hello!'],['thanks','მადლობა','Thank you'],['tempo','ტემპი!','Tempo!'],['night','ძილი ნებისა','Good night'],['think','როგორ?','How?'],
    ['doli-fire','დოლის რიტმი','Doli rhythm'],['garmoni-dance','გარმონის ცეკვა','Garmoni dance'],['salamuri-song','სალამურის ჰანგი','Salamuri tune'],['coffee','ყავა?','Coffee?'],['party','ვიზეიმოთ!','Let’s celebrate!'],['rain','წვიმიანი დღე','Rainy day'],['sunny','დილა მშვიდობისა','Good morning'],['wow','ვაუ!','Wow!'],['sad','მეწყინა','Feeling blue'],['okay','კარგი!','Okay!'],['wait','ერთი წუთი','One moment'],['miss','მენატრები','Miss you'],['listen','გისმენ','Listening'],['practice','ვვარჯიშობ','Practising'],['trophy','გამოგვივიდა!','We did it!'],['encore','ბისი!','Encore!'],['duet','დუეტი','Duet'],['metronome','რიტმში','In rhythm'],['headphones','ჩემი მუსიკა','My music']
  ];
  PD.i18n.add(Object.fromEntries(legacyLabels.map(([id,ka,en])=>['sp.legacy.'+id,[ka,en]])));
  const resolve=id=>byId.get(id)||(byId.has(LEGACY[id])?{...byId.get(LEGACY[id]),key:'sp.legacy.'+id}:null);
  const STICKERS=catalog.map(s=>s.id);
  function splitText(text,max){
    const out=[];let line='';for(const word of text.split(/\s+/)){if(line&&[...line+' '+word].length>max){out.push(line);line=word;}else line+=(line?' ':'')+word;}if(line)out.push(line);return out;
  }
  let serial=0,paused=PD.store?.get('sp.paused',false)===true;
  const reduced=()=>paused||document.documentElement.classList.contains('rm')||(typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches);
  const motionGroups={spin:'vinyl loop repeat encore',pendulum:'metronome',beat:'heart love pulse bass speaker stereo headphones drum kettledrums',wave:'wavehand palm claphands applause salute',sway:'wildflower flower leaf branch pine palm tree reed bouquet hammock',rain:'rain rainstreet storm',steam:'espresso coffee cup tea candle fire',signal:'wave rhythm quiet loud equalizer meters harmony treble strings tuningfork',float:'cloud moon sun sunrise star constellation balloons plane boat',type:'',tilt:'panduri chonguri practice accordion harp bowed instrumentcase guitar violin cello mandolin trumpet saxophone'};
  const motionFor=item=>!item.symbol?'type':Object.keys(motionGroups).find(k=>motionGroups[k].split(' ').includes(item.symbol))||'breathe';
  function tint(hex,toward,amount){const c=hex.replace('#',''),v=toward.replace('#','');if(c.length!==6)return hex;return '#'+[0,2,4].map(i=>Math.round(parseInt(c.slice(i,i+2),16)*(1-amount)+parseInt(v.slice(i,i+2),16)*amount).toString(16).padStart(2,'0')).join('');}
  function typographyMotion(item){
    const text=PD.i18n.t(item.key),parts=splitText(text,12),font=Math.min(31,130/(Math.max(5,...parts.map(x=>[...x].length))*.66),parts.length>2?23:31),line=font*1.32,c=item.color;
    return `<g class="sp-type-card">${rect(11,25,138,104,22,tint(c,'#172138',.7),c,2.2)}${path('M30 42h24m55 70h20','none',c,3)}${parts.map((v,i)=>`<text class="sp-letter-line" style="--line:${i}" x="80" y="${80-(parts.length-1)*line/2+i*line}" dominant-baseline="middle" text-anchor="middle" fill="#fff7ed" font-size="${font}" font-weight="800" font-family="var(--f-ui,sans-serif)">${esc(v)}</text>`).join('')}</g>`;
  }
  function svg(id){
    const item=resolve(id);if(!item)return '<svg viewBox="0 0 160 160" aria-hidden="true">'+path('M40 40h80v80H40Zm10 65 23-23 15 14 14-19 18 28','none',METAL,2)+'</svg>';
    const c=item.color,uid='sp'+(++serial),motion=motionFor(item);
    let art=item.symbol?(drawing[item.symbol]||drawing.instrumentcase)(c,item.symbol):typographyMotion(item);
    if(item.symbol==='metronome')art=path('M59 18h42l25 105H34Z','#4d4a40',c,2)+path('M66 29h28l17 76H49Z','#a49778',INK,1)+`<g class="sp-needle">${path('M80 109V33','none',INK,3)}${rect(75,46,10,16,2,c,INK)}</g>`+circle(80,109,4,c,'none');
    // Three tonal materials keep the original silhouettes legible at chat size.
    art=art.replace(/fill="(#[0-9a-fA-F]{6})"/g,(all,color)=>{if(color.toLowerCase()==='#fff7ed')return all;if(color.toLowerCase()===INK.toLowerCase())return 'fill="#fff3db"';if(color===c)return `fill="url(#${uid}color)"`;return `fill="${tint(c,'#18223a',.58)}"`;}).replace(/stroke-width="(1(?:\.[0-5])?)"/g,'stroke-width="1.8"');
    let effects='';
    if(motion==='steam')effects=[0,1,2].map(i=>`<path class="sp-steam" style="--i:${i}" d="M${62+i*18} 38q-9-10 0-21" stroke="${c}" stroke-width="2.2" stroke-linecap="round"/>`).join('');
    if(motion==='rain')effects=[0,1,2,3,4].map(i=>`<path class="sp-drop" style="--i:${i}" d="m${34+i*23} ${78+i%2*8}-4 10" stroke="${c}" stroke-width="3" stroke-linecap="round"/>`).join('');
    if(['beat','tilt','signal'].includes(motion))effects=[0,1,2].map(i=>`<path class="sp-resonance" style="--i:${i}" d="M${130+i*5} ${53-i*3}q9 16 0 32" stroke="${c}" stroke-width="1.8" stroke-linecap="round"/>`).join('');
    if(motion==='float'||motion==='breathe')effects=`<g class="sp-spark" fill="${c}">${littleStar(132,28,.45,c)}${circle(27,50,2,c,'none')}</g>`;
    const defs=`<defs><linearGradient id="${uid}color" x1=".1" y1="0" x2=".9" y2="1" gradientUnits="objectBoundingBox"><stop stop-color="${tint(c,'#ffffff',.26)}"/><stop offset=".5" stop-color="${c}"/><stop offset="1" stop-color="${tint(c,'#273453',.3)}"/></linearGradient><filter id="${uid}edge" x="-25%" y="-25%" width="150%" height="150%"><feDropShadow dx="0" dy="3" stdDeviation="2" flood-color="#090b18" flood-opacity=".3"/></filter></defs>`;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" fill="none" aria-hidden="true" class="sp-vector sp-motion-${motion}">${defs}<ellipse class="sp-ground" cx="80" cy="145" rx="37" ry="4" fill="${c}" opacity=".11"/><g transform="translate(8 5) scale(.9)"><g class="sp-moving" filter="url(#${uid}edge)">${art}</g>${effects}</g></svg>`;
  }
  function sculpture(item){
    if(item?.pack!=='sculpt')return null;
    return PD.assets?.stickerMotion?.[item.id.slice(7)]||null;
  }
  const instrumentMotion = {
    chord: 'panduri chonguri changi chuniri guitar violin cello mandolin',
    strike: 'doli daira diplipito drumkit',
    breath: 'salamuri duduki larchemi chiboni trumpet saxophone',
    bellows: 'garmoni',
    keys: 'piano'
  };
  function artMarkup(id){
    const item=resolve(id);
    if(item&&(item.style==='instrument'||item.pack==='instruments')){
      const slug=item.id.slice(item.pack.length+1),instrument=PD.assets?.stickerInstruments?.[slug];
      if(instrument){
        const motion=Object.keys(instrumentMotion).find(kind=>instrumentMotion[kind].split(' ').includes(slug));
        return `<img class="stk-instrument${motion?' sp-'+motion:''}" alt="" src="${esc(instrument)}" width="256" height="256" loading="lazy" decoding="async" draggable="false">`;
      }
    }
    const asset=sculpture(item);
    return asset?`<picture class="sp-sculpture"><source media="(prefers-reduced-motion: reduce)" srcset="${esc(asset.still)}"><img alt="" src="${esc(reduced()?asset.still:asset.motion)}" data-motion="${esc(asset.motion)}" data-still="${esc(asset.still)}" width="256" height="256" loading="lazy" decoding="async"></picture>`:svg(id);
  }
  function applyMotion(){document.querySelectorAll('.sp-sticker,.sp-picker,.sp-pack-cover').forEach(e=>e.classList.toggle('sp-paused',paused));document.querySelectorAll('.sp-sculpture img').forEach(img=>img.src=reduced()?img.dataset.still:img.dataset.motion);}
  if(typeof document!=='undefined'){
    if(typeof MutationObserver==='function')new MutationObserver(applyMotion).observe(document.documentElement,{attributes:true,attributeFilter:['class']});
    if(typeof matchMedia==='function')matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',applyMotion);
  }
  function render(id,small){
    const item=resolve(id),name=item?PD.i18n.t(item.key):PD.i18n.t('sp.unavailable');
    const el=h('span',{class:'ck-st sp-sticker ck-st--'+(item?id:'unknown')+(small?' small':'')+(paused?' sp-paused':''),role:small?'img':'button','aria-label':name,...(small?{}:{tabindex:'0',title:PD.i18n.t('sp.preview')})},[h('span',{class:'ck-art',html:artMarkup(id)}),h('b',{text:name})]);
    if(!small){const play=()=>{if(reduced())return;const image=el.querySelector('img[data-motion]');if(image){image.src=image.dataset.motion;}else el.querySelectorAll('.stk-instrument,.sp-moving,.sp-needle,.sp-letter-line,.sp-steam,.sp-drop,.sp-resonance,.sp-spark').forEach(node=>node.getAnimations().forEach(a=>{a.currentTime=0;}));};el.onclick=play;el.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();e.stopPropagation();play();}};}
    return el;
  }
  function picker(onPick){
    let active='packs',limit=48;
    const stored=k=>{const list=PD.store.get('sp.'+k,[]);return Array.isArray(list)?[...new Set(list.map(x=>resolve(x)?.id).filter(Boolean))]:[];};
    let favorites=stored('favorites'),recent=stored('recent');
    const motion=h('button',{type:'button',class:'sp-motion-toggle','aria-label':PD.i18n.t(paused?'sp.motionOn':'sp.motionOff'),'aria-pressed':String(!paused),text:paused?'▶':'Ⅱ',onclick:()=>{paused=!paused;PD.store.set('sp.paused',paused);motion.textContent=paused?'▶':'Ⅱ';motion.setAttribute('aria-pressed',String(!paused));motion.setAttribute('aria-label',PD.i18n.t(paused?'sp.motionOn':'sp.motionOff'));applyMotion();}});
    const search=h('input',{type:'search',class:'input sp-search',placeholder:PD.i18n.t('sp.search'),'aria-label':PD.i18n.t('sp.search')});
    const rail=h('div',{class:'sp-rail',role:'tablist','aria-label':PD.i18n.t('sp.title')});
    const heading=h('div',{class:'sp-section-head'}),content=h('div',{class:'sp-content'}),more=h('button',{type:'button',class:'btn small sp-more',hidden:true,onclick:()=>{limit+=48;paint();}});
    const box=h('div',{class:'sp-picker'},[h('div',{class:'sp-search-row'},[search,motion]),rail,heading,content,more]);
    function choose(id){active=id;limit=48;search.value='';paint();content.scrollTop=0;}
    function paintRail(){
      const list=[['packs','sp.title'],['recent','sp.recent'],['favorites','sp.favorites'],['all','sp.all']];
      const scroll=rail.scrollLeft;rail.replaceChildren(...list.map(([id,key])=>h('button',{type:'button',role:'tab','aria-selected':String(active===id),tabindex:active===id?'0':'-1',text:PD.i18n.t(key),onclick:()=>choose(id)})),...packs.map(p=>h('button',{type:'button',role:'tab','aria-selected':String(active===p.id),tabindex:active===p.id?'0':'-1',text:PD.i18n.t(p.key),onclick:()=>choose(p.id)})));rail.scrollLeft=scroll;
      const selected=rail.querySelector('[aria-selected=true]');if(selected){const left=selected.offsetLeft;if(left<rail.scrollLeft)rail.scrollLeft=left;else if(left+selected.offsetWidth>rail.scrollLeft+rail.clientWidth)rail.scrollLeft=left+selected.offsetWidth-rail.clientWidth;}
    }
    rail.addEventListener('keydown',e=>{if(!['ArrowRight','ArrowLeft','Home','End'].includes(e.key))return;const tabs=[...rail.querySelectorAll('[role=tab]')],at=tabs.indexOf(document.activeElement);if(at<0)return;e.preventDefault();const next=e.key==='Home'?0:e.key==='End'?tabs.length-1:(at+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;tabs[next].click();rail.querySelectorAll('[role=tab]')[next]?.focus();});
    function tile(item){
      const isFavorite=favorites.includes(item.id),pick=h('button',{type:'button',class:'ck-stb sp-pick','aria-label':PD.i18n.t(item.key),onclick:()=>{recent=[item.id,...recent.filter(x=>x!==item.id)].slice(0,40);PD.store.set('sp.recent',recent);onPick(item.id);}},[render(item.id,true)]);
      const fav=h('button',{type:'button',class:'sp-favorite'+(isFavorite?' on':''),'aria-label':PD.i18n.t(isFavorite?'sp.removeFavorite':'sp.addFavorite'),'aria-pressed':String(isFavorite),html:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9Z"/></svg>',onclick:()=>{favorites=isFavorite?favorites.filter(x=>x!==item.id):[...favorites,item.id];PD.store.set('sp.favorites',favorites);paint();(content.querySelector('[data-sticker="'+item.id+'"] .sp-favorite')||heading.querySelector('button'))?.focus();}});
      return h('div',{class:'sp-tile','data-sticker':item.id},[pick,fav]);
    }
    function paint(){
      paintRail();const q=search.value.trim().toLocaleLowerCase();heading.replaceChildren();content.replaceChildren();more.hidden=true;
      if(active==='packs'&&!q){
        heading.append(h('b',{text:PD.i18n.t('sp.title')}),h('small',{text:PD.i18n.t('sp.total',{p:packs.length,n:catalog.length})}));
        content.className='sp-content sp-pack-grid';
        packs.forEach(p=>{
          const theme=p.style==='instrument'?'sp.realistic':p.style==='sculpt'?'sp.motion3d':'sp.motion2d';
          content.append(h('button',{type:'button',class:'sp-pack-card'+(p.style==='instrument'?' sp-pack-instrument':''),'data-pack':p.id,'aria-label':PD.i18n.t(p.key)+' · '+PD.i18n.t('sp.count',{n:p.ids.length}),onclick:()=>choose(p.id)},[h('span',{class:'sp-pack-cover',html:artMarkup(p.ids[0])}),h('b',{text:PD.i18n.t(p.key)}),h('small',{text:PD.i18n.t(theme)+' · '+p.ids.length})]));
        });
        return;
      }
      const current=packs.find(p=>p.id===active),ids=active==='recent'?recent:active==='favorites'?favorites:current?.ids||STICKERS;
      let items=q?catalog.filter(item=>[PD.i18n.t(item.key),labels[item.key][0],labels[item.key][1],PD.i18n.t(packs.find(p=>p.id===item.pack).key),item.id].some(value=>value.toLocaleLowerCase().includes(q))):ids.map(id=>byId.get(id));
      const back=h('button',{type:'button',class:'sp-back','aria-label':PD.i18n.t('sp.back'),text:'‹',onclick:()=>choose('packs')});
      heading.append(back,h('b',{text:q?PD.i18n.t('sp.search'):current?PD.i18n.t(current.key):PD.i18n.t('sp.'+(active==='all'?'all':active))}),h('small',{text:PD.i18n.t('sp.count',{n:items.length})}));
      content.className='sp-content ck-sts sp-sticker-grid';content.append(...items.slice(0,limit).map(tile));
      if(!items.length)content.append(h('p',{class:'sp-empty',text:PD.i18n.t(q?'sp.empty':active==='recent'?'sp.noRecent':active==='favorites'?'sp.noFavorites':'sp.empty')}));
      more.hidden=items.length<=limit;more.textContent=PD.i18n.t('sp.more',{n:Math.min(48,items.length-limit)});
    }
    search.oninput=()=>{limit=48;paint();content.scrollTop=0;};paint();if(paused)box.classList.add('sp-paused');return box;
  }
  return {packs,catalog,STICKERS,LEGACY,resolve,svg,render,picker,motionFor,artMarkup};
})();
