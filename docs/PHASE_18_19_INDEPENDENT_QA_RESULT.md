# Everstead Phases 18–19 — Independent QA Result

## Verdict

**PREIMPLEMENTATION GATE READY.** The independent package is valid and deliberately rejects the exact integration baseline because Apothecary and Schoolhouse production runtime do not yet exist. This is a truthful red gate, not a simulated implementation.

The gate is based on exact integration commit `70201ab52e6e3510747bee1a977794a8c900bdd1`. It modifies only `qa/phase-18-19-independent/*` and the two independent QA documents. Production, accepted design, art, CSS, deployment, and remotes are unchanged.

## Repeated static evidence

From the committed package tip:

- package-only verifier: `56/56` twice;
- accepted Phase 18–19 design validator: `40/40` within every verifier run and twice directly;
- inherited checksum fixture: 45 accepted Phase 13–19, predecessor QA, runtime, and artifact files byte-frozen to the exact base;
- package checksums: all 10 owned files pass twice;
- JavaScript syntax: verifier, coordinator, and isolated realm all pass;
- exact baseline artifact: SHA-256 `199826ea2d07612e4f76fb6ef103d6bbe82d8bc429e103559c45d125445efdbc`, 1,126,624 bytes.

Default candidate verification reports `55/68` with exactly these 13 expected preimplementation failures, twice:

1. `candidate-phase18-19-bridge-contract`;
2. `candidate-predecessor-v2-runtime-seams`;
3. `candidate-apothecary-config-runtime`;
4. `candidate-apothecary-distinct-lifecycle`;
5. `candidate-schoolhouse-config-runtime`;
6. `candidate-schoolhouse-persistent-lifecycle`;
7. `candidate-graduation-v2-one-shot-runtime`;
8. `candidate-family-mentor-positive-only-runtime`;
9. `candidate-null-policy-fail-closed-runtime`;
10. `candidate-successor-migration-validation-runtime`;
11. `candidate-finalizer-archive-runtime`;
12. `candidate-cast-tutorial-runtime`;
13. `candidate-phase18-19-dom-contract`.

`candidate-failure-boundaries-exact` passes, proving that there are no unexplained static failures outside those declared implementation boundaries.

## What the gate proves before implementation

The package freezes and cross-checks the accepted contracts for:

- distinct Apothecary clue → diagnosis → remedy → forgiving Recheck/Supportive/Precise flow;
- distinct Schoolhouse seating → banked lesson → persistent multi-lesson pupil development → graduation flow;
- non-expiring opportunity banks, manual claims, and no automatic offline choices or credit;
- a separate graduation V2 one-shot offer identity and immutable finalizer;
- a positive-only, one-mentor Family relationship modifier that cannot mutate Family state;
- null production policy remaining disabled with no QA or Restaurant-value fallback;
- ordered migrations, V2 archive folding, import, recovery, malformed-state refusal, and eight two-client race classes;
- exact nine tutorial IDs with contextual First Lesson segmentation;
- exact ten-actor Phase 18–19 subset, locked-Fellow exclusion, and approved dialogue presentation fallbacks;
- `player.wayfarer` preserved as a separate Player Character outside Fellow, Family, Companion, assignment, shard, and facility-speaker systems;
- semantic facility-sheet compatibility for forthcoming original Everstead visual polish without importing reference assets, copying trade dress, or moving full-background profile art into Village dialogue;
- original four Building passive Gold and Family assignment preservation;
- same-captured-time passive semantics with volatile Gold/timestamp/day/`boostDay` fields excluded;
- non-tautological reduced-motion coverage through a production root marker plus a real static CSS media-rule contract, never the injected `matchMedia` value alone;
- actual-node browser assertions for mobile, desktop, 130-percent copy, reduced motion, keyboard, focus, Escape, target size, containment, and overflow.

The browser realm loads the real candidate `index.html`, injects only isolated adapters before production scripts, and calls only `window.__EVERSTEAD_PHASE_18_19_QA__`. It does not install a fake facility engine.

## Live five-realm status

The local live runner is ready at `qa/phase-18-19-independent/index.html`. At the exact baseline it is expected to render 20 rows: 10 package rows pass, while each of five realms reports exactly two failures—`bridge-present` and `phase18-19-contract-unavailable`—for an expected `10 passed, 10 failed` result.

No browser was connected to this independent worker when the gate was produced, so that live result is **not claimed as observed here**. Root integration review must run the page in the connected in-app browser and record the five rendered realm pairs. Once production exists, each realm continues into actual-DOM and behavior checks instead of stopping at the absent bridge.

## Implementation release conditions

Phases 18–19 cannot pass until a candidate supplies the trusted bridge and real runtime under complete separately approved policies. A passing release requires:

- `68/68` static candidate checks;
- all five live realms complete without failed rows, native-storage access, warning/error console output, timeout, or normalized-only DOM substitution;
- predecessor gates remain green;
- root diff review confirms no production value came from this QA fixture and no Restaurant domain model was reused;
- manual visual review at both mobile widths, desktop, expanded copy, and reduced motion;
- real-device/Safari follow-up for composition and storage behavior.

## Residual risks

Web Storage has no atomic compare-and-swap, so the narrow final reread-to-write race remains detectable and reducible rather than eliminable. This package cannot approve null cadence, capacity, rewards, progress curves, mastery, Education, mentor caps, graduation rewards, final visible copy, art rights, or visual quality. It also cannot prove real-device or Safari behavior.
