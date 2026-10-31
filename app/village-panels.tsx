import {Button} from '@/components/ui/button';
import {Dialog,DialogContent,DialogTitle,DialogDescription} from '@/components/ui/dialog';
import {PrimaryAction,QuantityPicker,abbrev,type Quantity} from './original-controls';
import {MiniArt} from './character-artwork';
import {useState} from 'react';
import {AREAS,BUILDINGS,FELLOWS,FAMILY,areaById,fellowsInArea,familyInArea,characterById} from '@/lib/cast.mjs';
import {buildingStaff,staffSlots,staffBonus,fellowPower,POWER_INCOME,buildingLevelMult,buildingRate,buildingUpgradeCost,BUILDING_OPEN_COST,areaBoost,blessings,momentum,rosterPower,stagePower,stageReward,currentBlight,blightReward,ROAM_CAP,fellowReady,familyReady,fellowCanImprove,playerStage} from '@/lib/game.mjs';
import {totalLevel} from '@/lib/skills.mjs';
import {PLAYER_STAGES} from '@/lib/cast.mjs';
import {QUESTS,questIds,questStatus,pendingTalk} from '@/lib/quests.mjs';
import {AdventureCards} from './rs-ui';
import {habitDue,habitEarnings,habitDay} from '@/lib/habits.mjs';
import {codexQueue} from '@/lib/codex.mjs';
import {nextChapter,currentStreak,longestStreak} from '@/lib/story.mjs';
import {CODEX_NEW_PER_DAY} from '@/lib/game.mjs';
const n=(x:number)=>Math.round(x).toLocaleString('en-US');
const pct=(x:number)=>Math.round(x*100)+'%';

/** A building's sheet: what it earns and why, and the one action that improves it. */
/** Choose who works in a building: recruited Fellows of its area, up to its slots. Untouched, it picks the strongest. */
function StaffPicker({game,id,area,action,locked}:any){const slots=staffSlots(game.buildings[id].level),cur=buildingStaff(game,id),manual=Array.isArray(game.buildings[id].staff);
 const pool=fellowsInArea(area).filter((f:any)=>game.fellows[f.id]);if(!pool.length)return <p className="small-note">Recruit {areaById(area).name} Fellows to staff this building.</p>;
 const toggle=(fid:string)=>{const on=cur.includes(fid);const next=on?cur.filter((x:string)=>x!==fid):[...cur,fid];if(next.length<=slots)action('staffSet',id,next)};
 return <div className="es-staff"><p className="es-residents-title">Staff · {cur.length}/{slots} slots{manual?<button type="button" className="es-auto" disabled={locked} onClick={()=>action('staffSet',id,null)}>Auto</button>:<small> (auto: strongest)</small>}</p>
  <div className="es-residents">{pool.map((f:any)=>{const on=cur.includes(f.id);return <Button key={f.id} variant="outline" className={on?'es-on':''} disabled={locked||(!on&&cur.length>=slots)} onClick={()=>toggle(f.id)}><MiniArt person={f}/>{f.name}<small>{on?'Working · +'+pct(staffBonus(fellowPower(game,f.id))):'Off'}</small></Button>})}</div>
  <p className="small-note">Each worker adds +25% plus 1% per 400 Power. More slots at building levels 4, 7 and 10.</p></div>}

/** How many levels a building can gain for the gold in hand, and what they cost. */
function upgradePlan(level:number,gold:number,times:Quantity){const limit=times==='max'?10000:times;let l=level,g=gold,cost=0,count=0;while(count<limit){const c=l?buildingUpgradeCost(l):BUILDING_OPEN_COST;if(g<c)break;g-=c;cost+=c;l++;count++}return {count,cost}}
export function BuildingPanel({game,id,action,locked,onCharacter,onTalk}:any){const [q,setQ]=useState<Quantity>(1);
 const b=BUILDINGS.find(x=>x.id===id)!,area=areaById(b.area),lvl=game.buildings[id].level,fellows=fellowsInArea(b.area),family=familyInArea(b.area);
 const cost=lvl?buildingUpgradeCost(lvl):BUILDING_OPEN_COST,boost=areaBoost(game,b.area,game.lastAt),bless=blessings(game).building[b.area]||0;
 return <section className="business-list es-building" style={{['--area' as any]:area.color}}>
  <article className="business-card"><div className="identity"><h2>{b.name}</h2><span className="level">{lvl?'Lv. '+lvl:'Not built'}</span></div>
   <p>{b.description}</p>
   {lvl>0&&<div className="worker"><span>Earning</span><strong>+{abbrev(buildingRate(game,id)*momentum(game,game.lastAt)*60)} gold/min</strong></div>}
   <ul className="es-modifiers">
    <li><span>Today’s {area.name} habits</span><b>+{pct(boost)}</b></li>
    <li><span>Staff ({buildingStaff(game,id).length}/{staffSlots(lvl)})</span><b>+{pct(buildingStaff(game,id).reduce((n:number,f:string)=>n+staffBonus(fellowPower(game,f)),0))}</b></li>
    {lvl>0&&<li><span>Village Power ({abbrev(rosterPower(game))})</span><b>+{abbrev(rosterPower(game)*POWER_INCOME*3600)}/h base</b></li>}
    {lvl>0&&<li><span>Building level {lvl}</span><b>×{buildingLevelMult(lvl).toFixed(2)}</b></li>}
    <li><span>Family blessings</span><b>+{pct(bless)}</b></li>
    <li><span>Momentum (all habits)</span><b>×{momentum(game,game.lastAt).toFixed(2)}</b></li>
   </ul>
   {lvl>0&&<StaffPicker game={game} id={id} area={b.area} action={action} locked={locked}/>}
   {(()=>{const p=upgradePlan(lvl,game.gold,q);return <div className="business-actions es-upgrade"><QuantityPicker value={q} onChange={setQ} label="Upgrade quantity"/><PrimaryAction verb={lvl?(p.count>1?`Upgrade ×${p.count}`:'Upgrade'):'Build'} tier={!lvl} disabled={locked||!p.count} currency="Gold" have={game.gold} cost={p.count?p.cost:cost} onClick={()=>action('buildingUpgrade',id,q)}/></div>})()}
   {[...fellows,...family].map((p:any)=>{const t=pendingTalk(game,p.id);return t&&((p.kind==='fellow'?game.fellows:game.family)[p.id])?<Button key={'talk-'+p.id} className="primary-action primary-tier rs-talk" onClick={()=>onTalk(t.tree)}><b>Talk to {p.name}</b><small>Quest: {QUESTS[t.quest].name}</small></Button>:null})}
   <AdventureCards game={game} location={id} onStart={onTalk}/>
   <div className="es-residents-wrap"><p className="es-residents-title">Residents</p><div className="es-residents">{[...fellows,...family].map((p:any)=><Button key={p.id} variant="outline" onClick={()=>onCharacter(p)}><MiniArt person={p}/>{p.name}<small>{(p.kind==='fellow'?game.fellows:game.family)[p.id]?'Visit':'Not joined'}</small></Button>)}</div></div>
  </article>
  </section>;
}

/** This week's Blight: habits push it back; once it's down you drive it out for crystals and sigils. */
export function BlightCard({game,action,locked}:any){
 const b=currentBlight(game,game.lastAt);
 return <>
  <article className={'es-blight'+(b.defeated?' es-defeated':'')}>
   <header><small>THIS WEEK’S BLIGHT · TIER {b.tier+1}</small><h3>{b.name}: {b.title}</h3></header>
   <p>{b.description}</p>
   <div className="es-hp" aria-label={`${b.damage} of ${b.hp} pushed back`}><i style={{width:Math.min(100,b.damage/b.hp*100)+'%'}}/><span>{b.damage} / {b.hp}</span></div>
   <p className="small-note">Every habit pushes it back by its points. {b.opposed.map((a:string)=>areaById(a).name).join(' and ')} habits push twice as hard.</p>
   {b.defeated&&!b.claimed&&<Button className="primary-action primary-tier" disabled={locked} onClick={()=>action('blightClaim')}><b>Drive it out</b><small>+{blightReward(b.tier).crystals} crystals · +{blightReward(b.tier).sigils} sigils</small></Button>}
   {b.claimed&&<p className="next-goal">Driven out! It will return stronger in a few weeks.</p>}
  </article>
 </>;
}

/** A written scene: narration and character lines, one after another. */
export function StoryDialog({scene,playerName,onClose}:any){
 return <Dialog open={!!scene} onOpenChange={o=>{if(!o)onClose()}}><DialogContent className="save-dialog es-story"><DialogTitle>{scene?.title}</DialogTitle><DialogDescription className="sr-only">A short scene.</DialogDescription>
  <div className="es-story-lines">{(scene?.lines||[]).map((line:any,i:number)=>{if(typeof line==='string')return <p key={i} className="es-narration">{line.replaceAll('{name}',playerName)}</p>;const who=characterById(line[0]);
   return <div key={i} className="es-line"><MiniArt person={who}/><div><b>{who?.name}</b><p>{line[1].replaceAll('{name}',playerName)}</p></div></div>})}</div>
  {scene?.summary&&<p className="next-goal">{scene.summary}</p>}
  <Button onClick={onClose}>Continue</Button>
 </DialogContent></Dialog>;
}

/** The Village Gate: one free walk a day to bump into a Fellow, Family or the village. */
export function RoamingPanel({game,action,locked}:any){
 const done=game.roam.gateDay===habitDay(Date.now());
 return <section className="es-roam">
  <div className="es-stage-scene" style={{backgroundImage:'url(./assets/ui-scenes/Bg_Village_01_Mid.jpg)'}}>
   <div className="es-stage-card"><small>VILLAGE GATE</small><h2>Take a walk</h2>
    <p>Once a day, walk the village and the roads around it. You might meet a Fellow, spend time with Family, or stumble on something good.</p>
    <Button className="primary-action" disabled={locked||done} onClick={()=>action('roam')}><b>{done?'Walked today':'Take today’s walk'}</b><small>{done?'Back tomorrow':'Free'}</small></Button>
    <p className="small-note">Roams from your daily habits are spent on the Expedition Map.</p>
   </div></div>
 </section>;
}

/** Today: everything worth doing right now, each with a way to get there. */
/** The Hearth: your streak as logs on the fire. One log per day, the fire lit while the streak lives. */
function Hearth({streak,best}:{streak:number,best:number}){const logs=Math.min(streak,14);
 return <div className="es-hearth"><div className="es-hearth-fire">{streak>0?<img src="./assets/osrs/ui/Fire.png" alt="A lit fire"/>:<img src="./assets/osrs/ui/Logs.png" alt="Unlit logs" className="es-cold rs-px"/>}</div>
  <div><strong>The Hearth · {streak} day{streak===1?'':'s'}</strong><p>{streak>0?'Keep a habit every day and the fire stays lit. Longest: '+best+'.':'Complete any habit today to light the fire.'}</p>
   <div className="es-logs" aria-hidden="true">{Array.from({length:logs},(_,i)=><img key={i} className="rs-px" src="./assets/osrs/ui/Logs.png" alt=""/>)}{streak>14&&<small>+{streak-14}</small>}</div></div></div>}

export function TodayPanel({game,onNavigate}:any){
 const h=game.habits,now=game.lastAt,due=(h?.items||[]).filter((x:any)=>x.freq==='daily'&&habitDue(x,now)),done=due.filter((x:any)=>x.done).length,earn=habitEarnings(h,now),b=currentBlight(game,now),tl=totalLevel(game),nextTier=PLAYER_STAGES.find(s=>s.level>tl);
 const quest=questIds.map(id=>({id,...questStatus(game,id)})).find(q=>q.status==='active'||q.status==='available');
 const ready=[...FELLOWS.filter(f=>fellowReady(game,f)),...FAMILY.filter(f=>familyReady(game,f))],improve=FELLOWS.filter(f=>fellowCanImprove(game,f.id));
 const rows:[string,string,string][]=[
  [`Daily habits: ${done} / ${due.length}`,done<due.length?'Each one earns gold, XP, sigils and a roam.':'All done today. Well kept.','habits'],
  ...(()=>{const q=codexQueue(game,habitDay(Date.now()),CODEX_NEW_PER_DAY).queue.length;return [[`Codex: ${q} card${q===1?'':'s'} to review`,q?'Each review pays gold and trains its area.':'All caught up in the Archives.','codex'] as [string,string,string]]})(),
  [`Momentum ×${earn.multiplier.toFixed(2)}`,`${earn.areas} of 8 life areas touched this week · ${earn.dailies} dailies today`,'habits'],
  [`Total level ${tl}`,nextTier?`${nextTier.title} armour at total level ${nextTier.level}`:'Every armour tier unlocked','hero'],
  ...(()=>{const nx=nextChapter(game);return nx?[[`Story: Chapter ${nx.chapter.n<9?nx.chapter.n+' · ':''}${nx.chapter.title}`,nx.lock||'Ready to play in the Quest Journal.','quests'] as [string,string,string]]:[]})(),
  ...(quest?[[`Quest: ${QUESTS[quest.id].name}`,quest.step?.text||'',`quests`] as [string,string,string]]:[]),
  [`${b.name}: ${b.damage} / ${b.hp}`,b.defeated?(b.claimed?'Driven out this week.':'Ready to drive out!'):`${b.opposed.map((a:string)=>areaById(a).name).join(' and ')} habits hit hardest.`,'stage'],
  [`Roams: ${game.roam.charges}`,game.roam.charges?'Spend them on the Expedition Map.':'Complete dailies to earn roams.','stage'],
  ...ready.map((f:any)=>[`${f.name} is ready to join`,`${areaById(f.area).name} · ${f.kind==='fellow'?'Fellow':'Family'}`,f.kind==='fellow'?'fellows':'family'] as [string,string,string]),
  ...(improve.length?[[`${improve.length} Fellow${improve.length>1?'s':''} can improve`,improve.map((f:any)=>f.name).join(', '),'fellows'] as [string,string,string]]:[]),
 ];
 const streak=currentStreak(game,now),best=longestStreak(game);
 return <section className="es-today"><Hearth streak={streak} best={best}/><ul>{rows.map(([t,d,go],i)=><li key={i}><div><strong>{t}</strong><p>{d}</p></div><Button variant="outline" onClick={()=>onNavigate(go)}>Go</Button></li>)}</ul>
  <div className="es-area-row">{AREAS.map(a=><span key={a.id} style={{borderColor:a.color}}>{a.name}<b>{game.sigils[a.id]}</b></span>)}</div><p className="small-note">Sigils by life area. They earn your Fellows’ stars.</p></section>;
}
