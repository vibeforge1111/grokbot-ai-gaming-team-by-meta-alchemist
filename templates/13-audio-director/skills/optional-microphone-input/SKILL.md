---
name: optional-microphone-input
description: "Design optional sound-driven controls that use the microphone only after the owner and the player opt in, never record or send audio, and always offer an equal non-microphone control."
---

> **Audit contract v1 (overrides everything below).** Created by @meta_alchemist (https://x.com/meta_alchemist).
> - Score only with the rubric embedded in `engine/lens.mjs` (`LENS.rubric`, gbf-13-audio-director v1.3.0). `node engine/lens.mjs <pack.json>` computes the grade; this skill only gathers evidence for it and never adds points of its own.
> - Missing evidence is UNMEASURED (0 points, not a defect). A test that did not run is NOT_RUN, never PASS. Never invent a measurement; label every worked example synthetic.
> - Game facts and budgets come from your game profile (`pack.profile`). Treat sample numbers as illustrative. Set the frame-time budget separately for each target device in your game profile.
> - An automated gate needs a negative fixture that fails. Receipts carry measured values, never an unconditional PASS.
> Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

# Design optional microphone input

Some games let the player act with their voice or with sound: hum to hold a note, clap to flip a switch, blow to clear fog. This skill keeps that optional, private and fair. Skip it if your game does not use the microphone; leave `micFallback` out of the pack.

## 1. Off by default, and only with consent

- The feature switch is off by default. Only the owner turns it on, for a build they have decided to ship with it.
- In the game, the microphone stays off until the player chooses to use it. Before the system permission prompt, show a short in-game explanation of what the microphone is used for, that no audio is recorded or sent, and how to turn it off. Ask for permission only after the player taps or presses to agree. Remember the choice and let the player change it in settings at any time.
- Show an indicator while the microphone is listening. Close the microphone (stop every microphone stream or track) when the player opts out, pauses, leaves the game or the profile's focus-loss rule applies.
- Never record, store, upload or send audio. Compute a loudness level on the device and throw the raw samples away.

## 2. Always offer an equal alternative

Every sound-driven action needs a button, stick, key or touch alternative with the same range of outcomes, and the game must be fully playable without a microphone. Examples:

| Genre | Sound-driven action | Equal alternative |
|---|---|---|
| Rhythm game | Hum to hold a long note | Hold a button for the same length |
| Party game | Shout to fill a boost meter | Tap repeatedly or hold a trigger |
| Narrative adventure | Blow to clear fog from a window | Swipe or hold a key |
| Mobile puzzle game | Clap to flip a switch | Tap the switch |

## 3. Turn sound into a game value

Define what sound intensity means for the action, and write the noise floor, calibration, smoothing and trigger thresholds in the game profile. Use RMS, a simple loudness level: the square root of the average of the squared sample values. Compute it from a reused buffer so nothing piles up in memory. Handle denied permission, revoked permission and an interrupted input device without losing the alternative control.

## 4. Test with synthetic signals

Test with generated signals (silence, a quiet tone, a sustained tone and a short burst), not recordings of real people. Compare each response with the alternative control. Check that captions or visual cues cover any sound that carries required information.

Then run the `mic-fallback` growth check, which is reported beside the grade and not scored. Record in `micFallback`:

- `tested`: the access states you tried; it must include `denied` and `revoked`,
- `openTracksAfterStop`: microphone tracks still open after stopping (must be 0),
- `baselineAction`, `deniedAction`, `revokedAction`: the action the alternative control produces with the microphone unused, denied and revoked (all three must match).

Gather evidence for `node engine/lens.mjs <pack.json>`.
