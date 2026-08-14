import Link from "next/link";
import { company } from "@/data/company";
import { cn } from "@/lib/cn";

type LogoProps = {
  className?: string;
  onClick?: () => void;
};

export const Logo = ({ className, onClick }: LogoProps) => (
  <Link
    href="/"
    aria-label={`${company.shortName} home`}
    onClick={onClick}
    className={cn(
      "inline-flex items-center text-[15px] font-medium tracking-[0.08em]",
      className,
    )}
  >
    {company.wordmark}
  </Link>
);
