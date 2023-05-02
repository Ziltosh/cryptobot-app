/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{ts,tsx,js,jsx}',
  ],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    extend: {

    },
  },
  plugins: [],
  preset: '../../tailwind.workspace.config.cjs',
}
