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
        // Charte Arkora V2
        paper: "#FFFFFF",
        warm: "#F7F5F1",
        ink: "#16181D",
        "ink-soft": "#4A4E57",
        navy: "#1B2A4A",
        gold: "#A8862E",
        hairline: "#E4E1DA",
        signature: "#8A8E97",
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
