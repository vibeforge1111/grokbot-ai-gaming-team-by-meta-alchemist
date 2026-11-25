# Prop & Rig Director: rubric gbf-03-procedural-rig-crafter v1.3.0

Created by @meta_alchemist (https://x.com/meta_alchemist). The machine-readable definition is in `RUBRIC.json`.

1.0.0 to 1.1.0: anchors made game-agnostic (constants live in the game profile), lens gates added; ids, weights and passAt unchanged; 1.1.0 to 1.1.1: gameProfile generalized to your-game-profile for the public kit and hash recomputed with the documented kit algorithm (spec/RUBRIC_HASH.md); ids, weights, anchors and passAt unchanged; 1.1.1 to 1.1.2: Public frame-budget wording now reflects the device profile. Scoring rules and pack fields are unchanged. 1.1.2 to 1.1.3: Evidence descriptions and fixture working directories now refer to the distributed kit. 1.1.3 to 1.1.4: Empty samples and zero case counts earn U. Computed lines require the declared evidence type. Seed repeatability requires two runs. The owner profile supplies the pose and slope coverage. 1.1.4 to 1.1.5: Adds per-view overlap measurements, clip and pose coverage and independently identified repeat exports. 1.1.5 to 1.2.0: Line, pillar and anchor wording made genre-neutral (ids, weights, conditions and pass marks unchanged); adds owner-selected not-applicable profiles static-props. 1.2.0 to 1.3.0: Evidence pack names made genre-neutral (weaponSilhouette to attachedPropSilhouette; aim-up to reach-up; aim-down to reach-down). Scoring, weights, conditions and pass marks unchanged; rename these fields in packs made for 1.2.0.

- Scale: 100 points. Contribution: weight * level / 4.
- Game profile: your-game-profile@1.0.0. Hash: `sha256:18c7a65ccec58d7330a34fbfba8716afa4e2b84871a78a8cb61283515dafbb3a`.
- Levels 0 to 4, or U. U earns zero points and excludes the line weight from measured coverage. Record skipped execution as NOT_RUN.
- PASS, CONDITIONAL or BLOCKED is reported separately from the grade and coverage. An unresolved P0 blocks.
- Evidence: Gameplay-camera captures, collider overlays, art references and render measurements for the target build.

## Approved profiles

- **static-props**: Props are never held, attached or animated through extreme poses. Select only after the owner approves it, before scoring. Weights: silhouette:1 = 20, silhouette:2 = 0, animation-and-weapon-clearance:1 = 0, animation-and-weapon-clearance:2 = 20.

## Evidence populations

Each computed metric group needs a nonempty population. Use the listed sample arrays or positive integer case counts. For other groups supply a positive integer measuredCases from the capture. Empty inputs or zero measured cases earn U and zero points. A measured zero failures is valid.

- `silhouette`: `viewports`.
- `attachedPropSilhouette`: `extremesChecked`.
- `clearance`: `posesChecked`.
- `grounding`: `footGapCm`.
- `colliders`: `iou`.
- `probe`: `msPerFrame`.
- `scene`: `frameMs`.
- `artRef`: `paletteDeltaE`.
- `variation`: `sameSeedHashes`.
- `animation`: `clipsChecked`.

| Pillar | Line | Name | Weight | Pass at | Evidence | Automated gate |
|---|---|---|---|---|---|---|
| Silhouette | silhouette:1 | Readable silhouettes at the gameplay camera | 10 | 3 | capture | node tests/lens-negative-fixtures.mjs --line silhouette:1 |
| Silhouette | silhouette:2 | Held or attached prop silhouette at extreme poses | 10 | 3 | capture | node tests/lens-negative-fixtures.mjs --line silhouette:2 |
| Animation and attachment clearance | animation-and-weapon-clearance:1 | Clip capture of extreme poses | 10 | 3 | capture | node tests/lens-negative-fixtures.mjs --line animation-and-weapon-clearance:1 |
| Animation and attachment clearance | animation-and-weapon-clearance:2 | Grounding on slopes | 10 | 3 | capture | node tests/lens-negative-fixtures.mjs --line animation-and-weapon-clearance:2 |
| Collider agreement | collider-agreement:1 | Visible shape vs collision shape overlay | 10 | 3 | capture | node tests/lens-negative-fixtures.mjs --line collider-agreement:1 |
| Collider agreement | collider-agreement:2 | Floor probe cost | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line collider-agreement:2 |
| Scene budget | scene-budget:1 | Full-scene draw and CPU cost | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line scene-budget:1 |
| Scene budget | scene-budget:2 | LOD transitions | 10 | 3 | capture | node tests/lens-negative-fixtures.mjs --line scene-budget:2 |
| Visual consistency | visual-consistency:1 | One current art reference | 10 | 3 | capture | node tests/lens-negative-fixtures.mjs --line visual-consistency:1 |
| Visual consistency | visual-consistency:2 | Reproducible variation | 10 | 3 | static | node tests/lens-negative-fixtures.mjs --line visual-consistency:2 |

## Level anchors

### silhouette:1 Readable silhouettes at the gameplay camera

- **0**: An asset cannot be identified at the gameplay camera
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Players can distinguish the required assets at the gameplay camera distances and sizes in the profile
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### silhouette:2 Held or attached prop silhouette at extreme poses

- **0**: A prop disappears or is mistaken for another
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Held or attached props remain identifiable at the extremes of their motion in recorded clips
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### animation-and-weapon-clearance:1 Clip capture of extreme poses

- **0**: Visible clipping in a clip capture
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Attached geometry stays clear of the animated body across the agreed extreme poses. All approved `poseSweep` cases pass on the reviewed build.
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

Capture maximum penetration for every approved clip and pose.

Match each case in `profile.cases.poseSweep` with one row in `receipts.poseSweep` by id. Each row needs liveSha and a capture artifact ID. Required fields are clip (text), pose (text), depthCm (number).

The row count must match `metrics.clearance.posesChecked`.

- `clip == case.clip` caps the line at 1 on failure.
- `pose == case.pose` caps the line at 1 on failure.
- `depthCm <= profile.maxPenetrationCm` caps the line at 2 on failure.

### animation-and-weapon-clearance:2 Grounding on slopes

- **0**: Feet float or sink on a slope in a capture
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Grounding stays correct on slopes and during cheap animation ticks. Every approved slopeContacts case passes.
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

Measure the foot or base gap on every approved slope and cite the captured support surface.

Match each case in `profile.cases.slopeContacts` with one row in `receipts.slopeContacts` by id. Each row needs liveSha and a capture artifact ID. Required fields are slopeDeg (number), gapCm (number), surface (text).

Cover every combination of slopeDeg from profile.requiredSlopesDeg.

- `slopeDeg == case.slopeDeg` caps the line at 1 on failure.
- `gapCm <= profile.maxFootGapCm` caps the line at 2 on failure.

### collider-agreement:1 Visible shape vs collision shape overlay

- **0**: The collision shape visibly disagrees with the rendered body
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Rendered and collision shapes meet approved tolerances in an overlay capture. All approved `colliderViews` cases pass on the reviewed build.
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

Identify the asset, overlay view and toolchain version for each turntable sample. Measure silhouette intersection and union areas in the same pixel space.

Match each case in `profile.cases.colliderViews` with one row in `receipts.colliderViews` by id. Each row needs liveSha and a capture artifact ID. Required fields are asset (text), view (text), tool (text), intersection (count), union (positive).

The row count must match `metrics.colliders.iou`.

Compute `iou` using `ratio(intersection, union)`.

- `asset == case.asset` caps the line at 1 on failure.
- `view == case.view` caps the line at 1 on failure.
- `tool == case.tool` caps the line at 1 on failure.
- `intersection <= row.union` caps the line at 1 on failure.
- `iou >= profile.minColliderIoU` caps the line at 2 on failure.

### collider-agreement:2 Floor probe cost

- **0**: Floor probe cost exceeds its allocation in a trace
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Floor probe cost (the traced probe function) is measured per frame and within its allocation
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### scene-budget:1 Full-scene draw and CPU cost

- **0**: A representative full scene breaks the budget
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Representative scenes meet frame-time and draw-call budgets in the target device profile
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### scene-budget:2 LOD transitions

- **0**: Visible LOD popping in a capture
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: LOD transitions show no popping at gameplay distances
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### visual-consistency:1 One current art reference

- **0**: The art reference is out of date (camera, palette or scale) and assets no longer match it
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Characters, props and scenery match the current camera, palette and scale reference in a contact sheet
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### visual-consistency:2 Reproducible variation

- **0**: The same seed produces different geometry in two independent export runs.
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Decorative variation is reproducible from a seed where capture reproducibility is required. All approved `seedRuns` cases pass on the reviewed build.
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

Repeat the same seed with a fresh exporter run and compare the output geometry digests.

Match each case in `profile.cases.seedRuns` with one row in `receipts.seedRuns` by id. Each row needs liveSha and a static artifact ID. Required fields are firstRun (text), repeatRun (text), seed (text), repeatSeed (text), mesh (sha256), repeatMesh (sha256).

- `firstRun != row.repeatRun` caps the line at 1 on failure.
- `seed == row.repeatSeed` caps the line at 1 on failure.
- `mesh == row.repeatMesh` caps the line at 0 on failure.
