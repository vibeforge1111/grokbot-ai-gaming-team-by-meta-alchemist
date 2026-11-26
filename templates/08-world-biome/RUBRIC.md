# Procedural World and Biome Architect: rubric gbf-08-world-biome v0.1.0

Created by @meta_alchemist (https://x.com/meta_alchemist). The machine-readable definition is in `RUBRIC.json`.

Initial 0.1.0 preview: world and biome grades from owner-supplied evidence.

- Scale: 100 points. Contribution: weight * level / 4.
- Game profile: your-game-profile@1.0.0. Hash: `sha256:b9e0b18323b07c5a9ee35ae7f697cc728ba01c0133ff6302a1816011a3b0ec83`.
- Levels 0 to 4, or U. U earns zero points and excludes the line weight from measured coverage. Record skipped execution as NOT_RUN.
- Report the verdict and coverage beside the grade.

## Evidence populations

Each computed metric group needs a nonempty population. Use the listed sample arrays or positive integer case counts. For other groups supply a positive integer measuredCases from the capture. Empty or missing evidence earns U.


| Pillar | Line | Name | Weight | Pass at | Evidence | Automated gate |
|---|---|---|---|---|---|---|
| Seed | seed:1 | Known seeds were exported on this build | 10 | 3 | static | node tests/lens-negative-fixtures.mjs --line seed:1 |
| Seed | seed:2 | A known seed reproduces, and a held-out seed was run | 10 | 3 | static | node tests/lens-negative-fixtures.mjs --line seed:2 |
| Layout | layout:1 | Biome or region coverage has no agreed gaps | 10 | 3 | static | node tests/lens-negative-fixtures.mjs --line layout:1 |
| Layout | layout:2 | Cover or sightline gaps stay at zero | 10 | 3 | static | node tests/lens-negative-fixtures.mjs --line layout:2 |
| Traversal | traversal:1 | There are no unwalkable traps | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line traversal:1 |
| Traversal | traversal:2 | Chunk streaming stays inside the owner budget | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line traversal:2 |
| Encounters | encounters:1 | Encounter density stays inside the owner range | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line encounters:1 |
| Encounters | encounters:2 | Unfair trap spawns are zero | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line encounters:2 |
| Safety | safety:1 | Seed logs do not contain personal data | 10 | 3 | static | node tests/lens-negative-fixtures.mjs --line safety:1 |
| Safety | safety:2 | The pack names its build | 10 | 3 | static | node tests/lens-negative-fixtures.mjs --line safety:2 |

## Level anchors

### seed:1 Known seeds were exported on this build

- **0**: A known seed was skipped
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Known seeds run meet the owner-set minimum
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### seed:2 A known seed reproduces, and a held-out seed was run

- **0**: Re-running a seed changes the world, or a held-out seed was skipped
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Seed mismatches are zero and held-out seeds meet the minimum
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### layout:1 Biome or region coverage has no agreed gaps

- **0**: A required biome or region is missing or empty
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Biome or region coverage gaps are zero
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### layout:2 Cover or sightline gaps stay at zero

- **0**: Agreed cover or sightline checks fail in required spaces
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Cover or sightline gaps are zero
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### traversal:1 There are no unwalkable traps

- **0**: A player can enter a space and not leave it
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Unwalkable traps are zero
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### traversal:2 Chunk streaming stays inside the owner budget

- **0**: Streaming hitches regularly exceed the budget
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: p95 streaming hitch time is inside the owner-set budget
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### encounters:1 Encounter density stays inside the owner range

- **0**: Encounters are far too sparse or far too dense
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Encounter density is inside the owner-set low and high bounds
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### encounters:2 Unfair trap spawns are zero

- **0**: An inescapable or clearly unfair spawn was left in place
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Unfair spawns are zero
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### safety:1 Seed logs do not contain personal data

- **0**: Names, handles, or raw user ids appear in seed logs
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Personal-data leaks in seed logs are zero
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### safety:2 The pack names its build

- **0**: The pack is missing a git SHA or a live SHA
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: The pack records both a git SHA and a live SHA
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.
