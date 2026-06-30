"use client";

import { Children, useState, type ReactElement, type ReactNode } from "react";

export function Tab({ label, children }: { label: string; children: ReactNode }) {
  // Rendered only via Tabs below; label is read from props by the parent.
  return <>{children}</>;
}

export function Tabs({ children }: { children: ReactNode }) {
  const tabs = Children.toArray(children) as ReactElement<{ label: string; children: ReactNode }>[];
  const [active, setActive] = useState(0);

  return (
    <div style={{ border: "1px solid var(--border)", borderRadius: 6, overflow: "hidden", margin: "1.25rem 0" }}>
      <div style={{ display: "flex", borderBottom: "1px solid var(--border)" }}>
        {tabs.map((tab, i) => (
          <button
            key={tab.props.label}
            onClick={() => setActive(i)}
            aria-current={i === active}
            style={{
              background: i === active ? "var(--bg-subtle)" : "transparent",
              border: "none",
              padding: "0.5rem 0.9rem",
              cursor: "pointer",
              color: "var(--fg)",
              fontSize: "0.85rem",
            }}
          >
            {tab.props.label}
          </button>
        ))}
      </div>
      <div style={{ padding: "0.75rem 1rem" }}>{tabs[active]}</div>
    </div>
  );
}
