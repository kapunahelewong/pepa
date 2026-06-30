# mcp-server

A small Cloudflare Worker that lets AI agents (Claude Desktop, Claude Code,
Cursor, etc.) query this project's docs directly, instead of relying on
whatever the model already "knows" or scraping HTML.

It holds no content of its own — it fetches `llms.txt` / `llms-full.txt`
from the deployed docs site at request time and exposes two tools:

- `list_docs` — every page, with a one-line description
- `get_doc` — full content of one page by slug

## Local development

```bash
pnpm install
pnpm dev          # wrangler dev, serves at localhost:8787
```

## Deploying

```bash
pnpm deploy        # wrangler deploy
```

Or just push to `main` — `.github/workflows/mcp-deploy.yml` handles it,
scoped so it only runs when files under this directory change.

Set `DOCS_SITE_URL` in `wrangler.toml` to wherever `apps/docs` actually
deploys before going live.

## Connecting a client

Most MCP clients support a remote Streamable HTTP server by URL. Point yours
at:

```
https://docs-platform-mcp.<your-subdomain>.workers.dev/mcp
```

For Claude Desktop / Claude Code, that's typically added as a remote MCP
connector in settings rather than the `npx`-based local-server config you'd
use for a stdio server — this one needs no local process at all.

## Status

This is a working skeleton, not yet battle-tested: the doc-lookup logic
substring-matches against `llms-full.txt` rather than doing anything
smarter, and there's no rate limiting or auth. Both are reasonable next
steps once this is live.
