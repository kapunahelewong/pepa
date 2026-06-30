"use client";

import { usePathname, useRouter } from "next/navigation";

type Tab = { label: string; href: string };

const TABS: Tab[] = [
  { label: "Guides", href: "/getting-started" },
  { label: "API Reference", href: "/api/authentication" },
];

export function TopTabs() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="top-tabs">
      {TABS.map((tab) => {
        // A tab is "current" if the active path falls under its section,
        // not just on exact match — so any /api/* page keeps the API tab lit.
        const section = tab.href.split("/")[1];
        const isActive = pathname.split("/")[1] === section;
        return (
          <button
            key={tab.href}
            aria-current={isActive}
            onClick={() => router.push(tab.href)}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
