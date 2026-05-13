import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#F8F8F7',
          100: '#F0EDE8',
          200: '#E0DACF',
          300: '#C8BFAF',
          400: '#A8987D',
          500: '#8F7B5C',
        },
        brown: {
          50: '#E8E3DA',
          100: '#D0C8B8',
          200: '#A89B85',
          300: '#80705A',
          400: '#5C4E3A',
          500: '#4A3F2F',
          600: '#34322D',
          700: '#2A2824',
          800: '#1F1E1A',
          900: '#1A1A19',
        },
        amber: {
          50: '#FFF5E6',
          100: '#FFE0B3',
          200: '#FFC280',
          300: '#FFA54D',
          400: '#DD7400',
          500: '#B85E00',
          600: '#8C4800',
        },
        surface: {
          DEFAULT: '#F8F8F7',
          card: '#FFFFFF',
          hover: '#F0EDE8',
        },
        success: {
          DEFAULT: '#00C758',
          light: '#E6F9ED',
        },
        danger: {
          DEFAULT: '#DC4444',
          light: '#FDE8E8',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Noto Serif TC', 'serif'],
        sans: ['Noto Sans TC', 'sans-serif'],
      },
      borderRadius: {
        card: '12px',
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        elevated: '0 4px 12px rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
};

export default config;
