/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#f5f8f5',
        panel: '#ffffff',
        elevated: '#edf2ed',
        line: '#d9e3da',
        ink: '#17251c',
        muted: '#526258',
        subtle: '#748278',
        brand: {
          DEFAULT: '#18834f',
          hover: '#116a40',
        },
        health: {
          dense: '#3ecf8e',
          moderate: '#a3e635',
          stressed: '#facc15',
          degraded: '#fb923c',
          deforested: '#ef4444',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Source Code Pro', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '6px',
        md: '6px',
        lg: '8px',
      },
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'translateY(-4px) scale(0.985)' },
          to: { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        slideIn: {
          from: { opacity: '0', transform: 'translateX(16px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.8s infinite',
        'fade-in': 'fadeIn 150ms ease-out',
        'scale-in': 'scaleIn 160ms ease-out',
        'slide-in': 'slideIn 180ms ease-out',
      },
    },
  },
  plugins: [],
}
