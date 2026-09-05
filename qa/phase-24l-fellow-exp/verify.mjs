import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {
  root,read,same,loadApis,makeV1,engineOptions,withPostB0Play,activate,
  adoptCredit,adoptSpend,credit,preview,spend,clone,levelForExp,thresholdForLevel
} from './fixtures.mjs';

const here=path.dirname(fileURLToPath(import.meta.url));
const contract=JSON.parse(fs.readFileSync(path.join(here,'contract.json'),'utf8'));
const rows=[];
const record=(id,pass,detail='')=>rows.push({id,pass:Boolean(pass),detail:typeof detail==='string'?detail:JSON.stringify(detail)});
const equal=(id,actual,expected)=>record(id,same(actual,expected),{actual,expected});
const throws=(id,operation,pattern=/.*/)=>{try{operation();record(id,false,'did not throw')}catch(error){record(id,pattern.test(String(error?.message||error)),error?.message||String(error))}};
const textIfPresent=relative=>fs.existsSync(path.join(root,relative))?read(relative):'';
const index=read('index.html'),source=read(contract.candidate.source),css=read(contract.candidate.css),ui=textIfPresent(contract.candidate.uiSource);
const git=args=>spawnSync('git',args,{cwd:root,encoding:'utf8',maxBuffer:64*1024*1024});
const stripMeta=state=>{const copy=clone(state);delete copy.experienceProgression;delete copy.saveMeta;return copy};
const descriptorShape=(realm,name)=>{const descriptor=Object.getOwnPropertyDescriptor(realm,name);return descriptor&&{enumerable:descriptor.enumerable,writable:descriptor.writable,configurable:descriptor.configurable,hasValue:Object.hasOwn(descriptor,'value')}};
const functionDeclaration=(text,name)=>{
  const start=text.indexOf(`function ${name}(`);if(start<0)return'';
  const open=text.indexOf('{',start);if(open<0)return'';
  let depth=0,quote=null,escaped=false;
  for(let index=open;index<text.length;index++){
    const character=text[index];
    if(quote){if(escaped){escaped=false;continue}if(character==='\\'){escaped=true;continue}if(character===quote)quote=null;continue}
    if(character==='"'||character==="'"||character==='`'){quote=character;continue}
    if(character==='{')depth++;
    else if(character==='}'&&--depth===0)return text.slice(start,index+1);
  }
  return'';
};

record('contract-identifies-phase-24l-b1',contract.phase==='24L-B1'&&contract.schemaVersion===15&&contract.predecessor.rootVersion===1&&contract.candidate.rootVersion===2);
record('locked-contract-is-present',fs.existsSync(path.join(root,'docs/PHASE_24L_B1_FELLOW_EXP_CONTRACT.md')));
record('predecessor-is-an-ancestor',git(['merge-base','--is-ancestor',contract.predecessor.commit,'HEAD']).status===0);

const beforeRealm=vm.createContext({TextEncoder});
vm.runInContext(read(contract.predecessor.foundationSource),beforeRealm);
const beforeNames=new Set(Object.getOwnPropertyNames(beforeRealm));
vm.runInContext(source,beforeRealm);
const added=Object.getOwnPropertyNames(beforeRealm).filter(name=>!beforeNames.has(name));
const api=beforeRealm[contract.candidate.global],descriptor=descriptorShape(beforeRealm,contract.candidate.global);
equal('pure-runtime-installs-exactly-one-global',added,[contract.candidate.global]);
record('pure-runtime-global-is-hidden-immutable-data',descriptor?.enumerable===false&&descriptor?.writable===false&&descriptor?.configurable===false&&descriptor?.hasValue===true,descriptor);
record('pure-runtime-api-is-deeply-frozen',Boolean(api)&&Object.isFrozen(api));
equal('pure-runtime-version',api?.version,contract.candidate.version);
equal('pure-runtime-status',api?.status,contract.candidate.status);
equal('pure-runtime-root-version',api?.rootVersion,contract.candidate.rootVersion);
equal('pure-runtime-policy-id',api?.policyId,contract.candidate.policyId);
equal('pure-runtime-activation-id',api?.activationId,contract.candidate.activationId);
equal('pure-runtime-ledger-version',api?.ledgerVersion,contract.candidate.ledgerVersion);
equal('pure-runtime-live-tail-bound-is-exactly-256',api?.maxTailEntries,contract.candidate.maxTailEntries);
record('pure-runtime-exposes-required-api',contract.candidate.requiredFunctions.every(name=>typeof api?.[name]==='function'),Object.keys(api||{}));
record('pure-runtime-has-no-storage-dom-network-timer-or-message-authority',!/(?:\blocalStorage\b|\bsessionStorage\b|\bindexedDB\b|\.setItem\s*\(|\.removeItem\s*\(|\bdocument\b|\bwindow\b|\bfetch\s*\(|\bXMLHttpRequest\b|\bWebSocket\b|\bpostMessage\s*\(|\bsetTimeout\s*\(|\bsetInterval\s*\()/m.test(source));
record('pure-runtime-uses-integer-bigint-credit-settlement',source.includes('BigInt(rawAmount)')&&source.includes("rounding:'floor'")&&source.includes('Number.MAX_SAFE_INTEGER'));
record('pure-runtime-chains-ledger-entry-identities',source.includes('previousEntryIdentity')&&source.includes('entryIdentity(entry)')&&source.includes('broken-ledger-chain'));
record('pure-runtime-folds-only-after-declared-tail-bound',source.includes('entries.length>MAX_TAIL_ENTRIES')&&source.includes('FOLD_BATCH_SIZE'));
record('pure-runtime-keeps-companion-wallet-neutral',source.includes("validateWallet(root.wallets.companion,{neutral:true})")&&source.includes("fail('companion-wallet-changed')"));

const {foundation,wallet}=loadApis(contract),bundle=makeV1(foundation,'established'),v1=clone(bundle.state),options=engineOptions(bundle);
record('foundation-dependency-is-ready',wallet.dependencyReady()===true);
record('schema15-root-v1-remains-valid-transitional-state',wallet.validateV1State(v1,options).ok===true,wallet.validateV1State(v1,options));

const postB0=withPostB0Play(bundle,{fellowId:'cael',amount:777}),postB0Before=clone(postB0),activated=activate(wallet,bundle,postB0);
record('activation-accepts-authentic-post-b0-play',activated.ok===true,activated);
record('activation-captures-exact-live-post-b0-invested-exp',activated.root?.activation?.investedFellowExpById?.cael===postB0.fellows.cael.exp,{captured:activated.root?.activation?.investedFellowExpById?.cael,actual:postB0.fellows.cael.exp});
record('activation-preserves-every-fellow-and-companion-byte',same(activated.state?.fellows,postB0.fellows)&&same(activated.state?.companions,postB0.companions));
record('activation-does-not-mutate-caller-state',same(postB0,postB0Before));
record('activation-advances-one-revision-with-one-receipt',activated.state?.saveMeta?.revision===postB0.saveMeta.revision+1&&activated.state.saveMeta.appliedMigrations.filter(item=>item?.id===wallet.activationId).length===1);
record('activation-starts-zero-wallet-and-empty-ledger',activated.root?.wallets?.fellow?.balance===0&&activated.root.wallets.fellow.creditedTotal===0&&activated.root.wallets.fellow.spentTotal===0&&activated.root.ledger.entryCount===0&&activated.root.ledger.entries.length===0);
record('activation-keeps-companion-wallet-exactly-neutral',same(activated.root?.wallets?.companion,{balance:0,creditedTotal:0,spentTotal:0}));
record('activated-v2-state-validates',wallet.validateV2State(activated.state,options).ok===true,wallet.validateV2State(activated.state,options));
const activatedBeforeRepeat=clone(activated.state),repeatActivation=wallet.activateV1State(activated.state,{now:activated.state.saveMeta.updatedAt+1,source:'phase24l-b1-activation',expectedRevision:activated.state.saveMeta.revision},options);
record('repeat-activation-refuses-without-mutating-v2',repeatActivation.ok===false&&same(activated.state,activatedBeforeRepeat));

equal('credit-floor-math-combines-authored-and-collection-as-additive-peers',wallet.creditAward(999,333,667),{totalBps:1000,awardedAmount:1098});
equal('credit-floor-math-supports-plus-1000-percent-collection',wallet.creditAward(999,0,contract.wallet.highCollectionBps),{totalBps:100000,awardedAmount:10989});
throws('credit-overflow-refuses',()=>wallet.creditAward(Number.MAX_SAFE_INTEGER,10000,0),/unsafe-credit-award/);

let state=clone(activated.state),beforeCredit=clone(state);
const stagedCredit=credit(wallet,bundle,state,{sourceId:'claim:first',historicalTargetId:'cael',rawAmount:999,authoredBps:333,collectionBps:667});
record('manual-claim-credit-stages-once',stagedCredit.ok===true,stagedCredit);
record('credit-records-raw-bps-rounding-settled-target-and-source',stagedCredit.entry?.rawAmount===999&&stagedCredit.entry.authoredBps===333&&stagedCredit.entry.collectionBps===667&&stagedCredit.entry.totalBps===1000&&stagedCredit.entry.rounding==='floor'&&stagedCredit.entry.awardedAmount===1098&&stagedCredit.entry.historicalTargetId==='cael'&&stagedCredit.entry.source.kind==='manual-reward-claim',stagedCredit.entry);
record('credit-does-not-auto-invest-into-historical-target',same(state.fellows,beforeCredit.fellows));
const creditTransition=clone(state);creditTransition.experienceProgression=clone(stagedCredit.root);
record('credit-root-transition-is-exactly-replayable',wallet.validateRootTransition(state,creditTransition,options)===true);
state=adoptCredit(state,stagedCredit);
record('credit-updates-only-root-plus-save-metadata',same(stripMeta(state),stripMeta(beforeCredit)));
record('credited-state-validates',wallet.validateV2State(state,options).ok===true,wallet.validateV2State(state,options));
record('first-successful-credit-authenticates-its-tutorial-trigger',state.experienceProgression.tutorials.firstCredit.completed===true&&state.experienceProgression.tutorials.firstCredit.entryIdentity===stagedCredit.entry.identity&&state.experienceProgression.tutorials.firstSpend.completed===false,state.experienceProgression.tutorials);
const duplicateCredit=credit(wallet,bundle,state,{sourceId:'claim:first',historicalTargetId:'cael',rawAmount:999,authoredBps:333,collectionBps:667});
record('duplicate-source-credit-refuses',duplicateCredit.ok===false&&duplicateCredit.reason==='duplicate-credit-source',duplicateCredit);
record('duplicate-source-refusal-is-caller-state-neutral',state.experienceProgression.wallets.fellow.balance===1098&&state.experienceProgression.ledger.entryCount===1);

const projectedCredit=wallet.projectToV1(state,options);
record('historical-projection-succeeds-after-credit',projectedCredit.ok===true,projectedCredit);
record('historical-projection-injects-raw-not-settled-exp',projectedCredit.state?.fellows?.cael?.exp===activated.state.fellows.cael.exp+999,{projected:projectedCredit.state?.fellows?.cael?.exp,raw:999,settled:1098});
record('historical-projection-removes-b1-activation-receipt',projectedCredit.state?.saveMeta?.appliedMigrations?.every(item=>item?.id!==wallet.activationId));
record('historical-projection-restores-valid-root-v1',projectedCredit.state?.experienceProgression?.version===1&&wallet.validateV1State(projectedCredit.state,options).ok===true,wallet.validateV1State(projectedCredit.state,options));

const partialExp=state.fellows.cael.exp,currentLevel=levelForExp(partialExp),expectedX1=thresholdForLevel(currentLevel+1)-partialExp,x1=preview(wallet,bundle,state,'cael','x1');
record('x1-preview-prices-only-the-partial-next-level-gap',x1.ok===true&&x1.preview.cost===expectedX1&&x1.preview.levels===1,{preview:x1.preview,expectedX1});
record('preview-is-pure-and-write-neutral',same(state.fellows.cael,beforeCredit.fellows.cael)&&state.saveMeta.revision===beforeCredit.saveMeta.revision+1);
const beforeSpend=clone(state),stagedSpend=spend(wallet,bundle,state,x1.preview);
record('x1-spend-stages-selected-fellow-and-wallet-only',stagedSpend.ok===true&&stagedSpend.fellow.id==='cael'&&stagedSpend.spentAmount===expectedX1,stagedSpend);
const spendTransition=clone(state);spendTransition.experienceProgression=clone(stagedSpend.root);spendTransition.fellows.cael.exp=stagedSpend.fellow.exp;spendTransition.fellows.cael.level=stagedSpend.fellow.level;
record('spend-root-and-actor-transition-is-exactly-replayable',wallet.validateRootTransition(state,spendTransition,options)===true);
state=adoptSpend(state,stagedSpend);
record('x1-spend-invests-exact-cost-and-derives-level',state.fellows.cael.exp===beforeSpend.fellows.cael.exp+expectedX1&&state.fellows.cael.level===beforeSpend.fellows.cael.level+1);
record('x1-spend-preserves-unspent-wallet-remainder',state.experienceProgression.wallets.fellow.balance===1098-expectedX1);
record('x1-spend-does-not-change-rank-shards-relics-bonds-or-other-fellows',state.fellows.cael.rarity===beforeSpend.fellows.cael.rarity&&state.fellows.cael.shards===beforeSpend.fellows.cael.shards&&same(state.fellows.cael.relicSlots,beforeSpend.fellows.cael.relicSlots)&&state.fellows.cael.bond===beforeSpend.fellows.cael.bond&&Object.keys(state.fellows).filter(id=>id!=='cael').every(id=>same(state.fellows[id],beforeSpend.fellows[id])));
record('x1-spend-preserves-companion-wallet-and-actors',same(state.experienceProgression.wallets.companion,beforeSpend.experienceProgression.wallets.companion)&&same(state.companions,beforeSpend.companions));
record('spent-state-validates',wallet.validateV2State(state,options).ok===true,wallet.validateV2State(state,options));
record('first-successful-spend-authenticates-its-tutorial-trigger',state.experienceProgression.tutorials.firstSpend.completed===true&&state.experienceProgression.tutorials.firstSpend.entryIdentity===stagedSpend.entry.identity,state.experienceProgression.tutorials.firstSpend);
const replayOldSpend=spend(wallet,bundle,state,x1.preview);
record('duplicate-or-stale-spend-preview-refuses',replayOldSpend.ok===false&&replayOldSpend.reason==='stale-spend-preview',replayOldSpend);
const projectedAfterSpend=wallet.projectToV1(state,options);
record('historical-projection-removes-player-selected-spend',projectedAfterSpend.ok===true&&projectedAfterSpend.state.fellows.cael.exp===activated.state.fellows.cael.exp+999,{projected:projectedAfterSpend.state?.fellows?.cael?.exp,activation:activated.state.fellows.cael.exp});

let bulk=clone(activated.state);
const bulkCredit=credit(wallet,bundle,bulk,{sourceId:'bulk-levels',historicalTargetId:'cael',rawAmount:20_000_000});
bulk=adoptCredit(bulk,bulkCredit);
const x10=preview(wallet,bundle,bulk,'cael','x10'),max=preview(wallet,bundle,bulk,'lyra','max');
record('x10-preview-buys-exactly-ten-when-affordable',x10.ok===true&&x10.preview.levels===10&&x10.preview.after.level===x10.preview.before.level+10,x10);
record('max-preview-reaches-current-production-cap-when-affordable',max.ok===true&&max.preview.after.level===500&&max.preview.levels===500-max.preview.before.level,max);
const maxSpend=spend(wallet,bundle,bulk,max.preview),bulkAfter=adoptSpend(bulk,maxSpend),atCap=preview(wallet,bundle,bulkAfter,'lyra','x1');
record('at-cap-preview-refuses-without-a-write',atCap.ok===false&&atCap.reason==='fellow-at-level-cap',atCap);

const empty=clone(activated.state),noFunds=preview(wallet,bundle,empty,'cael','x1');
record('below-x1-wallet-refuses',noFunds.ok===false&&noFunds.reason==='insufficient-fellow-exp',noFunds);
const unavailable=clone(bulk);unavailable.fellows.cael.owned=false;
record('unavailable-fellow-refuses',preview(wallet,bundle,unavailable,'cael','x1').reason==='fellow-unavailable');
const stale=preview(wallet,bundle,bulk,'cael','x1'),intervening=adoptCredit(bulk,credit(wallet,bundle,bulk,{sourceId:'intervening',rawAmount:1}));
record('intervening-credit-invalidates-spend-preview',spend(wallet,bundle,intervening,stale.preview).reason==='stale-spend-preview');

let folded=clone(activated.state);
for(let index=1;index<=257;index++){
  const staged=credit(wallet,bundle,folded,{sourceId:`fold-${index}`,rawAmount:1,historicalTargetId:index%2?'cael':'lyra'});
  if(!staged.ok){record('ledger-257-credit-setup',false,{index,staged});break}
  folded=adoptCredit(folded,staged);
}
record('ledger-folds-only-after-crossing-256-live-entries',folded.experienceProgression.ledger.entryCount===257&&folded.experienceProgression.ledger.throughSequence>0&&folded.experienceProgression.ledger.entries.length<=256,folded.experienceProgression.ledger);
record('folded-ledger-wallet-algebra-remains-exact',folded.experienceProgression.wallets.fellow.balance===257&&folded.experienceProgression.wallets.fellow.creditedTotal===257&&folded.experienceProgression.wallets.fellow.spentTotal===0);
record('folded-ledger-validates-and-projects',wallet.validateV2State(folded,options).ok===true&&wallet.projectToV1(folded,options).ok===true,wallet.validateV2State(folded,options));

const tampered=clone(state);tampered.experienceProgression.wallets.fellow.balance++;
record('wallet-tamper-fails-closed',wallet.validateV2State(tampered,options).ok===false,wallet.validateV2State(tampered,options));
const forged=clone(state);forged.experienceProgression.ledger.entries.at(-1).identity='0'.repeat(64);
record('ledger-identity-tamper-fails-closed',wallet.validateV2State(forged,options).ok===false,wallet.validateV2State(forged,options));

let sourceAuthorityError=null,campaignCurrentAccepted=false,campaignForgedAccepted=true,claimCurrentAccepted=false,claimForgedAccepted=true,sourceAuthorityWrites=0,sourceAuthorityInputsUnchanged=false;
try{
  const authorityRealm=vm.createContext({
    FELLOW_DEFS:[{id:'cael'}],
    isObject:value=>Boolean(value)&&typeof value==='object'&&!Array.isArray(value),
    phase24lB1CampaignReceiptValid:()=>true,
    phaseFifteenState:value=>value?.claims||null,
    phaseFifteenV2ReceiptValid:()=>true,
    phaseTwelveTargets:()=>({cael:'fellow'}),
    PHASE_TWELVE:{validateOffer:()=>true,canonicalRewards:rewards=>clone(rewards)},
    phase24lB1CollectionExpBps:value=>value?.collectionExpBps??0,
    storageSet:()=>{sourceAuthorityWrites++},
    storageRemove:()=>{sourceAuthorityWrites++}
  });
  for(const name of ['phase24lB1CampaignCreditAuthority','phase24lB1Phase15ClaimCreditAuthority','phase24lB1CreditSourceAvailable']){
    const declaration=functionDeclaration(index,name);if(!declaration)throw new Error(`${name} declaration unavailable`);vm.runInContext(declaration,authorityRealm);
  }
  const expectedCollectionBps=250,campaignReceipt={rewardIdentity:'campaign:authentic',completedAt:100,sequence:1,rewards:{fellowExp:{cael:120}}},campaignPrevious={collectionExpBps:expectedCollectionBps,saveMeta:{saveId:'save-authority',updatedAt:100},fellowCampaign:{runOrdinal:0,lastReceipt:null}},campaignNext={collectionExpBps:expectedCollectionBps,saveMeta:{saveId:'save-authority',updatedAt:100},fellowCampaign:{runOrdinal:1,lastReceipt:campaignReceipt}};
  const campaignEntry=collectionBps=>({source:{kind:'fellow-campaign',id:campaignReceipt.rewardIdentity},historicalTargetId:'cael',rawAmount:120,occurredAt:100,authoredBps:0,collectionBps});
  const campaignCurrentEntry=campaignEntry(expectedCollectionBps),campaignCurrentAuthority=authorityRealm.phase24lB1CampaignCreditAuthority(campaignPrevious,campaignNext,[campaignCurrentEntry]);
  campaignCurrentAccepted=Boolean(campaignCurrentAuthority)&&authorityRealm.phase24lB1CreditSourceAvailable(campaignCurrentAuthority,campaignCurrentEntry,campaignPrevious,campaignCurrentEntry.source)===true;
  const campaignForgedEntry=campaignEntry(expectedCollectionBps+1),campaignForgedAuthority=authorityRealm.phase24lB1CampaignCreditAuthority(campaignPrevious,campaignNext,[campaignForgedEntry]);
  campaignForgedAccepted=Boolean(campaignForgedAuthority)&&authorityRealm.phase24lB1CreditSourceAvailable(campaignForgedAuthority,campaignForgedEntry,campaignPrevious,campaignForgedEntry.source)===true;

  const claimRewards=[{kind:'fellowExp',targetId:'cael',amount:777}],offer={identity:'offer:authentic',offeredAt:100,rewards:claimRewards},claimReceipt={identity:'claim:receipt',offerId:'offer-1',pendingIdentity:offer.identity,claimedAt:101,sequence:1,rewards:claimRewards},claimPrevious={collectionExpBps:expectedCollectionBps,saveMeta:{saveId:'save-authority',updatedAt:100},claims:{pendingOffers:{'offer-1':offer},claimArchive:{nextSequence:0,recentReceipts:[]}}},claimNext={collectionExpBps:expectedCollectionBps,saveMeta:{saveId:'save-authority',updatedAt:101},claims:{pendingOffers:{},claimArchive:{nextSequence:1,recentReceipts:[claimReceipt]}}};
  const claimEntry=collectionBps=>({source:{kind:'manual-reward-claim',id:`${offer.identity}:cael`},historicalTargetId:'cael',rawAmount:777,occurredAt:101,authoredBps:0,collectionBps});
  const claimCurrentEntry=claimEntry(expectedCollectionBps),claimCurrentAuthority=authorityRealm.phase24lB1Phase15ClaimCreditAuthority(claimPrevious,claimNext,[claimCurrentEntry]);
  claimCurrentAccepted=Boolean(claimCurrentAuthority)&&authorityRealm.phase24lB1CreditSourceAvailable(claimCurrentAuthority,claimCurrentEntry,claimPrevious,claimCurrentEntry.source)===true;
  const beforeAuthorityInputs=JSON.stringify([campaignPrevious,campaignNext,claimPrevious,claimNext]),claimForgedEntry=claimEntry(expectedCollectionBps+1),claimForgedAuthority=authorityRealm.phase24lB1Phase15ClaimCreditAuthority(claimPrevious,claimNext,[claimForgedEntry]);
  claimForgedAccepted=Boolean(claimForgedAuthority)&&authorityRealm.phase24lB1CreditSourceAvailable(claimForgedAuthority,claimForgedEntry,claimPrevious,claimForgedEntry.source)===true;
  sourceAuthorityInputsUnchanged=JSON.stringify([campaignPrevious,campaignNext,claimPrevious,claimNext])===beforeAuthorityInputs;
}catch(error){sourceAuthorityError=error.stack||error.message}
record('campaign-current-collection-bps-source-authority-passes',campaignCurrentAccepted===true,{campaignCurrentAccepted,sourceAuthorityError});
record('campaign-forged-collection-bps-source-authority-refuses-zero-write',campaignForgedAccepted===false&&sourceAuthorityWrites===0&&sourceAuthorityInputsUnchanged,{campaignForgedAccepted,sourceAuthorityWrites,sourceAuthorityInputsUnchanged,sourceAuthorityError});
record('manual-claim-current-collection-bps-source-authority-passes',claimCurrentAccepted===true,{claimCurrentAccepted,sourceAuthorityError});
record('manual-claim-forged-collection-bps-source-authority-refuses-zero-write',claimForgedAccepted===false&&sourceAuthorityWrites===0&&sourceAuthorityInputsUnchanged,{claimForgedAccepted,sourceAuthorityWrites,sourceAuthorityInputsUnchanged,sourceAuthorityError});

record('production-loads-wallet-engine-once-after-b0-foundation',(index.match(/src\/phase24l-fellow-exp-wallet\.js/g)||[]).length===1&&index.indexOf('src/phase24l-fellow-exp-wallet.js')>index.indexOf('src/phase24l-exp-foundation.js'));
record('production-loads-b1-css-once',(index.match(/src\/phase24l-fellow-exp-wallet\.css/g)||[]).length===1);
record('production-loads-b1-ui-after-profile-shell',(index.match(/src\/phase24l-fellow-exp-ui\.js/g)||[]).length===1&&index.indexOf('src/phase24l-fellow-exp-ui.js')>index.indexOf('src/phase24l-profile-shell.js'));
record('production-installs-query-scoped-b1-qa-bridge',index.includes(contract.integration.productionBridge)&&index.includes(contract.integration.queryKey));
record('production-bridge-requires-isolated-destructive-authority',index.includes('allowDestructive')&&index.includes('isolatedStorage')&&index.includes('NATIVE_STORAGE'));
record('production-registers-exp-activation-credit-spend-transaction-sources',index.includes('phase24l-b1-activation')&&index.includes('phase24l-b1-fellow-exp-spend')&&index.includes('phase24l-b1-fellow-exp-credit'));
record('production-render-validation-projects-v2-through-authenticated-v1',index.includes("actual.experienceProgression?.version===2?phase24lB1ProjectV1(actual):{ok:true,state:actual}"));
record('production-campaign-route-preserves-raw-target-receipt-and-credits-shared-wallet',index.includes('fellow-campaign')&&index.includes('historicalTargetId')&&index.includes('rawAmount')&&index.includes('Fellow EXP'));
record('production-manual-claim-route-can-credit-shared-fellow-wallet',index.includes('manual-reward-claim')&&index.includes("reward.kind==='fellowExp'"));
record('legacy-catch-up-and-qa-invested-exp-routes-remain-explicit',index.includes('Phase 11G')&&index.includes('qaCredits.fellowExp'));
record('fellow-expedition-remains-a-non-exp-producer',index.includes('Fellow Expedition')&&!/Fellow Expedition[^\n]{0,240}Fellow EXP/.test(index));
record('rank-ascension-still-spends-shards-not-exp',/function ascendFellow\([^)]*\)[\s\S]{0,1400}\.shards-=required;[\s\S]{0,100}\.rarity\+\+/.test(index));

record('b1-ui-runtime-exists',ui.length>0);
record('b1-ui-declares-level-wallet-invested-preview-and-three-modes',ui.includes('data-phase24l-exp-wallet')&&ui.includes('data-phase24l-exp-invested')&&ui.includes('data-phase24l-exp-commit')&&contract.wallet.modes.every(mode=>ui.includes(`data-phase24l-exp-mode="${mode}"`)));
record('b1-ui-exposes-fellow-exp-not-target-auto-grant-copy',ui.includes('Fellow EXP')&&ui.includes('Invested EXP'));
record('b1-ui-wraps-existing-fellow-profile-level-sheet',ui.includes('data-phase24l-profile="fellow"')&&ui.includes('data-phase24l-panel="level"'));
record('b1-ui-previews-before-commit',ui.includes('preview')&&ui.includes('commit'));
record('b1-integration-defines-two-versioned-tutorial-surfaces',(index+ui).includes('tutorial.phase-24l-b1.fellow-exp-earned.v1')&&(index+ui).includes('tutorial.phase-24l-b1.fellow-exp-spent.v1')&&(index+ui).includes('replay'));
record('b1-css-keeps-three-mode-and-commit-controls-at-least-44px',/\.phase24l-exp-modes button\{[^}]*min-height:44px/.test(css)&&/\.phase24l-exp-commit\{[^}]*min-height:44px/.test(css));
record('b1-css-does-not-introduce-document-level-scroll',!/(?:html|body)[^{]*\{[^}]*overflow\s*:\s*(?:auto|scroll)/.test(css));

for(const relative of [contract.candidate.source,contract.candidate.uiSource]){
  const syntax=spawnSync(process.execPath,['--check',path.join(root,relative)],{cwd:root,encoding:'utf8'});
  record(`${path.basename(relative)}-parses`,syntax.status===0,syntax.stderr||syntax.stdout);
}

const failed=rows.filter(row=>!row.pass);
for(const row of rows)console.log(`${row.pass?'PASS':'FAIL'} ${row.id}${!row.pass&&row.detail?` · ${row.detail}`:''}`);
console.log(`RESULT ${rows.length-failed.length} passed, ${failed.length} failed`);
if(failed.length)process.exitCode=1;
