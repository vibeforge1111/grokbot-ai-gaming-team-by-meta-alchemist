---
name: clip-clarity-and-rights-check
description: "Use when checking that a clip is watchable, that required redaction was applied, and that rights and source-build notes are present."
---

> **Audit contract v1 (overrides everything below).** Created by @meta_alchemist (https://x.com/meta_alchemist).
>
> Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.
> - Score only with the rubric embedded in `engine/lens.mjs`. This skill gathers evidence; it never adds points.
> - Missing evidence is UNMEASURED (0 points, not a defect). Never invent a measurement; label every worked example synthetic.

# Clip clarity and rights check

Use this skill for clarity and rights.

1. Record clips that cannot be understood without missing context as `clarity.unwatchable`. It must be 0. Record redaction misses (HUD, chat, or other UI the owner asked to hide) as `clarity.redactionMisses`. It must be 0.
2. Record missing rights notes as `rights.missing`. It must be 0. Record `rights.sourceBuildPresent` when each clip names the build it came from.

This bot does not grant rights. It only checks that notes exist for the human to review.
