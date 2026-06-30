type Heading = { depth: number; text: string; id: string };

export function TableOfContents({ headings }: { headings: Heading[] }) {
  if (headings.length === 0) return null;

  return (
    <nav className="docs-toc" aria-label="On this page">
      <div style={{ fontWeight: 600, color: "var(--fg)", marginBottom: "0.5rem" }}>
        On this page
      </div>
      <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
        {headings.map((h) => (
          <li
            key={h.id}
            style={{
              marginBottom: "0.4rem",
              paddingLeft: h.depth === 3 ? "0.75rem" : 0,
            }}
          >
            <a href={`#${h.id}`} style={{ color: "inherit", textDecoration: "none" }}>
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
