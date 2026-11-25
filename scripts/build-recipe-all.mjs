#!/usr/bin/env node
// Rebuilds every template's recipe after a team map change. Created by @meta_alchemist (https://x.com/meta_alchemist).
// Shipping templates and the starter use build-recipe.mjs; preview templates with their own engine use build-preview-recipe.mjs.
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { templateDirs } from "./lib/team.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
let failed = 0;
for (const dir of templateDirs(ROOT)) {
  const own = fs.existsSync(path.join(dir, "engine", "ENGINE.json")) && JSON.parse(fs.readFileSync(path.join(dir, "engine", "ENGINE.json"), "utf8")).domain;
  const script = own ? "build-preview-recipe.mjs" : "build-recipe.mjs";
  const r = spawnSync(process.execPath, [path.join(ROOT, "scripts", script), dir], { encoding: "utf8" });
  process.stdout.write(r.stdout); process.stderr.write(r.stderr);
  if (r.status) failed++;
}
process.exit(failed ? 1 : 0);
