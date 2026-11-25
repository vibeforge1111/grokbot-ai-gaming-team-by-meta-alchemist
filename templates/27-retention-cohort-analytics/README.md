# Retention and Cohort Analytics

Created by @meta_alchemist (https://x.com/meta_alchemist).

**Status: preview, not shipping.** This template works and its tests pass, but it is not yet held to the kit's release standard.

Before it can ship:

- Move to the kit's shared lens engine. This template still carries its own lens kit 1.1.0, which trusts the metrics a pack declares and never checks artifact bytes or a producer receipt.
- A pack producer with receipts: `cohorts/scenario.mjs` prints a pack from your input but writes no artifact files, digests or producer receipt.
- Assign the segment at cohort entry and reject conflicting segments. Today a player's segment depends on row order.
- A release comparison tool and weekly report code (both are prompts today).
- Thresholds from the profile and concrete anchors: the lens still fixes `segments.compared` at 2 and `conf.rates` at 3, and the confidence and retention anchors are vague.
- Earn points from the game: the privacy and reporting lines partly probe this template's own code and planted rows.

Measure mature return cohorts with uncertainty ranges and draft a privacy-preserving review. Start with [HOW-TO-USE.md](HOW-TO-USE.md).

## Domain tools

Three files in `cohorts/`:

- `cohorts.mjs` is the engine. It accepts only salted subject ids (sub_ plus 32 hex), whole day numbers and approved segment codes, groups players by first-play week, counts a return only after its day has fully passed, adds a 95% Wilson range to every rate, hides cohorts under `profile.minCellSize` and checks the pooled rates against an independent recount.
- `scenario.mjs` prints a pack from your input file, or the report with `--report`. Without a file it runs the synthetic worked example.
- `probe-only.mjs` prints a pack for a game with no session export yet: only the privacy and authority checks run, and every retention line stays U.

```sh
node cohorts/scenario.mjs input.json --report
node cohorts/scenario.mjs input.json > pack.json
node cohorts/probe-only.mjs --profile profile.json --git-sha <sha> --live-sha <sha>
```

Salt identifiers before export. Set a positive `profile.minCellSize` and list the permitted segment codes in `profile.allowedSegments`. A day with no eligible players has no rate.

## Evidence and grading

A grade describes the evidence supplied by the pack writer. For each group provide a cited artifact and the positive count or nonempty sample listed in `node engine/lens.mjs --meta`. Treat measured zero defects separately from zero cases examined. Missing build identity invalidates the pack. The worked example is synthetic.

| Rubric line | Observations |
|---|---|
| privacy-in:1 | privacy.piiAccepted, privacy.plantedRejected, privacy.rawIdsAccepted |
| privacy-in:2 | output.idsInOutputs, output.individualExports, output.smallCellsShown |
| correctness:1 | math.cohorts, math.oracleMismatches |
| correctness:2 | math.immatureCounted |
| confidence:1 | conf.rates, conf.ratesWithInterval |
| confidence:2 | data.daysCovered, data.players |
| retention:1 | ret.d1, ret.d7 |
| retention:2 | ret30.d30 |
| reporting:1 | authority.forbiddenAttempted, authority.forbiddenSucceeded, authority.writes, output.dashes |
| reporting:2 | segments.compared |

Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it.

Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.
