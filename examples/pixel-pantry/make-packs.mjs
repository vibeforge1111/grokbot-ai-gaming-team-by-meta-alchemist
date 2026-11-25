#!/usr/bin/env node
// Builds the synthetic Pixel Pantry packs. Created by @meta_alchemist (https://x.com/meta_alchemist).
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const here = path.dirname(fileURLToPath(import.meta.url));
const read = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const evidence = read(path.join(here, "evidence.json"));
const states = ["take-order", "prepare-recipe", "serve", "results"];
const templates = ["09-hud-designer", "18-bug-desk-triage"];
const check = process.argv.includes("--check");

if (!check) fs.mkdirSync(path.join(here, "packs"), { recursive: true });
for (const [build, observation] of Object.entries(evidence.builds)) {
  for (const slug of templates) {
    const pack = read(path.join(here, "../../templates", slug, "fixtures/good-pack.json"));
    const buildId = build.split(".").join("");
    pack.packId = `pixel-pantry-${slug.slice(0, 2)}-${build}`;
    pack.gitSha = `pp-${buildId}-git`;
    pack.liveSha = `pp-${buildId}-live`;
    pack.synthetic = true;
    for (const rows of Object.values(pack.receipts)) for (const row of rows) row.liveSha = pack.liveSha;
    if (slug === "09-hud-designer") {
      pack.note = "Synthetic CI screenshot samples and manual button measurements. Other metrics illustrate the HUD fixture.";
      pack.profile.states = states;
      pack.metrics.priority.statesCaptured = states;
      for (const [i, target] of pack.profile.cases.elementContrast.entries()) {
        const row = pack.receipts.elementContrast[i];
        const state = states[i % states.length];
        target.state = row.state = state;
        if (row.element === "text") [row.foreground, row.background] = observation.timerColors;
      }
      pack.metrics.contrast.pairs = [observation.timerColors];
      pack.metrics.touch.targetPx = observation.recipeButtonWidthsPx;
    } else {
      pack.note = "Synthetic manual issue review. Other metrics illustrate the Bug Desk fixture.";
      pack.profile.p0Scopes = ["saved-state", "crash"];
      pack.metrics.severity.tickets[0].scope = "saved-state";
      pack.metrics.severity.p0ScopesUsed = ["saved-state"];
      for (const snapshot of Object.values(pack.populations)) snapshot.liveSha = pack.liveSha;
      pack.populations.closureReview.count = 1;
      const ticket = "B-1";
      pack.metrics.closure.closures = [{ ticket, fixer: observation.fixer, verifier: observation.verifier, rawArtifacts: true }];
      pack.profile.cases.closureReview = pack.profile.cases.closureReview.filter(c => c.ticket === ticket);
      pack.receipts.closureReview = pack.receipts.closureReview.filter(row => row.ticket === ticket);
      Object.assign(pack.receipts.closureReview[0], { fixer: observation.fixer, verifier: observation.verifier, fixedBuild: pack.liveSha });
      Object.assign(pack.receipts.buildLag[0], { source: pack.gitSha, live: pack.liveSha, sourceHistory: [pack.liveSha, pack.gitSha] });
    }
    const file = path.join(here, "packs", `${slug}.${build}.json`);
    const contents = JSON.stringify(pack, null, 1) + "\n";
    if (check) {
      if (!fs.existsSync(file) || fs.readFileSync(file, "utf8") !== contents) {
        console.error(`Pack differs from the evidence and fixture: ${path.basename(file)}`);
        process.exitCode = 1;
      }
    } else {
      fs.writeFileSync(file, contents);
      console.log(path.basename(file));
    }
  }
}
