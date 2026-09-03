#!/usr/bin/env python3
"""Fail closed when Phase 23 private Companion art leaks into tracked files."""

from __future__ import annotations

import argparse
import json
from pathlib import Path, PurePosixPath
import subprocess
import sys
from typing import Iterable


REPO_ROOT = Path(__file__).resolve().parents[1]
MANIFEST_PATH = REPO_ROOT / "design/phase-23/companion-assets.json"


def tracked_entries() -> list[tuple[str, str]]:
    object_format = subprocess.run(
        ["git", "rev-parse", "--show-object-format"],
        cwd=REPO_ROOT,
        check=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
    ).stdout.strip()
    if object_format != "sha1":
        raise ValueError(f"unsupported Git object format {object_format!r}; refusing public release")
    process = subprocess.run(
        ["git", "ls-files", "--stage", "-z"],
        cwd=REPO_ROOT,
        check=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
    )
    entries: list[tuple[str, str]] = []
    for item in process.stdout.split(b"\0"):
        if not item:
            continue
        metadata, path = item.split(b"\t", 1)
        _mode, object_id, _stage = metadata.decode("ascii").split()
        entries.append((path.decode("utf-8"), object_id))
    return entries


def is_private_runtime_path(path: str, runtime_root: str, roster_ids: set[str]) -> bool:
    normalized = PurePosixPath(path).as_posix().lstrip("./")
    root = runtime_root.strip("/")
    if normalized == root or normalized.startswith(f"{root}/"):
        return True
    parts = PurePosixPath(normalized).parts
    return len(parts) >= 2 and parts[-2] in roster_ids and parts[-1] in {"portrait.webp", "thumb.webp"}


def collect_forbidden_git_blobs(contract: dict) -> set[str]:
    inventory = REPO_ROOT / contract["privateGitBlobInventory"]
    forbidden: set[str] = set()
    for line_number, line in enumerate(inventory.read_text(encoding="utf-8").splitlines(), start=1):
        if not line.strip():
            continue
        digest, _relative = line.split(maxsplit=1)
        if len(digest) != 40 or any(character not in "0123456789abcdef" for character in digest):
            raise ValueError(f"malformed Git blob identity at {inventory}:{line_number}")
        forbidden.add(digest)
    if len(forbidden) != 60:
        raise ValueError(f"expected 60 private Git blob identities, found {len(forbidden)}")
    return forbidden


def policy_errors(contract: dict) -> list[str]:
    rights = contract.get("rights", {})
    runtime = contract.get("runtime", {})
    errors: list[str] = []
    required = {
        "distribution": "private-build-only",
        "publicReleaseAllowed": False,
        "rightsReviewStatus": "unresolved",
        "trackedPrivateBinariesAllowed": False,
    }
    for key, expected in required.items():
        if rights.get(key) != expected:
            errors.append(f"unsafe rights policy: {key} must be {expected!r}")
    if runtime.get("root") != "private-assets/companions":
        errors.append("private runtime root must remain private-assets/companions")
    if runtime.get("tracked") is not False:
        errors.append("private runtime assets must remain explicitly untracked")
    if runtime.get("composition") != "full-frame-no-crop":
        errors.append("private Companion portraits must remain full-frame and uncropped")
    companions = contract.get("companions", [])
    if len(companions) != 20:
        errors.append(f"expected 20 accepted Companions, found {len(companions)}")
    ids = [entry.get("id") for entry in companions]
    if len(set(ids)) != 20:
        errors.append("accepted Companion stable IDs must be unique")
    if len(ids) < 17 or ids[16] != "mabosstiff":
        errors.append("accepted stable ID mabosstiff is missing or misspelled")
    return errors


def scan(entries: Iterable[tuple[str, str]], contract: dict) -> list[str]:
    errors = policy_errors(contract)
    runtime_root = contract.get("runtime", {}).get("root", "")
    roster_ids = {entry.get("id") for entry in contract.get("companions", [])}
    forbidden_git_blobs = collect_forbidden_git_blobs(contract)
    for relative, object_id in entries:
        if is_private_runtime_path(relative, runtime_root, roster_ids):
            errors.append(f"tracked private runtime path: {relative}")
            continue
        if object_id in forbidden_git_blobs:
            errors.append(f"tracked private Companion binary by content hash: {relative}")
    return errors


def self_test(contract: dict) -> None:
    ids = {entry["id"] for entry in contract["companions"]}
    root = contract["runtime"]["root"]
    assert is_private_runtime_path("private-assets/companions/arcanine/portrait.webp", root, ids)
    assert is_private_runtime_path("elsewhere/arcanine/thumb.webp", root, ids)
    assert not is_private_runtime_path("assets/portraits/companions/atlas.webp", root, ids)
    unsafe = json.loads(json.dumps(contract))
    unsafe["rights"]["publicReleaseAllowed"] = True
    assert policy_errors(unsafe)
    forbidden_blob = next(iter(collect_forbidden_git_blobs(contract)))
    assert any("by content hash" in error for error in scan([("renamed.bin", forbidden_blob)], contract))


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--self-test", action="store_true", help="Run guard-policy unit checks before scanning Git")
    args = parser.parse_args()
    contract = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
    if args.self_test:
        self_test(contract)
    try:
        entries = tracked_entries()
        errors = scan(entries, contract)
    except (KeyError, OSError, subprocess.CalledProcessError, ValueError, json.JSONDecodeError) as exc:
        print(f"FAIL CLOSED: {exc}", file=sys.stderr)
        return 1
    if errors:
        for error in errors:
            print(f"FAIL: {error}", file=sys.stderr)
        print(f"FAIL CLOSED: {len(errors)} Phase 23 public-release guard violation(s)", file=sys.stderr)
        return 1
    print(f"PASS: {len(entries)} tracked files contain no Phase 23 private Companion art")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
