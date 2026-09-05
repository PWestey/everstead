import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

// Run the production presentation wrappers against a committed award with a
// bonus. Historical receipts deliberately retain the unboosted source amount.
const source=fs.readFileSync(new URL('../../index.html',import.meta.url),'utf8');
const lines=source.split('\n');
for(const name of ['runCompanionCampaign','clearCompanionTower','claimCompanionTower']){
 const line=lines.find(line=>line.startsWith(`${name}=function`)&&line.includes('creditedBefore'));
 assert.ok(line,`${name} production wrapper`);
 const receipt={stageId:'stage1',floor:1,companionExp:{a:100},companionShards:{a:2},targetCompanionId:'a',masteryAwarded:5};
 const state={experienceProgression:{version:3,wallets:{companion:{creditedTotal:1000,balance:700}}},companionCampaign:{selectedStageId:'stage1',lastReceipt:receipt},companionTower:{lastClearReceipt:receipt,idle:{lastReceipt:receipt}}};
 let message='';
 const context=vm.createContext({S:state,PHASE_24L_RELEASED_VIEWS:new WeakMap(),COMPANION_CAMPAIGN_STAGES:[{id:'stage1',name:'Stage'}],fmt:String,toast:text=>message=text,phase24c2cWithReleasedState:(fn,args)=>fn(...args),[`${name}BeforeC1`]:()=>{state.experienceProgression.wallets.companion.creditedTotal+=150;return{ok:true}}});
 vm.runInContext(line,context);
 vm.runInContext(`${name}()`,context);
 assert.match(message,/150 Shared Companion EXP banked/);
 assert.equal(receipt.companionExp.a,100);
 console.log(`PASS ${name}: reports bonus-inclusive earned amount without rewriting receipt`);
}
const summary=lines.find(line=>line.startsWith('function phaseElevenCRepeatSummary('));
const context=vm.createContext({S:{player:{rank:2}},fmt:String,esc:String});
vm.runInContext(summary,context);
for(const mode of ['fellowCampaign','companionCampaign']){
 const receipt={effectiveCost:10,rewards:{fellowExp:{a:100},fellowShards:{a:1},gifts:0,rankExp:0},companionExp:{a:100},companionShards:{a:1}};
 context.job={mode,startRank:2,stageName:'Stage',completed:1,requested:1,receipts:[{receipt,bankedExp:150}]};
 assert.match(vm.runInContext("phaseElevenCRepeatSummary(job,'Done')",context),/\+150<\/b><span>Total EXP/);
 console.log(`PASS ${mode}: repeat summary includes credited bonus`);
}
console.log('RESULT 5 passed');
