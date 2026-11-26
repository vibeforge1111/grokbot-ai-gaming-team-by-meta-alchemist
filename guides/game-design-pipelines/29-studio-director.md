# Studio Director in your pipeline

Created by @meta_alchemist (https://x.com/meta_alchemist).

Grade cinematic continuity, shot coverage, and a local export plan for any game, then write a work plan and ticket drafts. Trailer Director still covers trailer cuts; this bot plans the shoot or stills sequence.

**Status: preview, not shipping.** The template works and its tests pass, but it is not held to the release standard. It has a pack producer that can write a receipt, but it still needs worked examples from at least two real shoots or stills sequences. Bring your own editor. This bot never publishes. Do not treat the grade as a release gate. The template README lists the remaining ship blockers.

Template folder: [templates/29-studio-director](../../templates/29-studio-director/). Install and prompts: [HOW-TO-USE.md](../../templates/29-studio-director/HOW-TO-USE.md), [PROMPTS.md](../../templates/29-studio-director/PROMPTS.md).

## When to use it

- **Stage:** Ship, Production.
- **Trigger:** When you are planning a cinematic, a stills sequence, or a shoot, and you want a first read of continuity, coverage, or a local export plan.

## Inputs and outputs

- **Inputs:** Your game profile, a shot or stills list, continuity notes, and rights or clearance notes from files you already have. An optional clip list from Trailer Director (10) or Game Clipmaker (30) can sit beside those files.
- **Outputs:** A local work plan, a media export manifest, a 100-point grade, and local ticket drafts. Nothing is published until you publish it.

## Handoffs

- **Takes from:** The owner's game profile, plus an optional clip list from Trailer Director (10) or Game Clipmaker (30), and an optional pitch draft.
- **Hands to:** Trailer Director (10) or Game Clipmaker (30) if they take the work plan or clip list further; Bug Desk (18) for ticket drafts; Producer (12) if you use the grade as a milestone note.
- **Exchange folder:** `.grokbot-team/artifacts/<artifact-id>/` in your game project. Nothing is sent anywhere.

## Recommended process

1. **Set up once:** run `studio-director-getting-started` and answer its questions one at a time. Write the answers into your game profile.
2. **Collect evidence** with the evidence skills, or with the owner's own tools.
3. **Assemble a pack:** copy `fixtures/good-pack.json`, set `synthetic` to false, and replace every value with your own measurements, or run `node engine/build-pack.mjs <intake> --out <dir>`.
4. **Grade:** `node engine/lens.mjs fixtures/good-pack.json` from the template folder shows the synthetic example (verdict PASS, grade 100/100). For a real pack, run `node engine/lens.mjs <pack.json>`.
5. **File locally:** keep the pack, the grade, and ticket drafts in your exchange folder. You decide what is sent or filed.

See [README.md](README.md) for end to end pipelines that combine templates.
