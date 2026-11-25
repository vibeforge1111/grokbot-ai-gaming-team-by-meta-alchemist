---
name: balance-director-post-release-read
description: "Use when a balance change has shipped and you need to compare like-for-like observations from the previous and current build against what the model predicted."
---

> **Audit contract v1 (overrides everything below).** Created by @meta_alchemist (https://x.com/meta_alchemist).
> - Score only with the rubric embedded in `engine/lens.mjs` (`LENS.rubric`, gbf-26-balance-patch-director v1.1.0). `node engine/lens.mjs <pack.json>` computes the grade; this skill only gathers evidence for it and never adds points of its own.
> - Missing evidence is UNMEASURED (0 points, not a defect). A step that did not run is NOT_RUN, never PASS. Never invent a measurement; label every worked example synthetic.
> - Thresholds and codes come from the owner's profile (`pack.profile`). Treat sample numbers as illustrative.
> - Preview engine: the vendored lens kit 1.1.0 trusts the metrics a pack declares and does not check artifact bytes or a producer receipt. Say so beside every grade.
> Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

# Post-release measurement

Compare the predicted outcome with what the new build measured, like for like. No bundled tool does this yet, so the comparison is built by hand and labelled manual.

Rubric lines this informs: `evidence:2` on the new build; the result feeds the next proposal.

## Steps

1. Input: the previous build's `input.json` with the proposal it produced, and the current build's `input.json` with fresh observations in the same unit and window.
2. Run `node balance/run.mjs previous.json --md` and `node balance/run.mjs current.json --md` and keep both outputs.
3. Build the comparison by hand: per parameter, the predicted outcome, the observed outcome on the new build, case counts, windows and any change in population.
4. Draft a follow-up naming where the model missed and a likely reason (another change, a different population, a response that is not proportional).
5. Stop: if units, windows or populations differ, say the comparison is not like for like and draw no conclusion.

## Output

A local, manual comparison table and a follow-up draft for the owner.
