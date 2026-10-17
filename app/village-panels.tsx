import {Button} from '@/components/ui/button';
import {Dialog,DialogContent,DialogTitle,DialogDescription} from '@/components/ui/dialog';
import {PrimaryAction,abbrev} from './original-controls';
import {MiniArt} from './character-artwork';
import {useState} from 'react';
import {AREAS,BUILDINGS,FELLOWS,FAMILY,areaById,fellowForArea,familyForArea,characterById} from '@/lib/cast.mjs';
import {buildingRate,buildingUpgradeCost,BUILDING_OPEN_COST,areaBoost,blessings,momentum,rosterPower,stagePower,stageReward,currentBlight,blightReward,ROAM_CAP,fellowReady,familyReady,fellowCanImprove,playerLevelProgress} from '@/lib/game.mjs';
import {habitDue,habitEarnings} from '@/lib/habits.mjs';
const n=(x:number)=>Math.round(x).toLocaleString('en-US');
const pct=(x:number)=>Math.round(x*100)+'%';

/** A building's sheet: what it earns and why, and the one action that improves it. */
export function BuildingPanel({game,id,action,locked,onCharacter}:any){
 const b=BUILDINGS.find(x=>x.id===id)!,area=areaById(b.area),lvl=game.buildings[id].level,fellow=fellowForArea(b.area),family=familyForArea(b.area);
 const cost=lvl?buildingUpgradeCost(lvl):BUILDING_OPEN_COST,boost=areaBoost(game,b.area,game.lastAt),bless=blessings(game).building[b.area]||0;
 return <section className="business-list es-building" style={{['--area' as any]:area.color}}>
  <article className="business-card"><div className="identity"><h2>{b.name}</h2><span className="level">{lvl?'Lv. '+lvl:'Not built'}</span></div>
   <p>{b.description}</p>
   {lvl>0&&<div className="worker"><span>Earning</span><strong>+{abbrev(buildingRate(game,id)*momentum(game,game.lastAt)*60)} gold/min</strong></div>}
   <ul className="es-modifiers">
    <li><span>Today’s {area.name} habits</span><b>+{pct(boost)}</b></li>
    <li><span>{fellow.name} working here</span><b>{game.fellows[fellow.id]?'+25%':'not recruited'}</b></li>
    <li><span>{family.name}’s blessing</span><b>{game.family[family.id]?'+'+pct(bless):'not yet family'}</b></li>
    <li><span>Momentum (all habits)</span><b>×{momentum(game,game.lastAt).toFixed(2)}</b></li>
   </ul>
   <div className="business-actions"><PrimaryAction verb={lvl?'Upgrade':'Build'} tier={!lvl} disabled={locked} currency="Gold" have={game.gold} cost={cost} onClick={()=>action('buildingUpgrade',id)}/></div>
   <div className="es-residents">{[fellow,family].map((p:any)=><Button key={p.id} variant="outline" onClick={()=>onCharacter(p)}><MiniArt person={p}/>{p.name}<small>{(p.kind==='fellow'?game.fellows:game.family)[p.id]?'Visit':'Not joined'}</small></Button>)}</div>
  </article></section>;
}

/** The Watchtower: the stage ladder (a Power check) and this week's Blight. */
export function StagePanel({game,action,locked}:any){
 const next=game.stage.cleared+1,need=stagePower(next),power=rosterPower(game),reward=stageReward(next),b=currentBlight(game,game.lastAt),bg=['Bg_Field_01_Mid','Bg_City_01_Mid','Bg_Level_03_Mid','Bg_Village_01_Mid'][Math.floor((next-1)/10)%4];
 return <section className="es-stage">
  <div className="es-stage-scene" style={{backgroundImage:`url(./assets/ui-scenes/${bg}.jpg)`}}>
   <div className="es-stage-card"><small>STAGE {next}</small><h2>{next%10===0?'Boss gate':'The road beyond Everstead'}</h2>
    <div className="es-versus"><div><span>Your Power</span><strong>{n(power)}</strong></div><em>vs</em><div><span>Needed</span><strong className={power>=need?'enough':'short'}>{n(need)}</strong></div></div>
    <Button className="primary-action primary-tier" disabled={locked||power<need} onClick={()=>action('challenge')}><b>{power>=need?'Challenge':'Not strong enough yet'}</b><small>+{n(reward.gold)} gold{reward.crystals?` · +${reward.crystals} crystals`:''}</small></Button>
    <p className="small-note">Raise Power by levelling Fellows, earning their stars and deepening Family bonds.</p>
   </div>
  </div>
  <article className={'es-blight'+(b.defeated?' es-defeated':'')}>
   <header><small>THIS WEEK’S BLIGHT · TIER {b.tier+1}</small><h3>{b.name}: {b.title}</h3></header>
   <p>{b.description}</p>
   <div className="es-hp" aria-label={`${b.damage} of ${b.hp} pushed back`}><i style={{width:Math.min(100,b.damage/b.hp*100)+'%'}}/><span>{b.damage} / {b.hp}</span></div>
   <p className="small-note">Every habit pushes it back by its points. {b.opposed.map((a:string)=>areaById(a).name).join(' and ')} habits push twice as hard.</p>
   {b.defeated&&!b.claimed&&<Button className="primary-action primary-tier" disabled={locked} onClick={()=>action('blightClaim')}><b>Drive it out</b><small>+{blightReward(b.tier).crystals} crystals · +{blightReward(b.tier).sigils} sigils</small></Button>}
   {b.claimed&&<p className="next-goal">Driven out! It will return stronger in a few weeks.</p>}
  </article>
 </section>;
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

/** The Village Gate: spend roams earned from daily habits to meet people. */
export function RoamingPanel({game,action,locked}:any){
 const c=game.roam.charges;
 return <section className="es-roam">
  <div className="es-stage-scene" style={{backgroundImage:'url(./assets/ui-scenes/Bg_Village_01_Mid.jpg)'}}>
   <div className="es-stage-card"><small>VILLAGE GATE</small><h2>Go roaming</h2>
    <p>Walk the village and the roads around it. You might meet a Fellow, spend time with Family, or stumble on something good.</p>
    <div className="es-charges" aria-label={`${c} of ${ROAM_CAP} roams`}>{Array.from({length:ROAM_CAP},(_,i)=><i key={i} className={i<c?'on':''}/>)}</div>
    <Button className="primary-action" disabled={locked||c<1} onClick={()=>action('roam')}><b>{c?'Roam':'No roams left'}</b><small>{c} / {ROAM_CAP}</small></Button>
    <p className="small-note">Each daily habit you complete earns one roam. Unused roams never expire.</p>
   </div></div>
 </section>;
}

/** Today: everything worth doing right now, each with a way to get there. */
export function TodayPanel({game,onNavigate}:any){
 const h=game.habits,now=game.lastAt,due=(h?.items||[]).filter((x:any)=>x.freq==='daily'&&habitDue(x,now)),done=due.filter((x:any)=>x.done).length,earn=habitEarnings(h,now),b=currentBlight(game,now),p=playerLevelProgress(game.xp);
 const ready=[...FELLOWS.filter(f=>fellowReady(game,f)),...FAMILY.filter(f=>familyReady(game,f))],improve=FELLOWS.filter(f=>fellowCanImprove(game,f.id));
 const rows:[string,string,string][]=[
  [`Daily habits: ${done} / ${due.length}`,done<due.length?'Each one earns gold, XP, sigils and a roam.':'All done today. Well kept.','habits'],
  [`Momentum ×${earn.multiplier.toFixed(2)}`,`${earn.areas} of 6 life areas touched this week · ${earn.dailies} dailies today`,'habits'],
  [`Level ${p.level}`,`${n(p.into)} / ${n(p.need)} XP to level ${p.level+1}`,'hero'],
  [`${b.name}: ${b.damage} / ${b.hp}`,b.defeated?(b.claimed?'Driven out this week.':'Ready to drive out!'):`${b.opposed.map((a:string)=>areaById(a).name).join(' and ')} habits hit hardest.`,'stage'],
  [`Roams: ${game.roam.charges}`,game.roam.charges?'Someone might be waiting at the gate.':'Complete dailies to earn roams.','roaming'],
  ...ready.map((f:any)=>[`${f.name} is ready to join`,`${areaById(f.area).name} · ${f.kind==='fellow'?'Fellow':'Family'}`,f.kind==='fellow'?'fellows':'family'] as [string,string,string]),
  ...(improve.length?[[`${improve.length} Fellow${improve.length>1?'s':''} can improve`,improve.map((f:any)=>f.name).join(', '),'fellows'] as [string,string,string]]:[]),
 ];
 return <section className="es-today"><ul>{rows.map(([t,d,go],i)=><li key={i}><div><strong>{t}</strong><p>{d}</p></div><Button variant="outline" onClick={()=>onNavigate(go)}>Go</Button></li>)}</ul>
  <div className="es-area-row">{AREAS.map(a=><span key={a.id} style={{borderColor:a.color}}>{a.name}<b>{game.sigils[a.id]}</b></span>)}</div><p className="small-note">Sigils by life area. They earn your Fellows’ stars.</p></section>;
}
