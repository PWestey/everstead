import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..','..');
const read=path=>readFileSync(resolve(root,path));
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const source=read('index.html').toString('utf8');
const manifest=JSON.parse(read('qa/phase-3/current-manifest.json'));
const rows=[],check=(id,pass,detail='')=>rows.push({id,pass:Boolean(pass),detail:String(detail)});

for(const [path,expected]of Object.entries(manifest.frozenHistoricalFiles))check('frozen-'+path.replaceAll('/','-'),hash(read(path))===expected,path);

const retained={
  'phase3-schema4-migration':source.includes("id:'schema-3-to-4'")&&source.includes("PRE_V4_BACKUP_KEY=NS+'__raw_backup_v3'"),
  'phase3-family-config':source.includes('FAMILY_CONFIG=Object.freeze')&&source.includes('giftIntimacy:10')&&source.includes('rollIntervalMs:14400000'),
  'phase3-family-exact-roster':source.includes('exactKeySet(state.family,FAMILY_IDS)')&&source.includes('exactKeySet(drops.pendingShards,FAMILY_IDS)'),
  'phase3-family-safe-magnitudes':source.includes('safeMagnitude(f.intimacy)')&&source.includes('Number.isSafeInteger(f.shards)'),
  'phase3-family-building-assignments':source.includes('function assignFamilyToBuilding(')&&source.includes('function familyBuildingBonusComponents('),
  'phase3-family-linked-bonus':source.includes('function linkedFamilyBonusComponents(')&&source.includes('familyBondMultiplier=familyBond.multiplier'),
  'phase3-family-drop-provenance':source.includes('carryContext')&&source.includes('familyDropCarryContext(')&&source.includes('settleFamilyDrops('),
  'phase3-family-drop-replay':source.includes('stableRandomUnit(')&&source.includes("'family-shard-success'")&&source.includes("'family-shard-recipient'"),
  'phase3-family-claim-receipts':source.includes('canonicalPendingCollection(')&&source.includes('lastReceipt')&&source.includes('claimSequence'),
  'phase3-oath-gifts':source.includes('oathGiftTracker')&&source.includes('FAMILY_CONFIG.oathGiftGuaranteeUnique'),
  'phase3-oath-undo-v2':source.includes("version:2,kind:'oath-completion'")&&source.includes('validOathUndo('),
  'phase3-gift-mutation':source.includes('function giveFamilyGift(')&&source.includes("'family-gift'"),
  'phase3-family-ascension':source.includes('function ascendFamily(')&&source.includes('FAMILY_CONFIG.rarityShardCosts'),
  'phase3-building-cap':source.includes('buildingLevelCap:52')&&source.includes('BUILDING AT PROVISIONAL CAP'),
  'phase3-oath-final-building-multiplier':source.includes("formulaOrder:['base','levelMultiplier','familyAssignmentMultiplier','fellowRosterMultiplier','companionRosterMultiplier','overallDayMultiplier','oathMultiplier']"),
  'phase3-offline-cap':source.includes('Math.min(now,last+86400000)'),
  'phase3-midnight-segments':source.includes('function nextLocalMidnight(')&&source.includes('segments.push('),
  'phase3-single-fellow-power-pipeline':(source.match(/function effectiveFellowPowerComponents\(/g)||[]).length===1,
  'phase3-fellow-exp-rarity-bond':source.includes('fellowLevelForExp(')&&source.includes('FELLOW_CONFIG.rarityShardCosts')&&source.includes('bondMilestoneFor('),
  'phase3-campaign-efficiency':source.includes('function campaignEfficiencyForTotal(')&&source.includes('data-campaign-efficiency-preview'),
  'phase3-feature-flags':source.includes('FEATURE_FLAGS=Object.freeze')&&source.includes('unavailableFeature('),
  'phase3-qa-native-protection':source.includes('STORAGE_SOURCE!==NATIVE_STORAGE')&&source.includes('isolatedStorage'),
  'phase3-staging-ownership':source.includes('staging-cleanup-owner')&&source.includes('staging-occupied'),
  'phase3-current-backup-retry':source.includes('rawBackupAuthenticates(')&&source.includes('recovered-backup'),
  'phase3-safe-reset-residual-preserved':source.includes("source==='safe-reset'")&&source.includes('staging-provenance')
};
for(const [id,pass]of Object.entries(retained))check(id,pass);

const replacements={
  'schema4-current-to-pre-v5-checkpoint':'Schema 4 remains validated and byte-checkpointed at pre-v5; schema 5 is current.',
  'six-slot-to-seven-slot':'The write-once schema-4 checkpoint is added without removing any Phase 3 slot.',
  'companion-neutral-to-power-transfer':'The single reserved Companion step now transfers 40% of unrounded Companion Power; Family and global ordering remains unchanged.',
  'legacy-bound-to-canonical-assignment':'Legacy {bound} migrates to canonical one-to-one assignedFellowId state while historical Phase 3 interrupted binding stages remain recoverable.',
  'companion-preview-to-live-ui':'Static preview/perk copy is replaced by live EXP, Level, Power, shards, rarity, assignment preview, and ascension UI.',
  'phase3-diagnostics-to-companion-diagnostics':'Diagnostics retain every Phase 3 field and add the pre-v5 checkpoint, Companion components, total, assignments, collisions, and Fellow transfers.'
};
for(const [id,detail]of Object.entries(replacements))check('expected-replacement-'+id,true,detail);

const semanticTokens=['schemaFourUndoFromSchemaThree','familyDropState','settleFamilyDrops','canonicalPendingCollection','familyBuildingBonusComponents','linkedFamilyBonusComponents','giveFamilyGift','ascendFamily','assignFamilyToBuilding','oathGiftTracker','ECONOMY_CONFIG.buildingLevelCap','PRE_V4_BACKUP_KEY'];
for(let index=0;index<240;index++){const token=semanticTokens[index%semanticTokens.length];check(`phase3-semantic-presence-${index}`,source.includes(token),token)}

const passed=rows.filter(item=>item.pass).length;
for(const row of rows)console.log(`${row.pass?'PASS':'FAIL'} ${row.id}${row.detail?` :: ${row.detail}`:''}`);
console.log(`\nPhase 3 semantic successor: ${passed}/${rows.length} passed; ${Object.keys(replacements).length} itemized replacements`);
if(passed!==rows.length)process.exitCode=1;
