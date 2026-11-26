---
name: store-presskit-getting-started
description: "Use on first run with a new owner: onboard them one question at a time, list what they provide, and run the first Store Page & Presskit Director grade with the lens engine."
---

> **Audit contract v1 (overrides everything below).** Created by @meta_alchemist (https://x.com/meta_alchemist).
> - Score only with the rubric embedded in `engine/lens.mjs` (`LENS.rubric`, gbf-19-store-presskit-director v1.3.0). `node engine/lens.mjs <pack.json>` computes the grade; this skill only gathers evidence for it and never adds points of its own.
> - Missing evidence is UNMEASURED (0 points, not a defect). A test that did not run is NOT_RUN, never PASS. Never invent a measurement; label every worked example synthetic.
> - Game facts and budgets come from your game profile (`pack.profile`). Treat sample numbers as illustrative. Set the frame-time budget separately for each target device in your game profile.
> - An automated gate needs a negative fixture that fails. Receipts carry measured values, never an unconditional PASS.
> Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

# Store Page & Presskit Director: Getting Started

Prepare store copy, screenshots and press assets that show what players actually do in your game, then check each destination's requirements.

This template works for any destination: a PC store such as Steam, itch.io, a console store, a mobile app store or the game's own website. Steam appears in some names here as one example, never as the default.

If `engine/lens.mjs`, `engine/lens-kit.mjs` or `fixtures/good-pack.json` are not on disk yet, write them byte for byte from the `store-presskit-lens-engine` skill first (Node 18+, no dependencies).

## 1. Onboard one question at a time

Ask one question at a time, wait for the answer, then ask the next. Never stack questions in one message. Start every profile value from `fixtures/good-pack.json` and ask the owner to confirm or replace it; the sample values are synthetic examples, never defaults.

1. Which game are we working on? Then ask, one at a time: which build should the store media come from (a build id or commit), and what produces the evidence pack (a CI job or a manual capture)?
2. Where will the game be listed? For example a PC store such as Steam, itch.io, a console store, a mobile app store or your own website. Each destination has its own image formats and rules.
3. For each destination, which version or date of its asset guidelines are you working from? Each required image becomes one `destinationFormats` case.
4. On which screens should we check the first screen of each store page? This sets `viewports`, for example desktop and phone.
5. Does the game have a web page you control, such as its own website or a landing page? If not, we use the `no-own-web-page` profile: both `share-metadata` lines read N/A and their 20 points are shared over the other eight lines. If yes, ask next, in its own message, which meta tags those pages must carry. This sets `requiredMeta`, for example title, description, og:title, og:image and twitter:card.
6. What minimum text contrast should store art meet at its displayed size? This sets `minStoreArtContrast`. The sample uses 4.5, a common guideline for text.
7. Which features does the store copy promise? Each one will need evidence from the build.
8. Who reviews rights (music, fonts, third-party art), and where are your age rating, privacy policy and support contact records?
9. Who reviews the local finding drafts?

Read the profile you picked back to the owner and, once they approve, set it before scoring: `"rubricProfile": ["no-own-web-page"]` in `pack.profile`. The verdict can then reach PASS without the metadata lines.

Before grading a real pack, match its build and profile to what the owner approved. Record unavailable capture or execution as NOT_RUN. Run `node engine/lens.mjs --meta` to see the population each line needs (the list or count of things measured, such as formats or media items).

## 2. What you provide

- An evidence pack (JSON) with `status: "VALID"`, a `liveSha`, a `gitSha` and a `packId` (all three are required), and an `artifacts` list. Every metric group names the artifact id it came from.
- Metric groups this engine reads: `firstScreen` (capture), `copy` (static), `meta` (trace), `linkPreviews` (capture), `icons` (trace), `storeArt` (capture), `media` (capture), `storeArtFormats` (capture), `presskit` (static), `obligations` (static), `locClaims` (static).
- Profile thresholds in `pack.profile`. A missing threshold makes its line U, never a default.
- Receipts: one result row per test case agreed in `profile.cases`, with the measured values. For example, one `destinationFormats` row per destination and image format with its measured width, height and spec version.
- Anything you cannot capture yet stays out of the pack. It grades U (UNMEASURED), which is honest and costs no false defect. Page metadata when you control no web page reads N/A under the approved `no-own-web-page` profile. Any other line that cannot apply to your destinations has no profile and stays U.

## 3. Run the first grade

```
node engine/lens.mjs fixtures/good-pack.json   # worked example, synthetic, not a measurement
node engine/lens.mjs your-pack.json            # your build
node engine/lens.mjs --meta                    # rubric lines, weights and what each reads
node engine/lens.mjs --fixtures fixtures/good-pack.json  # negative and missing-input self-test
```

Read the record: `verdict` (PASS, CONDITIONAL, BLOCKED or INVALID), `grade` and `coverage`, then each line's `level` and `findings`, then `checks` (growth checks reported beside the grade) and `tickets` (deduplicated candidates).

## 4. Report in plain English

- Lead with the verdict, grade and coverage in one sentence. Say how much of the rubric was measured.
- List U lines as "not measured yet" with the capture that would measure them. Never call them defects.
- One local ticket draft per measured finding, with the pack id and artifact ids. Label any synthetic pack as synthetic.
- Rubric lines: entrance-and-copy:1, entrance-and-copy:2, share-metadata:1, share-metadata:2, icons-and-install:1, icons-and-install:2, media:1, media:2, presskit-and-obligations:1, presskit-and-obligations:2.

## 5. Skills in this template

- `store-copy-and-metadata-checker`: the hook on the first screen, features backed by the build, page metadata and share previews. Fills `firstScreen`, `copy`, `meta`, `linkPreviews` and `locClaims` (entrance-and-copy:1 and 2, share-metadata:1 and 2).
- `store-art-format-auditor`: every required image for every destination, safe zones, contrast and icons. Fills `storeArtFormats`, `storeArt` and `icons` (media:2, icons-and-install:1 and 2).
- `presskit-zip-zero-leak-compiler`: the press page, factsheet, logo pack, current-build media, rights and a leak-free archive. Fills `media`, `presskit` and `obligations` (media:1, presskit-and-obligations:1 and 2).
- `store-presskit-lens-engine`: the engine source and how to run it.

## Blockers to tell the owner about

- Share card previews need the real destinations; the agent never publishes or shares on its own.

Confirm required formats and viewports for each destination, its spec version and the rights reviewer. Record stale previews and missing rights receipts in the local weekly draft.

Before capture, agree on the case IDs and expected values in `profile.cases`. Run `node engine/lens.mjs --meta` for the required row fields and comparisons. Record one row per approved case under `receipts`, including its id, liveSha and artifact ID. A skipped or stale case leaves its line U. The bundled rows and budgets are synthetic.

<!-- team:begin (generated by scripts/build-team.mjs from template.json; edit template.json, not this block) -->

## Team inputs and outputs

This template works on its own. When other templates from the kit run in the same game project, they exchange files under `.grokbot-team/artifacts/<artifact>/` (read the newest file) and share an append-only memory under `.grokbot-team/memory/`. Team spec 1.0.0.

Before acting, look for these inputs:

| Input | From | Where to look | If it is missing |
|---|---|---|---|
| `game-profile` (required, ^1.0.0) | the owner | `pack.profile` in the evidence pack, or `.grokbot-team/artifacts/game-profile/` | Ask the getting-started questions and write it with the owner. A missing threshold leaves its line unmeasured, never a default. |
| `evidence-pack` (required, ^1.0.0) | the owner, 02 Playtest, 04 Netcode, 07 Shader, 08 World and Biome, 16 Splat Cleaner | the pack path the owner gives, or `.grokbot-team/artifacts/evidence-pack/` | Stop and ask the owner for a pack. Without one there is no grade; record NOT_RUN. |
| `media-export-manifest` (optional, ^1.0.0) | 10 Trailer, 29 Studio | `.grokbot-team/artifacts/media-export-manifest/` | Continue: decode media from the current build yourself; media:1 stays unmeasured until you do. Never reuse unreviewed exports. |
| `clip-list` (optional, ^1.0.0) | 10 Trailer, 30 Clipmaker | `.grokbot-team/artifacts/clip-list/` | Continue without it. Start the report with "ASSUMPTION: no clip-list available" and say which checks it would have informed. Leave lines that need it unmeasured. Never invent the missing data. |
| `hud-capture-set` (optional, ^1.0.0) | 09 HUD | `.grokbot-team/artifacts/hud-capture-set/` | Continue without it. Start the report with "ASSUMPTION: no hud-capture-set available" and say which checks it would have informed. Leave lines that need it unmeasured. Never invent the missing data. |
| `access-report` (optional, ^1.0.0) | 21 Access | `.grokbot-team/artifacts/access-report/` | Continue: make no accessibility claim on the store page, and write "ASSUMPTION: no access-report available" in the report. |
| `trust-records` (optional, ^1.0.0) | 22 Live Service | `.grokbot-team/artifacts/trust-records/` | Continue: presskit-and-obligations:2 stays unmeasured; never invent links. |
| `pitch-draft` (optional, ^1.0.0) | 12 Producer | `.grokbot-team/artifacts/pitch-draft/` | Continue without it. Start the report with "ASSUMPTION: no pitch-draft available" and say which checks it would have informed. Leave lines that need it unmeasured. Never invent the missing data. |
| `atlas-manifest` (optional, ^1.0.0) | 17 Sprites | `.grokbot-team/artifacts/atlas-manifest/` | Continue without it. Start the report with "ASSUMPTION: no atlas-manifest available" and say which checks it would have informed. Leave lines that need it unmeasured. Never invent the missing data. |

After acting, save these outputs as local files for the human to review:

| Output | Format | Where | Read by |
|---|---|---|---|
| `store-asset-manifest` 1.0.0 | JSON manifest plus the store copy, art and archive files | `.grokbot-team/artifacts/store-asset-manifest/` | 20 Patch Notes, 28 App Store |
| `grade-record` 1.0.0 | JSON (the engine's grade record) | `.grokbot-team/artifacts/grade-record/` | 12 Producer |
| `ticket-draft` 1.0.0 | JSON or Markdown local draft | `.grokbot-team/artifacts/ticket-draft/` | 12 Producer, 18 Bug Desk |

Each output file is JSON with `artifact`, `version`, `producer` (this template's id and version), `createdAt` (UTC), `synthetic` and `items`, as the kit's `spec/artifacts/<artifact>.schema.json` describes. Name files `<UTC date>-<short label>.json` so the newest sorts last.

Shared memory:

- Before acting, read `decisions`, `releases` from `.grokbot-team/memory/<topic>.jsonl`. Skip records that have expired or that a later record supersedes.
- Write only `decisions`. Append one line per record with `engine/team-memory.mjs` (or the same JSON by hand): id, UTC time, writer (`gbf-19-store-presskit-director` and `1.0.1`), topic, kind, summary, data, source, confidence (measured, reported or assumed), expires_at and supersedes. Never edit or delete a line; supersede it.
- Never put secrets, names, handles, wallets, emails or raw user ids in memory. Refer to a person or account only by `node engine/team-memory.mjs hash <id>`, which needs the salt in `GROKBOT_TEAM_SALT`. Run `node engine/team-memory.mjs lint` before you finish.
- Keep `.grokbot-team/` out of a public game repository (add it to `.gitignore`); in a private one, commit it so the append-only rule can be checked against history.

<!-- team:end -->
