# Rubric guide (100-point scale)

Created by @meta_alchemist (https://x.com/meta_alchemist).

## The shape

- **100 points = 5 pillars x 20 points.** Each pillar has **2 lines**, so 10 lines in all.
- Each line has a **weight** (the two lines in a pillar sum to 20; usually 10 and 10).
- Each line is scored at a **level 0 to 4**, or **U**.
- **Contribution = weight x level / 4.** A line passes at **level 3**.
- **U (UNMEASURED)** earns 0 points and is never filed as a defect. A test that did not run is NOT_RUN and never reads as PASS.

| Level | Meaning (default anchors) |
|---|---|
| 0 | The failure the line exists to catch (write it concretely per line) |
| 1 | Nominal success is unreliable or major supported cases fail |
| 2 | Common path works; material supported edge cases remain |
| 3 | All required cases and budgets pass; only minor defects remain (pass) |
| 4 | The best concrete behavior (write it concretely per line) |
| U | Required evidence missing, stale or from the wrong build |

## Grade, coverage and verdict

- **Supported points** sum the contributions over measured lines. The grade equals supported points unless a confirmed release blocker in templates 20, 21 or 22 sets the grade to zero.
- **Coverage** is the share of weight that was measured. Always print it next to the grade: "62/100 at 70% coverage" is honest; "62/100" alone is not.
- Include an **interval** in the local grade draft: low end counts U as 0, high end counts U as full marks.
- **Verdict** is separate from the grade: PASS, CONDITIONAL, BLOCKED (an unresolved P0 or a measured release blocker), INVALID (no valid pack).
- **Bands:** 90 to 100, 75 to 89, 50 to 74, below 50.

## Writing a line

```json
{
  "id": "closure-quality:1",
  "pillar": "Closure quality",
  "name": "Verifier is not the fixer",
  "weight": 10,
  "passAt": 3,
  "evidence": "trace",
  "anchors": {
    "0": "The fixer closed their own ticket with no artifacts",
    "1": "...", "2": "...", "3": "...",
    "4": "Every closure has a different verifier and raw artifacts",
    "U": "UNMEASURED: required evidence missing, stale or wrong build."
  },
  "automatedGate": true,
  "negativeFixture": { "cmd": "node tests/lens-negative-fixtures.mjs --line closure-quality:1" }
}
```

- **Level 0 and level 4 must be concrete and observable.** "Good feel" is not a level 4. "Input to first visible response under the profile budget on every supported device" is.
- **Evidence type** is one of `static`, `capture`, `trace`, `config`, `na`.
- **Every automated gate ships a negative fixture that must fail.** A check that cannot fail is removed.
- **Thresholds go in the game profile**, never in the anchor text or the engine.

## Applicability

Some lines do not apply to some games: a localization line in a single-language game, an aiming line in a puzzle game, a payment line in a game that sells nothing. The owner decides this before scoring by selecting one or more approved profiles in the game profile, for example `"rubricProfile": ["no-aiming", "offline-only"]`. Each profile lives in `RUBRIC.json` under `profiles`, with a reason, the weights it changes and, when needed, `blockersNotApplicable` (release blockers that cannot apply either).

The weights follow one rule, so every profile and every combination of profiles is predictable:

1. A line the profile marks not applicable gets weight 0 and reads N/A, never U and never a defect.
2. Inside a pillar, the line that still applies takes the pillar's 20 points.
3. When both lines of a pillar do not apply, that pillar's 20 points are shared out over all remaining lines in proportion to their weights (eight lines of 10 become 12.5 each).
4. A release blocker on a line that does not apply, or listed in `blockersNotApplicable`, does not block.

The validator checks that every profile's weights follow this rule, and the engine applies the same rule when profiles are combined. An unknown profile name, or a combination that leaves nothing to score, makes the pack INVALID. Never redistribute weights during a run, and say which profiles were used next to the grade. A whole template that does not apply reports grade null and is left out of averages.

## Freezing and versions

A rubric is frozen by version and hash ([../spec/RUBRIC_HASH.md](../spec/RUBRIC_HASH.md)). Changing a line, weight or anchor is a new version with a `migration` note. Grades from different versions never share a trend line.

## Out of 10

People often ask for "out of 10". Convert at the end, never in the middle: `grade / 10`, one decimal, with coverage. Do not score lines on a 0 to 10 scale with half steps; that older scheme hid unmeasured lines as guesses. See [../guides/rubrics-and-polish.md](../guides/rubrics-and-polish.md).
