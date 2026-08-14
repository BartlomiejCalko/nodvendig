"use client";

import { useContact } from "@/components/contact/contact-context";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

type ContactTriggerProps = {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
};

export const ContactTrigger = ({
  children,
  className,
  onClick,
}: ContactTriggerProps) => {
  const { open } = useContact();

  return (
    <button
      type="button"
      className={cn("text-left", className)}
      onClick={() => {
        onClick?.();
        open();
      }}
    >
      {children}
    </button>
  );
};

type ContactButtonProps = {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: "primary" | "onDark";
};

export const ContactButton = ({
  children,
  className,
  onClick,
  variant = "primary",
}: ContactButtonProps) => {
  const { open } = useContact();

  return (
    <Button
      variant={variant}
      className={className}
      onClick={() => {
        onClick?.();
        open();
      }}
    >
      {children}
    </Button>
  );
};
