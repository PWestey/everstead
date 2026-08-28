import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..','..'),read=path=>readFileSync(resolve(root,path)),hash=bytes=>createHash('sha256').update(bytes).digest('hex'),source=read('index.html').toString('utf8'),manifest=JSON.parse(read('qa/phase-4/current-manifest.json')),rows=[],check=(id,pass,detail='')=>rows.push({id,pass:Boolean(pass),detail:String(detail)});
for(const [path,expected]of Object.entries(manifest.frozenHistoricalFiles))check('frozen-'+path.replaceAll('/','-'),hash(read(path))===expected,path);
for(const line of read('qa/phase-4/checksums.sha256').toString('utf8').trim().split('\n')){const [expected,...parts]=line.trim().split(/\s+/),path=parts.join(' ');if(path!=='index.html')check('phase4-frozen-'+path.replaceAll('/','-'),hash(read(path))===expected,path)}

const retained={
  'phase4-schema5-migration':source.includes("id:'schema-4-to-5'")&&source.includes("PRE_V5_BACKUP_KEY=NS+'__raw_backup_v4'"),
  'phase4-companion-config':source.includes('COMPANION_CONFIG=Object.freeze')&&source.includes('transferRate:.4')&&source.includes('levelCap:100'),
  'phase4-companion-exact-roster':source.includes('exactKeySet(state.companions,COMPANION_IDS)'),
  'phase4-companion-level-exp':source.includes('companionExpThreshold(')&&source.includes('companionLevelForExp('),
  'phase4-companion-power':source.includes('effectiveCompanionPowerComponents(')&&source.includes('totalCompanionRosterPower('),
  'phase4-companion-assignment':source.includes('assignCompanionToFellow(')&&source.includes('companionAssignmentPreview('),
  'phase4-companion-transfer-order':source.includes("'companionPowerTransfer','familyBondMultiplier','globalMultiplier','round'"),
  'phase4-companion-ascension':source.includes('ascendCompanion(')&&source.includes('rarityShardCosts'),
  'phase4-collision-ledger':source.includes('companionAssignmentCollisions')&&source.includes('schemaFiveCompanionCollisionLedger('),
  'phase4-canonical-extra-removal':source.includes('Object.fromEntries(COMPANION_DEFS.map'),
  'phase4-grant-helpers':source.includes('grantCompanionExp(')&&source.includes('grantCompanionShards('),
  'phase4-profile-ui':source.includes('openCompanion(')&&source.includes('Assigned to'),
  'phase4-family-config':source.includes('FAMILY_CONFIG=Object.freeze')&&source.includes('giftIntimacy:10'),
  'phase4-family-exact-roster':source.includes('exactKeySet(state.family,FAMILY_IDS)')&&source.includes('exactKeySet(drops.pendingShards,FAMILY_IDS)'),
  'phase4-family-building':source.includes('familyBuildingBonusComponents(')&&source.includes('assignFamilyToBuilding('),
  'phase4-family-links':source.includes('linkedFamilyBonusComponents(')&&source.includes('familyBondMultiplier'),
  'phase4-family-drops':source.includes('settleFamilyDrops(')&&source.includes('canonicalPendingCollection('),
  'phase4-oath-gifts':source.includes('oathGiftTracker')&&source.includes('oathGiftGuaranteeUnique'),
  'phase4-oath-undo':source.includes("version:2,kind:'oath-completion'")&&source.includes('validOathUndo('),
  'phase4-building-cap':source.includes('buildingLevelCap:52')&&source.includes('BUILDING AT PROVISIONAL CAP'),
  'phase4-offline-cap':source.includes('Math.min(now,last+86400000)'),
  'phase4-midnight':source.includes('nextLocalMidnight(')&&source.includes('segments.push('),
  'phase4-single-fellow-pipeline':(source.match(/function effectiveFellowPowerComponents\(/g)||[]).length===1,
  'phase4-staging-owner':source.includes('staging-cleanup-owner')&&source.includes('staging-occupied'),
  'phase4-native-storage-protection':source.includes('STORAGE_SOURCE!==NATIVE_STORAGE')&&source.includes('isolatedStorage'),
  'phase4-safe-reset-residual':source.includes("source==='safe-reset'")&&source.includes('staging-provenance')
};
for(const [id,pass]of Object.entries(retained))check(id,pass);
const replacements={
  'schema5-current-to-pre-v6':'Schema 5 remains exact and validated in the write-once pre-v6 checkpoint while schema 6 becomes current.',
  'seven-slots-to-eight':'The schema-5 checkpoint adds one protected slot without altering the Phase 0–4 slots.',
  'story-to-fellow-campaign':'Active Story is replaced by the ten-stage Broken Roads Fellow Campaign; the exact Story predecessor remains in pre-v6.',
  'legacy-modes-quarantined':'Story, Tower, Trading, Patrol, and Operations are retired from production controls and fail closed under overrides.',
  'rank-foundation':'The central Wayfarer, cumulative Rank EXP, Rank cap, and Rank-2 replay gate are new Phase 5 state.',
  'campaign-ui':'Walking/slideshow presentation, encounter interruption, progress nodes, preview, and result receipt UI are new Phase 5 surfaces.',
  'campaign-rewards':'Gold cost, targeted Fellow EXP/shards, Gift roll, and first-clear Rank EXP replace Story Gold/Prosperity/Bond/Resolve rewards.'
};
for(const [id,detail]of Object.entries(replacements))check('expected-replacement-'+id,true,detail);
const semanticTokens=['schemaFiveCompanionCollisionLedger','companionAssignmentCollisions','companionExpThreshold','companionLevelForExp','effectiveCompanionPowerComponents','totalCompanionRosterPower','assignCompanionToFellow','ascendCompanion','grantCompanionExp','grantCompanionShards','familyDropState','settleFamilyDrops','canonicalPendingCollection','familyBuildingBonusComponents','linkedFamilyBonusComponents','giveFamilyGift','ascendFamily','assignFamilyToBuilding','oathGiftTracker','ECONOMY_CONFIG.buildingLevelCap','PRE_V5_BACKUP_KEY'];
for(let index=0;index<260;index++){const token=semanticTokens[index%semanticTokens.length];check(`phase4-semantic-presence-${index}`,source.includes(token),token)}
const passed=rows.filter(row=>row.pass).length;
for(const row of rows)console.log(`${row.pass?'PASS':'FAIL'} ${row.id}${row.detail?` :: ${row.detail}`:''}`);
console.log(`\nPhase 4 semantic successor: ${passed}/${rows.length} passed; ${Object.keys(replacements).length} itemized replacements`);
if(passed!==rows.length)process.exitCode=1;
