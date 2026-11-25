---
name: string-inventory-and-pseudo-locale
description: "Use when building the inventory of every player-facing string and the build guard against new hard-coded text (this applies to single-language games too), and, once a second language is planned, running pseudo-locale and supported-locale captures for truncation, missing glyphs and layout."
---

> **Audit contract v1 (overrides everything below).** Created by @meta_alchemist (https://x.com/meta_alchemist).
> - Score only with the rubric embedded in `engine/lens.mjs` (`LENS.rubric`, gbf-21-access-input-localization v1.2.0). `node engine/lens.mjs <pack.json>` computes the grade; this skill only gathers evidence for it and never adds points of its own.
> - Missing evidence is UNMEASURED (0 points, not a defect). A test that did not run is NOT_RUN, never PASS. Never invent a measurement; label every worked example synthetic.
> - Game facts and budgets come from your game profile (`pack.profile`). Treat sample numbers as illustrative. A line that does not apply to your game is marked not applicable only through an approved rubric profile.
> - An automated gate needs a negative fixture that fails. Receipts carry measured values, never an unconditional PASS.
> - A measured release blocker sets the grade to 0 and the verdict to BLOCKED, whatever the other lines score.

# String inventory and pseudo-locale

Created by @meta_alchemist (https://x.com/meta_alchemist). Rubric pillar: Localization readiness.

> Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

Rubric lines this feeds: `localization-readiness:1` (string inventory) and `localization-readiness:2` (locale tests).

## 1. Which profile applies

- **One language at this release:** ask the owner to approve the `single-language` profile, then set `profile.rubricProfile` to `"single-language"` (or a list such as `["single-language", "single-input"]` when the input profile is also approved). Record who approved it, for which build and why. Under this profile `localization-readiness:2` is N/A: it is left out of the grade and never filed as a defect, and `localization-readiness:1` is worth 20 points instead of 10. Leave `locale` and `receipts.localeCaptures` out of the pack.
- **Two or more languages, or a second language planned for this release:** use the default profile (leave `single-language` out of `rubricProfile`). Both lines are worth 10 points.
- Compare grades only between packs with the same profile.

Why the inventory still counts with one language: it finds every piece of player-facing text so it can be checked for readability, corrected in one place and translated later without searching the code.

## 2. String inventory (every profile)

- Inventory every player-facing string: file, line, context (HUD, menu, dialogue, tutorial, results, store copy) and whether it lives in a string table or is hard coded in code. Record `strings.inventoryComplete`, `strings.hardcodedListed` and `strings.measuredCases`.
- Level 3 needs a complete inventory with the hard-coded strings listed. Level 4 adds a build guard that fails the build when someone adds a new hard-coded string. Plant one disposable hard-coded string, run the guard, record `strings.newHardcodedStringRejected` and a `receipts.stringGuard` row (`planted`, `rejected`, and `guardOutput` with the artifact id of the guard's output), then remove the planted string.
- Examples (illustrative): a narrative adventure's inventory is mostly dialogue lines in a script file; a mobile puzzle game has a few dozen menu and tutorial strings; a strategy game has unit names and tooltips built from parts ("{unit} attacks {target}"), which need whole-sentence entries before translation.

## 3. Locale tests (default profile only)

- Pseudo-locale: a fake language that makes text longer and swaps in accented characters, so truncation and missing glyphs show up before real translations exist. Capture it on every viewport in `profile.localeViewports`.
- Supported locales: each language in `profile.reviewLocales` on each viewport. Fonts cover the script, numbers and dates follow the locale, and no essential text is cut off.
- Record `locale.pseudoLocalePass`, `locale.supportedLocalesPass`, `locale.truncations` and `locale.measuredCases`, plus one `receipts.localeCaptures` row per locale and viewport with `locale`, `viewport`, `font`, `truncations` and `missingGlyphs`.

Record skipped capture or execution as NOT_RUN.

Keep single-language approval alongside the profile version. Remove it before grading a newly supported locale. Keep the planted guard output, and record glyph misses and essential truncations separately per locale and viewport.

## Negative fixture

Record the planted string as accepted (`rejected: false`). `localization-readiness:1` must stop at level 3.
