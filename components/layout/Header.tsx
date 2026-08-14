"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useLenis } from "lenis/react";
import { company } from "@/data/company";
import { navigation, primaryCta } from "@/data/navigation";
import { cn } from "@/lib/cn";
import { duration, easing, heroSequence } from "@/lib/motion";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/layout/Container";
import { Logo } from "@/components/layout/Logo";

export const Header = () => {
  const [compressed, setCompressed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const lenis = useLenis();
  const panelId = useId();
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setCompressed(window.scrollY > 16);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) {
      lenis?.start();
      return;
    }

    lenis?.stop();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }

      if (event.key !== "Tab" || !headerRef.current) {
        return;
      }

      const focusable = headerRef.current.querySelectorAll<HTMLElement>(
        "a[href], button:not([disabled])",
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };

    window.addEventListener("keydown", handleKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKey);
    };
  }, [menuOpen, lenis]);

  const handleNavigate = () => setMenuOpen(false);

  return (
    <header
      ref={headerRef}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[height,background-color] duration-300 ease-out-expo",
        compressed || menuOpen ? "h-[72px] bg-ivory" : "h-[90px] bg-transparent",
        compressed && !menuOpen ? "border-b border-line" : "border-b border-transparent",
      )}
    >
      <Container className="relative z-50 flex h-full items-center justify-between">
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: duration.ui,
            delay: heroSequence.wordmark,
            ease: easing.outExpo,
          }}
        >
          <Logo onClick={handleNavigate} />
        </motion.div>

        <motion.nav
          aria-label="Primary"
          className="hidden items-center gap-8 lg:flex"
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: duration.ui,
            delay: heroSequence.navigation,
            ease: easing.outExpo,
          }}
        >
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group relative text-[13px] tracking-[0.02em] text-carbon"
            >
              {item.label}
              <span className="absolute inset-x-0 -bottom-1 h-px origin-left scale-x-0 bg-carbon transition-transform duration-300 ease-out-expo group-hover:scale-x-100" />
            </Link>
          ))}
          <Button href={primaryCta.href}>{primaryCta.label}</Button>
        </motion.nav>

        <motion.button
          type="button"
          className="relative z-50 flex h-11 w-11 items-center justify-center border border-line lg:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls={panelId}
          onClick={() => setMenuOpen((open) => !open)}
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: duration.ui,
            delay: heroSequence.navigation,
            ease: easing.outExpo,
          }}
        >
          <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
          <span
            aria-hidden="true"
            className={cn(
              "absolute h-px w-4 bg-carbon transition-transform duration-300 ease-out-expo",
              menuOpen ? "translate-y-0 rotate-45" : "-translate-y-[4px]",
            )}
          />
          <span
            aria-hidden="true"
            className={cn(
              "absolute h-px w-4 bg-carbon transition-transform duration-300 ease-out-expo",
              menuOpen ? "translate-y-0 -rotate-45" : "translate-y-[4px]",
            )}
          />
        </motion.button>
      </Container>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            id={panelId}
            className="fixed inset-0 z-40 flex flex-col bg-ivory lg:hidden"
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: duration.ui, ease: easing.outExpo }}
          >
            <nav
              aria-label="Mobile"
              className="flex flex-1 flex-col justify-end px-[clamp(18px,3vw,56px)] pt-[90px] pb-10"
            >
              <ul className="flex flex-col border-t border-line">
                {navigation.map((item, index) => (
                  <motion.li
                    key={item.href}
                    className="border-b border-line"
                    initial={
                      prefersReducedMotion ? false : { opacity: 0, y: 18 }
                    }
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.45,
                      delay: 0.06 * index,
                      ease: easing.outExpo,
                    }}
                  >
                    <Link
                      href={item.href}
                      onClick={handleNavigate}
                      className="flex items-baseline justify-between py-5"
                    >
                      <span className="text-heading-3 font-medium">
                        {item.label}
                      </span>
                      <span className="technical-label text-steel">
                        {item.index}
                      </span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
              <motion.div
                className="mt-10"
                initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.45,
                  delay: 0.36,
                  ease: easing.outExpo,
                }}
              >
                <Button
                  href={primaryCta.href}
                  onClick={handleNavigate}
                  className="w-full justify-center"
                >
                  {primaryCta.label}
                </Button>
                <p className="technical-label mt-6 text-steel">
                  {company.technicalLabel}
                </p>
              </motion.div>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
};
