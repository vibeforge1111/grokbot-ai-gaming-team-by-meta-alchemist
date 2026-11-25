// Created by @meta_alchemist (https://x.com/meta_alchemist).
import { readFileSync } from "node:fs";
import { LENS } from "../engine/lens.mjs";
import { applyCase, grade, runFixtures } from "../engine/lens-kit.mjs";

const read = name => JSON.parse(readFileSync(new URL("../fixtures/" + name, import.meta.url)));
const args = process.argv.slice(2);
if (args.length && (args.length !== 2 || !["--line", "--case"].includes(args[0]) || !args[1].trim())) {
  console.error("Usage: node tests/lens-negative-fixtures.mjs [--line lineId | --case fixtureId]");
  process.exit(2);
}
const good = read("good-pack.json");
let result;
if (args[0] === "--case") {
  const selected = read("mutations.json").cases.find(item => item.id === args[1]);
  if (!selected) {
    console.error("Unknown fixture: " + args[1]);
    process.exit(1);
  }
  const record = grade(LENS, applyCase(good, selected));
  const level = record.lines.find(line => line.id === selected.line)?.level;
  const ok = selected.expect === "BLOCKED"
    ? record.grade === 0 && record.verdict === "BLOCKED" && record.blocking.some(rule => rule.id === selected.id)
    : selected.expect === "U" ? level === "U" : typeof level === "number" && level < 3;
  result = {status: ok ? "PASS" : "FAIL", cases: 1, fixture: selected.id, level, verdict: record.verdict};
} else {
  result = runFixtures(LENS, good, {line: args[1] ?? null});
}
console.log(JSON.stringify(result));
process.exitCode = result.status === "PASS" ? 0 : 1;
