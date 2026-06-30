"use client";

import { useEffect, useRef } from "react";

export default function ApiReferencePage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;

    // Dynamic import keeps Scalar (Vue-based) out of the SSR bundle entirely.
    // createApiReference mounts a full Vue app into `el` and returns a
    // destroy handle for cleanup.
    let destroy: (() => void) | undefined;
    import("@scalar/api-reference").then(({ createApiReference }) => {
      const instance = createApiReference(el, {
        url: "/openapi/widgets.yaml",
        // Let the user's OS preference drive dark mode rather than hard-coding.
        darkMode: document.documentElement.dataset.theme === "dark",
      });
      destroy = instance?.destroy;
    });

    return () => destroy?.();
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ minHeight: "100vh" }}
    />
  );
}
