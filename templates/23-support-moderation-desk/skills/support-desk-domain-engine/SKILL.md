---
name: support-desk-domain-engine
description: "Use when the domain tools are not on disk yet (a recipe-only install) or their safety tests need rerunning: write the bundled files at their paths and run the tests."
---

# Run the local Community Support and Moderation Desk tools

Save the bundled files below at their relative paths, next to the files from the lens-engine skill. Then run from the template folder:

```sh
node tests/run-all.mjs
node tests/test-safety.mjs
```

`support/drafts.mjs` exports `draft`, `revision` and `digest` (see README.md, Domain tools). It has no command line; the evidence skills show one-line calls.

Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it.

Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

Created by @meta_alchemist (https://x.com/meta_alchemist).

## Bundled files

### support/drafts.mjs

```
// Created by @meta_alchemist (https://x.com/meta_alchemist).
// Local support drafts. A case carries an opaque reference and an enumerated topic.
import { createHash } from "node:crypto";

const messages = Object.freeze({
  support: "Please describe the affected feature and the build you used. Leave out personal information.",
  purchase: "A reviewer can check the purchase using the receipt reference in the private support system.",
  moderation: "Review the reported conduct against the community rules and record the relevant rule.",
  safety: "Prioritize human review and use the safety procedure configured for this community.",
});

// Approved KB snippets must also be suitable for reuse in a public-facing draft.
function sensitive(text) {
  return /0x[0-9a-f]{40}|\b\d{17,20}\b|https?:\/\/|[\w.+-]+@[\w.-]+\.\w+|\b(?:password|private key|seed phrase|api key)\b/i.test(text);
}
export function revision(entry) {
  if (!entry || ![entry.question, entry.answer, entry.source].every(value => typeof value === "string" && value.trim())) return null;
  if ([entry.question,entry.answer,entry.source].some(sensitive)) return null;
  return createHash("sha256").update(JSON.stringify([entry.question, entry.answer, entry.source])).digest("hex");
}

export function draft({ caseRef, topic }, entry, approvedRevisions = [], { paused = false } = {}) {
  if (paused) return null;
  if (!/^case-[a-z0-9]{1,12}$/.test(caseRef) || !Object.hasOwn(messages, topic)) throw new Error("Invalid case reference or topic");
  const key = revision(entry);
  const approved = topic === "support" && key && approvedRevisions.includes(key);
  return Object.freeze({
    status: "LOCAL_DRAFT", caseRef, topic, needsHuman: true,
    text: approved ? entry.answer : messages[topic], knowledgeRevision: approved ? key : null,
  });
}

export function digest(drafts) {
  const counts = {};
  for (const item of drafts) {
    if (item?.status === "LOCAL_DRAFT" && Object.hasOwn(messages, item.topic)) counts[item.topic] = (counts[item.topic] || 0) + 1;
  }
  return { status: "LOCAL_DRAFT", counts };
}
```

### tests/test-safety.mjs

```
// Created by @meta_alchemist (https://x.com/meta_alchemist).
import assert from "node:assert/strict";
import * as support from "../support/drafts.mjs";
const {draft, digest, revision} = support;
const item = {question: "How do I change text size?", answer: "Open the display settings and choose a text size.", source: "local-guide"};
const approved = [revision(item)];
const input = {caseRef: "case-a", topic: "support", rawMessage: "private fixture text", role: "owner", destination: "ignored"};
assert.deepEqual(Object.keys(support).sort(), ["digest","draft","revision"]);
for (const topic of ["support","purchase","moderation","safety"]) {
  const result = draft({...input, topic}, item, approved);
  assert.equal(result.status, "LOCAL_DRAFT");
  assert.equal(result.needsHuman, true);
  assert.ok(Object.isFrozen(result));
  assert.ok(!JSON.stringify(result).includes(input.rawMessage));
  assert.equal(result.text === item.answer, topic === "support");
}
assert.equal(draft(input, item, approved, {paused: true}), null);
for (const field of ["answer","source","question"]) assert.equal(draft(input, {...item, [field]: "edited"}, approved).knowledgeRevision, null);
assert.equal(draft(input, {...item, source: "revised"}, approved).knowledgeRevision, null);
assert.equal(draft(input, item).knowledgeRevision, null);
for (const sample of ["0x"+"a".repeat(40), "2".repeat(18), "my private key", "https://example.org"]) {
  const suspect = {...item,answer:sample};
  assert.equal(revision(suspect),null);
  assert.ok(!draft(input,suspect,[null]).text.includes(sample));
}
assert.throws(() => draft({...input, caseRef: "private data"}, item));
for (const topic of ["send","ban","ticket","timeout","__proto__"]) assert.throws(() => draft({...input, topic}, item));
assert.deepEqual(digest([draft(input,item),draft(input,item)]), {status:"LOCAL_DRAFT", counts:{support:2}});
console.log(JSON.stringify({status:"PASS",suite:"local drafts, privacy, KB approval and pause"}));
```
