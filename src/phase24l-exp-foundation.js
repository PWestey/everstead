/* Everstead Phase 24L-B0 · pure schema-15 banked EXP foundation v1. */
(function installEversteadPhaseTwentyFourLExpFoundation(global){
  'use strict';

  const ROOT_KEY='experienceProgression';
  const SUCCESSOR_SCHEMA=15;
  const PREDECESSOR_SCHEMA=14;
  const POLICY_ID='everstead.exp-wallet.phase-24l.v1';
  const MIGRATION_ID='migration.schema-14-to-15.phase-24l-exp-wallet.v1';
  const CHECKPOINT_KIND='phase24l.pre-v15-checkpoint.v1';
  const DIRECT_ORIGIN_KIND='phase24l.direct-schema-15-origin.v1';
  const LEDGER_VERSION=1;
  const LINEAGE_KINDS=new Set(['schema-14-to-15-migration','direct-schema-15','safe-reset-schema-15']);
  const HASH=/^[0-9a-f]{64}$/;

  const isObject=value=>Boolean(value)&&typeof value==='object'&&!Array.isArray(value);
  const clone=value=>JSON.parse(JSON.stringify(value));
  const safe=value=>Number.isSafeInteger(value)&&value>=0;
  const exactKeys=(value,keys)=>isObject(value)&&Object.keys(value).length===keys.length&&keys.every(key=>Object.hasOwn(value,key));
  const freeze=value=>{if(value&&typeof value==='object'&&!Object.isFrozen(value)){for(const child of Object.values(value))freeze(child);Object.freeze(value)}return value};

  function canonicalStringify(value,seen=new Set()){
    if(value===null)return'null';
    if(typeof value==='string'||typeof value==='boolean')return JSON.stringify(value);
    if(typeof value==='number'){if(!Number.isFinite(value))throw new TypeError('Canonical values must be finite');return Object.is(value,-0)?'0':JSON.stringify(value)}
    if(Array.isArray(value)){if(seen.has(value))throw new TypeError('Canonical values must be acyclic');seen.add(value);const result='['+value.map(item=>canonicalStringify(item,seen)).join(',')+']';seen.delete(value);return result}
    if(!isObject(value)||seen.has(value))throw new TypeError('Canonical values must be acyclic plain data');
    seen.add(value);const result='{'+Object.keys(value).sort().map(key=>JSON.stringify(key)+':'+canonicalStringify(value[key],seen)).join(',')+'}';seen.delete(value);return result;
  }
  function utf8(value){return new TextEncoder().encode(String(value))}
  function sha256(value){
    const bytes=[...utf8(value)],bitLength=bytes.length*8;bytes.push(0x80);while(bytes.length%64!==56)bytes.push(0);const high=Math.floor(bitLength/0x100000000),low=bitLength>>>0;for(let shift=24;shift>=0;shift-=8)bytes.push((high>>>shift)&255);for(let shift=24;shift>=0;shift-=8)bytes.push((low>>>shift)&255);
    const h=[0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19],k=[0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2],rotr=(number,bits)=>(number>>>bits)|(number<<(32-bits));
    for(let offset=0;offset<bytes.length;offset+=64){const w=new Array(64);for(let index=0;index<16;index++){const base=offset+index*4;w[index]=((bytes[base]<<24)|(bytes[base+1]<<16)|(bytes[base+2]<<8)|bytes[base+3])>>>0}for(let index=16;index<64;index++){const a=w[index-15],b=w[index-2],s0=rotr(a,7)^rotr(a,18)^(a>>>3),s1=rotr(b,17)^rotr(b,19)^(b>>>10);w[index]=(w[index-16]+s0+w[index-7]+s1)>>>0}let[a,b,c,d,e,f,g,z]=h;for(let index=0;index<64;index++){const s1=rotr(e,6)^rotr(e,11)^rotr(e,25),choice=(e&f)^(~e&g),t1=(z+s1+choice+k[index]+w[index])>>>0,s0=rotr(a,2)^rotr(a,13)^rotr(a,22),majority=(a&b)^(a&c)^(b&c),t2=(s0+majority)>>>0;z=g;g=f;f=e;e=(d+t1)>>>0;d=c;c=b;b=a;a=(t1+t2)>>>0}for(let index=0;index<8;index++)h[index]=(h[index]+[a,b,c,d,e,f,g,z][index])>>>0}
    return h.map(value=>value.toString(16).padStart(8,'0')).join('');
  }

  function checkpointIdentity(checkpoint){const projection={...clone(checkpoint),identity:''};return sha256(canonicalStringify(['phase24l.pre-v15-checkpoint.v1',projection]))}
  function capturePredecessorCheckpoint(predecessor,raw,{checkpointId}={}){
    if(predecessor?.schemaVersion!==PREDECESSOR_SCHEMA||typeof predecessor.saveMeta?.saveId!=='string'||!predecessor.saveMeta.saveId||typeof raw!=='string'||JSON.stringify(predecessor)!==raw||typeof checkpointId!=='string'||!/^[A-Za-z0-9._:-]{1,128}$/.test(checkpointId))throw new TypeError('Exact canonical schema-14 bytes and a stable checkpoint ID are required');
    const checkpoint={kind:CHECKPOINT_KIND,id:checkpointId,saveId:predecessor.saveMeta.saveId,rawIdentity:sha256(raw),semanticIdentity:sha256(canonicalStringify(predecessor)),exactByteLength:utf8(raw).length,writeOnceVerified:false,identity:''};checkpoint.identity=checkpointIdentity(checkpoint);return freeze(checkpoint);
  }
  function attestPredecessorCheckpoint(checkpoint,{rereadRaw}={}){
    if(typeof rereadRaw!=='string'||sha256(rereadRaw)!==checkpoint?.rawIdentity||utf8(rereadRaw).length!==checkpoint?.exactByteLength)throw new TypeError('Pre-v15 checkpoint bytes did not verify');
    let predecessor;try{predecessor=JSON.parse(rereadRaw)}catch{throw new TypeError('Pre-v15 checkpoint is not JSON')}
    if(predecessor?.schemaVersion!==PREDECESSOR_SCHEMA||checkpoint.semanticIdentity!==sha256(canonicalStringify(predecessor))||checkpoint.identity!==checkpointIdentity(checkpoint))throw new TypeError('Pre-v15 checkpoint attestation failed');
    const attested={...clone(checkpoint),writeOnceVerified:true,identity:''};attested.identity=checkpointIdentity(attested);return freeze(attested);
  }
  function baselineMaps(state){
    const capture=rows=>Object.fromEntries(Object.keys(rows||{}).sort().map(id=>{const exp=rows[id]?.exp;if(!safe(exp))throw new TypeError(`Actor ${id} has invalid invested EXP`);return[id,exp]}));
    return{fellowExpById:capture(state.fellows),companionExpById:capture(state.companions)};
  }
  function emptyWallet(){return{balance:0,creditedTotal:0,spentTotal:0}}
  function ledgerFoldIdentity(saveId){return sha256(canonicalStringify(['phase24l.exp-ledger-fold.v1',saveId,0,[]]))}
  function emptyLedger(saveId){return{version:LEDGER_VERSION,throughSequence:0,entryCount:0,foldedIdentity:ledgerFoldIdentity(saveId),entries:[]}}
  function baselineIdentity(saveId,baselines){return sha256(canonicalStringify(['phase24l.exp-baselines.v1',saveId,baselines]))}
  function walletIdentity(saveId,wallets,ledger){return sha256(canonicalStringify(['phase24l.exp-wallet-origin.v1',saveId,wallets,ledger]))}
  function migrationReceiptIdentity(receipt){const projection={...clone(receipt),identity:''};return sha256(canonicalStringify(['phase24l.schema-15-migration-receipt.v1',projection]))}
  function directOriginIdentity(attestation){const projection={...clone(attestation),identity:''};return sha256(canonicalStringify(['phase24l.schema-15-direct-origin.v1',projection]))}
  function createRoot(origin,{activatedAt,lineageKind,checkpoint=null,directOriginAttestation=null}){
    const baselines=baselineMaps(origin),wallets={fellow:emptyWallet(),companion:emptyWallet()},ledger=emptyLedger(origin.saveMeta.saveId);
    return{version:1,policyId:POLICY_ID,activatedAt,baselines,wallets,ledger,migration:{lineageKind,predecessorSemanticIdentity:checkpoint?.semanticIdentity??null,predecessorRawIdentity:checkpoint?.rawIdentity??null,predecessorCheckpointIdentity:checkpoint?.identity??null,directOriginAttestation:directOriginAttestation?clone(directOriginAttestation):null,baselineIdentity:baselineIdentity(origin.saveMeta.saveId,baselines),walletIdentity:walletIdentity(origin.saveMeta.saveId,wallets,ledger)}};
  }
  function currentSchema14Projection(state){const projected=clone(state);delete projected[ROOT_KEY];projected.schemaVersion=PREDECESSOR_SCHEMA;if(isObject(projected.saveMeta)&&Array.isArray(projected.saveMeta.appliedMigrations))projected.saveMeta.appliedMigrations=projected.saveMeta.appliedMigrations.filter(item=>item?.id!==MIGRATION_ID);return projected}
  function migrateSchema14To15(predecessor,{now,source='schema-14-to-15',predecessorValidatorId,validatePredecessor,predecessorCheckpoint,resolvePredecessorCheckpoint}={}){
    if(predecessor?.schemaVersion!==PREDECESSOR_SCHEMA||Object.hasOwn(predecessor,ROOT_KEY)||!safe(now)||now<predecessor.saveMeta.updatedAt||typeof predecessorValidatorId!=='string'||typeof validatePredecessor!=='function'||validatePredecessor(freeze(clone(predecessor)))!==true||predecessorCheckpoint?.writeOnceVerified!==true)throw new TypeError('Authenticated schema-14 migration input is required');
    const resolved=typeof resolvePredecessorCheckpoint==='function'?resolvePredecessorCheckpoint(predecessorCheckpoint.identity):null,raw=typeof resolved==='string'?resolved:resolved?.raw,checkpoint=resolved?.checkpoint;
    if(raw!==JSON.stringify(predecessor)||checkpoint?.identity!==predecessorCheckpoint.identity||sha256(raw)!==predecessorCheckpoint.rawIdentity)throw new TypeError('Migration checkpoint could not be resolved exactly');
    if(predecessor.saveMeta.revision>=Number.MAX_SAFE_INTEGER)throw new RangeError('Schema-15 migration revision exceeds safe integer range');
    const state=clone(predecessor);state.schemaVersion=SUCCESSOR_SCHEMA;state.saveMeta=clone(state.saveMeta);state.saveMeta.appliedMigrations=clone(state.saveMeta.appliedMigrations||[]);state.saveMeta.revision=predecessor.saveMeta.revision+1;state.saveMeta.updatedAt=Math.max(state.saveMeta.updatedAt,now);state.saveMeta.source=source;state[ROOT_KEY]=createRoot(predecessor,{activatedAt:now,lineageKind:'schema-14-to-15-migration',checkpoint:predecessorCheckpoint});
    const receipt={id:MIGRATION_ID,from:PREDECESSOR_SCHEMA,to:SUCCESSOR_SCHEMA,receiptVersion:1,appliedAt:now,source,policyId:POLICY_ID,predecessorValidatorId,predecessorSaveId:predecessor.saveMeta.saveId,predecessorRevision:predecessor.saveMeta.revision,predecessorUpdatedAt:predecessor.saveMeta.updatedAt,predecessorSemanticIdentity:predecessorCheckpoint.semanticIdentity,predecessorRawIdentity:predecessorCheckpoint.rawIdentity,predecessorCheckpointIdentity:predecessorCheckpoint.identity,baselineIdentity:state[ROOT_KEY].migration.baselineIdentity,walletIdentity:state[ROOT_KEY].migration.walletIdentity,rewardApplications:0,pendingEntitlementsConverted:false,identity:''};receipt.identity=migrationReceiptIdentity(receipt);state.saveMeta.appliedMigrations.push(receipt);
    return freeze({state,receipt:clone(receipt),rewardApplications:0,walletApplications:0});
  }
  function captureDirectOriginAttestation(origin,{lineageKind,directOriginValidatorId,validateDirectOrigin}={}){
    if(origin?.schemaVersion!==PREDECESSOR_SCHEMA||!['direct-schema-15','safe-reset-schema-15'].includes(lineageKind)||typeof directOriginValidatorId!=='string'||typeof validateDirectOrigin!=='function'||validateDirectOrigin(freeze(clone(origin)),lineageKind)!==true)throw new TypeError('Authenticated direct schema-15 origin is required');
    const attestation={kind:DIRECT_ORIGIN_KIND,lineageKind,directOriginValidatorId,saveId:origin.saveMeta.saveId,revision:origin.saveMeta.revision,createdAt:origin.saveMeta.createdAt,source:origin.saveMeta.source,semanticIdentity:sha256(canonicalStringify(origin)),identity:''};attestation.identity=directOriginIdentity(attestation);return freeze(attestation);
  }
  function createDirectSchema15(origin,{lineageKind='direct-schema-15',directOriginValidatorId,validateDirectOrigin}={}){
    const attestation=captureDirectOriginAttestation(origin,{lineageKind,directOriginValidatorId,validateDirectOrigin}),state=clone(origin);state.schemaVersion=SUCCESSOR_SCHEMA;state[ROOT_KEY]=createRoot(origin,{activatedAt:origin.saveMeta.createdAt,lineageKind,directOriginAttestation:attestation});return freeze({state,attestation,rewardApplications:0,walletApplications:0});
  }
  function validBaselineMap(map,actors){return isObject(map)&&canonicalStringify(Object.keys(map))===canonicalStringify(Object.keys(actors||{}).sort())&&Object.entries(map).every(([id,value])=>safe(value)&&safe(actors[id]?.exp)&&value<=actors[id].exp)}
  function validateSuccessorStateUnsafe(state,options={}){
    const errors=[],fail=path=>{if(!errors.includes(path))errors.push(path)};
    if(!isObject(state)||state.schemaVersion!==SUCCESSOR_SCHEMA||!isObject(state.saveMeta)||!Array.isArray(state.saveMeta.appliedMigrations)||!safe(state.saveMeta.revision)||typeof state.saveMeta.saveId!=='string'||!state.saveMeta.saveId)return{ok:false,errors:['$']};
    const projection=currentSchema14Projection(state);if(typeof options.validatePredecessor!=='function'||options.validatePredecessor(freeze(clone(projection)))!==true)fail('current-schema-14-projection');
    const root=state[ROOT_KEY],rootKeys=['version','policyId','activatedAt','baselines','wallets','ledger','migration'];if(!exactKeys(root,rootKeys)||root.version!==1||root.policyId!==POLICY_ID||!safe(root.activatedAt)||root.activatedAt>state.saveMeta.updatedAt)return{ok:false,errors:[ROOT_KEY]};
    if(!exactKeys(root.baselines,['fellowExpById','companionExpById'])||!validBaselineMap(root.baselines.fellowExpById,state.fellows)||!validBaselineMap(root.baselines.companionExpById,state.companions))fail('experienceProgression.baselines');
    if(!exactKeys(root.wallets,['fellow','companion']))fail('experienceProgression.wallets');else for(const roster of ['fellow','companion']){const wallet=root.wallets[roster];if(!exactKeys(wallet,['balance','creditedTotal','spentTotal'])||!safe(wallet.balance)||!safe(wallet.creditedTotal)||!safe(wallet.spentTotal)||wallet.balance!==0||wallet.creditedTotal!==0||wallet.spentTotal!==0)fail(`experienceProgression.wallets.${roster}`)}
    const ledger=root.ledger;if(!exactKeys(ledger,['version','throughSequence','entryCount','foldedIdentity','entries'])||ledger.version!==LEDGER_VERSION||ledger.throughSequence!==0||ledger.entryCount!==0||ledger.entries.length!==0||ledger.foldedIdentity!==ledgerFoldIdentity(state.saveMeta.saveId))fail('experienceProgression.ledger');
    const migration=root.migration,migrationKeys=['lineageKind','predecessorSemanticIdentity','predecessorRawIdentity','predecessorCheckpointIdentity','directOriginAttestation','baselineIdentity','walletIdentity'];if(!exactKeys(migration,migrationKeys)||!LINEAGE_KINDS.has(migration.lineageKind)||migration.baselineIdentity!==baselineIdentity(state.saveMeta.saveId,root.baselines)||migration.walletIdentity!==walletIdentity(state.saveMeta.saveId,root.wallets,root.ledger))fail('experienceProgression.migration');
    const receipts=state.saveMeta.appliedMigrations.filter(item=>item?.id===MIGRATION_ID);
    if(migration?.lineageKind==='schema-14-to-15-migration'){
      const receipt=receipts[0],keys=['id','from','to','receiptVersion','appliedAt','source','policyId','predecessorValidatorId','predecessorSaveId','predecessorRevision','predecessorUpdatedAt','predecessorSemanticIdentity','predecessorRawIdentity','predecessorCheckpointIdentity','baselineIdentity','walletIdentity','rewardApplications','pendingEntitlementsConverted','identity'];
      if(receipts.length!==1||!exactKeys(receipt,keys)||receipt.from!==14||receipt.to!==15||receipt.receiptVersion!==1||receipt.policyId!==POLICY_ID||receipt.appliedAt!==root.activatedAt||receipt.predecessorSaveId!==state.saveMeta.saveId||!safe(receipt.predecessorRevision)||!safe(receipt.predecessorUpdatedAt)||receipt.predecessorRevision>=state.saveMeta.revision||receipt.predecessorUpdatedAt>receipt.appliedAt||typeof receipt.predecessorValidatorId!=='string'||!receipt.predecessorValidatorId||receipt.predecessorSemanticIdentity!==migration.predecessorSemanticIdentity||receipt.predecessorRawIdentity!==migration.predecessorRawIdentity||receipt.predecessorCheckpointIdentity!==migration.predecessorCheckpointIdentity||receipt.baselineIdentity!==migration.baselineIdentity||receipt.walletIdentity!==migration.walletIdentity||receipt.rewardApplications!==0||receipt.pendingEntitlementsConverted!==false||receipt.identity!==migrationReceiptIdentity(receipt))fail('migration.receipt');
      const resolved=typeof options.resolvePredecessorCheckpoint==='function'?options.resolvePredecessorCheckpoint(migration.predecessorCheckpointIdentity):null,raw=typeof resolved==='string'?resolved:resolved?.raw,checkpoint=resolved?.checkpoint;let predecessor=null;try{predecessor=JSON.parse(raw)}catch{}if(checkpoint?.writeOnceVerified!==true||checkpoint.identity!==migration.predecessorCheckpointIdentity||checkpoint.rawIdentity!==migration.predecessorRawIdentity||checkpoint.semanticIdentity!==migration.predecessorSemanticIdentity||sha256(raw||'')!==migration.predecessorRawIdentity||predecessor?.schemaVersion!==14||predecessor.saveMeta?.saveId!==state.saveMeta.saveId||predecessor.saveMeta?.revision!==receipt?.predecessorRevision||canonicalStringify(root.baselines)!==canonicalStringify(predecessor?baselineMaps(predecessor):null)||typeof options.validatePredecessor!=='function'||options.validatePredecessor(freeze(clone(predecessor)))!==true)fail('migration.checkpoint');
      if(migration.directOriginAttestation!==null)fail('migration.direct-origin');
    }else{
      if(receipts.length!==0||migration.predecessorSemanticIdentity!==null||migration.predecessorRawIdentity!==null||migration.predecessorCheckpointIdentity!==null)fail('migration.direct');
      const attestation=migration.directOriginAttestation,origin=typeof options.resolveDirectOrigin==='function'?options.resolveDirectOrigin(attestation?.identity):null,resolved=origin?.state||origin;if(!attestation||attestation.identity!==directOriginIdentity(attestation)||attestation.lineageKind!==migration.lineageKind||attestation.saveId!==state.saveMeta.saveId||!safe(attestation.revision)||attestation.revision!==resolved?.saveMeta?.revision||attestation.revision>state.saveMeta.revision||attestation.createdAt!==state.saveMeta.createdAt||!resolved||sha256(canonicalStringify(resolved))!==attestation.semanticIdentity||canonicalStringify(root.baselines)!==canonicalStringify(resolved?baselineMaps(resolved):null)||typeof options.validateDirectOrigin!=='function'||options.validateDirectOrigin(freeze(clone(resolved)),migration.lineageKind)!==true)fail('migration.direct');
    }
    return{ok:errors.length===0,errors};
  }
  function validateSuccessorState(state,options={}){try{return validateSuccessorStateUnsafe(state,options)}catch{return{ok:false,errors:['validation.exception']}}}

  const api=freeze({version:1,status:'schema-15-foundation',rootKey:ROOT_KEY,successorSchema:SUCCESSOR_SCHEMA,predecessorSchema:PREDECESSOR_SCHEMA,policyId:POLICY_ID,migrationId:MIGRATION_ID,checkpointKind:CHECKPOINT_KIND,directOriginKind:DIRECT_ORIGIN_KIND,canonicalStringify,sha256,capturePredecessorCheckpoint,attestPredecessorCheckpoint,captureDirectOriginAttestation,migrateSchema14To15,createDirectSchema15,currentSchema14Projection,validateSuccessorState});
  Object.defineProperty(global,'EVERSTEAD_PHASE24L_EXP_FOUNDATION',{configurable:false,enumerable:false,writable:false,value:api});
})(globalThis);
