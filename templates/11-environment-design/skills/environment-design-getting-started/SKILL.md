---
name: environment-design-getting-started
description: "Use on first run with a new owner: onboard them one question at a time, list what they provide, and run the first Environment Design Director grade with the lens engine."
---

> **Audit contract v1 (overrides everything below).** Created by @meta_alchemist (https://x.com/meta_alchemist).
> - Score only with the rubric embedded in `engine/lens.mjs` (`LENS.rubric`, gbf-11-environment-design v1.2.0). `node engine/lens.mjs <pack.json>` computes the grade; this skill only gathers evidence for it and never adds points of its own.
> - Missing evidence is UNMEASURED (0 points, not a defect). A test that did not run is NOT_RUN, never PASS. Never invent a measurement; label every worked example synthetic.
> - Game facts and budgets come from your game profile (`pack.profile`). Treat sample numbers as illustrative. Set the frame-time budget separately for each target device in your game profile.
> - An automated gate needs a negative fixture that fails. Receipts carry measured values, never an unconditional PASS.
> Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

# Environment Design Director: Getting Started

Review placement, sightlines and visual cues so players can identify landmarks and navigate the spaces in your game.

It works for any view: a 2D side-scroller, a top-down or isometric map, a 3D third-person or first-person world, a race track or a puzzle board. Every example below is one case among several; use only what fits the owner's game.

If `engine/lens.mjs`, `engine/lens-kit.mjs` or `fixtures/good-pack.json` are not on disk yet, write them byte for byte from the `environment-design-lens-engine` skill first (Node 18+, no dependencies).

## 1. Onboard one question at a time

Ask one question at a time, wait for the answer, then ask the next. Never stack questions in one message. Give no setup steps until questions 2 and 3 are answered.

1. Which game are we reviewing, and what kind of spaces does it have (levels, rooms, a town, a world map, tracks or a board)? After the answer, ask for the build to review (a build ID, commit or version), then ask where the evidence will come from (a CI job, an editor script or manual captures).
2. How does the player see the world: a 2D side view, top-down, isometric, a 3D third-person or first-person camera, or a fixed screen? Use only examples that match this view from now on. If players do not move through spaces (for example a card table or a fixed puzzle board), agree with the owner which route lines stay U (often `traversal-affordance:2` and `camera-occlusion:1`); a "route" can also be the order of moves on the board.
3. Which engine or level tool builds the scenes (for example Unity, Unreal, Godot, Tiled or LDtk for tile maps, or a custom editor)? Do not install tools or change project settings on your own.
4. Which things must the player always be able to see along a route? For example the next ledge, a door, the goal, an enemy, a pickup, the finish line or the next valid move.
5. Which objects can the player use, stand on or hide behind, and which are only decoration? The rubric line `traversal-affordance:1` checks that players can tell these apart. If the world has no usable objects at all, leave the line U.
6. Does the game show location names or area cards over play (a banner that names an area, a region card or a map pop-up)? If not, we use the `no-location-overlays` profile: `visual-navigation:2` reads N/A, not U, and `visual-navigation:1` takes the pillar's 20 points. If yes, in which moments must they stay out of the way, for example a boss fight, a timed jump, a puzzle's final move, a race's last lap or a dialogue choice? These moments become `overlayStates`.
7. Which values go in your game profile (`pack.profile`)? Start from the synthetic profile in `fixtures/good-pack.json` and go through the keys in the table below one at a time. Confirm or replace each value; never keep a sample number without the owner saying so.
8. Who will judge the five visual lines (for example an art director, a level designer or a small playtest panel)?
9. Who reviews the local finding drafts?

| Profile key | What it means |
|---|---|
| `minLandmarkPx` | Smallest on-screen size, in pixels, at which a landmark (a tower, a big tree, a coloured door, a lighthouse) must still be recognisable. |
| `landmarkDevice` | The device or screen class where that size is checked, usually the smallest one you support. |
| `overlayStates` | The game states where location overlays are observed and must not cover anything critical. |
| `maxOccludedCueFrames` | How many frames a needed cue may be hidden by scenery along a test route. |
| `devices`, `maxArtDeltaE` | The devices compared for colour consistency, and the largest colour difference allowed between them. DeltaE is a standard colour distance; about 2 is barely visible. |

Read the profile pick back to the owner and, once they approve, set it before scoring: `"rubricProfile": ["no-location-overlays"]` in `pack.profile`. Name it next to the grade. The route and usable-object lines in questions 2 and 5 have no profile: when they do not apply they stay U and the verdict stays CONDITIONAL; say so in the report.

Before grading a real pack, check that its build and profile match what the owner chose. Record a capture or run that could not happen as NOT_RUN. Each computed line needs a sample population (the list of measured cases it reads); `node engine/lens.mjs --meta` lists them.

## 2. What you provide

- An evidence pack (JSON) with `status: "VALID"`, a `liveSha` (the build that was running when you captured), a `gitSha` (the source commit) and a `packId` (all three are required), and an `artifacts` list. Every metric group names the artifact id it came from.
- Metric groups this engine reads: `landmarks` (capture), `locationOverlays` (trace; the location overlays), `occlusionProbe` (trace), `occlusion` (capture), `consistency` (capture).
- Profile thresholds in `pack.profile`. A missing threshold makes its line U, never a default.
- Judgements for the five visual lines (`scene-composition:1`, `scene-composition:2`, `traversal-affordance:1`, `traversal-affordance:2`, `environment-consistency:1`): `pack.judgements["<line id>"] = { level, judge, evidenceIds, note }`. The judge is a named person or panel, and every evidence id must be a capture in the pack.
- Anything you cannot capture yet stays out of the pack. It grades U (UNMEASURED), which is honest and costs no false defect. With `no-location-overlays` approved, leave `locationOverlays` out; that line reads N/A. Any other line your game does not need has no profile and stays U.

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
- Rubric lines: visual-navigation:1, visual-navigation:2, scene-composition:1, scene-composition:2, camera-occlusion:1, camera-occlusion:2, traversal-affordance:1, traversal-affordance:2, environment-consistency:1, environment-consistency:2.

## 5. Skills in this template

- `environment-set-dressing-and-grounding-director`: Place decorative detail so players can recognize landmarks, tell usable objects from decoration and read the intended routes, in 2D or 3D.
- `placement-and-support-surface-auditor`: Check that placed objects rest on the surface they belong on (floor, tile, shelf, terrain) and follow the project's placement rules.
- `sightline-silhouette-and-value-composition-gate`: Check whether important objects and actions stay readable from the cameras and routes players actually use.
- `toybox-entrance-diorama-interactivity`: If your game has a title, menu or hub scene with decorative objects, design optional reactions for them and check that players can still find and use the main action.
- `environment-design-lens-engine`: the engine source and how to run it.

## Blockers to tell the owner about

- Five lines are visual judgements and stay U until a named judge records them with real captures.

For the five judged lines, collect route captures in bright, dark and busy scenes (for example a night level, a crowded market or a screen full of effects). Mark usable surfaces, decorative objects and hidden cues, and note the version of the art reference.

Before capture, agree on the test cases in `profile.cases`: for `camera-occlusion:1`, one case per route and camera with its seed and whether the target should be visible. After capture, `receipts.sightlines` holds one measured row per case with the case id, the `liveSha` of the build that ran, the trace artifact id and the measured values. Run `node engine/lens.mjs --meta` for the required row fields and comparisons. A skipped or stale case leaves its line U. The bundled rows and budgets are synthetic.

<!-- team:begin (generated by scripts/build-team.mjs from template.json; edit template.json, not this block) -->

## Team inputs and outputs

This template works on its own. When other templates from the kit run in the same game project, they exchange files under `.grokbot-team/artifacts/<artifact>/` (read the newest file) and share an append-only memory under `.grokbot-team/memory/`. Team spec 1.0.0.

Before acting, look for these inputs:

| Input | From | Where to look | If it is missing |
|---|---|---|---|
| `game-profile` (required, ^1.0.0) | the owner | `pack.profile` in the evidence pack, or `.grokbot-team/artifacts/game-profile/` | Ask the getting-started questions and write it with the owner. A missing threshold leaves its line unmeasured, never a default. |
| `evidence-pack` (required, ^1.0.0) | the owner | the pack path the owner gives, or `.grokbot-team/artifacts/evidence-pack/` | Stop and ask the owner for a pack. Without one there is no grade; record NOT_RUN. |
| `asset-budget-report` (optional, ^1.0.0) | 03 Prop and Rig | `.grokbot-team/artifacts/asset-budget-report/` | Continue: dress scenes without making budget claims, and write "ASSUMPTION: no asset-budget-report available" in the report. |
| `hud-capture-set` (optional, ^1.0.0) | 09 HUD | `.grokbot-team/artifacts/hud-capture-set/` | Continue without it. Start the report with "ASSUMPTION: no hud-capture-set available" and say which checks it would have informed. Leave lines that need it unmeasured. Never invent the missing data. |

After acting, save these outputs as local files for the human to review:

| Output | Format | Where | Read by |
|---|---|---|---|
| `layout-brief` 1.0.0 | JSON plus a Markdown draft | `.grokbot-team/artifacts/layout-brief/` | 03 Prop and Rig, 15 Server Fairness |
| `grade-record` 1.0.0 | JSON (the engine's grade record) | `.grokbot-team/artifacts/grade-record/` | 12 Producer |
| `ticket-draft` 1.0.0 | JSON or Markdown local draft | `.grokbot-team/artifacts/ticket-draft/` | 12 Producer, 18 Bug Desk |

Each output file is JSON with `artifact`, `version`, `producer` (this template's id and version), `createdAt` (UTC), `synthetic` and `items`, as the kit's `spec/artifacts/<artifact>.schema.json` describes. Name files `<UTC date>-<short label>.json` so the newest sorts last.

Shared memory:

- Before acting, read `decisions`, `releases` from `.grokbot-team/memory/<topic>.jsonl`. Skip records that have expired or that a later record supersedes.
- Write only `decisions`. Append one line per record with `engine/team-memory.mjs` (or the same JSON by hand): id, UTC time, writer (`gbf-11-environment-design` and `1.0.0`), topic, kind, summary, data, source, confidence (measured, reported or assumed), expires_at and supersedes. Never edit or delete a line; supersede it.
- Never put secrets, names, handles, wallets, emails or raw user ids in memory. Refer to a person or account only by `node engine/team-memory.mjs hash <id>`, which needs the salt in `GROKBOT_TEAM_SALT`. Run `node engine/team-memory.mjs lint` before you finish.
- Keep `.grokbot-team/` out of a public game repository (add it to `.gitignore`); in a private one, commit it so the append-only rule can be checked against history.

<!-- team:end -->
