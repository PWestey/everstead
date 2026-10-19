import {useEffect,useRef,useState} from 'react';
import {ShieldCheck,HardDrive,Check,Share2} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {AlertDialog,AlertDialogContent,AlertDialogTitle,AlertDialogDescription,AlertDialogCancel,AlertDialogAction} from '@/components/ui/alert-dialog';
import {Dialog,DialogClose,DialogContent,DialogTitle,DialogDescription} from '@/components/ui/dialog';
import GameResources from './game-resources';
import VillageMap from './village-map';
import HabitPanel from './habit-panel';
import FellowsPanel from './fellows-panel';
import FamilyPanel from './family-panel';
import HeroPanel from './hero-panel';
import {BuildingPanel,StagePanel,RoamingPanel,StoryDialog,TodayPanel} from './village-panels';
import {createPersistence} from '@/lib/persistence.mjs';
import {readSaveFile} from '@/lib/save-format.mjs';
import {BUILDINGS,FELLOWS,FAMILY} from '@/lib/cast.mjs';
import {introFor} from '@/lib/stories.mjs';
import {fresh,newJourney,decode,settle,act,totalRate,momentum,playerStage,currentBlight} from '@/lib/game.mjs';
import {totalLevel} from '@/lib/skills.mjs';
import {QuestJournal,DialogueScreen,LevelUpDialog,QuestCompleteScroll} from './rs-ui';

const MODULES:Record<string,{title:string,icon:string}>={
 hero:{title:'Your Hero',icon:'journey'},fellows:{title:'Fellows',icon:'fellows'},family:{title:'Family',icon:'family'},
 stage:{title:'Watchtower',icon:'adventure'},habits:{title:'Habit Journal',icon:'school'},roaming:{title:'Village Gate',icon:'journey'},
 today:{title:'Today',icon:'journey'},building:{title:'Building',icon:'businesses'},quests:{title:'Quest Journal',icon:'journey'}};
const CHARACTER_MODULES=['hero','fellows','family'];

export default function App(){
 const [game,setGame]=useState(()=>fresh()),[loaded,setLoaded]=useState(false),[notice,setNotice]=useState(''),[pulse,setPulse]=useState(0);
 const [saveStatus,setSaveStatus]=useState('Loading save…'),[offline,setOffline]=useState('Preparing offline play…'),[panel,setPanel]=useState(false),[failedLoad,setFailedLoad]=useState(false),[saveFailed,setSaveFailed]=useState(false),[loadError,setLoadError]=useState('');
 const [tab,setTab]=useState('fellows'),[moduleOpen,setModuleOpen]=useState(false),[building,setBuilding]=useState(BUILDINGS[0].id);
 const [fellow,setFellow]=useState(FELLOWS[0].id),[fellowBrowse,setFellowBrowse]=useState(true),[member,setMember]=useState(FAMILY[0].id),[familyBrowse,setFamilyBrowse]=useState(true);
 const [talk,setTalk]=useState<string|null>(null),[ups,setUps]=useState<any[]>([]),[questDone,setQuestDone]=useState<string|null>(null);
 const [arrivals,setArrivals]=useState<any[]>([]),[scene,setScene]=useState<any>(null),[restore,setRestore]=useState<any>(null),[restart,setRestart]=useState(false);
 const storage=useRef(createPersistence(()=>localStorage)),state=useRef(game),ready=useRef(false),timer=useRef<any>(null),file=useRef<HTMLInputElement>(null);
 function tell(message:string){if(!message)return;setNotice(message);clearTimeout(timer.current);timer.current=setTimeout(()=>setNotice(''),4000)}
 function saveFailure(){ready.current=false;setSaveFailed(true);setPanel(true);if(storage.current.current){state.current=storage.current.current;setGame(state.current)}setSaveStatus('Saving paused — no new changes applied')}
 function persist(next:any){try{const saved=storage.current.commit(next);state.current=saved;setGame(saved);setSaveStatus('Saved on this device');return true}catch{saveFailure();return false}}
 function loadSaved(){try{const saved=storage.current.load(Date.now());state.current=saved;setGame(saved);ready.current=true;setSaveFailed(false);setFailedLoad(false);setLoadError('');setSaveStatus('Saved on this device');return true}catch(error:any){setLoadError(String(error?.message||error||''));saveFailure();setFailedLoad(!storage.current.current);return false}}
 useEffect(()=>{loadSaved();setLoaded(true);let lastCheckpoint=Date.now();
  // Income accrues every second on screen; the save is written at most every 30 seconds and on leaving.
  const tick=setInterval(()=>{if(!ready.current)return;const now=Date.now(),next=settle(state.current,now);if(now-lastCheckpoint>=30000){if(persist(next))lastCheckpoint=now}else{state.current=next;setGame(next)}},1000);
  const save=()=>{if(ready.current)persist(settle(state.current,Date.now()))};document.addEventListener('visibilitychange',save);window.addEventListener('pagehide',save);
  return()=>{clearInterval(tick);clearTimeout(timer.current);document.removeEventListener('visibilitychange',save);window.removeEventListener('pagehide',save)}},[]);
 async function cacheGame(){
  if(!('serviceWorker' in navigator)){setOffline('Offline download unavailable in this browser');return}
  setOffline('Downloading for offline play…');
  try{const registration=await navigator.serviceWorker.register('./sw.js',{scope:'./',updateViaCache:'none'});
   const ask=(worker:ServiceWorker)=>new Promise<any>((resolve,reject)=>{const channel=new MessageChannel();const t=setTimeout(()=>reject(Error('timeout')),15000);channel.port1.onmessage=e=>{clearTimeout(t);resolve(e.data)};worker.postMessage({type:'CHECK_OFFLINE'},[channel.port2])});
   for(let i=0;i<300;i++){const pending=registration.installing||registration.waiting,worker=pending||registration.active||navigator.serviceWorker.controller;if(worker){try{const s=await ask(worker);if(s?.ready&&!pending){setOffline('Ready for offline play');return}if(pending&&s?.total)setOffline(`Downloading update · ${Math.min(99,Math.floor(s.files/s.total*100))}%`)}catch{}}await new Promise(r=>setTimeout(r,2000))}
   setOffline('Offline download stalled — tap to retry')}catch{setOffline('Offline download incomplete — tap to retry')}}
 useEffect(()=>{let refreshing=false;const changed=()=>{if(!refreshing){refreshing=true;window.location.reload()}};navigator.serviceWorker?.addEventListener('controllerchange',changed);if(import.meta.env.PROD)cacheGame();else setOffline('Preview · offline download available in the installed build');return()=>navigator.serviceWorker?.removeEventListener('controllerchange',changed)},[]);

 function openModule(id:string){if(id==='village'){setModuleOpen(false);return}if(id==='fellows')setFellowBrowse(true);if(id==='family')setFamilyBrowse(true);setTab(id);setModuleOpen(true)}
 function action(kind:string,target:any=null,value:any=null){if(!ready.current)return false;const before=state.current,result:any=act(before,kind,Date.now(),target,value);if(!persist(result.state))return false;
  if(result.error){tell(result.error);return false}
  tell(result.message);setPulse(p=>p+1);
  if(result.arrivals?.length)setArrivals(result.arrivals);
  if(result.story)setScene(introFor(result.story.slice(6)));
  if(result.scene)setScene(result.scene);
  if(result.recruited){setFellow(result.recruited);setFellowBrowse(false)}
  if(result.welcomed){setMember(result.welcomed);setFamilyBrowse(false)}
  if(result.levelUps?.length)setUps(u=>[...u,...result.levelUps]);
  if(result.questDone)setQuestDone(result.questDone);
  if(result.talk)setTalk(result.talk);
  if(result.newTier)setArrivals([{id:'look',name:'New armour: '+playerStage(totalLevel(result.state)).title,kind:'hero'}]);
  return true}
 function exportSave(){const rescue=failedLoad,stored=rescue?storage.current.raw:null;if(rescue&&stored===null){tell('No saved village was found in this browser');return}
  const blob=new Blob([rescue?stored:JSON.stringify(settle(state.current,Date.now()),null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=rescue?'everstead-recovery.json':'everstead-save.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),30000);tell('Save exported')}
 async function importSave(e:any){const f=e.target.files?.[0];if(!f)return;try{setRestore(decode(await readSaveFile(f)))}catch(err:any){tell(err.message||'Could not read that save.')}finally{e.target.value=''}}

 const locked=!loaded||failedLoad||saveFailed,level=totalLevel(game),stage=playerStage(level),blight=currentBlight(game,game.lastAt);
 const resources=<GameResources gold={game.gold} crystals={game.crystals} income={totalRate(game,game.lastAt)} multiplier={momentum(game,game.lastAt)} onSettings={()=>setPanel(true)} level={level} face={stage.art} onProfile={()=>openModule('hero')}/>;
 const dock=<nav className="village-dock original-primary-dock" aria-label="Everstead destinations">{([['Hero','hero','journey'],['Fellows','fellows','fellows'],['Family','family','family'],['Village','village','businesses'],['Watchtower','stage','adventure'],['Journal','habits','school']] as const).map(([label,id,icon])=>
  <Button key={id} className="village-icon" aria-current={!moduleOpen&&id==='village'?'page':undefined} onClick={()=>openModule(id)}><img src={'./assets/ui/'+icon+'.webp'} alt=""/><span>{label}</span></Button>)}</nav>;
 const due=(game.habits?.items||[]).filter((x:any)=>x.freq==='daily'&&!x.done&&x.days.includes(new Date(game.lastAt).getDay())).length;
 const meta=MODULES[tab]||MODULES.today,title=tab==='building'?BUILDINGS.find(b=>b.id===building)?.name:meta.title;

 return <main className="game">
  {resources}
  <VillageMap game={game} blight={blight} openBuilding={(id:string)=>{setBuilding(id);openModule('building')}} openModule={openModule}
   side={<div className="village-side-buttons">
    <Button className="village-helper village-today" variant="outline" onClick={()=>openModule('today')}><img src="./assets/ui/journey.webp" alt=""/><span>Today</span></Button>
    <Button className="village-helper" variant="outline" onClick={()=>openModule('roaming')}><img src="./assets/ui/journey.webp" alt=""/><span>Roam · {game.roam.charges}</span></Button>
    <Button className="village-helper rs-quest-btn" variant="outline" onClick={()=>openModule('quests')}><img src="./assets/rs/quest.png" alt=""/><span>Quests</span></Button>
   </div>}
   objective={<section className="village-next-step" aria-label="Today"><div><small>{stage.title.toUpperCase()} · TOTAL LEVEL {level}</small><p>{due?`${due} daily habit${due>1?'s':''} left today. Each one strengthens Everstead.`:'Every daily habit is done. Everstead is thriving.'}</p></div><Button disabled={locked} onClick={()=>openModule('habits')}>{due?'Open journal':'Review journal'}</Button></section>}/>
  {dock}
  <Dialog open={moduleOpen} onOpenChange={setModuleOpen}><DialogContent className={'game-modal'+(CHARACTER_MODULES.includes(tab)?' character-modal':'')} showCloseButton={false}>
   {resources}
   <div className="modal-heading"><img src={'./assets/ui/'+meta.icon+'.webp'} alt=""/><div><DialogTitle>{title}</DialogTitle><DialogDescription>{Math.floor(game.gold).toLocaleString()} gold · {game.crystals.toLocaleString()} crystals</DialogDescription></div><DialogClose className="village-close" aria-label="Return to village"><img src="./assets/ui/close.webp" alt=""/></DialogClose></div>
   <div className="modal-body" key={tab}>
    {tab==='hero'&&<HeroPanel game={game} action={action} locked={locked}/>}
    {tab==='fellows'&&<FellowsPanel game={game} action={action} locked={locked} onTalk={setTalk} selected={fellow} setSelected={setFellow} browse={fellowBrowse} setBrowse={setFellowBrowse}/>}
    {tab==='family'&&<FamilyPanel game={game} action={action} locked={locked} selected={member} setSelected={setMember} browse={familyBrowse} setBrowse={setFamilyBrowse}/>}
    {tab==='habits'&&<HabitPanel game={game} action={action} locked={locked} onSaveSettings={()=>setPanel(true)}/>}
    {tab==='stage'&&<StagePanel game={game} action={action} locked={locked}/>}
    {tab==='roaming'&&<RoamingPanel game={game} action={action} locked={locked}/>}
    {tab==='today'&&<TodayPanel game={game} onNavigate={openModule}/>}
    {tab==='quests'&&<QuestJournal game={game} onTalk={setTalk}/>}
    {tab==='building'&&<BuildingPanel game={game} id={building} action={action} locked={locked} onTalk={setTalk} onCharacter={(p:any)=>{if(p.kind==='fellow'){setFellow(p.id);openModule('fellows');setFellowBrowse(false)}else{setMember(p.id);openModule('family');setFamilyBrowse(false)}}}/>}
   </div>
   {!CHARACTER_MODULES.includes(tab)&&dock}
   {notice&&<div className="module-notice" key={pulse} role="status">{notice}</div>}
  </DialogContent></Dialog>

  <Dialog open={!!arrivals.length} onOpenChange={(open:boolean)=>{if(!open)setArrivals([])}}><DialogContent className="arrival-alert">
   <DialogTitle>{arrivals[0]?.kind==='hero'?'You grew stronger':'Someone new is ready to join'}</DialogTitle>
   <DialogDescription>{arrivals[0]?.kind==='hero'?'Your habits have changed you.':'Your habits have caught someone’s eye.'}</DialogDescription>
   <ul>{arrivals.map((a:any)=><li key={a.id}>{a.name}{a.kind==='hero'?'':' · '+(a.kind==='family'?'Family':'Fellow')}</li>)}</ul>
   <Button onClick={()=>{const a=arrivals[0];setArrivals([]);if(a.kind==='hero')openModule('hero');else if(a.kind==='family'){openModule('family');setMember(a.id);setFamilyBrowse(false)}else{openModule('fellows');setFellow(a.id);setFellowBrowse(false)}}}>{arrivals[0]?.kind==='hero'?'See your hero':'Meet '+arrivals[0]?.name}</Button>
   <Button variant="outline" onClick={()=>setArrivals([])}>Later</Button>
  </DialogContent></Dialog>
  <DialogueScreen treeId={talk} game={game} act={(tree,node,opt)=>action('dialogue',tree,{node,opt})} onClose={()=>setTalk(null)}/>
  <LevelUpDialog up={talk?null:ups[0]} onClose={()=>setUps(u=>u.slice(1))}/>
  <QuestCompleteScroll questId={talk||ups.length?null:questDone} onClose={()=>setQuestDone(null)}/>
  <StoryDialog scene={scene} playerName={game.playerName} onClose={()=>setScene(null)}/>

  {(saveFailed||/download (incomplete|interrupted|stalled)/.test(offline))&&<footer><button onClick={()=>setPanel(true)}><ShieldCheck size={14}/>{saveStatus}</button><button onClick={()=>setPanel(true)}>{offline==='Ready for offline play'?<Check size={14}/>:<HardDrive size={14}/>}Offline & saves</button></footer>}
  <Dialog open={panel||failedLoad||saveFailed} onOpenChange={setPanel}><DialogContent className="save-dialog"><DialogTitle>Keep your village</DialogTitle><DialogDescription>Everstead saves on this device. No account or server is used.</DialogDescription>
   <div className="offline-state"><ShieldCheck size={20}/><div><strong>{offline}</strong><p>{saveStatus}</p></div></div>
   {loadError&&<div role="alert" className="load-error"><p><strong>This save was refused: {loadError}</strong></p><p>Your save has not been changed or overwritten.</p></div>}
   {saveFailed&&<div role="alert"><p>Saving is unavailable, so play is paused and the last action was not applied. Export your save first, then retry. If it keeps failing, allow website storage for this site in your browser settings.</p><Button onClick={()=>{if(loadSaved())tell('Saved game recovered.')}}>Retry saved game</Button></div>}
   <Button className="wide" variant="outline" onClick={cacheGame}>Download / check offline files</Button>
   <div className="install-steps"><h3>On your iPhone</h3><ol><li>Open this link in Safari.</li><li>Tap Share <Share2 size={14}/> → Add to Home Screen.</li><li>Open the app online once and wait for “Ready for offline play” here.</li></ol></div>
   <div className="backup-row"><Button onClick={exportSave}>Export save</Button><Button variant="outline" onClick={()=>file.current?.click()}>Restore save</Button><input type="file" accept="application/json,.json" hidden ref={file} onChange={importSave}/><Button variant="outline" disabled={failedLoad} onClick={()=>setRestart(true)}>New journey</Button></div>
   <details className="rules-note"><summary>About Everstead</summary><p>A habit tracker that lives inside a village. Real habits earn gold, XP, sigils and roams; your Fellows, Family and buildings grow from them. Away earnings are capped at 12 hours. Safari and the Home Screen app keep separate saves; export and restore to move progress.</p></details>
  </DialogContent></Dialog>
  <AlertDialog open={restart} onOpenChange={setRestart}><AlertDialogContent><AlertDialogTitle>Start a new journey?</AlertDialogTitle><AlertDialogDescription>Your village, Fellows, Family and progress start over. Your habit journal keeps its tasks, history and settings. Export a copy first if you want one.</AlertDialogDescription><AlertDialogCancel>Cancel</AlertDialogCancel>
   <AlertDialogAction onClick={()=>{try{const saved=storage.current.restore(newJourney(state.current,Date.now()),Date.now());state.current=saved;setGame(saved);ready.current=true;setSaveFailed(false);setFailedLoad(false);setRestart(false);setModuleOpen(false);setPanel(false);tell('New journey started')}catch{saveFailure()}}}>Start over</AlertDialogAction></AlertDialogContent></AlertDialog>
  <AlertDialog open={!!restore} onOpenChange={open=>{if(!open)setRestore(null)}}><AlertDialogContent><AlertDialogTitle>Restore this village?</AlertDialogTitle><AlertDialogDescription>Replace your current save with total level {restore?totalLevel(restore):0} and {Math.floor(restore?.gold||0).toLocaleString()} gold.</AlertDialogDescription><AlertDialogCancel>Cancel</AlertDialogCancel>
   <AlertDialogAction onClick={()=>{try{const saved=storage.current.restore(restore,Date.now());state.current=saved;setGame(saved);ready.current=true;setSaveFailed(false);setFailedLoad(false);setRestore(null);tell('Village restored')}catch{saveFailure()}}}>Restore village</AlertDialogAction></AlertDialogContent></AlertDialog>
  {notice&&!moduleOpen&&<div className="toast" key={pulse} role="status">{notice}</div>}
 </main>;
}
