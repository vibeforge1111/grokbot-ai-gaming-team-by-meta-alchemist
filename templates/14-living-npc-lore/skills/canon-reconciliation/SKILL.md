---
name: canon-reconciliation
description: "Use when competing lore sources or reveal rules change what the NPC may say: compare claims with the active canon and test both sides of each reveal gate."
---

> Created by @meta_alchemist (https://x.com/meta_alchemist).
> Audit contract v1 (overrides everything below). Grade only with the installed lens. Use the owner's approved game profile for game facts, scope and budgets. Synthetic numbers illustrate one profile. Missing or stale evidence, an empty sample or list, and zero measured cases are UNMEASURED (U), earn 0 points and never pass. Record an unavailable run as NOT_RUN. A confirmed release blocker or unresolved P0 gives BLOCKED and grade 0. An unknown fixture selector must fail. Keep each ticket as a local draft. Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

# Resolve canon and reveals

Check that what the NPC claims matches the active canon for the scene, and that a gated fact appears only after its prerequisite holds.

Rubric lines this feeds: `canon:1` (Claims match active canon) and `canon:2` (Reveal follows its prerequisite). A gated fact revealed early is a release blocker: it sets the grade to 0.

## Steps

1. **Work from the approved snapshot only.** Use the canon revision in `profile.canonRevision`. For each assertion list its fact key, citation, effective revision, scene, reveal prerequisite and any viewpoint exception (a character's sanctioned belief or lie).
2. **Resolve conflicts.** When sources disagree, apply the owner's precedence rule. If it does not settle them, draft both readings for a human decision and leave that case out of the pack (unmeasured).
3. **Compare claims.** Normalize the NPC's claim to a fact key and compare it with the applicable canon entry, after any viewpoint exception. Under `metrics.version.samples`, write `{caseId, expected, claim}`: `expected` is the canon key, `claim` is what the NPC asserted.
4. **Play both sides of each gate.** Run the scene before the prerequisite and after it. Record the first turn the fact is disclosed against its prerequisite. Under `metrics.reveal.samples`, write one row per side, `{caseId, legal}`: true when the fact appeared only where the prerequisite held, false for an early reveal.
5. **Bind the receipts.** `version` uses an artifact with `lineId` `canon:1` and kind `static`; `reveal` uses `lineId` `canon:2` and kind `trace`. Both carry the pack's build ids, the profile scope, the `context` and a `source` (the canon sheet entry, or the trace with turn locators).
6. **Grade.** From the template folder run `node engine/lens.mjs <pack.json>`. A row with `legal: false` shows as the `early-reveal` blocker.
7. **Draft the canon diff.** List the affected turns with citations, and the exceptions the owner must approve. Keep both as local drafts.

## Output

- `metrics.version.samples` rows `{caseId, expected, claim}` and `metrics.reveal.samples` rows `{caseId, legal}`, each with its receipt.
- A local canon diff and exception list for the owner.
- A local P0 ticket candidate for each early reveal.

## Examples by genre (illustrative)

- **Turn-based strategy game:** the advisor's claim "the northern pass is open" must match revision `campaign-b`; the hidden army is gated on the scout report.
- **Mystery or detective game:** the culprit's name is gated on finding the torn letter; a witness's wrong accusation is a viewpoint exception, not a canon error.
- **Farming or life sim:** after a lore rewrite the festival moved from spring to summer; any NPC still saying spring fails `canon:1`.
- **Quiet exploration game (the worked example):** `inlet open` is allowed only after `signal heard`; an abandoned draft saying the inlet was sealed has lower precedence.

## Pitfalls

- Checking the claim against an older canon revision.
- Testing only the after-gate side of a reveal.
- Flagging a sanctioned lie as a canon error, or letting a real error hide behind an exception nobody approved.
