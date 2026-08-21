import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Charte Arkora V2 — chaque classe résout vers son token CSS var(--color-*)
        paper: "var(--color-paper)",
        "paper-warm": "var(--color-paper-warm)",
        ink: "var(--color-ink)",
        "ink-2": "var(--color-ink-2)",
        "ink-3": "var(--color-ink-3)",
        navy: "var(--color-navy)",
        gold: "var(--color-gold)",
        hairline: "var(--color-hairline)",
      },
      fontFamily: {
        serif: ["var(--font-source-serif)", "serif"],
        sans: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      borderRadius: {
        btn: "5px",
      },
    },
  },
  plugins: [],
};
export default config;
