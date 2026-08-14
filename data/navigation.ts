export type NavItem = {
  label: string;
  href: string;
  index: string;
};

export const navigation: NavItem[] = [
  { label: "Expertise", href: "/expertise", index: "01" },
  { label: "Projects", href: "/projects", index: "02" },
  { label: "About", href: "/about", index: "03" },
  { label: "Careers", href: "/careers", index: "04" },
  { label: "Contact", href: "/contact", index: "05" },
];

export const primaryCta = {
  label: "Discuss a project",
  href: "/contact",
} as const;

export const projectCta = {
  label: "Discuss your project",
  href: "/contact",
} as const;
