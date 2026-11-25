---
name: rights-privacy-and-safety-review
description: "Use when checking that privacy, data retention, age gating, asset and music rights, player safety, moderation and support records exist and are complete. Never gives legal sign-off."
---

> **Audit contract v1 (overrides everything below).** Created by @meta_alchemist (https://x.com/meta_alchemist).
> - Score only with the rubric embedded in `engine/lens.mjs` (`LENS.rubric`, gbf-22-live-service-trust v1.2.0). `node engine/lens.mjs <pack.json>` computes the grade; this skill only gathers evidence for it and never adds points of its own.
> - Missing evidence is UNMEASURED (0 points, not a defect). A test that did not run is NOT_RUN, never PASS. Never invent a measurement; label every worked example synthetic.
> - Game facts and budgets come from your game profile (`pack.profile`). Treat sample numbers as illustrative. A line that does not apply to your game is marked not applicable only through an approved rubric profile.
> - An automated gate needs a negative fixture that fails. Receipts carry measured values, never an unconditional PASS.
> - A measured release blocker sets the grade to 0 and the verdict to BLOCKED, whatever the other lines score.

# Rights, privacy and safety review

Created by @meta_alchemist (https://x.com/meta_alchemist). Rubric pillar: Privacy, age, rights, safety and support.

> Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

Every game needs this, including a free offline game. Check as files, never as opinions:
- Privacy policy and data map: what is collected (including analytics and crash reports), where it is stored, how long it is kept, how a player deletes it.
- Age: the stated age rating and how the game gates or informs it, including paid features.
- Rights inventory: every third-party asset, font, sound and music track with its licence record.
- Safety: chat or name moderation, report and block paths, and streamer mode redaction (see Streamer and Patch Notes, template 20).
- Support: a reachable support contact, and a refund path for paid items.

Mark an item "does not apply" when the game has no such feature, and say why: no chat means no chat moderation; nothing for sale means no refund path; no data collected means a one-line privacy statement that says so.

Output: a checklist of present, missing or incomplete records with file paths. Legal sign-off stays human: record who gave it and when, or mark it missing. Store Page and Presskit (template 19) checks store claims about these areas against your records.

Short examples (illustrative only): a narrative adventure with licensed music needs each track's licence; a mobile puzzle game with ads needs its ad partner in the data map; a co-op farming sim with chat needs report and block paths; a game for young players needs its age gate and parental notice.

Cite the dated reviewer receipt and records for deletion, retention, age, safety and support. The human reviews and delivers any local store or contest submission draft.

Record skipped capture or execution as NOT_RUN.

For retention, link the retention policy and a dated sample of its execution. For deletion, link the request and sanitized completion record. For rights, age, safety and support, retain the qualified reviewer role and disposition for each reference. Leave inaccessible records U.
