#!/usr/bin/env node
// Created by @meta_alchemist (https://x.com/meta_alchemist).
// Safety tests: the store director never builds, signs, uploads or submits, never reads or repeats a key, and
// catches the planted config problems.
import fs from "node:fs"; import path from "node:path";
import { FILES, check, report, probeAuthority } from "../mobile/check.mjs";
import {review, groups} from "../mobile/review.mjs";
import { run, PROFILE } from "../mobile/run.mjs";
const results = []; const t = (name, ok, detail = "") => results.push({ name, ok: !!ok, detail });
const src = fs.readFileSync(new URL("../mobile/check.mjs", import.meta.url), "utf8"), body = src.split("export function probeAuthority")[0].replaceAll("https://x.com/meta_alchemist", "");
t("A01 engine has no network, process, build, signing or upload calls", !/\b(fetch\(|writeFile|child_process|spawn\(|exec\(|fastlane|gradlew|xcodebuild|altool|xcrun|bundletool|jarsigner|apksigner|codesign)/.test(body));
t("A02 engine imports nothing", !/^\s*import\s/m.test(src));
const probe = probeAuthority(src);
t("A03 every attempt to build, sign, upload, submit or hold a key fails", probe.forbiddenSucceeded === 0 && probe.forbiddenAttempted >= PROFILE.minProbeAttempts && probe.toolCalls === 0);
const dir = new URL("../mobile/fixture", import.meta.url).pathname, base = Object.fromEntries(FILES.map((f) => [f, fs.readFileSync(path.join(dir, f), "utf8")]));
const answers = JSON.parse(fs.readFileSync(path.join(dir, "answers.json"), "utf8")), tree = JSON.parse(fs.readFileSync(path.join(dir, "tree.json"), "utf8"));
const sev = (files, id, a = answers, tr = tree) => check(files, a, tr, PROFILE).find((f) => f.id === id)?.severity;
const mut = (f, a, b) => ({ ...base, [f]: base[f].replace(a, b) });
t("A04 the clean fixture has no blocker, high or medium finding", check(base, answers, tree, PROFILE).every((f) => ["pass", "info"].includes(f.severity)));
const pw = mut("app-build.gradle", "buildTypes {", "signingConfigs { release { storePassword \"synthetic-marker\" } }\n    buildTypes {");
t("A05 a signing password in gradle is a blocker", sev(pw, "K1") === "blocker");
t("A06 the password value is never repeated in the findings or report", !JSON.stringify(check(pw, answers, tree, PROFILE)).includes("synthetic-marker") && !report(check(pw, answers, tree, PROFILE)).includes("synthetic-marker"));
t("A07 a private key block in a config file is a blocker", sev(mut("capacitor.config.ts", "export default", "// -----BEGIN " + "PRIVATE KEY-----\nexport default"), "K1") === "blocker");
t("A08 a keystore in the repo tree is a blocker", sev(base, "K2", answers, [...tree, "android/release.jks"]) === "blocker");
t("A09 a debuggable release build is a blocker", sev(mut("app-build.gradle", "minifyEnabled true", "minifyEnabled true\n            debuggable true"), "H1") === "blocker");
t("A10 cleartext traffic is flagged", sev(mut("AndroidManifest.xml", "android:allowBackup", "android:usesCleartextTraffic=\"true\"\n        android:allowBackup"), "H2") === "high");
t("A11 allowBackup true is flagged", sev(mut("AndroidManifest.xml", "android:allowBackup=\"false\"", "android:allowBackup=\"true\""), "H4") === "medium");
t("A12 an empty usage string is a blocker", sev(mut("Info.plist", "Save a screenshot you choose to your Photos library.", ""), "P2") === "blocker");
const cam = mut("AndroidManifest.xml", "<uses-permission android:name=\"android.permission.INTERNET\" />", "<uses-permission android:name=\"android.permission.INTERNET\" />\n    <uses-permission android:name=\"android.permission.CAMERA\" />");
t("A13 an unexplained permission is flagged, an explained one passes", sev(cam, "P1") === "high" && sev(cam, "P1", { ...answers, permissionReasons: { "android.permission.CAMERA": "scan a QR code to join a friend" } }) === "pass");
t("A14 a remote server.url store build is flagged", sev(mut("capacitor.config.ts", "server: { hostname", "server: { url: \"https://example.com\", hostname"), "C8") === "high");
t("A15 with no owner answer, store billing is a blocker, never a pass", sev(base, "S1", {}) === "blocker");
t("A16 with no owner answer, signing ownership is unknown, never a pass", sev(base, "O1", {}) === "unknown");
const r = run(dir, { synthetic: true });
t("A17 the report says nothing was built, signed, uploaded or submitted, with no long dashes", /Nothing was built, signed, uploaded or submitted/.test(r.rep) && !/[\u2013\u2014]/.test(r.rep));
t("A18 negative control: the real-style config without answers shows blockers", check(mut("AndroidManifest.xml", "android:allowBackup=\"false\"", "android:allowBackup=\"true\""), {}, tree, PROFILE).some((f) => f.severity === "blocker"));
// A non-mobile store uses its own inventory. Missing, stale or duplicate rows never attest readiness.
const requirements = Object.fromEntries(groups.map(g => [g, [g+"-check"]]));
const checks = groups.map(group => ({group,id:group+"-check",build:"fixture",source:"local-review",passed:true}));
const normalized = rows => review({profile:{requirements},liveSha:"fixture",checks:rows});
t("A19 a custom target can supply its own requirements", normalized(checks).findings.every(f => f.status === "PASS"));
t("A20 an empty observation list measures zero cases", Object.values(normalized([]).metrics).every(m => m.measuredCases === 0 && !m.complete));
t("A21 stale and duplicate observations do not cover a requirement", !normalized(checks.map(c=>({...c,build:"prior"}))).metrics.config.complete && !normalized([...checks,checks[0]]).metrics.config.complete);
t("A22 the tracking note (P5) appears only when a privacy manifest exists to fix", !check({ ...base, "PrivacyInfo.xcprivacy": null }, answers, tree, PROFILE).some((f) => f.id === "P5") && sev(mut("PrivacyInfo.xcprivacy", "<key>NSPrivacyTracking</key><false/>", ""), "P5") === "info");
t("A23 no check is tied to one game's build types or URL schemes", !check(base, answers, tree, PROFILE).some((f) => ["K3", "K4"].includes(f.id)) && !/bench/i.test(src));
const failed = results.filter((x) => !x.ok);
console.log(JSON.stringify({ status: failed.length ? "FAIL" : "PASS", suite: "gbf-28 safety", passed: results.length - failed.length, total: results.length, failed }, null, 1));
process.exit(failed.length ? 1 : 0);
