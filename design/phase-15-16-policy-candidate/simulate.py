#!/usr/bin/env python3
"""Deterministic, read-only candidate balance and storage projection."""

from __future__ import annotations

import argparse
import json
import math
from pathlib import Path


HERE = Path(__file__).resolve().parent
POLICY_PATH = HERE / "policy-candidate.json"
REWARD_TABLE_PATH = HERE / "restaurant-reward-table.json"
RESULT_PATH = HERE / "simulation-results.json"
BUILDING_BASE_RATES = (7200, 6500, 5600, 6100)
LEVEL_MULTIPLIER = 1.15
CUSTOMER_WEIGHTS = {
    "restaurant.customer.road-worker": 0.60,
    "restaurant.customer.archive-courier": 0.40,
}
PROFILES = (
    ("fresh", (1, 1, 1, 1), {"basic": 0.30, "partial": 0.35, "matched": 0.35}),
    ("mid", (8, 8, 8, 8), {"basic": 0.15, "partial": 0.30, "matched": 0.55}),
    ("established", (20, 20, 20, 20), {"basic": 0.05, "partial": 0.25, "matched": 0.70}),
    ("late", (35, 35, 35, 35), {"basic": 0.05, "partial": 0.25, "matched": 0.70}),
    ("cap", (52, 52, 52, 52), {"basic": 0.05, "partial": 0.25, "matched": 0.70}),
)


def structural_rate(levels: tuple[int, ...]) -> int:
    return round(sum(rate * LEVEL_MULTIPLIER ** (level - 1) for rate, level in zip(BUILDING_BASE_RATES, levels)))


def band_for(rate: int, rows: list[dict]) -> dict:
    for row in rows:
        maximum = row["maximumStructuralGoldPerHour"]
        if rate >= row["minimumStructuralGoldPerHour"] and (maximum is None or rate <= maximum):
            return row
    raise ValueError(f"no candidate production band covers {rate}")


def weighted(values: dict[str, int], weights: dict[str, float]) -> float:
    return sum(values[key] * weight for key, weight in weights.items())


def build_results() -> dict:
    policy = json.loads(POLICY_PATH.read_text())
    reward_table = json.loads(REWARD_TABLE_PATH.read_text())
    restaurant = policy["phase16RestaurantPolicy"]
    rows = reward_table["rows"]
    cadence_per_hour = 3_600_000 / restaurant["operational"]["intervalMs"]
    profile_results = []
    for profile_id, levels, result_mix in PROFILES:
        rate = structural_rate(levels)
        row = band_for(rate, rows)
        band_id = row["id"]
        base = weighted(row["baseSaleGoldByCustomerId"], CUSTOMER_WEIGHTS)
        tip = weighted(row["tipGoldByMatch"], result_mix)
        active_hour = (base + tip) * cadence_per_hour
        optimal_single = max(
            row["baseSaleGoldByCustomerId"][customer]
            + row["tipGoldByMatch"]["matched"]
            for customer in CUSTOMER_WEIGHTS
        )
        profile_results.append({
            "profileId": profile_id,
            "buildingLevels": list(levels),
            "structuralGoldPerHour": rate,
            "capturedBandId": band_id,
            "assumedResultMix": result_mix,
            "weightedBaseGoldPerCustomer": round(base, 3),
            "weightedTipGoldPerCustomer": round(tip, 3),
            "recurringActiveGoldPerGenerationHour": round(active_hour, 3),
            "recurringActiveShareBasisPoints": round(active_hour * 10_000 / rate),
            "optimalSingleCustomerStructuralMinutes": round(optimal_single * 60 / rate, 3),
        })

    boundary_mix = {"basic": 0.05, "partial": 0.25, "matched": 0.70}
    boundary_checks = []
    for index, row in enumerate(rows[1:], start=1):
        previous = rows[index - 1]
        threshold = row["minimumStructuralGoldPerHour"]
        samples = []
        for position, rate in (("justBelow", threshold - 1), ("at", threshold), ("justAbove", threshold + 1)):
            selected = band_for(rate, rows)
            payout = weighted(selected["baseSaleGoldByCustomerId"], CUSTOMER_WEIGHTS) + weighted(selected["tipGoldByMatch"], boundary_mix)
            samples.append({
                "position": position,
                "structuralGoldPerHour": rate,
                "capturedBandId": selected["id"],
                "weightedGoldPerCustomer": round(payout, 3),
                "recurringActiveShareBasisPoints": round(payout * cadence_per_hour * 10_000 / rate),
            })
        previous_payout = weighted(previous["baseSaleGoldByCustomerId"], CUSTOMER_WEIGHTS) + weighted(previous["tipGoldByMatch"], boundary_mix)
        current_payout = weighted(row["baseSaleGoldByCustomerId"], CUSTOMER_WEIGHTS) + weighted(row["tipGoldByMatch"], boundary_mix)
        boundary_checks.append({
            "boundaryId": f"boundary.{previous['id']}.to.{row['id']}",
            "thresholdStructuralGoldPerHour": threshold,
            "weightedPayoutIncreaseBasisPoints": round((current_payout / previous_payout - 1) * 10_000),
            "samples": samples,
        })

    five_year_customers = round(cadence_per_hour * 24 * 365 * 5)
    maximum_one_time_claims = 16
    total_receipts = five_year_customers + maximum_one_time_claims
    recent_receipt_limit = 512
    fold_batch_size = 128
    fold_count = max(0, math.ceil((total_receipts - recent_receipt_limit) / fold_batch_size))
    folded_through = fold_count * fold_batch_size
    retained_recent = total_receipts - folded_through
    receipt_sample = {
        "receiptId": "receipt.facility.restaurant.87616",
        "claimId": "claim.facility.restaurant.87616",
        "definitionId": "opportunity.facility.restaurant.customer",
        "definitionVersion": 1,
        "policyId": restaurant["policyId"],
        "policyVersion": restaurant["version"],
        "claimedAt": 1735689600000,
        "rewards": [{"kind": "gold", "targetId": None, "amount": 1350000}],
    }
    recent_bytes = len(json.dumps([receipt_sample] * retained_recent, separators=(",", ":")).encode())
    archive_sample = {
        "archiveVersion": 1,
        "foldCount": fold_count,
        "foldedThroughOrdinal": folded_through,
        "receiptCount": folded_through,
        "rewardTotals": {"gold": 118368000000, "prosperity": 29, "gifts": 7, "relicStones": 60},
        "lastReceiptId": f"receipt.facility.restaurant.{folded_through}",
    }
    archive_bytes = len(json.dumps(archive_sample, separators=(",", ":")).encode())
    max_live_state_sample = {
        "bank": [{"id": f"opportunity.facility.restaurant.{ordinal}", "bandId": "restaurant.band.level-52", "version": 2} for ordinal in range(12)],
        "preparations": [{"stationId": "restaurant.station.hearth", "state": "ready"}, {"stationId": "restaurant.station.prep-table", "state": "ready"}],
        "stock": {"restaurant.recipe.hearth-stew": 6, "restaurant.recipe.garden-flatbread": 9, "restaurant.recipe.roadside-tea": 12},
        "localProgression": {"reputation": 262800, "recipeMastery": {"restaurant.recipe.hearth-stew": 87600}},
    }
    live_state_bytes = len(json.dumps(max_live_state_sample, separators=(",", ":")).encode())
    raw_estimate = recent_bytes + archive_bytes + live_state_bytes
    projected_bytes = math.ceil(raw_estimate * 1.25)
    budget_bytes = 1_048_576

    return {
        "simulationId": "phase-15-16-policy-candidate-simulation-v1",
        "sourcePolicyId": policy["contractId"],
        "deterministic": True,
        "assumptions": {
            "buildingBaseRates": list(BUILDING_BASE_RATES),
            "buildingLevelMultiplier": LEVEL_MULTIPLIER,
            "customerWeight": CUSTOMER_WEIGHTS,
            "generationPerHour": cadence_per_hour,
            "legacyAndNamedVisitorRewardsExcludedFromRecurringShare": True,
            "engagedPlayHasPreparedStockForEachGeneratedCustomer": True,
        },
        "profiles": profile_results,
        "boundaryChecks": boundary_checks,
        "boundarySummary": {
            "boundaryCount": len(boundary_checks),
            "sampleCount": len(boundary_checks) * 3,
            "maximumWeightedPayoutIncreaseBasisPoints": max(item["weightedPayoutIncreaseBasisPoints"] for item in boundary_checks),
            "minimumSampleActiveShareBasisPoints": min(sample["recurringActiveShareBasisPoints"] for item in boundary_checks for sample in item["samples"]),
            "maximumSampleActiveShareBasisPoints": max(sample["recurringActiveShareBasisPoints"] for item in boundary_checks for sample in item["samples"]),
        },
        "fiveYearHeadroom": {
            "continuousGenerationYears": 5,
            "maximumRecurringCustomerClaims": five_year_customers,
            "conservativeMaximumOneTimeClaims": maximum_one_time_claims,
            "totalClaimReceipts": total_receipts,
            "recentReceiptLimit": recent_receipt_limit,
            "foldBatchSize": fold_batch_size,
            "archiveFoldCount": fold_count,
            "foldedThroughOrdinal": folded_through,
            "retainedRecentReceipts": retained_recent,
            "estimatedRecentReceiptBytes": recent_bytes,
            "estimatedArchiveBytes": archive_bytes,
            "estimatedMaximumLiveFacilityStateBytes": live_state_bytes,
            "rawEstimateBytes": raw_estimate,
            "safetyFactorBasisPoints": 12500,
            "projectedIncrementalBytes": projected_bytes,
            "candidateIncrementalBudgetBytes": budget_bytes,
            "budgetUseBasisPoints": round(projected_bytes * 10_000 / budget_bytes),
            "javascriptSafeIntegerHeadroom": total_receipts < 9_007_199_254_740_991,
        },
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    rendered = json.dumps(build_results(), indent=2, sort_keys=True) + "\n"
    if args.check:
        if not RESULT_PATH.exists() or json.loads(RESULT_PATH.read_text()) != build_results():
            print("simulation-results.json is missing or stale")
            return 1
        print("simulation-results.json matches deterministic simulation")
        return 0
    print(rendered, end="")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
