import {useState} from 'react';
import {Button} from '@/components/ui/button';
import {Dialog,DialogContent,DialogTitle,DialogDescription} from '@/components/ui/dialog';
import {NativeSelect,NativeSelectOption} from '@/components/ui/native-select';
import {characterById,FELLOWS,FAMILY} from '@/lib/cast.mjs';
import {SPECS,ROLES,TIERS,RELICS,relicById,relicText,specOf,roleOf,SET_NAMES,FRANCHISE} from '@/lib/traits.mjs';
import {wornRelic,relicFree,pathsOf,pathsOpen,PATH_AT,PATH_FOCUS,PATH_STEADY,SPEC_MULT,SET_SIZE,SET_MULT} from '@/lib/game.mjs';
import {charPower} from '@/lib/modes.mjs';

const everyone=(game:any)=>[...FELLOWS,...FAMILY].filter((c:any)=>game.fellows[c.id]||game.family[c.id]);
/** Who should wear a relic: a specialist of its mode with an empty slot, else the strongest with an empty slot, else the strongest. */
function suggest(game:any,relic:any){const list=everyone(game).sort((a:any,b:any)=>charPower(game,b.id)-charPower(game,a.id));
 return (list.find((c:any)=>specOf(c.id)===relic.kind&&!wornRelic(game,c.id))||list.find((c:any)=>!wornRelic(game,c.id))||list[0])?.id||''}

/** A relic as it looks the moment it drops: name in its tier's colour, what it does, and an Equip control. */
export function RelicCard({relic,game,action,locked}:{relic:any,game:any,action:any,locked:boolean}){
 const t=(TIERS as any)[relic.tier],[who,setWho]=useState(()=>suggest(game,relic)),free=relicFree(game,relic.id),owned=game.relics?.owned?.[relic.id]||0,wearing=who&&game.relics?.worn?.[who];
 return <div className={'es-relic es-relic-'+relic.tier} style={{['--tier' as any]:t.color}}>
  <img src="./assets/menu/relics.png" alt=""/>
  <div><b>{relic.name}</b><small>{t.name}{relic.franchise?' · '+relic.franchise:''}{owned>1?` · ${owned} copies`:''}</small><p>{relicText(relic)}.</p>
   {free>0?<div className="es-relic-equip"><NativeSelect aria-label="Who wears it" value={who} onChange={(e:any)=>setWho(e.target.value)}>{everyone(game).map((c:any)=><NativeSelectOption key={c.id} value={c.id}>{c.name}{specOf(c.id)===relic.kind?' ★':''}{wornRelic(game,c.id)?' (wearing '+wornRelic(game,c.id).name+')':''}</NativeSelectOption>)}</NativeSelect>
    <Button disabled={locked||!who} onClick={()=>action('relicWear',who,relic.id)}>{wearing?'Swap in':'Equip'}</Button></div>
   :<small className="es-relic-worn">Every copy is being worn.</small>}</div>
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
 const spec=specOf(id),role=roleOf(id),fr=FRANCHISE[id],worn=wornRelic(game,id),open=pathsOpen(game,id),paths=pathsOf(game,id),focus=paths.filter((p:string)=>p==='focus').length;
 const options=RELICS.filter(r=>(game.relics?.owned?.[r.id]||0)>0&&(relicFree(game,r.id)>0||worn?.id===r.id));
 const name=characterById(id)?.name;
 return <div className="es-traits">
  <div className="es-trait-row">
   {spec&&<span className="es-trait es-trait-spec"><b>{(SPECS as any)[spec].name}</b><small>×{(SPEC_MULT+PATH_FOCUS*focus).toFixed(2)} in {(SPECS as any)[spec].where}</small></span>}
   <span className={'es-trait es-trait-'+role}><b>{(ROLES as any)[role].name}</b><small>{(ROLES as any)[role].text}</small></span>
   {fr&&<span className="es-trait es-trait-set"><b>{(SET_NAMES as any)[fr]}</b><small>{SET_SIZE} of {fr} in a squad fight ×{SET_MULT}</small></span>}
  </div>
  <div className="es-relic-slot"><img src="./assets/menu/relics.png" alt=""/>
   {worn?<span style={{['--tier' as any]:(TIERS as any)[worn.tier].color}}><b className="es-relic-name">{worn.name}</b><small>{relicText(worn)}</small></span>:<span><b>No relic</b><small>Relics drop on the Map and at War Table milestones.</small></span>}
   {options.length>0&&<NativeSelect aria-label={'Relic for '+name} value={worn?.id||''} disabled={locked} onChange={(e:any)=>action('relicWear',id,e.target.value||null)}><NativeSelectOption value="">None</NativeSelectOption>{options.map(r=><NativeSelectOption key={r.id} value={r.id}>{r.name} ({(TIERS as any)[r.tier].name})</NativeSelectOption>)}</NativeSelect>}
  </div>
  {open>0&&<div className="es-path"><p><b>A path opens</b> at {PATH_AT.filter((at:number)=>at<=(game.fellows[id]?.level??Infinity)).length?'this milestone':'this bond'}. Choose once, for good:</p>
   <div className="es-path-choice">
    <Button disabled={locked||!spec} onClick={()=>action('pathChoose',id,'focus')}><b>Focus</b><small>+{PATH_FOCUS} to the ×{(SPEC_MULT+PATH_FOCUS*focus).toFixed(2)} in {spec?(SPECS as any)[spec].where:'their mode'}</small></Button>
    <Button disabled={locked} onClick={()=>action('pathChoose',id,'steady')}><b>Steady</b><small>+{Math.round(PATH_STEADY*100)}% Power everywhere, the Map included</small></Button>
   </div></div>}
  {paths.length>0&&<small className="es-paths-taken">Paths: {paths.map((p:string,i:number)=>`${PATH_AT[i]} ${p==='focus'?'Focus':'Steady'}`).join(' · ')}</small>}
 </div>;
}
export const relicLabel=(id:string)=>relicById(id)?.name||'';
