/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: { DEFAULT: '#f4efe4', 2: '#ebe5d6', 3: '#e1dac7' },
        card: '#fffdf8',
        ink: { DEFAULT: '#14110f', 2: '#3d3833', 3: '#6b645a' },
        line: { DEFAULT: '#d9d1bf', strong: '#b9af98' },
        save: { DEFAULT: '#0b6b43', soft: '#dcf1e4', ink: '#07452b' },
        tag: { DEFAULT: '#ffd84d', soft: '#fff1b8' },
        alarm: { DEFAULT: '#c4301c', soft: '#fbe3dd' },
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 0 rgba(20,17,15,0.04), 0 8px 24px -12px rgba(20,17,15,0.18)',
        lift: '0 1px 0 rgba(20,17,15,0.04), 0 18px 36px -14px rgba(20,17,15,0.28)',
        pop: '4px 4px 0 0 #14110f',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
      keyframes: {
        rise: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        rise: 'rise .35s ease-out both',
        shimmer: 'shimmer 1.6s linear infinite',
      },
    },
  },
  plugins: [],
};
