#!/usr/bin/env node
// Rebuilds a preview template's recipe.json from its skills and bundled source files.
// Created by @meta_alchemist (https://x.com/meta_alchemist). Node 18+, no dependencies.
// Preview templates (status "preview") keep their own engine and domain scripts. Each skill whose name ends in
// -lens-engine embeds the files listed under "embed" and "contract" in engine/ENGINE.json; each -domain-engine
// skill embeds the "domain" files. Everything after "## Bundled files" in those skills is regenerated.
// Usage: node scripts/build-preview-recipe.mjs <template-dir>
import fs from "node:fs";
import path from "node:path";

const dir = path.resolve(process.argv[2] || "");
if (!process.argv[2] || !fs.existsSync(path.join(dir, "recipe.json")) || !fs.existsSync(path.join(dir, "engine", "ENGINE.json"))) {
  console.error("usage: node scripts/build-preview-recipe.mjs <preview-template-dir>");
  process.exit(2);
}
const read = (p) => fs.readFileSync(path.join(dir, p), "utf8");
const recipe = JSON.parse(read("recipe.json"));
const engine = JSON.parse(read("engine/ENGINE.json"));
const MARKER = "\n## Bundled files\n";

for (const skill of recipe.skills) {
  const file = path.join(dir, "skills", skill.name, "SKILL.md");
  let text = fs.readFileSync(file, "utf8").split(MARKER)[0].trimEnd() + "\n";
  const paths = skill.name.endsWith("-lens-engine") ? [...engine.embed, ...engine.contract]
    : skill.name.endsWith("-domain-engine") ? engine.domain : [];
  if (paths.length) {
    text += MARKER;
    for (const rel of paths) text += `\n### ${rel}\n\n\`\`\`\n${read(rel).replace(/\n+$/, "")}\n\`\`\`\n`;
  }
  fs.writeFileSync(file, text);
  skill.content = text;
  const line = text.split(/\r?\n/).find((l) => l.startsWith("description: "));
  skill.description = JSON.parse(line.slice("description: ".length));
}
fs.writeFileSync(path.join(dir, "recipe.json"), JSON.stringify(recipe, null, 2) + "\n");
console.log(`built preview ${path.basename(dir)}: ${recipe.skills.length} skills`);
