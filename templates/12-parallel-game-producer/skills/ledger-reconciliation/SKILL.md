---
name: ledger-reconciliation
description: "Use when a milestone brief quotes backlog totals or claims a fix is closed: derive counts from ticket rows and check each closure, including rows from Bug Desk (18)."
---

> Created by @meta_alchemist (https://x.com/meta_alchemist).
> Audit contract v1 (overrides everything below). Grade only with the installed lens. Use the owner's approved game profile for game facts, scope and budgets. Synthetic numbers illustrate one profile. Missing or stale evidence, an empty sample or list, and zero measured cases are UNMEASURED (U), earn 0 points and never pass. Record an unavailable run as NOT_RUN. A confirmed release blocker or unresolved P0 gives BLOCKED and grade 0. An unknown fixture selector must fail. Keep each ticket as a local draft. Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

# Reconcile the ledger

Check that the backlog totals quoted in a milestone brief equal the totals derived from individual ticket rows, and that every claimed closure has independent verification on the build under review.

Rubric lines this feeds: `ledger:1` (Backlog counts reconcile to ticket rows) and `ledger:2` (Closure has independent live verification).

## Steps

1. **Read a sanitized snapshot.** Take a dated, read-only tracker export with stable ticket ids. Replace people with role labels; keep names, accounts and emails out.
2. **Write ticket rows.** Each row in `snapshot.tickets` has `id`, `severity` (one of `profile.severities`, which must include `P0`) and `state` (`open` or `closed`). A closed ticket also has `sourceFix` (the change that fixed it), `fixRole`, `configState` (`verified`, `unneeded` or `disabled`) and `verification` with `gitSha`, `liveSha`, `scope`, `source`, `role` and `passed`.
3. **Map Bug Desk (18) fields.** If tickets come from Bug Desk closure rows, map them like this:

   | Bug Desk (18) | This template |
   |---|---|
   | `ticket` | `id` |
   | severity on the ticket draft | `severity` |
   | `fixer` | `fixRole` (as a role label) |
   | `verifier` | `verification.role` (as a role label) |
   | `fixedBuild` | `verification.liveSha` (must equal the pack's `liveSha`) |
   | the reviewed source revision | `verification.gitSha` (must equal the pack's `gitSha`) |
   | `replay` artifact or raw capture | `verification.source` |
   | `passed` | `verification.passed` |

4. **Copy the reported counts.** Put the totals quoted in the milestone brief in `snapshot.reportedCounts`, one number per severity.
5. **Build and grade.** From the template folder run `node engine/plan.mjs <project.json> --pack > <pack.json>`, then `node engine/lens.mjs <pack.json>`. The planner rejects duplicate ticket ids, counts open rows per severity into `counts` rows `{caseId, derived, reported}`, and checks each closed ticket into a `closure` row `{caseId, verified}`. It also counts `openP0`: open P0 tickets plus closed P0 tickets without a verified closure. Any open P0 blocks the grade.
6. **When you cannot measure.** An empty ledger leaves both lines U. A closure without a current verification (missing, or from another build or scope) leaves `ledger:2` U: say "no verified closure", never "closed". A verifier with the same role as the fixer, or a feature switch left `disabled`, is a measured failure.
7. **Keep keys stable.** Link existing ticket drafts by id and keep each id on repeat runs, so a regrade compares like with like.

## Output

- A ledger rollup: derived counts per severity beside the reported ones, and each closure with what is missing.
- `counts` and `closure` rows in the pack the planner builds, and the `openP0` count.

## Examples by genre (illustrative)

- **Racing game:** a P1 "lap timer skips on the tunnel track" closed by `code`, verified by `qa` on the current build with a replay capture.
- **Farming or life sim:** a P0 "save lost after sleeping" counts as open until a different role verifies the fix on this build.
- **Turn-based strategy game:** the brief says "two P2 open" but the export has three open P2 rows; `ledger:1` shows the mismatch.

## Pitfalls

- Copying a total from a dashboard instead of counting rows.
- Accepting a verification from an older build because the fix "has not changed".
- Treating a fix behind a switch that is still off as closed.
