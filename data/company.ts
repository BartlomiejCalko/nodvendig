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

export const contact = {
  email: null as string | null,
  phone: "+47 929 46 316",
  phoneHref: "tel:+4792946316",
  address: {
    line1: "Markalleen 104",
    line2: "1363 Høvik",
    country: "Norway",
  },
  orgNr: "932 549 778",
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
  address: {
    "@type": "PostalAddress",
    streetAddress: contact.address.line1,
    postalCode: "1363",
    addressLocality: "Høvik",
    addressCountry: "NO",
  },
  telephone: contact.phone,
} as const;

