import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        void: {
          black: "#08070d",
          dark: "#0e0c15",
          card: "#161424",
          purple: "#8b5cf6",
          cyan: "#06b6d4",
          pink: "#ec4899",
          blue: "#3b82f6",
        },
      },
      fontFamily: {
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "liberation mono", "courier new", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
