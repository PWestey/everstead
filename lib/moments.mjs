// Moments: short pop-up conversations when you level a Fellow (every 5th level), give him a star,
// spend time with a Family member or give her a gift. They are flavour only: no effects, no rewards.
// Written content lives in lib/moments/*.mjs as {open:[lines], opts:[{t, r:[lines]}]}; a line that
// starts with "* " is narration. Each moment becomes a dialogue tree with id m:<who>:<kind>:<n>.
import {characterById} from './cast.mjs';
import {FELLOW_MOMENTS as FA} from './moments/fellows-a.mjs';
import {FELLOW_MOMENTS as FB} from './moments/fellows-b.mjs';
import {FAMILY_MOMENTS as MA} from './moments/family-a.mjs';
import {FAMILY_MOMENTS as MB} from './moments/family-b.mjs';

/** @type {Record<string,{level:any[],star:any[]}>} */
export const FELLOW_MOMENTS={...FA,...FB};
/** @type {Record<string,{visit:any[],gift:string[]}>} */
export const FAMILY_MOMENTS={...MA,...MB};

/** Backdrop for each life area's moments. */
const BG={faith:'facility-scenes/fountain.webp',marriage:'facility-scenes/banquets.webp',fatherhood:'facility-scenes/stories.webp',fitness:'facility-scenes/raphael.webp',
 work:'facility-scenes/trading.webp',home:'ui-scenes/Bg_Village_01_Mid.jpg',discipline:'facility-scenes/school.webp',hobbies:'facility-scenes/fishing.webp'};

/** One written line → a dialogue node. "* text" is narration; "castId: text" or "player: text" names the speaker;
 *  anything else is spoken by `who` (or narrated when there is no `who`). */
const line=(who,l)=>{if(l.startsWith('* '))return {s:'narrator',t:l.slice(2)};const m=/^([a-z]+): (.*)$/s.exec(l);if(m&&(m[1]==='player'||characterById(m[1])))return {s:m[1],t:m[2]};return {s:who||'narrator',t:l}};
/** Turns one written moment {open, opts:[{t, r}]} into a dialogue tree. Expedition scenes reuse it with no `who`. */
export function treeFor(who,m,bg=BG[characterById(who)?.area]||BG.home,extra={}){const nodes={};const open=m.open.map(l=>line(who,l));
 open.forEach((n,i)=>{nodes['o'+i]=i<open.length-1?{...n,next:'o'+(i+1)}:m.opts?{...n,opts:m.opts.map((o,j)=>({t:o.t,next:'r'+j+'_0'}))}:{...n,end:true}});
 (m.opts||[]).forEach((o,j)=>o.r.forEach((l,k)=>{nodes['r'+j+'_'+k]={...line(who,l),...(k<o.r.length-1?{next:'r'+j+'_'+(k+1)}:{end:true})}}));
 return {who,bg,start:'o0',moment:true,...extra,nodes}}

/** Every moment as a dialogue tree, keyed m:<who>:<kind>:<n>. Gifts are one-line trees. */
export const MOMENT_TREES={};
for(const [who,v] of Object.entries(FELLOW_MOMENTS))for(const kind of ['level','star'])v[kind].forEach((m,i)=>{MOMENT_TREES[`m:${who}:${kind}:${i}`]=treeFor(who,m)});
for(const [who,v] of Object.entries(FAMILY_MOMENTS)){v.visit.forEach((m,i)=>{MOMENT_TREES[`m:${who}:visit:${i}`]=treeFor(who,m)});v.gift.forEach((l,i)=>{MOMENT_TREES[`m:${who}:gift:${i}`]=treeFor(who,{open:[l]})})}

/** The moment tree to show, or null if none was written. `n` picks in rotation. */
export function momentId(who,kind,n){const v=FELLOW_MOMENTS[who]?.[kind]||FAMILY_MOMENTS[who]?.[kind];if(!v?.length)return null;return `m:${who}:${kind}:${((n%v.length)+v.length)%v.length}`}
