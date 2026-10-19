import {useState} from 'react';
import {Button} from '@/components/ui/button';
import {Dialog,DialogContent,DialogTitle,DialogDescription} from '@/components/ui/dialog';
import {REGIONS} from '@/lib/expedition-data.mjs';
import {expeditionView,regionOpen,rosterPower,roamCap,perks} from '@/lib/game.mjs';
import {areaById} from '@/lib/cast.mjs';
import {skillIcon} from '@/lib/skills.mjs';
import {BlightCard} from './village-panels';

const n=(x:number)=>Math.round(x).toLocaleString('en-US');
const areaNames=(areas:string[])=>areas.map(a=>areaById(a)?.name).join(' & ');

/** The Expedition map: regions open one after another, each with four adventures and a boss.
 *  Every run costs one Roam; your Power against the place's need sets the outcome and the loot. */
export function MapPanel({game,action,locked,onRun}:{game:any,action:any,locked:boolean,onRun:(id:string)=>void}){
 const opened=REGIONS.filter((_,i)=>regionOpen(game,i)).length;
 const [sel,setSel]=useState(Math.max(0,opened-1));
 const region=REGIONS[sel],open=regionOpen(game,sel),power=rosterPower(game),p=perks(game);
 const places=[...region.adventures.map(a=>expeditionView(game,a.id)),expeditionView(game,region.boss.id)];
 return <section className="xp-map">
  <header className="xp-top">
   <span><img src="./assets/ui-original/Icons--Icon_EmblemStrength_1.png" alt=""/><b>{n(power)}</b> Power</span>
   <span><img src="./assets/ui/journey.webp" alt=""/><b>{game.roam.charges}</b>/{roamCap(game)} Roams</span>
  </header>
  <nav className="xp-regions" aria-label="Regions">{REGIONS.map((r,i)=><button key={r.id} type="button" className={(i===sel?'xp-on ':'')+(regionOpen(game,i)?'':'xp-locked')} onClick={()=>setSel(i)}>{regionOpen(game,i)?'':'🔒 '}{r.name}</button>)}</nav>
  <div className="xp-region" style={{backgroundImage:`url(./assets/${region.bg})`}}>
   <div className="xp-region-text"><h2>{region.name}</h2><p>{region.blurb}</p>
    <small>Boss reward: {region.perk.text}{game.expeditions.bosses.includes(region.boss.id)?' ✓':''}</small></div>
  </div>
  {!open&&<p className="xp-lockmsg">Defeat <b>{REGIONS[sel-1].boss.title}</b> in {REGIONS[sel-1].name} to open {region.name}.</p>}
  <ul className="xp-list">{places.map(v=><li key={v.id} className={'xp-card'+(v.boss?' xp-boss':'')+(v.open&&!v.outcome?' xp-short':'')+(!v.open?' xp-closed':'')}>
   <div className="xp-art" style={{backgroundImage:`url(./assets/${v.bg||region.bg})`}}><img src={'./assets/'+v.art} alt=""/></div>
   <div className="xp-body">
    <h3>{v.boss&&<em>BOSS · </em>}{v.title}{v.defeated&&<span className="xp-done"> ✓</span>}</h3>
    <p>{v.blurb}</p>
    <div className="xp-need"><span>Needs <b>{n(v.need)}</b></span>{v.outcome?<i className={'xp-badge xp-'+v.outcome.key}>{v.outcome.label}</i>:<i className="xp-badge xp-locked-b">{v.open?`${Math.floor(power/v.need*100)}%`:'Locked'}</i>}</div>
    <div className="xp-loot"><span>+{n(v.loot.gold)} gold</span>{v.areas.map((a:string)=><span key={a}><img src={'./assets/'+skillIcon(a)} alt=""/>+{v.loot.sigils} · {n(v.loot.xp)} XP</span>)}</div>
    <Button className="xp-go" disabled={locked||!v.outcome||game.roam.charges<1} onClick={()=>onRun(v.id)}>{!v.open?'Locked':!v.outcome?'Not strong enough':game.roam.charges<1?'No Roams':v.runs?'Go · 1 Roam':'Explore · 1 Roam'}</Button>
   </div>
  </li>)}</ul>
  <p className="small-note xp-note">Roams come from daily habits. The stronger you are than a place, the more it pays: Great at 1.5× its need, Overwhelming at 3×.{p.power?` Your boss rewards add +${Math.round(p.power*100)}% Power.`:''}</p>
  <BlightCard game={game} action={action} locked={locked}/>
 </section>;
}

/** The result of one run: outcome, loot, and any boss reward or newly opened region. */
export function ExpeditionResult({run,onClose}:{run:any,onClose:()=>void}){
 return <Dialog open={!!run} onOpenChange={o=>{if(!o)onClose()}}><DialogContent className="rs-scroll xp-result" showCloseButton={false}>
  {run&&<>
   <DialogTitle className={'xp-r-'+run.outcome.key}>{run.outcome.label}!</DialogTitle>
   <DialogDescription>{run.title}</DialogDescription>
   <ul><li>+{n(run.loot.gold)} gold</li>{run.areas.map((a:string)=><li key={a}><img src={'./assets/'+skillIcon(a)} alt=""/>+{run.loot.sigils} {areaById(a)?.name} sigils · +{n(run.loot.xp)} XP</li>)}</ul>
   {run.perk&&<p className="xp-perk"><b>Boss defeated!</b> {run.perk}</p>}
   {run.opened&&<p className="xp-perk"><b>New region:</b> {run.opened} is open on the map.</p>}
   <Button onClick={onClose}>Continue</Button>
  </>}
 </DialogContent></Dialog>;
}
