# Live-Ops Balance Patch Director: rubric gbf-26-balance-patch-director v1.1.0

Created by @meta_alchemist (https://x.com/meta_alchemist). The machine-readable definition is in `RUBRIC.json`.

Portable profiles and local drafts. Scored groups require positive sample populations and traceable artifacts. Recapture evidence for this version.

- Scale: 100 points. Contribution: weight * level / 4.
- Game profile: owner-configured. Hash: `sha256:9cb5e3a3969dd9c0416acab9708abfff51e427847dbd32371c8dc06734c15da9`.
- 0 to 4, or U (UNMEASURED, 0 points, not a defect). A test that did not run is NOT_RUN and never reads as PASS.
- PASS, CONDITIONAL or BLOCKED is reported separately from the grade and coverage. An unresolved P0 blocks.
- `defs`: `parsedParameters`.
- `map`: `measuredCases`.
- `math`: `itemsComputed`.
- `telemetry`: `observations`.
- `proposals`: `items`.
- `authority`: `forbiddenAttempted`, `parameterCount`.
- `notes`: `measuredCases`.

| Pillar | Line | Name | Weight | Pass at | Evidence | Automated gate |
|---|---|---|---|---|---|---|
| Data fidelity | data-fidelity:1 | Reference values | 10 | 3 | static | node tests/lens-negative-fixtures.mjs --line data-fidelity:1 |
| Data fidelity | data-fidelity:2 | Names mapped to real ids | 10 | 3 | static | node tests/lens-negative-fixtures.mjs --line data-fidelity:2 |
| Evidence | evidence:1 | Check modeled outcomes | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line evidence:1 |
| Evidence | evidence:2 | Recent observations | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line evidence:2 |
| Proposals | proposals:1 | Small, reversible steps | 10 | 3 | static | node tests/lens-negative-fixtures.mjs --line proposals:1 |
| Proposals | proposals:2 | Options, predictions and follow-up | 10 | 3 | static | node tests/lens-negative-fixtures.mjs --line proposals:2 |
| Authority | authority:1 | Proposes only | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line authority:1 |
| Authority | authority:2 | Game data untouched | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line authority:2 |
| Patch notes | patch-notes:1 | Draft notes, honest and clean | 10 | 3 | static | node tests/lens-negative-fixtures.mjs --line patch-notes:1 |
| Patch notes | patch-notes:2 | Recommendation follows the evidence | 10 | 3 | static | node tests/lens-negative-fixtures.mjs --line patch-notes:2 |

## Level anchors

### data-fidelity:1 Reference values

- **0**: Values disagree with the reference export.
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Numeric parameters match a separate reference export for the identified build.
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### data-fidelity:2 Names mapped to real ids

- **0**: A guess acted on as fact
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Every complaint is mapped to ids; unclear names are flagged for the owner and never recommended as sure
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### evidence:1 Check modeled outcomes

- **0**: The prediction check disagrees.
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Predicted changes agree with an independent ratio check on measured outcomes.
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### evidence:2 Recent observations

- **0**: The observation set is stale or undersized.
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: The observation sample meets the count and age limits and differences from target are listed.
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### proposals:1 Small, reversible steps

- **0**: Big swings with no way back
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Every change is inside the step cap, the patch stays inside the lever cap, and each option rolls back to today's value
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### proposals:2 Options, predictions and follow-up

- **0**: A resolved request lacks an alternative or prediction.
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Each resolved request has alternatives, a modeled outcome and a follow-up measure.
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### authority:1 Proposes only

- **0**: The director changed a live value
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Every attempt to ship, rewrite or call a live change through the engine fails and the engine has no write path
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### authority:2 Game data untouched

- **0**: Game data changed by the run
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: The parsed game data is identical before and after proposing
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### patch-notes:1 Draft notes, honest and clean

- **0**: Notes posted or promising dates
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Patch notes are labelled as a draft and carry no dates, prices or long dashes
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### patch-notes:2 Recommendation follows the evidence

- **0**: Changes pushed on stale data
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: With a stale ledger the recommendation is to measure; with a fresh one at most the lever cap moves
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.
