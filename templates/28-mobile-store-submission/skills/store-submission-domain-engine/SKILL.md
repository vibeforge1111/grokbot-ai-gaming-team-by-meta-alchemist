---
name: store-submission-domain-engine
description: "Use when the domain tools are not on disk yet (a recipe-only install) or their safety tests need rerunning: write the bundled files at their paths and run the tests."
---

# Run the local Mobile App Store Submission tools

Save the bundled files below at their relative paths, next to the files from the lens-engine skill. Then run from the template folder:

```sh
node tests/run-all.mjs
node mobile/run.mjs --report
```

`mobile/review.mjs` binds required checks to observations for any target, `mobile/check.mjs` is the optional Capacitor adapter, and `mobile/run.mjs` runs either one (see README.md, Domain tools). `mobile/fixture` is the synthetic adapter example.

Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it.

Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

Created by @meta_alchemist (https://x.com/meta_alchemist).

## Bundled files

### mobile/check.mjs

```
// Created by @meta_alchemist (https://x.com/meta_alchemist).
// Mobile App Store Submission Director: an optional Capacitor adapter. It runs a static checklist over the store config
// files of an app built with Capacitor (Android and iOS) and the owner's answers. Apps built another way supply a
// checks.json instead (see mobile/review.mjs). It reads text only. It never builds, signs, uploads or submits, and
// never reads or stores a key.
export const FILES = ["capacitor.config.ts", "AndroidManifest.xml", "app-build.gradle", "variables.gradle", "Info.plist", "PrivacyInfo.xcprivacy", "project.pbxproj"];
const line = (text, re) => { const i = (text || "").split("\n").findIndex((l) => re.test(l)); return i < 0 ? null : i + 1; };
const get = (text, re) => (text || "").match(re)?.[1];

export function check(files, answers = {}, tree = [], P) {
  const F = []; const add = (id, store, sev, title, file, re, fix, owner = false) => F.push({ id, store, severity: sev, title, evidence: file ? `${file}${re && files[file] && line(files[file], re) ? ":" + line(files[file], re) : ""}` : "owner answer", fix, owner });
  const cap = files["capacitor.config.ts"], man = files["AndroidManifest.xml"], gr = files["app-build.gradle"], vars = files["variables.gradle"], plist = files["Info.plist"], priv = files["PrivacyInfo.xcprivacy"], pbx = files["project.pbxproj"];
  const appId = get(cap, /appId:\s*"([^"]+)"/), appIdA = get(gr, /applicationId\s+"([^"]+)"/), bundle = get(pbx, /PRODUCT_BUNDLE_IDENTIFIER = ([^;]+);/);
  const target = Number(get(vars, /targetSdkVersion\s*=\s*(\d+)/)), vCode = Number(get(gr, /versionCode\s+(\d+)/)), vName = get(gr, /versionName\s+"([^"]+)"/), mkt = get(pbx, /MARKETING_VERSION = ([^;]+);/), build = get(pbx, /CURRENT_PROJECT_VERSION = ([^;]+);/), depl = Number(get(pbx, /IPHONEOS_DEPLOYMENT_TARGET = ([\d.]+);/));
  const config = [
    ["C1", "both", /^[a-z][a-z0-9_]*(\.[a-z0-9_]+){2,}$/.test(appId || "") && appId === appIdA && appId === bundle, "App id is reverse-DNS and the same on Capacitor, Android and iOS", "capacitor.config.ts", /appId/],
    ["C2", "android", target >= P.minTargetSdk, `Android targetSdk is at least ${P.minTargetSdk}`, "variables.gradle", /targetSdkVersion/],
    ["C3", "android", vCode >= 1 && !!vName, "Android versionCode and versionName set", "app-build.gradle", /versionCode/],
    ["C4", "ios", !!mkt && !!build, "iOS MARKETING_VERSION and CURRENT_PROJECT_VERSION set", "project.pbxproj", /MARKETING_VERSION/],
    ["C5", "ios", depl >= P.minIosTarget, `iOS deployment target is at least ${P.minIosTarget}`, "project.pbxproj", /IPHONEOS_DEPLOYMENT_TARGET/],
    ["C6", "android", vName === mkt, "Android versionName matches iOS MARKETING_VERSION", "app-build.gradle", /versionName/],
    ["C7", "ios", /ITSAppUsesNonExemptEncryption<\/key>\s*<(true|false)\/>/.test(plist || ""), "Export compliance key set (ITSAppUsesNonExemptEncryption)", "Info.plist", /ITSAppUsesNonExemptEncryption/],
    ["C8", "both", !/server:\s*\{[^}]*\burl:/.test(cap || ""), "Store build ships the game, not a remote server.url", "capacitor.config.ts", /server:/],
  ];
  for (const [id, store, ok, title, file, re] of config) add(id, store, ok ? "pass" : "high", title, file, re, ok ? "" : "Fix before the first upload.");
  const releaseBlock = (gr || "").match(/release\s*\{([\s\S]*?)\n\s{8}\}/)?.[1] || "";
  const debuggable = /debuggable\s+true/.test(releaseBlock) || /android:debuggable="true"/.test(man || ""), cleartext = /usesCleartextTraffic="true"/.test(man || ""), minified = /minifyEnabled\s+true/.test(releaseBlock), backup = !/android:allowBackup="false"/.test(man || "");
  add("H1", "android", debuggable ? "blocker" : "pass", "Release build is not debuggable", "AndroidManifest.xml", /debuggable|application/, debuggable ? "Remove debuggable from the release build." : "");
  add("H2", "android", cleartext ? "high" : "pass", "No cleartext traffic", "AndroidManifest.xml", /usesCleartextTraffic|application/, cleartext ? "Remove usesCleartextTraffic." : "");
  add("H3", "android", minified ? "pass" : "medium", "Release build is minified and shrunk", "app-build.gradle", /minifyEnabled/, minified ? "" : "Turn on minifyEnabled and shrinkResources for release.");
  add("H4", "android", backup ? "medium" : "pass", "App data is not copied into device backups", "AndroidManifest.xml", /allowBackup/, backup ? "Set android:allowBackup=\"false\" (or add dataExtractionRules that exclude the sign-in session), so a session cannot be restored onto another device." : "");
  const perms = [...(man || "").matchAll(/uses-permission android:name="([^"]+)"/g)].map((m) => m[1]);
  const unjust = perms.filter((p) => !P.allowedPermissions.includes(p) && !(answers.permissionReasons || {})[p]);
  add("P1", "android", unjust.length ? "high" : "pass", `Every Android permission is needed (${perms.map((p) => p.split(".").pop()).join(", ") || "none"})`, "AndroidManifest.xml", /uses-permission/, unjust.length ? `Justify or remove: ${unjust.join(", ")}.` : "");
  const usageKeys = [...(plist || "").matchAll(/<key>(NS\w+UsageDescription)<\/key>\s*<string>([^<]*)<\/string>/g)];
  const emptyUsage = usageKeys.filter((m) => m[2].trim().length < 10).length;
  add("P2", "ios", emptyUsage ? "blocker" : "pass", `Every iOS usage string explains itself (${usageKeys.length} found)`, "Info.plist", /UsageDescription/, emptyUsage ? "Write a clear reason for each usage string." : "");
  const manifest = !!priv && /NSPrivacyAccessedAPITypes/.test(priv), collected = /NSPrivacyCollectedDataTypes/.test(priv || ""), tracking = /NSPrivacyTracking/.test(priv || "");
  add("P3", "ios", manifest ? "pass" : "blocker", "Privacy manifest present with required-reason APIs", "PrivacyInfo.xcprivacy", /NSPrivacyAccessedAPITypes/, manifest ? "" : "Add PrivacyInfo.xcprivacy.");
  const collectsAccount = answers.collectsAccountData ?? true;
  add("P4", "ios", collectsAccount && !collected ? "high" : "pass", "Data the app collects (account sign-in, gameplay history) is declared", "PrivacyInfo.xcprivacy", /<dict>/, collectsAccount && !collected ? "Declare what the app collects (sign-in identity, gameplay history) in NSPrivacyCollectedDataTypes and match it in App Store Connect privacy labels and the Google Play Data safety form; set NSPrivacyTracking to false if nothing tracks." : "", true);
  if (priv && !tracking) add("P5", "ios", "info", "NSPrivacyTracking is not stated", "PrivacyInfo.xcprivacy", null, "State NSPrivacyTracking false if the app does not track.");
  add("P6", "both", answers.privacyPolicyUrl ? "pass" : "high", "Privacy policy URL ready for both stores", null, null, answers.privacyPolicyUrl ? "" : "Owner: give the public privacy policy URL.", true);
  const digital = answers.sellsDigitalItemsOutsideStoreBilling ?? null, hidden = answers.mobileBuildHidesOutsidePurchases ?? null;
  add("S1", "both", digital === false || hidden === true ? "pass" : "blocker", "Paid digital items follow store billing rules", null, null, digital === false || hidden === true ? "" : "Compare the purchase flow with the current target policy. Draft the applicable billing change for owner review.", true);
  const login = answers.thirdPartyLoginOnly ?? true, apple = answers.offersAppleOrEquivalentLogin ?? false, guest = answers.guestPlayWithoutAccount ?? false;
  add("S2", "ios", !login || apple || guest ? "pass" : "high", "Login rules: a third-party sign-in also needs an equivalent private option on iOS", null, null, !login || apple || guest ? "" : "Owner: confirm guest play without an account, or add Sign in with Apple (or an equivalent private login).", true);
  add("S3", "both", answers.accountDeletionInApp ? "pass" : "high", "Players can delete their account from inside the app", null, null, answers.accountDeletionInApp ? "" : "Draft the account deletion flow required by the selected policy.", true);
  const secretHits = FILES.filter((f) => /storePassword|keyPassword|keyAlias\s+["']|-----BEGIN (RSA |EC )?PRIVATE KEY|ASC_KEY|APP_STORE_CONNECT_API_KEY/.test(files[f] || ""));
  const keyFiles = tree.filter((p) => /\.(jks|keystore|p12|p8|mobileprovision|pem)$/i.test(p) && !/test|fixture|example/i.test(p));
  add("K1", "both", secretHits.length ? "blocker" : "pass", "No signing passwords or keys in the store config files", secretHits[0] || "app-build.gradle", /storePassword|keyPassword|PRIVATE KEY/, secretHits.length ? "Remove them, rotate the key, and keep signing with the owner." : "");
  add("K2", "both", keyFiles.length ? "blocker" : "pass", `No keystores, certificates or profiles in the repo tree (${tree.length} paths checked)`, "repo tree", null, keyFiles.length ? `Remove from the repo and rotate: ${keyFiles.length} file(s).` : "");
  if (/loggingBehavior:\s*"debug"/.test(cap || "")) add("K5", "both", "info", "Capacitor logs in debug builds only (loggingBehavior \"debug\")", "capacitor.config.ts", /loggingBehavior/, "No action: release builds do not log.");
  const listing = ["screenshots", "description", "ageRating", "dataSafetyForm", "appPrivacyLabels"].map((k) => [k, !!(answers.listing || {})[k]]);
  for (const [k, ok] of listing) add(`L-${k}`, "both", ok ? "pass" : "medium", `Listing: ${k} ready`, null, null, ok ? "" : `Owner: prepare ${k}.`, true);
  add("O1", "both", answers.ownerHoldsSigning === true ? "pass" : answers.ownerHoldsSigning === false ? "high" : "unknown", "The owner holds the signing keys and store accounts (never the agent)", null, null, answers.ownerHoldsSigning === true ? "" : "Owner: confirm the release key and store accounts are held by you.", true);
  return F;
}

export function report(F, appName) {
  const order = { blocker: 0, high: 1, medium: 2, info: 3, unknown: 4, pass: 5 };
  const L = [`# DRAFT store submission check: ${appName || "app"}`, "", "Nothing was built, signed, uploaded or submitted. This is a checklist for the owner.", "", "| Severity | Store | Check | Evidence | Fix |", "|---|---|---|---|---|"];
  for (const f of [...F].sort((a, b) => order[a.severity] - order[b.severity])) L.push(`| ${f.severity} | ${f.store} | ${f.title} | ${f.evidence} | ${f.fix || "ok"} |`);
  return L.join("\n") + "\n";
}

export function probeAuthority(src) {
  const attempts = []; const tryIt = (name, f) => { let ok = false; try { ok = !!f(); } catch { ok = false; } attempts.push({ name, succeeded: ok }); };
  for (const fn of ["buildRelease", "signApk", "signIpa", "uploadToPlay", "uploadToAppStore", "submitForReview", "createRelease", "readKeystore", "storeKey", "setStorePassword", "publishListing", "promoteTrack"]) tryIt(`call ${fn}`, () => typeof API[fn] === "function" && API[fn]());
  const body = src.slice(0, src.indexOf("export function probeAuthority")).replaceAll("https://x.com/meta_alchemist", "");
  return { forbiddenAttempted: attempts.length, forbiddenSucceeded: attempts.filter((a) => a.succeeded).length, toolCalls: (body.match(/\bfetch\(|writeFile|child_process|\bexec\(|fastlane|gradlew|xcodebuild|altool|xcrun|bundletool|https?:\/\//g) || []).length };
}
const API = { check, report };
```

### mobile/review.mjs

```
// Created by @meta_alchemist (https://x.com/meta_alchemist).
// Normalized, read-only review for any distribution target.
// Bind each required check to a local observation on the same build.
export const groups = ["config","hard","perm","privacy","billing","accounts","secrets","signing","listing"];
export function review(input) {
  const metrics = {}, findings = [], artifacts = [];
  for (const group of groups) {
    const required = input.profile.requirements[group];
    if (!Array.isArray(required) || new Set(required).size !== required.length || required.some(k => typeof k !== "string" || !k.trim())) throw new Error("Invalid requirements for " + group);
    const observed = [];
    for (const id of required) {
      const rows = input.checks.filter(c => c.group === group && c.id === id && c.build === input.liveSha);
      const row = rows.length === 1 ? rows[0] : null;
      if (!row || typeof row.passed !== "boolean" || typeof row.source !== "string" || !row.source.trim()) {
        findings.push({group,id,status:"UNMEASURED"});
      } else {
        observed.push(row);
        findings.push({group,id,status:row.passed ? "PASS" : "REVIEW",source:row.source});
      }
    }
    const evidence = group + "-review";
    metrics[group] = {artifact:evidence,measuredCases:observed.length,failures:observed.filter(c => !c.passed).length};
    if (observed.length === required.length && required.length) metrics[group].complete = true;
    if (observed.length) artifacts.push({id:evidence,kind:"static"});
  }
  return {metrics,artifacts,findings};
}
```

### mobile/run.mjs

```
// Created by @meta_alchemist (https://x.com/meta_alchemist).
// Usage: node mobile/run.mjs [<adapter-dir> | checks.json] [--report | --findings] [--pack-id <id> --git-sha <sha> --live-sha <sha>]
// A directory is read by the optional Capacitor adapter (mobile/check.mjs); a JSON file is any target's normalized checks.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { FILES, check, report, probeAuthority } from "./check.mjs";
import { review } from "./review.mjs";

// Example configuration for the optional Android and iOS file adapter.
export const PROFILE = {minTargetSdk:35,minIosTarget:15,allowedPermissions:["android.permission.INTERNET"],minProbeAttempts:12};
const groups = {
  config:["C1","C2","C3","C4","C5","C6","C7","C8"], hard:["H1","H2","H3","H4"],perm:["P1","P2"],
  privacy:["P3","P4","P6"], billing:["S1"],accounts:["S2","S3"],secrets:["K1","K2"],signing:["O1"],
  listing:["L-screenshots","L-description","L-ageRating","L-dataSafetyForm","L-appPrivacyLabels"]
};
export function run(location, options = {}) {
  let input, F, rep;
  if (!fs.statSync(location).isDirectory()) {
    input = JSON.parse(fs.readFileSync(location,"utf8"));
  } else {
    const read = f => fs.existsSync(path.join(location,f)) ? fs.readFileSync(path.join(location,f),"utf8") : null;
    const files = Object.fromEntries(FILES.map(f => [f,read(f)]));
    const answers = JSON.parse(read("answers.json") || "{}"), tree = JSON.parse(read("tree.json") || "[]");
    const synthetic = options.synthetic === true;
    const profile = synthetic ? PROFILE : JSON.parse(read("profile.json") || "{}");
    if (!Array.isArray(profile.allowedPermissions) || !Number.isFinite(profile.minTargetSdk) || !Number.isFinite(profile.minIosTarget)) throw new Error("Supply an adapter profile with SDK targets and permission policy");
    const liveSha = options.liveSha || (synthetic ? "synthetic" : null);
    F = check(files,answers,tree,profile);
    const present = filename => !!files[filename]?.trim();
    const both = FILES.every(present);
    const seen = id => {
      if (id.startsWith("C") || id.startsWith("H")) return both;
      if (id === "K1") return both;
      if (id === "K2") return tree.length > 0;
      if (id === "P1" || id === "P2") return present("AndroidManifest.xml") && present("Info.plist");
      if (id === "P3" || id === "P4") return present("PrivacyInfo.xcprivacy") && typeof answers.collectsAccountData === "boolean";
      if (id === "P6") return typeof answers.privacyPolicyUrl === "string";
      if (id === "S1") return typeof answers.sellsDigitalItemsOutsideStoreBilling === "boolean";
      if (id === "S2") return typeof answers.thirdPartyLoginOnly === "boolean";
      if (id === "S3") return typeof answers.accountDeletionInApp === "boolean";
      if (id === "O1") return typeof answers.ownerHoldsSigning === "boolean";
      return typeof answers.listing?.[id.slice(2)] === "boolean";
    };
    const checks = [];
    for (const [group,ids] of Object.entries(groups)) for (const id of ids) {
      const f = F.find(row => row.id === id);
      if (!seen(id)) { f.severity="unknown"; f.fix="Provide the local evidence for this check."; continue; }
      checks.push({group,id,build:liveSha,source:f.evidence,passed:f.severity === "pass"});
    }
    input = {packId:synthetic ? "synthetic-store" : options.packId,gitSha:options.gitSha || (synthetic ? "synthetic" : null), liveSha,
      synthetic,profile:{...profile,requirements:groups},checks};
    rep = report(F,"selected target");
  }
  const {metrics,artifacts,findings} = review(input);
  const probe = probeAuthority(fs.readFileSync(new URL("./check.mjs",import.meta.url),"utf8"));
  metrics.authority = {artifact:"inspection",forbiddenAttempted:probe.forbiddenAttempted,forbiddenSucceeded:probe.forbiddenSucceeded,toolCalls:probe.toolCalls};
  artifacts.push({id:"inspection",kind:"trace"});
  const {packId,synthetic,gitSha,liveSha,profile} = input;
  const pack = {packId,synthetic,gitSha,liveSha,status:"VALID",profile,metrics,artifacts};
  return {pack,F:F ?? findings,rep:rep ?? ["# DRAFT store readiness checklist","",...findings.map(f => `- ${f.group} / ${f.id}: ${f.status}`)].join("\n")};
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const a = process.argv.slice(2), value = k => a.includes(k) ? a[a.indexOf(k)+1] : undefined;
  const target = a[0] && !a[0].startsWith("--") ? a[0] : null;
  const result = run(target || fileURLToPath(new URL("./fixture",import.meta.url)),{synthetic:!target,gitSha:value("--git-sha"),liveSha:value("--live-sha"),packId:value("--pack-id")});
  console.log(a.includes("--report") ? result.rep : JSON.stringify(a.includes("--findings") ? result.F : result.pack,null,2));
}
```

### mobile/fixture/AndroidManifest.xml

```
<?xml version="1.0" encoding="utf-8"?>
<!-- Synthetic fixture -->
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <application
        android:allowBackup="false"
        android:label="@string/app_name"
        android:theme="@style/AppTheme">
        <activity android:name=".MainActivity" android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
    <uses-permission android:name="android.permission.INTERNET" />
</manifest>
```

### mobile/fixture/Info.plist

```
<?xml version="1.0" encoding="UTF-8"?>
<!-- Synthetic fixture -->
<plist version="1.0">
<dict>
	<key>CFBundleDisplayName</key>
	<string>Example Game</string>
	<key>NSPhotoLibraryAddUsageDescription</key>
	<string>Save a screenshot you choose to your Photos library.</string>
	<key>ITSAppUsesNonExemptEncryption</key>
	<false/>
</dict>
</plist>
```

### mobile/fixture/PrivacyInfo.xcprivacy

```
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0"><dict>
  <key>NSPrivacyTracking</key><false/>
  <key>NSPrivacyCollectedDataTypes</key><array><dict><key>NSPrivacyCollectedDataType</key><string>NSPrivacyCollectedDataTypeUserID</string><key>NSPrivacyCollectedDataTypeLinked</key><true/><key>NSPrivacyCollectedDataTypeTracking</key><false/><key>NSPrivacyCollectedDataTypePurposes</key><array><string>NSPrivacyCollectedDataTypePurposeAppFunctionality</string></array></dict></array>
  <key>NSPrivacyAccessedAPITypes</key><array><dict>
    <key>NSPrivacyAccessedAPIType</key><string>NSPrivacyAccessedAPICategoryFileTimestamp</string>
    <key>NSPrivacyAccessedAPITypeReasons</key><array><string>C617.1</string></array>
  </dict></array>
</dict></plist>
```

### mobile/fixture/answers.json

```
{
 "collectsAccountData": true,
 "privacyPolicyUrl": "https://example.com/privacy",
 "sellsDigitalItemsOutsideStoreBilling": false,
 "thirdPartyLoginOnly": true,
 "guestPlayWithoutAccount": true,
 "offersAppleOrEquivalentLogin": false,
 "accountDeletionInApp": true,
 "ownerHoldsSigning": true,
 "listing": {
  "screenshots": true,
  "description": true,
  "ageRating": true,
  "dataSafetyForm": true,
  "appPrivacyLabels": true
 }
}
```

### mobile/fixture/app-build.gradle

```
// Synthetic fixture
android {
    namespace "com.example.game"
    defaultConfig {
        applicationId "com.example.game"
        versionCode 3
        versionName "1.2.0"
    }
    buildTypes {
        release {
            minifyEnabled true
            shrinkResources true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}
```

### mobile/fixture/capacitor.config.ts

```
import type { CapacitorConfig } from "@capacitor/cli";
/* Synthetic fixture: a store-ready Capacitor game config. */
const config: CapacitorConfig = {
  appId: "com.example.game",
  appName: "Example Game",
  webDir: "dist",
  loggingBehavior: "debug",
  server: { hostname: "localhost", androidScheme: "https" },
  android: { allowMixedContent: false },
};
export default config;
```

### mobile/fixture/project.pbxproj

```
// Synthetic fixture (excerpt of build settings)
				IPHONEOS_DEPLOYMENT_TARGET = 16.0;
				CODE_SIGN_STYLE = Automatic;
				CURRENT_PROJECT_VERSION = 3;
				MARKETING_VERSION = 1.2.0;
				PRODUCT_BUNDLE_IDENTIFIER = com.example.game;
```

### mobile/fixture/tree.json

```
[
 "android/app/build.gradle",
 "android/app/src/main/AndroidManifest.xml",
 "ios/App/App/Info.plist",
 "ios/App/App/PrivacyInfo.xcprivacy",
 "src/main.ts",
 "README.md"
]
```

### mobile/fixture/variables.gradle

```
ext {
    minSdkVersion = 24
    compileSdkVersion = 36
    targetSdkVersion = 36
}
```

### tests/test-safety.mjs

```
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
```
