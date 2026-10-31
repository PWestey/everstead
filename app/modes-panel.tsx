import {useState} from 'react';
import {Button} from '@/components/ui/button';
import {MiniArt} from './character-artwork';
import {AREAS,areaById,characterById} from '@/lib/cast.mjs';
import {currentBlight} from '@/lib/game.mjs';
import {skillIcon} from '@/lib/skills.mjs';
import {FRANCHISE} from '@/lib/franchises.mjs';
import * as X from '@/lib/modes.mjs';

const n=(x:number)=>Math.round(x).toLocaleString('en-US');
const area=(a:string)=>areaById(a)?.name||a;
type Mode='errands'|'rift'|'fronts'|'trials'|'strike'|'spire'|'arena'|'gauntlet';
const MODES:{id:Mode,name:string,who:string,when:string,blurb:string}[]=[
 {id:'errands',name:'Errands',who:'Family',when:'Daily',blurb:'Send Family crews on timed jobs around the village.'},
 {id:'rift',name:'The Rift',who:'Fellows',when:'Daily',blurb:'One squad climbs today’s rift. Today’s area counts double.'},
 {id:'strike',name:'Blight Strikes',who:'Family',when:'Daily',blurb:'Hit this week’s Blight alongside your habits.'},
 {id:'arena',name:'The Arena',who:'Both',when:'5 tries a day',blurb:'Climb a ladder of rival franchise teams.'},
 {id:'gauntlet',name:'Draft Gauntlet',who:'Both',when:'1 run a day',blurb:'Draft a squad. Everyone counts the same. How deep can you go?'},
 {id:'fronts',name:'The Eight Fronts',who:'Both',when:'Weekly',blurb:'Defend all eight life areas. Each character fights once a week.'},
 {id:'trials',name:'The Trials',who:'Family-led',when:'Weekly',blurb:'Eight rooms, eight strange rules.'},
 {id:'spire',name:'The Spire',who:'Fellows',when:'Any time',blurb:'An endless climb. Progress is never lost.'},
];

/** Pick up to `max` from a list of characters; shows each one's power. */
function Picker({list,max,sel,setSel,note}:{list:any[],max:number,sel:string[],setSel:(v:string[])=>void,note?:(c:any)=>string}){
 if(!list.length)return <p className="small-note">Nobody available yet. Recruit more with your habits.</p>;
 return <div className="wt-pick">{list.map(c=>{const on=sel.includes(c.id);return <button key={c.id} type="button" className={'wt-char'+(on?' on':'')} disabled={!on&&sel.length>=max}
  onClick={()=>setSel(on?sel.filter(x=>x!==c.id):[...sel,c.id])}><MiniArt person={characterById(c.id)}/><span><b>{c.name}</b><small>{n(c.power)}{note?.(c)?' · '+note(c):''}</small></span></button>})}</div>}

/** The strongest `max` of a list by `weight` (default: power). `mustKind` forces at least one character of that kind in. */
function best(list:any[],max:number,weight:(c:any)=>number=c=>c.power,mustKind?:string){const ranked=[...list].sort((a,b)=>weight(b)-weight(a));const pick=ranked.slice(0,max);
 if(mustKind&&!pick.some(c=>c.kind===mustKind)){const need=ranked.find(c=>c.kind===mustKind);if(need){pick.pop();pick.push(need)}}return pick.map(c=>c.id)}
/** Optimize beside the mode's own button: fills the squad with the best picks so you needn't scroll back up. */
function Go({label,onGo,disabled,optimize,locked}:{label:string,onGo:()=>void,disabled:boolean,optimize?:()=>void,locked:boolean}){
 return <div className="wt-actions">{optimize&&<Button className="wt-go wt-opt" disabled={locked} onClick={optimize}>Optimize</Button>}<Button className="wt-go" disabled={disabled} onClick={onGo}>{label}</Button></div>}

function Vs({power,need}:{power:number,need:number}){return <p className={'wt-vs'+(power>=need?' ok':'')}><b>{n(power)}</b> vs <b>{n(need)}</b></p>}

export function ModesPanel({game,action,locked}:{game:any,action:any,locked:boolean}){
 const [mode,setMode]=useState<Mode|null>(null),[sel,setSel]=useState<string[]>([]),[target,setTarget]=useState<string|null>(null);
 const now=Date.now(),m=X.modesNow(game,now),go=(kind:string,t:any=null,v:any=sel)=>{if(action('mode:'+kind,t,v)){setSel([]);if(kind.startsWith('errand'))setTarget(null)}};// stay in the room: Optimize, Enter, again
 const open=(id:Mode)=>{setMode(id);setSel([]);setTarget(null)};
 if(!mode)return <section className="wt"><header className="wt-head"><h2>The War Table</h2><p>Put your Fellows and Family to work. Every mode runs on Power, and habits make each one stronger.</p></header>
  <ul className="wt-list">{MODES.map(md=><li key={md.id}><button type="button" className="wt-card" onClick={()=>open(md.id)}><b>{md.name}</b><small>{md.who} · {md.when}</small><span>{md.blurb}</span><em>{status(md.id,game,m,now)}</em></button></li>)}</ul></section>;
 const md=MODES.find(x=>x.id===mode)!,back=<button type="button" className="wt-back" onClick={()=>setMode(null)}>‹ War Table</button>;
 const fellows=X.roster(game,['fellow']),family=X.roster(game,['family']),all=X.roster(game);
 let body:any=null;
 if(mode==='errands'){const offers=X.errandOffers(game,now),busy=m.errands.out.flatMap((x:any)=>x.crew),o=offers.find(x=>x.id===target);
  body=<>{m.errands.out.map((x:any)=><div key={x.id} className="wt-row"><span><b>{x.offer.title}</b><small>{x.crew.map((id:string)=>characterById(id)?.name).join(', ')} · {x.end<=now?'back!':`back in ${Math.ceil((x.end-now)/60000)} min`}</small></span><Button disabled={locked||x.end>now} onClick={()=>go('errandCollect',x.id,null)}>Collect</Button></div>)}
   <h3>Today’s jobs</h3>{offers.map(x=>{const taken=m.errands.done.includes(x.id)||m.errands.out.some((e:any)=>e.id===x.id);return <button key={x.id} type="button" disabled={taken} className={'wt-offer'+(target===x.id?' on':'')} onClick={()=>{setTarget(x.id);setSel([])}}>
    <img src={'./assets/'+skillIcon(x.area)} alt=""/><span><b>{x.title}</b><small>{area(x.area)} · {x.hours}h · crew of {x.slots} · pays {x.kind} · needs {n(x.need)}</small></span>{taken&&<em>Taken</em>}</button>})}
   {o&&<><Picker list={family.filter(c=>!busy.includes(c.id))} max={o.slots} sel={sel} setSel={setSel}/><Vs power={sel.reduce((t,id)=>t+X.charPower(game,id),0)} need={o.need}/>
    <Go label="Send crew" locked={locked} disabled={locked||!sel.length} onGo={()=>go('errandSend',o.id)} optimize={()=>setSel(best(family.filter(c=>!busy.includes(c.id)),o.slots))}/></>}
   <p className="small-note">Up to {X.ERRAND_MAX_OUT} errands out at once. Each daily habit you finish adds 7% to what they bring back (up to +50%).</p></>}
 if(mode==='rift'){const a=X.riftArea(now),p=X.riftPower(game,sel,now);let f=0;while(f<200&&p>=X.riftNeed(f+1))f++;
  body=m.rift.used.length?<p className="wt-done">Today’s squad climbed {m.rift.floor} floors. The {area(a)} Rift resets tomorrow.</p>:<>
   <p>Today the Rift is <b>{area(a)}</b>: {area(a)} Fellows count double. Each daily habit done adds 5% (up to +40%).</p>
   <Picker list={fellows} max={X.RIFT_SQUAD} sel={sel} setSel={setSel} note={c=>c.area===a?'×2':''}/><p className="wt-vs ok">Power {n(p)}: reaches floor <b>{f}</b></p>
   <Go label="Enter the Rift" locked={locked} disabled={locked||!sel.length} onGo={()=>go('rift')} optimize={()=>setSel(best(fellows,X.RIFT_SQUAD,c=>c.power*(c.area===a?2:1)))}/></>}
 if(mode==='strike'){const b=currentBlight(game,now);
  body=<><p><b>{b.name}: {b.title}</b> · {b.damage} / {b.hp} pushed back</p><p>{m.strike.bank} strike{m.strike.bank===1?'':'s'} left (3 a day, up to 9 saved). Each Family member can strike once a day.</p>
   {b.defeated?<p className="wt-done">Down for the week. Claim it on the Map.</p>:<><Picker list={family.filter(c=>!m.strike.used.includes(c.id))} max={X.STRIKE_SQUAD} sel={sel} setSel={setSel}/>
   <p className="wt-vs ok">Hits for {X.strikeDamage(game,sel,b.hp)}</p><Go label="Strike" locked={locked} disabled={locked||!sel.length||m.strike.bank<1} onGo={()=>go('strike')} optimize={()=>setSel(best(family.filter(c=>!m.strike.used.includes(c.id)),X.STRIKE_SQUAD))}/></>}</>}
 if(mode==='arena'){const foe=X.arenaFoe(m.arena.rank),need=X.arenaNeed(m.arena.rank);
  body=<><p>Rank <b>{m.arena.rank+1}</b> · next: <b>Team {foe}</b>{m.arena.rank%5===4?' (champion)':''}. Your own {foe} heroes are outshone (×0.75). {X.ARENA_TRIES-m.arena.tries} tries left today.</p>
   <Picker list={all} max={X.ARENA_SQUAD} sel={sel} setSel={setSel} note={c=>FRANCHISE[c.id]===foe?'×0.75':''}/><Vs power={X.arenaPower(game,sel,now)} need={need}/>
   <Go label="Fight" locked={locked} disabled={locked||!sel.length||m.arena.tries>=X.ARENA_TRIES} onGo={()=>go('arena')} optimize={()=>setSel(best(all,X.ARENA_SQUAD,c=>c.power*(FRANCHISE[c.id]===foe?0.75:1)))}/></>}
 if(mode==='fronts'){const areaSel=target;
  body=<><div className="wt-fronts">{AREAS.map(a=>{const w=m.fronts.waves[a.id];return <button key={a.id} type="button" className={'wt-front'+(areaSel===a.id?' on':'')} disabled={w!==undefined} onClick={()=>{setTarget(a.id);setSel([])}}><img src={'./assets/'+skillIcon(a.id)} alt=""/><b>{a.name}</b><small>{w===undefined?'Open':`${w} waves`}</small></button>})}</div>
   {areaSel&&<><p>{area(areaSel)} characters count ×1.25. The more {area(areaSel)} habits you did this week, the easier the waves.</p>
    <Picker list={all.filter(c=>!m.fronts.used.includes(c.id))} max={X.FRONT_SQUAD} sel={sel} setSel={setSel} note={c=>c.area===areaSel?'×1.25':''}/>
    {(()=>{const p=X.frontPower(game,areaSel,sel),lv=X.areaWeek(game,areaSel,now);let w=0;while(w<30&&p>=X.frontNeed(w+1,lv))w++;return <p className="wt-vs ok">Power {n(p)}: holds <b>{w}</b> waves</p>})()}
    <Go label="Defend" locked={locked} disabled={locked||!sel.length} onGo={()=>go('front',areaSel)} optimize={()=>setSel(best(all.filter(c=>!m.fronts.used.includes(c.id)),X.FRONT_SQUAD,c=>c.power*(c.area===areaSel?1.25:1)))}/></>}
   <p className="small-note">Every character can fight on one front per week. Resets Monday.</p></>}
 if(mode==='trials'){const a=target;
  body=<><div className="wt-fronts">{AREAS.map(x=>{const r=X.trialRule(x.id,now);return <button key={x.id} type="button" className={'wt-front'+(a===x.id?' on':'')} onClick={()=>{setTarget(x.id);setSel([])}}><img src={'./assets/'+skillIcon(x.id)} alt=""/><b>{x.name}</b><small>{x.id==='hobbies'?'Wild: ':''}{X.TRIAL_RULES[r].name} · {m.trials.cleared[x.id]||0}/{X.trialCap(game,x.id)}</small></button>})}</div>
   {a&&(()=>{const tier=(m.trials.cleared[a]||0)+1,cap=X.trialCap(game,a),r=X.trialRule(a,now),t=X.trialPower(game,a,sel,tier,now);return <>
    <p><b>{X.TRIAL_RULES[r].name}:</b> {X.TRIAL_RULES[r].text}{a==='hobbies'?` (This week: ${area(r)}.)`:''} Family count ×1.5. At least one Family member.</p>
    {tier>cap?<p className="wt-done">Tier {tier} is locked. Raise your {area(a)} skill to open more.</p>:<><Picker list={all} max={X.TRIAL_SQUAD} sel={sel} setSel={setSel}/>
     <p>Tier {tier}</p><Vs power={t.power} need={t.need}/><Go label="Enter" locked={locked} disabled={locked||!sel.length} onGo={()=>go('trial',a)} optimize={()=>setSel(best(all,X.TRIAL_SQUAD,c=>c.power*(c.kind==='family'?1.5:1),'family'))}/></>}</>})()}</>}
 if(mode==='spire'){const f=m.spire.floor,res=X.spireResolve(game),p=Math.round(sel.reduce((t,id)=>t+X.charPower(game,id),0)*res);let to=f;while(to<1000&&p>=X.spireNeed(to+1))to++;
  body=<><p>Floor <b>{f}</b>. Next needs {n(X.spireNeed(f+1))}. Bosses every 10th and 50th floor.{res>1?` Resolve: +${Math.round((res-1)*100)}%.`:''}</p>
   <Picker list={fellows} max={X.SPIRE_SQUAD} sel={sel} setSel={setSel}/><p className="wt-vs ok">Power {n(p)}: reaches floor <b>{to}</b></p>
   <Go label="Climb" locked={locked} disabled={locked||!sel.length} onGo={()=>go('spire')} optimize={()=>setSel(best(fellows,X.SPIRE_SQUAD))}/></>}
 if(mode==='gauntlet'){const run=m.gauntlet.run,day=m.gauntlet.day;
  if(!run&&m.gauntlet.done)body=<p className="wt-done">Today’s run is over. Best ever: floor {m.gauntlet.best}. A new draft tomorrow.</p>;
  else if(!run){const draft=X.gauntletDraft(game,day);body=<><p>Pick 3 from today’s draft. In here everyone counts as 100 power, so it’s about choices, not levels: each sector of 3 floors favours one life area (×2), and you see the next sector before you draft. Each daily habit done today adds 5% (up to +40%). Best: floor {m.gauntlet.best}.</p><p>First sector favours <b>{area(X.gauntletSector(day,1))}</b>, then <b>{area(X.gauntletSector(day,4))}</b>.</p>
   <Picker list={draft.map(id=>({id,name:characterById(id)?.name,power:100}))} max={3} sel={sel} setSel={setSel} note={c=>area(characterById(c.id)?.area)}/>
   <Button className="wt-go" disabled={locked||sel.length!==Math.min(3,draft.length)} onClick={()=>go('gauntletStart')}>Begin</Button></>}
  else{const sec=X.gauntletSector(day,run.floor+1),nextSec=X.gauntletSector(day,run.floor+4);body=<><p>Floor <b>{run.floor+1}</b> · health <b>{run.hp}</b> · this sector favours <b>{area(sec)}</b> (×2), next <b>{area(nextSec)}</b>{run.boons.length?` · boons: ${run.boons.map((b:string)=>(X.GAUNTLET_BOONS as any)[b].name).join(', ')}`:''}</p>
   <p>Squad: {run.squad.map((id:string)=>{const c=characterById(id);return c?.area===sec?`${c.name} ×2`:c?.name}).join(', ')}</p>
   {run.offer?<><h3>{run.offer.regroup?'Regroup: choose a boon':'Sector cleared: choose one'}</h3><div className="wt-pick">{run.offer.draft.map((id:string)=><button key={id} type="button" className="wt-char" disabled={locked} onClick={()=>go('gauntletChoose',id,null)}><MiniArt person={characterById(id)}/><span><b>Recruit {characterById(id)?.name}</b><small>{area(characterById(id)?.area)}</small></span></button>)}
     {run.offer.boons.map((b:string)=><button key={b} type="button" className="wt-char" disabled={locked} onClick={()=>go('gauntletChoose',b,null)}><span><b>{(X.GAUNTLET_BOONS as any)[b].name}</b><small>{(X.GAUNTLET_BOONS as any)[b].text}</small></span></button>)}</div></>
   :<><Vs power={X.gauntletPower(game,run,day,now)} need={X.gauntletNeed(run.floor+1)}/><Button className="wt-go" disabled={locked} onClick={()=>go('gauntletFight',null,null)}>Fight floor {run.floor+1}</Button>
     <button type="button" className="wt-back" onClick={()=>go('gauntletEnd',null,null)}>Walk out</button></>}</>}}
 return <section className="wt">{back}<header className="wt-head"><h2>{md.name}</h2><p>{md.blurb}</p></header>{body}</section>;
}

/** One-line status for a mode's card on the War Table. */
function status(id:Mode,game:any,m:any,now:number){
 if(id==='errands'){const ready=m.errands.out.filter((x:any)=>x.end<=now).length;return ready?`${ready} crew back!`:`${m.errands.out.length}/${X.ERRAND_MAX_OUT} out`}
 if(id==='rift')return m.rift.used.length?`Floor ${m.rift.floor} today`:`Open · ${area(X.riftArea(now))}`;
 if(id==='strike')return `${m.strike.bank} strikes ready`;
 if(id==='arena')return `Rank ${m.arena.rank+1} · ${X.ARENA_TRIES-m.arena.tries} tries`;
 if(id==='gauntlet')return m.gauntlet.run?`Floor ${m.gauntlet.run.floor+1}, in progress`:m.gauntlet.done?'Done today':`Best floor ${m.gauntlet.best}`;
 if(id==='fronts')return `${Object.keys(m.fronts.waves).length}/8 fronts defended`;
 if(id==='trials')return `${Object.values(m.trials.cleared).reduce((a:any,b:any)=>a+b,0)} tiers this week`;
 if(id==='spire')return `Floor ${m.spire.floor}`;
 return ''}
