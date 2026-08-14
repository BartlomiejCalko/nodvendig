import { cn } from "@/lib/cn";

type SectionLabelProps = {
  children: React.ReactNode;
  className?: string;
  tone?: "light" | "dark";
};

export const SectionLabel = ({
  children,
  className,
  tone = "light",
}: SectionLabelProps) => (
  <p
    className={cn(
      "technical-label inline-flex items-center gap-2",
      tone === "dark" ? "text-ivory" : "text-carbon",
      className,
    )}
  >
    <span aria-hidden="true" className="size-1.5 shrink-0 bg-accent" />
    {children}
  </p>
);
