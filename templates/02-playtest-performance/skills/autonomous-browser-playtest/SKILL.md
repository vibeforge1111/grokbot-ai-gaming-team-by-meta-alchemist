---
name: autonomous-browser-playtest
description: "Use when the game runs in a browser and you want scripted journeys for the opening, core session, scenarios, and coverage lines. Skip it when the game is not in a browser."
---

> **Audit contract v1 (overrides everything below).** Created by @meta_alchemist (https://x.com/meta_alchemist).

> Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.
> - Score only with the rubric embedded in `engine/lens.mjs`. This skill gathers evidence; it never adds points.
> - Missing evidence is UNMEASURED (0 points, not a defect). Never invent a measurement; label every worked example synthetic.

# Autonomous browser playtest

Use this skill only when the game runs in a browser (for example a canvas or WebGL build). If the game is a native, console, or mobile binary without a browser target, skip this skill and capture the same journeys by hand or with the owner's own tools.

This skill does not ship a Playwright runner or any other browser driver. It describes how to script journeys with a runner the owner already has, or how to record the same steps manually.

## Journeys

1. Script or record the opening journey from launch to the first meaningful activity. Store duration in seconds and whether each attempt completed.
2. Script or record the core journey on each required viewport. Store which viewports actually completed.
3. Keep a short list of planned scenarios (for example first session, retry, and one edge the owner cares about). Each scenario needs a trace. A failed scenario is either explained or tagged as a known issue the owner already accepted.
4. Record crashes and unexplained errors from the same sessions.
5. List the viewports and seeds that were actually run, including any held-out seed the owner asked for.

## How to capture

- If the owner has Playwright, Cypress, or another browser runner, drive the journeys with that runner and save traces next to the pack. Do not add a new dependency to this repo.
- If they do not, walk the same journeys by hand, take timestamps, and write a trace JSON with the same fields as `fixtures/good-pack.json`.
- Attach captures and traces as pack artifacts. Give each one a stable id.

## Honesty

- Do not invent a completed journey. A path you did not run stays out of the pack and grades U.
- Do not file issues, open pull requests, or send a report. Write a local ticket draft for the human to review.
- Redact personal data, account names, and secrets from traces before they enter the pack.
