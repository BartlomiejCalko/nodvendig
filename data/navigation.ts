export type NavItem = {
  label: string;
  href: string;
  index: string;
};

export const navigation: NavItem[] = [
  { label: "Projects", href: "/projects", index: "01" },
  { label: "About", href: "/about", index: "02" },
  { label: "Contact", href: "/contact", index: "03" },
];

export const primaryCta = {
  label: "Discuss a project",
  href: "/contact",
} as const;

export const projectCta = {
  label: "Discuss your project",
  href: "/contact",
} as const;
