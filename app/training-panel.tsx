import {useState} from 'react';
import {Button} from '@/components/ui/button';
import {abbrev} from './original-controls';
import {FELLOWS,FAMILY} from '@/lib/cast.mjs';
import {bondLevel,trainCost,TRAIN_GIFT,GIFTS} from '@/lib/game.mjs';

/** The Training Grounds: bring the whole roster up to a mark. Fellows level with Fellow EXP, Family bond with gifts bought in gold.
 *  Lowest first, so the laggards catch up; with Auto on, every tick spends what has arrived. */
export function TrainingPanel({game,action,locked}:{game:any,action:any,locked:boolean}){
 const t=game.trainer||{fellows:0,family:0,auto:false};
 const [fellows,setFellows]=useState<number>(t.fellows),[family,setFamily]=useState<number>(t.family);
 const fl=Object.values(game.fellows).map((f:any)=>f.level),fm=Object.values(game.family).map((f:any)=>bondLevel(f.bond));
 const cost=trainCost(game,{fellows,family});
 const num=(v:string)=>Math.max(0,Math.min(1e6,Math.floor(Number(v)||0)));
 const field=(label:string,value:number,set:(n:number)=>void,hint:string)=><label className="training-field"><span>{label}</span><input type="number" min={0} max={1000000} inputMode="numeric" value={value||''} placeholder="off" disabled={locked} onChange={e=>set(num(e.target.value))}/><small>{hint}</small></label>;
 return <section className="business-list es-building training-grounds">
  <article className="business-card">
   <div className="identity"><h2>Training Grounds</h2><span className="level">{t.auto?'Auto on':'Manual'}</span></div>
   <p>Set a mark and the drill sergeant brings everyone below it up to it, lowest first, with whatever Fellow EXP and gold you have. Leave a mark empty to skip that roster.</p>
   <ul className="es-modifiers">
    <li><span>Fellows ({fl.length} of {FELLOWS.length})</span><b>{fl.length?`Lv ${Math.min(...fl)} – ${Math.max(...fl)}`:'none yet'}</b></li>
    <li><span>Family ({fm.length} of {FAMILY.length})</span><b>{fm.length?`bond ${Math.min(...fm)} – ${Math.max(...fm)}`:'none yet'}</b></li>
   </ul>
   {field('Train Fellows to level',fellows,setFellows,cost.fellows?`${cost.fellows} below the mark · needs ${abbrev(cost.exp)} Fellow EXP, you have ${abbrev(game.fellowExp||0)}`:'everyone is at the mark')}
   {field('Bond Family to level',family,setFamily,cost.family?`${cost.family} below the mark · ${GIFTS[TRAIN_GIFT].name.toLowerCase()} worth ${abbrev(cost.gold)} gold, you have ${abbrev(game.gold)}`:'everyone is at the mark')}
   <label className="training-auto"><input type="checkbox" checked={!!t.auto} disabled={locked} onChange={e=>action('train',null,{fellows,family,auto:e.target.checked,now:false})}/><span>Keep training automatically as EXP and gold come in</span></label>
   <div className="business-actions"><Button disabled={locked||(!fellows&&!family)} onClick={()=>action('train',null,{fellows,family,auto:t.auto,now:true})}>Train now</Button></div>
   <p className="small-note">Fellows trained here skip their level-up chats and milestone fanfare; the levels and Power are the same.</p>
  </article>
 </section>;
}
