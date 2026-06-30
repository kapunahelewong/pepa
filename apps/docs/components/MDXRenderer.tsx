"use client";

import { useMDXComponent } from "@content-collections/mdx/react";
import { Callout, Tabs, CodeGroup } from "docs-ui";

// Every component an MDX author is allowed to `import { X } from "docs-ui"`
// and use inline must be registered here too — this is the single place
// that maps "name used in MDX" to "actual component", which is what makes
// authoring feel like plain Markdown with superpowers rather than React.
const components = { Callout, Tabs, CodeGroup };

export function MDXRenderer({ code }: { code: string }) {
  const Component = useMDXComponent(code);
  return <Component components={components} />;
}
