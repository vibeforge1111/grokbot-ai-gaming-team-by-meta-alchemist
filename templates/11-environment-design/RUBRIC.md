# Environment Design Director: rubric gbf-11-environment-design v1.2.0

Created by @meta_alchemist (https://x.com/meta_alchemist). The machine-readable definition is in `RUBRIC.json`.

1.0.0 to 1.1.0: anchors made game-agnostic (constants live in the game profile), lens gates added; ids, weights and passAt unchanged; 1.1.0 to 1.1.1: gameProfile generalized to your-game-profile for the public kit and hash recomputed with the documented kit algorithm (spec/RUBRIC_HASH.md); ids, weights, anchors and passAt unchanged; 1.1.1 to 1.1.2: Clarified the public rubric wording and evidence descriptions. Scoring rules and pack fields are unchanged. 1.1.2 to 1.1.3: Evidence descriptions and fixture working directories now refer to the distributed kit. 1.1.3 to 1.1.4: Empty samples and zero case counts earn U. Computed lines require the declared evidence type. 1.1.4 to 1.1.5: Uses approved overlay states, landmark device and versioned sightline receipts. 1.1.5 to 1.2.0: Line, pillar and anchor wording made genre-neutral (ids, weights, conditions and pass marks unchanged); adds owner-selected not-applicable profiles no-location-overlays.

- Scale: 100 points. Contribution: weight * level / 4.
- Game profile: your-game-profile@1.0.0. Hash: `sha256:c39d308c9db01955615bd3b3f3d8345e033fe243539837526c93c7210ace45a6`.
- Levels 0 to 4, or U. U earns zero points and excludes the line weight from measured coverage. Record skipped execution as NOT_RUN.
- PASS, CONDITIONAL or BLOCKED is reported separately from the grade and coverage. An unresolved P0 blocks.
- Evidence: Route captures, shared sightline probes and the current environment art reference.

## Approved profiles

- **no-location-overlays**: The game shows no location names or area cards over play. Select only after the owner approves it, before scoring. Weights: visual-navigation:1 = 20, visual-navigation:2 = 0.

## Evidence populations

Each computed metric group needs a nonempty population. Use the listed sample arrays or positive integer case counts. For other groups supply a positive integer measuredCases from the capture. Empty inputs or zero measured cases earn U and zero points. A measured zero failures is valid.

- `landmarks`: `landmarksChecked`.
- `occlusionProbe`: `probesRun`.
- `occlusion`: `routes`.
- `consistency`: `devices`.

| Pillar | Line | Name | Weight | Pass at | Evidence | Automated gate |
|---|---|---|---|---|---|---|
| Visual navigation | visual-navigation:1 | Landmarks at the approved minimum display size | 10 | 3 | capture | node tests/lens-negative-fixtures.mjs --line visual-navigation:1 |
| Visual navigation | visual-navigation:2 | Location overlays respect critical gameplay | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line visual-navigation:2 |
| Scene composition | scene-composition:1 | Bright, dark and crowded states | 10 | 3 | capture | Judged |
| Scene composition | scene-composition:2 | Prop hierarchy | 10 | 3 | capture | Judged |
| Camera occlusion | camera-occlusion:1 | Shared level-design sightline test | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line camera-occlusion:1 |
| Camera occlusion | camera-occlusion:2 | Occlusion overlays | 10 | 3 | capture | node tests/lens-negative-fixtures.mjs --line camera-occlusion:2 |
| Usable objects and routes | traversal-affordance:1 | Usable objects vs decoration readable | 10 | 3 | capture | Judged |
| Usable objects and routes | traversal-affordance:2 | Route clips | 10 | 3 | capture | Judged |
| Environment consistency | environment-consistency:1 | Art reference match | 10 | 3 | capture | Judged |
| Environment consistency | environment-consistency:2 | Cross-device consistency | 10 | 3 | capture | node tests/lens-negative-fixtures.mjs --line environment-consistency:2 |

## Level anchors

### visual-navigation:1 Landmarks at the approved minimum display size

- **0**: Landmarks unreadable at the approved minimum display size
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Landmarks remain identifiable at the approved minimum display size.
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### visual-navigation:2 Location overlays respect critical gameplay

- **0**: Overlays obscure the required cue in a profile state.
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Observe every approved overlay state with no unexpected overlays.
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### scene-composition:1 Bright, dark and crowded states

- **0**: A scene state obscures the action
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Composition reads in bright, dark and crowded captures
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### scene-composition:2 Prop hierarchy

- **0**: Props obscure the intended focal point
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Prop hierarchy guides the eye in route clips
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### camera-occlusion:1 Shared level-design sightline test

- **0**: A separate untested sightline claim
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: The same versioned sightline trace records world visibility and environment cue occlusion on each approved route. Every approved sightlines case passes.
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

Use a sightline-v1 trace containing the world ray and environment cue result for the same seed, route, camera and build. Both consumers can cite this artifact.

Match each case in `profile.cases.sightlines` with one row in `receipts.sightlines` by id. Each row needs liveSha and a trace artifact ID. Required fields are schema (text), seed (text), route (text), camera (text), rayVisible (bool), expectedVisible (bool), cueOccludedFrames (count).

- `schema == sightline-v1` caps the line at 1 on failure.
- `seed == case.seed` caps the line at 1 on failure.
- `route == case.route` caps the line at 1 on failure.
- `camera == case.camera` caps the line at 1 on failure.
- `expectedVisible == case.expectedVisible` caps the line at 1 on failure.
- `rayVisible == row.expectedVisible` caps the line at 1 on failure.
- `cueOccludedFrames <= profile.maxOccludedCueFrames` caps the line at 1 on failure.

### camera-occlusion:2 Occlusion overlays

- **0**: A needed cue hidden by scenery
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Camera obstruction never hides a needed cue (target, hazard, goal or opponent) on test routes
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### traversal-affordance:1 Usable objects vs decoration readable

- **0**: Decoration reads as usable
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Players can tell usable or walkable objects from decoration
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### traversal-affordance:2 Route clips

- **0**: No route evidence
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Annotated route clips show affordances at player height and camera angle
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### environment-consistency:1 Art reference match

- **0**: Environment diverges from the reference
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Environment, props and materials match the project’s current art reference
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### environment-consistency:2 Cross-device consistency

- **0**: The smallest supported display loses environment meaning
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Environment meaning stays consistent across the supported displays.
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.
