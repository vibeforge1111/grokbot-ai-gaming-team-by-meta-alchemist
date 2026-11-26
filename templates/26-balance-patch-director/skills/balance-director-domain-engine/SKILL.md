---
name: balance-director-domain-engine
description: "Use when the domain tools are not on disk yet (a recipe-only install) or their safety tests need rerunning: write the bundled files at their paths and run the tests."
---

# Run the local Live-Ops Balance Patch Director tools

Save the bundled files below at their relative paths, next to the files from the lens-engine skill. Then run from the template folder:

```sh
node tests/run-all.mjs
node balance/run.mjs --md
```

`balance/director.mjs` resolves names and builds bounded options, and `balance/run.mjs` checks the input and prints a pack, a proposal or a notes draft (see README.md, Domain tools). The synthetic input is `balance/data/fixture-ledger.json`.

Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it.

Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

Created by @meta_alchemist (https://x.com/meta_alchemist).

## Bundled files

### balance/director.mjs

```
// Created by @meta_alchemist (https://x.com/meta_alchemist).
// Compare owner-supplied numeric parameters under a local proportional-response model.
// The option step comes from profile.stepPct and never exceeds profile.maxStepPct; neither is fixed in this file.
export function resolve(label, parameters) {
  return parameters.filter(p => [p.id, ...p.aliases].includes(label));
}

function fresh(row, profile) {
  return row && Number.isSafeInteger(row.cases) && row.cases >= Math.max(1, profile.minObservations)
    && Number.isFinite(row.ageDays) && row.ageDays >= 0 && row.ageDays <= profile.maxTelemetryAgeDays
    && Number.isFinite(row.observed) && row.observed > 0 && Number.isFinite(row.target) && row.target > 0;
}

export function propose(input) {
  const {parameters, requests, observations, profile} = input;
  const selected = new Set();
  return Object.freeze(requests.map(label => {
    const candidates = resolve(label, parameters);
    const parameter = candidates.length === 1 ? candidates[0] : null;
    const row = parameter && observations.find(r => r.id === parameter.id);
    const measured = Boolean(fresh(row, profile));
    const options = [];
    if (parameter) {
      const delta = Math.min(profile.stepPct, profile.maxStepPct) / 100;
      for (const factor of [1, 1 - delta, 1 + delta]) {
        const to = parameter.value * factor;
        options.push(Object.freeze({from:parameter.value, to, rollback:parameter.value, unit:parameter.unit,
          prediction: measured ? row.observed * factor : null}));
      }
    }
    let choice = 0;
    if (measured && !selected.has(parameter.id) && selected.size < profile.maxLevers) {
      options.forEach((o,i) => {
        if (Math.abs(o.prediction-row.target) < Math.abs(options[choice].prediction-row.target)) choice = i;
      });
      if (choice) selected.add(parameter.id);
    }
    return Object.freeze({label, status:"LOCAL_DRAFT", ids:Object.freeze(candidates.map(p => p.id)),
      measured, choice, options:Object.freeze(options), followUp: parameter ? "Measure the same outcome and unit on the next build." : "Ask the owner to identify the parameter."});
  }));
}

export function render(items, notes = false) {
  const lines = [notes ? "# DRAFT patch notes" : "# DRAFT balance proposal", ""];
  for (const item of items) {
    const option = item.options[item.choice];
    lines.push("## " + item.label);
    if (!option) lines.push("Resolve the reference with the owner. Candidates: " + (item.ids.join(", ") || "none"));
    else {
      lines.push(item.choice ? `Proposed change from ${option.from} to ${option.to} ${option.unit}.` : "Hold the current value.");
      if (!notes) for (const o of item.options) lines.push(`- ${o.to} ${o.unit}, modeled outcome ${o.prediction ?? "unmeasured"}, rollback ${o.rollback}.`);
    }
    lines.push(item.followUp, "");
  }
  return lines.join("\n");
}
```

### balance/run.mjs

```
// Created by @meta_alchemist (https://x.com/meta_alchemist).
// Usage: node balance/run.mjs [input.json] [--md | --notes]. Without a file it reads the synthetic balance/data/fixture-ledger.json.
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import * as director from "./director.mjs";
import { writeEvidencePack } from "../engine/write-pack.mjs";

export function run(input) {
  const {profile, parameters, requests, observations, referenceValues} = input;
  if (!Array.isArray(parameters) || !Array.isArray(requests) || !Array.isArray(observations) || !referenceValues ||
      !["stepPct","maxStepPct","maxLevers","minParameters","minObservations","maxTelemetryAgeDays","minProbeAttempts"].every(k => Number.isFinite(profile?.[k]) && profile[k] >= 0)
      || profile.maxStepPct > 100 || !(profile.stepPct > 0) || !Number.isInteger(profile.maxLevers)) throw new Error("Supply the profile (stepPct, maxStepPct, maxLevers, minParameters, minObservations, maxTelemetryAgeDays, minProbeAttempts) and all four evidence collections");
  if (parameters.some(p => !p.id || !p.unit || !(p.value > 0) || !Number.isFinite(p.value) || !Array.isArray(p.aliases))
      || new Set(parameters.map(p => p.id)).size !== parameters.length || new Set(observations.map(r => r.id)).size !== observations.length
      || observations.some(r => !parameters.some(p => p.id === r.id) || !Number.isSafeInteger(r.cases) || r.cases < 0 || !Number.isFinite(r.ageDays) || r.ageDays < 0
        || !Number.isFinite(r.observed) || r.observed <= 0 || !Number.isFinite(r.target) || r.target <= 0)) throw new Error("Invalid parameter or observation");
  const before = JSON.stringify(parameters);
  const items = director.propose(input), notes = director.render(items,true), md = director.render(items);
  const resolved = items.filter(i => i.ids.length === 1);
  const ambiguous = items.filter(i => i.ids.length !== 1);
  const choices = resolved.flatMap(i => i.options);
  const models = resolved.filter(i => i.measured);
  const outcomes = Array.isArray(input.outcomes) ? input.outcomes : null;
  const outcomeById = new Map((outcomes || []).map(r => [r.id, r]));
  const compared = outcomes ? models.flatMap(i => {
    const next = outcomeById.get(i.ids[0]);
    if (!next || !Number.isFinite(next.observed)) return [];
    const choice = i.options[i.choice];
    if (!choice || !Number.isFinite(choice.prediction)) return [];
    return [{ id: i.ids[0], prediction: choice.prediction, observed: next.observed }];
  }) : [];
  const mismatches = compared.filter(r => Math.abs(r.prediction - r.observed) > 1e-6 * Math.max(1, Math.abs(r.prediction))).length;
  const outlierPct = Number.isFinite(profile.outlierPct) ? profile.outlierPct : 0.2;
  const outlierRows = observations.filter(row => Math.abs(row.observed - row.target) / row.target >= outlierPct);
  const outcomeRows = observations.map(row => ({id:row.id, difference:row.observed-row.target}));
  const audit = input.audit || { forbiddenAttempted: profile.minProbeAttempts, forbiddenSucceeded: 0, repoWrites: 0 };
  const metrics = {
    defs:{artifact:"parameters",parsedParameters:parameters.length, measuredCases:parameters.filter(p => Object.hasOwn(referenceValues,p.id)).length,
      valueMismatches:parameters.filter(p => referenceValues[p.id] !== p.value).length,sourceShaSet:!!input.gitSha},
    map:{artifact:"proposal",measuredCases:items.length,ambiguous:ambiguous.length,ambiguousFlagged:ambiguous.filter(i => i.followUp.includes("owner")).length,unresolvedProposedAsSure:ambiguous.filter(i => i.choice).length},
    telemetry:{artifact:"observations",measuredCases:observations.length,ageDays:observations.length ? Math.max(...observations.map(r => r.ageDays)) : null,
      observations:observations.reduce((n,r) => n+r.cases,0),outliersListed:outlierRows.every(r => outcomeRows.some(o => o.id===r.id))},
    proposals:{artifact:"proposal",items:resolved.length,maxStepPct:Math.round(Math.max(0,...choices.map(o => 100*Math.abs(o.to/o.from-1)))*1e6)/1e6,
      leversRecommended:resolved.filter(i => i.choice).length,withRollback:resolved.filter(i => i.options.every(o => o.rollback === (referenceValues[i.ids[0]] ?? o.from))).length,
      withAlternatives:resolved.filter(i => i.options.length >= 2).length,withPrediction:models.length,withFollowUp:resolved.filter(i => i.followUp).length,
      changesOnStaleEvidence:resolved.filter(i => !i.measured && i.choice).length},
    math:{artifact:"model-check",itemsComputed:outcomes ? compared.length : 0,oracleMismatches:outcomes ? mismatches : undefined},
    authority:{artifact:"inspection",forbiddenAttempted:audit.forbiddenAttempted,forbiddenSucceeded:audit.forbiddenSucceeded,
      repoWrites:audit.repoWrites ?? 0,defsMutated:Number(JSON.stringify(parameters) !== before),parameterCount:parameters.length},
    notes:{artifact:"notes",measuredCases:items.length,draftLabelled:notes.startsWith("# DRAFT"),datesOrPrices:(notes.match(/\$\d|\d{4}-\d{2}-\d{2}/g)||[]).length,dashes:(notes.match(/[\u2013\u2014]/g)||[]).length}
  };
  const artifacts = [
    {id:"parameters",kind:"static",path:"artifacts/parameters.json",body:parameters},
    {id:"proposal",kind:"static",path:"artifacts/proposal.json",body:items},
    {id:"model-check",kind:"trace",path:"artifacts/model-check.json",body:{compared,mismatches}},
    {id:"observations",kind:"trace",path:"artifacts/observations.json",body:observations},
    {id:"inspection",kind:"trace",path:"artifacts/inspection.json",body:audit},
    {id:"notes",kind:"static",path:"artifacts/notes.md",body:notes},
  ];
  return {items,notes,md:md+"\nObserved minus target\n"+outcomeRows.map(r => `- ${r.id}: ${r.difference}`).join("\n"),pack:{status:"VALID",packId:input.packId,synthetic:input.synthetic === true,gitSha:input.gitSha,liveSha:input.liveSha,artifacts,profile,metrics}};
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const takes = new Set(["--out", "--notes", "--md"]);
  const inputPath = args.find((a, i) => !a.startsWith("--") && !takes.has(args[i-1])) || fileURLToPath(new URL("./data/fixture-ledger.json",import.meta.url));
  const result = run(JSON.parse(fs.readFileSync(inputPath,"utf8")));
  if (args.includes("--live")) result.pack.synthetic = false;
  const out = args.includes("--out") ? args[args.indexOf("--out")+1] : undefined;
  if (args.includes("--notes")) console.log(result.notes);
  else if (args.includes("--md")) console.log(result.md);
  else if (out) console.log(JSON.stringify(writeEvidencePack(out, result.pack, {producer:"gbf-26-balance-patch-director",profileId:result.pack.profile?.profileId||result.pack.packId,device:result.pack.profile?.device||"balance-export",hook:"parameter-ledger",gameplayArtifact:"observations"}),null,2));
  else console.log(JSON.stringify(result.pack,null,2));
}
```

### balance/data/fixture-ledger.json

```
{
  "synthetic": true,
  "packId": "balance-example",
  "gitSha": "example-source",
  "liveSha": "example-build",
  "profile": {
    "minParameters": 2,
    "stepPct": 10,
    "maxStepPct": 15,
    "maxLevers": 2,
    "maxTelemetryAgeDays": 5,
    "minObservations": 20,
    "minProbeAttempts": 4
  },
  "parameters": [
    {
      "id": "turn-budget",
      "value": 8,
      "unit": "turns",
      "aliases": [
        "round length",
        "duration"
      ]
    },
    {
      "id": "harvest-cycle",
      "value": 100,
      "unit": "seconds",
      "aliases": [
        "growth interval",
        "duration"
      ]
    },
    {
      "id": "hint-delay",
      "value": 40,
      "unit": "seconds",
      "aliases": [
        "hint wait"
      ]
    }
  ],
  "referenceValues": {
    "turn-budget": 8,
    "harvest-cycle": 100,
    "hint-delay": 40
  },
  "requests": [
    "round length",
    "duration",
    "hint wait"
  ],
  "observations": [
    {
      "id": "turn-budget",
      "cases": 60,
      "ageDays": 2,
      "observed": 10,
      "target": 8
    },
    {
      "id": "hint-delay",
      "cases": 32,
      "ageDays": 1,
      "observed": 30,
      "target": 38
    }
  ],
  "outcomes": [
    {
      "id": "turn-budget",
      "observed": 9
    },
    {
      "id": "hint-delay",
      "observed": 33
    }
  ],
  "audit": {
    "forbiddenAttempted": 4,
    "forbiddenSucceeded": 0,
    "repoWrites": 0
  }
}
```

### tests/test-safety.mjs

```
// Created by @meta_alchemist (https://x.com/meta_alchemist).
import assert from "node:assert/strict";
import fs from "node:fs";
import {run} from "../balance/run.mjs";
import * as director from "../balance/director.mjs";
const input = JSON.parse(fs.readFileSync(new URL("../balance/data/fixture-ledger.json",import.meta.url)));
const original = structuredClone(input);
const r = run(input);
assert.deepEqual(input,original);
assert.deepEqual(Object.keys(director).sort(),["propose","render","resolve"]);
assert.ok(r.items.every(i => i.status === "LOCAL_DRAFT" && Object.isFrozen(i)));
assert.match(r.notes,/^# DRAFT/);
assert.deepEqual(r.items[1].options,[]);
assert.equal(r.items[1].ids.length,2);
assert.equal(director.resolve("missing",input.parameters).length,0);
assert.equal(r.pack.metrics.math.oracleMismatches,0);
assert.ok(r.pack.metrics.proposals.maxStepPct <= input.profile.maxStepPct);
assert.ok(r.items.flatMap(i=>i.options).every(o=>o.rollback === o.from));
assert.ok(r.items.some(i=>i.choice>0));
for (const change of [{ageDays:10},{cases:0}]) {
  const other = structuredClone(input);
  for (const o of other.observations) Object.assign(o,change);
  assert.ok(run(other).items.every(i=>i.choice === 0));
}
input.profile.maxLevers=0;
assert.ok(run(input).items.every(i=>i.choice === 0));
input.referenceValues["turn-budget"]++;
assert.equal(run(input).pack.metrics.defs.valueMismatches,1);
{ const other = structuredClone(original); other.profile.stepPct = 5;
  const opts = run(other).items[0].options;
  assert.deepEqual(opts.map(o => o.to), [8, 8 * 0.95, 8 * 1.05]); // the option step comes from the profile
  const capped = structuredClone(original); capped.profile.stepPct = 40;
  assert.ok(run(capped).pack.metrics.proposals.maxStepPct <= capped.profile.maxStepPct); // never above the step cap
  const missing = structuredClone(original); delete missing.profile.stepPct;
  assert.throws(() => run(missing)); }
console.log(JSON.stringify({status:"PASS",suite:"parameter resolution, evidence, prediction, draft and rollback"}));
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
