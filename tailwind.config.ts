/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // shadcn/ui CSS variable colors
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        destructive: {
          DEFAULT: 'var(--destructive)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },

        // Hey Bradley UI chrome — modern dark with violet accent
        hb: {
          bg: '#09090b',
          surface: '#18181b',
          'surface-hover': '#27272a',
          border: '#27272a',
          'border-selected': '#8b5cf6',
          'text-primary': '#fafafa',
          'text-secondary': '#a1a1aa',
          'text-muted': '#71717a',
          accent: '#8b5cf6',
          'accent-light': 'rgba(139, 92, 246, 0.12)',
          'accent-hover': '#7c3aed',
          success: '#22c55e',
          warning: '#f59e0b',
          error: '#ef4444',
          'listen-bg': '#09090b',
          'listen-orb': '#ef4444',
        },

        // Theme preview colors (CSS custom properties set by theme applicator)
        'theme-bg': 'var(--theme-bg, #0a0a1a)',
        'theme-surface': 'var(--theme-surface, #12122a)',
        'theme-text': 'var(--theme-text, #f8fafc)',
        'theme-muted': 'var(--theme-muted, #94a3b8)',
        'theme-accent': 'var(--theme-accent, #6366f1)',
        'theme-accent-secondary': 'var(--theme-accent-secondary, #818cf8)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
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
  plugins: [require('tailwindcss-animate')],
}
