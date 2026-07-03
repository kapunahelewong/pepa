import { notFound } from "next/navigation";
import { getDocBySlug, buildNavTree, getAdjacentDocs } from "@/lib/nav";
import { Sidebar } from "@/components/Sidebar";
import { TableOfContents } from "@/components/TableOfContents";
import { MDXRenderer } from "@/components/MDXRenderer";
import { CopyPageButton } from "@/components/CopyPageButton";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageFooter } from "@/components/PageFooter";

const STATUS_STYLES: Record<string, { label: string; bg: string; color: string }> = {
  beta:         { label: "Beta",         bg: "#dbeafe", color: "#1d4ed8" },
  experimental: { label: "Experimental", bg: "#fef3c7", color: "#92400e" },
  deprecated:   { label: "Deprecated",   bg: "#fee2e2", color: "#991b1b" },
};

export function DocLayout({ slug }: { slug: string[] }) {
  const doc = getDocBySlug(slug);
  if (!doc) notFound();

  const groups = buildNavTree(doc.section);
  const badge = doc.status ? STATUS_STYLES[doc.status] : null;
  const { prev, next } = getAdjacentDocs(doc.slug, doc.section);

  return (
    <div className="docs-layout">
      <Sidebar groups={groups} activeSlug={doc.slug} />
      <article className="docs-content">
        <Breadcrumbs section={doc.section} navGroup={doc.nav} />
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", marginTop: "0.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
            <h1 style={{ margin: 0 }}>{doc.title}</h1>
            {badge && (
              <span style={{
                fontSize: "0.75rem",
                fontWeight: 600,
                padding: "0.2rem 0.55rem",
                borderRadius: "999px",
                background: badge.bg,
                color: badge.color,
                letterSpacing: "0.02em",
                whiteSpace: "nowrap",
              }}>
                {badge.label}
              </span>
            )}
          </div>
          {doc.copyable && <CopyPageButton />}
        </div>
        {doc.description && (
          <p style={{ color: "var(--fg-muted)", marginBottom: "0.5rem" }}>{doc.description}</p>
        )}
        <p className="page-stats">
          <span className="page-stats-words">{doc.wordCount.toLocaleString()} words</span>
          <span className="page-stats-sep">·</span>
          <span className="page-stats-time">{doc.readingMinutes} min read</span>
        </p>
        <MDXRenderer code={doc.mdx} />
        <PageFooter prev={prev} next={next} slug={doc.slug} />
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
