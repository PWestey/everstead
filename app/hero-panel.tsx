import {useState} from 'react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Dialog,DialogContent,DialogTitle,DialogDescription} from '@/components/ui/dialog';
import CharacterScreen from './character-screen';
import CharacterArtwork from './character-artwork';
import {AREAS,PLAYER_STAGES} from '@/lib/cast.mjs';
import {playerLevelProgress,playerStage,playerPower,playerStats,rosterPower,powerBreakdown} from '@/lib/game.mjs';
const n=(x:number)=>Math.round(x).toLocaleString('en-US');

/** The life-area stats as a polygon (one point per area). Scale grows with your best area so the shape stays readable. */
export function StatRadar({stats}:{stats:Record<string,number>}){
 const max=Math.max(10,...Object.values(stats)),R=78,C=100,pt=(i:number,r:number)=>{const a=-Math.PI/2+i*2*Math.PI/AREAS.length;return [C+r*Math.cos(a),C+r*Math.sin(a)]};
 const ring=(f:number)=>AREAS.map((_,i)=>pt(i,R*f).join(',')).join(' ');
 const shape=AREAS.map((a,i)=>pt(i,R*Math.max(.04,(stats[a.id]||0)/max)).join(',')).join(' ');
 return <svg className="es-radar" viewBox="-24 -6 248 212" role="img" aria-label={'Life stats: '+AREAS.map(a=>a.stat+' '+(stats[a.id]||0)).join(', ')}>
  {[.33,.66,1].map(f=><polygon key={f} points={ring(f)} className="es-radar-ring"/>)}
  {AREAS.map((_,i)=>{const [x,y]=pt(i,R);return <line key={i} x1={C} y1={C} x2={x} y2={y} className="es-radar-ring"/>})}
  <polygon points={shape} className="es-radar-shape"/>
  {AREAS.map((a,i)=>{const [x,y]=pt(i,R+14);return <text key={a.id} x={x} y={y} textAnchor="middle" dominantBaseline="middle" fill={a.color} className="es-radar-label">{a.stat}</text>})}
 </svg>;
}

export default function HeroPanel({game,action,locked}:any){
 const p=playerLevelProgress(game.xp),stage=playerStage(p.level),next=PLAYER_STAGES.find(s=>s.level>p.level),stats=playerStats(game);
 const [looks,setLooks]=useState(false),[power,setPower]=useState(false),[naming,setNaming]=useState(false),[name,setName]=useState(game.playerName);
 const person={id:'player',name:game.playerName,title:stage.title,art:stage.art,description:'You. Every habit you keep makes you, and Everstead, stronger.'};
 const breakdown=powerBreakdown(game);
 return <CharacterScreen person={person} subtitle={'Level '+p.level}
  statBlock={<div className="fellow-stats es-hero-stats">
   <div className="fellow-stat fellow-power"><img src="./assets/ui-original/Icons--Icon_EmblemStrength_1.png" alt=""/><span>Roster</span><strong>{n(rosterPower(game))}</strong><button type="button" className="info-dot" aria-label="Roster Power details" onClick={()=>setPower(true)}>i</button></div>
   <div className="fellow-stat fellow-level"><span>Lv.</span><strong>{p.level}</strong><div className="level-bar"><i style={{width:Math.max(3,p.into/p.need*100)+'%'}}/></div><small className="es-xp">{n(p.into)} / {n(p.need)} XP</small></div>
   {next&&<div className="fellow-stat"><span className="glyph">⬆</span><span>Next look</span><strong>{next.title} · Lv {next.level}</strong></div>}
  </div>}
  primary={<StatRadar stats={stats}/>}
  rail={<>
   <Button variant="outline" className="rail-icon" onClick={()=>setLooks(true)} aria-label="Looks"><img src="./assets/menu/rank.png" alt=""/><span>Looks</span></Button>
   <Button variant="outline" className="rail-icon" onClick={()=>setNaming(true)} aria-label="Name"><img src="./assets/menu/overview.png" alt=""/><span>Name</span></Button>
  </>}
  info={<><p>Your stats are your lifetime habit points in each life area.</p><ul className="es-stat-list">{AREAS.map(a=><li key={a.id}><b style={{color:a.color}}>{a.stat}</b> · {a.name}: {stats[a.id]}</li>)}</ul></>}
  collection={null}>
  <Dialog open={looks} onOpenChange={setLooks}><DialogContent className="character-sheet panel-centered"><DialogTitle>Your looks</DialogTitle><DialogDescription>A new look unlocks as you level up.</DialogDescription>
   <div className="character-sheet-body es-looks">{PLAYER_STAGES.map(s=><figure key={s.stage} className={p.level>=s.level?'':'es-locked'}><CharacterArtwork person={{id:'player-'+s.stage,name:s.title,art:s.art}}/><figcaption><b>{s.title}</b><span>Level {s.level}</span></figcaption></figure>)}</div>
  </DialogContent></Dialog>
  <Dialog open={power} onOpenChange={setPower}><DialogContent className="breakdown-dialog"><DialogTitle>Roster Power</DialogTitle><DialogDescription className="sr-only">Where your Roster Power comes from.</DialogDescription>
   <table className="es-breakdown"><tbody>
    <tr><th>You</th><td>150 × Lv {p.level} (+{(breakdown.all*100).toFixed(1)}%)</td><td>{n(breakdown.player)}</td></tr>
    {breakdown.fellows.map((f:any)=><tr key={f.id}><th>{f.name}</th><td>{n(f.base)} +{(f.linked*100).toFixed(1)}% +{(breakdown.all*100).toFixed(1)}%</td><td>{n(f.power)}</td></tr>)}
    <tr className="es-total"><th>Total</th><td/><td>{n(breakdown.total)}</td></tr>
   </tbody></table>
   <p className="small-note">Fellow Power = 100 × Level × (1 + 0.25 × Stars), raised by Family blessings.</p>
  </DialogContent></Dialog>
  <Dialog open={naming} onOpenChange={setNaming}><DialogContent className="save-dialog"><DialogTitle>Your name</DialogTitle><DialogDescription>Shown on your Hero screen and in stories.</DialogDescription>
   <Input value={name} maxLength={30} onChange={e=>setName(e.target.value)} aria-label="Your name"/><Button disabled={locked} onClick={()=>{if(action('rename',null,name))setNaming(false)}}>Save name</Button>
  </DialogContent></Dialog>
 </CharacterScreen>;
}
