/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        suraksha: {
          bg: '#F6F1E7',
          surface: '#FFFFFF',
          alt: '#EFE7DA',
          border: '#E5DDD1',
          borderStrong: '#C8BEAF',
          charcoal: '#1C1C1E',
          secondary: '#4A4A4A',
          muted: '#7A7A7A',
          blue: '#1B4965',
          blueDark: '#0F2942',
          orange: '#E05A00',
          orangeLight: '#FFF0E6',
          green: '#2E8B57',
          greenLight: '#E6F4EC',
          amber: '#D4882A',
          amberLight: '#FDF3E3',
        },
        gov: {
          50: '#f0f5fa',
          100: '#e1ecf4',
          200: '#c3d9e9',
          300: '#95bed9',
          400: '#5f9ec6',
          500: '#3a81b1',
          600: '#286795',
          700: '#215278',
          800: '#1d4564',
          900: '#1c3b53',
          950: '#122536',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace']
      }
    },
  },
  plugins: [],
}
