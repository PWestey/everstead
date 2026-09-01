#!/usr/bin/env python3
"""Build-time-only generator for reviewable fixed Restaurant reward rows."""

from __future__ import annotations

import json


FRESH_STRUCTURAL_RATE = 25_400
LEVEL_MULTIPLIER = 1.15
LEVEL_COUNT = 52


def build_table() -> dict:
    calibrations = [round(FRESH_STRUCTURAL_RATE * LEVEL_MULTIPLIER ** level) for level in range(LEVEL_COUNT)]
    rows = []
    for index, calibration in enumerate(calibrations):
        minimum = 0 if index == 0 else calibration
        maximum = calibrations[index + 1] - 1 if index + 1 < len(calibrations) else None
        rows.append({
            "id": f"restaurant.band.level-{index + 1:02d}",
            "minimumStructuralGoldPerHour": minimum,
            "maximumStructuralGoldPerHour": maximum,
            "calibrationStructuralGoldPerHour": calibration,
            "baseSaleGoldByCustomerId": {
                "restaurant.customer.road-worker": round(calibration * 0.035),
                "restaurant.customer.archive-courier": round(calibration * 0.041),
                "restaurant.customer.route-envoy": round(calibration * 0.050),
            },
            "tipGoldByMatch": {
                "basic": 0,
                "partial": round(calibration * 0.005),
                "matched": round(calibration * 0.010),
            },
        })
    return {
        "tableId": "reward-table.restaurant.structural-rate.candidate-v2",
        "version": 2,
        "status": "candidate-root-review-required",
        "productionEnabled": False,
        "runtimeFormulaAllowed": False,
        "runtimeContract": "Load the captured row and exact fixed integers. Never recalculate from provenance ratios.",
        "buildTimeProvenanceOnly": {
            "releasedFreshStructuralGoldPerHour": FRESH_STRUCTURAL_RATE,
            "releasedBuildingLevelMultiplier": LEVEL_MULTIPLIER,
            "levelCount": LEVEL_COUNT,
            "roadWorkerBaseRatio": 0.035,
            "archiveCourierBaseRatio": 0.041,
            "routeEnvoyBaseRatio": 0.050,
            "partialTipRatio": 0.005,
            "matchedTipRatio": 0.010,
            "rounding": "nearest-integer-python-round",
        },
        "rows": rows,
    }


if __name__ == "__main__":
    print(json.dumps(build_table(), indent=2, sort_keys=True))
