import {useEffect,useMemo,useState} from 'react';
import {habitDay} from '@/lib/habits.mjs';
import {Button} from '@/components/ui/button';
import {Dialog,DialogContent,DialogTitle,DialogDescription} from '@/components/ui/dialog';
import {AREAS,characterById} from '@/lib/cast.mjs';
import {skillInfo,skillIcon,capeArt,totalLevel,MAX_TOTAL,MAX_LEVEL} from '@/lib/skills.mjs';
import {QUESTS,questIds,questStatus,questPoints,questLock} from '@/lib/quests.mjs';
import {TREES,ADVENTURES} from '@/lib/dialogue.mjs';
import {playerStage} from '@/lib/game.mjs';
import {MiniArt} from './character-artwork';
const n=(x:number)=>Math.round(x).toLocaleString('en-US');
const areaName=(a:string)=>AREAS.find(x=>x.id===a)?.name||a;

/** The skills panel: eight skills, level/99, and the total level, in the style of the RuneScape stats tab. */
export function SkillsPanel({game}:{game:any}){
 const [open,setOpen]=useState<string|null>(null),info=open?skillInfo(game,open):null,tl=totalLevel(game);
 return <div className="rs-stats" aria-label="Skills">
  {AREAS.map(a=>{const s=skillInfo(game,a.id);return <button key={a.id} type="button" className="rs-skill" onClick={()=>setOpen(a.id)} aria-label={`${a.name} level ${s.level}`}>
   <img src={'./assets/'+skillIcon(a.id)} alt=""/><span className="rs-lvl"><b>{s.level}</b><i>{s.level}</i></span></button>})}
  <div className="rs-total"><small>Total level:</small><b>{tl}</b></div>
  <Dialog open={!!open} onOpenChange={o=>{if(!o)setOpen(null)}}><DialogContent className="rs-sheet">
   {info&&<><DialogTitle><img src={'./assets/'+skillIcon(info.area)} alt=""/> {info.name}</DialogTitle>
    <DialogDescription>{info.style} · level {info.level} / {MAX_LEVEL}</DialogDescription>
    <div className="rs-xp-rows"><p><span>{info.name} XP:</span><b>{n(info.xp)}</b></p>{info.next!==null&&<><p><span>Next level at:</span><b>{n(info.next)}</b></p><p><span>Remaining XP:</span><b>{n(info.next-info.xp)}</b></p></>}</div>
    {info.next!==null&&<div className="rs-bar"><i style={{width:Math.max(2,info.into/info.need*100)+'%'}}/><span>{Math.floor(info.into/info.need*100)}%</span></div>}
    <figure className={'rs-cape'+(info.level>=MAX_LEVEL?'':' rs-locked')}><img src={'./assets/'+capeArt(info.area)} alt={info.name+' cape'}/><figcaption>{info.level>=MAX_LEVEL?`${info.name} cape: yours.`:`${info.name} cape: reach level 99.`}</figcaption></figure>
    <p className="small-note">Every {info.name} habit trains this skill: easy 500 XP, normal 1,000, hard 1,500. Quests and adventures add more.</p></>}
  </DialogContent></Dialog>
  {tl>=MAX_TOTAL&&<img className="rs-max" src="./assets/rs/cape-max.webp" alt="Max cape"/>}
 </div>;
}

/** "Congratulations, you just advanced a level." One skill at a time. */
export function LevelUpDialog({up,onClose}:{up:any,onClose:()=>void}){
 return <Dialog open={!!up} onOpenChange={o=>{if(!o)onClose()}}><DialogContent className="rs-levelup" showCloseButton={false}>
  {up&&<button type="button" className="rs-levelup-body" onClick={onClose}>
   <img src={'./assets/'+skillIcon(up.area)} alt=""/>
   <div><DialogTitle>Congratulations, you just advanced {/^[aeiou]/i.test(areaName(up.area))?'an':'a'} {areaName(up.area)} level.</DialogTitle>
    <DialogDescription>Your {areaName(up.area)} level is now {up.level}.{up.level>=MAX_LEVEL?' You can now wear the '+areaName(up.area)+' cape!':''}</DialogDescription>
    <span className="rs-continue">Click here to continue</span></div></button>}
 </DialogContent></Dialog>;
}

/** The quest-complete scroll. */
export function QuestCompleteScroll({questId,onClose}:{questId:string|null,onClose:()=>void}){
 const q=questId?QUESTS[questId]:null;
 return <Dialog open={!!q} onOpenChange={o=>{if(!o)onClose()}}><DialogContent className="rs-scroll" showCloseButton={false}>
  {q&&<><img className="rs-scroll-icon" src="./assets/rs/quest.png" alt=""/><DialogTitle>Congratulations!</DialogTitle>
   <DialogDescription>You have completed <b>{q.name}</b>!</DialogDescription>
   <p className="rs-scroll-head">You are awarded:</p><ul>{q.rewardText.map((r:string)=><li key={r}>{r}</li>)}</ul>
   <Button onClick={onClose}>Close</Button></>}
 </DialogContent></Dialog>;
}

/** The quest journal: red not started, yellow in progress, green complete. */
export function QuestJournal({game,onTalk}:{game:any,onTalk:(tree:string)=>void}){
 const [sel,setSel]=useState(()=>questIds.find(id=>['active','available'].includes(questStatus(game,id).status))||questIds[0]);const q=QUESTS[sel],st=questStatus(game,sel),giver=characterById(q.giver);
 return <section className="rs-quests">
  <header><img src="./assets/rs/quest.png" alt=""/><b>Quest Points: {questPoints(game)}</b></header>
  <ul className="rs-quest-list">{questIds.map(id=>{const s=questStatus(game,id);return <li key={id}><button type="button" className={'rs-q-'+s.status+(id===sel?' rs-q-sel':'')} onClick={()=>setSel(id)}>{QUESTS[id].name}</button></li>})}</ul>
  <article className="rs-journal">
   <h3>{q.name}</h3>
   <p className="rs-journal-giver"><MiniArt person={giver}/>{giver?.name} · {areaName(q.area)}</p>
   <p>{q.blurb}</p>
   {st.status==='locked'&&<p className="rs-step-now">To begin: {questLock(game,sel)}</p>}
   <ol className="rs-steps">{q.steps.map((step:any,i:number)=>{const done=st.status==='done'||i<st.stepIndex,now=st.status!=='locked'&&st.status!=='done'&&i===st.stepIndex;if(!done&&!now)return null;
    return <li key={i} className={done?'rs-step-done':'rs-step-now'}>{step.text}{now&&st.progress?<b> ({st.progress.have}/{st.progress.need})</b>:null}</li>})}</ol>
   {st.status==='done'&&<p className="rs-step-done">QUEST COMPLETE!</p>}
   {(st.status==='available'||st.status==='active')&&st.step?.type==='talk'&&<Button className="primary-action primary-tier" onClick={()=>onTalk(st.step.tree)}><b>Talk to {giver?.name}</b></Button>}
   <p className="rs-journal-rewards"><b>Rewards:</b> {q.rewardText.join(' · ')}</p>
  </article>
 </section>;
}

/** Art cards for a location's adventures. Each is free once a day. */
export function AdventureCards({game,location,onStart}:{game:any,location:string,onStart:(tree:string)=>void}){
 const list=ADVENTURES[location]||[];if(!list.length)return null;const today=habitDay(Date.now()),doneToday=(id:string)=>game.roam.advDays?.[id]===today;
 return <section className="rs-adventures"><h3>Adventures <small>free once a day each</small></h3>
  <div className="rs-adv-grid">{list.map((a:any)=><button key={a.id} type="button" className="rs-adv" disabled={doneToday(a.id)} onClick={()=>onStart(a.id)} style={{backgroundImage:`url(./assets/${a.art})`}}>
   <span className="rs-adv-text"><b>{a.title}</b><small>{a.blurb}</small><span className="rs-adv-skills">{a.skills.map((s:string)=><img key={s} src={'./assets/'+skillIcon(s)} alt={areaName(s)}/>)}<em>{doneToday(a.id)?'Done today':'Free today'}</em></span></span></button>)}</div>
 </section>;
}

/** The dialogue screen: a backdrop, the speaker's portrait, and an RS-style chatbox with choices.
 *  `act(node,opt)` applies a node's or choice's effects through the game and returns false if refused. */
export function DialogueScreen({treeId,game,act,onClose}:{treeId:string|null,game:any,act:(tree:string,node:string,opt:number|null)=>boolean,onClose:()=>void}){
 const tree=treeId?TREES[treeId]:null;const [key,setKey]=useState<string|null>(null),[shown,setShown]=useState(0);
 const node=tree&&key?tree.nodes[key]:null;
 const text=useMemo(()=>(node?.t||'').replaceAll('{name}',game.playerName),[node,game.playerName]);
 function enter(k:string){if(!tree)return;const nd=tree.nodes[k];if(nd?.do?.length&&!act(treeId!,k,null)){onClose();return}setKey(k);setShown(0)}
 useEffect(()=>{if(tree)enter(tree.start);else setKey(null)},[treeId]);// eslint-disable-line react-hooks/exhaustive-deps
 useEffect(()=>{if(!node||shown>=text.length)return;const t=setTimeout(()=>setShown(s=>Math.min(text.length,s+2)),16);return()=>clearTimeout(t)},[node,shown,text]);
 if(!tree||!node)return null;
 const typing=shown<text.length;
 const advance=()=>{if(typing){setShown(text.length);return}if(node.end){onClose();return}if(node.next)enter(node.next)};
 const choose=(i:number)=>{const o=node.opts[i];if(o.do?.length&&!act(treeId!,key!,i))return;if(o.next)enter(o.next);else onClose()};
 const speaker=node.s==='player'?{name:game.playerName,art:playerStage(totalLevel(game)).art,id:'player'}:node.s==='narrator'?null:characterById(node.s);
 const portrait=speaker||(tree.who?characterById(tree.who):tree.art?{name:tree.title,art:tree.art,id:'scene'}:null);
 return <Dialog open onOpenChange={o=>{if(!o)onClose()}}><DialogContent className="rs-dialogue" showCloseButton={false} style={{backgroundImage:`url(./assets/${tree.bg})`}}>
  <DialogTitle className="sr-only">{portrait?.name||'Scene'}</DialogTitle><DialogDescription className="sr-only">Conversation</DialogDescription>
  {portrait&&<img key={portrait.art} className={'rs-portrait'+(node.s==='player'?' rs-portrait-player':'')+(node.s==='narrator'?' rs-portrait-dim':'')} src={'./assets/'+portrait.art} alt=""/>}
  <button type="button" className="rs-skip" onClick={onClose} aria-label="Leave conversation">✕</button>
  <div className="rs-chatbox" onClick={node.opts&&!typing?undefined:advance}>
   {speaker&&<p className="rs-speaker">{speaker.name}</p>}
   <p className={'rs-line'+(node.s==='narrator'?' rs-narration':'')}>{text.slice(0,shown)}</p>
   {node.opts&&!typing?<div className="rs-options"><p className="rs-select">Select an Option</p>{node.opts.map((o:any,i:number)=><button key={i} type="button" onClick={e=>{e.stopPropagation();choose(i)}}>{o.t}</button>)}</div>
    :<p className="rs-continue">{typing?'':'Click here to continue'}</p>}
  </div>
 </DialogContent></Dialog>;
}
