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

const config: PepaConfig = {
  name: "pepa",
  sections: [
    { id: "docs", label: "Docs", href: "/getting-started", enabled: true },
    { id: "api-reference", label: "API Reference", href: "/api-reference", enabled: true },
    { id: "cookbook", label: "Cookbook", href: "/cookbook", enabled: false },
    { id: "contributors", label: "Contributors", href: "/contributors", enabled: false },
  ],
  features: {
    versioning: false,
    contributors: false,
  },
}

export default config
