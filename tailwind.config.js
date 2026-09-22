/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0B0B0B',
          50: '#F5F5F5',
          100: '#E5E5E5',
          200: '#C7C7C7',
          400: '#6B6B6B',
          600: '#333333',
          800: '#161616',
          900: '#0B0B0B',
        },
        gold: {
          DEFAULT: '#D4A64A',
          50: '#FBF6EB',
          100: '#F3E4C2',
          300: '#E2C07E',
          500: '#D4A64A',
          600: '#B98B32',
          700: '#8E6A25',
        },
        wine: {
          DEFAULT: '#A30D1D',
          50: '#FBEAEC',
          400: '#C21F31',
          500: '#A30D1D',
          600: '#830A17',
          700: '#650812',
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        widest2: '.28em',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(11,11,11,0.04), 0 8px 24px -12px rgba(11,11,11,0.15)',
        gold: '0 0 0 1px rgba(212,166,74,0.4)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
    },
  },
  plugins: [],
}
