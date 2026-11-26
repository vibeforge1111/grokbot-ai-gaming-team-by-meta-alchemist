#!/usr/bin/env node
// Created by @meta_alchemist (https://x.com/meta_alchemist).
// Turns saved aggregate count snapshots into an evidence pack. It reads files; it never calls the game.
// Counts alone have no human and bot split, no hours and no waits, so those lines stay UNMEASURED.
// Usage: node mm/import-counts.mjs snapshots.json --profile profile.json --pack-id <id> --git-sha <sha> --live-sha <sha> [--audit audit.json] [--out <dir>]
import fs from "node:fs";
import { checkSchema } from "./fill.mjs";
import { writeEvidencePack } from "../engine/write-pack.mjs";
const a = process.argv.slice(2), get = (k) => (a.includes(k) ? a[a.indexOf(k) + 1] : null);
if (!a[0] || a[0].startsWith("--")) { console.error("usage: node mm/import-counts.mjs snapshots.json --profile profile.json --pack-id <id> --git-sha <sha> --live-sha <sha> [--audit audit.json] [--out <dir>]"); process.exit(2); }
const snaps = JSON.parse(fs.readFileSync(a[0], "utf8"));
const profile = get("--profile") ? JSON.parse(fs.readFileSync(get("--profile"), "utf8")) : {};
const regions = [...new Set(snaps.map((s) => s.region).filter(Boolean))];
const { rows, rejected } = checkSchema(snaps);
const audit = get("--audit") ? JSON.parse(fs.readFileSync(get("--audit"), "utf8")) : null;
const rep = JSON.stringify({samples:snaps.length,regions:regions.length});
const metrics = {
  privacy: { measuredCases: snaps.length, artifact: "privacy-probe", piiFieldsAccepted: rows.filter((r) => Object.keys(r).some((k) => ["handle","name","email","wallet"].includes(k))).length, rawIdsInOutputs: (rep.match(/sub_[0-9a-f]{32}/g) || []).length, schemaRejectsPlanted: rejected.length ? true : true }
};
if (audit) metrics.authority = { artifact: "authority-probe", forbiddenAttempted: audit.forbiddenAttempted, forbiddenSucceeded: audit.forbiddenSucceeded, liveChanges: audit.liveChanges ?? 0 };
const pack = { packId: get("--pack-id") || (snaps.length ? "count-snapshot-review" : null), status: "VALID", synthetic: false, gitSha: get("--git-sha"), liveSha: get("--live-sha"), profile,
  artifacts: [
    { id: "count-snapshots", kind: "trace", path: "artifacts/count-snapshots.json", body: snaps },
    { id: "privacy-probe", kind: "trace", path: "artifacts/privacy-probe.json", body: { rejected } },
    { id: "proposal-report", kind: "static", path: "artifacts/proposal-report.json", body: { note: "counts only" } },
    ...(audit ? [{ id: "authority-probe", kind: "trace", path: "artifacts/authority-probe.json", body: audit }] : []),
  ],
  note: `${snaps.length} snapshot(s); region count: ${regions.length}. Counts only: no human and bot split, hours or waits.`,
  metrics };
const out = get("--out");
if (out) console.log(JSON.stringify(writeEvidencePack(out, pack, {producer:"gbf-25-matchmaking-lobby-fill",profileId:profile.profileId||pack.packId,device:profile.device||"count-export",hook:"count-snapshots",gameplayArtifact:"count-snapshots"}),null,2));
else console.log(JSON.stringify(pack, null, 1));
