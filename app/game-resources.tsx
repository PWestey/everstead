import {useState} from 'react';
import {Coins,Diamond,Settings} from 'lucide-react';
import {Button} from '@/components/ui/button';
const compact=(value:number)=>new Intl.NumberFormat('en-US',{notation:'compact',maximumFractionDigits:1}).format(value);
/** The resource rail across the top: your portrait and level (opens your Hero screen), earnings with the
 *  Momentum multiplier your habits earn, gold, crystals and settings. */
export default function GameResources({gold,crystals,income,multiplier=1,onSettings,level,face,onProfile}: {gold:number,crystals:number,income:number,multiplier?:number,onSettings?:()=>void,level?:number,face?:string,onProfile?:()=>void}){
 const [noFace,setNoFace]=useState(false);
 return <header className="game-resources"><h1 className="sr-only">Everstead</h1>
  {level!=null&&onProfile&&<Button className="player-badge" variant="ghost" aria-label={'Your hero, total level '+level} onClick={onProfile}>{face&&!noFace?<img src={'./assets/'+face} alt="" onError={()=>setNoFace(true)}/>:<span className="es-face-fallback" aria-hidden="true">★</span>}<b>{level}</b></Button>}
  <div className="resource-pill" title={Math.round(income*3600).toLocaleString()+' gold per hour from your buildings · Momentum ×'+multiplier.toFixed(2)}><img src="./assets/menu/building.png" alt=""/><span className="sr-only">Earnings </span><strong>{income>0?compact(income*3600):0}/h</strong>{multiplier>1&&<small className="habit-boost">×{multiplier.toFixed(2)}</small>}</div>
  <div className="resource-pill" title={gold.toLocaleString()+' gold'}><Coins aria-hidden="true"/><span className="sr-only">Gold </span><strong>{compact(gold)}</strong></div>
  <div className="resource-pill" title={crystals.toLocaleString()+' crystals'}><Diamond aria-hidden="true"/><span className="sr-only">Crystals </span><strong>{compact(crystals)}</strong></div>
  {onSettings&&<Button className="resource-settings" variant="ghost" aria-label="Save and offline settings" onClick={onSettings}><Settings size={18}/></Button>}
 </header>;
}
