

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "yai-navy":   "#0A1F47",
        "yai-orange": "#F37021",
        "yai-blue":   "#1E4DAA",
        "yai-amber":  "#FFD58A",
        "yai-cream":  "#FFF1E0",
      },
    },
  },
  plugins: [],
}
