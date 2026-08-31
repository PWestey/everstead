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
record('schema-twelve-active',html.includes('CURRENT_SCHEMA_VERSION=12'));
record('compatibility-namespace-preserved',html.includes("NS='oathforge_new_world_proto_v01'")&&html.includes("RELEASE_VERSION='1.0.0-rc.1'"));
record('index-externalized-under-two-megabytes',artifact.length<2*1024*1024,artifact.length);
record('embedded-raster-assets-removed',!/data:image\/(?:png|jpe?g|webp);base64,/i.test(html));
record('external-backgrounds-and-companion',html.includes("assets/backgrounds/village.webp")&&html.includes("assets/backgrounds/adventure.webp")&&html.includes("assets/portraits/companions/atlas.webp"));
record('full-screen-profile-contract',html.includes('.profile[data-roster-profile] .profile-stage{height:100dvh;min-height:100dvh')&&html.includes('.overlay:has(.profile[data-roster-profile])'));
record('mobile-codex-two-column-contract',/@media\(max-width:360px\)\{[^}]*\.phase-11d-roster-controls\{[^}]*\}\.phase-11d-codex-tabs\{grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/.test(html));
record('navigation-reset-contract',html.includes('navBeforePhaseElevenF')&&html.includes("globalThis.scrollTo({top:0,left:0,behavior:'auto'})"));
record('compact-claim-contract',html.includes("ready<=1")&&html.includes('CLAIM ${preview.claimableLanes[0].name.toUpperCase()}'));
record('unsettled-economy-decisions-still-deferred',!html.includes('PROSPERITY_THRESHOLDS')&&!html.includes('CATCH_UP_RATE'));

const manifest=JSON.parse(read('assets/portraits/manifest.json'));
record('portrait-manifest-counts',manifest.version===1&&manifest.fellows.length===18&&manifest.family.length===20,{fellows:manifest.fellows.length,family:manifest.family.length});
const entries=[...manifest.fellows,...manifest.family],paths=entries.flatMap(item=>[item.full,item.thumb]);
record('portrait-manifest-unique',new Set(entries.map(item=>item.id)).size===38&&new Set(entries.map(item=>item.slug)).size===38&&new Set(paths).size===76);
record('portrait-files-complete',paths.every(path=>existsSync(resolve(ROOT,path))),paths.filter(path=>!existsSync(resolve(ROOT,path))));
record('portrait-files-webp',paths.every(path=>path.endsWith('.webp')));
record('portrait-source-paths-referenced',entries.every(item=>html.includes(`art:'${item.slug}'`))&&html.includes("assets/portraits/${kind==='fellow'?'fellows':'family'}/${detail?'':'thumb/'}${definition.art}.webp"));

const docs=['docs/PHASE_11F_RESULT.md','docs/RECOVERY_SCHEMA_POLICY.md','docs/PROSPERITY_HQ_DECISION.md','docs/ROSTER_CATCH_UP_DECISION.md'];
record('phase-docs-present',docs.every(path=>existsSync(resolve(ROOT,path))),docs.filter(path=>!existsSync(resolve(ROOT,path))));
const recovery=read('docs/RECOVERY_SCHEMA_POLICY.md').toString('utf8');
record('future-schema-recovery-gate-advanced',recovery.includes('beyond 12')&&recovery.includes('schema-12'));

const probe=spawnSync(NODE,['qa/phase-11f/probe.mjs'],{cwd:ROOT,encoding:'utf8',maxBuffer:256*1024*1024}),summary=(probe.stdout||'').trim().split('\n').at(-1)||'',failures=(probe.stdout||'').split('\n').filter(line=>line.startsWith('FAIL '));
record('phase11f-focused',probe.status===0&&/^Phase 11F focused probe: \d+\/\d+$/.test(summary)&&failures.length===0,{status:probe.status,summary,failures:failures.slice(0,20),stderr:(probe.stderr||'').trim().slice(-2000)});
const passed=rows.filter(row=>row.pass).length,failed=rows.length-passed,result={phase:'11F',status:failed?'FAIL':'PASS',artifact:{sha256:sha(artifact),byteLength:artifact.length},portraits:{entries:entries.length,files:paths.length,totalBytes:paths.reduce((sum,path)=>sum+read(path).length,0)},focused:summary,total:rows.length,passed,failed,rows};
console.log(JSON.stringify(result,null,2));
if(failed)process.exitCode=1;
