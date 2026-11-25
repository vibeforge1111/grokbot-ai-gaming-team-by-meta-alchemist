---
name: persistence-fault-injection
description: "For every game that keeps player progress, sold or free: check that each save path keeps acknowledged progress through storage failures, corrupted or old saves, crashes and interruptions, from owner-run tests in a disposable copy."
---

> **Audit contract v1 (overrides everything below).** Created by @meta_alchemist (https://x.com/meta_alchemist).
> - Score only with the rubric embedded in `engine/lens.mjs` (`LENS.rubric`, gbf-22-live-service-trust v1.2.0). `node engine/lens.mjs <pack.json>` computes the grade; this skill only gathers evidence for it and never adds points of its own.
> - Missing evidence is UNMEASURED (0 points, not a defect). A test that did not run is NOT_RUN, never PASS. Never invent a measurement; label every worked example synthetic.
> - Game facts and budgets come from your game profile (`pack.profile`). Treat sample numbers as illustrative. A line that does not apply to your game is marked not applicable only through an approved rubric profile.
> - An automated gate needs a negative fixture that fails. Receipts carry measured values, never an unconditional PASS.
> - A measured release blocker sets the grade to 0 and the verdict to BLOCKED, whatever the other lines score.

Created by @meta_alchemist (https://x.com/meta_alchemist).

> Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

# Test persistence and recovery

Every game that keeps player progress needs this, whether or not it sells anything. It checks that progress survives storage failures and interruptions.

## Method

1. List each storage path the build actually supports, such as local save slots, cloud sync, an offline queue that uploads later, or a server database. Define when a save counts as acknowledged (the moment the game tells the player it is saved) and what recovery the player is promised.
2. Only the owner runs fault injection (causing a failure on purpose) in an approved disposable test copy, with fault switches off by default. This skill reviews the owner's traces.
3. Review each storage case in the profile's `storageCases`, for example storage unavailable, a truncated or corrupted save, a save from an older schema (version), and interruption during a write.
4. Review each interruption case in the profile's `recoveryCases`, for example a crash, the same account on two devices at once, or an update deployed during play.
5. Reopen the game and compare the recovered progress, inventory and version with the expected state, by digest.
6. Record the starting fixture, build, storage outcome and what the player saw. A fallback that reports success while losing acknowledged progress is a failing case.

## Short examples (synthetic, for illustration only)

- Narrative adventure, offline: power is cut while the game writes save slot 2; on restart slot 2 holds the last complete save, never a half-written one.
- Mobile puzzle game: the phone is offline for three levels; the offline queue uploads all three when the connection returns, without duplicates.
- Farming sim: the game crashes during the end-of-day autosave; the farm reloads at the start of that day, not empty.
- Co-op game with a server: the database is briefly unavailable; the server refuses new saves with a clear message instead of reporting success.

## What it feeds in the pack

- `storage`: `cases` (must cover every entry in `storageCases`) and `stateLost`. For each approved case in `profile.cases.storageOutcomes`, one row in `receipts.storageOutcomes` with the expected and recovered state digests. Feeds `durability-and-recovery:1`.
- `recovery`: `cases` (must cover every entry in `recoveryCases`) and `unrecovered`, with matching rows in `receipts.recoveryOutcomes`. Feeds `durability-and-recovery:2`. A game with no online service lists only the interruptions it can have, such as a crash.

Gather evidence for `node engine/lens.mjs <pack.json>`.

Record skipped capture or execution as NOT_RUN.
