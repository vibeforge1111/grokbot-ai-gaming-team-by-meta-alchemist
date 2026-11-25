// Created by @meta_alchemist. Used by the builder and the validator.
export function rubricMarkdown(name, r) {
  const cell = value => String(value).replaceAll("|", "\\|").replaceAll("\n", " ");
  const md = [
    `# ${name}: rubric ${r.id} v${r.version}`, "",
    `Created by ${r.credit} (${r.creditUrl}). The machine-readable definition is in \`RUBRIC.json\`.`, "",
    r.migration, "",
    `- Scale: ${r.scale} points. Contribution: ${r.contribution}.`,
    `- Game profile: ${r.gameProfile}. Hash: \`${r.hash}\`.`,
    ...[r.levels, r.verdict].filter(Boolean).map(text => `- ${text}`),
  ];
  if (r.source) md.push(`- Evidence: ${r.source}`);
  if (r.profiles) {
    md.push("", "## Approved profiles", "");
    for (const [id, profile] of Object.entries(r.profiles)) {
      md.push(`- **${id}**: ${profile.reason} Weights: ${Object.entries(profile.weights).map(([k,v]) => k + " = " + v).join(", ")}.`);
    }
  }
  if (r.samplePolicy) md.push("", "## Evidence populations", "", r.samplePolicy, "");
  for (const [group, fields] of Object.entries(r.sampleFields ?? {})) {
    md.push(`- \`${group}\`: ${fields.map(f => "\`" + f + "\`").join(", ")}.`);
  }
  if (r.releaseBlockers?.length) {
    md.push("", "## Release blockers", "");
    for (const rule of r.releaseBlockers) md.push(`- ${rule.reason} (\`${rule.line}\`).`);
  }
  md.push("", "| Pillar | Line | Name | Weight | Pass at | Evidence | Automated gate |", "|---|---|---|---|---|---|---|");
  for (const l of r.lines) {
    md.push("| " + [l.pillar, l.id, l.name, l.weight, l.passAt, l.evidence, l.automatedGate ? l.negativeFixture.cmd : "Judged"].map(cell).join(" | ") + " |");
  }
  md.push("", "## Level anchors", "");
  for (const l of r.lines) {
    md.push(`### ${l.id} ${l.name}`, "");
    for (const [level, anchor] of Object.entries(l.anchors)) md.push(`- **${level}**: ${anchor}`);
    for (const r of l.receipts || []) {
      md.push("", r.description, "", `Match each case in \`profile.cases.${r.name}\` with one row in \`receipts.${r.name}\` by id. Each row needs liveSha and a ${l.evidence} artifact ID. Required fields are ${Object.entries(r.fields).map(([k,v]) => k + " (" + v + ")").join(", ")}.`, "");
      if (r.population) md.push(`The row count must match \`${r.population}\`.`, "");
      if (r.inventorySource) md.push(`Supply \`populations.${r.name}\` with count, liveSha, source \`read-only-export\` and a ${r.inventorySource} artifact ID. A verified empty export earns U.`, "");
      if (r.members) md.push(`Match case field \`${r.members.caseField}\` to \`${r.members.field}\` in \`${r.members.path}\`.`, "");
      if (r.axes) md.push(`Cover every combination of ${Object.entries(r.axes).map(([k, v]) => k + " from " + v).join(", ")}.`, "");
      if (r.spread) md.push(`The spread across \`${r.spread.field}\` must stay within \`${r.spread.maximum}\` or the line is capped at 1.`, "");
      if (r.derive) for (const [field, [fn, ...args]] of Object.entries(r.derive)) md.push(`Compute \`${field}\` using \`${fn}(${args.join(", ")})\`.`, "");
      if (r.matchRate) md.push(`For ${r.matchRate.fields.join(" and ")}, count matched cases against \`${r.matchRate.matched}\`. A partial match at or above \`${r.matchRate.minimum}\` earns level 3. Below that minimum, apply the listed failure caps.`, "");
      if (r.blockOn) md.push(`A confirmed failure on ${r.blockOn.join(", ")} blocks release, including when another case is missing.`, "");
      for (const [field, op, expected, cap] of r.tests) md.push(`- \`${field} ${op} ${expected}\` caps the line at ${cap} on failure.`);
    }
    md.push("");
  }
  return md.join("\n");
}
