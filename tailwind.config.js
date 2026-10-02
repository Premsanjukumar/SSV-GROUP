/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        maroon: {
          50: "#fff0f0",
          100: "#ffe0e0",
          200: "#ffc5c5",
          300: "#ff9d9d",
          400: "#ff6464",
          500: "#ff3333",
          600: "#ed1515",
          700: "#c80d0d",
          800: "#a50f0f",
          900: "#891414",
          950: "#4b0404",
        },
        saffron: {
          50: "#fff8ed",
          100: "#ffefd3",
          200: "#ffdba5",
          300: "#ffc16d",
          400: "#ff9d32",
          500: "#ff7f0a",
          600: "#f06200",
          700: "#c74b00",
          800: "#9e3b05",
          900: "#7f320b",
          950: "#451704",
        },
        gold: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
          950: "#451a03",
        },
        cream: "#FFF8DC",
        festive: {
          red: "#8B0000",
          maroon: "#6D0B0B",
          saffron: "#FF6B00",
          orange: "#FF8C00",
          gold: "#D4A017",
          ivory: "#FFFFF0",
          cream: "#FFF8DC",
          green: "#2D5016",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
        display: ["var(--font-cinzel)", "Cinzel", "serif"],
        decorative: ["var(--font-playfair)", "Playfair Display", "serif"],
      },
      backgroundImage: {
        "festive-gradient":
          "linear-gradient(135deg, #6D0B0B 0%, #8B0000 30%, #C0392B 60%, #FF6B00 100%)",
        "gold-gradient":
          "linear-gradient(135deg, #D4A017 0%, #F5C842 50%, #D4A017 100%)",
        "dark-festive":
          "linear-gradient(180deg, #1a0505 0%, #2d0808 50%, #1a0505 100%)",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-in-out",
        "slide-up": "slideUp 0.6s ease-out",
        "pulse-gold": "pulseGold 2s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
        "spin-slow": "spin 8s linear infinite",
        float: "float 3s ease-in-out infinite",
        glow: "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseGold: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(212, 160, 23, 0.4)" },
          "50%": { boxShadow: "0 0 0 15px rgba(212, 160, 23, 0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        glow: {
          "0%": { textShadow: "0 0 10px rgba(212, 160, 23, 0.5)" },
          "100%": { textShadow: "0 0 30px rgba(212, 160, 23, 1), 0 0 60px rgba(212, 160, 23, 0.5)" },
        },
      },
      boxShadow: {
        gold: "0 4px 24px rgba(212, 160, 23, 0.3)",
        "gold-lg": "0 8px 40px rgba(212, 160, 23, 0.4)",
        festive: "0 4px 24px rgba(139, 0, 0, 0.3)",
        "festive-lg": "0 8px 40px rgba(139, 0, 0, 0.4)",
      },
    },
  },
  plugins: [],
};
