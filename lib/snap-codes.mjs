// The decks screen's pure parts: deck codes (the game's own format, base64 JSON of CardDefIds, so a list can
// come in from the game or a site), the keyword filter, the sort orders and the energy curve.
import {CARDS} from './snap/cards.mjs';

const norm=s=>String(s).toLowerCase().replace(/[^a-z0-9]/g,'');
let BY_NORM=null;
const index=()=>{if(BY_NORM)return BY_NORM;BY_NORM=new Map();for(const [id,d] of Object.entries(CARDS)){if(d.token)continue;BY_NORM.set(norm(id),id);BY_NORM.set(norm(d.name),id)}return BY_NORM};
const b64=s=>btoa(String.fromCharCode(...new TextEncoder().encode(s)));
const unb64=t=>new TextDecoder().decode(Uint8Array.from(atob(t.replace(/\s+/g,'')),c=>c.charCodeAt(0)));

/** A deck code: {"Cards":[{"CardDefId":"IronMan"},...]} in base64, the shape the game copies to the clipboard. */
export const encodeDeck=ids=>b64(JSON.stringify({Cards:ids.map(id=>({CardDefId:id}))}));
/** Reads a deck code, the bare JSON, or a list of card names (commas or lines). Names are matched by id or by
 *  name with punctuation and case ignored, so "Mister Sinister" and "MrSinister" both land. */
export function decodeDeck(text){
 const t=String(text||'').trim();if(!t)return {ids:[],unknown:[]};let names;
 const fromJson=j=>{const arr=Array.isArray(j)?j:j?.Cards||[];return arr.map(c=>typeof c==='string'?c:c?.CardDefId).filter(Boolean)};
 try{names=fromJson(JSON.parse(unb64(t)))}catch{try{names=fromJson(JSON.parse(t))}catch{names=t.split(/[,;\n]+/).map(x=>x.trim()).filter(Boolean)}}
 const ids=[],unknown=[];
 for(const n of names){const id=index().get(norm(n));if(!id)unknown.push(n);else if(!ids.includes(id))ids.push(id)}
 return {ids,unknown};
}

/** The keyword filter: a card has a keyword when its text says so (the Skill and No ability rows read the card itself). */
export const KEYWORDS=[['onreveal','On Reveal',/On Reveal/],['ongoing','Ongoing',/Ongoing/],['activate','Activate',/Activate/],['endofturn','End of Turn',/End of Turn/],
 ['startofturn','Start of Turn',/Start of Turn/],['gamestart','Game Start',/Game Start/],['discard','Discard',/[Dd]iscard/],['destroy','Destroy',/[Dd]estroy/],['move','Move',/\b[Mm]ove/],
 ['objective','Objective',/Objective/],['skill','Skill',null],['vanilla','No ability',null]];
export function hasKeyword(def,key){if(!key)return true;if(key==='skill')return !!def.skill;if(key==='vanilla')return !def.text;const k=KEYWORDS.find(x=>x[0]===key);return !!(k&&k[2]&&k[2].test(def.text||''))}

export const SORTS=[['cost','Cost'],['name','Name'],['power','Power'],['tier','Tier']];
export function sortIds(ids,by='cost',tiers={}){
 const n=id=>CARDS[id].name,byCost=(a,b)=>CARDS[a].cost-CARDS[b].cost||n(a).localeCompare(n(b));
 return [...ids].sort((a,b)=>by==='name'?n(a).localeCompare(n(b)):by==='power'?(CARDS[b].power-CARDS[a].power)||byCost(a,b):by==='tier'?((tiers[a]||9)-(tiers[b]||9))||byCost(a,b):byCost(a,b));
}
/** Cards per cost, 0 to 6+, and the average cost. */
export function curve(ids){const counts=[0,0,0,0,0,0,0];let sum=0;for(const id of ids){counts[Math.min(6,CARDS[id].cost)]++;sum+=CARDS[id].cost}return {counts,avg:ids.length?sum/ids.length:0}}
