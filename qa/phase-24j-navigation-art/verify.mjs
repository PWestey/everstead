import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'../..');
const contract=JSON.parse(fs.readFileSync(path.join(here,'contract.json'),'utf8'));
const rows=[];
const bytes=relative=>fs.readFileSync(path.join(root,relative));
const read=relative=>bytes(relative).toString('utf8');
const sha=value=>crypto.createHash('sha256').update(value).digest('hex');
const record=(id,pass,detail='')=>rows.push({id,pass:Boolean(pass),detail:typeof detail==='string'?detail:JSON.stringify(detail)});
const git=(args,options={})=>spawnSync('git',args,{cwd:root,encoding:'utf8',maxBuffer:64*1024*1024,...options});
const block=(source,selector)=>{const start=source.indexOf(selector);if(start<0)return'';const open=source.indexOf('{',start);if(open<0)return'';let depth=0;for(let index=open;index<source.length;index++){if(source[index]==='{')depth++;else if(source[index]==='}'&&--depth===0)return source.slice(start,index+1)}return''};
const png=relative=>{const value=bytes(relative),signature=value.subarray(0,8).toString('hex');return{signature,width:value.readUInt32BE(16),height:value.readUInt32BE(20),bitDepth:value[24],colorType:value[25],bytes:value.length}};

const index=read('index.html');
const css=read('src/phase24j-navigation-art.css');
const phase24jInclude='<!-- Phase 24J navigation art styles BEGIN -->\n<link rel="stylesheet" href="src/phase24j-navigation-art.css?v=phase24j-v1">\n<!-- Phase 24J navigation art styles END -->\n';
const routes=contract.routes.map(item=>item.id);
const assets=[...contract.routes.map(item=>item.asset),contract.housingAsset];

record('contract-is-exact-phase24j-navigation-art',contract.contractVersion===1&&contract.phase==='24J'&&contract.authorityId==='everstead.phase24j.navigation-art.v1'&&contract.schemaVersion===14);
record('contract-pins-phase24i-predecessor',contract.predecessor.commit==='5a01e815e6b0af3c90feed798a171167ebc2b76a'&&contract.predecessor.indexSha256==='806eed3d90c2a580d929bf11b29356d893aafb75e780b7781831b1e2dea73a49');
record('contract-locks-required-phone-matrix',contract.viewports.map(item=>`${item.width}x${item.height}`).join(',')==='320x568,390x844');
record('contract-locks-exact-five-routes',JSON.stringify(routes)===JSON.stringify(['village','oaths','fellows','adventure','more']));
record('contract-excludes-system-changes',contract.nonGoals.join(',')==='save-schema-change,storage-namespace-change,navigation-route-change,economy-change,progression-change,story-change');

const predecessor=git(['show',`${contract.predecessor.commit}:index.html`],{encoding:null});
record('predecessor-commit-is-reachable',git(['merge-base','--is-ancestor',contract.predecessor.commit,'HEAD']).status===0);
record('predecessor-index-has-frozen-identity',predecessor.status===0&&sha(predecessor.stdout)===contract.predecessor.indexSha256,{expected:contract.predecessor.indexSha256,actual:predecessor.status===0?sha(predecessor.stdout):predecessor.stderr?.toString()});
record('index-change-is-css-include-only',index.includes(phase24jInclude)&&predecessor.status===0&&Buffer.compare(Buffer.from(index.replace(phase24jInclude,'')),predecessor.stdout)===0);
record('storage-and-release-identities-unchanged',index.includes("const NS='oathforge_new_world_proto_v01'")&&index.includes('CURRENT_SCHEMA_VERSION=14')&&index.includes("RELEASE_VERSION='1.0.0-preview.1'"));

record('navigation-art-is-css-only',!/<(?:img|picture|svg)[^>]*data-nav/i.test(index)&&!css.includes('<img')&&contract.routes.every(item=>css.includes(`button[data-nav="${item.id}"] i::before`)));
record('five-route-source-markup-remains-compatible',index.includes("const items=[['village','⌂','Village'],['oaths','✓','Oaths'],['fellows','♙','Fellowship'],['adventure','⌁','Adventure'],['more','•••','More']"));
record('adventure-badge-injection-remains-compatible',index.includes('/(<button data-nav="adventure"[^>]*><i>⌁<\\/i>)ADVENTURE(<\\/button>)/')&&index.includes('phase-11c-nav-badge'));
record('decorative-layers-never-capture-input',block(css,'.bottom-nav::before').includes('pointer-events: none')&&block(css,'.bottom-nav button i::before').includes('pointer-events: none'));
record('housing-has-painted-and-solid-fallbacks',block(css,'.bottom-nav {').includes('linear-gradient(')&&block(css,'.bottom-nav {').includes('url("../assets/ui/navigation/nav-frame.png")')&&block(css,'.bottom-nav {').includes('#06111b'));
record('fallback-glyphs-and-labels-remain-real-text',contract.routes.every(item=>index.includes(`'${item.id}','${item.glyph}'`)&&index.includes(`'${item.label[0]}${item.label.slice(1).toLowerCase()}'`)));
record('active-state-has-non-color-shape',css.includes('.bottom-nav button.on i::before')&&css.includes('transform: scale(1.04) translateY(-1px)')&&css.includes('.bottom-nav button.on::after')&&css.includes('width: 25px'));
record('adventure-ready-badge-stays-above-art',block(css,'.bottom-nav .phase-11c-nav-badge').includes('z-index: 3'));
record('normal-and-user-reduced-motion-covered',css.includes('@media (prefers-reduced-motion: reduce)')&&css.includes('html.phase15-reduced-motion .bottom-nav button i::before')&&css.match(/transition: none !important/g)?.length>=2);
record('forced-colors-removes-decorative-art',css.includes('@media (forced-colors: active)')&&css.includes('.bottom-nav::before,')&&css.includes('.bottom-nav button i::before')&&css.includes('display: none'));
record('art-css-has-no-external-network-reference',!/(?:https?:)?\/\//i.test(css));
record('art-css-has-no-save-or-gameplay-authority',!/(localStorage|sessionStorage|schemaVersion|saveMeta|pendingGold|power\s*[:=]|reward\s*[:=])/i.test(css));

for(const item of contract.routes){
  const info=png(item.asset),expected=`url("../${item.asset}")`;
  record(`asset-${item.id}-is-local-high-resolution-rgba-png`,info.signature==='89504e470d0a1a0a'&&info.width>=contract.limits.minimumIconSourcePx&&info.height>=contract.limits.minimumIconSourcePx&&info.bitDepth===8&&info.colorType===6&&info.bytes<=contract.limits.maximumAssetBytes,info);
  record(`asset-${item.id}-is-bound-to-exact-route`,block(css,`.bottom-nav button[data-nav="${item.id}"] i::before`).includes(expected),expected);
}

const housing=png(contract.housingAsset);
record('housing-is-local-wide-rgb-png',housing.signature==='89504e470d0a1a0a'&&housing.width>=1024&&housing.height>=200&&housing.width>housing.height*4&&housing.bitDepth===8&&[2,6].includes(housing.colorType)&&housing.bytes<=contract.limits.maximumAssetBytes,housing);
record('total-navigation-art-budget',assets.reduce((sum,relative)=>sum+bytes(relative).length,0)<=contract.limits.maximumTotalAssetBytes,{bytes:assets.reduce((sum,relative)=>sum+bytes(relative).length,0),limit:contract.limits.maximumTotalAssetBytes});

const expectedEntries=Object.entries(contract.expectedArtifacts||{});
record('artifact-freeze-is-populated',expectedEntries.length>=15,expectedEntries.map(([relative])=>relative));
for(const[relative,expected]of expectedEntries)record(`frozen-artifact-${relative}`,/^[0-9a-f]{64}$/.test(expected)&&fs.existsSync(path.join(root,relative))&&sha(bytes(relative))===expected,{expected,actual:fs.existsSync(path.join(root,relative))?sha(bytes(relative)):null});

const failed=rows.filter(item=>!item.pass);
for(const item of rows)console.log(`${item.pass?'PASS':'FAIL'} ${item.id}${item.detail?` · ${item.detail}`:''}`);
console.log(`RESULT ${rows.length-failed.length} passed, ${failed.length} failed`);
if(failed.length)process.exitCode=1;
