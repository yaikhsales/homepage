import type { Config } from "tailwindcss";

/* Merged config: yaikh-com marketing theme + absorbed yai-plan portal theme.
 * Nested color tokens (yai-blue.DEFAULT, yai-blue.dark, ...) because portal
 * components use `bg-yai-blue-dark` etc. — flat `bg-yai-blue` still works
 * since Tailwind resolves to the .DEFAULT swatch. */
const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "yai-blue": {
          DEFAULT: "#1E4DAA",
          dark:    "#0F2D6B",
          light:   "#3568D0",
          deep:    "#0A1F47",
        },
        "yai-blue-deep": "#143C8C",
        "yai-orange": {
          DEFAULT: "#F37021",
          dark:    "#D45D14",
          light:   "#FB9456",
        },
        "yai-navy": {
          DEFAULT: "#0A1F47",
          light:   "#163558",
          deep:    "#061829",
        },
        "yai-teal":   "#14B8A6",
        "yai-cream":  "#FFF1E0",
        "yai-forest": "#0A3327",
        "yai-amber":  "#FFD58A",
        "yai-bg":     "#F6F8FC",
        "yai-border": "#E5EAF1",
      },
      fontFamily: {
        sans:   ["var(--font-inter)", "Inter", "ui-sans-serif", "system-ui"],
        serif:  ["var(--font-fraunces)", "ui-serif", "Georgia"],
        allura: ["var(--font-allura)", "cursive"],
        script: ["var(--font-allura)", "Allura", "cursive"],
      },
      boxShadow: {
        "card-hover":  "0 10px 30px -10px rgba(10,31,71,0.15)",
        "blue-glow":   "0 14px 40px -12px rgba(30,77,170,0.45)",
        "orange-glow": "0 10px 40px -10px rgba(243,112,33,0.4)",
      },
      keyframes: {
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "20%, 60%": { transform: "translateX(-8px)" },
          "40%, 80%": { transform: "translateX(8px)" },
        },
      },
      animation: {
        shake: "shake 0.4s ease-in-out",
      },
    },
  },
  plugins: [],
};

export default config;
