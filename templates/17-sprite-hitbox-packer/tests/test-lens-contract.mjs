#!/usr/bin/env node
// Engine contract test: rubric match, recipe embed, kit drift, record fields, house text rules. Created by @meta_alchemist (https://x.com/meta_alchemist).
import fs from "node:fs";
import { LENS } from "../engine/lens.mjs";
import { grade, runFixtures, scoreLevels } from "../engine/lens-kit.mjs";
const u = (p) => new URL(p, import.meta.url), read = (p) => fs.readFileSync(u(p), "utf8"), fails = [], notes = [];
const ok = (c, m) => { if (!c) fails.push(m); };
const rub = JSON.parse(read("../RUBRIC.json"));
ok(rub.id === LENS.rubric.id && rub.version === LENS.rubric.version && rub.hash === LENS.rubric.hash, "engine rubric id, version and hash match RUBRIC.json");
ok(JSON.stringify(rub.lines.map((l) => [l.id, l.weight, l.passAt, l.evidence])) === JSON.stringify(LENS.rubric.lines.map((l) => [l.id, l.weight, l.passAt, l.evidence])), "engine line ids, weights and passAt match RUBRIC.json");
ok(rub.lines.every((l) => LENS.lines[l.id]), "every rubric line has a lens");
const recipe = JSON.parse(read("../recipe.json")), skills = recipe.skills.map((s) => s.content).join("\n");
for (const f of ["../engine/lens-kit.mjs", "../engine/lens.mjs"]) ok(skills.includes(read(f).trim()), `recipe embeds ${f.slice(3)} byte for byte`);
const shared = u("../../../shared/lens-kit/lens-kit.mjs");
if (fs.existsSync(shared)) ok(fs.readFileSync(shared, "utf8") === read("../engine/lens-kit.mjs"), "vendored lens-kit.mjs equals the shared copy"); else notes.push("shared lens-kit not present (portable install): drift check NOT_RUN");
const good = JSON.parse(read("../fixtures/good-pack.json")), rec = grade(LENS, good);
for (const k of ["templateId", "rubricVersion", "rubricHash", "packId", "gitSha", "liveSha", "lines", "supportedPoints", "coverage", "grade", "verdict", "applicable"]) ok(k in rec, `grade record has ${k}`);
ok(rec.synthetic === true, "worked example is labelled synthetic in the record");
const levels = Object.fromEntries(rec.lines.filter((l) => typeof l.level === "number").map((l) => [l.id, l.level]));
ok(rec.applicable === false || scoreLevels(LENS.rubric, levels).grade === rec.grade, "grade equals weight * level / 4 over measured lines");
const fx = runFixtures(LENS, good); ok(fx.status === "PASS", "negative fixtures: " + fx.fails.join("; "));
const pub = [read("../README.md"), read("../RUBRIC.md"), recipe.profile.description, skills, recipe.memory.map((m) => m.content).join("\n")].join("\n");
ok(pub.includes("@meta_alchemist"), "public text carries the @meta_alchemist credit");
ok(!/[\u2013\u2014]/.test(pub), "public text has no em or en dash");
ok(!/\/home\/|\/workspace\/|\/Users\/[A-Za-z]/.test(pub), "public text has no local machine paths");
console.log(JSON.stringify({ status: fails.length ? "FAIL" : "PASS", template: LENS.rubric.id, fixtureCases: fx.cases, fails, notes }));
process.exit(fails.length ? 1 : 0);
