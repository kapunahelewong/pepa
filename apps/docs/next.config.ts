import type { NextConfig } from "next";
import { withContentCollections } from "@content-collections/next";

// `output: 'export'` is the whole ballgame: it's what makes this deployable
// to GitHub Pages (or any static host) with zero server. The tradeoff is no
// API routes / server actions / next/image optimization API at runtime —
// see README for how search and the AI-agent connector are designed around
// that constraint instead of fighting it.
const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true, // no image optimization API available on static hosts
  },
  // If you deploy to https://<user>.github.io/<repo>/ rather than a custom
  // domain, uncomment and set this to your repo name. Note that if you
  // do this during local development it'll break, so you have to toggle it for 
  // ghpages without a custom domain:
  // basePath: "/pepa",
};

export default withContentCollections(nextConfig);
