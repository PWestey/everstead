import {useState} from 'react';
import {Button} from '@/components/ui/button';
import {COMPANIONS,companionArt,companionName,companionLevel,companionLevelCost,companionLevelFloor,companionBoost,canEvolve,areaCompanionBoost,COMPANION_CAP,EVOLVE_AT,HABIT_EXP,TREAT_EXP,COMPANION_MILESTONES} from '@/lib/companions.mjs';
import {AREAS,areaById} from '@/lib/cast.mjs';
import {skillIcon} from '@/lib/skills.mjs';

const pct=(x:number)=>(x*100).toFixed(1).replace(/\.0$/,'')+'%';

/** Companions: four creatures per life area. They grow from that area's habits and from treats, evolve, and boost
 *  every Fellow of their area. Unmet ones show as silhouettes with where to find them. */
export function CompanionsPanel({game,action,locked}:{game:any,action:any,locked:boolean}){
 const [area,setArea]=useState(AREAS[0].id);
 const owned=Object.keys(game.companions||{}).length;
 return <section className="cp-panel">
  <header className="cp-top"><span><img className="rs-px" src="./assets/osrs/ui/Fish_food.png" alt="" style={{width:18,height:18,verticalAlign:'-3px'}}/> <b>{game.treats||0}</b> treats</span><span><b>{owned}</b>/{COMPANIONS.length} met</span></header>
  <nav className="cp-areas" aria-label="Life areas">{AREAS.map(a=><button key={a.id} type="button" className={a.id===area?'cp-on':''} onClick={()=>setArea(a.id)}><img src={'./assets/'+skillIcon(a.id)} alt=""/>{a.name}</button>)}</nav>
  <p className="cp-boost">{areaById(area).name} Fellows get <b>+{pct(areaCompanionBoost(game,area))}</b> Power from companions.</p>
  <ul className="cp-list">{COMPANIONS.filter(c=>c.area===area).map(c=>{const o=game.companions?.[c.id];
   if(!o)return <li key={c.id} className="cp-card cp-unmet"><div className="cp-art"><img src={'./assets/'+companionArt(c,1)} alt=""/></div><div className="cp-body"><h3>???</h3><p>{c.source} · Found on the Expedition Map and in the Gauntlet.</p></div></li>;
   const L=companionLevel(o.exp),floor=companionLevelFloor(L),need=L<COMPANION_CAP?companionLevelCost(L):0,into=o.exp-floor,evolve=canEvolve(c,game),nextAt=EVOLVE_AT[o.stage-1];
   return <li key={c.id} className={'cp-card'+(evolve?' cp-ready':'')}><div className="cp-art"><img src={'./assets/'+companionArt(c,o.stage)} alt=""/></div>
    <div className="cp-body"><h3>{companionName(c,o.stage)}<small> · {c.source}</small></h3>
     <div className="cp-lv"><span>Lv. <b>{L}</b></span><span>+{pct(companionBoost(L,o.stage))} to {areaById(c.area).name} Fellows</span></div>
     <div className="cp-bar"><i style={{width:(need?Math.min(100,into/need*100):100)+'%'}}/></div>
     <small className="cp-exp">{need?`${into}/${need} EXP`:'Max level'}{o.stage<c.stages.length?` · evolves into ${companionName(c,o.stage+1)} at Lv. ${nextAt}`:' · final form'}{(()=>{const m=COMPANION_MILESTONES.find(([at])=>at>L);return m?` · milestone at Lv. ${m[0]} (×${m[1]})`:''})()}</small>
     <div className="cp-actions">
      <Button size="sm" variant="outline" disabled={locked||!(game.treats>0)||L>=COMPANION_CAP} onClick={()=>action('treat',c.id)}>Treat · +{TREAT_EXP} EXP</Button>
      {evolve&&<Button size="sm" className="cp-evolve" disabled={locked} onClick={()=>action('evolve',c.id)}>Evolve!</Button>}
     </div></div></li>})}</ul>
  <p className="small-note">Every {areaById(area).name} habit you complete feeds all four with +{HABIT_EXP} EXP. Treats drop from Map runs (2 from bosses) and the War Table. One starter per area; the rest are found on boss first-wins, every 8th Map run, and Gauntlet floors 10, 25 and 50.</p>
 </section>;
}
