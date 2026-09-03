#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CANDIDATE_PATH = resolve(ROOT, 'design/phase-24/phase24b-progression-candidates.json');
const BASELINE_PATH = resolve(ROOT, 'qa/phase-24-baseline/reports/phase24a-balance-report.json');
const REPORT_DIR = resolve(ROOT, 'qa/phase-24b-progression/reports');
const JSON_PATH = resolve(REPORT_DIR, 'phase24b-progression-simulation.json');
const MD_PATH = resolve(REPORT_DIR, 'phase24b-progression-simulation.md');
const CHECKSUM_PATH = resolve(REPORT_DIR, 'checksums.sha256');
const MAX_SAFE = Number.MAX_SAFE_INTEGER;

const fail = message => { throw new Error(`Phase 24B simulation refused: ${message}`); };
const sum = values => values.reduce((total, value) => total + value, 0);
const sha256 = value => createHash('sha256').update(value).digest('hex');
const jsonText = value => `${JSON.stringify(value, null, 2)}\n`;
const clone = value => JSON.parse(JSON.stringify(value));
const assert = (pass, message) => { if (!pass) fail(message); };
const isSafeNonnegative = value => Number.isSafeInteger(value) && value >= 0;

function ratioText(numerator, denominator) {
  return `${numerator}/${denominator}`;
}

function tableHash(value) {
  return sha256(JSON.stringify(value));
}

function distributeInteger(total, count) {
  assert(isSafeNonnegative(total) && Number.isSafeInteger(count) && count > 0, 'invalid deterministic allocation');
  const base = Math.floor(total / count);
  const remainder = total - base * count;
  return Array.from({ length: count }, (_, index) => base + Number(index < remainder));
}

function distributeFocused(total, count, leadShareBps) {
  assert(isSafeNonnegative(total) && Number.isSafeInteger(count) && count > 1, 'invalid focused allocation');
  const lead = Math.floor(total * leadShareBps / 10000);
  return [lead, ...distributeInteger(total - lead, count - 1)];
}

function expandExpBands(config, expansion) {
  const transitions = [];
  let expectedFrom = 1;
  for (const band of config.expBands) {
    assert(band.fromLevel === expectedFrom, `noncontiguous EXP band at ${band.fromLevel}`);
    assert(Number.isSafeInteger(band.toLevel) && band.toLevel > band.fromLevel && band.toLevel <= config.levelCap, `invalid EXP band endpoint ${band.toLevel}`);
    assert(isSafeNonnegative(band.totalExp) && band.totalExp > 0, `invalid EXP band total at ${band.toLevel}`);
    const count = band.toLevel - band.fromLevel;
    const weights = Array.from({ length: count }, (_, index) => expansion.startWeight + expansion.weightStep * index);
    const weightTotal = sum(weights);
    const costs = weights.map(weight => Math.floor(band.totalExp * weight / weightTotal));
    let remainder = band.totalExp - sum(costs);
    for (let index = costs.length - 1; remainder > 0; index = (index - 1 + costs.length) % costs.length) {
      costs[index] += 1;
      remainder -= 1;
    }
    assert(sum(costs) === band.totalExp, `EXP band does not sum at ${band.toLevel}`);
    for (let index = 1; index < costs.length; index++) assert(costs[index] >= costs[index - 1], `EXP costs decrease inside band ending ${band.toLevel}`);
    costs.forEach((expCost, index) => transitions.push({
      fromLevel: band.fromLevel + index,
      toLevel: band.fromLevel + index + 1,
      expCost,
      bandFromLevel: band.fromLevel,
      bandToLevel: band.toLevel,
      bandTotalExp: band.totalExp
    }));
    expectedFrom = band.toLevel;
  }
  assert(expectedFrom === config.levelCap, `EXP bands end at ${expectedFrom}, expected ${config.levelCap}`);
  assert(transitions.length === config.levelCap - 1, `expected ${config.levelCap - 1} EXP transitions`);
  for (let index = 1; index < transitions.length; index++) assert(transitions[index].expCost >= transitions[index - 1].expCost, `EXP cost decreases at Level ${transitions[index].fromLevel}`);
  return transitions;
}

function fellowLevelMultiplier(level, config) {
  if (level <= config.linearThroughLevel) return 1 + config.linearGrowthPerLevel * (level - 1);
  const anchors = config.anchors;
  const upperIndex = anchors.findIndex(anchor => anchor.level >= level);
  assert(upperIndex > 0, `missing Fellow multiplier anchor for Level ${level}`);
  const lower = anchors[upperIndex - 1], upper = anchors[upperIndex];
  const fraction = (level - lower.level) / (upper.level - lower.level);
  return lower.multiplier + (upper.multiplier - lower.multiplier) * fraction;
}

function companionLevelMultiplier(level, config) {
  return 1 + config.growthPerLevel * (level - 1);
}

function buildLevelTable(kind, config, expansion) {
  const transitions = expandExpBands(config, expansion);
  const costByFromLevel = Object.fromEntries(transitions.map(row => [row.fromLevel, row.expCost]));
  const cumulativeByLevel = { 1: 0 };
  let cumulative = 0;
  for (const transition of transitions) {
    cumulative += transition.expCost;
    assert(Number.isSafeInteger(cumulative), `${kind} cumulative EXP is unsafe`);
    cumulativeByLevel[transition.toLevel] = cumulative;
  }
  const breakthroughByLevel = Object.fromEntries(config.breakthroughs.map(row => [row.level, row.requirementUnits]));
  const rows = Array.from({ length: config.levelCap }, (_, index) => {
    const level = index + 1;
    const multiplier = kind === 'fellow'
      ? fellowLevelMultiplier(level, config.levelMultiplier)
      : companionLevelMultiplier(level, config.levelMultiplier);
    return {
      level,
      cumulativeExp: cumulativeByLevel[level],
      expToNext: level === config.levelCap ? null : costByFromLevel[level],
      levelMultiplier: Number(multiplier.toFixed(9)),
      breakthroughRequirementUnits: breakthroughByLevel[level] ?? null
    };
  });
  assert(rows.every((row, index) => index === 0 || row.cumulativeExp >= rows[index - 1].cumulativeExp), `${kind} cumulative table decreases`);
  assert(rows.every((row, index) => index === 0 || row.levelMultiplier >= rows[index - 1].levelMultiplier), `${kind} multiplier table decreases`);
  return {
    kind,
    levelCap: config.levelCap,
    transitionCount: transitions.length,
    cumulativeExpAtCap: cumulative,
    expBands: clone(config.expBands),
    breakthroughs: clone(config.breakthroughs),
    transitions,
    rows,
    costByFromLevel,
    cumulativeByLevel,
    breakthroughByLevel,
    transitionTableSha256: tableHash(transitions),
    levelTableSha256: tableHash(rows)
  };
}

function simulateProgress(table, earnedExp, availableBreakthroughUnits, grandfatheredGates = []) {
  assert(isSafeNonnegative(earnedExp) && isSafeNonnegative(availableBreakthroughUnits), 'unsafe simulation input');
  const grandfathered = new Set(grandfatheredGates);
  let level = 1, consumedExp = 0, consumedUnits = 0;
  const completedBreakthroughs = [];
  let nextClosedBreakthrough = null;
  while (level < table.levelCap) {
    const requirement = table.breakthroughByLevel[level];
    if (requirement !== undefined && !grandfathered.has(level) && !completedBreakthroughs.includes(level)) {
      if (availableBreakthroughUnits - consumedUnits < requirement) {
        nextClosedBreakthrough = { level, requirementUnits: requirement, missingUnits: requirement - (availableBreakthroughUnits - consumedUnits) };
        break;
      }
      consumedUnits += requirement;
      completedBreakthroughs.push(level);
    }
    const cost = table.costByFromLevel[level];
    if (earnedExp - consumedExp < cost) break;
    consumedExp += cost;
    level += 1;
  }
  return {
    level,
    earnedExp,
    consumedExp,
    bankedExp: earnedExp - consumedExp,
    availableBreakthroughUnits,
    consumedBreakthroughUnits: consumedUnits,
    bankedBreakthroughUnits: availableBreakthroughUnits - consumedUnits,
    completedBreakthroughs,
    nextClosedBreakthrough,
    atLevelCap: level === table.levelCap
  };
}

function summaryLevels(progressRows) {
  const levels = progressRows.map(row => row.level).sort((a, b) => a - b);
  const lowIndex = Math.floor((levels.length - 1) / 2), highIndex = Math.ceil((levels.length - 1) / 2);
  return { min: levels[0], medianLow: levels[lowIndex], medianHigh: levels[highIndex], max: levels[levels.length - 1] };
}

function highestReachable(requirements, power) {
  let highest = 0;
  for (const requirement of requirements) {
    if (power < requirement) break;
    highest += 1;
  }
  return highest;
}

function expeditionReachability(requirements, members) {
  const available = [...members].sort((a, b) => a.power - b.power || a.order - b.order);
  const stageResults = [];
  for (let index = 0; index < requirements.length; index++) {
    const requirement = requirements[index];
    const memberIndex = available.findIndex(member => member.power >= requirement);
    if (memberIndex < 0) break;
    const [member] = available.splice(memberIndex, 1);
    stageResults.push({ stage: index + 1, requirement, memberId: member.id, power: member.power });
  }
  return {
    highestStage: stageResults.length,
    structuralRosterCeiling: members.length,
    tableStageCap: requirements.length,
    blockedByRosterExhaustion: stageResults.length === members.length && members.length < requirements.length,
    nextRequirement: requirements[stageResults.length] ?? null,
    stageResults
  };
}

function assertBaseline(candidate, baseline, baselineText) {
  assert(sha256(baselineText) === candidate.baseline.reportSha256, 'Phase 24A report hash changed');
  assert(baseline.contractId === candidate.baseline.contractId, 'Phase 24A contract identity changed');
  assert(baseline.authority.configId === candidate.baseline.authorityConfigId, 'Phase 24A authority identity changed');
  const byId = Object.fromEntries(baseline.profiles.map(profile => [profile.profileId, profile]));
  const fresh = byId['phase24a.fresh.schema13.v1'];
  const migrated = byId['phase24a.migrated-established.schema13.v1'];
  const high = byId['phase24a.true-high-investment.schema13.v1'];
  assert(fresh.fellowEconomy.rosterPower === candidate.baseline.requiredFreshAnchors.fellowEconomyPower, 'fresh Fellow Economy anchor changed');
  assert(fresh.fellowCombat.rosterPower === candidate.baseline.requiredFreshAnchors.fellowCombatPower, 'fresh Fellow Combat anchor changed');
  assert(fresh.companion.actualRosterPower === candidate.baseline.requiredFreshAnchors.companionPower, 'fresh Companion anchor changed');
  assert(fresh.economy.totalGoldPerHour === candidate.baseline.requiredFreshAnchors.villageGoldPerHour, 'fresh Gold/hour anchor changed');
  assert(migrated.fellowCombat.rosterPower === candidate.baseline.requiredMigratedAnchors.fellowCombatPower, 'migrated Fellow Combat anchor changed');
  assert(migrated.companion.actualRosterPower === candidate.baseline.requiredMigratedAnchors.companionActualPower, 'migrated Companion anchor changed');
  assert(migrated.companion.migrationFloorRosterPower === candidate.baseline.requiredMigratedAnchors.companionMigrationFloorPower, 'migrated Companion floor changed');
  assert(migrated.economy.totalGoldPerHour === candidate.baseline.requiredMigratedAnchors.villageGoldPerHour, 'migrated Gold/hour changed');
  assert(high.fellowEconomy.rosterPower === candidate.baseline.requiredHighAnchors.fellowEconomyPower, 'high Fellow Economy anchor changed');
  assert(high.fellowCombat.rosterPower === candidate.baseline.requiredHighAnchors.fellowCombatPower, 'high Fellow Combat anchor changed');
  assert(high.companion.actualRosterPower === candidate.baseline.requiredHighAnchors.companionPower, 'high Companion anchor changed');
  assert(high.economy.totalGoldPerHour === candidate.baseline.requiredHighAnchors.villageGoldPerHour, 'high Gold/hour changed');
  assert(baseline.profiles.every(profile => profile.collection.contributionBps === 0 && profile.collection.multiplier === 1), 'Phase 24A Collection baseline is not neutral');
  return { fresh, migrated, high };
}

function currentCampaignCost(totalPower, baseCost, requirement) {
  const surplusRatio = Math.max(0, (totalPower - requirement) / requirement);
  const discount = Math.min(0.35, surplusRatio * 0.25);
  return { discount, effectiveCost: Math.ceil(baseCost * (1 - discount)) };
}

function currentLiveThroughput(candidate, baseline, profiles) {
  const horizons = candidate.throughput.horizonsDays;
  const source = candidate.throughput.currentLive;
  const fresh = profiles.fresh;
  const startGold = baseline.authority.definitions.active.economy.freshGold;
  const goldPerHour = fresh.economy.totalGoldPerHour;
  const fellowRequirements = fresh.requirements.fellowCampaign;
  const fellowBaseCosts = baseline.authority.definitions.active.campaign.baseCost;
  const accessibleFellowStages = highestReachable(fellowRequirements, fresh.fellowCombat.rosterPower);
  const fellowStages = Array.from({ length: accessibleFellowStages }, (_, index) => ({
    stage: index + 1,
    requirement: fellowRequirements[index],
    firstClearExp: source.fellowCampaign.firstClearExpByStage[index],
    replayExp: source.fellowCampaign.replayExpByStage[index],
    ...currentCampaignCost(fresh.fellowCombat.rosterPower, fellowBaseCosts[index], fellowRequirements[index])
  }));
  const fellowFirstCost = sum(fellowStages.map(row => row.effectiveCost));
  const fellowFirstExp = sum(fellowStages.map(row => row.firstClearExp));
  const fellowBestReplay = fellowStages.reduce((best, row) => !best || row.replayExp * best.effectiveCost > best.replayExp * row.effectiveCost ? row : best, null);

  const companionRequirements = fresh.requirements.companionCampaign;
  const accessibleCompanionStages = highestReachable(companionRequirements, fresh.companion.actualRosterPower);
  const companionStages = Array.from({ length: accessibleCompanionStages }, (_, index) => ({
    stage: index + 1,
    requirement: companionRequirements[index],
    baseCost: 8000 + 1500 * index,
    firstClearExp: source.companionCampaign.firstClearExpByStage[index],
    replayExp: source.companionCampaign.replayExpByStage[index],
    ...currentCampaignCost(fresh.companion.actualRosterPower, 8000 + 1500 * index, companionRequirements[index])
  }));
  const companionFirstCost = sum(companionStages.map(row => row.effectiveCost));
  const companionFirstExp = sum(companionStages.map(row => row.firstClearExp));
  const companionBestReplay = companionStages.reduce((best, row) => !best || row.replayExp * best.effectiveCost > best.replayExp * row.effectiveCost ? row : best, null);
  const accessibleTowerFloor = highestReachable(Object.values(fresh.requirements.companionTower), fresh.companion.actualRosterPower);
  const powerOnlyTowerClearAccountExp = sum(Array.from({ length: accessibleTowerFloor }, (_, index) =>
    source.companionTower.clearExpBasePerTarget + source.companionTower.clearExpStepPerFloor * index));
  const powerOnlyTowerIdleExpPerHourPerCompanion = source.companionTower.idleExpBasePerHourPerCompanion
    + source.companionTower.idleExpPerFloorPerHourPerCompanion * accessibleTowerFloor;
  assert(powerOnlyTowerClearAccountExp <= source.companionTower.floorFiftyClearTotalAccountExp, 'power-only Tower clear EXP exceeds floor-50 total');
  const towerTargetRotation = floorCount => {
    const perTargetAccountExp = Array(20).fill(0);
    for (let floor = 1; floor <= floorCount; floor++) {
      perTargetAccountExp[(floor - 1) % perTargetAccountExp.length] += source.companionTower.clearExpBasePerTarget
        + source.companionTower.clearExpStepPerFloor * (floor - 1);
    }
    return { floorCount, targetCount: perTargetAccountExp.length, perTargetAccountExp, totalAccountExp: sum(perTargetAccountExp), awardSemantics: 'one-rotating-target-per-floor' };
  };
  const frozenPowerTowerTargetRotation = towerTargetRotation(accessibleTowerFloor);
  const floorFiftyTowerTargetRotation = towerTargetRotation(50);
  assert(frozenPowerTowerTargetRotation.totalAccountExp === powerOnlyTowerClearAccountExp, 'Tower target rotation changed frozen-power clear total');
  assert(floorFiftyTowerTargetRotation.totalAccountExp === source.companionTower.floorFiftyClearTotalAccountExp, 'Tower target rotation changed floor-50 clear total');
  const unlocks = source.rankUnlocks;
  assert(unlocks.freshRank === 1 && unlocks.companionCampaignRank === 2 && unlocks.companionTowerRank === 3, 'released Companion rank unlocks changed');
  assert(unlocks.firstTwoFellowStageRankExp >= unlocks.rank2Exp && unlocks.firstTwoFellowStageRankExp < unlocks.rank3Exp, 'Rank prerequisite evidence changed');
  assert(accessibleFellowStages === 2 && fellowFirstCost === 19716, 'fresh static Rank-2 prerequisite cost changed');
  const proposedByDays = Object.fromEntries(candidate.throughput.proposedLaunchExpBudget.rows.map(row => [row.days, row]));

  const rows = horizons.map(days => {
    const goldAvailable = Math.floor(startGold + goldPerHour * 24 * days);
    const fellowReplayCount = Math.max(0, Math.floor((goldAvailable - fellowFirstCost) / fellowBestReplay.effectiveCost));
    const fellowExp = fellowFirstExp + fellowReplayCount * fellowBestReplay.replayExp;
    const companionGoldAfterRank2Prerequisite = Math.max(0, goldAvailable - fellowFirstCost);
    const companionCampaignUnlocked = companionGoldAfterRank2Prerequisite >= companionFirstCost;
    const companionReplayCount = companionCampaignUnlocked ? Math.max(0, Math.floor((companionGoldAfterRank2Prerequisite - companionFirstCost) / companionBestReplay.effectiveCost)) : 0;
    const companionCampaignExp = companionCampaignUnlocked ? companionFirstExp + companionReplayCount * companionBestReplay.replayExp : 0;
    const companionPowerOnlyReplayCount = Math.max(0, Math.floor((goldAvailable - companionFirstCost) / companionBestReplay.effectiveCost));
    const companionCampaignPowerOnlyExp = companionFirstExp + companionPowerOnlyReplayCount * companionBestReplay.replayExp;
    const powerOnlyTowerUpperExp = powerOnlyTowerClearAccountExp
      + powerOnlyTowerIdleExpPerHourPerCompanion * 20 * 24 * days;
    const floorFiftyUpperExp = source.companionTower.floorFiftyClearTotalAccountExp
      + source.companionTower.floorFiftyIdleExpPerHourPerCompanion * 20 * 24 * days;
    const companionStaticCampaignLowerBoundExp = companionCampaignExp;
    const companionPowerOnlyUpperExp = companionCampaignExp + powerOnlyTowerUpperExp;
    const companionFloorFiftyUpperExp = companionCampaignExp + floorFiftyUpperExp;
    const noUnlockNoSharedGoldPowerOnlyUpperExp = companionCampaignPowerOnlyExp + powerOnlyTowerUpperExp;
    const noUnlockNoSharedGoldFloorFiftyUpperExp = companionCampaignPowerOnlyExp + floorFiftyUpperExp;
    const proposed = proposedByDays[days];
    return {
      days,
      goldAvailable,
      fellow: {
        accessibleStageCountAtFrozenFreshPower: accessibleFellowStages,
        firstClearExp: fellowFirstExp,
        firstClearGoldCost: fellowFirstCost,
        bestGoldLimitedReplayStage: fellowBestReplay.stage,
        replayEffectiveCost: fellowBestReplay.effectiveCost,
        replayCount: fellowReplayCount,
        staticFreshPowerLowerBoundAccountExp: fellowExp,
        proposedBudgetExp: proposed.fellowRawExp,
        shortfallExp: Math.max(0, proposed.fellowRawExp - fellowExp),
        staticAsPercentOfProposed: Number((100 * fellowExp / proposed.fellowRawExp).toFixed(4)),
        breakthroughUnits: 0
      },
      companion: {
        requiredRank: unlocks.companionCampaignRank,
        rank2Prerequisite: { fellowFirstClearStageCount: accessibleFellowStages, rankExp: unlocks.firstTwoFellowStageRankExp, goldCost: fellowFirstCost, chargedBeforeCompanionCampaign: true },
        goldAfterRank2Prerequisite: companionGoldAfterRank2Prerequisite,
        companionCampaignUnlocked,
        accessibleCampaignStageCountAtFrozenFreshPower: accessibleCompanionStages,
        powerOnlyTowerFloorAtFrozenFreshPower: accessibleTowerFloor,
        towerRequiredRank: unlocks.companionTowerRank,
        towerRankUnlockProven: false,
        rank2AccessibleStaticCampaignLowerBoundAccountExp: companionStaticCampaignLowerBoundExp,
        campaignTargetSemantics: 'one-rotating-target-per-clear-or-replay',
        campaignPowerOnlyNoRankNoSharedGoldExp: companionCampaignPowerOnlyExp,
        powerOnlyTowerClearAccountExp,
        powerOnlyTowerIdleExpPerHourPerCompanion,
        powerOnlyTowerUpperExp,
        towerIncludedInStaticCampaignLowerBound: false,
        powerOnlyAccountExpUpperEnvelope: companionPowerOnlyUpperExp,
        unavailableAtFreshFloorFiftyAccountExpUpperEnvelope: companionFloorFiftyUpperExp,
        noUnlockNoSharedGoldPowerOnlyAccountExpUpperEnvelope: noUnlockNoSharedGoldPowerOnlyUpperExp,
        noUnlockNoSharedGoldFloorFiftyAccountExpUpperEnvelope: noUnlockNoSharedGoldFloorFiftyUpperExp,
        proposedBudgetExp: proposed.companionRawExp,
        staticCampaignShortfallExp: Math.max(0, proposed.companionRawExp - companionStaticCampaignLowerBoundExp),
        staticCampaignAsPercentOfProposed: Number((100 * companionStaticCampaignLowerBoundExp / proposed.companionRawExp).toFixed(4)),
        breakthroughUnits: 0
      }
    };
  });
  return {
    status: source.status,
    sourcePolicy: source.goldPolicy,
    interpretation: 'conservative-static-bounds-only-not-a-dynamic-live-progression-forecast',
    dynamicFeedbackLoopModeled: false,
    deliberatelyOmittedFeedback: ['earned EXP -> old-curve Levels', 'Levels -> Power', 'Rank-crossing Fellow joins -> roster Power', 'new Power -> later Campaign stages or Tower floors', 'post-Rank2 route to Rank3'],
    sharedGoldWarning: 'The Companion envelope first charges the two Fellow clears required for Rank 2, then spends the remaining Gold on Companion Campaign. The separate Fellow envelope spends the full Gold on Fellow replays, so the two envelope totals still cannot be added.',
    lowerBoundPolicy: 'A player can keep replaying the already open stage at frozen fresh Power, so these Campaign values are conservative achievable lower bounds; they are not exact horizon forecasts.',
    unprovenGap: 'The simulator does not claim an exact released progression forecast until the full old-curve EXP -> Level -> Power -> Rank join -> access loop is modeled with one conserved Gold ledger.',
    fixedFreshInputs: { startGold, goldPerHour, fellowCombatPower: fresh.fellowCombat.rosterPower, companionPower: fresh.companion.actualRosterPower },
    fellowAccessibleStages: fellowStages,
    companionAccessibleStages: companionStages,
    towerClearTargetRotation: {
      frozenFreshPower: frozenPowerTowerTargetRotation,
      floorFiftyPowerOnly: floorFiftyTowerTargetRotation,
      idleSemantics: 'all-20-companions-per-hour'
    },
    rows
  };
}

function companionCapRoundingEvidence(candidate, baseline, companionTable) {
  const basePower = baseline.authority.definitions.active.companion.basePower;
  const bases = Object.values(basePower);
  const baseAggregate = sum(bases);
  const levelMultiplier = companionTable.rows.at(-1).levelMultiplier;
  const fixture = (id, rarityMultiplier, masteryMultiplier, expectedActual, expectedTheoretical) => {
    const memberRows = Object.entries(basePower).map(([companionId, base]) => ({
      companionId,
      basePower: base,
      unroundedPower: base * levelMultiplier * rarityMultiplier * masteryMultiplier,
      actualPower: Math.round(base * levelMultiplier * rarityMultiplier * masteryMultiplier)
    }));
    const actualMemberRoundedTotal = sum(memberRows.map(row => row.actualPower));
    const theoreticalAggregateUnrounded = baseAggregate * levelMultiplier * rarityMultiplier * masteryMultiplier;
    assert(actualMemberRoundedTotal === expectedActual, `${id} Companion member-rounded anchor changed`);
    assert(theoreticalAggregateUnrounded === expectedTheoretical, `${id} Companion theoretical anchor changed`);
    return { id, level: candidate.companion.levelCap, rarityMultiplier, masteryMultiplier, baseAggregate, levelMultiplier, actualMemberRoundedTotal, theoreticalAggregateUnrounded, gameplayReachabilityUses: 'actualMemberRoundedTotal', memberRows };
  };
  return {
    roundingOrder: ['basePower', 'levelMultiplier', 'rarityMultiplier', 'masteryMultiplier', 'round-per-member', 'sum-rounded-members'],
    fixtures: [
      fixture('level500-star1-mastery0', 1, 1, 111985, 111980),
      fixture('level500-star5-mastery0', 1.4, 1, 156775, 156772),
      fixture('level500-star5-mastery50', 1.4, 1.5, 235155, 235158)
    ]
  };
}

function collectionPolicyEvidence(candidate) {
  const claims = candidate.collectionStressBps.map(targetBps => {
    const claimId = `phase24b.collection-stress.${targetBps}`;
    const ledger = new Set();
    let totalBps = 0;
    const apply = (id, amount) => {
      if (ledger.has(id)) return false;
      assert(isSafeNonnegative(amount), 'invalid Collection claim amount');
      totalBps += amount;
      assert(Number.isSafeInteger(totalBps), 'Collection total is unsafe');
      ledger.add(id);
      return true;
    };
    const firstApplied = apply(claimId, targetBps), afterFirst = totalBps;
    const replayApplied = apply(claimId, targetBps), afterReplay = totalBps;
    const futureApplied = apply(`${claimId}.future-plus-100`, 100), afterFuture = totalBps;
    return { targetBps, firstApplied, afterFirst, replayApplied, afterReplay, futureApplied, afterFuture, clippedByLifetimeCap: false, exactlyOnce: firstApplied && !replayApplied && afterReplay === afterFirst, futureCollectionContinuesGrowth: futureApplied && afterFuture === targetBps + 100 };
  });
  const probe = candidate.collectionPolicy.adjacentBonusProbe;
  const probeDefinitions = [
    { pool: 'power', adjacentLane: 'Might', existingBonusBps: probe.existingBonusBps.powerMight },
    { pool: 'earnings', adjacentLane: 'Oath', existingBonusBps: probe.existingBonusBps.earningsOath },
    { pool: 'exp', adjacentLane: 'authored EXP bonus', existingBonusBps: probe.existingBonusBps.expAuthored },
    { pool: 'facility', adjacentLane: 'authored facility active bonus', existingBonusBps: probe.existingBonusBps.facilityAuthoredActive }
  ];
  const adjacentBonusOrderProbes = probeDefinitions.map(definition => {
    const additiveResult = Math.floor(probe.baseAmount * (10000 + definition.existingBonusBps + probe.representativeCollectionBps) / 10000);
    const forbiddenCompoundedResult = Math.floor(probe.baseAmount * (10000 + definition.existingBonusBps) * (10000 + probe.representativeCollectionBps) / 100000000);
    assert(additiveResult !== forbiddenCompoundedResult, `${definition.pool} Collection order probe is vacuous`);
    return {
      ...definition,
      baseAmount: probe.baseAmount,
      collectionBps: probe.representativeCollectionBps,
      requiredFormula: 'base*(10000+existingBonusBps+collectionBps)/10000',
      additiveResult,
      forbiddenFormula: 'base*(10000+existingBonusBps)*(10000+collectionBps)/100000000',
      forbiddenCompoundedResult,
      forbiddenCompoundedRejected: true
    };
  });
  return {
    mode: 'uncapped-additive-named-pools',
    applicationOrder: clone(candidate.collectionPolicy),
    stressBoundaryIsLifetimeCap: false,
    mandatoryReachabilityCollectionBps: 0,
    mandatoryProgressionProfile: 'zero-collection-stricter-than-permanent-only',
    limitedEventBonusAssumedByRequirements: false,
    releaseBudgetsAreLifetimeCaps: false,
    claims,
    adjacentBonusOrderProbes,
    allAdjacentBonusOrderProbesNonVacuous: adjacentBonusOrderProbes.every(row => row.additiveResult !== row.forbiddenCompoundedResult && row.forbiddenCompoundedRejected),
    allExactlyOnce: claims.every(row => row.exactlyOnce),
    allContinueGrowth: claims.every(row => row.futureCollectionContinuesGrowth)
  };
}

function delayedClaimEvidence(candidate) {
  const fixture = candidate.delayedClaimFixture;
  const captured = {
    claimId: fixture.id,
    capturedRewards: clone(fixture.capturedRewards),
    capturedAtEconomyGoldPerHour: fixture.capturedAtEconomyGoldPerHour,
    capturedAtLevel: fixture.capturedAtLevel
  };
  captured.identity = sha256(JSON.stringify([fixture.id, captured.capturedRewards, captured.capturedAtEconomyGoldPerHour, captured.capturedAtLevel]));
  const pendingBeforeMigration = { schemaVersion: 1, status: 'ready', receiptIdentity: captured.identity, captured: clone(captured), claimSequence: 0 };
  const migrate = record => {
    const expectedMigrationReceipt = sha256(JSON.stringify(['phase24b-delayed-claim-migration-v1', record.receiptIdentity]));
    if (record.schemaVersion === 2) {
      assert(record.migrationReceiptIdentity === expectedMigrationReceipt, 'delayed claim migration receipt mismatch');
      return clone(record);
    }
    return { ...clone(record), schemaVersion: 2, migrationReceiptIdentity: expectedMigrationReceipt };
  };
  const pendingAfterMigration = migrate(pendingBeforeMigration);
  const pendingSecondMigration = migrate(pendingAfterMigration);
  const laterState = {
    level: fixture.laterLevel,
    economyGoldPerHour: fixture.laterEconomyGoldPerHour,
    oathBps: fixture.laterOathBps,
    collectionBps: fixture.laterCollectionBps,
    facilityBps: fixture.laterFacilityBps,
    authoredExpBps: fixture.laterAuthoredExpBps,
    authoredFacilityActiveBps: fixture.laterAuthoredFacilityActiveBps,
    forbiddenHypotheticalRepricing: {
      fellowExp: Math.floor(fixture.capturedRewards.fellowExp * (10000 + fixture.laterAuthoredExpBps + fixture.laterCollectionBps) / 10000),
      facilityActiveReward: Math.floor(fixture.capturedRewards.facilityActiveReward * (fixture.laterEconomyGoldPerHour / fixture.capturedAtEconomyGoldPerHour) * (10000 + fixture.laterAuthoredFacilityActiveBps + fixture.laterFacilityBps) / 10000)
    },
    oathAppliedToFacilityReward: false,
    repricingCounterfactualIsLaneSpecific: true
  };
  const balances = { fellowExp: 0, facilityActiveReward: 0 };
  const claimed = new Set();
  let claimRecord = clone(pendingAfterMigration);
  const claim = () => {
    if (claimed.has(captured.identity)) return false;
    balances.fellowExp += captured.capturedRewards.fellowExp;
    balances.facilityActiveReward += captured.capturedRewards.facilityActiveReward;
    claimed.add(captured.identity);
    claimRecord = { ...claimRecord, status: 'claimed', claimSequence: 1, appliedRewards: clone(captured.capturedRewards) };
    return true;
  };
  const firstApplied = claim(), afterFirst = clone(balances), claimedBeforeMigration = clone(claimRecord), replayApplied = claim(), afterReplay = clone(balances);
  const claimedAfterMigration = migrate(claimedBeforeMigration);
  const claimedSecondMigration = migrate(claimedAfterMigration);
  const reloadedClaimedRecord = JSON.parse(JSON.stringify(claimedAfterMigration));
  const rehydratedClaimLedger = new Set(reloadedClaimedRecord.status === 'claimed' ? [reloadedClaimedRecord.receiptIdentity] : []);
  const reloadedBalancesBeforeReplay = clone(afterFirst);
  const reloadedReplayApplied = !rehydratedClaimLedger.has(reloadedClaimedRecord.receiptIdentity);
  const reloadedBalancesAfterReplay = clone(reloadedBalancesBeforeReplay);
  const pendingMigrationPreserved = pendingAfterMigration.status === pendingBeforeMigration.status
    && pendingAfterMigration.receiptIdentity === pendingBeforeMigration.receiptIdentity
    && tableHash(pendingAfterMigration.captured) === tableHash(pendingBeforeMigration.captured);
  const claimedMigrationPreserved = claimedAfterMigration.status === claimedBeforeMigration.status
    && claimedAfterMigration.receiptIdentity === claimedBeforeMigration.receiptIdentity
    && tableHash(claimedAfterMigration.appliedRewards) === tableHash(claimedBeforeMigration.appliedRewards);
  return {
    policy: fixture.claimPolicy,
    captured,
    pendingMigration: { before: pendingBeforeMigration, after: pendingAfterMigration, second: pendingSecondMigration, preserved: pendingMigrationPreserved, secondApplicationNoOp: tableHash(pendingAfterMigration) === tableHash(pendingSecondMigration) },
    laterState,
    allExternalInputsChanged: laterState.level !== captured.capturedAtLevel
      && laterState.economyGoldPerHour !== captured.capturedAtEconomyGoldPerHour
      && laterState.oathBps !== 0 && laterState.collectionBps !== 0 && laterState.facilityBps !== 0,
    capturedValuesUnchangedAfterGrowth: tableHash(pendingAfterMigration.captured.capturedRewards) === tableHash(captured.capturedRewards)
      && Object.keys(captured.capturedRewards).every(key => captured.capturedRewards[key] !== laterState.forbiddenHypotheticalRepricing[key]),
    firstApplied,
    afterFirst,
    replayApplied,
    afterReplay,
    claimedMigration: { before: claimedBeforeMigration, after: claimedAfterMigration, second: claimedSecondMigration, preserved: claimedMigrationPreserved, secondApplicationNoOp: tableHash(claimedAfterMigration) === tableHash(claimedSecondMigration) },
    persistedReloadReplay: {
      reloadedRecord: reloadedClaimedRecord,
      balancesBeforeReplay: reloadedBalancesBeforeReplay,
      replayApplied: reloadedReplayApplied,
      balancesAfterReplay: reloadedBalancesAfterReplay,
      noOp: !reloadedReplayApplied && tableHash(reloadedBalancesBeforeReplay) === tableHash(reloadedBalancesAfterReplay)
    },
    receiptIdentityStableAcrossReadyClaimedAndMigration: [pendingBeforeMigration.receiptIdentity, pendingAfterMigration.receiptIdentity, claimedBeforeMigration.receiptIdentity, claimedAfterMigration.receiptIdentity].every(identity => identity === captured.identity),
    exactlyOnce: firstApplied && !replayApplied
      && tableHash(afterFirst) === tableHash(captured.capturedRewards)
      && tableHash(afterReplay) === tableHash(afterFirst)
      && pendingMigrationPreserved && claimedMigrationPreserved
      && tableHash(pendingAfterMigration) === tableHash(pendingSecondMigration)
      && tableHash(claimedAfterMigration) === tableHash(claimedSecondMigration)
      && !reloadedReplayApplied && tableHash(reloadedBalancesBeforeReplay) === tableHash(reloadedBalancesAfterReplay)
  };
}

function mandatoryContentIsolation(candidate, baseline) {
  const requirementHashes = clone(baseline.observedTableHashes.requirements);
  const fixtures = candidate.collectionOwnershipFixtures;
  const pools = fixtures.stressProvenance.pools;
  const makeTotals = total => Object.fromEntries(pools.map(pool => [pool, total]));
  const split = (total, firstShareBps) => {
    const first = Math.floor(total * firstShareBps / 10000);
    return [first, total - first];
  };
  const rows = [];
  for (const stressBps of candidate.collectionStressBps) {
    const permanentSources = split(stressBps, fixtures.stressProvenance.permanentOnlySourceSharesBps[0]);
    const [mixedPermanentBps, mixedLimitedBps] = split(stressBps, fixtures.stressProvenance.mixedPermanentShareBps);
    const sourcesByPool = Object.fromEntries(pools.map(pool => [pool, [
      { sourceId: `permanent.${pool}.core`, provenance: 'permanent', bps: permanentSources[0] },
      { sourceId: `permanent.${pool}.expansion`, provenance: 'permanent', bps: permanentSources[1] }
    ]]));
    const mixedSourcesByPool = Object.fromEntries(pools.map(pool => [pool, [
      { sourceId: `permanent.${pool}.mixed`, provenance: 'permanent', bps: mixedPermanentBps },
      { sourceId: `limited.${pool}.mixed`, provenance: 'limited', bps: mixedLimitedBps }
    ]]));
    rows.push({ id: `zero-collection-${stressBps}`, profile: 'zero-collection', stressBps, runtimePoolTotalsBps: makeTotals(0), permanentPoolTotalsBps: makeTotals(0), limitedPoolTotalsBps: makeTotals(0), sourcesByPool: Object.fromEntries(pools.map(pool => [pool, []])), requirementHashes, assumedForMandatoryAuthoring: false });
    rows.push({ id: `permanent-only-${stressBps}`, profile: 'permanent-only', stressBps, runtimePoolTotalsBps: makeTotals(stressBps), permanentPoolTotalsBps: makeTotals(stressBps), limitedPoolTotalsBps: makeTotals(0), sourcesByPool, requirementHashes, assumedForMandatoryAuthoring: true });
    rows.push({ id: `all-content-${stressBps}`, profile: 'all-content', stressBps, runtimePoolTotalsBps: makeTotals(stressBps), permanentPoolTotalsBps: makeTotals(mixedPermanentBps), limitedPoolTotalsBps: makeTotals(mixedLimitedBps), sourcesByPool: mixedSourcesByPool, requirementHashes, assumedForMandatoryAuthoring: false });
  }
  for (const row of rows) {
    for (const pool of pools) {
      assert(sum(row.sourcesByPool[pool].map(source => source.bps)) === row.runtimePoolTotalsBps[pool], `${row.id} ${pool} provenance does not compose to runtime total`);
      assert(sum(row.sourcesByPool[pool].filter(source => source.provenance === 'permanent').map(source => source.bps)) === row.permanentPoolTotalsBps[pool], `${row.id} ${pool} permanent provenance mismatch`);
      assert(sum(row.sourcesByPool[pool].filter(source => source.provenance === 'limited').map(source => source.bps)) === row.limitedPoolTotalsBps[pool], `${row.id} ${pool} limited provenance mismatch`);
    }
  }
  const hashIdentity = tableHash(requirementHashes);
  return {
    rows: rows.map(row => ({ ...row, requirementHashIdentity: tableHash(row.requirementHashes) })),
    profileCount: rows.length,
    stressTotalsBps: clone(candidate.collectionStressBps),
    pools,
    allRequirementHashesIdentical: rows.every(row => tableHash(row.requirementHashes) === hashIdentity),
    requirementAuthoringProfile: fixtures.requirementAuthoringProfile,
    requirementAuthoringReadsOnlyPermanentFixture: rows.filter(row => row.assumedForMandatoryAuthoring).every(row => row.profile === 'permanent-only'),
    limitedEventBonusExcludedFromRequirements: fixtures.limitedEventBonusExcludedFromRequirements,
    zeroCollectionMandatoryReachabilityEvaluated: true,
    dynamicScalingFromOwnership: false,
    limitedContributesToRuntimeAllContentTotals: rows.filter(row => row.profile === 'all-content' && row.stressBps > 0).every(row => Object.values(row.limitedPoolTotalsBps).every(value => value > 0))
  };
}

function collectionLedgerMigrationEvidence(candidate) {
  const fixture = candidate.collectionLedgerMigrationFixture;
  const pools = ['power', 'earnings', 'exp', 'facility'];
  const ids = fixture.claimedEntries.map(entry => entry.claimId);
  assert(new Set(ids).size === ids.length, 'Collection migration source contains duplicate claim IDs');
  const totals = () => Object.fromEntries(pools.map(pool => [pool, 0]));
  const allTotals = totals(), permanentTotals = totals(), limitedTotals = totals();
  for (const entry of fixture.claimedEntries) {
    assert(pools.includes(entry.pool) && ['permanent', 'limited'].includes(entry.provenance) && isSafeNonnegative(entry.bps), 'invalid Collection migration entry');
    allTotals[entry.pool] += entry.bps;
    (entry.provenance === 'permanent' ? permanentTotals : limitedTotals)[entry.pool] += entry.bps;
  }
  const migrate = prior => {
    if (prior) {
      const { migrationReceiptIdentity, ...priorCore } = prior;
      const expected = sha256(JSON.stringify(['phase24b-collection-ledger-migration-v1', priorCore]));
      assert(prior.schemaVersion === 2 && migrationReceiptIdentity === expected, 'Collection ledger prior migration receipt mismatch');
      return clone(prior);
    }
    const resultCore = {
      schemaVersion: 2,
      fixtureId: fixture.id,
      namedPoolTotalsBps: allTotals,
      permanentPoolTotalsBps: permanentTotals,
      limitedPoolTotalsBps: limitedTotals,
      claimedEntries: clone(fixture.claimedEntries),
      claimedReceiptIds: [...ids].sort(),
      obsoleteDisplayedCapsBps: clone(fixture.legacyDisplayedCapsBps),
      clippedToObsoleteCaps: false
    };
    const migrationReceiptIdentity = sha256(JSON.stringify(['phase24b-collection-ledger-migration-v1', resultCore]));
    return { ...resultCore, migrationReceiptIdentity };
  };
  const first = migrate();
  const second = migrate(first);
  const ledger = new Set(first.claimedReceiptIds);
  const afterFutureTotals = clone(first.namedPoolTotalsBps);
  const apply = entry => {
    if (ledger.has(entry.claimId)) return false;
    ledger.add(entry.claimId);
    afterFutureTotals[entry.pool] += entry.bps;
    return true;
  };
  const replayOldApplied = apply(fixture.claimedEntries[0]);
  const futureApplied = apply(fixture.futureGrant);
  const afterFuture = clone(afterFutureTotals);
  const futureReplayApplied = apply(fixture.futureGrant);
  return {
    policy: fixture.migrationPolicy,
    first,
    second,
    secondApplicationNoOp: tableHash(first) === tableHash(second),
    noLoss: pools.every(pool => first.namedPoolTotalsBps[pool] === first.permanentPoolTotalsBps[pool] + first.limitedPoolTotalsBps[pool]),
    obsoleteCapsIgnored: pools.every(pool => first.namedPoolTotalsBps[pool] === sum(fixture.claimedEntries.filter(entry => entry.pool === pool).map(entry => entry.bps)))
      && Object.keys(fixture.legacyDisplayedCapsBps).some(pool => first.namedPoolTotalsBps[pool] > fixture.legacyDisplayedCapsBps[pool]),
    replayOldApplied,
    futureApplied,
    afterFutureTotalsBps: afterFuture,
    futureReplayApplied,
    futureGrantContinuesUncappedGrowth: futureApplied && !futureReplayApplied && afterFuture[fixture.futureGrant.pool] === first.namedPoolTotalsBps[fixture.futureGrant.pool] + fixture.futureGrant.bps,
    exactNamedPoolTotalsExpected: { power: 3400, earnings: 2300, exp: 1700, facility: 2600 }
  };
}

function limitedEventAlternativeEvidence(candidate) {
  const fixture = candidate.limitedEventAlternativeFixture;
  const runOrder = claims => {
    const entitlementLedger = new Set();
    const claimLedger = new Set();
    let mechanicalPowerBps = 0;
    const preservedExclusiveMetadata = [];
    const results = claims.map(claim => {
      if (claimLedger.has(claim.claimId)) return { claimId: claim.claimId, claimApplied: false, mechanicalApplied: false, duplicateClaim: true };
      claimLedger.add(claim.claimId);
      if (claim.exclusiveMetadata) preservedExclusiveMetadata.push(clone(claim.exclusiveMetadata));
      const mechanicalApplied = !entitlementLedger.has(fixture.growthEntitlementId);
      if (mechanicalApplied) {
        entitlementLedger.add(fixture.growthEntitlementId);
        mechanicalPowerBps += fixture.mechanicalBps;
      }
      return { claimId: claim.claimId, provenance: claim.provenance, claimApplied: true, mechanicalApplied, duplicateClaim: false };
    });
    return { results, mechanicalPowerBps, preservedExclusiveMetadata, noDoubleMechanicalEntitlement: mechanicalPowerBps === fixture.mechanicalBps };
  };
  const limitedThenPermanent = runOrder([fixture.limitedClaim, fixture.permanentAlternativeClaim, fixture.limitedClaim]);
  const permanentThenLimited = runOrder([fixture.permanentAlternativeClaim, fixture.limitedClaim, fixture.permanentAlternativeClaim]);
  return {
    policy: fixture.policy,
    growthEntitlementId: fixture.growthEntitlementId,
    equivalentPermanentSourceExists: Boolean(fixture.permanentAlternativeClaim),
    limitedThenPermanent,
    permanentThenLimited,
    allOrdersPreventDoubleMechanicalClaim: limitedThenPermanent.noDoubleMechanicalEntitlement && permanentThenLimited.noDoubleMechanicalEntitlement,
    limitedExclusiveMetadataPreserved: limitedThenPermanent.preservedExclusiveMetadata.length === 1 && permanentThenLimited.preservedExclusiveMetadata.length === 1
  };
}

function manualBreakthroughLifecycleEvidence(candidate, fellowTable, companionTable) {
  return candidate.manualBreakthroughFixtures.map(fixture => {
    const table = fixture.lane === 'fellow' ? fellowTable : companionTable;
    if (fixture.lane === 'fellow') assert(fixture.actorId === 'cael' && fixture.basePower === 6100 && fixture.persistentState.relicId === 'first-road-lantern' && fixture.persistentState.relicLevel === 3 && fixture.persistentState.relicTier === 1 && fixture.persistentState.relicPowerBps === 150 && fixture.persistentState.assignedCompanionId === 'arcanine', 'Fellow manual-gate domain fixture changed');
    else assert(fixture.actorId === 'arcanine' && fixture.basePower === 115 && fixture.persistentState.assignedFellowId === 'cael', 'Companion manual-gate assignment fixture changed');
    const authoredRequirementUnits = table.breakthroughByLevel[fixture.gateLevel];
    assert(authoredRequirementUnits !== undefined, `${fixture.id} does not target an authored gate`);
    const claimRequirementUnits = fixture.legacyFreeClaim ? 0 : authoredRequirementUnits;
    const receiptIdentity = sha256(JSON.stringify(['phase24b-manual-breakthrough-v1', fixture.id, fixture.lane, fixture.gateLevel, claimRequirementUnits]));
    const legacyMigrationReceiptIdentity = fixture.legacyFreeClaim
      ? sha256(JSON.stringify(['phase24b-legacy-breakthrough-migration-v1', fixture.id, fixture.gateLevel]))
      : null;
    const derivedPower = level => {
      const levelMultiplier = table.rows[level - 1].levelMultiplier;
      if (fixture.lane === 'fellow') {
        const rarityMultiplier = 1 + (fixture.persistentState.rarityStars - 1) * 0.08;
        const relicMultiplier = 1 + (fixture.persistentState.relicPowerBps ?? 0) / 10000;
        return Math.round(fixture.basePower * levelMultiplier * rarityMultiplier * relicMultiplier * (1 + fixture.persistentState.mightBps / 10000));
      }
      const rarityMultiplier = 1 + (fixture.persistentState.rarityStars - 1) * 0.1;
      const masteryMultiplier = 1 + fixture.persistentState.masteryLevel / 100;
      return Math.round(fixture.basePower * levelMultiplier * rarityMultiplier * masteryMultiplier);
    };
    const preMigrationInitial = {
      schemaVersion: 1,
      lane: fixture.lane,
      actorId: fixture.actorId,
      basePower: fixture.basePower,
      level: fixture.gateLevel,
      bankedExp: 0,
      materialUnits: fixture.initialMaterialUnits,
      gate: {
        level: fixture.gateLevel,
        authoredRequirementUnits,
        claimRequirementUnits,
        status: fixture.legacyFreeClaim ? 'former-cap-awaiting-legacy-queue-migration' : 'closed-awaiting-manual-claim',
        receiptIdentity,
        legacyFreeClaim: fixture.legacyFreeClaim
      },
      persistentState: clone(fixture.persistentState),
      derivedPower: derivedPower(fixture.gateLevel)
    };
    const applyLegacyQueueMigration = state => {
      if (!fixture.legacyFreeClaim) return clone(state);
      if (state.schemaVersion === 2) {
        assert(state.gate.legacyMigrationReceiptIdentity === legacyMigrationReceiptIdentity, `${fixture.id} legacy migration receipt changed`);
        return clone(state);
      }
      const next = clone(state);
      next.schemaVersion = 2;
      next.gate.status = 'closed-awaiting-manual-claim';
      next.gate.legacyMigrationReceiptIdentity = legacyMigrationReceiptIdentity;
      next.gate.legacyClaimQueued = true;
      return next;
    };
    const initial = applyLegacyQueueMigration(preMigrationInitial);
    const initialSecondMigration = applyLegacyQueueMigration(initial);
    const afterExpDeposit = clone(initial);
    afterExpDeposit.bankedExp += fixture.bankedExp;
    const expBankedAtClosedGate = afterExpDeposit.level === fixture.gateLevel && afterExpDeposit.bankedExp === fixture.bankedExp && afterExpDeposit.gate.status === 'closed-awaiting-manual-claim';
    const tryClaim = state => {
      if (state.gate.status === 'claimed' || state.gate.claimReceiptIdentity === receiptIdentity) return { applied: false, reason: 'receipt-already-claimed', state: clone(state) };
      if (state.materialUnits < claimRequirementUnits) return { applied: false, reason: 'insufficient-materials', state: clone(state) };
      const next = clone(state);
      next.materialUnits -= claimRequirementUnits;
      next.gate.status = 'claimed';
      next.gate.claimReceiptIdentity = receiptIdentity;
      next.gate.materialUnitsSpent = claimRequirementUnits;
      while (next.level < table.levelCap) {
        const nextGate = table.breakthroughByLevel[next.level];
        if (nextGate !== undefined && next.level !== fixture.gateLevel) break;
        const cost = table.costByFromLevel[next.level];
        if (next.bankedExp < cost) break;
        next.bankedExp -= cost;
        next.level += 1;
      }
      next.derivedPower = derivedPower(next.level);
      return { applied: true, reason: 'manual-claim-applied', state: next };
    };
    const insufficientAttempt = claimRequirementUnits > 0 ? tryClaim(afterExpDeposit) : { applied: false, reason: 'not-applicable-free-legacy-claim', state: clone(afterExpDeposit) };
    const afterMaterialGrant = clone(insufficientAttempt.state);
    afterMaterialGrant.materialUnits += fixture.materialGrantUnits;
    assert(afterMaterialGrant.materialUnits >= claimRequirementUnits, `${fixture.id} material grant cannot satisfy claim`);
    const successfulClaim = tryClaim(afterMaterialGrant);
    assert(successfulClaim.applied, `${fixture.id} manual claim did not apply`);
    const persisted = JSON.stringify(successfulClaim.state);
    const reloaded = JSON.parse(persisted);
    const replayAfterReload = tryClaim(reloaded);
    const legacyMigrationReapply = fixture.legacyFreeClaim ? applyLegacyQueueMigration(reloaded) : null;
    const nextOrdinaryGate = table.breakthroughs.find(row => row.level > fixture.gateLevel)?.level ?? null;
    return {
      fixtureId: fixture.id,
      lane: fixture.lane,
      legacyQueueMigration: fixture.legacyFreeClaim ? {
        before: preMigrationInitial,
        after: initial,
        second: initialSecondMigration,
        queuedNotAutoClaimed: initial.gate.status === 'closed-awaiting-manual-claim' && initial.gate.legacyClaimQueued === true,
        secondApplicationNoOp: tableHash(initial) === tableHash(initialSecondMigration)
      } : null,
      initial,
      afterExpDeposit,
      expBankedAtClosedGate,
      insufficientAttempt: {
        applied: insufficientAttempt.applied,
        reason: insufficientAttempt.reason,
        stateSha256: tableHash(insufficientAttempt.state),
        exactNoOp: claimRequirementUnits === 0 || tableHash(insufficientAttempt.state) === tableHash(afterExpDeposit)
      },
      afterMaterialGrant,
      successfulClaim,
      persistedReload: { record: reloaded, replay: replayAfterReload, replayNoOp: !replayAfterReload.applied && tableHash(replayAfterReload.state) === tableHash(reloaded) },
      legacyMigrationReapply: legacyMigrationReapply ? { record: legacyMigrationReapply, noOp: tableHash(legacyMigrationReapply) === tableHash(reloaded), noDuplicateEntitlement: legacyMigrationReapply.gate.claimReceiptIdentity === receiptIdentity } : null,
      nextOrdinaryGate,
      manualOnly: true,
      exactMaterialSpend: successfulClaim.state.gate.materialUnitsSpent === claimRequirementUnits && successfulClaim.state.materialUnits === afterMaterialGrant.materialUnits - claimRequirementUnits,
      bankedExpAdvancedOnlyAfterClaim: successfulClaim.state.level > fixture.gateLevel && successfulClaim.state.bankedExp < fixture.bankedExp && afterExpDeposit.level === fixture.gateLevel,
      persistentStatePreserved: tableHash(successfulClaim.state.persistentState) === tableHash(initial.persistentState) && tableHash(reloaded.persistentState) === tableHash(initial.persistentState),
      derivedPowerChangedOnlyWithIntendedLevelAdvancement: successfulClaim.state.derivedPower === derivedPower(successfulClaim.state.level) && initial.derivedPower === derivedPower(initial.level),
      stableClaimReceipt: successfulClaim.state.gate.claimReceiptIdentity === receiptIdentity && reloaded.gate.claimReceiptIdentity === receiptIdentity,
      exactlyOnceAcrossReload: successfulClaim.applied && !replayAfterReload.applied && tableHash(replayAfterReload.state) === tableHash(reloaded)
    };
  });
}

function effectiveEligibleExp(rawExp, collectionBps) {
  const value = Math.floor(rawExp * (10000 + collectionBps) / 10000);
  assert(isSafeNonnegative(value), 'Collection EXP result is unsafe');
  return value;
}

function focusedFellowPower(progressRows, collectionBps, fresh) {
  assert(progressRows.length === fresh.fellowCombat.members.length, 'focused Fellow roster does not match fresh baseline');
  const members = fresh.fellowCombat.members.map((member, index) => {
    const progress = progressRows[index];
    const multiplier = progress.levelMultiplier;
    const preGlobal = (
      member.basePower * multiplier * member.rarityMultiplier * member.bondMilestoneMultiplier * member.relicMultiplier
      + member.transferredPower
    ) * member.familyBondMultiplier;
    const mightBonus = member.globalMightMultiplier - 1;
    const power = Math.round(preGlobal * (1 + mightBonus + collectionBps / 10000));
    return { id: member.id, order: index, level: progress.level, power, preGlobalPower: preGlobal };
  });
  return { members, totalPower: sum(members.map(member => member.power)), basis: 'frozen-fresh-six-member-components' };
}

function broadFellowPower(progressRows, collectionBps, basePower) {
  const ids = Object.keys(basePower);
  assert(progressRows.length === ids.length, 'broad Fellow roster size mismatch');
  const members = ids.map((id, index) => ({
    id,
    order: index,
    level: progressRows[index].level,
    power: Math.round(basePower[id] * progressRows[index].levelMultiplier * (1 + collectionBps / 10000))
  }));
  return { members, totalPower: sum(members.map(member => member.power)), basis: 'synthetic-all-18-level-only-isolation' };
}

function companionPower(progressRows, basePower) {
  const ids = Object.keys(basePower);
  assert(progressRows.length === ids.length, 'Companion roster size mismatch');
  const members = ids.map((id, index) => ({
    id,
    order: index,
    level: progressRows[index].level,
    power: Math.round(basePower[id] * progressRows[index].levelMultiplier)
  }));
  return { members, totalPower: sum(members.map(member => member.power)), basis: 'all-20-level-only-rarity1-mastery0' };
}

function scenarioMatrix(candidate, baseline, profiles, fellowTable, companionTable) {
  const proposed = candidate.throughput.proposedLaunchExpBudget.rows;
  const active = baseline.authority.definitions.active;
  const fellowRequirements = profiles.fresh.requirements.fellowCampaign;
  const companionRequirements = profiles.fresh.requirements.companionCampaign;
  const towerRequirements = Object.values(profiles.fresh.requirements.companionTower);
  const expeditionRequirements = Object.values(profiles.fresh.requirements.fellowExpedition);
  const matrix = [];
  for (const strategy of ['focused', 'broad']) {
    for (const budget of proposed) {
      for (const collectionBps of candidate.collectionStressBps) {
        const effectiveFellowAccountExp = effectiveEligibleExp(budget.fellowRawExp, collectionBps);
        const effectiveCompanionAccountExp = effectiveEligibleExp(budget.companionRawExp, collectionBps);
        const fellowCount = strategy === 'focused' ? candidate.throughput.allocation.focused.fellowRosterSize : candidate.throughput.allocation.broad.fellowRosterSize;
        const companionCount = candidate.throughput.allocation.broad.companionRosterSize;
        const fellowExpAllocations = strategy === 'focused'
          ? distributeFocused(effectiveFellowAccountExp, fellowCount, candidate.throughput.allocation.focused.fellowLeadShareBps)
          : distributeInteger(effectiveFellowAccountExp, fellowCount);
        const fellowUnitAllocations = strategy === 'focused'
          ? distributeFocused(budget.fellowBreakthroughUnits, fellowCount, candidate.throughput.allocation.focused.fellowLeadShareBps)
          : distributeInteger(budget.fellowBreakthroughUnits, fellowCount);
        const companionExpAllocations = strategy === 'focused'
          ? distributeFocused(effectiveCompanionAccountExp, companionCount, candidate.throughput.allocation.focused.companionLeadShareBps)
          : distributeInteger(effectiveCompanionAccountExp, companionCount);
        const companionUnitAllocations = strategy === 'focused'
          ? distributeFocused(budget.companionBreakthroughUnits, companionCount, candidate.throughput.allocation.focused.companionLeadShareBps)
          : distributeInteger(budget.companionBreakthroughUnits, companionCount);
        const fellowProgress = fellowExpAllocations.map((exp, index) => {
          const row = simulateProgress(fellowTable, exp, fellowUnitAllocations[index]);
          return { ...row, levelMultiplier: fellowTable.rows[row.level - 1].levelMultiplier };
        });
        const companionProgress = companionExpAllocations.map((exp, index) => {
          const row = simulateProgress(companionTable, exp, companionUnitAllocations[index]);
          return { ...row, levelMultiplier: companionTable.rows[row.level - 1].levelMultiplier };
        });
        const fellowPower = strategy === 'focused'
          ? focusedFellowPower(fellowProgress, collectionBps, profiles.fresh)
          : broadFellowPower(fellowProgress, collectionBps, active.fellow.basePower);
        const companions = companionPower(companionProgress, active.companion.basePower);
        const expedition = expeditionReachability(expeditionRequirements, fellowPower.members);
        matrix.push({
          strategy,
          days: budget.days,
          collectionBps,
          collectionPercent: collectionBps / 100,
          allocation: {
            fellowRawAccountExp: budget.fellowRawExp,
            fellowEffectiveAccountExp: effectiveFellowAccountExp,
            fellowBreakthroughUnits: budget.fellowBreakthroughUnits,
            companionRawAccountExp: budget.companionRawExp,
            companionEffectiveAccountExp: effectiveCompanionAccountExp,
            companionBreakthroughUnits: budget.companionBreakthroughUnits
          },
          fellow: {
            rosterSize: fellowCount,
            levelSummary: summaryLevels(fellowProgress),
            lead: fellowProgress[0],
            totalBankedExp: sum(fellowProgress.map(row => row.bankedExp)),
            totalPower: fellowPower.totalPower,
            powerBasis: fellowPower.basis,
            campaignHighestStage: highestReachable(fellowRequirements, fellowPower.totalPower),
            expedition
          },
          companion: {
            rosterSize: companionCount,
            levelSummary: summaryLevels(companionProgress),
            lead: companionProgress[0],
            totalBankedExp: sum(companionProgress.map(row => row.bankedExp)),
            totalPower: companions.totalPower,
            powerBasis: companions.basis,
            campaignHighestStage: highestReachable(companionRequirements, companions.totalPower),
            towerHighestFloor: highestReachable(towerRequirements, companions.totalPower)
          },
          economy: {
            freshZeroOathGoldPerHour: profiles.fresh.economy.totalGoldPerHour * (1 + collectionBps / 10000),
            normalizedFacilityActiveRewardMultiplier: 1 + collectionBps / 10000
          }
        });
      }
    }
  }
  return matrix;
}

function legacyExpToNext(config, level) {
  return Math.round(config.expBase * Math.pow(config.expGrowth, level - 1));
}

function legacyThreshold(config, level) {
  let total = 0;
  for (let current = 1; current < Math.min(level, config.levelCap); current++) total += legacyExpToNext(config, current);
  return total;
}

function migrationReceiptIdentity(input, curveId, resultCore) {
  return sha256(JSON.stringify(['phase24b.exp-curve-migration.provisional.v1', input, curveId, resultCore]));
}

function applyMigration(kind, input, legacyConfig, table, prior = null) {
  if (prior) {
    assert(prior.receipt.identity === prior.expectedReceiptIdentity, `${kind} prior receipt identity mismatch`);
    return clone(prior);
  }
  const savedLevel = input.savedLevel;
  assert(savedLevel >= 1 && savedLevel <= legacyConfig.levelCap, `${kind} migration saved Level invalid`);
  assert(input.rawExp === input.lineage.baselineRawExp + input.lineage.attributedEarnedSurplus, `${kind} lineage does not reconcile raw EXP`);
  const oldThreshold = legacyThreshold(legacyConfig, savedLevel);
  const atFormerCap = savedLevel === legacyConfig.levelCap;
  let oldWithinLevelExp = 0, oldNextCost = null, mappedWithinLevelExp = 0, mappingRemainderNumerator = 0, legacyCapBankedExp = 0;
  if (atFormerCap) {
    assert(input.rawExp >= oldThreshold, `${kind} former-cap raw EXP is below threshold`);
    legacyCapBankedExp = input.rawExp - oldThreshold;
  } else {
    oldNextCost = legacyExpToNext(legacyConfig, savedLevel);
    oldWithinLevelExp = input.rawExp - oldThreshold;
    assert(oldWithinLevelExp >= 0 && oldWithinLevelExp < oldNextCost, `${kind} within-level EXP is invalid`);
    const newNextCost = table.costByFromLevel[savedLevel];
    const numerator = oldWithinLevelExp * newNextCost;
    mappedWithinLevelExp = Math.floor(numerator / oldNextCost);
    mappingRemainderNumerator = numerator - mappedWithinLevelExp * oldNextCost;
  }
  const newThreshold = table.cumulativeByLevel[savedLevel];
  const newActiveExp = newThreshold + mappedWithinLevelExp;
  const grandfatheredGates = table.breakthroughs.filter(row => row.level < savedLevel).map(row => row.level);
  const legacyBreakthroughClaim = kind === 'companion' && savedLevel === 100
    ? { level: 100, requirementUnits: 0, manual: true, exactlyOnce: true, status: 'queued-free-legacy-claim' }
    : null;
  const nextOrdinaryGate = table.breakthroughs.find(row => row.level >= savedLevel && !(kind === 'companion' && savedLevel === 100 && row.level === 100))?.level ?? null;
  const resultCore = {
    kind,
    fixtureId: input.fixtureId,
    oldCurve: { levelCap: legacyConfig.levelCap, rawExp: input.rawExp, savedLevel, oldThreshold, oldNextCost, oldWithinLevelExp },
    newCurve: { levelCap: table.levelCap, activeExp: newActiveExp, savedLevel, newThreshold, mappedWithinLevelExp },
    exactProgressPreservation: atFormerCap
      ? { kind: 'former-cap-surplus-bank', activeProgress: ratioText(0, 1), legacyCapBankedExp }
      : {
          kind: 'rational-with-remainder',
          oldProgress: ratioText(oldWithinLevelExp, oldNextCost),
          mappedIntegerExp: mappedWithinLevelExp,
          exactMappedProgressNumerator: mappedWithinLevelExp * oldNextCost + mappingRemainderNumerator,
          exactMappedProgressDenominator: table.costByFromLevel[savedLevel] * oldNextCost,
          mappingRemainderNumerator,
          mappingRemainderDenominator: oldNextCost,
          identityProof: oldWithinLevelExp * table.costByFromLevel[savedLevel] === mappedWithinLevelExp * oldNextCost + mappingRemainderNumerator
        },
    lineage: clone(input.lineage),
    legacyCapBankedExp,
    grandfatheredGates,
    legacyBreakthroughClaim,
    nextOrdinaryGate,
    levelPreserved: true,
    rawExpNeverDirectlyReinterpreted: true
  };
  const identity = migrationReceiptIdentity(input, table.levelTableSha256, resultCore);
  const result = {
    ...resultCore,
    receipt: { policyId: 'phase24b.exp-curve-migration.provisional.v1', identity, appliedExactlyOnce: true },
    expectedReceiptIdentity: identity
  };
  return result;
}

function migrationSimulations(candidate, fellowTable, companionTable) {
  const oldFellow = candidate.legacyExp.fellow, oldCompanion = candidate.legacyExp.companion;
  const fellowMidLevel = 60, companionMidLevel = 40;
  const fellowMidThreshold = legacyThreshold(oldFellow, fellowMidLevel), fellowMidCost = legacyExpToNext(oldFellow, fellowMidLevel);
  const companionMidThreshold = legacyThreshold(oldCompanion, companionMidLevel), companionMidCost = legacyExpToNext(oldCompanion, companionMidLevel);
  const fellowCap = legacyThreshold(oldFellow, oldFellow.levelCap), companionCap = legacyThreshold(oldCompanion, oldCompanion.levelCap);
  const recipes = [
    { kind: 'fellow', fixtureId: 'fellow-mid-level', savedLevel: fellowMidLevel, rawExp: fellowMidThreshold + Math.floor(fellowMidCost * 2 / 5), lineage: { kind: 'synthetic-attributed-exp-ledger', baselineRawExp: fellowMidThreshold + Math.floor(fellowMidCost * 2 / 5), attributedEarnedSurplus: 0 } },
    { kind: 'fellow', fixtureId: 'fellow-level-120-exact-cap', savedLevel: 120, rawExp: fellowCap, lineage: { kind: 'synthetic-attributed-exp-ledger', baselineRawExp: fellowCap, attributedEarnedSurplus: 0 } },
    { kind: 'fellow', fixtureId: 'fellow-level-120-attributed-surplus', savedLevel: 120, rawExp: fellowCap + 123456, lineage: { kind: 'synthetic-attributed-exp-ledger', baselineRawExp: fellowCap, attributedEarnedSurplus: 123456 } },
    { kind: 'companion', fixtureId: 'companion-mid-level', savedLevel: companionMidLevel, rawExp: companionMidThreshold + Math.floor(companionMidCost * 3 / 5), lineage: { kind: 'synthetic-attributed-exp-ledger', baselineRawExp: companionMidThreshold + Math.floor(companionMidCost * 3 / 5), attributedEarnedSurplus: 0 } },
    { kind: 'companion', fixtureId: 'companion-level-100-exact-cap', savedLevel: 100, rawExp: companionCap, lineage: { kind: 'synthetic-attributed-exp-ledger', baselineRawExp: companionCap, attributedEarnedSurplus: 0 } },
    { kind: 'companion', fixtureId: 'companion-level-100-attributed-surplus', savedLevel: 100, rawExp: companionCap + 65432, lineage: { kind: 'synthetic-attributed-exp-ledger', baselineRawExp: companionCap, attributedEarnedSurplus: 65432 } }
  ];
  return recipes.map(input => {
    const table = input.kind === 'fellow' ? fellowTable : companionTable;
    const legacy = input.kind === 'fellow' ? oldFellow : oldCompanion;
    const first = applyMigration(input.kind, input, legacy, table);
    const second = applyMigration(input.kind, input, legacy, table, first);
    const firstHash = tableHash(first), secondHash = tableHash(second);
    return {
      fixtureId: input.fixtureId,
      input,
      result: first,
      firstApplicationSha256: firstHash,
      secondApplicationSha256: secondHash,
      secondApplicationNoOp: firstHash === secondHash
    };
  });
}

function scanNumbers(value, path = '$', rows = []) {
  if (typeof value === 'number') rows.push({ path, value });
  else if (Array.isArray(value)) value.forEach((item, index) => scanNumbers(item, `${path}[${index}]`, rows));
  else if (value && typeof value === 'object') Object.entries(value).forEach(([key, item]) => scanNumbers(item, `${path}.${key}`, rows));
  return rows;
}

function safeIntegerAudit(report, candidate, baseline, fellowTable, companionTable) {
  const active = baseline.authority.definitions.active;
  const collectionBps = Math.max(...candidate.collectionStressBps);
  const companionAtCap = Object.values(active.companion.basePower).map(base => Math.round(base * companionTable.rows.at(-1).levelMultiplier * 1.4 * 1.5));
  const maxCompanionTransfer = Math.max(...companionAtCap) * active.fellow.companionTransferRate;
  const fellowAtCap = Object.values(active.fellow.basePower).map(base => Math.round((
    base * fellowTable.rows.at(-1).levelMultiplier * 1.32 * 1.0975 + maxCompanionTransfer
  ) * 1.12 * (1 + 0.5 + collectionBps / 10000)));
  const high = baseline.profiles.find(profile => profile.profileId === 'phase24a.true-high-investment.schema13.v1');
  const trueHighPreOathGoldPerHour = sum(high.economy.buildings.map(building => building.unroundedGoldPerHour / building.oathMultiplier));
  const trueHighOathBonus = high.economy.buildings[0].oathMultiplier - 1;
  assert(high.economy.buildings.every(building => building.oathMultiplier - 1 === trueHighOathBonus), 'true-high Oath multipliers diverged');
  const trueHighGoldPerHourAtCollectionStress = trueHighPreOathGoldPerHour * (1 + trueHighOathBonus + collectionBps / 10000);
  const trueHighDaily24HourClaimAtCollectionStress = Math.floor(trueHighGoldPerHourAtCollectionStress * 24);
  const trueHigh365DayAccumulatedGoldAtCollectionStress = active.economy.freshGold + trueHighDaily24HourClaimAtCollectionStress * 365;
  const theoretical = {
    fellowCapRosterPowerAtMaxReleasedModifiersAnd1000PercentCollection: sum(fellowAtCap),
    companionCapRosterPowerAtMaxReleasedRarityAndMastery: sum(companionAtCap),
    fellowCapCumulativeExpPerMember: fellowTable.cumulativeExpAtCap,
    companionCapCumulativeExpPerMember: companionTable.cumulativeExpAtCap,
    fellow365DayEligibleExpAt1000PercentCollection: effectiveEligibleExp(candidate.throughput.proposedLaunchExpBudget.rows.at(-1).fellowRawExp, collectionBps),
    companion365DayEligibleExpAt1000PercentCollection: effectiveEligibleExp(candidate.throughput.proposedLaunchExpBudget.rows.at(-1).companionRawExp, collectionBps),
    trueHighEconomyAt1000PercentCollection: {
      applicationOrder: 'pre-Oath Gold/hour * (1 + Oath bonus + Collection Earnings); never multiply the already-Oath-boosted total',
      startingGold: active.economy.freshGold,
      preOathGoldPerHour: trueHighPreOathGoldPerHour,
      oathBonusBps: Math.round(trueHighOathBonus * 10000),
      collectionEarningsBps: collectionBps,
      goldPerHour: trueHighGoldPerHourAtCollectionStress,
      daily24HourClaim: trueHighDaily24HourClaimAtCollectionStress,
      dailyClaimCount: 365,
      accumulatedGoldAfter365DailyClaims: trueHigh365DayAccumulatedGoldAtCollectionStress,
      isSafeInteger: Number.isSafeInteger(trueHigh365DayAccumulatedGoldAtCollectionStress)
    }
  };
  const numbers = scanNumbers({ report, theoretical });
  const unsafe = numbers.filter(row => !Number.isFinite(row.value) || Number.isInteger(row.value) && !Number.isSafeInteger(row.value));
  const integers = numbers.filter(row => Number.isInteger(row.value));
  const maxIntegerRow = integers.reduce((max, row) => Math.abs(row.value) > Math.abs(max.value) ? row : max, { path: null, value: 0 });
  return {
    ok: unsafe.length === 0,
    maximumSafeInteger: MAX_SAFE,
    numericCount: numbers.length,
    integerCount: integers.length,
    maximumObservedInteger: maxIntegerRow,
    remainingHeadroom: MAX_SAFE - Math.abs(maxIntegerRow.value),
    unsafe,
    theoretical
  };
}

function targetAssessment(candidate, fellowTable, matrix) {
  const at = (strategy, days, collectionBps = 0) => matrix.find(row => row.strategy === strategy && row.days === days && row.collectionBps === collectionBps);
  const focused1 = at('focused', 1), focused7 = at('focused', 7), focused30 = at('focused', 30), focused365 = at('focused', 365), broad7 = at('broad', 7), broad30 = at('broad', 30), broad365 = at('broad', 365);
  const freshSixBroad = [1, 7].map(days => {
    const budget = candidate.throughput.proposedLaunchExpBudget.rows.find(row => row.days === days);
    const exp = distributeInteger(budget.fellowRawExp, 6);
    const units = distributeInteger(budget.fellowBreakthroughUnits, 6);
    const progress = exp.map((value, index) => simulateProgress(fellowTable, value, units[index]));
    return { days, rosterBasis: 'six-Fellows-actually-joined-at-fresh-rank', levelSummary: summaryLevels(progress), totalBankedExp: sum(progress.map(row => row.bankedExp)) };
  });
  const freshSixAt1 = freshSixBroad.find(row => row.days === 1), freshSixAt7 = freshSixBroad.find(row => row.days === 7);
  return {
    firstSessionFocusedFellow100To250: focused1.fellow.lead.level >= 100 && focused1.fellow.lead.level <= 250,
    firstSessionBroadFellow50To150OnFreshSixJoined: freshSixAt1.levelSummary.medianLow >= 50 && freshSixAt1.levelSummary.medianHigh <= 150,
    firstWeekFocusedFellow450To550: focused7.fellow.lead.level >= 450 && focused7.fellow.lead.level <= 550,
    firstWeekBroadFellow250To400OnFreshSixJoined: freshSixAt7.levelSummary.medianLow >= 250 && freshSixAt7.levelSummary.medianHigh <= 400,
    syntheticFull18FirstWeekBroadFellow250To400: broad7.fellow.levelSummary.medianLow >= 250 && broad7.fellow.levelSummary.medianHigh <= 400,
    earlyEstablishedFocusedFellow600To650At30Days: focused30.fellow.lead.level >= 600 && focused30.fellow.lead.level <= 650,
    earlyEstablishedBroadFellow400To500At30Days: broad30.fellow.levelSummary.medianLow >= 400 && broad30.fellow.levelSummary.medianHigh <= 500,
    longTermFocusedFellow700To750At365Days: focused365.fellow.lead.level >= 700 && focused365.fellow.lead.level <= 750,
    longTermBroadFellow500To650At365Days: broad365.fellow.levelSummary.medianLow >= 500 && broad365.fellow.levelSummary.medianHigh <= 650,
    freshSixBroad,
    full18BroadScenarioPrerequisite: 'All matrix rows labeled broad are synthetic full-18-roster evidence and require those Fellows to be recruited; they are not fresh-save roster evidence.',
    dynamicRankJoinTimelineModeled: false,
    caveat: 'These checks measure the provisional proposed-launch budget only. Released-mechanics throughput is reported separately as frozen-fresh static bounds and does not satisfy the same budget.'
  };
}

function makeHumanReport(report) {
  const zeroRows = report.scenarios.filter(row => row.collectionBps === 0);
  const extremeRows = report.scenarios.filter(row => row.collectionBps === 100000 && row.days === 365);
  const liveRows = report.currentLiveThroughput.rows;
  const liveDayOne = liveRows.find(row => row.days === 1);
  const lines = [
    '# Phase 24B deterministic progression simulation',
    '',
    `**Verdict:** ${report.verdict}`,
    '',
    'This is an output-only candidate report. It changes no runtime, save, reward, or live balance. All EXP bands, Breakthrough units, throughput budgets, and post-500 multipliers remain provisional until explicit root acceptance.',
    '',
    '## Frozen Phase 24A baseline',
    '',
    `- Authority: \`${report.source.baselineAuthorityConfigId}\``,
    `- Baseline report SHA-256: \`${report.source.baselineReportSha256}\``,
    `- Candidate SHA-256: \`${report.source.candidateSha256}\``,
    `- Fresh anchors remain exactly ${report.baselineNeutrality.fresh.fellowCombatPower.toLocaleString()} Fellow Combat, ${report.baselineNeutrality.fresh.companionPower.toLocaleString()} Companion, and ${report.baselineNeutrality.fresh.villageGoldPerHour} Gold/hour at zero Collections.`,
    `- Migrated-established remains ${report.baselineNeutrality.migrated.fellowCombatPower.toLocaleString()} Fellow Combat with ${report.baselineNeutrality.migrated.companionActualPower.toLocaleString()} actual / ${report.baselineNeutrality.migrated.companionMigrationFloorPower.toLocaleString()} protected Companion Power.`,
    '- The released Broken Roads authority is 22K / 28.5K / 36K / 45K / 56K / 69K / 84K / 101K / 121K / 144K. Appendix C\'s 22K / 26K / 30.5K prose row is stale and was not used.',
    '',
    '## Candidate tables',
    '',
    '| Lane | Cap | Transitions | Cumulative EXP at cap | Breakthrough gates | Table SHA-256 |',
    '|---|---:|---:|---:|---:|---|',
    `| Fellow | 750 | ${report.tables.fellow.transitionCount} | ${report.tables.fellow.cumulativeExpAtCap.toLocaleString()} | ${report.tables.fellow.breakthroughs.length} | \`${report.tables.fellow.transitionTableSha256}\` |`,
    `| Companion | 500 | ${report.tables.companion.transitionCount} | ${report.tables.companion.cumulativeExpAtCap.toLocaleString()} | ${report.tables.companion.breakthroughs.length} | \`${report.tables.companion.transitionTableSha256}\` |`,
    '',
    'The Breakthrough `requirementUnits` are abstract pacing units, not a proposed new currency. They must be mapped to existing materials or fixed claim bundles before runtime work.',
    `The 5M Level-550→600 and 17.5M Level-600→650 Fellow bands preserve the cited 3.5× widening at exactly one-fortieth of the 200M / 700M external scale. That divisor is a provisional target-fit hypothesis, not approved balance.`,
    '',
    '### Companion Level-500 rounding authority',
    '',
    '| Fixture | Actual member-rounded total | Theoretical aggregate-unrounded | Used for reachability |',
    '|---|---:|---:|---|',
    ...report.companionCapRounding.fixtures.map(row => `| ${row.id} | ${row.actualMemberRoundedTotal.toLocaleString()} | ${row.theoreticalAggregateUnrounded.toLocaleString()} | actual |`),
    '',
    '## Released-mechanics static bounds versus provisional launch budget',
    '',
    '| Days | Static Fellow lower bound | Proposed Fellow EXP | Static share | Rank-2 Companion Campaign lower bound | Proposed Companion EXP | Static share |',
    '|---:|---:|---:|---:|---:|---:|---:|',
    ...liveRows.map(row => `| ${row.days} | ${row.fellow.staticFreshPowerLowerBoundAccountExp.toLocaleString()} | ${row.fellow.proposedBudgetExp.toLocaleString()} | ${row.fellow.staticAsPercentOfProposed}% | ${row.companion.rank2AccessibleStaticCampaignLowerBoundAccountExp.toLocaleString()} | ${row.companion.proposedBudgetExp.toLocaleString()} | ${row.companion.staticCampaignAsPercentOfProposed}% |`),
    '',
    'These are conservative frozen-fresh Campaign bounds, not exact current-live forecasts. They hold Levels, Power, Rank joins, and accessible stages constant. The Companion bound first charges the two Fellow clears required for Rank 2; the separate Fellow bound spends that Gold differently, so the lane totals cannot be added together. A dynamic old-curve EXP → Level → Power → joins → access simulation with one conserved Gold ledger remains unimplemented.',
    `Tower requires Rank 3 and is therefore excluded. The explicit Day-1 no-unlock/no-shared-Gold power-only upper envelope is ${liveDayOne.companion.noUnlockNoSharedGoldPowerOnlyAccountExpUpperEnvelope.toLocaleString()}: ${liveDayOne.companion.campaignPowerOnlyNoRankNoSharedGoldExp.toLocaleString()} Campaign + ${liveDayOne.companion.powerOnlyTowerClearAccountExp.toLocaleString()} one-target Tower clears + ${(liveDayOne.companion.powerOnlyTowerUpperExp - liveDayOne.companion.powerOnlyTowerClearAccountExp).toLocaleString()} all-roster Tower idle EXP. It is conditional evidence, not a fresh reachable route.`,
    'The proposed launch budget requires new permanent authored EXP and Breakthrough-material sources; it is not already available in Everstead.',
    '',
    '## Zero-Collection proposed-budget outcomes',
    '',
    '| Strategy | Days | Fellow levels min–median–max | Lead Fellow | Fellow Campaign | Expedition | Companion levels min–median–max | Tower |',
    '|---|---:|---|---:|---:|---:|---|---:|',
    ...zeroRows.map(row => `| ${row.strategy} | ${row.days} | ${row.fellow.levelSummary.min}–${row.fellow.levelSummary.medianLow}/${row.fellow.levelSummary.medianHigh}–${row.fellow.levelSummary.max} | ${row.fellow.lead.level} | ${row.fellow.campaignHighestStage}/10 | ${row.fellow.expedition.highestStage}/50 | ${row.companion.levelSummary.min}–${row.companion.levelSummary.medianLow}/${row.companion.levelSummary.medianHigh}–${row.companion.levelSummary.max} | ${row.companion.towerHighestFloor}/50 |`),
    '',
    'Rows labeled broad use a synthetic all-18-Fellow roster and therefore require recruitment first. The target assessment separately reports Day 1 and Day 7 equal-investment results for the six Fellows actually joined on a fresh save.',
    'The current Expedition algorithm exhausts one distinct Fellow per stage. It therefore has a structural maximum of six stages for the focused fresh roster and eighteen for the complete roster, regardless of the 50-row requirement table. That requires a separate design decision before stages 19–50 can be real goals.',
    '',
    '## +1,000% Collection stress at 365 days',
    '',
    ...extremeRows.map(row => `- **${row.strategy}:** Fellow Power ${row.fellow.totalPower.toLocaleString()}, lead Level ${row.fellow.lead.level}, Companion Power ${row.companion.totalPower.toLocaleString()}, Village ${row.economy.freshZeroOathGoldPerHour.toLocaleString()} Gold/hour.`),
    '',
    'Collection EXP changes only newly earned eligible EXP; Collection Power is added beside Might; Collection Earnings is added beside Oath; and the normalized facility pool remains local. The simulator never compounds a Collection percentage onto an already-boosted total.',
    `All ${report.collectionPolicyEvidence.claims.length} synthetic stress claims apply exactly once, replay as no-ops, and accept a later +100 bps grant without clipping. The +1,000% row is a stress boundary, not a lifetime cap; mandatory reachability uses zero Collection and assumes no limited-event bonus.`,
    '',
    '| Pool | Existing adjacent bonus | Collection | Required additive result | Forbidden compounded result |',
    '|---|---:|---:|---:|---:|',
    ...report.collectionPolicyEvidence.adjacentBonusOrderProbes.map(row => `| ${row.pool} beside ${row.adjacentLane} | ${row.existingBonusBps / 100}% | ${row.collectionBps / 100}% | ${row.additiveResult.toLocaleString()} | ${row.forbiddenCompoundedResult.toLocaleString()} |`),
    '',
    `Requirement isolation: ${report.mandatoryContentIsolation.profileCount} provenance-composed zero/permanent/all-content profiles cover every stress point and share one immutable requirement-hash identity. Limited-event bonuses contribute to runtime all-content totals but never to the permanent-only requirement-authoring profile.`,
    `Collection ledger migration: exact uncapped pools reconstruct as Power ${report.collectionLedgerMigrationEvidence.first.namedPoolTotalsBps.power}, Earnings ${report.collectionLedgerMigrationEvidence.first.namedPoolTotalsBps.earnings}, EXP ${report.collectionLedgerMigrationEvidence.first.namedPoolTotalsBps.exp}, Facility ${report.collectionLedgerMigrationEvidence.first.namedPoolTotalsBps.facility} bps without old-cap clipping; replay is a no-op and a future grant still adds.`,
    `Limited-content alternative: one shared mechanical entitlement prevents double claiming whether the limited or permanent source arrives first, while limited art/title metadata remains preserved.`,
    `Delayed claim proof: captured Fellow EXP ${report.delayedClaimEvidence.captured.capturedRewards.fellowExp.toLocaleString()} and facility reward ${report.delayedClaimEvidence.captured.capturedRewards.facilityActiveReward.toLocaleString()} remain unchanged after later lane-specific growth, survive ready and claimed migrations, apply once, reload with the same receipt, and replay for zero. Oath is not applied to the active-facility reward.`,
    '',
    '## Existing-save migration recipes',
    '',
    '| Fixture | Saved Level | Old raw EXP | New active EXP | Retained cap bank | Grandfathered gates | Legacy claim | Repeat-safe |',
    '|---|---:|---:|---:|---:|---|---|---|',
    ...report.migrations.map(row => `| ${row.fixtureId} | ${row.input.savedLevel} | ${row.input.rawExp.toLocaleString()} | ${row.result.newCurve.activeExp.toLocaleString()} | ${row.result.legacyCapBankedExp.toLocaleString()} | ${row.result.grandfatheredGates.join(', ') || 'none'} | ${row.result.legacyBreakthroughClaim?.status || 'none'} | ${row.secondApplicationNoOp ? 'yes' : 'NO'} |`),
    '',
    'Raw Phase 23 EXP is never read directly under the candidate table. Mid-level progress is preserved as an exact rational value plus integer mapping remainder. At-cap surplus remains an auditable separate bank. Companion Level 100 receives a free manual exactly-once legacy Breakthrough; Fellow Level 120 next encounters the ordinary Level-150 gate.',
    '',
    '## Manual Breakthrough lifecycle',
    '',
    '| Fixture | Closed gate | Banked EXP | Claim cost | Level after claim | EXP left | Reload replay | Persistent state |',
    '|---|---:|---:|---:|---:|---:|---|---|',
    ...report.manualBreakthroughLifecycleEvidence.map(row => `| ${row.fixtureId} | ${row.initial.level} | ${row.afterExpDeposit.bankedExp.toLocaleString()} | ${row.successfulClaim.state.gate.materialUnitsSpent} | ${row.successfulClaim.state.level} | ${row.successfulClaim.state.bankedExp.toLocaleString()} | ${row.persistedReload.replayNoOp ? 'no-op' : 'FAILED'} | ${row.persistentStatePreserved ? 'preserved' : 'FAILED'} |`),
    '',
    'The Fellow fixture proves insufficient materials do nothing, the exact unit is spent once, and banked EXP advances only after the manual claim. The migrated Companion Level-100 fixture remains queued until a free manual claim, spends zero units, preserves its migration and claim receipts through reload, and next encounters the ordinary Level-150 gate.',
    '',
    '## Target fit and blockers',
    '',
    ...Object.entries(report.targetAssessment).filter(([key, value]) => typeof value === 'boolean' && key !== 'dynamicRankJoinTimelineModeled').map(([key, value]) => `- ${value ? 'PASS' : 'MISS'} — ${key}`),
    '',
    ...report.findings.map(item => `- **${item.severity}:** ${item.text}`),
    '',
    '## Safe-integer result',
    '',
    `All simulated values are finite and safe: **${report.safeIntegerAudit.ok ? 'PASS' : 'FAIL'}**. The largest observed integer is ${Math.abs(report.safeIntegerAudit.maximumObservedInteger.value).toLocaleString()} at \`${report.safeIntegerAudit.maximumObservedInteger.path}\`, leaving ${report.safeIntegerAudit.remainingHeadroom.toLocaleString()} integers of headroom below JavaScript's maximum safe integer.`,
    `The true-high economy at +1,000% Collection Earnings produces a daily 24-hour claim of ${report.safeIntegerAudit.theoretical.trueHighEconomyAt1000PercentCollection.daily24HourClaim.toLocaleString()} Gold and ${report.safeIntegerAudit.theoretical.trueHighEconomyAt1000PercentCollection.accumulatedGoldAfter365DailyClaims.toLocaleString()} Gold after 365 daily claims plus starting Gold. This applies Collection beside Oath and remains a safe integer.`,
    '',
    '## Decision boundary',
    '',
    'This report can accept the simulation machinery while still rejecting runtime adoption. Shipping any candidate requires explicit curve approval, real permanent reward sources, exact material identities, an implemented exactly-once save migration, and a new browser acceptance gate.',
    ''
  ];
  return lines.join('\n');
}

async function generate() {
  const [candidateText, baselineText] = await Promise.all([readFile(CANDIDATE_PATH, 'utf8'), readFile(BASELINE_PATH, 'utf8')]);
  const candidate = JSON.parse(candidateText), baseline = JSON.parse(baselineText);
  assert(candidate.status === 'provisional-output-only-not-runtime-authority', 'candidate is not explicitly provisional');
  assert(candidate.collectionStressBps.join(',') === '0,2500,5000,10000,25000,50000,100000', 'Collection stress set changed');
  const profiles = assertBaseline(candidate, baseline, baselineText);
  const fellowTable = buildLevelTable('fellow', candidate.fellow, candidate.tableExpansion);
  const companionTable = buildLevelTable('companion', candidate.companion, candidate.tableExpansion);
  const currentLive = currentLiveThroughput(candidate, baseline, profiles);
  const scenarios = scenarioMatrix(candidate, baseline, profiles, fellowTable, companionTable);
  const migrations = migrationSimulations(candidate, fellowTable, companionTable);
  const companionCapRounding = companionCapRoundingEvidence(candidate, baseline, companionTable);
  const collectionEvidence = collectionPolicyEvidence(candidate);
  const delayedClaim = delayedClaimEvidence(candidate);
  const requirementIsolation = mandatoryContentIsolation(candidate, baseline);
  const collectionLedgerMigration = collectionLedgerMigrationEvidence(candidate);
  const limitedAlternative = limitedEventAlternativeEvidence(candidate);
  const manualBreakthroughLifecycle = manualBreakthroughLifecycleEvidence(candidate, fellowTable, companionTable);
  assert(migrations.length === 6 && migrations.every(row => row.secondApplicationNoOp), 'migration fixtures are not exactly-once repeat-safe');
  assert(delayedClaim.exactlyOnce && delayedClaim.capturedValuesUnchangedAfterGrowth && delayedClaim.receiptIdentityStableAcrossReadyClaimedAndMigration && delayedClaim.allExternalInputsChanged && delayedClaim.laterState.oathAppliedToFacilityReward === false && delayedClaim.persistedReloadReplay.noOp, 'delayed claim fixture failed');
  assert(requirementIsolation.profileCount === 21 && requirementIsolation.allRequirementHashesIdentical && requirementIsolation.requirementAuthoringReadsOnlyPermanentFixture && requirementIsolation.limitedContributesToRuntimeAllContentTotals, 'Collection ownership isolation failed');
  assert(collectionLedgerMigration.noLoss && collectionLedgerMigration.obsoleteCapsIgnored && collectionLedgerMigration.secondApplicationNoOp && collectionLedgerMigration.futureGrantContinuesUncappedGrowth, 'Collection ledger migration failed');
  assert(limitedAlternative.equivalentPermanentSourceExists && limitedAlternative.allOrdersPreventDoubleMechanicalClaim && limitedAlternative.limitedExclusiveMetadataPreserved, 'limited-event permanent alternative failed');
  assert(collectionEvidence.allAdjacentBonusOrderProbesNonVacuous, 'Collection adjacent-bonus order probes failed');
  assert(manualBreakthroughLifecycle.length === 2 && manualBreakthroughLifecycle.every(row => row.expBankedAtClosedGate && row.insufficientAttempt.exactNoOp && row.manualOnly && row.exactMaterialSpend && row.bankedExpAdvancedOnlyAfterClaim && row.persistentStatePreserved && row.derivedPowerChangedOnlyWithIntendedLevelAdvancement && row.stableClaimReceipt && row.exactlyOnceAcrossReload), 'manual Breakthrough lifecycle failed');
  const companionLegacyLifecycle = manualBreakthroughLifecycle.find(row => row.lane === 'companion');
  assert(companionLegacyLifecycle.successfulClaim.state.gate.materialUnitsSpent === 0 && companionLegacyLifecycle.nextOrdinaryGate === 150 && companionLegacyLifecycle.legacyQueueMigration?.queuedNotAutoClaimed && companionLegacyLifecycle.legacyQueueMigration?.secondApplicationNoOp && companionLegacyLifecycle.legacyMigrationReapply?.noOp && companionLegacyLifecycle.legacyMigrationReapply?.noDuplicateEntitlement, 'Companion free legacy Breakthrough lifecycle failed');
  assert(tableHash(collectionLedgerMigration.first.namedPoolTotalsBps) === tableHash(collectionLedgerMigration.exactNamedPoolTotalsExpected), 'Collection ledger exact named-pool totals changed');
  const dayOneStatic = currentLive.rows.find(row => row.days === 1);
  assert(dayOneStatic.companion.powerOnlyTowerClearAccountExp === 90 && dayOneStatic.companion.powerOnlyTowerUpperExp === 11610 && dayOneStatic.companion.noUnlockNoSharedGoldPowerOnlyAccountExpUpperEnvelope === 16160, 'day-one Companion power-only envelope changed');
  assert(dayOneStatic.companion.rank2AccessibleStaticCampaignLowerBoundAccountExp === 4400 && dayOneStatic.companion.towerRankUnlockProven === false, 'day-one static Companion Campaign bound changed');
  const releasedFellowRequirements = profiles.fresh.requirements.fellowCampaign;
  assert(releasedFellowRequirements.join(',') === '22000,28500,36000,45000,56000,69000,84000,101000,121000,144000', 'released Fellow Campaign requirements changed');
  const dayOneFocusedZero = scenarios.find(row => row.strategy === 'focused' && row.days === 1 && row.collectionBps === 0);
  assert(dayOneFocusedZero.fellow.totalPower === 313664 && dayOneFocusedZero.fellow.campaignHighestStage === 10, 'day-one current-content compression anchor changed');
  const targets = targetAssessment(candidate, fellowTable, scenarios);
  const targetBooleans = Object.entries(targets).filter(([key, value]) => typeof value === 'boolean' && key !== 'dynamicRankJoinTimelineModeled');
  assert(targetBooleans.length === 9 && targetBooleans.every(([, value]) => value), 'provisional pacing target assessment changed');
  const report = {
    reportId: 'phase24b-progression-simulation.v1',
    contractId: 'phase-24b-progression-simulation-v1',
    status: 'provisional-output-only',
    verdict: 'SIMULATION LANE PASS · RUNTIME ADOPTION NOT APPROVED',
    source: {
      candidateId: candidate.candidateId,
      candidateSha256: sha256(candidateText),
      baselineContractId: baseline.contractId,
      baselineAuthorityConfigId: baseline.authority.configId,
      baselineReportSha256: sha256(baselineText),
      baselineSourceHashes: clone(baseline.authority.sourceHashes)
    },
    baselineNeutrality: {
      collectionBps: 0,
      productionChanged: false,
      fresh: {
        fellowEconomyPower: profiles.fresh.fellowEconomy.rosterPower,
        fellowCombatPower: profiles.fresh.fellowCombat.rosterPower,
        companionPower: profiles.fresh.companion.actualRosterPower,
        villageGoldPerHour: profiles.fresh.economy.totalGoldPerHour
      },
      migrated: {
        fellowCombatPower: profiles.migrated.fellowCombat.rosterPower,
        companionActualPower: profiles.migrated.companion.actualRosterPower,
        companionMigrationFloorPower: profiles.migrated.companion.migrationFloorRosterPower,
        villageGoldPerHour: profiles.migrated.economy.totalGoldPerHour
      },
      high: {
        fellowEconomyPower: profiles.high.fellowEconomy.rosterPower,
        fellowCombatPower: profiles.high.fellowCombat.rosterPower,
        companionPower: profiles.high.companion.actualRosterPower,
        villageGoldPerHour: profiles.high.economy.totalGoldPerHour
      }
    },
    authorityDiscrepancy: {
      staleAppendixCProse: [22000, 26000, 30500, 35500, 42000, 49500, 58000, 68000, 80000, 95000],
      frozenReleasedRuntime: clone(releasedFellowRequirements),
      selectedAuthority: 'frozen-released-runtime',
      repricedExistingContent: false
    },
    tables: {
      fellow: {
        status: 'provisional',
        levelCap: fellowTable.levelCap,
        transitionCount: fellowTable.transitionCount,
        cumulativeExpAtCap: fellowTable.cumulativeExpAtCap,
        expBands: fellowTable.expBands,
        breakthroughs: fellowTable.breakthroughs,
        transitionTableSha256: fellowTable.transitionTableSha256,
        levelTableSha256: fellowTable.levelTableSha256,
        levels: fellowTable.rows
      },
      companion: {
        status: 'provisional',
        levelCap: companionTable.levelCap,
        transitionCount: companionTable.transitionCount,
        cumulativeExpAtCap: companionTable.cumulativeExpAtCap,
        expBands: companionTable.expBands,
        breakthroughs: companionTable.breakthroughs,
        transitionTableSha256: companionTable.transitionTableSha256,
        levelTableSha256: companionTable.levelTableSha256,
        levels: companionTable.rows
      }
    },
    fellowExpScaleRationale: clone(candidate.fellow.expScaleRationale),
    companionCapRounding,
    currentLiveThroughput: currentLive,
    proposedLaunchBudget: clone(candidate.throughput.proposedLaunchExpBudget),
    collectionStressBps: clone(candidate.collectionStressBps),
    scenarios,
    collectionPolicyEvidence: collectionEvidence,
    delayedClaimEvidence: delayedClaim,
    mandatoryContentIsolation: requirementIsolation,
    collectionLedgerMigrationEvidence: collectionLedgerMigration,
    limitedEventAlternativeEvidence: limitedAlternative,
    manualBreakthroughLifecycleEvidence: manualBreakthroughLifecycle,
    migrations,
    targetAssessment: targets,
    findings: [
      { severity: 'BLOCKER BEFORE RUNTIME', text: 'Released Fellow EXP throughput is orders of magnitude below the provisional first-week budget. Permanent authored EXP sources and their claim behavior must be designed before this curve can ship.' },
      { severity: 'BLOCKER BEFORE RUNTIME', text: `The provisional day-one focused budget yields ${dayOneFocusedZero.fellow.totalPower.toLocaleString()} Fellow Power and makes all 10 released Broken Roads stages Power-reachable against the final 144,000 requirement. Any runtime reward plan must sequence EXP behind story/stage gates or target post-current content; released requirements remain frozen and were not repriced.` },
      { severity: 'BLOCKER BEFORE RUNTIME', text: 'Breakthrough requirements are normalized simulation units only. Exact existing materials or fixed bundles, acquisition rates, and manual claim presentation remain unresolved.' },
      { severity: 'EVIDENCE LIMIT', text: 'Released-mechanics horizon values are conservative frozen-fresh Campaign bounds plus explicitly conditional Tower upper envelopes, not a dynamic current-live forecast. A full old-curve EXP, Level, Power, Rank-join, access, target-rotation, and conserved-Gold simulation remains unimplemented.' },
      { severity: 'ROSTER PREREQUISITE', text: 'Broad matrix rows use a synthetic full 18-Fellow roster. Fresh-save early breadth is separately probed across the six actually joined Fellows; the Rank-crossing recruitment timeline remains unmodeled.' },
      { severity: 'STRUCTURAL', text: 'The released Fellow Expedition exhausts one distinct Fellow per stage, limiting the 18-Fellow roster to Stage 18 even though 50 requirements exist.' },
      { severity: 'MIGRATION', text: 'Old cumulative EXP is table-dependent. Runtime migration needs authenticated lineage, exact rational progress preservation, a separate post-cap bank, and a free manual Companion Level-100 legacy Breakthrough.' },
      { severity: 'AUTHORITY', text: 'The stale Appendix C Broken Roads prose table was rejected in favor of the frozen Phase 24A runtime table; no existing stage was repriced.' },
      { severity: 'COLLECTION', text: 'All mandatory reachability remains testable at zero Collection. The +1,000% stress rows measure long-horizon headroom and do not create a lifetime cap.' }
    ]
  };
  report.safeIntegerAudit = safeIntegerAudit(report, candidate, baseline, fellowTable, companionTable);
  assert(report.safeIntegerAudit.ok, 'unsafe or non-finite number in generated report');
  const json = jsonText(report);
  const markdown = `${makeHumanReport(report)}\n`;
  const checksums = `${sha256(json)}  qa/phase-24b-progression/reports/phase24b-progression-simulation.json\n${sha256(markdown)}  qa/phase-24b-progression/reports/phase24b-progression-simulation.md\n`;
  return { report, json, markdown, checksums };
}

async function writeOrCheck(output, check) {
  if (check) {
    const [existingJson, existingMarkdown, existingChecksums] = await Promise.all([
      readFile(JSON_PATH, 'utf8'), readFile(MD_PATH, 'utf8'), readFile(CHECKSUM_PATH, 'utf8')
    ]);
    assert(existingJson === output.json, 'machine report is stale or nondeterministic');
    assert(existingMarkdown === output.markdown, 'human report is stale or nondeterministic');
    assert(existingChecksums === output.checksums, 'checksum manifest is stale');
    return;
  }
  await mkdir(REPORT_DIR, { recursive: true });
  await Promise.all([
    writeFile(JSON_PATH, output.json),
    writeFile(MD_PATH, output.markdown),
    writeFile(CHECKSUM_PATH, output.checksums)
  ]);
}

const check = process.argv.includes('--check');
const output = await generate();
await writeOrCheck(output, check);
console.log(`Phase 24B ${check ? 'check' : 'generation'} PASS`);
console.log(`Fellow table: ${output.report.tables.fellow.transitionCount} transitions · cap EXP ${output.report.tables.fellow.cumulativeExpAtCap}`);
console.log(`Companion table: ${output.report.tables.companion.transitionCount} transitions · cap EXP ${output.report.tables.companion.cumulativeExpAtCap}`);
console.log(`Scenarios: ${output.report.scenarios.length} · migrations: ${output.report.migrations.length} · safe integer: ${output.report.safeIntegerAudit.ok}`);
