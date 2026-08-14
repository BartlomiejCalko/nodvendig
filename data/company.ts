export const company = {
  legalName: "Nødvendig Holding AS",
  shortName: "Nødvendig",
  wordmark: "NØDVENDIG",
  market: "Norway",
  region: "Nordic",
  industry: "Data Center Construction",
  founded: 2023,
  technicalLabel: "NØDVENDIG / NORWAY / DATA CENTER CONSTRUCTION",
} as const;

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: company.legalName,
  alternateName: company.shortName,
  description:
    "Construction, transformation and site execution for data center facilities across Norway. Nødvendig builds the physical environment around critical infrastructure.",
  areaServed: {
    "@type": "Country",
    name: "Norway",
  },
} as const;
