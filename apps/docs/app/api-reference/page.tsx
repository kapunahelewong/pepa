"use client";

import { useEffect, useRef } from "react";

export default function ApiReferencePage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let destroy: (() => void) | undefined;

    import("@scalar/api-reference").then(({ createApiReference }) => {
      const instance = createApiReference(el, {
        url: `${process.env.NEXT_PUBLIC_BASE_PATH}/openapi/example-api.yaml`,
        darkMode: document.documentElement.dataset.theme === "dark",
      });
      destroy = instance?.destroy;
    });

    return () => destroy?.();
  }, []);

  return <div ref={containerRef} />;
}
