// Validator tests: the repo passes, and each broken copy fails for the right reason. Created by @meta_alchemist (https://x.com/meta_alchemist).
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const run = (args) => spawnSync(process.execPath, [path.join(ROOT, "scripts", "validate.mjs"), ...args], { encoding: "utf8" });

test("the whole repo validates", () => {
  const r = run([]);
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.match(r.stdout, /-> PASS/);
});

function brokenCopy(mutate) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "kit-"));
  for (const d of ["spec", "scripts", "shared"]) fs.cpSync(path.join(ROOT, d), path.join(tmp, d), { recursive: true });
  const t = path.join(tmp, "templates", "18-bug-desk-triage");
  fs.cpSync(path.join(ROOT, "templates", "18-bug-desk-triage"), t, { recursive: true });
  mutate(t);
  return { tmp, t };
}
const cases = [
  ["invalid YAML description with an unquoted colon", t => {
    const file = path.join(t, "skills/duplicate-report-grouping/SKILL.md");
    fs.writeFileSync(file, fs.readFileSync(file, "utf8").replace(/^description: .*$/m, "description: Make a draft: preserve the source"));
  }, /frontmatter name and real description/],
  ["rubric Markdown drift despite a correct hash", t => fs.appendFileSync(path.join(t, "RUBRIC.md"), "Edited anchor"), /RUBRIC.md matches the generated rubric/],
  ["installed routine skips branch and draft rules", t => {
    const file = path.join(t, "recipe.json"), recipe = JSON.parse(fs.readFileSync(file));
    recipe.routines[0].content = "Review the newest pack.";
    fs.writeFileSync(file, JSON.stringify(recipe));
  }, /weekly-grade: installed human handoff/],
  ["tampered rubric weight breaks the hash", (t) => { const p = path.join(t, "RUBRIC.json"), r = JSON.parse(fs.readFileSync(p)); r.lines[0].anchors["4"] += " (edited)"; fs.writeFileSync(p, JSON.stringify(r, null, 2)); }, /rubric hash recomputes/],
  ["missing getting-started skill", (t) => { const p = path.join(t, "recipe.json"), r = JSON.parse(fs.readFileSync(p)); r.gettingStarted.skill = "nope-getting-started"; fs.writeFileSync(p, JSON.stringify(r)); }, /getting-started skill exists/],
  ["an em dash in a skill", (t) => { const p = path.join(t, "skills", "duplicate-report-grouping", "SKILL.md"); fs.appendFileSync(p, "\nA note \u2014 with a dash.\n"); }, /no em or en dashes|SKILL\.md equals recipe content/],
  ["SKILL.md deleted from disk", (t) => fs.rmSync(path.join(t, "skills", "duplicate-report-grouping"), { recursive: true }), /SKILL\.md on disk/],
  ["local path leaked into README", (t) => fs.appendFileSync(path.join(t, "README.md"), "\nSee " + ["", "home", "someone", "game"].join("/") + " for details.\n"), /no local machine paths/],
  ["placeholder skill description", (t) => { const p = path.join(t, "skills", "duplicate-report-grouping", "SKILL.md"); fs.writeFileSync(p, fs.readFileSync(p, "utf8").replace(/^description: .*$/m, 'description: "Workflow skill duplicate-report-grouping"')); }, /frontmatter name and real description/],
  ["engine lens-kit drifts from the shared copy", (t) => fs.appendFileSync(path.join(t, "engine", "lens-kit.mjs"), "\n// drift\n"), /equals shared\/lens-kit/],
  ["HOW-TO-USE without option C", (t) => { const p = path.join(t, "HOW-TO-USE.md"); fs.writeFileSync(p, fs.readFileSync(p, "utf8").replace(/Option C/g, "Option X")); }, /options A, B and C/],
  ["share link with a wrong scheme", (t) => { const p = path.join(t, "template.json"), m = JSON.parse(fs.readFileSync(p)); m.install.grokBotShareLink = "https://example.com/x"; fs.writeFileSync(p, JSON.stringify(m)); }, /template\.json matches/],
];
for (const [name, mutate, expect] of cases) {
  test(`fails on: ${name}`, () => {
    const { tmp, t } = brokenCopy(mutate);
    const r = run(["--root", tmp, t]);
    assert.equal(r.status, 1, `expected failure\n${r.stdout}`);
    assert.match(r.stdout, expect);
    fs.rmSync(tmp, { recursive: true, force: true });
  });
}

test("skill YAML preserves quoted colons and folded or literal multiline text", async () => {
  const { skillHeaders } = await import("../scripts/lib/skill-headers.mjs");
  const header = value => "---\r\nname: demo\r\ndescription: " + value + "\r\n---\r\n";
  const parsed = skillHeaders([header("'A label: it''s valid'"), header('>-\n  first line:\n  second line'), header('|-\n  first\n  second'), header('"unterminated'), header('first\nname: duplicate')]);
  assert.deepEqual(parsed.slice(0, 3).map(f => f.description), ["A label: it's valid", "first line: second line", "first\nsecond"]);
  assert.ok(parsed[3].error && parsed[4].error);
});

test("Node skill frontmatter rejects malformed mappings and preserves scalar content", async () => {
  const { skillHeaders } = await import("../scripts/lib/skill-headers.mjs");
  const header = mapping => "---\nname: sample\n" + mapping + "\n---\n";
  const invalid = ["description: text: nested", "description: 'broken", 'description: "ok" tail',
    "description: value\n'name': duplicate", "description: true", "description: [value]", "description: &value alias"];
  for (const entry of invalid) assert.ok(skillHeaders([header(entry)])[0].error, entry);
  const valid = [
    ["description: https://example.com/path # comment", "https://example.com/path"],
    ["description: 'it''s a label: yes'", "it's a label: yes"],
    ['description: "first: second"', "first: second"],
    ["description: >-\n  first\n  paragraph\n\n  second", "first paragraph\nsecond"],
    ["description: |\n  text: literal # kept", "text: literal # kept\n"],
    ["description: a plain\n  continuation", "a plain continuation"]
  ];
  for (const [input, result] of valid) assert.equal(skillHeaders([header(input)])[0].description, result);
});
