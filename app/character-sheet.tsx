import {characterById,familyInArea,areaById} from '@/lib/cast.mjs';
import {fellowBasePower,milestoneMult,nextMilestone,MILESTONES,blessings,steadyMult,relicBonus,wornRelics,wornRelic,specMult,pathsOf,bondLevel,SET_SIZE,SET_MULT,ROLE_PROVIDER,ROLE_MENTOR,GUARD_WAVE,GUARD_WOUND} from '@/lib/game.mjs';
import {charPower,modePower,familyPower,modesOf,gearScore} from '@/lib/modes.mjs';
import {areaCompanionBoost} from '@/lib/companions.mjs';
import {SPECS,ROLES,SET_NAMES,FRANCHISE,TIERS,specOf,roleOf,relicText} from '@/lib/traits.mjs';
import {Roll} from './relics';

const n=(x:number)=>Math.round(x).toLocaleString('en-US');
const pct=(x:number)=>(x*100).toFixed(1)+'%';
const x=(m:number)=>'×'+m.toFixed(m<10?2:1);

/** The inspect screen: every multiplier in the order the formula applies it, then what the character counts in each mode, ending in one number. */
export function CharacterSheet({game,id}:{game:any,id:string}){
 const def:any=characterById(id),f=game.fellows[id],fam=game.family[id],b=blessings(game),spec=specOf(id),role=roleOf(id),fr=FRANCHISE[id],focus=pathsOf(game,id).filter((p:string)=>p==='focus').length;
 const power=charPower(game,id),modes=modesOf(game,id),best=gearScore(game,id),weapon=wornRelic(game,id,'weapon'),charm=wornRelic(game,id,'charm');
 const powerRelics=wornRelics(game,id).filter((r:any)=>r.kind==='power');
 return <div className="es-sheet">
  <table className="es-breakdown"><tbody>
   {f?<>
    <tr><th>Base</th><td>100 × Lv {f.level}<sup>1.15</sup> × (1 + 0.25 × {f.stars}★)</td><td>{n(fellowBasePower(f.level,f.stars)/milestoneMult(f.level))}</td></tr>
    <tr><th>Milestones</th><td>{MILESTONES.filter(([at]:any)=>f.level>=at).map(([at]:any)=>'Lv '+at).join(', ')||'none yet'}{(()=>{const m=nextMilestone(f.level);return m?` · next Lv ${m[0]} (×${m[1]})`:''})()}</td><td>{x(milestoneMult(f.level))}</td></tr>
    {(()=>{const kin=familyInArea(def.area),here=kin.filter((m:any)=>game.family[m.id]);return <tr><th>{areaById(def.area).name} family</th><td>{here.length?`${here.sort((p:any,q:any)=>game.family[q.id].bond-game.family[p.id].bond)[0].name}’s bond, the closest of ${here.length} here`:'no family here yet'}</td><td>+{pct(b.linked[id]||0)}</td></tr>})()}
    <tr><th>Companions</th><td>{areaById(def.area).name} companions</td><td>+{pct(areaCompanionBoost(game,def.area))}</td></tr>
    <tr><th>Family blessing</th><td>every Fellow</td><td>+{pct(b.all)}</td></tr>
   </>:<tr><th>Base</th><td>150 × bond level {bondLevel(fam.bond)}</td><td>{n(familyPower(fam.bond))}</td></tr>}
   {steadyMult(game,id)>1&&<tr><th>Steady paths</th><td>chosen at milestones</td><td>{x(steadyMult(game,id))}</td></tr>}
   {powerRelics.length>0&&<tr><th>{powerRelics.map((r:any)=>r.name).join(', ')}</th><td>relic{fr&&powerRelics.some((r:any)=>r.franchise===fr)?', doubled on one of their own':''}</td><td>+{(relicBonus(game,id,'power')*100).toFixed(0)}%</td></tr>}
   <tr className="es-total"><th>Power</th><td/><td>{n(power)}</td></tr>
  </tbody></table>
  <p className="es-sheet-title">In each mode</p>
  <table className="es-breakdown es-sheet-modes"><tbody>
   {modes.map((m:string)=>{const mult=specMult(game,id,m),rel=wornRelics(game,id).find((r:any)=>r.kind===m);const parts=[];if(spec===m)parts.push(`${(SPECS as any)[m].name} ×${(mult/(1+(rel?rel.value:0))).toFixed(2)}`+(focus?` (Focus ×${focus})`:''));if(rel)parts.push(`${rel.name} ×${(1+rel.value).toFixed(2)}`);
    return <tr key={m} className={modePower(game,id,m)===best?'es-sheet-best':''}><th>{(SPECS as any)[m].where.replace(/^the /,'')}</th><td>{parts.join(' · ')||'no bonus'}</td><td>{n(modePower(game,id,m))}</td></tr>})}
   <tr className="es-total"><th>Gear score</th><td>their best mode{fr?`; ${SET_SIZE} of ${fr} together ×${SET_MULT}`:''}</td><td>{n(best)}</td></tr>
  </tbody></table>
  <ul className="es-sheet-notes">
   <li><b>{(ROLES as any)[role].name}.</b> {role==='provider'?`+${Math.round(ROLE_PROVIDER*100)}% gold for squads and crews they are in.`:role==='mentor'?`+${Math.round(ROLE_MENTOR*100)}% Fellow EXP for squads they are in.`:role==='guardian'?`A Front holds ${GUARD_WAVE} more wave; Gauntlet wounds ${GUARD_WOUND} lighter.`:'Power, plain and simple.'}</li>
   {fr&&<li><b>{(SET_NAMES as any)[fr]}.</b> {SET_SIZE} of {fr} in one squad fight ×{SET_MULT}.</li>}
   <li><b>Weapon.</b> {weapon?<span style={{color:(TIERS as any)[weapon.tier].color}}>{weapon.name} <Roll roll={weapon.roll}/></span>:'empty'}{weapon?` · ${relicText(weapon)}`:''}</li>
   <li><b>Charm.</b> {charm?<span style={{color:(TIERS as any)[charm.tier].color}}>{charm.name} <Roll roll={charm.roll}/></span>:'empty'}{charm?` · ${relicText(charm)}`:''}</li>
  </ul>
 </div>;
}
