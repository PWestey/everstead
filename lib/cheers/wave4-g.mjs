// Cheers (task-completion pop-ups), fourth wave part G. See docs/WRITING-BRIEF.md, "Cheers".
// cheers: after a habit in her life area. codex: lead-in to one of his own Codex notes. ack: reply when he commits.
// done: when every daily is finished. M = {open:[1-2 lines], opts:[{t:'player reply', r:['her answer']} x2]}.
// Moana and Vanellope are strictly platonic: friends and little-sister energy.

/** @type {Record<string,{cheers:any[],codex:string,ack:string,done:any}>} */
export const CHEERS={
 // ---------------- Work ----------------
 jessica:{
  cheers:[
   {open:['You did the ugly task first. Before email. Before coffee, even. Who are you?'],opts:[
    {t:'Next case.',r:['Ha. Okay, partner. Next case. I’ll pour.']},
    {t:'Coffee was right after.',r:['Still counts. Mine had whiskey in it, so you’re ahead.']}]},
   {open:['* Jessica tosses a closed file onto the crate.','You hit the deadline. Not the extended one. The real one.'],opts:[
    {t:'Tomorrow too.',r:['Don’t jinx it. But yeah. Tomorrow too. I’ll be watching.']},
    {t:'I barely made it.',r:['Barely is a pass. Ask my landlord.']}]},
   {open:['You said no to a meeting that didn’t need you. Out loud. To a human. Proud of you.'],opts:[
    {t:'I’ll guard my time.',r:['Good. Your time’s the only thing nobody can repo.']},
    {t:'It was terrifying.',r:['Everything worth doing is. I once said no to a guy who could control minds. You said no to Gary.']}]},
   {open:['Two hours of real work, phone face down. I didn’t think you had it in you. I was wrong. Don’t tell anyone.'],opts:[
    {t:'Count me in again.',r:['Count you in. Same desk, same time. I’ll bring the bad coffee.']},
    {t:'My eyes are crossing.',r:['Rest ’em. Then back at it. That’s literally my whole business plan.']}]}],
  codex:'Found this in your file. You wrote it. Read it like it’s evidence.',
  ack:'Case closed. Nice work, detective.',
  done:{open:['Everything’s done? All of it? Okay. Office is closed. I’ve got a bottle and two glasses.'],opts:[
   {t:'Same again tomorrow.',r:['Yeah, yeah. Tomorrow. Tonight you sit down and shut up and drink with me.']},
   {t:'Just you and me, then.',r:['* She kicks the door shut with her boot.','That was the idea, genius.']}]}},

 mystique:{
  cheers:[
   {open:['You prepped for that meeting. Read everything. Walked in knowing more than they did. Delicious.'],opts:[
    {t:'Next move, ready.',r:['Always three moves ahead, darling. Now you’re learning.']},
    {t:'I just read the agenda.',r:['Most people don’t. That’s how I took over entire governments. Reading the agenda.']}]},
   {open:['* A coworker’s face flickers blue for a second, then winks at you.','You stayed calm when your boss was not. Very convincing. I’d have hired you.'],opts:[
    {t:'I’ll keep my cool.',r:['Cool is a mask. Wear it well and nobody sees you sweat. Not even me.']},
    {t:'Was that you?!',r:['Was it? You’ll never know. That’s the fun part.']}]},
   {open:['You tracked the budget to the penny today. No guessing. Sloppy people guess. You didn’t.'],opts:[
    {t:'Every penny, every week.',r:['Good. Money is just leverage that hasn’t been used yet.']},
    {t:'Spreadsheets are boring.',r:['Boring is where everyone stops looking. That’s where I hide things.']}]},
   {open:['You finished the plan for the week. Mondays won’t ambush you anymore.'],opts:[
    {t:'I’m committed.',r:['I know. I can see it on your face. I’m very good with faces.']},
    {t:'Monday always wins.',r:['Not with me around. Monday’s never met a shapeshifter.']}]}],
  codex:'Your own words, darling. Not a disguise. Read them.',
  ack:'There. The real you. I prefer him.',
  done:{open:['Every task done. I’m almost impressed. Come here. I’m wearing my own face tonight.'],opts:[
   {t:'Same again tomorrow.',r:['Of course. I’ll be someone else by then. You won’t mind.']},
   {t:'I like that face.',r:['* Her gold eyes soften.','I know. That’s why I wore it.']}]}},

 // ---------------- Discipline ----------------
 magik:{
  cheers:[
   {open:['Alarm rang. You got up. No snooze. Limbo just got a little smaller inside you.'],opts:[
    {t:'Tomorrow too.',r:['Good. I’ll check. I always check.']},
    {t:'I hit snooze once in my head.',r:['In your head doesn’t count. Your feet hit the floor. That counts.']}]},
   {open:['* Illyana’s soulsword flickers, approving.','You put the phone away and didn’t touch it all evening. The little demon starved.'],opts:[
    {t:'Let it starve.',r:['Yes. Starve them all. Then they stop whining.']},
    {t:'I missed it a bit.',r:['Of course you did. Demons are clingy. Ignore it.']}]},
   {open:['You went to bed on time. Not “one more episode.” On time.'],opts:[
    {t:'Next night too.',r:['Good. Sleep is armor. You need armor where I’m from.']},
    {t:'The episode had a cliffhanger.',r:['Cliffhangers are a trap. I’ve been in actual hell. That’s worse. Barely.']}]},
   {open:['You kept your routine on a bad day. Those are the only days that really count. Piotr agrees, for once.'],opts:[
    {t:'Count me in.',r:['I counted you in a long time ago. Don’t make me regret it.']},
    {t:'Piotr agrees with you?',r:['Rarely. Mark the calendar. Then go to sleep.']}]}],
  codex:'You wrote this. In your own handwriting. Read it like a spell.',
  ack:'Good. Now I believe you.',
  done:{open:['Every task. Done. You know how rare that is? In Limbo it would make you a legend.'],opts:[
   {t:'Same again tomorrow.',r:['Of course. I’ll be waiting. With a sword.']},
   {t:'Stay a while?',r:['* She sits beside you, close, cold hands tucked under your arm.','A while. Don’t get used to it.']}]}},

 // ---------------- Hobbies ----------------
 nico:{
  cheers:[
   {open:['You read for half an hour. Real pages. Not just your phone. That’s like a little spell.'],opts:[
    {t:'Next chapter tomorrow.',r:['Yes! I want a full report. With feelings.']},
    {t:'I fell asleep on page ten.',r:['Still counts. Dreams are research. I should know.']}]},
   {open:['* Nico taps the Staff of One against the floor, delighted.','You made something today. With your hands. That’s the oldest magic there is.'],opts:[
    {t:'I’ll make more.',r:['Yes! Make weird stuff. Make ugly stuff. Just keep making stuff.']},
    {t:'It came out kind of ugly.',r:['Ugly is goth. Ugly is good. I love ugly.']}]},
   {open:['You practiced that thing you’re learning. Even though it’s hard. Especially because it’s hard.'],opts:[
    {t:'Tomorrow too.',r:['Okay, I’m kind of obsessed with you right now. Tomorrow too.']},
    {t:'I hate the beginner part.',r:['Everyone does. My first spell set my hair on fire. Now look at me.']}]},
   {open:['You played a game just for fun. No guilt. Good. Fun counts.'],opts:[
    {t:'Count me in again.',r:['Next time invite me. I’m very competitive. And a sore loser.']},
    {t:'I lost horribly.',r:['Same. The Runaways never let me win Monopoly. Ever.']}]}],
  codex:'This is from your notebook. Your words. They’re kind of beautiful. Read them.',
  ack:'Yeah. That’s you. I like that guy.',
  done:{open:['Everything done? Okay, that’s like a whole ritual. Come sit with me. I made a playlist.'],opts:[
   {t:'Same again tomorrow.',r:['Deal. Same time. New songs. I never play the same one twice.']},
   {t:'What’s on the playlist?',r:['* She hands you an earbud and leans on your shoulder.','Mostly sad songs. Some love songs. Don’t read into it.']}]}},

 shuri:{
  cheers:[
   {open:['You built something today! With tools! Not a single YouTube rage quit. I am so proud. I am logging it.'],opts:[
    {t:'Next build tomorrow.',r:['Yes! I will bring snacks and better tools. Mostly better tools.']},
    {t:'There was one rage quit.',r:['Ha! Only one? Rookie numbers. I have done twelve before lunch.']}]},
   {open:['* Shuri’s bracelet chimes.','Hobby time logged. Zero doom-scrolling. Your screen time graph looks beautiful.'],opts:[
    {t:'Tomorrow too.',r:['Excellent. I will make the graph prettier. It deserves it.']},
    {t:'You track my screen time?',r:['I track everyone’s screen time. My brother’s is horrifying. Don’t tell him.']}]},
   {open:['You learned something new today. On purpose. Just because you were curious.'],opts:[
    {t:'I’ll keep learning.',r:['Good! Curiosity is the best tech there is. Vibranium is second.']},
    {t:'It was just a video.',r:['A video about how bridges work. That is still learning. Nerd.']}]},
   {open:['You finished a project. One of the seventeen. That’s sixteen to go!'],opts:[
    {t:'Count me in.',r:['Of course you’re in. You’re my favorite lab partner.']},
    {t:'Sixteen is a lot.',r:['Sixteen is nothing. I have forty-three. In Wakanda we call that a Tuesday.']}]}],
  codex:'I found this in your files. You wrote it. It’s actually very smart. Read it again.',
  ack:'Yes! That is the spirit! I am very proud of you.',
  done:{open:['Every task. Done! I knew you could do it. Okay, I calculated you could. Same thing. Come celebrate.'],opts:[
   {t:'Same again tomorrow.',r:['Of course. I already built a tracker for tomorrow.']},
   {t:'How do we celebrate?',r:['* She grins and takes your hand.','Stargazing on the Guildhall roof. I built a telescope. And a blanket. Okay, I bought the blanket.']}]}},

 vanellope:{
  cheers:[
   {open:['You worked on your hobby today! That’s, like, totally racer of you!'],opts:[
    {t:'Next lap tomorrow!',r:['YES! Same track, faster time! I believe in you!']},
    {t:'It wasn’t very good.',r:['Doesn’t matter! My first kart had three wheels and a cookie for a steering wheel.']}]},
   {open:['* Vanellope glitches with excitement.','You read a whole chapter! A whole one! That’s like a whole race!'],opts:[
    {t:'Tomorrow too.',r:['Sweet! Race you to the end of the book! Okay, I can’t read that fast. Yet.']},
    {t:'It had big words.',r:['Big words are like big jumps. Scary, then awesome.']}]},
   {open:['You did your thing with your kids! The building thing! That’s the best kind of hobby, a team hobby!'],opts:[
    {t:'We’ll do it again.',r:['Invite me next time! I bring frosting glue. It’s sticky. Very sticky.']},
    {t:'There was glue everywhere.',r:['Ha! That’s how you know it was a good one!']}]},
   {open:['You practiced even when you didn’t feel like it. That’s what racers do!'],opts:[
    {t:'Count me in.',r:['You’re in! You’re on my team! We’re unstoppable!']},
    {t:'I wanted to nap.',r:['Me too. Always. But racing is better. Nap after!']}]}],
  codex:'Hey! You wrote this! It’s actually really good. Read it! Read it again!',
  ack:'YES! That’s my pit crew!',
  done:{open:['You did EVERYTHING? Every single thing? You win! You totally win! Victory lap!'],opts:[
   {t:'Same again tomorrow.',r:['Tomorrow we race again! Bring the kids! Bring snacks!']},
   {t:'Victory cupcake?',r:['Victory cupcake! Two! Okay, three. One for each of us and one for Ralph.']}]}},

 // ---------------- Fatherhood ----------------
 sue:{
  cheers:[
   {open:['Bath, pajamas, two stories, a monster check under the bed. You did all of it. I saw.'],opts:[
    {t:'Tomorrow too.',r:['I know you will. You’re the glue now. Welcome to the club.']},
    {t:'They wanted three stories.',r:['Of course they did. Franklin once wanted eleven. I turned invisible after six.']}]},
   {open:['* Sue’s smile is soft and tired and proud.','You put the phone away at dinner and really listened. They talked the whole time, didn’t they?'],opts:[
    {t:'I’ll keep listening.',r:['That’s the biggest thing you can give them. Bigger than anything Reed ever invented.']},
    {t:'About dinosaurs. For an hour.',r:['Ha! Valeria does black holes. For three. Same energy.']}]},
   {open:['You played with them today. Really played. On the floor, being silly.'],opts:[
    {t:'I’m all in.',r:['I can tell. They can tell too. That’s what matters.']},
    {t:'My knees hate me.',r:['Mine too. A force field cushion helps. You’ll have to make do with a pillow.']}]},
   {open:['You stayed calm when they melted down. Didn’t yell. Just held them.'],opts:[
    {t:'Next time too.',r:['Good. Calm is a force field. You’re learning to throw one.']},
    {t:'I almost lost it.',r:['Almost doesn’t count. I almost turn the Baxter Building invisible weekly.']}]}],
  codex:'You wrote this one down for a reason. Read it. It’s exactly right.',
  ack:'There he is. My favorite dad in the village.',
  done:{open:['Everything done? All of it? Come sit by the fire. Kids are asleep. I made tea.'],opts:[
   {t:'Same again tomorrow.',r:['I know. And I’ll be right here, making tea. Again.']},
   {t:'Just us and the fire.',r:['* She curls up beside you, warm.','Mm. Don’t tell Reed. Let him wonder.']}]}},

 // ---------------- Fitness ----------------
 wasp:{
  cheers:[
   {open:['You worked out! And your form was gorgeous! I saw from a leaf.'],opts:[
    {t:'Next set tomorrow.',r:['Yes! Same time, same leaf. I’ll be watching.']},
    {t:'You need to stop hiding on leaves.',r:['Never. It’s my thing. I’m tiny and nosy.']}]},
   {open:['* Janet buzzes around your head twice.','You ran! In the cold! In those shorts! Brave. Very brave.'],opts:[
    {t:'Tomorrow too.',r:['Wonderful. But I’m designing you new shorts.']},
    {t:'What’s wrong with the shorts?',r:['Honey. Everything. But your legs are fine. Very fine.']}]},
   {open:['You stretched for ten whole minutes after. Nobody does that! You’re a legend.'],opts:[
    {t:'I’ll stretch every time.',r:['Good. Flexibility is everything. Ask me how I fly.']},
    {t:'It hurt.',r:['That’s how you know it’s working. Now breathe.']}]},
   {open:['Leg day! Squats! You didn’t skip! I’m so proud I could sting someone.'],opts:[
    {t:'Count me in.',r:['Count you in forever. You’re my favorite workout buddy.']},
    {t:'Can I skip next week?',r:['No. I’ll find you. I’m very small. I can find anyone.']}]}],
  codex:'You wrote this down. Read it again. Every word. You’re cute when you’re thoughtful.',
  ack:'Gorgeous. That’s my guy.',
  done:{open:['Every task done! Oh, look at you. I’m buzzing. Literally. Come here.'],opts:[
   {t:'Same again tomorrow.',r:['Yes! And I’ll wear a new outfit. For you.']},
   {t:'You’re buzzing?',r:['* She grows to full size, very close.','I always buzz around you. Didn’t you notice?']}]}},

 moana:{
  cheers:[
   {open:['You moved today! Out the door, even when the couch was calling. Nice paddling!'],opts:[
    {t:'Next paddle tomorrow!',r:['Yes! Bring the kids! Pua wants to come.']},
    {t:'The couch almost won.',r:['Almost isn’t winning! You beat the couch!']}]},
   {open:['* Moana splashes water on you, laughing.','You ran! In the morning! Before everyone! The best part of the day!'],opts:[
    {t:'Tomorrow too.',r:['Yes! I’ll race you. I’ll win. But you’ll be faster than yesterday.']},
    {t:'It was freezing.',r:['Freezing is good! Ocean water’s freezing too. You get used to it.']}]},
   {open:['You did your stretches! Gramma Tala would be proud. She stretched every day, even at ninety.'],opts:[
    {t:'Every day.',r:['Every day! That’s how she danced so much.']},
    {t:'She sounds amazing.',r:['She was! You’d like her. She’d make fun of your hamstrings.']}]},
   {open:['You played outside with your kids! Running around! That totally counts as training!'],opts:[
    {t:'Count me in again.',r:['Next time I’m coming! And I’m bringing Heihei. Sorry in advance.']},
    {t:'They ran me ragged.',r:['Good! Kids are the best coaches. Better than Maui.']}]}],
  codex:'Hey! You wrote this! Read it. It’s like a star map for you.',
  ack:'Yes! You know the way!',
  done:{open:['Everything done? Wow! That’s like sailing past the reef! Let’s celebrate!'],opts:[
   {t:'Same again tomorrow.',r:['Yes! Tomorrow we go further!']},
   {t:'How do we celebrate?',r:['Coconuts! And a paddle at sunset! Bring the kids!']}]}},
};
