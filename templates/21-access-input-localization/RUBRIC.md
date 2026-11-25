# Access, Input and Localization QA: rubric gbf-21-access-input-localization v1.2.0

Created by @meta_alchemist (https://x.com/meta_alchemist). The machine-readable definition is in `RUBRIC.json`.

1.0.0 to 1.1.0: anchors made game-agnostic (constants live in the game profile), lens gates added; ids, weights and passAt unchanged; 1.1.0 to 1.1.1: gameProfile generalized to your-game-profile for the public kit and hash recomputed with the documented kit algorithm (spec/RUBRIC_HASH.md); ids, weights, anchors and passAt unchanged; 1.1.1 to 1.1.2: Clarified the public rubric wording and evidence descriptions. Scoring rules and pack fields are unchanged. 1.1.2 to 1.1.3: Evidence descriptions and fixture working directories now refer to the distributed kit. 1.1.3 to 1.1.4: Empty samples and zero case counts earn U. Computed lines require the declared evidence type. Measured release blockers override the numerical grade. Check every required device/task pair and the string inventory guard. 1.1.4 to 1.1.5: Adds event-level caption timing, paired device motion, build guard output and locale-specific glyph and truncation evidence. 1.1.5 to 1.2.0: Line, pillar and anchor wording made genre-neutral (ids, weights, conditions and pass marks unchanged); adds owner-selected not-applicable profiles single-input.

- Scale: 100 points. Contribution: weight * level / 4.
- Game profile: your-game-profile@1.0.0. Hash: `sha256:6f75de48ce38d716710d749e86779f290245f33b76e9800faf86ad9a8bf8f593`.
- Levels 0 to 4, or U. U earns zero points and excludes the line weight from measured coverage. Record skipped execution as NOT_RUN.
- PASS, CONDITIONAL or BLOCKED is reported separately from the grade and coverage. An unresolved P0 blocks. Each confirmed release blocker sets verdict BLOCKED and grade 0. Supported points, coverage and the evidence interval retain their uncapped values. Unmeasured safety evidence prevents PASS.
- Evidence: Input traces, accessibility settings, string inventories and captures from the supported locales.

## Approved profiles

- **single-language**: For a single-language release, score the string inventory. Use the default profile when additional locales enter scope. Weights: localization-readiness:1 = 20, localization-readiness:2 = 0.
- **single-input**: The game supports one input method, so there is nothing to remap or switch. Select only after the owner approves it, before scoring. Weights: input:1 = 20, input:2 = 0.

## Evidence populations

Each computed metric group needs a nonempty population. Use the listed sample arrays or positive integer case counts. For other groups supply a positive integer measuredCases from the capture. Empty inputs or zero measured cases earn U and zero points. A measured zero failures is valid.

- `journey`: `devicesPassed`.
- `text`: `pairs`.
- `colour`: `palette`.
- `captions`: `requiredCues`.
- `motion`: `promisedReductions`.

## Release blockers

- Flashing above the approved safety limit blocks release. (`motion-and-flash-comfort:2`).

| Pillar | Line | Name | Weight | Pass at | Evidence | Automated gate |
|---|---|---|---|---|---|---|
| Input | input:1 | Required tasks across supported inputs | 10 | 3 | capture | node tests/lens-negative-fixtures.mjs --line input:1 |
| Input | input:2 | Remapping, prompts and device switching | 10 | 3 | capture | node tests/lens-negative-fixtures.mjs --line input:2 |
| Readability | readability:1 | Text size and contrast over real scenes | 10 | 3 | capture | node tests/lens-negative-fixtures.mjs --line readability:1 |
| Readability | readability:2 | Meaning without colour | 10 | 3 | capture | node tests/lens-negative-fixtures.mjs --line readability:2 |
| Captions and assistive info | captions-and-assistive-info:1 | Caption event log | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line captions-and-assistive-info:1 |
| Captions and assistive info | captions-and-assistive-info:2 | Menus and error messages | 10 | 3 | capture | node tests/lens-negative-fixtures.mjs --line captions-and-assistive-info:2 |
| Motion and flash comfort | motion-and-flash-comfort:1 | Reduced motion respected everywhere | 10 | 3 | capture | node tests/lens-negative-fixtures.mjs --line motion-and-flash-comfort:1 |
| Motion and flash comfort | motion-and-flash-comfort:2 | Flash safety and hold/toggle alternatives | 10 | 3 | capture | node tests/lens-negative-fixtures.mjs --line motion-and-flash-comfort:2 |
| Localization readiness | localization-readiness:1 | String inventory | 10 | 3 | static | node tests/lens-negative-fixtures.mjs --line localization-readiness:1 |
| Localization readiness | localization-readiness:2 | Locale tests (N/A under the single-language profile) | 10 | 3 | capture | node tests/lens-negative-fixtures.mjs --line localization-readiness:2 |

## Level anchors

### input:1 Required tasks across supported inputs

- **0**: A mandatory action is unreachable on a supported device
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Captures show the profile's tasks completed with the supported inputs
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### input:2 Remapping, prompts and device switching

- **0**: Prompts wrong or no remapping
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Remapping works, prompts switch with the device, disconnect and focus recover. Every approved navigationRecovery case passes.
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

Run each approved task and device through remapping, disconnect recovery and focus restoration.

Match each case in `profile.cases.navigationRecovery` with one row in `receipts.navigationRecovery` by id. Each row needs liveSha and a capture artifact ID. Required fields are device (text), task (text), remapped (bool), recovered (bool), focusRestored (bool).

Cover every combination of device from profile.devices, task from profile.journeyTasks.

- `device == case.device` caps the line at 1 on failure.
- `task == case.task` caps the line at 1 on failure.
- `remapped == true` caps the line at 1 on failure.
- `recovered == true` caps the line at 1 on failure.
- `focusRestored == true` caps the line at 1 on failure.

### readability:1 Text size and contrast over real scenes

- **0**: Text below floor, or contrast taken from style values instead of the rendered frame
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Captured text sizes and contrast meet the game profile on its supported viewports
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### readability:2 Meaning without colour

- **0**: Meaning relies on colour alone
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Essential states remain distinguishable with colour removed
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### captions-and-assistive-info:1 Caption event log

- **0**: An observed event is paired with a different caption.
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Every required sound cue has a caption, checked event by event. All approved `cueMatches` cases pass on the reviewed build.
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

Compare each required event and caption identity and measure their absolute onset difference.

Match each case in `profile.cases.cueMatches` with one row in `receipts.cueMatches` by id. Each row needs liveSha and a trace artifact ID. Required fields are event (text), caption (text), eventMs (count), captionMs (count).

The row count must match `metrics.captions.requiredCues`.

Compute `offsetMs` using `absdiff(eventMs, captionMs)`.

- `event == case.event` caps the line at 1 on failure.
- `caption == case.caption` caps the line at 0 on failure.
- `offsetMs <= profile.maxCaptionOffsetMs` caps the line at 2 on failure.

### captions-and-assistive-info:2 Menus and error messages

- **0**: A menu cannot be used with one of the supported inputs
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Menus are navigable and errors understandable
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### motion-and-flash-comfort:1 Reduced motion respected everywhere

- **0**: A reduction is ignored
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Every promised reduction applies in paired captures. All approved `motionPairs` cases pass on the reviewed build.
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

Pair normal and reduced recordings of the same scenario and device. Compare the promised effect with its approved limit.

Match each case in `profile.cases.motionPairs` with one row in `receipts.motionPairs` by id. Each row needs liveSha and a capture artifact ID. Required fields are scenario (text), normalDevice (text), reducedDevice (text), normalScenario (text), reducedArtifact (artifact:capture), normalAmplitude (number), reducedAmplitude (number).

Cover every combination of normalDevice from profile.devices, scenario from profile.motionScenarios.

- `scenario == case.scenario` caps the line at 1 on failure.
- `normalDevice == case.device` caps the line at 1 on failure.
- `reducedDevice == row.normalDevice` caps the line at 1 on failure.
- `normalScenario == row.scenario` caps the line at 1 on failure.
- `reducedAmplitude <= case.maxAmplitude` caps the line at 2 on failure.

### motion-and-flash-comfort:2 Flash safety and hold/toggle alternatives

- **0**: Dangerous flash confirmed (blocks release)
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: No dangerous flashing; hold and toggle alternatives exist
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### localization-readiness:1 String inventory

- **0**: No inventory
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: The inventory is complete, but an executed build guard accepts the planted string.
- **4**: Complete inventory with hard-coded strings listed and a recorded guard run rejecting a newly introduced string. All approved `stringGuard` cases pass on the reviewed build.
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

Retain the build guard output for the planted hard-coded string. An executed guard accepting the string limits the complete inventory to level 3.

Match each case in `profile.cases.stringGuard` with one row in `receipts.stringGuard` by id. Each row needs liveSha and a static artifact ID. Required fields are planted (text), rejected (bool), guardOutput (artifact:static).

- `rejected == true` caps the line at 3 on failure.

### localization-readiness:2 Locale tests (N/A under the single-language profile)

- **0**: Truncation or broken layout in a supported locale
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Pseudo-locale and supported-locale captures pass; this line is N/A under the single-language profile. All approved `localeCaptures` cases pass on the reviewed build.
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

Record essential-string truncation, glyph misses and the font for each approved locale and viewport.

Match each case in `profile.cases.localeCaptures` with one row in `receipts.localeCaptures` by id. Each row needs liveSha and a capture artifact ID. Required fields are locale (text), viewport (text), font (text), truncations (count), missingGlyphs (count).

Cover every combination of locale from profile.reviewLocales, viewport from profile.localeViewports.

- `locale == case.locale` caps the line at 1 on failure.
- `viewport == case.viewport` caps the line at 1 on failure.
- `truncations == 0` caps the line at 2 on failure.
- `missingGlyphs == 0` caps the line at 2 on failure.
