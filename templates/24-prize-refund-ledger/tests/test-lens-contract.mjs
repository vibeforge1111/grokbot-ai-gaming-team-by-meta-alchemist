#!/usr/bin/env node
// Engine contract test: rubric match and hash, recipe embed, record fields, house text rules. Created by @meta_alchemist (https://x.com/meta_alchemist).
import fs from "node:fs";
import crypto from "node:crypto";
import { LENS } from "../engine/lens.mjs";
import { grade, runFixtures, scoreLevels } from "../engine/lens-kit.mjs";
const u = (p) => new URL(p, import.meta.url), read = (p) => fs.readFileSync(u(p), "utf8"), fails = [], notes = [];
const ok = (c, m) => { if (!c) fails.push(m); };
const sortK = (v) => Array.isArray(v) ? v.map(sortK) : v && typeof v === "object" ? Object.fromEntries(Object.keys(v).sort().map((k) => [k, sortK(v[k])])) : v;
const rub = JSON.parse(read("../RUBRIC.json"));
{ const { hash, ...rest } = rub; ok("sha256:" + crypto.createHash("sha256").update(JSON.stringify(sortK(rest))).digest("hex") === hash, "rubric hash recomputes (gbf-sorted-json-v2)"); }
ok(rub.id === LENS.rubric.id && rub.version === LENS.rubric.version && rub.hash === LENS.rubric.hash, "engine rubric id, version and hash match RUBRIC.json");
ok(JSON.stringify(rub.lines.map((l) => [l.id, l.weight, l.passAt, l.evidence])) === JSON.stringify(LENS.rubric.lines.map((l) => [l.id, l.weight, l.passAt, l.evidence])), "engine line ids, weights and passAt match RUBRIC.json");
ok(rub.pillars.length === 5 && rub.pillars.every((p) => p.points === 20) && rub.lines.length === 10 && rub.lines.reduce((a, l) => a + l.weight, 0) === 100, "5 pillars x 20, 10 lines, weights sum 100");
ok(rub.lines.every((l) => LENS.lines[l.id]), "every rubric line has a lens");
if (fs.existsSync(u("../recipe.json"))) {
const recipe = JSON.parse(read("../recipe.json")), skills = recipe.skills.map((s) => s.content).join("\n");
for (const f of ["../engine/lens-kit.mjs", "../engine/lens.mjs", ...JSON.parse(read("../engine/ENGINE.json")).domain.map((d) => "../" + d)]) ok(skills.includes(read(f).trim()), `recipe embeds ${f.slice(3)} byte for byte`);
ok(recipe.version === 1 && recipe.visibility === "public" && recipe.gettingStarted?.skill && recipe.skills.some((k) => k.name === recipe.gettingStarted.skill), "recipe format and getting-started skill");
ok(recipe.memory.length >= 6 && recipe.memory.length <= 10 && recipe.memory.some((m) => /AUDIT CONTRACT V1/.test(m.content)), "recipe memory 6 to 10 entries with contract v1");
ok(recipe.skills.every((k) => k.content.includes("@meta_alchemist")), "every embedded skill carries credit");
ok(/100-point rubric/.test(recipe.profile.description) && recipe.profile.description.includes("https://x.com/meta_alchemist"), "description states the 100-point rubric and credit");
}
const good = JSON.parse(read("../fixtures/good-pack.json")), rec = grade(LENS, good);
for (const k of ["templateId", "rubricVersion", "rubricHash", "packId", "gitSha", "liveSha", "lines", "supportedPoints", "coverage", "grade", "verdict", "applicable"]) ok(k in rec, `grade record has ${k}`);
ok(rec.synthetic === true, "worked example is labelled synthetic in the record");
const levels = Object.fromEntries(rec.lines.filter((l) => typeof l.level === "number").map((l) => [l.id, l.level]));
ok(scoreLevels(LENS.rubric, levels).grade === rec.grade, "grade equals weight * level / 4 over measured lines");
const fx = runFixtures(LENS, good); ok(fx.status === "PASS", "negative fixtures: " + fx.fails.join("; "));
console.log(JSON.stringify({ status: fails.length ? "FAIL" : "PASS", template: LENS.rubric.id, fixtureCases: fx.cases, fails, notes }));
process.exit(fails.length ? 1 : 0);
