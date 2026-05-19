/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark theme backgrounds
        dark: {
          bg: '#0F1419',
          card: '#1A1F2E',
          border: '#2A2F3E',
        },
        // Primary: Orange/Gold (Retro gaming)
        primary: {
          50: '#fff8f0',
          100: '#ffe8cc',
          200: '#ffd699',
          300: '#ffc366',
          400: '#ffb133',
          500: '#FF8C00',
          600: '#E67E00',
          700: '#CC7000',
          800: '#B26200',
          900: '#995400',
          950: '#663800',
        },
        // Secondary: Burgundy/Red
        secondary: {
          50: '#fef2f2',
          100: '#fde8e8',
          200: '#fbd5d5',
          300: '#f8a8a8',
          400: '#f27b7b',
          500: '#D32F2F',
          600: '#C41C3B',
          700: '#A91D3A',
          800: '#8B1538',
          900: '#6F0F33',
          950: '#4a0620',
        },
        // Success: Green/Teal
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        // Warning: Orange variants
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
        // Danger: Red
        danger: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          950: '#450a0a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Montserrat', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'bounce-slow': 'bounce 3s infinite',
        'pulse-glow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        'neon': '0 0 10px rgba(255, 140, 0, 0.5)',
        'neon-lg': '0 0 20px rgba(255, 140, 0, 0.7)',
      },
    },
  },
  plugins: [],
}