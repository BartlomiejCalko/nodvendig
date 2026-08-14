"use client";

import { createContext, useContext } from "react";

export type ContactContextValue = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

export const ContactContext = createContext<ContactContextValue | null>(null);

export const useContact = () => {
  const context = useContext(ContactContext);

  if (!context) {
    throw new Error("useContact must be used within ContactProvider");
  }

  return context;
};
