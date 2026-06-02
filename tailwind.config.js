/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      keyframes: {
        'fade-in-up': {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        'fade-in': {
          '0%': {
            opacity: '0'
          },
          '100%': {
            opacity: '1'
          }
        },
        'pulse-subtle': {
          '0%, 100%': {
            opacity: 1
          },
          '50%': {
            opacity: 0.8
          }
        },
        'bounce-subtle': {
          '0%, 100%': {
            transform: 'translateY(0)'
          },
          '50%': {
            transform: 'translateY(-5px)'
          }
        },
        ellipsis: {
          '0%': { content: '.' },
          '33%': { content: '..' },
          '66%': { content: '...' },
          '100%': { content: '.' }
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        }
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.5s ease-out',
        'fade-in': 'fade-in 0.5s ease-out',
        'pulse-subtle': 'pulse-subtle 2s ease-in-out infinite',
        'bounce-subtle': 'bounce-subtle 3s ease-in-out infinite',
        'spin-fast': 'spin 0.8s linear infinite',
        'ellipsis': 'ellipsis 1.4s infinite',
        'marquee': 'marquee 34s linear infinite',
        'gradient-shift': 'gradient-shift 6s ease infinite',
      },
      colors: {
        accent: {
          DEFAULT: '#22D3EE',
          foreground: '#03151A',
          glow: 'rgb(34 211 238 / 0.5)',
        },
        amber: {
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706'
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 40px -10px rgb(34 211 238 / 0.5)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      utilities: {
        '.scrollbar-hide': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        }
      }
    },
  },
  plugins: [],
  variants: {
    extend: {},
  },
  corePlugins: {
    // ... other core plugins
  },
} 
