# Playtest and Performance Director in your pipeline

Created by @meta_alchemist (https://x.com/meta_alchemist).

Grade playtest journeys and frame time for any game, then write a local evidence pack and ticket drafts.

**Status: preview, not shipping.** The template works and its tests pass, but it is not held to the release standard. It has no bundled Playwright runner or GPU sampler, and some counts can still be declared by hand. Use it to try a first pass on journeys and frame time. Do not treat the grade as a release gate. The template README lists the remaining ship blockers.

Template folder: [templates/02-playtest-performance](../../templates/02-playtest-performance/). Install and prompts: [HOW-TO-USE.md](../../templates/02-playtest-performance/HOW-TO-USE.md), [PROMPTS.md](../../templates/02-playtest-performance/PROMPTS.md).

## When to use it

- **Stage:** Playtest, after a build can be clicked, tapped, or driven through an opening and a core session.
- **Trigger:** When you want a first read of journeys and frame time. The frame-time budget is yours to set. This bot is not required; you can still collect a pack yourself and hand it to the other bots.

## Inputs and outputs

- **Inputs:** Your game profile (`game-profile`), journey traces or session notes, and frame-time samples. Optional files from Game Feel (01), Game Loop (05), or HUD (09) when those bots have already run.
- **Outputs:** A local evidence pack (`evidence-pack`), a 100-point grade (`grade-record`), and local ticket drafts (`ticket-draft`). Nothing is sent or filed until you do it.

## Handoffs

- **Takes from:** The owner's profile and captures, plus optional `feel-findings`, `loop-report`, and `hud-capture-set`.
- **Hands to:** Templates that read an `evidence-pack`; Bug Desk (18) for ticket drafts; Producer (12) if you use the grade as a milestone note. The human reviews every draft.
- **Exchange folder:** `.grokbot-team/artifacts/<artifact-id>/` in your game project. Nothing is sent anywhere.

## Recommended process

1. **Set up once:** run `playtest-performance-getting-started` and answer its questions one at a time (journeys, viewports, the frame-time budget, whether a second device is in scope, and `minCases`). Write the answers into your game profile.
2. **Capture journeys:** if the game runs in a browser, `autonomous-browser-playtest` can script the opening and core sessions. If it does not, record the same journeys by hand or with your own tools.
3. **Capture frame time:** run `frame-pacing-and-gpu-profiler` on the primary device, and on any extra device the owner put in scope. GPU counters are optional.
4. **Assemble a pack:** copy `fixtures/good-pack.json`, set `synthetic` to false, and replace every value with your own measurements.
5. **Grade:** `node engine/lens.mjs fixtures/good-pack.json` from the template folder shows the synthetic example (verdict PASS, grade 100/100). For a real pack, run `node engine/lens.mjs <pack.json>`. Until a producer with receipts ships, treat declared counts as provisional.
6. **File locally:** keep the pack, the grade, and ticket drafts in your exchange folder. You decide what is sent or filed.

See [README.md](README.md) for end to end pipelines that combine templates.
