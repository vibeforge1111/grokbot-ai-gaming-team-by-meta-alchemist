// Rubric hash for the kit. Created by @meta_alchemist (https://x.com/meta_alchemist).
// sha256 over canonical JSON (keys sorted at every level, no whitespace) of the rubric without its "hash" field.
import crypto from "node:crypto";

export function canon(v) {
  if (Array.isArray(v)) return "[" + v.map(canon).join(",") + "]";
  if (v && typeof v === "object") return "{" + Object.keys(v).sort().map((k) => JSON.stringify(k) + ":" + canon(v[k])).join(",") + "}";
  return JSON.stringify(v);
}

export function rubricHash(rubric) {
  const { hash, ...rest } = rubric;
  return "sha256:" + crypto.createHash("sha256").update(canon(rest), "utf8").digest("hex");
}
