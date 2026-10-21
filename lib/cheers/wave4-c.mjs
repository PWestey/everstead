// Cheers (task-completion pop-ups), fourth wave part C. See docs/WRITING-BRIEF.md, "Cheers".
// Discipline: Caitlyn, Garona, Riven, Sylvanas, Xalatath. Hobbies: Jasnah, Seraphine, Sona.
// cheers: after a habit in her life area. codex: lead-in to one of his own Codex notes. ack: reply when he commits.
// done: when every daily is finished. M = {open:[1-2 lines], opts:[{t:'player reply', r:['her answer']} x2]}.
// Sona is mute: her lines are narration of what she plays and does, plus short written notes.

/** @type {Record<string,{cheers:any[],codex:string,ack:string,done:any}>} */
export const CHEERS={
 // ---------------- Discipline ----------------
 caitlyn:{
  cheers:[
   {open:['Phone down on time. I clocked it. Patience is most of my job, and you just did it without a rifle.'],opts:[
    {t:'Same time tomorrow.',r:['I’ll be watching the clock. And you, obviously.']},
    {t:'Do I get a badge?',r:['You get a sheriff who’s impressed. That’s rarer than a badge, cupcake.']}]},
   {open:['* Caitlyn tips her hat back and smiles.','You did the boring thing first. Paperwork before patrol. Vi would never.'],opts:[
    {t:'Boring things first. Always.',r:['Careful. That’s the most attractive sentence in Piltover.']},
    {t:'Vi seems more fun.',r:['Vi is chaos in gauntlets. You’re a man with a plan. I prefer plans.']}]},
   {open:['You wanted to quit halfway. I saw it in your shoulders. You breathed and finished. That’s a clean shot.'],opts:[
    {t:'Breathe and finish.',r:['Exactly. Steady hands. I could watch you work all day.']},
    {t:'You were watching my shoulders?',r:['I watch everything, darling. Some things I watch more closely.']}]},
   {open:['Bed on time, alarm on time, no excuses. You’d make a terrible criminal. Far too predictable.'],opts:[
    {t:'Predictable it is.',r:['Good. I like knowing exactly where to find you.']},
    {t:'I could be mysterious.',r:['You couldn’t. And I’d solve you in an afternoon. A very enjoyable afternoon.']}]}],
  codex:'Evidence, in your own handwriting. Read it like a case file.',
  ack:'Noted, filed, and very attractive. Carry on.',
  done:{open:['Every daily closed. Case solved. The sheriff is officially off duty, and she’d like some company.'],opts:[
   {t:'Same again tomorrow.',r:['Then I’ll put the kettle on now. You’ve earned the good tea.']},
   {t:'Off duty, you said?',r:['Hat off, gloves off, rifle in the rack. Come find out what that means.']}]}},

 garona:{
  cheers:[
   {open:['You said no to the thing you always say yes to. Nobody pulled your strings. You cut them.'],opts:[
    {t:'My strings. My call.',r:['That’s it. Say it like that and I might follow you anywhere.']},
    {t:'It was just one snack.',r:['It’s always just one. Then it owns you. Not today, though.']}]},
   {open:['* Garona flips a dagger and catches it without looking.','Focused hour, no wandering. In my old work, that’s how you live to the next day.'],opts:[
    {t:'Another hour tomorrow.',r:['Good. Sharp blade, sharp mind. I like you sharp.']},
    {t:'Less stabbing in mine.',r:['Shame. You’d look good with a knife. Don’t make that face, I mean it nicely.']}]},
   {open:['Up when the alarm went off. No bargaining. That’s the first fight of the day, and you won it.'],opts:[
    {t:'I’ll win it again.',r:['Don’t just win it. Own it. Then come find me, I’ll be up.']},
    {t:'I bargained a little.',r:['I heard. You lost the bargain and got up anyway. That counts double.']}]},
   {open:['You kept your own routine when everyone else wanted a piece of your night. Hard. I know.'],opts:[
    {t:'My night is mine.',r:['Yours. And maybe a little of it mine, if you’re asking nicely.']},
    {t:'Everyone wanted me tonight.',r:['Mm. Can’t blame them. Get in line, though. I was here first.']}]}],
  codex:'You wrote this when nobody was telling you what to think. Trust that one.',
  ack:'Good. No strings. Just you.',
  done:{open:['Every daily done. No orders, no chains, just you choosing. That’s the most dangerous man I know.'],opts:[
   {t:'Same tomorrow.',r:['Then I’ll watch your back. And other things.']},
   {t:'Dangerous, huh?',r:['To me, mostly. Come here before I think better of it.']}]}},

 riven:{
  cheers:[
   {open:['You kept the routine today. One more knot tied. I’m proud of you. Sorry, that came out fast.'],opts:[
    {t:'Another knot tomorrow.',r:['Then I’ll be there in the morning. Same spot. I’ll bring tea.']},
    {t:'You’re cute when flustered.',r:['I’m not flustered. I’m, um. Go do your next thing.']}]},
   {open:['* Riven lowers her blade, a little out of breath.','Same forms, same time, every day. Nobody claps. You do it anyway. That’s the part I respect.'],opts:[
    {t:'I’ll do it again.',r:['I know you will. That’s why I keep watching.']},
    {t:'I’d like a little clapping.',r:['* She claps twice, very quietly, and goes pink.','There. Don’t tell anyone.']}]},
   {open:['You messed up yesterday and started again today. No sulking. That’s all atonement really is.'],opts:[
    {t:'Start again. Every time.',r:['Every time. I’m still doing it too. We can do it together.']},
    {t:'I sulked a little.',r:['Me too, for about a year. You did it in a day. You’re faster than me.']}]},
   {open:['Screens off, mind quiet. In Ionia they’d say you’re listening to the wind. I just think you look calmer.'],opts:[
    {t:'Calm feels good.',r:['It suits you. I like being around calm. I like being around you.']},
    {t:'I miss my phone already.',r:['* She laughs, small and surprised.','It’ll survive. Sit with me instead.']}]}],
  codex:'You wrote this down on a better day. Read it. It’s you, telling you.',
  ack:'Good. One more knot. I’ll be right beside you.',
  done:{open:['Every daily, done. You didn’t break once today. Neither did I. I think that’s because of you.'],opts:[
   {t:'Same again tomorrow.',r:['Dawn, behind the Library. I’ll wait for you.']},
   {t:'Rest with me tonight.',r:['* She sets down her blade and takes your hand.','I’d like that. Just quiet. Just us.']}]}},

 sylvanas:{
  cheers:[
   {open:['You kept your word to yourself. I have known kings who could not. Do not expect this praise often.'],opts:[
    {t:'I’ll keep it again tomorrow.',r:['See that you do. I would hate to be disappointed. In you, especially.']},
    {t:'That’s practically a hug.',r:['From me? It is practically a proposal. Do not push your luck.']}]},
   {open:['* Sylvanas lowers her bow.','Up before dawn. Every scout under my command learned that or went home. You learned it on your own.'],opts:[
    {t:'Dawn again tomorrow.',r:['I will be on the tower. Do not keep me waiting.']},
    {t:'Did they really go home?',r:['Some went home. Some went to Alleria. She took the soft ones.']}]},
   {open:['You wanted to quit. I heard it. You did not. Will is the only thing they could never take from me.'],opts:[
    {t:'They won’t take mine.',r:['Good. Then we understand each other perfectly.']},
    {t:'You heard me wanting to quit?',r:['I hear everything. I am a banshee, darling. Mostly I heard you not quitting.']}]},
   {open:['Screen off when you said. Alleria will tell you I don’t care. Alleria is wrong.'],opts:[
    {t:'Screens off. Every night.',r:['Then every night I will have one fewer reason to be cross with you.']},
    {t:'Your sister talks about me?',r:['Constantly. It’s tiresome. I keep listening anyway.']}]}],
  codex:'You wrote this. Read it. I do not repeat myself, so let you do it for me.',
  ack:'Hm. Acceptable. More than acceptable.',
  done:{open:['Every daily completed. A ranger-general would promote you. A queen might do something more interesting.'],opts:[
   {t:'Same again tomorrow.',r:['I expect nothing less. Go to bed. I may stop by.']},
   {t:'What would a queen do?',r:['* She steps close, cold breath at your ear.','Come and find out.']}]}},

 xalatath:{
  cheers:[
   {open:['Darling. I whispered one more scroll, and you put the phone down. Again. I’m furious. I’m enchanted.'],opts:[
    {t:'And tomorrow too.',r:['Ugh. You’re impossible. Do it again, I want to watch.']},
    {t:'Whisper louder.',r:['Oh, I will. And you’ll ignore me. And I’ll love it. This is a problem.']}]},
   {open:['* Xalatath drapes herself over your shoulders.','You could have skipped it. Nobody would know. Except me. And you did it anyway. Rude.'],opts:[
    {t:'I always do it anyway.',r:['I know. It’s unbearably attractive. Stop it. Don’t stop it.']},
    {t:'You’d have told everyone.',r:['Only the Old Gods. They gossip terribly.']}]},
   {open:['Focused for a whole hour. Do you know how many little voices I sent? You ignored every one. Insulting.'],opts:[
    {t:'Send more. I’ll win.',r:['Mm. Confident. I like confident. Go on, prove it twice.']},
    {t:'One almost got me.',r:['I know which one. I’m saving it for later, darling.']}]},
   {open:['Bed on time. The Void had such plans for your night. Snacks. Videos. Regret. You chose sleep. Boring. Delicious.'],opts:[
    {t:'Sleep wins tonight.',r:['Sleep wins every night with you. Sweet dreams. I’ll be in some of them.']},
    {t:'What kind of regret?',r:['The fun kind, at first. Then the other kind. You’ll never know now.']}]}],
  codex:'You scribbled this down once to ward me off. Clever. Read it again, it still works.',
  ack:'Annoying. Effective. Very you.',
  done:{open:['Every daily done. Every whisper ignored. I’ve never lost so completely, and I’ve never enjoyed it more.'],opts:[
   {t:'Same again tomorrow.',r:['I’ll be waiting with fresh temptations. You’ll refuse them. I’ll swoon.']},
   {t:'Come sit with me.',r:['* She curls up beside you, the candles dimming.','No tricks. I promise. Mostly.']}]}},

 // ---------------- Hobbies ----------------
 jasnah:{
  cheers:[
   {open:['You read instead of scrolling. Twenty pages, considered. That’s more than most scholars manage in a week.'],opts:[
    {t:'Twenty more tomorrow.',r:['Good. And then tell me which parts you disagreed with. I want to argue.']},
    {t:'Most scholars? Really?',r:['Most scholars read for citations. You read for pleasure. Much rarer. Much more attractive.']}]},
   {open:['* Jasnah closes her book with a soft snap.','You learned something new today. On purpose. For no reward. Do you know how rare curiosity is?'],opts:[
    {t:'Something new every day.',r:['Then you’ll never bore me. That’s a promise I rarely get to make.']},
    {t:'It was a cooking video.',r:['Knowledge is knowledge. Cook it for me and I’ll judge the methodology.']}]},
   {open:['You made something with your hands. Uncle Dalinar would call it a waste of time. He’s wrong. I’ll tell him.'],opts:[
    {t:'I’ll make more.',r:['Do. I’d like to see the next one. I might even keep it.']},
    {t:'Please don’t tell Dalinar.',r:['Too late. I already did. He grunted. It was nearly approval.']}]},
   {open:['An hour on your hobby and no guilt about it. Rest is not idleness. My mother taught me that between inventions.'],opts:[
    {t:'No guilt. Tomorrow too.',r:['Good. A mind needs play to stay sharp. Yours is very sharp.']},
    {t:'Your mother sounds busy.',r:['Navani has never been idle in her life. She’d approve of you. Annoyingly so.']}]}],
  codex:'Your own note. Read it critically, then accept that you were right.',
  ack:'Logical. Elegant. Rather attractive.',
  done:{open:['Every daily complete. I’d call it a thesis well defended. Now put the work away and come argue with me.'],opts:[
   {t:'Same again tomorrow.',r:['I expect a new book recommendation by then. Choose well.']},
   {t:'No arguing tonight.',r:['* She sets her book face down, which she never does.','Fine. No arguing. I’ll think of something else.']}]}},

 seraphine:{
  cheers:[
   {open:['You practiced! Your song just did this little happy jump. I heard it all the way from the stage!'],opts:[
    {t:'Practice again tomorrow.',r:['Yay! I’ll write a harmony for it. It’ll be our song.']},
    {t:'My song does jumps?',r:['Little ones! Like a heartbeat when someone cute walks in. Um. Anyway.']}]},
   {open:['* Seraphine spins her soundboard in a happy circle.','You made something today! Doesn’t matter if it’s good. Making stuff is the whole point!'],opts:[
    {t:'Making more tomorrow.',r:['That’s the spirit! Bring it to the Guildhall, I want to see!']},
    {t:'It wasn’t very good.',r:['My first song rhymed “Zaun” with “Zaun.” Twice. Keep going!']}]},
   {open:['You played a game with the kids and actually played. No phone. Your song went all bright and silly. I love that version.'],opts:[
    {t:'Bright and silly it is.',r:['Best kind of song. Play it every day, please.']},
    {t:'They beat me, though.',r:['Ha! Losing to tiny people is the cutest sound in the world. Trust me.']}]},
   {open:['You read before bed instead of scrolling! Your song gets so calm and sweet when you do that. Like a lullaby.'],opts:[
    {t:'Another chapter tomorrow.',r:['I’ll hum along. Very quietly. Promise.']},
    {t:'You listen to me sleep?',r:['No! Maybe. A little. It’s a really nice song, okay?']}]}],
  codex:'You wrote this down once! It’s like a lyric. Read it out loud, it sounds better.',
  ack:'Yes! That note was perfect.',
  done:{open:['Every daily done! Your whole song is going right now, all the parts at once. It’s my favorite thing.'],opts:[
   {t:'Same again tomorrow.',r:['Encore! I’ll be front row. Always.']},
   {t:'Sing it with me?',r:['* She takes your hands and hums, soft and close.','I’ve been waiting all day for you to ask.']}]}},

 sona:{
  cheers:[
   {open:['* Sona plays a quick, bright phrase on her etwahl and holds up a card: You practiced. I heard every note.'],opts:[
    {t:'Practice again tomorrow.',r:['* She nods, beaming, and plays the opening of your song as a promise.']},
    {t:'Even the bad notes?',r:['* She writes: Especially those. Then she smiles and plays one back, wrong on purpose.']}]},
   {open:['* She claps silently, then writes: You made something. That is how you speak without words.'],opts:[
    {t:'I’ll make more.',r:['* She plays a little rising scale, like a door opening, and touches your hand.']},
    {t:'You’d know.',r:['* She laughs silently and writes: I would. Better than anyone.']}]},
   {open:['* Sona plays a soft, steady melody. Her card says: You read tonight. I can tell. You sound calmer.'],opts:[
    {t:'Reading again tomorrow.',r:['* She writes: I will play while you read. If you like. Then she underlines it.']},
    {t:'You can hear that?',r:['* She taps her heart, then points at yours, and plays one gentle chord.']}]},
   {open:['* She writes: Ten minutes. Every day. Never more. Never less. You did it.','* The etwahl hums happily on its own.'],opts:[
    {t:'Ten minutes, every day.',r:['* She holds up a card with a tiny drawn heart on it, then hides it, blushing.']},
    {t:'Can I have fifteen?',r:['* She raises an eyebrow, then writes: With me? Yes.']}]}],
  codex:'* Sona taps your note with one finger, then plays a soft phrase, as if to say: listen to yourself.',
  ack:'* She plays a single bright chord and smiles.',
  done:{open:['* Every daily done. Sona plays a full, joyful song, the one she wrote for you, and holds up a card: All of you. All at once.'],opts:[
   {t:'Same again tomorrow.',r:['* She plays the opening bar again, a promise, and squeezes your hand.']},
   {t:'Play it again.',r:['* She does, slower this time, leaning against your shoulder, eyes closed.']}]}},
};
