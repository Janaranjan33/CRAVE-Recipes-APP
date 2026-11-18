/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Georgia", "serif"],
      },
      colors: {
        cream: "#fffaf4",
        ink: "#24231f",
        tomato: "#e85d3f",
        sage: "#71866a",
      },
      boxShadow: {
        soft: "0 14px 40px rgba(48, 38, 25, 0.08)",
      },
    },
  },
  plugins: [],
};