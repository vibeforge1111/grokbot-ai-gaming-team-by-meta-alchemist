# Gaussian Splat Cleaner in your pipeline

Created by @meta_alchemist (https://x.com/meta_alchemist).

Grade splat cleanup, continuity, and navigation proxies from owner-supplied captures, then write a local evidence pack and ticket drafts.

**Status: preview, not shipping.** The template works and its tests pass, but it is not held to the release standard. It has a pack producer that can write a receipt, but it still needs evidence from a working cleanup on a real capture and examples from at least two captures. Bring your own cleaner. The source capture must stay untouched. Do not treat the grade as a release gate. The template README lists the remaining ship blockers.

Template folder: [templates/16-gaussian-splat-cleaner](../../templates/16-gaussian-splat-cleaner/). Install and prompts: [HOW-TO-USE.md](../../templates/16-gaussian-splat-cleaner/HOW-TO-USE.md), [PROMPTS.md](../../templates/16-gaussian-splat-cleaner/PROMPTS.md).

## When to use it

- **Stage:** Production.
- **Trigger:** When you have a Gaussian splat or similar 3D capture to clean, and you want a first read of floaters, seams, budget, or walkable proxies.

## Inputs and outputs

- **Inputs:** Your game profile, a before and after splat or capture, a cleanup report, and a proxy or nav report from tools you already have.
- **Outputs:** A local evidence pack, a 100-point grade, a change list, and local ticket drafts. Nothing is filed until you file it.

## Handoffs

- **Takes from:** The owner's game profile, plus optional captures already stored as an evidence pack.
- **Hands to:** Other templates that read an evidence pack or a change list; Bug Desk (18) for ticket drafts; Producer (12) if you use the grade as a milestone note.
- **Exchange folder:** `.grokbot-team/artifacts/<artifact-id>/` in your game project. Nothing is sent anywhere.

## Recommended process

1. **Set up once:** run `splat-cleaner-getting-started` and answer its questions one at a time. Write the answers into your game profile.
2. **Collect evidence** with the evidence skills, or with the owner's own tools.
3. **Assemble a pack:** copy `fixtures/good-pack.json`, set `synthetic` to false, and replace every value with your own measurements, or run `node engine/build-pack.mjs <intake> --out <dir>`.
4. **Grade:** `node engine/lens.mjs fixtures/good-pack.json` from the template folder shows the synthetic example (verdict PASS, grade 100/100). For a real pack, run `node engine/lens.mjs <pack.json>`.
5. **File locally:** keep the pack, the grade, and ticket drafts in your exchange folder. You decide what is sent or filed.

See [README.md](README.md) for end to end pipelines that combine templates.
