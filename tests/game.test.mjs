import test from 'node:test';
import assert from 'node:assert/strict';
import {fresh,act,valid,decode,settle,rosterPower,fellowPower,fellowBasePower,heroPower,heroPowerFor,combinePower,rosterHalf,currentBlight,blightHp,fellowLevelCost,starCost,stagePower,newJourney,totalRate,FELLOW_JOIN_POINTS} from '../lib/game.mjs';
import {habitDue} from '../lib/habits.mjs';
import {FELLOWS,FAMILY,AREA_IDS,BUILDINGS,familyInArea,fellowsInArea} from '../lib/cast.mjs';
import {introFor,SCENES} from '../lib/stories.mjs';
import {joinNeed,migrate,blessings,BLESS_LINKED,playerStage} from '../lib/game.mjs';
import {XP_TABLE,levelForXp,skillLevel,totalLevel,XP_PER_POINT} from '../lib/skills.mjs';
import {QUESTS,questStatus,pendingTalk} from '../lib/quests.mjs';
import {TREES,ADVENTURES} from '../lib/dialogue.mjs';

const T=new Date('2026-10-14T10:00:00').getTime(); // a Wednesday
/** A save with a custom habit in `area`, so tests do not depend on the starter list. */
function withHabit(area,diff='hard',now=T){let s=fresh(now);const r=act(s,'habitSave',now,null,{title:'Test '+area,freq:'daily',diff,domain:area});assert.ok(!r.error,r.error);s=r.state;return {s,id:s.habits.items.at(-1).id}}

test('a fresh save is valid and round-trips through decode',()=>{const s=fresh(T);assert.ok(valid(s));assert.deepEqual(decode(JSON.stringify(s)),s)});

test('starter tasks import into the six areas',()=>{const s=fresh(T);for(const x of s.habits.items)assert.ok([...AREA_IDS,'general'].includes(x.domain),x.domain)});

test('completing a habit pays gold, XP, sigils and a roam charge',()=>{const {s,id}=withHabit('fitness');const r=act(s,'habitComplete',T,id);assert.ok(!r.error,r.error);const n=r.state;
 assert.equal(n.gold-s.gold,30);assert.equal(n.xp,30);assert.equal(n.sigils.fitness,3);assert.equal(n.roam.charges,s.roam.charges+1)});

test('a habit cannot pay twice in one day',()=>{const {s,id}=withHabit('work');let n=act(s,'habitComplete',T,id).state;n=act(n,'habitUncheck',T+1000,id).state;const again=act(n,'habitComplete',T+2000,id).state;assert.equal(again.xp,n.xp)});

test('undo reverses gold, XP and area rewards',()=>{const {s,id}=withHabit('home');const done=act(s,'habitComplete',T,id).state;const undone=act(done,'habitUndo',T+1000);assert.ok(!undone.error,undone.error);
 assert.equal(undone.state.xp,0);assert.equal(undone.state.sigils.home,0);assert.equal(undone.state.roam.charges,s.roam.charges);assert.ok(Math.abs(undone.state.gold-s.gold)<1)});

test('a Fellow is ready after enough habit points in their area, and announced once',()=>{const {s,id}=withHabit('fitness','hard');const darrow=FELLOWS.find(f=>f.area==='fitness');
 assert.ok(act(s,'recruitFellow',T,darrow.id).error);const r=act(s,'habitComplete',T,id);assert.ok(3>=FELLOW_JOIN_POINTS);assert.deepEqual(r.arrivals.map(a=>a.id),[darrow.id]);
 const j=act(r.state,'recruitFellow',T,darrow.id);assert.ok(!j.error,j.error);assert.deepEqual(j.state.fellows[darrow.id],{level:1,stars:0})});

test('the power formula is the documented one',()=>{assert.equal(fellowBasePower(10,0),1000);assert.equal(fellowBasePower(10,2),1500);assert.equal(heroPowerFor(100,1),2500);assert.equal(heroPowerFor(100,3),3250);
 assert.equal(combinePower(1000,1000),2400);assert.equal(combinePower(1000,0),1000);
 let s=fresh(T);s={...s,fellows:{darrow:{level:10,stars:2}}};assert.equal(fellowPower(s,'darrow'),1500);assert.equal(rosterHalf(s),1500);assert.equal(rosterPower(s),combinePower(heroPower(s),1500))});

test('Family blessings multiply Fellow power',()=>{let s=fresh(T);s={...s,fellows:{darrow:{level:10,stars:0}},family:{kira:{bond:0}}};
 // Bond level 1: linked +3%, everyone +0.5%.
 assert.equal(fellowPower(s,'darrow'),Math.round(1000*1.03*1.005))});

test('levelling costs gold and respects the star cap',()=>{let s={...fresh(T),gold:1e9,fellows:{darrow:{level:1,stars:0}}};const r=act(s,'levelUp',T,'darrow','max');assert.equal(r.state.fellows.darrow.level,20);assert.ok(act(r.state,'levelUp',T,'darrow',1).error);
 assert.equal(s.gold-r.state.gold,Array.from({length:19},(_,i)=>fellowLevelCost(i+1)).reduce((a,b)=>a+b,0))});

test('stars cost sigils of the Fellow’s own area',()=>{let s={...fresh(T),fellows:{darrow:{level:1,stars:0}}};assert.ok(act(s,'starUp',T,'darrow').error);s={...s,sigils:{...s.sigils,fitness:starCost(1)}};const r=act(s,'starUp',T,'darrow');assert.equal(r.state.fellows.darrow.stars,1);assert.equal(r.state.sigils.fitness,0)});

test('stages are a power check',()=>{const s=fresh(T);assert.ok(act(s,'challenge',T).error);const strong={...s,fellows:{darrow:{level:20,stars:0}}};const r=act(strong,'challenge',T);assert.ok(!r.error,r.error);assert.equal(r.state.stage.cleared,1);assert.ok(stagePower(2)>stagePower(1))});

test('the weekly blight takes double damage from its opposed areas',()=>{const {s,id}=withHabit('fitness','hard');const b0=currentBlight(s,T);const n=act(s,'habitComplete',T,id).state;const b=currentBlight(n,T);
 assert.equal(b.damage-b0.damage,b.opposed.includes('fitness')?6:3);assert.equal(b.hp,blightHp(0))});

test('defeating a blight raises its tier for next time',()=>{let s=fresh(T);const b=currentBlight(s,T);s={...s,habits:{...s.habits,history:[{id:'x',title:'x',period:'d:2026-10-14',day:'2026-10-14',at:T,gold:0,points:3,domain:b.opposed[0],kind:'complete'}].concat(Array.from({length:30},(_,i)=>({id:'y'+i,title:'y',period:'d:2026-10-14',day:'2026-10-14',at:T,gold:0,points:3,domain:b.opposed[0],kind:'complete'})))}};
 const r=act(s,'blightClaim',T);assert.ok(!r.error,r.error);assert.equal(r.state.blights.tiers[b.id],1);assert.ok(act(r.state,'blightClaim',T).error)});

test('buildings earn gold over time, boosted by today’s habits in their area',()=>{let s={...fresh(T),gold:1e6};s=act(s,'buildingUpgrade',T,'yard').state;const base=totalRate(s,T);assert.ok(base>0);const {id}=withHabit('fitness');
 const later=settle(s,T+3600e3);assert.ok(later.gold>s.gold)});

test('roaming spends a charge and works before anyone has joined',()=>{const s=fresh(T);const r=act(s,'roam',T);assert.ok(!r.error,r.error);assert.equal(r.state.roam.charges,s.roam.charges-1);assert.ok(r.scene)});

test('family visits and gifts raise bond',()=>{let s={...fresh(T),gold:1e4,family:{tyrande:{bond:0}}};const v=act(s,'visit',T,'tyrande');assert.equal(v.state.family.tyrande.bond,30);assert.ok(act(v.state,'visit',T+1000,'tyrande').error);const g=act(v.state,'gift',T,'tyrande','posy');assert.equal(g.state.family.tyrande.bond,80)});

test('new journey keeps the habit journal and resets the village',()=>{const {s,id}=withHabit('faith');const done={...act(s,'habitComplete',T,id).state,fellows:{aldric:{level:5,stars:1}}};const n=newJourney(done,T);assert.deepEqual(n.fellows,{});assert.equal(n.habits.history.length,done.habits.history.length)});

test('every area has at least one Fellow, one Family member and a building; every character is in a real area',()=>{for(const a of AREA_IDS){assert.ok(FELLOWS.some(f=>f.area===a),'fellow for '+a);assert.ok(FAMILY.some(f=>f.area===a),'family for '+a);assert.ok(BUILDINGS.some(b=>b.area===a),'building for '+a)}for(const c of [...FELLOWS,...FAMILY])assert.ok(AREA_IDS.includes(c.area),c.id);assert.equal(new Set([...FELLOWS,...FAMILY].map(c=>c.id)).size,FELLOWS.length+FAMILY.length,'ids are unique')});

test('the second character in an area joins later than the first',()=>{const fam=familyInArea('fitness');assert.ok(fam.length>=2);const [a,b]=fam.map(joinNeed);assert.ok(b.points>a.points&&b.level>a.level)});

test('a Family member blesses every Fellow in her area',()=>{const area=AREA_IDS.find(a=>fellowsInArea(a).length&&familyInArea(a).length);const f=fellowsInArea(area)[0],m=familyInArea(area)[0];const s={...fresh(T),fellows:{[f.id]:{level:1,stars:0}},family:{[m.id]:{bond:0}}};assert.equal(blessings(s).linked[f.id],BLESS_LINKED)});

test('old saves load: swapped characters are renamed, removed ones dropped, old habit areas remapped',()=>{const s=fresh(T);const old={...s,fellows:{kael:{level:4,stars:1},nobody:{level:2,stars:0}},family:{maren:{bond:90}},sigils:{faith:1,family:7,fitness:2,work:0,home:0,discipline:0},habits:{...s.habits,items:s.habits.items.map((x,i)=>i===0?{...x,domain:'family'}:x),totals:{...s.habits.totals,family:{actions:3,points:6}}}};delete old.sigils.marriage;
 const m=decode(JSON.stringify(old));assert.deepEqual(m.fellows,{darrow:{level:4,stars:1}});assert.deepEqual(m.family,{tyrande:{bond:90}});assert.equal(m.sigils.marriage,7);assert.equal(m.habits.items[0].domain,'marriage');assert.equal(m.habits.totals.marriage.points,6);assert.ok(valid(m))});

test('every character has an introduction, written or generated',()=>{for(const c of [...FELLOWS,...FAMILY]){const s=introFor(c.id);assert.ok(s&&s.lines.length,c.id)}});

test('written scenes only use real characters as speakers, and every character has an intro and roams',()=>{const ids=new Set([...FELLOWS,...FAMILY].map(c=>c.id));for(const c of [...FELLOWS,...FAMILY]){assert.ok(SCENES[c.id],'scenes for '+c.id);assert.ok(SCENES[c.id].roams.length>=1,c.id)}
 for(const [id,s] of Object.entries(SCENES)){assert.ok(ids.has(id),'scene owner '+id+' is in the cast');for(const lines of [s.intro,...s.roams.map(r=>r.lines)])for(const l of lines)if(Array.isArray(l))assert.ok(ids.has(l[0]),id+' speaker '+l[0])}});

test('skills use RuneScape\'s XP table',()=>{assert.equal(XP_TABLE[2],83);assert.equal(XP_TABLE[50],101333);assert.equal(XP_TABLE[92],6517253);assert.equal(XP_TABLE[99],13034431);assert.equal(levelForXp(0),1);assert.equal(levelForXp(13034431),99);assert.equal(levelForXp(1e9),99)});

test('habits train their area\'s skill and total level starts at 8',()=>{const {s,id}=withHabit('fitness','hard');assert.equal(totalLevel(s),8);const r=act(s,'habitComplete',T,id);assert.equal(skillLevel(r.state,'fitness'),levelForXp(3*XP_PER_POINT));assert.deepEqual(r.levelUps.map(u=>u.area),['fitness'])});

test('armour tiers unlock by total level',()=>{assert.equal(playerStage(8).stage,1);assert.equal(playerStage(150).stage,2);assert.equal(playerStage(540).stage,7)});

test('dialogue trees only point at nodes that exist, and every adventure has a tree',()=>{for(const [id,t] of Object.entries(TREES)){assert.ok(t.nodes[t.start],id+' start');for(const [k,n] of Object.entries(t.nodes)){if(n.next)assert.ok(t.nodes[n.next],id+':'+k+' next');for(const o of n.opts||[])assert.ok(t.nodes[o.next],id+':'+k+' opt '+o.next);assert.ok(n.next||n.opts||n.end,id+':'+k+' leads somewhere')}}for(const a of Object.values(ADVENTURES).flat())assert.ok(TREES[a.id]?.adventure,a.id)});

test('The Iron Body: talk, habits, talk, three days, talk, complete',()=>{let {s,id}=withHabit('fitness','hard');s={...s,fellows:{darrow:{level:1,stars:0}}};
 assert.equal(questStatus(s,'iron-body').status,'available');assert.equal(pendingTalk(s,'darrow').tree,'iron-body-1');
 let r=act(s,'dialogue',T,'iron-body-1',{node:'offer',opt:0});assert.ok(!r.error,r.error);s=r.state;assert.equal(questStatus(s,'iron-body').step.type,'habits');
 assert.ok(act(s,'dialogue',T,'iron-body-2',{node:'e',opt:0}).error,'cannot skip ahead');
 for(let d=0;d<3;d++){s=act(s,'habitComplete',T+d*864e5,id).state}
 assert.equal(pendingTalk(s,'darrow').tree,'iron-body-2');
 const D=T+3*864e5;r=act(s,'dialogue',D,'iron-body-2',{node:'e',opt:0});assert.ok(!r.error,r.error);s=r.state;assert.equal(questStatus(s,'iron-body').step.type,'days');
 for(let d=1;d<=3;d++){s=act(s,'habitComplete',D+d*864e5,id).state}
 assert.equal(pendingTalk(s,'darrow').tree,'iron-body-3');
 const gold=s.gold;r=act(s,'dialogue',D+5*864e5,'iron-body-3',{node:'d',opt:null});assert.ok(!r.error,r.error);assert.equal(r.questDone,'iron-body');assert.equal(questStatus(r.state,'iron-body').status,'done');assert.ok(r.state.gold>=gold+1500);assert.ok(r.state.bonusXp.fitness>=5000);
 const again=act(r.state,'dialogue',D+6*864e5,'iron-body-3',{node:'d',opt:null});assert.equal(again.state.gold,r.state.gold,'rewards pay once')});

test('adventures cost a roam each time and pay every time',()=>{let s={...fresh(T),roam:{charges:2,seen:[]}};
 let r=act(s,'dialogue',T,'yard-sandbags',{node:'b',opt:0});assert.ok(!r.error,r.error);assert.equal(r.state.roam.charges,1);assert.equal(r.state.bonusXp.fitness,600);
 r=act(r.state,'dialogue',T,'yard-sandbags',{node:'b',opt:0});assert.equal(r.state.roam.charges,0);assert.equal(r.state.bonusXp.fitness,1200);
 assert.ok(act(r.state,'dialogue',T,'yard-sandbags',{node:'b',opt:0}).error,'no roams left')});
