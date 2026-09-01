import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
import {performance} from 'node:perf_hooks';

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const read=file=>fs.readFileSync(path.join(ROOT,file),'utf8');
const bytes=value=>Buffer.byteLength(JSON.stringify(value));
const clone=value=>JSON.parse(JSON.stringify(value));
const sha256=value=>crypto.createHash('sha256').update(value).digest('hex');
const assert=(condition,message)=>{if(!condition)throw new Error(message)};
const safeAdd=(left,right,label)=>{const value=left+right;assert(Number.isSafeInteger(value)&&value>=0,`${label} overflow`);return value};
const rawIdentity=raw=>{let hash=2166136261;for(let index=0;index<raw.length;index++){hash^=raw.charCodeAt(index);hash=Math.imul(hash,16777619)}return`fnv1a32:${raw.length}:${(hash>>>0).toString(16).padStart(8,'0')}`};
const identity=(label,saveId,value)=>rawIdentity(JSON.stringify([label,saveId,value]));

const FIXTURE=JSON.parse(read('qa/phase-20-21-five-year-archive/fixture.json'));
const ACCEPTED_COMMIT=FIXTURE.acceptedCommit;
const SOURCE_HASHES=FIXTURE.sourceHashes;
for(const [file,expected] of Object.entries(SOURCE_HASHES))assert(sha256(read(file))===expected,`${file} differs from accepted ${ACCEPTED_COMMIT}`);

const realm={};realm.globalThis=realm;vm.createContext(realm);
for(const file of ['src/phase15-facilities.js','src/phase20-21-facilities.js'])vm.runInContext(read(file),realm,{filename:file});
const phase15=realm.EVERSTEAD_PHASE15_FACILITIES;
const phase2021=realm.EVERSTEAD_PHASE20_21_FACILITIES;
const facilities=phase2021.facilities;
assert(facilities.length===8,'Expected exactly eight Phase 20/21 facilities');
assert(phase15.recentReceiptLimit===512&&phase15.foldBatchSize===128,'Accepted Phase 15 archive bounds changed');

const SAVE_ID='save.phase20-21.longevity.qa.v1';
const START_AT=Date.parse(FIXTURE.cadence.start);
const END_AT=Date.parse(FIXTURE.cadence.end);
const ANNIVERSARY_DAYS=FIXTURE.cadence.anniversaryDays;
const DAYS=ANNIVERSARY_DAYS.at(-1);
const CLAIM_ROUNDS_PER_DAY=FIXTURE.cadence.claimRoundsPerFacilityPerDay;
const EXPECTED_CLAIMS=DAYS*CLAIM_ROUNDS_PER_DAY*facilities.length;
const SOURCE_TYPE='opportunity.facility.activity';
const REWARD_KEY='reward-aggregate.gold.global';
const RANGE_ENTRY_BUDGET=FIXTURE.thresholds.receiptRangeEntriesMax;
const SERIALIZED_BYTES_BUDGET=FIXTURE.thresholds.serializedBytesMax;
const PLATEAU_GROWTH_BUDGET=FIXTURE.thresholds.yearFiveGrowthBytesMax;
const VALIDATION_RANGE_VISIT_BUDGET=FIXTURE.thresholds.validationRangeVisitsMax;
assert(Number.isSafeInteger(START_AT)&&Number.isSafeInteger(END_AT)&&END_AT-START_AT===DAYS*86400000,'Fixture calendar span is invalid');
assert(RANGE_ENTRY_BUDGET===phase15.recentReceiptLimit+facilities.length*4,'Fixture range budget no longer matches the bounded-window policy');

function emptyCheckpoint(){const row={throughSequence:0,receiptCount:0,aggregateRewards:{},sourceCountsByType:{},previousIdentity:null,identity:''};row.identity=checkpointIdentity(row);return row}
function checkpointIdentity(row){const copy=clone(row);copy.identity='';return identity('phase-15-claim-archive-checkpoint-v1',SAVE_ID,copy)}
function receiptIdentity(row){const copy=clone(row);copy.identity='';return identity('phase-15-reward-receipt-v2',SAVE_ID,copy)}
function authorityIdentity(row){const copy=clone(row);copy.identity='';return identity('phase-20-21-canonical-claim-authority-v2',SAVE_ID,copy)}
function countRanges(ranges){let count=0,prior=0;for(const range of ranges){assert(Array.isArray(range)&&range.length===2,'Malformed range');const [start,end]=range;assert(Number.isSafeInteger(start)&&Number.isSafeInteger(end)&&start>=1&&end>=start,'Invalid range bounds');assert(prior===0||start>prior+1,'Ranges overlap or are needlessly adjacent');count=safeAdd(count,end-start+1,'range count');prior=end}return count}
function countThrough(ranges,through){let count=0;for(const [start,end] of ranges){if(start>through)break;count=safeAdd(count,Math.min(end,through)-start+1,'folded range count')}return count}
function appendIncreasingRange(ranges,ordinal){const tail=ranges.at(-1);if(tail&&ordinal===tail[1]+1)tail[1]=ordinal;else{assert(!tail||ordinal>tail[1]+1,'Non-increasing or duplicate ordinal');ranges.push([ordinal,ordinal])}}

const state={
  saveMeta:{saveId:SAVE_ID,revision:0,updatedAt:START_AT,source:'phase20-21-longevity-qa'},
  gold:0,
  legacyProgress:{metricDeltas:{'metric.gold-claimed-after-activation':0,'metric.facility-claims-after-activation':0}},
  phase15FacilityFoundation:{
    configIdentity:phase15.configId,
    facilitiesById:Object.fromEntries(facilities.map(item=>[item.facilityId,{nextOrdinal:0,localProgress:0,claimedOrdinalRanges:[],pendingById:{}}])),
    pendingOffers:{},
    claimArchive:{configId:phase15.claimArchiveConfigId,nextSequence:0,recentReceipts:[],predecessorClaimedOfferIds:[],globalClaimedSourceIds:[],archiveCheckpoint:emptyCheckpoint()},
    successorClaimAuthorityByFacilityId:Object.fromEntries(facilities.map(item=>{const row={facilityId:item.facilityId,sourceId:item.activityId,pendingBankAllocationsByRecordId:{},claimedDomainOrdinalRanges:[],claimedReceiptSequenceRanges:[],claimCount:0,localProgress:0,lastReceipt:null,identity:''};row.identity=authorityIdentity(row);return[item.facilityId,row]}))
  }
};

let folds=0,preclaimNeutralChecks=0;
const perFacilityFoldedGold=Object.fromEntries(facilities.map(item=>[item.facilityId,0]));

function makeReceipt(item,domainOrdinal,sequence,claimedAt){
  const rewardGold=phase2021.syntheticPolicy.rewardGoldByFacility[item.facilityId];
  const offerId=`reward.offer.facility.successor.${item.facilityId.slice(9)}.${domainOrdinal}.v2`;
  const pendingIdentity=identity('reward-offer-v1',SAVE_ID,{id:offerId,sourceType:SOURCE_TYPE,sourceId:item.activityId,offeredAt:claimedAt,rewards:[{kind:'gold',targetId:null,amount:rewardGold}]});
  const receipt={envelopeVersion:2,id:`reward.receipt.v2.${offerId.slice('reward.offer.'.length)}.${sequence}`,offerId,sourceType:SOURCE_TYPE,sourceId:item.activityId,facilityId:item.facilityId,domainOrdinal,definitionVersion:1,rewardPolicyVersion:1,claimedAt,sequence,pendingIdentity,rewards:[{kind:'gold',targetId:null,amount:rewardGold}],identity:''};
  receipt.identity=receiptIdentity(receipt);
  return receipt;
}

function foldIfNeeded(){
  const archive=state.phase15FacilityFoundation.claimArchive;
  if(archive.recentReceipts.length<=phase15.recentReceiptLimit)return;
  const folded=archive.recentReceipts.splice(0,phase15.foldBatchSize),prior=archive.archiveCheckpoint,aggregate=clone(prior.aggregateRewards),sourceCounts=clone(prior.sourceCountsByType);
  for(const receipt of folded){
    const reward=receipt.rewards[0];
    aggregate[REWARD_KEY]=safeAdd(aggregate[REWARD_KEY]||0,reward.amount,'checkpoint Gold');
    sourceCounts[SOURCE_TYPE]=safeAdd(sourceCounts[SOURCE_TYPE]||0,1,'checkpoint source count');
    perFacilityFoldedGold[receipt.facilityId]=safeAdd(perFacilityFoldedGold[receipt.facilityId],reward.amount,'facility folded Gold');
  }
  const checkpoint={throughSequence:folded.at(-1).sequence,receiptCount:safeAdd(prior.receiptCount,folded.length,'checkpoint receipt count'),aggregateRewards:aggregate,sourceCountsByType:sourceCounts,previousIdentity:prior.identity,identity:''};
  checkpoint.identity=checkpointIdentity(checkpoint);archive.archiveCheckpoint=checkpoint;folds++;
}

function claim(item,claimedAt){
  const foundation=state.phase15FacilityFoundation,archive=foundation.claimArchive,facility=foundation.facilitiesById[item.facilityId],authority=foundation.successorClaimAuthorityByFacilityId[item.facilityId];
  const domainOrdinal=facility.nextOrdinal+1,sequence=archive.nextSequence+1,rewardGold=phase2021.syntheticPolicy.rewardGoldByFacility[item.facilityId],localAmount=phase2021.syntheticPolicy.localProgressByFacility[item.facilityId];
  const preclaim={gold:state.gold,localProgress:authority.localProgress,claimCount:authority.claimCount,archiveSequence:archive.nextSequence};
  const receipt=makeReceipt(item,domainOrdinal,sequence,claimedAt);
  assert(state.gold===preclaim.gold&&authority.localProgress===preclaim.localProgress&&authority.claimCount===preclaim.claimCount&&archive.nextSequence===preclaim.archiveSequence,'Offer/resolution changed authority before manual claim');
  preclaimNeutralChecks++;
  facility.nextOrdinal=domainOrdinal;appendIncreasingRange(facility.claimedOrdinalRanges,domainOrdinal);facility.localProgress=safeAdd(facility.localProgress,localAmount,'facility local progress');
  archive.nextSequence=sequence;archive.recentReceipts.push(receipt);foldIfNeeded();
  appendIncreasingRange(authority.claimedDomainOrdinalRanges,domainOrdinal);appendIncreasingRange(authority.claimedReceiptSequenceRanges,sequence);authority.claimCount=safeAdd(authority.claimCount,1,'authority claim count');authority.localProgress=safeAdd(authority.localProgress,localAmount,'authority local progress');authority.lastReceipt=receipt;
  state.gold=safeAdd(state.gold,rewardGold,'Gold');
  state.legacyProgress.metricDeltas['metric.gold-claimed-after-activation']=safeAdd(state.legacyProgress.metricDeltas['metric.gold-claimed-after-activation'],rewardGold,'legacy Gold metric');
  state.legacyProgress.metricDeltas['metric.facility-claims-after-activation']=safeAdd(state.legacyProgress.metricDeltas['metric.facility-claims-after-activation'],1,'legacy claim metric');
  state.saveMeta.revision=sequence;state.saveMeta.updatedAt=claimedAt;
}

function refreshAuthorityIdentities(value){for(const row of Object.values(value.phase15FacilityFoundation.successorClaimAuthorityByFacilityId))row.identity=authorityIdentity(row)}

function validate(value){
  const started=performance.now(),foundation=value.phase15FacilityFoundation,archive=foundation.claimArchive,checkpoint=archive.archiveCheckpoint,rows=facilities.map(item=>foundation.successorClaimAuthorityByFacilityId[item.facilityId]),errors=[];
  const fail=message=>{if(!errors.includes(message))errors.push(message)};
  if(archive.nextSequence!==checkpoint.throughSequence+archive.recentReceipts.length)fail('archive.sequence-partition');
  if(archive.recentReceipts.length>phase15.recentReceiptLimit)fail('archive.recent-bound');
  if(checkpoint.receiptCount!==checkpoint.throughSequence||checkpoint.identity!==checkpointIdentity(checkpoint))fail('archive.checkpoint');
  if((checkpoint.sourceCountsByType[SOURCE_TYPE]||0)!==checkpoint.receiptCount)fail('archive.source-count');
  if(archive.recentReceipts.some((receipt,index)=>receipt.sequence!==checkpoint.throughSequence+index+1||receipt.identity!==receiptIdentity(receipt)))fail('archive.recent-lineage');
  let totalClaims=0,totalLocalProgress=0,rangeVisits=0;
  const flattened=[];
  for(const item of facilities){
    const row=foundation.successorClaimAuthorityByFacilityId[item.facilityId],facility=foundation.facilitiesById[item.facilityId],domainCount=countRanges(row.claimedDomainOrdinalRanges),receiptCount=countRanges(row.claimedReceiptSequenceRanges),recent=archive.recentReceipts.filter(receipt=>receipt.facilityId===item.facilityId),folded=countThrough(row.claimedReceiptSequenceRanges,checkpoint.throughSequence),expectedLocal=row.claimCount*phase2021.syntheticPolicy.localProgressByFacility[item.facilityId];
    rangeVisits+=row.claimedDomainOrdinalRanges.length+row.claimedReceiptSequenceRanges.length;
    flattened.push(...row.claimedReceiptSequenceRanges.map(range=>[...range,item.facilityId]));
    if(row.facilityId!==item.facilityId||row.sourceId!==item.activityId||row.identity!==authorityIdentity(row))fail(`${item.facilityId}.identity`);
    if(domainCount!==row.claimCount||receiptCount!==row.claimCount||folded+recent.length!==row.claimCount)fail(`${item.facilityId}.counts`);
    if(row.localProgress!==expectedLocal||facility.localProgress!==expectedLocal)fail(`${item.facilityId}.local-progress`);
    if(countRanges(facility.claimedOrdinalRanges)!==row.claimCount||JSON.stringify(facility.claimedOrdinalRanges)!==JSON.stringify(row.claimedDomainOrdinalRanges))fail(`${item.facilityId}.domain-ownership`);
    if(row.claimCount>0&&(row.lastReceipt?.sequence!==row.claimedReceiptSequenceRanges.at(-1)?.[1]||row.lastReceipt?.facilityId!==item.facilityId||row.lastReceipt?.identity!==receiptIdentity(row.lastReceipt)))fail(`${item.facilityId}.last-receipt`);
    if(recent.some(receipt=>!row.claimedReceiptSequenceRanges.some(([start,end])=>receipt.sequence>=start&&receipt.sequence<=end)))fail(`${item.facilityId}.recent-ownership`);
    totalClaims=safeAdd(totalClaims,row.claimCount,'validated claims');totalLocalProgress=safeAdd(totalLocalProgress,row.localProgress,'validated local progress');
  }
  flattened.sort((left,right)=>left[0]-right[0]);
  if(flattened.length!==totalClaims||flattened.some((range,index)=>range[0]!==range[1]||range[0]!==index+1||index>0&&range[0]<=flattened[index-1][1]))fail('global.receipt-ownership');
  if(totalClaims!==archive.nextSequence||value.legacyProgress.metricDeltas['metric.facility-claims-after-activation']!==totalClaims)fail('global.claim-count');
  const foldedGold=Object.values(perFacilityFoldedGold).reduce((sum,amount)=>safeAdd(sum,amount,'folded Gold sum'),0);
  if((checkpoint.aggregateRewards[REWARD_KEY]||0)!==foldedGold)fail('global.folded-rewards');
  return{ok:errors.length===0,errors,totalClaims,totalLocalProgress,receiptRangeEntries:flattened.length,domainRangeEntries:rows.reduce((sum,row)=>sum+row.claimedDomainOrdinalRanges.length,0),rangeVisits,validationMs:Number((performance.now()-started).toFixed(3))};
}

function snapshot(year){
  refreshAuthorityIdentities(state);
  const raw=JSON.stringify(state),parsed=JSON.parse(raw),validation=validate(parsed),archive=parsed.phase15FacilityFoundation.claimArchive,authorities=Object.values(parsed.phase15FacilityFoundation.successorClaimAuthorityByFacilityId);
  return{year,claims:archive.nextSequence,foldedReceipts:archive.archiveCheckpoint.receiptCount,recentReceipts:archive.recentReceipts.length,foldCount:folds,serializedBytes:Buffer.byteLength(raw),receiptRangeEntries:authorities.reduce((sum,row)=>sum+row.claimedReceiptSequenceRanges.length,0),domainRangeEntries:authorities.reduce((sum,row)=>sum+row.claimedDomainOrdinalRanges.length,0),maxFacilityReceiptRanges:Math.max(...authorities.map(row=>row.claimedReceiptSequenceRanges.length)),reloadValid:validation.ok,validationErrors:validation.errors,validationRangeVisits:validation.rangeVisits,validationMs:validation.validationMs};
}

const wallStarted=performance.now(),snapshots=[snapshot(0)];let anniversaryIndex=0;
for(let day=1;day<=DAYS;day++){
  for(let round=0;round<CLAIM_ROUNDS_PER_DAY;round++)for(let index=0;index<facilities.length;index++)claim(facilities[index],START_AT+day*86400000+round*3600000+index*60000);
  if(day===ANNIVERSARY_DAYS[anniversaryIndex]){snapshots.push(snapshot(anniversaryIndex+1));anniversaryIndex++}
}
const raw=JSON.stringify(state),reloaded=JSON.parse(raw);refreshAuthorityIdentities(reloaded);const finalValidation=validate(reloaded),finalSnapshot=snapshots.at(-1),year5Growth=finalSnapshot.serializedBytes-snapshots.at(-2).serializedBytes;
const authorityRows=Object.values(reloaded.phase15FacilityFoundation.successorClaimAuthorityByFacilityId);
const fragmentCounts=Object.fromEntries(authorityRows.map(row=>[row.facilityId,row.claimedReceiptSequenceRanges.length]));
const claimCounts=Object.fromEntries(authorityRows.map(row=>[row.facilityId,row.claimCount]));
const localProgress=Object.fromEntries(authorityRows.map(row=>[row.facilityId,row.localProgress]));
const lastReceipts=Object.fromEntries(authorityRows.map(row=>[row.facilityId,{sequence:row.lastReceipt.sequence,domainOrdinal:row.lastReceipt.domainOrdinal,id:row.lastReceipt.id,identity:row.lastReceipt.identity}]));
const deterministic={
  acceptedCommit:ACCEPTED_COMMIT,sourceHashes:SOURCE_HASHES,
  cadence:{start:FIXTURE.cadence.start,end:FIXTURE.cadence.end,days:DAYS,facilities:facilities.length,claimRoundsPerFacilityPerDay:CLAIM_ROUNDS_PER_DAY,totalClaims:EXPECTED_CLAIMS,pattern:FIXTURE.cadence.pattern},
  archivePolicy:{recentReceiptLimit:phase15.recentReceiptLimit,foldBatchSize:phase15.foldBatchSize},
  thresholds:{receiptRangeEntriesMax:RANGE_ENTRY_BUDGET,serializedBytesMax:SERIALIZED_BYTES_BUDGET,yearFiveGrowthBytesMax:PLATEAU_GROWTH_BUDGET,validationRangeVisitsMax:VALIDATION_RANGE_VISIT_BUDGET},
  snapshots:snapshots.map(({validationMs,...row})=>row),
  exactFinal:{claimCounts,localProgress,fragmentCounts,lastReceipts,gold:reloaded.gold,archiveCheckpoint:reloaded.phase15FacilityFoundation.claimArchive.archiveCheckpoint,recentReceiptCount:reloaded.phase15FacilityFoundation.claimArchive.recentReceipts.length,foldCount:folds,preclaimNeutralChecks,serializedSha256:sha256(raw),serializedBytes:bytes(reloaded),yearFiveGrowthBytes:year5Growth,finalValidation:{ok:finalValidation.ok,errors:finalValidation.errors,rangeVisits:finalValidation.rangeVisits},modeledMinimumCumulativeFullAuthorityRangeVisits:EXPECTED_CLAIMS*(EXPECTED_CLAIMS-1)/2},
  gates:{correctness:finalValidation.ok&&snapshots.every(row=>row.reloadValid)&&preclaimNeutralChecks===EXPECTED_CLAIMS,receiptOwnershipBounded:finalSnapshot.receiptRangeEntries<=RANGE_ENTRY_BUDGET,serializedSaveWithinBudget:finalSnapshot.serializedBytes<=SERIALIZED_BYTES_BUDGET,yearFiveGrowthPlateaus:year5Growth<=PLATEAU_GROWTH_BUDGET,validationWorkBounded:finalValidation.rangeVisits<=VALIDATION_RANGE_VISIT_BUDGET}
};
deterministic.verdict=Object.values(deterministic.gates).every(Boolean)?'PASS':'FAIL';
const report={contract:'phase-20-21-five-year-archive-qa-v1',deterministicEvidenceSha256:sha256(JSON.stringify(deterministic)),deterministic,observedWallClock:{simulationMs:Number((performance.now()-wallStarted).toFixed(3)),snapshotValidationMs:snapshots.map(row=>row.validationMs),finalValidationMs:finalValidation.validationMs}};
assert(finalValidation.ok,'Correctness invariants failed');
assert(deterministic.verdict==='FAIL','Accepted commit no longer demonstrates the expected longevity blocker; review gate thresholds and implementation');
const expected=FIXTURE.expectedAcceptedResult;
assert(deterministic.verdict===expected.verdict&&EXPECTED_CLAIMS===expected.totalClaims&&folds===expected.foldCount&&finalSnapshot.foldedReceipts===expected.foldedReceipts&&finalSnapshot.recentReceipts===expected.recentReceipts&&finalSnapshot.receiptRangeEntries===expected.receiptRangeEntries&&finalSnapshot.serializedBytes===expected.serializedBytes&&year5Growth===expected.yearFiveGrowthBytes&&finalValidation.rangeVisits===expected.validationRangeVisits&&deterministic.exactFinal.serializedSha256===expected.serializedSha256&&report.deterministicEvidenceSha256===expected.deterministicEvidenceSha256,'Accepted-result fixture changed');
process.stdout.write(JSON.stringify(report,null,2)+'\n');
