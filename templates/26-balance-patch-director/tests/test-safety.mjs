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
