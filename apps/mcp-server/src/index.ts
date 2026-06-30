import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";

export interface Env {
  DOCS_SITE_URL: string;
}

/**
 * Deliberately thin: this Worker holds no content of its own. It fetches
 * llms.txt / llms-full.txt from the already-deployed static docs site at
 * request time (cached briefly via the Workers Cache API) and exposes that
 * as MCP tools. That keeps this server's only job "speak MCP", with zero
 * risk of drifting out of sync with the actual docs — there's nothing here
 * to forget to update when content changes.
 *
 * This is a Worker, not a long-lived Node process, so the server and
 * transport are constructed fresh per request (stateless mode) rather than
 * held open across requests.
 */
async function fetchDocsIndex(siteUrl: string): Promise<{ slug: string; title: string; description: string }[]> {
  const cache = caches.default;
  const cacheKey = new Request(`${siteUrl}/llms.txt`);
  const cached = await cache.match(cacheKey);
  const res = cached ?? (await fetch(cacheKey));
  if (!cached) await cache.put(cacheKey, res.clone());

  const text = await res.text();
  // Lines look like: "- [Title](https://.../slug): description"
  const lines = text.split("\n").filter((l) => l.startsWith("- ["));
  return lines.map((line) => {
    const titleMatch = line.match(/\[(.*?)\]/);
    const urlMatch = line.match(/\((.*?)\)/);
    const descMatch = line.match(/\):\s*(.*)$/);
    const url = urlMatch?.[1] ?? "";
    return {
      slug: url.replace(siteUrl, "").replace(/^\//, ""),
      title: titleMatch?.[1] ?? url,
      description: descMatch?.[1] ?? "",
    };
  });
}

async function fetchDoc(siteUrl: string, slug: string): Promise<string | null> {
  const cache = caches.default;
  const cacheKey = new Request(`${siteUrl}/llms-full.txt`);
  const cached = await cache.match(cacheKey);
  const res = cached ?? (await fetch(cacheKey));
  if (!cached) await cache.put(cacheKey, res.clone());

  const full = await res.text();
  const sections = full.split("\n\n---\n\n");
  // Each section starts with "# Title" — match against the requested slug's
  // title via the index, or just substring-match the slug as a fallback.
  return sections.find((s) => s.toLowerCase().includes(slug.toLowerCase())) ?? null;
}

function buildServer(siteUrl: string): McpServer {
  const server = new McpServer({ name: "docs-platform", version: "0.1.0" });

  server.tool(
    "list_docs",
    "List every page in the documentation site, with a one-line description of each.",
    {},
    async () => {
      const docs = await fetchDocsIndex(siteUrl);
      return {
        content: [{ type: "text", text: JSON.stringify(docs, null, 2) }],
      };
    }
  );

  server.tool(
    "get_doc",
    "Fetch the full content of one documentation page by its slug (from list_docs).",
    { slug: z.string().describe("Doc slug, e.g. 'getting-started' or 'api/authentication'") },
    async ({ slug }) => {
      const content = await fetchDoc(siteUrl, slug);
      if (!content) {
        return { content: [{ type: "text", text: `No doc found for slug "${slug}".` }], isError: true };
      }
      return { content: [{ type: "text", text: content }] };
    }
  );

  return server;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/" && request.method === "GET") {
      return new Response(
        "docs-platform MCP server. Point an MCP-compatible client at this URL's /mcp endpoint.",
        { headers: { "content-type": "text/plain" } }
      );
    }

    if (url.pathname === "/mcp") {
      const server = buildServer(env.DOCS_SITE_URL);
      const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
      await server.connect(transport);
      return transport.handleRequest(request);
    }

    return new Response("Not found", { status: 404 });
  },
};
