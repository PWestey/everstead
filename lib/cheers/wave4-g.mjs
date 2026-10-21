// Cheers (task-completion pop-ups), fourth wave part G. See docs/WRITING-BRIEF.md, "Cheers".
// cheers: after a habit in her life area. codex: lead-in to one of his own Codex notes. ack: reply when he commits.
// done: when every daily is finished. M = {open:[1-2 lines], opts:[{t:'player reply', r:['her answer']} x2]}.
// Adult alternate-universe Family romance; see docs/WRITING-BRIEF.md.

/** @type {Record<string,{cheers:any[],codex:string,ack:string,done:any}>} */
export const CHEERS={
 // ---------------- Work ----------------
 jessica:{
  cheers:[
   {open:['You did the ugly task first. Before email. Before coffee, even. Who are you? I like competence. Yours is becoming a problem for my concentration.'],opts:[
    {t:'Next case.',r:['Ha. Okay, partner. Next case. I’ll pour.']},
    {t:'Coffee was right after.',r:['Still counts. Mine had whiskey in it, so you’re ahead.']}]},
   {open:['* Jessica tosses a closed file onto the crate.','You hit the deadline. Not the extended one. The real one. Come have a drink with me. That’s personal, not a retainer.'],opts:[
    {t:'Tomorrow too.',r:['Don’t jinx it. But yeah. Tomorrow too. I’ll be watching.']},
    {t:'I barely made it.',r:['Barely is a pass. Ask my landlord.']}]},
   {open:['You said no to a meeting that didn’t need you. Out loud. To a human. Proud of you. Good. Say yes to dinner with me, if you want. I do.'],opts:[
    {t:'I’ll guard my time.',r:['Good. Your time’s the only thing nobody can repo.']},
    {t:'It was terrifying.',r:['Everything worth doing is. I once said no to a guy who could control minds. You said no to Gary.']}]},
   {open:['Two hours of real work, phone face down. I didn’t think you had it in you. I was wrong. Don’t tell anyone. Now close it. I’d rather have your attention for ten minutes.'],opts:[
    {t:'Count me in again.',r:['Count you in. Same desk, same time. I’ll bring the bad coffee.']},
    {t:'My eyes are crossing.',r:['Rest ’em. Then back at it. That’s literally my whole business plan.']}]}],
  codex:'Found this in your file. You wrote it. Read it like it’s evidence.',
  ack:'Case closed. Nice work, detective.',
  done:{open:['Office is closed. I want to kiss you. I’m trying this thing where I say it before I make a joke.'],opts:[
   {t:'Same again tomorrow.',r:['Yeah, yeah. Tomorrow. Tonight you sit down and shut up and drink with me.']},
   {t:'I’d like that. Stay with me.',r:['* She puts the last of her work aside and turns toward you.','* She stays close. “Yeah. That was worth asking for. Stay a while.”']}]}},

 mystique:{
  cheers:[
   {open:['You prepped for that meeting. Read everything. Walked in knowing more than they did. Delicious. I enjoy a man who comes prepared. Bring that confidence to dinner.'],opts:[
    {t:'Next move, ready.',r:['Always three moves ahead, darling. Now you’re learning.']},
    {t:'I just read the agenda.',r:['Most people don’t. That’s how I took over entire governments. Reading the agenda.']}]},
   {open:['* A coworker’s face flickers blue for a second, then winks at you.','You stayed calm when your boss was not. Very convincing. I’d have hired you. You have my attention, darling. I suggest you enjoy it.'],opts:[
    {t:'I’ll keep my cool.',r:['Cool is a mask. Wear it well and nobody sees you sweat. Not even me.']},
    {t:'Was that you?!',r:['Was it? You’ll never know. That’s the fun part.']}]},
   {open:['You tracked the budget to the penny today. No guessing. Sloppy people guess. You didn’t. Now put the accounts away. I’d rather have you watching me.'],opts:[
    {t:'Every penny, every week.',r:['Good. Money is just leverage that hasn’t been used yet.']},
    {t:'Spreadsheets are boring.',r:['Boring is where everyone stops looking. That’s where I hide things.']}]},
   {open:['You finished the plan for the week. Mondays won’t ambush you anymore. Leave some room in that plan for an evening with me. I’m asking personally.'],opts:[
    {t:'I’m committed.',r:['I know. I can see it on your face. I’m very good with faces.']},
    {t:'Monday always wins.',r:['Not with me around. Monday’s never met a shapeshifter.']}]}],
  codex:'Your own words, darling. Not a disguise. Read them.',
  ack:'There. The real you. I prefer him.',
  done:{open:['Work’s over. I’m wearing my own face, and I want dinner with you. No performance required from either of us.'],opts:[
   {t:'Same again tomorrow.',r:['Of course. I’ll be someone else by then. You won’t mind.']},
   {t:'I’d like that. Stay with me.',r:['* She puts the last of her work aside and turns toward you.','* Her face stays her own. “I’d like another kiss. From you. There’s nothing to decipher.”']}]}},

 // ---------------- Discipline ----------------
 magik:{
  cheers:[
   {open:['Alarm rang. You got up. No snooze. Limbo just got a little smaller inside you. I noticed. I also noticed you smiling when you saw me.'],opts:[
    {t:'Tomorrow too.',r:['Good. I’ll check. I always check.']},
    {t:'I hit snooze once in my head.',r:['In your head doesn’t count. Your feet hit the floor. That counts.']}]},
   {open:['* Illyana’s soulsword flickers, approving.','You put the phone away and didn’t touch it all evening. The little demon starved. Come sit here. I wanted your attention before I wanted the chair.'],opts:[
    {t:'Let it starve.',r:['Yes. Starve them all. Then they stop whining.']},
    {t:'I missed it a bit.',r:['Of course you did. Demons are clingy. Ignore it.']}]},
   {open:['You went to bed on time. Not “one more episode.” On time. I’ve cleared an evening. I’d like you in it.'],opts:[
    {t:'Next night too.',r:['Good. Sleep is armor. You need armor where I’m from.']},
    {t:'The episode had a cliffhanger.',r:['Cliffhangers are a trap. I’ve been in actual hell. That’s worse. Barely.']}]},
   {open:['You kept your routine on a bad day. Those are the only days that really count. Piotr agrees, for once. I like your stubbornness. Especially when it means you keep coming back to see me.'],opts:[
    {t:'Count me in.',r:['I counted you in a long time ago. Don’t make me regret it.']},
    {t:'Piotr agrees with you?',r:['Rarely. Mark the calendar. Then go to sleep.']}]}],
  codex:'You wrote this. In your own handwriting. Read it like a spell.',
  ack:'Good. Now I believe you.',
  done:{open:['Everything done. No more drills. Come walk with me. I want your company, not another excuse to be alone.'],opts:[
   {t:'Same again tomorrow.',r:['Of course. I’ll be waiting. With a sword.']},
   {t:'I’d like that. Stay with me.',r:['* She puts the last of her work aside and turns toward you.','* She stays beside you. “I want another kiss. I can say that without opening a portal.”']}]}},

 // ---------------- Hobbies ----------------
 nico:{
  cheers:[
   {open:['You read for half an hour. Real pages. Not just your phone. That’s like a little spell. Come tell me about it over dinner. Yes, I’m asking you out.'],opts:[
    {t:'Next chapter tomorrow.',r:['Yes! I want a full report. With feelings.']},
    {t:'I fell asleep on page ten.',r:['Still counts. Dreams are research. I should know.']}]},
   {open:['* Nico taps the Staff of One against the floor, delighted.','You made something today. With your hands. That’s the oldest magic there is. I like seeing you get absorbed in something. I’d like some of that attention.'],opts:[
    {t:'I’ll make more.',r:['Yes! Make weird stuff. Make ugly stuff. Just keep making stuff.']},
    {t:'It came out kind of ugly.',r:['Ugly is goth. Ugly is good. I love ugly.']}]},
   {open:['You practiced that thing you’re learning. Even though it’s hard. Especially because it’s hard. I keep trying to think of a casual way to ask you to stay. So, stay?'],opts:[
    {t:'Tomorrow too.',r:['Okay, I’m kind of obsessed with you right now. Tomorrow too.']},
    {t:'I hate the beginner part.',r:['Everyone does. My first spell set my hair on fire. Now look at me.']}]},
   {open:['You played a game just for fun. No guilt. Good. Fun counts. Come sit next to me. I made a playlist I want to hear with you.'],opts:[
    {t:'Count me in again.',r:['Next time invite me. I’m very competitive. And a sore loser.']},
    {t:'I lost horribly.',r:['Same. The Runaways never let me win Monopoly. Ever.']}]}],
  codex:'This is from your notebook. Your words. They’re kind of beautiful. Read them.',
  ack:'Yeah. That’s you. I like that guy.',
  done:{open:['All done? I’ve got dinner and a playlist. I want a date with you, and I’ve run out of reasons not to ask.'],opts:[
   {t:'Same again tomorrow.',r:['Deal. Same time. New songs. I never play the same one twice.']},
   {t:'I’d like that. Stay with me.',r:['* She puts the last of her work aside and turns toward you.','* She lowers her hood and stays close. “I want another kiss. I’m not going to pretend I didn’t.”']}]}},

 shuri:{
  cheers:[
   {open:['You built something today! With tools! Not a single YouTube rage quit. I am so proud. I am logging it. I’m impressed. You may take me to dinner and hear that again.'],opts:[
    {t:'Next build tomorrow.',r:['Yes! I will bring snacks and better tools. Mostly better tools.']},
    {t:'There was one rage quit.',r:['Ha! Only one? Rookie numbers. I have done twelve before lunch.']}]},
   {open:['* Shuri’s bracelet chimes.','Hobby time logged. Zero doom-scrolling. Your screen time graph looks beautiful. Now turn that attention toward me. I have a much more interesting proposal.'],opts:[
    {t:'Tomorrow too.',r:['Excellent. I will make the graph prettier. It deserves it.']},
    {t:'You track my screen time?',r:['I track everyone’s screen time. My brother’s is horrifying. Don’t tell him.']}]},
   {open:['You learned something new today. On purpose. Just because you were curious. I like curiosity. Ask me what I’m doing tonight.'],opts:[
    {t:'I’ll keep learning.',r:['Good! Curiosity is the best tech there is. Vibranium is second.']},
    {t:'It was just a video.',r:['A video about how bridges work. That is still learning. Nerd.']}]},
   {open:['You finished a project. One of the seventeen. That’s sixteen to go! Come celebrate with me. I booked a table, so this is officially a date.'],opts:[
    {t:'Count me in.',r:['Of course you’re in. You’re my favorite lab partner.']},
    {t:'Sixteen is a lot.',r:['Sixteen is nothing. I have forty-three. In Wakanda we call that a Tuesday.']}]}],
  codex:'I found this in your files. You wrote it. It’s actually very smart. Read it again.',
  ack:'Yes! That is the spirit! I am very proud of you.',
  done:{open:['Everything finished. Lab’s closed. I’d like dinner with you, and I promise not to redesign the restaurant.'],opts:[
   {t:'Same again tomorrow.',r:['Of course. I already built a tracker for tomorrow.']},
   {t:'I’d like that. Stay with me.',r:['* She puts the last of her work aside and turns toward you.','* She sets her bracelet aside. “I wanted your attention. Now I have it, I’d like to kiss you.”']}]}},

 vanellope:{
  cheers:[
   {open:['You worked on your hobby. I like seeing you absorbed in something. Come tell me about it after I close the garage.'],opts:[
    {t:'I’m keeping this going.',r:['Good. I like knowing I’ll see you back here tomorrow.']},
    {t:'I’d like some time with you tonight.',r:['Come by after I close the garage. I want a date, not a test lap.']}]},
   {open:['* She sets her own work aside and turns toward you.','You finished a chapter. I finally put my own plans down, too. I’d like an evening with you that isn’t another job.'],opts:[
    {t:'I’m keeping this going.',r:['Good. I like knowing I’ll see you back here tomorrow.']},
    {t:'I’d like some time with you tonight.',r:['Come by after I close the garage. I want a date, not a test lap.']}]},
   {open:['You built something with the kids. I like that patience. Come show me the finished piece, then let me buy you dinner.'],opts:[
    {t:'I’m keeping this going.',r:['Good. I like knowing I’ll see you back here tomorrow.']},
    {t:'I’d like some time with you tonight.',r:['Come by after I close the garage. I want a date, not a test lap.']}]},
   {open:['You practiced when you were tired. I know what that takes over a racing season. I’d like to help you enjoy the evening after.'],opts:[
    {t:'I’m keeping this going.',r:['Good. I like knowing I’ll see you back here tomorrow.']},
    {t:'I’d like some time with you tonight.',r:['Come by after I close the garage. I want a date, not a test lap.']}]}],
  codex:'Hey! You wrote this! It’s actually really good. Read it! Read it again!',
  ack:'YES! That’s my pit crew!',
  done:{open:['Everything finished. I’m closing the garage. Come have dinner with me. I want a date, not a race tonight.'],opts:[
   {t:'Same again tomorrow.',r:['Tomorrow we race again! Bring the kids! Bring snacks!']},
   {t:'I’d like that. Stay with me.',r:['* She sets her helmet on the bench. “I like you. I’d like another date, and a kiss before you go.”']}]}},

 // ---------------- Fatherhood ----------------
 sue:{
  cheers:[
   {open:['Bath, pajamas, two stories, a monster check under the bed. You did all of it. I saw. Come sit with me when they’re settled. I’ve missed a little time with you.'],opts:[
    {t:'Tomorrow too.',r:['I know you will. You’re the glue now. Welcome to the club.']},
    {t:'They wanted three stories.',r:['Of course they did. Franklin once wanted eleven. I turned invisible after six.']}]},
   {open:['* Sue’s smile is soft and tired and proud.','You put the phone away at dinner and really listened. They talked the whole time, didn’t they? I like having your attention. I’d like some of it tonight, too.'],opts:[
    {t:'I’ll keep listening.',r:['That’s the biggest thing you can give them. Bigger than anything Reed ever invented.']},
    {t:'About dinosaurs. For an hour.',r:['Ha! Valeria does black holes. For three. Same energy.']}]},
   {open:['You played with them today. Really played. On the floor, being silly. That laugh is a good look on you. Bring it over here.'],opts:[
    {t:'I’m all in.',r:['I can tell. They can tell too. That’s what matters.']},
    {t:'My knees hate me.',r:['Mine too. A force field cushion helps. You’ll have to make do with a pillow.']}]},
   {open:['You stayed calm when they melted down. Didn’t yell. Just held them. Now let somebody hold your hand for a minute. I’d like to.'],opts:[
    {t:'Next time too.',r:['Good. Calm is a force field. You’re learning to throw one.']},
    {t:'I almost lost it.',r:['Almost doesn’t count. I almost turn the Baxter Building invisible weekly.']}]}],
  codex:'You wrote this one down for a reason. Read it. It’s exactly right.',
  ack:'There he is. My favorite dad in the village.',
  done:{open:['The house is quiet. Sit beside me. I want some time with you where nobody needs us to fix anything.'],opts:[
   {t:'Same again tomorrow.',r:['I know. And I’ll be right here, making tea. Again.']},
   {t:'I’d like that. Stay with me.',r:['* She puts the last of her work aside and turns toward you.','* She stays beside you, visible and smiling. “I want another kiss. No disappearing afterward, either.”']}]}},

 // ---------------- Fitness ----------------
 wasp:{
  cheers:[
   {open:['You worked out! And your form was gorgeous! I saw from a leaf. I was watching your form. Then I got distracted by your smile.'],opts:[
    {t:'Next set tomorrow.',r:['Yes! Same time, same leaf. I’ll be watching.']},
    {t:'You need to stop hiding on leaves.',r:['Never. It’s my thing. I’m tiny and nosy.']}]},
   {open:['* Janet buzzes around your head twice.','You ran! In the cold! In those shorts! Brave. Very brave. You’re looking good. I’d like to see you across a dinner table tonight.'],opts:[
    {t:'Tomorrow too.',r:['Wonderful. But I’m designing you new shorts.']},
    {t:'What’s wrong with the shorts?',r:['Honey. Everything. But your legs are fine. Very fine.']}]},
   {open:['You stretched for ten whole minutes after. Nobody does that! You’re a legend. Come sit close. I’ve been trying to catch your attention all afternoon.'],opts:[
    {t:'I’ll stretch every time.',r:['Good. Flexibility is everything. Ask me how I fly.']},
    {t:'It hurt.',r:['That’s how you know it’s working. Now breathe.']}]},
   {open:['Leg day! Squats! You didn’t skip! I’m so proud I could sting someone. Save the victory grin for me. I’m asking you out tonight.'],opts:[
    {t:'Count me in.',r:['Count you in forever. You’re my favorite workout buddy.']},
    {t:'Can I skip next week?',r:['No. I’ll find you. I’m very small. I can find anyone.']}]}],
  codex:'You wrote this down. Read it again. Every word. You’re cute when you’re thoughtful.',
  ack:'Gorgeous. That’s my guy.',
  done:{open:['Training’s over. I’ve booked dinner. I want your attention tonight, and I’ve picked an outfit accordingly.'],opts:[
   {t:'Same again tomorrow.',r:['Yes! And I’ll wear a new outfit. For you.']},
   {t:'I’d like that. Stay with me.',r:['* She puts the last of her work aside and turns toward you.','* She stays at your side, smiling. “I’d like another kiss. We can both be still for that.”']}]}},

 moana:{
  cheers:[
   {open:['You moved today even when the couch looked comfortable. I like seeing you arrive at the harbor with that grin.'],opts:[
    {t:'I’m keeping this going.',r:['Good. I like knowing I’ll see you back here tomorrow.']},
    {t:'I’d like some time with you tonight.',r:['Meet me at the harbor. I’ve packed dinner for two.']}]},
   {open:['* She sets her own work aside and turns toward you.','You ran before the village woke. Come meet me tomorrow. I’d enjoy a morning with you before the crews arrive.'],opts:[
    {t:'I’m keeping this going.',r:['Good. I like knowing I’ll see you back here tomorrow.']},
    {t:'I’d like some time with you tonight.',r:['Meet me at the harbor. I’ve packed dinner for two.']}]},
   {open:['You stretched afterward. Years at sea taught me not to skip that. I’d like to sail with you for a long time.'],opts:[
    {t:'I’m keeping this going.',r:['Good. I like knowing I’ll see you back here tomorrow.']},
    {t:'I’d like some time with you tonight.',r:['Meet me at the harbor. I’ve packed dinner for two.']}]},
   {open:['You played outside with the kids. That counts as training. I’d like to share a quieter evening with you, too.'],opts:[
    {t:'I’m keeping this going.',r:['Good. I like knowing I’ll see you back here tomorrow.']},
    {t:'I’d like some time with you tonight.',r:['Meet me at the harbor. I’ve packed dinner for two.']}]}],
  codex:'Hey! You wrote this! Read it. It’s like a star map for you.',
  ack:'Yes! You know the way!',
  done:{open:['All finished? Meet me by the canoe. I packed dinner for two, and I’d like the second person to be you.'],opts:[
   {t:'Same again tomorrow.',r:['Yes! Tomorrow we go further!']},
   {t:'I’d like that. Stay with me.',r:['* She ties the canoe securely, then takes your hand. “I wanted tonight with you. May I kiss you?”']}]}},
};
