# TSL and WebGPU Shader Alchemist in your pipeline

Created by @meta_alchemist (https://x.com/meta_alchemist).

Grade shader compile, backend parity, and GPU budgets for any engine, then write a local evidence pack and ticket drafts.

**Status: preview, not shipping.** The template works and its tests pass, but it is not held to the release standard. It has a pack producer that can write a receipt, but it still needs worked examples from at least two real projects and compile or GPU evidence from a real build. Bring your own compiler or sampler. Do not treat the grade as a release gate. The template README lists the remaining ship blockers.

Template folder: [templates/07-shader-alchemist](../../templates/07-shader-alchemist/). Install and prompts: [HOW-TO-USE.md](../../templates/07-shader-alchemist/HOW-TO-USE.md), [PROMPTS.md](../../templates/07-shader-alchemist/PROMPTS.md).

## When to use it

- **Stage:** Production, Polish.
- **Trigger:** When you have shader graphs or materials to ship, and you want a first read of compile, backend parity, or GPU budget.

## Inputs and outputs

- **Inputs:** Your game profile, compile logs, a backend parity report (for example WGSL and GLSL, or WebGPU and your fallback), and GPU timing or memory samples from tools you already have.
- **Outputs:** A local evidence pack, a 100-point grade, and local ticket drafts. Nothing is filed until you file it.

## Handoffs

- **Takes from:** The owner's game profile, plus an optional evidence pack from a playtest when frame time is already in hand.
- **Hands to:** Other templates that read an evidence pack; Bug Desk (18) for ticket drafts; Producer (12) if you use the grade as a milestone note.
- **Exchange folder:** `.grokbot-team/artifacts/<artifact-id>/` in your game project. Nothing is sent anywhere.

## Recommended process

1. **Set up once:** run `shader-alchemist-getting-started` and answer its questions one at a time. Write the answers into your game profile.
2. **Collect evidence** with the evidence skills, or with the owner's own tools.
3. **Assemble a pack:** copy `fixtures/good-pack.json`, set `synthetic` to false, and replace every value with your own measurements, or run `node engine/build-pack.mjs <intake> --out <dir>`.
4. **Grade:** `node engine/lens.mjs fixtures/good-pack.json` from the template folder shows the synthetic example (verdict PASS, grade 100/100). For a real pack, run `node engine/lens.mjs <pack.json>`.
5. **File locally:** keep the pack, the grade, and ticket drafts in your exchange folder. You decide what is sent or filed.

See [README.md](README.md) for end to end pipelines that combine templates.
