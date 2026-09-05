import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {
  companionExpThreshold,
  companionLevelForExp,
  exists,
  loadCandidate,
  makeReleasedV2,
  read,
  same,
  settledCredit,
  walletAlgebra
} from './fixtures.mjs';

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'../..');
const contract=JSON.parse(read('qa/phase-24l-c1/contract.json'));
const document=read(contract.contractDocument);
const index=read('index.html');
const rows=[];
const record=(id,pass,detail='')=>rows.push({id,pass:Boolean(pass),detail:typeof detail==='string'?detail:JSON.stringify(detail)});
const sha=value=>createHash('sha256').update(value).digest('hex');
const readOptional=relative=>exists(relative)?read(relative):'';
const source=readOptional(contract.candidate.source),ui=readOptional(contract.candidate.uiSource),css=readOptional(contract.candidate.css);

record('contract-identifies-c1-policy-v3-gate',contract.phase==='24L-C1'&&contract.schemaVersion===15&&contract.predecessor.rootVersion===2&&contract.candidate.rootVersion===3);
record('contract-defines-shared-companion-wallet-and-released-curve',contract.wallet.roster==='companion'&&contract.wallet.shared===true&&contract.wallet.levelCap===100&&contract.wallet.expBase===80&&contract.wallet.expGrowth===1.12);
record('contract-defines-all-four-production-credit-kinds',same(contract.ledger.creditRoutes,['companion-campaign','companion-tower-clear','companion-tower-idle','manual-reward-claim']),contract.ledger.creditRoutes);
record('contract-defines-isolated-qa-credit-kind',contract.ledger.qaCreditSource==='qa-companion-exp',contract.ledger.qaCreditSource);
record('contract-locks-exact-top-level-c1-root-fields',same(contract.candidate.rootFields,['companionActivation','companionLedger','companionTutorials']),contract.candidate.rootFields);
record('contract-requires-per-positive-target-tower-credits',contract.ledger.towerCreditsPerPositiveTarget===true&&contract.ledger.canonicalCompanionCount===20);
record('contract-covers-required-refusal-classes',new Set(contract.refusals).size===contract.refusals.length&&['duplicate-credit','duplicate-tower-idle-claim','stale-spend','unsafe-credit-overflow','corrupt-ledger','locked-future-gate'].every(id=>contract.refusals.includes(id)));
record('contract-covers-both-required-mobile-sizes',contract.viewports.map(item=>`${item.width}x${item.height}`).join(',')==='320x568,390x844');

record('implementation-contract-locks-non-retroactive-activation',document.includes('Activation starts the Companion wallet and Companion ledger at zero')&&document.includes('changes no actor')&&document.includes('does not reinterpret a pending Tower claim'));
record('implementation-contract-locks-floor-once-additive-credit',document.includes('floor(raw Companion EXP × (10,000 + authored EXP BPS + Collection EXP BPS) / 10,000)')&&document.includes('Spending never applies or recalculates an EXP multiplier'));
record('implementation-contract-locks-raw-historical-projection',document.includes('adds each C1 credit\'s **raw** amount')&&document.includes('Collection bonus EXP is C1-only'));
record('implementation-contract-locks-mixed-claim-atomicity',document.includes('Mixed manual offers containing Fellow and Companion EXP settle both ledgers inside the same source transaction or refuse atomically'));

record('released-companion-threshold-curve-is-exact',companionExpThreshold(1)===0&&companionExpThreshold(2)===80&&companionLevelForExp(79)===1&&companionLevelForExp(80)===2&&companionLevelForExp(companionExpThreshold(100))===100);
record('credit-math-floors-once-after-additive-bps',settledCredit(999,333,667)===1098);
record('credit-math-supports-plus-1000-percent-collection',settledCredit(999,0,contract.wallet.highCollectionBps)===10989);
let overflowRefused=false;try{settledCredit(Number.MAX_SAFE_INTEGER,10000,0)}catch{overflowRefused=true}
record('credit-math-refuses-safe-integer-overflow',overflowRefused);

try{
  const released=makeReleasedV2('established'),state=released.state,progression=state.experienceProgression;
  record('released-b1-fixture-is-policy-version-2',state.schemaVersion===15&&progression?.version===2&&progression?.policyId===contract.predecessor.policyId);
  record('released-b1-fixture-has-20-companions',Object.keys(state.companions||{}).length===contract.ledger.canonicalCompanionCount,Object.keys(state.companions||{}));
  record('released-b1-fixture-companion-wallet-is-neutral',same(progression.wallets.companion,{balance:0,creditedTotal:0,spentTotal:0})&&walletAlgebra(progression.wallets.companion),progression.wallets.companion);
  record('released-b1-fixture-captured-live-companion-investment',Object.keys(state.companions).every(id=>progression.activation.investedCompanionExpById[id]===state.companions[id].exp));
}catch(error){
  record('released-b1-fixture-builds',false,error.stack||error.message);
}

for(const [relative,expected] of Object.entries(contract.predecessor.frozenAuthoritySha256)){
  let actual='';try{actual=sha(read(relative))}catch{}
  record(`released-authority-byte-frozen-${path.basename(relative)}`,actual===expected,{expected,actual});
}

record('candidate-engine-file-exists',source.length>0,contract.candidate.source);
record('candidate-ui-file-exists',ui.length>0,contract.candidate.uiSource);
record('candidate-css-file-exists',css.length>0,contract.candidate.css);

for(const relative of [contract.candidate.source,contract.candidate.uiSource,'qa/phase-24l-c1/browser.mjs','qa/phase-24l-c1/production.mjs','qa/phase-24l-c1/fixtures.mjs']){
  const syntax=exists(relative)?spawnSync(process.execPath,['--check',path.resolve(root,relative)],{cwd:root,encoding:'utf8'}):null;
  record(`${path.basename(relative)}-parses`,Boolean(syntax)&&syntax.status===0,syntax?.stderr||`missing ${relative}`);
}

let candidate=null,candidateLoadError='';
try{candidate=loadCandidate(contract)}catch(error){candidateLoadError=error.stack||error.message}
const api=candidate?.api;
record('candidate-engine-publishes-exact-hidden-api-global',Boolean(api)&&contract.candidate.requiredFunctions.every(name=>typeof api[name]==='function'),candidateLoadError||contract.candidate.requiredFunctions.filter(name=>typeof api?.[name]!=='function'));
record('candidate-engine-identifies-v3-policy',api?.version===contract.candidate.version&&api?.rootVersion===contract.candidate.rootVersion&&api?.policyId===contract.candidate.policyId&&api?.ledgerVersion===contract.candidate.ledgerVersion,{version:api?.version,rootVersion:api?.rootVersion,policyId:api?.policyId,ledgerVersion:api?.ledgerVersion});
if(typeof api?.creditAward==='function'){
  let ordinary=null,high=null,error='';try{ordinary=api.creditAward(999,333,667);high=api.creditAward(999,0,contract.wallet.highCollectionBps)}catch(caught){error=caught.stack||caught.message}
  record('candidate-credit-engine-matches-floor-once-reference',ordinary?.totalBps===1000&&ordinary?.awardedAmount===1098,{ordinary,error});
  record('candidate-credit-engine-matches-plus-1000-percent-reference',high?.totalBps===100000&&high?.awardedAmount===10989,{high,error});
}

record('candidate-source-declares-all-production-credit-kinds',contract.ledger.creditRoutes.slice(0,4).every(kind=>source.includes(kind)));
record('candidate-source-declares-v2-to-v3-activation-and-projection',source.includes(contract.candidate.activationId)&&source.includes('activateV2State')&&source.includes('projectToV2')&&source.includes('B1.validateV2State'));
record('candidate-source-declares-separate-companion-ledger',source.includes('companionLedger')&&source.includes('historicalTargetId')&&source.includes('rawAmount')&&source.includes('collectionBps'));
record('candidate-source-locks-c1-fields-beside-preserved-fellow-fields',contract.candidate.rootFields.every(key=>source.includes(key))&&source.includes("'activation'")&&source.includes("'ledger'")&&source.includes("'tutorials'"));
record('candidate-source-supports-target-scoped-credit-staging',source.includes('stageCredit')&&source.includes('companion-tower-idle')&&source.includes('id.endsWith(`:${target}`)'));
record('candidate-source-binds-x1-x10-max-spend-previews',contract.wallet.modes.every(mode=>source.includes(`'${mode}'`)||source.includes(`\"${mode}\"`))&&source.includes('requestId')&&source.includes('expectedRevision'));
record('candidate-engine-has-no-storage-network-rng-or-timer-authority',source.length>0&&!/(localStorage|sessionStorage|indexedDB|fetch\(|XMLHttpRequest|WebSocket|Math\.random|setInterval|setTimeout)/.test(source));

record('candidate-ui-uses-actual-c1-selector-namespace',Object.entries(contract.integration.selectors).filter(([key])=>['investment','wallet','invested','modeGroup','mode','commit','status'].includes(key)).every(([,selector])=>ui.includes(selector.slice(1,-1).split('=')[0])));
record('candidate-ui-exposes-shared-wallet-and-invested-exp-copy',ui.includes('Shared Companion EXP')&&ui.includes('Invested EXP'));
record('candidate-ui-wraps-only-companion-level-sheet',/phase24l-profile[^\n]{0,120}companion/.test(ui)&&/phase24l-panel[^\n]{0,120}level/.test(ui));
record('candidate-ui-has-labelled-single-select-mode-group',ui.includes('role="group"')&&ui.includes('aria-label')&&ui.includes('aria-pressed'));
record('candidate-ui-has-polite-live-status-and-visible-refusal-copy',ui.includes('aria-live="polite"')&&ui.includes('data-phase24l-c1-exp-status')&&/(reason|refus|need|available|cap)/i.test(ui));
record('candidate-ui-declares-two-versioned-tutorials',contract.tutorials.ids.every(id=>(index+ui).includes(id))&&(index+ui).includes('replay'));
record('candidate-css-holds-critical-targets-at-44px',/phase24l-c1-exp-modes[^}]*min-height\s*:\s*44px/s.test(css)&&/phase24l-c1-exp-commit[^}]*min-height\s*:\s*44px/s.test(css)&&/phase24l-c1-tutorial[^}]*width\s*:\s*44px[^}]*height\s*:\s*44px/s.test(css));
record('candidate-css-has-compact-and-forced-colors-rules',/@media\s*\(max-width\s*:\s*340px\)/.test(css)&&/@media\s*\(forced-colors\s*:\s*active\)/.test(css));
record('candidate-css-introduces-no-unscoped-motion',!/(?:animation|transition)\s*:/.test(css)||/@media\s*\(prefers-reduced-motion\s*:\s*reduce\)/.test(css));
record('candidate-css-does-not-enable-document-scroll',css.length>0&&!/(?:html|body)[^{]*\{[^}]*overflow\s*:\s*(?:auto|scroll)/.test(css));

record('index-loads-c1-engine-ui-and-style-once',(index.match(/phase24l-companion-exp-wallet\.js/g)||[]).length===1&&(index.match(/phase24l-companion-exp-ui\.js/g)||[]).length===1&&(index.match(/phase24l-companion-exp-ui\.css/g)||[]).length===1);
record('index-loads-c1-after-released-b1-authority',index.indexOf('phase24l-companion-exp-wallet.js')>index.indexOf('phase24l-fellow-exp-wallet.js')&&index.indexOf('phase24l-companion-exp-ui.js')>index.indexOf('phase24l-profile-shell.js'));
record('index-installs-query-scoped-c1-bridge',index.includes(contract.integration.productionBridge)&&index.includes(contract.integration.queryKey));
record('index-bridge-requires-isolated-non-native-destructive-authority',index.includes('allowDestructive')&&index.includes('isolatedStorage')&&index.includes('NATIVE_STORAGE'));
record('index-registers-c1-activation-credit-spend-sources',[contract.candidate.activationSource,contract.candidate.creditSource,contract.candidate.spendSource].every(value=>index.includes(value)));
record('index-routes-all-four-production-credit-lanes-through-c1',contract.ledger.creditRoutes.every(kind=>index.includes(kind))&&index.includes('phase23-campaign-run')&&index.includes('phase23-tower-claim')&&index.includes("reward.kind==='companionExp'"));
record('index-companion-spend-updates-only-through-c1-source',index.includes(contract.candidate.spendSource)&&index.includes('companionLevelForExp'));
record('index-campaign-and-tower-copy-says-shared-companion-exp',index.includes('Shared Companion EXP'));

const failed=rows.filter(row=>!row.pass);
for(const row of rows)console.log(`${row.pass?'PASS':'FAIL'} ${row.id}${!row.pass&&row.detail?` · ${row.detail}`:''}`);
console.log(`RESULT ${rows.length-failed.length} passed, ${failed.length} failed`);
if(failed.length)process.exitCode=1;
