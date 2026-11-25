---
name: live-ops-incident-drill-and-build-identity
description: "Record which build is really published or running and compare it with the graded build; for a game with a running service, also review an owner-run health, incident and rollback drill."
---

> **Audit contract v1 (overrides everything below).** Created by @meta_alchemist (https://x.com/meta_alchemist).
> - Score only with the rubric embedded in `engine/lens.mjs` (`LENS.rubric`, gbf-22-live-service-trust v1.2.0). `node engine/lens.mjs <pack.json>` computes the grade; this skill only gathers evidence for it and never adds points of its own.
> - Missing evidence is UNMEASURED (0 points, not a defect). A test that did not run is NOT_RUN, never PASS. Never invent a measurement; label every worked example synthetic.
> - Game facts and budgets come from your game profile (`pack.profile`). Treat sample numbers as illustrative. A line that does not apply to your game is marked not applicable only through an approved rubric profile.
> - An automated gate needs a negative fixture that fails. Receipts carry measured values, never an unconditional PASS.
> - A measured release blocker sets the grade to 0 and the verdict to BLOCKED, whatever the other lines score.

Created by @meta_alchemist (https://x.com/meta_alchemist).

> Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

# Review service operations

Two checks. Build identity applies to every shipped game; the incident and rollback drill applies only to a game with a running service (servers, a backend, or a web build you deploy).

## Build identity (every game)

Record the running or published build identifier, the source revision it came from and its effective configuration. The grade is only valid for that build. For an offline game, this is the build players can download from the store page; for an online game, it is the build the servers are running. Note whether the live build is behind the graded one (`live.liveBehindRecorded`). Feeds `operations:1`, with one row per approved case in `receipts.runningBuild`.

## Incident drill and rollback (running services only)

1. Select health signals that represent the player journey. A puzzle game's cloud save service might track save success and restore time. A multiplayer service might also track session starts, queue delay and reconnect outcomes.
2. Review a rehearsal run by the owner in an isolated test deployment. Production evidence is read-only.
3. Keep any incident message, paging or rollback instructions as a local draft for the human.
4. Record when the issue was detected, which signals changed, how recovery was verified and which build was restored. Include what happened to work in progress, such as a save or an active session.
5. Label recovery paths that were never exercised as unmeasured.

Feeds `operations:2`, with one row per approved case in `receipts.rollback`. A game with no running service leaves the `ops` group out and reports `operations:2` as "does not apply".

Keep the drill log and acceptance criteria beside the grade so an independent reviewer can verify the outcome.

Gather evidence for `node engine/lens.mjs <pack.json>`.

Record skipped capture or execution as NOT_RUN.
