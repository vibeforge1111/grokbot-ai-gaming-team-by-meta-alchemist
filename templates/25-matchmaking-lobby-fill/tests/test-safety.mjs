#!/usr/bin/env node
// Created by @meta_alchemist (https://x.com/meta_alchemist).
// Safety tests: the lobby fill director only proposes, never changes a live region, queue or bot setting, never counts
// a bot as a player and never accepts personal data.
import fs from "node:fs";
import { checkSchema, aggregate, regionSummary, propose, oracleThin, report, probeAuthority, PII_FIELDS } from "../mm/fill.mjs";
import { run, PROFILE, RTT } from "../mm/scenario.mjs";
const results = []; const t = (name, ok, detail = "") => results.push({ name, ok: !!ok, detail });
const src = fs.readFileSync(new URL("../mm/fill.mjs", import.meta.url), "utf8");
const body = src.split("export function probeAuthority")[0].replaceAll("https://x.com/meta_alchemist", "");
t("M01 engine has no network, process, file-write, deploy or scaling calls", !/\b(fetch|XMLHttpRequest|WebSocket|writeFile|appendFile|child_process|exec|spawn|deploy\()/.test(body));
t("M02 engine imports nothing", !/^\s*import\s/m.test(src));
const probe = probeAuthority(src);
t("M03 every attempt to apply, rewrite or call a live change fails", probe.forbiddenSucceeded === 0 && probe.forbiddenAttempted >= PROFILE.minProbeAttempts, probe.attempts.filter((a) => a.succeeded).map((a) => a.name));
const r = run();
t("M04 every proposal is PROPOSED and needs the owner", [...r.plan.proposals, ...r.plan.inputQueue].every((p) => p.status === "PROPOSED" && p.needsOwner === true));
const S = (n) => "sub_" + String(n).padStart(32, "0");
for (const f of ["handle", "email", "wallet", "ip", "user_id", "discord_id", "x_id", "name", "phone"]) t(`M05 a row with '${f}' is refused`, !checkSchema([{ seat: S(1), bot: false, region: "a", hour: 0, [f]: "v" }]).ok);
t("M06 raw player ids are refused (seat must be sub_ + 32 hex)", !checkSchema([{ seat: "1234567890", bot: false, region: "a", hour: 0 }]).ok && !checkSchema([{ seat: "invalid-seat", bot: false, region: "a", hour: 0 }]).ok && !checkSchema([{ seat: "sub_" + "A".repeat(32), bot: false, region: "a", hour: 0 }]).ok);
t("M07 a seat with no bot flag is refused", !checkSchema([{ seat: S(1), region: "a", hour: 0 }]).ok);
const mix = checkSchema([{ seat: S(1), bot: true, region: "a", hour: 0 }, { seat: S(2), bot: true, region: "a", hour: 0 }, { seat: S(3), bot: false, region: "a", hour: 0 }]).rows;
t("M08 bots never count as humans", aggregate(mix)[0].humans === 1 && aggregate(mix)[0].bots === 2);
const dup = checkSchema([{ seat: S(3), bot: false, region: "a", hour: 0 }, { seat: S(3), bot: false, region: "a", hour: 0 }]).rows;
t("M09 one human seen twice in an hour counts once", aggregate(dup)[0].humans === 1);
t("M10 no merge over the ping cap is ever proposed", r.plan.proposals.flatMap((p) => p.options).filter((o) => o.kind === "merge").every((o) => o.p90PingMs <= PROFILE.pingCapMs));
const noPing = propose([{ region: "a", humansPerHour: 1, botShare: 0, primaryShare: 0 }, { region: "b", humansPerHour: 9, botShare: 0, primaryShare: 0 }], {}, PROFILE);
t("M11 a merge with unknown ping is never proposed", noPing.proposals[0].options.every((o) => o.kind !== "merge"));
{ const { events } = (await import("../mm/scenario.mjs")).build(); const rows = checkSchema(events).rows; t("M12 thin regions match an independent recount", JSON.stringify([...r.plan.thin].sort()) === JSON.stringify(oracleThin(rows, PROFILE)), r.plan.thin); }
t("M13 every thin region gets at least two options", r.plan.proposals.every((p) => p.options.length >= 2));
t("M14 a merged pair still under target is said plainly", r.plan.proposals.flatMap((p) => p.options).filter((o) => o.stillThin).every((o) => /still under the fill target/.test(o.tradeOff)));
t("M15 the report shows no seat ids and says nothing was changed", !/sub_[0-9a-f]{32}/.test(r.rep) && /Nothing here was changed/.test(r.rep));
t("M16 the report has no em or en dashes and no launch dates", !/[\u2013\u2014]/.test(r.rep) && !/\b(scheduled opening|launch)\b/i.test(r.rep));
t("M17 personal-field list covers handle, wallet, ip and email", ["handle", "wallet", "ip", "email"].every((f) => PII_FIELDS.includes(f)));
t("M18 negative control: a planted personal row shows in rejections", r.rejected.length === 4);
{ const rows = checkSchema([{ seat: S(5), bot: false, region: "a", hour: 0, device: "input-a", waitS: 30 }, { seat: S(6), bot: false, region: "a", hour: 0, device: "input-b", waitS: 10 }]).rows;
  const none = regionSummary(aggregate(rows, {}))[0], set = regionSummary(aggregate(rows, { primaryInput: "input-a", comparisonInput: "input-b" }))[0];
  t("M19 without input groups in the profile no device gap is computed (no default device codes)", none.primaryWaitP50 === null && none.comparisonWaitP50 === null && set.primaryWaitP50 === 30 && set.comparisonWaitP50 === 10); }
const failed = results.filter((x) => !x.ok);
console.log(JSON.stringify({ status: failed.length ? "FAIL" : "PASS", suite: "gbf-25 safety", passed: results.length - failed.length, total: results.length, failed }, null, 1));
process.exit(failed.length ? 1 : 0);
