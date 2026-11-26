# Game Clipmaker: rubric gbf-30-game-clipmaker v0.1.0

Created by @meta_alchemist (https://x.com/meta_alchemist). The machine-readable definition is in `RUBRIC.json`.

Initial 0.1.0 preview: clipmaker grades from owner-supplied evidence.

- Scale: 100 points. Contribution: weight * level / 4.
- Game profile: your-game-profile@1.0.0. Hash: `sha256:ce332ebd6a68f3866e1dd896fd3383520b3bdb6d26db5f72e1e81720c9b766f2`.
- Levels 0 to 4, or U. U earns zero points and excludes the line weight from measured coverage. Record skipped execution as NOT_RUN.
- Report the verdict and coverage beside the grade.

## Evidence populations

Each computed metric group needs a nonempty population. Use the listed sample arrays or positive integer case counts. For other groups supply a positive integer measuredCases from the capture. Empty or missing evidence earns U.


| Pillar | Line | Name | Weight | Pass at | Evidence | Automated gate |
|---|---|---|---|---|---|---|
| Detection | detection:1 | Peak moments meet the owner minimum | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line detection:1 |
| Detection | detection:2 | The clip list is ranked | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line detection:2 |
| Timing | timing:1 | Clip durations stay inside the owner range | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line timing:1 |
| Timing | timing:2 | Overlapping clips are zero | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line timing:2 |
| Clarity | clarity:1 | Listed clips are watchable without missing context | 10 | 3 | static | node tests/lens-negative-fixtures.mjs --line clarity:1 |
| Clarity | clarity:2 | Required redaction was applied | 10 | 3 | static | node tests/lens-negative-fixtures.mjs --line clarity:2 |
| Rights | rights:1 | Rights notes are present | 10 | 3 | static | node tests/lens-negative-fixtures.mjs --line rights:1 |
| Rights | rights:2 | Each clip names the source build | 10 | 3 | static | node tests/lens-negative-fixtures.mjs --line rights:2 |
| Safety | safety:1 | The run did not upload or post anything | 10 | 3 | static | node tests/lens-negative-fixtures.mjs --line safety:1 |
| Safety | safety:2 | The pack names its build | 10 | 3 | static | node tests/lens-negative-fixtures.mjs --line safety:2 |

## Level anchors

### detection:1 Peak moments meet the owner minimum

- **0**: Too few peak moments were listed
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Listed peak moments meet the owner-set minimum
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### detection:2 The clip list is ranked

- **0**: The clip list has no rank or priority order
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: The clip list is ranked in priority order
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### timing:1 Clip durations stay inside the owner range

- **0**: Clips are far shorter or far longer than the agreed range
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Every listed duration is inside the owner-set range, in seconds
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### timing:2 Overlapping clips are zero

- **0**: Clips overlap in a way the owner did not accept
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Overlapping clips are zero
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### clarity:1 Listed clips are watchable without missing context

- **0**: A listed clip cannot be understood without missing context
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Unwatchable clips are zero
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### clarity:2 Required redaction was applied

- **0**: HUD, chat, or other UI the owner asked to hide is still visible
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Redaction misses are zero
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### rights:1 Rights notes are present

- **0**: Required rights notes are missing
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Missing rights notes are zero
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### rights:2 Each clip names the source build

- **0**: A clip is missing its source build
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Every clip names its source build
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### safety:1 The run did not upload or post anything

- **0**: The run uploaded or posted a clip
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Uploads and posts from this run are zero
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### safety:2 The pack names its build

- **0**: The pack is missing a git SHA or a live SHA
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: The pack records both a git SHA and a live SHA
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.
