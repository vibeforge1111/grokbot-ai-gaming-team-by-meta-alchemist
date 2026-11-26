---
name: voluntary-replay
description: "Use when separating a stated reason to play again from observed repeat play in a closed observation window. Also carries the worked example files."
---

> Created by @meta_alchemist (https://x.com/meta_alchemist).
> Audit contract v1 (overrides everything below). Grade only with the installed lens. Use the owner's approved game profile for game facts, scope and budgets. Synthetic numbers illustrate one profile. Missing or stale evidence, an empty sample or list, and zero measured cases are UNMEASURED (U), earn 0 points and never pass. Record an unavailable run as NOT_RUN. A confirmed release blocker or unresolved P0 gives BLOCKED and grade 0. An unknown fixture selector must fail. Keep each ticket as a local draft. Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

# Test the reason for another turn

Keep two questions apart: why a tester says they would play again (`replay:1`), and whether they actually took another turn when invited, counted only after the observation window closes (`replay:2`). "Intrinsic" means the reason comes from the game itself (a choice, a challenge or a discovery the tester wants), not from obligation, a streak or a reward timer.

Rubric lines this feeds: `replay:1` (Reason to replay is intrinsic) and `replay:2` (Voluntary replay after an opportunity).

## Steps

1. **Agree the invitation with the owner.** Name the invitation (for example "next optional board"), the cohort (`profile.cohort`) and the event that closes the window (`profile.window`). Write both into the profile before collection.
2. **Offer a neutral choice.** At the invitation, offer to stop or continue with equal weight. Do not praise either option.
3. **Ask for the reason separately.** After the loop, ask "What, if anything, would make another attempt interesting?" Code the answer with the owner's reason key, including indifference and obligation as options. Under `metrics.reason.samples`, write `{caseId, intrinsic}`: true for a reason from the game itself, false for indifference, obligation or an outside reward.
4. **Wait for the window to close.** Do not count returns while the window is open. If it is still open, request another capture and stop here for `replay:2`.
5. **Record one row per invitation.** Under `metrics.return.samples`, write `{caseId, offerRef, cohort, window, windowClosed, returned}`: `offerRef` is the locator of that invitation in the trace, `cohort` and `window` repeat the profile values exactly, `windowClosed` is true, and `returned` is true or false. A declined invitation stays in the share as `returned: false`.
6. **Bind the receipts.** `reason` uses an artifact with `lineId` `replay:1` and kind `capture`; `return` uses `lineId` `replay:2` and kind `trace`. Both carry the pack's build ids, the profile scope, the `context` and a `source` locator.
7. **Grade.** From the template folder run `node engine/lens.mjs <pack.json>`. Compare `fixtures/rhythm-pack.json`: four closed invitations and three returns give a share of 0.75 and level 3 under its illustrative bands.
8. **When you cannot measure.** An invitation that was never observed is a gap: record it in the report and leave it out. A row with another cohort or window, an open window or an empty `offerRef` makes `replay:2` U.
9. **Draft one change.** For a low share, draft a change to one choice or reward and a matched replay test with the same cohort and window. Reward changes go to Economy Director (06) as a local draft.

## Output

- `metrics.reason.samples` rows `{caseId, intrinsic}` and `metrics.return.samples` rows `{caseId, offerRef, cohort, window, windowClosed, returned}`, each with its receipt.
- The observed replay share beside the coded reasons, never merged into one number.
- An experiment card for one choice or reward change.

## Examples by genre (illustrative)

- **Mobile puzzle game:** the invitation is the next optional board; the window closes when the session ends.
- **Rhythm game:** the invitation is an optional phrase; the window closes when practice ends.
- **Racing game:** the invitation is a rematch; the window closes when the tester leaves the results screen.
- **Narrative adventure:** the invitation is replaying a chapter for another branch; the window closes at the end of the play session.
- **Farming or life sim:** the invitation is "play another day"; an answer like "I have to water the crops or they die" is obligation, so `intrinsic: false`.

## Pitfalls

- Counting returns before the window closes.
- Dropping declines from the share.
- Letting the reason coding see whether the tester returned. Code the reason first.

## Worked example files

The two synthetic packs cite the observer notes below. If `fixtures/session-notes.md` or `fixtures/rhythm-pack.json` is not on disk, write these files byte for byte to inspect the worked baselines, then run `node engine/lens.mjs fixtures/rhythm-pack.json`. They are illustrative, not measurements, and never set your budgets.

### fixtures/session-notes.md

<!-- embed fixtures/session-notes.md -->
```markdown
# Synthetic session notebook

Created by @meta_alchemist (https://x.com/meta_alchemist).

Illustrative observations for two different games. Each column has its own build, profile, case IDs and observation window. Times are seconds on the session clock. The observer kept an anonymous session sheet and linked trace offsets to the corresponding goal and feedback prompts.

| Scope | Build | Cohort | Closed window | Meaningful action | Consequence |
|---|---|---|---|---|---|
| puzzle-opening-window-a | synthetic-build-game-loop-alchemist | First session | Next optional board offered before the session closes | Place a tile | Path connected |
| rhythm-phrase-window-b | synthetic-rhythm-build | First phrase | Optional phrase offered before practice closes | Tap a response | Phrase answered |

## Goal

Puzzle readback at opening: "Connect the two exits." Coded as `connect exits`. Rhythm readback: "Answer the phrase." Coded as `answer phrase`. The observer asked before offering hints.

## Action

Puzzle opened at 3 and the first tile landed at 15, a 12-second interval. Rhythm started at 2 and the response landed at 3, a 1-second interval. The separate approved illustrative budgets were 18 and 2.

## State

The puzzle trace changed from disconnected to connected. The rhythm response advanced from listening to answered. These were the transitions expected by each profile.

## Feedback

Puzzle response: "The route opened." Rhythm response: "It echoed my phrase." The observer recorded the cue the participant referenced, then applied the local response key.

## Beat

Puzzle resolution at 12, next available placement at 18. Rhythm phrase ended at 3, next input window at 5. The beat budgets were 9 and 3 seconds.

## Recovery

Puzzle retry offered control at 23 after a setback at 14. Rhythm control returned at 8 after a rest at 5. The recovery budgets were 14 and 4 seconds.

## Choice

Starting from the same board, a different tile opened an alternate route. Starting from the same phrase, a different response produced an alternate echo. Each pair had a distinct state or sound trace.

## Exit

Declining the optional board ended the puzzle run. Declining the next phrase returned to rest. No further action was required at either stop boundary.

## Reason

Puzzle response: "I want to find another route." Rhythm response: "I want to hear the other answer." Both matched their profile's intrinsic-reason key.

## Return

Puzzle opportunity `offer-board` was accepted before closure. Rhythm offers `offer-a`, `offer-b` and `offer-c` were accepted, and `offer-d` was declined. The rhythm observed share is 3/4. Each case records the cohort, window, offer locator and closure status.
```
<!-- end embed -->

### fixtures/rhythm-pack.json

<!-- embed fixtures/rhythm-pack.json -->
```json
{
  "packId": "synthetic-phrase-review",
  "status": "VALID",
  "gitSha": "synthetic-rhythm-source",
  "liveSha": "synthetic-rhythm-build",
  "synthetic": true,
  "openP0": 0,
  "note": "Synthetic worked example. Case IDs label anonymous opportunities. All numbers are illustrative.",
  "profile": {
    "scope": "rhythm-phrase-window-b",
    "genre": "rhythm",
    "bands": {
      "floor": 0.5,
      "pass": 0.75,
      "target": 1,
      "minCases": 3
    },
    "cohort": "first phrase",
    "window": "optional phrase offered before practice closes",
    "action": "tap a response",
    "outcome": "phrase answered",
    "actionBudgetS": 2,
    "beatBudgetS": 3,
    "recoveryBudgetS": 4
  },
  "artifacts": [
    {
      "id": "receipt-goal",
      "kind": "capture",
      "lineId": "opening:1",
      "gitSha": "synthetic-rhythm-source",
      "liveSha": "synthetic-rhythm-build",
      "scope": "rhythm-phrase-window-b",
      "context": {
        "cohort": "first phrase",
        "window": "optional phrase offered before practice closes",
        "action": "tap a response",
        "outcome": "phrase answered"
      },
      "source": "fixtures/session-notes.md#goal"
    },
    {
      "id": "receipt-action",
      "kind": "trace",
      "lineId": "opening:2",
      "gitSha": "synthetic-rhythm-source",
      "liveSha": "synthetic-rhythm-build",
      "scope": "rhythm-phrase-window-b",
      "context": {
        "cohort": "first phrase",
        "window": "optional phrase offered before practice closes",
        "action": "tap a response",
        "outcome": "phrase answered"
      },
      "source": "fixtures/session-notes.md#action"
    },
    {
      "id": "receipt-state",
      "kind": "trace",
      "lineId": "consequence:1",
      "gitSha": "synthetic-rhythm-source",
      "liveSha": "synthetic-rhythm-build",
      "scope": "rhythm-phrase-window-b",
      "context": {
        "cohort": "first phrase",
        "window": "optional phrase offered before practice closes",
        "action": "tap a response",
        "outcome": "phrase answered"
      },
      "source": "fixtures/session-notes.md#state"
    },
    {
      "id": "receipt-feedback",
      "kind": "capture",
      "lineId": "consequence:2",
      "gitSha": "synthetic-rhythm-source",
      "liveSha": "synthetic-rhythm-build",
      "scope": "rhythm-phrase-window-b",
      "context": {
        "cohort": "first phrase",
        "window": "optional phrase offered before practice closes",
        "action": "tap a response",
        "outcome": "phrase answered"
      },
      "source": "fixtures/session-notes.md#feedback"
    },
    {
      "id": "receipt-beat",
      "kind": "trace",
      "lineId": "pacing:1",
      "gitSha": "synthetic-rhythm-source",
      "liveSha": "synthetic-rhythm-build",
      "scope": "rhythm-phrase-window-b",
      "context": {
        "cohort": "first phrase",
        "window": "optional phrase offered before practice closes",
        "action": "tap a response",
        "outcome": "phrase answered"
      },
      "source": "fixtures/session-notes.md#beat"
    },
    {
      "id": "receipt-recovery",
      "kind": "trace",
      "lineId": "pacing:2",
      "gitSha": "synthetic-rhythm-source",
      "liveSha": "synthetic-rhythm-build",
      "scope": "rhythm-phrase-window-b",
      "context": {
        "cohort": "first phrase",
        "window": "optional phrase offered before practice closes",
        "action": "tap a response",
        "outcome": "phrase answered"
      },
      "source": "fixtures/session-notes.md#recovery"
    },
    {
      "id": "receipt-choice",
      "kind": "trace",
      "lineId": "agency:1",
      "gitSha": "synthetic-rhythm-source",
      "liveSha": "synthetic-rhythm-build",
      "scope": "rhythm-phrase-window-b",
      "context": {
        "cohort": "first phrase",
        "window": "optional phrase offered before practice closes",
        "action": "tap a response",
        "outcome": "phrase answered"
      },
      "source": "fixtures/session-notes.md#choice"
    },
    {
      "id": "receipt-exit",
      "kind": "capture",
      "lineId": "agency:2",
      "gitSha": "synthetic-rhythm-source",
      "liveSha": "synthetic-rhythm-build",
      "scope": "rhythm-phrase-window-b",
      "context": {
        "cohort": "first phrase",
        "window": "optional phrase offered before practice closes",
        "action": "tap a response",
        "outcome": "phrase answered"
      },
      "source": "fixtures/session-notes.md#exit"
    },
    {
      "id": "receipt-reason",
      "kind": "capture",
      "lineId": "replay:1",
      "gitSha": "synthetic-rhythm-source",
      "liveSha": "synthetic-rhythm-build",
      "scope": "rhythm-phrase-window-b",
      "context": {
        "cohort": "first phrase",
        "window": "optional phrase offered before practice closes",
        "action": "tap a response",
        "outcome": "phrase answered"
      },
      "source": "fixtures/session-notes.md#reason"
    },
    {
      "id": "receipt-return",
      "kind": "trace",
      "lineId": "replay:2",
      "gitSha": "synthetic-rhythm-source",
      "liveSha": "synthetic-rhythm-build",
      "scope": "rhythm-phrase-window-b",
      "context": {
        "cohort": "first phrase",
        "window": "optional phrase offered before practice closes",
        "action": "tap a response",
        "outcome": "phrase answered"
      },
      "source": "fixtures/session-notes.md#return"
    }
  ],
  "metrics": {
    "goal": {
      "artifact": "receipt-goal",
      "samples": [
        {
          "caseId": "phrase-goal",
          "expected": "answer phrase",
          "readback": "answer phrase"
        },
        {
          "caseId": "phrase-goal-x2",
          "expected": "answer phrase",
          "readback": "answer phrase"
        },
        {
          "caseId": "phrase-goal-x3",
          "expected": "answer phrase",
          "readback": "answer phrase"
        }
      ]
    },
    "action": {
      "artifact": "receipt-action",
      "samples": [
        {
          "caseId": "phrase-action",
          "startS": 2,
          "actionS": 3
        },
        {
          "caseId": "phrase-action-x2",
          "startS": 2,
          "actionS": 3
        },
        {
          "caseId": "phrase-action-x3",
          "startS": 2,
          "actionS": 3
        }
      ]
    },
    "state": {
      "artifact": "receipt-state",
      "samples": [
        {
          "caseId": "phrase-state",
          "expected": "answered",
          "actual": "answered"
        },
        {
          "caseId": "phrase-state-x2",
          "expected": "answered",
          "actual": "answered"
        },
        {
          "caseId": "phrase-state-x3",
          "expected": "answered",
          "actual": "answered"
        }
      ]
    },
    "feedback": {
      "artifact": "receipt-feedback",
      "samples": [
        {
          "caseId": "phrase-feedback",
          "expected": "phrase echoed",
          "readback": "phrase echoed"
        },
        {
          "caseId": "phrase-feedback-x2",
          "expected": "phrase echoed",
          "readback": "phrase echoed"
        },
        {
          "caseId": "phrase-feedback-x3",
          "expected": "phrase echoed",
          "readback": "phrase echoed"
        }
      ]
    },
    "beat": {
      "artifact": "receipt-beat",
      "samples": [
        {
          "caseId": "phrase-beat",
          "resolvedS": 3,
          "choiceS": 5
        },
        {
          "caseId": "phrase-beat-x2",
          "resolvedS": 3,
          "choiceS": 5
        },
        {
          "caseId": "phrase-beat-x3",
          "resolvedS": 3,
          "choiceS": 5
        }
      ]
    },
    "recovery": {
      "artifact": "receipt-recovery",
      "samples": [
        {
          "caseId": "phrase-recovery",
          "setbackS": 5,
          "controlS": 8
        },
        {
          "caseId": "phrase-recovery-x2",
          "setbackS": 5,
          "controlS": 8
        },
        {
          "caseId": "phrase-recovery-x3",
          "setbackS": 5,
          "controlS": 8
        }
      ]
    },
    "choice": {
      "artifact": "receipt-choice",
      "samples": [
        {
          "caseId": "phrase-choice",
          "expected": "alternate echo",
          "actual": "alternate echo"
        },
        {
          "caseId": "phrase-choice-x2",
          "expected": "alternate echo",
          "actual": "alternate echo"
        },
        {
          "caseId": "phrase-choice-x3",
          "expected": "alternate echo",
          "actual": "alternate echo"
        }
      ]
    },
    "exit": {
      "artifact": "receipt-exit",
      "samples": [
        {
          "caseId": "phrase-exit",
          "honored": true
        },
        {
          "caseId": "phrase-exit-x2",
          "honored": true
        },
        {
          "caseId": "phrase-exit-x3",
          "honored": true
        }
      ]
    },
    "reason": {
      "artifact": "receipt-reason",
      "samples": [
        {
          "caseId": "phrase-reason",
          "intrinsic": true
        },
        {
          "caseId": "phrase-reason-x2",
          "intrinsic": true
        },
        {
          "caseId": "phrase-reason-x3",
          "intrinsic": true
        }
      ]
    },
    "return": {
      "artifact": "receipt-return",
      "samples": [
        {
          "caseId": "offer-a",
          "offerRef": "offer-a",
          "cohort": "first phrase",
          "window": "optional phrase offered before practice closes",
          "windowClosed": true,
          "returned": true
        },
        {
          "caseId": "offer-b",
          "offerRef": "offer-b",
          "cohort": "first phrase",
          "window": "optional phrase offered before practice closes",
          "windowClosed": true,
          "returned": true
        },
        {
          "caseId": "offer-c",
          "offerRef": "offer-c",
          "cohort": "first phrase",
          "window": "optional phrase offered before practice closes",
          "windowClosed": true,
          "returned": true
        },
        {
          "caseId": "offer-d",
          "offerRef": "offer-d",
          "cohort": "first phrase",
          "window": "optional phrase offered before practice closes",
          "windowClosed": true,
          "returned": false
        }
      ]
    }
  }
}
```
<!-- end embed -->
