---
name: sound-effect-bus-and-voice-limits
description: "Route recorded or generated sound effects through a mixer bus in your engine or audio middleware, set voice limits and stealing, and verify playback, loudness and lifecycle on target hardware."
---

> **Audit contract v1 (overrides everything below).** Created by @meta_alchemist (https://x.com/meta_alchemist).
> - Score only with the rubric embedded in `engine/lens.mjs` (`LENS.rubric`, gbf-13-audio-director v1.3.0). `node engine/lens.mjs <pack.json>` computes the grade; this skill only gathers evidence for it and never adds points of its own.
> - Missing evidence is UNMEASURED (0 points, not a defect). A test that did not run is NOT_RUN, never PASS. Never invent a measurement; label every worked example synthetic.
> - Game facts and budgets come from your game profile (`pack.profile`). Treat sample numbers as illustrative. Set the frame-time budget separately for each target device in your game profile.
> - An automated gate needs a negative fixture that fails. Receipts carry measured values, never an unconditional PASS.
> Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

# Build a sound effect bus with voice limits

A *bus* is a mixer channel that groups sounds so you can set, duck and limit them together (for example effects, music, voice and UI). A *voice* is one sound playing at one moment. A *voice limit* caps how many play at once, and *voice stealing* decides which sound stops when the cap is reached.

## 1. Pick your audio stack

Use the bus your project already has. Each option below works the same way for this skill:

- **Engine mixer:** Unity Audio Mixer groups, Unreal sound classes and submixes, Godot audio buses.
- **Audio middleware:** FMOD or Wwise buses, with their built-in voice limits and priorities.
- **Browser build:** Web Audio API gain nodes as buses. For small generated cues, a tiny synth library such as ZzFX is one option among many.
- **Custom engine:** your own mixer with a voice pool.

Sounds can be recorded samples or generated from parameters (pitch, envelope, waveform and gain), often called procedural sound. Both go through the same bus.

## 2. Name cues after game events

Name each cue after what happened in the game, not after the sound file. Keep presets and random variation in the game's audio settings. Examples:

| Genre | Cues |
|---|---|
| Mobile puzzle game | Select, swap, match, invalid move, level complete |
| 2D platformer | Jump, land, collect, checkpoint, hurt |
| Racing game | Gear shift, collision, lap complete, boost ready |
| Narrative adventure | Dialogue advance, choice made, clue found |
| Farming or life sim | Plant, water, harvest, shop purchase, day ends |
| Turn-based strategy | Unit selected, move confirmed, turn starts |
| 3D arena game | Footstep, ability ready, hit, low health |

Load or cache cues that play often before they are needed. Set a retrigger limit per cue and a concurrent-voice limit per bus from profiling, and write both in the game profile (`voiceCap`, `maxSameCuePerSecond`).

## 3. Protect the cues that matter

Mark the cues a player must hear (a turn starting, an invalid move, low health) as high priority so voice stealing never removes them. Give every cue that carries required information a visual or caption alternative, and tell HUD Designer (09) about it.

## 4. Measure on the target device

Trigger a dense burst of cues beyond the cap and record:

- peak active voices and which voice was stolen (`voices.peakVoices` and the `voiceStress` receipt rows, for `loudness-and-voices:2`),
- loudness and true peak of the mixed output with the shipping meter, saved with the meter settings (the `mixedPeak` rows, for `loudness-and-voices:1`),
- the most times one cue played in a second (`variety.sameCuePerSecondMax`, for `space-and-variety:2`),
- mute, pause, focus loss, resume and teardown, and how many voices or nodes are left after stopping (`lifecycle`, for `voice-and-lifecycle:2`).

## 5. Browser adapter example (Web Audio)

Browsers start audio only after a player gesture such as a tap or a key press. Resume the audio context from that gesture, cache each generated buffer at its source sample rate, connect the bus to the project's output chain, and stop the bus on mute, focus loss or teardown. This example steals the oldest voice first; give essential cues a protected priority if your project needs one.

```js
function createVoiceBus(context, mixer, cap) {
  if (!Number.isSafeInteger(cap) || cap < 1) throw new RangeError("positive voice cap required");
  const voices = new Map();
  function release(source, stop) {
    const gain = voices.get(source);
    if (!gain) return;
    voices.delete(source);
    source.onended = null;
    source.disconnect();
    gain.disconnect();
    if (stop) source.stop();
  }
  return {
    unlock: () => context.resume(),
    play(buffer, volume) {
      if (context.state !== "running") return false;
      if (voices.size === cap) release(voices.keys().next().value, true);
      const source = context.createBufferSource();
      const gain = context.createGain();
      source.buffer = buffer;
      gain.gain.value = volume;
      source.connect(gain);
      gain.connect(mixer);
      voices.set(source, gain);
      source.onended = () => release(source, false);
      try { source.start(); }
      catch (error) { release(source, false); throw error; }
      return true;
    },
    stop() { for (const source of voices.keys()) release(source, true); },
    get active() { return voices.size; }
  };
}
```

In an engine or middleware, use the built-in equivalents: a bus or group with a voice limit, a stealing rule and a priority per cue.

On the approved device, unlock audio separately from playback, run an over-cap burst, check which voice was stolen, stop the bus and count what is left. Save the decoded mixed peak and meter settings with the loudness capture.

Gather evidence for `node engine/lens.mjs <pack.json>`.
