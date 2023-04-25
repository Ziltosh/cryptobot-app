/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./src/**/*.{ts,tsx,js,jsx}",
    "../../packages/ui/src/**/*.{ts,tsx,js,jsx}", // Pour aller chercher les composants dans le package ui
  ],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Exo 2'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
