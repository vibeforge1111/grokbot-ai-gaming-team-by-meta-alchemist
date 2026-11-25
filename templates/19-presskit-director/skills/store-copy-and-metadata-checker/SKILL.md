---
name: store-copy-and-metadata-checker
description: "Use when writing or checking store and landing page copy: the hook shows on the first screen, every advertised feature has current build evidence, and page metadata and share previews work where you control the page."
---

> **Audit contract v1 (overrides everything below).** Created by @meta_alchemist (https://x.com/meta_alchemist).
> - Score only with the rubric embedded in `engine/lens.mjs` (`LENS.rubric`, gbf-19-store-presskit-director v1.3.0). `node engine/lens.mjs <pack.json>` computes the grade; this skill only gathers evidence for it and never adds points of its own.
> - Missing evidence is UNMEASURED (0 points, not a defect). A test that did not run is NOT_RUN, never PASS. Never invent a measurement; label every worked example synthetic.
> - Game facts and budgets come from your game profile (`pack.profile`). Treat sample numbers as illustrative. Set the frame-time budget separately for each target device in your game profile.
> - An automated gate needs a negative fixture that fails. Receipts carry measured values, never an unconditional PASS.
> Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

# Store copy, hook and share metadata

Make the first screen of each store page say what the game is, back every claim with the current build, and make links to your own pages preview correctly.

## Method
1. Hook: write one short sentence that says what the player does, in plain words. It must be visible on the first screen without scrolling (often called "above the fold") on every viewport in `profile.viewports`. Keep it within each destination's own length limit, and note the limit you checked. Examples:
   - 2D platformer: "Climb a collapsing tower one tight jump at a time."
   - Mobile puzzle game: "Slide tiles to bring a sleeping city's lights back on."
   - Turn-based strategy game: "Hold a mountain pass for 30 turns with a shrinking army."
   - Farming or life sim: "Restore a seaside farm and learn the town's secrets."
2. Capture the first screen on each viewport from a local preview, an existing public page or the owner's approved capture. Record one `receipts.hookPreviews` row per viewport with the preview version.
3. Features: list every feature the copy, tags or badges name. Each needs current evidence from the build (`copy.features`, `copy.featuresWithEvidence`). A controller support badge needs a real controller capture, "online co-op" needs a co-op session capture, and "100 levels" needs the level list from the build.
4. Metadata, only where you control the page (the game's own website, a landing page, a browser game's page): the required meta tags (title, description, preview image, card type) are present on the live page (`meta.present` against `requiredMeta`). A store page you cannot edit, such as a console store listing, has no tags you control. If none of your destinations has a page you control, the owner approves the `no-own-web-page` profile before scoring: share-metadata:1 and share-metadata:2 read N/A and their points move to the other lines. Without that approval, leave them unmeasured and say why.
5. Share previews: check how a link to your page renders where it will be shared (a chat app, a social site, a forum), using that platform's own preview tool or a local preview. "Link preview cards" in the rubric means the Open Graph and Twitter card tags that most sites read to build link previews. Record unavailable previews as NOT_RUN. Any upload or share request stays a local draft for the human (`linkPreviews`).
6. Languages: only advertise languages that ship in the build (`locClaims` growth check).

## What this fills in the pack
- `firstScreen` (the first screen of the store page on each viewport) and `receipts.hookPreviews`.
- `copy`: features named and features with evidence.
- `meta`: tags present on the live page. `linkPreviews`: previews checked and previews that rendered.
- `locClaims` (growth check, not scored).

## Pitfalls
- Cached previews lag behind edits; note the preview tool and the time of each capture.
- Tags picked for reach rather than truth bring the wrong players and more refunds.

## Negative fixture
Push the hook line below the fold on a phone capture and confirm the first-screen check fails. Name a feature with no capture and confirm entrance-and-copy:2 drops.

## Worked example (synthetic)
Synthetic example: on a phone capture the first screen shows the trailer and the short description, but the hook sentence starts on the second screen. Report: hook visible on phone false, top fix: move the hook into the first sentence of the short description and recapture on every viewport.

Tell the owner which lines this moved and which stay unmeasured.

Gather evidence for: `node engine/lens.mjs <pack.json>` (see `store-presskit-lens-engine`).
