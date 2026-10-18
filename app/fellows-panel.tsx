import {useState} from 'react';
import {Button} from '@/components/ui/button';
import {Dialog,DialogContent,DialogTitle,DialogDescription} from '@/components/ui/dialog';
import RosterLanding from './roster-landing';
import CharacterScreen from './character-screen';
import {PrimaryAction,QuantityPicker,abbrev,type Quantity} from './original-controls';
import {FELLOWS,areaById,buildingForArea,familyForArea} from '@/lib/cast.mjs';
import {fellowPower,fellowBasePower,fellowLevelCap,fellowLevelCost,starCost,MAX_STARS,fellowReady,fellowCanImprove,blessings,buildingRate,areaPoints,FELLOW_JOIN_POINTS} from '@/lib/game.mjs';
import {rosterOrder,rosterStep} from '@/lib/roster-filter.mjs';
const n=(x:number)=>Math.round(x).toLocaleString('en-US');
const ICON='./assets/ui-original/Icons--Icon_EmblemStrength_1.png';

/** How much gold `times` levels would cost from `level`, clamped to the cap and the wallet. */
function plan(level:number,cap:number,gold:number,times:Quantity){const limit=times==='max'?10000:times;let l=level,g=gold,cost=0,count=0;while(count<limit&&l<cap&&g>=fellowLevelCost(l)){g-=fellowLevelCost(l);cost+=fellowLevelCost(l);l++;count++}return {count,cost}}

function FellowStats({game,id}:any){
 const f=game.fellows[id],def=FELLOWS.find(x=>x.id===id)!,cap=fellowLevelCap(f.stars),[open,setOpen]=useState(false),b=blessings(game);
 const building=buildingForArea(def.area),family=familyForArea(def.area);
 return <div className="fellow-stats">
  <div className="fellow-stat fellow-power"><img src={ICON} alt=""/><span>POW</span><strong>{n(fellowPower(game,id))}</strong><button type="button" className="info-dot" aria-label="Where this Power comes from" onClick={()=>setOpen(true)}>i</button></div>
  <div className="fellow-stat fellow-level"><span>Lv.</span><strong>{f.level}</strong>
   <div className={'level-bar'+(f.level>=cap?' level-full':'')}><i style={{width:Math.max(3,Math.min(100,f.level/cap*100))+'%'}}/>
    <span className="awaken-stars" aria-label={f.stars+' of '+MAX_STARS+' stars'}>{Array.from({length:MAX_STARS},(_,i)=><b key={i} className={i<f.stars?'lit':''}>★</b>)}</span></div></div>
  <div className="fellow-stat"><span className="glyph">✦</span><span>{areaById(def.area).name} sigils</span><strong>{n(game.sigils[def.area])}</strong></div>
  <div className="fellow-stat"><span className="glyph">⌂</span><span>{building.name}</span><strong>+ {abbrev(buildingRate(game,building.id))}/s</strong></div>
  <Dialog open={open} onOpenChange={setOpen}><DialogContent className="breakdown-dialog"><DialogTitle>Power Details</DialogTitle><DialogDescription className="sr-only">How this Fellow's Power is calculated.</DialogDescription>
   <table className="es-breakdown"><tbody>
    <tr><th>Base</th><td>100 × Lv {f.level} × (1 + 0.25 × {f.stars}★)</td><td>{n(fellowBasePower(f.level,f.stars))}</td></tr>
    <tr><th>{family.name}'s blessing</th><td>{game.family[family.id]?'linked bonus':'not yet family'}</td><td>+{((b.linked[id]||0)*100).toFixed(1)}%</td></tr>
    <tr><th>Family blessing</th><td>every Fellow</td><td>+{(b.all*100).toFixed(1)}%</td></tr>
    <tr className="es-total"><th>Power</th><td/><td>{n(fellowPower(game,id))}</td></tr>
   </tbody></table>
   <p className="small-note">Level cap is 20 + 20 per star. Stars cost {areaById(def.area).name} sigils, earned by completing {areaById(def.area).name} habits.</p>
  </DialogContent></Dialog>
 </div>;
}

function FellowUpgrade({game,id,action,locked}:any){
 const [q,setQ]=useState<Quantity>(1);const f=game.fellows[id],def=FELLOWS.find(x=>x.id===id)!,cap=fellowLevelCap(f.stars);
 if(f.level>=cap){const cost=starCost(f.stars+1);return <div className="spend-controls">{f.stars>=MAX_STARS?<PrimaryAction verb="Max level" disabled/>:<PrimaryAction verb={'Earn star '+(f.stars+1)} tier disabled={locked} currency="Sigils" have={game.sigils[def.area]} cost={cost} onClick={()=>action('starUp',id)}/>}</div>}
 const p=plan(f.level,cap,game.gold,q);
 return <div className="spend-controls"><QuantityPicker value={q} onChange={setQ} label="Level up quantity"/>
  <PrimaryAction verb={p.count?`Level up x${p.count}`:'Level up'} disabled={locked||!p.count} currency="Gold" have={game.gold} cost={p.count?p.cost:fellowLevelCost(f.level)} onClick={()=>action('levelUp',id,q)}/></div>;
}

export default function FellowsPanel({game,action,locked,selected,setSelected,browse,setBrowse}:any){
 const owned=game.fellows,order=rosterOrder(FELLOWS,owned,(id:string)=>fellowPower(game,id));
 const person=FELLOWS.find(f=>f.id===selected)||FELLOWS[0],f=owned[person.id],area=areaById(person.area);
 const step=(d:number)=>setSelected(rosterStep(order,person.id,d));
 if(browse)return <RosterLanding kind="Fellows" entries={FELLOWS} owned={owned} selected={selected} sortOrders={['power','level','name']} power={(id:string)=>fellowPower(game,id)} status={(id:string)=>`Lv. ${owned[id].level}`} badge={(id:string)=>fellowCanImprove(game,id)||fellowReady(game,FELLOWS.find(x=>x.id===id))} search={false}
  sub={(x:any)=>!owned[x.id]?<span className="es-area-chip" style={{background:areaById(x.area).color}}>{fellowReady(game,x)?'Ready!':areaById(x.area).name}</span>:null}
  summary={<p className="management-hint">Fellows bring Power. Each one belongs to a life area: complete habits in that area to recruit them and earn their stars.</p>}
  onSelect={(id:string)=>{setSelected(id);setBrowse(false)}}/>;
 const back=<Button className="collection-open" variant="outline" onClick={()=>setBrowse(true)}>‹ Fellows roster</Button>;
 if(!f){const ready=fellowReady(game,person),have=areaPoints(game,person.area);
  return <CharacterScreen preview person={person} subtitle={area.name+' Fellow'} collection={back} onPrevious={()=>step(-1)} onNext={()=>step(1)}>
   <div className="es-join-card"><p>{person.description}</p>
    {ready?<Button className="primary-action primary-tier" disabled={locked} onClick={()=>action('recruitFellow',person.id)}><b>Recruit {person.name}</b></Button>
     :<p className="next-goal">Complete {area.name} habits to meet {person.name}: {Math.min(have,FELLOW_JOIN_POINTS)} / {FELLOW_JOIN_POINTS} points.</p>}</div>
  </CharacterScreen>}
 return <CharacterScreen person={person} subtitle={area.name+' Fellow'} collection={back} onPrevious={()=>step(-1)} onNext={()=>step(1)}
  statBlock={<FellowStats game={game} id={person.id}/>} primary={<FellowUpgrade game={game} id={person.id} action={action} locked={locked}/>}
  info={<p className="small-note">{(person as any).fullName?<><b>{(person as any).fullName}</b>. </>:null}Works at the {buildingForArea(person.area).name}, adding 25% to its income.</p>}>{null}</CharacterScreen>;
}
