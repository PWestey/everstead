import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {runEngineProbe} from '../phase-10c2/engine-probe.mjs';

const ROOT=resolve(new URL('../..',import.meta.url).pathname),nodeSource=readFileSync(resolve(ROOT,'qa/phase-10c2/engine-probe.mjs'),'utf8'),boundary=nodeSource.indexOf('export async function runEngineProbe');
if(boundary<0)throw new Error('Phase 10C-2 engine helper boundary missing');
const helperSource=nodeSource.slice(0,boundary).replace("import {simulateBundle} from '../phase-10b/simulate.mjs';\n",'').replace("const ROOT=resolve(new URL('../..',import.meta.url).pathname);",`const ROOT=${JSON.stringify(ROOT)};`)+"\nexport {phaseNineHarness,toolsFor,engineHarness,T0};\n",helpers=await import('data:text/javascript;base64,'+Buffer.from(helperSource).toString('base64')),phaseNine=await helpers.phaseNineHarness(),tools=await helpers.toolsFor(helpers.engineHarness(phaseNine)),html=readFileSync(resolve(ROOT,'index.html'),'utf8'),application=html.match(/<script>([\s\S]*?)<\/script>/)?.[1],source=tools.instrument(application),run=tools.runRealm({...tools.freshOptions,applicationSource:source,now:helpers.T0}),p=expression=>tools.internal(run,'p10c2.'+expression),clone=value=>structuredClone(value),same=(a,b)=>JSON.stringify(a)===JSON.stringify(b),rows=[],add=(id,pass,detail='')=>rows.push({id,pass:Boolean(pass),detail:typeof detail==='string'?detail:JSON.stringify(detail)});
if(!application||run.thrown)throw run.thrown||new Error('Everstead application unavailable');

const state=tools.active(run),elapsed=32*3600000,now=helpers.T0+elapsed;state.lastGoldAt=helpers.T0;state.familyDrops.eligibleAt=helpers.T0;state.companionTower.highestFloor=5;state.companionTower.idle.cursorAt=helpers.T0;state.companionTower.idle.segments=[];state.fellowExpedition.highestStage=4;state.fellowExpedition.idle.cursorAt=helpers.T0;state.fellowExpedition.idle.segments=[];p(`set(${JSON.stringify(state)})`);p(`accrue(true,${now})`);const after=p('state()'),tower=after.companionTower.idle,expedition=after.fellowExpedition.idle;
add('schema11-tower-cursor-advances',tower.cursorAt===now,tower.cursorAt);
add('schema11-expedition-cursor-advances',expedition.cursorAt===now,expedition.cursorAt);
add('schema11-tower-24h-cap',same(tower.segments,[{floor:5,elapsedMs:24*3600000}]),tower.segments);
add('schema11-expedition-24h-cap',same(expedition.segments,[{stage:4,elapsedMs:24*3600000}]),expedition.segments);
const beforeSecond={tower:clone(tower),expedition:clone(expedition)};p(`accrue(true,${now})`);const afterSecond=p('state()');add('same-time-second-settlement-zero',same(beforeSecond,{tower:afterSecond.companionTower.idle,expedition:afterSecond.fellowExpedition.idle}));
const future=clone(afterSecond),futureAt=now+3600000;future.companionTower.idle.cursorAt=futureAt;future.fellowExpedition.idle.cursorAt=futureAt;p(`set(${JSON.stringify(future)})`);p(`accrue(true,${now})`);const afterFuture=p('state()');add('future-idle-clocks-do-not-regress',afterFuture.companionTower.idle.cursorAt===futureAt&&afterFuture.fellowExpedition.idle.cursorAt===futureAt);
add('idle-probe-native-storage-zero',run.nativeCalls.length===0,run.nativeCalls);

const predecessor=await runEngineProbe(),failures=predecessor.rows.filter(row=>!row.pass);add('phase10c2-single-explicit-supersession',failures.length===1&&failures[0].id==='idle-cursors-independent-from-gold',failures.map(row=>row.id));
const passed=rows.filter(row=>row.pass).length;for(const row of rows)console.log(`${row.pass?'PASS':'FAIL'} ${row.id}${row.detail?` · ${row.detail}`:''}`);console.log(`Phase 11B idle prerequisite probe: ${passed}/${rows.length}`);if(passed!==rows.length)process.exitCode=1;
