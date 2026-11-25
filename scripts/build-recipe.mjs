#!/usr/bin/env node
// Builds a template from its source files. Created by @meta_alchemist (https://x.com/meta_alchemist).
// Reads:  RUBRIC.json, engine/lens.spec.json, profile.json, memory.json, routines.json, skills/*/SKILL.md, fixtures/good-pack.json
// Writes: RUBRIC.json (hash), RUBRIC.md, engine/lens.mjs, engine/lens-kit.mjs, engine/team-memory.mjs, engine/ENGINE.json, the -lens-engine skill,
//         recipe.json, template.json (rubric, skills, routines), and MEMORY.md.
// Usage:  node scripts/build-recipe.mjs <template-dir>
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { skillHeaders } from "./lib/skill-headers.mjs";
import { rubricMarkdown } from "./lib/rubric-markdown.mjs";
import { draftRule, branchRule } from "./lib/installed-rules.mjs";
import { mutations } from "../shared/lens-kit/lens-kit.mjs";
import { rubricHash } from "./lib/hash.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const dir = path.resolve(process.argv[2] || "");
if (!process.argv[2] || !fs.existsSync(path.join(dir, "template.json"))) {
  console.error("usage: node scripts/build-recipe.mjs <template-dir>");
  process.exit(2);
}
const CREDIT = "Created by @meta_alchemist (https://x.com/meta_alchemist).";
const rd = (p) => fs.readFileSync(path.join(dir, p), "utf8");
const rj = (p) => JSON.parse(rd(p));
const wr = (p, s) => { fs.mkdirSync(path.dirname(path.join(dir, p)), { recursive: true }); fs.writeFileSync(path.join(dir, p), s.endsWith("\n") ? s : s + "\n"); };

const man = rj("template.json");
const scaffold = fs.existsSync(path.join(dir, "engine/lens.spec.json"));
const sources = scaffold ? { profile: rj("profile.json"), memory: rj("memory.json"), routines: rj("routines.json") } : rj("recipe.json");
const { profile, memory, routines } = sources;
const spec = scaffold ? rj("engine/lens.spec.json") : (await import(pathToFileURL(path.join(dir, "engine/lens.mjs")))).LENS;
const rubric = rj("RUBRIC.json");
const lensSkill = man.gettingStarted.replace(/-getting-started$/, "-lens-engine");
const lensDescription = `Use before the first grade: write the ${man.name} engine files to disk byte for byte, then run them.`;
const names = fs.readdirSync(path.join(dir, "skills")).filter(n => n !== lensSkill && fs.existsSync(path.join(dir, "skills", n, "SKILL.md")));
// Both installs ship the same entry-scene method. Keep the local contract and routing header.
const bodies = names.map(name => {
  const file = `skills/${name}/SKILL.md`;
  // Optional portable tools in an authored skill use marked blocks. Refresh them from files in this template.
  let content = rd(file).replace(/<!-- embed ((?:engine|fixtures)\/[a-z0-9-]+\.(?:mjs|json|md)) -->[\s\S]*?<!-- end embed -->/g, (_, source) => {
    const fence = source.endsWith(".mjs") ? "```js" : source.endsWith(".json") ? "```json" : "```markdown";
    return [`<!-- embed ${source} -->`, fence, rd(source).trimEnd(), "```", "<!-- end embed -->"].join("\n");
  });
  if (content !== rd(file)) wr(file, content);
  if (name === "entry-scene-optional-interactions" && man.slug === "11-environment-design") {
    const canonical = path.join(ROOT, "templates/03-prop-rig", file);
    if (fs.existsSync(canonical)) {
      const body = fs.readFileSync(canonical, "utf8").match(/^# Make an interactive entry scene[\s\S]*$/m);
      if (!body) throw new Error("shared entry-scene method has no heading");
      content = content.replace(/^# Make an interactive entry scene[\s\S]*$/m, () => body[0]);
      wr(file, content);
    }
  }
  return content;
});
const headers = skillHeaders(bodies);
const authored = new Map(names.map((name, i) => {
  if (headers[i].name !== name) throw new Error(`${name}: ${headers[i].error ?? "frontmatter name mismatch"}`);
  return [name, { name, description: headers[i].description, content: bodies[i] }];
}));
names.push(lensSkill);
if (scaffold) names.sort((a, b) => a === man.gettingStarted ? -1 : b === man.gettingStarted ? 1 : a === lensSkill ? 1 : b === lensSkill ? -1 : a.localeCompare(b));
else names.sort((a, b) => man.skills.indexOf(a) - man.skills.indexOf(b));
rubric.hash = rubricHash(rubric);
wr("RUBRIC.json", JSON.stringify(rubric, null, 2));

wr("RUBRIC.md", rubricMarkdown(man.name, rubric));

// engine/lens.mjs from the spec plus the rubric
const LENS = { lensVersion: spec.lensVersion || "1.0.0",
  rubric: { id: rubric.id, version: rubric.version, hash: rubric.hash, sampleFields: rubric.sampleFields || {}, releaseBlockers: rubric.releaseBlockers || [], ...(rubric.receiptPolicy ? { receiptPolicy: rubric.receiptPolicy, receiptFields: rubric.receiptFields || [] } : {}), lines: rubric.lines.map((l) => ({ ...(l.receipts ? { receipts: l.receipts } : {}), id: l.id, weight: l.weight, passAt: l.passAt, evidence: l.evidence, name: l.name, level4: l.anchors["4"], level0: l.anchors["0"] })), ...(rubric.profiles ? { profiles: rubric.profiles } : {}) },
  // A rubric line may carry its own conditions and case-row binding; they replace the spec's conditions for that line.
  lines: rubric.lines.some((l) => l.conditions) ? Object.fromEntries(rubric.lines.map((line) => {
    const source = spec.lines[line.id];
    if (!source) throw new Error(`missing lens for ${line.id}`);
    return [line.id, line.conditions ? { ...source, conds: line.conditions, ...(line.rowBinding ? { rowBinding: line.rowBinding } : {}) } : source];
  })) : spec.lines, checks: spec.checks || {}, ...(spec.applicability ? { applicability: spec.applicability } : {}) };
const lens = `// ${man.name} lens ${LENS.lensVersion} for rubric ${rubric.id} v${rubric.version}. ${CREDIT}\n// Data-only spec evaluated by lens-kit.mjs. Run: node engine/lens.mjs <pack.json>   (or --meta)\nimport { cli } from "./lens-kit.mjs";\nexport const LENS = ${JSON.stringify(LENS)};\ncli(LENS, import.meta.url);\n`;
wr("engine/lens.mjs", lens);
const kit = fs.readFileSync(path.join(ROOT, "shared", "lens-kit", "lens-kit.mjs"), "utf8");
wr("engine/lens-kit.mjs", kit);
const teamMemory = fs.readFileSync(path.join(ROOT, "shared", "team-memory", "team-memory.mjs"), "utf8");
wr("engine/team-memory.mjs", teamMemory);
wr("engine/ENGINE.json", JSON.stringify({ cmd: ["node", "engine/lens.mjs"], meta: ["node", "engine/lens.mjs", "--meta"], embed: ["engine/lens-kit.mjs", "engine/lens.mjs", "engine/team-memory.mjs"] }, null, 1));

const good = rd("fixtures/good-pack.json");
wr("fixtures/mutations.json", JSON.stringify(mutations(LENS, JSON.parse(good)), null, 1));
const liveInstructions = "For a real pack set synthetic to false. Store artifact files under the pack directory with relative paths and bare hexadecimal SHA-256 digests. Include producerReceipt with schema game-evidence-v1, producer, profileId, packId, gitSha, liveSha, device, hook and gameplayArtifact (a capture or trace ID). Include artifactsSha256 for the artifact list, profileSha256 for the effective profile and observationsSha256 for the array [metrics, receipts, judgements, populations, openP0], using an empty object for absent collections and zero for an absent openP0. Hash compact UTF-8 JSON with object keys sorted recursively and array order preserved. The human verifies the producer and approves the profile before accepting a real grade.";
// A template whose memory carries its own full audit contract repeats it in every skill, including this one.
const contractFact = memory.find((m) => /^Audit contract v1 \(/.test(m.content))?.content;
const lensMd = `---\nname: ${lensSkill}\ndescription: ${JSON.stringify(lensDescription)}\n---\n\n> ${CREDIT}\n> ${contractFact ?? `${draftRule} ${branchRule}`}\n\n# ${man.name}: lens engine\n\nWrite these four files exactly as shown (Node 18+, no dependencies), then run \`node engine/lens.mjs fixtures/good-pack.json\`. \`engine/team-memory.mjs\` is the shared team memory helper described in the getting-started skill; it is the same file in every template.\n\nRun \`node engine/lens.mjs --meta\` for weights, metric fields and required populations. Record skipped captures as NOT_RUN.\n\n${liveInstructions}\n\n## engine/lens-kit.mjs\n\n\`\`\`js\n${kit.trim()}\n\`\`\`\n\n## engine/lens.mjs\n\n\`\`\`js\n${lens.trim()}\n\`\`\`\n\n## engine/team-memory.mjs\n\n\`\`\`js\n${teamMemory.trim()}\n\`\`\`\n\n## fixtures/good-pack.json (synthetic)\n\n\`\`\`json\n${good.trim()}\n\`\`\`\n`;
wr(`skills/${lensSkill}/SKILL.md`, lensMd);

// recipe.json from the skills on disk (getting-started first, lens engine last)
const skills = names.map(name => name === lensSkill
  ? { name, description: lensDescription, content: lensMd }
  : authored.get(name));
const recipe = { version: 1, visibility: "public", ...(scaffold ? {} : sources), profile, gettingStarted: { skill: man.gettingStarted }, skills, memory, routines, plugins: sources.plugins || [] };
wr("recipe.json", JSON.stringify(recipe, null, 1));

man.skills = skills.map((s) => s.name);
man.routines = routines.map((r) => r.slug);
man.rubric = { path: "RUBRIC.json", id: rubric.id, version: rubric.version, hash: rubric.hash };
wr("template.json", JSON.stringify(man, null, 2));
wr("MEMORY.md", [`# ${man.name}: memory facts`, "", CREDIT, "", "Each bullet is one memory fact. For manual setup, paste each one and ask the bot to remember it.", "", ...memory.map((m) => `- (${m.kind}) ${m.content}\n`)].join("\n"));
console.log(`built ${path.relative(ROOT, dir)}: ${skills.length} skills, rubric ${rubric.id} v${rubric.version} ${rubric.hash.slice(0, 19)}...`);
