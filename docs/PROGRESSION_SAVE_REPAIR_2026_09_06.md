# Progression save repair — 2026-09-06

The supplied recovery diagnostic reproduced a valid schema-15 save that loaded
normally but failed on Adventure Go: `Cannot read properties of undefined
(reading 'shards')`. The user data is not included in the repository.

Root cause: the shared-EXP Campaign execution path assumed the Phase 11G
rotating-target preview always supplied `targetFellowId`. Valid native/reset
saves can lack that historical migration receipt and instead use the authored
target on the stage. The new preview resolves that existing target when no
rotating target is supplied. It does not add migration receipts, change the
reward rules, relax validation, or reset progress.

Verification on an isolated copy of the supplied diagnostic:

- Active save loads and validates.
- All four existing passive buildings upgrade and reload successfully.
- Adventure first clear awards exactly 120 wallet EXP and two Kaladin shards.
- Invested Fellow EXP remains unchanged; reward state survives reload.
- No JavaScript errors or protection screen during the checked flow.

Fresh-save Campaign and manual-EXP regression: 30 checks pass at both mobile
sizes. The public Auto regression follows the new building entrance path.
The Village speech Hide control is raised above map entrances so it remains
clickable. No user save or backup is modified by testing.

This repairs the reproduced Adventure failure; it is not a claim that every
possible save failure is eliminated. A separate exact error/export is required
for any remaining upgrade or recovery failure.
