# Template spec v1

Created by @meta_alchemist (https://x.com/meta_alchemist).

A template is one folder under `templates/<NN-slug>/`. `npm run validate` checks every rule below. The JSON schemas are next to this file.

## Folder layout

```
templates/18-bug-desk-triage/
  template.json        kit manifest (spec/template.schema.json): identity, version, status, team fields
  CHANGELOG.md         Keep a Changelog history; newest release equals template.json version
  recipe.json          Grok Bot bot template (spec/recipe.schema.json)
  HOW-TO-USE.md        install options A, B, C; stage; inputs; outputs; handoffs
  PROMPTS.md           setup, routine, audit, polish loop and judge prompts
  MEMORY.md            the memory facts, one per bullet
  README.md            engine reference: what each rubric line reads
  RUBRIC.json          frozen 100-point rubric (spec/rubric.schema.json)
  RUBRIC.md            human table of the rubric, carries the hash
  skills/<name>/SKILL.md   one folder per skill (docs/SKILL_FORMAT.md)
  engine/lens.mjs      data only lens spec for this rubric
  engine/lens-kit.mjs  shared engine, byte identical to shared/lens-kit/lens-kit.mjs
  engine/team-memory.mjs  shared team memory helper, byte identical to shared/team-memory/team-memory.mjs
  engine/ENGINE.json   commands
  fixtures/good-pack.json   synthetic worked example (synthetic: true)
  fixtures/mutations.json   negative and missing-input cases
  tests/test-lens-contract.mjs
  tests/lens-negative-fixtures.mjs
```

## Identity

- `id`: `<prefix>-<NN>-<slug>`, for example `gbf-18-bug-desk-triage`. Prefix is yours (the included templates use `gbf`). Same id in `template.json`, `RUBRIC.json` and `engine/lens.mjs`.
- `slug` equals the folder name.
- Credit: `@meta_alchemist` and `https://x.com/meta_alchemist` in `template.json`, `RUBRIC.json`, the recipe description and every skill. If you fork and change a template, add your own credit beside it; do not remove the original.

## Version, status and team fields

| Field | Rule |
|---|---|
| `version` | Semantic version of the template ([../docs/VERSIONING.md](../docs/VERSIONING.md)). Shipping templates are 1.0.0 or above; previews stay below 1.0.0. |
| `status` | `shipping`, or `preview` for a template that works and passes its tests but is not yet held to the release standard. A preview's README starts with "Status: preview, not shipping" and lists what it needs. A preview may keep its own vendored engine; the validator reports its version. |
| `shortName` | The short name used in the team map and catalog. |
| `teamSpec` | The team spec version the template follows (the artifact folder layout, the memory format and these fields). |
| `compat` | `teamSpec` range, and `consumes`: one version range per consumed artifact. |
| `produces[]` | `artifact`, `version`, `format`, `schema` (a file in `spec/artifacts/`). |
| `consumes[]` | `artifact`, `required`, `schema`, optional `whenMissing`. Only the owner's `game-profile` and `evidence-pack` may be required, so every template works alone. |
| `memory` | `reads` and `writes`: shared memory topics ([../docs/SHARED-MEMORY.md](../docs/SHARED-MEMORY.md)). A template appends only to the topics it writes. |

`npm run team` regenerates [../docs/TEAM-MAP.md](../docs/TEAM-MAP.md), the "Team inputs and outputs" block in each getting-started skill and `HOW-TO-USE.md`, and the TEAM memory fact. `npm run compat` checks every pair of templates that exchanges artifacts.

## recipe.json (the Grok Bot template)

| Field | Rule |
|---|---|
| `version` | `1` |
| `visibility` | `public` or `private` |
| `profile` | `name`, `description` (states the 100-point rubric and the credit), `avatarShape`, `avatarColor` |
| `gettingStarted.skill` | name of a skill in `skills` that ends in `-getting-started` |
| `skills[]` | `name`, `description`, `content` (the full SKILL.md). Each one also exists on disk at `skills/<name>/SKILL.md`, byte for byte |
| `memory[]` | `kind`, `content`; 3 to 12 facts; one carries the audit contract |
| `routines[]` | at least one; `slug`, `name`, `description`, `content` (the routine prompt) |
| `plugins[]` | connectors the bot needs; may be empty |

A `*-lens-engine` skill embeds `engine/lens-kit.mjs`, `engine/lens.mjs` and `engine/team-memory.mjs` byte for byte, so a bot installed from a share link can write the engine and the memory helper to disk without this repo.

`npm run build-recipe -- templates/<slug>` rebuilds `recipe.json` from the folder (skills, `memory.json`, `routines.json`, `profile.json`) for starter-derived templates. For the distributed templates it reads the existing recipe settings, the data spec in `engine/lens.mjs` and the skills on disk. The builder regenerates the rubric Markdown, hash, manifest, engine and fixture copies in both layouts.

## Rubric

See [../docs/RUBRIC_GUIDE.md](../docs/RUBRIC_GUIDE.md). Enforced: 5 pillars of 20 points, 10 lines, weights sum to 100 and to 20 per pillar, anchors for levels 0 to 4 and U, `passAt` 3, every automated gate names a negative fixture, and the hash recomputes ([RUBRIC_HASH.md](RUBRIC_HASH.md)).

## Engine contract

- `node engine/lens.mjs <pack.json>` prints one grade record: `templateId`, `rubricVersion`, `rubricHash`, `packId`, `gitSha`, `liveSha`, per line `level` and `findings`, `supportedPoints`, `coverage`, `grade`, `verdict` (PASS, CONDITIONAL, BLOCKED, INVALID).
- A pack that is missing, not `VALID`, or lacks `liveSha`, `gitSha` or `packId` is refused: verdict INVALID, grade null.
- Computed lines read `pack.metrics.<group>`; each group names an artifact id in `pack.artifacts`. A group with different sources by line may use `artifactsByLine[lineId]`. Each line must cite the required kind and a nonempty sample. See `--meta` for population fields. Other groups require a positive integer `measuredCases`. Old scalar-only summaries without a count earn U until recaptured.
- Templates 20, 21 and 22 declare release blockers in the hashed rubric. A measured blocker sets the grade to zero and the verdict to BLOCKED. Supported points, interval and coverage still describe the underlying evidence. A missing safety observation prevents PASS.
- Judged lines accept `pack.judgements[lineId]` only with evidence ids that exist in the pack.
- Thresholds come only from `pack.profile`.

## Docs

- `HOW-TO-USE.md` covers Option A (share link, `pending review` until published), Option B (manual) and Option C (other agents), and names the getting-started skill.
- `PROMPTS.md` has sections `## 1. Setup`, `## 2. Routine prompts`, `## 3. Audit prompts`.

## Text rules

No em or en dashes. No local machine paths. No secrets, private hostnames, ids, wallet addresses, crypto promotion, personal handles or launch dates (`npm run scrub`).

## Live evidence

Run the lens with the real pack file in its evidence directory. The CLI verifies local files on every real grade. For the JavaScript API, pass the evidence directory as the fourth argument to `grade(lens, pack, profileOverride, directory)`. Keep synthetic examples explicitly labelled with `synthetic: true`.

Each artifact needs an ID, kind, relative file path and bare hexadecimal SHA-256 of its bytes. Keep files inside the pack directory. Missing, changed or out-of-directory artifacts invalidate the pack. A missing optional case or stale line receipt gives U.

The producer writes a `producerReceipt` with these fields.

| Field | Content |
|---|---|
| schema | `game-evidence-v1` |
| producer, profileId | Evidence producer and versioned owner-approved profile |
| packId, gitSha, liveSha | Reviewed pack, source build and running build |
| hook, device, gameplayArtifact | Observed game event, device and manifested capture or trace ID |
| artifactsSha256 | Digest of the ordered artifact manifest |
| profileSha256 | Digest of the effective profile including the case inventories |
| observationsSha256 | Digest of the JSON array `[metrics, receipts, judgements, populations, openP0]`, using an empty object for absent collections and zero for an absent openP0 |

Compute each JSON digest over compact UTF-8 JSON with object keys sorted recursively and array order preserved. The receipt binds declared inputs to local bytes. The owner verifies the producer identity and whether the measurements describe the intended build.

For a rubric with case receipts, approve the case IDs and expected values in `profile.cases` before capture. Store the corresponding results in `receipts`. Each row needs the same case ID, the running build ID in `liveSha`, and an `artifact` of the line's evidence kind. Record skipped execution as NOT_RUN. The generated rubric and `--meta` list additional fields, comparisons, observable populations and profile dimensions. When a safety rule confirms a violation, the record retains the case and artifact ID even if another case is incomplete.

## Versioning

Changing a rubric line, weight or anchor is a new rubric version with a `migration` note and a new hash. Engine kit changes bump `KIT_VERSION` in `lens-kit.mjs` and are copied to every shipping template (`engine/lens-kit.mjs` must equal `shared/lens-kit/lens-kit.mjs`). Template versions, artifact versions and the team spec follow [../docs/VERSIONING.md](../docs/VERSIONING.md); a breaking change needs a major template version, which the tests enforce.
