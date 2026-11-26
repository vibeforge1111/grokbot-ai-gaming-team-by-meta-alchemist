---
name: prop-rig-getting-started
description: "Use on first run with a new owner: onboard them one question at a time, list what they provide, and run the first Prop & Rig Director grade with the lens engine."
---

> **Audit contract v1 (overrides everything below).** Created by @meta_alchemist (https://x.com/meta_alchemist).
> - Score only with the rubric embedded in `engine/lens.mjs` (`LENS.rubric`, gbf-03-procedural-rig-crafter v1.3.0). `node engine/lens.mjs <pack.json>` computes the grade; this skill only gathers evidence for it and never adds points of its own.
> - Missing evidence is UNMEASURED (0 points, not a defect). A test that did not run is NOT_RUN, never PASS. Never invent a measurement; label every worked example synthetic.
> - Game facts and budgets come from your game profile (`pack.profile`). Treat sample numbers as illustrative. Set the frame-time budget separately for each target device in your game profile.
> - An automated gate needs a negative fixture that fails. Receipts carry measured values, never an unconditional PASS.
> Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

# Prop & Rig Director: Getting Started

Build and optimize props and rigs for your runtime. Compare their appearance, animation and collision shapes with your art and performance targets.

A prop is any modelled object in the game world: furniture, vehicles, plants, tools, creatures, buildings, doors, crates or held items. A rig is the set of joints that lets a prop or character animate. This template is for 3D assets (including 3D models in a 2D-looking game). For flat 2D sprites, use the 2D Sprite Atlas & Hitbox Packer template (17) instead.

If `engine/lens.mjs`, `engine/lens-kit.mjs` or `fixtures/good-pack.json` are not on disk yet, write them byte for byte from the `prop-rig-lens-engine` skill first (Node 18+, no dependencies).

## 1. Onboard one question at a time

Ask one question at a time, wait for the answer, then ask the next. Never stack questions in one message. Give no setup steps until question 2 is answered.

1. Which game are we reviewing, and which kinds of props does it need (for example furniture, vehicles, plants, tools, creatures, buildings or held items)? After the answer, ask for the build to review (a build ID, commit or version), then ask where the evidence will come from (a CI job, an editor script or manual captures).
2. Which engine and asset pipeline do you use today? For example Unity, Unreal, Godot, Blender exporting FBX or glTF, or Three.js with glTF. Use only the matching pipeline from now on. If there is no pipeline yet, ask the owner to pick one; do not install tools or change project settings on your own.
3. Do any props attach to an animated character or move through extreme poses (a held tool, a backpack, a saddle, a swinging door)? If none do, we use the `static-props` profile: `silhouette:2` (held prop at extreme poses) and `animation-and-weapon-clearance:1` (pose clipping) read N/A, not U and not defects, and their partner lines take each pillar's 20 points.
4. Do props or characters stand on slopes or uneven ground? If all walkable ground is flat, the profile can list only `0` in `requiredSlopesDeg`.
5. How closely must a collision shape match the visible model, and how deep may one part pass into another before it counts as clipping? (These set `minColliderIoU` and `maxPenetrationCm`.)
6. Which art reference is current (a file name or version), so palette and scale checks compare against the right one?
7. Which values go in the rest of your game profile (`pack.profile`)? Start from the synthetic profile in `fixtures/good-pack.json` and go through the other keys in the table below one at a time. Confirm or replace each value; never keep a sample number without the owner saying so.
8. Who reviews the local finding drafts?

| Profile key | What it means |
|---|---|
| `minSilhouetteContrast` | Lowest contrast allowed between a prop's outline and the background behind it at the gameplay camera. |
| `minSilhouettePx` | Smallest on-screen height, in pixels, at which a prop must still be recognisable. |
| `viewports` | The screens you check, for example `desktop` and `phone`. |
| `requiredExtremes` | The extreme poses where a held prop must stay recognisable, for example reach up, crouch or turn. |
| `maxPenetrationCm`, `minimumPoses` | Deepest allowed overlap between an attached part and the body, and how many poses must be checked. |
| `maxFootGapCm`, `requiredSlopesDeg` | Largest allowed gap between a foot or base and the ground, and which slope angles to test. |
| `minColliderIoU` | Minimum overlap between the collision shape and the visible shape. IoU (intersection over union) runs from 0 to 1; 1 is a perfect match. |
| `floorProbeBudgetMs` | Time allowed per frame for the ground check (the ray or shape cast that finds the floor under a character or prop). |
| `frameP95BudgetMs`, `maxDrawCalls` | Frame time that 95 percent of frames must beat, and the draw-call limit, on the target device. |
| `maxLodSwapsPerSecond` | How often a model may switch between levels of detail (LOD, simpler versions shown far away). |
| `maxPaletteDeltaE` | Largest colour difference allowed against the art reference. DeltaE is a standard colour distance; about 2 is barely visible. |

Read the profile pick back to the owner and, once they approve, set it before scoring: `"rubricProfile": ["static-props"]` in `pack.profile`. With every other line at level 3 or more the verdict can then be PASS. Name the profile next to the grade.

Distances are in centimetres of world space. Convert from your engine's units (by convention 1 Unity or Godot unit is 1 metre and 1 Unreal unit is 1 centimetre; glTF uses metres).

Before grading a real pack, check that its build and profile match what the owner chose. Record a capture or run that could not happen as NOT_RUN. Each line needs a sample population (the list of measured cases it reads); `node engine/lens.mjs --meta` lists them.

## 2. What you provide

- An evidence pack (JSON) with `status: "VALID"`, a `liveSha` (the build that was running when you captured), a `gitSha` (the source commit) and a `packId` (all three are required), and an `artifacts` list. Every metric group names the artifact id it came from.
- Metric groups this engine reads: `silhouette` (capture), `attachedPropSilhouette` (capture; the engine's name for any held or attached prop), `clearance` (capture), `grounding` (capture), `colliders` (capture), `probe` (trace), `scene` (trace), `lod` (capture), `artRef` (capture), `variation` (static), `animation` (capture).
- Profile thresholds in `pack.profile`. A missing threshold makes its line U, never a default.
- Anything you cannot capture yet stays out of the pack. It grades U (UNMEASURED), which is honest and costs no false defect. With `static-props` approved, leave `attachedPropSilhouette`, `clearance` and `receipts.poseSweep` out; those lines read N/A. Any other line your game does not need has no profile: leave it out and tell the owner it stays U.

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
- Rubric lines: silhouette:1, silhouette:2, animation-and-weapon-clearance:1, animation-and-weapon-clearance:2, collider-agreement:1, collider-agreement:2, scene-budget:1, scene-budget:2, visual-consistency:1, visual-consistency:2. The words "weapon" and "equipped" in some line names cover any held or attached prop.

## 5. Skills in this template

- `procedural-prop-builder`: Build a prop or rig from art references in your engine, with reproducible variation and measurable clearance.
- `asset-lod-and-compression-pipeline`: Make simpler and smaller versions of a 3D asset for your target devices and check that its look, animation and collision still match the original.
- `turntable-collider-proof`: Use after building a prop or rig: prove its collision shape matches the visible model from every angle and that clearance and grounding hold in real poses.
- `entry-scene-optional-interactions`: If your game has a title, menu or hub scene with decorative objects, design optional reactions for them and check that players can still find and use the main action.
- `prop-rig-lens-engine`: the engine source and how to run it.

## Blockers to tell the owner about

- Silhouette and palette numbers need captures from your gameplay camera; the worked example is synthetic.

With only a design reference and no build, draft the capture plan locally and mark the runtime checks NOT_RUN.

Before capture, agree on the test cases in `profile.cases`: for example each collider view, each clip and pose, and each slope, with its case id and expected values. After capture, `receipts` holds one measured row per case with the case id, the `liveSha` of the build that ran, the artifact id and the measured values. Run `node engine/lens.mjs --meta` for the required row fields and comparisons. A skipped or stale case leaves its line U. The bundled rows and budgets are synthetic.

<!-- team:begin (generated by scripts/build-team.mjs from template.json; edit template.json, not this block) -->

## Team inputs and outputs

This template works on its own. When other templates from the kit run in the same game project, they exchange files under `.grokbot-team/artifacts/<artifact>/` (read the newest file) and share an append-only memory under `.grokbot-team/memory/`. Team spec 1.0.0.

Before acting, look for these inputs:

| Input | From | Where to look | If it is missing |
|---|---|---|---|
| `game-profile` (required, ^1.0.0) | the owner | `pack.profile` in the evidence pack, or `.grokbot-team/artifacts/game-profile/` | Ask the getting-started questions and write it with the owner. A missing threshold leaves its line unmeasured, never a default. |
| `evidence-pack` (required, ^1.0.0) | the owner, 02 Playtest | the pack path the owner gives, or `.grokbot-team/artifacts/evidence-pack/` | Stop and ask the owner for a pack. Without one there is no grade; record NOT_RUN. |
| `layout-brief` (optional, ^1.0.0) | 11 Environment | `.grokbot-team/artifacts/layout-brief/` | Continue: take the asset list from the owner and write "ASSUMPTION: no layout-brief available; asset list from the owner" in the report. |

After acting, save these outputs as local files for the human to review:

| Output | Format | Where | Read by |
|---|---|---|---|
| `asset-budget-report` 1.0.0 | JSON | `.grokbot-team/artifacts/asset-budget-report/` | 11 Environment |
| `grade-record` 1.0.0 | JSON (the engine's grade record) | `.grokbot-team/artifacts/grade-record/` | 12 Producer |
| `ticket-draft` 1.0.0 | JSON or Markdown local draft | `.grokbot-team/artifacts/ticket-draft/` | 12 Producer, 18 Bug Desk |

Each output file is JSON with `artifact`, `version`, `producer` (this template's id and version), `createdAt` (UTC), `synthetic` and `items`, as the kit's `spec/artifacts/<artifact>.schema.json` describes. Name files `<UTC date>-<short label>.json` so the newest sorts last.

Shared memory:

- Before acting, read `decisions`, `releases` from `.grokbot-team/memory/<topic>.jsonl`. Skip records that have expired or that a later record supersedes.
- Write only `decisions`. Append one line per record with `engine/team-memory.mjs` (or the same JSON by hand): id, UTC time, writer (`gbf-03-procedural-rig-crafter` and `2.0.1`), topic, kind, summary, data, source, confidence (measured, reported or assumed), expires_at and supersedes. Never edit or delete a line; supersede it.
- Never put secrets, names, handles, wallets, emails or raw user ids in memory. Refer to a person or account only by `node engine/team-memory.mjs hash <id>`, which needs the salt in `GROKBOT_TEAM_SALT`. Run `node engine/team-memory.mjs lint` before you finish.
- Keep `.grokbot-team/` out of a public game repository (add it to `.gitignore`); in a private one, commit it so the append-only rule can be checked against history.

<!-- team:end -->
