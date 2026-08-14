import Link from "next/link";
import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "onDark";

type ButtonProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: ButtonVariant;
};

export const Button = ({
  href,
  children,
  className,
  onClick,
  variant = "primary",
}: ButtonProps) => (
  <Link
    href={href}
    onClick={onClick}
    className={cn(
      "group inline-flex h-[52px] items-center gap-3 px-6 text-[13px] tracking-[0.02em] transition-colors duration-300 ease-out-expo",
      variant === "primary" && "bg-carbon text-ivory hover:bg-accent",
      variant === "onDark" &&
        "bg-ivory text-carbon hover:bg-accent hover:text-ivory",
      className,
    )}
  >
    <span>{children}</span>
    <span
      aria-hidden="true"
      className="translate-x-0 transition-transform duration-300 ease-out-expo group-hover:translate-x-1"
    >
      →
    </span>
  </Link>
);
