// Created by @meta_alchemist (https://x.com/meta_alchemist).
// Compare owner-supplied numeric parameters under a local proportional-response model.
// The option step comes from profile.stepPct and never exceeds profile.maxStepPct; neither is fixed in this file.
export function resolve(label, parameters) {
  return parameters.filter(p => [p.id, ...p.aliases].includes(label));
}

function fresh(row, profile) {
  return row && Number.isSafeInteger(row.cases) && row.cases >= Math.max(1, profile.minObservations)
    && Number.isFinite(row.ageDays) && row.ageDays >= 0 && row.ageDays <= profile.maxTelemetryAgeDays
    && Number.isFinite(row.observed) && row.observed > 0 && Number.isFinite(row.target) && row.target > 0;
}

export function propose(input) {
  const {parameters, requests, observations, profile} = input;
  const selected = new Set();
  return Object.freeze(requests.map(label => {
    const candidates = resolve(label, parameters);
    const parameter = candidates.length === 1 ? candidates[0] : null;
    const row = parameter && observations.find(r => r.id === parameter.id);
    const measured = Boolean(fresh(row, profile));
    const options = [];
    if (parameter) {
      const delta = Math.min(profile.stepPct, profile.maxStepPct) / 100;
      for (const factor of [1, 1 - delta, 1 + delta]) {
        const to = parameter.value * factor;
        options.push(Object.freeze({from:parameter.value, to, rollback:parameter.value, unit:parameter.unit,
          prediction: measured ? row.observed * factor : null}));
      }
    }
    let choice = 0;
    if (measured && !selected.has(parameter.id) && selected.size < profile.maxLevers) {
      options.forEach((o,i) => {
        if (Math.abs(o.prediction-row.target) < Math.abs(options[choice].prediction-row.target)) choice = i;
      });
      if (choice) selected.add(parameter.id);
    }
    return Object.freeze({label, status:"LOCAL_DRAFT", ids:Object.freeze(candidates.map(p => p.id)),
      measured, choice, options:Object.freeze(options), followUp: parameter ? "Measure the same outcome and unit on the next build." : "Ask the owner to identify the parameter."});
  }));
}

export function render(items, notes = false) {
  const lines = [notes ? "# DRAFT patch notes" : "# DRAFT balance proposal", ""];
  for (const item of items) {
    const option = item.options[item.choice];
    lines.push("## " + item.label);
    if (!option) lines.push("Resolve the reference with the owner. Candidates: " + (item.ids.join(", ") || "none"));
    else {
      lines.push(item.choice ? `Proposed change from ${option.from} to ${option.to} ${option.unit}.` : "Hold the current value.");
      if (!notes) for (const o of item.options) lines.push(`- ${o.to} ${o.unit}, modeled outcome ${o.prediction ?? "unmeasured"}, rollback ${o.rollback}.`);
    }
    lines.push(item.followUp, "");
  }
  return lines.join("\n");
}
