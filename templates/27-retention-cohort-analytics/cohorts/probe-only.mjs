#!/usr/bin/env node
// Created by @meta_alchemist (https://x.com/meta_alchemist).
// Evidence pack for a game with no anonymous session export yet: the privacy and authority checks run on the engine
// itself; every retention line stays UNMEASURED until real events arrive.
// Usage: node cohorts/probe-only.mjs --profile profile.json --git-sha <sha> --live-sha <sha> [--date <label>]
// profile.json holds your own approved values (minCellSize and minProbeAttempts at least), never the synthetic example's.
import fs from "node:fs";
import { checkSchema, cohorts, pooled, oracle, report, packMetrics, probeAuthority } from "./cohorts.mjs";
const a = process.argv.slice(2), get = (k) => (a.includes(k) ? a[a.indexOf(k) + 1] : null);
if (!get("--profile")) { console.error("usage: node cohorts/probe-only.mjs --profile profile.json --git-sha <sha> --live-sha <sha> [--date <label>]"); process.exit(2); }
const PROFILE = JSON.parse(fs.readFileSync(get("--profile"), "utf8"));
if (!Number.isSafeInteger(PROFILE.minCellSize) || PROFILE.minCellSize < 1) { console.error("profile.json needs a positive minCellSize"); process.exit(2); }
const S = (n) => "sub_" + String(n).padStart(32, "0");
const planted = [{ player: S(1), day: 3, handle: "redacted" }, { player: "raw-key", day: 4 }, { player: S(2), day: 5, wallet: "masked" }, { player: S(3), day: new Date(0).toISOString() }, { player: S(4), day: 6, country: "fixture" }];
const { rejected } = checkSchema(planted), cs = cohorts([], 0), pool = pooled(cs), rep = report(cs, pool, {}, PROFILE);
const probe = probeAuthority(fs.readFileSync(new URL("./cohorts.mjs", import.meta.url), "utf8"));
const metrics = packMetrics({ rows: [], rejected, planted: planted.length, cs, pool, segs: {}, rep, P: PROFILE, probe, today: 0, orc: oracle([], 0) });
console.log(JSON.stringify({ packId: "real-no-export-" + (get("--date") || "today"), status: "VALID", synthetic: false, gitSha: get("--git-sha"), liveSha: get("--live-sha"), profile: PROFILE,
  artifacts: [{ id: "schema-check", kind: "trace" }, { id: "report", kind: "trace" }, { id: "probe", kind: "trace" }], note: "No anonymous session export exists yet; retention lines are UNMEASURED.", metrics }, null, 1));
