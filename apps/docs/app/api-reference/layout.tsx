import type { ReactNode } from "react";

// Scalar manages its own full-height layout internally, so we strip the
// padding that the root layout's <main> adds for regular doc pages.
export default function ApiReferenceLayout({ children }: { children: ReactNode }) {
  return <div style={{ marginTop: "-2rem" }}>{children}</div>;
}
