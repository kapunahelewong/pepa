import Link from "next/link";
import type { NavGroup } from "@/lib/nav";

export function Sidebar({ groups, activeSlug }: { groups: NavGroup[]; activeSlug?: string }) {
  return (
    <nav className="docs-sidebar" aria-label="Documentation">
      {groups.map((group) => (
        <div key={group.label} style={{ marginBottom: "1.5rem" }}>
          <div style={{ fontWeight: 600, marginBottom: "0.5rem" }}>{group.label}</div>
          <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {group.items.map((item) => {
              const isActive = item.slug === activeSlug;
              return (
                <li key={item.slug} style={{ marginBottom: "0.35rem" }}>
                  <Link
                    href={`/${item.slug}`}
                    aria-current={isActive ? "page" : undefined}
                    style={{
                      color: isActive ? "var(--accent)" : "var(--fg-muted)",
                      fontWeight: isActive ? 600 : 400,
                      textDecoration: "none",
                    }}
                  >
                    {item.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
