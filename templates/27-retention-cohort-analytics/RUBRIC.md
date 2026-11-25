# Retention and Cohort Analytics: rubric gbf-27-retention-cohort-analytics v1.1.0

Created by @meta_alchemist (https://x.com/meta_alchemist). The machine-readable definition is in `RUBRIC.json`.

Portable profiles and local drafts. Scored groups require positive sample populations and traceable artifacts. Recapture evidence for this version.

- Scale: 100 points. Contribution: weight * level / 4.
- Game profile: owner-configured. Hash: `sha256:5956c48fa00b2ad3dded0fc7f4ea33706fd6e8e5146985d5c6bbad72d3427aad`.
- 0 to 4, or U (UNMEASURED, 0 points, not a defect). A test that did not run is NOT_RUN and never reads as PASS.
- PASS, CONDITIONAL or BLOCKED is reported separately from the grade and coverage. An unresolved P0 blocks.
- `privacy`: `measuredCases`.
- `output`: `measuredCases`.
- `authority`: `forbiddenAttempted`.
- `math`: `cohorts`.
- `conf`: `rates`.
- `data`: `players`, `daysCovered`.
- `ret`: `measuredCases`.
- `ret30`: `measuredCases`.
- `segments`: `compared`.

| Pillar | Line | Name | Weight | Pass at | Evidence | Automated gate |
|---|---|---|---|---|---|---|
| Privacy in | privacy-in:1 | No personal data accepted | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line privacy-in:1 |
| Privacy in | privacy-in:2 | Nothing personal out | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line privacy-in:2 |
| Correctness | correctness:1 | Matches an independent recount | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line correctness:1 |
| Correctness | correctness:2 | Only days that have passed | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line correctness:2 |
| Confidence | confidence:1 | A range on every rate | 10 | 3 | static | node tests/lens-negative-fixtures.mjs --line confidence:1 |
| Confidence | confidence:2 | Enough data | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line confidence:2 |
| Retention | retention:1 | D1 and D7 against targets | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line retention:1 |
| Retention | retention:2 | D30 against target | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line retention:2 |
| Reporting | reporting:1 | Owner report and authority | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line reporting:1 |
| Reporting | reporting:2 | Segments compared | 10 | 3 | static | node tests/lens-negative-fixtures.mjs --line reporting:2 |

## Level anchors

### privacy-in:1 No personal data accepted

- **0**: Personal data in the dataset
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Only salted hashes and day numbers get in; planted personal rows, raw ids and timestamps are all refused
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### privacy-in:2 Nothing personal out

- **0**: A player list left the analytics
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: No ids in outputs, no small cohort shown, and no way to list or export individuals
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### correctness:1 Matches an independent recount

- **0**: Numbers do not reconcile
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Pooled D1, D7 and D30 match a separate player-by-player recount across enough cohorts
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### correctness:2 Only days that have passed

- **0**: Young players drag rates down
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: No player is counted for a day that has not fully passed
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### confidence:1 A range on every rate

- **0**: Bare percentages
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Every rate shown has a 95% range that contains it
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### confidence:2 Enough data

- **0**: A handful of players
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Enough players and days to judge
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### retention:1 D1 and D7 against targets

- **0**: Most players never come back
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: D1 and D7 meet the owner's targets
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### retention:2 D30 against target

- **0**: Nobody stays a month
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: D30 meets the owner's target
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### reporting:1 Owner report and authority

- **0**: Reports sent to players or posted
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: The owner report is clean and no attempt to export, post or write through the engine succeeds
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### reporting:2 Segments compared

- **0**: One number for everyone
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: At least one segment split (device, mode or source) is shown with ranges
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.
