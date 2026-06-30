import type { ReactNode } from "react";

type KbdProps = {
  children: ReactNode;
};

export function Kbd({ children }: KbdProps) {
  return (
    <kbd
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "0.1em 0.45em",
        fontSize: "0.8em",
        fontFamily: "inherit",
        fontWeight: 500,
        lineHeight: 1.5,
        border: "1px solid var(--border)",
        borderBottomWidth: "2px",
        borderRadius: "4px",
        background: "var(--bg-subtle)",
        color: "var(--fg)",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </kbd>
  );
}
