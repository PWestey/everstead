import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as c1Fixtures from '../phase-24l-c1/fixtures.mjs';
import * as b1Fixtures from '../phase-24l-fellow-exp/fixtures.mjs';

const contract=JSON.parse(fs.readFileSync(new URL('../phase-24l-c1/contract.json',import.meta.url),'utf8'));
const loaded=c1Fixtures.loadCandidate(contract);
const engine=loaded.api;
const b1=loaded.realm.EVERSTEAD_PHASE24L_FELLOW_EXP_WALLET;
const released=c1Fixtures.makeReleasedV2('established');
const clone=value=>JSON.parse(JSON.stringify(value));
const rows=[];
const check=(name,work)=>{try{work();rows.push({name,ok:true})}catch(error){rows.push({name,ok:false,error:error.stack||error.message})}};
const b1Allowed=b1Fixtures.engineOptions(released.bundle,{sourceAvailable:true,requestAvailable:true});
const companionLevelForExp=(exp,state,id)=>state.companions[id].level;
const options={companionLevelForExp,b1Options:b1Allowed,isSourceAvailable:()=>true,isRequestAvailable:()=>true};
const activate=state=>engine.activateV2State(state,{now:state.saveMeta.updatedAt+1,source:'phase24l-c1-activation',expectedRevision:state.saveMeta.revision},options);

const activation=activate(clone(released.state));
assert.equal(activation.ok,true,activation.reason);

check('campaign-and-tower-clear-identities-are-receipt-scoped',()=>{
  const ids=Object.keys(activation.state.companions).sort().slice(0,2);
  assert.equal(engine.sourceIdentity('companion-campaign','receipt-1',ids[0]),engine.sourceIdentity('companion-campaign','receipt-1',ids[1]));
  assert.equal(engine.sourceIdentity('companion-tower-clear','receipt-2',ids[0]),engine.sourceIdentity('companion-tower-clear','receipt-2',ids[1]));
  assert.notEqual(engine.sourceIdentity('manual-reward-claim',`pending:${ids[0]}`,ids[0]),engine.sourceIdentity('manual-reward-claim',`pending:${ids[1]}`,ids[1]));
});

check('same-campaign-receipt-cannot-credit-two-targets',()=>{
  const state=clone(activation.state),ids=Object.keys(state.companions).sort().slice(0,2),root=state.experienceProgression,common={sourceKind:'companion-campaign',sourceId:'same-phase23-receipt',rawAmount:100,authoredBps:0,collectionBps:0,occurredAt:state.saveMeta.updatedAt+1};
  const result=engine.stageCredits(state,ids.map((historicalTargetId,index)=>({...common,historicalTargetId,...(index===0?{expectedRevision:state.saveMeta.revision,expectedHeadIdentity:engine.ledgerHeadIdentity(root.companionLedger),expectedWalletBalance:root.wallets.companion.balance}:{})})),options);
  assert.equal(result.ok,false);
  assert.equal(result.reason,'duplicate-companion-credit-source');
});

check('folded-source-membership-remains-exact',()=>{
  const state=clone(activation.state),target=Object.keys(state.companions)[0],foldOptions={...options,allowQaSource:true};let ordinal=0;
  while(ordinal<257){
    const count=Math.min(32,257-ordinal),root=state.experienceProgression,inputs=Array.from({length:count},(_,index)=>({sourceKind:'qa-companion-exp',sourceId:`fold-source-${ordinal+index}`,historicalTargetId:target,rawAmount:1,authoredBps:0,collectionBps:0,occurredAt:state.saveMeta.updatedAt+1,...(index===0?{expectedRevision:state.saveMeta.revision,expectedHeadIdentity:engine.ledgerHeadIdentity(root.companionLedger),expectedWalletBalance:root.wallets.companion.balance}:{})}));
    const staged=engine.stageCredits(state,inputs,foldOptions);assert.equal(staged.ok,true,staged.reason);state.experienceProgression=clone(staged.root);ordinal+=count;
  }
  const root=state.experienceProgression;assert.ok(root.companionLedger.throughSequence>0);assert.ok(root.companionLedger.checkpoint.foldedSourceIdentities.length>0);
  const duplicate=engine.stageCredit(state,{sourceKind:'qa-companion-exp',sourceId:'fold-source-0',historicalTargetId:target,rawAmount:1,authoredBps:0,collectionBps:0,occurredAt:state.saveMeta.updatedAt+1,expectedRevision:state.saveMeta.revision,expectedHeadIdentity:engine.ledgerHeadIdentity(root.companionLedger),expectedWalletBalance:root.wallets.companion.balance},foldOptions);
  assert.equal(duplicate.ok,false);assert.equal(duplicate.reason,'duplicate-companion-credit-source');assert.equal(engine.validateV3State(state,foldOptions).ok,true);
});

check('activation-lineage-rejects-a-different-valid-b1-history',()=>{
  const base=clone(released.state),first=activate(clone(base));assert.equal(first.ok,true,first.reason);const root=base.experienceProgression,fellowId=Object.keys(base.fellows)[0];
  const b1Credit=b1.stageCredit(base,{sourceKind:'manual-reward-claim',sourceId:'different-valid-b1-history',historicalTargetId:fellowId,rawAmount:500,authoredBps:0,collectionBps:0,occurredAt:base.saveMeta.updatedAt+1,expectedRevision:base.saveMeta.revision,expectedHeadIdentity:b1.ledgerHeadIdentity(root.ledger),expectedWalletBalance:root.wallets.fellow.balance},b1Allowed);assert.equal(b1Credit.ok,true,b1Credit.reason);
  const changed=clone(base);changed.experienceProgression=clone(b1Credit.root);changed.saveMeta.revision++;changed.saveMeta.updatedAt++;changed.saveMeta.source='legitimate-b1-credit';const second=activate(changed);assert.equal(second.ok,true,second.reason);
  const splice=clone(second.state),activationId=engine.activationId;splice.experienceProgression.companionActivation=clone(first.state.experienceProgression.companionActivation);splice.saveMeta.appliedMigrations=splice.saveMeta.appliedMigrations.filter(item=>item.id!==activationId);splice.saveMeta.appliedMigrations.push(clone(first.state.saveMeta.appliedMigrations.find(item=>item.id===activationId)));
  assert.notEqual(splice.experienceProgression.companionActivation.predecessorRootIdentity,splice.experienceProgression.companionLedger.b1Lineage.activationRootIdentity);
  assert.equal(engine.validateV3State(splice,options).ok,false);
});

check('fellow-graft-rechecks-the-real-b1-source-authority',()=>{
  const state=clone(activation.state),projected=engine.projectToV2(state,options);assert.equal(projected.ok,true,projected.reason);const predecessor=projected.state,root=predecessor.experienceProgression,fellowId=Object.keys(predecessor.fellows)[0];
  const forged=b1.stageCredit(predecessor,{sourceKind:'manual-reward-claim',sourceId:'unavailable-fellow-source',historicalTargetId:fellowId,rawAmount:500,authoredBps:0,collectionBps:0,occurredAt:state.saveMeta.updatedAt+1,expectedRevision:state.saveMeta.revision,expectedHeadIdentity:b1.ledgerHeadIdentity(root.ledger),expectedWalletBalance:root.wallets.fellow.balance},b1Allowed);assert.equal(forged.ok,true,forged.reason);
  const deniedOptions={...options,b1Options:b1Fixtures.engineOptions(released.bundle,{sourceAvailable:false})},denied=engine.graftFellowStage(state,predecessor,forged,deniedOptions);assert.equal(denied.ok,false);assert.equal(denied.reason,'credit-source-unavailable');
  const authenticated=engine.graftFellowStage(state,predecessor,forged,options);assert.equal(authenticated.ok,true,authenticated.reason);const companionId=Object.keys(state.companions)[0],companionRoot=state.experienceProgression,mixed=engine.stageCredits(state,[{sourceKind:'manual-reward-claim',sourceId:`mixed-auth:${companionId}`,historicalTargetId:companionId,rawAmount:100,authoredBps:0,collectionBps:0,occurredAt:state.saveMeta.updatedAt+1,expectedRevision:state.saveMeta.revision,expectedHeadIdentity:engine.ledgerHeadIdentity(companionRoot.companionLedger),expectedWalletBalance:companionRoot.wallets.companion.balance}],{...deniedOptions,deferSourceValidation:true,initialRoot:authenticated.root});assert.equal(mixed.ok,false);assert.equal(mixed.reason,'credit-source-unavailable');
});

check('mixed-root-supports-multiple-authenticated-fellow-credits',()=>{
  const previous=clone(activation.state),cursor=clone(previous),fellowIds=Object.keys(cursor.fellows).slice(0,2);
  for(let index=0;index<fellowIds.length;index++){
    const projected=engine.projectToV2(cursor,options);assert.equal(projected.ok,true,projected.reason);const root=projected.state.experienceProgression,staged=engine.stageFellowCredit(cursor,{sourceKind:'manual-reward-claim',sourceId:`mixed-fellow-${index}`,historicalTargetId:fellowIds[index],rawAmount:100+index,authoredBps:0,collectionBps:0,occurredAt:cursor.saveMeta.updatedAt+1,expectedRevision:cursor.saveMeta.revision,expectedHeadIdentity:b1.ledgerHeadIdentity(root.ledger),expectedWalletBalance:root.wallets.fellow.balance},options);assert.equal(staged.ok,true,staged.reason);cursor.experienceProgression=clone(staged.root);
  }
  const target=Object.keys(previous.companions)[0],root=previous.experienceProgression,combined=engine.stageCredits(previous,[{sourceKind:'manual-reward-claim',sourceId:`mixed-pending:${target}`,historicalTargetId:target,rawAmount:200,authoredBps:0,collectionBps:0,occurredAt:previous.saveMeta.updatedAt+1,expectedRevision:previous.saveMeta.revision,expectedHeadIdentity:engine.ledgerHeadIdentity(root.companionLedger),expectedWalletBalance:root.wallets.companion.balance}],{...options,deferSourceValidation:true,initialRoot:cursor.experienceProgression});assert.equal(combined.ok,true,combined.reason);
  const next=clone(previous);next.experienceProgression=clone(combined.root);next.saveMeta.revision++;next.saveMeta.updatedAt++;next.saveMeta.source='mixed-claim';assert.equal(engine.validateV3State(next,options).ok,true);assert.equal(engine.validateRootTransition(previous,next,options),true);assert.equal(next.experienceProgression.companionLedger.b1Lineage.transitionCount,2);
});

for(const row of rows)console.log(`${row.ok?'PASS':'FAIL'} ${row.name}${row.error?`\n${row.error}`:''}`);
const failed=rows.filter(row=>!row.ok);console.log(`RESULT ${rows.length-failed.length} passed, ${failed.length} failed`);if(failed.length)process.exitCode=1;
