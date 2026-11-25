// Created by @meta_alchemist (https://x.com/meta_alchemist).
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { prepare, deckMarkdown } from "../engine/plan.mjs";
import { LENS } from "../engine/lens.mjs";
import { grade } from "../engine/lens-kit.mjs";

const read = file => readFileSync(new URL("../" + file, import.meta.url), "utf8");
const fresh = () => JSON.parse(read("fixtures/project.json"));
const level = (result, id) => grade(LENS, result.pack).lines.find(row => row.id === id).level;

test("rebuild the worked pack and reviewed local deck from the standalone export", () => {
  const result = prepare(fresh());
  assert.deepEqual(result.pack, JSON.parse(read("fixtures/good-pack.json")));
  assert.equal(deckMarkdown(result), read("fixtures/pitch-draft.md"));
  assert.equal(result.deck.length, 6);
  assert.deepEqual(result.waves, [["capture"], ["model", "cue"], ["decision"]]);
  assert.deepEqual(result.ledger.counts, {P0: 0, P1: 1, P2: 1});
  assert.deepEqual(result, prepare(fresh()));
  const skill = JSON.parse(read("recipe.json")).skills.find(s => s.name === "parallel-handoffs");
  for (const file of ["engine/plan.mjs", "fixtures/project.json"]) assert.ok(skill.content.includes(read(file)));
});

test("a failed gate or an open P0 blocks even with a reconciled ledger", () => {
  const project = fresh();
  project.snapshot.gates[0].passed = false;
  project.snapshot.gates.pop();
  let result = prepare(project);
  assert.equal(result.decision.grade, 0);
  assert.equal(result.decision.verdict, "BLOCKED");
  assert.equal(level(result, "ledger:1"), 4);
  assert.equal(level(result, "release-decision:1"), "U");
  project.snapshot.tickets[0].severity = "P0";
  project.snapshot.gates = fresh().snapshot.gates;
  result = prepare(project);
  assert.equal(result.decision.openP0, 1);
  assert.equal(result.decision.grade, 0);
});

test("lock conflicts and missing lock scope serialize the plan and hold conflicting observed work", () => {
  for (const locks of [["shift rules"], null]) {
    const project = fresh();
    project.snapshot.tasks.find(t => t.id === "cue").locks = locks;
    const result = prepare(project);
    assert.equal(result.waves.length, 4);
    assert.ok(result.decision.blockers.some(b => b.id === "overlapping-lock"));
    assert.equal(result.decision.grade, 0);
  }
});

test("stale, missing and expired predecessor receipts require a fresh handoff", () => {
  for (const patch of [{liveSha: "old-build"}, {expiresAtTick: 8}, {source: ""}]) {
    const project = fresh();
    Object.assign(project.snapshot.runs[0], patch);
    assert.equal(level(prepare(project), "workstreams:1"), "U");
  }
  const project = fresh();
  project.snapshot.runs.shift();
  assert.equal(level(prepare(project), "workstreams:1"), "U");
  const timeout = fresh();
  timeout.snapshot.runs[0].timedOut = true;
  assert.equal(prepare(timeout).decision.grade, 0);
});

test("wrong order, duplicate tickets and infeasible dependency graphs are detected", () => {
  const project = fresh();
  project.snapshot.runs[0].wave = 4;
  assert.ok(level(prepare(project), "workstreams:1") < 3);
  project.snapshot.tickets.push(project.snapshot.tickets[0]);
  assert.throws(() => prepare(project), /duplicate ID/);
  const graph = fresh();
  graph.snapshot.tasks[0].needs = ["decision"];
  assert.throws(() => prepare(graph), /cycle/);
  graph.snapshot.tasks[0].needs = ["missing-task"];
  assert.throws(() => prepare(graph), /predecessor/);
});

test("empty ledger or absent live proof stays unmeasured, and review binds to slide content", () => {
  const project = fresh();
  project.snapshot.tickets = [];
  let result = prepare(project);
  assert.equal(level(result, "ledger:1"), "U");
  assert.equal(level(result, "ledger:2"), "U");
  project.snapshot.tickets = fresh().snapshot.tickets;
  delete project.snapshot.tickets[2].verification;
  assert.equal(level(prepare(project), "ledger:2"), "U");
  project.snapshot.slides[0].claim = "An unsupported result";
  result = prepare(project);
  assert.equal(result.deck[0].claim, "[Evidence gap]");
  assert.equal(level(result, "pitch:2"), "U");
  assert.equal(result.decision.verdict, "CONDITIONAL");
});

test("a task's proof must match its own current run receipt", () => {
  const changed = fresh();
  changed.snapshot.tasks[0].proof = "a different capture";
  const lvl = level(prepare(changed), "milestone:1");
  assert.ok(typeof lvl === "number" && lvl < 4, `a mismatched proof must lose level 4, got ${lvl}`);
  const missing = fresh();
  missing.snapshot.runs = missing.snapshot.runs.filter(run => run.id !== missing.snapshot.tasks[0].id);
  assert.equal(level(prepare(missing), "milestone:1"), "U");
});
