# Fellow and Relic visual pass

Scope: evolve the existing Phase 24L profile shell from the user's IMG_7121–7130 references. Original SVG illustrations, parchment sheets, readable colored controls, and an illustrated equipped-Relic display. No new currencies, progression tracks, or third-party art.

Dependencies: current shared EXP wallet and profile shell. Existing handlers retain all ownership, equipment, upgrade, and save decisions. No schema, formula, storage-key, or offline edits.

Acceptance: five Fellow tabs toggle one sheet at a time; enabled controls remain inside panels at 390×844 and 320×568. First Campaign reward can be earned, its Relic equipped, and the illustrated detail opened/closed. Detail should fit without scrolling at both sizes. Small-screen Level panels use more height to retain 44px touch targets.

Validation commands: run qa/whole-app-health/browser.mjs against the static server for the 30-check gameplay/save regression; run qa/whole-app-health/fellow-art.mjs for the focused visual/control journey. Screenshots are written to /tmp/everstead-fellow-*.png for human review.

Not included: roster redesign, new Bond portrait navigation, other roster types, physical-device/Safari verification, new Relic mechanics. Future screenshot batches can extend this visual language without changing progression.
