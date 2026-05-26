import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary brand — royal blue (from the YAI logo)
        "yai-blue": {
          DEFAULT: "#1E4DAA",   // Logo blue
          dark:    "#0F2D6B",   // Hover / depth
          light:   "#3568D0",   // Hover-up on solid blue
          deep:    "#0A1F47",   // Near-black blue — text on white
        },
        // Secondary accent — used very sparingly (sidebar marker, "Confidential" tag)
        "yai-orange": {
          DEFAULT: "#F37021",
          dark:    "#D45D14",
          light:   "#FB9456",
        },
        // Legacy navy alias — paired with new blue palette
        "yai-navy": {
          DEFAULT: "#0A1F47",
          light:   "#163558",
          deep:    "#061829",
        },
        "yai-teal":   "#14B8A6",
        "yai-bg":     "#F7F9FC",
        "yai-border": "#E5EAF1",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        "card-hover":  "0 10px 30px -10px rgba(10,31,71,0.15)",
        "blue-glow":   "0 10px 40px -10px rgba(30,77,170,0.5)",
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
