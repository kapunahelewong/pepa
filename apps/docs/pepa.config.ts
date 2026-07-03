export type Section = {
  id: string
  label: string
  /** href of the landing page for this section */
  href: string
  enabled: boolean
}

export type PepaConfig = {
  name: string
  sections: Section[]
  features: {
    versioning: boolean
    contributors: boolean
    /** Base URL for "Edit this page on GitHub" links. Set to the GitHub blob URL
     *  of your content/docs directory, e.g.
     *  "https://github.com/your-org/pepa/blob/main/apps/docs/content/docs"
     *  Leave undefined to hide the edit link. */
    editOnGitHub?: string
  }
}

// If docset isn't open source, change contributors enabled to false.
// If it is open source and you want to use "Edit on GitHub" update the value for `editOnGitHub`
// to  your real repo URL. set to `undefined` to hide link entirely.
const config: PepaConfig = {
  name: "pepa",
  sections: [
    { id: "docs", label: "Docs", href: "/getting-started", enabled: true },
    { id: "api-reference", label: "API Reference", href: "/api-reference", enabled: true },
    { id: "cookbook", label: "Cookbook", href: "/cookbook/overview", enabled: true },
    { id: "contributors", label: "Contributors", href: "/contributors/overview", enabled: true },
  ],
  features: {
    versioning: false,
    contributors: true,
    editOnGitHub: "https://github.com/your-org/pepa/blob/main/apps/docs/content/docs",
  },
}

export default config
