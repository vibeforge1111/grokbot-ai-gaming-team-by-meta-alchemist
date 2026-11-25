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
