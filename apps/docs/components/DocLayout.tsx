import { notFound } from "next/navigation";
import { getDocBySlug, buildNavTree } from "@/lib/nav";
import { Sidebar } from "@/components/Sidebar";
import { TableOfContents } from "@/components/TableOfContents";
import { MDXRenderer } from "@/components/MDXRenderer";
import { CopyPageButton } from "@/components/CopyPageButton";

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

  return (
    <div className="docs-layout">
      <Sidebar groups={groups} activeSlug={doc.slug} />
      <article className="docs-content">
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
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
