# Studio Director: rubric gbf-29-studio-director v0.1.0

Created by @meta_alchemist (https://x.com/meta_alchemist). The machine-readable definition is in `RUBRIC.json`.

Initial 0.1.0 preview: studio grades from owner-supplied evidence.

- Scale: 100 points. Contribution: weight * level / 4.
- Game profile: your-game-profile@1.0.0. Hash: `sha256:95c433ab89b6bb9eb8b5fcdedca04d4d155aa68af4da2573b50103967cad1eb4`.
- Levels 0 to 4, or U. U earns zero points and excludes the line weight from measured coverage. Record skipped execution as NOT_RUN.
- Report the verdict and coverage beside the grade.

## Evidence populations

Each computed metric group needs a nonempty population. Use the listed sample arrays or positive integer case counts. For other groups supply a positive integer measuredCases from the capture. Empty or missing evidence earns U.


| Pillar | Line | Name | Weight | Pass at | Evidence | Automated gate |
|---|---|---|---|---|---|---|
| Continuity | continuity:1 | Continuity breaks are zero | 10 | 3 | static | node tests/lens-negative-fixtures.mjs --line continuity:1 |
| Continuity | continuity:2 | Character or location identity was checked | 10 | 3 | static | node tests/lens-negative-fixtures.mjs --line continuity:2 |
| Coverage | coverage:1 | Required story beats are covered | 10 | 3 | static | node tests/lens-negative-fixtures.mjs --line coverage:1 |
| Coverage | coverage:2 | The shot or stills list is complete | 10 | 3 | static | node tests/lens-negative-fixtures.mjs --line coverage:2 |
| Pace | pace:1 | Planned runtime stays inside the owner range | 10 | 3 | static | node tests/lens-negative-fixtures.mjs --line pace:1 |
| Pace | pace:2 | Unplanned black or empty holds are zero | 10 | 3 | static | node tests/lens-negative-fixtures.mjs --line pace:2 |
| Rights | rights:1 | Rights or clearance notes are present | 10 | 3 | static | node tests/lens-negative-fixtures.mjs --line rights:1 |
| Rights | rights:2 | A credits pass is in the plan | 10 | 3 | static | node tests/lens-negative-fixtures.mjs --line rights:2 |
| Safety | safety:1 | The run did not publish or upload anything | 10 | 3 | static | node tests/lens-negative-fixtures.mjs --line safety:1 |
| Safety | safety:2 | The pack names its build | 10 | 3 | static | node tests/lens-negative-fixtures.mjs --line safety:2 |

## Level anchors

### continuity:1 Continuity breaks are zero

- **0**: Character, location, or time breaks appear in the plan
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Continuity breaks are zero
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### continuity:2 Character or location identity was checked

- **0**: No character or location identity check was done
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Character or location identity was checked
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### coverage:1 Required story beats are covered

- **0**: A required story beat has no planned shot or still
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Missing required beats are zero, and the beat count meets the minimum
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### coverage:2 The shot or stills list is complete

- **0**: Planned shots are missing a source or a still
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Every planned shot has a source or a still
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### pace:1 Planned runtime stays inside the owner range

- **0**: Planned runtime is far outside the agreed range
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Planned runtime is inside the owner-set range, in seconds
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### pace:2 Unplanned black or empty holds are zero

- **0**: The plan includes black or empty holds the owner did not ask for
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Unplanned black or empty holds are zero
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### rights:1 Rights or clearance notes are present

- **0**: Required rights or clearance notes are missing
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Missing rights or clearance notes are zero
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### rights:2 A credits pass is in the plan

- **0**: No credits pass is planned
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: A credits pass is in the plan
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### safety:1 The run did not publish or upload anything

- **0**: The run published, posted, or uploaded a file
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Publishes, posts, and uploads from this run are zero
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### safety:2 The pack names its build

- **0**: The pack is missing a git SHA or a live SHA
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: The pack records both a git SHA and a live SHA
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.
