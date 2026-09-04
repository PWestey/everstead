# Phase 24I · compact Village panels

Phase 24I replaces the always-open Waystone objective and Village production overlays with two compact, collapsed-by-default disclosures. Waystone opens from the upper-right and Production opens from the lower-right. Tapping the same control again collapses it; opening one closes the other.

The change is presentation-only. It does not alter schema 14, the storage namespace, production values, claims, progression, story content, or existing action selectors.

## Acceptance gate

- Both panel controls are visible, collapsed, and at least 44px high on 320×568 and 390×844 phones.
- Neither collapsed control overlaps fixed top or bottom navigation.
- Open bodies remain at most 35% of viewport height and no wider than 272px (252px on the smallest phone).
- Repeated taps close a panel, and opening one closes the other.
- Disclosure changes are byte- and write-neutral.
- Building sheets, the featured Fellow profile, Village collection control, and Waystone objective action remain reachable.
- No horizontal overflow or warning/error console output occurs.

Run:

```sh
node qa/phase-24i-village-panels/verify.mjs
npm run qa:phase24i-village-panels
shasum -a 256 -c qa/phase-24i-village-panels/checksums.sha256
```
