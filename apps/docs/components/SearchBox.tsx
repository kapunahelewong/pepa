"use client";

import { useEffect, useRef, useState } from "react";
import MiniSearch from "minisearch";
import Link from "next/link";

type Doc = { id: string; title: string; description: string; body: string; slug: string };
type Result = { id: string; title: string; slug: string };

export function SearchBox() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const indexRef = useRef<MiniSearch<Doc> | null>(null);

  useEffect(() => {
    // Fetched once on mount, not on every keystroke — the whole index is a
    // single static JSON file, so there's nothing to call per-query.
    fetch("/search-index.json")
      .then((res) => res.json())
      .then((docs: Doc[]) => {
        const mini = new MiniSearch<Doc>({
          fields: ["title", "description", "body"],
          storeFields: ["title", "slug"],
        });
        mini.addAll(docs);
        indexRef.current = mini;
      });
  }, []);

  useEffect(() => {
    if (!indexRef.current || query.trim().length < 2) {
      setResults([]);
      return;
    }
    const hits = indexRef.current.search(query, { prefix: true, fuzzy: 0.2 });
    setResults(hits.slice(0, 8) as unknown as Result[]);
  }, [query]);

  return (
    <div style={{ position: "relative", width: 240 }}>
      <input
        type="search"
        placeholder="Search docs..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{
          width: "100%",
          padding: "0.4rem 0.6rem",
          border: "1px solid var(--border)",
          borderRadius: 6,
          background: "var(--bg-subtle)",
          color: "var(--fg)",
        }}
      />
      {results.length > 0 && (
        <ul
          style={{
            position: "absolute",
            top: "110%",
            left: 0,
            right: 0,
            background: "var(--bg)",
            border: "1px solid var(--border)",
            borderRadius: 6,
            listStyle: "none",
            margin: 0,
            padding: "0.25rem",
            zIndex: 10,
          }}
        >
          {results.map((r) => (
            <li key={r.id}>
              <Link
                href={`/${r.slug}`}
                onClick={() => setQuery("")}
                style={{ display: "block", padding: "0.4rem 0.5rem", textDecoration: "none" }}
              >
                {r.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
