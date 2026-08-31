import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {existsSync,readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import vm from 'node:vm';

const ROOT=resolve(new URL('../..',import.meta.url).pathname),NODE=process.execPath;
const read=path=>readFileSync(resolve(ROOT,path)),sha=value=>createHash('sha256').update(value).digest('hex');
const rows=[],record=(id,pass,detail='')=>rows.push({id,pass:Boolean(pass),detail:typeof detail==='string'?detail:JSON.stringify(detail)});
const artifact=read('index.html'),html=artifact.toString('utf8'),application=html.match(/<script>([\s\S]*?)<\/script>/)?.[1]||'';
record('application-script-present',Boolean(application));
try{new vm.Script(application);record('application-script-syntax',true)}catch(error){record('application-script-syntax',false,error.message)}
record('release-identity',html.includes("RELEASE_VERSION='1.0.0-rc.2'")&&html.includes("VERSION='0.1.0'")&&html.includes("NS='oathforge_new_world_proto_v01'"));
record('schema-twelve-preserved',html.includes('CURRENT_SCHEMA_VERSION=12')&&!html.includes('CURRENT_SCHEMA_VERSION=13'));
record('phase11g-contract-source',html.includes("PHASE_ELEVEN_G_CONFIG_ID='phase-11g-roster-progression-v1'")&&html.includes("CURRENT_TRANSACTION_SOURCES.add('roster-progression-activation')"));
record('deterministic-rank-groups',html.includes('FELLOW_DEFS.slice(6,9)')&&html.includes('FELLOW_DEFS.slice(9,12)')&&html.includes('FELLOW_DEFS.slice(12,15)')&&html.includes('FELLOW_DEFS.slice(15,18)')&&html.includes('weightedFeaturedBeforePhaseElevenG'));
record('campaign-target-preview',html.includes('Deterministic Campaign training')&&html.includes('Replay to rotate—no pulls or random target selection.')&&html.includes('phase-11g-campaign-preview-v2'));
record('details-cue',html.includes('Swipe for details ↓'));
record('locked-progression-guards',html.includes('relicEquipPreviewBeforePhaseElevenG')&&html.includes("[data-companion-assignment] option[value],[data-relic-equip-select] option[value]"));
record('joined-economy-summary-hook',html.includes('phaseElevenGRefreshFellowEconomySummary')&&html.includes('phaseElevenGFellowEconomySummaryHtml'));
record('joined-campaign-summary',html.includes('phaseElevenGCampaignHtml')&&html.includes('data-combat-fellow-roster-power="campaign"')&&html.includes('<span>Your Cost</span>'));
record('prosperity-still-deferred',!html.includes('PROSPERITY_THRESHOLDS'));
record('external-art-preserved',html.includes("assets/portraits/${kind==='fellow'?'fellows':'family'}/${detail?'':'thumb/'}${definition.art}.webp")&&!/data:image\/(?:png|jpe?g|webp);base64,/i.test(html));
record('artifact-under-two-megabytes',artifact.length<2*1024*1024,artifact.length);
for(const path of ['docs/PHASE_11G_PROGRESSION_CONTRACT.md','docs/PHASE_11G_RESULT.md','docs/ROSTER_CATCH_UP_DECISION.md','qa/phase-11g/current-manifest.json','README.md'])record(`document-${path}`,existsSync(resolve(ROOT,path)));
const decision=read('docs/ROSTER_CATCH_UP_DECISION.md').toString('utf8'),readme=read('README.md').toString('utf8');
record('catch-up-decision-approved',decision.includes('Approved for the Phase 11F Fellow expansion')&&decision.includes('weakest Level among the six established Fellows'));
record('readme-current',readme.includes('schema-12')&&readme.includes('Phase 11G')&&readme.includes('external, lazy-loaded image assets'));
let manifest=null;try{manifest=JSON.parse(read('qa/phase-11g/current-manifest.json').toString('utf8'))}catch{}
record('manifest-current',manifest?.phase==='11G'&&manifest?.status==='PASS_LOCAL'&&manifest?.schemaVersion===12&&manifest?.releaseVersion==='1.0.0-rc.2'&&manifest?.artifact?.sha256===sha(artifact)&&manifest?.artifact?.byteLength===artifact.length&&manifest?.focusedProbe?.passed===28&&manifest?.focusedProbe?.failed===0&&manifest?.successorGate?.passed===23&&manifest?.successorGate?.failed===0,manifest);
const probe=spawnSync(NODE,['qa/phase-11g/probe.mjs'],{cwd:ROOT,encoding:'utf8',maxBuffer:256*1024*1024}),summary=(probe.stdout||'').trim().split('\n').at(-1)||'',failures=(probe.stdout||'').split('\n').filter(line=>line.startsWith('FAIL '));
record('phase11g-focused',probe.status===0&&/^Phase 11G focused probe: \d+\/\d+$/.test(summary)&&failures.length===0,{status:probe.status,summary,failures:failures.slice(0,30),stderr:(probe.stderr||'').trim().slice(-3000)});
const passed=rows.filter(row=>row.pass).length,failed=rows.length-passed,result={phase:'11G',status:failed?'FAIL':'PASS',artifact:{sha256:sha(artifact),byteLength:artifact.length},focused:summary,total:rows.length,passed,failed,rows};
console.log(JSON.stringify(result,null,2));
if(failed)process.exitCode=1;
