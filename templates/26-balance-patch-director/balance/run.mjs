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
