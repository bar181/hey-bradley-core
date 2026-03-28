/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        hb: {
          bg: '#faf8f5',
          surface: '#f5f0eb',
          'surface-hover': '#efe8e0',
          border: '#e8e0d8',
          'border-selected': '#e8772e',
          'text-primary': '#2d1f12',
          'text-secondary': '#8a7a6d',
          'text-muted': '#b5a99d',
          accent: '#e8772e',
          'accent-light': '#fce8d8',
          'accent-hover': '#d46820',
          success: '#4a9d6e',
          warning: '#d4a12e',
          error: '#c44a4a',
          'listen-bg': '#0a0a0f',
          'listen-orb': '#ef4444',
        },
      },
      fontFamily: {
        ui: ['DM Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'SF Mono', 'monospace'],
      },
      animation: {
        'orb-pulse': 'orbPulse 2s ease-in-out infinite',
        'orb-breathe': 'orbBreathe 4s ease-in-out infinite',
        'orb-active': 'orbActive 1.2s ease-in-out infinite',
      },
      keyframes: {
        orbPulse: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
        },
        orbBreathe: {
          '0%, 100%': { opacity: '0.1' },
          '50%': { opacity: '0.2' },
        },
        orbActive: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.3)' },
        },
      },
    },
  },
  plugins: [],
}
