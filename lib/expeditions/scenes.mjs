// Expedition first-visit scenes: shown the first time the player runs each adventure or boss
// (lib/expedition-data.mjs). Later runs are a one-tap result card. See docs/WRITING-BRIEF.md.
// Scene = {open:[lines], opts:[{t:'player choice', r:[reply lines]}]}.
// A plain line is narration; "<castId>: text" or "player: text" is someone speaking.

/** @type {Record<string,{open:string[],opts:{t:string,r:string[]}[]}>} */
export const EXPEDITION_SCENES={
 // ================= Lumbridge =================
 'cow-field':{
  open:[
   'The field east of Lumbridge smells of grass, river and a great deal of cow.',
   'A farmer leans on the fence. A goblin is trying to milk a bull. It is not going well for the goblin.',
   'peter: Okay. Don’t tell anyone, but I’ve never actually been this close to a cow. Queens doesn’t have a lot of those.',
   'peter: The farmer says his gate’s busted and the herd keeps wandering. Fix the gate, carry some hides, everybody wins. Except the goblin.',
  ],
  opts:[
   {t:'Grab the hammer. Gates first, glory later.',r:['peter: See, this is the stuff nobody claps for. Fixing a gate. Same as fixing the cupboard at home. It’s also how you become the guy people trust.','The gate swings true. The farmer nods once, which in Lumbridge is practically a parade.']},
   {t:'Help the goblin. He’s clearly having a day.',r:['peter: Aw, you’re a good egg. Hey, buddy, wrong cow. That one has horns. Big hint.','The goblin flees with an empty bucket and his dignity roughly where he left it.']},
   {t:'Carry the hides. All of them. In one trip.',r:['peter: One trip? Bold. Love it. I’m gonna be here with the bucket when your arms give out.','Your arms do not give out. Peter is genuinely, loudly impressed.']},
  ]},
 'goblin-village':{
  open:[
   'North of Falador’s road, the goblin village is in uproar again.',
   'Half the tribe is painted red. The other half is painted green. Nobody remembers why it matters, only that it matters very much.',
   'grog: Tiny green men! And tiny red men! Which ones do I hit?',
   'player: Possibly neither. They’re having a disagreement about colours.',
   'grog: Grog also has strong feelings about colours. Red is the best one. It is the colour of winning.',
  ],
  opts:[
   {t:'Settle it the warrior’s way. Arm wrestling.',r:['grog: Ha! A contest of STRENGTH. You go first. Then Grog. Then Grog again, because that was fun.','By sundown both generals have lost to you, twice, and the village declares your favourite colour the official one.']},
   {t:'Walk away. Not every fight is ours.',r:['grog: Hm. Pike says that too. Choosing the fight is the hard part. Hitting is the easy part.','grog: You picked well, little friend. Now we go find a fight that’s worth it. Maybe a cow.']},
  ]},
 'lumbridge-swamp':{
  open:[
   'South of the castle the ground turns soft. Fog sits on the water and giant frogs watch you like you owe them money.',
   'Past the reeds, a pair of half-forgotten mines dig into the hill. A sign says “Danger.” Someone has added “mostly.”',
   'shallan: Oh, look at the light through that fog. Hold still. No, not you, the frog. Actually, you too. You’re much better looking.',
   'shallan: There’s a lantern-lit cave down there. Rumour says the gas inside goes boom if you bring a naked flame. Shall we be very careful together?',
  ],
  opts:[
   {t:'Mine the copper and tin. Steady work, steady pay.',r:['shallan: A man who does the dull part well. I find that annoyingly attractive.','By the time the fog lifts your pack is heavy and her sketchbook is full of you swinging a pickaxe.']},
   {t:'Sit and sketch the swamp with her for a while.',r:['shallan: You made time for this. For me. I’m going to remember the way you look when you’re not rushing.','She leans into your shoulder. The frogs, for once, have the decency to look away.']},
   {t:'Bring a lantern into the cave. What could happen?',r:['A small, dignified boom. Your eyebrows survive. Mostly.','shallan: I drew that. I drew all of it. You’ll thank me for this when we’re old.']},
  ]},
 'draynor-manor':{
  open:[
   'The manor on the hill is the kind of house that has a thunderstorm of its own, even on sunny days.',
   'The front door slams behind you. Locally this is considered a greeting.',
   'matt: Six heartbeats in this house besides ours. Two of them aren’t human. One of them is very, very slow.',
   'matt: There’s a mad professor upstairs, a ghost in the garden and something under the floorboards I’d rather not meet before I’ve said a prayer.',
  ],
  opts:[
   {t:'Say the prayer with him. Then go in.',r:['matt: You don’t pray because you’re scared. You pray so the fear doesn’t get the last word. Good.','The halls are still dark. They just feel smaller now.']},
   {t:'Help the professor find his lost machine parts.',r:['Professor Oddenstein thanks you, explains his chicken-transformation device for twenty minutes, then forgets your name.','matt: Kind man. Terrible ideas. Reminds me of half my clients.']},
   {t:'Pull the lever marked “DO NOT PULL.”',r:['A bookcase grinds open. Somewhere below, something old shifts in its sleep.','matt: Well. Now it knows we’re here. Discipline, {name}. Next time, ask the blind guy first.']},
  ]},
 'count-draynor':{
  open:[
   'The cellar stairs go down further than the house should allow. The air tastes of dust and old copper.',
   'In the middle of the room, a coffin. The lid is already open.',
   'shadowheart: Garlic in your pouch. Stake in your belt. Hammer in your hand. And faith, of course. The light doesn’t do half-measures.',
   'shadowheart: He was a man once. Then he wanted forever more than he wanted anything good. Don’t ever let me catch you making that trade.',
   'A pale figure unfolds from the dark. Count Draynor smiles with far too many teeth and says he has been expecting company for supper.',
   'shadowheart: Stay close to me. Closer. There. Now I can protect you, and admire you, at the same time.',
  ],
  opts:[
   {t:'Throw the garlic and charge.',r:['The Count recoils, hissing like a kettle with a grudge. Your stake goes home and he crumbles into dust and one very surprised bat.','shadowheart: Remind me to kiss you when this cellar stops smelling of garlic.']},
   {t:'Let her call down Selûne’s light first.',r:['Silver moonlight floods the cellar. The Count, blinded for the first time in centuries, falls to one clean strike and is gone.','shadowheart: The light did its part. You did yours. Come here, my hero, and let me thank you properly.']},
   {t:'Tell him you’ve got a family waiting. He’s keeping you from them.',r:['The Count laughs, right up until you hit him harder than anyone has since the last age. He falls, and the coffin lid slams on an empty box.','shadowheart: Go home to them. And save a little of that fire for later.']},
  ]},

 // ================= Asgarnia =================
 'dwarven-mine':{
  open:[
   'Under Ice Mountain, the Dwarven Mine runs in every direction a pickaxe has ever wanted to go.',
   'Dwarves glare at you from behind ore carts. One of them is muttering about humans and their “wee arms.”',
   'tony: Okay, first thoughts. The ventilation is a war crime, the rails are lovely, and that guy has the best beard I’ve ever seen.',
   'tony: Mithril in the deep seams. Iron near the top. And a dwarf over there selling a pickaxe I would very much like to take apart.',
  ],
  opts:[
   {t:'Mine iron until your shoulders burn.',r:['tony: Look at that. No suit, no shortcuts, just reps. I’m not saying I’m impressed. I’m saying I’m taking notes.','The dwarves stop muttering. One of them grudgingly calls you “lad,” which is a promotion.']},
   {t:'Trade the dwarves something they actually need.',r:['You fix a busted cart wheel in exchange for directions to the good seam.','tony: That’s business. Find the problem, own the problem. Also, that foreman’s handshake nearly broke my favourite hand.']},
   {t:'Go deep for the mithril.',r:['It is dark, hot and very far down. You come back up with blue-green ore and a new respect for daylight.','tony: Every great thing I ever built started with someone going one level deeper than was comfortable.']},
  ]},
 'ice-mountain':{
  open:[
   'The climb up Ice Mountain is all wind and white. Ice warriors stand guard like statues that remember being angry.',
   'At the top, an old woman sits by a fire that should not be able to burn up here. The Oracle.',
   'obiwan: Interesting. I’ve met a great many people who claimed to see the future. Very few of them lived somewhere this inconvenient.',
   'The Oracle looks at you, then at the sky, and says something cryptic about small things done daily outweighing great things done once.',
  ],
  opts:[
   {t:'Ask the Oracle what it means.',r:['obiwan: She means what you already know. You simply wanted to hear it from someone with snow in her hair.','obiwan: Keep the small promises, {name}. The large ones tend to look after themselves.']},
   {t:'Fight your way back down through the ice warriors.',r:['obiwan: Breathe. Let the cold pass through you. Your strength is calmer than theirs.','At the base of the mountain you are frozen, aching and grinning like a fool. Obi-Wan is not even out of breath.']},
  ]},
 'black-knights-fortress':{
  open:[
   'The Black Knights’ fortress squats on a cliff north of Falador, black stone over a long drop.',
   'The White Knights want to know what is being cooked up inside. Literally: there’s rumour of a secret potion and a very large cauldron.',
   'kelsier: Ah, a heist. Finally. You know how many of these I’ve planned? You know how many went well? Don’t answer that.',
   'kelsier: Guard uniform on, shoulders back, look bored. Nobody questions a man who looks like he’d rather be home with his wife.',
  ],
  opts:[
   {t:'Stand in the grill vent and listen. Patiently.',r:['Two hours of knights complaining about rations. Then the whole plan, word for word.','kelsier: Patience. The least fun skill there is, and the one that wins.']},
   {t:'Drop a cabbage in their cauldron.',r:['A wet, ugly bubbling. Then a smell. Then a lot of shouting about whose turn it was to watch the pot.','kelsier: Sabotage with vegetables. I didn’t think you could make me proud today, and here we are.']},
   {t:'Let Kelsier talk you past the gate.',r:['kelsier: Evening, gentlemen. Inspection. Lord says your armour’s scuffed. Shameful.','Nobody argues. You walk straight in and straight out again, and Kelsier laughs the whole way down the hill.']},
  ]},
 'taverley-dungeon':{
  open:[
   'Below the druids’ quiet village, stone steps lead into the warm, wet dark of Taverley Dungeon.',
   'Poisonous spiders. Black knights who took a wrong turn. And somewhere further in, the steady breathing of something enormous and blue.',
   'karlach: Oh, I LOVE it down here. It’s all heat and teeth. Feels like home, except nobody’s trying to sell my soul.',
   'karlach: Shield up, soldier. Anti-dragon one. I’m not losing that pretty face of yours to a lizard with a cough.',
  ],
  opts:[
   {t:'Take on the blue dragon head-on.',r:['karlach: YES. That’s it! Push through the fire! Hit it like it owes you money!','The dragon falls with a crash that shakes dust from the roof. Karlach tackles you in a hug that is mostly heat.']},
   {t:'Take the long way round through the agility pipe.',r:['You squeeze through the narrow pipe and come out the other side, filthy and triumphant.','karlach: Okay, that was hot. The squeezing. Not the pipe. Don’t look at me like that.']},
  ]},
 'giant-mole':{
  open:[
   'Falador Park is lovely. Fountains, roses, a bench in the sun. A perfect place for a quiet afternoon with someone you love.',
   'padme: I packed lunch. I brought a blanket. I wore the dress you like. And then the ground started moving.',
   'Molehills erupt across the lawn. The gardener is in tears. A rose bush simply vanishes.',
   'Under the park, the earth rumbles. Something is digging, and it is the size of a house.',
   'padme: I’ve dealt with trade blockades and Sith Lords. I can deal with a mole. But I’d rather deal with it beside you.',
   'With a heave of turf the Giant Mole surfaces, blinking, furious that anyone would interrupt its tunnelling.',
  ],
  opts:[
   {t:'Light a candle and follow it into the tunnels.',r:['It burrows away again and again, but you keep after it, steady and stubborn, until it slumps and the park goes still.','padme: You missed lunch. I’ll forgive you. Slowly. Over dinner.']},
   {t:'Protect the picnic. Some things are worth defending.',r:['The mole charges the blanket and meets you instead. You do not move one step, and it crashes over and does not rise.','padme: You defended a sandwich like it was a kingdom. I have never wanted to kiss someone more.']},
   {t:'Let her distract it while you strike.',r:['Padmé waves a napkin and dances out of reach with a senator’s grace. The mole turns its head, and your blow brings it down.','padme: We make a very good team. I think we should practise. Tonight.']},
  ]},

 // ================= Morytania =================
 'canifis':{
  open:[
   'Across the River Salve, the village of Canifis huddles under a sky that never quite gets light.',
   'The villagers smile with a lot of teeth. The bartender’s eyebrows meet in the middle. Everyone is very interested in how long you’re staying.',
   'vex: Don’t look so worried, darling. I’ve tracked worse than this. Admittedly not while on a date.',
   'vex: When the moon comes up, keep your head and stay with me. And maybe keep your hand on my waist. For safety.',
  ],
  opts:[
   {t:'Stay calm and keep your hand where she put it.',r:['The moon rises. Fur sprouts across the tavern. You do not flinch, and nobody wants to test a man that steady.','vex: Cool as frost. I could get used to watching you not panic.']},
   {t:'Buy a round for the whole tavern.',r:['Werewolves, it turns out, are delighted by free drinks. The tension drains out of the room.','vex: Generous and handsome. You realise I’m going to be impossible to live with now.']},
   {t:'Leave before dark. Home is better.',r:['You take her hand and head for the gate while the sun is still a smudge on the hills.','vex: Knowing when to leave is a rare talent. I suppose I’ll just have to keep you to myself.']},
  ]},
 'mort-myre':{
  open:[
   'Mort Myre is a swamp that has given up on being anything else. The water is black and the trees lean in to listen.',
   'Ghouls pick through the reeds. Somewhere ahead is a druid’s grotto and a little warmth, if you can reach it.',
   'din: Walk where I walk. The ground lies here.',
   'din: My son would have liked the frogs. I’d have told him not to touch them. He would have touched them anyway.',
  ],
  opts:[
   {t:'Ask him about his kid.',r:['din: He’s small and he’s stubborn and he’s the best thing I’ve ever done. You know the feeling.','din: Get through this swamp. Then go home and sit with yours. That’s the way.']},
   {t:'Fill a druid pouch and push for the grotto.',r:['The ghouls come in a rush. Din steps in front of you without a word, the way fathers do.','You reach the grotto’s warm light together. Din nods at you once. It’s the highest compliment he gives.']},
  ]},
 'port-phasmatys':{
  open:[
   'Port Phasmatys sits on the coast like a held breath. Its people are translucent, polite and very tired of existing.',
   'Without an amulet of ghostspeak, all they say is “woo.” With one, it turns out they mostly want to go home.',
   'tchalla: My ancestors visit me on the plains between life and death. They are at peace. These ones are not.',
   'tchalla: Someone has trapped them here, feeding on their rest. A people needs its dead to sleep, {name}.',
  ],
  opts:[
   {t:'Fill the Ectofuntus and earn their release.',r:['Bones ground, slime gathered, the green tower glows. One by one the ghosts nod and fade, smiling.','tchalla: That was service, my friend. Unseen, unthanked, and exactly right.']},
   {t:'Listen to the ghosts’ stories first.',r:['A fisherman tells you about his wife. A baker tells you about her bread. They just wanted someone to hear them.','tchalla: Honour is not only in the fight. Sometimes it is in sitting still and listening. Wakanda would welcome you.']},
  ]},
 'vampyre-hunt':{
  open:[
   'Beneath a ruined pub in Canifis, a handful of tired rebels call themselves the Myreque. Their swords are sharp. Their odds are not.',
   'The Drakans rule this land and drain it. Tonight, the Myreque strike back, and they want you with them.',
   'vin: I know this kind of night. Mist, rooftops and a lord who thinks nobody will ever come for him.',
   'vin: I grew up with nobody to look out for me. Every time you show up for your kids, you’re breaking something old. I like watching you do it.',
  ],
  opts:[
   {t:'Take point. Draw the vampyres out.',r:['They come fast from the dark. You meet them faster, and the ambush breaks while the Myreque cheer.','vin: Look at you. Steady as steel and twice as stubborn. Hold still, you’ve got mist on your collar.']},
   {t:'Guard the Myreque’s children in the hideout.',r:['While the fight rages above, you sit with the young ones and tell them stories until they stop shaking.','vin: That’s the part they’ll remember when they’re grown. Not the swords. You.']},
   {t:'Race her across the rooftops.',r:['She is a blur of mist and cloak. You are a lot of heavy boots. You still nearly keep up.','vin: Nearly. I’ll give you another chance. Somewhere quieter. Without the vampyres.']},
  ]},
 'barrows':{
  open:[
   'The Barrows rise out of the Morytanian marsh: six mounds, six crypts, six brothers who swore they would never be beaten and meant it.',
   'Ahrim, Karil, Guthan, Torag, Verac. One by one their tombs crack open behind you. And the sixth crypt is very, very quiet.',
   'darrow: Brothers who wouldn’t die. I know the type. I was raised with them. Most of them were less dramatic.',
   'darrow: Dharok’s the one with the greataxe. The more you hurt him, the harder he swings. So we don’t hurt him slowly.',
   'The sixth tomb opens. Dharok the Wretched rises, axe dragging along the stone, eyes like dead coals.',
   'darrow: You trained for this every morning you didn’t want to. Every rep. Every early night. Now, Reaper’s brother. Now.',
  ],
  opts:[
   {t:'Go in fast and finish it before he gets angry.',r:['You hit him three times before the axe even lifts. Dharok staggers, the greataxe clatters to the stone, and the crypt goes silent.','darrow: Hail, brother. That was discipline with teeth.']},
   {t:'Pray first. Then take him down.',r:['The prayer settles your heart. The axe bites only air, your counter lands clean, and the last brother falls.','darrow: Calm in the storm. Break the chain, {name}. You just did.']},
   {t:'Fight side by side with Darrow.',r:['Darrow takes the left, you take the right. Dharok cannot watch you both, and collapses into dust and old iron.','darrow: The chest is yours. The glory’s yours. I just wanted the view.']},
  ]},
};
