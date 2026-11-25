#!/usr/bin/env node
// Grades every Pixel Pantry pack with the kit's engines and writes grades/ and grades/SUMMARY.json.
// --check compares a fresh run with the saved grades. Created by @meta_alchemist (https://x.com/meta_alchemist).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { grade } from "../../shared/lens-kit/lens-kit.mjs";
import { LENS as hud } from "../../templates/09-hud-designer/engine/lens.mjs";
import { LENS as bugDesk } from "../../templates/18-bug-desk-triage/engine/lens.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const engines = new Map([["09-hud-designer", hud], ["18-bug-desk-triage", bugDesk]]);
const check = process.argv.includes("--check");
const summary = [];
let drift = 0;
for (const f of fs.readdirSync(path.join(HERE, "packs")).sort()) {
  const slug = f.split(".")[0];
  const LENS = engines.get(slug);
  if (!LENS) throw new Error(`Unexpected Pixel Pantry pack: ${f}`);
  const pack = JSON.parse(fs.readFileSync(path.join(HERE, "packs", f), "utf8"));
  const rec = grade(LENS, pack);
  const out = path.join(HERE, "grades", f.replace(".json", ".grade.json"));
  const txt = JSON.stringify(rec, null, 1) + "\n";
  if (check) { if (!fs.existsSync(out) || fs.readFileSync(out, "utf8") !== txt) { drift++; console.log(`DRIFT ${f}`); } }
  else { fs.mkdirSync(path.dirname(out), { recursive: true }); fs.writeFileSync(out, txt); }
  summary.push({ pack: f, template: rec.templateId, build: f.split(".").slice(1, 4).join("."), verdict: rec.verdict, grade: rec.grade, coverage: rec.coverage,
    belowPass: rec.lines.filter((l) => typeof l.level === "number" && l.level < 3).map((l) => `${l.id}=${l.level}`),
    unmeasured: rec.lines.filter((l) => l.level === "U").map((l) => l.id) });
}
const stxt = JSON.stringify(summary, null, 1) + "\n";
if (check) { if (fs.readFileSync(path.join(HERE, "grades", "SUMMARY.json"), "utf8") !== stxt) { drift++; console.log("DRIFT SUMMARY.json"); } }
else fs.writeFileSync(path.join(HERE, "grades", "SUMMARY.json"), stxt);
for (const s of summary) console.log(`${s.pack.padEnd(32)} ${s.verdict.padEnd(12)} ${String(s.grade).padStart(6)}/100  coverage ${s.coverage}  below pass: ${s.belowPass.join(", ") || "none"}  U: ${s.unmeasured.join(", ") || "none"}`);
if (check) { console.log(drift ? `example check: ${drift} drift -> FAIL` : "example check: grades reproduce -> PASS"); process.exit(drift ? 1 : 0); }
