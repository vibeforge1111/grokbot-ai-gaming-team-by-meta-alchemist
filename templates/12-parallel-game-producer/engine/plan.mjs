// Created by @meta_alchemist (https://x.com/meta_alchemist).
// Read an approved local snapshot. Produce drafts on stdout, without side effects.
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { LENS } from "./lens.mjs";
import { grade } from "./lens-kit.mjs";

const text = value => typeof value === "string" && value.trim().length > 0;
const list = (value, field) => {
  if (!Array.isArray(value)) throw new Error(field + " must be a list");
  return value;
};
function byId(rows, field) {
  const map = new Map();
  for (const row of list(rows, field)) {
    if (!text(row?.id) || map.has(row.id)) throw new Error("Missing or duplicate ID in " + field);
    map.set(row.id, row);
  }
  return map;
}
const keyList = value => Array.isArray(value) && value.every(text) && new Set(value).size === value.length;
const current = (receipt, project) => receipt && receipt.gitSha === project.gitSha
  && receipt.liveSha === project.liveSha && receipt.scope === project.profile.scope && text(receipt.source);

function predecessorResult(receipt, project) {
  if (!current(receipt, project)) return undefined;
  if (receipt.timedOut === true) return false;
  if (receipt.expiresAtTick != null) {
    if (!Number.isFinite(project.snapshot.reviewTick) || !Number.isFinite(receipt.expiresAtTick)) return undefined;
    if (project.snapshot.reviewTick >= receipt.expiresAtTick) return undefined;
  }
  return typeof receipt.passed === "boolean" ? receipt.passed : undefined;
}

// A deliverable has acceptance evidence when its role, done condition and named proof are written down and a
// current run receipt for the same task cites that proof as its source. Blank fields or a receipt that cites
// another source are measured misses. A missing or stale receipt leaves the case unmeasured.
function acceptance(task, run, project) {
  if (![task.role, task.accept, task.proof].every(text)) return false;
  if (!current(run, project)) return undefined;
  return run.source === task.proof;
}

function resources(task) {
  if (!text(task.role) || !keyList(task.locks)) return null;
  return new Set(["role/" + task.role, ...task.locks.map(resource => "resource/" + resource)]);
}
function exclusiveConflict(left, right) {
  const a = resources(left), b = resources(right);
  // Unknown scope is exclusive. It may be scheduled alone.
  return !a || !b || [...a].some(key => b.has(key));
}
function planWaves(tasks, profile) {
  if (!tasks.size) return {waves: [], needs: new Map()};
  const {firstTask, decisionTask} = profile;
  if (firstTask === decisionTask || !tasks.has(firstTask) || !tasks.has(decisionTask)) {
    throw new Error("The profile must identify distinct capture and final decision tasks");
  }
  const needs = new Map();
  for (const task of tasks.values()) {
    if (!keyList(task.needs) || task.needs.some(id => !tasks.has(id))) throw new Error("Invalid predecessor for " + task.id);
    const ids = new Set(task.needs);
    if (task.id !== firstTask) ids.add(firstTask);
    if (task.id === decisionTask) for (const id of tasks.keys()) if (id !== decisionTask) ids.add(id);
    needs.set(task.id, [...ids]);
  }
  const waves = [], done = new Set();
  while (done.size < tasks.size) {
    const wave = [];
    for (const task of tasks.values()) {
      if (done.has(task.id) || !needs.get(task.id).every(id => done.has(id))) continue;
      if (wave.every(id => !exclusiveConflict(tasks.get(id), task))) wave.push(task.id);
    }
    if (!wave.length) throw new Error("Dependency cycle prevents scheduling: " + [...tasks.keys()].filter(id => !done.has(id)).join(", "));
    waves.push(wave);
    for (const id of wave) done.add(id);
  }
  return {waves, needs};
}

function streamEvidence(tasks, needs, runs, project) {
  const dependency = [], locks = [], capacity = new Map();
  const inspected = [...tasks.keys()].every(id => {
    const other = runs.get(id);
    return current(other, project) && Number.isSafeInteger(other.wave) && other.wave >= 0;
  });
  for (const task of tasks.values()) {
    const run = runs.get(task.id);
    const wave = current(run, project) && Number.isSafeInteger(run.wave) && run.wave >= 0 ? run.wave : null;
    for (const prior of needs.get(task.id)) {
      const previous = runs.get(prior);
      const outcome = predecessorResult(previous, project);
      const ready = wave !== null && outcome !== undefined && Number.isSafeInteger(previous.wave) && previous.wave >= 0
        ? outcome && previous.wave < wave : undefined;
      dependency.push({caseId: JSON.stringify([prior, task.id]), ready});
    }
    // Never infer an idle writer from a missing or stale run receipt.
    const collisions = wave !== null && [...tasks.values()].some(other => {
      const peer = runs.get(other.id);
      return other.id !== task.id && current(peer, project) && peer.wave === wave && exclusiveConflict(task, other);
    });
    const conflictFree = collisions ? false : inspected ? true : undefined;
    locks.push({caseId: task.id, conflictFree});
    const loadKey = JSON.stringify([task.role, wave]);
    const load = capacity.get(loadKey) || {caseId: loadKey, role: task.role, hours: 0};
    load.hours = Number.isFinite(load.hours) && Number.isFinite(task.hours) && task.hours >= 0 && wave !== null
      ? load.hours + task.hours : undefined;
    capacity.set(loadKey, load);
  }
  return {capacity: [...capacity.values()], dependency, locks};
}

function ledgerEvidence(snapshot, profile, project) {
  const tickets = byId(snapshot.tickets, "tickets");
  if (!keyList(profile.severities) || !profile.severities.includes("P0")) throw new Error("Profile severities must include P0");
  const counts = new Map(profile.severities.map(key => [key, 0]));
  const closure = [], states = [];
  let openP0 = 0;
  for (const ticket of tickets.values()) {
    if (!counts.has(ticket.severity) || !["open","closed"].includes(ticket.state)) throw new Error("Invalid ledger row " + ticket.id);
    const proof = ticket.verification;
    const live = current(proof, project) ? proof.passed : undefined;
    const independent = text(proof?.role) && text(ticket.fixRole) ? proof.role !== ticket.fixRole : undefined;
    const config = ticket.configState;
    if (ticket.state === "open") counts.set(ticket.severity, counts.get(ticket.severity) + 1);
    else {
      const checks = [text(ticket.sourceFix) ? true : undefined, live, independent,
        config === "disabled" ? false : ["verified","unneeded"].includes(config) ? true : undefined];
      const verified = checks.includes(false) ? false : checks.includes(undefined) ? undefined : true;
      closure.push({caseId: ticket.id, verified});
      if (ticket.severity === "P0" && verified !== true) openP0++;
    }
    if (ticket.state === "open" && ticket.severity === "P0") openP0++;
    states.push({id: ticket.id, state: ticket.state, sourceFix: ticket.sourceFix ?? null, liveVerified: live ?? null, configState: config ?? null});
  }
  return {states, openP0, counts: Object.fromEntries(counts), closure,
    samples: tickets.size ? [...counts].map(([key, derived]) => ({caseId: key, derived, reported: snapshot.reportedCounts?.[key]})) : []};
}

function pitchEvidence(snapshot, profile, project) {
  if (!keyList(profile.requiredTopics) || !profile.requiredTopics.length) throw new Error("Choose the required pitch topics");
  const facts = byId(snapshot.facts, "facts"), slides = byId(snapshot.slides, "slides");
  const review = snapshot.deckReview, claims = [];
  const deck = profile.requiredTopics.map(topic => {
    const slide = slides.get(topic);
    const fact = facts.get(slide?.fact);
    const grounded = fact && text(fact.text) && text(fact.source) && typeof fact.approved === "boolean"
      ? fact.approved && slide.claim === fact.text && ["observed", "proposal"].includes(fact.kind) : undefined;
    claims.push({caseId: topic, grounded});
    return {topic, headline: slide?.headline || topic, claim: grounded ? slide.claim : "[Evidence gap]",
      kind: grounded ? fact.kind : "unverified", source: grounded ? fact.source : null, note: slide?.note || "[Speaker note needed]"};
  });
  if ([...slides.keys()].some(topic => !profile.requiredTopics.includes(topic))) throw new Error("Unscoped pitch slide");
  const digest = createHash("sha256").update(JSON.stringify([profile.audience, profile.ask, deck])).digest("hex");
  const reviewRows = deck.map(slide => {
    const entry = review?.topics?.[slide.topic];
    const linked = current(review, project) && review.digest === digest && text(review.role);
    const reviewed = linked && typeof entry === "boolean"
      ? entry && slide.source !== null && text(slides.get(slide.topic)?.note) : undefined;
    return {caseId: slide.topic, reviewed};
  });
  return {deck, digest, claims, reviewRows};
}

export function prepare(project, directory) {
  const {snapshot, profile} = project;
  if (!text(project.gitSha) || !text(project.liveSha) || !text(project.packId) || !text(profile?.scope)
      || !current(snapshot, project)) throw new Error("Snapshot must match the approved build and scope and cite its source");
  const tasks = byId(snapshot.tasks, "tasks"), runs = byId(snapshot.runs, "runs");
  if ([...runs.keys()].some(id => !tasks.has(id))) throw new Error("Run receipt has no matching task");
  const {waves, needs} = planWaves(tasks, profile);
  const streams = streamEvidence(tasks, needs, runs, project);
  const ledger = ledgerEvidence(snapshot, profile, project);
  const gates = byId(snapshot.gates, "gates");
  if (!keyList(profile.requiredGates) || !profile.requiredGates.length) throw new Error("Choose the required discipline gates");
  const pitch = pitchEvidence(snapshot, profile, project);
  const samples = {
    scope: [...tasks.values()].map(t => ({caseId: t.id, testable: acceptance(t, runs.get(t.id), project)})),
    ...streams, counts: ledger.samples, closure: ledger.closure,
    gate: profile.requiredGates.map(id => ({caseId: id, passed: current(gates.get(id), project) ? gates.get(id).passed : undefined})),
    risk: [...byId(snapshot.risks, "risks").values()].map(r => ({caseId: r.id, actionable: [r.role,r.trigger,r.fallback,r.decision].every(text)})),
    claims: pitch.claims, review: pitch.reviewRows
  };
  const artifacts = [], metrics = {};
  const context = Object.fromEntries(LENS.rubric.receiptFields.map(key => [key, profile[key]]));
  for (const line of LENS.rubric.lines) {
    const group = LENS.lines[line.id].miss.split(".")[0];
    const id = "receipt-" + group;
    artifacts.push({id, kind: line.evidence, lineId: line.id, gitSha: snapshot.gitSha, liveSha: snapshot.liveSha,
      scope: snapshot.scope, context, source: snapshot.source,
      ...(project.artifactFiles?.[group] ? {path: project.artifactFiles[group].path, sha256: project.artifactFiles[group].sha256} : {})});
    metrics[group] = {artifact: id, samples: samples[group]};
  }
  const pack = {status: "VALID", packId: project.packId, synthetic: project.synthetic === true, gitSha: project.gitSha,
    liveSha: project.liveSha, openP0: ledger.openP0, profile, artifacts, metrics,
    ...(project.producerReceipt ? {producerReceipt: project.producerReceipt} : {})};
  const record = grade(LENS, pack, undefined, directory);
  return {waves, ledger: {counts: ledger.counts, states: ledger.states}, deck: pitch.deck, deckDigest: pitch.digest,
    decision: {verdict: record.verdict, grade: record.grade, coverage: record.coverage, packId: pack.packId,
      ...(record.reason ? {reason: record.reason} : {}), blockers: record.blocking, openP0: ledger.openP0, nextCaptures: record.lines.filter(row => row.level === "U").map(row => row.id)}, pack};
}

export function deckMarkdown(result) {
  const {profile, synthetic} = result.pack;
  const lines = ["# Local pitch deck draft", "", "Created by @meta_alchemist (https://x.com/meta_alchemist).", "",
    synthetic ? "Synthetic worked example." : "Local draft for human review.", "", "Audience: " + profile.audience, "Decision requested: " + profile.ask];
  for (const slide of result.deck) lines.push("", "## " + slide.headline, "", slide.claim, "",
    "Status: " + slide.kind, "Source: " + (slide.source || "capture needed"), "Speaker note: " + slide.note);
  return lines.join("\n") + "\n";
}

if (resolve(process.argv[1] || "") === fileURLToPath(import.meta.url)) {
  try {
    const [file, format = "--plan", ...extra] = process.argv.slice(2);
    if (!file || extra.length || !["--plan","--deck","--pack"].includes(format)) throw new Error("Usage: node engine/plan.mjs project.json [--plan | --deck | --pack]");
    const result = prepare(JSON.parse(readFileSync(file, "utf8")), dirname(resolve(file)));
    process.stdout.write(format === "--deck" ? deckMarkdown(result) : JSON.stringify(format === "--pack" ? result.pack : result, null, 2) + "\n");
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
