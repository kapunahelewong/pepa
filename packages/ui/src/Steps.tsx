import { Children, cloneElement, isValidElement, type ReactElement, type ReactNode } from "react";

type StepProps = {
  title: string;
  children: ReactNode;
  /** Injected by <Steps> — do not set manually */
  _index?: number;
  _isLast?: boolean;
};

export function Step({ title, children, _index = 1, _isLast = false }: StepProps) {
  return (
    <div style={{ display: "flex", gap: "1.25rem" }}>
      {/* Left column: numbered circle + connecting line */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, width: "2rem" }}>
        <div style={{
          width: "2rem",
          height: "2rem",
          borderRadius: "50%",
          background: "var(--accent)",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "0.8125rem",
          fontWeight: 700,
          flexShrink: 0,
        }}>
          {_index}
        </div>
        {!_isLast && (
          <div style={{
            width: "2px",
            flexGrow: 1,
            minHeight: "1.5rem",
            background: "var(--border)",
            marginTop: "0.3rem",
          }} />
        )}
      </div>

      {/* Right column: title + body */}
      <div style={{ paddingBottom: _isLast ? "0.5rem" : "2rem", minWidth: 0, flex: 1 }}>
        <p style={{ fontWeight: 600, margin: "0 0 0.6rem", lineHeight: "2rem" }}>{title}</p>
        <div>{children}</div>
      </div>
    </div>
  );
}

export function Steps({ children }: { children: ReactNode }) {
  const steps = Children.toArray(children).filter(isValidElement);
  return (
    <div style={{ margin: "1.5rem 0" }}>
      {steps.map((child, i) =>
        cloneElement(child as ReactElement<StepProps>, {
          _index: i + 1,
          _isLast: i === steps.length - 1,
        })
      )}
    </div>
  );
}
