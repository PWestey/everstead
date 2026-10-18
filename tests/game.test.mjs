import test from 'node:test';
import assert from 'node:assert/strict';
import {fresh,act,valid,decode,settle,rosterPower,fellowPower,fellowBasePower,playerLevel,playerPower,currentBlight,blightHp,fellowLevelCost,starCost,stagePower,newJourney,totalRate,FELLOW_JOIN_POINTS} from '../lib/game.mjs';
import {habitDue} from '../lib/habits.mjs';
import {FELLOWS,FAMILY,AREA_IDS} from '../lib/cast.mjs';

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

test('a Fellow is ready after enough habit points in their area, and announced once',()=>{const {s,id}=withHabit('fitness','hard');const kael=FELLOWS.find(f=>f.area==='fitness');
 assert.ok(act(s,'recruitFellow',T,kael.id).error);const r=act(s,'habitComplete',T,id);assert.ok(3>=FELLOW_JOIN_POINTS);assert.deepEqual(r.arrivals.map(a=>a.id),[kael.id]);
 const j=act(r.state,'recruitFellow',T,kael.id);assert.ok(!j.error,j.error);assert.deepEqual(j.state.fellows[kael.id],{level:1,stars:0})});

test('the power formula is the documented one',()=>{assert.equal(fellowBasePower(10,0),1000);assert.equal(fellowBasePower(10,2),1500);assert.equal(playerPower(4),600);
 let s=fresh(T);s={...s,fellows:{kael:{level:10,stars:2}}};assert.equal(fellowPower(s,'kael'),1500);assert.equal(rosterPower(s),1500+playerPower(playerLevel(0)))});

test('Family blessings multiply Fellow power',()=>{let s=fresh(T);s={...s,fellows:{kael:{level:10,stars:0}},family:{kira:{bond:0}}};
 // Bond level 1: linked +3%, everyone +0.5%.
 assert.equal(fellowPower(s,'kael'),Math.round(1000*1.03*1.005))});

test('levelling costs gold and respects the star cap',()=>{let s={...fresh(T),gold:1e9,fellows:{kael:{level:1,stars:0}}};const r=act(s,'levelUp',T,'kael','max');assert.equal(r.state.fellows.kael.level,20);assert.ok(act(r.state,'levelUp',T,'kael',1).error);
 assert.equal(s.gold-r.state.gold,Array.from({length:19},(_,i)=>fellowLevelCost(i+1)).reduce((a,b)=>a+b,0))});

test('stars cost sigils of the Fellow’s own area',()=>{let s={...fresh(T),fellows:{kael:{level:1,stars:0}}};assert.ok(act(s,'starUp',T,'kael').error);s={...s,sigils:{...s.sigils,fitness:starCost(1)}};const r=act(s,'starUp',T,'kael');assert.equal(r.state.fellows.kael.stars,1);assert.equal(r.state.sigils.fitness,0)});

test('stages are a power check',()=>{const s=fresh(T);assert.ok(act(s,'challenge',T).error);const strong={...s,fellows:{kael:{level:20,stars:0}}};const r=act(strong,'challenge',T);assert.ok(!r.error,r.error);assert.equal(r.state.stage.cleared,1);assert.ok(stagePower(2)>stagePower(1))});

test('the weekly blight takes double damage from its opposed areas',()=>{const {s,id}=withHabit('fitness','hard');const b0=currentBlight(s,T);const n=act(s,'habitComplete',T,id).state;const b=currentBlight(n,T);
 assert.equal(b.damage-b0.damage,b.opposed.includes('fitness')?6:3);assert.equal(b.hp,blightHp(0))});

test('defeating a blight raises its tier for next time',()=>{let s=fresh(T);const b=currentBlight(s,T);s={...s,habits:{...s.habits,history:[{id:'x',title:'x',period:'d:2026-10-14',day:'2026-10-14',at:T,gold:0,points:3,domain:b.opposed[0],kind:'complete'}].concat(Array.from({length:30},(_,i)=>({id:'y'+i,title:'y',period:'d:2026-10-14',day:'2026-10-14',at:T,gold:0,points:3,domain:b.opposed[0],kind:'complete'})))}};
 const r=act(s,'blightClaim',T);assert.ok(!r.error,r.error);assert.equal(r.state.blights.tiers[b.id],1);assert.ok(act(r.state,'blightClaim',T).error)});

test('buildings earn gold over time, boosted by today’s habits in their area',()=>{let s={...fresh(T),gold:1e6};s=act(s,'buildingUpgrade',T,'yard').state;const base=totalRate(s,T);assert.ok(base>0);const {id}=withHabit('fitness');
 const later=settle(s,T+3600e3);assert.ok(later.gold>s.gold)});

test('roaming spends a charge and works before anyone has joined',()=>{const s=fresh(T);const r=act(s,'roam',T);assert.ok(!r.error,r.error);assert.equal(r.state.roam.charges,s.roam.charges-1);assert.ok(r.scene)});

test('family visits and gifts raise bond',()=>{let s={...fresh(T),gold:1e4,family:{tyrande:{bond:0}}};const v=act(s,'visit',T,'tyrande');assert.equal(v.state.family.tyrande.bond,30);assert.ok(act(v.state,'visit',T+1000,'tyrande').error);const g=act(v.state,'gift',T,'tyrande','posy');assert.equal(g.state.family.tyrande.bond,80)});

test('new journey keeps the habit journal and resets the village',()=>{const {s,id}=withHabit('faith');const done={...act(s,'habitComplete',T,id).state,fellows:{aldric:{level:5,stars:1}}};const n=newJourney(done,T);assert.deepEqual(n.fellows,{});assert.equal(n.habits.history.length,done.habits.history.length)});

test('every character belongs to a real area and every area has a full set',()=>{for(const a of AREA_IDS){assert.equal(FELLOWS.filter(f=>f.area===a).length,1);assert.equal(FAMILY.filter(f=>f.area===a).length,1)}});
