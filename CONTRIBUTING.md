# Contributing to Pepa

## Workflow

1. Branch off `main`: `git checkout -b docs/short-description`
   Use branch prefixes: `docs/`, `fix/`, `feat/`, `chore/`.
2. Commit with [Conventional Commits](https://www.conventionalcommits.org/):
   `docs:`, `fix:`, `feat:`, `chore:`.
3. Open a PR. CI runs lint, typecheck, build, and link-check automatically.
4. Merge to `main` triggers deploy (docs and/or MCP server, based on what changed).

## Adding a doc

Create an `.mdx` file under `apps/docs/content/docs/`. Frontmatter fields:

```yaml
---
title: Page Title                  # required — build fails without it
description: One-sentence summary  # shown under the title and in search
type: how-to                       # tutorial | how-to | reference | explanation |
                                   # quickstart | changelog | faq | glossary |
                                   # cookbook | architecture | migration
section: docs                      # docs | api-reference | cookbook | contributors
nav: How-to Guides                 # Tutorials | How-to Guides | Reference |
                                   # Explanation | Quickstart | Changelog | FAQ | Glossary
order: 2                           # position within the sidebar group, lower sorts first
status: beta                       # beta | experimental | deprecated — omit for stable pages
hidden: false                      # true = present in build but excluded from nav
---
```

**Diátaxis types at a glance** — pick the right `type` for the content:

| Type | Audience mindset | Example |
|------|-----------------|---------|
| `tutorial` | Learning | "Build your first widget" |
| `how-to` | "I have a problem to solve" | "How to paginate results" |
| `reference` | Looking something up | API parameter list |
| `explanation` | "Why does this work this way?" | Auth design rationale |
| `quickstart` | Fastest path to working | "Up in 5 minutes" |

## Marking a page as non-stable

Add a `status` field. Stable pages get no badge — only flag pages that
actually need the warning:

```yaml
status: beta          # blue badge
status: experimental  # orange badge
status: deprecated    # red badge
```

## Reusable content (snippets and vars)

**Short text variables** — defined in `apps/docs/lib/vars.ts`:

```mdx
import { vars } from "@/lib/vars"

Current version: {vars.version}
```

Edit `vars.ts` to update the value everywhere it's used.

**Content snippets** — reusable blocks of any size, defined in
`packages/ui/src/snippets/`. Edit the component once; it updates in every doc:

```mdx
import { AuthNote, BearerExample } from "docs-ui/snippets"

<AuthNote />
<BearerExample />
```

To add a new snippet: create a component in `packages/ui/src/snippets/`,
export it from `packages/ui/src/snippets/index.tsx`.

## Using MDX components

All components from `docs-ui` are available in MDX:

```mdx
import { Callout, Tabs, Tab, CodeGroup, Kbd, Icon } from "docs-ui"
import { ExternalLink } from "lucide-react"

<Callout type="tip">Tip text here.</Callout>
<Callout type="warning">Warning text here.</Callout>

Press <Kbd>⌘K</Kbd> to search.

<Icon icon={ExternalLink} size={14} />
```

**Adding a new shared component**: create it in `packages/ui/src/`, export
from `packages/ui/src/index.tsx`, then add it to the components map in
`apps/docs/components/MDXRenderer.tsx` so it's available without explicit
imports in MDX.

## Sweeping for a term across all docs

```bash
# From apps/docs/
pnpm find-replace "old term" "new term"            # interactive: y/n/a/q per match
pnpm find-replace "old term" "new term" --dry-run  # preview only, writes nothing
pnpm find-replace "old term" "new term" --write    # accept all without reviewing
pnpm find-replace "old-(\\w+)" "new-$1" --regex   # regex with capture groups
```

The interactive mode shows each match with surrounding context (±2 lines),
the before/after diff, and a prompt. Keys: `y` accept, `n` skip, `a` accept
all remaining, `q` quit.

## Style linting (Google Developer Style Guide)

First-time setup (once per machine):

```bash
brew install vale
pnpm vale:sync   # run from repo root — downloads Google style rules
```

Run from the repo root:

```bash
pnpm lint:style                                             # all docs
pnpm lint:style apps/docs/content/docs/getting-started.mdx # single file
```

Vale reports violations with file, line, and a plain-English explanation.
`MinAlertLevel = suggestion` in `.vale.ini` means all severity levels show up.
Raise it to `warning` or `error` if you want to ignore lower-severity hints.

## Updating the API reference

The reference is auto-rendered from `apps/docs/openapi/widgets.yaml`.
To swap in your real spec:

1. Replace `apps/docs/openapi/widgets.yaml` with your OpenAPI 3.1 spec.
2. The prebuild script copies it to `public/openapi/` automatically — do not
   edit `public/openapi/` directly.
3. Run `pnpm build` to verify the export still works.

## Configuring platform sections

Edit `apps/docs/pepa.config.ts` to enable or disable top-level nav tabs:

```ts
{ id: "cookbook",     enabled: true  }   // show Cookbook tab
{ id: "contributors", enabled: true  }   // show Contributors tab (open-source projects)
```

When `contributors` is enabled, pages with `section: contributors` in their
frontmatter appear under the Contributors tab with their own sidebar.
