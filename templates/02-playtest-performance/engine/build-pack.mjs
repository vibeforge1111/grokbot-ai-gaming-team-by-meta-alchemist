// Created by @meta_alchemist (https://x.com/meta_alchemist).
// Assemble a playtest evidence pack from owner-supplied journey and frame files, and write a producer receipt.
// Usage: node engine/build-pack.mjs <intake-dir> [--out <dir>] [--synthetic]
// Intake: profile.json plus opening.json, core.json, scenarios.json, stability.json,
// performance.json, coverage.json, identity.json (metric groups). Or a single pack.json to stamp a receipt.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { writeEvidencePack } from "./write-pack.mjs";

function readJson(dir, name) {
  const p = path.join(dir, name);
  return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, "utf8")) : null;
}

export function buildPack(intakeDir, options = {}) {
  if (fs.existsSync(intakeDir) && fs.statSync(intakeDir).isFile()) {
    const readyFile = JSON.parse(fs.readFileSync(intakeDir, "utf8"));
    intakeDir = path.dirname(intakeDir);
    if (readyFile?.metrics && readyFile?.artifacts) {
      const pack = { ...readyFile, synthetic: options.synthetic === true ? true : readyFile.synthetic === true };
      if (options.packId) pack.packId = options.packId;
      if (options.gitSha) pack.gitSha = options.gitSha;
      if (options.liveSha) pack.liveSha = options.liveSha;
      pack.artifacts = (pack.artifacts || []).map((a) => {
        if (a.body || (a.path && fs.existsSync(path.join(intakeDir, a.path)))) return { ...a };
        const file = path.join(intakeDir, "artifacts", `${a.id}.json`);
        if (fs.existsSync(file)) return { ...a, path: a.path || `artifacts/${a.id}.json`, body: JSON.parse(fs.readFileSync(file, "utf8")) };
        return { ...a, path: a.path || `artifacts/${a.id}.json`, body: { id: a.id } };
      });
      return pack;
    }
  }
  const ready = readJson(intakeDir, "pack.json") || readJson(intakeDir, "good-pack.json");
  if (ready?.metrics && ready?.artifacts) {
    const pack = { ...ready, synthetic: options.synthetic === true ? true : ready.synthetic === true };
    if (options.packId) pack.packId = options.packId;
    if (options.gitSha) pack.gitSha = options.gitSha;
    if (options.liveSha) pack.liveSha = options.liveSha;
    pack.artifacts = (pack.artifacts || []).map((a) => {
      if (a.body || (a.path && fs.existsSync(path.join(intakeDir, a.path)))) return { ...a };
      const file = path.join(intakeDir, "artifacts", `${a.id}.json`);
      if (fs.existsSync(file)) return { ...a, path: a.path || `artifacts/${a.id}.json`, body: JSON.parse(fs.readFileSync(file, "utf8")) };
      return { ...a, path: a.path || `artifacts/${a.id}.json`, body: { id: a.id } };
    });
    return pack;
  }
  const profile = readJson(intakeDir, "profile.json");
  if (!profile) throw new Error("Supply profile.json, or a pack.json to stamp");
  const groups = {
    opening: "capture", core: "trace", scenarios: "trace", stability: "trace",
    performance: "trace", coverage: "static", identity: "static",
  };
  const metrics = {};
  const artifacts = [];
  for (const [group, kind] of Object.entries(groups)) {
    const body = readJson(intakeDir, `${group}.json`);
    if (!body) continue;
    const id = `art-${group}`;
    artifacts.push({ id, kind, path: `artifacts/${group}.json`, body });
    metrics[group] = { ...body, artifact: body.artifact || id };
  }
  return {
    packId: options.packId || profile.packId || "playtest-intake",
    status: "VALID",
    synthetic: options.synthetic === true,
    gitSha: options.gitSha || profile.gitSha,
    liveSha: options.liveSha || profile.liveSha,
    profile,
    artifacts,
    metrics,
  };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const takes = new Set(["--out", "--pack-id", "--git-sha", "--live-sha"]);
  const intake = args.find((a, i) => !a.startsWith("--") && !takes.has(args[i-1]));
  if (!intake) {
    console.error("usage: node engine/build-pack.mjs <intake-dir> [--out <dir>] [--synthetic] [--pack-id <id>] [--git-sha <sha>] [--live-sha <sha>]");
    process.exit(2);
  }
  const value = (k) => (args.includes(k) ? args[args.indexOf(k) + 1] : undefined);
  const pack = buildPack(intake, {
    synthetic: args.includes("--synthetic"),
    packId: value("--pack-id"),
    gitSha: value("--git-sha"),
    liveSha: value("--live-sha"),
  });
  const out = value("--out");
  if (out) {
    console.log(JSON.stringify(writeEvidencePack(out, pack, {
      producer: "gbf-02-playtest-performance",
      profileId: pack.profile?.profileId || pack.packId,
      device: pack.profile?.device || "playtest-export",
      hook: "journey-and-frames",
      gameplayArtifact: (pack.artifacts.find((a) => a.kind === "trace" || a.kind === "capture") || pack.artifacts[0]).id,
    }), null, 2));
  } else console.log(JSON.stringify(pack, null, 2));
}
