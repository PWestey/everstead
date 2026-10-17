import {useState} from 'react';
import {Button} from '@/components/ui/button';
import {Dialog,DialogContent,DialogTitle,DialogDescription} from '@/components/ui/dialog';
import RosterLanding from './roster-landing';
import CharacterScreen from './character-screen';
import {PrimaryAction} from './original-controls';
import {FAMILY,areaById,fellowForArea,buildingForArea} from '@/lib/cast.mjs';
import {familyBond,bondProgress,familyReady,areaPoints,playerLevel,GIFTS,VISIT_BOND,BLESS_LINKED,BLESS_ALL,BLESS_BUILDING,FAMILY_JOIN_POINTS,FAMILY_JOIN_LEVEL} from '@/lib/game.mjs';
import {habitDay} from '@/lib/habits.mjs';
import {rosterOrder,rosterStep} from '@/lib/roster-filter.mjs';

/** Bond rungs, named the way the old Family screen named them, every 5 levels. */
const RUNGS=['Acquainted','Friendly','Close','Loving','Loving★','Loving★★','Forever'];
const rung=(level:number)=>RUNGS[Math.min(RUNGS.length-1,Math.floor((level-1)/5))];
const pct=(x:number)=>(x*100).toFixed(1)+'%';

function FamilyStats({game,id}:any){
 const def=FAMILY.find(f=>f.id===id)!,bond=game.family[id].bond,L=familyBond(game,id),p=bondProgress(bond),[open,setOpen]=useState<string|null>(null);
 const fellow=fellowForArea(def.area),building=buildingForArea(def.area);
 return <div className="family-stat-block">
  <div className={'rung-ribbon rung-'+(L<5?'green':'gold')}><b>{rung(L)}</b><i aria-hidden="true">&#9671;</i></div>
  <div className="family-medallions">
   <button type="button" className="family-medallion" onClick={()=>setOpen('Bond')}><img src="./assets/ui-original/Icons--Icon_Intimacy_1.png" alt=""/><span>Bond Lv</span><strong>{L}</strong></button>
   <button type="button" className="family-medallion" onClick={()=>setOpen('Blessing')}><img src="./assets/ui-original/Icons--Icon_EmblemStrength_1.png" alt=""/><span>Blessing</span><strong>+{pct(BLESS_LINKED*L)}</strong></button>
  </div>
  <div className="es-bond-bar" aria-label={`Bond ${p.into} of ${p.need} to the next level`}><i style={{width:Math.min(100,p.into/p.need*100)+'%'}}/><span>{p.into} / {p.need}</span></div>
  <Dialog open={!!open} onOpenChange={o=>{if(!o)setOpen(null)}}><DialogContent className="breakdown-dialog"><DialogTitle>{open==='Bond'?'Bond':'Blessings'}</DialogTitle><DialogDescription className="sr-only">What this does.</DialogDescription>
   {open==='Bond'?<p>Bond grows when you complete {areaById(def.area).name} habits (10 per point), spend time together once a day, give gifts and meet while roaming.</p>
   :<table className="es-breakdown"><tbody>
     <tr><th>{fellow.name}</th><td>linked Fellow</td><td>+{pct(BLESS_LINKED*L)}</td></tr>
     <tr><th>Every Fellow</th><td>village-wide</td><td>+{pct(BLESS_ALL*L)}</td></tr>
     <tr><th>{building.name}</th><td>income</td><td>+{pct(BLESS_BUILDING*L)}</td></tr>
    </tbody></table>}
  </DialogContent></Dialog>
 </div>;
}

function GiftSheet({game,id,action,locked}:any){
 return <div className="es-gifts">{Object.entries(GIFTS).map(([key,g]:any)=>{const short=g.gold?game.gold<g.gold:game.crystals<g.crystals;
  return <div key={key} className="es-gift"><div><strong>{g.name}</strong><p>+{g.bond} bond</p></div>
   <PrimaryAction verb="Give" disabled={locked} currency={g.gold?'Gold':'Crystals'} have={g.gold?game.gold:game.crystals} cost={g.gold||g.crystals} onClick={()=>{if(!short)action('gift',id,key)}}/></div>})}</div>;
}

export default function FamilyPanel({game,action,locked,selected,setSelected,browse,setBrowse}:any){
 const owned=game.family,order=rosterOrder(FAMILY,owned,(id:string)=>owned[id]?.bond||0);
 const person=FAMILY.find(f=>f.id===selected)||FAMILY[0],f=owned[person.id],area=areaById(person.area),[gift,setGift]=useState(false);
 const step=(d:number)=>setSelected(rosterStep(order,person.id,d));
 if(browse)return <RosterLanding kind="Family" family entries={FAMILY} owned={owned} selected={selected} sortOrders={['power','name']} power={(id:string)=>owned[id]?.bond||0} status={(id:string)=>`Bond ${familyBond(game,id)}`} badge={(id:string)=>familyReady(game,FAMILY.find(x=>x.id===id))||(owned[id]&&game.visits[id]!==habitDay(game.lastAt))} search={false} pageSize={6}
  sub={(x:any)=>!owned[x.id]?<span className="es-area-chip" style={{background:areaById(x.area).color}}>{familyReady(game,x)?'Ready!':areaById(x.area).name}</span>:null}
  summary={<p className="management-hint">Family bring Blessings that multiply your Fellows’ Power and their building’s income. Bond grows with habits in their life area.</p>}
  onSelect={(id:string)=>{setSelected(id);setBrowse(false)}}/>;
 const back=<Button className="collection-open" variant="outline" onClick={()=>setBrowse(true)}>‹ Family</Button>;
 if(!f){const ready=familyReady(game,person),have=areaPoints(game,person.area),lvl=playerLevel(game.xp);
  return <CharacterScreen preview person={person} subtitle={area.name} collection={back} onPrevious={()=>step(-1)} onNext={()=>step(1)}>
   <div className="es-join-card"><p>{person.description}</p>
    {ready?<Button className="primary-action primary-tier" disabled={locked} onClick={()=>action('recruitFamily',person.id)}><b>Welcome {person.name}</b></Button>
     :<p className="next-goal">To welcome {person.name}: {area.name} habits {Math.min(have,FAMILY_JOIN_POINTS)} / {FAMILY_JOIN_POINTS} points · your level {Math.min(lvl,FAMILY_JOIN_LEVEL)} / {FAMILY_JOIN_LEVEL}.</p>}</div>
  </CharacterScreen>}
 const visited=game.visits[person.id]===habitDay(game.lastAt);
 return <CharacterScreen person={person} subtitle={area.name} collection={back} onPrevious={()=>step(-1)} onNext={()=>step(1)} infoOnly
  info={<table className="member-info-table"><tbody><tr><th scope="row">Name</th><td>{person.name}</td><th scope="row">Title</th><td>{person.title}</td></tr><tr><th scope="row">Area</th><td colSpan={3}>{area.name}</td></tr><tr><th scope="row">Bio</th><td colSpan={3}>{person.description}</td></tr></tbody></table>}
  statBlock={<FamilyStats game={game} id={person.id}/>}
  primary={<div className="spend-controls"><PrimaryAction verb={visited?'Visited today':'Spend time together'} disabled={locked||visited} onClick={()=>action('visit',person.id)}>+{VISIT_BOND} bond</PrimaryAction></div>}
  rail={<Button variant="outline" className="rail-icon" onClick={()=>setGift(true)} aria-label="Gift"><img src="./assets/menu/gifts.png" alt=""/><span>Gift</span></Button>}>
  <Dialog open={gift} onOpenChange={setGift}><DialogContent className="character-sheet panel-centered"><DialogTitle>Gift for {person.name}</DialogTitle><DialogDescription className="sr-only">Choose a gift.</DialogDescription><div className="character-sheet-body"><GiftSheet game={game} id={person.id} action={action} locked={locked}/></div></DialogContent></Dialog>
 </CharacterScreen>;
}
