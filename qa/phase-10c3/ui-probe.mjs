import fs from 'node:fs';
import vm from 'node:vm';

const source=fs.readFileSync(new URL('../../index.html',import.meta.url),'utf8');
const lineContaining=needle=>{const line=source.split('\n').find(item=>item.includes(needle));if(!line)throw new Error(`Missing source line: ${needle}`);return line};
const section=(start,end)=>{const a=source.indexOf(start),b=source.indexOf(end,a);if(a<0||b<0)throw new Error(`Missing source section: ${start}`);return source.slice(a,b)};
const rows=[];
const add=(id,actual,detail='')=>rows.push({id,actual:Boolean(actual),expected:true,pass:Boolean(actual),detail:String(detail)});
const plain=html=>String(html).replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();

function previewProbe(){
  const code=section('function phaseTenCThreeBuildingUpgradePreview','\nconst report=load()');
  let clockCalls=0,rateCalls=[];
  const context={runtimeNow:()=>{clockCalls++;return 1787853600000},clone:value=>structuredClone(value),ECONOMY_CONFIG:{buildingLevelCap:52},buildingRateComponents:(id,state,at)=>{rateCalls.push({id,level:state.buildings[id].level,at});const level=state.buildings[id].level;return{rate:level*100,upgradeCost:level===51?703356519:15000,levelMultiplier:level,familyAssignmentMultiplier:1,fellowRosterMultiplier:1,companionRosterMultiplier:1,oathMultiplier:1,familyAssignment:{familyId:null,familyName:null,baseBonus:0,intimacyBonus:0,rarityBonus:0,specialtyBonus:0}}}};
  vm.runInNewContext(code,context);
  const run=(level,gold)=>{clockCalls=0;rateCalls=[];const state={gold,buildings:{training:{level}}},before=structuredClone(state),result=context.phaseTenCThreeBuildingUpgradePreview('training',state);return{result,before,state,clockCalls,rateCalls}};
  const fresh=run(1,50000),short=run(1,14000),l51=run(51,8000000000),l52=run(52,8000000000);
  add('preview-fresh-one-clock',fresh.clockCalls===1&&fresh.rateCalls.length===2&&fresh.rateCalls.every(call=>call.at===1787853600000),JSON.stringify(fresh.rateCalls));
  add('preview-pure-no-mutation',JSON.stringify(fresh.before)===JSON.stringify(fresh.state));
  add('preview-affordable',fresh.result.currentLevel===1&&fresh.result.nextLevel===2&&fresh.result.cost===15000&&fresh.result.gain===100&&fresh.result.affordable&&fresh.result.shortage===0);
  add('preview-unaffordable',!short.result.affordable&&short.result.shortage===1000&&short.result.cost===15000);
  add('preview-level51',l51.result.currentLevel===51&&l51.result.nextLevel===52&&l51.result.cost===703356519&&l51.result.affordable&&!l51.result.atCap);
  add('preview-level52-cap',l52.result.atCap&&l52.result.next===null&&l52.result.cost===null&&l52.rateCalls.length===1);
}

function villageProbe(){
  const at=1787853600000,calls=[];
  const context={runtimeNow:()=>{calls.push(['clock']);return at},totalRate:(state,time)=>{calls.push(['total',time]);return 1000},buildingRateComponents:(id,state,time)=>{calls.push([id,time]);return{rate:250,familyAssignment:{familyName:id==='training'?'Evelyn Hart':null},oathBoost:id==='training'?.05:0}},dayKey:date=>'2026-08-27',runtimeDate:time=>new Date(time),fmt:value=>String(value),BUILDING_DEFS:[['training','Training Hall'],['archive','Archive'],['market','Market'],['watch','Watchtower']].map(([id,name],index)=>({id,name,spot:`p${index}`})),S:{featured:'cael',buildings:{training:{boostDay:null,boost:0},archive:{boostDay:null,boost:0},market:{boostDay:null,boost:0},watch:{boostDay:null,boost:0}}},fellow:()=>({quote:'Ready',idx:0,name:'Cael',title:'Vanguard',id:'cael'}),power:()=>100,atlas:()=>'',esc:value=>String(value)};
  vm.runInNewContext(lineContaining('function villageScreen()'),context);const html=context.villageScreen();
  add('village-one-timestamp',calls.filter(call=>call[0]==='clock').length===1&&calls.filter(call=>call.length===2).every(call=>call[1]===at),JSON.stringify(calls));
  const labels=[...html.matchAll(/aria-label="([^"]+)"/g)].map(match=>match[1]),hotspotLabels=labels.filter(label=>!label.startsWith('Village production'));add('hotspot-accessible-labels',(html.match(/class="building-hotspot/g)||[]).length===4&&hotspotLabels.length===4&&hotspotLabels.every(label=>label.includes('Gold per hour'))&&hotspotLabels.some(label=>label.includes('Evelyn Hart assigned'))&&hotspotLabels.some(label=>label.includes('Oath bonus 5 percent')),labels.join('|'));
  add('aggregate-hud-accessible-label',html.includes('data-village-production-total aria-label="Village production, 1000 Gold per hour"'));
}

function modalProbe(){
  let captured='';
  const preview={currentLevel:1,nextLevel:2,current:{rate:100,levelMultiplier:1,familyAssignmentMultiplier:1.25,fellowRosterMultiplier:1.015,companionRosterMultiplier:1.0075,oathMultiplier:1.05,familyAssignment:{familyId:'evelyn',familyName:'Evelyn Hart',baseBonus:.1,intimacyBonus:.05,rarityBonus:.03,specialtyBonus:.07}},next:{rate:140},gain:40,cost:15000,shortage:0,affordable:true,atCap:false};
  const context={BUILDING_DEFS:[{id:'training',name:'Training Hall',domain:'training'}],FAMILY_DEFS:[{id:'evelyn',name:'Evelyn Hart'}],FAMILY_CONFIG:{specialties:{evelyn:'training'}},phaseTenCThreeBuildingUpgradePreview:()=>preview,showModal:html=>{captured=html},fmt:value=>Number(value).toLocaleString('en-US')};
  vm.runInNewContext(lineContaining('function openBuilding(id)'),context);context.openBuilding('training');
  const labels=[...captured.matchAll(/<span>([^<]+)<\/span>/g)].map(match=>match[1]);
  add('modal-six-authoritative-factors',['Building level','Family','Fellow roster','Companion roster','Oaths','Final Gold/hr'].every(label=>labels.includes(label))&&(captured.match(/data-building-production-details/g)||[]).length===1,labels.join('|'));
  add('modal-current-next-gain-cost',plain(captured).includes('Level 1 → Level 2')&&labels.includes('Current Gold/hr')&&labels.includes('Next Gold/hr')&&labels.includes('Gain Gold/hr')&&plain(captured).includes('UPGRADE TO LEVEL 2 · 15,000 GOLD'));
  preview.gold=0;preview.shortage=1000;preview.affordable=false;context.openBuilding('training');
  add('modal-shortage-reason',plain(captured).includes('Need 1,000 more Gold.')&&/data-modal-act="upgrade-building"[^>]*disabled/.test(captured));
  preview.currentLevel=52;preview.nextLevel=null;preview.next=null;preview.cost=null;preview.shortage=0;preview.atCap=true;context.openBuilding('training');
  add('modal-cap-reason',plain(captured).includes('Maximum level reached.')&&plain(captured).includes('MAXIMUM LEVEL'));
}

function summaryProbe(){
  const common={S:{ui:{roster:'companions'}},FELLOW_MIGHT_CONFIG:{levelCap:50},phaseTenCTwoRosterBonus:type=>({multiplier:type==='companion'?1.0123:1.0456,power:1234}),fmt:value=>String(value),companionMasteryComponents:()=>({level:2,multiplier:1.1,points:9}),fellowMightComponents:()=>({level:2,multiplier:1.1,points:9,threshold:0,nextThreshold:10}),rosterScreen:()=>'<section class="roster-grid"></section>'};
  const companion=vm.createContext({...common});vm.runInContext(lineContaining('const rosterScreenThroughFive=rosterScreen'),companion);const companionHtml=companion.rosterScreen();
  add('companion-summary-exactly-once',(companionHtml.match(/data-village-roster-multiplier="companion"/g)||[]).length===1&&plain(companionHtml).includes('owned Companion Power strengthens every Building'));
  const fellowContext=vm.createContext({...common,S:{ui:{roster:'fellows'}},rosterScreenThroughSix:()=>'<section class="roster-grid"></section>'});vm.runInContext(lineContaining("rosterScreen=function(){const html=rosterScreenThroughSix()"),fellowContext);const fellowHtml=fellowContext.rosterScreen();
  add('fellow-summary-exactly-once',(fellowHtml.match(/data-village-roster-multiplier="fellow"/g)||[]).length===1&&plain(fellowHtml).includes('owned Fellow Power strengthens every Building'));
}

function offlineProbe(){
  let captured='';const context={FAMILY_DEFS:[{id:'evelyn',name:'Evelyn'}],showModal:html=>{captured=html},fmt:value=>String(value),$:()=>null};
  vm.runInNewContext(lineContaining('function openOffline(r)'),context);context.openOffline({elapsed:7200000,total:1000,lines:[{name:'Training Hall',value:1000}],drops:{rolls:8,gifts:0,shards:{evelyn:0}}});
  add('offline-player-copy',plain(captured).includes('Offline Village rewards · up to 24 hours')&&plain(captured).includes('hours of Village production')&&!captured.includes('Timestamp-based'));
  add('offline-total-exactly-once',(captured.match(/data-offline-gold-total/g)||[]).length===1&&plain(captured).includes('Offline Gold +1000 Gold'));
}

function toastProbe(){
  const writes=[],timers=new Map();let id=0,value='';const status={isConnected:true,get textContent(){return value},set textContent(next){value=next;writes.push(next)}},toastNode={innerHTML:'',classList:{add(){},remove(){}}},context={$:selector=>selector==='#toast'?toastNode:status,runtimeClearTimeout:key=>timers.delete(key),runtimeSetTimeout:(fn,delay)=>{const key=++id;timers.set(key,{fn,delay});return key},esc:value=>String(value)};
  vm.runInNewContext(lineContaining('let toastTimer,statusTimer;function toast'),context);const flush=()=>{for(const [key,timer] of [...timers])if(timer.delay===0){timers.delete(key);timer.fn()}};
  context.toast('Same message');flush();context.toast('Same message');flush();
  add('repeated-status-announced',writes.join('|')==='|Same message||Same message',JSON.stringify(writes));const before=writes.length;context.toast('Undo available',true);flush();
  add('undo-excluded-from-status',writes.length===before&&toastNode.innerHTML.includes('UNDO'),JSON.stringify(writes));
}

export function runUiProbe(){previewProbe();villageProbe();modalProbe();summaryProbe();offlineProbe();toastProbe();return{rows,evidence:{total:rows.length,passed:rows.filter(row=>row.pass).length,failed:rows.filter(row=>!row.pass).length}}}

if(import.meta.url===`file://${process.argv[1]}`){const result=runUiProbe();for(const row of result.rows)console.log(`${row.pass?'PASS':'FAIL'} ${row.id}${row.detail?` · ${row.detail}`:''}`);console.log(`Phase 10C-3 UI probe: ${result.evidence.passed}/${result.evidence.total}`);if(result.evidence.failed)process.exitCode=1}
