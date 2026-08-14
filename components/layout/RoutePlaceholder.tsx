import { Container } from "@/components/layout/Container";

type RoutePlaceholderProps = {
  title: string;
};

export const RoutePlaceholder = ({ title }: RoutePlaceholderProps) => (
  <main id="main" className="min-h-svh bg-ivory pt-[90px]">
    <Container className="flex min-h-[calc(100svh-90px)] items-end pb-16">
      <h1 className="text-display-l font-medium">{title}</h1>
    </Container>
  </main>
);
