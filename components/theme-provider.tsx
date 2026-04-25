"use client";

import {
  ThemeProvider as NextThemesProvider,
  ThemeProviderProps,
} from "next-themes";
import { useState, useEffect } from "react";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false);

  // This is the recommended way in React 19 / Next.js 16 to avoid the warning
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  return (
    <NextThemesProvider
      {...props}
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      // Only render the script on client after mount
      scriptProps={mounted ? { "data-cfasync": "false" } : undefined}
    >
      {children}
    </NextThemesProvider>
  );
}
