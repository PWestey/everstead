#!/usr/bin/env node

import {createHash} from 'node:crypto';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

const scriptPath=fileURLToPath(import.meta.url);
const root=path.resolve(path.dirname(scriptPath),'..');
const recipePath=path.join(root,'qa/phase-24-baseline/fixtures/recipes.json');
const expectedIds=[
  'phase24a.fresh.schema13.v1',
  'phase24a.migrated-established.schema13.v1',
  'phase24a.true-high-investment.schema13.v1'
];

function invariant(condition,message){
  if(!condition)throw new Error(message);
}

function inspectNumbers(value,pointer='$',result={count:0,maxAbsInteger:0}){
  if(typeof value==='number'){
    invariant(Number.isFinite(value),`${pointer} is not finite`);
    invariant(Math.abs(value)<=Number.MAX_SAFE_INTEGER,`${pointer} exceeds safe numeric precision`);
    result.count++;
    if(Number.isInteger(value)){
      invariant(Number.isSafeInteger(value),`${pointer} is not a safe integer`);
      result.maxAbsInteger=Math.max(result.maxAbsInteger,Math.abs(value));
    }
    return result;
  }
  if(Array.isArray(value))value.forEach((item,index)=>inspectNumbers(item,`${pointer}[${index}]`,result));
  else if(value&&typeof value==='object')for(const [key,item] of Object.entries(value))inspectNumbers(item,`${pointer}.${key}`,result);
  return result;
}

const raw=await readFile(recipePath,'utf8');
const recipes=JSON.parse(raw);
invariant(recipes.contractVersion===1,'contractVersion must be 1');
invariant(recipes.contractId==='phase-24a-balance-baseline-v1','contractId is not frozen');
invariant(recipes.frozenNow===1800000000000,'frozenNow is not frozen');
invariant(recipes.authority?.globalName==='EVERSTEAD_PHASE24_SCALING','authority global is not frozen');
invariant(JSON.stringify(recipes.authority?.bridgeReadMethods)===JSON.stringify(['scalingDefinitions','scalingReport']),'authority bridge read methods are not frozen');
invariant(Array.isArray(recipes.profiles)&&recipes.profiles.length===3,'exactly three authority profiles are required');
invariant(JSON.stringify(recipes.profiles.map(item=>item.id))===JSON.stringify(expectedIds),'authority profile IDs or order changed');
invariant(recipes.profiles.every(item=>item.canonical===true),'every authority profile must be canonical');
invariant(recipes.profiles[0].persisted===false&&recipes.profiles[1].persisted===true&&recipes.profiles[2].persisted===false,'persisted profile boundary changed');
invariant(recipes.profiles[0].fixtureId===null&&recipes.profiles[0].expectedAnchors?.fellowCombatPower===35565,'true fresh must remain no-save schema 13');
invariant(recipes.historicalMigrationComparisons?.freshSchema12To13?.canonicalProfile===false&&recipes.historicalMigrationComparisons.freshSchema12To13.expectedAnchors?.fellowCombatPower===36366,'freshly migrated schema-12 comparison changed');
invariant(recipes.profiles[2].expectedAnchors?.companionUnroundedAggregate===50358,'high-investment unrounded Companion aggregate changed');
invariant(recipes.profiles[2].expectedAnchors?.companionActualPower===50355,'high-investment rounded Companion roster changed');
invariant(recipes.profiles[2].input?.collections?.status==='reserved-inactive','Collections must remain reserved-inactive');
invariant(recipes.profiles[2].input?.collections?.contributionBps===0&&recipes.profiles[2].input?.collections?.multiplier===1,'Collections must contribute zero');
invariant(recipes.nearCapQaEvidence?.canonicalProfile===false&&recipes.nearCapQaEvidence?.classification==='near-cap-qa-reference','all-unlocked must remain noncanonical near-cap QA evidence');
invariant(!recipes.profiles.some(item=>item.fixtureId==='p23.qa.all-unlocked.v1'),'all-unlocked must not become an authority profile');
invariant(!recipes.profiles.some(item=>item.fixtureId==='p23.qa.fresh.v1'),'freshly migrated schema-12 fixture must not become canonical true fresh');
invariant(recipes.reportRequirements?.collections?.currentStatus==='reserved-inactive','report Collection status changed');
invariant(recipes.reportRequirements?.collections?.currentContributionBps===0&&recipes.reportRequirements?.collections?.currentMultiplier===1,'report Collection contribution changed');

const serialized=JSON.stringify(recipes);
for(const forbidden of ['private-assets/','portrait.webp','thumb.webp','/Users/'])invariant(!serialized.includes(forbidden),`fixture contract exposes forbidden private path token ${forbidden}`);
const numeric=inspectNumbers(recipes);
const sha256=createHash('sha256').update(raw).digest('hex');

console.log(JSON.stringify({
  ok:true,
  contractId:recipes.contractId,
  sha256,
  profileIds:expectedIds,
  nearCapQaEvidence:recipes.nearCapQaEvidence.fixtureId,
  numeric,
  collections:recipes.reportRequirements.collections
},null,2));
