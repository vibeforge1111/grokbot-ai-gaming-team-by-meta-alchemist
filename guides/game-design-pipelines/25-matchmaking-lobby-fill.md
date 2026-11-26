# Matchmaking and Region Lobby Fill in your pipeline

Created by @meta_alchemist (https://x.com/meta_alchemist).

Measure queue fill, wait times and bot representation and draft alternatives for a human queue owner.

Template folder: [templates/25-matchmaking-lobby-fill](../../templates/25-matchmaking-lobby-fill/). Install and prompts: [HOW-TO-USE.md](../../templates/25-matchmaking-lobby-fill/HOW-TO-USE.md), [PROMPTS.md](../../templates/25-matchmaking-lobby-fill/PROMPTS.md).

## When to use it

- **Stage:** Live or late production, once a queue or lobby exists.
- **Trigger:** When queue fill, wait times, or lobby composition is the question.

## Inputs and outputs

- **Inputs:** Your game profile (`game-profile`) and an evidence pack (`evidence-pack`) from local queue or lobby captures.
- **Outputs:** A local lobby-fill proposal (`lobby-fill-proposal`), a 100-point grade (`grade-record`), and local ticket drafts (`ticket-draft`).

## Handoffs

- **Takes from:** Local queue and lobby captures that you supply.
- **Hands to:** Retention (27) if you use a proposal as context for a cohort read; Bug Desk (18) for ticket drafts; Producer (12) for a go or hold note on a queue change. The human reviews every draft.
- **Exchange folder:** `.grokbot-team/artifacts/<artifact-id>/` in your game project. Nothing is sent anywhere.

## Recommended process

1. **Set up once:** run `lobby-fill-getting-started` and answer its questions one at a time, including the observation window and any bot-labelling rules.
2. **Capture:** run `lobby-fill-count-snapshots` on the captures you have. Prefer a full window. Until the engine counts silent hours as zero, say so in the report if a region was quiet for most of the window.
3. **Review:** run `lobby-fill-bot-honesty-check` and `lobby-fill-weekly-proposals`. Keep proposals as drafts for the queue owner.
4. **Grade:** `node engine/lens.mjs fixtures/good-pack.json` shows the synthetic example (verdict PASS, grade 100/100). For a real pack, run `node engine/lens.mjs <pack.json>`.
5. **File locally:** you decide what is sent or filed.

