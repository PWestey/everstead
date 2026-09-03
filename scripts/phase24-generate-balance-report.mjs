#!/usr/bin/env node

import {spawn} from 'node:child_process';
import {createHash} from 'node:crypto';
import {access,mkdir,mkdtemp,readFile,rm,stat,writeFile} from 'node:fs/promises';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const scriptPath=fileURLToPath(import.meta.url);
const root=path.resolve(path.dirname(scriptPath),'..');
const recipePath=path.join(root,'qa/phase-24-baseline/fixtures/recipes.json');
const reportDir=path.join(root,'qa/phase-24-baseline/reports');
const jsonPath=path.join(reportDir,'phase24a-balance-report.json');
const markdownPath=path.join(reportDir,'phase24a-balance-report.md');
const checkOnly=process.argv.includes('--check');
const expectedIds=[
  'phase24a.fresh.schema13.v1',
  'phase24a.migrated-established.schema13.v1',
  'phase24a.true-high-investment.schema13.v1'
];

function invariant(condition,message){
  if(!condition)throw new Error(message);
}

function stable(value){
  if(Array.isArray(value))return value.map(stable);
  if(value&&typeof value==='object')return Object.fromEntries(Object.keys(value).sort().map(key=>[key,stable(value[key])]));
  return value;
}

function serialize(value){
  return `${JSON.stringify(stable(value),null,2)}\n`;
}

function sha(value){
  const bytes=typeof value==='string'||Buffer.isBuffer(value)?value:serialize(value);
  return createHash('sha256').update(bytes).digest('hex');
}

function near(actual,expected,epsilon=1e-10){
  return typeof actual==='number'&&Number.isFinite(actual)&&Math.abs(actual-expected)<=epsilon*Math.max(1,Math.abs(actual),Math.abs(expected));
}

function inspectNumbers(value,pointer='$',result={count:0,integerCount:0,maxAbsInteger:0,maxAbsNumber:0}){
  if(typeof value==='number'){
    invariant(Number.isFinite(value),`${pointer} is not finite`);
    invariant(Math.abs(value)<=Number.MAX_SAFE_INTEGER,`${pointer} exceeds safe numeric precision`);
    result.count++;
    result.maxAbsNumber=Math.max(result.maxAbsNumber,Math.abs(value));
    if(Number.isInteger(value)){
      invariant(Number.isSafeInteger(value),`${pointer} is not a safe integer`);
      result.integerCount++;
      result.maxAbsInteger=Math.max(result.maxAbsInteger,Math.abs(value));
    }
    return result;
  }
  if(Array.isArray(value))value.forEach((item,index)=>inspectNumbers(item,`${pointer}[${index}]`,result));
  else if(value&&typeof value==='object')for(const [key,item] of Object.entries(value))inspectNumbers(item,`${pointer}.${key}`,result);
  return result;
}

function gameplayNumbers(value,pointer='$',result={count:0,integerCount:0,maxAbsInteger:0,maxAbsNumber:0}){
  if(typeof value==='number')return inspectNumbers(value,pointer,result);
  if(Array.isArray(value))value.forEach((item,index)=>gameplayNumbers(item,`${pointer}[${index}]`,result));
  else if(value&&typeof value==='object')for(const [key,item] of Object.entries(value)){
    if(key==='safeIntegerAudit'||key==='frozenNow'||key==='at'||key.endsWith('At')||key.endsWith('Ms'))continue;
    gameplayNumbers(item,`${pointer}.${key}`,result);
  }
  return result;
}

function building(report,id){
  return report?.economy?.buildings?.find(row=>row.id===id);
}

function exactKeys(value,keys){
  return Boolean(value)&&typeof value==='object'&&!Array.isArray(value)&&JSON.stringify(Object.keys(value).sort())===JSON.stringify([...keys].sort());
}

function verifyAnchors(report,recipe){
  const anchor=recipe.expectedAnchors||{};
  invariant(report?.profileId===recipe.id,`${recipe.id}: report identity changed`);
  invariant(report?.schemaVersion===13,`${recipe.id}: schema is not 13`);
  invariant(report?.inputs?.persisted===recipe.persisted,`${recipe.id}: persisted/non-persisted boundary changed`);
  invariant((report?.inputs?.sourceFixtureId??null)===(recipe.fixtureId??null),`${recipe.id}: source fixture identity changed`);
  invariant(report?.collection?.status==='reserved-inactive',`${recipe.id}: Collections became active`);
  invariant(report?.collection?.contributionBps===0&&report?.collection?.multiplier===1,`${recipe.id}: Collection contribution is nonzero`);
  const exact=(label,actual,expected)=>invariant(actual===expected,`${recipe.id}: ${label} changed (expected ${expected}, got ${actual})`);
  const approximate=(label,actual,expected)=>invariant(near(actual,expected),`${recipe.id}: ${label} changed (expected ${expected}, got ${actual})`);
  if(anchor.fellowEconomyPower!==undefined)exact('Fellow Economy Power',report.fellowEconomy?.rosterPower,anchor.fellowEconomyPower);
  if(anchor.fellowCombatPower!==undefined)exact('Fellow Combat Power',report.fellowCombat?.rosterPower,anchor.fellowCombatPower);
  if(anchor.companionActualPower!==undefined)exact('actual Companion Power',report.companion?.actualRosterPower,anchor.companionActualPower);
  if(anchor.companionMigrationFloor!==undefined)exact('Companion migration floor',report.companion?.migrationFloorRosterPower,anchor.companionMigrationFloor);
  if(anchor.companionThresholdPower!==undefined)exact('effective Companion threshold',report.companion?.effectiveThresholdRosterPower,anchor.companionThresholdPower);
  if(anchor.fellowEconomyBps!==undefined)exact('Fellow economy basis points',report.economy?.fellowRosterBps,anchor.fellowEconomyBps);
  if(anchor.companionEconomyBps!==undefined)exact('Companion economy basis points',report.economy?.companionRosterBps,anchor.companionEconomyBps);
  if(anchor.villageGoldPerHour!==undefined)approximate('Village Gold/hour',report.economy?.totalGoldPerHour,anchor.villageGoldPerHour);
  for(const [id,expected] of Object.entries(anchor.buildingRates||{}))approximate(`${id} Gold/hour`,building(report,id)?.unroundedGoldPerHour,expected);
  if(anchor.companionUnroundedAggregate!==undefined)approximate('unrounded Companion aggregate',report.companion?.aggregateUnroundedPower,anchor.companionUnroundedAggregate);
  const stageOne=anchor.fellowCampaignStageOne;
  if(stageOne){
    exact('Fellow Campaign stage-one requirement',report.requirements?.fellowCampaign?.[0],stageOne.requirement);
    exact('Fellow Campaign stage-one base cost',report.costs?.fellowCampaignStageOne?.baseCost,stageOne.baseCost);
    if(stageOne.discount!==undefined)approximate('Fellow Campaign stage-one discount',report.costs?.fellowCampaignStageOne?.discount,stageOne.discount);
    exact('Fellow Campaign stage-one effective cost',report.costs?.fellowCampaignStageOne?.effectiveCost,stageOne.effectiveCost);
  }
  invariant(report.costs?.buildingUpgradeById&&report.economy?.buildings?.every(row=>report.costs.buildingUpgradeById[row.id]===row.upgradeCost),`${recipe.id}: Building upgrade costs are absent or disagree with Building rows`);
  invariant(Array.isArray(report.requirements?.fellowCampaign)&&report.requirements.fellowCampaign.length===10,`${recipe.id}: Fellow Campaign requirement table is incomplete`);
  invariant(Array.isArray(report.requirements?.companionCampaign)&&report.requirements.companionCampaign.length===10,`${recipe.id}: Companion Campaign requirement table is incomplete`);
  invariant(report.requirements?.companionTower&&Object.keys(report.requirements.companionTower).length===50,`${recipe.id}: Companion Tower requirement table is incomplete`);
  invariant(report.requirements?.fellowExpedition&&Object.keys(report.requirements.fellowExpedition).length===50,`${recipe.id}: Fellow Expedition requirement table is incomplete`);
  invariant(report.claims&&typeof report.claims.status==='string'&&typeof report.claims.manualClaimAuthorityUnchanged==='boolean',`${recipe.id}: claim authority summary is incomplete`);
  invariant(report.offline?.elapsedCapMs===86400000&&Number.isSafeInteger(report.offline.towerIntervalMs)&&Number.isSafeInteger(report.offline.expeditionIntervalMs),`${recipe.id}: offline authority summary is incomplete`);
  invariant(report.sourceProof?.legacyAppliedToReport===false&&report.sourceProof?.collectionAuthorityActive===false,`${recipe.id}: source proof does not exclude legacy or Collection authorities`);
  if(anchor.joinedFellowIds)invariant(JSON.stringify(report.inputs?.fellows?.map(item=>item.id))===JSON.stringify(anchor.joinedFellowIds),`${recipe.id}: joined Fellow set changed`);
  if(anchor.joinedFellowCount!==undefined)exact('joined Fellow count',report.inputs?.fellows?.length,anchor.joinedFellowCount);
  if(anchor.rank!==undefined)exact('Player Rank',report.inputs?.rank,anchor.rank);
  const lineage=report.inputs?.migrationLineage;
  if(recipe.id==='phase24a.migrated-established.schema13.v1'){
    invariant(lineage?.present===true&&lineage?.receiptId==='schema-12-to-13'&&lineage?.from===12&&lineage?.to===13&&lineage?.source==='schema-12',`${recipe.id}: genuine schema-12 to schema-13 receipt lineage is absent`);
    invariant(lineage?.exactProfileMatch===true,`${recipe.id}: migration receipt does not authenticate the report profile`);
    for(const key of ['schema12PredecessorIdentity','legacyHistoryIdentity','initializationIdentity'])invariant(typeof lineage[key]==='string'&&lineage[key].length>0,`${recipe.id}: migration lineage ${key} is absent`);
    invariant(lineage.schema12PredecessorIdentity===lineage.profilePredecessorIdentity&&lineage.legacyHistoryIdentity===lineage.profileLegacyHistoryIdentity&&lineage.initializationIdentity===lineage.profileInitializationIdentity,`${recipe.id}: migration receipt/profile identities differ`);
    if(anchor.migrationLineage)for(const [key,expected] of Object.entries(anchor.migrationLineage))exact(`migration lineage ${key}`,lineage[key],expected);
  }else invariant(lineage===null,`${recipe.id}: a synthetic or fresh profile acquired migration lineage`);
  if(recipe.id==='phase24a.true-high-investment.schema13.v1'){
    invariant(report.inputs.fellows.every(item=>item.level===120&&item.rarity===5&&item.bond===99),`${recipe.id}: Fellow cap recipe changed`);
    invariant(report.inputs.companions.length===20&&report.inputs.companions.every(item=>item.level===100&&item.rarity===5),`${recipe.id}: Companion cap recipe changed`);
    invariant(report.inputs.masteryPoints===50000&&report.inputs.mightPoints===50000,`${recipe.id}: Mastery/Might cap recipe changed`);
    invariant(report.inputs.family.length===20&&report.inputs.family.every(item=>item.intimacy===1000&&item.rarity===5),`${recipe.id}: Family cap recipe changed`);
    invariant(report.inputs.buildings.length===4&&report.inputs.buildings.every(item=>item.level===52&&item.oathBoost===.3),`${recipe.id}: Building/Oath cap recipe changed`);
    invariant(report.economy.buildings.every(row=>row.atLevelCap===true&&row.capStatus==='level-cap'&&row.upgradeCost===null),`${recipe.id}: Level-52 Building rows are not explicitly capped with null upgrade costs`);
    invariant(Object.values(report.costs.buildingUpgradeById).every(value=>value===null),`${recipe.id}: Level-52 Building cost map is not null at cap`);
    const laneIds=['apothecary','companionTower','fellowExpedition','restaurant','schoolhouse','villageGold'];
    invariant(exactKeys(report.pendingOffline,laneIds),`${recipe.id}: exact pending/offline lanes changed`);
    invariant(exactKeys(report.claimState?.byLane,[...laneIds,'legacy']),`${recipe.id}: exact claim lanes changed`);
    invariant(report.claims.readyClaimCount===report.claimState.readyClaimCount&&report.claims.pendingOpportunityCount===report.claimState.pendingOpportunityCount,`${recipe.id}: claim summary disagrees with the canonical claim state`);
    invariant(JSON.stringify(report.offline.pendingByLane)===JSON.stringify(report.pendingOffline),`${recipe.id}: offline summary disagrees with the canonical pending/offline state`);
    for(const id of laneIds){
      const row=report.pendingOffline[id];
      invariant(typeof row.sourcePolicyId==='string'&&row.sourcePolicyId.length>0,`${recipe.id}: ${id} source policy is absent`);
      invariant([row.elapsedMs,row.capMs,row.creditedMs,row.discardedMs].every(Number.isSafeInteger),`${recipe.id}: ${id} elapsed-time values are not exact integers`);
      invariant([row.pendingBefore,row.pendingAfter].every(value=>typeof value==='number'&&Number.isFinite(value)&&value>=0&&Math.abs(value)<=Number.MAX_SAFE_INTEGER),`${recipe.id}: ${id} pending values are not finite safe-precision numbers`);
      invariant(row.intervals===null||Number.isSafeInteger(row.intervals)&&row.intervals>=0,`${recipe.id}: ${id} interval count is invalid`);
      invariant(row.elapsedMs===row.creditedMs+row.discardedMs,`${recipe.id}: ${id} credited/discarded time does not reconcile`);
      invariant(typeof row.claimReady==='boolean'&&typeof row.opportunityReady==='boolean',`${recipe.id}: ${id} readiness flags are absent`);
    }
    invariant(['restaurant','apothecary','schoolhouse'].every(id=>report.pendingOffline[id].opportunityReady===true&&report.pendingOffline[id].pendingAfter>0),`${recipe.id}: all three facility banks must contain banked opportunities`);
    invariant(['villageGold','companionTower','fellowExpedition'].every(id=>report.pendingOffline[id].claimReady===true),`${recipe.id}: Village, Tower, and Expedition manual claims must be ready-unclaimed`);
    exact('ready claim count',report.claimState.readyClaimCount,anchor.readyClaimCount);
    exact('pending facility opportunity count',report.claimState.pendingOpportunityCount,anchor.pendingOpportunityCount);
    exact('pending/offline block hash',sha(report.pendingOffline),anchor.pendingOfflineSha256);
    exact('claim-state block hash',sha(report.claimState),anchor.claimStateSha256);
    exact('claims block hash',sha(report.claims),anchor.claimsSha256);
    exact('offline block hash',sha(report.offline),anchor.offlineSha256);
  }else{
    invariant(exactKeys(report.pendingOffline,[]),`${recipe.id}: non-high profile unexpectedly reports pending/offline rewards`);
    invariant(report.claimState?.readyClaimCount===0&&report.claimState?.pendingOpportunityCount===0&&exactKeys(report.claimState?.byLane,[]),`${recipe.id}: non-high profile unexpectedly reports claim readiness`);
    invariant(report.economy.buildings.every(row=>row.atLevelCap===false&&row.capStatus==='upgrade-available'&&row.upgradeCost===15000),`${recipe.id}: Level-1 Building upgrade authority changed`);
  }
  invariant(report.safeIntegerAudit?.ok===true,`${recipe.id}: runtime safe-integer audit failed`);
}

async function sourceHashes(){
  const files=['index.html','src/phase18-19-runtime.js','src/phase23-companion-catalog.js','src/phase23-companion-runtime.js','src/phase24-scaling-authority.js'];
  const result={};
  for(const file of files)result[file]=sha(await readFile(path.join(root,file)));
  return result;
}

function fixedTableHashes(definitions){
  const active=definitions?.active||{};
  const tables={
    economy:active.economy||null,
    building:(active.building||active.economy)?{
      baseRates:active.building?.baseRates||active.economy?.buildingBaseRates,
      levelCap:active.building?.levelCap||active.economy?.buildingLevelCap,
      levelMultiplier:active.building?.levelMultiplier||active.economy?.buildingLevelMultiplier,
      upgradeBase:active.building?.upgradeBase||active.economy?.buildingUpgradeBase,
      upgradeGrowth:active.building?.upgradeGrowth||active.economy?.buildingUpgradeGrowth,
      oathDailyCap:active.building?.oathDailyCapBps??active.economy?.oathDailyCap
    }:null,
    fellow:active.fellow||null,
    companion:active.companion||null,
    economyRoster:(active.economyRoster||active.economy)?{fellow:active.economy?.fellowRoster,companion:active.economy?.companionRoster}:null,
    campaign:active.campaign||null,
    companionCampaign:active.companionCampaign||null,
    companionTower:active.companionTower||null,
    fellowExpedition:active.fellowExpedition||null,
    player:active.player||null,
    family:active.family||null,
    relic:active.relic||null,
    might:active.might||null,
    collection:active.collection||definitions?.collection||null
  };
  return Object.fromEntries(Object.entries(tables).map(([id,value])=>[id,{present:value!==null,sha256:value===null?null:sha(value)}]));
}

function validateCapture(captured,recipes){
  invariant(captured?.contractId===recipes.contractId,'browser capture contract ID changed');
  invariant(captured?.contractVersion===recipes.contractVersion,'browser capture contract version changed');
  invariant(captured?.frozenNow===recipes.frozenNow,'browser capture clock changed');
  invariant(Array.isArray(captured.profiles)&&captured.profiles.length===3,'browser capture must contain exactly three profiles');
  invariant(JSON.stringify(captured.profiles.map(profile=>profile.profileId))===JSON.stringify(expectedIds),'browser capture profile IDs or order changed');
  recipes.profiles.forEach((recipe,index)=>verifyAnchors(captured.profiles[index],recipe));
  const definitions=captured.authority?.definitions;
  invariant(definitions?.version===1,'scaling definitions version changed');
  invariant(definitions?.configId==='everstead-scaling-live-baseline.phase-24a.v1','scaling definitions config ID changed');
  invariant(definitions?.status==='live-baseline-only','scaling definitions status changed');
  invariant(definitions?.schemaVersion===13,'scaling definitions schema changed');
  const historical=definitions?.historicalAnchors?.freshlyMigratedSchema12;
  invariant(historical?.fellowCombatPower===recipes.historicalMigrationComparisons.freshSchema12To13.expectedAnchors.fellowCombatPower,'freshly migrated schema-12 historical Combat anchor changed');
  invariant(historical?.trueFreshFellowCombatPower===recipes.profiles[0].expectedAnchors.fellowCombatPower,'true-fresh historical comparison changed');
  invariant(historical?.migrationProtectionDelta===historical.fellowCombatPower-historical.trueFreshFellowCombatPower,'historical migration protection delta is inconsistent');
  const neutrality=captured.authority?.neutrality;
  invariant(neutrality?.stateUnchanged===true&&neutrality?.rawUnchanged===true&&neutrality?.zeroReportWrites===true&&neutrality?.writesBefore===neutrality?.writesAfter,'report calls changed gameplay state, persisted bytes, or write count');
  invariant(captured.authority?.nativeStorageAccesses?.length===0,'browser capture accessed native Web Storage');
  const serialized=serialize(captured);
  for(const forbidden of ['private-assets/','portrait.webp','thumb.webp','/Users/'])invariant(!serialized.includes(forbidden),`browser capture exposes forbidden private path token ${forbidden}`);
  return{allNumeric:inspectNumbers(captured),gameplayNumeric:gameplayNumbers(captured.profiles)};
}

function contentType(file){
  return file.endsWith('.html')?'text/html; charset=utf-8':file.endsWith('.js')||file.endsWith('.mjs')?'text/javascript; charset=utf-8':file.endsWith('.json')?'application/json; charset=utf-8':file.endsWith('.css')?'text/css; charset=utf-8':'application/octet-stream';
}

async function startServer(){
  const server=http.createServer(async(request,response)=>{
    try{
      const url=new URL(request.url,'http://127.0.0.1');
      let file=path.resolve(root,`.${decodeURIComponent(url.pathname)}`);
      invariant(file===root||file.startsWith(`${root}${path.sep}`),'request escaped repository root');
      const info=await stat(file);
      if(info.isDirectory())file=path.join(file,'index.html');
      response.writeHead(200,{'Content-Type':contentType(file),'Cache-Control':'no-store'});
      response.end(await readFile(file));
    }catch(error){
      response.writeHead(error?.code==='ENOENT'?404:500,{'Content-Type':'text/plain; charset=utf-8'});
      response.end(String(error.message||error));
    }
  });
  await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve)});
  return{server,port:server.address().port};
}

async function chromePath(){
  const candidates=[
    process.env.EVERSTEAD_CHROME,
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser'
  ].filter(Boolean);
  for(const candidate of candidates)try{await access(candidate);return candidate}catch{}
  throw new Error('Chrome/Chromium not found; set EVERSTEAD_CHROME to its executable path');
}

async function waitForFile(file,timeoutMs=15000){
  const started=Date.now();
  while(Date.now()-started<timeoutMs){
    try{return await readFile(file,'utf8')}catch{}
    await new Promise(resolve=>setTimeout(resolve,50));
  }
  throw new Error(`Timed out waiting for ${file}`);
}

class Cdp{
  constructor(url){this.url=url;this.next=0;this.pending=new Map()}
  async open(){
    this.socket=new WebSocket(this.url);
    this.socket.addEventListener('message',event=>{const message=JSON.parse(event.data);if(!message.id)return;const pending=this.pending.get(message.id);if(!pending)return;this.pending.delete(message.id);message.error?pending.reject(new Error(message.error.message)):pending.resolve(message.result)});
    await new Promise((resolve,reject)=>{this.socket.addEventListener('open',resolve,{once:true});this.socket.addEventListener('error',reject,{once:true})});
  }
  call(method,params={}){
    const id=++this.next;
    return new Promise((resolve,reject)=>{this.pending.set(id,{resolve,reject});this.socket.send(JSON.stringify({id,method,params}))});
  }
  close(){this.socket?.close()}
}

async function captureBrowser(){
  const {server,port}=await startServer();
  const profile=await mkdtemp(path.join(os.tmpdir(),'everstead-phase24a-'));
  const executable=await chromePath();
  const child=spawn(executable,[
    '--headless=new','--disable-gpu','--disable-background-networking','--no-first-run',
    '--no-default-browser-check','--remote-allow-origins=*','--remote-debugging-port=0',
    `--user-data-dir=${profile}`,'about:blank'
  ],{stdio:'ignore'});
  let cdp;
  try{
    const active=(await waitForFile(path.join(profile,'DevToolsActivePort'))).trim().split(/\r?\n/);
    const debugPort=Number(active[0]);
    invariant(Number.isInteger(debugPort)&&debugPort>0,'Chrome did not publish a valid DevTools port');
    const url=`http://127.0.0.1:${port}/qa/phase-24-baseline/`;
    const targetResponse=await fetch(`http://127.0.0.1:${debugPort}/json/new?${encodeURIComponent(url)}`,{method:'PUT'});
    invariant(targetResponse.ok,`Chrome target creation failed: HTTP ${targetResponse.status}`);
    const target=await targetResponse.json();
    cdp=new Cdp(target.webSocketDebuggerUrl);
    await cdp.open();
    await cdp.call('Runtime.enable');
    const started=Date.now();
    while(Date.now()-started<120000){
      const evaluation=await cdp.call('Runtime.evaluate',{expression:`(()=>({report:window.__EVERSTEAD_PHASE24A_BALANCE_REPORT__||null,fatal:document.getElementById('fatal')?.textContent||'',mode:document.getElementById('mode')?.textContent||''}))()`,returnByValue:true});
      const value=evaluation.result?.value;
      if(value?.report)return value.report;
      if(value?.mode==='FATAL'&&value?.fatal)throw new Error(value.fatal);
      await new Promise(resolve=>setTimeout(resolve,100));
    }
    throw new Error('Timed out waiting for the Phase 24A browser report');
  }finally{
    try{await cdp?.call('Browser.close')}catch{}
    cdp?.close();
    child.kill('SIGTERM');
    await new Promise(resolve=>server.close(resolve));
    await rm(profile,{recursive:true,force:true});
  }
}

function markdown(report){
  const lines=[
    '# Phase 24A deterministic balance report','',
    `**Contract:** \`${report.contractId}\`  `,
    `**Authority:** \`${report.authority.configId}\`  `,
    `**Schema:** ${report.authority.schemaVersion}  `,
    `**Frozen clock:** \`${report.frozenNow}\`  `,
    `**Canonical payload SHA-256:** \`${report.integrity.reportPayloadSha256}\``, '',
    'This is a read-only observation of the accepted post-Phase-23 numeric baseline. It does not authorize a balance change. Collections remain reserved and contribute zero.', '',
    '| Profile | Fellow economy | Fellow combat | Companion actual | Migration floor | Effective threshold | Gold/hour |',
    '|---|---:|---:|---:|---:|---:|---:|'
  ];
  for(const profile of report.profiles)lines.push(`| ${profile.profileId} | ${profile.fellowEconomy.rosterPower} | ${profile.fellowCombat.rosterPower} | ${profile.companion.actualRosterPower} | ${profile.companion.migrationFloorRosterPower} | ${profile.companion.effectiveThresholdRosterPower} | ${profile.economy.totalGoldPerHour} |`);
  lines.push('','## Exact Building Gold/hour','');
  for(const profile of report.profiles){
    lines.push(`### ${profile.profileId}`,'','| Building | Base | Level | Exact Gold/hour | Upgrade |','|---|---:|---:|---:|---:|');
    for(const row of profile.economy.buildings)lines.push(`| ${row.id} | ${row.base} | ${row.level??'—'} | ${row.unroundedGoldPerHour} | ${row.atLevelCap?'CAP':row.upgradeCost??row.capStatus??'—'} |`);
    const stage=profile.costs.fellowCampaignStageOne;
    lines.push('',`**Village total:** ${profile.economy.totalGoldPerHour}  `,`**Fellow Campaign stage one:** requirement ${profile.requirements.fellowCampaign[0]}; base cost ${stage.baseCost}; discount ${stage.discount}; effective cost ${stage.effectiveCost}.`,'','**Claim state**','', '```json',JSON.stringify(profile.claims,null,2),'```','','**Offline state**','', '```json',JSON.stringify(profile.offline,null,2),'```','');
  }
  const migrated=report.historicalMigrationComparisons.freshSchema12To13,nearCap=report.nearCapQaEvidence;
  lines.push('## Noncanonical comparison evidence','',`- Fresh schema-12 → 13 migration: Fellow Combat Power ${migrated.expectedAnchors.fellowCombatPower}; stage-one cost ${migrated.expectedAnchors.fellowCampaignStageOneEffectiveCost}. This is not true fresh.` ,`- All-unlocked near-cap QA: Fellow Economy Power ${nearCap.expectedAnchors.fellowEconomyPower}; Fellow Combat Power ${nearCap.expectedAnchors.fellowCombatPower}; Companion actual/floor ${nearCap.expectedAnchors.companionActualPower}/${nearCap.expectedAnchors.companionMigrationFloor}; Gold/hour ${nearCap.expectedAnchors.villageGoldPerHour}. This is not a fourth canonical profile.`,'','## Fixed-table hashes','');
  for(const [id,value] of Object.entries(report.authority.fixedTableHashes))lines.push(`- ${id}: ${value.present?`\`${value.sha256}\``:'not exposed'}`);
  lines.push('','## Observed report-table hashes','');
  for(const [id,value] of Object.entries(report.observedTableHashes.requirements))lines.push(`- requirements.${id}: \`${value}\``);
  for(const [id,value] of Object.entries(report.observedTableHashes.costsByProfile))lines.push(`- costs.${id}: \`${value}\``);
  for(const [id,value] of Object.entries(report.observedTableHashes.claimsByProfile))lines.push(`- claims.${id}: \`${value}\``);
  for(const [id,value] of Object.entries(report.observedTableHashes.offlineByProfile))lines.push(`- offline.${id}: \`${value}\``);
  lines.push('','## Production-source hashes','');
  for(const [file,value] of Object.entries(report.authority.sourceHashes))lines.push(`- \`${file}\`: \`${value}\``);
  lines.push('','## Authority and integrity','',`- Definitions SHA-256: \`${report.integrity.definitionsSha256}\`` ,`- Formula-order SHA-256: \`${report.integrity.formulaOrderSha256}\`` ,`- Recipe SHA-256: \`${report.integrity.recipeSha256}\`` ,`- Safe integers: ${report.safeIntegerHeadroom.ok?'PASS':'FAIL'}; maximum gameplay integer ${report.safeIntegerHeadroom.gameplayNumeric.maxAbsInteger}; gameplay headroom ${report.safeIntegerHeadroom.gameplayRemainingHeadroom}; maximum integer including timestamps ${report.safeIntegerHeadroom.allNumeric.maxAbsInteger}.`);
  return `${lines.join('\n')}\n`;
}

const recipeRaw=await readFile(recipePath,'utf8');
const recipes=JSON.parse(recipeRaw);
const captured=await captureBrowser();
const numeric=validateCapture(captured,recipes);
const definitions=captured.authority.definitions;
const payload={
  contractId:captured.contractId,
  contractVersion:captured.contractVersion,
  frozenNow:captured.frozenNow,
  authority:{
    configId:definitions.configId,
    version:definitions.version,
    status:definitions.status,
    schemaVersion:definitions.schemaVersion,
    neutrality:captured.authority.neutrality,
    definitions,
    sourceHashes:await sourceHashes(),
    fixedTableHashes:fixedTableHashes(definitions)
  },
  profiles:captured.profiles,
  historicalMigrationComparisons:captured.historicalMigrationComparisons,
  nearCapQaEvidence:captured.nearCapQaEvidence,
  collectionsPlanningBoundary:captured.collectionsPlanningBoundary,
  safeIntegerHeadroom:{
    ok:true,
    maximumSafeInteger:Number.MAX_SAFE_INTEGER,
    allNumeric:numeric.allNumeric,
    allRemainingHeadroom:Number.MAX_SAFE_INTEGER-numeric.allNumeric.maxAbsInteger,
    gameplayNumeric:numeric.gameplayNumeric,
    gameplayRemainingHeadroom:Number.MAX_SAFE_INTEGER-numeric.gameplayNumeric.maxAbsInteger
  }
};
payload.observedTableHashes={
  requirements:Object.fromEntries(Object.entries(payload.profiles[0].requirements).map(([id,value])=>[id,sha(value)])),
  costsByProfile:Object.fromEntries(payload.profiles.map(profile=>[profile.profileId,sha(profile.costs)])),
  claimsByProfile:Object.fromEntries(payload.profiles.map(profile=>[profile.profileId,sha(profile.claims)])),
  offlineByProfile:Object.fromEntries(payload.profiles.map(profile=>[profile.profileId,sha(profile.offline)]))
};
payload.integrity={
  recipeSha256:sha(recipeRaw),
  definitionsSha256:sha(definitions),
  formulaOrderSha256:sha(definitions.formulaOrder),
  reportPayloadSha256:sha(payload)
};
const json=serialize(payload),md=markdown(payload);
if(checkOnly){
  invariant(await readFile(jsonPath,'utf8')===json,'generated JSON differs; run the generator without --check');
  invariant(await readFile(markdownPath,'utf8')===md,'generated Markdown differs; run the generator without --check');
}else{
  await mkdir(reportDir,{recursive:true});
  await writeFile(jsonPath,json);
  await writeFile(markdownPath,md);
}
console.log(JSON.stringify({ok:true,checkOnly,profiles:expectedIds,json:path.relative(root,jsonPath),jsonSha256:sha(json),markdown:path.relative(root,markdownPath),markdownSha256:sha(md),safeIntegerHeadroom:payload.safeIntegerHeadroom},null,2));
