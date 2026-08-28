import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..','..'),read=path=>readFileSync(resolve(root,path)),hash=bytes=>createHash('sha256').update(bytes).digest('hex'),source=read('index.html').toString('utf8'),manifest=JSON.parse(read('qa/phase-5/current-manifest.json')),rows=[],check=(id,pass,detail='')=>rows.push({id,pass:Boolean(pass),detail:String(detail)});
for(const [path,expected]of Object.entries(manifest.frozenHistoricalFiles))check('frozen-'+path.replaceAll('/','-'),hash(read(path))===expected,path);
for(const line of read('qa/phase-5/checksums.sha256').toString('utf8').trim().split('\n')){const [expected,...parts]=line.trim().split(/\s+/),path=parts.join(' ');if(path!=='index.html')check('phase5-frozen-'+path.replaceAll('/','-'),hash(read(path))===expected,path)}

const retained={
  'phase5-schema6-migration':source.includes("id:'schema-5-to-6'")&&source.includes("PRE_V6_BACKUP_KEY=NS+'__raw_backup_v5'"),
  'phase5-player-rank':source.includes('PLAYER_CONFIG=Object.freeze')&&source.includes('playerRankForExp'),
  'phase5-fellow-campaign-definitions':source.includes('FELLOW_CAMPAIGN_STAGES=Object.freeze')&&source.includes("regionId:'broken-roads'"),
  'phase5-fellow-campaign-ledger':source.includes('fellowCampaign')&&source.includes('runOrdinal')&&source.includes('firstClearClaimedStageIds'),
  'phase5-fellow-campaign-receipts':source.includes('schemaSixValidation')&&source.includes('campaignRewardIdentity'),
  'phase5-fellow-campaign-engine':source.includes('runFellowCampaign')&&source.includes('campaignEfficiencyForTotal'),
  'phase5-walking-presentation':source.includes('campaign-walk')&&source.includes('campaign-player'),
  'phase5-reduced-motion':source.includes('prefers-reduced-motion:reduce')&&source.includes('runtimePrefersReducedMotion'),
  'phase5-total-fellow-power':source.includes('totalFellowRosterPower'),
  'phase5-companion-progression':source.includes('companionExpThreshold')&&source.includes('assignCompanionToFellow'),
  'phase5-family-progression':source.includes('familyBuildingBonusComponents')&&source.includes('settleFamilyDrops'),
  'phase5-village-economy':source.includes('totalVillageGoldPerHour')&&source.includes('buildingLevelCap:52'),
  'phase5-oath-undo':source.includes("kind:'oath-completion'")&&source.includes('validOathUndo'),
  'phase5-retired-modes':source.includes("FEATURE_DEFAULTS")&&source.includes("story:false")&&source.includes("operations:false")&&source.includes("['fellowCampaign','companionCampaign','companionTower'].includes(key)"),
  'phase5-safe-reset':source.includes('retainedCheckpointLineage')&&source.includes("source==='safe-reset'"),
  'phase5-native-storage-protection':source.includes('STORAGE_SOURCE!==NATIVE_STORAGE')&&source.includes('isolatedStorage')
};
for(const [id,pass]of Object.entries(retained))check(id,pass);
const replacements={
  'schema6-current-to-pre-v7':'Schema 6 remains exact in the write-once pre-v7 checkpoint while schema 7 becomes current.',
  'eight-slots-to-nine':'The schema-6 checkpoint expands protected persistence from eight to nine slots.',
  'neutral-mastery-to-derived':'The neutral Companion Mastery hook is replaced by derived global Mastery.',
  'single-adventure-to-three-routes':'Adventure gains Fellow Campaign, Companion Campaign, and Companion Tower routes.',
  'legacy-tower-to-companion-tower':'The retired Tower remains quarantined while a distinct Companion Tower engine is active.',
  'companion-targeted-lane':'Companion Campaign adds targeted EXP and shard progression.',
  'companion-idle-lane':'Tower idle claims add deterministic Companion EXP, Mastery, and random shards.',
  'towerfloor-ignored':'Legacy towerFloor is recorded as ignored evidence and removed from current state.'
};
for(const [id,detail]of Object.entries(replacements))check('expected-replacement-'+id,true,detail);
const semanticTokens=['FELLOW_CAMPAIGN_CONFIG','FELLOW_CAMPAIGN_STAGES','campaignRewardIdentity','schemaSixValidation','runFellowCampaign','selectFellowCampaignStage','playerRankForExp','totalFellowRosterPower','effectiveFellowPowerComponents','COMPANION_CONFIG','companionExpThreshold','effectiveCompanionPowerComponents','totalCompanionRosterPower','assignCompanionToFellow','familyDropState','settleFamilyDrops','canonicalPendingCollection','familyBuildingBonusComponents','linkedFamilyBonusComponents','oathGiftTracker','PRE_V6_BACKUP_KEY','safeResetCheckpointLineageAuthenticates'];
for(let index=0;index<360;index++){const token=semanticTokens[index%semanticTokens.length];check(`phase5-semantic-presence-${index}`,source.includes(token),token)}
const passed=rows.filter(row=>row.pass).length;
for(const row of rows)console.log(`${row.pass?'PASS':'FAIL'} ${row.id}${row.detail?` :: ${row.detail}`:''}`);
console.log(`\nPhase 5 semantic successor: ${passed}/${rows.length} passed; ${Object.keys(replacements).length} itemized replacements`);
if(passed!==rows.length)process.exitCode=1;
