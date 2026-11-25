---
name: severity-and-regression-bisect
description: "Use when setting a bug's severity and confidence, keeping P0 to the scopes your profile allows, sending grading mistakes to the audit fix list instead of the bug list, and bisecting a working repro to the change that introduced the bug."
---

> **Audit contract v1 (overrides everything below).** Created by @meta_alchemist (https://x.com/meta_alchemist).
> - Score only with the rubric embedded in `engine/lens.mjs` (`LENS.rubric`, gbf-18-bug-desk-triage v1.3.0). `node engine/lens.mjs <pack.json>` computes the grade; this skill only gathers evidence for it and never adds points of its own.
> - Missing evidence is UNMEASURED (0 points, not a defect). A test that did not run is NOT_RUN, never PASS. Never invent a measurement; label every worked example synthetic.
> - Game facts and budgets come from your game profile (`pack.profile`). Treat sample numbers as illustrative. Set the frame-time budget separately for each target device in your game profile.
> - An automated gate needs a negative fixture that fails. Receipts carry measured values, never an unconditional PASS.
> Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

# Severity, confidence and regression bisect

Rubric lines this feeds: `severity:1` and `severity:2`. Growth check (reported beside the grade, never scored): `p0-response`.

## Words used here

- **Severity:** how bad the bug is for players. P0 is the top level: stop and fix now.
- **Confidence:** how sure the evidence is. A P0 with low confidence stays P0 and gets more evidence.
- **Audit defect:** a mistake in the review itself (a wrong rubric reading, a broken capture, a script error), not a bug in the game.
- **Regression:** something that used to work and broke in a later build.
- **Bisect:** test the builds or commits between the last good one and the first bad one, halving the range each time, until you find the change that introduced the bug.

## Method

1. Record severity and confidence as separate fields on every ticket: `severity.tickets`, each with `severity`, `scope` and `confidenceRecorded`. Never raise severity because confidence is high or because a report is loud.
2. Use P0 only in the scopes your profile allows (`profile.p0Scopes`). The pack lists the scopes actually used for P0 (`severity.p0ScopesUsed`). Examples (illustrative): an online game with purchases might allow `payments`, `entitlements` and `saved-state`; a single-player offline game might allow only `saved-state` and `crash-on-start`; a co-op game might add `session-join`.
3. Send audit defects to the audit fix list, not the game bug list. Count them (`routing.auditDefects`) and how many went to the audit list (`routing.routedToAuditList`). Draft each correction locally for human review.
4. Bisect. With a working repro from `minimal-repro-builder`, run it across the commits or builds between the last good and the first bad build. Use the time and run budget agreed with the owner. Skip commits that do not build or give an inconclusive result, and report the remaining range. Record the first verified bad commit and the files it touched in the local ticket draft.
5. P0 response time. Record the age in hours of the oldest open P0 in `sla.p0OpenHoursMax`, with a positive `sla.measuredCases`. If there is no open P0, leave `sla` out; the check reads U.

## Examples (illustrative)

- Racing game: one tester saw a replay ghost car drift off the track. Severity P2 (the race still finishes), confidence low (one sighting). Not P0, however sure the tester is.
- Narrative adventure: a choice is forgotten after loading a save. Scope `saved-state`, so P0 if the profile allows that scope; confidence rises to high once a replay fails every time.
- 3D arena game: a crash at round end that started recently. Bisecting between the last good build and the first bad one finds one commit that changed the scoreboard; three inconclusive builds are listed as inconclusive, not as good.

## Negative fixture

Mark a known good commit as bad in a test bisect and confirm the result is flagged as inconsistent. For the line itself: a pack that uses P0 for a scope that is not in `profile.p0Scopes` must drop `severity:1`.

## Pitfalls

- Bisecting a flaky bug with too few runs per step. Use the profile's run limits and mark inconclusive steps.
- Severity raised by how loud a report is rather than how many players it reaches.
- Filing a broken capture or a wrong rubric reading as a game bug.

Gather evidence for: `node engine/lens.mjs <pack.json>` (see `bug-desk-triage-lens-engine`).
