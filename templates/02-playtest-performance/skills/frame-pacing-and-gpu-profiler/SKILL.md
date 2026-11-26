---
name: frame-pacing-and-gpu-profiler
description: "Use when collecting frame-time samples on the primary device, and on any extra device the owner put in scope. GPU counters are optional."
---

> **Audit contract v1 (overrides everything below).** Created by @meta_alchemist (https://x.com/meta_alchemist).

> Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.
> - Score only with the rubric embedded in `engine/lens.mjs`. This skill gathers evidence; it never adds points.
> - Missing evidence is UNMEASURED (0 points, not a defect). Never invent a measurement; label every worked example synthetic.

# Frame pacing and optional GPU notes

Use this skill to fill the performance and repeated-session memory lines. The frame-time budget is the owner's. Never assume a target frame rate.

## Collect frame times

1. Confirm the primary device and the owner-set p95 budget in milliseconds (for example 16.67 ms for a 60 Hz starting point).
2. Record a stream of frame times, in milliseconds, from a real play session of the core journey. Prefer a platform sampler, a browser performance trace, or an engine profiler the owner already uses.
3. Store the raw samples with the pack. The lens computes `p95(performance.primaryFrameMs)` and compares it to the budget. Do not pre-round a pass or fail.
4. If the owner put additional device profiles in scope, repeat the capture on each one. Record `performance.profilesMeasured` and how many of those profiles were over budget.
5. If only one device is in scope, stop after the primary capture and ask the owner to approve the `single-device` rubric profile before scoring.

## Optional GPU notes

GPU counters (utilization, memory, stall reasons) are optional context. They do not award points on this preview rubric. If you have them, attach them as an artifact and mention hitch spikes in the report. If you do not have a GPU sampler, skip this section. This skill does not ship a sampler.

## Repeated-session memory

If the owner wants the stability slope line measured, record heap size after cleanup at the end of at least five repeated sessions, in megabytes, as `stability.heapPostCleanupMb`. If you cannot measure heap, leave the array out and let the line read U.

## Honesty

- This preview has no bundled profiler. Use the owner's tools, or record a short session by hand from an on-screen counter if that is all that exists.
- Never invent a frame time. Missing samples earn U, which is honest.
- Keep findings as local ticket drafts. The human reviews and files them.
