#!/usr/bin/env node
// Checks team artifact files against spec/artifacts/<artifact>.schema.json. Created by @meta_alchemist (https://x.com/meta_alchemist).
// Usage: node scripts/check-artifact.mjs <file.json | .grokbot-team/artifacts dir> ...   Exit 1 on any problem.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { check } from "./lib/schema.mjs";
import { parse } from "./lib/semver.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
export function checkArtifact(doc) {
  if (!doc || typeof doc.artifact !== "string" || !/^[a-z][a-z0-9-]+$/.test(doc.artifact)) return ["missing or invalid artifact id"];
  const file = path.join(ROOT, "spec", "artifacts", `${doc.artifact}.schema.json`);
  if (!fs.existsSync(file)) return [`no schema for ${doc.artifact}`];
  const schema = JSON.parse(fs.readFileSync(file, "utf8"));
  const problems = check(schema, doc);
  const v = parse(doc.version), s = parse(schema["x-version"]);
  if (v && s && (v.major !== s.major || v.minor > s.minor)) problems.push(`version ${doc.version} is not covered by schema ${schema["x-version"]}`);
  if (typeof doc.createdAt === "string" && !/Z$/.test(doc.createdAt)) problems.push("createdAt must be UTC (ending in Z)");
  return problems;
}
const walk = (p) => fs.statSync(p).isDirectory() ? fs.readdirSync(p).flatMap((f) => walk(path.join(p, f))) : p.endsWith(".json") ? [p] : [];
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const files = process.argv.slice(2).flatMap(walk);
  let bad = 0;
  for (const f of files) {
    let problems;
    try { problems = checkArtifact(JSON.parse(fs.readFileSync(f, "utf8"))); } catch (e) { problems = [`not JSON: ${e.message}`]; }
    if (problems.length) bad++;
    console.log(`${problems.length ? "FAIL" : "OK  "} ${f}${problems.length ? "\n  - " + problems.join("\n  - ") : ""}`);
  }
  console.log(`check-artifact: ${files.length} file(s), ${bad} with problems -> ${bad ? "FAIL" : "OK"}`);
  process.exit(bad ? 1 : 0);
}
