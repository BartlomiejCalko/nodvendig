import { cn } from "@/lib/cn";

type SectionTone = "ivory" | "paper" | "carbon" | "graphite";

type SectionProps = {
  children: React.ReactNode;
  className?: string;
  id?: string;
  tone?: SectionTone;
};

export const Section = ({
  children,
  className,
  id,
  tone = "ivory",
}: SectionProps) => (
  <section
    id={id}
    data-tone={tone}
    className={cn("section-y", className)}
  >
    {children}
  </section>
);
