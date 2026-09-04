import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'../..');
const contract=JSON.parse(fs.readFileSync(path.join(here,'contract.json'),'utf8'));
const rows=[];
const read=relative=>fs.readFileSync(path.join(root,relative));
const text=relative=>read(relative).toString('utf8');
const sha=value=>crypto.createHash('sha256').update(value).digest('hex');
const record=(id,pass,detail='')=>rows.push({id,pass:Boolean(pass),detail:typeof detail==='string'?detail:JSON.stringify(detail)});
const git=args=>spawnSync('git',args,{cwd:root,encoding:null,maxBuffer:64*1024*1024});

const index=text('index.html'),runtime=text('src/phase24k-screen-art.js'),css=text('src/phase24k-screen-art.css');
const assets=Object.values(contract.assets),newAssets=[contract.assets.fellowship,contract.assets.adventure,contract.assets.campaignWayfarer];
const predecessor=git(['show',`${contract.predecessor.commit}:index.html`]);
const head='<!-- Phase 24K art-first screens BEGIN -->\n<link rel="stylesheet" href="src/phase24k-screen-art.css?v=phase24k-v1">\n<!-- Phase 24K art-first screens END -->\n';
const script='  <script src="src/phase24k-screen-art.js?v=phase24k-v1"></script>\n';
const install=/\/\* Phase 24K art-first screen ownership BEGIN \*\/[\s\S]*?\/\* Phase 24K art-first screen ownership END \*\/\n/;

record('exact-contract',contract.contractVersion===1&&contract.phase==='24K'&&contract.authorityId==='everstead.phase24k.screen-art.v1'&&contract.schemaVersion===14);
record('predecessor-is-ancestor',git(['merge-base','--is-ancestor',contract.predecessor.commit,'HEAD']).status===0);
record('predecessor-index-is-frozen',predecessor.status===0&&sha(predecessor.stdout)===contract.predecessor.indexSha256,{expected:contract.predecessor.indexSha256,actual:predecessor.status===0?sha(predecessor.stdout):null});
const stripped=index.replace(head,'').replace(script,'').replace(install,'');
record('index-change-is-additive-presentation-install',predecessor.status===0&&Buffer.compare(Buffer.from(stripped),predecessor.stdout)===0);
record('save-release-identities-unchanged',index.includes("const NS='oathforge_new_world_proto_v01'")&&index.includes('CURRENT_SCHEMA_VERSION=14')&&index.includes("RELEASE_VERSION='1.0.0-preview.1'"));
record('runtime-installs-late-current-schema-owner',index.indexOf('Phase 24K art-first screen ownership BEGIN')>index.indexOf('Phase 24E current-schema shell ownership END')&&runtime.includes("const SCHEMA_VERSION=14")&&runtime.includes("const ID='everstead.phase24k.screen-art.v1'"));
record('presentation-runtime-has-no-storage-authority',!/(localStorage|sessionStorage|setItem|removeItem|saveMeta|mutatePersisted|commitPrepared)/.test(runtime));
record('village-control-is-session-only-and-paired',runtime.includes('let villageSpeakerVisible=true')&&runtime.includes('data-phase24k-speaker-hide')&&runtime.includes('data-phase24k-speaker-show')&&runtime.includes('speech.hidden=!villageSpeakerVisible')&&runtime.includes('character.hidden=!villageSpeakerVisible'));
record('wayfarer-remains-non-roster-and-full-art',runtime.includes("data-player-roster-member','false'")&&runtime.includes('data-phase24k-wayfarer-profile-art')&&runtime.includes(contract.assets.profileWayfarer)&&runtime.includes(contract.assets.campaignWayfarer));
record('fellowship-preserves-roster-hooks',runtime.includes('data-fellow=')&&runtime.includes('data-phase24k-panel-toggle')&&!runtime.includes('data-roster=')&&index.includes('data-roster="relics"'));
record('campaign-preserves-stage-and-player-hooks',runtime.includes("html.includes('data-campaign-stage')")&&runtime.includes('data-player-profile')&&index.includes('data-campaign-run'));
record('all-art-is-local',assets.every(asset=>fs.existsSync(path.join(root,asset)))&&!/(?:https?:)?\/\//i.test(css));
record('all-new-art-is-referenced',newAssets.every(asset=>runtime.includes(asset)||css.includes(`../${asset}`)),newAssets);
record('new-art-budget',newAssets.reduce((sum,asset)=>sum+read(asset).length,0)<=contract.limits.maximumNewArtBytes,{bytes:newAssets.reduce((sum,asset)=>sum+read(asset).length,0),limit:contract.limits.maximumNewArtBytes});
const png=read(contract.assets.campaignWayfarer);
record('campaign-wayfarer-is-rgba-png',png.subarray(0,8).toString('hex')==='89504e470d0a1a0a'&&png.readUInt32BE(16)===1024&&png.readUInt32BE(20)===1536&&png[25]===6,{width:png.readUInt32BE(16),height:png.readUInt32BE(20),colorType:png[25]});
record('profile-wayfarer-source-is-unchanged',sha(read(contract.assets.profileWayfarer))==='a34c2d3a858f46be58450048b77c53965d4644690c2eb9a9c7649bd1b5139aaf');
record('touch-and-reduced-motion-contracts-exist',css.includes('min-width:44px')&&css.includes('min-height:44px')&&css.includes('@media(prefers-reduced-motion:reduce)')&&css.includes('html.phase15-reduced-motion'));
record('art-fallbacks-exist',runtime.includes("art.dataset.imageState='fallback'")&&runtime.includes("data-wayfarer-image-state','fallback'")&&css.includes('[data-image-state="fallback"]'));

const failed=rows.filter(row=>!row.pass);
for(const row of rows)console.log(`${row.pass?'PASS':'FAIL'} ${row.id}${row.detail?` · ${row.detail}`:''}`);
console.log(`RESULT ${rows.length-failed.length} passed, ${failed.length} failed`);
if(failed.length)process.exitCode=1;
