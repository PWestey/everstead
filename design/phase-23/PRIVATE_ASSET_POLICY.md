# Phase 23A — Private Companion Asset Policy

## Status

The accepted 20-Companion portrait set is approved for local/private Everstead builds only. Public distribution rights remain unresolved. No source master or derived Companion portrait may be added to Git, GitHub Pages, or another public release artifact until the rights decision changes explicitly.

`companion-assets.json` is the tracked roster and runtime contract. `companion-source-hashes.sha256` freezes the accepted 1024×1536 PNG masters without copying those masters into the repository. `companion-runtime-hashes.sha256` freezes the deterministic private WebP derivatives. `companion-private-git-blobs.sha1` records the corresponding Git blob identities so the public-release guard can catch renamed copies without reading or publishing the private files.

## Runtime layout

The deterministic generator writes ignored local files only:

```text
private-assets/companions/
  runtime-manifest.json
  <companion-id>/
    portrait.webp  # 1024×1536, full-frame
    thumb.webp     # 320×480, full-frame
```

Both variants retain the complete 2:3 portrait. They must not be cropped into false transparent dialogue or Campaign cutouts. The source PNG masters remain outside this repository and are never modified.

## Build commands

The generator requires Python with Pillow and WebP support:

```bash
python3 scripts/build-phase23-private-assets.py \
  --source-dir /path/to/accepted/companion-portraits/final

python3 scripts/build-phase23-private-assets.py \
  --source-dir /path/to/accepted/companion-portraits/final \
  --verify-only
```

The public-release guard must pass before a public build or deployment:

```bash
python3 scripts/check-phase23-public-release.py
```

It fails closed if the policy is weakened, a private runtime path is tracked, or any tracked file has the content hash of an accepted private source or generated runtime portrait.

## Do not break

- Keep all 20 stable IDs and their order unchanged without an explicit save/content migration.
- Preserve `mabosstiff` exactly.
- Keep Zacian’s selected form as **Hero of Many Battles**; **Crowned Sword** remains a retained alternative.
- Preserve 1024×1536 full-frame presentation for character sheets.
- Never add private portrait binaries to the public repository or Pages payload.
