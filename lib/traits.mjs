// What makes one character different from the next, beyond level and bond: a specialty (the one mode they count
// extra in), a role (what they are for besides fighting), the franchise set they can complete, and the relic they wear.
// Data only; the formulas that use it are in lib/game.mjs ("Formulas"). Every bonus here is a multiplier on a
// Power check or a reward, never a new rule inside a fight.
import {FRANCHISE,FRANCHISES} from './franchises.mjs';

/** Specialties, one per War Table mode: a specialist counts ×SPEC_MULT there (and more after a Focus path). */
export const SPECS={rift:{name:'Riftwalker',where:'the Rift'},spire:{name:'Climber',where:'the Spire'},arena:{name:'Duelist',where:'the Arena'},front:{name:'Shieldwall',where:'the Eight Fronts'},
 trial:{name:'Peacemaker',where:'the Trials'},errand:{name:'Errand-runner',where:'Errands'},strike:{name:'Blightbane',where:'Blight strikes'},gauntlet:{name:'Pathfinder',where:'the Gauntlet'}};
/** Roles: Fighters bring nothing but Power; the other three change what a squad brings home or how it holds up. */
export const ROLES={fighter:{name:'Fighter',text:'Power, plain and simple.'},provider:{name:'Provider',text:'Squads and crews with a Provider bring home +5% gold.'},
 mentor:{name:'Mentor',text:'Squads with a Mentor earn +5% Fellow EXP.'},guardian:{name:'Guardian',text:'A Front with a Guardian holds one more wave; Gauntlet wounds are 2 lighter per Guardian.'}};

/** id: specialty/role, by lore. Fellows cannot run Errands or strike the Blight; Family cannot enter the Rift or the Spire. */
const TABLE=`obiwan:trial/mentor matt:front/guardian tchalla:arena/guardian tavi:trial/mentor steve:front/guardian din:gauntlet/guardian logan:arena/fighter quill:gauntlet/provider
darrow:arena/fighter roy:spire/fighter grog:arena/fighter geralt:gauntlet/fighter tony:spire/provider kelsier:rift/provider bruce:trial/mentor peter:rift/fighter piotr:front/guardian
kaladin:front/guardian stephen:rift/mentor anakin:arena/fighter ash:gauntlet/fighter harry:trial/fighter thor:arena/fighter uther:front/guardian saradomin:trial/mentor
malfurion:trial/mentor thrall:front/mentor cal:gauntlet/fighter varian:arena/guardian baine:front/guardian vannaka:spire/fighter magni:spire/provider duradel:spire/fighter
dumbledore:trial/mentor deadpool:gauntlet/fighter revan:rift/fighter wiseoldman:spire/provider rocket:gauntlet/provider dalinar:front/guardian ragnar:front/guardian sevro:gauntlet/fighter
ariane:trial/mentor ahsoka:arena/fighter lys:trial/mentor keyleth:trial/mentor shadowheart:strike/guardian megan:errand/provider tyrande:strike/guardian padme:errand/provider
yennefer:strike/fighter briget:errand/provider kitai:arena/fighter victra:arena/fighter vin:gauntlet/fighter hera:errand/provider liko:gauntlet/fighter wanda:strike/fighter jean:strike/fighter
kira:arena/fighter fannie:gauntlet/fighter rey:front/fighter nemona:arena/fighter karlach:front/guardian shallan:trial/mentor jaina:strike/mentor nash:errand/provider carol:arena/fighter
gamora:front/fighter virginia:errand/provider leia:front/guardian kate:errand/provider gwen:gauntlet/fighter ororo:strike/guardian kay:errand/provider annamarie:front/guardian
violet:front/fighter alleria:strike/fighter vex:gauntlet/provider laezel:arena/fighter natasha:gauntlet/fighter hermione:trial/mentor misty:errand/provider rumi:strike/fighter
jester:trial/provider mira:arena/fighter zoey:gauntlet/fighter ana:trial/mentor lilian:gauntlet/fighter morgana:strike/fighter soraka:trial/guardian alexstrasza:trial/guardian
amara:errand/provider ashe:front/fighter navani:errand/mentor draka:front/guardian moira:errand/provider quinn:gauntlet/fighter samira:arena/fighter vi:arena/fighter kelsey:errand/provider
missfortune:errand/provider talanji:strike/mentor maggie:errand/provider caitlyn:front/guardian garona:gauntlet/fighter riven:arena/fighter sylvanas:strike/fighter xalatath:strike/fighter
jasnah:trial/mentor seraphine:trial/provider sona:trial/mentor amah:front/guardian thalyssra:errand/mentor valeera:gauntlet/fighter liadrin:strike/guardian yrel:front/guardian
zilyana:arena/fighter ellamaria:errand/provider nieve:gauntlet/fighter poppy:front/guardian lulu:trial/fighter syl:trial/mentor anna:errand/provider elsa:strike/guardian helen:gauntlet/guardian
jessica:errand/provider magik:strike/fighter mystique:gauntlet/fighter nico:strike/fighter shuri:errand/mentor sue:front/guardian wasp:gauntlet/fighter moana:errand/provider
vanellope:gauntlet/fighter emma:trial/mentor jubilee:arena/fighter kamala:front/guardian vampanna:strike/fighter`;
/** @type {Record<string,{spec:string,role:string}>} */
export const TRAITS={};for(const e of TABLE.split(/\s+/)){const [id,rest]=e.split(':'),[spec,role]=rest.split('/');TRAITS[id]={spec,role}}
export const specOf=id=>TRAITS[id]?.spec||null;
export const roleOf=id=>TRAITS[id]?.role||'fighter';

/** Franchise sets: three of a franchise in one squad fight under their banner. */
export const SET_NAMES={'Star Wars':'Jedi Council','Marvel':'Avengers Assemble','Warcraft':'For Azeroth','RuneScape':'Gielinor’s Finest','Cosmere':'Knights Radiant','Red Rising':'The Howlers',
 'Codex Alera':'Legion of Alera','Critical Role':'Vox Machina','Pokémon':'Gym Challenge','Wizarding World':'Dumbledore’s Army','League of Legends':'Summoner’s Rift','Disney':'Happily Ever After',
 'Baldur’s Gate 3':'Camp Fire','The Witcher':'School of the Wolf','Fantasy Favourites':'Old Friends'};
/** The franchise a squad has at least `size` of, or null. */
export const squadSet=(ids,size)=>{/** @type {Record<string,number>} */const n={};for(const id of ids){const f=FRANCHISE[id];if(f)n[f]=(n[f]||0)+1}return Object.keys(n).find(f=>n[f]>=size)||null};

/** Relics: gear that drops. One slot per character; an affix is a fraction `value` of one `kind`:
 *  power (the wearer's Power, everywhere), a mode name (the wearer counts ×(1+value) there), gold or exp (squads with the wearer earn more). */
export const TIERS={common:{name:'Common',color:'#b9b9b9'},rare:{name:'Rare',color:'#4f8fe0'},epic:{name:'Epic',color:'#b05fe0'},legendary:{name:'Legendary',color:'#f5a623'}};
/** @type {Record<string,number>} */
const TIER_VALUE={common:0.1,rare:0.2,epic:0.35};
/** @type {Record<string,string[]>} */
const MODE_NAMES={rift:['Rift Shard','Rift Compass','Riftwalker’s Lantern'],spire:['Climber’s Chalk','Spire Key','Skyward Banner'],arena:['Duelling Glove','Champion’s Sash','The Crowd’s Roar'],
 front:['Palisade Stake','Shieldwall Plate','Standard of the Eight'],trial:['Riddle Token','Peacemaker’s Seal','Trialmaster’s Scales'],errand:['Running Boots','Courier’s Satchel','Village Charter'],
 strike:['Blight Salt','Censer of Ash','Blightbane Brand'],gauntlet:['Trail Ration','Pathfinder’s Map','Gauntlet Crown']};
const GOLD_NAMES=['Lucky Coin','Merchant’s Ledger','Dragon’s Hoard Key'],EXP_NAMES=['Training Dummy','Sergeant’s Whistle','Tome of Drills'];
/** Legendaries: one per franchise, +25% Power (doubled on one of its own), each dropped only by the region boss it belongs with. */
const LEGENDARIES=[['silver-sword','Silver Sword','The Witcher','count-draynor'],['fury-stone','Fury-Stone of Alera','Codex Alera','giant-mole'],['doomhammer','The Doomhammer','Warcraft','barrows'],
 ['kyber-crystal','Kyber Crystal','Star Wars','tztok-jad'],['master-ball','Master Ball','Pokémon','kalphite-queen'],['whisper','Whisper','Critical Role','dagannoth-kings'],
 ['vibranium-shield','Vibranium Shield','Marvel','king-black-dragon'],['heart-of-te-fiti','Heart of Te Fiti','Disney','kraken'],['shardblade','Shardblade','Cosmere','great-olm'],
 ['elder-wand','The Elder Wand','Wizarding World','nex'],['hearthstone','The Hearthstone','Fantasy Favourites','bryophyta'],['infinity-edge','Infinity Edge','League of Legends','hunllef'],
 ['razor','The Razor','Red Rising','vorkath'],['astral-prism','Astral Prism','Baldur’s Gate 3','zulrah'],['abyssal-whip','Abyssal Whip','RuneScape','abyssal-sire']];
export const LEGENDARY_POWER=0.25;
/** @type {{id:string,name:string,tier:string,kind:string,value:number,franchise?:string,boss?:string}[]} */
export const RELICS=[];
for(const [mode,names] of Object.entries(MODE_NAMES))Object.keys(TIER_VALUE).forEach((tier,i)=>RELICS.push({id:`${mode}-${tier}`,name:names[i],tier,kind:mode,value:TIER_VALUE[tier]}));
RELICS.push({id:'power-rare',name:'Old Whetstone',tier:'rare',kind:'power',value:0.05},{id:'power-epic',name:'Hearthstone Charm',tier:'epic',kind:'power',value:0.1});
Object.keys(TIER_VALUE).forEach((tier,i)=>RELICS.push({id:`gold-${tier}`,name:GOLD_NAMES[i],tier,kind:'gold',value:TIER_VALUE[tier]},{id:`exp-${tier}`,name:EXP_NAMES[i],tier,kind:'exp',value:TIER_VALUE[tier]}));
for(const [id,name,franchise,boss] of LEGENDARIES)RELICS.push({id,name,tier:'legendary',kind:'power',value:LEGENDARY_POWER,franchise,boss});
/** @type {Record<string,any>} */
export const RELIC_BY_ID=Object.fromEntries(RELICS.map(r=>[r.id,r]));
export const relicById=id=>RELIC_BY_ID[id]||null;
/** Two gear slots: mode and Power relics are weapons, gold and EXP relics are charms. */
export const SLOTS={weapon:'Weapon',charm:'Charm'};
export const slotOf=r=>r.kind==='gold'||r.kind==='exp'?'charm':'weapon';
export const relicsOfTier=tier=>RELICS.filter(r=>r.tier===tier&&!r.boss);
export const legendaryOfBoss=bossId=>RELICS.find(r=>r.boss===bossId)||null;
/** What a relic does, in words. */
export function relicText(r){const pct=Math.round(r.value*100)+'%';
 if(r.kind==='power')return `+${pct} Power for the wearer${r.franchise?`, +${Math.round(r.value*200)}% on one of ${r.franchise}’s own`:''}`;
 if(r.kind==='gold')return `+${pct} gold for squads and crews with the wearer`;if(r.kind==='exp')return `+${pct} Fellow EXP for squads with the wearer`;
 return `the wearer counts ×${(1+r.value).toFixed(2)} in ${SPECS[r.kind].where}`}
export {FRANCHISE,FRANCHISES};
