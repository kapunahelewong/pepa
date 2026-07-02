import * as LucideIcons from "lucide-react";
import type { LucideProps } from "lucide-react";
import type { ComponentType, ReactNode } from "react";

type TileProps = {
  title: string;
  /** Lucide icon name, e.g. "BookOpen", "Code", "Users" — see lucide.dev/icons */
  iconName?: string;
  href?: string;
  children?: ReactNode;
};

export function Tile({ title, iconName, href, children }: TileProps) {
  const IconComponent = iconName
    ? (LucideIcons[iconName as keyof typeof LucideIcons] as ComponentType<LucideProps> | undefined)
    : undefined;

  const inner = (
    <div className="tile-inner">
      {IconComponent && (
        <div style={{ marginBottom: "0.75rem" }}>
          <IconComponent size={20} strokeWidth={1.5} />
        </div>
      )}
      <div style={{ fontWeight: 600, marginBottom: "0.35rem" }}>{title}</div>
      {children && (
        <div style={{ fontSize: "0.875rem", color: "var(--fg-muted)", lineHeight: 1.55 }}>
          {children}
        </div>
      )}
    </div>
  );

  return href ? (
    <a href={href} className="tile tile--link">
      {inner}
    </a>
  ) : (
    <div className="tile">
      {inner}
    </div>
  );
}

export function Tiles({ children }: { children: ReactNode }) {
  return (
    <div className="tiles">
      {children}
    </div>
  );
}
