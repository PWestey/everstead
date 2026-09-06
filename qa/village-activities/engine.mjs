import assert from 'node:assert/strict';
import '../../src/village-activities.js';
const api=globalThis.EVERSTEAD_VILLAGE_ACTIVITIES;
const NOW=1800000000000, PERIOD=1800000, DAY=86400000;
let checks=0;
function check(value,message){assert.ok(value,message);checks++;}
function equal(actual,expected,message){assert.deepEqual(actual,expected,message);checks++;}
const copy=value=>JSON.parse(JSON.stringify(value));
let state=api.create(NOW);
check(api.validate(state),'Fresh state validates');
equal(state.activatedAt,NOW,'Migration records activation time');
equal(state.migrationId,'public-village-activities-v1','Migration identity is explicit');
equal(api.trainingGain,50,'Shared presentation constant is 50 Power');
equal(api.trainingCost(0),10,'Shared first training cost');
equal(api.trainingCost(1),12,'Shared second training cost');
equal(api.trainingCost(-1),null,'Invalid cost level fails closed');
equal(Object.keys(api.definitions).length,13,'All 13 facilities exist');
equal(new Set(Object.values(api.definitions).map(d=>d.activity)).size,13,'Every facility has a distinct activity identity');
for(const d of Object.values(api.definitions)){
  check(d.scenarios.length>=3,`${d.id} has at least three variants`);
  for(const s of d.scenarios){check(s.steps.length>=2,`${d.id}: ${s.title} has multiple steps`);for(const p of s.steps)check(p.options.some(o=>o.id===p.answer),`${d.id}: answer is selectable`);}
  const before=copy(state);
  let result=api.act(state,d.id,'tutorial',{},NOW);
  check(result.ok&&result.root.facilities[d.id].tutorial,`${d.id} tutorial recorded`);
  equal(state,before,'Tutorial is pure');state=result.root;
  for(let cycle=0;cycle<3;cycle++){
    result=api.act(state,d.id,'start',{},NOW);check(result.ok,`${d.id} starts variant ${cycle}`);state=result.root;
    equal(state.facilities[d.id].active.scenario,cycle,`${d.id} rotates content`);
    check(!api.act(state,d.id,'start',{},NOW).ok,'Cannot replace active session');
    const scenario=d.scenarios[cycle];
    for(const p of scenario.steps){
      const snapshot=copy(state),wrong=p.options.find(o=>o.id!==p.answer);
      result=api.act(state,d.id,'choose',{choice:wrong.id},NOW);
      check(!result.ok,'Wrong choice rejected');equal(result.root,state,'Wrong choice preserves progression');
      result=api.act(state,d.id,'choose',{choice:p.answer},NOW);
      check(result.ok,`${d.id} correct response advances`);equal(state,snapshot,'Choosing is pure');state=result.root;
    }
    const pending=state.facilities[d.id].pending;
    check(!!pending&&state.facilities[d.id].active===null,'Completion awaits a manual claim');
    equal(state.facilities[d.id].bank,2-cycle,'Exactly one opportunity consumed');
    check(!api.act(state,d.id,'start',{},NOW).ok,'Pending rewards cannot be overwritten');
    check(!api.act(state,d.id,'claim',{claimId:'stale'},NOW).ok,'Wrong receipt cannot claim');
    const goldBefore=state.totalGoldAwarded,trainingBefore=state.training;
    result=api.act(state,d.id,'claim',{claimId:pending.id},NOW);
    check(result.ok,`${d.id} claim succeeds`);state=result.root;
    equal(state.totalGoldAwarded-goldBefore,result.reward.gold,'Gold matches the returned atomic reward');
    equal(state.training-trainingBefore,3,'Training currency credited once');
    result=api.act(state,d.id,'claim',{claimId:pending.id},NOW);
    check(!result.ok,'Replayed receipt rejected');equal(result.root,state,'Replay does not change state');
    check(api.validate(state),'Full ledger remains valid');
  }
  check(!api.act(state,d.id,'start',{},NOW).ok,`${d.id} empty bank cannot start`);
}
equal(state.claimSequence,39,'Every facility completed and claimed three variants');
equal(state.training,117,'Training rewards conserved');
const original=copy(state);
let result=api.train(state,'alden',NOW);
check(result.ok,'Manual Fellow training succeeds');equal(state,original,'Training is pure');state=result.root;
equal(api.power(state,'alden'),50,'First training adds 50 flat Power');
equal(state.training,107,'First training spends 10 points');
state=api.train(state,'alden',NOW).root;
equal(api.power(state,'alden'),100,'Second training adds another 50 Power');
equal(state.training,95,'Second training costs 12 points');
equal(state.training+state.trainingSpent,state.totalTrainingEarned,'Training conservation exact');
check(!api.train(api.create(NOW),'alden',NOW).ok,'Cannot train without currency');
check(!api.train(state,'__proto__',NOW).ok,'Prototype identifiers rejected');
equal(api.power(state,'unknown'),0,'Unknown Fellow has no bonus');
check(api.validate(JSON.parse(JSON.stringify(state))),'Save round-trip preserves state');
function nullPrototype(value){
  if(Array.isArray(value))return value.map(nullPrototype);
  if(value&&typeof value==='object')return Object.assign(Object.create(null),Object.fromEntries(Object.entries(value).map(([key,item])=>[key,nullPrototype(item)])));
  return value;
}
const protectedSave=nullPrototype(state);
check(api.validate(protectedSave),'Recursive null-prototype persistence parser state validates');
check(api.settle(protectedSave,NOW+PERIOD).ok,'Null-prototype state can settle');
check(api.act(protectedSave,'restaurant','tutorial',Object.create(null),NOW).ok,'Null-prototype state and action payload accepted');
check(api.train(protectedSave,'alden',NOW).ok,'Null-prototype mastery records can train');
const inheritedState=Object.assign(Object.create({unexpected:true}),state);
check(!api.validate(inheritedState),'Custom root prototype still rejected');
const inheritedFacility=copy(state);
inheritedFacility.facilities.restaurant=Object.assign(Object.create({unexpected:true}),inheritedFacility.facilities.restaurant);
check(!api.validate(inheritedFacility),'Custom nested prototype still rejected');
for(const mutate of [
  s=>s.version=2,s=>s.extra=true,s=>s.training++,s=>s.trainingSpent++,s=>s.totalTrainingEarned++,
  s=>s.activatedAt=-1,s=>s.activatedAt=NOW+1,s=>s.migrationId='unknown',s=>delete s.migrationId,
  s=>s.totalGoldAwarded++,s=>s.claimSequence++,s=>s.lastClaim.gold++,s=>s.lastClaim.id='forged',
  s=>s.facilities.command.bank=13,s=>s.facilities.command.bank=-1,s=>s.facilities.command.bank=.5,
  s=>s.facilities.command.lastAccrued=Infinity,s=>s.facilities.command.cursor++,s=>s.facilities.command.claimed++,
  s=>s.facilities.command.pending={id:'command:4',gold:999,training:3},
  s=>s.facilities.command.active={scenario:0,step:0},s=>s.facilities.command.tutorial='yes',
  s=>s.mastery.alden.power++,s=>s.mastery.alden.spent++,s=>s.mastery.alden.level++,
  s=>s.facilities.command.extra=1,s=>delete s.facilities.fishing
]){
  const bad=copy(state);mutate(bad);check(!api.validate(bad),'Malformed or inconsistent state rejected');
  check(!api.settle(bad,NOW).ok,'Invalid state cannot settle');
}
let fresh=api.create(NOW);
equal(api.settle(fresh,NOW+PERIOD-1).root.facilities.command.bank,3,'No premature opportunity');
equal(api.settle(fresh,NOW+PERIOD).root.facilities.command.bank,4,'One opportunity each half hour');
equal(api.settle(fresh,NOW+DAY*10).root.facilities.command.bank,12,'Long offline absence remains capped');
equal(api.settle(fresh,NOW+DAY*10).root.facilities.command.lastAccrued,NOW+DAY*10,'Excess offline time is not a hidden backlog');
equal(api.settle(fresh,NOW-1).root,fresh,'Backward clock does not create opportunities');
let partial=api.settle(fresh,NOW+PERIOD/2).root;
equal(api.settle(partial,NOW+PERIOD).root.facilities.command.bank,4,'Fractional elapsed time is retained');
fresh=api.act(fresh,'fishing','start',{},NOW).root;
for(const s of api.definitions.fishing.scenarios[0].steps)fresh=api.act(fresh,'fishing','choose',{choice:s.answer},NOW).root;
const pending=copy(fresh.facilities.fishing.pending);
equal(api.settle(fresh,NOW+DAY*365).root.facilities.fishing.pending,pending,'Earned reward never expires');
check(!api.act(fresh,'constructor','start',{},NOW).ok,'Invalid facility rejected');
check(!api.act(fresh,'fishing','unknown',{},NOW).ok,'Invalid action rejected');
check(!api.settle(fresh,NaN).ok,'Invalid time rejected');
check(!api.validate(null),'Null state rejected');
check(Object.isFrozen(api.definitions.restaurant.scenarios[0].steps[0]),'Definitions are immutable');
console.log(`Village activities engine: ${checks} assertions passed.`);
