import {useState,useRef,type ComponentType} from 'react';
import {Dialog,DialogContent,DialogTitle,DialogDescription} from '@/components/ui/dialog';
import {NativeSelect,NativeSelectOption} from '@/components/ui/native-select';
import {CARDS as CARDS_M,POOL_IDS} from '@/lib/snap/cards.mjs';
import {META_DECKS,FUN_DECKS} from '@/lib/snap-decks.mjs';
import {encodeDeck,decodeDeck,KEYWORDS,hasKeyword,SORTS,sortIds,curve} from '@/lib/snap-codes.mjs';
import CARD_TIERS from '@/lib/snap-tiers.json';
import {SNAP_DECK,SNAP_DECK_NAME} from '@/lib/game.mjs';
const CARDS:any=CARDS_M,TIERS:any=CARD_TIERS,KW:any[]=KEYWORDS as any;

/** The Cards screen, laid out like the game's Collection (checked against phone screenshots of it): a header plate,
 *  a strip of 3D deck tiles with a "+" tile (yours, then the ladder meta and the fun shelf), and the collection as
 *  big card frames in four columns with a search field and a filter funnel. Tapping a deck opens the editor: the
 *  back hex, the name banner and the menu hex across the top, the deck as a 6x2 grid, then the collection again.
 *  The menu holds what the game's does (share a code, paste one, copy, delete) plus rename and clear. */
type FrameC=ComponentType<{id?:string,cost:number,power:number|string,cls?:string}>;
type Props={game:any,action:any,locked:boolean,custom:Record<string,string[]>,builtIn:Record<string,string[]>,current:string,
 Frame:FrameC,avatarOf:(ids:string[]|undefined)=>string|null,deckLabel:(k:string)=>string,onPick:(k:string)=>void,onClose:()=>void};
const Ico=({n,red,cls=''}:{n:string,red?:boolean,cls?:string})=><img className={'sn-ico'+(red?' sn-ico-red':'')+(cls?' '+cls:'')} src={`./assets/snap-ui/icon-${n}.png`} alt=""/>;
const nameOf=(k:string,custom:Record<string,string[]>)=>custom[k]?k:(META_DECKS as any)[k]?.name??(FUN_DECKS as any)[k.replace(/^fun:/,'')]?.name??k;

export function DecksScreen(p:Props){
 const [edit,setEdit]=useState<{ids:string[],name:string,orig:string}|null>(null);
 return <Dialog open onOpenChange={o=>{if(!o)p.onClose()}}><DialogContent className="breakdown-dialog sn-builder sn-space sn-cards">
  {edit?<Editor {...p} start={edit.ids} startName={edit.name} orig={edit.orig} back={()=>setEdit(null)}/>
  :<CardsHome {...p} openEditor={(ids,name,orig)=>setEdit({ids,name,orig})}/>}
 </DialogContent></Dialog>;
}

/** A deck as the game draws it on the strip: a small 3D stack of card backs with the deck's face card on top. */
function DeckTile({k,ids,custom,avatarOf,on,current,sub,onClick}:{k:string,ids:string[],custom:Record<string,string[]>,avatarOf:Props['avatarOf'],on:boolean,current:boolean,sub:string,onClick:()=>void}){
 const a=avatarOf(ids);
 return <button type="button" className={'sn-decktile'+(on?' sn-on':'')+(current?' sn-current':'')} onClick={onClick} title={nameOf(k,custom)}>
  <span className="sn-deck3d"><i/><i/><i style={a?{backgroundImage:`url("${a}")`}:undefined}/>{current&&<Ico n="check" red cls="sn-tilecheck"/>}</span>
  <b>{nameOf(k,custom)}</b><small>{sub}</small>
 </button>;
}

function CardsHome({game,action,locked,custom,builtIn,current,Frame,avatarOf,onPick,onClose,openEditor}:Props&{openEditor:(ids:string[],name:string,orig:string)=>void}){
 const [sel,setSel]=useState<string|null>(current),[importing,setImporting]=useState(false),[code,setCode]=useState(''),[err,setErr]=useState(''),[confirm,setConfirm]=useState(false),[shown,setShown]=useState<string|null>(null),[peek,setPeek]=useState<string|null>(null);
 const all={...custom,...builtIn},ids=sel?all[sel]:null,mine=!!(sel&&custom[sel]);
 const doImport=()=>{const r=decodeDeck(code);if(!r.ids.length){setErr('No cards recognised in that');return}setErr(r.unknown.length?`Not in the pool: ${r.unknown.join(', ')}`:'');openEditor(r.ids.slice(0,SNAP_DECK),'','')};
 const del=()=>{if(!sel)return;if(!confirm){setConfirm(true);return}if(action('snapDeckDelete',sel)){if(current===sel)onPick(Object.keys(builtIn)[0]);setSel(null);setConfirm(false)}};
 const share=async(k:string)=>{const c=encodeDeck(all[k]);setShown(c);try{await navigator.clipboard.writeText(c)}catch{}};
 const choose=(k:string)=>{setSel(k);setConfirm(false);setShown(null)};
 const tile=(k:string,sub:string)=><DeckTile key={k} k={k} ids={all[k]} custom={custom} avatarOf={avatarOf} on={sel===k} current={current===k} sub={sub} onClick={()=>choose(k)}/>;
 const c=ids?curve(ids):null;
 return <>
  <DialogTitle className="sn-cards-title"><span>Cards</span></DialogTitle>
  <DialogDescription className="sr-only">Your decks and the built-in ones as tiles; tap one for its actions. A deck is exactly {SNAP_DECK} different cards.</DialogDescription>
  {peek?<CardPeek id={peek} Frame={Frame} onBack={()=>setPeek(null)}/>:<>
  <div className="sn-striplabel"><Ico n="deck"/>Your decks<small>{Object.keys(custom).length}</small></div>
  <div className="sn-strip">
   <button type="button" className="sn-decktile sn-newtile" disabled={locked} onClick={()=>openEditor([],'','')}><span className="sn-deck3d"><i className="sn-plus">+</i></span><b>New deck</b></button>
   <button type="button" className="sn-decktile sn-newtile" onClick={()=>{setImporting(v=>!v);setErr('')}}><span className="sn-deck3d"><i className="sn-plus"><Ico n="copy"/></i></span><b>Paste a code</b></button>
   {Object.keys(custom).map(k=>tile(k,`${custom[k].length} cards`))}
  </div>
  {importing&&<div className="sn-import"><textarea value={code} rows={3} placeholder="A deck code from the game or a site, bare JSON, or card names one per line" onChange={e=>setCode(e.target.value)}/>
   <div className="sn-bar"><button type="button" className="sn-ribbon sn-ribbon-purple sn-ribbon-sm" onClick={doImport}>Open it in the editor</button></div></div>}
  {err&&<p className="small-note sn-err">{err}</p>}
  <div className="sn-striplabel">Ladder meta</div>
  <div className="sn-strip">{Object.entries(META_DECKS as any).map(([k,d]:any)=>tile(k,`Tier ${d.tier}`))}</div>
  <div className="sn-striplabel">Fun shelf</div>
  <div className="sn-strip">{Object.entries(FUN_DECKS as any).map(([k,d]:any)=>tile('fun:'+k,d.arch))}</div>
  {sel&&ids&&<div className="sn-deckacts">
   <div className="sn-bar sn-deckacts-head"><b>{nameOf(sel,custom)}</b><small>{ids.length} cards · avg {c!.avg.toFixed(1)}{mine?'':' · built in: copy it to change it'}</small></div>
   <div className="sn-bar sn-curvebar"><Curve counts={c!.counts}/></div>
   <div className="sn-deckrow sn-deckrow-mini">{sortIds(ids).map(id=><span key={id} onClick={()=>setPeek(id)}><Frame id={id} cost={CARDS[id].cost} power={CARDS[id].skill?'':CARDS[id].power} cls="sn-deckcard"/></span>)}</div>
   <div className="sn-bar">
    <button type="button" className="sn-ribbon sn-ribbon-purple sn-ribbon-sm" onClick={()=>{onPick(sel);onClose()}}><Ico n="deck"/>Play with it</button>
    {mine&&<button type="button" className="sn-ribbon sn-ribbon-blue sn-ribbon-sm" disabled={locked} onClick={()=>openEditor(ids,sel,sel)}><Ico n="menu" red/>Edit</button>}
    <button type="button" className="sn-ribbon sn-ribbon-blue sn-ribbon-sm" disabled={locked} onClick={()=>openEditor(ids,mine?`${sel} copy`.slice(0,SNAP_DECK_NAME):'','')}><Ico n="copy"/>Copy</button>
    <button type="button" className="sn-ribbon sn-ribbon-blue sn-ribbon-sm" onClick={()=>share(sel)}>Share code</button>
    {mine&&<button type="button" className="sn-ribbon sn-ribbon-red sn-ribbon-sm" disabled={locked} onClick={del}><Ico n="delete" red/>{confirm?'Delete for good?':'Delete'}</button>}
   </div>
   {shown&&<div className="sn-import"><textarea readOnly rows={3} value={shown} onFocus={e=>e.currentTarget.select()}/><small>Copied where the browser allows it; it pastes into the game's deck editor or any deck site.</small></div>}
  </div>}
  <Collection Frame={Frame} picked={sel?ids!:[]} onOpen={setPeek}/>
  <div className="sn-bar"><button type="button" className="sn-ribbon sn-ribbon-blue sn-ribbon-sm" onClick={onClose}><Ico n="back" red/>Close</button></div>
  </>}
 </>;
}

function CardPeek({id,Frame,onBack,children}:{id:string,Frame:FrameC,onBack:()=>void,children?:any}){
 const d=CARDS[id],tier=TIERS[id];
 return <>
  <div className="sn-detail"><Frame id={id} cost={d.cost} power={d.skill?'':d.power}/>
   <div><h3>{d.name}</h3><p>{d.text||'No ability'}</p>
    <small>{d.skill?'Skill · ':''}{tier?`Tier ${tier} in the public tier lists · `:''}{d.house?`House rule: +${d.house} Power · `:''}{KW.filter(k=>k[2]&&hasKeyword(d,k[0])).map(k=>k[1]).join(', ')}</small></div></div>
  <div className="sn-bar">{children}<button type="button" className="sn-ribbon sn-ribbon-blue sn-ribbon-sm" onClick={onBack}><Ico n="back" red/>Back</button></div>
 </>;
}

function Curve({counts}:{counts:number[]}){const max=Math.max(1,...counts);
 return <div className="sn-curve" aria-label="Energy curve">{counts.map((n,i)=><span key={i}><i style={{height:`${Math.round(n/max*100)}%`}}>{n||''}</i><small>{i===6?'6+':i}</small></span>)}</div>}

/** The collection grid with the game's search field and filter funnel; the filter row unfolds under the funnel. */
function Collection({Frame,picked,onOpen,title='Collection'}:{Frame:FrameC,picked:string[],onOpen:(id:string)=>void,title?:string}){
 const [q,setQ]=useState(''),[cost,setCost]=useState(''),[kw,setKw]=useState(''),[sort,setSort]=useState('cost'),[only,setOnly]=useState(false),[filters,setFilters]=useState(false);
 const pool=(POOL_IDS as string[]).filter(id=>!CARDS[id].token),term=q.trim().toLowerCase();
 const shown=sortIds(pool.filter(id=>{const d=CARDS[id];if(only&&!picked.includes(id))return false;if(cost!==''&&(cost==='6'?d.cost<6:d.cost!==Number(cost)))return false;if(!hasKeyword(d,kw))return false;return !term||(d.name+' '+d.text).toLowerCase().includes(term)}),sort,TIERS);
 const active=(cost?1:0)+(kw?1:0)+(only?1:0)+(sort!=='cost'?1:0);
 return <div className="sn-coll">
  <div className="sn-collhead"><span className="sn-collname">{title}</span><input value={q} placeholder="Search" onChange={e=>setQ(e.target.value)}/>
   <button type="button" className={'sn-funnel'+(filters||active?' sn-on':'')} onClick={()=>setFilters(v=>!v)} aria-label="Filters">▼{active?<b>{active}</b>:null}</button><small>{shown.length}</small></div>
  {filters&&<div className="sn-bar sn-filters">
   <NativeSelect value={cost} onChange={(e:any)=>setCost(e.target.value)}><NativeSelectOption value="">Any cost</NativeSelectOption>{[0,1,2,3,4,5,6].map(n=><NativeSelectOption key={n} value={String(n)}>{n===6?'6+':n}-Cost</NativeSelectOption>)}</NativeSelect>
   <NativeSelect value={kw} onChange={(e:any)=>setKw(e.target.value)}><NativeSelectOption value="">Any keyword</NativeSelectOption>{KW.map(k=><NativeSelectOption key={String(k[0])} value={String(k[0])}>{String(k[1])}</NativeSelectOption>)}</NativeSelect>
   <NativeSelect value={sort} onChange={(e:any)=>setSort(e.target.value)}>{SORTS.map(s=><NativeSelectOption key={s[0]} value={s[0]}>By {s[1].toLowerCase()}</NativeSelectOption>)}</NativeSelect>
   <label className="sn-only"><input type="checkbox" checked={only} onChange={e=>setOnly(e.target.checked)}/> in deck</label>
  </div>}
  <div className="sn-pool sn-pool-coll">{shown.map(id=>{const cd=CARDS[id];return <button type="button" key={id} className={'sn-pick'+(picked.includes(id)?' sn-on':'')} onClick={()=>onOpen(id)}><Frame id={id} cost={cd.cost} power={cd.skill?'':cd.power}/><span>{TIERS[id]&&<i className={'sn-tier sn-tier-'+TIERS[id]}>T{TIERS[id]}</i>}{cd.house&&<i className="sn-house">+{cd.house}</i>}</span></button>})}</div>
 </div>;
}

function Editor({action,locked,start,startName,orig,custom,builtIn,Frame,back,onPick}:Props&{start:string[],startName:string,orig:string,back:()=>void}){
 const [picked,setPicked]=useState<string[]>(start),[name,setName]=useState(startName),[err,setErr]=useState(''),[sel,setSel]=useState<string|null>(null),[menu,setMenu]=useState(false),[code,setCode]=useState<string|null>(null),[pasting,setPasting]=useState(false),[paste,setPaste]=useState(''),[confirm,setConfirm]=useState(false);
 const nameRef=useRef<HTMLInputElement>(null);
 const toggle=(id:string)=>setPicked(p=>p.includes(id)?p.filter(x=>x!==id):p.length<SNAP_DECK?[...p,id]:p);
 const save=()=>{const n=name.trim();if(!n){setErr('Give the deck a name');nameRef.current?.focus();return}if(builtIn[n]){setErr('That name belongs to a built-in deck');return}
  if(n!==orig&&custom[n]){setErr('You already have a deck with that name');return}
  if(action('snapDeckSave',n,picked)){if(orig&&orig!==n)action('snapDeckDelete',orig);onPick(n);back()}};
 const del=()=>{if(!confirm){setConfirm(true);return}if(!orig||action('snapDeckDelete',orig)){if(orig)onPick(Object.keys(builtIn)[0]);back()}};
 const doPaste=()=>{const r=decodeDeck(paste);if(!r.ids.length){setErr('No cards recognised in that');return}setPicked(r.ids.slice(0,SNAP_DECK));setErr(r.unknown.length?`Not in the pool: ${r.unknown.join(', ')}`:'');setPasting(false);setMenu(false)};
 const sorted=sortIds(picked),c=curve(picked);
 return <>
  <DialogTitle className="sr-only">{orig?`Edit ${orig}`:'Build a deck'}</DialogTitle>
  <DialogDescription className="sr-only">Tap cards to open them, then add or remove them. A deck is exactly {SNAP_DECK} different cards.</DialogDescription>
  <div className="sn-edittop">
   <button type="button" className="sn-hexbtn" onClick={back} aria-label="Back to the decks"><Ico n="back" red/></button>
   <label className="sn-namebanner"><input ref={nameRef} value={name} maxLength={SNAP_DECK_NAME} placeholder="Deck name" onChange={e=>{setName(e.target.value);setErr('')}}/></label>
   <button type="button" className={'sn-hexbtn'+(menu?' sn-on':'')} onClick={()=>setMenu(v=>!v)} aria-label="Deck menu"><Ico n="menu" red/></button>
  </div>
  {menu&&<div className="sn-menu">
   <button type="button" disabled={!picked.length} onClick={async()=>{const cc=encodeDeck(picked);setCode(cc);setMenu(false);try{await navigator.clipboard.writeText(cc)}catch{}}}><Ico n="copy"/>Share a deck code</button>
   <button type="button" onClick={()=>{setPasting(v=>!v)}}><Ico n="copy"/>Paste a deck code</button>
   <button type="button" onClick={()=>{nameRef.current?.focus();nameRef.current?.select();setMenu(false)}}><Ico n="menu" red/>Rename</button>
   <button type="button" onClick={()=>{setPicked([]);setMenu(false)}}><Ico n="card"/>Clear the deck</button>
   <button type="button" className="sn-menu-danger" disabled={locked} onClick={del}><Ico n="delete" red/>{confirm?'Delete for good?':orig?'Delete this deck':'Discard'}</button>
   {pasting&&<div className="sn-import"><textarea value={paste} rows={3} placeholder="A deck code, bare JSON, or card names" onChange={e=>setPaste(e.target.value)}/><div className="sn-bar"><button type="button" className="sn-ribbon sn-ribbon-purple sn-ribbon-sm" onClick={doPaste}>Replace the deck with it</button></div></div>}
  </div>}
  {sel?<CardPeek id={sel} Frame={Frame} onBack={()=>setSel(null)}>
   {picked.includes(sel)?<button type="button" className="sn-ribbon sn-ribbon-red sn-ribbon-sm" onClick={()=>{toggle(sel);setSel(null)}}><Ico n="delete" red/>Remove from deck</button>
   :<button type="button" className="sn-ribbon sn-ribbon-purple sn-ribbon-sm" disabled={picked.length>=SNAP_DECK} onClick={()=>{toggle(sel);setSel(null)}}>{picked.length>=SNAP_DECK?'Deck is full':'Add to deck'}</button>}
  </CardPeek>:<>
   <div className="sn-editsub"><Ico n="deck"/><b>{picked.length} / {SNAP_DECK}</b><Curve counts={c.counts}/><small>avg {c.avg.toFixed(1)}</small></div>
   <div className="sn-deckrow">{sorted.map(id=><span key={id} onClick={()=>setSel(id)}><Frame id={id} cost={CARDS[id].cost} power={CARDS[id].skill?'':CARDS[id].power} cls="sn-deckcard"/></span>)}{Array.from({length:Math.max(0,SNAP_DECK-sorted.length)},(_,i)=><i key={'e'+i} className="sn-slot"/>)}</div>
   {err&&<p className="small-note sn-err">{err}</p>}
   {code!==null&&<div className="sn-import"><textarea readOnly rows={3} value={code} onFocus={e=>e.currentTarget.select()}/><small>Copied where the browser allows it.</small></div>}
   <Collection Frame={Frame} picked={picked} onOpen={setSel}/>
   <div className="sn-bar sn-editbar">
    <button type="button" className="sn-ribbon sn-ribbon-purple" disabled={locked||picked.length!==SNAP_DECK} onClick={save}><Ico n="check" red/>Save deck<small>{picked.length===SNAP_DECK?'Keep it in the village save':`${SNAP_DECK-picked.length} more card${SNAP_DECK-picked.length===1?'':'s'}`}</small></button>
    <button type="button" className="sn-ribbon sn-ribbon-blue sn-ribbon-sm" onClick={back}><Ico n="back" red/>Decks</button>
   </div>
  </>}
 </>;
}
