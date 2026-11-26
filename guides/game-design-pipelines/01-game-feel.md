# Game Vibes Director in your pipeline

Created by @meta_alchemist (https://x.com/meta_alchemist).

Measure how quickly a game responds to input and how clearly its camera, sound and visuals communicate each action.

Game Vibes Director is the template's name; other templates and this guide's index call it Game Feel (01). *Game feel* means how fast and how clearly the game answers what the player does. It fits any genre: a jump in a platformer, a tile swap in a puzzle game, a confirmed move in a strategy game, braking in a racing game, a dialogue choice in a narrative adventure.

Template folder: [templates/01-game-feel](../../templates/01-game-feel/). Install and prompts: [HOW-TO-USE.md](../../templates/01-game-feel/HOW-TO-USE.md), [PROMPTS.md](../../templates/01-game-feel/PROMPTS.md).

## When to use it

- **Stage:** Prototype, Polish
- **Trigger:** As soon as the core loop is playable, and again after changes to an action, input or camera.

## Inputs and outputs

- **Inputs:** A playable build, input and camera captures, your game profile (`game-profile`) and an evidence pack (`evidence-pack`).
- **Outputs:** A 100-point feel grade (`grade-record`), a plan for added feedback (juice), before and after proof clips, `feel-findings` for HUD and audio, and local ticket drafts (`ticket-draft`).

## Handoffs

- **Takes from:** Your game profile and evidence pack (from a CI run, a test harness or a manual capture). Optionally `hud-capture-set` from HUD Designer (09) and `audio-mix-report` from Audio Director (13) after they change an action's feedback.
- **Hands to:** HUD Designer (09) and Audio Director (13) through a local `feel-findings` file: one entry per action with the device, measured delay, the missing or late cue, the pack id and capture ids. Then playtesters for a repeat capture.
- **Findings:** one local ticket draft per finding for the human to review and file. Bug Desk (18) prepares the draft.
- **Exchange folder:** `.grokbot-team/artifacts/<artifact-id>/` in your game project. Nothing is sent anywhere.

## Recommended process

1. **Set up once:** run `game-vibes-getting-started`; answer its questions one at a time; write the answers into your game profile. It also asks which rubric profiles apply (`no-aiming`, `no-hazards`, `offline-only`); you approve them before scoring and they go in `rubricProfile` in the game profile.
2. **Get a pack:** use your CI run, a test harness or a manual capture of this build. Playtest and Performance (template 02) is a preview if you want a first pass on journeys and frame time. It is not required.
3. **game-feel-audit:** Measure how fast and how clearly the game answers the actions players use most, in any genre and any engine, and gather the evidence for each rubric line.
4. **ship-juice-module:** Add visual, audio or haptic feedback (often called juice) to an action without changing input handling or game timing, behind a switch that is off by default.
5. **before-after-feel-proof:** Compare the same player action before and after a feedback change and record both timing and perception.
6. **assist-and-forgiveness-check** (only if your game has aim assist, ledge grabs, snapping or similar help): check that the help lands where the player meant, the same way on every supported control.
7. **Grade:** `node engine/lens.mjs <pack.json>` from the template folder. Lead with verdict, grade and coverage, and name the rubric profiles used and the lines that do not apply to your game.
8. **Polish loop:** fix the two lowest measured lines with before and after proof, regrade, keep passing lines above level 3.

## Rubric pillars

- **Response** (20): Input-to-action latency sample; Buffered and held input behaviour
- **Readable feedback** (20): Action feedback capture; Ready-again cues
- **Control intent** (20): Input task completion; Input intent and assist parity
- **Camera comfort** (20): Camera framing of hazards; Reduced motion respected
- **Parity** (20): Feedback preserves simulation timing; Style effects are owner calls

A game without aiming, hazards or online prediction selects the matching profile (`no-aiming`, `no-hazards` or `offline-only`) with the owner's approval before scoring. That line reads N/A, its partner line takes the pillar's 20 points, and the verdict can reach PASS. Held input, ready-again cues and motion effects have no profile: when a game lacks them, those lines stay unmeasured (U), the report says they do not apply, and the verdict stays CONDITIONAL.

See [README.md](README.md) for end to end pipelines that combine templates.
