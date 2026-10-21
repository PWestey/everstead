// Expedition first-visit scenes, part 2: Karamja and the Kharidian Desert (lib/expedition-data.mjs).
// Same format as lib/expeditions/scenes.mjs. See docs/WRITING-BRIEF.md.
// Scene = {open:[lines], opts:[{t:'player choice', r:[reply lines]}]}.
// A plain line is narration; "<castId>: text" or "player: text" is someone speaking.

/** @type {Record<string,{open:string[],opts:{t:string,r:string[]}[]}>} */
export const EXPEDITION_SCENES={
 // ================= Karamja =================
 'brimhaven-dungeon':{
  open:[
   'Outside Brimhaven, a man called Saniboch sits at a cave mouth charging a toll that would make a banker blush.',
   'Inside, vines choke every passage. Past them wait moss giants, baby dragons and a smell like a wet library on fire.',
   'nash: Eight hundred seventy-five coins to walk into a hole. I respect the hustle. I’d respect it more if I was the one collecting.',
   'nash: Job’s easy. Clear a path, haul the bones, collect the fee. Keep that pretty face away from the end that breathes fire. I hate refunds.',
  ],
  opts:[
   {t:'Pay the toll. Honest work starts with honest money.',r:['nash: Paid up front, no haggling. You’re the kind of client I actually call back. Maybe even off the clock.','Saniboch counts every coin twice and waves you in with all the warmth of a closing door.']},
   {t:'Hack through the vines yourself. All of them.',r:['Your axe swings until your shoulders are jelly and the jungle finally stops arguing.','nash: Sweaty, stubborn, on schedule. Careful, I charge extra for staring. Me, I mean. I’m the one staring.']},
   {t:'Take on the moss giants for their bones.',r:['They are huge, slow and wearing an entire garden. You are faster, and you have a dinner to get home for.','nash: Clean work. Bones bagged before deadline. Buy me a drink on the dock and we’re square.']},
  ]},
 'karamja-volcano':{
  open:[
   'The volcano in the middle of Karamja steams like a kettle somebody forgot about a thousand years ago.',
   'Inside, a narrow path winds past skeletons, sulphur pools and a lesser demon who has made himself very much at home.',
   'ahsoka: There’s a quiet under all this noise. Feel it? Master Plo used to call that listening with your gut.',
   'ahsoka: The demon wants you angry. Anger he can use. Calm, he has no idea what to do with. Trust me, I’ve watched it go the other way.',
  ],
  opts:[
   {t:'Breathe. Then walk past him without a word.',r:['The demon roars, spits and flaps. You keep walking. Eventually he looks a bit embarrassed.','ahsoka: Walking away was harder than the fight. Skyguy never figured that out. You just did.']},
   {t:'Fight him on the ledge, steady and slow.',r:['You take your time and give him nothing, and the demon tumbles back into the heat he crawled out of.','ahsoka: Focus first, blade second. Not bad. Don’t let it go to your head. I’ll know.']},
   {t:'Sit with her a moment and give thanks you got here.',r:['ahsoka: Saying thanks inside a volcano. That’s new. Rex would say you’ve got your priorities straight.','She sits beside you on the warm stone, shoulder to shoulder, and neither of you hurries the moment.']},
  ]},
 'tai-bwo-wannai':{
  open:[
   'Deep in the jungle, Tai Bwo Wannai lives behind a fence that the jungle tries to eat every single night.',
   'Jogres lurk in the undergrowth. A grumpy merchant called Gabooty pays in trading sticks. Children peer at you from the huts.',
   'piotr: A fence with holes, a jungle that does not stop, little ones who need the fence to stand. On our farm at home, this was every summer.',
   'piotr: The chief says they mend it a little each day. Like a house, da? Nobody fixes a house once. You fix it Tuesday, and again Wednesday.',
  ],
  opts:[
   {t:'Mend the fence, plank by plank.',r:['piotr: Not exciting. Very good. A strong fence, and the children sleep. That is what strong arms are for.','By dusk the fence stands straight, and a small boy pats the post you fixed like it is a horse.']},
   {t:'Cut back the jungle around the huts.',r:['The machete swings, the vines retreat, and for one night the village has a little more room to breathe.','piotr: Tomorrow it grows back. So tomorrow we cut again. My papa called this being a man. Illyana called it boring. Both were right.']},
   {t:'Teach the kids to whittle while Piotr watches the gate.',r:['A dozen tiny carved jogres, each wonkier than the last. The children are delighted.','piotr: One afternoon and a knife, and you are their hero. Your own little ones are the same. They forget the toy. They remember who sat on the floor.']},
  ]},
 'tzhaar-city':{
  open:[
   'Beneath the volcano, a city of black glass glows red with lava. The TzHaar walk its halls like living obsidian.',
   'They call you JalYt, which roughly means soft surface person. Their coin is tokkul. Their respect is not for sale.',
   'gamora: Guards, fighters, mages, crafters. Every one of them knows exactly what they’re for. Most organised place I’ve ever been. Quill would hate it.',
   'gamora: They remember every life they’ve lived. So don’t embarrass yourself. Or me. I’m watching.',
  ],
  opts:[
   {t:'Enter the Fight Pit. Prove yourself.',r:['The crowd hums like a forge. You walk out last, bruised, and the TzHaar thump their chests once in your direction.','gamora: You didn’t waste a single move. I noticed. I notice everything. Don’t make it weird.']},
   {t:'Work a shift with the crafters. Earn the tokkul.',r:['Obsidian is unforgiving. So are the crafters. By the end of the shift one of them grunts at your edge in a way that might be approval.','gamora: Boring part, done right, first time. Nebula and I were raised on that. You make it look… better.']},
   {t:'Ask a TzHaar elder what they value most.',r:['The elder thinks for a long time, then says, roughly, that strength done daily becomes who you are.','gamora: I could have told you that. It sounded better coming from a walking volcano. Stop smiling at me.']},
  ]},
 'tztok-jad':{
  open:[
   'The Fight Cave is heat and hissing rock. You have survived sixty-two waves, and your legs remember every one.',
   'The ground shakes. Something enormous hauls itself out of the lava: TzTok-Jad, the champion the TzHaar send when they want you to fail.',
   'stephen: Listen. He telegraphs everything. Rears up, it’s magic. Stomps, it’s range. Switch your prayer to match. That’s it. That’s the job.',
   'stephen: I spent months at Kamar-Taj drawing the same circle in the air until Wong stopped sighing at me. This is that. Read, switch, don’t blink.',
   'Little healers scuttle out of the rock and cluster at his legs, eager to undo all your hard work.',
   'stephen: Every dull, repetitive morning you put in led here. I hate sounding like the Ancient One, but here we are. Now.',
  ],
  opts:[
   {t:'Pray, switch, pray, switch. Don’t miss one.',r:['He rears. You switch. He stomps. You switch. Over and over, until the giant sways and topples into the lava, and the TzHaar hand you a cape of living fire.','stephen: Flawless. I allow myself to be impressed about once a decade. Congratulations, you used it.']},
   {t:'Deal with the healers first, then finish him.',r:['You drag the healers off one by one, and suddenly Jad’s wounds stop closing. He falls hard, still roaring.','stephen: Stop the bleeding, then operate. Triage. I was the best surgeon in New York, you know. I mention it rarely. Fine, often.']},
  ]},

 // ================= Kharidian Desert =================
 'shantay-pass':{
  open:[
   'At the edge of the desert, Shantay runs a gate, a shop and a very small jail for anyone who forgets to buy a pass.',
   'Beyond the gate the sand runs gold to the horizon. A lizard on a rock is looking at you like you are lunch.',
   'rey: On Jakku you learn fast. Water first. Then shade. Then pride, if there’s any left over. There usually isn’t.',
   'rey: Buy a waterskin. Then buy another. I once traded a whole day of scrap for a quarter portion. I don’t waste water.',
  ],
  opts:[
   {t:'Buy the pass, the robes and three waterskins.',r:['Shantay looks faintly disappointed. You will not be visiting his jail today.','rey: Three skins. Good. Planning’s the strong part nobody sees. Right, let’s go get sunburnt.']},
   {t:'March out at dawn and race her to the far dune.',r:['She wins, obviously. You come second by a very respectable margin and drink half a skin in one go.','rey: Not bad for someone from somewhere green. Same time tomorrow? I’ll even let you think you’re catching up.']},
   {t:'Hunt the desert lizards for the slayer master.',r:['They are tough, they are angry, and the last one only stays down once you finish it with an ice cooler.','rey: You packed the cooler before we left. That’s the whole secret. I never crossed a dune without knowing how I’d get back.']},
  ]},
 'pollnivneach':{
  open:[
   'Pollnivneach is a pretty desert town with a well, a bar, a kebab stand and two gangs who would love to stab each other.',
   'Menaphite thugs run one end of town. Bandits run the other. The mayor mostly runs.',
   'yennefer: Two proud men who would sooner burn a town than admit they’re tired. I know that argument intimately.',
   'yennefer: Put on the fake beard. No, it suits you, which is frankly upsetting. Let’s end a feud before dinner. I made a reservation.',
  ],
  opts:[
   {t:'Sit both gang leaders down and make them talk.',r:['It takes hours, three pots of tea and one thrown chair. By sunset they have agreed to share the well.','yennefer: Patience, nerve and a beard. I’ve met kings who managed one of the three.']},
   {t:'Pickpocket the thugs for the mayor’s missing coin.',r:['A bump, a quick hand, and the purse is yours. The thug stares at his empty belt for a very long time.','yennefer: Clever hands. I’ll keep that in mind. Don’t look so pleased with yourself. It’s only mostly unbecoming.']},
   {t:'Skip the feud. Buy her a kebab and watch the sunset.',r:['yennefer: You chose me over a crisis. Do you know how rarely that happens? Geralt would be halfway into the bandit camp by now.','She steals a bite of your kebab, then a kiss, and the gangs can wait.']},
  ]},
 'sophanem':{
  open:[
   'Sophanem survived a plague. Its pyramid has not survived the tourists, who arrive with sacks and no sense of self-preservation.',
   'A guardian mummy waits at the entrance, wrapped and weary, and asks whether you are ready. Nobody has ever said no. Several should have.',
   'harry: Right. Cursed tomb, god of the dead, booby-trapped urns. Hermione would’ve read three books on this. I’ve read the sign.',
   'harry: Bill broke curses on tombs like this for Gringotts. His big tip was don’t touch anything that hums.',
  ],
  opts:[
   {t:'Read every carving on the walls first.',r:['The carvings tell of Icthlarin guiding the dead safely to rest. Suddenly the traps make a lot more sense.','harry: You actually read it. Hermione would adore you. Then she’d quiz you.']},
   {t:'Plunder the golden chests. Carefully.',r:['Gold, gems and one very angry swarm of scarabs. You keep the gold. The scarabs keep your dignity.','harry: That was brilliant. Horrible, but brilliant. We are never telling Ron about the scarabs. He’s bad enough with spiders.']},
   {t:'Leave the sarcophagus alone and say a prayer for the dead.',r:['The guardian nods slowly, the way old things do when someone finally gets it right.','harry: Yeah. Some things you just leave be. Good call, mate.']},
  ]},
 'kalphite-lair':{
  open:[
   'In the desert east of Shantay, a hole in the sand drops into darkness. Tie a rope. Climb down. Regret, optionally.',
   'Below is a hive the size of a city. Workers click past. Soldiers watch. The walls hum with ten thousand legs.',
   'geralt: Insectoids. Organised. Worse than arachas. Smell better than drowners, though.',
   'geralt: Back to the wall. Keep moving. Should’ve brought a Swallow. Too late now.',
  ],
  opts:[
   {t:'Fight your way through the soldiers.',r:['Shell, mandible, shell, mandible. You find a rhythm, and the rhythm carries you through.','geralt: Hm. Not bad. Training shows. Always does.']},
   {t:'Clear a safe camp near the rope and hold it.',r:['You stack rocks, block two tunnels and keep the fire small. By morning nothing has eaten you, which down here counts as a win.','geralt: Making camp in a monster’s house. Ciri used to do that. Drove me mad.']},
  ]},
 'kalphite-queen':{
  open:[
   'At the deepest point of the hive the tunnels open into a vast chamber. The air is thick with heat and clicking.',
   'kitai: Stay close, Aleran. If anything down here bites you, it had better be me.',
   'Workers swarm the walls. Guardians plant themselves at the edges. In the middle, something huge unfolds its legs.',
   'The Kalphite Queen rises, armoured from crown to tail, and screeches loud enough to shake sand from the ceiling.',
   'kitai: Break her shell and she grows wings and comes back angrier. I like her already.',
   'kitai: Win this and come home to me in one piece. I have plans for that piece. Several. You will not get much sleep.',
  ],
  opts:[
   {t:'Crack the shell, then meet her second form head-on.',r:['The first carapace splits with a crack like thunder. She rises winged and furious, and you put her down anyway.','kitai: Two queens in one, and you beat both. Hold still. I am checking you for bites. Thoroughly.']},
   {t:'Fight back to back with Kitai.',r:['She guards your left, you guard hers. The Queen cannot find an opening, and finally collapses in a heap of broken crown.','kitai: We are terrifying together. The whole Horse Clan should see. Actually, no. Only I get to see you like this.']},
   {t:'Take the long fight. Outlast her.',r:['It is slow and brutal. You have trained for slow and brutal. The Queen tires first, and falls.','kitai: Stubborn as a gargant. I love that. Usually. Not when it is about asking for directions.']},
  ]},
};
