import {readFileSync,existsSync,readdirSync,statSync} from 'node:fs';
import {resolve,relative} from 'node:path';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';

const ROOT=resolve(fileURLToPath(new URL('../../',import.meta.url))),PACKAGE_ONLY=process.argv.includes('--package-only'),rows=[];
const rel=path=>resolve(ROOT,path),text=path=>readFileSync(rel(path),'utf8'),json=path=>JSON.parse(text(path)),record=(id,pass,detail='')=>rows.push({id,pass:Boolean(pass),detail}),same=(a,b)=>JSON.stringify(a)===JSON.stringify(b),sha=path=>createHash('sha256').update(readFileSync(rel(path))).digest('hex');
const f=json('qa/phase-23-successor-compatibility/fixtures/contract.json'),realm=text('qa/phase-23-successor-compatibility/realm.js'),runner=text('qa/phase-23-successor-compatibility/runner.js'),index=text('qa/phase-23-successor-compatibility/index.html');

record('contract-phase23-schema13-v1',f.contractVersion===1&&f.phase===23&&f.schemaVersion===13&&f.bridgeVersion==='phase-23-independent-qa-v1');
record('contract-exact-rank1-joined-six',same(f.joinedFellowIdsAtRank1,f.allFellowIds.slice(0,6))&&f.allFellowIds.length===18);
record('contract-exact-fresh-economy-and-combat-separation',f.freshEconomy.fellowPower===35150&&f.freshCombatFellowPower===36366&&f.freshEconomy.fellowBps===390&&f.freshEconomy.companionPower===2200&&f.freshEconomy.companionBps===80&&Object.values(f.freshEconomy.buildings).reduce((sum,row)=>sum+row.rate,0)===f.freshEconomy.totalRate);
record('contract-exact-1.24-cost-ladder',f.buildingUpgrade.growth===1.24&&f.buildingUpgrade.levelCap===52&&f.buildingUpgrade.costsByStartingLevel.length===51&&f.buildingUpgrade.costsByStartingLevel.every((cost,index)=>cost===Math.round(f.buildingUpgrade.baseCost*Math.pow(1.24,index))));
record('contract-rank-and-expedition-boundaries',same(f.rankOneLockedRoutes,{companionCampaign:2,companionTower:3,fellowExpedition:5})&&f.expeditionBoundary.capMs===24*60*60*1000&&f.expeditionBoundary.totalIntervals===24&&f.expeditionBoundary.discardedMs===8*60*60*1000);
record('runner-real-isolated-candidate',realm.includes("fetch('../../index.html'")&&realm.includes('allowDestructive:true')&&realm.includes('isolatedStorage:true')&&realm.includes('__EVERSTEAD_PHASE_23_QA__')&&!realm.includes('fakeEngine'));
record('runner-economy-and-building-contracts',['fresh-exact-joined-fellow-economy-power-and-bonus','fresh-exact-20-companion-economy-power-and-bonus','fresh-exact-four-building-rates-and-total','building-production-sheet-projects-schema13-roster-multipliers','building-upgrade-exact-1.24-cost-ladder-through-level52','building-level52-cap-refuses-with-zero-write','building-ladder-reload-byte-stable-and-valid'].every(value=>realm.includes(value))&&realm.includes("main().act('building-upgrade'"));
record('runner-joined-rank-screen-contracts',['fellowship-screen-derived-rank1-joined-count-and-order','fellow-campaign-target-and-total-use-exact-joined-roster','village-speaker-selection-excludes-unjoined-fellows','rank1-locked-route-clicks-and-actions-refuse-with-screen-state-aligned','data-phase-11g-training-target','data-combat-fellow-roster-power'].every(value=>realm.includes(value))&&realm.includes("main().act('adventure'"));
record('runner-relic-real-action-exact-formula',['schema13-relic-equip-applies-exact-power-order-and-total','schema13-relic-effect-reloads-without-reversion','afterBondMilestone*f.relic.multiplier','expectedAfterCompanion','familyBondMultiplier','globalMultiplier'].every(value=>realm.includes(value))&&realm.includes("main().act('relic-equip'"));
record('runner-expedition-genuine-action-boundary',['exerciseFellowExpeditionBoundary','expedition-segmented-two-stage-shared-24h-cap-exact','expedition-exact-claim-reload-replay-no-repricing','progressionGenuine','stageB>stageA','receiptExact===true','frozenPricing','rewardDelta?.might===210','replay?.writes===0'].every(value=>realm.includes(value)));
record('runner-native-storage-console-guards',realm.includes('zero-native-storage-accesses')&&realm.includes('zero-warning-error-console')&&realm.includes('__P23C_NATIVE_ACCESSES__'));
record('browser-page-autostarts-and-publishes',runner.includes('run();')&&runner.includes('__EVERSTEAD_PHASE_23_SUCCESSOR_COMPATIBILITY_RESULT__')&&index.includes('Phase 23 · Successor-schema compatibility gate'));
for(const file of ['runner.js','realm.js','verify.mjs']){const checked=spawnSync(process.execPath,['--check',`qa/phase-23-successor-compatibility/${file}`],{cwd:ROOT,encoding:'utf8'});record(`syntax-${file}`,checked.status===0,checked.stderr.trim())}

const checksumPath='qa/phase-23-successor-compatibility/checksums.sha256';if(existsSync(rel(checksumPath))){const checksumRows=text(checksumPath).trim().split(/\r?\n/).filter(Boolean),bad=[];for(const line of checksumRows){const match=/^([0-9a-f]{64})  (.+)$/.exec(line);if(!match||!existsSync(rel(match?.[2]||''))||sha(match[2])!==match[1])bad.push(line)}record('package-checksums-exact',bad.length===0&&checksumRows.length===7,bad)}else record('package-checksums-exact',false,'checksums.sha256 missing');

if(!PACKAGE_ONLY){
  const source=text('index.html'),body=name=>{const start=source.indexOf(name);return start<0?'':source.slice(start,start+1200)};
  record('candidate-schema13-economy-profile-active',/function phaseTenCTwoProfileActive\([^)]*\)\{return \[[^\]]*13[^\]]*\]\.includes/.test(source));
  record('candidate-schema13-relic-power-active',/effectiveFellowPowerComponents=function\([^)]*\)\{if\(!\[[^\]]*13[^\]]*\]\.includes\(state\?\.schemaVersion\)\)return effectiveFellowPowerComponentsThroughNine/.test(source));
  record('candidate-schema13-joined-combat-and-economy-active',/totalFellowRosterPower=function\([^)]*\)\{if\(!\[[^\]]*12[^\]]*13[^\]]*\]\.includes/.test(source)&&/phaseTenCTwoFellowRosterPower=function\([^)]*\)\{if\(!\[[^\]]*12[^\]]*13[^\]]*\]\.includes/.test(source));
  record('candidate-schema13-village-speaker-and-rank-route-active',body('function villageSpeakerDefs').includes('[12,13]')&&body('playerRouteAccess=function(route,state=S)').includes('[12,13]'));
  record('candidate-schema13-campaign-preview-run-active',source.includes("campaignPreview=function(stageId,state=S){const prior=campaignPreviewBeforePhaseElevenG(stageId,state),receipt=phaseElevenGReceipt(state);if(!prior.valid||![12,13].includes(state?.schemaVersion)")&&source.includes("runFellowCampaignV2=function(stageId,{confirmed=false,present=true}={}){if(![12,13].includes(S?.schemaVersion)||!phaseElevenGReceipt(S))return runFellowCampaignV2BeforePhaseElevenG"));
  record('candidate-schema13-expedition-settlement-active',body('settleFellowExpeditionElapsed=function(at,state=S)').includes('[11,12,13]'));
  record('candidate-genuine-expedition-bridge-present',source.includes('exerciseFellowExpeditionBoundary')&&body('function phase23InstallQaBridge').includes('exerciseFellowExpeditionBoundary'));
  const historical=spawnSync('shasum',['-a','256','-c','qa/phase-23-independent/checksums.sha256'],{cwd:ROOT,encoding:'utf8'});record('prior-phase23-independent-package-remains-frozen',historical.status===0,historical.stdout+historical.stderr);
}

const passed=rows.filter(row=>row.pass).length,failed=rows.length-passed;for(const row of rows)console.log(`${row.pass?'PASS':'FAIL'} ${row.id}${row.detail?` — ${typeof row.detail==='string'?row.detail:JSON.stringify(row.detail)}`:''}`);console.log(`RESULT ${passed} passed, ${failed} failed${PACKAGE_ONLY?' (package only)':''}`);process.exitCode=failed?1:0;
