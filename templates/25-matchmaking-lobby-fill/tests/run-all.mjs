// Created by @meta_alchemist (https://x.com/meta_alchemist).
import {spawnSync} from "node:child_process";
import {fileURLToPath} from "node:url";
const tests = ["test-lens-contract","lens-negative-fixtures","test-empty-sample","test-safety","test-window"];
const cwd = fileURLToPath(new URL("..",import.meta.url));
const results = tests.map(test => {
  const run = spawnSync(process.execPath,["tests/"+test+".mjs"],{cwd,encoding:"utf8"});
  if (run.status !== 0) return {test,status:"FAIL",detail:run.stderr || run.stdout};
  return {test,...JSON.parse(run.stdout)};
});
const status = results.every(r => r.status === "PASS") ? "PASS" : "FAIL";
console.log(JSON.stringify({status,results},null,2));
process.exitCode = status === "PASS" ? 0 : 1;
