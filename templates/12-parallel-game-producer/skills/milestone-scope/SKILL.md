---
name: milestone-scope
description: "Use when a milestone needs a bounded set of deliverables, each with a role, done condition, proof and hours estimate, and a capacity check per role and wave."
---

> Created by @meta_alchemist (https://x.com/meta_alchemist).
> Audit contract v1 (overrides everything below). Grade only with the installed lens. Use the owner's approved game profile for game facts, scope and budgets. Synthetic numbers illustrate one profile. Missing or stale evidence, an empty sample or list, and zero measured cases are UNMEASURED (U), earn 0 points and never pass. Record an unavailable run as NOT_RUN. A confirmed release blocker or unresolved P0 gives BLOCKED and grade 0. An unknown fixture selector must fail. Keep each ticket as a local draft. Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

# Plan a milestone

Turn the owner's decision into a bounded list of deliverables, each with someone accountable, a done condition, a named proof and an hours estimate, and check that no role is booked past its hours in any wave.

Rubric lines this feeds: `milestone:1` (Milestone work has acceptance evidence) and `milestone:2` (Role load fits wave capacity).

## Steps

1. **Start from the ask.** Write down the owner's decision and the smallest playable proof that would support it. Everything else is a candidate for the cut.
2. **Split the work by deliverable.** For each one add a task to `snapshot.tasks` with `id` (a stable local key), `role` (an anonymous label from `profile.hoursByRole`), `needs` (the ids it waits for), `locks` (resource keys only it may change), `hours`, `accept` (the done condition) and `proof` (the name of the receipt that will show it is done, for example `shift trace`).
3. **Put deferrable work under an explicit cut.** List it in the scope fact or slide as a proposal, not as a task, so it does not consume hours.
4. **Record what actually ran.** When a task runs, add its run receipt to `snapshot.runs`: `id` (the task id), `gitSha`, `liveSha`, `scope`, `source`, `wave`, `passed` and optionally `expiresAtTick`. The run's `source` must equal the task's `proof`; that is how `milestone:1` knows the named proof exists.
5. **Check the load.** Run `node engine/plan.mjs <project.json> --plan` from the template folder. The planner sums task hours per role and observed wave; the pack holds one `capacity` row `{caseId, role, hours}` per role and wave, compared with `profile.hoursByRole[role]`.
6. **Build and grade.** `node engine/plan.mjs <project.json> --pack > <pack.json>`, then `node engine/lens.mjs <pack.json>`. The `scope` group holds one row `{caseId, testable}` per task.
7. **When you cannot measure.** A task with no run receipt yet, or one from another build or scope, makes `milestone:1` U; planned work that has not run is not yet evidence. A task without an hours estimate, or one not yet placed in a run wave, leaves `milestone:2` U. Ask for the missing estimate instead of guessing.

## Output

- The scope table: one task row per deliverable, the explicit cut, and unresolved estimates.
- `scope` rows `{caseId, testable}` and `capacity` rows `{caseId, role, hours}` in the pack the planner builds.
- A list of roles over their hours, by wave.

## Examples by genre (illustrative)

- **2D platformer:** tasks `level-1-1` (role `design`, proof `level 1-1 playthrough`), `tileset` (role `art`, proof `tileset review capture`), each with its hours.
- **Mobile puzzle game:** tasks for each block of ten levels, with proof `solver run for levels 1 to 10`.
- **Narrative adventure:** tasks for each scene script and its voice session, locking the scene file so two writers do not edit it at once.
- **Solo developer:** roles `code` and `art` with the hours you can really give each per wave.

## Pitfalls

- A `proof` that names a document nobody will produce. It must match a run receipt's `source` once the task runs.
- Booking one role on two tasks in the same wave. The planner treats a role as a lock.
- Counting the cut work in the hours.
