#!/usr/bin/env python3
"""Deterministic package-only validation for the Player Wayfarer/UI design."""

from __future__ import annotations

import hashlib
import json
import struct
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
PKG = ROOT / "design" / "player-wayfarer-ui-polish"
ASSET = ROOT / "assets" / "player" / "wayfarer-profile-full.png"
EXPECTED_ASSET_SHA = "a34c2d3a858f46be58450048b77c53965d4644690c2eb9a9c7649bd1b5139aaf"
REFERENCE_SHAS = {
    "02562b8f87634c95d2ab7afddef58c8606425df3e38442afda60d66f8c5d2038",
    "3881cd93395e759b19ee1ac341c2c7ccf4b362c4209f6f07d586f94adc5b5ce5",
    "0fa16b60cd94b6199e85fe2d77ce44681b364dfbb228eeffd839d460244a31e1",
    "03d687d015ecb3321e430771a9c0a86cbe12b6b02e4224591073f0c52d4bc40b",
    "0babbea0eb556cfa6f604868cdb15855c2b01a0c431019c37069649dc7438352",
    "658232bcc646101b1eb71419826bd9f9ef4ce876e127966d33d15eb2d4b743a2",
    "1ba9e49acafaf5b85627c8dda0f6fbb3c84c87ab0ca303864dedabe72b3817e6",
}

passed = 0
failed = 0


def check(condition: bool, label: str) -> None:
    global passed, failed
    if condition:
        passed += 1
        print(f"PASS {label}")
    else:
        failed += 1
        print(f"FAIL {label}")


def load_json(name: str):
    path = PKG / name
    check(path.is_file(), f"file exists: {name}")
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except Exception as exc:
        print(f"FAIL JSON parses: {name}: {exc}")
        global failed
        failed += 1
        return {}
    check(True, f"JSON parses: {name}")
    return value


def text(name: str) -> str:
    path = PKG / name
    check(path.is_file(), f"file exists: {name}")
    return path.read_text(encoding="utf-8") if path.is_file() else ""


def sha256(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def png_ihdr(path: Path):
    with path.open("rb") as handle:
        signature = handle.read(8)
        length = struct.unpack(">I", handle.read(4))[0]
        kind = handle.read(4)
        payload = handle.read(length)
    if signature != b"\x89PNG\r\n\x1a\n" or kind != b"IHDR" or length != 13:
        return None
    width, height, depth, color_type, compression, filtering, interlace = struct.unpack(">IIBBBBB", payload)
    return width, height, depth, color_type, compression, filtering, interlace


def main() -> int:
    required_docs = [
        "README.md",
        "REFERENCE_ANALYSIS.md",
        "PLAYER_WAYFARER_CONTRACT.md",
        "UI_VISUAL_SYSTEM.md",
        "ROLLOUT_PLAN.md",
        "INDEPENDENT_QA_CONTRACT.md",
    ]
    docs = {name: text(name) for name in required_docs}
    provenance = load_json("asset-provenance.json")
    screens = load_json("screen-contracts.json")
    fixtures = load_json("qa-fixtures.json")

    check(ASSET.is_file(), "canonical project asset exists")
    if ASSET.is_file():
        check(sha256(ASSET) == EXPECTED_ASSET_SHA, "canonical asset SHA-256")
        ihdr = png_ihdr(ASSET)
        check(ihdr is not None, "canonical asset has valid PNG IHDR")
        if ihdr:
            check(ihdr[0:2] == (1024, 1536), "canonical asset dimensions are 1024x1536")
            check(ihdr[2] == 8, "canonical asset is 8-bit")
            check(ihdr[3] == 2, "canonical asset is RGB without alpha")

    canonical = provenance.get("canonicalAsset", {})
    check(provenance.get("schemaVersion") == 1, "provenance schema version")
    check(provenance.get("baseCommit") == "70201ab52e6e3510747bee1a977794a8c900bdd1", "exact integration base recorded")
    check(canonical.get("characterId") == "player.wayfarer", "canonical character identity")
    check(canonical.get("assetId") == "asset.player.wayfarer.profile-full.v1", "canonical asset identity")
    check(canonical.get("projectPath") == "assets/player/wayfarer-profile-full.png", "canonical project path")
    check(canonical.get("sha256") == EXPECTED_ASSET_SHA, "provenance hash matches asset contract")
    check(canonical.get("width") == 1024 and canonical.get("height") == 1536, "provenance dimensions")
    check(canonical.get("alpha") is False and canonical.get("colorSpace") == "RGB", "provenance RGB no-alpha declaration")

    variants = {row.get("variantId"): row for row in provenance.get("variants", [])}
    check(len(variants) == 4, "exact asset variant registry")
    check(variants.get("player.wayfarer.profile-full", {}).get("status") == "approved", "full-background variant approved")
    check(variants.get("player.wayfarer.card-crop", {}).get("rendering") == "css-object-position-only", "card crop is non-destructive CSS")
    check(variants.get("player.wayfarer.dialogue-cutout", {}).get("status") == "unresolved-required", "dialogue cutout fails closed")
    check(variants.get("player.wayfarer.campaign-walk", {}).get("status") == "unresolved-required", "Campaign walking asset fails closed")
    check("no baked checkerboard" in variants.get("player.wayfarer.dialogue-cutout", {}).get("requirements", []), "checkerboard derivative explicitly rejected")
    check(provenance.get("forbiddenReferenceIngestion", {}).get("failedTransparentDerivatives") is True, "failed derivatives forbidden")

    refs = provenance.get("references", [])
    check(len(refs) == 7, "seven screenshots remain analysis-only references")
    check(all(row.get("use") == "analysis-only" for row in refs), "all screenshot references are analysis-only")
    check({row.get("sha256") for row in refs} == REFERENCE_SHAS, "reference hash set exact")
    check(all((row.get("width"), row.get("height")) == (1179, 2556) for row in refs), "reference dimensions exact")

    shipped_image_hashes = set()
    for path in (ROOT / "assets").rglob("*"):
        if path.is_file() and path.suffix.lower() in {".png", ".jpg", ".jpeg", ".webp"}:
            shipped_image_hashes.add(sha256(path))
    check(not (shipped_image_hashes & REFERENCE_SHAS), "no analysis screenshot is shipped as an asset")
    screenshot_names = {row.get("file") for row in refs}
    asset_names = {path.name for path in (ROOT / "assets").rglob("*") if path.is_file()}
    check(not (screenshot_names & asset_names), "no analysis screenshot filename is shipped")

    navigation = screens.get("navigation", {})
    check(navigation.get("requiredTabCount") == 5, "five-tab navigation required")
    check(navigation.get("requiredTabs") == ["village", "roster", "adventure", "oaths", "more"], "five tab identities exact")
    check(navigation.get("sixthTabForbidden") is True, "sixth tab forbidden")
    expected_screen_ids = {
        "global.top-resource-bar",
        "player.wayfarer-profile",
        "roster.fellow-sheet",
        "roster.family-sheet",
        "progress.achievements-legacy",
        "adventure.campaign",
        "village.facility-sheet",
        "inventory.rewards",
        "system.tabs-buttons-panels",
    }
    screen_rows = screens.get("screens", [])
    check({row.get("id") for row in screen_rows} == expected_screen_ids, "all nine screen contracts exact")
    check(all(row.get("required") and row.get("forbidden") for row in screen_rows), "every screen has required and forbidden rules")
    by_id = {row.get("id"): row for row in screen_rows}
    player_forbidden = set(by_id.get("player.wayfarer-profile", {}).get("forbidden", []))
    check({"roster membership", "shards", "rarity", "building assignment", "companion assignment", "recruitment"} <= player_forbidden, "Wayfarer collectible mechanics forbidden")
    family_forbidden = set(by_id.get("roster.family-sheet", {}).get("forbidden", []))
    check({"Blessing", "employee-count economy", "Fellow staffing"} <= family_forbidden, "conflicting Family mechanics forbidden")
    achievement_forbidden = set(by_id.get("progress.achievements-legacy", {}).get("forbidden", []))
    check("daily checklist" in achievement_forbidden and "sixth navigation tab" in achievement_forbidden, "daily and sixth-tab patterns forbidden")

    viewports = screens.get("viewports", [])
    check([(v.get("width"), v.get("height")) for v in viewports] == [(320, 568), (390, 844), (1024, 768)], "viewport matrix exact")
    check(all(v.get("required") is True for v in viewports), "every viewport required")
    check(screens.get("copyScalePercent") == 175, "175 percent copy gate")
    check(screens.get("reducedMotionRequired") is True, "reduced motion required")

    fixture_rows = fixtures.get("fixtures", [])
    fixture_ids = {row.get("id") for row in fixture_rows}
    required_fixture_ids = {
        "fresh-rank-1-wayfarer",
        "migrated-rank-5-wayfarer",
        "wayfarer-dialogue-fallback",
        "campaign-walk-fallback",
        "family-building-assignment-preserved",
        "fellow-sheet-locked-and-joined",
        "manual-claim-achievement",
        "facility-ready-village",
        "inventory-large-counts",
        "copy-175-small-mobile",
        "keyboard-dialog-sheet",
        "save-byte-neutral-visual-pass",
    }
    check(fixture_ids == required_fixture_ids, "deterministic fixture registry exact")
    check(all(row.get("state") and len(row.get("assert", [])) >= 4 for row in fixture_rows), "every fixture has state and assertions")
    check(len(fixtures.get("adversarial", [])) == 6, "six adversarial scenarios")

    all_docs = "\n".join(docs.values())
    required_phrases = [
        "Family remains the Building assignment roster",
        "no Blessing track",
        "no employee-count economy",
        "no sixth navigation tab",
        "no daily checklist",
        "all 38 existing",
        "locked Fellows",
        "replay",
        "reduced motion",
        "175%",
        "actual rendered DOM",
        "monkey-patching JavaScript alone is not evidence",
        "save-neutral",
        "manual exact-once",
        "physical Village",
    ]
    for phrase in required_phrases:
        check(phrase.lower() in all_docs.lower(), f"documentation covers: {phrase}")

    reference_analysis = docs["REFERENCE_ANALYSIS.md"]
    for filename in ["IMG_7094.png", "IMG_7099.png", "IMG_7096.png", "IMG_7095.png", "IMG_7098.png", "IMG_7097.png", "IMG_7100.png"]:
        check(filename in reference_analysis, f"reference analysis covers {filename}")

    wayfarer = docs["PLAYER_WAYFARER_CONTRACT.md"]
    for forbidden in ["no:", "roster entry", "rarity", "shards", "Building or Fellow assignment", "recruitment", "combat contribution"]:
        check(forbidden.lower() in wayfarer.lower(), f"Wayfarer separation covers {forbidden}")

    qa = docs["INDEPENDENT_QA_CONTRACT.md"]
    check("Actual-DOM inspection blind spot" in qa, "actual-DOM blind spot explicit")
    check("Human review remains `PENDING`" in qa, "human review cannot be auto-passed")
    check("two clients" in qa.lower(), "two-client regression covered")
    check("future/corrupt save" in qa.lower(), "future/corrupt save covered")
    check("24-hour offline" in qa.lower(), "offline boundary covered")

    total = passed + failed
    print(f"RESULT total={total} passed={passed} failed={failed}")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
