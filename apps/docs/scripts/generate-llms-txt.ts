import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { allDocs } from "../.content-collections/generated/index.js";

const SITE_URL = process.env.SITE_URL ?? "https://example.github.io/docs-platform";
const SITE_NAME = "docs-platform";

const docs = allDocs.filter((doc) => !doc.hidden);

// llms.txt: a curated index, one line per doc, cheap for an agent to scan
// before deciding what to fetch.
const llmsTxt = [
  `# ${SITE_NAME}`,
  "",
  "> Open-source documentation platform built with MDX and Next.js.",
  "",
  "## Docs",
  ...docs.map((doc) => `- [${doc.title}](${SITE_URL}/${doc.slug}): ${doc.description ?? ""}`),
].join("\n");

// llms-full.txt: the entire corpus inlined, for agents that want full
// context in one fetch rather than crawling each link.
const llmsFullTxt = docs
  .map((doc) => `# ${doc.title}\n\n${doc.description ?? ""}\n\n${doc.content}`)
  .join("\n\n---\n\n");

writeFileSync(join(process.cwd(), "public", "llms.txt"), llmsTxt);
writeFileSync(join(process.cwd(), "public", "llms-full.txt"), llmsFullTxt);

console.log(`Wrote llms.txt and llms-full.txt for ${docs.length} docs`);
