---
name: wcag-luminance-and-ui-frame-gate
description: "Measure text and icon contrast (the WCAG contrast ratio) in real gameplay captures, and compare UI frame cost with each target device's budget."
---

> **Audit contract v1 (overrides everything below).** Created by @meta_alchemist (https://x.com/meta_alchemist).
> - Score only with the rubric embedded in `engine/lens.mjs` (`LENS.rubric`, gbf-09-hud-ui-designer v1.2.0). `node engine/lens.mjs <pack.json>` computes the grade; this skill only gathers evidence for it and never adds points of its own.
> - Missing evidence is UNMEASURED (0 points, not a defect). A test that did not run is NOT_RUN, never PASS. Never invent a measurement; label every worked example synthetic.
> - Game facts and budgets come from your game profile (`pack.profile`). Treat sample numbers as illustrative. Set the frame-time budget separately for each target device in your game profile.
> - An automated gate needs a negative fixture that fails. Receipts carry measured values, never an unconditional PASS.
> Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

# Measure contrast and UI cost

WCAG is the web accessibility guideline that defines the contrast ratio used here: how much brighter the lighter of two colours is than the darker one, from 1:1 (identical) to 21:1 (black on white). The engine compares the ratio with the minimum in your game profile; it never assumes a value.

## 1. Sample real screens

Take lossless captures (PNG, not a compressed video frame) of each essential text, icon and focus indicator over representative bright, dark and busy scenes. Sample the colour the player actually sees, including overlays, transparency and post-processing, never the colour declared in a theme file. Examples:

- **Farming or life sim:** the clock and energy bar over a bright midday field and a dark night scene.
- **Racing game:** position and lap counter over sky, tarmac and a tunnel.
- **Mobile puzzle game:** the moves counter over the busiest board colours.
- **Narrative adventure:** dialogue text over the brightest and busiest backgrounds.
- **3D arena game, if your game has combat:** health and ammo over explosions and dark corners.

## 2. Compute the ratio

For sRGB samples, convert each channel to linear light, then compute relative luminance with the channel weights 0.2126, 0.7152 and 0.0722. The contrast ratio is (lighter + 0.05) / (darker + 0.05). The engine does this for you from the hex pairs in `contrast.pairs` and in the `elementContrast` receipt rows (one row per element and state in the profile). This feeds `readable-combat-states:1`; the pillar name comes from a combat game and means "readable game states" in yours.

Compare the lowest sampled ratio with the profile minimum for that element. Also inspect states that rely on colour alone, and hand them to the colour check (`readable-combat-states:2`).

## 3. Measure UI frame cost

Record UI frame time during a busy moment on each target device, then a matched run with the tested overlay hidden. Use your engine's profiler or a frame-time trace. Put the UI share in `uiCost.uiMs` for `measured-ui-cost:1`.

## 4. Prove the check can fail

In a test copy, set one foreground colour close to its background and confirm that the contrast check catches it, even when the theme's declared colours look fine.

Gather evidence for `node engine/lens.mjs <pack.json>`.
