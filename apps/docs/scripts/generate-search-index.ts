import { writeFileSync } from "node:fs";
import { join } from "node:path";
// Standalone scripts (run via tsx, outside Next's webpack/turbopack plugin)
// can't resolve the "content-collections" virtual module the way app code
// can — that resolution is provided by withContentCollections() at Next
// build time. So scripts import straight from the generated JSON instead;
// `content-collections build` (run by the `collect` script below) is what
// produces it.
import { allDocs } from "../.content-collections/generated/index.js";

// This is the static-search workaround the README mentions: no server
// means no search API route, so instead we ship a prebuilt index as a JSON
// file and let MiniSearch run entirely in the browser. Fine up to roughly
// a few thousand pages; past that, swap this for Pagefind without changing
// anything else about the architecture.
const records = allDocs
  .filter((doc) => !doc.hidden)
  .map((doc) => ({
    id: doc.slug,
    title: doc.title,
    description: doc.description ?? "",
    // Strip MDX/JSX down to plain text so the index isn't full of markup
    body: doc.content.replace(/```[\s\S]*?```/g, "").replace(/[#>*_`]/g, ""),
    slug: doc.slug,
  }));

const outPath = join(process.cwd(), "public", "search-index.json");
writeFileSync(outPath, JSON.stringify(records));

console.log(`Wrote search index with ${records.length} docs to ${outPath}`);
