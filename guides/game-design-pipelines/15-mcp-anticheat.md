# Server Fairness & Anti-Cheat Guard in your pipeline

Created by @meta_alchemist (https://x.com/meta_alchemist).

For games with a server, compare scene data across engines and review whether the server enforces your game's rules fairly.

The template has two parts. The Scene Parity part (`cross-editor-scene-parity`) proves the server's collision, spawn and visibility data match what players see after a level moves between editors or an agent edits it over MCP (Model Context Protocol, a way to connect an AI agent to an editor). The Anti-Cheat Guard part (`server-authority-fairness-audit`) reviews that your own server rejects impossible actions, bounds inputs and timing, hides what players should not see and survives abuse.

It is defensive only: it reviews your own server on a local or staging copy with your written go-ahead, never targets players, live servers or other games, never writes cheats and never bans anyone. A fully offline game has nothing to review here; skip it.

Template folder: [templates/15-mcp-anticheat](../../templates/15-mcp-anticheat/). Install and prompts: [HOW-TO-USE.md](../../templates/15-mcp-anticheat/HOW-TO-USE.md), [PROMPTS.md](../../templates/15-mcp-anticheat/PROMPTS.md).

## When to use it

- **Stage:** Production, Live
- **Fits:** any game with a server or host that decides outcomes: online arena or racing games, co-op sims, online card or turn-based strategy games, server-checked leaderboards.
- **Trigger:** Before ranked play, tournaments or prize events, after a level moves between editors, and after cheating reports.

## Inputs and outputs

- **Inputs:** Server decision logs from a local or staging server you authorize, the rules the server enforces (its authority model), and scene exports from each editor.
- **Outputs:** Findings on server authority and fairness (`fairness-findings`), authority gaps as local ticket drafts, and a human review queue draft of suspected multi-account groups (never automatic bans).

## Handoffs

- **Takes from:** your own server tests and player reports (an `evidence-pack`) and the approved `game-profile`. Level layouts from Environment Design (11) when its `layout-brief` names the scenes to compare.
- **Hands to:** Bug Desk (18) for local ticket drafts, and Live Service, Payments and Trust (22) for a draft enforcement policy (`enforcement-policy-draft`) that a human approves.
- **Findings:** one local ticket draft per finding for the human to review and file. Bug Desk (18) prepares the draft.

## Recommended process

1. **Set up once:** run `mcp-anticheat-getting-started`. It first asks whether the game has a server that decides outcomes, then which test server you authorize, which features the game has, and the targets for those features. A game that judges turns, not real-time hits, selects the `turn-based` profile, and a game with no input assist selects `no-input-assist`, each approved by the owner before scoring and set as `rubricProfile` in the game profile. That line reads N/A, its partner line takes the pillar's 20 points, and the verdict can reach PASS.
2. **Get a pack:** Use your CI run or a manual capture from your test server for this build. Playtest QA (template 02) is coming later.
3. **cross-editor-scene-parity (games with level geometry):** after a scene moves between editors or is edited over MCP, convert axes and units, hash the server collision set and prove client and server agree.
4. **server-authority-fairness-audit (every server game):** review the server's decisions for actions, input bounds, timing, visibility, floods, duplicate joins and any automatic detector. Mark other lines for features the game does not have as "does not apply": they have no profile, stay U and keep the verdict CONDITIONAL.
5. **Grade:** `node engine/lens.mjs <pack.json>`. Lead with verdict, grade and coverage, and name the rubric profiles used.
6. **Review queue:** put each suspected multi-account group in a local draft for the human reviewer. Enforcement is always a human decision.
7. **Polish loop:** fix the two lowest measured lines with before and after proof, regrade, keep passing lines at level 3 or above.

## Rubric pillars

The line names come from the frozen rubric and use shooter words; the plain meaning applies to any server game.

- **Server authority** (20): Server authority (the server, not the device, decides each action and reward); Input validation and clamping (every input is bounded).
- **Cadence and timing** (20): Action rate and cooldown enforcement (any limit on how often an action can happen, such as one move per turn); Lag compensation window integrity (only for real-time hit judging) (only for real-time hit judging).
- **Parity** (20): Same action rules for humans, bots and scripted input; Input assist parity across devices (only for games with input assists).
- **Exposure and abuse** (20): Information leaks (the server does not send what a player should not know, and its scene matches the client's); Flooding, malformed packets, connection abuse.
- **Recovery and detection** (20): Reconnect and duplicate-join handling; Score and reward integrity, detection and review (any automatic detector meets its error budgets, including players on assistive input devices).

See [README.md](README.md) for end to end pipelines that combine templates.
