# Game Clipmaker in your pipeline

Created by @meta_alchemist (https://x.com/meta_alchemist).

Grade peak-moment detection and a local clip list from gameplay recordings, then write ticket drafts. Trailer Director still covers trailer-shaped cuts; this bot finds in-match moments.

**Status: preview, not shipping.** The template works and its tests pass, but it is not held to the release standard. It has a pack producer that can write a receipt, but it still needs worked examples from at least two real gameplay recordings. Bring your own encoder. This bot never uploads. Trailer Director (10) still covers trailer-shaped cuts. Do not treat the grade as a release gate. The template README lists the remaining ship blockers.

Template folder: [templates/30-game-clipmaker](../../templates/30-game-clipmaker/). Install and prompts: [HOW-TO-USE.md](../../templates/30-game-clipmaker/HOW-TO-USE.md), [PROMPTS.md](../../templates/30-game-clipmaker/PROMPTS.md).

## When to use it

- **Stage:** Ship, Live.
- **Trigger:** When you have gameplay recordings and want a first read of peak moments, timecodes, or a local clip list, rather than a trailer cut.

## Inputs and outputs

- **Inputs:** Your game profile, gameplay recordings or a moment log with timecodes, and rights or source-build notes from files you already have.
- **Outputs:** A local clip list, a 100-point grade, and local ticket drafts. Nothing is uploaded until you upload it.

## Handoffs

- **Takes from:** The owner's game profile, plus an optional evidence pack or HUD capture set when those already exist.
- **Hands to:** Trailer Director (10) or Studio Director (29) if they take the clip list further; Bug Desk (18) for ticket drafts; Producer (12) if you use the grade as a milestone note.
- **Exchange folder:** `.grokbot-team/artifacts/<artifact-id>/` in your game project. Nothing is sent anywhere.

## Recommended process

1. **Set up once:** run `game-clipmaker-getting-started` and answer its questions one at a time. Write the answers into your game profile.
2. **Collect evidence** with the evidence skills, or with the owner's own tools.
3. **Assemble a pack:** copy `fixtures/good-pack.json`, set `synthetic` to false, and replace every value with your own measurements, or run `node engine/build-pack.mjs <intake> --out <dir>`.
4. **Grade:** `node engine/lens.mjs fixtures/good-pack.json` from the template folder shows the synthetic example (verdict PASS, grade 100/100). For a real pack, run `node engine/lens.mjs <pack.json>`.
5. **File locally:** keep the pack, the grade, and ticket drafts in your exchange folder. You decide what is sent or filed.

See [README.md](README.md) for end to end pipelines that combine templates.
