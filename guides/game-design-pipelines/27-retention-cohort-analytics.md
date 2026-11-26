# Retention and Cohort Analytics in your pipeline

Created by @meta_alchemist (https://x.com/meta_alchemist).

Measure mature return cohorts with uncertainty ranges and draft a privacy-preserving review.

**Status: preview, not shipping.** The template works and its tests pass, but it is not held to the release standard. It still uses lens-kit 1.1.0, it has no pack producer with receipts, segment assignment can depend on row order, and some lines probe this template's own code or planted rows. Use it to draft a cohort read. Do not treat the grade as a release gate. The template README lists the remaining ship blockers.

Template folder: [templates/27-retention-cohort-analytics](../../templates/27-retention-cohort-analytics/). Install and prompts: [HOW-TO-USE.md](../../templates/27-retention-cohort-analytics/HOW-TO-USE.md), [PROMPTS.md](../../templates/27-retention-cohort-analytics/PROMPTS.md).

## When to use it

- **Stage:** Live, once you have mature return data you can review without personal data.
- **Trigger:** When you want a privacy-preserving read of who returns, by cohort.

## Inputs and outputs

- **Inputs:** Your game profile (`game-profile`), an evidence pack (`evidence-pack`), and, when you have them, a lobby-fill proposal and a balance-patch draft.
- **Outputs:** A local cohort report (`cohort-report`), a 100-point grade (`grade-record`), and local ticket drafts (`ticket-draft`).

## Handoffs

- **Takes from:** Local, privacy-preserving cohort tables you supply, and optional files from Matchmaking (25) and Balance Patch (26).
- **Hands to:** Balance Patch (26) and Economy (06) as context for a change; Producer (12) for a milestone note; Bug Desk (18) for ticket drafts. The human reviews every draft.
- **Exchange folder:** `.grokbot-team/artifacts/<artifact-id>/` in your game project. Nothing is sent anywhere.

## Recommended process

1. **Set up once:** run `retention-cohorts-getting-started` and answer its questions one at a time. Agree how a segment is assigned and how uncertainty is reported.
2. **Export check:** run `retention-cohorts-export-check` on your local export before you grade it. Strip personal data first.
3. **Report:** run `retention-cohorts-weekly-report` or `retention-cohorts-release-compare` when you have two mature windows to compare. Until those tools are more than prompts, say so in the report.
4. **Grade:** `node engine/lens.mjs fixtures/good-pack.json` shows the synthetic example (verdict PASS, grade 100/100). For a real pack, run `node engine/lens.mjs <pack.json>`.
5. **File locally:** you decide what is sent or filed.

