---
name: sprite-atlas-packer
description: "Pack sprites, icons or interface art into atlases with padding and extruded edges so filtering never bleeds, for pixel art or smooth art, and prove they render clean on every device."
---

> **Audit contract v1 (overrides everything below).** Created by @meta_alchemist (https://x.com/meta_alchemist).
> - Score only with the rubric embedded in `engine/lens.mjs` (`LENS.rubric`, gbf-17-sprite-hitbox-packer v1.3.0). `node engine/lens.mjs <pack.json>` computes the grade; this skill only gathers evidence for it and never adds points of its own.
> - Missing evidence is UNMEASURED (0 points, not a defect). A test that did not run is NOT_RUN, never PASS. Never invent a measurement; label every worked example synthetic.
> - Game facts and budgets come from your game profile (`pack.profile`). Treat sample numbers as illustrative. Set the frame-time budget separately for each target device in your game profile.
> - An automated gate needs a negative fixture that fails. Receipts carry measured values, never an unconditional PASS.
> Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

# Atlas packing without bleed

Bleed is a coloured seam that appears when the renderer samples pixels from a neighbouring image in the atlas. This skill packs frames tightly while keeping every frame clean. It feeds `icons:1`, `icons:2`, `texture-weight:1`, `texture-weight:2` and the `atlas-packing` growth check, and, if your game ships install icons, `install-icons:1` and `install-icons:2`.

## 0. Ask first

Ask which art style and which packing tool the project uses, then follow only that route. Do not install tools on your own; if the tool is missing, record NOT_RUN and ask the owner.

- Pixel art: nearest filtering, usually no mipmaps, scaled by whole numbers (2x, 3x) so pixels stay square. A 1 to 2 px extruded border is often enough, but the camera can still land between pixels, so keep padding.
- Smooth high-resolution art: linear filtering, often with mipmaps. Each mip level halves the padding, so a frame that must stay clean down to mip level n needs at least 2 to the power n pixels of padding. Use premultiplied alpha if your engine supports it, to avoid dark fringes on soft edges.
- Packing tools: Unity Sprite Atlas (padding setting), Godot's atlas import, TexturePacker, an Aseprite sheet export or your own script. Record the tool name and version.

## Method

1. Trim transparent borders from each frame, then hash the trimmed pixels; identical pixels can share one slot. Keep one manifest record per source frame with its frame ID, source size, trim offset, pivot, packed rectangle and rotation. Frames with identical pixels but different pivots must keep their own pivots.
2. Pack with a rectangle packer. MaxRects (a common algorithm that places each frame in the free rectangle it fits best; "best short side fit" is a good default) works well. Record occupancy as used area divided by atlas area (`packing.occupancy`).
3. Pad every frame and extrude its edge pixels into the padding (repeat the outermost row and column outward). Record `packing.paddingPx`.
4. Check every combination you ship: each device, display size, filter and mip level from the profile. Store one row per approved combination in `receipts.atlasMatrix` with its bleed pixel count from a capture zoomed to pixel level, and record `atlas.combosRequired`, `atlas.combosChecked` and `atlas.bleedFailures`.
5. Icons: capture each icon on its supported devices at its smallest displayed size (`icons.minDisplayedPx`) and count bleed pixels (`icons.bleedPixels`).
6. Weight: record texture bytes for each representative scene (`weight.bytesPerScene`), and confirm every referenced image resolves and decodes in a complete build (`decode.referenced`, `decode.decoded`, `decode.completeBuild`).

Short examples (synthetic, for illustration only):

- Pixel-art platformer: 16 px tiles at 3x scale, nearest filtering, no mips. A one-pixel seam between ground tiles shows when the camera scrolls.
- Mobile puzzle game: smooth 256 px gem sprites shown at 64 px with mipmaps. Padding too small makes a purple fringe at mip level 2.
- Card game: large card art in one atlas per set. Texture bytes per scene matter more than occupancy.
- Farming sim: two crop frames with identical pixels that sit at different heights in the field (different pivots). Store the pixels once, keep both pivots.
- 3D game interface: inventory and map icons in an atlas drawn with linear filtering at several screen scales.

## Install icons (only if your game ships them)

Install icons are the icons a platform shows outside the game: a web app manifest, a mobile app icon set or a desktop shortcut. If the game ships none, the owner approves the `no-install-icons` profile: both lines read N/A and their 20 points are shared over the other eight lines.

- Record the sizes present in the build (`iconSet.sizesPresent`) against `requiredIconSizes` in the profile.
- Check that every icon file or URL resolves and decodes in the running build (`install.urls`, `install.resolvedAndDecoded`).
- If the running build is older than the source and simply lacks a new icon, report that as the build lagging behind, not as a broken asset (`install.liveBehindSeparated`).

## Negative fixture

Pack one test atlas with padding 0 and confirm the bleed capture shows a seam and the check fails.

## Pitfalls

- Checking only the desktop build; phones often use a different scale and filter.
- Occupancy pushed so high that frames lose their padding.
- Rotated frames in the atlas without the runtime knowing they are rotated.

Gather evidence for `node engine/lens.mjs <pack.json>` (see `sprite-hitbox-packer-lens-engine`).
