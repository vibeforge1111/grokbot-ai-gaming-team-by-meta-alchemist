# Game design pipelines

Created by @meta_alchemist (https://x.com/meta_alchemist).

How the templates fit into game development. One page per template covers when to use it, inputs and outputs, handoffs and the recommended process. This page shows how they chain together.

## The backbone

Collect evidence from a playtest, a CI run or a manual capture. Playtest and Performance (template 02) is a preview if you want a first pass on journeys and frame time. It is not required. Bug Desk (18) prepares local ticket drafts. A human reviews them and files approved changes in the shared ledger. When several templates run in one game project they pass findings to each other as files; the [team map](../../docs/TEAM-MAP.md) shows who hands what to whom.

A first game does not need every row below. The starter team is Game Feel, Game Loop, HUD, Bug Desk, and Producer, in that order. See [Get started with your AI gaming team](../../GETTING-STARTED.md). The stage column further down matches each template's own stage. A 2D game may still use Sprites (17) during a prototype, even though that bot's stage is Production.

```
build ──> capture ──> evidence pack ──> lens templates grade it ──> findings ──> 18 Bug Desk local draft ──> human reviews and files
```

## Pipeline 1: prototype to playtest to polish to ship

| Step | Goal | Templates | Exit when |
|---|---|---|---|
| Prototype | A tester can complete the first meaningful action | 01 Game Feel; 17 Sprite and Hitbox (2D) or 03 Prop and Rig (3D) | Game Feel measured lines at level 3 or better on input and camera |
| First playtest | Strangers can play without you in the room | 18 Bug Desk, 09 HUD (first session) | No open P0; onboarding friction list triaged |
| Multiplayer hardening, when applicable | Fair and stable under load | 15 Server Fairness | Soak passes at target room size; authority gaps closed or ticketed |
| Content and balance | Worth replaying | 11 Environment, 06 Economy | Compare strategies or upgrades where relevant and review route readability |
| Polish | Feels finished | 01 again, 09 HUD, 13 Audio, 21 Access, Input and Localization | Adopted templates meet the project's target grade and coverage |
| Ship | People can find it and trust it | 10 Trailer, 19 Presskit, 22 Live Service Trust | Applicable store assets pass review. Games with purchases or services also check payments or rehearse recovery |
| Live | Keep players and fix fast | 18 daily, 06 per patch, 20 patch notes and creators; 12 Producer for the go or hold call on each release | Critical issues meet the project's response target and patch notes reflect the build |

## Pipeline 2: balance patch

```
player reports ──> 18 Bug Desk (dedup "X is overpowered") ──> 06 Economy (sources and sinks, Monte Carlo choice simulation, combat timing only with combat)
   ──> patch proposal (owner approves) ──> coding agent on a branch ──> evidence pack on the patch build
   ──> 06 regrade (win spread inside the profile band) ──> 20 patch notes draft ──> owner posts
```

## Pipeline 3: trailer and store page

```
Gameplay captures / stream VODs ──> 10 Trailer (moments from the game's own events, cuts per delivery format, redaction gate)
   ──> 19 Store Page (store art per destination, hook and tags, leak-free press kit) ──> 20 local outreach draft ──> owner reviews and sends
```

The redaction gate in 10 and the leak check in 19 run before anything leaves your machine.

## Pipeline 4: competitive integrity

```
Your load-test results ──> 15 Server Fairness authority audit ──> suspected multi account clusters ──> human review
   ──> 22 Live Service Trust (enforcement policy, appeals) ──> 18 local ticket drafts for code gaps
```

Enforcement is always a human decision. Templates propose; people ban.

## Pipeline 5: accessibility and reach

```
09 HUD (contrast, touch targets) ──> 21 Access, Input and Localization (journeys on supported inputs; captions; motion; pseudo locale)
   ──> 18 local ticket drafts ──> fixes ──> evidence pack ──> 09 and 21 regrade
```

## Per template pages

| Template | Stage |
|---|---|
| [01 Game Feel](01-game-feel.md) | Prototype, Polish |
| [02 Playtest and Performance](02-playtest-performance.md) (preview) | Playtest |
| [05 Game Loop Alchemist](05-game-loop-alchemist.md) | Prototype, Playtest |
| [03 Prop and Rig](03-prop-rig.md) | Production |
| [06 Economy Director](06-economy-director.md) | Production, Live |
| [09 HUD Designer](09-hud-designer.md) | Polish |
| [10 Trailer Director](10-trailer-director.md) | Ship, Live |
| [11 Environment Design](11-environment-design.md) | Production, Polish |
| [12 Parallel Game Producer](12-parallel-game-producer.md) | Milestone planning and pitch review |
| [13 Sound and Music](13-audio-director.md) | Polish |
| [14 Living AI NPC and Lore](14-living-npc-lore.md) | Narrative prototyping and playtest |
| [15 Server Fairness](15-mcp-anticheat.md) | Production, Live |
| [17 Sprite and Hitbox Packer](17-sprite-hitbox-packer.md) | Production |
| [18 Bug Desk](18-bug-desk-triage.md) | Playtest, Live |
| [19 Store Page and Presskit](19-presskit-director.md) | Ship |
| [20 Streamer and Patch Notes](20-streamer-hype.md) | Ship, Live |
| [21 Access, Input and Localization](21-access-input-localization.md) | Polish, Ship |
| [22 Live Service Trust](22-live-service-trust.md) | Ship, Live |

| [23 Support Desk](23-support-moderation-desk.md) (preview) | Live support |
| [24 Ledger](24-prize-refund-ledger.md) (preview) | Live operations |
| [25 Matchmaking](25-matchmaking-lobby-fill.md) (preview) | Live, late production |
| [26 Balance Patch](26-balance-patch-director.md) (preview) | Live, late production |
| [27 Retention](27-retention-cohort-analytics.md) (preview) | Live |
| [28 App Store](28-mobile-store-submission.md) (preview) | Ship |

Templates 23 to 28 are previews. Use the pipeline page and the template README together. Honest status for every bot, including ones not in this repo, is in [READINESS.md](../../READINESS.md).
