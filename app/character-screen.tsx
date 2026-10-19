import {rarityIcon} from '@/lib/ui-sprites.mjs';
import {useState,type ReactNode} from 'react';
import {Eye,EyeOff,Info,SlidersHorizontal} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Dialog,DialogContent,DialogTitle,DialogDescription} from '@/components/ui/dialog';
import CharacterArtwork from './character-artwork';

/** A character screen built around the art: the whole figure is always visible, head to feet.
 *  Layout, top to bottom: a slim strip (back · name · rarity), the art stage (rail buttons and
 *  arrows float over its edges), and a slim bar with a short summary and one main action.
 *  Everything else lives behind buttons: `details` opens from the rail, `info` from the Info button. */
export default function CharacterScreen({person,collection,children,subtitle,summary,primary,details,detailsLabel='Details',rail,info,infoOnly,preview,onPrevious,onNext,statBlock}:{
 person:any,collection?:ReactNode,children?:ReactNode,subtitle?:string,summary?:ReactNode,primary?:ReactNode,details?:ReactNode,detailsLabel?:string,
 rail?:ReactNode,info?:ReactNode,infoOnly?:boolean,preview?:boolean,onPrevious?:()=>void,onNext?:()=>void,statBlock?:ReactNode}){
 const [hidden,setHidden]=useState(false),[infoOpen,setInfo]=useState(false),[detailsOpen,setDetails]=useState(false);
 return <section className={'es-char'+(hidden?' es-char-hidden':'')+(preview?' es-char-preview':'')} aria-label={person.name+' character screen'}>
  <div className="es-char-scene" aria-hidden="true"/>
  <header className="es-char-top">
   <div className="es-char-back">{collection}</div>
   <div className="es-char-name"><b>{person.name}</b><small>{subtitle||person.title}</small></div>
   <div className="es-char-rarity">{person.rarity&&rarityIcon(person.rarity)?<img src={rarityIcon(person.rarity)!} alt={person.rarity}/>:null}</div>
  </header>
  <div className="es-char-stage">
   <CharacterArtwork key={person.id+'-'+(person.art||'')} person={person}/>
   <aside className="es-char-rail" aria-label="Character actions">
    <Button variant="outline" className="es-rail-btn" onClick={()=>setHidden(v=>!v)} aria-pressed={hidden} aria-label={hidden?'Show interface':'Hide interface'}>{hidden?<EyeOff aria-hidden="true"/>:<Eye aria-hidden="true"/>}<span>{hidden?'Show':'Hide'}</span></Button>
    {!hidden&&<>
     {details&&<Button variant="outline" className="es-rail-btn" onClick={()=>setDetails(true)} aria-label={detailsLabel}><SlidersHorizontal aria-hidden="true"/><span>{detailsLabel}</span></Button>}
     <Button variant="outline" className="es-rail-btn" onClick={()=>setInfo(true)} aria-label={'About '+person.name}><Info aria-hidden="true"/><span>Info</span></Button>
     {rail}
    </>}
   </aside>
   {onPrevious&&!hidden&&<Button className="es-char-arrow es-char-prev" variant="ghost" aria-label="Previous character" onClick={onPrevious}>‹</Button>}
   {onNext&&!hidden&&<Button className="es-char-arrow es-char-next" variant="ghost" aria-label="Next character" onClick={onNext}>›</Button>}
  </div>
  <footer className="es-char-bar">
   {children}
   {(summary||statBlock)&&<div className="es-char-summary">{summary||statBlock}</div>}
   {primary&&<div className="es-char-primary">{primary}</div>}
  </footer>
  {details&&<Dialog open={detailsOpen} onOpenChange={setDetails}><DialogContent className="es-char-sheet"><DialogTitle>{person.name}</DialogTitle><DialogDescription>{detailsLabel}</DialogDescription><div className="es-char-sheet-body">{details}</div></DialogContent></Dialog>}
  <Dialog open={infoOpen} onOpenChange={setInfo}><DialogContent className="es-char-sheet"><DialogTitle>{infoOnly?'Info':person.name}</DialogTitle><DialogDescription className={infoOnly?'sr-only':undefined}>{person.title}</DialogDescription>
   {infoOnly?info:<><p>{person.description||''}</p>{info}</>}</DialogContent></Dialog>
 </section>;
}
