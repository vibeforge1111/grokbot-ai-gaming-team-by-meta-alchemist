#!/usr/bin/env node
// Scaffold from the shipped starter so new installs inherit its tested instructions. Created by @meta_alchemist.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { skillHeaders } from "./lib/skill-headers.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const source = path.join(root, "starter/00-starter-template");
const args = process.argv.slice(2);
const option = key => args.includes(key) ? args[args.indexOf(key) + 1] : undefined;
const id = option("--id"), name = option("--name");
if (!id || !/^[a-z0-9]+-[0-9]{2}-[a-z0-9-]+$/.test(id) || !name?.trim()) {
  console.error('usage: node scripts/new-template.mjs --id <prefix>-<NN>-<slug> --name "<Name>" [--dir <folder>]');
  process.exit(2);
}
const [, number, ...parts] = id.split("-");
const slug = parts.join("-");
const dir = path.resolve(option("--dir") || path.join(root, "templates", number + "-" + slug));
if (dir === source || (fs.existsSync(path.join(dir, "template.json")) && !args.includes("--force"))) {
  console.error("Select a fresh destination or use --force for an existing scaffold.");
  process.exit(1);
}
const replacements = {
  "starter/00-starter-template": path.relative(root, dir),
  "kit-00-starter-template": id,
  "00-starter-template": path.basename(dir),
  "starter-template": slug,
  "First Session Director (starter)": name,
};
const adapt = text => text.replace(/starter\/00-starter-template|kit-00-starter-template|00-starter-template|starter-template|First Session Director \(starter\)/g, key => replacements[key]);
function write(file, contents) {
  const to = path.join(dir, adapt(file));
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.writeFileSync(to, contents);
}
for (const file of ["template.json", "RUBRIC.json", "profile.json", "memory.json", "routines.json", "engine/lens.spec.json", "fixtures/good-pack.json"]) {
  const parsed = JSON.parse(fs.readFileSync(path.join(source, file)), (_, v) => typeof v === "string" ? adapt(v) : v);
  // A new template starts as a preview at 0.1.0 and reaches 1.0.0 when it meets the release standard.
  if (file === "template.json") Object.assign(parsed, { shortName: name, version: "0.1.0", status: "preview" });
  write(file, JSON.stringify(parsed, null, 2) + "\n");
}
const today = new Date().toISOString().slice(0, 10);
write("CHANGELOG.md", ["# Changelog", "", `All notable changes to ${name} (\`${id}\`) are recorded here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and versions follow [Semantic Versioning](https://semver.org/spec/v2.0.0.html).`, "",
  "Created by @meta_alchemist (https://x.com/meta_alchemist).", "", "## [Unreleased]", "", `## [0.1.0] - ${today}`, "", "### Added", "", `- First preview of ${name}, scaffolded from the kit starter.`, ""].join("\n"));
for (const file of ["README.md", "HOW-TO-USE.md", "PROMPTS.md", "tests/test-lens-contract.mjs", "tests/lens-negative-fixtures.mjs"]) {
  write(file, adapt(fs.readFileSync(path.join(source, file), "utf8")));
}
for (const skill of fs.readdirSync(path.join(source, "skills")).filter(s => !s.endsWith("-lens-engine"))) {
  const file = `skills/${skill}/SKILL.md`;
  const text = fs.readFileSync(path.join(source, file), "utf8");
  const [header] = skillHeaders([text]);
  const body = text.replace(/^---\n[\s\S]*?\n---\n/, "");
  write(file, `---\nname: ${adapt(header.name)}\ndescription: ${JSON.stringify(adapt(header.description))}\n---\n${adapt(body)}`);
}
execFileSync(process.execPath, [path.join(root, "scripts/build-recipe.mjs"), dir], { stdio: "inherit" });
