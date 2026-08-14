import { cn } from "@/lib/cn";

type ProjectMetadataProps = {
  items: string[];
  className?: string;
};

export const ProjectMetadata = ({ items, className }: ProjectMetadataProps) => (
  <p className={cn("technical-label text-steel", className)}>
    {items.join("  /  ")}
  </p>
);
