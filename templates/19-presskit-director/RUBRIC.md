# Store Page & Presskit Director: rubric gbf-19-store-presskit-director v1.3.0

Created by @meta_alchemist (https://x.com/meta_alchemist). The machine-readable definition is in `RUBRIC.json`.

1.0.0 to 1.1.0: anchors made game-agnostic (constants live in the game profile), lens gates added; ids, weights and passAt unchanged; 1.1.0 to 1.1.1: gameProfile generalized to your-game-profile for the public kit and hash recomputed with the documented kit algorithm (spec/RUBRIC_HASH.md); ids, weights, anchors and passAt unchanged; 1.1.1 to 1.1.2: Updated the public source note. Scoring rules and pack fields are unchanged. 1.1.2 to 1.1.3: Evidence descriptions and fixture working directories now refer to the distributed kit. 1.1.3 to 1.1.4: Empty samples and zero case counts earn U. Computed lines require the declared evidence type. Check hook visibility on each viewport and the packaged archive scan. 1.1.4 to 1.1.5: Pins destination, spec and format per preview, tests post-packaging scans and links decoded media to rights receipts. 1.1.5 to 1.2.0: Line, pillar and anchor wording made genre-neutral (ids, weights, conditions and pass marks unchanged); adds owner-selected not-applicable profiles no-own-web-page. Rubric id renamed from gbf-19-steam-presskit-director. 1.2.0 to 1.3.0: Evidence pack names made genre-neutral (capsules to storeArtFormats; entrance to firstScreen; cards to linkPreviews). Scoring, weights, conditions and pass marks unchanged; rename these fields in packs made for 1.2.0.

- Scale: 100 points. Contribution: weight * level / 4.
- Game profile: your-game-profile@1.0.0. Hash: `sha256:1fe127411d0378a34102114652b4f71d4142390674aea70be8d2256c7517083a`.
- Levels 0 to 4, or U. U earns zero points and excludes the line weight from measured coverage. Record skipped execution as NOT_RUN.
- PASS, CONDITIONAL or BLOCKED is reported separately from the grade and coverage. An unresolved P0 blocks.
- Evidence: Use media from the reviewed build, decoded delivery files, destination previews and rights records.

## Approved profiles

- **no-own-web-page**: The game has no web page the owner controls; its 20 points are shared over the other lines. Select only after the owner approves it, before scoring. Weights: entrance-and-copy:1 = 12.5, entrance-and-copy:2 = 12.5, share-metadata:1 = 0, share-metadata:2 = 0, icons-and-install:1 = 12.5, icons-and-install:2 = 12.5, media:1 = 12.5, media:2 = 12.5, presskit-and-obligations:1 = 12.5, presskit-and-obligations:2 = 12.5.

## Evidence populations

Each computed metric group needs a nonempty population. Use the listed sample arrays or positive integer case counts. For other groups supply a positive integer measuredCases from the capture. Empty inputs or zero measured cases earn U and zero points. A measured zero failures is valid.

- `firstScreen`: `viewports`.
- `copy`: `features`.
- `meta`: `present`.
- `linkPreviews`: `destinationsPreviewed`.
- `icons`: `urls`.
- `storeArt`: `textPairs`.
- `media`: `items`.
- `storeArtFormats`: `formatsChecked`.
- `presskit`: `has`.
- `locClaims`: `advertisedLocales`.

| Pillar | Line | Name | Weight | Pass at | Evidence | Automated gate |
|---|---|---|---|---|---|---|
| First screen and copy | entrance-and-copy:1 | Store page first screen | 10 | 3 | capture | node tests/lens-negative-fixtures.mjs --line entrance-and-copy:1 |
| First screen and copy | entrance-and-copy:2 | Storefront hook copy | 10 | 3 | static | node tests/lens-negative-fixtures.mjs --line entrance-and-copy:2 |
| Share metadata | share-metadata:1 | Page metadata on pages you control | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line share-metadata:1 |
| Share metadata | share-metadata:2 | Link preview cards | 10 | 3 | capture | node tests/lens-negative-fixtures.mjs --line share-metadata:2 |
| Icons and install | icons-and-install:1 | Required icons load and decode | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line icons-and-install:1 |
| Icons and install | icons-and-install:2 | Contrast and legibility | 10 | 3 | capture | node tests/lens-negative-fixtures.mjs --line icons-and-install:2 |
| Media | media:1 | Screenshot and GIF readiness | 10 | 3 | capture | node tests/lens-negative-fixtures.mjs --line media:1 |
| Media | media:2 | Store art and logo formats | 10 | 3 | capture | node tests/lens-negative-fixtures.mjs --line media:2 |
| Presskit and obligations | presskit-and-obligations:1 | Presskit completeness | 10 | 3 | static | node tests/lens-negative-fixtures.mjs --line presskit-and-obligations:1 |
| Presskit and obligations | presskit-and-obligations:2 | Rights, age, privacy and support links | 10 | 3 | static | node tests/lens-negative-fixtures.mjs --line presskit-and-obligations:2 |

## Level anchors

### entrance-and-copy:1 Store page first screen

- **0**: First screen judged from documents instead of a capture
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Fresh build capture of each store page's first screen on every approved viewport. Every approved hookPreviews case passes.
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

Inspect hook visibility for each named viewport in a local or approved preview.

Match each case in `profile.cases.hookPreviews` with one row in `receipts.hookPreviews` by id. Each row needs liveSha and a capture artifact ID. Required fields are viewport (text), visible (bool), previewVersion (text).

Cover every combination of viewport from profile.viewports.

- `viewport == case.viewport` caps the line at 1 on failure.
- `previewVersion == case.previewVersion` caps the line at 1 on failure.
- `visible == true` caps the line at 1 on failure.

### entrance-and-copy:2 Storefront hook copy

- **0**: Copy claims an unverified feature
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Every advertised feature has current evidence (controller badge only after a pad capture)
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### share-metadata:1 Page metadata on pages you control

- **0**: A required tag is missing on a live page you control
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Metadata on every live page you control is complete
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### share-metadata:2 Link preview cards

- **0**: Card broken in a preview
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Cards render in real destination previews
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### icons-and-install:1 Required icons load and decode

- **0**: A required icon fails to load or decode
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Every required icon loads and decodes on the live destination
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### icons-and-install:2 Contrast and legibility

- **0**: Illegible at displayed size
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Store art text legible at displayed size
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### media:1 Screenshot and GIF readiness

- **0**: Media from an old build
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Decoded current-build media at destination sizes. All approved `decodedMedia` cases pass on the reviewed build.
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

Match the decoded media and rights reference to each final deliverable.

Match each case in `profile.cases.decodedMedia` with one row in `receipts.decodedMedia` by id. Each row needs liveSha and a capture artifact ID. Required fields are item (text), decodedBuild (text), license (artifact:static), decoded (bool).

The row count must match `metrics.media.items`.

- `item == case.item` caps the line at 1 on failure.
- `decodedBuild == pack.liveSha` caps the line at 1 on failure.
- `decoded == true` caps the line at 1 on failure.

### media:2 Store art and logo formats

- **0**: Formats from a frozen list
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Every required image format for each destination is checked against its recorded spec version, not a frozen list. All approved `destinationFormats` cases pass on the reviewed build.
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

Check each required format for each destination against its own spec version. Keep a local preview artifact for the reviewed bytes.

Match each case in `profile.cases.destinationFormats` with one row in `receipts.destinationFormats` by id. Each row needs liveSha and a capture artifact ID. Required fields are destination (text), format (text), version (text), width (positive), height (positive), safeZoneClear (bool).

The row count must match `metrics.storeArtFormats.formatsChecked`.

- `destination == case.destination` caps the line at 1 on failure.
- `format == case.format` caps the line at 1 on failure.
- `version == case.version` caps the line at 1 on failure.
- `width == case.width` caps the line at 1 on failure.
- `height == case.height` caps the line at 1 on failure.
- `safeZoneClear == true` caps the line at 1 on failure.

### presskit-and-obligations:1 Presskit completeness

- **0**: The final archive scan finds disclosed content or metadata.
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Press page, factsheet and logo pack present. All approved `archiveReview` cases pass on the reviewed build.
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

Identify the final archive by digest and count scanned members and metadata hits after extraction.

Match each case in `profile.cases.archiveReview` with one row in `receipts.archiveReview` by id. Each row needs liveSha and a static artifact ID. Required fields are finalDigest (sha256), scannedDigest (sha256), members (positive), scanned (positive), metadataHits (count), contentHits (count), reviewer (text).

- `scannedDigest == row.finalDigest` caps the line at 1 on failure.
- `scanned == row.members` caps the line at 1 on failure.
- `metadataHits == 0` caps the line at 0 on failure.
- `contentHits == 0` caps the line at 0 on failure.

### presskit-and-obligations:2 Rights, age, privacy and support links

- **0**: No rights or support record
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Rights records present; the age rating, privacy policy and support pages are linked from the published records
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.
