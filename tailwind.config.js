/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        neon: {
          blue: "#00f3ff",
          pink: "#ff00ff",
          purple: "#bc13fe",
          green: "#0aff00",
          yellow: "#faff00",
        },
        dark: {
          bg: "#050505",
          card: "#101010",
          surface: "#1a1a1a",
        },
      },
      fontFamily: {
        orbitron: ["Orbitron", "sans-serif"],
        exo: ["Exo 2", "sans-serif"],
      },
      boxShadow: {
        "neon-blue": "0 0 10px #00f3ff, 0 0 20px #00f3ff",
        "neon-pink": "0 0 10px #ff00ff, 0 0 20px #ff00ff",
      },
    },
  },
  plugins: [],
};
