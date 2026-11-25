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
import * as director from "./director.mjs";

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
  const mismatches = models.flatMap(i => i.options.filter(o => {
    const row = observations.find(r => r.id === i.ids[0]);
    return Math.abs(o.prediction / row.observed - o.to / o.from) > 1e-8;
  })).length;
  const outcomeRows = observations.map(row => ({id:row.id, difference:row.observed-row.target}));
  const actions = ["applyPatch","deploy","push","publish"];
  const metrics = {
    defs:{artifact:"parameters",parsedParameters:parameters.length, measuredCases:parameters.filter(p => Object.hasOwn(referenceValues,p.id)).length,
      valueMismatches:parameters.filter(p => referenceValues[p.id] !== p.value).length,sourceShaSet:!!input.gitSha},
    map:{artifact:"proposal",measuredCases:items.length,ambiguous:ambiguous.length,ambiguousFlagged:ambiguous.filter(i => i.followUp.includes("owner")).length,unresolvedProposedAsSure:ambiguous.filter(i => i.choice).length},
    math:{artifact:"model-check",itemsComputed:models.length,oracleMismatches:mismatches},
    telemetry:{artifact:"observations",measuredCases:observations.length,ageDays:observations.length ? Math.max(...observations.map(r => r.ageDays)) : null,
      observations:observations.reduce((n,r) => n+r.cases,0),outliersListed:outcomeRows.length === observations.length},
    proposals:{artifact:"proposal",items:resolved.length,maxStepPct:Math.round(Math.max(0,...choices.map(o => 100*Math.abs(o.to/o.from-1)))*1e6)/1e6,
      leversRecommended:resolved.filter(i => i.choice).length,withRollback:resolved.filter(i => i.options.every(o => o.rollback === o.from)).length,
      withAlternatives:resolved.filter(i => i.options.length >= 2).length,withPrediction:models.length,withFollowUp:resolved.filter(i => i.followUp).length,
      changesOnStaleEvidence:resolved.filter(i => !i.measured && i.choice).length},
    authority:{artifact:"inspection",forbiddenAttempted:actions.length,forbiddenSucceeded:actions.filter(a => typeof director[a] === "function").length,
      repoWrites:(fs.readFileSync(new URL("./director.mjs",import.meta.url),"utf8").match(/\b(?:writeFile|appendFile|fetch|spawn|execSync)\s*\(/g) || []).length,defsMutated:Number(JSON.stringify(parameters) !== before),parameterCount:parameters.length},
    notes:{artifact:"notes",measuredCases:items.length,draftLabelled:notes.startsWith("# DRAFT"),datesOrPrices:(notes.match(/\$\d|\d{4}-\d{2}-\d{2}/g)||[]).length,dashes:(notes.match(/[\u2013\u2014]/g)||[]).length}
  };
  const artifacts = Object.entries({parameters:"static",proposal:"static","model-check":"trace",observations:"trace",inspection:"trace",notes:"static"}).map(([id,kind])=>({id,kind}));
  return {items,notes,md:md+"\nObserved minus target\n"+outcomeRows.map(r => `- ${r.id}: ${r.difference}`).join("\n"),pack:{status:"VALID",packId:input.packId,synthetic:input.synthetic === true,gitSha:input.gitSha,liveSha:input.liveSha,artifacts,profile,metrics}};
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const path = args.find(a => !a.startsWith("--")) || new URL("./data/fixture-ledger.json",import.meta.url);
  const result = run(JSON.parse(fs.readFileSync(path,"utf8")));
  console.log(args.includes("--notes") ? result.notes : args.includes("--md") ? result.md : JSON.stringify(result.pack,null,2));
}
```

### balance/data/fixture-ledger.json

```
{
  "synthetic": true,
  "packId": "balance-example",
  "gitSha": "example-source",
  "liveSha": "example-build",
  "profile": {"minParameters": 2, "stepPct": 10, "maxStepPct": 15, "maxLevers": 2, "maxTelemetryAgeDays": 5, "minObservations": 20, "minProbeAttempts": 4},
  "parameters": [
    {"id":"turn-budget","value":8,"unit":"turns","aliases":["round length","duration"]},
    {"id":"harvest-cycle","value":100,"unit":"seconds","aliases":["growth interval","duration"]},
    {"id":"hint-delay","value":40,"unit":"seconds","aliases":["hint wait"]}
  ],
  "referenceValues": {"turn-budget":8,"harvest-cycle":100,"hint-delay":40},
  "requests": ["round length","duration","hint wait"],
  "observations": [
    {"id":"turn-budget","cases":60,"ageDays":2,"observed":10,"target":8},
    {"id":"hint-delay","cases":32,"ageDays":1,"observed":30,"target":38}
  ]
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
