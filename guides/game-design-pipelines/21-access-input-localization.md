# Access, Input and Localization QA in your pipeline

Created by @meta_alchemist (https://x.com/meta_alchemist).

Check whether players can navigate, read and control your game across supported inputs, languages and accessibility settings.

Template folder: [templates/21-access-input-localization](../../templates/21-access-input-localization/). Install and prompts: [HOW-TO-USE.md](../../templates/21-access-input-localization/HOW-TO-USE.md), [PROMPTS.md](../../templates/21-access-input-localization/PROMPTS.md).

## When to use it

- **Stage:** Polish, Ship
- **Trigger:** Before any wider release and when you add a platform or language.

## Inputs and outputs

- **Inputs:** Captures on supported inputs, a string inventory and caption evidence.
- **Outputs:** Input journey checks, readability report, motion and flash check (flashing above your limit blocks release), string inventory and locale readiness, and local finding drafts.

## Handoffs

- **Takes from:** HUD Designer and the playtest team.
- **Hands to:** Bug Desk (local ticket drafts).
- **Findings:** one local ticket draft per finding for the human to review and file. Bug Desk (18) prepares the draft.

## Recommended process

1. **Set up once:** run `access-input-localization-getting-started`; answer its questions about devices, journey tasks, text and flash limits and languages; write the answers into your game profile. It also asks which rubric profiles apply (`single-language`, `single-input`); you approve them before scoring and they go in `rubricProfile`.
2. **Get a pack:** Use your CI run or a manual capture for this build. Playtest QA (template 02) is coming later.
3. **input-navigation-and-device-switch-audit:** check that every supported input finishes every required journey task, and that remapping, button prompts, disconnects and menu focus recover.
4. **readability-and-caption-evidence:** measure text size and contrast over real scenes, check meaning without colour, match each required sound to an on-time caption, and check menus and error messages.
5. **motion-flash-comfort-check:** check reduced motion in paired captures, count flashes against your safety limit (a release blocker under every profile), and check hold or toggle alternatives.
6. **string-inventory-and-pseudo-locale:** build the string inventory and the guard against new hard-coded text (single-language games too); run locale captures once a second language is in scope.
7. **file-to-shared-ledger:** turn confirmed findings into local ticket drafts for the human to review and file.
8. **Grade:** `node engine/lens.mjs <pack.json>`. Lead with verdict, grade and coverage. If the verdict is BLOCKED, say why first.
9. **Polish loop:** fix the two lowest measured lines with before and after proof, regrade, keep passing lines at level 3 or above.

## One language or several

- **One language at this release:** the owner approves the `single-language` profile (`profile.rubricProfile: "single-language"`) and records who approved it, for which build and why. The locale tests line is N/A (left out, never a defect) and the string inventory line is worth 20 points. The inventory still matters: it finds every piece of player-facing text so it can be checked, fixed in one place and translated later.
- **Two or more languages:** use the default profile and capture each language and the pseudo-locale on every screen size in the profile.
- **One input method (for example touch only):** the owner approves the `single-input` profile the same way, alone or with the language one (`"rubricProfile": ["single-language", "single-input"]`). Remapping, prompts and device switching (`input:2`) read N/A and the required tasks line is worth 20 points.
- Flash safety stays a release blocker under every profile.

## Examples by genre (illustrative)

Name journey tasks after your own game. The worked example's `title-screen`, `core-play`, `results` and `play-again` come from one synthetic online game.

- **Mobile puzzle game (touch only):** tasks `title-screen`, `select-level`, `swap-tiles`, `undo-move`, `pause-menu`. Touch is the only input, so the owner approves `single-input` and `input:2` reads N/A; menus without keyboard or gamepad leave `captions-and-assistive-info:2` U with the reason noted.
- **2D platformer:** gamepad and keyboard; camera shake on landing is a promised reduction; the hold-to-charge jump needs a toggle.
- **Turn-based strategy game:** unit health numbers over busy terrain for contrast; tooltips built from parts need whole-sentence strings before translation.
- **Racing game:** the lap counter over a bright sky; speed-line effects in the reduced-motion pairs; the brightest crash flashes counted against the limit.
- **Narrative adventure:** most strings are dialogue; a door-knock sound that hints at a choice needs a caption.
- **Farming or life sim, one language:** single-language profile approved; the inventory covers menus, item names and the in-game calendar.

## Rubric pillars

- **Input** (20): Required tasks across supported inputs; Remapping, prompts and device switching
- **Readability** (20): Text size and contrast over real scenes; Meaning without colour
- **Captions and assistive info** (20): Caption event log (each required sound matched to the right caption, on time); Menus and error messages (menus usable without a mouse or touch, errors that say what to do)
- **Motion and flash comfort** (20): Reduced motion respected everywhere; Flash safety and hold/toggle alternatives (flashing above the limit is a release blocker)
- **Localization readiness** (20): String inventory; Locale tests (dormant until a second language: N/A under the single-language profile)

See [README.md](README.md) for end to end pipelines that combine templates.
