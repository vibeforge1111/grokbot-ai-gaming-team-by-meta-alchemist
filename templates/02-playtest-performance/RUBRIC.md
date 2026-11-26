# Playtest and Performance Director: rubric gbf-02-playtest-performance v0.1.0

Created by @meta_alchemist (https://x.com/meta_alchemist). The machine-readable definition is in `RUBRIC.json`.

Initial 0.1.0 preview: journeys, planned scenarios, stability, owner-set frame budgets, and coverage.

- Scale: 100 points. Contribution: weight * level / 4.
- Game profile: your-game-profile@1.0.0. Hash: `sha256:571d88f660b6bf188877cb641fe0842235a33dd7ff7af09378c8b87deb35bd28`.
- Levels 0 to 4, or U. U earns zero points and excludes the line weight from measured coverage. Record skipped execution as NOT_RUN.
- Report the verdict and coverage beside the grade.

## Approved profiles

- **single-device**: The owner has one device profile in scope, so additional device lines are not scored. Select only after the owner approves it, before scoring. Weights: journeys:1 = 10, journeys:2 = 10, scenarios:1 = 10, scenarios:2 = 10, stability:1 = 10, stability:2 = 10, performance:1 = 20, performance:2 = 0, coverage:1 = 10, coverage:2 = 10.

## Evidence populations

Each computed metric group needs a nonempty population. Use the listed sample arrays or positive integer case counts. For other groups supply a positive integer measuredCases from the capture. Empty or missing evidence earns U.


| Pillar | Line | Name | Weight | Pass at | Evidence | Automated gate |
|---|---|---|---|---|---|---|
| Journeys | journeys:1 | Opening journey completes inside the time budget | 10 | 3 | capture | node tests/lens-negative-fixtures.mjs --line journeys:1 |
| Journeys | journeys:2 | Core journey completes on each required viewport | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line journeys:2 |
| Scenarios | scenarios:1 | Planned scenarios have a trace | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line scenarios:1 |
| Scenarios | scenarios:2 | Failed scenarios are explained or tagged as known | 10 | 3 | static | node tests/lens-negative-fixtures.mjs --line scenarios:2 |
| Stability | stability:1 | Sessions stay crash-free, with errors explained | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line stability:1 |
| Stability | stability:2 | Repeated sessions do not grow memory past the slope budget | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line stability:2 |
| Performance | performance:1 | Primary device frame time stays inside the owner budget | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line performance:1 |
| Performance | performance:2 | Additional required device profiles stay inside their budgets | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line performance:2 |
| Coverage | coverage:1 | Required viewports and seeds were run | 10 | 3 | static | node tests/lens-negative-fixtures.mjs --line coverage:1 |
| Coverage | coverage:2 | The pack names the build it came from | 10 | 3 | static | node tests/lens-negative-fixtures.mjs --line coverage:2 |

## Level anchors

### journeys:1 Opening journey completes inside the time budget

- **0**: Testers rarely finish the opening journey, or they finish well past the budget
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: p95 opening time is inside the profile budget and the completion share meets the minimum
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### journeys:2 Core journey completes on each required viewport

- **0**: The core journey is missing on a required viewport, or testers rarely finish it
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Every required viewport has a completed core journey at or above the profile share
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### scenarios:1 Planned scenarios have a trace

- **0**: Planned scenarios are missing a trace, or they fail without a record
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Every planned scenario has a trace and none are left failed without a reason
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### scenarios:2 Failed scenarios are explained or tagged as known

- **0**: Failures are left unexplained, or a known issue is not tagged
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Every failed scenario is explained or tagged as a known issue the owner already accepted
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### stability:1 Sessions stay crash-free, with errors explained

- **0**: Crashes or unexplained errors appear in the recorded sessions
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Crash-free share meets the profile minimum and every recorded error has an explanation
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### stability:2 Repeated sessions do not grow memory past the slope budget

- **0**: Memory after cleanup climbs past the profile slope across repeated sessions
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: The heap trend after cleanup stays inside the slope budget across at least five sessions
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### performance:1 Primary device frame time stays inside the owner budget

- **0**: p95 frame time on the primary device is over the owner-set budget
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: p95 frame time on the primary device is inside the owner-set budget
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### performance:2 Additional required device profiles stay inside their budgets

- **0**: A required extra device profile is missing or over its frame budget
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Every additional required device profile has samples inside its frame budget
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### coverage:1 Required viewports and seeds were run

- **0**: A required viewport or known seed was skipped
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: All required viewports and known seeds were run, and held-out seeds were run too
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### coverage:2 The pack names the build it came from

- **0**: The pack is missing a git SHA or a live SHA for the build
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: The pack records both a git SHA and a live SHA for the intended build
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.
