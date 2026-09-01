#!/usr/bin/env python3
"""Generate/check the immutable candidate reward table for Phases 18–19."""

from __future__ import annotations

import argparse
import json
from pathlib import Path

HERE = Path(__file__).resolve().parent
OUTPUT = HERE / "fixed-reward-table.json"
BASE_RATES = (7200, 6500, 5600, 6100)
LEVEL_GROWTH = 1.15
MAX_LEVEL = 52
CALIBRATION_FLOOR = sum(BASE_RATES)


def structural_rate(level: int) -> int:
    return sum(round(rate * (LEVEL_GROWTH ** (level - 1))) for rate in BASE_RATES)


def reward(value: float) -> int:
    return max(1, int(value + 0.5))


def build() -> dict:
    rates = [structural_rate(level) for level in range(1, MAX_LEVEL + 1)]
    bands = []
    for index, rate in enumerate(rates):
        minimum = 0 if index == 0 else rate
        maximum = rates[index + 1] - 1 if index + 1 < len(rates) else None
        calibration = max(CALIBRATION_FLOOR, minimum)
        bands.append(
            {
                "id": f"structural-band.phase-18-19.{index + 1:02d}",
                "minimumGoldPerHourInclusive": minimum,
                "maximumGoldPerHourInclusive": maximum,
                "calibrationGoldPerHour": calibration,
                "apothecaryGoldByOutcomeBandId": {
                    "apothecary.outcome.supportive": reward(calibration * 0.03),
                    "apothecary.outcome.precise": reward(calibration * 0.05),
                },
                "schoolhouseGoldByOutcomeBandId": {
                    "schoolhouse.outcome.guided": reward(calibration * 0.0375),
                    "schoolhouse.outcome.resonant": reward(calibration * 0.06),
                },
                "schoolhouseGraduationGold": reward(calibration * 0.25),
            }
        )
    return {
        "tableId": "reward-table.phase-18-19.structural-rate.candidate-v1",
        "version": 1,
        "status": "candidate-root-review-required",
        "productionEnabled": False,
        "runtimeFormulaAllowed": False,
        "generationAuthority": {
            "buildingBaseRates": list(BASE_RATES),
            "releasedLevelGrowth": LEVEL_GROWTH,
            "releasedLevelRange": [1, MAX_LEVEL],
            "calibrationFloorGoldPerHour": CALIBRATION_FLOOR,
            "rounding": "nearest-integer-half-up-positive-values",
            "generatorPath": "design/phase-18-19-policy-candidate/generate_reward_table.py",
        },
        "bands": bands,
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
            print("FAIL fixed-reward-table.json is stale")
            return 1
        print("PASS fixed-reward-table.json is deterministic (52 bands)")
        return 0
    OUTPUT.write_text(expected)
    print(f"WROTE {OUTPUT} (52 bands)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
