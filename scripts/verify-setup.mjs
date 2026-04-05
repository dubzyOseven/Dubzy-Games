/**
 * Checks that .env / .env.local define required keys (values non-empty).
 * Does not print secret values. Run from project root: node scripts/verify-setup.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const REQUIRED = [
  "DATABASE_URL",
  "NEXTAUTH_SECRET",
  "NEXTAUTH_URL",
  "ADMIN_PASSWORD",
];

function parseEnvFile(text) {
  const out = {};
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    out[key] = val;
  }
  return out;
}

function loadMergedEnv() {
  const merged = {};
  for (const name of [".env", ".env.local"]) {
    const p = path.join(root, name);
    if (!fs.existsSync(p)) continue;
    Object.assign(merged, parseEnvFile(fs.readFileSync(p, "utf8")));
  }
  return merged;
}

const env = loadMergedEnv();
const missing = [];
const weak = [];

for (const key of REQUIRED) {
  const v = env[key];
  if (v == null || String(v).trim() === "") {
    missing.push(key);
    continue;
  }
  if (key === "NEXTAUTH_SECRET" && v.includes("replace-with-random")) {
    weak.push(`${key} still looks like a placeholder`);
  }
  if (key === "ADMIN_PASSWORD" && (v === "change-me" || v.length < 8)) {
    weak.push(`${key} should be a strong password (not "change-me")`);
  }
  if (
    key === "DATABASE_URL" &&
    (v.includes("user:password@") || v.includes("USER:PASSWORD"))
  ) {
    weak.push(`${key} still looks like the example placeholder`);
  }
}

if (missing.length) {
  console.error(
    "Missing or empty in .env / .env.local:",
    missing.join(", "),
  );
  console.error("Copy .env.example and set real values.");
  process.exit(1);
}

if (weak.length) {
  console.warn("Warnings:");
  for (const w of weak) console.warn("  -", w);
}

console.log("Environment check OK (required keys present).");
