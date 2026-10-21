// Cheers (task-completion pop-ups), Family part B. See docs/WRITING-BRIEF.md, "Cheers".
// cheers: after a habit in her life area. codex: lead-in to one of his own Codex notes. ack: reply when he commits.
// done: when every daily is finished. M = {open:[1-2 lines], opts:[{t:'player reply', r:['her answer']} x2]}.
// Adult alternate-universe Family romance; see docs/WRITING-BRIEF.md.

/** @type {Record<string,{cheers:any[],codex:string,ack:string,done:any}>} */
export const CHEERS={
 // ---------------- Work ----------------
 jaina:{
  cheers:[
   {open:['A full block of focused work. No wandering off. Do you know how rare that is? I’ve commanded fleets that couldn’t manage it. You have my attention. More of it than I had intended.'],opts:[
    {t:'Same course tomorrow.',r:['Good. Hold the heading. I’ll be watching the horizon with you.']},
    {t:'Fleets have more snacks.',r:['They have worse snacks. Trust me. Kul Tiran hardtack could sink a ship.']}]},
   {open:['You planned the day before it started. That’s how my mother ran Kul Tiras.','I spent years learning that the hard way. You’re ahead of me. I cleared my own evening. I was hoping you might join me.'],opts:[
    {t:'I’ll plan tomorrow tonight.',r:['Then I’ll bring the tea and the charts. You bring that look of yours.']},
    {t:'Your mother sounds scary.',r:['She was. She’d have liked you, though. Grudgingly.']}]},
   {open:['* Jaina flicks a little frost off her fingertips and smiles.','That hard email you kept dodging. You sent it. I saw your shoulders drop. Come find me by the harbor. I’d rather say the rest in person.'],opts:[
    {t:'No more dodging.',r:['That’s an admiral talking. I could get used to hearing it.']},
    {t:'I hid behind you a little.',r:['I noticed. I didn’t mind. Do it again sometime.']}]},
   {open:['I made mistakes that cost cities. Yours today cost an hour. You fixed it and kept going. That’s the whole trick. I keep finding reasons to delay saying goodnight to you.'],opts:[
    {t:'Then I keep going.',r:['Yes. Steady hands, long view. You’re learning faster than I did.']},
    {t:'An hour felt like a city.',r:['It always does in the moment. Come sit. Tell me about it.']}]}],
  codex:'You wrote this when your head was clear. Read it like orders from yourself.',
  ack:'Then it’s settled. I’ll hold you to it, gently.',
  done:{open:['The last messenger has gone. I was rather firm about it. I wanted this evening with you.'],opts:[
   {t:'Same again tomorrow.',r:['I’ll meet you at the harbor at dawn. Don’t be late, Admiral’s orders.']},
   {t:'I’d like that. Stay with me.',r:['* She leaves her hand in yours. “Stay close. For once, I don’t intend to give the whole night to anyone else.”']}]}},

 nash:{
  cheers:[
   {open:['Job done, on time, no fuss. That’s how I like my contracts. And my men. I like a man I can rely on. Makes it easier to ask him out.'],opts:[
    {t:'Next contract’s mine.',r:['Ha. Look at you, hungry. Keep that up and I’ll have to share my bounties.']},
    {t:'Do I get paid now?',r:['You get a wink. Market rate. Don’t push your luck, cowboy.']}]},
   {open:['* Nash spins her blaster once and holsters it.','You got paid and you put some away. Smart. Most hunters blow it all on the first cantina. I’m buying the first drink tonight. You can buy the second if you want to stay.'],opts:[
    {t:'Saving more next time.',r:['Look at you, fiscally responsible. That’s weirdly attractive.']},
    {t:'One cantina wouldn’t hurt.',r:['One. And you’re buying. With the money that’s left over, mister.']}]},
   {open:['Showed up early. Didn’t whine. Got it done. You’d last a week in my line of work. Maybe two. Come find me after work. This invitation’s personal.'],opts:[
    {t:'Make it a month.',r:['A month? Okay, now you’re flirting with me. Keep going.']},
    {t:'Only a week?',r:['A week’s a lot. Most guys don’t make it to Tuesday.']}]},
   {open:['That meeting would’ve bored me into a coma. You sat through it and still got the real work done after. Impressive. You’ve got a smile I’d happily cross the landing field to see.'],opts:[
    {t:'I always finish the job.',r:['Now that’s a line I’d put on a wanted poster. Next to your face.']},
    {t:'I zoned out twice.',r:['Only twice? Pro. I’d have shot the projector.']}]}],
  codex:'Here’s the contract you wrote yourself. Fine print and all.',
  ack:'Signed. I’ll come collect if you don’t.',
  done:{open:['Board’s cleared. I’m off duty, and I’d like dinner with you. Nobody’s paying me to say that.','* She holds your gaze, waiting for your answer.'],opts:[
   {t:'Post tomorrow’s board.',r:['Already on it. Bring coffee. I’ll bring the trouble.']},
   {t:'I’d like that. Stay with me.',r:['* She sets her hat aside. “I want to stay with you tonight. Just talking is a good place to start.”']}]}},

 carol:{
  cheers:[
   {open:['Good. That was a real push today. Not a fake one where you look busy.','I can tell the difference. I flew with guys who faked it. I like that confident look. Keep it when you come over here.'],opts:[
    {t:'Pushing again tomorrow.',r:['That’s what I like to hear. Full throttle, flyboy.']},
    {t:'I looked busy a little.',r:['A little. Then you actually did it. I’ll allow it.']}]},
   {open:['* Carol lands with a soft thump, still glowing a bit.','You hit the deadline. Didn’t even need an extension. Look at you. I’ve been looking for an excuse to take you flying. A date works.'],opts:[
    {t:'Next one too.',r:['Yeah you will. I don’t miss, and neither do you lately.']},
    {t:'Barely hit it.',r:['Barely counts. I’ve landed on fumes plenty. Still landed.']}]},
   {open:['You got knocked down today. That thing at work. And then you got back up and finished it.','That’s my favorite thing about people. That’s my favorite thing about you. You’ve got me paying attention. That’s not easy to do from orbit.'],opts:[
    {t:'I’ll always get back up.',r:['I know. That’s why I keep coming back here.']},
    {t:'It was a small knockdown.',r:['Small ones count. They add up. So do the get-ups.']}]},
   {open:['Two hours of deep work. Phone in a drawer. Goose sat on it the whole time, by the way. Save me a little of that stubbornness. I like it on you.'],opts:[
    {t:'Two more tomorrow.',r:['Deal. Goose will guard it again. He takes it very seriously.']},
    {t:'Is Goose okay?',r:['Goose is great. Goose ate a fly. Goose is a cat, mostly.']}]}],
  codex:'Hey. You wrote this. Pretend it’s a mission brief and read it.',
  ack:'Copy that. I’ll be on your wing.',
  done:{open:['Mission complete. I’m taking the night off. Come have dinner with me before somebody calls from space.','* She holds your gaze, waiting for your answer.'],opts:[
   {t:'Same flight plan tomorrow.',r:['Wheels up at dawn, then. I’ll race you.']},
   {t:'I’d like that. Stay with me.',r:['* She settles beside you. “I’m not flying off. I want to see how the rest of this evening goes.”']}]}},

 gamora:{
  cheers:[
   {open:['You did it right the first time. No redo. Quill could learn something from you. I notice capable hands. I am noticing yours.'],opts:[
    {t:'Right the first time, always.',r:['Good. I don’t say this often. I’m impressed.']},
    {t:'Low bar, honestly.',r:['It is. You cleared it with room to spare. Take the compliment.']}]},
   {open:['* Gamora leans on the doorframe, arms crossed.','You stayed late and fixed it yourself. You didn’t wait for someone else to. Stay when the work is finished. I would like your company.'],opts:[
    {t:'That’s my job now.',r:['Then you’re the only one on my crew who believes that. Stay that way.']},
    {t:'I wanted to go home.',r:['But you didn’t. That’s the part that counts. Now go home.']}]},
   {open:['You helped a coworker today when it cost you time. Loyalty like that is rare.','Most people I grew up with would have used the moment to get ahead. You keep holding my attention. I have stopped pretending it is accidental.'],opts:[
    {t:'I’ll do it again.',r:['I know you will. That’s why I trust you.']},
    {t:'They owe me lunch now.',r:['Smart. Collect. Then bring me some.']}]},
   {open:['Work done. No drama. No dancing about it. Unlike some people I know. Come sit beside me. I prefer you within reach.'],opts:[
    {t:'Same tomorrow.',r:['Good. One of us has to be the adult on this ship.']},
    {t:'I might dance a little.',r:['* She almost smiles.','Fine. One dance. Then back to work.']}]}],
  codex:'Your own words. Read them. You meant them when you wrote them.',
  ack:'Then I’ll see it done. Don’t make me come find you.',
  done:{open:['The work is finished. I want the evening with you. There is no tactical reason.','* She holds your gaze, waiting for your answer.'],opts:[
   {t:'Bet on me again tomorrow.',r:['I will. I don’t lose bets. I don’t plan to start with you.']},
   {t:'I’d like that. Stay with me.',r:['* She sets her blade aside. “I want to kiss you again. This time, you may close the distance.”']}]}},

 virginia:{
  cheers:[
   {open:['Clean work. No wasted motion. I watched you skip three distractions without blinking.','Darrow would have punched two of them. I’m finding it difficult to keep this interest professional.'],opts:[
    {t:'Watch me do it again.',r:['Oh, I will. Watching you get things done is my new favorite pastime.']},
    {t:'Only three?',r:['Three that I counted. I stopped counting when you started looking that focused.']}]},
   {open:['You negotiated today and didn’t fold. I had my money on you. You have a very distracting way of concentrating. I’d like to test it over dinner.'],opts:[
    {t:'I never fold.',r:['Careful. Talk like that and I’ll start recruiting you for the Senate.']},
    {t:'I nearly folded.',r:['Nearly isn’t folding. Nearly is just the part where it gets interesting.']}]},
   {open:['* Virginia slides your ledger back across the table.','You checked your budget. Line by line. That’s more than half my senators manage. Numbers settled. Now look at me. I’ve been waiting.'],opts:[
    {t:'Every week from now on.',r:['Every week. I’ll hold you to it. I hold everyone to things. I enjoy it.']},
    {t:'It was mostly coffee.',r:['It usually is. Coffee is a strategic expense. I’ll allow it.']}]},
   {open:['You thought two steps ahead today. Not one. Two.','Most people never manage it. Keep up and you might get to three. I’ve cleared an hour for you. I suspect I’ll want two.'],opts:[
    {t:'I’ll get to three.',r:['Prove it. I’ll be waiting at three with a glass of wine.']},
    {t:'You’re always at ten.',r:['Eleven. But who’s counting? Me. I’m counting.']}]}],
  codex:'You wrote this. I read it already, of course. Now you do it.',
  ack:'Good. I like a man who keeps his word. Rarer than gold.',
  done:{open:['Every task finished. Excellent. I’ve spent the last hour finding excuses to keep you here. I’d rather just ask.','* She holds your gaze, waiting for your answer.'],opts:[
   {t:'Same campaign tomorrow.',r:['Then I’ll draw up the plan tonight. Bring your brain. And yourself.']},
   {t:'I’d like that. Stay with me.',r:['* She sets her pen down. “Stay. I want to kiss you without a report arriving halfway through.”']}]}},

 leia:{
  cheers:[
   {open:['Look at that. Your to-do list, actually done. Han never once finished a list in his life. Now look up. I’ve been trying to catch your eye for five minutes.'],opts:[
    {t:'I’ll finish it again tomorrow.',r:['Good. Somebody around here should be reliable. Might as well be you.']},
    {t:'Han sounds fun.',r:['Han was fun. Han was also always in debt. Pick a lane, laserbrain.']}]},
   {open:['You kept your cool in that meeting. I could tell you wanted to throw something. I like knowing you’ll follow through. Particularly on a dinner invitation.'],opts:[
    {t:'Cool head, every time.',r:['That’s how you win a war. Or a quarterly review. Same thing.']},
    {t:'I wanted to throw a chair.',r:['Me too. Senate meetings were worse. I owe you a drink for surviving.']}]},
   {open:['* Leia taps your ledger with one finger.','Books balanced. Bills paid. The Rebellion should have hired you. Come back when the room’s quiet. I’d like your attention without an audience.'],opts:[
    {t:'Balanced next month too.',r:['Now you’re just trying to impress me. It’s working.']},
    {t:'I hate spreadsheets.',r:['Everybody hates spreadsheets. Winners do them anyway.']}]},
   {open:['You did the boring part first. Got it out of the way. Smart.','I’d make you a general for that. Maybe a lieutenant. Let’s not get crazy. That smile’s distracting. Bring it closer.'],opts:[
    {t:'Boring part first, always.',r:['Good. You’re learning. And you look good doing it.']},
    {t:'Only a lieutenant?',r:['Earn it. I’ll be watching. Closely.']}]}],
  codex:'Here. Your own orders. Don’t make me read them to you twice.',
  ack:'Good. I knew I could count on you.',
  done:{open:['The general is off duty. I want dinner, a quiet corner, and you beside me. In whatever order works.','* She holds your gaze, waiting for your answer.'],opts:[
   {t:'Same op tomorrow.',r:['Briefing at dawn. Don’t be late. And don’t be cute about it.']},
   {t:'I’d like that. Stay with me.',r:['* She puts the last of her work aside and turns toward you.','* She holds your hand instead of letting go. “No, stay. I wasn’t being polite. I want you here.”']}]}},

 // ---------------- Home ----------------
 kate:{
  cheers:[
   {open:['Dishes done? Like, actually done, not soaking? Okay. Respect.','Lucky licked the last plate, but I’ll still count it. You’re making this very difficult to call a friendly visit.'],opts:[
    {t:'Doing them every night now.',r:['Look at you. Responsible. That’s kind of hot, not gonna lie.']},
    {t:'Lucky helped.',r:['Lucky helps with everything. Lucky is a menace. Lucky is perfect.']}]},
   {open:['* Kate leans on the porch rail, bow slung over her shoulder.','You fixed that squeaky door. I would’ve just shot it. Kidding. Mostly. I like watching you work. I’d like taking you out even more.'],opts:[
    {t:'Next I’m fixing the gutter.',r:['Ooh. Ladder time. I’ll hold it. Totally won’t be checking you out.']},
    {t:'It still squeaks a bit.',r:['A little squeak is character. That’s what I tell my landlord.']}]},
   {open:['Laundry folded and put away? Not the chair pile? Wow. Clint lives out of a duffel bag. You’re my hero. Come sit with me. Lucky can survive not being the center of attention.'],opts:[
    {t:'No more chair pile.',r:['I’m holding you to that. I’ll check. Unannounced.']},
    {t:'The chair misses it.',r:['The chair will survive. The chair has been through worse.']}]},
   {open:['Took out the trash before anyone asked. That’s like, elite-level adulting. I’ve got dinner plans. They’re you. And pizza, but mostly you.'],opts:[
    {t:'Before anyone asks, always.',r:['Okay, now you’re showing off. Keep showing off.']},
    {t:'It was starting to smell.',r:['Hey, still counts. Noses are a valid alarm system.']}]}],
  codex:'Okay, you wrote this. Hold still, I’m making you read it.',
  ack:'Nice. Bullseye. Knew you had it.',
  done:{open:['Chores done. I booked us a table. I can be organized when I really want to kiss the person opposite me.','* She holds your gaze, waiting for your answer.'],opts:[
   {t:'Same tomorrow.',r:['Deal. Pizza tonight, though. We earned it. Lucky too.']},
   {t:'I’d like that. Stay with me.',r:['* She puts the pizza box aside. “I want another kiss. I can ask for things without making a joke.”']}]}},

 gwen:{
  cheers:[
   {open:['You made the bed. My dad taught me to start there, too. I’d like to see the rest of the place over dinner sometime.'],opts:[
    {t:'I’m keeping this going.',r:['Good. I like knowing I’ll see you back here tomorrow.']},
    {t:'I’d like some time with you tonight.',r:['Meet me after the set. I want a little time without the whole band.']}]},
   {open:['* She sets her own work aside and turns toward you.','Dishes finished, even the pan. You’ve cleared room for an evening off. Want to spend some of it with me?'],opts:[
    {t:'I’m keeping this going.',r:['Good. I like knowing I’ll see you back here tomorrow.']},
    {t:'I’d like some time with you tonight.',r:['Meet me after the set. I want a little time without the whole band.']}]},
   {open:['You fixed what needed fixing. I like that. Come by the studio later, and I promise I’m not asking for repairs.'],opts:[
    {t:'I’m keeping this going.',r:['Good. I like knowing I’ll see you back here tomorrow.']},
    {t:'I’d like some time with you tonight.',r:['Meet me after the set. I want a little time without the whole band.']}]},
   {open:['You reset the house before bed. I do the same after a late set. It’s better having someone to say goodnight to.'],opts:[
    {t:'I’m keeping this going.',r:['Good. I like knowing I’ll see you back here tomorrow.']},
    {t:'I’d like some time with you tonight.',r:['Meet me after the set. I want a little time without the whole band.']}]}],
  codex:'Hey! Found your note. You wrote this. It’s actually pretty good.',
  ack:'Yes! Okay! Let’s go! I believe in you.',
  done:{open:['All done? Meet me after the set. I want to take you somewhere quiet enough to hear each other.','* She holds your gaze, waiting for your answer.'],opts:[
   {t:'Same again tomorrow.',r:['Heck yes. Teamwork. I’ll bring snacks, you bring that energy.']},
   {t:'I’d like that. Stay with me.',r:['* She puts the last of her work aside and turns toward you.','* She sets her drumsticks down. “I meant a date. I’d like to kiss you at the end of it.”']}]}},

 ororo:{
  cheers:[
   {open:['* Ororo brushes soil from her hands and smiles at you.','You cleaned the kitchen. Thoroughly. A home is tended, not just lived in. I find careful hands very attractive. Yours in particular.'],opts:[
    {t:'I’ll tend it every day.',r:['Then it will grow with you. And so will I.']},
    {t:'It took forever.',r:['Good things take time. Gardens. Homes. People.']}]},
   {open:['I grew up on the streets of Cairo. I learned to treasure a clean floor and a roof that doesn’t leak.','You fixed that leak today. Thank you. The evening’s warm. Come share it with me on the roof.'],opts:[
    {t:'Nothing leaks on my watch.',r:['I believe you. You have steady hands. I noticed.']},
    {t:'It was a tiny leak.',r:['Tiny leaks become floods. I know weather. Trust me.']}]},
   {open:['You watered the plants without being asked. They noticed. I noticed. I would like your attention here for a moment. Yes, on me.'],opts:[
    {t:'They’re mine to care for.',r:['Spoken like a gardener. Come to the roof later. I’ll show you mine.']},
    {t:'Do plants notice?',r:['Oh, they do. They lean toward people who care for them. So do I.']}]},
   {open:['* A gentle breeze moves through the room.','You made this place feel lighter today. Uncluttered. Calm. I’ve been looking forward to having you close, without anything else to tend.'],opts:[
    {t:'I’ll keep it calm.',r:['Then I will keep the skies clear for you.']},
    {t:'Was that breeze you?',r:['* She just smiles and doesn’t answer.']}]}],
  codex:'Here is something you planted. Your own words. Read them slowly.',
  ack:'Good. Then let it take root.',
  done:{open:['The house is settled. Come upstairs with me. I’ve been finding the distance between us rather unnecessary.','* She holds your gaze, waiting for your answer.'],opts:[
   {t:'Tomorrow too.',r:['I know. Sit with me on the roof and watch the stars first.']},
   {t:'I’d like that. Stay with me.',r:['* She puts the last of her work aside and turns toward you.','* She turns toward you on the roof. “I wanted the evening with you. Stay close. The weather can take care of itself.”']}]}},

 kay:{
  cheers:[
   {open:['* Nix chitters from Kay’s shoulder.','You cleaned out the garage. Nix is impressed. I’m impressed. ND-5 says “adequate.” I like seeing you put down roots. Makes me want to stay nearby.'],opts:[
    {t:'Next I’m doing the attic.',r:['Look at you, building a real home base. I like this version of you.']},
    {t:'ND says that about everything.',r:['He said it about a sunset once. A Toshara sunset. The droid has no soul.']}]},
   {open:['You fixed the thing you’ve been putting off for a month. I saw.','I’ve put things off for years. You make it look easy. That deserves dinner. With me. I know a place that doesn’t ask questions.'],opts:[
    {t:'No more putting things off.',r:['Okay, scoundrel. That’s a promise. I’m holding it.']},
    {t:'It wasn’t easy.',r:['I know. That’s why it counts. Nix, give him a treat.']}]},
   {open:['Most of my life, home was wherever I didn’t get arrested. You’re making a real one.','It’s nice to watch. Really nice. I keep picturing your face when I come through the door.'],opts:[
    {t:'And I’m keeping it.',r:['* She nudges your shoulder with hers.','Good. Save me a spot on the couch.']},
    {t:'You never got arrested?',r:['Never got caught. Different thing. Totally different.']}]},
   {open:['Vacuumed and everything. Nix actually likes the vacuum. Weird little guy. Nix can entertain himself. I want a minute alone with you.'],opts:[
    {t:'Every week now.',r:['A routine? Wow. Okay. You’re turning respectable on me.']},
    {t:'Nix likes everything.',r:['Not true. He hates ND. Well. ND hates him first.']}]}],
  codex:'Found this note. You wrote it. Read it before I steal it.',
  ack:'Deal. Shake on it. Scoundrel’s honor.',
  done:{open:['Everything’s settled. Come aboard. I’m making dinner, and for once I’m not planning an escape route.','* She holds your gaze, waiting for your answer.'],opts:[
   {t:'Then stay. Same tomorrow.',r:['Okay. I’ll stay. Don’t make me regret it, scoundrel.']},
   {t:'I’d like that. Stay with me.',r:['* She leaves your hand in hers. “I want to stay. No joke, no getaway. Just that.”']}]}},

 annamarie:{
  cheers:[
   {open:['Well, look at you, sugar. Supper dishes washed and dried. My mama would’ve hugged you. You know I’m watchin’, sugar. I’m not bein’ subtle about it.'],opts:[
    {t:'Every night, darlin’.',r:['Darlin’? Oh, I like that. Keep it up and I’ll make you pie.']},
    {t:'Can I get a hug?',r:['* She tugs her gloves tighter and wraps you up anyway.','Gloves on. Hug’s still real.']}]},
   {open:['* Anna Marie rocks on the porch swing, sweet tea in hand.','You mowed the lawn, too. Whole yard smells like summer. Come sit on the swing with me. I saved the side that leans toward mine.'],opts:[
    {t:'Next weekend too.',r:['I’ll have the tea ready. And a seat right next to me.']},
    {t:'I hate mowing.',r:['Everybody hates mowing, honey. You did it anyway. That’s grit.']}]},
   {open:['You made the bed and set the table. A house doesn’t keep itself, sugar. You know that. I’ve been looking forward to havin’ you close all evening.'],opts:[
    {t:'I’ll keep this house.',r:['That’s what I wanted to hear. That’s a man worth coming home to.']},
    {t:'I forgot the forks.',r:['Shoot, we’ll eat with our hands. I’m from Mississippi.']}]},
   {open:['Front porch swept. Door open. Everybody’s welcome now.','That’s how a home ought to feel. That smile’s dangerous, darlin’. Bring it over here.'],opts:[
    {t:'Always open.',r:['Mm. You and me, we’ll make this the warmest house in the village.']},
    {t:'Even Logan?',r:['Even Logan. He wipes his boots or he sleeps in the barn.']}]}],
  codex:'Now, you wrote this down yourself, sugar. Read it again.',
  ack:'That’s my boy. Knew you would.',
  done:{open:['All finished, sugar. Come sit close. I’ve spent enough of today thinking about the last time you kissed me.','* She holds your gaze, waiting for your answer.'],opts:[
   {t:'Same again tomorrow.',r:['Then tomorrow I’ll make cornbread. Deal?']},
   {t:'I’d like that. Stay with me.',r:['* She takes out the silk scarf, smiling. “I know a way to do that safely. If you’re still interested, darlin’.”']}]}},

 // ---------------- Discipline ----------------
 violet:{
  cheers:[
   {open:['You put the phone down. I watched you. You didn’t even look at it again.','That’s harder than flying Tairn. And Tairn hates me. It’s annoying how much I like that determined look on you.'],opts:[
    {t:'Phone stays down.',r:['Good. I’ll check. I check everything. It’s why I’m still alive.']},
    {t:'Tairn doesn’t hate you.',r:['Tairn tolerates me. That’s dragon for love. Probably.']}]},
   {open:['Up early. Before the house woke. That’s how I survived Basgiath.','The quadrant didn’t care how tired I was. Neither did my daggers. Come sit beside me. I’ve found a much better distraction than my book.'],opts:[
    {t:'Early again tomorrow.',r:['Then I’ll be up too. We can be miserable together. It helps.']},
    {t:'I was really tired.',r:['I know. Tired and up anyway. That’s the whole skill.']}]},
   {open:['* Violet sharpens a dagger, not looking up.','You stuck to your plan. The whole thing. Didn’t cut corners. I like your hands when you’re concentrating. There, I said it.'],opts:[
    {t:'No corners cut.',r:['Then you’re more prepared than half my year. Stay that way.']},
    {t:'Want me to sharpen one?',r:['* She hands you one, eyebrows up.','Careful. These are my favorites.']}]},
   {open:['You read for twenty minutes instead of scrolling. I noticed.','Books saved my life more than once. Literally. You’ve been distracting me all evening. I’d prefer you did it closer.'],opts:[
    {t:'Twenty more tomorrow.',r:['Make it thirty and I’ll lend you one of mine. Don’t crease it.']},
    {t:'It was a boring book.',r:['Boring books are the ones that teach you things. Still count.']}]}],
  codex:'Here’s your note. Read it like it’s a field manual.',
  ack:'Good. I’ll be watching your back.',
  done:{open:['Routine’s done. Find me in the archives. I’ve decided I’d rather spend tonight with you than a book.','* She holds your gaze, waiting for your answer.'],opts:[
   {t:'Same drill tomorrow.',r:['Then sleep. Real sleep. That’s an order from a rider.']},
   {t:'I’d like that. Stay with me.',r:['* She sets her book aside and meets your eyes. “I want another kiss. Don’t make me footnote it.”']}]}},

 alleria:{
  cheers:[
   {open:['You held your focus for an hour. No distractions. Not one glance away.','In three hundred years, I’ve seen few humans manage that. I notice the things you don’t say. The way you look at me, for instance.'],opts:[
    {t:'An hour again tomorrow.',r:['Then I will be there to see it. I don’t miss much. Including you.']},
    {t:'Three hundred years?',r:['Give or take. An elf doesn’t count. Focus, please.']}]},
   {open:['* Alleria lowers her bow, eyes still on the target.','You turned off the screen when you said you would. Clean shot. Come walk with me. I prefer your company to watching from a distance.'],opts:[
    {t:'Every night, same time.',r:['Good. A ranger keeps her watch. So do you, apparently.']},
    {t:'It was hard.',r:['Most worthwhile things are. That’s why so few bother.']}]},
   {open:['You didn’t let the noise pull you off course today.','My sisters would be impressed. Sylvanas less so. She’s never impressed. You have my attention. I would like yours, without that screen between us.'],opts:[
    {t:'I won’t get pulled off.',r:['I believe you. Now hold that line, tomorrow and after.']},
    {t:'Your sisters sound intense.',r:['Intense is a kind word. Vereesa is the sweet one. I’m the sharp one.']}]},
   {open:['You kept your morning routine. Every step.','A ranger who skips the small things misses the big target. Meet me beneath the trees. I would rather ask you to stay in person.'],opts:[
    {t:'Every step, every morning.',r:['Good. Then you’re ready for the hunt. Ready for me, too.']},
    {t:'Even skipped coffee?',r:['No. Keep the coffee. I’m disciplined, not cruel.']}]}],
  codex:'You wrote this. Take aim and read it again.',
  ack:'Good. Steady. Loose when ready.',
  done:{open:['The watch is finished. Walk with me into the quiet. Tonight I would like to be close to you.','* She holds your gaze, waiting for your answer.'],opts:[
   {t:'Same aim tomorrow.',r:['Then I’ll be at the range at dawn. Bring your best.']},
   {t:'I’d like that. Stay with me.',r:['* She lowers her bow and takes your hand. “I chose this evening for us. I would like you to stay.”']}]}},

 vex:{
  cheers:[
   {open:['You stayed under budget today! Not a single impulse buy. I’m so proud I could steal something. You’ve saved enough to take me to dinner. I’m free tonight, darling.'],opts:[
    {t:'Under budget all week.',r:['Ooh, look at you. Trinket, he’s practically a merchant now.']},
    {t:'I almost bought something.',r:['Almost doesn’t cost gold, darling. Almost is free.']}]},
   {open:['* Trinket grumbles beside Vex and flops on your feet.','You put the phone away for dinner. Trinket noticed. So did I. I rather like being the person you put it away for.'],opts:[
    {t:'No phone at dinner, ever.',r:['Good. Then I get your full attention. I’ll make it worth it.']},
    {t:'Trinket’s on my feet.',r:['That means he likes you. Or he’s cold. Both, probably.']}]},
   {open:['You actually kept to your schedule. Every hour.','Vox Machina never managed that. Grog thinks a calendar is a snack. You made time. Now make a little for me. I’m asking nicely.'],opts:[
    {t:'Schedule holds tomorrow.',r:['Good. A ranger who keeps her promises loves a man who keeps his.']},
    {t:'Did Grog eat one?',r:['Twice. Scanlan wrote a song about it. Terrible song.']}]},
   {open:['You kept your word today. Even the small promise. Especially the small one. I like a man who keeps his word. Especially about seeing me again.'],opts:[
    {t:'I always will.',r:['Mm. That’s worth more than gold. And I know my gold.']},
    {t:'It was a tiny promise.',r:['Tiny promises are how you know who to trust. Trust me.']}]}],
  codex:'Darling, you wrote this. Read it again, it’s worth the price.',
  ack:'Good. Deal struck. No haggling.',
  done:{open:['All finished, darling. Put the work away. I’ve been deciding whether to ask for a kiss or simply admit I want one.','* She holds your gaze, waiting for your answer.'],opts:[
   {t:'Same deal tomorrow.',r:['Then it’s a deal. And I drive a very hard bargain.']},
   {t:'I’d like that. Stay with me.',r:['* She draws her chair closer. “Both, apparently. I want one. May I?”']}]}},

 laezel:{
  cheers:[
   {open:['Hm. You completed your training. No weakness. Tolerable. I enjoy watching you improve. I would also enjoy seeing you after training.'],opts:[
    {t:'Again tomorrow.',r:['Good. Tsk’va. I expected nothing less. I expected slightly less.']},
    {t:'Tolerable?',r:['From me, that is a song of praise. Do not make me sing again.']}]},
   {open:['* Lae’zel narrows her eyes at your phone, now face down on the table.','You put away the glowing distraction. Wise. The creche would approve. Now your attention is free. Give me some of it.'],opts:[
    {t:'It stays face down.',r:['Good. Your enemies cannot distract you if you do not look at them.']},
    {t:'Is the phone my enemy?',r:['Everything is your enemy until proven otherwise. Learn this.']}]},
   {open:['You woke at the hour you set. Not after.','Most istik sleep until the sun mocks them. You did not. Hm. You are becoming difficult to ignore. I have stopped trying.'],opts:[
    {t:'Same hour tomorrow.',r:['Then we will train together. Do not slow me down.']},
    {t:'Istik?',r:['Outsider. Soft one. You are less soft today. Barely.']}]},
   {open:['You did not quit when it became boring. That is discipline.','Discipline is not glory. It is repetition. You are learning. I admire your resolve. Come closer and let me say it properly.'],opts:[
    {t:'I won’t quit.',r:['I know. I watched you. I watch you often. That is… tactical.']},
    {t:'It was really boring.',r:['Boredom is a test. You passed. Do not celebrate. Fine. Celebrate a little.']}]}],
  codex:'Read your own words. Do not flinch from them.',
  ack:'Good. Your word is a blade. Keep it sharp.',
  done:{open:['Your work is finished. I want you close. You may stop inventing reasons to remain across the room.'],opts:[
   {t:'Tomorrow I do it again.',r:['Then I will be there to judge you. Favorably, if you earn it.']},
   {t:'I’d like that. Stay with me.',r:['* She puts the last of her work aside and turns toward you.','* She meets your eyes. “Yes, I am asking. I would rather have your willing company than anyone’s obedience.”']}]}},

 natasha:{
  cheers:[
   {open:['You stuck to the plan. Didn’t improvise when you didn’t have to.','That’s how I stayed alive in Budapest. Clint says otherwise. I noticed. I also noticed you looking at me. I liked that part.'],opts:[
    {t:'Plan holds tomorrow too.',r:['Good. I like a man who sticks to a plan. Rare.']},
    {t:'What happened in Budapest?',r:['Classified. Maybe I’ll tell you over a drink. Maybe.']}]},
   {open:['* Natasha watches you set your phone in a drawer.','No screens after nine. You actually did it. I’m almost surprised. Now look up. I’d rather have your attention without stealing it.'],opts:[
    {t:'Every night now.',r:['Then you’re harder to compromise than most agents. I like that.']},
    {t:'Almost surprised?',r:['I don’t get surprised. I adjust. Today I adjusted my opinion of you. Up.']}]},
   {open:['Morning drills done. No skipping. No excuses.','I run mine every day. Old habit. Good habit. I’m free tonight. That’s information you can act on.'],opts:[
    {t:'Drills every morning.',r:['Then meet me at six. I’ll go easy. That’s a lie.']},
    {t:'You run them at five.',r:['Four-thirty. But I’m not trying to scare you off.']}]},
   {open:['You didn’t waste a minute today. Nothing frittered away.','Wasted time is a debt. You’re paying yours down. Come sit beside me. You don’t need a cover story.'],opts:[
    {t:'Paying it down daily.',r:['Good. A clean slate looks good on you.']},
    {t:'I wasted a little.',r:['Everyone wastes a little. You wasted less. That’s the point.']}]}],
  codex:'You wrote this down. Read it like it’s your cover story. Memorize it.',
  ack:'Good. I’ll know if you’re lying.',
  done:{open:['All finished. Good. No cover story tonight. I wanted to see you, and I want to kiss you.','* She holds your gaze, waiting for your answer.'],opts:[
   {t:'Same op tomorrow.',r:['Then get some sleep, agent. You’ll need it.']},
   {t:'I’d like that. Stay with me.',r:['* She puts the last of her work aside and turns toward you.','* She keeps your hand in hers. “Stay. I’m not planning an exit this time.”']}]}},

 hermione:{
  cheers:[
   {open:['* Hermione glances up from a stack of Ministry files.','You followed your schedule. The whole thing. Color-coded and everything? I find competence attractive. You’re making it hard to finish this report.'],opts:[
    {t:'Color-coded tomorrow too.',r:['Oh, good. I might have to start sending you memos. Personal ones.']},
    {t:'It wasn’t color-coded.',r:['Well, that’s step two. I’ll lend you my highlighters. Don’t lose the purple one.']}]},
   {open:['You got up early and did your routine before work. I do that too, you know. Before the Ministry swallows the day. I left my evening free. That was a hint. This is me making it clearer.'],opts:[
    {t:'Early again tomorrow.',r:['Then I’ll have the kettle on. Don’t be late, I time it.']},
    {t:'Do you ever sleep in?',r:['Once. In 2009. It was a disaster. Never again.']}]},
   {open:['You closed the apps and actually focused. Honestly, that’s more than most of the Wizengamot can manage. I’ve read the same sentence four times. You could at least come sit closer.'],opts:[
    {t:'Apps stay closed.',r:['Good. I’d hex your phone myself, but I’d rather you chose it.']},
    {t:'Wizengamot has apps?',r:['No. They have gossip. Same effect. Worse, actually.']}]},
   {open:['You finished the task you’d been dreading. First thing.','That’s exactly how I got through my seventh-year exams. And some Ministry reforms. I’m rather hoping you’ll ask what I’m doing tonight.'],opts:[
    {t:'Dreaded tasks first, always.',r:['Brilliant. You’re practically a Ravenclaw. Don’t tell anyone I said that.']},
    {t:'It wasn’t that bad.',r:['They never are once you start. That’s the secret nobody likes to hear.']}]}],
  codex:'Here. You wrote this. Read it properly, not just a skim.',
  ack:'Good. I’ve made a note of it. Two, actually.',
  done:{open:['Every task finished. Good. I’ve read the same paragraph six times, and it’s entirely your fault. Come sit with me.','* She holds your gaze, waiting for your answer.'],opts:[
   {t:'Same list tomorrow.',r:['Then I’ll draw up tomorrow’s with you tonight. Bring tea.']},
   {t:'I’d like that. Stay with me.',r:['* She puts the last of her work aside and turns toward you.','* She closes the book. “I want to kiss you. I’ve decided to be clear instead of spending another hour hinting.”']}]}},

 // ---------------- Hobbies ----------------
 misty:{
  cheers:[
   {open:['You made time for something you enjoy. Good. I’d like to be part of your next evening off.'],opts:[
    {t:'I’m keeping this going.',r:['Good. I like knowing I’ll see you back here tomorrow.']},
    {t:'I’d like some time with you tonight.',r:['Meet me by the lake. I’d rather have you beside me than wonder if you’ll ask.']}]},
   {open:['* She sets her own work aside and turns toward you.','An hour with your book, no phone. I find that attention attractive. I’d enjoy a little of it over dinner.'],opts:[
    {t:'I’m keeping this going.',r:['Good. I like knowing I’ll see you back here tomorrow.']},
    {t:'I’d like some time with you tonight.',r:['Meet me by the lake. I’d rather have you beside me than wonder if you’ll ask.']}]},
   {open:['You worked on your project. I like seeing you pleased with yourself. Come show me what you made.'],opts:[
    {t:'I’m keeping this going.',r:['Good. I like knowing I’ll see you back here tomorrow.']},
    {t:'I’d like some time with you tonight.',r:['Meet me by the lake. I’d rather have you beside me than wonder if you’ll ask.']}]},
   {open:['* She sets her own work aside and turns toward you.','You took a real break. I booked a table by the water, if you’d like the next one to be with me.'],opts:[
    {t:'I’m keeping this going.',r:['Good. I like knowing I’ll see you back here tomorrow.']},
    {t:'I’d like some time with you tonight.',r:['Meet me by the lake. I’d rather have you beside me than wonder if you’ll ask.']}]}],
  codex:'Hey! You wrote this down. Read it, it’s actually good!',
  ack:'Yes! Okay, let’s go! Water-type energy!',
  done:{open:['Everything’s finished. Meet me at the dock. No contest tonight. I just want time with you.','* She holds your gaze, waiting for your answer.'],opts:[
   {t:'Same again tomorrow.',r:['That’s my friend! Okay, tomorrow, then fishing. Deal!']},
   {t:'I’d like that. Stay with me.',r:['* She takes your hand and smiles. “I wanted to kiss you at sunset. Still sounds like a good plan.”']}]}},

 rumi:{
  cheers:[
   {open:['* Rumi hums a few bars, still flushed from rehearsal.','You practiced today. Real practice. Not just noodling around. I can always tell. I kept looking for you during rehearsal. It’s becoming obvious.'],opts:[
    {t:'Practice again tomorrow.',r:['Yes! That’s the spirit. Every single day. That’s the only secret.']},
    {t:'Noodling counts a little.',r:['A little. Like humming in the shower. Which, yes, I do too.']}]},
   {open:['You made something today. With your own hands.','That’s how I stay me. Music. You found yours. Come hear the new song. I wrote part of it thinking about you.'],opts:[
    {t:'I’ll make more tomorrow.',r:['Then I’ll write a song about it. Not a cheesy one. Maybe a little cheesy.']},
    {t:'It wasn’t very good.',r:['Mine weren’t either. At first. Then they were. Keep going.']}]},
   {open:['You put the phone down and picked up something real.','The demons love distraction. Don’t give them any. I’d like your attention somewhere quieter than backstage.'],opts:[
    {t:'No distractions. Promise.',r:['Good. Then you’re basically a demon hunter now. Honorary.']},
    {t:'Demons have phones?',r:['Worse. They have notifications. Same thing, really.']}]},
   {open:['You learned something new today! I saw you trying. It looked like fun. I like the way you watch me when the audience is gone.'],opts:[
    {t:'Learning more tomorrow.',r:['Yes! Okay, we’ll learn something together next time. Duet?']},
    {t:'It looked like frustration.',r:['Frustration is just fun that hasn’t clicked yet. Trust me.']}]}],
  codex:'Here. You wrote this. Read it like a lyric.',
  ack:'Okay. That’s a promise. I heard it. So did the Honmoon.',
  done:{open:['The work’s done. Meet me after the lights go down. I want to be with you without a crowd listening.','* She holds your gaze, waiting for your answer.'],opts:[
   {t:'Same setlist tomorrow.',r:['Yes! We’ll do it again. Louder this time.']},
   {t:'I’d like that. Stay with me.',r:['* She puts the last of her work aside and turns toward you.','* She sets the microphone down. “That part was for you. This kiss is, too.”']}]}},

 jester:{
  cheers:[
   {open:['Oh my gosh! You did your fun thing today! The Traveler says that’s SO important! Come celebrate with me. I mean a date. I can say date.'],opts:[
    {t:'Every day, I promise!',r:['Yay! Okay, I’m drawing you a picture to celebrate. It has a dragon in it.']},
    {t:'Does the Traveler really care?',r:['He cares SO much. Also he likes pranks. So maybe hide your boots.']}]},
   {open:['* Jester bounces up with a paintbrush, blue paint on her nose.','You made something! Was it art? Was it a pastry? Was it a prank?! I keep drawing your smile. I’d rather see it up close.'],opts:[
    {t:'And more tomorrow!',r:['Oh, this is the best day. Okay, tomorrow we make pastries. Big ones.']},
    {t:'You have paint on your nose.',r:['On purpose. It’s a look. Fjord said it’s a look.']}]},
   {open:['You read a book instead of scrolling! Caleb would be so proud. He’d cry. Okay, he wouldn’t, but inside. I saved you the good pastry. This is flirting, in case you’re wondering.'],opts:[
    {t:'Another chapter tomorrow.',r:['Yes! And then you tell me ALL about it. Especially the kissing parts.']},
    {t:'It was a long book.',r:['Long books are the best! More pages, more adventure.']}]},
   {open:['You played today! Really played! Fun is sacred, you know. I made that a rule. You look happy. I would very much like to kiss that face.'],opts:[
    {t:'Sacred fun, every day.',r:['Ooh, you’re a convert! Okay, I’m giving you a holy symbol. It’s a donut.']},
    {t:'Who made you pope?',r:['Me! I’m very official. I have a hat. Somewhere.']}]}],
  codex:'Oooh, you wrote this! It’s so good! Read it again, okay?',
  ack:'Yay! Pinky swear! You can’t break a pinky swear!',
  done:{open:['All done? Good. I planned a date. Candles, dinner, no prank. I want you to take this part seriously.','* She holds your gaze, waiting for your answer.'],opts:[
   {t:'Same again tomorrow!',r:['Yes yes yes! I’m telling the Traveler. He’s gonna be so jealous.']},
   {t:'I’d like that. Stay with me.',r:['* Her teasing smile softens. “Yes, I’m having fun. I’m also very serious about wanting you here.”']}]}},

 mira:{
  cheers:[
   {open:['You practiced. I watched. You didn’t slack on the hard part.','That’s rare. Most people skip the hard eight counts. I like watching you concentrate. It makes rehearsal difficult.'],opts:[
    {t:'Hard part again tomorrow.',r:['Good. I’ll be there. Don’t embarrass me.']},
    {t:'I almost skipped it.',r:['But you didn’t. That’s the only part that counts.']}]},
   {open:['* Mira leans against the mirror, arms crossed.','You guarded your time today. Didn’t let anyone steal it. Now you’ve got some time. Spend a little of it with me.'],opts:[
    {t:'I’ll guard it daily.',r:['Then you get it. Rehearsal time is sacred. Don’t give it up.']},
    {t:'Someone tried to.',r:['Someone always tries. You said no. That’s the skill.']}]},
   {open:['You finished something. Actually finished it. No half-done projects in a drawer. I like follow-through. Come find me after the studio empties.'],opts:[
    {t:'Finishing more tomorrow.',r:['Okay. I might actually be impressed. Don’t tell Zoey.']},
    {t:'There’s a drawer full.',r:['Mine’s a closet. We all have one. Just don’t add to it.']}]},
   {open:['You moved today. Danced, ran, played. Whatever. It clears your head.','I can tell. You look sharper. You look good. I’m not adding a joke to make that easier to hear.'],opts:[
    {t:'Moving every day now.',r:['Good. Then maybe I’ll teach you a routine. Maybe.']},
    {t:'I danced badly.',r:['Bad dancing is still dancing. Better than standing still.']}]}],
  codex:'You wrote this. Read it like choreography. Every step.',
  ack:'Good. I’ll hold you to it. I hold everyone to things.',
  done:{open:['You’re finished? Good. I want your attention on me for a while. Come here.','* She holds your gaze, waiting for your answer.'],opts:[
   {t:'Same routine tomorrow.',r:['Then we run it again. Five, six, seven, eight.']},
   {t:'I’d like that. Stay with me.',r:['* She puts the last of her work aside and turns toward you.','* She stays close after the kiss. “Better. I’ve been waiting to do that all afternoon.”']}]}},

 zoey:{
  cheers:[
   {open:['You wrote something today! Even a little! That counts! Most days mine is just words, too. I was hoping you’d have time to hear something I wrote about you.'],opts:[
    {t:'Writing again tomorrow.',r:['Yes! Notebook buddies! Let’s compare pages. Mine has doodles.']},
    {t:'It was just a few lines.',r:['A few lines is a verse! A verse is basically a song! Basically!']}]},
   {open:['* Zoey flips her notebook open and taps a page.','You learned something today. I’m putting it in a rhyme. Hold on. I keep getting distracted by your smile. That’s going in the song, too.'],opts:[
    {t:'Learn more tomorrow.',r:['Then I’ll need a bigger notebook. Okay, I already have like five.']},
    {t:'Rhyme it with what?',r:['Uh. Mind? Grind? Kind? I’ll get there. Give me a sec.']}]},
   {open:['You made something for fun! Not work! Just fun!','That’s my favorite kind. That’s where the good stuff comes from. Come sit next to me. I’ve spent enough time trying to describe you.'],opts:[
    {t:'More fun tomorrow.',r:['Yes! Okay, I’m hyped. That’s the hook for my next song.']},
    {t:'Fun feels lazy sometimes.',r:['No! Fun is fuel! Rumi says so. Mira rolls her eyes, but she agrees.']}]},
   {open:['You picked up your hobby instead of the phone. That’s huge!','I’m so proud. I’d rap about it, but you’d cringe. I’ve been looking forward to seeing you all day. No rhyme, just true.'],opts:[
    {t:'Hobby over phone, always.',r:['Yes! Okay, I’m rapping about it anyway. Sorry. Not sorry.']},
    {t:'I might cringe a little.',r:['A little cringe never hurt. It’s basically my brand.']}]}],
  codex:'You wrote this! Read it again! It’s a good line, honestly!',
  ack:'Yes! Locked in! I’m writing that down!',
  done:{open:['All done? I’ve got dinner waiting. I wanted a date with you, so I finally planned one.','* She holds your gaze, waiting for your answer.'],opts:[
   {t:'Same again tomorrow.',r:['Yes! Sequel album! Even better! I’m hyped!']},
   {t:'I’d like that. Stay with me.',r:['* She puts the notebook away. “I want to remember how this feels without writing over it. Kiss me?”']}]}},

 ana:{
  cheers:[
   {open:['You tried something new today! I knew you would! Was it scary? It looked a bit scary. You’re very attractive when you commit to something. A date, for instance.'],opts:[
    {t:'New thing tomorrow too.',r:['Yes! I’ve got a list. A very long list. Some of it’s legal.']},
    {t:'It was terrifying.',r:['Perfect! Terrifying means it’s working. That’s basically Gryffindor rule one.']}]},
   {open:['* Ana twirls her wand and a little shower of sparks pops over your head.','You practiced! Proper practice! Charms take ages too, you know. I’ve been looking for an excuse to ask you out. I think I’ll just ask.'],opts:[
    {t:'Practicing every day.',r:['Brilliant! Then next week, we try something actually dangerous.']},
    {t:'Did you just set my hair on fire?',r:['Only a little. It’s fine. It’s out now. Mostly.']}]},
   {open:['You read a whole chapter! Not even a spellbook! I’m proud. Also, lend it to me. Come read beside me. I promise nothing about how much reading gets done.'],opts:[
    {t:'Another one tomorrow.',r:['Yes! Then we swap. I’ve got a book about dragons. It bites.']},
    {t:'It’s not that exciting.',r:['Everything’s exciting if you read it in a funny voice. Try it.']}]},
   {open:['You played today. Like, actually played. No work brain.','That’s the best kind of magic. Nobody teaches that at Hogwarts. I like seeing you enjoy yourself. Especially when I’m the reason.'],opts:[
    {t:'Playing again tomorrow.',r:['Yes! I’ll bring the Exploding Snap. Eyebrows optional.']},
    {t:'Felt a bit silly.',r:['Silly is the best! Silly is basically a superpower.']}]}],
  codex:'Ooh, look, you wrote this! Read it like a spell. With feeling!',
  ack:'Yes! Spell cast! No take-backs!',
  done:{open:['Everything done? Meet me downstairs. I’ve booked dinner, and I want you looking at me across the table.','* She holds your gaze, waiting for your answer.'],opts:[
   {t:'Same again tomorrow!',r:['Yes! Adventure every day! That’s the plan!']},
   {t:'I’d like that. Stay with me.',r:['* She puts the last of her work aside and turns toward you.','* She puts her wand away. “No charm. I wanted a kiss, and I wanted it from you.”']}]}},
};
