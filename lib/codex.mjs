// The Codex: the owner's knowledge base (notes from books, podcasts and talks), merged in from Jedi Codex.
// Cards live in lib/codex-cards.json as {id, topic, front, back, source}. To add knowledge, append cards there;
// the id is 'k' + the first 8 hex of sha1(topic + '|' + front), so it stays stable and progress never mixes up.
// Review is Leitner spaced repetition, the same as Codex: boxes 1-7 come back after 1, 2, 4, 7, 14, 30, 60 days.
// Progress lives in state.codex.cards[id] = {box, due, mastered?}. A card not in there hasn't been introduced yet.
import CARDS from './codex-cards.json' with {type:'json'};

/** @type {{id:string,topic:string,front:string,back:string,source:string}[]} */
export const CODEX_CARDS=CARDS;
export const BOX_DAYS={1:1,2:2,3:4,4:7,5:14,6:30,7:60};
export const MAX_BOX=7;
/** Codex topics → Everstead life areas (a review trains that area's skill). */
export const TOPIC_AREA={'Parenting':'fatherhood','Marriage':'marriage','Faith':'faith','Leadership':'work','Money':'work',
 'Habits & Systems':'discipline','Lifting':'fitness','Nutrition':'fitness','Growth':'hobbies'};
export const cardArea=card=>TOPIC_AREA[card.topic]||'hobbies';
/** @type {(id:string)=>any} */
export const codexCard=id=>CODEX_CARDS.find(c=>c.id===id);

const addDays=(day,n)=>{const d=new Date(day+'T12:00:00');d.setDate(d.getDate()+n);const p=x=>String(x).padStart(2,'0');return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}`};
/** The card after a review: "got it" moves it up a box, "forgot" sends it back to box 1 for tomorrow. */
export function reviewed(progress,got,today){const box=got?Math.min((progress?.box||1)+1,MAX_BOX):1;
 return {...(progress||{}),box,due:addDays(today,got?BOX_DAYS[box]:1),mastered:progress?.mastered||box===MAX_BOX}}

/** New cards are introduced one topic at a time in rotation (Parenting, Marriage, Faith…), so a day mixes subjects.
 *  Cards appended to the JSON later slot into their topic's turn automatically. */
const TOPIC_ORDER=Object.keys(TOPIC_AREA),byTopic=TOPIC_ORDER.map(t=>CODEX_CARDS.filter(k=>k.topic===t));
export const INTRO_ORDER=[];for(let i=0;INTRO_ORDER.length<CODEX_CARDS.length;i++)for(const list of byTopic)if(list[i])INTRO_ORDER.push(list[i]);
/** Today's queue: cards already introduced that are due, then new cards up to today's allowance. */
export function codexQueue(state,today,newPerDay){const prog=state.codex?.cards||{},c=state.codex||{};
 const due=CODEX_CARDS.filter(k=>prog[k.id]&&prog[k.id].due<=today);
 const newLeft=Math.max(0,newPerDay-(c.newDay===today?c.newCount:0));
 const fresh=INTRO_ORDER.filter(k=>!prog[k.id]).slice(0,newLeft);
 return {due,fresh,queue:[...due,...fresh]}}
export const codexMastered=state=>Object.values(state.codex?.cards||{}).filter(p=>p.mastered).length;
