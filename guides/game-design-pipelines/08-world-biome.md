# Procedural World and Biome Architect in your pipeline

Created by @meta_alchemist (https://x.com/meta_alchemist).

Grade seeded world generation, traversal, and encounter placement for any engine, then write a local evidence pack and ticket drafts.

**Status: preview, not shipping.** The template works and its tests pass, but it is not held to the release standard. It has a pack producer that can write a receipt, but it still needs worked examples from at least two real seeded worlds. Bring your own generator or nav tools. Do not treat the grade as a release gate. The template README lists the remaining ship blockers.

Template folder: [templates/08-world-biome](../../templates/08-world-biome/). Install and prompts: [HOW-TO-USE.md](../../templates/08-world-biome/HOW-TO-USE.md), [PROMPTS.md](../../templates/08-world-biome/PROMPTS.md).

## When to use it

- **Stage:** Production.
- **Trigger:** When a seeded world or biome generator exists, and you want a first read of repeatability, traversal, or encounter placement.

## Inputs and outputs

- **Inputs:** Your game profile, two or more seeded exports, a nav or traversal report, and an encounter-density report from tools you already have.
- **Outputs:** A local evidence pack, a 100-point grade, a layout brief, and local ticket drafts. Nothing is filed until you file it.

## Handoffs

- **Takes from:** The owner's game profile, plus an optional layout brief from Environment Design (11) when that bot has already run.
- **Hands to:** Environment Design (11) if you share a layout brief; other templates that read an evidence pack; Bug Desk (18) for ticket drafts; Producer (12) if you use the grade as a milestone note.
- **Exchange folder:** `.grokbot-team/artifacts/<artifact-id>/` in your game project. Nothing is sent anywhere.

## Recommended process

1. **Set up once:** run `world-biome-getting-started` and answer its questions one at a time. Write the answers into your game profile.
2. **Collect evidence** with the evidence skills, or with the owner's own tools.
3. **Assemble a pack:** copy `fixtures/good-pack.json`, set `synthetic` to false, and replace every value with your own measurements, or run `node engine/build-pack.mjs <intake> --out <dir>`.
4. **Grade:** `node engine/lens.mjs fixtures/good-pack.json` from the template folder shows the synthetic example (verdict PASS, grade 100/100). For a real pack, run `node engine/lens.mjs <pack.json>`.
5. **File locally:** keep the pack, the grade, and ticket drafts in your exchange folder. You decide what is sent or filed.

See [README.md](README.md) for end to end pipelines that combine templates.
