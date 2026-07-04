import type { ReactNode } from "react";

export default function ApiReferenceLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <link rel="stylesheet" href={`${process.env.NEXT_PUBLIC_BASE_PATH}/scalar.css`} />
      <div style={{ marginTop: "-2rem" }}>{children}</div>
    </>
  );
}
