/**
 * Checks that every internal link in every MDX file resolves to a real page.
 *
 * "Internal" means the href starts with "/" and is not an anchor-only link.
 * External links (http/https) are skipped — use lychee for those.
 *
 * Catches two patterns:
 *   Markdown:  [text](/slug)
 *   JSX/MDX:   href="/slug"
 */

import { readFileSync, readdirSync, statSync } from "fs";
import { join, relative } from "path";

// ── Config ────────────────────────────────────────────────────────────────────

const CONTENT_DIR = join(import.meta.dirname, "../content/docs");
const CONTENT_ROOT = join(import.meta.dirname, "..");

// Routes that exist as special Next.js pages, not content-collections docs.
// These are valid destinations even though they have no MDX file.
const SPECIAL_ROUTES = new Set([
  "/api-reference",
]);

// ── Collect all valid slugs ───────────────────────────────────────────────────

function mdxFilesIn(dir: string): string[] {
  const entries = readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...mdxFilesIn(full));
    } else if (entry.name.endsWith(".mdx")) {
      files.push(full);
    }
  }
  return files;
}

function fileToSlug(absPath: string): string {
  // content/docs/foo/bar.mdx  →  foo/bar
  return relative(CONTENT_DIR, absPath).replace(/\.mdx$/, "");
}

const allFiles = mdxFilesIn(CONTENT_DIR);
const validSlugs = new Set(allFiles.map(fileToSlug));

// ── Extract internal links from MDX source ────────────────────────────────────

// Matches [text](/path) — markdown link syntax
const MD_LINK = /\[[^\]]*\]\((\/[^)#\s][^)]*)\)/g;
// Matches href="/path" — JSX attribute syntax
const JSX_HREF = /href="(\/[^"#][^"]*)"/g;

type BrokenLink = {
  file: string;
  line: number;
  href: string;
};

function checkFile(absPath: string): BrokenLink[] {
  const src = readFileSync(absPath, "utf8");
  const rel = relative(CONTENT_ROOT, absPath);
  const broken: BrokenLink[] = [];

  function lineOf(index: number): number {
    return src.slice(0, index).split("\n").length;
  }

  function check(href: string, index: number) {
    // Strip query string and trailing slash for comparison
    const clean = href.replace(/\/$/, "").replace(/\?.*$/, "");
    if (SPECIAL_ROUTES.has(clean)) return;
    // Convert /foo/bar  →  foo/bar  to compare against slugs
    const slug = clean.replace(/^\//, "");
    if (!validSlugs.has(slug)) {
      broken.push({ file: rel, line: lineOf(index), href });
    }
  }

  for (const m of src.matchAll(MD_LINK)) {
    check(m[1], m.index!);
  }
  for (const m of src.matchAll(JSX_HREF)) {
    check(m[1], m.index!);
  }

  return broken;
}

// ── Run ───────────────────────────────────────────────────────────────────────

const allBroken: BrokenLink[] = [];
let totalLinks = 0;

for (const file of allFiles) {
  const src = readFileSync(file, "utf8");
  const mdCount = [...src.matchAll(MD_LINK)].length;
  const jsxCount = [...src.matchAll(JSX_HREF)].length;
  totalLinks += mdCount + jsxCount;
  allBroken.push(...checkFile(file));
}

const fileCount = allFiles.length;
const mark = allBroken.length === 0 ? "✓" : "✗";
console.log(`${mark} Internal links     (${totalLinks} links in ${fileCount} files, ${allBroken.length} broken)`);

if (allBroken.length > 0) {
  // Group by file for readable output
  const byFile = new Map<string, BrokenLink[]>();
  for (const b of allBroken) {
    if (!byFile.has(b.file)) byFile.set(b.file, []);
    byFile.get(b.file)!.push(b);
  }

  console.log("");
  for (const [file, links] of byFile) {
    console.log(`  ${file}`);
    for (const { line, href } of links) {
      console.log(`    line ${line}  →  ${href}  (no matching page)`);
    }
  }
  console.log("");
  process.exit(1);
}
