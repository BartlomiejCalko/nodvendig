import { cn } from "@/lib/cn";

type ContainerProps = {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "header" | "footer" | "nav";
};

export const Container = ({
  children,
  className,
  as: Tag = "div",
}: ContainerProps) => (
  <Tag
    className={cn(
      "mx-auto w-full max-w-[1760px] px-[clamp(18px,3vw,56px)]",
      className,
    )}
  >
    {children}
  </Tag>
);
