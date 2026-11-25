#!/usr/bin/env node
// Kit validator. Created by @meta_alchemist (https://x.com/meta_alchemist).
// Checks every template folder against spec/TEMPLATE_SPEC.md. Exit 1 on any failure.
// Usage: node scripts/validate.mjs [--json] [--root <repo>] [template-dir ...]
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";
import { check } from "./lib/schema.mjs";
import { skillHeaders } from "./lib/skill-headers.mjs";
import { rubricMarkdown } from "./lib/rubric-markdown.mjs";
import { draftRule, branchRule } from "./lib/installed-rules.mjs";
import { spawnSync } from "node:child_process";
import { isDeepStrictEqual } from "node:util";
import { rubricHash } from "./lib/hash.mjs";
import { ruleWeights } from "../shared/lens-kit/lens-kit.mjs";
import { checkChangelog } from "./lib/changelog.mjs";
import { schemaVersion } from "./lib/team.mjs";

const args = process.argv.slice(2);
const json = args.includes("--json");
const rootIdx = args.indexOf("--root");
const ROOT = path.resolve(rootIdx >= 0 ? args[rootIdx + 1] : path.join(path.dirname(fileURLToPath(import.meta.url)), ".."));
const explicit = args.filter((a, i) => !a.startsWith("--") && args[i - 1] !== "--root");
const CREDIT = "@meta_alchemist", CREDIT_URL = "https://x.com/meta_alchemist";
const results = [];
const rec = (scope, name, ok, detail = "") => results.push({ scope, name, ok: !!ok, detail: ok ? "" : String(detail).slice(0, 300) });
const readJson = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const exists = (p) => fs.existsSync(p);
const DASH = /[\u2013\u2014]/;
const LOCAL_PATH = /\/home\/[a-z]|\/workspace\/|\/Users\/[A-Za-z]|\/cursor\/stores/;
const schemas = Object.fromEntries(["template", "rubric", "recipe"].map((n) => [n, readJson(path.join(ROOT, "spec", `${n}.schema.json`))]));
const sharedKit = path.join(ROOT, "shared", "lens-kit", "lens-kit.mjs");
const sharedMemory = path.join(ROOT, "shared", "team-memory", "team-memory.mjs");

function textFiles(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory() && !["node_modules", ".git"].includes(e.name)) out.push(...textFiles(p));
    else if (e.isFile() && /\.(md|mjs|js|json|ya?ml|txt)$/.test(e.name)) out.push(p);
  }
  return out;
}

async function validateTemplate(dir) {
  const s = path.relative(ROOT, dir) || dir;
  const need = ["template.json", "recipe.json", "RUBRIC.json", "RUBRIC.md", "HOW-TO-USE.md", "PROMPTS.md", "MEMORY.md", "engine/lens.mjs", "engine/lens-kit.mjs", "fixtures/good-pack.json", "tests/test-lens-contract.mjs", "tests/lens-negative-fixtures.mjs"];
  const missing = need.filter((f) => !exists(path.join(dir, f)));
  rec(s, "required files present", missing.length === 0, missing.join(", "));
  if (missing.some((f) => f.endsWith(".json"))) return;
  const man = readJson(path.join(dir, "template.json"));
  const rub = readJson(path.join(dir, "RUBRIC.json"));
  const rcp = readJson(path.join(dir, "recipe.json"));
  let e;
  e = check(schemas.template, man); rec(s, "template.json matches spec/template.schema.json", !e.length, e.join("; "));
  e = check(schemas.rubric, rub); rec(s, "RUBRIC.json matches spec/rubric.schema.json", !e.length, e.join("; "));
  e = check(schemas.recipe, rcp); rec(s, "recipe.json matches spec/recipe.schema.json", !e.length, e.join("; "));
  rec(s, "slug matches folder name", man.slug === path.basename(dir), `${man.slug} vs ${path.basename(dir)}`);
  // Team fields, schemas and the changelog (docs/TEAM-MAP.md, docs/VERSIONING.md)
  const changelog = path.join(dir, "CHANGELOG.md");
  const clProblems = exists(changelog) ? checkChangelog(fs.readFileSync(changelog, "utf8"), man.version) : ["CHANGELOG.md missing"];
  rec(s, "CHANGELOG.md follows Keep a Changelog and matches the version (breaking changes need a major bump)", !clProblems.length, clProblems.join("; "));
  const refs = [...(man.produces || []), ...(man.consumes || [])].map((x) => x.schema);
  const missingSchemas = refs.filter((r) => !schemaVersion(ROOT, r));
  rec(s, "every produced and consumed artifact names an existing schema", refs.length > 0 && !missingSchemas.length, missingSchemas.join(", "));
  rec(s, "compat.consumes lists exactly the consumed artifacts", JSON.stringify(Object.keys(man.compat?.consumes || {}).sort()) === JSON.stringify((man.consumes || []).map((c) => c.artifact).sort()));
  rec(s, "a preview template stays below 1.0.0 and a shipping one at 1.0.0 or above", man.status === "preview" ? /^0\./.test(man.version || "") : /^[1-9]/.test(man.version || ""));

  // Rubric arithmetic and identity
  const sum = (a) => a.reduce((x, y) => x + y, 0);
  rec(s, "rubric: 5 pillars x 20, 10 lines, weights sum 100, each pillar sums 20",
    rub.pillars?.length === 5 && rub.lines?.length === 10 && sum(rub.lines.map((l) => l.weight)) === 100 &&
    rub.pillars.every((p) => sum(rub.lines.filter((l) => l.pillar === p.name).map((l) => l.weight)) === 20));
  for (const [pn, p] of Object.entries(rub.profiles || {})) {
    const base = Object.fromEntries(rub.lines.map((l) => [l.id, l.weight]));
    const merged = { ...base, ...p.weights }, na = new Set(Object.keys(merged).filter((k) => merged[k] === 0)), rule = ruleWeights(rub, na);
    rec(s, `rubric profile ${pn} weights sum 100`, Math.abs(sum(Object.values(merged)) - 100) < 1e-3 && Object.keys(p.weights).every((k) => k in base));
    const followsRule = !!rule && Object.keys(merged).every((k) => Math.abs(merged[k] - rule[k]) < 1e-3);
    if (man.status === "preview" && !followsRule) rec(s, `rubric profile ${pn}: preview keeps its own weights (the not-applicable rule applies once it ships)`, typeof p.reason === "string" && p.reason.length > 20);
    else rec(s, `rubric profile ${pn} follows the not-applicable rule (docs/RUBRIC_GUIDE.md)`, followsRule, JSON.stringify(rule));
  }
  rec(s, "rubric line ids unique", new Set(rub.lines.map((l) => l.id)).size === rub.lines.length);
  rec(s, "rubric hash recomputes (spec/RUBRIC_HASH.md)", rubricHash(rub) === rub.hash, `${rub.hash} vs ${rubricHash(rub)}`);
  rec(s, "template.json rubric id, version, hash match RUBRIC.json", man.rubric.id === rub.id && man.rubric.version === rub.version && man.rubric.hash === rub.hash && man.id === rub.id);
  rec(s, "RUBRIC.md matches the generated rubric", exists(path.join(dir, "RUBRIC.md")) && fs.readFileSync(path.join(dir, "RUBRIC.md"), "utf8") === rubricMarkdown(man.name, rub));
  rec(s, "every automated gate names a negative fixture", rub.lines.filter((l) => l.automatedGate).every((l) => l.negativeFixture?.cmd));

  // Engine
  try {
    const { LENS } = await import(pathToFileURL(path.join(dir, "engine", "lens.mjs")).href + `?v=${Date.now()}`);
    rec(s, "engine rubric id, version, hash match RUBRIC.json", LENS.rubric.id === rub.id && LENS.rubric.version === rub.version && LENS.rubric.hash === rub.hash, `${LENS.rubric.id} ${LENS.rubric.version}`);
    rec(s, "every rubric line has a lens", rub.lines.every((l) => LENS.lines[l.id]));
    const kit = await import(pathToFileURL(path.join(dir, "engine", "lens-kit.mjs")).href);
    const good = readJson(path.join(dir, "fixtures", "good-pack.json"));
    const g = kit.grade(LENS, good);
    rec(s, "worked example grades and is labelled synthetic", g.verdict === "PASS" && good.synthetic === true && g.synthetic === true, `verdict ${g.verdict}`);
    const fx = kit.runFixtures(LENS, good);
    rec(s, "negative and missing-input fixtures behave", fx.status === "PASS", (fx.fails || []).join("; "));
    rec(s, "sample fields and release blockers match the hashed rubric",
      isDeepStrictEqual(LENS.rubric.sampleFields, rub.sampleFields || {}) &&
      isDeepStrictEqual(LENS.rubric.releaseBlockers, rub.releaseBlockers || []));
    rec(s, "case receipt rules match the hashed rubric", rub.lines.every(line =>
      isDeepStrictEqual(line.receipts, LENS.rubric.lines.find(embedded => embedded.id === line.id)?.receipts)));
    rec(s, "committed mutation fixtures match the lens spec", isDeepStrictEqual(readJson(path.join(dir, "fixtures/mutations.json")), kit.mutations(LENS, good)));
    for (const line of rub.lines.filter(l => l.automatedGate)) {
      const fixture = line.negativeFixture;
      const cwd = fixture?.cwd ? path.resolve(ROOT, fixture.cwd) : dir;
      const expected = `node tests/lens-negative-fixtures.mjs --line ${line.id}`;
      const valid = cwd === dir && fixture?.cmd === expected;
      const result = valid && spawnSync(process.execPath, ["tests/lens-negative-fixtures.mjs", "--line", line.id], { cwd, encoding: "utf8" });
      rec(s, `declared fixture runs: ${line.id}`, valid && result.status === 0, valid ? result.stdout || result.stderr : "invalid fixture command or working directory");
    }
    const bad = kit.grade(LENS, {});
    rec(s, "empty pack is refused (INVALID, grade null)", bad.verdict === "INVALID" && bad.grade == null);
  } catch (err) { rec(s, "engine loads", false, err.message); }
  const ownEngine = exists(sharedKit) && fs.readFileSync(sharedKit, "utf8") !== fs.readFileSync(path.join(dir, "engine", "lens-kit.mjs"), "utf8");
  if (man.status === "preview" && ownEngine) {
    const v = /KIT_VERSION = "([^"]+)"/.exec(fs.readFileSync(path.join(dir, "engine", "lens-kit.mjs"), "utf8"))?.[1];
    rec(s, `preview keeps its own vendored engine (lens-kit ${v}); moving to the shared engine is listed in its README`, !!v && /Status: preview, not shipping/.test(fs.readFileSync(path.join(dir, "README.md"), "utf8")));
  } else if (exists(sharedKit)) rec(s, "engine/lens-kit.mjs equals shared/lens-kit/lens-kit.mjs", !ownEngine);
  if (exists(sharedMemory)) rec(s, "engine/team-memory.mjs equals shared/team-memory/team-memory.mjs", exists(path.join(dir, "engine", "team-memory.mjs")) && fs.readFileSync(sharedMemory, "utf8") === fs.readFileSync(path.join(dir, "engine", "team-memory.mjs"), "utf8"));

  // Recipe and skills
  const desc = rcp.profile?.description || "";
  rec(s, "recipe credit in description", desc.includes(CREDIT) && desc.includes(CREDIT_URL));
  rec(s, "recipe states the 100-point rubric", /100-point rubric/.test(desc));
  const gs = rcp.gettingStarted?.skill;
  rec(s, "getting-started skill exists and matches template.json", gs && gs === man.gettingStarted && rcp.skills.some((k) => k.name === gs) && /-getting-started$/.test(gs));
  rec(s, "template.json skills list matches recipe", JSON.stringify(man.skills) === JSON.stringify(rcp.skills.map((k) => k.name)));
  rec(s, "template.json routines list matches recipe", JSON.stringify(man.routines) === JSON.stringify(rcp.routines.map((r) => r.slug)));
  const lensSkill = rcp.skills.find((k) => k.name.endsWith("-lens-engine"));
  rec(s, "a -lens-engine skill embeds the engine byte for byte", lensSkill && ["engine/lens-kit.mjs", "engine/lens.mjs", "engine/team-memory.mjs"].every((f) => exists(path.join(dir, f)) && lensSkill.content.includes(fs.readFileSync(path.join(dir, f), "utf8").trim())));
  const paths = rcp.skills.map(k => path.join(dir, "skills", k.name, "SKILL.md"));
  const headers = skillHeaders(paths.map(p => exists(p) ? fs.readFileSync(p, "utf8") : ""));
  for (const [index, k] of rcp.skills.entries()) {
    const p = path.join(dir, "skills", k.name, "SKILL.md");
    if (!exists(p)) { rec(s, `skill ${k.name}: SKILL.md on disk`, false, p); continue; }
    const md = fs.readFileSync(p, "utf8");
    const fm = headers[index];
    const okFm = fm && fm.name === k.name && fm.description === k.description && fm.description && fm.description.length >= 20 && !/^Workflow skill /.test(fm.description);
    rec(s, `skill ${k.name}: frontmatter name and real description`, okFm, JSON.stringify(fm));
    rec(s, `skill ${k.name}: SKILL.md equals recipe content`, md.trimEnd() === k.content.trimEnd());
    rec(s, `skill ${k.name}: installed draft and branch rules`, md.includes(draftRule) && md.includes(branchRule));
    rec(s, `skill ${k.name}: carries credit`, md.includes(CREDIT));
  }
  rec(s, "memory carries the audit contract", rcp.memory.some((m) => /AUDIT CONTRACT V1|Audit contract v1/i.test(m.content)));
  const howto = fs.readFileSync(path.join(dir, "HOW-TO-USE.md"), "utf8");
  rec(s, "HOW-TO-USE.md covers install options A, B and C", /Option A/.test(howto) && /Option B/.test(howto) && /Option C/.test(howto));
  rec(s, "HOW-TO-USE.md names the getting-started skill", howto.includes(gs));
  const prompts = fs.readFileSync(path.join(dir, "PROMPTS.md"), "utf8");
  rec(s, "PROMPTS.md has setup, routine and audit prompts", /## 1\. Setup/.test(prompts) && /## 2\. Routine/.test(prompts) && /## 3\. Audit/.test(prompts));

  for (const [where, content] of [
    ["memory", rcp.memory.map(m => m.content).join("\n")], ["manual memory", fs.readFileSync(path.join(dir, "MEMORY.md"), "utf8")],
    ["manual prompts", prompts], ...rcp.routines.map(r => [r.slug, r.content])
  ]) {
    rec(s, `${where}: installed human handoff and working branch rules`,
      (content.includes(draftRule) || content.includes("Only the human files or sends drafts.")) && content.includes(branchRule));
  }

  // House text rules across the folder
  const dash = [], local = [];
  for (const f of textFiles(dir)) { const t = fs.readFileSync(f, "utf8"); if (DASH.test(t)) dash.push(path.relative(dir, f)); if (LOCAL_PATH.test(t)) local.push(path.relative(dir, f)); }
  rec(s, "no em or en dashes in the folder", dash.length === 0, dash.join(", "));
  rec(s, "no local machine paths in the folder", local.length === 0, local.join(", "));
  return man;
}

const dirs = explicit.length ? explicit.map((d) => path.resolve(d)) : [
  ...fs.readdirSync(path.join(ROOT, "templates")).filter((d) => !d.startsWith(".")).map((d) => path.join(ROOT, "templates", d)),
  ...(exists(path.join(ROOT, "starter")) ? fs.readdirSync(path.join(ROOT, "starter")).filter((d) => fs.existsSync(path.join(ROOT, "starter", d, "template.json"))).map((d) => path.join(ROOT, "starter", d)) : []),
];
const mans = [];
for (const d of dirs) { const m = await validateTemplate(d); if (m) mans.push(m); }

if (!explicit.length) {
  const ids = mans.map((m) => m.id);
  rec("repo", "template ids unique", new Set(ids).size === ids.length);
  const cat = exists(path.join(ROOT, "TEMPLATES.md")) ? fs.readFileSync(path.join(ROOT, "TEMPLATES.md"), "utf8") : "";
  const tpl = mans.filter((m) => !m.slug.startsWith("00-"));
  const notListed = tpl.filter((m) => !cat.includes(`templates/${m.slug}/`));
  rec("repo", "TEMPLATES.md links every template", cat && notListed.length === 0, notListed.map((m) => m.slug).join(", "));
  for (const f of ["README.md", "INSTALL.md", "ADOPTING.md", "LICENSE", "docs/SKILL_FORMAT.md", "docs/RUBRIC_GUIDE.md", "spec/TEMPLATE_SPEC.md"]) rec("repo", `${f} present`, exists(path.join(ROOT, f)));
  const dash = [];
  for (const f of textFiles(ROOT)) if (DASH.test(fs.readFileSync(f, "utf8"))) dash.push(path.relative(ROOT, f));
  rec("repo", "no em or en dashes anywhere in the repo", dash.length === 0, dash.join(", "));
}

const failed = results.filter((r) => !r.ok);
if (json) console.log(JSON.stringify({ checks: results.length, failed: failed.length, results }, null, 1));
else {
  const by = {};
  for (const r of results) (by[r.scope] ||= []).push(r);
  for (const [k, v] of Object.entries(by)) {
    const f = v.filter((x) => !x.ok);
    console.log(`${f.length ? "FAIL" : "PASS"} ${k} (${v.length - f.length}/${v.length})`);
    for (const x of f) console.log(`   x ${x.name}${x.detail ? ": " + x.detail : ""}`);
  }
  console.log(`\nvalidate: ${dirs.length} template folder(s), ${results.length} checks, ${failed.length} failed -> ${failed.length ? "FAIL" : "PASS"}`);
}
process.exit(failed.length ? 1 : 0);
