# Streamer Scout, Patch Notes & Update Hype Director

Created by @meta_alchemist (https://x.com/meta_alchemist).

Match creators to your intended audience and turn verified build changes into patch notes and updates for players.

It fits any game. Spectator, streamer-mode and season features apply only if your game has them. "Update Hype" in the name means the build-up to each update, or to each season when your game runs them.

Rubric: `gbf-20-streamer-hype-director` v1.4.0, 100-point scale (5 pillars of 20 points, 10 lines, levels 0 to 4 or U). Contribution per line is weight x level / 4 and a line passes at level 3. U (UNMEASURED) earns 0 and is never filed as a defect.

Use a CI run or a manual capture for build evidence. Playtest QA (template 02) is coming later.

Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it.

## Quick start

```
node engine/lens.mjs fixtures/good-pack.json      # grade the worked example (synthetic, not a measurement)
node tests/lens-negative-fixtures.mjs             # every negative and missing-input case must behave
node tests/test-lens-contract.mjs                 # rubric match, recipe embed and text checks
node engine/lens.mjs your-pack.json               # grade your own evidence pack
```

The engine prints one grade record: per-line level, evidence ids, findings, supported points, coverage, verdict (PASS, CONDITIONAL, BLOCKED or INVALID), growth checks and deduplicated ticket candidates. It refuses (verdict INVALID, grade null) a pack that is missing, not VALID, or has no liveSha, gitSha or packId.

## How the engine decides a level

- Computed lines read `metrics.<group>` from the pack. Each group must name an `artifact` id that exists in `pack.artifacts`; otherwise the line is U.
- A failed condition caps the level: hard conditions at 1, normal ones at 2, level-4-only ones at 3. Receipt checks have the caps shown in the rubric (a receipt is one result row for one test case you agreed in `profile.cases`, such as one patch note line with its commit). All conditions passing gives 4.
- Judged lines (perception calls a script cannot make) accept `pack.judgements[lineId] = { level, judge, evidenceIds, note }` only when every evidence id is in the pack and at least one matches the line's evidence type. A made-up id gives U.
- Thresholds come from `pack.profile` (your game profile). Missing thresholds give U, never a default.

See `node engine/lens.mjs --meta` for the sample population required by each line (the list or count of things measured, such as share links or patch note lines). Single-number summaries without a listed population require a positive `measuredCases`. Missing or empty evidence earns U. Each computed line requires an artifact of its declared type.

For real packs, supply the producer receipt and local artifact files described in the [evidence contract](../../spec/TEMPLATE_SPEC.md#live-evidence). The [rubric](RUBRIC.md) lists case fields, comparisons and failure caps.

## Pack fields (one row per rubric line)

| Line | Name | Kind | Reads | Passes when |
|---|---|---|---|---|
| `capture-reliability:1` | Recording replays and exports | computed | `recording.replayed`, `recording.exported`, `recording.soundOk`, `recording.attributionOk` | recording.replayed is true (hard: level 1 on failure); recording.exported is true; recording.soundOk is true; recording.attributionOk is true |
| `capture-reliability:2` | Capture performance budget | computed | `captureCost.frameMsOn`, `captureCost.frameMsOff`, `receipts.capturePairs` | `diff(p95(captureCost.frameMsOn),p95(captureCost.frameMsOff)) <= P.maxCaptureOverheadMs`, approved receipt cases pass |
| `spectator-comprehension:1` | Spectator view shows only allowed information | computed | `spectatorPolicy.policyViolations`, `receipts.partnerFeeds` | `spectatorPolicy.policyViolations == 0`, approved receipt cases pass |
| `spectator-comprehension:2` | Spectator view readable at stream resolutions | computed | `spectatorRead.resolutionsChecked`, `spectatorRead.unreadable` | spectatorRead.resolutionsChecked covers P.streamResolutions; spectatorRead.unreadable == 0 |
| `creator-controls:1` | Streamer mode and redaction | computed | `streamerMode.namesLeaked`, `streamerMode.sensitiveLeaked` | streamerMode.namesLeaked == 0 (hard: level 1 on failure); streamerMode.sensitiveLeaked == 0 (hard: level 1 on failure) |
| `creator-controls:2` | Share links | computed | `links.links`, `links.resolved` | taggedLinks(links.links,P.shareTag) == len(links.links); links.resolved == len(links.links) |
| `truthful-claims:1` | Patch notes checked against commits | computed | `notes.mappedToCommits`, `notes.lines`, `receipts.shippedClaims` | `notes.mappedToCommits == notes.lines`, approved receipt cases pass |
| `truthful-claims:2` | Technical claims match the code | computed | `claims.matchingCode`, `claims.claims` | claims.matchingCode == claims.claims (hard: level 1 on failure) |
| `player-safety:1` | Creator and viewer features cannot change results | computed | `fairness.creatorFeatureOutcomeEffects` | fairness.creatorFeatureOutcomeEffects == 0 (hard: level 1 on failure) |
| `player-safety:2` | Test results carry measured values | computed | `receipts.unconditionalPassAccepted`, `receipts.measuredValuesPresent` | receipts.unconditionalPassAccepted is false (hard: level 1 on failure); receipts.measuredValuesPresent is true |

## Growth checks (for games with a spectator or streaming mode, the stream delay policy can block release)

| Check | Areas | Reads | Passes when |
|---|---|---|---|
| `spectator-links` | spectator-links | `spectatorLinks.openedIntendedView`, `spectatorLinks.tested`, `spectatorLinks.respectsDelay` | spectatorLinks.openedIntendedView == spectatorLinks.tested; spectatorLinks.respectsDelay is true |
| `creator-sources` | creator-research | `creatorLog.choices` | every shortlist decision has a dated, opened source and a reviewed reason (hard: level 1 on failure) |

## Adapt to your game

Choose the kind of update your community expects. A one-time release may need a trailer and patch notes. Spectator and season workflows apply only when the game offers those features.

- Single-player game (for example a narrative adventure or a puzzle game): patch notes per version ("Fixed a save that would not load after chapter 3"), a creator shortlist of people who play story or puzzle games start to finish, and checks on recording, share links and any streamer mode. With the owner's approval select the `no-spectator-mode` profile and leave the spectator groups (`spectatorPolicy`, `spectatorRead`, `spectatorLinks`) out of the pack.
- Mobile game: short "what's new" store notes plus a longer note on your site; short-video creators for outreach.
- Online game with a spectator or streaming mode: every spectator check applies, and the stream delay blocker must be measured before release.
- Game with seasons: a headline note per season, with every line still mapped to a commit. Without seasons, the same steps run once per update.

### Lines that may not apply

Three approved profiles live in `RUBRIC.json`. The owner approves the profile before scoring and sets it in the game profile, for example `"rubricProfile": ["no-spectator-mode"]` in `pack.profile`:

| Profile | Use when the game has | Lines that read N/A | Lines that take the points | Groups you can leave out |
|---|---|---|---|---|
| `no-spectator-mode` | No spectator or live viewing mode | `spectator-comprehension:1` and `:2` | the other eight lines, 12.5 points each | `spectatorPolicy`, `spectatorRead`, `spectatorLinks` |
| `no-share-links` | No share or watch links | `creator-controls:2` | `creator-controls:1` | `links` |
| `no-streamer-mode` | No streamer mode and no names, chat or account details on screen | `creator-controls:1` | `creator-controls:2` | `streamerMode` |

An N/A line is not U and not a defect, and with every other line at level 3 or more the verdict can be PASS. `no-spectator-mode` also switches off the spectator release blockers (`spectator-policy`, `stream-delay`, `spectator-feed`), and `no-streamer-mode` the two redaction blockers. Selecting both `no-streamer-mode` and `no-share-links` leaves the creator controls pillar with nothing to score, so its 20 points are shared over the other lines. Name the profiles next to the grade.

A game that has a streamer mode, or shows names or chat on screen, must measure `creator-controls:1`: never select `no-streamer-mode` to skip a redaction check that applies, and never fill the line with made-up values.

- Set your share link tag in the profile; the engine checks every link carries it.
- Measure capture cost with the same scene twice, capture off then on.
- Copy `fixtures/good-pack.json`, keep its shape, and replace every value with numbers from your own build. Keep `synthetic` false (or remove it) for real packs.
- Never edit thresholds inside the engine; put them in `pack.profile`.

## Owner calls

- How much frame time recording may add on each device (the capture overhead budget).
- If your game has a spectator or streaming mode: what a spectator may see, and the minimum stream delay.

## Blockers

PASS, CONDITIONAL or BLOCKED is reported separately from the grade and coverage. An unresolved P0 blocks. Each confirmed release blocker sets verdict BLOCKED and grade 0. Supported points, coverage and the evidence interval retain their uncapped values. Unmeasured safety evidence prevents PASS.

For games with a spectator or streaming mode:

- A measured spectator information policy violation blocks release.
- A tested spectator feed that fails to open as intended blocks release.
- A measured spectator feed or stream delay violation blocks release.

For games with a streamer mode, or that show names or chat on screen:

- Exposed player names or sensitive information in the streamer capture block release.

A game without a spectator mode selects the `no-spectator-mode` profile once the owner approves it, and the spectator blockers no longer apply. A game without a streamer mode or on-screen names selects `no-streamer-mode` the same way, and the redaction blockers no longer apply.

- Recording checks need a real capture of your build; nothing is published by the agent.

## Files

- `recipe.json`: the importable bot template. The `*-lens-engine` skill carries the engine source so a new owner gets it without this folder.
- `engine/lens-kit.mjs`, `engine/lens.mjs`: the engine (no dependencies, Node 18+).
- `fixtures/good-pack.json`, `fixtures/mutations.json`: worked example and its negative and missing-input cases.
- `tests/`: portable tests. `RUBRIC.json` and `RUBRIC.md`: the frozen rubric.

The optional creator-sources check requires a dated, opened source and a reviewed reason for each shortlist decision. An inaccessible source gives U.
