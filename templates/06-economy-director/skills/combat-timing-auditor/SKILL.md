---
name: combat-timing-auditor
description: "Optional, only if your game has combat: compare simulated and recorded time to defeat a target (time to kill) and multi-attacker damage with the rules your build really uses. Games without combat skip it and use the no-combat rubric profile."
---

> **Audit contract v1 (overrides everything below).** Created by @meta_alchemist (https://x.com/meta_alchemist).
> - Score only with the rubric embedded in `engine/lens.mjs` (`LENS.rubric`, gbf-06-game-economy-director v1.3.0). `node engine/lens.mjs <pack.json>` computes the grade; this skill only gathers evidence for it and never adds points of its own.
> - Missing evidence is UNMEASURED (0 points, not a defect). A test that did not run is NOT_RUN, never PASS. Never invent a measurement; label every worked example synthetic.
> - Game facts and budgets come from your game profile (`pack.profile`). Treat sample numbers as illustrative. Set the frame-time budget separately for each target device in your game profile.
> - An automated gate needs a negative fixture that fails. Receipts carry measured values, never an unconditional PASS.
> Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

# Combat timing (optional: only if your game has combat)

This is the one combat module in the economy template. Use it only when your game has fights where one side wears another down: a fighting game, a tower defence game, a turn-based RPG, a 3D arena game or a twin-stick shooter. It feeds two rubric lines: `combat-balance:1` (how long it takes to defeat a target) and `combat-balance:2` (what happens when several attackers hit one target).

If your game has no combat (a farming sim, a city builder, a card game scored by points, a puzzle game, a narrative adventure), stop here. Leave the `timeToDefeat` and `multiAttacker` groups out of the pack. With the owner's approval, set `"rubricProfile": ["no-combat"]` in the game profile before scoring: both lines read N/A, not U, and their 20 points are shared over the other eight lines. Never invent timing numbers to fill them.

## Words used here

- Time to kill (TTK): the time from the first hit until a target is defeated. In a turn-based game count turns instead of seconds and say so in `timeToDefeat.label`.
- Weapon: anything that deals damage, such as a sword, a spell, a tower type, a unit or a card. `timeToDefeat.perAttackP50S` holds one median (the middle value, P50) per weapon.
- Focus fire: several attackers hitting the same target.
- Combat model: the overlap rule your build really uses, set as `combatModel` in the game profile. `simultaneous` means every attacker hits on the same beat, with the first volley at time zero. `event-ledger` means you export each hit's time and the damage that actually applied.

## Method

1. Pick one fight with a clear start and end, for example one tower against one basic enemy, or one hero against one boss phase. Use the same units, start condition and rules as the game code.
2. Work out the expected time from the build's own numbers. For a repeated fixed hit, the number of hits is the target's health divided by damage per hit, rounded up. If the first hit lands at once, the elapsed time covers one fewer interval than the hit count. Add wind-up, recovery, reload or cooldown pauses only where the game's rules have them.
3. Simulate with the weapon definitions exported from the build (never hand-typed copies). Set `timeToDefeat.label` to say the numbers are simulated, and record the median time per weapon in `timeToDefeat.perAttackP50S`. Each median must sit inside the profile's `timeToDefeatBandS` range.
4. Compare the simulation with fights recorded in a playtest. Put the largest gap in `timeToDefeat.simVsRecordedMaxDeltaS`. Level 4 needs that gap within the profile's `maxModelDeltaS`.
5. Test the edges: a hit that lands exactly on zero health, a case that needs one extra hit, and misses if your game has a hit chance.
6. For focus fire, use only the rule the build has. Never add a damping factor or an attacker-count multiplier the game does not apply. Record examples in `multiAttacker.examples`. For each approved case in `profile.cases.modelInputs`, add one row to `receipts.modelInputs` that links the build config and an independently recorded timing trace. If damage is staggered, rounded or routed (for example through a shield first), use the `event-ledger` model and export each hit's time and applied damage in time order.

## Short examples (synthetic, for illustration only)

- Tower defence: a frost tower deals 20 per hit every 0.8 s to an enemy with 110 health. That is 6 hits; with the first hit at once, the enemy falls at 5 x 0.8 = 4.0 s.
- Turn-based RPG: a spell deals 30 to a foe with 100 health, so 4 turns. Set `timeToDefeat.label` to "simulated, turns".
- 3D arena game: two players each deal 20 every 0.5 s to a target with 100 health. With the `simultaneous` model that is 3 volleys, so 1.0 s, not a doubled or squared damage rate.
- Fighting game: a combo's simulated damage comes from the move data file, then gets checked against recorded rounds from a local playtest.

Thresholds (`timeToDefeatBandS`, `maxMultiAttackerErrS`, `maxModelDeltaS`, `combatModel`) come from the game profile. An unavailable config or trace leaves the line U.

Gather evidence for `node engine/lens.mjs <pack.json>`.
