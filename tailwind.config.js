/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0b',
        primary: '#00f3ff',
        secondary: '#ff00d9',
        pianoWhite: '#ffffff',
        pianoBlack: '#1a1a1a',
      },
      boxShadow: {
        'neon': '0 0 10px #00f3ff, 0 0 20px #00f3ff',
        'pink': '0 0 10px #ff00d9, 0 0 20px #ff00d9',
      }
    },
  },
  plugins: [],
}
