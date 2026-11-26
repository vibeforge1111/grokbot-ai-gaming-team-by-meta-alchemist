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

### support/build-pack.mjs

```
// Created by @meta_alchemist (https://x.com/meta_alchemist).
// Build a support-desk evidence pack from a redacted local intake folder.
// Usage: node support/build-pack.mjs <intake-dir> [--out <dir>] [--synthetic]
// Intake files (JSON): inventory.json, redteam.json, actions.json, kb.json,
// cases.json, observations.json, privacy.json. All changes stay local.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { draft, digest, revision } from "./drafts.mjs";
import { writeEvidencePack } from "../engine/write-pack.mjs";

function readJson(dir, name) {
  const p = path.join(dir, name);
  if (!fs.existsSync(p)) throw new Error("Missing intake file " + name);
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

export function metricsFromIntake(intake) {
  const inventory = intake.inventory || {};
  const tools = inventory.tools || [];
  const unknown = inventory.unknownAttempts || [];
  const redteam = intake.redteam || {};
  const cases = redteam.cases || [];
  const actions = intake.actions || {};
  const probes = actions.probes || [];
  const kb = intake.kb || {};
  const entries = kb.entries || [];
  const approved = entries.filter((e) => e.approved === true);
  const casesFile = intake.cases || {};
  const rows = casesFile.cases || [];
  const obs = intake.observations || {};
  const privacy = intake.privacy || {};
  const drafts = (casesFile.drafts || []).filter(Boolean);
  return {
    tools: {
      artifact: "tool-inventory",
      privilegedExposed: tools.filter((t) => t.privileged && t.exposed).length,
      unknownAttempted: unknown.length,
      unknownDenied: unknown.filter((a) => a.denied === true).length,
    },
    redteam: {
      artifact: "redteam-cases",
      cases: cases.length,
      failed: cases.filter((c) => c.passed !== true).length,
      categories: [...new Set(cases.map((c) => c.category).filter(Boolean))],
    },
    mod: {
      artifact: "action-probe",
      measuredCases: probes.length,
      liveActions: probes.filter((p) => p.live === true).length,
      protectedActions: probes.filter((p) => p.protected === true && p.executed === true).length,
      unknownActionsDenied: probes.length ? probes.filter((p) => p.unknown === true).every((p) => p.denied === true) : false,
      localPauseHolds: probes.length ? probes.every((p) => p.pauseHolds !== false) : false,
    },
    kb: {
      artifact: "kb-file",
      entries: entries.length,
      approved: approved.length,
      approvedShare: entries.length ? approved.length / entries.length : 0,
      entriesGuardPass: entries.filter((e) => revision(e)).length,
      purchaseRepliesWithoutReview: entries.filter((e) => e.topic === "purchase" && e.approved !== true && e.usedInDraft === true).length,
      editResetsApproval: kb.editResetsApproval === true,
      artifactsByLine: { "answers:2": "kb-revision-test" },
    },
    cases: {
      artifact: "case-trace",
      measuredCases: rows.length,
      draftsWithRef: rows.filter((c) => c.drafted === true && /^case-[a-z0-9]{1,12}$/.test(c.ref || c.caseRef || "")).length,
      outboundCalls: rows.reduce((n, c) => n + (Number(c.outboundCalls) || 0), 0),
    },
    privacy: {
      artifact: "action-probe",
      identifierEchoBlocked: privacy.identifierEchoBlocked === true,
      secretAskBlocked: privacy.secretAskBlocked === true,
      directContactFirstAllowed: privacy.directContactFirstAllowed === true,
      exportHasIdentifiers: privacy.exportHasIdentifiers === true,
      retentionDaysSet: Number.isFinite(privacy.retentionDays) && privacy.retentionDays > 0,
      measuredCases: Number(privacy.measuredCases) || [privacy.identifierEchoBlocked, privacy.secretAskBlocked, privacy.exportHasIdentifiers].filter((v) => typeof v === "boolean").length,
      artifactsByLine: { "privacy:2": "retention-profile" },
    },
    live: {
      artifact: "observation-log",
      observationDays: Number(obs.observationDays) || 0,
      firstResponseP50Min: obs.firstResponseP50Min,
      casesWithDraftShare: rows.length ? rows.filter((c) => c.drafted === true).length / rows.length : 0,
      sampleCases: Number(obs.sampleCases) || rows.length,
    },
    draftDigest: digest(drafts),
  };
}

export function buildPack(intakeDir, options = {}) {
  const inventory = readJson(intakeDir, "inventory.json");
  const redteam = readJson(intakeDir, "redteam.json");
  const actions = readJson(intakeDir, "actions.json");
  const kb = readJson(intakeDir, "kb.json");
  const cases = readJson(intakeDir, "cases.json");
  const observations = readJson(intakeDir, "observations.json");
  const privacy = readJson(intakeDir, "privacy.json");
  const profile = options.profile || JSON.parse(fs.readFileSync(path.join(intakeDir, "profile.json"), "utf8"));
  const metrics = metricsFromIntake({ inventory, redteam, actions, kb, cases, observations, privacy });
  const pack = {
    packId: options.packId || inventory.packId || "support-intake",
    status: "VALID",
    synthetic: options.synthetic === true,
    gitSha: options.gitSha || inventory.gitSha,
    liveSha: options.liveSha || inventory.liveSha,
    profile,
    artifacts: [
      { id: "tool-inventory", kind: "static", path: "artifacts/tool-inventory.json", body: inventory },
      { id: "redteam-cases", kind: "trace", path: "artifacts/redteam-cases.json", body: redteam },
      { id: "action-probe", kind: "trace", path: "artifacts/action-probe.json", body: actions },
      { id: "kb-file", kind: "static", path: "artifacts/kb-file.json", body: kb },
      { id: "observation-log", kind: "trace", path: "artifacts/observation-log.json", body: observations },
      { id: "case-trace", kind: "trace", path: "artifacts/case-trace.json", body: cases },
      { id: "kb-revision-test", kind: "trace", path: "artifacts/kb-revision-test.json", body: kb.revisionTests || kb },
      { id: "retention-profile", kind: "static", path: "artifacts/retention-profile.json", body: { retentionDays: privacy.retentionDays } },
    ],
    metrics,
  };
  delete metrics.draftDigest;
  return pack;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const takes = new Set(["--out", "--pack-id", "--git-sha", "--live-sha"]);
  const intake = args.find((a, i) => !a.startsWith("--") && !takes.has(args[i-1]));
  if (!intake) {
    console.error("usage: node support/build-pack.mjs <intake-dir> [--out <dir>] [--synthetic] [--pack-id <id>] [--git-sha <sha>] [--live-sha <sha>]");
    process.exit(2);
  }
  const value = (k) => (args.includes(k) ? args[args.indexOf(k) + 1] : undefined);
  const pack = buildPack(intake, {
    synthetic: args.includes("--synthetic"),
    packId: value("--pack-id"),
    gitSha: value("--git-sha"),
    liveSha: value("--live-sha"),
  });
  const out = value("--out");
  if (out) {
    const written = writeEvidencePack(out, pack, {
      producer: "gbf-23-support-moderation-desk",
      profileId: pack.profile?.profileId || pack.packId,
      device: pack.profile?.device || "support-export",
      hook: "local-intake",
      gameplayArtifact: "case-trace",
    });
    console.log(JSON.stringify(written, null, 2));
  } else {
    console.log(JSON.stringify(pack, null, 2));
  }
}
```

### engine/write-pack.mjs

```
// Write a local evidence pack with artifact files and a game-evidence-v1 producer receipt.
// Created by @meta_alchemist (https://x.com/meta_alchemist). Node 18+, no dependencies.
// The receipt shape matches shared/lens-kit/lens-kit.mjs verifyLive().
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

export function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === "object") return Object.fromEntries(Object.keys(value).sort().map((k) => [k, canonical(value[k])]));
  return value;
}

export function digest(value) {
  return crypto.createHash("sha256").update(JSON.stringify(canonical(value))).digest("hex");
}

export function hashFile(file) {
  const hash = crypto.createHash("sha256");
  const fd = fs.openSync(file, "r");
  const buffer = Buffer.alloc(65536);
  try {
    let length;
    while ((length = fs.readSync(fd, buffer, 0, buffer.length, null)) > 0) hash.update(buffer.subarray(0, length));
    return hash.digest("hex");
  } finally {
    fs.closeSync(fd);
  }
}

function writeArtifactFile(directory, artifact) {
  const rel = artifact.path || `artifacts/${artifact.id}.json`;
  if (path.isAbsolute(rel) || rel.split(/[\\/]/).includes("..")) throw new Error("artifact path must be relative and stay inside the pack folder");
  const dest = path.join(directory, rel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  if (artifact.body !== undefined) {
    const body = artifact.body;
    fs.writeFileSync(dest, Buffer.isBuffer(body) ? body : typeof body === "string" ? body : JSON.stringify(body, null, 2) + "\n");
  } else if (!fs.existsSync(dest)) {
    throw new Error(`missing artifact body and file for ${artifact.id}`);
  }
  const { body, ...rest } = artifact;
  return { ...rest, path: rel, sha256: hashFile(dest) };
}

// meta: { producer, profileId, device, hook, gameplayArtifact }
export function writeEvidencePack(directory, pack, meta) {
  if (!meta?.producer || !meta.profileId || !meta.device || !meta.hook || !meta.gameplayArtifact) {
    throw new Error("producer receipt needs producer, profileId, device, hook and gameplayArtifact");
  }
  fs.mkdirSync(directory, { recursive: true });
  const artifacts = (pack.artifacts || []).map((a) => writeArtifactFile(directory, a));
  if (!artifacts.some((a) => a.id === meta.gameplayArtifact && ["capture", "trace"].includes(a.kind))) {
    throw new Error("gameplayArtifact must be a capture or trace in the artifact list");
  }
  const profile = pack.profile || {};
  const out = {
    ...pack,
    artifacts,
    producerReceipt: {
      schema: "game-evidence-v1",
      producer: meta.producer,
      profileId: meta.profileId,
      packId: pack.packId,
      gitSha: pack.gitSha,
      liveSha: pack.liveSha,
      device: meta.device,
      hook: meta.hook,
      gameplayArtifact: meta.gameplayArtifact,
      profileSha256: digest(profile),
      artifactsSha256: digest(artifacts),
      observationsSha256: digest([pack.metrics ?? {}, pack.receipts ?? {}, pack.judgements ?? {}, pack.populations ?? {}, pack.openP0 ?? 0]),
    },
  };
  fs.writeFileSync(path.join(directory, "pack.json"), JSON.stringify(out, null, 2) + "\n");
  return out;
}
```
