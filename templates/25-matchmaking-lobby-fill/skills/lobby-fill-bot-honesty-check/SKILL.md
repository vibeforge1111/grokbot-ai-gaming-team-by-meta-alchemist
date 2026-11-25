---
name: lobby-fill-bot-honesty-check
description: "Use when the lobby shows bots alongside players and you need to confirm that bots carry a visible label and never count in the public player count."
---

> **Audit contract v1 (overrides everything below).** Created by @meta_alchemist (https://x.com/meta_alchemist).
> - Score only with the rubric embedded in `engine/lens.mjs` (`LENS.rubric`, gbf-25-matchmaking-lobby-fill v1.2.0). `node engine/lens.mjs <pack.json>` computes the grade; this skill only gathers evidence for it and never adds points of its own.
> - Missing evidence is UNMEASURED (0 points, not a defect). A step that did not run is NOT_RUN, never PASS. Never invent a measurement; label every worked example synthetic.
> - Thresholds and codes come from the owner's profile (`pack.profile`). Treat sample numbers as illustrative.
> - Preview engine: the vendored lens kit 1.1.0 trusts the metrics a pack declares and does not check artifact bytes or a producer receipt. Say so beside every grade.
> Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

# Bot representation

Compare the lobby configuration with the observed seats. Bots must carry a label and must never count as players.

Rubric lines this informs: `bot-honesty:1` and `bot-honesty:2`.

## Steps

1. Input: the lobby configuration the build ships (where the bot label and the public player count are defined) and the seat export used for proposals.
2. Record the configuration in `input.json` as `config: { botLabelShown, botsCountedInPlayerCount }`, citing the config file. This is a configuration claim, not an observation; when you can, add a lobby capture from the build under review as the artifact.
3. Run `node mm/scenario.mjs input.json > pack.json`. `bots.overCapWithoutProposal` counts regions above `maxBotShare` with no proposal in front of the owner.
4. Draft any discrepancy (a bot without a label, bots in the public count, a bot-heavy region with no plan) as a local finding with the configuration and trace references.
5. Stop: without the lobby configuration, leave `config` out; `bot-honesty:1` stays U.

## Output

Local discrepancy drafts and the `bots` group in the pack.
