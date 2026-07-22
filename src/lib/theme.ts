export type ThemeId = "dark" | "light" | "void";

export const THEMES: { id: ThemeId; name: string; blurb: string; swatch: string[] }[] = [
  { id: "dark", name: "Dark", blurb: "The classic VOID purple & cyan.", swatch: ["#08070d", "#161424", "#8b5cf6", "#06b6d4"] },
  { id: "light", name: "Light", blurb: "Clean and bright.", swatch: ["#f6f7fb", "#ffffff", "#7c3aed", "#0891b2"] },
  { id: "void", name: "Void", blurb: "Black, silver & gold.", swatch: ["#050507", "#131318", "#d4af37", "#c0c0c0"] },
];

export const THEME_IDS: ThemeId[] = ["dark", "light", "void"];

// Apply a theme immediately (client-only) and remember it for next load.
export function applyTheme(id: ThemeId) {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-theme", id);
  try {
    localStorage.setItem("void_os_theme", id);
  } catch {
    /* private mode */
  }
}
