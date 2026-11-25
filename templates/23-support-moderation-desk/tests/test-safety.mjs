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
