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

export function buildNavTree(section = "docs"): NavGroup[] {
  const visible = allDocs.filter((doc) => !doc.hidden && doc.section === section);

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
