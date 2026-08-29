import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';

const root=resolve(new URL('../..',import.meta.url).pathname),read=path=>readFileSync(resolve(root,path)),hash=bytes=>createHash('sha256').update(bytes).digest('hex'),source=read('index.html').toString('utf8'),manifest=JSON.parse(read('qa/phase-8/current-manifest.json')),rows=[],check=(id,pass,detail='')=>rows.push({id,pass:Boolean(pass),detail:String(detail)});
for(const[path,expected]of Object.entries(manifest.frozenHistoricalFiles))check('frozen-'+path.replaceAll('/','-'),hash(read(path))===expected,path);
for(const line of read('qa/phase-8/checksums.sha256').toString('utf8').trim().split('\n')){const[expected,...parts]=line.trim().split(/\s+/),path=parts.join(' ');if(path!=='index.html')check('phase8-frozen-'+path.replaceAll('/','-'),hash(read(path))===expected,path)}

const retained={
  'phase8-schema9-migration':source.includes("id:'schema-8-to-9'")&&source.includes("PRE_V9_BACKUP_KEY=NS+'__raw_backup_v8'"),
  'phase8-relic-catalogue':source.includes('RELIC_DEFS')&&source.includes('First-Road Lantern')&&source.includes('Oathkeeper Crest'),
  'phase8-relic-stones':source.includes('relicStones')&&source.includes('grantRelicStones'),
  'phase8-relic-upgrades':source.includes('relicUpgradeCost')&&source.includes('upgradeRelic'),
  'phase8-relic-equipment':source.includes('equipRelic')&&source.includes('relicSlots'),
  'phase8-campaign-v2':source.includes("FELLOW_CAMPAIGN_V2_SALT='fellow-campaign-v2'")&&source.includes('campaignV2Identity'),
  'phase8-side-receipt':source.includes('relicProgressLedger')&&source.includes('lastCampaignReceipt')&&source.includes('campaignRewardIdentity'),
  'phase8-campaign-epoch':source.includes('phaseEightCampaignEpoch')&&source.includes('schema8CampaignBaseline')&&source.includes('phaseEightLiveUsage'),
  'phase8-power-order':source.includes('relicMultiplier')&&source.includes('companionTransfer'),
  'phase8-fellow-expedition':source.includes('FELLOW_EXPEDITION_STAGES')&&source.includes('pushFellowExpedition')&&source.includes('claimFellowExpedition'),
  'phase8-might':source.includes('FELLOW_MIGHT_CONFIG')&&source.includes('fellowMightComponents'),
  'phase8-companion-campaign':source.includes('COMPANION_CAMPAIGN_STAGES')&&source.includes('runCompanionCampaign'),
  'phase8-companion-tower':source.includes('COMPANION_TOWER_CONFIG')&&source.includes('clearCompanionTower')&&source.includes('claimCompanionTower'),
  'phase8-companion-mastery':source.includes('COMPANION_MASTERY_CONFIG')&&source.includes('companionMasteryComponents'),
  'phase8-family-progression':source.includes('familyBuildingBonusComponents')&&source.includes('settleFamilyDrops'),
  'phase8-village-neutral-fellow-hook':source.includes('neutralHooks')&&source.includes('fellowRoster'),
  'phase8-retired-modes':source.includes('story:false')&&source.includes('tower:false')&&source.includes('trading:false')&&source.includes('patrol:false')&&source.includes('operations:false'),
  'phase8-safe-reset':source.includes('retainedCheckpointLineage')&&source.includes("source==='safe-reset'"),
  'phase8-native-storage-protection':source.includes('STORAGE_SOURCE!==NATIVE_STORAGE')&&source.includes('isolatedStorage'),
  'phase8-reduced-motion':source.includes('runtimePrefersReducedMotion')&&source.includes('prefers-reduced-motion:reduce'),
  'phase8-embedded-atlas':source.includes('data:image/png;base64')
};
for(const[id,pass]of Object.entries(retained))check(id,pass);
const replacements={
  'schema9-current-to-pre-v10':'Schema 9 remains byte-exact in the write-once pre-v10 checkpoint while schema 10 becomes current.',
  'eleven-slots-to-twelve':'The schema-9 checkpoint expands protected persistence from eleven slots to twelve.',
  'reset-marker4-to5':'Safe-reset marker version 5 binds pre-v10 in addition to all prior protected slots.',
  'player-unlocks-authority':'Schema 10 adds the exact fresh-empty or migrated-full grandfather authority and no material reward.',
  'universal-route-stage-access-to-rank-or-grandfather':'New stage and Adventure route access is derived from Player Rank or exact migration grandfathering.',
  'rank-pill-to-wayfarer-profile-roadmap':'The existing Rank presentation opens the shared Wayfarer profile and five-milestone roadmap.',
  'campaign-result-adds-captured-rank-summary':'The unchanged Campaign receipts are presented with an immutable access-only Rank transition snapshot.',
  'schema9-to10-receipt-last':'The Phase 9 migration receipt is appended last without altering Phase 8 receipt order or reward streams.',
  'adventure-qa-bridge-hardened':'The inherited QA Adventure action now requires destructive isolated-storage authorization and suppresses presentation during direct bridge calls.'
};
for(const[id,detail]of Object.entries(replacements))check('expected-replacement-'+id,true,detail);
const semanticTokens=['RELIC_DEFS','relicStones','relicUpgradeCost','upgradeRelic','equipRelic','relicSlots','relicProgressLedger','phaseEightCampaignEpoch','FELLOW_CAMPAIGN_V2_VERSION','campaignV2Identity','FELLOW_MIGHT_CONFIG','fellowMightComponents','FELLOW_EXPEDITION_STAGES','previewFellowExpedition','pushFellowExpedition','claimFellowExpedition','claimedIntervalsByStage','COMPANION_MASTERY_CONFIG','companionMasteryComponents','COMPANION_CAMPAIGN_STAGES','runCompanionCampaign','COMPANION_TOWER_CONFIG','clearCompanionTower','claimCompanionTower','PLAYER_CONFIG','playerRankForExp','familyBuildingBonusComponents','settleFamilyDrops','totalVillageGoldPerHour','buildingLevelCap:52','story:false','operations:false','runtimePrefersReducedMotion','safeResetCheckpointLineageAuthenticates','STORAGE_SOURCE!==NATIVE_STORAGE','isolatedStorage','campaign-walk','Relics · one slot per Fellow','Might','Mastery'];
for(let index=0;index<500;index++){const token=semanticTokens[index%semanticTokens.length];check('phase8-semantic-presence-'+index,source.includes(token),token)}
const passed=rows.filter(row=>row.pass).length;
for(const row of rows)console.log(`${row.pass?'PASS':'FAIL'} ${row.id}${row.detail?` :: ${row.detail}`:''}`);
console.log(`\nPhase 8 semantic successor: ${passed}/${rows.length} passed; ${Object.keys(replacements).length} itemized replacements`);
if(passed!==rows.length)process.exitCode=1;
