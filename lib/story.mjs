// The main story (docs/STORY.md): eight chapters and an epilogue against Morrow, the Thief of Days.
// Each chapter is a dialogue tree 'story-N' in lib/story/*.mjs; finishing it sets the flag 'story:N'.
// A chapter opens when the previous one is done, your total level is high enough and (from Chapter 2) that
// chapter's Map boss is down. Text tokens {motive}, {habits}, {streak}, {areas50} are filled in by storyTokens().
import {totalLevel,skillLevel} from './skills.mjs';
import {AREA_IDS} from './cast.mjs';
import {habitDay} from './habits.mjs';

/** @type {{n:number,title:string,total:number,boss:string|null,bossName?:string}[]} */
export const CHAPTERS=[
 {n:1,title:'Embers',total:8,boss:null},
 {n:2,title:'The House on the Hill',total:60,boss:'count-draynor',bossName:'Count Draynor'},
 {n:3,title:'Something Under Falador',total:150,boss:'giant-mole',bossName:'the Giant Mole'},
 {n:4,title:'Six Brothers',total:220,boss:'barrows',bossName:'the Barrows Brothers'},
 {n:5,title:'Sixty-Two Waves',total:280,boss:'tztok-jad',bossName:'TzTok-Jad'},
 {n:6,title:'The Hive of Tomorrows',total:360,boss:'kalphite-queen',bossName:'the Kalphite Queen'},
 {n:7,title:'The Offer',total:440,boss:'dagannoth-kings',bossName:'the Dagannoth Kings'},
 {n:8,title:'The Thief of Days',total:490,boss:'king-black-dragon',bossName:'the King Black Dragon'},
 {n:9,title:'Epilogue: A Visitor',total:540,boss:null},
];
export const chapterDone=(state,n)=>!!state.flags?.['story:'+n];
/** Why a chapter can't be played yet, or null when it can. */
export function chapterLock(state,c){if(c.n>1&&!chapterDone(state,c.n-1))return `Finish Chapter ${c.n-1} first.`;
 if(c.boss&&!state.expeditions?.bosses?.includes(c.boss))return `Defeat ${c.bossName} on the Map.`;
 const tl=totalLevel(state);if(tl<c.total)return `Reach total level ${c.total} (you’re ${tl}).`;return null}
/** The chapter to show next: {chapter, lock} — lock null means it's ready to play. Null when the story is done. */
export function nextChapter(state){const c=CHAPTERS.find(x=>!chapterDone(state,x.n));return c?{chapter:c,lock:chapterLock(state,c)}:null}

const MOTIVE={'motive:order':'to get my life in order','motive:start':'I keep saying I’ll start','motive:fire':'somebody has to keep this fire going'};
const HEARTH={'hearth:today':'I’ll do it today.','hearth:same':'Same as today.'};
const dayBefore=d=>{const t=new Date(d+'T12:00:00');t.setDate(t.getDate()-1);const p=x=>String(x).padStart(2,'0');return t.getFullYear()+'-'+p(t.getMonth()+1)+'-'+p(t.getDate())};
/** Days in a row with a completed habit, counting back from today (or yesterday, if today isn't done yet). */
export function currentStreak(state,now=state.lastAt){const days=new Set((state.habits?.history||[]).filter(x=>x.kind==='complete').map(x=>x.day));let d=habitDay(now);if(!days.has(d))d=dayBefore(d);let n=0;while(days.has(d)){n++;d=dayBefore(d)}return n}
/** Longest run of consecutive days with at least one completed habit. */
export function longestStreak(state){const days=[...new Set((state.habits?.history||[]).filter(x=>x.kind==='complete').map(x=>x.day))].sort();let best=0,run=0,prev=null;
 for(const d of days){const t=new Date(d+'T12:00:00').getTime();run=prev!==null&&Math.round((t-prev)/864e5)===1?run+1:1;best=Math.max(best,run);prev=t}return best}
/** Values for the story's text tokens. */
export function storyTokens(state){const motive=Object.entries(MOTIVE).find(([k])=>state.flags?.[k])?.[1]||'to keep going';
 return {motive,habits:String((state.habits?.history||[]).filter(x=>x.kind==='complete').length),streak:String(longestStreak(state)),areas50:String(AREA_IDS.filter(a=>skillLevel(state,a)>=50).length)}}
/** The line the Hearth shows after Chapter 8 (or null). */
export function hearthLine(state){if(!chapterDone(state,8))return null;const k=Object.keys(HEARTH).find(x=>state.flags?.[x]);
 if(k)return HEARTH[k];if(state.flags?.['hearth:motive'])return `What I told Maggie: ${storyTokens(state).motive}.`;return null}
export const fillTokens=(text,state)=>{const t=storyTokens(state);return String(text).replace(/\{(motive|habits|streak|areas50)\}/g,(_,k)=>t[k])};
