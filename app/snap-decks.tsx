import {useState,type ComponentType} from 'react';
import {Dialog,DialogContent,DialogTitle,DialogDescription} from '@/components/ui/dialog';
import {NativeSelect,NativeSelectOption} from '@/components/ui/native-select';
import {CARDS as CARDS_M,POOL_IDS} from '@/lib/snap/cards.mjs';
import {META_DECKS,FUN_DECKS,META_DATE} from '@/lib/snap-decks.mjs';
import {encodeDeck,decodeDeck,KEYWORDS,hasKeyword,SORTS,sortIds,curve} from '@/lib/snap-codes.mjs';
import CARD_TIERS from '@/lib/snap-tiers.json';
import {SNAP_DECK,SNAP_DECK_NAME} from '@/lib/game.mjs';
const CARDS:any=CARDS_M,TIERS:any=CARD_TIERS;

/** The decks screen, laid out like the game's collection: a list of deck tiles (yours, then the ladder meta and the fun
 *  shelf), and an editor with the deck across the top, its energy curve, the filter row (search, cost, keyword, sort,
 *  in deck) and the collection as card frames. Deck codes move lists in and out in the game's own format. */
type FrameC=ComponentType<{id?:string,cost:number,power:number|string,cls?:string}>;
type Props={game:any,action:any,locked:boolean,custom:Record<string,string[]>,builtIn:Record<string,string[]>,current:string,
 Frame:FrameC,avatarOf:(ids:string[]|undefined)=>string|null,deckLabel:(k:string)=>string,onPick:(k:string)=>void,onClose:()=>void};
const Ico=({n,red}:{n:string,red?:boolean})=><img className={'sn-ico'+(red?' sn-ico-red':'')} src={`./assets/snap-ui/icon-${n}.png`} alt=""/>;

export function DecksScreen(p:Props){
 const [edit,setEdit]=useState<{ids:string[],name:string,orig:string}|null>(null);
 const label=(k:string)=>p.custom[k]?k:(META_DECKS as any)[k]?.name??(FUN_DECKS as any)[k.replace(/^fun:/,'')]?.name??p.deckLabel(k);
 return <Dialog open onOpenChange={o=>{if(!o)p.onClose()}}><DialogContent className="breakdown-dialog sn-builder sn-space">
  {edit?<Editor {...p} start={edit.ids} startName={edit.name} orig={edit.orig} back={()=>setEdit(null)}/>
  :<DeckList {...p} label={label} openEditor={(ids,name,orig)=>setEdit({ids,name,orig})}/>}
 </DialogContent></Dialog>;
}

function DeckList({game,action,locked,custom,builtIn,current,avatarOf,label,onPick,onClose,openEditor}:Props&{label:(k:string)=>string,openEditor:(ids:string[],name:string,orig:string)=>void}){
 const [sel,setSel]=useState<string|null>(current),[importing,setImporting]=useState(false),[code,setCode]=useState(''),[err,setErr]=useState(''),[renaming,setRenaming]=useState<string|null>(null),[confirm,setConfirm]=useState(false),[shown,setShown]=useState<string|null>(null);
 const all={...custom,...builtIn},ids=sel?all[sel]:null,mine=!!(sel&&custom[sel]);
 const doImport=()=>{const r=decodeDeck(code);if(!r.ids.length){setErr('No cards recognised in that');return}setErr('');openEditor(r.ids.slice(0,SNAP_DECK),'',(r.unknown.length?'':''));if(r.unknown.length)setErr(`Not in the pool: ${r.unknown.join(', ')}`)};
 const rename=(n:string)=>{const name=n.trim();if(!name||!sel)return;if(name===sel){setRenaming(null);return}if(all[name]){setErr('That name is taken');return}if(action('snapDeckSave',name,custom[sel])&&action('snapDeckDelete',sel)){onPick(name);setSel(name);setRenaming(null);setErr('')}};
 const del=()=>{if(!sel)return;if(!confirm){setConfirm(true);return}if(action('snapDeckDelete',sel)){setSel(null);setConfirm(false);if(current===sel)onPick(Object.keys(builtIn)[0])}};
 const copyCode=async(k:string)=>{const c=encodeDeck(all[k]);setShown(c);try{await navigator.clipboard.writeText(c)}catch{}};
 const tile=(k:string,sub:string)=>{const a=avatarOf(all[k]);return <button type="button" key={k} className={'sn-decktile'+(sel===k?' sn-on':'')} onClick={()=>{setSel(k);setConfirm(false);setRenaming(null);setShown(null)}}>
  <span className="sn-hex"><i style={a?{backgroundImage:`url("${a}")`}:undefined}>{a?'':'?'}</i></span>
  <span className="sn-tilebody"><b>{label(k)}</b><small>{sub}</small></span>
  {current===k&&<Ico n="check" red/>}
 </button>};
 const c=ids?curve(ids):null;
 return <>
  <DialogTitle>Decks</DialogTitle>
  <DialogDescription className="sr-only">Pick a deck to play with, edit or copy it, or build a new one. A deck is exactly {SNAP_DECK} different cards.</DialogDescription>
  <div className="sn-bar">
   <button type="button" className="sn-ribbon sn-ribbon-purple sn-ribbon-sm" disabled={locked} onClick={()=>openEditor([],'','')}><Ico n="card"/>New deck</button>
   <button type="button" className="sn-ribbon sn-ribbon-blue sn-ribbon-sm" onClick={()=>setImporting(v=>!v)}><Ico n="copy"/>Import a code</button>
  </div>
  {importing&&<div className="sn-import"><textarea value={code} rows={3} placeholder="Paste a deck code from the game or a site, or a list of card names" onChange={e=>setCode(e.target.value)}/>
   <div className="sn-bar"><button type="button" className="sn-ribbon sn-ribbon-purple sn-ribbon-sm" onClick={doImport}>Open in the editor</button></div></div>}
  {err&&<p className="small-note sn-err">{err}</p>}
  {sel&&ids&&<div className="sn-deckacts">
   <div className="sn-bar sn-deckacts-head"><b>{label(sel)}</b><small>{ids.length} cards · average cost {c!.avg.toFixed(1)}{mine?'':' · built in: copy it to change it'}</small></div>
   <Curve counts={c!.counts}/>
   {renaming!==null?<div className="sn-bar"><input autoFocus value={renaming} maxLength={SNAP_DECK_NAME} onChange={e=>setRenaming(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')rename(renaming)}}/><button type="button" className="sn-ribbon sn-ribbon-purple sn-ribbon-sm" onClick={()=>rename(renaming)}><Ico n="check" red/>Rename</button><button type="button" className="sn-ribbon sn-ribbon-blue sn-ribbon-sm" onClick={()=>setRenaming(null)}>Cancel</button></div>
   :<div className="sn-bar">
    <button type="button" className="sn-ribbon sn-ribbon-purple sn-ribbon-sm" onClick={()=>{onPick(sel);onClose()}}><Ico n="deck"/>Play with it</button>
    {mine&&<button type="button" className="sn-ribbon sn-ribbon-blue sn-ribbon-sm" disabled={locked} onClick={()=>openEditor(ids,sel,sel)}><Ico n="menu" red/>Edit</button>}
    <button type="button" className="sn-ribbon sn-ribbon-blue sn-ribbon-sm" disabled={locked} onClick={()=>openEditor(ids,mine?`${sel} copy`.slice(0,SNAP_DECK_NAME):'','')}><Ico n="copy"/>Copy</button>
    {mine&&<button type="button" className="sn-ribbon sn-ribbon-blue sn-ribbon-sm" disabled={locked} onClick={()=>setRenaming(sel)}>Rename</button>}
    <button type="button" className="sn-ribbon sn-ribbon-blue sn-ribbon-sm" onClick={()=>copyCode(sel)}>Deck code</button>
    {mine&&<button type="button" className="sn-ribbon sn-ribbon-red sn-ribbon-sm" disabled={locked} onClick={del}><Ico n="delete" red/>{confirm?'Delete for good?':'Delete'}</button>}
   </div>}
   {shown&&<div className="sn-import"><textarea readOnly rows={3} value={shown} onFocus={e=>e.currentTarget.select()}/><small>Copied to the clipboard where the browser allows it; it opens in the game's deck editor or any deck site.</small></div>}
  </div>}
  <h3 className="sn-h">Your decks</h3>
  {Object.keys(custom).length?<div className="sn-tiles">{Object.keys(custom).map(k=>tile(k,`${custom[k].length} cards`))}</div>:<p className="sn-none">None yet. Copy a built-in deck or start a new one.</p>}
  <h3 className="sn-h">Ladder meta · {META_DATE}</h3>
  <div className="sn-tiles">{Object.entries(META_DECKS as any).map(([k,d]:any)=>tile(k,`Tier ${d.tier}`))}</div>
  <h3 className="sn-h">Fun shelf</h3>
  <div className="sn-tiles">{Object.entries(FUN_DECKS as any).map(([k,d]:any)=>tile('fun:'+k,d.arch))}</div>
  <div className="sn-bar"><button type="button" className="sn-ribbon sn-ribbon-blue sn-ribbon-sm" onClick={onClose}><Ico n="back" red/>Close</button></div>
 </>;
}

function Curve({counts}:{counts:number[]}){const max=Math.max(1,...counts);
 return <div className="sn-curve" aria-label="Energy curve">{counts.map((n,i)=><span key={i}><i style={{height:`${Math.round(n/max*100)}%`}}>{n||''}</i><small>{i===6?'6+':i}</small></span>)}</div>}

function Editor({game,action,locked,start,startName,orig,custom,builtIn,Frame,back,onPick}:Props&{start:string[],startName:string,orig:string,back:()=>void}){
 const [picked,setPicked]=useState<string[]>(start),[name,setName]=useState(startName),[q,setQ]=useState(''),[cost,setCost]=useState(''),[kw,setKw]=useState(''),[sort,setSort]=useState('cost'),[only,setOnly]=useState(false),[err,setErr]=useState(''),[sel,setSel]=useState<string|null>(null),[code,setCode]=useState<string|null>(null);
 const pool=(POOL_IDS as string[]).filter(id=>!CARDS[id].token),term=q.trim().toLowerCase();
 const shown=sortIds(pool.filter(id=>{const d=CARDS[id];if(only&&!picked.includes(id))return false;if(cost!==''&&(cost==='6'?d.cost<6:d.cost!==Number(cost)))return false;if(!hasKeyword(d,kw))return false;return !term||(d.name+' '+d.text).toLowerCase().includes(term)}),sort,TIERS);
 const toggle=(id:string)=>setPicked(p=>p.includes(id)?p.filter(x=>x!==id):p.length<SNAP_DECK?[...p,id]:p);
 const save=()=>{const n=name.trim();if(!n){setErr('Give the deck a name');return}if(builtIn[n]){setErr('That name belongs to a built-in deck');return}
  if(n!==orig&&custom[n]){setErr('You already have a deck with that name');return}
  if(action('snapDeckSave',n,picked)){if(orig&&orig!==n)action('snapDeckDelete',orig);onPick(n);back()}};
 const sorted=sortIds(picked),c=curve(picked),d=sel?CARDS[sel]:null,tier=sel?TIERS[sel]:null;
 return <>
  <DialogTitle>{sel&&d?d.name:orig?`Edit ${orig}`:'Build a deck'}</DialogTitle>
  <DialogDescription className="sr-only">Tap cards to open them, then add or remove them. A deck is exactly {SNAP_DECK} different cards.</DialogDescription>
  {sel&&d?<>
   <div className="sn-detail"><Frame id={sel} cost={d.cost} power={d.skill?'':d.power}/>
    <div><h3>{d.name}</h3><p>{d.text||'No ability'}</p>
     <small>{d.skill?'Skill · ':''}{tier?`Tier ${tier} in the public tier lists · `:''}{d.house?`House rule: +${d.house} Power · `:''}{KEYWORDS.filter((k:any)=>k[2]&&hasKeyword(d,k[0])).map((k:any)=>k[1]).join(', ')}</small></div></div>
   <div className="sn-bar">
    {picked.includes(sel)?<button type="button" className="sn-ribbon sn-ribbon-red sn-ribbon-sm" onClick={()=>{toggle(sel);setSel(null)}}><Ico n="delete" red/>Remove from deck</button>
    :<button type="button" className="sn-ribbon sn-ribbon-purple sn-ribbon-sm" disabled={picked.length>=SNAP_DECK} onClick={()=>{toggle(sel);setSel(null)}}>{picked.length>=SNAP_DECK?'Deck is full':'Add to deck'}</button>}
    <button type="button" className="sn-ribbon sn-ribbon-blue sn-ribbon-sm" onClick={()=>setSel(null)}><Ico n="back" red/>Back</button></div>
  </>:<>
   <div className="sn-deckrow">{sorted.map(id=><span key={id} onClick={()=>setSel(id)}><Frame id={id} cost={CARDS[id].cost} power={CARDS[id].skill?'':CARDS[id].power} cls="sn-deckcard"/></span>)}{Array.from({length:Math.max(0,SNAP_DECK-sorted.length)},(_,i)=><i key={'e'+i} className="sn-slot"/>)}</div>
   <div className="sn-bar sn-curvebar"><Curve counts={c.counts}/><b>{picked.length} / {SNAP_DECK}</b><small>avg {c.avg.toFixed(1)}</small></div>
   <div className="sn-bar"><input value={name} maxLength={SNAP_DECK_NAME} placeholder="Deck name" onChange={e=>{setName(e.target.value);setErr('')}}/></div>
   <div className="sn-bar sn-filters"><input value={q} placeholder="Search name or text" onChange={e=>setQ(e.target.value)}/>
    <NativeSelect value={cost} onChange={(e:any)=>setCost(e.target.value)}><NativeSelectOption value="">Any cost</NativeSelectOption>{[0,1,2,3,4,5,6].map(n=><NativeSelectOption key={n} value={String(n)}>{n===6?'6+':n}-Cost</NativeSelectOption>)}</NativeSelect>
    <NativeSelect value={kw} onChange={(e:any)=>setKw(e.target.value)}><NativeSelectOption value="">Any keyword</NativeSelectOption>{KEYWORDS.map((k:any)=><NativeSelectOption key={String(k[0])} value={String(k[0])}>{String(k[1])}</NativeSelectOption>)}</NativeSelect>
    <NativeSelect value={sort} onChange={(e:any)=>setSort(e.target.value)}>{SORTS.map(s=><NativeSelectOption key={s[0]} value={s[0]}>By {s[1].toLowerCase()}</NativeSelectOption>)}</NativeSelect>
    <label className="sn-only"><input type="checkbox" checked={only} onChange={e=>setOnly(e.target.checked)}/> in deck</label><small>{shown.length} cards</small></div>
   <div className="sn-pool">{shown.map(id=>{const cd=CARDS[id];return <button type="button" key={id} className={'sn-pick'+(picked.includes(id)?' sn-on':'')} onClick={()=>setSel(id)}><Frame id={id} cost={cd.cost} power={cd.skill?'':cd.power}/><span>{TIERS[id]&&<i className={'sn-tier sn-tier-'+TIERS[id]}>T{TIERS[id]}</i>}{cd.house&&<i className="sn-house">+{cd.house}</i>}</span></button>})}</div>
   {err&&<p className="small-note sn-err">{err}</p>}
   {code!==null&&<div className="sn-import"><textarea readOnly rows={3} value={code} onFocus={e=>e.currentTarget.select()}/><small>The deck as a code, copied where the browser allows it.</small></div>}
   <div className="sn-bar">
    <button type="button" className="sn-ribbon sn-ribbon-purple sn-ribbon-sm" disabled={locked||picked.length!==SNAP_DECK} onClick={save}><Ico n="check" red/>Save deck</button>
    <button type="button" className="sn-ribbon sn-ribbon-blue sn-ribbon-sm" disabled={!picked.length} onClick={async()=>{const cc=encodeDeck(picked);setCode(cc);try{await navigator.clipboard.writeText(cc)}catch{}}}><Ico n="copy"/>Deck code</button>
    <button type="button" className="sn-ribbon sn-ribbon-blue sn-ribbon-sm" onClick={()=>setPicked([])}>Clear</button>
    <button type="button" className="sn-ribbon sn-ribbon-blue sn-ribbon-sm" onClick={back}><Ico n="back" red/>Decks</button>
   </div>
  </>}
 </>;
}
