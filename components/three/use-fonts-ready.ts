"use client";

import { useEffect, useState } from "react";

/** Resolves once the page web fonts are loaded so canvas text uses them. */
export const useFontsReady = () => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    document.fonts.ready.then(() => {
      if (active) {
        setReady(true);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  return ready;
};
