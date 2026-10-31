import {useState} from 'react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Dialog,DialogContent,DialogTitle,DialogDescription} from '@/components/ui/dialog';
import CharacterScreen from './character-screen';
import CharacterArtwork from './character-artwork';
import {SkillsPanel} from './rs-ui';
import {CollectionLog} from './collection-log';
import {PLAYER_STAGES} from '@/lib/cast.mjs';
import {playerStage,rosterPower,powerBreakdown} from '@/lib/game.mjs';
import {totalLevel,MAX_TOTAL} from '@/lib/skills.mjs';
const n=(x:number)=>Math.round(x).toLocaleString('en-US');

export default function HeroPanel({game,action,locked}:any){
 const tl=totalLevel(game),stage=playerStage(tl),next=PLAYER_STAGES.find(s=>s.level>tl);
 const [skills,setSkills]=useState(false),[clog,setClog]=useState(false),[looks,setLooks]=useState(false),[power,setPower]=useState(false),[naming,setNaming]=useState(false),[name,setName]=useState(game.playerName);
 const person={id:'player',name:game.playerName,title:stage.title,art:stage.art,description:'You. Every habit you keep trains a skill, and your total level earns your armour.'};
 const b=powerBreakdown(game),heroShare=b.hero+b.roster?b.hero/(b.hero+b.roster):1;
 return <CharacterScreen person={person} subtitle={stage.title+' · Total level '+tl}
  summary={<div className="es-sum"><span><img src="./assets/rs/stats_icon.png" alt=""/>Total <b>{tl}</b></span><span><img src="./assets/ui-original/Icons--Icon_EmblemStrength_1.png" alt=""/><b>{n(rosterPower(game))}</b> POW</span></div>}
  primary={<Button className="primary-action es-skills-btn" onClick={()=>setSkills(true)}><b>Skills</b></Button>}
  details={<div className="fellow-stats es-hero-stats">
   <div className="fellow-stat fellow-power"><img src="./assets/ui-original/Icons--Icon_EmblemStrength_1.png" alt=""/><span>Power</span><strong>{n(rosterPower(game))}</strong><button type="button" className="info-dot" aria-label="Power details" onClick={()=>setPower(true)}>i</button></div>
   <div className="fellow-stat es-split" aria-label={`Hero ${Math.round(heroShare*100)}%, roster ${100-Math.round(heroShare*100)}%`}><span>You</span><div className="es-split-bar"><i style={{width:heroShare*100+'%'}}/></div><span>Roster</span></div>
   {next&&<div className="fellow-stat"><span className="glyph">⬆</span><span>Next armour</span><strong>{next.title} · total {next.level}</strong></div>}
  </div>}
  detailsLabel="Power"
  rail={<>
   <Button variant="outline" className="es-rail-btn" onClick={()=>setLooks(true)} aria-label="Armour"><img className="rs-px" src="./assets/osrs/ui/Combat_icon.png" alt=""/><span>Armour</span></Button>
   <Button variant="outline" className="es-rail-btn" onClick={()=>setClog(true)} aria-label="Collection Log"><img className="rs-px" src="./assets/osrs/ui/Collection_log_icon.png" alt=""/><span>Log</span></Button>
   <Button variant="outline" className="es-rail-btn" onClick={()=>setNaming(true)} aria-label="Name"><img src="./assets/menu/overview.png" alt=""/><span>Name</span></Button>
  </>}
  info={<p>Each life area is a skill: the cape at 99, and the level keeps counting past it. Your total level unlocks each armour tier (max cape at {MAX_TOTAL}), opens Trial rooms, and past {MAX_TOTAL} it compounds your Hero Power by 1% a level.</p>}
  collection={null}>
  <Dialog open={clog} onOpenChange={setClog}><DialogContent className="es-char-sheet rs-clog-sheet"><DialogTitle className="sr-only">Collection Log</DialogTitle><DialogDescription className="sr-only">Everything to meet, beat, master and finish.</DialogDescription><CollectionLog game={game}/></DialogContent></Dialog>
  <Dialog open={skills} onOpenChange={setSkills}><DialogContent className="es-char-sheet es-skills-sheet"><DialogTitle>Skills</DialogTitle><DialogDescription>Tap a skill for its XP and cape.</DialogDescription><SkillsPanel game={game}/></DialogContent></Dialog>
  <Dialog open={looks} onOpenChange={setLooks}><DialogContent className="character-sheet panel-centered"><DialogTitle>Your armour</DialogTitle><DialogDescription>Each tier unlocks at a total level.</DialogDescription>
   <div className="character-sheet-body es-looks">{PLAYER_STAGES.map(s=><figure key={s.stage} className={tl>=s.level?'':'es-locked'}><CharacterArtwork person={{id:'player-'+s.stage,name:s.title,art:s.art}}/><figcaption><b>{s.title}</b><span>Total level {s.level}</span></figcaption></figure>)}</div>
  </DialogContent></Dialog>
  <Dialog open={power} onOpenChange={setPower}><DialogContent className="breakdown-dialog"><DialogTitle>Power</DialogTitle><DialogDescription className="sr-only">Where your Power comes from.</DialogDescription>
   <table className="es-breakdown"><tbody>
    <tr><th>You</th><td>25 × total level {tl} × armour (+{(stage.stage-1)*15}%){tl>MAX_TOTAL?` × 1.01^${tl-MAX_TOTAL}`:''}</td><td>{n(b.hero)}</td></tr>
    <tr><th>Roster</th><td>{b.fellows.length} Fellow{b.fellows.length===1?'':'s'}, with Family blessings</td><td>{n(b.roster)}</td></tr>
    {b.fellows.map((f:any)=><tr key={f.id} className="es-sub"><th>· {f.name}</th><td>{n(f.base)} +{(f.linked*100).toFixed(1)}% +{(b.all*100).toFixed(1)}%</td><td>{n(f.power)}</td></tr>)}
    <tr><th>Balance</th><td>smaller half ÷ larger half</td><td>+{Math.round(b.balance*20)}%</td></tr>
    <tr className="es-total"><th>Total</th><td/><td>{n(b.total)}</td></tr>
   </tbody></table>
   <p className="small-note">Power = (You + Roster) × (1 + 0.2 × balance). Keep both halves growing for the full bonus.</p>
  </DialogContent></Dialog>
  <Dialog open={naming} onOpenChange={setNaming}><DialogContent className="save-dialog"><DialogTitle>Your name</DialogTitle><DialogDescription>Shown on your Hero screen and in stories.</DialogDescription>
   <Input value={name} maxLength={30} onChange={e=>setName(e.target.value)} aria-label="Your name"/><Button disabled={locked} onClick={()=>{if(action('rename',null,name))setNaming(false)}}>Save name</Button>
  </DialogContent></Dialog>
 </CharacterScreen>;
}
