/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#0F172A', 50: '#f8fafc', 500: '#0F172A', 600: '#0a1120' },
        accent: { DEFAULT: '#3B82F6', 500: '#3B82F6', 600: '#2563EB' },
        secondary: { DEFAULT: '#F59E0B', 500: '#F59E0B' },
      },
      fontFamily: { sans: ['Inter', 'sans-serif'] },
    },
  },
  plugins: [],
};
