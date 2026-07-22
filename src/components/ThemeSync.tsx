"use client";

import { useEffect } from "react";
import { applyTheme, THEME_IDS, type ThemeId } from "@/lib/theme";

// Applies the account's saved theme when the dashboard loads, so the theme
// follows the user across browsers (the no-flash script only knows localStorage).
export function ThemeSync({ theme }: { theme: string }) {
  useEffect(() => {
    if (THEME_IDS.includes(theme as ThemeId)) applyTheme(theme as ThemeId);
  }, [theme]);
  return null;
}
