import test from 'node:test';
import {COMPANIONS,companionLevel,companionLevelCost,companionBoost,areaCompanionBoost,HABIT_EXP,TREAT_EXP,EVOLVE_AT} from '../lib/companions.mjs';
import {habitDay} from '../lib/habits.mjs';
import assert from 'node:assert/strict';
import {fresh,act,valid,decode,settle,rosterPower,fellowPower,fellowBasePower,heroPower,heroPowerFor,combinePower,rosterHalf,currentBlight,blightHp,fellowLevelCost,starCost,stagePower,newJourney,totalRate,FELLOW_JOIN_POINTS} from '../lib/game.mjs';
import {habitDue} from '../lib/habits.mjs';
import {FELLOWS,FAMILY,AREA_IDS,BUILDINGS,familyInArea,fellowsInArea} from '../lib/cast.mjs';
import {introFor,SCENES} from '../lib/stories.mjs';
import {joinNeed,joinDay,fellowReady,familyReady,migrate,blessings,BLESS_LINKED,playerStage} from '../lib/game.mjs';
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
 let s=fresh(T);s={...s,companions:{},fellows:{darrow:{level:10,stars:2}}};assert.equal(fellowPower(s,'darrow'),1500);assert.equal(rosterHalf(s),1500);assert.equal(rosterPower(s),combinePower(heroPower(s),1500))});

test('Family blessings multiply Fellow power',()=>{let s=fresh(T);s={...s,companions:{},fellows:{darrow:{level:10,stars:0}},family:{kira:{bond:0}}};
 // Bond level 1: linked +3%, everyone +0.5%.
 assert.equal(fellowPower(s,'darrow'),Math.round(1000*1.03*1.005))});

test('levelling costs Fellow EXP and respects the star cap',()=>{let s={...fresh(T),fellowExp:1e9,fellows:{darrow:{level:1,stars:0}}};const r=act(s,'levelUp',T,'darrow','max');assert.equal(r.state.fellows.darrow.level,20);assert.ok(act(r.state,'levelUp',T,'darrow',1).error);
 assert.equal(s.fellowExp-r.state.fellowExp,Array.from({length:19},(_,i)=>fellowLevelCost(i+1)).reduce((a,b)=>a+b,0));assert.equal(r.state.gold,s.gold,'gold untouched')});

test('stars cost sigils of the Fellow’s own area',()=>{let s={...fresh(T),fellows:{darrow:{level:1,stars:0}}};assert.ok(act(s,'starUp',T,'darrow').error);s={...s,sigils:{...s.sigils,fitness:starCost(1)}};const r=act(s,'starUp',T,'darrow');assert.equal(r.state.fellows.darrow.stars,1);assert.equal(r.state.sigils.fitness,0)});

test('stages are a power check',()=>{const s=fresh(T);assert.ok(act(s,'challenge',T).error);const strong={...s,fellows:{darrow:{level:20,stars:0}}};const r=act(strong,'challenge',T);assert.ok(!r.error,r.error);assert.equal(r.state.stage.cleared,1);assert.ok(stagePower(2)>stagePower(1))});

test('the weekly blight takes double damage from its opposed areas',()=>{const {s,id}=withHabit('fitness','hard');const b0=currentBlight(s,T);const n=act(s,'habitComplete',T,id).state;const b=currentBlight(n,T);
 assert.equal(b.damage-b0.damage,b.opposed.includes('fitness')?6:3);assert.equal(b.hp,blightHp(0))});

test('defeating a blight raises its tier for next time',()=>{let s=fresh(T);const b=currentBlight(s,T);s={...s,habits:{...s.habits,history:[{id:'x',title:'x',period:'d:2026-10-14',day:'2026-10-14',at:T,gold:0,points:3,domain:b.opposed[0],kind:'complete'}].concat(Array.from({length:30},(_,i)=>({id:'y'+i,title:'y',period:'d:2026-10-14',day:'2026-10-14',at:T,gold:0,points:3,domain:b.opposed[0],kind:'complete'})))}};
 const r=act(s,'blightClaim',T);assert.ok(!r.error,r.error);assert.equal(r.state.blights.tiers[b.id],1);assert.ok(act(r.state,'blightClaim',T).error)});

test('buildings earn gold over time, boosted by today’s habits in their area',()=>{let s={...fresh(T),gold:1e6};s=act(s,'buildingUpgrade',T,'yard').state;const base=totalRate(s,T);assert.ok(base>0);const {id}=withHabit('fitness');
 const later=settle(s,T+3600e3);assert.ok(later.gold>s.gold)});

test('the village walk costs no Roam and works before anyone has joined',()=>{const s=fresh(T);const r=act(s,'roam',T);assert.ok(!r.error,r.error);assert.equal(r.state.roam.charges,s.roam.charges);assert.ok(r.scene)});

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

test('building adventures are free once a day each and pay every day',()=>{let s={...fresh(T),roam:{charges:0,seen:[]}};
 let r=act(s,'dialogue',T,'yard-sandbags',{node:'b',opt:0});assert.ok(!r.error,r.error);assert.equal(r.state.roam.charges,0,'no roam spent');assert.equal(r.state.bonusXp.fitness,600);
 assert.ok(act(r.state,'dialogue',T+1000,'yard-sandbags',{node:'b',opt:0}).error,'once a day');
 assert.ok(!act(r.state,'dialogue',T+1000,'yard-hill',{node:'b',opt:0}).error,'another adventure is separate');
 r=act(r.state,'dialogue',T+864e5,'yard-sandbags',{node:'b',opt:0});assert.ok(!r.error,r.error);assert.equal(r.state.bonusXp.fitness,1200)});

test('the Village Gate is a free walk once a day',()=>{let s={...fresh(T),fellows:{darrow:{level:1,stars:0}},roam:{charges:0,seen:[]}};let r=act(s,'roam',T);assert.ok(!r.error,r.error);assert.equal(r.state.roam.charges,0);
 assert.ok(act(r.state,'roam',T+1000).error,'once a day');assert.ok(!act(r.state,'roam',T+864e5).error,'tomorrow again')});

test('old saves get a one-time full bar of Roams back; new saves do not',()=>{const old={...fresh(T),flags:{},roam:{charges:2,seen:[]}};const m=migrate(old);assert.equal(m.roam.charges,10);assert.equal(migrate({...m,roam:{...m.roam,charges:1}}).roam.charges,1,'only once');
 assert.equal(migrate(fresh(T)).roam.charges,3,'a new save starts with the usual 3')});

test('habits complete after buildings have earned fractional gold',()=>{let s={...fresh(T),gold:1e6};s=act(s,'buildingUpgrade',T,'yard').state;s=settle(s,T+61000);assert.ok(!Number.isInteger(s.gold),'gold is fractional');
 const id=s.habits.items.find(x=>x.freq==='daily'&&x.days.includes(new Date(T).getDay())).id;const r=act(s,'habitComplete',T+62000,id);assert.ok(!r.error,r.error);assert.ok(r.state.gold>s.gold);
 const u=act(r.state,'habitUndo',T+63000);assert.ok(!u.error,u.error)});

// ---------------- Written quests and moments ----------------
import {execFileSync} from 'node:child_process';
import {questIds,questLock,questBefore,TIERS} from '../lib/quests.mjs';
import {FELLOW_MOMENTS,FAMILY_MOMENTS,momentId} from '../lib/moments.mjs';
import {readdirSync} from 'node:fs';

test('every written content file passes the content checker',()=>{for(const dir of ['lib/quests','lib/moments','lib/expeditions','lib/cheers'])for(const f of readdirSync(dir))execFileSync(process.execPath,['scripts/check-content.mjs',dir+'/'+f],{stdio:'pipe'})});

test('every Fellow has moments, and every Family member has visits and gifts',()=>{for(const f of FELLOWS)assert.ok(FELLOW_MOMENTS[f.id],f.id);for(const f of FAMILY)assert.ok(FAMILY_MOMENTS[f.id],f.id);
 for(const id of Object.keys(TREES).filter(k=>k.startsWith('m:')))assert.ok(TREES[id].nodes.o0,id)});

/** Where a tree triggers a quest effect: {node, opt}. */
function questSpot(tree,op){for(const [k,n] of Object.entries(TREES[tree].nodes)){if(n.do?.some(e=>e.quest?.[1]===op))return {node:k,opt:null};for(const [i,o] of (n.opts||[]).entries())if(o.do?.some(e=>e.quest?.[1]===op))return {node:k,opt:i}}throw new Error(tree+' has no '+op)}

test('every quest can be played start to finish and pays once',()=>{const big=Object.fromEntries(AREA_IDS.map(a=>[a,2e6]));
 for(const qid of questIds){const q=QUESTS[qid];let {s,id}=withHabit(q.area,'hard');const prev=questBefore(qid);
  s={...s,fellows:{[q.giver]:{level:1,stars:0}},bonusXp:big,quests:prev?{[prev]:{step:5,at:T,done:true}}:{}};
  assert.equal(questStatus(s,qid).status,'available',qid+': '+questLock(s,qid));
  let day=T,r=act(s,'dialogue',day,q.steps[0].tree,questSpot(q.steps[0].tree,'start'));assert.ok(!r.error,qid+' start: '+r.error);s=r.state;
  for(let d=0;d<q.steps[1].count;d++){day+=864e5;s=act(s,'habitComplete',day,id).state}
  assert.equal(pendingTalk(s,q.giver)?.tree,q.steps[2].tree,qid+' reached report-back');
  day+=864e5;r=act(s,'dialogue',day,q.steps[2].tree,questSpot(q.steps[2].tree,'advance'));assert.ok(!r.error,qid+' advance: '+r.error);s=r.state;
  for(let d=0;d<q.steps[3].count;d++){day+=864e5;s=act(s,'habitComplete',day,id).state}
  assert.equal(pendingTalk(s,q.giver)?.tree,q.steps[4].tree,qid+' reached finale');
  day+=864e5;r=act(s,'dialogue',day,q.steps[4].tree,questSpot(q.steps[4].tree,'complete'));assert.ok(!r.error,qid+' complete: '+r.error);assert.equal(r.questDone,qid);
  assert.ok(r.state.gold>=s.gold+(QUESTS[qid].rewards.gold),qid+' paid')}});

test('quests in an area unlock one after another, gated by total level',()=>{const roy=questIds.find(id=>QUESTS[id].giver==='roy');assert.equal(questBefore(roy),'iron-body');
 let s={...fresh(T),fellows:{roy:{level:1,stars:0}}};assert.match(questLock(s,roy),/Iron Body/);
 s={...s,quests:{'iron-body':{step:5,at:T,done:true}}};assert.match(questLock(s,roy),/total level 100/);
 s={...s,bonusXp:{...s.bonusXp,fitness:13e6}};assert.equal(questLock(s,roy),null);assert.equal(TIERS[QUESTS[roy].tier].total,100)});

test('levelling a Fellow past every 5th level, starring him, and visiting Family open a moment',()=>{let s={...fresh(T),gold:1e7,fellowExp:1e7,sigils:{...fresh(T).sigils,fitness:1e4},fellows:{darrow:{level:3,stars:0}},family:{kira:{bond:0}}};
 let r=act(s,'levelUp',T,'darrow',1);assert.equal(r.talk,null,'level 4: nothing');r=act(r.state,'levelUp',T,'darrow',1);assert.equal(r.talk,'m:darrow:level:0');
 r=act(r.state,'levelUp',T,'darrow',10);assert.equal(r.talk,'m:darrow:level:2','one moment for a multi-level purchase');
 r=act(r.state,'starUp',T,'darrow');assert.equal(r.talk,'m:darrow:star:0');assert.ok(TREES[r.talk]);
 r=act(r.state,'visit',T,'kira');assert.ok(TREES[r.talk],r.talk);const next=act(r.state,'visit',T+864e5,'kira');assert.notEqual(next.talk,r.talk,'visits rotate')});

// ---------------- Expeditions ----------------
import {EXPEDITIONS,expeditionNeed,expeditionOutcome,expeditionView,perks,roamCap,regionOpen} from '../lib/game.mjs';
import {REGIONS} from '../lib/expedition-data.mjs';
import {existsSync} from 'node:fs';

test('every place on the map has art, a backdrop and a first-visit scene',()=>{for(const e of EXPEDITIONS){assert.ok(existsSync('public/assets/'+e.art),e.art);assert.ok(existsSync('public/assets/'+(e.bg||e.region.bg)),e.id+' bg');assert.ok(TREES['x:'+e.id]?.nodes.o0,e.id+' scene')}});

test('needs climb along the map and outcomes follow the Power ratio',()=>{for(let k=1;k<EXPEDITIONS.length;k++)assert.ok(expeditionNeed(k)>expeditionNeed(k-1));
 assert.equal(expeditionOutcome(0.99),null);assert.equal(expeditionOutcome(1).mult,1);assert.equal(expeditionOutcome(1.5).mult,1.5);assert.equal(expeditionOutcome(3).mult,2)});

/** A save with roughly `power` Total Power, from one Fellow. */
const withPower=(power,roams=10)=>({...fresh(T),fellows:{darrow:{level:Math.ceil(power/100),stars:0}},roam:{charges:roams,seen:[]}});

test('a run costs a Roam, pays loot into gold, sigils and XP, and counts',()=>{let s=withPower(2000);const v=expeditionView(s,'cow-field');assert.ok(v.outcome);
 const r=act(s,'expedition',T,'cow-field');assert.ok(!r.error,r.error);assert.equal(r.state.roam.charges,9);assert.equal(r.state.gold,s.gold+v.loot.gold);assert.equal(r.state.sigils.home,v.loot.sigils);assert.equal(r.state.bonusXp.fitness,v.loot.xp);assert.equal(r.state.expeditions.runs['cow-field'],1);
 assert.ok(act({...s,roam:{charges:0,seen:[]}},'expedition',T,'cow-field').error,'no roams');
 assert.ok(act({...fresh(T),roam:{charges:5,seen:[]}},'expedition',T,'cow-field').error,'not strong enough')});

test('beating a boss opens the next region once and grants its perk',()=>{let s=withPower(1e6);assert.equal(regionOpen(s,1),false);assert.ok(act(s,'expedition',T,'dwarven-mine').error,'Asgarnia closed');
 let r=act(s,'expedition',T,'count-draynor');assert.ok(!r.error,r.error);assert.equal(r.expedition.perk,REGIONS[0].perk.text);assert.equal(r.expedition.opened,'Asgarnia');s=r.state;
 assert.equal(regionOpen(s,1),true);assert.equal(roamCap(s),12);r=act(s,'expedition',T,'count-draynor');assert.equal(r.expedition.perk,null,'perk pays once');assert.equal(r.state.expeditions.bosses.length,1);
 s={...s,expeditions:{...s.expeditions,bosses:['count-draynor','giant-mole','barrows','tztok-jad']}};assert.deepEqual(perks(s),{roamCap:2,income:0.1,power:0.1,loot:0.1})});

// ---------------- The Codex (Archives) ----------------
import {CODEX_CARDS,TOPIC_AREA,codexQueue,INTRO_ORDER} from '../lib/codex.mjs';
import {codexReward,CODEX_PAID_PER_DAY,CODEX_NEW_PER_DAY} from '../lib/game.mjs';
import {createHash} from 'node:crypto';

test('the Codex holds the 324 cards with stable ids, and every topic maps to a life area',()=>{assert.ok(CODEX_CARDS.length>=324);assert.equal(new Set(CODEX_CARDS.map(c=>c.id)).size,CODEX_CARDS.length);
 for(const c of CODEX_CARDS){assert.ok(TOPIC_AREA[c.topic],c.topic);assert.ok(AREA_IDS.includes(TOPIC_AREA[c.topic]));assert.ok(c.front&&c.back,c.id);
  assert.equal(c.id,'k'+createHash('sha1').update(c.topic+'|'+c.front).digest('hex').slice(0,8),'id rule for '+c.front)}
 assert.equal(INTRO_ORDER.length,CODEX_CARDS.length)});

test('a Codex review schedules like Leitner boxes and pays the same for got it and forgot',()=>{const s=fresh(T),id=codexQueue(s,'2026-10-14',CODEX_NEW_PER_DAY).queue[0].id;
 const got=act(s,'codexReview',T,id,true),forgot=act(s,'codexReview',T,id,false);assert.ok(!got.error,got.error);
 assert.deepEqual([got.state.codex.cards[id].box,got.state.codex.cards[id].due],[2,'2026-10-16']);
 assert.deepEqual([forgot.state.codex.cards[id].box,forgot.state.codex.cards[id].due],[1,'2026-10-15']);
 assert.equal(got.state.gold,forgot.state.gold,'honest answers cost nothing');assert.equal(got.state.gold-s.gold,codexReward(s));
 assert.ok(act(got.state,'codexReview',T+1000,id,true).error,'not due again yet')});

test('Codex: 15 new cards a day, the first 40 reviews pay, and mastery adds building income',()=>{let s=fresh(T);
 for(let i=0;i<CODEX_NEW_PER_DAY;i++){const id=codexQueue(s,'2026-10-14',CODEX_NEW_PER_DAY).queue[0].id;s=act(s,'codexReview',T,id,true).state}
 assert.equal(codexQueue(s,'2026-10-14',CODEX_NEW_PER_DAY).queue.length,0,'no 16th new card today');
 const cards={};for(const c of CODEX_CARDS.slice(0,60))cards[c.id]={box:3,due:'2026-10-14'};s={...fresh(T),codex:{...fresh(T).codex,cards}};
 let paid=0;for(let i=0;i<50;i++){const r=act(s,'codexReview',T,CODEX_CARDS[i].id,true);if(r.codex.gold>0)paid++;s=r.state}assert.equal(paid,CODEX_PAID_PER_DAY);
 const m={};for(const c of CODEX_CARDS.slice(0,50))m[c.id]={box:7,due:'2027-01-01',mastered:true};assert.ok(Math.abs(perks({...fresh(T),codex:{...fresh(T).codex,cards:m}}).income-0.04)<1e-9)});

import BOUNDS from '../lib/art-bounds.json' with {type:'json'};
test('every cast portrait has recorded figure bounds (run node scripts/art-bounds.mjs after adding art)',()=>{for(const f of readdirSync('public/assets/cast').filter(x=>x.endsWith('.webp'))){const b=BOUNDS['cast/'+f];assert.ok(b,'missing bounds for '+f);assert.ok(b[0]<b[2]&&b[1]<b[3],f)}});

// ---------------- Cheers ----------------
import {CHEERS,cheerMoment} from '../lib/cheers.mjs';
import {cheerTree} from '../lib/dialogue.mjs';

test('every Fellow and Family member has cheers',()=>{for(const c of [...FELLOWS,...FAMILY])assert.ok(CHEERS[c.id],'no cheers for '+c.id)});

test('a cheer comes on the first habit in an area each day, and when every daily is done',()=>{
 let s=fresh(T);const add=(title,domain)=>{const r=act(s,'habitSave',T,null,{title,freq:'daily',diff:'med',domain});s=r.state;return s.habits.items.at(-1).id};
 s={...s,habits:{...s.habits,items:[]}};const a=add('Pray','faith'),b=add('Read Psalms','faith'),c=add('Lift','fitness');
 let r=act(s,'habitComplete',T,a);assert.ok(r.cheer,'first faith habit cheers');assert.equal(FELLOWS.concat(FAMILY).find(x=>x.id===r.cheer.who).area,'faith');
 const tid=cheerTree(r.cheer);assert.ok(TREES[tid]?.big&&TREES[tid].nodes.o0,'tree built');
 r=act(r.state,'habitComplete',T+1000,b);assert.equal(r.cheer,null,'second faith habit is quiet');
 r=act(r.state,'habitComplete',T+2000,c);assert.equal(r.cheer?.kind,'done','last daily of the day');
 const codex=cheerMoment({who:'darrow',kind:'codex',i:0,cardId:CODEX_CARDS[0].id});assert.match(codex.open[1],/From your Codex/);assert.equal(codex.opts[0].t,'I am committed!')});


// Family conversation delivery: independent of habit-earned bond and compatible with older saves.
test('Family visits progress once, then keep the established relationship scenes',()=>{
 let s={...fresh(T),gold:1e7,crystals:1000,family:{yennefer:{bond:4000}}};const shown=[];
 for(let i=0;i<9;i++){
  const now=T+i*864e5;const r=act(s,'visit',now,'yennefer');assert.ok(!r.error,r.error);shown.push(r.talk);
  const rejected=act(r.state,'visit',now+1000,'yennefer');assert.ok(rejected.error);assert.equal(rejected.state.familyTalks.yennefer,i+1);
  s=act(r.state,'gift',now+2000,'yennefer',i%2?'sweets':'jewel').state;
  s=decode(JSON.stringify(s));assert.equal(s.familyTalks.yennefer,i+1);
 }
 assert.deepEqual(shown.map(x=>Number(x.split(':').at(-1))),[0,1,2,3,4,3,4,3,4]);
});
test('habit bond changes do not skip Family visit dialogue',()=>{
 let {s,id}=withHabit('fitness');s={...s,family:{kira:{bond:0}}};
 s=act(s,'visit',T,'kira').state;s=act(s,'habitComplete',T+1000,id).state;
 const next=act(s,'visit',T+864e5,'kira');assert.equal(next.talk,'m:kira:visit:1');
});
test('old saves keep Family bond and visit cooldown while acquiring conversation counts',()=>{
 const s={...fresh(T),family:{tyrande:{bond:1234}},visits:{tyrande:habitDay(T)}};delete s.familyTalks;
 const loaded=decode(JSON.stringify(s));assert.equal(loaded.family.tyrande.bond,1234);assert.deepEqual(loaded.familyTalks,{});
 assert.ok(act(loaded,'visit',T,'tyrande').error);
 assert.equal(act(loaded,'visit',T+864e5,'tyrande').talk,'m:tyrande:visit:0');
});
test('every gift alias delivers the complete reaction, including its last line',()=>{
 for(const f of FAMILY)for(const i of [0,1,2]){
  const t=TREES[`m:${f.id}:gift:${i}`];let key=t.start,count=0;
  for(;;){const n=t.nodes[key];count++;if(n.end)break;assert.ok(n.next);key=n.next;assert.ok(count<=3)}
  assert.equal(count,FAMILY_MOMENTS[f.id].gift.length,f.id);
 }
 let s={...fresh(T),gold:10000,family:{vampanna:{bond:0}}};
 for(let i=0;i<3;i++){const r=act(s,'gift',T+i,'vampanna','sweets');assert.ok(!r.error);assert.ok(TREES[r.talk].nodes.o2.end);s=r.state;}
});
test('all Family portrayals are explicitly adult in this setting',()=>{
 assert.equal(FAMILY.length,97);for(const f of FAMILY)assert.equal(f.ageMinimum,24,f.id);
});

// ---------------- The War Table ----------------
import * as WT from '../lib/modes.mjs';
import {FRANCHISE} from '../lib/franchises.mjs';
test('every character has a franchise for the Arena',()=>{for(const c of [...FELLOWS,...FAMILY])assert.ok(FRANCHISE[c.id],'no franchise for '+c.id)});
test('War Table modes pay out, respect once-a-day and once-a-week rules',()=>{let s={...fresh(T),fellows:{darrow:{level:20,stars:1},geralt:{level:10,stars:0}},family:{kira:{bond:2000},vin:{bond:500}}};
 let r=act(s,'mode:rift',T,null,['darrow']);assert.ok(r.floors>0,r.error);s=r.state;assert.ok(act(s,'mode:rift',T+1000,null,['geralt']).error,'one Rift run a day');
 r=act(s,'mode:front',T,'fitness',['darrow','kira']);assert.ok(!r.error,r.error);s=r.state;assert.ok(act(s,'mode:front',T,'work',['darrow']).error,'Darrow already fought this week');
 r=act(s,'mode:trial',T,'work',['darrow']);assert.match(r.error,/Family/);
 const hp=WT.strikeDamage(s,['kira'],1000);r=act(s,'mode:strike',T,null,['kira']);assert.ok(!r.error,r.error);assert.equal(r.state.modes.strike.dmg,hp);
 for(let i=0;i<WT.ARENA_TRIES;i++)s=act(s,'mode:arena',T,null,['geralt']).state;assert.ok(act(s,'mode:arena',T,null,['geralt']).error,'tries run out');
 assert.ok(!act(s,'mode:rift',T+864e5,null,['darrow']).error,'Rift is back tomorrow')});
test('the Gauntlet runs, offers a choice every 3 floors and ends',()=>{let s={...fresh(T),fellows:{darrow:{level:5,stars:0},geralt:{level:5,stars:0},obiwan:{level:5,stars:0},tony:{level:1,stars:0}}};
 const day='2026-10-14',d=WT.gauntletDraft(s,day);let r=act(s,'mode:gauntletStart',T,null,d.slice(0,3));assert.ok(!r.error,r.error);s=r.state;let offered=false;
 for(let i=0;i<200&&s.modes.gauntlet.run;i++){const run=s.modes.gauntlet.run;if(run.offer){offered=true;s=act(s,'mode:gauntletChoose',T,run.offer.draft[0]||'rally').state}else s=act(s,'mode:gauntletFight',T,null,null).state}
 assert.ok(offered);assert.equal(s.modes.gauntlet.run,null);assert.ok(s.modes.gauntlet.best>=3);assert.ok(act(s,'mode:gauntletStart',T,null,d.slice(0,3)).error,'one run a day')});

// ---------------- Main story ----------------
import {CHAPTERS,chapterLock,nextChapter,fillTokens,hearthLine} from '../lib/story.mjs';
import {ORIGINS} from '../lib/origins.mjs';
const allEffects=t=>Object.values(t.nodes).flatMap(n=>[...(n.do||[]),...(n.opts||[]).flatMap(o=>o.do||[])]);
test('every chapter tree exists, is well formed and finishes with its story flag',()=>{for(const c of CHAPTERS){const t=TREES['story-'+c.n];assert.ok(t,'missing story-'+c.n);
 for(const [k,n] of Object.entries(t.nodes)){if(n.next)assert.ok(t.nodes[n.next],c.n+':'+k);for(const o of n.opts||[])assert.ok(t.nodes[o.next],c.n+':'+k+' opt');assert.ok(n.next||n.opts||n.end,c.n+':'+k+' leads somewhere')}
 const fin=Object.values(t.nodes).filter(n=>n.end&&n.do?.some(e=>e.flag==='story:'+c.n));assert.ok(fin.length,'story-'+c.n+' never sets story:'+c.n)}
 const f1=allEffects(TREES['story-1']).map(e=>e.flag);for(const m of ['motive:order','motive:start','motive:fire'])assert.ok(f1.includes(m),m);
 const f8=allEffects(TREES['story-8']).map(e=>e.flag);for(const h of ['hearth:today','hearth:same','hearth:motive'])assert.ok(f8.includes(h),h)});
test('chapters unlock in order, by Map boss and total level',()=>{let s=fresh(T);assert.equal(nextChapter(s).chapter.n,1);assert.equal(nextChapter(s).lock,null);
 s={...s,flags:{...s.flags,'story:1':true}};assert.match(chapterLock(s,CHAPTERS[1]),/Count Draynor/);
 s={...s,expeditions:{...s.expeditions,bosses:['count-draynor']}};assert.match(chapterLock(s,CHAPTERS[1]),/total level 60/);
 s={...s,flags:{...s.flags,'motive:fire':true}};assert.match(fillTokens('I came {motive}.',s),/fire/);assert.equal(hearthLine(s),null)});
test('every character has an origin',()=>{for(const c of [...FELLOWS,...FAMILY])assert.ok(ORIGINS[c.id],'no origin for '+c.id)});

// ---------------- Everkai spine: EXP from stages, Power feeds buildings, staffing ----------------
import {buildingStaff,staffSlots,buildingRate} from '../lib/game.mjs';
test('Map runs pay Fellow EXP',()=>{const s={...fresh(T),fellows:{darrow:{level:20,stars:0}},roam:{charges:3,seen:[]}};const v=expeditionView(s,'cow-field');const r=act(s,'expedition',T,'cow-field');assert.ok(!r.error,r.error);assert.equal(r.state.fellowExp,s.fellowExp+v.loot.exp);assert.ok(v.loot.exp>0)});
test('more Power means more income in every open building',()=>{let s={...fresh(T),buildings:{...fresh(T).buildings,yard:{level:1},chapel:{level:1}}};const a=buildingRate(s,'chapel'),b=buildingRate({...s,fellows:{darrow:{level:200,stars:5}}},'chapel');assert.ok(b>a,'Darrow’s Power raises the Chapel too')});
test('staff: area Fellows fill slots automatically, can be chosen, and raise income',()=>{let s={...fresh(T),fellows:{darrow:{level:30,stars:1},roy:{level:5,stars:0},obiwan:{level:5,stars:0}},buildings:{...fresh(T).buildings,yard:{level:4}}};
 assert.equal(staffSlots(4),2);assert.deepEqual(buildingStaff(s,'yard'),['darrow','roy']);const auto=buildingRate(s,'yard');
 assert.ok(act(s,'staffSet',T,'yard',['obiwan']).error,'Obi-Wan is Faith');assert.ok(act(s,'staffSet',T,'yard',['darrow','roy','grog']).error);
 const r=act(s,'staffSet',T,'yard',['roy']);assert.ok(!r.error,r.error);assert.deepEqual(buildingStaff(r.state,'yard'),['roy']);assert.ok(buildingRate(r.state,'yard')<auto);
 assert.deepEqual(buildingStaff(act(r.state,'staffSet',T,'yard',null).state,'yard'),['darrow','roy'],'null goes back to automatic')});

test('companions: 32 lines, four per area, one starter each, art for every stage',()=>{assert.equal(COMPANIONS.length,32);for(const a of AREA_IDS){const c=COMPANIONS.filter(x=>x.area===a);assert.equal(c.length,4,a);assert.equal(c.filter(x=>x.starter).length,1,a)}
 assert.equal(Object.keys(fresh(T).companions).length,8);for(const c of COMPANIONS)for(const st of c.stages)assert.ok(existsSync('public/assets/companions/'+st.id+'.webp'),st.id)});

test('companions grow from area habits and treats, evolve at set levels and boost area Fellows',()=>{const {s,id}=withHabit('fitness','easy');const c=COMPANIONS.find(x=>x.area==='fitness'&&x.starter);
 let r=act(s,'habitComplete',T,id);assert.equal(r.state.companions[c.id].exp,HABIT_EXP);r=act(r.state,'habitUndo',T,id);assert.equal(r.state.companions[c.id].exp,0);
 assert.equal(companionLevel(0),1);assert.equal(companionLevel(companionLevelCost(1)),2);assert.equal(companionLevel(1e9),40);
 r=act({...s,treats:1},'treat',T,c.id);assert.ok(!r.error,r.error);assert.equal(r.state.treats,0);assert.equal(r.state.companions[c.id].exp,TREAT_EXP);assert.ok(act(r.state,'treat',T,c.id).error);
 let exp=0;for(let L=1;L<EVOLVE_AT[0];L++)exp+=companionLevelCost(L);assert.ok(act({...s,companions:{[c.id]:{exp:exp-1,stage:1}}},'evolve',T,c.id).error);
 const e=act({...s,companions:{[c.id]:{exp,stage:1}}},'evolve',T,c.id);assert.ok(!e.error,e.error);assert.equal(e.state.companions[c.id].stage,2);
 assert.equal(areaCompanionBoost(e.state,'fitness'),companionBoost(10,2));assert.equal(companionBoost(10,2),0.1);
 const p={...e.state,companions:{},fellows:{darrow:{level:10,stars:0}}};assert.equal(fellowPower({...p,companions:e.state.companions},'darrow'),Math.round(fellowPower(p,'darrow')*1.1))});

test('new companions are found on boss first-wins and every 8th Map run; runs drop treats',()=>{let s={...fresh(T),fellows:{darrow:{level:200,stars:5}},roam:{...fresh(T).roam,charges:20}};const first=REGIONS[0].adventures[0].id;
 let r=act(s,'expedition',T,first);assert.equal(r.state.treats,s.treats+1);assert.equal(Object.keys(r.state.companions).length,8);
 for(let i=0;i<7;i++)r=act(r.state,'expedition',T,first);assert.equal(Object.keys(r.state.companions).length,9);assert.ok(r.message.includes('joined'));
 const b=act({...r.state,roam:{...r.state.roam,charges:5}},'expedition',T,REGIONS[0].boss.id);assert.ok(!b.error,b.error);assert.equal(Object.keys(b.state.companions).length,10);assert.equal(b.expedition.treats,2)});

test('everyone has arrived by day 30, companions by their day',()=>{const T0=fresh(T);const at=d=>settle(T0,T+(d-1)*864e5+1000);
 const s29=at(29.9),s30=at(30.5);assert.ok(FELLOWS.some(f=>!fellowReady(s29,f)),'some still locked on day 29');assert.ok(FELLOWS.every(f=>fellowReady(s30,f)));assert.ok(FAMILY.every(f=>familyReady(s30,f)));
 assert.equal(Object.keys(at(1).companions).length,8);assert.equal(Object.keys(at(10).companions).length,16);assert.equal(Object.keys(s30.companions).length,32);
 const first=FELLOWS.find(f=>f.area==='faith');assert.equal(joinDay(first),6);assert.ok(!fellowReady(at(5),first)&&fellowReady(at(6),first))});
