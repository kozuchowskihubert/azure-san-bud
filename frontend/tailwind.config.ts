import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class', // Enable dark mode with class strategy
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        heading: ['var(--font-montserrat)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
      },
      colors: {
        // Green and Orange Theme with Dark Mode Support
        primary: {
          DEFAULT: '#16a34a', // Green 600
          light: '#22c55e',   // Green 500
          dark: '#15803d',    // Green 700
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
        },
        accent: {
          DEFAULT: '#f97316', // Orange 600
          light: '#fb923c',   // Orange 400
          dark: '#ea580c',    // Orange 700
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        secondary: {
          DEFAULT: '#10b981', // Emerald 500
          light: '#34d399',   // Emerald 400
          dark: '#1E6B94',
        },
        neutral: {
          DEFAULT: '#F8F9FA',
          light: '#FFFFFF',
          dark: '#E9ECEF',
          50: '#FFFFFF',
          100: '#F8F9FA',
          200: '#E9ECEF',
          300: '#DEE2E6',
          400: '#CED4DA',
          500: '#ADB5BD',
          600: '#6C757D',
          700: '#495057',
          800: '#343A40',
          900: '#212529',
        },
        success: {
          DEFAULT: '#28A745',
          light: '#5FD77F',
          dark: '#1E7B34',
        },
        warning: {
          DEFAULT: '#FFC107',
          light: '#FFD54F',
          dark: '#FFA000',
        },
        danger: {
          DEFAULT: '#DC3545',
          light: '#E57373',
          dark: '#C62828',
        },
        sanbud: {
          // Direct brand colors from logo
          blue: '#0A4B6E',
          'blue-light': '#1A6B9E',
          'blue-dark': '#083A56',
          navy: '#003D5B',
          cyan: '#00A3E0',
        },
        haos: {
          // HAOS platform orange accents
          orange: '#FF8C42',
          'orange-light': '#FFB380',
          'orange-dark': '#E67A2E',
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #0A4B6E 0%, #1A6B9E 100%)',
        'gradient-accent': 'linear-gradient(135deg, #FF8C42 0%, #E67A2E 100%)',
        'gradient-hero': 'linear-gradient(135deg, #0A4B6E 0%, #2C87B8 50%, #FF8C42 100%)',
        'gradient-radial': 'radial-gradient(circle, var(--tw-gradient-stops))',
      },
      boxShadow: {
        'primary': '0 4px 14px 0 rgba(10, 75, 110, 0.25)',
        'accent': '0 4px 14px 0 rgba(255, 140, 66, 0.25)',
        'blue': '0 10px 40px -10px rgba(10, 75, 110, 0.3)',
        'orange': '0 10px 40px -10px rgba(255, 140, 66, 0.3)',
        'card': '0 2px 8px 0 rgba(0, 0, 0, 0.08)',
        'card-hover': '0 8px 24px 0 rgba(0, 0, 0, 0.12)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-in-out',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'slide-left': 'slideLeft 0.5s ease-out',
        'slide-right': 'slideRight 0.5s ease-out',
        'scale-in': 'scaleIn 0.4s ease-out',
        'bounce-soft': 'bounceSoft 2s infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(30px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-30px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}
export default config
