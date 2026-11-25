# Pixel Pantry playtest

Created by @meta_alchemist (https://x.com/meta_alchemist).

Pixel Pantry is a fictional cooking game. Players read an order timer and tap recipe buttons to serve dishes. Its two-person team uses [HUD Designer](../../templates/09-hud-designer/) to check whether players can read and operate the interface, and [Bug Desk](../../templates/18-bug-desk-triage/) to check how fixes are verified.

## Collect evidence for a build

In this example, CI samples the timer colours from screenshots, a playtester measures the recipe buttons, and a reviewer records who fixed and verified each issue. [evidence.json](evidence.json) contains the synthetic observations for both builds. The pack generator combines these observations with the templates' synthetic fixtures for the other rubric lines. Both builds use the same thresholds and the same cooking screens.

To try either bot, follow the [manual setup](../../INSTALL.md) and run its getting-started skill. Supply your build identifier, supported inputs, screens and evidence. For Bug Desk, choose which failures are release blockers and how many clean runs a flaky issue needs before closure.

## Compare the two builds

| Template | Build 0.3.0 | What changed | Build 0.3.1 |
|---|---|---|---|
| HUD Designer | CONDITIONAL, 90/100 | The timer gained contrast. The smallest recipe button grew from 30 px to 44 px, the floor in this game's profile. | PASS, 100/100 |
| Bug Desk | CONDITIONAL, 92.5/100 | The artist independently verified the developer's fix using the new build. | PASS, 100/100 |

All four synthetic grading runs have full coverage. Compare the [week one report](reports/week-1.md), [HUD fix brief](briefs/hud-contrast-and-touch.md), [week two report](reports/week-2.md) and [engine summary](grades/SUMMARY.json).

## Reproduce the grades

From this directory, run:

```sh
node make-packs.mjs
node run.mjs
node run.mjs --check
```

The first command rebuilds four packs. The second grades them. The third compares every grade and the summary with freshly computed output. Run `node make-packs.mjs --check` to compare the saved packs with the evidence without rewriting them. The top-level tests check both comparisons, the expected improvements and every previously passing line.
