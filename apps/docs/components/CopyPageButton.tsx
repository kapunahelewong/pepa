"use client";

import { useState, useCallback } from "react";

export function CopyPageButton({ articleSelector = "article.docs-content" }: { articleSelector?: string }) {
  const [state, setState] = useState<"idle" | "copied" | "error">("idle");

  const copy = useCallback(async () => {
    const el = document.querySelector(articleSelector);
    if (!el) return;

    // innerText respects visibility and gives readable text with newlines,
    // which is what you want when pasting into an AI or another doc.
    const text = (el as HTMLElement).innerText ?? el.textContent ?? "";

    try {
      await navigator.clipboard.writeText(text);
      setState("copied");
      setTimeout(() => setState("idle"), 2000);
    } catch {
      setState("error");
      setTimeout(() => setState("idle"), 2000);
    }
  }, [articleSelector]);

  return (
    <button
      onClick={copy}
      className="copy-page-btn"
      aria-label="Copy page content to clipboard"
      title="Copy page content"
    >
      {state === "copied" ? (
        <>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Copied
        </>
      ) : state === "error" ? (
        "Failed"
      ) : (
        <>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          Copy page
        </>
      )}
    </button>
  );
}
