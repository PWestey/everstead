// Everstead's written scenes: an introduction for every character, short roaming encounters, and
// village vignettes for days when nobody has joined yet. Scenes are plain data; the UI renders lines
// in order. A line is either narration (a string) or [speakerId, text].
import {FELLOWS,FAMILY,characterById} from './cast.mjs';

/** Introductions, shown when someone joins. Keyed 'intro:<id>'. */
export const INTROS={
 aldric:['The chapel door creaks open before you knock.',['aldric','You keep showing up. That is most of faith, you know. The rest is learning to listen.'],['aldric','The lamps here go out if nobody tends them. I would be honoured to tend them with you.'],'Aldric bows, and the candle beside him burns a little brighter.'],
 bram:['A shield the size of a door leans against the inn wall. Its owner is carrying two children on his shoulders.',['bram','Ha! So you are the one making all the fuss about family dinners. Good. Somebody should.'],['bram','I am Bram. I guard people, not walls. If yours need guarding, I am here.']],
 kael:['Thud. Thud. Thud. Someone is punishing a sandbag in the Training Yard.',['kael','You came back. Most people come once.'],['kael','Kael. I don’t care how strong you are today. I care whether you show up tomorrow.'],'He tosses you a pair of wraps without another word.'],
 corin:['A neat stack of ledgers sits on the Market counter, every corner squared.',['corin','I have been watching your numbers. Not bad. Not organised, either.'],['corin','Corin, Quartermaster. Give me your chaos and I will hand you back a plan.']],
 tobin:['A hammer rings from the Workshop, followed by cheerful whistling.',['tobin','Oh! You must be the one who finally fixed that porch step. Do you know how long that thing wobbled?'],['tobin','Tobin. Builder, mostly. Fighter when the roof needs defending. Welcome aboard!']],
 ren:['In the Library courtyard a swordsman repeats the same cut, slowly, perfectly.',['ren','One thousand. Every morning.'],['ren','I am Ren. Mastery is just boredom, survived. Will you survive it with me?']],
 ariane:['At dusk the Chapel windows glow, though no candles are lit. A woman in white and blue robes turns, a soft light fading from her hand.',['ariane','You have been showing up. Prayer, gratitude, the quiet hour. Light notices that.'],['ariane','Ariane Lumenhart. I left the Wizards’ Tower to be useful somewhere small. Everstead seemed like a good place to start.'],'She lights a lantern with a touch and hands it to you.'],
 maren:['The inn smells of bread and cinnamon. A woman is laying out far too many plates.',['maren','Sit, sit! Nobody eats alone at my table. That is the only rule.'],['maren','I am Maren. I heard you have been putting family first. That earns you the good pie.']],
 kira:['In the Training Yard a red-haired woman is sitting on a sparring dummy she has clearly just beaten.',['kira','Oh good, a new sparring partner. The dummy stopped trying.'],['kira','Kira. I train every day, I talk too much while I do it, and I always show up. Two out of three of those are virtues.']],
 shallan:['At a Market table buried in books, a red-haired woman is sketching you before you have even said hello.',['shallan','Hold still. No, that is worse. Go back to the determined face.'],['shallan','Shallan. I study things, I draw things, and I am told I talk too much. All true.'],'She tears out the page and hands it to you. It is far better than you look.'],
 wren:['Someone has planted marigolds along every path in the village.',['wren','They grow better when the paths are kept tidy. So do people.'],['wren','I am Wren. If you help me with the garden, I will show you where the strawberries hide.']],
 violet:['Steel flashes in the Library courtyard. A dagger thuds into the target, dead centre, then another.',['violet','You’ve been keeping your word to yourself. Most people don’t. I noticed.'],['violet','Violet. I wasn’t built for any of this. I trained until it didn’t matter.'],'She pulls the daggers free and offers you one, handle first.'],
};

/** Roaming encounters. `with` must have joined for the scene to appear. Family scenes grant bond; Fellow scenes grant a little gold. */
export const ROAMS=[
 {id:'aldric-1',with:'aldric',title:'Morning bells',lines:['You find Aldric polishing the chapel bell before sunrise.',['aldric','It rings the same whether anyone is listening or not. I find that comforting.'],'You ring it together. The sound carries all the way to the farm.']},
 {id:'aldric-2',with:'aldric',title:'A borrowed strength',lines:[['aldric','Do you know why I am strong?'],'He sets down a sword far heavier than it looks.',['aldric','Because I stopped pretending I had to be strong alone.']]},
 {id:'bram-1',with:'bram',title:'Shield lessons',lines:['Bram is teaching his daughters to hold a shield. Mostly they are giggling under it.',['bram','The trick is not the shield. The trick is who you are standing in front of.']]},
 {id:'bram-2',with:'bram',title:'Supper duty',lines:[['bram','My wife says I burn the stew because I stir it like I am fighting it.'],'He stirs it like he is fighting it.',['bram','She is right. Do not tell her.']]},
 {id:'kael-1',with:'kael',title:'Rain day',lines:['It is pouring. Kael is training anyway.',['kael','Weather is an opinion.'],'You last ten minutes. He nods once. From Kael, that is a parade.']},
 {id:'kael-2',with:'kael',title:'Rest day',lines:['You find Kael asleep under a tree in the middle of the afternoon.',['kael','Rest is training too. Do not look so surprised.']]},
 {id:'corin-1',with:'corin',title:'The big board',lines:['Corin has pinned your whole week to a board with coloured string.',['corin','Here. And here. You are not busy. You are scattered. Different problem.']]},
 {id:'corin-2',with:'corin',title:'Closing time',lines:[['corin','The best merchants know when to close the shop.'],'He flips the sign to CLOSED at exactly six.',['corin','Work expands to fill the hours you give it. So give it fewer.']]},
 {id:'tobin-1',with:'tobin',title:'The squeaky gate',lines:['Tobin is oiling every gate in the village, one by one.',['tobin','Nobody notices a gate that does not squeak. That is how you know it is done right.']]},
 {id:'tobin-2',with:'tobin',title:'Ten minutes',lines:[['tobin','Ten minutes a day. That is my whole secret.'],'He gestures at a workshop that is spotless.',['tobin','Ten minutes, every day, for six years.']]},
 {id:'ren-1',with:'ren',title:'The thousandth cut',lines:['Ren stops at nine hundred and ninety-nine and hands you the sword.',['ren','The last one is yours.'],'It is clumsy. He smiles anyway.']},
 {id:'ren-2',with:'ren',title:'Distractions',lines:['A butterfly lands on Ren’s blade mid-swing. He freezes, waits, and lets it fly off.',['ren','Focus is not ignoring the world. It is choosing what you give your attention to.']]},
 {id:'ariane-1',with:'ariane',title:'Lantern spell',lines:['Ariane teaches you a simple light spell. Your first attempt produces a sad little spark.',['ariane','Everyone’s first light is small. What matters is that you light it again tomorrow.'],'By the tenth try, the spark holds.']},
 {id:'ariane-2',with:'ariane',title:'The quiet hour',lines:['You find Ariane sitting in the empty chapel, eyes closed, perfectly still.',['ariane','At the Tower they taught me a hundred spells. Stillness was the one that changed me.'],'You sit beside her. It is the calmest you have felt all week.']},
 {id:'maren-1',with:'maren',title:'Too many plates',lines:['Maren has set two extra places at the table.',['maren','Always. Somebody always shows up hungry.'],'Within the hour, somebody does.']},
 {id:'maren-2',with:'maren',title:'The recipe',lines:[['maren','My grandmother’s pie recipe has one secret ingredient.'],['maren','You have to make it for someone you love. It does not work otherwise. I have tested this.']]},
 {id:'kira-1',with:'kira',title:'Sparring',lines:['Kira taps you on the shoulder with a wooden practice blade. Then again. And again.',['kira','You keep dropping your guard when you get tired. Everyone does. The trick is getting tired later.'],'By the end you are still losing, just more slowly. She calls that progress.']},
 {id:'kira-2',with:'kira',title:'Rest day',lines:['You find Kira stretching on the grass, for once not hitting anything.',['kira','I used to think rest was for people who were not trying hard enough.'],['kira','Turns out it is for people who want to keep trying next week.']]},
 {id:'shallan-1',with:'shallan',title:'The sketchbook',lines:['Shallan flips through a sketchbook full of the village: the forge, the chapel, you at your desk.',['shallan','I draw the work, not just the results. The results lie. The work never does.']]},
 {id:'shallan-2',with:'shallan',title:'The hard page',lines:['You find Shallan staring at a blank page, quill frozen.',['shallan','The hardest part of any task is the first honest line.'],'She writes one. Then another. By sunset the page is full.']},
 {id:'wren-1',with:'wren',title:'Strawberry secret',lines:['Wren leads you behind the shed, where a hidden patch of strawberries grows.',['wren','Tidy the shed with me first. That is the price of admission.']]},
 {id:'wren-2',with:'wren',title:'Weeds',lines:[['wren','Weeds are just a reminder. Come back tomorrow.'],'She pulls exactly three, then sits in the sun.',['wren','A little every day. The garden never gets ahead of you.']]},
 {id:'violet-1',with:'violet',title:'Dawn drills',lines:['Before sunrise, Violet is already in the courtyard running the same dagger drill, slowly, then faster.',['violet','Talent is a head start. Repetition is the whole race.'],'She makes you do it twenty times. Then twenty more.']},
 {id:'violet-2',with:'violet',title:'Bad days',lines:['You find Violet moving carefully today, wrapping a sore wrist.',['violet','Some days my body argues with me. I show up anyway and do the small version.'],['violet','The small version still counts. Don’t ever let anyone tell you it doesn’t.']]},
];

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
export const introFor=id=>INTROS[id]?{id:'intro:'+id,title:'Meet '+characterById(id).name,lines:INTROS[id]}:null;
export const ALL_SPEAKERS=[...FELLOWS,...FAMILY];
