// Expedition first-visit scenes, part 8: the Feldip Hills, Varlamore, the Fortis Colosseum and the Ancient Vaults (lib/expedition-data.mjs).
// Same format as lib/expeditions/scenes.mjs. See docs/WRITING-BRIEF.md.
// Scene = {open:[lines], opts:[{t:'player choice', r:[reply lines]}]}.
// A plain line is narration; "<castId>: text" or "player: text" is someone speaking.

/** @type {Record<string,{open:string[],opts:{t:string,r:string[]}[]}>} */
export const EXPEDITION_SCENES={
 // ================= The Feldip Hills =================
 'corsair-cove':{
  open:[
   'Corsair Cove, tucked under the Feldip cliffs. A pirate ship that never leaves, a crew that never sleeps, and a captain who says they’re cursed.',
   'Below the planks, something big is chanting in the caves. The sailors flinch every time it hits a low note.',
   'kelsier: Cursed sailors. A shaman in the basement. A captain who won’t say what he stole. I’ve run jobs with worse crews, and I’ve got the scars to prove it.',
   'kelsier: Here’s what I know. Nobody’s actually cursed. Somebody’s scared, somebody’s lying, and somebody wants to get paid. Find all three and we’re done by supper.',
  ],
  opts:[
   {t:'Interview the crew one at a time. Find the liar.',r:['Four sailors, four stories, one that changes every time he tells it. The cook. The cook stole the shaman’s charm and hid it in the flour.','kelsier: The cook! I had money on the captain. Fine, you read people better than me, and I say that about nobody. Don’t spread it around.']},
   {t:'Go down to the shaman. Talk, not swing.',r:['The ogress in the caves is enormous and tired. She wants her charm back and the drums to stop. You promise both and she lets you climb out alive.','kelsier: You walked into a cave and made a deal with the thing in it. That’s how Vin started. Next you’ll be running your own crew. I’d join. Short-term.']},
   {t:'Ask Kelsier what he’d be doing if he weren’t here.',r:['kelsier: Planning. There’s always a plan, {name}. Mare used to say I couldn’t sit through a sunset without casing it. She wasn’t wrong.','He flips a coin and catches it without looking. “Go home and sit through one with your wife sometime. Don’t case it. That’s the hardest job I ever gave anyone.”']},
  ]},
 'jiggig':{
  open:[
   'Jiggig, the ogre burial ground. Mounds, bones, and a smell that gets in your clothes and stays there.',
   'A grave shifts. Then another. Zogres crawl out of the dirt, green and rotten and in no hurry at all.',
   'vi: Oh, come ON. Zombie ogres. I punched my way out of the Undercity and this is what I get? The smell alone, man.',
   'vi: Gauntlets are warm. Hands are ready. They’re slow, we’re not. Pick one and we start swinging. Loser buys drinks.',
  ],
  opts:[
   {t:'Fight through the mounds with Vi.',r:['You go mound to mound with her. The zogres are slow and the fight goes long, and your arms are jelly by the last one.','vi: Look at you. Arms shaking, still swinging. That’s what a real session feels like. Same as the gym, just with worse breath on the other side.']},
   {t:'Find the shaman who raised them. Stop it at the source.',r:['The ogre shaman is hiding in a hut on the ridge, chanting into a skull. You take the skull. The zogres lie back down like they were waiting to.','vi: Huh. Brains over fists. Cait would be so proud of you. Don’t tell her I said that. I’m still the one who hits harder.']},
   {t:'Ask Vi why she calls fighting therapy.',r:['vi: Because I don’t sit still well. Never did. You hit the bag, the stuff in your head goes quiet for a bit. Then you can actually think.','She cracks her neck. “You’ve got that look too. Go lift something heavy tomorrow. It helps. Then come find me and tell me it helped.”']},
  ]},
 'rantz-cave':{
  open:[
   'Rantz’s cave, up a muddy path in the Feldip Hills. An ogre, two small ogre kids, and a clearing full of chompy birds that will not shut up.',
   'The kids are hungry. Rantz has a bow he can’t string. The chompies are getting away.',
   'draka: Two cubs and a father who cannot feed them. I know that cave. Durotan and I sat in one like it, in the snow, with a baby who would not stop crying.',
   'draka: Look at him. He is not a bad father. He is a tired one. That is a different thing, and it is a fixable one.',
  ],
  opts:[
   {t:'String the ogre bow and hunt chompies with the kids.',r:['Rantz grunts, the kids shriek, the bow sings. You teach the little ones to lead the bird. They miss everything and have the best night of their lives.','draka: You let them miss. Good. Durotan would have corrected every shot. I had to sit on him. Children learn fastest when they are laughing.']},
   {t:'Cook. The kids need food before anyone needs lessons.',r:['You get a fire going and a chompy on it. The kids eat first. Rantz eats what is left and looks like he might cry.','draka: Feed them first. Always first. Everything else in a home follows from a full belly and a warm fire. Go home tonight and cook something, just to see your cub’s face.']},
   {t:'Ask Draka about Thrall as a baby.',r:['draka: Loud. So loud. He would wake the whole camp and Durotan would laugh and say the wolves were jealous. I would have fought the wolves for him. I did, once.','She wipes mud off a small ogre’s face without asking. “Your children will not remember what you said. They will remember who got up. Be the one who gets up.”']},
  ]},
 'gu-tanoth':{
  open:[
   'Gu’Tanoth, the ogre city on the cliffs. Rope bridges, watchtowers, and a toll gate at every one of them.',
   'The first guard wants gold. The second wants a rock cake. The third just wants to see what you’ll give him.',
   'maggie: Ogre tolls. I came through here with the cow in ’86 and they wanted the cow. I said no. They said they wanted the cauldron. I said no louder.',
   'maggie: Trick is, decide what you’re paying before you get to the gate. Not at the gate. At the gate you pay whatever they ask.',
  ],
  opts:[
   {t:'Pay the first toll and nothing else. Hold the line.',r:['Gold at the first gate. A flat “no” at the next four. The guards grumble and let you through anyway, because nobody else ever says no.','maggie: There. See? A limit set before you need it holds. Same at home, love. Decide what you don’t do before bed and the ogre in your pocket can’t talk you into it.']},
   {t:'Bake rock cakes for every guard on the way up.',r:['Maggie hands you the recipe. Rock, flour, something she won’t name. The guards are delighted and one of them tries to marry you.','maggie: Fed the whole city for the price of a sack of flour. That’s housekeeping. That’s the only magic I ever needed and I’m a witch, so that’s saying something.']},
   {t:'Ask Maggie how she makes a home out of a cauldron and a cow.',r:['maggie: Same way you do it with a house. Somebody brings the wood, somebody stirs the pot, somebody milks the cow. Nobody waits for somebody else.','She hooks her arm through yours on the rope bridge. “You bring the firewood, {name}. I’ll stir. We’d do fine, you and me. Don’t tell the cow.”']},
  ]},
 'slash-bash':{
  open:[
   'Deep in Jiggig, the biggest mound of all cracks open. Slash Bash, the zogre chief, climbs out with his crown still on and his jaw hanging loose.',
   'He does not roar. He just comes. Slowly, steadily, like he has all the time in the world and knows you don’t.',
   'sylvanas: A dead king who will not lie down. I almost feel a kinship. Almost. He has no will of his own, only hunger. I know the difference better than anyone.',
   'sylvanas: He is slow. You are not. Do not let him make you slow. That is how the dead win. They wait for you to tire of being alive.',
  ],
  opts:[
   {t:'Keep moving. Never let him pin you.',r:['Circle, strike, step back. He swings at where you were. It takes a long, ugly while, but you do not stop and he eventually does.','sylvanas: You never stood still. Good. Standing still is how I died, the first time. Keep moving tomorrow as well. The bed, the chair, the screen, they all want you still.']},
   {t:'Meet him head-on. Trade blows.',r:['You plant and swing. He hits like a falling tree and you hit back harder. It is stupid and it works and your ribs will remember it.','sylvanas: Reckless. Effective. You remind me of my sister. Alleria would have shot him from a hill. You walked up to him. Both of you are infuriating.']},
   {t:'Ask Sylvanas what she sees in him.',r:['sylvanas: A warning. This is what a body does with no one at the helm. It keeps swinging, keeps hungering, and calls it living. You are at your helm. Stay there.','She draws her bow without another word and puts three arrows in the chief before you have finished thinking about it.']},
  ]},
 // ================= Varlamore =================
 'sunset-coast':{
  open:[
   'The Sunset Coast of Varlamore. Red cliffs, white surf, and the kind of light that makes everything look like a painting.',
   'Down on the sand, naguas made of sulphur hiss up out of the rock and smell like a struck match.',
   'seraphine: Okay, this place is loud. Not the naguas. The waves, the gulls, the wind in the cliffs. It’s all in the same key. Do you hear it? You don’t. That’s okay, I’ll hum it later.',
   'seraphine: The naguas are flat, though. One note. Angry. Let’s give them something else to listen to.',
  ],
  opts:[
   {t:'Clear the naguas off the beach so people can use it.',r:['Sulphur, steam, a lot of jumping. By the time the last one crumbles you are sunburnt and the beach is quiet enough to hear the surf again.','seraphine: You just gave a whole coast its song back. Sit. No, sit, I mean it. Watch the sun go down with me. It’s the best part and nobody ever stays for it.']},
   {t:'Ask her to sing. Right here, on the cliff.',r:['seraphine: You asked! Nobody asks, they just wait for me to start. Okay. Okay, this one’s new, so be nice.','She sings something soft about a harbor and a hand to hold. The naguas stop hissing. You are not sure if it was the song or the look she gives you at the end of it.']},
   {t:'Ask Seraphine when she last had a day off from music.',r:['seraphine: Never? Practice is the day off. It’s the one hour where nobody needs me to be anything. You have something like that, right? A thing you do just because?','She bumps your shoulder with hers. “Then do it this week. Tell me what it was after. I want to hear about it. Maybe over dinner.”']},
  ]},
 'avium-savannah':{
  open:[
   'The Avium Savannah. Dry gold grass to the horizon, sunlight antelope moving across it like water, and hunters who somehow keep pace.',
   'One of the hunters waves you over. He has been running since dawn and he is barely breathing hard.',
   'quinn: Valor’s already up. He says the herd’s turning east. He also says the hunters are good, and Valor doesn’t say that about anybody.',
   'quinn: I ran the Demacian border for years. Long distance, no roads, nobody waiting at the end with water. This? This is a nice afternoon.',
  ],
  opts:[
   {t:'Run with the hunters. All day.',r:['You keep up for an hour. Then half an hour. Then you walk, and then you run again because Quinn is still going and you are not quitting in front of her.','quinn: You walked and then you ran again. That’s the whole thing. Most people walk and stay walking. Same thing tomorrow, just shorter. Build from there.']},
   {t:'Help the hunters set up camp before the sun gets high.',r:['Shade, water, a windbreak out of grass and spears. The hunters come back to it at noon and sit down like it was the best gift they ever got.','quinn: Nobody thinks about the camp. Everybody thinks about the chase. Then they come home and there’s no home to come home to. You thought about the camp. I noticed.']},
   {t:'Ask Quinn about Valor.',r:['quinn: He found me. Not the other way around. I was a kid in Uwendale and he just landed on my arm one day and never left. Best partner I ever had. Don’t tell Garen.','Valor drops out of the sky and lands on her shoulder, looks at you, and makes a sound that is either approval or indigestion.']},
  ]},
 'twilight-temple':{
  open:[
   'The Twilight Temple, high in the Varlamore mountains. Three moons over three shrines, and three champions who walk the halls all night.',
   'Blue moon, blood moon, eclipse. The night has barely started and the halls are already full of light and shadow trading places.',
   'shadowheart: Three moons. Of course there are three. I spent years serving the dark one and praying I’d never see the bright one. Now I can’t stop looking up.',
   'shadowheart: The champions are patient. They don’t have to be anything else. We have to be something they aren’t. Awake, mostly. It’s going to be a long night.',
  ],
  opts:[
   {t:'Take the champions one shrine at a time. Stay awake.',r:['Blue moon first. Then blood. Then the eclipse, which is worst, and you are so tired by then that you stop thinking and just move.','shadowheart: You were on your feet at dawn. I’ve seen clerics of Selûne fail that. Faith’s not a feeling, it turns out. It’s staying up when it’d be easier not to.']},
   {t:'Sit with her under the blue moon first. Just for a while.',r:['shadowheart: Oh. You want to sit. With me. Under a moon. If you’re doing this to be kind, stop. If you’re doing it because you want to, don’t.','You stay. She leans her head on your shoulder and says nothing for a long time, which from her is a declaration.']},
   {t:'Ask Shadowheart how she prays now.',r:['shadowheart: Badly. Honestly. I tell her what I did wrong and then I go to bed. It’s not elegant. Shar wanted elegant. Selûne just wants me back tomorrow.','She touches the silver at her throat. “Whatever you do at night, do it tomorrow too. The second night is the one that counts.”']},
  ]},
 'neypotzli':{
  open:[
   'Neypotzli, the frozen caverns under the Varlamore jungle. Warm above, ice below, and a sorcerer called Amoxliatl who likes it that way.',
   'Icicles the size of pillars. Frost glyphs on every wall. Somewhere ahead, a laugh that echoes wrong.',
   'moira: Caves under a jungle. Ice under heat. Reminds me of home. Blackrock’s all fire under stone, mind, but the feel’s the same. Someone built this to keep folk out.',
   'moira: I run a kingdom from a mountain with a wee lad pulling at my skirts. A frost wizard in a cellar doesn’t scare me. Let’s see what he’s hiding.',
  ],
  opts:[
   {t:'Break the glyphs one by one. Methodical.',r:['Each glyph you crack lets a little warmth in. By the sixth the ice is weeping and Amoxliatl has stopped laughing.','moira: Clean work. One at a time, no shortcuts. That’s how you run a forge and that’s how you run a kingdom. My father’d say the same, if he weren’t made of diamond now.']},
   {t:'Go straight for the sorcerer.',r:['He throws ice. You throw yourself through it. The fight is short and extremely cold and you win it with frost in your eyebrows.','moira: Ha! Straight at him. Dagran’d have loved that. He’s at the age where everything’s a charge. I’ll tell him his mother’s friend fought a wizard. He’ll want it drawn.']},
   {t:'Ask Moira how she does it all.',r:['moira: I don’t, some days. Some days the council waits because a six-year-old needs a story. Let it wait. It can. Your work’ll be there in the morning. Bedtime won’t.','She tucks a frost-stiff strand of hair back. “Now. Wizard. Then I’m going home to read a story. You should too.”']},
  ]},
 'hueycoatl':{
  open:[
   'The Avium Savannah, but the grass is flattened for a mile. The Hueycoatl has come down from the hills, all feathers and coils and a head like a cathedral door.',
   'Every hunter, every farmer, every priest from the nearest village is here with whatever they could carry. Nobody fights this thing alone.',
   'vi: Okay. Okay. That’s a big snake. That’s a big, big snake. I have hit a lot of things and I have never hit anything that size. I’m kind of excited.',
   'vi: Whole village is here. Good. You don’t take a thing like that down by yourself. You take it down by being the one who doesn’t run when it looks at you.',
  ],
  opts:[
   {t:'Get to the head with Vi. Hit it where it counts.',r:['You climb the coils while the village pins the tail. Vi gets there first and hits it so hard the feathers come off. You hit it second. It notices both.','vi: WE DID THAT. You climbed a snake! With me! Your arms are gonna be useless tomorrow and it is gonna feel amazing. Trust me.']},
   {t:'Hold the line with the villagers. Keep them together.',r:['The farmers want to run. You do not let them. You stand in the front with a spear you barely know how to hold, and because you stay, they stay.','vi: You weren’t the strongest one out there. You were the one who didn’t move. That’s rarer. That’s the thing I can’t teach.']},
   {t:'Ask Vi what she’s really fighting for.',r:['vi: Powder. Always Powder. Everything I hit, I’m hitting so she doesn’t have to. Doesn’t always work. I keep swinging anyway.','She wipes blood off her gauntlet. “You’ve got somebody like that. Everybody does. Swing for them. Now come on, snake’s getting up.”']},
  ]},
 // ================= The Fortis Colosseum =================
 'colosseum-javelins':{
  open:[
   'The Fortis Colosseum, Civitas illa Fortis. Sand, sun, and a crowd that has paid good money to see you get hurt.',
   'The gate opens. Two javelin colossi stride out, each carrying a spear the length of a fishing boat. The crowd goes very quiet.',
   'karlach: Oh, I LOVE an arena. Ten years in Avernus, I fought in one every week. Didn’t love that part. Love this part. The part where we win.',
   'karlach: Spears that big, they only go one way at a time. You watch the arm, not the point. Ready, soldier? Course you are.',
  ],
  opts:[
   {t:'Watch the arm. Dodge, close in, strike.',r:['Arm back, step left. Arm back, step right. You close the gap three times and the second colossus goes down with your blade in its knee.','karlach: Clean! That was clean, mate. You read the throw every time. That’s not luck, that’s reps. Keep doing the boring stuff and the boring stuff saves your life.']},
   {t:'Charge the first one before it can set its feet.',r:['You run straight at it. The crowd gasps. The spear goes wide, you go under, and the colossus does not get a second throw.','karlach: HA! That was the stupidest thing I’ve seen all week and I was there for it. Gods, I like you. Engine’s running hot just watching.']},
   {t:'Ask Karlach what the hells arena was like.',r:['karlach: Loud. Hot. Nobody cheered for you, they cheered for the blood. This crowd’s different. They want you to make it. Weird feeling. Good weird.','She bumps her fist against your shoulder, carefully, because she runs hot. “Go on. Show ’em. I’ll be right behind you, yelling.”']},
  ]},
 'colosseum-manticores':{
  open:[
   'Second gate. Three manticores, each with a lion’s body, a human face, and a tail that fires spines like a crossbow.',
   'They attack in order. Magic, then arrows, then claws. Then they argue about who goes first and start over.',
   'rocket: Three heads, three attacks, zero coordination. I’ve seen this before. It’s called the Guardians of the Galaxy. Don’t tell Quill.',
   'rocket: Here’s the thing. They’ve got a pattern. Everything’s got a pattern. Figure the pattern, build the counter, go home. I do this for fun.',
  ],
  opts:[
   {t:'Learn the order. Counter each attack in turn.',r:['Magic, arrows, claws. You switch guard three times a round and by the fourth round you are bored and they are dead.','rocket: Ha! Told ya. Pattern. You figured it quicker than Drax would. Drax would still be explaining why he doesn’t need to figure it.']},
   {t:'Let Rocket build something. Give him five minutes.',r:['rocket: Five minutes! Gimme the javelin shaft, that shield, and whatever that guy in the front row’s drinking.','It is a spine-catcher. It is ugly. It catches every spine the manticores fire and flings them back, and Rocket laughs so hard he has to sit down.']},
   {t:'Ask Rocket why he builds things.',r:['rocket: ’Cause somebody built me, and I didn’t like it. So now I build stuff and I like that. Keeps the hands busy. Keeps the head quiet. Don’t make it a thing.','He fiddles with a bolt that was not loose. “You got a thing you make? Make it this week. Not for anybody. Just ’cause. Then show me. Or don’t. Whatever.”']},
  ]},
 'colosseum-shockwaves':{
  open:[
   'Third gate. The sand goes still, then jumps. A shockwave colossus is already in the ring and every step it takes rolls the floor like a wave.',
   'The trick, the gatekeeper said, is to be somewhere else when the floor moves. He did not say where.',
   'kelsey: Oh, this is just a job with a timer. SI:7 gives me these all the time. Floor shakes every six steps. I counted. You’re welcome.',
   'kelsey: Plan: it steps, we move. Step, move. Boring! Boring is how you get paid and go home with your knees. Let’s go, big guy.',
  ],
  opts:[
   {t:'Count the steps with Kelsey. Move on six.',r:['One, two, three, four, five, jump. The wave passes under you. Six times, then twelve, then the colossus trips on its own rhythm and you are there when it falls.','kelsey: See? Counting! Not glamorous, not in the stories. But I’ve done a hundred jobs and the ones that worked, I counted. Same with your to-do list, I bet.']},
   {t:'Get behind it. Hit the legs.',r:['You run the wave instead of waiting for it, get under the colossus, and take out the back leg before it can turn.','kelsey: Behind it! That’s a rogue move. That’s my move! Hey, you want a job? I can get you a job. Pay’s bad, hours are worse, the company’s great.']},
   {t:'Ask Kelsey what she does when a plan falls apart.',r:['kelsey: Pretend it was the plan. No, seriously. Grab the next thing on the list and do that. A list’s a list. You don’t need the whole thing to go right, just the next line.','She reloads a crossbow the size of her forearm. “Next line, big guy. It’s coming around again.”']},
  ]},
 'colosseum-minotaurs':{
  open:[
   'Fourth gate. Minotaurs, three of them, in plate that should slow them down and does not. The crowd stands up for this one.',
   'A boy in the front row is cheering louder than anyone. His father has a hand on his shoulder, holding him back from the rail.',
   'varian: I fought in a pit like this. No name, no memory, a crowd screaming for Lo’Gosh. I won every bout and I did not know I had a son waiting on the other side of it.',
   'varian: See that boy? That is why we fight well and go home. Not for the crowd. For whoever is at the rail. Shields up, {name}. They charge straight.',
  ],
  opts:[
   {t:'Hold your shield and let them come to you.',r:['The first minotaur hits your shield like a cart. The second hits the first. The third has nowhere to go. Varian takes him while you hold the other two.','varian: You held. You did not chase glory, you held. Anduin would have found that admirable. I used to find it dull. He taught me better.']},
   {t:'Take the fight away from the rail. Protect the crowd.',r:['You drag the whole brawl to the far side of the sand, away from the boy and his father. It costs you a hit to the ribs and nobody in the stands notices.','varian: Nobody saw that but me. That is most of being a father. The hit you take so they never know there was a hit. Good.']},
   {t:'Ask Varian about Anduin.',r:['varian: He hated swords. I pushed. I pushed until he pushed back, and he was right. A son is not a smaller you. He is his own man, and the job is to find out who.','He watches the boy at the rail. “Whatever yours loves, learn it. Even if it is books. Especially if it is books.”']},
  ]},
 'sol-heredit':{
  open:[
   'The last gate. The crowd does not cheer. Sol Heredit walks out alone, salutes you with a spear, and waits for you to be ready.',
   'The grandmaster of the Colosseum has never lost. He has also never cheated, never rushed, never once looked bored.',
   'sylvanas: A man who fights fair and wins anyway. I have met three like him in my life. Two are dead. One of them was me, once.',
   'sylvanas: He will not trick you. He will simply be better, for longer. Your only answer is to be exactly as good, for exactly as long. Begin.',
  ],
  opts:[
   {t:'Match him. Blow for blow, as long as it takes.',r:['He is better. You know it after ten seconds. But he tires at the same rate you do, and you do not stop, and on the hundredth exchange he lowers the spear and bows.','sylvanas: You did not out-fight him. You out-lasted him. That is the only victory I respect. It is the one I had to learn the hard way, and then unlearn, and then learn again.']},
   {t:'Study him for a full minute before you move.',r:['A minute of nothing. The crowd shifts. Sol does not. Then you see it: a tiny hitch when he shifts to his back foot. You go there, and only there, until it is over.','sylvanas: Patience. An archer’s weapon. Alleria would have seen it in half the time, but she would not have waited. You waited. Better.']},
   {t:'Ask Sylvanas what she would do if he won.',r:['sylvanas: Get up. That is all I have ever done. Dead, cursed, hunted, I got up. Pride is the only thing I have left and I am very good at it.','She puts a hand flat on your chest, briefly, like she is checking for a heartbeat. “Yours works. Use it. Go.”']},
  ]},
 // ================= The Ancient Vaults =================
 'ghorrock':{
  open:[
   'The Ghorrock Prison, in the far north. Ice walls, iron chains, and a vault that Zaros sealed himself. The seal is cracked.',
   'Duke Sucellus waits in the dark below, feeding on the cold. The colder it gets, the stronger he gets, and it is getting colder.',
   'maggie: Ice. Chains. A duke. Lovely. I brought the cauldron. I always bring the cauldron. We’re going to need something hot before this is through.',
   'maggie: Thing about a cold like this is you don’t fight it. You outlast it. Fire, soup, a dry pair of socks. Boring beats dramatic every time.',
  ],
  opts:[
   {t:'Build a fire at the door first. Then go down.',r:['Twenty minutes of firewood and Maggie’s cauldron, then you go down warm. The Duke feels the heat on your skin and flinches before you swing.','maggie: Warm first, fight second. You listened! Nobody listens. Same at home, love. Fix the roof before the rain, not after. You know this. Keep knowing it.']},
   {t:'Go straight down and end it fast.',r:['Cold like knives. You do not stop. The Duke is slow in the first minute and you give him nothing but that minute.','maggie: Well. That worked. I’m not going to say it was the sensible way. I am going to say I’ve got the kettle on, and you look like a man who needs it.']},
   {t:'Ask Maggie why she never settled anywhere.',r:['maggie: I settle everywhere. For a night. Then the road calls and off we go, the cow and me. Home’s not a place, it’s the fire you light wherever you are.','She pokes the cauldron. “Though I’ll admit a kitchen with a door would be nice. If a certain somebody ever asked. No rush. Soup?”']},
  ]},
 'stranglewood':{
  open:[
   'The Stranglewood. Trees that grow through the people who die in them, roots that move when you look away, and at the center of it, Vardorvis.',
   'The air is wet and green and wrong. Something that was a knight once is now mostly bark.',
   'keyleth: Oh, no. Oh, the trees are hurting. Can you feel it? They don’t want to be doing this. Something’s making them. Someone. I can hear it.',
   'keyleth: Okay. Okay, I can do this. I’m the Voice of the Tempest, I talked down a whole forest of fire once. Mostly. Vax helped. Just… stay close?',
  ],
  opts:[
   {t:'Cut a path to Vardorvis and take him down.',r:['Every root you cut grows back slower than the last. By the time you reach the heart of the wood your arms are shredded and the thing at the center is almost relieved.','keyleth: The trees went quiet. You did that. Not with a spell, just… with your arms, over and over. Pike would say that’s a kind of prayer. I think she’s right.']},
   {t:'Ask Keyleth to speak to the forest first.',r:['keyleth: Okay. Okay. Hi. Hi, trees. I know. I know, it hurts. We’re going to make it stop. I promise.','The wood shudders. The roots pull back from the path. Keyleth is crying a little and pretending she isn’t, and Vardorvis is suddenly alone.']},
   {t:'Ask Keyleth what she prays to.',r:['keyleth: The wind, mostly. The Ashari don’t really have a god, we have the elements. I talk to them every morning. Sometimes they answer, sometimes I just feel less alone. Both count.','She takes your hand without seeming to notice she did it. “What do you do in the mornings? Do that tomorrow. Even if it’s just one minute of quiet. Especially then.”']},
  ]},
 'the-scar':{
  open:[
   'The Scar, where the Wilderness tears open and the sea pours into nothing. At the bottom, something older than the gods is breathing.',
   'The Leviathan rises. Scales like ship hulls. An eye the size of a lighthouse lamp. The water around it is boiling.',
   'missfortune: Big fish. I’ve hunted bigger. No, I haven’t, that’s a lie. Bilgewater talks about things like this and nobody ever comes back with a tooth.',
   'missfortune: Here’s the deal. We work it like a job. Rope, hooks, a lot of powder, and you do exactly what I say until it stops moving. Then drinks.',
  ],
  opts:[
   {t:'Work the hooks. Pin it to the cliff.',r:['Three hooks. Three ropes. The Leviathan drags half the cliff into the water before the third one holds, and then it is a very big fish on a very big line.','missfortune: Pinned! Like a job. Like a proper, boring, well-run job. You know how many men I’ve hired who couldn’t do that? Dinner’s on me. The good tavern.']},
   {t:'Let Sarah shoot. You just keep it looking at you.',r:['You stand on the ledge and make yourself interesting. Sarah empties both pistols into the eye from behind. It is loud, fast and done.','missfortune: You stood there. On purpose. In front of that. Either you’re brave or you trust me, and I’m not sure which one I like more. Both, I think. Both’s good.']},
   {t:'Ask Miss Fortune what she does when she’s not working.',r:['missfortune: Working. Don’t look at me like that. Fine. Cards. I play cards with the crew and I cheat and they know I cheat. It’s the one hour a week nobody calls me captain.','She holsters a pistol. “Get yourself an hour like that. Then invite me to it. I’ll let you win. Once.”']},
  ]},
 'lassar':{
  open:[
   'The Lassar Undercity, buried under the Ice Mountain. A whole city dead and whispering, and at the heart of it a thing that is nothing but whisper.',
   'The voices start before you reach the first street. They sound like people you know. They are not.',
   'malfurion: I know these voices. The Nightmare had the same ones, in the Dream. It spoke in Tyrande’s voice for a hundred years and I almost believed it.',
   'malfurion: Hear me. Whatever it says in a voice you love, the one you love is at home, and she is not saying it. Hold that, and the whisper has no hands.',
  ],
  opts:[
   {t:'Walk through the whispers. Do not answer them.',r:['They say your name. They say what you did wrong last week. They say she is tired of you. You keep walking and the Whisperer, finding no grip, screams and comes out to fight.','malfurion: You did not answer. I answered, once. It cost me centuries and it cost her more. Go home tonight and tell her something true. The whisper hates the truth.']},
   {t:'Ask Malfurion about the thousand years she waited.',r:['malfurion: She did not wait. She led. She fought a war and raised a people and I was asleep. When I woke, she was still there. I have never understood why. I thank Elune for it daily.','He lays a hand on the dead stone. “Do not make her wait. Whatever it is. The dishes, the talk, the walk. Do it awake.”']},
   {t:'Find the source. Break the Whisperer at its throat.',r:['It has no throat. It has a shape, barely, and a voice that is every voice. You hit the shape until the voices come apart.','malfurion: Loud, direct, done. Cenarius would have sighed at you. I find I did not mind it. Come. The surface, and the sun, and whoever is waiting in it.']},
  ]},
 'phantom-muspah':{
  open:[
   'The fourth vault. Snow, old bones, and the ghost of a muspah stitched together out of ice and something worse. It flickers in and out like a bad memory.',
   'It screams in a voice that has no body. The cold comes off it in waves and so does the spite.',
   'draka: A ghost made of cold and anger. I have seen orcs like that. Durotan’s brother, almost. A thing that remembers every wrong and nothing else.',
   'draka: It wants you to be angry too. Do not give it that. Be the mother wolf. Calm, close, and ready to bite only once.',
  ],
  opts:[
   {t:'Stay calm. Strike only when it solidifies.',r:['It flickers. You wait. It flickers again. You wait. Then it is solid for one breath and you are already there, and the ice comes apart.','draka: Patience. The hardest thing to teach a cub, and the thing that keeps them alive. You have it. Your own little ones will learn it from watching you. They always do.']},
   {t:'Rush it. Keep it from re-forming.',r:['You do not let it breathe. Every time it starts to come together you are already hitting it. It is exhausting and it works.','draka: That was a Frostwolf charge. Loud and all at once. Durotan would have been proud and I would have shouted at you after. Consider yourself shouted at. Well done.']},
   {t:'Ask Draka what she tells young parents.',r:['draka: Nothing. I ask them what they are afraid of. Then I say: good. The fear means you care. Now go home and be afraid in the same room as your child.','She brushes snow off your shoulder like you are one of hers. “That is the whole secret. Same room. Every night. Now, the ghost.”']},
  ]},
};
