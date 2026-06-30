"use client";

import { useEffect, useRef } from "react";
import "@scalar/api-reference/style.css";

export default function ApiReferencePage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;

    let destroy: (() => void) | undefined;
    import("@scalar/api-reference").then(({ createApiReference }) => {
      const instance = createApiReference(el, {
        url: "/openapi/widgets.yaml",
        darkMode: document.documentElement.dataset.theme === "dark",
      });
      destroy = instance?.destroy;
    });

    return () => destroy?.();
  }, []);

  return <div ref={containerRef} />;
}
