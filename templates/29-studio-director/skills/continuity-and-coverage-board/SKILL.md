---
name: continuity-and-coverage-board
description: "Use when checking character and location continuity, and whether every required story beat has a planned shot or still."
---

> **Audit contract v1 (overrides everything below).** Created by @meta_alchemist (https://x.com/meta_alchemist).
>
> Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.
> - Score only with the rubric embedded in `engine/lens.mjs`. This skill gathers evidence; it never adds points.
> - Missing evidence is UNMEASURED (0 points, not a defect). Never invent a measurement; label every worked example synthetic.

# Continuity and coverage board

Use this skill to fill the continuity and coverage lines from an owner-supplied shot or stills list. This bot plans the shoot or stills sequence. Trailer Director still covers trailer-shaped cuts.

1. Record continuity breaks as `continuity.breaks`. It must be 0. Record `continuity.charactersChecked` when identity was reviewed.
2. Record required beats (`coverage.requiredBeats`) and missing beats (`coverage.missingBeats`). Missing beats must be 0. Record `coverage.shotListComplete` when every planned shot has a source or a still.

Never invent a beat. Missing lists earn U.
