# Sound Effects & Adaptive Music Director in your pipeline

Created by @meta_alchemist (https://x.com/meta_alchemist).

Review sound effects, music transitions and mix levels against your game's feedback needs and device budgets.

The short name is Audio Director (13). It reviews any game's sound, recorded or generated ("procedural"), in any engine or audio middleware: an engine mixer, FMOD or Wwise, a custom mixer, or Web Audio in a browser.

Template folder: [templates/13-audio-director](../../templates/13-audio-director/). Install and prompts: [HOW-TO-USE.md](../../templates/13-audio-director/HOW-TO-USE.md), [PROMPTS.md](../../templates/13-audio-director/PROMPTS.md).

## When to use it

- **Stage:** Polish
- **Trigger:** When adding sound, or when important actions sound unclear.

## Inputs and outputs

- **Inputs:** A list of sound events, music stems or cues, loudness targets, recordings and mixer traces from the target device, your game profile (`game-profile`), an evidence pack (`evidence-pack`), and optionally `feel-findings` from Game Feel (01).
- **Outputs:** A 100-point audio grade (`grade-record`), an audio bus plan, adaptive music rules, a loudness, bus and caption timing report (`audio-mix-report`) and local ticket drafts (`ticket-draft`).

## Handoffs

- **Takes from:** Your evidence pack, and optionally the local `feel-findings` file from Game Feel (01) listing actions whose sound was late, missing or unclear.
- **Hands to:** Game Feel (01) for impact sounds and Trailer Director (10) for the mix, through a local `audio-mix-report`; caption timing also helps Access, Input and Localization (21).
- **Findings:** one local ticket draft per finding for the human to review and file. Bug Desk (18) prepares the draft.
- **Exchange folder:** `.grokbot-team/artifacts/<artifact-id>/` in your game project. Nothing is sent anywhere.

## Recommended process

1. **Set up once:** run `audio-director-getting-started`; answer its questions one at a time; write the answers into your game profile. It also asks which rubric profiles apply (`no-music`, `no-spoken-lines`, `no-spatial-audio`); you approve them before scoring and they go in `rubricProfile` in the game profile.
2. **Get a pack:** use your CI run, a test harness or a manual capture of this build. Playtest and Performance (template 02) is a preview if you want a first pass on journeys and frame time. It is not required.
3. **sound-effect-bus-and-voice-limits:** Route recorded or generated sound effects through a mixer bus in your engine or audio middleware, set voice limits and stealing, and verify playback, loudness and lifecycle on target hardware.
4. **adaptive-music-stem-crossfader** (when music changes with the game): test transition timing, level jumps, ducking and interrupted transitions.
5. **optional-microphone-input** (only if the game uses the microphone): keep it off by default, ask the player's consent, never record or send audio, and always offer an equal non-microphone control.
6. **Grade:** `node engine/lens.mjs <pack.json>` from the template folder. Lead with verdict, grade and coverage, and name the rubric profiles used and the lines that do not apply to your game.
7. **Polish loop:** fix the two lowest measured lines with before and after proof, regrade, keep passing lines above level 3.

## Rubric pillars

- **Load and start** (20): Load cost and asset streaming; Audio start on first input
- **Music and mix** (20): Music system; Mix and bus structure
- **Loudness and voices** (20): Loudness and true-peak limiting; Active voice cap and stealing on the target device
- **Space and variety** (20): Spatial audio and occlusion; SFX variety and procedural pooling
- **Voice and lifecycle** (20): Spoken lines and captions; Lifecycle (mute, backgrounding, start rules, memory)

A game without music, spoken lines or positional sound selects the matching profile (`no-music`, `no-spoken-lines` or `no-spatial-audio`) with the owner's approval before scoring. That line reads N/A, its partner line takes the pillar's 20 points, and the verdict can reach PASS. A native build whose audio starts before any input has no profile: `load-and-start:2` stays unmeasured (U), the report says it does not apply, and the verdict stays CONDITIONAL.

See [README.md](README.md) for end to end pipelines that combine templates.
