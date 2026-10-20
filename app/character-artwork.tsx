import {useState,useRef,useLayoutEffect} from 'react';
import BOUNDS from '@/lib/art-bounds.json';
import {areaById} from '@/lib/cast.mjs';
/** A character's full-screen art. Until the real file exists at public/assets/<art>, a drawn
 *  placeholder stands in: the area colour, a silhouette and the name, so every screen is usable now.
 *  Art is still; the `art-alive` class is kept as a hook for real animation later. */
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
/** Frames a portrait inside a box by the figure's recorded bounds (lib/art-bounds.json), using only percentages of
 *  the box width so it works at any size. `kind` 'card' shows head to waist; 'face' zooms to the head.
 *  Both centre on the head. Returns undefined when the art has no bounds. */
export function framedStyle(art:string,kind:'card'|'face'):any{const box=(BOUNDS as Record<string,number[]>)[art];if(!box)return undefined;
 // card: the top 55% of the figure (from the head) fills a ~2:3 card; face: the top 20% fills a square.
 const [l,t0,r,b,bl=l,br=r,hx=(bl+br)/2,t=t0]=box,w=kind==='face'?1/(1.5*(b-t)*0.2):1/((b-t)*0.55);
 return {position:'static',maxWidth:'none',minHeight:0,width:w*100+'%',height:'auto',objectFit:'fill',marginLeft:(50-hx*w*100)+'%',marginTop:((kind==='face'?2:3)-t*1.5*w*100)+'%'}}
/** A small portrait for lists and story lines: the face, or the placeholder. */
export function MiniArt({person}:{person:any}){
 const [missing,setMissing]=useState(false);
 return <span className="es-mini-art">{missing||!person?.art?<Placeholder person={person||{id:'x',name:''}} compact/>:<img src={'./assets/'+person.art} alt="" loading="lazy" style={framedStyle(person.art,'face')} onError={()=>setMissing(true)}/>}</span>;
}
/** Portraits are 1024x1536 with the figure bottom-centred; lib/art-bounds.json records where the figure sits. */
const ART_W=1024,ART_H=1536;
/** The art zoomed so the figure itself (not the empty canvas around a wide pose) fills the box, standing on its floor. */
function FilledArt({src,alt,box,onError}:{src:string,alt:string,box:number[],onError:()=>void}){
 const ref=useRef<HTMLDivElement>(null),[size,setSize]=useState<[number,number]|null>(null);
 useLayoutEffect(()=>{const el=ref.current;if(!el)return;const measure=()=>{const r=el.getBoundingClientRect();if(r.width&&r.height)setSize([r.width,r.height])};
  measure();const ro=new ResizeObserver(measure);ro.observe(el);addEventListener('resize',measure);return()=>{ro.disconnect();removeEventListener('resize',measure)}},[]);
 let style:any={visibility:'hidden'};
 // Fill the height with the figure; only the body (box[4..5]) must fit the width, so a lightsaber tip or a
 // reaching hand may run off the edge. When the whole figure fits, centre it; otherwise centre the body.
 if(size){const [W,H]=size,[l,t,r,b,bl=l,br=r]=box,s=Math.min(H*0.97/((b-t)*ART_H),W*0.94/((br-bl)*ART_W));
  const whole=(r-l)*ART_W*s<=W,cx=whole?(l+r)/2:Math.min(Math.max((bl+br)/2,l+W/2/(ART_W*s)),r-W/2/(ART_W*s));
  style={position:'absolute',maxWidth:'none',width:ART_W*s,height:ART_H*s,left:W/2-cx*ART_W*s,bottom:-(1-b)*ART_H*s}}
 return <div ref={ref} className="art-fill"><img src={src} alt={alt} decoding="async" style={style} onError={onError}/></div>;
}
export default function CharacterArtwork({person,large=false,fill=false}:{person:any,large?:boolean,fill?:boolean}){
 const [missing,setMissing]=useState(false);
 const box=(BOUNDS as Record<string,number[]>)[person.art];
 return <div className={'character-artwork art-alive'+(large?' artwork-large':'')}>
  {missing||!person.art?<Placeholder person={person}/>:fill&&box?<FilledArt src={'./assets/'+person.art} alt={person.name} box={box} onError={()=>setMissing(true)}/>:<img src={'./assets/'+person.art} alt={person.name} decoding="async" onError={()=>setMissing(true)}/>}
 </div>;
}
