export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lux: '#EAB308',
        'lux-dim': '#CA8A04',
        'lux-dark': '#854D0E',
        gray: {
          950: '#0A0A0A',
          900: '#121212',
          850: '#1E1E1E',
          800: '#27272A',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['Inter', 'sans-serif'],
      }
    }
  },
  plugins: [],
}
