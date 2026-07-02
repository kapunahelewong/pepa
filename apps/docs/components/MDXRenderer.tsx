"use client";

import { useMDXComponent } from "@content-collections/mdx/react";
import { Callout, Tabs, Tab, CodeGroup, Kbd, Icon, Steps, Step, Tiles, Tile, Accordion, AccordionItem } from "docs-ui";
import { AuthNote, BearerExample } from "docs-ui/snippets";
import { vars } from "@/lib/vars";
import * as LucideIcons from "lucide-react";

// All components registered here are available in MDX without an explicit
// import statement — authors can just write <Callout> or <AuthNote> directly.
// This is also where snippets and lucide icons are made available globally.

// Var: renders a text variable by name, e.g. <Var name="productName" />
function Var({ name }: { name: keyof typeof vars }) {
  return <>{vars[name]}</>;
}

const components = {
  // Core UI
  Callout,
  Tabs,
  Tab,
  CodeGroup,
  Kbd,
  Icon,
  Steps,
  Step,
  Tiles,
  Tile,
  Accordion,
  AccordionItem,
  // Snippets (reusable content blocks)
  AuthNote,
  BearerExample,
  // Text variable accessor
  Var,
  // Lucide icons — available as e.g. <LucideExternalLink /> in MDX
  ...Object.fromEntries(
    Object.entries(LucideIcons).map(([name, comp]) => [`Lucide${name}`, comp])
  ),
};

export function MDXRenderer({ code }: { code: string }) {
  const Component = useMDXComponent(code);
  return <Component components={components} />;
}
