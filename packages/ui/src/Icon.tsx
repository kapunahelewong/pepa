import type { LucideProps } from "lucide-react";
import type { ComponentType } from "react";

type IconProps = LucideProps & {
  icon: ComponentType<LucideProps>;
};

/** Render any Lucide icon with consistent sizing and current-color fill.
 *
 * Usage in MDX:
 *   import { Icon } from "docs-ui"
 *   import { AlertTriangle } from "lucide-react"
 *   <Icon icon={AlertTriangle} />
 */
export function Icon({ icon: LucideIcon, size = 16, ...props }: IconProps) {
  return <LucideIcon size={size} strokeWidth={1.75} {...props} />;
}
