import type { NextConfig } from "next";
import { withContentCollections } from "@content-collections/next";

// `output: 'export'` is the whole ballgame: it's what makes this deployable
// to GitHub Pages (or any static host) with zero server. The tradeoff is no
// API routes / server actions / next/image optimization API at runtime —
// see README for how search and the AI-agent connector are designed around
// that constraint instead of fighting it.

// When deploying to GitHub Pages at https://<user>.github.io/<repo>/,
// the deploy workflow sets SITE_URL to the Pages base URL. If that URL
// has a subpath (e.g. /pepa), it becomes the basePath so asset links work.
// Locally SITE_URL is unset, so basePath is undefined and the site runs at /.
const siteUrl = process.env.SITE_URL ?? "";
const basePath = (() => {
  try {
    const p = new URL(siteUrl).pathname.replace(/\/$/, "");
    return p || undefined;
  } catch {
    return undefined;
  }
})();

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true, // no image optimization API available on static hosts
  },
  basePath,
};

export default withContentCollections(nextConfig);
