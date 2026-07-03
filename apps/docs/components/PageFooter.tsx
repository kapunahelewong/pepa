import Link from "next/link";
import { AdjacentDoc } from "@/lib/nav";
import config from "@/pepa.config";

type PageFooterProps = {
  prev: AdjacentDoc;
  next: AdjacentDoc;
  slug: string;
};

export function PageFooter({ prev, next, slug }: PageFooterProps) {
  const editBase = config.features.editOnGitHub;
  const editUrl = editBase ? `${editBase}/${slug}.mdx` : null;

  return (
    <footer className="page-footer">
      <div className="page-footer-nav">
        {prev ? (
          <Link href={`/${prev.slug}`} className="page-footer-link page-footer-link--prev">
            <span className="page-footer-link-label">Previous</span>
            <span className="page-footer-link-title">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              {prev.title}
            </span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`/${next.slug}`} className="page-footer-link page-footer-link--next">
            <span className="page-footer-link-label">Next</span>
            <span className="page-footer-link-title">
              {next.title}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </span>
          </Link>
        ) : (
          <span />
        )}
      </div>
      {editUrl && (
        <a
          href={editUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="page-footer-edit"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          Edit this page on GitHub
        </a>
      )}
    </footer>
  );
}
