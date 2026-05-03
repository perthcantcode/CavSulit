/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html','./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cav: {
          bg: '#F6F5F0',
          green: {
            dark:    '#1B4332',
            DEFAULT: '#2D6A4F',
            light:   '#40916C',
            accent:  '#52B788',
            vibrant: '#4ADE80',
          },
          text: { dark: '#081C15', muted: '#4B5563' }
        }
      },
      fontFamily: {
        sans:    ['"Plus Jakarta Sans"', 'sans-serif'],
        display: ['"Outfit"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
