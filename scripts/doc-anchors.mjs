#!/usr/bin/env node
// Every `#fragment` pointer in this repository's markdown lands on something that exists.
// See scripts/lib/doc-anchors.mjs for why this executes instead of being a convention, and
// for what it deliberately does not check.
//
//   node scripts/doc-anchors.mjs            # report and exit 1 on any dead fragment
//   node scripts/doc-anchors.mjs --list     # also list every anchor each target defines

import { execFileSync } from "node:child_process";
import { checkFiles } from "./lib/doc-anchors.mjs";

const root = new URL("..", import.meta.url).pathname.replace(/\/$/, "");

const files = execFileSync("git", ["-C", root, "ls-files", "*.md", "**/*.md"], { encoding: "utf8" })
  .split("\n")
  .filter(Boolean)
  .filter((f) => !f.startsWith("node_modules/"));

const findings = checkFiles(files, { root });

console.log(`doc anchors: ${files.length} markdown file(s) scanned`);

if (!findings.length) {
  console.log("\nOK every relative #fragment resolves to an anchor its target defines.");
  process.exit(0);
}

const byReason = new Map();
for (const f of findings) {
  const key = `${f.target}#${f.fragment}`;
  if (!byReason.has(key)) byReason.set(key, { ...f, count: 0, where: [] });
  const e = byReason.get(key);
  e.count += 1;
  if (e.where.length < 4) e.where.push(`${f.file}:${f.line}`);
}

console.error(`\n${findings.length} dead fragment link(s), ${byReason.size} distinct target(s):\n`);
for (const [key, e] of [...byReason.entries()].sort((a, b) => b[1].count - a[1].count)) {
  console.error(`  ${String(e.count).padStart(3)} x  ${key}`);
  console.error(`         ${e.reason}`);
  console.error(`         e.g. ${e.where.join(", ")}${e.count > e.where.length ? ", …" : ""}`);
}
console.error(`\nFAIL a fragment that matches no anchor scrolls nowhere and reports nothing.`);
process.exit(1);
