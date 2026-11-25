// Created by @meta_alchemist (https://x.com/meta_alchemist).
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { LENS } from "../engine/lens.mjs";
import { grade, runFixtures } from "../engine/lens-kit.mjs";

const read = name => readFileSync(new URL("../" + name, import.meta.url), "utf8");
const rubric = JSON.parse(read("RUBRIC.json"));
const recipe = JSON.parse(read("recipe.json"));
const pack = JSON.parse(read("fixtures/good-pack.json"));
const lensSkill = recipe.skills.find(skill => skill.name.endsWith("-lens-engine"));
for (const file of ["engine/lens-kit.mjs", "engine/lens.mjs", "fixtures/good-pack.json"]) {
  assert.ok(lensSkill.content.includes(read(file)), file);
}
const contract = recipe.memory.find(fact => fact.content.startsWith("Audit contract v1")).content;
for (const installed of [read("MEMORY.md"), read("PROMPTS.md"), ...recipe.routines.map(r => r.content)]) {
  assert.ok(installed.includes(contract));
}
for (const skill of recipe.skills) {
  assert.equal(skill.content, read("skills/" + skill.name + "/SKILL.md"));
  assert.ok(skill.content.includes(contract));
}
assert.equal(rubric.hash, LENS.rubric.hash);
assert.deepEqual(rubric.releaseBlockers, LENS.rubric.releaseBlockers);
assert.equal(rubric.receiptPolicy, LENS.rubric.receiptPolicy);
for (const line of rubric.lines) assert.deepEqual(line.conditions, LENS.lines[line.id].conds);
const result = grade(LENS, pack);
assert.equal(result.verdict, "PASS");
assert.equal(result.synthetic, true);
assert.equal(result.grade, 100);
assert.equal(result.coverage, 1);
assert.equal(result.lines.length, 10);
const suite = runFixtures(LENS, pack);
assert.deepEqual(suite.fails, []);
assert.ok(suite.cases >= 30);
console.log(JSON.stringify({status: "PASS", fixtureCases: suite.cases, template: rubric.id}));
