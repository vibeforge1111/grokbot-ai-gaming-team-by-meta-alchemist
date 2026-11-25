# Living AI NPC and Lore Architect: rubric gbf-14-living-npc-lore v2.0.0

Created by @meta_alchemist (https://x.com/meta_alchemist). The machine-readable definition is in `RUBRIC.json`.

Replaces encounter-specific combat checks with memory, dialogue, canon and scenario evidence across expressive channels. Start a new baseline at this version.

- Scale: 100 points. Contribution: weight x level / 4.
- Game profile: Owner-approved pack.profile defines the game facts, scope and budgets. Hash: `sha256:20ef0214590da4ecbf06925c74370f0f19fcf12fb8e39816c5b0663e4c1c05c8`.
- Score the share of observed cases meeting each condition against the profile floor, pass share and target.
- Open P0s and confirmed release blockers set the grade to 0. Missing observations reduce coverage. Invalid packs have a null grade.
- Evidence: A versioned canon excerpt, a role's knowledge and memory rules, seeded case traces, dialogue captures and independent scenario readbacks.

## Evidence populations

Every line reads uniquely keyed sample rows from its own receipt. Empty lists and zero measured cases give U and earn 0 points. Fractions use all eligible observed opportunities.

- `recall`: `samples`.
- `expiry`: `samples`.
- `knowledge`: `samples`.
- `belief`: `samples`.
- `intent`: `samples`.
- `repair`: `samples`.
- `version`: `samples`.
- `reveal`: `samples`.
- `replay`: `samples`.
- `heldout`: `samples`.

## Release blockers

- A fact remained available after a mandatory forgetting boundary. (`memory:2`).
- An NPC disclosed a fact outside its allowed knowledge. (`viewpoint:1`).
- A gated canon fact appeared before its prerequisite. (`canon:2`).

| Pillar | Line | Name | Weight | Pass at | Evidence | Automated gate |
|---|---|---|---|---|---|---|
| Memory | memory:1 | Permitted memory recalled | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line memory:1 |
| Memory | memory:2 | Expired memory stays forgotten | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line memory:2 |
| Viewpoint | viewpoint:1 | Unseen information stays private to the scene | 10 | 3 | capture | node tests/lens-negative-fixtures.mjs --line viewpoint:1 |
| Viewpoint | viewpoint:2 | Character belief follows its source | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line viewpoint:2 |
| Dialogue | dialogue:1 | Response addresses the current intent | 10 | 3 | capture | node tests/lens-negative-fixtures.mjs --line dialogue:1 |
| Dialogue | dialogue:2 | Unknown intent has a usable fallback | 10 | 3 | capture | node tests/lens-negative-fixtures.mjs --line dialogue:2 |
| Canon | canon:1 | Claims match active canon | 10 | 3 | static | node tests/lens-negative-fixtures.mjs --line canon:1 |
| Canon | canon:2 | Reveal follows its prerequisite | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line canon:2 |
| Review | review:1 | Seeded replay preserves response meaning | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line review:1 |
| Review | review:2 | Held-out response is understood | 10 | 3 | capture | node tests/lens-negative-fixtures.mjs --line review:2 |

## Level anchors

### memory:1 Permitted memory recalled

- **0**: No measured case meets this condition: the recall key matches the permitted event in the case history.
- **1**: Some cases meet the condition, below the profile floor.
- **2**: The observed share reaches the floor and falls short of the pass share.
- **3**: The observed share reaches the pass share and falls short of the target.
- **4**: At least the target share of cases shows this outcome: the recall key matches the permitted event in the case history.
- **U**: UNMEASURED. The receipt, population, required observation or approved budget is missing, stale or unusable.

### memory:2 Expired memory stays forgotten

- **0**: No measured case meets this condition: a forgotten or reset fact cannot be recalled beyond its boundary.
- **1**: Some cases meet the condition, below the profile floor.
- **2**: The observed share reaches the floor and falls short of the pass share.
- **3**: The observed share reaches the pass share and falls short of the target.
- **4**: At least the target share of cases shows this outcome: a forgotten or reset fact cannot be recalled beyond its boundary.
- **U**: UNMEASURED. The receipt, population, required observation or approved budget is missing, stale or unusable.

### viewpoint:1 Unseen information stays private to the scene

- **0**: No measured case meets this condition: the response withholds a fact the NPC has no allowed way to know.
- **1**: Some cases meet the condition, below the profile floor.
- **2**: The observed share reaches the floor and falls short of the pass share.
- **3**: The observed share reaches the pass share and falls short of the target.
- **4**: At least the target share of cases shows this outcome: the response withholds a fact the NPC has no allowed way to know.
- **U**: UNMEASURED. The receipt, population, required observation or approved budget is missing, stale or unusable.

### viewpoint:2 Character belief follows its source

- **0**: No measured case meets this condition: the assertion follows the speaker's documented belief or exception.
- **1**: Some cases meet the condition, below the profile floor.
- **2**: The observed share reaches the floor and falls short of the pass share.
- **3**: The observed share reaches the pass share and falls short of the target.
- **4**: At least the target share of cases shows this outcome: the assertion follows the speaker's documented belief or exception.
- **U**: UNMEASURED. The receipt, population, required observation or approved budget is missing, stale or unusable.

### dialogue:1 Response addresses the current intent

- **0**: No measured case meets this condition: the response conveys the expected meaning for this intent and state.
- **1**: Some cases meet the condition, below the profile floor.
- **2**: The observed share reaches the floor and falls short of the pass share.
- **3**: The observed share reaches the pass share and falls short of the target.
- **4**: At least the target share of cases shows this outcome: the response conveys the expected meaning for this intent and state.
- **U**: UNMEASURED. The receipt, population, required observation or approved budget is missing, stale or unusable.

### dialogue:2 Unknown intent has a usable fallback

- **0**: No measured case meets this condition: an unsupported input reaches the approved recovery choice.
- **1**: Some cases meet the condition, below the profile floor.
- **2**: The observed share reaches the floor and falls short of the pass share.
- **3**: The observed share reaches the pass share and falls short of the target.
- **4**: At least the target share of cases shows this outcome: an unsupported input reaches the approved recovery choice.
- **U**: UNMEASURED. The receipt, population, required observation or approved budget is missing, stale or unusable.

### canon:1 Claims match active canon

- **0**: No measured case meets this condition: the assertion matches the active canon entry for this scene.
- **1**: Some cases meet the condition, below the profile floor.
- **2**: The observed share reaches the floor and falls short of the pass share.
- **3**: The observed share reaches the pass share and falls short of the target.
- **4**: At least the target share of cases shows this outcome: the assertion matches the active canon entry for this scene.
- **U**: UNMEASURED. The receipt, population, required observation or approved budget is missing, stale or unusable.

### canon:2 Reveal follows its prerequisite

- **0**: No measured case meets this condition: the fact is revealed only in a state where its prerequisite holds.
- **1**: Some cases meet the condition, below the profile floor.
- **2**: The observed share reaches the floor and falls short of the pass share.
- **3**: The observed share reaches the pass share and falls short of the target.
- **4**: At least the target share of cases shows this outcome: the fact is revealed only in a state where its prerequisite holds.
- **U**: UNMEASURED. The receipt, population, required observation or approved budget is missing, stale or unusable.

### review:1 Seeded replay preserves response meaning

- **0**: No measured case meets this condition: two runs of a known case preserve the required response meaning.
- **1**: Some cases meet the condition, below the profile floor.
- **2**: The observed share reaches the floor and falls short of the pass share.
- **3**: The observed share reaches the pass share and falls short of the target.
- **4**: At least the target share of cases shows this outcome: two runs of a known case preserve the required response meaning.
- **U**: UNMEASURED. The receipt, population, required observation or approved budget is missing, stale or unusable.

### review:2 Held-out response is understood

- **0**: No measured case meets this condition: the reviewer independently identifies the intended meaning on a held-out case.
- **1**: Some cases meet the condition, below the profile floor.
- **2**: The observed share reaches the floor and falls short of the pass share.
- **3**: The observed share reaches the pass share and falls short of the target.
- **4**: At least the target share of cases shows this outcome: the reviewer independently identifies the intended meaning on a held-out case.
- **U**: UNMEASURED. The receipt, population, required observation or approved budget is missing, stale or unusable.
