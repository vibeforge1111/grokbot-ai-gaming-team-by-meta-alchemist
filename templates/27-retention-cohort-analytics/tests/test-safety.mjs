#!/usr/bin/env node
// Created by @meta_alchemist (https://x.com/meta_alchemist).
// Safety tests: retention analytics takes no personal data in, lets none out, never lists or exports individuals,
// and counts only days that have passed.
import fs from "node:fs";
import { checkSchema, cohorts, pooled, oracle, wilson, report, probeAuthority, PII_FIELDS } from "../cohorts/cohorts.mjs";
import { run, PROFILE } from "../cohorts/scenario.mjs";
const S = (n) => "sub_" + n.toString(16).padStart(32, "0");
const results = []; const t = (name, ok, detail = "") => results.push({ name, ok: !!ok, detail });
const src = fs.readFileSync(new URL("../cohorts/cohorts.mjs", import.meta.url), "utf8"), body = src.split("export function probeAuthority")[0].replaceAll("https://x.com/meta_alchemist", "");
t("R01 engine has no network, process or file-write calls", !/\b(fetch\(|XMLHttpRequest|WebSocket|writeFile|appendFile|child_process|spawn\(|exec\()/.test(body));
t("R02 engine imports nothing", !/^\s*import\s/m.test(src));
for (const f of ["handle", "email", "wallet", "ip", "user_id", "discord_id", "x_id", "name", "phone", "country", "device_id"]) t(`R03 a row with '${f}' is refused`, !checkSchema([{ player: S(1), day: 0, [f]: "v" }]).ok);
t("R04 raw player ids are refused (player must be sub_ + 32 hex)", !checkSchema([{ player: "raw-key", day: 0 }]).ok && !checkSchema([{ player: "invalid reference", day: 0 }]).ok && !checkSchema([{ player: "h_000000000001", day: 0 }]).ok);
t("R05 timestamps are refused (whole days only)", !checkSchema([{ player: S(1), day: new Date(0).toISOString() }]).ok && !checkSchema([{ player: S(1), day: 1.5 }]).ok);
t("R06 unknown extra fields are refused, not passed through", !checkSchema([{ player: S(1), day: 0, note: "x" }]).ok);
t("R07 a segment that looks personal is dropped to 'all'", checkSchema([{ player: S(1), day: 0, segment: "sample@example.org" }]).rows[0].segment === "all");
const r = run();
t("R08 the report holds no player ids", !/sub_[0-9a-f]{32}/.test(r.rep));
const tiny = checkSchema(Array.from({ length: 5 }, (_, i) => ({ player: S(i + 1), day: 0 }))).rows, cs = cohorts(tiny, 40);
t("R09 a cohort under the cell size is hidden", /under 20 \| hidden/.test(report(cs, pooled(cs), {}, PROFILE)));
const probe = probeAuthority(src);
t("R10 no function lists, unhashes, exports or contacts players", probe.forbiddenSucceeded === 0 && probe.forbiddenAttempted >= PROFILE.minProbeAttempts && probe.individualExports === 0);
t("R11 pooled rates match the independent recount", ["d1", "d7", "d30"].every((d) => r.pool[d].k === r.orc[d].k && r.pool[d].n === r.orc[d].n));
const young = checkSchema([{ player: S(10), day: 37 }, { player: S(10), day: 38 }]).rows;
t("R12 a player whose day 7 has not passed is not in D7", cohorts(young, 40)[0].d7.n === 0 && cohorts(young, 40)[0].d1.n === 1);
const w = wilson(50, 100);
t("R13 Wilson interval matches the textbook value", Math.abs(w.lo - 0.4038) < 0.001 && Math.abs(w.hi - 0.5962) < 0.001 && wilson(0, 0).rate === null);
t("R14 every shown rate carries a range that contains it", r.metrics.conf.ratesWithInterval === r.metrics.conf.rates);
t("R15 report has no em or en dashes", !/[\u2013\u2014]/.test(r.rep));
t("R16 negative control: planted personal rows are all rejected", r.rejected.length === 5);
t("R17 personal-field list covers handle, wallet, ip, email and country", ["handle", "wallet", "ip", "email", "country"].every((f) => PII_FIELDS.includes(f)));
const failed = results.filter((x) => !x.ok);
console.log(JSON.stringify({ status: failed.length ? "FAIL" : "PASS", suite: "gbf-27 safety", passed: results.length - failed.length, total: results.length, failed }, null, 1));
process.exit(failed.length ? 1 : 0);
