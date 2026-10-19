// Quests, wave 2 batch C: Rocket (Hobbies, tier 5), the final Hobbies quest after Ash, Harry, Thor and the Wise Old Man.
// The engine builds steps and rewards from `tier`; these trees follow the iron-body format in lib/dialogue.mjs.

/** @type {Record<string,any>} */
export const QUESTS={
 'something-worth-building':{name:'Something Worth Building',area:'hobbies',giver:'rocket',tier:5,
  blurb:'Rocket has been watching you read, tinker and play for weeks. He’ll never admit he’s impressed. He wants you on a build anyway.',
  say:['Talk to Rocket in the Guildhall’s back workshop.','Report back to Rocket on the Guildhall roof.','Meet Rocket at the expo hall for the unveiling.']},
};

/** @type {Record<string,any>} */
export const TREES={
 // ---------------- Something Worth Building (Rocket, Hobbies, tier 5) ----------------
 'something-worth-building-1':{who:'rocket',bg:'facility-scenes/businesses.webp',start:'a',nodes:{
  a:{s:'narrator',t:'A thin curl of smoke drifts from the Guildhall’s back room. Inside, a raccoon in goggles is soldering something that hums in a worrying way.',next:'b'},
  b:{s:'rocket',t:'Don’t touch that. Don’t touch that either. Actually, just stand there with your hands in your pockets.',next:'c'},
  c:{s:'rocket',t:'So you’re the guy. Ash’s badge, Harry’s ball, Thor’s horn, the old man’s whatever. Everybody’s got a story about you.',next:'d'},
  d:{s:'rocket',t:'Me? I don’t do stories. I do builds. And I’ve got one I can’t finish alone. Don’t make it a thing.',opts:[
   {t:'What are we building?',next:'what'},
   {t:'You need help? You?',next:'you'},
   {t:'Is that thing supposed to hum like that?',next:'hum'}]},
  what:{s:'rocket',t:'Not telling yet. Half the fun of a build is figuring out what it wants to be while you’re making it.',next:'e'},
  you:{s:'rocket',t:'Hey. Watch it. I need a second pair of hands. Thumbs, specifically. I’ve got thumbs. I need more thumbs.',next:'e'},
  hum:{s:'rocket',t:'Probably. Eighty percent sure. Seventy. Step back a little. There you go.',next:'e'},
  e:{s:'rocket',t:'Here’s the deal. I made this stuff from junk my whole life. Nobody told me to. I just couldn’t stop.',next:'f'},
  f:{s:'rocket',t:'That’s a hobby, pal. Not a chore. Not a resume line. A thing you do on purpose because your hands won’t sit still.',next:'g'},
  g:{s:'rocket',t:'Fifteen of ’em. Read, learn, make, play. Do it like you mean it. Then come find me and we’ll see if you’re worth the parts.',opts:[
   {t:'Fifteen. Hand me a wrench. (Start “Something Worth Building”)',next:'yes',do:[{quest:['something-worth-building','start']}]},
   {t:'Not now, Rocket. I’ve got enough on my plate.',next:'no'}]},
  yes:{s:'rocket',t:'Ha. Okay. Don’t blow anything up. That’s my job.',end:true},
  no:{s:'rocket',t:'Sure. Fine. Whatever. I’ll just be here. Building. Alone. It’s fine. I’m used to it.',end:true}}},

 'something-worth-building-2':{who:'rocket',bg:'ui-scenes/Bg_City_01_Mid.jpg',start:'a',nodes:{
  a:{s:'narrator',t:'You find Rocket up on the Guildhall roof, bolting a dish made of old pots and a bent fork to the chimney.',next:'b'},
  b:{s:'rocket',t:'Fifteen. Huh. I had money on twelve. Lost a bet to a tree, which is a sentence I say more than you’d think.',next:'c'},
  c:{s:'rocket',t:'So which one stuck? And don’t give me the polite answer. I can smell polite.',opts:[
   {t:'The one where I made something with my hands.',next:'made',do:[{flag:'rocket-maker'}]},
   {t:'The one I did with my kids.',next:'kids'},
   {t:'Honestly? The one I almost quit.',next:'quit'}]},
  made:{s:'rocket',t:'Yeah? Feels good, right? Making a thing that wasn’t there this morning. Best feeling in the galaxy. Don’t tell Quill.',next:'d'},
  kids:{s:'rocket',t:'…Huh. Okay. Yeah. That’s the right answer. I had a little guy I built stuff for once. Still do. Shut up.',next:'d'},
  quit:{s:'rocket',t:'Every build I ever finished, I almost quit three times. The quitting part means you care. The finishing part means you’re stubborn.',next:'d'},
  d:{s:'rocket',t:'Now the hard part. Anybody can binge a hobby for a week. I want ten different days. Not ten hours in one. Ten days.',next:'e'},
  e:{s:'rocket',t:'A page, a sketch, a game, a thing you’re learning. Small is fine. Missing is not. Ten days. Got it?',opts:[
   {t:'Ten different days. I’ll be there. (Advance)',next:'f',do:[{quest:['something-worth-building','advance']}]}]},
  f:{s:'narrator',t:'Rocket flips a switch. The pot-dish crackles, then plays a tinny, perfect song from somewhere very far away.',next:'g'},
  g:{s:'rocket',t:'Yeah, I know. I’m a genius. Get outta here. Day one starts now.',end:true,do:[{xp:['hobbies',1000]}]}}},

 'something-worth-building-3':{who:'rocket',bg:'facility-scenes/expo.webp',start:'a',nodes:{
  a:{s:'narrator',t:'The expo hall is packed. Ash, Harry, Thor and the Wise Old Man crowd around a sheet draped over something tall.',next:'b'},
  b:{s:'thor',t:'He would not let me peek! I offered him a feast! He said, and I quote, “Not even for two feasts.”',next:'c'},
  c:{s:'rocket',t:'Alright, alright, settle down. {name}. Get up here. You did ten days. You get to pull the sheet.',next:'d'},
  d:{s:'narrator',t:'You pull. Underneath is a machine built from everything: Ash’s old badge case, a lute string, gears, a fishing reel, a golden wing.',next:'e'},
  e:{s:'rocket',t:'Every piece is from one of your days. Every one. I kept track. Don’t look at me like that.',next:'f'},
  f:{s:'rocket',t:'I didn’t have anybody for a long time. Just junk and a bad attitude. Then I found a crew. Turns out you build those too.',opts:[
   {t:'So what does it do?',next:'does'},
   {t:'You built this for me?',next:'forme'},
   {t:'Welcome to the family, Rocket.',next:'family'}]},
  does:{s:'rocket',t:'Nothing useful. Spins. Lights up. Plays a song. That’s the whole point. Not everything has to be for something.',next:'g'},
  forme:{s:'rocket',t:'For us. Don’t make it weird. It’s already weird. I’m blaming you.',next:'g'},
  family:{s:'rocket',t:'…Yeah. Okay. Somebody get the tree in here. He’s gonna want to see this.',next:'g'},
  g:{s:'narrator',t:'The machine whirs to life. Every light comes on at once. Even Rocket, for one second, forgets to look unimpressed.',next:'h'},
  h:{s:'rocket',t:'Keep building stuff, pal. Not for anybody. For you. That’s how you stay you.',end:true,do:[{quest:['something-worth-building','complete']}]}}},
};
