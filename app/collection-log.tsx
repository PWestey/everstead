import {useState} from 'react';
import {FELLOWS,FAMILY,AREAS} from '@/lib/cast.mjs';
import {COMPANIONS,companionName} from '@/lib/companions.mjs';
import {REGIONS} from '@/lib/expedition-data.mjs';
import {CODEX_CARDS} from '@/lib/codex.mjs';
import {QUESTS,questIds,questStatus} from '@/lib/quests.mjs';
import {CHAPTERS,chapterDone} from '@/lib/story.mjs';
import {skillLevel,MAX_LEVEL} from '@/lib/skills.mjs';

type Row={name:string,done:boolean,note?:string};
type Section={title:string,rows:Row[]};

/** The Collection Log: everything there is to meet, beat, master and finish, with OSRS green/red counts. */
export function CollectionLog({game}:{game:any}){
 const sections:Section[]=[
  {title:'Fellows',rows:FELLOWS.map((f:any)=>({name:f.name,done:!!game.fellows[f.id],note:game.fellows[f.id]?`Lv ${game.fellows[f.id].level}${game.fellows[f.id].stars?' · '+'★'.repeat(game.fellows[f.id].stars):''}`:undefined}))},
  {title:'Family',rows:FAMILY.map((f:any)=>({name:f.name,done:!!game.family[f.id]}))},
  {title:'Companions',rows:COMPANIONS.map(c=>{const o=game.companions?.[c.id];return {name:o?companionName(c,o.stage):c.stages[0].name,done:!!o,note:o&&o.stage===c.stages.length&&c.stages.length>1?'final form':undefined}})},
  {title:'Bosses',rows:REGIONS.map(r=>({name:r.boss.title,done:game.expeditions.bosses.includes(r.boss.id),note:r.name}))},
  {title:'Skills at 99',rows:AREAS.map(a=>({name:a.name,done:skillLevel(game,a.id)>=MAX_LEVEL,note:`Lv ${skillLevel(game,a.id)}`}))},
  {title:'Quests',rows:questIds.map((id:string)=>({name:QUESTS[id].name,done:questStatus(game,id).status==='complete'}))},
  {title:'Story',rows:CHAPTERS.map(c=>({name:c.n<9?`Chapter ${c.n}: ${c.title}`:c.title,done:chapterDone(game,c.n)}))},
  {title:'Archives mastered',rows:CODEX_CARDS.map((k:any)=>({name:k.front,done:!!game.codex?.cards?.[k.id]?.mastered,note:k.topic}))},
 ];
 const total=sections.reduce((n,s)=>n+s.rows.length,0),done=sections.reduce((n,s)=>n+s.rows.filter(r=>r.done).length,0);
 const [open,setOpen]=useState<string|null>(sections[0].title);
 return <div className="rs-clog">
  <header><img className="rs-px" src="./assets/osrs/ui/Collection_log_icon.png" alt=""/><b>Collection Log</b><span className={done===total?'rs-c-done':''}>{done}/{total}</span></header>
  <ul className="rs-clog-tabs">{sections.map(s=>{const d=s.rows.filter(r=>r.done).length;return <li key={s.title}><button type="button" className={open===s.title?'on':''} onClick={()=>setOpen(open===s.title?null:s.title)}>{s.title}<i className={d===s.rows.length?'rs-c-done':d?'rs-c-part':'rs-c-none'}>{d}/{s.rows.length}</i></button>
   {open===s.title&&<ul className="rs-clog-rows">{s.rows.map((r,i)=><li key={i} className={r.done?'rs-c-done':'rs-c-none'}>{r.name}{r.note&&<small>{r.note}</small>}</li>)}</ul>}</li>})}</ul>
 </div>;
}
