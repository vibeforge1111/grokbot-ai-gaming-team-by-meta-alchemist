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
