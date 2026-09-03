#!/usr/bin/env python3
"""Build and verify private-only Phase 23 Companion WebP assets."""

from __future__ import annotations

import argparse
import hashlib
import io
import json
import os
from pathlib import Path
import sys
import tempfile
from typing import Any

try:
    from PIL import Image, ImageOps, features
except ImportError as exc:  # pragma: no cover - environment-dependent guard
    raise SystemExit(
        "Pillow is required. Run this with a Python environment that includes Pillow."
    ) from exc


REPO_ROOT = Path(__file__).resolve().parents[1]
MANIFEST_PATH = REPO_ROOT / "design/phase-23/companion-assets.json"


def sha256_bytes(payload: bytes) -> str:
    return hashlib.sha256(payload).hexdigest()


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def git_blob_sha1_file(path: Path) -> str:
    digest = hashlib.sha1(usedforsecurity=False)
    digest.update(f"blob {path.stat().st_size}\0".encode("ascii"))
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def read_hash_inventory(path: Path, digest_length: int) -> list[tuple[str, str]]:
    inventory: list[tuple[str, str]] = []
    for line_number, line in enumerate(path.read_text(encoding="utf-8").splitlines(), start=1):
        if not line.strip():
            continue
        digest, filename = line.split(maxsplit=1)
        if len(digest) != digest_length or any(character not in "0123456789abcdef" for character in digest):
            raise ValueError(f"Malformed digest at {path}:{line_number}")
        inventory.append((digest, filename.strip()))
    return inventory


def load_contract() -> dict[str, Any]:
    contract = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
    rights = contract.get("rights", {})
    runtime = contract.get("runtime", {})
    companions = contract.get("companions", [])

    if contract.get("schemaVersion") != 1:
        raise ValueError("Unsupported Companion asset contract schema")
    if rights.get("distribution") != "private-build-only":
        raise ValueError("Companion distribution policy must remain private-build-only")
    if rights.get("publicReleaseAllowed") is not False:
        raise ValueError("Public release must remain explicitly disallowed")
    if rights.get("trackedPrivateBinariesAllowed") is not False:
        raise ValueError("Tracked private binaries must remain explicitly disallowed")
    if runtime.get("root") != "private-assets/companions":
        raise ValueError("Private runtime root changed unexpectedly")
    if runtime.get("tracked") is not False:
        raise ValueError("Private runtime assets must remain untracked")
    if runtime.get("composition") != "full-frame-no-crop":
        raise ValueError("Companion portraits must remain full-frame and uncropped")
    if len(companions) != 20:
        raise ValueError(f"Expected 20 Companions, found {len(companions)}")

    ids = [entry.get("id") for entry in companions]
    filenames = [entry.get("masterFilename") for entry in companions]
    orders = [entry.get("order") for entry in companions]
    if len(set(ids)) != 20 or not all(isinstance(value, str) and value for value in ids):
        raise ValueError("Companion IDs must be 20 unique non-empty strings")
    if len(set(filenames)) != 20:
        raise ValueError("Companion master filenames must be unique")
    if orders != list(range(1, 21)):
        raise ValueError("Companion order must be the exact sequence 1 through 20")
    if ids[16] != "mabosstiff":
        raise ValueError("The accepted ID spelling is mabosstiff")
    zacian = companions[17]
    if zacian.get("id") != "zacian" or zacian.get("form") != "Hero of Many Battles":
        raise ValueError("Zacian must use the accepted Hero of Many Battles form")

    inventory_path = REPO_ROOT / contract["source"]["hashInventory"]
    inventory = read_hash_inventory(inventory_path, 64)
    expected = [(entry["sourceSha256"], entry["masterFilename"]) for entry in companions]
    if inventory != expected:
        raise ValueError("Source hash inventory does not exactly match the roster contract")
    return contract


def encode_webp(image: Image.Image, *, width: int, height: int, quality: int, method: int) -> bytes:
    if image.size == (width, height):
        output = image.copy()
    else:
        output = image.resize((width, height), Image.Resampling.LANCZOS)
    buffer = io.BytesIO()
    output.save(
        buffer,
        format="WEBP",
        quality=quality,
        method=method,
        exact=True,
        exif=b"",
        xmp=b"",
    )
    payload = buffer.getvalue()
    with Image.open(io.BytesIO(payload)) as check:
        if check.format != "WEBP" or check.size != (width, height):
            raise ValueError(f"Encoded WebP failed dimension check: {check.format} {check.size}")
    return payload


def atomic_write(path: Path, payload: bytes) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.NamedTemporaryFile(dir=path.parent, prefix=f".{path.name}.", delete=False) as handle:
        handle.write(payload)
        temporary_path = Path(handle.name)
    os.replace(temporary_path, path)


def build_entry(
    entry: dict[str, Any],
    source_dir: Path,
    output_dir: Path,
    source_contract: dict[str, Any],
    runtime_contract: dict[str, Any],
    verify_only: bool,
) -> dict[str, Any]:
    source_path = source_dir / entry["masterFilename"]
    if not source_path.is_file():
        raise FileNotFoundError(f"Missing accepted master: {source_path}")
    source_digest = sha256_file(source_path)
    if source_digest != entry["sourceSha256"]:
        raise ValueError(
            f"Source hash mismatch for {entry['id']}: {source_digest} != {entry['sourceSha256']}"
        )

    with Image.open(source_path) as opened:
        if opened.format != "PNG":
            raise ValueError(f"{entry['id']} master is not PNG")
        image = ImageOps.exif_transpose(opened).convert("RGB")
    expected_source_size = (source_contract["expectedWidth"], source_contract["expectedHeight"])
    if image.size != expected_source_size:
        raise ValueError(f"{entry['id']} master is {image.size}, expected {expected_source_size}")

    outputs: dict[str, dict[str, Any]] = {}
    variants = (("portrait", runtime_contract["portrait"]), ("thumbnail", runtime_contract["thumbnail"]))
    for key, variant in variants:
        payload = encode_webp(
            image,
            width=variant["width"],
            height=variant["height"],
            quality=variant["quality"],
            method=variant["method"],
        )
        relative_path = Path(entry["id"]) / variant["filename"]
        destination = output_dir / relative_path
        if verify_only:
            if not destination.is_file():
                raise FileNotFoundError(f"Missing generated runtime asset: {destination}")
            existing = destination.read_bytes()
            if existing != payload:
                raise ValueError(f"Generated runtime asset is stale or non-deterministic: {destination}")
        else:
            if not destination.is_file() or destination.read_bytes() != payload:
                atomic_write(destination, payload)
        outputs[key] = {
            "path": relative_path.as_posix(),
            "sha256": sha256_bytes(payload),
            "bytes": len(payload),
            "width": variant["width"],
            "height": variant["height"],
        }

    if sha256_file(source_path) != source_digest:
        raise ValueError(f"Source master changed while processing: {source_path}")
    return {
        "id": entry["id"],
        "order": entry["order"],
        "source": {
            "filename": entry["masterFilename"],
            "sha256": source_digest,
            "bytes": source_path.stat().st_size,
            "width": expected_source_size[0],
            "height": expected_source_size[1],
        },
        **outputs,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source-dir", required=True, type=Path, help="Accepted 20-PNG master directory")
    parser.add_argument(
        "--output-dir",
        type=Path,
        default=REPO_ROOT / "private-assets/companions",
        help="Ignored local runtime output root",
    )
    parser.add_argument("--verify-only", action="store_true", help="Verify exact deterministic outputs without writing")
    args = parser.parse_args()

    if not features.check("webp"):
        raise SystemExit("Pillow was built without WebP support")
    contract = load_contract()
    source_dir = args.source_dir.resolve()
    output_dir = args.output_dir.resolve()
    expected_source_names = {entry["masterFilename"] for entry in contract["companions"]}
    actual_source_names = {path.name for path in source_dir.glob("*.png") if path.is_file()}
    if actual_source_names != expected_source_names:
        missing = sorted(expected_source_names - actual_source_names)
        unexpected = sorted(actual_source_names - expected_source_names)
        raise SystemExit(f"Master set mismatch; missing={missing}, unexpected={unexpected}")

    results = [
        build_entry(
            entry,
            source_dir,
            output_dir,
            contract["source"],
            contract["runtime"],
            args.verify_only,
        )
        for entry in contract["companions"]
    ]
    runtime_inventory_path = REPO_ROOT / contract["runtime"]["hashInventory"]
    runtime_inventory = read_hash_inventory(runtime_inventory_path, 64)
    expected_runtime_inventory: list[tuple[str, str]] = []
    for item in results:
        expected_runtime_inventory.append((item["portrait"]["sha256"], item["portrait"]["path"]))
        expected_runtime_inventory.append((item["thumbnail"]["sha256"], item["thumbnail"]["path"]))
    if runtime_inventory != expected_runtime_inventory:
        raise ValueError("Generated runtime hashes do not exactly match the tracked inventory")
    git_blob_inventory = read_hash_inventory(REPO_ROOT / contract["privateGitBlobInventory"], 40)
    expected_git_blob_inventory: list[tuple[str, str]] = []
    for source_path in sorted(source_dir.glob("*.png")):
        expected_git_blob_inventory.append((git_blob_sha1_file(source_path), f"source/{source_path.name}"))
    for item in sorted(results, key=lambda value: value["id"]):
        for key in ("portrait", "thumbnail"):
            relative = item[key]["path"]
            expected_git_blob_inventory.append(
                (git_blob_sha1_file(output_dir / relative), relative)
                if (output_dir / relative).is_file()
                else ("", relative)
            )
    if git_blob_inventory != expected_git_blob_inventory:
        raise ValueError("Private Git blob identities do not exactly match accepted sources and runtime outputs")
    runtime_manifest = {
        "schemaVersion": 1,
        "policyId": contract["policyId"],
        "rosterVersion": contract["rosterVersion"],
        "privateBuildOnly": True,
        "publicReleaseAllowed": False,
        "composition": "full-frame-no-crop",
        "encoding": {
            "format": "webp",
            "portrait": contract["runtime"]["portrait"],
            "thumbnail": contract["runtime"]["thumbnail"],
        },
        "companions": results,
    }
    manifest_payload = (json.dumps(runtime_manifest, indent=2, ensure_ascii=False) + "\n").encode("utf-8")
    runtime_manifest_path = output_dir / "runtime-manifest.json"
    if args.verify_only:
        if not runtime_manifest_path.is_file():
            raise SystemExit(f"Missing generated runtime manifest: {runtime_manifest_path}")
        if runtime_manifest_path.read_bytes() != manifest_payload:
            raise SystemExit("Generated runtime manifest is stale")
    else:
        if not runtime_manifest_path.is_file() or runtime_manifest_path.read_bytes() != manifest_payload:
            atomic_write(runtime_manifest_path, manifest_payload)

    source_bytes = sum(item["source"]["bytes"] for item in results)
    portrait_bytes = sum(item["portrait"]["bytes"] for item in results)
    thumbnail_bytes = sum(item["thumbnail"]["bytes"] for item in results)
    action = "verified" if args.verify_only else "built"
    print(
        f"PASS: {action} {len(results)} Companion masters, {len(results)} portraits, "
        f"and {len(results)} thumbnails"
    )
    print(f"Source bytes: {source_bytes}")
    print(f"Portrait bytes: {portrait_bytes}")
    print(f"Thumbnail bytes: {thumbnail_bytes}")
    print(f"Runtime manifest SHA-256: {sha256_bytes(manifest_payload)}")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except (FileNotFoundError, ValueError, json.JSONDecodeError) as exc:
        print(f"FAIL: {exc}", file=sys.stderr)
        raise SystemExit(1) from exc
