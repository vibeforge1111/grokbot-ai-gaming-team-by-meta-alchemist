#!/usr/bin/env node
// Created by @meta_alchemist (https://x.com/meta_alchemist).
// Turns saved aggregate count snapshots (for example players per server or per queue, saved by the owner from a status
// page or an export) into an evidence pack. It reads files; it never calls the game.
// Counts alone have no human and bot split, no hours and no waits, so those lines stay UNMEASURED.
// Usage: node mm/import-counts.mjs snapshots.json --profile profile.json --pack-id <id> --git-sha <sha> --live-sha <sha>
// snapshots.json is an array of { region, players } rows. profile.json holds your own thresholds (minProbeAttempts at least).
import fs from "node:fs";
import { checkSchema, probeAuthority } from "./fill.mjs";
const a = process.argv.slice(2), get = (k) => (a.includes(k) ? a[a.indexOf(k) + 1] : null);
if (!a[0] || a[0].startsWith("--")) { console.error("usage: node mm/import-counts.mjs snapshots.json --profile profile.json --pack-id <id> --git-sha <sha> --live-sha <sha>"); process.exit(2); }
const snaps = JSON.parse(fs.readFileSync(a[0], "utf8"));
// The owner's profile, never the synthetic example's. Without one, threshold-based lines grade U.
const profile = get("--profile") ? JSON.parse(fs.readFileSync(get("--profile"), "utf8")) : {};
const regions = [...new Set(snaps.map((s) => s.region).filter(Boolean))];
const seat = (n) => "sub_" + String(n).padStart(32, "0");
const planted = [{ seat: seat(1), bot: false, region: "x", hour: 0, handle: "redacted" }, { seat: "raw-id", bot: false, region: "x", hour: 0 }, { seat: seat(2), region: "x", hour: 0 }];
const { rows, rejected } = checkSchema(planted);
const probe = probeAuthority(fs.readFileSync(new URL("./fill.mjs", import.meta.url), "utf8"));
const rep = JSON.stringify({samples:snaps.length,regions:regions.length});
const pack = { packId: get("--pack-id") || (snaps.length ? "count-snapshot-review" : null), status: "VALID", synthetic: false, gitSha: get("--git-sha"), liveSha: get("--live-sha"), profile,
  artifacts: [{ id: "count-snapshots", kind: "trace" }, { id: "authority-probe", kind: "trace" }, { id: "privacy-probe", kind: "trace" }, { id: "proposal-report", kind: "static" }],
  note: `${snaps.length} snapshot(s); region count: ${regions.length}; player counts: ${snaps.map(s => Number.isSafeInteger(s.players) ? s.players : "unknown").join(", ")}. Counts only: no human and bot split, hours or waits.`,
  metrics: { authority: { artifact: "authority-probe", forbiddenAttempted: probe.forbiddenAttempted, forbiddenSucceeded: probe.forbiddenSucceeded, liveChanges: probe.liveChanges }, privacy: { measuredCases: planted.length, artifact: "privacy-probe", piiFieldsAccepted: rows.length, rawIdsInOutputs: (rep.match(/sub_[0-9a-f]{32}/g) || []).length, schemaRejectsPlanted: rejected.length === planted.length } } };
console.log(JSON.stringify(pack, null, 1));
