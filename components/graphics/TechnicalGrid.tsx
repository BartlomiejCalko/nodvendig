import { cn } from "@/lib/cn";

type TechnicalGridProps = {
  className?: string;
  tone?: "light" | "dark";
};

export const TechnicalGrid = ({
  className,
  tone = "light",
}: TechnicalGridProps) => (
  <div
    aria-hidden="true"
    className={cn("pointer-events-none absolute inset-0", className)}
    style={{
      backgroundImage:
        tone === "dark"
          ? `linear-gradient(to right, rgb(242 239 231 / 0.07) 1px, transparent 1px),
             linear-gradient(to bottom, rgb(242 239 231 / 0.07) 1px, transparent 1px)`
          : `linear-gradient(to right, rgb(28 28 26 / 0.07) 1px, transparent 1px),
             linear-gradient(to bottom, rgb(28 28 26 / 0.07) 1px, transparent 1px)`,
      backgroundSize: "80px 80px",
      maskImage:
        "linear-gradient(to bottom, black 0%, black 70%, transparent 100%)",
    }}
  />
);
