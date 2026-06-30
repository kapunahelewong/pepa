import { DocLayout, docMetadata } from "@/components/DocLayout";

export function generateMetadata() {
  return docMetadata(["getting-started"]);
}

export default function HomePage() {
  return <DocLayout slug={["getting-started"]} />;
}
