import {useEffect,useRef,useState} from 'react';
import art from '@/lib/village-map-data.json';
import {BUILDINGS,areaById} from '@/lib/cast.mjs';
import {BUILDING_OPEN_COST,areaBoost} from '@/lib/game.mjs';
const GROUND=art.ground,ASPECT=GROUND.width/GROUND.height,SCROLL_KEY='everstead-village-scroll';
const sprites=art.buildings as Record<string,{src:string,width:number,height:number}>;
/** Places that are not life-area buildings: the habit journal, the watchtower (expedition map) and the gate (roaming). */
const LANDMARKS=[
 {id:'habits',label:'Habit Journal',sprite:'habits',module:'habits',x:36,y:36},
 {id:'tower',label:'Expedition Map',sprite:'Building_1501',module:'stage',x:66,y:52},
 {id:'gate',label:'Village Gate',sprite:'Building_601',module:'roaming',x:33,y:81.1},
];
/** Everstead: one continuous village you pan across. Each life area owns a building; today's habits
 *  in that area light it up (the glow is the area boost, the same number that raises its income). */
export default function VillageMap({game,openBuilding,openModule,objective,side,blight}:any){
 const [scroller,setScroller]=useState<HTMLDivElement|null>(null),[size,setSize]=useState({w:0,h:0}),placed=useRef(false);
 useEffect(()=>{if(!scroller)return;const fit=()=>{const h=Math.max(scroller.clientHeight,540);setSize({w:h*ASPECT,h})};fit();const ro=new ResizeObserver(fit);ro.observe(scroller);return()=>ro.disconnect()},[scroller]);
 useEffect(()=>{if(!scroller||!size.w||placed.current)return;placed.current=true;let x=0;try{x=Number(sessionStorage.getItem(SCROLL_KEY))||0}catch{}scroller.scrollLeft=x;scroller.scrollTop=(size.h-scroller.clientHeight)/2},[scroller,size]);
 const remember=()=>{try{sessionStorage.setItem(SCROLL_KEY,String(Math.round(scroller?.scrollLeft||0)))}catch{}};
 const now=game.lastAt;
 return <section className="world spatial-village" aria-label="Everstead">
  <div className="village-scroller" ref={setScroller} onScroll={remember}><div className={'village-canvas'+(blight&&!blight.defeated?' blighted':'')} style={size.w?{width:size.w,height:size.h}:undefined}>
   <img className="village-ground" src={'./assets/'+GROUND.src} alt="" draggable={false}/>
   {BUILDINGS.map(b=>{const s=sprites[b.sprite],lvl=game.buildings[b.id]?.level||0,boost=areaBoost(game,b.area,now),area=areaById(b.area);
    return <button type="button" key={b.id} className={'village-building'+(lvl?'':' es-unbuilt')+(boost>0?' es-lit':'')} style={{left:b.x+'%',top:b.y+'%',width:s.width/GROUND.width*100+'%',['--area' as any]:area.color}} aria-label={'Visit '+b.name} aria-haspopup="dialog" onClick={()=>openBuilding(b.id)}>
     <img src={'./assets/'+s.src} alt="" draggable={false}/>
     <span>{b.name}<small>{lvl?`Lv ${lvl} · ${area.name}`+(boost>0?` · +${Math.round(boost*100)}%`:''):`Build · ${BUILDING_OPEN_COST} gold`}</small></span>
    </button>})}
   {LANDMARKS.map(l=>{const s=sprites[l.sprite];return <button type="button" key={l.id} className="village-building es-landmark" style={{left:l.x+'%',top:l.y+'%',width:s.width/GROUND.width*100+'%'}} aria-label={'Visit '+l.label} aria-haspopup="dialog" onClick={()=>openModule(l.module)}>
    <img src={'./assets/'+s.src} alt="" draggable={false}/><span>{l.label}</span></button>})}
  </div></div>{side}{objective}
 </section>;
}
