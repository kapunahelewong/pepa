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

  return Array.from(groupMap.entries())
    .sort(([a], [b]) => {
      const ai = NAV_GROUP_ORDER.indexOf(a);
      const bi = NAV_GROUP_ORDER.indexOf(b);
      // Known groups sort by the canonical order; unknown groups go last
      if (ai === -1 && bi === -1) return a.localeCompare(b);
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    })
    .map(([label, { items, subMap }]) => ({
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

// Canonical order for nav groups — determines prev/next sequencing across groups.
const NAV_GROUP_ORDER = [
  "Quickstart",
  "Tutorials",
  "How-to Guides",
  "Reference",
  "Explanation",
  "Changelog",
  "FAQ",
  "Glossary",
];

export type AdjacentDoc = { title: string; slug: string } | null;

export function getAdjacentDocs(
  currentSlug: string,
  section: string
): { prev: AdjacentDoc; next: AdjacentDoc } {
  const visible = allDocs
    .filter((d) => !d.hidden && d.section === section)
    .sort((a, b) => {
      const ai = NAV_GROUP_ORDER.indexOf(a.nav);
      const bi = NAV_GROUP_ORDER.indexOf(b.nav);
      if (ai !== bi) return ai - bi;
      if (a.order !== b.order) return a.order - b.order;
      return a.title.localeCompare(b.title);
    });

  const idx = visible.findIndex((d) => d.slug === currentSlug);
  if (idx === -1) return { prev: null, next: null };

  return {
    prev: idx > 0 ? { title: visible[idx - 1].title, slug: visible[idx - 1].slug } : null,
    next: idx < visible.length - 1 ? { title: visible[idx + 1].title, slug: visible[idx + 1].slug } : null,
  };
}
