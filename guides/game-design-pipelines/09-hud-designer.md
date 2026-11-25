# HUD and Game UI Designer in your pipeline

Created by @meta_alchemist (https://x.com/meta_alchemist).

Check whether players can read the information they need, operate the controls and understand their first session on each target device.

The short name is HUD Designer (09). It reviews any game's HUD and menus: score, timer, inventory, dialogue, map, health and anything else players must read. "Combat telemetry" (hit direction, damage recaps) is one optional part for games with combat, and a browser DOM UI is one adapter among engine and canvas UIs.

Template folder: [templates/09-hud-designer](../../templates/09-hud-designer/). Install and prompts: [HOW-TO-USE.md](../../templates/09-hud-designer/HOW-TO-USE.md), [PROMPTS.md](../../templates/09-hud-designer/PROMPTS.md).

## When to use it

- **Stage:** Polish
- **Trigger:** When the HUD or menus change, and before you prepare store screenshots or material for creators.

## Inputs and outputs

- **Inputs:** HUD and menu screenshots at your supported screen sizes, UI frame traces, your game profile (`game-profile`), an evidence pack (`evidence-pack`), and optionally `feel-findings` from Game Feel (01).
- **Outputs:** A 100-point HUD grade (`grade-record`), a contrast and touch target report, a first-session friction list, the captures used (`hud-capture-set`) and local ticket drafts (`ticket-draft`).

## Handoffs

- **Takes from:** Your evidence pack, and optionally the local `feel-findings` file from Game Feel (01) listing actions whose on-screen feedback was late or missing.
- **Hands to:** Access, Input and Localization (21) through `hud-capture-set`, and Game Feel (01) for a repeat capture when a fix changes action feedback.
- **Findings:** one local ticket draft per finding for the human to review and file. Bug Desk (18) prepares the draft.
- **Exchange folder:** `.grokbot-team/artifacts/<artifact-id>/` in your game project. Nothing is sent anywhere.

## Recommended process

1. **Set up once:** run `hud-designer-getting-started`; answer its questions one at a time; write the answers into your game profile. It also asks which rubric profiles apply (`no-touch` or `touch-only`, `fixed-orientation`, `single-language`); you approve them before scoring and they go in `rubricProfile` in the game profile.
2. **Get a pack:** use your CI run, a test harness or a manual capture of this build. Playtest QA (template 02) is coming later.
3. **live-hud-updates-and-cost:** Keep HUD elements that change often (score, timer, health, resources, lap time) readable during the busiest moment, and measure what updating them costs on each target device, in any engine.
4. **event-cues-and-recaps** (when players miss important events): show what just happened and where, with a direction cue or a short recap after a fail, a turn or a choice.
5. **wcag-luminance-and-ui-frame-gate:** Measure text and icon contrast (the WCAG contrast ratio) in real gameplay captures, and compare UI frame cost with each target device's budget.
6. **first-30s-onboarding-and-friction-killer:** Observe a new player's first task and identify where discovery, controls or feedback interrupt progress.
7. **Grade:** `node engine/lens.mjs <pack.json>` from the template folder. Lead with verdict, grade and coverage, and name the rubric profiles used and the lines that do not apply to your game.
8. **Polish loop:** fix the two lowest measured lines with before and after proof, regrade, keep passing lines above level 3.

## Rubric pillars

- **Information priority** (20): Captures of required game states; String inventory
- **Readable game states** (20): Contrast from pack screenshots; Colour distinction across the two tested palettes
- **Operability** (20): Focus and navigation with keyboard or gamepad; Touch targets
- **Responsive behaviour** (20): Minimum rendered text size; Supported orientations and aspect ratios
- **Measured UI cost** (20): UI frame cost; Text expansion

"Readable game states" is the rubric's name for readable game states in any genre. A game without touch, without keyboard or gamepad navigation, in one orientation only or in one language selects the matching profile (`no-touch`, `touch-only`, `fixed-orientation` or `single-language`) with the owner's approval before scoring. That line reads N/A, its partner line takes the pillar's 20 points, and the verdict can reach PASS. Player-facing text has no profile: a game with none leaves `information-priority:2` unmeasured (U), the report says it does not apply, and the verdict stays CONDITIONAL.

See [README.md](README.md) for end to end pipelines that combine templates.
