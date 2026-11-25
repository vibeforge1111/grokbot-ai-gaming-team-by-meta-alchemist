// Tiny JSON schema subset checker (type, required, properties, enum, const, pattern, items, minItems, maxItems, minimum, maximum, minLength).
// Created by @meta_alchemist (https://x.com/meta_alchemist). Zero dependencies on purpose.
const typeOf = (v) => (v === null ? "null" : Array.isArray(v) ? "array" : Number.isInteger(v) ? "integer" : typeof v);

export function check(schema, value, at = "$") {
  const errs = [];
  if (!schema) return errs;
  if (schema.type) {
    const types = [].concat(schema.type), t = typeOf(value);
    if (!types.some((x) => x === t || (x === "number" && t === "integer"))) return [`${at}: expected ${types.join("|")}, got ${t}`];
  }
  if ("const" in schema && JSON.stringify(value) !== JSON.stringify(schema.const)) errs.push(`${at}: must equal ${JSON.stringify(schema.const)}`);
  if (schema.enum && !schema.enum.some((e) => JSON.stringify(e) === JSON.stringify(value))) errs.push(`${at}: must be one of ${schema.enum.join(", ")}`);
  if (typeof value === "string") {
    if (schema.pattern && !new RegExp(schema.pattern).test(value)) errs.push(`${at}: does not match ${schema.pattern}`);
    if (schema.minLength && value.length < schema.minLength) errs.push(`${at}: shorter than ${schema.minLength}`);
  }
  if (typeof value === "number") {
    if ("minimum" in schema && value < schema.minimum) errs.push(`${at}: below ${schema.minimum}`);
    if ("maximum" in schema && value > schema.maximum) errs.push(`${at}: above ${schema.maximum}`);
  }
  if (Array.isArray(value)) {
    if ("minItems" in schema && value.length < schema.minItems) errs.push(`${at}: fewer than ${schema.minItems} items`);
    if ("maxItems" in schema && value.length > schema.maxItems) errs.push(`${at}: more than ${schema.maxItems} items`);
    if (schema.items) value.forEach((v, i) => errs.push(...check(schema.items, v, `${at}[${i}]`)));
  }
  if (value && typeof value === "object" && !Array.isArray(value)) {
    for (const k of schema.required || []) if (!(k in value)) errs.push(`${at}: missing ${k}`);
    for (const [k, s] of Object.entries(schema.properties || {})) if (k in value) errs.push(...check(s, value[k], `${at}.${k}`));
  }
  return errs;
}
