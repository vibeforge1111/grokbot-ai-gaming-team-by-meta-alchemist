---
name: adaptive-music-stem-crossfader
description: "Change music with game states using stems (separate layers of one piece) or whole cues, then test transition timing, level jumps, ducking and interrupted transitions in any engine."
---

> **Audit contract v1 (overrides everything below).** Created by @meta_alchemist (https://x.com/meta_alchemist).
> - Score only with the rubric embedded in `engine/lens.mjs` (`LENS.rubric`, gbf-13-audio-director v1.3.0). `node engine/lens.mjs <pack.json>` computes the grade; this skill only gathers evidence for it and never adds points of its own.
> - Missing evidence is UNMEASURED (0 points, not a defect). A test that did not run is NOT_RUN, never PASS. Never invent a measurement; label every worked example synthetic.
> - Game facts and budgets come from your game profile (`pack.profile`). Treat sample numbers as illustrative. Set the frame-time budget separately for each target device in your game profile.
> - An automated gate needs a negative fixture that fails. Receipts carry measured values, never an unconditional PASS.
> Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

# Transition between music states

*Stems* are separate layers of one piece of music (for example drums, bass and melody) that can be faded in and out. *Ducking* lowers the music while an important sound or line plays. Adaptive music uses both to follow what happens in the game.

## 1. List the states players should hear

List the music states and the game events that switch between them. Define stems, tempo, time signature and transition length for each piece. Examples:

| Genre | States | Switch event |
|---|---|---|
| Mobile puzzle game | Planning, combo streak, level complete | A chain of matches, the last piece placed |
| Exploration or platformer | Overworld, underwater, boss | Entering water, entering the boss room |
| Racing game | Race, final lap, finish | Crossing the line for the last lap |
| Narrative adventure | Calm, tense, resolution | A key dialogue choice |
| Farming or life sim | Morning, evening, festival | The in-game clock, a calendar event |
| Turn-based strategy | Planning, battle, victory | Ending the turn, the last enemy defeated |

Write the states in `music.statesSpecified` and the planned transitions in `profile.cases.transitions` (from state, to state, and whether it interrupts another transition).

## 2. Schedule on the audio clock

Use your engine or middleware's music system where it has one (FMOD parameters, Wwise states and switches, Unity mixer snapshots, Unreal Quartz or MetaSounds, Godot interactive streams, or Web Audio scheduling in a browser). Schedule transitions on the audio clock, not the frame clock. For a transition on the beat, wait for the transport's next bar or beat boundary.

For a crossfade with normalized fade progress t (0 to 1), equal-power gains are cos(pi * t / 2) for the old stem and sin(pi * t / 2) for the new one, which keeps the overall loudness steady. Check the actual summed loudness anyway, especially for stems that share content. Start a repeated or interrupted transition from the current gains, never from zero.

This JavaScript example computes the start time and fade angle for any pair of stems; apply the same maths in your engine's language:

```js
function scheduleFade(trigger, beatOrigin, beatSeconds, fadeBeats, startAngle, targetAngle) {
  if (!(beatSeconds > 0 && fadeBeats > 0)) throw new RangeError("positive beat and fade duration required");
  const start = beatOrigin + Math.ceil((trigger - beatOrigin) / beatSeconds) * beatSeconds;
  return {
    start,
    angleAt(time) {
      const progress = Math.min(1, Math.max(0, (time - start) / (fadeBeats * beatSeconds)));
      return startAngle + (targetAngle - startAngle) * progress;
    }
  };
}
```

Apply the cosine and sine of the scheduled angle to the two stem gains. For an interruption, start the new ramp from the old ramp's angle at the next beat boundary.

## 3. Measure the transitions

Record the trigger time, the scheduled time, the actual start, the gain change at the splice and the ducking depth. Listen after pausing, resuming, changing output devices and switching state twice in quick succession, including a second change in the middle of a fade. Log each case as one `transitions` receipt row (the row of measured values for that case): `scheduleErrorMs`, `gainJumpDb` and `duckDb`, with the mixer trace or capture id. This feeds `music-and-mix:1`.

If your game has no music, the owner can approve the `no-music` profile before scoring: `music-and-mix:1` then reads N/A, `music-and-mix:2` takes the pillar's 20 points, and the `music` group can be left out.

Gather evidence for `node engine/lens.mjs <pack.json>`.
