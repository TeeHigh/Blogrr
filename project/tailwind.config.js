/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#163172',
        'primary-light': '#2d4a8d', // lighten(#163172, 10%)
        
        secondary: '#639fab',
        'secondary-light': '#78b1bd', // lighten(#639fab, 10%)
        
        accent: '#bbcde5',
        'accent-light': '#ccd9ed', // lighten(#bbcde5, 10%)
        
        'dark-grey': '#444444',
        'dark-grey-light': '#5e5e5e', // lighten(#444444, 10%)
        
        cancel: '#e63946',
        'cancel-light': '#f07a82', // lighten(#e63946, 20%)
        
        success: '#22c55e',
        'success-light': '#4ade80', // lighten(#22c55e, 20%)

        text: '#333333',
        'light-grey': '#f8f8f8',
        white: '#ffffff',
      },
      fontFamily: {
        base: ['Arial', 'sans-serif'], // For $font-stack
      },
    },
  },
  plugins: [],
};
