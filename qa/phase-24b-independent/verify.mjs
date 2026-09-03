import {createHash} from 'node:crypto';
import {existsSync,readFileSync,readdirSync,statSync} from 'node:fs';
import {resolve} from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const ROOT=resolve(fileURLToPath(new URL('../../',import.meta.url)));
const NODE=process.execPath;
const rows=[];
const rel=path=>resolve(ROOT,path);
const text=path=>readFileSync(rel(path),'utf8');
const json=path=>JSON.parse(text(path));
const same=(left,right)=>JSON.stringify(left)===JSON.stringify(right);
const sha=path=>createHash('sha256').update(readFileSync(rel(path))).digest('hex');
const record=(id,pass,detail='')=>rows.push({id,pass:Boolean(pass),detail});
const safe=value=>Number.isSafeInteger(value)&&value>=0;
const close=(left,right,tolerance=1e-9)=>Number.isFinite(left)&&Number.isFinite(right)&&Math.abs(left-right)<=tolerance*Math.max(1,Math.abs(left),Math.abs(right));
const sum=values=>values.reduce((total,value)=>total+value,0);
const allZero=value=>value&&Object.values(value).every(item=>item===0);

function filesUnder(path){
  if(!existsSync(rel(path)))return[];
  return readdirSync(rel(path),{withFileTypes:true}).flatMap(entry=>{
    const child=`${path}/${entry.name}`;
    return entry.isDirectory()?filesUnder(child):[child];
  }).sort();
}

function expandExpLane(lane,policy){
  const transitions=[];
  let cumulative=0;
  for(const band of lane.expBands){
    const count=band.toLevel-band.fromLevel;
    const weights=Array.from({length:count},(_,index)=>policy.startWeight+policy.weightStep*index);
    const totalWeight=weights.reduce((sum,value)=>sum+value,0);
    const costs=weights.map(weight=>Math.floor(band.totalExp*weight/totalWeight));
    let remainder=band.totalExp-costs.reduce((sum,value)=>sum+value,0);
    for(let index=costs.length-1;remainder>0;index=(index-1+costs.length)%costs.length){costs[index]++;remainder--}
    for(let index=0;index<count;index++){
      const cost=costs[index];
      cumulative+=cost;
      transitions.push({level:band.fromLevel+index,nextLevel:band.fromLevel+index+1,cost,cumulative,bandFromLevel:band.fromLevel,bandToLevel:band.toLevel,bandTotalExp:band.totalExp});
    }
  }
  return transitions;
}

function compactHash(value){return createHash('sha256').update(JSON.stringify(value)).digest('hex')}

function expectedLevelRows(kind,candidate,transitions){
  const lane=candidate[kind],costs=new Map(transitions.map(row=>[row.level,row.cost])),cumulative=new Map([[1,0]]);
  for(const row of transitions)cumulative.set(row.nextLevel,row.cumulative);
  const gates=new Map(lane.breakthroughs.map(row=>[row.level,row.requirementUnits]));
  return Array.from({length:lane.levelCap},(_,index)=>{
    const level=index+1,multiplier=kind==='fellow'?fellowMultiplierAt(level,candidate):1+candidate.companion.levelMultiplier.growthPerLevel*(level-1);
    return{level,cumulativeExp:cumulative.get(level),expToNext:level===lane.levelCap?null:costs.get(level),levelMultiplier:Number(multiplier.toFixed(9)),breakthroughRequirementUnits:gates.get(level)??null};
  });
}

function distributeInteger(total,count){
  const base=Math.floor(total/count),remainder=total-base*count;
  return Array.from({length:count},(_,index)=>base+Number(index<remainder));
}

function distributeFocused(total,count,leadShareBps){
  const lead=Math.floor(total*leadShareBps/10000);
  return[lead,...distributeInteger(total-lead,count-1)];
}

function simulateProgress(levelRows,earnedExp,availableUnits,grandfathered=[]){
  const gates=new Map(levelRows.filter(row=>row.breakthroughRequirementUnits!==null).map(row=>[row.level,row.breakthroughRequirementUnits])),grandfatheredSet=new Set(grandfathered),completed=[];
  let level=1,consumedExp=0,consumedUnits=0,nextClosedBreakthrough=null;
  while(level<levelRows.length){
    const requirement=gates.get(level);
    if(requirement!==undefined&&!grandfatheredSet.has(level)&&!completed.includes(level)){
      if(availableUnits-consumedUnits<requirement){nextClosedBreakthrough={level,requirementUnits:requirement,missingUnits:requirement-(availableUnits-consumedUnits)};break}
      consumedUnits+=requirement;completed.push(level);
    }
    const cost=levelRows[level-1].expToNext;
    if(earnedExp-consumedExp<cost)break;
    consumedExp+=cost;level++;
  }
  return{level,earnedExp,consumedExp,bankedExp:earnedExp-consumedExp,availableBreakthroughUnits:availableUnits,consumedBreakthroughUnits:consumedUnits,bankedBreakthroughUnits:availableUnits-consumedUnits,completedBreakthroughs:completed,nextClosedBreakthrough,atLevelCap:level===levelRows.length,levelMultiplier:levelRows[level-1].levelMultiplier};
}

function levelSummary(progress){
  const levels=progress.map(row=>row.level).sort((a,b)=>a-b),low=Math.floor((levels.length-1)/2),high=Math.ceil((levels.length-1)/2);
  return{min:levels[0],medianLow:levels[low],medianHigh:levels[high],max:levels.at(-1)};
}

function highestReachable(requirements,power){let highest=0;for(const requirement of requirements){if(power<requirement)break;highest++}return highest}

function expeditionReach(requirements,members){
  const available=[...members].sort((left,right)=>left.power-right.power||left.order-right.order),stageResults=[];
  for(let index=0;index<requirements.length;index++){
    const memberIndex=available.findIndex(member=>member.power>=requirements[index]);
    if(memberIndex<0)break;
    const [member]=available.splice(memberIndex,1);
    stageResults.push({stage:index+1,requirement:requirements[index],memberId:member.id,power:member.power});
  }
  return{highestStage:stageResults.length,structuralRosterCeiling:members.length,tableStageCap:requirements.length,blockedByRosterExhaustion:stageResults.length===members.length&&members.length<requirements.length,nextRequirement:requirements[stageResults.length]??null,stageResults};
}

function campaignCost(power,baseCost,requirement){
  const surplus=Math.max(0,power/requirement-1),discount=Math.min(.35,surplus*.25);
  return{discount,effectiveCost:Math.ceil(baseCost*(1-discount))};
}

function legacyCost(config,level){return Math.round(config.expBase*Math.pow(config.expGrowth,level-1))}
function legacyThreshold(config,level){let total=0;for(let current=1;current<Math.min(level,config.levelCap);current++)total+=legacyCost(config,current);return total}

function fellowMultiplierAt(level,candidate){
  const config=candidate.fellow.levelMultiplier;
  if(level<=config.linearThroughLevel)return 1+config.linearGrowthPerLevel*(level-1);
  const anchors=config.anchors;
  const upper=anchors.find(row=>row.level>=level),lower=[...anchors].reverse().find(row=>row.level<=level);
  if(!upper||!lower)return NaN;
  if(upper.level===lower.level)return upper.multiplier;
  return lower.multiplier+(upper.multiplier-lower.multiplier)*(level-lower.level)/(upper.level-lower.level);
}

function findBaselineProfile(report,id){return report.profiles.find(profile=>profile.profileId===id)}

const contract=json('qa/phase-24b-independent/fixtures/contract.json');
record('contract-identity-and-simulation-only',contract.contractId==='phase-24b-progression-simulation-independent-v1'&&contract.contractVersion===1&&contract.phase==='24B'&&contract.status==='simulation-only');
record('contract-exact-level-lanes',contract.levelLanes.fellow.min===1&&contract.levelLanes.fellow.max===750&&contract.levelLanes.companion.min===1&&contract.levelLanes.companion.max===500);
record('contract-exact-horizons-and-collection-stress',same(contract.horizonsDays,[1,7,30,90,365])&&same(contract.collectionStressBps,[0,2500,5000,10000,25000,50000,100000]));
record('contract-current-live-and-proposed-throughput-separated',same(contract.throughputProfiles,['current-live','proposed-launch-budget'])&&contract.fellowReplayConstraint==='gold-limited-not-daily-capped'&&contract.currentLiveThroughputInputs.length===8);
record('contract-six-migration-recipes-and-legacy-gate-policy',contract.migrationRecipes.length===6&&contract.migrationBreakthroughPolicy.oldExpInterpretation==='old-curve-cumulative-convert-do-not-reinterpret'&&same(contract.migrationBreakthroughPolicy.fellowLevel120.grandfathered,[50,100])&&contract.migrationBreakthroughPolicy.fellowLevel120.nextGate===150&&contract.migrationBreakthroughPolicy.companionLevel100.manualLegacyClaim===true&&contract.migrationBreakthroughPolicy.companionLevel100.free===true&&contract.migrationBreakthroughPolicy.companionLevel100.exactlyOnce===true);

const requiredModelFiles=Object.values(contract.modelArtifacts).filter(path=>path!==contract.modelArtifacts.reportsRoot);
record('model-owned-contract-candidate-generator-present',requiredModelFiles.every(path=>existsSync(rel(path))),requiredModelFiles.filter(path=>!existsSync(rel(path))));

if(requiredModelFiles.every(path=>existsSync(rel(path)))){
  const candidate=json(contract.modelArtifacts.candidate);
  const baseline=json(candidate.baseline.reportPath);
  const fresh=findBaselineProfile(baseline,'phase24a.fresh.schema13.v1');
  const migrated=findBaselineProfile(baseline,'phase24a.migrated-established.schema13.v1');
  const high=findBaselineProfile(baseline,'phase24a.true-high-investment.schema13.v1');

  record('candidate-provisional-output-only-identity',candidate.candidateId==='phase24b.provisional-progression.v1'&&candidate.status==='provisional-output-only-not-runtime-authority'&&candidate.schemaVersion===1);
  record('candidate-pins-exact-phase24a-report',candidate.baseline.contractId==='phase-24a-balance-baseline-v1'&&candidate.baseline.authorityConfigId===contract.phase24aAnchors.authorityId&&candidate.baseline.reportSha256===sha(candidate.baseline.reportPath));
  record('baseline-exact-fresh-zero-collection-anchor',fresh?.fellowEconomy?.rosterPower===contract.phase24aAnchors.fresh.fellowEconomyPower&&fresh?.fellowCombat?.rosterPower===contract.phase24aAnchors.fresh.fellowCombatPower&&fresh?.companion?.actualRosterPower===contract.phase24aAnchors.fresh.companionActualPower&&fresh?.companion?.migrationFloorRosterPower===0&&fresh?.companion?.effectiveThresholdRosterPower===contract.phase24aAnchors.fresh.companionEffectivePower&&fresh?.economy?.totalGoldPerHour===contract.phase24aAnchors.fresh.villageGoldPerHour&&fresh?.collection?.contributionBps===0);
  record('baseline-exact-migrated-established-anchor',migrated?.fellowEconomy?.rosterPower===contract.phase24aAnchors.migratedEstablished.fellowEconomyPower&&migrated?.fellowCombat?.rosterPower===contract.phase24aAnchors.migratedEstablished.fellowCombatPower&&migrated?.companion?.actualRosterPower===contract.phase24aAnchors.migratedEstablished.companionActualPower&&migrated?.companion?.migrationFloorRosterPower===contract.phase24aAnchors.migratedEstablished.companionMigrationFloor&&migrated?.companion?.effectiveThresholdRosterPower===contract.phase24aAnchors.migratedEstablished.companionEffectivePower&&migrated?.economy?.totalGoldPerHour===contract.phase24aAnchors.migratedEstablished.villageGoldPerHour&&migrated?.collection?.contributionBps===0);
  record('baseline-exact-true-high-anchor',high?.fellowEconomy?.rosterPower===contract.phase24aAnchors.trueHigh.fellowEconomyPower&&high?.fellowCombat?.rosterPower===contract.phase24aAnchors.trueHigh.fellowCombatPower&&high?.companion?.actualRosterPower===contract.phase24aAnchors.trueHigh.companionActualPower&&high?.economy?.totalGoldPerHour===contract.phase24aAnchors.trueHigh.villageGoldPerHour&&high?.collection?.contributionBps===0);
  record('baseline-current-broken-roads-table-not-repriced',same(fresh?.requirements?.fellowCampaign,contract.currentContent.brokenRoadsRequirements)&&same(migrated?.requirements?.fellowCampaign,contract.currentContent.brokenRoadsRequirements)&&same(high?.requirements?.fellowCampaign,contract.currentContent.brokenRoadsRequirements));

  record('candidate-finite-lane-caps-and-no-old-exponential-extension',candidate.fellow.levelCap===750&&candidate.companion.levelCap===500&&candidate.legacyExp.fellow.levelCap===120&&candidate.legacyExp.companion.levelCap===100&&candidate.legacyExp.fellow.expGrowth===1.12&&candidate.legacyExp.companion.expGrowth===1.12);
  record('candidate-authored-band-coverage',candidate.fellow.expBands[0]?.fromLevel===1&&candidate.fellow.expBands.at(-1)?.toLevel===750&&candidate.companion.expBands[0]?.fromLevel===1&&candidate.companion.expBands.at(-1)?.toLevel===500&&candidate.fellow.expBands.every((band,index)=>index===0||candidate.fellow.expBands[index-1].toLevel===band.fromLevel)&&candidate.companion.expBands.every((band,index)=>index===0||candidate.companion.expBands[index-1].toLevel===band.fromLevel));
  record('candidate-breakthroughs-exact-every-50-below-cap',same(candidate.fellow.breakthroughs.map(row=>row.level),contract.levelLanes.fellow.breakthroughLevels)&&same(candidate.companion.breakthroughs.map(row=>row.level),contract.levelLanes.companion.breakthroughLevels)&&[...candidate.fellow.breakthroughs,...candidate.companion.breakthroughs].every(row=>safe(row.requirementUnits)&&row.requirementUnits>0));
  record('candidate-breakthroughs-manual-banked-not-a-live-currency',candidate.breakthroughMaterialModel.createsLiveCurrency===false&&candidate.breakthroughMaterialModel.claimPolicy==='manual-banked-exactly-once'&&candidate.breakthroughMaterialModel.expAtClosedGate==='bank-without-loss');

  const fellowTransitions=expandExpLane(candidate.fellow,candidate.tableExpansion);
  const companionTransitions=expandExpLane(candidate.companion,candidate.tableExpansion);
  for(const [id,lane,transitions,expectedCount] of [['fellow',candidate.fellow,fellowTransitions,749],['companion',candidate.companion,companionTransitions,499]]){
    record(`${id}-independent-expanded-table-complete`,transitions.length===expectedCount&&transitions.every((row,index)=>row.level===index+1&&row.nextLevel===index+2));
    record(`${id}-independent-exp-cost-and-cumulative-safe-monotonic`,transitions.every((row,index)=>safe(row.cost)&&row.cost>0&&safe(row.cumulative)&&(index===0||row.cost>=transitions[index-1].cost&&row.cumulative===transitions[index-1].cumulative+row.cost)));
    record(`${id}-independent-band-totals-exact`,lane.expBands.every(band=>transitions.filter(row=>row.level>=band.fromLevel&&row.level<band.toLevel).reduce((sum,row)=>sum+row.cost,0)===band.totalExp));
  }

  const fellowMultipliers=Array.from({length:750},(_,index)=>fellowMultiplierAt(index+1,candidate));
  record('fellow-level-multiplier-linear-through-500-and-monotonic',fellowMultipliers.every((value,index)=>Number.isFinite(value)&&value>0&&(index===0||value>=fellowMultipliers[index-1]))&&Array.from({length:500},(_,index)=>close(fellowMultipliers[index],1+0.115*index,1e-12)).every(Boolean));
  record('fellow-post500-authored-anchors-exact',candidate.fellow.levelMultiplier.anchors.filter(row=>row.level>=500).every(row=>close(fellowMultipliers[row.level-1],row.multiplier,1e-12)));
  const rosterBase=2200,level500Multiplier=1+candidate.companion.levelMultiplier.growthPerLevel*499,memberBases=fresh.companion.members.map(row=>row.basePower);
  const theoreticalFixtures={star1Mastery0:Math.round(rosterBase*level500Multiplier),star5Mastery0:Math.round(rosterBase*level500Multiplier*1.4),star5Mastery50:Math.round(rosterBase*level500Multiplier*1.4*1.5)};
  const actualFixtures={star1Mastery0:memberBases.reduce((sum,base)=>sum+Math.round(base*level500Multiplier),0),star5Mastery0:memberBases.reduce((sum,base)=>sum+Math.round(base*level500Multiplier*1.4),0),star5Mastery50:memberBases.reduce((sum,base)=>sum+Math.round(base*level500Multiplier*1.4*1.5),0)};
  record('companion-level500-theoretical-fixtures-independently-recomputed',same(theoreticalFixtures,contract.levelLanes.companion.level500RosterFixtures.aggregateUnroundedTheoretical),theoreticalFixtures);
  record('companion-level500-gameplay-member-rounded-fixtures-independently-recomputed',same(actualFixtures,contract.levelLanes.companion.level500RosterFixtures.actualMemberRounded),actualFixtures);

  record('candidate-exact-horizons-and-separated-throughput',same(candidate.throughput.horizonsDays,contract.horizonsDays)&&candidate.throughput.currentLive.status==='released-mechanics-frozen-fresh-static-bounds-not-a-dynamic-projection'&&candidate.throughput.proposedLaunchExpBudget.status==='provisional-prerequisite-not-present-in-live-game'&&same(candidate.throughput.proposedLaunchExpBudget.rows.map(row=>row.days),contract.horizonsDays));
  record('candidate-current-live-released-exp-inputs',same(candidate.throughput.currentLive.fellowCampaign.firstClearExpByStage,[120,150,180,210,240,270,300,330,360,390])&&same(candidate.throughput.currentLive.fellowCampaign.replayExpByStage,[60,75,90,105,120,135,150,165,180,195])&&same(candidate.throughput.currentLive.companionCampaign.firstClearExpByStage,[100,125,150,175,200,225,250,275,300,325])&&same(candidate.throughput.currentLive.companionCampaign.replayExpByStage,[50,62,75,87,100,112,125,137,150,162]));
  record('candidate-proposed-budget-is-explicit-prerequisite',candidate.throughput.proposedLaunchExpBudget.description.includes('require new authored permanent reward sources')&&candidate.throughput.proposedLaunchExpBudget.rows.every(row=>safe(row.fellowRawExp)&&safe(row.companionRawExp)&&safe(row.fellowBreakthroughUnits)&&safe(row.companionBreakthroughUnits)));

  record('candidate-collection-stress-uncapped-additive-policy',same(candidate.collectionStressBps,contract.collectionStressBps)&&candidate.collectionPolicy.status==='stress-only-not-live'&&candidate.collectionPolicy.mandatoryRequirementsAssumeLimitedCollections===false&&candidate.collectionPolicy.releaseBudgetsAreLifetimeCaps===false&&candidate.collectionPolicy.power.includes('adds beside Might')&&candidate.collectionPolicy.earnings.includes('adds beside Oath'));
  record('candidate-migration-policy-not-raw-reinterpretation',candidate.migrationPolicy.status==='simulation-only'&&candidate.migrationPolicy.preserve.includes('saved Level')&&candidate.migrationPolicy.preserve.includes('post-cap surplus')&&candidate.migrationPolicy.grandfatheredGates==='strictly-below-saved-level'&&candidate.migrationPolicy.companionFormerCap.includes('free manual exactly-once')&&candidate.migrationPolicy.fellowFormerCap.includes('next ordinary gate is 150')&&candidate.migrationPolicy.repeatApplication==='receipt-identity-no-op'&&candidate.migrationPolicy.unknownLineage==='fail-closed-for-manual-review');

  const generatorCheck=spawnSync(NODE,[contract.modelArtifacts.generator,'--check'],{cwd:ROOT,encoding:'utf8',timeout:120000});
  record('model-generator-check-mode-reproduces-reports',generatorCheck.status===0,`${generatorCheck.stdout}${generatorCheck.stderr}`.trim());
  const generatorCheckAgain=spawnSync(NODE,[contract.modelArtifacts.generator,'--check'],{cwd:ROOT,encoding:'utf8',timeout:120000});
  record('model-generator-second-check-is-deterministic',generatorCheckAgain.status===0,`${generatorCheckAgain.stdout}${generatorCheckAgain.stderr}`.trim());
  const reportFiles=filesUnder(contract.modelArtifacts.reportsRoot);
  record('model-machine-and-human-reports-present',reportFiles.some(path=>path.endsWith('.json'))&&reportFiles.some(path=>path.endsWith('.md')),reportFiles);
  const reportPath=`${contract.modelArtifacts.reportsRoot}/phase24b-progression-simulation.json`,humanPath=`${contract.modelArtifacts.reportsRoot}/phase24b-progression-simulation.md`,checksumsPath=`${contract.modelArtifacts.reportsRoot}/checksums.sha256`;
  if([reportPath,humanPath,checksumsPath].every(path=>existsSync(rel(path)))){
    const report=json(reportPath),expectedFellowLevels=expectedLevelRows('fellow',candidate,fellowTransitions),expectedCompanionLevels=expectedLevelRows('companion',candidate,companionTransitions),expectedByKind={fellow:expectedFellowLevels,companion:expectedCompanionLevels};
    const manifestRows=text(checksumsPath).trim().split(/\r?\n/).filter(Boolean),manifestBad=manifestRows.filter(line=>{const match=/^([0-9a-f]{64})  (.+)$/.exec(line),path=match?.[2]?.startsWith('qa/')?match[2]:`${contract.modelArtifacts.reportsRoot}/${match?.[2]||''}`;return!match||!existsSync(rel(path))||sha(path)!==match[1]});
    record('report-checksum-manifest-exact-two-artifacts',manifestRows.length===2&&manifestBad.length===0,manifestBad);
    record('report-provisional-source-identities-exact',report.reportId==='phase24b-progression-simulation.v1'&&report.contractId==='phase-24b-progression-simulation-v1'&&report.status==='provisional-output-only'&&report.source.candidateId===candidate.candidateId&&report.source.candidateSha256===sha(contract.modelArtifacts.candidate)&&report.source.baselineReportSha256===sha(candidate.baseline.reportPath));
    const phase24aContract=json('qa/phase-24a-scaling-authority/fixtures/contract.json'),productionHashes=phase24aContract.generatedArtifacts.productionSourceSha256;
    record('report-and-files-preserve-frozen-phase24a-production',same(report.source.baselineSourceHashes,baseline.authority.sourceHashes)&&Object.entries(productionHashes).every(([path,expected])=>sha(path)===expected)&&Object.entries(productionHashes).every(([path,expected])=>report.source.baselineSourceHashes[path]===expected),Object.fromEntries(Object.keys(productionHashes).map(path=>[path,sha(path)])));
    record('report-exact-phase24a-zero-collection-neutrality',report.baselineNeutrality.collectionBps===0&&report.baselineNeutrality.productionChanged===false&&same(report.baselineNeutrality.fresh,candidate.baseline.requiredFreshAnchors)&&same(report.baselineNeutrality.migrated,candidate.baseline.requiredMigratedAnchors)&&same(report.baselineNeutrality.high,candidate.baseline.requiredHighAnchors));
    record('report-broken-roads-authority-not-repriced',same(report.authorityDiscrepancy.frozenReleasedRuntime,contract.currentContent.brokenRoadsRequirements)&&report.authorityDiscrepancy.selectedAuthority==='frozen-released-runtime'&&report.authorityDiscrepancy.repricedExistingContent===false);

    for(const [kind,transitions] of [['fellow',fellowTransitions],['companion',companionTransitions]]){
      const expectedLevels=expectedByKind[kind],expectedTransitionRows=transitions.map(row=>({fromLevel:row.level,toLevel:row.nextLevel,expCost:row.cost,bandFromLevel:row.bandFromLevel,bandToLevel:row.bandToLevel,bandTotalExp:row.bandTotalExp})),lane=report.tables[kind];
      record(`report-${kind}-all-level-rows-independently-exact`,same(lane?.levels,expectedLevels));
      record(`report-${kind}-table-hashes-independently-exact`,lane?.transitionTableSha256===compactHash(expectedTransitionRows)&&lane?.levelTableSha256===compactHash(expectedLevels));
      record(`report-${kind}-cap-count-cumulative-exact`,lane?.status==='provisional'&&lane?.levelCap===candidate[kind].levelCap&&lane?.transitionCount===transitions.length&&lane?.cumulativeExpAtCap===transitions.at(-1).cumulative);
    }

    const rounding=Object.fromEntries((report.companionCapRounding?.fixtures||[]).map(row=>[row.id,row]));
    record('report-companion-rounding-actual-and-theoretical-distinct',rounding['level500-star1-mastery0']?.actualMemberRoundedTotal===actualFixtures.star1Mastery0&&rounding['level500-star1-mastery0']?.theoreticalAggregateUnrounded===theoreticalFixtures.star1Mastery0&&rounding['level500-star5-mastery0']?.actualMemberRoundedTotal===actualFixtures.star5Mastery0&&rounding['level500-star5-mastery0']?.theoreticalAggregateUnrounded===theoreticalFixtures.star5Mastery0&&rounding['level500-star5-mastery50']?.actualMemberRoundedTotal===actualFixtures.star5Mastery50&&rounding['level500-star5-mastery50']?.theoreticalAggregateUnrounded===theoreticalFixtures.star5Mastery50&&(report.companionCapRounding?.fixtures||[]).every(row=>row.gameplayReachabilityUses==='actualMemberRoundedTotal'));

    const active=baseline.authority.definitions.active;
    const live=report.currentLiveThroughput,liveSource=candidate.throughput.currentLive;
    const startGold=active.economy.freshGold,goldPerHour=fresh.economy.totalGoldPerHour;
    const fellowAccessibleCount=highestReachable(fresh.requirements.fellowCampaign,fresh.fellowCombat.rosterPower);
    const fellowLiveStages=Array.from({length:fellowAccessibleCount},(_,index)=>({stage:index+1,requirement:fresh.requirements.fellowCampaign[index],firstClearExp:liveSource.fellowCampaign.firstClearExpByStage[index],replayExp:liveSource.fellowCampaign.replayExpByStage[index],...campaignCost(fresh.fellowCombat.rosterPower,active.campaign.baseCost[index],fresh.requirements.fellowCampaign[index])}));
    const fellowFirstCost=sum(fellowLiveStages.map(row=>row.effectiveCost)),fellowFirstExp=sum(fellowLiveStages.map(row=>row.firstClearExp)),fellowBestReplay=fellowLiveStages.reduce((best,row)=>!best||row.replayExp*best.effectiveCost>best.replayExp*row.effectiveCost?row:best,null);
    const companionAccessibleCount=highestReachable(fresh.requirements.companionCampaign,fresh.companion.actualRosterPower);
    const companionLiveStages=Array.from({length:companionAccessibleCount},(_,index)=>({stage:index+1,requirement:fresh.requirements.companionCampaign[index],baseCost:8000+1500*index,firstClearExp:liveSource.companionCampaign.firstClearExpByStage[index],replayExp:liveSource.companionCampaign.replayExpByStage[index],...campaignCost(fresh.companion.actualRosterPower,8000+1500*index,fresh.requirements.companionCampaign[index])}));
    const companionFirstCost=sum(companionLiveStages.map(row=>row.effectiveCost)),companionFirstExp=sum(companionLiveStages.map(row=>row.firstClearExp)),companionBestReplay=companionLiveStages.reduce((best,row)=>!best||row.replayExp*best.effectiveCost>best.replayExp*row.effectiveCost?row:best,null);
    const towerFloor=highestReachable(Object.values(fresh.requirements.companionTower),fresh.companion.actualRosterPower);
    const towerRotation=floorCount=>{const perTargetAccountExp=Array(20).fill(0);for(let floor=1;floor<=floorCount;floor++)perTargetAccountExp[(floor-1)%20]+=liveSource.companionTower.clearExpBasePerTarget+liveSource.companionTower.clearExpStepPerFloor*(floor-1);return{floorCount,targetCount:20,perTargetAccountExp,totalAccountExp:sum(perTargetAccountExp),awardSemantics:'one-rotating-target-per-floor'}};
    const frozenTowerRotation=towerRotation(towerFloor),floor50TowerRotation=towerRotation(50),towerIdlePerHour=liveSource.companionTower.idleExpBasePerHourPerCompanion+liveSource.companionTower.idleExpPerFloorPerHourPerCompanion*towerFloor;
    record('report-current-live-static-envelope-methodology-explicit',live?.status===liveSource.status&&live?.interpretation==='conservative-static-bounds-only-not-a-dynamic-live-progression-forecast'&&live?.dynamicFeedbackLoopModeled===false&&same(live?.deliberatelyOmittedFeedback,['earned EXP -> old-curve Levels','Levels -> Power','Rank-crossing Fellow joins -> roster Power','new Power -> later Campaign stages or Tower floors','post-Rank2 route to Rank3'])&&live?.lowerBoundPolicy?.includes('conservative achievable lower bounds')&&live?.unprovenGap?.includes('does not claim an exact released progression forecast'));
    record('report-current-live-rank-unlocks-and-shared-gold-pinned',liveSource.rankUnlocks.freshRank===1&&liveSource.rankUnlocks.companionCampaignRank===2&&liveSource.rankUnlocks.companionTowerRank===3&&liveSource.rankUnlocks.rank2Exp===50&&liveSource.rankUnlocks.rank3Exp===125&&liveSource.rankUnlocks.firstTwoFellowStageRankExp===55&&fellowAccessibleCount===2&&fellowFirstCost===19716&&live?.sharedGoldWarning?.includes('cannot be added'));
    const stageRowsMatch=(actual,expected)=>actual?.length===expected.length&&actual.every((row,index)=>{const wanted=expected[index];return row.stage===wanted.stage&&row.requirement===wanted.requirement&&row.firstClearExp===wanted.firstClearExp&&row.replayExp===wanted.replayExp&&row.effectiveCost===wanted.effectiveCost&&close(row.discount,wanted.discount,1e-12)&&(!('baseCost' in wanted)||row.baseCost===wanted.baseCost)});
    record('report-current-live-stage-costs-independently-recomputed',stageRowsMatch(live?.fellowAccessibleStages,fellowLiveStages)&&stageRowsMatch(live?.companionAccessibleStages,companionLiveStages));
    record('report-tower-clear-target-rotation-not-roster-multiplied',same(live?.towerClearTargetRotation?.frozenFreshPower,frozenTowerRotation)&&same(live?.towerClearTargetRotation?.floorFiftyPowerOnly,floor50TowerRotation)&&frozenTowerRotation.totalAccountExp===90&&floor50TowerRotation.totalAccountExp===14250&&live?.towerClearTargetRotation?.idleSemantics==='all-20-companions-per-hour');
    let liveRowsExact=same(live?.rows?.map(row=>row.days),contract.horizonsDays),liveRowsDetail='';
    for(const row of live?.rows||[]){
      const budget=candidate.throughput.proposedLaunchExpBudget.rows.find(item=>item.days===row.days),goldAvailable=Math.floor(startGold+goldPerHour*24*row.days),fellowReplayCount=Math.max(0,Math.floor((goldAvailable-fellowFirstCost)/fellowBestReplay.effectiveCost)),fellowExp=fellowFirstExp+fellowReplayCount*fellowBestReplay.replayExp,goldAfterRank2=Math.max(0,goldAvailable-fellowFirstCost),companionUnlocked=goldAfterRank2>=companionFirstCost,companionReplayCount=companionUnlocked?Math.max(0,Math.floor((goldAfterRank2-companionFirstCost)/companionBestReplay.effectiveCost)):0,companionCampaignExp=companionUnlocked?companionFirstExp+companionReplayCount*companionBestReplay.replayExp:0,companionPowerOnlyReplayCount=Math.max(0,Math.floor((goldAvailable-companionFirstCost)/companionBestReplay.effectiveCost)),companionPowerOnlyCampaignExp=companionFirstExp+companionPowerOnlyReplayCount*companionBestReplay.replayExp,powerOnlyTowerUpper=frozenTowerRotation.totalAccountExp+towerIdlePerHour*20*24*row.days,floor50TowerUpper=liveSource.companionTower.floorFiftyClearTotalAccountExp+liveSource.companionTower.floorFiftyIdleExpPerHourPerCompanion*20*24*row.days;
      const exact=row.goldAvailable===goldAvailable&&row.fellow.accessibleStageCountAtFrozenFreshPower===fellowAccessibleCount&&row.fellow.firstClearExp===fellowFirstExp&&row.fellow.firstClearGoldCost===fellowFirstCost&&row.fellow.bestGoldLimitedReplayStage===fellowBestReplay.stage&&row.fellow.replayEffectiveCost===fellowBestReplay.effectiveCost&&row.fellow.replayCount===fellowReplayCount&&row.fellow.staticFreshPowerLowerBoundAccountExp===fellowExp&&row.fellow.proposedBudgetExp===budget.fellowRawExp&&row.fellow.shortfallExp===Math.max(0,budget.fellowRawExp-fellowExp)&&row.companion.rank2Prerequisite?.goldCost===fellowFirstCost&&row.companion.rank2Prerequisite?.chargedBeforeCompanionCampaign===true&&row.companion.goldAfterRank2Prerequisite===goldAfterRank2&&row.companion.companionCampaignUnlocked===companionUnlocked&&row.companion.rank2AccessibleStaticCampaignLowerBoundAccountExp===companionCampaignExp&&row.companion.campaignTargetSemantics==='one-rotating-target-per-clear-or-replay'&&row.companion.campaignPowerOnlyNoRankNoSharedGoldExp===companionPowerOnlyCampaignExp&&row.companion.powerOnlyTowerClearAccountExp===frozenTowerRotation.totalAccountExp&&row.companion.powerOnlyTowerIdleExpPerHourPerCompanion===towerIdlePerHour&&row.companion.powerOnlyTowerUpperExp===powerOnlyTowerUpper&&row.companion.towerRequiredRank===3&&row.companion.towerRankUnlockProven===false&&row.companion.towerIncludedInStaticCampaignLowerBound===false&&row.companion.powerOnlyAccountExpUpperEnvelope===companionCampaignExp+powerOnlyTowerUpper&&row.companion.unavailableAtFreshFloorFiftyAccountExpUpperEnvelope===companionCampaignExp+floor50TowerUpper&&row.companion.noUnlockNoSharedGoldPowerOnlyAccountExpUpperEnvelope===companionPowerOnlyCampaignExp+powerOnlyTowerUpper&&row.companion.noUnlockNoSharedGoldFloorFiftyAccountExpUpperEnvelope===companionPowerOnlyCampaignExp+floor50TowerUpper&&row.companion.proposedBudgetExp===budget.companionRawExp;
      if(!exact){liveRowsExact=false;liveRowsDetail=`day ${row.days}`;break}
    }
    record('report-current-live-five-horizon-bounds-independently-recomputed',liveRowsExact,liveRowsDetail);

    const coreScenarios=(report.scenarios||[]).filter(row=>['focused','broad'].includes(row.strategy)&&contract.horizonsDays.includes(row.days)&&contract.collectionStressBps.includes(row.collectionBps));
    const coreKeys=coreScenarios.map(row=>`${row.strategy}:${row.days}:${row.collectionBps}`);
    record('report-exact-70-unique-core-scenario-provenance',coreScenarios.length===70&&new Set(coreKeys).size===70&&['focused','broad'].every(strategy=>contract.horizonsDays.every(days=>contract.collectionStressBps.every(bps=>coreKeys.includes(`${strategy}:${days}:${bps}`)))));
    let scenarioExact=true,scenarioDetail='';
    const fellowBases=active.fellow.basePower,companionBases=active.companion.basePower,fellowRequirements=fresh.requirements.fellowCampaign,companionRequirements=fresh.requirements.companionCampaign,towerRequirements=Object.values(fresh.requirements.companionTower),expeditionRequirements=Object.values(fresh.requirements.fellowExpedition),budgetByDay=new Map(candidate.throughput.proposedLaunchExpBudget.rows.map(row=>[row.days,row]));
    for(const scenario of coreScenarios){
      const budget=budgetByDay.get(scenario.days),multiplier=1+scenario.collectionBps/10000,expectedFellowEffective=Math.floor(budget.fellowRawExp*multiplier),expectedCompanionEffective=Math.floor(budget.companionRawExp*multiplier),fellowCount=scenario.strategy==='focused'?candidate.throughput.allocation.focused.fellowRosterSize:candidate.throughput.allocation.broad.fellowRosterSize,companionCount=candidate.throughput.allocation.broad.companionRosterSize;
      const fellowExp=scenario.strategy==='focused'?distributeFocused(expectedFellowEffective,fellowCount,candidate.throughput.allocation.focused.fellowLeadShareBps):distributeInteger(expectedFellowEffective,fellowCount),fellowUnits=scenario.strategy==='focused'?distributeFocused(budget.fellowBreakthroughUnits,fellowCount,candidate.throughput.allocation.focused.fellowLeadShareBps):distributeInteger(budget.fellowBreakthroughUnits,fellowCount),companionExp=scenario.strategy==='focused'?distributeFocused(expectedCompanionEffective,companionCount,candidate.throughput.allocation.focused.companionLeadShareBps):distributeInteger(expectedCompanionEffective,companionCount),companionUnits=scenario.strategy==='focused'?distributeFocused(budget.companionBreakthroughUnits,companionCount,candidate.throughput.allocation.focused.companionLeadShareBps):distributeInteger(budget.companionBreakthroughUnits,companionCount),fellowProgress=fellowExp.map((value,index)=>simulateProgress(expectedFellowLevels,value,fellowUnits[index])),companionProgress=companionExp.map((value,index)=>simulateProgress(expectedCompanionLevels,value,companionUnits[index]));
      let fellowMembers;
      if(scenario.strategy==='focused')fellowMembers=fresh.fellowCombat.members.map((member,index)=>{const preGlobal=(member.basePower*fellowProgress[index].levelMultiplier*member.rarityMultiplier*member.bondMilestoneMultiplier*member.relicMultiplier+member.transferredPower)*member.familyBondMultiplier,might=member.globalMightMultiplier-1;return{id:member.id,order:index,power:Math.round(preGlobal*(1+might+scenario.collectionBps/10000))}});
      else fellowMembers=Object.entries(fellowBases).map(([id,base],index)=>({id,order:index,power:Math.round(base*fellowProgress[index].levelMultiplier*(1+scenario.collectionBps/10000))}));
      const companionMembers=Object.entries(companionBases).map(([id,base],index)=>({id,order:index,power:Math.round(base*companionProgress[index].levelMultiplier)})),expectedFellowPower=fellowMembers.reduce((sum,row)=>sum+row.power,0),expectedCompanionPower=companionMembers.reduce((sum,row)=>sum+row.power,0),expectedExpedition=expeditionReach(expeditionRequirements,fellowMembers);
      const exact=scenario.allocation.fellowRawAccountExp===budget.fellowRawExp&&scenario.allocation.fellowEffectiveAccountExp===expectedFellowEffective&&scenario.allocation.companionRawAccountExp===budget.companionRawExp&&scenario.allocation.companionEffectiveAccountExp===expectedCompanionEffective&&same(scenario.fellow.lead,fellowProgress[0])&&same(scenario.companion.lead,companionProgress[0])&&same(scenario.fellow.levelSummary,levelSummary(fellowProgress))&&same(scenario.companion.levelSummary,levelSummary(companionProgress))&&scenario.fellow.totalBankedExp===fellowProgress.reduce((sum,row)=>sum+row.bankedExp,0)&&scenario.companion.totalBankedExp===companionProgress.reduce((sum,row)=>sum+row.bankedExp,0)&&scenario.fellow.totalPower===expectedFellowPower&&scenario.companion.totalPower===expectedCompanionPower&&scenario.fellow.campaignHighestStage===highestReachable(fellowRequirements,expectedFellowPower)&&scenario.companion.campaignHighestStage===highestReachable(companionRequirements,expectedCompanionPower)&&scenario.companion.towerHighestFloor===highestReachable(towerRequirements,expectedCompanionPower)&&same(scenario.fellow.expedition,expectedExpedition)&&close(scenario.economy.freshZeroOathGoldPerHour,fresh.economy.totalGoldPerHour*multiplier)&&scenario.economy.normalizedFacilityActiveRewardMultiplier===multiplier;
      if(!exact){scenarioExact=false;scenarioDetail=`${scenario.strategy}:${scenario.days}:${scenario.collectionBps}`;break}
    }
    record('report-all-core-scenarios-independently-recomputed',scenarioExact,scenarioDetail);
    const scenarioGroups=new Map();for(const scenario of coreScenarios){const key=`${scenario.strategy}:${scenario.days}`,group=scenarioGroups.get(key)||[];group.push(scenario);scenarioGroups.set(key,group)}
    record('report-collection-stress-monotonic-through-1000-percent',[...scenarioGroups.values()].every(group=>group.sort((a,b)=>a.collectionBps-b.collectionBps).every((row,index)=>index===0||row.allocation.fellowEffectiveAccountExp>=group[index-1].allocation.fellowEffectiveAccountExp&&row.allocation.companionEffectiveAccountExp>=group[index-1].allocation.companionEffectiveAccountExp&&row.fellow.totalPower>=group[index-1].fellow.totalPower&&row.economy.freshZeroOathGoldPerHour>=group[index-1].economy.freshZeroOathGoldPerHour)));

    const zeroScenario=(strategy,days)=>coreScenarios.find(row=>row.strategy===strategy&&row.days===days&&row.collectionBps===0),target=report.targetAssessment,bands=contract.fellowPacingReferenceBands;
    const focused1=zeroScenario('focused',1),focused7=zeroScenario('focused',7),focused30=zeroScenario('focused',30),focused365=zeroScenario('focused',365),broad7=zeroScenario('broad',7),broad30=zeroScenario('broad',30),broad365=zeroScenario('broad',365);
    const inBand=(value,band)=>value>=band[0]&&value<=band[1],freshSixExpected=[1,7].map(days=>{const budget=budgetByDay.get(days),exp=distributeInteger(budget.fellowRawExp,6),units=distributeInteger(budget.fellowBreakthroughUnits,6),progress=exp.map((value,index)=>simulateProgress(expectedFellowLevels,value,units[index]));return{days,rosterBasis:'six-Fellows-actually-joined-at-fresh-rank',levelSummary:levelSummary(progress),totalBankedExp:sum(progress.map(row=>row.bankedExp))}}),freshSixDay1=freshSixExpected[0],freshSixDay7=freshSixExpected[1];
    const expectedTargetBooleans={
      firstSessionFocusedFellow100To250:inBand(focused1.fellow.lead.level,bands['first-substantial-session'].focused),
      firstSessionBroadFellow50To150OnFreshSixJoined:inBand(freshSixDay1.levelSummary.medianLow,bands['first-substantial-session'].broad)&&inBand(freshSixDay1.levelSummary.medianHigh,bands['first-substantial-session'].broad),
      firstWeekFocusedFellow450To550:inBand(focused7.fellow.lead.level,bands['end-first-week'].focused),
      firstWeekBroadFellow250To400OnFreshSixJoined:inBand(freshSixDay7.levelSummary.medianLow,bands['end-first-week'].broad)&&inBand(freshSixDay7.levelSummary.medianHigh,bands['end-first-week'].broad),
      earlyEstablishedFocusedFellow600To650At30Days:inBand(focused30.fellow.lead.level,bands['early-established'].focused),
      earlyEstablishedBroadFellow400To500At30Days:inBand(broad30.fellow.levelSummary.medianLow,bands['early-established'].broad)&&inBand(broad30.fellow.levelSummary.medianHigh,bands['early-established'].broad),
      longTermFocusedFellow700To750At365Days:inBand(focused365.fellow.lead.level,bands['long-term'].focused),
      longTermBroadFellow500To650At365Days:inBand(broad365.fellow.levelSummary.medianLow,bands['long-term'].broad)&&inBand(broad365.fellow.levelSummary.medianHigh,bands['long-term'].broad)
    };
    record('report-all-eight-handoff-pacing-cells-independently-assessed',same(Object.fromEntries(Object.keys(expectedTargetBooleans).map(key=>[key,target?.[key]])),expectedTargetBooleans));
    record('report-fresh-broad-uses-six-joined-not-synthetic-18',same(target?.freshSixBroad,freshSixExpected)&&target?.firstSessionBroadFellow50To150OnFreshSixJoined===expectedTargetBooleans.firstSessionBroadFellow50To150OnFreshSixJoined&&target?.firstWeekBroadFellow250To400OnFreshSixJoined===expectedTargetBooleans.firstWeekBroadFellow250To400OnFreshSixJoined&&target?.syntheticFull18FirstWeekBroadFellow250To400===(broad7.fellow.levelSummary.medianLow>=250&&broad7.fellow.levelSummary.medianHigh<=400)&&target?.full18BroadScenarioPrerequisite?.includes('synthetic full-18-roster')&&target?.dynamicRankJoinTimelineModeled===false);

    const migrationIds=new Set(report.migrations?.map(row=>row.fixtureId));
    record('report-exact-six-migration-recipes',report.migrations?.length===6&&contract.migrationRecipes.every(id=>id.endsWith('excess-at-cap')?[...migrationIds].some(actual=>actual.includes(id.startsWith('fellow')?'fellow-level-120-attributed-surplus':'companion-level-100-attributed-surplus')):id==='fellow-level-120'?migrationIds.has('fellow-level-120-exact-cap'):id==='companion-level-100'?migrationIds.has('companion-level-100-exact-cap'):migrationIds.has(id)));
    let migrationExact=true,migrationDetail='';
    for(const row of report.migrations||[]){
      const input=row.input,result=row.result,legacy=candidate.legacyExp[input.kind],levels=expectedByKind[input.kind],oldThreshold=legacyThreshold(legacy,input.savedLevel),atCap=input.savedLevel===legacy.levelCap,oldNext=atCap?null:legacyCost(legacy,input.savedLevel),within=atCap?0:input.rawExp-oldThreshold,newThreshold=levels[input.savedLevel-1].cumulativeExp,newNext=levels[input.savedLevel-1].expToNext,mapped=atCap?0:Math.floor(within*newNext/oldNext),bank=atCap?input.rawExp-oldThreshold:0,grand=candidate[input.kind].breakthroughs.filter(gate=>gate.level<input.savedLevel).map(gate=>gate.level),claim=input.kind==='companion'&&input.savedLevel===100;
      const core=structuredClone(result);delete core.receipt;delete core.expectedReceiptIdentity;const identity=compactHash(['phase24b.exp-curve-migration.provisional.v1',input,report.tables[input.kind].levelTableSha256,core]),firstHash=compactHash(result),valid=input.rawExp===input.lineage.baselineRawExp+input.lineage.attributedEarnedSurplus&&result.oldCurve.oldThreshold===oldThreshold&&result.oldCurve.oldNextCost===oldNext&&result.oldCurve.oldWithinLevelExp===within&&result.newCurve.newThreshold===newThreshold&&result.newCurve.mappedWithinLevelExp===mapped&&result.newCurve.activeExp===newThreshold+mapped&&result.newCurve.savedLevel===input.savedLevel&&result.legacyCapBankedExp===bank&&(!atCap||bank===input.lineage.attributedEarnedSurplus)&&same(result.grandfatheredGates,grand)&&result.levelPreserved===true&&result.rawExpNeverDirectlyReinterpreted===true&&result.receipt.identity===identity&&result.expectedReceiptIdentity===identity&&result.receipt.appliedExactlyOnce===true&&row.firstApplicationSha256===firstHash&&row.secondApplicationSha256===firstHash&&row.secondApplicationNoOp===true&&(!claim||result.legacyBreakthroughClaim?.level===100&&result.legacyBreakthroughClaim?.requirementUnits===0&&result.legacyBreakthroughClaim?.manual===true&&result.legacyBreakthroughClaim?.exactlyOnce===true&&result.nextOrdinaryGate===150)&&(input.kind!=='fellow'||input.savedLevel!==120||same(result.grandfatheredGates,[50,100])&&result.nextOrdinaryGate===150);
      if(!valid){migrationExact=false;migrationDetail=row.fixtureId;break}
    }
    record('report-all-migrations-independently-lossless-repeat-safe',migrationExact,migrationDetail);

    const collectionEvidence=report.collectionPolicyEvidence,claims=collectionEvidence?.claims||[];
    record('report-uncapped-collection-claims-exactly-once-and-future-growth',collectionEvidence?.mode==='uncapped-additive-named-pools'&&collectionEvidence?.stressBoundaryIsLifetimeCap===false&&collectionEvidence?.releaseBudgetsAreLifetimeCaps===false&&collectionEvidence?.allExactlyOnce===true&&collectionEvidence?.allContinueGrowth===true&&same(claims.map(row=>row.targetBps),contract.collectionStressBps)&&claims.every(row=>row.firstApplied===true&&row.afterFirst===row.targetBps&&row.replayApplied===false&&row.afterReplay===row.targetBps&&row.futureApplied===true&&row.afterFuture===row.targetBps+100&&row.clippedByLifetimeCap===false));
    const isolation=report.mandatoryContentIsolation,mandatoryRows=isolation?.rows||[],isolationPools=['power','earnings','exp','facility'],baselineRequirementHashes=baseline.observedTableHashes.requirements,expectedRequirementIdentity=compactHash(baselineRequirementHashes);
    let isolationExact=mandatoryRows.length===21&&same(isolation?.stressTotalsBps,contract.collectionStressBps)&&same(isolation?.pools,isolationPools),isolationDetail='';
    const mandatoryKeys=new Set();
    for(const row of mandatoryRows){
      const key=`${row.profile}:${row.stressBps}`;mandatoryKeys.add(key);
      const expectedPermanent=row.profile==='permanent-only'?row.stressBps:row.profile==='all-content'?Math.floor(row.stressBps*.7):0,expectedLimited=row.profile==='all-content'?row.stressBps-expectedPermanent:0,expectedRuntime=row.profile==='zero-collection'?0:row.stressBps;
      const poolsExact=isolationPools.every(pool=>row.runtimePoolTotalsBps?.[pool]===expectedRuntime&&row.permanentPoolTotalsBps?.[pool]===expectedPermanent&&row.limitedPoolTotalsBps?.[pool]===expectedLimited&&sum((row.sourcesByPool?.[pool]||[]).map(source=>source.bps))===expectedRuntime&&sum((row.sourcesByPool?.[pool]||[]).filter(source=>source.provenance==='permanent').map(source=>source.bps))===expectedPermanent&&sum((row.sourcesByPool?.[pool]||[]).filter(source=>source.provenance==='limited').map(source=>source.bps))===expectedLimited);
      const exact=['zero-collection','permanent-only','all-content'].includes(row.profile)&&contract.collectionStressBps.includes(row.stressBps)&&poolsExact&&same(row.requirementHashes,baselineRequirementHashes)&&row.requirementHashIdentity===expectedRequirementIdentity&&row.assumedForMandatoryAuthoring===(row.profile==='permanent-only');
      if(!exact){isolationExact=false;isolationDetail=row.id;break}
    }
    if(isolationExact)for(const profile of ['zero-collection','permanent-only','all-content'])for(const stress of contract.collectionStressBps)if(!mandatoryKeys.has(`${profile}:${stress}`))isolationExact=false;
    record('report-zero-permanent-all-content-requirements-provenance-isolated',isolationExact&&isolation?.profileCount===21&&isolation?.allRequirementHashesIdentical===true&&isolation?.requirementAuthoringProfile===candidate.collectionOwnershipFixtures.requirementAuthoringProfile&&isolation?.requirementAuthoringReadsOnlyPermanentFixture===true&&isolation?.limitedEventBonusExcludedFromRequirements===true&&isolation?.zeroCollectionMandatoryReachabilityEvaluated===true&&isolation?.dynamicScalingFromOwnership===false&&isolation?.limitedContributesToRuntimeAllContentTotals===true,isolationDetail);
    const probes=collectionEvidence?.adjacentBonusOrderProbes||[],probeFixture=candidate.collectionPolicy.adjacentBonusProbe,expectedAdjacent={power:probeFixture.existingBonusBps.powerMight,earnings:probeFixture.existingBonusBps.earningsOath,exp:probeFixture.existingBonusBps.expAuthored,facility:probeFixture.existingBonusBps.facilityAuthoredActive};
    let probesExact=probes.length===4;
    for(const probe of probes){const additive=Math.floor(probeFixture.baseAmount*(10000+expectedAdjacent[probe.pool]+probeFixture.representativeCollectionBps)/10000),compounded=Math.floor(probeFixture.baseAmount*(10000+expectedAdjacent[probe.pool])*(10000+probeFixture.representativeCollectionBps)/100000000);probesExact&&=probe.baseAmount===probeFixture.baseAmount&&probe.existingBonusBps===expectedAdjacent[probe.pool]&&probe.collectionBps===probeFixture.representativeCollectionBps&&probe.existingBonusBps>0&&probe.collectionBps>0&&probe.additiveResult===additive&&probe.forbiddenCompoundedResult===compounded&&additive!==compounded&&probe.forbiddenCompoundedRejected===true}
    record('report-nonzero-adjacent-collection-order-probes-independently-recomputed',probesExact&&collectionEvidence?.allAdjacentBonusOrderProbesNonVacuous===true&&same(Object.fromEntries(probes.map(row=>[row.pool,row.existingBonusBps])),expectedAdjacent));
    const delayed=report.delayedClaimEvidence;
    const delayedFixture=candidate.delayedClaimFixture,expectedCaptured={claimId:delayedFixture.id,capturedRewards:delayedFixture.capturedRewards,capturedAtEconomyGoldPerHour:delayedFixture.capturedAtEconomyGoldPerHour,capturedAtLevel:delayedFixture.capturedAtLevel},expectedCapturedIdentity=compactHash([delayedFixture.id,delayedFixture.capturedRewards,delayedFixture.capturedAtEconomyGoldPerHour,delayedFixture.capturedAtLevel]),expectedMigrationIdentity=compactHash(['phase24b-delayed-claim-migration-v1',expectedCapturedIdentity]);expectedCaptured.identity=expectedCapturedIdentity;
    const delayedPendingBefore={schemaVersion:1,status:'ready',receiptIdentity:expectedCapturedIdentity,captured:expectedCaptured,claimSequence:0},delayedPendingAfter={...delayedPendingBefore,schemaVersion:2,migrationReceiptIdentity:expectedMigrationIdentity},delayedClaimed={...delayedPendingAfter,status:'claimed',claimSequence:1,appliedRewards:delayedFixture.capturedRewards};
    const expectedForbidden={fellowExp:Math.floor(delayedFixture.capturedRewards.fellowExp*(10000+delayedFixture.laterAuthoredExpBps+delayedFixture.laterCollectionBps)/10000),facilityActiveReward:Math.floor(delayedFixture.capturedRewards.facilityActiveReward*(delayedFixture.laterEconomyGoldPerHour/delayedFixture.capturedAtEconomyGoldPerHour)*(10000+delayedFixture.laterAuthoredFacilityActiveBps+delayedFixture.laterFacilityBps)/10000)};
    record('report-delayed-claim-capture-and-lane-specific-no-repricing',delayed?.policy===delayedFixture.claimPolicy&&same(delayed?.captured,expectedCaptured)&&same(delayed?.laterState?.forbiddenHypotheticalRepricing,expectedForbidden)&&delayed?.laterState?.oathAppliedToFacilityReward===false&&delayed?.laterState?.repricingCounterfactualIsLaneSpecific===true&&delayed?.allExternalInputsChanged===true&&delayed?.capturedValuesUnchangedAfterGrowth===true);
    record('report-delayed-ready-and-claimed-migrations-repeat-safe',same(delayed?.pendingMigration?.before,delayedPendingBefore)&&same(delayed?.pendingMigration?.after,delayedPendingAfter)&&same(delayed?.pendingMigration?.second,delayedPendingAfter)&&delayed?.pendingMigration?.preserved===true&&delayed?.pendingMigration?.secondApplicationNoOp===true&&same(delayed?.claimedMigration?.before,delayedClaimed)&&same(delayed?.claimedMigration?.after,delayedClaimed)&&same(delayed?.claimedMigration?.second,delayedClaimed)&&delayed?.claimedMigration?.preserved===true&&delayed?.claimedMigration?.secondApplicationNoOp===true);
    record('report-delayed-claim-exactly-once-survives-persisted-reload',delayed?.firstApplied===true&&same(delayed?.afterFirst,delayedFixture.capturedRewards)&&delayed?.replayApplied===false&&same(delayed?.afterReplay,delayedFixture.capturedRewards)&&same(delayed?.persistedReloadReplay?.reloadedRecord,delayedClaimed)&&same(delayed?.persistedReloadReplay?.balancesBeforeReplay,delayedFixture.capturedRewards)&&delayed?.persistedReloadReplay?.replayApplied===false&&same(delayed?.persistedReloadReplay?.balancesAfterReplay,delayedFixture.capturedRewards)&&delayed?.persistedReloadReplay?.noOp===true&&delayed?.receiptIdentityStableAcrossReadyClaimedAndMigration===true&&delayed?.exactlyOnce===true);

    const ledger=report.collectionLedgerMigrationEvidence,ledgerFixture=candidate.collectionLedgerMigrationFixture,ledgerPools=['power','earnings','exp','facility'],ledgerTotals=Object.fromEntries(ledgerPools.map(pool=>[pool,sum(ledgerFixture.claimedEntries.filter(entry=>entry.pool===pool).map(entry=>entry.bps))])),ledgerPermanent=Object.fromEntries(ledgerPools.map(pool=>[pool,sum(ledgerFixture.claimedEntries.filter(entry=>entry.pool===pool&&entry.provenance==='permanent').map(entry=>entry.bps))])),ledgerLimited=Object.fromEntries(ledgerPools.map(pool=>[pool,sum(ledgerFixture.claimedEntries.filter(entry=>entry.pool===pool&&entry.provenance==='limited').map(entry=>entry.bps))])),ledgerCore={schemaVersion:2,fixtureId:ledgerFixture.id,namedPoolTotalsBps:ledgerTotals,permanentPoolTotalsBps:ledgerPermanent,limitedPoolTotalsBps:ledgerLimited,claimedEntries:ledgerFixture.claimedEntries,claimedReceiptIds:ledgerFixture.claimedEntries.map(entry=>entry.claimId).sort(),obsoleteDisplayedCapsBps:ledgerFixture.legacyDisplayedCapsBps,clippedToObsoleteCaps:false},ledgerExpected={...ledgerCore,migrationReceiptIdentity:compactHash(['phase24b-collection-ledger-migration-v1',ledgerCore])},afterFuture={...ledgerTotals,[ledgerFixture.futureGrant.pool]:ledgerTotals[ledgerFixture.futureGrant.pool]+ledgerFixture.futureGrant.bps};
    record('report-collection-ledger-migration-lossless-uncapped-repeat-safe',ledger?.policy===ledgerFixture.migrationPolicy&&same(ledger?.first,ledgerExpected)&&same(ledger?.second,ledgerExpected)&&ledger?.secondApplicationNoOp===true&&ledger?.noLoss===true&&ledger?.obsoleteCapsIgnored===true&&ledger?.replayOldApplied===false&&ledger?.futureApplied===true&&same(ledger?.afterFutureTotalsBps,afterFuture)&&ledger?.futureReplayApplied===false&&ledger?.futureGrantContinuesUncappedGrowth===true&&same(ledger?.exactNamedPoolTotalsExpected,ledgerTotals));

    const limited=report.limitedEventAlternativeEvidence,limitedFixture=candidate.limitedEventAlternativeFixture;
    const validateLimitedOrder=(result,first,second)=>result?.mechanicalPowerBps===limitedFixture.mechanicalBps&&result?.noDoubleMechanicalEntitlement===true&&result?.results?.length===3&&result.results[0]?.claimId===first.claimId&&result.results[0]?.claimApplied===true&&result.results[0]?.mechanicalApplied===true&&result.results[1]?.claimId===second.claimId&&result.results[1]?.claimApplied===true&&result.results[1]?.mechanicalApplied===false&&result.results[2]?.claimId===first.claimId&&result.results[2]?.claimApplied===false&&result.results[2]?.duplicateClaim===true&&result.preservedExclusiveMetadata?.length===1&&same(result.preservedExclusiveMetadata[0],limitedFixture.limitedClaim.exclusiveMetadata);
    record('report-limited-event-permanent-alternative-no-double-growth',limited?.policy===limitedFixture.policy&&limited?.growthEntitlementId===limitedFixture.growthEntitlementId&&limited?.equivalentPermanentSourceExists===true&&validateLimitedOrder(limited?.limitedThenPermanent,limitedFixture.limitedClaim,limitedFixture.permanentAlternativeClaim)&&validateLimitedOrder(limited?.permanentThenLimited,limitedFixture.permanentAlternativeClaim,limitedFixture.limitedClaim)&&limited?.allOrdersPreventDoubleMechanicalClaim===true&&limited?.limitedExclusiveMetadataPreserved===true);

    const lifecycleRows=report.manualBreakthroughLifecycleEvidence||[],lifecycleById=new Map(lifecycleRows.map(row=>[row.fixtureId,row]));
    let lifecycleExact=lifecycleRows.length===candidate.manualBreakthroughFixtures?.length,lifecycleDetail='';
    for(const fixture of candidate.manualBreakthroughFixtures||[]){
      const row=lifecycleById.get(fixture.id),levels=fixture.lane==='fellow'?expectedFellowLevels:expectedCompanionLevels,lane=candidate[fixture.lane],gate=lane.breakthroughs.find(item=>item.level===fixture.gateLevel),claimUnits=fixture.legacyFreeClaim?0:gate?.requirementUnits,receipt=compactHash(['phase24b-manual-breakthrough-v1',fixture.id,fixture.lane,fixture.gateLevel,claimUnits]),legacyReceipt=fixture.legacyFreeClaim?compactHash(['phase24b-legacy-breakthrough-migration-v1',fixture.id,fixture.gateLevel]):null;
      const power=level=>{const levelMultiplier=levels[level-1].levelMultiplier;if(fixture.lane==='fellow'){const rarity=1+(fixture.persistentState.rarityStars-1)*.08,relic=1+(fixture.persistentState.relicPowerBps??0)/10000;return Math.round(fixture.basePower*levelMultiplier*rarity*relic*(1+fixture.persistentState.mightBps/10000))}const rarity=1+(fixture.persistentState.rarityStars-1)*.1,mastery=1+fixture.persistentState.masteryLevel/100;return Math.round(fixture.basePower*levelMultiplier*rarity*mastery)};
      const preMigration={schemaVersion:1,lane:fixture.lane,actorId:fixture.actorId,basePower:fixture.basePower,level:fixture.gateLevel,bankedExp:0,materialUnits:fixture.initialMaterialUnits,gate:{level:fixture.gateLevel,authoredRequirementUnits:gate?.requirementUnits,claimRequirementUnits:claimUnits,status:fixture.legacyFreeClaim?'former-cap-awaiting-legacy-queue-migration':'closed-awaiting-manual-claim',receiptIdentity:receipt,legacyFreeClaim:fixture.legacyFreeClaim},persistentState:fixture.persistentState,derivedPower:power(fixture.gateLevel)};
      const initial=structuredClone(preMigration);if(fixture.legacyFreeClaim){initial.schemaVersion=2;initial.gate.status='closed-awaiting-manual-claim';initial.gate.legacyMigrationReceiptIdentity=legacyReceipt;initial.gate.legacyClaimQueued=true}
      const afterExp=structuredClone(initial);afterExp.bankedExp+=fixture.bankedExp;
      const afterGrant=structuredClone(afterExp);afterGrant.materialUnits+=fixture.materialGrantUnits;
      const claimed=structuredClone(afterGrant);claimed.materialUnits-=claimUnits;claimed.gate.status='claimed';claimed.gate.claimReceiptIdentity=receipt;claimed.gate.materialUnitsSpent=claimUnits;while(claimed.level<levels.length){const nextGate=lane.breakthroughs.find(item=>item.level===claimed.level);if(nextGate&&claimed.level!==fixture.gateLevel)break;const cost=levels[claimed.level-1].expToNext;if(claimed.bankedExp<cost)break;claimed.bankedExp-=cost;claimed.level++}claimed.derivedPower=power(claimed.level);
      const expectedLegacyMigration=fixture.legacyFreeClaim?{before:preMigration,after:initial,second:initial,queuedNotAutoClaimed:true,secondApplicationNoOp:true}:null,expectedReplay={applied:false,reason:'receipt-already-claimed',state:claimed};
      const exact=row&&same(row.legacyQueueMigration,expectedLegacyMigration)&&same(row.initial,initial)&&same(row.afterExpDeposit,afterExp)&&row.expBankedAtClosedGate===true&&row.insufficientAttempt?.applied===false&&row.insufficientAttempt?.reason===(fixture.legacyFreeClaim?'not-applicable-free-legacy-claim':'insufficient-materials')&&row.insufficientAttempt?.stateSha256===compactHash(afterExp)&&row.insufficientAttempt?.exactNoOp===true&&same(row.afterMaterialGrant,afterGrant)&&row.successfulClaim?.applied===true&&row.successfulClaim?.reason==='manual-claim-applied'&&same(row.successfulClaim?.state,claimed)&&same(row.persistedReload?.record,claimed)&&same(row.persistedReload?.replay,expectedReplay)&&row.persistedReload?.replayNoOp===true&&row.nextOrdinaryGate===lane.breakthroughs.find(item=>item.level>fixture.gateLevel)?.level&&row.manualOnly===true&&row.exactMaterialSpend===true&&row.bankedExpAdvancedOnlyAfterClaim===true&&row.persistentStatePreserved===true&&row.derivedPowerChangedOnlyWithIntendedLevelAdvancement===true&&row.stableClaimReceipt===true&&row.exactlyOnceAcrossReload===true&&(!fixture.legacyFreeClaim||same(row.legacyMigrationReapply,{record:claimed,noOp:true,noDuplicateEntitlement:true}));
      if(!exact){lifecycleExact=false;lifecycleDetail=fixture.id;break}
    }
    record('report-manual-breakthrough-lifecycle-independently-recomputed',lifecycleExact,lifecycleDetail);
    record('report-breakthrough-preserves-earned-state-and-kind-specific-rarity',lifecycleRows.every(row=>same(row.initial?.persistentState,row.afterExpDeposit?.persistentState)&&same(row.initial?.persistentState,row.successfulClaim?.state?.persistentState)&&same(row.initial?.persistentState,row.persistedReload?.record?.persistentState))&&candidate.manualBreakthroughFixtures.some(row=>row.lane==='fellow'&&row.persistentState.relicId&&row.persistentState.assignedCompanionId&&row.persistentState.mightBps>0)&&candidate.manualBreakthroughFixtures.some(row=>row.lane==='companion'&&row.persistentState.assignedFellowId&&row.persistentState.masteryLevel>0));

    const numbers=[];(function scan(value,path='$'){if(typeof value==='number')numbers.push({path,value});else if(Array.isArray(value))value.forEach((item,index)=>scan(item,`${path}[${index}]`));else if(value&&typeof value==='object')Object.entries(value).forEach(([key,item])=>scan(item,`${path}.${key}`))})(report);
    record('report-all-numbers-finite-and-integers-safe',numbers.every(row=>Number.isFinite(row.value)&&(!Number.isInteger(row.value)||Number.isSafeInteger(row.value))),numbers.filter(row=>!Number.isFinite(row.value)||Number.isInteger(row.value)&&!Number.isSafeInteger(row.value)).slice(0,10));
    record('report-safe-integer-audit-has-headroom',report.safeIntegerAudit?.ok===true&&report.safeIntegerAudit?.unsafe?.length===0&&safe(report.safeIntegerAudit?.remainingHeadroom)&&report.safeIntegerAudit.remainingHeadroom>0);
    const highGold=report.safeIntegerAudit?.theoretical?.trueHighEconomyAt1000PercentCollection,oathBps=3000,collectionEarningsBps=100000,preOathGoldPerHour=high.economy.totalGoldPerHour/(1+oathBps/10000),expectedHighGoldPerHour=preOathGoldPerHour*(1+(oathBps+collectionEarningsBps)/10000),expectedDailyClaim=Math.floor(expectedHighGoldPerHour*24),expected365Gold=active.economy.freshGold+expectedDailyClaim*365,forbiddenCompoundedGoldPerHour=high.economy.totalGoldPerHour*(1+collectionEarningsBps/10000);
    record('report-safe-audit-true-high-365day-gold-at-1000-percent-independently-recomputed',close(highGold?.preOathGoldPerHour,preOathGoldPerHour)&&highGold?.oathBonusBps===oathBps&&highGold?.collectionEarningsBps===collectionEarningsBps&&close(highGold?.goldPerHour,expectedHighGoldPerHour)&&highGold?.daily24HourClaim===expectedDailyClaim&&highGold?.dailyClaimCount===365&&highGold?.accumulatedGoldAfter365DailyClaims===expected365Gold&&highGold?.isSafeInteger===true&&Number.isSafeInteger(expected365Gold)&&!close(expectedHighGoldPerHour,forbiddenCompoundedGoldPerHour));
  }
}

for(const path of ['qa/phase-24b-independent/verify.mjs']){
  const syntax=spawnSync(NODE,['--check',path],{cwd:ROOT,encoding:'utf8'});
  record(`syntax-${path.split('/').at(-1)}`,syntax.status===0,syntax.stderr.trim());
}
record('independent-contract-and-result-documents-present',existsSync(rel('docs/PHASE_24B_PROGRESSION_SIMULATION_QA_CONTRACT.md'))&&existsSync(rel('docs/PHASE_24B_PROGRESSION_SIMULATION_QA_RESULT.md')));

const passed=rows.filter(row=>row.pass).length;
const failed=rows.length-passed;
for(const row of rows)console.log(`${row.pass?'PASS':'FAIL'} ${row.id}${row.detail?` — ${typeof row.detail==='string'?row.detail:JSON.stringify(row.detail)}`:''}`);
console.log(`RESULT ${passed} passed, ${failed} failed`);
process.exitCode=failed?1:0;
