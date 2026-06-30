import { notFound } from "next/navigation";
import { getDocBySlug, buildNavTree } from "@/lib/nav";
import { Sidebar } from "@/components/Sidebar";
import { TableOfContents } from "@/components/TableOfContents";
import { MDXRenderer } from "@/components/MDXRenderer";

export function DocLayout({ slug }: { slug: string[] }) {
  const doc = getDocBySlug(slug);
  if (!doc) notFound();

  const groups = buildNavTree();

  return (
    <div className="docs-layout">
      <Sidebar groups={groups} activeSlug={doc.slug} />
      <article className="docs-content">
        <h1>{doc.title}</h1>
        {doc.description && (
          <p style={{ color: "var(--fg-muted)" }}>{doc.description}</p>
        )}
        <MDXRenderer code={doc.mdx} />
      </article>
      <TableOfContents headings={doc.headings} />
    </div>
  );
}

export function docMetadata(slug: string[]) {
  const doc = getDocBySlug(slug);
  if (!doc) return {};
  return { title: doc.title, description: doc.description };
}
