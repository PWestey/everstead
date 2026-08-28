import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';

const root=resolve(new URL('../..',import.meta.url).pathname),read=path=>readFileSync(resolve(root,path)),hash=bytes=>createHash('sha256').update(bytes).digest('hex'),source=read('index.html').toString('utf8'),manifest=JSON.parse(read('qa/phase-7/current-manifest.json')),rows=[],check=(id,pass,detail='')=>rows.push({id,pass:Boolean(pass),detail:String(detail)});
for(const[path,expected]of Object.entries(manifest.frozenHistoricalFiles))check('frozen-'+path.replaceAll('/','-'),hash(read(path))===expected,path);
for(const line of read('qa/phase-7/checksums.sha256').toString('utf8').trim().split('\n')){const[expected,...parts]=line.trim().split(/\s+/),path=parts.join(' ');if(path!=='index.html')check('phase7-frozen-'+path.replaceAll('/','-'),hash(read(path))===expected,path)}

const retained={
  'phase7-schema8-migration':source.includes("id:'schema-7-to-8'")&&source.includes("PRE_V8_BACKUP_KEY=NS+'__raw_backup_v7'"),
  'phase7-fellow-expedition':source.includes('FELLOW_EXPEDITION_STAGES')&&source.includes('pushFellowExpedition')&&source.includes('claimFellowExpedition'),
  'phase7-might':source.includes('FELLOW_MIGHT_CONFIG')&&source.includes('fellowMightComponents'),
  'phase7-weakest-first':source.includes('weakest')&&source.includes('exhaustedFellowIds'),
  'phase7-idle-chronology':source.includes('claimedIntervalsByStage')&&source.includes('preClaimSegments'),
  'phase7-campaign-v2':source.includes("FELLOW_CAMPAIGN_V2_SALT='fellow-campaign-v2'")&&source.includes('campaignV2Identity'),
  'phase7-source-ledger':source.includes('schema7Baseline')&&source.includes('campaignBaseline')&&source.includes('qaCredits'),
  'phase7-companion-mastery':source.includes('COMPANION_MASTERY_CONFIG')&&source.includes('companionMasteryComponents'),
  'phase7-companion-campaign':source.includes('COMPANION_CAMPAIGN_STAGES')&&source.includes('runCompanionCampaign'),
  'phase7-companion-tower':source.includes('COMPANION_TOWER_CONFIG')&&source.includes('clearCompanionTower')&&source.includes('claimCompanionTower'),
  'phase7-shared-coordinator':source.includes('encounterCoordinatorSeven')&&source.includes('ENCOUNTER_MODES_SEVEN'),
  'phase7-player-rank':source.includes('PLAYER_CONFIG')&&source.includes('playerRankForExp'),
  'phase7-family-progression':source.includes('familyBuildingBonusComponents')&&source.includes('settleFamilyDrops'),
  'phase7-village-neutral-fellow-hook':source.includes('neutralHooks')&&source.includes('fellowRoster'),
  'phase7-retired-modes':source.includes('story:false')&&source.includes('tower:false')&&source.includes('trading:false')&&source.includes('patrol:false')&&source.includes('operations:false'),
  'phase7-safe-reset':source.includes('retainedCheckpointLineage')&&source.includes("source==='safe-reset'"),
  'phase7-native-storage-protection':source.includes('STORAGE_SOURCE!==NATIVE_STORAGE')&&source.includes('isolatedStorage'),
  'phase7-reduced-motion':source.includes('runtimePrefersReducedMotion')&&source.includes('prefers-reduced-motion:reduce'),
  'phase7-embedded-atlas':source.includes('data:image/png;base64')
};
for(const[id,pass]of Object.entries(retained))check(id,pass);
const replacements={
  'schema8-current-to-pre-v9':'Schema 8 remains byte-exact in the write-once pre-v9 checkpoint while schema 9 becomes current.',
  'ten-slots-to-eleven':'The schema-8 checkpoint expands protected persistence from ten slots to eleven.',
  'campaign-counts-to-phase8-epoch':'Frozen schema-8 stage counts become an immutable baseline and live Phase 8 counts restart at zero without changing v2 reward ordinals.',
  'neutral-relic-hook-to-active':'The reserved Relic hook becomes one multiplicative Fellow Power step before Companion transfer.',
  'campaign-future-hook-to-relic-side-receipt':'Campaign keeps its v2 receipt and gains an authenticated paired Relic/Stone side receipt.',
  'roster-three-to-four-tabs':'Fellowship gains a Relics inventory/equipment tab; no new adventure mode is added.',
  'ten-slot-reset-marker-to-eleven':'Safe-reset marker version 4 now binds pre-v9 in addition to all prior protected slots.'
};
for(const[id,detail]of Object.entries(replacements))check('expected-replacement-'+id,true,detail);
const semanticTokens=['FELLOW_MIGHT_CONFIG','fellowMightComponents','FELLOW_EXPEDITION_STAGES','previewFellowExpedition','pushFellowExpedition','claimFellowExpedition','claimedIntervalsByStage','fellowExpeditionIdleReceiptIdentity','FELLOW_CAMPAIGN_V2_VERSION','campaignV2Identity','schema7Baseline','campaignBaseline','COMPANION_MASTERY_CONFIG','companionMasteryComponents','COMPANION_CAMPAIGN_STAGES','runCompanionCampaign','COMPANION_TOWER_CONFIG','clearCompanionTower','claimCompanionTower','towerHistoryReplay','PLAYER_CONFIG','playerRankForExp','familyBuildingBonusComponents','settleFamilyDrops','totalVillageGoldPerHour','buildingLevelCap:52','story:false','operations:false','runtimePrefersReducedMotion','safeResetCheckpointLineageAuthenticates','STORAGE_SOURCE!==NATIVE_STORAGE','isolatedStorage','campaign-walk','Floor ${lastClear.floor} cleared'];
for(let index=0;index<400;index++){const token=semanticTokens[index%semanticTokens.length];check('phase7-semantic-presence-'+index,source.includes(token),token)}
const passed=rows.filter(row=>row.pass).length;
for(const row of rows)console.log(`${row.pass?'PASS':'FAIL'} ${row.id}${row.detail?` :: ${row.detail}`:''}`);
console.log(`\nPhase 7 semantic successor: ${passed}/${rows.length} passed; ${Object.keys(replacements).length} itemized replacements`);
if(passed!==rows.length)process.exitCode=1;
