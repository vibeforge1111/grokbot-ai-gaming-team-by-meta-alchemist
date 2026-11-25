# First Session Director (starter): rubric kit-00-starter-template v1.0.1

Created by @meta_alchemist (https://x.com/meta_alchemist). The machine-readable definition is in `RUBRIC.json`.

initial version 1.0.0 to 1.0.1: Empty samples and zero case counts earn U. Computed lines require the declared evidence type.

- Scale: 100 points. Contribution: weight * level / 4.
- Game profile: your-game-profile@1.0.0. Hash: `sha256:1e6b912ce6b887ffc4b6d96fdaeebda69d1ecd524dc5ff202d7780a0f2c5836d`.
- Levels 0 to 4, or U. U earns zero points and excludes the line weight from measured coverage. Record skipped execution as NOT_RUN.
- Report the verdict and coverage beside the grade.

## Evidence populations

Each computed metric group needs a nonempty population. Use the listed sample arrays or positive integer case counts. For other groups supply a positive integer measuredCases from the capture. Empty inputs or zero measured cases earn U and zero points. A measured zero failures is valid.


| Pillar | Line | Name | Weight | Pass at | Evidence | Automated gate |
|---|---|---|---|---|---|---|
| Time to fun | time-to-fun:1 | First action is fast | 10 | 3 | capture | node tests/lens-negative-fixtures.mjs --line time-to-fun:1 |
| Time to fun | time-to-fun:2 | First win is reachable | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line time-to-fun:2 |
| Clarity | clarity:1 | Goal is shown early | 10 | 3 | capture | node tests/lens-negative-fixtures.mjs --line clarity:1 |
| Clarity | clarity:2 | Controls are taught | 10 | 3 | capture | node tests/lens-negative-fixtures.mjs --line clarity:2 |
| Friction | friction:1 | No gate before play | 10 | 3 | static | node tests/lens-negative-fixtures.mjs --line friction:1 |
| Friction | friction:2 | First load fits the budget | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line friction:2 |
| Stability | stability:1 | First session does not crash | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line stability:1 |
| Stability | stability:2 | Frame time holds | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line stability:2 |
| Reason to return | return:1 | Next goal is shown | 10 | 3 | capture | node tests/lens-negative-fixtures.mjs --line return:1 |
| Reason to return | return:2 | Play again is one action | 10 | 3 | static | node tests/lens-negative-fixtures.mjs --line return:2 |

## Level anchors

### time-to-fun:1 First action is fast

- **0**: Players wait past the budget before their first meaningful action
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: p95 time to first action is inside the profile budget on every device profile
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### time-to-fun:2 First win is reachable

- **0**: Most new players never reach a first win or reward
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: The share of new players reaching a first win meets the profile minimum
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### clarity:1 Goal is shown early

- **0**: No goal is shown in the first session
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: The goal is on screen inside the profile budget
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### clarity:2 Controls are taught

- **0**: A required control is never taught
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Every required control is taught before it is needed
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### friction:1 No gate before play

- **0**: Signup, payment or a long form blocks the first match
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Nothing blocks play before the first match
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### friction:2 First load fits the budget

- **0**: The first load is far over the budget
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: First load size is inside the profile budget
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### stability:1 First session does not crash

- **0**: Crashes or softlocks in first sessions
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Crash free first sessions meet the profile minimum
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### stability:2 Frame time holds

- **0**: Frame time p95 far over budget on a supported device
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Frame time p95 is inside the profile budget on every device profile
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### return:1 Next goal is shown

- **0**: The session ends with no next goal
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: A clear next goal is shown at the end of the first session
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### return:2 Play again is one action

- **0**: Starting another round takes several screens
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Play again is one action from the results screen
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.
