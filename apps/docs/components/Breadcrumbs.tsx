import Link from "next/link";
import config from "@/pepa.config";

type BreadcrumbsProps = {
  section: string;
  navGroup: string;
};

export function Breadcrumbs({ section, navGroup }: BreadcrumbsProps) {
  const sectionConfig = config.sections.find((s) => s.id === section);
  if (!sectionConfig) return null;

  return (
    <nav aria-label="Breadcrumb" className="breadcrumbs">
      <ol className="breadcrumbs-list">
        <li>
          <Link href={sectionConfig.href} className="breadcrumbs-link">
            {sectionConfig.label}
          </Link>
        </li>
        <li aria-hidden="true" className="breadcrumbs-sep">/</li>
        <li className="breadcrumbs-current" aria-current="page">
          {navGroup}
        </li>
      </ol>
    </nav>
  );
}
