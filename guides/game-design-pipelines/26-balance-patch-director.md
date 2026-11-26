# Live-Ops Balance Patch Director in your pipeline

Created by @meta_alchemist (https://x.com/meta_alchemist).

Compare configurable numeric parameters with observed outcomes and draft bounded, reversible changes.

**Status: preview, not shipping.** The template works and its tests pass, but it is not held to the release standard. It still uses lens-kit 1.1.0, it has no pack producer with receipts, some checks compare a model with itself, and authority lines probe this template's own code. Use it to draft a reversible change. Do not treat the grade as a release gate. The template README lists the remaining ship blockers.

Template folder: [templates/26-balance-patch-director](../../templates/26-balance-patch-director/). Install and prompts: [HOW-TO-USE.md](../../templates/26-balance-patch-director/HOW-TO-USE.md), [PROMPTS.md](../../templates/26-balance-patch-director/PROMPTS.md).

## When to use it

- **Stage:** Live, or late production when numeric balance is already in a playable build.
- **Trigger:** When you are comparing numeric balance values with observed outcomes.

## Inputs and outputs

- **Inputs:** Your game profile (`game-profile`), an evidence pack (`evidence-pack`), and, when you have them, a support-case draft, a cohort report, and an economy-change list.
- **Outputs:** A local balance-patch draft and patch-notes draft (`balance-patch-draft`), a 100-point grade (`grade-record`), and local ticket drafts (`ticket-draft`).

## Handoffs

- **Takes from:** Observed outcomes you supply, and optional files from Economy (06), Support Desk (23), and Retention (27).
- **Hands to:** Streamer and Patch Notes (20) for a notes draft after you approve the change; Bug Desk (18) for ticket drafts; Producer (12) for the go or hold call. The human reviews every draft.
- **Exchange folder:** `.grokbot-team/artifacts/<artifact-id>/` in your game project. Nothing is sent anywhere.

## Recommended process

1. **Set up once:** run `balance-director-getting-started` and answer its questions one at a time.
2. **Propose:** run `balance-director-weekly-proposal` against the observed outcomes you have. Keep every change bounded and reversible.
3. **Notes and follow-up:** use `balance-director-patch-notes-draft` for a local notes draft, and `balance-director-post-release-read` after the next build exists. Until a post-release compare tool ships, treat a self-compare as provisional.
4. **Grade:** `node engine/lens.mjs fixtures/good-pack.json` shows the synthetic example (verdict PASS, grade 100/100). For a real pack, run `node engine/lens.mjs <pack.json>`.
5. **File locally:** you decide what is sent or shipped.

