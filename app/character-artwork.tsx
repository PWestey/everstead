import {useState} from 'react';
import {areaById} from '@/lib/cast.mjs';
/** A character's full-screen art. Until the real file exists at public/assets/<art>, a drawn
 *  placeholder stands in: the area colour, a silhouette and the name, so every screen is usable now.
 *  The CSS class `art-alive` adds a gentle breathing motion (no video, no rigging). */
export function Placeholder({person,compact=false}:{person:any,compact?:boolean}){
 const color=areaById(person.area)?.color||'#c9a96e';
 return <svg className="art-placeholder" viewBox="0 0 400 600" preserveAspectRatio="xMidYMax meet" role="img" aria-label={person.name+' (art coming soon)'}>
  <defs><radialGradient id={'g-'+person.id} cx="50%" cy="35%" r="70%"><stop offset="0%" stopColor={color} stopOpacity=".55"/><stop offset="100%" stopColor={color} stopOpacity="0"/></radialGradient></defs>
  <rect width="400" height="600" fill={'url(#g-'+person.id+')'}/>
  <g fill="rgba(30,22,14,.55)" stroke={color} strokeWidth="3">
   <circle cx="200" cy="190" r="62"/>
   <path d="M90 600 C95 420 140 300 200 300 C260 300 305 420 310 600 Z"/>
  </g>
  {!compact&&<text x="200" y="560" textAnchor="middle" fill="#fff5dc" fontSize="26" fontWeight="700" style={{paintOrder:'stroke',stroke:'rgba(0,0,0,.6)',strokeWidth:5}}>Art coming soon</text>}
 </svg>;
}
/** A small portrait for lists and story lines: the top of the art, or the placeholder. */
export function MiniArt({person}:{person:any}){
 const [missing,setMissing]=useState(false);
 return <span className="es-mini-art">{missing||!person?.art?<Placeholder person={person||{id:'x',name:''}} compact/>:<img src={'./assets/'+person.art} alt="" loading="lazy" onError={()=>setMissing(true)}/>}</span>;
}
export default function CharacterArtwork({person,large=false}:{person:any,large?:boolean}){
 const [missing,setMissing]=useState(false);
 return <div className={'character-artwork art-alive'+(large?' artwork-large':'')}>
  {missing||!person.art?<Placeholder person={person}/>:<img src={'./assets/'+person.art} alt={person.name} decoding="async" onError={()=>setMissing(true)}/>}
 </div>;
}
