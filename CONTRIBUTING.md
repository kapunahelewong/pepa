# Contributing

## Workflow

1. Branch off `main`: `git checkout -b docs/short-description` (prefix
   branches by type — `docs/`, `fix/`, `chore/` — it makes the PR list
   scannable).
2. Commit using [Conventional Commits](https://www.conventionalcommits.org/)
   (`docs:`, `fix:`, `chore:`, `feat:`). This isn't enforced by a commit hook
   yet — that's a reasonable next addition (commitlint + husky) once there's
   more than one contributor.
3. Open a PR. `ci.yml` runs lint, typecheck, a full build, and a link check
   automatically.
4. Once merged to `main`, `docs-deploy.yml` and/or `mcp-deploy.yml` fire
   automatically, scoped to whichever part of the repo actually changed.

## Adding a doc

Create an `.mdx` file under `apps/docs/content/docs/`. Required frontmatter:

```yaml
---
title: Your Page Title
description: One sentence, shown under the title and used in search results.
nav: Guides       # which sidebar section this belongs to
order: 2          # position within that section, lower sorts first
---
```

The build fails if `title` is missing — that's intentional, see
`content-collections.ts`.

## Renaming something across many docs

Don't hand-edit every file. From `apps/docs`:

```bash
pnpm find-replace "old term" "new term"            # dry run, shows what would change
pnpm find-replace "old term" "new term" --write     # applies it
```

## Adding a shared component

Components used inside MDX live in `packages/ui/src`. Export it from
`packages/ui/src/index.tsx`, then register it in
`apps/docs/components/MDXRenderer.tsx` so MDX authors can `import` and use
it by name.
