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
