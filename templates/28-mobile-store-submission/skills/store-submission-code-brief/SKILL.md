---
name: store-submission-code-brief
description: "Use when a failed store check needs a local implementation brief for a developer, with the target, a redacted reference and the acceptance test."
---

> **Audit contract v1 (overrides everything below).** Created by @meta_alchemist (https://x.com/meta_alchemist).
> - Score only with the rubric embedded in `engine/lens.mjs` (`LENS.rubric`, gbf-28-mobile-store-submission v1.1.0). `node engine/lens.mjs <pack.json>` computes the grade; this skill only gathers evidence for it and never adds points of its own.
> - Missing evidence is UNMEASURED (0 points, not a defect). A step that did not run is NOT_RUN, never PASS. Never invent a measurement; label every worked example synthetic.
> - Thresholds and codes come from the owner's profile (`pack.profile`). Treat sample numbers as illustrative.
> - Preview engine: the vendored lens kit 1.1.0 trusts the metrics a pack declares and does not check artifact bytes or a producer receipt. Say so beside every grade.
> Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

# Implementation brief

Turn one failed check into a short brief a developer can act on. The brief names files and lines, never secrets.

Rubric lines: none directly; the fix is verified by rerunning the checklist.

## Steps

1. Input: one failed check from `node mobile/run.mjs <checks.json or folder> --findings` (its id, group, evidence and fix).
2. Draft a local brief: the check id and target, the redacted evidence reference (file and line), the change wanted, the acceptance test (the same command, with the check reading pass on the new build), and who verifies it and prepares the release.
3. Keep keys and credentials out; the brief names the file, never the secret.
4. Stop: if the fix needs a policy decision (billing, login, data collection), route it to `store-submission-owner-answers` instead.

## Output

One local brief per failed check.
