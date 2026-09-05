import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
import * as b1Fixtures from '../phase-24l-fellow-exp/fixtures.mjs';

const here=path.dirname(fileURLToPath(import.meta.url));
export const root=path.resolve(here,'../..');
export const read=relative=>fs.readFileSync(path.resolve(root,relative),'utf8');
export const exists=relative=>fs.existsSync(path.resolve(root,relative));
export const clone=value=>JSON.parse(JSON.stringify(value));
export const same=(left,right)=>JSON.stringify(left)===JSON.stringify(right);

export const LEVEL_CAP=100;
export const EXP_BASE=80;
export const EXP_GROWTH=1.12;
export const BPS_DENOMINATOR=10_000;

export function companionExpToNext(level){
  const normalized=Math.max(1,Math.min(LEVEL_CAP,Math.floor(level)));
  return Math.round(EXP_BASE*Math.pow(EXP_GROWTH,normalized-1));
}

export function companionExpThreshold(level){
  const normalized=Math.max(1,Math.min(LEVEL_CAP,Math.floor(level)));
  let total=0;
  for(let current=1;current<normalized;current++)total+=companionExpToNext(current);
  if(!Number.isSafeInteger(total))throw new RangeError('Companion cumulative EXP exceeds safe precision');
  return total;
}

export function companionLevelForExp(exp){
  if(!Number.isSafeInteger(exp)||exp<0)throw new TypeError('EXP must be a non-negative safe integer');
  let level=1,total=0;
  while(level<LEVEL_CAP){
    const next=companionExpToNext(level);
    if(exp<total+next)break;
    total+=next;
    level++;
  }
  return level;
}

export function settledCredit(rawAmount,authoredBps=0,collectionBps=0){
  for(const value of [rawAmount,authoredBps,collectionBps])if(!Number.isSafeInteger(value)||value<0)throw new TypeError('Credit inputs must be non-negative safe integers');
  const numerator=BigInt(rawAmount)*BigInt(BPS_DENOMINATOR+authoredBps+collectionBps);
  const settled=numerator/BigInt(BPS_DENOMINATOR);
  if(settled>BigInt(Number.MAX_SAFE_INTEGER))throw new RangeError('Settled credit exceeds safe precision');
  return Number(settled);
}

export function companionActors(state){
  return Object.fromEntries(Object.entries(state?.companions||{}).sort(([left],[right])=>left.localeCompare(right)).map(([id,actor])=>[id,{
    owned:actor.owned,
    exp:actor.exp,
    level:actor.level,
    rarity:actor.rarity,
    shards:actor.shards,
    assignedFellowId:actor.assignedFellowId
  }]));
}

export function companionExpLevels(state){
  return Object.fromEntries(Object.entries(companionActors(state)).map(([id,actor])=>[id,{exp:actor.exp,level:actor.level}]));
}

export function assignments(state){
  return Object.fromEntries(Object.entries(state?.companions||{}).sort(([left],[right])=>left.localeCompare(right)).map(([id,actor])=>[id,actor.assignedFellowId]));
}

export function fellowAuthority(rootState){
  if(!rootState)return null;
  const activation=rootState.activation||{};
  return{
    wallet:clone(rootState.wallets?.fellow),
    ledger:clone(rootState.ledger),
    tutorials:clone(rootState.tutorials),
    baselines:clone(rootState.baselines?.fellowExpById),
    activation:{
      investedFellowExpById:clone(activation.investedFellowExpById),
      investedFellowLevelById:clone(activation.investedFellowLevelById),
      investedFellowExpIdentity:activation.investedFellowExpIdentity,
      investedFellowLevelIdentity:activation.investedFellowLevelIdentity,
      receiptIdentity:activation.receiptIdentity,
      identity:activation.identity
    }
  };
}

export function neutralProgression(state){
  return{
    player:{rank:state?.player?.rank,rankExp:state?.player?.rankExp},
    assignments:assignments(state),
    mastery:clone(state?.companionMastery),
    fellowExpLevels:Object.fromEntries(Object.entries(state?.fellows||{}).sort(([left],[right])=>left.localeCompare(right)).map(([id,actor])=>[id,{exp:actor.exp,level:actor.level}]))
  };
}

export function positiveCredits(rewardMap,canonicalIds=Object.keys(rewardMap||{})){
  return canonicalIds.filter(id=>Number.isSafeInteger(rewardMap?.[id])&&rewardMap[id]>0).map(id=>({historicalTargetId:id,rawAmount:rewardMap[id]}));
}

export function walletAlgebra(wallet){
  return Boolean(wallet)&&[wallet.balance,wallet.creditedTotal,wallet.spentTotal].every(value=>Number.isSafeInteger(value)&&value>=0)&&wallet.balance===wallet.creditedTotal-wallet.spentTotal;
}

export function makeReleasedV2(name='established'){
  const b1Contract=JSON.parse(read('qa/phase-24l-fellow-exp/contract.json'));
  const {foundation,wallet}=b1Fixtures.loadApis(b1Contract);
  const bundle=b1Fixtures.makeV1(foundation,name);
  const postB0=b1Fixtures.withPostB0Play(bundle);
  const activated=b1Fixtures.activate(wallet,bundle,postB0);
  if(!activated.ok)throw new Error(`Unable to build released B1 fixture: ${activated.reason||'unknown'}`);
  return{state:clone(activated.state),foundation,wallet,bundle};
}

export function loadCandidate(contract){
  if(!exists(contract.candidate.source))return null;
  const realm=vm.createContext({TextEncoder,console});
  vm.runInContext(read('src/phase24l-exp-foundation.js'),realm,{filename:'src/phase24l-exp-foundation.js'});
  vm.runInContext(read(contract.predecessor.source),realm,{filename:contract.predecessor.source});
  vm.runInContext(read(contract.candidate.source),realm,{filename:contract.candidate.source});
  return{realm,api:realm[contract.candidate.global]};
}
