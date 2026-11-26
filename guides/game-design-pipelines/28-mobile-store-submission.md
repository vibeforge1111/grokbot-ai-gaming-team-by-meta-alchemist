# Mobile App Store Submission in your pipeline

Created by @meta_alchemist (https://x.com/meta_alchemist).

Review target-specific evidence and draft a store readiness checklist for a human release owner.

**Status: preview, not shipping.** The template works and its tests pass, but it is not held to the release standard. It still uses lens-kit 1.1.0, it has no pack producer with receipts, the second non-Capacitor example is still missing, and one line probes this template's own code. Use it to draft a checklist. The human submits the build. Do not treat the grade as a release gate. The template README lists the remaining ship blockers.

Template folder: [templates/28-mobile-store-submission](../../templates/28-mobile-store-submission/). Install and prompts: [HOW-TO-USE.md](../../templates/28-mobile-store-submission/HOW-TO-USE.md), [PROMPTS.md](../../templates/28-mobile-store-submission/PROMPTS.md).

## When to use it

- **Stage:** Ship, when a mobile build is otherwise ready for a person to submit.
- **Trigger:** When a mobile build needs a store readiness checklist before a person submits it.

## Inputs and outputs

- **Inputs:** Your game profile (`game-profile`), an evidence pack (`evidence-pack`), and, when you have them, a store-asset manifest, an access report, trust records, and an entitlement ledger.
- **Outputs:** A local store-submission checklist (`store-submission-checklist`), a 100-point grade (`grade-record`), and local ticket drafts (`ticket-draft`).

## Handoffs

- **Takes from:** Store Page and Presskit (19) for assets, Access, Input and Localization (21) for access evidence, Live Service Trust (22) and Ledger (24) when those records exist.
- **Hands to:** Producer (12) for the go or hold call; Bug Desk (18) for ticket drafts on gaps. The human submits the build. The bot never submits it.
- **Exchange folder:** `.grokbot-team/artifacts/<artifact-id>/` in your game project. Nothing is sent anywhere.

## Recommended process

1. **Set up once:** run `store-submission-getting-started` and answer its questions one at a time, including the target storefront.
2. **Checklist:** run `store-submission-checklist` against the evidence you have. Use `store-submission-owner-answers` for questions only the owner can answer, and `store-submission-code-brief` for a local brief to your coding agent.
3. **Grade:** `node engine/lens.mjs fixtures/good-pack.json` shows the synthetic example (verdict PASS, grade 100/100). For a real pack, run `node engine/lens.mjs <pack.json>`.
4. **Stop before submit:** keep the checklist as a local draft. The release owner submits the build in the store console.

