/**
 * Global text variables for the docs.
 *
 * Use these anywhere in MDX instead of hard-coding strings.
 * Change a value here and it updates in every doc on the next build.
 *
 * Usage in MDX:
 *   import { vars } from "@/lib/vars"
 *   The current version is {vars.version}.
 */
export const vars = {
  productName: "Pepa",
  version: "1.0.0",
  repoUrl: "https://github.com/your-org/pepa",
  docsUrl: "https://your-org.github.io/pepa",
} as const;
