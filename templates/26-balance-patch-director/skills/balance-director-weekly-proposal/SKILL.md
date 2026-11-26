---
name: balance-director-weekly-proposal
description: "Use when owners or players ask for balance changes by name and you need to resolve each name to one parameter and draft hold, decrease and increase options inside the profile's caps."
---

> **Audit contract v1 (overrides everything below).** Created by @meta_alchemist (https://x.com/meta_alchemist).
> - Score only with the rubric embedded in `engine/lens.mjs` (`LENS.rubric`, gbf-26-balance-patch-director v1.1.0). `node engine/lens.mjs <pack.json>` computes the grade; this skill only gathers evidence for it and never adds points of its own.
> - Missing evidence is UNMEASURED (0 points, not a defect). A step that did not run is NOT_RUN, never PASS. Never invent a measurement; label every worked example synthetic.
> - Thresholds and codes come from the owner's profile (`pack.profile`). Treat sample numbers as illustrative.
> - Grade a pack from its folder so lens-kit 1.3.1 can check artifact bytes and the producer receipt.
> Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

# Weekly balance proposal

Resolve each requested name to one parameter and draft bounded, reversible options with a modeled outcome. Ambiguous names and thin or stale evidence lead to a hold.

Rubric lines this informs: `data-fidelity:1`, `data-fidelity:2`, `evidence:1`, `evidence:2`, `proposals:1`, `proposals:2`, `authority:1`, `authority:2` and `patch-notes:2`.

## Steps

1. Input: `input.json` in the shape of `balance/data/fixture-ledger.json`: parameters (id, unit, value, aliases) read from the build, `referenceValues` from a separate export, the requested labels, observations (id, cases, ageDays, observed, target) and the profile (`stepPct`, `maxStepPct`, `maxLevers`, `minParameters`, `minObservations`, `maxTelemetryAgeDays`, `minProbeAttempts`).
2. Proposal: `node balance/run.mjs input.json --md > drafts/balance-proposal.md`.
3. Pack and grade: `node balance/run.mjs input.json > pack.json`, then `node engine/lens.mjs pack.json`.
4. Read the proposal: an ambiguous name lists its candidates and goes back to the owner; stale or small samples hold; at most `maxLevers` parameters move, each by one `stepPct` step capped at `maxStepPct`, and every option rolls back to today's value.
5. Stop: `run.mjs` refuses an input with a missing profile key or an invalid parameter or observation; report the error and stop. In this preview `evidence:1` checks the model against itself, so a pass is not proof that the predictions hold.

## Output

A local proposal draft, `pack.json` and the grade record.
