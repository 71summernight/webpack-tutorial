/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/**/*.html'],
  theme: {
    extend: {
      colors: {
        bg: '#000000',
        primary: '#FF0358',
      },
    },
  },
  plugins: [],
};
