---
name: resource-sources-and-sinks-model
description: "Start here for any game where players earn and spend something: list every source (where a resource comes from) and sink (where it goes), model balances over time, and find stuck players, unreachable goals and double-counted rewards."
---

> **Audit contract v1 (overrides everything below).** Created by @meta_alchemist (https://x.com/meta_alchemist).
> - Score only with the rubric embedded in `engine/lens.mjs` (`LENS.rubric`, gbf-06-game-economy-director v1.3.0). `node engine/lens.mjs <pack.json>` computes the grade; this skill only gathers evidence for it and never adds points of its own.
> - Missing evidence is UNMEASURED (0 points, not a defect). A test that did not run is NOT_RUN, never PASS. Never invent a measurement; label every worked example synthetic.
> - Game facts and budgets come from your game profile (`pack.profile`). Treat sample numbers as illustrative. Set the frame-time budget separately for each target device in your game profile.
> - An automated gate needs a negative fixture that fails. Receipts carry measured values, never an unconditional PASS.
> Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

# Model resource sources and sinks

Start here for any game that has something players earn and spend: coins, wood, energy, lives, cards, crafting materials, keys or experience. A source adds a resource (a harvest, a quest reward, a level clear, a daily gift). A sink removes it (a purchase from a shop in the game, an upgrade, upkeep, repair, decay, a crafting cost). A transfer moves it between players or between resources without creating or destroying any.

## Method

1. Pick the unit (coins, wood, lives), the time step (a turn, a day in the game, a play session) and what carries over between sessions.
2. List every source and sink with its trigger, amount and who can use it. List transfers (trading, gifting, converting duplicates into crafting dust) separately.
3. For each step, closing balance = opening balance + inflows - outflows. Run low, typical and heavy play. Use measured activity from session logs where you have it, and label anything assumed.
4. Compare time to each goal, the share of players who get stuck and the balance at a few percentiles (for example the 10th, 50th and 90th) with the ranges the owner picked. Look at the low end, not only the average: a healthy total can hide players who cannot afford the next required step.
5. For each group of players and period, divide permanent outflow by generated inflow to see how much of the resource leaves the game. If nothing came in, the ratio is undefined: say so, do not report zero.
6. Change one assumption at a time and rerun.
7. Add two negative fixtures and confirm the output catches them: a zero-income player (an unreachable goal must show up) and a reward granted twice for one claim (a duplicate grant must show up).

## Short examples (synthetic, for illustration only)

- Farming or life sim: crop sales and foraging are sources; seeds, tool upgrades and house expansions are sinks; energy refills each morning up to a cap.
- City builder: taxes per citizen are a source; building upkeep is a sink; a bridge needed to unlock the next district is a required goal.
- Card game: packs earned from wins are a source; duplicates convert into crafting dust (a transfer); crafting a chosen card is a sink.
- Mobile puzzle game with boosters: coins per cleared level are a source; boosters and extra moves bought with coins are sinks; lives refill over time.
- Free game with no store: every resource is earned, and the model still finds stuck players and runaway hoards.
- Narrative adventure: keys and quest items are resources; spending the only key on the wrong door would make the story impossible to finish.

## What to put in the pack

- `progression`: `assumptionsStated` (at least two, for example minutes played per day and success rate) and `stepDaysEstimate` (days to reach the next step of progression: a level, a farm upgrade, a city tier, a full card set). It must stay within the profile's `maxProgressStepDays`. For each approved case in `profile.cases.simulationRun`, add a row to `receipts.simulationRun` with the player group, seed, horizon, repetitions, config and the low, estimate and high days. Feeds `progression:1`.
- `reachability`: `requiredPaths` (goals every player must be able to reach) and `unreachable` (how many cannot be reached). Feeds `loot-access:2`. That line also reads the `randomRewards` group today, so a game with no random rewards sees it as U; say so in the report.
- `randomRewards` (only if your game has random rewards such as drops, card packs, chests or random crop yields): `drops` (total rolls observed), `rare` (how many gave the outcome you track) and `intervalsReported` (true when the report shows a 95 percent range around the rate, not only the rate). The range must be no wider than the profile's `maxRewardIntervalWidth`. Feeds `loot-access:1`.
- `rewards`: `retriesSimulated` (at least 10 repeated claims of the same reward) and `duplicateGrantsA` and `duplicateGrantsB` (extra grants seen on each save path, for example local save and cloud save). Feeds `reward-fairness:1`.
- `balance`: `operations` (at least 20 earn or spend actions) and `mismatches` (times the number shown to the player differed from the saved or server value). Feeds `entitlement-consistency:2`.

Thresholds come from the game profile. A group you cannot measure stays out of the pack and its line grades U.

Gather evidence for `node engine/lens.mjs <pack.json>`.
