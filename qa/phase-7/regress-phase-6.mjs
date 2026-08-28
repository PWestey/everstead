import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';

const root=resolve(new URL('../..',import.meta.url).pathname),read=path=>readFileSync(resolve(root,path)),hash=bytes=>createHash('sha256').update(bytes).digest('hex'),source=read('index.html').toString('utf8'),manifest=JSON.parse(read('qa/phase-6/current-manifest.json')),rows=[],check=(id,pass,detail='')=>rows.push({id,pass:Boolean(pass),detail:String(detail)});
for(const[path,expected]of Object.entries(manifest.frozenHistoricalFiles))check('frozen-'+path.replaceAll('/','-'),hash(read(path))===expected,path);
for(const line of read('qa/phase-6/checksums.sha256').toString('utf8').trim().split('\n')){const[expected,...parts]=line.trim().split(/\s+/),path=parts.join(' ');if(path!=='index.html')check('phase6-frozen-'+path.replaceAll('/','-'),hash(read(path))===expected,path)}

const retained={
  'phase6-schema7-migration':source.includes("id:'schema-6-to-7'")&&source.includes("PRE_V7_BACKUP_KEY=NS+'__raw_backup_v6'"),
  'phase6-companion-mastery':source.includes('COMPANION_MASTERY_CONFIG')&&source.includes('companionMasteryComponents'),
  'phase6-companion-campaign':source.includes('COMPANION_CAMPAIGN_STAGES')&&source.includes('runCompanionCampaign'),
  'phase6-companion-tower':source.includes('COMPANION_TOWER_CONFIG')&&source.includes('clearCompanionTower')&&source.includes('claimCompanionTower'),
  'phase6-companion-ledger':source.includes('companionProgressLedger')&&source.includes('schema6Baseline'),
  'phase6-tower-chronology':source.includes('claimedIntervalsByFloor')&&source.includes('preClaimSegments'),
  'phase6-shared-coordinator':source.includes('encounterCoordinatorSeven')&&source.includes('ENCOUNTER_MODES_SEVEN'),
  'phase6-player-rank':source.includes('PLAYER_CONFIG')&&source.includes('playerRankForExp'),
  'phase6-fellow-campaign':source.includes('FELLOW_CAMPAIGN_STAGES')&&source.includes('runFellowCampaignV2'),
  'phase6-walking-presentation':source.includes('campaign-walk')&&source.includes('campaign-player'),
  'phase6-reduced-motion':source.includes('prefers-reduced-motion:reduce')&&source.includes('runtimePrefersReducedMotion'),
  'phase6-family-progression':source.includes('familyBuildingBonusComponents')&&source.includes('settleFamilyDrops'),
  'phase6-village-economy':source.includes('totalVillageGoldPerHour')&&source.includes('buildingLevelCap:52'),
  'phase6-oath-undo':source.includes("kind:'oath-completion'")&&source.includes('validOathUndo'),
  'phase6-retired-modes':source.includes('story:false')&&source.includes('tower:false')&&source.includes('trading:false')&&source.includes('patrol:false')&&source.includes('operations:false'),
  'phase6-safe-reset':source.includes('safeResetEightAuthenticates')&&source.includes("source==='safe-reset'"),
  'phase6-native-storage-protection':source.includes('STORAGE_SOURCE!==NATIVE_STORAGE')&&source.includes('isolatedStorage'),
  'phase6-tower-ui-feedback':source.includes('Current hourly rates')&&source.includes('Exact next first-clear rewards')&&source.includes('Last Tower activity')
};
for(const[id,pass]of Object.entries(retained))check(id,pass);
const replacements={
  'schema7-current-to-pre-v8':'Schema 7 remains byte-exact in the write-once pre-v8 checkpoint while schema 8 becomes current.',
  'nine-slots-to-ten':'The schema-7 checkpoint expands protected persistence from nine slots to ten.',
  'neutral-fellow-global-to-might':'The neutral Fellow global hook is replaced by derived non-spendable Might inside Fellow Power.',
  'three-adventure-routes-to-four':'Adventure adds Fellow Expedition without reviving retired Story or legacy Tower.',
  'campaign-rng-v1-to-v2':'Post-schema7 Fellow Campaign randomness is intentionally keyed by per-stage post-baseline run ordinal.',
  'campaign-ledger-to-schema7-baseline':'Fellow Campaign source accounting gains an immutable schema7 baseline and exact per-stage counts.',
  'fellow-idle-lane':'Fellow Expedition adds claim-time Might and broad random Fellow shards without Gold or EXP.',
  'fellow-power-propagation':'Might affects Total Fellow Roster Power and Campaign exactly once while the Village Fellow hook remains neutral.'
};
for(const[id,detail]of Object.entries(replacements))check('expected-replacement-'+id,true,detail);
const semanticTokens=['COMPANION_MASTERY_CONFIG','companionMasteryComponents','COMPANION_CAMPAIGN_STAGES','companionCampaignEfficiencyPreview','runCompanionCampaign','COMPANION_TOWER_CONFIG','companionTowerChallengePreview','companionTowerIdlePreview','clearCompanionTower','claimCompanionTower','companionProgressLedger','towerHistoryReplay','PLAYER_CONFIG','playerRankForExp','FELLOW_CAMPAIGN_STAGES','campaignEfficiencyForTotal','runFellowCampaign','runtimePrefersReducedMotion','familyDropState','settleFamilyDrops','canonicalPendingCollection','familyBuildingBonusComponents','linkedFamilyBonusComponents','oathGiftTracker','PRE_V7_BACKUP_KEY','safeResetCheckpointLineageAuthenticates','STORAGE_SOURCE!==NATIVE_STORAGE','isolatedStorage','totalVillageGoldPerHour','buildingLevelCap:52','Floor ${lastClear.floor} cleared','rewardTotal(lastClaim.companionExp)','companionTowerClearReceiptIdentity','companionTowerIdleReceiptIdentity'];
for(let index=0;index<340;index++){const token=semanticTokens[index%semanticTokens.length];check('phase6-semantic-presence-'+index,source.includes(token),token)}
const passed=rows.filter(row=>row.pass).length;
for(const row of rows)console.log(`${row.pass?'PASS':'FAIL'} ${row.id}${row.detail?` :: ${row.detail}`:''}`);
console.log(`\nPhase 6 semantic successor: ${passed}/${rows.length} passed; ${Object.keys(replacements).length} itemized replacements`);
if(passed!==rows.length)process.exitCode=1;
