// Cheers (task-completion pop-ups), Family part B. See docs/WRITING-BRIEF.md, "Cheers".
// cheers: after a habit in her life area. codex: lead-in to one of his own Codex notes. ack: reply when he commits.
// done: when every daily is finished. M = {open:[1-2 lines], opts:[{t:'player reply', r:['her answer']} x2]}.
// Gwen and Misty are strictly platonic. Hermione is written as an adult in her Ministry years.

/** @type {Record<string,{cheers:any[],codex:string,ack:string,done:any}>} */
export const CHEERS={
 // ---------------- Work ----------------
 jaina:{
  cheers:[
   {open:['A full block of focused work. No wandering off. Do you know how rare that is? I’ve commanded fleets that couldn’t manage it.'],opts:[
    {t:'Same course tomorrow.',r:['Good. Hold the heading. I’ll be watching the horizon with you.']},
    {t:'Fleets have more snacks.',r:['They have worse snacks. Trust me. Kul Tiran hardtack could sink a ship.']}]},
   {open:['You planned the day before it started. That’s how my mother ran Kul Tiras.','I spent years learning that the hard way. You’re ahead of me.'],opts:[
    {t:'I’ll plan tomorrow tonight.',r:['Then I’ll bring the tea and the charts. You bring that look of yours.']},
    {t:'Your mother sounds scary.',r:['She was. She’d have liked you, though. Grudgingly.']}]},
   {open:['* Jaina flicks a little frost off her fingertips and smiles.','That hard email you kept dodging. You sent it. I saw your shoulders drop.'],opts:[
    {t:'No more dodging.',r:['That’s an admiral talking. I could get used to hearing it.']},
    {t:'I hid behind you a little.',r:['I noticed. I didn’t mind. Do it again sometime.']}]},
   {open:['I made mistakes that cost cities. Yours today cost an hour. You fixed it and kept going. That’s the whole trick.'],opts:[
    {t:'Then I keep going.',r:['Yes. Steady hands, long view. You’re learning faster than I did.']},
    {t:'An hour felt like a city.',r:['It always does in the moment. Come sit. Tell me about it.']}]}],
  codex:'You wrote this when your head was clear. Read it like orders from yourself.',
  ack:'Then it’s settled. I’ll hold you to it, gently.',
  done:{open:['Every task, done. In Dalaran they’d call that a miracle. I call it you being stubborn in the right direction.'],opts:[
   {t:'Same again tomorrow.',r:['I’ll meet you at the harbor at dawn. Don’t be late, Admiral’s orders.']},
   {t:'Now I’m off duty.',r:['Off duty. Good. Walk me along the docks, then. No talk of work.']}]}},

 nash:{
  cheers:[
   {open:['Job done, on time, no fuss. That’s how I like my contracts. And my men.'],opts:[
    {t:'Next contract’s mine.',r:['Ha. Look at you, hungry. Keep that up and I’ll have to share my bounties.']},
    {t:'Do I get paid now?',r:['You get a wink. Market rate. Don’t push your luck, cowboy.']}]},
   {open:['* Nash spins her blaster once and holsters it.','You got paid and you put some away. Smart. Most hunters blow it all on the first cantina.'],opts:[
    {t:'Saving more next time.',r:['Look at you, fiscally responsible. That’s weirdly attractive.']},
    {t:'One cantina wouldn’t hurt.',r:['One. And you’re buying. With the money that’s left over, mister.']}]},
   {open:['Showed up early. Didn’t whine. Got it done. You’d last a week in my line of work. Maybe two.'],opts:[
    {t:'Make it a month.',r:['A month? Okay, now you’re flirting with me. Keep going.']},
    {t:'Only a week?',r:['A week’s a lot. Most guys don’t make it to Tuesday.']}]},
   {open:['That meeting would’ve bored me into a coma. You sat through it and still got the real work done after. Impressive.'],opts:[
    {t:'I always finish the job.',r:['Now that’s a line I’d put on a wanted poster. Next to your face.']},
    {t:'I zoned out twice.',r:['Only twice? Pro. I’d have shot the projector.']}]}],
  codex:'Here’s the contract you wrote yourself. Fine print and all.',
  ack:'Signed. I’ll come collect if you don’t.',
  done:{open:['Every job on the board, closed out. Clean sweep. Not a single loose end.','You know how rare that is? I’m almost jealous.'],opts:[
   {t:'Post tomorrow’s board.',r:['Already on it. Bring coffee. I’ll bring the trouble.']},
   {t:'Buy you a drink?',r:['Thought you’d never ask. Your tab, though. You earned it.']}]}},

 carol:{
  cheers:[
   {open:['Good. That was a real push today. Not a fake one where you look busy.','I can tell the difference. I flew with guys who faked it.'],opts:[
    {t:'Pushing again tomorrow.',r:['That’s what I like to hear. Full throttle, flyboy.']},
    {t:'I looked busy a little.',r:['A little. Then you actually did it. I’ll allow it.']}]},
   {open:['* Carol lands with a soft thump, still glowing a bit.','You hit the deadline. Didn’t even need an extension. Look at you.'],opts:[
    {t:'Next one too.',r:['Yeah you will. I don’t miss, and neither do you lately.']},
    {t:'Barely hit it.',r:['Barely counts. I’ve landed on fumes plenty. Still landed.']}]},
   {open:['You got knocked down today. That thing at work. And then you got back up and finished it.','That’s my favorite thing about people. That’s my favorite thing about you.'],opts:[
    {t:'I’ll always get back up.',r:['I know. That’s why I keep coming back here.']},
    {t:'It was a small knockdown.',r:['Small ones count. They add up. So do the get-ups.']}]},
   {open:['Two hours of deep work. Phone in a drawer. Goose sat on it the whole time, by the way.'],opts:[
    {t:'Two more tomorrow.',r:['Deal. Goose will guard it again. He takes it very seriously.']},
    {t:'Is Goose okay?',r:['Goose is great. Goose ate a fly. Goose is a cat, mostly.']}]}],
  codex:'Hey. You wrote this. Pretend it’s a mission brief and read it.',
  ack:'Copy that. I’ll be on your wing.',
  done:{open:['Every single one. Done. You flew the whole mission today.','Monica would say I’m getting soft. I’m a little proud of you.'],opts:[
   {t:'Same flight plan tomorrow.',r:['Wheels up at dawn, then. I’ll race you.']},
   {t:'Wanna get a burger?',r:['Do I ever. Loser of the race buys. Which will be you.']}]}},

 gamora:{
  cheers:[
   {open:['You did it right the first time. No redo. Quill could learn something from you.'],opts:[
    {t:'Right the first time, always.',r:['Good. I don’t say this often. I’m impressed.']},
    {t:'Low bar, honestly.',r:['It is. You cleared it with room to spare. Take the compliment.']}]},
   {open:['* Gamora leans on the doorframe, arms crossed.','You stayed late and fixed it yourself. You didn’t wait for someone else to.'],opts:[
    {t:'That’s my job now.',r:['Then you’re the only one on my crew who believes that. Stay that way.']},
    {t:'I wanted to go home.',r:['But you didn’t. That’s the part that counts. Now go home.']}]},
   {open:['You helped a coworker today when it cost you time. Loyalty like that is rare.','Most people I grew up with would have used the moment to get ahead.'],opts:[
    {t:'I’ll do it again.',r:['I know you will. That’s why I trust you.']},
    {t:'They owe me lunch now.',r:['Smart. Collect. Then bring me some.']}]},
   {open:['Work done. No drama. No dancing about it. Unlike some people I know.'],opts:[
    {t:'Same tomorrow.',r:['Good. One of us has to be the adult on this ship.']},
    {t:'I might dance a little.',r:['* She almost smiles.','Fine. One dance. Then back to work.']}]}],
  codex:'Your own words. Read them. You meant them when you wrote them.',
  ack:'Then I’ll see it done. Don’t make me come find you.',
  done:{open:['Everything done. Every task. I checked twice.','Rocket owes me ten units. I bet on you.'],opts:[
   {t:'Bet on me again tomorrow.',r:['I will. I don’t lose bets. I don’t plan to start with you.']},
   {t:'What do I get?',r:['Half. And I’ll let you sit next to me tonight. Don’t make it weird.']}]}},

 virginia:{
  cheers:[
   {open:['Clean work. No wasted motion. I watched you skip three distractions without blinking.','Darrow would have punched two of them.'],opts:[
    {t:'Watch me do it again.',r:['Oh, I will. Watching you get things done is my new favorite pastime.']},
    {t:'Only three?',r:['Three that I counted. I stopped counting when you started looking that focused.']}]},
   {open:['You negotiated today and didn’t fold. I had my money on you.'],opts:[
    {t:'I never fold.',r:['Careful. Talk like that and I’ll start recruiting you for the Senate.']},
    {t:'I nearly folded.',r:['Nearly isn’t folding. Nearly is just the part where it gets interesting.']}]},
   {open:['* Virginia slides your ledger back across the table.','You checked your budget. Line by line. That’s more than half my senators manage.'],opts:[
    {t:'Every week from now on.',r:['Every week. I’ll hold you to it. I hold everyone to things. I enjoy it.']},
    {t:'It was mostly coffee.',r:['It usually is. Coffee is a strategic expense. I’ll allow it.']}]},
   {open:['You thought two steps ahead today. Not one. Two.','Most people never manage it. Keep up and you might get to three.'],opts:[
    {t:'I’ll get to three.',r:['Prove it. I’ll be waiting at three with a glass of wine.']},
    {t:'You’re always at ten.',r:['Eleven. But who’s counting? Me. I’m counting.']}]}],
  codex:'You wrote this. I read it already, of course. Now you do it.',
  ack:'Good. I like a man who keeps his word. Rarer than gold.',
  done:{open:['Every task cleared. You ran the whole day like a campaign.','I’d have given you a legion for less.'],opts:[
   {t:'Same campaign tomorrow.',r:['Then I’ll draw up the plan tonight. Bring your brain. And yourself.']},
   {t:'I’ll take the legion.',r:['You’ll take dinner with me instead. Better offer. Trust me.']}]}},

 leia:{
  cheers:[
   {open:['Look at that. Your to-do list, actually done. Han never once finished a list in his life.'],opts:[
    {t:'I’ll finish it again tomorrow.',r:['Good. Somebody around here should be reliable. Might as well be you.']},
    {t:'Han sounds fun.',r:['Han was fun. Han was also always in debt. Pick a lane, laserbrain.']}]},
   {open:['You kept your cool in that meeting. I could tell you wanted to throw something.'],opts:[
    {t:'Cool head, every time.',r:['That’s how you win a war. Or a quarterly review. Same thing.']},
    {t:'I wanted to throw a chair.',r:['Me too. Senate meetings were worse. I owe you a drink for surviving.']}]},
   {open:['* Leia taps your ledger with one finger.','Books balanced. Bills paid. The Rebellion should have hired you.'],opts:[
    {t:'Balanced next month too.',r:['Now you’re just trying to impress me. It’s working.']},
    {t:'I hate spreadsheets.',r:['Everybody hates spreadsheets. Winners do them anyway.']}]},
   {open:['You did the boring part first. Got it out of the way. Smart.','I’d make you a general for that. Maybe a lieutenant. Let’s not get crazy.'],opts:[
    {t:'Boring part first, always.',r:['Good. You’re learning. And you look good doing it.']},
    {t:'Only a lieutenant?',r:['Earn it. I’ll be watching. Closely.']}]}],
  codex:'Here. Your own orders. Don’t make me read them to you twice.',
  ack:'Good. I knew I could count on you.',
  done:{open:['Everything done. Every last one. You ran this day like an operation.','I don’t hand out medals often. Don’t get used to it.'],opts:[
   {t:'Same op tomorrow.',r:['Briefing at dawn. Don’t be late. And don’t be cute about it.']},
   {t:'Where’s my medal?',r:['* She kisses your cheek, quick.','That’s the medal. Don’t lose it.']}]}},

 // ---------------- Home ----------------
 kate:{
  cheers:[
   {open:['Dishes done? Like, actually done, not soaking? Okay. Respect.','Lucky licked the last plate, but I’ll still count it.'],opts:[
    {t:'Doing them every night now.',r:['Look at you. Responsible. That’s kind of hot, not gonna lie.']},
    {t:'Lucky helped.',r:['Lucky helps with everything. Lucky is a menace. Lucky is perfect.']}]},
   {open:['* Kate leans on the porch rail, bow slung over her shoulder.','You fixed that squeaky door. I would’ve just shot it. Kidding. Mostly.'],opts:[
    {t:'Next I’m fixing the gutter.',r:['Ooh. Ladder time. I’ll hold it. Totally won’t be checking you out.']},
    {t:'It still squeaks a bit.',r:['A little squeak is character. That’s what I tell my landlord.']}]},
   {open:['Laundry folded and put away? Not the chair pile? Wow. Clint lives out of a duffel bag. You’re my hero.'],opts:[
    {t:'No more chair pile.',r:['I’m holding you to that. I’ll check. Unannounced.']},
    {t:'The chair misses it.',r:['The chair will survive. The chair has been through worse.']}]},
   {open:['Took out the trash before anyone asked. That’s like, elite-level adulting.'],opts:[
    {t:'Before anyone asks, always.',r:['Okay, now you’re showing off. Keep showing off.']},
    {t:'It was starting to smell.',r:['Hey, still counts. Noses are a valid alarm system.']}]}],
  codex:'Okay, you wrote this. Hold still, I’m making you read it.',
  ack:'Nice. Bullseye. Knew you had it.',
  done:{open:['Every single thing done. The house looks amazing. You look kinda amazing.','Lucky’s doing his happy spin.'],opts:[
   {t:'Same tomorrow.',r:['Deal. Pizza tonight, though. We earned it. Lucky too.']},
   {t:'Lucky’s always spinning.',r:['True. But today it means something. Probably.']}]}},

 gwen:{
  cheers:[
   {open:['Made your bed! Look at you! See, that’s how the world gets saved, one boring thing at a time.'],opts:[
    {t:'Every morning, I promise.',r:['Yesss. I’m telling Miles. He still doesn’t make his.']},
    {t:'Barely made it.',r:['Lumpy bed is still a bed. Counts. I don’t make the rules. Okay, I do.']}]},
   {open:['* Gwen hangs upside down from the porch beam, grinning.','You did the dishes without being asked! My dad would’ve framed that.'],opts:[
    {t:'I’ll keep doing them.',r:['You’re basically a superhero now. Lowercase, but still.']},
    {t:'Get down from there.',r:['Nope. Best view in the house. Also, way more fun.']}]},
   {open:['You swept the whole porch! I tried that once and got distracted drumming on the broom.'],opts:[
    {t:'Tomorrow I’ll do the steps too.',r:['Okay, overachiever! Love that energy. Rock on.']},
    {t:'Broom drumming sounds fun.',r:['It is! Don’t tell anyone. I have a reputation.']}]},
   {open:['Took care of the boring chores today. That’s honestly the most heroic thing anyone does around here.'],opts:[
    {t:'Small things, every day.',r:['Exactly! You get it! Okay, high five. Up top.']},
    {t:'Feels less heroic.',r:['Heroic stuff usually does. Trust me, I’ve fought a Vulture.']}]}],
  codex:'Hey! Found your note. You wrote this. It’s actually pretty good.',
  ack:'Yes! Okay! Let’s go! I believe in you.',
  done:{open:['Everything done! The house is spotless! Whole day crushed!','You deserve a victory drum solo. Hang on.'],opts:[
   {t:'Same again tomorrow.',r:['Heck yes. Teamwork. I’ll bring snacks, you bring that energy.']},
   {t:'Play me a song.',r:['* She drums on the porch rail, way too fast, and grins.','That one’s called “Chores Are Punk.”']}]}},

 ororo:{
  cheers:[
   {open:['* Ororo brushes soil from her hands and smiles at you.','You cleaned the kitchen. Thoroughly. A home is tended, not just lived in.'],opts:[
    {t:'I’ll tend it every day.',r:['Then it will grow with you. And so will I.']},
    {t:'It took forever.',r:['Good things take time. Gardens. Homes. People.']}]},
   {open:['I grew up on the streets of Cairo. I learned to treasure a clean floor and a roof that doesn’t leak.','You fixed that leak today. Thank you.'],opts:[
    {t:'Nothing leaks on my watch.',r:['I believe you. You have steady hands. I noticed.']},
    {t:'It was a tiny leak.',r:['Tiny leaks become floods. I know weather. Trust me.']}]},
   {open:['You watered the plants without being asked. They noticed. I noticed.'],opts:[
    {t:'They’re mine to care for.',r:['Spoken like a gardener. Come to the roof later. I’ll show you mine.']},
    {t:'Do plants notice?',r:['Oh, they do. They lean toward people who care for them. So do I.']}]},
   {open:['* A gentle breeze moves through the room.','You made this place feel lighter today. Uncluttered. Calm.'],opts:[
    {t:'I’ll keep it calm.',r:['Then I will keep the skies clear for you.']},
    {t:'Was that breeze you?',r:['* She just smiles and doesn’t answer.']}]}],
  codex:'Here is something you planted. Your own words. Read them slowly.',
  ack:'Good. Then let it take root.',
  done:{open:['Everything done. The whole house is at peace.','Even the clouds are behaving tonight, for you.'],opts:[
   {t:'Tomorrow too.',r:['I know. Sit with me on the roof and watch the stars first.']},
   {t:'Could you make it rain?',r:['* A soft rain starts, just over the garden. She laughs.','Only a little. The tomatoes needed it.']}]}},

 kay:{
  cheers:[
   {open:['* Nix chitters from Kay’s shoulder.','You cleaned out the garage. Nix is impressed. I’m impressed. ND-5 says “adequate.”'],opts:[
    {t:'Next I’m doing the attic.',r:['Look at you, building a real home base. I like this version of you.']},
    {t:'ND says that about everything.',r:['He said it about a sunset once. A Toshara sunset. The droid has no soul.']}]},
   {open:['You fixed the thing you’ve been putting off for a month. I saw.','I’ve put things off for years. You make it look easy.'],opts:[
    {t:'No more putting things off.',r:['Okay, scoundrel. That’s a promise. I’m holding it.']},
    {t:'It wasn’t easy.',r:['I know. That’s why it counts. Nix, give him a treat.']}]},
   {open:['Most of my life, home was wherever I didn’t get arrested. You’re making a real one.','It’s nice to watch. Really nice.'],opts:[
    {t:'And I’m keeping it.',r:['* She nudges your shoulder with hers.','Good. Save me a spot on the couch.']},
    {t:'You never got arrested?',r:['Never got caught. Different thing. Totally different.']}]},
   {open:['Vacuumed and everything. Nix actually likes the vacuum. Weird little guy.'],opts:[
    {t:'Every week now.',r:['A routine? Wow. Okay. You’re turning respectable on me.']},
    {t:'Nix likes everything.',r:['Not true. He hates ND. Well. ND hates him first.']}]}],
  codex:'Found this note. You wrote it. Read it before I steal it.',
  ack:'Deal. Shake on it. Scoundrel’s honor.',
  done:{open:['Every chore done. Ship’s clean, crew’s fed, home is solid.','I could actually stay a while.'],opts:[
   {t:'Then stay. Same tomorrow.',r:['Okay. I’ll stay. Don’t make me regret it, scoundrel.']},
   {t:'Nix can stay too.',r:['Nix already decided he lives here. I’m just catching up.']}]}},

 annamarie:{
  cheers:[
   {open:['Well, look at you, sugar. Supper dishes washed and dried. My mama would’ve hugged you.'],opts:[
    {t:'Every night, darlin’.',r:['Darlin’? Oh, I like that. Keep it up and I’ll make you pie.']},
    {t:'Can I get a hug?',r:['* She tugs her gloves tighter and wraps you up anyway.','Gloves on. Hug’s still real.']}]},
   {open:['* Anna Marie rocks on the porch swing, sweet tea in hand.','You mowed the lawn, too. Whole yard smells like summer.'],opts:[
    {t:'Next weekend too.',r:['I’ll have the tea ready. And a seat right next to me.']},
    {t:'I hate mowing.',r:['Everybody hates mowing, honey. You did it anyway. That’s grit.']}]},
   {open:['You made the bed and set the table. A house doesn’t keep itself, sugar. You know that.'],opts:[
    {t:'I’ll keep this house.',r:['That’s what I wanted to hear. That’s a man worth coming home to.']},
    {t:'I forgot the forks.',r:['Shoot, we’ll eat with our hands. I’m from Mississippi.']}]},
   {open:['Front porch swept. Door open. Everybody’s welcome now.','That’s how a home ought to feel.'],opts:[
    {t:'Always open.',r:['Mm. You and me, we’ll make this the warmest house in the village.']},
    {t:'Even Logan?',r:['Even Logan. He wipes his boots or he sleeps in the barn.']}]}],
  codex:'Now, you wrote this down yourself, sugar. Read it again.',
  ack:'That’s my boy. Knew you would.',
  done:{open:['Every chore done. The house is shining. Supper’s on the table.','Come sit. You earned it.'],opts:[
   {t:'Same again tomorrow.',r:['Then tomorrow I’ll make cornbread. Deal?']},
   {t:'Is there pie?',r:['There is always pie. What do you take me for?']}]}},

 // ---------------- Discipline ----------------
 violet:{
  cheers:[
   {open:['You put the phone down. I watched you. You didn’t even look at it again.','That’s harder than flying Tairn. And Tairn hates me.'],opts:[
    {t:'Phone stays down.',r:['Good. I’ll check. I check everything. It’s why I’m still alive.']},
    {t:'Tairn doesn’t hate you.',r:['Tairn tolerates me. That’s dragon for love. Probably.']}]},
   {open:['Up early. Before the house woke. That’s how I survived Basgiath.','The quadrant didn’t care how tired I was. Neither did my daggers.'],opts:[
    {t:'Early again tomorrow.',r:['Then I’ll be up too. We can be miserable together. It helps.']},
    {t:'I was really tired.',r:['I know. Tired and up anyway. That’s the whole skill.']}]},
   {open:['* Violet sharpens a dagger, not looking up.','You stuck to your plan. The whole thing. Didn’t cut corners.'],opts:[
    {t:'No corners cut.',r:['Then you’re more prepared than half my year. Stay that way.']},
    {t:'Want me to sharpen one?',r:['* She hands you one, eyebrows up.','Careful. These are my favorites.']}]},
   {open:['You read for twenty minutes instead of scrolling. I noticed.','Books saved my life more than once. Literally.'],opts:[
    {t:'Twenty more tomorrow.',r:['Make it thirty and I’ll lend you one of mine. Don’t crease it.']},
    {t:'It was a boring book.',r:['Boring books are the ones that teach you things. Still count.']}]}],
  codex:'Here’s your note. Read it like it’s a field manual.',
  ack:'Good. I’ll be watching your back.',
  done:{open:['Everything done. Routine kept. Phone stayed down.','I don’t say this often. I’m proud of you.'],opts:[
   {t:'Same drill tomorrow.',r:['Then sleep. Real sleep. That’s an order from a rider.']},
   {t:'Fly me somewhere?',r:['Ask Tairn. Actually, don’t. He’ll laugh at you.']}]}},

 alleria:{
  cheers:[
   {open:['You held your focus for an hour. No distractions. Not one glance away.','In three hundred years, I’ve seen few humans manage that.'],opts:[
    {t:'An hour again tomorrow.',r:['Then I will be there to see it. I don’t miss much. Including you.']},
    {t:'Three hundred years?',r:['Give or take. An elf doesn’t count. Focus, please.']}]},
   {open:['* Alleria lowers her bow, eyes still on the target.','You turned off the screen when you said you would. Clean shot.'],opts:[
    {t:'Every night, same time.',r:['Good. A ranger keeps her watch. So do you, apparently.']},
    {t:'It was hard.',r:['Most worthwhile things are. That’s why so few bother.']}]},
   {open:['You didn’t let the noise pull you off course today.','My sisters would be impressed. Sylvanas less so. She’s never impressed.'],opts:[
    {t:'I won’t get pulled off.',r:['I believe you. Now hold that line, tomorrow and after.']},
    {t:'Your sisters sound intense.',r:['Intense is a kind word. Vereesa is the sweet one. I’m the sharp one.']}]},
   {open:['You kept your morning routine. Every step.','A ranger who skips the small things misses the big target.'],opts:[
    {t:'Every step, every morning.',r:['Good. Then you’re ready for the hunt. Ready for me, too.']},
    {t:'Even skipped coffee?',r:['No. Keep the coffee. I’m disciplined, not cruel.']}]}],
  codex:'You wrote this. Take aim and read it again.',
  ack:'Good. Steady. Loose when ready.',
  done:{open:['Every task done. Your focus held all day.','Turalyon would call it remarkable. I’ll call it a good start.'],opts:[
   {t:'Same aim tomorrow.',r:['Then I’ll be at the range at dawn. Bring your best.']},
   {t:'Only a good start?',r:['From me, that’s high praise. Don’t make me repeat it.']}]}},

 vex:{
  cheers:[
   {open:['You stayed under budget today! Not a single impulse buy. I’m so proud I could steal something.'],opts:[
    {t:'Under budget all week.',r:['Ooh, look at you. Trinket, he’s practically a merchant now.']},
    {t:'I almost bought something.',r:['Almost doesn’t cost gold, darling. Almost is free.']}]},
   {open:['* Trinket grumbles beside Vex and flops on your feet.','You put the phone away for dinner. Trinket noticed. So did I.'],opts:[
    {t:'No phone at dinner, ever.',r:['Good. Then I get your full attention. I’ll make it worth it.']},
    {t:'Trinket’s on my feet.',r:['That means he likes you. Or he’s cold. Both, probably.']}]},
   {open:['You actually kept to your schedule. Every hour.','Vox Machina never managed that. Grog thinks a calendar is a snack.'],opts:[
    {t:'Schedule holds tomorrow.',r:['Good. A ranger who keeps her promises loves a man who keeps his.']},
    {t:'Did Grog eat one?',r:['Twice. Scanlan wrote a song about it. Terrible song.']}]},
   {open:['You kept your word today. Even the small promise. Especially the small one.'],opts:[
    {t:'I always will.',r:['Mm. That’s worth more than gold. And I know my gold.']},
    {t:'It was a tiny promise.',r:['Tiny promises are how you know who to trust. Trust me.']}]}],
  codex:'Darling, you wrote this. Read it again, it’s worth the price.',
  ack:'Good. Deal struck. No haggling.',
  done:{open:['Every task done, and you didn’t waste a single copper.','I might actually be swooning. Don’t tell Percy.'],opts:[
   {t:'Same deal tomorrow.',r:['Then it’s a deal. And I drive a very hard bargain.']},
   {t:'Swooning, huh?',r:['A little. Trinket, look away. Mummy’s flirting.']}]}},

 laezel:{
  cheers:[
   {open:['Hm. You completed your training. No weakness. Tolerable.'],opts:[
    {t:'Again tomorrow.',r:['Good. Tsk’va. I expected nothing less. I expected slightly less.']},
    {t:'Tolerable?',r:['From me, that is a song of praise. Do not make me sing again.']}]},
   {open:['* Lae’zel narrows her eyes at your phone, now face down on the table.','You put away the glowing distraction. Wise. The creche would approve.'],opts:[
    {t:'It stays face down.',r:['Good. Your enemies cannot distract you if you do not look at them.']},
    {t:'Is the phone my enemy?',r:['Everything is your enemy until proven otherwise. Learn this.']}]},
   {open:['You woke at the hour you set. Not after.','Most istik sleep until the sun mocks them. You did not. Hm.'],opts:[
    {t:'Same hour tomorrow.',r:['Then we will train together. Do not slow me down.']},
    {t:'Istik?',r:['Outsider. Soft one. You are less soft today. Barely.']}]},
   {open:['You did not quit when it became boring. That is discipline.','Discipline is not glory. It is repetition. You are learning.'],opts:[
    {t:'I won’t quit.',r:['I know. I watched you. I watch you often. That is… tactical.']},
    {t:'It was really boring.',r:['Boredom is a test. You passed. Do not celebrate. Fine. Celebrate a little.']}]}],
  codex:'Read your own words. Do not flinch from them.',
  ack:'Good. Your word is a blade. Keep it sharp.',
  done:{open:['Every task. Done. I am… impressed. This does not happen often.'],opts:[
   {t:'Tomorrow I do it again.',r:['Then I will be there to judge you. Favorably, if you earn it.']},
   {t:'Admit you like me.',r:['* She scowls, then almost smiles.','I tolerate you exceptionally. Do not push.']}]}},

 natasha:{
  cheers:[
   {open:['You stuck to the plan. Didn’t improvise when you didn’t have to.','That’s how I stayed alive in Budapest. Clint says otherwise.'],opts:[
    {t:'Plan holds tomorrow too.',r:['Good. I like a man who sticks to a plan. Rare.']},
    {t:'What happened in Budapest?',r:['Classified. Maybe I’ll tell you over a drink. Maybe.']}]},
   {open:['* Natasha watches you set your phone in a drawer.','No screens after nine. You actually did it. I’m almost surprised.'],opts:[
    {t:'Every night now.',r:['Then you’re harder to compromise than most agents. I like that.']},
    {t:'Almost surprised?',r:['I don’t get surprised. I adjust. Today I adjusted my opinion of you. Up.']}]},
   {open:['Morning drills done. No skipping. No excuses.','I run mine every day. Old habit. Good habit.'],opts:[
    {t:'Drills every morning.',r:['Then meet me at six. I’ll go easy. That’s a lie.']},
    {t:'You run them at five.',r:['Four-thirty. But I’m not trying to scare you off.']}]},
   {open:['You didn’t waste a minute today. Nothing frittered away.','Wasted time is a debt. You’re paying yours down.'],opts:[
    {t:'Paying it down daily.',r:['Good. A clean slate looks good on you.']},
    {t:'I wasted a little.',r:['Everyone wastes a little. You wasted less. That’s the point.']}]}],
  codex:'You wrote this down. Read it like it’s your cover story. Memorize it.',
  ack:'Good. I’ll know if you’re lying.',
  done:{open:['Every task. Done. Clean operation.','I’ve worked with Avengers who couldn’t pull that off.'],opts:[
   {t:'Same op tomorrow.',r:['Then get some sleep, agent. You’ll need it.']},
   {t:'Which Avengers?',r:['* She just smiles.','All of them. Especially Tony.']}]}},

 hermione:{
  cheers:[
   {open:['* Hermione glances up from a stack of Ministry files.','You followed your schedule. The whole thing. Color-coded and everything?'],opts:[
    {t:'Color-coded tomorrow too.',r:['Oh, good. I might have to start sending you memos. Personal ones.']},
    {t:'It wasn’t color-coded.',r:['Well, that’s step two. I’ll lend you my highlighters. Don’t lose the purple one.']}]},
   {open:['You got up early and did your routine before work. I do that too, you know. Before the Ministry swallows the day.'],opts:[
    {t:'Early again tomorrow.',r:['Then I’ll have the kettle on. Don’t be late, I time it.']},
    {t:'Do you ever sleep in?',r:['Once. In 2009. It was a disaster. Never again.']}]},
   {open:['You closed the apps and actually focused. Honestly, that’s more than most of the Wizengamot can manage.'],opts:[
    {t:'Apps stay closed.',r:['Good. I’d hex your phone myself, but I’d rather you chose it.']},
    {t:'Wizengamot has apps?',r:['No. They have gossip. Same effect. Worse, actually.']}]},
   {open:['You finished the task you’d been dreading. First thing.','That’s exactly how I got through my seventh-year exams. And some Ministry reforms.'],opts:[
    {t:'Dreaded tasks first, always.',r:['Brilliant. You’re practically a Ravenclaw. Don’t tell anyone I said that.']},
    {t:'It wasn’t that bad.',r:['They never are once you start. That’s the secret nobody likes to hear.']}]}],
  codex:'Here. You wrote this. Read it properly, not just a skim.',
  ack:'Good. I’ve made a note of it. Two, actually.',
  done:{open:['Every task complete. Your entire list. I’m almost a bit jealous.','Shall I make you a certificate? I could. I have parchment.'],opts:[
   {t:'Same list tomorrow.',r:['Then I’ll draw up tomorrow’s with you tonight. Bring tea.']},
   {t:'Make me a certificate.',r:['* She writes one with a flourish and hands it over.','Signed and sealed. Frame it. I mean it.']}]}},

 // ---------------- Hobbies ----------------
 misty:{
  cheers:[
   {open:['You actually did something fun today? Finally! I was about to drag you to the lake myself.'],opts:[
    {t:'Fun every day from now on.',r:['Yes! That’s what I like to hear! Starmie’s doing a happy spin!']},
    {t:'You’d really drag me?',r:['By the ear, if I have to. Ask Ash. He knows.']}]},
   {open:['* Misty grins, fishing rod over one shoulder.','You read your book for a whole hour! Without checking your phone once!'],opts:[
    {t:'Another hour tomorrow.',r:['That’s the spirit! Next time, read by the water. It’s better there.']},
    {t:'Psyduck distracted me.',r:['Psyduck distracts everyone. He’s got a headache again, probably.']}]},
   {open:['You worked on your project instead of zoning out. That’s how you get good at stuff!'],opts:[
    {t:'Working on it every day.',r:['Awesome! You’ll be a Gym Leader at it in no time. Well. Almost.']},
    {t:'It’s still pretty rough.',r:['Everything starts rough. You should see my first swim meet. Belly flop.']}]},
   {open:['You took a real break today. Like, a fun one. No work brain.','That’s important! Even trainers rest their teams.'],opts:[
    {t:'Breaks are part of the plan.',r:['Smart! Okay, next break, we’re going fishing. No arguments.']},
    {t:'I felt a bit guilty.',r:['Don’t! Fun is fuel. Trust me, I’m a Water-type expert.']}]}],
  codex:'Hey! You wrote this down. Read it, it’s actually good!',
  ack:'Yes! Okay, let’s go! Water-type energy!',
  done:{open:['Every single thing done! Whole day crushed!','Now you HAVE to come to the lake with me. You earned it.'],opts:[
   {t:'Same again tomorrow.',r:['That’s my friend! Okay, tomorrow, then fishing. Deal!']},
   {t:'Lake it is.',r:['Yay! Last one there feeds Psyduck. He bites.']}]}},

 rumi:{
  cheers:[
   {open:['* Rumi hums a few bars, still flushed from rehearsal.','You practiced today. Real practice. Not just noodling around. I can always tell.'],opts:[
    {t:'Practice again tomorrow.',r:['Yes! That’s the spirit. Every single day. That’s the only secret.']},
    {t:'Noodling counts a little.',r:['A little. Like humming in the shower. Which, yes, I do too.']}]},
   {open:['You made something today. With your own hands.','That’s how I stay me. Music. You found yours.'],opts:[
    {t:'I’ll make more tomorrow.',r:['Then I’ll write a song about it. Not a cheesy one. Maybe a little cheesy.']},
    {t:'It wasn’t very good.',r:['Mine weren’t either. At first. Then they were. Keep going.']}]},
   {open:['You put the phone down and picked up something real.','The demons love distraction. Don’t give them any.'],opts:[
    {t:'No distractions. Promise.',r:['Good. Then you’re basically a demon hunter now. Honorary.']},
    {t:'Demons have phones?',r:['Worse. They have notifications. Same thing, really.']}]},
   {open:['You learned something new today! I saw you trying. It looked like fun.'],opts:[
    {t:'Learning more tomorrow.',r:['Yes! Okay, we’ll learn something together next time. Duet?']},
    {t:'It looked like frustration.',r:['Frustration is just fun that hasn’t clicked yet. Trust me.']}]}],
  codex:'Here. You wrote this. Read it like a lyric.',
  ack:'Okay. That’s a promise. I heard it. So did the Honmoon.',
  done:{open:['Everything done! The whole day! That’s a full setlist, start to finish.','Encore?'],opts:[
   {t:'Same setlist tomorrow.',r:['Yes! We’ll do it again. Louder this time.']},
   {t:'Sing me something?',r:['* She grins and hums a tune, soft, just for you.','That’s a new one. You can’t tell Mira yet.']}]}},

 jester:{
  cheers:[
   {open:['Oh my gosh! You did your fun thing today! The Traveler says that’s SO important!'],opts:[
    {t:'Every day, I promise!',r:['Yay! Okay, I’m drawing you a picture to celebrate. It has a dragon in it.']},
    {t:'Does the Traveler really care?',r:['He cares SO much. Also he likes pranks. So maybe hide your boots.']}]},
   {open:['* Jester bounces up with a paintbrush, blue paint on her nose.','You made something! Was it art? Was it a pastry? Was it a prank?!'],opts:[
    {t:'And more tomorrow!',r:['Oh, this is the best day. Okay, tomorrow we make pastries. Big ones.']},
    {t:'You have paint on your nose.',r:['On purpose. It’s a look. Fjord said it’s a look.']}]},
   {open:['You read a book instead of scrolling! Caleb would be so proud. He’d cry. Okay, he wouldn’t, but inside.'],opts:[
    {t:'Another chapter tomorrow.',r:['Yes! And then you tell me ALL about it. Especially the kissing parts.']},
    {t:'It was a long book.',r:['Long books are the best! More pages, more adventure.']}]},
   {open:['You played today! Really played! Fun is sacred, you know. I made that a rule.'],opts:[
    {t:'Sacred fun, every day.',r:['Ooh, you’re a convert! Okay, I’m giving you a holy symbol. It’s a donut.']},
    {t:'Who made you pope?',r:['Me! I’m very official. I have a hat. Somewhere.']}]}],
  codex:'Oooh, you wrote this! It’s so good! Read it again, okay?',
  ack:'Yay! Pinky swear! You can’t break a pinky swear!',
  done:{open:['You did EVERYTHING today?! Everything!','Okay, we have to celebrate. Cupcakes. And dancing. And maybe a small prank.'],opts:[
   {t:'Same again tomorrow!',r:['Yes yes yes! I’m telling the Traveler. He’s gonna be so jealous.']},
   {t:'Small prank on who?',r:['Beau. Obviously. She’ll never know. Okay, she will.']}]}},

 mira:{
  cheers:[
   {open:['You practiced. I watched. You didn’t slack on the hard part.','That’s rare. Most people skip the hard eight counts.'],opts:[
    {t:'Hard part again tomorrow.',r:['Good. I’ll be there. Don’t embarrass me.']},
    {t:'I almost skipped it.',r:['But you didn’t. That’s the only part that counts.']}]},
   {open:['* Mira leans against the mirror, arms crossed.','You guarded your time today. Didn’t let anyone steal it.'],opts:[
    {t:'I’ll guard it daily.',r:['Then you get it. Rehearsal time is sacred. Don’t give it up.']},
    {t:'Someone tried to.',r:['Someone always tries. You said no. That’s the skill.']}]},
   {open:['You finished something. Actually finished it. No half-done projects in a drawer.'],opts:[
    {t:'Finishing more tomorrow.',r:['Okay. I might actually be impressed. Don’t tell Zoey.']},
    {t:'There’s a drawer full.',r:['Mine’s a closet. We all have one. Just don’t add to it.']}]},
   {open:['You moved today. Danced, ran, played. Whatever. It clears your head.','I can tell. You look sharper.'],opts:[
    {t:'Moving every day now.',r:['Good. Then maybe I’ll teach you a routine. Maybe.']},
    {t:'I danced badly.',r:['Bad dancing is still dancing. Better than standing still.']}]}],
  codex:'You wrote this. Read it like choreography. Every step.',
  ack:'Good. I’ll hold you to it. I hold everyone to things.',
  done:{open:['Everything done. Clean. No sloppy moments.','I almost want to clap.'],opts:[
   {t:'Same routine tomorrow.',r:['Then we run it again. Five, six, seven, eight.']},
   {t:'Then clap.',r:['* She claps exactly twice, deadpan.','There. Don’t get used to it.']}]}},

 zoey:{
  cheers:[
   {open:['You wrote something today! Even a little! That counts! Most days mine is just words, too.'],opts:[
    {t:'Writing again tomorrow.',r:['Yes! Notebook buddies! Let’s compare pages. Mine has doodles.']},
    {t:'It was just a few lines.',r:['A few lines is a verse! A verse is basically a song! Basically!']}]},
   {open:['* Zoey flips her notebook open and taps a page.','You learned something today. I’m putting it in a rhyme. Hold on.'],opts:[
    {t:'Learn more tomorrow.',r:['Then I’ll need a bigger notebook. Okay, I already have like five.']},
    {t:'Rhyme it with what?',r:['Uh. Mind? Grind? Kind? I’ll get there. Give me a sec.']}]},
   {open:['You made something for fun! Not work! Just fun!','That’s my favorite kind. That’s where the good stuff comes from.'],opts:[
    {t:'More fun tomorrow.',r:['Yes! Okay, I’m hyped. That’s the hook for my next song.']},
    {t:'Fun feels lazy sometimes.',r:['No! Fun is fuel! Rumi says so. Mira rolls her eyes, but she agrees.']}]},
   {open:['You picked up your hobby instead of the phone. That’s huge!','I’m so proud. I’d rap about it, but you’d cringe.'],opts:[
    {t:'Hobby over phone, always.',r:['Yes! Okay, I’m rapping about it anyway. Sorry. Not sorry.']},
    {t:'I might cringe a little.',r:['A little cringe never hurt. It’s basically my brand.']}]}],
  codex:'You wrote this! Read it again! It’s a good line, honestly!',
  ack:'Yes! Locked in! I’m writing that down!',
  done:{open:['You did EVERYTHING! Whole day! Full album!','Okay, I need a minute. I’m so proud.'],opts:[
   {t:'Same again tomorrow.',r:['Yes! Sequel album! Even better! I’m hyped!']},
   {t:'Rap about it?',r:['Okay okay, here goes. Uh. He did it all. Stood real tall. That’s it. I panicked.']}]}},

 ana:{
  cheers:[
   {open:['You tried something new today! I knew you would! Was it scary? It looked a bit scary.'],opts:[
    {t:'New thing tomorrow too.',r:['Yes! I’ve got a list. A very long list. Some of it’s legal.']},
    {t:'It was terrifying.',r:['Perfect! Terrifying means it’s working. That’s basically Gryffindor rule one.']}]},
   {open:['* Ana twirls her wand and a little shower of sparks pops over your head.','You practiced! Proper practice! Charms take ages too, you know.'],opts:[
    {t:'Practicing every day.',r:['Brilliant! Then next week, we try something actually dangerous.']},
    {t:'Did you just set my hair on fire?',r:['Only a little. It’s fine. It’s out now. Mostly.']}]},
   {open:['You read a whole chapter! Not even a spellbook! I’m proud. Also, lend it to me.'],opts:[
    {t:'Another one tomorrow.',r:['Yes! Then we swap. I’ve got a book about dragons. It bites.']},
    {t:'It’s not that exciting.',r:['Everything’s exciting if you read it in a funny voice. Try it.']}]},
   {open:['You played today. Like, actually played. No work brain.','That’s the best kind of magic. Nobody teaches that at Hogwarts.'],opts:[
    {t:'Playing again tomorrow.',r:['Yes! I’ll bring the Exploding Snap. Eyebrows optional.']},
    {t:'Felt a bit silly.',r:['Silly is the best! Silly is basically a superpower.']}]}],
  codex:'Ooh, look, you wrote this! Read it like a spell. With feeling!',
  ack:'Yes! Spell cast! No take-backs!',
  done:{open:['Everything done! Every single thing! You’re brilliant!','Celebration time. I may have charmed some fireworks.'],opts:[
   {t:'Same again tomorrow!',r:['Yes! Adventure every day! That’s the plan!']},
   {t:'Fireworks? Where?',r:['* A firework goes off behind the Guildhall. She winces.','Ah. There. Early. Oops.']}]}},
};
