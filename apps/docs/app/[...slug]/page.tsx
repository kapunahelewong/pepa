import { allDocs } from "content-collections";
import { DocLayout, docMetadata } from "@/components/DocLayout";

export function generateStaticParams() {
  // This is what makes `output: 'export'` work for a dynamic route: every
  // possible slug has to be known and pre-rendered at build time, since
  // there's no server around afterward to render one on demand.
  return allDocs.map((doc) => ({ slug: doc.slug.split("/") }));
}

type Params = Promise<{ slug: string[] }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  return docMetadata(slug);
}

export default async function Page({ params }: { params: Params }) {
  const { slug } = await params;
  return <DocLayout slug={slug} />;
}
