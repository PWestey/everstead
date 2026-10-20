import {useState} from 'react';
import {Button} from '@/components/ui/button';
import {CODEX_CARDS,TOPIC_AREA,cardArea,codexQueue,codexMastered} from '@/lib/codex.mjs';
import {codexReward,CODEX_PAID_PER_DAY,CODEX_NEW_PER_DAY,CODEX_XP,CODEX_MASTERY_STEP,CODEX_MASTERY_INCOME} from '@/lib/game.mjs';
import {habitDay} from '@/lib/habits.mjs';
import {areaById} from '@/lib/cast.mjs';
import {skillIcon} from '@/lib/skills.mjs';

const n=(x:number)=>Math.round(x).toLocaleString('en-US');

/** The Archives: today's Codex reviews (spaced repetition) and the whole library of cards. */
export function CodexPanel({game,action,locked}:{game:any,action:any,locked:boolean}){
 const today=habitDay(Date.now());
 const {due,fresh,queue}=codexQueue(game,today,CODEX_NEW_PER_DAY);
 const paidLeft=Math.max(0,CODEX_PAID_PER_DAY-(game.codex.paidDay===today?game.codex.paidCount:0));
 const mastered=codexMastered(game),bonus=CODEX_MASTERY_INCOME*Math.floor(mastered/CODEX_MASTERY_STEP);
 const [shown,setShown]=useState(false),[tab,setTab]=useState<'review'|'library'>('review');
 const card=queue[0],area=card?cardArea(card):null,prog=card?game.codex.cards[card.id]:null;
 const answer=(got:boolean)=>{if(action('codexReview',card.id,got))setShown(false)};
 return <section className="cx">
  <header className="cx-top">
   <span><b>{due.length}</b> due</span><span><b>{fresh.length}</b> new</span>
   <span><b>{paidLeft}</b> paid left · {n(codexReward(game))} gold each</span>
  </header>
  <nav className="cx-tabs"><button type="button" className={tab==='review'?'on':''} onClick={()=>setTab('review')}>Review</button><button type="button" className={tab==='library'?'on':''} onClick={()=>setTab('library')}>Library · {CODEX_CARDS.length}</button></nav>
  {tab==='review'&&(card?<article className="cx-card" onClick={()=>!shown&&setShown(true)}>
   <p className="cx-meta"><img src={'./assets/'+skillIcon(area!)} alt=""/>{card.topic} · {areaById(area!)?.name}<em>{prog?`Box ${prog.box}`:'New'}</em></p>
   <h3>{card.front}</h3>
   {shown?<>
    <p className="cx-back">{card.back}</p>
    {card.source&&<p className="cx-source">— {card.source}</p>}
    <div className="cx-answer">
     <Button className="cx-forgot" disabled={locked} onClick={e=>{e.stopPropagation();answer(false)}}>Forgot</Button>
     <Button className="cx-got" disabled={locked} onClick={e=>{e.stopPropagation();answer(true)}}>Got it</Button>
    </div>
    <button type="button" className="cx-practice" disabled={locked} onClick={e=>{e.stopPropagation();action('habitSave',null,{title:card.front,freq:'weekly',diff:'med',domain:area})}}>＋ Practise this as a weekly habit</button>
   </>:<p className="cx-tap">Think of the answer, then tap to reveal.</p>}
  </article>:<div className="cx-done"><h3>All caught up.</h3><p>New cards arrive tomorrow, and reviewed cards come back on schedule.</p></div>)}
  {tab==='review'&&<p className="small-note cx-note">Each review pays {n(codexReward(game))} gold (10 minutes of village income) and {CODEX_XP} XP in its area, whether you remembered it or not, for the first {CODEX_PAID_PER_DAY} a day. Mastered: <b>{mastered}</b> / {CODEX_CARDS.length}{bonus?` (+${Math.round(bonus*100)}% building gold)`:''}. Every {CODEX_MASTERY_STEP} mastered adds +{Math.round(CODEX_MASTERY_INCOME*100)}%.</p>}
  {tab==='library'&&<div className="cx-lib">{Object.keys(TOPIC_AREA).map(topic=>{const list=CODEX_CARDS.filter(k=>k.topic===topic);return <details key={topic}>
   <summary><img src={'./assets/'+skillIcon(TOPIC_AREA[topic as keyof typeof TOPIC_AREA])} alt=""/>{topic}<em>{list.filter(k=>game.codex.cards[k.id]?.mastered).length}/{list.length} mastered</em></summary>
   <ul>{list.map(k=>{const p=game.codex.cards[k.id];return <li key={k.id}><details><summary>{k.front}<i>{p?(p.mastered?'Mastered':`Box ${p.box}`):'New'}</i></summary><p>{k.back}</p>{k.source&&<small>— {k.source}</small>}</details></li>})}</ul>
  </details>})}</div>}
 </section>;
}
