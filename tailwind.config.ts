import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // Dark tech backgrounds
        cosmos: {
          950: '#06060E',
          900: '#0A0B1A',
          800: '#0E1025',
          700: '#141830',
          600: '#1A1F3D',
        },
        // Electric blue accent
        electric: {
          50: '#E8F0FE',
          100: '#C5DAFC',
          200: '#9EC3FA',
          300: '#6BA5F7',
          400: '#3B82F6',
          500: '#2563EB',
          600: '#1D4ED8',
        },
        // Purple glow accent
        plasma: {
          50: '#F3E8FF',
          100: '#E2CDFC',
          200: '#C9A0FA',
          300: '#A855F7',
          400: '#9333EA',
          500: '#7C3AED',
          600: '#6D28D9',
        },
        // Cyan neon
        neon: {
          50: '#ECFEFF',
          100: '#CFFAFE',
          200: '#A5F3FC',
          300: '#67E8F9',
          400: '#22D3EE',
          500: '#06B6D4',
          600: '#0891B2',
        },
        // Surface / glass
        surface: {
          glass: 'rgba(255,255,255,0.05)',
          card: 'rgba(255,255,255,0.06)',
          hover: 'rgba(255,255,255,0.08)',
          border: 'rgba(255,255,255,0.08)',
        },
        // White with opacity support
        white: {
          DEFAULT: '#FFFFFF',
          5: 'rgba(255,255,255,0.05)',
          8: 'rgba(255,255,255,0.08)',
          10: 'rgba(255,255,255,0.10)',
          15: 'rgba(255,255,255,0.15)',
          20: 'rgba(255,255,255,0.20)',
        },
        // Text
        ink: {
          white: '#F1F5F9',
          gray: '#94A3B8',
          dim: '#64748B',
        },
        success: {
          DEFAULT: '#22D3EE',
          light: 'rgba(34,211,238,0.15)',
        },
        danger: {
          DEFAULT: '#F87171',
          light: 'rgba(248,113,113,0.15)',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Noto Serif TC', 'serif'],
        sans: ['Inter', 'Noto Sans TC', 'sans-serif'],
      },
      borderRadius: {
        card: '16px',
      },
      boxShadow: {
        glow: '0 0 20px rgba(59,130,246,0.15)',
        'glow-lg': '0 0 40px rgba(59,130,246,0.2), 0 0 80px rgba(124,58,237,0.1)',
        card: '0 1px 2px rgba(0,0,0,0.3), 0 0 1px rgba(255,255,255,0.05)',
        elevated: '0 8px 32px rgba(0,0,0,0.4), 0 0 1px rgba(255,255,255,0.08)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'grid-pattern': 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid': '60px 60px',
      },
    },
  },
  plugins: [],
};

export default config;
