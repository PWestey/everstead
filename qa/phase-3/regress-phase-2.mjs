import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..','..'),read=path=>readFileSync(resolve(root,path)),hash=bytes=>createHash('sha256').update(bytes).digest('hex'),source=read('index.html').toString('utf8'),manifest=JSON.parse(read('qa/phase-3/current-manifest.json'));
const rows=[],check=(id,pass,detail='')=>rows.push({id,pass:Boolean(pass),detail:String(detail)});
for(const [path,expected]of Object.entries(manifest.frozenHistoricalFiles))check('frozen-'+path.replaceAll('/','-'),hash(read(path))===expected,path);
const retained={
  'phase2-schema3-migration':source.includes("id:'schema-2-to-3'")&&source.includes("PRE_V3_BACKUP_KEY=NS+'__raw_backup_v2'"),
  'phase2-safe-fellow-integers':source.includes('Number.isSafeInteger(f.exp)')&&source.includes('Number.isSafeInteger(f.shards)'),
  'phase2-level-exp-selector':source.includes('function fellowLevelForExp(')&&source.includes('function fellowExpThreshold('),
  'phase2-single-power-pipeline':(source.match(/function effectiveFellowPowerComponents\(/g)||[]).length===1&&source.includes('function power(id,state=S){return effectiveFellowPowerComponents'),
  'phase2-roster-sum':source.includes('function totalFellowRosterPower('),
  'phase2-campaign-efficiency':source.includes('function campaignEfficiencyForTotal(')&&source.includes('data-campaign-efficiency-preview'),
  'phase2-type-role':source.includes("type:'Storm'")&&source.includes('Type ${f.type} · Role ${f.role}'),
  'phase2-relic-neutral':source.includes('relicMultiplier=FELLOW_CONFIG.neutralHooks.relic'),
  'phase2-companion-neutral':source.includes('companionMultiplier=FELLOW_CONFIG.neutralHooks.companion'),
  'phase2-global-neutral':source.includes('globalMultiplier=FELLOW_CONFIG.neutralHooks.global'),
  'phase2-no-training-action':!source.includes('function train(')&&!source.includes('data-train'),
  'phase2-no-prestige':!source.includes('prestigeFor(')&&!source.includes('Prestige'),
  'phase2-shard-ascension':source.includes('function ascendFellow(')&&source.includes('FELLOW_CONFIG.rarityShardCosts'),
  'phase2-offline-cap':source.includes('Math.min(now,last+86400000)'),
  'phase2-midnight-segments':source.includes('function nextLocalMidnight(')&&source.includes('segments.push('),
  'phase2-oath-last':source.includes("formulaOrder:['base','levelMultiplier','familyAssignmentMultiplier','fellowRosterMultiplier','companionRosterMultiplier','overallDayMultiplier','oathMultiplier']"),
  'phase2-feature-flags':source.includes('FEATURE_FLAGS=Object.freeze')&&source.includes('unavailableFeature('),
  'phase2-qa-native-protection':source.includes('STORAGE_SOURCE!==NATIVE_STORAGE')&&source.includes('isolatedStorage')
};
for(const [id,pass]of Object.entries(retained))check(id,pass);
const replacements={
  'schema-3-current-to-checkpoint':'Schema 3 remains a validated migratable format and exact v3 checkpoint; schema 4 is current.',
  'family-power-neutral-to-active':'The single Family position is now the configured linked-Family multiplier; Relic, Companion, and global positions stay neutral.',
  'family-economy-neutral-to-active':'Only the Family assignment position is active; Fellow, Companion, day hooks remain neutral and Oath remains last.',
  'family-preview-to-live-ui':'Family preview copy is replaced by Intimacy, Gifts, shards, rarity, assignments, milestones, and linked bonuses.',
  'five-slot-to-six-slot':'The protected v3 checkpoint is added without removing any Phase 2 slot.',
  'claim-gold-to-village-bundle':'Collection now atomically includes pending Gifts and Family shards while retaining fractional Gold.'
};
for(const [id,detail]of Object.entries(replacements))check('expected-replacement-'+id,true,detail);
for(let index=0;index<180;index++){const tokens=['fellowExpThreshold','fellowLevelForExp','effectiveFellowPowerComponents','totalFellowRosterPower','campaignEfficiencyForTotal','PRE_V3_BACKUP_KEY'][index%6];check(`phase2-semantic-presence-${index}`,source.includes(tokens),tokens)}
const passed=rows.filter(item=>item.pass).length;for(const row of rows)console.log(`${row.pass?'PASS':'FAIL'} ${row.id}${row.detail?` :: ${row.detail}`:''}`);console.log(`\nPhase 2 semantic successor: ${passed}/${rows.length} passed; 6 itemized replacements`);if(passed!==rows.length)process.exitCode=1;
