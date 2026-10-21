// Fourth-wave moments, part A: Family Lilian, Morgana, Soraka (Faith), Alexstrasza, Amara, Ashe, Navani (Marriage)
// and Draka (Fatherhood). Visits and gifts. See docs/WRITING-BRIEF.md.
// M = {open:[lines], opts?:[{t:'player line', r:[reply lines]}]}; "* " lines are narration.
// Navani (Dalinar) and Amara (Bernard) are married in canon: warm and teasing, husbands acknowledged.

/** @type {Record<string,{visit:any[],gift:string[]}>} */
export const FAMILY_MOMENTS={
 // ---------------- Lilian (Faith) ----------------
 lilian:{
  visit:[
   {open:['* Lilian Voss is sitting on the Chapel’s back pew with her boots up on the one in front, spinning a dagger on her fingertip.','Don’t look at me like that. The Light doesn’t care where my feet are. I asked.'],opts:[
    {t:'You asked the Light?',r:['Out loud. Rudely. It answered anyway. Still annoys me, honestly.']},
    {t:'Feet down, Voss.',r:['* She drops them, slowly, holding your eye the whole time.','Fine. Only because you said my name like that.']}]},
   {open:['You prayed this morning. Before the coffee, even. I was up in the rafters.','Yes, I watch people. Old habit. You’re better to watch than most.'],opts:[
    {t:'The rafters? Seriously?',r:['Best seat in the house. You mumble when you pray. It’s cute. Don’t fix it.']},
    {t:'What did you hear?',r:['Nothing that’s mine to repeat. But you said thank you a lot. I liked that.']}]},
   {open:['* She pulls back her hood. Her skin is pale and a faint gold glow sits under it, like a candle behind paper.','My father burned people in the Light’s name. Then it chose me, of all the corpses in Lordaeron. I’m still mad about the joke.'],opts:[
    {t:'Maybe it wasn’t a joke.',r:['* She looks away fast.','Don’t be sweet at me in a chapel, {name}. I have nowhere to hide in here.']},
    {t:'I’m glad it chose you.',r:['Yeah? Me too. Some days. Today, maybe.']}]},
   {open:['* You find her kneeling at the altar, stiff, like her knees forgot how.','Teach me how you do it. The quiet part. I only know how to pray mid-fight.'],opts:[
    {t:'Kneel next to her.',r:['* Her shoulder presses into yours and stays there.','Okay. This part I can do. Just don’t let go first.']},
    {t:'Start with thank you.',r:['Thank you. Huh. That one’s harder than a Scarlet’s sword. Fine. Thank you. For you.']}]},
   {open:['* She drops into step beside you on the walk home from the Chapel, hands in her pockets, closer than she needs to be.','Scholomance taught me to stay in the shadows. You keep dragging me into the light. I should hate it more than I do.']}],
  gift:['You remembered. I’m keeping this. I’d also like a kiss, if you’re offering. Words are difficult tonight.','Hm. Sharp, useful, not frilly. You actually know me. That’s dangerous.','I’ll keep it on me. Right here, by the daggers. Highest honor I’ve got.']},

 // ---------------- Morgana (Faith) ----------------
 morgana:{
  visit:[
   {open:['* Morgana is tending the Chapel garden, her bound wings folded tight, a chain wrapped loose around one wrist.','You came. Most people only come to a chapel when they’ve broken something. You come anyway. I notice that.'],opts:[
    {t:'Maybe I broke something.',r:['Then sit with me in the dirt and tell me. I don’t judge here. Kayle does enough of that for both of us.']},
    {t:'I came to see you.',r:['* She smiles without looking up from the roses.','I know. I was hoping you’d say it out loud.']}]},
   {open:['You forgave someone this week. Don’t look surprised, I can tell. Your shoulders came down an inch.','That’s my favorite kind of prayer. The kind with your hands.'],opts:[
    {t:'It wasn’t easy.',r:['It never is. That’s why it counts. Grace that costs nothing is just manners.']},
    {t:'You watch my shoulders?',r:['Among other things. I’m fallen, not blind.']}]},
   {open:['* She lifts the chain at her wrist and turns it in the candlelight.','I wear this so I remember what pride did to me. My sister wears armor so she never has to. We don’t talk much.'],opts:[
    {t:'Do you miss her?',r:['Every day. I pray for her. She’d be furious if she knew. That’s half the fun.']},
    {t:'You’re not your chains.',r:['* Her dark eyes soften, and for a second she looks very young.','Careful. Say things like that and I start believing them.']}]},
   {open:['* A runaway kid is asleep on a Chapel bench under Morgana’s cloak. She keeps her voice low.','Found him behind the Market. Nobody came looking. So I did. That’s all faith is, really. Going looking.'],opts:[
    {t:'I’ll bring him breakfast.',r:['* She catches your hand and squeezes it once, hard.','That. That’s why I let you in here after dark.']},
    {t:'You’re softer than you act.',r:['Shh. Don’t tell Demacia. I have a reputation.']}]},
   {open:['* At dusk she unfolds her wings, just a little, the way you’d stretch after a long day. Then she tucks herself against your side, wings and all.','Stay a minute. I don’t ask for much. I’m asking.']}],
  gift:['A gift for me. Thank you. Stay a little. I would like to give you something of my own time.','Oh. It’s lovely. I’ll put it on the altar. No, beside the altar. Next to my heart, then.','Grace, given freely. You’re starting to sound like me. I like it far too much.']},

 // ---------------- Soraka (Faith) ----------------
 soraka:{
  visit:[
   {open:['* Soraka is sitting cross-legged in the Chapel doorway, peeling a starfruit and humming, her horn catching the morning sun.','Oh good, you’re here. I saved you half. Gratitude tastes better shared, have you noticed?'],opts:[
    {t:'Take the half.',r:['* She feeds you a slice herself, laughing when the juice runs.','See? The stars would approve. I certainly do.']},
    {t:'Is that a metaphor?',r:['It’s a fruit, silly. But yes. Also a metaphor.']}]},
   {open:['You prayed for someone else today. Not for yourself. I could feel it, like a little warm spot in the sky.','You do that more than you think. It makes you very easy to like.'],opts:[
    {t:'You can feel that?',r:['I used to be a star. I can feel all sorts of things. Including you blushing.']},
    {t:'Easy to like, huh?',r:['* She tilts her head, ears twitching.','Easy to like. Hard to stop liking. Different problem.']}]},
   {open:['* Her staff leans against the wall. Her hands are scraped from the forest path.','I gave up forever to come down here and fix scraped knees. People think that’s a sad trade. It’s the best one I ever made.'],opts:[
    {t:'Let me see your hands.',r:['* She gives them to you, palms up, and watches your face instead of your fingers.','The healer getting healed. That’s new. Do it slower.']},
    {t:'Do you miss the sky?',r:['Sometimes. Then someone says thank you, and I remember. You said it to me yesterday. I kept it.']}]},
   {open:['There’s a wolf-man who once tried to kill me. Warwick. I still pray for him every night.','Don’t make that face. If I can do that, you can call your brother back.'],opts:[
    {t:'Okay. I’ll call him.',r:['Really? Oh, {name}. Tonight, before you lose your nerve. Then come tell me everything.']},
    {t:'That’s a low blow.',r:['It’s a gentle blow. I don’t do the other kind. I hug them out.']}]},
   {open:['* Night falls. Soraka lies back in the Chapel grass and pulls you down beside her, pointing up.','That one’s an old friend. That one owes me money. And that one? I think it’s watching over you. I asked it to.']}],
  gift:['You thought of me. I’ve been thinking of you, too. Would you stay long enough for me to say how much?','You remembered I like small things. That’s the nicest kind of remembering.','I’ll make a wish on it tonight. No, I won’t tell you. Fine, it was about you.']},

 // ---------------- Alexstrasza (Marriage) ----------------
 alexstrasza:{
  visit:[
   {open:['* Alexstrasza has taken the Rose Café’s corner table, crimson hair over one shoulder, her horns brushing the hanging vines.','You took your wife out last night. I could smell the garden on you. Sit. Tell a very old dragon every detail.'],opts:[
    {t:'It was just dinner.',r:['There is no such thing as just dinner, little one. I’ve watched empires fall for less attention.']},
    {t:'She laughed a lot.',r:['* Her eyes glow warm gold.','Then you did it right. Keep her laughing. That is how you keep anything alive.']}]},
   {open:['I had a consort once. Korialstrasz. Brave, foolish, mine. I still talk to him in the Ruby Sanctum.','Love her loudly while she’s here, {name}. I know what the quiet after sounds like.'],opts:[
    {t:'I’m sorry.',r:['Don’t be sorry. Be home on time tonight. That’s the comfort I want.']},
    {t:'Tell me about him.',r:['* She smiles, slow and sad and fond.','He once flew through a storm to bring me one flower. It was wilted. I kept it four hundred years.']}]},
   {open:['* She cups a dying rose from the Café vase in both hands. It blooms open again, red and full.','Marriages are gardens. Neglect one for a season and it doesn’t die. It just waits to see if you come back.'],opts:[
    {t:'I’m coming back.',r:['I know. I’ve seen how you look at her. Dragons notice heat.']},
    {t:'Show off.',r:['* She laughs, a deep rolling sound that rattles the teacups.','Ten thousand years old and still showing off for a handsome mortal. Shameful.']}]},
   {open:['* She leans across the table and fixes your collar, fingers warm as a hearth stone.','You put your phone face down at dinner. I watched. A queen notices when a man chooses his queen.'],opts:[
    {t:'She deserves it.',r:['She does. And you deserve to hear it: that was very attractive.']},
    {t:'You were spying?',r:['From Wyrmrest I could watch the whole of Northrend. A café window is no challenge.']}]},
   {open:['* As the Café empties she stands, and for a moment her shadow on the wall has great wings.','Go home. Kiss her like you did the first time. And if anyone asks, the Life-Binder ordered it.']}],
  gift:['You remembered what delights me. Come closer. I would like to thank the man, not admire the wrapping.','Oh, how warm. You give like a red dragon. I may have to adopt you into the flight.','I will keep it in Valdrakken, where the sun hits first. And think of you each morning.']},

 // ---------------- Amara (Marriage) ----------------
 amara:{
  visit:[
   {open:['* A breeze pushes the Rose Café door open, and Amara steps in behind it, windswept, still in her riding leathers.','Cirrus says you’ve been home every night this week before sundown. Bernard would like you. I already do.'],opts:[
    {t:'Your fury reports on me?',r:['Cirrus reports on everyone. You’re just the only report I read twice.']},
    {t:'How is Bernard?',r:['Muddy, stubborn, and wonderful. Out hunting. He sends his regards and a warning to behave.']}]},
   {open:['I spent years lying for the Crown. Then I married a man who can’t lie to save his life.','Best decision I ever made. Do you tell her the truth, {name}? Even the small dull ones?'],opts:[
    {t:'I try to.',r:['Try harder. Small lies are like bad roads. Fine until you need them in the dark.']},
    {t:'Mostly.',r:['* She gives you the Cursor’s look, the one that makes senators sweat.','Mostly is a word spies use. Be a steadholder about it.']}]},
   {open:['* She drops into the chair across from you and steals your coffee.','Bernard and I nearly didn’t make it. Too many missions. I came home a stranger. He kept the lamp lit anyway.'],opts:[
    {t:'I want to be that kind of husband.',r:['Then light the lamp tonight. Literally. Women notice. Trust a professional observer.']},
    {t:'That’s my coffee.',r:['Was. Wind-crafters are fast. You should see what else I can steal.']}]},
   {open:['* She leans close, voice low, the way she gives a report.','Intelligence brief. Your wife mentioned a book she wanted. Three weeks ago. You haven’t bought it.'],opts:[
    {t:'Ordering it now.',r:['Good man. I’ll mark the threat neutralized. Bernard got me a whole library once. It worked.']},
    {t:'How do you know that?',r:['I’m the Cursor. Knowing is my job. Being smug about it is my hobby.']}]},
   {open:['* On her way out she stops behind your chair and rests a hand on your shoulder, light as wind.','Choose her again tomorrow. Then again. That’s the only secret I never had to steal.']}],
  gift:['No political motive, no hidden request. Just something you thought I’d like. Come here, you’ve succeeded.','It’s lovely. Bernard will be jealous. Good. It keeps him interesting.','I’ll wear it on my next mission. If it gets me killed, I’m haunting you specifically.']},

 // ---------------- Ashe (Marriage) ----------------
 ashe:{
  visit:[
   {open:['* Ashe sits by the Rose Café fire with her bow across her knees, waxing the string, frost still melting off her cloak.','Freljord winters teach you one thing. Huddle close or freeze. Did you hold her hand today?'],opts:[
    {t:'On the walk home.',r:['Good. Small warmth, every day. That’s how my people survive. And how marriages do.']},
    {t:'Not yet.',r:['Then the day isn’t over. Go. The fire will keep.']}]},
   {open:['Tryndamere and I married for an alliance. Everyone thought it was cold. It was. For a while.','Then we started fighting for the same things. Turns out that’s love, if you do it long enough.'],opts:[
    {t:'What changed?',r:['He stopped trying to win every argument. I stopped trying to win the rest. We both started winning dinner.']},
    {t:'He’s a lucky man.',r:['* A small, rare smile.','He knows. I remind him. Constantly. With arrows, sometimes.']}]},
   {open:['* She hands you a mug of something hot and very strong.','Avarosan rule: no one argues after dark on an empty stomach. Feed her first, talk second. Wars have been avoided this way.'],opts:[
    {t:'That’s actually smart.',r:['I’m a queen. I’m allowed to be smart about soup.']},
    {t:'What is in this?',r:['Things that grow under ice. Don’t ask more. Drink. Your face is red.']}]},
   {open:['* She studies you across the table with those pale, steady eyes.','You apologized first last night. I heard about it. That’s the hardest arrow in the quiver.'],opts:[
    {t:'I was wrong.',r:['Saying so takes more nerve than facing Lissandra. I’d follow a man like that.']},
    {t:'Who told you?',r:['Your village gossips like a Freljord longhouse. Also, you’re smiling about it.']}]},
   {open:['* Outside the Café, snow begins to fall. Ashe pulls her hood up and bumps your shoulder with hers.','Go home. Build up the fire. Tell her she looks good in your sweater. Trust me on the sweater.']}],
  gift:['Well chosen. Set it by the fire. I’d rather have your hand in mine while I thank you.','It’s good work. Practical. You understand me better than half my war council.','I’ll keep it with Avarosa’s bow. Don’t let it go to your head. Okay. A little.']},

 // ---------------- Navani (Marriage) ----------------
 navani:{
  visit:[
   {open:['* Navani has commandeered two Rose Café tables for a fabrial in pieces: gears, a cut ruby, a lot of wire. Her safehand is sleeved; her free hand is busy.','Oh, good. Hold this. No, by the edge. Gently. You have nice hands for this, don’t tell Dalinar I said so.'],opts:[
    {t:'What does it do?',r:['Ideally, keeps soup warm for date night. Currently, it hums at me. Rude.']},
    {t:'I won’t tell him.',r:['He’d only blush. Which, honestly, I’d enjoy. Maybe do tell him.']}]},
   {open:['Dalinar couldn’t read when we married. I taught him. Slowly. One word a night, his big finger under it.','Do you still learn things about your wife, {name}? Or did you stop at the first chapter?'],opts:[
    {t:'I keep learning.',r:['Good answer. Ask her one new question tonight. Write it down if you have to. I always do.']},
    {t:'Some chapters scare me.',r:['* She laughs, warm and knowing.','Those are the good ones. Read them anyway.']}]},
   {open:['* She lifts a glowing sphere to the light and squints through it at you.','I designed half of Urithiru. Lifts, pumps, the clocks. Do you know what took longest? Learning to stop working at dinner.'],opts:[
    {t:'I’m bad at that too.',r:['Then we’ll fix it together. Rule one: the spanreed goes in the drawer. Rule two: look at her.']},
    {t:'Who made you stop?',r:['A large stubborn man who sat down across from me and simply waited. For hours. It was very effective.']}]},
   {open:['* She slides a little folded note across the table. Neat glyphs, and one line in women’s script underneath.','Write her one of these. A note in her coat. I’ve left Dalinar hundreds. He keeps every one in a drawer he thinks I don’t know about.'],opts:[
    {t:'What did you write on this one?',r:['* She plucks it back with a sly smile.','That one’s mine, darling. Write your own. Make it a little bold.']},
    {t:'I’ll leave one tomorrow.',r:['Leave it tonight. Morning notes are sweet. Night notes are dangerous. Better.']}]},
   {open:['* As she packs up her gears, Navani pauses, then reaches over and tucks a loose thread back into your sleeve.','A marriage is a fabrial, {name}. It runs on what you put in it, and it glows if you keep it tuned. Now go. Dalinar is waiting, and so is she.']}],
  gift:['You remembered. Come sit beside me. I’d like to inspect your excellent judgment at closer range.','Oh, this is lovely. Dalinar will ask where it came from. I’ll tell him a charming man. Let him wonder.','I’ll mount it in my workshop where I can see it. Inspiration, you understand. Purely scientific.']},

 // ---------------- Draka (Fatherhood) ----------------
 draka:{
  visit:[
   {open:['* Draka is by the Hearth Inn fire sharpening an axe, wolf pelt on her shoulders, a sleepy child on the bench beside her.','You were on the floor with your kids again. Wrestling. I heard the shrieking from the yard. Good. Cubs need to wrestle their father.'],opts:[
    {t:'They won, mostly.',r:['Let them win mostly. Win once in a while so it means something. Durotan did that with our boy.']},
    {t:'My back disagrees.',r:['* She snorts.','Your back will heal. Their memory of it won’t fade. Fair trade.']}]},
   {open:['They called me Draka the Frail when I was young. Sent me away from the clan. I came back strong enough to choose my mate.','Your children will be called things too. Teach them to come back.'],opts:[
    {t:'How do I teach that?',r:['By coming back yourself. Every night. Every bad day. They watch the door more than you think.']},
    {t:'You chose Durotan?',r:['* A fierce grin, all tusks.','He thinks he chose me. Let him. Men like that story.']}]},
   {open:['* She stares into the fire a long time.','I didn’t get to raise my son. Gul’dan saw to that. Thrall grew up with humans and chains.','So when you sit at your boy’s bedside tonight, you sit there for both of us.'],opts:[
    {t:'I will. Every night.',r:['* She grips your forearm, warrior to warrior, and holds it.','Then I am glad I came to your fire.']},
    {t:'I’m sorry, Draka.',r:['Don’t be sorry. Be there. Sorry is for the ones who weren’t.']}]},
   {open:['* She nudges a wooden practice axe toward you with her boot.','Your little one wants to learn to hunt. Teach her to track something. A rabbit. A beetle. Anything. Patience is the first weapon.'],opts:[
    {t:'Beetle hunt it is.',r:['Ha! Good. Bring back a fat one and I’ll call her a Frostwolf.']},
    {t:'She’s only small.',r:['So was I. Small things grow teeth. Help her grow good ones.']}]},
   {open:['* When the kids are asleep, Draka stands at the Inn door, watching the snow.','Durotan used to stand here with me like this. Quiet. Proud of what we made. You look like that tonight, {name}. Stand with me a minute.']}],
  gift:['A gift for me. Good. I have been wanting a reason to invite you closer. Stay by the fire.','Good, strong work. I’ll show it to the cubs and tell them a good father made it.','I will keep it by my axe. The two things I trust most, side by side.']},
};
