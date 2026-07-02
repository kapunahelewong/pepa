import type { ReactNode } from "react";

export function Accordion({ children }: { children: ReactNode }) {
  return <div className="accordion">{children}</div>;
}

export function AccordionItem({
  title,
  children,
  open = false,
}: {
  title: string;
  children: ReactNode;
  open?: boolean;
}) {
  return (
    <details className="accordion-item" open={open}>
      <summary className="accordion-trigger">
        <span>{title}</span>
        <svg
          className="accordion-chevron"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </summary>
      <div className="accordion-content">{children}</div>
    </details>
  );
}
