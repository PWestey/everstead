import {createHash} from 'node:crypto';

const DAYS=1826;
const CLAIMS_PER_FACILITY_PER_DAY=8;
const RECENT_LIMIT=512;
const SAVE_ID='save-phase20-21-five-year-bounded';
const FACILITIES=[
  ['facility.command-center','activity.petitions',12],
  ['facility.archives','activity.research',10],
  ['facility.training-grounds','activity.drills',14],
  ['facility.hearth','activity.gatherings',11],
  ['facility.gatehouse','activity.road-events',13],
  ['facility.market-workshop','activity.orders',15],
  ['facility.gardens','activity.cultivation',9],
  ['facility.forge','activity.commissions',16]
];
const EXPECTED_SUCCESSOR_CLAIMS=DAYS*CLAIMS_PER_FACILITY_PER_DAY*FACILITIES.length;
const rows=[];
const check=(id,condition,detail='')=>rows.push({id,pass:Boolean(condition),detail:condition?'':detail});
const hash=value=>createHash('sha256').update(typeof value==='string'?value:JSON.stringify(value)).digest('hex');
const clone=value=>structuredClone(value);
const safeAdd=(left,right)=>{const value=left+right;if(!Number.isSafeInteger(value)||value<0)throw new Error('unsafe integer');return value};
const addRange=(ranges,ordinal)=>{const result=ranges.map(range=>[...range]);const last=result.at(-1);if(last&&last[1]+1===ordinal)last[1]=ordinal;else result.push([ordinal,ordinal]);return result};
const rangeCount=ranges=>ranges.reduce((total,[start,end])=>safeAdd(total,end-start+1),0);
const receiptIdentity=receipt=>{const copy={...receipt,identity:''};return hash(['phase20-21-five-year-receipt',SAVE_ID,copy])};
const checkpointIdentity=checkpoint=>{const copy=clone(checkpoint);copy.identity='';return hash(['phase20-21-five-year-checkpoint-v3',SAVE_ID,copy])};
const rowIdentity=row=>{const copy=clone(row);copy.identity='';return hash(['phase20-21-five-year-authority-v2',SAVE_ID,copy])};
const itemFor=id=>FACILITIES.find(([facilityId])=>facilityId===id);

function createState(){
  const activationSequenceFloor=137,activationFoldedThrough=100;
  const checkpoint={authorityVersion:3,activationSequenceFloor,activationFoldedThrough,observedFoldedThrough:activationFoldedThrough,foldedClaimCountByFacilityId:Object.fromEntries(FACILITIES.map(([id])=>[id,0])),latestFoldedReceiptByFacilityId:Object.fromEntries(FACILITIES.map(([id])=>[id,null])),foldedSuccessorClaimCount:0,identity:''};
  checkpoint.identity=checkpointIdentity(checkpoint);
  const authorities=Object.fromEntries(FACILITIES.map(([facilityId,sourceId,localDelta])=>{const row={facilityId,sourceId,claimedDomainOrdinalRanges:[],claimCount:0,localProgress:0,lastReceipt:null,identity:''};row.identity=rowIdentity(row);return[facilityId,row]}));
  const recentReceipts=[];
  for(let sequence=activationFoldedThrough+1;sequence<=activationSequenceFloor;sequence++)recentReceipts.push({sequence,offerId:`reward.offer.predecessor.${sequence}`,sourceType:'opportunity.facility.activity',sourceId:'activity.petitions'});
  return{saveId:SAVE_ID,archive:{nextSequence:activationSequenceFloor,recentReceipts,archiveCheckpoint:{throughSequence:activationFoldedThrough,receiptCount:activationFoldedThrough}},checkpoint,authorities,nextDomain:Object.fromEntries(FACILITIES.map(([id])=>[id,0])),activationAnchor:{activationSequenceFloor,activationFoldedThrough},predecessorReceiptCount:0};
}

function classify(state,receipt){
  if(!receipt||!Number.isSafeInteger(receipt.sequence)||receipt.sequence<=state.checkpoint.activationSequenceFloor||typeof receipt.offerId!=='string'||!receipt.offerId.startsWith('reward.offer.facility.successor.'))return'other';
  const item=itemFor(receipt.facilityId),expected=item&&`reward.offer.facility.successor.${receipt.facilityId.slice(9)}.${receipt.domainOrdinal}.v2`;
  if(!item||receipt.offerId!==expected||receipt.sourceType!=='opportunity.facility.activity'||receipt.sourceId!==item[1]||receipt.rewards?.length!==1||receipt.rewards[0].kind!=='gold'||receipt.rewards[0].amount!==100+item[2]||receipt.identity!==receiptIdentity(receipt))return'invalid';
  return'successor';
}

function latestRecentSuccessor(state,facilityId){
  for(let index=state.archive.recentReceipts.length-1;index>=0;index--){const receipt=state.archive.recentReceipts[index];if(receipt.facilityId===facilityId&&classify(state,receipt)==='successor')return receipt}
  return null;
}

function foldOverflow(state){
  if(state.archive.recentReceipts.length<=RECENT_LIMIT)return 0;
  const count=128;
  const removed=state.archive.recentReceipts.slice(0,count),retained=state.archive.recentReceipts.slice(count),priorThrough=state.archive.archiveCheckpoint.throughSequence;
  if(removed[0]?.sequence!==priorThrough+1||removed.at(-1)?.sequence!==priorThrough+count)throw new Error('noncontiguous fold');
  state.archive.recentReceipts=retained;
  state.archive.archiveCheckpoint.throughSequence=removed.at(-1).sequence;
  state.archive.archiveCheckpoint.receiptCount=safeAdd(state.archive.archiveCheckpoint.receiptCount,count);
  const affected=new Set;
  for(const receipt of removed){
    const kind=classify(state,receipt);if(kind==='invalid')throw new Error('invalid successor receipt');if(kind!=='successor')continue;
    const id=receipt.facilityId;
    state.checkpoint.foldedClaimCountByFacilityId[id]=safeAdd(state.checkpoint.foldedClaimCountByFacilityId[id],1);
    state.checkpoint.foldedSuccessorClaimCount=safeAdd(state.checkpoint.foldedSuccessorClaimCount,1);
    state.checkpoint.latestFoldedReceiptByFacilityId[id]=clone(receipt);
    affected.add(id);
  }
  state.checkpoint.observedFoldedThrough=state.archive.archiveCheckpoint.throughSequence;
  for(const facilityId of affected){const row=state.authorities[facilityId];row.lastReceipt=clone(latestRecentSuccessor(state,facilityId)||state.checkpoint.latestFoldedReceiptByFacilityId[facilityId]);row.identity=rowIdentity(row)}
  state.checkpoint.identity=checkpointIdentity(state.checkpoint);
  return count;
}

function appendPredecessorReceipt(state,index){
  const sequence=safeAdd(state.archive.nextSequence,1);state.archive.nextSequence=sequence;state.predecessorReceiptCount=safeAdd(state.predecessorReceiptCount,1);
  state.archive.recentReceipts.push({sequence,offerId:`reward.offer.predecessor.restaurant.${index}`,sourceType:'opportunity.facility.activity',sourceId:index%2?'activity.petitions':'activity.research'});
  foldOverflow(state);
}

function appendSuccessorClaim(state,facilityId){
  const item=itemFor(facilityId),domainOrdinal=safeAdd(state.nextDomain[facilityId],1),sequence=safeAdd(state.archive.nextSequence,1),rewards=[{kind:'gold',amount:100+item[2]}];
  state.nextDomain[facilityId]=domainOrdinal;state.archive.nextSequence=sequence;
  const receipt={envelopeVersion:2,id:`reward.receipt.phase20-21.${sequence}`,offerId:`reward.offer.facility.successor.${facilityId.slice(9)}.${domainOrdinal}.v2`,offerIdentity:`offer.identity.${facilityId}.${domainOrdinal}`,sourceType:'opportunity.facility.activity',sourceId:item[1],facilityId,domainOrdinal,offeredAt:sequence,claimedAt:sequence,sequence,rewards,definitionVersion:1,rewardPolicyVersion:1,identity:''};receipt.identity=receiptIdentity(receipt);
  state.archive.recentReceipts.push(receipt);
  const row=state.authorities[facilityId];row.claimedDomainOrdinalRanges=addRange(row.claimedDomainOrdinalRanges,domainOrdinal);row.claimCount=safeAdd(row.claimCount,1);row.localProgress=safeAdd(row.localProgress,item[2]);row.lastReceipt=clone(receipt);row.identity=rowIdentity(row);
  foldOverflow(state);
}

function validate(state){
  if(state.saveId!==SAVE_ID||state.activationAnchor.activationSequenceFloor!==state.checkpoint.activationSequenceFloor||state.activationAnchor.activationFoldedThrough!==state.checkpoint.activationFoldedThrough||state.checkpoint.observedFoldedThrough!==state.archive.archiveCheckpoint.throughSequence||state.checkpoint.identity!==checkpointIdentity(state.checkpoint)||state.archive.recentReceipts.length>RECENT_LIMIT)return false;
  let rowTotal=0,recentSuccessorTotal=0,foldedTotal=0;const latestSequences=new Set;
  for(const [facilityId,sourceId,localDelta] of FACILITIES){
    const row=state.authorities[facilityId],folded=state.checkpoint.foldedClaimCountByFacilityId[facilityId],latestFolded=state.checkpoint.latestFoldedReceiptByFacilityId[facilityId],recent=state.archive.recentReceipts.filter(receipt=>classify(state,receipt)==='successor'&&receipt.facilityId===facilityId),expectedLast=recent.at(-1)||latestFolded;
    if(!row||row.facilityId!==facilityId||row.sourceId!==sourceId||row.identity!==rowIdentity(row)||rangeCount(row.claimedDomainOrdinalRanges)!==row.claimCount||row.claimedDomainOrdinalRanges.length>1||row.claimCount!==folded+recent.length||row.localProgress!==row.claimCount*localDelta||JSON.stringify(row.lastReceipt)!==JSON.stringify(expectedLast)||latestFolded&&latestFolded.domainOrdinal>row.claimCount)return false;
    if(folded===0&&latestFolded!==null||folded>0&&(classify(state,latestFolded)!=='successor'||latestFolded.facilityId!==facilityId||latestFolded.sequence>state.checkpoint.observedFoldedThrough||latestSequences.has(latestFolded.sequence)))return false;
    if(latestFolded)latestSequences.add(latestFolded.sequence);
    rowTotal=safeAdd(rowTotal,row.claimCount);recentSuccessorTotal=safeAdd(recentSuccessorTotal,recent.length);foldedTotal=safeAdd(foldedTotal,folded);
  }
  return foldedTotal===state.checkpoint.foldedSuccessorClaimCount&&rowTotal===foldedTotal+recentSuccessorTotal&&rowTotal===EXPECTED_SUCCESSOR_CLAIMS&&state.checkpoint.foldedSuccessorClaimCount<=state.checkpoint.observedFoldedThrough-state.checkpoint.activationSequenceFloor;
}

function runScenario(){
  const state=createState();let successorIndex=0;
  for(let day=0;day<DAYS;day++)for(let pass=0;pass<CLAIMS_PER_FACILITY_PER_DAY;pass++)for(const [facilityId] of FACILITIES){appendSuccessorClaim(state,facilityId);successorIndex++;if(successorIndex%997===0)appendPredecessorReceipt(state,successorIndex)}
  const validationStarted=performance.now(),valid=validate(state),validationMs=performance.now()-validationStarted,serialized=JSON.stringify({archive:state.archive,checkpoint:state.checkpoint,authorities:state.authorities,activationAnchor:state.activationAnchor}),roundTripped=JSON.parse(serialized);
  return{state,valid,validationMs,serializedBytes:Buffer.byteLength(serialized),serializedHash:hash(serialized),roundTripValid:validate({...state,...roundTripped})};
}

const started=performance.now(),first=runScenario(),second=runScenario(),elapsedMs=performance.now()-started;
const threshold=createState();while(threshold.archive.recentReceipts.length<=RECENT_LIMIT){const sequence=safeAdd(threshold.archive.nextSequence,1);threshold.archive.nextSequence=sequence;threshold.archive.recentReceipts.push({sequence,offerId:`reward.offer.predecessor.threshold.${sequence}`,sourceType:'opportunity.facility.activity',sourceId:'activity.petitions'})}const thresholdRemoved=foldOverflow(threshold);
check('exact-phase15-threshold-fold-batch',thresholdRemoved===128&&threshold.archive.recentReceipts.length===385&&threshold.archive.archiveCheckpoint.throughSequence===228&&threshold.checkpoint.observedFoldedThrough===228,'513 threshold did not remove exact oldest 128');
check('exact-five-year-successor-volume',Object.values(first.state.authorities).reduce((sum,row)=>sum+row.claimCount,0)===EXPECTED_SUCCESSOR_CLAIMS,`expected ${EXPECTED_SUCCESSOR_CLAIMS}`);
check('predecessor-triggered-folds-exercised',first.state.predecessorReceiptCount>100,'mixed predecessor receipts missing');
check('bounded-fixed-eight-checkpoint',Object.keys(first.state.checkpoint.foldedClaimCountByFacilityId).length===8&&Object.keys(first.state.checkpoint.latestFoldedReceiptByFacilityId).length===8,'checkpoint cardinality drift');
check('bounded-recent-window',first.state.archive.recentReceipts.length>=RECENT_LIMIT-127&&first.state.archive.recentReceipts.length<=RECENT_LIMIT,`retained ${first.state.archive.recentReceipts.length}`);
check('bounded-domain-ranges',Object.values(first.state.authorities).every(row=>row.claimedDomainOrdinalRanges.length===1),'sequential domain history fragmented');
check('successor-conservation-valid',first.valid,'final source/facility/count/latest conservation invalid');
check('round-trip-import-valid',first.roundTripValid,'round-trip validation failed');
check('incremental-save-under-one-mib',first.serializedBytes<1024*1024,`${first.serializedBytes} bytes`);
check('bounded-final-validation-time',first.validationMs<1000,`${first.validationMs.toFixed(2)}ms`);
check('deterministic-second-run',second.valid&&second.roundTripValid&&second.serializedHash===first.serializedHash&&second.serializedBytes===first.serializedBytes,'second run drift');
check('bounded-two-run-wall-time',elapsedMs<30000,`${elapsedMs.toFixed(2)}ms`);

for(const result of rows)console.log(`${result.pass?'PASS':'FAIL'} ${result.id}${result.detail?` — ${result.detail}`:''}`);
const passed=rows.filter(result=>result.pass).length,failed=rows.length-passed;
console.log(`METRIC successorClaims=${EXPECTED_SUCCESSOR_CLAIMS} predecessorReceipts=${first.state.predecessorReceiptCount} bytes=${first.serializedBytes} validationMs=${first.validationMs.toFixed(2)} sha256=${first.serializedHash}`);
console.log(`RESULT ${passed} passed, ${failed} failed`);
process.exitCode=failed?1:0;
