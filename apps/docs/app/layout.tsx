import type { ReactNode } from "react";
import { TopTabs } from "@/components/TopTabs";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SearchBox } from "@/components/SearchBox";
import "./globals.css";

export const metadata = {
  title: {
    default: "docs-platform",
    template: "%s · docs-platform",
  },
  description: "Open-source documentation platform built with MDX and Next.js.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "1rem 1.5rem",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <strong>docs-platform</strong>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <SearchBox />
            <ThemeToggle />
          </div>
        </header>
        <TopTabs />
        <main style={{ paddingTop: "2rem" }}>{children}</main>
      </body>
    </html>
  );
}
