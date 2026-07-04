import type { ReactNode } from "react";
import { TopTabs } from "@/components/TopTabs";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SearchBox } from "@/components/SearchBox";
import "./globals.css";

export const metadata = {
  title: {
    default: "pepa",
    template: "%s · pepa",
  },
  description: "Open-source documentation platform built with MDX and Next.js.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header style={{ borderBottom: "1px solid var(--border)" }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            maxWidth: "1400px",
            margin: "0 auto",
            padding: "1rem 1.5rem",
            fontSize: "2rem",
          }}>
            <strong>pepa</strong>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <SearchBox />
              <ThemeToggle />
            </div>
          </div>
        </header>
        <TopTabs />
        <main style={{ paddingTop: "2rem" }}>{children}</main>
      </body>
    </html>
  );
}
