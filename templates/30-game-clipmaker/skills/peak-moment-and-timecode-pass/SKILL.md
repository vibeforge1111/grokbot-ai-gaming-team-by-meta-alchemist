---
name: peak-moment-and-timecode-pass
description: "Use when ranking peak in-match moments from a recording or a moment log, and checking timecodes and clip length."
---

> **Audit contract v1 (overrides everything below).** Created by @meta_alchemist (https://x.com/meta_alchemist).
>
> Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.
> - Score only with the rubric embedded in `engine/lens.mjs`. This skill gathers evidence; it never adds points.
> - Missing evidence is UNMEASURED (0 points, not a defect). Never invent a measurement; label every worked example synthetic.

# Peak moment and timecode pass

Use this skill to fill the detection and timing lines. This bot finds in-match moments. Trailer Director still covers trailer-shaped cuts.

1. Record how many peak moments were listed (`detection.moments`) against the owner's minimum. Record `detection.ranked` when the list is in priority order.
2. Record clip durations in seconds as `timing.durationS`. The lens checks them against the owner's range. Record overlapping clips as `timing.overlaps`. It must be 0.

There is no bundled detector or encoder here. Use the owner's recordings or a moment log they already have. Never invent a timecode. Missing logs earn U.
