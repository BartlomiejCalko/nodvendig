import { company } from "@/data/company";
import { navigation } from "@/data/navigation";
import { Container } from "@/components/layout/Container";
import { Logo } from "@/components/layout/Logo";
import Link from "next/link";

export const Footer = () => (
  <footer className="border-t border-line bg-ivory">
    <Container className="flex flex-col gap-10 py-10 md:flex-row md:items-end md:justify-between md:py-12">
      <div>
        <Logo />
        <p className="technical-label mt-4 text-steel">
          {company.technicalLabel}
        </p>
      </div>
      <nav aria-label="Footer">
        <ul className="flex flex-wrap gap-x-6 gap-y-3">
          {navigation.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="text-[13px] tracking-[0.02em] text-carbon transition-opacity duration-300 ease-out-expo hover:opacity-55"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </Container>
    <Container className="border-t border-line py-5">
      <p className="technical-label text-steel">
        © 2026 {company.legalName}
      </p>
    </Container>
  </footer>
);
