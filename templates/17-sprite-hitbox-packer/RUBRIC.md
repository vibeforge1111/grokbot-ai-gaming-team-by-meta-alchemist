# 2D Sprite Atlas & Hitbox Packer: rubric gbf-17-sprite-hitbox-packer v1.3.0

Created by @meta_alchemist (https://x.com/meta_alchemist). The machine-readable definition is in `RUBRIC.json`.

1.0.0 to 1.1.0: anchors made game-agnostic (constants live in the game profile), lens gates added; ids, weights and passAt unchanged; 1.1.0 to 1.1.1: gameProfile generalized to your-game-profile for the public kit and hash recomputed with the documented kit algorithm (spec/RUBRIC_HASH.md); ids, weights, anchors and passAt unchanged. 1.1.1 to 1.1.3: Evidence descriptions and fixture working directories now refer to the distributed kit. 1.1.3 to 1.1.4: Empty samples and zero case counts earn U. Computed lines require the declared evidence type. The profile supplies reward size, occupancy and padding targets. 1.1.4 to 1.1.5: Adds a per-combination atlas matrix, frame and pivot comparisons on the damage path, and a separate tier separation check. 1.1.5 to 1.2.0: Line, pillar and anchor wording made genre-neutral (ids, weights, conditions and pass marks unchanged); adds owner-selected not-applicable profiles no-height-layer, no-item-tiers, no-install-icons, no-hit-shapes. 1.2.0 to 1.3.0: Evidence pack names made genre-neutral (rewardArt to itemArt; maxRarityDeltaE to maxTierPaletteDeltaE; minRewardPx to minItemArtPx; rarity to tierPalette; elevation to heightLayer; damage-path to gameplay-path). Scoring, weights, conditions and pass marks unchanged; rename these fields in packs made for 1.2.0.

- Scale: 100 points. Contribution: weight * level / 4.
- Game profile: your-game-profile@1.0.0. Hash: `sha256:75bfa2006a56e06a3d5713fb9035b1a09edad21eb9fa51f3eab37008f83494e6`.
- Levels 0 to 4, or U. U earns zero points and excludes the line weight from measured coverage. Record skipped execution as NOT_RUN.
- PASS, CONDITIONAL or BLOCKED is reported separately from the grade and coverage. An unresolved P0 blocks.
- Evidence: Decoded assets, atlas samples and hit-shape overlays captured at gameplay scale.

## Approved profiles

- **no-height-layer**: The game has no height or depth layer for overlapping objects. Select only after the owner approves it, before scoring. Weights: hit-shape:1 = 20, hit-shape:2 = 0.
- **no-item-tiers**: Items have no colour tiers or rarity levels. Select only after the owner approves it, before scoring. Weights: reward-art:1 = 20, reward-art:2 = 0.
- **no-install-icons**: The game ships no installable web or app icons from this atlas; their 20 points are shared over the other lines. Select only after the owner approves it, before scoring. Weights: icons:1 = 12.5, icons:2 = 12.5, install-icons:1 = 0, install-icons:2 = 0, reward-art:1 = 12.5, reward-art:2 = 12.5, texture-weight:1 = 12.5, texture-weight:2 = 12.5, hit-shape:1 = 12.5, hit-shape:2 = 12.5.
- **no-hit-shapes**: Sprites carry no gameplay hit, collision or click shapes; their 20 points are shared over the other lines. Select only after the owner approves it, before scoring. Weights: icons:1 = 12.5, icons:2 = 12.5, install-icons:1 = 12.5, install-icons:2 = 12.5, reward-art:1 = 12.5, reward-art:2 = 12.5, texture-weight:1 = 12.5, texture-weight:2 = 12.5, hit-shape:1 = 0, hit-shape:2 = 0.

## Evidence populations

Each computed metric group needs a nonempty population. Use the listed sample arrays or positive integer case counts. For other groups supply a positive integer measuredCases from the capture. Empty inputs or zero measured cases earn U and zero points. A measured zero failures is valid.

- `icons`: `devices`.
- `atlas`: `combosRequired`, `combosChecked`.
- `install`: `urls`.
- `iconSet`: `sizesPresent`.
- `tierPalette`: `pairs`.
- `weight`: `bytesPerScene`.
- `decode`: `referenced`.
- `heightLayer`: `reproCases`.

| Pillar | Line | Name | Weight | Pass at | Evidence | Automated gate |
|---|---|---|---|---|---|---|
| Icons | icons:1 | Small icons readable at real scale | 10 | 3 | capture | node tests/lens-negative-fixtures.mjs --line icons:1 |
| Icons | icons:2 | Atlas integrity across mips and filters | 10 | 3 | capture | node tests/lens-negative-fixtures.mjs --line icons:2 |
| Install icons | install-icons:1 | Manifest and install icons resolve | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line install-icons:1 |
| Install icons | install-icons:2 | Icon set completeness | 10 | 3 | static | node tests/lens-negative-fixtures.mjs --line install-icons:2 |
| Item and tier art | reward-art:1 | Item art readable | 10 | 3 | capture | node tests/lens-negative-fixtures.mjs --line reward-art:1 |
| Item and tier art | reward-art:2 | Tier colours consistent and distinct | 10 | 3 | capture | node tests/lens-negative-fixtures.mjs --line reward-art:2 |
| Texture weight | texture-weight:1 | Asset bytes per scene | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line texture-weight:1 |
| Texture weight | texture-weight:2 | Every referenced asset decodes | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line texture-weight:2 |
| Hit shape | hit-shape:1 | Hit shapes traced to the gameplay code that uses them | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line hit-shape:1 |
| Hit shape | hit-shape:2 | Height or depth layer repro | 10 | 3 | capture | node tests/lens-negative-fixtures.mjs --line hit-shape:2 |

## Level anchors

### icons:1 Small icons readable at real scale

- **0**: Icons bleed or blur
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Small icons readable without bleed at real scale on every device
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### icons:2 Atlas integrity across mips and filters

- **0**: A tested delivery combination exhibits visible texture bleed.
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Every mip, filter and device combination checked. All approved `atlasMatrix` cases pass on the reviewed build.
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

Capture each approved device, size, filter and mip combination, including the border pixels used to count bleed.

Match each case in `profile.cases.atlasMatrix` with one row in `receipts.atlasMatrix` by id. Each row needs liveSha and a capture artifact ID. Required fields are device (text), sizePx (positive), filter (text), mip (count), bleedPixels (count).

The row count must match `metrics.atlas.combosRequired`.

Cover every combination of device from profile.devices, sizePx from profile.atlasSizes, filter from profile.atlasFilters, mip from profile.atlasMips.

- `device == case.device` caps the line at 1 on failure.
- `sizePx == case.sizePx` caps the line at 1 on failure.
- `filter == case.filter` caps the line at 1 on failure.
- `mip == case.mip` caps the line at 1 on failure.
- `bleedPixels == 0` caps the line at 0 on failure.

### install-icons:1 Manifest and install icons resolve

- **0**: An install icon fails to load in the running build
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Every icon URL resolves and decodes in the running build; a running build that lags the source is reported separately from a source failure
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### install-icons:2 Icon set completeness

- **0**: Required size missing
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: All required sizes present in the build
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### reward-art:1 Item art readable

- **0**: Item art unreadable
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Item and reward art reads at displayed size
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### reward-art:2 Tier colours consistent and distinct

- **0**: Tier art inconsistent
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Tier art matches palette rules. All approved `tierSeparation` cases pass on the reviewed build.
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

Measure separation between distinct tiers independently of same-tier colour drift.

Match each case in `profile.cases.tierSeparation` with one row in `receipts.tierSeparation` by id. Each row needs liveSha and a capture artifact ID. Required fields are first (color), second (color).

Compute `distance` using `deltaE(first, second)`.

- `distance >= profile.minTierDeltaE` caps the line at 2 on failure.

### texture-weight:1 Asset bytes per scene

- **0**: Over budget
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Texture bytes within the delivery budget
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### texture-weight:2 Every referenced asset decodes

- **0**: A referenced asset fails
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Every referenced required asset resolves and decodes in a complete build
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### hit-shape:1 Hit shapes traced to the gameplay code that uses them

- **0**: A debug or diagnostic shape is cited as gameplay logic
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Hit shape claims trace the function that resolves the interaction (damage, collision, pickup or click), not a diagnostics helper. All approved `frameColliders` cases pass on the reviewed build.
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

Match the frame and collider actually consumed by the damage path to the exported frame manifest. Frames may share pixels while retaining distinct pivots.

Match each case in `profile.cases.frameColliders` with one row in `receipts.frameColliders` by id. Each row needs liveSha and a trace artifact ID. Required fields are sourceWidth (positive), sourceHeight (positive), trimX (count), trimY (count), rotated (bool), frame (text), collider (text), pixels (sha256), pivotX (number), pivotY (number).

- `frame == case.frame` caps the line at 1 on failure.
- `collider == case.collider` caps the line at 1 on failure.
- `pixels == case.pixels` caps the line at 1 on failure.
- `pivotX == case.pivotX` caps the line at 1 on failure.
- `pivotY == case.pivotY` caps the line at 1 on failure.
- `sourceWidth == case.sourceWidth` caps the line at 1 on failure.
- `sourceHeight == case.sourceHeight` caps the line at 1 on failure.
- `trimX == case.trimX` caps the line at 1 on failure.
- `trimY == case.trimY` caps the line at 1 on failure.
- `rotated == case.rotated` caps the line at 1 on failure.

### hit-shape:2 Height or depth layer repro

- **0**: No height or depth repro
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Two objects at different heights or depths resolve by the declared model in a repro
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.
