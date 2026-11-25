---
name: parallel-handoffs
description: "Use when overlapping work needs a dependency order, wave plan and exclusive lock checks. Carries the local planner engine/plan.mjs and the example project."
---

> Created by @meta_alchemist (https://x.com/meta_alchemist).
> Audit contract v1 (overrides everything below). Grade only with the installed lens. Use the owner's approved game profile for game facts, scope and budgets. Synthetic numbers illustrate one profile. Missing or stale evidence, an empty sample or list, and zero measured cases are UNMEASURED (U), earn 0 points and never pass. Record an unavailable run as NOT_RUN. A confirmed release blocker or unresolved P0 gives BLOCKED and grade 0. An unknown fixture selector must fail. Keep each ticket as a local draft. Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

# Sequence parallel work

Order the milestone's tasks so each one starts only after the work it depends on has current, passing evidence, and so two tasks in the same wave never change the same locked resource. The planner `engine/plan.mjs` does the ordering and checking; this skill says how to feed it and read it.

Rubric lines this feeds: `workstreams:1` (Predecessor receipts precede handoff) and `workstreams:2` (Parallel tasks respect exclusive locks). Both carry release blockers: a consumer that ran before its predecessor passed (or after it timed out), and two tasks in one wave holding the same lock or role, each set the grade to 0.

## Steps

1. **Get the planner.** If `engine/plan.mjs` or `fixtures/project.json` is not on disk, write them byte for byte from the "Worked example files" below, next to the engine files from the `parallel-game-producer-lens-engine` skill.
2. **Draw the edges.** In each task, `needs` lists its predecessors. The planner adds two edges of its own: every task waits for `profile.firstTask` (the evidence capture), and `profile.decisionTask` (the go or hold) waits for every task. A missing predecessor or a cycle stops planning with an error.
3. **Name the locks.** In each task, `locks` lists the resources only it may change. The task's `role` is a lock too. A task with no lock list is treated as conflicting with everything and is scheduled alone.
4. **Plan the waves.** From the template folder run `node engine/plan.mjs <project.json> --plan`. Read `waves`: each wave holds only ready tasks with no shared lock or role.
5. **Record what actually ran.** The proposed waves and the observed runs are separate. For each task that ran, add a row to `snapshot.runs` with `id`, `gitSha`, `liveSha`, `scope`, `source`, `wave` (the wave it actually ran in), `passed`, and optionally `expiresAtTick` (compared with `snapshot.reviewTick`) or `timedOut: true`.
6. **Build and grade.** `node engine/plan.mjs <project.json> --pack > <pack.json>`, then `node engine/lens.mjs <pack.json>`. The pack holds one `dependency` row `{caseId, ready}` per edge (the case id is `["predecessor","consumer"]`) and one `locks` row `{caseId, conflictFree}` per task.
7. **Hold stale handoffs.** A predecessor receipt from another build or scope, an expired one or a missing one leaves the edge unmeasured (U): ask for a fresh run before the handoff. A predecessor that failed, timed out or ran in the same or a later wave than its consumer is a measured failure and blocks the grade.
8. **When ownership is unclear.** If a lock's owner or expiry is unclear, serialize the tasks (put them in separate waves) and require a fresh handoff. Keep any automatic orchestration off by default.

## Output

- The wave table and the dependency exceptions (stale, expired, failed or out-of-order handoffs) as a local draft.
- `dependency` and `locks` rows in the pack the planner builds.

## Examples by genre (illustrative)

- **Mobile puzzle game:** `level-pack-2` and `tutorial-text` can share a wave (different files, different roles); two designers editing the same level file cannot.
- **Narrative adventure:** the voice session needs the final script, so it waits for the script task's passing receipt on this build.
- **Racing game:** two tasks that both need the only console devkit share the lock `devkit` and go in separate waves.
- **Solo developer:** with one role per skill, the planner never books you on two tasks of the same role at once.

## Pitfalls

- Recording the planned wave as the run wave. Record where the task actually ran.
- Reusing a predecessor's receipt from an older build.
- Leaving `locks` empty to squeeze more tasks into a wave. An empty list is allowed only when the task truly changes nothing shared.

## Worked example files

Write these files byte for byte to run the planner on the synthetic project. A real project needs the owner's own snapshot; every value below is illustrative.

For a real project, supply one `artifactFiles[group]` entry with a relative path and SHA-256 per metric group. Use `--pack` to prepare the profile, artifact list and observations for the evidence producer, who returns the signed-off digest fields in `project.producerReceipt` (see "First real pack" in `HOW-TO-USE.md`). Run the planner with the project file beside its evidence files. An unverified pack returns an INVALID decision with the reason.

### engine/plan.mjs

<!-- embed engine/plan.mjs -->
```js
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
```
<!-- end embed -->

### fixtures/project.json (synthetic)

<!-- embed fixtures/project.json -->
```json
{
  "synthetic": true,
  "packId": "synthetic-parallel-game-producer",
  "gitSha": "synthetic-source-parallel-game-producer",
  "liveSha": "synthetic-build-parallel-game-producer",
  "profile": {
    "scope": "management-prototype-review-a",
    "genre": "management simulation",
    "bands": {
      "floor": 0.5,
      "pass": 0.75,
      "target": 1
    },
    "milestone": "one playable shift",
    "audience": "prototype review group",
    "ask": "authorize a second shift prototype",
    "hoursByRole": {
      "capture": 4,
      "design": 6,
      "art": 5,
      "producer": 3
    },
    "reviewWindow": "one planning wave",
    "firstTask": "capture",
    "decisionTask": "decision",
    "severities": [
      "P0",
      "P1",
      "P2"
    ],
    "requiredGates": [
      "playable",
      "readability"
    ],
    "requiredTopics": [
      "promise",
      "proof",
      "scope",
      "dependencies",
      "risk",
      "ask"
    ]
  },
  "snapshot": {
    "gitSha": "synthetic-source-parallel-game-producer",
    "liveSha": "synthetic-build-parallel-game-producer",
    "scope": "management-prototype-review-a",
    "source": "fixtures/project.json#/snapshot",
    "reviewTick": 8,
    "tasks": [
      {
        "id": "capture",
        "role": "capture",
        "needs": [],
        "locks": [
          "session trace"
        ],
        "hours": 2,
        "accept": "Complete a shift and record its final state.",
        "proof": "shift trace"
      },
      {
        "id": "model",
        "role": "design",
        "needs": [
          "capture"
        ],
        "locks": [
          "shift rules"
        ],
        "hours": 5,
        "accept": "Reconcile final shift totals with the model.",
        "proof": "balance worksheet"
      },
      {
        "id": "cue",
        "role": "art",
        "needs": [
          "capture"
        ],
        "locks": [
          "shift cues"
        ],
        "hours": 3,
        "accept": "Locate the end-of-shift cue at display scale.",
        "proof": "readability capture"
      },
      {
        "id": "decision",
        "role": "producer",
        "needs": [
          "model",
          "cue"
        ],
        "locks": [
          "review brief"
        ],
        "hours": 2,
        "accept": "Review both receipts and the scope cut.",
        "proof": "decision note"
      }
    ],
    "runs": [
      {
        "id": "capture",
        "gitSha": "synthetic-source-parallel-game-producer",
        "liveSha": "synthetic-build-parallel-game-producer",
        "scope": "management-prototype-review-a",
        "source": "shift trace",
        "wave": 0,
        "passed": true,
        "expiresAtTick": 12
      },
      {
        "id": "model",
        "gitSha": "synthetic-source-parallel-game-producer",
        "liveSha": "synthetic-build-parallel-game-producer",
        "scope": "management-prototype-review-a",
        "source": "balance worksheet",
        "wave": 1,
        "passed": true,
        "expiresAtTick": 12
      },
      {
        "id": "cue",
        "gitSha": "synthetic-source-parallel-game-producer",
        "liveSha": "synthetic-build-parallel-game-producer",
        "scope": "management-prototype-review-a",
        "source": "readability capture",
        "wave": 1,
        "passed": true,
        "expiresAtTick": 12
      },
      {
        "id": "decision",
        "gitSha": "synthetic-source-parallel-game-producer",
        "liveSha": "synthetic-build-parallel-game-producer",
        "scope": "management-prototype-review-a",
        "source": "decision note",
        "wave": 2,
        "passed": true,
        "expiresAtTick": 12
      }
    ],
    "tickets": [
      {
        "id": "cue-density",
        "severity": "P1",
        "state": "open"
      },
      {
        "id": "handover-wording",
        "severity": "P2",
        "state": "open"
      },
      {
        "id": "shift-total",
        "severity": "P2",
        "state": "closed",
        "sourceFix": "model correction",
        "fixRole": "design",
        "configState": "unneeded",
        "verification": {
          "gitSha": "synthetic-source-parallel-game-producer",
          "liveSha": "synthetic-build-parallel-game-producer",
          "scope": "management-prototype-review-a",
          "source": "closing trace",
          "role": "capture",
          "passed": true
        }
      }
    ],
    "reportedCounts": {
      "P0": 0,
      "P1": 1,
      "P2": 1
    },
    "gates": [
      {
        "id": "playable",
        "gitSha": "synthetic-source-parallel-game-producer",
        "liveSha": "synthetic-build-parallel-game-producer",
        "scope": "management-prototype-review-a",
        "source": "playable receipt",
        "passed": true
      },
      {
        "id": "readability",
        "gitSha": "synthetic-source-parallel-game-producer",
        "liveSha": "synthetic-build-parallel-game-producer",
        "scope": "management-prototype-review-a",
        "source": "readability receipt",
        "passed": true
      }
    ],
    "risks": [
      {
        "id": "density",
        "role": "art",
        "trigger": "queue cue obscured in the dense arrival case",
        "fallback": "retain the current arrival pattern",
        "decision": "second shift review"
      }
    ],
    "facts": [
      {
        "id": "promise",
        "text": "Each shift asks the player to balance queues against available staff.",
        "kind": "observed",
        "source": "design brief, shift loop",
        "approved": true
      },
      {
        "id": "proof",
        "text": "A local trace follows a shift from opening through handover.",
        "kind": "observed",
        "source": "shift trace, closing state",
        "approved": true
      },
      {
        "id": "scope",
        "text": "The next prototype would vary arrivals while retaining the current staffing rules.",
        "kind": "proposal",
        "source": "scope draft, proposed change",
        "approved": true
      },
      {
        "id": "dependencies",
        "text": "The model and cue reviews depend on the capture and use separate resources.",
        "kind": "observed",
        "source": "task graph, model and cue",
        "approved": true
      },
      {
        "id": "risk",
        "text": "A denser arrival pattern could obscure the queue cue.",
        "kind": "proposal",
        "source": "risk sheet, cue density",
        "approved": true
      },
      {
        "id": "ask",
        "text": "Authorize a second shift prototype under the agreed role capacities.",
        "kind": "proposal",
        "source": "owner brief, decision requested",
        "approved": true
      }
    ],
    "slides": [
      {
        "id": "promise",
        "headline": "A shift built around tradeoffs",
        "claim": "Each shift asks the player to balance queues against available staff.",
        "fact": "promise",
        "note": "Show the point where adding staff changes the waiting line."
      },
      {
        "id": "proof",
        "headline": "One shift is playable",
        "claim": "A local trace follows a shift from opening through handover.",
        "fact": "proof",
        "note": "Walk through the closing state and the input that produced it."
      },
      {
        "id": "scope",
        "headline": "Keep the second shift small",
        "claim": "The next prototype would vary arrivals while retaining the current staffing rules.",
        "fact": "scope",
        "note": "Cut the extra arrival pattern first if balancing overruns."
      },
      {
        "id": "dependencies",
        "headline": "Two reviews can proceed together",
        "claim": "The model and cue reviews depend on the capture and use separate resources.",
        "fact": "dependencies",
        "note": "Show their distinct resource keys and the final decision handoff."
      },
      {
        "id": "risk",
        "headline": "Queue readability is the open design risk",
        "claim": "A denser arrival pattern could obscure the queue cue.",
        "fact": "risk",
        "note": "Use the current cue test before committing additional art."
      },
      {
        "id": "ask",
        "headline": "Authorize the next prototype",
        "claim": "Authorize a second shift prototype under the agreed role capacities.",
        "fact": "ask",
        "note": "Seek a scope decision. If declined, retain the single-shift demonstration."
      }
    ],
    "deckReview": {
      "gitSha": "synthetic-source-parallel-game-producer",
      "liveSha": "synthetic-build-parallel-game-producer",
      "scope": "management-prototype-review-a",
      "source": "synthetic review notes for the six slides",
      "role": "milestone reviewer",
      "digest": "0b1f12c6527a5a2f40486665080b071d5ffa4db6e61553a59083943edb0859ef",
      "topics": {
        "promise": true,
        "proof": true,
        "scope": true,
        "dependencies": true,
        "risk": true,
        "ask": true
      }
    }
  }
}
```
<!-- end embed -->
