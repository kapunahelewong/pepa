import Link from "next/link";
import type { NavGroup, NavItem } from "@/lib/nav";

function SidebarLink({ item, activeSlug }: { item: NavItem; activeSlug?: string }) {
  const isActive = item.slug === activeSlug;
  return (
    <li>
      <Link
        href={`/${item.slug}`}
        aria-current={isActive ? "page" : undefined}
        className={`sidebar-link${isActive ? " sidebar-link--active" : ""}`}
      >
        {item.title}
      </Link>
    </li>
  );
}

export function Sidebar({ groups, activeSlug }: { groups: NavGroup[]; activeSlug?: string }) {
  return (
    <nav className="docs-sidebar" aria-label="Documentation">
      {groups.map((group) => (
        <div key={group.label} className="sidebar-group">
          <div className="sidebar-group-label">{group.label}</div>

          {group.items.length > 0 && (
            <ul className="sidebar-list">
              {group.items.map((item) => (
                <SidebarLink key={item.slug} item={item} activeSlug={activeSlug} />
              ))}
            </ul>
          )}

          {group.subgroups.map((sub) => {
            const hasActive = sub.items.some((i) => i.slug === activeSlug);
            return (
              <details key={sub.label} className="sidebar-subgroup" open={hasActive || undefined}>
                <summary className="sidebar-subgroup-label">
                  <span>{sub.label}</span>
                  <svg
                    className="sidebar-chevron"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </summary>
                <ul className="sidebar-list sidebar-list--nested">
                  {sub.items.map((item) => (
                    <SidebarLink key={item.slug} item={item} activeSlug={activeSlug} />
                  ))}
                </ul>
              </details>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
