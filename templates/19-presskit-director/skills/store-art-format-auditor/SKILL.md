---
name: store-art-format-auditor
description: "Use when checking store art for every destination (a PC store such as Steam, itch.io, a console store, a mobile app store or your own website): each required format against that store's current spec, text contrast at displayed size, safe zones and icons."
---

> **Audit contract v1 (overrides everything below).** Created by @meta_alchemist (https://x.com/meta_alchemist).
> - Score only with the rubric embedded in `engine/lens.mjs` (`LENS.rubric`, gbf-19-store-presskit-director v1.3.0). `node engine/lens.mjs <pack.json>` computes the grade; this skill only gathers evidence for it and never adds points of its own.
> - Missing evidence is UNMEASURED (0 points, not a defect). A test that did not run is NOT_RUN, never PASS. Never invent a measurement; label every worked example synthetic.
> - Game facts and budgets come from your game profile (`pack.profile`). Treat sample numbers as illustrative. Set the frame-time budget separately for each target device in your game profile.
> - An automated gate needs a negative fixture that fails. Receipts carry measured values, never an unconditional PASS.
> Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

# Store art format check

Check every image each destination asks for against that destination's current spec, at the size players will see it.

## Destinations differ
Each store publishes its own list of required images, sizes and safe zones, and changes it over time. Read the current spec, record its version or the date you read it, and never rely on a fixed list from this skill. Examples of what a destination may ask for:
- A PC store such as Steam: several capsule images (Steam's name for its key art tiles), from a large header down to a small list thumbnail, plus a logo and a library background.
- itch.io: a cover image, screenshots, and the page's own background and text colours.
- Console stores: key art, logo layers and icon tiles for each platform. Their guidelines are often confidential: record the spec version you checked, but never copy guideline text into the pack or a public file.
- Mobile app stores: the app icon at several sizes, a feature graphic, and phone and tablet screenshots in portrait or landscape.
- The game's own website: a hero image, a share preview image and the site icons.

## Method
1. List each destination the owner approved and every format it requires. Agree one `profile.cases.destinationFormats` case per destination and format, with the expected width, height and spec version.
2. For each format, confirm size, aspect ratio and file type, and that the key art and logo sit inside the safe zone (the area the store never covers with badges, buttons or rounded corners). Record one `receipts.destinationFormats` row per case.
3. Text contrast: measure logo and title text against the art behind it, at the size the store displays it (`storeArt.textPairs`, compared with `minStoreArtContrast`; 4.5 is a common guideline for text, used here only as an example).
4. Test small sizes: the smallest image must still show the title legibly.
5. Icons: for a website or browser game, the site icon, web app manifest and touch icons must load and decode on the live page. For a mobile or console listing, decode each icon file exactly as you will submit it, and say so in the artifact. If no destination takes icons from you, leave icons-and-install:1 unmeasured.
6. Recheck every format when a destination changes its spec, and before each big update.

## What this fills in the pack
- `storeArtFormats`: formats checked and formats passing across all destinations (the group is named after Steam capsules, but it covers every store image format), plus `receipts.destinationFormats`.
- `storeArt`: text and background colour pairs at displayed size.
- `icons`: required icons (`urls`, a URL or a file path each) and how many decode (`decodedLive`).

## Pitfalls
- A crop that works at full size often cuts the logo in the smallest format.
- A store's tinted or dark background changes contrast; check on the background the store actually uses.

## Negative fixture
Move the logo of one format outside the safe zone and confirm the format check fails. Record one format against an old spec version and confirm its `destinationFormats` case fails.

## Worked examples (synthetic)
- Synthetic example, PC store: 7 required formats checked against the spec version noted on the page, 6 pass; the smallest tile crops the logo's last letter. Report: formatsChecked 7, formatsPassing 6, top fix: a tighter logo lockup for the small tile, then recapture.
- Synthetic example, mobile puzzle game in two app stores: 5 icon sizes and 2 screenshot sets per store all pass, but the title on the feature graphic measures 3.1 against a profile minimum of 4.5. Report: media:2 passes, icons-and-install:2 below pass, top fix: a darker panel behind the title.

Tell the owner which lines this moved and which stay unmeasured.

Gather evidence for: `node engine/lens.mjs <pack.json>` (see `store-presskit-lens-engine`).
