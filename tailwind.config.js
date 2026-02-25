/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Dark blue tones (matching main website header)
        njord: {
          dark: '#1E3A56',
          DEFAULT: '#2A4A6B',
          light: '#3D5F82',
          muted: '#5B7A9A',
          pale: '#E8EEF4',
          subtle: '#F4F7FA',
        },
        // Orange-brown accent (matching main website CTA)
        accent: {
          DEFAULT: '#d97706',
          hover: '#b45309',
          light: '#f59e0b',
          pale: '#FEF3E2',
        },
        // Keep primary for compatibility
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgb(30 58 86 / 0.06), 0 1px 2px -1px rgb(30 58 86 / 0.06)',
        'card-hover': '0 4px 6px -1px rgb(30 58 86 / 0.08), 0 2px 4px -2px rgb(30 58 86 / 0.06)',
      },
    },
  },
  plugins: [],
}

