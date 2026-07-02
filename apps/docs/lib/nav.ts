import { allDocs } from "content-collections";

export type NavItem = {
  title: string;
  slug: string;
  order: number;
};

export type NavSubGroup = {
  label: string;
  items: NavItem[];
};

export type NavGroup = {
  label: string;
  items: NavItem[];
  subgroups: NavSubGroup[];
};

export function buildNavTree(section = "docs"): NavGroup[] {
  const visible = allDocs.filter((doc) => !doc.hidden && doc.section === section);

  const groupMap = new Map<string, { items: NavItem[]; subMap: Map<string, NavItem[]> }>();

  for (const doc of visible) {
    if (!groupMap.has(doc.nav)) {
      groupMap.set(doc.nav, { items: [], subMap: new Map() });
    }
    const group = groupMap.get(doc.nav)!;
    const item: NavItem = { title: doc.title, slug: doc.slug, order: doc.order };

    if (doc.navParent) {
      const sub = group.subMap.get(doc.navParent) ?? [];
      sub.push(item);
      group.subMap.set(doc.navParent, sub);
    } else {
      group.items.push(item);
    }
  }

  const sortItems = (items: NavItem[]) =>
    items.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));

  return Array.from(groupMap.entries()).map(([label, { items, subMap }]) => ({
    label,
    items: sortItems(items),
    subgroups: Array.from(subMap.entries()).map(([sublabel, subitems]) => ({
      label: sublabel,
      items: sortItems(subitems),
    })),
  }));
}

export function getDocBySlug(slug: string[]) {
  const path = slug.join("/");
  return allDocs.find((doc) => doc.slug === path);
}
