// Skills: each life area is a RuneScape-style skill, levelled 1–99 on RuneScape's own XP table.
// Skill XP is derived, not stored: lifetime habit points in the area × XP_PER_POINT, plus bonus XP
// earned from quests, adventures and lamps (state.bonusXp). So undo, imports and old saves just work.
import {AREAS,AREA_IDS} from './cast.mjs';

/** XP from one habit point (easy 1 / normal 2 / hard 3 points). Tuned so a steady year in an area reaches ~70. */
export const XP_PER_POINT=500;
export const MAX_LEVEL=99;

/** RuneScape's XP table: XP_TABLE[L] is the total XP needed for level L (XP_TABLE[99] = 13,034,431). */
export const XP_TABLE=(()=>{const t=[0,0];let pts=0;for(let L=1;L<MAX_LEVEL;L++){pts+=Math.floor(L+300*2**(L/7));t.push(Math.floor(pts/4))}return t})();
export const levelForXp=xp=>{let L=1;while(L<MAX_LEVEL&&xp>=XP_TABLE[L+1])L++;return L};

/** The RuneScape skill each life area wears: name for flavour, icon and cape art in public/assets/rs/. */
export const SKILL_STYLE={faith:'Prayer',marriage:'Hitpoints',fatherhood:'Farming',fitness:'Strength',work:'Smithing',home:'Construction',discipline:'Defence',hobbies:'Fishing'};
export const skillIcon=area=>'rs/skill-'+area+'.png';
export const capeArt=area=>'rs/cape-'+area+'.webp';

export const skillXp=(state,area)=>(state.habits?.totals?.[area]?.points||0)*XP_PER_POINT+(state.bonusXp?.[area]||0);
export const skillLevel=(state,area)=>levelForXp(skillXp(state,area));
/** @returns {{area:string,name:string,style:string,xp:number,level:number,floor:number,next:number|null,into:number,need:number}} */
export function skillInfo(state,area){const xp=skillXp(state,area),level=levelForXp(xp),floor=XP_TABLE[level],next=level<MAX_LEVEL?XP_TABLE[level+1]:null;
 return {area,name:AREAS.find(a=>a.id===area)?.name||area,style:SKILL_STYLE[area],xp,level,floor,next,into:xp-floor,need:next===null?0:next-floor}}
export const skillLevels=state=>Object.fromEntries(AREA_IDS.map(a=>[a,skillLevel(state,a)]));
/** Total level: the sum of all eight skills (8 at the start, 792 when every skill is 99). */
export const totalLevel=state=>AREA_IDS.reduce((n,a)=>n+skillLevel(state,a),0);
export const MAX_TOTAL=MAX_LEVEL*AREA_IDS.length;
/** Skills that went up between two states, for the level-up popups. */
export function levelUps(before,after){const out=[];for(const a of AREA_IDS){const b=skillLevel(before,a),n=skillLevel(after,a);if(n>b)out.push({area:a,level:n,from:b})}return out}
