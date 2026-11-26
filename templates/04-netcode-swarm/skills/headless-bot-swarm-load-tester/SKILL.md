---
name: headless-bot-swarm-load-tester
description: "Use when planning or reading a bot-swarm or soak run. This skill does not ship a runner; it grades a report the owner already has."
---

> **Audit contract v1 (overrides everything below).** Created by @meta_alchemist (https://x.com/meta_alchemist).
>
> Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.
> - Score only with the rubric embedded in `engine/lens.mjs`. This skill gathers evidence; it never adds points.
> - Missing evidence is UNMEASURED (0 points, not a defect). Never invent a measurement; label every worked example synthetic.

# Bot-swarm and soak report

Use this skill to fill the sync and swarm lines from an owner-supplied soak or bot-swarm report. This skill does not start a swarm and does not talk to a live server.

## Soak and desync

1. Confirm the soak length target, in minutes, and the acceptable desync rate.
2. From the report, record `sync.desyncRate` and `sync.soakMinutes` on the intended build.
3. Bots must be flagged as bots. Record `swarm.botsFlagged` and `swarm.botsCountedAsPlayers` (the second must be 0).

## Scenarios

Record how many scripted scenarios the swarm completed (`swarm.scenariosCompleted`) against the owner's minimum.

## Honesty

- There is no bundled headless runner here. If the owner has no report yet, leave the groups out and let the lines read U.
- Never connect to a production server. Never write to a live match.
- Keep findings as local ticket drafts.
