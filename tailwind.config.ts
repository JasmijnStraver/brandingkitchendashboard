import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        midnight: "var(--midnight)",
        burgundy: "var(--burgundy)",
        pepper: "var(--pepper)",
        gold: "var(--gold)",
        creme: "var(--creme)",
        bg: "var(--bg)",
        surface: "var(--surface)",
        "surface-2": "var(--surface-2)",
        ink: "var(--ink)",
        muted: "var(--muted)",
        line: "var(--line)",
        side: "var(--side)",
        deep: "var(--deep)",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
        accent: ["var(--font-accent)"],
      },
    },
  },
  plugins: [],
};
export default config;
