---
name: cross-editor-scene-parity
description: "The Scene Parity half of this template, for games with a server and level geometry: after a scene moves between editors (Blender, Unity, Godot, Unreal) or is edited by an agent over MCP, prove the server's collision, spawn and visibility data match what players see."
---

> **Audit contract v1 (overrides everything below).** Created by @meta_alchemist (https://x.com/meta_alchemist).
> - Score only with the rubric embedded in `engine/lens.mjs` (`LENS.rubric`, gbf-15-mcp-anticheat-director v1.3.0). `node engine/lens.mjs <pack.json>` computes the grade; this skill only gathers evidence for it and never adds points of its own.
> - Missing evidence is UNMEASURED (0 points, not a defect). A test that did not run is NOT_RUN, never PASS. Never invent a measurement; label every worked example synthetic.
> - Game facts and budgets come from your game profile (`pack.profile`). Treat sample numbers as illustrative. Set the frame-time budget separately for each target device in your game profile.
> - An automated gate needs a negative fixture that fails. Receipts carry measured values, never an unconditional PASS.
> Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

# Cross-editor scene parity

This is the "Scene Parity" half of the template. It applies only to a game with a server that uses level geometry: walls, colliders, spawn points or line-of-sight blockers. It checks one thing: the level the server uses to judge collisions and visibility is exactly the level players see.

Why it matters: authoring tools disagree on axes and units. A wall that looks right on screen can sit somewhere else in the server's collision set, and that gap is where players walk through walls, see through cover or get hit by shots the screen says were blocked.

MCP (Model Context Protocol) is a common way to connect an AI agent to an editor such as Blender, Unity, Godot or Unreal so the agent can place and change objects. If an agent edits your levels through an MCP connection, or you move scenes between editors, treat the result as untrusted until this parity check passes. This skill never connects to an editor itself; it compares exported files.

## Method
1. Write down each source editor's convention once, in your game profile: up axis, forward axis, handedness, unit. Common ones: Blender is Z up in metres; Unreal is Z up, left handed, centimetres; Unity is Y up, left handed, metres; Godot and Three.js are Y up, right handed, metres. A 2D engine usually has Y down in pixels.
2. Choose one target coordinate system and convert position, orientation, scale and units with a tested transform for each editor. Round to a fixed precision before hashing so float noise does not change the hash.
3. Build the server collision set from the same exported file the client loads, never from a hand-kept copy.
4. Hash each independently loaded collision set, sorted by ID. Include position, normalized rotation with a canonical quaternion sign, scale, collider shape and geometry, spawn transforms and tags. Compare the client and server digests. Any mismatch blocks the scene.
5. Spawn and visibility data follow the same rule: what the server uses to decide who sees whom (its interest management) must match the geometry players see. Record `hiddenInfo.hiddenStateSent` (entities sent to a player through a wall that should hide them) and whether the build relies on distance alone (`hiddenInfo.relyOnDistanceOnly`).
6. For each approved scene in `profile.cases.sceneParity`, add one row to `receipts.sceneParity` with the scene, coordinate system, the six client and server digests and both export artifacts. These rows feed `exposure-and-abuse:1`.

## Short examples (synthetic, for illustration only)
- 2D platformer with online races: the tile map's solid tiles and checkpoints, exported from a level editor, must give the same digest on client and server.
- Racing game: track walls, shortcuts the rules forbid and checkpoint gates; a gate rotated only in the client copy lets the server miss a skipped corner.
- Turn-based strategy game: line-of-sight blockers for fog of war; the server must not send units hidden behind a cliff.
- 3D arena game: cover props and spawn points exported from Blender through an MCP-driven agent and loaded by an authoritative server.

A game with no level geometry (for example a card game) has nothing to compare here. Its `exposure-and-abuse:1` line stays U today, because that line reads these scene receipts; say so in the report.

## Negative fixture
Rotate one exported prop by 90 degrees in the client copy only and confirm the hash comparison fails.

## Pitfalls
- Converting position but not rotation or scale.
- Hashing unsorted lists, so the same scene gives different hashes.
- Editor plugins (MCP bridges) that write straight into the scene: treat their output as untrusted until the parity hash passes.

Gather evidence for: `node engine/lens.mjs <pack.json>` (see `mcp-anticheat-lens-engine`).
