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
  }
}

// if docset isn't open source, change contributors enabled to false
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
  },
}

export default config
