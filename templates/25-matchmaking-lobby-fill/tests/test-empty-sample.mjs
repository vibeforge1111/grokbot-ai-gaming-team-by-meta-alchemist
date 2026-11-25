// Created by @meta_alchemist (https://x.com/meta_alchemist).
import assert from "node:assert/strict";
import fs from "node:fs";
import {grade, mutations, applyCase} from "../engine/lens-kit.mjs";
import {LENS} from "../engine/lens.mjs";

const good = JSON.parse(fs.readFileSync(new URL("../fixtures/good-pack.json",import.meta.url)));
const checkEmpty = pack => {
  const result = grade(LENS,pack);
  assert.equal(result.grade,0);
  assert.equal(result.supportedPoints,0);
  assert.equal(result.coverage,0);
  assert.equal(result.verdict,"CONDITIONAL");
  assert.equal(result.lines.length,10);
  assert.ok(result.lines.every(line => line.level === "U" && line.reason.startsWith("UNMEASURED")));
};
checkEmpty({...good,metrics:{}});
checkEmpty({...good,artifacts:[]});
for (const value of [0, [], null]) {
  const pack = structuredClone(good);
  for (const group of Object.values(pack.metrics)) group.measuredCases = value;
  checkEmpty(pack);
}
const cases = mutations(LENS,good).cases.filter(c => c.id.includes("#empty"));
for (const c of cases) {
  const pack = applyCase(good,c);
  const result = grade(LENS,pack);
  assert.equal(result.lines.find(line => line.id === c.line).level,"U",c.id);
  assert.ok(result.grade <= 90 && result.verdict !== "PASS",c.id);
}
console.log(JSON.stringify({status:"PASS",wholePacks:5,emptyLineCases:cases.length}));
