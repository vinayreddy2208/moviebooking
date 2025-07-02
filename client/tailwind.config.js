/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#f24c62',
      },
      dropShadow: {
        'custom': '2px 4px 6px rgba(255, 0, 0, 0.4)'
      }
    },
  },
  plugins: [],
}

