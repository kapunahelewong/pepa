#!/usr/bin/env node
/**
 * Find-and-replace across all doc content, scoped to MDX files so it can't
 * accidentally rewrite app code. Defaults to a dry run that prints a diff
 * preview; only writes files when --write is passed explicitly.
 *
 * Usage:
 *   pnpm find-replace "old text" "new text"            # dry run, prints matches
 *   pnpm find-replace "old text" "new text" --write     # actually rewrites files
 *   pnpm find-replace "old-(\\w+)" "new-$1" --regex --write
 */
import { readFileSync, writeFileSync } from "node:fs";
import { globSync } from "glob";
import path from "node:path";

const args = process.argv.slice(2);
const write = args.includes("--write");
const useRegex = args.includes("--regex");
const positional = args.filter((a) => !a.startsWith("--"));

const [search, replacement] = positional;

if (!search || replacement === undefined) {
  console.error('Usage: pnpm find-replace "search" "replace" [--regex] [--write]');
  process.exit(1);
}

const pattern = useRegex ? new RegExp(search, "g") : search;
const contentDir = path.join(process.cwd(), "content");
const files = globSync(`${contentDir}/**/*.mdx`);

let totalMatches = 0;
let filesChanged = 0;

for (const file of files) {
  const original = readFileSync(file, "utf-8");
  const matches = useRegex
    ? [...original.matchAll(pattern as RegExp)].length
    : original.split(search).length - 1;

  if (matches === 0) continue;

  totalMatches += matches;
  filesChanged += 1;

  const updated = useRegex
    ? original.replace(pattern as RegExp, replacement)
    : original.split(search).join(replacement);

  const relPath = path.relative(process.cwd(), file);
  console.log(`${write ? "Updated" : "Would update"} ${relPath} (${matches} match${matches === 1 ? "" : "es"})`);

  if (write) {
    writeFileSync(file, updated);
  }
}

console.log(
  `\n${totalMatches} match${totalMatches === 1 ? "" : "es"} across ${filesChanged} file${filesChanged === 1 ? "" : "s"}.`
);

if (!write && totalMatches > 0) {
  console.log("Dry run only — re-run with --write to apply changes.");
}
