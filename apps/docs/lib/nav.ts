import { allDocs } from "content-collections";

export type NavItem = {
  title: string;
  slug: string;
  order: number;
};

export type NavGroup = {
  label: string;
  items: NavItem[];
};

/**
 * Groups docs by their `nav` frontmatter field (e.g. "Guides", "API
 * Reference") and sorts within each group by `order`, then title.
 * This is the entire IA mechanism: the structure on disk + two frontmatter
 * fields, no separate nav-config file to keep in sync by hand.
 */
export function buildNavTree(): NavGroup[] {
  const visible = allDocs.filter((doc) => !doc.hidden);

  const groups = new Map<string, NavItem[]>();
  for (const doc of visible) {
    const group = groups.get(doc.nav) ?? [];
    group.push({ title: doc.title, slug: doc.slug, order: doc.order });
    groups.set(doc.nav, group);
  }

  return Array.from(groups.entries()).map(([label, items]) => ({
    label,
    items: items.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title)),
  }));
}

export function getDocBySlug(slug: string[]) {
  const path = slug.join("/");
  return allDocs.find((doc) => doc.slug === path);
}
