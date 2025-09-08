/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './app/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // コーヒーテーマカラー
        coffee: {
          primary: '#3C2415',
          'primary-dark': '#2E1A0F',
          'primary-light': '#5D4037',
          accent: '#D4AF37',
          'accent-dark': '#B8860B',
          'accent-light': '#F4E4BC',
          'gradient-start': '#F5E6D3',
          'gradient-mid': '#E6D7C3',
          'gradient-end': '#8B4513',
          background: '#F5E6D3',
        },
      },
      fontFamily: {
        serif: ['serif'],
        mono: ['monospace'],
      },
    },
  },
  plugins: [],
};
