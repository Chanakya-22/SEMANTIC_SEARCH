/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",        // Scans the current directory
    "./src/**/*.{js,ts,jsx,tsx}", // Scans the src folder if you move them later
  ],
  theme: {
    extend: {
      colors: {
        space: '#130805',
        gold: '#f8c869',
      },
      fontFamily: {
        sans: ['"Inter"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}