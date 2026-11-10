import {useState} from 'react';
import {Button} from '@/components/ui/button';
import {Dialog,DialogContent,DialogTitle,DialogDescription} from '@/components/ui/dialog';
import {NativeSelect,NativeSelectOption} from '@/components/ui/native-select';
import {characterById,FELLOWS,FAMILY} from '@/lib/cast.mjs';
import {SPECS,ROLES,TIERS,SLOTS,slotOf,relicById,relicText,specOf,roleOf,SET_NAMES,FRANCHISE} from '@/lib/traits.mjs';
import {wornRelic,wearerOf,relicsOwned,relicSpares,isWorn,ascendsTo,rollPct,pathsOf,pathsOpen,PATH_AT,PATH_FOCUS,PATH_STEADY,SPEC_MULT,SET_SIZE,SET_MULT,ROLL_PERFECT,SHARDS,REROLL_MULT,ASCEND} from '@/lib/game.mjs';
import {charPower} from '@/lib/modes.mjs';

const everyone=(game:any)=>[...FELLOWS,...FAMILY].filter((c:any)=>game.fellows[c.id]||game.family[c.id]);
const TIER_RANK:any={legendary:0,epic:1,rare:2,common:3};
/** Who should wear a relic: a specialist of its mode with that slot empty, else the strongest with it empty, else the strongest. */
function suggest(game:any,relic:any){const list=everyone(game).sort((a:any,b:any)=>charPower(game,b.id)-charPower(game,a.id)),slot=slotOf(relic);
 return (list.find((c:any)=>specOf(c.id)===relic.kind&&!wornRelic(game,c.id,slot))||list.find((c:any)=>!wornRelic(game,c.id,slot))||list[0])?.id||''}
/** "Roll 87%", and "perfect" at the top. */
export const Roll=({roll}:{roll:number})=><em className={'es-roll'+(roll>=ROLL_PERFECT?' es-roll-perfect':'')}>{roll>=ROLL_PERFECT?'perfect ':'roll '}{rollPct(roll)}</em>;

/** A relic as it looks the moment it drops: name in its tier's colour, what it does, its roll, and an Equip control. */
export function RelicCard({relic,game,action,locked}:{relic:any,game:any,action:any,locked:boolean}){
 const t=(TIERS as any)[relic.tier],[who,setWho]=useState(()=>suggest(game,relic)),mine=relic.uid&&game.relics?.items?.[relic.uid],free=!!mine&&!isWorn(game,relic.uid),wearer=relic.uid&&wearerOf(game,relic.uid),slot=slotOf(relic),wearing=who&&wornRelic(game,who,slot);
 return <div className={'es-relic es-relic-'+relic.tier} style={{['--tier' as any]:t.color}}>
  <img src="./assets/menu/relics.png" alt=""/>
  <div><b>{relic.name}</b><small>{t.name} {(SLOTS as any)[slot].toLowerCase()}{relic.franchise?' · '+relic.franchise:''}{relic.roll!==undefined&&<> · <Roll roll={relic.roll}/></>}</small><p>{relicText(relic)}.</p>
   {free?<div className="es-relic-equip"><NativeSelect aria-label="Who wears it" value={who} onChange={(e:any)=>setWho(e.target.value)}>{everyone(game).map((c:any)=><NativeSelectOption key={c.id} value={c.id}>{c.name}{specOf(c.id)===relic.kind?' ★':''}{wornRelic(game,c.id,slot)?' (wearing '+wornRelic(game,c.id,slot).name+')':''}</NativeSelectOption>)}</NativeSelect>
    <Button disabled={locked||!who} onClick={()=>action('relicWear',who,relic.uid)}>{wearing?'Swap in':'Equip'}</Button></div>
   :wearer?<small className="es-relic-worn">Worn by {characterById(wearer)?.name}.</small>:null}</div>
 </div>;
}

/** A War Table drop stops the screen the way a Map drop stops the result scroll. */
export function RelicDropDialog({relic,game,action,locked,onClose}:{relic:any,game:any,action:any,locked:boolean,onClose:()=>void}){
 return <Dialog open={!!relic} onOpenChange={o=>{if(!o)onClose()}}><DialogContent className="rs-scroll xp-result" showCloseButton={false}>
  {relic&&<><DialogTitle className="xp-r-overwhelm">A relic drops!</DialogTitle><DialogDescription>Something glints in the loot.</DialogDescription>
   <RelicCard relic={relic} game={game} action={action} locked={locked}/><Button onClick={onClose}>Continue</Button></>}
 </DialogContent></Dialog>;
}

/** On a character's sheet: specialty, role, set, the relic slot and any open path. */
export function TraitsBlock({game,id,action,locked}:{game:any,id:string,action:any,locked:boolean}){
 const spec=specOf(id),role=roleOf(id),fr=FRANCHISE[id],open=pathsOpen(game,id),paths=pathsOf(game,id),focus=paths.filter((p:string)=>p==='focus').length;
 const name=characterById(id)?.name;
 return <div className="es-traits">
  <div className="es-trait-row">
   {spec&&<span className="es-trait es-trait-spec"><b>{(SPECS as any)[spec].name}</b><small>×{(SPEC_MULT+PATH_FOCUS*focus).toFixed(2)} in {(SPECS as any)[spec].where}</small></span>}
   <span className={'es-trait es-trait-'+role}><b>{(ROLES as any)[role].name}</b><small>{(ROLES as any)[role].text}</small></span>
   {fr&&<span className="es-trait es-trait-set"><b>{(SET_NAMES as any)[fr]}</b><small>{SET_SIZE} of {fr} in a squad fight ×{SET_MULT}</small></span>}
  </div>
  {Object.keys(SLOTS).map(slot=>{const worn=wornRelic(game,id,slot),options=relicsOwned(game).filter((r:any)=>slotOf(r)===slot&&(!isWorn(game,r.uid)||worn?.uid===r.uid)).sort((a:any,b:any)=>TIER_RANK[a.tier]-TIER_RANK[b.tier]||a.name.localeCompare(b.name)||b.roll-a.roll);
   return <div key={slot} className="es-relic-slot"><img src="./assets/menu/relics.png" alt=""/>
   {worn?<span style={{['--tier' as any]:(TIERS as any)[worn.tier].color}}><b className="es-relic-name">{worn.name} <Roll roll={worn.roll}/></b><small>{relicText(worn)}</small></span>:<span><b>No {(SLOTS as any)[slot].toLowerCase()}</b><small>{slot==='weapon'?'Mode and Power relics go here.':'Gold and EXP relics go here.'}</small></span>}
   {options.length>0&&<NativeSelect aria-label={(SLOTS as any)[slot]+' for '+name} value={worn?.uid||''} disabled={locked} onChange={(e:any)=>action('relicWear',id,e.target.value||slot)}><NativeSelectOption value="">None</NativeSelectOption>{options.map((r:any)=><NativeSelectOption key={r.uid} value={r.uid}>{r.name} ({(TIERS as any)[r.tier].name}, {rollPct(r.roll)})</NativeSelectOption>)}</NativeSelect>}
  </div>})}
  {open>0&&<div className="es-path"><p><b>A path opens</b> at {PATH_AT.filter((at:number)=>at<=(game.fellows[id]?.level??Infinity)).length?'this milestone':'this bond'}. Choose once, for good:</p>
   <div className="es-path-choice">
    <Button disabled={locked||!spec} onClick={()=>action('pathChoose',id,'focus')}><b>Focus</b><small>+{PATH_FOCUS} to the ×{(SPEC_MULT+PATH_FOCUS*focus).toFixed(2)} in {spec?(SPECS as any)[spec].where:'their mode'}</small></Button>
    <Button disabled={locked} onClick={()=>action('pathChoose',id,'steady')}><b>Steady</b><small>+{Math.round(PATH_STEADY*100)}% Power everywhere, the Map included</small></Button>
   </div></div>}
  {paths.length>0&&<small className="es-paths-taken">Paths: {paths.map((p:string,i:number)=>`${PATH_AT[i]} ${p==='focus'?'Focus':'Steady'}`).join(' · ')}</small>}
 </div>;
}

/** The Forge, in the Workshop: every relic you own, sorted by tier then roll, with Salvage, Reroll and Ascend; spares go in one tap. */
export function Forge({game,action,locked}:{game:any,action:any,locked:boolean}){
 const list=relicsOwned(game).sort((a:any,b:any)=>TIER_RANK[a.tier]-TIER_RANK[b.tier]||a.name.localeCompare(b.name)||b.roll-a.roll),spares=relicSpares(game),shards=game.relics?.shards||0;
 return <div className="es-forge">
  <p className="es-residents-title">The Forge · <b className="es-shards">{shards.toLocaleString('en-US')} shards</b></p>
  <p className="small-note">Salvage a relic into shards (common {SHARDS.common}, rare {SHARDS.rare}, epic {SHARDS.epic}, legendary {SHARDS.legendary}). Reroll one for {REROLL_MULT}× its shards. Ascend a common for {ASCEND.common} or a rare for {ASCEND.rare}; it rolls afresh.</p>
  {spares.length>0&&<Button variant="outline" disabled={locked} onClick={()=>action('relicSalvageSpares')}>Salvage {spares.length} spare{spares.length>1?'s':''} (+{spares.reduce((n:number,r:any)=>n+(SHARDS as any)[r.tier],0)} shards)</Button>}
  {!list.length&&<p className="small-note">Nothing on the anvil yet. Relics drop on the Map and at War Table milestones.</p>}
  <ul className="es-forge-list">{list.map((r:any)=>{const t=(TIERS as any)[r.tier],w=wearerOf(game,r.uid),up=ascendsTo(r),rc=(SHARDS as any)[r.tier]*REROLL_MULT,ac=(ASCEND as any)[r.tier];
   return <li key={r.uid} className={'es-forge-row es-relic-'+r.tier} style={{['--tier' as any]:t.color}}>
    <div><b>{r.name}</b> <Roll roll={r.roll}/><small>{t.name} · {relicText(r)}{w?' · worn by '+characterById(w)?.name:''}</small></div>
    <div className="es-forge-acts">
     <Button variant="outline" disabled={locked||!!w} title={w?'Worn':''} onClick={()=>action('relicSalvage',r.uid)}>Salvage +{(SHARDS as any)[r.tier]}</Button>
     <Button variant="outline" disabled={locked||shards<rc} onClick={()=>action('relicReroll',r.uid)}>Reroll {rc}</Button>
     {up&&<Button variant="outline" disabled={locked||shards<ac} onClick={()=>action('relicAscend',r.uid)}>Ascend {ac}</Button>}
    </div></li>})}</ul>
 </div>;
}
export const relicLabel=(id:string)=>relicById(id)?.name||'';
