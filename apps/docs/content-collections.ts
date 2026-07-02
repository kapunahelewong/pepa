import { defineCollection, defineConfig } from "@content-collections/core";
import { compileMDX } from "@content-collections/mdx";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import remarkGfm from "remark-gfm";

// Schema is the guardrail for a multi-maintainer project: a doc missing
// `title` or shipping a typo'd `nav` group fails the build instead of
// failing silently in production. That's the main thing you lose by
// hand-rolling MDX parsing instead of using a content layer.
const docs = defineCollection({
  name: "docs",
  directory: "content/docs",
  include: "**/*.mdx",
  schema: (z) => ({
    title: z.string(),
    description: z.string().optional(),
    // Diátaxis content type — drives page-level rendering hints
    type: z.enum([
      "tutorial",
      "how-to",
      "reference",
      "explanation",
      "quickstart",
      "changelog",
      "faq",
      "glossary",
      "cookbook",
      "architecture",
      "migration",
    ]).optional(),
    // Page lifecycle status — only set when non-stable; absence means stable
    status: z.enum(["beta", "experimental", "deprecated"]).optional(),
    // Top-level tab this page belongs to (maps to pepa.config sections)
    section: z.enum(["docs", "api-reference", "cookbook", "contributors"]).default("docs"),
    // Sidebar group label within the section
    nav: z.enum([
      "Tutorials",
      "How-to Guides",
      "Reference",
      "Explanation",
      "Quickstart",
      "Changelog",
      "FAQ",
      "Glossary",
    ]).default("Tutorials"),
    // Optional sub-section within the nav group (creates a collapsible group)
    navParent: z.string().optional(),
    // Manual ordering within a nav section; lower sorts first
    order: z.number().default(999),
    // Set true to exclude from the sidebar (e.g. landing pages)
    hidden: z.boolean().default(false),
  }),
  transform: async (doc, context) => {
    const mdx = await compileMDX(context, doc, {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [
        rehypeSlug, // gives every heading an id, which the TOC needs
        [rehypeAutolinkHeadings, { behavior: "wrap" }],
        [rehypePrettyCode, { theme: { dark: "github-dark", light: "github-light" } }],
      ],
    });

    // Lightweight heading extraction for the right-hand TOC. A regex pass
    // over the raw source is enough here — it mirrors what rehype-slug
    // will produce (kebab-case ids) without needing a second AST walk.
    const headings = Array.from(doc.content.matchAll(/^(#{2,3})\s+(.+)$/gm)).map((m) => {
      const depth = m[1].length;
      const text = m[2].trim();
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-");
      return { depth, text, id };
    });

    return {
      ...doc,
      mdx,
      headings,
      // Slug derived from file path, e.g. content/docs/api/auth.mdx -> /api/auth
      slug: doc._meta.path,
    };
  },
});

export default defineConfig({
  collections: [docs],
});
