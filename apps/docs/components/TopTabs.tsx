"use client";

import { usePathname, useRouter } from "next/navigation";
import config from "@/pepa.config";

export function TopTabs() {
  const pathname = usePathname();
  const router = useRouter();

  const enabledSections = config.sections.filter((s) => s.enabled);

  return (
    <div className="top-tabs">
      {enabledSections.map((section) => {
        const firstSegment = pathname.split("/")[1];
        // "docs" section owns the root and any path not claimed by another section
        const isActive =
          firstSegment === section.id ||
          (section.id === "docs" &&
            !enabledSections.some((s) => s.id !== "docs" && firstSegment === s.id));
        return (
          <button
            key={section.id}
            aria-current={isActive}
            onClick={() => router.push(section.href)}
          >
            {section.label}
          </button>
        );
      })}
    </div>
  );
}
