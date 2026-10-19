// Expedition first-visit scenes, part 2: Karamja and the Kharidian Desert (lib/expedition-data.mjs).
// Same format as lib/expeditions/scenes.mjs. See docs/WRITING-BRIEF.md.
// Scene = {open:[lines], opts:[{t:'player choice', r:[reply lines]}]}.
// A plain line is narration; "<castId>: text" or "player: text" is someone speaking.

/** @type {Record<string,{open:string[],opts:{t:string,r:string[]}[]}>} */
export const EXPEDITION_SCENES={
 // ================= Karamja =================
 'brimhaven-dungeon':{
  open:[
   'Behind Brimhaven, a man called Saniboch sits at a cave mouth and charges a toll that would make a banker blush.',
   'Inside, vines choke every passage. Past them: moss giants, baby dragons, and a smell like a wet library on fire.',
   'nash: Eight hundred and seventy-five coins to walk into a hole. I respect the hustle. I’d respect it more if it were mine.',
   'nash: Job’s simple. Clear a path, haul out the bones, get paid. Try to keep that handsome face out of the dragon end.',
  ],
  opts:[
   {t:'Pay the toll. Honest work starts with honest money.',r:['nash: Paid up front, no haggling. You’re the kind of client I’d actually call back. Late at night, even.','Saniboch counts every coin twice and waves you in with the warmth of a closing door.']},
   {t:'Hack through the vines yourself. All of them.',r:['Your axe swings until your shoulders are jelly and the jungle finally gives up arguing.','nash: Sweaty, stubborn, on schedule. Careful, I start billing extra for staring.']},
   {t:'Take on the moss giants for their bones.',r:['They are big, slow and covered in a garden. You are faster, and you have somewhere to be.','nash: Clean work. Bones bagged. Buy me a drink on the dock and we’ll call it even.']},
  ]},
 'karamja-volcano':{
  open:[
   'The volcano in the middle of Karamja steams like a kettle someone forgot about for a thousand years.',
   'Inside, a narrow path winds past skeletons, sulphur pools, and a lesser demon who has made himself very comfortable.',
   'ahsoka: There’s a stillness under all this noise. Can you feel it? The rock’s been patient longer than any of us.',
   'ahsoka: The demon wants you angry. Angry is easy for him. Calm is what he can’t do anything with.',
  ],
  opts:[
   {t:'Breathe. Then walk past him without a word.',r:['The demon roars, spits, flaps. You keep walking. Eventually he looks a little embarrassed.','ahsoka: That was harder than a fight. You chose it anyway. I noticed.']},
   {t:'Fight him on the ledge, steady and slow.',r:['You take your time, give nothing away, and the demon tumbles back into the heat he came from.','ahsoka: Focus first, blade second. You’re learning. Try not to get a big head about it.']},
   {t:'Sit with her a moment and give thanks you got here.',r:['ahsoka: Gratitude in a volcano. That’s a new one, even for me.','She sits beside you on the warm stone, shoulder to shoulder, and for a while the mountain breathes and neither of you rushes it.']},
  ]},
 'tai-bwo-wannai':{
  open:[
   'Deep in the jungle, the village of Tai Bwo Wannai lives behind a fence that the jungle tries to eat every night.',
   'Jogres lurk in the undergrowth. A grumpy merchant named Gabooty pays in trading sticks. The children watch you from the huts.',
   'piotr: A fence with holes, a jungle that will not stop growing, and little ones who need it to stand. This is my kind of work.',
   'piotr: The chief says they keep the place safe one repair at a time. Like a home, da? Nobody fixes it once. You fix it every day.',
  ],
  opts:[
   {t:'Mend the fence, plank by plank.',r:['piotr: Not glamorous. Very good. A strong fence lets the children sleep. That is the whole point of a strong man.','By dusk the fence stands straight and a small boy pats the post you fixed like it’s a horse.']},
   {t:'Cut back the jungle around the huts.',r:['The machete swings, the vines retreat, and for one evening the village has a little more room to breathe.','piotr: Tomorrow it grows back. So tomorrow we come back. This is called being a grown-up, my friend.']},
   {t:'Teach the kids to whittle while Piotr watches the gate.',r:['A dozen tiny carved jogres, each one wonkier than the last. The children are thrilled.','piotr: You will be a hero here for one trading stick and an afternoon of time. Same as at home. Time is what they remember.']},
  ]},
 'tzhaar-city':{
  open:[
   'Under the volcano, a city of black glass glows red with lava. The TzHaar walk its halls like living obsidian.',
   'They call you JalYt: one of the soft surface folk. Their coin is tokkul. Their respect is earned, never bought.',
   'gamora: Guards, warriors, mages, crafters. Every one of them knows exactly what they’re for. I like this place already.',
   'gamora: They remember every life they’ve lived. So don’t embarrass yourself. Or me. Especially me, since I’m looking.',
  ],
  opts:[
   {t:'Enter the Fight Pit. Prove yourself.',r:['The crowd hums like a forge. You walk out last, bruised, and the TzHaar thump their chests once in your direction.','gamora: Precise. Efficient. Annoyingly attractive under pressure. Don’t let it go to your head.']},
   {t:'Work a shift with the crafters. Earn the tokkul.',r:['Obsidian is unforgiving. So are the crafters. By the end, one of them grunts approval at your edge.','gamora: You did the boring part right the first time. That’s rarer than courage. And far more appealing.']},
   {t:'Ask a TzHaar elder what they value most.',r:['The elder thinks for a long time and says, roughly, that strength done daily becomes who you are.','gamora: I could’ve told you that. But I’d rather you heard it here, and then looked at me like that.']},
  ]},
 'tztok-jad':{
  open:[
   'The Fight Cave is a pit of heat and hissing rock. You have survived sixty-two waves. Your legs know every one of them.',
   'Then the ground shakes. Something enormous climbs out of the lava: TzTok-Jad, the champion the TzHaar send when they want a warrior to fail.',
   'stephen: Listen to me. He tells you what’s coming. When he rears up, it’s fire from above. When he stomps, it’s stone from range.',
   'stephen: Your job is one thing. Read the tell, switch your prayer, never blink. I did this kind of thing for years. It’s called practice.',
   'Small healers scuttle out of the rock and cluster around his legs, eager to undo all your hard work.',
   'stephen: Every boring morning you showed up for led here. Discipline is just faith with a stopwatch. Now.',
  ],
  opts:[
   {t:'Pray, switch, pray, switch. Don’t miss one.',r:['He rears. You switch. He stomps. You switch. A hundred times, until the giant sways and crashes into the lava, and the TzHaar hand you a cape of living fire.','stephen: Flawless. I’m allowed to be impressed once a decade. That was it.']},
   {t:'Deal with the healers first, then finish him.',r:['You pull the healers away one by one, and suddenly Jad’s wounds stop closing. He falls hard, still roaring.','stephen: Fix the leak before you bail the boat. Surgeons call that triage. You call it Tuesday.']},
  ]},

 // ================= Kharidian Desert =================
 'shantay-pass':{
  open:[
   'At the edge of the desert, Shantay runs a gate, a shop and a very small jail for people who forget to buy a pass.',
   'Beyond the gate the sand stretches gold to the horizon. A lizard on a rock looks at you like you are lunch.',
   'rey: I grew up somewhere like this. Rule one: water before pride. Rule two: water before anything else.',
   'rey: Buy a waterskin. Buy another one. Then we walk, and we don’t stop until we’ve earned the shade.',
  ],
  opts:[
   {t:'Buy the pass, the robes and three waterskins.',r:['Shantay looks almost disappointed. You won’t be visiting his jail today.','rey: Planning ahead is the most underrated kind of strong. Okay, now let’s go get sunburned.']},
   {t:'March out at dawn and race her to the far dune.',r:['She wins, obviously. You come second, by a very respectable margin, and drink half a skin at once.','rey: Not bad for someone from somewhere green. Same time tomorrow?']},
   {t:'Hunt the desert lizards for the slayer master.',r:['They are tough, they are angry, and the last one only stays down once you crack it with an ice cooler.','rey: You came prepared. That’s the whole secret. Every desert I ever crossed, I crossed with a plan.']},
  ]},
 'pollnivneach':{
  open:[
   'Pollnivneach is a pretty desert town with a well, a bar, a kebab stand and two gangs who would love to stab each other.',
   'The Menaphite thugs run one end. The bandits run the other. The mayor runs mostly from both.',
   'yennefer: How charming. A town where everyone is too proud to admit they’re tired of fighting. I’ve been to that wedding.',
   'yennefer: Put on the fake beard, darling. It suits you, astonishingly. Now let’s solve a feud before dinner.',
  ],
  opts:[
   {t:'Sit both gang leaders down and make them talk.',r:['It takes hours, three pots of tea and one thrown chair. But by sunset they’ve agreed to share the well.','yennefer: Patience, nerve and a beard. Do you know how rare it is to find a man who can do all three?']},
   {t:'Pickpocket the thugs for the mayor’s missing coin.',r:['A gentle bump, a quick hand, and the purse is yours. The thug blinks at his empty belt for a long time.','yennefer: Light fingers. I’ll remember that. In a good way, mostly.']},
   {t:'Skip the feud. Buy her a kebab and watch the sunset.',r:['yennefer: Choosing me over chaos. Well. I suppose I’ll let the town survive one more evening without us.','She steals a bite of your kebab, then steals a kiss, and the gangs can wait.']},
  ]},
 'sophanem':{
  open:[
   'Sophanem was a city struck by plague. Now its pyramid is struck by tourists with sacks and no sense of self-preservation.',
   'A guardian mummy stands at the entrance, wrapped and weary. He asks whether you are ready to face the tomb. Nobody ever says no.',
   'harry: Right. Cursed tomb, ancient god of the dead, booby-trapped urns. Hermione would have read three books first. I’ve read zero.',
   'harry: But I did learn one thing: respect the dead, and don’t touch anything that hums.',
  ],
  opts:[
   {t:'Read every carving on the walls first.',r:['The carvings tell of Icthlarin guiding souls safely to rest. The traps make a lot more sense now.','harry: You studied first. You’d have got on with my friend. She’d have made you study twice.']},
   {t:'Plunder the golden chests. Carefully.',r:['Gold, jewels and one very angry swarm of scarabs. You keep the gold. The scarabs keep your dignity.','harry: That was brilliant. Terrifying, but brilliant. Let’s never tell anyone about the scarabs.']},
   {t:'Leave the sarcophagus alone and say a prayer for the dead.',r:['The guardian mummy nods slowly, the way old things do when someone finally gets it right.','harry: Some things you don’t take. You just honour them and go home. Good call, mate.']},
  ]},
 'kalphite-lair':{
  open:[
   'In the desert east of Shantay, a hole in the sand drops into the dark. Tie a rope. Climb down. Regret, optionally.',
   'Below is a hive the size of a city. Kalphite workers click past. Soldiers watch. The walls hum with ten thousand legs.',
   'geralt: Insectoids. Organised ones. Worse than a nest of drowners. Better smell, though.',
   'geralt: Keep your back to the wall and your sword oiled. And keep moving. Hives don’t like guests who stand still.',
  ],
  opts:[
   {t:'Fight your way through the soldiers.',r:['Shell, mandible, shell, mandible. You find a rhythm, and the rhythm carries you through.','geralt: Not bad. Training shows. It always does, eventually.']},
   {t:'Clear a safe camp near the rope and hold it.',r:['You stack rocks, block the tunnels and keep the fire small. By morning nobody has eaten you, which counts as a win.','geralt: Making a home in a monster’s house. Hm. Ciri would’ve liked you.']},
  ]},
 'kalphite-queen':{
  open:[
   'At the deepest point of the hive, the tunnels open into a vast chamber. The air is thick with heat and clicking.',
   'kitai: Stay close, stupid. If anything in here is going to bite you, it had better be me.',
   'Workers swarm the walls. Guardians plant themselves at the edges. In the middle, something huge unfolds its legs.',
   'The Kalphite Queen rises, armoured from crown to tail, and screeches loud enough to shake sand from the ceiling.',
   'kitai: When her shell breaks she sheds it and grows wings. Two fights in one. Like every argument we’ve ever had.',
   'kitai: Strong legs. Steady breath. Win this and come home to me in one piece, Aleran. I have plans for that piece.',
  ],
  opts:[
   {t:'Crack the shell, then meet her second form head-on.',r:['The first carapace splits with a crack like thunder. She rises winged and furious, and you take her down anyway.','kitai: Twice the queen, half the trouble. Now come here and let me check you for bites.']},
   {t:'Fight back to back with Kitai.',r:['She guards your left, you guard hers. The Queen cannot find an opening, and finally collapses in a heap of broken crown.','kitai: We are a terrifying couple. I want everyone to know. Starting with you, tonight.']},
   {t:'Take the long fight. Outlast her.',r:['It is slow and brutal. But you have trained for slow and brutal. The Queen tires first, and falls.','kitai: Stubborn as a gargant. I love that about you. Mostly.']},
  ]},
};
