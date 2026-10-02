/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        noir: {
          950: '#080809',
          900: '#0F0F12',
          850: '#15151A',
          800: '#1C1C22',
          700: '#2A2A33',
          600: '#3D3D49',
          500: '#545464',
          400: '#757588',
        },
        silk: {
          50: '#FDFCFB',
          100: '#FAF8F5',
          200: '#F4EFEB',
          300: '#E9E2D8',
          400: '#D6CDC0',
          500: '#B8ABA0',
        },
        gold: {
          300: '#E9D19E',
          400: '#D8B873',
          500: '#C5A059',
          600: '#A9833D',
          700: '#876527',
        },
        copper: {
          400: '#C99380',
          500: '#B47863',
        },
        slateLuxe: {
          800: '#181A20',
          700: '#22252E',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'luxury': '0 20px 40px -15px rgba(0, 0, 0, 0.4), 0 0 1px 1px rgba(255, 255, 255, 0.05)',
        'luxury-glow': '0 0 30px -5px rgba(197, 160, 89, 0.25)',
        'card-soft': '0 10px 30px -10px rgba(0, 0, 0, 0.08)',
      },
      animation: {
        'fade-in': 'fadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-subtle': 'pulseSubtle 3s infinite ease-in-out',
        'shimmer': 'shimmer 2.2s infinite linear',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.02)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
}
