---
name: presskit-zip-zero-leak-compiler
description: "Use when assembling a presskit: factsheet, logos and media from the current build, rights records, and nothing private inside the archive."
---

> **Audit contract v1 (overrides everything below).** Created by @meta_alchemist (https://x.com/meta_alchemist).
> - Score only with the rubric embedded in `engine/lens.mjs` (`LENS.rubric`, gbf-19-store-presskit-director v1.3.0). `node engine/lens.mjs <pack.json>` computes the grade; this skill only gathers evidence for it and never adds points of its own.
> - Missing evidence is UNMEASURED (0 points, not a defect). A test that did not run is NOT_RUN, never PASS. Never invent a measurement; label every worked example synthetic.
> - Game facts and budgets come from your game profile (`pack.profile`). Treat sample numbers as illustrative. Set the frame-time budget separately for each target device in your game profile.
> - An automated gate needs a negative fixture that fails. Receipts carry measured values, never an unconditional PASS.
> Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

# Presskit assembly

Build one archive that a journalist or creator can use without asking you anything, and make sure nothing private is inside it.

## Method
1. Contents: a press page (on the game's own website, an itch.io page or a press kit service), a factsheet (name, developer, platforms, price model, languages, a short description and a contact route), a logo pack, and screenshots or clips from the current build (`presskit.has`, `media.items`, `media.decodedCurrentBuild`).
2. Media: decode every screenshot and clip, confirm it comes from the current build, and link its rights record. Record one `receipts.decodedMedia` row per item.
3. Rights: a record for every third-party asset, font and music track. Age rating, privacy and support links point to your trust records: the age rating result, the privacy policy and the support contact. Template 22 can draft these (`obligations`).
4. Leak check before packaging: no secrets, internal paths, unreleased content, player names or private chat in any file or in its metadata (image EXIF data, document comments, project paths inside video files).
5. Package, then extract the final archive locally, scan its contents and metadata again, and decode each media file. Record the archive digest (its SHA-256 fingerprint), the member count and the scan result in `receipts.archiveReview` and `presskit.archiveScanClean`.
6. Withhold the local handoff draft until every final member and its metadata have been scanned against the same archive digest. Include decode and rights references per media item.

## Pitfalls
- Old screenshots from a previous build contradict the current game; regenerate them.
- Image metadata often carries the capture machine's user name or folder path.

## Negative fixture
Drop a file with a private path or a key in its metadata into a test kit and confirm the leak scan fails. Rebuild the archive after the scan and confirm the stale digest fails `archiveReview`.

## Worked examples (synthetic)
- Synthetic example, racing game: the kit has 24 files; the scan finds one screenshot whose metadata carries a local user path and one build note with an internal ticket id. Report: 2 leaks, kit blocked until both are removed and the scan reruns clean.
- Synthetic example, narrative adventure: the factsheet lists 5 languages but the build ships 3. Report: the `localization-claims` growth check fails; fix the factsheet, not the build.

The weekly review lists stale preview versions and missing rights references.

Tell the owner which lines this moved and which stay unmeasured.

Gather evidence for: `node engine/lens.mjs <pack.json>` (see `store-presskit-lens-engine`).
