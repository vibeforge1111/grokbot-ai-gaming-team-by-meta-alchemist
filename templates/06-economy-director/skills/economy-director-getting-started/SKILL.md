---
name: economy-director-getting-started
description: "Use on first run with a new owner: onboard them one question at a time, list what they provide, and run the first Game Economy Director grade with the lens engine."
---

> **Audit contract v1 (overrides everything below).** Created by @meta_alchemist (https://x.com/meta_alchemist).
> - Score only with the rubric embedded in `engine/lens.mjs` (`LENS.rubric`, gbf-06-game-economy-director v1.3.0). `node engine/lens.mjs <pack.json>` computes the grade; this skill only gathers evidence for it and never adds points of its own.
> - Missing evidence is UNMEASURED (0 points, not a defect). A test that did not run is NOT_RUN, never PASS. Never invent a measurement; label every worked example synthetic.
> - Game facts and budgets come from your game profile (`pack.profile`). Treat sample numbers as illustrative. Set the frame-time budget separately for each target device in your game profile.
> - An automated gate needs a negative fixture that fails. Receipts carry measured values, never an unconditional PASS.
> Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

# Game Economy Director: Getting Started

Model where your game's resources come from and where they go (sources and sinks), how long progression takes, and whether rewards are counted fairly. Combat timing and payment checks are optional modules for games that have them.

If `engine/lens.mjs`, `engine/lens-kit.mjs` or `fixtures/good-pack.json` are not on disk yet, write them byte for byte from the `economy-director-lens-engine` skill first (Node 18+, no dependencies).

## 1. Onboard one question at a time

Ask one question at a time, wait for the answer, then ask the next. Never stack questions in one message. Skip a question when an earlier answer already settled it.

1. Which game are we reviewing?
2. Which build should I grade?
3. Who or what produces the evidence pack for that build: a CI job or a manual playtest capture?
4. What do players earn and spend in your game? For example coins, wood, energy, lives, cards, crafting materials, keys or experience.
5. Where is progress saved: on the device, in the cloud, on a server, or more than one of these?
6. Does the game give random rewards, such as drops, card packs, chests or random harvests?
7. Does the game have combat? If not, we use the `no-combat` profile: I skip the combat timing module, its two lines read N/A, and their 20 points are shared over the other eight lines.
8. Does the game sell anything for real money (items, currency, a pass, an ad-free upgrade)? If not, we use the `no-store` profile: the paid-path and payment lines read N/A and their partner lines take each pillar's 20 points.
9. If it does sell something: do you have a store sandbox (a test mode with no real money) where you can try failed, duplicate and refunded purchases yourself? I only review your sandbox results; I never make a charge, refund or grant, real or sandbox.
10. How long should a typical player take to reach the next step of progression (a level, a farm upgrade, a city tier, a full card set)? This becomes `maxProgressStepDays`.
11. Then ask the remaining targets one per message, only for the systems the game has, starting from the synthetic values in `fixtures/good-pack.json`:
    - Random rewards: How wide may the 95 percent range around a reward rate be before you want more data? (`maxRewardIntervalWidth`)
    - Something for sale: Over the same period, what share of the paid path should a player who never pays still reach? (`minFreeShareOfPaid`)
    - Combat: What are the fastest and slowest acceptable median times to defeat a target? (`timeToDefeatBandS`)
    - Combat: How far may simulated fights differ from recorded ones? (`maxModelDeltaS`)
    - Combat: How large an error is acceptable when several attackers hit one target? (`maxMultiAttackerErrS`)
    - Combat: Do all attackers hit on the same beat, or will you export each hit's time and damage? (`combatModel`: `simultaneous` or `event-ledger`)
12. Who reviews the local finding drafts before anything is filed?

Read the profile picks back to the owner and, once they approve, set them before scoring, for example `"rubricProfile": ["no-combat", "no-store"]` in `pack.profile`.

Before grading a real pack, check that its build and profile match the owner's answers. Record a capture or run that could not happen as NOT_RUN. Use the sample sizes listed by `node engine/lens.mjs --meta`.

## 2. What you provide

- An evidence pack (JSON) with `status: "VALID"`, a `liveSha`, a `gitSha` and a `packId` (all three are required), and an `artifacts` list. Every metric group names the artifact id it came from.
- Metric groups this engine reads, by system:
  - Every game with resources: `progression` (static), `reachability` (trace), `rewards` (trace), `balance` (trace), `storage` (trace).
  - Random rewards: `randomRewards` (static).
  - Something for sale: `freeVsPaid` (static), `payments` (trace), and the growth checks `storePricing` (static) and `paidEdge` (static).
  - Combat: `timeToDefeat` (trace), `multiAttacker` (static).
- Profile thresholds in `pack.profile`. A missing threshold makes its line U, never a default.
- Anything you cannot capture yet stays out of the pack. It grades U (UNMEASURED), which is honest and costs no false defect. With `no-combat` or `no-store` approved, leave that system's groups out too; its lines read N/A.

## 3. Run the first grade

```
node engine/lens.mjs fixtures/good-pack.json   # worked example, synthetic, not a measurement
node engine/lens.mjs your-pack.json            # your build
node engine/lens.mjs --meta                    # rubric lines, weights and what each reads
node engine/lens.mjs --fixtures fixtures/good-pack.json  # negative and missing-input self-test
```

Read the record: `verdict` (PASS, CONDITIONAL, BLOCKED or INVALID), `grade` and `coverage`, then each line's `level` and `findings`, then `checks` (growth checks reported beside the grade) and `tickets` (deduplicated candidates).

## 4. Report in plain English

- Lead with the verdict, grade and coverage in one sentence. Say how much of the rubric was measured.
- List U lines as "not measured yet" with the capture that would measure them. Never call them defects. Name the rubric profiles used next to the grade. For a U line about a system the game does not have and no profile covers, write "does not apply: no random rewards" (or "one save path") instead.
- One local ticket draft per measured finding, with the pack id and artifact ids. Label any synthetic pack as synthetic.
- Rubric lines, grouped by what they need:
  - Every game with resources: progression:1, progression:2, reward-fairness:1, entitlement-consistency:2, loot-access:2 (it also reads the random reward group today).
  - Random rewards: loot-access:1.
  - Something for sale: reward-fairness:2, entitlement-consistency:1.
  - Combat: combat-balance:1, combat-balance:2.

## 5. Skills in this template

- `resource-sources-and-sinks-model`: start here. List every source and sink, model balances over time, and find stuck players, unreachable goals and double-counted rewards.
- `monte-carlo-meta-balancer`: run many seeded simulations of player choices to measure progression time, dominant choices and the effect of a proposed change.
- `combat-timing-auditor`: optional, only if the game has combat. Compare simulated and recorded time to defeat a target.
- `economy-director-lens-engine`: the engine source and how to run it.

## Lines that do not apply to your game

Two approved profiles live in `RUBRIC.json`. The owner approves them before scoring and you set them in `pack.profile.rubricProfile`:

- `no-combat` (no combat): `combat-balance:1` and `combat-balance:2` read N/A, and that pillar's 20 points are shared over the other eight lines (12.5 each). Leave `timeToDefeat`, `multiAttacker` and `receipts.modelInputs` out.
- `no-store` (sells nothing: no paid items, currency or access): `reward-fairness:2` and `entitlement-consistency:1` read N/A, and `reward-fairness:1` and `entitlement-consistency:2` take 20 each. Leave `freeVsPaid`, `payments`, `receipts.entitlementDrills`, `storePricing` and `paidEdge` out.

N/A is not U and not a defect, and with every other line at level 3 or more the verdict can be PASS. When both are selected the engine applies the same rule (see `docs/RUBRIC_GUIDE.md` in the kit, section Applicability). Never move weights during a run.

Random rewards (`loot-access:1`) and a second save path (`progression:2`) have no profile. A game without them leaves the line U, coverage drops below 100 percent and the verdict stays CONDITIONAL even when every measured line passes. Say in the report which U lines are "does not apply" so nobody reads them as missing work.

## Storage and payment drills (owner-run)

- Storage: the owner runs the same seeded actions on each supported save path in an isolated test copy and compares the saved state before and after (`receipts.storageReplay`, line `progression:2`).
- Payments, only for a game that sells something: the owner rehearses a declined, duplicate, interrupted and restored purchase with synthetic orders in the store sandbox and records expected versus actual grants and losses (`receipts.entitlementDrills`, line `entitlement-consistency:1`). Without these tests the line never passes.
- Production records are read-only. Only the human operates payments, grants or refunds.

## Blockers to tell the owner about

- For a game with purchases, payment failure evidence needs a sandbox account; the worked example is synthetic.

Before capture, agree on the case IDs and expected values in `profile.cases`. Run `node engine/lens.mjs --meta` for the required row fields and comparisons. Record one row per approved case under `receipts`, including its id, liveSha and artifact ID. A skipped or stale case leaves its line U. The bundled rows and budgets are synthetic.

<!-- team:begin (generated by scripts/build-team.mjs from template.json; edit template.json, not this block) -->

## Team inputs and outputs

This template works on its own. When other templates from the kit run in the same game project, they exchange files under `.grokbot-team/artifacts/<artifact>/` (read the newest file) and share an append-only memory under `.grokbot-team/memory/`. Team spec 1.0.0.

Before acting, look for these inputs:

| Input | From | Where to look | If it is missing |
|---|---|---|---|
| `game-profile` (required, ^1.0.0) | the owner | `pack.profile` in the evidence pack, or `.grokbot-team/artifacts/game-profile/` | Ask the getting-started questions and write it with the owner. A missing threshold leaves its line unmeasured, never a default. |
| `evidence-pack` (required, ^1.0.0) | the owner, 02 Playtest, 04 Netcode, 07 Shader, 08 World and Biome, 16 Splat Cleaner | the pack path the owner gives, or `.grokbot-team/artifacts/evidence-pack/` | Stop and ask the owner for a pack. Without one there is no grade; record NOT_RUN. |
| `change-list` (optional, ^1.0.0) | the owner, 16 Splat Cleaner, 18 Bug Desk | `.grokbot-team/artifacts/change-list/` | Continue: compare builds by their ids only and write "ASSUMPTION: no change-list available" in the report. |
| `tracker-export` (optional, ^1.0.0) | the owner | `.grokbot-team/artifacts/tracker-export/` | Continue without it. Start the report with "ASSUMPTION: no tracker-export available" and say which checks it would have informed. Leave lines that need it unmeasured. Never invent the missing data. |
| `loop-report` (optional, ^1.0.0) | 05 Game Loop | `.grokbot-team/artifacts/loop-report/` | Continue without it. Start the report with "ASSUMPTION: no loop-report available" and say which checks it would have informed. Leave lines that need it unmeasured. Never invent the missing data. |
| `cohort-report` (optional, ^1.0.0) | 27 Retention | `.grokbot-team/artifacts/cohort-report/` | Continue without it. Start the report with "ASSUMPTION: no cohort-report available" and say which checks it would have informed. Leave lines that need it unmeasured. Never invent the missing data. |
| `balance-patch-draft` (optional, ^1.0.0) | 26 Balance Patch | `.grokbot-team/artifacts/balance-patch-draft/` | Continue without it. Start the report with "ASSUMPTION: no balance-patch-draft available" and say which checks it would have informed. Leave lines that need it unmeasured. Never invent the missing data. |
| `entitlement-ledger` (optional, ^1.0.0) | 24 Ledger | `.grokbot-team/artifacts/entitlement-ledger/` | Continue without it. Start the report with "ASSUMPTION: no entitlement-ledger available" and say which checks it would have informed. Leave lines that need it unmeasured. Never invent the missing data. |

After acting, save these outputs as local files for the human to review:

| Output | Format | Where | Read by |
|---|---|---|---|
| `economy-change-list` 1.0.0 | JSON plus a Markdown proposal draft | `.grokbot-team/artifacts/economy-change-list/` | 20 Patch Notes, 22 Live Service, 26 Balance Patch |
| `grade-record` 1.0.0 | JSON (the engine's grade record) | `.grokbot-team/artifacts/grade-record/` | 12 Producer |
| `ticket-draft` 1.0.0 | JSON or Markdown local draft | `.grokbot-team/artifacts/ticket-draft/` | 12 Producer, 18 Bug Desk |

Each output file is JSON with `artifact`, `version`, `producer` (this template's id and version), `createdAt` (UTC), `synthetic` and `items`, as the kit's `spec/artifacts/<artifact>.schema.json` describes. Name files `<UTC date>-<short label>.json` so the newest sorts last.

Shared memory:

- Before acting, read `decisions`, `balance`, `entitlements`, `releases` from `.grokbot-team/memory/<topic>.jsonl`. Skip records that have expired or that a later record supersedes.
- Write only `decisions`, `balance`. Append one line per record with `engine/team-memory.mjs` (or the same JSON by hand): id, UTC time, writer (`gbf-06-game-economy-director` and `1.0.1`), topic, kind, summary, data, source, confidence (measured, reported or assumed), expires_at and supersedes. Never edit or delete a line; supersede it.
- Never put secrets, names, handles, wallets, emails or raw user ids in memory. Refer to a person or account only by `node engine/team-memory.mjs hash <id>`, which needs the salt in `GROKBOT_TEAM_SALT`. Run `node engine/team-memory.mjs lint` before you finish.
- Keep `.grokbot-team/` out of a public game repository (add it to `.gitignore`); in a private one, commit it so the append-only rule can be checked against history.

<!-- team:end -->
