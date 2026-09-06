# Family–School connected progression v1

Scope: replace the public Hearth and School quizzes with connected, persistent progression. Depends on the schema-15 save transaction and Fellow EXP wallet. Preserve old quiz rewards, all prior character investments, total-roster Campaign/Tower Power, automatic Gold and the 24-hour offline ceiling.

## Gameplay

- Hearth starts with two gatherings; one/hour banks up to twelve. Choose a Family member, gather for three member-specific Support, then spend Support on Blessings. Next level costs `3 × (level + 1)`. Each level gives forty flat Power to that member’s linked, owned Fellows, added after prior bonuses.
- School starts with four lessons; one/30 minutes banks up to twenty-four. Enroll a named pupil free with a Family mentor and Baker, Herbalist or Smith identity. Potential snapshots `min(5, floor(Intimacy / 100) + Blessing level)` at enrollment; later mentor upgrades cannot change an already enrolled pupil’s reward.
- Each of four lessons credits `60 + 20 × potential` base Fellow EXP to the shared wallet. Existing Collection EXP bonuses apply once at credit. No Fellow levels automatically. This uses the existing ledger, not a second wallet.
- Graduation is manual, permanent and repeatable. Each graduate adds `240 + 60 × potential` Gold/hour. First graduation opens a second seat; third opens a third. Graduate totals and profession counts persist; the latest twelve individual records are retained to bound save growth.
- School and Hearth each have a first-use introduction and replayable Guide. Village entrances open the new activities; Family profiles also have a Hearth & Blessings shortcut.

## Save safety

Optional `hearthSchool` v1 initializes once with zero bonuses. No storage namespace changes or old data resets. Balances reconcile against gatherings, Blessing costs, pupils, lessons and graduations. School EXP transitions reconstruct the exact lesson action from the predecessor state and validate the resulting ledger entry. Atomic persistence covers both pupil progress and wallet credit. Existing rate settlement runs before new graduation earnings take effect.

Old Hearth/School quiz sessions and pending rewards remain accessible, but new quizzes cannot start there. The other ten quiz locations are unchanged.

## Verified

- Pure engine: 300 repeated graduations; accounting, duplicate graduation refusal, fifth-lesson refusal, malformed saves, bank caps and backwards clock behavior.
- Fresh save and the user-supplied recovery diagnostic save at 390×844 and 320×568: gathering, Blessing, enrollment, all lessons, EXP wallet credit without actor changes, graduation, reload, exact added earnings and one-hour automatic Gold.
- Interrupted staging and active writes: recovered lesson and EXP credit exactly once.
- Old School and Hearth quiz rewards remain claimable.
- Restaurant browser regression including Adventure and reload remains passing.
- Visual inspection of Hearth and School at 320px.

## Explicit limits / next work

This is the first connected loop, not the whole audit roadmap. Professions currently identify graduates but do not improve individual Restaurant/Apothecary/Forge operations. Earnings are attributed across existing production lines, as Restaurant earnings currently are. The UI reuses existing Family portraits and Fellowship background art; unique pupil art/classroom scenery and authored character-specific scenes remain future work. No Family Intimacy is added by gatherings; existing gifts and relationship systems retain that role. The five-tier pupil potential is a local quality range, not a cap on Collection pools or accumulated graduate earnings.

Not tested in this release: every historical save schema, long-duration economic balance, every existing Family profile at every screen size, or a new live deployment.
