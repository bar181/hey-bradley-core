/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        hb: {
          bg: '#0f172a',
          surface: '#1e293b',
          'surface-hover': '#334155',
          border: '#334155',
          'border-selected': '#3b82f6',
          'text-primary': '#f8fafc',
          'text-secondary': '#94a3b8',
          'text-muted': '#64748b',
          accent: '#3b82f6',
          'accent-light': 'rgba(59, 130, 246, 0.15)',
          'accent-hover': '#2563eb',
          success: '#22c55e',
          warning: '#f59e0b',
          error: '#ef4444',
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
