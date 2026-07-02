import type { ReactNode } from "react";

export default function ApiReferenceLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <link rel="stylesheet" href="/scalar.css" />
      <div style={{ marginTop: "-2rem" }}>{children}</div>
    </>
  );
}
