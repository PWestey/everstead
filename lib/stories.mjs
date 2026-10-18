// Everstead's written scenes. Each character has one block: an introduction (shown when they join) and
// a few roaming encounters. A line is either narration (a string) or [speakerId, text]. A character
// without a block still gets a short generated introduction, so adding someone never breaks the game.
import {FELLOWS,FAMILY,characterById} from './cast.mjs';

/** @type {Record<string,{intro:any[],roams:{title:string,lines:any[]}[]}>} */
export const SCENES={
 // ---- Fellows ----
 obiwan:{intro:['A robed man sits cross-legged on the Chapel steps, perfectly still, as if he has been waiting for you.',['obiwan','Hello there. You have been keeping your quiet hours. I could feel it.'],['obiwan','Obi-Wan Kenobi. Patience is not waiting, you know. It is how you behave while you wait.']],
  roams:[{title:'Breathing lesson',lines:['Obi-Wan asks you to sit and breathe. Nothing else.',['obiwan','Your mind is already three days ahead of you. Bring it back to this one.'],'It is harder than any drill. It is also the best ten minutes of your week.']},
   {title:'The high ground',lines:['You find Obi-Wan on the hill above the village at sunrise.',['obiwan','I come up here to remember how small my troubles are.'],['obiwan','Perspective is the one advantage nobody can take from you.']]}]},
 bram:{intro:['At the Rose Café a broad-shouldered man is carefully arranging wildflowers in a jar, tongue between his teeth.',['bram','Twenty years married and I still pick her flowers every week. She pretends not to notice. She always notices.'],['bram','Bram. I guard people, not walls. Start with the one you married.']],
  roams:[{title:'Date night',lines:['Bram is polishing his boots and humming.',['bram','Thursday is our night. Rain, snow or dragons. You protect the thing that matters, or it quietly stops mattering.']]},
   {title:'Supper duty',lines:[['bram','My wife says I burn the stew because I stir it like I am fighting it.'],'He stirs it like he is fighting it.',['bram','She is right. Do not tell her.']]}]},
 din:{intro:['The Hearth Inn door opens and a man in silver armour steps in. A tiny green creature peeks out from the satchel on his hip.',['din','I was a hunter. Then this one found me, and I became a father. That is the way.'],['din','Din Djarin. Your little ones are watching what you do more than what you say. Make it count.']],
  roams:[{title:'Bedtime',lines:['Din sits by the fire while the little one falls asleep in his lap.',['din','I have faced armies. Nothing is harder than staying still so a child can sleep.'],'He does not move for an hour.']},
   {title:'Lessons',lines:['Din patiently helps the little one lift a pebble, again and again.',['din','I do not teach by telling. I teach by doing it beside him, every day.']]}]},
 darrow:{intro:['Before dawn, someone is already in the Training Yard, moving through a fighting form so fast the blade sings.',['darrow','You came back. Most people come once, feel sore, and decide they were never built for it.'],['darrow','Darrow. I was not built for it either. I built myself. You can too.'],'He tosses you a practice blade without another word.'],
  roams:[{title:'Rain drills',lines:['It is pouring. Darrow is training anyway.',['darrow','Storms do not ask if you are ready. Neither does life.'],'You last ten minutes. He nods once, and somehow that feels like a medal.']},
   {title:'The long climb',lines:['Darrow walks you up the hill behind the village, carrying a pack of stones.',['darrow','I grew up deep underground. Every step up still feels like a gift.'],['darrow','Never waste a body that can still climb.']]}]},
 tony:{intro:['Sparks fly from a Market stall that has been turned into a workshop. A man in a stained apron looks up and grins.',['tony','You finish things. Do you know how rare that is? I have forty prototypes and maybe six finished.'],['tony','Tony Stark. Genius, inventor, recovering starter-of-projects. Let us build something that actually ships.']],
  roams:[{title:'Ship it',lines:['Tony stares at a gadget that is ninety percent done.',['tony','The last ten percent is where the real work hides. Everyone loves starting.'],'He finishes it before dinner. He looks genuinely surprised.']},
   {title:'Lights off',lines:['Tony is locking up the workshop at a sensible hour, for once.',['tony','Somebody told me the suit is only as good as the man in it. The man needs sleep.']]}]},
 peter:{intro:['A young man is up a ladder at the Workshop fixing a neighbour’s shutter, a sandwich held in his teeth.',['peter','Oh, hey! Sorry, one sec. Okay. Hi! You are the one who keeps the house running, right?'],['peter','Peter Parker. Big things are great, but somebody has to take out the trash. Turns out that is kind of the job.']],
  roams:[{title:'Chore list',lines:['Peter is crossing items off a very long list taped to the door.',['peter','Aunt May taught me: do the boring stuff first, then you get to enjoy everything else.']]},
   {title:'Helping out',lines:['Peter carries groceries for an old woman, fixes a fence, and returns a lost cat, all before lunch.',['peter','Small stuff adds up. That is basically my whole deal.']]}]},
 kaladin:{intro:['In the Library courtyard a spearman runs the same drill over and over, slow and exact, as the wind picks up around him.',['kaladin','You keep your promises to yourself. That is rarer than you think.'],['kaladin','Kaladin. I have learned the next step matters more than the destination. Walk it with me.']],
  roams:[{title:'Grey days',lines:['Kaladin sits on the Library steps, staring at nothing. He looks tired in a way sleep does not fix.',['kaladin','Some days the fog comes in. I still do the drill. Not because I feel like it. Because I said I would.'],'He stands, picks up his spear, and starts.']},
   {title:'Carrying others',lines:['You watch Kaladin teach a nervous recruit to hold a spear.',['kaladin','I protect people because someone once did it for me.'],['kaladin','Your habits do the same. The people around you lean on them more than you know.']]}]},
 jory:{intro:['A lute is playing badly outside the Guildhall. Its owner is laughing too hard to care.',['jory','I am terrible at this! Isn’t it wonderful? I get a little less terrible every week.'],['jory','Jory, wandering bard. Joy is a skill, friend. You have to practise it.']],
  roams:[{title:'Open mic',lines:['Jory drags you onstage at the Guildhall to play a single, wobbly song.',['jory','Nobody remembers if you were good. They remember that you tried.']]},
   {title:'Fishing',lines:['Jory sits at the lake with a rod and no bait.',['jory','I am not here for the fish. I am here for the not-doing-anything-else.']]}]},
 // ---- Family ----
 ariane:{intro:['At dusk the Chapel windows glow, though no candles are lit. A woman in white and blue robes turns, a soft light fading from her hand.',['ariane','You have been showing up. Prayer, gratitude, the quiet hour. Light notices that.'],['ariane','Ariane Lumenhart. I left the Wizards’ Tower to be useful somewhere small. Everstead seemed like a good place to start.'],'She lights a lantern with a touch and hands it to you.'],
  roams:[{title:'Lantern spell',lines:['Ariane teaches you a simple light spell. Your first attempt produces a sad little spark.',['ariane','Everyone’s first light is small. What matters is that you light it again tomorrow.'],'By the tenth try, the spark holds.']},
   {title:'The quiet hour',lines:['You find Ariane sitting in the empty chapel, eyes closed, perfectly still.',['ariane','At the Tower they taught me a hundred spells. Stillness was the one that changed me.'],'You sit beside her. It is the calmest you have felt all week.']}]},
 tyrande:{intro:['Moonlight falls across the Rose Café though it is barely dusk. A tall priestess stands in it, watching couples at the candlelit tables.',['tyrande','You keep choosing your wife. Not once, but again and again. That is the only kind of devotion that lasts.'],['tyrande','I am Tyrande Whisperwind. I have kept my vows for ten thousand years. I would be glad to help you keep yours.']],
  roams:[{title:'Night watch',lines:['You find Tyrande on the village wall long after everyone is asleep.',['tyrande','I check on my people every night. Not because danger is coming, but because they are mine.'],['tyrande','Go home. Look in on the ones who are yours. Then sleep.']]},
   {title:'The long vow',lines:['Tyrande turns a simple silver ring on her finger.',['tyrande','People think a vow is kept in grand moments. It is kept on ordinary Tuesdays.'],['tyrande','A kind word. A shared meal. Showing up when you are tired. Ten thousand years of Tuesdays.']]}]},
 vin:{intro:['Something lands lightly on the Hearth Inn’s roof. A small, sharp-eyed young woman drops down beside you.',['vin','I grew up with nobody. No one checked if I ate. No one came to watch me do anything.'],['vin','Vin. You show up for your kids. You have no idea how much that is. I do.']],
  roams:[{title:'Watching',lines:['Vin perches on a fence, watching children play in the square.',['vin','Kids do not need perfect. They need someone who looks up when they say “watch this.”']]},
   {title:'Trust',lines:['Vin hands you a coin, then another, then a third.',['vin','That is how trust works. One small promise kept at a time. Kids keep count, you know.']]}]},
 kira:{intro:['In the Training Yard a red-haired woman is sitting on a sparring dummy she has clearly just beaten.',['kira','Oh good, a new sparring partner. The dummy stopped trying.'],['kira','Kira. I train every day, I talk too much while I do it, and I always show up. Two out of three of those are virtues.']],
  roams:[{title:'Sparring',lines:['Kira taps you on the shoulder with a wooden practice blade. Then again. And again.',['kira','You keep dropping your guard when you get tired. Everyone does. The trick is getting tired later.'],'By the end you are still losing, just more slowly. She calls that progress.']},
   {title:'Rest day',lines:['You find Kira stretching on the grass, for once not hitting anything.',['kira','I used to think rest was for people who were not trying hard enough.'],['kira','Turns out it is for people who want to keep trying next week.']]}]},
 fannie:{intro:['Someone sprints past the Training Yard, skids to a stop, and pushes a pair of rainbow goggles up into her hair.',['fannie','You run this route too? Nice! Most people quit at the hill.'],['fannie','Fannie! Explorer, runner, professional getter-of-fresh-air. Come on, the next hill is the best part.']],
  roams:[{title:'Trail run',lines:['Fannie takes you on a trail you never knew existed, all the way to a hidden waterfall.',['fannie','Moving is how I find new places. And new moods.']]},
   {title:'Warm-up',lines:['Fannie insists on a ten-minute warm-up before anything.',['fannie','Skip it and you are fine today. Skip it every day and your knees file a complaint.']]}]},
 shallan:{intro:['At a Market table buried in books, a red-haired woman is sketching you before you have even said hello.',['shallan','Hold still. No, that is worse. Go back to the determined face.'],['shallan','Shallan. I study things, I draw things, and I am told I talk too much. All true.'],'She tears out the page and hands it to you. It is far better than you look.'],
  roams:[{title:'The sketchbook',lines:['Shallan flips through a sketchbook full of the village: the forge, the chapel, you at your desk.',['shallan','I draw the work, not just the results. The results lie. The work never does.']]},
   {title:'The hard page',lines:['You find Shallan staring at a blank page, quill frozen.',['shallan','The hardest part of any task is the first honest line.'],'She writes one. Then another. By sunset the page is full.']}]},
 kate:{intro:['An arrow thunks into the Workshop’s door frame, pinning a loose shingle neatly back in place. A dog barks approvingly.',['kate','Sorry! Faster than finding a ladder. Mostly.'],['kate','Kate Bishop. I heard someone around here actually keeps their house in order. Respect. That is harder than archery.'],'Her dog is already asleep on your boots.'],
  roams:[{title:'The ten-minute rule',lines:['Kate is speed-cleaning her kitchen with a timer running.',['kate','Ten minutes every night. Dishes, counters, done. Future me always says thanks.'],'The timer dings. The kitchen sparkles. Her dog licks the last crumb off the floor.']},
   {title:'Target practice',lines:['Kate sets up targets behind the Workshop: a broken hinge, a leaky gutter, a squeaky gate.',['kate','Every chore is just a target. Line it up, let it fly, move on to the next one.'],'You fix three of them together before sundown.']}]},
 violet:{intro:['Steel flashes in the Library courtyard. A dagger thuds into the target, dead centre, then another.',['violet','You’ve been keeping your word to yourself. Most people don’t. I noticed.'],['violet','Violet. I wasn’t built for any of this. I trained until it didn’t matter.'],'She pulls the daggers free and offers you one, handle first.'],
  roams:[{title:'Dawn drills',lines:['Before sunrise, Violet is already in the courtyard running the same dagger drill, slowly, then faster.',['violet','Talent is a head start. Repetition is the whole race.'],'She makes you do it twenty times. Then twenty more.']},
   {title:'Bad days',lines:['You find Violet moving carefully today, wrapping a sore wrist.',['violet','Some days my body argues with me. I show up anyway and do the small version.'],['violet','The small version still counts. Don’t ever let anyone tell you it doesn’t.']]}]},
 misty:{intro:['A splash at the lake, then a laugh. A red-haired girl in suspenders wades out holding a fishing rod over her head.',['misty','You actually took a day off for fun? Finally! Everyone in this village works way too much.'],['misty','Misty. Water trainer, swimmer, and the best angler you will ever meet. Grab a rod.']],
  roams:[{title:'Lake day',lines:['Misty challenges you to a fishing contest. She wins. Easily.',['misty','The point is not the fish. The point is you are here and not answering messages.']]},
   {title:'Cannonball',lines:['Misty dares you to jump off the dock. You do. It is freezing.',['misty','See? Now you feel alive. Hobbies are supposed to do that.']]}]},
};

/** Introductions, keyed by character id. */
export const INTROS=Object.fromEntries(Object.entries(SCENES).map(([id,s])=>[id,s.intro]));
/** Roaming encounters. `with` must have joined for the scene to appear. Family scenes grant bond; Fellow scenes grant a little gold. */
export const ROAMS=Object.entries(SCENES).flatMap(([id,s])=>s.roams.map((r,i)=>({id:id+'-'+(i+1),with:id,...r})));

/** Village vignettes, available any time. */
export const VILLAGE=[
 {id:'village-1',title:'Market morning',lines:['The market is busy this morning. A child sells you a slightly squashed apple for one copper.','It is the best apple you have had all year.'],gold:40},
 {id:'village-2',title:'Lost hen',lines:['A hen has escaped and is leading half the village on a chase through the gardens.','You catch it. The farmer insists on paying you in eggs and coin.'],gold:60},
 {id:'village-3',title:'Notice board',lines:['Someone has pinned a note to the village board: “Whoever keeps fixing things around here — thank you.”','You decide not to mention it was you.'],gold:30},
 {id:'village-4',title:'Old map',lines:['In the attic of the inn you find an old map of Everstead. It was a single cottage once.','Every building since was built one day at a time.'],gold:50},
];

const FAMILY_BOND=40,FELLOW_GOLD=120;
function pick(list,seen,now){const fresh=list.filter(s=>!seen.includes(s.id)),pool=fresh.length?fresh:list;return pool[Math.abs(Math.floor(now/1000))%pool.length]}
/** Choose a roaming scene for this state: prefer unseen scenes with joined characters, mix in the village. */
export function roamScene(state,now){
 const joined=new Set([...Object.keys(state.fellows||{}),...Object.keys(state.family||{})]);
 const people=ROAMS.filter(s=>joined.has(s.with));
 const useVillage=!people.length||Math.floor(now/1000)%4===0;
 const seen=state.roam?.seen||[];
 if(useVillage){const v=pick(VILLAGE,seen,now);return {...v,kind:'village',with:null,bond:0,gold:v.gold,summary:v.title+' · +'+v.gold+' gold'}}
 const s=pick(people,seen,now),who=characterById(s.with),isFamily=FAMILY.some(f=>f.id===s.with);
 return {...s,kind:isFamily?'family':'fellow',bond:isFamily?FAMILY_BOND:0,gold:isFamily?0:FELLOW_GOLD,summary:`${s.title} with ${who.name} · `+(isFamily?`+${FAMILY_BOND} bond`:`+${FELLOW_GOLD} gold`)};
}
/** The introduction scene for a character; characters without a written one get a short generated intro. */
export function introFor(id){const who=characterById(id);if(!who)return null;const lines=INTROS[id]||[`${who.name} arrives in Everstead.`,[id,`I am ${who.fullName||who.name}. I have heard about you. Let us get to work.`],who.description];return {id:'intro:'+id,title:'Meet '+who.name,lines}}
export const ALL_SPEAKERS=[...FELLOWS,...FAMILY];
