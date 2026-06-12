import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "yai-navy":      "#0A1F47",
        "yai-blue":      "#1E4DAA",
        "yai-blue-deep": "#143C8C",
        "yai-orange":    "#F37021",
        "yai-cream":     "#FFF1E0",
        "yai-forest":    "#0A3327",
        "yai-amber":     "#FFD58A",
        "yai-bg":        "#F6F8FC",
      },
      fontFamily: {
        sans:  ["var(--font-inter)", "ui-sans-serif", "system-ui"],
        serif: ["var(--font-fraunces)", "ui-serif", "Georgia"],
      },
    },
  },
  plugins: [],
};
export default config;
