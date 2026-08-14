import Link from "next/link";
import { cn } from "@/lib/cn";

type ArrowLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
};

export const ArrowLink = ({ href, children, className }: ArrowLinkProps) => (
  <Link
    href={href}
    className={cn(
      "group inline-flex items-center gap-2 text-[13px] tracking-[0.02em]",
      className,
    )}
  >
    <span className="relative">
      {children}
      <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-current transition-transform duration-300 ease-out-expo group-hover:scale-x-100" />
    </span>
    <span
      aria-hidden="true"
      className="translate-x-0 transition-transform duration-300 ease-out-expo group-hover:translate-x-1"
    >
      →
    </span>
  </Link>
);
