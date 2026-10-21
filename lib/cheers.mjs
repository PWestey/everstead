// Cheers: when you check off a habit, a character from that habit's life area steps in, nearly full screen, says a
// line or two, and you answer RPG-style ("I am committed!"). Written content is in lib/cheers/*.mjs.
// When: the first habit you complete in an area each day, and the moment you finish every daily for the day.
// Who: a Fellow or Family member of that area you've recruited (anyone from the area until you have one).
// What: a cheer that mentions what you actually did (matched on the habit's words: "Make My Bed" → a line about the
// bed), or else one of your Codex notes from that area, introduced in their voice, which always fits.
import {AREA_IDS,fellowsInArea,familyInArea} from './cast.mjs';
import {habitDay,habitDue} from './habits.mjs';
import {CODEX_CARDS,TOPIC_AREA} from './codex.mjs';
import {CHEERS as FA} from './cheers/fellows-a.mjs';
import {CHEERS as FB} from './cheers/fellows-b.mjs';
import {CHEERS as MA} from './cheers/family-a.mjs';
import {CHEERS as MB} from './cheers/family-b.mjs';
import {CHEERS as W4A} from './cheers/wave4-a.mjs';
import {CHEERS as W4B} from './cheers/wave4-b.mjs';
import {CHEERS as W4C} from './cheers/wave4-c.mjs';
import {CHEERS as W4D} from './cheers/wave4-d.mjs';

/** @type {Record<string,{cheers:any[],codex:string,ack:string,done:any}>} */
export const CHEERS={...FA,...FB,...MA,...MB,...W4A,...W4B,...W4C,...W4D};
/** Word families: a habit word on the left matches a cheer containing any word on the right. */
const SYNONYMS={bed:['bed'],dish:['dish','dishes','sink','kitchen'],run:['run','ran','running','jog','miles'],walk:['walk','walked','steps'],
 lift:['lift','lifted','weights','gym','workout','push-ups','squat','reps'],workout:['workout','gym','lift','train','training','sweat'],stretch:['stretch','stretched','mobility','yoga'],
 pray:['pray','prayed','prayer','prayers','knees'],prayer:['pray','prayed','prayer','prayers'],bible:['bible','scripture','psalm','verse','word'],scripture:['scripture','bible','verse','psalm'],
 gratitude:['grateful','gratitude','thanks','thank'],read:['read','reading','book','books','page','pages','chapter'],book:['book','read','reading','pages'],
 bedtime:['bedtime','tucked','story','stories','goodnight'],story:['story','stories','bedtime','book'],kids:['kids','kid','children','son','daughter','little'],play:['play','played','floor','game','games'],
 date:['date','dinner','night'],wife:['wife','her','she'],flowers:['flowers','roses'],note:['note','letter'],
 phone:['phone','screen','scrolling','scroll'],screen:['screen','phone','scrolling'],water:['water','hydrate','drink'],sleep:['sleep','slept','bed','rest'],wake:['wake','woke','early','alarm','morning','up'],
 budget:['budget','money','spend','spent','savings','ledger'],email:['email','inbox'],work:['work','deep','focus','task','tasks'],
 clean:['clean','cleaned','tidy','mess'],trash:['trash','garbage','bins'],laundry:['laundry','clothes','folded'],mow:['mow','mowed','lawn','grass'],
 teeth:['teeth','brush','brushed'],meditate:['meditate','breathe','quiet','still'],journal:['journal','wrote','write','writing'],practice:['practice','practiced'],
 supplements:['supplements','vitamins','pills'],sunlight:['sun','sunlight','outside'],outside:['outside','sun','fresh']};
const words=s=>String(s).toLowerCase().replace(/[^a-z\- ]/g,' ').split(/\s+/).filter(w=>w.length>2);
const stem=w=>w.replace(/(ing|ed|es|s)$/,'');
/** Habit words too generic to match on ("Brush My Teeth - Morning" shouldn't match a line about sweeping every morning). */
const GENERIC=new Set(['morning','night','evening','day','daily','week','weekly','today','the','and','with','for','before','after','min','mins','minute','minutes','time','refill','take','get','make','do']);
/** How well a written cheer matches a habit title: shared words (after word families) in what's said aloud (narration
 *  doesn't count, so "she brushes soil from her hands" isn't about teeth). 0 when nothing fits. */
export function cheerScore(title,m){const said=[...(m.open||[]),...(m.opts||[]).flatMap(o=>[o.t,...o.r])].filter(l=>!l.startsWith('* '));
 // "before bed" / "to bed" mean bedtime, not making the bed.
 const text=new Set(words(said.join(' ').replace(/\b(before|to|in|for|off) bed\b/gi,' ')).map(stem));let n=0;
 for(const w of words(title).filter(w=>!GENERIC.has(w))){const fam=SYNONYMS[w]||SYNONYMS[stem(w)]||[w];if(fam.some(x=>text.has(stem(x))))n++}return n}

/** A small seeded random so the same moment always picks the same cheer (and tests are stable). */
const rand=seed=>{let x=Math.imul(seed^0x9e3779b9,0x85ebca6b)>>>0;return ()=>{x^=x<<13;x^=x>>>17;x^=x<<5;return (x>>>0)/4294967296}};
const dailiesLeft=(state,now)=>(state.habits?.items||[]).filter(x=>x.freq==='daily'&&habitDue(x,now)&&!x.done).length;

/** Decide whether this habit completion earns a cheer. `rows` are the completion rows the action just added.
 *  Returns {who, kind:'cheer'|'codex'|'done', i, cardId?} or null. */
export function pickCheer(before,after,rows,now){
 const row=rows.at(-1);if(!row||!AREA_IDS.includes(row.domain))return null;const area=row.domain,day=habitDay(now);
 const allDone=dailiesLeft(before,now)>0&&dailiesLeft(after,now)===0;
 const todayInArea=(after.habits?.history||[]).filter(x=>x.kind==='complete'&&x.domain===area&&x.day===day).length;
 if(!allDone&&todayInArea!==rows.filter(x=>x.domain===area).length)return null;
 const cast=[...fellowsInArea(area),...familyInArea(area)].filter(c=>CHEERS[c.id]);if(!cast.length)return null;
 const joined=cast.filter(c=>after.fellows?.[c.id]||after.family?.[c.id]),pool=joined.length?joined:cast;
 const r=rand(Math.floor(now/1000)),who=pool[Math.floor(r()*pool.length)].id;
 if(allDone)return {who,kind:'done',i:0};
 // Best-matching cheer from anyone in the pool; if nothing mentions what you did, one of your Codex notes instead.
 let best=null;for(const p of pool)CHEERS[p.id].cheers.forEach((m,i)=>{const s=cheerScore(row.title||'',m)+r()*0.5;if(s>=1&&(!best||s>best.s))best={s,who:p.id,i}});
 if(best)return {who:best.who,kind:'cheer',i:best.i};
 const cards=CODEX_CARDS.filter(k=>TOPIC_AREA[k.topic]===area);
 if(cards.length)return {who,kind:'codex',i:0,cardId:cards[Math.floor(r()*cards.length)].id};
 return {who,kind:'cheer',i:Math.floor(r()*CHEERS[who].cheers.length)};
}

/** The written moment for a cheer, ready for the dialogue screen. */
export function cheerMoment(c){const v=CHEERS[c.who];if(!v)return null;
 if(c.kind==='done')return v.done;
 if(c.kind==='codex'){const k=CODEX_CARDS.find(x=>x.id===c.cardId);if(!k)return v.cheers[0];
  return {open:[v.codex,`* From your Codex: “${k.front}.” ${k.back}${k.source?` (${k.source})`:''}`],
   opts:[{t:'I am committed!',r:[v.ack]},{t:'Good reminder.',r:[v.ack]}]}}
 return v.cheers[c.i]||v.cheers[0]}
