/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Light Mode
        primary: "#FF6B35",
        "primary-dark": "#FF8C5A",
        secondary: "#C41E3A",
        "secondary-dark": "#E83A4D",
        background: "#FFF9F5",
        "background-dark": "#1A1918",
        text: "#2D2A26",
        "text-dark": "#E8E6E3",
        card: "#F5F3F0",
        "card-dark": "#2D2A26",
      },
      fontFamily: {
        display: ["Unbounded", "sans-serif"],
        body: ["Manrope", "sans-serif"],
      },
      animation: {
        "pulse-once": "pulse-once 0.3s ease-in-out",
        "fade-in": "fade-in 0.5s ease-out",
        "slide-up": "slide-up 0.4s ease-out",
        "scale-in": "scale-in 0.3s ease-out",
      },
      keyframes: {
        "pulse-once": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.1)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
};