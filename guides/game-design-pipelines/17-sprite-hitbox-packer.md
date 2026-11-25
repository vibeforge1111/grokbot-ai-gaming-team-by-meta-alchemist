# 2D Sprite Atlas & Hitbox Packer in your pipeline

Created by @meta_alchemist (https://x.com/meta_alchemist).

Pack sprites into atlases and check their silhouettes, hitboxes, palettes and memory use on your target devices. It works for pixel art and smooth high-resolution art, and for hit shapes of every kind: attack hitboxes, platform collision, pickups and click or tap areas.

Template folder: [templates/17-sprite-hitbox-packer](../../templates/17-sprite-hitbox-packer/). Install and prompts: [HOW-TO-USE.md](../../templates/17-sprite-hitbox-packer/HOW-TO-USE.md), [PROMPTS.md](../../templates/17-sprite-hitbox-packer/PROMPTS.md).

## When to use it

- **Stage:** Production
- **Trigger:** Whenever sprites, icons, interface art or animations change, in a 2D game or in the 2D art of a 3D game.

## Inputs and outputs

- **Inputs:** Sprite frames, animation lists, palette files, and the art style (pixel art or smooth) and packing tool you use.
- **Outputs:** Packed atlas, hitbox data, palette variants, a size report.

## Handoffs

- **Takes from:** Art pipeline.
- **Hands to:** Game Feel and the team validating the animation in play.
- **Findings:** one local ticket draft per finding for the human to review and file. Bug Desk (18) prepares the draft.

## Recommended process

1. **Set up once:** run `sprite-hitbox-packer-getting-started`. It asks about your art style, packing tool and which features your game has (hit shapes, a height layer, install icons, colour tiers), then helps you write the values into your game profile. A missing feature selects its profile (`no-hit-shapes`, `no-height-layer`, `no-install-icons` or `no-item-tiers`), which you approve before scoring and which goes in `rubricProfile` in the game profile. Those lines read N/A, their points move to the lines that still apply, and the verdict can reach PASS.
2. **Get a pack:** Use your CI run or a manual capture for this build. Playtest QA (template 02) is coming later.
3. **sprite-atlas-packer:** Pack sprites, icons or interface art into atlases with padding and extruded edges so filtering never bleeds, for pixel art or smooth art, and prove they render clean on every device. Also covers install icons if your game ships them.
4. **sprite-hit-shape-checker:** Check the shapes the game uses to decide what touches what (attack hitboxes, platform collision, pickups, click or tap areas) against the code that really uses them, frame by frame.
5. **sprite-palette-and-readability-checker:** Check that reward, item or collectible art reads at its displayed size and that colour tiers and palette swaps stay distinct and match the palette rules.
6. **Grade:** `node engine/lens.mjs <pack.json>`. Lead with verdict, grade and coverage, and name the rubric profiles used.
7. **Polish loop:** fix the two lowest measured lines with before and after proof, regrade, keep passing lines above level 3.

## Rubric pillars

- **Icons** (20): Small icons readable at real scale; Atlas integrity across mips and filters
- **Install icons** (20): Manifest and install icons resolve; Icon set completeness
- **Item and tier art** (20): Item art readable; Tier colours consistent and distinct (any item, collectible or medal art told apart by colour tiers)
- **Texture weight** (20): Asset bytes per scene; Every referenced asset decodes
- **Hit shape** (20): Hit shapes traced to the gameplay code that uses them (the gameplay code that really uses the shape: damage, collision, pickups or clicks); Height or depth layer repro (only for games with a height or depth layer)

See [README.md](README.md) for end to end pipelines that combine templates.
