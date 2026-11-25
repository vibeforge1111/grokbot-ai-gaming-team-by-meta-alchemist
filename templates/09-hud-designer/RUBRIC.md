# HUD and Game UI Designer: rubric gbf-09-hud-ui-designer v1.2.0

Created by @meta_alchemist (https://x.com/meta_alchemist). The machine-readable definition is in `RUBRIC.json`.

1.0.0 to 1.1.0: anchors made game-agnostic (constants live in the game profile), lens gates added; ids, weights and passAt unchanged; 1.1.0 to 1.1.1: gameProfile generalized to your-game-profile for the public kit and hash recomputed with the documented kit algorithm (spec/RUBRIC_HASH.md); ids, weights, anchors and passAt unchanged; 1.1.1 to 1.1.2: Clarified the public rubric wording and evidence descriptions. Scoring rules and pack fields are unchanged. 1.1.2 to 1.1.3: Evidence descriptions and fixture working directories now refer to the distributed kit. 1.1.3 to 1.1.4: Empty samples and zero case counts earn U. Computed lines require the declared evidence type. The owner profile supplies the HUD coverage budget. 1.1.4 to 1.1.5: Binds contrast to elements and states, and focus and target bounds to individual actions. 1.1.5 to 1.2.0: Line, pillar and anchor wording made genre-neutral (ids, weights, conditions and pass marks unchanged); adds owner-selected not-applicable profiles no-touch, touch-only, fixed-orientation, single-language.

- Scale: 100 points. Contribution: weight * level / 4.
- Game profile: your-game-profile@1.0.0. Hash: `sha256:be3ed5b4badfd5254011e55efeab926074c12e8af7803501fae1944466f90f8d`.
- Levels 0 to 4, or U. U earns zero points and excludes the line weight from measured coverage. Record skipped execution as NOT_RUN.
- PASS, CONDITIONAL or BLOCKED is reported separately from the grade and coverage. An unresolved P0 blocks.
- Evidence: Screen captures, input checks and UI timing traces from the profiled build and devices.

## Approved profiles

- **no-touch**: No supported device uses touch. Select only after the owner approves it, before scoring. Weights: operability:1 = 20, operability:2 = 0.
- **touch-only**: Every supported device is touch only, with no keyboard or gamepad navigation. Select only after the owner approves it, before scoring. Weights: operability:1 = 0, operability:2 = 20.
- **fixed-orientation**: The game runs in one orientation and aspect ratio only. Select only after the owner approves it, before scoring. Weights: responsive-behaviour:1 = 20, responsive-behaviour:2 = 0.
- **single-language**: The release ships one language, so text expansion is not tested. Select only after the owner approves it, before scoring. Weights: measured-ui-cost:1 = 20, measured-ui-cost:2 = 0.

## Evidence populations

Each computed metric group needs a nonempty population. Use the listed sample arrays or positive integer case counts. For other groups supply a positive integer measuredCases from the capture. Empty inputs or zero measured cases earn U and zero points. A measured zero failures is valid.

- `priority`: `statesCaptured`.
- `contrast`: `pairs`.
- `cvd`: `paletteA`.
- `focus`: `hudActions`.
- `touch`: `targetPx`.
- `uiCost`: `uiMs`.
- `retryInput`: `runs`.

| Pillar | Line | Name | Weight | Pass at | Evidence | Automated gate |
|---|---|---|---|---|---|---|
| Information priority | information-priority:1 | Captures of required game states | 10 | 3 | capture | node tests/lens-negative-fixtures.mjs --line information-priority:1 |
| Information priority | information-priority:2 | String inventory | 10 | 3 | static | node tests/lens-negative-fixtures.mjs --line information-priority:2 |
| Readable game states | readable-combat-states:1 | Contrast from pack screenshots | 10 | 3 | capture | node tests/lens-negative-fixtures.mjs --line readable-combat-states:1 |
| Readable game states | readable-combat-states:2 | Colour distinction across the two tested palettes | 10 | 3 | capture | node tests/lens-negative-fixtures.mjs --line readable-combat-states:2 |
| Operability | operability:1 | Focus and navigation with keyboard or gamepad | 10 | 3 | capture | node tests/lens-negative-fixtures.mjs --line operability:1 |
| Operability | operability:2 | Touch targets | 10 | 3 | capture | node tests/lens-negative-fixtures.mjs --line operability:2 |
| Responsive behaviour | responsive-behaviour:1 | Minimum rendered text size | 10 | 3 | capture | node tests/lens-negative-fixtures.mjs --line responsive-behaviour:1 |
| Responsive behaviour | responsive-behaviour:2 | Supported orientations and aspect ratios | 10 | 3 | capture | node tests/lens-negative-fixtures.mjs --line responsive-behaviour:2 |
| Measured UI cost | measured-ui-cost:1 | UI frame cost | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line measured-ui-cost:1 |
| Measured UI cost | measured-ui-cost:2 | Text expansion | 10 | 3 | capture | node tests/lens-negative-fixtures.mjs --line measured-ui-cost:2 |

## Level anchors

### information-priority:1 Captures of required game states

- **0**: Essential information is hidden in a capture
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Essential information is visible in each state and viewport listed in the game profile
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### information-priority:2 String inventory

- **0**: No string inventory
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: A complete string inventory exists for localization readiness for the supported locales
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### readable-combat-states:1 Contrast from pack screenshots

- **0**: Contrast taken from declared theme colours (CSS, style sheets, engine theme files) or a mock scene
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Contrast is sampled from pack screenshots over real scenes; a synthetic matrix earns nothing. All approved `elementContrast` cases pass on the reviewed build.
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

Sample composited foreground and background for each element and required state. Approve the minimum separately for text, graphics and focus indicators.

Match each case in `profile.cases.elementContrast` with one row in `receipts.elementContrast` by id. Each row needs liveSha and a capture artifact ID. Required fields are element (text), state (text), foreground (color), background (color).

Cover every combination of element from profile.contrastElements, state from profile.states.

Compute `ratio` using `contrast(foreground, background)`.

- `element == case.element` caps the line at 1 on failure.
- `state == case.state` caps the line at 1 on failure.
- `ratio >= case.minimum` caps the line at 2 on failure.

### readable-combat-states:2 Colour distinction across the two tested palettes

- **0**: Essential state relies on colour alone
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Required information survives colour removal in both tested palettes
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### operability:1 Focus and navigation with keyboard or gamepad

- **0**: Focus is lost or an action is unreachable with a supported navigation input
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Focus stays visible and returns after dialogs; every supported navigation input (keyboard or gamepad) reaches every HUD action. All approved `actionBounds` cases pass on the reviewed build.
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

Record the control, input and viewport for every approved action. Capture keyboard return after a dialog and the final on-screen bounds.

Match each case in `profile.cases.actionBounds` with one row in `receipts.actionBounds` by id. Each row needs liveSha and a capture artifact ID. Required fields are control (text), input (text), viewport (text), left (count), top (count), right (positive), bottom (positive), viewportWidth (positive), viewportHeight (positive), reached (bool), focusReturned (bool).

Cover every combination of control from profile.hudControls, input from profile.hudInputs, viewport from profile.viewports.

- `control == case.control` caps the line at 1 on failure.
- `input == case.input` caps the line at 1 on failure.
- `viewport == case.viewport` caps the line at 1 on failure.
- `right > row.left` caps the line at 1 on failure.
- `bottom > row.top` caps the line at 1 on failure.
- `right <= row.viewportWidth` caps the line at 1 on failure.
- `bottom <= row.viewportHeight` caps the line at 1 on failure.
- `reached == true` caps the line at 1 on failure.
- `focusReturned == true` caps the line at 1 on failure.

### operability:2 Touch targets

- **0**: A touch target is too small to hit reliably
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Touch targets meet the agreed size on every touch device in the profile
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### responsive-behaviour:1 Minimum rendered text size

- **0**: Sampled text falls below the profile minimum
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Both layout samples meet the minimum rendered text size in the profile
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### responsive-behaviour:2 Supported orientations and aspect ratios

- **0**: A clipped action in a supported orientation or aspect ratio
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: No clipped or obscured essential action in any orientation or aspect ratio the profile lists
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### measured-ui-cost:1 UI frame cost

- **0**: UI cost exceeds allocation
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Measured UI frame time stays within the profile allocation
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### measured-ui-cost:2 Text expansion

- **0**: Expansion truncates essential text
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Layouts survive pseudo-localized text expansion
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.
