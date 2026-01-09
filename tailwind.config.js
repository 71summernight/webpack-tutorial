/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/**/*.html'],
  theme: {
    extend: {
      colors: {
        bg: '#000000',
        primary: '#FF0358',
      },
      backgroundImage: {
        'gradient-radial-center': 'radial-gradient(ellipse at center, rgba(29,31,29,0) 0%, rgba(29,31,29,1) 70%)',
      },
    },
  },
  plugins: [],
};
