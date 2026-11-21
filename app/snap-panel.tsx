import {useEffect,useRef,useState} from 'react';
import {createPortal} from 'react-dom';
import {Button} from '@/components/ui/button';
import {Dialog,DialogContent,DialogTitle,DialogDescription} from '@/components/ui/dialog';
import {NativeSelect,NativeSelectOption} from '@/components/ui/native-select';
import {CARDS as CARDS_M,POOL_IDS} from '@/lib/snap/cards.mjs';
import {LOCATIONS as LOCATIONS_M} from '@/lib/snap/locations.mjs';
import {META_DECKS,FUN_DECKS,META_DATE} from '@/lib/snap-decks.mjs';
import {DECK_GUIDES} from '@/lib/snap-guides.mjs';
import * as ENGINE from '@/lib/snap/engine.mjs';
import {AIS as AIS_M} from '@/lib/snap/ai.mjs';
import VERSION from '@/lib/snap/VERSION.json';
import CARD_TIERS from '@/lib/snap-tiers.json';
import '@/lib/snap-house.mjs';
import {snapGold,snapStreakBonus,SNAP_DECK,SNAP_CARDSHARP,SNAP_DECK_NAME,SNAP_STREAK,SNAP_STREAK_MAX} from '@/lib/game.mjs';
import {abbrev} from './original-controls';
import {DecksScreen} from './snap-decks';

const CARDS:any=CARDS_M,LOCATIONS:any=LOCATIONS_M,E:any=ENGINE,AIS:any=AIS_M;
// Built-in decks (lib/snap-decks.mjs): the ladder meta by tier, then the fun shelf, one deck per archetype the meta leaves out.
const BUILT_IN:Record<string,string[]>={...Object.fromEntries(Object.entries(META_DECKS).map(([k,d]:any)=>[k,d.ids])),...Object.fromEntries(Object.entries(FUN_DECKS).map(([k,d]:any)=>['fun:'+k,d.ids]))};
const deckLabel=(k:string,custom:Record<string,string[]>)=>{const m=(META_DECKS as any)[k],f=(FUN_DECKS as any)[k.slice(4)];return custom[k]?'★ '+k:m?`T${m.tier} · ${m.name}`:k.startsWith('fun:')&&f?`Fun · ${f.arch}: ${f.name}`:k};
const ME=0,AI=1;
const TIERS=[['greedy','Greedy (quick)'],['lookahead','Lookahead'],['rollout','Rollout (slow, strongest)'],['random','Random'],['mystery','Mystery: random deck and style']];
const MYSTERY_STYLES=['greedy','lookahead','rollout'];const pick=<T,>(a:T[])=>a[Math.floor(Math.random()*a.length)];
const styleName=(id:string)=>TIERS.find(t=>t[0]===id)?.[1].split(' (')[0]??id;
const ID_BY_NAME:Record<string,string>=Object.fromEntries(Object.entries(CARDS).map(([id,d]:any)=>[d.name,id]));
/** A card that borrowed another card's text (Kang's copies, Magus...) keeps its own art. */
const artId=(card:any)=>card.alias?(ID_BY_NAME[card.alias]??card.id):card.id;

// ---- art: base renders synced by scripts/sync-snap.mjs; without the index every card is a text box ----
let ART:any=null,artLoad:Promise<any>|null=null;
const loadArt=()=>artLoad||(artLoad=fetch('./assets/snap/index.json').then(r=>r.ok?r.json():null).then(a=>(ART=a)).catch(()=>null));
let PICKS:Record<string,number>={};
const artFor=(id:string)=>{const i=ART?.cards?.[id];if(!i)return null;const v=PICKS[id]!=null?(i.variants||[]).find((v:any)=>v.vid===PICKS[id]):null;return {url:'./assets/snap/'+(v?v.file:i.base),artist:v?v.artist:i.artist}};
const cardArt=(card:any)=>artFor(artId(card));
const locArt=(id:string)=>ART?.locations?.[id]?'./assets/snap/'+ART.locations[id].base:null;

// ---- the opponent thinks in a worker; if the browser refuses, it thinks inline ----
let worker:Worker|null=null,seq=0;const pending=new Map<number,{resolve:(r:any)=>void,reject:(e:any)=>void}>();
function think(view:any,p:number,ai:string):Promise<any>{
 const inline=()=>new Promise<any>(res=>setTimeout(()=>res(AIS[ai].choose(view,p)),20));
 try{
  if(!worker){worker=new Worker(new URL('./snap-worker.ts',import.meta.url),{type:'module'});
   worker.onmessage=e=>{const w=pending.get(e.data.id);if(!w)return;pending.delete(e.data.id);e.data.error?w.reject(new Error(e.data.error)):w.resolve(e.data.r)};
   worker.onerror=()=>{for(const w of pending.values())w.reject(new Error('worker'));pending.clear();worker?.terminate();worker=null}}
  const id=++seq;return new Promise((resolve,reject)=>{pending.set(id,{resolve,reject});worker!.postMessage({id,view,p,ai})}).catch(inline);
 }catch{return inline()}}

type Match={state:any,staged:any[],moves:any[],activates:string[],selected:string|null,move:{card:any,from:number}|null,action:string,agatha:boolean,aiPre:any,busy:boolean,note:string,recorded:boolean,ai:string,deckMe:string,deckAi:string,mystery:boolean};
/** The match in progress survives leaving the Parlour and coming back (it lives for the page, not the save). */
let live:Match|null=null,prefs={ai:'lookahead',deckMe:Object.keys(BUILT_IN)[0],deckAi:Object.keys(BUILT_IN)[1]};

const HOLD_MS=350;
const handCard=(m:Match,uid:string)=>m.state.players[ME].hand.find((c:any)=>c.uid===uid);
const stagedCost=(m:Match)=>m.staged.reduce((s:number,pl:any)=>s+E.effCost(m.state,ME,handCard(m,pl.uid)),0);
const energyLeft=(m:Match)=>m.state.players[ME].energy-stagedCost(m);
const addedAt=(m:Match,li:number)=>m.staged.filter((pl:any)=>pl.li===li).length+m.moves.filter((x:any)=>x.to===li).length-m.moves.filter((x:any)=>x.from===li).length;
const seer=(m:Match)=>[...m.state.players[ME].hand,...m.state.players[ME].deck].some((c:any)=>CARDS[c.id].seer);

/** Called at the start of every turn: Agatha Harkness or Ego may play for you; Daredevil may let you see the AI's plays. */
async function beginTurn(m:Match):Promise<Match>{
 let n={...m,agatha:false,aiPre:null,staged:[],moves:[],activates:[],selected:null,move:null,action:'none'};
 if(n.state.over)return n;
 if(E.agathaControls(n.state,ME)||E.egoControls(n.state)){const r=AIS.greedy.choose(E.viewFor(n.state,ME),ME);
  n={...n,staged:r.plays,moves:(r.moves??[]).map((x:any)=>{const from=E.findCard(n.state,ME,x.uid);return {uid:x.uid,card:n.state.locations[from].cards[ME].find((c:any)=>c.uid===x.uid),from,to:x.to}}),activates:r.activates??[],agatha:true}}
 if(E.seesPlays(n.state,ME))n={...n,aiPre:await think(E.viewFor(n.state,AI),AI,n.ai)};
 return n;}

function newMatch(decks:Record<string,string[]>,deckMe:string,deckAi:string,ai:string):Match{
 const state=E.startTurn(E.createGame({decks:[decks[deckMe],decks[deckAi]],seed:Math.floor(Math.random()*1e9)}));
 return {state,staged:[],moves:[],activates:[],selected:null,move:null,action:'none',agatha:false,aiPre:null,busy:false,note:'',recorded:false,ai,deckMe,deckAi,mystery:false}}

/** One card as it looks on the board or in the hand. */
function Card({card,m,owner=ME,staged=false,power=null,cls='',onClick,onPeek}:{card:any,m:Match,owner?:number,staged?:boolean,power?:number|null,cls?:string,onClick?:(e:any)=>void,onPeek?:(c:any,owner:number,power:number|null)=>void}){
 const def=CARDS[card.id],a=cardArt(card),inHand=owner===ME&&!staged&&!!handCard(m,card.uid);
 const cost=inHand?E.effCost(m.state,ME,card):card.cost,pow=power??(inHand?E.handPower(m.state,ME,card):card.power);
 const peek=()=>onPeek?.(card,owner,power);
 // Snap's gesture: tap to play or select, hold to look at the card. A held card swallows the click that follows.
 const hold=useRef<any>(null),held=useRef(false);
 const down=()=>{held.current=false;clearTimeout(hold.current);hold.current=setTimeout(()=>{held.current=true;peek()},HOLD_MS)};
 const up=()=>clearTimeout(hold.current);
 return <div className={'sn-card'+(owner===AI?' sn-opp':'')+(staged?' sn-staged':'')+(card.silenced?' sn-silenced':'')+(card.hiddenUntilEnd?' sn-facedown':'')+(a?' sn-art':'')+(cls?' '+cls:'')} style={a?{backgroundImage:`url("${a.url}")`}:undefined}
  onPointerDown={down} onPointerUp={up} onPointerLeave={up} onPointerCancel={up} onContextMenu={e=>{e.preventDefault();e.stopPropagation();peek()}}
  onClick={e=>{if(held.current){held.current=false;e.stopPropagation();return}if(onClick)onClick(e);else{e.stopPropagation();peek()}}} role="button" tabIndex={0} title={card.hiddenUntilEnd?'Face down until the game ends':(E.cardText(m.state,card)||'No ability')}>
  <span className="sn-cost">{cost}</span><span className="sn-pow">{pow}</span>
  {!a&&<><b className="sn-name">{card.alias??def.name}{card.evil?' ☠':''}{card.zg?' ✦':''}</b><small className="sn-text">{E.cardText(m.state,card)}</small></>}
 </div>;
}

/** A card frame with no match behind it: the builder, the catalogue and the detail views. */
/** "How to play this deck": the plan, the key cards and what to do with them, the curve and a tip (lib/snap-guides.mjs; built-in decks only). */
const guideOf=(deck:string)=>(DECK_GUIDES as any)[deck.replace(/^fun:/,'')]||null;
function GuideBody({guide}:{guide:any}){
 return <>
  <p>{guide.plan}</p>
  <ul>{guide.keys.map(([id,why]:[string,string])=><li key={id}><Frame id={id} cost={CARDS[id].cost} power={CARDS[id].skill?'':CARDS[id].power} cls="sn-guidecard"/><div><b>{CARDS[id].name}</b><span>{why}</span></div></li>)}</ul>
  <p><b>Curve</b> {guide.curve}</p>
  <p><b>Tip</b> {guide.tip}</p>
 </>;
}
function Frame({id,name,cost,power,text,url,cls=''}:{id?:string,name?:string,cost:number,power:number|string,text?:string,url?:string|null,cls?:string}){
 const d=id?CARDS[id]:null,a=url!==undefined?url:(id?artFor(id)?.url??null:null),n=name??d?.name??'';
 return <div className={'sn-card'+(a?' sn-art':'')+(cls?' '+cls:'')} style={a?{backgroundImage:`url("${a}")`}:undefined}>
  <span className="sn-cost">{cost}</span><span className="sn-pow">{power}</span>
  {!a&&<><b className="sn-name">{n}</b><small className="sn-text">{text??d?.text}</small></>}
 </div>;
}
const avatarOf=(ids:string[]|undefined)=>{if(!ids)return null;for(let i=ids.length-1;i>=0;i--){const a=artFor(ids[i]);if(a)return a.url}return null};

export function SnapPanel({game,action,locked}:{game:any,action:any,locked:boolean}){
 const [m,setM]=useState<Match|null>(live),[open,setOpen]=useState(!!live),[,tick]=useState(0),[peek,setPeek]=useState<any>(null),[chooser,setChooser]=useState<any>(null),[builder,setBuilder]=useState(false),[catalog,setCatalog]=useState(false),[retreating,setRetreating]=useState(false),[guideOpen,setGuideOpen]=useState(false);
 PICKS=game.snap?.art||{};
 const [ai,setAi]=useState(prefs.ai),[deckMe,setDeckMe]=useState(prefs.deckMe),[deckAi,setDeckAi]=useState(prefs.deckAi);
 const ref=useRef(m);ref.current=m;
 useEffect(()=>{loadArt().then(()=>tick(t=>t+1))},[]);
 useEffect(()=>{live=m},[m]);useEffect(()=>{prefs={ai,deckMe,deckAi}},[ai,deckMe,deckAi]);
 const custom:Record<string,string[]>=game.snap?.decks||{},decks:Record<string,string[]>={...custom,...BUILT_IN};
 const names=[...Object.keys(custom),...Object.keys(BUILT_IN)];
 const ledger=game.snap||{cubes:0,played:0,won:0,best:0};
 const set=(fn:(m:Match)=>Match)=>{const cur=ref.current;if(!cur)return;const n=fn(cur);ref.current=n;setM(n)};

 async function start(){const mystery=ai==='mystery',oppDeck=mystery?pick(names):deckAi,style=mystery?pick(MYSTERY_STYLES):ai;if(!decks[deckMe]||!decks[oppDeck])return;let n={...newMatch(decks,deckMe,oppDeck,style),mystery};ref.current=n;setM(n);setOpen(true);n=await beginTurn(n);ref.current=n;setM(n);setPeek(null);setRetreating(false)}
 /** Both submissions go to the engine; the AI's comes from the worker (or was made first, under Daredevil). */
 async function endTurn(act='none'){const cur=ref.current;if(!cur||cur.state.over||cur.busy)return;
  set(x=>({...x,busy:true,action:act,note:''}));const s=cur.state,mine={plays:cur.staged,moves:cur.moves.map((x:any)=>({uid:x.uid,to:x.to})),activates:cur.activates};
  let r:any;try{r=cur.aiPre??await think(E.seesPlays(s,AI)?E.viewWithPlays(s,AI,mine):E.viewFor(s,AI),AI,cur.ai)}catch{r=AIS.greedy.choose(E.viewFor(s,AI),AI)}
  const subs=[{...mine,action:act},{plays:r.plays,moves:r.moves??[],activates:r.activates??[],action:r.action}];
  let next:any;try{next=E.resolveTurn(s,subs)}catch(e:any){set(x=>({...x,busy:false,staged:[],moves:[],activates:[],agatha:false,action:'none',note:'That turn could not be resolved: '+e.message}));return}
  next.log.push(`(The opponent rated its chances ${Math.round((r.winProb||0)*100)}%)`);
  let n:Match={...cur,state:next,busy:false};
  if(next.over){const cubes=E.cubesFor(next,ME);n={...n,staged:[],moves:[],activates:[],selected:null,move:null,action:'none',agatha:false,aiPre:null,recorded:true};ref.current=n;setM(n);action('snapResult',null,{cubes})}
  else{n={...n,state:E.startTurn(next)};ref.current=n;setM(n);n=await beginTurn(n);ref.current=n;setM(n)}}
 function stage(uid:string,li:number){const cur=ref.current!,card=handCard(cur,uid),def=CARDS[card.id],targets=def.targets?def.targets(cur.state,ME,li):[];
  if(!targets.length){set(x=>({...x,staged:[...x.staged,{uid,li,target:null}],selected:null}));return}
  setChooser({name:def.name,options:targets.map((t:any)=>({t,label:typeof t==='number'?LOCATIONS[cur.state.locations[t].id].name:CARDS[cur.state.locations[li].cards[ME].find((c:any)=>c.uid===t).id].name})),pick:(t:any)=>{set(x=>({...x,staged:[...x.staged,{uid,li,target:t}],selected:null}));setChooser(null)}})}
 function tapLocation(li:number){const cur=ref.current!;
  if(!cur.selected&&!cur.move){const L=cur.state.locations[li],shown=L.revealed||seer(cur),def=LOCATIONS[L.id];setPeek({loc:true,name:shown?def.name:'Unrevealed',text:shown?def.text:`This location is revealed on turn ${li+1}.`,art:shown?locArt(L.id):null});return}
  if(!playable(cur,li))return;
  if(cur.selected)stage(cur.selected,li);
  else if(cur.move){const moves=[...cur.moves,{uid:cur.move.card.uid,card:cur.move.card,from:cur.move.from,to:li}];
   if(!E.validatePlays(cur.state,ME,[],moves.map((x:any)=>({uid:x.uid,to:x.to})),[]))set(x=>({...x,move:null,note:'Only one card can move from there this turn.'}));else set(x=>({...x,moves,move:null}))}}
 const over=(x:Match)=>x.state.over||x.agatha;
 const playable=(x:Match,li:number)=>{const sel=x.selected?handCard(x,x.selected):null;return !over(x)&&!x.busy&&((sel&&E.canPlayAt(x.state,li,ME,sel))||(x.move&&E.canMove(x.state,ME,x.move.card,x.move.from,li)))&&E.hasRoom(x.state,li,ME,addedAt(x,li))};
 const onPeek=(card:any,owner:number,power:number|null)=>setPeek({card,owner,power});

 const myDeck=decks[deckMe]||[],mySorted=[...myDeck].sort((x,y)=>CARDS[x].cost-CARDS[y].cost||CARDS[x].name.localeCompare(CARDS[y].name)),oppAv=ai==='mystery'?null:avatarOf(decks[deckAi]);
 const guide:any=guideOf(deckMe);
 const rank=ledger.cubes>=SNAP_CARDSHARP?'Cardsharp':ledger.cubes>0?`${ledger.cubes} cubes`:'Open table';
 const lobby=<article className="sn-lobby sn-space">
  <header className="sn-lobby-head"><h2>The Card Parlour</h2><span className="sn-rank">{rank}</span></header>
  <p className="sn-blurb">A quiet table at the back of the Guildhall, cards from every corner of the multiverse. Six turns, three locations, win two. Snap to double the stakes, retreat to cut your losses.</p>
  <div className="sn-stats">
   <span className="sn-orb"><b>{ledger.cubes}</b><small>cubes</small></span>
   <ul className="sn-statlist">
    <li><span>Record</span><b>{ledger.won} won of {ledger.played}{ledger.best?` · best ${ledger.best}`:''}{ledger.played>0&&<> · <button type="button" className="sn-link" disabled={locked} onClick={()=>{if(confirm('Start the record afresh? Wins, losses, best win and streaks go to zero. Decks and card art stay.'))action('snapReset',null,{cubes:confirm(`Also set your cubes (${ledger.cubes}) back to 0? OK resets them too; Cancel keeps them.`)})}}>reset</button></>}</b></li>
    <li><span>Gold per cube</span><b>{abbrev(snapGold(game,1))}{(ledger.streak||0)>0?` · streak ×${snapStreakBonus(game).toFixed(1)}`:''}</b></li>
    <li><span>Win streak</span><b>{ledger.streak||0}{ledger.bestStreak?` · best ${ledger.bestStreak}`:''} · +{Math.round(SNAP_STREAK*100)}% gold a win, up to {SNAP_STREAK_MAX}</b></li>
    <li><span>Cardsharp</span><b><i className="sn-meter"><i style={{width:`${Math.min(100,Math.max(0,ledger.cubes)/SNAP_CARDSHARP*100)}%`}}/></i>{Math.max(0,Math.min(ledger.cubes,SNAP_CARDSHARP))} / {SNAP_CARDSHARP}</b></li>
   </ul>
  </div>
  <div className="sn-top sn-lobby-top">
   <div className="sn-player sn-side-me"><span className="sn-hex"><i style={avatarOf(myDeck)?{backgroundImage:`url("${avatarOf(myDeck)}")`}:undefined}>{avatarOf(myDeck)?'':'Y'}</i></span><div><b>You</b><small>{deckLabel(deckMe,custom)}</small></div></div>
   <span className="sn-vs">VS</span>
   <div className="sn-player sn-side-opp"><div><b>{ai==='mystery'?'Mystery':styleName(ai)}</b><small>{ai==='mystery'?'Random deck and style':deckLabel(deckAi,custom)}</small></div><span className="sn-hex"><i style={oppAv?{backgroundImage:`url("${oppAv}")`}:undefined}>{oppAv?'':'?'}</i></span></div>
  </div>
  <div className="sn-deckrow sn-lobby-deck">{mySorted.map(id=><Frame key={id} id={id} cost={CARDS[id].cost} power={CARDS[id].skill?'':CARDS[id].power} cls="sn-deckcard"/>)}{Array.from({length:Math.max(0,SNAP_DECK-mySorted.length)},(_,i)=><span key={'e'+i} className="sn-slot"/>)}</div>
  {guide&&<details className="sn-guide"><summary>How to play this deck</summary><GuideBody guide={guide}/></details>}
  <div className="sn-picks">
   <label><span>Your deck</span><NativeSelect value={deckMe} onChange={(e:any)=>setDeckMe(e.target.value)}>{names.map(n=><NativeSelectOption key={n} value={n}>{deckLabel(n,custom)}</NativeSelectOption>)}</NativeSelect></label>
   <label><span>Opponent</span><NativeSelect value={ai} onChange={(e:any)=>setAi(e.target.value)}>{TIERS.map(([id,label])=><NativeSelectOption key={id} value={id}>{label}</NativeSelectOption>)}</NativeSelect></label>
   {ai!=='mystery'&&<label><span>Opponent’s deck</span><NativeSelect value={deckAi} onChange={(e:any)=>setDeckAi(e.target.value)}>{names.map(n=><NativeSelectOption key={n} value={n}>{deckLabel(n,custom)}</NativeSelectOption>)}</NativeSelect></label>}
  </div>
  <div className="sn-lobby-acts">
   {m&&!m.state.over&&!open&&<button type="button" className="sn-ribbon sn-ribbon-gold" onClick={()=>setOpen(true)}>Return to the table<small>Turn {m.state.turn} · {m.state.stake} cube{m.state.stake===1?'':'s'} at stake</small></button>}
   <button type="button" className="sn-ribbon sn-ribbon-purple sn-ribbon-play" disabled={locked||!decks[deckMe]} onClick={start}>{m&&!m.state.over?'Start over':'Play'}<small>{m&&!m.state.over?'Forfeit the match in progress':'Sit down at the table'}</small></button>
   <div className="sn-lobby-row"><button type="button" className="sn-ribbon sn-ribbon-blue sn-ribbon-sm" onClick={()=>setBuilder(true)}>Cards</button><button type="button" className="sn-ribbon sn-ribbon-blue sn-ribbon-sm" onClick={()=>setCatalog(true)}>Card art</button></div>
  </div>
  <p className="sn-foot">Cards and rules as of the snap-proto {VERSION.commit} sync ({VERSION.synced}); built-in decks are the Marvel Snap Zone ladder meta of {META_DATE} (T1-T3) and a fun shelf with one deck per archetype the meta leaves out. A match in progress waits here while you walk the village; it is gone when the page closes.</p>
 </article>;

 const catalogDialog=catalog&&<ArtCatalog game={game} action={action} locked={locked} onClose={()=>setCatalog(false)}/>;
 const builderDialog=builder&&<DecksScreen game={game} action={action} locked={locked} custom={custom} builtIn={BUILT_IN} current={deckMe} Frame={Frame} avatarOf={avatarOf} deckLabel={(k:string)=>deckLabel(k,custom)} onPick={setDeckMe} onClose={()=>setBuilder(false)}/>;
 if(!m||!open)return <section className="business-list es-building sn-panel">{lobby}{builderDialog}{catalogDialog}</section>;

 const s=m.state,canSee=seer(m),cubes=s.over?E.cubesFor(s,ME):0,fin=E.finalTurn(s);
 const notes:string[]=[];
 if(!s.over&&s.locations.some((L:any)=>L.cards[ME].some((c:any)=>CARDS[c.id].showsTopDeck&&!c.silenced&&!c.hiddenUntilEnd))){const t=E.topOfDeck(s,ME);notes.push(`Howard the Duck: the top of your deck is ${t?CARDS[t.id].name:'nothing'}.`)}
 if(m.aiPre){const mv=(m.aiPre.moves??[]).length,ac=(m.aiPre.activates??[]).length;notes.push(`Daredevil: the opponent's plays this turn are shown on its side${m.aiPre.plays.length?'':' (it plays no cards)'}${mv?`, plus ${mv} move${mv>1?'s':''}`:''}${ac?`, plus ${ac} Activate`:''}.`)}
 if(!s.over&&E.seesPlays(s,AI))notes.push('The opponent has Daredevil: it sees your plays before making its own.');
 if(m.note)notes.push(m.note);
 const hint=s.over?'':m.busy?'The opponent is thinking…':m.agatha?(E.egoControls(s)?'Ego':'Agatha Harkness')+' controls your cards this turn. You can still Snap or Retreat, then end the turn.':m.selected||m.move?'Now tap a location.':'Tap a card, then a location. Hold a card, or tap a location, to read it. Outlined cards can move; tap a staged card to take it back.';
 const retreatCost=s.finalDoubled&&s.turn>=fin?s.stake/2:s.stake;

 // The match takes the whole screen (a portal, so the module dialog's transform cannot pin it): the board gets every pixel a phone has.
 return createPortal(<div className="sn-full sn-space" role="dialog" aria-label="The Card Parlour table">
  <button type="button" className="sn-leave" onClick={()=>setOpen(false)}>{s.over?'Back to the table':'Leave the table'}</button>
  {guideOf(m.deckMe)&&<button type="button" className="sn-leave sn-guidebtn" aria-expanded={guideOpen} onClick={()=>setGuideOpen(o=>!o)}>{guideOpen?'Close guide':'Deck guide'}</button>}
  <div className="sn-top">
   <div className="sn-player sn-side-me"><span className="sn-hex"><i style={avatarOf(decks[m.deckMe])?{backgroundImage:`url("${avatarOf(decks[m.deckMe])}")`}:undefined}>{avatarOf(decks[m.deckMe])?'':'You'}</i></span><div><b>You</b><small>{deckLabel(m.deckMe,custom)} · {energyLeft(m)} / {s.players[ME].energy} energy</small></div></div>
   {/* Snap's cube: the stake, and tapping it is how you snap */}
   <button type="button" className={'sn-cube'+(m.action==='snap'?' sn-cube-snap':'')} disabled={s.over||m.busy||s.snapped[ME]||m.action==='retreat'} onClick={()=>set(x=>({...x,action:x.action==='snap'?'none':'snap'}))} title="Tap to snap: the stake doubles">
    <b>{s.stake}</b><small>{s.over?'cubes':m.action==='snap'?'Snapping…':s.snapped[ME]?'You snapped':s.snapped[AI]?'They snapped':'Tap to snap'}</small></button>
   <div className="sn-player sn-side-opp"><div><b>{m.mystery&&!s.over?'Mystery':styleName(m.ai)}</b><small>{m.mystery&&!s.over?'?':deckLabel(m.deckAi,custom)} · hand {s.players[AI].hand.length} · deck {s.players[AI].deck.length}</small></div><span className="sn-hex"><i style={!(m.mystery&&!s.over)&&avatarOf(decks[m.deckAi])?{backgroundImage:`url("${avatarOf(decks[m.deckAi])}")`}:undefined}>{!(m.mystery&&!s.over)&&avatarOf(decks[m.deckAi])?'':'?'}</i></span></div>
  </div>
  {/* Laid out like Snap's table: the opponent's cards above, the three locations in a band across the middle with both power counts on them, your cards below. */}
  <div className="sn-board">
   <div className="sn-zone sn-zone-opp">{s.locations.map((L:any,li:number)=><div key={li} className="sn-cell" onClick={()=>tapLocation(li)}>
     {L.cards[AI].map((c:any)=><Card key={c.uid} card={c} m={m} owner={AI} power={E.cardPower(s,li,AI,c)} onPeek={onPeek}/>)}
     {m.aiPre&&m.aiPre.plays.filter((pl:any)=>pl.li===li).map((pl:any)=>{const c=s.players[AI].hand.find((c:any)=>c.uid===pl.uid);return c?<Card key={c.uid} card={c} m={m} owner={AI} staged onPeek={onPeek}/>:null})}
    </div>)}</div>
   <div className="sn-locs">{s.locations.map((L:any,li:number)=>{const def=LOCATIONS[L.id],shown=L.revealed||canSee,la=shown?locArt(L.id):null,w=E.winnerAt(s,li),can=playable(m,li),name=shown?def.name:'Unrevealed';
    return <div key={li} className={'sn-loc'+(can?' sn-playable':'')+(L.revealed&&!E.canPlayAt(s,li,ME)?' sn-closed':'')} onClick={()=>tapLocation(li)}>
     <span className={'sn-pw sn-them'+(w===AI?' sn-winning':'')}>{E.locPower(s,li,AI)}</span>
     <div className="sn-plaque">
      <b className="sn-locname">{name}</b>
      <div className={'sn-locimg'+(la?'':' sn-locblank')} style={la?{backgroundImage:`url("${la}")`}:undefined}>{!la&&<b>{shown?'':'?'}</b>}</div>
      <p className="sn-loctext">{shown?def.text:`Revealed on turn ${li+1}`}</p>
     </div>
     <span className={'sn-pw sn-me'+(w===ME?' sn-winning':'')}>{E.locPower(s,li,ME)}</span>
    </div>})}</div>
   <div className="sn-zone sn-zone-me">{s.locations.map((L:any,li:number)=><div key={li} className={'sn-cell'+(playable(m,li)?' sn-playable':'')} onClick={()=>tapLocation(li)}>
     {L.cards[ME].filter((c:any)=>!m.moves.some((x:any)=>x.uid===c.uid)).map((c:any)=>{const movable=!over(m)&&!m.busy&&[0,1,2].some(to=>E.canMove(s,ME,c,li,to)),activatable=!over(m)&&!m.busy&&E.canActivate(s,ME,c);
       return <Card key={c.uid} card={c} m={m} power={E.cardPower(s,li,ME,c)} cls={(movable||activatable?'sn-movable':'')+(m.move?.card.uid===c.uid?' sn-selected':'')+(m.activates.includes(c.uid)?' sn-activating':'')}
        onClick={(e:any)=>{e.stopPropagation();if(activatable)set(x=>({...x,activates:x.activates.includes(c.uid)?x.activates.filter(u=>u!==c.uid):[...x.activates,c.uid]}));else if(movable)set(x=>({...x,selected:null,move:x.move?.card.uid===c.uid?null:{card:c,from:li}}))}} onPeek={onPeek}/>})}
     {m.moves.filter((x:any)=>x.to===li).map((x:any)=><Card key={'mv'+x.uid} card={x.card} m={m} staged onClick={(e:any)=>{e.stopPropagation();if(!m.agatha)set(y=>({...y,moves:y.moves.filter(z=>z!==x)}))}} onPeek={onPeek}/>)}
     {m.staged.filter((pl:any)=>pl.li===li).map((pl:any)=><Card key={'st'+pl.uid} card={handCard(m,pl.uid)} m={m} staged onClick={(e:any)=>{e.stopPropagation();if(!m.agatha)set(y=>({...y,staged:y.staged.filter(z=>z!==pl)}))}} onPeek={onPeek}/>)}
    </div>)}</div>
  </div>
  <div className="sn-hand">{s.players[ME].hand.filter((c:any)=>!m.staged.some((pl:any)=>pl.uid===c.uid)).map((c:any)=>{const ok=E.effCost(s,ME,c)<=energyLeft(m)&&!over(m)&&!m.busy&&[0,1,2].some(li=>E.canPlayAt(s,li,ME,c));
   return <Card key={c.uid} card={c} m={m} cls={(ok?'':'sn-unaffordable')+(m.selected===c.uid?' sn-selected':'')} onClick={()=>{if(ok)set(x=>({...x,move:null,selected:x.selected===c.uid?null:c.uid}))}} onPeek={onPeek}/>})}</div>
  {/* the deck's guide, readable mid-match: tap the backdrop or the button to close */}
  {guideOpen&&guideOf(m.deckMe)&&<div className="sn-popup" onClick={()=>setGuideOpen(false)}><div className="sn-guide sn-guide-table" onClick={e=>e.stopPropagation()}><p className="sn-guide-title">How to play {deckLabel(m.deckMe,custom)}</p><GuideBody guide={guideOf(m.deckMe)}/><small>Tap outside to close</small></div></div>}
  {peek&&<div className="sn-popup" onClick={()=>setPeek(null)} onContextMenu={e=>{e.preventDefault();setPeek(null)}}>
   {peek.loc?<div className="sn-peek"><div className={'sn-peek-img sn-peek-loc'+(peek.art?'':' sn-locblank')} style={peek.art?{backgroundImage:`url("${peek.art}")`}:undefined}>{!peek.art&&<b>{peek.name}</b>}</div><div><b>{peek.name}</b><p>{peek.text}</p><small>Tap anywhere to close</small></div></div>
   :<div className="sn-peek"><div className={'sn-peek-img'+(cardArt(peek.card)?'':' sn-locblank')} style={cardArt(peek.card)?{backgroundImage:`url("${cardArt(peek.card)!.url}")`}:undefined}><span className="sn-cost">{peek.card.cost}</span><span className="sn-pow">{peek.power??peek.card.power}</span>{!cardArt(peek.card)&&<b>{peek.card.alias??CARDS[peek.card.id].name}</b>}</div><div><b>{peek.card.alias??CARDS[peek.card.id].name} · {peek.card.cost} / {peek.power??peek.card.power}</b><p>{(E.cardText(s,peek.card)||'No ability')+(peek.card.evil?' EVIL (Sinister Six).':'')+(peek.card.zg?' Marked by Zombie Galacti.':'')}</p><small>{cardArt(peek.card)?.artist?'Art: '+cardArt(peek.card)!.artist+' · ':''}{CARDS[peek.card.id].house?'House rule: +'+CARDS[peek.card.id].house+' Power · ':''}Tap anywhere to close</small></div></div>}
  </div>}
  {s.over&&<div className={'sn-banner'+(cubes>0?' sn-win':cubes<0?' sn-lose':'')}>{cubes>0?`You win ${cubes} cube${cubes===1?'':'s'}!${(ledger.streak||0)>1?` ${ledger.streak} in a row.`:''}`:cubes<0?`You lose ${-cubes} cube${cubes===-1?'':'s'} (${s.result.reason}).`:'A draw.'}{m.mystery&&<small> The opponent played {deckLabel(m.deckAi,custom)} in the {styleName(m.ai)} style.</small>}</div>}
  <p className="sn-hint">{[hint,...notes].join(' ')}</p>
  <div className="sn-bottom">
   {s.over?<><button type="button" className="sn-ribbon sn-ribbon-red" onClick={()=>{live=null;setM(null);setOpen(false)}}>Back</button><span className="sn-orb"><b>{cubes>0?'+'+cubes:cubes}</b><small>cubes</small></span><button type="button" className="sn-ribbon sn-ribbon-purple" disabled={locked} onClick={start}>Play again</button></>
   :<>
    {retreating?<span className="sn-retreating"><button type="button" className="sn-ribbon sn-ribbon-red sn-ribbon-sm" onClick={()=>{setRetreating(false);endTurn('retreat')}}>Lose {retreatCost}</button><button type="button" className="sn-ribbon sn-ribbon-blue sn-ribbon-sm" onClick={()=>setRetreating(false)}>Stay</button></span>
    :<button type="button" className="sn-ribbon sn-ribbon-red" disabled={m.busy||m.action!=='none'} onClick={()=>setRetreating(true)}>Retreat</button>}
    <span className="sn-orb" title="Energy left this turn"><b>{energyLeft(m)}</b><small>energy</small></span>
    <button type="button" className="sn-ribbon sn-ribbon-purple" disabled={m.busy} onClick={()=>endTurn(m.action)}>{m.busy?'Thinking…':s.turn>=fin?'Final turn':'End turn'}<small>{s.turn} / {fin}</small></button>
   </>}
  </div>
  <details className="sn-log"><summary>Match log</summary><pre>{s.log.slice(-30).join('\n')}</pre></details>
  {chooser&&<Dialog open onOpenChange={o=>{if(!o)setChooser(null)}}><DialogContent className="breakdown-dialog"><DialogTitle>{chooser.name}: choose a target</DialogTitle><DialogDescription className="sr-only">Pick where the card acts.</DialogDescription>
   <div className="sn-chooser">{chooser.options.map((o:any,i:number)=><Button key={i} variant="outline" onClick={()=>chooser.pick(o.t)}>{o.label}</Button>)}<Button variant="outline" onClick={()=>setChooser(null)}>Cancel</Button></div></DialogContent></Dialog>}
  {builderDialog}
 </div>,document.body);
}

/** Every card with variants; a tap picks the art the table, the hand and the builder use. Thumbnails load only for the card that is open. */
function ArtCatalog({game,action,locked,onClose}:{game:any,action:any,locked:boolean,onClose:()=>void}){
 const [q,setQ]=useState(''),[sel,setSel]=useState<string|null>(null);
 const picks:Record<string,number>=game.snap?.art||{};const term=q.trim().toLowerCase();
 const ids=(POOL_IDS as string[]).filter(id=>!CARDS[id].token&&ART?.cards?.[id]?.variants?.length).sort((a,b)=>CARDS[a].name.localeCompare(CARDS[b].name)).filter(id=>!term||CARDS[id].name.toLowerCase().includes(term));
 const info=sel&&ART?ART.cards[sel]:null;
 return <Dialog open onOpenChange={o=>{if(!o)onClose()}}><DialogContent className="breakdown-dialog sn-builder sn-space"><DialogTitle>{sel?CARDS[sel].name:'Card art'}</DialogTitle>
  <DialogDescription>{sel?'Tap the art you want on the table. The first is the original.':ART?`${ids.length} cards have variants. ${Object.keys(picks).length} chosen.`:'The art index has not loaded yet.'}</DialogDescription>
  {sel&&info?<>
   <div className="sn-variants">
    <button type="button" className={'sn-variant'+(picks[sel]==null?' sn-on':'')} onClick={()=>{if(action('snapArt',sel,null))setSel(sel)}} disabled={locked}><i style={{backgroundImage:`url("./assets/snap/${info.base}")`}}/><span>Original<br/><small>{info.artist}</small></span></button>
    {info.variants.map((v:any)=><button type="button" key={v.vid} className={'sn-variant'+(picks[sel]===v.vid?' sn-on':'')} onClick={()=>action('snapArt',sel,v.vid)} disabled={locked}><i style={{backgroundImage:`url("./assets/snap/${v.file}")`}}/><span>{v.rarity||'Variant'}<br/><small>{v.artist}</small></span></button>)}
   </div>
   <div className="sn-bar"><Button variant="outline" onClick={()=>setSel(null)}>All cards</Button><Button variant="outline" onClick={onClose}>Close</Button></div>
  </>:<>
   <div className="sn-bar"><input value={q} placeholder="Search by name" onChange={e=>setQ(e.target.value)}/></div>
   <div className="sn-pool sn-artpool">{ids.map(id=>{const a=artFor(id)!,n=ART.cards[id].variants.length;return <button type="button" key={id} className={'sn-pick sn-artpick'+(picks[id]!=null?' sn-on':'')} onClick={()=>setSel(id)}><i className="sn-thumb" style={{backgroundImage:`url("${a.url}")`}}/><span>{CARDS[id].name}<br/><small>{n} variant{n===1?'':'s'}{picks[id]!=null?' · chosen':''}</small></span></button>})}</div>
   <div className="sn-bar"><Button variant="outline" onClick={onClose}>Close</Button></div>
  </>}
 </DialogContent></Dialog>;
}

