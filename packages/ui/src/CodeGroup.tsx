"use client";

import { Children, useState, type ReactElement } from "react";

export function CodeGroup({ children }: { children: React.ReactNode }) {
  const blocks = Children.toArray(children) as ReactElement<{ title?: string }>[];
  const [active, setActive] = useState(0);

  return (
    <div style={{ margin: "1.25rem 0" }}>
      {blocks.length > 1 && (
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "-1px" }}>
          {blocks.map((block, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              style={{
                fontSize: "0.75rem",
                padding: "0.25rem 0.6rem",
                border: "1px solid var(--border)",
                borderBottom: i === active ? "1px solid var(--code-bg)" : "1px solid var(--border)",
                background: i === active ? "var(--code-bg)" : "transparent",
                color: "var(--fg-muted)",
                cursor: "pointer",
              }}
            >
              {block.props.title ?? `Option ${i + 1}`}
            </button>
          ))}
        </div>
      )}
      {blocks[active]}
    </div>
  );
}
