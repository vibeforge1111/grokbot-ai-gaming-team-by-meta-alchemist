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
