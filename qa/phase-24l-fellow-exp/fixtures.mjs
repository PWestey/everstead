import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
import {
  clone,
  fixture,
  predecessorValidator
} from '../phase-24l-exp-foundation/fixtures.mjs';

const here=path.dirname(fileURLToPath(import.meta.url));
export const root=path.resolve(here,'../..');
export const read=relative=>fs.readFileSync(path.join(root,relative),'utf8');
export const same=(left,right)=>JSON.stringify(left)===JSON.stringify(right);

export const LEVEL_CAP=500;
export const thresholdForLevel=level=>{
  const normalized=Math.max(1,Math.min(LEVEL_CAP,Math.floor(level)));
  return 50*normalized*(normalized-1);
};
export const levelForExp=exp=>{
  if(!Number.isSafeInteger(exp)||exp<0)throw new TypeError('EXP must be a non-negative safe integer');
  let level=1;
  while(level<LEVEL_CAP&&exp>=thresholdForLevel(level+1))level++;
  return level;
};
export const powerForFellow=(state,id,actor)=>{
  const definition=state.fellows[id];
  if(!definition)throw new TypeError('Unknown Fellow');
  return definition.power+actor.level*101+Math.floor(actor.exp/7);
};

export function loadApis(contract){
  const realm=vm.createContext({TextEncoder});
  vm.runInContext(read(contract.predecessor.foundationSource),realm,{filename:contract.predecessor.foundationSource});
  vm.runInContext(read(contract.candidate.source),realm,{filename:contract.candidate.source});
  return{
    foundation:realm[contract.predecessor.foundationGlobal],
    wallet:realm[contract.candidate.global],
    realm
  };
}

function normalizedPredecessor(name='established'){
  const state=fixture(name);
  for(const actor of Object.values(state.fellows))actor.level=levelForExp(actor.exp);
  return state;
}

export function makeV1(foundation,name='established'){
  const predecessor=normalizedPredecessor(name),raw=JSON.stringify(predecessor);
  const captured=foundation.capturePredecessorCheckpoint(predecessor,raw,{checkpointId:`phase24l-b1-${name}-checkpoint`});
  const checkpoint=foundation.attestPredecessorCheckpoint(captured,{rereadRaw:raw});
  const resolvePredecessorCheckpoint=identity=>identity===checkpoint.identity?{checkpoint,raw}:null;
  const migrated=foundation.migrateSchema14To15(predecessor,{
    now:predecessor.saveMeta.updatedAt+1000,
    source:`phase24l-b1-qa-${name}`,
    predecessorValidatorId:'validator.schema-14.phase24l-b1.qa.v1',
    validatePredecessor:predecessorValidator,
    predecessorCheckpoint:checkpoint,
    resolvePredecessorCheckpoint
  });
  return{
    state:clone(migrated.state),
    predecessor,
    checkpoint,
    raw,
    foundationOptions:{validatePredecessor:predecessorValidator,resolvePredecessorCheckpoint}
  };
}

export function engineOptions(bundle,{sourceAvailable=true,requestAvailable=true}={}){
  return{
    levelForExp,
    thresholdForLevel,
    powerForFellow,
    levelCap:LEVEL_CAP,
    isFellowAvailable:(state,id)=>Boolean(state.fellows[id]?.owned),
    isSourceAvailable:()=>sourceAvailable,
    isRequestAvailable:()=>requestAvailable,
    foundationOptions:bundle.foundationOptions
  };
}

export function withPostB0Play(bundle,{fellowId='cael',amount=777}={}){
  const state=clone(bundle.state);
  state.fellows[fellowId].exp+=amount;
  state.fellows[fellowId].level=levelForExp(state.fellows[fellowId].exp);
  state.saveMeta.revision++;
  state.saveMeta.updatedAt+=1000;
  state.saveMeta.source='phase24l-b1-post-b0-play-fixture';
  return state;
}

export function activate(wallet,bundle,state=withPostB0Play(bundle)){
  return wallet.activateV1State(state,{
    now:state.saveMeta.updatedAt+1000,
    source:'phase24l-b1-activation',
    expectedRevision:state.saveMeta.revision
  },engineOptions(bundle));
}

export function adoptCredit(state,staged){
  const next=clone(state);
  next.experienceProgression=clone(staged.root);
  next.saveMeta.revision++;
  next.saveMeta.updatedAt++;
  next.saveMeta.source='phase24l-b1-credit-qa';
  return next;
}

export function adoptSpend(state,staged){
  const next=adoptCredit(state,staged);
  next.fellows[staged.fellow.id].exp=staged.fellow.exp;
  next.fellows[staged.fellow.id].level=staged.fellow.level;
  next.saveMeta.source='phase24l-b1-spend-qa';
  return next;
}

export function credit(wallet,bundle,state,{sourceId='qa-credit-1',historicalTargetId='cael',rawAmount=1000,authoredBps=0,collectionBps=0}={}){
  const rootState=state.experienceProgression;
  return wallet.stageCredit(state,{
    sourceKind:'manual-reward-claim',sourceId,historicalTargetId,rawAmount,authoredBps,collectionBps,
    occurredAt:state.saveMeta.updatedAt+1,
    expectedRevision:state.saveMeta.revision,
    expectedHeadIdentity:wallet.ledgerHeadIdentity(rootState.ledger),
    expectedWalletBalance:rootState.wallets.fellow.balance
  },engineOptions(bundle));
}

export function preview(wallet,bundle,state,fellowId='cael',mode='x1'){
  return wallet.previewSpend(state,{fellowId,mode},engineOptions(bundle));
}

export function spend(wallet,bundle,state,spendPreview){
  return wallet.stageSpend(state,spendPreview,{...engineOptions(bundle),committedAt:state.saveMeta.updatedAt+1});
}

export {clone};
