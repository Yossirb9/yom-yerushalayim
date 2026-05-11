/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
        body: ['VT323', 'Heebo', 'monospace'],
        heebo: ['Heebo', 'sans-serif'],
        title: ['"Secular One"', 'Rubik', 'Heebo', 'sans-serif'],
        rubik: ['Rubik', 'Heebo', 'sans-serif'],
      },
      colors: {
        gbc: {
          // Game Boy Color olive-green base
          darkest: '#0f380f',
          dark: '#306230',
          mid: '#8bac0f',
          light: '#9bbc0f',
          // accents
          cream: '#f7f5e6',
          frame: '#202020',
          red: '#d04020',
          blue: '#3070a0',
          yellow: '#f0c040',
          pink: '#f0a0c0',
          skin: '#f8d098',
          shadow: '#283818',
        },
      },
      animation: {
        'blink-arrow': 'blink 0.6s step-end infinite',
      },
      keyframes: {
        blink: {
          '0%, 50%': { opacity: '1' },
          '50.01%, 100%': { opacity: '0' },
        },
      },
    },
  },
  plugins: [],
};
