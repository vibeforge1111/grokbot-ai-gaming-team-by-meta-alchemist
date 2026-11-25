# Grok Bot AI Gaming Team by Meta Alchemist

Created by [@meta_alchemist](https://x.com/meta_alchemist). MIT licensed.

**A team of AI game-dev specialists you add to Grok Bot.** Each one reviews one part of your game (game feel, HUD, audio, economy, bug triage, store page, live service and more), grades your build against a 100-point rubric using evidence you capture, and drafts fixes for you to approve. They work alone or as a team that hands findings to each other.

**Who it is for:** solo developers and small teams making any game, in any genre, on any engine or platform: a 2D platformer, a mobile puzzle game, a farming sim, a narrative adventure, a racing game or an online arena game. You stay in charge: every post, ticket, refund or upload stays a draft until you send it.

**Start in under a minute:**

1. Pick one specialist from the table below. Not sure? Start with **Game Feel (01)** while prototyping, or **Bug Desk (18)** once people play.
2. Open its `HOW-TO-USE.md` and paste its skills into Grok Bot (or Claude Code, Codex or Cursor).
3. Say: "Run the getting-started skill." It asks about your game one question at a time.

Want to see a grade first? With Node 18 or newer, from this folder (no install, no dependencies):

```bash
node templates/18-bug-desk-triage/engine/lens.mjs templates/18-bug-desk-triage/fixtures/good-pack.json
```

It prints a verdict, a grade out of 100, how much of the rubric was measured, and a level for each line. The example is synthetic, not a real game.

## Pick a specialist

| Stage | Shipping templates |
|---|---|
| Prototype | [01 Game Feel](templates/01-game-feel/), [17 Sprites and Hitboxes](templates/17-sprite-hitbox-packer/) |
| Playtest | [18 Bug Desk](templates/18-bug-desk-triage/) |
| Production | [03 Props and Rigs](templates/03-prop-rig/), [11 Environment](templates/11-environment-design/), [06 Economy](templates/06-economy-director/), [15 Server Fairness](templates/15-mcp-anticheat/), [12 Producer](templates/12-parallel-game-producer/) |
| Polish | [09 HUD and Game UI](templates/09-hud-designer/), [13 Sound and Music](templates/13-audio-director/), [21 Access, Input and Localization](templates/21-access-input-localization/) |
| Ship and live | [10 Trailer](templates/10-trailer-director/), [19 Store Page](templates/19-presskit-director/), [20 Streamers and Patch Notes](templates/20-streamer-hype/), [22 Live Service and Trust](templates/22-live-service-trust/) |

Eight more are **previews** (they work and their tests pass, but they are not yet held to the release standard): [05 Game Loop](templates/05-game-loop-alchemist/), [14 NPC and Lore](templates/14-living-npc-lore/), [23 Support Desk](templates/23-support-moderation-desk/), [24 Prize and Refund Ledger](templates/24-prize-refund-ledger/), [25 Matchmaking](templates/25-matchmaking-lobby-fill/), [26 Balance Patch](templates/26-balance-patch-director/), [27 Retention](templates/27-retention-cohort-analytics/) and [28 App Store Submission](templates/28-mobile-store-submission/).

The full catalog with versions and install links is in [TEMPLATES.md](TEMPLATES.md).

## How a specialist works

1. **It asks.** The getting-started skill learns your game: genre, devices, budgets and which rubric lines apply. A game without aiming, a store or a spectator mode marks those lines not applicable instead of failing them.
2. **You capture.** You (or your CI) record evidence from a real build: clips, traces, screenshots, exports.
3. **It grades.** A small engine turns the evidence into a grade out of 100 with coverage. Anything not measured is marked unmeasured and earns zero; it is never guessed.
4. **It drafts.** Findings become local ticket drafts and fix proposals. You decide what to file, post or ship.

## How the team works together

Run several specialists in the same game project and they share work through files under `.grokbot-team/`:

- **[Team map](docs/TEAM-MAP.md):** who makes which file and who reads it (for example Game Feel hands `feel-findings` to HUD and Audio; every specialist hands ticket drafts to Bug Desk). A missing input is never invented: the reader continues with a clearly marked assumption.
- **[Shared memory](docs/SHARED-MEMORY.md):** a small append-only log of decisions, incidents, entitlements, balance changes, regions and releases. It never holds names, handles, emails, wallets or raw user ids.
- **[Versions](docs/VERSIONING.md):** every template has a version and a changelog, and `npm run compat` reports OK, WARN or BREAK for every pair that exchanges files.

## Install

Grok Bot does not import templates from GitHub. Pick one path (details in [INSTALL.md](INSTALL.md)):

- **Option A, share link:** each template gets a `grokbot://` link after review. They all read **pending review** for now, so use Option B.
- **Option B, manual:** paste each `SKILL.md` into a Grok Bot chat and ask it to save the skill, add the facts from `MEMORY.md`, create the routines from `PROMPTS.md`, then run the getting-started skill.
- **Option C, other agents:** the skills are plain `SKILL.md` files that also work in Claude Code, Codex, Cursor or Gemini CLI.

New here? [GETTING-STARTED.md](GETTING-STARTED.md) walks you from this folder to your first grade. Bringing the kit into a team? Read [ADOPTING.md](ADOPTING.md).

## What is in the box

| Path | What it is |
|---|---|
| [templates/](templates/) | 15 shipping templates and 8 previews. Each has `HOW-TO-USE.md`, `PROMPTS.md`, `MEMORY.md`, `CHANGELOG.md`, `skills/`, `RUBRIC.json`, `engine/`, `fixtures/`, `tests/` and the Grok Bot `recipe.json`. |
| [docs/](docs/) | The team map, shared memory, versioning, the skill format and the rubric guide. |
| [spec/](spec/) | Template spec, JSON schemas for templates, rubrics, recipes, team artifacts and memory records, and the rubric hash. |
| [shared/](shared/) | The grading engine and the team memory helper that every template carries a copy of. |
| [guides/](guides/) | A pipeline guide per template, pairing with other AI tools, bridging to your own computer, rubrics and polish loops. |
| [examples/pixel-pantry/](examples/pixel-pantry/) | A worked example: two builds of a browser cooking game, graded before and after fixes (synthetic). |
| [starter/](starter/) | A small template to copy, and `npm run new` to scaffold your own. |
| [scripts/](scripts/) | Validator, scrub check, link check, compat check, team map and recipe builders. |

## Checks

```bash
npm run check     # validator, scrub, links, team map, compat check and every test
```

Results from the last full run are in [TEST-RESULTS.md](TEST-RESULTS.md).

## House rules every template follows

- Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.
- Missing evidence grades U (unmeasured): zero points, never a made-up defect or a made-up pass.
- Thresholds live in your game profile, never in the engine. Worked examples are labelled synthetic.
- Every automated gate has a negative fixture that must fail.

## Credits and license

Created by [@meta_alchemist](https://x.com/meta_alchemist). Please keep the credit line in templates and skills you fork.

Released under the [MIT License](LICENSE).
