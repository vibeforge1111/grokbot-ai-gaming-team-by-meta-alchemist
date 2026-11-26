# Gaussian Splat Cleaner: rubric gbf-16-gaussian-splat-cleaner v0.1.0

Created by @meta_alchemist (https://x.com/meta_alchemist). The machine-readable definition is in `RUBRIC.json`.

Initial 0.1.0 preview: splat cleaner grades from owner-supplied evidence.

- Scale: 100 points. Contribution: weight * level / 4.
- Game profile: your-game-profile@1.0.0. Hash: `sha256:bc5790843ff55127ce8aac98e20a4c8923803e6db26477ef1fc3891a6a59dc65`.
- Levels 0 to 4, or U. U earns zero points and excludes the line weight from measured coverage. Record skipped execution as NOT_RUN.
- Report the verdict and coverage beside the grade.

## Evidence populations

Each computed metric group needs a nonempty population. Use the listed sample arrays or positive integer case counts. For other groups supply a positive integer measuredCases from the capture. Empty or missing evidence earns U.


| Pillar | Line | Name | Weight | Pass at | Evidence | Automated gate |
|---|---|---|---|---|---|---|
| Cleanup | cleanup:1 | Remaining floaters or outliers are zero | 10 | 3 | static | node tests/lens-negative-fixtures.mjs --line cleanup:1 |
| Cleanup | cleanup:2 | A before and after pair was reviewed | 10 | 3 | static | node tests/lens-negative-fixtures.mjs --line cleanup:2 |
| Continuity | continuity:1 | Seam or surface breaks are zero | 10 | 3 | static | node tests/lens-negative-fixtures.mjs --line continuity:1 |
| Continuity | continuity:2 | The cleaned file still matches the same capture identity | 10 | 3 | static | node tests/lens-negative-fixtures.mjs --line continuity:2 |
| Budget | budget:1 | Splat count stays inside the owner budget | 10 | 3 | static | node tests/lens-negative-fixtures.mjs --line budget:1 |
| Budget | budget:2 | A count or memory figure was actually measured | 10 | 3 | static | node tests/lens-negative-fixtures.mjs --line budget:2 |
| Navigation | navigation:1 | Walkable holes in the proxy are zero | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line navigation:1 |
| Navigation | navigation:2 | A proxy or nav mesh was produced and reviewed | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line navigation:2 |
| Safety | safety:1 | The source capture was not overwritten | 10 | 3 | static | node tests/lens-negative-fixtures.mjs --line safety:1 |
| Safety | safety:2 | The pack names its build, and metadata has no personal data | 10 | 3 | static | node tests/lens-negative-fixtures.mjs --line safety:2 |

## Level anchors

### cleanup:1 Remaining floaters or outliers are zero

- **0**: Floaters or outliers remain in the cleaned capture
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Remaining floaters or outliers are zero
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### cleanup:2 A before and after pair was reviewed

- **0**: There is no before and after pair for the same capture
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: A before and after pair for the same capture was reviewed
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### continuity:1 Seam or surface breaks are zero

- **0**: Visible seams or surface breaks remain after cleanup
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Seam or surface breaks are zero
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### continuity:2 The cleaned file still matches the same capture identity

- **0**: The after file cannot be tied to the same capture as the before file
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: The after file is tied to the same capture identity as the before file
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### budget:1 Splat count stays inside the owner budget

- **0**: Splat count is far past the budget
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Splat count is inside the owner-set maximum
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### budget:2 A count or memory figure was actually measured

- **0**: No count or memory figure was recorded
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: A splat count or memory figure was measured
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### navigation:1 Walkable holes in the proxy are zero

- **0**: The proxy has holes a player can fall through
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Walkable holes in the proxy are zero
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### navigation:2 A proxy or nav mesh was produced and reviewed

- **0**: No proxy or nav mesh was produced or reviewed
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: A proxy or nav mesh was produced and reviewed
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### safety:1 The source capture was not overwritten

- **0**: The source capture was overwritten in place
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Source overwrites are zero
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### safety:2 The pack names its build, and metadata has no personal data

- **0**: The pack is missing a build id, or metadata contains personal data
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: The pack records git and live SHAs, and personal-data leaks are zero
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.
