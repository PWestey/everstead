# Migration baseline

## Repository role

This repository is the canonical implementation workspace for Everstead. The initial GitHub commit contains the exact uploaded v0.1 prototype and is retained as the historical comparison point.

## Keep as-is initially

- Mobile-first browser shell and responsive presentation
- Existing Village screen and navigation scaffolding
- Modal and interaction patterns that remain compatible
- Local save/load foundation
- 24-hour offline Gold calculation
- Existing data/content that does not conflict with the locked design

## Reuse with migration

- Oaths and their Easy/Medium/Hard multipliers
- Buildings, economy, and Prosperity scaffolding
- Fellow, Family, and Companion rosters and interfaces
- Power calculations and compatible elemental battle logic
- Progression and encounter presentation scaffolding

## Replace behind the shell

- Fellow staffing of Buildings with Family assignments
- Legacy Fellow training/Bond/prestige progression
- Family blessing/progress mechanics
- Simple Companion bound-perk mechanics
- Adventure modes that conflict with the locked V1 mode structure
- Unversioned persisted data structures as they become migration-sensitive

## Add through roadmap phases

- Versioned saves and regression/debug tools
- Fellow EXP, Level, Power, rarity/shards, Bond, Relics, and assignment bonuses
- Family Intimacy, Gifts, rarity/shards, production, and Family-to-Fellow Bonds
- Companion EXP, Level, Power, rarity/shards, assignments, Campaign, Tower, and Mastery
- Fellow Campaign, walking/slideshow stages, and targeted shard acquisition
- Golemore-equivalent mode and the Fellow idle-power multiplier
- Player character and Player Rank unlock structure
- Claim-time shard rolls, bad-luck protection, and integrated economy balancing

## Deferred after V1

Portrait sway/body physics, Live2D, advanced animation, weekly boss, draft mode, clash, deeper patrol/gatherings, advanced relic sets/affixes/reforging, special CGs, museum, events, advanced story, and audio/voice remain out of scope until the V1 acceptance gate is complete.

