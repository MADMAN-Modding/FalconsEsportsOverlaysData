// Builds manifest.json, the list of files (with sizes and SHA-256 hashes) the app installs.
//
//   node scripts/build-manifest.mjs           writes manifest.json
//   node scripts/build-manifest.mjs --check   fails if manifest.json is out of date
//
// launch.json stays the hand-written source for names and versions. Everything else is read
// from the overlay pages themselves, so an overlay's CSS, scripts and fonts are found
// automatically, including ones shared with other overlays.
import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, posix, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SCHEMA = 1;

// Needed by every overlay and kept in sync by the app
const SHARED = [
  "index.html",
  "css/index.css",
  "js/index.js",
  "js/state.js",
  "js/overlays.js",
  "css/ethnocentric.woff",
];

// Only installed when missing, because users replace them
const DEFAULTS = ["images/Esports-Logo.png"];

const PLACEHOLDER = "Not yet implemented";

const read = (path) => readFileSync(join(root, path));

function describe(path) {
  const bytes = read(path);
  return {
    path,
    sha256: createHash("sha256").update(bytes).digest("hex"),
    size: bytes.length,
  };
}

// Local files an html or css file points at, as paths relative to the repo root
function references(path) {
  const text = read(path).toString("utf8");
  const found = new Set();

  const patterns = path.endsWith(".css")
    ? [/url\(\s*['"]?([^'")]+)['"]?\s*\)/g]
    : [/(?:src|href)\s*=\s*["']([^"']+)["']/g];

  for (const pattern of patterns) {
    for (const match of text.matchAll(pattern)) {
      const target = match[1].split(/[?#]/)[0];

      if (!target || /^([a-z]+:|\/\/|data:|#)/i.test(target)) continue;

      found.add(posix.normalize(posix.join(posix.dirname(path), target)));
    }
  }

  return [...found];
}

// An overlay's files: its page plus everything the page (and its stylesheets) pulls in
function collect(id) {
  const queue = [`overlays/${id}.html`];
  const files = new Set();
  const missing = [];

  while (queue.length) {
    const path = queue.pop();
    if (files.has(path)) continue;

    if (!existsSync(join(root, path))) {
      missing.push(`${path} (needed by overlay ${id})`);
      continue;
    }

    files.add(path);

    if (path.endsWith(".html") || path.endsWith(".css")) queue.push(...references(path));
  }

  const thumbnail = `overlays/images/${id}.png`;
  if (existsSync(join(root, thumbnail))) files.add(thumbnail);

  return { files: [...files], missing };
}

function build() {
  const launch = JSON.parse(read("launch.json").toString("utf8"));
  const kept = new Set([...SHARED, ...DEFAULTS]);
  const overlays = {};
  const problems = [];

  for (const id of Object.keys(launch.overlays).sort()) {
    const page = `overlays/${id}.html`;

    // Overlays without a page, or with a placeholder one, aren't offered for download
    if (!existsSync(join(root, page)) || read(page).toString("utf8").includes(PLACEHOLDER)) continue;

    const { files, missing } = collect(id);
    problems.push(...missing);

    overlays[id] = {
      files: files
        .filter((path) => !kept.has(path))
        .sort()
        .map(describe),
    };
  }

  for (const path of [...SHARED, ...DEFAULTS]) {
    if (!existsSync(join(root, path))) problems.push(`${path} (listed as shared or default)`);
  }

  if (problems.length) {
    console.error("Files listed or referenced but missing:\n  " + problems.join("\n  "));
    process.exit(1);
  }

  return {
    schema: SCHEMA,
    shared: SHARED.map(describe),
    defaults: DEFAULTS.map(describe),
    overlays,
  };
}

const output = JSON.stringify(build(), null, 2) + "\n";

if (process.argv.includes("--check")) {
  const current = existsSync(join(root, "manifest.json")) ? read("manifest.json").toString("utf8") : "";

  if (current !== output) {
    console.error("manifest.json is out of date, run: node scripts/build-manifest.mjs");
    process.exit(1);
  }

  console.log("manifest.json is up to date");
} else {
  writeFileSync(join(root, "manifest.json"), output);
  console.log("Wrote manifest.json");
}
