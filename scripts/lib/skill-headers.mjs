// Offline YAML reader for the flat scalar mapping in SKILL.md. Created by @meta_alchemist.
const invalid = message => { throw new Error(message); };
const blank = line => /^\s*$/.test(line);
const comment = line => /^ *#/.test(line);

function folded(lines, block) {
  let text = "";
  for (let i = 0; i < lines.length; i++) {
    const current = lines[i], next = lines[i + 1];
    text += current;
    if (next === undefined) break;
    if (block && (/^ /.test(current) || /^ /.test(next))) text += "\n";
    else if (!current) text += "\n";
    else if (next) text += " ";
  }
  return text;
}

function quoted(source) {
  const quote = source[0];
  const escapes = { "0": "\0", a: "\x07", b: "\b", t: "\t", n: "\n", v: "\v", f: "\f", r: "\r", e: "\x1b",
    " ": " ", '"': '"', "/": "/", "\\": "\\", N: "\u0085", _: "\u00a0", L: "\u2028", P: "\u2029" };
  let value = "";
  for (let i = 1; i < source.length; i++) {
    const c = source[i];
    if (c === quote) {
      if (quote === "'" && source[i + 1] === "'") { value += "'"; i++; continue; }
      if (!/^(?:[ \t]+#.*|\s*)$/.test(source.slice(i + 1))) invalid("text after closing quote");
      return value;
    }
    if (quote === '"' && c === "\\") {
      const code = source[++i];
      if (Object.hasOwn(escapes, code)) { value += escapes[code]; continue; }
      const size = { x: 2, u: 4, U: 8 }[code];
      const hex = source.slice(i + 1, i + 1 + size);
      if (!size || hex.length !== size || !/^[0-9a-f]+$/i.test(hex)) invalid("invalid quoted escape");
      value += String.fromCodePoint(parseInt(hex, 16));
      i += size;
    } else value += c;
  }
  invalid("unterminated quoted scalar");
}

function blockValue(indicator, lines) {
  const header = /^([|>])([+-]?[1-9]?|[1-9][+-])(?:[ \t]+#.*)?$/.exec(indicator);
  if (!header) invalid("invalid block scalar indicator");
  const meaningful = lines.find(line => !blank(line));
  if (!meaningful) return "";
  const indent = Number(header[2].match(/\d/)?.[0]) || meaningful.match(/^ */)[0].length;
  if (lines.some(line => !blank(line) && !line.startsWith(" ".repeat(indent)))) invalid("inconsistent block indentation");
  const values = lines.map(line => blank(line) ? "" : line.slice(indent));
  let tail = 0;
  while (values.length && values.at(-1) === "") { values.pop(); tail++; }
  const text = header[1] === "|" ? values.join("\n") : folded(values, true);
  return text + (header[2].includes("-") ? "" : "\n".repeat(header[2].includes("+") ? tail + 1 : 1));
}

function parse(md) {
  const header = /^---[ \t]*\n([\s\S]*?)^---[ \t]*(?:\n|$)/m;
  const normalized = md.replaceAll("\r\n", "\n");
  const match = header.exec(normalized);
  if (!match || match.index !== 0) invalid("missing skill frontmatter");
  const lines = match[1].split("\n");
  lines.pop();
  const result = Object.create(null);
  for (let i = 0; i < lines.length;) {
    const line = lines[i++];
    if (blank(line) || comment(line)) continue;
    const entry = /^([A-Za-z][\w-]*|'[^']+'|"[^"]+"):(?:[ \t]+(.*)|$)$/.exec(line);
    if (!entry) invalid("expected a scalar mapping entry");
    const key = /^['"]/.test(entry[1]) ? quoted(entry[1]) : entry[1];
    if (Object.hasOwn(result, key)) invalid("duplicate header key");
    const first = (entry[2] || "").trim();
    const rest = [];
    while (i < lines.length && (blank(lines[i]) || /^ /.test(lines[i]))) rest.push(lines[i++]);
    let value;
    if (/^[|>]/.test(first)) value = blockValue(first, rest);
    else if (/^['"]/.test(first)) value = quoted(folded([first, ...rest.map(s => s.trim())], false).trimEnd());
    else {
      const parts = [first, ...rest.map(s => s.trim())].filter(s => !comment(s))
        .map(s => s.replace(/[ \t]+#.*$/, "").trim());
      while (parts.length && !parts[0]) parts.shift();
      value = folded(parts, false).trimEnd();
      if (/^(?:[-?:](?:\s|$)|[!&*#%@\x60[\]{},|>])|:(?:\s|$)/.test(value)) invalid("invalid plain scalar or unquoted mapping colon");
      if (/^(?:~|null|true|false|yes|no|on|off|[-+]?(?:0[xob][\da-f_]+|[\d_]+(?:\.[\d_]*)?(?:e[-+]?\d+)?|\.\d+|\.inf|\.nan)|\d{4}-\d\d-\d\d(?:[ t].*)?)$/i.test(value)) invalid("expected string scalar");
    }
    result[key] = value;
  }
  for (const key of ["name", "description"]) if (!result[key]?.trim()) invalid("expected string " + key);
  return { ...result };
}

export function skillHeaders(skills) {
  return skills.map(md => {
    try { return parse(md); }
    catch (error) { return { error: error.message }; }
  });
}
