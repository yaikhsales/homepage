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
        "yai-orange": {
          DEFAULT: "#F37021",
          dark: "#D45D14",
          light: "#FB9456",
        },
        "yai-navy": {
          DEFAULT: "#0A2540",
          light: "#163558",
          deep: "#061829",
        },
        "yai-teal": "#14B8A6",
        "yai-bg": "#F7F9FC",
        "yai-border": "#E5EAF1",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        "card-hover": "0 10px 30px -10px rgba(10,37,64,0.15)",
        "orange-glow": "0 10px 40px -10px rgba(243,112,33,0.4)",
      },
      keyframes: {
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "20%, 60%":   { transform: "translateX(-8px)" },
          "40%, 80%":   { transform: "translateX(8px)" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
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
