import { Footer } from "@/components/layout/Footer";
import { GrainOverlay } from "@/components/layout/GrainOverlay";
import { Header } from "@/components/layout/Header";
import { SkipLink } from "@/components/layout/SkipLink";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { ContactProvider } from "@/components/contact/ContactProvider";

type AppShellProps = {
  children: React.ReactNode;
};

export const AppShell = ({ children }: AppShellProps) => (
  <SmoothScroll>
    <ContactProvider>
      <SkipLink />
      <GrainOverlay />
      <Header />
      {children}
      <Footer />
    </ContactProvider>
  </SmoothScroll>
);

