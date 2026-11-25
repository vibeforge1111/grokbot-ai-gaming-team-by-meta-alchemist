// Team spec helpers: load template manifests, check artifact exchange and versions.
// Created by @meta_alchemist (https://x.com/meta_alchemist). No dependencies.
import fs from "node:fs";
import path from "node:path";
import { parse, satisfies, rangeMajor, validRange, valid } from "./semver.mjs";

export const TEAM_SPEC = "1.0.0";
export const ARTIFACT_DIR = ".grokbot-team/artifacts";
export const MEMORY_DIR = ".grokbot-team/memory";
export const TOPICS = ["decisions", "incidents", "entitlements", "balance", "regions", "releases"];
// Artifacts the owner (or the owner's tools) makes. A template may consume them without a producing template.
export const OWNER_ARTIFACTS = ["game-profile", "evidence-pack", "tracker-export", "change-list"];

export function templateDirs(root) {
  const dirs = [];
  for (const base of ["templates", "starter"]) {
    const p = path.join(root, base);
    if (!fs.existsSync(p)) continue;
    for (const d of fs.readdirSync(p).sort()) if (fs.existsSync(path.join(p, d, "template.json"))) dirs.push(path.join(p, d));
  }
  return dirs;
}

export function loadTeam(root) {
  return templateDirs(root).map((dir) => ({ dir, rel: path.relative(root, dir).split(path.sep).join("/"), ...JSON.parse(fs.readFileSync(path.join(dir, "template.json"), "utf8")) }));
}

export function schemaVersion(root, schemaRef) {
  const p = path.join(root, schemaRef ?? "");
  if (!schemaRef || !fs.existsSync(p)) return null;
  return JSON.parse(fs.readFileSync(p, "utf8"))["x-version"] ?? null;
}

const statusOf = (t) => t.status ?? "shipping";
const rank = { OK: 0, WARN: 1, BREAK: 2 };
const worst = (a, b) => (rank[a] >= rank[b] ? a : b);

// One artifact exchanged from producer P to consumer C.
export function checkExchange(root, P, C, artifact) {
  const out = (status, reason, fix = "") => ({ status, reason, fix });
  const made = (P.produces || []).find((x) => x.artifact === artifact);
  const range = C.compat?.consumes?.[artifact];
  const schemaV = schemaVersion(root, made?.schema);
  if (!valid(made?.version)) return out("BREAK", `${P.slug} does not declare a semver version for ${artifact}`, `add "version" to ${artifact} in ${P.slug}/template.json produces`);
  if (!schemaV) return out("BREAK", `schema ${made.schema ?? "(none)"} for ${artifact} is missing`, `add spec/artifacts/${artifact}.schema.json with an x-version, or fix the schema path in ${P.slug}/template.json`);
  if (parse(made.version).major !== parse(schemaV).major || parse(made.version).minor > parse(schemaV).minor) {
    return out("BREAK", `${P.slug} writes ${artifact} ${made.version} but the schema is at ${schemaV}`, `update spec/artifacts/${artifact}.schema.json to ${made.version} first, or set ${P.slug} back to the schema version`);
  }
  if (!validRange(range)) return out("BREAK", `${C.slug} consumes ${artifact} without a version range`, `add "${artifact}": "^${parse(schemaV).major}.0.0" to compat.consumes in ${C.slug}/template.json`);
  const pT = parse(P.teamSpec), cT = parse(C.teamSpec);
  if (!pT || !cT) return out("BREAK", "teamSpec missing on one side", "set teamSpec in both template.json files");
  if (pT.major !== cT.major) return out("BREAK", `team spec ${P.teamSpec} vs ${C.teamSpec}`, "move both templates to the same team spec major version");
  if (!satisfies(made.version, range)) {
    if (rangeMajor(range) !== null && rangeMajor(range) !== parse(made.version).major) {
      return out("BREAK", `${P.slug} writes ${artifact} ${made.version}; ${C.slug} accepts ${range}`,
        `update ${C.slug} to read ${artifact} ${parse(made.version).major}.x, set compat.consumes.${artifact} to "^${made.version}" and bump ${C.slug} to a new major version; or keep ${P.slug} writing ${rangeMajor(range)}.x until consumers move`);
    }
    return out("WARN", `${C.slug} asks for ${artifact} ${range}; ${P.slug} writes ${made.version}, which lacks newer optional fields`,
      `bump ${P.slug} to write ${artifact} at the newer minor version, or relax ${C.slug} compat.consumes.${artifact}; until then ${C.slug} treats the newer fields as missing`);
  }
  if (statusOf(P) === "preview") return out("WARN", `${P.slug} is a preview template; ${artifact} may change without a major version`, `promote ${P.slug} to shipping, or treat ${artifact} from it as optional`);
  if (pT.minor !== cT.minor) return out("WARN", `team spec ${P.teamSpec} vs ${C.teamSpec}`, "move both templates to the same team spec minor version");
  return out("OK", `${P.slug} writes ${artifact} ${made.version}; ${C.slug} accepts ${range}`);
}

// Every pair of templates that exchanges at least one artifact.
export function compatReport(root, team = loadTeam(root)) {
  const pairs = [], unproduced = [];
  for (const C of team) {
    for (const use of C.consumes || []) {
      const producers = team.filter((P) => P !== C && (P.produces || []).some((x) => x.artifact === use.artifact));
      if (!producers.length && !OWNER_ARTIFACTS.includes(use.artifact)) unproduced.push({ consumer: C.slug, artifact: use.artifact });
      for (const P of producers) {
        let pair = pairs.find((x) => x.producer === P.slug && x.consumer === C.slug);
        if (!pair) pairs.push(pair = { producer: P.slug, producerVersion: P.version, consumer: C.slug, consumerVersion: C.version, status: "OK", artifacts: [] });
        const r = checkExchange(root, P, C, use.artifact);
        pair.artifacts.push({ artifact: use.artifact, ...r });
        pair.status = worst(pair.status, r.status);
      }
    }
  }
  const counts = { OK: 0, WARN: 0, BREAK: 0 };
  for (const p of pairs) counts[p.status]++;
  return { teamSpec: TEAM_SPEC, pairs, unproduced, counts };
}
