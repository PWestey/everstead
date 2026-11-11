import {useEffect,useRef,useState} from 'react';
import {Button} from '@/components/ui/button';
import {Dialog,DialogContent,DialogTitle,DialogDescription} from '@/components/ui/dialog';
import {NativeSelect,NativeSelectOption} from '@/components/ui/native-select';
import {CARDS as CARDS_M,POOL_IDS} from '@/lib/snap/cards.mjs';
import {LOCATIONS as LOCATIONS_M} from '@/lib/snap/locations.mjs';
import {DECKS as BUILT_IN_M} from '@/lib/snap/decks.mjs';
import * as ENGINE from '@/lib/snap/engine.mjs';
import {AIS as AIS_M} from '@/lib/snap/ai.mjs';
import VERSION from '@/lib/snap/VERSION.json';
import CARD_TIERS from '@/lib/snap-tiers.json';
import '@/lib/snap-house.mjs';
import {snapGold,SNAP_DECK,SNAP_CARDSHARP,SNAP_DECK_NAME} from '@/lib/game.mjs';
import {abbrev} from './original-controls';

const CARDS:any=CARDS_M,LOCATIONS:any=LOCATIONS_M,BUILT_IN:any=BUILT_IN_M,E:any=ENGINE,AIS:any=AIS_M;
const ME=0,AI=1;
const TIERS=[['greedy','Greedy (quick)'],['lookahead','Lookahead'],['rollout','Rollout (slow, strongest)'],['random','Random']];
const ID_BY_NAME:Record<string,string>=Object.fromEntries(Object.entries(CARDS).map(([id,d]:any)=>[d.name,id]));
/** A card that borrowed another card's text (Kang's copies, Magus...) keeps its own art. */
const artId=(card:any)=>card.alias?(ID_BY_NAME[card.alias]??card.id):card.id;

// ---- art: base renders synced by scripts/sync-snap.mjs; without the index every card is a text box ----
let ART:any=null,artLoad:Promise<any>|null=null;
const loadArt=()=>artLoad||(artLoad=fetch('./assets/snap/index.json').then(r=>r.ok?r.json():null).then(a=>(ART=a)).catch(()=>null));
const cardArt=(card:any)=>{const i=ART?.cards?.[artId(card)];return i?{url:'./assets/snap/'+i.base,artist:i.artist}:null};
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

type Match={state:any,staged:any[],moves:any[],activates:string[],selected:string|null,move:{card:any,from:number}|null,action:string,agatha:boolean,aiPre:any,busy:boolean,note:string,recorded:boolean,ai:string,deckMe:string,deckAi:string};
/** The match in progress survives leaving the Parlour and coming back (it lives for the page, not the save). */
let live:Match|null=null,prefs={ai:'lookahead',deckMe:Object.keys(BUILT_IN)[0],deckAi:Object.keys(BUILT_IN)[1]};

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
 return {state,staged:[],moves:[],activates:[],selected:null,move:null,action:'none',agatha:false,aiPre:null,busy:false,note:'',recorded:false,ai,deckMe,deckAi}}

/** One card as it looks on the board or in the hand. */
function Card({card,m,owner=ME,staged=false,power=null,cls='',onClick,onPeek}:{card:any,m:Match,owner?:number,staged?:boolean,power?:number|null,cls?:string,onClick?:(e:any)=>void,onPeek?:(c:any,owner:number,power:number|null)=>void}){
 const def=CARDS[card.id],a=cardArt(card),inHand=owner===ME&&!staged&&!!handCard(m,card.uid);
 const cost=inHand?E.effCost(m.state,ME,card):card.cost,pow=power??(inHand?E.handPower(m.state,ME,card):card.power);
 const peek=()=>onPeek?.(card,owner,power);
 return <div className={'sn-card'+(owner===AI?' sn-opp':'')+(staged?' sn-staged':'')+(card.silenced?' sn-silenced':'')+(card.hiddenUntilEnd?' sn-facedown':'')+(a?' sn-art':'')+(cls?' '+cls:'')} style={a?{backgroundImage:`url("${a.url}")`}:undefined}
  onClick={e=>{peek();onClick?.(e)}} onMouseEnter={peek} role="button" tabIndex={0} title={card.hiddenUntilEnd?'Face down until the game ends':(E.cardText(m.state,card)||'No ability')}>
  <span className="sn-cost">{cost}</span><span className="sn-pow">{pow}</span>
  {!a&&<><b className="sn-name">{card.alias??def.name}{card.evil?' ☠':''}{card.zg?' ✦':''}</b><small className="sn-text">{E.cardText(m.state,card)}</small></>}
 </div>;
}

export function SnapPanel({game,action,locked}:{game:any,action:any,locked:boolean}){
 const [m,setM]=useState<Match|null>(live),[,tick]=useState(0),[peek,setPeek]=useState<any>(null),[chooser,setChooser]=useState<any>(null),[builder,setBuilder]=useState(false),[retreating,setRetreating]=useState(false);
 const [ai,setAi]=useState(prefs.ai),[deckMe,setDeckMe]=useState(prefs.deckMe),[deckAi,setDeckAi]=useState(prefs.deckAi);
 const ref=useRef(m);ref.current=m;
 useEffect(()=>{loadArt().then(()=>tick(t=>t+1))},[]);
 useEffect(()=>{live=m},[m]);useEffect(()=>{prefs={ai,deckMe,deckAi}},[ai,deckMe,deckAi]);
 const custom:Record<string,string[]>=game.snap?.decks||{},decks:Record<string,string[]>={...custom,...BUILT_IN};
 const names=[...Object.keys(custom),...Object.keys(BUILT_IN)];
 const ledger=game.snap||{cubes:0,played:0,won:0,best:0};
 const set=(fn:(m:Match)=>Match)=>{const cur=ref.current;if(!cur)return;const n=fn(cur);ref.current=n;setM(n)};

 async function start(){if(!decks[deckMe]||!decks[deckAi])return;let n=newMatch(decks,deckMe,deckAi,ai);ref.current=n;setM(n);n=await beginTurn(n);ref.current=n;setM(n);setPeek(null);setRetreating(false)}
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
 function tapLocation(li:number){const cur=ref.current!;if(!playable(cur,li))return;
  if(cur.selected)stage(cur.selected,li);
  else if(cur.move){const moves=[...cur.moves,{uid:cur.move.card.uid,card:cur.move.card,from:cur.move.from,to:li}];
   if(!E.validatePlays(cur.state,ME,[],moves.map((x:any)=>({uid:x.uid,to:x.to})),[]))set(x=>({...x,move:null,note:'Only one card can move from there this turn.'}));else set(x=>({...x,moves,move:null}))}}
 const over=(x:Match)=>x.state.over||x.agatha;
 const playable=(x:Match,li:number)=>{const sel=x.selected?handCard(x,x.selected):null;return !over(x)&&!x.busy&&((sel&&E.canPlayAt(x.state,li,ME,sel))||(x.move&&E.canMove(x.state,ME,x.move.card,x.move.from,li)))&&E.hasRoom(x.state,li,ME,addedAt(x,li))};
 const onPeek=(card:any,owner:number,power:number|null)=>setPeek({card,owner,power});

 const lobby=<article className="business-card sn-lobby">
  <div className="identity"><h2>The Card Parlour</h2><span className="level">{ledger.cubes>=SNAP_CARDSHARP?'Cardsharp':ledger.played?`${ledger.cubes} cubes`:'Open'}</span></div>
  <p>A quiet table at the back of the Guildhall, cards from every corner of the multiverse. Six turns, three locations, win two. Snap to double the stakes, retreat to cut your losses.</p>
  <ul className="es-modifiers">
   <li><span>Cubes won</span><b>{ledger.cubes}</b></li>
   <li><span>Matches</span><b>{ledger.won} won of {ledger.played}{ledger.best?` · best ${ledger.best} cubes`:''}</b></li>
   <li><span>Gold per cube won</span><b>{abbrev(snapGold(game,1))}</b></li>
   <li><span>Cardsharp title</span><b>{Math.min(ledger.cubes,SNAP_CARDSHARP)} / {SNAP_CARDSHARP}</b></li>
  </ul>
  <div className="sn-picks">
   <label><span>Your deck</span><NativeSelect value={deckMe} onChange={(e:any)=>setDeckMe(e.target.value)}>{names.map(n=><NativeSelectOption key={n} value={n}>{custom[n]?'★ '+n:n}</NativeSelectOption>)}</NativeSelect></label>
   <label><span>Opponent’s deck</span><NativeSelect value={deckAi} onChange={(e:any)=>setDeckAi(e.target.value)}>{names.map(n=><NativeSelectOption key={n} value={n}>{custom[n]?'★ '+n:n}</NativeSelectOption>)}</NativeSelect></label>
   <label><span>Opponent</span><NativeSelect value={ai} onChange={(e:any)=>setAi(e.target.value)}>{TIERS.map(([id,label])=><NativeSelectOption key={id} value={id}>{label}</NativeSelectOption>)}</NativeSelect></label>
  </div>
  <div className="business-actions sn-acts"><Button disabled={locked} onClick={start}>{m&&!m.state.over?'Start over':m?'Play again':'Sit down'}</Button><Button variant="outline" onClick={()=>setBuilder(true)}>Build a deck</Button></div>
  <p className="small-note">Cards and rules as of the snap-proto {VERSION.commit} sync ({VERSION.synced}). A match in progress waits here while you walk the village; it is gone when the page closes.</p>
 </article>;

 if(!m)return <section className="business-list es-building sn-panel">{lobby}{builder&&<DeckBuilder game={game} action={action} locked={locked} start={decks[deckMe]||[]} startName={custom[deckMe]?deckMe:''} onClose={()=>setBuilder(false)} onSaved={(n:string)=>{setDeckMe(n);setBuilder(false)}}/>}</section>;

 const s=m.state,canSee=seer(m),cubes=s.over?E.cubesFor(s,ME):0,fin=E.finalTurn(s);
 const notes:string[]=[];
 if(!s.over&&s.locations.some((L:any)=>L.cards[ME].some((c:any)=>CARDS[c.id].showsTopDeck&&!c.silenced&&!c.hiddenUntilEnd))){const t=E.topOfDeck(s,ME);notes.push(`Howard the Duck: the top of your deck is ${t?CARDS[t.id].name:'nothing'}.`)}
 if(m.aiPre){const mv=(m.aiPre.moves??[]).length,ac=(m.aiPre.activates??[]).length;notes.push(`Daredevil: the opponent's plays this turn are shown on its side${m.aiPre.plays.length?'':' (it plays no cards)'}${mv?`, plus ${mv} move${mv>1?'s':''}`:''}${ac?`, plus ${ac} Activate`:''}.`)}
 if(!s.over&&E.seesPlays(s,AI))notes.push('The opponent has Daredevil: it sees your plays before making its own.');
 if(m.note)notes.push(m.note);
 const hint=s.over?'':m.busy?'The opponent is thinking…':m.agatha?(E.egoControls(s)?'Ego':'Agatha Harkness')+' controls your cards this turn. You can still Snap or Retreat, then end the turn.':m.selected||m.move?'Now tap a location.':'Tap a card, then a location. Outlined cards on the board can move. Tap a staged card to take it back.';
 const retreatCost=s.finalDoubled&&s.turn>=fin?s.stake/2:s.stake;

 return <section className="business-list es-building sn-panel">
  <div className="sn-stats">
   <span><small>Turn</small><b>{s.turn} / {fin}</b></span><span><small>Energy</small><b>{energyLeft(m)} / {s.players[ME].energy}</b></span>
   <span><small>Stake</small><b>{s.stake}{s.snapped[ME]?' ·you':''}{s.snapped[AI]?' ·them':''}</b></span><span><small>Their hand / deck</small><b>{s.players[AI].hand.length} / {s.players[AI].deck.length}</b></span>
  </div>
  <div className="sn-board">
   {s.locations.map((L:any,li:number)=>{const def=LOCATIONS[L.id],shown=L.revealed||canSee,la=shown?locArt(L.id):null,w=E.winnerAt(s,li),can=playable(m,li);
    return <div key={li} className={'sn-loc'+(can?' sn-playable':'')+(L.revealed&&!E.canPlayAt(s,li,ME)?' sn-closed':'')} onClick={()=>tapLocation(li)}>
     {la?<div className="sn-locimg" style={{backgroundImage:`url("${la}")`}} title={def.name}/>:<h3>{shown?def.name:'Unrevealed'}</h3>}
     <p className="sn-loctext">{shown?def.text:`Revealed on turn ${li+1}`}</p>
     <div className="sn-row">{L.cards[AI].map((c:any)=><Card key={c.uid} card={c} m={m} owner={AI} power={E.cardPower(s,li,AI,c)} onPeek={onPeek}/>)}
      {m.aiPre&&m.aiPre.plays.filter((pl:any)=>pl.li===li).map((pl:any)=>{const c=s.players[AI].hand.find((c:any)=>c.uid===pl.uid);return c?<Card key={c.uid} card={c} m={m} owner={AI} staged onPeek={onPeek}/>:null})}</div>
     <div className="sn-total"><span className={'sn-them'+(w===AI?' sn-winning':'')}>{E.locPower(s,li,AI)}</span><span className={'sn-me'+(w===ME?' sn-winning':'')}>{E.locPower(s,li,ME)}</span></div>
     <div className="sn-row">{L.cards[ME].filter((c:any)=>!m.moves.some((x:any)=>x.uid===c.uid)).map((c:any)=>{const movable=!over(m)&&!m.busy&&[0,1,2].some(to=>E.canMove(s,ME,c,li,to)),activatable=!over(m)&&!m.busy&&E.canActivate(s,ME,c);
       return <Card key={c.uid} card={c} m={m} power={E.cardPower(s,li,ME,c)} cls={(movable||activatable?'sn-movable':'')+(m.move?.card.uid===c.uid?' sn-selected':'')+(m.activates.includes(c.uid)?' sn-activating':'')}
        onClick={(e:any)=>{e.stopPropagation();if(activatable)set(x=>({...x,activates:x.activates.includes(c.uid)?x.activates.filter(u=>u!==c.uid):[...x.activates,c.uid]}));else if(movable)set(x=>({...x,selected:null,move:x.move?.card.uid===c.uid?null:{card:c,from:li}}))}} onPeek={onPeek}/>})}
      {m.moves.filter((x:any)=>x.to===li).map((x:any)=><Card key={'mv'+x.uid} card={x.card} m={m} staged onClick={(e:any)=>{e.stopPropagation();if(!m.agatha)set(y=>({...y,moves:y.moves.filter(z=>z!==x)}))}} onPeek={onPeek}/>)}
      {m.staged.filter((pl:any)=>pl.li===li).map((pl:any)=><Card key={'st'+pl.uid} card={handCard(m,pl.uid)} m={m} staged onClick={(e:any)=>{e.stopPropagation();if(!m.agatha)set(y=>({...y,staged:y.staged.filter(z=>z!==pl)}))}} onPeek={onPeek}/>)}</div>
    </div>})}
  </div>
  <div className="sn-hand">{s.players[ME].hand.filter((c:any)=>!m.staged.some((pl:any)=>pl.uid===c.uid)).map((c:any)=>{const ok=E.effCost(s,ME,c)<=energyLeft(m)&&!over(m)&&!m.busy&&[0,1,2].some(li=>E.canPlayAt(s,li,ME,c));
   return <Card key={c.uid} card={c} m={m} cls={(ok?'':'sn-unaffordable')+(m.selected===c.uid?' sn-selected':'')} onClick={()=>{if(ok)set(x=>({...x,move:null,selected:x.selected===c.uid?null:c.uid}))}} onPeek={onPeek}/>})}</div>
  {peek&&<div className="sn-peek">{cardArt(peek.card)&&<div className="sn-peek-img" style={{backgroundImage:`url("${cardArt(peek.card)!.url}")`}}/>}<div><b>{peek.card.alias??CARDS[peek.card.id].name} · {peek.card.cost} / {peek.power??peek.card.power}</b><p>{(E.cardText(s,peek.card)||'No ability')+(peek.card.evil?' EVIL (Sinister Six).':'')+(peek.card.zg?' Marked by Zombie Galacti.':'')}</p>{(cardArt(peek.card)?.artist||CARDS[peek.card.id].house)&&<small>{cardArt(peek.card)?.artist?'Art: '+cardArt(peek.card)!.artist:''}{CARDS[peek.card.id].house?(cardArt(peek.card)?.artist?' · ':'')+'House rule: +'+CARDS[peek.card.id].house+' Power':''}</small>}</div></div>}
  {s.over&&<div className={'sn-banner'+(cubes>0?' sn-win':cubes<0?' sn-lose':'')}>{cubes>0?`You win ${cubes} cube${cubes===1?'':'s'}! +${abbrev(snapGold(game,cubes))} gold`:cubes<0?`You lose ${-cubes} cube${cubes===-1?'':'s'} (${s.result.reason}).`:'A draw.'}</div>}
  <p className="small-note sn-hint">{[hint,...notes].join(' ')}</p>
  <div className="business-actions sn-acts">
   {s.over?<><Button disabled={locked} onClick={start}>Play again</Button><Button variant="outline" onClick={()=>{live=null;setM(null)}}>Back to the table</Button></>
   :<>
    <Button disabled={m.busy||s.snapped[ME]||m.action!=='none'} variant="outline" className="sn-snap" onClick={()=>set(x=>({...x,action:'snap'}))}>{m.action==='snap'?'Snapping…':'Snap'}</Button>
    {retreating?<><Button variant="outline" onClick={()=>{setRetreating(false);endTurn('retreat')}}>Yes, lose {retreatCost}</Button><Button variant="outline" onClick={()=>setRetreating(false)}>Stay</Button></>
    :<Button disabled={m.busy||m.action!=='none'} variant="outline" onClick={()=>setRetreating(true)}>Retreat</Button>}
    <Button disabled={m.busy} onClick={()=>endTurn(m.action)}>End turn</Button>
   </>}
  </div>
  <details className="sn-log"><summary>Match log</summary><pre>{s.log.slice(-30).join('\n')}</pre></details>
  {chooser&&<Dialog open onOpenChange={o=>{if(!o)setChooser(null)}}><DialogContent className="breakdown-dialog"><DialogTitle>{chooser.name}: choose a target</DialogTitle><DialogDescription className="sr-only">Pick where the card acts.</DialogDescription>
   <div className="sn-chooser">{chooser.options.map((o:any,i:number)=><Button key={i} variant="outline" onClick={()=>chooser.pick(o.t)}>{o.label}</Button>)}<Button variant="outline" onClick={()=>setChooser(null)}>Cancel</Button></div></DialogContent></Dialog>}
  {builder&&<DeckBuilder game={game} action={action} locked={locked} start={decks[deckMe]||[]} startName={custom[deckMe]?deckMe:''} onClose={()=>setBuilder(false)} onSaved={(n:string)=>{setDeckMe(n);setBuilder(false)}}/>}
  <Button variant="outline" className="sn-builder-btn" onClick={()=>setBuilder(true)}>Build a deck</Button>
 </section>;
}

/** Make a 12-card deck from the whole pool; saved in the village save under its name. */
function DeckBuilder({game,action,locked,start,startName,onClose,onSaved}:{game:any,action:any,locked:boolean,start:string[],startName:string,onClose:()=>void,onSaved:(n:string)=>void}){
 const [picked,setPicked]=useState<string[]>(start),[name,setName]=useState(startName),[q,setQ]=useState(''),[cost,setCost]=useState(''),[only,setOnly]=useState(false),[err,setErr]=useState('');
 const ids=(POOL_IDS as string[]).filter(id=>!CARDS[id].token).sort((a,b)=>CARDS[a].cost-CARDS[b].cost||CARDS[a].name.localeCompare(CARDS[b].name));
 const term=q.trim().toLowerCase();
 const shown=ids.filter(id=>{const d=CARDS[id];if(only&&!picked.includes(id))return false;if(cost!==''&&(cost==='6'?d.cost<6:d.cost!==Number(cost)))return false;return !term||(d.name+' '+d.text).toLowerCase().includes(term)});
 const toggle=(id:string)=>setPicked(p=>p.includes(id)?p.filter(x=>x!==id):p.length<SNAP_DECK?[...p,id]:p);
 const save=()=>{const n=name.trim();if(!n){setErr('Give the deck a name');return}if(BUILT_IN[n]){setErr('That name belongs to a built-in deck');return}if(action('snapDeckSave',n,picked))onSaved(n)};
 const mine=!!game.snap?.decks?.[name.trim()];
 return <Dialog open onOpenChange={o=>{if(!o)onClose()}}><DialogContent className="breakdown-dialog sn-builder"><DialogTitle>Build a deck</DialogTitle><DialogDescription>Tap cards to add or remove them. A deck is exactly {SNAP_DECK} different cards. T1–T5 is the card’s standing in the public tier lists; +1 marks a house rule.</DialogDescription>
  <div className="sn-bar"><input value={name} maxLength={SNAP_DECK_NAME} placeholder="Deck name" onChange={e=>{setName(e.target.value);setErr('')}}/><input value={q} placeholder="Search name or text" onChange={e=>setQ(e.target.value)}/>
   <NativeSelect value={cost} onChange={(e:any)=>setCost(e.target.value)}><NativeSelectOption value="">Any cost</NativeSelectOption>{[0,1,2,3,4,5,6].map(c=><NativeSelectOption key={c} value={String(c)}>{c===6?'6+':c}-Cost</NativeSelectOption>)}</NativeSelect>
   <label className="sn-only"><input type="checkbox" checked={only} onChange={e=>setOnly(e.target.checked)}/> picked only</label><b>{picked.length} / {SNAP_DECK}</b></div>
  <div className="sn-pool">{shown.map(id=>{const d=CARDS[id];return <button type="button" key={id} className={'sn-pick'+(picked.includes(id)?' sn-on':'')} title={d.text||'No ability'} onClick={()=>toggle(id)}><span className="sn-c">{d.cost}</span><span>{d.name}{d.skill?' (skill)':''}{(CARD_TIERS as any)[id]&&<i className={'sn-tier sn-tier-'+(CARD_TIERS as any)[id]} title={'Tier '+(CARD_TIERS as any)[id]+' in the public tier lists'}>T{(CARD_TIERS as any)[id]}</i>}{d.house&&<i className="sn-house" title={'House rule: +'+d.house+' Power'}>+{d.house}</i>}</span><span className="sn-p">{d.skill?'':d.power}</span></button>})}</div>
  {err&&<p className="small-note sn-err">{err}</p>}
  <div className="sn-bar"><Button disabled={locked||picked.length!==SNAP_DECK} onClick={save}>Save deck</Button>{mine&&<Button variant="outline" disabled={locked} onClick={()=>{if(action('snapDeckDelete',name.trim()))onClose()}}>Delete</Button>}<Button variant="outline" onClick={()=>setPicked([])}>Clear</Button><Button variant="outline" onClick={onClose}>Close</Button></div>
 </DialogContent></Dialog>;
}
