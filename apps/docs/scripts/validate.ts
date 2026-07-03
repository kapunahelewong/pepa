/**
 * pnpm validate — runs all static checks in sequence.
 *
 *   1. Frontmatter & MDX  (content-collections build)
 *   2. TypeScript          (tsc --noEmit)
 *   3. Internal links      (validate-links.ts)
 *
 * Exits 0 if everything passes, 1 on the first failure.
 */

import { execSync } from "child_process";

const ROOT = new URL("../", import.meta.url).pathname;

function run(label: string, cmd: string) {
  const start = Date.now();
  try {
    execSync(cmd, { cwd: ROOT, stdio: "pipe" });
    const ms = Date.now() - start;
    console.log(`✓ ${label.padEnd(20)} (${ms}ms)`);
  } catch (err: any) {
    const ms = Date.now() - start;
    console.log(`✗ ${label.padEnd(20)} (${ms}ms)\n`);
    // Print stdout + stderr from the failed command
    const out = [err.stdout, err.stderr]
      .filter(Boolean)
      .map((b: Buffer) => b.toString().trim())
      .join("\n")
      .split("\n")
      .map((l: string) => `  ${l}`)
      .join("\n");
    if (out.trim()) console.log(out);
    console.log("");
    process.exit(1);
  }
}

console.log("");
run("Frontmatter & MDX", "pnpm collect");
run("TypeScript", "pnpm tsc --noEmit");
// Link check prints its own output line, so we let it write directly
try {
  execSync("pnpm tsx scripts/validate-links.ts", {
    cwd: ROOT,
    stdio: "inherit",
  });
} catch {
  process.exit(1);
}

console.log("\nAll checks passed.\n");
