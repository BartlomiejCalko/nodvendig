"use client";

import { useEffect, useId, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useLenis } from "lenis/react";
import { useContact } from "@/components/contact/contact-context";
import { ContactPanel } from "@/components/contact/ContactPanel";
import { contactCopy } from "@/data/contact";
import { duration, easing } from "@/lib/motion";

export const ContactModal = () => {
  const { isOpen, close } = useContact();
  const prefersReducedMotion = useReducedMotion();
  const lenis = useLenis();
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) {
      lenis?.start();
      return;
    }

    lenis?.stop();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) {
        return;
      }

      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        "a[href], button:not([disabled]), input, select, textarea",
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
  }, [isOpen, close, lenis]);

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="fixed inset-0 z-[70] flex items-end justify-center p-0 md:items-center md:p-8"
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: duration.ui, ease: easing.outExpo }}
        >
          <button
            type="button"
            aria-label={contactCopy.close}
            className="absolute inset-0 bg-carbon/70"
            onClick={close}
          />
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative z-10 max-h-[92svh] w-full max-w-[1120px] overflow-y-auto border border-line bg-ivory"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, y: 16 }}
            transition={{ duration: duration.ui, ease: easing.outExpo }}
          >
            <span id={titleId} className="sr-only">
              {contactCopy.title}
            </span>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={close}
              className="absolute top-5 right-5 z-10 flex h-11 w-11 items-center justify-center border border-line"
              aria-label={contactCopy.close}
            >
              <span
                aria-hidden="true"
                className="absolute h-px w-4 rotate-45 bg-carbon"
              />
              <span
                aria-hidden="true"
                className="absolute h-px w-4 -rotate-45 bg-carbon"
              />
            </button>
            <div className="px-6 py-10 md:px-10 md:py-12 lg:px-12">
              <ContactPanel />
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};
