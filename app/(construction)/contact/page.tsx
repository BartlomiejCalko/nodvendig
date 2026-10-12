import { ContactPanel } from "@/components/contact/ContactPanel";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";

export const metadata = {
  title: "Contact",
};

export default function ContactPage() {
  return (
    <main id="main" className="min-h-svh bg-ivory pt-[90px]">
      <Section tone="ivory">
        <Container>
          <ContactPanel />
        </Container>
      </Section>
    </main>
  );
}
