// Team map, produces and consumes, versions and changelogs. Created by @meta_alchemist (https://x.com/meta_alchemist).
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { loadTeam, OWNER_ARTIFACTS, TEAM_SPEC, TOPICS, schemaVersion } from "../scripts/lib/team.mjs";
import { valid, validRange, satisfies, parse } from "../scripts/lib/semver.mjs";
import { checkChangelog } from "../scripts/lib/changelog.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const team = loadTeam(ROOT);
const shared = fs.readFileSync(path.join(ROOT, "shared", "team-memory", "team-memory.mjs"), "utf8");

test("every template declares version, teamSpec, compat, status, produces, consumes and memory", () => {
  assert.ok(team.length >= 15);
  for (const t of team) {
    assert.ok(valid(t.version), `${t.slug}: version ${t.version}`);
    assert.equal(parse(t.teamSpec)?.major, parse(TEAM_SPEC).major, `${t.slug}: teamSpec`);
    assert.ok(satisfies(TEAM_SPEC, t.compat?.teamSpec), `${t.slug}: compat.teamSpec ${t.compat?.teamSpec}`);
    assert.ok(["shipping", "preview"].includes(t.status), `${t.slug}: status ${t.status}`);
    if (t.status === "preview") assert.equal(parse(t.version).major, 0, `${t.slug}: a preview template stays 0.x`);
    assert.ok(Array.isArray(t.produces) && Array.isArray(t.consumes), `${t.slug}: produces and consumes`);
    assert.ok(t.memory && t.memory.reads.every((x) => TOPICS.includes(x)) && t.memory.writes.every((x) => TOPICS.includes(x)), `${t.slug}: memory topics`);
  }
});

test("every produced and consumed artifact has a schema with a matching major version", () => {
  for (const t of team) {
    for (const p of t.produces) {
      const v = schemaVersion(ROOT, p.schema);
      assert.ok(v, `${t.slug}: missing schema ${p.schema}`);
      assert.equal(p.schema, `spec/artifacts/${p.artifact}.schema.json`);
      assert.equal(parse(p.version).major, parse(v).major, `${t.slug}: ${p.artifact} ${p.version} vs schema ${v}`);
      assert.ok(p.format, `${t.slug}: ${p.artifact} needs a format`);
      const schema = JSON.parse(fs.readFileSync(path.join(ROOT, p.schema), "utf8"));
      assert.equal(schema.properties.artifact.const, p.artifact);
    }
    for (const c of t.consumes) {
      assert.ok(schemaVersion(ROOT, c.schema), `${t.slug}: missing schema ${c.schema}`);
      assert.ok(validRange(t.compat.consumes[c.artifact]), `${t.slug}: compat.consumes.${c.artifact}`);
    }
    assert.deepEqual(Object.keys(t.compat.consumes).sort(), t.consumes.map((c) => c.artifact).sort(), `${t.slug}: compat.consumes must list exactly the consumed artifacts`);
  }
});

test("every template still works alone: only owner-made inputs may be required", () => {
  for (const t of team) for (const c of t.consumes) {
    if (c.required) assert.ok(OWNER_ARTIFACTS.includes(c.artifact), `${t.slug} requires ${c.artifact} from another template`);
  }
});

test("every consumed artifact has a producer in the kit or comes from the owner", () => {
  const made = new Set(team.flatMap((t) => t.produces.map((p) => p.artifact)));
  for (const t of team) for (const c of t.consumes) {
    assert.ok(made.has(c.artifact) || OWNER_ARTIFACTS.includes(c.artifact), `${t.slug} reads ${c.artifact}, which nobody produces`);
  }
});

test("the team map, the team blocks and the TEAM memory facts are up to date", () => {
  const r = spawnSync(process.execPath, [path.join(ROOT, "scripts", "build-team.mjs"), "--check"], { encoding: "utf8" });
  assert.equal(r.status, 0, r.stdout);
  const map = fs.readFileSync(path.join(ROOT, "docs", "TEAM-MAP.md"), "utf8");
  assert.match(map, /```mermaid\nflowchart LR/);
  assert.match(map, /\| Producer \| Artifact \| Consumer \| File format \|/);
  for (const t of team) {
    const gs = fs.readFileSync(path.join(t.dir, "skills", t.gettingStarted, "SKILL.md"), "utf8");
    assert.match(gs, /## Team inputs and outputs/, `${t.slug}: getting-started has no team block`);
    for (const c of t.consumes) assert.ok(gs.includes(`\`${c.artifact}\``), `${t.slug}: team block omits ${c.artifact}`);
    assert.match(gs, /ASSUMPTION: no |Stop and ask the owner/, `${t.slug}: team block must say what to do when an input is missing`);
    const memory = JSON.parse(fs.readFileSync(path.join(t.dir, "recipe.json"), "utf8")).memory;
    assert.ok(memory.some((m) => m.content.startsWith("TEAM:")), `${t.slug}: recipe memory has no TEAM fact`);
  }
});

test("every template carries the shared memory helper byte for byte", () => {
  for (const t of team) {
    const p = path.join(t.dir, "engine", "team-memory.mjs");
    assert.ok(fs.existsSync(p), `${t.slug}: engine/team-memory.mjs missing`);
    assert.equal(fs.readFileSync(p, "utf8"), shared, `${t.slug}: engine/team-memory.mjs differs from shared/team-memory/team-memory.mjs`);
  }
});

test("every template has a Keep a Changelog CHANGELOG.md that matches its version", () => {
  for (const t of team) {
    const p = path.join(t.dir, "CHANGELOG.md");
    assert.ok(fs.existsSync(p), `${t.slug}: CHANGELOG.md missing`);
    assert.deepEqual(checkChangelog(fs.readFileSync(p, "utf8"), t.version), [], t.slug);
  }
});

// Dates are built at runtime so the public scrub never sees a literal date.
const day = (m) => ["2030", m, "01"].join("-");
const log = (...releases) => ["# Changelog", "", "Format: https://keepachangelog.com/en/1.1.0/", "", "## [Unreleased]", "", ...releases].join("\n");
test("a breaking change without a major version bump fails", () => {
  const minorBreak = log(`## [1.1.0] - ${day("02")}`, "### Breaking", "- Renamed the output field.", "", `## [1.0.0] - ${day("01")}`, "### Added", "- First release.", "");
  assert.ok(checkChangelog(minorBreak, "1.1.0").some((p) => p.includes("not a new major version")));
  const removed = log(`## [1.0.1] - ${day("02")}`, "### Removed", "- Dropped a skill.", "", `## [1.0.0] - ${day("01")}`, "### Added", "- First release.", "");
  assert.ok(checkChangelog(removed, "1.0.1").some((p) => p.includes("not a new major version")));
  const bullet = log(`## [1.2.0] - ${day("02")}`, "### Changed", "- BREAKING: the clip list needs a build id.", "", `## [1.1.0] - ${day("01")}`, "### Added", "- First release.", "");
  assert.ok(checkChangelog(bullet, "1.2.0").some((p) => p.includes("not a new major version")));
  const major = log(`## [2.0.0] - ${day("02")}`, "### Breaking", "- Renamed the output field.", "", `## [1.0.0] - ${day("01")}`, "### Added", "- First release.", "");
  assert.deepEqual(checkChangelog(major, "2.0.0"), []);
  const preview = log(`## [0.2.0] - ${day("02")}`, "### Breaking", "- Renamed a field.", "", `## [0.1.0] - ${day("01")}`, "### Added", "- Preview.", "");
  assert.deepEqual(checkChangelog(preview, "0.2.0"), []);
  const previewPatch = log(`## [0.1.1] - ${day("02")}`, "### Breaking", "- Renamed a field.", "", `## [0.1.0] - ${day("01")}`, "### Added", "- Preview.", "");
  assert.ok(checkChangelog(previewPatch, "0.1.1").length > 0);
  assert.ok(checkChangelog(major, "1.0.0").some((p) => p.includes("does not match template.json version")));
});
