---
name: store-submission-checklist
description: "Use before a store upload when a build's store requirements (config, hardening, permissions, privacy, billing, accounts, secrets, signing, listing) need checking against local evidence."
---

> **Audit contract v1 (overrides everything below).** Created by @meta_alchemist (https://x.com/meta_alchemist).
> - Score only with the rubric embedded in `engine/lens.mjs` (`LENS.rubric`, gbf-28-mobile-store-submission v1.1.0). `node engine/lens.mjs <pack.json>` computes the grade; this skill only gathers evidence for it and never adds points of its own.
> - Missing evidence is UNMEASURED (0 points, not a defect). A step that did not run is NOT_RUN, never PASS. Never invent a measurement; label every worked example synthetic.
> - Thresholds and codes come from the owner's profile (`pack.profile`). Treat sample numbers as illustrative.
> - Grade a pack from its folder so lens-kit 1.3.1 can check artifact bytes and the producer receipt.
> Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

# Store checklist

Compare each required check with one observation on the target build. A measured failure and missing evidence are reported separately, and nothing is built, signed or uploaded.

Rubric lines this informs: `build-config:1`, `build-config:2`, `privacy:1`, `privacy:2`, `store-policy:1`, `store-policy:2`, `signing:1`, `signing:2` and `submission:2`.

## Steps

1. Input, either: a normalized `checks.json` for any engine or storefront (shape in HOW-TO-USE.md), or a folder for the optional Capacitor adapter with the store config files, `answers.json`, `tree.json` and `profile.json` (`minTargetSdk`, `minIosTarget`, `allowedPermissions`).
2. Checklist: `node mobile/run.mjs <checks.json or folder> --report --pack-id <id> --git-sha <sha> --live-sha <sha> > drafts/store-checklist.md`.
3. Pack and grade: the same command without `--report`, saved as `pack.json`, then `node engine/lens.mjs pack.json`.
4. Read blockers first. A check with no observation on this build reads unknown or UNMEASURED, never pass. Secrets are reported by file and line only.
5. Stop: if a signing key, keystore or password shows up, stop, report the file only and ask the owner to remove and rotate it. Without `profile.json` the adapter refuses to run.

## Output

A local checklist draft sorted by severity, `pack.json` and the grade record.
