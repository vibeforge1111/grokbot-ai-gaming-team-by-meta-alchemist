---
name: authoritative-prediction-and-interpolation-audit
description: "Use when auditing client prediction, interpolation, and which events the server must own, from owner-supplied traces."
---

> **Audit contract v1 (overrides everything below).** Created by @meta_alchemist (https://x.com/meta_alchemist).
>
> Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.
> - Score only with the rubric embedded in `engine/lens.mjs`. This skill gathers evidence; it never adds points.
> - Missing evidence is UNMEASURED (0 points, not a defect). Never invent a measurement; label every worked example synthetic.

# Prediction and authority audit

Use this skill to fill the prediction and authority lines from owner-supplied traces. It works with any engine or netcode model. Do not assume a specific middleware.

## Prediction

1. Confirm the owner-set prediction error budget, in milliseconds.
2. From a real joined session, record the gap between predicted state and confirmed state for the same tick, as `prediction.errorMs`. Keep the raw samples with the pack. The lens computes p95 and compares it to the budget.
3. Record interpolation overshoot as `prediction.maxOvershoot`, where 0 means no overshoot past the confirmed pose.

## Authority

1. Ask which events must be server-owned (scored hits, inventory, match outcome, or the owner's list).
2. Record how many of those events were actually decided by the server (`authority.serverOwned`) and how many required types were missing (`authority.missingOwned`). Record `authority.clientTrustedValuables` for valuable events accepted from a client without a server check. That count must be 0.

## Honesty

- This preview has no bundled netcode sampler. Use the owner's tools or a log they already export.
- Never invent a timestamp. Missing traces earn U, which is honest.
- Keep findings as local ticket drafts.
