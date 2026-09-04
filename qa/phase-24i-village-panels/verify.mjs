import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'../..');
const rows=[];
const bytes=relative=>fs.readFileSync(path.join(root,relative));
const read=relative=>bytes(relative).toString('utf8');
const sha=value=>crypto.createHash('sha256').update(value).digest('hex');
const fileHash=relative=>sha(bytes(relative));
const record=(id,pass,detail='')=>rows.push({id,pass:Boolean(pass),detail:typeof detail==='string'?detail:JSON.stringify(detail)});
const count=(source,token)=>source.split(token).length-1;
const git=(args,options={})=>spawnSync('git',args,{cwd:root,encoding:'utf8',maxBuffer:64*1024*1024,...options});

const contract=JSON.parse(read('qa/phase-24i-village-panels/contract.json'));
const index=read('index.html'),phase17=read('src/phase17-runtime.js'),packageJson=JSON.parse(read('package.json'));

record('contract-is-exact-phase24i-village-panels',contract.contractVersion===1&&contract.phase==='24I'&&contract.authorityId==='everstead.phase24i.village-panels.v1'&&contract.schemaVersion===14);
record('contract-pins-exact-phase24h-predecessor',contract.predecessor.commit==='420c3c3da1619776b680d1455da9f804f615f4d1'&&contract.predecessor.indexSha256==='355bc95ad2c5d4581eac4cfbcf795d141d204dca5eff17a8dc9e978a2e876c85');
record('contract-locks-phone-matrix',contract.viewports.map(item=>`${item.width}x${item.height}`).join(',')==='320x568,390x844');
record('contract-locks-compact-limits',contract.limits.minimumTouchTargetPx===44&&contract.limits.openWidthPx===272&&contract.limits.smallPhoneOpenWidthPx===252&&contract.limits.openBodyViewportRatio===0.35);
record('contract-excludes-system-changes',contract.nonGoals.join(',')==='save-schema-change,storage-namespace-change,economy-change,progression-change,story-content-change');

const predecessor=git(['show',`${contract.predecessor.commit}:index.html`],{encoding:null});
record('predecessor-commit-is-reachable',git(['merge-base','--is-ancestor',contract.predecessor.commit,'HEAD']).status===0);
record('predecessor-index-has-frozen-identity',predecessor.status===0&&sha(predecessor.stdout)===contract.predecessor.indexSha256,{expected:contract.predecessor.indexSha256,actual:predecessor.status===0?sha(predecessor.stdout):predecessor.stderr?.toString()});

const changed=git(['diff','--name-only',contract.predecessor.commit,'--',...contract.ownedProductionFiles]).stdout.trim().split('\n').filter(Boolean).sort();
record('only-two-owned-production-files-change',JSON.stringify(changed)===JSON.stringify([...contract.ownedProductionFiles].sort()),changed);
record('storage-namespace-and-schema-remain-unchanged',index.includes("const NS='oathforge_new_world_proto_v01'")&&index.includes('CURRENT_SCHEMA_VERSION=14'));
record('release-version-remains-unchanged',packageJson.version===contract.releaseVersion&&index.includes(`RELEASE_VERSION='${contract.releaseVersion}'`));

record('production-is-native-collapsed-disclosure',index.includes('<details class="phase24i-village-panel phase24i-production-panel" name="everstead-village-panel" data-phase24i-panel="production">')&&index.includes('<summary aria-label="Toggle Village production">'));
record('phase13-waystone-is-native-collapsed-disclosure',index.includes('<details class="phase24i-village-panel phase24i-waystone-panel" name="everstead-village-panel" data-phase24i-panel="waystone">')&&index.includes('<summary aria-label="Toggle Waystone objective">'));
record('phase17-waystone-successor-is-collapsed-disclosure',phase17.includes('<details class="phase24i-village-panel phase24i-waystone-panel" name="everstead-village-panel" data-phase24i-panel="waystone">'));
record('no-panel-is-rendered-open-by-default',!index.includes('data-phase24i-panel="production" open')&&!index.includes('data-phase24i-panel="waystone" open')&&!phase17.includes('data-phase24i-panel="waystone" open'));
record('shared-details-name-enforces-one-open-panel',count(index,'name="everstead-village-panel"')===2&&count(phase17,'name="everstead-village-panel"')===1);

record('production-actions-remain-inside-panel',index.includes('data-village-production-total')&&index.includes('data-act="collect"')&&index.includes('data-fellow="${ff.id}"'));
record('phase13-waystone-action-remains-inside-panel',index.includes('data-phase13-objective-card')&&index.includes('data-phase13-objective>${objective.action'));
record('more-screen-waystone-action-remains-independent',index.includes('<button class="btn" data-phase13-objective>WAYSTONE</button>'));
record('phase17-removes-whole-predecessor-disclosure',phase17.includes('html=html.replace(/<details class="phase24i-village-panel phase24i-waystone-panel"[\\s\\S]*?<\\/details>/'));
record('waystone-and-production-remain-siblings',index.includes("return html.replace('<details class=\"phase24i-village-panel phase24i-production-panel\"',card+'<details class=\"phase24i-village-panel phase24i-production-panel\"')")&&phase17.includes("return html.replace('<details class=\"phase24i-village-panel phase24i-production-panel\"',`${note}${waystone}<details class=\"phase24i-village-panel phase24i-production-panel\"`)"));

record('summary-touch-target-is-44px',index.includes('.phase24i-village-panel>summary{')&&index.includes('min-height:44px'));
record('closed-width-is-content-sized',index.includes('width:max-content')&&index.includes('max-width:calc(100% - 16px)'));
record('open-width-is-capped',index.includes('.phase24i-village-panel[open]{width:min(272px,calc(100% - 16px))}')&&index.includes('width:min(252px,calc(100% - 16px))'));
record('open-bodies-are-height-capped-and-scrollable',index.includes('max-height:35dvh')&&index.includes('overflow:auto;overscroll-behavior:contain'));
record('closed-bodies-are-not-interactive',index.includes('.phase24i-village-panel:not([open])>.phase-13-objective')&&index.includes('.phase24i-village-panel:not([open])>.village-hud{display:none}'));
record('reduced-motion-is-honored',index.includes('@media(prefers-reduced-motion:reduce){.phase24i-village-panel,.phase24i-village-panel *{animation:none!important;transition:none!important}}'));
record('no-panel-state-enters-save-data',!/(phase24iPanel|villagePanelOpen|openVillagePanel)\s*[:=]/.test(index)&&!/(phase24iPanel|villagePanelOpen|openVillagePanel)\s*[:=]/.test(phase17));

for(const relative of ['README.md','RESULT.md','browser.mjs','verify.mjs']){
  const historical=git(['show',`${contract.predecessor.commit}:qa/phase-24h-preview-corrections/${relative}`],{encoding:null});
  record(`phase24h-evidence-remains-frozen-${relative}`,historical.status===0&&Buffer.compare(historical.stdout,bytes(`qa/phase-24h-preview-corrections/${relative}`))===0);
}

const expectedEntries=Object.entries(contract.expectedArtifacts||{});
record('artifact-freeze-populated',expectedEntries.length>=7,expectedEntries.map(([relative])=>relative));
for(const[relative,expected]of expectedEntries)record(`frozen-artifact-${relative}`,/^[0-9a-f]{64}$/.test(expected)&&fs.existsSync(path.join(root,relative))&&fileHash(relative)===expected,{expected,actual:fs.existsSync(path.join(root,relative))?fileHash(relative):null});

const failed=rows.filter(item=>!item.pass);
for(const item of rows)console.log(`${item.pass?'PASS':'FAIL'} ${item.id}${item.detail?` · ${item.detail}`:''}`);
console.log(`RESULT ${rows.length-failed.length} passed, ${failed.length} failed`);
if(failed.length)process.exitCode=1;
