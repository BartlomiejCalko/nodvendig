"use client";

import { useCallback, useMemo, useState } from "react";
import {
  ContactContext,
  useContact,
} from "@/components/contact/contact-context";
import { ContactModal } from "@/components/contact/ContactModal";

export { useContact };

type ContactProviderProps = {
  children: React.ReactNode;
};

export const ContactProvider = ({ children }: ContactProviderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const value = useMemo(
    () => ({ isOpen, open, close }),
    [isOpen, open, close],
  );

  return (
    <ContactContext.Provider value={value}>
      {children}
      <ContactModal />
    </ContactContext.Provider>
  );
};
