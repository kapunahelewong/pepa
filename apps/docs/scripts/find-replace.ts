#!/usr/bin/env node
/**
 * Interactive find-and-replace sweep across all MDX doc content.
 *
 * Usage:
 *   pnpm find-replace "old text" "new text"              # interactive per-match
 *   pnpm find-replace "old text" "new text" --write      # accept all without prompting
 *   pnpm find-replace "old-(\\w+)" "new-$1" --regex      # regex mode, interactive
 *   pnpm find-replace "old text" "new text" --dry-run    # print matches only, no prompts
 */
import { readFileSync, writeFileSync } from "node:fs";
import { globSync } from "glob";
import path from "node:path";

const RESET = "\x1b[0m";
const BOLD = "\x1b[1m";
const DIM = "\x1b[2m";
const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const CYAN = "\x1b[36m";

const args = process.argv.slice(2);
const writeAll = args.includes("--write");
const dryRun = args.includes("--dry-run");
const useRegex = args.includes("--regex");
const positional = args.filter((a) => !a.startsWith("--"));

const [search, replacement] = positional;

if (!search || replacement === undefined) {
  console.error('Usage: pnpm find-replace "search" "replace" [--regex] [--write] [--dry-run]');
  process.exit(1);
}

const CONTEXT_LINES = 2;

type Match = {
  file: string;
  lineIndex: number;
  lines: string[];
  original: string;
  replaced: string;
};

function findMatches(file: string, content: string, pattern: string | RegExp): Match[] {
  const lines = content.split("\n");
  const matches: Match[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const hasMatch = useRegex
      ? (pattern as RegExp).test(line)
      : line.includes(search);

    // Reset lastIndex for global regex
    if (useRegex) (pattern as RegExp).lastIndex = 0;

    if (!hasMatch) continue;

    const replaced = useRegex
      ? line.replace(pattern as RegExp, replacement)
      : line.split(search).join(replacement);

    const start = Math.max(0, i - CONTEXT_LINES);
    const end = Math.min(lines.length - 1, i + CONTEXT_LINES);
    const contextLines = lines.slice(start, end + 1).map((l, idx) => {
      const lineNum = start + idx + 1;
      const isCurrent = start + idx === i;
      return `${DIM}${String(lineNum).padStart(4)} │${RESET} ${isCurrent ? BOLD : ""}${l}${isCurrent ? RESET : ""}`;
    });

    matches.push({ file, lineIndex: i, lines: contextLines, original: line, replaced });
  }

  return matches;
}

function applyAccepted(file: string, content: string, accepted: Match[]): string {
  const lines = content.split("\n");
  for (const m of accepted) {
    lines[m.lineIndex] = m.replaced;
  }
  return lines.join("\n");
}

async function promptKey(question: string): Promise<string> {
  process.stdout.write(question);
  return new Promise((resolve) => {
    const stdin = process.stdin;
    if (typeof (stdin as NodeJS.ReadStream).setRawMode === "function") {
      (stdin as NodeJS.ReadStream).setRawMode(true);
      stdin.resume();
      stdin.setEncoding("utf-8");
      stdin.once("data", (data: string) => {
        (stdin as NodeJS.ReadStream).setRawMode(false);
        stdin.pause();
        process.stdout.write("\n");
        resolve(data);
      });
    } else {
      // Non-TTY fallback: read a line
      stdin.resume();
      stdin.setEncoding("utf-8");
      let buf = "";
      stdin.on("data", function handler(chunk: string) {
        buf += chunk;
        if (buf.includes("\n")) {
          stdin.removeListener("data", handler);
          stdin.pause();
          resolve(buf.trim()[0] ?? "n");
        }
      });
    }
  });
}

const pattern = useRegex ? new RegExp(search, "g") : search;
const contentDir = path.join(process.cwd(), "content");
const files = globSync(`${contentDir}/**/*.mdx`);

// Collect all matches across all files
const allMatches: Match[] = [];
for (const file of files) {
  const content = readFileSync(file, "utf-8");
  const matches = findMatches(file, content, pattern);
  allMatches.push(...matches);
}

if (allMatches.length === 0) {
  console.log(`No matches for ${CYAN}${search}${RESET}.`);
  process.exit(0);
}

const totalFiles = new Set(allMatches.map((m) => m.file)).size;
console.log(
  `\nFound ${BOLD}${allMatches.length}${RESET} match${allMatches.length === 1 ? "" : "es"} in ${totalFiles} file${totalFiles === 1 ? "" : "s"}.\n`
);

if (dryRun) {
  for (const m of allMatches) {
    const rel = path.relative(process.cwd(), m.file);
    console.log(`${CYAN}${rel}${RESET} line ${m.lineIndex + 1}`);
    console.log(m.lines.join("\n"));
    console.log(`  ${RED}- ${m.original.trim()}${RESET}`);
    console.log(`  ${GREEN}+ ${m.replaced.trim()}${RESET}\n`);
  }
  console.log("Dry run — no changes written.");
  process.exit(0);
}

// Interactive or accept-all mode
const accepted = new Set<Match>();
let acceptAll = writeAll;

for (let i = 0; i < allMatches.length; i++) {
  const m = allMatches[i];
  const rel = path.relative(process.cwd(), m.file);

  if (acceptAll) {
    accepted.add(m);
    continue;
  }

  console.log(`\n${CYAN}${rel}${RESET} — match ${i + 1} of ${allMatches.length}`);
  console.log(m.lines.join("\n"));
  console.log(`  ${RED}- ${m.original.trim()}${RESET}`);
  console.log(`  ${GREEN}+ ${m.replaced.trim()}${RESET}`);

  const key = await promptKey(
    `\n${YELLOW}Accept? [y]es / [n]o / [a]ll / [q]uit:${RESET} `
  );

  if (key === "y" || key === "Y") {
    accepted.add(m);
  } else if (key === "a" || key === "A") {
    accepted.add(m);
    // Accept all remaining too
    for (let j = i + 1; j < allMatches.length; j++) accepted.add(allMatches[j]);
    break;
  } else if (key === "q" || key === "Q" || key === "\x03") {
    console.log("\nAborted.");
    process.exit(0);
  }
  // 'n' or anything else: skip
}

if (accepted.size === 0) {
  console.log("\nNo changes accepted.");
  process.exit(0);
}

// Group accepted matches by file and apply
const byFile = new Map<string, Match[]>();
for (const m of accepted) {
  const list = byFile.get(m.file) ?? [];
  list.push(m);
  byFile.set(m.file, list);
}

for (const [file, matches] of byFile) {
  const content = readFileSync(file, "utf-8");
  const updated = applyAccepted(file, content, matches);
  writeFileSync(file, updated);
  const rel = path.relative(process.cwd(), file);
  console.log(`Updated ${CYAN}${rel}${RESET} (${matches.length} change${matches.length === 1 ? "" : "s"})`);
}

console.log(`\n${GREEN}✓${RESET} Applied ${accepted.size} of ${allMatches.length} matches.`);
