# Pepa

[![CI](https://github.com/kapunahelewong/pepa/actions/workflows/ci.yml/badge.svg)](https://github.com/kapunahelewong/pepa/actions/workflows/ci.yml) [![Deploy docs](https://github.com/kapunahelewong/pepa/actions/workflows/docs-deploy.yml/badge.svg)](https://github.com/kapunahelewong/pepa/actions/workflows/docs-deploy.yml)

An open-source documentation platform: write docs in MDX, get a fast static
site, full-text search, an API reference viewer, and a connector that lets AI
agents (Claude, Cursor, etc.) query your docs directly.

Check out the [Live Demo](https://kapunahelewong.github.io/pepa/).

## Repo layout

```
apps/
  docs/         Next.js static export → GitHub Pages (or any static host)
  mcp-server/   Cloudflare Worker — serves docs to AI agents over MCP
packages/
  ui/           Shared MDX components (Callout, Tabs, CodeGroup, Kbd, Icon, …)
```

The docs site has no server and no database. The MCP connector is the only
piece that needs a runtime, so it lives in its own app with its own deploy
lifecycle. You can use the docs site without it.

## Getting started

```bash
# Prerequisites: Node 20+, pnpm 9+
# One-time: install Vale for style linting (optional but recommended)
brew install vale

pnpm install
pnpm vale:sync   # downloads Google Developer Style Guide rules
pnpm dev         # docs site at http://localhost:3000
```

## Configuring your project

Edit `apps/docs/pepa.config.ts` to turn sections on or off:

```ts
sections: [
  { id: "docs",          label: "Docs",          href: "/getting-started", enabled: true  },
  { id: "api-reference", label: "API Reference",  href: "/api-reference",   enabled: true  },
  { id: "cookbook",      label: "Cookbook",       href: "/cookbook",        enabled: false },
  { id: "contributors",  label: "Contributors",   href: "/contributors",    enabled: false },
],
```

Enable `contributors` for open-source projects that need maintainer docs.

## Writing docs

Add `.mdx` files under `apps/docs/content/docs/`. Full frontmatter reference:

```yaml
---
title: Page Title                  # required
description: One-sentence summary  # shown under the title and in search
type: how-to                       # tutorial | how-to | reference | explanation |
                                   # quickstart | changelog | faq | glossary |
                                   # cookbook | architecture | migration
section: docs                      # docs | api-reference | cookbook | contributors
nav: How-to Guides                 # Tutorials | How-to Guides | Reference |
                                   # Explanation | Quickstart | Changelog | FAQ | Glossary
order: 2                           # position in sidebar, lower sorts first
status: beta                       # beta | experimental | deprecated (omit = stable)
hidden: false                      # true = excluded from nav (e.g. landing pages)
---
```

## MDX components

Import from `docs-ui` in any MDX file:

```mdx
import { Callout, Tabs, Tab, CodeGroup, Kbd, Icon } from "docs-ui"
import { AuthNote, BearerExample } from "docs-ui/snippets"
import { vars } from "@/lib/vars"
import { ExternalLink } from "lucide-react"

<Callout type="tip">Watch out!</Callout>

Press <Kbd>⌘K</Kbd> to open search.

<Icon icon={ExternalLink} /> links open in a new tab.

The current version is {vars.version}.

<AuthNote />   {/* reusable content snippet — edit in one place, updates everywhere */}
```

## Maintainer tools

### Sweep and replace

```bash
# From apps/docs/
pnpm find-replace "old term" "new term"           # interactive, per-match y/n/a/q
pnpm find-replace "old term" "new term" --dry-run  # preview only, no prompts
pnpm find-replace "old term" "new term" --write    # accept all without prompting
pnpm find-replace "old-(\\w+)" "new-$1" --regex   # regex mode
```

### Style linting (Google Developer Style Guide)

```bash
pnpm lint:style          # check all docs
pnpm lint:style apps/docs/content/docs/specific-file.mdx  # single file
```

### API reference

The API reference is powered by [Scalar](https://scalar.com). Replace
`apps/docs/openapi/widgets.yaml` with your real OpenAPI 3.1 spec and it
propagates automatically on the next build. The `public/openapi/` copy is
managed by the prebuild script — edit only the source in `openapi/`.

## Deploying

Both apps deploy via GitHub Actions with `paths:` filters so a docs change
doesn't trigger an MCP redeploy and vice versa.

- `ci.yml` — lint, typecheck, build, link-check on every PR
- `docs-deploy.yml` — static export → GitHub Pages
- `mcp-deploy.yml` — Cloudflare Worker via Wrangler

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).
