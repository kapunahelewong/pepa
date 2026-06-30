# Pepa

An open-source documentation platform: write docs in MDX, get a fast static
site, full-text search, API reference support, and a connector that lets AI
agents (Claude, Cursor, etc.) query your docs directly.

## Why two apps instead of one

The docs site (`apps/docs`) is a **static Next.js export** — no server, no
database, deployable to GitHub Pages or literally any static host. That's
deliberate: it keeps the core product free to host and dependency-free.

The one piece that genuinely needs a server — the MCP connector that lets AI
agents query the docs live — lives in its own app (`apps/mcp-server`) and
deploys independently as a Cloudflare Worker. It has its own build, its own
deploy workflow, and its own lifecycle. You can iterate on it, or skip it
entirely, without touching the docs site.

```
apps/
  docs/         Next.js, static export → GitHub Pages
  mcp-server/   Cloudflare Worker, serves docs to AI agents over MCP
packages/
  ui/           Shared MDX components (Callout, Tabs, CodeGroup, ...)
```

## Getting started

```bash
pnpm install
pnpm dev          # docs site at localhost:3000
```

## Deploying

Both apps deploy independently via GitHub Actions, scoped with `paths:`
filters so a docs change doesn't trigger an MCP server redeploy and vice
versa. See `.github/workflows/`.

- `ci.yml` — lint, typecheck, build, and link-check on every PR
- `docs-deploy.yml` — builds the static export and publishes to GitHub Pages
- `mcp-deploy.yml` — deploys the Worker via Wrangler

## Status

This is an early scaffold: content layer, layout, dark mode, and the MCP
server skeleton are wired up. Search indexing, the OpenAPI reference pages,
and the maintainer find-and-replace CLI are next.
