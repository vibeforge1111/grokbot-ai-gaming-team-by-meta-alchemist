---
name: sprite-palette-and-readability-checker
description: "Check that reward, item or collectible art reads at its displayed size and that colour tiers and palette swaps stay distinct and match the palette rules."
---

> **Audit contract v1 (overrides everything below).** Created by @meta_alchemist (https://x.com/meta_alchemist).
> - Score only with the rubric embedded in `engine/lens.mjs` (`LENS.rubric`, gbf-17-sprite-hitbox-packer v1.3.0). `node engine/lens.mjs <pack.json>` computes the grade; this skill only gathers evidence for it and never adds points of its own.
> - Missing evidence is UNMEASURED (0 points, not a defect). A test that did not run is NOT_RUN, never PASS. Never invent a measurement; label every worked example synthetic.
> - Game facts and budgets come from your game profile (`pack.profile`). Treat sample numbers as illustrative. Set the frame-time budget separately for each target device in your game profile.
> - An automated gate needs a negative fixture that fails. Receipts carry measured values, never an unconditional PASS.
> Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

# Item art, colour tiers and palette check

Use this when the game shows reward, item or collectible art (loot, cards, medals, crops, stickers, unlocks), when items are told apart by colour tiers, or when sprites are recoloured by palette swaps. It feeds `reward-art:1` and `reward-art:2`. If it has no colour tiers, the owner approves the `no-item-tiers` profile and `reward-art:2` reads N/A. If the game has no such art at all, `reward-art:1` has no profile and stays U. N/A and U are never defects.

## 0. Ask first

Ask which of these the game has, then check only those. Examples (synthetic, for illustration only):

- Action RPG or looter: common, rare and epic item frames.
- Card game: card rarity gems on the card border.
- Sports or racing game: bronze, silver and gold medals or trophies.
- Farming sim: crop quality stars in three colours.
- Mobile puzzle game: booster icons in a shop strip.
- Pixel-art game with palette swaps: one enemy sprite recoloured for each region.

## Method

1. Readability: render each item icon at the size the interface actually shows it on each device (`itemArt.minDisplayedPx`, `itemArt.unreadable`). Check it with the real filter setting; icons that look fine in an atlas preview often blur after mipmapping.
2. Colour drift: pair each approved reference colour with the colour actually drawn for that tier (`tierPalette.pairs`) and compare the largest difference with `maxTierPaletteDeltaE`.
3. Tier separation: measure the colour difference between each pair of distinct tiers in `receipts.tierSeparation` and compare it with `minTierDeltaE`. Review the tiers under simulated colour blindness as well. A tier must also read from shape, icon or label, not colour alone.
4. Palette swaps: if you recolour sprites with a lookup table (a LUT, a small image that maps each source colour to a new one), check the swapped output against the palette rules, not the source art.
5. Lit sprites: if sprites use normal maps for lighting, check that the apparent light direction does not flip between frames.

## Negative fixture

Change one drawn colour far from its reference and confirm the drift check fails. For the tier check, bring two distinct tiers close together and verify the separation check fails while their shape or label still tells them apart.

## Pitfalls

- Thresholds (`maxTierPaletteDeltaE`, `minTierDeltaE`, `minItemArtPx`) come from your profile, not from this skill.
- Checking tiers on a desktop monitor only; phone screens shift colours.

Gather evidence for `node engine/lens.mjs <pack.json>` (see `sprite-hitbox-packer-lens-engine`).
