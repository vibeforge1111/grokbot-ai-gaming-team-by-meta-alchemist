---
name: netcode-desync-and-soak-proof
description: "Use when checking a desync log and confirming the pack names its build and does not leak personal data or write to a live server."
---

> **Audit contract v1 (overrides everything below).** Created by @meta_alchemist (https://x.com/meta_alchemist).
>
> Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.
> - Score only with the rubric embedded in `engine/lens.mjs`. This skill gathers evidence; it never adds points.
> - Missing evidence is UNMEASURED (0 points, not a defect). Never invent a measurement; label every worked example synthetic.

# Desync, identity, and safety check

Use this skill for the remaining safety and identity checks.

1. Confirm the pack records a git SHA and a live SHA for the intended build (`identity.gitShaPresent`, `identity.liveShaPresent`).
2. Scan traces and reports for personal data (names, handles, emails, raw user ids, addresses). Record `safety.piiLeaks`. It must be 0. Hash subject ids with the kit helper if you need a stable key.
3. Record `safety.liveWrites` for any attempt this run made to change a live server. It must be 0. This bot only reads exports and writes local drafts.

If a log is missing, leave the group out and let the line read U.
