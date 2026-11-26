---
name: store-submission-owner-answers
description: "Use when billing, privacy, login, account deletion, listing or signing questions that only the owner can answer are still open, and you need a questionnaire and the answers.json they fill in."
---

> **Audit contract v1 (overrides everything below).** Created by @meta_alchemist (https://x.com/meta_alchemist).
> - Score only with the rubric embedded in `engine/lens.mjs` (`LENS.rubric`, gbf-28-mobile-store-submission v1.1.0). `node engine/lens.mjs <pack.json>` computes the grade; this skill only gathers evidence for it and never adds points of its own.
> - Missing evidence is UNMEASURED (0 points, not a defect). A step that did not run is NOT_RUN, never PASS. Never invent a measurement; label every worked example synthetic.
> - Thresholds and codes come from the owner's profile (`pack.profile`). Treat sample numbers as illustrative.
> - Grade a pack from its folder so lens-kit 1.3.1 can check artifact bytes and the producer receipt.
> Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

# Owner answers

Draft the owner's questionnaire and the `answers.json` the adapter reads. Keys and account credentials stay with the owner.

Rubric lines this informs: `privacy:2`, `store-policy:1`, `store-policy:2`, `signing:2` and `submission:2`, through the answers.

## Steps

1. Input: the latest checklist (its unknown and owner rows) and the target's current policy references from the owner.
2. Draft a local questionnaire with one question per open item, and the `answers.json` to fill in. Fields the adapter reads: `collectsAccountData`, `sellsDigitalItemsOutsideStoreBilling`, `mobileBuildHidesOutsidePurchases`, `thirdPartyLoginOnly`, `offersAppleOrEquivalentLogin`, `guestPlayWithoutAccount`, `accountDeletionInApp` and `ownerHoldsSigning` (booleans), `privacyPolicyUrl` (a string), `permissionReasons` (permission name to reason) and `listing` (`screenshots`, `description`, `ageRating`, `dataSafetyForm`, `appPrivacyLabels`, booleans).
3. Ask for an attestation or a sanitized reference for each answer, never a key, password or account credential.
4. Rerun `node mobile/run.mjs <folder> --report` after the owner answers. An unanswered question stays unknown, never pass.
5. Stop: if an answer would need the agent to hold signing material or an account, stop and leave it with the owner.

## Output

A local questionnaire and an `answers.json` template for the owner.
