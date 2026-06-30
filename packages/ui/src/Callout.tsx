import type { ReactNode } from "react";

const ICON: Record<string, string> = {
  tip: "💡",
  warning: "⚠️",
  danger: "⛔",
  note: "📝",
};

export function Callout({
  type = "note",
  children,
}: {
  type?: "tip" | "warning" | "danger" | "note";
  children: ReactNode;
}) {
  return (
    <div className="callout" data-callout-type={type}>
      <span aria-hidden="true" style={{ marginRight: "0.5rem" }}>
        {ICON[type]}
      </span>
      {children}
    </div>
  );
}
