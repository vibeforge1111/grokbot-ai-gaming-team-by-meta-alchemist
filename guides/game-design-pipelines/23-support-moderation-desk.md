# Community Support and Moderation Desk in your pipeline

Created by @meta_alchemist (https://x.com/meta_alchemist).

Prepare support replies, moderation reviews and case digests from redacted local intake.

**Status: preview, not shipping.** The template works and its tests pass, but it is not held to the release standard. It still uses lens-kit 1.1.0, it has no pack producer with receipts, and most lines read counts the pack writer declares by hand. Use it to draft replies and digests. Do not treat the grade as a release gate. The template README lists the remaining ship blockers.

Template folder: [templates/23-support-moderation-desk](../../templates/23-support-moderation-desk/). Install and prompts: [HOW-TO-USE.md](../../templates/23-support-moderation-desk/HOW-TO-USE.md), [PROMPTS.md](../../templates/23-support-moderation-desk/PROMPTS.md).

## When to use it

- **Stage:** Live support and community operations, after a playable build is in testers' or players' hands.
- **Trigger:** When you are drafting support replies or moderation reviews from local, redacted intake.

## Inputs and outputs

- **Inputs:** Your game profile (`game-profile`), an evidence pack (`evidence-pack`), and, when you have them, an incident report, an entitlement ledger, and a patch-notes draft.
- **Outputs:** Local support-case drafts and a digest (`support-case-draft`), a 100-point grade (`grade-record`), and local ticket drafts (`ticket-draft`). Nothing is sent or filed until you do it.

## Handoffs

- **Takes from:** Redacted local intake, and optional files from Ledger (24), Live Service Trust (22), and Streamer and Patch Notes (20).
- **Hands to:** Bug Desk (18) for ticket drafts; Ledger (24) when a case is about a claim or refund; Producer (12) if you use the grade as a milestone note. The human reviews every draft.
- **Exchange folder:** `.grokbot-team/artifacts/<artifact-id>/` in your game project. Nothing is sent anywhere.

## Recommended process

1. **Set up once:** run `support-desk-getting-started` and answer its questions one at a time. Write the answers into your game profile.
2. **Intake:** run `support-desk-ticket-intake` on redacted local cases. Do not paste personal data or secrets into the chat.
3. **Review:** use `support-desk-scam-moderation` and `support-desk-kb-approval-batch` for the reviews you actually need, then `support-desk-daily-digest` for a digest draft.
4. **Grade:** `node engine/lens.mjs fixtures/good-pack.json` from the template folder shows the synthetic example (verdict PASS, grade 100/100). For a real pack, run `node engine/lens.mjs <pack.json>`. Until a producer with receipts ships, treat declared metrics as provisional.
5. **File locally:** keep drafts in your exchange folder. You decide what is sent or filed.

