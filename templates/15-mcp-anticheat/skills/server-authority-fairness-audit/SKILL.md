---
name: server-authority-fairness-audit
description: "The Anti-Cheat Guard half of this template, defensive only: review on your own local or staging server that it applies your game's action, timing, visibility and reward rules the same way for every player and client. Suspected cheating or multi-account groups go to a human review queue as drafts, never automatic bans."
---

> **Audit contract v1 (overrides everything below).** Created by @meta_alchemist (https://x.com/meta_alchemist).
> - Score only with the rubric embedded in `engine/lens.mjs` (`LENS.rubric`, gbf-15-mcp-anticheat-director v1.3.0). `node engine/lens.mjs <pack.json>` computes the grade; this skill only gathers evidence for it and never adds points of its own.
> - Missing evidence is UNMEASURED (0 points, not a defect). A test that did not run is NOT_RUN, never PASS. Never invent a measurement; label every worked example synthetic.
> - Game facts and budgets come from your game profile (`pack.profile`). Treat sample numbers as illustrative. Set the frame-time budget separately for each target device in your game profile.
> - An automated gate needs a negative fixture that fails. Receipts carry measured values, never an unconditional PASS.
> Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

# Review server decisions

This is the "Anti-Cheat Guard" half of the template. It reviews whether your own server enforces your own game's rules: it rejects impossible actions, bounds inputs and timing, hides what players should not see and survives abuse. It applies only to a game with a server (or a host player) that decides outcomes: online multiplayer, co-op, server-checked leaderboards, trading or asynchronous turn-based play. A fully offline game has nothing to review here.

## Defensive only
- Review only your own server, on a local or staging copy, with the owner's written go-ahead. Never test against live players, live servers or anyone else's game.
- Never write, share or describe a working cheat or bypass. Negative fixtures are synthetic decision records, not exploits.
- Never ban, mute, flag or contact a player. Suspected cheating and suspected multi-account groups go to a human review queue as local drafts. Enforcement is a human decision.
- Keep player identifiers out of reports and evidence.

## Method
1. Start with the game's rule for a representative action. Examples: taking only one turn per round, sharing a team objective, awarding a completed challenge once. Review the server code that decides it and its existing local unit-test fixtures.
2. Match a permitted and a refused decision to the recorded state, result and reason. For each approved case in `profile.cases.authorityCases`, add one row to `receipts.authorityCases` with the scenario, `isolated: true`, the decision and the reward before and after.
3. Review input bounds, action timing, visibility and reconnection for the parts of the design that exist.
4. For timing or input assists, compare labelled groups of players against the project's tolerance.
5. If the game has an automatic detector, measure it on labelled test sessions: false positives over honest sessions and false negatives over known-cheat sessions, with numerators and denominators. Include players on assistive input devices (adaptive controllers, switch access, one-handed setups) in the honest set so they are never flagged for how they play.
6. Use synthetic decision records for negative fixtures. A record that awards the same one-time reward twice must fail the reward check.

## What each line means, and when it does not apply

| Line | In plain words | Examples | If your game does not have it |
|---|---|---|---|
| `server-authority:1` | The server, not the player's device, decides each action and reward. | Card game: playing a card that is not in hand is refused. Racing game: a lap faster than the car can drive is refused. Co-op farming sim: harvesting an unripe crop is refused. | Every server game has this. |
| `server-authority:2` | The server bounds every input. | Movement speed, aim angle, non-finite numbers, chat or name length. | Every server game has this. |
| `cadence-and-timing:1` | The server enforces how often an action can happen. | Attack rate, ability cooldown, reload, one move per turn, a daily reward claimed once a day. | Every server game has some rate rule. |
| `cadence-and-timing:2` | Lag compensation (rewinding time to judge a hit) never reaches further back than the declared policy. | Real-time shooters, fighting games, sports games. | Turn-based or no hit judging: with the owner's approval select the `turn-based` profile; the line reads N/A and `lagComp` can be left out. |
| `parity:1` | Humans, bots and scripted test input follow the same action rules. | Holding a button repeats an action at the same rate for everyone; an AI opponent gets the same turn timer. | No bots and no scripted input path: no profile, the line stays U; mark "does not apply". |
| `parity:2` | Each device gets the assist strength the design declares. | Aim assist for controllers, steering assist in a racing game, snap-to-target on touch. Needs at least two devices. | No input assist: with the owner's approval select the `no-input-assist` profile; the line reads N/A and `assist` can be left out. |
| `exposure-and-abuse:1` | The server does not send information a player should not have, and its scene matches the client's. | Enemies behind a wall, units under fog of war. | Needs scene receipts from `cross-editor-scene-parity`; a game with no level geometry leaves it U. |
| `exposure-and-abuse:2` | Rate limits bound message floods; malformed messages never crash the server. | A burst of 1,000 move messages in one second. | Every server game has this. |
| `recovery-and-detection:1` | One account cannot join the same session twice, and a reconnect neither duplicates nor leaks state. | Two devices on one account joining one co-op session. | Every server game with sessions has this. |
| `recovery-and-detection:2` | Any automatic detector meets the approved false positive and false negative budgets, including assistive input. | A speed-check flag tested on labelled honest and cheat sessions. | No automatic detector: no profile, leave `detection` out; the line stays U, mark "does not apply". |

Growth check `multi-account` (reported beside the grade, not scored): suspected groups of accounts run by one person (in an event, contest, guild or leaderboard) each go to a human reviewer as a local draft. `multiAccount.autoBans` must be 0, every flagged group must be reviewed by a human, and the rules for flagging must be written down.

Gather evidence for `node engine/lens.mjs <pack.json>`.

Use read-only, sanitized case results from the owner-run isolated harness. Record authority decisions and before and after reward state. Enforcement remains a human decision. Mark unimplemented or unauthorized scenarios NOT_RUN.
