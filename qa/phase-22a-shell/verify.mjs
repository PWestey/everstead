import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {existsSync,readFileSync,readdirSync,statSync} from 'node:fs';
import {resolve} from 'node:path';

const ROOT=resolve(new URL('../..',import.meta.url).pathname),QA=resolve(ROOT,'qa/phase-22a-shell'),rows=[];
const read=path=>readFileSync(resolve(ROOT,path)),text=path=>read(path).toString('utf8'),json=path=>JSON.parse(text(path)),sha=value=>createHash('sha256').update(value).digest('hex'),same=(a,b)=>JSON.stringify(a)===JSON.stringify(b),record=(id,pass,detail='')=>rows.push({id,pass:Boolean(pass),detail:typeof detail==='string'?detail:JSON.stringify(detail)});
const filesBelow=(directory,prefix='')=>readdirSync(directory).flatMap(name=>{const absolute=resolve(directory,name),path=prefix?`${prefix}/${name}`:name;return statSync(absolute).isDirectory()?filesBelow(absolute,path):[path]}).sort();
const git=(args,options={})=>spawnSync('git',args,{cwd:ROOT,encoding:'utf8',maxBuffer:64*1024*1024,...options});
const f=json('qa/phase-22a-shell/fixtures/contract.json'),index=text('index.html'),css=text(f.stylesheet),normalized=index.replace(f.stylesheetInclude,''),source=git(['rev-parse',f.sourceCommit]),sourceAncestor=git(['merge-base','--is-ancestor',f.sourceCommit,'HEAD']),productionDelta=git(['diff','--name-only',`${f.baseCommit}..${f.sourceCommit}`]),sourceIndex=git(['show',`${f.sourceCommit}:index.html`],{encoding:null}),sourceCss=git(['show',`${f.sourceCommit}:${f.stylesheet}`],{encoding:null});
const block=selector=>{const start=css.indexOf(selector);if(start<0)return'';const end=css.indexOf('}',start);return end<0?'':css.slice(start,end+1)};

record('package-topology',same(filesBelow(QA),['README.md','fixtures/contract.json','verify.mjs']),filesBelow(QA));
record('phase22a-source-commit-is-reachable',source.status===0&&source.stdout.trim()===f.sourceCommit&&sourceAncestor.status===0,source.stdout.trim());
record('contract-retargets-current-bridge',f.contractVersion===2&&f.phase==='22A'&&f.bridgeVersion==='phase-20-21-independent-qa-v2');
record('exact-committed-production-delta',productionDelta.status===0&&same(productionDelta.stdout.trim().split('\n').filter(Boolean),['index.html',f.stylesheet]),productionDelta.stdout.trim());
record('working-production-matches-source-commit',sourceIndex.status===0&&sourceCss.status===0&&sourceIndex.stdout.toString('hex')===read('index.html').toString('hex')&&sourceCss.stdout.toString('hex')===read(f.stylesheet).toString('hex'));
record('single-cache-versioned-stylesheet-include',index.split(f.stylesheetInclude).length===2&&index.indexOf(f.stylesheetInclude)>index.lastIndexOf('</style>')&&index.indexOf(f.stylesheetInclude)<index.indexOf('</head>')&&f.stylesheetHref.endsWith(`?v=${f.stylesheetVersion}`));
record('normalized-index-is-exact-current-tip',Buffer.byteLength(normalized)===f.baseIndexBytes&&sha(normalized)===f.baseIndexSha256,{bytes:Buffer.byteLength(normalized),sha256:sha(normalized)});
record('stylesheet-source-identity',Buffer.byteLength(css)===f.stylesheetBytes&&sha(css)===f.stylesheetSha256,{bytes:Buffer.byteLength(css),sha256:sha(css)});
const predecessorFailures=Object.entries(f.productionSources).filter(([path,expected])=>!existsSync(resolve(ROOT,path))||sha(read(path))!==expected||git(['show',`${f.sourceCommit}:${path}`],{encoding:null}).stdout?.toString('hex')!==read(path).toString('hex')).map(([path])=>path);
record('phase20-21-bridge-and-presentation-byte-frozen',predecessorFailures.length===0,predecessorFailures);
record('stylesheet-has-no-code-network-or-reference-ingestion',!/@import\b|@font-face\b|url\s*\(|javascript:|https?:\/\/|IMG_70\d\d|checkerboard|reference-game|isekai/i.test(css));

record('exact-five-navigation-source-preserved',index.includes("const items=[['village','⌂','Village'],['oaths','✓','Oaths'],['fellows','♙','Fellowship'],['adventure','⌁','Adventure'],['more','•••','More']]")&&same(f.navigation,['village','oaths','fellows','adventure','more']));
record('minimum-44px-target-contract',f.minimumTargetPx===44&&css.includes('--es-target: 44px')&&css.includes('min-height: var(--es-target)')&&css.includes('min-width: var(--es-target)')&&block('.bottom-nav button {').includes('min-height: 54px'));
record('visible-focus-and-disabled-truth',css.includes(':where(button, a, input, select, textarea, [tabindex]):focus-visible')&&css.includes('outline: 3px solid var(--es-focus)')&&block('button:disabled,').includes('opacity: 1')&&block('button:disabled,').includes('border-style: dashed'));
const truth=Object.entries(f.truthStates).map(([state,label])=>{const rule=block(`.phase15-hotspot[data-phase15-state="ready"][data-phase20-21-board-state="${state}"]::after`);return{state,label,rule,pass:rule.includes(`content: "${label}"`)&&rule.includes('background:')}});
record('phase20-ready-active-claim-distinct-truth',truth.every(item=>item.pass)&&new Set(truth.map(item=>item.label)).size===3,truth);
record('phase20-ready-active-claim-distinct-shape-color',Object.keys(f.truthStates).every(state=>{const rule=block(`.phase15-hotspot[data-phase15-state="ready"][data-phase20-21-board-state="${state}"] {`);return rule.includes('border-color:')&&rule.includes('background:')&&rule.includes('box-shadow:')}));
record('overflow-copy-and-cta-clearance-source-contract',['overflow-wrap: anywhere','min-width: 0','scroll-padding-bottom: var(--es-shell-bottom)','.screen:not(.village-screen)'].every(value=>css.includes(value)));
record('all-required-responsive-breakpoints',css.includes('@media (max-width: 420px)')&&css.includes('@media (max-width: 360px)')&&css.includes('@media (min-width: 760px)')&&f.viewports.length===7&&same(f.viewports.slice(0,5).map(v=>[v.width,v.height]),[[320,568],[390,844],[430,932],[768,1024],[1024,768]])&&f.viewports.some(v=>v.copyScale===1.3));
record('reduced-motion-real-css-contract',css.includes('@media (prefers-reduced-motion: reduce)')&&css.includes('html.phase15-reduced-motion .screen')&&css.includes('animation: none !important')&&css.includes('transition: none !important')&&f.viewports.some(v=>v.reducedMotion));
record('inactive-production-remains-closed',f.publicRelease===false&&index.includes('publicReleaseAllowed:false')&&text('src/phase20-21-facilities.js').includes('publicRelease:false')&&text('src/phase20-21-facilities.js').includes('productionEnabled:false'));

const passed=rows.filter(row=>row.pass).length,failed=rows.length-passed;for(const row of rows)console.log(`${row.pass?'PASS':'FAIL'} ${row.id}${row.detail?` — ${row.detail}`:''}`);console.log(`RESULT ${passed} passed, ${failed} failed`);process.exitCode=failed?1:0;
