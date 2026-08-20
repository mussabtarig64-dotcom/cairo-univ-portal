/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        eikra: {
          navy: '#1d2a45',
          navySecondary: '#243454',
          gold: '#f0c23d',
          goldHover: '#e0b32f',
          goldSecondary: '#fff2ce',
          text: '#ffffff',
          textDark: '#444444',
          light: '#f1f1f1',
        }
      },
      fontFamily: {
        cairo: ['Cairo', 'sans-serif'],
      },
    },
  },
  plugins: [],
}