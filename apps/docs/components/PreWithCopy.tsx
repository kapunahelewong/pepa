"use client";

import { useRef, useState } from "react";

export function PreWithCopy({ children, ...props }: React.HTMLAttributes<HTMLPreElement>) {
  const ref = useRef<HTMLPreElement>(null);
  const [state, setState] = useState<"idle" | "copied">("idle");

  async function copy() {
    const text = ref.current?.textContent ?? "";
    try {
      await navigator.clipboard.writeText(text);
      setState("copied");
      setTimeout(() => setState("idle"), 2000);
    } catch {
      // clipboard API unavailable (HTTP context, etc.) — fail silently
    }
  }

  return (
    <div className="code-block-wrapper">
      <pre ref={ref} {...props}>
        {children}
      </pre>
      <button
        onClick={copy}
        className={`code-copy-btn${state === "copied" ? " code-copy-btn--copied" : ""}`}
        aria-label={state === "copied" ? "Copied!" : "Copy code"}
        title={state === "copied" ? "Copied!" : "Copy code"}
      >
        {state === "copied" ? (
          // Checkmark
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          // Copy
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
        )}
      </button>
    </div>
  );
}
