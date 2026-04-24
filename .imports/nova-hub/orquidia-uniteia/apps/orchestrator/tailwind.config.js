/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Uniteia RED Theme - NO blue
        primary: {
          DEFAULT: '#dc2626', // red-600
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444', // red-500 (accent)
          600: '#dc2626', // red-600 (brand/primary)
          700: '#b91c1c', // red-700 (accent dark)
          800: '#991b1b',
          900: '#7f1d1d',
          950: '#450a0a',
        },
        accent: {
          DEFAULT: '#ef4444', // red-500
          dark: '#b91c1c',   // red-700
        },
        background: {
          DEFAULT: '#f5f5f4', // stone-100 (warm gray)
          card: '#fafaf9',    // stone-50
          elevated: '#ffffff',
        },
        surface: {
          DEFAULT: '#e7e5e4', // stone-200
          hover: '#d6d3d1',   // stone-300
        },
        success: {
          DEFAULT: '#16a34a', // green-600
          light: '#bbf7d0',
          dark: '#166534',
        },
        warning: {
          DEFAULT: '#d97706', // amber-600
          light: '#fef3c7',
          dark: '#92400e',
        },
        error: {
          DEFAULT: '#dc2626', // red-600
          light: '#fee2e2',
          dark: '#991b1b',
        },
        text: {
          primary: '#1c1917',   // stone-900
          secondary: '#57534e', // stone-600
          muted: '#78716c',     // stone-500
          inverse: '#fafaf9',   // stone-50
        },
        border: {
          DEFAULT: '#d6d3d1', // stone-300
          light: '#e7e5e4',   // stone-200
          dark: '#a8a29e',    // stone-400
        },
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
