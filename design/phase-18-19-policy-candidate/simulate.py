#!/usr/bin/env python3
"""Deterministic balance/headroom simulation for the Phase 18–19 candidate."""

from __future__ import annotations

import argparse
import json
from pathlib import Path

HERE = Path(__file__).resolve().parent
OUTPUT = HERE / "simulation-results.json"
TABLE = HERE / "fixed-reward-table.json"
BASE_RATES = (7200, 6500, 5600, 6100)
GROWTH = 1.15
HORIZONS = (1, 7, 30, 365, 1825)
PROFILES = (
    {"id": "profile.fresh", "level": 1, "visitHours": 12, "preciseShare": .45, "resonantShare": .45, "mentorGold": 0, "namedPatients": 0},
    {"id": "profile.midgame", "level": 8, "visitHours": 8, "preciseShare": .60, "resonantShare": .60, "mentorGold": 0, "namedPatients": 1},
    {"id": "profile.established", "level": 20, "visitHours": 6, "preciseShare": .70, "resonantShare": .70, "mentorGold": 250, "namedPatients": 2},
    {"id": "profile.high-activity", "level": 35, "visitHours": 2, "preciseShare": 1, "resonantShare": 1, "mentorGold": 250, "namedPatients": 2},
    {"id": "profile.mostly-idle", "level": 20, "visitHours": 24, "preciseShare": .40, "resonantShare": .40, "mentorGold": 0, "namedPatients": 1},
)


def structural_rate(level: int) -> int:
    return sum(round(rate * (GROWTH ** (level - 1))) for rate in BASE_RATES)


def select_band(rate: int, table: dict) -> dict:
    matches = [band for band in table["bands"] if rate >= band["minimumGoldPerHourInclusive"] and (band["maximumGoldPerHourInclusive"] is None or rate <= band["maximumGoldPerHourInclusive"])]
    if len(matches) != 1:
        raise ValueError(f"rate {rate} resolved to {len(matches)} bands")
    return matches[0]


def opportunities_per_day(interval_hours: float, capacity: int, visit_hours: float) -> float:
    return min(24 / interval_hours, capacity * 24 / visit_hours)


def rounded_claims(per_day: float, days: int) -> int:
    return int(per_day * days)


def simulate_pupil_lessons(resonant_share: float, mentor_progress: int) -> tuple[int, int]:
    """Return lessons and education for three finite V1 pupils.

    Domains rotate, so no domain can be starved. Outcome selection is a stable
    accumulator, avoiding a fractional expected-progress shortcut.
    """
    lessons = education = 0
    for _pupil in range(3):
        progress = [0, 0, 0]
        resonance_accumulator = 0.0
        while min(progress) < 8:
            domain = lessons % 3
            resonance_accumulator += resonant_share
            resonant = resonance_accumulator >= 1
            if resonant:
                resonance_accumulator -= 1
            base = 3 if resonant else 2
            progress[domain] += base + mentor_progress
            education += base
            lessons += 1
    return lessons, education


def build() -> dict:
    table = json.loads(TABLE.read_text())
    results = []
    for profile in PROFILES:
        rate = structural_rate(profile["level"])
        band = select_band(rate, table)
        apoth_rewards = band["apothecaryGoldByOutcomeBandId"]
        school_rewards = band["schoolhouseGoldByOutcomeBandId"]
        apoth_per_day = opportunities_per_day(1, 8, profile["visitHours"])
        school_per_day = opportunities_per_day(1.5, 8, profile["visitHours"])
        apoth_average = round(apoth_rewards["apothecary.outcome.supportive"] * (1 - profile["preciseShare"]) + apoth_rewards["apothecary.outcome.precise"] * profile["preciseShare"])
        school_average = round(school_rewards["schoolhouse.outcome.guided"] * (1 - profile["resonantShare"]) + school_rewards["schoolhouse.outcome.resonant"] * profile["resonantShare"] + profile["mentorGold"])
        mentor_progress = 1 if profile["mentorGold"] else 0
        finite_lessons, finite_education = simulate_pupil_lessons(profile["resonantShare"], mentor_progress)
        horizons = []
        for days in HORIZONS:
            apoth_claims = rounded_claims(apoth_per_day, days)
            available_school_claims = rounded_claims(school_per_day, days)
            school_claims = min(available_school_claims, finite_lessons)
            graduation_count = 3 if school_claims >= finite_lessons else 0
            recurring_gold = apoth_claims * apoth_average + school_claims * school_average
            graduation_gold = graduation_count * band["schoolhouseGraduationGold"]
            achievement_gold = 0
            if apoth_claims >= 10:
                achievement_gold += 5000
            if apoth_claims * profile["preciseShare"] >= 5:
                achievement_gold += 5000
            if apoth_claims >= 3:
                achievement_gold += 5000
            if profile["namedPatients"] >= 2 and apoth_claims >= 2:
                achievement_gold += 7500
            if school_claims >= 10:
                achievement_gold += 5000
            if school_claims >= 3:
                achievement_gold += 5000
            if graduation_count:
                achievement_gold += 7500
            total_gold = recurring_gold + graduation_gold + achievement_gold
            passive_gold = rate * 24 * days
            horizons.append({
                "days": days,
                "apothecaryClaims": apoth_claims,
                "schoolhouseClaims": school_claims,
                "graduations": graduation_count,
                "recurringGold": recurring_gold,
                "graduationGold": graduation_gold,
                "achievementGold": achievement_gold,
                "totalActiveGold": total_gold,
                "passiveGold": passive_gold,
                "recurringShareBasisPoints": round(recurring_gold * 10000 / passive_gold),
                "totalActiveShareBasisPoints": round(total_gold * 10000 / passive_gold),
            })
        results.append({
            "profileId": profile["id"],
            "buildingLevelEach": profile["level"],
            "structuralGoldPerHour": rate,
            "rewardBandId": band["id"],
            "visitIntervalHours": profile["visitHours"],
            "apothecaryOpportunitiesPerDay": apoth_per_day,
            "schoolhouseOpportunitiesPerDayBeforeFiniteContentCap": school_per_day,
            "apothecaryPreciseShare": profile["preciseShare"],
            "schoolhouseResonantShare": profile["resonantShare"],
            "mentorGoldPerLesson": profile["mentorGold"],
            "finitePupilLessonCount": finite_lessons,
            "finitePupilEducationBeforeGraduationClaims": finite_education,
            "horizons": horizons,
        })

    boundaries = []
    for left, right in zip(table["bands"], table["bands"][1:]):
        boundary = right["minimumGoldPerHourInclusive"]
        for rate in (boundary - 1, boundary, boundary + 1):
            band = select_band(rate, table)
            optimal = band["apothecaryGoldByOutcomeBandId"]["apothecary.outcome.precise"] + (band["schoolhouseGoldByOutcomeBandId"]["schoolhouse.outcome.resonant"] + 250) / 1.5
            boundaries.append({"rate": rate, "bandId": band["id"], "combinedOptimalRecurringBasisPoints": round(optimal * 10000 / rate)})

    last = table["bands"][-1]
    five_year_claims = {
        "restaurant30MinuteUpperBound": 24 * 2 * 365 * 5,
        "apothecary60MinuteUpperBound": 24 * 365 * 5,
        "schoolhouse90MinuteUpperBound": 16 * 365 * 5,
        "futureGraduationOnePerDayUpperBound": 365 * 5,
    }
    total_claims = sum(five_year_claims.values())
    maximum_gold_per_claim = max(
        *last["apothecaryGoldByOutcomeBandId"].values(),
        *last["schoolhouseGoldByOutcomeBandId"].values(),
        last["schoolhouseGraduationGold"],
    )
    max_projected_gold = total_claims * maximum_gold_per_claim
    return {
        "simulationId": "simulation.phase-18-19-policy-candidate-v1",
        "status": "candidate-qa-only",
        "productionEnabled": False,
        "assumptions": {
            "passiveBuildingFormula": "four released base rates at a common level with released 1.15 growth",
            "offlineElapsedCapMs": 86400000,
            "bankedOpportunitiesNeverExpire": True,
            "allReadyRewardsRequireManualClaim": True,
            "offlineAgency": False,
            "schoolhouseVerticalSliceFinitePupils": 3,
            "achievementGoldIncludedInTotalButExcludedFromRecurring": True,
            "restaurantGoldExcludedFromPhase18And19ProfileTotals": True,
        },
        "profiles": results,
        "boundaryAdjacentCases": boundaries,
        "headroom": {
            "horizonDays": 1825,
            "claimCountUpperBounds": five_year_claims,
            "totalClaimCountUpperBound": total_claims,
            "recentReceiptLimit": 512,
            "foldBatchSize": 128,
            "estimatedBytesPerRecentReceipt": 768,
            "estimatedBytesForRecentReceipts": 512 * 768,
            "estimatedFacilityAggregateAndOrdinalBytes": 131072,
            "estimatedTotalFacilitySaveBytes": 512 * 768 + 131072,
            "maximumCandidateRewardGold": maximum_gold_per_claim,
            "maximumProjectedGoldIfEveryClaimPaidMaximum": max_projected_gold,
            "maximumSafeInteger": 9007199254740991,
            "safeIntegerHeadroomFactor": 9007199254740991 // max(1, max_projected_gold),
        },
        "guardrailEvaluation": {
            "maximumProfileRecurringShareBasisPoints": max(h["recurringShareBasisPoints"] for p in results for h in p["horizons"]),
            "maximumThirtyDayTotalActiveShareBasisPoints": max(next(h for h in p["horizons"] if h["days"] == 30)["totalActiveShareBasisPoints"] for p in results),
            "maximumBoundaryOptimalRecurringBasisPoints": max(item["combinedOptimalRecurringBasisPoints"] for item in boundaries),
            "passiveProductionMutations": 0,
            "familyAssignmentMutations": 0,
        },
    }


def serialized() -> str:
    return json.dumps(build(), indent=2, ensure_ascii=False) + "\n"


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    expected = serialized()
    if args.check:
        if not OUTPUT.exists() or OUTPUT.read_text() != expected:
            print("FAIL simulation-results.json is stale")
            return 1
        result = json.loads(expected)
        guard = result["guardrailEvaluation"]
        failures = []
        if guard["maximumProfileRecurringShareBasisPoints"] > 1050:
            failures.append("recurring share")
        if guard["maximumThirtyDayTotalActiveShareBasisPoints"] > 1200:
            failures.append("30-day active share")
        if guard["maximumBoundaryOptimalRecurringBasisPoints"] > 1050:
            failures.append("boundary share")
        if result["headroom"]["estimatedTotalFacilitySaveBytes"] >= 1048576:
            failures.append("save estimate")
        if result["headroom"]["safeIntegerHeadroomFactor"] < 100:
            failures.append("integer headroom")
        if failures:
            print("FAIL " + ", ".join(failures))
            return 1
        print("PASS deterministic simulations: 5 profiles × 5 horizons + 153 boundary cases")
        return 0
    OUTPUT.write_text(expected)
    print(f"WROTE {OUTPUT}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
