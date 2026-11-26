---
name: sprite-hitbox-packer-getting-started
description: "Use on first run with a new owner: onboard them one question at a time, list what they provide, and run the first 2D Sprite Atlas & Hitbox Packer grade with the lens engine."
---

> **Audit contract v1 (overrides everything below).** Created by @meta_alchemist (https://x.com/meta_alchemist).
> - Score only with the rubric embedded in `engine/lens.mjs` (`LENS.rubric`, gbf-17-sprite-hitbox-packer v1.3.0). `node engine/lens.mjs <pack.json>` computes the grade; this skill only gathers evidence for it and never adds points of its own.
> - Missing evidence is UNMEASURED (0 points, not a defect). A test that did not run is NOT_RUN, never PASS. Never invent a measurement; label every worked example synthetic.
> - Game facts and budgets come from your game profile (`pack.profile`). Treat sample numbers as illustrative. Set the frame-time budget separately for each target device in your game profile.
> - An automated gate needs a negative fixture that fails. Receipts carry measured values, never an unconditional PASS.
> Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

# 2D Sprite Atlas & Hitbox Packer: Getting Started

Pack sprites into atlases and check their silhouettes, hitboxes, palettes and memory use on your target devices.

An atlas (or sprite sheet) is one large image that holds many small images, so the game loads and draws them together. A hitbox (or hit shape) is the invisible shape the game uses to decide what touches what: an attack, a platform under the player's feet, a pickup or the area a click or tap lands on. The template works for pixel art and for smooth high-resolution art, in 2D games and for the 2D icons and interface art of 3D games. Every example below is one case among several.

If `engine/lens.mjs`, `engine/lens-kit.mjs` or `fixtures/good-pack.json` are not on disk yet, write them byte for byte from the `sprite-hitbox-packer-lens-engine` skill first (Node 18+, no dependencies).

## 1. Onboard one question at a time

Ask one question at a time, wait for the answer, then ask the next. Never stack questions in one message. Give no setup steps until questions 2 and 3 are answered.

1. Which game are we reviewing? After the answer, ask for the build to review (a build ID, commit or version), then ask where the evidence will come from (a CI job, an export script or manual captures).
2. What kind of 2D art does the game use: pixel art scaled up with sharp pixels (nearest filtering), smooth high-resolution art (linear filtering, often with mipmaps, the smaller pre-shrunk copies of a texture), or both? This decides `atlasFilters`, `atlasMips` and how much padding the atlas needs.
3. Which engine or packing tool makes the atlases (for example Unity Sprite Atlas, Godot's atlas import, TexturePacker, an Aseprite export or a custom script)? Use only that route from now on, and do not install tools on your own.
4. Do sprites take part in gameplay collision: hits, the ground under the player in a platformer, pickups, or the area a click or tap lands on? If none do, we use the `no-hit-shapes` profile: both `hit-shape` lines read N/A and their 20 points are shared over the other eight lines. Skip question 5.
5. Does the game have a height or depth layer that changes what touches what? For example jumping over a hazard in a top-down game, a bridge over a road, lanes in a side-scrolling brawler, or two clickable objects stacked on screen. If not, we use the `no-height-layer` profile.
6. Does the game ship install icons (a web app manifest, mobile app icons or a desktop shortcut icon)? If not, we use the `no-install-icons` profile.
7. Are items, collectibles or medals told apart by colour tiers or rarity levels (for example common and rare loot, bronze, silver and gold medals, or crop quality stars)? If not, we use the `no-item-tiers` profile. If the game shows no item or collectible art at all, `reward-art:1` has no profile and stays U.
8. Which values go in your game profile (`pack.profile`)? Start from the synthetic profile in `fixtures/good-pack.json` and go through the keys in the table below one at a time. Confirm or replace each value; never keep a sample number without the owner saying so.
9. What is your texture budget per scene, and which install icon sizes do the platforms you ship to require?
10. Who reviews the local finding drafts?

| Profile key | What it means |
|---|---|
| `devices` | The devices or screen classes you capture, for example `desktop` and `phone`. |
| `minIconPx` | Smallest on-screen size, in pixels, at which icons are checked for readability and bleed (a coloured seam taken from a neighbouring image in the atlas). |
| `atlasSizes`, `atlasFilters`, `atlasMips` | Display sizes, filter modes (`nearest` for pixel art, `linear` for smooth art) and mip levels to test. Every combination with every device becomes one test case. |
| `minPaddingPx`, `minPackingOccupancy` | Empty border around each frame in the atlas, and how much of the atlas area frames should fill. These feed a growth check that is reported but not scored. |
| `requiredIconSizes` | Install icon sizes, in pixels, that your platforms require. |
| `maxTextureBytesPerScene` | Texture budget per scene, in bytes. |
| `minItemArtPx` | Smallest displayed size for reward, item or collectible art. |
| `maxTierPaletteDeltaE`, `minTierDeltaE` | Largest colour drift allowed between a tier's reference colour and what is drawn, and smallest colour difference required between two different tiers. DeltaE is a standard colour distance; about 2 is barely visible. |

Read the profiles you picked back to the owner and, once they approve, set them before scoring, for example `"rubricProfile": ["no-item-tiers", "no-install-icons"]` in `pack.profile`. A selected line reads N/A (not U, not a defect), its points move to the lines that still apply, and the verdict can reach PASS.

Before grading a real pack, check that its build and profile match what the owner chose. Record a capture or run that could not happen as NOT_RUN. Each line needs a sample population (the list of measured cases it reads); `node engine/lens.mjs --meta` lists them.

## 2. What you provide

- An evidence pack (JSON) with `status: "VALID"`, a `liveSha` (the build that was running when you captured), a `gitSha` (the source commit) and a `packId` (all three are required), and an `artifacts` list. Every metric group names the artifact id it came from.
- Metric groups this engine reads: `icons` (capture), `atlas` (capture), `install` (trace), `iconSet` (static), `itemArt` (capture), `tierPalette` (capture), `weight` (trace), `decode` (trace), `hitShape` (trace), `heightLayer` (capture), `packing` (trace).
- Profile thresholds in `pack.profile`. A missing threshold makes its line U, never a default.
- Anything you cannot capture yet stays out of the pack. It grades U (UNMEASURED), which is honest and costs no false defect. A line your game does not need reads N/A once its profile is approved; without a profile it stays U.

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
- Rubric lines: icons:1, icons:2, install-icons:1, install-icons:2, reward-art:1, reward-art:2, texture-weight:1, texture-weight:2, hit-shape:1, hit-shape:2.

## 5. Skills in this template

- `sprite-atlas-packer`: Pack sprites, icons or interface art into atlases with padding and extruded edges so filtering never bleeds, for pixel art or smooth art, and prove they render clean on every device.
- `sprite-hit-shape-checker`: Check the shapes the game uses to decide what touches what (attack hitboxes, platform collision, pickups, click or tap areas) against the code that really uses them, frame by frame.
- `sprite-palette-and-readability-checker`: Check that reward, item or collectible art reads at its displayed size and that colour tiers and palette swaps stay distinct and match the palette rules.
- `sprite-hitbox-packer-lens-engine`: the engine source and how to run it.

## Blockers to tell the owner about

- Icon readability needs device captures; the worked example is synthetic.

Before capture, agree on the test cases in `profile.cases`: one `atlasMatrix` case per device, size, filter and mip combination, one `frameColliders` case per frame and shape you check, and one `tierSeparation` case per pair of tiers. After capture, `receipts` holds one measured row per case with the case id, the `liveSha` of the build that ran, the artifact id and the measured values. Run `node engine/lens.mjs --meta` for the required row fields and comparisons. A skipped or stale case leaves its line U. The bundled rows and budgets are synthetic.

<!-- team:begin (generated by scripts/build-team.mjs from template.json; edit template.json, not this block) -->

## Team inputs and outputs

This template works on its own. When other templates from the kit run in the same game project, they exchange files under `.grokbot-team/artifacts/<artifact>/` (read the newest file) and share an append-only memory under `.grokbot-team/memory/`. Team spec 1.0.0.

Before acting, look for these inputs:

| Input | From | Where to look | If it is missing |
|---|---|---|---|
| `game-profile` (required, ^1.0.0) | the owner | `pack.profile` in the evidence pack, or `.grokbot-team/artifacts/game-profile/` | Ask the getting-started questions and write it with the owner. A missing threshold leaves its line unmeasured, never a default. |
| `evidence-pack` (required, ^1.0.0) | the owner, 02 Playtest | the pack path the owner gives, or `.grokbot-team/artifacts/evidence-pack/` | Stop and ask the owner for a pack. Without one there is no grade; record NOT_RUN. |
| `feel-findings` (optional, ^1.0.0) | 01 Game Feel | `.grokbot-team/artifacts/feel-findings/` | Continue: work from the animation list, and write "ASSUMPTION: no feel-findings available" in the report. |
| `fairness-findings` (optional, ^1.0.0) | 15 Server Fairness | `.grokbot-team/artifacts/fairness-findings/` | Continue without it. Start the report with "ASSUMPTION: no fairness-findings available" and say which checks it would have informed. Leave lines that need it unmeasured. Never invent the missing data. |

After acting, save these outputs as local files for the human to review:

| Output | Format | Where | Read by |
|---|---|---|---|
| `atlas-manifest` 1.0.0 | JSON plus the packed atlas images | `.grokbot-team/artifacts/atlas-manifest/` | 01 Game Feel, 09 HUD, 19 Store Page |
| `grade-record` 1.0.0 | JSON (the engine's grade record) | `.grokbot-team/artifacts/grade-record/` | 12 Producer |
| `ticket-draft` 1.0.0 | JSON or Markdown local draft | `.grokbot-team/artifacts/ticket-draft/` | 12 Producer, 18 Bug Desk |

Each output file is JSON with `artifact`, `version`, `producer` (this template's id and version), `createdAt` (UTC), `synthetic` and `items`, as the kit's `spec/artifacts/<artifact>.schema.json` describes. Name files `<UTC date>-<short label>.json` so the newest sorts last.

Shared memory:

- Before acting, read `decisions`, `releases` from `.grokbot-team/memory/<topic>.jsonl`. Skip records that have expired or that a later record supersedes.
- Write only `decisions`. Append one line per record with `engine/team-memory.mjs` (or the same JSON by hand): id, UTC time, writer (`gbf-17-sprite-hitbox-packer` and `1.0.1`), topic, kind, summary, data, source, confidence (measured, reported or assumed), expires_at and supersedes. Never edit or delete a line; supersede it.
- Never put secrets, names, handles, wallets, emails or raw user ids in memory. Refer to a person or account only by `node engine/team-memory.mjs hash <id>`, which needs the salt in `GROKBOT_TEAM_SALT`. Run `node engine/team-memory.mjs lint` before you finish.
- Keep `.grokbot-team/` out of a public game repository (add it to `.gitignore`); in a private one, commit it so the append-only rule can be checked against history.

<!-- team:end -->
