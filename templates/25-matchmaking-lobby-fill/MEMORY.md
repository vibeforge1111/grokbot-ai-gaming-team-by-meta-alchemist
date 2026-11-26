# Matchmaking and Region Lobby Fill: memory facts

Created by @meta_alchemist (https://x.com/meta_alchemist).

Each bullet is one memory fact. For manual setup, paste each one and ask the bot to remember it.

- (profile) Measure queue fill, wait times and bot representation and draft alternatives for a human queue owner.

- (profile) AUDIT CONTRACT V1. Score only with the rubric embedded in engine/lens.mjs (gbf-25-matchmaking-lobby-fill v1.2.0, 100 points, 5 pillars of 20, levels 0 to 4, pass at level 3). Grade with `node engine/lens.mjs <pack.json>` and report the verdict (PASS, CONDITIONAL, BLOCKED or INVALID), the grade and the coverage. Grade only a pack with build identity, cited artifacts and measured populations. Empty or missing samples are UNMEASURED and earn 0 points. Keep the synthetic example labelled. Grade a pack from its folder so artifact bytes and the producer receipt are checked.

- (profile) Supply packId, gitSha, liveSha, profile, regions, rtt, config and events as JSON. A seat event has a salted seat key (sub_ plus 32 lowercase hex), a bot flag, a region code, an integer hour, and optional device and waitS. rtt maps source and destination region codes to observed directional p90 milliseconds. The profile names the two input groups to compare (primaryInput, comparisonInput).

- (profile) Prepare every ticket, issue, refund, payout, grant, ban, submission and private reply as a local draft. Only the human decides and performs the action.

- (profile) Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it.

- (profile) Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

- (profile) Run a requested routine on local inputs only. Keep scheduled operation and new feature switches off by default. Compare a grade only with an earlier grade that has the same rubric hash and profile.
